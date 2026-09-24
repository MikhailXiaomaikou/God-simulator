/* ─────────────────────────────────────────────────────────────
 * music/ot4.js —— 旧约各卷的乐曲（第四批）：出埃及记·西奈 · 约书亚记 · 撒母耳记下·大卫王 · 列王纪下·亡国 · 约伯记 · 雅歌
 *                 · 小先知书·慈绳爱索（何西阿书 — 弥迦书）
 *
 * 写法见 js/music/ot1.js 的开头（仍全在 A 上；响度照那里的规矩：每组增益之和约 1.0–1.2，根音 0.4–0.5，高声部 0.01–0.15）。
 * 本文件另有几件小工具，绕过登记表的局限：
 *   · said(id)：本卷已经说出了几句话（W.stage − 本卷的 first）。mix / scale / motif 拿不到"第几句"，
 *     而有些时刻没有自己的程度（耶利哥城墙塌陷之后、拈阄分地、逃城、大卫的哀歌……），
 *     有些程度说过之后一直留着（西奈的坛与界限、锡安城、炉灰、北国的灯……）——用句数把它们限定在自己的那一句里。
 *   · since(id)：这一句说出之后过了几秒（世界时间 × W.fast，与情节的时间轴同一个钟），分出一句之内的前后
 *     （牛犊被焚之前 / 之后、城墙塌陷之后、约西亚死后……）。
 *   · 程度不止 0..1 的（joRings 0..6、joRings7 0..7、exGlory 到 1.25、exShadow 0..20、taShip 0..2）在这里自己归一。
 *   · 调式与乐句都跟着乐垫此刻最重的一组走（top(mix(lv).g)）：乐垫、调式、乐句三者总是同一个光景。
 *   · 乐句里没有人声（vox）可用：押沙龙的哀哭、何西阿的呼唤都交给苇笛与弓弦。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  if (!GS || !GS.audio || !GS.audio.music) return;
  const music = GS.audio.music;
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
  // 此刻最重的一组
  function top(g) { let k = '', v = -1; for (const n in g) if (g[n] > v) { v = g[n]; k = n; } return k; }
  // 本卷已说出几句（0 = 第一句之前）
  function said(id) {
    const B = GS.book, A = B && B.find ? B.find(id) : null, W = GS.W;
    return A && W ? (W.stage | 0) - A.first : 0;
  }
  // 这一句说出之后过了几秒（与 book.timeline 同一个钟）
  const CLK = {};
  function since(id) {
    const W = GS.W, n = said(id), now = (W && W.t) || 0, c = CLK[id] || (CLK[id] = { n: -1, t: now });
    if (c.n !== n) { c.n = n; c.t = now; }
    return (now - c.t) * ((W && W.fast) || 1);
  }
  // 自订的调式（自 A 起的半音）
  const DESERT = [0, 2, 5, 7, 10];   // A B D E G：挂留带小七——西奈旷野里古老的五声
  const HORN = [0, 4, 7, 10];        // 号角的泛音 A C# E G（西奈的角声、约书亚的羊角、「我拯救的角」）
  const LAMP = [0, 4, 7];            // 一盏小灯：只有 A 大三和弦
  const HYMN = [0, 2, 4, 5, 7, 9];   // 没有导音的大调六声（爱情如死之坚强）

  // ── 共用的乐句 ────────────────────────────────────────────
  // 自然号角：A1 的泛音列（纯律——第五泛音 C# 低 14 音分，第七泛音 G 低 31 音分）；每一声先略低，再吹正（唇的滑入）
  // seq = [[泛音序数, 起, 长, 力度?], ...]
  function horn(a, g, p, seq, o) {
    o = o || {};
    for (const [k, at, d, acc] of seq) {
      const f = 55 * k;
      a.note({ f: f * 0.985, path: [[f, 0.07]], type: o.type || 'reed', lp: o.lp || 1500, g: g * (acc || 1), a: 0.05, s: d, r: 0.9, at,
        vib: [5.3, 0.003], pan: p, rev: o.rev == null ? 0.72 : o.rev });
    }
  }
  // 手鼓与串铃：'D' 鼓心 · 't' 鼓边（带铃）· 'j' 只摇串铃 · '.' 空拍
  function drum(a, g, p, pat, beat) {
    const hits = [];
    for (let i = 0; i < pat.length; i++) {
      const c = pat[i], at = i * beat;
      if (c === 'D') hits.push([at, 420, 92, g * 1.25, true]);
      else if (c === 't') hits.push([at, 2400, 260, g * 0.6, false]);
      if (c === 'j' || c === 't') a.burst({ buf: 'white', f: 7200, q: 1.4, g: g * (c === 'j' ? 0.45 : 0.22), a: 0.002, d: 0.14, at, pan: p, hp: 4500, rev: 0.3 });
    }
    if (hits.length) a.knocks(hits, { lp: 5000, pan: p, rev: 0.4 });
  }
  // 远处的战鼓（低的皮鼓）
  function toms(a, g, p, hits) {
    a.knocks(hits.map(([at, k]) => [at, 260, 78 + 6 * Math.random(), g * k, true]), { lp: 650, pan: p, rev: 0.55 });
  }
  // 铁砧：打铁的叮当（刀打成犁头、比撒列的金工）
  function anvil(a, g, p, n) {
    const hits = [];
    for (let i = 0; i < (n || 3); i++) { const at = i * 0.62; hits.push([at, 4800, 1180, g * 0.7, false], [at + 0.13, 4300, 1180, g * 0.28, false]); }
    a.knocks(hits, { lp: 9000, pan: p, rev: 0.4 });
  }
  // 一串下行的弦（水、公义的江河、罪投于深海）
  function cascade(a, g, sc, base, i0, n, step, o) {
    o = o || {};
    const ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc, base, i0 - k), k * step, g * (1 - k * 0.055), o.d || 1.8]);
    a.strings(ns, { wave: o.wave || 's', bright: o.bright || 2, d: o.d || 1.8, pan: o.pan == null ? a.pan() : o.pan, spread: 0.35, rev: o.rev || 0.75, at: o.at || 0 });
  }
  // 一串上行的弦（日影往后退、救赎主活着、直到永远的那一行星）
  function rise(a, g, sc, base, n, step, o) {
    o = o || {};
    const ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc, base, (o.i0 || 0) + k), k * step, g * (0.72 + 0.28 * k / Math.max(1, n - 1)), o.d || 2.6]);
    a.strings(ns, { wave: o.wave || 'harp', bright: o.bright || 4, d: o.d || 2.6, pan: o.pan == null ? a.pan() : o.pan, spread: 0.3, rev: o.rev || 0.7, at: o.at || 0 });
  }
  // 阿们：IV → I 的无字合唱
  function amen(a, g) {
    a.choir(['A3', 'D4', 'Fs4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.8, a: 0.9, s: 0.8, r: 1.6, pan: -0.2 });
    a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 1, s: 1.4, r: 3, at: 2.3, pan: 0.15 });
  }
  // 叹息：一口气的下行（泪、哀求）
  function sigh(a, g, p, ns, at) {
    a.pipe(ns, { g: g * 0.5, at: at || 0, pan: p, bend: true, bright: 3, breath: 0.4, vib: 15, vibHz: 5, rev: 0.72 });
  }
  // 摇篮曲般的一句（慈绳爱索：教以法莲行走）
  function lullaby(a, g, p) {
    a.pipe([['E4', 0.45], ['Fs4', 0.3], ['A4', 0.75], ['Fs4', 0.35], ['E4', 0.45], ['Cs4', 0.5], ['E4', 1.6]], { g: g * 0.48, pan: p, bright: 4, breath: 0.22, vib: 9, rev: 0.62 });
  }

  // ══ 出埃及记 · 西奈 ══════════════════════════════════════
  // 山下的营：旷野的挂留（A B D E G）；第三天：雷轰、密云、遍山震动（低处的脉动），角声——A1 的泛音列一层层吹响，
  // 「角声渐渐地高而又高」（每一声号角比前一声长）；十条诫：五度一层层叠起（A E B F# C#），刻在石上；
  // 蓝宝石的铺地、山上指示的样式、十二块宝石：利底亚的高光，金线一笔笔画出；
  // 金牛犊：Hijaz——埃及的调子回来了，手鼓与乌德，快快的脉动（「起来玩耍」）；法版摔碎：爱奥利亚；
  // 磐石穴：低处的静，手遮掩时整个乐垫屏住气；「耶和华，耶和华」——无字的合唱两声呼喊，A6 的温柔；
  // 比撒列的巧工：金锤的轻响；帐幕立起，云彩遮盖，荣光充满了帐幕：低到高整个亮起，伊奥尼亚。
  const snMix = lv => {
    const n = said('sinai'), s = since('sinai'), storm = cl(lv('storm'));
    const rest = n === 5 ? 0.45 : 1;                                                  // 守安息日：雷与角都退后一半
    const fireTop = lv('snFire') * lv('snCloud');                                     // 山顶的形状如烈火（24:17）
    const thunder = cl(max(sm(0.25, 0.8, storm), lv('snQuake'), n === 7 || n === 8 ? 0.55 * fireTop : 0)) * rest;
    const hornW = cl(lv('snSmoke') * (0.5 + 0.5 * lv('snFire'))) * rest;
    const law = cl(lv('snTab') * (1 - 0.7 * lv('snTabDown')));
    const vision = cl(max(lv('snPave'), lv('snPattern'), 0.85 * lv('snGems'), n === 6 ? 0.35 : 0));   // 使者在路上：一点微光
    const broke = n === 10 ? sm(21, 23, s) : 0;                                       // 两块版摔碎（32:19）
    const calf = cl(lv('snCalf') * (1 - broke) * (1 - lv('snCalfFire')));
    const wrath = cl(max(lv('snCalfFire'), broke, n === 10 && s < 7.5 ? 0.5 : 0));   // 「他们快快偏离了」
    const hand = cl(lv('snHand'));
    const cleft = cl(max(lv('snCleft'), 0.8 * lv('snPillarM'), 0.55 * lv('snMeet'), hand));
    const name = cl(max(lv('snName'), (n === 12 ? 0.75 : 0.3) * lv('snShine')));
    const craft = cl(max(lv('snGifts'), lv('snParts') * (1 - lv('snRaise')), n === 14 ? 0.6 * lv('snRaise') * (1 - lv('snColumn')) : 0));
    const glory = cl(max(lv('snGlory'), 0.85 * lv('snColumn')));
    const g = stack([['glory', glory], ['name', name], ['cleft', cleft], ['wrath', wrath], ['calf', calf], ['vision', vision],
      ['law', 0.6 * law], ['horn', 0.55 * hornW], ['thunder', thunder], ['craft', craft]], 'camp');
    const lp = 1300 * (1 + 0.9 * g.glory + 0.5 * g.name + 0.7 * g.vision + 0.4 * g.horn + 0.3 * g.craft + 0.25 * g.law + 0.15 * g.calf)
      * (1 - 0.35 * g.thunder) * (1 - 0.3 * g.wrath) * (1 - 0.3 * g.cleft) * (1 - 0.5 * hand) * (1 - 0.2 * storm);
    return { g, lp, pad: 1 - 0.3 * hand, drone: 1 + 0.35 * g.thunder + 0.15 * g.law - 0.15 * g.glory,
      dlp: 1 - 0.2 * g.thunder - 0.2 * g.cleft + 0.2 * g.glory };
  };
  const SN_SC = { camp: DESERT, thunder: 'mixo', horn: HORN, law: 'ion', vision: 'lyd', calf: 'hijaz', wrath: 'aeol', cleft: 'sus', name: 'maj', craft: 'maj', glory: 'ion' };
  // 角声渐渐地高而又高：第几声号角（按这一句里过了多久）
  const SN_CALLS = [
    [[4, 0, 0.5], [6, 0.55, 1.5]],
    [[4, 0, 0.35], [6, 0.4, 0.35], [8, 0.8, 1.7]],
    [[6, 0, 0.3], [8, 0.35, 0.3], [10, 0.7, 0.45], [8, 1.2, 1.9]],
    [[4, 0, 0.28], [6, 0.32, 0.28], [8, 0.64, 0.28], [10, 0.96, 0.28], [12, 1.28, 2.4, 1.1]],
  ];
  music('sinai', {
    weight: { drone: 0.65, pad: 0.95 },
    pad: { lp: 1300, groups: {
      camp: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 'over', 0.05, 0.1], ['B3', 'soft', 0.14, 0.3], ['D4', 'soft', 0.08, -0.35], ['G4', 's', 0.03, 0.45]],
      thunder: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['A2', 'grit', 0.05, -0.2], ['D3', 'soft', 0.18, -0.3], ['E3', 'soft', 0.1, 0.3], ['G3', 's', 0.06, 0.4]], pulse: [0.55, 0.35] },
      horn: [['A2', 's', 0.38, 0], [165, 'warm', 0.2, -0.15], [220, 'warm', 0.15, 0.2], [275, 'warm', 0.1, -0.3], [330, 'warm', 0.08, 0.35], [385, 's', 0.04, -0.4], [440, 's', 0.03, 0.45]],
      law: [['A1', 's', 0.34, 0], ['E2', 'soft', 0.28, 0.1], ['A2', 'over', 0.08, 0], ['B2', 'soft', 0.16, -0.25], ['Fs3', 'soft', 0.12, 0.3], ['Cs4', 's', 0.07, -0.4]],
      vision: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['B3', 's', 0.14, 0.3], ['Ds4', 's', 0.07, -0.35], ['Gs4', 's', 0.06, 0.4], ['Cs5', 's', 0.035, -0.45], ['Fs5', 's', 0.015, 0.5]],
      calf: { v: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.2, 0.1], ['A2', 'reed', 0.06, -0.2], ['E3', 'soft', 0.24, 0.2], ['Cs4', 'soft', 0.12, -0.3], ['Bb3', 's', 0.06, 0.35], ['G4', 's', 0.035, -0.4]], pulse: [2.3, 0.4] },
      wrath: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.24, -0.3], ['F3', 's', 0.08, 0.35], ['A3', 'warm', 0.05, -0.2]],
      cleft: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['B2', 'soft', 0.12, -0.25], ['E3', 's', 0.08, 0.3]],
      name: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.12, 0], ['Fs4', 'choir', 0.1, 0], ['B4', 's', 0.03, -0.45]],
      craft: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['A3', 'soft', 0.13, 0.25], ['Cs4', 't', 0.1, -0.3], ['E4', 'harp', 0.06, 0.35], ['Fs4', 's', 0.04, -0.45]], pulse: [1.6, 0.22] },
      glory: [['A1', 's', 0.24, 0], ['A2', 's', 0.26, 0], ['E3', 'soft', 0.24, -0.15], ['A3', 'over', 0.07, 0.1], ['Cs4', 'choir', 0.14, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.1, 0], ['B4', 's', 0.035, 0.45], ['E5', 's', 0.025, -0.5]],
    } },
    mix: snMix,
    scale: lv => SN_SC[top(snMix(lv).g)] || DESERT,
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('sinai'), s = since('sinai');
      switch (top(snMix(lv).g)) {
        case 'glory':                                                                    // 荣光充满了帐幕
          a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 0.85, a: 2.4, s: 2.6, r: 4, pan: 0 });
          a.bells(['A5', 'E6', 'Cs6'], 0.9, g * 0.5, 3.2, 3.2);
          return [14, 19];
        case 'name':                                                                     // 「耶和华，耶和华」，然后是怜悯的一句
          a.choir(['A3', 'Cs4', 'E4'], { gs: [1, 0.8, 0.6], g: g * 0.8, a: 0.5, s: 0.6, r: 1.6, pan: -0.35 });
          a.choir(['A3', 'E4', 'A4'], { gs: [1, 0.8, 0.6], g: g * 0.85, a: 0.5, s: 0.7, r: 1.8, at: 1.8, pan: 0.35 });
          a.strings([['Cs5', 3.8, g * 0.8], ['B4', 4.22, g * 0.7], ['A4', 4.64, g * 0.75], ['Fs4', 5.06, g * 0.7], ['E4', 5.6, g * 0.85, 3.6]], { bright: 4, d: 2.6, pan: p, spread: 0.2, rev: 0.7 });
          return [13, 18];
        case 'cleft':
          if (lv('snHand') > 0.35) return [5, 8];                                        // 用手遮掩：屏住气
          a.bowed(a.pick(['A2', 'E2', 'B2']), g * 0.7, p); return [15, 22];
        case 'wrath': a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.9, p); return [11, 16];
        case 'calf':                                                                     // 坐下吃喝，起来玩耍
          a.oud(g * 0.85, p);
          drum(a, g * 0.8, -p * 0.6, 'D.t.D.tjD.t.D.tt', 0.16);
          return [5.5, 8.5];
        case 'vision': {
          if (lv('snPave') > 0.4) { a.glass(g * 0.7, 3); return [7, 11]; }               // 平铺的蓝宝石
          const up = Math.random() < 0.7, i0 = a.rint(0, 3), ns = [];                     // 山上指示的样式：一笔金线
          for (let k = 0; k < 7; k++) ns.push([a.deg('lyd', 'A4', up ? i0 + k : i0 + 7 - k), k * 0.16, g * (0.75 + 0.03 * k), 2.4]);
          a.strings(ns, { wave: 's', bright: 2, d: 2.4, pan: p, spread: 0.3, rev: 0.8 });
          return [9, 14];
        }
        case 'law':                                                                      // 石版上的字：一句庄严的吟诵
          a.note({ f: 'A2', type: 'warm', lp: 700, g: g * 0.75, a: 1.2, s: 2.2, r: 3, pan: -p * 0.5, rev: 0.6 });
          a.lyre('A3', 4, g * 0.85, p, 'ion', { gap: 0.55 });
          return [12, 17];
        case 'horn':                                                                     // 角声渐渐地高而又高
          horn(a, g * 0.8, p, SN_CALLS[n === 3 ? min(3, Math.floor(s / 8)) : a.rint(0, 2)]);
          return [7, 10];
        case 'thunder': return [8, 12];                                                  // 雷轰与地震本身就是音乐
        case 'craft':                                                                    // 比撒列的巧工：琴与金锤
          a.lyre('A4', a.rint(5, 7), g * 0.7, p, 'maj', { gap: 0.17 });
          anvil(a, g * 0.6, -p, 2);
          return [8, 12];
        default:
          if (n === 1 && Math.random() < 0.6) { a.angelRun(g * 0.8); return [10, 15]; }   // 如鹰将你们背在翅膀上
          if (a.night() > 0.5) { a.lyre('A3', a.rint(3, 4), g * 0.7, p, DESERT, { gap: 0.42 }); return [16, 24]; }
          a.ney(g * 0.95, p); return [15, 23];                                           // 旷野的苇笛
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('snGlory') > 0.4) { a.glass(g * 0.5, 1); return [3, 6]; }
      if (max(lv('snPattern'), lv('snGems')) > 0.35) { a.starPing(g); return [0.6, 1.6]; }   // 金色的线、胸牌上的宝石
      if (lv('snPave') > 0.4) { a.glass(g * 0.5, 2); return [2, 4]; }
      if (lv('snShine') > 0.5) { a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.45, a.pan()); return [2.5, 5]; }   // 面皮发光
      if (lv('snFires') > 0.5 && a.night() > 0.5) { a.pluck(a.pick(['A3', 'E4', 'D4']), 0, g * 0.4, a.pan(), 0.8); return [5, 9]; }  // 营火
      return [5, 9];
    },
  });

  // ══ 约书亚记 · 耶利哥 ════════════════════════════════════
  // 摩押平原的清晨（混合利底亚的 A 加九：刚强壮胆的一句琴）；河那边应许之地的金光（高处的笛）；
  // 约旦河涨过两岸（缓缓起伏的挂留）→ 水立起成垒：一切都停住——乐垫不再呼吸；元帅与圣地、日头停留也用这不呼吸的一组；
  // 六日绕城：不可呼喊，只有低处一步一步的脉动；第七日七次：脉动更快、更紧（弗里几亚）；羊角吹响——A1 的泛音列；
  // 城塌之后：粗粝的混合利底亚与弓弦，为喇合的朱红线绳留一句琴；艾城、冰雹、北方诸王：爱奥利亚的暗；
  // 国中太平、拈阄分地、逃城如灯、「没有一句落空」（阿们）、示剑的葡萄园：伊奥尼亚的温暖。
  const joMix = lv => {
    const n = said('joshua'), s = since('joshua'), storm = cl(lv('storm'));
    const hornW = cl(lv('joHorn'));
    const fell = n === 7 && s > 9 && lv('joRings7') < 0.6 ? 1 : 0;                   // 城墙塌陷之后（第七次的记数归零）
    const still = cl(max(lv('joHeap'), lv('joHoly'), lv('joSun') * (0.75 + 0.25 * lv('joMoon'))));
    const siege7 = n === 7 && !fell ? cl(0.35 + 0.65 * sm(0, 7, lv('joRings7'))) : 0;
    const march = n === 6 ? cl(0.3 + 0.12 * lv('joRings')) : 0;                      // joRings 0..6
    const war = cl(max(n === 2 ? 0.3 : 0, fell ? 0.5 : 0, n === 8 ? 0.75 * (1 - sm(16, 26, s)) : 0,
      0.9 * lv('joHost'), 0.85 * sm(0.3, 0.7, storm), 0.6 * lv('joFires')));
    const river = n === 3 || n === 4 ? cl(max(lv('joFlood'), lv('joFill')) * (1 - lv('joHeap'))) : n <= 2 ? 0.4 * cl(lv('joFlood')) : 0;
    const promise = cl(max(lv('joPromise'), 0.8 * lv('joBeam'), n === 13 ? 0.85 * lv('joLevi') : 0));
    const land = n >= 11 ? 1 : n === 10 ? cl(0.8 * (1 - lv('joHost')) * (1 - lv('joFires'))) : n === 4 ? 0.4 * (1 - lv('joFill')) : n === 5 ? 0.4 : 0;
    const g = stack([['horn', 0.7 * hornW], ['still', still], ['siege7', siege7], ['march', march], ['war', war], ['river', river], ['promise', promise], ['land', land]], 'plains');
    const lp = 1400 * (1 + 0.6 * g.promise + 0.55 * g.still + 0.4 * g.horn + 0.25 * g.land + 0.2 * g.river)
      * (1 - 0.35 * g.war) * (1 - 0.25 * g.march) * (1 - 0.3 * g.siege7) * (1 - 0.25 * storm);
    return { g, lp, drone: 1 + 0.25 * g.march + 0.3 * g.siege7 + 0.2 * g.war - 0.1 * g.still, dlp: 1 - 0.2 * g.war - 0.1 * g.siege7 };
  };
  const JO_SC = { plains: 'mixo', promise: 'maj', river: 'sus', still: 'lyd', march: 'dor', siege7: 'phryg', horn: HORN, war: 'aeol', land: 'ion' };
  music('joshua', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1400, groups: {
      plains: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['E3', 'warm', 0.06, 0.2], ['B3', 'soft', 0.13, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['E4', 's', 0.06, 0.4], ['G4', 's', 0.02, -0.45]],
      promise: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.26, -0.15], ['A3', 'soft', 0.15, 0.25], ['Cs4', 'flute', 0.13, -0.3], ['E4', 's', 0.09, 0.35], ['B4', 's', 0.04, -0.45], ['Fs5', 's', 0.012, 0.5]],
      river: { v: [['A1', 's', 0.3, 0], ['A2', 's', 0.2, 0], ['E3', 'soft', 0.26, -0.2], ['B3', 's', 0.12, 0.3], ['D4', 'soft', 0.1, -0.3], ['E4', 's', 0.07, 0.4], ['A4', 's', 0.03, -0.45]], pulse: [0.26, 0.3] },
      still: { v: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.26, -0.15], ['A3', 'over', 0.06, 0.1], ['B3', 's', 0.12, 0.3], ['E4', 's', 0.09, -0.35], ['Fs4', 's', 0.05, 0.4], ['B4', 's', 0.035, -0.45], ['E5', 's', 0.018, 0.5]], breath: 0.003 },
      march: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'reed', 0.04, -0.2], ['D3', 'soft', 0.16, -0.3], ['E3', 'soft', 0.1, 0.3], ['G3', 's', 0.05, 0.4]], pulse: [0.62, 0.45] },
      siege7: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'soft', 0.07, -0.35], ['D3', 'soft', 0.16, 0.3], ['G3', 'soft', 0.09, -0.25], ['C4', 's', 0.04, 0.4]], pulse: [1.15, 0.45] },
      horn: [['A1', 's', 0.32, 0], ['A2', 's', 0.22, 0], [165, 'reed', 0.07, -0.25], [220, 'warm', 0.16, 0.2], [330, 'warm', 0.1, -0.3], [440, 's', 0.05, 0.35], [385, 's', 0.025, -0.4]],
      war: [['A1', 's', 0.48, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.06, -0.15], ['C3', 'soft', 0.22, -0.3], ['E3', 'soft', 0.1, 0.25], ['Bb3', 's', 0.045, 0.35]],
      land: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['A3', 'soft', 0.12, 0.25], ['Cs4', 't', 0.1, -0.3], ['E4', 'soft', 0.09, 0.35], ['Fs4', 's', 0.04, 0.45], ['A4', 'flute', 0.05, -0.4]],
    } },
    mix: joMix,
    scale: lv => (said('joshua') === 2 && top(joMix(lv).g) === 'plains' ? 'dor' : JO_SC[top(joMix(lv).g)] || 'mixo'),
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('joshua'), s = since('joshua');
      switch (top(joMix(lv).g)) {
        case 'horn': return [5, 8];                                                      // 羊角的声音就是乐句
        case 'siege7': return [4, 6];
        case 'march': return [6, 9];                                                     // 「不可呼喊，不可出声」
        case 'still':
          if (lv('joHoly') > 0.5) {                                                      // 拔出来的刀：一声冷光，脚下的圣地
            a.note({ f: 'Ds5', g: g * 0.32, a: 0.004, d: 3.6, pan: p, rev: 0.85 });
            a.bowed('A2', g * 0.6, -p); return [12, 18];
          }
          [['E5', 0], ['B5', 0.8], ['A5', 1.6]].forEach(([f, at], i) =>                  // 水立起成垒、日头停留：停住的高音
            a.note({ f, g: g * (0.42 - 0.06 * i), a: 1.2, s: 4.5, r: 3.5, at, pan: (i - 1) * 0.4, rev: 0.85 }));
          return [11, 16];
        case 'war':
          if (n === 7) { a.lyre('A3', a.rint(3, 4), g * 0.75, p, 'mixo', { gap: 0.45 }); return [12, 17]; }   // 惟独系着朱红线绳的那一段
          if (n === 2) { a.lyre('A3', 3, g * 0.6, p, 'dor', { gap: 0.5 }); return [15, 22]; }                  // 夜里城墙上的窗
          if (Math.random() < 0.5) { toms(a, g, p, [[0, 1.3], [0.45, 0.9], [0.9, 1.2], [1.8, 1.1]]); return [9, 13]; }
          a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.85, p); return [11, 16];
        case 'river': cascade(a, g, 'sus', 'A4', 9, 6, 0.13, { pan: p }); return [7, 11];
        case 'promise':
          if (n === 13) { amen(a, g); return [12, 16]; }                                 // 一句也没有落空
          a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'maj'); return [11, 16];
        case 'land':
          if (n === 11) {                                                                // 拈阄：几声乱落的弦，末一声定下
            const ns = [];
            for (let k = 0; k < 4; k++) ns.push([a.deg('ion', 'A4', a.rint(0, 9)), k * 0.11, g * 0.6, 1.2]);
            ns.push([a.pick(['A4', 'E4', 'Cs5']), 0.7, g * 0.85, 2.8]);
            a.strings(ns, { bright: 5, d: 1.8, pan: p, spread: 0.25, rev: 0.55 });
            return [8, 12];
          }
          if (n === 14) { a.shepherd(g * 0.9, p); return [13, 19]; }                      // 非你们所栽种的葡萄园
          a.lyre(a.pick(['A3', 'A4']), a.rint(4, 5), g * 0.8, p, 'ion', { gap: 0.3 }); return [13, 19];
        default:                                                                         // 你当刚强壮胆：一句号令般的琴
          if (n === 2) { a.lyre('A3', 3, g * 0.6, p, 'dor', { gap: 0.5 }); return [15, 22]; }
          a.strings([['A3', 0, g * 0.9], ['A3', 0.22, g * 0.7], ['E4', 0.44, g * 0.9], ['Cs4', 0.88, g * 0.8], ['E4', 1.1, g * 0.8], ['A4', 1.32, g, 3.2]],
            { bright: 5, d: 2.4, pan: p, spread: 0.2, rev: 0.6 });
          return [15, 22];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, n = said('joshua');
      if (max(lv('joHeap'), lv('joSun')) > 0.4) { a.glass(g * 0.45, 1); return [3.5, 6]; }
      if ((n === 3 || n === 4) && max(lv('joFlood'), lv('joFill')) > 0.5 && lv('joHeap') < 0.4) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.45, a.pan()); return [1.2, 2.8]; }
      if (n === 12) { a.ping(a.deg('ion', 'A5', a.rint(0, 6)), 0, g * 0.5, a.pan()); return [1.8, 3.5]; }   // 六座逃城如灯
      if (lv('joLevi') > 0.4) { a.starPing(g * 0.9); return [0.5, 1.2]; }                                    // 四十八座城
      if (lv('joGroves') > 0.4) { a.pluck(a.deg('maj', 'A4', a.rint(0, 6)), 0, g * 0.45, a.pan(), 0.6); return [3, 6]; }
      if (lv('joFires') > 0.4) { a.pluck(a.pick(['A2', 'E3', 'C3']), 0, g * 0.45, a.pan(), 0.9); return [2, 4]; }
      return [5, 9];
    },
  });

  // ══ 撒母耳记下 · 大卫王 ══════════════════════════════════
  // 开篇是大卫的哀歌（低处的 A 小，b6 与九度的痛：「大英雄何竟死亡」，琴上的挽歌）；希伯仑与锡安：王庭的伊奥尼亚；
  // 约柜进城：大卫极力跳舞——混合利底亚的快脉动、手鼓与串铃（米甲从窗户里看：一道冷影）；
  // 拿单的夜：众星聚成一座家，合唱的 A 大九、利底亚的星，一行星直升上去——「直到永远」；
  // 太阳平西的平顶：挂留的多利亚（暧昧）；耶和华甚不喜悦：弗里几亚的暗、心跳般的脉动；
  // 「你就是那人」之后的光：温柔的 A 加九（诗篇五十一）；押沙龙：父亲的哀哭交给苇笛；
  // 「耶和华是我的岩石」：暴风里坚固的五度，「我拯救的角」；雨后日出，嫩草上的露；瘟疫的心跳 → 禾场上的阿们。
  const kdMix = lv => {
    const n = said('kingdavid'), storm = cl(lv('storm')), gloom = cl(lv('gloom'));
    const rainK = n === 11 ? sm(0.1, 0.5, lv('rain')) : 0;
    const elegy = cl(max(n === 0 ? 1 : 0, n === 10 ? max(0.35, lv('dkCairn')) : 0, n === 9 ? 0.5 * (1 - lv('dkUnravel')) : 0,
      n === 11 ? 0.7 * lv('dkRizpah') * (1 - rainK) : 0));
    const dark = cl(max(sm(0.1, 0.38, gloom), lv('dkPlague'), 0.6 * lv('dkCount'), n === 12 ? 0.55 * sm(0.3, 0.8, storm) : 0,
      n === 9 ? lv('dkCounsel') * (1 - lv('dkUnravel')) : 0, n === 10 ? 0.45 * (1 - lv('dkCairn')) : 0, n === 3 ? 0.4 * lv('dkMichal') : 0));
    const dance = n === 3 ? cl(max(lv('dkBless'), lv('dkName'), lv('dkTent'))) : 0;
    const house = n === 4 ? cl(max(0.55, lv('dkHouse'), lv('dkLine'), lv('dkBeam'))) : 0;
    const mercy = cl(max(n === 7 ? lv('dkBeam') : 0, rainK, n === 14 ? max(lv('dkAltar'), lv('dkFire')) : 0, n === 5 ? 0.6 * lv('dkTable') : 0));
    const rock = n === 12 ? cl(max(lv('dkBeam'), 0.5 * (1 - lv('dkDew')))) : 0;
    const dew = cl(lv('dkDew'));
    const dusk = n === 6 ? cl(0.6 + 0.4 * lv('dkCourt')) : n === 8 ? 0.6 : 0;
    const crown = cl(max(n === 1 ? 0.65 : 0, n === 2 ? 1 : 0, n === 5 ? 0.8 : 0, n === 9 ? 0.85 * lv('dkUnravel') : 0));
    const g = stack([['elegy', elegy], ['dark', dark], ['dance', dance], ['house', house], ['mercy', mercy], ['rock', rock], ['dew', dew], ['dusk', dusk], ['crown', crown]], 'crown');
    const lp = 1300 * (1 + 0.55 * g.house + 0.45 * g.dance + 0.35 * g.dew + 0.3 * g.mercy + 0.3 * g.crown + 0.25 * g.rock)
      * (1 - 0.4 * g.dark) * (1 - 0.3 * g.elegy) * (1 - 0.1 * g.dusk) * (1 - 0.2 * storm);
    return { g, lp, drone: 1 + 0.25 * g.dark + 0.15 * g.elegy + 0.15 * g.rock - 0.1 * g.dance, dlp: 1 - 0.2 * g.dark - 0.1 * g.elegy };
  };
  const KD_SC = { elegy: 'aeol', dark: 'phryg', dance: 'mixo', house: 'lyd', mercy: 'maj', rock: HORN, dew: 'maj', dusk: 'dor', crown: 'ion' };
  music('kingdavid', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      elegy: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'warm', 0.08, -0.2], ['C3', 'soft', 0.22, 0.3], ['E3', 'soft', 0.08, -0.3], ['F3', 's', 0.06, 0.35], ['B3', 's', 0.04, -0.4]],
      crown: [['A2', 's', 0.4, 0], ['A2', 'over', 0.06, 0], ['E3', 'soft', 0.28, -0.2], ['A3', 'warm', 0.08, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.08, 0.35], ['B4', 's', 0.03, -0.45]],
      dance: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.26, -0.15], ['A3', 't', 0.1, 0.25], ['Cs4', 'soft', 0.12, -0.3], ['E4', 't', 0.06, 0.35], ['G4', 's', 0.035, -0.45]], pulse: [2.1, 0.35] },
      house: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.2, 0.15], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.11, 0], ['Gs4', 'choir', 0.09, 0], ['B4', 'choir', 0.07, 0], ['Ds5', 's', 0.015, -0.5]],
      dusk: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.27, -0.2], ['G3', 'soft', 0.12, 0.3], ['B3', 'soft', 0.1, -0.3], ['D4', 's', 0.06, 0.35], ['Fs4', 's', 0.03, -0.45]],
      dark: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.32, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.22, 0.3], ['F3', 's', 0.06, -0.3]], pulse: [0.75, 0.22] },
      mercy: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['B3', 'flute', 0.1, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['Fs4', 's', 0.05, 0.4], ['A4', 's', 0.025, -0.45]],
      rock: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.28, 0.1], ['A2', 'over', 0.08, -0.1], ['E3', 'soft', 0.16, 0.25], ['B3', 's', 0.07, -0.3], ['E4', 's', 0.04, 0.4]],
      dew: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.26, -0.2], ['B3', 's', 0.12, 0.3], ['E4', 's', 0.08, -0.35], ['Fs4', 's', 0.06, 0.4], ['Cs5', 's', 0.03, -0.45], ['Gs5', 's', 0.01, 0.5]],
    } },
    mix: kdMix,
    scale: lv => (said('kingdavid') === 12 && top(kdMix(lv).g) === 'dark' ? 'mixo' : KD_SC[top(kdMix(lv).g)] || 'ion'),
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('kingdavid');
      switch (top(kdMix(lv).g)) {
        case 'elegy':
          if (n === 10 && lv('dkCairn') > 0.5) {                                         // 「我儿押沙龙啊！我儿，我儿」
            sigh(a, g * 1.1, p, [['E4', 0.7], ['D4', 0.35], ['C4', 1.1]]);
            sigh(a, g, p, [['D4', 0.5], ['C4', 0.4], ['B3', 0.45], ['A3', 1.8]], 3.2);
            return [13, 18];
          }
          if (Math.random() < 0.35) { a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.8, p); return [14, 20]; }
          a.lyre('A3', a.rint(4, 5), g * 0.85, p, 'aeol', { gap: 0.5 }); return [14, 20];   // 琴上的挽歌
        case 'dark':
          if (lv('dkPlague') > 0.3) {                                                    // 瘟疫的影子：心跳
            a.knocks([[0, 140, 58, g * 1.1, true], [0.26, 140, 52, g * 0.75, true]], { lp: 380, pan: 0, rev: 0.3 });
            return [3.2, 4.5];
          }
          if (n === 12) return [8, 12];                                                  // 暴风、雷电本身就是音乐
          a.bowed(a.pick(['A2', 'Bb2', 'C3', 'E3']), g * 0.85, p); return [12, 18];
        case 'dance':                                                                    // 在耶和华面前极力跳舞
          a.lyre('A4', a.rint(6, 8), g * 0.75, p, 'mixo', { gap: 0.14 });
          drum(a, g * 0.85, -p * 0.6, 'D.tjD.tjD.tjDttj', 0.15);
          return [5, 8];
        case 'house':
          if (lv('dkLine') > 0.4) { rise(a, g * 0.9, 'lyd', 'A3', 10, 0.32, { wave: 's', bright: 2, pan: p }); return [11, 15]; }   // 直到永远
          a.choir(['Cs4', 'E4', 'Gs4', 'B4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.7, a: 1.6, s: 1.4, r: 3, pan: -p * 0.5 });
          a.lyre('A4', 4, g * 0.7, p, 'lyd', { gap: 0.36 });
          return [12, 16];
        case 'mercy':
          if (n === 14) { amen(a, g); return [12, 16]; }                                 // 禾场上的坛：瘟疫止住了
          a.lyre('A4', a.rint(3, 5), g * 0.75, p, n === 5 ? 'ion' : 'maj', { gap: 0.38 }); return [12, 17];
        case 'rock': horn(a, g * 0.85, p, [[4, 0, 0.4], [6, 0.45, 1.5]], { type: 'warm', lp: 1300 }); return [10, 14];   // 我拯救的角
        case 'dew': a.shepherd(g * 0.9, p); return [12, 17];                             // 如日出的晨光，雨后的嫩草
        case 'dusk':
          a.pipe([['E4', 0.6], ['D4', 0.3], ['C4', 0.5], ['D4', 0.4], ['B3', 0.5], ['A3', 1.5]], { g: g * 0.45, pan: p, bright: 3, breath: 0.3, vib: 9, rev: 0.65 });
          return [15, 21];
        default:
          a.lyre(a.pick(['A3', 'A4']), a.rint(4, 6), g * 0.8, p, 'ion', { gap: 0.28 }); return [13, 19];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, n = said('kingdavid');
      if (n === 4 && max(lv('dkHouse'), lv('dkLine')) > 0.3) { a.starPing(g); return [0.5, 1.3]; }         // 众星聚成的家
      if (n === 3 && lv('dkBless') > 0.5) { a.burst({ buf: 'white', f: 7400, q: 1.4, g: g * 0.4, a: 0.002, d: 0.16, pan: a.pan(), hp: 4800, rev: 0.3 }); return [1.8, 3.5]; }
      if (lv('dkCount') > 0.5) { a.ping(a.deg('min', 'A5', a.rint(0, 5)), 0, g * 0.35, a.pan()); return [0.4, 1]; }   // 数点百姓：遍地的小光
      if (lv('dkRizFire') > 0.5) { a.pluck(a.pick(['A3', 'E3']), 0, g * 0.4, a.pan(), 0.9); return [3, 6]; }
      if (lv('dkCourt') > 0.5) { a.ping(a.pick(['A4', 'E5']), 0, g * 0.35, 0.5); return [5, 8]; }            // 远处院中的一盏灯
      if (lv('dkDew') > 0.5) { a.glass(g * 0.45, 1); return [4, 7]; }
      if (n === 14 && lv('dkFire') > 0.5) { a.pluck(a.deg('maj', 'A4', a.rint(0, 7)), 0, g * 0.4, a.pan(), 0.7); return [3, 6]; }
      return [5, 9];
    },
  });

  // ══ 列王纪下 · 亡国 ══════════════════════════════════════
  // 两国的黄昏（多利亚：C 与 D、G 的暮色），北国的灯一盏盏暗下去，乐垫也跟着暗；邱坛与大马士革的坛：Hijaz 的烟；
  // 亚述的营火围城：低处的鼓；「只剩下犹大」：一盏小灯（高处孤零零的 C# 与 E）；
  // 希西家：殿中的光（伊奥尼亚与风琴的偶次泛音）；「必保护这城」：合唱的 A6/9 罩住城；当夜的使者：深处的利底亚；
  // 病榻与眼泪：长笛的小三度——「我看见了你的眼泪」；日影往后退了十度：一串往上走回去的玻璃音；
  // 玛拿西与准绳：爱奥利亚的审判；约西亚：光回来，然后怒气仍不止息；
  // 城被焚烧：低处无字的哀歌合唱（签名：庄严、抽象）；三十七年后，巴比伦的门前，那盏小灯重新亮起。
  const exMix = lv => {
    const n = said('exile'), s = since('exile'), glory = lv('exGlory'), north = cl(lv('exNorth'));
    const angel = n === 6 ? cl(0.45 + lv('exSweep')) * sm(0.15, 0.7, lv('exAssyr')) : 0;
    const dome = n === 5 || n === 6 ? cl(max(lv('exDome'), 0.75 * lv('exLetter'))) : 0;
    const faith = cl(n === 4 ? 0.55 : n === 5 ? 0.45 : n === 6 ? 1 : n === 7 ? 0.7 : n === 8 ? max(lv('exHalo'), 0.45)
      : n === 10 ? sm(0.4, 0.75, glory) : n === 11 ? max(sm(0.85, 1.2, glory), 0.5 * lv('exCov')) : 0);
    const tears = cl(max(lv('exBed'), n === 7 ? 0.35 : 0, n === 10 ? 0.6 : 0, n === 11 && s > 18 && lv('exPass') < 0.15 ? 0.6 : 0));
    const lamp = cl(n === 3 ? 0.6 * (1 - lv('exSiege')) : n === 11 ? 0.8 * lv('exPass') : n === 12 ? 0.45 * sm(0.5, 0.25, lv('exLamp'))
      : n === 14 ? max(lv('exLamp') - 0.2, lv('exTable')) : 0);
    const idol = n === 2 || n === 9 ? cl(max(lv('exAltar') * (n === 2 ? 1 : 0), lv('exIdol'), 0.8 * sm(0.6, 1, lv('exHigh')))) : 0;
    const burn = cl(n >= 13 ? max(lv('exBurn'), lv('exBreach'), 0.8 * lv('exWalls'), 0.75 * lv('exRuin'), 0.6 * lv('exFamine')) : n === 12 ? 0.4 * lv('exBab') : 0);
    const siege = cl(max(n === 3 ? lv('exSiege') : 0, n === 4 || n === 5 ? 0.75 * lv('exAssyr') : 0, n === 9 ? 0.7 * lv('exLine') : 0,
      n >= 12 ? max(0.8 * lv('exBab'), lv('exMound')) : 0));
    const g = stack([['angel', angel], ['dome', dome], ['faith', faith], ['tears', tears], ['lamp', lamp], ['idol', idol], ['burn', burn], ['siege', siege]], 'dusk');
    const dim = n <= 3 ? 0.78 + 0.22 * north : 1;                                     // 北国的灯暗下去
    const lp = 1300 * dim * (1 + 0.6 * g.faith + 0.55 * g.dome + 0.35 * g.lamp + 0.3 * g.angel + 0.15 * g.tears)
      * (1 - 0.35 * g.siege) * (1 - 0.3 * g.burn) * (1 - 0.2 * g.idol);
    return { g, lp, drone: 1 + 0.25 * g.siege + 0.2 * g.burn + 0.2 * g.angel - 0.2 * g.lamp, dlp: 1 - 0.2 * g.siege - 0.15 * g.burn };
  };
  const EX_SC = { dusk: 'dor', siege: 'phryg', idol: 'hijaz', faith: 'ion', dome: 'maj', angel: 'lyd', tears: 'min', burn: 'aeol', lamp: LAMP };
  music('exile', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      dusk: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['C4', 'soft', 0.12, 0.3], ['D4', 's', 0.07, -0.35], ['G4', 's', 0.035, 0.45], ['B4', 's', 0.02, -0.5]],
      siege: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.32, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['D3', 'soft', 0.16, 0.3], ['F3', 's', 0.06, -0.3]], pulse: [0.7, 0.3] },
      idol: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.26, 0.1], ['A2', 'reed', 0.05, -0.2], ['Cs3', 'soft', 0.16, 0.3], ['G3', 's', 0.05, -0.3], ['Bb3', 's', 0.045, 0.4]],
      faith: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.2], ['A3', 'over', 0.06, 0.1], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.08, 0.35], ['A4', 's', 0.04, -0.45]],
      dome: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.17, 0], ['E4', 'choir', 0.13, 0], ['Fs4', 'choir', 0.1, 0], ['B4', 'choir', 0.06, 0]],
      angel: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.28, 0.1], ['B2', 'soft', 0.1, -0.25], ['E3', 's', 0.12, 0.25], ['Ds4', 's', 0.04, 0.35], ['Gs4', 's', 0.035, -0.4], ['B4', 's', 0.02, 0.45]],
      tears: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.08, 0.2], ['C4', 'flute', 0.12, 0.3], ['E4', 's', 0.06, -0.35], ['B4', 's', 0.03, 0.45]],
      burn: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.28, 0.1], ['C3', 'choir', 0.13, 0], ['E3', 'choir', 0.11, 0], ['A3', 'choir', 0.08, 0], ['F3', 's', 0.04, -0.35]],
      lamp: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.28, 0.1], ['E3', 'soft', 0.12, -0.2], ['A3', 's', 0.05, 0.2], ['Cs5', 's', 0.03, -0.4], ['E5', 's', 0.02, 0.45], ['A5', 's', 0.01, 0]],
    } },
    mix: exMix,
    scale: lv => EX_SC[top(exMix(lv).g)] || 'dor',
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('exile');
      switch (top(exMix(lv).g)) {
        case 'siege':
          if (Math.random() < 0.55) { toms(a, g * 1.1, p, [[0, 1.3], [0.75, 1], [1.5, 1.25], [2.62, 1.1]]); return [10, 14]; }
          a.bowed(a.pick(['A2', 'Bb2', 'D3']), g * 0.85, p); return [12, 17];
        case 'idol': a.oud(g * 0.7, p); return [12, 18];                                 // 照列国的样式
        case 'faith':
          if (n === 8 && lv('exHalo') > 0.4) { rise(a, g * 0.85, 'lyd', 'A4', 10, 0.12, { wave: 's', bright: 2, d: 2.2, pan: p }); return [9, 13]; }   // 日影往后退了十度
          a.lyre('A4', a.rint(4, 5), g * 0.85, p, 'ion', { gap: 0.3 }); return [12, 17];
        case 'dome':                                                                     // 必保护拯救这城
          a.choir(['A3', 'E4', 'Fs4', 'B4'], { gs: [1, 0.8, 0.7, 0.45], g: g * 0.8, a: 1.8, s: 1.8, r: 3.5, pan: 0 });
          a.glass(g * 0.4, 1);
          return [12, 16];
        case 'angel':                                                                    // 使者走过亚述营
          cascade(a, g * 0.8, 'lyd', 'A5', 9, 8, 0.2, { pan: a.rnd(-0.4, 0.4), d: 2.4 });
          a.bowed('A2', g * 0.55, -p);
          return [9, 13];
        case 'tears':
          if (n === 7) {                                                                 // 转脸朝墙的祷告，然后应允
            sigh(a, g, p, [['E4', 0.6], ['D4', 0.4], ['C4', 1]]);
            a.strings([['A3', 3.2, g * 0.7], ['Cs4', 3.6, g * 0.7], ['E4', 4, g * 0.75], ['A4', 4.4, g * 0.85, 3.4]], { bright: 4, d: 2.6, pan: -p, spread: 0.2, rev: 0.7 });
            return [13, 18];
          }
          if (Math.random() < 0.5) { a.ney(g, p); return [14, 20]; }
          a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.8, p); return [14, 20];
        case 'lamp':                                                                     // 大卫的灯
          a.ping('A5', 0, g * 0.45, p);
          a.lyre('A4', 3, g * 0.65, -p, LAMP, { gap: 0.6 });
          return [14, 20];
        case 'burn':                                                                     // 城被焚烧：无字的哀歌
          if (Math.random() < 0.65) {
            a.choir(['A3', 'C4', 'E4'], { gs: [1, 0.8, 0.6], g: g * 0.7, a: 2, s: 1.4, r: 2.5, pan: -0.2 });
            a.choir(['G3', 'B3', 'E4'], { gs: [1, 0.8, 0.6], g: g * 0.6, a: 1.8, s: 1.2, r: 2.5, at: 3.2, pan: 0.2 });
            a.choir(['A3', 'C4', 'E4'], { gs: [1, 0.8, 0.6], g: g * 0.65, a: 2, s: 1.8, r: 4, at: 6.2, pan: 0 });
            return [16, 22];
          }
          a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [13, 18];
        default:
          a.ney(g * 0.9, p); return [15, 22];                                            // 两国的黄昏
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, n = said('exile'), sw = lv('exSweep');
      if (sw > 0.02 && sw < 0.98) { a.ping(a.deg('lyd', 'A4', a.rint(0, 5) - Math.floor(sw * 6)), 0, g * 0.4, a.rnd(-0.8, 0.2)); return [0.6, 1.3]; }   // 营火一处一处熄灭
      if (n <= 3 && lv('exNorth') > 0.05 && lv('exNorth') < 0.95) { a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.3, a.rnd(0, 0.8)); return [3, 6]; }
      if (lv('exPass') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.45, a.pan()); return [1, 2.2]; }   // 家家有灯
      if (lv('exHalo') > 0.4) { a.glass(g * 0.45, 1); return [3, 5]; }
      if (lv('exGold') > 0.4) { a.pluck(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.35, a.pan(), 0.4); return [1.5, 3]; }
      if (max(lv('exSiege'), lv('exBab')) > 0.4 && a.night() > 0.5) { a.pluck(a.pick(['A2', 'E3', 'Bb2']), 0, g * 0.4, a.pan(), 0.9); return [4, 7]; }
      if (n === 14 && lv('exLamp') > 0.6) { a.glass(g * 0.4, 1); return [6, 10]; }
      return [5, 9];
    },
  });

  // ══ 约伯记 · 约伯 ════════════════════════════════════════
  // 乌斯地的清晨（A6 与竖琴的弦：一切所有的）；天上的会：高处的合唱，其中一道冷的 Bb 影；
  // 四个报信的：低处急促的脉动与增四度的风；「赏赐的是耶和华」：空的五度里一点点温暖；
  // 炉灰与七天七夜的静默：只剩空的五度，乐垫收下来，一块小石一声；「我知道我的救赎主活着」：长笛的 A 大九慢慢亮起；
  // 旋风：五度一层层叠起、缓缓旋转（A E B F# C#，带一丝低吼）；立地的根基、晨星一同歌唱：合唱与利底亚的星；
  // 海水冲出又被关住：深处起伏的波；昴星与参星；大鹰上腾；河马、鳄鱼；「现在亲眼看见你」；
  // 末了：比先前更多——最暖的 A 大，风琴的光，三个女儿三声铃。
  const ybMix = lv => {
    const n = said('job'), storm = cl(lv('storm'));
    const loss = n === 2 ? cl(max(0.5, lv('ybEmbers'), lv('ybFall'), lv('gale'))) : 0;
    const council = n <= 4 ? 0.75 * cl(max(lv('ybCouncil'), 0.6 * lv('ybRegard'))) : 0;
    const bless = cl(lv('ybBless'));
    const hope = cl(max(n === 3 ? 0.35 : 0, 0.25 * lv('ybFire') * (n === 6 ? 1 : 0), 0.6 * lv('ybSprout'), 0.8 * lv('ybCarve'), lv('ybStand'), 0.8 * lv('ybGold'), lv('ybSeen')));
    const sea = cl(max(lv('ybSurge'), 0.8 * lv('ybSwaddle'), 0.8 * lv('ybBound'), lv('ybFlood'), 0.9 * lv('ybLeviA')));
    const creation = cl(max(0.6 * lv('ybVeins'), 0.8 * lv('ybNorth'), lv('ybFound'), lv('ybMorning'), lv('ybJoy'), lv('ybCons') * (n === 10 ? 1 : 0.4), n === 11 ? 0.7 : 0));
    const whirl = cl(n === 8 || n === 12 ? lv('ybWhirl') : 0.45 * lv('ybWhirl')) * (n === 12 ? 1 : 1);
    const whirlW = cl(max(whirl, 0.7 * sm(0.3, 0.7, storm) * (n >= 7 ? 1 : 0)));
    const uz = n <= 1 ? 1 : 0;
    const g = stack([['loss', loss], ['council', council], ['bless', bless], ['hope', hope], ['sea', sea], ['creation', creation], ['whirl', whirlW], ['uz', uz]], 'ash');
    const lp = 1300 * (1 + 0.8 * g.creation + 0.5 * g.bless + 0.4 * g.hope + 0.35 * g.council + 0.2 * g.uz)
      * (1 - (n === 5 ? 0.45 : 0.25) * g.ash) * (1 - 0.35 * g.loss) * (1 - 0.3 * g.whirl) * (1 - 0.25 * g.sea) * (1 - 0.2 * storm);
    return { g, lp, pad: n === 5 ? 0.78 : 1, drone: 1 + 0.35 * g.whirl + 0.2 * g.loss + 0.15 * g.sea - 0.15 * g.bless,
      dlp: 1 - 0.2 * g.ash + 0.1 * g.creation };
  };
  const YB_SC = { uz: 'maj', council: 'lyd', loss: 'phryg', ash: 'sus', hope: 'maj', whirl: 'dor', creation: 'lyd', sea: 'mixo', bless: 'ion' };
  music('job', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      uz: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['A3', 'harp', 0.06, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.07, 0.35], ['Fs4', 's', 0.04, -0.45]],
      council: [['A2', 's', 0.38, 0], ['E3', 's', 0.16, 0.15], ['Bb2', 'soft', 0.05, -0.4], ['E4', 'choir', 0.14, 0], ['A4', 'choir', 0.11, 0], ['B4', 'choir', 0.08, 0], ['E5', 's', 0.02, 0.45]],
      loss: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.2, -0.3], ['Ds3', 's', 0.04, 0.35], ['F3', 's', 0.05, -0.35]], pulse: [1.25, 0.3] },
      ash: [['A1', 's', 0.48, 0], ['E2', 's', 0.3, 0.1], ['A2', 'soft', 0.12, -0.2], ['E3', 's', 0.06, 0.25]],
      hope: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.27, -0.2], ['B3', 'soft', 0.12, 0.3], ['Cs4', 'flute', 0.12, -0.3], ['E4', 's', 0.06, 0.35], ['Gs4', 's', 0.03, -0.45]],
      whirl: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.28, 0.1], ['E2', 'grit', 0.04, -0.1], ['B2', 'soft', 0.12, -0.25], ['Fs3', 'soft', 0.08, 0.3], ['Cs4', 's', 0.04, -0.35]], pulse: [0.33, 0.35] },
      creation: [['A1', 's', 0.26, 0], ['A2', 's', 0.22, 0], ['E3', 'soft', 0.2, -0.15], ['A3', 'choir', 0.12, 0], ['E4', 'choir', 0.1, 0], ['B4', 'choir', 0.06, 0], ['Cs5', 'choir', 0.05, 0], ['Gs5', 's', 0.01, 0.5]],
      sea: { v: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.3, 0.1], ['D3', 'soft', 0.14, -0.3], ['E3', 's', 0.1, 0.3], ['B3', 's', 0.05, -0.4]], pulse: [0.17, 0.35] },
      bless: [['A2', 's', 0.38, 0], ['A2', 'over', 0.05, 0], ['E3', 'soft', 0.26, -0.2], ['A3', 'soft', 0.13, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.09, 0.35], ['A4', 's', 0.045, -0.45], ['Cs5', 's', 0.025, 0.5]],
    } },
    mix: ybMix,
    scale: lv => YB_SC[top(ybMix(lv).g)] || 'sus',
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('job');
      switch (top(ybMix(lv).g)) {
        case 'uz':
          if (Math.random() < 0.5) { a.shepherd(g * 0.9, p); return [13, 19]; }         // 山上的羊群
          a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'maj', { gap: 0.3 }); return [13, 19];
        case 'council':                                                                  // 天上的一圈光，其中一个冷的影
          a.choir(['E4', 'A4', 'B4'], { gs: [1, 0.8, 0.6], g: g * 0.7, a: 1.4, s: 1, r: 2.6, pan: -p * 0.5 });
          if (Math.random() < 0.6) a.note({ f: 'Bb2', type: 'warm', lp: 600, g: g * 0.55, a: 1.5, s: 1.2, r: 2.5, at: 2.2, pan: p, rev: 0.6 });
          return [12, 17];
        case 'loss': a.bowed(a.pick(['A2', 'C3', 'Ds3']), g * 0.8, p); return [9, 13];
        case 'hope':
          if (lv('ybSeen') > 0.4) {                                                      // 现在亲眼看见你
            a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.7, a: 1.6, s: 1.6, r: 3.2, pan: 0 });
            a.lyre('A4', 4, g * 0.7, p, 'maj', { gap: 0.42 });
            return [13, 17];
          }
          if (lv('ybGold') > 0.4) { a.glass(g * 0.55, 2); a.lyre('A4', 4, g * 0.7, p, 'ion'); return [11, 15]; }   // 如精金
          if (n === 3) { a.lyre('A3', 3, g * 0.7, p, 'sus', { gap: 0.6 }); a.strings([['Cs4', 2.4, g * 0.6], ['E4', 2.9, g * 0.7, 3.4]], { bright: 4, d: 2.6, pan: -p, spread: 0.1, rev: 0.7 }); return [15, 21]; }
          rise(a, g * 0.85, 'maj', 'A3', 5, 0.45, { pan: p });                          // 我知道我的救赎主活着
          return [12, 16];
        case 'whirl':
          if (Math.random() < 0.3) { a.bowed(a.pick(['A2', 'E2', 'B2']), g * 0.7, p); return [10, 14]; }
          return [8, 12];                                                                // 旋风中的言语本身就是音乐
        case 'creation':
          if (n === 8 && max(lv('ybMorning'), lv('ybJoy')) > 0.4) {                     // 晨星一同歌唱，神的众子都欢呼
            a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.55, 0.4], g: g * 0.8, a: 0.8, s: 1.6, r: 3, pan: 0 });
            a.bells(['A5', 'Cs6', 'E6', 'Gs6'], 0.22, g * 0.55, 2.6, 0.5);
            return [10, 14];
          }
          if (n === 11) {                                                                // 大鹰上腾
            a.pipe([['E4', 0.4], ['A4', 0.4], ['B4', 0.35], ['E5', 0.5], ['Fs5', 0.35], ['E5', 1.8]], { g: g * 0.45, pan: p, bend: true, bright: 4, breath: 0.25, vib: 10, rev: 0.75 });
            return [13, 18];
          }
          if (n === 8 && lv('ybFound') > 0.4) { a.note({ f: 'A2', type: 'warm', lp: 800, g: g * 0.7, a: 0.8, s: 1.6, r: 2.5, pan: -p * 0.5 }); a.lyre('A3', 4, g * 0.8, p, 'ion', { gap: 0.5 }); return [11, 15]; }   // 准绳
          a.lyre('A4', a.rint(4, 6), g * 0.75, p, 'lyd', { gap: 0.3 }); return [12, 16];
        case 'sea':
          if (lv('ybLeviA') > 0.4) { a.bowed('A2', g * 0.7, p); cascade(a, g * 0.7, 'mixo', 'A5', 7, 6, 0.18, { pan: -p, at: 1.5 }); return [11, 15]; }   // 行过的路随后发光
          cascade(a, g * 0.8, 'mixo', 'A4', 7, 7, 0.22, { wave: 'harp', bright: 3, d: 2.2, pan: p }); return [9, 13];   // 狂傲的浪
        case 'bless':                                                                    // 比先前更多：三个女儿
          a.lyre('A4', a.rint(5, 6), g * 0.8, p, 'ion', { gap: 0.22 });
          if (Math.random() < 0.5) a.bells(['A5', 'Cs6', 'E6'], 0.42, g * 0.5, 2.6, 1.6);
          return [10, 14];
        default:                                                                         // 炉灰：几乎无声
          if (n === 5) { a.pluck(a.pick(['A2', 'E2']), 0, g * 0.6, a.rnd(-0.3, 0.3), 1.2); return [9, 13]; }   // 七块小石，一块一声
          if (n === 3) { a.lyre('A3', 3, g * 0.65, p, 'sus', { gap: 0.6 }); return [16, 22]; }
          if (Math.random() < 0.5) { a.bowed(a.pick(['A2', 'E2']), g * 0.65, p); return [16, 24]; }
          a.ney(g * 0.8, p); return [16, 24];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('ybCouncil') > 0.4) { a.glass(g * 0.45, 1); return [3, 6]; }
      if (lv('ybSparks') > 0.5) { a.ping(a.deg('maj', 'A4', a.rint(3, 8)), 0, g * 0.4, a.pan()); return [0.8, 2]; }   // 火星飞腾
      if (lv('ybVeins') > 0.4) { a.starPing(g * 0.9); return [0.5, 1.4]; }
      if (max(lv('ybMorning'), lv('ybJoy')) > 0.4) { a.starPing(g); return [0.3, 0.9]; }
      if (lv('ybCons') > 0.5) { a.starPing(g * 0.9); return [0.6, 1.6]; }
      if (lv('ybLeviA') > 0.4) { a.glass(g * 0.4, 1); return [2.5, 5]; }
      if (lv('ybBless') > 0.5) { a.glass(g * 0.4, 1); return [4, 8]; }
      return [5, 9];
    },
  });

  // ══ 雅歌 · 雅歌 ══════════════════════════════════════════
  // 冬天与细雨：多利亚的思念（人声般的哼鸣、苇笛）；羚羊（良人）蹿山越岭：利底亚、跳进的弦；
  // 「冬天已往」：A6 的花开满地（斑鸠、牧笛、花瓣的轻鸣）——此后春天就是底色；关锁的园、封闭的泉：伊奥尼亚的 A 大九，
  // 泉水慢慢涌动；夜里寻他不见、「求你给我开门」、月下的黎巴嫩：爱奥利亚；所罗门的轿、玛哈念的跳舞：混合利底亚的手鼓；
  // 「爱情，众水不能息灭」：低处温暖的 A 大与弓弦，暴风雨里合唱照旧唱着（大调六声，没有导音）；末了香草山上的晨光，笛与笛的应答。
  const sgMix = lv => {
    const n = said('song'), rain = cl(lv('rain'));
    const flame = n === 11 ? cl(max(lv('sgSeal'), lv('sgFlame'), lv('sgWaves'))) : 0;
    const night = cl(max(n === 2 ? 0.5 * lv('sgLamp') : 0, n === 6 ? lv('sgLamp') * (1 - lv('sgLitter')) : 0, n === 9 ? max(lv('sgLamp'), lv('sgLeb')) : 0));
    const procession = cl(max(lv('sgLitter'), 0.8 * lv('sgSmoke'), n === 10 ? max(lv('sgRays'), 0.6) : 0));
    const garden = n === 7 || n === 8 ? cl(max(lv('sgWall'), lv('sgSpring'), 0.8 * lv('sgStream'), lv('sgGlow'), lv('sgFrag'), lv('sgGate'))) : 0;
    const gazelle = cl(max(n === 3 ? max(0.9 * lv('sgGz'), lv('sgWin')) * (1 - 0.6 * sm(0.2, 0.3, lv('sgDoor') < 0.5 && lv('sgWin') < 0.5 ? 1 : 0)) : 0,
      n === 12 ? max(0.6, lv('sgSpice')) : 0, n === 5 ? 0.35 : 0));
    const spring = n < 4 ? cl(max(n === 1 ? 0.35 : 0, n === 2 ? 0.5 * lv('sgLily1') : 0)) : 0;
    const g = stack([['flame', flame], ['night', night], ['procession', procession], ['garden', garden], ['gazelle', gazelle], ['spring', spring]], n < 4 ? 'longing' : 'spring');
    const lp = 1400 * (1 + 0.6 * g.spring + 0.5 * g.gazelle + 0.4 * g.garden + 0.35 * g.procession + 0.2 * g.flame)
      * (1 - 0.35 * g.night) * (1 - 0.2 * g.longing * cl(rain / 0.3)) * (1 - 0.15 * cl(lv('storm')));
    return { g, lp, drone: 1 + 0.25 * g.flame + 0.1 * g.night - 0.15 * g.spring, dlp: 1 - 0.15 * g.night };
  };
  const SG_SC = { longing: 'dor', gazelle: 'lyd', spring: 'maj', garden: 'ion', night: 'aeol', procession: 'mixo', flame: HYMN };
  music('song', {
    weight: { drone: 0.5, pad: 0.95 },
    pad: { lp: 1400, groups: {
      longing: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['C4', 'voice', 0.09, 0.3], ['D4', 'soft', 0.09, -0.3], ['G4', 's', 0.04, 0.4], ['B4', 's', 0.02, -0.45]],
      gazelle: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.26, -0.15], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['Ds4', 's', 0.05, 0.35], ['Gs4', 's', 0.04, -0.4], ['Fs5', 's', 0.012, 0.5]],
      spring: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.15, 0.3], ['E4', 'flute', 0.08, -0.3], ['Fs4', 's', 0.06, 0.4], ['A4', 's', 0.04, -0.45], ['Cs5', 's', 0.02, 0.5]],
      garden: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.26, -0.2], ['Gs3', 'soft', 0.09, 0.3], ['B3', 's', 0.1, -0.3], ['Cs4', 'voice', 0.1, 0.2], ['E4', 's', 0.06, -0.4]], pulse: [0.22, 0.2] },
      night: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.28, 0.1], ['A2', 'soft', 0.1, -0.2], ['C3', 'soft', 0.18, 0.3], ['G3', 's', 0.06, -0.3], ['D4', 's', 0.04, 0.4]],
      procession: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.26, -0.15], ['A3', 't', 0.1, 0.25], ['D4', 'soft', 0.1, -0.3], ['E4', 's', 0.06, 0.35], ['G4', 's', 0.035, -0.4]], pulse: [1.6, 0.3] },
      flame: { v: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.28, 0.1], ['A2', 'warm', 0.1, -0.2], ['Cs3', 'soft', 0.16, 0.3], ['E3', 'soft', 0.1, -0.3], ['B3', 's', 0.05, 0.35], ['Gs4', 's', 0.025, -0.4]], pulse: [0.3, 0.25] },
    } },
    mix: sgMix,
    scale: lv => SG_SC[top(sgMix(lv).g)] || 'maj',
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('song');
      switch (top(sgMix(lv).g)) {
        case 'longing':                                                                  // 书拉密女的歌：多利亚的笛
          if (Math.random() < 0.55) {
            a.pipe([['A4', 0.5], ['G4', 0.3], ['E4', 0.6], ['D4', 0.4], ['E4', 0.35], ['Fs4', 0.3], ['E4', 0.45], ['D4', 0.4], ['E4', 1.6]], { g: g * 0.46, pan: p, bright: 4, breath: 0.3, vib: 11, rev: 0.65 });
            return [14, 20];
          }
          a.ney(g * 0.9, p); return [14, 20];
        case 'gazelle': {                                                                // 他蹿山越岭而来
          const ns = [], jumps = [0, 4, 1, 5, 2, 6, 4];
          for (let k = 0; k < jumps.length; k++) ns.push([a.deg('lyd', 'A4', jumps[k]), k * 0.13, g * (0.65 + 0.05 * k), k === jumps.length - 1 ? 2.8 : 1.4]);
          a.strings(ns, { bright: 5, d: 1.6, pan: p, spread: 0.3, rev: 0.6 });
          return [8, 12];
        }
        case 'spring':
          if (n === 5 && Math.random() < 0.4) { a.pipe([['Cs5', 0.25], ['A4', 0.55], ['Cs5', 0.25], ['A4', 0.8]], { g: g * 0.4, pan: p, bright: 3, breath: 0.35, vib: 6, rev: 0.6 }); return [10, 14]; }   // 磐石穴中的鸽子
          if (Math.random() < 0.5) { a.shepherd(g * 0.9, p); return [11, 16]; }         // 斑鸠的声音在我们境内也听见了
          a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.26 }); return [11, 16];
        case 'garden':                                                                   // 园中的泉，活水的井
          cascade(a, g * 0.85, 'ion', 'A5', 7, 6, 0.12, { pan: p });
          if (Math.random() < 0.5) a.pipe([['E4', 0.5], ['Gs4', 0.4], ['B4', 0.6], ['A4', 1.5]], { g: g * 0.4, at: 1.8, pan: -p, bright: 3, breath: 0.2, vib: 8, rev: 0.65 });
          return [9, 13];
        case 'night':
          if (n === 9 && lv('sgDoor') > 0.5) { sigh(a, g, p, [['E4', 0.5], ['A4', 0.8], ['G4', 0.4], ['E4', 1.3]]); return [10, 14]; }   // 求你给我开门
          a.ney(g, p); return [13, 19];                                                  // 我寻找他，却寻不见
        case 'procession':                                                               // 所罗门的轿 · 玛哈念的跳舞
          a.lyre('A4', a.rint(5, 7), g * 0.7, p, 'mixo', { gap: n === 10 ? 0.15 : 0.2 });
          drum(a, g * 0.75, -p * 0.6, n === 10 ? 'D.tjDttjD.tjD.tt' : 'D...t...D...t.t.', n === 10 ? 0.15 : 0.2);
          return [6, 9];
        case 'flame':                                                                    // 爱情如死之坚强，众水不能息灭
          a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.8, a: 1.4, s: 2, r: 3, pan: 0 });
          if (Math.random() < 0.6) a.bowed('A2', g * 0.7, p);
          return [10, 14];
        default: return [10, 14];
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, n = said('song');
      if (n === 12 && lv('sgSpice') > 0.5 && Math.random() < 0.5) {                    // 求你使我也得听见：笛与笛的应答
        const ph = [['E5', 0.35], ['Cs5', 0.3], ['E5', 0.3], ['A4', 1.2]];
        a.pipe(ph, { g: g * 0.35, pan: -0.5, bright: 4, breath: 0.25, vib: 9, rev: 0.7 });
        a.pipe(ph, { g: g * 0.22, at: 2.6, pan: 0.55, bright: 3, breath: 0.3, vib: 9, rev: 0.8 });
        return [9, 14];
      }
      if (lv('sgFrag') > 0.5) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.35, a.pan()); return [0.8, 1.8]; }   // 香气飘散
      if (n === 7 && max(lv('sgSpring'), lv('sgStream')) > 0.5) { a.glass(g * 0.4, 1); return [2.5, 5]; }
      if (max(lv('sgGrape'), lv('sgPomFr')) > 0.5 && n >= 7) { a.pluck(a.deg('maj', 'A4', a.rint(0, 6)), 0, g * 0.4, a.pan(), 0.6); return [3, 6]; }
      if (n >= 4 && lv('sgBlos') > 0.5) { a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.35, a.pan()); return [2, 4.5]; }   // 花开
      if (lv('sgLamp') > 0.5) { a.pluck(a.pick(['A3', 'E4', 'C4']), 0, g * 0.35, a.pan(), 0.8); return [4, 8]; }
      return [5, 9];
    },
  });

  // ══ 小先知书 · 慈绳爱索（何西阿书 — 弥迦书）═════════════
  // 何西阿的家：多利亚的思念（A 小六九）；「你是我的民」「慈绳爱索」「我岂能不爱惜」：人声般哼鸣的 A 大、摇篮曲般的笛；
  // 邱坛的火、地上的光变冷、狮子吼叫、众山消化如蜡：弗里几亚的冷；所种的是风：暴风的起伏；
  // 约珥的蝗虫：低处嗡嗡的急颤（6Hz 的脉动）；灵浇灌凡有血气的：合唱与利底亚的光；
  // 阿摩司：「惟愿公平如大水滚滚」——低处滚动的混合利底亚与一波一波下行的弦；准绳：一声一声的铃；
  // 耕种的接续收割的、刀打成犁头（铁砧）、各人坐在自己的葡萄树下：伊奥尼亚的丰足；
  // 约拿：海中的大风（深处的起伏）→ 鱼腹中：低通合上，深处的祷告 → 尼尼微的灰与暖光；
  // 末了：罪投于深海——闪着光的 A 大九，缓缓起伏。
  const taMix = lv => {
    const n = said('twelve1'), storm = cl(lv('storm')), gale = cl(lv('gale'));
    const deep = n === 11 ? cl(max(lv('taDeep'), 0.6 * lv('taFish') * (1 - lv('taSpit')))) : 0;
    const stormW = cl(max(sm(0.35, 0.8, storm), n === 3 ? 0.8 * sm(0.3, 0.7, gale) : 0));
    const swarm = n === 5 ? cl(lv('taSwarm') * (1 - 0.6 * sm(0.5, 1, lv('taSwarmX')))) : 0;
    const sea = cl(max(deep, n === 4 ? max(lv('taDew'), 0.8 * lv('taLily')) : 0, n === 14 ? max(lv('taSea'), 0.8 * sm(0.3, 1, lv('taSins'))) : 0));
    const spirit = cl(max(lv('taSpirit'), 0.7 * lv('taFountA'), n === 9 ? 0.8 * lv('taCrown') : 0, n === 13 ? 0.7 * lv('taStream') * (1 - sm(0.2, 1, lv('taShares'))) : 0));
    const cords = cl(max(lv('taDoor'), n === 1 ? 1 - lv('taLo') : 0, n === 2 ? 0.5 * sm(0.3, 0.1, lv('taFire')) : 0, n === 3 ? lv('taCords') : 0,
      n === 4 ? 0.8 * lv('taCords') : 0, n === 12 ? max(lv('taLove'), 0.5 * lv('taGourd') * (1 - lv('taWither'))) : 0,
      n === 13 ? 0.6 * lv('taFold') * (1 - lv('taZionPlow')) : 0, n === 14 ? max(lv('taBeth'), 0.8 * lv('taWalk')) : 0));
    const idol = cl(max(n <= 2 ? sm(0.6, 1, lv('taFire')) : 0, n === 2 ? lv('taCool') : 0, lv('taFireA'), n === 8 ? 0.5 * lv('taFeast') : 0,
      n === 9 ? 0.7 * lv('taNest') : 0, n === 12 ? 0.6 * lv('taHeat') : 0, 0.9 * lv('taMelt'), 0.5 * lv('taZionPlow')));
    const justice = cl(max(lv('taRiverA'), n === 7 ? 0.8 * sm(0, 1, lv('taRiver')) : 0, n === 8 ? 0.8 * max(lv('taPlumb'), lv('taTilt')) : 0,
      n === 13 ? lv('taForge') * (1 - 0.7 * lv('taVine')) : 0));
    const harvest = cl(max(n === 3 ? 0.6 * lv('taPlow') : 0, n === 6 ? 0.6 * lv('taWine') : 0, n === 8 ? max(lv('taGold'), 0.7 * lv('taWine')) : 0,
      n === 12 ? lv('taRelent') : 0, n === 13 ? max(lv('taVine'), 0.8 * sm(0, 1, lv('taShares'))) : 0, n === 11 ? 0.4 * lv('taSpit') : 0));
    const g = stack([['storm', stormW], ['swarm', swarm], ['sea', sea], ['spirit', spirit], ['cords', cords], ['idol', idol], ['justice', justice], ['harvest', harvest]], 'hosea');
    const lp = 1300 * (1 + 0.7 * g.spirit + 0.4 * g.cords + 0.35 * g.harvest + 0.35 * g.sea * (1 - deep) + 0.2 * g.justice)
      * (1 - 0.35 * g.idol) * (1 - 0.3 * g.swarm) * (1 - 0.35 * g.storm) * (1 - 0.55 * deep) * (1 - 0.2 * storm);
    return { g, lp, drone: 1 + 0.25 * g.storm + 0.2 * g.swarm + 0.2 * g.justice + 0.2 * deep, dlp: 1 - 0.25 * deep - 0.15 * g.idol };
  };
  const TA_SC = { hosea: 'dor', cords: 'maj', idol: 'phryg', swarm: 'phryg', spirit: 'lyd', justice: 'mixo', storm: 'aeol', harvest: 'ion', sea: 'maj' };
  music('twelve1', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      hosea: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.3, -0.2], ['A3', 'soft', 0.07, 0.2], ['C4', 'soft', 0.13, 0.3], ['Fs4', 's', 0.05, -0.35], ['B4', 's', 0.03, 0.45]],
      cords: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.15], ['Cs4', 'voice', 0.12, 0.3], ['E4', 's', 0.07, -0.35], ['Fs4', 'flute', 0.06, 0.4], ['A4', 's', 0.03, -0.45]],
      idol: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'reed', 0.04, 0.2], ['Bb2', 'soft', 0.07, -0.35], ['D3', 'soft', 0.14, 0.3], ['G3', 's', 0.05, -0.3]],
      swarm: { v: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'soft', 0.07, -0.35], ['C3', 'soft', 0.2, 0.3], ['E3', 't', 0.05, 0.4], ['F3', 's', 0.06, -0.3]], pulse: [6.2, 0.35] },
      spirit: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.13, 0], ['E4', 'choir', 0.11, 0], ['B4', 'choir', 0.07, 0], ['Ds5', 's', 0.012, 0.45], ['E5', 's', 0.02, -0.5]],
      justice: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'warm', 0.08, -0.2], ['D3', 'soft', 0.14, 0.3], ['E3', 'soft', 0.12, -0.3], ['G3', 's', 0.05, 0.35]], pulse: [0.42, 0.28] },
      storm: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.32, 0.1], ['B2', 'soft', 0.1, -0.3], ['C3', 'soft', 0.16, 0.3], ['F3', 's', 0.05, -0.35]], pulse: [0.2, 0.35] },
      harvest: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['A3', 'soft', 0.13, 0.25], ['A3', 'harp', 0.04, 0.1], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.08, 0.35], ['B4', 's', 0.03, -0.45]],
      sea: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.27, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['Gs4', 's', 0.05, 0.4], ['E5', 's', 0.02, -0.45]], pulse: [0.14, 0.22] },
    } },
    mix: taMix,
    scale: lv => (said('twelve1') === 11 && lv('taDeep') > 0.5 ? 'sus' : TA_SC[top(taMix(lv).g)] || 'dor'),
    motif(t, g, a) {
      const lv = a.lv, p = a.pan(), n = said('twelve1');
      switch (top(taMix(lv).g)) {
        case 'storm': case 'swarm': return [8, 12];                                      // 大风、蝗虫本身就是音乐
        case 'sea':
          if (n === 11) { a.bowed(a.pick(['A2', 'E2']), g * 0.7, p); a.ping('E5', 2.2, g * 0.35, -p); return [12, 16]; }   // 从阴间的深处呼求
          if (n === 14) { cascade(a, g * 0.85, 'maj', 'A5', 9, 9, 0.16, { pan: p, d: 2.4 }); return [9, 13]; }   // 投于深海
          a.glass(g * 0.55, 2); a.lyre('A4', 3, g * 0.6, p, 'maj', { gap: 0.4 }); return [10, 14];                  // 我必向以色列如甘露
        case 'spirit':
          if (n === 9) { a.lyre('A3', a.rint(5, 6), g * 0.8, p, 'ion', { gap: 0.26 }); return [11, 15]; }         // 国度就归耶和华了
          a.angelRun(g * 0.75);
          a.choir(['A3', 'Cs4', 'E4', 'B4'], { gs: [1, 0.8, 0.7, 0.45], g: g * 0.65, a: 1.2, s: 1.2, r: 2.6, at: 0.6, pan: -p * 0.5 });
          return [9, 13];
        case 'cords':
          if (n === 3 || n === 14 || Math.random() < 0.35) { lullaby(a, g, p); return [12, 17]; }                // 我原教导以法莲行走
          a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.4 }); return [12, 17];
        case 'idol':
          if (n <= 2) { a.oud(g * 0.7, p); return [12, 18]; }                            // 随从巴力
          a.bowed(a.pick(['A2', 'Bb2', 'D3']), g * 0.85, p); return [12, 18];
        case 'justice':
          if (n === 13) { anvil(a, g * 0.8, p, 3); return [6, 9]; }                      // 刀打成犁头
          if (n === 8) { a.ping('A4', 0, g * 0.5, p); a.ping('A4', 1.4, g * 0.4, p); a.ping('A4', 2.8, g * 0.3, p); return [10, 14]; }   // 准绳
          [0, 2.2, 4.4].forEach((at, i) => cascade(a, g * (0.75 - 0.08 * i), 'mixo', 'A4', 7 + i, 7, 0.14, { wave: 'harp', bright: 3, d: 2, pan: p, at }));   // 滚滚的江河
          return [9, 13];
        case 'harvest':
          if (Math.random() < 0.5) { a.shepherd(g * 0.9, p); return [12, 17]; }
          a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'ion', { gap: 0.26 }); return [12, 17];
        default:
          if (n === 5) { a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.8, p); return [13, 18]; }   // 撕裂心肠
          a.ney(g * 0.95, p); return [15, 22];                                                 // 领她到旷野
      }
    },
    motif2(t, g, a) {
      const lv = a.lv, n = said('twelve1');
      if (lv('taSpirit') > 0.5) { a.ping(a.deg('lyd', 'A6', -a.rint(0, 6)), 0, g * 0.4, a.pan()); return [0.8, 2]; }   // 浇灌
      if (max(lv('taDew'), lv('taLily')) > 0.5 && n === 4) { a.glass(g * 0.4, 1); return [3, 6]; }
      if (lv('taFires') > 0.02 && lv('taFires') < 0.98) { a.pluck(a.pick(['A2', 'Bb2', 'E3']), 0, g * 0.45, a.pan(), 0.9); return [1.5, 3]; }   // 列国宫殿的火
      if (lv('taNest') > 0.4) { a.starPing(g * 0.9); return [0.6, 1.5]; }                  // 在星宿之间搭窝
      if (n === 3 && lv('taCords') > 0.6) { a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.4, a.pan()); return [2, 4]; }   // 金色的绳索
      if (lv('taNinLamp') > 0.6 && n === 12) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.4, a.pan()); return [1.5, 3]; }
      if (lv('taSea') > 0.5) { a.glass(g * 0.4, 1); return [3, 6]; }
      return [5, 9];
    },
  });
})(window.GS);
