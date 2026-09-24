/* ─────────────────────────────────────────────────────────────
 * music/ot1.js —— 旧约各卷的乐曲（第一批）：士师记 · 历代志 · 以赛亚书 · 耶利米书 · 小先知书（那鸿书—玛拉基书）
 *
 * 给下一位作曲者（写 js/music/ot2.js … 的人）：
 *   · 每一卷用 GS.audio.music(id, spec) 登记，id 就是 js/book/<id>.js 里的 ACT。登记之后，引擎不再借用 act.music 指定的
 *     创世记乐色，而用这里的乐垫、音阶与乐句；audio.js 不必再改。新文件在 src/index.html 里紧跟在前一个 music 文件之后引入。
 *   · 全书是一首连续的曲子：一切都在 A 上。每一卷只换色彩——调式（SC：maj min grief sus lyd hijaz ion mixo dor aeol phryg，
 *     或自己给半音数组）、音区、乐器（波形）、疏密。
 *   · spec.pad.groups：几组持续的声部，组与组之间随本卷的程度交叉淡变。声部 = [音名, 波形, 增益, 声像, 失谐(音分)?]；
 *     音名用 'A2' 'Cs4' 'Bb3' 'Gs5' 的写法（也可以是 Hz）。波形：'s' 正弦 · 't' 三角 · 'soft' 'warm'（弓弦）'reed'（簧）
 *     'over'（只有偶次泛音的风琴光）'flute' 'voice' 'harp' 'oud' · 'choir'（同组的 'choir' 声部合成一个无字的合唱）。
 *     一组也可以写成 { v: [...声部], pulse: [Hz, 深度] }——脉动（窑匠的轮、围城的鼓、活水的起伏）。
 *   · 响度（与创世记的乐垫一样响，不削顶）：每组的增益之和约 1.0–1.4，最低的根音 0.35–0.5，越高的声部越轻（0.03–0.15）；
 *     'choir' 声部与正弦同样写（引擎已补偿共振峰的损失），但合唱在中频，听起来更响——给它配一个正弦的低音，自己再轻一点。
 *   · spec.mix(lv, night) 每 0.1 秒调用一次：返回 { g: { 组名: 0..1 }, lp, drone?, dlp?, pad? }。Σg > 1 时引擎按比例缩小；
 *     用下面的 stack([[组, 分量], ...], 底组) 按优先次序分配最省心：前面的组先取，余下的给后面，最后剩下的归底组。
 *     lv(k) 读本卷的程度（W.lv，未定义为 0；天气 rain storm gloom gale bare bloom 也可以读）。lp 是整个乐垫的低通（约 600–3500Hz，
 *     夜里引擎还会再合上 25%）；drone 乘在底鸣的音量上，dlp 乘在底鸣的低通上，pad 乘在整个乐垫上。
 *   · spec.scale(lv, night) → 调式名：竖琴的恩典、星的轻鸣、名字的铃、哀哭的三音……都随它。
 *   · spec.motif(t, g, api) 奏一句稀疏的乐句，返回下一句的间隔（秒或 [min, max]）；g 是乐句的音量（约 0.035）。
 *     api：lyre(基音, 音数, g, 声像, 调式?, {gap}) · shepherd(g, 声像) · ney(g, 声像) · oud · bowed(音, g, 声像) · glass(g, n)
 *     · angelRun(g) · starPing(g) · strings(ns, o) · pipe(ns, o) · choir(音[], o) · note(o) · chord(音[], o) · bells · pluck · ping
 *     · knocks · burst · motif('cain', g)（借创世记的一句）· lv · night · deg(调式, 基音, 级) · pick · rnd · rint · pan()。
 *     spec.motif2 是次要的一层（星、露、灯），同样返回间隔。言说时、落幕时乐句自动静候。
 *   · spec.coda（秒）只给全书的末一卷用：末一句成就之后乐声再留多久，才随「终」缓缓归于安息。
 *   · 检查：node --check；走一幕（walk.js <id>）时 GS.audio._dbg().pads 给出本卷乐垫各组此刻的分量与低通，errs 必须为空。
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
  // ── 共用的乐句 ────────────────────────────────────────────
  // 活水：一串下行的玻璃般的拨弦（像水流下来）
  function flowing(a, g, sc) {
    const i0 = a.rint(8, 10), n = a.rint(5, 7), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'maj', 'A4', i0 - k), k * 0.12, g * (1 - k * 0.07), 1.8]);
    a.strings(ns, { wave: 'sine', bright: 2, d: 1.8, pan: a.pan(), spread: 0.35, rev: 0.75 });
  }
  // 应答的诗篇（「他的慈爱永远长存」）：I · IV · I，左右两班
  function psalm(a, g, minor) {
    const I = ['A3', minor ? 'C4' : 'Cs4', 'E4', 'A4'], IV = ['A3', 'D4', minor ? 'F4' : 'Fs4', 'A4'];
    a.choir(I, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.9, a: 0.8, s: 0.7, r: 1.6, pan: -0.3 });
    a.choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 0.8, s: 0.6, r: 1.6, at: 2.2, pan: 0.3 });
    a.choir(I, { gs: [1, 0.8, 0.75, 0.55], g: g * 0.9, a: 0.9, s: 1.1, r: 2.8, at: 4.4, pan: 0 });
  }
  // 远处的号角：一声五度（A3 → E4）
  function hornCall(a, g, p) {
    a.note({ f: 'A3', type: 'warm', lp: 1300, g: g * 1.1, a: 0.12, s: 0.3, r: 1.1, vib: [5, 0.004], pan: p, rev: 0.75 });
    a.note({ f: 'E4', type: 'warm', lp: 1700, g, a: 0.15, s: 0.9, r: 2.2, at: 0.55, vib: [5, 0.004], pan: p, rev: 0.8 });
  }

  // ══ 士师记 · 士师 ════════════════════════════════════════
  // 一轮又一轮：安息的山地（多利亚：不大不小，没有王）→ 受欺压（弗里几亚，低处簧音的暗、缓慢的脉动）→ 哀求 →
  // 耶和华兴起士师（混合利底亚：号角般的五度，星宿争战、火把、「惟有耶和华管理你们」）→ 太平……
  // 耶和华心中担忧（温柔的 A6/9）；山上哀哭的女子（爱奥利亚、苇笛）；
  // 末了「各人任意而行」：没有三音、两个失谐的 D 慢慢相拍——每人各走各的调。
  music('judges', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      rest: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.34, -0.2], ['B3', 'soft', 0.17, 0.3], ['Fs4', 's', 0.08, -0.4]],
      opp: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.36, 0.1], ['A2', 'reed', 0.04, -0.15], ['C3', 'soft', 0.28, -0.3], ['E3', 'soft', 0.13, 0.25], ['Bb3', 's', 0.055, 0.35]], pulse: [0.7, 0.3] },
      deliver: [['A2', 's', 0.4, 0], ['E3', 'warm', 0.18, 0.15], ['A3', 'soft', 0.2, -0.25], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.09, -0.4], ['A4', 's', 0.045, 0.5]],
      lament: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.2], ['C4', 'soft', 0.16, -0.3], ['F4', 's', 0.07, 0.35]],
      mercy: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 's', 0.14, 0.25], ['Cs4', 'soft', 0.15, -0.3], ['Fs4', 's', 0.08, 0.4], ['B4', 's', 0.03, -0.5]],
      wander: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.34, 0.1], ['D3', 'soft', 0.2, -0.3, -9], ['D3', 'soft', 0.14, 0.3, 9], ['B3', 's', 0.09, 0.35]],
    } },
    mix(lv) {
      const del = cl(max(lv('jgStar'), lv('jgTorch'), lv('jgReign'), 0.7 * lv('jgFlood')));
      const g = stack([['wander', lv('jgWander')], ['mercy', lv('jgMercy')], ['lament', lv('jgLament')], ['deliver', del], ['opp', lv('jgOpp')]], 'rest');
      const hush = cl(lv('jgJar')) * (1 - cl(lv('jgTorch')));        // 瓶内藏着火把：屏住气
      const lp = 1300 * (1 + 0.7 * g.deliver + 0.3 * g.mercy) * (1 - 0.35 * g.opp) * (1 - 0.25 * g.lament) * (1 - 0.2 * g.wander) * (1 - 0.3 * cl(lv('storm'))) * (1 - 0.35 * hush);
      return { g, lp, dlp: 1 - 0.25 * g.opp, drone: 1 + 0.2 * g.opp - 0.2 * g.deliver, pad: 1 - 0.25 * hush };
    },
    scale(lv) {
      if (lv('jgWander') > 0.5) return 'sus';
      if (lv('jgMercy') > 0.5) return 'maj';
      if (lv('jgLament') > 0.5) return 'aeol';
      if (max(lv('jgStar'), lv('jgTorch'), lv('jgReign'), 0.7 * lv('jgFlood')) > 0.45) return 'mixo';
      if (lv('jgOpp') > 0.5) return 'phryg';
      return 'dor';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      if (lv('jgWander') > 0.5) { a.lyre('A3', a.rint(2, 3), g * 0.6, p, 'sus', { gap: 0.5 }); return [22, 34]; }
      if (lv('jgMercy') > 0.5) { a.lyre('A4', a.rint(3, 4), g * 0.7, p, 'maj', { gap: 0.36 }); return [16, 24]; }
      if (lv('jgLament') > 0.5) { a.ney(g * 1.05, p); return [13, 19]; }                 // 山上哀哭的女子：苇笛
      if (lv('jgTorch') > 0.5) { hornCall(a, g, p); return [8, 12]; }                    // 「耶和华和基甸的刀！」
      if (max(lv('jgStar'), lv('jgReign'), lv('jgFlood')) > 0.5) { a.lyre('A4', a.rint(5, 7), g * 0.85, p, 'mixo', { gap: 0.2 }); return [10, 15]; }  // 底波拉的歌
      if (lv('jgOpp') > 0.5) { a.bowed(a.pick(['A2', 'C3', 'E3', 'Bb2']), g * 0.85, p); return [15, 24]; }
      if (a.night() > 0.5) { a.lyre('A3', a.rint(3, 4), g * 0.7, p); return [18, 26]; }
      a.ney(g * 0.9, p); return [16, 26];                                                 // 山地的苇笛（多利亚）
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('jgStar') > 0.3) { a.starPing(g * 1.1); return [0.5, 1.4]; }                // 星宿从天上争战
      if (lv('jgDew') > 0.4) { a.glass(g * 0.5, 1); return [4, 7]; }                     // 遍地的露水
      if (lv('jgTorch') > 0.5) { a.pluck(a.deg('mixo', 'A4', a.rint(0, 7)), 0, g * 0.55, a.pan(), 0.6); return [1.5, 3.5]; }  // 火把一支接一支亮起
      return [5, 9];
    },
  });

  // ══ 历代志 · 历代 ════════════════════════════════════════
  // 一座殿的故事：王庭（A1 与 A2 的根基、风琴般的偶次泛音，伊奥尼亚）；约柜与诗班（无字的合唱，I · IV · I 的应答）；
  // 荣光充满了殿（高处的 A 大九，低通全开）；拔出来的刀、敌营的火（弗里几亚、低处的脉动）；
  // 焚烧与废墟（爱奥利亚）——地享受安息（挂留，低通合上）；塞鲁士的心被激动：东方的光（利底亚），归家的路。
  music('chronicles', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1500, groups: {
      court: [['A1', 's', 0.28, 0], ['A2', 's', 0.3, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['A2', 'over', 0.09, 0.1], ['E4', 's', 0.06, -0.4]],
      song: [['A2', 's', 0.45, 0], ['E3', 'soft', 0.2, 0.15], ['A3', 'choir', 0.24, 0], ['E4', 'choir', 0.2, 0], ['A4', 'choir', 0.16, 0], ['Cs5', 'choir', 0.1, 0]],
      glory: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.31, -0.15], ['A3', 's', 0.2, 0.2], ['Cs4', 'soft', 0.17, -0.3], ['E4', 's', 0.12, 0.35], ['A4', 's', 0.075, -0.45], ['Cs5', 's', 0.05, 0.5], ['E5', 's', 0.03, -0.55], ['A3', 'over', 0.06, 0]],
      threat: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.33, 0.1], ['Bb2', 'soft', 0.09, -0.35], ['C3', 'soft', 0.26, 0.3], ['E3', 'soft', 0.13, -0.2], ['Ds4', 's', 0.028, -0.45]], pulse: [0.9, 0.3] },
      ruin: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.35, 0.1], ['C3', 'soft', 0.28, -0.3], ['E3', 'soft', 0.13, 0.25], ['F3', 's', 0.09, 0.35]],
      east: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.15], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['Ds4', 's', 0.05, 0.4], ['Gs4', 's', 0.04, -0.45]],
    } },
    mix(lv) {
      const song = cl(max(lv('chSong'), 0.75 * lv('chPlay'))), glory = cl(max(lv('chGlory'), 0.8 * lv('chCloud')));
      const threat = cl(max(lv('chSword') * lv('chAngel'), lv('chCamp') * (1 - lv('chCampOut'))));
      const ruin = cl(max(lv('chBurn'), lv('chRuin'))), east = cl(max(lv('chEast'), 0.8 * lv('chRoad'))), wild = cl(lv('chWild'));
      const g = stack([['east', east], ['threat', threat], ['song', 0.55 * song], ['glory', glory], ['ruin', ruin]], 'court');
      const lp = 1500 * (1 + 0.8 * g.glory + 0.5 * g.song + 0.35 * g.east) * (1 - 0.35 * g.threat) * (1 - 0.35 * g.ruin * (0.5 + 0.5 * wild));
      return { g, lp, pad: 1 - 0.3 * wild * g.ruin, dlp: 1 - 0.2 * g.threat - 0.15 * g.ruin, drone: 1 + 0.15 * g.threat };
    },
    scale(lv) {
      if (max(lv('chEast'), lv('chRoad')) > 0.4) return 'lyd';
      if (lv('chSword') * lv('chAngel') > 0.5 || lv('chCamp') * (1 - lv('chCampOut')) > 0.5) return 'phryg';
      if (max(lv('chBurn'), lv('chRuin')) > 0.5) return lv('chWild') > 0.5 ? 'sus' : 'aeol';
      if (lv('chEyes') > 0.4) return 'lyd';
      if (max(lv('chSong'), lv('chGlory'), lv('chPlay')) > 0.35) return 'maj';
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      if (max(lv('chEast'), lv('chRoad')) > 0.4) { a.ney(g, p); return [13, 19]; }                         // 往东方归家的路
      if (lv('chSword') * lv('chAngel') > 0.5 || lv('chCamp') * (1 - lv('chCampOut')) > 0.5) { a.bowed(a.pick(['A2', 'Bb2', 'C3']), g * 0.8, p); return [11, 17]; }
      if (max(lv('chBurn'), lv('chRuin')) > 0.5) {
        if (lv('chWild') > 0.5) { a.glass(g * 0.35, 1); return [20, 30]; }                                     // 地享受安息
        a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [15, 23];
      }
      if (max(lv('chSong'), lv('chPlay')) > 0.3) { psalm(a, g); return [10, 15]; }                           // 利未人的应答
      if (lv('chGlory') > 0.4) { a.glass(g * 0.7, 2); return [8, 13]; }
      a.lyre(a.pick(['A3', 'A4']), a.rint(4, 6), g * 0.85, p, 'ion', { gap: 0.28 }); return [14, 22];       // 大卫的琴
    },
    motif2(t, g, a) {
      if (a.lv('chEyes') > 0.3) { a.starPing(g); return [0.6, 1.6]; }                                        // 耶和华的眼目遍察全地
      if (a.lv('chPlay') > 0.5) { a.lyre('A4', a.rint(3, 5), g * 0.6, a.pan(), null, { gap: 0.18 }); return [3.5, 6]; }  // 鼓瑟弹琴
      return [5, 9];
    },
  });

  // ══ 以赛亚书 · 以赛亚 ════════════════════════════════════
  // 锡安（A 加九）；宝座与撒拉弗：深处的 A1 与高处的合唱（利底亚），「圣哉」三次彼此呼喊；
  // 黑暗、烟云、受苦的仆人（爱奥利亚、弓弦的暗）；大光与婴孩、锡安发光（A 大七的光辉）；
  // 众星按数目领出（利底亚的星空）；豺狼与羊羔、旷野的河、大山小山歌唱（田园的 A6/9）；新天新地 = 光 + 平安。
  music('isaiah', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1500, groups: {
      city: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.15, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.07, 0.4]],
      holy: [['A1', 's', 0.32, 0], ['A2', 'over', 0.08, 0], ['E3', 's', 0.16, 0.1], ['A3', 'choir', 0.2, 0], ['E4', 'choir', 0.17, 0], ['A4', 'choir', 0.13, 0], ['Cs5', 'choir', 0.09, 0], ['E5', 's', 0.03, -0.5], ['Gs5', 's', 0.012, 0.55]],
      dark: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.35, 0.1], ['A2', 'warm', 0.09, -0.2], ['C3', 'soft', 0.28, 0.3], ['E3', 'soft', 0.13, -0.25], ['F3', 's', 0.065, -0.35]],
      light: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.18, 0.25], ['Cs4', 'soft', 0.17, -0.3], ['E4', 's', 0.11, 0.35], ['Gs4', 's', 0.045, -0.45]],
      peace: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.2], ['Cs4', 'soft', 0.18, -0.3], ['Fs4', 's', 0.09, 0.4], ['B4', 's', 0.04, -0.5]],
      stars: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, 0.15], ['Cs4', 'soft', 0.16, -0.3], ['Gs4', 's', 0.065, 0.35], ['Ds5', 's', 0.03, -0.45], ['A3', 'over', 0.05, 0]],
    } },
    mix(lv) {
      const holy = cl(max(lv('isGlory'), 0.8 * lv('isSeraph'), 0.6 * lv('isThrone')));
      const lit = cl(max(lv('isLight'), lv('isZion'), 0.7 * lv('isNew')));
      const dark = cl(max(lv('gloom') * (1 - lit), lv('isBurden'), 0.85 * lv('isSmoke'), 0.8 * lv('isCamp') * (1 - lv('isCampOut'))));
      const stars = cl(max(lv('isConst'), 0.7 * lv('isEagles')));       // （isHost 领出之后一直留着，不用它）
      const peace = cl(max(lv('isBeasts'), lv('isStreams'), 1.6 * lv('isSea'), lv('isHills'), 0.7 * lv('isNew'), 0.5 * lv('isRiver')));
      const g = stack([['holy', holy], ['dark', dark], ['light', lit], ['stars', stars], ['peace', peace]], 'city');
      const lp = 1500 * (1 + 0.9 * g.holy + 0.6 * g.light + 0.45 * g.stars + 0.25 * g.peace) * (1 - 0.4 * g.dark) * (1 - 0.3 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.25 * g.dark + 0.15 * g.holy, drone: 1 + 0.3 * g.holy };   // 门槛的根基震动：宝座下的底鸣更深
    },
    scale(lv) {
      if (max(lv('isGlory'), lv('isSeraph')) > 0.4) return 'lyd';
      const lit = max(lv('isLight'), lv('isZion'), lv('isNew'));
      if (lv('isBurden') > 0.4 || lv('isSmoke') > 0.5 || (lv('gloom') > 0.5 && lit < 0.5)) return 'aeol';
      if (lv('isConst') > 0.4) return 'lyd';
      if (lit > 0.4 || lv('isBeasts') > 0.4 || lv('isStreams') > 0.4 || lv('isHills') > 0.4) return 'maj';
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      if (max(lv('isGlory'), lv('isSeraph')) > 0.4) {                                  // 彼此呼喊：圣哉、圣哉、圣哉
        [[0, -0.45], [1.7, 0.45], [3.4, 0]].forEach(([at, pn], i) => a.choir(i < 2 ? ['A3', 'E4', 'A4', 'Cs5'] : ['A3', 'E4', 'A4', 'Cs5', 'E5'],
          { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * (i < 2 ? 0.95 : 1.1), a: 0.5, s: i < 2 ? 0.5 : 1.3, r: i < 2 ? 1.4 : 3, at, pan: pn }));
        return [13, 18];
      }
      if (lv('isBurden') > 0.4 || lv('isSmoke') > 0.5 || (lv('gloom') > 0.5 && max(lv('isLight'), lv('isZion')) < 0.5)) {
        a.bowed(a.pick(['A2', 'C3', 'E3', 'F3', 'D3']), g * 0.9, p); return [13, 20];
      }
      if (lv('isConst') > 0.4) { a.lyre('A4', a.rint(3, 5), g * 0.7, p, 'lyd'); return [14, 20]; }
      if (max(lv('isLight'), lv('isZion'), lv('isNew')) > 0.4) { a.lyre('A4', a.rint(4, 6), g * 0.85, p, 'maj'); return [11, 16]; }
      if (max(lv('isBeasts'), lv('isStreams'), lv('isHills')) > 0.4) { a.shepherd(g, p); return [12, 18]; }   // 小孩子要牵引它们
      a.lyre(a.pick(['A3', 'A4']), a.rint(3, 5), g * 0.8, p); return [15, 24];
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (max(lv('isGlory'), lv('isSeraph')) > 0.4) { a.glass(g * 0.55, 1); return [3, 6]; }
      if (lv('isConst') > 0.3) { a.starPing(g); return [0.5, 1.4]; }                    // 一一称其名
      if (lv('isStreams') > 0.4 || lv('isSea') > 0.2 || lv('isRiver') > 0.5) { flowing(a, g); return [5, 9]; }   // 旷野的河；知识如水
      if (lv('isSnow') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.5, a.pan()); return [1.5, 3.5]; }  // 雪片
      if (lv('isZion') > 0.5 || lv('isNew') > 0.5) { a.glass(g * 0.45, 1); return [6, 10]; }
      return [5, 9];
    },
  });

  // ══ 耶利米书 · 耶利米 ════════════════════════════════════
  // 亚拿突的清晨（A6/9 的清亮）；流泪的先知：低处的 A 小七与弓弦（warm）的暗——活水的泉源暗下去，它就来了；
  // 窑匠的轮：挂留的和声随轮一圈一圈起伏（脉动）；天上的器皿被重新做成、平安的意念、将来的葡萄园、光的城（高处的光辉，
  // 利底亚 / 伊奥尼亚）；北方的锅、围城、骨中的火、城破（弗里几亚、战鼓般的脉动）；废墟上的「我以永远的爱爱你」（温柔的 A 大）。
  music('jeremiah', {
    weight: { drone: 0.65, pad: 0.95 },
    pad: { lp: 1300, groups: {
      call: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 's', 0.13, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['Fs4', 's', 0.06, 0.4]],
      lament: [['A1', 's', 0.45, 0], ['E2', 'soft', 0.33, 0.1], ['A2', 'warm', 0.11, -0.2], ['C3', 'soft', 0.28, 0.3], ['E3', 'warm', 0.08, 0.4], ['G3', 's', 0.09, -0.35]],
      wheel: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.14, 0.3], ['D4', 's', 0.07, -0.35], ['A3', 'over', 0.05, 0.1]], pulse: [1.3, 0.35] },
      sign: [['A2', 's', 0.34, 0], ['E3', 'soft', 0.27, -0.15], ['A3', 's', 0.16, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.11, 0.35], ['A4', 's', 0.06, -0.45], ['Cs5', 's', 0.035, 0.5], ['A3', 'over', 0.05, 0]],
      siege: { v: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.35, 0.1], ['Bb2', 'soft', 0.075, -0.35], ['C3', 'soft', 0.26, 0.3], ['E3', 'soft', 0.1, -0.2], ['F3', 's', 0.055, -0.4]], pulse: [0.85, 0.3] },
      love: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'flute', 0.17, 0.3], ['E4', 's', 0.09, -0.35], ['A4', 's', 0.05, 0.45], ['E5', 's', 0.022, -0.5]],
    } },
    mix(lv) {
      const love = cl(max(lv('jrLove'), 0.8 * lv('jrHope'), 0.9 * lv('jrHeart')));
      const fire = max(lv('jrFire'), lv('jrTFire'));
      // 天上的器皿、平安的意念、光的城在前；地契与将来的葡萄园（封好之后一直留着）只在城未破时透出光来
      const signHi = cl(max(0.8 * lv('jrSign'), lv('jrGlory'), 0.7 * lv('jrThread'), lv('jrNew'), 0.6 * lv('jrLine')));
      const signLo = cl(max(0.8 * lv('jrVision'), 0.45 * lv('jrDeed')) * (1 - cl(max(lv('jrBreach'), fire))));
      const siege = cl(max(lv('jrSiege'), lv('jrBreach') * max(lv('jrSiege'), fire), 0.9 * fire, 0.8 * lv('jrPot'), 0.7 * lv('jrPit'), 0.6 * lv('jrBone')));
      const dry = cl((0.6 - lv('jrSpring')) / 0.32);                      // 离弃了活水的泉源
      const lament = cl(max(0.9 * lv('storm'), 0.7 * lv('rain'), dry, 0.8 * lv('jrRuin'), 0.7 * lv('jrEmber'), 0.6 * lv('jrStocks'), 0.5 * lv('jrBrazier'), lv('jrMud')));
      const g = stack([['sign', signHi], ['love', love], ['sign', signLo], ['siege', siege], ['wheel', lv('jrWheel')], ['lament', lament]], 'call');
      const lp = 1300 * (1 + 0.9 * g.sign + 0.5 * g.love + 0.15 * g.wheel) * (1 - 0.35 * g.siege) * (1 - 0.2 * g.lament) * (1 - 0.25 * cl(lv('storm')));
      return { g, lp, dlp: 1 - 0.2 * g.siege - 0.15 * g.lament, drone: 1 + 0.25 * g.siege };
    },
    scale(lv) {
      if (max(lv('jrSign'), lv('jrGlory')) > 0.5) return 'lyd';
      if (max(lv('jrNew'), lv('jrThread')) > 0.45) return 'ion';
      if (max(lv('jrLove'), lv('jrHope'), lv('jrHeart')) > 0.45) return 'maj';
      if (lv('jrVision') > 0.45 && lv('jrBreach') < 0.5) return 'ion';
      if (max(lv('jrSiege'), lv('jrBreach'), lv('jrFire'), lv('jrPot')) > 0.5) return 'phryg';
      if (lv('jrWheel') > 0.5) return 'dor';
      if (lv('jrSpring') < 0.45 || lv('storm') > 0.2 || lv('jrRuin') > 0.5) return 'aeol';
      return 'maj';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      if (max(lv('jrSign'), lv('jrGlory')) > 0.5) { a.angelRun(g * 0.9); return [7, 11]; }                   // 器皿在天上被重新做成
      if (max(lv('jrNew'), lv('jrLine')) > 0.5) { a.lyre('A4', a.rint(4, 6), g * 0.9, p, 'ion'); return [10, 15]; }
      if (max(lv('jrLove'), lv('jrHope'), lv('jrHeart')) > 0.45) { a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.34 }); return [13, 19]; }
      if (max(lv('jrSiege'), lv('jrBreach'), lv('jrFire')) > 0.5) {                                          // 远处的战鼓
        a.knocks([[0, 300, 70, g * 1.4, true], [0.62, 300, 72, g, true], [1.24, 300, 70, g * 1.3, true], [1.55, 320, 74, g * 0.8, true], [1.86, 300, 70, g * 1.2, true]], { lp: 700, pan: p, rev: 0.6 });
        return [9, 14];
      }
      if (lv('jrWheel') > 0.5) {                                                                              // 轮上一圈一圈的琴
        const fig = ['A3', 'E4', 'D4', 'E4'], n = 8;
        a.strings(Array.from({ length: n }, (_, i) => [fig[i % 4], i * 0.18, g * (i % 4 ? 0.6 : 0.9), 1.4]), { bright: 4, d: 1.4, pan: p, spread: 0.1, rev: 0.45 });
        return [6, 9];
      }
      if (lv('jrSpring') < 0.45 || lv('storm') > 0.2 || lv('jrRuin') > 0.5) {                               // 「我心为他们哀鸣如箫」
        if (Math.random() < 0.55) a.ney(g * 1.05, p); else a.bowed(a.pick(['A2', 'C3', 'E3', 'D3', 'G3']), g * 0.9, p);
        return [14, 21];
      }
      a.shepherd(g * 0.85, p); return [15, 22];                                                              // 亚拿突的清晨
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('jrHope') > 0.3) { a.ping(a.deg('maj', 'A5', a.rint(0, 6)), 0, g * 0.6, a.pan()); return [1.5, 3]; }   // 远方归来的灯
      if (lv('jrAlmond') > 0.5 && lv('jrPot') < 0.3 && lv('jrSpring') >= 0.45) { a.pluck(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.5, a.pan(), 0.6); return [3, 6]; }  // 杏树开花
      return [5, 9];
    },
  });

  // ══ 小先知书 · 公义的日头（那鸿书 — 玛拉基书）═══════════
  // 旧约的末一幕。旋风与暴风、遍地黑暗、火炉（低处的 A 小 b6）；望楼上的等候、无花果树不发旺（挂二，没有三音）；
  // 「然而，我要因耶和华欢欣」「他必因你欢呼」（无字的合唱）；后来的荣耀、火城、灯台（A 大九的光，利底亚的惊奇）；
  // 活水、满海的知识（缓缓起伏的 A 加九）；「我曾爱你们」（温柔的 A6）——
  // 末了公义的日头：创世记第六日「甚好」的那个和弦（A1 E2 A2 C#3 E3 B3 C#4 E4 F#4 A4）从低到高整个亮起，低通全开。
  music('twelve2', {
    weight: { drone: 0.55, pad: 1 },
    coda: 34,                                    // 旧约的末一句之后：日头升起的整段尾声里乐声都在，直到「旧约 · 三十九卷 · 终」写在天上
    pad: { lp: 1400, groups: {
      vigil: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['E4', 's', 0.07, -0.4]],
      storm: [['A1', 's', 0.5, 0], ['E2', 'soft', 0.35, 0.1], ['C3', 'soft', 0.26, -0.3], ['E3', 'soft', 0.1, 0.25], ['F3', 's', 0.065, 0.35]],
      song: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.18, 0], ['Cs4', 'choir', 0.15, 0], ['E4', 'choir', 0.14, 0], ['A4', 'choir', 0.09, 0]],
      glory: [['A2', 's', 0.34, 0], ['E3', 'soft', 0.27, -0.15], ['A3', 's', 0.16, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.1, 0.35], ['Gs4', 's', 0.04, -0.45], ['B4', 's', 0.035, 0.5]],
      river: { v: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.13, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.08, 0.4]], pulse: [0.28, 0.22] },
      love: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'soft', 0.17, -0.3], ['Fs4', 's', 0.08, 0.4], ['A4', 'flute', 0.045, -0.45]],
      sun: [['A1', 's', 0.24, 0], ['E2', 's', 0.2, 0.1], ['A2', 's', 0.24, -0.1], ['Cs3', 's', 0.2, 0.2], ['E3', 's', 0.2, -0.25],
        ['B3', 't', 0.15, 0.3], ['Cs4', 't', 0.16, -0.35], ['E4', 't', 0.15, 0.4], ['Fs4', 't', 0.13, -0.45], ['A4', 't', 0.1, 0.5]],
    } },
    mix(lv) {
      const sun = cl(max(lv('tbSun'), 0.8 * lv('tbHeal')));
      const storm = cl(max(sm(0.35, 0.8, lv('storm')), lv('gloom'), lv('tbFurnace'), 0.7 * lv('tbSpirit'), 0.8 * lv('tbNinFlood')));
      const song = cl(max(lv('tbSong'), lv('tbJoy'), 0.6 * lv('tbHind')));
      const glory = cl(max(lv('tbGlory'), 0.9 * lv('tbFire'), 0.8 * lv('tbLampstand'), 0.6 * lv('tbOil'), lv('tbWindows'), lv('tbPour'), 0.5 * lv('tbCrown')));   // （殿顶的石头安上之后一直在，不用它）
      const fount = lv('tbFount'), river = cl(max(0.9 * lv('tbSea'), lv('tbKnow'), fount > 0.8 ? fount : 0.5 * fount));   // 泉源开了之后一直在流：只留一半
      const love = cl(max(0.8 * lv('tbIncense'), 0.7 * lv('tbTeach'), 0.8 * lv('tbBook'), 0.5 * lv('tbNames')));
      const fruit = cl(Math.min(lv('tbOrchard'), lv('tbField') / 0.6));   // 园子结果、田里有粮：寻常日子的温暖
      const g = stack([['sun', sun], ['love', max(0.6 * lv('tbShelter'), lv('tbLove'))], ['storm', storm], ['song', song], ['glory', glory], ['river', river], ['love', love], ['love', 0.55 * fruit]], 'vigil');
      const lp = 1400 * (1 + 1.3 * g.sun + 0.8 * g.glory + 0.6 * g.song + 0.4 * g.river + 0.25 * g.love) * (1 - 0.4 * g.storm);
      return { g, lp, dlp: 1 - 0.25 * g.storm + 0.2 * g.sun, drone: 1 - 0.3 * g.sun + 0.2 * g.storm };
    },
    scale(lv) {
      if (max(lv('tbSun'), lv('tbHeal')) > 0.4) return 'maj';
      if (lv('gloom') > 0.45) return 'phryg';
      if (lv('tbFurnace') > 0.5 || lv('storm') > 0.6) return 'grief';
      if (lv('tbSpirit') > 0.5) return 'aeol';
      if (max(lv('tbSong'), lv('tbJoy')) > 0.4) return 'maj';
      if (max(lv('tbLampstand'), lv('tbFire'), lv('tbWindows')) > 0.4) return 'lyd';
      if (max(lv('tbGlory'), lv('tbRiver'), lv('tbSea'), lv('tbLove'), lv('tbCrown')) > 0.4) return 'maj';
      if (lv('bare') > 0.5) return 'sus';                                                  // 无花果树不发旺
      return 'ion';
    },
    motif(t, g, a) {
      const lv = a.lv, p = a.pan();
      if (max(lv('tbSun'), lv('tbHeal')) > 0.4) {                                          // 公义的日头：一道升起的琴，然后「甚好」的铃
        a.strings(['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5', 'A5'].map((n, i) => [n, 0.2 + i * 0.2, g * (1 - i * 0.06), 3.2]), { bright: 5, d: 3.2, rev: 0.65, spread: 0.3 });
        a.bells(['A5', 'Cs6', 'E6'], 0.18, g * 0.9, 3, 1.9);
        return [10, 14];
      }
      if (lv('storm') > 0.6 || lv('gloom') > 0.45 || lv('tbFurnace') > 0.5) return [8, 12];   // 风暴、黑暗本身就是音乐
      if (max(lv('tbSong'), lv('tbJoy')) > 0.4) {                                              // 因你欢呼
        a.lyre('A4', a.rint(5, 7), g * 0.9, p, 'maj', { gap: 0.17 });
        a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.7, a: 0.6, s: 0.6, r: 1.6, at: 0.3, pan: -p });
        return [8, 12];
      }
      if (lv('tbSpirit') > 0.5) { a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.85, p); return [10, 14]; }   // 为他悲哀，如丧独生子
      if (max(lv('tbLampstand'), lv('tbFire'), lv('tbGlory')) > 0.45) { a.lyre('A4', a.rint(4, 6), g * 0.8, p); return [11, 16]; }
      if (max(lv('tbLove'), lv('tbIncense'), lv('tbBook')) > 0.4) {                           // 我曾爱你们
        a.pipe([['E4', 0.5], ['Fs4', 0.3], ['E4', 0.3], ['Cs4', 0.6], ['B3', 0.4], ['A3', 1.4]], { g: g * 0.5, pan: p, bright: 4, breath: 0.25, vib: 10, rev: 0.6 });
        return [13, 18];
      }
      if (max(lv('tbSea'), lv('tbKnow'), lv('tbFount') > 0.8 ? 1 : 0) > 0.45) { flowing(a, g); return [8, 12]; }
      if (lv('bare') > 0.5) { a.ney(g, p); return [15, 22]; }                                  // 望楼上的等候
      a.shepherd(g * 0.9, p); return [14, 20];
    },
    motif2(t, g, a) {
      const lv = a.lv;
      if (lv('tbSun') > 0.4) { a.glass(g * 0.5, 2); return [3, 5]; }
      if (lv('tbLamps') > 0.4) { a.ping(a.pick(['A4', 'E4', 'C5']), 0, g * 0.5, a.pan()); return [1.2, 2.6]; }   // 灯在黑暗的城中巡行
      if (lv('tbBook') > 0.4) { a.ping(a.deg('maj', 'A5', a.rint(0, 7)), 0, g * 0.45, a.pan()); return [0.8, 1.6]; } // 名字一个个记上
      if (lv('tbIncense') > 0.4) { a.starPing(g * 0.7); return [1.5, 3]; }                                           // 处处的香火
      if (lv('tbSea') > 0.4 || lv('tbKnow') > 0.4) { a.glass(g * 0.45, 1); return [3, 6]; }
      return [5, 9];
    },
  });
})(window.GS);
