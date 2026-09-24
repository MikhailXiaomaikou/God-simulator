/* ─────────────────────────────────────────────────────────────
 * book/sermon.js —— 四福音 · 登山宝训（马太福音 5 — 7）
 *
 * 加利利海边的一座山，从天将亮讲到日落。海在左（东，日出），迦百农在中丘的岸上，远山顶上有一座城；
 * 山在近处的右边升起（0.585–0.985），耶稣坐在山肩上，门徒在他跟前，众人坐满了山坡与山前；
 * 山脚的近岸上有一座玄武岩的小屋（门与灯台）、一块磐石、海边一片沙土（比喻里的两座房子就盖在那里）。
 *   5:1–3  天还没亮，众人跟着他上了山，他坐下，开口教训他们：「虚心的人有福了」。
 *   5:4–9  东方发白，晨星在海上；哀恸的人得了安慰；自上而来的光照在清心的人身上；
 *          使人和睦的人领两个背转的弟兄相拥。
 *   5:13–16「你们是世上的光」——山上众人心里的光一齐点亮；山上的城不能隐藏；迦百农的窗里、
 *          门里灯台上的灯、远处山间的村庄，一盏一盏亮起（本幕的第一幅签名之景）。
 *   5:43–48「要爱你们的仇敌」——日头从海上升起，金光扫过全地，照好人也照歹人；一阵太阳雨落在众人身上。
 *   6:1–4  暗中的施舍：一个妇人悄悄把饼放在山脚乞丐的碗里，一缕光升到天上。
 *   6:9–13 主祷文：「你们祷告要这样说」——他坐着教导，门徒与众人都跪下，光自天而降落在跪着的众人身上。
 *   6:26   天上的飞鸟自灵所在之处飞出，天父撒下金色的谷粒养活它们。
 *   6:28–33 野地里的百合花自灵所在之处开遍山坡；一朵比所罗门的荣华还美。
 *   7:7–11 叩门的就给他开门：父亲为儿子叩门求饼，门开了，暖光流出，家主在门口把饼递给他。
 *   7:13–14 窄门与小路：三个人进了窄门，沿着一条光的小路上山；宽路上许多人走进尘雾里。
 *   7:16–17 凡好树都结好果子：山坡上的无花果树发叶、结果；荆棘仍是荆棘。
 *   7:24–27 盖在磐石上的房子与盖在沙土上的房子；雨淋、水冲、风吹——沙土上的倒塌了，磐石上的总不倒塌
 *          （本幕的第二幅签名之景）；雨后金色的黄昏，众人都希奇他的教训（7:28–29）。
 *
 * 神的显现：父从不成形——只是自上而来的光与经文的声音；子是众人中间一个无面目的人（GS.cast.LOOK.jesus），
 * 人们因光与众人转向他而认出他；圣灵是玩家自己漂游的光（飞鸟与百合都从它所在之处生出）。
 * 话语都是主耶稣在山上说的话（马太福音 5 — 7），各在自己那一句的经文里出现。
 * 规矩：一切状态只在 setup / apply / 情节里设定（瞬间重演得到同样的世界）；布景只在本幕进行时绘制。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'sermon';
  const LV = W.lv;
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时对齐）───────────────────
  W.defineLevel('srDawn', 'exp', 0.35);    // 东方发白、晨星在海上（5:8）
  W.defineLevel('srSee', 'exp', 0.45);     // 自上而来的光照在众人身上（必得见神）
  W.defineLevel('srInner', 'exp', 0.55);   // 众人心里的光（5:14）
  W.defineLevel('srSpread', 'lin', 0.34);  // 那光自他身上传开，由近及远（约三秒传遍山坡）
  W.defineLevel('srLamps', 'exp', 0.45);   // 窗里、门里灯台上的灯（5:15）
  W.defineLevel('srFar', 'lin', 0.16);     // 远处山间的村庄一盏一盏亮起（5:16）
  W.defineLevel('srCity', 'exp', 0.45);    // 城造在山上是不能隐藏的（5:14）
  W.defineLevel('srSun', 'lin', 0.085);    // 日出的金光扫过全地（5:45）
  W.defineLevel('srGive', 'exp', 0.7);     // 暗中的施舍：一缕光升到天上（6:4）
  W.defineLevel('srPillar', 'exp', 0.42);  // 主祷文：光自天而降（6:9–10）
  W.defineLevel('srLily', 'lin', 0.1);     // 野地里的百合花（6:28）
  W.defineLevel('srGlory', 'exp', 0.5);    // 还不如这花一朵呢（6:29）
  W.defineLevel('srDoor', 'exp', 0.9);     // 叩门，就给你们开门（7:7）
  W.defineLevel('srGate', 'exp', 0.6);     // 窄门（7:13）
  W.defineLevel('srPath', 'lin', 0.2);     // 路是小的（7:14）
  W.defineLevel('srRoad', 'exp', 0.5);     // 路是大的（7:13）
  W.defineLevel('srFruit', 'lin', 0.1);    // 凡好树都结好果子（7:17）
  W.defineLevel('srRock', 'lin', 0.1);     // 把房子盖在磐石上（7:24）
  W.defineLevel('srSand', 'lin', 0.19);    // 把房子盖在沙土上（7:26）
  W.defineLevel('srSurge', 'exp', 0.6);    // 水冲（7:25）
  W.defineLevel('srFall', 'lin', 0.32);    // 房子就倒塌了（7:27）
  W.defineLevel('srGold', 'exp', 0.35);    // 雨后金色的黄昏（7:28）
  const MY = ['srDawn', 'srSee', 'srInner', 'srSpread', 'srLamps', 'srFar', 'srCity', 'srSun', 'srGive', 'srPillar', 'srLily', 'srGlory', 'srDoor',
    'srGate', 'srPath', 'srRoad', 'srFruit', 'srRock', 'srSand', 'srSurge', 'srFall', 'srGold'];

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const port = () => W.w < W.h * 0.9;
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.35 : 1) * (LK[l] || 1);
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const gY = (l, xf) => { const x = xf * W.w; let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const M = () => Math.min(W.w, W.h);
  const nightK = () => clamp(W.night * 1.1 + W.dusk * 0.25, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const sstep = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const inst = b => !!(b && b.instant) || !!W.replaying;
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function sfx(b, name, o) { if (inst(b)) return; const a = au(); if (a && a.sfx) U.safe('sermon.sfx', () => a.sfx(name, o || {})); }
  function hint(b, text, sec) { if (inst(b) || !GS.ui || !GS.ui.hint) return; U.safe('sermon.hint', () => GS.ui.hint(text, sec || 5)); }
  const litX = () => (W.night > 0.55 && LV.moon > 0.3 ? W.moon.x : W.core.x);

  // ════════════════════════════════════════════════════════════
  //  山：在近地的右边升起（面海的一边缓，山肩平阔可坐，右边落下）
  //  山上的位置用 (u, d) 记：u ∈ [-1, 1] 横向（山心为 0），d 为纵深——0 在山脊线上，1 在山脚的地线上，
  //  大于 1 在山前的平地上（更近、更低）。u 超出 ±1 就在山外的平地上。
  // ════════════════════════════════════════════════════════════
  const MPTS = [[-1, 0], [-0.86, 0.1], [-0.72, 0.26], [-0.58, 0.44], [-0.44, 0.6], [-0.3, 0.73], [-0.16, 0.83], [-0.02, 0.89],
    [0.12, 0.93], [0.26, 0.97], [0.4, 1.0], [0.54, 0.96], [0.66, 0.86], [0.78, 0.66], [0.88, 0.42], [0.95, 0.2], [1, 0]];
  function kRaw(u) {
    for (let i = 1; i < MPTS.length; i++) {
      const a = MPTS[i - 1], b = MPTS[i];
      if (u <= b[0]) { const t = (u - a[0]) / Math.max(1e-6, b[0] - a[0]); return lerp(a[1], b[1], t * t * (3 - 2 * t)); }
    }
    return 0;
  }
  let MK = null;
  function buildModel() {
    const r = U.mulberry32(5317), n = 72;
    MK = [];
    for (let i = 0; i <= n; i++) {
      const u = -1 + 2 * i / n, flat = Math.abs(u) > 0.94 || (u > -0.1 && u < 0.18);
      MK.push(Math.max(0, kRaw(u) + (flat ? 0 : (r() - 0.5) * 0.028)));
    }
    MK[0] = 0; MK[n] = 0;
  }
  function kAt(u) {
    if (!(u > -1 && u < 1)) return 0;
    if (!MK) buildModel();
    const f = (u + 1) / 2 * (MK.length - 1), i = Math.min(MK.length - 2, Math.floor(f));
    return lerp(MK[i], MK[i + 1], f - i);
  }
  const mt = () => (port() ? { cx: 0.79, hw: 0.22 } : { cx: 0.785, hw: 0.2 });
  const UX = u => { const m = mt(); return m.cx + u * m.hw; };
  const XU = xf => { const m = mt(); return (xf - m.cx) / m.hw; };
  const mtH = () => { const m = mt(); return port() ? Math.min(W.h * 0.12, m.hw * W.w) : Math.min(W.h * 0.21, m.hw * W.w * 0.75); };
  function topY(xf) { const g = gY(2, xf), k = kAt(XU(xf)); return k > 0 ? g + 2 - k * mtH() : g; }
  function faceY(xf, d) {
    const g = gY(2, xf);
    if (d <= 1) { const t = topY(xf); return t + (g - t) * d; }
    return g + (d - 1) * fieldH(2, g) * 0.8;
  }
  const FP = (u, d) => { const xf = UX(u); return [xf * W.w, faceY(xf, d)]; };

  // ── 人：在山上随纵深 d 上下（缓动；重演时直接到位）──────────
  const TRK = new Set();
  const vOf = d => clamp(-0.24 + 0.42 * d, -0.24, 0.4);
  function track(p, d) {
    if (!p) return p;
    p._sd = d; p._sdT = d; p._sdR = 0.3; p.v = vOf(d);
    p.attach = () => [p.nx * W.w, faceY(p.nx, p._sd)];
    TRK.add(p);
    return p;
  }
  function setD(p, d, dur) {
    if (!p) return;
    if (p._sd == null) track(p, d);
    p._sdT = d;
    p._sdR = Math.max(0.05, Math.abs(d - p._sd) / Math.max(0.5, dur || 2.5));
    if (W.replaying) { p._sd = d; p.v = vOf(d); }
  }

  // ── 人物（皆经人物模块）──────────────────────────────────
  const C = () => cast();
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function person(id, o, u, d) {
    const p = C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade', layer: 2, x: UX(u) }, o));
    return track(p, d);
  }
  function look(key, o) { const L = (C() && C().LOOK) || {}; return Object.assign({}, L[key] || {}, o || {}); }
  // 走到山上的 (u, d)，到了换成 pose
  function go(id, u, d, pose, speed) {
    const p = fig(id);
    if (!p || p.dying) return;
    const sp = speed || 0.03, x = UX(u);
    const dur = Math.abs(x - p.nx) / sp;
    C().walk(id, x, { pose: pose || 'stand', speed: sp });
    setD(p, d, Math.max(dur, 1.2));
  }
  function pose(id, ps, o) { if (has(id)) C().pose(id, ps, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function faceJ(id) { const p = fig(id); if (!p) return; face(id, UX(0) >= (p.tx != null ? p.tx : p.nx) ? 1 : -1); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  function crowd(gid, o) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    return C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false, label: '众人' }, o)) || [];
  }
  function cpose(gid, ps) { if (hasCrowd(gid)) C().crowdPose(gid, ps); }
  function cglow(gid, v) { for (const m of cmembers(gid)) m.glow = v; }
  // 群中各人按序号走到各自的座位（不随机：重演、恢复都一样），到了面向耶稣
  function cseat(gid, seats, pose, speed, stagger) {
    const ms = cmembers(gid);
    if (!ms.length) return;
    const c = C();
    if (!W.replaying) c.crowdWalk(gid, 0.5, 0.6, { pose: pose || 'sit', speed: speed || 0.03 });
    const jx = UX(0);
    ms.forEach((m, i) => {
      const s = seats[i % seats.length], x = UX(s[0]);
      const dir = x < jx - 0.004 ? 1 : x > jx + 0.004 ? -1 : (s[2] || 1);
      if (W.replaying) {
        m.nx = x; m.tx = null; m.facing = m.fd = dir; m.faceEnd = null;
        setD(m, s[1]);
      } else {
        const sp = (speed || 0.03) * (0.9 + 0.2 * ((i * 0.618) % 1)) * (1 - (stagger || 0) * ((i * 0.382) % 1));
        m.tx = x; m.speed = sp; m.facing = x >= m.nx ? 1 : -1; m.faceEnd = dir;
        setD(m, s[1], Math.abs(x - m.nx) / sp);
      }
    });
    if (W.replaying) c.crowdPose(gid, pose || 'sit');
  }
  // 群中各人立即就位（setup 时）
  function cplace(gid, seats, dirFn) {
    const ms = cmembers(gid);
    ms.forEach((m, i) => {
      const s = seats[i % seats.length];
      m.nx = UX(s[0]); m.tx = null;
      const dir = dirFn ? dirFn(m, i) : (m.nx < UX(0) ? 1 : -1);
      m.facing = m.fd = dir;
      track(m, s[1]);
    });
  }
  function cfaceJ(gid) {
    const jx = UX(0);
    for (const m of cmembers(gid)) {
      const dir = m.nx < jx ? 1 : -1;
      if (m.tx != null && !W.replaying) { m.faceEnd = dir; continue; }
      m.faceEnd = null; m.facing = dir;
      if (W.replaying) m.fd = dir;
    }
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function bodyAt(p, frac) {
    if (!p) return null;
    if (p._vis && isFinite(p._x) && isFinite(p._y)) return [p._x, p._y - (p._h || 30) * frac];
    const y = p._sd != null ? faceY(p.nx, p._sd) : gY(p.layer == null ? 2 : p.layer, p.nx);
    return [p.nx * W.w, y - 34 * LS(p.layer == null ? 2 : p.layer) * frac];
  }
  const LOWP = { sit: 1, kneel: 1, pray: 1, seat: 1 };
  function chestOf(p) { const low = LOWP[p.pose] ? 0.36 : 0.62; return bodyAt(p, low); }

  // ════════════════════════════════════════════════════════════
  //  座位（桌面 / 竖屏各一套）：[u, d, 朝向(可省)]
  // ════════════════════════════════════════════════════════════
  function seats() {
    if (port()) return {
      jesus: [0.02, 0.08],
      peter: [-0.2, 0.26], john: [0.24, 0.26], andrew: [-0.4, 0.42], james: [0.44, 0.4],
      L: [[-0.12, 0.56], [0.1, 0.6], [-0.32, 0.74], [-0.1, 0.84], [-0.52, 0.95], [0.14, 0.98]],
      R: [[0.3, 0.66], [0.52, 0.78], [0.34, 0.92], [0.58, 1.0], [0.74, 0.86], [0.8, 1.06]],
      F: [[-0.46, 1.26], [-0.02, 1.3], [0.3, 1.24], [0.6, 1.3]],
      seek: [[-0.6, 0.52], [-0.7, 0.64], [-0.5, 0.66]],
      startL: [[-0.9, 1.34], [-0.78, 1.5], [-0.66, 1.36], [-0.54, 1.52], [-0.42, 1.38], [-0.3, 1.54]],
      startR: [[-0.18, 1.36], [-0.06, 1.52], [0.06, 1.38], [0.18, 1.54], [0.3, 1.36], [0.42, 1.52]],
      startF: [[0.12, 1.66], [0.3, 1.7], [0.5, 1.64], [0.68, 1.7]],
    };
    return {
      jesus: [0.0, 0.07],
      peter: [-0.16, 0.2], john: [0.16, 0.21], andrew: [-0.29, 0.27], james: [0.29, 0.27],
      L: [[-0.22, 0.46], [-0.08, 0.44], [0.06, 0.46], [0.2, 0.5], [-0.34, 0.66], [-0.2, 0.7], [-0.06, 0.68], [0.08, 0.72], [0.22, 0.74],
        [-0.6, 0.97], [-0.46, 0.92], [-0.32, 0.93], [-0.18, 0.95], [-0.04, 0.97]],
      R: [[0.34, 0.48], [0.36, 0.7], [0.5, 0.8], [0.64, 0.75], [0.6, 0.58], [0.12, 0.96], [0.26, 0.95], [0.4, 0.96], [0.54, 0.98],
        [0.68, 0.94], [0.8, 0.8], [0.82, 0.97]],
      F: [[-0.44, 1.22], [-0.18, 1.24], [0.04, 1.2], [0.2, 1.26], [0.58, 1.22], [0.72, 1.18]],
      seek: [[-0.46, 0.4], [-0.56, 0.5], [-0.66, 0.6]],
      startL: [[-1.0, 1.3], [-0.92, 1.44], [-0.84, 1.3], [-0.76, 1.46], [-0.68, 1.32], [-0.6, 1.48], [-0.52, 1.3], [-0.44, 1.46],
        [-0.36, 1.32], [-0.28, 1.48], [-0.2, 1.3], [-0.12, 1.46], [-0.04, 1.32], [0.04, 1.48]],
      startR: [[0.1, 1.3], [0.16, 1.46], [0.22, 1.3], [0.28, 1.46], [0.36, 1.3], [0.42, 1.46], [0.5, 1.3], [0.56, 1.46],
        [0.62, 1.3], [0.68, 1.44], [0.74, 1.3], [0.8, 1.44]],
      startF: [[-0.5, 1.64], [-0.26, 1.62], [0.0, 1.64], [0.22, 1.6], [0.44, 1.64], [0.62, 1.6]],
    };
  }
  // 山脚与山前的几个人与物（[u, d]；u 超出 -1 就在山外、近岸的平地上）
  function spots() {
    if (port()) return {
      jesus0: [-0.64, 1.18], peter0: [-0.76, 1.24], john0: [-0.54, 1.3], andrew0: [-0.84, 1.34], james0: [-0.46, 1.24],
      beggar: [-1.06, 1.14], door: -1.205, father: [-0.92, 1.3], son: [-0.83, 1.36], giver: [-0.682, 1.42], alms: 0.07,
      knock: [-0.022, 1.06], host: 0.005,
      mourner: [0.38, 1.46], comforter: [0.56, 1.42], broA: [-0.56, 1.58], broB: [-0.16, 1.62], elder: [-0.36, 1.68],
      peace: [-0.36, 1.58], gate: [-0.86, 0.96], tree: [0.5, 0.42], thorn: [0.76, 0.52],
      pick1: [0.4, 0.54], pick2: [0.6, 0.58], sand: -1.705, rock: -1.455, wise0: [-1.36, 1.14], fool0: [-1.6, 1.14],
    };
    return {
      jesus0: [-0.7, 1.16], peter0: [-0.8, 1.22], john0: [-0.6, 1.28], andrew0: [-0.88, 1.32], james0: [-0.52, 1.2],
      beggar: [-0.985, 1.12], door: -1.115, father: [-0.85, 1.26], son: [-0.775, 1.32], giver: [-0.6, 1.36], alms: 0.07,
      knock: [-0.012, 1.06], host: 0.002,
      mourner: [0.33, 1.36], comforter: [0.47, 1.3], broA: [-0.46, 1.46], broB: [-0.12, 1.48], elder: [-0.3, 1.56],
      peace: [-0.3, 1.46], gate: [-0.84, 0.95], tree: [0.56, 0.4], thorn: [0.74, 0.5],
      pick1: [0.46, 0.52], pick2: [0.64, 0.56], sand: -1.685, rock: -1.385, wise0: [-1.3, 1.1], fool0: [-1.6, 1.1],
    };
  }
  // 窄门之后的小路（u, d）：自窄门折上山去
  function pathPts() {
    const g = spots().gate, s = seats().seek;
    return port()
      ? [g, [-0.8, 0.84], [-0.76, 0.72], [-0.66, 0.6], [s[0][0], s[0][1]]]
      : [g, [-0.76, 0.8], [-0.7, 0.66], [-0.6, 0.54], [s[0][0], s[0][1]]];
  }

  // ════════════════════════════════════════════════════════════
  //  光的精灵（预先画好的柔光）
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function sprites() {
    if (SP) return SP;
    SP = {};
    const mk = (rgb, n, mid) => {
      const c = document.createElement('canvas'); c.width = c.height = n;
      const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      gr.addColorStop(0, rgba(rgb, 1)); gr.addColorStop(mid, rgba(rgb, 0.34)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, n, n);
      return c;
    };
    try {
      SP.warm = mk([255, 206, 140], 64, 0.3); SP.pale = mk([255, 246, 226], 64, 0.3);
      SP.gold = mk([255, 222, 150], 64, 0.4); SP.cool = mk([206, 220, 255], 64, 0.28);
      SP.flame = mk([255, 176, 84], 32, 0.35);
      const core = (rgb) => {
        const n = 48, c = document.createElement('canvas'); c.width = c.height = n;
        const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        gr.addColorStop(0, 'rgba(255,255,248,1)'); gr.addColorStop(0.14, 'rgba(255,250,232,0.95)'); gr.addColorStop(0.32, rgba(rgb, 0.4)); gr.addColorStop(1, rgba(rgb, 0));
        g.fillStyle = gr; g.fillRect(0, 0, n, n);
        return c;
      };
      SP.star = core([220, 230, 255]); SP.lamp = core([255, 190, 110]);
      // 柔光的光束：自源头渐宽、渐淡，两边柔化（逐像素画成一次）
      const beam = (rgb) => {
        const bw = 192, bh = 48, c = document.createElement('canvas'); c.width = bw; c.height = bh;
        const g = c.getContext('2d'), im = g.createImageData(bw, bh), d = im.data;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
          const t = (x + 0.5) / bw, dy = Math.abs(y + 0.5 - bh / 2) / (bh / 2);
          const hw = 0.3 + 0.7 * t, q = dy / hw;
          const a = Math.pow(1 - t, 1.2) * Math.min(1, t * 10) * Math.exp(-q * q * 2.4);
          const i = (y * bw + x) * 4;
          d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = Math.round(255 * Math.min(1, a));
        }
        g.putImageData(im, 0, 0);
        return c;
      };
      SP.beam = beam([255, 240, 208]); SP.beamW = beam([255, 214, 150]);
      // 光柱：上下一样宽、两边柔化、上浓下淡
      const col = (rgb, top) => {
        const bw = 64, bh = 128, c = document.createElement('canvas'); c.width = bw; c.height = bh;
        const g = c.getContext('2d'), im = g.createImageData(bw, bh), d = im.data;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
          const t = (y + 0.5) / bh, q = Math.abs(x + 0.5 - bw / 2) / (bw / 2);
          const a = (0.35 + 0.65 * (1 - t)) * Math.min(1, (1 - t) * 6) * Math.exp(-q * q * 3.2) * (top ? sstep(t * top) : Math.min(1, t * 8 + 0.3));
          const i = (y * bw + x) * 4;
          d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = Math.round(255 * Math.min(1, a));
        }
        g.putImageData(im, 0, 0);
        return c;
      };
      SP.col = col([255, 244, 218]); SP.colSoft = col([255, 244, 218], 3.2);
      // 自下而上渐淡的一缕光（施舍的光自手中升起）
      const up = document.createElement('canvas'); up.width = SP.col.width; up.height = SP.col.height;
      const ug = up.getContext('2d'); ug.translate(0, up.height); ug.scale(1, -1); ug.drawImage(col([255, 232, 180]), 0, 0);
      SP.colUp = up;
    } catch (e) { /* 无画布时略过 */ }
    return SP;
  }
  function beamAt(ctx, img, x, y, ang, len, wid, a) {
    if (!img || !(a > 0.004) || !(len > 1) || !isFinite(x) || !isFinite(y)) return;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, 0, -wid / 2, len, wid);
    ctx.restore();
  }
  function glowAt(ctx, img, x, y, r, a) {
    if (!img || !(a > 0.004) || !(r > 0.3) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - r, y - r, 2 * r, 2 * r);
  }

  // ════════════════════════════════════════════════════════════
  //  状态（只在 setup / apply / 情节里改动）
  // ════════════════════════════════════════════════════════════
  let S = fresh();
  function fresh() {
    return { up: false, peace: false, lit: false, sun: false, alms: false, prayed: false, birds: false, lily: null,
      bread: null, host: false, gate: false, fruit: false, built: false, fallen: false, amazed: false, down: false };
  }

  // ════════════════════════════════════════════════════════════
  //  几何缓存（随屏幕缩放、大地细节就绪而重算）
  // ════════════════════════════════════════════════════════════
  let G = null;
  function layout() {
    const key = W.w + 'x' + W.h + ':' + Math.round(gY(2, 0.7)) + ':' + Math.round(gY(1, 0.7));
    if (G && G.key === key) return G;
    const m = mt(), n = 64, sky = [];
    let peak = 1e9, base = -1e9;
    for (let i = 0; i <= n; i++) {
      const u = -1 + 2 * i / n, xf = m.cx + u * m.hw;
      const t = topY(xf), g = gY(2, xf);
      sky.push([xf * W.w, t, g, u]);
      peak = Math.min(peak, t); base = Math.max(base, g);
    }
    // 山坡上的草丛、花、石头（按种子定下，与屏幕无关）
    const r = U.mulberry32(733), tufts = [], flowers = [], rocks = [];
    for (let i = 0; i < 120; i++) tufts.push([-0.98 + r() * 1.96, 0.04 + r() * 0.94, 0.6 + r() * 0.8, (r() - 0.5) * 0.6]);
    for (let i = 0; i < 150; i++) flowers.push([-0.95 + r() * 1.9, 0.06 + r() * 0.92, (r() * 4) | 0, r()]);
    for (const q of [[-0.66, 0.9], [-0.47, 0.8], [0.62, 0.5], [0.9, 0.76], [0.2, 0.84], [-0.18, 0.95], [0.78, 0.94]]) rocks.push([q[0], q[1], 0.6 + r() * 0.7, r()]);
    G = { key, sky, peak, base, tufts, flowers, rocks, s: LS(2) };
    lily = null;
    return G;
  }

  // ════════════════════════════════════════════════════════════
  //  画：山
  // ════════════════════════════════════════════════════════════
  const M_TOP = [112, 146, 76], M_MID = [86, 122, 60], M_BOT = [64, 98, 46];
  function mountPath(ctx, g, drop) {
    const P = g.sky;
    ctx.beginPath();
    ctx.moveTo(P[0][0], P[0][2] + drop);
    for (const p of P) ctx.lineTo(p[0], p[1]);
    for (let i = P.length - 1; i >= 0; i--) ctx.lineTo(P[i][0], P[i][2] + drop);
    ctx.closePath();
  }
  function drawMountain(ctx, g) {
    const P = g.sky, s = g.s;
    mountPath(ctx, g, 3);
    // 天将亮时，面向东方（海）的山坡先受了晨光：比四围的地亮一些，坐在坡上的人才看得出来
    const ex = 0.3 * clamp((0.62 - W.daylight) / 0.34, 0, 1) * (1 - LV.storm) * (W.night < 0.9 ? 1 : 0.4);
    const gr = ctx.createLinearGradient(0, g.peak, 0, g.base);
    gr.addColorStop(0, css(M_TOP, 2, 1, ex)); gr.addColorStop(0.55, css(M_MID, 2, 1, ex * 0.9)); gr.addColorStop(1, css(M_BOT, 2, 1, ex * 0.6));
    ctx.fillStyle = gr; ctx.fill();
    // 背光的一坡（早晨日在左：右坡在阴里；黄昏反过来）
    const lx = litX(), cxp = UX(0.35) * W.w, sd = clamp((lx - cxp) / (W.w * 0.5), -1, 1);
    const shadeA = (0.12 + 0.16 * W.daylight) * Math.min(1, Math.abs(sd) * 1.6 + 0.2);
    if (shadeA > 0.01) {
      const x0 = UX(sd < 0 ? 0.3 : 0.1) * W.w, x1 = UX(sd < 0 ? 1 : -1) * W.w;
      const sg = ctx.createLinearGradient(x0, 0, x1, 0);
      sg.addColorStop(0, 'rgba(18,26,40,0)'); sg.addColorStop(1, 'rgba(18,26,40,' + shadeA.toFixed(3) + ')');
      ctx.fillStyle = sg; ctx.fill();
    }
    // 牧羊的小径：沿着山坡的几道浅痕
    ctx.strokeStyle = css([150, 170, 110], 2, 0.22 * dayA());
    ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    for (const dd of [0.34, 0.61, 0.84]) {
      let first = true;
      for (let u = -0.86 + dd * 0.2; u <= 0.9 - dd * 0.1; u += 0.04) {
        const q = FP(u, dd + Math.sin(u * 7 + dd * 9) * 0.02);
        if (first) { ctx.moveTo(q[0], q[1]); first = false; } else ctx.lineTo(q[0], q[1]);
      }
    }
    ctx.stroke();
    // 石头（玄武岩）
    for (const q of g.rocks) {
      const p = FP(q[0], q[1]), rr = 5.5 * s * q[2];
      ctx.fillStyle = css([74, 70, 68], 2);
      ctx.beginPath(); ctx.ellipse(p[0], p[1] - rr * 0.35, rr, rr * 0.6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([150, 146, 138], 2, 0.5 * dayA(), 0.1);
      ctx.beginPath(); ctx.ellipse(p[0] + (lx > p[0] ? 1 : -1) * rr * 0.25, p[1] - rr * 0.6, rr * 0.55, rr * 0.25, 0, 0, TAU); ctx.fill();
    }
    // 草丛
    const wind = W.wind * 0.35 + Math.sin(W.t * 1.3) * 0.12 * (0.5 + LV.gale);
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? css([150, 180, 96], 2, 0.8, 0.05) : css([52, 84, 40], 2, 0.9);
      ctx.lineWidth = Math.max(0.6, (pass ? 0.8 : 1.1) * s);
      ctx.beginPath();
      for (let i = pass; i < g.tufts.length; i += pass ? 2 : 1) {
        const q = g.tufts[i], p = FP(q[0], q[1]);
        const hh = (4 + 3 * q[2]) * s, sw = (wind + q[3]) * hh * 0.5;
        ctx.moveTo(p[0] - 1.5 * s, p[1]); ctx.quadraticCurveTo(p[0] - 1.2 * s, p[1] - hh * 0.5, p[0] - 2.5 * s + sw, p[1] - hh);
        ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(p[0] + 0.3 * s, p[1] - hh * 0.6, p[0] + sw * 1.2, p[1] - hh * 1.15);
        ctx.moveTo(p[0] + 1.5 * s, p[1]); ctx.quadraticCurveTo(p[0] + 1.6 * s, p[1] - hh * 0.5, p[0] + 2.6 * s + sw, p[1] - hh * 0.85);
      }
      ctx.stroke();
    }
    // 花（随 bloom 多起来）
    const FLW = [[244, 211, 94], [232, 106, 146], [246, 241, 231], [154, 127, 224]];
    const nf = Math.floor(g.flowers.length * clamp(0.2 + 0.8 * LV.bloom, 0, 1));
    for (let c = 0; c < 4; c++) {
      ctx.fillStyle = css(FLW[c], 2, 0.95, 0.1);
      ctx.beginPath();
      for (let i = 0; i < nf; i++) {
        const q = g.flowers[i];
        if (q[2] !== c) continue;
        const p = FP(q[0], q[1]), r0 = (0.9 + 0.8 * q[3]) * s;
        ctx.moveTo(p[0] + r0, p[1] - 2 * s); ctx.arc(p[0], p[1] - 2 * s, r0, 0, TAU);
      }
      ctx.fill();
    }
    // 山脊上的草叶与迎光的边
    ctx.strokeStyle = css([80, 116, 56], 2);
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    for (let i = 1; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1];
      for (let k = 0; k < 3; k++) {
        const t = k / 3, x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t);
        if (y > a[2] - 2) continue;
        const hh = (3 + 2.5 * Math.abs(Math.sin(i * 3.1 + k * 1.7))) * s, sw = wind * hh * 0.6;
        ctx.moveTo(x, y + 0.5); ctx.lineTo(x + sw + (k - 1) * 0.6 * s, y - hh);
      }
    }
    ctx.stroke();
    const rimA = (0.22 + 0.4 * W.daylight) * (1 - LV.storm * 0.6);
    ctx.strokeStyle = css([255, 244, 222], 2, rimA, 0.25);
    ctx.lineWidth = Math.max(0.8, 1.3 * s);
    ctx.beginPath();
    let on = false;
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (p[1] > p[2] - 1) { on = false; continue; }
      const nx = i < P.length - 1 ? P[i + 1] : p, pv = i > 0 ? P[i - 1] : p;
      const slope = (nx[1] - pv[1]);
      const lit = (lx < p[0]) ? slope >= -0.5 : slope <= 0.5;
      if (!lit && Math.abs(slope) > 2) { on = false; continue; }
      if (!on) { ctx.moveTo(p[0], p[1]); on = true; } else ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
  }

  // 山上的几棵树（笃耨香、橡树：圆顶的深绿冠）
  const TREES = [[0.36, 0.0, 1.0, 11], [0.86, 0.06, 0.78, 29], [-0.56, 0.03, 0.66, 47]];
  function drawTrees(ctx, g) {
    const s = g.s * (port() ? 0.9 : 1), lx = litX();
    const sway = W.wind * 0.02 + Math.sin(W.t * 0.9) * 0.01 * (0.5 + LV.gale * 1.5);
    for (const t of TREES) {
      const p = FP(t[0], t[1]), H = 40 * s * t[2];
      const x = p[0], y = p[1] + 2 * s, r = U.mulberry32(t[3]);
      ctx.fillStyle = css([70, 56, 44], 2);
      ctx.beginPath();
      ctx.moveTo(x - 0.06 * H, y); ctx.quadraticCurveTo(x - 0.02 * H, y - 0.3 * H, x - 0.03 * H, y - 0.5 * H);
      ctx.lineTo(x + 0.04 * H, y - 0.5 * H); ctx.quadraticCurveTo(x + 0.03 * H, y - 0.25 * H, x + 0.07 * H, y);
      ctx.closePath(); ctx.fill();
      const blobs = [];
      for (let i = 0; i < 7; i++) blobs.push([(r() - 0.5) * 0.7, -0.62 - r() * 0.3, 0.16 + r() * 0.12]);
      ctx.fillStyle = css([54, 84, 50], 2);
      ctx.beginPath();
      for (const b of blobs) { const cx = x + b[0] * H + sway * H * (-b[1]), cy = y + b[1] * H; ctx.moveTo(cx + b[2] * H, cy); ctx.ellipse(cx, cy, b[2] * H, b[2] * H * 0.8, 0, 0, TAU); }
      ctx.fill();
      const d = lx >= x ? 1 : -1;
      ctx.fillStyle = css([112, 146, 88], 2, 0.55 * dayA(), 0.08);
      ctx.beginPath();
      for (let i = 0; i < blobs.length; i += 2) {
        const b = blobs[i], cx = x + b[0] * H + sway * H * (-b[1]) + d * b[2] * H * 0.3, cy = y + b[1] * H - b[2] * H * 0.3;
        ctx.moveTo(cx + b[2] * H * 0.55, cy); ctx.ellipse(cx, cy, b[2] * H * 0.55, b[2] * H * 0.4, 0, 0, TAU);
      }
      ctx.fill();
    }
  }

  // 好树（无花果树）与荆棘（7:16–17）
  function drawGoodTree(ctx, g) {
    const sp = spots(), s = g.s * (port() ? 0.95 : 1), lx = litX();
    const f = LV.srFruit;
    {
      const p = FP(sp.tree[0], sp.tree[1]), H = 60 * s, x = p[0], y = p[1] + 1.5 * s;
      const sway = W.wind * 0.018 * H + Math.sin(W.t * 1.1) * 0.01 * H * (0.5 + LV.gale * 1.5);
      // 干与枝（灰白的无花果树皮）
      ctx.strokeStyle = css([120, 110, 100], 2); ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(1.4, 0.075 * H);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 0.03 * H, y - 0.25 * H, x, y - 0.42 * H); ctx.stroke();
      const BR = [[-0.34, -0.8], [-0.14, -0.94], [0.1, -0.96], [0.32, -0.82], [-0.44, -0.6], [0.44, -0.62]];
      ctx.lineWidth = Math.max(0.9, 0.034 * H);
      ctx.beginPath();
      for (const q of BR) { ctx.moveTo(x, y - 0.4 * H); ctx.quadraticCurveTo(x + q[0] * 0.4 * H, y - 0.62 * H, x + q[0] * H + sway * (-q[1]), y + q[1] * H); }
      ctx.stroke();
      ctx.lineCap = 'butt';
      // 叶（大而有裂的叶，成团）
      const lk = sstep(f / 0.45);
      if (lk > 0.01) {
        const r = U.mulberry32(404), L = [];
        for (let i = 0; i < 16; i++) L.push([(r() - 0.5) * 0.95, -0.55 - r() * 0.46, 0.1 + r() * 0.07]);
        ctx.fillStyle = css([62, 106, 52], 2);
        ctx.beginPath();
        for (const q of L) { const rr = q[2] * H * lk, cx = x + q[0] * H + sway * (-q[1]), cy = y + q[1] * H; ctx.moveTo(cx + rr, cy); ctx.ellipse(cx, cy, rr, rr * 0.78, 0, 0, TAU); }
        ctx.fill();
        const d = lx >= x ? 1 : -1;
        ctx.fillStyle = css([128, 172, 96], 2, 0.6 * dayA(), 0.08);
        ctx.beginPath();
        for (let i = 0; i < L.length; i += 2) { const q = L[i], rr = q[2] * H * lk * 0.55, cx = x + q[0] * H + sway * (-q[1]) + d * rr * 0.5, cy = y + q[1] * H - rr * 0.4; ctx.moveTo(cx + rr, cy); ctx.ellipse(cx, cy, rr, rr * 0.7, 0, 0, TAU); }
        ctx.fill();
        // 果子：先青后紫，渐渐饱满
        const fk = sstep((f - 0.55) / 0.4);
        if (fk > 0.01) {
          const r2 = U.mulberry32(505);
          const col = mix([128, 158, 84], [118, 46, 92], sstep((f - 0.7) / 0.3));
          ctx.fillStyle = css(col, 2, 1, 0.08);
          ctx.beginPath();
          for (let i = 0; i < 14; i++) {
            const q = L[i % L.length], cx = x + (q[0] + (r2() - 0.5) * 0.12) * H + sway * (-q[1]), cy = y + (q[1] + 0.02 + r2() * 0.08) * H, rr = (1.6 + r2()) * s * fk;
            ctx.moveTo(cx + rr, cy); ctx.ellipse(cx, cy, rr, rr * 1.15, 0, 0, TAU);
          }
          ctx.fill();
          if (f > 0.85 && W.daylight > 0.2) {
            ctx.fillStyle = css([255, 236, 220], 2, 0.5 * (f - 0.85) / 0.15 * dayA(), 0.2);
            ctx.beginPath();
            for (let i = 0; i < 14; i += 2) { const q = L[i % L.length], cx = x + q[0] * H + sway * (-q[1]) - 0.4 * s, cy = y + (q[1] + 0.05) * H - 0.6 * s; ctx.moveTo(cx + 0.6 * s, cy); ctx.arc(cx, cy, 0.6 * s, 0, TAU); }
            ctx.fill();
          }
        }
      }
      if (f > 0.02 && f < 0.999 && SP) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, x, y - 0.7 * H, H * 0.9, 0.18 * Math.sin(Math.PI * f));
        ctx.restore(); ctx.globalAlpha = 1;
      }
    }
    // 荆棘：灰褐、纠结、有刺，一直如此
    {
      const p = FP(sp.thorn[0], sp.thorn[1]), H = 17 * s, x = p[0], y = p[1] + 1 * s;
      const r = U.mulberry32(77);
      ctx.strokeStyle = css([96, 80, 64], 2);
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath();
      for (let i = 0; i < 11; i++) {
        const a = -Math.PI / 2 + (r() - 0.5) * 2.2, l = H * (0.5 + r() * 0.6);
        const ex = x + Math.cos(a) * l * 1.3, ey = y + Math.sin(a) * l;
        ctx.moveTo(x + (r() - 0.5) * 3 * s, y); ctx.quadraticCurveTo(x + Math.cos(a) * l * 0.4, y + Math.sin(a) * l * 0.7, ex, ey);
        for (let k = 1; k <= 2; k++) { const tx = lerp(x, ex, k / 3), ty = lerp(y, ey, k / 3); ctx.moveTo(tx, ty); ctx.lineTo(tx + 1.8 * s * (r() - 0.5), ty - 1.6 * s); }
      }
      ctx.stroke();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：野地里的百合花（6:28）——自灵所在之处开遍山坡与山前
  // ════════════════════════════════════════════════════════════
  let lily = null;
  function lilyModel() {
    if (lily) return lily;
    const r = U.mulberry32(9127), L = [], n = port() ? 54 : 96;
    for (let i = 0; i < n; i++) {
      const u = -1.3 + r() * 2.35, d = 0.1 + r() * 1.55;
      if (d < 0.25 && Math.abs(u) < 0.34) continue;           // 耶稣与门徒坐处
      L.push({ u, d, kind: r() < 0.5 ? 0 : r() < 0.55 ? 1 : 2, s: 0.8 + r() * 0.45, ph: r() * TAU, lean: (r() - 0.5) * 0.3 });
    }
    L.sort((a, b) => a.d - b.d);
    return (lily = L);
  }
  const LILY_C = [[214, 40, 54], [248, 244, 234], [150, 108, 196]];
  // 花开到的远近：按灵所在之处到最远一朵的距离放大，好叫整片野地（连最远的一边）都开遍
  let lilyReach = null;
  function lilyR(o) {
    const key = o[0].toFixed(3) + ',' + o[1].toFixed(3) + ':' + (port() ? 1 : 0) + ':' + (lily ? lily.length : 0);
    if (lilyReach && lilyReach.key === key) return lilyReach.R;
    let far = 0;
    for (const q of lilyModel()) far = Math.max(far, Math.hypot(q.u - o[0], (q.d - o[1]) * 0.7));
    lilyReach = { key, R: Math.max(2.3, far + 0.5) };
    return lilyReach.R;
  }
  function lilyOpen(q) {
    const o = S.lily || [0.3, 0.6];
    const dist = Math.hypot(q.u - o[0], (q.d - o[1]) * 0.7);
    return clamp((LV.srLily * lilyR(o) - dist) * 2.2, 0, 1);
  }
  function drawLilies(ctx, g) {
    if (LV.srLily < 0.004) return;
    const L = lilyModel(), s = g.s * (port() ? 1.05 : 1);
    const wind = W.wind * 0.3 + Math.sin(W.t * 1.6) * 0.14 * (0.5 + LV.gale);
    const span = W.landSpan ? W.landSpan(2, 0) : null, xmin = span ? span[0] / W.w + 0.03 : 0.35;
    // 茎叶一笔画完，花按颜色各一笔（不逐朵换色）
    const stem = new Path2D(), pet = [new Path2D(), new Path2D(), new Path2D()], eye = new Path2D();
    for (const q of L) {
      const k = lilyOpen(q);
      if (k < 0.01) continue;
      const xf = UX(q.u);
      if (xf < xmin || xf > 1.01) continue;
      const x = xf * W.w, y = faceY(xf, q.d), sz = s * q.s * (0.85 + 0.25 * clamp(q.d, 0, 1.4));
      const hh = (7 + 4 * q.s) * sz * sstep(k * 1.3), sw = (wind + q.lean) * hh * 0.4 + Math.sin(W.t * 2.1 + q.ph) * 0.6 * sz;
      const tx = x + sw, ty = y - hh;
      stem.moveTo(x, y); stem.quadraticCurveTo(x + sw * 0.2, y - hh * 0.5, tx, ty);
      stem.moveTo(x, y - hh * 0.25); stem.quadraticCurveTo(x - 2.2 * sz, y - hh * 0.4, x - 3 * sz + sw * 0.3, y - hh * 0.55);
      const bk = sstep((k - 0.35) / 0.65);
      if (bk < 0.02) continue;
      const P = pet[q.kind];
      if (q.kind === 0) {
        const pr = 1.9 * sz * bk;
        for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + q.ph, px = tx + Math.cos(a) * pr * 0.9, py = ty + Math.sin(a) * pr * 0.55; P.moveTo(px + pr * 0.62, py); P.ellipse(px, py, pr * 0.62, pr * 0.45, a, 0, TAU); }
        eye.moveTo(tx + 0.8 * sz * bk, ty); eye.arc(tx, ty, 0.8 * sz * bk, 0, TAU);
      } else if (q.kind === 1) {
        const pr = 2.4 * sz * bk;
        for (const a of [-2.1, -1.57, -1.04]) { const px = tx + Math.cos(a) * pr * 0.55, py = ty + Math.sin(a) * pr * 0.55; P.moveTo(px + pr * 0.55, py); P.ellipse(px, py, pr * 0.55, pr * 0.24, a, 0, TAU); }
      } else {
        const pr = 2.1 * sz * bk;
        for (const a of [-1.57, 0.5, 2.64]) { const px = tx + Math.cos(a) * pr * 0.5, py = ty + Math.sin(a) * pr * 0.42; P.moveTo(px + pr * 0.5, py); P.ellipse(px, py, pr * 0.5, pr * 0.28, a, 0, TAU); }
      }
    }
    ctx.strokeStyle = css([70, 110, 52], 2); ctx.lineWidth = Math.max(0.6, 0.85 * s);
    ctx.stroke(stem);
    for (let c = 0; c < 3; c++) { ctx.fillStyle = css(LILY_C[c], 2, 1, 0.12); ctx.fill(pet[c]); }
    ctx.fillStyle = css([34, 24, 36], 2); ctx.fill(eye);
    // 那一朵（6:29）：在耶稣身旁，比所罗门的荣华还美
    const gk = LV.srGlory;
    if (gk > 0.01) {
      const u = port() ? -0.1 : -0.08, d = port() ? 0.16 : 0.13, xf = UX(u), x = xf * W.w, y = faceY(xf, d);
      const sz = s * 2.4, hh = 12 * sz * sstep(gk * 1.4), sw = wind * hh * 0.25, tx = x + sw, ty = y - hh;
      ctx.strokeStyle = css([76, 118, 56], 2); ctx.lineWidth = Math.max(0.8, 0.9 * sz);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - hh * 0.5, tx, ty);
      ctx.moveTo(x, y - hh * 0.3); ctx.quadraticCurveTo(x + 2.5 * sz, y - hh * 0.45, x + 3.4 * sz, y - hh * 0.6);
      ctx.stroke();
      const pr = 2.6 * sz * sstep(gk);
      if (SP) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, tx, ty, pr * 6, 0.5 * gk); glowAt(ctx, SP.pale, tx, ty, pr * 2.2, 0.6 * gk); ctx.restore(); }
      ctx.fillStyle = css([252, 250, 244], 2, 1, 0.3);
      ctx.beginPath();
      for (const a of [-2.3, -1.9, -1.57, -1.24, -0.84]) { const px = tx + Math.cos(a) * pr * 0.6, py = ty + Math.sin(a) * pr * 0.6; ctx.moveTo(px + pr * 0.6, py); ctx.ellipse(px, py, pr * 0.6, pr * 0.22, a, 0, TAU); }
      ctx.fill();
      ctx.fillStyle = css([244, 200, 90], 2, 1, 0.2);
      ctx.beginPath(); ctx.arc(tx, ty - pr * 0.3, pr * 0.2, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：山脚的小屋与门（7:7），宽路（7:13），窄门与小路（7:13–14）
  // ════════════════════════════════════════════════════════════
  const BASALT = [92, 88, 86], BASALT_D = [64, 62, 62], DOOR = [96, 70, 48];
  function doorX() { return UX(spots().door); }
  function drawDoorHouse(ctx, g) {
    const s = g.s * (port() ? 1.1 : 1), xf = doorX(), x = xf * W.w, gy = gY(2, xf) + 3 * s;
    const w = 44 * s, h = 48 * s, lx = litX() >= x ? 1 : -1;
    // 屋身、背光面、屋顶的矮墙、外面的石阶
    ctx.fillStyle = css(BASALT, 2);
    ctx.fillRect(x - w / 2, gy - h, w, h + 2 * s);
    ctx.fillStyle = css(BASALT_D, 2, 0.85);
    ctx.fillRect(lx > 0 ? x - w / 2 : x + w * 0.2, gy - h, w * 0.3, h + 2 * s);
    ctx.fillStyle = css([84, 78, 74], 2);
    ctx.fillRect(x - w / 2 - 1.2 * s, gy - h - 2.4 * s, w + 2.4 * s, 2.6 * s);
    ctx.fillStyle = css([120, 110, 96], 2);
    ctx.beginPath();
    const sx = x + w / 2;
    for (let i = 0; i < 5; i++) ctx.rect(sx + i * 2.2 * s, gy - h + i * h / 5, (11 - i * 2.2) * s * 0.9, h / 5 + 1);
    ctx.fill();
    // 石缝
    ctx.strokeStyle = css([60, 56, 54], 2, 0.35); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let i = 1; i < 5; i++) { const yy = gy - h * i / 5; ctx.moveTo(x - w / 2, yy); ctx.lineTo(x + w / 2, yy); }
    ctx.stroke();
    // 窗（楼上一个，楼下一个）
    const wx = x - w * 0.28, wy = gy - h * 0.78, ws = 4.2 * s;
    ctx.fillStyle = css([30, 24, 22], 2);
    ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.2);
    ctx.fillRect(x + w * 0.3 - ws / 2, gy - h * 0.8, ws, ws * 1.2);
    // 屋顶上搭的小棚（枝叶）
    ctx.strokeStyle = css([96, 82, 60], 2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, gy - h - 2.4 * s); ctx.lineTo(x - w * 0.42, gy - h - 10 * s); ctx.lineTo(x - w * 0.05, gy - h - 10 * s); ctx.lineTo(x - w * 0.05, gy - h - 2.4 * s);
    ctx.stroke();
    ctx.fillStyle = css([88, 112, 64], 2, 0.9);
    ctx.beginPath(); ctx.ellipse(x - w * 0.235, gy - h - 10.5 * s, w * 0.22, 2.2 * s, 0, 0, TAU); ctx.fill();
    // 门：开时向里转去，门洞里是暖光与灯台（5:15 放在灯台上，就照亮一家的人）
    const dw = 13 * s, dh = 31 * s, dx = x + w * 0.06, open = LV.srDoor;   // 门与人相称（约人高的八成）
    const lamp = Math.max(LV.srLamps, nightK() * 0.6), fl = 0.9 + 0.1 * Math.sin(W.t * 7.3) * Math.sin(W.t * 3.1);
    const inner = Math.max(open, lamp * 0.35);
    ctx.fillStyle = css([26, 20, 18], 2);
    ctx.fillRect(dx - dw / 2, gy - dh, dw, dh);
    if (inner > 0.01 && SP) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, inner) * 0.9 * fl;
      ctx.fillStyle = 'rgb(255,188,104)';
      ctx.fillRect(dx - dw / 2, gy - dh, dw, dh);
      // 灯台
      ctx.globalAlpha = 1;
      ctx.restore();
      ctx.fillStyle = css([150, 110, 60], 2, Math.min(1, inner) * 0.9);
      ctx.fillRect(dx - 0.5 * s, gy - dh * 0.62, 1 * s, dh * 0.62);
      ctx.fillRect(dx - 2.2 * s, gy - dh * 0.64, 4.4 * s, 1 * s);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.lamp, dx, gy - dh * 0.68, 5 * s, Math.min(1, inner) * fl);
      glowAt(ctx, SP.warm, dx, gy - dh * 0.4, 22 * s, inner * (0.25 + 0.35 * nightK()) * fl);
      // 门前地上的一片光；门开了，暖光漫到墙上，一扇光铺到门前的地上
      ctx.globalAlpha = Math.min(1, open * (0.35 + 0.3 * nightK()));
      ctx.drawImage(SP.warm, dx - 20 * s, gy - 3 * s, 40 * s, 10 * s);
      if (open > 0.01) {
        glowAt(ctx, SP.warm, dx, gy - dh * 0.55, 40 * s, open * (0.4 + 0.25 * nightK()) * fl);
        for (const [ang, a, wd] of [[Math.PI * 0.36, 0.34, 20], [Math.PI * 0.5, 0.42, 26], [Math.PI * 0.64, 0.34, 20]]) beamAt(ctx, SP.beamW, dx, gy - dh * 0.2, ang, 34 * s, wd * s, a * open * fl);
        ctx.globalAlpha = Math.min(1, open * 0.5);
        ctx.drawImage(SP.warm, dx - 34 * s, gy - 2 * s, 68 * s, 20 * s);
      }
      ctx.restore();
    }
    // 门扇：自左边的门轴转开
    const pw = dw * (1 - 0.8 * open);
    ctx.fillStyle = css(DOOR, 2);
    ctx.fillRect(dx - dw / 2, gy - dh, pw, dh);
    ctx.fillStyle = css([140, 106, 72], 2, 0.6 * dayA());
    ctx.fillRect(dx - dw / 2 + pw - 0.9 * s, gy - dh, 0.9 * s, dh);
    // 窗里的灯
    if (lamp > 0.02 && SP) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = lamp * 0.85 * fl; ctx.fillStyle = 'rgb(255,190,110)';
      ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.2);
      glowAt(ctx, SP.warm, wx, wy + ws * 0.6, 12 * s, lamp * (0.25 + 0.35 * nightK()) * fl);
      ctx.restore();
    }
    // 迎光的边
    ctx.fillStyle = css([236, 222, 196], 2, 0.35 * dayA(), 0.2);
    ctx.fillRect(lx > 0 ? x + w / 2 - 1.2 * s : x - w / 2, gy - h - 2 * s, 1.2 * s, h);
    ctx.globalAlpha = 1;
  }
  // 宽路：山前一条尘土飞扬的大路，通向右边的尘雾（7:13）
  function drawRoad(ctx, g) {
    const k = 0.35 + 0.65 * LV.srRoad;
    const span = W.landSpan ? W.landSpan(2, 0) : null, x0 = span ? span[0] / W.w + 0.08 : 0.45;
    const d0 = port() ? 1.72 : 1.66, d1 = port() ? 1.94 : 1.9;
    ctx.beginPath();
    const pts = [];
    for (let xf = x0; xf <= 1.02; xf += 0.02) pts.push(xf);
    pts.forEach((xf, i) => { const y = faceY(xf, d0 + Math.sin(xf * 9) * 0.03); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); });
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i] * W.w, faceY(pts[i], d1 + Math.sin(pts[i] * 9) * 0.03));
    ctx.closePath();
    const gr = ctx.createLinearGradient(x0 * W.w, 0, W.w, 0);
    gr.addColorStop(0, css([188, 166, 128], 2, 0)); gr.addColorStop(0.12, css([188, 166, 128], 2, 0.42 * k));
    gr.addColorStop(1, css([196, 176, 140], 2, 0.5 * k));
    ctx.fillStyle = gr; ctx.fill();
    // 路尽头的尘雾（引到灭亡：人走进去就看不见了）
    if (LV.srRoad > 0.02 && SP) {
      const y = faceY(0.98, (d0 + d1) / 2);
      ctx.globalAlpha = 0.5 * LV.srRoad;
      const hz = ctx.createLinearGradient(W.w * 0.82, 0, W.w, 0);
      hz.addColorStop(0, 'rgba(150,140,128,0)'); hz.addColorStop(1, 'rgba(120,114,108,0.85)');
      ctx.fillStyle = hz;
      ctx.fillRect(W.w * 0.82, y - 70 * g.s, W.w * 0.18 + 2, 90 * g.s);
      ctx.globalAlpha = 1;
    }
  }
  function drawGate(ctx, g) {
    const kg = LV.srGate;
    const s = g.s * (port() ? 1.1 : 1), sp = spots();
    // 小路：一条细细的光，自窄门折上山去
    const kp = LV.srPath;
    if (kp > 0.004 && SP) {
      const P = pathPts().map(q => FP(q[0], q[1]));
      let tot = 0; const seg = [];
      for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); tot += l; }
      let left = tot * clamp(kp, 0, 1);
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (let pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = pass ? 'rgba(255,250,230,0.9)' : css([255, 226, 160], 2, 0.4, 0.4);
        ctx.lineWidth = (pass ? 1.3 : 4.2) * s;
        ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
        let rem = left;
        for (let i = 1; i < P.length && rem > 0; i++) {
          const l = seg[i - 1], t = Math.min(1, rem / l);
          ctx.lineTo(lerp(P[i - 1][0], P[i][0], t), lerp(P[i - 1][1], P[i][1], t));
          rem -= l;
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter';
      let rem = left;
      for (let i = 1; i < P.length && rem > 0; i++) { const l = seg[i - 1], t = Math.min(1, rem / l); glowAt(ctx, SP.gold, lerp(P[i - 1][0], P[i][0], t), lerp(P[i - 1][1], P[i][1], t), 9 * s, 0.35 * kp); rem -= l; }
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    if (kg < 0.004) return;
    const p = FP(sp.gate[0], sp.gate[1]), x = p[0], y = p[1] + 1.5 * s;
    const H = 40 * s * sstep(kg * 1.2), gap = 6 * s, pw = 4.6 * s;
    ctx.globalAlpha = Math.min(1, kg * 1.4);
    if (SP) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, x, y - H * 0.5, H * 1.1, 0.35 * kg); ctx.restore(); ctx.globalAlpha = Math.min(1, kg * 1.4); }
    ctx.fillStyle = css([150, 138, 120], 2);
    ctx.fillRect(x - gap / 2 - pw, y - H, pw, H);
    ctx.fillRect(x + gap / 2, y - H, pw, H);
    ctx.fillRect(x - gap / 2 - pw - 1.2 * s, y - H - 2.6 * s, gap + 2 * pw + 2.4 * s, 2.8 * s);
    ctx.fillStyle = css([230, 214, 180], 2, 0.5 * dayA(), 0.2);
    ctx.fillRect(x - gap / 2 - pw, y - H, 1 * s, H);
    ctx.fillRect(x + gap / 2, y - H, 1 * s, H);
    // 门里的光
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,236,190,' + (0.55 * kg).toFixed(3) + ')';
    ctx.fillRect(x - gap / 2, y - H, gap, H);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：中丘岸上的迦百农、比喻里的两座房子、船
  // ════════════════════════════════════════════════════════════
  const VIL = [[-0.46, 0.8, 1.0, 1], [-0.3, 1.0, 0.8, 0], [-0.16, 0.9, 1.15, 1], [0.0, 1.5, 1.35, 2], [0.18, 0.85, 0.95, 1], [0.32, 1.0, 0.75, 0], [0.46, 0.8, 1.05, 1]];
  function villageX() { return port() ? 0.7 : 0.7; }
  function drawVillage(ctx) {
    const l = 1, s = LS(l) * (port() ? 1.25 : 1), cx = villageX(), U0 = 60 * s, lx = litX();
    const lamp = Math.max(LV.srLamps, nightK() * 0.8), fl = 0.9 + 0.1 * Math.sin(W.t * 5.1);
    const wins = [];
    for (const h of VIL) {
      const x = cx * W.w + h[0] * U0, xf = x / W.w, g = gY(l, xf) + 2 * s;
      const ww = 16 * s * h[1], hh = 13 * s * h[2];
      const syn = h[3] === 2;
      const body = syn ? [210, 198, 176] : BASALT, side = syn ? [168, 156, 136] : BASALT_D;
      ctx.fillStyle = css(body, l);
      ctx.fillRect(x - ww / 2, g - hh, ww, hh + 2 * s);
      ctx.fillStyle = css(side, l, 0.85);
      ctx.fillRect(lx >= x ? x - ww / 2 : x + ww * 0.2, g - hh, ww * 0.3, hh + 2 * s);
      ctx.fillStyle = css(syn ? [150, 140, 122] : [76, 70, 66], l);
      ctx.fillRect(x - ww / 2 - 0.6 * s, g - hh - 1.4 * s, ww + 1.2 * s, 1.6 * s);
      if (syn) {
        // 会堂：白石的柱廊
        ctx.fillStyle = css([236, 228, 210], l, 0.9, 0.1);
        for (let i = 0; i < 5; i++) ctx.fillRect(x - ww * 0.4 + i * ww * 0.2 - 0.6 * s, g - hh * 0.75, 1.2 * s, hh * 0.75);
        ctx.fillStyle = css([188, 176, 154], l);
        ctx.beginPath(); ctx.moveTo(x - ww / 2 - s, g - hh - 1.3 * s); ctx.lineTo(x, g - hh - 5 * s); ctx.lineTo(x + ww / 2 + s, g - hh - 1.3 * s); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = css([28, 24, 22], l);
        const wx = x + (h[0] > 0 ? -1 : 1) * ww * 0.18, wy = g - hh * 0.62;
        ctx.fillRect(wx - 1.3 * s, wy, 2.6 * s, 3.2 * s);
        wins.push([wx, wy + 1.6 * s]);
      }
      ctx.fillStyle = css([236, 222, 196], l, 0.35 * dayA(), 0.2);
      ctx.fillRect(lx >= x ? x + ww / 2 - 0.8 * s : x - ww / 2, g - hh - 1.4 * s, 0.8 * s, hh);
    }
    if (lamp > 0.02 && SP) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < wins.length; i++) {
        const w = wins[i], a = lamp * clamp(1.4 - i * 0.12, 0, 1) * fl;
        ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = 'rgb(255,190,110)';
        ctx.fillRect(w[0] - 1.3 * s, w[1] - 1.6 * s, 2.6 * s, 3.2 * s);
        glowAt(ctx, SP.warm, w[0], w[1], 9 * s, a * (0.3 + 0.4 * nightK()));
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  // 比喻里的两座房子：近岸海边的沙土上一座、旁边的磐石上一座（7:24–27）
  const xSand = () => UX(spots().sand), xRock = () => UX(spots().rock);
  const houseS = () => LS(2) * (port() ? 1.15 : 1);
  const ROCK_H = 21;
  function drawShore(ctx) {
    const s = houseS(), lx = litX();
    // 沙滩：海边一片浅色的沙土
    {
      const xf = xSand(), x = xf * W.w;
      ctx.fillStyle = css([206, 186, 146], 2, 0.9);
      ctx.beginPath();
      const x0 = xf - 0.06, x1 = xf + 0.03;
      for (let i = 0; i <= 12; i++) { const t = i / 12, xx = lerp(x0, x1, t); const y = gY(2, xx) - 0.5; if (i) ctx.lineTo(xx * W.w, y); else ctx.moveTo(xx * W.w, y); }
      for (let i = 12; i >= 0; i--) { const t = i / 12, xx = lerp(x0, x1, t), g = gY(2, xx); ctx.lineTo(xx * W.w, g + (4 + 7 * Math.sin(Math.PI * t)) * s); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([232, 216, 180], 2, 0.4 * dayA(), 0.1);
      ctx.beginPath();
      for (let i = 0; i < 9; i++) { const xx = x + (i - 4) * 5 * s, y = gY(2, xx / W.w) + (2 + (i % 3)) * s; ctx.moveTo(xx + 1.2 * s, y); ctx.ellipse(xx, y, 1.2 * s, 0.5 * s, 0, 0, TAU); }
      ctx.fill();
    }
    // 磐石：一块黑色的玄武岩从地里凸起
    {
      const xf = xRock(), x = xf * W.w, g = gY(2, xf) + 3 * s;
      ctx.fillStyle = css([78, 74, 72], 2);
      ctx.beginPath();
      const R = ROCK_H;
      ctx.moveTo(x - 27 * s, g + 2 * s);
      ctx.lineTo(x - 24 * s, g - R * 0.35 * s); ctx.lineTo(x - 19 * s, g - R * 0.7 * s); ctx.lineTo(x - 15 * s, g - R * s);
      ctx.lineTo(x + 14 * s, g - (R + 0.5) * s); ctx.lineTo(x + 18 * s, g - R * 0.62 * s); ctx.lineTo(x + 24 * s, g - R * 0.3 * s);
      ctx.lineTo(x + 27 * s, g + 2 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([150, 144, 136], 2, 0.45 * dayA(), 0.1);
      ctx.beginPath(); ctx.moveTo(x - 15 * s, g - R * s); ctx.lineTo(x + 14 * s, g - (R + 0.5) * s); ctx.lineTo(x + (lx > x ? 17 : -18) * s, g - R * 0.66 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([44, 42, 42], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      ctx.moveTo(x - 20 * s, g - 4 * s); ctx.lineTo(x - 12 * s, g - R * 0.5 * s); ctx.moveTo(x + 4 * s, g - 2 * s); ctx.lineTo(x + 8 * s, g - R * 0.6 * s);
      ctx.moveTo(x - 4 * s, g - R * 0.8 * s); ctx.lineTo(x + 6 * s, g - R * 0.72 * s);
      ctx.stroke();
    }
  }
  function drawParableHouse(ctx, which) {
    const s = houseS(), rock = which === 'rock';
    const k = rock ? LV.srRock : LV.srSand;
    if (k < 0.004) return;
    const xf = rock ? xRock() : xSand(), x = xf * W.w, g = gY(2, xf) + (rock ? 3 - ROCK_H - 0.2 : 3) * s, lx = litX();
    const w = 30 * s, h = 23 * s, rows = 6, fall = rock ? 0 : LV.srFall;
    ctx.save();
    ctx.translate(x - w / 2, g);
    if (fall > 0) { const f = sstep(fall); ctx.translate(0, 0); ctx.rotate(-0.42 * f); ctx.translate(-8 * s * f, 10 * s * f); }
    const built = k * rows;
    for (let i = 0; i < rows && i < built; i++) {
      const kk = clamp(built - i, 0, 1);
      const y0 = -h * (i + 1) / rows, bh = h / rows;
      const n = 4, bw = w / n;
      for (let j = 0; j < n; j++) {
        const f = fall > 0 ? sstep((fall - 0.08 - ((j * 3 + i * 7) % 5) * 0.07) / 0.5) : 0;
        const ox = -(1.5 + j * 0.8 + i * 0.3) * f * 7 * s, oy = f * (10 + (rows - i) * 3) * s, a = kk * (1 - f);
        if (a < 0.02) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = css(rock ? [200, 184, 154] : [204, 182, 140], 2);
        ctx.fillRect(j * bw + ox + 0.25 * s, y0 + oy - (1 - kk) * 4 * s, bw - 0.5 * s, bh - 0.4 * s);
        ctx.fillStyle = css(rock ? [160, 146, 120] : [168, 146, 108], 2, 0.8);
        ctx.fillRect(j * bw + ox + 0.25 * s, y0 + oy - (1 - kk) * 4 * s + bh - 1.1 * s, bw - 0.5 * s, 0.7 * s);
      }
    }
    ctx.globalAlpha = 1;
    if (k > 0.98) {
      const a = clamp(1 - fall * 1.6, 0, 1);
      if (a > 0.01) {
        ctx.globalAlpha = a;
        ctx.fillStyle = css([128, 108, 82], 2);
        ctx.fillRect(-1.2 * s, -h - 2.2 * s, w + 2.4 * s, 2.4 * s);
        ctx.fillStyle = css([34, 26, 22], 2);
        ctx.fillRect(w * 0.56, -9 * s, 5 * s, 9 * s);
        ctx.fillStyle = css(rock ? [150, 136, 112] : [160, 138, 100], 2, 0.55);
        ctx.fillRect(lx >= x ? 0 : w * 0.72, -h, w * 0.28, h);
        ctx.fillStyle = css([34, 26, 22], 2); ctx.fillRect(w * 0.16, -h * 0.68, 3.6 * s, 4 * s);
        // 磐石上的房子：暴风雨里、黄昏时窗里一盏灯
        if (rock && SP) {
          const lamp = Math.max(LV.storm * 0.95, LV.srLamps * 0.85, nightK() * 0.7);
          if (lamp > 0.02) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = lamp; ctx.fillStyle = 'rgb(255,190,110)'; ctx.fillRect(w * 0.16, -h * 0.68, 3.6 * s, 4 * s);
            glowAt(ctx, SP.warm, w * 0.16 + 1.8 * s, -h * 0.68 + 2 * s, 16 * s, lamp * 0.5);
            ctx.globalCompositeOperation = 'source-over';
          }
        }
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  }
  // 水冲：海浪一道道涌上沙滩，漫到房子的根基（7:25–27）
  function drawSurge(ctx) {
    const k = LV.srSurge;
    if (k < 0.01) return;
    const s = houseS(), xs = xSand();
    // 沙滩的坡：自画面底边（地没入海处）到房子
    let xb = xs - 0.22;
    for (let x = xs; x > xs - 0.32; x -= 0.004) { if (gY(2, x) >= W.h - 2) { xb = x; break; } }
    const tip = xs + 0.014;
    const tongue = (r, a, lift, foam) => {
      const xr = lerp(xb, tip, clamp(r, 0, 1)), n = 22;
      if (xr <= xb + 0.002) return;
      ctx.fillStyle = 'rgba(58,92,118,' + a.toFixed(3) + ')';
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const xx = lerp(xb, xr, i / n), t = i / n;
        const y = gY(2, xx) - (lift * (1 - t * t) + 1.2) * s + Math.sin(W.t * 3.1 + i * 0.9) * 0.8 * s;
        if (i) ctx.lineTo(xx * W.w, y); else ctx.moveTo(xx * W.w, y);
      }
      for (let i = n; i >= 0; i--) { const xx = lerp(xb, xr, i / n); ctx.lineTo(xx * W.w, gY(2, xx) + 12 * s); }
      ctx.closePath(); ctx.fill();
      if (foam > 0.01) {
        ctx.strokeStyle = 'rgba(238,244,248,' + foam.toFixed(3) + ')';
        ctx.lineWidth = Math.max(0.8, 1.8 * s);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const xx = lerp(xr - 0.02, xr, i / 6), y = gY(2, xx) - (lift * 0.12 + 1.5) * s - Math.sin(Math.PI * i / 6) * 2.2 * s;
          if (i) ctx.lineTo(xx * W.w, y); else ctx.moveTo(xx * W.w, y);
        }
        ctx.stroke();
      }
    };
    tongue(0.5 * k, 0.5 * k, 7, 0);
    for (let i = 0; i < 3; i++) {
      const ph = (W.t * 0.38 + i / 3) % 1;
      const r = k * (0.42 + 0.62 * Math.sin(Math.PI * clamp(ph * 1.2, 0, 1)));
      tongue(r, 0.28 * k * (1 - ph * 0.6), 9, 0.75 * k * (1 - ph * 0.7));
    }
  }
  // 船：一只拉上了岸，两只在海上（加利利海的渔船，三角的帆）
  function boat(ctx, x, y, s, a, sail, tilt) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt || 0);
    ctx.fillStyle = W.shadeCSS([74, 56, 42], 0.3, a);
    ctx.beginPath(); ctx.moveTo(-14 * s, -3 * s); ctx.quadraticCurveTo(-10 * s, 3 * s, 0, 3 * s); ctx.quadraticCurveTo(10 * s, 3 * s, 15 * s, -4 * s); ctx.lineTo(-14 * s, -3 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS([60, 46, 34], 0.3, a); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(0, -3 * s); ctx.lineTo(0, -22 * s); ctx.stroke();
    if (sail) {
      ctx.fillStyle = W.shadeCSS([232, 224, 206], 0.3, a * 0.95, 0.1);
      ctx.beginPath(); ctx.moveTo(0.5 * s, -21 * s); ctx.lineTo(12 * s, -5 * s); ctx.lineTo(0.5 * s, -5 * s); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function drawBoats(ctx, pass) {
    const bob = Math.sin(W.t * 1.2) * 0.8, rock = LV.gale * 0.06 * Math.sin(W.t * 2.3);
    if (pass === 'seaFar') {
      const s = LS(0) * 0.9 * (port() ? 1.2 : 1);
      boat(ctx, W.w * (port() ? 0.3 : 0.24), W.horizonY + 4 + bob * 0.3, s, 0.9, true, rock);
      boat(ctx, W.w * (port() ? 0.12 : 0.36), W.horizonY + 6 + bob * 0.3, s * 0.85, 0.85, true, -rock);
    } else if (pass === 'mid') {
      const s = LS(1) * 0.8 * (port() ? 1.25 : 1), xf = port() ? 0.515 : 0.51;
      boat(ctx, xf * W.w, gY(1, xf) + 1, s, 1, false, -0.12);
    }
  }
  // 山上的城与远处山间的村庄（5:14–16）
  const FAR_LAMPS = [[0, 0.68, 0.0], [0, 0.535, 0.12], [1, 0.9, 0.24], [0, 0.76, 0.36], [0, 0.97, 0.48], [1, 0.965, 0.6], [0, 0.72, 0.72], [0, 0.84, 0.84]];
  const cityX = () => 0.6;
  function drawCity(ctx) {
    const l = 0, s = LS(l) * (port() ? 2.6 : 2.1), xf = cityX(), x = xf * W.w, g = gY(l, xf) + 1.5 * s, lx = litX();
    const r = U.mulberry32(88), hs = [];
    for (let i = 0; i < 9; i++) hs.push([(i / 8 - 0.5) * 34 + (r() - 0.5) * 3, 5 + r() * 6 * (1 - Math.abs(i / 8 - 0.5)), 5 + r() * 3]);
    hs.sort((a, b) => b[1] - a[1]);
    // 城墙
    ctx.fillStyle = css([206, 196, 176], l);
    ctx.fillRect(x - 20 * s, g - 4 * s, 40 * s, 5 * s);
    for (const h of hs) {
      ctx.fillStyle = css([214, 204, 184], l);
      ctx.fillRect(x + h[0] * s - h[2] * s / 2, g - (4 + h[1]) * s, h[2] * s, h[1] * s);
      ctx.fillStyle = css([170, 160, 142], l, 0.7);
      ctx.fillRect(lx >= x + h[0] * s ? x + h[0] * s - h[2] * s / 2 : x + h[0] * s + h[2] * s * 0.2, g - (4 + h[1]) * s, h[2] * s * 0.3, h[1] * s);
    }
    const k = Math.max(LV.srCity, nightK() * 0.4 * LV.srLamps);
    if (SP && (k > 0.01 || LV.srLamps > 0.02)) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, g - 8 * s, 34 * s * (1 + 0.3 * LV.srCity), k * (0.3 + 0.45 * nightK()) * (0.85 + 0.15 * Math.sin(W.t * 1.3)));
      const la = Math.max(LV.srLamps, LV.srCity) * (0.4 + 0.6 * nightK());
      for (let i = 0; i < hs.length; i += 2) glowAt(ctx, SP.lamp, x + hs[i][0] * s, g - (4 + hs[i][1] * 0.5) * s, 2.6 * s, la);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawFarLamps(ctx, layer) {
    const k = LV.srFar;
    if (k < 0.01 || !SP) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const a0 = 0.35 + 0.65 * nightK(), fl = 0.9 + 0.1 * Math.sin(W.t * 4.1);
    for (const q of FAR_LAMPS) {
      if (q[0] !== layer) continue;
      const a = clamp((k - q[2]) * 5, 0, 1) * a0 * fl;
      if (a < 0.01) continue;
      const s = LS(q[0]) * (port() ? 1.4 : 1), x = q[1] * W.w, y = gY(q[0], q[1]) - 3 * s;
      glowAt(ctx, SP.warm, x, y, 10 * s, a * 0.55);
      glowAt(ctx, SP.lamp, x, y, 2.4 * s, a);
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上与空中的光
  // ════════════════════════════════════════════════════════════
  // 东方发白、晨星（5:8）：海上东方的天边与高处的一颗星
  function drawDawn(ctx) {
    const k = LV.srDawn;
    if (k < 0.01 || !SP) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const hz = W.horizonY;
    const n = 1 - W.daylight * 0.8;
    ctx.globalAlpha = 0.35 * k * n;
    ctx.drawImage(SP.warm, -W.w * 0.1, hz - W.h * 0.14, W.w * 0.6, W.h * 0.2);
    const sx = W.w * (port() ? 0.2 : 0.3), sy = W.h * (port() ? 0.4 : 0.2), tw = 0.85 + 0.15 * Math.sin(W.t * 2.7);
    glowAt(ctx, SP.star, sx, sy, 9 * Math.max(0.7, W.unit) * tw, k * n);
    glowAt(ctx, SP.cool, sx, sy, 28 * Math.max(0.7, W.unit), 0.35 * k * n);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 自上而来的光（必得见神 / 主祷文）
  function drawFromAbove(ctx) {
    if (!SP) return;
    const jx = UX(0) * W.w, jy = faceY(UX(0), 0.1);
    const ks = LV.srSee;
    if (ks > 0.01) {
      // 光自高处落下，几道斜斜的光柱照在山坡上的众人身上（上淡下亮）
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const shimmer = 0.9 + 0.1 * Math.sin(W.t * 0.8), sp = mtH() * 1.25, a0 = ks * shimmer * (0.75 + 0.45 * nightK());
      for (const [dx, a, wk] of [[-0.95, 0.3, 0.8], [-0.35, 0.42, 1.1], [0.25, 0.36, 0.95], [0.85, 0.26, 0.75]]) {
        const bx = jx + dx * sp, by = faceY(bx / W.w, 0.55);
        const w = Math.min(W.w * 0.09, mtH() * 0.55) * wk, len = by + W.h * 0.05;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(-0.16);
        ctx.globalAlpha = Math.min(1, a * a0);
        ctx.drawImage(SP.colUp, -w / 2, -len, w, len);
        ctx.restore();
      }
      glowAt(ctx, SP.pale, jx, jy + mtH() * 0.4, mtH() * 1.5, 0.24 * ks);
      ctx.restore(); ctx.globalAlpha = 1;
    }
    const kp = LV.srPillar;
    if (kp > 0.01) {
      // 主祷文：光自天而降，落在山坡上跪着祷告的众人身上（「我们在天上的父」）——不是落在教导他们的那一位身上
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const P = prayFoot(), px = P[0], py = P[1];
      // 竖屏上经文在顶上：光柱自经文之下的天空里渐渐显出，不从字后面落下
      const y0 = port() ? W.h * 0.24 : -4, img = port() ? SP.colSoft : SP.col;
      const w = Math.min(W.w * 0.3, M() * 0.46, mt().hw * W.w * 1.5), shimmer = 0.92 + 0.08 * Math.sin(W.t * 1.7);
      ctx.globalAlpha = Math.min(1, 0.6 * kp * shimmer);
      ctx.drawImage(img, px - w / 2, y0, w, py + mtH() * 0.5 - y0);
      ctx.globalAlpha = Math.min(1, 0.42 * kp * shimmer);
      ctx.drawImage(img, px - w * 0.22, y0, w * 0.44, py + mtH() * 0.2 - y0);
      glowAt(ctx, SP.pale, px, py, mtH() * 1.25, 0.32 * kp);
      glowAt(ctx, SP.gold, px, py - mtH() * 0.05, mtH() * 0.55, 0.22 * kp);
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
  // 众人心里的光（5:14）：暖金色的光在每个人胸中
  //   先是他：他胸中的光最大、最亮；众人的光自他那里一圈一圈传开（随那一圈光环，由近及远地点亮）。
  //   挨在一起的人（相拥的弟兄与长者）光心减半，免得叠成一团刺眼的白。
  function drawInner(ctx) {
    const k = LV.srInner;
    if (k < 0.01 || !SP) return;
    const c = C();
    if (!c) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const a0 = k * (0.3 + 0.45 * nightK()), fl = 0.9 + 0.1 * Math.sin(W.t * 2.3);
    const J = fig('jesus'), jq = J && J._vis && J.alpha > 0.3 ? chestOf(J) : null;
    if (jq) {
      glowAt(ctx, SP.warm, jq[0], jq[1], J._h * 1.1, 0.55 * k * J.alpha * fl);
      glowAt(ctx, SP.pale, jq[0], jq[1], J._h * 0.5, 0.45 * k * J.alpha);
      glowAt(ctx, SP.lamp, jq[0], jq[1], J._h * 0.16, 0.9 * k * J.alpha);
    }
    // 光自他传开的半径（匀速，由近及远）
    const R = clamp(LV.srSpread, 0, 1) * Math.max(M() * 0.62, mtH() * 2.6), edge = M() * 0.05;
    const done = [];
    const one = p => {
      if (!p._vis || p.alpha < 0.3 || p.isAnimal || p.layer !== 2 || p.id === 'jesus') return;
      const q = chestOf(p);
      if (!q) return;
      const sp = jq ? clamp((R - Math.hypot(q[0] - jq[0], q[1] - jq[1])) / edge, 0, 1) : 1;
      if (sp < 0.01) return;
      const near = p._h * 0.45;
      let crowded = false;
      for (const d of done) if (Math.hypot(d[0] - q[0], d[1] - q[1]) < near) { crowded = true; break; }
      done.push(q);
      const a = a0 * p.alpha * sp;
      glowAt(ctx, SP.warm, q[0], q[1], p._h * 0.62, a * fl * (crowded ? 0.38 : 1));
      glowAt(ctx, SP.lamp, q[0], q[1], p._h * 0.1, a * 0.9 * (crowded ? 0.3 : 1));
    };
    for (const p of c.people.values()) one(p);
    for (const g of c.crowds.values()) for (const m of g.members) one(m);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 他胸中的光（glow 0.42–0.5）：人的内光在白昼里几乎看不出，这里在他身后添一团柔和的暖光，好叫众人所向的那一位看得出来
  function drawJesusAura(ctx) {
    // 近景这一层在人物之前画（人物模块在画"中景"时已把近处的人标作不可见）：用上一帧量好的位置
    const p = fig('jesus');
    if (!p || p.alpha < 0.3 || !SP || !isFinite(p._x) || !isFinite(p._y) || !(p._h > 0) || p.dying) return;
    const gk = clamp(((p.glow || 0) - 0.26) / 0.16, 0, 1);
    if (gk < 0.01) return;
    const q = [p._x, p._y - p._h * (LOWP[p.pose] ? 0.36 : 0.62)];
    const fl = 0.94 + 0.06 * Math.sin(W.t * 1.9);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const a = gk * p.alpha * fl * (1 - 0.6 * LV.srInner);
    glowAt(ctx, SP.warm, q[0], q[1], p._h * 1.1, a * (0.46 + 0.24 * nightK()));
    glowAt(ctx, SP.pale, q[0], q[1], p._h * 0.5, a * (0.3 + 0.1 * nightK()));
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 主祷文的光落下之处：山坡中间，跪着祷告的众人当中
  function prayFoot() { return FP(port() ? 0.14 : 0.1, 0.55); }
  // 日出的金光扫过全地（5:45）：照好人，也照歹人
  function drawSunFront(ctx) {
    const k = LV.srSun;
    if (k < 0.004 || k > 0.996) return;
    const x = lerp(-0.2, 1.2, k) * W.w, w = W.w * 0.28, a = 0.3 * Math.sin(Math.PI * k);
    const y0 = W.horizonY - W.h * 0.02;
    const gr = ctx.createLinearGradient(x - w, 0, x + w, 0);
    gr.addColorStop(0, 'rgba(255,200,120,0)'); gr.addColorStop(0.5, 'rgba(255,214,140,' + a.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gr; ctx.fillRect(x - w, y0, 2 * w, W.h - y0);
    ctx.restore();
  }
  // 暗中的施舍：一缕光自乞丐手中升到天上（6:4）
  function drawGive(ctx) {
    const k = LV.srGive;
    if (k < 0.01 || !SP) return;
    const p = fig('beggar');
    const q = p ? bodyAt(p, 0.3) : null;
    if (!q) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const top = Math.max(W.h * 0.12, q[1] - W.h * 0.55), rise = clamp(k * 1.25, 0, 1), y0 = lerp(q[1], top, rise), w = 22 * LS(2) * (port() ? 1.3 : 1);
    ctx.globalAlpha = 0.6 * k;
    ctx.drawImage(SP.colUp, q[0] - w / 2, y0, w, q[1] - y0 + 4);
    glowAt(ctx, SP.gold, q[0], q[1], 12 * LS(2), 0.7 * k);
    if (k > 0.5) glowAt(ctx, SP.star, q[0], top - 6, 10 * Math.max(0.7, W.unit), (k - 0.5) * 1.8 * (0.8 + 0.2 * Math.sin(W.t * 3)));
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 雨后的金光（7:28）
  function drawGold(ctx) {
    const k = LV.srGold;
    if (k < 0.01 || !SP) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const sx = W.w * 1.02, sy = W.h * 0.35;
    for (const [ang, a, wd] of [[Math.PI * 0.92, 0.12, 0.3], [Math.PI * 0.97, 0.16, 0.36], [Math.PI * 1.03, 0.1, 0.26]]) beamAt(ctx, SP.beamW, sx, sy, ang, W.w * 0.9, W.h * wd, a * k);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 饼：在手里、在碗里
  function drawBread(ctx) {
    const s = LS(2);
    // 叩门得来的饼：自家主手里到父亲、到儿子，一路带着一点暖光（7:9–11）
    const halo = (x, y, r) => {
      const a = 0.5 * clamp((LV.srDoor - 0.35) / 0.6, 0, 1);
      if (a < 0.02 || !SP) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, x, y, r * 4.2, a); glowAt(ctx, SP.pale, x, y, r * 1.8, a * 0.6);
      ctx.restore(); ctx.globalAlpha = 1;
    };
    const loaf = (x, y, r) => {
      ctx.fillStyle = css([196, 146, 84], 2, 1, 0.12);
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.62, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([236, 196, 130], 2, 0.7 * dayA(), 0.2);
      ctx.beginPath(); ctx.ellipse(x - r * 0.2, y - r * 0.2, r * 0.5, r * 0.25, 0, 0, TAU); ctx.fill();
    };
    if (S.alms) { const b = fig('beggar'); if (b && b._vis) { const q = [b._x + (b.fd >= 0 ? 1 : -1) * b._h * 0.16, b._y - b._h * (b.pose === 'raise' ? 0.95 : 0.22)]; loaf(q[0], q[1], 2.6 * s * (port() ? 1.2 : 1)); } }
    if (S.bread) {
      const b = fig(S.bread);
      if (b && b._vis) {
        const hi = b.pose === 'raise' ? 0.97 : b.pose === 'carry' ? 0.56 : LOWP[b.pose] ? 0.3 : 0.5;
        const q = [b._x + (b.fd >= 0 ? 1 : -1) * b._h * (b.pose === 'raise' ? 0.08 : 0.2), b._y - b._h * hi];
        halo(q[0], q[1], 2.8 * s * (port() ? 1.2 : 1));
        loaf(q[0], q[1], 2.8 * s * (port() ? 1.2 : 1));
      }
    }
    if (S.host) {
      const h = fig('host');
      if (h && h._vis && h.alpha > 0.3 && !S.bread) {
        const x = h._x + (h.fd >= 0 ? 1 : -1) * h._h * 0.2, y = h._y - h._h * 0.56, r = 2.8 * s * (port() ? 1.2 : 1);
        halo(x, y, r); loaf(x, y, r);
      }
    }
    // 摘下的果子（7:17）
    if (S.fruit) {
      for (const id of ['mourner', 'comforter']) {
        const b = fig(id);
        if (!b || !b._vis || b.pose !== 'carry') continue;
        ctx.fillStyle = css([118, 46, 92], 2, 1, 0.1);
        const x = b._x + (b.fd >= 0 ? 1 : -1) * b._h * 0.2, y = b._y - b._h * 0.56, r = 1.8 * s;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x + r * 1.6, y + r * 0.3, r, 0, TAU); ctx.fill();
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  本幕的微光（只是装饰，不属世界的状态）：圆而柔的光点，白昼里也不成方块
  // ════════════════════════════════════════════════════════════
  const PT = [];
  const TINT = new Map();
  function tint(rgb) {
    const key = rgb.join(',');
    let c = TINT.get(key);
    if (c) return c;
    try {
      const n = 32; c = document.createElement('canvas'); c.width = c.height = n;
      const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      gr.addColorStop(0, 'rgba(255,255,250,1)'); gr.addColorStop(0.22, rgba(rgb, 0.85)); gr.addColorStop(0.55, rgba(rgb, 0.22)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, n, n);
    } catch (e) { c = null; }
    TINT.set(key, c);
    return c;
  }
  function addPt(p) { if (PT.length > 700) PT.shift(); p.t = 0; p.img = tint(p.c); PT.push(p); }
  const rnd = (a, b) => a + Math.random() * (b - a);
  // 自一点迸出、缓缓飘散的光点
  function sparks(x, y, n, rgb, spread) {
    const k = Math.max(0.7, W.unit);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, sp = rnd(8, 60) * k;
      addPt({ x: x + rnd(-1, 1) * (spread || 6), y: y + rnd(-1, 1) * (spread || 6), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 16 * k, grav: 0, drag: 2,
        max: rnd(0.9, 2), r: rnd(2.2, 4.2) * k, c: rgb, tw: true });
    }
  }
  // 扬起的尘土（倒塌时）
  function dustPuff(x, y, n, rgb, spread) {
    const k = Math.max(0.7, W.unit);
    for (let i = 0; i < n; i++) addPt({ x: x + rnd(-1, 1) * spread, y: y + rnd(-3, 3), vx: rnd(-30, 20) * k, vy: rnd(-50, -10) * k, grav: 20 * k, drag: 1.6,
      max: rnd(0.9, 2.2), r: rnd(3, 6) * k, c: rgb, a: 0.55 });
  }
  function updatePts(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.t += dt;
      if (p.t >= p.max) { PT.splice(i, 1); continue; }
      const k = Math.exp(-(p.drag || 0) * dt);
      p.vx *= k; p.vy = p.vy * k + (p.grav || 0) * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  function drawPts(ctx) {
    if (!PT.length) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of PT) {
      if (p.delay > 0 || !p.img) continue;
      const f = p.t / p.max;
      let a = Math.min(1, f * 8) * (1 - f) * (p.a || 1);
      if (p.tw) a *= 0.65 + 0.35 * Math.sin(W.t * 11 + p.x * 0.3);
      if (a < 0.01) continue;
      ctx.globalAlpha = Math.min(1, a);
      if (p.streak) {
        // 雨点：顺着落下的方向拉长的一道
        const len = p.r * 3.2;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx) - Math.PI / 2);
        ctx.drawImage(p.img, -p.r * 0.5, -len, p.r, len * 2);
        ctx.restore();
      } else ctx.drawImage(p.img, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的总调度
  // ════════════════════════════════════════════════════════════
  function drawUnder(ctx, pass) {
    if (!isCur()) return;
    sprites();
    const g = layout();
    if (pass === 'sky') { U.safe('sermon.dawn', () => drawDawn(ctx)); return; }
    if (pass === 'seaFar') { U.safe('sermon.boats', () => drawBoats(ctx, 'seaFar')); return; }
    if (pass === 'far') { U.safe('sermon.city', () => drawCity(ctx)); U.safe('sermon.farL', () => drawFarLamps(ctx, 0)); return; }
    if (pass === 'mid') {
      U.safe('sermon.village', () => drawVillage(ctx));
      U.safe('sermon.boatM', () => drawBoats(ctx, 'mid'));
      U.safe('sermon.midL', () => drawFarLamps(ctx, 1));
      return;
    }
    if (pass === 'near') {
      U.safe('sermon.mount', () => drawMountain(ctx, g));
      U.safe('sermon.trees', () => drawTrees(ctx, g));
      U.safe('sermon.good', () => drawGoodTree(ctx, g));
      U.safe('sermon.road', () => drawRoad(ctx, g));
      U.safe('sermon.shore', () => drawShore(ctx));
      U.safe('sermon.houseR', () => drawParableHouse(ctx, 'rock'));
      U.safe('sermon.houseS', () => drawParableHouse(ctx, 'sand'));
      U.safe('sermon.surge', () => drawSurge(ctx));
      U.safe('sermon.door', () => drawDoorHouse(ctx, g));
      U.safe('sermon.gate', () => drawGate(ctx, g));
      U.safe('sermon.lily', () => drawLilies(ctx, g));
      U.safe('sermon.aura', () => drawJesusAura(ctx));
      return;
    }
    if (pass === 'air') {
      U.safe('sermon.inner', () => drawInner(ctx));
      U.safe('sermon.above', () => drawFromAbove(ctx));
      U.safe('sermon.sunF', () => drawSunFront(ctx));
      U.safe('sermon.give', () => drawGive(ctx));
      U.safe('sermon.gold', () => drawGold(ctx));
      U.safe('sermon.bread', () => drawBread(ctx));
      U.safe('sermon.pts', () => drawPts(ctx));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function pick(x, y, r) {
    if (!isCur()) return null;
    const g = layout();
    let best = null;
    const test = (label, px, py, d0) => {
      if (!isFinite(px) || !isFinite(py)) return;
      const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const s = g.s, sp = spots();
    { const q = FP(0.4, 0.45); test('山', q[0], q[1], mtH() * 0.3); }
    { const xf = doorX(); test('门', xf * W.w, gY(2, xf) - 16 * s, 12 * s); }
    if (LV.srGate > 0.5) { const q = FP(sp.gate[0], sp.gate[1]); test('窄门', q[0], q[1] - 20 * s, 8 * s); }
    if (LV.srPath > 0.5) { const P = pathPts(), q = FP(P[2][0], P[2][1]); test('小路', q[0], q[1], 6 * s); }
    if (LV.srRoad > 0.5) test('宽路', W.w * 0.9, faceY(0.9, 1.78), 12 * s);
    { const q = FP(sp.tree[0], sp.tree[1]); test(LV.srFruit > 0.5 ? '好树' : '无花果树', q[0], q[1] - 30 * s, 16 * s); }
    { const q = FP(sp.thorn[0], sp.thorn[1]); test('荆棘', q[0], q[1] - 8 * s, 5 * s); }
    if (LV.srLily > 0.3) { const q = FP(-0.4, 1.2); test('百合花', q[0], q[1] - 8 * s, 30 * s); }
    { const xf = cityX(); test('山上的城', xf * W.w, gY(0, xf) - 8, 14); }
    { const xf = villageX(); test('迦百农', xf * W.w, gY(1, xf) - 10 * LS(1), 22 * LS(1)); }
    if (LV.srRock > 0.5) test('磐石上的房子', xRock() * W.w, gY(2, xRock()) - (ROCK_H + 12) * houseS(), 12 * houseS());
    else test('磐石', xRock() * W.w, gY(2, xRock()) - ROCK_H * 0.5 * houseS(), 12 * houseS());
    if (LV.srSand > 0.5 && LV.srFall < 0.5) test('沙土上的房子', xSand() * W.w, gY(2, xSand()) - 12 * houseS(), 12 * houseS());
    else test('沙土', xSand() * W.w, gY(2, xSand()) + 2, 10 * houseS());
    test('船', (port() ? 0.515 : 0.51) * W.w, gY(1, port() ? 0.515 : 0.51) - 4, 8);
    return best;
  }

  const SCENE = {
    init() { sprites(); buildModel(); },
    resize() { G = null; lily = null; },
    update(dt) {
      if (!isCur()) { if (PT.length) PT.length = 0; return; }
      const f = dt * (W.fast || 1);
      updatePts(dt);
      for (const p of TRK) {
        if (p.dying && p.alpha < 0.02) { TRK.delete(p); continue; }
        if (p._sd !== p._sdT) {
          const st = p._sdR * f;
          if (Math.abs(p._sdT - p._sd) <= st) p._sd = p._sdT; else p._sd += Math.sign(p._sdT - p._sd) * st;
          p.v = vOf(p._sd);
        }
      }
    },
    drawUnder,
    draw() {},
    reset() { TRK.clear(); PT.length = 0; },
    restore() { PT.length = 0; for (const p of TRK) { p._sd = p._sdT; p.v = vOf(p._sd); } },
    pick,
    sig() {
      return { up: S.up, peace: S.peace, lit: S.lit, sun: S.sun, alms: S.alms, prayed: S.prayed, birds: S.birds,
        lily: S.lily ? S.lily.map(v => Math.round(v * 20) / 20) : null, bread: S.bread, gate: S.gate, fruit: S.fruit,
        built: S.built, fallen: S.fallen, amazed: S.amazed, down: S.down };
    },
    get debug() { return { S: Object.assign({}, S), trk: TRK.size, lv: MY.reduce((o, k) => { o[k] = +LV[k].toFixed(3); return o; }, {}) }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕的开端：加利利的山，天将亮（与上一幕怎样结束无关）
  // ════════════════════════════════════════════════════════════
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.42, land: 1, grass: 1, herbs: 0.85, trees: 0,
      lights: 1, moon: port() ? 0.22 : 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.set('bloom', 0.3, true); W.set('bare', 0, true);
    W.set('gale', 0.2, true); W.set('rain', 0, true); W.set('storm', 0, true); W.set('gloom', 0, true); W.set('hail', 0, true);
    W.weatherExclude = [];
    W.freeClock = false;
    const tx = W.w * 0.995;
    W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7)); W.setOrigin('herbs', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.goTo(0.241, 0, true);
    W.setPop('fish', 90, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.2, W.h * 0.8, true);
    W.setPop('bird', 14, W.w * 0.3, W.h * 0.3, true);
    W.setPop('cattle', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('beast', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('creeper', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('human', 0, W.w * 0.9, W.h * 0.8, true);
    S = fresh();
    TRK.clear(); G = null; lily = null;
    const c = C();
    c.clear({ fade: false });
    const st = seats(), sp = spots();
    // 耶稣与四个门徒（4:18–22 刚被召的打鱼的）：天将亮，在山脚
    person('jesus', look('jesus', { facing: 1, pose: 'stand', from: 'none' }), sp.jesus0[0], sp.jesus0[1]);
    person('peter', look('peter', { facing: 1, pose: 'stand', from: 'none' }), sp.peter0[0], sp.peter0[1]);
    person('john', look('john', { facing: -1, pose: 'stand', from: 'none' }), sp.john0[0], sp.john0[1]);
    const DR = (c.DISCIPLE_ROBES || [[122, 104, 84], [104, 92, 80]]);
    person('andrew', look('disciple', { label: '安得烈', robe: DR[3], facing: 1, pose: 'stand', from: 'none' }), sp.andrew0[0], sp.andrew0[1]);
    person('james', look('disciple', { label: '雅各', robe: DR[4], facing: -1, pose: 'stand', from: 'none' }), sp.james0[0], sp.james0[1]);
    // 众人：从各处来的，站在山脚
    crowd('crowdL', { n: st.L.length, pose: 'stand', from: 'none', glow: 0.1 });
    crowd('crowdR', { n: st.R.length, pose: 'stand', from: 'none', glow: 0.1 });
    crowd('crowdF', { n: st.F.length, pose: 'stand', from: 'none', glow: 0.1 });
    cplace('crowdL', st.startL, (m, i) => (i % 3 ? -1 : 1));
    cplace('crowdR', st.startR, (m, i) => (i % 2 ? -1 : 1));
    cplace('crowdF', st.startF, () => -1);
    // 山脚与山前的几个人
    person('beggar', { label: '穷人', sex: 'm', age: 'elder', robe: [128, 122, 114], accent: [150, 146, 136], facing: 1, pose: 'sit', glow: 0.1, prop: null, from: 'none' }, sp.beggar[0], sp.beggar[1]);
    person('father', { label: '父亲', sex: 'm', age: 'adult', robe: [120, 96, 74], beard: true, facing: 1, pose: 'stand', glow: 0.12, from: 'none' }, sp.father[0], sp.father[1]);
    person('son', { label: '儿子', sex: 'm', age: 'child', robe: [176, 150, 110], facing: -1, pose: 'stand', glow: 0.12, from: 'none' }, sp.son[0], sp.son[1]);
    person('giver', { label: '施舍的人', sex: 'f', age: 'adult', robe: [146, 110, 118], accent: [214, 196, 170], facing: 1, pose: 'stand', glow: 0.12, from: 'none' }, sp.giver[0], sp.giver[1]);
    person('mourner', { label: '哀恸的人', sex: 'f', age: 'adult', robe: [92, 90, 104], accent: [170, 164, 170], facing: 1, pose: 'weep', glow: 0.1, from: 'none' }, sp.mourner[0], sp.mourner[1]);
    C().pose('mourner', 'weep', { weep: true });
    person('comforter', { label: '安慰人的', sex: 'f', age: 'elder', robe: [150, 118, 90], accent: [226, 214, 190], facing: 1, pose: 'stand', glow: 0.12, from: 'none' }, sp.comforter[0], sp.comforter[1]);
    person('broA', { label: '弟兄', sex: 'm', age: 'adult', robe: [112, 100, 128], beard: true, facing: -1, pose: 'stand', glow: 0.1, from: 'none' }, sp.broA[0], sp.broA[1]);
    person('broB', { label: '弟兄', sex: 'm', age: 'adult', robe: [134, 96, 70], beard: true, facing: 1, pose: 'stand', glow: 0.1, from: 'none' }, sp.broB[0], sp.broB[1]);
    person('elder', { label: '使人和睦的人', sex: 'm', age: 'elder', robe: [176, 164, 140], facing: -1, pose: 'stand', glow: 0.14, from: 'none' }, sp.elder[0], sp.elder[1]);
    avoid([0.3, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  const DISC = ['peter', 'john', 'andrew', 'james'];
  const CROWDS = ['crowdL', 'crowdR', 'crowdF'];
  const SIDE = ['beggar', 'father', 'son', 'giver', 'mourner', 'comforter', 'broA', 'broB', 'elder'];
  function ringAt(b, x, y, rgb, rf, dur, w) { if (inst(b)) return; fx().ring(x, y, rgb, M() * rf, dur || 2.4, w || 1.4); }
  function sparkAt(b, x, y, n, rgb, spread) { if (inst(b)) return; sparks(x, y, n, rgb, spread); }
  function jesusXY() { const p = fig('jesus'); return p && p._vis ? [p._x, p._y - p._h * 0.4] : FP(seats().jesus[0], seats().jesus[1]); }
  // 灵所在之处 → 山上的 (u, d)
  function spiritUD(c) {
    const xf = clamp((c.x == null ? W.w * 0.72 : c.x) / W.w, 0, 1);
    let u = clamp(XU(xf), -1.25, 1.1);
    const top = topY(UX(u)), base = gY(2, UX(u));
    const y = c.y == null ? W.h * 0.55 : c.y;
    const d = y <= top ? 0.15 : y <= base ? clamp((y - top) / Math.max(1, base - top), 0.15, 1) : clamp(1 + (y - base) / Math.max(1, fieldH(2, base) * 0.8), 1, 1.5);
    return [u, d];
  }
  // 众人一齐坐下 / 一齐跪下祷告
  function allPose(ps, withJesus) {
    for (const g of CROWDS) cpose(g, ps);
    for (const id of DISC) pose(id, ps);
    if (withJesus) pose('jesus', ps);
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每一句的故事约十五至三十秒）
  //  经文的每一行（<br> 之间）不过十八九个字
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 5:1–3 上了山，坐下，开口教训他们 ─────────────────────
    {
      kind: 'bless', utter: '虚心的人有福了！因为天国是他们的', cmd: 'cd ~/山上 && sit --teach  # 天国是他们的', ref: '5:3',
      verse: [
        { text: '耶稣看见这许多的人，就上了山，<br>既已坐下，门徒到他跟前来，<br>他就开口教训他们，说：', ref: '马太福音 5:1–2', hold: 7 },
        { text: '虚心的人有福了！<br>因为天国是他们的。', ref: '马太福音 5:3', hold: 6 },
      ],
      apply(c) {
        const st = seats();
        T(c, [
          [0, b => {
            W.goTo(0.2425, 20, inst(b));
            go('jesus', st.jesus[0], st.jesus[1], 'sit', 0.032);
            face('jesus', -1);
            S.up = true;
            sfx(b, 'wind', { soft: true });
          }],
          [0.9, () => {
            go('peter', st.peter[0], st.peter[1], 'sit', 0.03); go('andrew', st.andrew[0], st.andrew[1], 'sit', 0.03);
            go('john', st.john[0], st.john[1], 'sit', 0.028); go('james', st.james[0], st.james[1], 'sit', 0.03);
            for (const id of ['peter', 'andrew']) face(id, 1);
            for (const id of ['john', 'james']) face(id, -1);
          }],
          [2, b => { cseat('crowdL', st.L, 'sit', 0.03, 0.3); sfx(b, 'crowd', { soft: true }); }],
          [2.8, () => cseat('crowdR', st.R, 'sit', 0.032, 0.3)],
          [3.6, () => cseat('crowdF', st.F, 'sit', 0.026, 0.2)],
          [4.2, () => {
            // 山脚的几个人也在山前坐下（哀恸的人仍站着哭）
            pose('beggar', 'sit'); pose('father', 'sit'); pose('son', 'sit'); pose('giver', 'sit'); pose('comforter', 'sit');
            face('father', 1); face('son', 1); face('giver', 1); face('comforter', -1);
          }],
          [7.4, b => {
            // 他开口：「虚心的人有福了」——一圈温暖的光自他身上漫过山坡
            glow('jesus', 0.42);
            if (!inst(b)) { const q = jesusXY(); ringAt(b, q[0], q[1], [255, 232, 180], 0.75, 4.2, 1.6); sparkAt(b, q[0], q[1], 26, [255, 240, 200], 18); }
            sfx(b, 'harp', { soft: true });
          }],
          [8.2, () => { for (const g of CROWDS) cfaceJ(g); }],
          [9.5, () => { for (const g of CROWDS) cglow(g, 0.2); for (const id of DISC.concat(SIDE)) glow(id, 0.22); }],
        ]);
      },
    },

    // ── 5:4–9 东方发白；哀恸的得安慰；清心的必得见神；使人和睦的 ─────
    {
      kind: 'bless', utter: '清心的人有福了！因为他们必得见神', cmd: 'grep -l 清心 ~/人心 | see --神  # 东方发白', ref: '5:8',
      verse: [
        { text: '哀恸的人有福了！因为他们必得安慰。<br>温柔的人有福了！因为他们必承受地土。', ref: '马太福音 5:4–5', hold: 7 },
        { text: '饥渴慕义的人有福了！因为他们必得饱足。<br>怜恤人的人有福了！因为他们必蒙怜恤。<br>清心的人有福了！因为他们必得见神。', ref: '马太福音 5:6–8', hold: 8 },
        { text: '使人和睦的人有福了！<br>因为他们必称为神的儿子。', ref: '马太福音 5:9', hold: 6.5 },
      ],
      apply(c) {
        const sp = spots();
        T(c, [
          [0, b => { W.goTo(0.2455, 18, inst(b)); lv('srDawn', 1, b); sfx(b, 'stars', { soft: true }); }],
          // 哀恸的人得了安慰
          [0.8, () => { setD(fig('comforter'), sp.mourner[1], 2.5); embrace('comforter', 'mourner', { weep: true }); }],
          [5.2, () => { const a = fig('mourner'); if (a) a.sobbing = false; }],
          [6.6, () => { pose('mourner', 'sit', { weep: false }); pose('comforter', 'sit'); face('mourner', -1); face('comforter', -1); }],
          // 清心的人必得见神：自上而来的光落在山上
          [7.4, b => { lv('srSee', 1, b); glow('jesus', 0.5); sfx(b, 'angel', { soft: true }); }],
          [8, () => { for (const g of CROWDS) cglow(g, 0.24); }],
          [14.2, b => lv('srSee', 0.25, b)],
          // 使人和睦的人：长者领两个背转的弟兄相见，二人相拥
          [15, () => { go('elder', sp.peace[0] + (port() ? 0.12 : 0.1), sp.peace[1] + 0.1, 'stand', 0.02); }],
          [17.2, () => { face('broA', 1); face('broB', -1); face('elder', -1); }],
          [18, b => { embrace('broA', 'broB', { at: UX(sp.peace[0]) }); S.peace = true; sfx(b, 'harp', { soft: true }); }],
          [21.5, () => {
            pose('broA', 'sit'); pose('broB', 'sit'); pose('elder', 'sit');
            faceJ('broA'); faceJ('broB'); faceJ('elder');
          }],
        ]);
      },
    },

    // ── 5:13–16 你们是世上的光 ───────────────────────────────
    {
      kind: 'name', utter: '你们是世上的光', cmd: 'lamp --on --stand 灯台 --not-under 斗', ref: '5:14',
      verse: [
        { text: '你们是世上的盐。<br>盐若失了味，怎能叫它再咸呢？', ref: '马太福音 5:13', hold: 5.5 },
        { text: '你们是世上的光。<br>城造在山上是不能隐藏的。<br>人点灯，不放在斗底下，<br>是放在灯台上，就照亮一家的人。', ref: '马太福音 5:14–15', hold: 8.5 },
        { text: '你们的光也当这样照在人前，<br>叫他们看见你们的好行为，<br>便将荣耀归给你们在天上的父。', ref: '马太福音 5:16', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.2475, 20, inst(b));
            // 盐：一撮白亮的微光落在众人中间
            if (!inst(b)) for (const u of [-0.3, 0.1, 0.5]) { const q = FP(u, 0.7); sparkAt(b, q[0], q[1] - 10, 14, [245, 248, 255], 22); }
          }],
          [5.4, b => {
            // 你们是世上的光：山上众人心里的光一齐点亮
            lv('srInner', 1, b); S.lit = true;
            for (const g of CROWDS) cglow(g, 0.34);
            for (const id of DISC.concat(SIDE)) glow(id, 0.34);
            if (!inst(b)) { const q = jesusXY(); ringAt(b, q[0], q[1], [255, 214, 150], 0.9, 3.6, 1.8); }
            sfx(b, 'fire', { soft: true });
          }],
          [5.9, b => lv('srSpread', 1, b)],
          [7.2, b => {
            lv('srCity', 1, b);
            if (!inst(b)) { const xf = cityX(); ringAt(b, xf * W.w, gY(0, xf) - 6, [255, 226, 170], 0.14, 2.6, 1.2); }
            sfx(b, 'stars', { soft: true });
          }],
          [9.6, b => { lv('srLamps', 1, b); sfx(b, 'chime', { soft: true }); }],
          [13.8, b => { lv('srFar', 1, b); }],
          [16, b => { if (!inst(b)) { const q = jesusXY(); ringAt(b, q[0], q[1], [255, 226, 170], 1.4, 5.5, 1.2); } }],
        ]);
      },
    },

    // ── 5:43–48 要爱你们的仇敌：日头照好人，也照歹人 ─────────
    {
      kind: 'cmd', utter: '要爱你们的仇敌，为那逼迫你们的祷告', cmd: 'sunrise --for=好人,歹人 && rain --for=义人,不义的人', ref: '5:44',
      verse: [
        { text: '你们听见有话说：<br>『当爱你的邻舍，恨你的仇敌。』<br>只是我告诉你们，要爱你们的仇敌，<br>为那逼迫你们的祷告。', ref: '马太福音 5:43–44', hold: 8 },
        { text: '这样就可以作你们天父的儿子；<br>因为他叫日头照好人，也照歹人；<br>降雨给义人，也给不义的人。', ref: '马太福音 5:45', hold: 7.5 },
        { text: '所以，你们要完全，<br>像你们的天父完全一样。', ref: '马太福音 5:48', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.249, 7.5, inst(b)); lv('srDawn', 0, b); lv('srSee', 0, b); }],
          [7.8, b => {
            // 日头从海上升起，金光自东向西扫过全地
            W.goTo(0.3, 11, inst(b));
            lv('srSun', 1, b); S.sun = true;
            sfx(b, 'harp');
          }],
          [10.5, b => {
            lv('srLamps', 0, b); lv('srInner', 0.25, b); lv('srFar', 0, b); lv('srCity', 0.3, b);
            for (const g of CROWDS) cglow(g, 0.14);
            for (const id of DISC.concat(SIDE)) glow(id, 0.16);
            glow('jesus', 0.36);
          }],
          // 降雨给义人，也给不义的人：一阵太阳雨
          [12.2, b => {
            W.set('rain', 0.42, inst(b)); W.set('clouds', 0.62, inst(b)); sfx(b, 'rain', { soft: true });
            // 太阳雨：阳光里闪亮的雨点，落在山上所有的人身上
            if (!inst(b)) {
              const k = Math.max(0.7, W.unit);
              for (let i = 0; i < 140; i++) {
                const x = W.w * (0.38 + Math.random() * 0.62), y = W.h * (0.05 + Math.random() * 0.5);
                addPt({ x, y, vx: -18 * k, vy: (160 + Math.random() * 90) * k, grav: 60 * k, drag: 0.1, max: 1.6 + Math.random() * 2.2, delay: Math.random() * 5,
                  r: (1.6 + Math.random() * 1) * k, c: [255, 244, 214], a: 0.8, streak: true });
              }
            }
          }],
          [19, b => { W.set('rain', 0, inst(b)); W.set('clouds', 0.4, inst(b)); }],
        ]);
      },
    },

    // ── 6:1–4 暗中的施舍 ─────────────────────────────────────
    {
      kind: 'promise', utter: '你父在暗中察看，必然报答你', cmd: 'give --hand=右 --quiet  # 左手不知道', ref: '6:4',
      verse: [
        { text: '你们要小心，不可将善事行在人的面前，<br>故意叫他们看见，若是这样，<br>就不能得你们天父的赏赐了。', ref: '马太福音 6:1', hold: 7 },
        { text: '你施舍的时候，<br>不要叫左手知道右手所做的，<br>要叫你施舍的事行在暗中。<br>你父在暗中察看，必然报答你。', ref: '马太福音 6:3–4', hold: 8.5 },
      ],
      apply(c) {
        const sp = spots();
        T(c, [
          [0, b => { W.goTo(0.33, 12, inst(b)); }],
          [0.6, () => { go('giver', sp.beggar[0] + sp.alms, sp.beggar[1] + 0.04, 'kneel', 0.03); face('giver', -1); }],
          [7.6, b => {
            S.alms = true;
            pose('giver', 'kneel');
            if (!inst(b)) { const p = fig('beggar'), q = p ? bodyAt(p, 0.3) : null; if (q) sparkAt(b, q[0], q[1], 10, [255, 236, 190], 6); }
            sfx(b, 'coins', { soft: true });
          }],
          [9.4, () => { go('giver', sp.giver[0], sp.giver[1], 'sit', 0.03); face('giver', 1); }],
          [10.4, b => { lv('srGive', 1, b); sfx(b, 'stars', { soft: true }); }],
          [13.2, () => { pose('beggar', 'raise'); }],
          [16.4, b => { lv('srGive', 0, b); pose('beggar', 'sit'); }],
        ]);
      },
    },

    // ── 6:9–13 主祷文 ───────────────────────────────────────
    {
      kind: 'bless', utter: '我们在天上的父：愿人都尊你的名为圣', cmd: 'pray --to 天上的父 --hallow 名 --no-repeat', ref: '6:9',
      verse: [
        { text: '所以，你们祷告要这样说：<br>我们在天上的父：<br>愿人都尊你的名为圣。', ref: '马太福音 6:9', hold: 6.5 },
        { text: '愿你的国降临；<br>愿你的旨意行在地上，如同行在天上。<br>我们日用的饮食，今日赐给我们。', ref: '马太福音 6:10–11', hold: 7.5 },
        { text: '免我们的债，如同我们免了人的债。<br>不叫我们遇见试探；救我们脱离凶恶。<br>因为国度、权柄、荣耀，全是你的，<br>直到永远。阿们！', ref: '马太福音 6:12–13', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          // 「你们祷告要这样说」：他仍坐着教导；门徒与众人跪下祷告
          [0, b => { W.goTo(0.37, 20, inst(b)); pose('jesus', 'sit'); glow('jesus', 0.5); sfx(b, 'whisper', { soft: true }); }],
          [0.8, () => { for (const id of DISC) pose(id, 'pray'); }],
          [1.6, () => { for (const g of CROWDS) cpose(g, 'pray'); for (const id of SIDE) pose(id, 'pray'); S.prayed = true; }],
          [2.2, b => { lv('srPillar', 1, b); W.set('clouds', 0.26, inst(b)); sfx(b, 'angel', { soft: true }); }],
          [7, b => {
            // 愿你的旨意行在地上，如同行在天上：光自山上漫过全地
            if (!inst(b)) { const q = prayFoot(); ringAt(b, q[0], q[1], [255, 240, 206], 1.6, 6, 2); W.flash = Math.max(W.flash, 0.1); }
            for (const g of CROWDS) cglow(g, 0.22);
          }],
          [21, b => { lv('srPillar', 0, b); sfx(b, 'harp', { soft: true }); }],
          [22, () => { for (const id of DISC) pose(id, 'sit'); for (const g of CROWDS) cpose(g, 'sit'); for (const id of SIDE) pose(id, 'sit'); }],
          [22.5, b => hint(b, '按住言说时，灵在哪里，飞鸟就从那里飞出', 5)],
        ]);
      },
    },

    // ── 6:26 天上的飞鸟 ─────────────────────────────────────
    {
      kind: 'cmd', utter: '你们看那天上的飞鸟', cmd: 'feed --birds --no-sow --no-reap --no-barn', ref: '6:26',
      verse: [
        { text: '你们看那天上的飞鸟，<br>也不种，也不收，也不积蓄在仓里，<br>你们的天父尚且养活它。<br>你们不比飞鸟贵重得多吗？', ref: '马太福音 6:26', hold: 8.5 },
        { text: '你们哪一个能用思虑<br>使寿数多加一刻呢？', ref: '马太福音 6:27', hold: 5 },
      ],
      apply(c) {
        const bx = c.choice && c.choice.bird ? c.choice.bird[0] * W.w : (c.x == null ? W.w * 0.72 : c.x);
        const by = c.choice && c.choice.bird ? c.choice.bird[1] * W.h : (c.y == null ? W.h * 0.4 : c.y);
        T(c, [
          [0, b => {
            W.goTo(0.41, 14, inst(b));
            W.setPop('bird', 64, bx, Math.min(by, W.h * 0.62), inst(b));
            S.birds = true;
            if (!inst(b)) { sparks(bx, Math.min(by, W.h * 0.62), 50, [255, 244, 222], 14); fx().ring(bx, Math.min(by, W.h * 0.62), [255, 244, 222], M() * 0.2, 1.6, 1.2); }
            sfx(b, 'wings'); sfx(b, 'bird');
          }],
          [1.2, () => { pose('son', 'point'); const p = fig('son'); face('son', p && bx < p.nx * W.w ? -1 : 1); }],
          [3.5, b => {
            // 天父撒下谷粒养活它们
            if (inst(b)) return;
            const k = Math.max(0.7, W.unit);
            for (let i = 0; i < 110; i++) {
              const x = W.w * (0.52 + Math.random() * 0.46), y = W.h * (0.18 + Math.random() * 0.3);
              addPt({ x, y, vx: (Math.random() - 0.5) * 14 * k, vy: (14 + Math.random() * 22) * k, grav: 30 * k, drag: 0.35, max: 3.4 + Math.random() * 1.8,
                r: (2.2 + Math.random() * 1.6) * k, c: [255, 222, 140], tw: true, delay: Math.random() * 1.5 });
            }
            sfx(b, 'bird', { soft: true });
          }],
          [6, () => { for (const g of ['crowdL', 'crowdR']) cpose(g, 'sit'); }],
          [9.5, () => { pose('son', 'sit'); faceJ('son'); }],
          [12.5, b => hint(b, '按住言说时，灵在哪里，百合花就从那里开起', 5)],
        ]);
        return { bird: [clamp(bx / W.w, 0, 1), clamp(by / W.h, 0, 1)] };
      },
    },

    // ── 6:28–33 野地里的百合花 ───────────────────────────────
    {
      kind: 'cmd', utter: '你想野地里的百合花怎么长起来', cmd: 'bloom 百合花 --no-toil --no-spin > 所罗门.glory', ref: '6:28',
      verse: [
        { text: '何必为衣裳忧虑呢？<br>你想野地里的百合花怎么长起来；<br>它也不劳苦，也不纺线。', ref: '马太福音 6:28', hold: 7 },
        { text: '然而我告诉你们，<br>就是所罗门极荣华的时候，<br>他所穿戴的，还不如这花一朵呢！', ref: '马太福音 6:29', hold: 7 },
        { text: '你们要先求他的国和他的义，<br>这些东西都要加给你们了。', ref: '马太福音 6:33', hold: 6 },
      ],
      apply(c) {
        const o = c.choice && c.choice.lily ? c.choice.lily.slice() : spiritUD(c);
        T(c, [
          [0, b => {
            W.goTo(0.45, 14, inst(b));
            S.lily = o.slice();
            lv('srLily', 1, b); W.set('bloom', 1, inst(b));
            if (!inst(b)) { const q = FP(o[0], o[1]); ringAt(b, q[0], q[1], [240, 190, 200], 0.5, 3.2, 1.2); sparkAt(b, q[0], q[1], 30, [255, 230, 236], 14, 'near'); }
            sfx(b, 'harp', { soft: true }); sfx(b, 'wind', { soft: true });
          }],
          [7.2, b => {
            lv('srGlory', 1, b);
            if (!inst(b)) { const q = FP(port() ? -0.1 : -0.08, 0.1); sparkAt(b, q[0], q[1] - 20, 24, [255, 244, 214], 10); }
            sfx(b, 'chime', { soft: true });
          }],
          [14.5, b => { W.set('gale', 0.32, inst(b)); sfx(b, 'wind', { soft: true }); }],
          [18.5, b => W.set('gale', 0.2, inst(b))],
        ]);
        return { lily: o };
      },
    },

    // ── 7:7–11 叩门，就给你们开门；求饼的儿子 ─────────────────
    {
      kind: 'promise', utter: '寻找，就寻见；叩门，就给你们开门', cmd: 'knock && open 门  # 叩门的，就给他开门', ref: '7:7',
      verse: [
        { text: '你们祈求，就给你们；<br>寻找，就寻见；<br>叩门，就给你们开门。', ref: '马太福音 7:7', hold: 6.5 },
        { text: '你们中间谁有儿子求饼，反给他石头呢？<br>求鱼，反给他蛇呢？', ref: '马太福音 7:9–10', hold: 6.5 },
        { text: '你们虽然不好，尚且知道拿好东西给儿女，<br>何况你们在天上的父，<br>岂不更把好东西给求他的人吗？', ref: '马太福音 7:11', hold: 7.5 },
      ],
      apply(c) {
        // 父亲站在门的左边（乞丐坐在屋右边的石阶旁），面向门叩门；门开了，家主站在门口把饼递给他
        const sp = spots(), kx = () => doorX() + sp.knock[0];
        T(c, [
          [0, b => { W.goTo(0.5, 14, inst(b)); pose('son', 'raise'); face('son', -1); }],
          [0.8, () => { go('father', XU(kx()), sp.knock[1], 'point', 0.03); face('father', 1); }],
          [4.6, b => { pose('father', 'point'); face('father', 1); sfx(b, 'knock'); }],
          [5.6, b => {
            lv('srDoor', 1, b);
            if (!inst(b)) {
              const xf = doorX(), y = gY(2, xf) - 10 * LS(2);
              sparkAt(b, xf * W.w, y, 26, [255, 220, 160], 10, 'near');
              ringAt(b, xf * W.w, y, [255, 222, 168], port() ? 0.2 : 0.14, 2.4, 1.4);
            }
            sfx(b, 'door', { soft: true });
          }],
          [5.9, () => { go('father', XU(kx() - (port() ? 0.014 : 0.008)), sp.knock[1] + 0.02, 'stand', 0.02); face('father', 1); }],
          [6.4, b => {
            const xf = doorX() + sp.host;
            person('host', { label: '家主', sex: 'm', age: 'elder', robe: [160, 130, 96], facing: -1, pose: 'carry', glow: 0.3, prop: null, x: xf, from: inst(b) ? 'none' : 'fade' }, XU(xf), 1.02);
            S.host = true;
          }],
          [8.6, b => { S.bread = 'father'; pose('father', 'carry'); sfx(b, 'harp', { soft: true }); }],
          [10, () => { if (has('host')) C().remove('host', { fade: true }); S.host = false; }],
          [10.4, () => { go('father', sp.son[0] - 0.1, sp.son[1] - 0.04, 'stand', 0.032); face('father', 1); }],
          [15, b => { S.bread = 'son'; pose('son', 'raise'); pose('father', 'stand'); sfx(b, 'laugh', { soft: true }); }],
          [18.2, () => { pose('son', 'carry'); go('father', sp.father[0], sp.father[1], 'sit', 0.02); faceJ('father'); }],
          [20.5, b => { lv('srDoor', 0.35, b); pose('son', 'sit'); faceJ('son'); }],
        ]);
      },
    },

    // ── 7:13–14 窄门与小路 ──────────────────────────────────
    {
      kind: 'cmd', utter: '你们要进窄门', cmd: 'git checkout 窄门 --path=小路  # 找着的人也少', ref: '7:13',
      verse: [
        { text: '你们要进窄门。<br>因为引到灭亡，那门是宽的，路是大的，<br>进去的人也多；', ref: '马太福音 7:13', hold: 7 },
        { text: '引到永生，那门是窄的，<br>路是小的，找着的人也少。', ref: '马太福音 7:14', hold: 6.5 },
      ],
      apply(c) {
        const sp = spots(), st = seats(), P = pathPts();
        T(c, [
          [0, b => {
            W.goTo(0.54, 14, inst(b));
            lv('srGate', 1, b); lv('srRoad', 1, b); S.gate = true;
            if (!inst(b)) { const q = FP(sp.gate[0], sp.gate[1]); sparkAt(b, q[0], q[1] - 12, 26, [255, 236, 190], 10, 'near'); }
            sfx(b, 'build', { soft: true });
            // 宽路上许多人走进尘雾里（看着时才走；重演时他们早已走远）
            if (inst(b)) return;
            const n = port() ? 5 : 9, d = port() ? 1.82 : 1.78;
            crowd('many', { n, pose: 'stand', from: 'fade', glow: 0.04, label: '行路的人' });
            cmembers('many').forEach((m, i) => { m.nx = UX(port() ? -1.9 : -1.75) + i * 0.028; m.tx = null; m.facing = m.fd = 1; track(m, d + ((i * 0.37) % 1) * 0.06); });
            C().crowdWalk('many', 1.1, 1.2, { speed: 0.04 });
            cmembers('many').forEach((m, i) => { m.tx = 1.12 + i * 0.01; m.speed = 0.034 + ((i * 0.618) % 1) * 0.012; m.facing = 1; m.faceEnd = null; });
          }],
          // 三个人（相和好的弟兄与那长者）先到窄门前；「引到永生，那门是窄的」——进了窄门，沿着小路上山坐下
          [0.8, () => { go('elder', sp.gate[0] - 0.04, sp.gate[1] + 0.06, 'stand', 0.03); go('broA', sp.gate[0] - 0.1, sp.gate[1] + 0.1, 'stand', 0.03); go('broB', sp.gate[0] + 0.05, sp.gate[1] + 0.12, 'stand', 0.03); }],
          [6.5, b => { lv('srPath', 1, b); sfx(b, 'harp', { soft: true }); }],
          [6.8, () => { go('elder', P[1][0], P[1][1], 'stand', 0.03); }],
          [7.6, () => { go('broA', P[1][0], P[1][1] + 0.04, 'stand', 0.03); }],
          [8.4, () => { go('broB', P[1][0] + 0.02, P[1][1] + 0.08, 'stand', 0.03); }],
          [8.8, () => { go('elder', st.seek[0][0], st.seek[0][1], 'sit', 0.03); face('elder', 1); }],
          [9.8, () => { go('broA', st.seek[1][0], st.seek[1][1], 'sit', 0.03); face('broA', 1); }],
          [10.8, () => { go('broB', st.seek[2][0], st.seek[2][1], 'sit', 0.03); face('broB', 1); }],
          [15, b => { if (hasCrowd('many')) C().removeCrowd('many', { fade: !inst(b) }); lv('srRoad', 0.3, b); }],
        ]);
      },
    },

    // ── 7:16–17 凡好树都结好果子 ─────────────────────────────
    {
      kind: 'act', utter: '凡好树都结好果子', cmd: 'find 果子 --tree=好树 | grep -v 荆棘', ref: '7:17',
      verse: [
        { text: '凭着他们的果子，就可以认出他们来。<br>荆棘上岂能摘葡萄呢？<br>蒺藜里岂能摘无花果呢？', ref: '马太福音 7:16', hold: 7 },
        { text: '这样，凡好树都结好果子，<br>惟独坏树结坏果子。', ref: '马太福音 7:17', hold: 5.5 },
      ],
      apply(c) {
        const sp = spots();
        T(c, [
          [0, b => {
            W.goTo(0.58, 14, inst(b));
            lv('srFruit', 1, b); S.fruit = true;
            if (!inst(b)) { const q = FP(sp.tree[0], sp.tree[1]); sparkAt(b, q[0], q[1] - 40 * LS(2), 30, [220, 255, 200], 22 * LS(2), 'near'); }
            sfx(b, 'harp', { soft: true });
          }],
          [5, b => sfx(b, 'wind', { soft: true })],
          [8.6, () => { go('comforter', sp.pick2[0], sp.pick2[1], 'raise', 0.03); go('mourner', sp.pick1[0], sp.pick1[1], 'raise', 0.03); face('comforter', -1); face('mourner', 1); }],
          [14.5, () => { pose('mourner', 'carry'); pose('comforter', 'carry'); }],
          [17.5, () => { pose('mourner', 'sit'); pose('comforter', 'sit'); faceJ('mourner'); faceJ('comforter'); }],
        ]);
      },
    },

    // ── 7:24–26 把房子盖在磐石上 / 盖在沙土上 ─────────────────
    {
      kind: 'cmd', utter: '把房子盖在磐石上', cmd: 'build 房子 --on 磐石  # 根基', ref: '7:24',
      verse: [
        { text: '所以，凡听见我这话就去行的，<br>好比一个聪明人，<br>把房子盖在磐石上；', ref: '马太福音 7:24', hold: 7 },
        { text: '凡听见我这话不去行的，<br>好比一个无知的人，<br>把房子盖在沙土上；', ref: '马太福音 7:26', hold: 6.5 },
      ],
      apply(c) {
        const sp = spots();
        T(c, [
          [0, b => {
            W.goTo(0.62, 14, inst(b));
            person('wise', { label: '聪明人', sex: 'm', age: 'adult', robe: [120, 104, 86], beard: true, facing: -1, pose: 'carry', glow: 0.2, from: inst(b) ? 'none' : 'fade' }, sp.wise0[0], sp.wise0[1]);
            S.built = true;
          }],
          [0.6, b => { lv('srRock', 1, b); sfx(b, 'build'); }],
          [3.5, b => sfx(b, 'build', { soft: true })],
          [6.2, b => sfx(b, 'build', { soft: true })],
          [6.8, b => {
            person('fool', { label: '无知的人', sex: 'm', age: 'adult', robe: [150, 120, 92], facing: -1, pose: 'carry', glow: 0.14, from: inst(b) ? 'none' : 'fade' }, sp.fool0[0], sp.fool0[1]);
          }],
          [7.2, b => { lv('srSand', 1, b); sfx(b, 'build', { soft: true }); }],
          [10.6, () => { pose('wise', 'stand'); face('wise', -1); }],
          [13, () => { pose('fool', 'sit'); face('fool', 1); }],
        ]);
      },
    },

    // ── 7:25–29 雨淋，水冲，风吹；众人都希奇 ───────────────────
    {
      kind: 'judge', utter: '雨淋，水冲，风吹，撞着那房子', cmd: 'storm --test 根基  # 总不倒塌', ref: '7:25',
      verse: [
        { text: '雨淋，水冲，风吹，撞着那房子，<br>房子总不倒塌，<br>因为根基立在磐石上。', ref: '马太福音 7:25', hold: 7 },
        { text: '雨淋，水冲，风吹，撞着那房子，<br>房子就倒塌了，并且倒塌得很大。', ref: '马太福音 7:27', hold: 6.5 },
        { text: '耶稣讲完了这些话，<br>众人都希奇他的教训；<br>因为他教训他们，正像有权柄的人，<br>不像他们的文士。', ref: '马太福音 7:28–29', hold: 8.5 },
      ],
      apply(c) {
        const sp = spots();
        T(c, [
          [0, b => {
            W.set('storm', 0.82, inst(b)); W.set('rain', 0.85, inst(b)); W.set('gale', 0.9, inst(b)); W.set('clouds', 1, inst(b));
            W.goTo(0.64, 14, inst(b));
            pose('wise', 'stand'); pose('fool', 'stand'); face('fool', -1);
            sfx(b, 'thunder'); sfx(b, 'wind');
          }],
          [1.6, b => { if (!inst(b) && GS.weather && GS.weather.bolt) U.safe('sermon.bolt', () => GS.weather.bolt({ x: W.w * 0.3 })); sfx(b, 'thunder'); }],
          [2.4, b => { lv('srSurge', 1, b); sfx(b, 'wave'); }],
          [4.2, () => { face('wise', 1); }],
          // 无知的人逃到磐石那里（没有人被冲走：倒塌的只是房子）
          [5.4, () => { go('fool', sp.wise0[0] - (port() ? 0.14 : 0.1), sp.wise0[1] + 0.04, 'stand', 0.08); }],
          [7.4, b => {
            lv('srFall', 1, b); S.fallen = true;
            if (!inst(b)) {
              const xf = xSand(), y = gY(2, xf) - 8 * houseS();
              dustPuff(xf * W.w, y, 30, [200, 184, 150], 20 * houseS()); sparks(xf * W.w, y + 6 * houseS(), 30, [226, 236, 246], 18 * houseS());
              W.shake = Math.max(W.shake || 0, 0.55);
            }
            sfx(b, 'collapse'); sfx(b, 'wave');
          }],
          [9.6, b => { if (!inst(b) && GS.weather && GS.weather.bolt) U.safe('sermon.bolt', () => GS.weather.bolt({ x: W.w * 0.62 })); sfx(b, 'thunder', { far: true }); }],
          [13.4, b => {
            // 雨过天晴：金色的黄昏
            W.set('storm', 0, inst(b)); W.set('rain', 0, inst(b)); W.set('gale', 0.22, inst(b)); W.set('clouds', 0.5, inst(b));
            lv('srSurge', 0, b); lv('srGold', 1, b);
            W.goTo(0.724, 9, inst(b));
          }],
          [14.4, b => {
            // 众人都希奇他的教训
            S.amazed = true;
            cpose('crowdR', 'stand'); cpose('crowdF', 'stand');
            for (const id of DISC.concat(SIDE)) pose(id, 'stand');
            pose('jesus', 'stand'); glow('jesus', 0.46);
            cfaceJ('crowdR'); cfaceJ('crowdF');
            for (const id of SIDE) faceJ(id);
            sfx(b, 'crowd', { soft: true });
          }],
          [16.5, () => { cpose('crowdF', 'raise'); pose('peter', 'raise'); }],
          [19.5, () => { cpose('crowdF', 'stand'); pose('peter', 'stand'); }],
          [20.5, b => { lv('srLamps', 0.8, b); lv('srCity', 0.7, b); lv('srFar', 1, b); }],
          // 他下山去，门徒跟着
          [21.5, () => {
            S.down = true;
            go('jesus', port() ? -0.34 : -0.36, port() ? 0.6 : 0.56, 'stand', 0.016);
          }],
          [22.6, () => { go('peter', port() ? -0.2 : -0.24, port() ? 0.44 : 0.4, 'stand', 0.016); go('john', port() ? -0.08 : -0.1, port() ? 0.36 : 0.32, 'stand', 0.016); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '登山宝训', sub: '马太福音 5 — 7', tint: [255, 240, 210], music: 'psalms',
    outro: 22,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '耶稣': { text: '耶稣看见这许多的人，就上了山，<br>既已坐下，门徒到他跟前来，<br>他就开口教训他们，说：', ref: '马太福音 5:1–2' },
      '彼得': { text: '耶稣对他们说：<br>「来跟从我，我要叫你们得人如得鱼一样。」', ref: '马太福音 4:19' },
      '安得烈': { text: '耶稣在加利利海边行走，看见弟兄二人，<br>就是那称呼彼得的西门和他兄弟安得烈，<br>在海里撒网；他们本是打鱼的。', ref: '马太福音 4:18' },
      '雅各': { text: '他们立刻舍了船，别了父亲，<br>跟从了耶稣。', ref: '马太福音 4:22' },
      '约翰': { text: '他们立刻舍了船，别了父亲，<br>跟从了耶稣。', ref: '马太福音 4:22' },
      '众人': { text: '耶稣讲完了这些话，<br>众人都希奇他的教训；', ref: '马太福音 7:28' },
      '哀恸的人': { text: '哀恸的人有福了！<br>因为他们必得安慰。', ref: '马太福音 5:4' },
      '安慰人的': { text: '怜恤人的人有福了！<br>因为他们必蒙怜恤。', ref: '马太福音 5:7' },
      '弟兄': { text: '所以，你在祭坛上献礼物的时候，<br>若想起弟兄向你怀怨，<br>就把礼物留在坛前，<br>先去同弟兄和好，然后来献礼物。', ref: '马太福音 5:23–24' },
      '使人和睦的人': { text: '使人和睦的人有福了！<br>因为他们必称为神的儿子。', ref: '马太福音 5:9' },
      '穷人': { text: '有求你的，就给他；<br>有向你借贷的，不可推辞。', ref: '马太福音 5:42' },
      '施舍的人': { text: '你施舍的时候，<br>不要叫左手知道右手所做的，', ref: '马太福音 6:3' },
      '父亲': { text: '你们虽然不好，尚且知道拿好东西给儿女，<br>何况你们在天上的父，<br>岂不更把好东西给求他的人吗？', ref: '马太福音 7:11' },
      '儿子': { text: '你们中间谁有儿子求饼，反给他石头呢？', ref: '马太福音 7:9' },
      '家主': { text: '因为凡祈求的，就得着；寻找的，就寻见；<br>叩门的，就给他开门。', ref: '马太福音 7:8' },
      '门': { text: '你们祈求，就给你们；<br>寻找，就寻见；<br>叩门，就给你们开门。', ref: '马太福音 7:7' },
      '山': { text: '耶稣看见这许多的人，就上了山，', ref: '马太福音 5:1' },
      '山上的城': { text: '你们是世上的光。<br>城造在山上是不能隐藏的。', ref: '马太福音 5:14' },
      '迦百农': { text: '后又离开拿撒勒，往迦百农去，就住在那里。<br>那地方靠海，在西布伦和拿弗他利的边界上。', ref: '马太福音 4:13' },
      '船': { text: '他们立刻舍了船，别了父亲，<br>跟从了耶稣。', ref: '马太福音 4:22' },
      '窄门': { text: '引到永生，那门是窄的，<br>路是小的，找着的人也少。', ref: '马太福音 7:14' },
      '小路': { text: '引到永生，那门是窄的，<br>路是小的，找着的人也少。', ref: '马太福音 7:14' },
      '宽路': { text: '因为引到灭亡，那门是宽的，路是大的，<br>进去的人也多；', ref: '马太福音 7:13' },
      '行路的人': { text: '因为引到灭亡，那门是宽的，路是大的，<br>进去的人也多；', ref: '马太福音 7:13' },
      '好树': { text: '好树不能结坏果子；<br>坏树不能结好果子。', ref: '马太福音 7:18' },
      '无花果树': { text: '凭着他们的果子，就可以认出他们来。<br>荆棘上岂能摘葡萄呢？<br>蒺藜里岂能摘无花果呢？', ref: '马太福音 7:16' },
      '荆棘': { text: '荆棘上岂能摘葡萄呢？<br>蒺藜里岂能摘无花果呢？', ref: '马太福音 7:16' },
      '百合花': { text: '你想野地里的百合花怎么长起来；<br>它也不劳苦，也不纺线。', ref: '马太福音 6:28' },
      '聪明人': { text: '所以，凡听见我这话就去行的，<br>好比一个聪明人，<br>把房子盖在磐石上；', ref: '马太福音 7:24' },
      '磐石上的房子': { text: '雨淋，水冲，风吹，撞着那房子，<br>房子总不倒塌，<br>因为根基立在磐石上。', ref: '马太福音 7:25' },
      '无知的人': { text: '凡听见我这话不去行的，<br>好比一个无知的人，<br>把房子盖在沙土上；', ref: '马太福音 7:26' },
      '沙土上的房子': { text: '雨淋，水冲，风吹，撞着那房子，<br>房子就倒塌了，并且倒塌得很大。', ref: '马太福音 7:27' },
      '磐石': { text: '所以，凡听见我这话就去行的，<br>好比一个聪明人，把房子盖在磐石上；<br>雨淋，水冲，风吹，撞着那房子，<br>房子总不倒塌，因为根基立在磐石上。', ref: '马太福音 7:24–25' },
      '沙土': { text: '凡听见我这话不去行的，<br>好比一个无知的人，把房子盖在沙土上；<br>雨淋，水冲，风吹，撞着那房子，<br>房子就倒塌了，并且倒塌得很大。', ref: '马太福音 7:26–27' },
    },
  });
})(window.GS);
