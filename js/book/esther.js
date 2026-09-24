/* ─────────────────────────────────────────────────────────────
 * book/esther.js —— 以斯帖记 · 以斯帖（以斯帖记 1 — 10）
 *
 * 全卷不提神的名，神的手是隐藏的：本卷的话语是箴言、诗篇里论到祂隐藏之手的句子，
 * 以及以斯帖记里事情翻转的几句——没有一处画出祂，只有光、签、水与不眠的星。
 *
 * 书珊城的宫：左边是御园（白玉石柱上系着白、绿、蓝的帐子，铺石地是红、白、黄、黑的玉石，
 * 两棵柏树，一道陇沟的水），中间是王宫（内院与柱廊的大殿，牛首的柱头，琉璃砖上一行金狮，
 * 宝座在殿的右边，对着殿门），右边是朝门，末底改坐在那里。河对岸的中丘是书珊城：
 * 泥砖的平顶房屋、枣椰树，左端是哈曼的家（五丈高的木架后来立在那里）。
 * 远山上一串小灯是「从印度直到古实」的一百二十七省。
 *
 * 「国权是耶和华的」——一百二十七省的灯一盏盏亮起，御园的筵席；「他使这人降卑，使那人升高」——
 * 瓦实提不肯来，王心如火烧，米母干的话；「神在他的圣所作孤儿的父」——末底改牵着哈大沙，
 * 「以斯帖」的名聚成，冠冕戴在她头上；「将这事在王面前写于历史上」——守门的二人密谋，
 * 金字写进书卷，收在匣中，留着一点余烬；「惟独末底改不跪不拜」——众臣仆俯伏，只有一人站着；
 * ★「签放在怀里，定事由耶和华」——天上一圈十二个月，签在轮上转，停在十二月（本卷的第二幅签名之景）；
 *   戒指、暗红的旨意飞向各省，城中慌乱；「焉知你得了王后的位分……」——麻衣与灰，禁食三昼三夜；
 * ★「王的心在耶和华手中」——第三日，王后站在内院，王伸出金杖，一道金光；陇沟的水转了方向
 *   （本卷的签名之景）；「保护以色列的，也不打盹也不睡觉」——木架立起，那夜王睡不着，
 *   书卷里末底改的那一行又亮了；「他从灰尘里抬举贫寒人」——御马与朝服，灰化作金尘；
 *   「他的毒害必临到他自己的头上」——第二次筵席，王的忿怒止息；
 * ★「犹大人有光荣，欢喜快乐而得尊贵」——金色的谕旨飞遍各省，末底改穿着蓝白的朝服出来，
 *   黄昏里全城点起灯（第三幅签名之景）；「犹大人反倒辖制恨他们的人」——签轮反转，
 *   十二月由红转金；「转忧为喜、转悲为乐」——普珥日，家家户户的灯，末底改为本族的人说和平的话。
 *
 * 一切位置都以画面宽度的比例记下（横屏、竖屏各一套）；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'esther';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LVL = {
    etProv: ['exp', 0.45],      // 一百二十七省的灯（远山上的一串光）
    etProvRed: ['exp', 0.35],   // 灭绝的旨意传到各省：灯转暗红（3:14）
    etProvGold: ['exp', 0.4],   // 末底改的谕旨：灯转金（8:13）
    etHang: ['exp', 0.45],      // 御园的帐子（1:6）
    etFeast: ['exp', 0.55],     // 金银的床榻、金器皿（1:6–7）
    etWrath: ['exp', 0.7],      // 王的忿怒（1:12；7:7）
    etHWrath: ['exp', 0.7],     // 哈曼的怒气（3:5；5:9）
    etShadow: ['exp', 0.3],     // 旨意之后，书珊城的慌乱（3:15）
    etCrownV: ['exp', 0.8],     // 瓦实提的冠冕
    etCrownE: ['exp', 0.6],     // 以斯帖的冠冕（2:17）
    etCrownM: ['exp', 0.6],     // 末底改的大金冠冕（8:15）
    etRecord: ['exp', 0.5],     // 历史书收在匣中（2:23）：一点余烬
    etScroll: ['exp', 0.7],     // 书卷展开在殿上
    etRead: ['exp', 0.5],       // 那夜念到末底改的那一行（6:2）
    etLots: ['exp', 0.5],       // 天上十二个月的签轮（3:7；9:1；9:26）
    etLot: ['lin', 0.17],       // 签在轮上转动、停下（0 → 1）
    etTurn: ['exp', 0.3],       // 签轮反转（9:1 反倒）
    etPur: ['exp', 0.4],        // 普珥日：签轮成了金色
    etScepter: ['exp', 0.9],    // 金杖伸出（5:2；8:4）
    etGold: ['exp', 0.5],       // 金杖的光充满殿
    etRill: ['lin', 0.4],       // 陇沟的水流向（-1 流向海，+1 流向王宫）（箴 21:1）
    etGallows: ['exp', 0.35],   // 五丈高的木架（5:14）
    etGalLit: ['exp', 0.8],     // 哈波拿指着木架（7:9）
    etGlory: ['exp', 0.35],     // 犹大人有光荣（8:16）
    etLamps: ['exp', 0.45],     // 家家户户的灯
    etBanquet: ['exp', 0.7],    // 以斯帖所预备的筵席
    etKingLamp: ['exp', 0.6],   // 那夜王宫里的一盏灯
    etAsh: ['exp', 0.4],        // 麻衣与灰：各处的哀哭（4:3）
    etWatch: ['exp', 0.35],     // 保护以色列的，也不打盹：众星看守
    etHidden: ['exp', 0.3],     // 隐藏的光（「从别处」）
    etBanner: ['exp', 0.6],     // 王宫的旗
    etHLamp: ['exp', 0.6],      // 哈曼家里的灯（5:10–14：他与细利斯在灯前）
  };
  for (const k in LVL) W.defineLevel(k, LVL[k][0], LVL[k][1]);

  // ── 地上的位置（画面宽度的比例）：横屏 / 竖屏各一套 ───────────
  const XL = {
    g0: 0.478, g1: 0.604, pillars: [0.49, 0.524, 0.558, 0.592], cyp: [0.474, 0.614], couch: 0.541,
    court0: 0.628, hall0: 0.678, hall1: 0.826, throne: 0.795, stand: 0.656, tip: 0.759, queen: 0.817, chest: 0.697,
    table: 0.738, seatH: 0.713, seatK: 0.763,
    gate: 0.87, seat: 0.906, st0: 0.928, st1: 0.99, rill0: 0.47, rill1: 0.676,
    hh: 0.556, gal: 0.59, palmN: [0.985],
    city: [0.506, 0.523, 0.611, 0.84, 0.86, 0.88, 0.902, 0.924, 0.946, 0.968, 0.99], palmM: [0.536, 0.832, 0.935],
  };
  // 竖屏：御园收窄为两间（三根柱），王宫加宽，朝门靠右；人与宫都放大些（见 PSK、BK）
  const XP = {
    g0: 0.452, g1: 0.548, pillars: [0.462, 0.5, 0.538], cyp: [0.443], couch: 0.519,
    court0: 0.562, hall0: 0.602, hall1: 0.856, throne: 0.813, stand: 0.584, tip: 0.762, queen: 0.838, chest: 0.63,
    table: 0.72, seatH: 0.694, seatK: 0.748,
    gate: 0.93, seat: 0.972, st0: 0.9, st1: 0.995, rill0: 0.43, rill1: 0.62,
    hh: 0.555, gal: 0.595, palmN: [],
    city: [0.515, 0.622, 0.648, 0.674, 0.702, 0.73, 0.758, 0.786, 0.814, 0.842, 0.87, 0.898, 0.926, 0.954, 0.982], palmM: [0.532, 0.716, 0.9],
  };
  const port = () => W.w < W.h * 0.9;
  const X = () => (port() ? XP : XL);

  // ── 衣袍 ───────────────────────────────────────────────────
  const ROBE = {
    king: [128, 40, 76], vashti: [150, 72, 112], esther: [184, 138, 156], estherR: [104, 58, 138],
    mordecai: [80, 96, 128], sack: [56, 51, 46], royal: [58, 96, 172], haman: [96, 40, 44],
    hegai: [212, 196, 152], hathach: [196, 176, 138], harbonah: [176, 156, 122], memucan: [104, 86, 128],
    guard1: [112, 86, 70], guard2: [96, 82, 94], scribe: [200, 184, 146], zeresh: [150, 70, 70], poor: [120, 108, 94],
  };
  const GOLDA = [236, 198, 110], WHITE_A = [238, 236, 228];
  // 哈曼：深酒红的袍、青铜色的头巾（与王的紫红金冠、末底改的朝服一眼分开）
  const HAMAN_A = [140, 104, 62], HAMAN_D = [44, 36, 32];
  const hamanLook = o => Object.assign({ label: '哈曼', sex: 'm', age: 'adult', robe: ROBE.haman, hair: 'cloth', accent: HAMAN_A, beard: true }, o || {});
  const NOBLE = [[118, 98, 150], [150, 108, 78], [88, 120, 112], [160, 120, 88], [110, 88, 120], [140, 72, 72], [96, 110, 140]];
  const WOMEN = [[172, 120, 140], [150, 110, 152], [192, 150, 128], [140, 122, 162], [180, 132, 120]];
  const MAIDEN = [[214, 182, 192], [200, 172, 204], [222, 192, 170], [190, 172, 204], [212, 198, 182], [204, 162, 172]];
  const SAGE = [[108, 90, 128], [92, 92, 112], [122, 110, 90], [102, 80, 110], [130, 110, 122], [96, 100, 122]];
  const EUNUCH = [[206, 190, 150], [186, 170, 136], [168, 150, 120], [214, 200, 164], [192, 176, 140]];
  const SERV = [[150, 130, 100], [130, 112, 90], [160, 140, 110], [120, 100, 80], [142, 124, 104]];
  const TOWN = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [104, 96, 110], [140, 96, 80], [158, 138, 108], [96, 110, 124]];
  const MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { kingSeat: 'throne', hamanSeat: null, turned: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w, L = GS.land; let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  // 近地人物的尺度（人高 44；与人物模块相同）、中丘的尺度
  const PK0 = () => (34 * W.layerScale(2) * (W.w < 600 ? 1.4 : 1) * 1.3) / 44;
  const PKm = () => (34 * W.layerScale(1) * (W.w < 600 ? 1.4 : 1) * 1.2) / 44;
  // 竖屏（手机）上：人放大 1.25 倍，宫也随之放大——好让故事在小屏上看得清（见 fitCast）
  const PSK = () => (port() ? 1.25 : 1);
  const MSK = () => (port() ? 1.4 : 1.1);            // 中丘（哈曼的家）上的人也放大些（手机上更多）
  const PK = () => PK0() * PSK();                    // 近地的器物（宝座、床榻、匣……）随人
  const BK = () => PK0() * (port() ? 1.31 : 1);      // 近地的建筑
  // 殿台的顶面把纵深压扁（TV）：站在台上的人（v ≤ VSTREET）都在台面之上；v 更大的人在台前的街上
  const TV = 0.42, VSTREET = 0.25;

  // 人物（皆经人物模块）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function place(id, x, layer) { if (has(id)) C().place(id, x, layer); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); }
  function ride(id, m) { const c = C(); if (c.ride && has(id)) U.safe('cast.ride', () => c.ride(id, m)); }
  function follow(id, o, dx) { const c = C(); if (c.follow && has(id)) c.follow(id, o, dx); }
  function unfollow(id) { const f = fig(id); if (f) f.follow = null; }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2, from: W.replaying ? 'none' : 'fade' }, o || {})));
  }
  // 一群人：建成后逐一打扮（性别、年岁、衣袍、纵深）
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  // 一群人换姿势：正走着的走到了再换（与瞬间重演一致：重演时先走到）
  function cpose(gid, p) {
    if (!hasCrowd(gid)) return;
    const still = [];
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.afterWalk = p; continue; }
      if (m.tx != null) {
        m.nx = m.tx; m.tx = null;
        if (m.faceEnd != null) { const d = m.faceEnd; m.faceEnd = null; m.facing = d === 1 || d === -1 ? d : d >= m.nx ? 1 : -1; m.fd = m.facing; }
      }
      still.push(m);
    }
    if (!still.length) return;
    const c = C(), tmp = '__etPose';
    c.crowds.set(tmp, { members: still, o: {} });
    try { c.crowdPose(tmp, p); } finally { c.crowds.delete(tmp); }
  }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  // 打扮一群人：dress(palette, { sex, age, v0, v1, hair, accent, beard })
  const dressAs = (pal, o) => (m, i) => {
    o = o || {};
    m.sex = o.sex === 'mix' ? (i % 2 ? 'f' : 'm') : (o.sex || 'm');
    m.age = o.age || 'adult';
    m.robe = pal[i % pal.length];
    m.accent = o.accent || null;
    m.hairOpt = o.hair || null;
    if (o.beard != null) m.beardOpt = o.beard;
    m.scale = 0.94 + 0.08 * hsh(i * 3.1 + (o.seed || 0));
    if (o.v1 != null) m.v = lerp(o.v0 || 0, o.v1, (i * 0.618 + (o.seed || 0)) % 1);
    if (o.prop !== undefined) m.prop = o.prop;
    if (o.torch) m.prop = i % 2 ? null : 'torch';
  };
  // 一群人各站在给定的位置（避开王的榻等）
  function placeCrowd(gid, xs) { cmembers(gid).forEach((m, i) => { if (i < xs.length) { m.nx = xs[i]; m.tx = null; } }); }
  function slots(x0, x1, n, avoidX, gap) {
    // 总能给出 n 个位置：避开的一段占去了几个，就把间距排密一些
    for (let N = n + 2; N <= n + 16; N++) {
      const out = [];
      for (let i = 0; i < N && out.length < n; i++) {
        const x = lerp(x0, x1, (i + 0.5) / N);
        if (avoidX != null && Math.abs(x - avoidX) < gap) continue;
        out.push(x);
      }
      if (out.length >= n) return out;
    }
    const out = [];
    for (let i = 0; i < n; i++) out.push(lerp(x0, x1, (i + 0.5) / n));
    return out;
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人群按确定的位置走去（人物模块的 crowdWalk 各人的去处带随机）
  function cgo(gid, xs, o) {
    if (!hasCrowd(gid) || !xs.length) return;
    cwalk(gid, xs[0], xs[xs.length - 1], o);
    cmembers(gid).forEach((m, i) => {
      const x = xs[Math.min(i, xs.length - 1)];
      if (m.tx == null) m.nx = x;
      else { m.tx = x; m.facing = x >= m.nx ? 1 : -1; }
    });
  }
  // 一群人建成后：定位（确定的）与朝向
  function lay(gid, xs, dir) { placeCrowd(gid, xs); if (dir != null) cface(gid, dir); }

  // ════════════════════════════════════════════════════════════
  //  殿台：王宫与御园同在一座平的台上（书珊城的宫：地势向朝门升高，台面取最高处）
  //  台上站着的人（纵深 v ≤ VSTREET）都站在台面上；v 更大的在台前的街上
  // ════════════════════════════════════════════════════════════
  let TG = null;
  function terrace() {
    const key = (W.frame || 0) + '|' + W.w + '|' + W.h;
    if (TG && TG.key === key) return TG;
    const P_ = X(), k = BK();
    let yF = Infinity;
    for (let i = 0; i <= 16; i++) yF = Math.min(yF, gY(2, lerp(P_.g0, P_.hall1, i / 16)));
    const fh = Math.max(1, W.h - yF);
    TG = { key, k, yF, fh, a: P_.g0 - (10 * k) / W.w, b: P_.hall1 + (8 * k) / W.w, sw: 0.016, TD: VSTREET * fh * 0.8 * TV + 2 * k };
    return TG;
  }
  // 纵深 v 的人在 xf 处脚下的高度（台上 / 台前的地上；台的两端缓缓过渡）
  function standY(xf, v) {
    const T = terrace(), g = gY(2, xf), yG = g + v * Math.max(0, W.h - g) * 0.8;
    if (v > VSTREET) return yG;
    const yT = T.yF + v * T.fh * 0.8 * TV;
    if (xf >= T.a && xf <= T.b) return yT;
    const d = xf < T.a ? T.a - xf : xf - T.b;
    if (d >= T.sw) return yG;
    return lerp(yG, yT, smoothstep(0, 1, 1 - d / T.sw));
  }
  const FY = xf => standY(xf, 0);            // 台面（器物、柱、墙脚）
  // 每一帧：按台面调整人的纵深（v），并补回因此而变的身量；竖屏放大近地的人，中丘的人也放大些。
  // 情节改了一个人的 v（走进台前的街上、回到朝门），这里让他在一秒左右里走过去，而不是一跳（只是画法；情节的状态不变）
  function fitCast(dt) {
    const c = C();
    if (!c || !c.people || !c.crowds) return;
    const psk = PSK(), msk = MSK(), inst = W.replaying || !(dt > 0);
    const fit = f => {
      if (f._etS !== f.scale) f._etSB = f.scale || 1;
      if (f.mount) {                                       // 骑着的：纵深随坐骑（人物模块每帧设定）
        f._etV = f.v; f._etB = f._etT = f.v || 0;
      } else {
        if (f._etV !== f.v) { f._etT = f.v || 0; if (f._etB == null) f._etB = f._etT; }
        if (f._etB == null) f._etB = f._etT = f.v || 0;
        if (inst) f._etB = f._etT; else { const d = f._etT - f._etB; f._etB += Math.sign(d) * Math.min(Math.abs(d), 0.4 * dt); }
      }
      const base = f._etB;
      let v = f.mount ? f.v || 0 : base, comp = 1;
      if (!f.mount && (f.layer == null || f.layer === 2) && !f.attach && !f.fly && f.ny == null && isFinite(f.nx)) {
        const g = gY(2, f.nx), fh = Math.max(1, W.h - g);
        v = (standY(f.nx, base) - g) / (fh * 0.8);
        comp = (1 + 0.35 * base) / Math.max(0.3, 1 + 0.35 * v);
      }
      const s = (f._etSB || 1) * comp * (f.layer === 1 ? msk : f.layer === 0 ? 1 : psk);
      f.v = v; f._etV = v; f.scale = s; f._etS = s;
    };
    for (const f of c.people.values()) fit(f);
    for (const g of c.crowds.values()) for (const m of g.members) fit(m);
  }

  // 旁白、音效（瞬间重演时不念、不响）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }

  // 人物身上的一点：头顶（像素）；按姿势估计（坐在座上、跪、俯伏……）
  const HT = { stand: 1, walk: 0.99, run: 0.95, gaze: 0.99, raise: 1, point: 1, carry: 0.99, weep: 0.9, embrace: 0.94, wrestle: 0.85,
    bow: 0.6, kneel: 0.74, pray: 0.72, seat: 0.76, sit: 0.6, fall: 0.13, lie: 0.13, ride: 0.76 };
  const HX = { bow: 0.3, weep: 0.05, pray: 0.04, fall: 0.42, lie: -0.4, sit: 0.02 };
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  // 由人物模块的数据推出脚下与身高（不依赖上一帧画在哪里：近地的布景在人之前画）
  function modelOf(f) {
    const l = f.layer == null ? 2 : f.layer;
    const h = 44 * (l === 2 ? PK0() : PKm()) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    if (f.attach) { const r = U.safe('esther.attach', () => f.attach()); if (r && isFinite(r[0]) && isFinite(r[1])) return { x: r[0], y: r[1], h }; }
    const g = gY(l, f.nx), fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    return { x: f.nx * W.w, y: f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8, h };
  }
  function headTop(id) {
    const f = fig(id);
    if (!f) return null;
    const d = f.fd || f.facing || 1;
    if (f._vis && f._seat) return [f._seat[0] + d * 0.02 * f._h, f._seat[1] - 0.52 * f._h];
    if (f.mount && f._seat) return [f._seat[0] + d * 0.02 * f._h, f._seat[1] - 0.52 * f._h];
    const m = f._vis && isFinite(f._x) && isFinite(f._y) ? { x: f._x, y: f._y, h: f._h } : modelOf(f);
    const k = HT[f.pose] != null ? HT[f.pose] : 1;
    return [m.x + d * (HX[f.pose] != null ? HX[f.pose] : 0.02) * m.h, m.y - k * m.h];
  }
  function heightOf(f) { return f._vis ? f._h : modelOf(f).h; }
  function chestOf(id) {
    const f = fig(id);
    if (!f) return null;
    const h = heightOf(f);
    const t = headTop(id);
    if (!t) return null;
    return [t[0] - (f.fd || 1) * 0.02 * h, t[1] + 0.34 * h];
  }
  // 名字在人的头上以光（或以暗）聚成
  function nameOver(b, id, str, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const h = headTop(id) || [W.w * 0.75, W.h * 0.75], n = Array.from(str).length, u = SU();
    const size = Math.min(o.size || 30 * u, (W.w * 0.6) / (n * 1.08));
    let cy = h[1] - (o.lift || 34) * u - size * 0.5;
    cy = Math.max(cy, port() ? W.h * 0.38 : W.h * 0.14);
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(h[0], half + 8, W.w - half - 8);
    const src = o.src || (() => [h[0] + (Math.random() - 0.5) * 44 * u, h[1] + (Math.random() - 0.3) * 30 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 226, 160], src, { hold: o.hold || 2.4, dark: !!o.dark });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headTop(id);
    if (!h) return;
    const f = fig(id), hh = f ? heightOf(f) : 40;
    fx().sparkle(h[0], h[1] + hh * (frac == null ? 0.3 : frac), n || 20, rgb || [255, 232, 180], 14 * SU(), 'top');
  }
  function ringOn(b, id, rgb, r, frac) {
    if (b.instant || !fx()) return;
    const h = headTop(id);
    if (!h) return;
    const f = fig(id), hh = f ? heightOf(f) : 40;
    fx().ring(h[0], h[1] + hh * (frac == null ? 0.4 : frac), rgb || [255, 236, 190], M() * (r || 0.16), 2.2, 1.6);
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxAdd(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3, tail: 0 }, o)); }
  // 驿卒：骑快马沿着河对岸的城（中丘）奔向远方的各省
  function riders(b, col, n) {
    for (let i = 0; i < (n || 4); i++) fxAdd(b, { type: 'rider', delay: i * 0.7, dur: 7.5, x0: port() ? 0.93 : 0.95, x1: 0.48, col, seed: i });
  }
  // 书信化作光点，自王宫飞向各省的灯
  function letters(b, col, n) {
    const P = provModel().pts;
    for (let i = 0; i < (n || 22); i++) fxAdd(b, { type: 'letter', delay: i * 0.16, dur: 2.6 + hsh(i * 7.7) * 1.2, to: Math.floor(hsh(i * 3.3 + 1) * P.length), col, seed: i });
  }
  // 一点金光自一人手中传给另一人（戒指、谕旨）
  function passTo(b, a, bb, col) { fxAdd(b, { type: 'pass', a, b: bb, dur: 1.8, col: col || [255, 226, 150] }); }
  // 自天而降的一道光
  function beam(b, xf, o) { fxAdd(b, Object.assign({ type: 'beam', xf, dur: 5, w: 70, k: 1 }, o || {})); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘的柔光）与字
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], a0));
    gr.addColorStop(mid || 0.35, U.rgba(rgb[0], rgb[1], rgb[2], a0 * 0.32));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 222, 150], 1), white: radial([240, 244, 255], 1),
        pale: radial([226, 230, 255], 1), red: radial([220, 60, 44], 1, 0.4), ember: radial([255, 140, 60], 1, 0.3),
        lamp: radial([255, 160, 70], 1, 0.22), dark: radial([60, 20, 30], 1, 0.5), rose: radial([255, 196, 170], 1),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
      SP.amber = radial([255, 190, 100], 1, 0.4);
      // 金杖头上的光：八道细而柔的光（不像镜头的星芒），中间一团暖光
      const st = cnv(256, 256), q = st.getContext('2d');
      q.translate(128, 128);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + 0.2, L = i % 2 ? 78 : 124, w = i % 2 ? 1.3 : 2.1;
        const gr = q.createLinearGradient(0, 0, Math.cos(a) * L, Math.sin(a) * L);
        gr.addColorStop(0, 'rgba(255,240,204,0.9)'); gr.addColorStop(0.3, 'rgba(255,228,168,0.35)'); gr.addColorStop(1, 'rgba(255,214,140,0)');
        q.fillStyle = gr;
        q.beginPath(); q.moveTo(-Math.sin(a) * w, Math.cos(a) * w); q.lineTo(Math.cos(a) * L, Math.sin(a) * L); q.lineTo(Math.sin(a) * w, -Math.cos(a) * w); q.closePath(); q.fill();
      }
      const core = q.createRadialGradient(0, 0, 0, 0, 0, 44);
      core.addColorStop(0, 'rgba(255,244,214,0.75)'); core.addColorStop(0.4, 'rgba(255,226,160,0.22)'); core.addColorStop(1, 'rgba(255,214,140,0)');
      q.fillStyle = core; q.fillRect(-44, -44, 88, 88);
      SP.rays = st;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0.5)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  const FONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  const TXT = new Map();
  function textSprite(str, px, rgb, halo) {
    const dpr = Math.min(2, W.dpr || 1), key = str + '|' + px + '|' + dpr + '|' + rgb.join(',') + '|' + (halo || 0);
    let s = TXT.get(key);
    if (s) return s;
    if (TXT.size > 200) TXT.clear();
    try {
      const c = document.createElement('canvas'), g = c.getContext('2d');
      const font = Math.round(px * dpr) + 'px ' + FONT;
      g.font = font;
      const tw = Math.ceil(g.measureText(str).width) + Math.ceil(20 * dpr);
      c.width = Math.max(4, tw); c.height = Math.ceil(px * 2 * dpr);
      g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.shadowColor = 'rgba(10, 8, 14, ' + (halo == null ? 0.7 : halo) + ')'; g.shadowBlur = 5 * dpr;
      g.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
      g.fillText(str, c.width / 2, c.height / 2);
      g.shadowColor = U.rgba(rgb[0], rgb[1], rgb[2], 0.6); g.shadowBlur = 10 * dpr;
      g.fillText(str, c.width / 2, c.height / 2);
      s = { c, w: c.width / dpr, h: c.height / dpr };
    } catch (e) { s = null; }
    TXT.set(key, s);
    return s;
  }
  function drawText(ctx, str, x, y, px, rgb, a, sc, halo) {
    if (a < 0.01) return;
    const s = textSprite(str, px, rgb, halo == null ? null : Math.round(halo * 10) / 10);
    if (!s) return;
    const k = sc || 1;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(s.c, x - (s.w * k) / 2, y - (s.h * k) / 2, s.w * k, s.h * k);
  }
  function loadFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('20px "GS Kai"', '正二三四五六七八九十一月普珥末底改').then(() => TXT.clear()).catch(() => {});
        if (document.fonts.ready) document.fonts.ready.then(() => TXT.clear()).catch(() => {});
      }
    } catch (e) { /* 老浏览器：用系统字 */ }
  }
  // 火苗（灯）
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.4, k * (0.3 + 0.45 * nightK()));
    ctx.globalAlpha = k * 0.8;
    ctx.fillStyle = 'rgb(255,150,60)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.24, y);
    ctx.quadraticCurveTo(x - h * 0.22, y - h * 0.5 * f, x + Math.sin(W.t * 7 + seed) * h * 0.1, y - h * f);
    ctx.quadraticCurveTo(x + h * 0.22, y - h * 0.5 * f, x + h * 0.24, y);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = k * 0.9;
    ctx.fillStyle = 'rgb(255,236,180)';
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.25, h * 0.1, h * 0.22 * f, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：御园（1:5–6）——白玉石柱、白绿蓝的帐子、金银的床榻、红白黄黑的铺石地、柏树
  // ════════════════════════════════════════════════════════════
  const MARBLE = [238, 234, 224], HANG = [[244, 240, 230], [98, 156, 116], [76, 116, 184]], CORD = [134, 66, 138], SILVER = [214, 218, 228];
  const GOLD = [236, 194, 100], TILE = [[184, 74, 62], [240, 234, 222], [228, 188, 92], [58, 50, 52]];
  const CYP = [46, 82, 58];
  function cypress(ctx, xf, H, k, seed) {
    const x = xf * W.w, y = FY(xf) + 2 * k, w = H * 0.13;
    const d = litX() >= x ? 1 : -1, sway = Math.sin(W.t * 0.7 + seed) * 0.8 * k;
    ctx.fillStyle = css([70, 52, 40], 2);
    ctx.fillRect(x - 0.9 * k, y - 5 * k, 1.8 * k, 5 * k);
    const body = () => {
      ctx.beginPath();
      ctx.moveTo(x + sway, y - H);
      ctx.quadraticCurveTo(x + w * 1.15 + sway * 0.5, y - H * 0.55, x + w * 0.62, y - 4 * k);
      ctx.lineTo(x - w * 0.62, y - 4 * k);
      ctx.quadraticCurveTo(x - w * 1.15 + sway * 0.5, y - H * 0.55, x + sway, y - H);
      ctx.closePath();
    };
    ctx.fillStyle = css(CYP, 2);
    body(); ctx.fill();
    // 背光的半边
    ctx.save();
    body(); ctx.clip();
    ctx.fillStyle = css([20, 36, 30], 2, 0.45);
    ctx.fillRect(d > 0 ? x - w * 1.2 : x + w * 0.1, y - H, w * 1.1, H);
    ctx.restore();
    ctx.strokeStyle = css([210, 236, 190], 2, 0.35 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.6, 0.9 * k);
    ctx.beginPath();
    ctx.moveTo(x + sway, y - H);
    ctx.quadraticCurveTo(x + d * w * 1.15 + sway * 0.5, y - H * 0.55, x + d * w * 0.62, y - 4 * k);
    ctx.stroke();
  }
  // 一张床榻（金或银）：座高 seat（人的尺度），可坐（坐处在 x）
  function couch(ctx, x, y, w, seat, col, back, dir, a) {
    ctx.globalAlpha = a;
    ctx.fillStyle = css(mix(col, [60, 40, 30], 0.35), 2);
    ctx.fillRect(x - w / 2 + 0.6 * seat * 0.15, y - seat * 0.8, seat * 0.12, seat * 0.8);
    ctx.fillRect(x + w / 2 - seat * 0.22, y - seat * 0.8, seat * 0.12, seat * 0.8);
    ctx.fillStyle = css(col, 2, 1, 0.08);
    ctx.fillRect(x - w / 2, y - seat, w, seat * 0.24);
    // 靠背（王的榻）
    if (back) {
      const bx = x - dir * w * 0.48;
      ctx.beginPath();
      ctx.moveTo(bx, y - seat);
      ctx.lineTo(bx, y - seat * 1.9);
      ctx.quadraticCurveTo(bx - dir * seat * 0.1, y - seat * 2.05, bx - dir * seat * 0.3, y - seat * 1.95);
      ctx.lineTo(bx - dir * seat * 0.3, y - seat);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css([255, 246, 220], 2, 0.5 * dayA(), 0.2);
    ctx.fillRect(x - w / 2, y - seat, w, Math.max(0.5, seat * 0.05));
    // 褥子
    ctx.fillStyle = css(mix(col, [150, 60, 90], 0.55), 2, 0.9);
    ctx.fillRect(x - w / 2 + seat * 0.1, y - seat * 1.08, w - seat * 0.2, seat * 0.1);
    ctx.globalAlpha = 1;
  }
  function gardenTops() {
    const P_ = X(), k = BK(), PH = 64 * k;
    return P_.pillars.map(xf => [xf * W.w, FY(xf) + 1 * k - PH]);
  }
  // 静的：红白黄黑的铺石地、白玉石柱（存在离屏的画布上）
  function drawGardenStatic(ctx) {
    const P_ = X(), k = BK(), T = terrace();
    const d = litX() >= P_.couch * W.w ? 1 : -1;
    const N = 20, x0 = P_.g0, x1 = P_.g1;
    ctx.fillStyle = css([204, 188, 158], 2);
    ctx.fillRect(x0 * W.w, T.yF - 0.8 * k, (x1 - x0) * W.w, T.TD + 0.8 * k);
    const cw = ((x1 - x0) * W.w) / N, nr = Math.max(2, Math.floor((T.TD - 0.3 * k) / (2.5 * k)));
    for (let c = 0; c < 4; c++) {
      ctx.fillStyle = css(TILE[c], 2, 0.85);
      ctx.beginPath();
      for (let r = 0; r < nr; r++) for (let i = 0; i < N; i++) {
        if ((i + r * 2) % 4 !== c) continue;
        const xf = lerp(x0, x1, (i + 0.5) / N), y = T.yF + (0.3 + r * 2.5) * k;
        ctx.rect(xf * W.w - cw * 0.42, y, cw * 0.84, 2 * k);
      }
      ctx.fill();
    }
    const PH = 64 * k, PW = 4.4 * k;
    for (const xf of P_.pillars) {
      const x = xf * W.w, y = FY(xf) + 1 * k;
      ctx.fillStyle = css(MARBLE, 2);
      ctx.fillRect(x - PW * 0.85, y - 3 * k, PW * 1.7, 3 * k);
      ctx.fillRect(x - PW / 2, y - PH, PW, PH);
      ctx.fillRect(x - PW * 0.8, y - PH - 2.6 * k, PW * 1.6, 2.6 * k);
      ctx.fillStyle = css([150, 146, 142], 2, 0.4);
      ctx.fillRect(d > 0 ? x - PW / 2 : x + PW * 0.1, y - PH, PW * 0.4, PH);
      ctx.strokeStyle = css([255, 252, 240], 2, 0.5 * dayA(), 0.3); ctx.lineWidth = Math.max(0.5, 0.8 * k);
      ctx.beginPath(); ctx.moveTo(x + d * PW / 2, y - PH); ctx.lineTo(x + d * PW / 2, y - 3 * k); ctx.stroke();
    }
  }
  // 动的：柏树（随风）、床榻与金器皿、帐子、银环、灯
  function drawGardenLive(ctx) {
    const P_ = X(), k = BK(), pk = PK();
    const hang = W.lv.etHang, feast = W.lv.etFeast;
    const x0 = P_.g0, x1 = P_.g1;
    P_.cyp.forEach((xf, i) => cypress(ctx, xf, (i ? 74 : 82) * k, k, i * 2.3));
    const tops = gardenTops();
    // 床榻与金器皿（筵席）
    if (feast > 0.01) {
      for (let i = 0; i < tops.length - 1; i++) {
        const xf = (P_.pillars[i] + P_.pillars[i + 1]) / 2, x = xf * W.w, y = FY(xf) + 1.2 * pk;
        const king = Math.abs(xf - P_.couch) < 0.005;
        couch(ctx, x, y, (king ? 15 : 13) * pk, 11 * pk, i % 2 ? SILVER : GOLD, king, 1, feast);
      }
      // 矮几上的金器皿：一闪一闪
      ctx.globalAlpha = feast;
      for (let i = 0; i < 6; i++) {
        const xf = lerp(x0 + 0.01, x1 - 0.01, (i + 0.5) / 6), x = xf * W.w, y = FY(xf) + 2.5 * pk;
        ctx.fillStyle = css([150, 110, 70], 2);
        ctx.fillRect(x - 3 * pk, y - 3.5 * pk, 6 * pk, 1 * pk);
        ctx.fillStyle = css(GOLD, 2, 1, 0.15);
        ctx.fillRect(x - 2 * pk, y - 5.6 * pk, 1.4 * pk, 2.1 * pk);
        ctx.fillRect(x + 0.6 * pk, y - 5 * pk, 1.2 * pk, 1.5 * pk);
        const tw = Math.pow(Math.max(0, Math.sin(W.t * 1.7 + i * 2.1)), 12);
        if (tw > 0.05 && SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, x - 1.3 * pk, y - 5.4 * pk, 4 * pk, feast * tw * 0.9); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = feast; }
      }
      ctx.globalAlpha = 1;
    }
    // 帐子：白色、绿色、蓝色，用细麻绳、紫色绳从银环内系在白玉石柱上
    if (hang > 0.01) {
      const wind = 0.5 + Math.abs(W.wind || 0);
      for (let i = 0; i < tops.length - 1; i++) {
        const a = tops[i], b = tops[i + 1];
        const ay = a[1] + 5 * k, by = b[1] + 5 * k, mx = (a[0] + b[0]) / 2, my = (ay + by) / 2;
        const drop = (3 + 12 * hang) * k, sway = Math.sin(W.t * 1.1 + i * 1.7) * 1.4 * k * wind;
        ctx.globalAlpha = Math.min(1, hang * 1.2) * 0.93;
        ctx.fillStyle = css(HANG[i % 3], 2, 1, 0.08);
        ctx.beginPath();
        ctx.moveTo(a[0], ay);
        ctx.quadraticCurveTo(mx, my + 3.5 * k, b[0], by);
        ctx.lineTo(b[0], by + 4 * k * hang);
        ctx.quadraticCurveTo(mx + sway, my + drop * 2 + 3.5 * k, a[0], ay + 4 * k * hang);
        ctx.closePath(); ctx.fill();
        // 褶
        ctx.strokeStyle = css(mix(HANG[i % 3], [40, 50, 60], 0.3), 2, 0.4);
        ctx.lineWidth = Math.max(0.5, 0.7 * k);
        ctx.beginPath();
        for (const t of [0.3, 0.5, 0.7]) {
          const px = lerp(a[0], b[0], t), py0 = lerp(ay, by, t) + 3 * k * (1 - Math.abs(t - 0.5) * 2);
          ctx.moveTo(px, py0); ctx.lineTo(px + sway * 0.5, py0 + drop * (1 - Math.abs(t - 0.5) * 1.2));
        }
        ctx.stroke();
        // 紫色绳
        ctx.strokeStyle = css(CORD, 2, 0.9, 0.05);
        ctx.lineWidth = Math.max(0.6, 0.9 * k);
        ctx.beginPath(); ctx.moveTo(a[0], ay); ctx.quadraticCurveTo(mx, my + 3.5 * k, b[0], by); ctx.stroke();
      }
      // 两边垂下的帐子
      for (const [i, s] of [[0, -1], [tops.length - 1, 1]]) {
        const t = tops[i], y = t[1] + 5 * k, sw = Math.sin(W.t * 0.9 + i) * 1 * k * wind;
        ctx.globalAlpha = Math.min(1, hang * 1.2) * 0.9;
        ctx.fillStyle = css(HANG[tops.length > 3 ? (i + 1) % 3 : 2], 2, 1, 0.06);
        ctx.beginPath();
        ctx.moveTo(t[0], y); ctx.lineTo(t[0] + s * 5 * k, y);
        ctx.quadraticCurveTo(t[0] + s * 3 * k + sw, y + 22 * k * hang, t[0] + s * 1.2 * k + sw, y + 40 * k * hang);
        ctx.lineTo(t[0] + sw * 0.5, y + 40 * k * hang);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // 银环
      ctx.strokeStyle = css(SILVER, 2, 0.95, 0.2);
      ctx.lineWidth = Math.max(0.6, 0.8 * k);
      ctx.beginPath();
      for (const t of tops) { ctx.moveTo(t[0] + 1.4 * k, t[1] + 5 * k); ctx.arc(t[0], t[1] + 5 * k, 1.4 * k, 0, TAU); }
      ctx.stroke();
      // 夜里挂在帐下的灯
      const lk = hang * Math.max(nightK(), feast * 0.4);
      if (lk > 0.03) for (let i = 0; i < tops.length - 1; i++) {
        const a = tops[i], b = tops[i + 1];
        flame(ctx, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 22 * k * hang, 3 * k, lk, i * 3.1);
      }
    }
  }
  // 陇沟的水：一道窄窄的石渠自御园流过；「王的心在耶和华手中，好像陇沟的水随意流转」
  let rillPh = 0;
  const RILLV = () => (port() ? 0.2 : 0.27);
  function drawRill(ctx) {
    const P_ = X(), k = BK(), v = RILLV(), N = 14;
    const r0 = P_.rill0, r1 = P_.rill1;
    const pts = [];
    for (let i = 0; i <= N; i++) { const xf = lerp(r0, r1, i / N); pts.push([xf * W.w, fieldY(xf, v)]); }
    const band = (w, col, a) => {
      ctx.fillStyle = col; ctx.globalAlpha = a;
      ctx.beginPath();
      pts.forEach((p, i) => { if (i) ctx.lineTo(p[0], p[1] - w); else ctx.moveTo(p[0], p[1] - w); });
      for (let i = N; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + w);
      ctx.closePath(); ctx.fill();
    };
    band(2.3 * k, css([176, 164, 138], 2), 0.85);
    band(1.4 * k, css([46, 88, 124], 2, 1, 0.05), 1);
    band(0.5 * k, css([120, 170, 200], 2, 1, 0.1), 0.35);
    const at = uu => { const f = clamp(uu, 0, 1) * N, i = Math.min(N - 1, Math.floor(f)), t = f - i; return [lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]; };
    // 水面的光：随水流动（流向由 etRill 定）；金杖伸出后泛金
    const gold = clamp(W.lv.etGold * 0.8 + Math.max(0, W.lv.etRill) * 0.25, 0, 1);
    const col = mix([220, 236, 250], [255, 214, 120], gold);
    ctx.fillStyle = rgba(W.shade(col, 0, 0.3), 1);
    const n = 9;
    ctx.globalAlpha = 0.55 + 0.4 * gold;
    ctx.beginPath();
    for (let j = 0; j < n; j++) {
      const p = at(U.fract(j / n + rillPh + hsh(j) * 0.05));
      const L = (5 + 3 * hsh(j * 3)) * k;
      ctx.rect(p[0] - L / 2, p[1] - 0.5 * k, L, 1 * k);
    }
    ctx.fill();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      if (gold > 0.2) for (let j = 0; j < 3; j++) { const p = at(U.fract(j / 3 + rillPh)); glowAt(ctx, SP.gold, p[0], p[1], 7 * k, gold * 0.5); }
      // 陇沟的水转向的那一刻：一道金光带着尾巴顺着沟流向王宫，到了台脚亮一下
      for (const e of FXL) {
        if (e.type !== 'pulse') continue;
        const t = e.t - (e.delay || 0);
        if (t < 0) continue;
        const p = clamp(t / e.dur, 0, 1), head = smoothstep(0, 0.8, p), fade = 1 - smoothstep(0.85, 1, p);
        for (let j = 0; j < 12; j++) {
          const uu = head - j * 0.022;
          if (uu < 0) break;
          const q = at(uu);
          glowAt(ctx, SP.gold, q[0], q[1], (9 - j * 0.55) * k, (1 - j / 12) * 0.9 * fade);
        }
        const hq = at(head);
        ctx.globalAlpha = 0.9 * fade; ctx.fillStyle = 'rgb(255,246,214)';
        ctx.fillRect(hq[0] - 3 * k, hq[1] - 0.8 * k, 6 * k, 1.6 * k);
        if (p > 0.75) { const q = smoothstep(0.75, 1, p), end = at(1); glowAt(ctx, SP.gold, end[0], end[1] - 2 * k, (10 + 16 * q) * k, 0.7 * Math.sin(Math.PI * q)); }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：王宫——内院与柱廊的大殿；宝座在殿里，对着殿门（5:1）
  // ════════════════════════════════════════════════════════════
  const STONE = [228, 216, 192], GLAZE = [48, 82, 150], GLAZE_D = [26, 36, 64], YEL = [232, 192, 104], CEDAR = [120, 82, 54], TURQ = [74, 154, 162];
  const PURPLE = [110, 50, 110];
  const HALL_H = 114, BEAM = 8;
  function hallGeom() {
    const P_ = X(), k = BK(), yF = terrace().yF;
    const top = yF - (HALL_H + BEAM) * k;
    return { k, top, gMin: yF, gMax: yF, yF, x0: P_.hall0 * W.w, x1: P_.hall1 * W.w, c0: P_.court0 * W.w };
  }
  // 殿台：平的台面（浅色的铺石）、向前的一面（石层与一道琉璃砖）、内院门前向下的台阶
  const FACE = [192, 176, 146], TOPS = [212, 200, 176];
  function drawTerrace(ctx) {
    const T = terrace(), P_ = X(), k = T.k, x0 = T.a * W.w, x1 = T.b * W.w, yF = T.yF, TD = T.TD;
    const N = 28, top = yF + TD;
    const bot = x => Math.max(top, gY(2, x / W.w) + TD + 1.5 * k);
    const face = () => {
      ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top);
      for (let i = N; i >= 0; i--) { const x = lerp(x0, x1, i / N); ctx.lineTo(x, bot(x)); }
      ctx.closePath();
    };
    ctx.fillStyle = css(FACE, 2);
    face(); ctx.fill();
    ctx.save(); face(); ctx.clip();
    // 石层
    ctx.strokeStyle = css([120, 104, 84], 2, 0.4); ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    let row = 0;
    for (let y = top + 5.2 * k; y < top + 80 * k; y += 5.2 * k, row++) {
      ctx.moveTo(x0, y); ctx.lineTo(x1, y);
      const step = 11 * k, off = (row % 2) * step * 0.5;
      for (let x = x0 + off; x < x1; x += step) { ctx.moveTo(x, y - 5.2 * k); ctx.lineTo(x, y); }
    }
    ctx.stroke();
    // 一道琉璃砖（蓝）与其下的暗影
    ctx.fillStyle = css(GLAZE, 2, 0.9, 0.04);
    ctx.fillRect(x0, top + 1.2 * k, x1 - x0, 2.6 * k);
    ctx.fillStyle = css([40, 30, 26], 2, 0.28);
    ctx.fillRect(x0, top, x1 - x0, 1.2 * k);
    ctx.restore();
    // 左端的侧面（背光）
    ctx.fillStyle = css([90, 78, 64], 2, 0.35);
    ctx.fillRect(x0, top, 2.2 * k, bot(x0) - top);
    // 内院门前的台阶：自台面向前（向下）铺下来
    const sx = (P_.court0 - (port() ? 0.016 : 0.012)) * W.w, sb = bot(sx), n = Math.max(2, Math.round((sb - top) / (3.2 * k)));
    if (sb - top > 3 * k) {
      for (let i = 0; i < n; i++) {
        const y0 = lerp(top - 0.5 * k, sb, i / n), y1 = lerp(top - 0.5 * k, sb, (i + 1) / n), hw = (7 + 3.2 * (i + 1) / n) * k;
        ctx.fillStyle = css(i % 2 ? [214, 202, 178] : [228, 218, 196], 2);
        ctx.fillRect(sx - hw, y0, hw * 2, y1 - y0 + 0.3);
        ctx.fillStyle = css([110, 96, 80], 2, 0.35);
        ctx.fillRect(sx - hw, y1 - 0.7 * k, hw * 2, 0.7 * k);
      }
      ctx.fillStyle = css(STONE, 2);
      for (const s of [-1, 1]) ctx.fillRect(sx + s * (10.2 * k) - 1.2 * k, top - 1 * k, 2.4 * k, sb - top + 1 * k);
    }
    // 台面
    ctx.fillStyle = css(TOPS, 2);
    ctx.fillRect(x0, yF - 0.6 * k, x1 - x0, TD + 0.6 * k);
    ctx.fillStyle = css([150, 138, 118], 2, 0.35);
    for (let i = 1; i < 3; i++) ctx.fillRect(x0, yF + (TD * i) / 3, x1 - x0, Math.max(0.4, 0.4 * k));
    ctx.strokeStyle = css([255, 250, 236], 2, 0.55 * dayA(), 0.3); ctx.lineWidth = Math.max(0.5, 0.8 * k);
    ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.stroke();
  }
  // 牛首的柱头、钟形的柱础
  function column(ctx, x, yb, ytop, k, d) {
    ctx.fillStyle = css(STONE, 2);
    // 柱础
    ctx.fillRect(x - 5.2 * k, yb - 1.4 * k, 10.4 * k, 1.4 * k);
    ctx.beginPath();
    ctx.moveTo(x - 4.4 * k, yb - 1.4 * k);
    ctx.quadraticCurveTo(x - 4 * k, yb - 4.6 * k, x - 2 * k, yb - 5.6 * k);
    ctx.lineTo(x + 2 * k, yb - 5.6 * k);
    ctx.quadraticCurveTo(x + 4 * k, yb - 4.6 * k, x + 4.4 * k, yb - 1.4 * k);
    ctx.closePath(); ctx.fill();
    // 柱身
    const cap = ytop + 11 * k;
    ctx.fillRect(x - 1.9 * k, cap, 3.8 * k, yb - 5.6 * k - cap);
    // 柱头：卷叶与背对背的两个牛首
    ctx.fillRect(x - 2.7 * k, cap - 5.5 * k, 5.4 * k, 5.5 * k);
    ctx.fillRect(x - 6.4 * k, ytop, 12.8 * k, 4.6 * k);
    ctx.beginPath();
    ctx.ellipse(x - 6.8 * k, ytop + 2.6 * k, 2.1 * k, 1.9 * k, 0, 0, TAU);
    ctx.ellipse(x + 6.8 * k, ytop + 2.6 * k, 2.1 * k, 1.9 * k, 0, 0, TAU);
    ctx.fill();
    ctx.fillRect(x - 5.6 * k, ytop + 4.6 * k, 1.4 * k, 2.4 * k);
    ctx.fillRect(x + 4.2 * k, ytop + 4.6 * k, 1.4 * k, 2.4 * k);
    // 背光的一面、凹槽
    ctx.fillStyle = css([120, 110, 96], 2, 0.42);
    ctx.fillRect(d > 0 ? x - 1.9 * k : x + 0.5 * k, cap, 1.4 * k, yb - 5.6 * k - cap);
    ctx.strokeStyle = css([150, 138, 116], 2, 0.5); ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath(); ctx.moveTo(x - 0.5 * k, cap); ctx.lineTo(x - 0.5 * k, yb - 5.6 * k); ctx.moveTo(x + 0.7 * k, cap); ctx.lineTo(x + 0.7 * k, yb - 5.6 * k); ctx.stroke();
    // 角
    ctx.strokeStyle = css([200, 180, 140], 2, 0.9); ctx.lineWidth = Math.max(0.5, 0.7 * k);
    ctx.beginPath();
    ctx.moveTo(x - 7.4 * k, ytop + 1.2 * k); ctx.quadraticCurveTo(x - 8.8 * k, ytop - 0.4 * k, x - 8.2 * k, ytop - 1.4 * k);
    ctx.moveTo(x + 7.4 * k, ytop + 1.2 * k); ctx.quadraticCurveTo(x + 8.8 * k, ytop - 0.4 * k, x + 8.2 * k, ytop - 1.4 * k);
    ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css([255, 248, 230], 2, 0.45 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.8 * k);
    ctx.beginPath(); ctx.moveTo(x + d * 1.9 * k, cap); ctx.lineTo(x + d * 1.9 * k, yb - 5.6 * k); ctx.stroke();
  }
  // 阶梯形的垛口（波斯的样式）
  function merlons(ctx, xa, xb, y, k, col) {
    const step = 7.6 * k, n = Math.max(1, Math.floor((xb - xa) / step));
    const off = xa + ((xb - xa) - n * step) / 2 + step / 2;
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = off + i * step;
      ctx.moveTo(x - 3 * k, y); ctx.lineTo(x - 3 * k, y - 2.3 * k); ctx.lineTo(x - 2 * k, y - 2.3 * k); ctx.lineTo(x - 2 * k, y - 4.6 * k);
      ctx.lineTo(x - 1 * k, y - 4.6 * k); ctx.lineTo(x - 1 * k, y - 7 * k); ctx.lineTo(x + 1 * k, y - 7 * k); ctx.lineTo(x + 1 * k, y - 4.6 * k);
      ctx.lineTo(x + 2 * k, y - 4.6 * k); ctx.lineTo(x + 2 * k, y - 2.3 * k); ctx.lineTo(x + 3 * k, y - 2.3 * k); ctx.lineTo(x + 3 * k, y);
      ctx.closePath();
    }
    ctx.fill();
  }
  // 琉璃砖上的一行狮子（面向殿门）
  function lions(ctx, xa, xb, y, k, a) {
    const n = Math.max(3, Math.floor((xb - xa) / (15 * k)));
    ctx.fillStyle = css(YEL, 2, a, 0.1);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = lerp(xa, xb, (i + 0.5) / n);
      if (k < 0.7) { ctx.rect(x - 3 * k, y - 1 * k, 6 * k, 2 * k); continue; }
      ctx.moveTo(x + 3.2 * k, y); ctx.ellipse(x, y, 3.2 * k, 1.4 * k, 0, 0, TAU);
      ctx.moveTo(x - 2.4 * k, y - 1.2 * k); ctx.arc(x - 3.6 * k, y - 1.2 * k, 1.3 * k, 0, TAU);
      ctx.rect(x - 2.6 * k, y + 0.6 * k, 0.8 * k, 2 * k); ctx.rect(x + 1.8 * k, y + 0.6 * k, 0.8 * k, 2 * k);
      ctx.rect(x + 3 * k, y - 1.6 * k, 2.4 * k, 0.6 * k);
    }
    ctx.fill();
  }
  function rosettes(ctx, xa, xb, y, k, a) {
    const n = Math.max(3, Math.floor((xb - xa) / (5.5 * k)));
    ctx.fillStyle = css([236, 228, 206], 2, a, 0.1);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = lerp(xa, xb, (i + 0.5) / n); ctx.moveTo(x + 1.2 * k, y); ctx.arc(x, y, 1.2 * k, 0, TAU); }
    ctx.fill();
  }
  // 一串灯：一根下垂的绳上挂着小灯（普珥日、光荣之夜）
  function lampString(ctx, xa, xb, y, k, a) {
    if (a < 0.02 || !SP) return;
    const n = Math.max(3, Math.floor((xb - xa) / (11 * k))), seg = (xb - xa) / n, sag = 3.2 * k;
    ctx.globalAlpha = Math.min(1, a) * 0.6;
    ctx.strokeStyle = 'rgba(70,50,40,0.9)'; ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const xa2 = xa + i * seg; ctx.moveTo(xa2, y); ctx.quadraticCurveTo(xa2 + seg / 2, y + sag * 2, xa2 + seg, y); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    const nk = 0.45 + 0.55 * nightK();
    for (let i = 0; i < n; i++) {
      const x = xa + (i + 0.5) * seg, yy = y + sag, tw = 0.75 + 0.25 * Math.sin(W.t * 2.1 + i * 1.9 + xa * 0.01);
      if ((W.quality || 1) >= 0.75) glowAt(ctx, SP.lamp, x, yy, 6 * k, a * tw * nk * 0.7);
      ctx.globalAlpha = Math.min(1, a * tw);
      ctx.fillStyle = 'rgb(255,220,150)';
      ctx.fillRect(x - 0.9 * k, yy - 0.9 * k, 1.8 * k, 1.8 * k);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 殿的墙：平的台面之上（墙脚在 yF 之下一点）
  function wallRect(ctx, xa, xb, ytop, k, extra) {
    const yF = terrace().yF;
    ctx.beginPath(); ctx.rect(xa, ytop, xb - xa, yF + (extra || 1) * k - ytop);
  }
  const lampKOf = () => Math.max(nightK() * 0.9, W.lv.etBanquet * 0.7, W.lv.etKingLamp, W.lv.etLamps * 0.8);
  const COLF = [0.07, 0.35, 0.61, 0.955];
  const DOORF = [0.2, 0.47];
  // ── 静的部分（墙、砖、门、狮子、内院的矮墙）：画一次，存在离屏的画布上；光线变了再重画 ──
  function drawPalaceBack(ctx) {
    const P_ = X(), G = hallGeom(), k = G.k;
    const { x0, x1, c0, top, yF } = G;
    const gold = W.lv.etGold;
    const wallTop = top + BEAM * k, Hh = yF - wallTop;
    // 大殿的里面：琉璃砖墙（上暗下明），砖缝只在墙上
    const inner = mix(mix(GLAZE, [34, 40, 70], 0.28), [150, 110, 50], gold * 0.3);
    ctx.fillStyle = css(inner, 2);
    wallRect(ctx, x0, x1, wallTop, k, 1); ctx.fill();
    ctx.save();
    wallRect(ctx, x0, x1, wallTop, k, 0); ctx.clip();
    ctx.strokeStyle = css(mix(inner, [10, 14, 28], 0.4), 2, 0.35);
    ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    for (let yy = wallTop + Hh * 0.62; yy < yF; yy += 5.5 * k) { ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); }
    ctx.stroke();
    ctx.restore();
    // 后墙的门（暗；夜里的灯光另画）
    for (const f of DOORF) {
      const dx = lerp(x0, x1, f), dy = yF + 1 * k, dw = 8 * k, dh = Hh * 0.36;
      ctx.fillStyle = css([18, 16, 22], 2);
      ctx.beginPath(); ctx.moveTo(dx - dw / 2, dy); ctx.lineTo(dx - dw / 2, dy - dh); ctx.quadraticCurveTo(dx, dy - dh - 5 * k, dx + dw / 2, dy - dh); ctx.lineTo(dx + dw / 2, dy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(STONE, 2, 0.9);
      ctx.fillRect(dx - dw / 2 - 1.2 * k, dy - dh - 5.5 * k, dw + 2.4 * k, 1.4 * k);
    }
    // 上部的暗影（屋顶之下）
    const sh = ctx.createLinearGradient(0, wallTop, 0, wallTop + Hh * 0.55);
    sh.addColorStop(0, 'rgba(8,10,22,' + (0.55 * dayA()).toFixed(3) + ')');
    sh.addColorStop(1, 'rgba(8,10,22,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(x0, wallTop, x1 - x0, Hh * 0.55);
    // 墙上：金狮一行、一行玫瑰花饰、墙脚
    const fy = wallTop + Hh * 0.46;
    ctx.fillStyle = css(mix(GLAZE, [255, 210, 120], gold * 0.25), 2, 1, 0.04);
    ctx.fillRect(x0, fy - 5.5 * k, x1 - x0, 11 * k);
    lions(ctx, x0 + 4 * k, x1 - 4 * k, fy, k, 0.95);
    ctx.fillStyle = css(TURQ, 2, 0.9, 0.05);
    ctx.fillRect(x0, fy - 7 * k, x1 - x0, 1.2 * k); ctx.fillRect(x0, fy + 5.8 * k, x1 - x0, 1.2 * k);
    ctx.fillStyle = css(GLAZE, 2, 0.9);
    ctx.fillRect(x0, wallTop + 2 * k, x1 - x0, 6 * k);
    rosettes(ctx, x0 + 2 * k, x1 - 2 * k, wallTop + 5 * k, k, 0.9);
    ctx.fillStyle = css([222, 212, 190], 2, 0.9);
    wallRect(ctx, x0, x1, yF - 6 * k, k, 1); ctx.fill();
    ctx.fillStyle = css(TURQ, 2, 0.85, 0.05);
    ctx.fillRect(x0, yF - 7.2 * k, x1 - x0, 1.2 * k);
    // 内院：矮墙、门口的两根柱
    const cTop = yF - 20 * k;
    ctx.fillStyle = css(mix(GLAZE, [60, 60, 70], 0.25), 2);
    wallRect(ctx, c0, x0, cTop, k, 1); ctx.fill();
    ctx.fillStyle = css(STONE, 2);
    ctx.fillRect(c0, cTop - 2 * k, x0 - c0, 2.4 * k);
    rosettes(ctx, c0 + 3 * k, x0 - 2 * k, cTop + 4 * k, k, 0.8);
    lions(ctx, c0 + 6 * k, x0 - 4 * k, cTop + 11 * k, k * 0.8, 0.75);
    const gp = [c0 + 2 * k, c0 + 9 * k];
    ctx.fillStyle = css(STONE, 2);
    for (const x of gp) {
      const y = yF + 1 * k;
      ctx.fillRect(x - 1.6 * k, y - 34 * k, 3.2 * k, 34 * k);
      ctx.fillRect(x - 2.6 * k, y - 36 * k, 5.2 * k, 2.2 * k);
    }
    ctx.fillRect(gp[0] - 2.6 * k, yF - 38 * k, gp[1] - gp[0] + 5.2 * k, 3 * k);
  }
  // 柱、香柏木的梁、垛口、殿中的两座灯台（静的，在宝座之前）
  function drawPalaceFront(ctx) {
    const G = hallGeom(), k = G.k;
    const { x0, x1, top, yF } = G;
    const d = litX() >= (x0 + x1) / 2 ? 1 : -1;
    const wallTop = top + BEAM * k;
    for (const f of COLF) { const x = lerp(x0, x1, f); column(ctx, x, yF + 1 * k, wallTop, k, d); }
    ctx.fillStyle = css(CEDAR, 2);
    ctx.fillRect(x0 - 9 * k, top, x1 - x0 + 18 * k, BEAM * k);
    ctx.fillStyle = css(GLAZE, 2, 0.95);
    ctx.fillRect(x0 - 9 * k, top + 2.2 * k, x1 - x0 + 18 * k, 2.6 * k);
    ctx.fillStyle = css(YEL, 2, 0.9, 0.1);
    for (let i = 0; i < 30; i++) { const x = lerp(x0 - 7 * k, x1 + 7 * k, (i + 0.5) / 30); ctx.fillRect(x - 0.6 * k, top + 3 * k, 1.2 * k, 1 * k); }
    merlons(ctx, x0 - 9 * k, x1 + 9 * k, top, k, css(STONE, 2));
    ctx.strokeStyle = css([255, 246, 222], 2, 0.5 * dayA(), 0.3); ctx.lineWidth = Math.max(0.5, 0.9 * k);
    ctx.beginPath(); ctx.moveTo(x0 - 9 * k, top); ctx.lineTo(x1 + 9 * k, top); ctx.stroke();
    for (const f of [0.2, 0.83]) {
      const x = lerp(x0, x1, f), y = yF + 1 * k;
      ctx.fillStyle = css([150, 118, 70], 2);
      ctx.fillRect(x - 0.6 * k, y - 26 * k, 1.2 * k, 26 * k);
      ctx.fillRect(x - 2.6 * k, y - 27 * k, 5.2 * k, 1.4 * k);
      ctx.fillRect(x - 2.4 * k, y - 1.2 * k, 4.8 * k, 1.2 * k);
    }
  }
  // ── 动的部分：门里的灯、墙上的光（灯、金、怒）、金杖伸出时殿里暗下来、旗 ──
  function drawPalaceLive(ctx) {
    const G = hallGeom(), k = G.k;
    const { x0, x1, c0, top, yF } = G;
    const gold = W.lv.etGold, wrath = W.lv.etWrath, sc = W.lv.etScepter;
    const wallTop = top + BEAM * k, Hh = yF - wallTop;
    const lampK = lampKOf();
    // 金杖伸出时：殿里暗下来，好让那一道金光最亮
    if (sc > 0.01) {
      ctx.globalAlpha = Math.min(1, sc) * 0.62;
      ctx.fillStyle = 'rgb(14,16,34)';
      ctx.fillRect(x0, wallTop, x1 - x0, Hh + 1 * k);
      ctx.globalAlpha = 1;
    }
    if (lampK > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lampK) * 0.75;
      ctx.fillStyle = 'rgb(255,168,84)';
      for (const f of DOORF) {
        const dx = lerp(x0, x1, f), dy = yF + 1 * k, dw = 8 * k, dh = Hh * 0.36;
        ctx.beginPath(); ctx.moveTo(dx - dw / 2, dy); ctx.lineTo(dx - dw / 2, dy - dh); ctx.quadraticCurveTo(dx, dy - dh - 5 * k, dx + dw / 2, dy - dh); ctx.lineTo(dx + dw / 2, dy); ctx.closePath(); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      if (lampK > 0.02) {
        glowAt(ctx, SP.warm, lerp(x0, x1, 0.2), yF - 28 * k, 62 * k, lampK * 0.6);
        glowAt(ctx, SP.warm, lerp(x0, x1, 0.83), yF - 28 * k, 62 * k, lampK * 0.6);
        glowAt(ctx, SP.warm, lerp(x0, x1, 0.5), yF - 10 * k, 80 * k, lampK * 0.35, 0.45);
      }
      if (gold > 0.02) glowAt(ctx, SP.amber, lerp(x0, x1, 0.62), yF - 36 * k, 96 * k, gold * 0.4 * (1 - 0.6 * sc), 0.75);
      ctx.globalCompositeOperation = 'source-over';
      if (wrath > 0.02) glowAt(ctx, SP.red, lerp(x0, x1, 0.72), yF - 35 * k, 70 * k, wrath * 0.35 * (S.kingSeat === 'throne' || S.kingSeat === 'banquet' ? 1 : 0.4));
      ctx.globalAlpha = 1;
    }
    // 王宫的旗（在内院门口）
    const ban = W.lv.etBanner;
    if (ban > 0.01) {
      const fxp = c0 - 3 * k, fy0 = yF + 1 * k, H = 58 * k;
      ctx.strokeStyle = css([110, 86, 60], 2); ctx.lineWidth = Math.max(0.6, 0.9 * k);
      ctx.beginPath(); ctx.moveTo(fxp, fy0); ctx.lineTo(fxp, fy0 - H); ctx.stroke();
      const wv = Math.sin(W.t * 2 + 1) * 1.6 * k, dir = (W.wind || 0) >= 0 ? 1 : -1, bw = 11 * k * ban, bh = 9 * k;
      ctx.fillStyle = css([150, 44, 50], 2, 1, 0.05);
      ctx.beginPath();
      ctx.moveTo(fxp, fy0 - H + 1 * k);
      ctx.quadraticCurveTo(fxp + dir * bw * 0.5, fy0 - H + 1 * k + wv, fxp + dir * bw, fy0 - H + 2 * k + wv * 0.4);
      ctx.lineTo(fxp + dir * bw, fy0 - H + 2 * k + bh + wv * 0.4);
      ctx.quadraticCurveTo(fxp + dir * bw * 0.5, fy0 - H + 1 * k + bh + wv, fxp, fy0 - H + 1 * k + bh);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(GOLD, 2, ban, 0.15);
      const ex = fxp + dir * bw * 0.52, ey = fy0 - H + 1 * k + bh * 0.55 + wv * 0.7;
      ctx.beginPath(); ctx.ellipse(ex, ey, 1.4 * k, 2 * k, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ex - 4 * k, ey - 1.5 * k); ctx.lineTo(ex, ey); ctx.lineTo(ex + 4 * k, ey - 1.5 * k); ctx.lineTo(ex, ey - 0.6 * k); ctx.closePath(); ctx.fill();
    }
  }
  // 柱前的：金杖伸出时柱也暗些；梁上的一串灯、灯台上的火、夜里殿前台面上的一片灯光
  function drawPalaceTop(ctx) {
    const G = hallGeom(), k = G.k;
    const { x0, x1, c0, top, yF } = G;
    const sc = W.lv.etScepter, lampK = lampKOf(), nk = nightK();
    if (sc > 0.01) {
      // 只压在殿的正面（墙、柱、梁）上，不压到天
      ctx.globalAlpha = Math.min(1, sc) * 0.38;
      ctx.fillStyle = 'rgb(14,16,34)';
      ctx.fillRect(x0, top, x1 - x0, yF + 1 * k - top);
      ctx.fillRect(x0 - 9 * k, top, 9 * k, BEAM * k); ctx.fillRect(x1, top, 9 * k, BEAM * k);
      ctx.globalAlpha = 1;
    }
    lampString(ctx, x0 - 7 * k, x1 + 7 * k, top + BEAM * k - 0.5 * k, k, W.lv.etLamps);
    if (lampK > 0.02) for (const f of [0.2, 0.83]) { const x = lerp(x0, x1, f); flame(ctx, x, yF + 1 * k - 27 * k, 4 * k, Math.min(1, lampK), f * 9); }
    if (lampK > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, lerp(c0, x1, 0.55), yF + 2 * k, (x1 - c0) * 0.7, lampK * 0.22 * nk, 0.3);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // ── 离屏的画布：静的布景按光线（量化后）缓存 ──
  const CACHE = {};
  let cacheOK = true;
  function lightKey() {
    const a = W.ambient || [0, 0, 0];
    return [W.w, W.h, port() ? 1 : 0, Math.round(W.daylight * 40), a[0] >> 2, a[1] >> 2, a[2] >> 2, Math.round((W.lv.storm || 0) * 10),
      [X().couch, (X().hall0 + X().hall1) / 2, X().gate].map(xf => (litX() >= xf * W.w ? 1 : 0)).join(''), Math.round(W.lv.etGold * 12), Math.round(terrace().yF)].join('|');
  }
  function cached(ctx, name, box, key, draw) {
    if (!cacheOK) { draw(ctx); return; }
    try {
      const dpr = Math.min(2, W.dpr || 1), w = Math.max(1, Math.ceil(box.w * dpr)), h = Math.max(1, Math.ceil(box.h * dpr));
      let c = CACHE[name];
      if (!c || c.key !== key) {
        if (!c || c.cv.width !== w || c.cv.height !== h) { c = { cv: cnv(w, h) }; CACHE[name] = c; }
        const g = c.cv.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, w, h);
        g.setTransform(dpr, 0, 0, dpr, -box.x * dpr, -box.y * dpr);
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        draw(g);
        c.key = key;
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(c.cv, box.x, box.y, w / dpr, h / dpr);
    } catch (e) { cacheOK = false; draw(ctx); }
  }
  function nearBox() {
    const P_ = X(), T = terrace(), k = T.k, G = hallGeom();
    const xa = Math.floor(T.a * W.w - 20 * k), xb = Math.ceil(Math.min(W.w + 2, (P_.gate * W.w) + 40 * k));
    const ya = Math.floor(Math.min(G.top - 12 * k, gY(2, P_.gate) - 90 * k)), yb = Math.ceil(W.h);
    return { x: xa, y: ya, w: xb - xa, h: yb - ya };
  }
  function frontBox() {
    const G = hallGeom(), k = G.k;
    const xa = Math.floor(G.x0 - 14 * k), xb = Math.ceil(G.x1 + 14 * k), ya = Math.floor(G.top - 10 * k), yb = Math.ceil(G.yF + 4 * k);
    return { x: xa, y: ya, w: xb - xa, h: yb - ya };
  }
  function drawNear(ctx) {
    const key = lightKey();
    cached(ctx, 'back', nearBox(), key, g => {
      U.safe('esther.terrace', () => drawTerrace(g));
      U.safe('esther.gardenS', () => drawGardenStatic(g));
      U.safe('esther.palaceB', () => drawPalaceBack(g));
      U.safe('esther.gateS', () => drawGateStatic(g));
    });
    U.safe('esther.garden', () => drawGardenLive(ctx));
    U.safe('esther.palaceL', () => drawPalaceLive(ctx));
    U.safe('esther.throne', () => { drawThrone(ctx); drawChest(ctx); drawBanquet(ctx); });
    cached(ctx, 'front', frontBox(), key, g => U.safe('esther.palaceF', () => drawPalaceFront(g)));
    U.safe('esther.palaceT', () => drawPalaceTop(ctx));
  }
  // 宝座：两层的台，高背金座，上有紫与金的华盖
  const DAIS = 5;
  function throneFoot() { const xf = X().throne, pk = PK(); return [xf * W.w, FY(xf) + 1.5 * pk - DAIS * pk]; }
  function drawThrone(ctx) {
    const xf = X().throne, pk = PK(), x = xf * W.w, g = FY(xf) + 1.5 * pk, top = g - DAIS * pk;
    const d = litX() >= x ? 1 : -1;
    // 华盖
    ctx.strokeStyle = css(GOLD, 2, 1, 0.1); ctx.lineWidth = Math.max(0.7, 1.1 * pk);
    ctx.beginPath(); ctx.moveTo(x - 14 * pk, g); ctx.lineTo(x - 14 * pk, top - 55 * pk); ctx.moveTo(x + 10 * pk, g); ctx.lineTo(x + 10 * pk, top - 55 * pk); ctx.stroke();
    ctx.fillStyle = css(PURPLE, 2, 1, 0.04);
    ctx.fillRect(x - 16 * pk, top - 60 * pk, 28 * pk, 5.5 * pk);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) { const fx0 = x - 16 * pk + i * 4 * pk; ctx.moveTo(fx0, top - 54.5 * pk); ctx.lineTo(fx0 + 4 * pk, top - 54.5 * pk); ctx.lineTo(fx0 + 2 * pk, top - 51.5 * pk); ctx.closePath(); }
    ctx.fill();
    ctx.fillStyle = css(GOLD, 2, 1, 0.12);
    ctx.fillRect(x - 16 * pk, top - 60.6 * pk, 28 * pk, 1.2 * pk);
    ctx.fillRect(x - 16 * pk, top - 55.6 * pk, 28 * pk, 0.9 * pk);
    // 台
    ctx.fillStyle = css(STONE, 2);
    ctx.fillRect(x - 15 * pk, g - 2.5 * pk, 30 * pk, 2.5 * pk);
    ctx.fillRect(x - 11 * pk, top, 22 * pk, 2.6 * pk);
    ctx.fillStyle = css([255, 248, 230], 2, 0.45 * dayA(), 0.2);
    ctx.fillRect(x - 15 * pk, g - 2.5 * pk, 30 * pk, 0.5 * pk); ctx.fillRect(x - 11 * pk, top, 22 * pk, 0.5 * pk);
    // 座（王面向左，对着殿门）：高背在右
    const T_ = mix([150, 108, 60], GOLD, 0.6);
    ctx.fillStyle = css(T_, 2, 1, 0.1);
    ctx.beginPath();
    ctx.moveTo(x + 4 * pk, top - 10 * pk);
    ctx.lineTo(x + 4.5 * pk, top - 31 * pk);
    ctx.quadraticCurveTo(x + 6.5 * pk, top - 35 * pk, x + 8.5 * pk, top - 31 * pk);
    ctx.lineTo(x + 8 * pk, top - 10 * pk);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(x - 4 * pk, top - 11.4 * pk, 12 * pk, 2.2 * pk);
    ctx.fillRect(x - 3.4 * pk, top - 9.2 * pk, 1.4 * pk, 9.2 * pk);
    ctx.fillRect(x + 6.2 * pk, top - 9.2 * pk, 1.4 * pk, 9.2 * pk);
    // 脚凳
    ctx.fillRect(x - 11 * pk, top - 2.2 * pk, 7 * pk, 2.2 * pk);
    ctx.strokeStyle = css([255, 240, 200], 2, 0.5 * dayA() + 0.3 * W.lv.etGold, 0.25); ctx.lineWidth = Math.max(0.5, 0.7 * pk);
    ctx.beginPath(); ctx.moveTo(x + 4.5 * pk, top - 31 * pk); ctx.quadraticCurveTo(x + 6.5 * pk, top - 35 * pk, x + 8.5 * pk, top - 31 * pk); ctx.stroke();
    if (d < 0) { ctx.beginPath(); ctx.moveTo(x - 4 * pk, top - 11.4 * pk); ctx.lineTo(x + 8 * pk, top - 11.4 * pk); ctx.stroke(); }
  }
  // 历史书的匣（2:23）：收着书卷，留着一点余烬似的光
  function drawChest(ctx) {
    const xf = X().chest, pk = PK(), x = xf * W.w, y = FY(xf) + 1 * pk;
    ctx.fillStyle = css([110, 80, 54], 2);
    ctx.fillRect(x - 5 * pk, y - 7 * pk, 1.2 * pk, 7 * pk); ctx.fillRect(x + 3.8 * pk, y - 7 * pk, 1.2 * pk, 7 * pk);
    ctx.fillRect(x - 6 * pk, y - 8 * pk, 12 * pk, 1.4 * pk);
    ctx.fillStyle = css(CEDAR, 2, 1, 0.05);
    ctx.fillRect(x - 5 * pk, y - 14 * pk, 10 * pk, 6 * pk);
    ctx.beginPath(); ctx.moveTo(x - 5.4 * pk, y - 14 * pk); ctx.quadraticCurveTo(x, y - 17 * pk, x + 5.4 * pk, y - 14 * pk); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(GOLD, 2, 0.9, 0.12);
    ctx.fillRect(x - 5 * pk, y - 12 * pk, 10 * pk, 0.8 * pk);
    ctx.fillRect(x - 0.6 * pk, y - 13.6 * pk, 1.2 * pk, 3 * pk);
    const e = W.lv.etRecord;
    if (e > 0.02 && SP) {
      const pulse = 0.75 + 0.25 * Math.sin(W.t * 1.3);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.ember, x, y - 13.5 * pk, 7 * pk, e * pulse * (0.45 + 0.4 * nightK() + 0.5 * W.lv.etRead));
      ctx.globalAlpha = e * pulse * 0.8;
      ctx.fillStyle = 'rgb(255,190,110)';
      ctx.fillRect(x - 4.4 * pk, y - 14.3 * pk, 8.8 * pk, 0.5 * pk);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 以斯帖所预备的筵席（5:5；7:1）：矮几、两张榻
  function couchFoot(xf) { const pk = PK(); return [xf * W.w, FY(xf) + 1.4 * pk]; }
  function drawBanquet(ctx) {
    const a = W.lv.etBanquet;
    if (a < 0.01) return;
    const P_ = X(), pk = PK();
    couch(ctx, P_.seatH * W.w, FY(P_.seatH) + 1.4 * pk, 11 * pk, 11 * pk, SILVER, false, 1, a);
    couch(ctx, P_.seatK * W.w, FY(P_.seatK) + 1.4 * pk, 12 * pk, 11 * pk, GOLD, true, -1, a);
    const x = P_.table * W.w, y = FY(P_.table) + 1.4 * pk;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([150, 108, 70], 2);
    ctx.fillRect(x - 6 * pk, y - 8.5 * pk, 12 * pk, 1.4 * pk);
    ctx.fillRect(x - 5 * pk, y - 7.1 * pk, 1 * pk, 7.1 * pk); ctx.fillRect(x + 4 * pk, y - 7.1 * pk, 1 * pk, 7.1 * pk);
    ctx.fillStyle = css(GOLD, 2, 1, 0.18);
    ctx.fillRect(x - 4.2 * pk, y - 11.4 * pk, 1.6 * pk, 2.9 * pk);
    ctx.fillRect(x + 2.4 * pk, y - 11 * pk, 1.5 * pk, 2.5 * pk);
    ctx.fillStyle = css([226, 196, 140], 2);
    ctx.beginPath(); ctx.ellipse(x - 0.4 * pk, y - 9.3 * pk, 2.4 * pk, 0.9 * pk, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    flame(ctx, x + 0.9 * pk, y - 10 * pk, 2.6 * pk, a * (0.4 + 0.6 * nightK()), 4.2);
  }

  // ════════════════════════════════════════════════════════════
  //  画：朝门（末底改坐在那里）与门外的宽阔处
  // ════════════════════════════════════════════════════════════
  function gateGeom() {
    const P_ = X(), k = BK() * (port() ? 0.88 : 1), x = P_.gate * W.w;
    const y = Math.max(gY(2, P_.gate - 0.02), gY(2, P_.gate + 0.02)) + 2 * k;
    return { P_, k, x, y, tw: 15 * k, th: 76 * k, pw: 21 * k, ph: 60 * k };
  }
  function drawGateStatic(ctx) {
    const { P_, k, x, y, tw, th, pw, ph } = gateGeom();
    const d = litX() >= x ? 1 : -1;
    // 中间的门楼
    ctx.fillStyle = css(mix(STONE, [200, 170, 130], 0.3), 2);
    ctx.fillRect(x - pw / 2, y - ph, pw, ph);
    // 门洞（拱）
    ctx.fillStyle = css([26, 22, 22], 2);
    ctx.beginPath();
    ctx.moveTo(x - 5.2 * k, y); ctx.lineTo(x - 5.2 * k, y - 26 * k);
    ctx.quadraticCurveTo(x, y - 36 * k, x + 5.2 * k, y - 26 * k); ctx.lineTo(x + 5.2 * k, y); ctx.closePath(); ctx.fill();
    // 两座塔
    for (const s of [-1, 1]) {
      const cx = x + s * (pw / 2 + tw / 2);
      ctx.fillStyle = css(STONE, 2);
      ctx.fillRect(cx - tw / 2, y - th, tw, th);
      ctx.fillStyle = css([110, 96, 80], 2, 0.45);
      ctx.fillRect(d * s > 0 ? cx - tw / 2 : cx + tw / 2 - tw * 0.3, y - th, tw * 0.3, th);
      ctx.fillStyle = css(GLAZE, 2, 0.95);
      ctx.fillRect(cx - tw / 2, y - th * 0.64, tw, 7 * k);
      rosettes(ctx, cx - tw / 2 + 1 * k, cx + tw / 2 - 1 * k, y - th * 0.64 + 3.5 * k, k, 0.9);
      merlons(ctx, cx - tw / 2, cx + tw / 2, y - th, k, css(STONE, 2));
      ctx.fillStyle = css([34, 28, 26], 2);
      ctx.fillRect(cx - 1 * k, y - th * 0.84, 2 * k, 4.5 * k);
    }
    ctx.fillStyle = css(GLAZE, 2, 0.95);
    ctx.fillRect(x - pw / 2, y - ph + 4 * k, pw, 5 * k);
    lions(ctx, x - pw / 2 + 2 * k, x + pw / 2 - 2 * k, y - ph + 6.5 * k, k * 0.7, 0.9);
    merlons(ctx, x - pw / 2, x + pw / 2, y - ph, k, css(STONE, 2));
    ctx.strokeStyle = css([255, 246, 222], 2, 0.45 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.8 * k);
    ctx.beginPath();
    for (const s of [-1, 1]) { const cx = x + s * (pw / 2 + tw / 2); ctx.moveTo(cx + d * tw / 2, y - th); ctx.lineTo(cx + d * tw / 2, y); }
    ctx.stroke();
    // 门外的石凳（末底改坐处）
    const sx = P_.seat * W.w, sy = gY(2, P_.seat) + 1.5 * k;
    ctx.fillStyle = css([188, 172, 146], 2);
    ctx.fillRect(sx - 7 * k, sy - 3.5 * k, 14 * k, 3.5 * k);
  }
  // 夜里门洞里的灯；光荣之夜门上的一串灯
  function drawGateLive(ctx) {
    const { k, x, y, tw, th, pw } = gateGeom();
    const nk = nightK();
    if (nk > 0.05) { flame(ctx, x - 3.6 * k, y - 18 * k, 3 * k, nk, 2.2); flame(ctx, x + 3.6 * k, y - 18 * k, 3 * k, nk, 5.1); }
    lampString(ctx, x - pw / 2 - tw, x + pw / 2 + tw, y - th * 0.64 - 1.5 * k, k, W.lv.etLamps);
  }
  // 枣椰树
  function palm(ctx, l, xf, H, k, seed) {
    const x = xf * W.w, y = gY(l, xf) + 1.5 * k;
    const lean = (hsh(seed) - 0.5) * 0.3, sway = Math.sin(W.t * 0.8 + seed) * 0.8 * k;
    const tx = x + lean * H + sway, ty = y - H;
    ctx.strokeStyle = css([96, 74, 54], l); ctx.lineWidth = Math.max(0.8, 1.8 * k);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * H * 0.2, y - H * 0.5, tx, ty); ctx.stroke();
    ctx.strokeStyle = css([60, 104, 64], l); ctx.lineWidth = Math.max(0.8, 1.6 * k);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.5 + Math.sin(W.t * 1.1 + i + seed) * 0.05, L = H * (0.34 + 0.06 * hsh(i + seed));
      const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.5 + L * 0.35;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6, ex, ey);
    }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  画：河对岸的书珊城（中丘）——泥砖的平顶房屋、枣椰树、哈曼的家与木架
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  function cityModel() {
    const key = port() ? 'P' : 'L';
    if (CITY && CITY.key === key) return CITY;
    const r = U.mulberry32(port() ? 91 : 57);
    const hs = X().city.map(xf => ({ xf, w: 15 + r() * 11, h: 10 + r() * 11, tone: r(), door: (r() - 0.5) * 0.5, win: r() < 0.85 ? (r() - 0.5) * 0.6 : null, blue: r() < 0.3, lift: r() < 0.35 ? 4 + r() * 6 : 0 }));
    hs.sort((a, b) => b.lift - a.lift);
    CITY = { key, hs };
    return CITY;
  }
  function house(ctx, l, x, y, w, h, tone, o) {
    const s = o.s;
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css(mix(tone, [44, 36, 30], 0.35), l, 0.9);
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.22, y - h, w * 0.22, h);
    ctx.fillStyle = css(mix(tone, [90, 70, 50], 0.3), l);
    ctx.fillRect(x - w / 2 - 0.8 * s, y - h - 1.6 * s, w + 1.6 * s, 1.8 * s);
    const dw = 3.6 * s, dh = Math.min(h * 0.6, 7 * s), dx = x + (o.door || 0) * w;
    ctx.fillStyle = o.blue ? css([50, 86, 150], l) : css([30, 24, 20], l);
    if (o.door != null) ctx.fillRect(dx - dw / 2, y - dh, dw, dh);
    const wx = x + (o.win || 0) * w, wy = y - h * 0.72;
    ctx.fillStyle = css([30, 24, 20], l);
    if (o.win != null) ctx.fillRect(wx - 1.3 * s, wy - 1.3 * s, 2.6 * s, 2.6 * s);
    ctx.strokeStyle = css([255, 240, 214], l, 0.4 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 0.8 * s, y - h - 1.6 * s); ctx.lineTo(x + w / 2 + 0.8 * s, y - h - 1.6 * s); ctx.stroke();
    const lk = o.lamp || 0;
    if (lk > 0.02 && SP) {
      const fl = o.flicker ? 0.55 + 0.45 * Math.abs(Math.sin(W.t * 5.3 + x * 0.13)) : 0.88 + 0.12 * Math.sin(W.t * 6 + x * 0.1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lk * fl * 0.9);
      ctx.fillStyle = 'rgb(255,178,98)';
      if (o.win != null) ctx.fillRect(wx - 1.3 * s, wy - 1.3 * s, 2.6 * s, 2.6 * s);
      if (o.door != null) { ctx.globalAlpha = Math.min(1, lk * fl * 0.55); ctx.fillRect(dx - dw / 2, y - dh, dw, dh); }
      glowAt(ctx, SP.warm, o.door != null ? dx : wx, y - dh * 0.7, 20 * s, lk * fl * 0.5);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  function drawCity(ctx) {
    const P_ = X(), s = PKm(), l = 1, nk = nightK();
    const shadow = W.lv.etShadow, lamps = W.lv.etLamps, glory = W.lv.etGlory;
    const lampK = Math.min(1.3, nk * 0.6 * (1 - 0.5 * shadow) + lamps * (0.35 + 0.8 * nk));
    for (const xf of P_.palmM) palm(ctx, 1, xf, 26 * s, s, xf * 31);
    // 哈曼的家：大一些的房屋，院墙，红门
    const hx = P_.hh * W.w, hy = gY(1, P_.hh) + 1.5 * s;
    ctx.fillStyle = css([176, 150, 116], l);
    ctx.fillRect(hx + 8 * s, hy - 7 * s, 14 * s, 7 * s);
    const hl = W.lv.etHLamp;
    house(ctx, l, hx, hy, 24 * s, 17 * s, [196, 166, 124], { s, door: -0.2, win: 0.26, lamp: Math.max(hl, lampK * (1 - W.lv.etProvGold * 0.3)), blue: false });
    ctx.fillStyle = css([140, 40, 40], l);
    ctx.fillRect(hx - 0.2 * 24 * s - 1.8 * s, hy - 6.6 * s, 3.6 * s, 6.6 * s);
    // 哈曼家里的灯：他与细利斯在灯前成了两个剪影（5:10–14）
    if (hl > 0.02 && SP) {
      const lx = (P_.hh + 0.014) * W.w, ly = gY(1, P_.hh + 0.014) - 12 * s;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, lx, ly, 44 * s, hl * (0.5 + 0.3 * nk));
      glowAt(ctx, SP.lamp, lx, ly + 4 * s, 18 * s, hl * 0.7);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    drawGallows(ctx);
    for (const q of cityModel().hs) {
      const x = q.xf * W.w, y = gY(l, q.xf) + 1.5 * s;
      const tone = mix([188, 160, 120], [222, 202, 168], q.tone);
      house(ctx, l, x, y - q.lift * s, q.w * s, q.h * s, tone, { s, door: q.lift ? null : q.door, win: q.win, blue: q.blue, lamp: lampK, flicker: shadow > 0.3 });
      if (q.lift) { ctx.fillStyle = css(mix(tone, [120, 100, 80], 0.2), l); ctx.fillRect(x - q.w * s / 2, y - q.lift * s, q.w * s, q.lift * s); }
    }
    // 犹大人有光荣：屋顶上、屋与屋之间一串串的灯
    if (lamps > 0.02 && SP) {
      const hs = cityModel().hs.slice().sort((a, b) => a.xf - b.xf);
      const roof = q => gY(l, q.xf) + 1.5 * s - q.lift * s - q.h * s - 1.6 * s;
      for (let i = 0; i < hs.length; i++) {
        const q = hs[i], x = q.xf * W.w;
        lampString(ctx, x - q.w * s / 2, x + q.w * s / 2, roof(q), s * 1.25, lamps);
        const r = hs[i + 1];
        if (r && r.xf - q.xf < 0.04) lampString(ctx, x + q.w * s / 2, r.xf * W.w - r.w * s / 2, Math.max(roof(q), roof(r)) + 1 * s, s * 1.25, lamps * 0.9);
      }
      ctx.globalAlpha = 1;
    }
    // 光荣：城上金色的光
    if (glory > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const x0 = port() ? 0.52 : 0.83, x1 = 0.99;
      for (let i = 0; i < 4; i++) {
        const xf = lerp(x0, x1, (i + 0.5) / 4);
        glowAt(ctx, SP.gold, xf * W.w, gY(1, xf) - 10 * s, 56 * s, glory * (0.22 + 0.3 * nk), 0.55);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 慌乱：城上一层暗红的雾
    if (shadow > 0.02 && SP) {
      const x0 = port() ? 0.5 : 0.5, x1 = 1;
      for (let i = 0; i < 5; i++) {
        const xf = lerp(x0, x1, (i + 0.5) / 5), dr = Math.sin(W.t * 0.3 + i * 1.7) * 6 * s;
        glowAt(ctx, SP.dark, xf * W.w + dr, gY(1, xf) - 10 * s, 36 * s, shadow * 0.28, 0.5);
      }
      ctx.globalAlpha = 1;
    }
  }
  // 城中的灯倒映在河里（夜里、灯下）
  function drawReflections(ctx) {
    const nk = nightK(), lamps = W.lv.etLamps;
    const k = Math.min(1.3, nk * 0.5 + lamps * (0.35 + 0.8 * nk)) * nk;
    if (k < 0.03 || !SP) return;
    const s = PKm(), wl = W.waterlineY(1);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,190,110)';
    for (const q of cityModel().hs) {
      const x = q.xf * W.w;
      if (!(gY(1, q.xf) < wl - 2)) continue;
      for (let j = 0; j < 4; j++) {
        const y = wl + 2 * s + j * 3.2 * s, w = (2.8 - j * 0.5) * s * (0.8 + 0.2 * Math.sin(W.t * 2 + j + q.xf * 50));
        ctx.globalAlpha = Math.min(1, k * (0.5 - j * 0.1));
        ctx.fillRect(x - w + Math.sin(W.t * 1.3 + j * 2 + q.xf * 30) * 1.2 * s, y, w * 2, 0.9 * s);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 五丈高的木架（5:14）：立在哈曼的家里，暗沉沉地衬着天
  function drawGallows(ctx) {
    const g = W.lv.etGallows;
    if (g < 0.01) return;
    const P_ = X(), s = PKm(), x = P_.gal * W.w, y = gY(1, P_.gal) + 1.5 * s;
    const H = 132 * s * g, w = 20 * s;
    const col = css([74, 58, 48], 1);
    ctx.globalAlpha = Math.min(1, g * 1.5);
    ctx.fillStyle = col;
    ctx.fillRect(x - w / 2 - 2 * s, y - H, 4 * s, H);
    ctx.fillRect(x + w / 2 - 2 * s, y - H, 4 * s, H);
    if (g > 0.6) {
      const bk = (g - 0.6) / 0.4;
      ctx.globalAlpha = bk;
      ctx.fillRect(x - w / 2 - 4.5 * s, y - H - 3 * s, w + 9 * s, 3.4 * s);
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.6, 1.2 * s);
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y - H + 12 * s); ctx.lineTo(x - w / 2 + 7 * s, y - H);
      ctx.moveTo(x + w / 2, y - H + 12 * s); ctx.lineTo(x + w / 2 - 7 * s, y - H);
      ctx.stroke();
    }
    // 月下（或夕照里）的一道亮边：两根柱与横梁都描出来，好在暗里看得见
    ctx.globalAlpha = Math.min(1, g * 1.5);
    ctx.strokeStyle = css([246, 236, 222], 1, 0.2 + 0.45 * (dayA() + nightK() * 0.8), 0.3); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    const d = litX() >= x ? 1 : -1;
    ctx.beginPath();
    for (const px of [x - w / 2, x + w / 2]) { ctx.moveTo(px + d * 2 * s, y - H); ctx.lineTo(px + d * 2 * s, y); }
    if (g > 0.6) { ctx.moveTo(x - w / 2 - 4.5 * s, y - H - 3 * s); ctx.lineTo(x + w / 2 + 4.5 * s, y - H - 3 * s); }
    ctx.stroke();
    // 立起来的时候：一阵冷光自下而上掠过
    const rise = 4 * g * (1 - g);
    if (rise > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.pale, x, y - H, 26 * s, rise * 0.55);
      glowAt(ctx, SP.pale, x, y - H * 0.5, 22 * s, rise * 0.3, 2.2);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 哈波拿指着它（7:9）：一道冷光
    const lit = W.lv.etGalLit;
    if (lit > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.pale, x, y - H * 0.6, 34 * s, lit * 0.5, 1.6);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：远山上的一百二十七省（1:1）
  // ════════════════════════════════════════════════════════════
  let PROV = null;
  function provModel() {
    const key = W.w + 'x' + W.h;
    if (PROV && PROV.key === key) return PROV;
    const r = U.mulberry32(127), pts = [];
    for (let i = 0; i < 127; i++) {
      const xf = 0.535 + 0.46 * ((i + 0.1 + r() * 0.8) / 127);
      pts.push({ xf, dy: r(), ord: clamp((1 - xf) / 0.47 * 0.9 + r() * 0.1, 0, 1), tw: r() * TAU, sz: 0.7 + r() * 0.6 });
    }
    PROV = { key, pts };
    return PROV;
  }
  function provXY(p) {
    const x = p.xf * W.w, g = gY(0, p.xf), wl = W.waterlineY(0);
    return [x, g + 1.5 + p.dy * Math.max(1, (wl - g) * 0.75)];
  }
  function drawProv(ctx) {
    const a = W.lv.etProv;
    if (a < 0.01 || !SP) return;
    const red = W.lv.etProvRed, gold = W.lv.etProvGold, nk = nightK();
    const base = mix(mix([255, 212, 150], [230, 70, 56], red), [255, 232, 150], gold);
    const bright = (0.55 + 0.45 * nk) * (1 - 0.45 * red + 0.35 * gold) * (1 - 0.55 * W.lv.etAsh);
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rgba(base, 1);
    for (const p of provModel().pts) {
      const vis = smoothstep(p.ord - 0.06, p.ord + 0.02, a * 1.08);
      if (vis < 0.02) continue;
      const [x, y] = provXY(p);
      const tw = 0.7 + 0.3 * Math.sin(W.t * 1.3 + p.tw) * (red > 0.4 ? 1.6 : 1);
      const A = vis * bright * tw;
      ctx.globalAlpha = Math.min(1, A);
      ctx.fillRect(x - 0.7 * u * p.sz, y - 0.7 * u * p.sz, 1.4 * u * p.sz, 1.4 * u * p.sz);
      if (p.sz > 1.05) glowAt(ctx, gold > 0.5 ? SP.gold : red > 0.5 ? SP.ember : SP.lamp, x, y, 5 * u * p.sz, A * 0.5);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上的签轮（3:7 按日日月月掣普珥……择定了十二月；9:1 反倒；9:26 普珥日）
  // ════════════════════════════════════════════════════════════
  function ringGeom() {
    if (port()) return { cx: W.w * 0.6, cy: W.h * 0.47, r: Math.min(W.w * 0.25, W.h * 0.1) };
    return { cx: W.w * 0.745, cy: W.h * 0.285, r: W.h * 0.145 };
  }
  const monthAng = (m, rot) => -Math.PI / 2 + (m * TAU) / 12 + rot;
  function lotAngle() {
    const u = W.lv.etLot, e = 1 - Math.pow(1 - clamp(u, 0, 1), 3);
    return -Math.PI / 2 + (3 * TAU + (11 * TAU) / 12) * e;
  }
  // 日或月正在签轮附近时，轮隐去（不与日月叠在一起）
  function lotsVeil(cx, cy, r) {
    let k = 1;
    const near = (x, y) => smoothstep(r * 1.0, r * 1.45, Math.hypot(x - cx, y - cy));
    if (W.lv.lights > 0.3 && W.sun.elev > -0.06) k = Math.min(k, lerp(1, near(W.sun.x, W.sun.y), clamp((W.sun.elev + 0.06) * 8, 0, 1)));
    if (W.lv.moon > 0.3 && W.moon.elev > 0) k = Math.min(k, lerp(1, near(W.moon.x, W.moon.y), clamp(W.moon.elev * 8, 0, 1)));
    return k;
  }
  function drawLots(ctx) {
    const { cx, cy, r } = ringGeom();
    const a = W.lv.etLots * lotsVeil(cx, cy, r);
    if (a < 0.01) return;
    const rot = Math.PI * W.lv.etTurn;
    const landed = smoothstep(0.96, 1, W.lv.etLot);
    const gold = clamp(W.lv.etTurn * 1.2 + W.lv.etPur, 0, 1);
    const day = W.daylight;
    const px = port() ? 11 : Math.round(clamp(13 * SU(), 12, 18));
    const halo = 0.4 + 0.5 * clamp(day, 0, 1);
    // 白日里：轮后一片极淡的暗，好让字从亮天上显出来
    if (SP && day > 0.2) glowAt(ctx, SP.dark, cx, cy, r * 1.45, a * 0.25 * day);
    // 轮：一圈细光与十二个点
    ctx.globalAlpha = a * (0.3 + 0.2 * gold);
    ctx.strokeStyle = rgba(mix([255, 236, 204], [255, 214, 130], gold), 1);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, TAU); ctx.stroke();
    ctx.globalAlpha = a * 0.16;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.22, 0, TAU); ctx.stroke();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, gold > 0.3 ? SP.gold : SP.pale, cx, cy, r * 1.35, a * (0.08 + 0.12 * gold + 0.06 * (1 - day)));
      ctx.globalCompositeOperation = 'source-over';
    }
    // 签正转过的那个月（日日月月）
    const la = lotAngle() + rot;
    let near = -1;
    if (W.lv.etLot > 0.001 && W.lv.etLot < 0.999) {
      const rel = U.wrap(la + Math.PI / 2 - rot, 0, TAU);
      near = Math.round(rel / (TAU / 12)) % 12;
    }
    for (let m = 0; m < 12; m++) {
      const an = monthAng(m, rot), x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r;
      const adar = m === 11;
      const base = 0.62 + (m === near ? 0.38 : 0);
      if (!adar || landed < 0.99) drawText(ctx, MONTHS[m], x, y, px, [252, 238, 212], a * base * (adar ? 1 - landed : 1), 1, halo);
      if (adar && landed > 0.01) {
        drawText(ctx, MONTHS[m], x, y, px, [240, 92, 70], a * landed * (1 - gold), 1.25, halo);
        drawText(ctx, MONTHS[m], x, y, px, [255, 222, 130], a * landed * gold, 1.25, halo);
        if (SP) {
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, gold > 0.5 ? SP.gold : SP.red, x, y, px * 2.2, a * landed * 0.45);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.globalAlpha = a * 0.5;
      ctx.fillStyle = 'rgb(255,240,214)';
      const tx = cx + Math.cos(an) * r * 0.8, ty = cy + Math.sin(an) * r * 0.8;
      ctx.fillRect(tx - 1, ty - 1, 2, 2);
    }
    // 签：一块小小的光石，转着，停在十二月
    if (W.lv.etLot > 0.001) {
      const lx = cx + Math.cos(la) * r * 0.8, ly = cy + Math.sin(la) * r * 0.8, s = Math.max(2.6, 4 * SU());
      const col = mix([255, 120, 90], [255, 226, 140], gold);
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, gold > 0.5 ? SP.gold : SP.warm, lx, ly, s * 4, a * 0.8); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(col, 1);
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(W.t * (W.lv.etLot < 1 ? 6 : 0.3) + la);
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.restore();
    }
    // 中间的字：普珥（暗红）→ 普珥日（金）
    const cpx = Math.round(px * 1.7);
    if (landed > 0.01 || gold > 0.01) {
      drawText(ctx, '普珥', cx, cy, cpx, [226, 96, 76], a * Math.max(landed, 0.3) * (1 - gold) * (1 - W.lv.etPur), 1, halo);
      drawText(ctx, '普珥', cx, cy, cpx, [255, 226, 140], a * gold * (1 - W.lv.etPur), 1, halo);
      drawText(ctx, '普珥日', cx, cy, cpx, [255, 230, 150], a * W.lv.etPur, 1, halo);
    }
    // 签落之后：一线暗红垂向王宫（哈曼在那里）
    if (landed > 0.01 && gold < 0.9) {
      const an = monthAng(11, rot), x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r;
      const G = hallGeom(), tx = lerp(G.c0, G.x1, 0.3), ty = G.top, A = a * landed * (1 - gold) * 0.5, n = 8;
      ctx.strokeStyle = 'rgb(230,80,64)'; ctx.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        ctx.globalAlpha = A * (1 - i / n);
        ctx.beginPath(); ctx.moveTo(lerp(x, tx, i / n), lerp(y + px * 0.6, ty, i / n)); ctx.lineTo(lerp(x, tx, (i + 1) / n), lerp(y + px * 0.6, ty, (i + 1) / n)); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 隐藏的光：极淡的一点，从不说明它是什么（「从别处」）
  function hiddenXY() { return port() ? [W.w * 0.82, W.h * 0.37] : [W.w * 0.6, W.h * 0.11]; }
  function drawHidden(ctx) {
    const a = W.lv.etHidden;
    if (a < 0.01 || !SP) return;
    const [x, y] = hiddenXY(), u = SU(), p = 0.8 + 0.2 * Math.sin(W.t * 0.9);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, x, y, 30 * u, a * 0.35 * p);
    glowAt(ctx, SP.white, x, y, 7 * u, a * 0.7 * p);
    ctx.globalAlpha = a * 0.35 * p;
    ctx.fillStyle = 'rgb(240,244,255)';
    ctx.fillRect(x - 16 * u, y - 0.5, 32 * u, 1);
    ctx.fillRect(x - 0.5, y - 16 * u, 1, 32 * u);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 王的心在耶和华手中：一缕极淡的光，自那隐藏的光缓缓垂到王的心（几乎看不见；只有几点慢慢流下的光）
  function drawStream(ctx) {
    const a = W.lv.etHidden;
    if (a < 0.01 || !SP) return;
    const th = a * W.lv.etGold;
    if (th < 0.02 || S.kingSeat !== 'throne') return;
    const c = chestOf('king');
    if (!c) return;
    const [x, y] = hiddenXY(), u = SU();
    const mx = x + (c[0] - x) * 0.15 + M() * 0.06, my = (y + c[1]) / 2;
    const at = q => { const iq = 1 - q; return [iq * iq * x + 2 * iq * q * mx + q * q * c[0], iq * iq * y + 2 * iq * q * my + q * q * c[1]]; };
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(255,232,188)';
    ctx.lineWidth = Math.max(1.5, 2.6 * u);
    const n = 24;
    let p0 = at(0);
    for (let i = 1; i <= n; i++) {
      const q = i / n, p1 = at(q);
      ctx.globalAlpha = Math.min(1, th) * 0.09 * Math.sin(Math.PI * (q - 0.5 / n));
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
      p0 = p1;
    }
    for (let i = 0; i < 5; i++) {
      const q = U.fract(W.t * 0.045 + i / 5), p = at(q), A = th * Math.sin(Math.PI * q);
      glowAt(ctx, SP.gold, p[0], p[1], 5 * u, A * 0.4);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 保护以色列的，也不打盹也不睡觉：夜里一群星，一颗接一颗地睁亮
  function drawWatch(ctx) {
    const a = W.lv.etWatch * clamp(W.night * 1.3, 0, 1);
    if (a < 0.01 || !SP) return;
    const u = SU(), P = port();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 38; i++) {
      const x = (P ? 0.04 + 0.92 * hsh(i * 5.1) : 0.3 + 0.68 * hsh(i * 5.1)) * W.w;
      const y = (P ? 0.3 + 0.3 * hsh(i * 9.7 + 2) : 0.05 + 0.45 * hsh(i * 9.7 + 2)) * W.h;
      const wv = Math.pow(0.5 + 0.5 * Math.sin(W.t * 0.8 - x * 0.006 + hsh(i) * 2), 5);
      const A = a * (0.35 + 0.65 * wv);
      glowAt(ctx, SP.white, x, y, (3 + 5 * wv) * u, A * 0.8);
      ctx.globalAlpha = A * 0.45;
      ctx.fillStyle = 'rgb(236,240,255)';
      ctx.fillRect(x - 4 * u * wv, y - 0.4, 8 * u * wv, 0.8);
      ctx.fillRect(x - 0.4, y - 4 * u * wv, 0.8, 8 * u * wv);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：人身上的——冠冕、金杖、怒气、金光、书卷
  // ════════════════════════════════════════════════════════════
  function crown(ctx, id, a, kind) {
    if (a < 0.02) return;
    const f = fig(id);
    if (!f || !f._vis || f.alpha < 0.05) return;
    const t = headTop(id);
    if (!t) return;
    const h = f._h, s = h / 44;
    const A = a * f.alpha;
    const col = W.shade(GOLD, DEP(f.layer || 2), 0.2);
    ctx.globalAlpha = Math.min(1, A);
    ctx.fillStyle = rgba(col, 1);
    const x = t[0], y = t[1] + 0.8 * s;
    if (kind === 'king') {
      // 高冠：上宽的一截，顶上一排齿
      ctx.beginPath();
      ctx.moveTo(x - 2.4 * s, y); ctx.lineTo(x - 2.9 * s, y - 5.2 * s);
      for (let i = 0; i < 5; i++) { const px = x - 2.9 * s + (i + 0.5) * 1.16 * s; ctx.lineTo(px, y - 6.4 * s); ctx.lineTo(px + 0.58 * s, y - 5.2 * s); }
      ctx.lineTo(x + 2.4 * s, y); ctx.closePath(); ctx.fill();
    } else {
      // 王后的冠 / 末底改的大金冠冕
      const big = kind === 'great' ? 1.35 : 1;
      ctx.beginPath();
      ctx.moveTo(x - 2.2 * s * big, y); ctx.lineTo(x - 2.4 * s * big, y - 2.6 * s * big); ctx.lineTo(x - 1.2 * s * big, y - 1.6 * s * big);
      ctx.lineTo(x, y - 3.2 * s * big); ctx.lineTo(x + 1.2 * s * big, y - 1.6 * s * big); ctx.lineTo(x + 2.4 * s * big, y - 2.6 * s * big);
      ctx.lineTo(x + 2.2 * s * big, y); ctx.closePath(); ctx.fill();
    }
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, y - 2.4 * s, 7 * s, A * (0.25 + 0.4 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 戴冠的御马（6:8）：马头上的金冠与金络头——位置按人物模块画马的算法求出
  function horseHead(f) {
    const M = f.M;
    if (!M || M.type !== 'q') return null;
    const lie = f.lie || 0, g = f.gait || 0, run = f.run || 0, ph = f.ph || 0;
    const bl = M.bl, bh = M.bh, L0 = M.leg + bh * 0.32;
    const bob = -(0.04 + 0.12 * run) * g * L0 * Math.abs(Math.cos(ph));
    const by = lerp(-(M.leg + bh * 0.5), -bh * 0.46, lie) + bob;
    const pitch = (f.pitch || 0) + (run ? 0.06 * Math.sin(ph * 2) * run : 0);
    const cp = Math.cos(pitch), spn = Math.sin(pitch);
    const rx = (x, y) => x * cp - (y - by) * spn, ry = (x, y) => by + x * spn + (y - by) * cp;
    const al = f.neck == null ? M.up : f.neck;
    const sx = rx(bl * 0.36, by - bh * 0.05), sy = ry(bl * 0.36, by - bh * 0.05);
    const nx = sx + Math.cos(al) * M.neck, ny = sy - Math.sin(al) * M.neck;
    const be = al - (al > 0 ? M.hd : M.hd * 0.35) + (f.headTilt || 0);
    const fxv = Math.cos(be), fyv = -Math.sin(be), uxv = fyv, uyv = -fxv;
    const cx = nx + fxv * M.hl * 0.28, cy = ny + fyv * M.hl * 0.28;
    return { fxv, fyv, uxv, uyv, cx, cy, px: cx - fxv * M.hl * 0.12 + uxv * M.hh * 0.38, py: cy - fyv * M.hl * 0.12 + uyv * M.hh * 0.38,
      mx: nx + fxv * M.hl * 0.6, my: ny + fyv * M.hl * 0.6, hh: M.hh };
  }
  function horseCrest(ctx) {
    const f = fig('horse');
    if (!f || !f._vis || f.alpha < 0.05 || !f.isAnimal) return;
    const H = horseHead(f);
    if (!H) return;
    const s = f._h, d = f.fd == null ? f.facing || 1 : f.fd;
    const P = (x, y) => [f._x + x * s * d, f._y + y * s];
    const col = rgba(W.shade(GOLD, DEP(f.layer || 2), 0.25), 1);
    ctx.globalAlpha = Math.min(1, f.alpha);
    // 金络头：额带、颊带、鼻带
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.7, 0.75 * s); ctx.lineCap = 'round';
    const a = P(H.px, H.py), b = P(H.cx - H.uxv * H.hh * 0.46, H.cy - H.uyv * H.hh * 0.46);
    const n0 = P(H.mx + H.uxv * H.hh * 0.3, H.my + H.uyv * H.hh * 0.3), n1 = P(H.mx - H.uxv * H.hh * 0.32, H.my - H.uyv * H.hh * 0.32);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(n0[0], n0[1]); ctx.lineTo(n1[0], n1[1]);
    const m0 = P(H.cx + H.fxv * 0.2, H.cy + H.fyv * 0.2);
    ctx.moveTo(a[0], a[1]); ctx.lineTo(m0[0], m0[1]); ctx.lineTo(n0[0], n0[1]);
    ctx.stroke(); ctx.lineCap = 'butt';
    // 冠：马头顶上三个小尖
    const up = [H.uxv * d, H.uyv], fw = [H.fxv * d, H.fyv], k = 1.15 * s, c0 = P(H.px, H.py);
    const Q = (u, w) => [c0[0] + up[0] * u * k + fw[0] * w * k, c0[1] + up[1] * u * k + fw[1] * w * k];
    ctx.fillStyle = col;
    ctx.beginPath();
    const pts = [Q(0, -1.6), Q(2.2, -1.9), Q(1.2, -0.8), Q(3, 0), Q(1.2, 0.8), Q(2.2, 1.9), Q(0, 1.6)];
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath(); ctx.fill();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      const g = Q(1.4, 0);
      glowAt(ctx, SP.gold, g[0], g[1], 6 * s, f.alpha * (0.35 + 0.35 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 金杖：王坐在宝座上时握着；伸出时指向内院里的王后，一道金光（5:2）
  function scepterGeom() {
    if (S.kingSeat !== 'throne') return null;
    const f = fig('king');
    if (!f || !f.attach || f.alpha < 0.05) return null;
    const ext = W.lv.etScepter, pk = PK(), ft = throneFoot();
    const hx = ft[0] - 5.5 * pk, hy = ft[1] - 15 * pk;
    const ang = lerp(-1.35, -3.0, smoothstep(0, 1, ext));   // 自竖直（稍前倾）到指向左方
    const L = (17 + 5 * ext) * pk;
    return { f, ext, pk, hx, hy, ang, ex: hx + Math.cos(ang) * L, ey: hy + Math.sin(ang) * L };
  }
  // 金杖的光：画在人之前（人在光前成为剪影）——殿里已暗下来，这一道金线是画面上最亮的
  function drawScepterGlow(ctx) {
    const g = scepterGeom();
    if (!g || g.ext < 0.03 || !SP) return;
    const { ext, pk, ex, ey } = g;
    const yF = terrace().yF, u = SU();
    const e = has('esther') ? chestOf('esther') : null;
    const tx = e ? e[0] : X().stand * W.w, ty = e ? e[1] : ey;
    ctx.globalCompositeOperation = 'lighter';
    // 台面上一片暖金：自王后到宝座
    const fx0 = Math.min(tx, ex) - 10 * pk, fx1 = Math.max(throneFoot()[0], ex) + 6 * pk;
    glowAt(ctx, SP.amber, (fx0 + fx1) / 2, yF + 2 * pk, (fx1 - fx0) * 0.62, ext * 0.5, 0.16);
    // 王后身后的光：她成了光前的剪影
    if (e) { const f = fig('esther'); glowAt(ctx, SP.gold, e[0], e[1] - 4 * pk, 60 * ((f && f._h) || 44) / 44, ext * 0.42); }
    // 杖头的光：细而柔，止于台面之上
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W.w, yF); ctx.clip();
    const R = Math.min(50, 22 + 28 * ext) * pk * (0.95 + 0.05 * Math.sin(W.t * 1.3));
    ctx.translate(ex, ey); ctx.rotate(W.t * 0.05);
    ctx.globalAlpha = 0.35 * Math.min(1, ext);
    ctx.drawImage(SP.rays, -R, -R, R * 2, R * 2);
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, ex, ey, 14 * pk * ext, ext * 0.85);
    // 金光：自杖头伸向王后（一段一段，由亮而淡）
    const n = 10;
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, 2.4 * pk * ext);
    for (let i = 0; i < n; i++) {
      const a0 = i / n, a1 = (i + 1) / n;
      ctx.globalAlpha = Math.min(1, ext) * (0.85 - 0.5 * a0);
      ctx.strokeStyle = 'rgb(255,' + Math.round(236 - 20 * a0) + ',' + Math.round(176 - 40 * a0) + ')';
      ctx.beginPath(); ctx.moveTo(lerp(ex, tx, a0), lerp(ey, ty, a0)); ctx.lineTo(lerp(ex, tx, a1), lerp(ey, ty, a1)); ctx.stroke();
    }
    ctx.lineCap = 'butt';
    glowAt(ctx, SP.gold, tx, ty, 16 * pk * ext, ext * 0.5);
    glowAt(ctx, SP.gold, (ex + tx) / 2, (ey + ty) / 2, Math.hypot(tx - ex, ty - ey) * 0.5 + 6 * u, ext * 0.18, 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 金杖本身：王坐在宝座上时握着
  function drawScepter(ctx) {
    const g = scepterGeom();
    if (!g) return;
    const { f, ext, pk, hx, hy, ang, ex, ey } = g;
    const bx = hx - Math.cos(ang) * 3 * pk, by = hy - Math.sin(ang) * 3 * pk;
    const col = W.shade(GOLD, 0, 0.25);
    ctx.globalAlpha = f.alpha;
    ctx.strokeStyle = rgba(col, 1); ctx.lineWidth = Math.max(0.9, 1.3 * pk); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.fillStyle = rgba(W.shade([255, 226, 140], 0, 0.35), 1);
    ctx.beginPath(); ctx.arc(ex, ey, 1.8 * pk, 0, TAU); ctx.fill();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, ex, ey, (5 + 8 * ext) * pk, 0.3 + 0.5 * ext);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function aura(ctx, id, sp, r, a) {
    if (a < 0.02 || !sp) return;
    const c = chestOf(id), f = fig(id);
    if (!c || !f || !f._vis) return;
    const pul = 0.85 + 0.15 * Math.sin(W.t * 3.1);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, sp, c[0], c[1], r * (f._h / 44), a * pul * f.alpha);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 怒气：一层暗红的雾，胸中一点火（心如火烧，1:12；怒气填胸，3:5）
  function wrathHaze(ctx, id, a) {
    if (a < 0.02 || !SP) return;
    const c = chestOf(id), f = fig(id);
    if (!c || !f || !f._vis) return;
    const h = f._h, A = a * f.alpha, fl = 0.8 + 0.2 * Math.sin(W.t * 7.3) * Math.sin(W.t * 3.1 + 1);
    glowAt(ctx, SP.red, c[0], c[1] - h * 0.1, h * 0.95, A * 0.32);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.ember, c[0], c[1], h * 0.28 * fl, A * 0.8);
    glowAt(ctx, SP.red, c[0], c[1] - h * 0.15, h * 0.7, A * 0.25 * fl);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 书卷：在殿上展开，金字一行一行；末底改的名字在其中（2:23；6:2）
  function drawScroll(ctx) {
    const a = W.lv.etScroll;
    if (a < 0.01) return;
    const G = hallGeom(), k = G.k;
    const cx = lerp(G.x0, G.x1, 0.42), cy = G.top - (port() ? 26 : 30) * k;
    const w = (port() ? 84 : 86) * k * smoothstep(0, 1, a), h = 26 * k;
    ctx.globalAlpha = Math.min(1, a * 1.5);
    ctx.fillStyle = rgba(W.shade([236, 222, 188], 0, 0.3 + 0.3 * nightK()), 0.95);
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    ctx.fillStyle = rgba(W.shade([150, 110, 70], 0, 0.2), 1);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * w / 2, cy, 1.8 * k, h * 0.6, 0, 0, TAU); ctx.fill(); }
    if (w > 20 * k) {
      ctx.strokeStyle = rgba([150, 110, 60], 0.6 * a); ctx.lineWidth = Math.max(0.5, 0.6 * k);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const y = cy - h * 0.32 + i * h * 0.21;
        if (i === 2) continue;
        for (let j = 0; j < 7; j++) { const x = cx - w * 0.42 + j * w * 0.12; ctx.moveTo(x, y); ctx.lineTo(x + w * 0.08 * (0.6 + 0.4 * hsh(i * 7 + j)), y); }
      }
      ctx.stroke();
      const rd = W.lv.etRead;
      const px = Math.max(10, Math.round(10 * k));
      drawText(ctx, '末底改', cx, cy + h * 0.1, px, rd > 0.3 ? [180, 110, 30] : [150, 100, 50], a * (0.7 + 0.3 * rd));
      if (rd > 0.02 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, cx, cy + h * 0.1, 22 * k, rd * a * 0.6, 0.5);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawAir(ctx) {
    // 王的忿怒（心如火烧）；哈曼的怒气
    wrathHaze(ctx, 'king', W.lv.etWrath);
    wrathHaze(ctx, 'haman', W.lv.etHWrath * 0.85);
    wrathHaze(ctx, 'hamanH', W.lv.etHWrath * 0.7);
    // 金光落在王后身上
    aura(ctx, 'esther', SP && SP.gold, 40, W.lv.etGold * 0.3 * (1 - 0.7 * W.lv.etScepter) + W.lv.etCrownE * 0.08);
    aura(ctx, 'mordecai', SP && SP.gold, 38, W.lv.etCrownM * 0.3);
    drawStream(ctx);
    drawScepter(ctx);
    crown(ctx, 'king', 1, 'king');
    crown(ctx, 'vashti', W.lv.etCrownV, 'queen');
    crown(ctx, 'esther', W.lv.etCrownE, 'queen');
    crown(ctx, 'mordecai', W.lv.etCrownM, 'great');
    horseCrest(ctx);
    drawScroll(ctx);
    drawFX(ctx, 'air');
  }

  // ════════════════════════════════════════════════════════════
  //  画：转瞬的光
  // ════════════════════════════════════════════════════════════
  // 马与骑者（驿卒）：极简的剪影
  function rider(ctx, x, y, k, d, ph, col, a) {
    const bob = Math.abs(Math.sin(ph)) * 1.2 * k;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([52, 40, 34], 1);
    ctx.beginPath();
    ctx.ellipse(x, y - 11 * k - bob, 7.5 * k, 3.4 * k, 0, 0, TAU);
    ctx.moveTo(x + d * 5 * k, y - 12 * k - bob);
    ctx.lineTo(x + d * 10 * k, y - 18 * k - bob); ctx.lineTo(x + d * 13 * k, y - 16 * k - bob); ctx.lineTo(x + d * 8 * k, y - 10 * k - bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css([52, 40, 34], 1); ctx.lineWidth = Math.max(0.6, 1.3 * k);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const lx = x + (i < 2 ? -5 : 5) * k * d + (i % 2) * 1.5 * k, sw = Math.sin(ph + i * 1.6) * 4 * k;
      ctx.moveTo(lx, y - 9 * k - bob); ctx.lineTo(lx + sw, y);
    }
    ctx.stroke();
    // 骑者
    ctx.fillStyle = css([90, 70, 60], 1);
    ctx.beginPath(); ctx.ellipse(x - d * 0.5 * k, y - 17 * k - bob, 2 * k, 4 * k, d * 0.3, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x + d * 0.4 * k, y - 22.5 * k - bob, 1.6 * k, 0, TAU); ctx.fill();
    // 手中的书信（一点光）
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.white, x + d * 2.5 * k, y - 18 * k - bob, 5 * k, a * 0.7);
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(col, 1);
      ctx.fillRect(x + d * 2 * k, y - 18.8 * k - bob, 1.8 * k, 1.4 * k);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function drawRiders(ctx) {
    const k = PKm();
    for (const e of FXL) {
      if (e.type !== 'rider' || e.t < e.delay) continue;
      const u = clamp((e.t - e.delay) / e.dur, 0, 1);
      const xf = lerp(e.x0, e.x1, u), x = xf * W.w, y = gY(1, xf) + 1 * k;
      if (!W.hasLandBase || W.hasLandBase(1, x, 0)) {
        const a = smoothstep(0, 0.08, u) * (1 - smoothstep(0.8, 1, u));
        rider(ctx, x, y, k, e.x1 < e.x0 ? -1 : 1, e.t * 11 + e.seed, e.col, a);
      }
    }
  }
  function drawFX(ctx, pass) {
    if (!FXL.length || !SP) return;
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const t = e.t - (e.delay || 0);
      if (t < 0) continue;
      const p = clamp(t / e.dur, 0, 1);
      if (e.type === 'letter') {
        const P = provModel().pts[e.to];
        if (!P) continue;
        const G = hallGeom();
        const sx = lerp(G.x0, G.x1, 0.5), sy = G.top;
        const [tx, ty] = provXY(P);
        const e2 = 1 - Math.pow(1 - p, 2);
        const mx = (sx + tx) / 2, my = Math.min(sy, ty) - M() * 0.12;
        const x = (1 - e2) * (1 - e2) * sx + 2 * (1 - e2) * e2 * mx + e2 * e2 * tx;
        const y = (1 - e2) * (1 - e2) * sy + 2 * (1 - e2) * e2 * my + e2 * e2 * ty;
        if (p < 1) {
          glowAt(ctx, e.col[0] > 240 && e.col[1] > 200 ? SP.gold : e.col[1] < 120 ? SP.red : SP.white, x, y, 6 * u, 0.8 * (1 - p * 0.3));
          ctx.globalAlpha = 0.9; ctx.fillStyle = rgba(e.col, 1); ctx.fillRect(x - 1, y - 1, 2, 2);
        } else {
          const q = clamp((t - e.dur) / 0.8, 0, 1);
          glowAt(ctx, e.col[1] < 120 ? SP.red : SP.gold, tx, ty, (4 + 10 * q) * u, 0.7 * (1 - q));
        }
      } else if (e.type === 'pass') {
        const a = chestOf(e.a), b = chestOf(e.b);
        if (!a || !b) continue;
        const e2 = smoothstep(0, 1, p), x = lerp(a[0], b[0], e2), y = lerp(a[1], b[1], e2) - Math.sin(p * Math.PI) * 18 * u;
        glowAt(ctx, SP.gold, x, y, 9 * u, 0.9 * Math.sin(Math.PI * Math.min(1, p * 1.1 + 0.05)));
        ctx.globalAlpha = 0.9; ctx.fillStyle = 'rgb(255,236,170)'; ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
      } else if (e.type === 'ash' || e.type === 'rise') {
        const h = headTop(e.id), f = fig(e.id);
        if (!h || !f) continue;
        const hh = heightOf(f);
        ctx.globalCompositeOperation = e.type === 'ash' ? 'source-over' : 'lighter';
        for (let i = 0; i < 18; i++) {
          const ph = U.fract(p * (e.type === 'ash' ? 2.2 : 1.6) + hsh(i * 3.7));
          const sx = h[0] + (hsh(i * 5.3) - 0.5) * hh * (e.type === 'ash' ? 0.5 : 0.9);
          let sy, col, A;
          if (e.type === 'ash') { sy = h[1] - hh * 0.3 + ph * hh * 0.9; col = [150, 144, 138]; A = 0.7 * Math.sin(Math.PI * ph) * (1 - smoothstep(0.8, 1, p)); }
          else { sy = h[1] + hh * 1.0 - ph * hh * 1.6; col = mix([160, 154, 146], [255, 220, 130], smoothstep(0.1, 0.6, ph)); A = 0.85 * Math.sin(Math.PI * ph) * (1 - smoothstep(0.85, 1, p)); }
          ctx.globalAlpha = clamp(A, 0, 1);
          ctx.fillStyle = rgba(col, 1);
          ctx.fillRect(sx - 0.9 * u, sy - 0.9 * u, 1.8 * u, 1.8 * u);
          if (e.type === 'rise' && ph > 0.4) glowAt(ctx, SP.gold, sx, sy, 3.5 * u, A * 0.5);
        }
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'murmur') {
        const a = chestOf(e.a), b = chestOf(e.b);
        if (!a || !b) continue;
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 14; i++) {
          const ph = U.fract(t * 0.5 + hsh(i * 2.9)), an = t * 2 + i * 1.3;
          const x = lerp(a[0], b[0], 0.5) + Math.cos(an) * 10 * u * (0.4 + ph), y = (a[1] + b[1]) / 2 - 6 * u + Math.sin(an * 1.3) * 5 * u - ph * 14 * u;
          ctx.globalAlpha = 0.55 * Math.sin(Math.PI * ph) * (1 - smoothstep(0.85, 1, p));
          ctx.fillStyle = 'rgb(58,30,54)';
          ctx.fillRect(x - 1.1 * u, y - 1.1 * u, 2.2 * u, 2.2 * u);
        }
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'gift') {
        const x0 = e.x0 * W.w, y0 = gY(e.l0, e.x0) - 10 * u, x1 = e.x1 * W.w, y1 = gY(e.l1, e.x1) - 10 * u;
        const x = lerp(x0, x1, p), y = lerp(y0, y1, p) - Math.sin(Math.PI * p) * M() * 0.05;
        glowAt(ctx, SP.gold, x, y, 5 * u, 0.8 * Math.sin(Math.PI * p));
        ctx.globalAlpha = 0.9 * Math.sin(Math.PI * p); ctx.fillStyle = 'rgb(255,232,170)'; ctx.fillRect(x - 1, y - 1, 2, 2);
      } else if (e.type === 'beam') {
        const x = e.xf * W.w, y = e.y != null ? e.y : gY(2, e.xf);
        const A = Math.sin(Math.PI * p) * (e.k || 1), w = e.w * u * (0.7 + 0.3 * p);
        ctx.globalAlpha = A * 0.5;
        ctx.drawImage(SP.beam, x - w / 2, 0, w, y);
        glowAt(ctx, SP.gold, x, y - 20 * u, 40 * u, A * 0.4);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); loadFonts(); },
    resize() { PROV = null; CITY = null; TG = null; TXT.clear(); for (const n in CACHE) CACHE[n].key = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) {
        const e = FXL[i];
        e.t += f;
        if (e.t >= (e.delay || 0) + e.dur + (e.type === 'letter' ? 0.8 : 0)) FXL.splice(i, 1);
      }
      rillPh = U.fract(rillPh + f * 0.05 * W.lv.etRill);
      U.safe('esther.fit', () => fitCast(f));
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      sprites();
      if (pass === 'sky') { drawWatch(ctx); drawHidden(ctx); drawLots(ctx); return; }
      if (pass === 'far') { drawProv(ctx); return; }
      if (pass === 'mid') { drawCity(ctx); drawRiders(ctx); return; }
      if (pass === 'seaNear') { drawReflections(ctx); return; }
      if (pass === 'near') {
        drawNear(ctx);
        U.safe('esther.scepter', () => drawScepterGlow(ctx));
        U.safe('esther.gate', () => drawGateLive(ctx));
        const k = BK();
        for (const xf of X().palmN) palm(ctx, 2, xf, 62 * k, k, 7);
        U.safe('esther.rill', () => drawRill(ctx));
        ctx.globalAlpha = 1;
        return;
      }
      if (pass === 'air') { U.safe('esther.air', () => drawAir(ctx)); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    sig() {
      // 本卷的状态，与各群人的站处、姿势（人群的位置也须与恢复存档一致）
      const c = C(), cr = {};
      if (c && c.crowds) for (const [g, grp] of c.crowds) {
        const ms = grp.members.filter(m => !m.dying);
        if (g.startsWith('__') || !ms.length) continue;
        cr[g] = ms.map(m => Math.round((m.tx != null ? m.tx : m.nx) * 100) + (m.tx != null ? m.afterWalk : m.pose)).join(',');
      }
      return { S: JSON.stringify(S), crowds: cr };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const P_ = X(), k = BK(), pk = PK(), G = hallGeom();
      consider('御园', P_.couch * W.w, FY(P_.couch) - 40 * k);
      consider('王宫', lerp(G.x0, G.x1, 0.3), G.top + 20 * k);
      consider('宝座', P_.throne * W.w, FY(P_.throne) - 45 * pk);
      consider('内院', lerp(G.c0, G.x0, 0.5), G.yF - 24 * k);
      consider('朝门', P_.gate * W.w, gY(2, P_.gate) - 60 * k);
      consider('历史书', P_.chest * W.w, FY(P_.chest) - 12 * pk);
      consider('陇沟的水', lerp(P_.rill0, P_.rill1, 0.4) * W.w, fieldY(lerp(P_.rill0, P_.rill1, 0.4), RILLV()));
      consider('书珊城', (port() ? 0.8 : 0.92) * W.w, gY(1, port() ? 0.8 : 0.92) - 16 * PKm());
      consider('哈曼的家', P_.hh * W.w, gY(1, P_.hh) - 14 * PKm());
      if (W.lv.etGallows > 0.5) consider('木架', P_.gal * W.w, gY(1, P_.gal) - 100 * PKm());
      if (W.lv.etBanquet > 0.5) consider('筵席', P_.table * W.w, FY(P_.table) - 10 * pk);
      if (W.lv.etProv > 0.5) { const p = provModel().pts[80]; if (p) { const q = provXY(p); consider('一百二十七省', q[0], q[1]); } }
      // 签轮的名字标在轮下（不压在轮中间的「普珥」上）
      if (W.lv.etLots > 0.3) { const g = ringGeom(); consider(W.lv.etPur > 0.5 ? '普珥日' : '普珥', g.cx, g.cy + g.r * 1.35); }
      return best;
    },
  };

  function resetScene() {
    FXL.length = 0;
    S = fresh();
    rillPh = 0;
  }

  // ════════════════════════════════════════════════════════════
  //  几件常用的事
  // ════════════════════════════════════════════════════════════
  // 王坐上宝座 / 离开宝座
  function kingToThrone() { attach('king', () => throneFoot()); pose('king', 'seat'); face('king', -1); S.kingSeat = 'throne'; }
  function kingOff() { attach('king', null); S.kingSeat = null; }
  const VX = () => lerp(X().hall0, X().hall1, 0.3);          // 瓦实提在殿里的位置
  // 坐在榻上（御园王的榻、筵席的两张榻）
  function seatOn(id, xf, dir) { attach(id, () => couchFoot(xf)); pose(id, 'seat'); face(id, dir); }
  function unseat(id) { attach(id, null); }
  // 走的时长（秒）：给情节排定下一拍用
  const walkT = (x0, x1, sp) => Math.abs(x1 - x0) / sp;

  // ════════════════════════════════════════════════════════════
  //  幕后布置：书珊城的宫，亚哈随鲁王在位第三年
  // ════════════════════════════════════════════════════════════
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.8, herbs: 0.45, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1, bare: 0.22, bloom: 0.5 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    for (const k in LVL) W.set(k, 0, true);
    W.set('etRill', -1, true);
    W.set('etProv', 0.12, true);
    W.set('etCrownV', 1, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.55, W.ridgeBaseY(2, W.w * 0.55));
    W.setOrigin('trees', W.w * 0.9, W.ridgeBaseY(2, W.w * 0.9));
    W.goTo(0.31, 0, true);
    const lx = W.w * 0.45, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 20, W.w * 0.62, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const P_ = X();
    const c = C();
    c.clear({ fade: false });
    add('king', { label: '亚哈随鲁王', sex: 'm', age: 'adult', x: P_.throne, facing: -1, robe: ROBE.king, glow: 0.4, hair: 'cloth', accent: GOLDA, beard: true, from: 'none' });
    kingToThrone();
    // 王后瓦实提与众妇女在王宫里（1:9）：妇女坐在她右边，向着她
    add('vashti', { label: '瓦实提', sex: 'f', age: 'adult', x: VX(), facing: 1, robe: ROBE.vashti, glow: 0.3, accent: [236, 214, 170], from: 'none' });
    const nw = port() ? 2 : 3;
    crowd('women', { n: nw, x0: lerp(P_.hall0, P_.hall1, 0.4), x1: lerp(P_.hall0, P_.hall1, 0.58), label: '众妇女', pose: 'sit', from: 'none' },
      dressAs(WOMEN, { sex: 'f', v0: 0, v1: 0.02 }));
    lay('women', slots(lerp(P_.hall0, P_.hall1, 0.38), lerp(P_.hall0, P_.hall1, 0.6), nw), -1);
    avoid([0.44, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒；情节里补充的经文排在其后。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 诗 22:28 国权是耶和华的：一百二十七省的灯；御园的筵席（1:1–8）──
    {
      kind: 'act', utter: '国权是耶和华的；他是管理万国的', cmd: 'mount --realm 一百二十七省 --from 印度 --to 古实  # 国权 = 耶和华的', ref: '诗篇 22:28',
      verse: [
        { text: '亚哈随鲁王在书珊城的宫登基；<br>在位第三年，为他一切首领臣仆设摆筵席……就是一百八十日。', ref: '以斯帖记 1:2–4', hold: 7 },
        { text: '这日子满了，又为所有住书珊城的大小人民在御园的院子里设摆筵席七日。<br>有白色、绿色、蓝色的帐子，用细麻绳、紫色绳从银环内系在白玉石柱上……', ref: '以斯帖记 1:5–6', hold: 8 },
        { text: '用金器皿赐酒，器皿各有不同。御酒甚多，足显王的厚意。', ref: '以斯帖记 1:7', hold: 5.5 },
      ],
      apply(c) {
        const P_ = X();
        // 首领臣仆自朝门进来，停在内院（王宝座的前面），向着王下拜；妇女与瓦实提在殿的另一边
        const nN = port() ? 4 : 6;
        const inCourt = slots(P_.court0 + 0.004, P_.hall0 - 0.002, nN), outGate = slots(P_.gate + 0.016, P_.st1, nN);
        T(c, [
          [0, b => {
            W.set('etProv', 1, b.instant); W.set('etBanner', 1, b.instant);
            sfx(b, 'stars'); sfx(b, 'harp', { soft: true });
            if (!b.instant && fx()) fx().ring(P_.throne * W.w, FY(P_.throne) - 30 * PK(), [255, 226, 160], M() * 0.3, 2.4, 2);
          }],
          [0.6, () => {
            crowd('nobles', { n: nN, x0: P_.st0, x1: P_.st1, label: '首领臣仆', pose: 'stand' }, dressAs(NOBLE, { sex: 'm', hair: 'cloth', beard: true, v0: 0.06, v1: 0.2 }));
            lay('nobles', slots(P_.st0, P_.st1, nN), -1);
            cgo('nobles', inCourt, { speed: 0.05 });
            cface('nobles', 1);
          }],
          [6.5, b => { cpose('nobles', 'bow'); W.set('etGold', 0.3, b.instant); W.goTo(0.47, 7, b.instant); sfx(b, 'crowd', { soft: true }); }],
          [9.5, b => {
            W.set('etHang', 1, b.instant); W.set('etFeast', 1, b.instant); W.set('etGold', 0.1, b.instant);
            sfx(b, 'wind', { soft: true });
          }],
          [10.5, () => {
            const n = port() ? 3 : 5;
            crowd('guests', { n, x0: P_.g0 + 0.004, x1: P_.g1 - 0.004, label: '书珊城的大小人民', pose: 'sit' }, dressAs(TOWN, { sex: 'mix', v0: 0.04, v1: 0.12, seed: 0.3 }));
            placeCrowd('guests', slots(P_.g0 + 0.004, P_.g1 - 0.004, n, P_.couch, port() ? 0.03 : 0.022));
            cmembers('guests').forEach(m => { m.facing = m.nx < P_.couch ? 1 : -1; if (W.replaying) m.fd = m.facing; });
          }],
          [11.5, () => {
            cpose('nobles', 'stand');
            cgo('nobles', outGate, { speed: 0.04 });
            cface('nobles', 1);
            kingOff();
            walk('king', P_.couch, { speed: 0.035 });
          }],
          [15.5, () => { crm('nobles'); }],
          [11.5 + walkT(P_.throne, P_.couch, 0.035) + 0.8, b => {
            seatOn('king', P_.couch, 1);
            S.kingSeat = 'couch';
            sfx(b, 'harp', { soft: true });
            W.goTo(0.6, 6, b.instant);
          }],
        ]);
      },
    },

    // ── 诗 75:7 他使这人降卑，使那人升高：瓦实提不肯来（1:10–22）───────
    {
      kind: 'act', utter: '他使这人降卑，使那人升高', cmd: 'demote 瓦实提 && reserve 王后 --for 比她还好的人', ref: '诗篇 75:7',
      verse: [
        { text: '第七日，亚哈随鲁王饮酒，心中快乐，……请王后瓦实提头戴王后的冠冕到王面前，<br>使各等臣民看她的美貌，因为她容貌甚美。', ref: '以斯帖记 1:10–11', hold: 7.5 },
        { text: '王后瓦实提却不肯遵太监所传的王命而来，所以王甚发怒，心如火烧。', ref: '以斯帖记 1:12', hold: 6 },
        { text: '米母干在王和众首领面前回答说：「……王若以为美，……<br>不准瓦实提再到王面前，将她王后的位分赐给比她还好的人。」', ref: '以斯帖记 1:16–19', hold: 7.5 },
      ],
      apply(c) {
        const P_ = X();
        const vx = VX(), nE = port() ? 4 : 7, nS = port() ? 3 : 5;
        // 七个太监自王的榻前去到瓦实提面前（停在她左边，不遮住她与众妇女），又回来
        const home = slots(P_.couch + 0.008, P_.g1 + 0.012, nE), before = slots(vx - (port() ? 0.09 : 0.078), vx - 0.02, nE);
        T(c, [
          [0, b => {
            W.goTo(0.66, 8, b.instant);
            crowd('eunuchs', { n: nE, x0: P_.couch + 0.012, x1: P_.g1 + 0.01, label: '七个太监', pose: 'stand' }, dressAs(EUNUCH, { sex: 'm', v0: 0.04, v1: 0.18, seed: 0.5 }));
            lay('eunuchs', home, -1);
          }],
          [2, () => { cgo('eunuchs', before, { speed: 0.045 }); cface('eunuchs', 1); }],
          [7, b => { face('vashti', 1); pose('vashti', 'stand'); glow('vashti', 0.15); sfx(b, 'gate', { soft: true }); }],
          [8.2, () => { face('vashti', -1); }],
          [8.6, () => { face('vashti', 1); }],
          [9.2, () => { cgo('eunuchs', home, { speed: 0.05 }); cface('eunuchs', -1); }],
          [13.4, b => {
            W.set('etWrath', 1, b.instant); cpose('guests', 'bow'); cpose('nobles', 'bow');
            sfx(b, 'fire', { low: true, soft: true });
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.25);
          }],
          [15, () => {
            crm('eunuchs');
            add('memucan', { label: '米母干', sex: 'm', age: 'elder', x: P_.g1 + 0.03, v: 0.2, facing: -1, robe: ROBE.memucan, glow: 0.2, hair: 'cloth', beard: true });
            crowd('sages', { n: nS, x0: P_.g1, x1: P_.court0 + 0.02, label: '七个大臣', pose: 'stand' }, dressAs(SAGE, { sex: 'm', age: 'elder', hair: 'cloth', beard: true, v0: 0.1, v1: 0.22, prop: 'staff' }));
            lay('sages', slots(P_.g1 - 0.012, P_.court0 + 0.026, nS), -1);
          }],
          [17.5, () => { walk('memucan', P_.couch + 0.03, { speed: 0.025, pose: 'point' }); }],
          [21.5, b => {
            W.set('etCrownV', 0, b.instant); glow('vashti', 0);
            pose('vashti', 'weep');
            crm('women');
            sfx(b, 'seal', { low: true });
          }],
          [23, b => {
            W.set('etWrath', 0.15, b.instant); pose('memucan', 'bow');
            walk('vashti', P_.gate - 0.03, { speed: 0.03 });
            riders(b, [240, 236, 226], 3);
            sfx(b, 'wind', { soft: true });
          }],
          [26.5, () => { rm('vashti'); }],
        ]);
      },
    },

    // ── 诗 68:5 神在他的圣所作孤儿的父：哈大沙；冠冕（2:1–18）─────────
    {
      kind: 'bless', utter: '神在他的圣所作孤儿的父', cmd: 'adopt 哈大沙 --by 末底改 && alias 以斯帖  # 她没有父母', ref: '诗篇 68:5',
      verse: [
        { text: '书珊城有一个犹大人，名叫末底改……<br>末底改抚养他叔叔的女儿哈大沙（后名以斯帖），因为她没有父母。', ref: '以斯帖记 2:5–7', hold: 7.5 },
        { text: '王的谕旨传出，就招聚许多女子到书珊城，交给掌管女子的希该；<br>以斯帖也送入王宫，交付希该。', ref: '以斯帖记 2:8', hold: 6.5 },
        { text: '王爱以斯帖过于爱众女，她在王眼前蒙宠爱比众处女更甚。<br>王就把王后的冠冕戴在她头上，立她为王后，代替瓦实提。', ref: '以斯帖记 2:17', hold: 8 },
      ],
      apply(c) {
        const P_ = X();
        const arr1 = 10.2 + walkT(P_.seat + 0.008, P_.stand, 0.05), arr2 = arr1 + 0.5 + walkT(P_.stand, P_.tip, 0.035);
        T(c, [
          [0, b => {
            W.goTo(0.34, 6, b.instant);
            W.set('etWrath', 0, b.instant); W.set('etFeast', 0, b.instant);
            rm('memucan'); crm('sages'); crm('guests'); crm('nobles');
            unseat('king'); S.kingSeat = null;
            walk('king', P_.throne, { speed: 0.035 });
          }],
          [0.8, b => {
            add('mordecai', { label: '末底改', sex: 'm', age: 'adult', x: P_.st1 - 0.005, facing: -1, robe: ROBE.mordecai, glow: 0.45, hair: 'cloth', beard: true });
            add('esther', { label: '以斯帖', sex: 'f', age: 'child', x: P_.st1 - 0.022, facing: -1, robe: ROBE.esther, glow: 0.5 });
            const c2 = C(); if (c2.holdHands) U.safe('cast.holdHands', () => c2.holdHands('mordecai', 'esther', true));
            walk('mordecai', P_.seat + 0.024, { speed: 0.012 }); walk('esther', P_.seat + 0.008, { speed: 0.012 });
            beam(b, P_.seat + 0.016, { dur: 6, w: 80 });
            W.set('etHidden', 0.35, b.instant);
          }],
          [4.2, b => { nameOver(b, 'esther', '哈大沙', { hold: 1.8, rgb: [255, 236, 200] }); }],
          [0.4 + walkT(P_.couch, P_.throne, 0.035) + 0.6, () => { kingToThrone(); }],
          [7.2, b => { nameOver(b, 'esther', '以斯帖', { hold: 2.4, rgb: [255, 226, 160] }); }],
          [8.4, b => {
            const c2 = C(); if (c2.holdHands) U.safe('cast.holdHands', () => c2.holdHands('mordecai', 'esther', false));
            add('esther', { age: 'adult', robe: ROBE.esther, accent: [236, 222, 204] });
            sparkleOn(b, 'esther', 30, [255, 236, 200], 0.4);
            W.set('etHidden', 0.1, b.instant);
          }],
          [9.2, () => {
            const nM = port() ? 3 : 5;
            crowd('maidens', { n: nM, x0: P_.st0 + 0.005, x1: P_.st1, label: '众女子', pose: 'stand' }, dressAs(MAIDEN, { sex: 'f', v0: 0.04, v1: 0.16 }));
            lay('maidens', slots(P_.st0 + 0.005, P_.st1, nM), -1);
            cgo('maidens', slots(P_.court0 + 0.004, P_.hall0 - 0.004, nM, P_.stand, 0.008), { speed: 0.03 });
            cface('maidens', 1);
            add('hegai', { label: '希该', sex: 'm', age: 'adult', x: P_.court0 + 0.01, facing: 1, robe: ROBE.hegai, glow: 0.2, hair: 'cloth' });
          }],
          [10.2, () => { walk('esther', P_.stand, { speed: 0.05 }); face('mordecai', -1); pose('mordecai', 'gaze'); }],
          [arr1 + 0.5, () => { walk('esther', P_.tip, { speed: 0.035 }); }],
          [arr2 + 0.3, b => { pose('esther', 'bow'); face('esther', 1); sfx(b, 'harp', { soft: true }); }],
          [arr2 + 2.2, b => {
            W.set('etCrownE', 1, b.instant); W.set('etGold', 0.45, b.instant);
            ringOn(b, 'esther', [255, 226, 160], 0.2, 0.1); sparkleOn(b, 'esther', 40, [255, 226, 150], 0.05);
            sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
            cpose('maidens', 'bow');
          }],
          [arr2 + 4, () => { pose('esther', 'stand'); pose('mordecai', 'stand'); }],
          [arr2 + 5, b => { W.set('etGold', 0.12, b.instant); crm('maidens'); rm('hegai'); walk('esther', P_.queen, { speed: 0.025 }); }],
        ]);
      },
    },

    // ── 2:23 将这事在王面前写于历史上：守门的二人；书卷（2:19–23）────
    {
      kind: 'act', utter: '将这事在王面前写于历史上', cmd: 'log --to 历史 "末底改救王"  # reward: null (for now)', ref: '2:23',
      verse: [
        { text: '以斯帖照着末底改所嘱咐的，还没有将籍贯宗族告诉人……', ref: '以斯帖记 2:20', hold: 5 },
        { text: '当那时候，末底改坐在朝门，王的太监中有两个守门的，辟探和提列，<br>恼恨亚哈随鲁王，想要下手害他。', ref: '以斯帖记 2:21', hold: 7 },
        { text: '末底改知道了，就告诉王后以斯帖。以斯帖奉末底改的名，报告于王；<br>究察这事，果然是实，……将这事在王面前写于历史上。', ref: '以斯帖记 2:22–23', hold: 8 },
      ],
      apply(c) {
        const P_ = X();
        T(c, [
          [0, b => {
            W.goTo(0.46, 8, b.instant);
            walk('mordecai', P_.seat, { speed: 0.02 });
            add('bigthan', { label: '辟探', sex: 'm', age: 'adult', x: P_.gate - 0.032, facing: 1, robe: ROBE.guard1, glow: 0, prop: 'staff', hair: 'cloth' });
            add('teresh', { label: '提列', sex: 'm', age: 'adult', x: P_.gate + (port() ? 0.036 : 0.03), facing: -1, robe: ROBE.guard2, glow: 0, prop: 'staff', hair: 'cloth' });
          }],
          [1.6, () => { pose('mordecai', 'sit'); face('mordecai', -1); }],
          [6.5, b => {
            face('bigthan', 1); face('teresh', -1); pose('bigthan', 'bow'); pose('teresh', 'bow');
            fxAdd(b, { type: 'murmur', a: 'bigthan', b: 'teresh', dur: 6 });
            sfx(b, 'crowd', { soft: true, low: true });
          }],
          [8.6, () => { pose('mordecai', 'stand'); face('mordecai', -1); }],
          [9.6, () => { walk('mordecai', P_.stand - 0.004, { speed: 0.05 }); }],
          [11, () => { walk('esther', P_.stand + 0.02, { speed: 0.045 }); }],
          [9.6 + walkT(P_.seat, P_.stand, 0.05) + 0.4, () => { face('mordecai', 1); face('esther', -1); pose('bigthan', 'stand'); pose('teresh', 'stand'); }],
          [9.6 + walkT(P_.seat, P_.stand, 0.05) + 1.6, () => { walk('esther', P_.tip, { speed: 0.035 }); }],
          [9.6 + walkT(P_.seat, P_.stand, 0.05) + 1.6 + walkT(P_.stand, P_.tip, 0.035) + 0.3, b => { pose('esther', 'bow'); face('esther', 1); sfx(b, 'harp', { soft: true }); }],
          [18.5, () => { walk('bigthan', P_.st1 + 0.02, { speed: 0.04 }); walk('teresh', P_.st1 + 0.03, { speed: 0.04 }); }],
          [19.5, b => { W.set('etScroll', 1, b.instant); sfx(b, 'seal', { soft: true }); }],
          [21, () => { walk('mordecai', P_.seat, { speed: 0.05 }); }],
          [21.5, () => { rm('bigthan'); rm('teresh'); pose('esther', 'stand'); }],
          [22.3, () => { walk('esther', P_.queen, { speed: 0.03 }); }],
          [23.5, b => { W.set('etScroll', 0, b.instant); W.set('etRecord', 1, b.instant); }],
          [21 + walkT(P_.stand, P_.seat, 0.05) + 0.4, () => { pose('mordecai', 'sit'); face('mordecai', -1); face('esther', -1); }],
        ]);
      },
    },

    // ── 3:2 惟独末底改不跪不拜：哈曼高升（3:1–6）────────────────
    {
      kind: 'act', utter: '惟独末底改不跪不拜', cmd: 'kneel --all --to 哈曼 --except 末底改', ref: '3:2',
      verse: [
        { text: '这事以后，亚哈随鲁王抬举亚甲族哈米大他的儿子哈曼，使他高升，<br>叫他的爵位超过与他同事的一切臣宰。', ref: '以斯帖记 3:1', hold: 7 },
        { text: '在朝门的一切臣仆都跪拜哈曼，因为王如此吩咐；惟独末底改不跪不拜。', ref: '以斯帖记 3:2', hold: 6.5 },
        { text: '哈曼见末底改不跪不拜，他就怒气填胸。……<br>就要灭绝亚哈随鲁王通国所有的犹大人，就是末底改的本族。', ref: '以斯帖记 3:5–6', hold: 7.5 },
      ],
      apply(c) {
        const P_ = X();
        const hx = P_.tip - 0.012;                                  // 哈曼在王前受封
        const hG = P_.gate - (port() ? 0.012 : 0.006);              // 哈曼走到朝门的门洞里
        const t0 = walkT(P_.court0, hx, 0.03), tA = t0 + 4.2 + walkT(hx, hG, 0.03);
        // 朝门的臣仆站在门外的宽阔处（末底改就在他们中间），都向着门洞里的哈曼俯伏；只有末底改站着
        const nS = port() ? 3 : 4;
        const sx = slots(hG + 0.02, P_.st1, nS, P_.seat, port() ? 0.018 : 0.016);
        T(c, [
          [0, b => {
            W.goTo(0.52, 8, b.instant);
            add('haman', hamanLook({ x: P_.court0 + 0.004, facing: 1, glow: 0.25 }));
            walk('haman', hx, { speed: 0.03 });
          }],
          [t0 + 0.4, b => { pose('haman', 'bow'); face('haman', 1); sfx(b, 'harp', { soft: true }); }],
          [t0 + 2.2, b => {
            pose('haman', 'raise'); glow('haman', 0.6);
            ringOn(b, 'haman', [255, 190, 150], 0.14, 0.4); sparkleOn(b, 'haman', 16, [255, 196, 150]);
            crowd('servants', { n: nS, x0: hG + 0.02, x1: P_.st1, label: '在朝门的臣仆', pose: 'stand' }, dressAs(SERV, { sex: 'm', hair: 'cloth', v0: 0.04, v1: 0.2, seed: 0.2 }));
            lay('servants', sx, hG);
          }],
          [t0 + 4.2, () => { pose('haman', 'stand'); walk('haman', hG, { speed: 0.03 }); }],
          // 哈曼将到：末底改起来站着，面向他
          [tA - 1.6, () => { pose('mordecai', 'stand'); face('mordecai', -1); glow('mordecai', 0.75); }],
          [tA + 0.3, b => { face('haman', 1); cface('servants', hG); cpose('servants', 'bow'); sfx(b, 'crowd', { soft: true }); }],
          [tA + 2.4, b => { face('haman', 1); W.set('etHWrath', 1, b.instant); sfx(b, 'fire', { low: true }); }],
          [Math.max(22, tA + 6.5), b => { W.set('etShadow', 0.45, b.instant); W.set('etHWrath', 0.4, b.instant); walk('haman', hx, { speed: 0.035 }); cpose('servants', 'stand'); }],
          [Math.max(26, tA + 9.5), () => { pose('mordecai', 'sit'); glow('mordecai', 0.45); face('haman', 1); }],
        ]);
      },
    },

    // ── 箴 16:33 签放在怀里，定事由耶和华：掣普珥；旨意（3:7–15）★ ────────
    {
      kind: 'act', utter: '签放在怀里，定事由耶和华', cmd: 'roll --lots 普珥 --days --months  # 定事由耶和华', ref: '箴言 16:33',
      verse: [
        { text: '亚哈随鲁王十二年正月，……人在哈曼面前，按日日月月掣普珥，<br>就是掣签，要定何月何日为吉，择定了十二月，就是亚达月。', ref: '以斯帖记 3:7', hold: 8 },
        { text: '于是王从自己手上摘下戒指给犹大人的仇敌亚甲族哈米大他的儿子哈曼。', ref: '以斯帖记 3:10', hold: 6 },
        { text: '驿卒奉王命急忙起行，旨意也传遍书珊城。<br>王同哈曼坐下饮酒，书珊城的民却都慌乱。', ref: '以斯帖记 3:15', hold: 7 },
      ],
      apply(c) {
        const P_ = X();
        const nC = port() ? 3 : 5;
        // 先入黄昏（签轮在暮色里才看得清），再掣签
        T(c, [
          [0, b => {
            W.goTo(0.785, 4, b.instant);
            W.set('etLot', 0, true);
            W.set('etHWrath', 0.2, b.instant);
            pose('haman', 'raise'); face('haman', 1);
          }],
          [2.4, b => { W.set('etLots', 1, b.instant); sfx(b, 'stars', { soft: true }); }],
          [4.5, b => { W.set('etLot', 1, b.instant); sfx(b, 'chime'); }],
          [10.8, b => {
            W.set('etHWrath', 0.7, b.instant);
            sfx(b, 'seal', { low: true });
            if (!b.instant && fx()) { const g = ringGeom(), an = monthAng(11, 0); fx().ring(g.cx + Math.cos(an) * g.r, g.cy + Math.sin(an) * g.r, [255, 120, 90], M() * 0.08, 1.6, 1.2); }
            pose('haman', 'stand');
          }],
          [13, b => { passTo(b, 'king', 'haman', [255, 226, 150]); sfx(b, 'seal', { soft: true }); }],
          [14.8, b => { pose('haman', 'bow'); W.set('etLots', 0.35, b.instant); }],
          [16.5, b => {
            pose('haman', 'stand');
            letters(b, [230, 90, 70], 20); riders(b, [230, 90, 70], 4);
            W.set('etProvRed', 1, b.instant); W.set('etProv', 0.85, b.instant);
            sfx(b, 'wind');
          }],
          [20, b => {
            W.set('etShadow', 1, b.instant);
            crowd('citizens', { n: nC, x0: P_.st0, x1: P_.st1, label: '书珊城的民', pose: 'stand' }, dressAs(TOWN, { sex: 'mix', v0: 0.14, v1: 0.34, seed: 0.7 }));
            lay('citizens', slots(P_.st0, P_.st1, nC, P_.seat, 0.012), -1);
            sfx(b, 'crowd', { soft: true });
          }],
          [21.5, b => {
            // 慌乱：有的转身，有的哀哭（每隔一人转向，确定的）
            cmembers('citizens').forEach((m, i) => { m.facing = i % 2 ? 1 : -1; if (W.replaying) m.fd = m.facing; });
            cpose('citizens', 'weep');
            walk('haman', P_.seatH, { speed: 0.03 });
            W.set('etBanquet', 0.55, b.instant);
          }],
          [21.5 + walkT(P_.tip - 0.012, P_.seatH, 0.03) + 0.4, () => { seatOn('haman', P_.seatH, 1); S.hamanSeat = 'banquet'; }],
        ]);
      },
    },

    // ── 4:14 焉知你得了王后的位分不是为现今的机会吗：麻衣与灰；禁食（4:1–17）─
    {
      kind: 'ask', utter: '焉知你得了王后的位分不是为现今的机会吗', cmd: 'if (queen && now) { speak(); }  # 别处 = ?', ref: '4:14',
      verse: [
        { text: '末底改知道所做的这一切事，就撕裂衣服，穿麻衣，蒙灰尘，在城中行走，痛哭哀号。', ref: '以斯帖记 4:1', hold: 7 },
        { text: '末底改托人回复以斯帖说：「……此时你若闭口不言，犹大人必从别处得解脱，蒙拯救；……<br>焉知你得了王后的位分不是为现今的机会吗？」', ref: '以斯帖记 4:13–14', hold: 8 },
        { text: '以斯帖就吩咐人回报末底改说：「你当去招聚书珊城所有的犹大人，为我禁食三昼三夜……<br>然后我违例进去见王，我若死就死吧！」', ref: '以斯帖记 4:15–16', hold: 8 },
      ],
      apply(c) {
        const P_ = X();
        T(c, [
          [0, b => {
            W.goTo(0.34, 6, b.instant);
            W.set('etLots', 0, b.instant); W.set('etBanquet', 0, b.instant); W.set('etHWrath', 0, b.instant);
            unseat('haman'); S.hamanSeat = null;
            walk('haman', P_.g1 - 0.01, { speed: 0.04 });
            crm('citizens'); crm('servants');
          }],
          [0.6, b => {
            // 麻衣比众人更深更灰：在哭号的人中一眼认出他
            add('mordecai', { robe: ROBE.sack, hair: 'none' });
            pose('mordecai', 'weep', { weep: true }); glow('mordecai', 0.35);
            fxAdd(b, { type: 'ash', id: 'mordecai', dur: 3.5 });
            walk('mordecai', P_.st1, { speed: 0.02, pose: 'weep' });
            sfx(b, 'weep');
          }],
          [3.2, b => {
            rm('haman');
            W.set('etAsh', 1, b.instant);
            // 众犹大人跪在他右前方（街上），他独自在朝门
            const nJ = port() ? 3 : 5;
            crowd('jews', { n: nJ, x0: P_.st0 - 0.01, x1: P_.st1, label: '犹大人', pose: 'kneel' }, dressAs(TOWN.map(r => mix(r, [104, 94, 80], 0.55)), { sex: 'mix', v0: 0.26, v1: 0.4, seed: 0.1 }));
            lay('jews', slots(P_.seat - 0.03, P_.st1 + 0.004, nJ, P_.seat, port() ? 0.02 : 0.018), -1);
          }],
          [4.3, b => { fxAdd(b, { type: 'ash', id: 'mordecai', dur: 3.5 }); }],
          [8.3, b => { fxAdd(b, { type: 'ash', id: 'mordecai', dur: 3.5 }); }],
          [12.3, b => { fxAdd(b, { type: 'ash', id: 'mordecai', dur: 3.5 }); }],
          [16.3, b => { fxAdd(b, { type: 'ash', id: 'mordecai', dur: 3.5 }); }],
          [3.2 + walkT(P_.seat, P_.st1, 0.02) + 0.2, () => { walk('mordecai', P_.seat - 0.004, { speed: 0.02, pose: 'weep' }); }],
          [5, () => {
            walk('esther', P_.stand + 0.01, { speed: 0.035 });
            add('hathach', { label: '哈他革', sex: 'm', age: 'adult', x: P_.stand + 0.03, facing: 1, robe: ROBE.hathach, glow: 0.2, hair: 'cloth' });
          }],
          [7, () => { walk('hathach', P_.seat - 0.03, { speed: 0.045 }); }],
          [7 + walkT(P_.stand, P_.seat, 0.045) + 0.2, b => { face('hathach', 1); face('mordecai', -1); passTo(b, 'mordecai', 'hathach', [240, 110, 90]); }],
          [7 + walkT(P_.stand, P_.seat, 0.045) + 2.2, () => { walk('hathach', P_.stand + 0.032, { speed: 0.045 }); }],
          [7 + 2 * walkT(P_.stand, P_.seat, 0.045) + 2.6, b => {
            face('hathach', -1); face('esther', 1);
            W.set('etHidden', 0.6, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [21.5, b => {
            rm('hathach');
            pose('esther', 'pray');
            const nm = port() ? 2 : 3;
            crowd('maids', { n: nm, x0: P_.court0 + 0.006, x1: P_.stand - 0.006, label: '宫女', pose: 'pray' }, dressAs(MAIDEN, { sex: 'f', v0: 0.04, v1: 0.14, seed: 0.4 }));
            lay('maids', slots(P_.court0 - 0.004, P_.stand - 0.004, nm), 1);
            pose('mordecai', 'pray'); cpose('jews', 'pray');
            W.goTo(0.93, 8, b.instant);
          }],
          [25, b => { W.set('etHidden', 0.3, b.instant); }],
        ]);
      },
    },

    // ── 箴 21:1 王的心在耶和华手中：金杖（5:1–4）★ 本卷的签名之景 ──────────
    {
      kind: 'act', utter: '王的心在耶和华手中', cmd: 'turn 王的心 --like 陇沟的水 && extend 金杖', ref: '箴言 21:1',
      verse: [
        { text: '第三日，以斯帖穿上朝服，进王宫的内院，对殿站立。<br>王在殿里坐在宝座上，对着殿门。', ref: '以斯帖记 5:1', hold: 7 },
        { text: '王见王后以斯帖站在院内，就施恩于她，向她伸出手中的金杖；<br>以斯帖便向前摸杖头。', ref: '以斯帖记 5:2', hold: 7 },
        { text: '王对她说：「王后以斯帖啊，你要什么？你求什么，就是国的一半也必赐给你。」<br>以斯帖说：「王若以为美，就请王带着哈曼今日赴我所预备的筵席。」', ref: '以斯帖记 5:3–4', hold: 8 },
      ],
      apply(c) {
        const P_ = X();
        T(c, [
          [0, b => {
            W.goTo(0.33, 6, b.instant);
            crm('maids'); cpose('jews', 'kneel'); pose('mordecai', 'weep');
            W.set('etHidden', 0.3, b.instant); W.set('etGold', 0, b.instant); W.set('etLots', 0, b.instant);
          }],
          [0.8, () => { pose('esther', 'stand'); walk('esther', P_.court0 + 0.004, { speed: 0.03 }); }],
          [2.4, b => {
            add('esther', { robe: ROBE.estherR, accent: GOLDA });
            face('esther', 1);
            sparkleOn(b, 'esther', 26, [255, 226, 170], 0.4);
          }],
          [3.4, () => { walk('esther', P_.stand, { speed: 0.012 }); }],
          [3.4 + walkT(P_.court0, P_.stand, 0.012) + 0.3, () => { face('esther', 1); }],
          [9.2, b => { ringOn(b, 'king', [255, 226, 160], 0.1, 0.3); sfx(b, 'harp', { soft: true }); }],
          [10.2, b => {
            W.set('etScepter', 1, b.instant); W.set('etGold', 1, b.instant); W.set('etRill', 1, b.instant); W.set('etHidden', 0.7, b.instant);
            fxAdd(b, { type: 'pulse', dur: 3.4, delay: 0.3 });
            sfx(b, 'angel', { soft: true }); sfx(b, 'harp');
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.18);
          }],
          [12.6, () => { walk('esther', P_.tip, { speed: 0.022 }); }],
          [12.6 + walkT(P_.stand, P_.tip, 0.022) + 0.3, b => {
            pose('esther', 'point'); face('esther', 1);
            if (!b.instant && fx()) { const f = fig('king'); if (f) fx().sparkle(f._x - 26 * PK(), f._y - 18 * PK(), 40, [255, 230, 160], 10 * SU(), 'top'); }
            sfx(b, 'chime');
          }],
          [21, b => { pose('esther', 'bow'); W.set('etProv', 1, b.instant); cpose('jews', 'stand'); pose('mordecai', 'stand'); }],
          [23, b => { pose('esther', 'stand'); W.set('etScepter', 0, b.instant); W.set('etGold', 0.35, b.instant); W.set('etHidden', 0.2, b.instant); }],
          [24, b => {
            W.set('etBanquet', 1, b.instant);
            add('haman', hamanLook({ x: P_.court0 + 0.004, facing: 1, glow: 0.4 }));
            walk('haman', P_.seatH, { speed: 0.04 });
            crm('jews');
            sfx(b, 'harp', { soft: true });
          }],
          [24 + walkT(P_.court0, P_.seatH, 0.04) + 0.4, () => { seatOn('haman', P_.seatH, 1); S.hamanSeat = 'banquet'; kingOff(); walk('king', P_.seatK, { speed: 0.03 }); }],
          [24 + walkT(P_.court0, P_.seatH, 0.04) + 0.4 + walkT(P_.throne, P_.seatK, 0.03) + 0.5, () => { seatOn('king', P_.seatK, -1); S.kingSeat = 'banquet'; walk('esther', P_.table + 0.004, { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 诗 121:4 保护以色列的，也不打盹也不睡觉：木架；那夜（5:9 — 6:3）────
    {
      kind: 'promise', utter: '保护以色列的，也不打盹也不睡觉', cmd: 'while (night) { watch 以色列; }  # sleep: never', ref: '诗篇 121:4',
      verse: [
        { text: '他的妻细利斯和他一切的朋友对他说：「不如立一个五丈高的木架，明早求王将末底改挂在其上……」<br>哈曼以这话为美，就叫人做了木架。', ref: '以斯帖记 5:14', hold: 8 },
        { text: '那夜王睡不着觉，就吩咐人取历史来，念给他听。', ref: '以斯帖记 6:1', hold: 5.5 },
        { text: '王说：「末底改行了这事，赐他什么尊荣爵位没有？」<br>伺候王的臣仆回答说：「没有赐他什么。」', ref: '以斯帖记 6:3', hold: 7 },
      ],
      apply(c) {
        const P_ = X();
        const hw = walkT(P_.seatH, P_.seat - 0.03, 0.045);
        T(c, [
          [0, b => {
            W.goTo(0.7, 6, b.instant);
            unseat('haman'); S.hamanSeat = null; glow('haman', 0.5);
            walk('haman', P_.seat - 0.03, { speed: 0.045 });
            pose('mordecai', 'sit'); face('mordecai', -1);
          }],
          [1.2, () => { unseat('king'); S.kingSeat = null; walk('king', P_.throne, { speed: 0.03 }); walk('esther', P_.queen, { speed: 0.025 }); }],
          [1.2 + walkT(P_.seatK, P_.throne, 0.03) + 0.5, () => { kingToThrone(); }],
          [hw + 0.3, b => { face('haman', 1); W.set('etHWrath', 1, b.instant); sfx(b, 'fire', { low: true, soft: true }); }],
          [hw + 1.6, b => { W.set('etBanquet', 0, b.instant); walk('haman', P_.court0 - 0.005, { speed: 0.065 }); }],
          [hw + 1.6 + walkT(P_.seat, P_.court0, 0.065) - 0.9, () => { rm('haman'); }],
          [hw + 1.6 + walkT(P_.seat, P_.court0, 0.065) + 0.2, b => {
            add('hamanH', hamanLook({ layer: 1, x: P_.hh + 0.024, facing: -1, glow: 0.25 }));
            add('zeresh', { label: '细利斯', sex: 'f', age: 'adult', layer: 1, x: P_.hh + 0.004, facing: 1, robe: ROBE.zeresh, glow: 0.15 });
            W.set('etHWrath', 0.6, b.instant); W.set('etHLamp', 1, b.instant);
          }],
          [hw + 1.6 + walkT(P_.seat, P_.court0, 0.065) + 1.4, b => { pose('zeresh', 'point'); W.set('etGallows', 1, b.instant); sfx(b, 'build'); }],
          [hw + 1.6 + walkT(P_.seat, P_.court0, 0.065) + 3.2, b => { W.goTo(0.02, 7, b.instant); sfx(b, 'build', { soft: true }); pose('zeresh', 'stand'); pose('hamanH', 'gaze'); }],
          [hw + 1.6 + walkT(P_.seat, P_.court0, 0.065) + 7.5, b => { rm('hamanH'); rm('zeresh'); W.set('etHWrath', 0, b.instant); W.set('etShadow', 0.6, b.instant); W.set('etHLamp', 0, b.instant); }],
          [16.5, b => {
            W.set('etKingLamp', 1, b.instant); W.set('etWatch', 1, b.instant); W.set('etHidden', 0.55, b.instant);
            face('king', 1); sfx(b, 'stars', { soft: true });
          }],
          [18.2, () => { face('king', -1); }],
          [19.2, b => {
            add('scribe', { label: '书记', sex: 'm', age: 'elder', x: P_.chest + 0.006, facing: 1, robe: ROBE.scribe, glow: 0.3, hair: 'cloth', beard: true, prop: null });
            walk('scribe', P_.tip - 0.006, { speed: 0.03 });
            W.set('etScroll', 1, b.instant);
          }],
          [19.2 + walkT(P_.chest, P_.tip, 0.03) + 0.4, b => { pose('scribe', 'kneel'); face('scribe', 1); W.set('etRead', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [26, b => { face('king', -1); if (!b.instant && fx()) { const G = hallGeom(); fx().ring(lerp(G.x0, G.x1, 0.42), G.top - 30 * G.k, [255, 226, 150], M() * 0.1, 2, 1.2); } }],
        ]);
      },
    },

    // ── 诗 113:7 他从灰尘里抬举贫寒人：御马与朝服（6:4–14）─────────────
    {
      kind: 'bless', utter: '他从灰尘里抬举贫寒人', cmd: 'robe 末底改 --royal && ride 御马 --crowned  # 宣告者：哈曼', ref: '诗篇 113:7',
      verse: [
        { text: '哈曼就进去。王问他说：「王所喜悦尊荣的人，当如何待他呢？」<br>哈曼心里说：「王所喜悦尊荣的，不是我是谁呢？」', ref: '以斯帖记 6:6', hold: 7.5 },
        { text: '于是哈曼将朝服给末底改穿上，使他骑上马，走遍城里的街市，<br>在他面前宣告说：「王所喜悦尊荣的人，就如此待他。」', ref: '以斯帖记 6:11', hold: 8 },
        { text: '末底改仍回到朝门，哈曼却忧忧闷闷地蒙着头，急忙回家去了……<br>他的智慧人和他的妻细利斯对他说：「……终必在他面前败落。」', ref: '以斯帖记 6:12–13', hold: 7.5 },
      ],
      apply(c) {
        const P_ = X();
        const hx = P_.tip - 0.014;
        const t1 = 0.5 + walkT(P_.court0, hx, 0.05);           // 哈曼进到王前
        const hG = P_.seat - 0.03;                              // 哈曼到了朝门
        const t2 = 7 + walkT(hx, hG, 0.055);
        // 游行在台前的街上（不进殿）：自朝门前向西，到御园前，又回来；百姓在两旁
        const PV = 0.36, sp = port() ? 0.05 : 0.042;
        const hs = port() ? P_.seat - 0.02 : P_.seat;           // 御马站在末底改的座前（街上）
        const far = port() ? 0.64 : 0.69;                       // 游行最远处（御园前）
        const tR = t2 + 2;                                      // 骑上马
        const out = walkT(hs, far, sp);
        const back = tR + out + 2.2;
        const home = back + walkT(far, hs, sp) + 0.3;
        const nC = port() ? 3 : 5;
        const cx = slots(far - 0.03, P_.gate - 0.01, nC, hs, 0.02);
        T(c, [
          [0, b => {
            W.goTo(0.3, 6, b.instant);
            W.set('etWatch', 0, b.instant); W.set('etKingLamp', 0, b.instant); W.set('etScroll', 0, b.instant); W.set('etRead', 0.3, b.instant);
            W.set('etShadow', 0.5, b.instant); W.set('etHidden', 0.15, b.instant);
            walk('scribe', P_.chest, { speed: 0.035 });
          }],
          [0.5, () => {
            add('haman', hamanLook({ x: P_.court0 + 0.004, facing: 1, glow: 0.4, v: 0 }));
            walk('haman', hx, { speed: 0.05 });
          }],
          [2.4, () => { rm('scribe'); }],
          [t1 + 0.3, b => { pose('haman', 'bow'); face('haman', 1); sfx(b, 'harp', { soft: true }); }],
          [t1 + 1.8, b => { pose('haman', 'raise'); W.set('etHWrath', 0.35, b.instant); }],
          [5.8, b => {
            animal('horse', 'horse', hs, { label: '御马', col: [226, 220, 208], facing: -1, v: PV });
            sfx(b, 'horse', { soft: true });
          }],
          [7, b => { pose('haman', 'stand'); W.set('etHWrath', 0, b.instant); walk('haman', hG, { speed: 0.055 }); }],
          [t2 + 0.2, b => {
            face('haman', 1);
            // 王常穿的朝服（6:8）：王的紫红；头上是白的头巾——与王、哈曼一眼分开
            add('mordecai', { robe: ROBE.king, accent: WHITE_A, hair: 'cloth', v: PV - 0.03 });
            pose('mordecai', 'stand'); glow('mordecai', 0.85);
            fxAdd(b, { type: 'rise', id: 'mordecai', dur: 4.5 });
            sfx(b, 'harp');
            crm('jews');
            crowd('citizens', { n: nC, x0: far - 0.03, x1: P_.gate - 0.01, label: '书珊城的民', pose: 'stand' }, dressAs(TOWN, { sex: 'mix', seed: 0.9 }));
            cmembers('citizens').forEach((m, i) => { m.v = i % 2 ? 0.54 : 0.27; });   // 街的两旁：台脚下一排，街前一排
            lay('citizens', cx, hs);
          }],
          [t2 + 0.9, () => { add('haman', { v: PV + 0.02 }); }],
          [tR, b => {
            ride('mordecai', 'horse');
            face('horse', -1);
            walk('horse', far, { speed: sp });
            walk('haman', far - 0.034, { speed: sp });
            sfx(b, 'horse', { soft: true });
          }],
          [tR + out * 0.5, b => { cpose('citizens', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [tR + out + 0.2, b => {
            pose('haman', 'raise'); face('haman', 1);
            sfx(b, 'crowd'); sparkleOn(b, 'mordecai', 30, [255, 226, 150], 0.3);
          }],
          [back, () => {
            pose('haman', 'stand');
            face('horse', 1);
            walk('horse', hs, { speed: sp });
            walk('haman', hG, { speed: sp });
            cpose('citizens', 'stand');
          }],
          [home, b => {
            ride('mordecai', null);
            add('mordecai', { robe: ROBE.mordecai, accent: null, hair: 'cloth', v: 0 });
            place('mordecai', P_.seat);
            pose('mordecai', 'sit'); face('mordecai', -1); glow('mordecai', 0.5);
            add('haman', { hair: 'cloth', accent: HAMAN_D, v: 0 });
            pose('haman', 'weep'); face('haman', -1);
          }],
          [home + 0.9, () => { walk('haman', P_.court0 - 0.005, { speed: 0.075, pose: 'weep' }); rm('horse'); }],
          [home + 3.2, () => { rm('haman'); crm('citizens'); }],
        ]);
      },
    },

    // ── 诗 7:16 他的毒害必临到他自己的头上：第二次筵席（7:1–10）──────────
    {
      kind: 'judge', utter: '他的毒害必临到他自己的头上', cmd: 'return 毒害 --to 自己的头上  # 诗 7:15 他掘了坑，又挖深了，竟掉在自己所挖的阱里', ref: '诗篇 7:16',
      verse: [
        { text: '王后以斯帖回答说：「我若在王眼前蒙恩，王若以为美，<br>我所愿的，是愿王将我的性命赐给我；我所求的，是求王将我的本族赐给我。……」', ref: '以斯帖记 7:3', hold: 8 },
        { text: '亚哈随鲁王问王后以斯帖说：「擅敢起意如此行的是谁？这人在哪里呢？」<br>以斯帖说：「仇人敌人就是这恶人哈曼！」哈曼在王和王后面前就甚惊惶。', ref: '以斯帖记 7:5–6', hold: 8 },
        { text: '王说：「把哈曼挂在其上。」<br>于是人将哈曼挂在他为末底改所预备的木架上。王的忿怒这才止息。', ref: '以斯帖记 7:9–10', hold: 7 },
      ],
      apply(c) {
        const P_ = X();
        const kIn = walkT(P_.throne, P_.seatK, 0.035);
        const out = walkT(P_.seatK, P_.g1 - 0.004, 0.055);
        T(c, [
          [0, b => {
            W.goTo(0.64, 6, b.instant);
            W.set('etBanquet', 1, b.instant); W.set('etRead', 0, b.instant);
            add('haman', hamanLook({ x: P_.seatH, facing: 1, glow: 0.3, v: 0 }));
            seatOn('haman', P_.seatH, 1); S.hamanSeat = 'banquet';
            kingOff(); walk('king', P_.seatK, { speed: 0.035 });
            walk('esther', P_.table + 0.004, { speed: 0.03 });
          }],
          [kIn + 0.4, () => { seatOn('king', P_.seatK, -1); S.kingSeat = 'banquet'; face('esther', 1); }],
          [3.5, b => { pose('esther', 'kneel'); face('esther', 1); sfx(b, 'harp', { soft: true }); }],
          [10.5, b => {
            pose('esther', 'stand'); face('esther', -1);
            W.set('etGold', 0.3, b.instant);
          }],
          [11.3, b => {
            pose('esther', 'point');
            unseat('haman'); S.hamanSeat = null; pose('haman', 'bow');
            if (!b.instant && fx()) { const h = chestOf('haman'); if (h) fx().ring(h[0], h[1], [255, 110, 90], M() * 0.1, 1.6, 1.4); }
            sfx(b, 'seal', { low: true });
          }],
          [13, b => {
            W.set('etWrath', 1, b.instant);
            unseat('king'); S.kingSeat = null;
            walk('king', P_.g1 - 0.004, { speed: 0.055 });
            pose('esther', 'stand');
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.3);
            sfx(b, 'fire', { low: true });
          }],
          [14, () => { walk('haman', P_.table - 0.012, { speed: 0.03, pose: 'fall' }); }],
          [13 + out + 1.2, () => { walk('king', P_.seatK, { speed: 0.055 }); }],
          [13 + 2 * out + 1.6, b => {
            face('king', -1);
            add('haman', { accent: HAMAN_D });
            pose('haman', 'kneel');
            add('harbonah', { label: '哈波拿', sex: 'm', age: 'adult', x: P_.stand, facing: 1, robe: ROBE.harbonah, glow: 0.2, hair: 'cloth' });
            sfx(b, 'gate', { soft: true });
          }],
          [13 + 2 * out + 3, b => { face('harbonah', -1); pose('harbonah', 'point'); W.set('etGalLit', 1, b.instant); }],
          [13 + 2 * out + 5.2, b => {
            pose('harbonah', 'stand'); W.set('etGalLit', 0, b.instant);
            pose('haman', 'stand'); walk('haman', P_.g1 - 0.005, { speed: 0.035 });
            walk('harbonah', P_.g1 + 0.01, { speed: 0.035 });
          }],
          [13 + 2 * out + 7.2, () => { rm('haman'); }],
          [13 + 2 * out + 8.2, b => {
            W.set('etWrath', 0, b.instant); W.set('etShadow', 0.25, b.instant); W.set('etHidden', 0.3, b.instant);
            rm('harbonah');
            seatOn('king', P_.seatK, -1); S.kingSeat = 'banquet';
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 8:16 犹大人有光荣，欢喜快乐而得尊贵：谕旨；全城的灯（8:1–17）★ ──────
    {
      kind: 'bless', utter: '犹大人有光荣，欢喜快乐而得尊贵', cmd: 'sign --ring 王的戒指 --by 末底改 && light 书珊城', ref: '8:16',
      verse: [
        { text: '末底改奉亚哈随鲁王的名写谕旨，用王的戒指盖印，<br>交给骑御马圈快马的驿卒，传到各处。', ref: '以斯帖记 8:10', hold: 7 },
        { text: '末底改穿着蓝色白色的朝服，头戴大金冠冕，又穿紫色细麻布的外袍，从王面前出来；<br>书珊城的人民都欢呼快乐。', ref: '以斯帖记 8:15', hold: 8 },
        { text: '犹大人有光荣，欢喜快乐而得尊贵。<br>王的谕旨所到的各省各城，犹大人都欢喜快乐，设摆筵宴，以那日为吉日。……', ref: '以斯帖记 8:16–17', hold: 7.5 },
      ],
      apply(c) {
        const P_ = X();
        const mIn = walkT(P_.seat, P_.tip - 0.004, 0.045);
        const mOut = walkT(P_.tip, P_.gate, 0.03);
        // 末底改出来，停在朝门的门洞前（门框住他）；拿着火把欢呼的百姓在台前的草地上（不遮住他）
        const nC = port() ? 3 : 6, cxs = slots(P_.hall1 + 0.004, P_.st1, nC, P_.gate, port() ? 0.03 : 0.022);
        T(c, [
          [0, b => {
            W.goTo(0.4, 6, b.instant);
            W.set('etBanquet', 0, b.instant); W.set('etGallows', 0, b.instant); W.set('etGold', 0.2, b.instant);
            unseat('king'); S.kingSeat = null; walk('king', P_.throne, { speed: 0.035 });
            walk('esther', P_.queen, { speed: 0.03 });
            pose('mordecai', 'stand');
            walk('mordecai', P_.tip - 0.004, { speed: 0.045 });
          }],
          [walkT(P_.seatK, P_.throne, 0.035) + 0.5, () => { kingToThrone(); }],
          [mIn + 0.4, b => { face('mordecai', 1); pose('mordecai', 'bow'); passTo(b, 'king', 'mordecai', [255, 226, 150]); sfx(b, 'seal', { soft: true }); }],
          [mIn + 2.6, b => {
            pose('mordecai', 'stand');
            letters(b, [255, 226, 140], 26); riders(b, [255, 226, 140], 4);
            W.set('etProvRed', 0, b.instant); W.set('etProvGold', 1, b.instant); W.set('etProv', 1, b.instant);
            W.set('etShadow', 0, b.instant);
            sfx(b, 'wind'); sfx(b, 'harp');
          }],
          [mIn + 5.4, b => {
            add('mordecai', { robe: ROBE.royal, accent: WHITE_A, hair: 'cloth' });
            W.set('etCrownM', 1, b.instant);
            sparkleOn(b, 'mordecai', 36, [255, 230, 160], 0.1);
            glow('mordecai', 0.7);
            face('mordecai', 1);
            walk('mordecai', P_.gate, { speed: 0.03 });
          }],
          [mIn + 6.4, () => {
            crowd('citizens', { n: nC, x0: P_.hall1, x1: P_.st1, label: '书珊城的人民', pose: 'stand' }, dressAs(TOWN, { sex: 'mix', v0: 0.27, v1: 0.44, seed: 0.2, torch: true }));
            lay('citizens', cxs, P_.gate);
          }],
          [mIn + 5.4 + mOut + 0.3, b => { pose('mordecai', 'raise'); face('mordecai', -1); cpose('citizens', 'raise'); sfx(b, 'crowd'); }],
          [mIn + 5.4 + mOut + 1.5, b => {
            W.goTo(0.765, 7, b.instant);
            W.set('etLamps', 1, b.instant); W.set('etGlory', 1, b.instant); W.set('etHang', 1, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [mIn + 5.4 + mOut + 4, () => { pose('mordecai', 'stand'); cpose('citizens', 'stand'); }],
        ]);
      },
    },

    // ── 9:1 犹大人反倒辖制恨他们的人：签轮反转（9:1–19）────────────────
    {
      kind: 'act', utter: '犹大人反倒辖制恨他们的人', cmd: 'reverse 普珥  # 十二月十三日：→ 平安', ref: '9:1',
      verse: [
        { text: '十二月，乃亚达月十三日，王的谕旨将要举行，就是犹大人的仇敌盼望辖制他们的日子，<br>犹大人反倒辖制恨他们的人。', ref: '以斯帖记 9:1', hold: 8 },
        { text: '在王各省其余的犹大人也都聚集保护性命……这样，就脱离仇敌，得享平安。', ref: '以斯帖记 9:16', hold: 6.5 },
        { text: '亚达月十三日，行了这事；十四日安息，以这日为设筵欢乐的日子。', ref: '以斯帖记 9:17', hold: 6 },
      ],
      apply(c) {
        const P_ = X();
        T(c, [
          [0, b => {
            // 十三日的黎明之前（签轮在夜里反转，看得清）
            W.goTo(0.2, 6, b.instant);
            W.set('etLots', 1, b.instant); W.set('etLot', 1, true); W.set('etHidden', 0.4, b.instant);
            crm('citizens');
            const nJ = port() ? 3 : 6;
            crowd('jews', { n: nJ, x0: P_.st0 - 0.01, x1: P_.st1, label: '犹大人', pose: 'stand' }, dressAs(TOWN, { sex: 'mix', v0: 0.16, v1: 0.38, seed: 0.35, torch: true }));
            lay('jews', slots(P_.gate + 0.004, P_.st1 + 0.004, nJ, P_.seat - 0.006, port() ? 0.018 : 0.014), -1);
            walk('mordecai', P_.seat - 0.006, { speed: 0.02 });
          }],
          [3.2, b => {
            W.set('etTurn', 1, b.instant); S.turned = 1;
            sfx(b, 'harp'); sfx(b, 'angel', { soft: true });
          }],
          [6.5, b => { cpose('jews', 'raise'); pose('mordecai', 'raise'); face('mordecai', 1); sfx(b, 'crowd', { soft: true }); }],
          [10, b => {
            if (!b.instant && fx()) for (const p of provModel().pts.filter((q, i) => i % 9 === 0)) { const q = provXY(p); fx().sparkle(q[0], q[1], 4, [255, 226, 150], 3 * SU(), 'far'); }
            W.set('etProvGold', 1, b.instant);
          }],
          [12, () => { cpose('jews', 'stand'); pose('mordecai', 'stand'); }],
          [14.5, b => { W.goTo(0.74, 6, b.instant); W.set('etFeast', 1, b.instant); W.set('etLots', 0.55, b.instant); }],
          [16, () => { cpose('jews', 'sit'); pose('mordecai', 'sit'); face('mordecai', 1); }],
          [17.5, b => { W.set('etGlory', 0.7, b.instant); sfx(b, 'laugh', { soft: true }); }],
        ]);
      },
    },

    // ── 9:22 转忧为喜、转悲为乐：普珥日；末底改为本族说和平的话（9:20 — 10:3）─
    {
      kind: 'bless', utter: '转忧为喜、转悲为乐', cmd: 'schedule 普珥日 --every-year --forever  # 家家户户、世世代代', ref: '9:22',
      verse: [
        { text: '以这月的两日为犹大人脱离仇敌得平安、转忧为喜、转悲为乐的吉日。<br>在这两日设筵欢乐，彼此馈送礼物，周济穷人。', ref: '以斯帖记 9:22', hold: 7.5 },
        { text: '照着普珥的名字，犹大人就称这两日为「普珥日」。……<br>各省各城、家家户户、世世代代纪念遵守这两日……', ref: '以斯帖记 9:26–28', hold: 7.5 },
        { text: '犹大人末底改作亚哈随鲁王的宰相，在犹大人中为大，得他众弟兄的喜悦，<br>为本族的人求好处，向他们说和平的话。', ref: '以斯帖记 10:3', hold: 8 },
      ],
      apply(c) {
        const P_ = X();
        const mIn = walkT(P_.seat, P_.tip - 0.006, 0.03);
        T(c, [
          [0, b => {
            W.goTo(0.765, 7, b.instant);
            W.set('etLamps', 1, b.instant); W.set('etHidden', 0.35, b.instant);
            add('poor', { label: '穷人', sex: 'm', age: 'elder', x: P_.st1 - 0.002, v: 0.3, facing: -1, robe: ROBE.poor, glow: 0.1, pose: 'sit', beard: true });
            letters(b, [255, 226, 140], 18);
            sfx(b, 'harp', { soft: true });
          }],
          [2.5, b => {
            for (let i = 0; i < 12; i++) {
              const a = X().city[Math.floor(hsh(i * 3.1) * X().city.length)], z = X().city[Math.floor(hsh(i * 7.3 + 1) * X().city.length)];
              fxAdd(b, { type: 'gift', delay: i * 0.45, dur: 1.6, x0: a, x1: z, l0: 1, l1: 1 });
            }
            sfx(b, 'chime');
          }],
          [4, b => {
            const ms = cmembers('jews');
            if (ms.length) { const m = ms[ms.length - 1]; fxAdd(b, { type: 'gift', dur: 1.8, x0: m.nx, x1: P_.st1 - 0.002, l0: 2, l1: 2 }); }
          }],
          [6, b => { pose('poor', 'stand'); glow('poor', 0.5); sparkleOn(b, 'poor', 18, [255, 226, 150], 0.4); cpose('jews', 'stand'); }],
          [9.5, b => {
            W.set('etPur', 1, b.instant); W.set('etLots', 1, b.instant);
            sfx(b, 'stars');
            if (!b.instant && fx()) { const g = ringGeom(); fx().ring(g.cx, g.cy, [255, 226, 150], g.r * 1.6, 2.6, 1.6); }
          }],
          [11, b => { cpose('jews', 'gaze'); pose('poor', 'gaze'); W.set('etGlory', 1, b.instant); }],
          [15, () => { pose('mordecai', 'stand'); walk('mordecai', P_.tip - 0.006, { speed: 0.03 }); }],
          [15 + mIn + 0.4, b => {
            face('mordecai', -1); pose('mordecai', 'raise'); glow('mordecai', 0.9);
            W.set('etGold', 0.5, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [15 + mIn + 3.4, b => { pose('mordecai', 'stand'); W.set('etHidden', 0.5, b.instant); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '以斯帖记', books: [17], title: '以斯帖', sub: '以斯帖记 1 — 10', tint: [255, 210, 190], music: 'joseph',
    outro: 18,
    intro: [
      { text: '亚哈随鲁作王，从印度直到古实，统管一百二十七省。', ref: '以斯帖记 1:1', hold: 6 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '亚哈随鲁王': { text: '亚哈随鲁作王，从印度直到古实，统管一百二十七省。', ref: '以斯帖记 1:1' },
      '瓦实提': { text: '王后瓦实提在亚哈随鲁王的宫内也为妇女设摆筵席。', ref: '以斯帖记 1:9' },
      '以斯帖': { text: '焉知你得了王后的位分不是为现今的机会吗？', ref: '以斯帖记 4:14' },
      '末底改': { text: '犹大人末底改作亚哈随鲁王的宰相，在犹大人中为大，得他众弟兄的喜悦，<br>为本族的人求好处，向他们说和平的话。', ref: '以斯帖记 10:3' },
      '哈曼': { text: '哈曼心里说：「王所喜悦尊荣的，不是我是谁呢？」', ref: '以斯帖记 6:6' },
      '希该': { text: '希该喜悦以斯帖，就恩待她，急忙给她需用的香品和她所当得的分……', ref: '以斯帖记 2:9' },
      '哈他革': { text: '于是哈他革出到朝门前的宽阔处见末底改。', ref: '以斯帖记 4:6' },
      '米母干': { text: '米母干在王和众首领面前回答说：「王后瓦实提这事，不但得罪王，并且有害于王各省的臣民……」', ref: '以斯帖记 1:16' },
      '哈波拿': { text: '伺候王的一个太监名叫哈波拿，说：「哈曼为那救王有功的末底改做了五丈高的木架，现今立在哈曼家里。」', ref: '以斯帖记 7:9' },
      '辟探': { text: '王的太监中有两个守门的，辟探和提列，恼恨亚哈随鲁王，想要下手害他。', ref: '以斯帖记 2:21' },
      '提列': { text: '王的太监中有两个守门的，辟探和提列，恼恨亚哈随鲁王，想要下手害他。', ref: '以斯帖记 2:21' },
      '书记': { text: '那夜王睡不着觉，就吩咐人取历史来，念给他听。', ref: '以斯帖记 6:1' },
      '细利斯': { text: '他的妻细利斯和他一切的朋友对他说：「不如立一个五丈高的木架……」', ref: '以斯帖记 5:14' },
      '御马': { text: '当将王常穿的朝服和戴冠的御马，', ref: '以斯帖记 6:8' },
      '穷人': { text: '在这两日设筵欢乐，彼此馈送礼物，周济穷人。', ref: '以斯帖记 9:22' },
      '首领臣仆': { text: '在位第三年，为他一切首领臣仆设摆筵席，有波斯和米底亚的权贵，就是各省的贵胄与首领，在他面前。', ref: '以斯帖记 1:3' },
      '书珊城的大小人民': { text: '这日子满了，又为所有住书珊城的大小人民在御园的院子里设摆筵席七日。', ref: '以斯帖记 1:5' },
      '众妇女': { text: '王后瓦实提在亚哈随鲁王的宫内也为妇女设摆筵席。', ref: '以斯帖记 1:9' },
      '七个太监': { text: '第七日，亚哈随鲁王饮酒，心中快乐，就吩咐在他面前侍立的七个太监……', ref: '以斯帖记 1:10' },
      '七个大臣': { text: '有波斯和米底亚的七个大臣……都是达时务的明哲人。', ref: '以斯帖记 1:13' },
      '众女子': { text: '王的谕旨传出，就招聚许多女子到书珊城，交给掌管女子的希该。', ref: '以斯帖记 2:8' },
      '在朝门的臣仆': { text: '在朝门的一切臣仆都跪拜哈曼，因为王如此吩咐；惟独末底改不跪不拜。', ref: '以斯帖记 3:2' },
      '宫女': { text: '我和我的宫女也要这样禁食。', ref: '以斯帖记 4:16' },
      '犹大人': { text: '犹大人有光荣，欢喜快乐而得尊贵。', ref: '以斯帖记 8:16' },
      '书珊城的民': { text: '驿卒奉王命急忙起行，旨意也传遍书珊城。王同哈曼坐下饮酒，书珊城的民却都慌乱。', ref: '以斯帖记 3:15' },
      '书珊城的人民': { text: '书珊城的人民都欢呼快乐。', ref: '以斯帖记 8:15' },
      '御园': { text: '有白色、绿色、蓝色的帐子，用细麻绳、紫色绳从银环内系在白玉石柱上；<br>有金银的床榻摆在红、白、黄、黑玉石的铺石地上。', ref: '以斯帖记 1:6' },
      '王宫': { text: '亚哈随鲁王在书珊城的宫登基；', ref: '以斯帖记 1:2' },
      '宝座': { text: '王在殿里坐在宝座上，对着殿门。', ref: '以斯帖记 5:1' },
      '内院': { text: '若不蒙召，擅入内院见王的，无论男女必被治死；除非王向他伸出金杖，不得存活。', ref: '以斯帖记 4:11' },
      '朝门': { text: '第二次招聚处女的时候，末底改坐在朝门。', ref: '以斯帖记 2:19' },
      '历史书': { text: '究察这事，果然是实，……将这事在王面前写于历史上。', ref: '以斯帖记 2:23' },
      '陇沟的水': { text: '王的心在耶和华手中，好像陇沟的水随意流转。', ref: '箴言 21:1' },
      '书珊城': { text: '犹大人有光荣，欢喜快乐而得尊贵。', ref: '以斯帖记 8:16' },
      '哈曼的家': { text: '哈曼暂且忍耐回家，叫人请他朋友和他妻子细利斯来。', ref: '以斯帖记 5:10' },
      '木架': { text: '于是人将哈曼挂在他为末底改所预备的木架上。王的忿怒这才止息。', ref: '以斯帖记 7:10' },
      '筵席': { text: '王带着哈曼来赴王后以斯帖的筵席。', ref: '以斯帖记 7:1' },
      '一百二十七省': { text: '亚哈随鲁作王，从印度直到古实，统管一百二十七省。', ref: '以斯帖记 1:1' },
      '普珥': { text: '人在哈曼面前，按日日月月掣普珥，就是掣签，要定何月何日为吉，择定了十二月，就是亚达月。', ref: '以斯帖记 3:7' },
      '普珥日': { text: '照着普珥的名字，犹大人就称这两日为「普珥日」。', ref: '以斯帖记 9:26' },
    },
  });
})(window.GS);
