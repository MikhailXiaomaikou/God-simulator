/* ─────────────────────────────────────────────────────────────
 * book/psalms.js —— 诗篇 · 诗篇（诗篇 1 — 150）
 *
 * 诗篇五卷，讲成一日又一日、一生又一生的歌。牧人大卫和他的羊群在近地上，溪水、树、水池、耶和华的殿：
 *   卷一（1–41）：溪水从右边的山脊流下，一棵树栽在溪水旁，按时候结果子，糠秕被风吹散（1）；
 *     夜里，灵停在天上何处，神就在那里陈设一座星宿——众星连成一张琴（8:3，本卷的第一幅签名之景），
 *     牧人抱琴坐在星下；诸天述说神的荣耀：量带划过天空，太阳如新郎出洞房（19）；
 *     青草地上、可安歇的水边，羊群躺卧（23:1–3）；死荫的幽谷——遍地昏暗，一条光的路，
 *     「你与我同在」的光随着他；筵席与满溢的福杯，耶和华的殿在山上亮起（23:4–6，32:8）；
 *     耶和华的声音发在水上：暴风、雷、火焰分岔（29）。
 *   卷二（42–72）：「你们要休息，要知道我是神」——风息浪静，天光破云；清洁的心；一只鹿来到水边饮水（46:10，51:10，42:1）。
 *   卷三（73–89）：一棵葡萄树从埃及挪来，爬满了地；「你要大大张口，我就给你充满」——葡萄满了枝子；
 *     「使你的脸发光」——落日的荣光（80，81:10）。
 *   卷四（90–106）：「你们世人要归回」——千年如已过的昨日，日夜飞转，草早晨发芽、晚上枯干，牧人老了（90）；
 *     「山中的飞鸟，我都知道」——灵在哪里，飞鸟就从那里生出；泉源涌在山间，野山羊上了高山，鲸在海中（50:11，104）。
 *   卷五（107–150）：上行的人提着灯往耶和华的殿去，夜里睡在山上；保护以色列的不打盹也不睡觉（119，121，122）；
 *     清晨的翅膀自日出之处展开，一只光的鸟飞到海极（139）；
 *     「凡有气息的都要赞美耶和华！」——万物一齐动起来：众民举手跳舞、击鼓吹角，牧人弹琴，
 *     走兽、飞鸟、鱼、鲸，一切有气息的都呼出光来，升到天上（150:6，本卷的签名之景，诗篇的终章）。
 *
 * 画面的方位：左 = 海（东，日出），右 = 陆地（西，日落）。近地上：溪水自右边的山脊（0.905）流下，
 *   经过树旁（0.705）、汇成水池（0.585），流入左边的海；耶和华的殿在中丘（0.8）上。
 * 话语都是神自己的话（147:4 称星宿的名、以西结书 34:15 亲自作羊的牧人、32:8、46:10、81:10、90:3、50:11），
 *   或是说神作为的一句（1:6、19:1、29:3、121:4、139:12、150:6）；诗人向神说的话只在经文里出现。
 * 大卫总在羊群之外、纵深在羊之前；上行的人、众民都不站在羊群里；走兽只在海边那一头。
 * 规矩：一切状态只在 setup / apply / 情节里设定（瞬间重演得到同样的世界）；布景只在本卷进行时绘制。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'psalms';
  const LV = W.lv;
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('psStream', 'lin', 0.12);   // 溪水自山脊流下（1:3）
  W.defineLevel('psTree', 'lin', 0.085);    // 栽在溪水旁的树长成
  W.defineLevel('psFruit', 'exp', 0.45);    // 按时候结果子
  W.defineLevel('psLyre', 'lin', 0.24);     // 你所陈设的月亮星宿（8:3）：一颗一颗亮起，连成一张琴
  W.defineLevel('psLine', 'exp', 0.5);      // 它的量带通遍天下（19:4）
  W.defineLevel('psPool', 'exp', 0.35);     // 可安歇的水边（23:2）
  W.defineLevel('psPath', 'lin', 0.2);      // 指示你当行的路（32:8）：一条光的路
  W.defineLevel('psWith', 'exp', 0.6);      // 你与我同在（23:4）：随着牧人的光
  W.defineLevel('psTable', 'exp', 0.5);     // 筵席与满溢的福杯（23:5）
  W.defineLevel('psOil', 'exp', 0.5);       // 用油膏了我的头
  W.defineLevel('psZion', 'exp', 0.35);     // 耶和华的殿的光（23:6 → 122 → 150）
  W.defineLevel('psSway', 'exp', 0.7);      // 暴风中树的摇动（29）
  W.defineLevel('psRay', 'exp', 0.45);      // 风息浪静，天光破云（46:10）
  W.defineLevel('psDeer', 'lin', 0.075);    // 如鹿切慕溪水（42:1）
  W.defineLevel('psVine', 'lin', 0.07);     // 葡萄树爬满了地（80:8–11）
  W.defineLevel('psGrape', 'exp', 0.4);     // 葡萄熟了
  W.defineLevel('psFace', 'exp', 0.5);      // 使你的脸发光（80:19）
  W.defineLevel('psField', 'lin', 0.7);     // 早晨发芽生长（90:6）
  W.defineLevel('psWither', 'lin', 0.6);    // 晚上割下枯干
  W.defineLevel('psSpring', 'lin', 0.15);   // 泉源涌在山谷（104:10）
  W.defineLevel('psLamp', 'exp', 0.6);      // 你的话是我脚前的灯（119:105）
  W.defineLevel('psKeep', 'exp', 0.3);      // 保护以色列的，不打盹也不睡觉（121:4）
  W.defineLevel('psWings', 'exp', 0.35);    // 清晨的翅膀（139:9）
  W.defineLevel('psFlight', 'lin', 0.085);  // 飞到海极
  W.defineLevel('psPraise', 'exp', 0.45);   // 在神的圣所赞美他（150）
  W.defineLevel('psBreath', 'exp', 0.6);    // 凡有气息的（150:6）：万物呼出光来
  const MY = ['psStream', 'psTree', 'psFruit', 'psLyre', 'psLine', 'psPool', 'psPath', 'psWith', 'psTable', 'psOil', 'psZion',
    'psSway', 'psRay', 'psDeer', 'psVine', 'psGrape', 'psFace', 'psField', 'psWither', 'psSpring', 'psLamp', 'psKeep',
    'psWings', 'psFlight', 'psPraise', 'psBreath'];

  // ── 地上的位置（画面宽度的比例；近地的纵深 v：0 = 脊线，1 = 画面底）──
  // 大卫总站在羊群之外（x 相距 ≥ 0.04），纵深 v 大于每一只羊（羊的 v 在 0.01–0.08）：不被羊群遮住
  const X = {
    src: 0.905, tree: 0.705, treeV: 0.035, pool: 0.572, poolV: 0.49,
    dav: 0.64, davV: 0.16,            // 起初：羊群（0.5–0.59）右边
    davP: 0.664, davPV: 0.46,         // 23:2 跪在可安歇的水边（水池的右岸）
    dav2: 0.72, dav2V: 0.2,           // 29 篇以后：树前、溪水后
    table: 0.845, tableV: 0.2, zion: 0.8, deerV: 0.44,
  };
  // 溪水：[x, v]，自右边的山脊流下，经过树前，汇成水池，流入左边的海
  const STREAM = [[0.905, 0.0], [0.875, 0.06], [0.835, 0.13], [0.785, 0.19], [0.74, 0.23], [0.695, 0.25], [0.655, 0.3],
    [0.625, 0.39], [0.596, 0.46], [0.572, 0.49], [0.54, 0.485], [0.508, 0.44], [0.478, 0.37], [0.45, 0.29], [0.422, 0.2], [0.392, 0.12], [0.37, 0.06]];
  // 光的路（32:8）：自水池旁（大卫跪的地方）穿过幽谷，在溪水之前，到筵席那里
  const PATH = [[0.672, 0.43], [0.69, 0.37], [0.715, 0.335], [0.748, 0.318], [0.78, 0.306], [0.808, 0.296], [0.83, 0.29]];

  const ROBE_D = [92, 104, 146];
  const TRUNK = [70, 52, 36], LEAF = [74, 124, 60], LEAF_D = [42, 80, 46], LEAF_H = [150, 190, 104], FRUIT = [214, 96, 60];
  const VLEAF = [100, 156, 68], VLEAF_D = [56, 104, 50], VLEAF_H = [172, 206, 110], GRAPE = [104, 54, 116];
  const STONE = [214, 200, 172], HOUSE = [196, 178, 146], GOLD = [236, 198, 112];
  const FLW = [[244, 211, 94], [232, 106, 146], [246, 241, 231], [154, 127, 224]];

  // 星宿之琴（半径为 1 的比例；第三项是亮度）
  const LYRE = [
    [0.0, 0.8, 1.9],                              // 0 琴箱之底
    [-0.38, 0.66, 1.3], [0.38, 0.66, 1.3],        // 1,2 琴箱的两肩
    [-0.44, 0.26, 1.6], [0.44, 0.26, 1.6],        // 3,4 琴箱之顶
    [-0.66, -0.16, 1.4], [0.66, -0.16, 1.4],      // 5,6 两臂向外弯
    [-0.5, -0.58, 2.1], [0.5, -0.58, 2.1],        // 7,8 琴枕的两端
    [-0.76, -0.9, 1.7], [0.76, -0.9, 1.7],        // 9,10 两臂之顶（如角向外卷）
    [0.0, -0.6, 2.8],                             // 11 琴枕正中（最亮）
  ];
  const LYRE_E = [[1, 0], [0, 2], [1, 3], [2, 4], [3, 4], [3, 5], [5, 7], [7, 9], [4, 6], [6, 8], [8, 10], [7, 11], [11, 8]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { lyre: null, renew: null, harp: false, dance: false, instr: false, aged: false }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.35 : 1) * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const fY = (xf, v, l) => { const L = l == null ? 2 : l; const g = gY(L, xf); return g + (v || 0) * fieldH(L, g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const port = () => W.w < W.h * 0.9;
  const easeOut = t => { t = clamp(t, 0, 1); return 1 - (1 - t) * (1 - t) * (1 - t); };
  const inst = b => !!(b && b.instant) || !!W.replaying;
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function sfx(b, name, o) { if (inst(b)) return; const a = au(); if (a && a.sfx) U.safe('psalms.sfx', () => a.sfx(name, o || {})); }
  function hint(b, text, sec) { if (inst(b) || !GS.ui || !GS.ui.hint) return; U.safe('psalms.hint', () => GS.ui.hint(text, sec || 5)); }
  // 天与水的颜色（随时辰）
  function skyRGB() {
    let c = mix([10, 16, 34], [104, 150, 204], W.dayFactor * LV.light);
    c = mix(c, [226, 150, 118], W.dusk * 0.55);
    return mix(c, [58, 62, 74], LV.storm * 0.7);
  }
  function waterRGB() {
    let c = mix(skyRGB(), [26, 58, 100], 0.34);
    c = mix(c, [255, 252, 244], 0.1 * W.daylight);
    return mix(c, [40, 46, 56], LV.storm * 0.4);
  }

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function crowd(gid, o) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    return C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    return U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o))) || [];
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d;
      if (W.replaying) m.fd = m.facing;
    }
  }
  // 群中各人 / 各羊的纵深按序号定下（不随机：重演、恢复都一样），排成前后两三排，不站成一条线
  function spreadV(gid, v0, v1) {
    cmembers(gid).forEach((m, i) => { m.v = v0 + (v1 - v0) * ((i * 0.618034 + 0.17) % 1); });
  }
  // 群中各人的位置按序号定下（避开大卫与筵席）
  function placeX(gid, xs) {
    cmembers(gid).forEach((m, i) => { if (xs[i] != null) { m.nx = xs[i]; m.tx = null; } });
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * X.dav2, fY(X.dav2, X.dav2V) - 34 * LS(2) * k];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, fY(f.nx, f.v, l) - 34 * LS(l) * k];
  }
  const personH = id => { const f = fig(id); return f && f._h > 2 ? f._h : 34 * LS(2); };

  // 光的精灵（预先画好的柔光）
  let SP = null;
  function sprites() {
    if (SP) return SP;
    SP = {};
    const mk = (rgb, n, mid) => {
      const c = document.createElement('canvas'); c.width = c.height = n;
      const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      gr.addColorStop(0, rgba(rgb, 1)); gr.addColorStop(mid, rgba(rgb, 0.36)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, n, n);
      return c;
    };
    try {
      SP.warm = mk([255, 204, 138], 64, 0.3); SP.pale = mk([255, 246, 228], 64, 0.3);
      SP.cool = mk([200, 216, 255], 64, 0.28); SP.gold = mk([255, 224, 150], 64, 0.4);
      // 气息的光点：白亮的芯、金色的晕（一次画成）
      const mote = (rgb) => {
        const n = 48, c = document.createElement('canvas'); c.width = c.height = n;
        const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        gr.addColorStop(0, 'rgba(255,255,250,1)'); gr.addColorStop(0.16, 'rgba(255,252,236,0.95)'); gr.addColorStop(0.3, rgba(rgb, 0.4)); gr.addColorStop(1, rgba(rgb, 0));
        g.fillStyle = gr; g.fillRect(0, 0, n, n);
        return c;
      };
      SP.mote = mote([255, 244, 226]); SP.moteW = mote([255, 214, 140]);
      // 柔光的光束：自源头渐宽、渐淡，两边柔化（不是硬边的扇形）；逐像素画成一次
      const beam = (rgb) => {
        const bw = 192, bh = 48, c = document.createElement('canvas'); c.width = bw; c.height = bh;
        const g = c.getContext('2d'), im = g.createImageData(bw, bh), d = im.data;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
          const t = (x + 0.5) / bw, dy = Math.abs(y + 0.5 - bh / 2) / (bh / 2);
          const hw = 0.16 + 0.84 * t, q = dy / hw;
          const a = Math.pow(1 - t, 1.7) * Math.min(1, t * 14) * Math.exp(-q * q * 2.6);
          const i = (y * bw + x) * 4;
          d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = Math.round(255 * Math.min(1, a));
        }
        g.putImageData(im, 0, 0);
        return c;
      };
      SP.beam = beam([255, 238, 206]); SP.beamW = beam([255, 214, 150]);
    } catch (e) { /* 无画布时略过 */ }
    return SP;
  }
  // 一道柔光：自 (x, y) 朝 ang 方向，长 len，末端宽 wid
  function beamAt(ctx, img, x, y, ang, len, wid, a) {
    if (!img || !(a > 0.004) || !(len > 1) || !isFinite(x) || !isFinite(y)) return;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, 0, -wid / 2, len, wid);
    ctx.restore();
  }
  function glowAt(ctx, img, x, y, r, a) {
    if (!img || !(a > 0.004) || !(r > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - r, y - r, 2 * r, 2 * r);
  }

  // ════════════════════════════════════════════════════════════
  //  几何：随屏幕缩放（大地的细节就绪或改变时重新量过）
  // ════════════════════════════════════════════════════════════
  const P = { w: 0, h: 0, gy: 0 };
  let G = null;
  function catmull(cp, n) {
    const out = [];
    for (let i = 0; i < cp.length - 1; i++) {
      const p0 = cp[Math.max(0, i - 1)], p1 = cp[i], p2 = cp[i + 1], p3 = cp[Math.min(cp.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t, o = [];
        for (let j = 0; j < p1.length; j++) o.push(0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3));
        out.push(o);
      }
    }
    out.push(cp[cp.length - 1].slice());
    return out;
  }
  // 折线 → 带弧长、切线、法线的点
  function arcify(list, hwFn) {
    const out = [];
    let acc = 0;
    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      if (i) acc += Math.hypot(q[0] - list[i - 1][0], q[1] - list[i - 1][1]);
      out.push({ x: q[0], y: q[1], v: q[2] || 0, s: acc, nx: 0, ny: -1, tx: 1, ty: 0, hw: hwFn ? hwFn(q[2] || 0) : 1 });
    }
    for (let i = 0; i < out.length; i++) {
      const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y;
      const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      out[i].tx = tx; out[i].ty = ty; out[i].nx = -ty; out[i].ny = tx;
    }
    return { pts: out, len: acc };
  }
  function idxAt(pts, d) {
    let lo = 0, hi = pts.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (pts[m].s <= d) lo = m; else hi = m - 1; }
    return lo;
  }
  function layout() {
    const gy = gY(2, 0.7);
    if (G && P.w === W.w && P.h === W.h && Math.abs(gy - P.gy) < 0.75) return G;
    P.w = W.w; P.h = W.h; P.gy = gy;
    G = build();
    return G;
  }
  function build() {
    const s = LS(2), s1 = LS(1), g = { s, s1 };
    // 海岸：近地在此没入海中
    let shore = 0.36;
    for (let xf = 0.55; xf > 0.3; xf -= 0.004) if (gY(2, xf) > W.h * 0.975) { shore = xf + 0.004; break; }
    g.shore = shore;
    // 溪水
    const cp = STREAM.map(([xf, v]) => [xf * W.w, fY(xf, v), v]);
    const raw = catmull(cp, 7).filter(q => q[0] >= shore * W.w && gY(2, q[0] / W.w) < W.h * 0.975);
    g.stream = arcify(raw, v => (2.4 + 9 * v) * s * 0.55);
    // 水池
    const prx = Math.max(0.075 * W.w, 40 * s);
    g.pool = { x: X.pool * W.w, y: fY(X.pool, X.poolV), rx: prx, ry: prx * 0.21 };
    // 树
    g.tree = { x: X.tree * W.w, y: fY(X.tree, X.treeV) + 1, H: 115 * s };
    // 筵席
    g.table = { x: X.table * W.w, y: fY(X.table, X.tableV), s: s * 1.3 };
    // 光的路
    g.path = arcify(catmull(PATH.map(([xf, v]) => [xf * W.w, fY(xf, v), v]), 6), v => (3 + 7 * v) * s * 0.55);
    // 耶和华的殿（中丘）与城中的房屋
    const ts = 1.6 * s1;
    g.zion = { x: X.zion * W.w, y: gY(1, X.zion) + 1.5 * ts, s: ts };
    const R = U.mulberry32(4848);
    g.houses = [];
    for (const [a, b, n] of [[-62, -38, 3], [30, 58, 3]]) for (let i = 0; i < n; i++) g.houses.push({ dx: lerp(a, b, (i + 0.2 + R() * 0.6) / n), w: 7 + R() * 5, h: 6 + R() * 6, t: R() });
    g.houses.sort((p, q) => Math.abs(q.dx) - Math.abs(p.dx));
    // 葡萄树
    g.vine = buildVine(s, s1, shore);
    // 早晨的草与花（90:5–6）
    const Rm = U.mulberry32(9090), blades = [];
    const nb = port() ? 80 : 110;
    for (let i = 0; i < nb; i++) {
      const xf = lerp(0.62, 0.84, Rm()), v = lerp(0.5, 0.96, Math.pow(Rm(), 0.8));
      blades.push({ x: xf * W.w, y: fY(xf, v), h: (5 + 7 * Rm()) * s * (0.8 + 0.5 * v), lean: (Rm() - 0.5) * 0.5, dir: Rm() < 0.5 ? -1 : 1,
        fl: Rm() < 0.22 ? FLW[Math.floor(Rm() * FLW.length)] : null, sd: Rm() * 10, tone: Rm() < 0.5 ? 1 : 0 });
    }
    blades.sort((p, q) => p.y - q.y);
    g.blades = blades;
    // 山间的泉源（中丘临海的坡上）
    g.springs = [0.548, 0.592, 0.868].map((xf, k) => {
      const pts = [], y0 = gY(1, xf) + 1, y1 = W.waterlineY(1);
      const dx = (k === 1 ? -7 : 7) * s1;
      for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([xf * W.w + t * dx + Math.sin(t * Math.PI) * 2 * s1, lerp(y0, y1, t)]); }
      return pts;
    });
    return g;
  }
  function buildVine(s, s1, shore) {
    const R = U.mulberry32(8080);
    const mkPath = (pts, sc, dens) => {
      const A = arcify(pts);
      const leaves = [];
      for (let d = 5 * sc; d < A.len; d += (6.5 + R() * 5) * sc / dens) {
        const p = A.pts[idxAt(A.pts, d)];
        const up = R() < 0.8 ? -1 : 1;
        leaves.push({ d, x: p.x + (R() - 0.5) * 4 * sc, y: p.y + up * (2.5 + R() * 4.5) * sc, r: (4.6 + R() * 3.8) * sc, rot: (R() - 0.5) * 1.3,
          tone: R() < 0.5 ? 1 : 0, grape: R() < 0.17, curl: R() < 0.22, cs: R() < 0.5 ? -1 : 1 });
      }
      A.leaves = leaves;
      return A;
    };
    const near = [];
    for (let xf = 1.02; xf >= shore; xf -= 0.005) {
      const v = 0.02 + 0.014 * Math.sin(xf * 31);
      near.push([xf * W.w, fY(Math.min(xf, 1), v) - (2 + 7 * Math.pow(Math.abs(Math.sin(xf * 47)), 1.5)) * s]);
    }
    const mid = [];
    for (let xf = 1.0; xf >= 0.52; xf -= 0.005) mid.push([xf * W.w, gY(1, xf) - (1.2 + 4 * Math.pow(Math.abs(Math.sin(xf * 61)), 1.5)) * s1]);
    const br = catmull([[0.9, 0.02], [0.87, 0.06], [0.83, 0.1], [0.79, 0.13], [0.755, 0.155]].map(([xf, v]) => [xf * W.w, fY(xf, v)]), 6);
    const V = { near: mkPath(near, s, 1), mid: mkPath(mid, s1, 0.9), br: mkPath(br, s, 1.1) };
    // 长成之后的缓存范围（像素）
    const box = (list, pad) => {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const A of list) for (const p of A.pts) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
      return [Math.max(0, Math.floor(x0 - pad)), Math.floor(y0 - pad), Math.min(W.w, Math.ceil(x1 + pad)), Math.ceil(y1 + pad)];
    };
    V.boxN = box([V.near, V.br], 16 * s); V.boxM = box([V.mid], 14 * s1);
    return V;
  }

  // ════════════════════════════════════════════════════════════
  //  画：溪水、水池
  // ════════════════════════════════════════════════════════════
  const PK = 0.55;       // 地面上的带子：横向的宽度在纵深里压扁
  function ribbon(ctx, pts, front, wk, taper) {
    let n = 0;
    while (n < pts.length && pts[n].s <= front) n++;
    if (n < 2) return 0;
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const p = pts[i], w = p.hw * wk * clamp((front - p.s) / taper, 0.2, 1); ctx.lineTo(p.x + p.nx * w, p.y + p.ny * w * PK); }
    for (let i = n - 1; i >= 0; i--) { const p = pts[i], w = p.hw * wk * clamp((front - p.s) / taper, 0.2, 1); ctx.lineTo(p.x - p.nx * w, p.y - p.ny * w * PK); }
    ctx.closePath();
    ctx.fill();
    return n;
  }
  function drawStream(ctx, g) {
    const k = LV.psStream;
    const A = g.stream, pts = A.pts;
    if (k < 0.002 || pts.length < 2) return;
    const front = k * A.len, taper = 24 * g.s, wc = waterRGB();
    // 湿岸
    ctx.fillStyle = css([50, 44, 32], 2, 0.5);
    ribbon(ctx, pts, front, 1.75, taper);
    // 水
    ctx.fillStyle = rgba(wc, 0.94);
    const n = ribbon(ctx, pts, front, 1, taper);
    if (n < 2) return;
    // 远岸一线天光
    const lit = 0.3 + 0.45 * W.daylight + 0.3 * nightK() * LV.moon;
    ctx.strokeStyle = rgba(mix(skyRGB(), [255, 252, 240], 0.55), 0.3 * lit);
    ctx.lineWidth = Math.max(0.5, 0.7 * g.s * 0.6);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const p = pts[i], w = p.hw * 0.6; if (i) ctx.lineTo(p.x + p.nx * w, p.y + p.ny * w * PK); else ctx.moveTo(p.x + p.nx * w, p.y + p.ny * w * PK); }
    ctx.stroke();
    // 顺流而下的闪光
    const spd = 30 * g.s, gap = 15 * g.s, off0 = (W.t * spd) % gap;
    ctx.strokeStyle = rgba(mix(skyRGB(), [255, 252, 240], 0.65), 0.55 * lit);
    ctx.lineWidth = Math.max(0.6, 0.85 * g.s * 0.6);
    ctx.beginPath();
    let j = 0;
    for (let d = off0; d < front - 3; d += gap) {
      while (j < n - 1 && pts[j + 1].s < d) j++;
      const p = pts[j], key = Math.round((d - W.t * spd) / gap);
      const off = (hsh(key * 1.73) - 0.5) * p.hw * 1.1, L = (2 + 3 * p.v) * g.s * 0.8;
      const cx = p.x + p.nx * off, cy = p.y + p.ny * off * PK;
      ctx.moveTo(cx - p.tx * L * 0.5, cy - p.ty * L * 0.5); ctx.lineTo(cx + p.tx * L * 0.5, cy + p.ty * L * 0.5);
    }
    ctx.stroke();
    // 雨点落在溪上
    if (LV.rain > 0.1) rainRings(ctx, pts, n, g.s);
    // 入海处的白沫
    if (front >= A.len - 2 && SP) {
      const e = pts[pts.length - 1];
      ctx.fillStyle = rgba([236, 244, 252], 0.35 * dayA());
      for (let i = 0; i < 4; i++) {
        const ph = (W.t * 0.8 + i * 0.25) % 1;
        ctx.beginPath(); ctx.ellipse(e.x - ph * 7 * g.s, e.y + 1 + ph * 2 * g.s, (2 + ph * 4) * g.s * 0.6, (0.6 + ph) * g.s * 0.5, 0, 0, TAU); ctx.fill();
      }
    }
    // 源头的泉：涌出的微光
    if (SP && k > 0.02) {
      const p = pts[0], nk = nightK();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.cool, p.x, p.y - 1, 9 * g.s, (0.18 + 0.2 * nk) * Math.min(1, k * 4));
      ctx.restore();
    }
  }
  function rainRings(ctx, pts, n, s) {
    ctx.strokeStyle = rgba([220, 230, 244], 0.35 * LV.rain * dayA());
    ctx.lineWidth = Math.max(0.5, 0.6 * s * 0.6);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const ph = W.t * 1.7 + hsh(i * 3.3), cyc = Math.floor(ph), f = ph - cyc;
      const p = pts[Math.floor(hsh(i * 7.1 + cyc * 1.9) * (n - 1))];
      const r = (0.6 + 3 * f) * s * 0.7;
      ctx.moveTo(p.x + r, p.y); ctx.ellipse(p.x, p.y, r, r * 0.3, 0, 0, TAU);
    }
    ctx.stroke();
  }
  function drawPool(ctx, g) {
    const k = LV.psPool;
    if (k < 0.004) return;
    const p = g.pool, e = 0.3 + 0.7 * k, rx = p.rx * e, ry = p.ry * e;
    const A = Math.min(1, k * 1.6);
    // 草岸：柔和的一圈，边上渐渐没入草地（不是硬边）
    ctx.save();
    ctx.translate(p.x, p.y + ry * 0.14); ctx.scale(1, (ry * 1.5) / (rx * 1.2));
    const bk = ctx.createRadialGradient(0, 0, rx * 0.7, 0, 0, rx * 1.2);
    bk.addColorStop(0, css([40, 66, 38], 2, 0.9 * A)); bk.addColorStop(0.55, css([46, 74, 40], 2, 0.6 * A)); bk.addColorStop(1, css([52, 82, 44], 2, 0));
    ctx.fillStyle = bk;
    ctx.beginPath(); ctx.arc(0, 0, rx * 1.2, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = A;
    // 静水：远岸映着天（亮），近处深些
    const sky = skyRGB(), wc = waterRGB();
    const gr = ctx.createLinearGradient(0, p.y - ry, 0, p.y + ry);
    gr.addColorStop(0, rgba(mix(sky, [255, 252, 240], 0.18 * W.daylight), 1)); gr.addColorStop(0.45, rgba(mix(sky, wc, 0.35), 1));
    gr.addColorStop(1, rgba(mix(wc, [8, 14, 24], 0.25), 1));
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, ry, 0, 0, TAU); ctx.fill();
    // 水边的一圈柔影（近岸），远岸一线天光
    ctx.lineWidth = Math.max(1, 2.2 * g.s * 0.6);
    ctx.strokeStyle = rgba([12, 22, 30], 0.18);
    ctx.beginPath(); ctx.ellipse(p.x, p.y + 0.5, rx - 1, ry - 1, 0, 0.1, Math.PI - 0.1); ctx.stroke();
    ctx.strokeStyle = rgba(mix(sky, [255, 252, 240], 0.6), 0.35 * (0.3 + 0.7 * W.daylight));
    ctx.lineWidth = Math.max(0.6, 1 * g.s * 0.6);
    ctx.beginPath(); ctx.ellipse(p.x, p.y + 0.5, rx - 1.5, ry - 1.2, 0, Math.PI + 0.25, TAU - 0.25); ctx.stroke();
    // 日与月的倒影
    const mk = nightK() * LV.moon;
    if (SP) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      if (mk > 0.05) glowAt(ctx, SP.cool, p.x - rx * 0.25, p.y, ry * 1.6, 0.35 * mk * A);
      if (W.daylight > 0.2) glowAt(ctx, SP.pale, p.x + rx * 0.2, p.y - ry * 0.25, ry * 1.8, 0.16 * W.daylight * A);
      ctx.restore();
      ctx.globalAlpha = A;
    }
    // 静水的亮线
    const lit = 0.3 + 0.7 * W.daylight;
    ctx.strokeStyle = rgba([255, 250, 236], 0.28 * lit + 0.2 * mk);
    ctx.lineWidth = Math.max(0.5, 0.8 * g.s * 0.6);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const yy = p.y + ry * (-0.45 + i * 0.28), hw = rx * Math.sqrt(Math.max(0, 1 - Math.pow((yy - p.y) / ry, 2))) * (0.35 + 0.2 * hsh(i));
      const cx = p.x + (hsh(i * 3.1) - 0.5) * rx * 0.6 + Math.sin(W.t * 0.4 + i) * rx * 0.05;
      ctx.moveTo(cx - hw, yy); ctx.lineTo(cx + hw, yy);
    }
    ctx.stroke();
    // 涟漪：雨中，或鹿在饮水
    const drink = LV.psDeer >= 0.999 && LV.psBreath < 0.3;
    if (LV.rain > 0.08 || drink) {
      ctx.strokeStyle = rgba([226, 236, 248], 0.4 * dayA());
      ctx.beginPath();
      const N = LV.rain > 0.08 ? 7 : 2;
      for (let i = 0; i < N; i++) {
        const ph = W.t * (drink && i < 2 ? 0.45 : 1.3) + hsh(i * 5.1), f = ph - Math.floor(ph);
        const cx = drink && i < 2 ? p.x + rx * 0.8 : p.x + (hsh(i * 2.7 + Math.floor(ph)) - 0.5) * rx * 1.4;
        const cy = drink && i < 2 ? p.y + ry * 0.05 : p.y + (hsh(i * 4.3 + Math.floor(ph)) - 0.5) * ry;
        const r = (1 + f * 7) * g.s * 0.6;
        ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, TAU);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：栽在溪水旁的树（归一化的 Path2D：树高为 1，y 向上为负）
  // ════════════════════════════════════════════════════════════
  let TREE = null;
  function strip(path, pts) {
    const Lp = [], Rp = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const p = pts[i];
      Lp.push([p[0] - ty * p[2], p[1] + tx * p[2]]);
      Rp.push([p[0] + ty * p[2], p[1] - tx * p[2]]);
    }
    path.moveTo(Lp[0][0], Lp[0][1]);
    for (let i = 1; i < Lp.length; i++) path.lineTo(Lp[i][0], Lp[i][1]);
    for (let i = Rp.length - 1; i >= 0; i--) path.lineTo(Rp[i][0], Rp[i][1]);
    path.closePath();
  }
  function quadPts(x0, y0, cx, cy, x1, y1, w0, w1, n) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      out.push([a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1, lerp(w0, w1, t)]);
    }
    return out;
  }
  function blob(path, b) { const c = Math.cos(b.rot), sn = Math.sin(b.rot); path.moveTo(b.x + b.rx * c, b.y + b.rx * sn); path.ellipse(b.x, b.y, b.rx, b.ry, b.rot, 0, TAU); }
  function buildTree() {
    if (TREE || typeof Path2D === 'undefined') return TREE;
    const R = U.mulberry32(10103);
    const m = { trunk: new Path2D(), back: new Path2D(), mid: new Path2D(), hi: new Path2D(), fruit: [] };
    const tp = [];
    for (let i = 0; i <= 9; i++) { const t = i / 9; tp.push([0.035 * Math.sin(t * 2.6) * t, -t * 0.6, 0.042 * lerp(1 + 0.9 * Math.pow(1 - t, 5), 0.42, t)]); }
    strip(m.trunk, tp);
    strip(m.trunk, quadPts(0, -0.012, -0.05, -0.004, -0.1, 0.006, 0.02, 0.005, 4));
    strip(m.trunk, quadPts(0, -0.012, 0.05, -0.004, 0.095, 0.006, 0.02, 0.005, 4));
    for (const L of [[-1.0, 0.3, 0.55, 0.62], [0.95, 0.3, 0.6, 0.6], [-0.45, 0.3, 0.82, 0.5], [0.4, 0.28, 0.86, 0.5], [0.05, 0.24, 1, 0.45]]) {
      const b = tp[Math.round(L[2] * 9)];
      const x1 = b[0] + Math.sin(L[0]) * L[1], y1 = b[1] - Math.cos(L[0]) * L[1];
      strip(m.trunk, quadPts(b[0], b[1], (b[0] + x1) / 2 + Math.sin(L[0]) * L[1] * 0.1, (b[1] + y1) / 2 - L[1] * 0.18, x1, y1, 0.042 * L[3], 0.008, 7));
    }
    const tiers = [
      { cx: 0, cy: -0.76, rx: 0.46, ry: 0.2, n: 30, r: 0.1 },
      { cx: -0.3, cy: -0.64, rx: 0.2, ry: 0.11, n: 11, r: 0.085 },
      { cx: 0.3, cy: -0.66, rx: 0.2, ry: 0.11, n: 11, r: 0.085 },
      { cx: 0.02, cy: -0.9, rx: 0.28, ry: 0.1, n: 13, r: 0.085 },
    ];
    const blobs = [];
    for (const t of tiers) for (let i = 0; i < t.n; i++) {
      const a = R() * TAU, rr = i < t.n * 0.45 ? 0.72 + R() * 0.3 : Math.sqrt(R()) * 0.85;
      const x = t.cx + Math.cos(a) * t.rx * rr;
      let y = t.cy + Math.sin(a) * t.ry * rr;
      if (y > t.cy) y = t.cy + (y - t.cy) * 0.6;
      const r = t.r * (0.7 + R() * 0.6);
      blobs.push({ x, y, rx: r, ry: r * (0.62 + R() * 0.2), rot: (R() - 0.5) * 0.9, up: (t.cy - y) / t.ry, rr, t });
    }
    for (const b of blobs) {
      const tone = b.up > -0.3 && R() < 0.7 ? 1 : 0;
      blob(tone ? m.mid : m.back, b);
      if (tone && b.rr > 0.45 && b.y - b.t.cy < b.t.ry * 0.2) blob(m.hi, { x: b.x - b.rx * 0.12, y: b.y - b.ry * 0.3, rx: b.rx * 0.62, ry: b.ry * 0.55, rot: b.rot });
    }
    for (let i = 0; i < 16; i++) {
      const b = blobs[Math.floor(R() * blobs.length)];
      m.fruit.push([b.x + (R() - 0.5) * b.rx * 1.2, b.y + b.ry * (0.2 + R() * 0.6), 0.7 + R() * 0.5]);
    }
    TREE = m;
    return m;
  }
  function drawTree(ctx, g) {
    const k = LV.psTree;
    if (k < 0.003) return;
    const m = buildTree();
    if (!m) return;
    const t = g.tree, gr = easeOut(k), H = t.H * (0.1 + 0.9 * gr);
    const sw = LV.psSway;
    const ang = sw * (0.05 * Math.sin(W.t * 1.9) + 0.03 * Math.sin(W.t * 3.7 + 1.3) - 0.05) + (W.wind || 0) * 0.008 * (1 + sw);
    const nk = nightK();
    ctx.save();
    // 夜里一圈微光：蒙福的树（好在黑夜里认出它）
    if (SP && nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.pale, t.x, t.y - H * 0.7, H * 0.8, 0.07 * nk * gr);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    ctx.translate(t.x, t.y); ctx.rotate(ang); ctx.scale(H, H);
    ctx.fillStyle = css(TRUNK, 2); ctx.fill(m.trunk);
    const la = clamp(gr * 1.6 - 0.2, 0, 1);
    ctx.globalAlpha = la;
    ctx.fillStyle = css(LEAF_D, 2); ctx.fill(m.back);
    ctx.fillStyle = css(LEAF, 2, 1, 0.04); ctx.fill(m.mid);
    ctx.globalAlpha = la * 0.55 * (0.2 + 0.8 * W.daylight);
    ctx.fillStyle = css(LEAF_H, 2, 1, 0.1); ctx.fill(m.hi);
    if (nk > 0.1) { ctx.globalAlpha = la * 0.16 * nk; ctx.fillStyle = 'rgb(160,186,236)'; ctx.fill(m.hi); }
    // 按时候结果子
    const fa = LV.psFruit * la;
    if (fa > 0.01) {
      ctx.globalAlpha = fa;
      ctx.fillStyle = css(FRUIT, 2, 1, 0.06);
      ctx.beginPath();
      for (const f of m.fruit) { const r = 0.017 * f[2]; ctx.moveTo(f[0] + r, f[1]); ctx.arc(f[0], f[1], r, 0, TAU); }
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：耶和华的殿（中丘上）、山间的泉源
  // ════════════════════════════════════════════════════════════
  const litSide = x => ((W.night > 0.55 && LV.moon > 0.3 ? W.moon.x : W.core.x) >= x ? 1 : -1);
  function drawZion(ctx, g) {
    const z = g.zion, s = z.s, x = z.x, y = z.y, l = 1, d = litSide(x);
    const nk = nightK();
    const dim = mix(STONE, [70, 60, 50], 0.4);
    // 城中的房屋
    for (const h of g.houses) {
      const hx = x + h.dx * s, hy = gY(1, hx / W.w) + 1.2 * s, hw = h.w * s, hh = h.h * s;
      ctx.fillStyle = css(mix(HOUSE, STONE, h.t), l);
      ctx.fillRect(hx - hw / 2, hy - hh, hw, hh + 2 * s);
      ctx.fillStyle = css(dim, l, 0.75);
      ctx.fillRect(d > 0 ? hx - hw / 2 : hx + hw / 2 - hw * 0.3, hy - hh, hw * 0.3, hh + 2 * s);
      if (nk > 0.1 && h.t > 0.35) { ctx.fillStyle = rgba([255, 200, 120], 0.8 * nk); ctx.fillRect(hx - 0.9 * s, hy - hh * 0.62, 1.8 * s, 1.8 * s); }
    }
    // 殿台
    ctx.fillStyle = css(STONE, l);
    ctx.beginPath(); ctx.moveTo(x - 34 * s, y + 2 * s); ctx.lineTo(x - 30 * s, y - 5 * s); ctx.lineTo(x + 30 * s, y - 5 * s); ctx.lineTo(x + 34 * s, y + 2 * s); ctx.closePath(); ctx.fill();
    // 院墙
    ctx.fillRect(x - 27 * s, y - 11 * s, 54 * s, 6.5 * s);
    for (let i = 0; i < 9; i++) ctx.fillRect(x - 26.5 * s + i * 6.4 * s, y - 12.6 * s, 2.4 * s, 1.8 * s);
    // 殿身与廊（廊高于殿身；廊前两根铜柱）
    const bright = mix(STONE, [255, 248, 230], 0.2);
    ctx.fillStyle = css(bright, l);
    ctx.fillRect(x - 6 * s, y - 29 * s, 24 * s, 18.5 * s);
    ctx.fillRect(x - 14 * s, y - 35 * s, 9 * s, 24.5 * s);
    ctx.fillStyle = css(dim, l, 0.7);
    if (d > 0) ctx.fillRect(x - 14 * s, y - 35 * s, 2.6 * s, 24.5 * s);
    else ctx.fillRect(x + 12 * s, y - 29 * s, 6 * s, 18.5 * s);
    ctx.fillStyle = css([176, 132, 84], l, 1, 0.05);
    for (const px of [-16.2, -2.8]) { ctx.fillRect(x + px * s - 0.9 * s, y - 24 * s, 1.8 * s, 13.2 * s); ctx.fillRect(x + px * s - 1.6 * s, y - 25.6 * s, 3.2 * s, 1.9 * s); }
    // 门
    ctx.fillStyle = css([34, 26, 20], l);
    ctx.fillRect(x - 11.2 * s, y - 20.5 * s, 3.4 * s, 9.5 * s);
    // 金边（向光的一边）
    ctx.strokeStyle = css(GOLD, l, 0.75 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, y - 35 * s); ctx.lineTo(x - 5 * s, y - 35 * s);
    ctx.moveTo(x - 5 * s, y - 29 * s); ctx.lineTo(x + 18 * s, y - 29 * s);
    ctx.stroke();
    // 殿的光：夜里的灯；言说时的荣光
    const zk = LV.psZion * (0.3 + 0.7 * nk) + LV.psPraise * 0.8;
    if (SP && (zk > 0.01 || nk > 0.2)) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, x - 9.5 * s, y - 16 * s, 7 * s, Math.max(zk, nk * 0.5) * 0.9);
      glowAt(ctx, SP.gold, x, y - 20 * s, (46 + 50 * LV.psPraise) * s, 0.32 * zk);
      if (LV.psPraise > 0.02) {
        // 荣光：自圣所升起的一柱柔光，和几道短而柔的光（不是条纹的扇）
        const pk = LV.psPraise, cy = y - 20 * s;
        ctx.save(); ctx.translate(x, cy - 30 * s); ctx.scale(0.32, 1);
        glowAt(ctx, SP.gold, 0, 0, 70 * s, 0.3 * pk);
        ctx.restore();
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + (i - 2) * 0.3 + 0.03 * Math.sin(W.t * 0.4 + i), len = (70 + 30 * hsh(i + 1)) * s;
          beamAt(ctx, SP.beamW, x, cy, a, len, len * 0.22, 0.26 * pk);
        }
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawSprings(ctx, g) {
    const k = LV.psSpring;
    if (k < 0.01) return;
    const s = g.s1, wc = mix(waterRGB(), [236, 246, 255], 0.5), A = 0.12 + 0.88 * W.daylight;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    g.springs.forEach((sp, i) => {
      const e = clamp(k * 1.3 - i * 0.12, 0, 1);
      if (e < 0.02) return;
      const n = Math.max(2, Math.round((sp.length - 1) * e) + 1);
      ctx.beginPath(); ctx.moveTo(sp[0][0], sp[0][1]);
      for (let j = 1; j < n; j++) ctx.lineTo(sp[j][0], sp[j][1]);
      ctx.strokeStyle = rgba(wc, 0.22 * A);
      ctx.lineWidth = Math.max(1.6, 5 * s);
      ctx.stroke();
      ctx.strokeStyle = rgba(mix(wc, [255, 255, 255], 0.4), 0.8 * A);
      ctx.lineWidth = Math.max(0.7, 2 * s);
      ctx.stroke();
      // 泉眼：涌出的一簇水
      ctx.fillStyle = rgba([240, 248, 255], 0.7 * A);
      ctx.beginPath(); ctx.ellipse(sp[0][0], sp[0][1], 3.4 * s * e, 1.6 * s * e, 0, 0, TAU); ctx.fill();
      // 往下跳的亮点
      ctx.fillStyle = rgba([255, 255, 255], 0.8 * A);
      for (let q = 0; q < 3; q++) {
        const f = (W.t * 0.9 + q / 3 + i * 0.2) % 1;
        if (f > e) continue;
        const idx = f * (sp.length - 1), a = Math.floor(idx), b = Math.min(sp.length - 1, a + 1), r = idx - a;
        ctx.beginPath(); ctx.arc(lerp(sp[a][0], sp[b][0], r), lerp(sp[a][1], sp[b][1], r), Math.max(0.6, 0.9 * s), 0, TAU); ctx.fill();
      }
      if (e >= 1) {
        const e2 = sp[sp.length - 1];
        ctx.fillStyle = rgba([236, 244, 252], 0.45 * A);
        ctx.beginPath(); ctx.ellipse(e2[0], e2[1], 7 * s, 1.8 * s, 0, 0, TAU); ctx.fill();
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  画：葡萄树（近地沿脊线到海边；中丘；一枝延到溪水）
  // ════════════════════════════════════════════════════════════
  function drawVinePath(ctx, A, front, l, s) {
    if (front <= 0.5) return;
    const pts = A.pts;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = css([104, 80, 52], l);
    ctx.lineWidth = Math.max(0.8, 2.1 * s);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    let i = 1;
    for (; i < pts.length && pts[i].s <= front; i++) ctx.lineTo(pts[i].x, pts[i].y);
    if (i < pts.length) { const a = pts[i - 1], b = pts[i], r = (front - a.s) / Math.max(1e-3, b.s - a.s); ctx.lineTo(lerp(a.x, b.x, r), lerp(a.y, b.y, r)); }
    ctx.stroke();
    const grow = 24 * s;
    // 卷须
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.strokeStyle = css([118, 132, 70], l, 0.9);
    ctx.beginPath();
    for (const f of A.leaves) {
      if (!f.curl || f.d > front - grow) continue;
      const r = 2.2 * s;
      ctx.moveTo(f.x + f.cs * 3 * s + r, f.y - 3 * s);
      ctx.arc(f.x + f.cs * 3 * s, f.y - 3 * s, r, 0, Math.PI * 1.5);
    }
    ctx.stroke();
    // 叶（两种色调；朝光的一面亮些）：葡萄叶是三裂的——三片圆叶拼成一掌
    for (let tone = 0; tone < 3; tone++) {
      ctx.fillStyle = tone === 2 ? css(VLEAF_H, l, 0.5 * (0.25 + 0.75 * W.daylight), 0.08) : tone ? css(VLEAF, l, 1, 0.04) : css(VLEAF_D, l);
      ctx.beginPath();
      for (const f of A.leaves) {
        if ((tone === 2 ? 1 : tone) !== f.tone || f.d > front) continue;
        const gk = clamp((front - f.d) / grow, 0, 1);
        if (gk < 0.05) continue;
        const r = f.r * gk * (tone === 2 ? 0.5 : 1), c = Math.cos(f.rot), sn = Math.sin(f.rot);
        const x = f.x - (tone === 2 ? r * 0.3 : 0), y = f.y - (tone === 2 ? r * 0.5 : 0);
        ctx.moveTo(x + r * 0.62, y); ctx.ellipse(x, y, r * 0.62, r * 0.56, f.rot, 0, TAU);
        if (tone === 2) continue;
        for (const q of [-1, 1]) {
          const lx = x + (c * 0.5 * q - sn * 0.25) * r, ly = y + (sn * 0.5 * q - c * 0.3) * r;
          ctx.moveTo(lx + r * 0.46, ly); ctx.ellipse(lx, ly, r * 0.46, r * 0.4, f.rot + 0.5 * q, 0, TAU);
        }
      }
      ctx.fill();
    }
    // 葡萄
    const ga = LV.psGrape;
    if (ga > 0.02) {
      ctx.globalAlpha = ga;
      ctx.fillStyle = css(GRAPE, l, 1, 0.05);
      ctx.beginPath();
      for (const f of A.leaves) {
        if (!f.grape || f.d > front - grow) continue;
        const r = 1.35 * s, x0 = f.x + f.cs * 2 * s, y0 = f.y + 3.2 * s;
        for (let row = 0; row < 4; row++) for (let c2 = 0; c2 < 4 - row; c2++) {
          const gx = x0 + (c2 - (3 - row) / 2) * r * 1.9, gy = y0 + row * r * 1.7;
          ctx.moveTo(gx + r, gy); ctx.arc(gx, gy, r, 0, TAU);
        }
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  function vineNear(ctx, g, k) {
    const V = g.vine;
    drawVinePath(ctx, V.near, clamp(k * 1.25, 0, 1) * V.near.len, 2, g.s);
    drawVinePath(ctx, V.br, clamp((k - 0.45) / 0.45, 0, 1) * V.br.len, 2, g.s);
  }
  function vineMid(ctx, g, k) { drawVinePath(ctx, g.vine.mid, clamp((k - 0.15) / 0.75, 0, 1) * g.vine.mid.len, 1, g.s1); }
  // 长成的葡萄树画进离屏画布，光色明显改变时才重画（一帧几百片叶子太贵）
  const VC = { near: { c: null, key: '', f: 0 }, mid: { c: null, key: '', f: 0 }, lastF: -1 };
  function drawVine(ctx, g, which) {
    const k = LV.psVine;
    if (k < 0.002) return;
    const fn = which === 'mid' ? vineMid : vineNear;
    if (k < 0.999 || LV.psGrape < W.lt.psGrape - 0.02 || typeof document === 'undefined') { fn(ctx, g, k); return; }
    const C2 = VC[which], bx = which === 'mid' ? g.vine.boxM : g.vine.boxN;
    const bw = bx[2] - bx[0], bh = bx[3] - bx[1];
    if (!(bw > 2 && bh > 2)) { fn(ctx, g, k); return; }
    const key = [W.w, W.h, Math.round(W.daylight * 16), Math.round(W.dusk * 10), Math.round(W.night * 10), Math.round(LV.psGrape * 10), Math.round(LV.storm * 10)].join(',');
    const dpr = Math.min(2, W.dpr || 1);
    // 光色变了才重画；天光飞转时（90 篇的日夜）至多每 12 帧重画一次
    // 近、中两张缓存不在同一帧里重画（天光飞转时把重画分到不同的帧上）
    const sameSize = C2.c && C2.key.split(',', 2).join() === key.split(',', 2).join();
    const age = W.frame - C2.f;
    const stale = sameSize && C2.key !== key && age >= 0 && (age < 12 || (VC.lastF === W.frame && age < 40));
    if ((C2.key !== key || !C2.c) && !stale) {
      try {
        if (!C2.c) C2.c = document.createElement('canvas');
        const cw = Math.ceil(bw * dpr), ch = Math.ceil(bh * dpr);
        if (C2.c.width !== cw || C2.c.height !== ch) { C2.c.width = cw; C2.c.height = ch; }
        const cc = C2.c.getContext('2d');
        cc.setTransform(1, 0, 0, 1, 0, 0); cc.clearRect(0, 0, cw, ch);
        cc.setTransform(dpr, 0, 0, dpr, -bx[0] * dpr, -bx[1] * dpr);
        fn(cc, g, k);
        C2.key = key; C2.f = W.frame; VC.lastF = W.frame;
      } catch (e) { C2.c = null; fn(ctx, g, k); return; }
    }
    ctx.drawImage(C2.c, bx[0], bx[1], bw, bh);
  }

  // ════════════════════════════════════════════════════════════
  //  画：光的路、筵席与福杯、鹿、早晨的草
  // ════════════════════════════════════════════════════════════
  function drawPath(ctx, g, air) {
    const k = LV.psPath;
    if (k < 0.01) return;
    const A = g.path, pts = A.pts, front = k * A.len;
    const lit = clamp(0.35 + LV.gloom * 1.2, 0, 1);
    if (!air) {
      ctx.fillStyle = rgba([255, 226, 170], 0.55 * lit);
      ribbon(ctx, pts, front, 1.6, 20 * g.s);
      ctx.fillStyle = rgba([255, 238, 196], 0.9 * lit);
      ribbon(ctx, pts, front, 0.9, 20 * g.s);
      ctx.fillStyle = rgba([255, 252, 240], 0.95 * lit);
      ribbon(ctx, pts, front, 0.35, 20 * g.s);
      return;
    }
    if (!SP) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < pts.length; i += 2) {
      const p = pts[i];
      if (p.s > front) break;
      glowAt(ctx, SP.warm, p.x, p.y, (18 + 22 * p.v) * g.s, 0.2 * lit * k);
    }
    // 路上一步一步的光点
    for (let d = 6 * g.s, q = 0; d < front; d += 13 * g.s, q++) {
      const p = pts[idxAt(pts, d)];
      glowAt(ctx, SP.pale, p.x, p.y, 3.2 * g.s, (0.55 + 0.35 * Math.sin(W.t * 2.2 - q * 0.7)) * lit * k);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawTable(ctx, g) {
    const k = LV.psTable;
    if (k < 0.01) return;
    const t = g.table, s = t.s, x = t.x, y = t.y;
    ctx.globalAlpha = Math.min(1, k * 1.4);
    // 桌与桌腿
    ctx.fillStyle = css([112, 82, 54], 2);
    ctx.fillRect(x - 13 * s, y - 7.5 * s, 26 * s, 2.2 * s);
    ctx.fillRect(x - 11 * s, y - 5.5 * s, 1.6 * s, 5.5 * s); ctx.fillRect(x + 9.4 * s, y - 5.5 * s, 1.6 * s, 5.5 * s);
    // 饼
    ctx.fillStyle = css([214, 170, 110], 2, 1, 0.04);
    ctx.beginPath(); ctx.ellipse(x - 6.5 * s, y - 9 * s, 4 * s, 1.8 * s, 0, 0, TAU); ctx.fill();
    // 福杯
    const cx = x + 4.5 * s, cy = y - 7.5 * s;
    ctx.fillStyle = css(GOLD, 2, 1, 0.12);
    ctx.beginPath();
    ctx.moveTo(cx - 2.6 * s, cy); ctx.lineTo(cx + 2.6 * s, cy); ctx.lineTo(cx + 0.7 * s, cy - 1.2 * s); ctx.lineTo(cx + 0.5 * s, cy - 3.5 * s);
    ctx.quadraticCurveTo(cx + 3.2 * s, cy - 4.2 * s, cx + 3.4 * s, cy - 7.4 * s); ctx.lineTo(cx - 3.4 * s, cy - 7.4 * s);
    ctx.quadraticCurveTo(cx - 3.2 * s, cy - 4.2 * s, cx - 0.5 * s, cy - 3.5 * s); ctx.lineTo(cx - 0.7 * s, cy - 1.2 * s); ctx.closePath();
    ctx.fill();
    // 满溢：金色的酒从杯沿淌下
    ctx.fillStyle = rgba([255, 214, 120], 0.9 * k * (0.5 + 0.5 * dayA()));
    ctx.beginPath(); ctx.ellipse(cx, cy - 7.4 * s, 3.4 * s, 0.9 * s, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const f = (W.t * 0.55 + i / 4) % 1, side = i % 2 ? 1 : -1;
      const dx = cx + side * (3.4 + f * 1.2) * s, dy = cy - 7.2 * s + f * f * 8 * s;
      ctx.globalAlpha = Math.min(1, k * 1.4) * (1 - f);
      ctx.beginPath(); ctx.arc(dx, dy, 0.75 * s, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function deerPos(g) {
    const k = LV.psDeer, e = 1 - (1 - k) * (1 - k);
    const x1 = (g.pool.x + g.pool.rx * 1.02) / W.w;
    const xf = lerp(1.06, x1, e), v = lerp(0.2, X.deerV, e);
    const s = g.s * (0.92 + 0.35 * v);
    return { xf, x: xf * W.w, y: fY(Math.min(xf, 1), v), s, walkD: e * (1.06 - x1) * W.w };
  }
  function drawDeer(ctx, g) {
    if (LV.psDeer < 0.001) return;
    const d = deerPos(g), s = d.s * 0.95, dir = -1;
    const moving = LV.psDeer < W.lt.psDeer - 1e-4;
    const ph = (d.walkD / (9 * s)) * Math.PI;
    const arrived = LV.psDeer >= 0.999;
    let drink = arrived ? 1 - 0.85 * U.smoothstep(0.6, 0.95, Math.sin(W.t * 0.55 + 0.6)) : 0, hop = 0;
    if (LV.psBreath > 0.3) { drink = 0; hop = Math.pow(Math.max(0, Math.sin(W.t * 2.1)), 4) * 7 * s * LV.psBreath; }
    const x = d.x, y = d.y - hop;
    const body = css([150, 102, 64], 2), dark = css([98, 68, 46], 2);
    // 腿
    ctx.strokeStyle = dark; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(0.8, 1.3 * s);
    ctx.beginPath();
    for (const [dx, p0] of [[-7, 0], [-4.5, Math.PI], [6.5, Math.PI * 0.5], [9, Math.PI * 1.5]]) {
      const sw = moving ? Math.sin(ph + p0) * 0.4 : (hop > 0 ? 0.25 * (dx > 0 ? 1 : -1) : 0);
      const hx = x + dir * dx * s, hy = y - 11 * s;
      const kx = hx + dir * Math.sin(sw) * 4.5 * s, ky = y - 5.5 * s;
      const fx2 = hx + dir * Math.sin(sw * 1.4) * 6 * s, fy = y - (moving ? Math.max(0, Math.sin(ph + p0)) * 1.8 * s : 0);
      ctx.moveTo(hx, hy); ctx.lineTo(kx, ky); ctx.lineTo(fx2, fy);
    }
    ctx.stroke();
    // 身
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(x + dir * 1 * s, y - 13.5 * s, 11 * s, 4.6 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x - dir * 10 * s, y - 15.5 * s, 1.6 * s, 2.2 * s, -0.5 * dir, 0, TAU); ctx.fill();
    // 颈与头：站着时昂首，饮水时低下到水面
    const th = lerp(0.35, 2.5, drink) + (moving ? 0.1 * Math.sin(ph * 2) : 0);
    const cx = x + dir * 8.5 * s, cy = y - 15.5 * s, L = 11 * s;
    const nx = cx + dir * Math.sin(th) * L, ny = cy - Math.cos(th) * L;
    ctx.strokeStyle = body; ctx.lineWidth = Math.max(1, 3.2 * s);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
    const ha = lerp(0.25, 1.4, drink);
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(nx + dir * Math.cos(ha) * 2 * s, ny + Math.sin(ha) * 2 * s, 3.6 * s, 1.9 * s, dir * ha, 0, TAU); ctx.fill();
    // 角
    ctx.strokeStyle = css([196, 170, 132], 2, 1, 0.08);
    ctx.lineWidth = Math.max(0.7, 1.05 * s);
    ctx.beginPath();
    const ax = nx - dir * 0.6 * s, ay = ny - 1.2 * s, up = -Math.cos(th * 0.7);
    for (const side of [-1, 1]) {
      const bx = ax + (side * 2.4 - dir * 2) * s, by = ay + up * 9 * s;
      ctx.moveTo(ax, ay); ctx.quadraticCurveTo(ax - dir * 2.5 * s + side * s, ay + up * 3 * s, bx, by);
      ctx.moveTo(lerp(ax, bx, 0.45), lerp(ay, by, 0.45)); ctx.lineTo(lerp(ax, bx, 0.45) + dir * 2.4 * s, lerp(ay, by, 0.45) + up * 1.5 * s);
      ctx.moveTo(lerp(ax, bx, 0.75), lerp(ay, by, 0.75)); ctx.lineTo(lerp(ax, bx, 0.75) + dir * 2 * s, lerp(ay, by, 0.75) + up * 1.4 * s);
    }
    ctx.stroke();
    // 迎光的背脊
    ctx.strokeStyle = css([255, 232, 196], 2, 0.35 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.ellipse(x + dir * 1 * s, y - 13.5 * s, 11 * s, 4.6 * s, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  }
  function drawMeadow(ctx, g) {
    const k = LV.psField;
    if (k < 0.01) return;
    const w = LV.psWither;
    const cols = [css(mix([52, 94, 42], [128, 104, 62], w), 2), css(mix([98, 152, 70], [178, 150, 92], w), 2, 1, 0.03)];
    const wind = (W.wind || 0) * 0.2;
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(0.6, 1.1 * g.s * 0.7);
    for (let tone = 0; tone < 2; tone++) {
      ctx.strokeStyle = cols[tone];
      ctx.beginPath();
      for (const b of g.blades) {
        if (b.tone !== tone) continue;
        const h = b.h * easeOut(k) * (1 - 0.3 * w), ln = b.lean + wind + Math.sin(W.t * 1.3 + b.sd) * 0.06 + w * 0.9 * b.dir;
        ctx.moveTo(b.x, b.y);
        ctx.quadraticCurveTo(b.x + ln * h * 0.35, b.y - h * 0.62, b.x + ln * h, b.y - h * (1 - 0.35 * w));
      }
      ctx.stroke();
    }
    // 野地的花：早晨开，晚上凋
    const fa = clamp(k * 1.6 - 0.6, 0, 1) * (1 - w);
    if (fa > 0.02) {
      for (const b of g.blades) {
        if (!b.fl) continue;
        const h = b.h * easeOut(k), ln = b.lean + wind + Math.sin(W.t * 1.3 + b.sd) * 0.06;
        ctx.fillStyle = css(b.fl, 2, fa, 0.08);
        ctx.beginPath(); ctx.arc(b.x + ln * h, b.y - h, Math.max(0.8, 1.5 * g.s * 0.7), 0, TAU); ctx.fill();
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上——星宿之琴、量带、清晨的翅膀
  // ════════════════════════════════════════════════════════════
  function lyreGeo() {
    const L = S.lyre || [0.66, 0.26];
    if (port()) return { cx: clamp(L[0], 0.3, 0.7) * W.w, cy: clamp(L[1], 0.44, 0.5) * W.h, R: 0.16 * W.w };
    return { cx: clamp(L[0], 0.3, 0.82) * W.w, cy: clamp(L[1], 0.13, 0.36) * W.h, R: 0.11 * Math.min(W.w, W.h * 1.3) };
  }
  const lyreVis = () => LV.stars * clamp((W.night - 0.45) * 2.2, 0, 1) * (1 - 0.9 * LV.storm);
  function drawLyre(ctx) {
    const k = LV.psLyre;
    if (k < 0.01 || !SP) return;
    const vis = lyreVis();
    if (vis < 0.01) return;
    const G2 = lyreGeo(), N = LYRE.length, u = Math.max(0.6, W.unit);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 连线与琴弦
    const la = clamp((k - 0.8) / 0.2, 0, 1) * vis;
    if (la > 0.01) {
      ctx.strokeStyle = rgba([196, 212, 255], 0.3 * la);
      ctx.lineWidth = Math.max(0.6, 0.9 * u);
      ctx.beginPath();
      for (const [a, b] of LYRE_E) { ctx.moveTo(G2.cx + LYRE[a][0] * G2.R, G2.cy + LYRE[a][1] * G2.R); ctx.lineTo(G2.cx + LYRE[b][0] * G2.R, G2.cy + LYRE[b][1] * G2.R); }
      ctx.stroke();
      ctx.strokeStyle = rgba([255, 236, 200], 0.14 * la);
      ctx.beginPath();
      for (const sx of [-0.3, -0.15, 0, 0.15, 0.3]) {
        ctx.moveTo(G2.cx + sx * G2.R, G2.cy + 0.26 * G2.R); ctx.lineTo(G2.cx + sx * G2.R, G2.cy - (0.6 - 0.04 * Math.abs(sx) / 0.5) * G2.R);
      }
      ctx.stroke();
    }
    // 众星：一颗一颗自灵所在之处飞出，落到各自的位置（柔光，不是方点），落定时一闪
    const O = S.lyre ? [S.lyre[0] * W.w, S.lyre[1] * W.h] : [G2.cx, G2.cy];
    for (let i = 0; i < N; i++) {
      const pr = clamp((k * (N + 3) - i) / 3, 0, 1);
      if (pr <= 0) continue;
      const a = (0.35 + 0.65 * pr) * vis;
      const st = LYRE[i], X1 = G2.cx + st[0] * G2.R, Y1 = G2.cy + st[1] * G2.R;
      const at = t => { const e = easeOut(t), dx = X1 - O[0], dy = Y1 - O[1], bow = Math.sin(Math.PI * e) * 0.18 * (hsh(i + 3) - 0.5) * 2;
        return [O[0] + dx * e - dy * bow, O[1] + dy * e + dx * bow]; };
      const [x, y] = pr < 1 ? at(pr) : [X1, Y1];
      if (pr < 1) for (let j = 1; j <= 4; j++) { const q = at(Math.max(0, pr - j * 0.07)); glowAt(ctx, SP.pale, q[0], q[1], (2.6 - j * 0.4) * u, 0.3 * (1 - j / 5) * vis); }
      const flare = pr >= 1 ? clamp(1 - (k * (N + 3) - i - 3) * 0.45, 0, 1) : 0;
      const tw = 0.86 + 0.14 * Math.sin(W.t * (1.7 + i * 0.23) + i * 1.9);
      glowAt(ctx, SP.cool, x, y, (4 + 3.2 * st[2]) * u * (1 + 0.8 * flare), (0.5 * tw + 0.4 * flare) * a);
      glowAt(ctx, SP.pale, x, y, (1.4 + 0.9 * st[2]) * u, 0.95 * a);
      if (st[2] >= 2) {
        ctx.globalAlpha = 0.45 * a * tw;
        ctx.strokeStyle = 'rgb(236,242,255)'; ctx.lineWidth = Math.max(0.5, 0.7 * u);
        const r = (5 + 2.4 * st[2]) * u;
        ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawLines(ctx) {
    const k = LV.psLine;
    if (k < 0.01 || !SP) return;
    const hz = W.horizonY, u = Math.max(0.6, W.unit);
    // 星宿之琴在天上时，量带不从琴上划过
    let box = null;
    if (LV.psLyre > 0.3 && lyreVis() > 0.05) { const L = lyreGeo(); box = [L.cx - 0.95 * L.R, L.cy - 1.1 * L.R, L.cx + 0.95 * L.R, L.cy + 1.0 * L.R]; }
    const inBox = (x, y) => box && x > box[0] && x < box[2] && y > box[1] && y < box[3];
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const N = 40;
    for (let i = 0; i < 2; i++) {
      const rx = W.w * (0.56 - i * 0.09), ry = hz * (0.84 - i * 0.2), cx = W.w * 0.5;
      const pt = t => { const a = Math.PI + t * Math.PI; return [cx + Math.cos(a) * rx, hz + Math.sin(a) * ry]; };
      // 一道宽而淡的光带，中间一线细芯；向两端的地极渐渐隐去
      for (const [lw, al] of [[Math.max(4, 9 * u), 0.05], [Math.max(0.8, 1.1 * u), 0.2]]) {
        ctx.lineWidth = lw;
        for (let j = 0; j < N; j++) {
          const t0 = j / N, t1 = (j + 1) / N, p0 = pt(t0), p1 = pt(t1);
          if (inBox(p0[0], p0[1]) || inBox(p1[0], p1[1])) continue;
          const f = Math.pow(Math.sin(Math.PI * (t0 + t1) / 2), 1.3);
          ctx.strokeStyle = rgba([255, 226, 172], al * f * k * (1 - 0.25 * i));
          ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
        }
      }
      // 言语之光沿量带奔走，从地极到地极（无言无语）：带着短短的彗尾
      for (let q = 0; q < 2; q++) {
        const ph = (W.t * 0.07 + i * 0.29 + q * 0.5) % 1;
        for (let j = 0; j < 7; j++) {
          const tt = ph - j * 0.006;
          if (tt < 0) break;
          const c = pt(tt);
          if (inBox(c[0], c[1])) continue;
          glowAt(ctx, SP.gold, c[0], c[1], (9 - j * 0.9) * u, (j ? 0.3 * (1 - j / 7) : 0.75) * k * Math.sin(tt * Math.PI));
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 清晨的翅膀（139:9）：两只柔光的翼自日出之处的霞光里展开——上翼扬起、下翼贴着海面；
  // 每翼六片弯弯的长羽，低透明、彼此交叠，画在四分之一大小的画布上再放大（边缘自然柔和）
  const WG = { c: null, w: 0, h: 0 };
  function drawWings(ctx) {
    const k = LV.psWings;
    if (k < 0.01 || typeof document === 'undefined') return;
    const sx = W.sun.x, sy = Math.min(W.sun.y, W.horizonY - 2), Lw = Math.min(W.w, W.h * 1.7);
    const q = 4, cw = Math.max(8, Math.ceil(W.w / q)), ch = Math.max(8, Math.ceil(W.h / q));
    try {
      if (!WG.c) WG.c = document.createElement('canvas');
      if (WG.c.width !== cw || WG.c.height !== ch) { WG.c.width = cw; WG.c.height = ch; }
    } catch (e) { return; }
    const g = WG.c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cw, ch);
    g.setTransform(1 / q, 0, 0, 1 / q, 0, 0);
    g.globalCompositeOperation = 'lighter';
    // 以日为身，两翼向右展开：上翼的「臂」自日边弯弯地扬起，长羽自臂上向后（右）垂下，越近翼尖越长；
    // 下翼如上翼在水面上的倒影（淡些）。羽尖不高过画面的三分之一。
    const open = 0.3 + 0.7 * k, top = W.h * 0.34;
    const rise = Math.min(W.h * 0.13, Math.max(W.h * 0.04, sy - top - W.h * 0.03));
    const wings = [{ dir: -1, al: 0.3 }, { dir: 1, al: 0.15 }];
    for (const wg of wings) {
      const d = wg.dir, wx = sx + Lw * 0.2 * open, wy = sy + d * rise * open;
      const cx = sx + Lw * 0.08 * open, cy = sy + d * rise * 0.95 * open;
      const arm = t => { const u = 1 - t; return [u * u * sx + 2 * u * t * cx + t * t * wx, u * u * sy + 2 * u * t * cy + t * t * wy]; };
      const n = 7;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1), [bx, by] = arm(0.22 + 0.78 * t);
        const a = -d * lerp(0.3, -0.25, t) + 0.012 * Math.sin(W.t * 0.6 + i);
        const len = Lw * lerp(0.09, 0.25, t) * open, wd = len * 0.13;
        const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca, bend = d * 0.09;
        const tx = bx + Math.cos(a + bend) * len, ty = by + Math.sin(a + bend) * len;
        const mx = bx + ca * len * 0.5, my = by + sa * len * 0.5;
        const gr = g.createLinearGradient(bx, by, tx, ty);
        gr.addColorStop(0, rgba([255, 238, 208], wg.al * k)); gr.addColorStop(0.55, rgba([255, 212, 178], wg.al * 0.6 * k)); gr.addColorStop(1, rgba([255, 196, 172], 0));
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(bx, by);
        g.quadraticCurveTo(mx + nx * wd, my + ny * wd, tx, ty);
        g.quadraticCurveTo(mx - nx * wd * 0.35, my - ny * wd * 0.35, bx, by);
        g.fill();
      }
      // 翼的前缘：一道柔亮的弧
      g.strokeStyle = rgba([255, 244, 222], wg.al * 0.9 * k);
      g.lineWidth = Math.max(4, 7 * W.unit); g.lineCap = 'round';
      g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(cx, cy, wx, wy); g.stroke();
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (SP) glowAt(ctx, SP.warm, sx, sy, M() * 0.32, 0.3 * k);
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(WG.c, 0, 0, cw * q, ch * q);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：空中的光（在夜色与昏暗之上）——天光破云、脸的光、同在、灯、保护者、光的鸟、琴与鼓
  // ════════════════════════════════════════════════════════════
  function drawRays(ctx) {
    const k = LV.psRay;
    if (k < 0.01 || !SP) return;
    const sx = W.sun.x, sy = W.sun.y;
    if (sy > W.horizonY) return;
    const L = Math.hypot(W.w, W.h) * 0.62;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, sx, sy, M() * 0.4, 0.22 * k);
    // 天光破云：几道柔光斜斜落下（宽窄不一，边缘柔和）
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * (0.53 + i * 0.058) + 0.02 * Math.sin(W.t * 0.3 + i), len = L * (0.7 + 0.3 * hsh(i + 2));
      beamAt(ctx, SP.beam, sx, sy, a, len, len * (0.08 + 0.07 * hsh(i)), 0.2 * k);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 使你的脸发光（80:19）：落日周围一团暖光，四五道短而柔的光
  function drawFace(ctx) {
    const k = LV.psFace * clamp(1 - W.night * 1.6, 0, 1);
    if (k < 0.01 || !SP) return;
    const sx = W.sun.x, sy = Math.min(W.sun.y, W.horizonY), m = M();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, sx, sy, m * 0.9, 0.22 * k);
    glowAt(ctx, SP.warm, sx, sy, m * 0.45, 0.42 * k);
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * (0.94 + i * 0.085) + 0.02 * Math.sin(W.t * 0.25 + i * 1.3), len = m * 0.45 * (0.7 + 0.3 * hsh(i + 4)) * (0.6 + 0.4 * k);
      beamAt(ctx, SP.beamW, sx, sy, a, len, len * (0.14 + 0.06 * hsh(i + 9)), 0.55 * k);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function flightGeo(t) {
    const h0 = headOf('david', 1.25), x0 = h0[0], y0 = h0[1];
    const x1 = W.w * 0.44, y1 = W.h * 0.18, x2 = W.w * 0.2, y2 = W.h * 0.47;
    const u = 1 - t;
    return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2];
  }
  function lampPos(m) {
    const h = m._h, f = m.fd >= 0 ? 1 : -1;
    const low = m.pose === 'lie' || m.pose === 'sit';
    return low ? [m._x + f * h * 0.42, m._y - h * 0.05] : [m._x + f * h * 0.22, m._y - h * 0.47];
  }
  function drawAirLights(ctx, g) {
    if (!SP) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 你与我同在：一团随着牧人的光
    if (LV.psWith > 0.01 && has('david')) {
      const h = personH('david'), p = headOf('david', 0), a = LV.psWith * (0.35 + LV.gloom * 0.6);
      glowAt(ctx, SP.pale, p[0], p[1] - h * 0.5, h * 2.1, 0.3 * a);
      glowAt(ctx, SP.warm, p[0], p[1] - h * 0.9, h * 0.9, 0.22 * a);
    }
    // 用油膏了我的头
    if (LV.psOil > 0.01 && has('david')) { const p = headOf('david', 0.92); glowAt(ctx, SP.gold, p[0], p[1], personH('david') * 0.5, 0.55 * LV.psOil); }
    // 福杯的光
    if (LV.psTable > 0.01) { const t = g.table; glowAt(ctx, SP.gold, t.x + 4.5 * t.s, t.y - 14 * t.s, 16 * t.s, (0.25 + 0.4 * nightK() + 0.3 * LV.gloom) * LV.psTable); }
    // 脚前的灯
    if (LV.psLamp > 0.01) {
      cmembers('pilgrims').forEach((m, i) => {
        if (!m._vis || m.alpha < 0.05) return;
        const q = lampPos(m), fl = LV.psLamp * m.alpha * (0.85 + 0.15 * Math.sin(W.t * 9 + i * 2.3));
        glowAt(ctx, SP.warm, q[0], q[1], m._h * 1.1, 0.42 * fl * (0.4 + 0.6 * nightK()));
        glowAt(ctx, SP.gold, q[0], q[1], m._h * 0.13, 0.95 * fl);
      });
    }
    // 保护以色列的：在睡着的人上方，一片不动、不熄的光
    if (LV.psKeep > 0.01) {
      const ms = cmembers('pilgrims');
      let cx = 0.83 * W.w, n = 0, sx = 0;
      for (const m of ms) if (m._vis) { sx += m._x; n++; }
      if (n) cx = sx / n;
      const gy = fY(cx / W.w, 0.04), k = LV.psKeep;
      // 一穹柔光覆庇着他们（121:5「耶和华在你右边荫庇你」）：不闪、不动
      const R = Math.max(0.12 * W.w, 70 * g.s);
      ctx.save(); ctx.translate(cx, gy); ctx.scale(1, 0.62);
      glowAt(ctx, SP.pale, 0, 0, R * 1.25, 0.45 * k);
      glowAt(ctx, SP.warm, 0, 0, R * 0.7, 0.2 * k);
      ctx.globalAlpha = 1;
      ctx.lineWidth = Math.max(3, 7 * g.s);
      ctx.strokeStyle = rgba([236, 240, 255], 0.06 * k);
      ctx.beginPath(); ctx.arc(0, 0, R * 0.95, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
      ctx.lineWidth = Math.max(1.2, 2.2 * g.s);
      ctx.strokeStyle = rgba([236, 240, 255], 0.2 * k);
      ctx.stroke();
      ctx.restore();
      // 一颗不眨眼的星守在睡着的人上方，一线微光连到他们那里（不闪、不动）
      const stx = cx, sty = gy - Math.max(R * 1.6, W.h * 0.3), sr = Math.max(0.6, W.unit);
      const lg = ctx.createLinearGradient(0, sty, 0, gy);
      lg.addColorStop(0, rgba([236, 240, 255], 0.26 * k)); lg.addColorStop(1, rgba([236, 240, 255], 0.02 * k));
      ctx.fillStyle = lg;
      ctx.fillRect(stx - Math.max(0.6, 0.8 * sr), sty, Math.max(1.2, 1.6 * sr), gy - sty);
      glowAt(ctx, SP.cool, stx, sty, 22 * sr, 0.55 * k);
      glowAt(ctx, SP.pale, stx, sty, 6 * sr, 1 * k);
      ctx.globalAlpha = 0.6 * k; ctx.strokeStyle = 'rgb(240,244,255)'; ctx.lineWidth = Math.max(0.6, 0.8 * sr);
      ctx.beginPath(); ctx.moveTo(stx - 13 * sr, sty); ctx.lineTo(stx + 13 * sr, sty); ctx.moveTo(stx, sty - 13 * sr); ctx.lineTo(stx, sty + 13 * sr); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // 清晨的翅膀：一只光的鸟飞到海极；到了那里，一只手般的光扶持它
    if (LV.psFlight > 0.001 && LV.psWings > 0.02) {
      const t = LV.psFlight, u = Math.max(0.6, W.unit), fade = clamp(LV.psWings * 1.4, 0, 1);
      for (let j = 1; j <= 22; j++) {
        const tt = t - j * 0.009;
        if (tt <= 0) break;
        const q = flightGeo(tt);
        glowAt(ctx, SP.gold, q[0], q[1], (8 - j * 0.28) * u, 0.42 * (1 - j / 23) * fade * (t < 1 ? 1 : 0.35));
      }
      const p = flightGeo(t);
      if (t >= 0.999) { glowAt(ctx, SP.gold, p[0], p[1], 46 * u * (1 + 0.08 * Math.sin(W.t * 1.3)), 0.55 * fade); glowAt(ctx, SP.warm, p[0], p[1], 20 * u, 0.5 * fade); }
      glowAt(ctx, SP.pale, p[0], p[1], 16 * u, 0.85 * fade);
      glowAt(ctx, SP.gold, p[0], p[1], 30 * u, 0.3 * fade);
      ctx.globalAlpha = 0.95 * fade;
      ctx.strokeStyle = 'rgb(255,252,240)'; ctx.lineWidth = Math.max(1, 1.8 * u); ctx.lineCap = 'round';
      const fl = t < 1 ? Math.sin(W.t * 9) : 0.3, wsp = 9 * u;
      ctx.beginPath();
      ctx.moveTo(p[0] - wsp, p[1] - fl * 3 * u); ctx.quadraticCurveTo(p[0] - wsp * 0.4, p[1] - 2 * u, p[0], p[1]);
      ctx.quadraticCurveTo(p[0] + wsp * 0.4, p[1] - 2 * u, p[0] + wsp, p[1] - fl * 3 * u);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    drawHarp(ctx);
    drawInstruments(ctx);
  }
  // 大卫的琴（夜里在星下弹；末了在众民中弹）
  function drawHarp(ctx) {
    if (!S.harp || !has('david')) return;
    const f = fig('david');
    if (!f || !f._vis || f.alpha < 0.3) return;
    const h = f._h, dir = f.fd >= 0 ? 1 : -1, low = f.pose === 'sit' || f.pose === 'kneel';
    if (f.pose === 'walk' || f.pose === 'lie' || f.pose === 'raise' || f.pose === 'gaze') return;
    const hx = f._x + dir * h * 0.21, hy = f._y - h * (low ? 0.3 : 0.56), L = h * 0.38;
    ctx.save();
    ctx.translate(hx, hy); ctx.scale(dir, 1); ctx.rotate(-0.22);
    ctx.lineCap = 'round';
    ctx.strokeStyle = css([160, 112, 64], 2, 1, 0.1); ctx.lineWidth = Math.max(0.9, L * 0.09);
    ctx.beginPath();
    ctx.moveTo(-L * 0.28, 0); ctx.quadraticCurveTo(-L * 0.48, -L * 0.52, -L * 0.3, -L * 0.95);
    ctx.moveTo(L * 0.28, 0); ctx.quadraticCurveTo(L * 0.48, -L * 0.52, L * 0.32, -L * 0.92);
    ctx.moveTo(-L * 0.38, -L * 0.9); ctx.lineTo(L * 0.4, -L * 0.96);
    ctx.stroke();
    ctx.fillStyle = css([134, 94, 56], 2);
    ctx.fillRect(-L * 0.34, -L * 0.1, L * 0.68, L * 0.22);
    ctx.strokeStyle = rgba([255, 240, 206], 0.45 + 0.35 * nightK());
    ctx.lineWidth = Math.max(0.4, L * 0.025);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const sx = lerp(-0.2, 0.2, i / 4) * L; ctx.moveTo(sx, -L * 0.1); ctx.lineTo(sx * 1.05, -L * (0.9 + 0.03 * (i / 4))); }
    ctx.stroke();
    ctx.restore();
    if (SP && nightK() > 0.2) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, hx, hy - L * 0.45, L * 0.9, 0.22 * nightK());
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
  // 击鼓、吹角（150:3–4）：众民中有人举着手鼓，有人吹角
  function drawInstruments(ctx) {
    if (!S.instr) return;
    const u = 1;
    for (const gid of ['praiseA', 'praiseB']) {
      cmembers(gid).forEach((m, i) => {
        if (!m._vis || m.alpha < 0.3 || m.age === 'baby') return;
        const h = m._h, f = m.fd >= 0 ? 1 : -1;
        const up = m.pose === 'raise' ? easeOut(m.poseT) : 1 - easeOut(m.poseT);
        if (i % 3 === 0) {
          // 手鼓
          const hx = m._x + f * h * lerp(0.2, 0.08, up), hy = m._y - h * lerp(0.52, 1.04, up), r = h * 0.085 * u;
          ctx.fillStyle = css([222, 196, 150], 2, 0.95, 0.1);
          ctx.beginPath(); ctx.ellipse(hx, hy, r, r * 0.9, 0, 0, TAU); ctx.fill();
          ctx.strokeStyle = css([150, 104, 60], 2); ctx.lineWidth = Math.max(0.5, r * 0.3);
          ctx.stroke();
          ctx.fillStyle = css(GOLD, 2, 1, 0.2);
          for (let q = 0; q < 4; q++) { const a = q * 1.57 + W.t * 3; ctx.beginPath(); ctx.arc(hx + Math.cos(a) * r, hy + Math.sin(a) * r * 0.9, Math.max(0.5, r * 0.22), 0, TAU); ctx.fill(); }
        } else if (i % 4 === 1 && m.age !== 'child') {
          // 角（羊角）：自口边向前上方弯出，末端张开
          const mx = m._x + f * h * 0.08, my = m._y - h * 0.84;
          ctx.strokeStyle = css([188, 160, 118], 2, 1, 0.06); ctx.lineCap = 'round';
          ctx.lineWidth = Math.max(0.6, h * 0.03);
          ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(mx + f * h * 0.17, my + h * 0.01, mx + f * h * 0.22, my - h * 0.1); ctx.stroke();
          ctx.lineWidth = Math.max(0.8, h * 0.05);
          ctx.beginPath(); ctx.moveTo(mx + f * h * 0.21, my - h * 0.07); ctx.lineTo(mx + f * h * 0.235, my - h * 0.13); ctx.stroke();
        }
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  //  粒子：糠秕被风吹散（1:4）、凡有气息的呼出的光（150:6）——只是装饰
  // ════════════════════════════════════════════════════════════
  const PT = [];
  let breathAcc = 0, danceT = 0, danceP = false;
  const CAND = [];
  function addPt(p) { if (PT.length > 420) PT.shift(); p.t = 0; PT.push(p); }
  function chaff(b) {
    if (inst(b)) return;
    const g = layout(), u = Math.max(0.6, W.unit), sz = Math.max(0.8, g.s * 0.7);
    // 一阵风自右边的山脊吹过海面，把糠秕卷走（风是几道弯弯的淡光）
    for (let i = 0; i < 5; i++) {
      const xf = 0.84 + Math.random() * 0.14;
      addPt({ kind: 'gust', x: xf * W.w, y: fY(xf, 0) - (10 + Math.random() * 50) * g.s, vx: -(150 + Math.random() * 60) * u, vy: -(4 + Math.random() * 8) * u,
        max: 5 + Math.random() * 1.5, size: (60 + Math.random() * 60) * u, delay: i * 0.35, curl: Math.random() < 0.5 ? -1 : 1, seed: Math.random() * 10 });
    }
    for (let i = 0; i < 120; i++) {
      const xf = 0.8 + Math.random() * 0.2;
      addPt({ kind: 'chaff', x: xf * W.w, y: fY(Math.min(xf, 1), Math.random() * 0.3) - Math.random() * 24 * g.s, vx: -(120 + Math.random() * 90) * u,
        vy: -(16 + Math.random() * 30) * u, max: 5 + Math.random() * 2, size: (1.2 + Math.random() * 1.4) * sz, rot: Math.random() * TAU, spin: (Math.random() - 0.5) * 8,
        delay: Math.random() * 1.6, seed: Math.random() * 10 });
    }
  }
  function gatherCands() {
    CAND.length = 0;
    const c = C();
    if (c && c.people) for (const p of c.people.values()) if (p._vis && p.alpha > 0.5) CAND.push([p._x, p._y - p._h * (p.isAnimal ? 0.5 : 0.75)]);
    if (c && c.crowds) for (const gp of c.crowds.values()) for (const m of gp.members) if (m._vis && m.alpha > 0.5) CAND.push([m._x, m._y - m._h * (m.isAnimal ? 0.5 : 0.75)]);
  }
  function breathSource() {
    const r = Math.random();
    if (r < 0.4 && CAND.length) return CAND[Math.floor(Math.random() * CAND.length)];
    if (r < 0.58 && GS.beasts && GS.beasts._ents) { const A = GS.beasts._ents.AN; const a = A && A[Math.floor(Math.random() * A.length)]; if (a && isFinite(a.x) && isFinite(a.y)) return [a.x, a.y - 10 * Math.max(0.5, W.unit)]; }
    if (r < 0.8 && GS.air && GS.air._birds) { const B = GS.air._birds; const bd = B[Math.floor(Math.random() * B.length)]; if (bd && isFinite(bd.x) && isFinite(bd.y) && bd.a > 0.5) return [bd.x, bd.y]; }
    if (GS.sea && GS.sea._fish) { const F = GS.sea._fish; const f = F[Math.floor(Math.random() * F.length)]; if (f && isFinite(f.x) && isFinite(f.y) && f.x >= W.w * 0.4) return [f.x, f.y]; }
    return CAND.length ? CAND[Math.floor(Math.random() * CAND.length)] : null;
  }
  // 横屏时经文在左边海上（约 0.04–0.48 W、0.55–0.82 H）：显出经文时，那里的光点淡下去
  const narrQuiet = () => !port() && !!(GS.ui && GS.ui.narrating && U.safe('psalms.narr', () => GS.ui.narrating()));
  function narrDim(x, y) {
    const dx = Math.max(0, x - W.w * 0.5, W.w * 0.02 - x), dy = Math.max(0, W.h * 0.5 - y, y - W.h * 0.86);
    return 0.3 + 0.7 * clamp(Math.hypot(dx, dy) / (0.06 * W.w), 0, 1);
  }
  function emitBreath(dt) {
    const k = LV.psBreath;
    if (k < 0.2 || W.replaying || !(dt > 0)) return;
    if ((W.frame & 7) === 0 || !CAND.length) gatherCands();
    breathAcc += dt * (22 + 72 * k) * (W.quality || 1);
    const quiet = narrQuiet();
    let guard = 16;
    while (breathAcc >= 1 && guard--) {
      breathAcc -= 1;
      const src = breathSource();
      if (!src) continue;
      // 经文在左边海上显出时，那一片保持安静（诗句不淹没在光点里）
      if (quiet && src[0] < W.w * 0.47) continue;
      const u = Math.max(0.55, W.unit);
      addPt({ kind: 'breath', x: src[0] + (Math.random() - 0.5) * 4, y: src[1], vx: (Math.random() - 0.5) * 12 * u, vy: -(16 + Math.random() * 30) * u,
        max: 4 + Math.random() * 3.5, size: (1.3 + Math.random() * 1.7) * u, warm: Math.random() < 0.6 });
    }
    breathAcc = Math.min(breathAcc, 3);
  }
  function updatePts(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.t += dt;
      if (p.t >= p.max) { PT.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === 'chaff') { p.vy += (5 + 14 * Math.sin(p.t * 2.2 + p.seed)) * dt; p.rot += p.spin * dt; }
      else if (p.kind === 'gust') { /* 风：匀速掠过 */ }
      else { p.vx += (W.w * 0.6 - p.x) * 0.05 * dt; p.vy -= 3 * dt; }
    }
  }
  function drawPts(ctx) {
    if (!PT.length) return;
    // 风
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(240,236,222)';
    ctx.lineWidth = Math.max(0.8, 1.2 * Math.max(0.6, W.unit));
    for (const p of PT) {
      if (p.kind !== 'gust' || p.delay > 0) continue;
      const f = p.t / p.max, L = p.size, c = p.curl, wv = Math.sin(p.t * 1.6 + p.seed) * 6;
      ctx.globalAlpha = 0.22 * Math.sin(Math.PI * clamp(f, 0, 1)) * dayA();
      ctx.beginPath(); ctx.moveTo(p.x + L, p.y + wv * 0.3);
      ctx.bezierCurveTo(p.x + L * 0.6, p.y - 8 * c + wv, p.x + L * 0.25, p.y + 6 * c, p.x, p.y);
      ctx.quadraticCurveTo(p.x - L * 0.12, p.y - 5 * c, p.x - L * 0.05, p.y - 9 * c);
      ctx.stroke();
    }
    // 糠秕：淡淡的麦秆色，被风卷着越过海面
    ctx.fillStyle = css([238, 218, 166], 2, 1, 0.16);
    for (const p of PT) {
      if (p.kind !== 'chaff' || p.delay > 0) continue;
      const f = p.t / p.max;
      ctx.globalAlpha = clamp(Math.min(f * 8, (1 - f) * 3), 0, 1);
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size * 1.8, p.size * 0.6, p.rot, 0, TAU); ctx.fill();
    }
    if (!SP) { ctx.globalAlpha = 1; return; }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const quiet = narrQuiet();
    for (const p of PT) {
      if (p.kind !== 'breath') continue;
      const f = p.t / p.max, a = Math.sin(Math.PI * Math.sqrt(clamp(f, 0, 1))) * (0.6 + 0.4 * LV.psBreath) * (quiet ? narrDim(p.x, p.y) : 1);
      if (a > 0.02) glowAt(ctx, p.warm ? SP.moteW : SP.mote, p.x, p.y, p.size * 4.5, a);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的总调度
  // ════════════════════════════════════════════════════════════
  function drawUnder(ctx, pass) {
    if (!isCur()) return;
    sprites();
    const g = layout();
    if (pass === 'sky') { U.safe('psalms.lines', () => drawLines(ctx)); U.safe('psalms.wings', () => drawWings(ctx)); U.safe('psalms.lyre', () => drawLyre(ctx)); return; }
    if (pass === 'mid') { U.safe('psalms.zion', () => drawZion(ctx, g)); U.safe('psalms.springs', () => drawSprings(ctx, g)); U.safe('psalms.vineM', () => drawVine(ctx, g, 'mid')); return; }
    if (pass === 'near') {
      U.safe('psalms.stream', () => drawStream(ctx, g));
      U.safe('psalms.pool', () => drawPool(ctx, g));
      U.safe('psalms.vine', () => drawVine(ctx, g, 'near'));
      U.safe('psalms.path', () => drawPath(ctx, g, false));
      U.safe('psalms.table', () => drawTable(ctx, g));
      U.safe('psalms.tree', () => drawTree(ctx, g));
      U.safe('psalms.deer', () => drawDeer(ctx, g));
      U.safe('psalms.meadow', () => drawMeadow(ctx, g));
      return;
    }
    if (pass === 'air') {
      U.safe('psalms.rays', () => drawRays(ctx));
      U.safe('psalms.face', () => drawFace(ctx));
      U.safe('psalms.pathA', () => drawPath(ctx, g, true));
      U.safe('psalms.lights', () => drawAirLights(ctx, g));
      U.safe('psalms.pts', () => drawPts(ctx));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function pick(x, y, r) {
    if (!isCur() || !G) return null;
    let best = null;
    const test = (label, px, py, d0) => {
      if (!isFinite(px) || !isFinite(py)) return;
      const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const g = G;
    if (LV.psTree > 0.6) test('溪水旁的树', g.tree.x, g.tree.y - g.tree.H * 0.7, g.tree.H * 0.3);
    if (LV.psStream > 0.5) { const p = g.stream.pts[Math.floor(g.stream.pts.length * 0.3)]; if (p) test('溪水', p.x, p.y, 6); }
    if (LV.psPool > 0.5) test('可安歇的水边', g.pool.x, g.pool.y, g.pool.rx * 0.5);
    if (LV.psTable > 0.5) test('筵席', g.table.x, g.table.y - 8 * g.table.s, 8 * g.table.s);
    test('耶和华的殿', g.zion.x - 4 * g.zion.s, g.zion.y - 22 * g.zion.s, 14 * g.zion.s);
    test('锡安', g.zion.x + 45 * g.zion.s, g.zion.y - 6 * g.zion.s, 8 * g.zion.s);
    test('耶路撒冷', g.zion.x - 50 * g.zion.s, g.zion.y - 6 * g.zion.s, 8 * g.zion.s);
    if (LV.psDeer > 0.05) { const d = deerPos(g); test('鹿', d.x, d.y - 14 * d.s, 8 * d.s); }
    if (LV.psVine > 0.4) { const v = g.vine.near.pts[Math.floor(g.vine.near.pts.length * 0.25)]; if (v) test('葡萄树', v.x, v.y - 4 * g.s, 10 * g.s); }
    if (LV.psSpring > 0.5) for (const sp of g.springs) test('泉源', sp[4][0], sp[4][1], 4);
    if (LV.psLyre > 0.5 && lyreVis() > 0.3) { const L = lyreGeo(); test('月亮星宿', L.cx, L.cy, L.R * 0.6); }
    if (S.harp && has('david')) { const f = fig('david'); if (f && f._vis) test('琴', f._x + (f.fd >= 0 ? 1 : -1) * f._h * 0.21, f._y - f._h * 0.5, 4); }
    if (LV.psLamp > 0.3) cmembers('pilgrims').forEach(m => { if (m._vis) { const q = lampPos(m); test('灯', q[0], q[1], 2); } });
    return best;
  }

  const SCENE = {
    init() { sprites(); buildTree(); },
    resize() { P.w = 0; G = null; },
    update(dt) {
      if (!isCur()) { if (PT.length) PT.length = 0; return; }
      layout();
      const f = dt * (W.fast || 1);
      for (const [id, v] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = 0.09 * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
      // 众民跳舞：两群人轮流举手（只是装饰）
      if (S.dance && !W.replaying) {
        danceT -= f;
        if (danceT <= 0) {
          danceT = 0.95; danceP = !danceP;
          cpose('praiseA', danceP ? 'raise' : 'stand'); cpose('praiseB', danceP ? 'stand' : 'raise'); cpose('pilgrims', danceP ? 'stand' : 'raise');
        }
      }
      emitBreath(f);
      updatePts(f);
    },
    drawUnder,
    draw() {},
    reset() { PT.length = 0; VT.clear(); },
    restore() {
      PT.length = 0; breathAcc = 0;
      for (const [id, v] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear();
    },
    pick,
    sig() { return { harp: S.harp, dance: S.dance, instr: S.instr, aged: S.aged, lyre: !!S.lyre, renew: !!S.renew }; },
    get debug() {
      return { S: Object.assign({}, S), pts: PT.length, lv: MY.reduce((o, k) => { o[k] = +LV[k].toFixed(3); return o; }, {}),
        G: G ? { stream: G.stream.pts.length, len: Math.round(G.stream.len), shore: G.shore, pool: G.pool, leaves: G.vine.near.leaves.length + G.vine.mid.leaves.length } : null };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function bolt(b, x, near) { if (inst(b) || !GS.weather || !GS.weather.bolt) return; U.safe('psalms.bolt', () => GS.weather.bolt({ x, near: !!near })); }
  function bless(x, y, r) { if (GS.bus) U.safe('psalms.bless', () => GS.bus.emit('bless', { x, y, r })); }
  function breach() {
    const sea = GS.sea;
    if (!sea || !sea._whales || !sea._setSt) return;
    U.safe('psalms.breach', () => { for (const w of sea._whales) if (w && w.st !== 'breach' && w.a >= 1) { sea._setSt(w, 'breach', 3.4); break; } });
  }
  function stirBirds() {
    const B = GS.air && GS.air._birds;
    if (!B) return;
    for (const bd of B) if (bd && bd.mode === 'free') bd.panic = Math.max(bd.panic || 0, 1 + Math.random() * 1.2);
  }
  // 万物一齐：光环扫过全地，走兽仰首、鱼闪光、鸟群盘旋、鲸跃出海面
  function allAtOnce(b, big) {
    if (inst(b)) return;
    const R = Math.hypot(W.w, W.h);
    fx().ring(W.spirit.x, W.spirit.y, [255, 240, 206], R, 5, 2.2);
    if (big) fx().ring(W.w * 0.6, W.h * 0.7, [255, 226, 170], R * 0.9, 6.5, 1.4);
    W.flash = Math.max(W.flash, big ? 0.34 : 0.24);
    for (const [xf, yf, rf] of [[0.6, 0.86, 0.3], [0.86, 0.84, 0.3], [0.75, 0.7, 0.35], [0.2, 0.75, 0.4], [0.4, 0.66, 0.3]]) bless(xf * W.w, yf * W.h, rf * W.w);
    stirBirds(); breach();
    sfx(b, 'angel'); sfx(b, 'crowd', { soft: !big });
  }
  function goats(b) {
    const c = C();
    if (!c.animal) return;
    [[0.955, -1, 'stand'], [0.928, 1, 'graze'], [0.978, -1, 'stand']].forEach(([x, f, p], i) =>
      U.safe('cast.animal', () => c.animal('goat' + i, { kind: 'goat', layer: 1, x, facing: f, label: '野山羊', pose: p, from: inst(b) ? 'none' : 'fade' })));
    if (!inst(b)) fx().dust(W.w * 0.95, gY(1, 0.95), 16, [206, 186, 156], 20 * LS(1), 'mid');
  }

  // ════════════════════════════════════════════════════════════
  //  幕的开端：诗篇的世界（与上一卷怎样结束无关）
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 起初的地稍干、稍淡（青草与菜蔬只绿到一半，花还少）：到「我必亲自作我羊的牧人」时，才自可安歇的水边向外绿起来（23:2）
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.62, herbs: 0.4, trees: 0.24,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.set('bloom', 0.15, true); W.set('bare', 0.5, true);
    W.freeClock = false;
    const ox = W.w * X.pool, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy);
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.31, 0, true);
    const bx = W.w * 0.95, by = W.ridgeBaseY(2, bx);
    W.setPop('fish', 110, W.w * 0.16, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.14, W.h * 0.78, true);
    W.setPop('bird', 28, W.w * 0.62, W.h * 0.3, true);
    W.setPop('cattle', 2, bx, by, true);
    W.setPop('beast', 2, bx, by, true);      // 只有两只鹿：牧场上没有狮子卧在羊群旁（23 篇不该有威胁）
    W.setPop('creeper', 14, W.w * 0.93, by, true);
    W.setPop('human', 0, ox, oy, true);
    S = fresh();
    PT.length = 0; VT.clear(); danceT = 0; danceP = false;
    const c = C();
    c.clear({ fade: false });
    add('david', { label: '大卫', sex: 'm', age: 'adult', layer: 2, x: X.dav, v: X.davV, facing: -1, pose: 'stand', robe: ROBE_D, glow: 0.35, prop: 'staff', from: 'none' });
    herd('flock', { kind: 'sheep', n: port() ? 6 : 8, x0: 0.5, x1: 0.59, layer: 2, label: '羊群', from: 'none', mill: true });
    spreadV('flock', 0.01, 0.08);
    avoid([0.5, 0.9]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每一句的故事约二十至三十秒）
  //  经文的每一行（<br> 之间）不过十八九个字，在分句处断开：宽屏的经文框里不会把一个词（如「耶和华」）拆在两行
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 卷一 · 1：溪水旁的树 ─────────────────────────────────
    {
      kind: 'act', utter: '耶和华知道义人的道路', cmd: 'git log --follow 义人的道路  # 溪水旁的一棵树', ref: '1:6',
      verse: [
        { text: '他要像一棵树栽在溪水旁，<br>按时候结果子，叶子也不枯干。<br>凡他所做的尽都顺利。', ref: '诗篇 1:3', hold: 7.5 },
        { text: '恶人并不是这样，<br>乃像糠秕被风吹散。', ref: '诗篇 1:4', hold: 5.5 },
        { text: '因为耶和华知道义人的道路；<br>恶人的道路却必灭亡。', ref: '诗篇 1:6', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('psStream', 1, b); avoid([0.5, 0.9]);
            if (!inst(b)) { const g = layout(), p = g.stream.pts[0]; if (p) fx().sparkle(p.x, p.y - 4 * g.s, 30, [214, 236, 255], 10 * g.s, 'near'); sfx(b, 'splash', { soft: true, x: X.src }); }
          }],
          [2.6, b => {
            lv('psTree', 1, b);
            if (!inst(b)) { const t = layout().tree; fx().sparkle(t.x, t.y - 6, 40, [220, 255, 200], 14 * layout().s, 'near'); sfx(b, 'harp', { soft: true }); }
          }],
          [3.4, () => walk('david', 0.668, { speed: 0.018, pose: 'sit' })],
          [8.6, () => face('david', -1)],
          [9.4, b => { chaff(b); sfx(b, 'wind', { soft: true }); }],
          [10.5, b => lv('psFruit', 1, b)],
          [22, b => hint(b, '按住言说时，灵停在天上何处，星宿就陈设在何处', 6)],
        ]);
      },
    },

    // ── 卷一 · 8（147:4）：你所陈设的月亮星宿（灵的星宿：一张琴）──────
    {
      kind: 'name', utter: '他数点星宿的数目，一一称它的名', cmd: 'ls ~/天/星宿 | wc -l && name --each  # 一一称它的名', ref: '147:4',
      verse: [
        { text: '耶和华我们的主啊，<br>你的名在全地何其美！<br>你将你的荣耀彰显于天。', ref: '诗篇 8:1', hold: 6.5 },
        { text: '我观看你指头所造的天，<br>并你所陈设的月亮星宿，便说：<br>人算什么，你竟顾念他！<br>世人算什么，你竟眷顾他！', ref: '诗篇 8:3–4', hold: 8 },
        { text: '你叫他比天使微小一点，<br>并赐他荣耀尊贵为冠冕。', ref: '诗篇 8:5', hold: 6 },
      ],
      apply(c) {
        const L = c.choice && c.choice.lyre ? c.choice.lyre : [clamp(c.x / W.w, 0, 1), clamp(c.y / W.h, 0, 1)];
        T(c, [
          [0, b => { W.goTo(0.015, 11, inst(b)); S.lyre = L.slice(); }],
          [1.5, () => walk('david', X.dav, { speed: 0.02, pose: 'sit' })],
          [5, b => { cpose('flock', 'lie'); sfx(b, 'bleat', { soft: true, far: true }); }],
          [6.5, b => { S.harp = true; face('david', 1); sfx(b, 'harp', { soft: true }); }],
          [7, b => {
            lv('psLyre', 1, b);
            if (!inst(b)) { fx().ring(W.spirit.x, W.spirit.y, [214, 226, 255], M() * 0.18, 2.2, 1); sfx(b, 'stars'); }
          }],
          [11, () => { S.harp = false; pose('david', 'gaze'); face('david', 1); }],
          [20.5, b => { S.harp = true; pose('david', 'sit'); sfx(b, 'harp', { soft: true }); }],
        ]);
        return { lyre: L };
      },
    },

    // ── 卷一 · 19：诸天述说神的荣耀 ──────────────────────────
    {
      kind: 'act', utter: '诸天述说神的荣耀', cmd: 'broadcast --silent 荣耀 | tee 地极', ref: '19:1',
      verse: [
        { text: '诸天述说神的荣耀；穹苍传扬他的手段。<br>这日到那日发出言语；<br>这夜到那夜传出知识。', ref: '诗篇 19:1–2', hold: 7.5 },
        { text: '无言无语，也无声音可听。<br>它的量带通遍天下，它的言语传到地极。', ref: '诗篇 19:3–4', hold: 7 },
        { text: '神在其间为太阳安设帐幕；<br>太阳如同新郎出洞房，<br>又如勇士欢然奔路。', ref: '诗篇 19:4–5', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { lv('psLine', 1, b); sfx(b, 'stars', { soft: true }); }],
          [2, b => W.goTo(0.285, 15, inst(b))],
          [8, () => { S.harp = false; pose('david', 'stand'); }],
          [11, () => cpose('flock', 'graze')],
          [15.5, b => {
            if (inst(b)) return;
            fx().ring(W.sun.x, W.sun.y, [255, 230, 180], M() * 0.55, 3.2, 2);
            fx().sparkle(W.sun.x, W.sun.y, 50, [255, 236, 200], 24, 'sky');
            W.flash = Math.max(W.flash, 0.12);
            sfx(b, 'harp');
          }],
          [16.5, () => { face('david', -1); pose('david', 'raise'); }],
          [18, b => lv('psLine', 0, b)],
          [23, () => pose('david', 'stand')],
        ]);
      },
    },

    // ── 卷一 · 23:1–3（以西结书 34:15）：青草地、可安歇的水边 ─────────
    {
      kind: 'promise', utter: '我必亲自作我羊的牧人', cmd: 'shepherd --pasture=青草地 --water=可安歇的', ref: '以西结书 34:15',
      verse: [
        { text: '耶和华是我的牧者，我必不致缺乏。<br>他使我躺卧在青草地上，<br>领我在可安歇的水边。', ref: '诗篇 23:1–2', hold: 7.5 },
        { text: '他使我的灵魂苏醒，<br>为自己的名引导我走义路。', ref: '诗篇 23:3', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 静水涌成一池，青草与花自水边向外绿遍全地
            lv('psPool', 1, b); W.set('grass', 1, inst(b)); W.set('herbs', 1, inst(b)); W.set('bloom', 1, inst(b)); W.set('bare', 0, inst(b));
            W.goTo(0.4, 10, inst(b));
            if (!inst(b)) {
              const p = layout().pool;
              fx().sparkle(p.x, p.y, 36, [214, 236, 255], p.rx * 0.8, 'near');
              fx().ring(p.x, p.y, [206, 244, 190], M() * 0.9, 4.5, 1.4);
              bless(p.x, p.y, M() * 0.45);
              sfx(b, 'splash', { soft: true });
            }
          }],
          [1.2, () => { walk('david', X.davP, { speed: 0.018 }); sink('david', X.davPV); }],
          [1.6, b => { cwalk('flock', 0.5, 0.595, { speed: 0.022, pose: 'graze' }); sfx(b, 'bleat', { soft: true }); }],
          [4.5, b => { if (!inst(b)) bless(W.w * 0.78, W.h * 0.82, M() * 0.4); }],
          [9, () => cpose('flock', 'lie')],
          [9.5, () => { face('david', -1); pose('david', 'kneel'); }],
          [12, b => {
            glow('david', 0.7);
            if (!inst(b)) { const h = headOf('david', 0.6); fx().sparkle(h[0], h[1], 24, [255, 244, 214], 10, 'air'); sfx(b, 'harp', { soft: true }); }
          }],
          [14.5, () => pose('david', 'sit')],
        ]);
      },
    },

    // ── 卷一 · 23:4–6，32:8：死荫的幽谷，光的路，筵席 ─────────
    {
      kind: 'promise', utter: '我要教导你，指示你当行的路', cmd: 'route --through 死荫的幽谷 --light=on', ref: '32:8',
      verse: [
        { text: '我虽然行过死荫的幽谷，也不怕遭害，<br>因为你与我同在；<br>你的杖，你的竿，都安慰我。', ref: '诗篇 23:4', hold: 7.5 },
        { text: '我要教导你，指示你当行的路；<br>我要定睛在你身上劝戒你。', ref: '诗篇 32:8', hold: 6 },
        { text: '在我敌人面前，你为我摆设筵席；<br>你用油膏了我的头，使我的福杯满溢。', ref: '诗篇 23:5', hold: 6.5 },
        { text: '我一生一世必有恩惠慈爱随着我；<br>我且要住在耶和华的殿中，直到永远。', ref: '诗篇 23:6', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.6, 7, inst(b)); W.set('gloom', 0.72, inst(b));
            pose('david', 'stand'); glow('david', 0.35); cpose('flock', 'stand'); avoid([0.5, 0.9]);
            sfx(b, 'wind', { soft: true, low: true });
          }],
          // 牧人在前（纵深在羊群之前），羊群在后跟着
          [3.5, () => { walk('david', 0.69, { speed: 0.012 }); sink('david', 0.36); }],
          [9.8, b => {
            lv('psPath', 1, b); lv('psWith', 1, b);
            if (!inst(b)) { const h = headOf('david', 0.5); fx().ring(h[0], h[1], [255, 236, 190], M() * 0.35, 2.6, 1.4); sfx(b, 'harp'); }
          }],
          [11.2, () => { walk('david', 0.75, { speed: 0.02 }); sink('david', 0.31); }],
          [11.8, () => cwalk('flock', 0.6, 0.69, { speed: 0.02, pose: 'stand' })],
          [15, () => { walk('david', 0.812, { speed: 0.022 }); sink('david', 0.3); }],
          [15.6, () => cwalk('flock', 0.64, 0.75, { speed: 0.022, pose: 'graze' })],
          [17.4, b => { W.set('gloom', 0, inst(b)); lv('psTable', 1, b); lv('psZion', 0.55, b); sfx(b, 'harp'); }],
          [20.5, b => {
            face('david', 1); pose('david', 'kneel'); lv('psOil', 1, b); lv('psWith', 0.35, b);
            if (!inst(b)) { const h = headOf('david', 0.95); fx().sparkle(h[0], h[1], 26, [255, 226, 150], 8, 'air'); }
          }],
          [26, b => { if (!inst(b)) { const z = layout().zion; fx().ring(z.x, z.y - 20 * z.s, [255, 232, 190], M() * 0.25, 3, 1.2); } }],
        ]);
      },
    },

    // ── 卷一 · 29：耶和华的声音发在水上 ───────────────────────
    {
      kind: 'act', utter: '耶和华的声音发在水上', cmd: 'echo 声音 > /大水  # 打雷', ref: '29:3',
      verse: [
        { text: '耶和华的声音发在水上；<br>荣耀的神打雷，耶和华打雷在大水之上。<br>耶和华的声音大有能力；<br>耶和华的声音满有威严。', ref: '诗篇 29:3–4', hold: 8 },
        { text: '耶和华的声音震破香柏树……<br>耶和华的声音使火焰分岔。', ref: '诗篇 29:5–7', hold: 6 },
        { text: '洪水氾滥之时，耶和华坐着为王；<br>耶和华坐着为王，直到永远。', ref: '诗篇 29:10', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('clouds', 1, inst(b)); W.set('storm', 1, inst(b)); W.set('gale', 0.85, inst(b)); W.set('gloom', 0.3, inst(b));
            lv('psSway', 1, b); lv('psOil', 0, b); lv('psWith', 0, b); lv('psPath', 0, b);
            if (!inst(b)) { fx().ring(W.spirit.x, W.spirit.y, [220, 230, 255], M() * 0.8, 2.4, 2); W.flash = Math.max(W.flash, 0.2); sfx(b, 'wind'); }
          }],
          [1, b => bolt(b, 0.18)],
          [2, b => { W.set('rain', 0.85, inst(b)); sfx(b, 'rain'); }],
          // 牧人跪在树前（羊群伏在他的左边，不遮住他）
          [2.5, () => { pose('david', 'stand'); walk('david', X.dav2, { speed: 0.032, pose: 'kneel' }); sink('david', X.dav2V); }],
          [3, () => cwalk('flock', 0.6, 0.665, { speed: 0.03, pose: 'lie' })],
          [5, b => bolt(b, 0.34)],
          [9.4, b => {
            bolt(b, 0.93, true);
            if (!inst(b)) { W.shake = Math.max(W.shake, 0.5); fx().sparkle(W.w * 0.93, W.h * 0.72, 40, [255, 236, 200], 30, 'near'); }
          }],
          [11.2, b => bolt(b, 0.52)],
          [15, b => bolt(b, 0.26)],
          [18.5, b => bolt(b, 0.62)],
        ]);
      },
    },

    // ── 卷二 · 46:10，51:10，42:1：你们要休息；清洁的心；鹿切慕溪水 ───
    {
      kind: 'cmd', utter: '你们要休息，要知道我是神', cmd: 'kill -STOP 狂风 波浪  # 休息', ref: '46:10',
      verse: [
        { text: '你们要休息，要知道我是神！<br>我必在外邦中被尊崇，<br>在遍地上也被尊崇。', ref: '诗篇 46:10', hold: 6.5 },
        { text: '神是我们的避难所，是我们的力量，<br>是我们在患难中随时的帮助。', ref: '诗篇 46:1', hold: 5.5 },
        { text: '神啊，求你为我造清洁的心，<br>使我里面重新有正直的灵。', ref: '诗篇 51:10', hold: 5.5 },
        { text: '神啊，我的心切慕你，如鹿切慕溪水。<br>我的心渴想神，就是永生神；<br>我几时得朝见神呢？', ref: '诗篇 42:1–2', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('storm', 0, inst(b)); W.set('rain', 0, inst(b)); W.set('gale', 0, inst(b)); W.set('clouds', 0.4, inst(b)); W.set('gloom', 0, inst(b));
            lv('psSway', 0, b); lv('psRay', 1, b); W.goTo(0.665, 20, inst(b));
            if (!inst(b)) { fx().ring(W.spirit.x, W.spirit.y, [255, 246, 226], Math.hypot(W.w, W.h), 4.5, 1.2); sfx(b, 'harp', { soft: true }); }
          }],
          [2.5, () => pose('david', 'stand')],
          [3.5, () => cwalk('flock', 0.49, 0.58, { speed: 0.018, pose: 'graze' })],
          [9, b => { lv('psDeer', 1, b); avoid([0.5, 0.9]); }],
          [10, () => { face('david', 1); pose('david', 'sit'); }],
          [20.5, () => face('david', -1)],
          [24, b => lv('psRay', 0.2, b)],
        ]);
      },
    },

    // ── 卷三 · 80，81:10：葡萄树爬满了地；你要大大张口；使你的脸发光 ─
    {
      kind: 'promise', utter: '你要大大张口，我就给你充满', cmd: 'mv 葡萄树 埃及/ 迦南/ && fill --mouth=大大张口', ref: '81:10',
      verse: [
        { text: '你从埃及挪出一棵葡萄树，<br>赶出外邦人，把这树栽上。<br>你在这树根前预备了地方，<br>它就深深扎根，爬满了地。', ref: '诗篇 80:8–9', hold: 7 },
        { text: '它的影子遮满了山，<br>枝子好像佳美的香柏树。<br>它发出枝子，长到大海，<br>发出蔓子，延到大河。', ref: '诗篇 80:10–11', hold: 6 },
        { text: '我是耶和华你的神，<br>曾把你从埃及地领上来；<br>你要大大张口，我就给你充满。', ref: '诗篇 81:10', hold: 5.5 },
        { text: '耶和华万军之神啊，求你使我们回转，<br>使你的脸发光，我们便要得救！', ref: '诗篇 80:19', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('psVine', 1, b); lv('psRay', 0, b); W.goTo(0.74, 20, inst(b));
            if (!inst(b)) { fx().sparkle(W.w * 0.99, fY(0.99, 0.02), 30, [200, 236, 170], 20, 'near'); sfx(b, 'harp'); }
          }],
          [10, () => pose('david', 'stand')],
          // 「我就给你充满」：葡萄满了枝子
          [15.5, b => {
            lv('psGrape', 1, b);
            if (!inst(b)) { const t = layout().tree; fx().sparkle(W.w * 0.62, fY(0.62, 0.02) - 6, 40, [214, 170, 236], W.w * 0.25, 'near'); bless(t.x, t.y, M() * 0.35); sfx(b, 'harp', { soft: true }); }
          }],
          [22, b => {
            lv('psFace', 1, b);
            if (!inst(b)) { fx().ring(W.sun.x, Math.min(W.sun.y, W.horizonY), [255, 214, 150], M() * 0.6, 3.5, 2); sfx(b, 'angel', { soft: true }); }
          }],
          [22.8, () => { face('david', 1); pose('david', 'raise'); }],
          [28, () => pose('david', 'stand')],
        ]);
      },
    },

    // ── 卷四 · 90：千年如已过的昨日 ───────────────────────────
    {
      kind: 'cmd', utter: '你们世人要归回', cmd: 'uptime  # 千年如已过的昨日', ref: '90:3',
      verse: [
        { text: '主啊，你世世代代作我们的居所。<br>诸山未曾生出，地与世界你未曾造成，<br>从亘古到永远，你是神。', ref: '诗篇 90:1–2', hold: 7.5 },
        { text: '你使人归于尘土，<br>说：你们世人要归回。<br>在你看来，千年如已过的昨日，<br>又如夜间的一更。', ref: '诗篇 90:3–4', hold: 7 },
        { text: '早晨发芽生长，晚上割下枯干。', ref: '诗篇 90:6', hold: 5 },
        { text: '求你指教我们怎样数算自己的日子，<br>好叫我们得着智慧的心。', ref: '诗篇 90:12', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { lv('psFace', 0, b); W.goTo(0.02, 3.5, inst(b)); }],
          [3.5, b => W.goTo(0.3, 3, inst(b))],
          [4.2, b => { W.set('psWither', 0, true); lv('psField', 1, b); }],
          [6.5, b => W.goTo(0.74, 3.5, inst(b))],
          [8.6, b => lv('psWither', 1, b)],
          [10, b => W.goTo(0.02, 3, inst(b))],
          [10.6, b => lv('psField', 0, b)],
          [11.5, () => { S.aged = true; add('david', { age: 'elder', beard: true }); }],
          [13, b => W.goTo(0.3, 3, inst(b))],
          [13.6, b => { W.set('psWither', 0, true); lv('psField', 1, b); }],
          [16, b => W.goTo(0.74, 3.5, inst(b))],
          [18, b => lv('psWither', 1, b)],
          [19.5, b => W.goTo(0.02, 3, inst(b))],
          [20.2, b => lv('psField', 0, b)],
          [22.5, b => W.goTo(0.33, 3.5, inst(b))],
          [23.2, b => { W.set('psWither', 0, true); lv('psField', 1, b); }],
          [26, b => hint(b, '按住言说时，灵在哪里，受造之物就从那里生出', 6)],
        ]);
      },
    },

    // ── 卷四 · 104（50:11）：你发出你的灵，它们便受造 ──────────────
    {
      kind: 'cmd', utter: '山中的飞鸟，我都知道', cmd: 'spawn --from 灵 && renew 地面', ref: '50:11',
      verse: [
        { text: '你发出你的灵，它们便受造；<br>你使地面更换为新。', ref: '诗篇 104:30', hold: 5.5 },
        { text: '耶和华使泉源涌在山谷，流在山间……<br>天上的飞鸟在水旁住宿，在树枝上啼叫。', ref: '诗篇 104:10–12', hold: 6.5 },
        { text: '那里有海，又大又广；<br>其中有无数的动物，大小活物都有。', ref: '诗篇 104:25', hold: 5.5 },
        { text: '耶和华啊，你所造的何其多！<br>都是你用智慧造成的；<br>遍地满了你的丰富。', ref: '诗篇 104:24', hold: 6 },
      ],
      apply(c) {
        const R = c.choice && c.choice.renew ? c.choice.renew : [clamp(c.x / W.w, 0.02, 0.98), clamp(c.y / W.h, 0.05, 0.95)];
        T(c, [
          [0, b => {
            S.renew = R.slice();
            W.set('good', 0.35, inst(b)); W.set('bloom', 1, inst(b)); W.set('grass', 1, inst(b)); W.goTo(0.45, 12, inst(b));
            pose('david', 'stand');
            if (!inst(b)) {
              const x = R[0] * W.w, y = R[1] * W.h;
              fx().ring(x, y, [230, 255, 214], Math.hypot(W.w, W.h) * 0.7, 4, 2);
              fx().sparkle(x, y, 60, [230, 255, 220], 30, 'top');
              bless(x, y, M() * 0.6);
              sfx(b, 'harp');
            }
          }],
          [1.5, b => { W.setPop('bird', 64, R[0] * W.w, R[1] * W.h, inst(b)); sfx(b, 'bird'); }],
          [3, b => { lv('psSpring', 1, b); sfx(b, 'splash', { soft: true, x: 0.75 }); }],
          [6.5, b => goats(b)],
          [8, b => { if (!inst(b)) bless(W.w * 0.75, W.h * 0.72, M() * 0.5); sfx(b, 'bird', { soft: true }); }],
          [14, b => { if (!inst(b)) breach(); W.setPop('fish', 150, W.w * 0.2, W.h * 0.78, inst(b)); }],
          [21, b => { if (!inst(b)) bless(W.w * 0.62, W.h * 0.86, M() * 0.5); }],
        ]);
        return { renew: R };
      },
    },

    // ── 卷三 84 · 卷五 119，121：上行的人；保护以色列的不打盹 ───
    {
      kind: 'act', utter: '保护以色列的，也不打盹也不睡觉', cmd: 'watch -n 0 以色列  # 不打盹也不睡觉', ref: '121:4',
      verse: [
        { text: '万军之耶和华啊，<br>你的居所何等可爱！', ref: '诗篇 84:1', hold: 5 },
        { text: '你的话是我脚前的灯，<br>是我路上的光。', ref: '诗篇 119:105', hold: 5 },
        { text: '我要向山举目；我的帮助从何而来？<br>我的帮助从造天地的耶和华而来。', ref: '诗篇 121:1–2', hold: 6.5 },
        { text: '他必不叫你的脚摇动；<br>保护你的必不打盹！<br>保护以色列的，也不打盹也不睡觉。', ref: '诗篇 121:3–4', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.785, 8, inst(b)); W.set('good', 0, inst(b));
            // 上行的人在羊群的右边出现（不在羊群里），往殿那边走去
            crowd('pilgrims', { n: port() ? 5 : 7, x0: 0.6, x1: 0.672, label: '上行的人', pose: 'stand' });
            spreadV('pilgrims', 0.01, 0.1);
            cface('pilgrims', 1);
            lv('psLamp', 1, b); lv('psZion', 0.8, b);
            avoid([0.47, 1]);
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [1.5, () => cwalk('pilgrims', 0.78, 0.96, { speed: 0.022, pose: 'stand' })],
          [2.2, () => { walk('david', X.dav2, { speed: 0.02, pose: 'sit' }); sink('david', X.dav2V); }],
          [8, b => W.goTo(0.965, 9, inst(b))],
          [12.6, b => { S.harp = true; face('david', 1); sfx(b, 'harp', { soft: true }); }],
          [14.5, b => { cpose('pilgrims', 'lie'); lv('psLamp', 0.6, b); }],
          [16, b => { lv('psKeep', 1, b); sfx(b, 'harp', { soft: true, low: true }); }],
        ]);
      },
    },

    // ── 卷五 · 139：清晨的翅膀，飞到海极 ─────────────────────
    {
      kind: 'act', utter: '黑夜却如白昼发亮', cmd: 'find / -name 我  # 海极也在你手中', ref: '139:12',
      verse: [
        { text: '我往哪里去躲避你的灵？<br>我往哪里逃、躲避你的面？<br>我若升到天上，你在那里；<br>我若在阴间下榻，你也在那里。', ref: '诗篇 139:7–8', hold: 8 },
        { text: '黑暗也不能遮蔽我，使你不见，<br>黑夜却如白昼发亮。<br>黑暗和光明，在你看都是一样。', ref: '诗篇 139:12', hold: 6.5 },
        { text: '我若展开清晨的翅膀，飞到海极居住，<br>就是在那里，你的手必引导我；<br>你的右手也必扶持我。', ref: '诗篇 139:9–10', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => W.goTo(0.285, 14, inst(b))],
          [4, b => lv('psKeep', 0, b)],
          [9, b => { cpose('pilgrims', 'stand'); lv('psLamp', 0, b); }],
          [10, () => { S.harp = false; pose('david', 'stand'); face('david', -1); }],
          [12.5, b => { lv('psWings', 1, b); sfx(b, 'wings'); }],
          [14.5, b => {
            lv('psFlight', 1, b);
            if (!inst(b)) { const h = headOf('david', 1.1); fx().sparkle(h[0], h[1], 30, [255, 240, 210], 10, 'air'); sfx(b, 'dove'); }
          }],
          [15.5, () => pose('david', 'raise')],
          [17, () => cwalk('pilgrims', 0.86, 0.97, { speed: 0.02, pose: 'stand' })],
          [23, () => pose('david', 'stand')],
          [26.2, b => { if (!inst(b)) { const f = flightGeo(1); fx().ring(f[0], f[1], [255, 236, 200], M() * 0.25, 3, 1.4); sfx(b, 'harp', { soft: true }); } }],
        ]);
      },
    },

    // ── 卷五 · 148，150：凡有气息的都要赞美耶和华 ─────────────
    {
      kind: 'cmd', utter: '凡有气息的都要赞美耶和华', cmd: 'broadcast 赞美 --to 凡有气息的  # 阿们', ref: '150:6',
      verse: [
        { text: '所有在地上的，大鱼和一切深洋……<br>大山和小山，结果的树木和一切香柏树，<br>野兽和一切牲畜，昆虫和飞鸟……', ref: '诗篇 148:7–10', hold: 6.5 },
        { text: '少年人和处女，老年人和孩童，<br>都当赞美耶和华！', ref: '诗篇 148:12', hold: 5 },
        { text: '要用角声赞美他，鼓瑟弹琴赞美他！<br>击鼓跳舞赞美他！<br>用丝弦的乐器和箫的声音赞美他！', ref: '诗篇 150:3–4', hold: 6.5 },
        { text: '凡有气息的都要赞美耶和华！<br>你们要赞美耶和华！', ref: '诗篇 150:6', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.42, 9, inst(b)); W.set('good', 1, inst(b));
            lv('psPraise', 1, b); lv('psBreath', 0.65, b); lv('psWings', 0, b); lv('psZion', 1, b);
            W.setPop('bird', 84, W.w * 0.62, W.h * 0.32, inst(b));
            // 牧人抱琴站在众民之前（纵深在最前）；走兽都在海边那一头，不挤进人群
            S.harp = true; pose('david', 'carry'); face('david', 1); sink('david', 0.3);
            cpose('flock', 'stand'); cpose('pilgrims', 'raise');
            avoid([0.46, 1]);
            allAtOnce(b, false);
          }],
          [0.6, b => {
            const from = inst(b) ? 'none' : 'light', P = port(), n = P ? 4 : 6;
            // 两排人：后排举手、前排站着，避开大卫（0.70–0.745）与筵席（0.825–0.865）
            crowd('praiseA', { n, x0: 0.6, x1: 0.97, label: '众民', pose: 'raise', from });
            crowd('praiseB', { n, x0: 0.62, x1: 0.95, label: '众民', pose: 'stand', from });
            placeX('praiseA', P ? [0.61, 0.775, 0.885, 0.95] : [0.605, 0.65, 0.768, 0.806, 0.886, 0.94]);
            placeX('praiseB', P ? [0.66, 0.8, 0.905, 0.97] : [0.628, 0.677, 0.755, 0.795, 0.905, 0.962]);
            spreadV('praiseA', 0.02, 0.09); spreadV('praiseB', 0.13, 0.22);
          }],
          [1.2, () => { S.dance = true; }],
          [13, b => { S.instr = true; sfx(b, 'harp'); sfx(b, 'crowd'); }],
          [21, b => { lv('psBreath', 1, b); allAtOnce(b, true); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '诗篇', books: [19], title: '诗篇', sub: '诗篇 1 — 150', tint: [255, 240, 210], music: 'eden',
    outro: 20,
    intro: [
      { text: '不从恶人的计谋，不站罪人的道路，<br>不坐亵慢人的座位，<br>惟喜爱耶和华的律法，昼夜思想，<br>这人便为有福！', ref: '诗篇 1:1–2', hold: 8 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '大卫': { text: '又拣选他的仆人大卫，从羊圈中将他召来，<br>叫他不再跟从那些带奶的母羊，<br>为要牧养自己的百姓雅各<br>和自己的产业以色列。', ref: '诗篇 78:70–71' },
      '羊群': { text: '因为他是我们的神；<br>我们是他草场的羊，是他手下的民。', ref: '诗篇 95:7' },
      '羊': { text: '你们当晓得耶和华是神！<br>我们是他造的，也是属他的；<br>我们是他的民，也是他草场的羊。', ref: '诗篇 100:3' },
      '溪水旁的树': { text: '他要像一棵树栽在溪水旁，<br>按时候结果子，叶子也不枯干。<br>凡他所做的尽都顺利。', ref: '诗篇 1:3' },
      '溪水': { text: '有一道河，这河的分汊使神的城欢喜；<br>这城就是至高者居住的圣所。', ref: '诗篇 46:4' },
      '可安歇的水边': { text: '他使我躺卧在青草地上，<br>领我在可安歇的水边。', ref: '诗篇 23:2' },
      '月亮星宿': { text: '我观看你指头所造的天，<br>并你所陈设的月亮星宿，便说：<br>人算什么，你竟顾念他！', ref: '诗篇 8:3–4' },
      '琴': { text: '我的灵啊，你当醒起！<br>琴瑟啊，你们当醒起！<br>我自己要极早醒起！', ref: '诗篇 57:8' },
      '筵席': { text: '在我敌人面前，你为我摆设筵席；<br>你用油膏了我的头，使我的福杯满溢。', ref: '诗篇 23:5' },
      '耶和华的殿': { text: '有一件事，我曾求耶和华，我仍要寻求：<br>就是一生一世住在耶和华的殿中，<br>瞻仰他的荣美，在他的殿里求问。', ref: '诗篇 27:4' },
      '锡安': { text: '锡安山大君王的城，<br>在北面居高华美，为全地所喜悦。', ref: '诗篇 48:2' },
      '耶路撒冷': { text: '众山怎样围绕耶路撒冷，<br>耶和华也照样围绕他的百姓，<br>从今时直到永远。', ref: '诗篇 125:2' },
      '鹿': { text: '神啊，我的心切慕你，如鹿切慕溪水。', ref: '诗篇 42:1' },
      '葡萄树': { text: '你从埃及挪出一棵葡萄树，<br>赶出外邦人，把这树栽上。', ref: '诗篇 80:8' },
      '泉源': { text: '耶和华使泉源涌在山谷，流在山间，<br>使野地的走兽有水喝，野驴得解其渴。', ref: '诗篇 104:10–11' },
      '野山羊': { text: '高山为野山羊的住所；<br>岩石为沙番的藏处。', ref: '诗篇 104:18' },
      '山羊': { text: '高山为野山羊的住所；<br>岩石为沙番的藏处。', ref: '诗篇 104:18' },
      '上行的人': { text: '人对我说：<br>我们往耶和华的殿去，我就欢喜。<br>耶路撒冷啊，我们的脚站在你的门内。', ref: '诗篇 122:1–2' },
      '灯': { text: '你的话是我脚前的灯，<br>是我路上的光。', ref: '诗篇 119:105' },
      '众民': { text: '少年人和处女，老年人和孩童，<br>都当赞美耶和华！', ref: '诗篇 148:12' },
      '鲸': { text: '愿天和地、洋海<br>和其中一切的动物都赞美他！', ref: '诗篇 69:34' },
      '鱼': { text: '空中的鸟、海里的鱼，<br>凡经行海道的，都服在他的脚下。', ref: '诗篇 8:6' },
      '狮子': { text: '少壮狮子吼叫，要抓食，向神寻求食物。', ref: '诗篇 104:21' },
      '燕子': { text: '万军之耶和华我的王，我的神啊，<br>在你祭坛那里，麻雀为自己找着房屋，<br>燕子为自己找着抱雏之窝。', ref: '诗篇 84:3' },
      '雀鸟': { text: '雀鸟在其上搭窝；<br>至于鹤，松树是它的房屋。', ref: '诗篇 104:17' },
      '鹰': { text: '他用美物使你所愿的得以知足，<br>以致你如鹰返老还童。', ref: '诗篇 103:5' },
      '牛': { text: '因为，树林中的百兽是我的，<br>千山上的牲畜也是我的。', ref: '诗篇 50:10' },
      '橄榄树': { text: '至于我，就像神殿中的青橄榄树；<br>我永永远远倚靠神的慈爱。', ref: '诗篇 52:8' },
      '香柏树': { text: '佳美的树木，就是黎巴嫩的香柏树，<br>是耶和华所栽种的，都满了汁浆。', ref: '诗篇 104:16' },
      '棕树': { text: '义人要发旺如棕树，<br>生长如黎巴嫩的香柏树。', ref: '诗篇 92:12' },
      '马': { text: '他不喜悦马的力大，不喜爱人的腿快。', ref: '诗篇 147:10' },
    },
  });
})(window.GS);
