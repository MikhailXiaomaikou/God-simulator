/* ─────────────────────────────────────────────────────────────
 * music/ot2.js —— 旧约各卷的乐曲（第二批）：出埃及记（摩西 · 十灾 · 红海）· 利未记 · 民数记 · 申命记 · 路得记
 *                  · 撒母耳记上（撒母耳 · 大卫）· 列王纪上（所罗门 · 以利亚）· 列王纪下（以利沙）
 *
 * 写法见 js/music/ot1.js 顶上的说明。仍然全在 A 上：一卷只换色彩。本文件另有两样小工具——
 *   · said(id)：本卷已成就了几句话（0 = 还没开口；n = 第 n 句已成就）。有些光景没有自己的程度
 *     （燃烧的荆棘、逾越节的夜、迦密山的坛、禾场的夜……），就按句读。W.stage 在话语成就的那一刻加一，
 *     恢复存档、提前言说时也一样，所以乐色与画面始终一致。
 *   · 几件乐器（都在乐声总线上、可舍的优先级）：羊角、银号、手鼓与串铃、领唱的人声、竖琴的一扫、战鼓、
 *     车马的蹄声、成群的虫、一级一级亮起的拨弦。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  if (!GS || !GS.audio || !GS.audio.music) return;
  const music = GS.audio.music, W = GS.W;
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
  // 本卷已成就了几句话
  function said(id) {
    const B = GS.book, a = B && B.find ? B.find(id) : null;
    return a && W ? Math.max(0, (W.stage | 0) - a.first) : 0;
  }
  const tod = () => (W && isFinite(W.tod) ? W.tod : 0.4);

  // ── 共用的乐器 ────────────────────────────────────────────
  // 应答的诗篇：I · IV · I，左右两班
  function psalm(a, g, minor) {
    const I = ['A3', minor ? 'C4' : 'Cs4', 'E4', 'A4'], IV = ['A3', 'D4', minor ? 'F4' : 'Fs4', 'A4'];
    a.choir(I, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.9, a: 0.8, s: 0.7, r: 1.6, pan: -0.3 });
    a.choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 0.8, s: 0.6, r: 1.6, at: 2.2, pan: 0.3 });
    a.choir(I, { gs: [1, 0.8, 0.75, 0.55], g: g * 0.9, a: 0.9, s: 1.1, r: 2.8, at: 4.4, pan: 0 });
  }
  // 羊角（shofar）：先低，跃上五度，末了还往上一扬（tekiah）；far 是远处的角
  function shofar(a, g, p, far) {
    const lo = a.hz('A3'), hi = a.hz('E4'), lp = far ? 1000 : 1500, k = far ? 0.7 : 1;
    a.note({ f: lo * 0.95, type: 'reed', lp, path: [[lo, 0.09], [lo, 0.2]], g: g * 0.55 * k, a: 0.07, s: 0.2, r: 0.14, pan: p, rev: far ? 0.8 : 0.65 });
    a.note({ f: hi * 0.97, type: 'reed', lp, path: [[hi, 0.12], [hi, 1.1], [hi * 1.03, 0.5]], g: g * 0.7 * k, a: 0.09, s: 1.4, r: 0.4, at: 0.32,
      pan: p, rev: far ? 0.85 : 0.7, vib: [5.2, 0.004] });
  }
  // 远处的号角（柔和的弓弦铜管）：一声五度
  function hornCall(a, g, p) {
    a.note({ f: 'A3', type: 'warm', lp: 1300, g: g * 1.1, a: 0.12, s: 0.3, r: 1.1, vib: [5, 0.004], pan: p, rev: 0.75 });
    a.note({ f: 'E4', type: 'warm', lp: 1700, g, a: 0.15, s: 0.9, r: 2.2, at: 0.55, vib: [5, 0.004], pan: p, rev: 0.8 });
  }
  // 银号（民数记 10:2）：两枝，五度相和；alarm 是「吹出大声」的急促几声
  function trumpets(a, g, p, alarm) {
    [['A4', 'E5'], ['E4', 'A4']].forEach(([lo, hi], i) => {
      const L = a.hz(lo), H = a.hz(hi), pn = p + (i ? -0.18 : 0.18), k = i ? 0.7 : 1, t0 = (alarm ? 0.72 : 0) + i * 0.012;
      if (alarm) [0, 0.24, 0.48].forEach(t1 => a.note({ f: L, type: 'reed', lp: 2600, g: g * 0.4 * k, a: 0.02, s: 0.12, r: 0.06, at: t1 + i * 0.012, pan: pn, rev: 0.6 }));
      a.note({ f: L * 0.98, type: 'reed', lp: 2600, path: [[L, 0.05], [L, 0.4]], g: g * 0.42 * k, a: 0.03, s: 0.4, r: 0.1, at: t0, pan: pn, rev: 0.6 });
      a.note({ f: H * 0.99, type: 'reed', lp: 3000, path: [[H, 0.05], [H, 1.4]], g: g * 0.5 * k, a: 0.03, s: 1.3, r: 0.35, at: t0 + 0.52, pan: pn, rev: 0.65, vib: [4.5, 0.003] });
    });
  }
  // 手鼓与串铃（6/8 的舞步：咚 · 嗒 咚 · 嗒 | 咚 · 嗒 咚 嗒嗒 | 咚）
  function timbrel(a, g, p, n) {
    const beat = a.rnd(0.19, 0.23);
    const P = [[0, 1], [2, 0.5], [3, 0.8], [5, 0.5], [6, 1], [8, 0.5], [9, 0.8], [10, 0.45], [11, 0.5], [12, 1]].slice(0, n || 10);
    a.knocks(P.map(([st, acc]) => {
      const heavy = acc >= 0.8;
      return [st * beat + a.rnd(-0.006, 0.006), heavy ? a.rnd(260, 340) : a.rnd(1400, 2000), heavy ? a.rnd(95, 112) : a.rnd(270, 320), g * (heavy ? 1.2 : 0.95) * acc, heavy];
    }), { q: 1.3, lp: 5000, pan: p, rev: 0.4 });
    P.filter(x => x[1] >= 0.8).forEach(([st]) => a.burst({ buf: 'white', ft: 'bandpass', f: 7400, q: 1.6, hp: 4800, g: g * 0.8, a: 0.002, d: 0.09, at: st * beat, pan: p, rev: 0.35 }));
  }
  // 战鼓（远处）
  function drum(a, g, p) {
    a.knocks([[0, 300, 70, g * 1.4, true], [0.62, 300, 72, g, true], [1.24, 300, 70, g * 1.3, true], [1.55, 320, 74, g * 0.8, true], [1.86, 300, 70, g * 1.2, true]], { lp: 700, pan: p, rev: 0.6 });
  }
  // 车马的蹄声（远处，n 个回合）
  function gallop(a, g, p, n) {
    const hits = [];
    for (let i = 0; i < (n || 4); i++) {
      const t0 = i * 0.4 + a.rnd(-0.01, 0.01);
      hits.push([t0, 420, 90, g * 1.1, true], [t0 + 0.11, 900, 130, g * 0.55, false], [t0 + 0.2, 700, 110, g * 0.75, false]);
    }
    a.knocks(hits, { lp: 1200, pan: p, rev: 0.5 });
  }
  // 领唱的人声：一口气唱完的一句，每音一阶（人声的波形经低通），line = [[音名, 秒], ...]
  function cantor(a, line, g, p, o) {
    o = o || {};
    const f0 = a.hz(line[0][0]), path = [];
    let tot = 0;
    line.forEach(([n, d], i) => { const f = a.hz(n); if (i) path.push([f, 0.07]); path.push([f, Math.max(0.05, d - (i ? 0.07 : 0))]); tot += d; });
    a.note({ f: f0, type: o.wave || 'voice', lp: o.lp || 1500, path, g: g * (o.k || 0.55), a: 0.2, s: Math.max(0.1, tot - 0.2), r: o.r || 1,
      vib: [5, 0.006], pan: p, rev: o.rev || 0.65 });
  }
  // 竖琴的一扫：一串分解的弦（大卫的琴、弹琴的人）
  function sweep(a, notes, g, p, o) {
    o = o || {};
    a.strings(notes.map((n, i) => [n, i * (o.gap || 0.075), g * (o.k || 0.7) * (1 - i * 0.035), o.d || 2.6]),
      { wave: o.wave || 'harp', bright: o.bright || 5, d: o.d || 2.6, pan: p, spread: 0.3, rev: o.rev || 0.6 });
  }
  // 一级一级亮起的拨弦（名字、器皿、灯）：自 base 起在 sc 上 n 级
  function steps(a, base, sc, n, g, p, gap, d) {
    a.strings(Array.from({ length: n }, (_, i) => [a.deg(sc, base, i), i * gap, g * (0.55 + 0.45 * i / Math.max(1, n - 1)), d || 1.8]),
      { wave: 'harp', bright: 5, d: d || 1.8, pan: p, spread: 0.25, rev: 0.6 });
  }
  // 成群的虫：几声散开的、半音挨着半音的短拨
  function buzz(a, g) {
    const n = a.rint(4, 7), ns = [];
    for (let i = 0; i < n; i++) ns.push([a.pick(['Bb4', 'A4', 'B4', 'C5', 'Bb5', 'A5']), i * a.rnd(0.05, 0.12), g * a.rnd(0.3, 0.55), 0.32]);
    a.strings(ns, { wave: 'oud', bright: 3, d: 0.32, pan: a.pan(), spread: 0.6, rev: 0.35 });
  }
  // 活水：一串下行的玻璃般的拨弦
  function flowing(a, g, sc) {
    const i0 = a.rint(8, 10), n = a.rint(5, 7), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'maj', 'A4', i0 - k), k * 0.12, g * (1 - k * 0.07), 1.8]);
    a.strings(ns, { wave: 'sine', bright: 2, d: 1.8, pan: a.pan(), spread: 0.35, rev: 0.75 });
  }
  // 火舌：几声高处的、急促而不齐的短拨（荆棘里的火、坛上的火星）
  function flicker(a, g, sc) {
    const n = a.rint(4, 6), ns = [];
    for (let i = 0; i < n; i++) ns.push([a.deg(sc || 'lyd', 'A5', a.rint(0, 6)), i * a.rnd(0.05, 0.13), g * a.rnd(0.35, 0.7), 0.6]);
    a.strings(ns, { wave: 't', bright: 4, d: 0.6, pan: a.pan(), spread: 0.5, rev: 0.6 });
  }

  // ══ 出埃及记 · 摩西 ══════════════════════════════════════
  // 埃及的砖场：Hijaz（b2 与大三度）、低处缓慢的劳作的脉动，乌德；尼罗河暗了（弗里几亚）；
  // 芦荻中的蒲草箱（温柔的 A6/9，牧笛的摇篮曲）；米甸的旷野（没有三音的挂留，苇笛）；
  // 哀声达于神（无字的合唱，爱奥利亚，往上升）；荆棘被火烧着却没有烧毁（利底亚，一闪一闪的脉动，火舌）；
  // 圣地与「我是自有永有的」：只有五度与九度叠起来的「在」——没有三音，没有情绪，只是「是」；深夜星下的铃；
  // 流奶与蜜之地、我必与你同在、百姓低头下拜（A 大九的温暖，应答的诗篇）。
  music('moses', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      bond: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['Bb2', 'soft', 0.1, -0.3], ['Cs3', 'soft', 0.2, 0.3], ['G3', 's', 0.06, 0.35]], pulse: [0.75, 0.26] },
      nile: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.26, -0.3], ['F3', 'soft', 0.1, 0.3], ['Bb3', 's', 0.04, -0.4]],
      reeds: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 's', 0.1, 0.1], ['Cs4', 'flute', 0.15, 0.3], ['Fs4', 's', 0.07, -0.35], ['B4', 's', 0.03, 0.45]],
      midian: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.34, 0.2], ['B3', 'soft', 0.15, -0.3], ['D4', 's', 0.08, 0.35], ['A3', 'over', 0.04, 0]],
      cry: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.24, 0.1], ['A3', 'choir', 0.17, 0], ['C4', 'choir', 0.14, 0], ['E4', 'choir', 0.1, 0], ['G4', 'choir', 0.06, 0]],
      bush: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['Ds4', 's', 0.07, -0.35], ['Gs4', 's', 0.05, 0.4], ['A3', 'over', 0.08, 0.1]], pulse: [3.3, 0.14] },
      holy: [['A1', 's', 0.34, 0], ['E2', 's', 0.22, 0.1], ['A2', 'over', 0.08, 0], ['E3', 's', 0.14, -0.15], ['A3', 'choir', 0.16, 0], ['B3', 'choir', 0.1, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.07, 0]],
      promise: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 's', 0.14, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['E4', 's', 0.09, 0.35], ['B4', 's', 0.035, -0.45], ['Cs5', 's', 0.025, 0.5]],
    } },
    mix(lv) {
      const k = said('moses');
      const dark = cl(lv('msDark')), cry = cl(lv('msCry'));
      const reeds = k === 3 ? 0.85 : k === 2 ? 0.35 : 0;                       // 收生婆的家室亮起灯来；芦荻中的箱子
      const bush = k === 6 || k === 7 ? 1 : 0;                                  // 荆棘被火烧着（到脱鞋之前）
      const holy = max(k === 10 ? 1 : 0, cl(lv('msHoly')) * (k >= 11 ? 0.45 : 1));  // 圣地；自有永有；天亮以后只留一点
      const prom = cl(max(lv('msPromise'), 0.85 * lv('msVisit'), k >= 12 ? 0.55 * lv('msWith') : 0));
      const g = stack([['cry', cry], ['holy', k === 10 ? 1 : 0], ['promise', prom], ['bush', bush], ['holy', holy], ['nile', dark], ['reeds', reeds], ['bond', k <= 3 ? 1 : 0]], 'midian');
      const lp = 1300 * (1 + 0.5 * g.bush + 0.6 * g.holy + 0.4 * g.promise + 0.2 * g.reeds + 0.25 * cl(lv('msHoreb')) * g.midian)
        * (1 - 0.15 * g.bond) * (1 - 0.4 * g.nile) * (1 - 0.1 * g.cry);
      return { g, lp, dlp: 1 - 0.2 * g.nile, drone: 1 + 0.15 * g.bond + 0.25 * g.holy };
    },
    scale(lv) {
      const k = said('moses');
      if (k === 10) return 'lyd';
      if (lv('msCry') > 0.5) return 'aeol';
      if (lv('msPromise') > 0.5 || lv('msVisit') > 0.5) return 'maj';
      if (k === 6 || k === 7 || (lv('msHoly') > 0.5 && k <= 11)) return 'lyd';
      if (lv('msDark') > 0.5) return 'phryg';
      if (k === 3) return 'maj';
      if (k <= 3) return 'hijaz';
      return k >= 12 ? 'ion' : 'sus';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('moses');
      if (k === 10) {                                                                             // 我是自有永有的：星下的铃，只有五度
        a.bells(['A4', 'E5', 'B5'], 0.9, g * 0.7, 4.2);
        a.choir(['A2', 'E3', 'B3', 'E4'], { gs: [1, 0.8, 0.6, 0.5], g: g * 0.7, a: 2, s: 2, r: 3.5, at: 2.4, pan: 0 });
        return [14, 19];
      }
      if (lv('msCry') > 0.5) {                                                                    // 哀声往上升
        a.choir(['A3', 'C4', 'E4'], { gs: [1, 0.85, 0.7], g: g * 0.75, a: 1.4, s: 0.8, r: 2.2, pan: -0.2 });
        a.choir(['C4', 'E4', 'G4'], { gs: [1, 0.8, 0.7], g: g * 0.7, a: 1.4, s: 0.8, r: 2.6, at: 2.6, pan: 0.2 });
        return [10, 14];
      }
      if (lv('msVisit') > 0.5) { psalm(a, g); return [11, 15]; }                                  // 百姓就信了，低头下拜
      if (lv('msPromise') > 0.5) { a.lyre('A4', a.rint(4, 6), g * 0.85, p, 'maj', { gap: 0.3 }); return [11, 16]; }
      if (k === 6 || k === 7) {                                                                   // 荆棘里的火
        flicker(a, g * 0.9, 'lyd');
        a.bowed('A2', g * 0.6, -p);
        return [8, 12];
      }
      if (lv('msHoly') > 0.5 && k <= 11) {
        a.choir(['A3', 'E4', 'B4'], { gs: [1, 0.8, 0.55], g: g * 0.8, a: 1.6, s: 1.2, r: 3, pan: p * 0.5 });
        return [13, 18];
      }
      if (lv('msDark') > 0.5) { a.bowed(a.pick(['A2', 'Bb2', 'C3', 'F3']), g * 0.85, p); return [13, 19]; }
      if (k === 3) {                                                                              // 芦荻中的摇篮曲
        a.pipe([['E5', 0.5], ['Cs5', 0.5], ['B4', 0.35], ['Cs5', 0.35], ['A4', 1.4]], { g: g * 0.45, pan: p, bright: 4, breath: 0.25, vib: 9, rev: 0.6 });
        return [12, 17];
      }
      if (k <= 3) { a.oud(g * 0.9, p); return [12, 18]; }                                         // 埃及
      if (k >= 12) { a.lyre('A4', a.rint(3, 5), g * 0.8, p, 'ion'); return [13, 18]; }
      if (a.night() > 0.5) { a.lyre('A3', a.rint(3, 4), g * 0.7, p, 'sus', { gap: 0.45 }); return [17, 24]; }
      if (Math.random() < 0.5) a.ney(g, p); else a.shepherd(g * 0.85, p);                        // 米甸的旷野，群羊
      return [14, 21];
    },
    motif2(t, g, a) {
      const k = said('moses');
      if (k === 10) { a.starPing(g); return [0.6, 1.6]; }                                         // 以火写在星空之下
      if (k === 6 || k === 7) { flicker(a, g * 0.5, 'lyd'); return [1.6, 3.4]; }
      if (k <= 1) {                                                                               // 和泥，做砖
        const p = a.pan();
        a.knocks([[0, 1100, 160, g * 0.45, false], [0.55, 1000, 150, g * 0.4, false], [1.1, 1150, 165, g * 0.45, false]], { lp: 2400, pan: p, rev: 0.3 });
        return [7, 12];
      }
      return [5, 9];
    },
  });

  // ══ 出埃及记 · 十灾 ══════════════════════════════════════
  // 法老的宫：凝固的 Hijaz（风琴般的偶次泛音，没有脉动——刚硬的心），乌德；「我是耶和华」：伊奥尼亚的合唱与风琴；
  // 血（弗里几亚，心跳般的脉动）；蛙、虱、蝇、灰、蝗：同一团嗡嗡的半音与三全音，快速的颤动；雹与火（翻滚的脉动）；
  // 遍地乌黑三天，只有歌珊的屋里亮着（深处的 A 小，与一缕 A 大的光）；逾越节：门楣上的血，灯下的多利亚；
  // 半夜：空心的五度、缓慢的一口气，几乎无声；黎明出埃及：混合利底亚的行路的脉动；「要分别为圣归我」。
  music('plagues', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      court: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'over', 0.07, 0], ['Bb2', 'soft', 0.1, -0.3], ['Cs3', 'soft', 0.18, 0.3], ['F3', 's', 0.06, -0.35]],
      name: [['A1', 's', 0.3, 0], ['A2', 's', 0.2, 0], ['E3', 'soft', 0.2, -0.15], ['A3', 'over', 0.08, 0.1], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.09, 0]],
      blood: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'warm', 0.07, -0.3], ['C3', 'soft', 0.24, 0.3], ['F3', 's', 0.08, -0.35]], pulse: [0.9, 0.3] },
      swarm: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.28, 0.1], ['Bb2', 'soft', 0.13, -0.3, -8], ['B2', 'soft', 0.08, 0.3, 6], ['Ds3', 'soft', 0.1, -0.2], ['E3', 's', 0.08, 0.4]], pulse: [5.2, 0.2] },
      hail: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['A2', 'grit', 0.03, 0], ['C3', 'soft', 0.24, -0.3], ['Ds3', 's', 0.06, 0.3], ['F3', 's', 0.06, -0.35]], pulse: [0.45, 0.25] },
      dark: [['A1', 's', 0.52, 0], ['E2', 'soft', 0.3, 0.1], ['C3', 'soft', 0.2, -0.3], ['Bb2', 's', 0.06, 0.3]],
      goshen: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'flute', 0.15, 0.3], ['E4', 's', 0.08, -0.35], ['A4', 's', 0.04, 0.45]],
      night: { v: [['A1', 's', 0.46, 0], ['E2', 's', 0.3, 0.1], ['A2', 'soft', 0.12, -0.2], ['E3', 'soft', 0.12, 0.25], ['C4', 's', 0.05, -0.35]], pulse: [0.2, 0.35] },
      exodus: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'warm', 0.08, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.08, 0.35], ['G4', 's', 0.04, -0.45]], pulse: [1.05, 0.18] },
    } },
    mix(lv) {
      const k = said('plagues');
      const name = cl(max(lv('plName'), k >= 14 ? 0.7 : 0));                                   // 我是耶和华；末了：要分别为圣归我
      const frogs = lv('plFrog') * (1 - 0.5 * lv('plFrogDie')) * (1 - lv('plFrogGone'));
      const swarm = cl(max(frogs, lv('plLice'), lv('plFly'), 0.8 * lv('plAsh'), lv('plLocust')));
      const hail = cl(max(lv('plHail'), sm(0.4, 0.9, lv('storm'))));
      const dark = cl(lv('plDark'));
      const goshen = cl(max(0.7 * lv('plWall'), 0.6 * lv('plShine'), k === 11 ? 1 : 0));
      const host = cl(lv('plHost')), shade = cl(lv('plShade'));                                 // 出埃及的大队；黎明里埃及的城退入阴影
      const night = k === 11 ? 0.55 : k === 12 ? 1 : k === 13 ? 0.45 * (1 - host) : 0;          // 逾越节的夜；半夜；天未亮时半夜还留着
      const g = stack([['name', name], ['hail', hail], ['dark', 0.75 * dark], ['goshen', dark], ['swarm', swarm], ['blood', lv('plBlood')],
        ['night', night], ['goshen', goshen], ['exodus', k >= 13 ? 1 : 0]], 'court');
      const lp = 1300 * (1 + 0.8 * g.name + 0.5 * g.goshen + 0.4 * g.exodus * (0.6 + 0.4 * host) + 0.15 * g.swarm + 0.2 * shade) * (1 - 0.35 * g.blood) * (1 - 0.45 * g.dark)
        * (1 - 0.3 * g.night) * (1 - 0.3 * g.hail) * (1 - 0.1 * g.court);
      return { g, lp, dlp: 1 - 0.25 * g.dark - 0.15 * g.blood, drone: 1 + 0.25 * g.blood + 0.3 * g.dark - 0.2 * g.exodus, pad: 1 - 0.3 * (k === 12 ? 1 : 0) };
    },
    scale(lv) {
      const k = said('plagues');
      if (lv('plName') > 0.5 || k >= 14) return 'ion';
      if (k === 13) return 'mixo';
      if (k === 12) return 'phryg';
      if (k === 11) return 'dor';
      if (lv('plDark') > 0.5) return 'aeol';
      if (lv('plHail') > 0.5 || lv('storm') > 0.5) return 'phryg';
      if (lv('plShine') > 0.5 || (lv('plWall') > 0.5 && max(lv('plFly'), lv('plAsh')) < 0.4)) return 'maj';
      if (max(lv('plBlood'), lv('plLice'), lv('plFly'), lv('plAsh'), lv('plLocust'), lv('plHail'), lv('storm')) > 0.5) return 'phryg';
      return 'hijaz';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('plagues');
      if (lv('plName') > 0.5 || k >= 14) {                                                      // 我是耶和华 / 分别为圣
        a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.75, 0.55], g: g * 0.9, a: 1.2, s: 1.4, r: 3, pan: 0 });
        a.bowed('A2', g * 0.55, p);
        return [12, 17];
      }
      if (k === 13) {                                                                             // 月下出埃及，扛着抟面盆
        a.pipe([['A4', 0.3], ['B4', 0.3], ['Cs5', 0.45], ['E5', 0.3], ['D5', 0.3], ['Cs5', 0.3], ['B4', 0.3], ['G4', 0.45], ['A4', 1.2]], { g: g * 0.45, pan: p, bright: 4, breath: 0.25, vib: 8, rev: 0.6 });
        return [10, 14];
      }
      if (k === 12) return [9, 13];                                                               // 半夜：几乎无声
      if (k === 11) { a.lyre('A3', a.rint(3, 4), g * 0.75, p, 'dor', { gap: 0.5 }); return [14, 20]; }   // 逾越节的羊羔
      if (lv('storm') > 0.5 || lv('plHail') > 0.5) return [8, 12];                              // 雹与火本身就是音乐
      if (lv('plDark') > 0.5) { a.bowed(a.pick(['A1', 'E2', 'C3']), g * 0.8, p); return [15, 21]; }
      if (max(lv('plFly'), lv('plLice'), lv('plLocust'), lv('plFrog') * (1 - lv('plFrogGone'))) > 0.5) { buzz(a, g); return [7, 11]; }
      if (lv('plBlood') > 0.5 || lv('plAsh') > 0.5) {                                            // 刚硬的心：b2 落到 A 的叹息
        a.bowed('Bb2', g * 0.8, p);
        a.bowed('A2', g * 0.7, -p);
        return [13, 18];
      }
      if (lv('plShine') > 0.5 || lv('plWall') > 0.5) { a.shepherd(g * 0.85, p); return [13, 19]; }  // 歌珊地
      a.oud(g * 0.9, p); return k === 3 ? [9, 13] : [12, 18];                                    // 法老的宫、术士
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('plagues');
      if (k === 11 || lv('plDark') > 0.5) { a.ping(a.pick(['A4', 'Cs5', 'E5']), 0, g * 0.45, a.rnd(0.35, 0.85)); return [2, 4.5]; }  // 歌珊屋里的灯
      if (k === 13 && lv('plHost') > 0.3) { a.pluck(a.deg('mixo', 'A4', a.rint(0, 7)), 0, g * 0.4, a.rnd(-0.8, 0.6), 0.6); return [1.2, 2.6]; }   // 一长行的火把
      if (k === 13) { a.starPing(g * 0.7); return [2, 4]; }
      if (max(lv('plFly'), lv('plLocust')) > 0.5) { buzz(a, g * 0.6); return [2.5, 5]; }
      return [5, 9];
    },
  });

  // ══ 出埃及记 · 红海 ══════════════════════════════════════
  // 云柱（日间敞开的 A 加九与风琴光，夜里化作火柱）；法老的车辆（弗里几亚，奔马般的脉动）；
  // 「你举手向海伸杖」：大东风一夜，海分开——深处的 A1 与利底亚的敬畏，像海一样缓慢地起伏；水仍合（底鸣涌上来）；
  // 摩西之歌、米利暗的鼓（混合利底亚的合唱、手鼓与串铃）；玛拉的苦水（爱奥利亚 b6）；以琳的泉、磐石的水（流动的 A6/9）；
  // 吗哪如白霜、荣光在云中（高处散开的 A 大）；亚玛力（战鼓与号角）；神的山渐渐显出。
  music('redsea', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1400, groups: {
      pillar: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.15, 0.3], ['E4', 's', 0.08, -0.35], ['A3', 'over', 0.06, 0], ['Fs4', 's', 0.04, 0.4]],
      chase: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.32, 0.1], ['Bb2', 'soft', 0.1, -0.3], ['C3', 'soft', 0.24, 0.3], ['E3', 'soft', 0.1, -0.2], ['F3', 's', 0.05, 0.35]], pulse: [2.3, 0.22] },
      sea: { v: [['A1', 's', 0.36, 0], ['E2', 's', 0.24, 0.1], ['A2', 'over', 0.07, 0], ['E3', 'soft', 0.2, -0.2], ['B3', 'soft', 0.12, 0.3], ['Cs4', 'soft', 0.1, -0.3], ['Ds4', 's', 0.04, 0.4], ['Gs4', 's', 0.03, -0.45]], pulse: [0.16, 0.3] },
      song: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.13, 0], ['G4', 'choir', 0.06, 0]],
      bitter: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.26, -0.3], ['F3', 's', 0.08, 0.3], ['B3', 's', 0.03, -0.4]],
      spring: { v: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'soft', 0.15, 0.3], ['Fs4', 'flute', 0.07, -0.35], ['B4', 's', 0.035, 0.45]], pulse: [0.34, 0.2] },
      manna: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.26, -0.15], ['A3', 's', 0.14, 0.2], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.06, -0.45], ['Cs5', 's', 0.035, 0.5]],
      battle: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.08, -0.15], ['D3', 'soft', 0.18, 0.3], ['G3', 'soft', 0.1, -0.3], ['E3', 's', 0.08, 0.25]], pulse: [1.4, 0.24] },
    } },
    mix(lv) {
      const k = said('redsea');
      const close = cl(lv('rsClose'));
      const chase = cl(max(lv('rsArmy') * (1 - lv('rsSea')), 0.45 * lv('rsChase') * (1 - 0.5 * lv('rsWheels')), 0.7 * lv('rsFlee') * (1 - close)));
      const sea = cl(max(lv('rsSea'), lv('rsCross'), close, 0.8 * lv('rsWind')));
      const bitter = cl(lv('rsPool') * (1 - lv('rsMarah')));
      const spring = cl(max(0.8 * lv('rsMarah') * lv('rsPool'), lv('rsElim'), k >= 12 ? lv('rsSpring') : 0));
      const manna = cl(max(lv('rsGlory'), 0.7 * lv('rsQuail'), lv('rsDew'), lv('rsManna'), 0.8 * lv('rsRest')));
      const pillar = cl(max(0.8 * lv('rsGaze'), 0.5 * lv('rsDark') * (1 - 0.6 * sea), lv('rsRockGlory'), k >= 14 ? 0.6 * lv('rsHoreb') : 0));
      const g = stack([['pillar', pillar], ['battle', lv('rsBattle')], ['song', max(lv('rsDance'), 0.55 * lv('rsAltar'))], ['chase', chase], ['sea', sea],
        ['bitter', bitter], ['spring', spring], ['manna', manna]], 'pillar');
      const lp = 1400 * (1 + 0.4 * g.pillar + 0.5 * g.sea * (1 - close) + 0.5 * g.song + 0.6 * g.manna + 0.3 * g.spring)
        * (1 - 0.35 * g.chase) * (1 - 0.3 * g.bitter) * (1 - 0.15 * g.battle) * (1 - 0.45 * close);
      return { g, lp, dlp: 1 - 0.2 * g.chase + 0.3 * close, drone: 1 + 0.35 * close + 0.2 * g.chase + 0.2 * g.sea * cl(lv('rsWind')), tc: close > 0.2 ? 1.4 : 2.2 };
    },
    scale(lv, night) {
      if (lv('rsDance') > 0.4 || lv('rsBattle') > 0.5) return 'mixo';
      if (lv('rsAltar') > 0.5) return 'maj';
      if (lv('rsArmy') * (1 - lv('rsSea')) > 0.5 || lv('rsChase') > 0.6) return 'phryg';
      if (lv('rsClose') > 0.3) return 'sus';
      if (max(lv('rsSea'), lv('rsCross')) > 0.5) return 'lyd';
      if (lv('rsPool') * (1 - lv('rsMarah')) > 0.5) return 'aeol';
      if (max(lv('rsGlory'), lv('rsManna'), lv('rsDew'), lv('rsElim'), lv('rsRest'), lv('rsSpring')) > 0.4) return 'maj';
      return night > 0.5 ? 'lyd' : 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('redsea');
      if (lv('rsDance') > 0.4) {                                                                  // 你们要歌颂耶和华：米利暗的鼓
        timbrel(a, g, p);
        a.choir(['A3', 'Cs4', 'E4', 'G4'], { gs: [1, 0.85, 0.7, 0.45], g: g * 0.7, a: 0.5, s: 0.8, r: 1.8, at: 1.4, pan: -p });
        a.pipe([['E5', 0.22], ['Fs5', 0.22], ['E5', 0.22], ['D5', 0.22], ['Cs5', 0.44], ['A4', 0.9]], { g: g * 0.4, pan: -p * 0.6, bright: 5, breath: 0.2, vib: 8, at: 2.6 });
        return [7, 10];
      }
      if (lv('rsBattle') > 0.5) { drum(a, g, p); if (Math.random() < 0.6) shofar(a, g, -p, true); return [8, 12]; }
      if (lv('rsAltar') > 0.5) { hornCall(a, g, p); a.lyre('A4', a.rint(4, 5), g * 0.7, -p, 'maj'); return [12, 16]; }   // 耶和华尼西
      if (lv('rsClose') > 0.3) return [6, 9];                                                     // 海的轰响
      if (lv('rsArmy') * (1 - lv('rsSea')) > 0.5 || lv('rsChase') > 0.6 || lv('rsFlee') > 0.5) { gallop(a, g, p, a.rint(3, 5)); return [8, 12]; }
      if (max(lv('rsSea'), lv('rsCross')) > 0.5) {                                                // 水在左右作了墙垣
        a.bowed(a.pick(['A1', 'E2', 'A2']), g * 0.7, p);
        a.lyre('A4', a.rint(3, 4), g * 0.6, -p, 'lyd', { gap: 0.45 });
        return [10, 14];
      }
      if (lv('rsPool') * (1 - lv('rsMarah')) > 0.5) { a.ney(g, p); return [12, 17]; }
      if (max(lv('rsGlory'), lv('rsManna'), lv('rsDew'), lv('rsRest')) > 0.4) { a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.36 }); return [11, 15]; }
      if (max(lv('rsElim'), lv('rsSpring'), lv('rsMarah')) > 0.5) { flowing(a, g); return [9, 13]; }
      if (k >= 14) { a.lyre('A3', a.rint(4, 5), g * 0.8, p, 'ion'); return [13, 18]; }         // 叶忒罗来到神的山
      if (a.night() > 0.5) { a.lyre('A4', a.rint(3, 4), g * 0.7, p, 'lyd'); return [15, 21]; }  // 火柱
      a.shepherd(g * 0.85, p); return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (max(lv('rsDew'), lv('rsManna')) > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.45, a.pan()); return [0.9, 2.2]; }   // 如白霜的小圆物
      if (lv('rsJudge') > 0.4) { a.ping(a.pick(['A4', 'E5', 'Cs5']), 0, g * 0.4, a.pan()); return [1.5, 3]; }     // 千夫长、百夫长的灯
      if (max(lv('rsSea'), lv('rsCross')) > 0.5 && lv('rsClose') < 0.2) { a.glass(g * 0.45, 1); return [3, 6]; }    // 水墙里的鱼影
      if (lv('rsDance') > 0.4) { a.ping(a.pick(['A5', 'E6', 'Cs6']), 0, g * 0.35, a.pan()); return [2, 4]; }
      if (lv('rsCloud') > 0.5 && a.night() > 0.5) { flicker(a, g * 0.4, 'lyd'); return [4, 8]; }                   // 火柱的火星
      return [5, 9];
    },
  });

  // ══ 利未记 · 圣洁 ═══════════════════════════════════════
  // 会幕四围的营（带四度的伊奥尼亚，风琴般的偶次泛音，领唱的祭司）；坛上常常烧着的火（温暖的、一闪一闪的 A）；
  // 承接圣职的七天、精金灯台的七盏灯（祭司袍上的金铃）；「有火从耶和华面前出来」：合唱与深处的 A1，低通全开，众民欢呼；
  // 拿答、亚比户：只有空心的五度与九度——光与缺席；「你们要成为圣洁」（利底亚的洁净，活鸟放在田野里）；
  // 赎罪日：香的烟云（弗里几亚，缓慢的一口气），归与阿撒泻勒的羊走进旷野（苇笛）；爱人如己的营火、住棚节的棚、
  // 禧年的角声（混合利底亚的 A13）；「我要在你们中间行走」——荣光走过营中。
  music('leviticus', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      tent: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 'over', 0.06, 0.1], ['Cs4', 'soft', 0.14, 0.3], ['D4', 's', 0.05, -0.35], ['E4', 's', 0.06, 0.4]],
      fire: { v: [['A1', 's', 0.44, 0], ['A2', 's', 0.14, 0], ['E3', 'warm', 0.12, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['E4', 's', 0.07, -0.35], ['A3', 'over', 0.08, 0.1]], pulse: [2.7, 0.1] },
      glory: [['A1', 's', 0.28, 0], ['A2', 's', 0.18, 0], ['E3', 'soft', 0.2, -0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.13, 0], ['A4', 'choir', 0.08, 0], ['E5', 's', 0.03, 0.5], ['Gs5', 's', 0.012, -0.5]],
      ordain: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, 0.15], ['Fs3', 'soft', 0.1, -0.3], ['Cs4', 'flute', 0.12, 0.3], ['A4', 's', 0.05, -0.4], ['B4', 's', 0.03, 0.45]],
      absence: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.32, 0.1], ['E3', 's', 0.1, -0.3], ['B3', 's', 0.05, 0.3]],
      holy: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['Ds4', 's', 0.05, 0.4], ['Gs4', 's', 0.045, -0.4], ['Cs5', 's', 0.02, 0.5]],
      atone: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'warm', 0.07, 0.3], ['G3', 's', 0.08, -0.35], ['Bb3', 's', 0.03, 0.4]], pulse: [0.12, 0.3] },
      feast: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'warm', 0.07, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['Fs4', 's', 0.07, 0.35], ['G4', 's', 0.03, -0.45]], pulse: [0.9, 0.1] },
    } },
    mix(lv, night) {
      const k = said('leviticus');
      const theo = sm(1.3, 2, lv('levFire'));                                                    // 有火从耶和华面前出来（9:24）
      const glory = cl(max(theo, sm(0.45, 0.95, lv('levGlory'))));
      const fire = cl(max(k === 2 ? 1 : 0, k === 1 ? sm(1, 1.2, lv('levFire')) : 0)) * (1 - theo);
      const ember = (0.18 + 0.22 * night) * sm(0.6, 0.95, lv('levFire')) * (1 - theo);           // 坛上的火常常烧着，不可熄灭
      const ordain = cl(max(k === 3 ? lv('levDays') : 0, 0.7 * lv('levLamp') * (k === 11 ? 1 : 0.4)));
      const atone = k === 8 ? max(0.7, cl(lv('levIncense'))) : 0;
      const feast = cl(max(lv('levHearth') * (k === 9 ? 1 : 0.3), lv('levBooths'), k === 12 ? 1 : 0, k === 13 ? 0.6 : 0));
      const holy = cl(lv('levHoly')) * (k === 6 || k === 7 ? 1 : 0.35);
      const g = stack([['glory', glory], ['absence', k === 5 ? 1 : 0], ['atone', atone], ['fire', fire], ['feast', feast], ['holy', holy], ['ordain', ordain], ['fire', ember]], 'tent');
      const lp = 1400 * (1 + 0.9 * g.glory + 0.4 * g.holy + 0.3 * g.feast + 0.2 * g.ordain + 0.15 * g.fire) * (1 - 0.35 * g.atone) * (1 - 0.3 * g.absence);
      return { g, lp, pad: 1 - 0.3 * g.absence, dlp: 1 - 0.2 * g.atone, drone: 1 + 0.3 * theo + 0.15 * g.atone - 0.25 * g.absence };
    },
    scale(lv) {
      const k = said('leviticus');
      if (lv('levFire') > 1.5) return 'maj';
      if (lv('levGlory') > 0.7) return 'lyd';
      if (k === 5) return 'sus';
      if (k === 8) return 'phryg';
      if (k === 12) return 'mixo';
      if (k === 6 || k === 7) return 'lyd';
      if (k === 9 || k === 11 || k === 13) return 'maj';
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('leviticus');
      if (lv('levFire') > 1.5) {                                                                  // 众民一见，就都欢呼，俯伏在地
        a.choir(['A3', 'Cs4', 'E4', 'A4', 'Cs5'], { gs: [1, 0.85, 0.75, 0.55, 0.35], g: g * 1.05, a: 0.4, s: 1.2, r: 3, pan: 0 });
        a.bells(['A5', 'E6'], 0.2, g * 0.7, 3, 0.4);
        return [9, 13];
      }
      if (lv('levGlory') > 0.7) { a.choir(['A3', 'E4', 'Gs4', 'B4'], { gs: [1, 0.8, 0.6, 0.45], g: g * 0.8, a: 1.5, s: 1.2, r: 3, pan: p * 0.5 }); return [12, 16]; }
      if (k === 5) { a.glass(g * 0.25, 1); return [22, 30]; }                                     // 亚伦就默默不言
      if (k === 8) { if (Math.random() < 0.6) a.ney(g, p); else a.bowed(a.pick(['A2', 'C3', 'Bb2']), g * 0.8, p); return [12, 18]; }  // 送到旷野去
      if (k === 12) { shofar(a, g, p); return [8, 12]; }                                          // 禧年的角声
      if (k === 11) { a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.22 }); return [10, 14]; }   // 住棚节
      if (k === 9 || k === 13) { a.shepherd(g * 0.85, p); return [12, 17]; }                     // 寄居的坐到营火旁
      if (k === 6 || k === 7) { a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'lyd'); return [12, 17]; }
      if (k === 3) { a.bells(['A5', 'Cs6', 'E6', 'Cs6'], 0.16, g * 0.4, 1.6); return [10, 14]; }  // 袍上的金铃
      if (lv('levFire') > 1) { a.lyre('A3', a.rint(3, 4), g * 0.75, p, 'ion', { gap: 0.4 }); return [14, 19]; }
      cantor(a, [['A3', 0.6], ['B3', 0.35], ['Cs4', 0.8], ['D4', 0.35], ['Cs4', 0.4], ['B3', 0.35], ['A3', 1.3]], g, p);   // 祭司的吟诵
      return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('leviticus');
      if (k === 3 && lv('levDays') > 0.3) { a.ping(a.pick(['A4', 'Cs5', 'E5', 'A5']), 0, g * 0.4, a.rnd(-0.2, 0.3)); return [1.5, 3]; }   // 会幕门前七盏小灯
      if (k === 7) { a.pluck(a.deg('maj', 'A5', a.rint(2, 6)), 0, g * 0.4, a.pan(), 0.5); a.pluck(a.deg('maj', 'A5', a.rint(0, 4)), 0.14, g * 0.3, a.pan(), 0.5); return [3, 6]; }  // 活鸟
      if (lv('levLamp') > 0.5 && a.night() > 0.4) { a.ping(a.pick(['A5', 'E5']), 0, g * 0.35, a.pan()); return [3, 6]; }
      if (lv('levFire') > 1 && lv('levFire') < 1.5) { flicker(a, g * 0.35, 'ion'); return [4, 8]; }
      if (lv('levGlory') > 0.7) { a.glass(g * 0.45, 1); return [4, 7]; }
      return [5, 9];
    },
  });

  // ══ 民数记 · 旷野 ════════════════════════════════════════
  // 十二面纛下的营（混合利底亚，整齐的轻步）；祭司的祝福（三道合唱）；两枝银号，拔营；
  // 「耶和华的膀臂岂是缩短了吗」、旷野里一堆一堆的坟（没有三音的挂留，极慢的一口气）；探子回来那夜的哭号（爱奥利亚）；
  // 地开了口、火蛇（弗里几亚的三全音，嘶嘶的颤动）；杖发芽开花、一望铜蛇就活了、磐石出水（明亮的 A 大七）；
  // 巴兰（Hijaz 的乌德）与「有星要出于雅各」（利底亚的星空）；摩押平原、约旦河、迦南（流动的 A 加九）；
  // 「我耶和华住在以色列人中间」。
  music('numbers', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      camp: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['A3', 'warm', 0.06, 0.15], ['Cs4', 'soft', 0.13, 0.3], ['E4', 's', 0.07, -0.35], ['G4', 's', 0.03, 0.45]], pulse: [0.55, 0.08] },
      bless: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.16, 0], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.07, 0], ['E5', 's', 0.02, -0.5]],
      wild: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['D3', 'soft', 0.18, -0.3], ['E3', 'soft', 0.1, 0.3], ['B3', 's', 0.05, -0.35]], pulse: [0.09, 0.3] },
      weep: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['C3', 'soft', 0.25, -0.3], ['G3', 'soft', 0.1, 0.3], ['F4', 's', 0.04, -0.4]],
      serpent: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'soft', 0.12, -0.3], ['Ds3', 'soft', 0.08, 0.3], ['G3', 's', 0.05, -0.35]], pulse: [4.1, 0.16] },
      live: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.16, 0.3], ['E4', 's', 0.09, -0.35], ['Gs4', 's', 0.03, -0.45], ['B4', 's', 0.04, 0.4]],
      star: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.14, -0.3], ['Ds4', 's', 0.06, 0.35], ['Gs4', 's', 0.05, -0.4], ['Cs5', 's', 0.03, 0.45], ['A3', 'over', 0.05, 0]],
      river: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['Fs4', 's', 0.06, 0.4]], pulse: [0.26, 0.2] },
    } },
    mix(lv, night) {
      const k = said('numbers'), td = tod();
      const serp = cl(max(lv('nmSnakes'), k === 7 && td >= 0.4 ? 1 - night : 0));                // 地开了口；火蛇
      const weep = max(k === 5 ? night : 0, k === 6 ? 0.35 : 0, k === 8 ? 0.5 : 0);               // 那夜百姓哭号；米利暗死了
      const star = k >= 11 ? cl(max(lv('nmStar') * (k === 11 ? 1 : 0.2), k === 11 ? 0.4 * lv('nmAltars') : 0)) : 0;
      const bless = cl(max(lv('nmBless'), 0.75 * lv('nmFair'), lv('nmDwell')));
      const live = max(k === 7 && td < 0.4 ? 1 : 0, k === 8 ? 1 : 0, k === 9 ? 1 - cl(lv('nmSnakes')) : 0, k === 5 ? 0.5 * (1 - night) : 0);
      const wild = cl(max(lv('nmGraves') * (k === 6 ? 1 : 0.2), 0.45 * lv('nmManna'), k === 4 ? 0.8 : 0, 0.8 * lv('nmQuail'), k === 7 ? night : 0));
      // 约旦河、迦南；吹角的日子：夜里是节期的营（底组），天亮了是雅谢与基列可牧放牲畜之地
      const river = k === 13 ? cl(max(lv('nmPasture'), 0.8 * (1 - night))) : k >= 12 ? cl(max(lv('nmJordan'), lv('nmCanaan'))) : 0;
      const g = stack([['serpent', serp], ['weep', weep], ['star', star], ['bless', bless], ['live', live], ['wild', wild], ['river', river]], 'camp');
      const lp = 1300 * (1 + 0.6 * g.bless + 0.5 * g.star + 0.5 * g.live + 0.3 * g.river + 0.35 * night * g.star) * (1 - 0.3 * g.wild) * (1 - 0.25 * g.weep)
        * (1 - 0.2 * g.serpent) * (1 - 0.3 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.2 * g.wild, drone: 1 + 0.2 * g.wild + 0.2 * g.serpent };
    },
    scale(lv, night) {
      const k = said('numbers');
      if (lv('nmSnakes') > 0.5 || (k === 7 && tod() >= 0.4 && night < 0.5)) return 'phryg';
      if (k === 5 && night > 0.5) return 'aeol';
      if (k === 8) return 'dor';
      if (k === 10) return 'hijaz';
      if (max(lv('nmBless'), lv('nmDwell')) > 0.5) return 'maj';
      if (k === 11) return 'lyd';
      if (k === 13) return 'mixo';
      if (k === 9 || (k === 7 && tod() < 0.4) || k >= 12) return 'maj';
      if (k === 4 || k === 6 || (k === 7 && night > 0.5)) return 'sus';
      return 'mixo';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('numbers');
      if (lv('nmSnakes') > 0.5 || (k === 7 && tod() >= 0.4 && a.night() < 0.5)) {                // 火蛇的嘶嘶
        a.burst({ buf: 'white', ft: 'highpass', f: 5200, q: 0.5, g: g * 0.22, a: 0.3, s: 0.5, r: 0.8, pan: p, rev: 0.4 });
        a.bowed(a.pick(['Bb2', 'A2', 'Ds3']), g * 0.8, -p);
        return [10, 15];
      }
      if (k === 13 && a.night() < 0.5 && Math.random() < 0.45) { a.shepherd(g * 0.85, p); return [10, 14]; }   // 牲畜极其众多
      if (k === 3 || k === 13) { trumpets(a, g, p, Math.random() < 0.35); return [8, 12]; }      // 两枝银号
      if (lv('nmBless') > 0.4 || lv('nmDwell') > 0.5) {                                          // 愿耶和华赐福给你……使你脸上有光……赐你平安
        a.choir(['A3', 'Cs4', 'E4'], { gs: [1, 0.8, 0.7], g: g * 0.75, a: 0.9, s: 0.6, r: 1.6, pan: -0.3 });
        a.choir(['A3', 'E4', 'A4'], { gs: [1, 0.8, 0.6], g: g * 0.75, a: 0.9, s: 0.6, r: 1.6, at: 2.1, pan: 0.3 });
        a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 1, s: 1.2, r: 3, at: 4.2, pan: 0 });
        return [12, 16];
      }
      if (k === 11) { a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'lyd'); return [12, 16]; }
      if (k === 10) { a.oud(g * 0.9, p); return [10, 15]; }                                        // 巴兰
      if (k === 7 && tod() < 0.4) { steps(a, 'A4', 'maj', 5, g * 0.7, p, 0.16, 2.2); return [11, 15]; }   // 发芽、开花、结了熟杏
      if (k === 8 || k === 9) { a.lyre('A4', a.rint(4, 5), g * 0.8, p, k === 8 ? 'dor' : 'maj'); return [11, 16]; }
      if (k === 5 && a.night() > 0.5) { a.ney(g, p); return [12, 18]; }
      if (k === 4 || k === 6 || (k === 7 && a.night() > 0.5)) { a.ney(g * 0.95, p); return [14, 22]; }
      if (k >= 12) { if (Math.random() < 0.5) flowing(a, g); else a.shepherd(g * 0.85, p); return [10, 15]; }
      if (k === 5) { a.shepherd(g * 0.8, p); return [12, 16]; }                                    // 两个人用杠抬着一挂葡萄
      a.lyre('A3', a.rint(4, 5), g * 0.8, p, 'mixo'); return [13, 19];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('numbers');
      if (k === 11 && lv('nmStar') > 0.3) { a.starPing(g); return [0.6, 1.6]; }
      if (lv('nmPath') > 0.3 && k === 14) { a.ping(a.deg('maj', 'A4', a.rint(0, 9)), 0, g * 0.4, a.pan()); return [1, 2.2]; }   // 四十二站的路程亮起
      if (lv('nmManna') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.35, a.pan()); return [2, 4]; }
      if (k === 1) { a.pluck(a.deg('mixo', 'A4', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.6); return [2.5, 4.5]; }   // 纛一面一面升起
      return [5, 9];
    },
  });

  // ══ 申命记 · 毗斯迦 ══════════════════════════════════════
  // 摩押平原上摩西的话（混合利底亚：没有三音的四度与六度——说话的声音）；晨雾（挂二的雾）；
  // 回想何烈山：火焰、昏黑、密云（弗里几亚，雷的翻滚）；「以色列啊，你要听」：同度的合唱，多利亚的吟诵；
  // 美地：果园、泉源、天上的府库（流动的 A6/9）；如同天上的星、看顾那地的眼目、如鹰搅动巢窝（利底亚）；
  // 为十二支派祝福；毗斯迦山顶：夕阳自西而来扫过全地（A 大九，三角波的金色，低通全开）；
  // 谷中的雾：没有人知道他的坟墓（爱奥利亚的苇笛），天亮了，约书亚站在百姓面前。
  music('deut', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1400, groups: {
      plain: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.14, 0.3], ['D4', 's', 0.06, -0.35], ['Fs4', 's', 0.05, 0.4], ['A3', 'over', 0.04, 0]],
      veil: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['E3', 's', 0.12, -0.25], ['B3', 'soft', 0.1, 0.3], ['Fs4', 's', 0.03, -0.4]],
      horeb: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'grit', 0.025, 0], ['Bb2', 'soft', 0.08, -0.3], ['D3', 'soft', 0.18, 0.3], ['E3', 's', 0.08, -0.2]], pulse: [0.6, 0.25] },
      shema: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.2, 0], ['E4', 'choir', 0.13, 0], ['A4', 'choir', 0.06, 0]],
      good: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.05, -0.2], ['Fs4', 'flute', 0.07, -0.35], ['B4', 's', 0.035, 0.45]], pulse: [0.3, 0.14] },
      stars: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.14, -0.3], ['Gs4', 's', 0.06, 0.35], ['B4', 's', 0.03, 0.5], ['Ds5', 's', 0.03, -0.45], ['A3', 'over', 0.05, 0]],
      bless: [['A1', 's', 0.12, 0], ['A2', 's', 0.36, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.17, 0], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.07, 0]],
      vista: [['A1', 's', 0.24, 0], ['A2', 's', 0.24, 0], ['E3', 'soft', 0.22, -0.15], ['Cs4', 'soft', 0.15, 0.25], ['E4', 't', 0.1, -0.3], ['Gs4', 't', 0.06, 0.35], ['B4', 't', 0.05, -0.4], ['Cs5', 't', 0.035, 0.45], ['Fs5', 's', 0.012, -0.5]],
    } },
    mix(lv) {
      const k = said('deut');
      const vista = cl(max(lv('dtVista'), lv('dtGlory')));
      const horeb = cl(max(lv('dtHoreb'), 0.6 * lv('dtTablets')));
      const veil = cl(max(k <= 1 ? lv('dtVeil') : 0, lv('dtMist')));
      const bless = cl(max(lv('dtTribes'), lv('dtPillar'), k === 10 ? 0.5 : 0));
      const stars = cl(max(lv('dtStars'), lv('dtWatch'), k === 11 ? 0.8 : 0, 0.5 * lv('dtManna')));
      const good = max(k === 4 ? max(0.5, cl(lv('dtGood'))) : 0, k === 6 || k === 8 ? 0.8 : 0, k === 9 ? 1 : 0);
      const g = stack([['vista', vista], ['horeb', horeb], ['veil', veil], ['shema', k === 3 ? 1 : 0], ['bless', bless], ['stars', stars], ['good', good]], 'plain');
      const lp = 1400 * (1 + 1.1 * g.vista + 0.5 * g.bless + 0.4 * g.stars + 0.3 * g.good + 0.2 * g.shema) * (1 - 0.4 * g.horeb) * (1 - 0.4 * g.veil) * (1 - 0.2 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.2 * g.veil - 0.15 * g.horeb, drone: 1 + 0.3 * g.horeb - 0.2 * g.vista };
    },
    scale(lv) {
      const k = said('deut');
      if (max(lv('dtVista'), lv('dtGlory')) > 0.5) return 'maj';
      if (lv('dtHoreb') > 0.5) return 'phryg';
      if (lv('dtMist') > 0.5) return 'aeol';
      if (k <= 1 && lv('dtVeil') > 0.5) return 'sus';
      if (k === 3) return 'dor';
      if (max(lv('dtTribes'), lv('dtPillar')) > 0.5) return 'ion';
      if (max(lv('dtStars'), lv('dtWatch')) > 0.5 || k === 11) return 'lyd';
      if (k === 4 || k === 6 || k === 8 || k === 9) return 'maj';
      return 'mixo';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('deut');
      if (max(lv('dtVista'), lv('dtGlory')) > 0.5) {                                              // 耶和华把全地指给他看
        sweep(a, ['A2', 'E3', 'A3', 'Cs4', 'E4', 'Gs4', 'B4', 'Cs5', 'E5'], g, p, { gap: 0.11, d: 3.4, k: 0.75 });
        a.bells(['Cs6', 'E6'], 0.3, g * 0.5, 3, 1.4);
        return [9, 13];
      }
      if (lv('dtHoreb') > 0.5) {                                                                  // 只听见声音，却没有看见形像
        cantor(a, [['A2', 0.7], ['Bb2', 0.5], ['A2', 0.5], ['E2', 1.4]], g * 1.3, p, { lp: 700, r: 1.4 });
        return [9, 13];
      }
      if (lv('dtMist') > 0.5) { a.ney(g * 1.05, p); return [12, 18]; }                           // 摩押地的谷中
      if (k === 3) {                                                                              // Shema
        cantor(a, [['A3', 0.55], ['A3', 0.35], ['C4', 0.55], ['D4', 0.75], ['C4', 0.35], ['B3', 0.35], ['A3', 1.4]], g, p);
        return [11, 15];
      }
      if (max(lv('dtTribes'), lv('dtPillar')) > 0.5) { psalm(a, g); return [11, 15]; }
      if (k === 11) {                                                                             // 如鹰搅动巢窝，在雏鹰以上两翅扇展
        a.pipe([['E5', 0.35], ['A5', 0.9], ['Gs5', 0.25], ['E5', 0.35], ['Ds5', 0.3], ['E5', 1.3]], { g: g * 0.45, pan: p, bright: 5, breath: 0.3, bend: true, vib: 12, rev: 0.75 });
        return [9, 13];
      }
      if (max(lv('dtStars'), lv('dtWatch')) > 0.5) { a.lyre('A4', a.rint(3, 5), g * 0.7, p, 'lyd'); return [13, 18]; }
      if (k === 9) { flowing(a, g); return [9, 13]; }                                             // 天上的府库，按时降雨
      if (k === 4 || k === 6 || k === 8) { a.shepherd(g * 0.85, p); return [12, 17]; }             // 美地；失迷的羊
      if (k <= 1 && lv('dtVeil') > 0.5) { a.ney(g * 0.8, p); return [14, 20]; }
      if (k === 7) { a.lyre('A3', a.rint(4, 6), g * 0.8, p, 'dor', { gap: 0.34 }); return [12, 17]; }   // 预备道路
      cantor(a, [['E3', 0.45], ['A3', 0.7], ['B3', 0.35], ['A3', 0.35], ['Fs3', 0.4], ['E3', 1.2]], g * 0.9, p, { lp: 1300 });   // 摩西的话
      return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('deut');
      if (max(lv('dtStars'), lv('dtWatch')) > 0.3) { a.starPing(g); return [0.7, 1.8]; }
      if (k === 3 && lv('dtDoors') > 0.2) { a.ping(a.pick(['A4', 'E5', 'A5']), 0, g * 0.4, a.rnd(0.1, 0.8)); return [1.5, 3]; }   // 写在门框上的话
      if (lv('dtManna') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.4, a.pan()); return [1, 2.4]; }
      if (lv('dtTribes') > 0.3) { a.ping(a.deg('ion', 'A4', a.rint(0, 11)), 0, g * 0.4, a.pan()); return [1.2, 2.4]; }   // 十二支派之光
      if (lv('dtVista') > 0.5) { a.glass(g * 0.45, 1); return [3, 6]; }
      return [5, 9];
    },
  });

  // ══ 路得记 · 路得 ════════════════════════════════════════
  // 摩押的小屋与三座坟（爱奥利亚，暖而低的弓弦）；耶和华眷顾自己的百姓：天光与雨（A 大，牧笛）；
  // 「你往哪里去，我也往那里去」（多利亚的小六度，两支笛彼此跟随）；「不要叫我拿俄米，要叫我玛拉」（b6）；
  // 波阿斯的田：金色的大麦在风里一浪一浪（缓缓摇摆的 A6/9，里拉与牧笛）；翅膀下（利底亚的合唱，很轻）；
  // 禾场的夜（没有三音的挂留，悄声）；城门口的长老、婚筵的灯、俄备得——法勒斯到大卫十代的名字
  // 一级一级升起，末一颗「大卫」最亮（金色的 A 大，三角波的高处）。
  music('ruth', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1300, groups: {
      moab: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'warm', 0.06, -0.2], ['C3', 'soft', 0.24, 0.3], ['E3', 's', 0.08, 0.25], ['B3', 's', 0.06, -0.35]],
      visit: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.09, -0.35], ['A4', 's', 0.05, 0.4], ['Cs5', 's', 0.025, -0.5]],
      cleave: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['C4', 'flute', 0.13, -0.3], ['D4', 's', 0.05, -0.2], ['Fs4', 's', 0.07, 0.35], ['B4', 's', 0.03, 0.45]],
      mara: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['C3', 'soft', 0.24, -0.3], ['F3', 'soft', 0.1, 0.3], ['E3', 's', 0.06, -0.2]],
      barley: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 'warm', 0.05, 0.2], ['Cs4', 'soft', 0.14, 0.3], ['Fs4', 's', 0.07, -0.35], ['B4', 's', 0.035, 0.45]], pulse: [0.42, 0.18] },
      wings: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.2, -0.15], ['A3', 's', 0.06, 0.1], ['Cs4', 'choir', 0.12, 0], ['E4', 'choir', 0.1, 0], ['Gs4', 'choir', 0.07, 0], ['B4', 's', 0.035, 0.4], ['Ds5', 's', 0.015, -0.45]],
      night: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.28, 0.2], ['B3', 'soft', 0.13, -0.3], ['D4', 's', 0.06, 0.35], ['A4', 'flute', 0.04, -0.4]],
      line: [['A1', 's', 0.2, 0], ['A2', 's', 0.26, 0], ['E3', 'soft', 0.24, -0.15], ['A3', 's', 0.12, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 't', 0.06, -0.4], ['Cs5', 't', 0.035, 0.45], ['E5', 't', 0.02, -0.5]],
    } },
    mix(lv) {
      const k = said('ruth');
      const wings = cl(max(lv('ruWing'), lv('ruKanaf')));
      const line = cl(max(lv('ruLine'), 0.9 * lv('ruLamp'), k === 9 || k === 10 ? 0.7 : 0));
      const g = stack([['wings', wings], ['line', line], ['mara', k === 3 ? 0.8 : 0], ['cleave', k === 2 ? 1 : k === 8 ? 0.6 : 0], ['night', k === 7 ? 1 : 0],
        ['visit', k === 1 ? max(cl(lv('ruVisit')), 0.6) : 0], ['moab', k === 0 ? 1 : 0]], 'barley');
      const lp = 1300 * (1 + 0.4 * g.visit + 0.35 * g.barley + 0.6 * g.wings + 0.8 * g.line + 0.1 * g.cleave) * (1 - 0.3 * g.moab) * (1 - 0.3 * g.mara) * (1 - 0.15 * g.night)
        * (1 - 0.2 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.15 * g.moab, drone: 1 + 0.2 * g.moab - 0.15 * g.line };
    },
    scale(lv) {
      const k = said('ruth');
      if (max(lv('ruWing'), lv('ruKanaf')) > 0.5) return 'lyd';
      if (max(lv('ruLine'), lv('ruLamp')) > 0.5 || k === 9) return 'ion';
      if (k === 0 || k === 3) return 'aeol';
      if (k === 2 || k === 8) return 'dor';
      if (k === 7) return 'sus';
      return 'maj';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('ruth');
      if (lv('ruLine') > 0.5) {                                                                   // 法勒斯 … 耶西、大卫：十代的名字一级一级升起
        steps(a, 'A4', 'ion', 10, g * 0.75, p * 0.5, 0.42, 2.6);
        a.bells(['A5', 'Cs6', 'E6'], 0.2, g * 0.7, 3.2, 4.3);
        return [14, 18];
      }
      if (max(lv('ruWing'), lv('ruKanaf')) > 0.5) {                                               // 投靠在他的翅膀下
        a.choir(['Cs4', 'E4', 'Gs4', 'B4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.6, a: 1.8, s: 1, r: 3, pan: p * 0.4 });
        a.glass(g * 0.4, 1);
        return [12, 16];
      }
      if (lv('ruLamp') > 0.5 || k === 9) { a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'ion', { gap: 0.26 }); if (k === 10) a.bells(['A5', 'E6'], 0.18, g * 0.5, 2.4, 2); return [11, 15]; }
      if (k === 0) { a.ney(g, p); return [14, 20]; }
      if (k === 2 || k === 8) {                                                                   // 你往哪里去，我也往那里去：两支笛彼此跟随
        const ln = [['E5', 0.55], ['D5', 0.4], ['C5', 0.55], ['B4', 0.4], ['A4', 1.4]];
        a.pipe(ln, { g: g * 0.42, pan: -0.35, bright: 4, breath: 0.25, vib: 9, rev: 0.6 });
        a.pipe(ln.map(([n, d]) => [a.semi(n, -3), d]), { g: g * 0.34, pan: 0.35, bright: 4, breath: 0.25, vib: 9, rev: 0.6, at: 0.55 });
        return [13, 18];
      }
      if (k === 3) { if (Math.random() < 0.5) a.ney(g, p); else a.bowed(a.pick(['A2', 'C3', 'F3']), g * 0.85, p); return [14, 20]; }
      if (k === 7) { a.lyre('A3', a.rint(3, 4), g * 0.7, p, 'sus', { gap: 0.5 }); return [16, 22]; }
      if (k === 1) { a.shepherd(g * 0.85, p); return [12, 17]; }
      if (Math.random() < 0.55) a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.3 }); else a.shepherd(g * 0.9, p);   // 波阿斯的田
      return [11, 16];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('ruth');
      if (lv('ruLine') > 0.3) { a.starPing(g * 0.8); return [1.2, 2.6]; }
      if (k === 7 || lv('ruLamp') > 0.5) { a.ping(a.pick(['A4', 'E5']), 0, g * 0.35, a.pan()); return [3.5, 6]; }   // 麦堆旁的灯；婚筵的灯
      if (k === 4) { a.pluck(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.3, a.pan(), 0.4); return [3, 6]; }   // 镰刀
      return [5, 9];
    },
  });

  // ══ 撒母耳记上 · 撒母耳 ══════════════════════════════════
  // 以法莲山地、示罗的殿（带四度的挂留，风琴光）；哈拿痛哭祈祷，只动嘴唇（多利亚，苇笛）；哈拿的歌（合唱）；
  // 以利的儿子藐视祭物（弗里几亚）；夜里，神的灯还没有熄灭（很轻的 A 大七，高处一缕笛音）；
  // 「撒母耳！撒母耳！」——一根从天到地的光（利底亚的合唱）；两营、约柜被掳（弗里几亚的战鼓）；
  // 以迦博：荣耀离开了（空心的、减五度的暗）；大衮庙（Hijaz 的乌德）；伯示麦的麦田（金色，母牛一面走一面叫）；
  // 以便以谢；立王：膏油的角；密抹的隘口；「听命胜于献祭」——衣襟撕断，远山上一点光（伯利恒）。
  music('samuel', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      shiloh: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['A3', 'over', 0.05, 0.1], ['B3', 'soft', 0.13, 0.3], ['D4', 's', 0.06, -0.35], ['E4', 's', 0.05, 0.4]],
      hannah: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['C4', 'soft', 0.14, -0.3], ['D4', 's', 0.05, 0.35], ['E4', 'flute', 0.06, 0.3], ['G4', 's', 0.04, -0.4]],
      song: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.13, 0], ['Fs4', 'choir', 0.06, 0]],
      lamp: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['B3', 's', 0.1, 0.3], ['E4', 's', 0.05, -0.35], ['Gs4', 'flute', 0.05, 0.4], ['Cs5', 's', 0.02, -0.45]],
      presence: [['A1', 's', 0.3, 0], ['A2', 'over', 0.07, 0], ['E3', 's', 0.16, 0.1], ['A3', 'choir', 0.17, 0], ['E4', 'choir', 0.14, 0], ['Gs4', 'choir', 0.08, 0], ['B4', 'choir', 0.06, 0], ['Ds5', 's', 0.02, -0.5]],
      war: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.33, 0.1], ['Bb2', 'soft', 0.1, -0.3], ['C3', 'soft', 0.24, 0.3], ['F3', 's', 0.06, -0.35]], pulse: [1.25, 0.24] },
      ichabod: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.2, -0.3], ['Ds3', 's', 0.05, 0.3]],
      field: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 'warm', 0.05, 0.15], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.07, -0.35], ['Fs4', 's', 0.05, 0.4]], pulse: [0.4, 0.14] },
    } },
    mix(lv) {
      const k = said('samuel');
      const presence = cl(max(lv('smPresence'), k >= 14 ? 0.4 * lv('smStar') : 0));
      const ich = cl(max(k === 6 ? sm(0.5, 0.05, lv('smGlory')) : 0, k === 3 ? 0.75 * lv('smSour') : 0, k === 9 ? 0.45 : 0,
        k === 14 ? 0.85 * max(lv('smSour'), 1 - lv('smRoyal')) : 0));
      const war = cl(max(k === 6 ? max(lv('smCampI'), lv('smCampP')) : 0, k === 7 ? lv('smDagon') * (1 - lv('smWheat')) : 0,
        k === 8 ? max(0.6 * lv('smAlt2Fire'), sm(0.3, 0.7, lv('storm'))) : 0, k === 13 ? lv('smCrags') * (1 - 0.6 * lv('smRout')) : 0));
      const song = max(k === 2 ? 1 : 0, k === 8 ? 0.7 * cl(lv('smEbenLit')) : 0, k === 13 ? 0.5 * cl(lv('smRout')) : 0);
      const lamp = max(k === 4 ? 1 : 0, k === 5 ? 0.6 * (1 - cl(lv('smPresence'))) : 0);
      const field = cl(max(k === 7 || k === 12 ? lv('smWheat') : 0, k === 10 ? 0.75 * lv('smRoyal') : 0, k === 11 ? 0.5 : 0));
      const g = stack([['presence', presence], ['ichabod', ich], ['war', war], ['song', song], ['lamp', lamp], ['hannah', k <= 1 ? 0.8 : 0], ['field', field]], 'shiloh');
      const lp = 1300 * (1 + 0.8 * g.presence + 0.5 * g.song + 0.35 * g.field + 0.2 * g.lamp) * (1 - 0.35 * g.war) * (1 - 0.35 * g.ichabod) * (1 - 0.15 * g.hannah)
        * (1 - 0.3 * cl(lv('storm')));
      return { g, lp, pad: 1 - 0.2 * g.lamp, dlp: 1 - 0.2 * g.war - 0.15 * g.ichabod, drone: 1 + 0.25 * g.war + 0.2 * g.presence };
    },
    scale(lv) {
      const k = said('samuel');
      if (lv('smPresence') > 0.5) return 'lyd';
      if (k === 6 && lv('smGlory') < 0.3) return 'aeol';
      if (k === 14 && max(lv('smSour'), 1 - lv('smRoyal')) > 0.5) return 'aeol';
      if (k === 3 && lv('smSour') > 0.5) return 'phryg';
      if (k === 7 && lv('smDagon') > 0.5 && lv('smWheat') < 0.5) return 'hijaz';
      if (k === 6 || (k === 8 && lv('storm') > 0.4)) return 'phryg';
      if (k === 13) return 'mixo';
      if (k === 10) return 'mixo';
      if (k === 2 || k === 8 || k === 4) return 'maj';
      if (k <= 1) return 'dor';
      if (k === 9) return 'dor';
      if (k === 7 || k === 11 || k === 12) return 'maj';
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('samuel');
      if (lv('smPresence') > 0.5) { a.choir(['A3', 'E4', 'Gs4', 'B4'], { gs: [1, 0.8, 0.65, 0.5], g: g * 0.85, a: 1.4, s: 1.2, r: 3, pan: 0 }); return [12, 16]; }
      if (k === 4) {                                                                              // 「撒母耳！」——孩子三次跑到以利那里
        a.pipe([['E5', 0.32], ['Cs5', 0.32], ['A4', 1]], { g: g * 0.4, pan: p, bright: 3, breath: 0.35, vib: 8, rev: 0.8 });
        return [11, 15];
      }
      if (k === 2) { psalm(a, g); a.lyre('A4', a.rint(4, 5), g * 0.6, p, 'maj', { gap: 0.2 }); return [10, 14]; }   // 我的心因耶和华快乐
      if (k === 7 && lv('smDagon') > 0.5 && lv('smWheat') < 0.5) { a.oud(g * 0.9, p); return [11, 15]; }             // 大衮庙
      if (k === 6 && lv('smGlory') < 0.3) { a.bowed(a.pick(['A2', 'C3', 'Ds3']), g * 0.85, p); return [13, 18]; }    // 以迦博
      if (k === 6 || k === 13) { drum(a, g, p); return [9, 13]; }
      if (k === 8 && lv('storm') > 0.4) return [8, 12];                                           // 耶和华大发雷声
      if (k === 12 && lv('storm') > 0.4) return [8, 12];
      if (k === 10) { shofar(a, g, p); a.lyre('A4', 4, g * 0.6, -p, 'mixo', { gap: 0.28 }); return [11, 15]; }       // 膏油的角
      if (k === 14 && max(lv('smSour'), 1 - lv('smRoyal')) > 0.5) { a.ney(g, p); return [13, 18]; }                  // 撒母耳为扫罗悲伤
      if (k === 3) { a.bowed(a.pick(['A2', 'Bb2', 'C3']), g * 0.8, p); return [13, 18]; }
      if (k <= 1) { a.ney(g * 0.95, p); return [13, 18]; }                                        // 哈拿心里默祷
      if (k === 9) { a.lyre('A3', a.rint(3, 4), g * 0.75, p, 'dor', { gap: 0.45 }); return [14, 19]; }
      if (k === 7 || k === 11 || k === 12) { a.shepherd(g * 0.85, p); return [12, 17]; }          // 伯示麦的麦田
      a.lyre(a.pick(['A3', 'A4']), a.rint(4, 5), g * 0.8, p, 'ion'); return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('samuel');
      if (k === 5 && lv('smKnown') > 0.3) { a.ping(a.deg('maj', 'A4', a.rint(0, 8)), 0, g * 0.4, a.pan()); return [1.2, 2.4]; }   // 从但到别是巴
      if (k === 4) { a.glass(g * 0.3, 1); return [6, 10]; }                                        // 神的灯
      if (lv('smStar') > 0.3) { a.starPing(g * 0.7); return [2, 4]; }                              // 远山上的一点光
      return [5, 9];
    },
  });

  // ══ 撒母耳记上 · 大卫 ════════════════════════════════════
  // 这一卷是琴：竖琴的一扫、里拉的歌。伯利恒的山地（多利亚的 A6/9，竖琴般的持续音）；受膏，灵大大感动他（A 大七的合唱）；
  // 恶魔扰乱扫罗（三全音的病态起伏）——大卫弹琴，它就离开；以拉谷的两军（挂留的战鼓）；五块光滑的石子；
  // 约拿单的盟约（多利亚的小六度）与「千千」「万万」的手鼓；山寨与洞（空心的五度，回声）；亚比该；
  // 沉沉的睡（挂留的摇篮曲）；洗革拉的火与追赶（混合利底亚的奔马）；基利波：神不回答（几乎只剩根音），
  // 扫罗和他三个儿子一同死亡，雅比人把骸骨葬在垂丝柳树下（爱奥利亚的苇笛）。
  music('david', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      hills: [['A2', 's', 0.42, 0], ['E3', 'harp', 0.2, -0.2], ['A3', 'soft', 0.12, 0.15], ['B3', 's', 0.05, -0.3], ['Cs4', 'soft', 0.12, 0.3], ['Fs4', 's', 0.06, -0.4], ['E4', 's', 0.05, 0.4]],
      anoint: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.12, 0], ['Gs4', 'choir', 0.06, 0], ['B4', 's', 0.03, -0.45]],
      evil: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'soft', 0.1, -0.3], ['C3', 'soft', 0.22, 0.3], ['Ds3', 's', 0.06, -0.2], ['G3', 's', 0.04, 0.35]], pulse: [0.33, 0.3] },
      valley: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.34, 0.1], ['A2', 'warm', 0.07, -0.15], ['D3', 'soft', 0.18, 0.3], ['E3', 'soft', 0.1, -0.25], ['G3', 's', 0.06, 0.35]], pulse: [1.5, 0.22] },
      friend: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['C4', 'flute', 0.12, -0.3], ['E4', 's', 0.07, 0.35], ['Fs4', 's', 0.05, -0.4], ['B4', 's', 0.025, 0.45]],
      cave: [['A1', 's', 0.4, 0], ['E2', 's', 0.2, 0.1], ['A2', 'soft', 0.14, 0], ['E3', 'soft', 0.14, -0.25], ['B3', 's', 0.07, 0.3], ['D4', 's', 0.04, -0.35]],
      fire: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.07, -0.2], ['Cs3', 'soft', 0.18, 0.3], ['E3', 'soft', 0.1, -0.2], ['G3', 's', 0.06, 0.35]], pulse: [2.1, 0.2] },
      gilboa: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.2, -0.3], ['E3', 's', 0.05, -0.25], ['F3', 's', 0.06, 0.3]],
    } },
    mix(lv, night) {
      const k = said('david');
      const evil = cl(lv('dvDark'));
      const valley = max(k === 4 || k === 5 ? 1 : 0, k === 13 ? 0.45 * cl(lv('dvShunem')) : 0);
      const gilboa = k === 13 ? max(cl(lv('dvSilence')), 0.75) : 0;
      const anoint = cl(max(k === 2 ? 0.9 : 0, k === 3 ? 0.3 * (1 - evil) : 0, 0.5 * lv('dvVeil'), 0.4 * lv('dvSleep')));
      const cave = max(k === 8 || k === 11 ? 1 : 0, k === 9 ? 0.7 : 0);
      const friend = max(k === 6 ? 0.6 : 0, k === 7 || k === 9 || k === 10 ? 1 : 0);
      const g = stack([['evil', evil], ['valley', valley], ['gilboa', gilboa], ['fire', k === 12 ? 1 : 0], ['anoint', anoint], ['cave', cave], ['friend', friend]], 'hills');
      const lp = 1300 * (1 + 0.6 * g.anoint + 0.3 * g.friend + 0.2 * g.hills * (1 - night)) * (1 - 0.35 * g.evil) * (1 - 0.25 * g.valley) * (1 - 0.3 * g.gilboa)
        * (1 - 0.2 * g.cave) * (1 - 0.15 * g.fire);
      return { g, lp, pad: 1 - 0.3 * cl(lv('dvSilence')), dlp: 1 - 0.2 * g.evil - 0.2 * g.gilboa, drone: 1 + 0.25 * g.valley + 0.2 * g.evil + 0.15 * g.gilboa };
    },
    scale(lv) {
      const k = said('david');
      if (lv('dvDark') > 0.5) return 'phryg';
      if (k === 13) return lv('dvSilence') > 0.5 ? 'sus' : 'aeol';
      if (k === 4 || k === 5) return 'dor';
      if (k === 12) return 'mixo';
      if (k === 2 || lv('dvVeil') > 0.5) return 'lyd';
      if (lv('dvSleep') > 0.3 || k === 11) return 'sus';
      if (k === 7) return 'aeol';
      if (k === 8 || k === 9) return 'dor';
      return 'maj';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('david');
      if (lv('dvDark') > 0.5) { a.bowed(a.pick(['A2', 'Bb2', 'Ds3']), g * 0.8, p); return [11, 16]; }
      if (k === 3 || k <= 1) {                                                                    // 大卫就拿琴用手而弹
        sweep(a, ['A2', 'E3', 'A3', 'Cs4', 'E4'], g, p, { gap: 0.06 });
        a.lyre('A4', a.rint(4, 6), g * 0.75, p, 'maj', { gap: 0.26 });
        return k === 3 ? [9, 13] : [13, 18];
      }
      if (k === 2) {                                                                              // 在他诸兄中膏了他
        a.choir(['A3', 'Cs4', 'E4', 'Gs4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.75, a: 1.5, s: 1, r: 3, pan: 0 });
        sweep(a, ['A3', 'Cs4', 'E4', 'Gs4', 'B4', 'Ds5'], g * 0.8, p, { gap: 0.09, d: 3 });
        return [11, 15];
      }
      if (k === 5) {                                                                              // 五块光滑的石子
        a.strings(['E4', 'D4', 'B3', 'A3', 'G3'].map((n, i) => [n, i * 0.24, g * 0.6, 1.2]), { wave: 'sine', bright: 3, d: 1.2, pan: p, spread: 0.2, rev: 0.5 });
        if (Math.random() < 0.5) drum(a, g * 0.8, -p);
        return [9, 13];
      }
      if (k === 4) { drum(a, g, p); return [9, 13]; }                                              // 以拉谷的两军
      if (k === 6) {
        if (tod() > 0.33 && tod() < 0.62) { timbrel(a, g, p); a.lyre('A4', 5, g * 0.6, -p, 'maj', { gap: 0.2 }); return [8, 12]; }   // 妇女们击鼓唱和
        a.lyre('A3', a.rint(4, 5), g * 0.75, p, 'dor'); return [12, 16];
      }
      if (k === 7) { a.ney(g, p); return [12, 17]; }                                               // 二人彼此亲嘴，彼此哭泣
      if (k === 10) { a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.3 }); return [11, 15]; }   // 亚比该
      if (k === 11) { a.lyre('A3', 3, g * 0.6, p, 'sus', { gap: 0.55 }); a.glass(g * 0.3, 1); return [15, 20]; }   // 沉沉地睡了
      if (k === 8 || k === 9) { a.ney(g * 0.9, p); return [14, 19]; }                              // 山寨与洞
      if (k === 12) { gallop(a, g, p, a.rint(3, 5)); if (Math.random() < 0.5) hornCall(a, g * 0.8, -p); return [9, 13]; }
      if (k === 13) {
        if (lv('dvSilence') > 0.5) return [12, 18];                                               // 耶和华却不回答他
        a.pipe([['E5', 0.6], ['C5', 0.5], ['B4', 0.4], ['A4', 0.5], ['G4', 0.4], ['F4', 0.5], ['E4', 1.6]], { g: g * 0.45, pan: p, bright: 3, breath: 0.4, bend: true, vib: 13, rev: 0.75 });
        return [13, 18];                                                                          // 大英雄何竟死亡
      }
      a.lyre('A3', a.rint(4, 5), g * 0.8, p, 'dor'); return [14, 20];
    },
    motif2(t, g, a) {
      const k = said('david');
      if (k === 11) { a.starPing(g * 0.8); return [1, 2.4]; }
      if (k === 3 && a.lv('dvDark') < 0.3) { a.lyre('A5', 2, g * 0.35, a.pan(), 'maj', { gap: 0.18 }); return [4, 7]; }
      return [5, 9];
    },
  });

  // ══ 列王纪上 · 所罗门 ════════════════════════════════════
  // 老迈的大卫（多利亚，竖琴的影子）；基训：吹角、吹笛，众民欢呼（混合利底亚的节庆脉动）；
  // 基遍的梦（利底亚的合唱，夜里）；智慧（完整的伊奥尼亚：清明、有序的 A 大七），如同海沙一粒一粒亮起；
  // 殿在寂静中建成（风琴般的金色，没有锤声）；云充满耶和华的殿（深处的 A1 与合唱，低通全开）；天和天上的天（星）；
  // 示巴女王的驼队（Hijaz 的乌德与驼铃）；心偏离了，国被撕成十二片（弗里几亚的暗）；
  // 「在我面前长有灯光」——为大卫的缘故，一盏灯（大卫的琴再响一次，A 大）。
  music('solomon', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      acclaim: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 'warm', 0.08, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.09, 0.35], ['G4', 's', 0.04, -0.45]], pulse: [1.8, 0.14] },
      david: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, 0.15], ['A3', 'harp', 0.07, -0.1], ['Cs4', 'flute', 0.1, -0.3], ['E4', 's', 0.05, 0.3], ['A4', 's', 0.03, 0.4]],
      dream: [['A1', 's', 0.36, 0], ['A2', 'over', 0.06, 0], ['E3', 's', 0.16, 0.1], ['B3', 'choir', 0.12, 0], ['E4', 'choir', 0.12, 0], ['Gs4', 'choir', 0.08, 0], ['Ds5', 's', 0.025, -0.5]],
      wisdom: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 's', 0.12, -0.3], ['Cs4', 'soft', 0.13, 0.3], ['D4', 's', 0.05, -0.35], ['Gs4', 's', 0.04, 0.4]],
      temple: [['A1', 's', 0.26, 0], ['A2', 's', 0.24, 0], ['E3', 'soft', 0.24, -0.15], ['A3', 'over', 0.1, 0], ['Cs4', 'soft', 0.13, 0.25], ['E4', 's', 0.08, -0.3], ['A4', 's', 0.04, 0.4]],
      glory: [['A1', 's', 0.28, 0], ['E2', 's', 0.14, 0.1], ['A2', 'over', 0.08, 0], ['E3', 'soft', 0.16, -0.15], ['A3', 'choir', 0.17, 0], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.08, 0], ['E5', 's', 0.03, 0.5]],
      sheba: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'soft', 0.08, -0.3], ['Cs3', 'soft', 0.2, 0.3], ['E3', 's', 0.08, -0.2], ['F3', 's', 0.05, 0.35]], pulse: [0.55, 0.12] },
      decline: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.24, -0.3], ['Ds3', 's', 0.05, 0.3], ['G3', 's', 0.05, -0.35]],
    } },
    mix(lv) {
      const k = said('solomon');
      const glory = cl(max(lv('soCloud'), k === 9 ? lv('soGlory') : 0, lv('soHeaven')));
      const dream = cl(max(lv('soDream'), lv('soPresence')));
      const decline = cl(max(k >= 13 ? max(lv('soHigh'), lv('soDim')) * (k === 13 ? 1 : 0.3) : 0, k === 11 ? 0.6 * lv('soDim') : 0));
      const david = cl(max(k === 0 ? 0.8 : 0, k === 2 ? 1 : 0, 0.85 * lv('soLamp')));
      const temple = cl(max(k === 7 ? 0.5 : 0, k === 8 ? max(0.6, lv('soGold')) : 0, k === 3 ? 0.35 * lv('soGibeon') * (1 - lv('soDream')) : 0));
      const g = stack([['glory', glory], ['dream', dream], ['decline', decline], ['david', david], ['acclaim', k === 1 ? 1 : 0], ['sheba', k === 12 ? 1 : 0], ['temple', temple]], 'wisdom');
      const lp = 1400 * (1 + 1 * g.glory + 0.6 * g.dream + 0.5 * g.temple + 0.3 * g.wisdom + 0.3 * g.acclaim + 0.4 * cl(lv('soSand')) * g.wisdom)
        * (1 - 0.35 * g.decline) * (1 - 0.1 * g.sheba) * (1 - 0.25 * cl(lv('storm')));
      return { g, lp, dlp: 1 + 0.2 * g.glory - 0.2 * g.decline, drone: 1 + 0.3 * g.glory - 0.1 * g.acclaim + 0.15 * g.decline };
    },
    scale(lv) {
      const k = said('solomon');
      if (max(lv('soCloud'), lv('soHeaven')) > 0.5 || (k === 9 && lv('soGlory') > 0.5)) return k === 10 ? 'lyd' : 'maj';
      if (max(lv('soDream'), lv('soPresence')) > 0.5) return 'lyd';
      if (k === 13) return 'phryg';
      if (k === 12) return 'hijaz';
      if (k === 1) return 'mixo';
      if (k === 14 || lv('soLamp') > 0.5) return 'maj';
      if (k === 0 || k === 2) return 'dor';
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('solomon');
      if (k === 10 && lv('soHeaven') > 0.4) { a.angelRun(g * 0.9); a.choir(['E4', 'A4', 'B4', 'E5'], { gs: [1, 0.8, 0.6, 0.4], g: g * 0.6, a: 1.4, s: 1, r: 3, at: 0.8 }); return [10, 14]; }
      if (lv('soCloud') > 0.5 || (k === 9 && lv('soGlory') > 0.5)) {                               // 祭司不能站立供职
        a.choir(['A2', 'E3', 'A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.9, 0.8, 0.7, 0.55, 0.4], g: g * 0.9, a: 2, s: 1.8, r: 4, pan: 0 });
        a.bells(['A5', 'E6', 'A6'], 0.35, g * 0.55, 3.6, 1.8);
        return [12, 16];
      }
      if (max(lv('soDream'), lv('soPresence')) > 0.5) { a.choir(['B3', 'E4', 'Gs4'], { gs: [1, 0.8, 0.6], g: g * 0.65, a: 1.8, s: 1, r: 3, pan: p * 0.4 }); a.glass(g * 0.35, 1); return [13, 17]; }
      if (k === 13) {                                                                             // 亚希雅把新衣撕成十二片
        a.strings(Array.from({ length: 12 }, (_, i) => [a.deg('phryg', 'A4', 7 - i), i * 0.13, g * (0.55 - i * 0.025), 0.35]), { wave: 'oud', bright: 3, d: 0.35, pan: p, spread: 0.5, rev: 0.45 });
        a.bowed('A2', g * 0.7, -p);
        return [14, 20];
      }
      if (k === 12) { a.oud(g * 0.9, p); if (Math.random() < 0.5) a.bells(['E6', 'A6'], 0.3, g * 0.3, 1.6, 1.2); return [10, 14]; }   // 示巴的驼队
      if (k === 1) {                                                                              // 吹角，众民吹笛，大大欢呼
        shofar(a, g, p);
        a.pipe([['A4', 0.2], ['Cs5', 0.2], ['E5', 0.2], ['G5', 0.3], ['Fs5', 0.2], ['E5', 0.2], ['Cs5', 0.3], ['A4', 0.8]], { g: g * 0.4, pan: -p, bright: 5, breath: 0.2, vib: 8, at: 1.6 });
        return [8, 11];
      }
      if (k === 0 || k === 2) { sweep(a, ['A2', 'E3', 'A3', 'C4', 'E4'], g * 0.9, p, { gap: 0.09, d: 3 }); if (k === 2) a.ney(g * 0.8, -p); return [13, 18]; }   // 大卫的琴
      if (k === 14 || lv('soLamp') > 0.5) { a.lyre('A4', a.rint(3, 4), g * 0.7, p, 'maj', { gap: 0.4 }); return [14, 18]; }
      if (k === 8) { a.bells(['A5', 'Cs6', 'E6'], 0.24, g * 0.45, 2.4); a.lyre('A3', 4, g * 0.6, -p, 'ion'); return [12, 16]; }   // 全殿贴上金子
      if (k === 7) { a.glass(g * 0.4, 2); return [12, 17]; }                                      // 建殿的时候，锤子、斧子……都听不见
      a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'ion', { gap: 0.26 }); return [12, 17];             // 智慧
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('solomon');
      if (lv('soSand') > 0.3) { a.ping(a.deg('ion', 'A5', a.rint(0, 9)), 0, g * 0.35, a.pan()); return [0.4, 1.1]; }   // 岸边的沙一粒一粒亮起
      if (lv('soHeaven') > 0.3) { a.starPing(g); return [0.5, 1.3]; }
      if (k === 8 && lv('soGold') > 0.5) { a.glass(g * 0.4, 1); return [4, 7]; }
      if (k === 12) { a.ping(a.pick(['A6', 'E6']), 0, g * 0.25, a.pan()); return [1.5, 3.5]; }    // 驼铃
      if (lv('soLamp') > 0.5) { a.ping('A5', 0, g * 0.35, 0.1); return [5, 8]; }
      return [5, 9];
    },
  });

  // ══ 列王纪上 · 以利亚 ════════════════════════════════════
  // 国分为二：同一个 A 上，左边小三度、右边大三度，彼此相拍；金牛犊与巴力（Hijaz 的迷狂脉动、乌德）；
  // 耶路撒冷的一盏灯（底组：温柔的 A 大，一缕笛音）；不降露、不下雨（细而白的挂留，地气蒸腾）；
  // 撒勒法的寡妇（多利亚的里拉）；迦密山的坛（空心的五度，等候）；「于是耶和华降下火来」——天地屏息，
  // 然后整个 A 大的合唱与深处的轰鸣，低通全开；「耶和华是神！」；一小片云如人手，大雨（流动的 A 加九）；
  // 罗腾树下（几乎空了）；烈风、地震、火——火后有微小的声音（只剩一个很高、很轻的 A）；
  // 七千人的灯遍地亮起；拿伯的葡萄园；以色列众民散在山上，如同没有牧人的羊群（苇笛）。
  music('elijah', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      split: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.14, -0.35, -6], ['Cs3', 'soft', 0.12, 0.35, 6], ['E3', 's', 0.06, 0.25], ['G3', 's', 0.05, -0.3]],
      idol: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'reed', 0.03, -0.3], ['Cs3', 'soft', 0.18, 0.3], ['F3', 'soft', 0.08, -0.2], ['G3', 's', 0.05, 0.35]], pulse: [1.7, 0.26] },
      lamp: [['A2', 's', 0.45, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'flute', 0.12, 0.3], ['E4', 's', 0.06, -0.35], ['A4', 's', 0.04, 0.4], ['B4', 's', 0.025, -0.45]],
      drought: { v: [['A1', 's', 0.2, 0], ['A2', 's', 0.36, 0], ['E3', 's', 0.2, 0.2], ['B3', 't', 0.07, -0.3], ['D4', 's', 0.05, 0.3], ['E4', 't', 0.05, 0.35], ['A4', 's', 0.03, -0.4]], pulse: [0.07, 0.2] },
      carmel: [['A1', 's', 0.46, 0], ['E2', 's', 0.26, 0.1], ['A2', 'soft', 0.14, 0], ['E3', 'soft', 0.14, -0.25], ['B3', 's', 0.05, 0.3]],
      fire: [['A1', 's', 0.26, 0], ['E2', 's', 0.16, 0.1], ['A2', 'grit', 0.03, 0], ['A2', 's', 0.14, 0], ['E3', 'soft', 0.18, -0.2], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.07, 0], ['E5', 't', 0.03, 0.45]],
      rain: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['Fs4', 's', 0.06, 0.4]], pulse: [0.3, 0.22] },
      still: [['A1', 's', 0.48, 0], ['E2', 's', 0.3, 0.1], ['A2', 's', 0.14, 0], ['E4', 's', 0.035, -0.3], ['A5', 's', 0.008, 0.3]],
    } },
    mix(lv) {
      const k = said('elijah'), td = tod();
      const rain = sm(0.1, 0.6, lv('rain')), storm3 = cl(lv('elWind') + lv('elQuake') + lv('elBlaze'));
      const still = max(k === 10 ? 0.6 : 0, k === 11 ? max(cl(lv('elStill')), 0.6 * (1 - storm3)) : 0);
      const carmel = max(k === 7 ? 1 : 0, k === 9 ? 0.7 * (1 - rain) : 0, k === 11 ? storm3 : 0);
      const dry = cl(lv('elDry')) * (k === 6 && td > 0.55 ? 0.2 : k === 5 ? 0.45 : 1);
      const idol = max(k === 2 ? 0.8 : 0, k <= 4 ? cl(lv('elBaal')) : 0, k === 6 ? (td > 0.55 ? 0.8 : 0.3) : 0, k === 13 ? 0.25 : 0);
      const split = cl(max(k === 1 ? 1 : 0, k === 13 ? 0.85 : 0, k === 14 ? 0.55 : 0, k === 0 ? 0.4 : 0, 0.6 * lv('elAram')));
      const g = stack([['fire', k === 8 ? 1 : 0], ['still', still], ['carmel', carmel], ['rain', k === 9 ? 1 : rain], ['drought', dry], ['idol', idol], ['split', split]], 'lamp');
      const heaven = cl(lv('elHeaven')), hush = cl(lv('elHush')) * (1 - heaven);
      const lp = 1300 * (1 + 1.2 * g.fire * (0.4 + 0.6 * heaven) + 0.4 * g.rain + 0.3 * g.lamp + 0.25 * g.drought) * (1 - 0.3 * g.split) * (1 - 0.3 * g.idol)
        * (1 - 0.35 * g.still) * (1 - 0.25 * cl(lv('storm')));
      return { g, lp, pad: (1 - 0.65 * hush) * (1 - 0.45 * g.still) * (1 - 0.15 * g.drought), tc: k === 8 ? 1 : 2.2,
        dlp: 1 + 0.3 * cl(lv('elQuake')) - 0.2 * g.still, drone: 1 + 0.35 * g.fire * heaven + 0.4 * cl(lv('elQuake')) + 0.2 * g.idol - 0.3 * g.drought };
    },
    scale(lv) {
      const k = said('elijah');
      if (k === 8) return 'maj';
      if (lv('elStill') > 0.4) return 'sus';
      if (k === 11 && lv('elWind') + lv('elQuake') + lv('elBlaze') > 0.3) return 'phryg';
      if (k === 9) return lv('rain') > 0.3 ? 'maj' : 'sus';
      if (k === 7) return 'dor';
      if (k === 2 || (k <= 4 && lv('elBaal') > 0.5 && lv('elDry') < 0.5) || (k === 6 && tod() > 0.55)) return 'hijaz';
      if (lv('elDry') > 0.5 && k !== 5) return 'sus';
      if (k === 13) return 'phryg';
      if (k === 1 || k === 14 || k === 10) return 'aeol';
      if (k === 5) return 'dor';
      if (k === 12) return 'maj';
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('elijah');
      if (k === 8) {                                                                              // 耶和华是神！耶和华是神！
        if (lv('elHush') > 0.5 && lv('elHeaven') < 0.3) return [2, 3];
        a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.75, 0.55], g: g * 0.95, a: 0.5, s: 0.9, r: 1.8, pan: -0.25 });
        a.choir(['A3', 'Cs4', 'E4', 'A4', 'Cs5'], { gs: [1, 0.85, 0.75, 0.55, 0.35], g: g * 1.05, a: 0.5, s: 1.3, r: 3, at: 2.4, pan: 0.25 });
        a.bells(['A5', 'E6'], 0.2, g * 0.6, 3, 2.4);
        return [11, 15];
      }
      if (k === 11 && lv('elStill') > 0.4) {                                                       // 微小的声音
        a.note({ f: 'A5', g: g * 0.22, a: 1.8, s: 1.2, r: 3.5, pan: p * 0.3, rev: 0.9 });
        return [12, 18];
      }
      if (k === 11 && lv('elWind') + lv('elQuake') + lv('elBlaze') > 0.3) return [6, 9];          // 耶和华却不在风中、不在地震中、不在火中
      if (k === 9) { if (lv('rain') > 0.3) { flowing(a, g); return [8, 12]; } return [10, 14]; }
      if (k === 7) {                                                                              // 亚伯拉罕、以撒、以色列的神啊
        cantor(a, [['A3', 0.5], ['C4', 0.5], ['D4', 0.7], ['E4', 0.5], ['D4', 0.4], ['C4', 0.4], ['A3', 1.4]], g, p);
        return [12, 16];
      }
      if (k === 2 || (k <= 4 && lv('elBaal') > 0.5 && lv('elDry') < 0.5)) { a.oud(g * 0.9, p); return [11, 16]; }   // 金牛犊；巴力的庙
      if (k === 6 && tod() > 0.55) {                                                               // 巴力的先知从早晨到午间求告：没有声音
        a.knocks([[0, 380, 90, g * 1.1, true], [0.3, 1400, 200, g * 0.5, false], [0.45, 380, 92, g, true], [0.9, 380, 90, g * 1.1, true], [1.05, 1500, 210, g * 0.5, false],
          [1.2, 380, 94, g * 0.9, true], [1.5, 400, 96, g * 1.2, true]], { lp: 1600, pan: p, rev: 0.55 });
        return [6, 10];
      }
      if (k === 5) { a.lyre('A3', a.rint(4, 5), g * 0.8, p, 'dor', { gap: 0.36 }); return [13, 18]; }   // 坛内的面、瓶里的油
      if (lv('elDry') > 0.5) { a.ney(g * 0.85, p); return [16, 24]; }                             // 旱
      if (k === 10) { a.ney(g, p); if (Math.random() < 0.5) a.glass(g * 0.4, 1); return [13, 18]; }
      if (k === 14) { a.ney(g, p); return [13, 18]; }                                               // 如同没有牧人的羊群
      if (k === 13 || k === 1) { a.bowed(a.pick(['A2', 'C3', 'Cs3', 'E3']), g * 0.85, p); return [13, 18]; }
      if (k === 12) { a.shepherd(g * 0.85, p); return [12, 17]; }                                  // 以利沙在十二对牛后耕地
      a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'ion'); return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('elijah');
      if (k === 8 && lv('elHeaven') > 0.2) { flicker(a, g * 0.6, 'maj'); return [0.8, 2]; }
      if (k === 9 && lv('rain') < 0.1 && lv('elHand') < 0.5) { a.ping('E5', 0, g * 0.35, -0.5); return [3, 5]; }   // 仆人上去向海观看，七次
      if (k === 12 && lv('elSeven') > 0.3) { a.ping(a.deg('maj', 'A4', a.rint(0, 9)), 0, g * 0.4, a.pan()); return [0.9, 2]; }   // 七千盏小灯
      if (k === 3 && lv('elLamp') > 0.5) { a.ping('A5', 0, g * 0.35, 0.4); return [5, 8]; }       // 耶路撒冷的灯光
      return [5, 9];
    },
  });

  // ══ 列王纪下 · 以利沙 ════════════════════════════════════
  // 先知的路（多利亚的五声，竖琴般的持续音）；约旦河的水左右分开（流动的 A 大九，没有三音）；
  // 火车火马、旋风（利底亚的轰鸣与合唱，急促的闪动），天开的光；水源被治好、器皿倒满了油、孩子的身体渐渐温和、
  // 乃缦的肉复原如小孩子、斧头漂上来、城门口的细面——恩典的温暖（A6）；晌午的阴影（爱奥利亚 b6）；
  // 「领一个弹琴的来」（竖琴与里拉）；亚兰的车马围困、撒马利亚被围、耶户赶车甚猛（弗里几亚 / 混合利底亚的战鼓）；
  // 殿中不灭的灯；「以色列的战车马兵啊」天上的回声；神仍施恩给以色列人。
  music('elisha', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      prophet: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.15], ['A3', 'harp', 0.06, -0.1], ['C4', 'soft', 0.1, -0.3], ['D4', 's', 0.06, 0.35], ['G4', 's', 0.04, -0.4]],
      jordan: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Gs3', 'soft', 0.08, 0.3], ['B3', 's', 0.12, -0.3], ['E4', 's', 0.07, 0.35], ['Cs5', 's', 0.025, -0.45]], pulse: [0.22, 0.2] },
      whirl: { v: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.26, 0.1], ['A2', 'grit', 0.03, 0], ['E3', 'soft', 0.14, -0.2], ['A3', 'choir', 0.14, 0], ['Cs4', 'choir', 0.12, 0], ['Ds4', 'choir', 0.06, 0], ['Gs4', 'choir', 0.05, 0], ['E5', 't', 0.03, 0.45]], pulse: [3.6, 0.2] },
      ascend: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.24, -0.15], ['A3', 's', 0.14, 0.2], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.06, -0.45], ['Ds5', 's', 0.025, 0.5], ['A3', 'over', 0.05, 0]],
      grief: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.24, -0.3], ['F3', 's', 0.08, 0.3], ['B3', 's', 0.03, -0.4]],
      siege: { v: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.32, 0.1], ['Bb2', 'soft', 0.09, -0.3], ['C3', 'soft', 0.22, 0.3], ['E3', 'soft', 0.09, -0.2], ['G3', 's', 0.05, 0.35]], pulse: [1.6, 0.26] },
      plenty: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.06, 0.2], ['Fs4', 'flute', 0.06, 0.35], ['A4', 's', 0.04, -0.4]],
      lamp: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.12, 0.3], ['E4', 's', 0.06, -0.35], ['Cs5', 'flute', 0.03, 0.4]],
    } },
    mix(lv) {
      const k = said('elisha'), td = tod();
      const whirl = cl(max(lv('esWhirl'), lv('esFire'), k === 1 ? 0.8 * lv('esScorch') : 0));
      const asc = cl(max(lv('esGlory'), 0.7 * lv('esSpirit'), lv('esEcho')));
      const grief = cl(max(lv('esGrief'), 0.45 * lv('esBlind')));
      const siege = cl(max(lv('esHost'), 0.7 * lv('esRumble'), k === 12 ? 1 : 0, 0.6 * lv('esRed'), k === 1 ? 0.35 : 0));
      const jordan = cl(max(lv('esPart'), k === 2 ? 0.6 : 0, k === 8 ? 0.7 * (1 - lv('esClean')) : 0, k === 9 ? 0.4 : 0, 0.6 * lv('esFill') * (1 - lv('esRed'))));
      const plenty = cl(max(k === 4 ? lv('esSpring') : 0, k === 6 ? max(0.6, lv('esOil') / 4) : 0, k === 7 ? lv('esWarm') : 0, k === 8 ? lv('esClean') : 0,
        k === 9 ? 0.8 * lv('esAxe') : 0, k === 11 && td < 0.4 ? 1 : 0, lv('esGrace')));
      const g = stack([['whirl', whirl], ['ascend', asc], ['grief', grief], ['siege', siege], ['lamp', lv('esLamp')], ['jordan', jordan], ['plenty', plenty]], 'prophet');
      const lp = 1300 * (1 + 1.0 * g.whirl + 0.8 * g.ascend + 0.4 * g.plenty + 0.3 * g.jordan + 0.2 * g.lamp) * (1 - 0.35 * g.siege) * (1 - 0.3 * g.grief)
        * (1 - 0.35 * cl(lv('esBlind')));
      return { g, lp, dlp: 1 + 0.2 * g.whirl - 0.2 * g.siege, drone: 1 + 0.3 * g.whirl + 0.2 * g.siege - 0.1 * g.plenty };
    },
    scale(lv) {
      const k = said('elisha');
      if (max(lv('esWhirl'), lv('esFire')) > 0.5) return 'lyd';
      if (max(lv('esGlory'), lv('esEcho')) > 0.5) return 'lyd';
      if (lv('esGrief') > 0.5) return 'aeol';
      if (k === 12) return 'mixo';
      if (max(lv('esHost'), lv('esRumble'), lv('esRed')) > 0.5) return 'phryg';
      if (lv('esLamp') > 0.5) return 'ion';
      if (k === 5) return 'dor';
      if (max(lv('esPart'), lv('esSpring'), lv('esWarm'), lv('esClean'), lv('esAxe'), lv('esGrace')) > 0.5 || k === 6 || (k === 11 && tod() < 0.4)) return 'maj';
      return 'dor';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), k = said('elisha');
      if (max(lv('esWhirl'), lv('esFire')) > 0.5) {                                               // 火车火马
        a.angelRun(g * 0.9);
        a.choir(['A3', 'Cs4', 'Ds4', 'Gs4'], { gs: [1, 0.85, 0.6, 0.5], g: g * 0.75, a: 0.8, s: 1, r: 2.4, at: 0.4, pan: -p * 0.5 });
        gallop(a, g * 0.8, p, 4);
        return [7, 10];
      }
      if (lv('esEcho') > 0.5) { hornCall(a, g * 0.9, p); return [10, 14]; }                        // 以色列的战车马兵啊（天上的回声）
      if (max(lv('esGlory'), lv('esSpirit')) > 0.5) {
        if (lv('esSpirit') > 0.5) { sweep(a, ['A2', 'E3', 'A3', 'C4', 'E4', 'G4'], g, p, { gap: 0.08 }); a.lyre('A4', a.rint(4, 6), g * 0.7, -p, 'dor', { gap: 0.24 }); return [8, 12]; }
        a.choir(['A3', 'E4', 'Gs4', 'B4'], { gs: [1, 0.8, 0.6, 0.45], g: g * 0.75, a: 1.2, s: 1, r: 3, pan: 0 });
        return [11, 15];
      }
      if (lv('esGrief') > 0.5) { a.ney(g, p); return [12, 17]; }                                   // 晌午孩子死了
      if (k === 12) { gallop(a, g, p, a.rint(4, 6)); if (Math.random() < 0.5) shofar(a, g * 0.9, -p); return [8, 11]; }   // 耶户赶车甚猛
      if (max(lv('esHost'), lv('esRumble'), lv('esRed')) > 0.5) { drum(a, g, p); return [9, 13]; }
      if (lv('esLamp') > 0.5) { a.lyre('A4', a.rint(3, 4), g * 0.65, p, 'ion', { gap: 0.4 }); return [15, 20]; }
      if (k === 5) { sweep(a, ['A2', 'E3', 'A3', 'C4', 'E4'], g * 0.9, p, { gap: 0.08 }); a.lyre('A3', a.rint(4, 5), g * 0.7, -p, 'dor'); return [9, 13]; }   // 领一个弹琴的来
      if (k === 7 && lv('esWarm') > 0.5) { steps(a, 'A4', 'maj', 7, g * 0.6, p, 0.28, 1.4); return [11, 15]; }   // 打了七个喷嚏，睁开眼睛
      if (k === 8 && lv('esClean') > 0.5) {                                                        // 肉复原，好像小孩子的肉
        a.pipe([['A5', 0.3], ['E5', 0.3], ['Fs5', 0.3], ['E5', 0.3], ['Cs5', 0.4], ['A4', 1.2]], { g: g * 0.4, pan: p, bright: 5, breath: 0.18, vib: 7, rev: 0.6 });
        return [11, 15];
      }
      if (k === 9 && lv('esAxe') > 0.5) { steps(a, 'E4', 'maj', 5, g * 0.6, p, 0.12, 1.4); return [11, 15]; }   // 斧头漂上来
      if (lv('esPart') > 0.5 || (k === 2) || lv('esFill') > 0.5) { flowing(a, g); return [9, 13]; }
      if (max(lv('esSpring'), lv('esGrace')) > 0.5 || k === 6 || (k === 11 && tod() < 0.4)) { a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.3 }); return [11, 16]; }
      if (Math.random() < 0.5) a.lyre('A3', a.rint(4, 5), g * 0.8, p, 'dor'); else a.ney(g * 0.9, p);
      return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv, k = said('elisha');
      if (k === 6 && lv('esOil') > 0.3) { a.pluck(a.deg('maj', 'A4', Math.min(9, Math.round(lv('esOil')))), 0, g * 0.45, a.pan(), 0.9); return [1.5, 3]; }   // 器皿一个一个倒满了油
      if (lv('esFire') > 0.3) { a.starPing(g); return [0.5, 1.2]; }                                 // 满山有火车火马
      if (lv('esWhirl') > 0.3) { flicker(a, g * 0.5, 'lyd'); return [0.8, 1.8]; }
      if (lv('esSpirit') > 0.3) { a.lyre('A5', 2, g * 0.35, a.pan(), 'dor', { gap: 0.2 }); return [3, 6]; }
      if (lv('esLamp') > 0.3) { a.ping('A5', 0, g * 0.35, -0.2); return [5, 8]; }
      if (lv('esGrace') > 0.3) { a.glass(g * 0.4, 1); return [4, 7]; }
      return [5, 9];
    },
  });
})(window.GS);
