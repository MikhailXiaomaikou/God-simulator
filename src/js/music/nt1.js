/* ─────────────────────────────────────────────────────────────
 * music/nt1.js —— 新约各卷的乐曲（第一批）：四福音
 *                 道成肉身 · 受洗 · 登山宝训 · 神迹 · 比喻 · 生命的光 · 登山变像 · 最后的晚餐 · 十字架 · 复活
 *
 * 给下一位作曲者（写 js/music/nt2.js、nt3.js 的人）：
 *   · 写法仍是 js/music/ot1.js 开头那一套（GS.audio.music(id, spec)：pad.groups · mix · scale · motif · motif2），仍然全在 A 上，
 *     响度仍照那里的规矩（每组增益之和约 1.0–1.3，根音 0.35–0.5，越高越轻）——新约与旧约是同一首曲子、同一个响度。
 *   · 新约的色彩：旧约是旷野、殿与先知；四福音是加利利的湖、灯、渔夫、马槽的夜——更近、更暖、更亮：乐垫多在 A2 以上，
 *     'flute' 声部作灯光，合唱只给天上的时刻（天使、天开了、登山变像、「愿你们平安」、差遣）。
 *   · 圣子的主题 theme(a, g, p, {...})：创世记第六日人的主题（A4 C#5 E5 F#5 E5 C#5 A4）——道成了肉身，神就唱人的歌。
 *     马槽里是摇篮曲（rock），天开时在高处，十字架上是小调、用弓弦慢慢唱完（minor, wave:'bowed'），
 *     母亲在十字架下听见的是伯利恒的那支摇篮曲变成小调，复活的园子里它完整地回来并升上八度（up）。
 *   · 本文件按「经文」读光景（因为写本文件时各幕还在写，程度的名字还不知道）：本幕刚成就的那一句的 ref
 *     （'路加福音 2:14'，其次是它 verse 里的 ref）落在哪一段（score() 的 secs：'lk 2:13-14' 'jn 11' 'mt 27:57-66' 这样的写法，
 *     窄的段先配），那一段就是此刻的乐色；配不上的，按本幕讲到几成退回 order 里的次序（不往回走）。say 里的正则先配话语本身。
 *     幕的作者怎样挑句、怎样排序都对得上。天气与夜（gloom storm gale night）压在经文的乐色之上（adj）：
 *     湖上的风暴、十字架上遍地的黑暗。以后各幕有了自己的程度，也可以在 adj 里读它们。
 *   · cue：一句话成就之后 cue[0] 秒，奏一次只属于这一句的乐句（「成了」之后的主题、「住了吧！静了吧！」之后的大平静）；
 *     motif2 每一两秒巡看一次，所以不必等主乐句的间隔；cue 前后主乐句自动让开（hush 秒）。
 *   · where(id)：{ k 已成就几句, n 本幕几句, sec 此刻的一段, seen 已经过的各段, x 这一句的经文 }；since(id)：这一句成就了几秒。
 *   · 检查：node --check；scratchpad/snd/audiowalk.js <id>（errs 必须为空）；capture.js + wavstat.js 量真实的输出
 *     （峰值 < 0.98，没有爆音，响度与旧约的一卷相当）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  if (!GS || !GS.audio || !GS.audio.music) return;
  const music = GS.audio.music, W = GS.W;
  const cl = x => (x > 1 ? 1 : x > 0 ? x : 0);
  const sm = (a, b, x) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const max = Math.max, min = Math.min;
  // 按优先次序分配：前面的组先取（分量 × 余下的），最后剩下的归底组；和恒为 1
  function stack(order, base) {
    const g = {};
    let rem = 1;
    for (const [k, w] of order) { const x = cl(w) * rem; g[k] = (g[k] || 0) + x; rem -= x; }
    g[base] = (g[base] || 0) + rem;
    return g;
  }
  const gapOf = r => (typeof r === 'number' && isFinite(r) ? r : Array.isArray(r) ? r[0] + Math.random() * (r[1] - r[0]) : 6);

  // ── 经文 → 光景 ─────────────────────────────────────────────
  const GOS = { 马太福音: 'mt', 马可福音: 'mk', 路加福音: 'lk', 约翰福音: 'jn' }, BOOK = { 40: 'mt', 41: 'mk', 42: 'lk', 43: 'jn' };
  const REF = /(马太福音|马可福音|路加福音|约翰福音)\s*(\d+)\s*[:：]\s*(\d+)/, SHORT = /^\s*(\d+)\s*[:：]\s*(\d+)/;
  // 'lk 2:14' 的内部写法 [书, 章×1000+节]；本幕第一卷书的经文只写 '3:17'（不带书名）——用 def 补上
  function parse(s, def) {
    if (typeof s !== 'string') return null;
    const m = REF.exec(s);
    if (m) return [GOS[m[1]], +m[2] * 1000 + +m[3]];
    const q = def ? SHORT.exec(s) : null;
    return q ? [def, +q[1] * 1000 + +q[2]] : null;
  }
  // 'lk 2' · 'lk 2:8' · 'lk 2:8-20' · 'lk 2-3' · 'lk 2:41-3:2' → [书, 起, 止]
  function span(s) {
    const m = /^[!~]?(mt|mk|lk|jn)\s+(\d+)(?::(\d+))?(?:-(\d+)(?::(\d+))?)?$/.exec(s);
    if (!m) return null;
    const c0 = +m[2], v0 = m[3] ? +m[3] : 1;
    let c1 = c0, v1 = m[3] ? v0 : 999;
    if (m[4] != null) {
      if (m[5] != null) { c1 = +m[4]; v1 = +m[5]; } else if (m[3]) v1 = +m[4]; else { c1 = +m[4]; v1 = 999; }
    }
    return [m[1], c0 * 1000 + v0, c1 * 1000 + v1];
  }
  const inSpan = (x, s) => { const p = span(s); return !!(x && p && x[0] === p[0] && x[1] >= p[1] && x[1] <= p[2]); };
  function refsOf(st) {
    const out = [];
    if (!st) return out;
    if (st.ref) out.push(st.ref);
    const v = st.verse;
    if (Array.isArray(v)) { for (const y of v) if (y && y.ref) out.push(y.ref); } else if (v && v.ref) out.push(v.ref);
    return out;
  }
  const PLAN = {};
  // 配一句话：先配话语本身（say），再按三等配经文——'!' 的段只要这一句的任何一处经文落在里面就是它（天兵天使）；
  // 寻常的段先看话语的 ref、再看 verse 的 ref；'~' 的段最弱，别的都配不上时才用（道成肉身里约翰福音的序言配着路加的故事）
  function match(P, st, def) {
    if (!st) return null;
    const u = typeof st.utter === 'string' ? st.utter : '';
    for (const [re, s] of P.say) if (re.test(u)) return s;
    const xs = refsOf(st).map(r => parse(r, def)).filter(Boolean);
    for (const tier of [2, 1, 0]) {
      for (const x of xs) for (const [b, lo, hi, s, tr] of P.rules) if (tr === tier && b === x[0] && x[1] >= lo && x[1] <= hi) return s;
    }
    return null;
  }
  // 本幕此刻讲到哪里（按 W.stage 缓存：话语成就的那一刻才重算）
  const CACHE = {};
  function where(id) {
    const P = PLAN[id], B = GS.book, a = B && B.find ? B.find(id) : null, S = GS.story && GS.story.STAGES;
    const stage = W ? W.stage | 0 : 0, c = CACHE[id];
    if (c && c.stage === stage && c.a === a) return c;
    const n = a ? max(1, a.last - a.first + 1) : 1, k = a ? min(n, max(0, stage - a.first)) : 0;
    const def = a && a.books ? BOOK[a.books[0]] : null;
    const secs = [], ord = s => P.order.indexOf(s);
    for (let i = 0; i < max(1, k); i++) {
      const st = a && S ? S[a.first + i] : null;
      let s = match(P, st, def);
      if (!s) {                                                    // 配不上：按讲到几成，但不往回走
        s = P.order[min(P.order.length - 1, Math.floor(i / n * P.order.length))];
        if (i > 0 && ord(secs[i - 1]) > ord(s)) s = secs[i - 1];
      }
      secs.push(s);
    }
    const seen = {};
    for (let i = 0; i < k; i++) seen[secs[i]] = 1;
    const st = a && S && k > 0 ? S[a.first + k - 1] : null;
    const r = { a, n, k, stage, seen, st, sec: k === 0 ? (P.open || secs[0]) : secs[k - 1],
      x: parse(st && st.ref, def) || (refsOf(st).map(q => parse(q, def)).filter(Boolean)[0] || null), t0: (W && W.t) || 0, cue: 0, cueAt: -1e9 };
    CACHE[id] = r;
    return r;
  }
  // 这一句成就了几秒（与情节同一个钟）
  const since = id => (((W && W.t) || 0) - where(id).t0) * ((W && W.fast) || 1);
  const said = (r, re) => !!(r.st && typeof r.st.utter === 'string' && re.test(r.st.utter));
  const at = (r, ...spans) => spans.some(s => inSpan(r.x, s));

  // ── 登记一幕：secs = { 段: { g 乐垫组, sc 调式, lp 低通倍数, m 主乐句, m2 次要一层, cue: [秒, 乐句], hush } } ──
  function score(id, cfg) {
    const rules = [];
    for (const s in cfg.rules) for (const sp of cfg.rules[s]) { const p = span(sp); if (p) rules.push([p[0], p[1], p[2], s, sp[0] === '!' ? 2 : sp[0] === '~' ? 0 : 1]); }
    rules.sort((x, y) => (x[2] - x[1]) - (y[2] - y[1]));           // 窄的段先配
    PLAN[id] = { rules, say: cfg.say || [], order: cfg.order, open: cfg.open };
    const S = cfg.secs, N2 = { t: 0 }, GAIN = 1.2;                  // 新约的乐句比旧约的默认光景稀一些：每一句略响一点，整卷响度相当
    const secOf = r => S[r.sec] || S[cfg.order[0]];
    const busy = r => {
      const s = secOf(r), dt = since(id);
      if (s.cue && !r.cue && r.k > 0 && dt < s.cue[0] + 12) return true;              // 等 cue
      return ((W.t || 0) - r.cueAt) * (W.fast || 1) < (s.hush || 6);                  // cue 之后让一让
    };
    music(id, {
      weight: cfg.weight, pad: cfg.pad, gap: [10, 16], gap2: [1.2, 2],
      mix(lv, night) {
        const r = where(id), s = secOf(r);
        const o = { g: { [s.g]: 1 }, lp: cfg.pad.lp * (s.lp || 1) * (1 - 0.12 * (night || 0)), tc: 3 };
        return (cfg.adj && cfg.adj(lv, night || 0, r, o, s)) || o;
      },
      scale(lv, night) {
        const r = where(id), s = secOf(r);
        return (cfg.scale && cfg.scale(lv, night || 0, r, s)) || s.sc || 'maj';
      },
      motif(t, g, a) {
        const r = where(id), s = secOf(r), p = a.pan();
        if (busy(r)) return [3, 5];
        if (cfg.over) { const x = cfg.over(a, g, p, r, s); if (x != null) return x; }
        return s.m ? s.m(a, g * GAIN, p, r) : [14, 20];
      },
      motif2(t, g, a) {
        const r = where(id), s = secOf(r);
        if (s.cue && !r.cue) {
          const dt = since(id);
          if (r.k === 0 || dt > s.cue[0] + 12) r.cue = 1;                               // 幕首、或早已过了：不补
          else if (dt >= s.cue[0]) { r.cue = 1; r.cueAt = W.t || 0; s.cue[1](a, g * GAIN, a.pan(), r); return [1.5, 2.5]; }
          else return [0.4, 0.6];
        }
        if (t >= N2.t && s.m2) N2.t = t + gapOf(s.m2(a, g * GAIN, r));
        return [1.2, 2];
      },
    });
  }

  // ── 共用的乐句 ────────────────────────────────────────────
  // 圣子的主题：人的主题（A4 C#5 E5 F#5 E5 C#5 A4）。o: { minor, up, rock, oct, beat, wave: 'flute'|'harp'|'glass'|'bowed', at }
  const TH = { maj: ['A4', 'Cs5', 'E5', 'Fs5', 'E5', 'Cs5', 'A4'], min: ['A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4'], up: ['A4', 'Cs5', 'E5', 'Fs5', 'E5', 'Cs5', 'E5', 'A5'] };
  function theme(a, g, p, o) {
    o = o || {};
    const ns = (o.up ? TH.up : o.minor ? TH.min : TH.maj).map(n => a.semi(n, 12 * (o.oct || 0)));
    const L = ns.length, beat = o.beat || 0.45, at0 = o.at || 0;
    const dur = i => (i === L - 1 ? (o.rock ? 4 : 3) : o.rock ? (i % 2 ? 1 : 2) : i === 3 ? 1.3 : 1) * beat;
    const w = o.wave || 'flute';
    if (w === 'flute') { a.pipe(ns.map((f, i) => [f, dur(i), i === 3 ? 1.08 : 1]), { g: g * 0.5, pan: p, bright: 4, breath: 0.2, vib: 9, rev: 0.68, at: at0 }); return; }
    if (w === 'bowed') {                                     // 弓弦的一口气：连着唱，末了往下落到 A3
      const path = [];
      let tot = 0;
      ns.forEach((f, i) => { const d = dur(i); if (i) path.push([f, 0.12]); path.push([f, max(0.05, d - (i ? 0.12 : 0))]); tot += d; });
      a.note({ f: ns[0], type: 'warm', lp: 1500, path, g: g * 0.62, a: 0.5, s: max(0.2, tot - 0.5), r: 2.4, vib: [4.8, 0.004], pan: p, rev: 0.72, at: at0 });
      a.note({ f: a.hz('A2'), type: 'warm', lp: 700, g: g * 0.5, a: 1.5, s: tot, r: 3, pan: -p * 0.5, rev: 0.7, at: at0 });
      return;
    }
    let tt = at0;
    const st = ns.map((f, i) => { const x = [f, tt, g * (i === 3 ? 0.85 : 0.72), w === 'glass' ? 2.6 : 2.2]; tt += dur(i); return x; });
    a.strings(st, { wave: w === 'glass' ? 's' : 'harp', bright: w === 'glass' ? 2 : 5, d: 2.4, pan: p, spread: 0.2, rev: 0.75 });
  }
  // 天使的荣耀颂：I · II（利底亚）· I，高处无字的合唱
  function gloria(a, g, at0) {
    const o = at0 || 0, G = [1, 0.85, 0.7, 0.55, 0.4, 0.28];
    a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: G, g: g * 0.8, a: 0.6, s: 0.9, r: 1.6, at: o, pan: -0.25 });
    a.choir(['B3', 'Ds4', 'Fs4', 'B4', 'Ds5'], { gs: G, g: g * 0.72, a: 0.6, s: 0.8, r: 1.6, at: o + 2.2, pan: 0.25 });
    a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5', 'A5'], { gs: G, g: g * 0.85, a: 0.8, s: 1.6, r: 3.2, at: o + 4.3, pan: 0 });
  }
  // 阿们：IV → I
  function amen(a, g, at0) {
    a.choir(['A3', 'D4', 'Fs4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.75, a: 0.9, s: 0.8, r: 1.6, at: at0 || 0, pan: -0.2 });
    a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.8, a: 1, s: 1.4, r: 3, at: (at0 || 0) + 2.3, pan: 0.15 });
  }
  // 应答的诗篇：I · IV · I
  function psalm(a, g) {
    const I = ['A3', 'Cs4', 'E4', 'A4'], IV = ['A3', 'D4', 'Fs4', 'A4'];
    a.choir(I, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 0.7, s: 0.6, r: 1.5, pan: -0.3 });
    a.choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.8, a: 0.7, s: 0.5, r: 1.5, at: 2, pan: 0.3 });
    a.choir(I, { gs: [1, 0.8, 0.75, 0.55], g: g * 0.85, a: 0.8, s: 1, r: 2.6, at: 4, pan: 0 });
  }
  // 平安：A6/9 的合唱慢慢涨起来
  function shalom(a, g, at0) {
    a.choir(['A3', 'E4', 'Fs4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.6, 0.5, 0.35], g: g * 0.85, a: 1.8, s: 1.8, r: 3.6, at: at0 || 0, pan: 0 });
  }
  // 灯一盏一盏点起来（A 大三和弦往上，从左到右）
  function lamps(a, g, n) {
    const L = ['A4', 'Cs5', 'E5', 'A5', 'Cs6', 'E6'];
    for (let i = 0; i < n; i++) {
      const f = a.hz(L[min(L.length - 1, i)]), t0 = i * a.rnd(0.35, 0.55), p = -0.7 + 1.4 * (i + 0.5) / n;
      a.note({ f, type: 't', g: g * 0.5, a: 0.004, d: 2.2, at: t0, pan: p, rev: 0.75 });
      a.note({ f: f * 2.76, g: g * 0.05, a: 0.003, d: 0.4, at: t0, pan: p });
    }
  }
  // 一盏小灯的火苗：一声暖的拨弦
  const flame = (a, g) => a.pluck(a.pick(['A4', 'Cs5', 'E5', 'A5']), 0, g * 0.35, a.pan(), 1.4);
  // 撒种：散开的短拨，有的落在高处、有的落在低处
  function seeds(a, g, sc) {
    const n = a.rint(6, 9), ns = [];
    for (let i = 0; i < n; i++) ns.push([a.deg(sc || 'dor', 'A3', a.rint(2, 11)), i * a.rnd(0.14, 0.3), g * a.rnd(0.35, 0.6), 0.5]);
    a.strings(ns, { wave: 't', bright: 3, d: 0.5, pan: a.pan(), spread: 0.7, rev: 0.45 });
  }
  // 一串下行的玻璃般的拨弦（水）
  function flowing(a, g, sc, base) {
    const i0 = a.rint(8, 10), n = a.rint(5, 7), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'maj', base || 'A4', i0 - k), k * 0.12, g * (1 - k * 0.07), 1.8]);
    a.strings(ns, { wave: 's', bright: 2, d: 1.8, pan: a.pan(), spread: 0.35, rev: 0.75 });
  }
  // 一串上行的弦（日出、树长大、拉撒路出来）
  function rise(a, g, sc, base, n, step, o) {
    o = o || {};
    const ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc, base, (o.i0 || 0) + k), k * step, g * (0.6 + 0.35 * k / max(1, n - 1)), o.d || 2.6]);
    a.strings(ns, { wave: o.wave || 'harp', bright: o.bright || 4, d: o.d || 2.6, pan: o.pan == null ? 0 : o.pan, spread: 0.35, rev: o.rev || 0.72, at: o.at || 0 });
  }
  // 颜色涌出来（瞎子看见）：利底亚上一口气冲上去，顶上三声铃
  function bloom(a, g) {
    const ns = [];
    for (let i = 0; i < 12; i++) ns.push([a.deg('lyd', 'A3', i), i * 0.085, g * (0.4 + 0.35 * i / 11), 2.4]);
    a.strings(ns, { wave: 'harp', bright: 6, d: 2.4, spread: 0.5, rev: 0.7 });
    a.bells(['A5', 'Cs6', 'E6'], 0.16, g * 0.5, 2.8, 1.1);
  }
  // 以法大（开了吧）：一个和弦从闷住的低通里打开
  function opening(a, g) {
    a.chord(['A3', 'Cs4', 'E4', 'A4', 'Cs5'], { g: g * 0.36, type: 'soft', a: 0.9, s: 1.4, r: 2.6, lp: 240, lp2: 4200, lpT: 2.6, spread: 0.4, rev: 0.7 });
  }
  // 鸽子降下（天开了）：高处一串慢慢落下的玻璃音
  function dove(a, g) {
    a.strings(['E6', 'Cs6', 'B5', 'A5', 'Fs5', 'E5'].map((n, i) => [n, i * 0.24, g * (0.7 - i * 0.06), 2.6]), { wave: 's', bright: 2, d: 2.6, pan: 0.3, spread: 0.2, rev: 0.85 });
  }
  // 大平静：一个极轻、极慢的纯净和弦
  function stillness(a, g) {
    a.chord(['A2', 'E3', 'A3', 'Cs4', 'E4'], { type: 's', g: g * 0.3, a: 2.2, s: 2.5, r: 4, spread: 0.35, rev: 0.8 });
    a.note({ f: 'E5', g: g * 0.35, a: 0.004, d: 3.4, at: 2.4, pan: 0.2, rev: 0.85 });
  }
  // 钟（第九时、坟墓前）：非谐的分音
  function toll(a, f, g, p) {
    const F0 = a.hz(f);
    [[1, 1, 7], [2.76, 0.4, 4.2], [5.4, 0.18, 2.4], [8.93, 0.07, 1.4]].forEach(([k, gg, d]) => a.note({ f: F0 * k, g: g * gg, a: 0.006, d, pan: p, rev: 0.75 }));
  }
  // 叹息：一口气的下行，滑音（哀哭、痛哭、「不要为我哭」）
  const SIGHS = [
    [['E4', 1.1], ['D4', 0.6], ['C4', 1.3], ['B3', 0.7], ['A3', 2.2]],
    [['C4', 0.9], ['B3', 0.5], ['A3', 1.2], ['G3', 0.6], ['A3', 2]],
    [['F4', 1], ['E4', 0.7], ['D4', 0.6], ['C4', 1.1], ['B3', 0.6], ['A3', 2.2]],
    [['A4', 1.2], ['G4', 0.5], ['F4', 0.6], ['E4', 1.6]],
  ];
  const sigh = (a, g, p, k, at0) => a.pipe(SIGHS[k == null ? a.rint(0, SIGHS.length - 1) : k], { g: g * 0.5, pan: p, bend: true, bright: 3, breath: 0.4, vib: 15, vibHz: 5, rev: 0.72, at: at0 || 0 });
  // 领唱的人声（主祷文的吟诵）：line = [[音名, 秒], ...]
  function cantor(a, line, g, p, o) {
    o = o || {};
    const f0 = a.hz(line[0][0]), path = [];
    let tot = 0;
    line.forEach(([n, d], i) => { const f = a.hz(n); if (i) path.push([f, 0.07]); path.push([f, max(0.05, d - (i ? 0.07 : 0))]); tot += d; });
    a.note({ f: f0, type: o.wave || 'voice', lp: o.lp || 1400, path, g: g * (o.k || 0.5), a: 0.25, s: max(0.1, tot - 0.25), r: o.r || 1.2, vib: [5, 0.005], pan: p, rev: o.rev || 0.7 });
  }
  // 手鼓与串铃（6/8 的舞步）
  function timbrel(a, g, p, n) {
    const beat = a.rnd(0.19, 0.23);
    const P = [[0, 1], [2, 0.5], [3, 0.8], [5, 0.5], [6, 1], [8, 0.5], [9, 0.8], [10, 0.45], [11, 0.5], [12, 1]].slice(0, n || 10);
    a.knocks(P.map(([st, acc]) => {
      const heavy = acc >= 0.8;
      return [st * beat + a.rnd(-0.006, 0.006), heavy ? a.rnd(260, 340) : a.rnd(1400, 2000), heavy ? a.rnd(95, 112) : a.rnd(270, 320), g * (heavy ? 1.1 : 0.85) * acc, heavy];
    }), { q: 1.3, lp: 5000, pan: p, rev: 0.4 });
    P.filter(x => x[1] >= 0.8).forEach(([st]) => a.burst({ buf: 'white', ft: 'bandpass', f: 7400, q: 1.6, hp: 4800, g: g * 0.6, a: 0.002, d: 0.09, at: st * beat, pan: p, rev: 0.35 }));
  }
  // 筵席的舞：手鼓 + 一串快的琴
  function dance(a, g, p, sc) {
    timbrel(a, g * 0.8, p, 10);
    a.lyre('A4', a.rint(6, 8), g * 0.75, -p, sc || 'maj', { gap: 0.2 });
  }
  // 加利利的船歌：竖琴 6/8 的摇（I · vi），上面一句湖上的旋律
  function barcarolle(a, g, p) {
    const beat = a.rnd(0.22, 0.26), ns = [];
    [['A2', 'E3', 'A3', 'Cs4', 'A3', 'E3'], ['Fs2', 'Cs3', 'Fs3', 'A3', 'Fs3', 'Cs3']].forEach((bar, b) =>
      bar.forEach((n, i) => ns.push([n, (b * 6 + i) * beat, g * (i ? 0.36 : 0.55), 1.6])));
    a.pick([[['E5', 0], ['Fs5', 3], ['E5', 6], ['Cs5', 9], ['A4', 12]], [['Cs5', 0], ['E5', 3], ['Fs5', 6], ['E5', 9], ['Cs5', 12]]])
      .forEach(([n, i]) => ns.push([n, i * beat, g * 0.5, i === 12 ? 2.8 : 2]));
    ns.push(['A2', 12 * beat, g * 0.5, 2.8]);
    a.strings(ns, { wave: 'harp', bright: 5, d: 1.8, pan: p, spread: 0.3, rev: 0.6 });
  }
  // 渔夫的歌（混合利底亚的笛）
  function fisher(a, g, p) {
    a.pipe(a.pick([
      [['A4', 0.3], ['B4', 0.3], ['Cs5', 0.45], ['B4', 0.2], ['A4', 0.3], ['G4', 0.45], ['A4', 1.3]],
      [['E4', 0.3], ['A4', 0.45], ['B4', 0.3], ['G4', 0.3], ['E4', 0.45], ['D4', 0.3], ['E4', 1.2]],
    ]), { g: g * 0.48, pan: p, bright: 4, breath: 0.25, vib: 10, rev: 0.6 });
  }
  // 五个饼、两条鱼、十二个篮子
  function loaves(a, g, p) {
    const ns = [];
    ['A4', 'B4', 'Cs5', 'E5', 'Fs5'].forEach((n, i) => ns.push([n, i * 0.22, g * 0.55, 1.4]));
    ['A5', 'E5'].forEach((n, i) => ns.push([n, 1.4 + i * 0.32, g * 0.5, 1.6]));
    for (let i = 0; i < 12; i++) ns.push([a.deg('maj', 'A4', i), 2.5 + i * 0.1, g * (0.3 + 0.02 * i), 1.8]);
    a.strings(ns, { wave: 'harp', bright: 5, d: 1.6, pan: p, spread: 0.4, rev: 0.6 });
  }
  // 叩门：三声，门开了
  function knockDoor(a, g, p) {
    a.knocks([[0, 900, 150, g * 0.8, false], [0.45, 900, 150, g * 0.8, false], [0.9, 900, 150, g * 0.9, false]], { lp: 3000, pan: p, rev: 0.4 });
    a.strings(['A4', 'Cs5', 'E5', 'A5'].map((n, i) => [n, 1.8 + i * 0.12, g * 0.55, 2.6]), { wave: 's', bright: 2, d: 2.6, pan: p, spread: 0.3, rev: 0.75 });
  }
  // 钱（寡妇的两个小钱、失落的一块钱）
  function coins(a, g, n) {
    for (let i = 0; i < n; i++) {
      const f = a.hz(i % 2 ? 'E6' : 'A5'), t0 = i * 0.5;
      a.note({ f, g: g * 0.45, a: 0.002, d: 1.4, at: t0, pan: 0.2, rev: 0.6 });
      a.note({ f: f * 2.76, g: g * 0.07, a: 0.002, d: 0.25, at: t0, pan: 0.2 });
    }
  }
  // 一颗重价的珠子：一声完美的铃，长长地余响
  function pearl(a, g) {
    a.bells(['A5'], 0, g * 0.7, 5, 0);
    a.glass(g * 0.4, 2);
  }
  // 远处的兵丁（火把与兵器——只是远处的脚步）
  function march(a, g, p) {
    const hits = [];
    for (let i = 0; i < 8; i++) hits.push([i * 0.55, 280, 75, g * (i % 2 ? 0.5 : 0.75), true]);
    a.knocks(hits, { lp: 600, pan: p, rev: 0.6 });
  }
  // 沉重的脚步（往各各他的路）
  function steps(a, g, p) {
    a.knocks([0, 1.1, 2.2, 3.3].map((t0, i) => [t0, 240, 62, g * (i % 2 ? 0.45 : 0.6), true]), { lp: 420, pan: p, rev: 0.55 });
  }
  // 圣灵的气息（吹一口气、风随着意思吹）
  function breath(a, g, p) {
    a.burst({ buf: 'pink', f: 480, f2: 1500, sweep: 1.6, q: 0.9, g: g * 0.8, a: 0.7, s: 0.3, r: 1.4, pan: p, pan2: -p, rev: 0.7 });
  }
  // 黎明：玻璃般的一串从 A4 升到高处（利底亚），顶上铃
  function dawnRise(a, g) {
    rise(a, g * 0.8, 'lyd', 'A4', 9, 0.2, { wave: 's', bright: 2, d: 3 });
    a.bells(['A5', 'Cs6', 'E6'], 0.22, g * 0.55, 3.2, 1.9);
  }
  // 两条缠在一起的琴（葡萄树与枝子）
  function vine(a, g, p) {
    a.lyre('A3', a.rint(5, 6), g * 0.6, p, 'maj', { gap: 0.36 });
    a.strings([['E4', 0.18], ['Fs4', 0.54], ['A4', 0.9], ['Cs5', 1.26], ['B4', 1.62], ['A4', 2.0]].map(([n, t0], i) => [n, t0, g * 0.45, i === 5 ? 3 : 2]), { bright: 4, d: 2.2, pan: -p, spread: 0.2, rev: 0.6 });
  }

  // ══ 四福音 · 道成肉身 ════════════════════════════════════
  // 太初有道：深处的 A1 与高处几点星光（利底亚——「起初」的回声）；「道成了肉身」时，圣子的主题第一次在高处响起；
  // 天使向马利亚说话（利底亚的惊奇），马利亚的歌（笛）；伯利恒的马槽：夜里一盏灯，摇篮曲（主题，3/4 的摇）；
  // 野地的牧羊人（牧笛、星）→ 天兵天使的荣耀颂（高处无字的合唱，I · II · I）；星与博士（利底亚的星空，三声礼物的铃）；
  // 逃往埃及（Hijaz 低处——克制，只是夜路与苇笛）；殿中的孩童（伊奥尼亚，殿的风琴光）。
  score('nativity', {
    weight: { drone: 0.5, pad: 0.95 },
    pad: { lp: 1500, night: 0.1, groups: {
      word: [['A1', 's', 0.36, 0], ['E2', 'soft', 0.22, 0.1], ['A2', 's', 0.2, -0.1], ['E3', 'soft', 0.17, 0.2], ['B3', 's', 0.08, -0.3], ['Gs4', 's', 0.035, 0.35], ['Ds5', 's', 0.02, -0.45], ['A3', 'over', 0.04, 0]],
      mary: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 'soft', 0.12, 0.1], ['Cs4', 'flute', 0.15, 0.3], ['Fs4', 's', 0.07, -0.35], ['B4', 's', 0.035, 0.45]],
      stable: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['A3', 's', 0.12, 0], ['Cs4', 'soft', 0.14, -0.3], ['E4', 'flute', 0.07, 0.3], ['Fs4', 's', 0.04, 0.4], ['A4', 's', 0.03, -0.4]], pulse: [0.22, 0.16] },
      field: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.15, 0.3], ['E4', 's', 0.08, -0.4], ['Fs4', 'flute', 0.06, 0.35]],
      host: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.2, 0], ['E4', 'choir', 0.17, 0], ['A4', 'choir', 0.13, 0], ['Cs5', 'choir', 0.09, 0], ['Ds5', 's', 0.02, -0.45], ['Gs5', 's', 0.012, 0.5]],
      star: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.15], ['Cs4', 'soft', 0.16, -0.3], ['Gs4', 's', 0.065, 0.35], ['Ds5', 's', 0.03, -0.45], ['A3', 'over', 0.05, 0]],
      flight: { v: [['A1', 's', 0.36, 0], ['A2', 'soft', 0.3, -0.1], ['E3', 'soft', 0.27, 0.2], ['Bb3', 's', 0.045, -0.4], ['D4', 'soft', 0.09, 0.35], ['Cs4', 'soft', 0.07, -0.3]], pulse: [0.45, 0.16] },
      temple: [['A1', 's', 0.26, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.27, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['A2', 'over', 0.08, 0.1], ['E4', 's', 0.07, -0.4], ['A4', 's', 0.03, 0.45]],
    } },
    open: 'word',
    order: ['word', 'mary', 'song', 'stable', 'field', 'host', 'star', 'flight', 'temple'],
    rules: {
      word: ['~jn 1'],
      mary: ['lk 1:26-38', 'lk 1:5-25', 'mt 1:18-25'],
      song: ['lk 1:39-80'],
      stable: ['lk 2:1-7'],
      host: ['!lk 2:13-14'],
      field: ['lk 2:8-20'],
      temple: ['lk 2:21-52'],
      star: ['mt 2:1-12', 'mt 1:1-17'],
      flight: ['mt 2:13-23'],
    },
    secs: {
      word: { g: 'word', sc: 'lyd', lp: 1,
        m: (a, g, p) => { a.lyre('A3', a.rint(3, 4), g * 0.55, p, 'lyd', { gap: 0.5 }); return [16, 24]; },
        m2: (a, g) => { a.starPing(g * 0.7); return [2.5, 5]; },
        cue: [2.5, (a, g, p, r) => at(r, 'jn 1:14') ? theme(a, g * 0.9, p, { wave: 'glass' }) : rise(a, g * 0.7, 'lyd', 'A3', 9, 0.3, { wave: 's', bright: 2, d: 3 })] },
      mary: { g: 'mary', sc: 'lyd', lp: 1.15,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 5), g * 0.65, p, 'lyd', { gap: 0.34 }); return [13, 19]; },
        m2: (a, g) => { a.glass(g * 0.35, 1); return [6, 10]; },
        cue: [2, (a, g) => a.angelRun(g * 0.9)] },
      song: { g: 'mary', sc: 'maj', lp: 1.2,
        m: (a, g, p) => {                                      // 我心尊主为大
          a.strings(['A3', 'E4', 'A4', 'Cs5'].map((n, i) => [n, i * 0.3, g * 0.45, 2.4]), { bright: 4, d: 2.4, pan: -p, spread: 0.2, rev: 0.6 });
          a.pipe([['E4', 0.5], ['A4', 0.5], ['B4', 0.35], ['Cs5', 0.8], ['B4', 0.4], ['A4', 0.4], ['Fs4', 0.5], ['A4', 1.4]], { g: g * 0.46, pan: p, bright: 4, breath: 0.2, vib: 9, rev: 0.62, at: 0.4 });
          return [12, 17];
        } },
      stable: { g: 'stable', sc: 'maj', lp: 0.95,
        m: (a, g, p) => { if (Math.random() < 0.55) theme(a, g * 0.85, p, { rock: true, beat: 0.4 }); else a.lyre('A4', a.rint(3, 4), g * 0.55, p, 'maj', { gap: 0.4 }); return [14, 20]; },
        m2: (a, g) => { if (a.night() > 0.4) a.starPing(g * 0.6); else flame(a, g); return [3, 6]; },
        cue: [4, (a, g, p) => theme(a, g * 0.9, p, { rock: true, beat: 0.4 })] },
      field: { g: 'field', sc: 'maj', lp: 1,
        m: (a, g, p) => { a.shepherd(g * 0.9, p); return [12, 18]; },
        m2: (a, g) => { if (a.night() > 0.4) a.starPing(g * 0.7); return [1.5, 3.5]; },
        cue: [2.5, (a, g) => a.angelRun(g * 0.85)] },
      host: { g: 'host', sc: 'lyd', lp: 1.5, hush: 9,
        m: (a, g) => { gloria(a, g); return [12, 16]; },
        m2: (a, g) => { a.angelRun(g * 0.55); return [4, 7]; },
        cue: [1.5, (a, g) => gloria(a, g * 1.05)] },
      star: { g: 'star', sc: 'lyd', lp: 1.3,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 5), g * 0.6, p, 'lyd', { gap: 0.4 }); if (Math.random() < 0.5) a.bells(['A5', 'E5', 'Cs6'], 0.9, g * 0.45, 3, 1.6); return [13, 18]; },
        m2: (a, g) => { a.starPing(g * 0.8); return [0.8, 1.8]; },
        cue: [3, (a, g) => a.bells(['A5', 'E5', 'Cs6'], 0.9, g * 0.55, 3.4, 0)] },             // 黄金、乳香、没药
      flight: { g: 'flight', sc: 'hijaz', lp: 0.8,
        m: (a, g, p) => { if (Math.random() < 0.6) a.ney(g * 0.9, p); else a.bowed(a.pick(['A2', 'E3', 'D3']), g * 0.7, p); return [14, 20]; },
        m2: (a, g) => { if (a.night() > 0.5) a.starPing(g * 0.45); return [4, 8]; } },
      temple: { g: 'temple', sc: 'ion', lp: 1.15,
        m: (a, g, p) => { if (Math.random() < 0.35) psalm(a, g * 0.8); else a.lyre(a.pick(['A3', 'A4']), a.rint(4, 6), g * 0.75, p, 'ion', { gap: 0.28 }); return [13, 19]; } },
    },
    adj(lv, night, r, o, s) {
      if (r.k === 0) { o.lp *= 0.6; o.drone = 1.25; o.pad = 0.85; }            // 起初：黑暗里只有底鸣与几点光
      if (s.g === 'stable' || s.g === 'field') o.lp *= 1 - 0.15 * night;
      return o;
    },
  });

  // ══ 四福音 · 受洗 ════════════════════════════════════════
  // 约翰在旷野（没有三音的挂留带小七 A B D E G，苇笛——「预备主的道」）；约旦河（缓缓起伏的 A 加九，流水的琴）；
  // 天开了：鸽子从高处一串落下，圣子的主题，高处的合唱（利底亚）；四十昼夜的旷野：低处空心的挂留，只有很少的音——
  // 试探者只是一道冷影（gloom 时低通再合上）；天使来伺候他（玻璃音）；加利利海边呼召渔夫（竖琴的船歌、混合利底亚的渔夫之歌，
  // 「来跟从我」时笛上是主题）；迦拿的婚筵（手鼓与快琴；水变成酒——一串温暖地升上去的弦与铃）。
  const DESERT = [0, 2, 5, 7, 10];
  score('baptism', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      desert: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.33, -0.15], ['D4', 'soft', 0.12, 0.3], ['G3', 's', 0.08, -0.3], ['B3', 's', 0.07, 0.35], ['E4', 's', 0.04, -0.45]],
      river: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.13, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.08, 0.4]], pulse: [0.28, 0.2] },
      open: [['A2', 's', 0.34, 0], ['E3', 'soft', 0.22, -0.15], ['A3', 'choir', 0.16, 0], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.12, 0], ['Gs4', 's', 0.045, 0.4], ['B4', 's', 0.035, 0.5], ['Ds5', 's', 0.022, -0.45], ['A4', 'flute', 0.04, -0.3]],
      tempt: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.34, 0.1], ['B2', 'soft', 0.12, -0.3], ['E3', 'soft', 0.13, 0.25], ['D4', 's', 0.035, -0.4]],
      sea: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['Fs4', 's', 0.07, 0.35], ['A3', 'flute', 0.07, -0.2], ['E4', 's', 0.05, 0.45]], pulse: [0.18, 0.2] },
      wedding: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.16, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.05, -0.45], ['Cs5', 's', 0.03, 0.5]],
    } },
    order: ['desert', 'jordan', 'open', 'tempt', 'angels', 'sea', 'wedding'],
    rules: {
      open: ['mt 3:16-17', 'mk 1:9-11', 'lk 3:21-22', 'jn 1:29-34'],
      jordan: ['mt 3:13-15'],
      desert: ['mt 3', 'mk 1:1-8', 'lk 3', 'jn 1:1-28'],
      angels: ['!mt 4:11'],
      tempt: ['mt 4:1-10', 'lk 4:1-13', 'mk 1:12-13'],
      sea: ['mt 4:12-25', 'mk 1:14-20', 'lk 5:1-11', 'jn 1:35-51'],
      wedding: ['jn 2'],
    },
    secs: {
      desert: { g: 'desert', sc: DESERT, lp: 1,
        m: (a, g, p) => { a.ney(g, p); return [13, 20]; },
        cue: [3, (a, g, p) => a.pipe([['E4', 0.6], ['A4', 1.3], ['G4', 0.5], ['E4', 0.5], ['D4', 0.6], ['E4', 1.8]], { g: g * 0.5, pan: p, bend: true, bright: 3, breath: 0.45, vib: 14, rev: 0.75 })] },   // 旷野里有人声喊着
      jordan: { g: 'river', sc: 'maj', lp: 1.1,
        m: (a, g) => { flowing(a, g); return [8, 12]; },
        m2: (a, g) => { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.35, a.pan()); return [2.5, 5]; } },
      open: { g: 'open', sc: 'lyd', lp: 1.8, hush: 10,
        m: (a, g, p) => { if (Math.random() < 0.5) theme(a, g * 0.8, p, { wave: 'glass' }); else a.glass(g * 0.55, 2); return [11, 15]; },
        m2: (a, g) => { a.glass(g * 0.35, 1); return [4, 7]; },
        cue: [1.2, (a, g, p) => { dove(a, g); a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.55, 0.4], g: g * 0.8, a: 1.4, s: 1.6, r: 3, at: 1.2, pan: 0 }); theme(a, g * 0.85, p, { at: 4.2 }); }] },
      tempt: { g: 'tempt', sc: 'sus', lp: 0.75,
        m: (a, g, p) => { if (Math.random() < 0.55) a.bowed(a.pick(['A2', 'E2', 'D3', 'B2']), g * 0.7, p); return [15, 22]; } },
      angels: { g: 'open', sc: 'maj', lp: 1.2,
        m: (a, g) => { a.glass(g * 0.6, 2); return [8, 12]; },
        cue: [2, (a, g) => a.angelRun(g * 0.8)] },
      sea: { g: 'sea', sc: 'mixo', lp: 1.15,
        m: (a, g, p) => { if (Math.random() < 0.55) barcarolle(a, g * 0.85, p); else fisher(a, g, p); return [11, 16]; },
        cue: [3, (a, g, p) => theme(a, g * 0.85, p)] },                                     // 来跟从我
      wedding: { g: 'wedding', sc: 'maj', lp: 1.3,
        m: (a, g, p) => { dance(a, g, p); return [10, 14]; },
        m2: (a, g) => { a.pluck(a.deg('maj', 'A4', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.6); return [2.5, 5]; },
        cue: [3, (a, g) => { rise(a, g * 0.8, 'maj', 'A3', 10, 0.16, { wave: 'harp', bright: 5 }); a.bells(['A5', 'Cs6', 'E6'], 0.2, g * 0.5, 2.8, 1.8); }] },   // 水变成酒
    },
    adj(lv, night, r, o, s) {
      const dim = cl(lv('gloom'));
      if (s.g === 'tempt') { o.lp *= 1 - 0.35 * dim; o.drone = 1.1 + 0.2 * dim; }
      if (s.g === 'open') o.drone = 0.8;
      return o;
    },
  });

  // ══ 四福音 · 登山宝训 ════════════════════════════════════
  // 湖上的山、明亮有风的春日（A 大九，开阔）：八福——每一句福一行琴，合唱应「阿们」（伊奥尼亚：西奈的律法曾是雷，这里是山上的诗）；
  // 盐与光：灯一盏一盏点起来；爱仇敌：日头照好人也照歹人（利底亚，升起的琴）；主祷文：领唱的人声吟诵（多利亚，八度的齐唱）；
  // 天上的飞鸟、野地的百合（田园的 A6/9，牧笛，花开的拨弦）；祈求、寻找、叩门（三声，门开了）；窄门（挂留，窄窄的两个音）；
  // 盖在磐石上的房子：风雨来时是风暴，风雨过后，低处的 A1 与伊奥尼亚稳稳地站着。
  score('sermon', {
    weight: { drone: 0.5, pad: 0.95 },
    pad: { lp: 1600, groups: {
      hill: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.15, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.07, 0.4], ['A4', 'flute', 0.035, -0.4]],
      bless: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.16, 0], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.12, 0], ['Fs4', 's', 0.05, 0.35], ['B4', 's', 0.03, -0.45]],
      lamp: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.15, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['Gs4', 's', 0.045, -0.45], ['Cs5', 's', 0.03, 0.5]],
      sun: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.06, 0.3], ['Ds4', 's', 0.045, 0.4], ['Gs4', 's', 0.04, -0.45]],
      prayer: [['A2', 's', 0.44, 0], ['A3', 'soft', 0.24, -0.15, -3], ['A3', 'soft', 0.18, 0.15, 3], ['E4', 'soft', 0.13, 0.3], ['A3', 'choir', 0.1, 0]],
      lilies: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'soft', 0.17, -0.3], ['Fs4', 's', 0.08, 0.4], ['B4', 's', 0.035, -0.5], ['A4', 'flute', 0.04, 0.3]],
      narrow: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.34, -0.1], ['A3', 'soft', 0.17, 0.1], ['B3', 's', 0.1, -0.2], ['E4', 's', 0.05, 0.3]],
      storm: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.35, 0.1], ['A2', 'over', 0.08, 0], ['D3', 'soft', 0.18, -0.3], ['E3', 'soft', 0.1, 0.25]], pulse: [0.45, 0.25] },
      rock: [['A1', 's', 0.32, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.15, 0.3], ['A2', 'over', 0.07, 0.1], ['E4', 's', 0.06, -0.4]],
    } },
    open: 'hill',
    order: ['bless', 'lamp', 'sun', 'prayer', 'lilies', 'knock', 'gate', 'fruit', 'rock'],
    rules: {
      bless: ['mt 5:1-12', 'lk 6:17-26'],
      lamp: ['mt 5:13-16'],
      sun: ['mt 5:17-48', 'lk 6:27-36'],
      prayer: ['mt 6:1-18', 'lk 11:1-4'],
      lilies: ['mt 6:19-34', 'lk 12:22-34'],
      knock: ['mt 7:1-12', 'lk 11:5-13'],
      gate: ['mt 7:13-14'],
      fruit: ['mt 7:15-23', 'lk 6:43-45'],
      rock: ['mt 7:24-29', 'lk 6:46-49'],
    },
    secs: {
      hill: { g: 'hill', sc: 'maj', lp: 1,
        m: (a, g, p) => { if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(4, 5), g * 0.7, p, 'maj'); return [13, 19]; } },
      bless: { g: 'bless', sc: 'ion', lp: 1.15,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 4), g * 0.65, p, 'ion', { gap: 0.36 }); amen(a, g * 0.75, 1.8); return [12, 16]; },
        cue: [2, (a, g) => amen(a, g * 0.85)] },
      lamp: { g: 'lamp', sc: 'maj', lp: 1.25,
        m: (a, g) => { lamps(a, g, a.rint(4, 6)); return [9, 13]; },
        m2: (a, g) => { flame(a, g); return [2.5, 4.5]; },
        cue: [2, (a, g) => lamps(a, g * 1.1, 6)] },
      sun: { g: 'sun', sc: 'lyd', lp: 1.3,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 5), g * 0.7, p, 'lyd'); return [12, 17]; },
        cue: [2.5, (a, g) => { rise(a, g * 0.8, 'lyd', 'A3', 10, 0.22, { bright: 5 }); a.bells(['A5', 'Cs6', 'E6'], 0.2, g * 0.45, 3, 2.2); }] },
      prayer: { g: 'prayer', sc: 'dor', lp: 1,
        m: (a, g, p) => {                                                                    // 我们在天上的父
          cantor(a, a.pick([
            [['A3', 0.5], ['A3', 0.35], ['B3', 0.5], ['C4', 0.7], ['B3', 0.4], ['A3', 0.5], ['G3', 0.45], ['A3', 1.4]],
            [['C4', 0.5], ['D4', 0.5], ['E4', 0.8], ['D4', 0.4], ['C4', 0.4], ['B3', 0.5], ['A3', 1.4]],
            [['E4', 0.6], ['E4', 0.4], ['D4', 0.4], ['E4', 0.6], ['C4', 0.5], ['B3', 0.4], ['A3', 1.5]],
          ]), g, p);
          return [11, 16];
        },
        cue: [2.5, (a, g, p) => cantor(a, [['A3', 0.6], ['B3', 0.5], ['C4', 0.8], ['B3', 0.4], ['A3', 0.5], ['G3', 0.5], ['A3', 1.6]], g, p)] },
      lilies: { g: 'lilies', sc: 'maj', lp: 1.2,
        m: (a, g, p) => { a.shepherd(g * 0.9, p); return [12, 17]; },
        m2: (a, g) => { a.pluck(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.35, a.pan(), 0.8); return [3, 6]; } },
      knock: { g: 'hill', sc: 'maj', lp: 1.1,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 5), g * 0.65, p, 'maj'); return [14, 20]; },
        cue: [2, (a, g, p) => knockDoor(a, g, p)] },
      gate: { g: 'narrow', sc: 'sus', lp: 0.9,
        m: (a, g, p) => { a.pipe([['A4', 0.6], ['B4', 0.4], ['A4', 0.4], ['B4', 0.6], ['A4', 1.4]], { g: g * 0.45, pan: p, bright: 3, breath: 0.35, vib: 12, rev: 0.65 }); return [14, 20]; } },
      fruit: { g: 'lilies', sc: 'maj', lp: 1.1,                                               // 凡好树都结好果子
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 5), g * 0.65, p, 'maj', { gap: 0.3 }); return [12, 17]; },
        m2: (a, g) => { a.pluck(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.3, a.pan(), 0.8); return [3.5, 6]; } },
      rock: { g: 'rock', sc: 'ion', lp: 1.05,
        m: (a, g, p) => { a.strings(['A2', 'E3', 'A3', 'Cs4', 'E4'].map((n, i) => [n, i * 0.06, g * 0.55, 3]), { bright: 4, d: 3, pan: p, spread: 0.3, rev: 0.6 }); a.bells(['A4'], 0, g * 0.4, 3.5, 0.6); return [13, 18]; } },
    },
    adj(lv, night, r, o, s) {
      const st = sm(0.25, 0.7, max(lv('storm'), 0.8 * lv('rain')));
      if (st > 0) o.g = stack([['storm', st]], s.g);
      o.lp *= 1 - 0.35 * st;
      o.drone = 1 + 0.3 * st;
      return o;
    },
    over(a, g, p) { return a.lv('storm') > 0.35 ? [7, 11] : null; },                              // 风雨本身就是音乐
    scale(lv, night, r, s) { return lv('storm') > 0.4 ? 'dor' : null; },
  });

  // ══ 四福音 · 神迹 ════════════════════════════════════════
  // 加利利的湖边（A6/9、缓缓的起伏）；医治：长大麻风的变洁净——光一闪（铃与玻璃），恢复总是明亮的 A 大；
  // 夜里湖上的风暴（风暴自己奏；低处弗里几亚的暗）→「住了吧！静了吧！」：大平静——一个极轻极慢的纯净和弦，别的都停；
  // 睚鲁的女儿（「大利大，古米」：主题从低处醒来、升上去）；五饼二鱼（五个音、两个音、十二个篮子的一串）；
  // 夜里在海面上行走（利底亚的惊奇，「是我，不要怕」时笛上是主题）；以法大（一个和弦从闷住里打开）；巴底买看见（颜色涌出来）。
  score('miracles', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1500, groups: {
      shore: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['B3', 'soft', 0.12, -0.3], ['Cs4', 'soft', 0.14, 0.3], ['Fs4', 's', 0.06, -0.4], ['A3', 'flute', 0.06, 0]], pulse: [0.2, 0.16] },
      heal: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 's', 0.15, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['B4', 's', 0.04, -0.45], ['Cs5', 's', 0.03, 0.5], ['A3', 'over', 0.05, 0]],
      storm: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['A2', 'over', 0.08, 0], ['D3', 'soft', 0.18, -0.25], ['E3', 'soft', 0.1, 0.25], ['Bb2', 'soft', 0.05, -0.4]], pulse: [0.55, 0.28] },
      calm: [['A2', 's', 0.46, 0], ['E3', 'soft', 0.34, -0.1], ['A3', 's', 0.16, 0.1], ['Cs4', 's', 0.1, -0.25], ['E4', 's', 0.05, 0.3]],
      raise: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'flute', 0.16, -0.3], ['E4', 's', 0.08, 0.35], ['Fs4', 's', 0.05, 0.4], ['A4', 's', 0.045, -0.45]],
      feast: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.16, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.05, -0.45]],
      water: { v: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.3, 0.1], ['B2', 'soft', 0.12, -0.2], ['E3', 'soft', 0.16, 0.25], ['Gs3', 's', 0.05, -0.35], ['Cs4', 's', 0.06, 0.35], ['Ds4', 's', 0.025, -0.4], ['E4', 'flute', 0.04, 0]], pulse: [0.16, 0.2] },
      open: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.28, -0.15], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['Ds4', 's', 0.05, 0.4], ['Gs4', 's', 0.05, -0.45], ['E5', 's', 0.025, 0.5], ['A3', 'over', 0.05, 0]],
    } },
    open: 'shore',
    order: ['heal', 'storm', 'raise', 'feast', 'water', 'open'],
    rules: {
      storm: ['mk 4:35-41', 'mt 8:23-27', 'lk 8:22-25'],
      raise: ['mk 5:21-24', 'mk 5:35-43', 'lk 8:40-42', 'lk 8:49-56', 'mt 9:18-26', 'lk 7:11-17'],
      feast: ['mk 6:30-44', 'mk 8:1-10', 'jn 6:1-14', 'mt 14:13-21', 'mt 15:32-39', 'lk 9:10-17'],
      water: ['mk 6:45-56', 'mt 14:22-36', 'jn 6:15-21'],
      open: ['mk 7:31-37', 'mk 8:22-26', 'mk 10:46-52', 'mt 20:29-34', 'lk 18:35-43', 'mt 9:27-31', 'jn 9'],
      heal: ['mk 1', 'mk 2:1-12', 'mk 3:1-12', 'mk 5:1-20', 'mk 5:25-34', 'mk 7:24-30', 'mt 8:1-17', 'lk 5:12-26', 'mt 9:1-8'],
    },
    secs: {
      shore: { g: 'shore', sc: 'maj', lp: 1,
        m: (a, g, p) => { if (Math.random() < 0.5) barcarolle(a, g * 0.8, p); else a.shepherd(g * 0.85, p); return [12, 18]; } },
      heal: { g: 'heal', sc: 'maj', lp: 1.2,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 5), g * 0.7, p, 'maj', { gap: 0.3 }); return [12, 18]; },
        cue: [2.5, (a, g) => { a.glass(g * 0.6, 2); a.bells(['A5', 'E6'], 0.3, g * 0.45, 2.6, 0.2); }] },          // 你洁净了吧！
      storm: { g: 'calm', sc: 'maj', lp: 0.9, hush: 14,
        m: (a, g) => { a.glass(g * 0.35, 1); return [16, 24]; },
        cue: [3, (a, g, p, r) => { if (at(r, 'mk 4:39', 'mt 8:26', 'lk 8:24') || said(r, /静了|住了/)) stillness(a, g); }] },
      raise: { g: 'raise', sc: 'maj', lp: 1.05,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 4), g * 0.6, p, 'maj', { gap: 0.4 }); return [14, 20]; },
        cue: [3, (a, g, p) => theme(a, g * 0.85, p, { up: true })] },                             // 闺女，起来
      feast: { g: 'feast', sc: 'ion', lp: 1.25,
        m: (a, g, p) => { a.lyre('A4', a.rint(5, 7), g * 0.7, p, 'ion', { gap: 0.2 }); return [10, 15]; },
        m2: (a, g) => { a.pluck(a.deg('maj', 'A4', a.rint(0, 9)), 0, g * 0.35, a.pan(), 0.6); return [2, 4]; },
        cue: [2.5, (a, g, p) => loaves(a, g, p)] },
      water: { g: 'water', sc: 'lyd', lp: 1,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 4), g * 0.55, p, 'lyd', { gap: 0.42 }); return [13, 19]; },
        m2: (a, g) => { a.ping(a.deg('lyd', 'A5', a.rint(0, 6)), 0, g * 0.3, a.pan()); return [2.5, 5]; },
        cue: [3, (a, g, p) => theme(a, g * 0.85, p)] },                                          // 是我，不要怕
      open: { g: 'open', sc: 'lyd', lp: 1.35,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 6), g * 0.7, p, 'lyd'); return [12, 17]; },
        m2: (a, g) => { a.glass(g * 0.3, 1); return [5, 9]; },
        cue: [2, (a, g, p, r) => (at(r, 'mk 7:31-37') || said(r, /开了吧|以法大/) ? opening(a, g) : bloom(a, g))] },
    },
    adj(lv, night, r, o, s) {
      const st = sm(0.2, 0.65, max(lv('storm'), 0.8 * lv('gale')));
      if (st > 0) o.g = stack([['storm', st]], s.g);
      o.lp *= (1 - 0.4 * st) * (1 - 0.15 * night);
      o.drone = 1 + 0.3 * st;
      o.dlp = 1 - 0.2 * st;
      if (s.g === 'calm') { o.pad = 1 - 0.2 * (1 - st); o.lp *= 0.9; }                             // 大平静：连乐垫也轻了
      return o;
    },
    over(a, g) { return a.lv('storm') > 0.35 || a.lv('gale') > 0.5 ? [7, 11] : null; },
    scale(lv) { return max(lv('storm'), lv('gale')) > 0.4 ? 'phryg' : null; },
  });

  // ══ 四福音 · 比喻 ════════════════════════════════════════
  // 耶稣在海边教训人（A6/9 缓缓起伏）；撒种（散开的短拨，多利亚）；芥菜种长成树（从 A2 慢慢升到 A5，飞鸟的高音）；
  // 藏宝、重价的珠子（利底亚，一声完美的铃）；好撒玛利亚人（路上的多利亚，弓弦的怜悯；「你去照样行吧」转大调）；
  // 失羊、失钱（挂留的寻找，找着了就欢喜）；浪子：远方的饥荒（爱奥利亚、低处）→ 父亲跑去抱住他（主题完整地唱出，温暖的 A 大）
  // → 宰牛犊的筵席（手鼓）；马大与马利亚（最稀的几个音：不可少的只有一件）。
  score('parables', {
    weight: { drone: 0.5, pad: 0.95 },
    pad: { lp: 1500, groups: {
      shore: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.1, 0.2], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.07, -0.35], ['A3', 'flute', 0.06, 0]], pulse: [0.2, 0.15] },
      field: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.15], ['B3', 'soft', 0.14, -0.3], ['D4', 's', 0.06, -0.35], ['Fs4', 's', 0.06, 0.35], ['A3', 'flute', 0.05, 0]],
      grow: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.15, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.09, 0.35], ['A4', 's', 0.05, -0.45], ['B4', 's', 0.03, 0.5]],
      treasure: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.15, -0.3], ['Gs4', 's', 0.06, 0.35], ['B4', 's', 0.04, 0.4], ['Ds5', 's', 0.03, -0.45], ['A3', 'over', 0.05, 0]],
      road: [['A1', 's', 0.3, 0], ['A2', 's', 0.24, 0], ['E3', 'soft', 0.28, -0.15], ['C4', 'soft', 0.11, 0.3], ['D4', 's', 0.06, -0.3], ['Fs4', 's', 0.04, 0.4]],
      lost: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.32, 0.15], ['B3', 'soft', 0.14, -0.3], ['D4', 's', 0.07, 0.35], ['A4', 'flute', 0.04, -0.4]],
      far: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'soft', 0.12, 0.25], ['G3', 's', 0.07, -0.35]],
      home: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 'soft', 0.16, 0.25], ['Cs4', 'soft', 0.14, -0.3], ['Cs4', 'flute', 0.05, 0], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.05, -0.45], ['Cs5', 's', 0.03, 0.5]],
      quiet: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.32, -0.1], ['A3', 's', 0.1, 0.1], ['Cs4', 'soft', 0.14, 0.25], ['E4', 'flute', 0.05, -0.3]],
    } },
    open: 'shore',
    order: ['sower', 'grow', 'treasure', 'road', 'quiet', 'knock', 'fool', 'lost', 'far', 'home'],
    rules: {
      sower: ['mt 13:1-23', 'mk 4:1-20', 'lk 8:4-15'],
      grow: ['mt 13:24-43', 'mk 4:21-34', 'lk 13:18-21'],
      treasure: ['mt 13:44-58'],
      road: ['lk 10:25-37'],
      quiet: ['lk 10:38-42'],
      lost: ['lk 15:1-10', 'mt 18:10-14'],
      far: ['lk 15:11-19', 'lk 16:19-31'],
      home: ['lk 15:20-32', 'lk 14:15-24'],
      knock: ['lk 11:1-13', 'lk 18:1-8'],
      fool: ['lk 12:13-21', 'lk 12:35-48'],
    },
    secs: {
      shore: { g: 'shore', sc: 'maj', lp: 1,
        m: (a, g, p) => { if (Math.random() < 0.5) barcarolle(a, g * 0.75, p); else a.lyre('A4', a.rint(3, 5), g * 0.65, p, 'maj'); return [13, 19]; } },
      sower: { g: 'field', sc: 'dor', lp: 1.1,
        m: (a, g) => { seeds(a, g, 'dor'); return [9, 13]; },
        cue: [2, (a, g) => seeds(a, g * 1.1, 'dor')] },
      grow: { g: 'grow', sc: 'maj', lp: 1.2,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 5), g * 0.65, p, 'maj'); return [12, 16]; },
        m2: (a, g) => { a.ping(a.deg('maj', 'A6', a.rint(0, 4)), 0, g * 0.25, a.pan()); return [2, 5]; },
        cue: [2.5, (a, g) => rise(a, g * 0.8, 'maj', 'A2', 16, 0.2, { bright: 4 })] },          // 芥菜种长成了树
      treasure: { g: 'treasure', sc: 'lyd', lp: 1.3,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 4), g * 0.55, p, 'lyd', { gap: 0.4 }); return [12, 17]; },
        m2: (a, g) => { a.starPing(g * 0.55); return [2, 4]; },
        cue: [2.5, (a, g) => pearl(a, g)] },
      road: { g: 'road', sc: 'dor', lp: 0.95,
        m: (a, g, p, r) => { if (since('parables') > 14) a.lyre('A4', a.rint(3, 5), g * 0.65, p, 'maj', { gap: 0.32 }); else a.bowed(a.pick(['A2', 'D3', 'E3', 'C3']), g * 0.8, p); return [12, 17]; } },
      quiet: { g: 'quiet', sc: 'maj', lp: 0.95,
        m: (a, g, p) => { a.lyre('A4', 2, g * 0.5, p, 'maj', { gap: 0.8 }); return [20, 28]; } },
      knock: { g: 'quiet', sc: 'maj', lp: 1.05,                                               // 半夜叩门的朋友：你们祈求，就给你们
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 4), g * 0.6, p, 'maj', { gap: 0.34 }); return [14, 20]; },
        cue: [2, (a, g, p) => knockDoor(a, g, p)] },
      fool: { g: 'far', sc: 'aeol', lp: 0.9,                                                  // 无知的人哪，今夜必要你的灵魂
        m: (a, g, p) => { if (Math.random() < 0.6) a.bowed(a.pick(['A2', 'E3', 'C3']), g * 0.75, p); return [14, 20]; },
        cue: [3, (a, g, p) => sigh(a, g * 0.9, p, 3)] },
      lost: { g: 'lost', sc: 'sus', lp: 1,
        m: (a, g, p) => {
          if (since('parables') > 12) { a.lyre('A4', a.rint(4, 6), g * 0.7, p, 'maj', { gap: 0.22 }); a.glass(g * 0.4, 1); }   // 找着了，就欢欢喜喜
          else a.shepherd(g * 0.8, p);
          return [11, 15];
        },
        m2: (a, g) => { if (Math.random() < 0.5) coins(a, g * 0.8, 1); return [5, 9]; } },
      far: { g: 'far', sc: 'aeol', lp: 0.85,
        m: (a, g, p) => { if (Math.random() < 0.55) a.ney(g, p); else a.bowed(a.pick(['A2', 'C3', 'E3', 'G3']), g * 0.8, p); return [13, 19]; } },
      home: { g: 'home', sc: 'maj', lp: 1.3, hush: 9,
        m: (a, g, p) => { if (Math.random() < 0.5) dance(a, g * 0.9, p); else a.lyre('A4', a.rint(4, 6), g * 0.7, p, 'maj'); return [10, 14]; },
        cue: [2.5, (a, g, p) => { theme(a, g * 0.95, p); a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.6, a: 1.4, s: 1.6, r: 3, at: 2.2, pan: -p }); }] },   // 父亲跑去抱住他
    },
  });

  // ══ 四福音 · 生命的光 ════════════════════════════════════
  // 尼哥底母夜里来（利底亚的夜，星；风随着意思吹——一口气）；「神爱世人」（温暖宽阔的 A 大，主题）；
  // 井旁的撒玛利亚妇人（正午，活水的琴）；生命的粮（诗篇般的应答）；「我是世界的光」与生来瞎眼的（最亮的利底亚，颜色涌出来）；
  // 好牧人（牧笛、A6）；拉撒路死了（多利亚五声的忧伤——「耶稣哭了」：一口叹息）→「我是复活，我是生命」「拉撒路出来！」
  // （伊奥尼亚的光辉，一串升上去的弦与铃）；马利亚的香膏（慢慢升起、满屋的笛与玻璃）。
  score('light', {
    weight: { drone: 0.5, pad: 0.95 },
    pad: { lp: 1500, groups: {
      night: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.15], ['B3', 's', 0.06, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['Gs4', 's', 0.06, 0.35], ['Ds5', 's', 0.028, -0.45]],
      love: [['A1', 's', 0.24, 0], ['A2', 's', 0.3, 0], ['E3', 'soft', 0.28, -0.15], ['Cs4', 'soft', 0.14, 0.3], ['E4', 's', 0.08, -0.35], ['A4', 's', 0.04, 0.45], ['A3', 'choir', 0.08, 0], ['Cs4', 'choir', 0.06, 0]],
      well: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.13, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.08, 0.4], ['Fs4', 's', 0.04, -0.4]], pulse: [0.3, 0.2] },
      bread: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.18, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['Fs4', 's', 0.06, 0.35], ['E4', 's', 0.06, -0.4]],
      light: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.26, -0.15], ['A3', 's', 0.14, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.09, 0.35], ['Gs4', 's', 0.045, -0.45], ['A4', 's', 0.04, -0.2], ['Ds5', 's', 0.022, 0.5], ['A3', 'over', 0.05, 0]],
      shepherd: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.34, -0.2], ['Cs4', 'soft', 0.18, 0.3], ['Fs4', 's', 0.08, -0.4], ['A4', 'flute', 0.04, 0.35]],
      weep: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.08, -0.2], ['C3', 'soft', 0.22, 0.3], ['E3', 'soft', 0.12, -0.25], ['B3', 's', 0.05, 0.35]],
      life: [['A1', 's', 0.26, 0], ['A2', 's', 0.26, 0], ['E3', 'soft', 0.26, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.1, -0.35], ['A4', 's', 0.055, 0.45], ['Cs5', 's', 0.03, -0.5], ['A3', 'over', 0.06, 0]],
      perfume: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'flute', 0.14, -0.3], ['E4', 's', 0.06, 0.3], ['Fs4', 'flute', 0.06, 0.35], ['B4', 's', 0.03, -0.45]],
    } },
    order: ['night', 'love', 'well', 'bread', 'light', 'shepherd', 'promise', 'weep', 'life', 'perfume'],
    rules: {
      love: ['jn 3:16-21', 'jn 3:31-36', 'jn 12:12-50'],
      night: ['jn 3:1-15', 'jn 3:22-30'],
      well: ['jn 4', 'jn 5', 'jn 7:37-39'],
      bread: ['jn 6'],
      light: ['jn 7', 'jn 8', 'jn 9'],
      shepherd: ['jn 10'],
      promise: ['jn 11:25-27'],
      life: ['jn 11:38-57'],
      weep: ['jn 11'],
      perfume: ['jn 12:1-11'],
    },
    secs: {
      night: { g: 'night', sc: 'lyd', lp: 0.95,
        m: (a, g, p) => { a.lyre('A3', a.rint(3, 5), g * 0.65, p, 'lyd', { gap: 0.4 }); return [14, 20]; },
        m2: (a, g) => { if (a.night() > 0.4) a.starPing(g * 0.7); return [1.5, 3.5]; },
        cue: [3, (a, g, p, r) => { if (at(r, 'jn 3:8') || a.lv('gale') > 0.3) breath(a, g, p); }] },   // 风随着意思吹
      love: { g: 'love', sc: 'maj', lp: 1.25, hush: 9,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 5), g * 0.7, p, 'maj'); return [12, 16]; },
        cue: [2.5, (a, g, p) => { theme(a, g, p); a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.55, a: 1.6, s: 1.6, r: 3, at: 1.5, pan: -p }); }] },   // 神爱世人
      well: { g: 'well', sc: 'maj', lp: 1.15,
        m: (a, g) => { flowing(a, g); return [9, 13]; },
        m2: (a, g) => { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.35, a.pan()); return [2.5, 5]; },
        cue: [2, (a, g) => flowing(a, g * 1.1)] },
      bread: { g: 'bread', sc: 'ion', lp: 1.1,
        m: (a, g, p) => { if (Math.random() < 0.45) psalm(a, g * 0.8); else a.lyre('A4', a.rint(4, 5), g * 0.65, p, 'ion'); return [13, 18]; },
        cue: [2.5, (a, g) => amen(a, g * 0.85)] },
      light: { g: 'light', sc: 'lyd', lp: 1.5, hush: 9,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 6), g * 0.72, p, 'lyd'); return [11, 15]; },
        m2: (a, g) => { a.glass(g * 0.32, 1); return [4, 7]; },
        cue: [2.5, (a, g) => bloom(a, g)] },
      shepherd: { g: 'shepherd', sc: 'maj', lp: 1.05,
        m: (a, g, p) => { a.shepherd(g * 0.9, p); return [12, 18]; },
        cue: [3, (a, g, p) => a.shepherd(g, p)] },
      promise: { g: 'love', sc: 'maj', lp: 0.95, hush: 9,                                     // 复活在我，生命也在我：在哀哭中间，温暖而低
        m: (a, g, p) => { a.lyre('A3', a.rint(3, 4), g * 0.6, p, 'maj', { gap: 0.4 }); return [14, 20]; },
        cue: [3, (a, g, p) => theme(a, g * 0.8, p, { beat: 0.5 })] },
      weep: { g: 'weep', sc: 'grief', lp: 0.85,
        m: (a, g, p) => { if (Math.random() < 0.5) sigh(a, g, p); else a.bowed(a.pick(['A2', 'C3', 'E3', 'B2']), g * 0.8, p); return [13, 18]; },
        cue: [3, (a, g, p) => sigh(a, g * 1.05, p, 0)] },                                        // 耶稣哭了
      life: { g: 'life', sc: 'ion', lp: 1.45, hush: 9,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 6), g * 0.72, p, 'ion'); if (Math.random() < 0.4) a.bells(['A5', 'E6'], 0.3, g * 0.35, 2.6, 1.4); return [11, 15]; },
        cue: [2, (a, g) => { rise(a, g * 0.85, 'ion', 'A2', 15, 0.14, { bright: 5 }); a.bells(['A5', 'Cs6', 'E6'], 0.2, g * 0.55, 3, 2.2); }] },   // 拉撒路出来！
      perfume: { g: 'perfume', sc: 'maj', lp: 1.1,
        m: (a, g, p) => { a.pipe([['Cs4', 0.7], ['E4', 0.5], ['Fs4', 0.6], ['A4', 0.9], ['B4', 0.5], ['A4', 1.6]], { g: g * 0.45, pan: p, bright: 3, breath: 0.25, vib: 9, rev: 0.7 }); return [14, 20]; },
        m2: (a, g) => { a.glass(g * 0.28, 1); return [4, 8]; } },
    },
    adj(lv, night, r, o, s) {
      if (s.g === 'night') o.lp *= 1 - 0.1 * night;
      if (s.g === 'weep') o.drone = 1.15;
      if (s.g === 'life' || s.g === 'light') o.drone = 0.85;
      return o;
    },
  });

  // ══ 四福音 · 登山变像 ════════════════════════════════════
  // 该撒利亚腓立比：「我要把我的教会建造在这磐石上」（低处 A1 与伊奥尼亚，一个坚实的和弦）；
  // ★ 登山变像：全书最亮的时刻之一——高处的合唱（利底亚），低通全开，铃，「这是我的爱子」时主题在玻璃上；
  // 让小孩子到我这里来（孩子的歌）；富有的少年人忧忧愁愁地走了（挂留、苇笛的下行）；撒该（快的琴：「你快下来！」）；
  // 骑驴进耶路撒冷：「和散那」（应答的合唱、手鼓、混合利底亚）；洁净圣殿（多利亚、两声重重的敲击——克制）；
  // 寡妇的两个小钱；耶路撒冷的黄昏（爱奥利亚：那将要来的已在远处）。
  score('glory', {
    weight: { drone: 0.5, pad: 1 },
    pad: { lp: 1500, groups: {
      rock: [['A1', 's', 0.3, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['A2', 'over', 0.08, 0.1], ['E4', 's', 0.07, -0.4]],
      glory: [['A2', 's', 0.32, 0], ['E3', 'soft', 0.18, -0.15], ['A3', 'choir', 0.17, 0], ['E4', 'choir', 0.15, 0], ['A4', 'choir', 0.12, 0], ['Cs5', 'choir', 0.09, 0], ['E5', 's', 0.03, -0.5], ['Ds5', 's', 0.02, 0.45], ['Gs5', 's', 0.012, 0.5], ['A3', 'over', 0.06, 0]],
      child: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['E4', 's', 0.06, 0.4], ['Fs4', 's', 0.07, 0.35], ['A4', 'flute', 0.05, -0.4]],
      sorrow: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.33, -0.15], ['B3', 'soft', 0.13, 0.3], ['D4', 's', 0.07, -0.35], ['G4', 's', 0.03, 0.4]],
      today: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.15, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.09, 0.35], ['B4', 's', 0.035, -0.45]],
      hosanna: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.2, 0], ['Cs4', 'choir', 0.16, 0], ['E4', 'choir', 0.14, 0], ['A4', 'choir', 0.08, 0], ['A2', 'over', 0.05, 0]],
      zeal: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.08, -0.2], ['D3', 'soft', 0.16, -0.3], ['E3', 'soft', 0.16, 0.25], ['C4', 's', 0.03, 0.4]],
      evening: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['C4', 'soft', 0.11, 0.3], ['B3', 's', 0.09, -0.3], ['E4', 's', 0.06, 0.4], ['A3', 'flute', 0.05, 0]],
    } },
    order: ['rock', 'glory', 'child', 'sorrow', 'toward', 'today', 'hosanna', 'zeal', 'evening'],
    rules: {
      rock: ['mt 16', 'mk 8:27-38', 'lk 9:18-27'],
      glory: ['mt 17:1-13', 'mk 9:2-13', 'lk 9:28-36'],
      child: ['mt 18', 'mt 19:13-15', 'mk 10:13-16', 'lk 18:15-17', 'mk 9:33-37'],
      toward: ['mt 20:17-28', 'mk 10:32-45', 'lk 18:31-34', 'mt 16:21-23', 'mt 17:22-23'],
      sorrow: ['mt 19:16-30', 'mk 10:17-31', 'lk 18:18-30'],
      today: ['lk 19:1-10', 'lk 18:35-43', 'mt 20:29-34', 'mk 10:46-52'],
      hosanna: ['mt 21:1-11', 'mk 11:1-11', 'lk 19:28-40', 'jn 12:12-19'],
      zeal: ['mt 21:12-17', 'mk 11:15-19', 'lk 19:45-48', 'jn 2:13-22'],
      evening: ['mk 12:41-44', 'lk 21:1-4', 'lk 19:41-44', 'mt 23:37-39', 'mt 21:17-22'],
    },
    secs: {
      rock: { g: 'rock', sc: 'ion', lp: 1.05,
        m: (a, g, p) => { a.lyre('A3', a.rint(4, 5), g * 0.75, p, 'ion', { gap: 0.3 }); return [14, 20]; },
        cue: [2.5, (a, g, p) => { a.strings(['A1', 'A2', 'E3', 'A3', 'Cs4', 'E4'].map((n, i) => [n, i * 0.05, g * 0.55, 3.4]), { bright: 4, d: 3.4, pan: p, spread: 0.3, rev: 0.6 }); a.bells(['A4', 'E5'], 0.4, g * 0.4, 3.4, 0.4); }] },   // 在这磐石上
      glory: { g: 'glory', sc: 'lyd', lp: 2.2, hush: 10,
        m: (a, g) => { a.choir(['A3', 'E4', 'B4', 'Cs5', 'Gs5'], { gs: [1, 0.85, 0.65, 0.5, 0.25], g: g * 0.7, a: 1.2, s: 1.4, r: 3, pan: 0 }); a.glass(g * 0.45, 2); return [11, 15]; },
        m2: (a, g) => { a.starPing(g * 0.65); return [1.2, 2.6]; },
        cue: [1.5, (a, g, p) => { a.bells(['A5', 'Cs6', 'E6', 'A6'], 0.18, g * 0.55, 3.4, 0); theme(a, g * 0.9, p, { wave: 'glass', oct: 0, at: 2 }); gloria(a, g * 0.8, 3.5); }] },   // 这是我的爱子
      child: { g: 'child', sc: 'maj', lp: 1.15,
        m: (a, g, p) => { a.pipe(a.pick([[['A4', 0.25], ['Cs5', 0.25], ['E5', 0.5], ['Cs5', 0.25], ['E5', 0.25], ['Fs5', 0.5], ['E5', 1]], [['E5', 0.25], ['Cs5', 0.25], ['A4', 0.5], ['B4', 0.25], ['Cs5', 0.25], ['A4', 1]]]), { g: g * 0.45, pan: p, bright: 4, breath: 0.2, vib: 8, rev: 0.55 }); return [11, 16]; },
        cue: [3, (a, g, p) => a.shepherd(g, p)] },
      sorrow: { g: 'sorrow', sc: 'sus', lp: 0.95,
        m: (a, g, p) => { a.ney(g * 0.9, p); return [14, 21]; },
        cue: [4, (a, g, p) => a.pipe([['D5', 0.8], ['B4', 0.6], ['A4', 0.8], ['G4', 0.6], ['E4', 2]], { g: g * 0.45, pan: p, bend: true, bright: 3, breath: 0.4, vib: 14, rev: 0.7 })] },   // 忧忧愁愁地走了
      toward: { g: 'sorrow', sc: 'dor', lp: 0.95,                                             // 看哪，我们上耶路撒冷去
        m: (a, g, p) => { a.ney(g * 0.85, p); return [15, 22]; },
        cue: [3.5, (a, g, p) => sigh(a, g * 0.8, p, 1)] },
      today: { g: 'today', sc: 'maj', lp: 1.25,
        m: (a, g, p) => { a.lyre('A4', a.rint(5, 7), g * 0.7, p, 'maj', { gap: 0.18 }); return [11, 16]; },
        cue: [2, (a, g, p) => { a.strings(['E6', 'Cs6', 'B5', 'A5', 'Fs5', 'E5', 'Cs5', 'A4'].map((n, i) => [n, i * 0.09, g * 0.5, 1.6]), { bright: 5, d: 1.6, pan: p, spread: 0.3, rev: 0.5 }); dance(a, g * 0.8, -p); }] },   // 你快下来！
      hosanna: { g: 'hosanna', sc: 'mixo', lp: 1.3, hush: 9,
        m: (a, g, p) => { psalm(a, g * 0.9); timbrel(a, g * 0.7, p, 10); return [9, 13]; },
        m2: (a, g) => { a.pluck(a.deg('mixo', 'A4', a.rint(0, 7)), 0, g * 0.35, a.pan(), 0.5); return [2, 4]; },
        cue: [1.5, (a, g, p) => { psalm(a, g); timbrel(a, g * 0.8, p, 10); }] },
      zeal: { g: 'zeal', sc: 'dor', lp: 0.9,
        m: (a, g, p) => { a.bowed(a.pick(['A2', 'D3', 'E3']), g * 0.8, p); return [13, 18]; },
        cue: [2, (a, g, p) => a.knocks([[0, 380, 90, g * 0.9, true], [0.7, 360, 85, g * 0.7, true]], { lp: 1200, pan: p, rev: 0.5 })] },
      evening: { g: 'evening', sc: 'aeol', lp: 0.9,
        m: (a, g, p) => { a.lyre('A3', a.rint(3, 4), g * 0.55, p, 'aeol', { gap: 0.45 }); return [16, 24]; },
        cue: [3, (a, g) => coins(a, g, 2)] },
    },
    adj(lv, night, r, o, s) {
      if (s.g === 'glory') { o.drone = 0.75; o.dlp = 1.2; }
      if (s.g === 'evening') o.lp *= 1 - 0.2 * night;
      return o;
    },
  });

  // ══ 四福音 · 最后的晚餐 ══════════════════════════════════
  // 楼上的房间，夜里的灯（低暖的 A6，笛）：洗脚（轻轻倒水的琴）；饼与杯（合唱的「阿们」，杯是一声长长的铃）；
  // 「我怎样爱你们」（主题）；「我就是道路、真理、生命」「我留下平安给你们」（利底亚、平安的和弦）；葡萄树与枝子（两条缠绕的琴）；
  // 客西马尼：橄榄树间的夜（爱奥利亚，弓弦很稀）——「不要照我的意思」：一口气落到 A 上；
  // 火把与兵丁（弗里几亚、低处的脉动、远处的脚步——克制；「收刀入鞘吧」之后一阵静）；彼得不认主、鸡叫（冷的灰，苇笛的痛哭）。
  score('supper', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1300, night: 0.12, groups: {
      room: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.15], ['Cs4', 'soft', 0.14, 0.3], ['A3', 'flute', 0.08, -0.2], ['E4', 's', 0.06, 0.35], ['Fs4', 's', 0.04, -0.4]],
      wash: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 's', 0.12, -0.3], ['Cs4', 'soft', 0.14, 0.3], ['E4', 'flute', 0.05, -0.35], ['Fs4', 's', 0.04, 0.4]],
      bread: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.2, -0.15], ['A3', 'choir', 0.16, 0], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.1, 0], ['A2', 'over', 0.06, 0.1], ['Fs4', 's', 0.03, 0.35]],
      love: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.15, 0.25], ['Cs4', 'flute', 0.13, -0.3], ['E4', 's', 0.08, 0.35], ['A4', 's', 0.04, -0.45]],
      peace: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['Fs4', 's', 0.07, 0.4], ['Gs4', 's', 0.03, 0.3], ['B4', 's', 0.035, -0.5]],
      vine: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.07, 0.4], ['A4', 'flute', 0.035, 0]],
      garden: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'warm', 0.07, 0.25], ['G3', 's', 0.06, -0.35], ['F3', 's', 0.03, 0.35]], pulse: [0.35, 0.14] },
      arrest: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['Bb2', 'soft', 0.07, -0.35], ['C3', 'soft', 0.22, 0.3], ['E3', 'soft', 0.1, -0.2]], pulse: [0.85, 0.28] },
      deny: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['B2', 'soft', 0.12, -0.3], ['E3', 'soft', 0.14, 0.25], ['C4', 's', 0.045, -0.35]],
    } },
    open: 'room',
    order: ['passover', 'wash', 'betray', 'bread', 'love', 'way', 'vine', 'pray', 'garden', 'arrest', 'deny'],
    rules: {
      passover: ['mt 26:1-19', 'mk 14:1-16', 'lk 22:1-13'],
      wash: ['jn 13:1-17'],
      betray: ['mt 26:20-25', 'mk 14:17-21', 'lk 22:21-23', 'jn 13:18-30'],
      bread: ['mt 26:26-29', 'mk 14:22-25', 'lk 22:14-20'],
      love: ['jn 13:31-38', 'jn 15:9-17'],
      way: ['jn 14', 'jn 16', 'lk 22:24-38'],
      vine: ['jn 15'],
      pray: ['jn 17', 'mt 26:30', 'mk 14:26'],
      garden: ['mt 26:31-46', 'mk 14:27-42', 'lk 22:39-46', 'jn 18:1'],
      arrest: ['mt 26:47-56', 'mk 14:43-52', 'lk 22:47-53', 'jn 18:2-14'],
      deny: ['!mt 26:57-75', '!mk 14:53-72', '!lk 22:54-71', '!jn 18:15-27'],             // 不认主：只要故事里有这一段，就是它
    },
    secs: {
      room: { g: 'room', sc: 'maj', lp: 1,
        m: (a, g, p) => { a.lyre('A3', a.rint(3, 5), g * 0.6, p, 'maj', { gap: 0.36 }); return [15, 22]; },
        m2: (a, g) => { flame(a, g * 0.8); return [4, 8]; } },
      passover: { g: 'room', sc: 'maj', lp: 1.05,                                             // 我的时候快到了：预备逾越节
        m: (a, g, p) => { a.lyre('A3', a.rint(3, 5), g * 0.65, p, 'maj', { gap: 0.34 }); return [14, 20]; },
        m2: (a, g) => { flame(a, g * 0.8); return [4, 8]; } },
      betray: { g: 'room', sc: 'aeol', lp: 0.85,                                              // 你们中间有一个人要卖我了：灯下的阴影
        m: (a, g, p) => { if (Math.random() < 0.6) a.bowed(a.pick(['A2', 'E3', 'C3']), g * 0.7, p); return [14, 20]; },
        cue: [3.5, (a, g, p) => sigh(a, g * 0.8, p, 1)] },
      pray: { g: 'bread', sc: 'ion', lp: 1.15, hush: 10,                                      // 父啊，时候到了（约 17）；唱了诗
        m: (a, g, p) => { if (Math.random() < 0.5) amen(a, g * 0.8); else a.lyre('A3', a.rint(4, 5), g * 0.6, p, 'ion', { gap: 0.32 }); return [13, 18]; },
        cue: [2.5, (a, g) => psalm(a, g * 0.85)] },
      wash: { g: 'wash', sc: 'maj', lp: 1.05,
        m: (a, g, p) => { if (Math.random() < 0.5) flowing(a, g * 0.8, 'maj', 'A3'); else a.lyre('A4', a.rint(3, 4), g * 0.6, p, 'maj', { gap: 0.36 }); return [13, 18]; },
        cue: [2, (a, g) => flowing(a, g * 0.9, 'maj', 'A3')] },
      bread: { g: 'bread', sc: 'ion', lp: 1.1, hush: 10,
        m: (a, g, p) => { if (Math.random() < 0.5) amen(a, g * 0.8); else a.lyre('A3', a.rint(4, 5), g * 0.65, p, 'ion', { gap: 0.3 }); return [13, 18]; },
        cue: [3, (a, g, p) => { a.strings(['A3', 'E4', 'A4', 'Cs5'].map((n, i) => [n, i * 0.22, g * 0.5, 2.6]), { bright: 4, d: 2.6, pan: p, spread: 0.25, rev: 0.6 }); a.bells(['A4'], 0, g * 0.55, 5, 1.6); amen(a, g * 0.7, 3.4); }] },   // 饼掰开，杯递过来
      love: { g: 'love', sc: 'maj', lp: 1.1, hush: 9,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 5), g * 0.65, p, 'maj', { gap: 0.32 }); return [13, 18]; },
        cue: [3, (a, g, p) => theme(a, g * 0.95, p)] },                                          // 你们也要怎样相爱
      way: { g: 'peace', sc: 'lyd', lp: 1.15,
        m: (a, g, p) => { if (Math.random() < 0.4) shalom(a, g * 0.8); else a.lyre('A4', a.rint(4, 5), g * 0.65, p, 'lyd'); return [13, 18]; },
        cue: [3, (a, g, p, r) => (at(r, 'jn 14:27') || said(r, /平安/) ? shalom(a, g) : rise(a, g * 0.7, 'lyd', 'A3', 8, 0.24, { bright: 4 }))] },
      vine: { g: 'vine', sc: 'maj', lp: 1.1,
        m: (a, g, p) => { vine(a, g, p); return [12, 17]; },
        cue: [3, (a, g, p) => vine(a, g * 1.05, p)] },
      garden: { g: 'garden', sc: 'aeol', lp: 0.8,
        m: (a, g, p) => { if (Math.random() < 0.6) a.bowed(a.pick(['A2', 'C3', 'E3', 'G2']), g * 0.8, p); return [14, 20]; },
        cue: [4, (a, g, p) => a.pipe([['E4', 1.2], ['D4', 0.6], ['C4', 0.9], ['B3', 0.8], ['A3', 2.6]], { g: g * 0.48, pan: p, bend: true, bright: 3, breath: 0.4, vib: 12, rev: 0.72 })] },   // 不要照我的意思
      arrest: { g: 'arrest', sc: 'phryg', lp: 0.8, hush: 12,
        m: (a, g, p) => { march(a, g * 0.8, p); return [9, 13]; },
        cue: [2, (a, g, p, r) => { if (at(r, 'mt 26:52', 'jn 18:11') || said(r, /收刀/)) a.bowed('A2', g * 0.7, p); else march(a, g * 0.8, p); }] },
      deny: { g: 'deny', sc: 'aeol', lp: 0.8,
        m: (a, g, p) => { if (Math.random() < 0.5) a.ney(g * 0.9, p); else a.bowed(a.pick(['A2', 'E3', 'C3']), g * 0.75, p); return [14, 20]; },
        cue: [5, (a, g, p) => sigh(a, g, p, 2)] },                                             // 他就出去痛哭
    },
    adj(lv, night, r, o, s) {
      const dark = s.g === 'garden' || s.g === 'arrest' || s.g === 'deny';
      o.lp *= 1 - (dark ? 0.2 : 0.1) * night;
      o.drone = dark ? 1.15 : 1;
      o.dlp = dark ? 0.85 : 1;
      return o;
    },
  });

  // ══ 四福音 · 十字架 ══════════════════════════════════════
  // 全书最深的哀歌，而后是静默。正午到黑暗到安静的傍晚：
  // 彼拉多的公堂（弗里几亚、冷的低处，缓慢的脉动；「我的国不属这世界」时高处一声纯净的五度——另一个国）；
  // 往各各他的路（沉重的脚步、爱奥利亚，「不要为我哭」的叹息）；钉十字架（哀歌：A 小 b6，弓弦）；
  // 「父啊，赦免他们」：哀歌里忽然透出大三度（温柔的合唱）——不可能的怜悯；「今日你要同我在乐园里」：一声高处的利底亚；
  // 「看，你的母亲」：伯利恒的摇篮曲变成小调；遍地黑暗（gloom：空心的五度与 b2，高处的全都熄灭）；
  // 「以利！以利！」：什么都不奏，只有第九时的一声钟；★「成了」：圣子的主题用弓弦以小调慢慢唱完，落到 A 上——
  // 此后只剩没有三音的空五度，乐垫一句比一句薄（幔子裂开、百夫长：极轻的一个大三度），安葬之后几乎归于无声。
  score('cross', {
    weight: { drone: 0.7, pad: 0.95 },
    pad: { lp: 1000, night: 0.1, groups: {
      hall: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['A2', 'warm', 0.07, -0.2], ['C3', 'soft', 0.22, 0.3], ['E3', 'soft', 0.12, -0.25], ['D3', 's', 0.05, 0.35], ['Bb2', 's', 0.03, -0.35]], pulse: [0.42, 0.18] },
      way: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'warm', 0.08, 0.25], ['G3', 's', 0.06, -0.35]], pulse: [0.5, 0.26] },
      lament: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['A2', 'warm', 0.09, -0.2], ['C3', 'soft', 0.26, 0.3], ['E3', 'warm', 0.08, 0.4], ['F3', 's', 0.06, -0.35]],
      mercy: [['A1', 's', 0.34, 0], ['E2', 'soft', 0.26, 0.1], ['A2', 's', 0.18, -0.1], ['Cs3', 'soft', 0.13, 0.3], ['E3', 'soft', 0.13, -0.25], ['A3', 'choir', 0.1, 0], ['Cs4', 'choir', 0.08, 0]],
      dark: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.36, 0.1], ['A2', 'warm', 0.08, 0], ['Bb2', 'soft', 0.06, -0.35], ['E3', 'soft', 0.1, 0.25]],
      after: [['A1', 's', 0.38, 0], ['E2', 'soft', 0.27, 0.1], ['A2', 's', 0.22, 0], ['E3', 'soft', 0.14, 0.2], ['A3', 's', 0.04, -0.2]],
    } },
    order: ['hall', 'way', 'lament', 'forgive', 'paradise', 'mother', 'dark', 'cry', 'finished', 'veil', 'tomb'],
    say: [[/成了|交在你手里/, 'finished'], [/以利|拉马撒巴各大尼|以罗伊/, 'cry'], [/赦免他们/, 'forgive'], [/乐园/, 'paradise'], [/你的母亲|你的儿子/, 'mother']],
    rules: {
      hall: ['jn 18:28-40', 'jn 19:1-16', 'mt 27:1-31', 'mk 15:1-20', 'lk 23:1-25'],
      way: ['lk 23:26-32', 'jn 19:17', 'mk 15:21-22', 'mt 27:32-34'],
      forgive: ['lk 23:34'],
      paradise: ['lk 23:39-43'],
      mother: ['jn 19:25-27'],
      cry: ['mt 27:46-49', 'mk 15:34-36'],
      dark: ['mt 27:45', 'mk 15:33', 'lk 23:44-45'],
      finished: ['jn 19:28-30', 'lk 23:46', 'mt 27:50', 'mk 15:37'],
      veil: ['mt 27:51-56', 'mk 15:38-41', 'lk 23:47-49', 'jn 19:31-37'],
      tomb: ['mt 27:57-66', 'mk 15:42-47', 'lk 23:50-56', 'jn 19:38-42'],
      lament: ['lk 23:33-38', 'jn 19:18-24', 'mt 27:35-44', 'mk 15:23-32'],
    },
    secs: {
      hall: { g: 'hall', sc: 'phryg', lp: 1,
        m: (a, g, p) => { if (Math.random() < 0.6) a.bowed(a.pick(['A2', 'E2', 'C3', 'Bb2']), g * 0.75, p); return [14, 20]; },
        cue: [3, (a, g, p, r) => { if (at(r, 'jn 18:36-37') || said(r, /国/)) { a.note({ f: 'A5', g: g * 0.3, a: 1.2, s: 1.6, r: 3, pan: -0.3, rev: 0.85 }); a.note({ f: 'E6', g: g * 0.2, a: 1.4, s: 1.4, r: 3, at: 0.3, pan: 0.3, rev: 0.85 }); } }] },   // 我的国不属这世界
      way: { g: 'way', sc: 'aeol', lp: 0.9,
        m: (a, g, p) => { if (Math.random() < 0.5) steps(a, g, p); else sigh(a, g * 0.9, p); return [13, 18]; },
        cue: [4, (a, g, p) => sigh(a, g, p, 0)] },
      lament: { g: 'lament', sc: 'aeol', lp: 0.95,
        m: (a, g, p) => { if (Math.random() < 0.5) sigh(a, g, p); else a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [12, 17]; } },
      forgive: { g: 'mercy', sc: 'maj', lp: 1.25, hush: 10,
        m: (a, g, p) => { a.lyre('A3', 3, g * 0.5, p, 'maj', { gap: 0.55 }); return [15, 22]; },
        cue: [2.5, (a, g) => { a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.7, a: 2.2, s: 2, r: 4, pan: 0 }); a.lyre('A4', 3, g * 0.45, 0.2, 'maj', { gap: 0.6 }); }] },   // 父啊，赦免他们
      paradise: { g: 'mercy', sc: 'lyd', lp: 1.3,
        m: (a, g, p) => { a.lyre('A3', 3, g * 0.5, p, 'lyd', { gap: 0.55 }); return [15, 22]; },
        cue: [3, (a, g) => { a.note({ f: 'A5', g: g * 0.35, a: 0.004, d: 3.6, pan: -0.2, rev: 0.85 }); a.note({ f: 'Ds6', g: g * 0.25, a: 0.004, d: 3.4, at: 0.35, pan: 0.2, rev: 0.85 }); a.note({ f: 'E6', g: g * 0.3, a: 0.004, d: 4, at: 0.7, pan: 0, rev: 0.85 }); }] },
      mother: { g: 'mercy', sc: 'grief', lp: 1.05, hush: 10,
        m: (a, g, p) => { a.lyre('A3', 3, g * 0.45, p, 'grief', { gap: 0.6 }); return [15, 22]; },
        cue: [3.5, (a, g, p) => theme(a, g * 0.75, p, { minor: true, rock: true, beat: 0.42 })] },      // 伯利恒的摇篮曲，小调
      dark: { g: 'dark', sc: 'phryg', lp: 0.72,
        m: (a, g, p) => { if (Math.random() < 0.35) a.bowed(a.pick(['A2', 'Bb2']), g * 0.55, p); return [13, 19]; } },
      cry: { g: 'dark', sc: 'phryg', lp: 0.66, hush: 14,
        m: () => [10, 14],
        cue: [3, (a, g) => toll(a, 'A2', g * 0.9, 0)] },                                            // 第九时
      finished: { g: 'after', sc: 'sus', lp: 0.8, hush: 30,
        m: () => [12, 18],
        cue: [4, (a, g, p) => theme(a, g * 0.95, p * 0.4, { minor: true, wave: 'bowed', beat: 0.62 })] },   // 成了
      veil: { g: 'after', sc: 'sus', lp: 0.7, hush: 20,
        m: () => [14, 20],
        cue: [7, (a, g) => a.choir(['A2', 'E3', 'Cs4'], { gs: [1, 0.8, 0.5], g: g * 0.4, a: 2.4, s: 1.6, r: 4, pan: 0 })] },   // 这真是神的儿子
      tomb: { g: 'after', sc: 'sus', lp: 0.6, hush: 30,
        m: () => [14, 20],
        cue: [5, (a, g, p, r) => { if (said(r, /复活/)) a.note({ f: 'A5', g: g * 0.2, a: 0.004, d: 4.5, pan: 0.25, rev: 0.9 }); else sigh(a, g * 0.6, p, 1); }] },   // 三日后我要复活：静默里一点极轻的光
    },
    adj(lv, night, r, o, s) {
      const dead = !!(r.seen.finished || r.seen.veil || r.seen.tomb) || s.g === 'after';
      const dim = sm(0.12, 0.6, max(lv('gloom'), 0.7 * lv('storm')));
      if (dead) {
        o.g = { after: 1 };
        const tail = r.k >= r.n ? sm(4, 30, since('cross')) : 0;                                   // 末一句之后：几乎归于无声
        const thin = r.sec === 'tomb' || r.seen.tomb ? 0.42 : r.sec === 'veil' || r.seen.veil ? 0.55 : 0.68;
        o.pad = thin * (1 - 0.72 * tail);
        o.drone = (0.85 - 0.25 * dim) * (1 - 0.5 * tail);
        o.lp = 1000 * s.lp * (1 - 0.3 * dim) * (1 - 0.35 * tail);
        o.dlp = 0.8;
        o.tc = 4;
        return o;
      }
      if (dim > 0 && s.g !== 'mercy') o.g = stack([['dark', dim]], s.g);
      else if (dim > 0) o.g = stack([['dark', 0.6 * dim]], s.g);
      o.lp *= 1 - 0.35 * dim;
      o.drone = 1 + 0.3 * dim;
      o.dlp = 1 - 0.25 * dim;
      o.tc = 3.5;
      return o;
    },
    scale(lv, night, r, s) { return !r.seen.finished && s.g !== 'mercy' && lv('gloom') > 0.45 ? 'phryg' : null; },
  });

  // ══ 四福音 · 复活 ════════════════════════════════════════
  // 七日的头一日，天快亮的时候：从十字架的静默里接着（没有三音的空五度，几乎无声，慢慢涨起来）；
  // 石头滚开、白衣的天使：黎明——利底亚的玻璃一串升上去，铃；「马利亚！」「拉波尼！」：圣子的主题完整地回来，升上八度；
  // 以马忤斯的路（多利亚的走路的琴）——擘饼时眼睛开了（主题在竖琴上）；「愿你们平安」（合唱的 A6/9，吹一口气）；
  // 多马（利底亚：那没有看见就信的有福了）；提比哩亚海边的清晨（受洗一幕加利利的船歌回来了，这回是大调；一百五十三条鱼）；
  // 「你爱我吗？」三问三答；差遣：创世记「甚好」的那个和弦从低到高亮起（新的创造开始了），「我就常与你们同在」。
  score('risen', {
    weight: { drone: 0.5, pad: 1 },
    pad: { lp: 1400, night: 0.15, groups: {
      tomb: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.28, 0.1], ['A2', 's', 0.2, 0], ['E3', 'soft', 0.14, 0.2], ['B3', 's', 0.04, -0.3]],
      dawn: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.28, -0.15], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['Ds4', 's', 0.04, 0.4], ['Gs4', 's', 0.05, -0.45], ['A4', 's', 0.05, 0.2], ['E5', 's', 0.025, 0.5], ['A3', 'over', 0.05, 0]],
      name: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'flute', 0.15, -0.3], ['E4', 's', 0.08, 0.35], ['Fs4', 's', 0.05, 0.4], ['A4', 's', 0.045, -0.45]],
      road: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.14, 0.3], ['D4', 's', 0.05, 0.35], ['Fs4', 's', 0.06, -0.35]], pulse: [0.36, 0.12] },
      peace: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.17, 0], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.12, 0], ['Fs4', 'choir', 0.07, 0], ['B4', 's', 0.03, -0.45]],
      thomas: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['B3', 's', 0.08, 0.2], ['Cs4', 'soft', 0.15, 0.3], ['Gs4', 's', 0.06, -0.35], ['Ds5', 's', 0.025, 0.45]],
      shore: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['Fs4', 's', 0.07, 0.35], ['A3', 'flute', 0.07, -0.2], ['E4', 's', 0.06, 0.45]], pulse: [0.18, 0.2] },
      love: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.34, -0.2], ['Cs4', 'soft', 0.18, 0.3], ['Fs4', 's', 0.08, -0.4], ['A4', 'flute', 0.04, 0.35]],
      sent: [['A1', 's', 0.22, 0], ['E2', 's', 0.16, 0.1], ['A2', 's', 0.2, -0.1], ['Cs3', 's', 0.16, 0.2], ['E3', 's', 0.16, -0.25],
        ['B3', 't', 0.11, 0.3], ['Cs4', 't', 0.12, -0.35], ['E4', 't', 0.11, 0.4], ['Fs4', 't', 0.09, -0.45], ['A4', 't', 0.07, 0.5]],
    } },
    open: 'tomb',
    order: ['dawn', 'name', 'road', 'eyes', 'peace', 'thomas', 'shore', 'love', 'sent'],
    rules: {
      dawn: ['mt 28:1-15', 'mk 16:1-11', 'lk 24:1-12', 'jn 20:1-10'],
      name: ['jn 20:11-18'],
      road: ['lk 24:13-29', 'mk 16:12-13'],
      eyes: ['lk 24:30-35'],
      peace: ['jn 20:19-23', 'lk 24:36-49', 'mk 16:14'],
      thomas: ['jn 20:24-31'],
      shore: ['jn 21:1-14'],
      love: ['jn 21:15-25'],
      sent: ['mt 28:16-20', 'mk 16:15-20', 'lk 24:50-53'],
    },
    secs: {
      tomb: { g: 'tomb', sc: 'sus', lp: 0.6,
        m: (a, g) => { if (since('risen') > 10) a.note({ f: a.pick(['E5', 'A5', 'B5']), g: g * 0.3, a: 0.004, d: 3.2, pan: a.pan(), rev: 0.85 }); return [10, 16]; } },   // 第一线光
      dawn: { g: 'dawn', sc: 'lyd', lp: 1.35, hush: 9,
        m: (a, g, p) => { if (Math.random() < 0.45) dawnRise(a, g * 0.85); else a.lyre('A4', a.rint(4, 5), g * 0.65, p, 'lyd'); return [11, 15]; },
        m2: (a, g) => { a.glass(g * 0.3, 1); return [3.5, 6]; },
        cue: [2, (a, g) => dawnRise(a, g)] },
      name: { g: 'name', sc: 'maj', lp: 1.2, hush: 10,
        m: (a, g, p) => { if (Math.random() < 0.4) theme(a, g * 0.8, p); else a.lyre('A4', a.rint(3, 5), g * 0.6, p, 'maj', { gap: 0.34 }); return [12, 17]; },
        cue: [3, (a, g, p) => theme(a, g, p, { up: true })] },                                    // 马利亚！——拉波尼！
      road: { g: 'road', sc: 'dor', lp: 1,
        m: (a, g, p) => { a.lyre('A3', a.rint(6, 8), g * 0.6, p, 'dor', { gap: 0.4 }); return [11, 16]; } },
      eyes: { g: 'name', sc: 'maj', lp: 1.2, hush: 10,
        m: (a, g, p) => { a.lyre('A4', a.rint(4, 5), g * 0.65, p, 'maj'); return [12, 17]; },
        cue: [2.5, (a, g, p) => { theme(a, g * 0.9, p, { wave: 'harp' }); a.glass(g * 0.4, 2); }] },   // 他们的眼睛明亮了
      peace: { g: 'peace', sc: 'maj', lp: 1.2, hush: 10,
        m: (a, g, p) => { if (Math.random() < 0.5) shalom(a, g * 0.8); else a.lyre('A4', a.rint(3, 5), g * 0.6, p, 'maj'); return [13, 18]; },
        cue: [1.5, (a, g, p, r) => { shalom(a, g); if (at(r, 'jn 20:22') || said(r, /圣灵/)) breath(a, g, p); }] },   // 愿你们平安
      thomas: { g: 'thomas', sc: 'lyd', lp: 1.2,
        m: (a, g, p) => { a.lyre('A4', a.rint(3, 5), g * 0.6, p, 'lyd', { gap: 0.36 }); return [13, 19]; },
        cue: [3, (a, g) => a.glass(g * 0.5, 2)] },
      shore: { g: 'shore', sc: 'maj', lp: 1.2,
        m: (a, g, p) => { barcarolle(a, g * 0.85, p); return [11, 15]; },
        m2: (a, g) => { a.pluck(a.deg('maj', 'A4', a.rint(0, 9)), 0, g * 0.3, a.pan(), 0.6); return [2.5, 5]; },
        cue: [3, (a, g, p) => loaves(a, g * 0.9, p)] },                                           // 网满了
      love: { g: 'love', sc: 'maj', lp: 1.1, hush: 12,
        m: (a, g, p) => { a.shepherd(g * 0.85, p); return [12, 17]; },
        cue: [2, (a, g, p) => [0, 2.6, 5.2].forEach((t0, i) => a.pipe([['E4', 0.4], ['Fs4', 0.35], [['A4', 'B4', 'Cs5'][i], 1.2]], { g: g * 0.45, pan: p, bright: 4, breath: 0.2, vib: 9, rev: 0.62, at: t0 }))] },   // 你爱我吗？三次
      sent: { g: 'sent', sc: 'ion', lp: 1.6, hush: 10,
        m: (a, g, p) => { a.lyre('A4', a.rint(5, 7), g * 0.75, p, 'ion', { gap: 0.22 }); if (Math.random() < 0.5) a.bells(['A5', 'E6'], 0.3, g * 0.4, 3, 1.2); return [10, 14]; },
        m2: (a, g) => { a.glass(g * 0.3, 1); return [4, 7]; },
        cue: [2, (a, g, p) => { a.strings(['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5', 'A5'].map((n, i) => [n, 0.2 + i * 0.2, g * (0.95 - i * 0.06), 3.2]), { bright: 5, d: 3.2, rev: 0.65, spread: 0.3 }); a.bells(['A5', 'Cs6', 'E6'], 0.18, g * 0.7, 3, 1.9); a.choir(['A3', 'Cs4', 'E4', 'A4', 'Cs5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 0.6, a: 1.6, s: 2, r: 3.5, at: 2.6, pan: 0 }); }] },
    },
    adj(lv, night, r, o, s) {
      if (r.k === 0) {                                                                             // 天还没亮：从十字架的静默里慢慢涨起来
        const up = sm(0, 24, since('risen'));
        o.pad = 0.13 + 0.87 * up; o.drone = 0.4 + 0.5 * up; o.lp *= 0.8 + 0.3 * up;       // 从十字架末了的那一点声（约 0.12）接着涨，不是一下跳回来
      }
      if (s.g === 'sent') { o.drone = 0.75; o.dlp = 1.2; }
      return o;
    },
  });
})(window.GS);
