/* ─────────────────────────────────────────────────────────────
 * music/ot3.js —— 旧约各卷的乐曲（第三批）：以斯拉记 · 尼希米记 · 以斯帖记 · 诗篇 · 箴言 · 传道书 · 耶利米哀歌 · 以西结书 · 但以理书
 * 写法见 js/music/ot1.js 顶上的说明（乐垫各组 · mix · scale · motif · motif2），仍然全在 A 上。
 *
 * 本文件的做法：每一卷先写一个「此刻各组的分量」的函数（xxG(lv, night)，用 stack 按优先次序分配），
 *   mix、scale、motif 都从它读——音阶与乐句总跟着此刻最响的那一组走，逐句一致。
 *   本卷的程度多半是「立起来就一直留着」的（lin / exp 设到 1 之后不再归零），所以各组的分量
 *   多用「这一句才有的量」，或用后来立起的量把先前的关掉（门控），免得前面的颜色一直拖到卷末。
 * 波斯（书珊）的颜色：扬琴（santur）在 Shur 调式上——第二级是中立的二度（1.5 个半音），只在乐句里用，乐垫从不碰它。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  if (!GS || !GS.audio || !GS.audio.music) return;
  const music = GS.audio.music;
  const cl = x => (x > 1 ? 1 : x > 0 ? x : 0);
  const sm = (a, b, x) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const max = Math.max;
  // 按优先次序分配：前面的组先取（分量 × 余下的），最后剩下的归底组；和恒为 1
  function stack(order, base) {
    const g = {};
    let rem = 1;
    for (const [k, w] of order) { const x = cl(w) * rem; g[k] = (g[k] || 0) + x; rem -= x; }
    g[base] = (g[base] || 0) + rem;
    return g;
  }
  // 此刻分量最大的一组
  function top(g) {
    let k0 = null, w0 = -1;
    for (const k in g) if (g[k] > w0) { w0 = g[k]; k0 = k; }
    return k0;
  }
  // 正在立起的量（0 → 1 的途中）：立完之后不再算
  const rise = x => sm(0.02, 0.12, x) * (1 - sm(0.9, 1, x));
  // 波斯的 Shur：A、中立的 B（1.5 个半音）、C、D、E、F、G
  const SHUR = [0, 1.5, 3, 5, 7, 8, 10];

  // ── 共用的乐器与乐句 ─────────────────────────────────────
  // 扬琴（santur）：两根小槌敲出的一串，长音用轮奏（一连串很快的同音）
  function santur(a, g, p, o) {
    o = o || {};
    const sc = o.sc || SHUR, base = o.base || 'A3', n = a.rint(5, 8), ns = [];
    let i = a.rint(3, 6), at = 0;
    for (let k = 0; k < n; k++) {
      const last = k === n - 1, f = last ? a.deg(sc, base, a.pick([0, 0, 4])) : a.deg(sc, base, i);
      if (last || Math.random() < 0.22) {
        const r = last ? 7 : 3;
        for (let j = 0; j < r; j++) ns.push([f, at + j * 0.072, g * (0.62 - j * 0.05), 1.2]);
        at += r * 0.072 + 0.12;
      } else {
        ns.push([f, at, g * (k % 2 ? 0.66 : 0.85), 1.1]);
        at += a.pick([0.15, 0.15, 0.3]);
      }
      i = Math.min(9, Math.max(0, i + a.pick([-1, -1, 1, -2, 1, 2])));
    }
    a.strings(ns, { wave: 'harp', bright: 9, d: 1.1, pan: p, spread: 0.2, rev: 0.45 });
  }
  // 手鼓（daf / 以色列的鼓）：D 低沉的「咚」、t 鼓边的「嗒」带串铃、j 只有串铃、. 空拍
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
  // 远处的号角（公羊角）：一声五度，第二音滑上去
  function shofar(a, g, p) {
    a.note({ f: 'A3', type: 'reed', lp: 1300, g: g * 0.75, a: 0.1, s: 0.35, r: 0.8, pan: p, rev: 0.75 });
    a.note({ f: 'A3', type: 'reed', lp: 1500, path: [[a.hz('E4'), 0.22]], g: g * 0.7, a: 0.12, s: 1.1, r: 1.8, at: 0.6, vib: [5, 0.004], pan: p, rev: 0.8 });
  }
  // 号角的五度（A3 → E4）
  function hornCall(a, g, p) {
    a.note({ f: 'A3', type: 'warm', lp: 1300, g: g * 1.05, a: 0.12, s: 0.3, r: 1.1, vib: [5, 0.004], pan: p, rev: 0.75 });
    a.note({ f: 'E4', type: 'warm', lp: 1700, g, a: 0.15, s: 0.9, r: 2.2, at: 0.55, vib: [5, 0.004], pan: p, rev: 0.8 });
  }
  // 祭司的银号：两支号，同一句三音的号令
  function trumpets(a, g, p) {
    [[0, 0.16], [0.24, 0.16], [0.5, 1.2]].forEach(([at, d], i) => ['A4', 'E5'].forEach((n, j) =>
      a.note({ f: n, type: 'warm', lp: 2600, g: g * (j ? 0.4 : 0.62) * (i === 2 ? 1.1 : 0.9), a: 0.03, s: d, r: 0.5, at,
        vib: i === 2 ? [5.2, 0.003] : null, pan: j ? p + 0.2 : p - 0.2, rev: 0.7 })));
  }
  // 应答的诗篇（「他本为善，他的慈爱永远长存」）：I · IV · I，左右两班；minor = 哭号的银
  function antiphon(a, g, minor) {
    const I = ['A3', minor ? 'C4' : 'Cs4', 'E4', 'A4'], IV = ['A3', 'D4', minor ? 'F4' : 'Fs4', 'A4'];
    a.choir(I, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.9, a: 0.8, s: 0.7, r: 1.6, pan: -0.3 });
    a.choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 0.8, s: 0.6, r: 1.6, at: 2.2, pan: 0.3 });
    a.choir(I, { gs: [1, 0.8, 0.75, 0.55], g: g * 0.9, a: 0.9, s: 1.1, r: 2.8, at: 4.4, pan: 0 });
  }
  // 诵读（利未人念律法书）：人声在一个吟诵的音上，末了落回 A
  function chant(a, g, p) {
    const fig = a.pick([
      [['A3', 0.42], ['A3', 0.3], ['B3', 0.3], ['Cs4', 0.55], ['B3', 0.3], ['A3', 0.9]],
      [['E3', 0.35], ['A3', 0.45], ['A3', 0.3], ['A3', 0.3], ['B3', 0.4], ['A3', 0.3], ['Gs3', 0.3], ['A3', 1.0]],
      [['A3', 0.35], ['Cs4', 0.35], ['D4', 0.5], ['Cs4', 0.3], ['B3', 0.35], ['A3', 1.1]],
    ]);
    let at = 0;
    for (const [f, d] of fig) { a.note({ f, type: 'voice', lp: 1500, g: g * 0.55, a: 0.07, s: d * 0.85, r: 0.3, at, vib: [5, 0.0035], pan: p, rev: 0.65 }); at += d; }
  }
  // 活水：一串下行的玻璃般的拨弦
  function flowing(a, g, sc, n0) {
    const i0 = a.rint(8, 10), n = n0 || a.rint(5, 7), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'maj', 'A4', i0 - k), k * 0.12, g * (1 - k * 0.06), 1.8]);
    a.strings(ns, { wave: 'sine', bright: 2, d: 1.8, pan: a.pan(), spread: 0.35, rev: 0.75 });
  }
  // 眼泪：两三滴很慢的下行的玻璃
  function drops(a, g, sc) {
    const i0 = a.rint(7, 9), n = a.rint(2, 3), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'grief', 'A4', i0 - k), k * a.rnd(0.7, 1.1), g * (0.85 - k * 0.12), 2.4]);
    a.strings(ns, { wave: 'sine', bright: 2, d: 2.4, pan: a.pan(), spread: 0.25, rev: 0.85 });
  }
  // 远方的光点一个个聚来：左右交替，声像越来越靠中间
  function gathering(a, g, sc) {
    const n = a.rint(5, 7);
    for (let k = 0; k < n; k++) {
      const side = k % 2 ? 1 : -1, pan = side * (0.9 - k * (0.8 / n));
      a.ping(a.deg(sc || 'lyd', 'A5', a.rint(0, 6)), k * a.rnd(0.35, 0.55), g * (0.35 + 0.08 * k), pan);
    }
  }
  // 哀歌的「气纳」（qinah）韵律：三拍，一口气的停顿，再两拍——跛行的挽歌，落在 A 或 E
  function qinah(a, g, p, sc) {
    const i0 = a.rint(3, 5), d = a.rnd(0.75, 0.95), ns = [];
    ns.push([a.deg(sc, 'A3', i0), d, 1]);
    ns.push([a.deg(sc, 'A3', i0 + a.pick([0, 1])), d, 0.9]);
    ns.push([a.deg(sc, 'A3', i0 - 1), d * 1.25, 0.85]);
    ns.push([a.deg(sc, 'A3', i0 - 1), 0.4, 0.04]);                         // 停顿
    ns.push([a.deg(sc, 'A3', i0 - 2), d * 0.7, 0.85]);
    ns.push([a.pick([a.hz('A3'), a.hz('E3')]), 1.9, 0.75]);
    a.pipe(ns, { g: g * 0.5, pan: p, bend: true, bright: 3, breath: 0.5, vib: 14, vibHz: 4.6, rev: 0.7 });
  }
  // 一句宁静的里拉，缓缓地（给安息、守望的夜）
  const soft = (a, g, p, sc, n) => a.lyre(a.pick(['A3', 'A4']), n || a.rint(3, 4), g * 0.65, p, sc, { gap: 0.4 });
  // 迟来的一句里拉（应答的第二句）：api.lyre 不认 o.at，这里照它的写法自己排，整句推迟 at 秒
  function lyreAt(a, base, n, g, p, sc, o) {
    o = o || {};
    const L = (Array.isArray(sc) ? sc : a.SC[sc] || a.SC.maj).length, ns = [];
    let dir = Math.random() < 0.5 ? 1 : -1, i = a.rint(0, L - 1) + (dir < 0 ? L : 0), at = 0;
    for (let k = 0; k < n; k++) {
      const last = k === n - 1;
      ns.push([a.deg(sc, base, i), at, g * a.rnd(0.8, 1) * (last ? 1.1 : 1), last ? 3.6 : 2.6]);
      at += (o.gap || a.rnd(0.24, 0.34)) * (k === n - 2 ? 1.5 : 1);
      i += dir * (Math.random() < 0.8 ? 1 : 2);
      if (Math.random() < 0.18) dir = -dir;
    }
    a.strings(ns, { at: o.at || 0, pan: p, rev: 0.6, bright: 5, d: 2.8 });
  }
  // 一次性的乐句（签轮、绕城的两队……）：某个程度正在立起（lo 与 hi 之间）时奏一次，落回 lo 以下之后才可再奏。
  // 这样的时刻只有几秒：由次要的一层（motif2）每秒查看一次（引擎给乐句的间隔太长，会错过）
  const cued = {};
  function once(key, x, lo, hi, fn) {
    if (!(x > lo)) { cued[key] = 0; return false; }
    if (x < hi && !cued[key]) { cued[key] = 1; fn(); return true; }
    return false;
  }

  // ══ 以斯拉记 · 归回 ══════════════════════════════════════
  // 巴比伦的河边，琴挂在柳树上（爱奥利亚，低处的银）；心被激动、诏书的光（利底亚的上行）；
  // 往西的驼队、亚哈瓦河边的帐棚（多利亚，驼步般缓慢的脉动）；黎明的废墟、这殿仍然荒凉（没有三音的空）；
  // 立根基、搭脚手架（混合利底亚，匠人的节律）；「他本为善」——欢呼是金（大调的合唱），哭号是银（小调的应答），
  // ★ 到末了金与银合为一色：三音消失，只剩空阔的五度与九度，一声声传到远处；
  // 神施恩的手、应允、钉子、指望（温柔的 A6/9 与牧笛般的笛音）；雨中的会众（银）。
  const ezG = lv => {
    const stir = sm(0.45, 0.9, lv('ezStir'));
    const fast = lv('ezTents') * (1 - sm(0.5, 0.85, lv('ezHand'))) * (1 - lv('ezAnswer'));            // 亚哈瓦河边禁食的夜
    const conf = sm(1.03, 1.2, lv('ezFire')) * (1 - cl(max(lv('ezJoy'), 5 * lv('ezTribes'), lv('ezLamp'), lv('ezPeg'))));   // 晚祭的时候撕裂衣服
    const rain = sm(0.3, 0.6, lv('storm')) * (1 - lv('ezHope'));
    const silver = max(lv('ezHarps') * (1 - stir), 0.5 * lv('ezWeep') * (1 - lv('ezMix')), fast, conf, 0.85 * rain);
    const ruin = lv('ezRuin') * (1 - sm(0, 0.12, lv('ezDecree'))) * (1 - lv('ezStir')) * (1 - 0.6 * lv('ezAltar'));
    const waste = max(lv('ezWeeds'), 0.7 * sm(0.4, 0.9, lv('ezHouses')) * (1 - lv('ezScaf')) * (1 - sm(0.5, 0.9, lv('ezBuild'))));
    const build = max(lv('ezScaf'), rise(lv('ezFound')), rise(lv('ezRaft') / 1.5));
    const praise = max(lv('ezPraise'), lv('ezJoy'), 0.6 * lv('ezPlay'), 0.7 * lv('ezLamp'), 0.8 * lv('ezTribes'));
    const one = max(lv('ezMix'), 0.8 * lv('ezFar'));
    const hand = max(0.8 * stir, lv('ezHand') * (1 - 0.6 * lv('ezTents')), 0.6 * lv('ezEye'), 0.8 * sm(0.7, 1, lv('ezStone')), lv('ezAnswer'),
      0.8 * lv('ezScroll'), lv('ezPeg') * (1 - rain), lv('ezHope'), 0.5 * lv('ezAltar') * (1 - lv('ezFound')),
      0.75 * sm(0.5, 1, lv('ezBuild')) * sm(0.9, 0.97, lv('ezFire')));                                  // 殿造成了（坛上的火正旺；以斯拉起程时火小了，这一色便退去）
    return stack([['one', one], ['silver', silver], ['praise', praise], ['hand', hand], ['build', build], ['ruin', max(ruin, waste)]], 'road');
  };
  music('ezra', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      road: { v: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.14, 0.3], ['D4', 's', 0.07, -0.35], ['A3', 'flute', 0.05, 0.4]], pulse: [0.7, 0.16] },
      silver: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'warm', 0.09, 0.25], ['F3', 's', 0.065, 0.35]],
      ruin: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.34, -0.1], ['A2', 'soft', 0.1, 0.2], ['D3', 'soft', 0.17, -0.3], ['G3', 's', 0.07, 0.35]],
      build: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['G3', 'soft', 0.12, -0.3], ['Cs4', 'soft', 0.13, 0.3], ['E4', 's', 0.06, -0.4]], pulse: [1.6, 0.26] },
      praise: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.2, 0], ['Cs4', 'choir', 0.16, 0], ['E4', 'choir', 0.14, 0], ['A4', 'choir', 0.08, 0]],
      one: [['A1', 's', 0.3, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.26, -0.2], ['B3', 's', 0.12, 0.3], ['E4', 's', 0.09, -0.4], ['B4', 's', 0.05, 0.45], ['E5', 's', 0.028, -0.5], ['A3', 'over', 0.05, 0]],
      hand: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'flute', 0.15, 0.3], ['Fs4', 's', 0.07, -0.35], ['B4', 's', 0.035, 0.45], ['E5', 's', 0.015, -0.5]],
    } },
    mix(lv) {
      const g = ezG(lv);
      const lp = 1300 * (1 + 0.8 * g.one + 0.6 * g.praise + 0.5 * g.hand + 0.2 * g.build) * (1 - 0.3 * g.silver) * (1 - 0.3 * g.ruin) * (1 - 0.25 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.2 * g.silver - 0.15 * g.ruin + 0.15 * g.one, drone: 1 + 0.15 * g.silver - 0.15 * g.praise };
    },
    scale(lv) {
      switch (top(ezG(lv))) {
        case 'one': return 'sus';                                            // 欢呼与哭号不能分辨：三音不见了
        case 'silver': return 'aeol';
        case 'praise': return 'maj';
        case 'hand': return max(lv('ezAnswer'), lv('ezStir')) > 0.5 ? 'lyd' : 'maj';
        case 'build': return 'mixo';
        case 'ruin': return lv('ezWeeds') > 0.3 || lv('ezHouses') > 0.7 ? 'dor' : 'sus';
        default: return 'dor';
      }
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(ezG(lv))) {
        case 'one': {                                                        // 合为一声，一声声传到远处
          const ch = ['A3', 'E4', 'B4', 'E5'], gs = [1, 0.85, 0.6, 0.4];
          a.choir(ch, { gs, g: g * 0.95, a: 0.7, s: 1.2, r: 2.2, pan: 0 });
          a.choir(ch, { gs, g: g * 0.42, a: 0.9, s: 0.8, r: 2.4, at: 3.2, pan: -0.6, rev: 0.95 });
          a.choir(ch, { gs, g: g * 0.2, a: 1.1, s: 0.6, r: 2.6, at: 6.2, pan: 0.65, rev: 0.95 });
          return [11, 15];
        }
        case 'silver':
          if (lv('ezHarps') > 0.5) {                                          // 琴挂在柳树上：风里只响一根弦
            if (Math.random() < 0.5) a.strings([[a.pick(['A3', 'E3', 'C4']), 0, g * 0.55, 4]], { bright: 3, d: 4, pan: p, spread: 0, rev: 0.85 });
            else a.ney(g, p);
            return [14, 22];
          }
          if (lv('ezWeep') > 0.5) { antiphon(a, g, true); return [10, 14]; }  // 老年人的哭号：银的应答
          if (sm(0.3, 0.6, lv('storm')) > 0.5) return [8, 12];               // 大雨本身就是音乐
          if (Math.random() < 0.5) a.ney(g * 0.95, p); else a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p);
          return [13, 20];
        case 'praise':
          if (lv('ezJoy') > 0.5 || lv('ezLamp') > 0.5) {                       // 逾越节：欢欢喜喜
            a.lyre('A4', a.rint(5, 7), g * 0.85, p, 'maj', { gap: 0.17 });
            if (Math.random() < 0.6) timbrel(a, g * 0.8, -p, 'D.tD.t.tD.t.', 0.19);
            return [9, 13];
          }
          if (lv('ezPlay') > 0.5 && Math.random() < 0.4) { trumpets(a, g, p); return [8, 12]; }
          antiphon(a, g, false); return [10, 14];                             // 他本为善，他向以色列人永发慈爱
        case 'hand':
          if (lv('ezAnswer') > 0.5) { a.angelRun(g * 0.85); return [8, 12]; }  // 光柱降在营上
          if (lv('ezStir') > 0.5) { a.lyre('A3', a.rint(5, 7), g * 0.8, p, 'lyd', { gap: 0.2 }); return [9, 14]; }   // 心被激动：一句上行的琴
          if (lv('ezHope') > 0.5 && Math.random() < 0.5) { a.shepherd(g * 0.85, p); return [12, 17]; }
          a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.32 }); return [13, 19];
        case 'build':
          if (lv('ezPlay') > 0.15) { trumpets(a, g * 0.9, p); return [8, 12]; }   // 祭司穿礼服吹号
          a.lyre('A3', a.rint(4, 6), g * 0.8, p, 'mixo', { gap: 0.22 }); return [11, 16];
        case 'ruin': a.bowed(a.pick(['A2', 'D3', 'E3', 'G3']), g * 0.8, p); return [15, 23];
        default:                                                              // 回家的路：苇笛与牧笛
          if (a.night() > 0.5) { soft(a, g, p, 'dor'); return [16, 24]; }
          if (Math.random() < 0.5) a.ney(g * 0.9, p); else a.shepherd(g * 0.85, p);
          return [14, 21];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, k = top(ezG(lv));
      if (lv('ezAnswer') > 0.4 || lv('ezHope') > 0.6) { a.glass(g * 0.5, 1); return [4, 7]; }
      if (lv('ezLamp') > 0.3 || lv('ezTribes') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.5, a.pan()); return [1.2, 2.6]; }   // 十二点火、家家的灯
      if (lv('ezStir') > 0.5 && lv('ezDecree') > 0.5) { a.starPing(g * 0.8); return [1.5, 3.5]; }                                              // 河边升起的微光
      if (k === 'road' && a.night() < 0.5 && (sm(0.1, 0.25, lv('ezStir')) > 0.5 || lv('ezTents') > 0.5)) {                                    // 驼队的小铃
        a.ping(a.pick(['A5', 'E5', 'Cs6']), 0, g * 0.28, a.pan()); a.ping(a.pick(['A5', 'B5']), 0.23, g * 0.2, a.pan());
        return [2.5, 5];
      }
      if (lv('ezEye') > 0.5) { a.glass(g * 0.4, 1); return [5, 8]; }
      return [5, 9];
    },
  });

  // ══ 尼希米记 · 城墙 ══════════════════════════════════════
  // 书珊的宫（扬琴在 Shur 上，弗里几亚的影）；「城墙拆毁」——夜里的哭泣与祷告（爱奥利亚）；
  // 散在天涯的微光聚回、神施恩的手（利底亚：光点从左右两边聚到中间）；月光下的废墟（没有三音的空、一点月的微光）；
  // 各家各段修造：抹子与石头的节律（混合利底亚的脉动），敌营的火与吹角的人（公羊角）；
  // 律法书在水门前展开（风琴般的偶次泛音，伊奥尼亚，利未人的诵读）；住棚节与告成之礼：
  // ★ 两大队称谢的人一左一右绕城而行，在殿里相遇——合唱的声像从中间分开，又合在中间。
  const neG = lv => {
    const susa = lv('neSusa'), jeru = lv('neJeru'), wall = lv('neWall');
    const grief = max(susa * (1 - sm(0.2, 0.35, lv('neVision'))) * (1 - lv('neGather')), lv('neSack'));
    const gather = max(susa * max(lv('neGather') * sm(0.7, 0.95, lv('neVision')), lv('neHand'), 0.7 * lv('nePray')),
      (1 - susa) * max(lv('neGlow'), lv('neHoly'), lv('neHand')));
    const ruins = jeru * (1 - sm(0.08, 0.3, wall));
    const build = jeru * sm(0.08, 0.3, wall) * (1 - sm(0.93, 1, wall));
    const law = max(sm(0.5, 0.9, lv('neScroll')), 0.8 * lv('neCovenant'), 0.8 * lv('nePillar'));
    const fest = lv('nePulpit') * (1 - sm(0.5, 0.9, lv('neScroll'))) * (1 - lv('neSack')) * (1 - lv('neCovenant')) * (1 - lv('nePillar'));   // 七月的聚会
    const choir = max(lv('neJoy'), lv('neChoir') * (1 - sm(0.05, 0.15, lv('neAltar')) * (1 - lv('neJoy'))), 0.8 * lv('neBooths'), 0.65 * fest);
    return stack([['choir', choir], ['law', law], ['grief', grief], ['gather', gather], ['susa', susa], ['build', build], ['ruins', ruins]], 'city');
  };
  // 告成之礼：两大队称谢的人一左一右绕城而行，在殿里相遇（尼 12:31–40）
  function procession(a, g) {
    const I = ['A3', 'Cs4', 'E4'], IV = ['A3', 'D4', 'Fs4'], gs = [1, 0.8, 0.6];
    [[I, 0.2], [IV, 0.55], [I, 0.85]].forEach(([ch, pn], i) => {
      a.choir(ch, { gs, g: g * 0.62, a: 0.4, s: 0.8, r: 1.1, at: i * 1.6, pan: -pn });
      a.choir(ch, { gs, g: g * 0.62, a: 0.4, s: 0.8, r: 1.1, at: i * 1.6 + 0.8, pan: pn });
    });
    a.choir(['A3', 'E4', 'A4', 'Cs5'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.95, a: 0.9, s: 1.4, r: 3, at: 5, pan: 0 });
  }
  music('nehemiah', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      city: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['D4', 'soft', 0.1, -0.3], ['Fs4', 's', 0.05, 0.4]],
      susa: [['A1', 's', 0.3, 0], ['A2', 's', 0.26, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 'over', 0.06, 0.1], ['D4', 'soft', 0.08, 0.3], ['G4', 's', 0.035, -0.4]],
      grief: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.24, -0.3], ['G3', 'soft', 0.1, 0.3], ['D4', 's', 0.055, -0.35]],
      gather: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['B3', 's', 0.12, 0.25], ['Cs4', 'soft', 0.13, -0.3], ['Gs4', 's', 0.045, 0.4], ['Ds5', 's', 0.02, -0.5]],
      ruins: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.34, -0.1], ['A2', 'soft', 0.1, 0.2], ['D3', 'soft', 0.16, -0.3], ['E4', 's', 0.035, 0.4]],
      build: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['G3', 'soft', 0.12, -0.3], ['Cs4', 'soft', 0.12, 0.3], ['D4', 's', 0.05, -0.4]], pulse: [1.8, 0.28] },
      law: [['A1', 's', 0.28, 0], ['A2', 's', 0.3, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['A2', 'over', 0.08, 0], ['E4', 's', 0.06, -0.4]],
      choir: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.19, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.14, 0], ['Fs4', 'choir', 0.07, 0], ['A4', 'choir', 0.07, 0]],
    } },
    mix(lv) {
      const g = neG(lv), foe = cl(lv('neFoe'));
      const lp = 1300 * (1 + 0.7 * g.choir + 0.6 * g.law + 0.6 * g.gather + 0.15 * g.build) * (1 - 0.3 * g.grief) * (1 - 0.3 * g.ruins) * (1 - 0.3 * foe);
      return { g, lp, dlp: 1 - 0.2 * g.grief - 0.15 * g.ruins - 0.15 * foe, drone: 1 + 0.15 * g.ruins + 0.15 * foe - 0.15 * g.choir };
    },
    scale(lv) {
      switch (top(neG(lv))) {
        case 'choir': return 'maj';
        case 'law': return 'ion';
        case 'grief': return lv('neSack') > 0.5 ? 'dor' : 'aeol';
        case 'gather': return max(lv('neHand'), lv('neHoly')) > 0.5 ? 'maj' : 'lyd';
        case 'susa': return 'phryg';
        case 'build': return lv('neFoe') > 0.4 ? 'phryg' : 'mixo';
        case 'ruins': return 'sus';
        default: return 'dor';
      }
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(neG(lv))) {
        case 'choir': {
          const c = lv('neChoir');
          if (c > 0.02 && c < 0.97) return [3, 5];                            // 两队绕城而行：由 motif2 奏（见 procession）
          if (lv('neBooths') > 0.3 && lv('neJoy') < 0.3) {                    // 住棚：青翠的枝子，棚里的灯
            a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.2 });
            if (Math.random() < 0.6) timbrel(a, g * 0.7, -p, 'D.t.tD.t.t..', 0.2);
            return [10, 14];
          }
          if (lv('neJoy') > 0.4) {                                             // 欢声听到远处
            antiphon(a, g, false);
            if (Math.random() < 0.5) timbrel(a, g * 0.7, p, 'D.tD.tD.t.t.', 0.19);
            return [10, 14];
          }
          if (Math.random() < 0.5) chant(a, g, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.26 });
          return [12, 17];
        }
        case 'law':
          if (lv('nePillar') > 0.4) { a.bowed('A2', g * 0.7, p); a.glass(g * 0.45, 2); return [10, 14]; }   // 旷野里火柱的回影
          chant(a, g, p); return [10, 15];                                    // 以斯拉展开律法书
        case 'grief':
          if (Math.random() < 0.55) a.ney(g * 1.05, p); else a.bowed(a.pick(['A2', 'C3', 'E3', 'G3']), g * 0.85, p);
          return [13, 19];
        case 'gather':
          if (lv('nePray') > 0.4) { a.pipe([['A4', 0.9], ['B4', 0.7], ['Cs5', 0.7], ['E5', 1.6]], { g: g * 0.42, pan: 0, bright: 3, breath: 0.3, vib: 9, rev: 0.75 }); return [9, 13]; }  // 默祷：一线上升
          if (lv('neHand') > 0.5 || lv('neHoly') > 0.5) { a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.3 }); return [12, 17]; }
          gathering(a, g, 'lyd'); return [7, 11];
        case 'susa': santur(a, g * 0.9, p); return [12, 18];                   // 书珊的宫
        case 'build':
          if (lv('neFoe') > 0.4) { shofar(a, g, p); return [9, 13]; }         // 吹角的人在我旁边
          a.lyre('A3', a.rint(4, 6), g * 0.75, p, 'mixo', { gap: 0.2 });
          a.knocks([[0.1, 2400, 330, g * 0.35, false], [0.55, 2600, 350, g * 0.3, false], [1.0, 2400, 330, g * 0.35, false]], { lp: 5000, pan: -p, rev: 0.3 });  // 抹子与石头
          return [10, 15];
        case 'ruins':
          if (Math.random() < 0.5) a.ney(g * 0.85, p); else a.bowed(a.pick(['A2', 'D3', 'E3']), g * 0.8, p);
          return [15, 23];
        default:
          if (a.night() > 0.5) { soft(a, g, p, 'dor'); return [16, 24]; }
          if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'dor', { gap: 0.3 });
          return [14, 21];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (once('neChoir', lv('neChoir'), 0.02, 0.6, () => procession(a, g))) return [7, 9];
      if (lv('neSusa') > 0.5 && lv('neGather') > 0.05 && lv('neGather') < 0.97) { gathering(a, g * 0.8, 'lyd'); return [3, 5]; }   // 天涯的微光聚回
      if (lv('neLamps') > 0.6 || lv('neBooths') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.45, a.pan()); return [1.5, 3.2]; }
      if (lv('neVillage') > 0.6 && a.night() > 0.5) { a.ping(a.pick(['E5', 'A5', 'B5']), 0, g * 0.3, a.pan() * 1.3); return [2.5, 5]; }  // 远山上各城的灯
      if (lv('neClean') > 0.5) { a.glass(g * 0.4, 1); return [5, 8]; }       // 乳香的烟
      if (lv('neFoe') > 0.5) { a.pluck(a.deg('phryg', 'A4', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.5); return [2, 4]; }   // 敌营的火
      return [1, 1.5];                                                        // 没有什么可奏：每秒看一眼（绕城的两队）
    },
  });

  // ══ 以斯帖记 · 隐藏的手 ═══════════════════════════════════
  // 全卷不提神的名：书珊的宫（扬琴在 Shur 上，风琴般的 A 与 E）；御园与王的筵席（Hijaz 的香气：b2 与大三度，乌德与手鼓）；
  // 王的忿怒、哈曼的怒气、木架（弗里几亚的脉动）；麻衣与灰（爱奥利亚、苇笛）；
  // 隐藏的光（高处的利底亚，#4 的微光）——它从不走开，只是在各组底下以分量藏着；王睡不着的夜，众星守望；
  // ★ 签轮：十二个月一圈的扬琴越转越慢，停在第十二个（亚达月）上；到了「反倒」，签轮倒转，一路上行落在大三度；
  // 犹大人有光荣（大调的合唱）；普珥日：手鼓的舞与合唱，「转忧为喜、转悲为乐」。
  const etG = lv => {
    const turned = sm(-0.5, 0.5, lv('etRill'));                              // 陇沟的水转了方向（王的心在耶和华手中）
    const wrath = max(lv('etWrath'), lv('etHWrath'), lv('etGalLit'), 0.6 * lv('etShadow') * (1 - turned));
    const ash = lv('etAsh') * (1 - turned);
    const lots = lv('etLots') * (1 - lv('etTurn')) * (1 - sm(0.5, 0.9, lv('etProvRed')));
    const glory = max(lv('etGlory'), lv('etPur'), lv('etTurn'), lv('etCrownM'), sm(0.2, 0.8, lv('etGold')) * (1 - lv('etFeast')));
    const hidden = max(0.7 * lv('etHidden'), lv('etWatch'), 0.8 * lv('etKingLamp'), 0.7 * lv('etRead') * (1 - lv('etBanquet')), 0.6 * lv('etScroll'));
    const feast = max(lv('etFeast'), lv('etBanquet'));
    return stack([['wrath', wrath], ['ash', ash], ['lots', lots], ['glory', glory], ['hidden', hidden], ['feast', feast]], 'court');
  };
  // 签轮：一圈七个音（Shur），越转越慢，停在低处的中立二度上；倒转时从下往上，渐入大调，停在 C#
  function lotWheel(a, g, p, back) {
    const ns = [];
    let at = 0, dt = back ? 0.3 : 0.1;
    const n = 14;
    for (let k = 0; k < n; k++) {
      const sc = back && k > n / 2 ? 'ion' : SHUR;
      const f = back ? a.deg(sc, 'A3', k % 7 + (k > 6 ? 7 : 0)) : a.deg(SHUR, 'A4', 6 - (k % 7));
      ns.push([f, at, g * (0.7 - 0.02 * k), 1.3]);
      at += dt; dt *= back ? 0.9 : 1.13;
    }
    const last = back ? a.hz('Cs5') : a.deg(SHUR, 'A3', 1);
    for (let j = 0; j < 7; j++) ns.push([last, at + 0.15 + j * 0.075, g * (0.7 - j * 0.06), 1.8]);
    a.strings(ns, { wave: 'harp', bright: 8, d: 1.3, pan: p, spread: 0.25, rev: 0.55 });
    if (back) a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.7, a: 0.9, s: 1, r: 2.4, at: at + 0.3, pan: 0 });
  }
  music('esther', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1300, groups: {
      court: [['A1', 's', 0.3, 0], ['A2', 's', 0.26, 0], ['E3', 'soft', 0.28, -0.15], ['D4', 'soft', 0.08, 0.3], ['E4', 's', 0.05, -0.35], ['A3', 'over', 0.05, 0.1]],
      feast: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, 0.15], ['Cs4', 'soft', 0.14, -0.3], ['Bb3', 's', 0.035, 0.35], ['E4', 's', 0.07, -0.4], ['A3', 'over', 0.05, 0]],
      wrath: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.24, 0.3], ['E3', 'soft', 0.1, -0.2]], pulse: [0.8, 0.3] },
      ash: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.32, -0.1], ['C3', 'soft', 0.24, 0.3], ['E3', 'warm', 0.08, -0.25], ['F3', 's', 0.065, 0.35]],
      hidden: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['Ds4', 's', 0.05, -0.35], ['Gs4', 's', 0.04, 0.4], ['E5', 's', 0.018, -0.5]],
      lots: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['D3', 'soft', 0.18, -0.3], ['B3', 's', 0.07, 0.3], ['E4', 's', 0.04, -0.4]], pulse: [1.25, 0.28] },
      glory: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.13, 0], ['A4', 'choir', 0.08, 0], ['Fs4', 's', 0.04, -0.4]],
    } },
    mix(lv) {
      const g = etG(lv);
      const lp = 1300 * (1 + 0.7 * g.glory + 0.4 * g.hidden + 0.3 * g.feast) * (1 - 0.35 * g.wrath) * (1 - 0.3 * g.ash) * (1 - 0.15 * g.lots);
      return { g, lp, dlp: 1 - 0.2 * g.wrath - 0.15 * g.ash, drone: 1 + 0.2 * g.wrath - 0.15 * g.glory };
    },
    scale(lv) {
      return { wrath: 'phryg', ash: 'aeol', lots: 'sus', glory: 'maj', hidden: 'lyd', feast: 'hijaz', court: 'dor' }[top(etG(lv))] || 'dor';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(etG(lv))) {
        case 'wrath':
          a.bowed(a.pick(['A2', 'Bb2', 'C3', 'E3']), g * 0.85, p);
          if (Math.random() < 0.4) a.knocks([[0, 300, 72, g * 1.1, true], [0.7, 300, 70, g * 0.8, true]], { lp: 700, pan: -p, rev: 0.6 });
          return [12, 18];
        case 'ash': a.ney(g * 1.05, p); return [13, 19];                       // 麻衣与灰：各处的哀哭
        case 'lots':
          if (lv('etLot') > 0.02 && lv('etLot') < 0.98) return [3, 5];       // 签在轮上转：由 motif2 奏（lotWheel）
          santur(a, g * 0.8, p); return [11, 16];
        case 'glory':
          if (lv('etTurn') > 0.05 && lv('etTurn') < 0.97) return [3, 5];     // 签轮反转：由 motif2 奏
          if (lv('etPur') > 0.4 || lv('etFeast') > 0.5) {                     // 普珥日：手鼓与舞
            timbrel(a, g * 0.85, -p, 'D.tD.tD.t.t.D.tD.t.', 0.18);
            a.lyre('A4', a.rint(5, 7), g * 0.8, p, 'maj', { gap: 0.18, });
            if (Math.random() < 0.5) a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.7, a: 0.6, s: 0.8, r: 1.8, at: 1.6, pan: 0 });
            return [8, 11];
          }
          if (lv('etScepter') > 0.3) { a.glass(g * 0.6, 2); a.lyre('A4', 5, g * 0.8, p, 'maj', { gap: 0.2 }); return [10, 14]; }   // 金杖伸出
          a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.24 });
          if (Math.random() < 0.5) a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.65, a: 0.8, s: 0.9, r: 2, at: 1.2, pan: 0 });
          return [11, 15];
        case 'hidden':
          if (lv('etWatch') > 0.4 || a.night() > 0.5) { soft(a, g, p, 'lyd', 3); return [14, 20]; }   // 不打盹也不睡觉
          a.lyre('A4', a.rint(3, 4), g * 0.65, p, 'lyd', { gap: 0.36 }); return [15, 22];
        case 'feast':
          if (Math.random() < 0.55) { a.oud(g, p); timbrel(a, g * 0.55, -p, 'D..tD.t.', 0.18); } else santur(a, g * 0.9, p, { sc: 'hijaz' });
          return [10, 15];
        default: santur(a, g * 0.9, p); return [13, 20];                     // 书珊的宫
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (once('etLot', lv('etLot'), 0.01, 0.6, () => lotWheel(a, g, a.pan(), false))) return [6, 8];   // 签在轮上转，越转越慢
      if (once('etTurn', lv('etTurn'), 0.03, 0.6, () => lotWheel(a, g, a.pan(), true))) return [6, 8];                            // 反倒：签轮倒转
      const prov = lv('etProv');
      if (prov > 0.2 && prov < 0.97 && lv('etProvRed') < 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.35, a.pan() * 1.3); return [0.5, 1.2]; }   // 一百二十七省的灯
      if (lv('etProvGold') > 0.1 && lv('etProvGold') < 0.95) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.4, a.pan() * 1.3); return [0.6, 1.3]; }  // 金色的谕旨飞遍各省
      if (lv('etWatch') > 0.4) { a.starPing(g * 0.9); return [0.8, 2]; }      // 众星守望
      if (lv('etLamps') > 0.4 && a.night() > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.4, a.pan()); return [1.4, 3]; }
      if (lv('etScepter') > 0.4) { a.glass(g * 0.45, 1); return [3, 5]; }
      return [1, 1.5];                                                        // 每秒看一眼签轮
    },
  });

  // ══ 诗篇 · 诗篇 ══════════════════════════════════════════
  // 溪水旁的树、青草地上的羊群（A6/9，大卫的琴与牧笛）；★ 月亮星宿连成一张琴（利底亚，星的竖琴一扫而过）；
  // 诸天述说（伊奥尼亚的光辉、风琴、上行的铃）；死荫的幽谷（爱奥利亚）——「你与我同在」；福杯满溢；
  // 耶和华的声音发在水上（混合利底亚的低吼，缓慢的滚动）；「你们要休息」（没有三音的静，苇笛）；
  // 千年如已过的昨日：日夜飞转——乐垫每十秒起伏一次，如同一日；「你发出你的灵」：活水与鸟；
  // 上行之诗（提灯往殿去的夜，利底亚）；清晨的翅膀；★ 诗篇一百五十篇：号角、琴瑟、鼓、舞、丝弦、箫、钹，轮流赞美，合唱在上。
  const psG = (lv, night) => {
    const n = night || 0;
    const praise = max(lv('psPraise'), lv('psBreath'));
    const storm = max(lv('psSway'), sm(0.3, 0.8, lv('storm')));
    const shadow = sm(0.1, 0.5, lv('gloom')) * (1 - 0.6 * lv('psWith'));
    const glory = max(lv('psLine'), 0.85 * lv('psOil'), lv('psFace'), 0.8 * lv('psWings'));
    const aeon = max(lv('psField'), lv('psWither')) * (1 - lv('psSpring'));
    const stars = max(lv('psLyre') * sm(0.4, 0.9, n), lv('psLamp'), lv('psKeep'));
    const still = max(lv('psRay'), 0.8 * lv('psDeer') * (1 - lv('psVine')));
    return stack([['praise', praise], ['storm', storm], ['shadow', shadow], ['glory', glory], ['aeon', aeon], ['stars', stars], ['still', still]], 'pasture');
  };
  let ps150 = 0;
  music('psalms', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      pasture: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['Fs4', 's', 0.07, -0.35], ['B4', 's', 0.03, 0.45], ['A4', 'flute', 0.03, -0.5]],
      stars: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 's', 0.12, -0.3], ['Cs4', 'soft', 0.1, 0.3], ['Gs4', 's', 0.045, 0.4], ['Ds5', 's', 0.025, -0.45], ['Cs5', 's', 0.02, 0.5]],
      glory: [['A1', 's', 0.25, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.26, -0.15], ['Cs4', 'soft', 0.15, 0.25], ['E4', 's', 0.1, -0.35], ['A4', 's', 0.06, 0.45], ['Cs5', 's', 0.035, -0.5], ['A2', 'over', 0.07, 0]],
      shadow: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.25, -0.3], ['E3', 'soft', 0.1, 0.25], ['F3', 's', 0.06, 0.35]],
      storm: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.36, 0.1], ['A2', 'over', 0.1, 0], ['D3', 'soft', 0.2, -0.3], ['G3', 'soft', 0.1, 0.3]], pulse: [0.45, 0.25] },
      still: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 's', 0.12, 0.3], ['E4', 's', 0.06, -0.4], ['A4', 'flute', 0.03, 0.45]],
      aeon: { v: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'soft', 0.12, -0.2], ['E3', 'soft', 0.16, 0.25], ['B3', 's', 0.07, -0.35], ['Fs4', 's', 0.03, 0.45]], pulse: [0.105, 0.35] },
      praise: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.19, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.14, 0], ['A4', 'choir', 0.08, 0], ['A2', 'over', 0.05, 0]],
    } },
    mix(lv, night) {
      const g = psG(lv, night);
      const lp = 1400 * (1 + 0.8 * g.glory + 0.6 * g.praise + 0.45 * g.stars + 0.2 * g.pasture) * (1 - 0.4 * g.shadow) * (1 - 0.3 * g.storm) * (1 - 0.2 * g.still) * (1 - 0.1 * g.aeon);
      return { g, lp, dlp: 1 - 0.25 * g.shadow + 0.1 * g.glory, drone: 1 + 0.25 * g.storm + 0.1 * g.shadow - 0.1 * g.praise };
    },
    scale(lv, night) {
      switch (top(psG(lv, night))) {
        case 'praise': return 'maj';
        case 'storm': return 'mixo';
        case 'shadow': return 'aeol';
        case 'glory': return lv('psWings') > 0.5 ? 'lyd' : lv('psLine') > 0.5 ? 'ion' : 'maj';
        case 'aeon': return 'dor';
        case 'stars': return 'lyd';
        case 'still': return 'sus';
        default: return lv('psVine') > 0.05 && lv('psField') < 0.05 && lv('psFace') < 0.5 ? 'dor' : 'maj';
      }
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(psG(lv, a.night()))) {
        case 'praise': {                                                       // 诗篇 150：轮流赞美
          const k = ps150++ % 6;
          if (k === 0) { trumpets(a, g, p); a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.7, a: 0.7, s: 0.8, r: 2, at: 1.4, pan: 0 }); }   // 角声
          else if (k === 1) { a.lyre('A4', a.rint(6, 8), g * 0.85, p, 'maj', { gap: 0.15 }); }                                                                         // 琴瑟
          else if (k === 2) { timbrel(a, g * 0.9, p, 'D.tD.tD.t.t.D.tD.tDt', 0.17); a.shepherd(g * 0.8, -p); }                                                   // 击鼓跳舞
          else if (k === 3) { a.strings(['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5'].map((n, i) => [n, i * 0.1, g * 0.7, 2.4]), { bright: 5, d: 2.4, spread: 0.3, rev: 0.6 }); a.pipe([['E5', 0.4], ['Fs5', 0.3], ['E5', 0.3], ['Cs5', 0.5], ['A4', 1.2]], { g: g * 0.45, pan: -p, bright: 4, breath: 0.25, vib: 10, at: 0.8, rev: 0.6 }); }   // 丝弦与箫
          else if (k === 4) { a.burst({ buf: 'white', f: 6500, q: 0.5, g: g * 0.5, a: 0.004, d: 1.6, pan: p, rev: 0.5 }); antiphon(a, g, false); }             // 大响的钹
          else { a.chord(['A2', 'E3', 'A3', 'Cs4', 'E4'], { type: 'over', lp: 2400, g: g * 0.55, a: 0.8, s: 1.5, r: 2.5, spread: 0.4, rev: 0.6 }); a.lyre('A4', a.rint(4, 6), g * 0.75, p, 'maj', { gap: 0.2 }); }   // 风琴
          return [7, 10];
        }
        case 'storm':
          if (Math.random() < 0.35) a.note({ f: 'A2', type: 'warm', lp: 700, g: g * 1.1, a: 1.2, s: 1.4, r: 3, path: [[a.hz('E3'), 2.4]], pan: p, rev: 0.7 });   // 耶和华的声音发在水上
          return [9, 13];
        case 'shadow':
          if (lv('psWith') > 0.3) { a.lyre('A3', a.rint(3, 4), g * 0.7, p, 'maj', { gap: 0.42 }); return [12, 17]; }   // 你的杖、你的竿都安慰我
          a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [13, 19];
        case 'glory':
          if (lv('psLine') > 0.5) {                                            // 太阳如同新郎出洞房
            a.strings(['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5'].map((n, i) => [n, 0.15 + i * 0.22, g * (1 - i * 0.06), 3]), { bright: 5, d: 3, rev: 0.65, spread: 0.3 });
            a.bells(['A5', 'Cs6', 'E6'], 0.2, g * 0.7, 3, 1.6);
            return [10, 14];
          }
          if (lv('psWings') > 0.5) { a.angelRun(g * 0.85); a.pipe([['E5', 0.35], ['Fs5', 0.35], ['Gs5', 0.35], ['A5', 1.4]], { g: g * 0.35, pan: -0.5, bright: 3, breath: 0.2, vib: 8, at: 0.4, rev: 0.7 }); return [9, 13]; }   // 清晨的翅膀
          if (lv('psOil') > 0.5) {                                             // 福杯满溢：上去，又满溢下来
            const up = ['A3', 'Cs4', 'E4', 'A4', 'Cs5'], ns = up.map((n, i) => [n, i * 0.16, g * 0.75, 2.4]);
            ['B4', 'A4', 'Fs4', 'E4'].forEach((n, i) => ns.push([n, 0.95 + i * 0.2, g * (0.65 - i * 0.08), 2.6]));
            a.strings(ns, { bright: 5, d: 2.4, spread: 0.3, rev: 0.6 });
            return [11, 15];
          }
          a.lyre('A4', a.rint(4, 6), g * 0.85, p, 'maj', { gap: 0.24 }); return [11, 16];
        case 'aeon':                                                          // 求你指教我们怎样数算自己的日子
          if (Math.random() < 0.5) a.bowed(a.pick(['A2', 'E3', 'D3']), g * 0.8, p); else a.lyre('A3', 3, g * 0.7, p, 'dor', { gap: 0.5 });
          return [12, 18];
        case 'stars':
          if (lv('psKeep') > 0.4) { soft(a, g, p, 'lyd', 3); return [14, 20]; }   // 保护你的，不打盹
          if (lv('psLamp') > 0.4) {                                             // 上行之诗：提灯往殿去的人
            a.pipe([['A4', 0.45], ['B4', 0.45], ['Cs5', 0.6], ['B4', 0.3], ['Cs5', 0.45], ['E5', 1.4]], { g: g * 0.45, pan: p, bright: 4, breath: 0.25, vib: 10, rev: 0.65 });
            return [11, 15];
          }
          {                                                                     // 月亮星宿：一张星的琴，一扫而过
            const up = Math.random() < 0.6, ns = [];
            for (let k = 0; k < 9; k++) ns.push([a.deg('lyd', 'A4', up ? k : 8 - k), k * 0.11, g * 0.55, 2.8]);
            a.strings(ns, { wave: 'sine', bright: 2, d: 2.8, spread: 0.4, rev: 0.85 });
          }
          return [10, 15];
        case 'still':
          if (lv('psDeer') > 0.5) { flowing(a, g * 0.9, 'sus'); return [11, 16]; }   // 如鹿切慕溪水
          a.ney(g * 0.8, p); return [18, 26];                                  // 你们要休息
        default:
          if (lv('psSpring') > 0.5) { if (Math.random() < 0.5) flowing(a, g); else a.shepherd(g * 0.9, p); return [10, 15]; }   // 你发出你的灵
          if (lv('psVine') > 0.05 && lv('psField') < 0.05) { a.lyre('A3', a.rint(5, 7), g * 0.8, p, 'dor', { gap: 0.24 }); return [11, 16]; }   // 葡萄树的蔓子往上爬
          if (lv('psPool') > 0.5 && lv('psTable') < 0.5) { a.shepherd(g, p); return [12, 18]; }   // 耶和华是我的牧者
          a.lyre(a.pick(['A3', 'A4']), a.rint(4, 6), g * 0.85, p, 'maj', { gap: 0.26 }); return [13, 19];   // 大卫的琴
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, k = top(psG(lv, a.night()));
      if (k === 'praise') { if (Math.random() < 0.5) timbrel(a, g * 0.6, a.pan(), 'Dt.t', 0.17); else a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.45, a.pan()); return [2.5, 4.5]; }   // 一切有气息的
      if (k === 'stars' || (lv('psLyre') > 0.5 && a.night() > 0.6)) { a.starPing(g); return [0.6, 1.6]; }
      if (lv('psLamp') > 0.3) { a.ping(a.pick(['A4', 'E5', 'Cs5']), 0, g * 0.4, a.pan()); return [1.5, 3]; }
      if (lv('psSpring') > 0.5 && lv('psZion') < 0.7) { a.pluck(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.3); a.pluck(a.deg('maj', 'A5', a.rint(0, 7)), 0.12, g * 0.3, a.pan(), 0.3); return [2, 4]; }   // 飞鸟
      if (k === 'still') { a.glass(g * 0.35, 1); return [7, 11]; }
      if (lv('psFruit') > 0.5 && lv('psLyre') < 0.5) { a.glass(g * 0.3, 1); return [7, 11]; }
      return [5, 9];
    },
  });

  // ══ 箴言 · 智慧 ══════════════════════════════════════════
  // 城门口的呼喊（混合利底亚：街上的调）；光如雨浇灌、越照越明的路、耶和华的眼目（利底亚的光）；
  // 看蚂蚁的动作（多利亚：一行细小的拨弦列队进窝）；
  // ★ 太初：深处只有 A 的五度与一点高处的光；工师的金线——穹苍的弧、渊面的圆（竖琴画出弧线与圆）；
  // 「常常在他面前踊跃」：A 大调带着轻快的起伏（6/8 的笛与手鼓）；生命的泉源（缓缓起伏的 A 加九）；
  // 坚固台（风琴的 A 与 E，坚实的伊奥尼亚）；人的灵是耶和华的灯（温暖的笛音）；隐秘的众星；
  // 亚古珥的发问：谁聚风在掌握中？——挂留的四度，句末不解决；才德的妇人：大调与众人称她有福。
  const pvG = lv => {
    const drawn = lv('pvDraft') * max(lv('pvSketch'), lv('pvVault'), lv('pvCircle'), lv('pvBound'), lv('pvFound'));
    const light = max(drawn, lv('pvPour'), 0.7 * lv('pvPathG') * (1 - lv('pvLamps')), 0.7 * lv('pvEye') * (1 - lv('pvLens')), 0.8 * lv('pvSteps'), 0.55 * lv('pvHidden'));
    const deep = max(sm(0.2, 0.7, lv('gloom')), 0.8 * sm(0.3, 0.7, lv('storm')) * (1 - lv('pvTower')));
    const lamp = max(lv('pvLamps'), lv('pvSouls'), 0.7 * lv('pvMom'), 0.6 * lv('pvChanG'));
    const wind = max(lv('pvWind'), lv('pvWrap'), 0.8 * lv('pvWonder') * (1 - lv('pvPraise')));
    const dance = max(max(lv('pvDance'), lv('pvFeast')) * (1 - lv('pvSpring')), lv('pvPraise'));
    const fount = max(0.75 * lv('pvSpring'), lv('pvRest'));
    return stack([['tower', lv('pvTower')], ['light', light], ['deep', deep], ['lamp', lamp], ['wind', wind], ['dance', dance], ['fount', fount]], 'gate');
  };
  music('proverbs', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      gate: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.12, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['E4', 's', 0.05, -0.4], ['G4', 's', 0.03, 0.4]],
      deep: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['A2', 'soft', 0.1, -0.2], ['E3', 's', 0.05, 0.3], ['A5', 's', 0.01, 0]],
      light: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, 0.15], ['B3', 's', 0.12, -0.3], ['Ds4', 's', 0.05, 0.35], ['Fs4', 's', 0.05, -0.4], ['Cs5', 's', 0.03, 0.45], ['A3', 'over', 0.05, 0]],
      dance: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.07, -0.35], ['Fs4', 's', 0.05, 0.4], ['A4', 'flute', 0.04, -0.45]], pulse: [1.2, 0.18] },
      fount: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.07, 0.4]], pulse: [0.3, 0.2] },
      tower: [['A1', 's', 0.3, 0], ['A2', 's', 0.3, 0], ['E3', 'soft', 0.27, -0.2], ['Cs4', 'soft', 0.13, 0.3], ['A2', 'over', 0.09, 0], ['E4', 's', 0.05, -0.4]],
      lamp: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'flute', 0.14, -0.3], ['Fs4', 's', 0.06, 0.35], ['B4', 's', 0.03, -0.45]],
      wind: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.32, -0.1], ['D3', 'soft', 0.16, 0.3], ['B3', 's', 0.08, -0.3], ['E4', 's', 0.05, 0.4], ['Gs4', 's', 0.02, -0.45]],
    } },
    mix(lv) {
      const g = pvG(lv);
      const lp = 1400 * (1 + 0.8 * g.light + 0.5 * g.dance + 0.3 * g.fount + 0.4 * g.tower + 0.3 * g.lamp) * (1 - 0.45 * g.deep) * (1 - 0.15 * g.wind) * (1 - 0.25 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.25 * g.deep, drone: 1 + 0.25 * g.deep - 0.1 * g.dance };
    },
    scale(lv) {
      switch (top(pvG(lv))) {
        case 'tower': return 'ion';
        case 'light': return 'lyd';
        case 'deep': return lv('storm') > 0.3 ? 'aeol' : 'sus';
        case 'lamp': return 'maj';
        case 'wind': return 'sus';
        case 'dance': case 'fount': return 'maj';
        default: return lv('pvLens') > 0.4 || lv('pvPlan') > 0.4 ? 'dor' : 'mixo';
      }
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(pvG(lv))) {
        case 'tower':                                                          // 坚固台：稳固的和弦，远处一声号角
          a.chord(['A2', 'E3', 'A3', 'Cs4', 'E4'], { type: 'over', lp: 2000, g: g * 0.5, a: 1, s: 1.6, r: 2.6, spread: 0.35, rev: 0.6 });
          if (Math.random() < 0.5) hornCall(a, g * 0.8, p);
          return [11, 15];
        case 'light':
          if (lv('pvPour') > 0.4) { flowing(a, g, 'lyd', 8); return [6, 9]; }     // 光如雨浇灌
          if (lv('pvDraft') > 0.4) {                                             // 工师的金线：一道弧（上去又下来），一个圆
            const ns = [];
            for (let k = 0; k < 7; k++) ns.push([a.deg('lyd', 'A3', k * 2), k * 0.16, g * 0.65, 2.6]);
            for (let k = 0; k < 6; k++) ns.push([a.deg('lyd', 'A3', 11 - k * 2), 1.2 + k * 0.16, g * (0.6 - k * 0.05), 2.6]);
            a.strings(ns, { wave: 'sine', bright: 3, d: 2.6, spread: 0.45, rev: 0.8 });
            return [8, 12];
          }
          if (lv('pvHidden') > 0.4) { soft(a, g, p, 'lyd', 3); return [13, 19]; }
          a.lyre('A4', a.rint(4, 6), g * 0.75, p, 'lyd', { gap: 0.26 }); return [11, 16];
        case 'deep':
          if (lv('storm') > 0.3) return [8, 12];
          a.ping('A5', 0, g * 0.55, 0); return [8, 12];                        // 太初：只有一点光
        case 'lamp':
          if (lv('pvMom') > 0.5) {                                             // 她的灯终夜不灭：一支小小的摇篮曲
            a.pipe([['Cs5', 0.6], ['B4', 0.35], ['A4', 0.35], ['B4', 0.6], ['Cs5', 0.35], ['E5', 0.35], ['Cs5', 1.3]], { g: g * 0.38, pan: p, bright: 3, breath: 0.2, vib: 8, rev: 0.7 });
            return [13, 18];
          }
          a.lyre('A4', a.rint(3, 5), g * 0.72, p, 'maj', { gap: 0.32 }); return [12, 17];
        case 'wind':
          if (lv('pvWonder') > 0.5) {                                          // 鹰在空中、蛇在磐石、船在海中
            const w = a.rint(0, 2);
            if (w === 0) a.pipe([['E5', 0.5], ['A5', 1.2], ['Fs5', 0.6], ['E5', 1.4]], { g: g * 0.36, pan: p, bend: true, bright: 3, breath: 0.3, vib: 7, rev: 0.75 });
            else if (w === 1) a.note({ f: 'D3', type: 'warm', lp: 900, g: g * 0.8, a: 1, s: 1.2, r: 2.5, path: [[a.hz('E3'), 0.8], [a.hz('C3'), 0.9], [a.hz('D3'), 0.8]], pan: p, rev: 0.6 });
            else { const ns = []; for (let k = 0; k < 6; k++) ns.push([a.deg('sus', 'A3', [0, 2, 4, 2, 0, 2][k]), k * 0.36, g * (k % 3 ? 0.55 : 0.75), 2]); a.strings(ns, { bright: 5, d: 2, pan: p, spread: 0.2, rev: 0.6 }); }
            return [10, 14];
          }
          a.pipe([['A4', 0.5], ['B4', 0.4], ['D5', 0.6], ['E5', 0.5], ['D5', 1.6]], { g: g * 0.42, pan: p, bright: 3, breath: 0.35, vib: 9, rev: 0.7 });   // 他名叫什么？——句末挂着
          return [10, 15];
        case 'dance':
          if (lv('pvPraise') > 0.4) {                                          // 她的儿女起来称她有福
            a.lyre('A4', a.rint(5, 7), g * 0.8, p, 'maj', { gap: 0.2 });
            a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.75, a: 0.8, s: 1, r: 2.2, at: 1.3, pan: -p });
            return [10, 14];
          }
          if (lv('pvHouse') > 0.5 && Math.random() < 0.4) { a.lyre('A4', a.rint(5, 7), g * 0.8, p, 'maj', { gap: 0.18 }); return [10, 14]; }   // 七根柱子的筵席
          a.pipe([['E5', 0.36], ['Fs5', 0.18], ['E5', 0.18], ['Cs5', 0.36], ['E5', 0.18], ['A5', 0.54], ['Fs5', 0.36], ['E5', 0.18], ['Cs5', 0.18], ['A4', 0.9]], { g: g * 0.4, pan: p, bright: 5, breath: 0.2, vib: 9, rev: 0.6 });   // 在他面前踊跃（6/8）
          if (Math.random() < 0.6) timbrel(a, g * 0.6, -p, 'D.tD.tD.tD.t', 0.18);
          return [9, 13];
        case 'fount':
          if (lv('pvRest') > 0.5) { a.shepherd(g * 0.85, p); return [13, 18]; }   // 必得安稳：羊群躺卧
          if (Math.random() < 0.55) flowing(a, g); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.28 });
          return [10, 15];
        default:
          if (lv('pvLens') > 0.5) {                                            // 察看蚂蚁的动作：一行细小的拨弦
            for (let k = 0; k < 8; k++) a.pluck(a.deg('dor', 'A4', [0, 1, 2, 1, 2, 3, 2, 4][k]), k * 0.16, g * 0.4, -0.3 + k * 0.08, 0.18);
            return [8, 12];
          }
          if (Math.random() < 0.5) {                                           // 智慧在街市上呼喊
            a.pipe([['E5', 0.55], ['D5', 0.25], ['Cs5', 0.25], ['B4', 0.3], ['A4', 1.2]], { g: g * 0.42, pan: p, bright: 4, breath: 0.3, vib: 10, rev: 0.65 });
          } else {                                                               // 对句：一句，再一句应答
            a.lyre('A4', 4, g * 0.75, p, 'mixo', { gap: 0.26 });
            lyreAt(a, 'A3', 4, g * 0.65, -p, 'mixo', { gap: 0.26, at: 2 });
          }
          return [13, 19];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('pvHidden') > 0.4) { a.starPing(g * 0.9); return [0.7, 1.8]; }    // 隐秘的众星
      if (lv('pvSteps') > 0.05 && lv('pvSteps') < 0.97) { a.ping(a.deg('lyd', 'A4', a.rint(3, 9)), 0, g * 0.45, a.pan()); return [0.9, 1.4]; }   // 金色的脚印一个个亮起
      if (lv('pvLamps') > 0.05 && lv('pvLamps') < 0.97) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.45, a.pan()); return [0.8, 1.8]; }   // 窗里的灯一盏盏亮起
      if (lv('pvPour') > 0.4) { a.glass(g * 0.45, 2); return [2, 4]; }
      if (lv('pvDance') > 0.05 && lv('pvDance') < 0.98) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.45, a.pan()); return [0.6, 1.2]; }   // 那点光飞过全地
      if (lv('pvStar') > 0.5 && lv('pvDraft') < 0.5) { a.ping('E6', 0, g * 0.3, 0.1); return [3, 5]; }
      return [5, 9];
    },
  });

  // ══ 传道书 · 虚空 ════════════════════════════════════════
  // 虚空（hevel，原是「一口气」）：挂留的和声，每十秒呼吸一次，没有三音——不喜也不悲；
  // ★ 日头出来、日头落下，风往南刮又向北转：一圈一圈的琴，同一个音型原样再来（已有的事后必再有）；
  // 凡事都有定期：春（A6/9、牧笛与鸟）· 秋（多利亚、落叶般下行的拨弦）· 冬（空冷的五度与高处的雪）；
  // 永生安置在世人心里（利底亚的高光）；三股合成的绳子（三个音交缠）；患难的日子（爱奥利亚）；
  // 银链折断，金罐破裂（本卷自己的声响）时乐垫退回一口气的「虚空」；灵仍归于赐灵的神（上行的光）；
  // 末了「敬畏神，谨守他的诫命」——全卷唯一解决的终止：IV → I，庄重的伊奥尼亚。
  const ecG = (lv, night) => {
    const n = night || 0, fear = lv('ecGlory');
    const eternity = max(sm(0.3, 0.7, lv('ecHeart')), lv('ecHeaven'), lv('ecSpirit') * (1 - fear), 0.8 * sm(0.4, 1, lv('ecBread')));
    const trouble = max(lv('ecRainA'), lv('ecCloud') * (1 - lv('ecLamp')), sm(0.15, 0.35, lv('storm')), 0.8 * sm(0.8, 1, lv('clouds')));
    const cycle = max(lv('ecArc'), lv('ecWind'), lv('ecCycle'));
    const spring = max(lv('ecRope'), 0.6 * sm(0.7, 1, lv('bloom')) * (1 - lv('bare')) * (1 - lv('ecShade')) * (1 - 0.8 * sm(0.5, 0.9, n))
      * (1 - sm(0.4, 0.5, lv('clouds'))));                                    // 云彩反回之后（12:2 起）不再有春天的牧笛
    return stack([['fear', fear], ['trouble', trouble], ['winter', lv('ecSnow')], ['autumn', lv('ecLeaf')], ['eternity', eternity], ['cycle', cycle], ['spring', spring]], 'mist');
  };
  // 已有的事后必再有：同一个四音的音型，原样两遍
  function again(a, g, p) {
    const fig = a.pick([['A3', 'D4', 'E4', 'B3'], ['E4', 'D4', 'B3', 'A3'], ['A3', 'B3', 'E4', 'D4']]), ns = [];
    for (let r = 0; r < 2; r++) fig.forEach((n, i) => ns.push([n, r * 2.2 + i * 0.4, g * (i ? 0.6 : 0.75), 2.2]));
    a.strings(ns, { bright: 4, d: 2.2, pan: p, spread: 0.15, rev: 0.65 });
  }
  music('ecclesiastes', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1200, groups: {
      mist: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['B3', 's', 0.1, 0.3], ['D4', 'soft', 0.09, -0.3], ['E4', 's', 0.05, 0.4]], breath: 0.1 },
      cycle: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'soft', 0.1, -0.2], ['D3', 'soft', 0.16, 0.3], ['B3', 's', 0.07, -0.3], ['E4', 's', 0.04, 0.4]], pulse: [0.33, 0.3] },
      spring: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.15, -0.3], ['Fs4', 's', 0.07, 0.35], ['B4', 's', 0.03, -0.45], ['A4', 'flute', 0.03, 0.5]],
      autumn: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.32, -0.1], ['C3', 'soft', 0.22, 0.3], ['G3', 'soft', 0.1, -0.3], ['D4', 's', 0.05, 0.4]],
      winter: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['E3', 's', 0.08, -0.2], ['B3', 's', 0.06, 0.3], ['E4', 's', 0.05, -0.4], ['B4', 's', 0.03, 0.45], ['Fs5', 's', 0.012, -0.5]],
      eternity: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.15], ['B3', 's', 0.12, 0.3], ['Ds4', 's', 0.05, -0.35], ['Gs4', 's', 0.05, 0.4], ['E5', 's', 0.02, -0.5], ['A3', 'over', 0.05, 0]],
      trouble: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['C3', 'soft', 0.25, -0.3], ['E3', 'soft', 0.1, 0.25], ['F3', 's', 0.065, 0.35]],
      fear: [['A1', 's', 0.3, 0], ['A2', 's', 0.3, 0], ['E3', 'soft', 0.27, -0.2], ['Cs4', 'soft', 0.13, 0.3], ['A2', 'over', 0.09, 0], ['E4', 's', 0.05, -0.4]],
    } },
    mix(lv, night) {
      const g = ecG(lv, night);
      const lp = 1200 * (1 + 0.6 * g.eternity + 0.5 * g.fear + 0.4 * g.spring + 0.2 * g.cycle) * (1 - 0.35 * g.trouble) * (1 - 0.3 * g.winter) * (1 - 0.15 * g.autumn) * (1 - 0.2 * cl(lv('ecMist')));
      return { g, lp, dlp: 1 - 0.2 * g.trouble - 0.1 * g.winter, drone: 1 + 0.15 * g.trouble - 0.1 * g.fear };
    },
    scale(lv, night) {
      return { fear: 'ion', trouble: 'aeol', winter: 'sus', autumn: 'dor', eternity: 'lyd', cycle: 'sus', spring: 'maj', mist: 'sus' }[top(ecG(lv, night))] || 'sus';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(ecG(lv, a.night()))) {
        case 'fear':                                                           // 敬畏神：IV → I，全卷唯一解决的终止
          a.chord(['D3', 'A3', 'D4', 'Fs4'], { type: 'soft', lp: 1800, g: g * 0.55, a: 0.9, s: 1.3, r: 1.2, spread: 0.3, rev: 0.6 });
          a.chord(['A2', 'E3', 'A3', 'Cs4', 'E4'], { type: 'soft', lp: 2000, g: g * 0.55, a: 0.9, s: 2, r: 3, at: 2.4, spread: 0.3, rev: 0.65 });
          a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.6, a: 1, s: 1.6, r: 3, at: 2.4, pan: 0 });
          return [12, 16];
        case 'trouble': a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [13, 19];
        case 'winter': a.glass(g * 0.4, 1); return [10, 14];                   // 冬雪：几乎无声
        case 'autumn': {                                                        // 秋叶：慢慢飘落的拨弦
          const i0 = a.rint(8, 10), ns = [];
          for (let k = 0; k < 5; k++) ns.push([a.deg('dor', 'A3', i0 - k), k * a.rnd(0.35, 0.6), g * (0.7 - k * 0.06), 1.8]);
          a.strings(ns, { bright: 4, d: 1.8, pan: p, spread: 0.3, rev: 0.6 });
          return [10, 14];
        }
        case 'eternity':
          if (lv('ecSpirit') > 0.3) { a.angelRun(g * 0.8); return [9, 13]; }     // 灵仍归于赐灵的神
          a.lyre('A4', a.rint(3, 5), g * 0.72, p, 'lyd', { gap: 0.3 }); return [12, 17];
        case 'cycle': {                                                         // 日头出来、日头落下：一个圈，转两遍
          const ns = [], ring = [0, 2, 4, 5, 4, 2];
          for (let k = 0; k < 12; k++) ns.push([a.deg('sus', 'A3', ring[k % 6]), k * 0.24, g * (k % 6 ? 0.55 : 0.75), 1.8]);
          a.strings(ns, { bright: 5, d: 1.8, pan: p, spread: 0.35, rev: 0.6 });
          return [9, 13];
        }
        case 'spring':
          if (lv('ecRope') > 0.4) {                                            // 三股合成的绳子：三个音交缠
            const ns = [];
            for (let k = 0; k < 9; k++) ns.push([['A3', 'Cs4', 'E4'][k % 3], k * 0.28, g * 0.6, 2], [['E4', 'A4', 'Cs5'][(k + 1) % 3], k * 0.28 + 0.14, g * 0.4, 2]);
            a.strings(ns, { bright: 5, d: 2, pan: p, spread: 0.3, rev: 0.6 });
            return [10, 14];
          }
          if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.28 });
          return [13, 19];
        default:                                                               // 虚空：一口气，或同一个音型原样再来
          if (Math.random() < 0.5) a.ney(g * 0.85, p); else again(a, g, p);
          return [14, 21];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('ecSnow') > 0.4) { a.ping(a.deg('sus', 'A5', a.rint(0, 6)), 0, g * 0.35, a.pan()); return [1.2, 2.8]; }   // 雪片
      if (lv('ecLeaf') > 0.4) { a.pluck(a.deg('dor', 'A4', a.rint(0, 6)), 0, g * 0.35, a.pan(), 0.5); return [1.5, 3]; }
      if (lv('ecLamp') > 0.4) { a.starPing(g * 0.8); return [1, 2.5]; }       // 提灯仰望众星，查不出来
      if (lv('ecBread') > 0.4) { a.glass(g * 0.4, 1); return [3, 6]; }
      if (lv('ecSpirit') > 0.3 && lv('ecGlory') < 0.5) { a.ping(a.deg('lyd', 'A5', a.rint(2, 8)), 0, g * 0.45, 0); return [1.5, 3]; }
      if (sm(0.7, 1, lv('bloom')) > 0.5 && a.night() < 0.3 && top(ecG(lv, a.night())) === 'spring') { a.pluck(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.35, a.pan(), 0.3); return [3, 6]; }   // 鸟
      return [5, 9];
    },
  });

  // ══ 耶利米哀歌 · 哀歌 ═════════════════════════════════════
  // 独坐的城：低处的 A 小七（爱奥利亚），苇笛奏出「气纳」的跛行挽歌——三拍、一口气的停顿、再两拍，落下去；
  // 准绳拉过城墙、墙一段段倒下（弗里几亚的沉重脉动）；深牢：凿过的石头围住他（低处 b6 的一团，几乎没有高音）；
  // 泪河：银色的河缓缓起伏，下行的玻璃一滴滴；「从天观看」；
  // ★ 东方的第一线光，「每早晨，这都是新的」——全卷最亮的一刻：A 大调升起的琴与铃，满地的露；
  // 静默等候（挂留的四度）；「不要惧怕！」（临近的光）；你的宝座存到万代（高处安静的利底亚）。
  const lmG = lv => {
    const dawn = max(lv('lmDawn'), lv('lmRays'), 0.9 * lv('lmNear'));
    const tears = max(lv('lmTears'), lv('lmGaze')) * (1 - lv('lmGold'));
    const wait = sm(0.3, 0.6, lv('lmDew')) * (1 - lv('lmRays'));
    const fire = lv('lmGold') * sm(0.35, 0.6, lv('lmEmber'));                  // 锡安的火最后一次烧起，然后熄灭
    const wrath = max(sm(0.2, 0.6, lv('storm')), lv('lmLineA'), fire);
    const cell = lv('lmCell') * max(sm(0.1, 0.4, lv('gloom')), 0.3) * (1 - lv('lmGold'));
    return stack([['throne', lv('lmThrone')], ['dawn', dawn], ['wrath', wrath], ['tears', tears], ['wait', wait], ['cell', cell]], 'desolate');
  };
  music('lamentations', {
    weight: { drone: 0.65, pad: 0.95 },
    pad: { lp: 1100, groups: {
      desolate: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.33, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'warm', 0.08, 0.25], ['G3', 's', 0.06, -0.35]],
      wrath: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.35, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.24, 0.3], ['E3', 'soft', 0.1, -0.2], ['F3', 's', 0.05, 0.4]], pulse: [0.6, 0.3] },
      cell: [['A1', 's', 0.52, 0], ['E2', 'soft', 0.34, 0.1], ['F2', 'soft', 0.1, -0.25], ['C3', 'soft', 0.16, 0.25]],
      tears: { v: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.15], ['C4', 'soft', 0.1, 0.3], ['E4', 's', 0.06, -0.35], ['B4', 's', 0.03, 0.4], ['A4', 'flute', 0.03, -0.45]], pulse: [0.25, 0.2] },
      dawn: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.08, -0.35], ['A4', 's', 0.05, 0.4], ['Cs5', 's', 0.025, -0.5]],
      wait: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 's', 0.1, -0.3], ['D4', 's', 0.07, 0.3], ['A3', 'flute', 0.04, -0.4]],
      throne: [['A1', 's', 0.32, 0], ['A2', 's', 0.2, 0], ['E3', 'soft', 0.24, -0.15], ['B3', 's', 0.1, 0.3], ['Cs4', 's', 0.1, -0.3], ['Gs4', 's', 0.04, 0.4], ['E5', 's', 0.02, -0.5]],
    } },
    mix(lv) {
      const g = lmG(lv);
      const lp = 1100 * (1 + 0.9 * g.dawn + 0.5 * g.throne + 0.3 * g.tears + 0.3 * g.wait + 0.25 * cl(lv('lmGaze'))) * (1 - 0.35 * g.wrath) * (1 - 0.45 * g.cell) * (1 - 0.2 * cl(lv('gloom')));
      return { g, lp, dlp: 1 - 0.2 * g.cell - 0.15 * g.wrath + 0.2 * g.dawn, drone: 1 + 0.2 * g.wrath + 0.15 * g.cell - 0.2 * g.dawn };
    },
    scale(lv) {
      return { throne: 'lyd', dawn: 'maj', wrath: 'phryg', tears: 'grief', wait: 'sus', cell: 'phryg', desolate: 'aeol' }[top(lmG(lv))] || 'aeol';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(lmG(lv))) {
        case 'throne':                                                         // 你的宝座存到万代：高天之上安静的荣光
          a.choir(['E4', 'B4', 'Cs5', 'Gs5'], { gs: [1, 0.8, 0.6, 0.35], g: g * 0.6, a: 1.4, s: 1.6, r: 3.2, pan: 0 });
          if (Math.random() < 0.5) lyreAt(a, 'A4', 3, g * 0.6, p, 'lyd', { gap: 0.45, at: 2 });
          return [13, 18];
        case 'dawn':
          if (lv('lmNear') > 0.4) {                                            // 不要惧怕！
            a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.75, a: 1, s: 1.2, r: 2.6, pan: 0 });
            a.glass(g * 0.5, 2);
            return [11, 15];
          }
          if (lv('lmRays') > 0.5 || lv('lmDawn') > 0.5) {                      // 每早晨，这都是新的
            a.strings(['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5'].map((n, i) => [n, 0.2 + i * 0.24, g * (1 - i * 0.06), 3]), { bright: 5, d: 3, rev: 0.7, spread: 0.3 });
            a.bells(['A5', 'Cs6', 'E6'], 0.2, g * 0.6, 3, 1.8);
            return [10, 14];
          }
          a.lyre('A4', a.rint(3, 5), g * 0.72, p, 'maj', { gap: 0.32 }); return [12, 17];
        case 'wrath':
          if (lv('lmLineA') > 0.4) {                                           // 拉准绳：一条慢慢拉长的音
            a.note({ f: 'A2', type: 'warm', lp: 800, g: g * 0.9, a: 0.6, s: 3, r: 2, path: [[a.hz('Bb2'), 3]], pan: -0.5, pan2: 0.5, rev: 0.6 });
            return [9, 13];
          }
          if (Math.random() < 0.4) a.bowed(a.pick(['A2', 'Bb2']), g * 0.8, p);
          return [10, 14];
        case 'tears': drops(a, g, 'grief'); return [7, 11];                    // 眼泪下流如河
        case 'wait': a.ney(g * 0.8, p); return [18, 26];                       // 人仰望耶和华，静默等候
        case 'cell':                                                           // 用凿过的石头挡住我的道
          a.knocks([[0, 500, 90, g * 0.7, true], [a.rnd(1.2, 2), 480, 85, g * 0.5, true]], { lp: 900, pan: p, rev: 0.5 });
          if (Math.random() < 0.5) a.bowed(a.pick(['A2', 'F2', 'C3']), g * 0.75, -p);
          return [14, 20];
        default:
          if (Math.random() < 0.65) qinah(a, g, p, 'aeol'); else a.bowed(a.pick(['A2', 'C3', 'E3', 'G3']), g * 0.85, p);
          return [13, 19];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('lmDew') > 0.4) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.3, a.pan()); return [2, 4.5]; }   // 满地的露
      if (lv('lmTears') > 0.5 && lv('lmGold') < 0.5) { a.ping(a.deg('grief', 'A5', a.rint(0, 4)), 0, g * 0.3, a.pan()); return [3, 6]; }
      if (lv('lmGaze') > 0.5) { a.glass(g * 0.4, 1); return [4, 7]; }
      if (lv('lmThrone') > 0.4) { a.starPing(g * 0.7); return [1.5, 3]; }
      return [5, 9];
    },
  });

  // ══ 以西结书 · 以西结 ═════════════════════════════════════
  // 迦巴鲁河边（多利亚的四度，外邦的河）；★ 天就开了：北方来的旋风与火、四个活物——
  //   翅膀的响声如大水（弗里几亚、b2 与 #4、飞快的鼓动）；轮中套轮：两个不同长度的圈交错着转；
  //   穹苍、蓝宝石的宝座、虹的光辉（高处散开的利底亚，玻璃的虹从下到上再下来）；
  // 荣耀离殿、城暗了、泰尔倾倒（爱奥利亚与弗里几亚）；泰尔坐在海口（Hijaz 的乌德，商旅的城）；
  // 香柏树的嫩枝、亲自寻找羊、新心（A6/9、牧笛）；遍满骸骨的平原（没有三音、几乎没有高音的干枯），
  //   骨与骨互相联络（干涩的碰击）；★ 气息从四方而来：合唱从左右远近四面聚来，站起来成为极大的军队（号角）；
  // 荣耀从东而来、充满了殿——先前离去的同一个宝座的和声回来了；
  // 殿里流出的河：缓缓起伏的 A，水越深，活水的琴越密；「耶和华的所在」。
  const ekG = lv => {
    const hide = lv('ekHide'), vis = 1 - hide;
    const river = max(lv('ekFlow'), lv('ekWater'), lv('ekHeal'), lv('ekTrees'), lv('ekName'));
    const temple = max(lv('ekGloryE'), lv('ekFill'), 0.55 * lv('ekMount'));
    const throne = max(vis * max(lv('ekThrone'), 0.7 * lv('ekFirm'), lv('ekBow'), lv('ekGlory') * (1 - cl(lv('ekGloryP') / 2.5))) * (1 - 0.8 * lv('ekGo')), temple);   // 异象离去：只剩轰轰的响声
    const vision = vis * max(max(lv('ekCloud') * lv('ekNear'), lv('ekFire'), 0.9 * lv('ekWheel')) * (1 - 0.7 * lv('ekThrone')), lv('ekGo'));
    const renewB = vis * max(sm(0.12, 0.25, lv('rain')), sm(0.5, 0.6, lv('bloom')));
    const judg = vis * max(lv('ekDim') * (1 - lv('ekCedar')), 0.7 * lv('ekPride'), lv('ekWave'), rise(lv('ekFall')), lv('ekRuin') * (1 - renewB));
    const renew = max(vis * max(lv('ekCedar'), lv('ekNest')) * (1 - lv('ekTyre')), renewB, vis * lv('ekHeart'), 0.6 * vis * lv('ekStone'), lv('ekEat'));
    const bones = hide * lv('ekBones') * (1 - lv('ekMount')) + 0.7 * vis * lv('ekNets') * (1 - lv('ekRuin'));
    const breath = hide * max(sm(0.4, 0.8, lv('gale')) * lv('ekFlesh'), lv('ekArmy')) * (1 - lv('ekMount'));
    return stack([['river', river], ['throne', throne], ['vision', vision], ['breath', breath], ['judgment', judg], ['renew', renew], ['bones', bones]], 'chebar');
  };
  // 轮中套轮：一个三音的圈与一个四音的圈，各按各的速度转
  function wheels(a, g, p) {
    const A = ['A3', 'E4', 'Bb3'], B = ['D5', 'A4', 'Ds5', 'E5'], ns = [];
    for (let k = 0; k < 12; k++) ns.push([A[k % 3], k * 0.21, g * (k % 3 ? 0.45 : 0.6), 1.2]);
    for (let k = 0; k < 9; k++) ns.push([B[k % 4], 0.1 + k * 0.28, g * (k % 4 ? 0.35 : 0.5), 1.4]);
    a.strings(ns, { bright: 6, d: 1.3, pan: p, spread: 0.5, rev: 0.6 });
  }
  // 骨与骨互相联络：一阵干涩的碰击
  function rattle(a, g, p) {
    const hits = [];
    for (let k = 0; k < 9; k++) hits.push([k * a.rnd(0.09, 0.2), a.rnd(2200, 3600), a.rnd(500, 800), g * a.rnd(0.25, 0.45), false]);
    a.knocks(hits, { lp: 6000, q: 3, pan: p, rev: 0.4 });
  }
  // 气息啊，要从四方而来：合唱从左右远近四面聚来，合在中间
  function fourWinds(a, g) {
    [[-0.85, 0], [0.85, 1.1], [-0.4, 2.2], [0.4, 3.3]].forEach(([pn, at]) =>
      a.choir(['A3', 'E4'], { gs: [1, 0.7], g: g * 0.55, a: 0.5, s: 0.4, r: 1.2, at, pan: pn, rev: 0.85 }));
    a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.95, a: 1, s: 1.4, r: 3, at: 4.6, pan: 0 });
  }
  music('ezekiel', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      chebar: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'soft', 0.1, -0.2], ['D3', 'soft', 0.16, 0.3], ['G3', 'soft', 0.1, -0.3], ['B3', 's', 0.05, 0.4]],
      vision: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['Bb2', 'soft', 0.07, -0.35], ['D3', 'soft', 0.18, 0.3], ['E3', 'soft', 0.1, -0.2], ['Ds4', 's', 0.03, 0.45]], pulse: [2.4, 0.28] },
      throne: [['A1', 's', 0.32, 0], ['E2', 's', 0.18, 0.1], ['A2', 'over', 0.08, 0], ['E3', 'soft', 0.18, -0.2], ['Ds4', 's', 0.06, 0.3], ['Gs4', 's', 0.05, -0.35], ['B4', 's', 0.05, 0.4], ['Cs5', 's', 0.04, -0.45], ['E5', 's', 0.025, 0.5]],
      judgment: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.24, 0.3], ['E3', 'soft', 0.1, -0.2], ['F3', 's', 0.05, 0.4]],
      bones: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.3, 0.1], ['E3', 's', 0.06, -0.3], ['Bb3', 's', 0.025, 0.4], ['E4', 's', 0.03, -0.45]],
      breath: [['A1', 's', 0.12, 0], ['A2', 's', 0.36, 0], ['E3', 'soft', 0.15, 0.15], ['A3', 'choir', 0.19, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.14, 0], ['A4', 'choir', 0.08, 0]],
      renew: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['Fs4', 's', 0.07, -0.35], ['B4', 's', 0.035, 0.45]],
      river: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.07, 0.4], ['A4', 'flute', 0.03, -0.45]], pulse: [0.28, 0.22] },
    } },
    mix(lv) {
      const g = ekG(lv), flesh = cl(lv('ekFlesh'));
      const lp = 1300 * (1 + 0.9 * g.throne + 0.5 * g.breath + 0.5 * g.river + 0.4 * g.renew) * (1 - 0.3 * g.vision) * (1 - 0.35 * g.judgment)
        * (1 - 0.4 * g.bones * (1 - 0.6 * flesh)) * (1 - 0.2 * cl(lv('storm')));
      return { g, lp, dlp: 1 + 0.2 * g.throne - 0.2 * g.judgment - 0.2 * g.bones, drone: 1 + 0.25 * g.vision + 0.15 * g.throne - 0.1 * g.river };
    },
    scale(lv) {
      switch (top(ekG(lv))) {
        case 'river': return 'ion';
        case 'throne': return 'lyd';
        case 'vision': return 'phryg';
        case 'breath': case 'renew': return 'maj';
        case 'judgment': return 'aeol';
        case 'bones': return 'sus';
        default: return lv('ekTyre') > 0.5 && lv('ekRuin') < 0.5 && lv('ekHide') < 0.5 ? 'hijaz' : 'dor';
      }
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(ekG(lv))) {
        case 'river': {
          if (lv('ekName') > 0.5) {                                            // 耶和华的所在
            a.bells(['A5', 'Cs6', 'E6', 'A6'], 0.22, g * 0.7, 3.2, 0.2);
            a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.7, a: 1, s: 1.4, r: 3, pan: 0 });
            return [11, 15];
          }
          const w = cl(lv('ekWater'));
          flowing(a, g, 'ion', 5 + Math.round(3 * w));                        // 水越深，琴越密
          if (lv('ekTrees') > 0.5 && Math.random() < 0.5) lyreAt(a, 'A4', 4, g * 0.65, -p, 'ion', { gap: 0.26, at: 1.4 });
          return [9 - 3 * w, 12 - 3 * w];
        }
        case 'throne':
          if (lv('ekEat') > 0.5 && lv('ekGo') < 0.3) {                         // 吃这书卷：在我口中甘甜如蜜
            a.lyre('A5', 4, g * 0.6, p, 'lyd', { gap: 0.18 }); a.glass(g * 0.4, 1);
            return [8, 11];
          }
          if (lv('ekGloryE') > 0.3 || lv('ekFill') > 0.3) {                    // 荣光从东而来，充满了殿
            a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 0.95, a: 1, s: 1.6, r: 3, pan: 0 });
            a.bells(['E5', 'A5', 'Cs6'], 0.24, g * 0.55, 3, 1.4);
            return [11, 15];
          }
          if (lv('ekMeasure') > 0.2 && lv('ekTemple') < 0.9) {                 // 量度的竿：一下一下
            for (let k = 0; k < 6; k++) a.pluck(a.deg('lyd', 'A4', k), k * 0.5, g * 0.4, -0.5 + k * 0.2, 0.35);
            return [8, 11];
          }
          if (lv('ekBow') > 0.4 || lv('ekThrone') > 0.5) {                     // 周围的光辉如虹：从下到上再下来
            const ns = [];
            for (let k = 0; k < 8; k++) ns.push([a.deg('lyd', 'A4', k), k * 0.12, g * 0.55, 2.6]);
            for (let k = 0; k < 7; k++) ns.push([a.deg('lyd', 'A4', 6 - k), 1.0 + k * 0.12, g * 0.45, 2.6]);
            a.strings(ns, { wave: 'sine', bright: 2, d: 2.6, spread: 0.5, rev: 0.85 });
            if (Math.random() < 0.5) a.choir(['A3', 'E4', 'B4', 'Ds5'], { gs: [1, 0.85, 0.6, 0.4], g: g * 0.6, a: 1.2, s: 1.2, r: 2.8, at: 1.6, pan: 0 });
            return [10, 14];
          }
          a.choir(['A3', 'E4', 'A4', 'Cs5'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.7, a: 1, s: 1, r: 2.4, pan: 0 }); return [12, 16];
        case 'vision':
          if (lv('ekGo') > 0.4) return [6, 9];                                 // 轰轰的响声离去
          wheels(a, g, p); return [7, 10];
        case 'breath':
          if (lv('ekArmy') > 0.3) { hornCall(a, g, -0.5); hornCall(a, g * 0.7, 0.5); return [9, 13]; }   // 极大的军队
          fourWinds(a, g); return [10, 14];                                    // 气息啊，要从四方而来
        case 'judgment':
          if (lv('ekWave') > 0.4) return [7, 10];                              // 海使波浪涌上
          if (lv('ekGlory') > 0.3 && lv('ekGloryP') > 1.5) { a.angelRun(g * 0.6); return [9, 13]; }   // 荣耀从城中上升
          if (lv('ekRuin') > 0.5) { a.ney(g * 0.95, p); return [11, 15]; }    // 密云黑暗的日子：一支苇笛在暗中寻找散了的羊
          a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [13, 19];
        case 'renew':
          if (lv('ekEat') > 0.3) { a.lyre('A5', 4, g * 0.6, p, 'maj', { gap: 0.18 }); return [7, 10]; }   // 其甜如蜜
          if (lv('ekHeart') > 0.3 || lv('ekStone') > 0.5) { a.lyre('A3', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.3 }); return [11, 16]; }   // 新心
          if (lv('ekRuin') > 0.5) { a.shepherd(g * 0.9, p); return [12, 17]; }   // 我必亲自寻找我的羊
          a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.24 }); return [12, 17];   // 佳美的香柏树
        case 'bones':
          if (rise(lv('ekJoin')) > 0.3) return [3, 5];                        // 骨与骨互相联络：由 motif2 奏（rattle）
          if (rise(lv('ekSinew')) > 0.3 || rise(lv('ekFlesh')) > 0.3) { a.bowed(a.pick(['A2', 'E3']), g * 0.8, p); return [6, 9]; }   // 有筋、有肉、有皮——只是还没有气息
          if (lv('ekNets') > 0.5 && lv('ekHide') < 0.5) { a.ney(g * 0.7, p); return [16, 24]; }
          a.knocks([[0, 3000, 700, g * 0.3, false], [0.14, 3300, 740, g * 0.2, false]], { lp: 6000, q: 3, pan: p, rev: 0.6 });   // 极其枯干
          return [12, 18];
        default:
          if (lv('ekTyre') > 0.5 && lv('ekRuin') < 0.5 && lv('ekHide') < 0.5) { a.oud(g, p); return [10, 14]; }   // 泰尔：海口的商旅
          if (Math.random() < 0.55) a.ney(g * 0.9, p); else a.bowed(a.pick(['A2', 'D3', 'E3', 'G3']), g * 0.8, p);
          return [14, 21];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, k = top(ekG(lv)), hide = lv('ekHide');
      if (rise(lv('ekJoin')) > 0.3) { rattle(a, g, a.pan()); return [0.9, 1.8]; }                                   // 有响声，有地震，骨与骨互相联络
      if (once('ekWind', hide * sm(0.4, 0.8, lv('gale')) * lv('ekFlesh') * (1 - lv('ekArmy')), 0.05, 0.9, () => fourWinds(a, g))) return [7, 9];
      if (once('ekArmy', lv('ekArmy'), 0.03, 0.6, () => { hornCall(a, g, -0.5); hornCall(a, g * 0.7, 0.5); })) return [5, 7];   // 站起来，成为极大的军队
      if (k === 'vision' && lv('ekFire') > 0.4) { a.pluck(a.deg('phryg', 'A5', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.35); return [0.6, 1.6]; }   // 火在活物中间上去下来
      if (k === 'throne' && lv('ekFill') < 0.3) { a.glass(g * 0.45, 1); return [3, 6]; }
      if (lv('ekMark') > 0.05 && lv('ekMark') < 0.97) { a.ping('E5', 0, g * 0.4, a.pan()); return [1.2, 2.2]; }   // 额上的记号
      if (lv('ekNest') > 0.5 && k === 'renew' && lv('ekTyre') < 0.5) { a.pluck(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.35, a.pan(), 0.3); return [2, 4]; }   // 各类飞鸟
      if (k === 'river') { a.glass(g * 0.35, 1); return [3, 6]; }
      if (k === 'breath' && lv('ekArmy') < 0.3) { a.glass(g * 0.35, 1); return [3, 5]; }
      return [1, 1.5];                                                        // 每秒看一眼（骨的响声、四方的风）
    },
  });

  // ══ 但以理书 · 但以理 ═════════════════════════════════════
  // 巴比伦的宫（Hijaz：b2 与大三度，风琴般的 A）；但以理的家、素菜白水、楼上开向耶路撒冷的窗（温暖的 A6/9 与笛）；
  // 王的烈怒、窑烧热七倍、海中上来的四兽、小角（弗里几亚的脉动）；
  // ★ 梦中的大像：金、银、铜、铁、泥——五声一声比一声低、一声比一声暗；非人手凿出的石头打碎它，成了一座大山（合唱的 A 大）；
  // ★ 杜拉平原的金像：「角、笛、琵琶、琴、瑟、笙和各样乐器」一齐奏响（号角、笛、竖琴、鼓，混合利底亚的铜管色）；
  //   火中第四个的光（利底亚）；大树与飞鸟、露水与树墩；
  // ★ 弥尼、弥尼、提客勒、乌法珥新：墙上的字一个一个发光，天平摇了两下，落在低处——当夜灯一盏盏灭了；
  // 狮子坑（低处的爱奥利亚）；「封住狮子的口」——坑中一团暖光（利底亚的合唱与玻璃）；
  // ★ 他的权柄是永远的：火焰的宝座，像人子的驾云而来（伊奥尼亚的合唱）；
  // 末了：智慧人必发光如同天上的光——光点自地升起成为星；「你必安歇」：一句宁静的琴，头上一颗星。
  const dnG = lv => {
    const rescued = sm(0.85, 0.95, lv('dnFurnace')) * max(sm(0.02, 0.1, lv('dnFourth')), 1 - sm(0.17, 0.24, lv('dnHeat')));   // 火中有第四个、窑火退了：三人得救（金像仍立着，却不再是它的色彩）
    const stone = max(lv('dnMountGlow'), lv('dnGlory'), 0.85 * lv('dnSon'));
    const fire = max(lv('dnFourth'), lv('dnAngelL'), lv('dnThrone') * (1 - lv('dnSon')), lv('dnLinen'), lv('dnFirm'), 0.8 * lv('dnReveal'), 0.6 * lv('dnRead') * (1 - lv('dnScale')));
    const wrath = max(lv('dnWrath'), lv('dnHeat') * lv('dnFurnace'), lv('dnV7') * sm(0.3, 2, lv('dnSea')) * (1 - lv('dnThrone')), 0.8 * lv('dnLittle') * (1 - lv('dnWin')),
      0.5 * lv('dnKings') * (1 - lv('dnFirm')), 0.5 * lv('dnDecree'), 0.6 * lv('dnScale'), 0.5 * lv('dnVoice'));
    const image = max(lv('dnImage'), lv('dnGold') * (1 - lv('dnWrath')) * (1 - lv('dnHeat')) * (1 - rescued), lv('dnFeast'), 0.6 * lv('dnTable'));
    const den = max(lv('dnDen') * max(lv('dnLower'), lv('dnSeal')) * (1 - lv('dnCalm')), lv('dnFell') * max(lv('dnStump'), 0.7) * (1 - lv('dnShoot')),
      0.7 * lv('dnWrite') * (1 - lv('dnRead')) * (1 - lv('dnDen')), sm(0.1, 0.25, lv('gloom')));
    const faith = max(rescued, lv('dnVeg'), lv('dnWin'), lv('dnTree') * (1 - lv('dnFell')), lv('dnShoot'), lv('dnCalm') * (1 - lv('dnV7')), lv('dnRest'), 0.6 * lv('dnBirds'));
    return stack([['stone', stone], ['fire', fire * (1 - lv('dnRest'))], ['wrath', wrath], ['den', den], ['image', image], ['faith', faith]], 'court');
  };
  // 尼布甲尼撒的乐队（但 3:5）：号角、笛、竖琴、鼓一齐
  function royalBand(a, g) {
    hornCall(a, g * 0.8, -0.4);
    a.pipe([['E5', 0.3], ['F5', 0.3], ['E5', 0.3], ['Cs5', 0.3], ['D5', 0.3], ['Cs5', 0.3], ['A4', 1]], { g: g * 0.38, pan: 0.45, bright: 5, breath: 0.2, vib: 8, at: 0.3, rev: 0.55 });
    a.lyre('A3', 7, g * 0.7, 0.1, 'hijaz', { gap: 0.16 });
    timbrel(a, g * 0.8, -0.1, 'D.tD.tD.tD.D.', 0.2);
  }
  // 弥尼、弥尼、提客勒、乌法珥新：墙上的字一个一个发光
  function mene(a, g) {
    [['E5', 0], ['C5', 0.32], ['E5', 1.1], ['C5', 1.42], ['D5', 2.2], ['Bb4', 2.52], ['A4', 3.3], ['F4', 3.62], ['E4', 3.94]].forEach(([n, at], i) =>
      a.note({ f: n, g: g * (i === 8 ? 0.8 : 0.6), a: 0.003, d: 2.2, at, pan: -0.4 + i * 0.1, rev: 0.75 }));
  }
  // 提客勒：天平摇了两下，落在低处
  function tekel(a, g) {
    [['F4', 0], ['E4', 0.5], ['F4', 1.0], ['E4', 1.5], ['C4', 2.2]].forEach(([n, at], i) => a.ping(n, at, g * (0.55 - i * 0.04), i % 2 ? 0.3 : -0.3));
  }
  music('daniel', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      court: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'soft', 0.12, 0.3], ['Bb3', 's', 0.035, -0.35], ['E4', 's', 0.06, 0.4], ['A3', 'over', 0.05, 0]],
      faith: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'flute', 0.14, -0.3], ['Fs4', 's', 0.07, 0.35], ['B4', 's', 0.035, -0.45]],
      wrath: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.24, 0.3], ['E3', 'soft', 0.1, -0.2]], pulse: [1.0, 0.3] },
      image: [['A1', 's', 0.28, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.26, -0.2], ['A2', 'reed', 0.045, 0.15], ['Cs4', 'soft', 0.12, 0.3], ['G4', 's', 0.035, -0.4], ['E4', 's', 0.05, 0.4]],
      stone: [['A1', 's', 0.22, 0], ['A2', 's', 0.26, 0], ['E3', 'soft', 0.14, 0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.13, 0], ['A4', 'choir', 0.08, 0]],
      fire: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['B3', 's', 0.12, 0.3], ['Ds4', 's', 0.05, -0.35], ['Gs4', 's', 0.05, 0.4], ['Cs5', 's', 0.03, -0.45], ['E5', 's', 0.018, 0.5]],
      den: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.22, -0.3], ['D3', 'soft', 0.1, -0.2], ['F3', 's', 0.06, 0.3]],
    } },
    mix(lv) {
      const g = dnG(lv);
      const lp = 1300 * (1 + 0.8 * g.stone + 0.7 * g.fire + 0.3 * g.image + 0.3 * g.faith) * (1 - 0.35 * g.wrath) * (1 - 0.35 * g.den) * (1 - 0.2 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.2 * g.den - 0.15 * g.wrath + 0.15 * g.stone, drone: 1 + 0.2 * g.wrath + 0.1 * g.den - 0.15 * g.stone };
    },
    scale(lv) {
      switch (top(dnG(lv))) {
        case 'stone': return 'ion';
        case 'fire': return 'lyd';
        case 'wrath': return 'phryg';
        case 'den': return lv('dnDew') > 0.5 && lv('dnDen') < 0.5 ? 'sus' : 'aeol';
        case 'image': return lv('dnFeast') > 0.5 || lv('dnTable') > 0.5 ? 'hijaz' : 'mixo';
        case 'faith': return 'maj';
        default: return 'hijaz';
      }
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      switch (top(dnG(lv))) {
        case 'stone':
          if (lv('dnSon') > 0.3 || lv('dnGlory') > 0.3) {                      // 像人子的驾着天云而来
            a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g, a: 1, s: 1.6, r: 3, pan: 0 });
            hornCall(a, g * 0.7, -0.4);
            return [11, 15];
          }
          a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.9, a: 1.2, s: 1.4, r: 3, pan: 0 });   // 石头变成一座大山，充满天下
          a.bells(['A5', 'E6'], 0.3, g * 0.5, 3, 0.8);
          return [11, 15];
        case 'fire':
          if (lv('dnFirm') > 0.5 || lv('dnStars') > 0.5) { a.lyre('A4', a.rint(3, 5), g * 0.7, p, 'lyd', { gap: 0.3 }); return [11, 15]; }   // 发光如同天上的光
          if (lv('dnReveal') > 0.5) { a.angelRun(g * 0.85); return [8, 12]; }  // 夜间异象中显明
          if (lv('dnRead') > 0.5) { a.lyre('A4', 4, g * 0.7, p, 'lyd', { gap: 0.3 }); return [10, 14]; }
          a.choir(['A3', 'E4', 'B4', 'Ds5'], { gs: [1, 0.85, 0.6, 0.4], g: g * 0.7, a: 1.2, s: 1.4, r: 2.8, pan: 0 });   // 火中那第四个、坑中的使者、穿细麻衣的
          a.glass(g * 0.5, 2);
          return [10, 14];
        case 'wrath':
          if (lv('dnScale') > 0.4) return [3, 5];                             // 提客勒：由 motif2 奏（tekel）
          if (lv('dnV7') > 0.5 && lv('dnSea') > 0.3) return [8, 12];           // 天的四风刮在大海之上
          a.bowed(a.pick(['A2', 'Bb2', 'C3', 'E3']), g * 0.85, p);
          if (lv('dnHeat') > 0.5 && Math.random() < 0.5) a.knocks([[0, 300, 70, g, true], [0.62, 300, 72, g * 0.7, true]], { lp: 700, pan: -p, rev: 0.6 });
          return [11, 16];
        case 'den':
          if (lv('dnWrite') > 0.5 && lv('dnRead') < 0.5) {                     // 字写在墙上：王的脸变了色（弥尼……由 motif2 奏）
            a.bowed(a.pick(['A2', 'E3']), g * 0.7, p); return [8, 11];
          }
          a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.8, p); return [13, 19];
        case 'image':
          if (lv('dnImage') > 0.5 && lv('dnStone') < 0.3) {                    // 金头、银胸、铜腹、铁腿、半铁半泥的脚
            [['A5', 3.2, 1], ['E5', 2.6, 0.85], ['Cs5', 2, 0.7], ['A4', 1.2, 0.55], ['E4', 0.35, 0.45]].forEach(([n, d, k], i) => {
              a.note({ f: n, g: g * 0.6 * k, a: 0.003, d, at: i * 0.7, pan: 0.3 - i * 0.15, rev: 0.6 });
              a.note({ f: a.hz(n) * 2.76, g: g * 0.08 * k * (1 - i * 0.2), a: 0.002, d: d * 0.3, at: i * 0.7, pan: 0.3 - i * 0.15, rev: 0.4 });
            });
            return [9, 13];
          }
          if (lv('dnStone') > 0.3 && lv('dnMountGlow') < 0.3) {                // 石头打在脚上
            a.knocks([[0, 400, 60, g * 1.2, true], [0.08, 900, 90, g * 0.8, true], [0.2, 1400, 120, g * 0.5, false]], { lp: 1200, pan: 0, rev: 0.6 });
            return [6, 9];
          }
          if (lv('dnGold') > 0.5) { royalBand(a, g); return [9, 12]; }          // 你们一听见角、笛……各样乐器的声音
          if (lv('dnFeast') > 0.5) { a.oud(g, p); timbrel(a, g * 0.6, -p, 'D..tD.t.', 0.18); return [9, 13]; }   // 伯沙撒的盛筵
          a.lyre('A3', a.rint(4, 6), g * 0.75, p, 'hijaz', { gap: 0.2 }); return [12, 17];
        case 'faith':
          if (lv('dnRest') > 0.4) { soft(a, g, p, 'maj', 3); return [15, 21]; }   // 你必安歇
          if (lv('dnWin') > 0.5) { a.pipe([['E4', 0.6], ['Fs4', 0.4], ['A4', 0.8], ['B4', 0.4], ['A4', 1.4]], { g: g * 0.45, pan: 0.4, bright: 3, breath: 0.25, vib: 9, rev: 0.7 }); return [12, 16]; }   // 一日三次，向耶路撒冷跪下
          if (lv('dnTree') > 0.5 && lv('dnFell') < 0.5) { a.shepherd(g * 0.85, p); return [12, 17]; }
          a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.3 }); return [13, 18];
        default:
          if (Math.random() < 0.5) a.oud(g * 0.9, p); else a.lyre('A3', a.rint(4, 6), g * 0.75, p, 'hijaz', { gap: 0.22 });   // 巴比伦的宫
          return [13, 19];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (once('dnHand', lv('dnHand'), 0.02, 0.5, () => mene(a, g))) return [5, 7];      // 指头一笔一笔写出
      if (once('dnScale', lv('dnScale'), 0.05, 0.6, () => tekel(a, g))) return [4, 6];   // 你被称在天平里
      if (lv('dnRise') > 0.05 && lv('dnRise') < 0.97) { a.ping(a.deg('lyd', 'A5', a.rint(0, 11)), 0, g * 0.45, a.pan()); return [0.4, 0.9]; }   // 睡在尘埃中的复醒
      if (lv('dnStars') > 0.5) { a.starPing(g); return [0.7, 1.8]; }
      if (lv('dnHeat') > 0.5 && lv('dnFurnace') > 0.5) { a.pluck(a.deg('phryg', 'A4', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.35); return [0.8, 2]; }   // 窑火
      if (lv('dnBirds') > 0.5) { a.pluck(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.35, a.pan(), 0.3); return [1.5, 3]; }
      if (lv('dnDew') > 0.5) { a.glass(g * 0.35, 1); return [4, 7]; }          // 天露滴湿
      if (lv('dnKings') > 0.5 && lv('dnFirm') < 0.5) { a.note({ f: 'E4', type: 'warm', lp: 1100, g: g * 0.4, a: 0.2, s: 0.6, r: 1.4, pan: a.pick([-0.8, 0.8]), rev: 0.9 }); return [4, 7]; }   // 南北诸王的烽火
      if (lv('dnAngelL') > 0.5) { a.glass(g * 0.4, 1); return [3, 6]; }
      return [1, 1.5];                                                        // 每秒看一眼（墙上的字、天平）
    },
  });
})(window.GS);
