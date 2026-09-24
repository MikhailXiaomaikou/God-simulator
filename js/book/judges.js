/* ─────────────────────────────────────────────────────────────
 * book/judges.js —— 士师记 · 士师（士师记 1 — 21）
 *
 * 约书亚死后，犹大当先上去；平原上的铁车赶不出；波金的哭声。
 * 然后是一轮又一轮的循环：离弃耶和华 → 受欺压 → 哀求 → 耶和华兴起士师 → 国中太平 → 士师死后又转去行恶。
 * 俄陀聂、以笏、珊迦；底波拉在棕树下，巴拉下他泊山，星宿从天上争战，基顺古河把敌人冲没，日头出现、光辉烈烈；
 * 基甸在酒榨里打麦子，火从磐石中出来，「耶和华沙龙」；羊毛上的露水；舔水的三百人；
 * 三更之初，瓶子打破，火把一齐亮在米甸营的四围：「耶和华和基甸的刀！」（本卷的签名之景）；
 * 「惟有耶和华管理你们」；荆棘里出来的火；耶和华心中担忧；耶弗他与他拿着鼓跳舞出来的女儿；
 * 参孙：火焰中升上去的使者，狮子，狐狸的火，利希洼处涌出的泉，迦萨的城门，大利拉，推磨，两根柱子；
 * 米迦的神像，但人的迁移，基比亚的夜；以色列如同一人聚集，缺了一个支派的哭声——
 * 「那时，以色列中没有王，各人任意而行。」满地各自游走的小灯；只有示罗神的殿里，灯还亮着。
 *
 * 远山的岭上有十二处士师的烽火：一位士师兴起，一处烽火点着；士师死了，只剩余烬。
 * 一切位置都以画面宽度的比例记下，随屏幕缩放不变；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'judges';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('jgOpp', 'exp', 0.4);      // 受欺压：地上一层昏黄的尘霾（2:14）
  W.defineLevel('jgStar', 'exp', 0.6);     // 星宿从天上争战（5:20）
  W.defineLevel('jgFlood', 'exp', 0.4);    // 基顺古河涨溢（5:21）
  W.defineLevel('jgDew', 'exp', 0.45);     // 遍地的露水（6:40）
  W.defineLevel('jgJar', 'exp', 1.2);      // 瓶内藏着的火把（7:16）
  W.defineLevel('jgTorch', 'lin', 0.3);    // 打破瓶子，火把一支接一支亮起（7:20）
  W.defineLevel('jgReign', 'exp', 0.35);   // 惟有耶和华管理你们（8:23）：天上的光
  W.defineLevel('jgMercy', 'exp', 0.3);    // 耶和华因以色列人受的苦难，就心中担忧（10:16）
  W.defineLevel('jgLament', 'exp', 0.4);   // 山上为耶弗他的女儿哀哭的女子（11:40）
  W.defineLevel('jgWander', 'exp', 0.22);  // 各人任意而行（21:25）：满地各自游走的小灯

  // ── 地上的位置（画面宽度的比例）：左 = 东（海、约旦河那边），右 = 西（山地）──
  const X = {
    // 犹大上去；平原的铁车；波金
    judah0: 0.6, judah1: 0.74, hills0: 0.86, hills1: 0.98,
    bochim: 0.665, cityA: 0.6, cityB: 0.9,
    // 偶像（诸巴力、亚舍拉）
    idol1: 0.745, idol2: 0.7, idol3: 0.905,
    // 底波拉、他泊山、基顺河
    palm: 0.675, tabor: 0.86, kishonB: 0.575, kishonM: 0.4,
    // 基甸
    oak: 0.815, press: 0.705, rock: 0.76, floor: 0.635, harod: 0.585,
    // 示剑、约坦、寓言的树
    oakS: 0.585, pillar: 0.62, jotham: 0.9, olive: 0.83, fig: 0.865, vine: 0.94, bramble: 0.972,
    // 耶弗他
    mizpah: 0.8, ammon: 0.45,
    // 参孙
    field: 0.665, rockM: 0.755, vineyard: 0.53, lion: 0.55, lehi: 0.655, gate: 0.53, hilltop: 0.905,
    sorek: 0.72, mill: 0.6, temple: 0.8,
    // 米迦、但、示罗、基比亚
    micah: 0.72, shiloh: 0.8, gibeah: 0.585, bethel: 0.665,
  };
  // 远山岭上的十二处烽火（十二位士师）
  const JUDGES = ['俄陀聂', '以笏', '珊迦', '底波拉', '基甸', '陀拉', '睚珥', '耶弗他', '以比赞', '以伦', '押顿', '参孙'];
  const BEACON_X = JUDGES.map((_, i) => 0.565 + i * 0.037);
  const ROBE = {
    othniel: [150, 118, 84], deborah: [176, 120, 100], barak: [118, 94, 74], gideon: [132, 108, 80], angel: [240, 232, 214],
    jephthah: [110, 88, 72], daughter: [206, 170, 150], manoah: [128, 108, 86], wife: [170, 120, 104], samson: [150, 112, 74],
    delilah: [184, 96, 112], micah: [124, 112, 98], levite: [150, 136, 112], abimelech: [150, 70, 64], jotham: [140, 128, 108],
    phil: [150, 110, 78], midian: [92, 70, 60], dan: [110, 92, 76],
  };

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { gates: 0, fable: 0, dance: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  // 物件的尺度与人物相配（人物模块在七日之后把人画大些，手机上再大些）
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.3 : 1) * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const port = () => W.w < W.h * 0.9;

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function babe(id, what) { const c = C(); if (c.carry) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function setAge(id, age) { const f = fig(id); if (f) f.age = age; }
  function crowd(gid, o) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    return C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o));
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cprop(gid, kind) { const g = hasCrowd(gid) && C().crowds.get(gid); if (g) g.members.forEach(m => { m.prop = kind || null; m.propDefault = false; }); }
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    const g = hasCrowd(gid) && C().crowds.get(gid);
    if (!g) return;
    for (const m of g.members) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return;
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)));
  }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2, from: W.replaying ? 'none' : 'fade' }, o || {})));
  }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物头顶的一点（像素）
  function headOf(id, lift) {
    const f = fig(id);
    if (!f) return [W.w * 0.7, W.h * 0.7];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, gY(l, f.nx) - (lift || 30) * LS(l)];
  }
  // 名字的位置：在画面之内（竖屏时经文在顶上，名字稍低一些，不与经文相叠）
  function nameAt(xf, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    if (W.w < W.h * 0.75) cy = Math.max(cy, W.h * 0.34);
    else cy = Math.max(cy, W.h * 0.12);
    return [clamp(xf * W.w, half + 8, W.w - half - 8), cy];
  }
  // 名字放在天上（地平线之上），不压在中景的岛与人的身上
  const skyY = (cy, size) => Math.min(cy, W.horizonY - 0.07 * W.h - size * 0.6);
  // 名字在人的头上以光聚成（士师兴起时）
  function nameOver(b, id, str, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const f = fig(id), xf = f ? f.nx : 0.7, l = f && f.layer != null ? f.layer : 2;
    const n = Array.from(str).length;
    const size = Math.min(o.size || 40 * Math.max(0.62, W.unit), (W.w * 0.8) / (n * 1.08));
    const at = nameAt(xf, skyY(gY(l, xf) - (o.lift || 120) * LS(l) - size, size), size, n);
    const src = () => { const h = headOf(id, 26); return [h[0] + (Math.random() - 0.5) * 40, h[1] + (Math.random() - 0.5) * 30]; };
    fx().nameStr(str, at[0], at[1], size, o.rgb || [255, 228, 170], src, { hold: o.hold || 2.4 });
    if (au() && au().nameChime) U.safe('audio.nameChime', () => au().nameChime(str));
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // 各物件缓动的量（每秒的线性步长）：a 显隐 · fire 火 · lit 光 · grow 长成 · ruin 倾倒/余烬 · k、k2 各物自己的状态
  const EASE = { a: 0.9, fire: 0.7, lit: 0.6, grow: 0.32, ruin: 0.3, k: 0.35, k2: 0.5 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } if (p.tv != null) { p.v = p.tv; p.tv = null; } }
  // prop(id, kind, {x, layer, size, label, v, fd, n, x0, x1, show, fire, lit, grow, ruin, k, k2, tx, tv, spd, ...})
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), tx: null, tv: null, v: 0, spd: 0.02, fd: 1 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
    }
    for (const k of ['x', 'layer', 'size', 'label', 'v', 'fd', 'n', 'x0', 'x1', 'spd', 'tone', 'rk']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.tx != null) p.tx = o.tx;
    if (o.tv != null) p.tv = o.tv;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (!p.model && MODEL[p.kind]) p.model = MODEL[p.kind](p);
    if (W.replaying) snap(p);
    return p;
  }
  function unprop(id) {
    const p = P.get(id);
    if (!p) return;
    if (W.replaying) { P.delete(id); return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function beam(b, xf, layer, o) {                // 自天而降的一道光，落在某处
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l, w: (o.w || 70) * Math.max(0.55, W.unit) * (l === 2 ? 1 : 0.7), k: o.k || 1, rgb: o.rgb });
    if (o.ring !== false && fx()) fx().ring(xf * W.w, gY(l, xf) - 16 * LS(l), o.rgb || [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.nx, f.layer, o); }
  function beamCrowd(b, gid, o) {
    const ms = cmembers(gid);
    if (!ms.length) return;
    let s = 0; for (const m of ms) s += m.tx != null ? m.tx : m.nx;
    beam(b, s / ms.length, ms[0].layer, Object.assign({ w: 150 }, o));
  }

  // ── 精灵图（离屏预绘）───────────────────────────────────────
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
        warm: radial([255, 170, 90], 1), gold: radial([255, 228, 166], 1), white: radial([236, 242, 255], 1),
        ember: radial([255, 92, 36], 1), smoke: radial([132, 124, 118], 0.8, 0.55), soot: radial([34, 28, 26], 0.85, 0.55),
        rose: radial([255, 196, 176], 1, 0.4), dust: radial([196, 170, 132], 0.8, 0.5), torch: radial([255, 150, 60], 1, 0.22),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(img, x, y, r, a) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    ctxA.drawImage(img, x - r, y - r, r * 2, r * 2);
  }
  let ctxA = null;   // 当前绘制的画布（glowAt 用）

  // ── 模型（与屏幕大小无关，以单位长度记）─────────────────────
  const MODEL = {
    oak(p) {
      const r = U.mulberry32(p.seed * 7919 + 13), blobs = [], br = [];
      for (let i = 0; i < 17; i++) {
        const a = Math.PI * (0.04 + 0.92 * (i / 16));
        blobs.push([-Math.cos(a) * (0.44 + r() * 0.12) + (r() - 0.5) * 0.08, -0.6 - Math.sin(a) * (0.24 + r() * 0.1) + (r() - 0.5) * 0.06, 0.12 + r() * 0.09, 0]);
      }
      for (let i = 0; i < 7; i++) blobs.push([(r() - 0.5) * 0.66, -0.66 - r() * 0.14, 0.17 + r() * 0.08, 0]);
      blobs.forEach(b => { b[3] = b[2] * (0.68 + r() * 0.16); });
      for (let i = 0; i < 4; i++) br.push([(i - 1.5) * 0.19 + (r() - 0.5) * 0.08, -0.6 - r() * 0.14]);
      return { blobs, br, lean: (r() - 0.5) * 0.05 };
    },
    altar(p) {
      const r = U.mulberry32(p.seed * 131 + 7), st = [];
      [[4, 0], [3, 1], [2, 2]].forEach(([n, row]) => {
        for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.48 + (r() - 0.5) * 0.08, -0.2 - row * 0.34 + (r() - 0.5) * 0.04, 0.27 + r() * 0.06, 0.19 + r() * 0.04, (r() - 0.5) * 0.4]);
      });
      return { st };
    },
    city(p) {
      const r = U.mulberry32(p.seed * 104729 + 3), n = Math.round(6 + p.size * 8), hs = [];
      const half = 0.3 + p.size * 0.22;
      for (let i = 0; i < n; i++) {
        const ox = (n === 1 ? 0 : (i / (n - 1) - 0.5) * 2 * half) + (r() - 0.5) * 0.05;
        hs.push({ ox, w: 0.07 + r() * 0.06, h: (0.14 + r() * 0.2) * (1 - 0.5 * Math.abs(ox) / half), dome: r() < 0.1, win: r() < 0.6, tw: r() * TAU, br: 0.5 + r() * 0.5 });
      }
      hs.sort((a, b) => b.h - a.h);
      return { hs, half, tower: { ox: (r() - 0.5) * half * 0.6, w: 0.06, h: 0.3 + p.size * 0.12 } };
    },
    camp(p) {
      const r = U.mulberry32(p.seed + 77), n = p.n || 36, items = [];
      for (let i = 0; i < n; i++) {
        const t = (i + 0.15 + r() * 0.7) / n;
        const camel = r() < 0.24;
        items.push({ t, v: Math.pow(r(), 1.2) * 0.9, sz: 0.75 + r() * 0.5, camel, fire: !camel && r() < 0.34, ph: r() * TAU, tilt: (r() - 0.5) * 2, fd: r() < 0.5 ? -1 : 1 });
      }
      items.sort((a, b) => a.v - b.v);
      return { items };
    },
    tabor(p) {
      const r = U.mulberry32(p.seed + 5), N = 40, pts = [], trees = [];
      for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N; pts.push([u, Math.pow(Math.max(0, 1 - u * u), 0.72) * (1 + (i % 3 ? 0 : (r() - 0.5) * 0.05))]); }
      for (let i = 0; i < 26; i++) { const u = (r() - 0.5) * 1.7; trees.push([u, r() * 0.9, 0.5 + r() * 0.6]); }
      return { pts, trees };
    },
    fields(p) { const r = U.mulberry32(p.seed + 5), tuft = []; for (let i = 0; i < (p.layer === 2 ? 270 : 170); i++) tuft.push([r(), r(), r()]); return { tuft }; },
    vineyard(p) { const r = U.mulberry32(p.seed + 9), v = []; for (let i = 0; i < 16; i++) v.push([(i % 8 + 0.5 + (r() - 0.5) * 0.3) / 8, i < 8 ? 0.15 : 0.55, 0.8 + r() * 0.4, r() * TAU]); return { v }; },
    temple(p) {
      const r = U.mulberry32(p.seed + 3), folk = [];
      for (let i = 0; i < 30; i++) folk.push([(i + 0.5 + (r() - 0.5) * 0.6) / 30 * 1.84 - 0.92, 0.85 + r() * 0.3, r() < 0.5 ? 1 : 0, r() * TAU]);
      const rub = [];
      for (let i = 0; i < 26; i++) rub.push([(r() - 0.5) * 1.9, r(), 0.06 + r() * 0.1, r() * 3]);
      return { folk, rub };
    },
    fable(p) {
      const r = U.mulberry32(p.seed + 41), th = [];
      for (let i = 0; i < 22; i++) { const a = -Math.PI * (0.08 + 0.84 * r()); th.push([Math.cos(a) * (0.5 + r() * 0.5), Math.sin(a) * (0.5 + r() * 0.5), r()]); }
      return { th };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  画：火、烟、各种物件
  // ════════════════════════════════════════════════════════════
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !(h > 0)) return;
    SP || sprites();
    if (!SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    const g = h * 4.2;
    ctx.globalAlpha = Math.min(1, k * (0.3 + 0.45 * nightK()));
    ctx.drawImage(SP.warm, x - g / 2, y - h * 0.45 - g / 2, g, g);
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = Math.min(1, k * q[3]);
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9, y - H * 0.55, sx + Math.sin(W.t * 8 + seed + i) * w * 0.45, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一点小火（火把、营火）：只有光晕与一舌火苗，省事
  function spark(ctx, x, y, h, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const f = 0.8 + 0.2 * Math.sin(W.t * 14 + seed * 7.1) * Math.sin(W.t * 5.3 + seed);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, k * 0.9);
    ctx.drawImage(SP.torch, x - h * 2.2, y - h * 2.6, h * 4.4, h * 4.4);
    ctx.fillStyle = 'rgb(255,226,150)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.28, y); ctx.quadraticCurveTo(x - h * 0.3, y - h * 0.6 * f, x + Math.sin(W.t * 9 + seed) * h * 0.15, y - h * 1.1 * f);
    ctx.quadraticCurveTo(x + h * 0.3, y - h * 0.6 * f, x + h * 0.28, y); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 烟柱：程序化的烟团（无粒子，按时间确定）
  function smoke(ctx, x, y, k, H, w, seed, dark, rate, n) {
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const N = n || 13, day = 0.3 + 0.7 * W.daylight;
    const spr = dark ? SP.soot : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.6 : 0.42 * day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 迎光的一侧：+1 右 / −1 左
  const side = x => (litX() >= x ? 1 : -1);

  function drawOak(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, H = 90 * s * (0.3 + 0.7 * p.grow), x = p.x * W.w, y = gY(l, p.x) + 3 * s, m = p.model;
    const sway = W.wind * 0.01 * H + Math.sin(W.t * 0.55 + p.seed) * 0.004 * H;
    ctx.globalAlpha = p.a;
    const trunk = css([60, 44, 32], l);
    ctx.fillStyle = trunk;
    ctx.beginPath();
    ctx.moveTo(x - 0.08 * H, y);
    ctx.quadraticCurveTo(x - 0.028 * H, y - 0.26 * H, x - 0.036 * H + m.lean * H, y - 0.5 * H);
    ctx.lineTo(x + 0.036 * H + m.lean * H, y - 0.5 * H);
    ctx.quadraticCurveTo(x + 0.03 * H, y - 0.26 * H, x + 0.085 * H, y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = trunk; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, 0.026 * H);
    ctx.beginPath();
    for (const b of m.br) { ctx.moveTo(x + m.lean * H, y - 0.46 * H); ctx.quadraticCurveTo(x + b[0] * 0.45 * H, y - 0.56 * H, x + b[0] * H + sway, y + b[1] * H); }
    ctx.stroke();
    ctx.fillStyle = css(p.tone === 'olive' ? [92, 108, 80] : [44, 68, 40], l);
    ctx.beginPath();
    for (const b of m.blobs) { const cx = x + b[0] * H + sway, cy = y + b[1] * H; ctx.moveTo(cx + b[2] * H, cy); ctx.ellipse(cx, cy, b[2] * H, b[3] * H, 0, 0, TAU); }
    ctx.fill();
    const d = side(x);
    ctx.fillStyle = css(p.tone === 'olive' ? [170, 184, 150] : [96, 128, 72], l, 0.5 * (0.2 + 0.8 * W.daylight), 0.1);
    ctx.beginPath();
    for (let i = 0; i < m.blobs.length; i++) {
      const b = m.blobs[i];
      if (b[0] * d < -0.08 || i % 2) continue;
      const cx = x + b[0] * H + sway + d * b[2] * H * 0.28, cy = y + b[1] * H - b[3] * H * 0.3;
      ctx.moveTo(cx + b[2] * 0.62 * H, cy); ctx.ellipse(cx, cy, b[2] * H * 0.62, b[3] * H * 0.5, 0, 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const TENT = [[-1, 0], [-0.9, -0.46], [-0.64, -0.8], [-0.34, -0.66], [0, -1], [0.34, -0.68], [0.64, -0.82], [0.9, -0.48], [1, 0]];
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = baseY(l, p.x, p.v) + 2 * s, hw = 34 * s, h = 27 * s * (0.2 + 0.8 * p.grow);
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.75); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.64 * hw, y - 0.8 * h); ctx.lineTo(x - 1.4 * hw, y);
    ctx.moveTo(x + 0.64 * hw, y - 0.82 * h); ctx.lineTo(x + 1.4 * hw, y);
    ctx.stroke();
    ctx.fillStyle = css([58, 46, 40], l);
    ctx.beginPath();
    for (let i = 0; i < TENT.length; i++) { const q = TENT[i], X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([86, 70, 58], l, 0.55); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.62, -0.3, 0.32, 0.62]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.72 - Math.abs(f) * 0.05) * h); }
    ctx.stroke();
    const dw = 0.17 * hw, dh = 0.6 * h;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.fillRect(x - dw, y - dh, dw * 2, dh);
    const lamp = clamp(nightK() * 1.1, 0, 1) * 0.85;
    if (lamp > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + p.seed);
      ctx.globalAlpha = p.a * lamp * fl * 0.6;
      ctx.fillStyle = 'rgb(255,160,84)';
      ctx.fillRect(x - dw, y - dh, dw * 2, dh);
      const g = hw * 2.2;
      ctx.globalAlpha = p.a * lamp * fl * 0.5;
      ctx.drawImage(SP.warm, x - g / 2, y - dh * 0.5 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = p.a * 0.5;
    const d = side(x);
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
    for (let i = k0; i <= k1; i++) { const q = TENT[i]; if (i === k0) ctx.moveTo(x + q[0] * hw, y + q[1] * h); else ctx.lineTo(x + q[0] * hw, y + q[1] * h); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawAltar(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = baseY(l, p.x, p.v) + 1.5 * s, u = 12 * s, m = p.model, n = m.st.length;
    const shown = p.grow * n;
    if (shown <= 0.01) return;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 116, 100], l);
    ctx.beginPath();
    for (let i = 0; i < n && i < shown; i++) {
      const q = m.st[i], k = clamp(shown - i, 0, 1);
      const cx = x + q[0] * u, cy = y + q[1] * u - (1 - k) * 6 * s;
      ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u * k, q[4], 0, TAU);
    }
    ctx.fill();
    const d = side(x);
    ctx.fillStyle = css([210, 196, 170], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2);
    ctx.beginPath();
    for (let i = 0; i < n && i < shown - 0.5; i++) {
      const q = m.st[i], cx = x + q[0] * u + d * q[2] * u * 0.25, cy = y + q[1] * u - q[3] * u * 0.35;
      ctx.moveTo(cx + q[2] * u * 0.55, cy); ctx.ellipse(cx, cy, q[2] * u * 0.55, q[3] * u * 0.4, q[4], 0, TAU);
    }
    ctx.fill();
    const top = y - 0.98 * u;
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      smoke(ctx, x, top - 6 * s, p.fire * p.a, 150 * s + W.h * 0.12, 7 * s, p.seed, false, 0.07);
      flame(ctx, x, top + 1 * s, 13 * s, p.fire * p.a, p.seed);
    }
  }

  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l), u = 110 * s * p.size, x = p.x * W.w, m = p.model, ruin = p.ruin;
    const bodyC = css(U.mixRGB([186, 160, 124], [58, 46, 40], ruin), l), sideC = css(U.mixRGB([150, 124, 96], [40, 32, 28], ruin), l);
    ctx.globalAlpha = p.a;
    const wx0 = x - m.half * u, wx1 = x + m.half * u, wh = 0.07 * u * (1 - 0.5 * ruin);
    ctx.fillStyle = sideC;
    ctx.beginPath();
    ctx.moveTo(wx0, gY(l, wx0 / W.w) + 2);
    for (let i = 0; i <= 8; i++) { const xx = lerp(wx0, wx1, i / 8); ctx.lineTo(xx, gY(l, xx / W.w) - wh * (ruin > 0.2 && i % 2 ? 0.5 : 1)); }
    ctx.lineTo(wx1, gY(l, wx1 / W.w) + 2);
    ctx.closePath(); ctx.fill();
    const lx = side(x), broken = ruin > 0.15;
    const g0 = gY(l, p.x) + 2;
    const box = (h, ox, w, hgt, dome, o) => {
      const hx = x + ox * u, hh = hgt * u * (1 - 0.74 * ruin * h), ww = w * u, gg = gY(l, hx / W.w) + 2;
      if (o) o._g = gg;
      if (broken) {
        ctx.moveTo(hx - ww / 2, gg); ctx.lineTo(hx - ww / 2, gg - hh);
        ctx.lineTo(hx - ww * 0.15, gg - hh * (0.7 + 0.2 * h)); ctx.lineTo(hx + ww * 0.1, gg - hh * 0.9); ctx.lineTo(hx + ww / 2, gg - hh * 0.55);
        ctx.lineTo(hx + ww / 2, gg); ctx.closePath();
      } else {
        ctx.rect(hx - ww / 2, gg - hh, ww, hh);
        if (dome) { ctx.moveTo(hx + ww * 0.4, gg - hh); ctx.ellipse(hx, gg - hh, ww * 0.4, ww * 0.36, 0, 0, Math.PI, true); }
      }
      return hh;
    };
    ctx.fillStyle = bodyC;
    ctx.beginPath();
    const tw = m.tower;
    box(1, tw.ox, tw.w, tw.h, false, null);
    for (const h of m.hs) h._hh = box(h.br, h.ox, h.w, h.h, h.dome, h);
    ctx.fill();
    ctx.fillStyle = sideC;
    ctx.globalAlpha = p.a * 0.8;
    ctx.beginPath();
    for (const h of m.hs) {
      const hx = x + h.ox * u, ww = h.w * u, hh = h._hh * (broken ? 0.6 : 1);
      ctx.rect(lx > 0 ? hx - ww / 2 : hx + ww * 0.2, h._g - hh, ww * 0.3, hh);
    }
    ctx.fill();
    const nk = nightK();
    if (nk > 0.05 && ruin < 0.5) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,178,96)';
      const ws = Math.max(1, 2.2 * s);
      for (const h of m.hs) {
        if (!h.win) continue;
        ctx.globalAlpha = p.a * nk * (1 - ruin * 2) * (1 - p.lit * 0.9) * (0.55 + 0.35 * Math.sin(W.t * 0.8 + h.tw));
        ctx.fillRect(x + h.ox * u - ws / 2, h._g - h._hh * 0.65, ws, ws * 1.4);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    if (p.k > 0.01) smoke(ctx, x, g0 - u * 0.2, p.k * p.a, W.h * 0.42, 30 * s, p.seed, true, 0.045);
    if (p.fire > 0.01 && SP) {
      const g = u * (1.1 + 0.9 * p.fire);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.fire * p.a * (0.45 + 0.2 * Math.sin(W.t * 5 + p.seed));
      ctx.drawImage(SP.ember, x - g / 2, g0 - u * 0.12 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      for (let i = 0; i < m.hs.length; i += 2) { const h = m.hs[i]; flame(ctx, x + h.ox * u, h._g - h._hh, 9 * s * (0.6 + p.fire), p.fire * 0.9 * p.a, p.seed + i); }
    }
  }

  // 米甸人的营：黑山羊毛的矮帐棚、站着卧着的骆驼、营火与炊烟；自左（东）向右铺开，「像蝗虫那样多」（6:5）
  const cssNear = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l) * 0.45, a, ex);
  function drawCamp(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, m = p.model, g = p.grow, rout = p.k, a = p.a;
    if (g < 0.005 || a < 0.005) return;
    const d = litX();
    const tentC = cssNear([40, 31, 27], l), flapC = cssNear([18, 14, 12], l), rimC = cssNear([226, 190, 140], l, 0.55 * dayA(), 0.25);
    const camC = cssNear([112, 86, 58], l), ropeC = cssNear([90, 74, 58], l, 0.7);
    for (const it of m.items) {
      const k = clamp((g * 1.1 - it.t) * 8, 0, 1);
      if (k <= 0) continue;
      const xf = lerp(p.x0, p.x1, it.t), X0 = xf * W.w, gy = gY(l, xf), y = gy + it.v * fieldH(l, gy) * 0.85 + 1;
      const sz = s * it.sz * (0.85 + 0.35 * it.v) * (0.4 + 0.6 * k);
      if (it.camel) {
        const ca = a * k * (1 - rout);
        if (ca < 0.01) continue;
        ctx.globalAlpha = ca;
        const f = it.fd;
        ctx.strokeStyle = camC; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.6, 1.5 * sz);
        ctx.beginPath();
        for (const lx of [-5, -3, 4, 6]) { ctx.moveTo(X0 + lx * f * sz, y - 9 * sz); ctx.lineTo(X0 + (lx + 0.5) * f * sz, y); }
        ctx.moveTo(X0 + 7 * f * sz, y - 11 * sz); ctx.quadraticCurveTo(X0 + 11 * f * sz, y - 12 * sz, X0 + 11.5 * f * sz, y - 18 * sz);
        ctx.stroke();
        ctx.fillStyle = camC;
        ctx.beginPath();
        ctx.ellipse(X0, y - 11 * sz, 8.5 * sz, 3.6 * sz, 0, 0, TAU);
        ctx.moveTo(X0 + 3 * sz, y - 13 * sz); ctx.ellipse(X0 - 0.5 * f * sz, y - 14 * sz, 4 * sz, 3.4 * sz, 0, Math.PI, TAU);
        ctx.moveTo(X0 + 13.5 * f * sz, y - 18 * sz); ctx.ellipse(X0 + 12.5 * f * sz, y - 18.4 * sz, 2.4 * sz, 1.3 * sz, 0, 0, TAU);
        ctx.fill();
        continue;
      }
      const hw = 15 * sz, h = 10 * sz * (1 - 0.8 * rout);
      const tilt = it.tilt * 0.4 * rout;
      ctx.globalAlpha = a * k;
      ctx.save();
      ctx.translate(X0, y); ctx.rotate(tilt);
      // 拉绳
      ctx.strokeStyle = ropeC; ctx.lineWidth = Math.max(0.4, 0.6 * sz);
      ctx.beginPath(); ctx.moveTo(-hw * 0.7, -h * 0.95); ctx.lineTo(-hw * 1.35, 0); ctx.moveTo(hw * 0.7, -h * 0.95); ctx.lineTo(hw * 1.35, 0); ctx.stroke();
      // 帐幕：三根柱子撑起的黑幕
      ctx.fillStyle = tentC;
      ctx.beginPath();
      ctx.moveTo(-hw, 0); ctx.lineTo(-hw, -h * 0.55); ctx.lineTo(-hw * 0.7, -h * 0.95); ctx.quadraticCurveTo(-hw * 0.35, -h * 0.7, 0, -h);
      ctx.quadraticCurveTo(hw * 0.35, -h * 0.7, hw * 0.7, -h * 0.95); ctx.lineTo(hw, -h * 0.55); ctx.lineTo(hw, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = flapC;
      ctx.fillRect(-hw * 0.28, -h * 0.62, hw * 0.56, h * 0.62);
      ctx.strokeStyle = rimC; ctx.lineWidth = Math.max(0.5, 0.8 * sz);
      ctx.beginPath();
      if (d > X0) { ctx.moveTo(0, -h); ctx.quadraticCurveTo(hw * 0.35, -h * 0.7, hw * 0.7, -h * 0.95); ctx.lineTo(hw, -h * 0.55); }
      else { ctx.moveTo(0, -h); ctx.quadraticCurveTo(-hw * 0.35, -h * 0.7, -hw * 0.7, -h * 0.95); ctx.lineTo(-hw, -h * 0.55); }
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    // 白日的炊烟
    if (W.daylight > 0.2 && rout < 0.9) {
      let n = 0;
      for (const it of m.items) {
        if (!it.fire || n > 5) continue;
        const k = clamp((g * 1.1 - it.t) * 8, 0, 1);
        if (k < 0.5) continue;
        n++;
        const xf = lerp(p.x0, p.x1, it.t), gy = gY(l, xf), y = gy + it.v * fieldH(l, gy) * 0.85;
        smoke(ctx, xf * W.w, y - 2 * s, a * k * (1 - rout) * 0.55 * W.daylight, 60 * s, 3 * s, it.ph, false, 0.05, 6);
      }
    }
    // 营火（夜里）：溃乱时一闪，随即熄灭
    const nk = nightK();
    if (nk > 0.05 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const it of m.items) {
        if (!it.fire) continue;
        const k = clamp((g * 1.1 - it.t) * 8, 0, 1);
        const fk = k * a * nk * ((1 - rout) * 0.6 + Math.sin(Math.PI * clamp(rout, 0, 1)) * 1.4);
        if (fk < 0.01) continue;
        const xf = lerp(p.x0, p.x1, it.t), gy = gY(l, xf), y = gy + it.v * fieldH(l, gy) * 0.85;
        const r = 9 * s * (0.8 + 0.2 * Math.sin(W.t * 6 + it.ph)) * (1 + rout * 1.5);
        ctx.globalAlpha = Math.min(1, fk);
        ctx.drawImage(SP.ember, xf * W.w - r, y - r * 0.8, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // 他泊山：中景平地上独起的一座圆山
  function taborDims(p) {
    const s = LS(1), hw = Math.max(0.1 * W.w, 150 * s) * p.size, H = Math.min(0.15 * W.h, hw * 0.95) * p.grow;
    return { hw, H };
  }
  function drawTabor(ctx, p) {
    if (p.grow < 0.01) return;
    const l = 1, m = p.model, cx = p.x * W.w, D = taborDims(p);
    const yAt = u => { const xf = (cx + u * D.hw) / W.w; return gY(l, xf) + 3; };
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([88, 104, 74], l);
    ctx.beginPath();
    for (let i = 0; i < m.pts.length; i++) { const q = m.pts[i], X1 = cx + q[0] * D.hw, Y1 = yAt(q[0]) - q[1] * D.H; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    // 背光的一面
    const d = side(cx);
    ctx.fillStyle = css([52, 64, 52], l, 0.45);
    ctx.beginPath();
    ctx.moveTo(cx, yAt(0) - D.H);
    for (let i = 0; i < m.pts.length; i++) { const q = m.pts[i]; if (q[0] * d > 0) continue; ctx.lineTo(cx + q[0] * D.hw, yAt(q[0]) - q[1] * D.H * 0.98); }
    ctx.lineTo(cx, yAt(0));
    ctx.closePath(); ctx.fill();
    // 山上的树
    ctx.fillStyle = css([50, 72, 48], l);
    ctx.beginPath();
    for (const t of m.trees) {
      const hh = Math.pow(Math.max(0, 1 - t[0] * t[0]), 0.72) * D.H;
      const tx = cx + t[0] * D.hw, ty = yAt(t[0]) - hh * (0.15 + 0.8 * t[1]), r = 3.2 * LS(l) * t[2];
      ctx.moveTo(tx + r, ty); ctx.ellipse(tx, ty, r, r * 0.8, 0, 0, TAU);
    }
    ctx.fill();
    // 迎光的边
    ctx.strokeStyle = css([220, 226, 190], l, 0.45 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 1.2 * LS(l));
    ctx.beginPath();
    let st = false;
    for (let i = 0; i < m.pts.length; i++) { const q = m.pts[i]; if (q[0] * d < -0.1) continue; const X1 = cx + q[0] * D.hw, Y1 = yAt(q[0]) - q[1] * D.H; if (st) ctx.lineTo(X1, Y1); else { ctx.moveTo(X1, Y1); st = true; } }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 基顺河：自近地的岭线后面流出，向左前方流入海（涨溢时宽而急，满是白浪）
  const RIV_N = 22, RIV_L = new Float32Array(RIV_N * 2), RIV_R = new Float32Array(RIV_N * 2), RIV_C = new Float32Array(RIV_N * 2);
  function riverGeom(p) {
    const s = LS(2), fl = W.lv.jgFlood, B = [X.kishonB * W.w, gY(2, X.kishonB) + 1.5], E = [X.kishonM * W.w, W.h + 14];
    const Cp = [lerp(B[0], E[0], 0.3) + 0.05 * W.w, lerp(B[1], E[1], 0.3)];
    for (let i = 0; i < RIV_N; i++) {
      const t = i / (RIV_N - 1), a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      const x = a * B[0] + b * Cp[0] + c * E[0], y = a * B[1] + b * Cp[1] + c * E[1];
      const w = lerp(1.2, 30, Math.pow(t, 1.35)) * s * (1 + 2.1 * fl) * p.grow;
      RIV_C[2 * i] = x; RIV_C[2 * i + 1] = y;
      RIV_L[2 * i] = x - w; RIV_L[2 * i + 1] = y; RIV_R[2 * i] = x + w; RIV_R[2 * i + 1] = y;
    }
  }
  function riverAt(t) {           // 河心上 t (0 上游 .. 1 河口) 处的点
    const f = clamp(t, 0, 1) * (RIV_N - 1), k = Math.min(RIV_N - 2, Math.floor(f)), r = f - k;
    return [lerp(RIV_C[2 * k], RIV_C[2 * k + 2], r), lerp(RIV_C[2 * k + 1], RIV_C[2 * k + 3], r)];
  }
  function drawKishon(ctx, p) {
    if (p.grow < 0.01) return;
    riverGeom(p);
    const s = LS(2), fl = W.lv.jgFlood;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([58, 50, 38], 2, 0.8);
    ctx.beginPath();
    for (let i = 0; i < RIV_N; i++) { const X1 = RIV_L[2 * i] - 2.5 * s * (i / RIV_N), Y1 = RIV_L[2 * i + 1]; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    for (let i = RIV_N - 1; i >= 0; i--) ctx.lineTo(RIV_R[2 * i] + 2.5 * s * (i / RIV_N), RIV_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    const sky = U.mixRGB(U.mixRGB(W.haze, [70, 110, 150], 0.45), [120, 104, 80], fl * 0.5);
    const lit = 0.22 + 0.78 * W.daylight + 0.1 * W.lv.moon * W.night;
    ctx.fillStyle = U.rgb(sky[0] * lit, sky[1] * lit, sky[2] * lit);
    ctx.beginPath();
    for (let i = 0; i < RIV_N; i++) { if (i) ctx.lineTo(RIV_L[2 * i], RIV_L[2 * i + 1]); else ctx.moveTo(RIV_L[0], RIV_L[1]); }
    for (let i = RIV_N - 1; i >= 0; i--) ctx.lineTo(RIV_R[2 * i], RIV_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    // 顺流而下的粼光；涨溢时是白浪
    ctx.globalCompositeOperation = 'lighter';
    const moon = W.lv.moon * W.night * 0.6;
    ctx.fillStyle = moon > W.daylight * 0.8 ? 'rgb(214,226,255)' : 'rgb(255,246,226)';
    const n = 18 + Math.round(46 * fl);
    for (let i = 0; i < n; i++) {
      const q0 = hsh(i * 3.1), q1 = hsh(i * 7.7) - 0.5, q2 = hsh(i * 1.3);
      const t = U.fract(q0 + W.t * (0.035 + 0.12 * fl) * (0.6 + q2)), pt = riverAt(t);
      const w = lerp(2.5, 34, Math.pow(t, 1.3)) * s * (1 + 2 * fl);
      ctx.globalAlpha = Math.min(1, p.a * (0.1 + 0.4 * W.daylight + moon * 0.8 + 0.6 * fl) * Math.sin(t * Math.PI) * (0.5 + 0.5 * Math.sin(W.t * 2 + i)));
      const gw = w * 0.5 * (0.5 + 0.5 * q2) * (1 + 0.6 * fl);
      ctx.fillRect(pt[0] + q1 * w - gw / 2, pt[1], gw, Math.max(0.7, (0.9 + 1.6 * fl) * s));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 铁车（1:19，4:3）：黑铁的车厢、铜的轮，一匹马；被冲没时随河水漂向海
  function drawChariot(ctx, p) {
    const l = 2, s = LS(l) * p.size * (1 + 0.35 * p.v), x = p.x * W.w, y = baseY(l, p.x, p.v) + 2 * s, d = p.fd || 1;
    const moving = p.tx != null, ph = W.t * 9 + p.seed, gait = moving ? 1 : 0;
    ctx.globalAlpha = p.a;
    ctx.save();
    if (p.k > 0.01) { ctx.translate(x, y); ctx.rotate(-d * 0.5 * p.k); ctx.translate(-x, -y); }
    const HORSE = [74, 58, 48], HD = [52, 42, 36];
    const hx = x + d * 24 * s, hy = y - 13 * s;
    ctx.strokeStyle = css(HD, l); ctx.lineWidth = Math.max(0.8, 1.6 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    const legs = [[-6.5, 0], [-5, Math.PI], [5.5, Math.PI * 0.5], [7, Math.PI * 1.5]];
    for (const [ox, o] of legs) {
      const sw = Math.sin(ph + o) * 3.2 * s * gait, lift = Math.max(0, Math.cos(ph + o)) * 2 * s * gait;
      const kx = hx + d * (ox * s + sw * 0.5), ky = hy + 6.5 * s - lift * 0.5;
      ctx.moveTo(hx + d * ox * s, hy + 1 * s); ctx.lineTo(kx, ky); ctx.lineTo(hx + d * (ox * s + sw), y - lift);
    }
    ctx.stroke();
    ctx.fillStyle = css(HORSE, l);
    ctx.beginPath(); ctx.ellipse(hx, hy, 9.5 * s, 4.4 * s, 0, 0, TAU); ctx.fill();
    const bob = Math.sin(ph * 2) * 0.6 * s * gait;
    ctx.beginPath();
    ctx.moveTo(hx + d * 5 * s, hy - 2.5 * s); ctx.quadraticCurveTo(hx + d * 9 * s, hy - 9 * s + bob, hx + d * 12.5 * s, hy - 12 * s + bob);
    ctx.lineTo(hx + d * 15.5 * s, hy - 8.4 * s + bob); ctx.lineTo(hx + d * 13.4 * s, hy - 7.6 * s + bob);
    ctx.quadraticCurveTo(hx + d * 10 * s, hy - 5 * s, hx + d * 8.5 * s, hy + 1.5 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([40, 32, 28], l); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    ctx.moveTo(hx + d * 5.5 * s, hy - 3.5 * s); ctx.quadraticCurveTo(hx + d * 8.5 * s, hy - 9.5 * s + bob, hx + d * 11.5 * s, hy - 12.5 * s + bob);
    ctx.moveTo(hx - d * 9 * s, hy - 1 * s); ctx.quadraticCurveTo(hx - d * 12.5 * s, hy + 2 * s, hx - d * 12 * s + Math.sin(W.t * 3) * s, hy + 7 * s);
    ctx.stroke();
    ctx.strokeStyle = css([70, 66, 64], l); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * 4 * s, y - 5.5 * s); ctx.quadraticCurveTo(x + d * 12 * s, y - 8 * s, hx - d * 3 * s, hy - 2 * s); ctx.stroke();
    const r = 5.8 * s, wx = x - d * 1 * s, wy = y - r;
    ctx.strokeStyle = css([60, 58, 60], l); ctx.lineWidth = Math.max(0.8, 1.5 * s);
    ctx.beginPath(); ctx.arc(wx, wy, r, 0, TAU); ctx.stroke();
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const a = -ph * 0.6 * d * gait + (i / 3) * Math.PI; ctx.moveTo(wx - Math.cos(a) * r, wy - Math.sin(a) * r); ctx.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r); }
    ctx.stroke();
    // 车厢（黑铁）与车上的人
    ctx.fillStyle = css([70, 74, 82], l);
    ctx.beginPath(); ctx.moveTo(x - d * 4.5 * s, y - 6.5 * s); ctx.lineTo(x + d * 5 * s, y - 6.5 * s); ctx.quadraticCurveTo(x + d * 6.5 * s, y - 12 * s, x + d * 3 * s, y - 15 * s);
    ctx.lineTo(x - d * 4.5 * s, y - 13 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([64, 52, 46], l);
    ctx.beginPath(); ctx.ellipse(x - d * 0.5 * s, y - 17 * s, 2.4 * s, 4 * s, 0, 0, TAU); ctx.moveTo(x - d * 0.2 * s + 2 * s, y - 22.5 * s); ctx.arc(x - d * 0.2 * s, y - 22.5 * s, 2 * s, 0, TAU); ctx.fill();
    // 铁的冷光
    const lit = Math.max(W.daylight * 0.7, nightK() * 0.3 * W.lv.moon);
    ctx.strokeStyle = moving ? 'rgba(236,240,255,' + (0.55 * lit).toFixed(3) + ')' : 'rgba(220,228,240,' + (0.4 * lit).toFixed(3) + ')';
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x - d * 4.5 * s, y - 13 * s); ctx.lineTo(x + d * 3 * s, y - 15 * s); ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // 底波拉的棕树（4:5）
  function drawPalm(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, g = p.grow;
    if (g < 0.01 || p.a < 0.01) return;
    const H = 64 * s * g, lean = -0.12;
    const sway = W.wind * 1.6 * s + Math.sin(W.t * 0.9 + p.seed) * 0.6 * s;
    const tx = x + lean * H + sway, ty = y - H, cxp = x + lean * H * 0.15, cyp = y - H * 0.5;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([104, 82, 58], l);
    ctx.beginPath();
    ctx.moveTo(x - 2.6 * s, y); ctx.quadraticCurveTo(cxp - 1.9 * s, cyp, tx - 1.3 * s, ty);
    ctx.lineTo(tx + 1.3 * s, ty); ctx.quadraticCurveTo(cxp + 1.9 * s, cyp, x + 2.6 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([74, 58, 42], l, 0.8); ctx.lineWidth = Math.max(0.4, 0.55 * s);
    ctx.beginPath();
    const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
    for (let i = 1; i < 12; i++) { const t = i / 12, px = qb(x, cxp, tx, t), py = qb(y, cyp, ty, t), w = 2.3 * s * (1 - t * 0.4); ctx.moveTo(px - w, py); ctx.lineTo(px + w, py - 0.9 * s); }
    ctx.stroke();
    ctx.fillStyle = css([176, 104, 48], l);
    ctx.beginPath(); ctx.ellipse(tx + 1.5 * s, ty + 3.5 * s, 2.4 * s * g, 3.2 * s * g, 0.3, 0, TAU); ctx.fill();
    const ANG = [172, 150, 128, 106, 84, 62, 40, 18, 2];
    const fr = [];
    for (let i = 0; i < ANG.length; i++) {
      const a = (ANG[i] + (hsh(p.seed + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      const L = (23 + 9 * hsh(p.seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux));
      const sw = Math.sin(W.t * 1.3 + i * 1.7 + p.seed) * 0.9 * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      fr.push([ux, uy, L, sw]);
    }
    ctx.fillStyle = css([62, 100, 54], l);
    ctx.beginPath();
    for (const [ux, uy, L, sw] of fr) {
      const ex = tx + ux * L + sw, ey = ty + (uy * 0.5 + 0.48) * L, mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L, wd = 2.6 * s;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, ex, ey); ctx.quadraticCurveTo(mx, my + wd, tx, ty + 0.8 * s);
    }
    ctx.fill();
    const d = side(x);
    ctx.strokeStyle = css([226, 236, 170], l, 0.35 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (const [ux, uy, L, sw] of fr) {
      if (ux * d < -0.2) continue;
      const mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L, wd = 2.6 * s;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, tx + ux * L + sw, ty + (uy * 0.5 + 0.48) * L);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 偶像：亚舍拉（木偶）与巴力的坛，坛上一尊金像；被拆毁时木偶倒下、金光熄灭
  function drawIdol(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, ruin = p.ruin;
    ctx.globalAlpha = p.a;
    // 坛（小，方）
    ctx.fillStyle = css([112, 98, 84], l);
    ctx.fillRect(x - 6 * s, y - 7 * s * (1 - 0.6 * ruin), 12 * s, 7 * s * (1 - 0.6 * ruin));
    // 木偶（一根雕过的柱）
    const H = 40 * s * (0.4 + 0.6 * p.grow), ang = ruin * 1.42;
    const px = x + 9 * s, pw = 2.2 * s;
    ctx.save();
    ctx.translate(px, y); ctx.rotate(ang);
    ctx.fillStyle = css([92, 70, 50], l);
    ctx.beginPath(); ctx.moveTo(-pw, 0); ctx.lineTo(-pw * 0.7, -H); ctx.lineTo(pw * 0.7, -H); ctx.lineTo(pw, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -H - 3 * s, 4 * s, 3.2 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([92, 70, 50], l); ctx.lineWidth = Math.max(0.6, 1.3 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-5 * s, -H - 4 * s); ctx.quadraticCurveTo(0, -H - 10 * s, 5 * s, -H - 4 * s); ctx.stroke();
    ctx.restore();
    // 金像（坛上）
    const gk = (1 - ruin) * p.grow;
    if (gk > 0.02) {
      const iy = y - 7 * s;
      ctx.fillStyle = css([214, 170, 80], l, gk, 0.15);
      ctx.beginPath(); ctx.moveTo(x - 2.4 * s, iy); ctx.lineTo(x - 1.6 * s, iy - 7 * s); ctx.lineTo(x + 1.6 * s, iy - 7 * s); ctx.lineTo(x + 2.4 * s, iy); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(x, iy - 8.8 * s, 1.9 * s, 0, TAU); ctx.fill();
      // 冷冷的金光一闪一闪
      const tw = Math.pow(Math.max(0, Math.sin(W.t * 1.3 + p.seed)), 6);
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = p.a * gk * (0.25 + 0.6 * tw);
        const g = 16 * s;
        ctx.drawImage(SP.gold, x - g, iy - 8 * s - g, g * 2, g * 2);
        ctx.strokeStyle = 'rgb(255,236,170)'; ctx.lineWidth = Math.max(0.5, 0.7 * s);
        ctx.beginPath(); const L = 7 * s * tw; ctx.moveTo(x - L, iy - 8.8 * s); ctx.lineTo(x + L, iy - 8.8 * s); ctx.moveTo(x, iy - 8.8 * s - L); ctx.lineTo(x, iy - 8.8 * s + L); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 酒榨（6:11）：凿在磐石里的一个圆池，旁边是麦捆
  function drawPress(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 116, 98], l);
    ctx.beginPath(); ctx.ellipse(x, y, 20 * s, 5.5 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([40, 34, 30], l);
    ctx.beginPath(); ctx.ellipse(x, y - 0.6 * s, 15 * s, 3.4 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([214, 196, 160], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.ellipse(x, y, 20 * s, 5.5 * s, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    // 麦捆
    ctx.strokeStyle = css([206, 170, 96], l, 1, 0.08); ctx.lineWidth = Math.max(0.5, 0.8 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let k = 0; k < 2; k++) {
      const bx = x + (24 + k * 7) * s, by = y + 1 * s;
      for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.12; ctx.moveTo(bx, by); ctx.lineTo(bx + Math.sin(a) * 12 * s, by - Math.cos(a) * 12 * s); }
    }
    ctx.stroke();
    // 打下的麦糠在光里飘
    if (p.k > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,236,190)';
      for (let i = 0; i < 10; i++) {
        const t = U.fract(W.t * 0.3 + hsh(i + p.seed)), ax = x + (hsh(i * 3.3) - 0.5) * 26 * s + t * 14 * s, ay = y - 6 * s - t * 26 * s;
        ctx.globalAlpha = p.a * p.k * (1 - t) * 0.6 * dayA();
        ctx.fillRect(ax, ay, 1.2 * s, 1.2 * s);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 磐石（6:20；13:19）：献上的肉与饼；火从磐石中出来
  function drawRock(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([118, 108, 96], l);
    ctx.beginPath();
    ctx.moveTo(x - 15 * s, y); ctx.quadraticCurveTo(x - 16 * s, y - 8 * s, x - 9 * s, y - 10 * s); ctx.lineTo(x + 8 * s, y - 11 * s);
    ctx.quadraticCurveTo(x + 16 * s, y - 9 * s, x + 15 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([220, 206, 180], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - 9 * s, y - 10 * s); ctx.lineTo(x + 8 * s, y - 11 * s); ctx.stroke();
    if (p.k2 > 0.02) {
      ctx.globalAlpha = p.a * p.k2 * (1 - clamp(p.fire, 0, 1) * 0.85);
      ctx.fillStyle = css([226, 206, 160], l, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(x - 4 * s, y - 11.6 * s, 4 * s, 1.4 * s, 0, 0, TAU); ctx.ellipse(x + 3.5 * s, y - 11.8 * s, 3.4 * s, 1.3 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([150, 80, 64], l);
      ctx.beginPath(); ctx.ellipse(x, y - 12.6 * s, 3 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      const tall = 1 + Math.max(0, p.fire - 1) * 6;
      const f = Math.min(1, p.fire);
      if (tall > 1.2) smoke(ctx, x, y - 30 * s * tall, f * p.a * 0.6, 180 * s + W.h * 0.1, 10 * s, p.seed, false, 0.06);
      flame(ctx, x, y - 10 * s, 15 * s * tall, f * p.a, p.seed);
    }
  }

  // 禾场上的一团羊毛（6:37–40）：头一个早晨羊毛湿、四围干；第二个早晨羊毛干、遍地是露水
  function drawFloor(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 132, 104], l, 0.85);
    ctx.beginPath(); ctx.ellipse(x, y, 30 * s, 6.5 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([110, 96, 78], l, 0.6); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.ellipse(x, y, 30 * s, 6.5 * s, 0, 0, TAU); ctx.stroke();
    // 羊毛
    const wet = p.k;
    ctx.fillStyle = css(U.mixRGB([236, 230, 214], [178, 184, 190], wet * 0.6), l, 1, 0.1);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) { const ox = (i - 3) * 2.6 * s, oy = -Math.abs(i - 3) * 0.3 * s; ctx.moveTo(x + ox + 3.2 * s, y - 2 * s + oy); ctx.ellipse(x + ox, y - 2 * s + oy, 3.2 * s, 2.4 * s, 0, 0, TAU); }
    ctx.fill();
    // 盆
    if (p.k2 > 0.02) {
      ctx.globalAlpha = p.a * p.k2;
      const bx = x + 16 * s, by = y + 0.5 * s;
      ctx.fillStyle = css([150, 104, 66], l);
      ctx.beginPath(); ctx.moveTo(bx - 5 * s, by - 3.5 * s); ctx.quadraticCurveTo(bx, by + 2 * s, bx + 5 * s, by - 3.5 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(210,228,255,' + (0.7 * p.a * p.k2).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(bx, by - 3.5 * s, 4.6 * s, 1 * s, 0, 0, TAU); ctx.fill();
    }
    // 露水的闪光（湿羊毛上）
    if (wet > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      if (SP) { ctx.globalAlpha = p.a * wet * 0.45; const g = 26 * s; ctx.drawImage(SP.white, x - g, y - 3 * s - g * 0.6, g * 2, g * 1.2); }
      ctx.fillStyle = 'rgb(236,246,255)';
      for (let i = 0; i < 14; i++) {
        const tw = Math.max(0, Math.sin(W.t * (1.5 + hsh(i) * 2) + i * 2.1));
        ctx.globalAlpha = p.a * wet * tw * (0.5 + 0.5 * W.dusk + 0.3 * W.daylight);
        const sx = x + (hsh(i * 1.7) - 0.5) * 18 * s, sy = y - 2 * s + (hsh(i * 2.9) - 0.7) * 5 * s, r = (0.8 + 1.4 * tw) * s;
        ctx.fillRect(sx - r / 2, sy - r / 2, r, r);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 泉（哈律泉 7:1；隐‧哈歌利 15:19）：一汪水与芦苇；k = 涌出来的水
  function drawSpring(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s, g = p.grow;
    if (g < 0.01) return;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([64, 56, 44], l, 0.9);
    ctx.beginPath(); ctx.ellipse(x, y + 0.5 * s, 22 * s * g, 5.4 * s * g, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([44, 70, 96], l, 0.95);
    ctx.beginPath(); ctx.ellipse(x, y, 19 * s * g, 4.2 * s * g, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([86, 110, 62], l); ctx.lineWidth = Math.max(0.6, 0.9 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const rx = x + (hsh(p.seed + i) - 0.5) * 44 * s * g, h = (6 + hsh(i * 3.1) * 9) * s * g, sw = Math.sin(W.t * 1.2 + i) * 1.2 * s;
      if (Math.abs(rx - x) < 14 * s) continue;
      ctx.moveTo(rx, y); ctx.quadraticCurveTo(rx + 2 * s, y - h * 0.6, rx + 3 * s + sw, y - h);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(236,244,255)';
    for (let i = 0; i < 5; i++) {
      const gx = x + Math.sin(W.t * 0.9 + i * 1.7 + p.seed) * 12 * s * g, gy = y + (i - 2) * 0.6 * s;
      ctx.globalAlpha = p.a * (0.3 + 0.35 * Math.sin(W.t * 3 + i * 2.1)) * (0.4 + 0.6 * W.daylight + nightK() * 0.3);
      ctx.fillRect(gx - 1.8 * s, gy - 0.4, 3.6 * s, Math.max(0.8, 0.9 * s));
    }
    // 涌出来的水：一股清泉跳起、落下
    if (p.k > 0.02) {
      const H = 26 * s * p.k;
      ctx.fillStyle = 'rgb(220,236,255)';
      for (let i = 0; i < 28; i++) {
        const t = U.fract(W.t * 0.9 + hsh(i * 1.9)), a = (hsh(i * 4.1) - 0.5) * 1.3;
        const dx = Math.sin(a) * 18 * s * t, dy = -H * 4 * t * (1 - t);
        ctx.globalAlpha = p.a * p.k * (0.35 + 0.3 * W.daylight + 0.2 * nightK()) * (1 - t * 0.6);
        const r = (1 + hsh(i) * 1.2) * s;
        ctx.fillRect(x + dx - r / 2, y - 2 * s + dy - r / 2, r, r);
      }
      if (SP) { ctx.globalAlpha = p.a * p.k * 0.35; const gg = 44 * s; ctx.drawImage(SP.white, x - gg, y - H * 0.6 - gg, gg * 2, gg * 2); }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 约坦的比喻（9:8–15）：橄榄树、无花果树、葡萄树、荆棘
  const FABLE = [['olive', '橄榄树'], ['fig', '无花果树'], ['vine', '葡萄树'], ['bramble', '荆棘']];
  function drawFable(ctx, p) {
    const l = 2, s = LS(l) * p.size, g = p.grow;
    if (g < 0.01) return;
    ctx.globalAlpha = p.a;
    const d = litX();
    for (const [k] of FABLE) {
      const xf = X[k], x = xf * W.w, y = gY(l, xf) + 2 * s;
      if (k === 'olive') {
        const H = 34 * s * g;
        ctx.fillStyle = css([84, 70, 56], l);
        ctx.beginPath(); ctx.moveTo(x - 2 * s, y); ctx.quadraticCurveTo(x - 3 * s, y - H * 0.3, x - 1 * s, y - H * 0.55); ctx.lineTo(x + 1.6 * s, y - H * 0.55); ctx.quadraticCurveTo(x + 1 * s, y - H * 0.3, x + 2.5 * s, y); ctx.fill();
        ctx.fillStyle = css([118, 132, 104], l);
        ctx.beginPath();
        for (let i = 0; i < 7; i++) { const a = i / 6 * Math.PI, cx = x - Math.cos(a) * 10 * s * g, cy = y - H * 0.62 - Math.sin(a) * 7 * s * g; ctx.moveTo(cx + 6 * s * g, cy); ctx.ellipse(cx, cy, 6 * s * g, 4.4 * s * g, 0, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css([196, 206, 178], l, 0.4 * dayA(), 0.1);
        ctx.beginPath(); const sx = d > x ? 5 : -5; ctx.ellipse(x + sx * s, y - H * 0.78, 7 * s * g, 3.2 * s * g, 0, 0, TAU); ctx.fill();
      } else if (k === 'fig') {
        const H = 28 * s * g;
        ctx.strokeStyle = css([96, 84, 70], l); ctx.lineWidth = Math.max(0.8, 2 * s); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 2 * s, y - H * 0.5, x - 6 * s, y - H * 0.8); ctx.moveTo(x, y - H * 0.35); ctx.quadraticCurveTo(x + 4 * s, y - H * 0.6, x + 7 * s, y - H * 0.75); ctx.stroke();
        ctx.fillStyle = css([52, 82, 44], l);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) { const a = hsh(i + 3) * TAU, cx = x + Math.cos(a) * 9 * s * g, cy = y - H * 0.78 + Math.sin(a) * 5 * s * g; ctx.moveTo(cx + 5 * s * g, cy); ctx.ellipse(cx, cy, 5 * s * g, 3.8 * s * g, a, 0, TAU); }
        ctx.fill();
      } else if (k === 'vine') {
        ctx.strokeStyle = css([90, 70, 50], l); ctx.lineWidth = Math.max(0.6, 1.3 * s); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 7 * s, y); ctx.lineTo(x - 7 * s, y - 16 * s * g); ctx.moveTo(x + 7 * s, y); ctx.lineTo(x + 7 * s, y - 16 * s * g); ctx.moveTo(x - 8 * s, y - 15 * s * g); ctx.lineTo(x + 8 * s, y - 15 * s * g); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 4 * s, y - 6 * s, x - 5 * s, y - 10 * s, x, y - 15 * s * g); ctx.stroke();
        ctx.fillStyle = css([70, 104, 52], l);
        ctx.beginPath();
        for (let i = 0; i < 7; i++) { const cx = x + (i - 3) * 2.6 * s, cy = y - 16 * s * g - (i % 2) * 2 * s; ctx.moveTo(cx + 3 * s, cy); ctx.ellipse(cx, cy, 3 * s * g, 2.2 * s * g, 0, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css([92, 54, 96], l);
        ctx.beginPath(); for (const ox of [-4, 2, 5]) { ctx.moveTo(x + ox * s + 1.4 * s, y - 12 * s * g); ctx.ellipse(x + ox * s, y - 12 * s * g, 1.4 * s * g, 2.4 * s * g, 0, 0, TAU); } ctx.fill();
      } else {
        const m = p.model, R = 11 * s * g;
        ctx.strokeStyle = css([78, 70, 56], l); ctx.lineWidth = Math.max(0.5, 0.8 * s); ctx.lineCap = 'round';
        ctx.beginPath();
        for (const t of m.th) { const ex = x + t[0] * R * 1.3, ey = y + t[1] * R; ctx.moveTo(x, y); ctx.quadraticCurveTo(x + t[0] * R * 0.5, y + t[1] * R * 0.8, ex, ey); ctx.moveTo(ex, ey); ctx.lineTo(ex + (t[2] - 0.5) * 3 * s, ey - 2.4 * s); }
        ctx.stroke();
        if (p.fire > 0.01) flame(ctx, x, y - 2 * s, 18 * s * (0.6 + 0.4 * p.fire), p.fire * p.a, p.seed);
      }
    }
    ctx.globalAlpha = 1;
  }

  // 示剑橡树旁的柱子（9:6）
  function drawPillar(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, H = 26 * s * p.grow;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([140, 132, 120], l);
    ctx.beginPath(); ctx.moveTo(x - 4 * s, y); ctx.lineTo(x - 3 * s, y - H); ctx.quadraticCurveTo(x, y - H - 2.5 * s, x + 3 * s, y - H); ctx.lineTo(x + 4 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([226, 216, 196], l, 0.45 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    const d = side(x);
    ctx.beginPath(); ctx.moveTo(x + d * 3.6 * s, y); ctx.lineTo(x + d * 2.8 * s, y - H); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 平顶的房屋（米斯巴耶弗他的家；米迦的住宅与神堂）
  function drawHouse(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, w = 38 * s, h = 25 * s * (0.3 + 0.7 * p.grow);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([170, 146, 112], l);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillRect(x - w / 2 - 1.5 * s, y - h - 2.5 * s, w + 3 * s, 2.5 * s);
    // 神堂（米迦）：一间小屋
    if (p.k2 > 0.01) { ctx.fillRect(x + w / 2, y - h * 0.7, 14 * s, h * 0.7); ctx.fillRect(x + w / 2 - 1 * s, y - h * 0.7 - 2 * s, 16 * s, 2 * s); }
    const d = side(x);
    ctx.fillStyle = css([118, 98, 76], l, 0.7);
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.28, y - h, w * 0.28, h);
    ctx.fillStyle = css([30, 24, 20], l);
    ctx.fillRect(x - 4 * s, y - 13 * s, 8 * s, 13 * s);
    ctx.fillRect(x + 9 * s, y - h + 6 * s, 4 * s, 4 * s);
    if (p.k2 > 0.01) ctx.fillRect(x + w / 2 + 4.5 * s, y - 9 * s, 5 * s, 9 * s);
    ctx.strokeStyle = css([236, 216, 180], l, 0.45 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 1.5 * s, y - h - 2.5 * s); ctx.lineTo(x + w / 2 + 1.5 * s, y - h - 2.5 * s); ctx.stroke();
    const nk = nightK();
    if (nk > 0.05 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 6 + p.seed);
      ctx.globalAlpha = p.a * nk * fl * 0.8;
      ctx.fillStyle = 'rgb(255,176,96)';
      ctx.fillRect(x + 9 * s, y - h + 6 * s, 4 * s, 4 * s);
      ctx.globalAlpha = p.a * nk * fl * 0.35;
      const g = 26 * s; ctx.drawImage(SP.warm, x - g, y - 7 * s - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 神堂里银铸的像（17:4）：冷冷的银光
    if (p.k > 0.01 && SP) {
      const ix = x + w / 2 + 7 * s, iy = y - 9 * s;
      ctx.globalAlpha = p.a * p.k;
      ctx.fillStyle = 'rgb(214,220,228)';
      ctx.fillRect(ix - 1.2 * s, iy - 5 * s, 2.4 * s, 5 * s); ctx.beginPath(); ctx.arc(ix, iy - 6.2 * s, 1.3 * s, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * p.k * (0.3 + 0.4 * Math.pow(Math.max(0, Math.sin(W.t * 1.1 + p.seed)), 5));
      const g = 12 * s; ctx.drawImage(SP.white, ix - g, iy - 5 * s - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 非利士人的禾稼（15:5）：金色的田；k = 狐狸带着火把跑过、火线自左向右烧过去的进度
  function drawFields(ctx, p) {
    const l = p.layer, g = p.grow * p.a;
    if (g < 0.01) return;
    const s = LS(l), tuft = p.model.tuft, burn = p.k, span = p.x1 - p.x0;
    const fx0 = lerp(p.x0, p.x1, burn);
    const fh = l === 2 ? 0.55 : 0.8;
    const rowY = (xf, f) => { const gy = gY(l, xf) + 3 * s; return gy + f * fieldH(l, gy) * fh; };
    // 田的底色：金（未烧）/ 焦黑（已烧）——边缘柔和
    const wash = (xa, xb, rgb, a) => {
      if (xb - xa < 0.002 || a < 0.01) return;
      const xm = (xa + xb) / 2, y0 = rowY(xm, 0), y1 = rowY(xm, 1), cx = xm * W.w, cy = (y0 + y1) / 2, rx = (xb - xa) * W.w * 0.62, ry = Math.max(4 * s, (y1 - y0) * 0.75);
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gr.addColorStop(0, W.shadeCSS(rgb, DEP(l), a)); gr.addColorStop(0.6, W.shadeCSS(rgb, DEP(l), a * 0.7)); gr.addColorStop(1, W.shadeCSS(rgb, DEP(l), 0));
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx); ctx.translate(-cx, -cy);
      ctx.fillStyle = gr; ctx.fillRect(cx - rx, cy - rx, rx * 2, rx * 2);
      ctx.restore();
    };
    wash(fx0, p.x1, [214, 170, 86], 0.55 * g);
    wash(p.x0, fx0, [34, 28, 24], 0.6 * g);
    const sway = W.wind * 2.2 * s;
    const stepQ = (W.quality || 1) < 0.75 ? 2 : 1;
    // 未烧的：金色的穗
    ctx.lineWidth = Math.max(0.7, 1.05 * s);
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = css(pass ? [246, 206, 110] : [200, 150, 70], l, 1, 0.08 + 0.1 * pass);
      ctx.globalAlpha = g;
      ctx.beginPath();
      for (let i = pass; i < tuft.length; i += 2 * stepQ) {
        const q = tuft[i], xf = lerp(p.x0, p.x1, q[0]);
        if (xf < fx0) continue;
        const f = q[1], y = rowY(xf, f), x = xf * W.w;
        const edge = Math.min(1, Math.min(q[0], 1 - q[0]) * 6);
        const th = lerp(6, 14, f) * s * (0.7 + 0.5 * q[2]) * (l === 2 ? 1 : 0.8) * (0.45 + 0.55 * edge);
        const sw = sway * (0.3 + f) + Math.sin(W.t * 1.5 + q[2] * 9 + f * 3) * 0.7 * s;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - th * 0.6, x + sw, y - th);
      }
      ctx.stroke();
    }
    // 烧过的：黑的茬与余烬
    if (burn > 0.01) {
      ctx.strokeStyle = css([36, 30, 26], l, 0.9);
      ctx.globalAlpha = g;
      ctx.beginPath();
      for (let i = 0; i < tuft.length; i += 2 * stepQ) {
        const q = tuft[i], xf = lerp(p.x0, p.x1, q[0]);
        if (xf >= fx0) continue;
        const f = q[1], y = rowY(xf, f), x = xf * W.w, th = lerp(1.5, 4, f) * s;
        ctx.moveTo(x, y); ctx.lineTo(x + 0.5 * s, y - th);
      }
      ctx.stroke();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < tuft.length; i += 4) {
          const q = tuft[i], xf = lerp(p.x0, p.x1, q[0]);
          if (xf >= fx0) continue;
          const age = (fx0 - xf) / Math.max(0.01, span);
          const e = Math.max(0, 1 - age * 2.4) * (0.5 + 0.5 * Math.sin(W.t * 4 + i));
          if (e < 0.03) continue;
          const y = rowY(xf, q[1]), r = 5 * s;
          ctx.globalAlpha = g * e * 0.7;
          ctx.drawImage(SP.ember, xf * W.w - r, y - r, r * 2, r * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      // 火线：沿着田的纵深参差地烧
      if (burn < 0.995) {
        const sc = l === 2 ? 1 : 0.8;
        for (let i = 0; i < 8; i++) {
          const f = hsh(i * 3.1 + p.seed), jig = ((hsh(i * 5.7) - 0.5) * 0.05 + Math.sin(W.t * 2.3 + i * 1.9) * 0.008) * span;
          const xf = clamp(fx0 + jig, p.x0, p.x1), y = rowY(xf, f);
          flame(ctx, xf * W.w, y, (7 + 9 * hsh(i * 9.1)) * s * sc * (0.7 + 0.6 * f), g * 0.95, p.seed + i * 3);
        }
        smoke(ctx, fx0 * W.w, rowY(fx0, 0.2) - 6 * s, g * 0.8, 120 * s, 9 * s * sc, p.seed, true, 0.07, 8);
        // 尾巴上捆着火把的狐狸：一点一点的火在未烧的田里乱窜
        if (SP) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgb(255,170,80)'; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.8, 1.4 * s);
          for (let i = 0; i < 8; i++) {
            const t = U.fract(W.t * (0.22 + 0.1 * hsh(i * 2.2)) + hsh(i * 7.7));
            const xf = fx0 + (0.02 + 0.5 * t) * span;
            if (xf > p.x1) continue;
            const f = 0.5 + 0.45 * Math.sin(W.t * 1.9 + i * 2.4), y = rowY(xf, f) - 3 * s;
            const x = xf * W.w, back = 10 * s;
            ctx.globalAlpha = g * 0.7;
            ctx.beginPath(); ctx.moveTo(x - back, y + Math.cos(W.t * 1.9 + i * 2.4) * 3 * s); ctx.lineTo(x, y); ctx.stroke();
            ctx.globalAlpha = g;
            const r = 5 * s; ctx.drawImage(SP.torch, x - r, y - r, r * 2, r * 2);
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // 亭拿的葡萄园（14:5）
  function drawVineyard(ctx, p) {
    const l = 2, s = LS(l), g = p.grow * p.a;
    if (g < 0.01) return;
    ctx.globalAlpha = g;
    ctx.strokeStyle = css([96, 76, 56], l); ctx.lineWidth = Math.max(0.6, 1.1 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const v of p.model.v) {
      const xf = lerp(p.x0, p.x1, v[0]), y = baseY(l, xf, v[1]), x = xf * W.w, sc = s * (1 + 0.35 * v[1]) * v[2];
      ctx.moveTo(x, y); ctx.lineTo(x, y - 12 * sc);
      ctx.moveTo(x, y); ctx.bezierCurveTo(x + 3 * sc, y - 4 * sc, x - 3 * sc, y - 8 * sc, x + 1 * sc, y - 11 * sc);
    }
    ctx.stroke();
    ctx.fillStyle = css([66, 100, 50], l);
    ctx.beginPath();
    for (const v of p.model.v) {
      const xf = lerp(p.x0, p.x1, v[0]), y = baseY(l, xf, v[1]), x = xf * W.w, sc = s * (1 + 0.35 * v[1]) * v[2];
      for (let i = 0; i < 4; i++) { const cx = x + (i - 1.5) * 2.8 * sc, cy = y - 11.5 * sc - (i % 2) * 1.8 * sc; ctx.moveTo(cx + 3 * sc, cy); ctx.ellipse(cx, cy, 3 * sc, 2.3 * sc, 0, 0, TAU); }
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 少壮的狮子（14:5–6）：k = 0 向人吼叫、扑来；k = 1 倒在地上。k2 = 死狮之内的一群蜂子和蜜（14:8）
  function drawLion(ctx, p) {
    const l = 2, s = LS(l) * p.size * (1 + 0.35 * p.v), x = p.x * W.w, y = baseY(l, p.x, p.v) + 1.5 * s, d = p.fd;
    const moving = p.tx != null, ph = W.t * 10 + p.seed, down = p.k;
    ctx.globalAlpha = p.a;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(d, 1);
    const lift = moving ? Math.abs(Math.sin(ph * 0.5)) * 5 * s : 0;
    const by = -10 * s * (1 - 0.55 * down) - lift;
    const body = css([184, 138, 76], l), mane = css([120, 80, 44], l);
    // 腿
    ctx.strokeStyle = body; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, 3 * s);
    ctx.beginPath();
    if (down < 0.5) {
      const sw = moving ? Math.sin(ph) * 4 * s : 0;
      ctx.moveTo(-8 * s, by + 2 * s); ctx.lineTo(-9 * s - sw, 0);
      ctx.moveTo(-5 * s, by + 2 * s); ctx.lineTo(-4 * s + sw, 0);
      ctx.moveTo(7 * s, by + 2 * s); ctx.lineTo(8 * s + sw, 0);
      ctx.moveTo(10 * s, by + 2 * s); ctx.lineTo(12 * s - sw, 0);
    } else {
      ctx.moveTo(-8 * s, by + 3 * s); ctx.lineTo(-14 * s, -1 * s);
      ctx.moveTo(8 * s, by + 3 * s); ctx.lineTo(15 * s, -1 * s);
    }
    ctx.stroke();
    // 身
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, by, 13 * s, 5.2 * s, 0, 0, TAU); ctx.fill();
    // 尾
    ctx.strokeStyle = body; ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath(); ctx.moveTo(-12 * s, by - 1 * s); ctx.quadraticCurveTo(-19 * s, by - 3 * s + Math.sin(W.t * 2) * 2 * s * (1 - down), -20 * s, by + 4 * s); ctx.stroke();
    ctx.fillStyle = mane;
    ctx.beginPath(); ctx.arc(-20 * s, by + 4.5 * s, 1.6 * s, 0, TAU); ctx.fill();
    // 鬃与头（吼叫时张口）
    const hx = 12 * s, hy = by - 3.5 * s * (1 - down) + down * 2 * s;
    ctx.fillStyle = mane;
    ctx.beginPath(); ctx.ellipse(hx - 1 * s, hy, 6.4 * s, 6.8 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(hx + 3.5 * s, hy + 0.5 * s, 3.6 * s, 3 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 6.5 * s, hy + 1.6 * s, 2 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    if (down < 0.5) { ctx.fillStyle = css([40, 24, 20], l); ctx.beginPath(); ctx.ellipse(hx + 7 * s, hy + 3 * s, 1.4 * s, 0.8 * s * (0.5 + 0.5 * Math.abs(Math.sin(W.t * 2.2))), 0, 0, TAU); ctx.fill(); }
    // 迎光的边
    ctx.strokeStyle = css([240, 206, 150], l, 0.45 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.ellipse(0, by, 13 * s, 5.2 * s, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.restore();
    // 蜂子与蜜
    if (p.k2 > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,214,110)';
      for (let i = 0; i < 12; i++) {
        const a = W.t * (1.3 + hsh(i) * 1.5) + i * 2.1, r = (6 + hsh(i * 2.3) * 10) * s;
        ctx.globalAlpha = p.a * p.k2 * 0.8;
        ctx.fillRect(x + Math.cos(a) * r, y - 8 * s + Math.sin(a * 1.3) * r * 0.5, 1.2 * s, 1.2 * s);
      }
      ctx.globalAlpha = p.a * p.k2 * 0.4;
      const g = 16 * s; ctx.drawImage(SP.gold, x - g, y - 6 * s - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 迦萨的城门（16:3）：两座门楼、门楣；k = 门扇、门框、门闩都被拆下来扛走了
  function drawGate(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s;
    const tw = 13 * s, th = 46 * s, gap = 13 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 128, 100], l);
    ctx.beginPath();
    ctx.rect(x - gap - tw, y - th, tw, th); ctx.rect(x + gap, y - th, tw, th);
    ctx.rect(x - gap - tw - 30 * s, y - th * 0.62, 30 * s, th * 0.62); ctx.rect(x + gap + tw, y - th * 0.62, 30 * s, th * 0.62);
    ctx.fill();
    for (const ox of [-gap - tw, gap]) for (let i = 0; i < 3; i++) ctx.fillRect(x + ox + i * tw / 2.4, y - th - 3 * s, tw / 4, 3 * s);
    if (p.k < 0.99) {
      ctx.fillRect(x - gap, y - th * 0.86, gap * 2, 5 * s * (1 - p.k));
      ctx.globalAlpha = p.a * (1 - p.k);
      ctx.fillStyle = css([96, 70, 48], l);
      ctx.fillRect(x - gap + 1 * s, y - th * 0.8, gap - 1.5 * s, th * 0.8);
      ctx.fillRect(x + 0.5 * s, y - th * 0.8, gap - 1.5 * s, th * 0.8);
      ctx.fillStyle = css([60, 44, 32], l);
      ctx.fillRect(x - gap + 1 * s, y - th * 0.45, gap * 2 - 2 * s, 2.2 * s);
      ctx.globalAlpha = p.a;
    }
    ctx.fillStyle = css([24, 20, 18], l, 0.9 * p.k);
    if (p.k > 0.01) ctx.fillRect(x - gap, y - th * 0.8, gap * 2, th * 0.8);
    const d = side(x);
    ctx.strokeStyle = css([236, 214, 176], l, 0.4 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const ox of [-gap - tw, gap]) { const ex = d > 0 ? x + ox + tw : x + ox; ctx.moveTo(ex, y); ctx.lineTo(ex, y - th); }
    ctx.stroke();
    // 城楼上的灯（夜里）
    const nk = nightK();
    if (nk > 0.05 && SP && p.k < 0.5) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * nk * 0.6;
      const g = 14 * s;
      for (const ox of [-gap - tw / 2, gap + tw / 2]) ctx.drawImage(SP.warm, x + ox - g, y - th * 0.7 - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 两扇门（被扛在肩上，或放在山顶上）
  function doorsAt(ctx, x, y, s, ang, a, l) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang);
    ctx.globalAlpha = a;
    ctx.fillStyle = css([96, 70, 48], l);
    ctx.fillRect(-12 * s, -18 * s, 11.4 * s, 36 * s); ctx.fillRect(0.6 * s, -18 * s, 11.4 * s, 36 * s);
    ctx.fillStyle = css([60, 44, 32], l);
    ctx.fillRect(-14 * s, -2 * s, 28 * s, 2.4 * s);
    ctx.strokeStyle = css([220, 190, 140], l, 0.4 * dayA() + 0.15 * nightK(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.strokeRect(-12 * s, -18 * s, 24 * s, 36 * s);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawDoors(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1 * s;
    doorsAt(ctx, x, y - 17 * s, s * 0.9, -0.12, p.a, l);
  }

  // 磨（16:21）：下磨石、上磨石、一根推磨的杠
  function drawMill(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([120, 112, 100], l);
    ctx.beginPath(); ctx.ellipse(x, y - 2 * s, 16 * s, 4.5 * s, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - 16 * s, y - 6 * s, 32 * s, 4 * s);
    ctx.fillStyle = css([140, 132, 118], l);
    ctx.beginPath(); ctx.ellipse(x, y - 7 * s, 12 * s, 3.4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - 12 * s, y - 13 * s, 24 * s, 6 * s);
    ctx.beginPath(); ctx.ellipse(x, y - 13 * s, 12 * s, 3.4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([50, 44, 38], l);
    ctx.beginPath(); ctx.ellipse(x, y - 13.3 * s, 2.4 * s, 0.8 * s, 0, 0, TAU); ctx.fill();
    // 杠
    const a = Math.sin(W.t * 0.4) * 0.25 * p.k;
    ctx.strokeStyle = css([96, 72, 50], l); ctx.lineWidth = Math.max(0.8, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 6 * s, y - 12 * s); ctx.lineTo(x + Math.cos(a) * 26 * s, y - 12 * s - Math.sin(a) * 2 * s); ctx.stroke();
    // 铜链
    ctx.strokeStyle = css([150, 110, 70], l, 0.6 * p.k); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(x - 16 * s, y - 4 * s); ctx.quadraticCurveTo(x - 24 * s, y + 2 * s, x - 32 * s, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 大衮的庙（16:23–30）：两根托房的柱子；平顶上约有三千男女观看；k = 倒塌
  function templeDims(p) { const s = LS(2) * p.size; return { s, hw: 82 * s, H: 78 * s, roof: 9 * s, pil: 13 * s }; }
  function drawTemple(ctx, p) {
    const l = 2, D = templeDims(p), s = D.s, x = p.x * W.w, y = gY(l, p.x) + 4 * s, k = p.k, m = p.model;
    const stone = css([176, 156, 124], l), dark = css([46, 38, 32], l), rimC = css([242, 222, 184], l, 0.45 * dayA(), 0.25);
    ctx.globalAlpha = p.a;
    // 台基
    ctx.fillStyle = css([150, 132, 106], l);
    ctx.fillRect(x - D.hw - 8 * s, y - 5 * s, 2 * D.hw + 16 * s, 5 * s);
    if (k < 0.98) {
      // 殿内的暗
      ctx.fillStyle = dark;
      ctx.globalAlpha = p.a * (1 - k);
      ctx.fillRect(x - D.hw + 12 * s, y - 5 * s - D.H, 2 * D.hw - 24 * s, D.H);
      ctx.globalAlpha = p.a;
      // 两端的墙
      const wall = (sx, ang) => {
        ctx.save(); ctx.translate(x + sx * D.hw, y - 5 * s); ctx.rotate(ang);
        ctx.fillStyle = stone; ctx.fillRect(sx > 0 ? -16 * s : 0, -D.H * (1 - 0.35 * k), 16 * s, D.H * (1 - 0.35 * k));
        ctx.restore();
      };
      wall(-1, -k * 0.35); wall(1, k * 0.35);
      // 中间两根托房的柱子
      const col = (sx, ang) => {
        ctx.save(); ctx.translate(x + sx * D.pil, y - 5 * s); ctx.rotate(ang);
        const hh = D.H * (1 - 0.45 * k);
        ctx.fillStyle = stone;
        ctx.fillRect(-3.4 * s, -hh, 6.8 * s, hh);
        ctx.fillRect(-5 * s, -hh, 10 * s, 3 * s); ctx.fillRect(-5 * s, -3 * s, 10 * s, 3 * s);
        ctx.strokeStyle = rimC; ctx.lineWidth = Math.max(0.5, 0.9 * s);
        ctx.beginPath(); ctx.moveTo(side(x) * 3.4 * s, 0); ctx.lineTo(side(x) * 3.4 * s, -hh); ctx.stroke();
        ctx.restore();
      };
      col(-1, -k * 1.1); col(1, k * 1.1);
      // 平顶：从中间折断，两半落下
      const rt = y - 5 * s - D.H - D.roof, drop = k * D.H * 0.7;
      for (const sx of [-1, 1]) {
        ctx.save();
        ctx.translate(x + sx * (D.hw + 6 * s), rt + D.roof / 2 + drop * 0.5);
        ctx.rotate(-sx * k * 0.42);
        ctx.fillStyle = stone;
        ctx.fillRect(sx > 0 ? -(D.hw + 6 * s) : 0, -D.roof / 2, D.hw + 6 * s, D.roof);
        ctx.fillRect(sx > 0 ? -(D.hw + 6 * s) : 0, -D.roof / 2 - 3.5 * s, D.hw + 6 * s, 2 * s);
        ctx.fillStyle = rimC;
        ctx.fillRect(sx > 0 ? -(D.hw + 6 * s) : 0, -D.roof / 2 - 3.5 * s, D.hw + 6 * s, Math.max(0.6, 0.8 * s));
        ctx.restore();
      }
      // 平顶上观看的人
      const fa = clamp(1 - k * 4, 0, 1);
      if (fa > 0.01) {
        ctx.globalAlpha = p.a * fa;
        ctx.fillStyle = css([72, 58, 50], l);
        ctx.beginPath();
        for (const f of m.folk) {
          const fx0 = x + f[0] * D.hw, hh = 9 * s * f[1], by = rt - 3.5 * s + Math.sin(W.t * 1.3 + f[3]) * 0.3 * s;
          ctx.moveTo(fx0 - 1.6 * s, by); ctx.lineTo(fx0 - 1.1 * s, by - hh * 0.72); ctx.lineTo(fx0 + 1.1 * s, by - hh * 0.72); ctx.lineTo(fx0 + 1.6 * s, by); ctx.closePath();
          ctx.moveTo(fx0 + 1.3 * s, by - hh * 0.86); ctx.arc(fx0, by - hh * 0.86, 1.3 * s, 0, TAU);
        }
        ctx.fill();
        ctx.globalAlpha = p.a;
      }
    }
    // 倒塌之后的乱石
    if (k > 0.5) {
      const rk = smoothstep(0.5, 1, k);
      ctx.fillStyle = stone;
      ctx.globalAlpha = p.a * rk;
      ctx.beginPath();
      for (const r of m.rub) {
        const rx = x + r[0] * D.hw, ry = y - 5 * s - r[1] * 16 * s * rk, rr = r[2] * D.hw * 0.5;
        ctx.moveTo(rx + rr, ry); ctx.ellipse(rx, ry, rr, rr * 0.6, r[3], 0, TAU);
      }
      ctx.fill();
      ctx.fillStyle = css([226, 206, 170], l, 0.3 * dayA(), 0.2);
      ctx.beginPath();
      for (let i = 0; i < m.rub.length; i += 2) { const r = m.rub[i], rx = x + r[0] * D.hw, ry = y - 5 * s - r[1] * 16 * s * rk, rr = r[2] * D.hw * 0.3; ctx.moveTo(rx + rr, ry - rr * 0.3); ctx.ellipse(rx, ry - rr * 0.3, rr, rr * 0.4, r[3], 0, TAU); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 示罗神的殿（18:31）：细麻的院幔、会幕；灯（撒上 3:3 神的灯还没有熄灭——下一卷的事，这里只让它亮着）
  function drawTabernacle(ctx, p) {
    const l = p.layer, s = LS(l) * p.size * (l === 1 ? 1.35 : 1), x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    const hw = 34 * s, fh = 6 * s;
    ctx.fillStyle = css([226, 220, 204], l, 0.95);
    ctx.fillRect(x - hw, y - fh, hw * 2, fh);
    ctx.fillStyle = css([150, 120, 80], l);
    for (let i = 0; i <= 8; i++) ctx.fillRect(x - hw + i * hw / 4 - 0.5 * s, y - fh - 1.5 * s, 1 * s, fh + 1.5 * s);
    ctx.fillStyle = css([74, 56, 50], l);
    ctx.beginPath(); ctx.moveTo(x - 4 * s, y - fh + 1 * s); ctx.lineTo(x - 4 * s, y - 15 * s); ctx.lineTo(x + 18 * s, y - 15 * s); ctx.lineTo(x + 18 * s, y - fh + 1 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 60, 70], l, 0.8);
    ctx.fillRect(x - 4 * s, y - 15 * s, 22 * s, 1.6 * s);
    ctx.fillStyle = css([130, 116, 100], l);
    ctx.fillRect(x - 17 * s, y - fh - 3 * s, 6 * s, 3 * s);
    const lamp = p.lit;
    if (lamp > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.93 + 0.07 * Math.sin(W.t * 3.1 + p.seed);
      ctx.globalAlpha = p.a * lamp * fl * (0.35 + 0.6 * nightK());
      const g = 30 * s; ctx.drawImage(SP.gold, x + 7 * s - g, y - 9 * s - g, g * 2, g * 2);
      ctx.globalAlpha = p.a * lamp * fl;
      ctx.fillStyle = 'rgb(255,226,160)';
      ctx.fillRect(x + 5.5 * s, y - 11 * s, 3 * s, 4 * s);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 米迦雕刻的像（被但人带走，立在但城）
  function drawSilver(ctx, p) {
    const l = p.layer, s = LS(l) * p.size * (l === 1 ? 1.4 : 1), x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([120, 110, 100], l);
    ctx.fillRect(x - 4 * s, y - 4 * s, 8 * s, 4 * s);
    ctx.fillStyle = 'rgb(206,212,222)';
    ctx.fillRect(x - 1.5 * s, y - 11 * s, 3 * s, 7 * s); ctx.beginPath(); ctx.arc(x, y - 12.4 * s, 1.6 * s, 0, TAU); ctx.fill();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * (0.3 + 0.45 * Math.pow(Math.max(0, Math.sin(W.t * 1.2 + p.seed)), 5));
      const g = 14 * s; ctx.drawImage(SP.white, x - g, y - 10 * s - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 远山上的烽火：一位士师兴起，便点着一处（fire）；士师死了，余烬微红（ruin）
  function drawBeacon(ctx, p) {
    const l = 0, s = Math.max(0.3, LS(l)) * 1.25, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([112, 102, 92], l);
    ctx.beginPath(); ctx.ellipse(x - 2.2 * s, y - 1.5 * s, 2.6 * s, 1.8 * s, 0, 0, TAU); ctx.ellipse(x + 2.2 * s, y - 1.4 * s, 2.4 * s, 1.7 * s, 0, 0, TAU); ctx.ellipse(x, y - 3.8 * s, 2.2 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    if (!SP) return;
    if (p.ruin > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * p.ruin * (0.35 + 0.15 * Math.sin(W.t * 1.7 + p.seed)) * (0.4 + 0.6 * nightK()) * (1 - p.fire);
      const g = 7 * s; ctx.drawImage(SP.ember, x - g, y - 5 * s - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    if (p.fire > 0.01) {
      flame(ctx, x, y - 4 * s, 7 * s, p.fire * p.a, p.seed);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * p.fire * (0.25 + 0.35 * nightK());
      const g = 26 * s; ctx.drawImage(SP.warm, x - g, y - 8 * s - g, g * 2, g * 2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：随程度而变的天与地（受欺压的尘霾、星宿争战、露水、火把、天上的光……）
  // ════════════════════════════════════════════════════════════
  // 受欺压：地上一层昏黄的尘霾，天边发暗（2:14–15）
  function drawOppSky(ctx) {
    const k = W.lv.jgOpp;
    if (k < 0.01) return;
    const hz = W.horizonY;
    const g = ctx.createLinearGradient(0, hz * 0.3, 0, hz + 4);
    g.addColorStop(0, U.rgba(60, 44, 36, 0));
    g.addColorStop(1, U.rgba(128, 88, 58, 0.5 * k * (0.4 + 0.6 * W.daylight)));
    ctx.fillStyle = g; ctx.fillRect(-10, hz * 0.3, W.w + 20, hz * 0.7 + 4);
  }
  function drawOppLand(ctx) {
    const k = W.lv.jgOpp;
    if (k < 0.01) return;
    const hz = W.horizonY;
    const g = ctx.createLinearGradient(0, hz, 0, W.h);
    g.addColorStop(0, U.rgba(122, 88, 60, 0.3 * k));
    g.addColorStop(0.45, U.rgba(86, 62, 44, 0.3 * k));
    g.addColorStop(1, U.rgba(36, 26, 20, 0.42 * k));
    ctx.fillStyle = g; ctx.fillRect(-10, hz, W.w + 20, W.h - hz + 10);
  }

  // 星宿从天上争战，从其轨道攻击西西拉（5:20）：星一颗接一颗离了轨道，拖着光落在铁车之间
  function drawStarWar(ctx) {
    const k = W.lv.jgStar;
    if (k < 0.01) return;
    const u = Math.max(0.6, W.unit), N = 16;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const per = 1.6 + hsh(i * 3.3) * 1.8, ph = U.fract(W.t / per + hsh(i * 1.1));
      if (ph > 0.5) continue;
      const q = ph / 0.5;
      const sx = (0.08 + 0.84 * hsh(i * 5.1)) * W.w, sy = (0.05 + 0.25 * hsh(i * 2.7)) * W.h;
      const tx = (X.kishonM + 0.02 + 0.16 * hsh(i * 9.3)) * W.w, ty = gY(2, tx / W.w) + (0.02 + 0.08 * hsh(i * 4.4)) * W.h;
      const e = U.easeIn ? U.easeIn(q) : q * q;
      const hx = lerp(sx, tx, e), hy = lerp(sy, ty, e);
      const tl = 0.16;
      const bx = lerp(sx, tx, Math.max(0, e - tl)), by = lerp(sy, ty, Math.max(0, e - tl));
      const a = k * (q < 0.9 ? 1 : (1 - q) * 10);
      const gr = ctx.createLinearGradient(bx, by, hx, hy);
      gr.addColorStop(0, 'rgba(200,220,255,0)'); gr.addColorStop(1, U.rgba(236, 244, 255, 0.9 * a));
      ctx.strokeStyle = gr; ctx.lineWidth = 2 * u;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(hx, hy); ctx.stroke();
      if (SP) { ctx.globalAlpha = a; const r = 7 * u; ctx.drawImage(SP.white, hx - r, hy - r, r * 2, r * 2); ctx.globalAlpha = 1; }
      if (q > 0.92 && SP) { ctx.globalAlpha = k * (1 - q) * 12 * 0.6; const r = 26 * u; ctx.drawImage(SP.white, tx - r, ty - r, r * 2, r * 2); ctx.globalAlpha = 1; }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 遍地的露水（6:40）：近地的草上满是细小的闪光
  function drawDew(ctx) {
    const k = W.lv.jgDew;
    if (k < 0.01) return;
    const s = LS(2), span = W.landSpan ? W.landSpan(2) : null;
    const x0 = span ? Math.max(span[0] / W.w, 0.36) : 0.38;
    const tw = 0.35 + 0.65 * Math.max(W.dusk, W.daylight * 0.8);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(236,246,255)';
    for (let i = 0; i < 230; i++) {
      const xf = lerp(x0, 0.995, hsh(i * 1.37));
      if (Math.abs(xf - X.floor) < 0.028) continue;
      const v = Math.pow(hsh(i * 2.9), 1.4) * 0.9, y = baseY(2, xf, v) + 2 * s;
      const t = Math.max(0, Math.sin(W.t * (1 + hsh(i * 4.1) * 2.2) + i * 2.3));
      ctx.globalAlpha = Math.min(1, k * t * tw);
      const r = (0.9 + t * 1.8) * s * (1 + 0.4 * v);
      ctx.fillRect(xf * W.w - r / 2, y - r / 2, r, r);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 三百人的火把（7:16–21）：瓶内藏着的火、打破瓶子后在营的四围一支接一支亮起 ──
  // 远山的岭上（营后）与中景两翼的火把由此画；近处基甸那一队是人物模块里拿着火把的人
  const RING = [];
  (function buildRing() {
    for (let i = 0; i < 17; i++) RING.push({ l: 0, xf: 0.57 + 0.34 * (i / 16) + (hsh(i * 7.3) - 0.5) * 0.01, v: 0, ord: 0.55 + 0.45 * Math.abs(i / 16 - 0.5) * 2, seed: i * 1.7 });
    for (let i = 0; i < 5; i++) RING.push({ l: 1, xf: 0.505 + i * 0.01, v: 0.15 + 0.6 * hsh(i * 3.9), ord: 0.28 + i * 0.03, seed: 20 + i });
    for (let i = 0; i < 5; i++) RING.push({ l: 1, xf: 0.893 + i * 0.009, v: 0.15 + 0.6 * hsh(i * 5.3), ord: 0.34 + i * 0.03, seed: 40 + i });
  })();
  const ringLit = r => smoothstep(r.ord * 0.72, r.ord * 0.72 + 0.28, W.lv.jgTorch);
  function drawRing(ctx, layer) {
    const jar = W.lv.jgJar, tk = W.lv.jgTorch;
    if (jar < 0.01 && tk < 0.01) return;
    for (const r of RING) {
      if (r.l !== layer) continue;
      const s = Math.max(0.3, LS(r.l)) * (r.l === 0 ? 1.2 : 1), x = r.xf * W.w, y = baseY(r.l, r.xf, r.v);
      const lit = ringLit(r);
      // 拿火把的人（小小的剪影）
      const fa = Math.max(jar, lit);
      ctx.globalAlpha = fa;
      ctx.fillStyle = css([34, 28, 26], r.l);
      const h = 17 * s;
      ctx.beginPath(); ctx.moveTo(x - 2.2 * s, y); ctx.lineTo(x - 1.4 * s, y - h * 0.8); ctx.lineTo(x + 1.4 * s, y - h * 0.8); ctx.lineTo(x + 2.2 * s, y); ctx.closePath();
      ctx.moveTo(x + 1.6 * s, y - h * 0.92); ctx.arc(x, y - h * 0.92, 1.6 * s, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      // 瓶里的暗火
      if (jar > 0.01 && lit < 0.99 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = jar * (1 - lit) * 0.35;
        const g = 4 * s; ctx.drawImage(SP.ember, x + 2 * s - g, y - h * 0.62 - g, g * 2, g * 2);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      if (lit > 0.01) spark(ctx, x + 2.4 * s, y - h * 1.05, 4.2 * s, lit, r.seed);
    }
  }
  // 火把的光晕：在一切之上（'air'）
  function drawTorchGlow(ctx) {
    const tk = W.lv.jgTorch;
    if (tk < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const nk = 0.35 + 0.65 * nightK();
    for (const r of RING) {
      const lit = ringLit(r);
      if (lit < 0.01) continue;
      const s = Math.max(0.3, LS(r.l)) * (r.l === 0 ? 1.2 : 1), x = r.xf * W.w + 2.4 * s, y = baseY(r.l, r.xf, r.v) - 18 * s;
      const fl = 0.85 + 0.15 * Math.sin(W.t * 11 + r.seed * 3);
      ctx.globalAlpha = lit * nk * 0.55 * fl;
      const g = 26 * s + 10; ctx.drawImage(SP.torch, x - g, y - g, g * 2, g * 2);
    }
    for (const gid of ['co1', 'co2', 'co3']) {
      for (const m of cmembers(gid)) {
        if (m.prop !== 'torch' || !(m._h > 0) || !isFinite(m._x) || !isFinite(m._y)) continue;
        const fl = 0.85 + 0.15 * Math.sin(W.t * 11 + m._x * 0.1);
        const x = m._x + (m.fd || 1) * 0.12 * m._h, y = m._y - 1.02 * m._h, g = m._h * 1.5;
        ctx.globalAlpha = (m.alpha == null ? 1 : m.alpha) * nk * 0.5 * fl;
        ctx.drawImage(SP.torch, x - g, y - g, g * 2, g * 2);
      }
    }
    // 营火照着的地
    ctx.globalAlpha = tk * nk * 0.18;
    const cx = 0.74 * W.w, cy = gY(1, 0.74), R = 0.32 * W.w;
    ctx.drawImage(SP.warm, cx - R, cy - R * 0.45, R * 2, R * 0.9);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 惟有耶和华管理你们（8:23）：云缝里落下来的光，照遍全地
  function drawReign(ctx, air) {
    const k = W.lv.jgReign;
    if (k < 0.01 || !SP) return;
    const ox = 0.7 * W.w, oy = -0.12 * W.h, L = Math.hypot(W.w, W.h) * 1.05;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) {
      if (air && i % 2) continue;
      const a = (i - 4) * 0.16 + Math.sin(W.t * 0.13 + i) * 0.02, w = (0.07 + 0.05 * hsh(i * 3.1)) * W.w * (air ? 0.8 : 1);
      ctx.save();
      ctx.translate(ox, oy); ctx.rotate(a);
      ctx.globalAlpha = k * (air ? 0.12 : 0.3 + 0.12 * Math.sin(W.t * 0.4 + i * 1.3)) * (0.6 + 0.4 * W.daylight);
      ctx.drawImage(SP.beam, -w / 2, 0, w, L);
      ctx.restore();
    }
    if (air) { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; return; }
    ctx.globalAlpha = k * 0.5;
    const g = 0.45 * W.w; ctx.drawImage(SP.gold, ox - g, oy - g * 0.5, g * 2, g * 1.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 耶和华因以色列人受的苦难，就心中担忧（10:16）：温柔的光自天垂下，像一声叹息
  function drawMercy(ctx, air) {
    const k = W.lv.jgMercy;
    if (k < 0.01 || !SP) return;
    if (!air) {
      // 天染上一层温柔的玫瑰金
      const hz = W.horizonY, g = ctx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, U.rgba(255, 196, 180, 0.1 * k)); g.addColorStop(0.7, U.rgba(255, 206, 178, 0.22 * k)); g.addColorStop(1, U.rgba(255, 222, 190, 0.34 * k));
      ctx.fillStyle = g; ctx.fillRect(-10, -10, W.w + 20, hz + 10);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = k * 0.4;
      const R = 0.6 * W.w; ctx.drawImage(SP.rose, 0.72 * W.w - R, -R * 0.55, R * 2, R * 1.3);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      return;
    }
    // 光的微粒像叹息一样，缓缓落在人的身上
    ctx.globalCompositeOperation = 'lighter';
    const u = Math.max(0.6, W.unit);
    for (let i = 0; i < 54; i++) {
      const per = 9 + hsh(i * 2.2) * 8, t = U.fract(W.t / per + hsh(i * 1.3));
      const x = (0.5 + 0.48 * hsh(i * 3.7)) * W.w + Math.sin(W.t * 0.3 + i) * 14 * u, y = lerp(0.04 * W.h, gY(2, x / W.w) - 6, t);
      const r = (3 + 4 * hsh(i)) * u;
      ctx.globalAlpha = k * Math.sin(t * Math.PI) * 0.75;
      ctx.drawImage(SP.rose, x - r, y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = k * 0.35;
    const cx = 0.73 * W.w, cy = gY(2, 0.73) - 20 * LS(2), R = 0.2 * W.w;
    ctx.drawImage(SP.rose, cx - R, cy - R * 0.6, R * 2, R * 1.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 山上为耶弗他的女儿哀哭的女子（11:38–40）：中景山上几盏小灯
  const LAMENT = [0.83, 0.852, 0.874, 0.9, 0.918];
  function drawLament(ctx, air) {
    const k = W.lv.jgLament;
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < LAMENT.length; i++) {
      const xf = LAMENT[i], s = LS(1), x = xf * W.w, y = gY(1, xf) - 12 * s * (1 + 0.1 * i);
      const fl = 0.8 + 0.2 * Math.sin(W.t * 7 + i * 2);
      if (air) { ctx.globalAlpha = k * 0.45 * fl * (0.3 + 0.7 * nightK()); const g = 18 * s + 6; ctx.drawImage(SP.warm, x - g, y - g, g * 2, g * 2); }
      else { ctx.globalAlpha = k * fl; ctx.fillStyle = 'rgb(255,214,150)'; ctx.fillRect(x - 1.2 * s, y - 1.6 * s, 2.4 * s, 3 * s); }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 各人任意而行（21:25）：满地的人各拿一盏小灯，各往各的方向，彼此不相干
  const WANDER = [];
  (function buildWander() {
    for (let i = 0; i < 34; i++) {
      const near = i < 22;
      WANDER.push({ l: near ? 2 : 1, x0: near ? 0.4 + 0.58 * hsh(i * 1.9) : 0.53 + 0.44 * hsh(i * 2.3), v: near ? Math.pow(hsh(i * 4.7), 1.3) * 0.75 : hsh(i * 3.3) * 0.7,
        a1: 0.03 + 0.07 * hsh(i * 5.1), w1: 0.05 + 0.09 * hsh(i * 6.1), p1: hsh(i * 7.1) * TAU, a2: 0.02 * hsh(i * 8.3), w2: 0.2 + 0.2 * hsh(i * 9.9), p2: hsh(i) * TAU, seed: i * 2.3 });
    }
  })();
  function wanderPos(w) {
    let xf = w.x0 + w.a1 * Math.sin(W.t * w.w1 + w.p1) + w.a2 * Math.sin(W.t * w.w2 + w.p2);
    const lo = w.l === 2 ? 0.38 : 0.51;
    if (xf < lo) xf = lo + (lo - xf);
    if (xf > 0.995) xf = 0.995 - (xf - 0.995);
    const dir = Math.cos(W.t * w.w1 + w.p1) >= 0 ? 1 : -1;
    return [xf, dir];
  }
  function drawWander(ctx, air) {
    const k = W.lv.jgWander;
    if (k < 0.01) return;
    for (const w of WANDER) {
      const [xf, dir] = wanderPos(w), s = LS(w.l) * (1 + 0.35 * w.v) * (w.l === 2 ? 1.3 : 1.15), x = xf * W.w, y = baseY(w.l, xf, w.v);
      const h = 30 * s, lx = x + dir * 5 * s, ly = y - h * 0.62;
      if (!air) {
        // 行路的人：小小的剪影，一步一步
        ctx.globalAlpha = k;
        ctx.fillStyle = css([40, 32, 28], w.l);
        const st = Math.sin(W.t * 4 * (0.6 + w.w1 * 3) + w.seed) * 2.2 * s;
        ctx.beginPath();
        ctx.moveTo(x - 3 * s + st * 0.3, y); ctx.lineTo(x - 2 * s, y - h * 0.5); ctx.lineTo(x - 1.8 * s, y - h * 0.82); ctx.lineTo(x + 1.8 * s, y - h * 0.82); ctx.lineTo(x + 2.2 * s, y - h * 0.5); ctx.lineTo(x + 3 * s - st * 0.3, y); ctx.closePath();
        ctx.moveTo(x + 2.2 * s, y - h * 0.92); ctx.arc(x + dir * 0.5 * s, y - h * 0.92, 2.2 * s, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = css([40, 32, 28], w.l); ctx.lineWidth = Math.max(0.5, 1 * s);
        ctx.beginPath(); ctx.moveTo(x + dir * 1.5 * s, y - h * 0.72); ctx.lineTo(lx, ly); ctx.stroke();
        ctx.globalAlpha = k;
        ctx.fillStyle = 'rgb(255,208,140)';
        ctx.fillRect(lx - 1.1 * s, ly - 1.4 * s, 2.2 * s, 2.8 * s);
      } else if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = k * (0.3 + 0.5 * nightK()) * (0.85 + 0.15 * Math.sin(W.t * 9 + w.seed));
        const g = 14 * s + 4; ctx.drawImage(SP.warm, lx - g, ly - g, g * 2, g * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 参孙扛着的城门（16:3）
  function drawCarried(ctx) {
    if (S.gates !== 1) return;
    const f = fig('samson');
    if (!f || !(f._h > 0) || !isFinite(f._x)) return;
    const s = LS(2);
    doorsAt(ctx, f._x - (f.fd || 1) * 3 * s, f._y - f._h * 0.95, s * 0.8, (f.fd || 1) * 0.35, f.alpha == null ? 1 : f.alpha, 2);
  }

  // ── 转瞬的光（情节里放出，重演时不放）─────────────────────
  function drawTransients(ctx, pass) {
    if (!FXL.length || !SP) return;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'blink' && pass === 'far') {
        // 十二处烽火先后一闪
        if (e.t < 0) continue;
        const env = Math.sin(Math.PI * q), xf = BEACON_X[e.i], s = Math.max(0.3, LS(0)) * 1.25, x = xf * W.w, y = gY(0, xf) - 4 * s;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.8;
        const g = 22 * s; ctx.drawImage(SP.gold, x - g, y - g, g * 2, g * 2);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'beam' && pass === 'air') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = gY(e.l, e.xf) + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.42 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        ctx.globalAlpha = env * e.k * 0.5;
        const g = e.w * 1.8;
        ctx.drawImage(SP.gold, x - g / 2, y - g * 0.55, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'plant' && pass === 'air') {
        // 约坦说到哪一棵树，那一棵便亮一亮
        const env = Math.sin(Math.PI * q), s = LS(2), x = X[e.k] * W.w, y = gY(2, X[e.k]) - 16 * s;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.55;
        const g = 34 * s; ctx.drawImage(e.k === 'bramble' ? SP.ember : SP.gold, x - g, y - g, g * 2, g * 2);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'fireline' && pass === 'near') {
        // 火从荆棘里出来，沿着地面烧向示剑（9:15，9:20）
        const s = LS(2), hx = lerp(e.x0, e.x1, U.easeInOut ? U.easeInOut(q) : q);
        const env = 1 - smoothstep(0.85, 1, q);
        for (let i = 0; i < 9; i++) {
          const xf = hx + (e.x0 < e.x1 ? -1 : 1) * i * 0.012;
          if ((e.x0 < e.x1 && xf < e.x0) || (e.x0 > e.x1 && xf > e.x0)) continue;
          flame(ctx, xf * W.w, gY(2, xf) + 2 * s, (12 - i) * s, env * (1 - i / 9), i * 3.1);
        }
      } else if (e.type === 'ropes' && pass === 'air') {
        // 他臂上的绳就像火烧的麻一样（15:14）
        const f = fig('samson');
        if (!f || !(f._h > 0)) continue;
        const env = 1 - q;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,200,120)';
        for (let i = 0; i < 26; i++) {
          const a = hsh(i * 3.3) * TAU, r = f._h * (0.1 + q * 0.9 * hsh(i * 1.7));
          ctx.globalAlpha = env * 0.9;
          ctx.fillRect(f._x + Math.cos(a) * r, f._y - f._h * 0.55 + Math.sin(a) * r * 0.7 - q * f._h * 0.3, 1.6, 1.6);
        }
        ctx.globalAlpha = env * 0.5;
        const g = f._h * 1.2; ctx.drawImage(SP.warm, f._x - g, f._y - f._h * 0.55 - g, g * 2, g * 2);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'dust' && pass === 'air') {
        // 房子倒塌的尘（16:30）
        const D = templeDims({ size: 1 }), x = e.xf * W.w, y = gY(2, e.xf);
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.4, 1, q));
        for (let i = 0; i < 16; i++) {
          const a = (i / 15 - 0.5) * 2.6, r = D.hw * (0.3 + q * 1.4) * (0.6 + 0.4 * hsh(i));
          const px = x + Math.sin(a) * r * 1.3, py = y - D.H * 0.3 - Math.cos(a) * r * 0.5 - q * D.H * 0.3, g = D.hw * (0.35 + q * 0.6);
          ctx.globalAlpha = env * 0.55 * (0.4 + 0.6 * W.daylight);
          ctx.drawImage(SP.dust, px - g, py - g, g * 2, g * 2);
        }
      } else if (e.type === 'flare' && pass === 'air') {
        // 愿爱你的人如日头出现，光辉烈烈（5:31）
        const env = smoothstep(0, 0.25, q) * (1 - smoothstep(0.5, 1, q));
        const sx = W.sun ? W.sun.x : W.w * 0.1, sy = W.sun ? W.sun.y : W.horizonY;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.55;
        const g = 0.5 * W.w; ctx.drawImage(SP.gold, sx - g, sy - g, g * 2, g * 2);
        ctx.strokeStyle = 'rgba(255,236,190,' + (0.35 * env).toFixed(3) + ')'; ctx.lineWidth = Math.max(1, 1.4 * W.unit);
        ctx.beginPath();
        for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + W.t * 0.05, r0 = 0.04 * W.w, r1 = (0.3 + 0.15 * (i % 2)) * W.w * (0.6 + 0.4 * q); ctx.moveTo(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0); ctx.lineTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1); }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'column' && pass === 'air') {
        // 火焰从坛上往上升，耶和华的使者在火焰中也升上去了（13:20）
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
        const x = e.xf * W.w, y = gY(2, e.xf) - 10 * LS(2), w = 60 * Math.max(0.55, W.unit);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.75;
        ctx.drawImage(SP.beam, x - w / 2, -30, w, y + 30);
        ctx.globalAlpha = env * 0.5;
        const g = w * 1.4; ctx.drawImage(SP.warm, x - g, y - g, g * 2, g * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const DRAW = {
    oak: drawOak, tent: drawTent, altar: drawAltar, city: drawCity, camp: drawCamp, tabor: drawTabor, kishon: drawKishon,
    chariot: drawChariot, palm: drawPalm, idol: drawIdol, press: drawPress, rock: drawRock, floor: drawFloor, spring: drawSpring,
    fable: drawFable, pillar: drawPillar, house: drawHouse, fields: drawFields, vineyard: drawVineyard, lion: drawLion,
    gate: drawGate, doors: drawDoors, mill: drawMill, temple: drawTemple, tabernacle: drawTabernacle, silver: drawSilver, beacon: drawBeacon,
  };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  // 画的先后：远的、大的先画；人与车在后
  const ORDER = { tabor: 0, kishon: 0, fields: 0, vineyard: 1, city: 1, camp: 1, oak: 2, palm: 2, temple: 2, gate: 2, tabernacle: 2, house: 2, fable: 3,
    tent: 3, idol: 3, pillar: 3, press: 4, floor: 4, spring: 4, altar: 5, rock: 5, mill: 5, doors: 5, silver: 5, beacon: 5, lion: 6, chariot: 7 };
  const ord = p => (ORDER[p.kind] || 0) + (p.v || 0) * 0.5;
  let sorted = [], sortedN = -1, sortedT = -1;
  function sortProps() {
    if (sortedN === P.size && sortedT === Math.floor(W.t * 2) && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => ord(a) - ord(b) || a.x - b.x);
    sortedN = P.size; sortedT = Math.floor(W.t * 2);
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  const SCENE = {
    init() { sprites(); },
    resize() {},
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f * (k === 'k' && p.rk ? p.rk : 1));
        }
        if (p.tx != null) {
          const d = p.tx - p.x, v = p.spd * f;
          if (Math.abs(d) <= v) { p.x = p.tx; p.tx = null; } else p.x += Math.sign(d) * v;
        }
        if (p.tv != null) {
          const d = p.tv - p.v, v = p.spd * 1.6 * f;
          if (Math.abs(d) <= v) { p.v = p.tv; p.tv = null; } else p.v += Math.sign(d) * v;
        }
        if (p.dying && p.a < 0.01) P.delete(id);
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { drawOppSky(ctx); drawReign(ctx); drawMercy(ctx, false); return; }
      const l = LAYER_OF_PASS[pass];
      if (pass === 'mid' && W.lv.jgTorch > 0.01 && SP) {
        const k = W.lv.jgTorch * (0.4 + 0.6 * nightK()), cx = 0.71 * W.w, cy = gY(1, 0.71), R = 0.24 * W.w;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = k * 0.5;
        ctx.drawImage(SP.warm, cx - R, cy - R * 0.42, R * 2, R * 0.7);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      if (l != null) {
        for (const p of sortProps()) {
          if (p.layer !== l || p.a < 0.005 || p.kind === 'chariot' || p.kind === 'lion') continue;
          const fn = DRAW[p.kind];
          if (fn) U.safe('judges.' + p.kind, () => fn(ctx, p));
        }
        if (pass === 'far') { drawRing(ctx, 0); drawTransients(ctx, 'far'); }
        if (pass === 'mid') { drawRing(ctx, 1); drawLament(ctx, false); if (W.lv.jgWander > 0.01) drawWander(ctx, false); }
        if (pass === 'near') { drawDew(ctx); drawOppLand(ctx); drawTransients(ctx, 'near'); }
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'near') {
        for (const p of sortProps()) if (p.layer === 2 && p.a >= 0.005 && (p.kind === 'chariot' || p.kind === 'lion')) DRAW[p.kind](ctx, p);
        drawCarried(ctx);
      }
      if (pass === 'air') {
        drawStarWar(ctx);
        drawReign(ctx, true);
        drawTorchGlow(ctx);
        drawMercy(ctx, true);
        drawLament(ctx, true);
        drawWander(ctx, true);
        drawTransients(ctx, 'air');
      }
    },
    // 调试：各物件的画法与此刻的物件（测每帧耗时用）
    _dbg: { DRAW, P: () => P },
    reset() { P.clear(); FXL.length = 0; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      FXL.length = 0;
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.tx != null ? p.tx : p.x), r2(p.tv != null ? p.tv : p.v), p.ta, r2(p.tfire), r2(p.tlit), r2(p.tgrow), r2(p.truin), r2(p.tk), r2(p.tk2), p.label].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        if (p.kind === 'beacon' && p.fire < 0.3 && p.ruin < 0.3) continue;
        let px = p.x * W.w, py;
        const s = LS(p.layer) * (p.size || 1);
        if (p.kind === 'tabor') { const D = taborDims(p); py = gY(1, p.x) - D.H * 0.7; }
        else if (p.kind === 'kishon') { riverGeom(p); const pt = riverAt(0.55); px = pt[0]; py = pt[1] - 4 * s; }
        else if (p.kind === 'camp' || p.kind === 'fields' || p.kind === 'vineyard') { const xf = (p.x0 + p.x1) / 2; px = xf * W.w; py = gY(p.layer, xf) - 8 * s; }
        else if (p.kind === 'fable') { py = gY(2, p.x) - 20 * s; }
        else {
          const hgt = { oak: 60, tent: 16, altar: 10, city: 18, palm: 44, idol: 26, press: 4, rock: 8, floor: 3, spring: 4, pillar: 18, house: 18, gate: 30, doors: 20, mill: 10, temple: 50, tabernacle: 10, silver: 10, beacon: 6, lion: 10, chariot: 14 }[p.kind] || 10;
          py = baseY(p.layer, p.x, p.v) - hgt * s;
        }
        const d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 10 * s, d };
      }
      return best;
    },
  };

  // 本卷开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0; sorted = []; sortedN = -1;
    S = fresh();
  }

  // ── 几件常用的事 ────────────────────────────────────────────
  // 第 i 处烽火：点着（士师兴起）/ 熄成余烬（士师死了）
  function kindle(i) { prop('bc' + i, null, { fire: 1, ruin: 0 }); }
  function quench(i, keep) { prop('bc' + i, null, { fire: keep || 0, ruin: 1 }); }
  // 烽火旁以光聚成士师的名字（小字，在远山之上）
  function beaconName(b, i) {
    if (b.instant || !fx()) return;
    const str = JUDGES[i], n = Array.from(str).length, xf = BEACON_X[i];
    const size = Math.min(26 * Math.max(0.7, W.unit), (W.w * 0.5) / (n * 1.08));
    const at = nameAt(xf, skyY(gY(0, xf) - 34 * Math.max(0.6, W.unit) - size, size), size, n);
    const bx = xf * W.w, by = gY(0, xf) - 6;
    fx().nameStr(str, at[0], at[1], size, [255, 222, 160], () => [bx + (Math.random() - 0.5) * 16, by + (Math.random() - 0.5) * 8], { hold: 2 });
  }
  // 一队人：身上都带着一样东西（刀、瓶……）
  function troop(gid, o) { crowd(gid, o); if (o.prop) cprop(gid, o.prop); }
  // 碎瓶：火把一亮，瓶的碎片飞溅
  function shatter(b, gid) {
    if (b.instant || !fx()) return;
    for (const m of cmembers(gid)) if (m._h > 0 && isFinite(m._x)) fx().sparkle(m._x + (m.fd || 1) * 0.1 * m._h, m._y - 0.95 * m._h, 7, [255, 206, 140], 6, 'top');
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：约书亚死后，吉甲的营
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 迦南的山地：草木青青，平原开阔
    W.set('bare', 0.12, true); W.set('bloom', 0.55, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 1, herbs: 0.85, trees: 0.35, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      jgOpp: 0, jgStar: 0, jgFlood: 0, jgDew: 0, jgJar: 0, jgTorch: 0, jgReign: 0, jgMercy: 0, jgLament: 0, jgWander: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    // 树多在西边（右）的山上；平原（左）开阔
    W.setOrigin('trees', W.w * 0.995, W.ridgeBaseY(2, W.w * 0.995));
    W.set('trees', 0.35, true);
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 2, lx, ly, true);
    W.setPop('beast', 1, lx, ly, true);
    W.setPop('creeper', 14, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 远山的岭上：十二处尚未点着的烽火
    JUDGES.forEach((nm, i) => prop('bc' + i, 'beacon', { x: BEACON_X[i], layer: 0, label: nm }));
    // 吉甲的帐棚；平原上迦南人的城与铁车；山地的城
    prop('tentA', 'tent', { x: 0.775, size: 0.9, label: '帐棚' });
    prop('tentB', 'tent', { x: 0.845, size: 0.8, label: '帐棚' });
    prop('cityA', 'city', { x: X.cityA, layer: 1, size: 0.9, label: '迦南人的城' });
    prop('cityB', 'city', { x: X.cityB, layer: 1, size: 0.6, label: '山地的城' });
    [[0.415, 0.3], [0.45, 0.62], [0.475, 0.12], [0.505, 0.45], [0.53, 0.8], [0.545, 0.2]].forEach(([x, v], i) =>
      prop('car' + i, 'chariot', { x, v, fd: 1, size: 0.82, label: '铁车', spd: 0.012 }));
    const c = C();
    c.clear({ fade: false });
    crowd('israel', { n: 9, x0: 0.62, x1: 0.84, layer: 2, label: '以色列人', from: 'none' });
    crowd('judah', { n: 7, x0: 0.6, x1: 0.73, layer: 2, label: '犹大人', from: 'none' });
    crowd('simeon', { n: 3, x0: 0.73, x1: 0.78, layer: 2, label: '西缅人', from: 'none' });
    avoid([0.36, 0.58], [0.6, 0.86]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒；情节里补充的经文排在其后。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:2 犹大当先上去；铁车；波金 ─────────────────────────
    {
      kind: 'cmd', utter: '犹大当先上去，我已将那地交在他手中', cmd: 'deploy 犹大 --first  # 那地已交在他手中', ref: '1:2',
      verse: [
        { text: '耶和华说：「犹大当先上去，我已将那地交在他手中。」', ref: '士师记 1:2', hold: 5 },
        { text: '耶和华与犹大同在，犹大就赶出山地的居民，<br>只是不能赶出平原的居民，因为他们有铁车。', ref: '士师记 1:19', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { beamCrowd(b, 'judah', { dur: 5 }); sfx(b, 'crowd'); }],
          [1.2, () => { cwalk('judah', X.hills0, X.hills1, { speed: 0.03 }); cwalk('simeon', 0.8, 0.86, { speed: 0.03 }); }],
          [6.3, b => {
            // 平原上的铁车：冷冷的一排，赶不出去
            for (let i = 0; i < 6; i++) prop('car' + i, null, { tx: getP('car' + i) ? getP('car' + i).x + 0.018 : undefined });
            sfx(b, 'crowd', { far: true, low: true });
            prop('cityB', null, { fire: 0.7 });
          }],
          [10.5, () => { prop('cityB', null, { fire: 0, ruin: 0.35 }); }],
          [12, b => say(b, [{ text: '耶和华的使者从吉甲上到波金，对人说：「……<br>我永不废弃与你们所立的约。……你们竟没有听从我的话！」', ref: '士师记 2:1–2', hold: 6.5 }])],
          [13.4, b => {
            add('angel', { label: '耶和华的使者', angel: true, x: 0.615, facing: 1, glow: 0.9, from: b.instant ? 'none' : 'light' });
            beam(b, 0.615, 2, { dur: 6 });
            cwalk('israel', 0.69, 0.86, { speed: 0.03 });
            sfx(b, 'angel');
          }],
          [15.5, () => { cface('israel', -1); }],
          [20, b => say(b, [{ text: '耶和华的使者向以色列众人说这话的时候，百姓就放声而哭；<br>于是给那地方起名叫波金。众人在那里向耶和华献祭。', ref: '士师记 2:4–5', hold: 6.5 }])],
          [21.9, b => { cpose('israel', 'weep'); sfx(b, 'weep'); }],
          [24.5, b => {
            prop('bochim', 'altar', { x: X.bochim, grow: 1, label: '波金的坛' });
            rm('angel');
            if (!b.instant && fx()) fx().sparkle(0.615 * W.w, gY(2, 0.615) - 40 * LS(2), 30, [255, 240, 210], 20, 'top');
            sfx(b, 'build');
          }],
          [27, b => { prop('bochim', null, { fire: 1 }); cpose('israel', 'kneel'); sfx(b, 'fire'); }],
        ]);
      },
    },

    // ── 2:16 耶和华兴起士师：离弃 → 受欺压 → 哀求 → 士师 → 太平 ─────
    {
      kind: 'act', utter: '耶和华兴起士师', cmd: 'while (true) { 离弃; 受欺压; 哀求; 兴起(士师); 太平; }', ref: '2:16',
      verse: [
        { text: '耶和华兴起士师，士师就拯救他们脱离抢夺他们人的手。', ref: '士师记 2:16', hold: 5 },
        { text: '以色列人行耶和华眼中看为恶的事，<br>忘记耶和华他们的神，去事奉诸巴力和亚舍拉，', ref: '士师记 3:7', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { prop('bochim', null, { fire: 0 }); crm('judah'); crm('simeon'); W.goTo(0.42, 6, b.instant); }],
          // 十二处烽火先后一闪：一轮又一轮
          [0.8, b => { if (!b.instant) for (let i = 0; i < 12; i++) FXL.push({ type: 'blink', t: -i * 0.28, dur: 1.2, i }); sfx(b, 'stars', { soft: true }); }],
          [6.3, b => {
            prop('idol1', 'idol', { x: X.idol1, grow: 1, size: 1.2, label: '亚舍拉' });
            prop('idol2', 'idol', { x: X.idol2, layer: 1, grow: 1, size: 1.4, label: '巴力的坛' });
            prop('idol3', 'idol', { x: X.idol3, grow: 1, size: 1.05, label: '亚舍拉' });
            cpose('israel', 'stand');
            cwalk('israel', 0.77, 0.87, { speed: 0.03, pose: 'bow' });
            sfx(b, 'chime', { soft: true });
          }],
          [9, b => {
            W.set('jgOpp', 1, b.instant); W.set('bare', 0.42, b.instant);
            prop('cushan', 'camp', { x: 0.62, x0: 0.53, x1: 0.72, layer: 1, n: 10, grow: 1, label: '古珊‧利萨田的营' });
            sfx(b, 'crowd', { far: true });
          }],
          [12, b => say(b, [{ text: '以色列人呼求耶和华的时候，耶和华就为他们兴起一位拯救者救他们，就是……俄陀聂。<br>耶和华的灵降在他身上，他就作了以色列的士师，出去争战。', ref: '士师记 3:9–10', hold: 7 }])],
          [13.6, b => { cpose('israel', 'pray'); sfx(b, 'weep', { soft: true }); }],
          [14.6, b => {
            add('othniel', { label: '俄陀聂', x: 0.665, facing: -1, robe: ROBE.othniel, glow: 0.9, from: b.instant ? 'none' : 'light' });
            beamOn(b, 'othniel', { dur: 5 });
            nameOver(b, 'othniel', '俄陀聂');
            kindle(0);
            sfx(b, 'harp');
          }],
          [17.2, b => {
            walk('othniel', 0.6, { speed: 0.03, pose: 'raise' });
            prop('cushan', null, { k: 1 });
            W.set('jgOpp', 0, b.instant); W.set('bare', 0.12, b.instant);
            for (const id of ['idol1', 'idol2', 'idol3']) prop(id, null, { ruin: 1 });
            sfx(b, 'crowd');
          }],
          [19.5, b => { unprop('cushan'); for (const id of ['idol1', 'idol2', 'idol3']) unprop(id); cpose('israel', 'stand'); glow('othniel', 0.35); pose('othniel', 'stand'); sfx(b, 'harp', { soft: true }); }],
          [20, b => say(b, [{ text: '这样，摩押就被以色列人制伏了。国中太平八十年。<br>以笏之后，有亚拿的儿子珊迦……他也救了以色列人。', ref: '士师记 3:30–31', hold: 6.5 }])],
          // 俄陀聂死了；以笏；珊迦
          [21.9, b => { quench(0); rm('othniel'); kindle(1); beaconName(b, 1); }],
          [25, b => { quench(1); kindle(2); beaconName(b, 2); }],
        ]);
      },
    },

    // ── 4:7 底波拉、巴拉；星宿从天上争战；基顺古河；日头出现 ─────
    {
      kind: 'promise', utter: '我必将他交在你手中', cmd: 'await 星宿.争战(西西拉) && flush 基顺河', ref: '4:7',
      verse: [
        { text: '有一位女先知名叫底波拉，是拉比多的妻，当时作以色列的士师。<br>她住在……底波拉的棕树下。以色列人都上她那里去听判断。', ref: '士师记 4:4–5', hold: 6.5 },
        { text: '「我必使耶宾的将军西西拉率领他的车辆和全军往基顺河，到你那里去；<br>我必将他交在你手中。」', ref: '士师记 4:7', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            quench(2); unprop('tentA'); unprop('tentB'); unprop('bochim');
            W.set('jgOpp', 0.45, b.instant);
            prop('palm', 'palm', { x: X.palm, grow: 1, label: '底波拉的棕树' });
          }],
          [0.6, b => {
            add('deborah', { label: '底波拉', sex: 'f', x: X.palm - 0.022, facing: 1, pose: 'sit', robe: ROBE.deborah, glow: 0.8, from: b.instant ? 'none' : 'light' });
            cwalk('israel', 0.7, 0.82, { speed: 0.03, pose: 'sit' });
            beamOn(b, 'deborah', { dur: 5 });
            nameOver(b, 'deborah', '底波拉', { lift: 90 });
            kindle(3);
            sfx(b, 'harp');
            avoid([0.36, 0.58], [0.62, 0.86]);
          }],
          [7.8, b => {
            add('barak', { label: '巴拉', x: 1.06, facing: -1, robe: ROBE.barak, glow: 0.4 });
            walk('barak', X.palm + 0.03, { speed: 0.05 });
            pose('deborah', 'stand');
            prop('tabor', 'tabor', { x: X.tabor, layer: 1, grow: 1, label: '他泊山' });
            prop('kishon', 'kishon', { x: 0.48, grow: 1, label: '基顺河' });
            sfx(b, 'wind', { soft: true });
          }],
          [10.2, b => { face('deborah', 1); pose('deborah', 'point'); face('barak', 1); crowd('army', { n: 12, x0: 1.02, x1: 1.16, layer: 2, label: '一万人', robe: [112, 92, 72] }); cwalk('army', 0.8, 0.98, { speed: 0.05 }); crm('israel'); sfx(b, 'crowd'); }],
          [12, () => { walk('barak', 0.8, { speed: 0.04 }); walk('deborah', 0.775, { speed: 0.03 }); for (let i = 0; i < 6; i++) { const p = getP('car' + i); if (p) prop('car' + i, null, { tx: p.x + 0.012, tv: Math.min(0.85, p.v + 0.08) }); } }],
          [13, b => say(b, [{ text: '星宿从天上争战，从其轨道攻击西西拉。<br>基顺古河把敌人冲没；我的灵啊，应当努力前行。', ref: '士师记 5:20–21', hold: 6.5 }])],
          [14.6, b => { W.goTo(0.9, 3, b.instant); pose('deborah', 'raise'); }],
          [15.4, b => {
            W.set('jgStar', 1, b.instant);
            cwalk('army', 0.58, 0.74, { speed: 0.08, run: true });
            if (C().run) walk('barak', 0.6, { speed: 0.08, run: true });
            sfx(b, 'stars'); sfx(b, 'crowd');
            avoid([0.36, 0.8]);
          }],
          [18.6, b => {
            W.set('jgStar', 0, b.instant);
            W.set('rain', 0.85, b.instant); W.set('storm', 0.62, b.instant);
            W.set('jgFlood', 1, b.instant);
            if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.46, near: true });
            sfx(b, 'thunder');
          }],
          [19.8, b => {
            for (let i = 0; i < 6; i++) prop('car' + i, null, { tx: X.kishonM + 0.01 + i * 0.006, tv: 0.95, k: 1, spd: 0.03, show: false });
            sfx(b, 'splash', { size: 3 });
          }],
          [21, b => say(b, [{ text: '耶和华啊，愿你的仇敌都这样灭亡！<br>愿爱你的人如日头出现，光辉烈烈！这样，国中太平四十年。', ref: '士师记 5:31', hold: 6.5 }])],
          [22.4, b => {
            W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('jgFlood', 0.2, b.instant); W.set('jgOpp', 0, b.instant);
            W.goTo(0.29, 4.5, b.instant);
            for (let i = 0; i < 6; i++) unprop('car' + i);
          }],
          [25.5, b => { flash(b, { type: 'flare', dur: 5 }); cpose('army', 'raise'); pose('barak', 'raise'); sfx(b, 'harp'); }],
          [28.5, () => { cpose('army', 'stand'); pose('barak', 'stand'); pose('deborah', 'stand'); }],
        ]);
      },
    },

    // ── 6:12 大能的勇士啊；火从磐石中出来；耶和华沙龙 ───────────
    {
      kind: 'call', utter: '大能的勇士啊，耶和华与你同在', cmd: 'sudo useradd 基甸 --role 大能的勇士', ref: '6:12',
      verse: [
        { text: '以色列人又行耶和华眼中看为恶的事，<br>耶和华就把他们交在米甸人手里七年。', ref: '士师记 6:1', hold: 5 },
        { text: '约阿施的儿子基甸正在酒榨那里打麦子，为要防备米甸人。<br>耶和华的使者向基甸显现，对他说：「大能的勇士啊，耶和华与你同在！」', ref: '士师记 6:11–12', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            quench(3); rm('deborah'); rm('barak'); crm('army'); unprop('palm'); unprop('tabor'); unprop('kishon');
            W.goTo(0.4, 5, b.instant); W.set('jgFlood', 0, b.instant);
          }],
          [0.8, b => {
            W.set('jgOpp', 0.85, b.instant); W.set('bare', 0.62, b.instant); W.set('bloom', 0.2, b.instant);
            prop('camp', 'camp', { x: 0.72, x0: 0.535, x1: 0.885, layer: 1, n: 58, grow: 1, label: '米甸营' });
            sfx(b, 'camel'); sfx(b, 'crowd', { far: true });
            avoid([0.62, 0.86]);
          }],
          [6.3, b => {
            prop('oakO', 'oak', { x: X.oak, grow: 1, label: '约阿施的橡树' });
            prop('press', 'press', { x: X.press, k: 1, label: '酒榨' });
            add('gideon', { label: '基甸', x: X.press, facing: 1, pose: 'bow', robe: ROBE.gideon, glow: 0.3 });
          }],
          [7.6, b => { add('angel', { label: '耶和华的使者', angel: true, x: X.oak - 0.012, facing: -1, pose: 'sit', glow: 0.9, from: b.instant ? 'none' : 'light' }); sfx(b, 'angel'); }],
          [10.2, b => {
            pose('angel', 'stand'); pose('gideon', 'stand'); face('gideon', 1);
            beamOn(b, 'gideon', { dur: 5 });
            nameOver(b, 'gideon', '基甸');
            glow('gideon', 0.7);
            prop('press', null, { k: 0 });
            kindle(4);
          }],
          [14.2, b => say(b, [{ text: '耶和华的使者伸出手内的杖，杖头挨了肉和无酵饼，<br>就有火从磐石中出来，烧尽了肉和无酵饼。耶和华的使者也就不见了。', ref: '士师记 6:21', hold: 6.5 }])],
          [14.8, () => {
            prop('rockG', 'rock', { x: X.rock, k2: 1, label: '磐石' });
            walk('gideon', X.rock - 0.028, { speed: 0.025, pose: 'kneel' });
            walk('angel', X.rock + 0.028, { speed: 0.02 });
            hold('angel', 'staff');
          }],
          [17.6, b => { face('angel', -1); pose('angel', 'point'); }],
          [18.4, b => {
            prop('rockG', null, { fire: 1, k2: 0 });
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.25); if (fx()) fx().sparkle(X.rock * W.w, gY(2, X.rock) - 12 * LS(2), 40, [255, 210, 140], 12, 'near'); }
            sfx(b, 'fire');
          }],
          [20, b => { rm('angel'); if (!b.instant && fx()) fx().sparkle((X.rock + 0.028) * W.w, gY(2, X.rock + 0.028) - 40 * LS(2), 30, [255, 240, 210], 20, 'top'); pose('gideon', 'fall'); }],
          [22, b => say(b, [{ text: '于是基甸在那里为耶和华筑了一座坛，起名叫「耶和华沙龙」。', ref: '士师记 6:24', hold: 5 }])],
          [22.8, () => { prop('rockG', null, { fire: 0 }); }],
          [23.6, b => {
            unprop('rockG');
            prop('altarG', 'altar', { x: X.rock, grow: 1, label: '耶和华沙龙' });
            pose('gideon', 'pray');
            if (!b.instant && fx()) {
              const n = 5, size = Math.min(30 * Math.max(0.7, W.unit), (W.w * 0.6) / (n * 1.08));
              const at = nameAt(X.rock, skyY(gY(2, X.rock) - 110 * LS(2) - size, size), size, n);
              fx().nameStr('耶和华沙龙', at[0], at[1], size, [255, 232, 180], () => [X.rock * W.w + (Math.random() - 0.5) * 30, gY(2, X.rock) - 10], { hold: 2.4 });
            }
            sfx(b, 'build');
          }],
          [26.5, b => { prop('altarG', null, { fire: 0.7 }); sfx(b, 'fire', { soft: true }); }],
        ]);
      },
    },

    // ── 6:40 羊毛：头一夜湿，第二夜干 ─────────────────────────
    {
      kind: 'act', utter: '这夜神也如此行', cmd: 'test 羊毛 --dew && test 羊毛 --dry  # 再试一次', ref: '6:40',
      verse: [
        { text: '那时，米甸人、亚玛力人，和东方人都聚集过河，在耶斯列平原安营。<br>耶和华的灵降在基甸身上，他就吹角；亚比以谢族都聚集跟随他。', ref: '士师记 6:33–34', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, () => { prop('altarG', null, { fire: 0 }); pose('gideon', 'stand'); }],
          [1, b => { beamOn(b, 'gideon', { dur: 5 }); glow('gideon', 0.95); pose('gideon', 'raise'); sfx(b, 'horn'); }],
          [3, b => {
            // 聚集跟随的人（一大群；其中有胆怯的、跪下喝水的、用手捧着舔水的）
            crowd('many', { n: 10, x0: 1.03, x1: 1.2, layer: 2, label: '跟随基甸的人' });
            crowd('kneel', { n: 7, x0: 1.04, x1: 1.16, layer: 2, label: '跟随基甸的人' });
            crowd('three', { n: 5, x0: 1.02, x1: 1.12, layer: 2, label: '三百人' });
            cwalk('many', 0.84, 0.995, { speed: 0.045 }); cwalk('kneel', 0.74, 0.9, { speed: 0.045 }); cwalk('three', 0.7, 0.84, { speed: 0.045 });
            sfx(b, 'crowd');
          }],
          [5.5, b => { pose('gideon', 'stand'); glow('gideon', 0.6); W.goTo(0.02, 5, b.instant); }],
          [6.5, () => { prop('floor', 'floor', { x: X.floor, size: 1.45, label: '禾场上的羊毛' }); walk('gideon', X.floor - 0.03, { speed: 0.02, pose: 'pray' }); avoid([0.52, 1]); }],
          [7.5, b => say(b, [{ text: '我就把一团羊毛放在禾场上：若单是羊毛上有露水，别的地方都是干的，<br>我就知道你必照着所说的话，藉我手拯救以色列人。', ref: '士师记 6:37', hold: 7 }])],
          [11.5, b => { W.goTo(0.27, 4, b.instant); }],
          [14.2, b => { prop('floor', null, { k: 1 }); sfx(b, 'stars', { soft: true }); }],
          [15, b => say(b, [{ text: '次日早晨基甸起来，见果然是这样；<br>将羊毛挤一挤，从羊毛中拧出满盆的露水来。', ref: '士师记 6:38', hold: 5.5 }])],
          [16.8, b => { pose('gideon', 'bow'); prop('floor', null, { k2: 1 }); sfx(b, 'splash', { soft: true }); }],
          [19.6, b => { pose('gideon', 'pray'); W.goTo(0.02, 3, b.instant); }],
          [22, b => say(b, [{ text: '这夜神也如此行：独羊毛上是干的，别的地方都有露水。', ref: '士师记 6:40', hold: 5.5 }])],
          [22.6, b => { W.goTo(0.27, 3.5, b.instant); prop('floor', null, { k: 0, k2: 0 }); }],
          [24.4, b => { W.set('jgDew', 1, b.instant); sfx(b, 'stars'); }],
          [27, () => { pose('gideon', 'kneel'); }],
        ]);
      },
    },

    // ── 7:7 舔水的三百人 ──────────────────────────────────────
    {
      kind: 'promise', utter: '我要用这舔水的三百人拯救你们', cmd: 'filter --lapping | head -300', ref: '7:7',
      verse: [
        { text: '耶和华对基甸说：「跟随你的人过多，我不能将米甸人交在他们手中，<br>免得以色列人向我夸大，说：『是我们自己的手救了我们。』」', ref: '士师记 7:2', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.4, 6, b.instant); W.set('jgDew', 0, b.instant);
            unprop('floor');
            prop('harod', 'spring', { x: X.harod, grow: 1, label: '哈律泉' });
            pose('gideon', 'stand');
            walk('gideon', X.harod + 0.05, { speed: 0.025 });
            avoid([0.54, 1]);
          }],
          [2.5, () => { for (const g of ['many', 'kneel', 'three']) cface(g, -1); }],
          [7.5, b => say(b, [{ text: '……于是有二万二千人回去，只剩下一万。', ref: '士师记 7:3', hold: 4.5 }])],
          [8.6, b => { cwalk('many', 1.06, 1.25, { speed: 0.035 }); sfx(b, 'crowd', { soft: true }); }],
          [13, b => say(b, [{ text: '于是用手捧着舔水的有三百人，其余的都跪下喝水。', ref: '士师记 7:6', hold: 5 }])],
          [13.4, () => {
            crm('many');
            cwalk('kneel', X.harod - 0.05, X.harod + 0.04, { speed: 0.05, pose: 'kneel' });
            cwalk('three', X.harod + 0.05, X.harod + 0.11, { speed: 0.05, pose: 'bow' });
          }],
          [19, b => say(b, [{ text: '耶和华对基甸说：「我要用这舔水的三百人拯救你们，<br>将米甸人交在你手中……」', ref: '士师记 7:7', hold: 6 }])],
          [20.6, b => { cpose('three', 'stand'); beamCrowd(b, 'three', { dur: 5, w: 110 }); sfx(b, 'harp'); }],
          [22.5, b => { cpose('kneel', 'stand'); cwalk('kneel', 1.05, 1.2, { speed: 0.04 }); face('gideon', 1); }],
          [27.5, () => { crm('kneel'); }],
        ]);
      },
    },

    // ── 7:9 起来，下到营里去：瓶子打破，火把亮在营的四围（签名之景）──
    {
      kind: 'cmd', utter: '起来，下到营里去', cmd: 'break 瓶子 && light 火把 --around 营  # 耶和华和基甸的刀', ref: '7:9',
      verse: [
        { text: '当那夜，耶和华吩咐基甸说：<br>「起来，下到营里去，因我已将他们交在你手中。」', ref: '士师记 7:9', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.035, 5.5, b.instant);
            unprop('harod'); unprop('press'); unprop('oakO'); unprop('altarG');
            W.set('jgOpp', 0.5, b.instant);
            avoid([0.48, 0.8]);
          }],
          [1, b => {
            crowd('midian', { n: 12, x0: 0.58, x1: 0.92, layer: 1, label: '米甸人', robe: ROBE.midian, pose: 'lie' });
            herd('camels', { kind: 'camel', n: 4, x0: 0.62, x1: 0.9, layer: 1, label: '骆驼', pose: 'lie' });
          }],
          [1.6, () => { walk('gideon', 0.505, { speed: 0.03, pose: 'kneel' }); }],
          [5.2, () => { walk('gideon', 0.6, { speed: 0.03, pose: 'bow' }); }],
          [6.4, b => say(b, [{ text: '于是基甸将三百人分作三队，<br>把角和空瓶交在各人手里（瓶内都藏着火把），', ref: '士师记 7:16', hold: 6 }])],
          [7.4, b => {
            crm('three');
            troop('co1', { n: 6, x0: 0.63, x1: 0.8, layer: 2, label: '三百人', prop: 'jar' });
            cwalk('co1', 0.53, 0.76, { speed: 0.03 });
            troop('co2', { n: 4, x0: 0.51, x1: 0.555, layer: 1, label: '三百人', prop: 'jar' });
            troop('co3', { n: 4, x0: 0.888, x1: 0.93, layer: 1, label: '三百人', prop: 'jar' });
            W.set('jgJar', 1, b.instant);
            hold('gideon', 'jar');
            pose('gideon', 'stand');
            walk('gideon', 0.6, { speed: 0.02 });
          }],
          [11, () => { for (const g of ['co1', 'co2', 'co3']) cface(g, 0.74); }],
          [13.4, b => say(b, [{ text: '三队的人就都吹角，打破瓶子，左手拿着火把，右手拿着角，<br>喊叫说：「耶和华和基甸的刀！」', ref: '士师记 7:20', hold: 6.5 }])],
          [13.9, b => { sfx(b, 'horn'); }],
          [14.4, b => {
            cprop('co1', 'torch'); hold('gideon', 'torch'); shatter(b, 'co1');
            W.set('jgTorch', 1, b.instant);
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.12);
            sfx(b, 'fire'); sfx(b, 'horn');
          }],
          [15, b => { cprop('co2', 'torch'); shatter(b, 'co2'); cpose('co1', 'raise'); pose('gideon', 'raise'); }],
          [15.5, b => { cprop('co3', 'torch'); shatter(b, 'co3'); cpose('co2', 'raise'); cpose('co3', 'raise'); sfx(b, 'crowd'); sfx(b, 'horn'); }],
          [16.2, b => {
            if (b.instant || !fx()) return;
            const str = '耶和华和基甸的刀', n = 8, size = Math.min(44 * Math.max(0.7, W.unit), (W.w * 0.86) / (n * 1.08));
            const at = nameAt(0.74, Math.min(W.horizonY - 0.12 * W.h, W.h * 0.42), size, n);
            const pts = RING.map(r => [r.xf * W.w, baseY(r.l, r.xf, r.v) - 18 * Math.max(0.3, LS(r.l))]);
            fx().nameStr(str, at[0], at[1], size, [255, 214, 140], () => U.pick(pts), { hold: 3.2 });
          }],
          [18, b => {
            prop('camp', null, { k: 1 });
            cpose('midian', 'stand');
            cwalk('midian', 0.5, 0.56, { speed: 0.09, run: true });
            cwalk('camels', 0.5, 0.56, { speed: 0.06, run: true });
            sfx(b, 'crowd'); sfx(b, 'camel');
          }],
          [21.2, b => { crm('midian'); crm('camels'); }],
          [21.8, b => say(b, [{ text: '他们在营的四围各站各的地方；<br>全营的人都乱窜。三百人呐喊，使他们逃跑。', ref: '士师记 7:21', hold: 6 }])],
          [23, () => { cpose('co1', 'stand'); cpose('co2', 'stand'); cpose('co3', 'stand'); pose('gideon', 'stand'); }],
        ]);
      },
    },

    // ── 8:23 惟有耶和华管理你们；示剑；荆棘里出来的火 ─────────────
    {
      kind: 'act', utter: '惟有耶和华管理你们', cmd: 'chown -R 耶和华 以色列  # 我不管理你们', ref: '8:23',
      verse: [
        { text: '以色列人对基甸说：「……愿你和你的儿孙管理我们。」<br>基甸说：「我不管理你们，我的儿子也不管理你们，惟有耶和华管理你们。」', ref: '士师记 8:22–23', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.36, 6, b.instant);
            W.set('jgTorch', 0, b.instant); W.set('jgJar', 0, b.instant); W.set('jgOpp', 0, b.instant);
            W.set('bare', 0.14, b.instant); W.set('bloom', 0.6, b.instant);
            crm('co1'); crm('co2'); crm('co3'); unprop('camp');
            hold('gideon', null); pose('gideon', 'stand');
          }],
          [1.2, b => {
            crowd('israel', { n: 11, x0: 0.7, x1: 0.9, layer: 2, label: '以色列人' });
            walk('gideon', 0.645, { speed: 0.03 });
            avoid([0.58, 0.92]);
          }],
          [3, () => { face('gideon', 1); cpose('israel', 'bow'); cface('israel', -1); }],
          [4.6, b => { pose('gideon', 'raise'); W.set('jgReign', 1, b.instant); sfx(b, 'angel'); }],
          [8, b => say(b, [{ text: '这样，米甸人被以色列人制伏了，不敢再抬头。<br>基甸还在的日子，国中太平四十年。', ref: '士师记 8:28', hold: 5.5 }])],
          [9.4, b => { cpose('israel', 'stand'); pose('gideon', 'stand'); W.set('bloom', 0.85, b.instant); }],
          [11.5, b => { W.set('jgReign', 0, b.instant); setAge('gideon', 'elder'); hold('gideon', 'staff'); }],
          [13.4, b => { rm('gideon'); quench(4); crm('israel'); sfx(b, 'weep', { soft: true }); }],
          [15, b => say(b, [{ text: '示剑人和米罗人都一同聚集，往示剑橡树旁的柱子那里，立亚比米勒为王。', ref: '士师记 9:6', hold: 5.5 }])],
          [15.5, b => {
            prop('shechem', 'city', { x: 0.64, layer: 1, size: 0.75, label: '示剑' });
            prop('oakS', 'oak', { x: X.oakS, size: 0.85, grow: 1, label: '示剑的橡树' });
            prop('pillar', 'pillar', { x: X.pillar, grow: 1, label: '柱子' });
            add('abimelech', { label: '亚比米勒', x: X.pillar + 0.02, facing: 1, robe: ROBE.abimelech, glow: 0 });
            crowd('shechem', { n: 9, x0: 0.66, x1: 0.8, layer: 2, label: '示剑人' });
            avoid([0.55, 1]);
          }],
          [17.5, () => { cpose('shechem', 'bow'); cface('shechem', -1); }],
          [19, b => {
            add('jotham', { label: '约坦', x: X.jotham, facing: -1, robe: ROBE.jotham, glow: 0.3 });
            prop('fable', 'fable', { x: X.olive, grow: 1, label: '荆棘' });
          }],
          [21, b => say(b, [{ text: '众树对荆棘说：「请你来作我们的王。」<br>荆棘回答说：「……不然，愿火从荆棘里出来，烧灭黎巴嫩的香柏树。」', ref: '士师记 9:14–15', hold: 6.5 }])],
          [21.6, b => { pose('jotham', 'raise'); flash(b, { type: 'plant', k: 'olive', dur: 1.3 }); }],
          [22.6, b => { flash(b, { type: 'plant', k: 'fig', dur: 1.3 }); }],
          [23.6, b => { flash(b, { type: 'plant', k: 'vine', dur: 1.3 }); }],
          [24.6, b => { flash(b, { type: 'plant', k: 'bramble', dur: 1.6 }); }],
          [25.6, b => { prop('fable', null, { fire: 1 }); flash(b, { type: 'fireline', x0: X.bramble - 0.02, x1: X.oakS, dur: 3 }); sfx(b, 'fire'); pose('jotham', 'stand'); }],
          [27, () => { walk('jotham', 1.08, { speed: 0.06, run: true }); }],
          [28.4, b => { prop('shechem', null, { fire: 0.9, k: 0.8, ruin: 0.5 }); prop('fable', null, { fire: 0 }); cwalk('shechem', 0.9, 1.1, { speed: 0.05 }); sfx(b, 'fire'); }],
          [29.2, () => { rm('abimelech'); rm('jotham'); }],
        ]);
      },
    },

    // ── 10:16 耶和华心中担忧；耶弗他与他的女儿 ─────────────────
    {
      kind: 'act', utter: '耶和华因以色列人受的苦难，就心中担忧', cmd: 'echo "担忧" >> /dev/heart  # 心中', ref: '10:16',
      verse: [
        { text: '以色列人就除掉他们中间的外邦神，事奉耶和华。<br>耶和华因以色列人受的苦难，就心中担忧。', ref: '士师记 10:16', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            crm('shechem'); unprop('fable'); unprop('oakS'); unprop('pillar'); prop('shechem', null, { fire: 0, k: 0.2 });
            W.goTo(0.42, 5, b.instant);
            crowd('israel', { n: 10, x0: 0.62, x1: 0.84, layer: 2, label: '以色列人' });
            prop('idol4', 'idol', { x: 0.73, grow: 1, label: '外邦神' });
            prop('idol5', 'idol', { x: 0.68, layer: 1, grow: 1, label: '外邦神' });
            avoid([0.58, 0.9]);
          }],
          [1.6, b => { cpose('israel', 'kneel'); prop('idol4', null, { ruin: 1 }); prop('idol5', null, { ruin: 1 }); sfx(b, 'gate', { soft: true }); }],
          [2.2, b => { W.set('jgMercy', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [5, b => say(b, [{ text: '耶和华的灵降在耶弗他身上……耶弗他就向耶和华许愿，说：<br>「……先从我家门出来迎接我，就必归你，我也必将他献上为燔祭。」', ref: '士师记 11:29–31', hold: 7 }])],
          [5.4, b => { unprop('idol4'); unprop('idol5'); unprop('shechem'); kindle(5); kindle(6); beaconName(b, 5); }],
          [6.6, b => {
            prop('mizpah', 'house', { x: 0.86, grow: 1, label: '耶弗他的家' });
            add('jephthah', { label: '耶弗他', x: 0.8, facing: -1, robe: ROBE.jephthah, glow: 0.8 });
            beamOn(b, 'jephthah', { dur: 5 });
            nameOver(b, 'jephthah', '耶弗他');
            cpose('israel', 'stand');
            W.set('jgMercy', 0.35, b.instant);
          }],
          [7.8, b => { quench(5); quench(6); beaconName(b, 6); kindle(7); }],
          [9, b => { pose('jephthah', 'raise'); sfx(b, 'seal'); }],
          [11, b => {
            prop('ammon', 'camp', { x: 0.58, x0: 0.53, x1: 0.66, layer: 1, n: 10, grow: 1, label: '亚扪人的营' });
            pose('jephthah', 'stand');
            walk('jephthah', 0.6, { speed: 0.05 });
            cwalk('israel', 0.55, 0.7, { speed: 0.05 });
            W.set('jgMercy', 0, b.instant);
          }],
          [13.6, b => { prop('ammon', null, { k: 1 }); sfx(b, 'crowd'); }],
          [15, b => say(b, [{ text: '耶弗他回米斯巴到了自己的家，不料，他女儿拿着鼓跳舞出来迎接他，<br>是他独生的，此外无儿无女。', ref: '士师记 11:34', hold: 6 }])],
          [15.4, () => { unprop('ammon'); walk('jephthah', 0.77, { speed: 0.045 }); cwalk('israel', 0.62, 0.72, { speed: 0.045 }); }],
          [16.2, b => { add('daughter', { label: '耶弗他的女儿', sex: 'f', age: 'adult', hair: 'long', x: 0.86, facing: -1, robe: ROBE.daughter, glow: 0.45 }); walk('daughter', 0.81, { speed: 0.03, pose: 'raise' }); sfx(b, 'chime'); }],
          [18.6, b => { pose('daughter', 'stand'); sfx(b, 'chime', { soft: true }); }],
          [19.2, b => { pose('daughter', 'raise'); sfx(b, 'chime', { soft: true }); }],
          [19.8, () => { pose('daughter', 'stand'); }],
          [20.4, b => { pose('daughter', 'raise'); face('jephthah', 1); }],
          [21.2, b => { pose('jephthah', 'weep', { weep: true }); pose('daughter', 'stand'); sfx(b, 'weep'); }],
          [22, b => say(b, [{ text: '此后以色列中有个规矩，每年以色列的女子去为基列人耶弗他的女儿哀哭四天。……<br>耶弗他作以色列的士师六年。', ref: '士师记 11:40–12:7', hold: 6.5 }])],
          [22.6, b => {
            W.goTo(0.78, 4, b.instant);
            rm('daughter');
            crowd('maids', { n: 4, x0: 0.83, x1: 0.92, layer: 1, label: '以色列的女子', robe: ROBE.daughter, pose: 'weep' });
            W.set('jgLament', 1, b.instant);
            crm('israel');
          }],
          [25.8, b => { quench(7); rm('jephthah'); kindle(8); kindle(9); kindle(10); }],
          [27.6, () => { quench(8); quench(9); quench(10); }],
        ]);
      },
    },

    // ── 13:5 不可用剃头刀剃他的头：参孙生；狮子 ──────────────────
    {
      kind: 'cmd', utter: '不可用剃头刀剃他的头', cmd: 'chmod -w 头发  # 拿细耳人，一出胎就归神', ref: '13:5',
      verse: [
        { text: '耶和华的使者向那妇人显现，对她说：「……你必怀孕生一个儿子，<br>不可用剃头刀剃他的头，因为这孩子一出胎就归神作拿细耳人。」', ref: '士师记 13:3–5', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.42, 5, b.instant);
            W.set('jgLament', 0, b.instant); crm('maids'); unprop('mizpah');
            W.set('jgOpp', 0.45, b.instant);
            prop('timnah', 'city', { x: 0.64, layer: 1, size: 0.7, label: '亭拿' });
            avoid([0.39, 0.86]);
          }],
          [0.4, b => {
            add('wife', { label: '玛挪亚的妻', sex: 'f', x: 0.665, facing: 1, pose: 'sit', robe: ROBE.wife, glow: 0.3 });
            add('angel', { label: '耶和华的使者', angel: true, x: 0.71, facing: -1, glow: 0.9, from: b.instant ? 'none' : 'light' });
            beam(b, 0.71, 2, { dur: 5 });
            sfx(b, 'angel');
          }],
          [3.6, () => { pose('wife', 'kneel'); }],
          [6.2, b => say(b, [{ text: '见火焰从坛上往上升，耶和华的使者在坛上的火焰中也升上去了。<br>玛挪亚和他的妻看见，就俯伏于地。', ref: '士师记 13:20', hold: 6.5 }])],
          [7.4, () => {
            add('manoah', { label: '玛挪亚', x: 1.05, facing: -1, robe: ROBE.manoah, glow: 0.3 });
            walk('manoah', 0.69, { speed: 0.07 });
            pose('wife', 'stand');
            prop('rockM', 'rock', { x: X.rockM, k2: 1, label: '磐石' });
            walk('angel', X.rockM + 0.004, { speed: 0.03 });
          }],
          [10.4, b => { prop('rockM', null, { fire: 1, k2: 0 }); face('manoah', 1); face('wife', 1); sfx(b, 'fire'); }],
          [11.4, b => {
            prop('rockM', null, { fire: 1.7 });
            flash(b, { type: 'column', xf: X.rockM, dur: 5 });
            if (C().fly) U.safe('cast.fly', () => C().fly('angel', X.rockM, 0.1, { dur: 3.6 }));
            sfx(b, 'angel');
          }],
          [14.2, b => { rm('angel'); pose('manoah', 'fall'); pose('wife', 'fall'); }],
          [14.8, () => { prop('rockM', null, { fire: 0 }); }],
          [14.2, b => say(b, [{ text: '后来妇人生了一个儿子，给他起名叫参孙。孩子长大，耶和华赐福与他。', ref: '士师记 13:24', hold: 5 }])],
          [15.8, b => { pose('wife', 'stand'); babe('wife', 'baby'); pose('manoah', 'stand'); beamOn(b, 'wife', { dur: 3.5, w: 50 }); sfx(b, 'harp', { soft: true }); }],
          [18, b => {
            babe('wife', null);
            add('samson', { label: '参孙', x: 0.72, facing: -1, robe: ROBE.samson, glow: 0.6, hair: 'long', beard: true, from: b.instant ? 'none' : 'light' });
            beamOn(b, 'samson', { dur: 4 });
            nameOver(b, 'samson', '参孙');
            kindle(11);
          }],
          [20.4, b => {
            unprop('rockM');
            prop('vineyard', 'vineyard', { x: 0.53, x0: 0.44, x1: 0.62, grow: 1, label: '亭拿的葡萄园' });
            walk('samson', 0.585, { speed: 0.035 });
            walk('manoah', 0.66, { speed: 0.03 }); walk('wife', 0.685, { speed: 0.03 });
          }],
          [21, b => say(b, [{ text: '……见有一只少壮狮子向他吼叫。耶和华的灵大大感动参孙，<br>他虽然手无器械，却将狮子撕裂，如同撕裂山羊羔一样。', ref: '士师记 14:5–6', hold: 6.5 }])],
          [22.6, b => { prop('lion', 'lion', { x: 0.47, v: 0.2, fd: 1, label: '少壮狮子' }); sfx(b, 'thunder', { soft: true, far: true, low: true }); }],
          [24.2, b => { prop('lion', null, { tx: 0.555, spd: 0.07 }); face('samson', -1); }],
          [25.4, b => { beamOn(b, 'samson', { dur: 3 }); glow('samson', 1); pose('samson', 'wrestle'); if (!b.instant) W.shake = Math.max(W.shake || 0, 0.25); }],
          [26.6, () => { prop('lion', null, { k: 1 }); pose('samson', 'stand'); glow('samson', 0.6); }],
          [28.6, () => { prop('lion', null, { k2: 1 }); }],
        ]);
      },
    },

    // ── 15:19 神就使利希的洼处裂开：狐狸的火、新绳、泉、迦萨的城门 ─────
    {
      kind: 'act', utter: '神就使利希的洼处裂开', cmd: 'exec 泉 --from 利希的洼处  # 隐‧哈歌利', ref: '15:19',
      verse: [
        { text: '参孙去捉了三百只狐狸……将火把捆在两条尾巴中间，<br>点着火把，就放狐狸进入非利士人站着的禾稼……尽都烧了。', ref: '士师记 15:4–5', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.7, 5, b.instant);
            rm('manoah'); rm('wife'); unprop('vineyard'); unprop('lion');
            prop('fieldN', 'fields', { x: 0.48, x0: 0.4, x1: 0.575, layer: 2, grow: 1, rk: 0.42, label: '非利士人的禾稼' });
            prop('fieldM', 'fields', { x: 0.6, x0: 0.5, x1: 0.74, layer: 1, grow: 1, rk: 0.4, label: '非利士人的禾稼' });
            walk('samson', 0.61, { speed: 0.03 });
            avoid([0.39, 0.8]);
          }],
          [1.8, b => { prop('fieldN', null, { k: 1 }); pose('samson', 'point'); face('samson', -1); sfx(b, 'fire'); }],
          [3.2, b => { prop('fieldM', null, { k: 1 }); sfx(b, 'fire'); }],
          [6.4, b => say(b, [{ text: '耶和华的灵大大感动参孙，他臂上的绳就像火烧的麻一样，<br>他的绑绳都从他手上脱落下来。', ref: '士师记 15:14', hold: 5.5 }])],
          [7.4, b => {
            pose('samson', 'stand');
            crowd('judah2', { n: 4, x0: 0.7, x1: 0.78, layer: 2, label: '犹大人' });
            crowd('phil', { n: 7, x0: 0.43, x1: 0.5, layer: 2, label: '非利士人', robe: ROBE.phil });
            cwalk('phil', 0.51, 0.58, { speed: 0.035 });
            sfx(b, 'crowd');
          }],
          [10.6, b => {
            beamOn(b, 'samson', { dur: 3 }); flash(b, { type: 'ropes', dur: 1.8 });
            glow('samson', 1); pose('samson', 'raise');
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.2);
            sfx(b, 'fire');
          }],
          [11.6, b => { cwalk('phil', 0.42, 0.47, { speed: 0.08, run: true }); crm('judah2'); }],
          [13.4, b => say(b, [{ text: '参孙甚觉口渴，就求告耶和华……<br>神就使利希的洼处裂开，有水从其中涌出来。参孙喝了，精神复原；', ref: '士师记 15:18–19', hold: 6.5 }])],
          [13.6, () => { crm('phil'); pose('samson', 'stand'); glow('samson', 0.6); }],
          [14.6, () => { walk('samson', X.lehi - 0.03, { speed: 0.03, pose: 'pray' }); }],
          [17.2, b => { prop('lehi', 'spring', { x: X.lehi, grow: 1, k: 1, label: '隐‧哈歌利' }); if (!b.instant) W.shake = Math.max(W.shake || 0, 0.18); sfx(b, 'splash', { size: 2 }); }],
          [18.6, () => { pose('samson', 'bow'); }],
          [19.4, b => { W.goTo(0.02, 3.5, b.instant); prop('lehi', null, { k: 0.35 }); }],
          [20.2, b => { prop('gaza', 'gate', { x: X.gate, label: '迦萨的城门' }); pose('samson', 'stand'); walk('samson', X.gate + 0.004, { speed: 0.05 }); avoid([0.45, 0.62], [0.84, 1]); }],
          [21.4, b => say(b, [{ text: '参孙睡到半夜，起来，将城门的门扇、门框、门闩，一齐拆下来，<br>扛在肩上，扛到希伯仑前的山顶上。', ref: '士师记 16:3', hold: 6 }])],
          [23.8, b => { prop('gaza', null, { k: 1 }); S.gates = 1; if (!b.instant) W.shake = Math.max(W.shake || 0, 0.2); sfx(b, 'gate'); }],
          [24.4, () => { walk('samson', X.hilltop - 0.02, { speed: 0.068 }); }],
          [29.6, b => { S.gates = 0; prop('doorsH', 'doors', { x: X.hilltop + 0.02, label: '城门' }); face('samson', -1); sfx(b, 'gate', { soft: true }); }],
        ]);
      },
    },

    // ── 13:5 他必起首拯救以色列人：大利拉；推磨；两根柱子 ─────────
    {
      kind: 'promise', utter: '他必起首拯救以色列人', cmd: 'push --force 柱子[0] 柱子[1]  # 我情愿与非利士人同死', ref: '13:5',
      verse: [
        { text: '大利拉使参孙枕着她的膝睡觉，叫了一个人来剃除他头上的七条发绺……<br>他却不知道耶和华已经离开他了。', ref: '士师记 16:19–20', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            unprop('doorsH'); unprop('gaza'); unprop('lehi'); unprop('fieldN'); unprop('fieldM'); unprop('timnah');
            W.set('jgOpp', 0.3, b.instant);
            walk('samson', X.sorek - 0.024, { speed: 0.06, pose: 'lie' });
            add('delilah', { label: '大利拉', sex: 'f', x: X.sorek + 0.012, facing: -1, pose: 'sit', robe: ROBE.delilah, glow: 0.1 });
            avoid([0.52, 0.9]);
          }],
          [2.4, () => { add('barber', { label: '一个人', x: 0.86, facing: -1, robe: [100, 90, 80], glow: 0 }); walk('barber', X.sorek - 0.002, { speed: 0.05, pose: 'bow' }); }],
          [5.6, b => {
            add('samson', { hair: 'short', beard: true }); glow('samson', 0);
            prop('bc11', null, { fire: 0.22 });
            if (!b.instant && fx()) { const h = headOf('samson', 8); fx().sparkle(h[0], h[1], 26, [255, 230, 180], 10, 'top'); }
            sfx(b, 'wind', { soft: true });
          }],
          [6.4, b => say(b, [{ text: '非利士人将他拿住，剜了他的眼睛，带他下到迦萨，用铜链拘索他；他就在监里推磨。<br>然而他的头发被剃之后，又渐渐长起来了。', ref: '士师记 16:21–22', hold: 6.5 }])],
          [7.8, b => {
            rm('barber');
            crowd('phil', { n: 6, x0: 0.9, x1: 1.02, layer: 2, label: '非利士人', robe: ROBE.phil });
            cwalk('phil', 0.75, 0.84, { speed: 0.07, run: true });
            pose('samson', 'stand');
            sfx(b, 'crowd');
          }],
          [9.6, b => { rm('delilah'); W.goTo(0.4, 4, b.instant); prop('mill', 'mill', { x: X.mill, k: 1, label: '磨' }); walk('samson', X.mill + 0.035, { speed: 0.03, pose: 'bow' }); cwalk('phil', 0.66, 0.74, { speed: 0.03 }); }],
          [12.6, () => { walk('samson', X.mill + 0.02, { speed: 0.012, pose: 'bow' }); }],
          [14, b => { add('samson', { hair: 'long' }); glow('samson', 0.25); walk('samson', X.mill + 0.036, { speed: 0.012, pose: 'bow' }); }],
          [14.6, b => say(b, [{ text: '参孙求告耶和华说：「主耶和华啊，求你眷念我。<br>神啊，求你赐我这一次的力量……」', ref: '士师记 16:28', hold: 5 }])],
          [15, b => {
            prop('temple', 'temple', { x: X.temple, label: '大衮的庙' });
            crowd('lords', { n: 8, x0: X.temple - 0.07, x1: X.temple + 0.07, layer: 2, label: '非利士人的首领', robe: [168, 120, 84] });
            crm('phil');
            sfx(b, 'crowd', { far: true });
          }],
          [16, () => {
            add('boy', { label: '童子', age: 'child', x: X.mill + 0.06, facing: 1, robe: [150, 130, 100], glow: 0.1 });
            pose('samson', 'stand');
            walk('boy', X.temple - 0.022, { speed: 0.03 });
            walk('samson', X.temple - 0.002, { speed: 0.03 });
          }],
          [19.6, b => { unprop('mill'); pose('samson', 'pray'); beamOn(b, 'samson', { dur: 3, k: 0.6 }); walk('boy', X.temple - 0.05, { speed: 0.03 }); }],
          [21, b => say(b, [{ text: '参孙就抱住托房的那两根柱子……说：「我情愿与非利士人同死！」<br>就尽力屈身，房子倒塌，压住首领和房内的众人。', ref: '士师记 16:29–30', hold: 6.5 }])],
          [22.2, b => { pose('samson', 'raise'); glow('samson', 1); prop('bc11', null, { fire: 1 }); beamOn(b, 'samson', { dur: 3 }); sfx(b, 'harp'); }],
          [24.6, b => {
            prop('temple', null, { k: 1 });
            flash(b, { type: 'dust', xf: X.temple, dur: 6 });
            if (!b.instant) { W.shake = Math.max(W.shake || 0, 0.9); W.flash = Math.max(W.flash || 0, 0.1); }
            crm('lords'); rm('samson'); rm('boy');
            sfx(b, 'thunder'); sfx(b, 'build', { low: true });
          }],
          [27.5, () => { quench(11); }],
        ]);
      },
    },

    // ── 10:14 你们去哀求所选择的神：米迦的像；但人；基比亚 ─────────
    {
      kind: 'judge', utter: '你们去哀求所选择的神', cmd: 'ls ./神堂 && echo "各人任意而行"', ref: '10:14',
      verse: [
        { text: '「你们去哀求所选择的神；你们遭遇急难的时候，让他救你们吧！」', ref: '士师记 10:14', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { unprop('temple'); W.set('jgOpp', 0, b.instant); W.goTo(0.46, 4, b.instant); avoid([0.55, 0.9]); }],
          [5, b => say(b, [{ text: '这米迦有了神堂，又制造以弗得和家中的神像……<br>那时以色列中没有王，各人任意而行。', ref: '士师记 17:5–6', hold: 6 }])],
          [6, b => {
            prop('micah', 'house', { x: X.micah, grow: 1, k2: 1, label: '米迦的神堂' });
            add('micah', { label: '米迦', x: X.micah - 0.045, facing: 1, robe: ROBE.micah, glow: 0.1 });
          }],
          [7.4, b => { prop('micah', null, { k: 1 }); sfx(b, 'chime', { soft: true }); }],
          [8.6, () => { add('levite', { label: '利未人', x: 0.46, facing: 1, robe: ROBE.levite, glow: 0.2 }); walk('levite', X.micah + 0.03, { speed: 0.04 }); }],
          [11.6, b => { prop('shiloh', 'tabernacle', { x: 0.84, layer: 1, lit: 1, label: '示罗神的殿' }); }],
          [12, b => say(b, [{ text: '但人就为自己设立那雕刻的像……<br>神的殿在示罗多少日子，但人为自己设立米迦所雕刻的像也在多少日子。', ref: '士师记 18:30–31', hold: 6.5 }])],
          [9.4, b => { crowd('dan', { n: 9, x0: 1.03, x1: 1.16, layer: 2, label: '但人', robe: ROBE.dan }); cwalk('dan', 0.77, 0.9, { speed: 0.065 }); sfx(b, 'crowd'); }],
          [14.6, b => {
            prop('micah', null, { k: 0 });
            prop('silverD', 'silver', { x: X.micah + 0.02, label: '雕刻的像', spd: 0.045, tx: 1.12, show: true });
            cwalk('dan', 1.03, 1.16, { speed: 0.045 });
            walk('levite', 1.1, { speed: 0.045 });
            face('micah', 1); pose('micah', 'weep', { weep: true });
          }],
          [20.4, b => { crm('dan'); rm('levite'); unprop('silverD'); prop('danIdol', 'silver', { x: 0.965, layer: 1, label: '但城的像' }); }],
          [19.8, b => { W.goTo(0.76, 4, b.instant); prop('gibeah', 'city', { x: X.gibeah, layer: 1, size: 0.72, label: '基比亚' }); }],
          [20.6, b => say(b, [{ text: '凡看见的人都说：「从以色列人出埃及地，直到今日，这样的事没有行过，也没有见过。<br>现在应当思想，大家商议当怎样办理。」', ref: '士师记 19:30', hold: 6.5 }])],
          [20.8, () => {
            add('levite2', { label: '利未人', x: 1.04, facing: -1, robe: [128, 118, 100], glow: 0.1 });
            add('concubine', { label: '妾', sex: 'f', x: 1.08, facing: -1, robe: [150, 108, 104], glow: 0.1 });
            animal('don', 'donkey', 1.12, { facing: -1, label: '驴' });
            walk('levite2', 0.6, { speed: 0.075 }); walk('concubine', 0.625, { speed: 0.075, pose: 'sit' });
            if (has('don')) walk('don', 0.65, { speed: 0.075 });
            pose('micah', 'stand');
          }],
          [23.6, b => { W.goTo(0.02, 1.8, b.instant); prop('gibeah', null, { lit: 1 }); W.set('jgOpp', 0.35, b.instant); }],
          // 天亮了：只剩下那人与他的驴；以色列的四境都震动了（19:26–30）
          [25.6, b => {
            W.goTo(0.25, 2.4, b.instant);
            rm('concubine');
            crowd('israel', { n: 8, x0: 0.7, x1: 0.92, layer: 2, label: '以色列人', pose: 'weep' });
            sfx(b, 'weep');
          }],
        ]);
      },
    },

    // ── 20:18 犹大当先上去：以色列如同一人；缺了一个支派；没有王 ─────
    {
      kind: 'cmd', utter: '犹大当先上去', cmd: 'git log --grep "没有王" | tail -1', ref: '20:18',
      verse: [
        { text: '于是以色列从但到别是巴，以及住基列地的众人都出来，<br>如同一人，聚集在米斯巴耶和华面前。', ref: '士师记 20:1', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.33, 5, b.instant); W.set('jgOpp', 0, b.instant);
            rm('micah'); rm('levite2'); rm('don'); unprop('micah'); unprop('danIdol'); prop('gibeah', null, { lit: 0 });
            crm('israel');
            crowd('all', { n: 22, x0: 0.66, x1: 0.99, layer: 2, label: '以色列人' });
            crowd('benj', { n: 7, x0: 0.53, x1: 0.63, layer: 1, label: '便雅悯人' });
            avoid([0.5, 1]);
          }],
          [5, b => say(b, [{ text: '以色列人就起来，到伯特利去求问神说：「我们中间谁当首先上去与便雅悯人争战呢？」<br>耶和华说：「犹大当先上去。」', ref: '士师记 20:18', hold: 6.5 }])],
          [6.2, b => { prop('bethel', 'altar', { x: X.bethel, grow: 1, label: '伯特利的坛' }); cpose('all', 'kneel'); }],
          [7.6, b => { prop('bethel', null, { fire: 1 }); beam(b, X.bethel, 2, { dur: 4 }); sfx(b, 'fire'); }],
          [9.4, b => {
            cpose('all', 'stand');
            crowd('judahW', { n: 6, x0: 0.62, x1: 0.7, layer: 2, label: '犹大人' });
            cwalk('judahW', 0.47, 0.56, { speed: 0.04 });
            cwalk('all', 0.56, 0.9, { speed: 0.05 });
            sfx(b, 'crowd');
          }],
          [11.6, b => { prop('gibeah', null, { fire: 0.8, k: 1, ruin: 0.6 }); sfx(b, 'fire'); sfx(b, 'thunder', { far: true, soft: true }); }],
          [12.4, b => { crm('benj'); }],
          [12.6, b => say(b, [{ text: '以色列人来到伯特利，坐在神面前直到晚上，放声痛哭，<br>说：「耶和华以色列的神啊，为何以色列中有这样缺了一支派的事呢？」', ref: '士师记 21:2–3', hold: 6.5 }])],
          [14.2, b => { W.goTo(0.75, 5, b.instant); crm('judahW'); prop('bethel', null, { fire: 0.4 }); cwalk('all', 0.62, 0.95, { speed: 0.05, pose: 'weep' }); }],
          [17, b => { prop('gibeah', null, { fire: 0, k: 0.3 }); sfx(b, 'weep'); }],
          [20.6, b => say(b, [{ text: '那时，以色列中没有王，各人任意而行。', ref: '士师记 21:25', hold: 7 }])],
          [21.2, b => { W.goTo(0.02, 6, b.instant); prop('bethel', null, { fire: 0 }); }],
          // 各归本支派、本宗族、本地业去了（21:24）：散开，各往各的方向
          [22.6, b => { cwalk('all', 0.36, 1.14, { speed: 0.035 }); W.set('jgWander', 1, b.instant); sfx(b, 'wind', { soft: true }); }],
          [27.6, () => { crm('all'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '士师记', books: [7], title: '士师', sub: '士师记 1 — 21', tint: [250, 200, 160], music: 'cain',
    outro: 18,
    intro: [{ text: '约书亚死后，以色列人求问耶和华说：<br>「我们中间谁当首先上去攻击迦南人，与他们争战？」', ref: '士师记 1:1', hold: 6.5 }],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '俄陀聂': { text: '耶和华的灵降在他身上，他就作了以色列的士师，出去争战。', ref: '士师记 3:10' },
      '以笏': { text: '耶和华就为他们兴起一位拯救者，就是便雅悯人基拉的儿子以笏；<br>他是左手便利的。', ref: '士师记 3:15' },
      '珊迦': { text: '以笏之后，有亚拿的儿子珊迦，他用赶牛的棍子打死六百非利士人。他也救了以色列人。', ref: '士师记 3:31' },
      '底波拉': { text: '她住在以法莲山地拉玛和伯特利中间，在底波拉的棕树下。<br>以色列人都上她那里去听判断。', ref: '士师记 4:5' },
      '基甸': { text: '耶和华的使者向基甸显现，对他说：「大能的勇士啊，耶和华与你同在！」', ref: '士师记 6:12' },
      '陀拉': { text: '亚比米勒以后，有以萨迦人朵多的孙子、普瓦的儿子陀拉兴起，拯救以色列人。', ref: '士师记 10:1' },
      '睚珥': { text: '在他以后有基列人睚珥兴起，作以色列的士师二十二年。', ref: '士师记 10:3' },
      '耶弗他': { text: '基列人耶弗他是个大能的勇士……', ref: '士师记 11:1' },
      '以比赞': { text: '耶弗他以后，有伯利恒人以比赞作以色列的士师。', ref: '士师记 12:8' },
      '以伦': { text: '以比赞之后，有西布伦人以伦，作以色列的士师十年。', ref: '士师记 12:11' },
      '押顿': { text: '以伦之后，有比拉顿人希列的儿子押顿作以色列的士师。', ref: '士师记 12:13' },
      '参孙': { text: '当非利士人辖制以色列人的时候，参孙作以色列的士师二十年。', ref: '士师记 15:20' },
      '巴拉': { text: '于是巴拉下了他泊山，跟随他有一万人。', ref: '士师记 4:14' },
      '以色列人': { text: '那时，以色列中没有王，各人任意而行。', ref: '士师记 21:25' },
      '示罗神的殿': { text: '神的殿在示罗多少日子，但人为自己设立米迦所雕刻的像也在多少日子。', ref: '士师记 18:31' },
      '伯特利的坛': { text: '次日清早，百姓起来，在那里筑了一座坛，献燔祭和平安祭。', ref: '士师记 21:4' },
      '基比亚': { text: '当烟气如柱从城中上腾的时候，便雅悯人回头观看，见全城的烟气冲天。', ref: '士师记 20:40' },
      '铁车': { text: '耶宾王有铁车九百辆。他大大欺压以色列人二十年，以色列人就呼求耶和华。', ref: '士师记 4:3' },
      '他泊山': { text: '底波拉对巴拉说：「你起来，今日就是耶和华将西西拉交在你手的日子。<br>耶和华岂不在你前头行吗？」', ref: '士师记 4:14' },
      '基顺河': { text: '基顺古河把敌人冲没；我的灵啊，应当努力前行。', ref: '士师记 5:21' },
      '底波拉的棕树': { text: '她住在以法莲山地拉玛和伯特利中间，在底波拉的棕树下。', ref: '士师记 4:5' },
      '米甸营': { text: '米甸人、亚玛力人，和一切东方人都布散在平原，如同蝗虫那样多。<br>他们的骆驼无数，多如海边的沙。', ref: '士师记 7:12' },
      '耶和华沙龙': { text: '于是基甸在那里为耶和华筑了一座坛，起名叫「耶和华沙龙」。', ref: '士师记 6:24' },
      '禾场上的羊毛': { text: '这夜神也如此行：独羊毛上是干的，别的地方都有露水。', ref: '士师记 6:40' },
      '哈律泉': { text: '耶路‧巴力就是基甸，他和一切跟随的人早晨起来，在哈律泉旁安营。', ref: '士师记 7:1' },
      '三百人': { text: '他们在营的四围各站各的地方；全营的人都乱窜。三百人呐喊，使他们逃跑。', ref: '士师记 7:21' },
      '荆棘': { text: '荆棘回答说：「你们若诚诚实实地膏我为王，就要投在我的荫下；<br>不然，愿火从荆棘里出来，烧灭黎巴嫩的香柏树。」', ref: '士师记 9:15' },
      '隐‧哈歌利': { text: '参孙喝了，精神复原；因此那泉名叫隐‧哈歌利，那泉直到今日还在利希。', ref: '士师记 15:19' },
      '大衮的庙': { text: '这样，参孙死时所杀的人比活着所杀的还多。', ref: '士师记 16:30' },
      '米迦的神堂': { text: '这米迦有了神堂，又制造以弗得和家中的神像，分派他一个儿子作祭司。', ref: '士师记 17:5' },
      '迦南人的城': { text: '及至以色列强盛了，就使迦南人做苦工，没有把他们全然赶出。', ref: '士师记 1:28' },
      '山地的城': { text: '耶和华与犹大同在，犹大就赶出山地的居民……', ref: '士师记 1:19' },
      '波金的坛': { text: '于是给那地方起名叫波金。众人在那里向耶和华献祭。', ref: '士师记 2:5' },
      '示剑': { text: '示剑人的一切恶，神也都报应在他们头上；耶路‧巴力的儿子约坦的咒诅归到他们身上了。', ref: '士师记 9:57' },
      '约坦': { text: '有人将这事告诉约坦，他就去站在基利心山顶上，向众人大声喊叫说：<br>「示剑人哪，你们要听我的话，神也就听你们的话。」', ref: '士师记 9:7' },
      '耶弗他的女儿': { text: '她便和同伴去了，在山上为她终为处女哀哭。', ref: '士师记 11:38' },
      '玛挪亚': { text: '玛挪亚将一只山羊羔和素祭在磐石上献与耶和华，使者行奇妙的事；玛挪亚和他的妻观看，', ref: '士师记 13:19' },
      '大利拉': { text: '后来，参孙在梭烈谷喜爱一个妇人，名叫大利拉。', ref: '士师记 16:4' },
      '迦萨的城门': { text: '参孙睡到半夜，起来，将城门的门扇、门框、门闩，一齐拆下来，<br>扛在肩上，扛到希伯仑前的山顶上。', ref: '士师记 16:3' },
      '少壮狮子': { text: '过了些日子，再下去要娶那女子，转向道旁要看死狮，见有一群蜂子和蜜在死狮之内，', ref: '士师记 14:8' },
    },
  });
})(window.GS);
