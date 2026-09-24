/* ─────────────────────────────────────────────────────────────
 * book/thess.js —— 帖撒罗尼迦书 · 主必降临（帖撒罗尼迦前书 1 — 帖撒罗尼迦后书 3）
 *
 * 书信没有情节：一夜之间，帖撒罗尼迦城里一个小小的家中聚会，灯下念着一封信；信里的每一句话，都在这夜里成为看得见的光。
 * 子夜：海湾边的城，城墙与屋顶，耶孙的家门里一点灯光；城外路旁是坟地；城东头的小庙前，祭坛的火映着偶像。
 * 「不独在乎言语，也在乎权能和圣灵」——光自上头落在灯台上，三盏灯一盏一盏点起：信、爱、望。
 * 「要服事那又真又活的神」——主的道从这家传出去：远远的马其顿与亚该亚，一处一处亮起灯来；
 *   拜偶像的人站起来，转身走进灯光里；祭坛的火熄了，偶像裂开，塌成一堆碎石。众人抬头，等候他儿子从天降临。
 * 「这道实在是神的」——信展开，发光；光一缕一缕进到听的人心里。母亲抱着孩子，灯下温柔。
 * 「你们自己蒙了神的教训，叫你们彼此相爱」——患难如大风吹过，灯火摇动，他们站立得稳；两人举起火把，城中的窗一扇扇亮起来。
 * 「神也必将他们与耶稣一同带来」——忧伤的人跪在城外的坟前哭；每座坟上点起一点不灭的光。
 * 「主必亲自从天降临」——天开了，光如黎明自东方来；主自己降在光明的云里，天使长的号吹响；坟里睡了的人先起来，化作光往上去。
 * 「这样，我们就要和主永远同在」——活着的人的光也一同升到云里，在空中与主相遇；异象渐渐隐去，他们彼此相拥劝慰。
 * 「主的日子来到，好像夜间的贼一样」——城睡了，窗都暗了，月也被云遮住；惟有这一家不在黑暗里：光明之子，护心镜与头盔的光。
 * 「要常常喜乐，不住地祷告，凡事谢恩」——有的举手，有的跪下祷告，有的俯首；东方发白，鸟醒了；灯火不灭，反而更高。
 * 「那召你们的本是信实的，他必成就这事」——晨星在东方出来；一层光罩住这家与城外的坟：灵与魂与身子都蒙保守。
 * 「要在他圣徒的身上得荣耀」——日头出来了；又有信的人从城里来；晨光落在他们身上，都有荣光。
 * 「用降临的荣光废掉他」——倒塌的小庙上升起一股冷暗的烟，遮住半个天；一阵光的风自东方吹来，烟就散尽了。
 * 「愿赐平安的主随时随事亲自给你们平安！」——清晨，各人安静做工；行善的不丧志；平安的光铺满全地。
 *
 * 父不显为人形：只有天上来的光与旁白的声音。子在异象里是光，不是人的面貌；灵是玩家自己的那点光。
 * 不法的人不是活物：只是一股冷暗的烟与红黑的暗光，被光吹散。
 *
 * 画面的方位（桌面）：海在左；城在中丘（0.52–1）；近地上，城外的坟地在 0.54–0.6，耶孙的家与院中的人在 0.62–0.81，
 *   城东头的小庙在 0.93（庙前的祭坛 0.874）。异象在坟地与院子的上空（0.58, 0.2）；晨星在东方（左）。
 * 竖屏的手机：人少几个、前后两排（v），异象在经文之下（0.6, 0.45）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ease = U.easeInOut;
  const ACT = 'thess';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    thL1: ['exp', 1.4], thL2: ['exp', 1.4], thL3: ['exp', 1.4],   // 三盏灯：信、爱、望
    thSpirit: ['exp', 0.6],   // 不要消灭圣灵的感动：灯火更高
    thWord: ['lin', 0.13],    // 主的道传扬出去：远处一处处的灯
    thIdol: ['lin', 0.28],    // 偶像（1 立着 → 0 塌成碎石）
    thAltar: ['exp', 0.9],    // 偶像前祭坛的火
    thScroll: ['exp', 1.0],   // 信展开、发光
    thCity: ['lin', 0.13],    // 城中亮着的窗（比例）
    thHope: ['lin', 0.3],     // 坟上的光
    thOpen: ['exp', 0.55],    // 天开了
    thLord: ['lin', 0.25],    // 主降临的路程
    thArch: ['exp', 0.9],     // 天使长
    thRise: ['lin', 0.16],    // 在基督里死了的人先复活
    thCaught: ['lin', 0.17],  // 活着的人一同被提到云里
    thVision: ['lin', 0.22],  // 异象的整体（隐去时降为 0）
    thDay: ['exp', 0.6],      // 光明之子：院中一片光
    thArmour: ['exp', 0.7],   // 护心镜与头盔的光
    thGrey: ['exp', 0.3],     // 东方低处初透的冷灰的晨光
    thStar: ['exp', 0.35],    // 东方的晨星
    thKeep: ['exp', 0.5],     // 得蒙保守：罩住这家与坟地的光
    thGlory: ['exp', 0.6],    // 在圣徒身上得荣耀
    thShadow: ['lin', 0.17],  // 不法的隐意：冷暗的烟
    thDispel: ['lin', 0.3],   // 口中的气：光的风
    thPeace: ['exp', 0.35],   // 平安
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 地上的位置（画面宽度的比例）：桌面 XD / 竖屏 XP ───────────────
  const XD = {
    tomb: 0.541, st0: 0.561, st1: 0.577, st2: 0.593, gMourn: 0.605, gAris: 0.622,
    aris: 0.628, mourn: 0.648, mother: 0.667, child: 0.685, lamps: 0.707, jason: 0.74, sec: 0.773, house: 0.745,
    t1: 0.611, t2: 0.79, t3: 0.806, embA: 0.64,
    i1: 0.826, i2: 0.842, i3: 0.857, altar: 0.874, shrine: 0.93,
    n0: 0.825, n1: 0.895, court: 0.7,
  };
  const XP = {
    tomb: 0.472, st0: 0.498, st1: 0.518, st2: 0.538, gMourn: 0.562, gAris: 0.59,
    aris: 0.584, mourn: 0.605, mother: 0.627, child: -1, lamps: 0.66, jason: 0.694, sec: 0.728, house: 0.702,
    t1: 0.566, t2: 0.75, t3: 0.772, embA: 0.595,
    i1: 0.772, i2: 0.792, i3: 0.812, altar: 0.838, shrine: 0.905,
    n0: 0.79, n1: 0.81, court: 0.66,
  };
  // 竖屏时前后两排（v：在近地纵深里靠前）
  const VP = { aris: 0, mourn: 0.3, mother: 0.05, jason: 0.02, sec: 0.3, t1: 0.28, t2: 0.04, t3: 0.3, i1: 0, i2: 0.25, i3: 0.05 };
  const VD = { aris: 0.02, mourn: 0.1, mother: 0.14, child: 0.18, jason: 0.04, sec: 0.08, t1: 0, t2: 0.02, t3: 0.12, i1: 0.02, i2: 0.1, i3: 0.04 };
  const X = Object.assign({}, XD);
  let PORT = false;
  function layout() {
    PORT = W.w < W.h * 0.9;
    Object.assign(X, PORT ? XP : XD);
    CITY = null; FAR = null;
  }
  const vOf = id => (PORT ? VP[id] : VD[id]) || 0;
  // 异象的中心（画面比例）：桌面在坟地与院子上空；竖屏在经文之下
  // 「永远同在」之后，异象一面隐去，一面升到高处
  const VPT = () => { const up = lv('thCaught') > 0.99 ? (1 - lv('thVision')) * 0.08 : 0; return PORT ? [0.6, 0.45 - up] : [0.58, 0.2 - up]; };
  const visA = () => Math.pow(lv('thVision'), 1.6);

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { turned: 0, newc: 0, work: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const PH = () => 34 * LS(2);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.hands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); else { pose(a, 'stand'); pose(b, 'stand'); } }
  function sfx(b, name, o) { if (b && b.instant) return; const a = au(); if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o)); }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 院中的人（有名字的）
  // 拜偶像的人（i1–i3）归向神之后（S.turned）也是信的人：一同被提、戴上光的护心镜与头盔、一同得荣耀
  const BEL = ['aris', 'mourn', 'mother', 'child', 'jason', 'sec', 'i1', 'i2', 'i3'];
  const present = () => BEL.filter(id => has(id) && (!/^i\d$/.test(id) || S.turned));
  // 被提时各人往云里去的次序（按地上由左到右，免得光的路径交错）
  const RISE = ['mourn', 'aris', 'i1', 'mother', 'child', 'jason', 'sec', 'i2', 'i3'];
  const riseIds = () => { const ps = present(); return RISE.filter(id => ps.includes(id)); };
  const caughtP = (c, j, n) => clamp((c - j * 0.05) / (1 - Math.max(0, n - 1) * 0.05), 0, 1);
  // 人身上的一点（像素）：k 0 = 脚，1 = 头顶
  function figPt(id, k) {
    const f = fig(id);
    if (!f) return null;
    const kk = k == null ? 1 : k;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || PH()) * kk];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, gY(l, f.nx) - PH() * kk];
  }
  // 名字（光聚成的字）：在干净的天上
  function nameAt(b, str, xf, yf, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || (PORT ? 0.058 * W.w : 40 * u), (W.w * 0.8) / (n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(xf * W.w, half + 6, W.w - half - 6), cy = yf * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * 60 * u, cy + 40 * u + Math.random() * 30 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 228, 170], src, { hold: o.hold || 3.2 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function ringAt(b, x, y, r, rgb, dur, w) {
    if (b.instant || !fx()) return;
    fx().ring(x, y, rgb || [255, 240, 204], M() * (r || 0.2), dur || 2.4, w || 1.6);
  }
  function sparkleAt(b, x, y, n, rgb, spread) {
    if (b.instant || !fx()) return;
    fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], (spread || 14) * SU(), 'top');
  }
  function ringOn(b, id, r, rgb, k) { const p = figPt(id, k == null ? 0.55 : k); if (p) ringAt(b, p[0], p[1], r, rgb); }
  function sparkleOn(b, id, n, rgb, k) { const p = figPt(id, k == null ? 0.6 : k); if (p) sparkleAt(b, p[0], p[1], n, rgb); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
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
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([226, 234, 255], 1), lamp: radial([255, 150, 60], 1, 0.22), dawn: radial([255, 226, 200], 1, 0.4),
        cloud: radial([255, 250, 238], 1, 0.6), smoke: radial([18, 12, 18], 1, 0.6), ember: radial([170, 36, 28], 1, 0.4),
        cold: radial([150, 176, 210], 1, 0.3), grey: radial([188, 198, 222], 1, 0.4),
      };
      // 自天而降的光柱：上淡、中亮、下渐隐
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,246,222,0)'); hz.addColorStop(0.5, 'rgba(255,250,236,1)'); hz.addColorStop(1, 'rgba(255,246,222,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.15)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 火苗（灯、祭坛、火把）
  function flame(ctx, x, y, h, k, seed, lean) {
    if (k < 0.01 || !SP || !(h > 0.3)) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.4, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    const ln = (lean || 0) * h;
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = k * q[3];
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9 + ln * 0.4, y - H * 0.55, sx + ln + Math.sin(W.t * 8 + seed + i) * w * 0.45, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9 + ln * 0.4, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 发光的人形（异象里的主、天使长、复活的人）：没有面目，只有光
  function lightFigure(ctx, x, y, h, a, seed, col, halo) {
    if (a < 0.01 || h < 0.8 || !SP) return;
    ctx.globalAlpha = a * (halo == null ? 0.45 : halo);
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = a;
    ctx.fillStyle = col || 'rgb(255,250,236)';
    const sw = Math.sin(W.t * 1.7 + seed) * 0.03 * h;
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * h, y);
    ctx.quadraticCurveTo(x - 0.13 * h + sw, y - 0.45 * h, x - 0.075 * h, y - 0.78 * h);
    ctx.lineTo(x + 0.075 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.13 * h + sw, y - 0.45 * h, x + 0.17 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.078 * h, y - 0.88 * h); ctx.arc(x, y - 0.88 * h, 0.078 * h, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 被提的时候，地上那人的身子随着自己的光柱隐去（化作光被提上去）；异象隐去（thVision 落下）时复原。
  // 只由程度（thCaught、thVision）推出，恢复存档与提前言说时自然一样。
  let CF = false;
  function caughtFade() {
    const c = lv('thCaught'), vk = clamp((lv('thVision') - 0.75) / 0.25, 0, 1);
    const on = c > 0.001 && vk > 0.001;
    if (!on && !CF) return;
    const ids = riseIds(), n = ids.length;
    ids.forEach((id, j) => {
      const f = fig(id);
      if (!f || f.dying) return;
      const k = on ? smoothstep(0.02, 0.3, caughtP(c, j, n)) * vk : 0;
      f.targetAlpha = 1 - 0.9 * k;
    });
    CF = on;
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function trans(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  城（中丘）：房屋、城墙、城楼；夜里窗里的灯
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  function cityModel() {
    if (CITY) return CITY;
    const r = U.mulberry32(5203), s = LS(1);
    const hs = [], tw = [];
    const x0 = 0.512 * W.w, x1 = W.w * 1.01;
    for (const back of [1, 0]) {
      let x = x0 + (back ? 4 : 0) * s;
      while (x < x1) {
        const w = (back ? 12 : 10) + r() * (back ? 11 : 9), h = (back ? 11 : 8) + r() * (back ? 10 : 7);
        const f = (x + (w * s) / 2) / W.w;
        const wins = [];
        const nw = r() < 0.25 ? 0 : r() < 0.7 ? 1 : 2;
        for (let i = 0; i < nw; i++) {
          const dx = nw === 1 ? (r() - 0.5) * 0.4 : (i ? 0.22 : -0.22);
          const rank = clamp(Math.abs(f - X.court) / 0.5, 0, 1) * 0.82 + r() * 0.18;
          wins.push({ dx, dy: 0.42 + r() * 0.2, rank, ph: r() * TAU });
        }
        hs.push({ f, w, h, back, roof: r() < 0.42 ? 1 : 0, tone: r(), wins });
        x += (w + 0.6 + r() * (back ? 2.5 : 4.5)) * s;
      }
    }
    // 城楼
    for (let f = 0.53; f < 1.0; f += 0.07 + r() * 0.05) tw.push({ f, h: 12 + r() * 4 });
    CITY = { hs, tw };
    return CITY;
  }
  function drawCity(ctx) {
    const l = 1, s = LS(l), m = cityModel(), nk = nightK();
    const d = litX() >= W.w * 0.75 ? 1 : -1;
    const ST = [214, 198, 168], ST2 = [188, 170, 140], ROOF = [166, 146, 118], TILE = [150, 88, 66];
    const wins = [];
    for (const h of m.hs) {
      const x = h.f * W.w, gy = gY(l, h.f) + 2 * s - (h.back ? 6 * s : 0), w = h.w * s, hh = h.h * s;
      const tone = mix(ST, ST2, h.tone);
      ctx.fillStyle = css(tone, l, 1, h.back ? -0.04 : 0);
      ctx.fillRect(x - w / 2, gy - hh, w, hh + (h.back ? 6 * s : 2 * s));
      ctx.fillStyle = css(mul(tone, 0.72), l, 0.8);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.24, gy - hh, w * 0.24, hh);
      if (h.roof) {
        ctx.fillStyle = css(TILE, l);
        ctx.beginPath();
        ctx.moveTo(x - w / 2 - 1 * s, gy - hh + 0.4 * s);
        ctx.lineTo(x, gy - hh - w * 0.2);
        ctx.lineTo(x + w / 2 + 1 * s, gy - hh + 0.4 * s);
        ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = css(ROOF, l);
        ctx.fillRect(x - w / 2 - 0.6 * s, gy - hh - 1.2 * s, w + 1.2 * s, 1.4 * s);
      }
      for (const q of h.wins) wins.push([x + q.dx * w, gy - hh * q.dy, q.rank, q.ph]);
    }
    // 城墙：沿着中丘的岭线，城墙前面一道
    const N = 44, wx0 = 0.515, wx1 = 1.01;
    ctx.fillStyle = css([196, 180, 148], l);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N); const yy = gY(l, f) + 2 * s - 6.5 * s; if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
    for (let i = N; i >= 0; i--) { const f = lerp(wx0, wx1, i / N); ctx.lineTo(f * W.w, gY(l, f) + 4 * s); }
    ctx.closePath(); ctx.fill();
    for (let f = wx0; f < wx1; f += (3.2 * s) / W.w) { const yy = gY(l, f) + 2 * s - 6.5 * s; ctx.fillRect(f * W.w, yy - 1.6 * s, 1.6 * s, 1.7 * s); }
    for (const t of m.tw) {
      const x = t.f * W.w, gy = gY(l, t.f) + 2 * s;
      ctx.fillStyle = css([204, 188, 154], l);
      ctx.fillRect(x - 4 * s, gy - t.h * s, 8 * s, t.h * s);
      ctx.fillRect(x - 5 * s, gy - t.h * s - 1.6 * s, 10 * s, 1.8 * s);
      ctx.fillStyle = css([60, 48, 38], l, 0.8);
      ctx.fillRect(x - 0.8 * s, gy - t.h * s + 3 * s, 1.6 * s, 2.6 * s);
    }
    ctx.strokeStyle = css([252, 238, 206], l, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N); const yy = gY(l, f) + 2 * s - 8.2 * s; if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
    ctx.stroke();
    // 窗里的灯（夜里；thCity 决定亮几扇：离这家近的先亮、远的先暗）
    const lit = lv('thCity'), lk = nk;
    if (lk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const q of wins) {
        const on = clamp((lit - q[2]) / 0.05, 0, 1);
        if (on <= 0.01) continue;
        const fl = 0.8 + 0.2 * Math.sin(W.t * 3 + q[3]);
        ctx.globalAlpha = Math.min(1, lk * fl * on);
        ctx.fillStyle = 'rgb(255,190,110)';
        ctx.fillRect(q[0] - 0.8 * s, q[1] - 0.9 * s, 1.6 * s, 1.8 * s);
        glowAt(ctx, SP.lamp, q[0], q[1], 7 * s, lk * fl * 0.45 * on);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  远处的灯：马其顿（城后的远山）与亚该亚（海湾那边）——主的道传扬出去
  // ════════════════════════════════════════════════════════════
  let FAR = null;
  function farModel() {
    if (FAR) return FAR;
    const r = U.mulberry32(812), pts = [];
    for (let i = 0; i < 11; i++) { const f = 0.535 + i * 0.043 + (r() - 0.5) * 0.02; pts.push({ f, th: 0.03 + i * 0.035 + r() * 0.04, reg: 'M', ph: r() * TAU }); }
    for (let i = 0; i < 9; i++) { const f = 0.47 - i * 0.041 + (r() - 0.5) * 0.016; pts.push({ f, th: 0.42 + i * 0.055 + r() * 0.03, reg: 'A', ph: r() * TAU }); }
    FAR = pts;
    return FAR;
  }
  function farPt(q) { const s = LS(0); return [q.f * W.w, gY(0, q.f) - 1.2 * s]; }
  function drawFar(ctx) {
    const k = lv('thWord');
    if (k < 0.005 || !SP) return;
    const s = LS(0), vis = 0.3 + 0.7 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of farModel()) {
      const on = clamp((k - q.th) / 0.05, 0, 1);
      if (on <= 0) continue;
      const [x, y] = farPt(q);
      const flare = Math.max(0, 1 - Math.abs(k - q.th - 0.05) / 0.06);
      const fl = 0.8 + 0.2 * Math.sin(W.t * 2.4 + q.ph);
      glowAt(ctx, SP.lamp, x, y, (7 + 16 * flare) * s * 1.6, vis * on * (0.5 + 0.5 * flare) * fl);
      ctx.globalAlpha = Math.min(1, vis * on * fl);
      ctx.fillStyle = 'rgb(255,214,150)';
      ctx.fillRect(x - 0.9 * s, y - 0.9 * s, 1.8 * s, 1.8 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  城外的坟地：一座马其顿式的小墓（土丘与门面）与三块石碑；坟上的光
  // ════════════════════════════════════════════════════════════
  const STELE = () => [[X.st0, 15, -0.04], [X.st1, 13, 0.03], [X.st2, 16, -0.02]];
  function gravePts() {
    const s = LS(2), out = [];
    out.push([X.tomb * W.w, gY(2, X.tomb) - 4 * s]);
    for (const q of STELE()) out.push([q[0] * W.w, gY(2, q[0]) - (q[1] + 4) * s]);
    return out;
  }
  function drawGraves(ctx) {
    const s = LS(2), l = 2;
    const d = litX() >= X.tomb * W.w ? 1 : -1;
    // 小墓：土丘，门面，门
    const tx = X.tomb * W.w, ty = gY(l, X.tomb) + 2 * s;
    ctx.fillStyle = css([92, 80, 62], l);
    ctx.beginPath();
    ctx.moveTo(tx - 20 * s, ty);
    ctx.quadraticCurveTo(tx - 12 * s, ty - 15 * s, tx + 2 * s, ty - 15 * s);
    ctx.quadraticCurveTo(tx + 14 * s, ty - 15 * s, tx + 20 * s, ty);
    ctx.closePath(); ctx.fill();
    const ST = [206, 198, 182];
    ctx.fillStyle = css(ST, l);
    ctx.fillRect(tx - 7 * s, ty - 12 * s, 14 * s, 12 * s);
    ctx.beginPath(); ctx.moveTo(tx - 8.5 * s, ty - 12 * s); ctx.lineTo(tx, ty - 16 * s); ctx.lineTo(tx + 8.5 * s, ty - 12 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(mul(ST, 0.7), l);
    ctx.fillRect(tx - 5.5 * s, ty - 10.8 * s, 1.4 * s, 10.8 * s); ctx.fillRect(tx + 4.1 * s, ty - 10.8 * s, 1.4 * s, 10.8 * s);
    ctx.fillStyle = css([34, 30, 28], l);
    ctx.fillRect(tx - 2.8 * s, ty - 8.5 * s, 5.6 * s, 8.5 * s);
    ctx.strokeStyle = css([252, 240, 214], l, 0.35 * dayA(), 0.15); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(tx - 8.5 * s, ty - 12 * s); ctx.lineTo(tx, ty - 16 * s); ctx.lineTo(tx + 8.5 * s, ty - 12 * s); ctx.stroke();
    const moon = moonRim();
    if (moon > 0.01) {
      ctx.strokeStyle = U.rgba(206, 220, 246, moon); ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.moveTo(tx - 8.5 * s, ty - 12 * s); ctx.lineTo(tx, ty - 16 * s); ctx.lineTo(tx + 8.5 * s, ty - 12 * s); ctx.lineTo(tx + 8.5 * s, ty - 12 * s);
      ctx.moveTo(tx - 7 * s, ty); ctx.lineTo(tx - 7 * s, ty - 12 * s); ctx.stroke();
      ctx.strokeStyle = U.rgba(206, 220, 246, moon * 0.5);
      ctx.beginPath(); ctx.moveTo(tx - 20 * s, ty); ctx.quadraticCurveTo(tx - 12 * s, ty - 15 * s, tx - 7 * s, ty - 14.6 * s); ctx.stroke();
    }
    // 石碑
    for (const q of STELE()) {
      const x = q[0] * W.w, y = gY(l, q[0]) + 2 * s, h = q[1] * s, w = 5.6 * s;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(q[2]);
      ctx.fillStyle = css(ST, l);
      ctx.fillRect(-w / 2, -h, w, h);
      ctx.beginPath(); ctx.moveTo(-w / 2 - 0.6 * s, -h); ctx.lineTo(0, -h - 2.6 * s); ctx.lineTo(w / 2 + 0.6 * s, -h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(mul(ST, 0.72), l);
      ctx.fillRect(d > 0 ? -w / 2 : w / 2 - w * 0.3, -h, w * 0.3, h);
      ctx.fillStyle = css(mul(ST, 0.55), l, 0.6);
      ctx.fillRect(-w * 0.3, -h * 0.72, w * 0.6, 0.6 * s); ctx.fillRect(-w * 0.3, -h * 0.6, w * 0.6, 0.6 * s); ctx.fillRect(-w * 0.3, -h * 0.48, w * 0.45, 0.6 * s);
      ctx.strokeStyle = css([252, 240, 214], l, 0.35 * dayA(), 0.15);
      ctx.beginPath(); ctx.moveTo(-w / 2 - 0.6 * s, -h); ctx.lineTo(0, -h - 2.6 * s); ctx.lineTo(w / 2 + 0.6 * s, -h); ctx.stroke();
      if (moon > 0.01) {
        ctx.strokeStyle = U.rgba(206, 220, 246, moon); ctx.lineWidth = Math.max(0.6, 0.9 * s);
        ctx.beginPath(); ctx.moveTo(-w / 2 - 0.6 * s, -h); ctx.lineTo(0, -h - 2.6 * s); ctx.lineTo(w / 2 + 0.6 * s, -h);
        ctx.moveTo(-w / 2, -h); ctx.lineTo(-w / 2, 0); ctx.stroke();
      }
      ctx.restore();
    }
  }
  // 夜里石头上的一道月光的边
  function moonRim() { return 0.42 * nightK() * clamp(W.lv.moon, 0.35, 1); }
  // 坟上不灭的光（神也必将他们与耶稣一同带来）
  function drawHope(ctx) {
    const k = lv('thHope');
    if (k < 0.005 || !SP) return;
    const s = LS(2), pts = gravePts(), vis = 0.28 + 0.72 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    pts.forEach((p, i) => {
      const on = clamp((k - i * 0.16) / 0.3, 0, 1);
      if (on <= 0) return;
      const pul = 0.85 + 0.15 * Math.sin(W.t * 1.6 + i * 1.9);
      // 每一点光都高高悬在自己的那块石头上
      const y = p[1] - (i ? 10 : 16) * s;
      glowAt(ctx, SP.gold, p[0], y, 22 * s * pul, 0.55 * on * vis);
      glowAt(ctx, SP.white, p[0], y, 5 * s, 0.95 * on * vis * pul);
      // 光照亮底下的石头
      glowAt(ctx, SP.gold, p[0], p[1] + (i ? 4 : 2) * s, (i ? 7 : 10) * s, 0.4 * on * vis);
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶孙的家：灰泥的墙、瓦顶、门里的灯；院中矮石桌上的三盏灯
  // ════════════════════════════════════════════════════════════
  function houseG() {
    const s = LS(2), cx = X.house * W.w, w = 78 * s, x0 = cx - w / 2, x1 = cx + w / 2;
    const y = Math.max(gY(2, x0 / W.w), gY(2, x1 / W.w), gY(2, X.house)) + 3 * s;
    return { s, cx, w, x0, x1, y, h: 42 * s };
  }
  function drawHouse(ctx) {
    const G = houseG(), s = G.s, l = 2, nk = nightK();
    const d = litX() >= G.cx ? 1 : -1;
    const PL = [208, 194, 168], TILE = [150, 86, 64];
    const top = G.y - G.h;
    ctx.fillStyle = css(PL, l);
    ctx.fillRect(G.x0, top, G.w, G.h + 2 * s);
    ctx.fillStyle = css(mul(PL, 0.74), l, 0.85);
    ctx.fillRect(d > 0 ? G.x0 : G.x1 - G.w * 0.18, top, G.w * 0.18, G.h + 2 * s);
    // 瓦顶
    ctx.fillStyle = css(TILE, l);
    ctx.beginPath();
    ctx.moveTo(G.x0 - 6 * s, top + 1 * s); ctx.lineTo(G.cx, top - 11 * s); ctx.lineTo(G.x1 + 6 * s, top + 1 * s);
    ctx.lineTo(G.x1 + 6 * s, top + 3 * s); ctx.lineTo(G.x0 - 6 * s, top + 3 * s);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(mul(TILE, 0.7), l, 0.7); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let i = 1; i < 9; i++) { const f = i / 9; ctx.moveTo(lerp(G.x0 - 6 * s, G.x1 + 6 * s, f), top + 2 * s); ctx.lineTo(lerp(G.x0 - 6 * s, G.x1 + 6 * s, f) * 0.8 + G.cx * 0.2, lerp(top + 2 * s, top - 9 * s, 1 - Math.abs(f - 0.5) * 2)); }
    ctx.stroke();
    ctx.strokeStyle = css([252, 238, 210], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(G.x0 - 6 * s, top + 1 * s); ctx.lineTo(G.cx, top - 11 * s); ctx.lineTo(G.x1 + 6 * s, top + 1 * s); ctx.stroke();
    // 门：门框、门里暖黄的灯光（夜里）
    const dw = 13 * s, dh = 27 * s, dx = G.cx - dw / 2, dy = G.y - dh;
    ctx.fillStyle = css([96, 72, 52], l);
    ctx.fillRect(dx - 1.6 * s, dy - 1.8 * s, dw + 3.2 * s, dh + 1.8 * s);
    // 屋里：暗暗的暖色；夜里一盏灯把门里照得昏黄
    const IN = mix([54, 40, 30], [150, 96, 52], nk);
    ctx.fillStyle = U.rgba(IN[0], IN[1], IN[2], 1);
    ctx.fillRect(dx, dy, dw, dh);
    // 窗
    const wins = [[G.x0 + G.w * 0.2, top + G.h * 0.32], [G.x1 - G.w * 0.2, top + G.h * 0.32]];
    for (const q of wins) {
      ctx.fillStyle = css([96, 72, 52], l);
      ctx.fillRect(q[0] - 4 * s, q[1] - 4 * s, 8 * s, 8 * s);
      ctx.fillStyle = U.rgba(IN[0], IN[1], IN[2], 1);
      ctx.fillRect(q[0] - 3 * s, q[1] - 3 * s, 6 * s, 6 * s);
    }
    if (SP && nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, G.cx, dy + dh * 0.45, dw * 0.75, 0.55 * nk, 1.7);
      glowAt(ctx, SP.lamp, G.cx, dy + dh * 0.3, dw * 0.35, 0.6 * nk);
      glowAt(ctx, SP.lamp, G.cx, G.y - dh * 0.5, dh * 1.1, 0.22 * nk);
      for (const q of wins) { glowAt(ctx, SP.warm, q[0], q[1], 3.4 * s, 0.7 * nk); glowAt(ctx, SP.lamp, q[0], q[1], 11 * s, 0.25 * nk); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 院中的矮石桌与三盏泥灯
  function lampPts() {
    const s = LS(2), x = X.lamps * W.w, y = gY(2, X.lamps) + 1.5 * s - 11.4 * s;
    return [[x - 7 * s, y], [x, y], [x + 7 * s, y]];
  }
  function drawTable(ctx) {
    const s = LS(2), l = 2, x = X.lamps * W.w, y = gY(l, X.lamps) + 1.5 * s;
    ctx.fillStyle = css([150, 138, 118], l);
    ctx.fillRect(x - 11.5 * s, y - 11 * s, 23 * s, 2.8 * s);
    ctx.fillStyle = css([120, 110, 94], l);
    ctx.fillRect(x - 9.5 * s, y - 8.4 * s, 3.4 * s, 8.4 * s); ctx.fillRect(x + 6.1 * s, y - 8.4 * s, 3.4 * s, 8.4 * s);
    ctx.strokeStyle = css([252, 238, 210], l, 0.3 * dayA(), 0.15); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath(); ctx.moveTo(x - 11.5 * s, y - 11 * s); ctx.lineTo(x + 11.5 * s, y - 11 * s); ctx.stroke();
    if (SP && nightK() > 0.05) {
      const Lk = Math.max(lv('thL1'), lv('thL2'), lv('thL3'));
      ctx.strokeStyle = U.rgba(255, 196, 120, 0.5 * Lk * nightK()); ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x - 11.5 * s, y - 8.2 * s); ctx.lineTo(x + 11.5 * s, y - 8.2 * s); ctx.stroke();
    }
    const L = [lv('thL1'), lv('thL2'), lv('thL3')], sp = lv('thSpirit'), gale = W.lv.gale || 0;
    lampPts().forEach((p, i) => {
      ctx.fillStyle = css([176, 118, 76], l, 1, 0.05 + 0.4 * L[i] * nightK());
      ctx.beginPath(); ctx.ellipse(p[0], p[1] + 0.4 * s, 3.2 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(p[0] + 2 * s, p[1] - 0.3 * s); ctx.lineTo(p[0] + 4.4 * s, p[1] - 0.8 * s); ctx.lineTo(p[0] + 2.3 * s, p[1] + 1.1 * s); ctx.closePath(); ctx.fill();
      if (L[i] > 0.01) {
        const fl = gale > 0.05 ? 1 - gale * (0.35 + 0.25 * Math.sin(W.t * 17 + i * 2)) : 1;
        flame(ctx, p[0] + 3.9 * s, p[1] - 0.7 * s, 4.6 * s * (1 + 1.1 * sp) * fl, L[i], i * 3.1, gale * 0.9);
      }
    });
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  城东头的小庙：台基、石柱、山墙；三尊偶像；庙前的祭坛与火
  // ════════════════════════════════════════════════════════════
  function shrineG() {
    const s = LS(2), cx = X.shrine * W.w, w = 60 * s;
    const y = Math.max(gY(2, (cx - w / 2) / W.w), gY(2, (cx + w / 2) / W.w), gY(2, X.shrine)) + 2 * s;
    return { s, cx, w, y };
  }
  function statue(ctx, x, base, h, k, seed) {
    const l = 2, s = LS(2);
    const BR = [132, 112, 84];
    if (k > 0.01) {
      ctx.save();
      ctx.beginPath(); ctx.rect(x - h, base - h * k - 1, h * 2, h * k + 2); ctx.clip();
      ctx.fillStyle = css(BR, l, 1, 0.02);
      ctx.beginPath();
      ctx.moveTo(x - 0.14 * h, base);
      ctx.lineTo(x - 0.11 * h, base - 0.5 * h);
      ctx.lineTo(x - 0.13 * h, base - 0.76 * h);
      ctx.lineTo(x + 0.13 * h, base - 0.76 * h);
      ctx.lineTo(x + 0.11 * h, base - 0.5 * h);
      ctx.lineTo(x + 0.14 * h, base);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(x, base - 0.86 * h, 0.075 * h, 0, TAU); ctx.fill();
      // 举起的一臂与杖
      const dir = seed % 2 ? 1 : -1;
      ctx.strokeStyle = css(BR, l, 1, 0.02); ctx.lineWidth = Math.max(1, 0.05 * h); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x + dir * 0.1 * h, base - 0.72 * h); ctx.lineTo(x + dir * 0.2 * h, base - 0.95 * h); ctx.stroke();
      ctx.lineWidth = Math.max(0.6, 0.022 * h);
      ctx.beginPath(); ctx.moveTo(x + dir * 0.2 * h, base - 1.02 * h); ctx.lineTo(x + dir * 0.2 * h, base - 0.2 * h); ctx.stroke();
      // 边光：祭坛的火映着（暖），或冷冷的月光
      const af = lv('thAltar') * nightK();
      ctx.strokeStyle = af > 0.05 ? U.rgba(255, 150, 80, 0.22 + 0.33 * af) : U.rgba(170, 196, 220, 0.16 + 0.2 * nightK());
      ctx.lineWidth = Math.max(0.5, 0.5 * s);
      ctx.beginPath(); ctx.moveTo(x - 0.14 * h, base); ctx.lineTo(x - 0.11 * h, base - 0.5 * h); ctx.lineTo(x - 0.13 * h, base - 0.76 * h); ctx.lineTo(x + 0.13 * h, base - 0.76 * h); ctx.lineTo(x + 0.11 * h, base - 0.5 * h); ctx.lineTo(x + 0.14 * h, base); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, base - 0.86 * h, 0.075 * h, 0, TAU); ctx.stroke();
      ctx.restore();
    }
    // 碎石
    const rb = 1 - k;
    if (rb > 0.02) {
      ctx.fillStyle = css(mul(BR, 0.85), l);
      for (let i = 0; i < 6; i++) {
        const a = hsh(seed * 13 + i), b = hsh(seed * 7 + i * 3);
        const rw = (0.06 + 0.07 * a) * h * rb, rh = (0.04 + 0.04 * b) * h * rb;
        const rx = x + (a - 0.5) * 0.5 * h, ry = base - rh * (0.5 + (i % 2) * 0.8);
        ctx.fillRect(rx - rw / 2, ry - rh, rw, rh);
      }
    }
  }
  function drawShrine(ctx) {
    const G = shrineG(), s = G.s, l = 2;
    const MB = [196, 186, 168];
    const d = litX() >= G.cx ? 1 : -1;
    // 台基（三级）
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = css(mul(MB, 1 - i * 0.04), l);
      const w = G.w - i * 4 * s;
      ctx.fillRect(G.cx - w / 2, G.y - (i + 1) * 2.2 * s, w, 2.2 * s + 1);
    }
    const base = G.y - 6.6 * s, ch = 30 * s;
    // 殿身（暗）
    ctx.fillStyle = css(mul(MB, 0.46), l);
    ctx.fillRect(G.cx - G.w / 2 + 6 * s, base - ch, G.w - 12 * s, ch);
    // 偶像：在石柱之间
    const k = lv('thIdol');
    [-14, 0, 14].forEach((dx, i) => {
      const x = G.cx + dx * s;
      ctx.fillStyle = css(mul(MB, 0.9), l);
      ctx.fillRect(x - 3 * s, base - 3.5 * s, 6 * s, 3.5 * s);
      statue(ctx, x, base - 3.5 * s, (i === 1 ? 23 : 20) * s, clamp(k * (1.1 - i * 0.05) - (i === 0 ? 0.05 : 0), 0, 1), i + 1);
    });
    // 石柱
    ctx.fillStyle = css(MB, l);
    for (const dx of [-24, -7, 7, 24]) ctx.fillRect(G.cx + dx * s - 1.7 * s, base - ch, 3.4 * s, ch);
    ctx.fillStyle = css(mul(MB, 0.75), l);
    for (const dx of [-24, -7, 7, 24]) ctx.fillRect(G.cx + dx * s + (d > 0 ? -1.7 : 0.6) * s, base - ch, 1.1 * s, ch);
    // 额枋与山墙
    ctx.fillStyle = css(MB, l);
    ctx.fillRect(G.cx - 28 * s, base - ch - 4 * s, 56 * s, 4 * s);
    ctx.beginPath(); ctx.moveTo(G.cx - 29.5 * s, base - ch - 4 * s); ctx.lineTo(G.cx, base - ch - 13 * s); ctx.lineTo(G.cx + 29.5 * s, base - ch - 4 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(mul(MB, 0.7), l);
    ctx.beginPath(); ctx.moveTo(G.cx - 24 * s, base - ch - 5.4 * s); ctx.lineTo(G.cx, base - ch - 11.2 * s); ctx.lineTo(G.cx + 24 * s, base - ch - 5.4 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([252, 240, 214], l, 0.35 * dayA(), 0.15); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(G.cx - 29.5 * s, base - ch - 4 * s); ctx.lineTo(G.cx, base - ch - 13 * s); ctx.lineTo(G.cx + 29.5 * s, base - ch - 4 * s); ctx.stroke();
    const moon = moonRim();
    if (moon > 0.01) {
      ctx.strokeStyle = U.rgba(206, 220, 246, moon * 0.8); ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(G.cx - 29.5 * s, base - ch - 4 * s); ctx.lineTo(G.cx, base - ch - 13 * s); ctx.lineTo(G.cx + 29.5 * s, base - ch - 4 * s);
      for (const dx of [-24, -7, 7, 24]) { ctx.moveTo(G.cx + dx * s - 1.7 * s, base); ctx.lineTo(G.cx + dx * s - 1.7 * s, base - ch); }
      ctx.moveTo(G.cx - G.w / 2, G.y - 2.2 * s); ctx.lineTo(G.cx + G.w / 2, G.y - 2.2 * s);
      ctx.stroke();
    }
    // 祭坛
    const ax = X.altar * W.w, ay = gY(l, X.altar) + 2 * s;
    ctx.fillStyle = css([170, 156, 134], l);
    ctx.fillRect(ax - 5 * s, ay - 9 * s, 10 * s, 9 * s);
    ctx.fillStyle = css([190, 176, 152], l);
    ctx.fillRect(ax - 6 * s, ay - 10 * s, 12 * s, 1.6 * s);
    const af = lv('thAltar');
    if (af > 0.01) {
      flame(ctx, ax, ay - 10 * s, 7 * s * (0.6 + 0.4 * af), af, 7.7);
      // 火映在偶像上：红的暗光
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.ember, G.cx, base - ch * 0.4, ch * 1.2, 0.22 * af * nightK() * k); ctx.globalCompositeOperation = 'source-over'; }
    } else if (SP && nightK() > 0.1) {
      // 熄了的祭坛：一缕灰烟
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = 'rgb(120,120,126)';
      for (let i = 0; i < 4; i++) { const t = (W.t * 0.3 + i / 4) % 1; ctx.beginPath(); ctx.arc(ax + Math.sin(W.t * 0.7 + i) * 3 * s, ay - 11 * s - t * 26 * s, (1.5 + t * 4) * s, 0, TAU); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  空中：灯下的光、坟上的光、异象、晨星、护心镜与头盔、荣光、烟、平安……
  // ════════════════════════════════════════════════════════════
  // 灯与火把照亮院子（光明之子：院中一片光）
  function drawCourtLight(ctx) {
    if (!SP) return;
    const s = LS(2), nk = nightK();
    const L = (lv('thL1') + lv('thL2') + lv('thL3')) / 3, dk = lv('thDay');
    ctx.globalCompositeOperation = 'lighter';
    if (L > 0.01 && nk > 0.02) {
      const x = X.lamps * W.w, y = gY(2, X.lamps) - 12 * s;
      glowAt(ctx, SP.warm, x, y, (58 + 24 * lv('thSpirit')) * s, 0.34 * L * nk, 0.7);
      glowAt(ctx, SP.gold, x, y, 16 * s, 0.4 * L * nk);
    }
    if (dk > 0.01) {
      const x0 = (PORT ? X.aris - 0.03 : X.aris - 0.02) * W.w, x1 = (X.t3 + 0.02) * W.w, cx = (x0 + x1) / 2, y = gY(2, X.lamps) - 18 * s;
      glowAt(ctx, SP.gold, cx, y, (x1 - x0) * 0.72, 0.26 * dk * (0.35 + 0.65 * nk), 0.55);
      glowAt(ctx, SP.white, cx, y + 6 * s, (x1 - x0) * 0.4, 0.14 * dk * (0.35 + 0.65 * nk), 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 信：耶孙手中（卷着 / 展开发光）
  function drawScroll(ctx) {
    const f = fig('jason');
    if (!f || !f._vis || f.alpha < 0.2) return;
    const k = lv('thScroll'), h = f._h || PH(), dir = f.fd >= 0 ? 1 : -1;
    const x = f._x + dir * 0.16 * h, y = f._y - 0.6 * h;
    const w = lerp(0.05, 0.3, k) * h, hh = 0.2 * h;
    ctx.globalAlpha = f.alpha;
    const pc = mix(W.shade([232, 218, 184], 0, 0.1 + 0.4 * k), [226, 196, 140], nightK() * 0.85);
    ctx.fillStyle = U.rgba(pc[0], pc[1], pc[2], 1);
    ctx.fillRect(x - w / 2, y - hh / 2, w, hh);
    ctx.fillStyle = W.shadeCSS([176, 150, 110], 0, 1, 0.05);
    ctx.fillRect(x - w / 2 - 0.035 * h, y - hh / 2 - 0.02 * h, 0.035 * h, hh + 0.04 * h);
    ctx.fillRect(x + w / 2, y - hh / 2 - 0.02 * h, 0.035 * h, hh + 0.04 * h);
    if (k > 0.05) {
      ctx.fillStyle = U.rgba(120, 90, 60, 0.55 * k);
      for (let i = 0; i < 4; i++) ctx.fillRect(x - w * 0.38, y - hh * 0.32 + i * hh * 0.2, w * (0.76 - (i === 3 ? 0.3 : 0)), Math.max(0.5, 0.012 * h));
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, x, y, 0.5 * h, 0.4 * k * (0.4 + 0.6 * nightK()));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 异象：天开了（东方如黎明），光明的云，主降临（光），天使长与号
  function lordPt() {
    const [vx, vy] = VPT(), e = ease(clamp(lv('thLord'), 0, 1));
    // 竖屏：自东方（左）经文之下滑入云中，不从经文里穿过
    const x0 = PORT ? 0.1 : 0.3, y0 = PORT ? 0.37 : -0.14;
    return [lerp(x0, vx, e) * W.w, lerp(y0, vy - 0.03, e) * W.h];
  }
  const CLOUD = [[-0.15, 0.03, 0.08], [-0.09, 0.012, 0.1], [-0.03, 0.02, 0.11], [0.03, 0.005, 0.1], [0.09, 0.02, 0.1], [0.15, 0.035, 0.08], [-0.06, 0.04, 0.09], [0.06, 0.045, 0.09], [0, 0.05, 0.08]];
  function drawOpen(ctx) {
    const k = lv('thOpen') * visA();
    if (k < 0.005 || !SP) return;
    const [vx, vy] = VPT(), X0 = vx * W.w, Y0 = vy * W.h, m = M();
    ctx.globalCompositeOperation = 'lighter';
    // 东方如黎明：一道低而薄的玫瑰金的光，贴着海的地平线升起（白的光心），不铺满半个天
    const hy = W.horizonY || W.h * 0.6, dx = PORT ? 0.3 : 0.2;
    glowAt(ctx, SP.dawn, W.w * dx, hy - W.h * 0.03, W.w * (PORT ? 0.8 : 0.5), 0.42 * k, 0.12);
    glowAt(ctx, SP.white, W.w * dx, hy - W.h * 0.012, W.w * (PORT ? 0.55 : 0.32), 0.3 * k, 0.05);
    glowAt(ctx, SP.dawn, W.w * dx, hy - W.h * 0.08, W.w * (PORT ? 0.5 : 0.3), 0.07 * k, 0.35);
    glowAt(ctx, SP.gold, X0, Y0, m * 0.62, 0.34 * k);
    glowAt(ctx, SP.white, X0, Y0 - m * 0.02, m * 0.26, 0.42 * k);
    // 光柱
    ctx.globalAlpha = 0.28 * k;
    ctx.drawImage(SP.beam, X0 - m * 0.1, -m * 0.05, m * 0.2, Y0 + m * 0.05);
    // 光线
    ctx.strokeStyle = 'rgb(255,244,214)';
    ctx.lineWidth = Math.max(1, 1.4 * SU());
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU + W.t * 0.03, L = m * (0.3 + 0.18 * hsh(i * 3.1));
      ctx.globalAlpha = 0.07 * k * (0.7 + 0.3 * Math.sin(W.t * 0.8 + i));
      ctx.beginPath(); ctx.moveTo(X0 + Math.cos(a) * m * 0.05, Y0 + Math.sin(a) * m * 0.05); ctx.lineTo(X0 + Math.cos(a) * L, Y0 + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // 光明的云
    const ck = k * clamp(lv('thLord') * 1.6, 0.25, 1);
    const cw = PORT ? W.w * 1.6 : m;
    for (const q of CLOUD) glowAt(ctx, SP.cloud, X0 + q[0] * cw, Y0 + q[1] * m + m * 0.02, q[2] * cw, 0.5 * ck, 0.5);
    ctx.globalAlpha = 1;
  }
  function drawLord(ctx) {
    const kv = visA(), kL = lv('thLord');
    if (kv < 0.01 || kL < 0.001 || !SP) return;
    const a = clamp(kL * 3, 0, 1) * kv, [x, y] = lordPt(), h = PH() * (PORT ? 1.25 : 1.35);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - h * 0.5, h * 2.8, 0.3 * a);
    glowAt(ctx, SP.white, x, y - h * 0.5, h * 0.9, 0.16 * a, 1.4);
    lightFigure(ctx, x, y, h, a, 0, 'rgb(255,253,246)', 0.25);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function archPt() { const [vx, vy] = VPT(); return [(vx + (PORT ? 0.24 : 0.13)) * W.w, (vy + (PORT ? 0.0 : 0.01)) * W.h]; }
  function hornEnd() { const [x, y] = archPt(), h = PH() * 1.02; return [x + 0.46 * h, y - 1.18 * h]; }
  function drawArch(ctx) {
    const a = lv('thArch') * visA();
    if (a < 0.01 || !SP) return;
    const [x, y] = archPt(), h = PH() * 1.02;
    ctx.globalCompositeOperation = 'lighter';
    // 翅膀：两道光的弧
    ctx.strokeStyle = 'rgb(255,232,190)'; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) {
      for (let j = 0; j < 3; j++) {
        ctx.globalAlpha = a * (0.35 - j * 0.08);
        ctx.lineWidth = Math.max(1, (2.2 - j * 0.5) * SU());
        ctx.beginPath();
        ctx.moveTo(x + sd * 0.06 * h, y - 0.72 * h);
        ctx.quadraticCurveTo(x + sd * (0.5 + j * 0.08) * h, y - (1.05 + j * 0.1) * h, x + sd * (0.62 + j * 0.06) * h, y - (0.5 - j * 0.12) * h);
        ctx.stroke();
      }
    }
    lightFigure(ctx, x, y, h, a * 0.95, 3, 'rgb(255,240,208)');
    // 号：自口向右上
    const [ex, ey] = hornEnd();
    ctx.globalAlpha = a * 0.9;
    ctx.strokeStyle = 'rgb(255,226,150)';
    ctx.lineWidth = Math.max(1, 0.035 * h);
    ctx.beginPath(); ctx.moveTo(x + 0.06 * h, y - 0.84 * h); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = 'rgb(255,226,150)';
    ctx.beginPath(); ctx.ellipse(ex, ey, 0.06 * h, 0.035 * h, -0.62, 0, TAU); ctx.fill();
    glowAt(ctx, SP.gold, ex, ey, 0.4 * h, 0.4 * a);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 升起的光（坟里睡了的人 / 活着还存留的人），往云里去
  function slot(i, n, row) {
    const [vx, vy] = VPT(), sp = PORT ? 0.07 : 0.034;
    const dx = (i - (n - 1) / 2) * sp * (row ? 0.8 : 1);
    return [(vx + dx) * W.w, (vy + (row ? 0.075 : 0.045) + Math.abs(dx) * 0.2) * W.h];
  }
  function risingPath(ctx, sx, sy, ex, ey, p, h0, seed, a) {
    const e = ease(p), ex2 = smoothstep(0.15, 1, p);
    const x = lerp(sx, ex, ex2) + Math.sin(p * 3.1 + seed) * PH() * 0.2 * (1 - p), y = lerp(sy, ey, e);
    const h = h0 * lerp(0.85, 0.5, e);
    lightFigure(ctx, x, y, h, a * smoothstep(0, 0.1, p) * (0.8 + 0.2 * Math.sin(W.t * 1.5 + seed)), seed, 'rgb(255,252,240)', 0.35);
  }
  function drawRising(ctx) {
    const kv = visA();
    if (kv < 0.01 || !SP) return;
    const r = lv('thRise'), c = lv('thCaught'), h0 = PH();
    ctx.globalCompositeOperation = 'lighter';
    if (r > 0.001) {
      const gp = gravePts(), n = gp.length + 1;
      for (let i = 0; i < n; i++) {
        const g = gp[i === n - 1 ? 0 : i];
        const d = i * 0.08, p = clamp((r - d) / (1 - (n - 1) * 0.08), 0, 1);
        if (p <= 0) continue;
        const [ex, ey] = slot(i, n, 0);
        risingPath(ctx, g[0] + (i === n - 1 ? 4 * LS(2) : 0), g[1] + 4 * LS(2), ex, ey, p, h0, i * 1.7, kv * 0.95);
      }
    }
    if (c > 0.001) {
      // 活着的人被提：不是魂离开身子——光的柱子罩住这人，这人自己化作光被提上去（地上的身子随之隐去，见 caughtFade）
      const ids = riseIds(), n = ids.length, vk = clamp((lv('thVision') - 0.75) / 0.25, 0, 1);
      ids.forEach((id, j) => {
        const st = figPt(id, 0.05);
        if (!st) return;
        const p = caughtP(c, j, n);
        if (p <= 0) return;
        const f = fig(id), hh = (f && f._h) || h0;
        const env = smoothstep(0, 0.1, p) * (1 - 0.72 * smoothstep(0.25, 0.75, p)) * vk;
        if (env > 0.01) {
          const cw = hh * 0.62, cH = hh * 2.4;
          ctx.globalAlpha = 0.7 * env;
          ctx.drawImage(SP.beam, st[0] - cw / 2, st[1] - cH, cw, cH * 1.08);
          glowAt(ctx, SP.gold, st[0], st[1] - hh * 0.45, hh * 0.85, 0.55 * env);
          glowAt(ctx, SP.white, st[0], st[1] - hh * 0.5, hh * 0.32, 0.6 * env * (1 - 0.6 * smoothstep(0.2, 0.6, p)), 1.6);
        }
        const [ex, ey] = slot(j, n, 1);
        risingPath(ctx, st[0], st[1], ex, ey, p, h0 * 0.95, 10 + j * 1.3, kv * 0.85);
      });
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 东方（左）低处初透的一线冷灰：天亮以前；日光来了就让给天本身的颜色
  function drawGrey(ctx) {
    const k = lv('thGrey') * clamp(1 - W.daylight * 1.6, 0, 1);
    if (k < 0.005 || !SP) return;
    const hy = W.horizonY || W.h * 0.6, cx = W.w * (PORT ? 0.22 : 0.14);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.grey, cx, hy - W.h * 0.015, W.w * (PORT ? 0.95 : 0.6), 0.34 * k, 0.13);
    glowAt(ctx, SP.grey, cx, hy - W.h * 0.06, W.w * (PORT ? 0.7 : 0.42), 0.12 * k, 0.32);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 醒来的鸟：一小群自灯光照着的院子飞起，掠过屋前暖黄的光，往东方发白的天上去（剪影）
  function birdM(ctx, x, y, S, ph, dir) {
    const w = Math.sin(ph), tipY = -w * S * 0.36 + S * 0.04, elY = -w * S * 0.12 - S * 0.07;
    ctx.beginPath();
    ctx.moveTo(x - S * 0.5, y + tipY);
    ctx.quadraticCurveTo(x - S * 0.2 + dir * S * 0.04, y + elY, x, y);
    ctx.quadraticCurveTo(x + S * 0.2 + dir * S * 0.04, y + elY, x + S * 0.5, y + tipY);
    ctx.stroke();
  }
  function drawBirds(ctx, q, u) {
    const G = houseG(), P0 = [G.cx + G.w * 0.35, G.y - G.h * 0.45], P1 = [G.cx - W.w * 0.06, G.y - G.h * 2.6], P2 = [W.w * (PORT ? 0.2 : 0.2), W.h * (PORT ? 0.5 : 0.5)];
    const S0 = (PORT ? 13 : 12) * SU();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let j = 0; j < q.n; j++) {
      const lag = hsh(j * 4.1 + q.seed) * 0.22, e = clamp((u - lag) / 0.78, 0, 1);
      if (e <= 0 || e >= 1) continue;
      const mt = 1 - e, ox = (hsh(j * 2.3 + q.seed) - 0.5) * 0.07 * W.w * (0.3 + e), oy = (hsh(j * 3.7 + q.seed) - 0.5) * 0.06 * W.h * (0.3 + e);
      const x = mt * mt * P0[0] + 2 * mt * e * P1[0] + e * e * P2[0] + ox + Math.sin(e * 6 + j) * 0.006 * W.w;
      const y = mt * mt * P0[1] + 2 * mt * e * P1[1] + e * e * P2[1] + oy;
      const S = S0 * lerp(1, 0.55, e) * (0.85 + 0.3 * hsh(j * 5.9));
      const a = smoothstep(0, 0.06, e) * (1 - smoothstep(0.82, 1, e));
      ctx.globalAlpha = 0.92 * a;
      ctx.strokeStyle = 'rgb(20,18,26)';
      ctx.lineWidth = Math.max(1, S * 0.13);
      birdM(ctx, x, y, S, W.t * (9 + 3 * hsh(j * 7.1)) + j * 1.7, -1);
    }
    ctx.globalAlpha = 1;
  }
  // 东方的晨星
  function starPt() { return PORT ? [0.2 * W.w, 0.5 * W.h] : [0.23 * W.w, 0.33 * W.h]; }
  function drawStar(ctx) {
    const k = lv('thStar') * clamp(1.25 - W.daylight * 0.9, 0.25, 1);
    if (k < 0.005 || !SP) return;
    const [x, y] = starPt(), u = SU(), tw = 0.9 + 0.1 * Math.sin(W.t * 3.1) * Math.sin(W.t * 1.7);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, x, y, 60 * u * tw, k * 0.45);
    glowAt(ctx, SP.white, x, y, 10 * u, Math.min(1, k * 1.2));
    ctx.strokeStyle = 'rgb(240,244,255)';
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + Math.PI / 4 * 0, L = (i % 2 ? 26 : 44) * u * tw;
      ctx.globalAlpha = k * 0.35;
      ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * L, y - Math.sin(a) * L); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 得蒙保守：罩住这家与城外坟地的一层光
  function drawKeep(ctx) {
    const k = lv('thKeep');
    if (k < 0.005 || !SP) return;
    const s = LS(2), x0 = (X.tomb - 0.025) * W.w, x1 = (X.t3 + 0.025) * W.w, cx = (x0 + x1) / 2, R = (x1 - x0) / 2;
    const gy = gY(2, cx / W.w) + 4 * s, vis = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, gy - R * 0.2, R * 1.05, 0.14 * k * vis, 0.5);
    ctx.strokeStyle = 'rgb(255,236,190)';
    const H = Math.min(R * 0.55, gy - W.horizonY * 0.9);
    for (let j = 0; j < 3; j++) {
      ctx.globalAlpha = k * vis * (0.22 - j * 0.06) * (0.85 + 0.15 * Math.sin(W.t * 1.1 + j));
      ctx.lineWidth = Math.max(0.8, (2.4 - j * 0.6) * SU());
      ctx.beginPath(); ctx.ellipse(cx, gy, R + j * 3 * s, H + j * 3 * s, 0, Math.PI, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  const UPR = { stand: 1, gaze: 1, raise: 1, walk: 1, point: 1, carry: 1 };
  // 护心镜（信与爱）与头盔（得救的盼望）：光，不是兵器
  function drawArmour(ctx) {
    const k = lv('thArmour');
    if (k < 0.01 || !SP) return;
    const vis = 0.45 + 0.55 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (const id of present()) {
      const f = fig(id);
      if (!f || !f._vis || f.age === 'child' || f.alpha < 0.3) continue;
      const h = f._h, dir = f.fd >= 0 ? 1 : -1;
      const q = f.pose === 'kneel' || f.pose === 'pray' ? 0.72 : f.pose === 'bow' ? 0.9 : 1;
      const cx = f._x + dir * 0.03 * h, cy = f._y - 0.6 * h * q;
      glowAt(ctx, SP.gold, cx, cy, 0.26 * h, 0.55 * k * vis);
      ctx.globalAlpha = 0.55 * k * vis;
      ctx.fillStyle = 'rgb(255,236,190)';
      ctx.beginPath();
      ctx.moveTo(cx - 0.07 * h, cy - 0.09 * h); ctx.lineTo(cx + 0.07 * h, cy - 0.09 * h); ctx.lineTo(cx + 0.06 * h, cy + 0.03 * h); ctx.lineTo(cx, cy + 0.1 * h); ctx.lineTo(cx - 0.06 * h, cy + 0.03 * h);
      ctx.closePath(); ctx.fill();
      if (UPR[f.pose]) {
        const hx = f._x + dir * 0.012 * h, hy = f._y - 0.905 * h;
        ctx.globalAlpha = 0.62 * k * vis;
        ctx.fillStyle = 'rgb(236,242,255)';
        ctx.beginPath(); ctx.arc(hx, hy, 0.074 * h, Math.PI, TAU); ctx.lineTo(hx + 0.074 * h, hy + 0.012 * h); ctx.lineTo(hx - 0.074 * h, hy + 0.012 * h); ctx.closePath(); ctx.fill();
        glowAt(ctx, SP.pale, hx, hy - 0.02 * h, 0.14 * h, 0.35 * k * vis);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 在圣徒身上得荣耀：晨光落在每一个人身上
  function drawGlory(ctx) {
    const k = lv('thGlory');
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const all = present();
    const c = C();
    if (c && c.crowds && c.crowds.get('newc')) for (const m of c.crowds.get('newc').members) all.push(m);
    for (const id of all) {
      const f = typeof id === 'string' ? fig(id) : id;
      if (!f || !f._vis || f.alpha < 0.3) continue;
      const h = f._h, pul = 0.85 + 0.15 * Math.sin(W.t * 1.3 + (f.ord || 0));
      glowAt(ctx, SP.gold, f._x, f._y - 0.5 * h, 0.75 * h, 0.4 * k * pul, 1.2);
      glowAt(ctx, SP.white, f._x, f._y - 0.6 * h, 0.25 * h, 0.35 * k * pul, 1.4);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 不法的隐意：自倒塌的小庙升起的冷暗的烟；光的风自东方吹来，烟就散了
  function shadowPath(t) {
    const G = shrineG(), s = G.s;
    const P0 = [G.cx, G.y - 30 * s], P1 = [W.w * (PORT ? 0.9 : 0.93), W.h * (PORT ? 0.3 : 0.18)], P2 = [W.w * (PORT ? 0.5 : 0.62), W.h * (PORT ? 0.36 : 0.1)];
    const mt = 1 - t;
    return [mt * mt * P0[0] + 2 * mt * t * P1[0] + t * t * P2[0], mt * mt * P0[1] + 2 * mt * t * P1[1] + t * t * P2[1]];
  }
  function drawShadow(ctx) {
    const k = lv('thShadow'), d = lv('thDispel');
    if ((k < 0.005 && !(d > 0 && d < 1)) || !SP) return;
    const m = M(), N = 44, front = lerp(-0.25, 1.25, d) * W.w;
    const mask = x => (d > 0 ? clamp((x - front) / (0.16 * W.w), 0, 1) : 1);
    // 半个天暗下来（冷的暗）
    if (k > 0.01) {
      const vx = W.w * (PORT ? 0.78 : 0.82), vy = W.h * (PORT ? 0.3 : 0.2);
      ctx.globalCompositeOperation = 'source-over';
      glowAt(ctx, SP.smoke, vx, vy, m * (PORT ? 0.7 : 0.62), 0.32 * k * mask(vx), 0.8);
    }
    for (let i = 0; i < N; i++) {
      const t = (i % 22) / 21, side = i < 22 ? 0 : 1;
      let a = clamp((k - t * 0.7) / 0.3, 0, 1);
      if (a <= 0.005) continue;
      const [bx, by] = shadowPath(t);
      const spread = m * 0.07 * t * (side ? 1 : -1);
      const x = bx + spread * 0.6 + U.noise1(W.t * 0.13 + i * 1.3) * m * 0.035 * (0.3 + t), y = by + spread * 0.5 + U.noise1(W.t * 0.11 + i * 2.1 + 9) * m * 0.025 * (0.3 + t);
      a *= mask(x);
      if (a <= 0.005) continue;
      const r = lerp(0.035, 0.15, t) * m * (0.8 + 0.4 * hsh(i * 3.3));
      ctx.globalCompositeOperation = 'source-over';
      glowAt(ctx, SP.smoke, x, y, r, (side ? 0.3 : 0.42) * a, 0.7);
      if (i % 3 === 0) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.ember, x + r * 0.15, y + r * 0.2, r * 0.5, 0.1 * a, 0.7); }
    }
    // 光的风
    if (d > 0.001 && d < 0.999) {
      const e = Math.sin(Math.PI * d);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.white, front, W.h * 0.3, m * 0.18, 0.45 * e, 2.2);
      glowAt(ctx, SP.gold, front - m * 0.08, W.h * 0.32, m * 0.3, 0.3 * e, 1.6);
      ctx.strokeStyle = 'rgb(255,248,226)'; ctx.lineCap = 'round';
      for (let j = 0; j < 11; j++) {
        const yy = W.h * (0.06 + j * 0.05 + 0.02 * hsh(j * 2.7)), len = m * (0.08 + 0.12 * hsh(j * 5.1)), lead = m * 0.04 * hsh(j * 9.3);
        const x1 = front - lead, x0 = x1 - len, bend = Math.sin(W.t * 1.7 + j) * m * 0.012;
        ctx.globalAlpha = (0.12 + 0.16 * hsh(j * 3.1)) * e;
        ctx.lineWidth = Math.max(0.7, (0.8 + 1.2 * hsh(j * 7.7)) * SU());
        ctx.beginPath(); ctx.moveTo(x0, yy + bend); ctx.quadraticCurveTo((x0 + x1) / 2, yy - bend, x1, yy); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 平安：一层柔金的光铺满全地，微尘缓缓上升
  function drawPeace(ctx) {
    const k = lv('thPeace');
    if (k < 0.01 || !SP) return;
    const m = M();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, W.w * 0.72, W.h * 0.8, W.w * 0.55, 0.12 * k, 0.45);
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < 26; i++) {
      const fx0 = 0.5 + 0.5 * hsh(i * 7.7), sp = 0.02 + 0.02 * hsh(i * 3.9);
      const t = (W.t * sp + hsh(i * 1.3)) % 1;
      const x = fx0 * W.w + Math.sin(W.t * 0.5 + i) * m * 0.01, y = W.h * (0.92 - t * 0.5);
      ctx.globalAlpha = k * 0.5 * Math.sin(Math.PI * t);
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, 1.4 * SU()), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 转瞬的光：自天而降的光柱、一缕缕进到人心里的光
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const q of FXL) {
      if (q.t < 0) continue;
      const u = q.t / q.dur, env = Math.sin(Math.PI * clamp(u, 0, 1));
      if (q.type === 'beam') {
        const x = q.xf * W.w, w = q.w;
        ctx.globalAlpha = 0.55 * env;
        ctx.drawImage(SP.beam, x - w / 2, -10, w, q.y + 10);
        glowAt(ctx, SP.white, x, q.y, w * 0.9, 0.45 * env);
      } else if (q.type === 'birds') {
        drawBirds(ctx, q, clamp(u, 0, 1));
        ctx.globalCompositeOperation = 'lighter';
      } else if (q.type === 'stream') {
        const a = q.from(), b = figPt(q.to, 0.62);
        if (!a || !b) continue;
        const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - PH() * (0.6 + 0.3 * hsh(q.seed));
        for (let j = 0; j < 6; j++) {
          const tt = clamp(u * 1.4 - j * 0.05, 0, 1);
          if (tt <= 0 || tt >= 1) continue;
          const mt = 1 - tt;
          const x = mt * mt * a[0] + 2 * mt * tt * mx + tt * tt * b[0], y = mt * mt * a[1] + 2 * mt * tt * my + tt * tt * b[1];
          glowAt(ctx, SP.gold, x, y, (6 - j * 0.7) * SU(), 0.8 * (1 - j / 7));
        }
        if (u > 0.68) glowAt(ctx, SP.gold, b[0], b[1], PH() * 0.4, 0.5 * Math.sin(Math.PI * clamp((u - 0.68) / 0.32, 0, 1)));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() { layout(); },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      U.safe('thess.caught', caughtFade);
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { U.safe('thess.open', () => drawOpen(ctx)); U.safe('thess.lord', () => drawLord(ctx)); U.safe('thess.arch', () => drawArch(ctx)); U.safe('thess.grey', () => drawGrey(ctx)); U.safe('thess.star', () => drawStar(ctx)); return; }
      if (pass === 'far') { U.safe('thess.far', () => drawFar(ctx)); return; }
      if (pass === 'mid') { U.safe('thess.city', () => drawCity(ctx)); return; }
      if (pass === 'near') {
        U.safe('thess.graves', () => drawGraves(ctx));
        U.safe('thess.shrine', () => drawShrine(ctx));
        U.safe('thess.house', () => drawHouse(ctx));
        U.safe('thess.table', () => drawTable(ctx));
        return;
      }
      if (pass === 'air') {
        U.safe('thess.court', () => drawCourtLight(ctx));
        U.safe('thess.keep', () => drawKeep(ctx));
        U.safe('thess.hope', () => drawHope(ctx));
        U.safe('thess.scroll', () => drawScroll(ctx));
        U.safe('thess.armour', () => drawArmour(ctx));
        U.safe('thess.glory', () => drawGlory(ctx));
        U.safe('thess.rising', () => drawRising(ctx));
        U.safe('thess.shadow', () => drawShadow(ctx));
        U.safe('thess.peace', () => drawPeace(ctx));
        U.safe('thess.trans', () => drawTransients(ctx));
      }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const s = LS(2);
      const hg = houseG(); consider('耶孙的家', hg.cx, hg.y - hg.h - 6 * s);
      const sg = shrineG(); consider('偶像', sg.cx, sg.y - 30 * s);
      consider('坟墓', X.tomb * W.w, gY(2, X.tomb) - 12 * s);
      for (const q of STELE()) consider('坟墓', q[0] * W.w, gY(2, q[0]) - q[1] * s);
      if (lv('thL1') > 0.3) consider('灯', X.lamps * W.w, gY(2, X.lamps) - 10 * s);
      consider('帖撒罗尼迦', 0.86 * W.w, gY(1, 0.86) - 16 * LS(1));
      const jf = fig('jason');
      if (jf && jf._vis) { const p = figPt('jason', 0.6); if (p) consider('书信', p[0] + (jf.fd >= 0 ? 1 : -1) * 0.16 * jf._h, p[1]); }
      if (lv('thWord') > 0.5) { consider('马其顿', 0.78 * W.w, gY(0, 0.78) - 4); consider('亚该亚', 0.3 * W.w, gY(0, 0.3) - 4); }
      if (lv('thOpen') * lv('thVision') > 0.3) { const [vx, vy] = VPT(); consider('云', vx * W.w, (vy + 0.05) * W.h); }
      return best;
    },
  };

  function resetScene() { FXL.length = 0; S = fresh(); CITY = null; FAR = null; CF = false; }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：子夜的帖撒罗尼迦
  // ════════════════════════════════════════════════════════════
  const ROBE = {
    jason: [96, 112, 142], aris: [148, 106, 80], sec: [112, 124, 96], mourn: [84, 88, 116], mother: [158, 110, 112], child: [196, 168, 118],
    i1: [118, 94, 84], i2: [140, 100, 112], i3: [98, 90, 80],
  };
  function setup() {
    layout();
    W.set('bare', 0.05, true); W.set('bloom', 0.25, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.7, herbs: 0.5, trees: 0.2, lights: 1, moon: 0.9, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('thIdol', 1, true); W.set('thAltar', 1, true); W.set('thCity', 0.3, true); W.set('thVision', 1, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('herbs', W.w * 0.58, W.ridgeBaseY(2, W.w * 0.58));
    W.setOrigin('trees', W.w * 0.37, W.ridgeBaseY(2, W.w * 0.37));
    W.goTo(0.97, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 6, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    // 院中的人：耶孙（念信的人）、亚里达古、西公都、忧伤的人、抱着孩子的母亲、孩子
    add('jason', { label: '耶孙', sex: 'm', age: 'adult', x: X.jason, facing: -1, robe: ROBE.jason, accent: [214, 200, 170], beard: true, glow: 0.34, prop: null, v: vOf('jason') });
    add('sec', { label: '西公都', sex: 'm', age: 'adult', x: X.sec, facing: -1, robe: ROBE.sec, accent: [206, 190, 150], beard: true, glow: 0.3, prop: null, v: vOf('sec') });
    add('aris', { label: '亚里达古', sex: 'm', age: 'adult', x: X.aris, facing: 1, robe: ROBE.aris, accent: [200, 170, 120], beard: true, glow: 0.3, prop: null, v: vOf('aris') });
    add('mourn', { label: '忧伤的人', sex: 'f', age: 'adult', x: X.mourn, facing: 1, robe: ROBE.mourn, accent: [196, 194, 190], hair: 'veil', glow: 0.3, v: vOf('mourn') });
    add('mother', { label: '母亲', sex: 'f', age: 'adult', x: X.mother, facing: 1, robe: ROBE.mother, accent: [236, 222, 200], hair: 'veil', glow: 0.32, carry: 'baby', v: vOf('mother') });
    if (X.child > 0) add('child', { label: '孩子', sex: 'f', age: 'child', x: X.child, facing: 1, robe: ROBE.child, glow: 0.3, v: vOf('child') });
    // 城东头小庙前拜偶像的人
    add('i1', { label: '拜偶像的人', sex: 'm', age: 'adult', x: X.i1, facing: 1, robe: ROBE.i1, glow: 0.14, pose: 'kneel', prop: null, v: vOf('i1') });
    add('i2', { label: '拜偶像的人', sex: 'f', age: 'adult', x: X.i2, facing: 1, robe: ROBE.i2, glow: 0.14, pose: 'bow', v: vOf('i2') });
    add('i3', { label: '拜偶像的人', sex: 'm', age: 'elder', x: X.i3, facing: 1, robe: ROBE.i3, glow: 0.14, pose: 'kneel', prop: null, v: vOf('i3') });
    avoid([0.35, 1]);
  }

  // 院中的人都转向灯
  function faceLamps(ids) { for (const id of ids || present()) { const f = fig(id); if (f) face(id, X.lamps); } }
  function all(fn) { present().forEach(fn); }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 帖前 1:5 不独在乎言语，也在乎权能和圣灵 ─────────────────
    {
      kind: 'act', utter: '不独在乎言语，也在乎权能和圣灵', cmd: 'light 信 爱 望 --power --holy-spirit', ref: '1:5',
      verse: [
        { text: '在神我们的父面前，不住地记念你们<br>因信心所做的工夫，因爱心所受的劳苦，因盼望我们主耶稣基督所存的忍耐。', ref: '帖撒罗尼迦前书 1:3', hold: 8 },
        { text: '因为我们的福音传到你们那里，不独在乎言语，<br>也在乎权能和圣灵，并充足的信心。', ref: '帖撒罗尼迦前书 1:5', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            const lp = lampPts()[1];
            trans(b, { type: 'beam', xf: X.lamps, y: lp[1], w: PH() * 1.1, dur: 4.2 });
            sfx(b, 'harp');
            faceLamps();
            W.goTo(0.015, 12, b.instant);
          }],
          [1.6, b => { W.set('thL1', 1, b.instant); const p = lampPts()[0]; nameAt(b, '信', X.lamps - (PORT ? 0.12 : 0.05), PORT ? 0.52 : 0.52, { src: () => [p[0], p[1] - 4] }); sfx(b, 'chime'); }],
          [3.6, b => { W.set('thL2', 1, b.instant); const p = lampPts()[1]; nameAt(b, '爱', X.lamps, PORT ? 0.49 : 0.48, { src: () => [p[0], p[1] - 4] }); sfx(b, 'chime'); }],
          [5.6, b => { W.set('thL3', 1, b.instant); const p = lampPts()[2]; nameAt(b, '望', X.lamps + (PORT ? 0.12 : 0.05), PORT ? 0.52 : 0.52, { src: () => [p[0], p[1] - 4] }); sfx(b, 'chime'); }],
          // 也在乎权能和圣灵：灯火一涨，光照在每一个人身上
          [9.8, b => {
            const p = lampPts()[1];
            ringAt(b, p[0], p[1], 0.3, [255, 236, 190], 2.6, 2);
            sparkleAt(b, p[0], p[1] - 10, 30, [255, 240, 210], 20);
            all(id => glow(id, 0.4));
            pose('mourn', 'kneel'); pose('mother', 'kneel'); pose('child', 'kneel');
            pose('aris', 'pray'); pose('sec', 'raise'); pose('jason', 'carry');
            sfx(b, 'bell', { soft: true });
          }],
        ]);
      },
    },

    // ── 2 · 帖前 1:9 要服事那又真又活的神 ─────────────────────────
    {
      kind: 'act', utter: '要服事那又真又活的神', cmd: 'rm -rf 偶像/ && serve --god 又真又活', ref: '1:9',
      verse: [
        { text: '因为主的道从你们那里已经传扬出来。你们向神的信心不但在马其顿和亚该亚，<br>就是在各处也都传开了……', ref: '帖撒罗尼迦前书 1:8', hold: 7.5 },
        { text: '……你们是怎样离弃偶像，归向神，要服事那又真又活的神，<br>等候他儿子从天降临……', ref: '帖撒罗尼迦前书 1:9–10', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            const p = lampPts()[1];
            ringAt(b, p[0], p[1], 0.9, [255, 226, 170], 5, 1.4);
            W.set('thWord', 1, b.instant);
            W.goTo(0.04, 16, b.instant);
            all(id => pose(id, 'stand'));
            pose('jason', 'carry');
            sfx(b, 'bell', { soft: true });
          }],
          [2.2, b => nameAt(b, '马其顿', PORT ? 0.72 : 0.84, PORT ? 0.53 : 0.47, { hold: 3.4 })],
          [5.2, b => nameAt(b, '亚该亚', PORT ? 0.3 : 0.3, PORT ? 0.56 : 0.5, { hold: 3.4 })],
          // 离弃偶像：拜偶像的人站起来，转身；祭坛的火熄了
          [9.2, b => {
            ['i1', 'i2', 'i3'].forEach(id => { pose(id, 'stand'); face(id, -1); });
            W.set('thAltar', 0, b.instant);
            sfx(b, 'whisper', { soft: true });
          }],
          [10.4, b => {
            W.set('thIdol', 0, b.instant);
            S.turned = 1;
            if (!b.instant && fx()) {
              const G = shrineG();
              for (const dx of [-14, 0, 14]) fx().dust(G.cx + dx * G.s, G.y - 12 * G.s, 26, [190, 170, 140], 8 * G.s, 'near');
            }
            shake(b, 0.25);
            sfx(b, 'collapse', { soft: true });
          }],
          // 归向神：走进灯光里
          [11.2, b => {
            add('i1', { label: '归向神的人', glow: 0.3 }); add('i2', { label: '归向神的人', glow: 0.3 }); add('i3', { label: '归向神的人', glow: 0.3 });
            const f1 = fig('i1'), f2 = fig('i2'), f3 = fig('i3');
            if (f1) f1.v = vOf('t1'); if (f2) f2.v = vOf('t2'); if (f3) f3.v = vOf('t3');
            walk('i1', X.t1, { speed: 0.06, pose: 'stand' });
            walk('i2', X.t2, { speed: 0.045, pose: 'stand' });
            walk('i3', X.t3, { speed: 0.04, pose: 'stand' });
          }],
          // 等候他儿子从天降临：众人抬头
          [14.2, b => {
            for (const id of ['aris', 'mourn', 'mother', 'child', 'jason', 'sec']) { face(id, -1); pose(id, 'gaze'); }
            for (const id of ['i1', 'i2', 'i3']) { face(id, -1); pose(id, 'gaze'); }
          }],
        ]);
      },
    },

    // ── 3 · 帖前 2:13 这道实在是神的 ─────────────────────────────
    {
      kind: 'act', utter: '这道实在是神的', cmd: 'cat 书信 | run --in 信主的人心中', ref: '2:13',
      verse: [
        { text: '只在你们中间存心温柔，如同母亲乳养自己的孩子。<br>我们既是这样爱你们……', ref: '帖撒罗尼迦前书 2:7–8', hold: 6.5 },
        { text: '……你们听见我们所传神的道就领受了；不以为是人的道，乃以为是神的道。<br>这道实在是神的，并且运行在你们信主的人心中。', ref: '帖撒罗尼迦前书 2:13', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('thScroll', 1, b.instant);
            pose('jason', 'carry'); face('jason', -1);
            for (const id of ['aris', 'mourn', 'mother', 'child', 'sec', 'i1', 'i2', 'i3']) { pose(id, 'stand'); }
            faceLamps(['aris', 'mourn', 'mother', 'child', 'i1']);
            face('sec', -1); face('i2', -1); face('i3', -1);
            sfx(b, 'scroll');
            W.goTo(0.06, 14, b.instant);
          }],
          // 如同母亲乳养自己的孩子
          [1.6, b => { glow('mother', 0.5); ringOn(b, 'mother', 0.1, [255, 222, 190], 0.55); pose('mother', 'sit'); face('mother', 1); }],
          // 这道实在是神的：道自信上发光，一缕缕进到人心里
          [9.4, b => {
            const p = figPt('jason', 0.62) || [X.jason * W.w, W.h * 0.8];
            nameAt(b, '道', (p[0] / W.w) + (PORT ? 0 : 0.0), PORT ? 0.5 : 0.52, { src: () => { const q = figPt('jason', 0.62) || p; return [q[0] + (Math.random() - 0.5) * 20, q[1]]; }, rgb: [255, 236, 186] });
            sfx(b, 'chime');
          }],
          [11.2, b => {
            const from = () => { const f = fig('jason'), q = figPt('jason', 0.6); return q && f ? [q[0] + (f.fd >= 0 ? 1 : -1) * 0.16 * f._h, q[1]] : null; };
            ['aris', 'mourn', 'mother', 'child', 'sec', 'i1', 'i2', 'i3'].forEach((id, i) => { if (has(id)) trans(b, { type: 'stream', from, to: id, t: -i * 0.22, dur: 2.6, seed: i }); });
            sfx(b, 'harp');
          }],
          [14.2, b => {
            for (const id of ['aris', 'mourn', 'child', 'sec', 'i1', 'i2', 'i3']) glow(id, 0.44);
            glow('mother', 0.46);
            pose('aris', 'bow'); pose('i1', 'pray'); pose('i2', 'bow'); pose('mourn', 'pray'); pose('child', 'kneel');
          }],
        ]);
      },
    },

    // ── 4 · 帖前 4:9 你们自己蒙了神的教训，叫你们彼此相爱 ─────────────
    {
      kind: 'act', utter: '你们自己蒙了神的教训，叫你们彼此相爱', cmd: 'while (患难) { stand --firm; love++; }', ref: '4:9',
      verse: [
        { text: '……免得有人被诸般患难摇动。<br>因为你们自己知道，我们受患难原是命定的。', ref: '帖撒罗尼迦前书 3:3', hold: 6 },
        { text: '你们若靠主站立得稳，我们就活了。', ref: '帖撒罗尼迦前书 3:8', hold: 4.5 },
        { text: '论到弟兄们相爱，不用人写信给你们；<br>因为你们自己蒙了神的教训，叫你们彼此相爱。', ref: '帖撒罗尼迦前书 4:9', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 患难如大风
          [0, b => {
            W.set('gale', 0.85, b.instant); W.set('clouds', 0.72, b.instant);
            W.goTo(0.075, 18, b.instant);
            W.set('thScroll', 0.35, b.instant);
            for (const id of ['aris', 'mourn', 'child', 'sec', 'i1', 'i2', 'i3']) { pose(id, 'bow'); glow(id, 0.3); }
            pose('mother', 'kneel'); face('mother', 1);
            sfx(b, 'wind');
          }],
          // 站立得稳
          [7.4, b => {
            W.set('gale', 0.3, b.instant);
            for (const id of ['aris', 'mourn', 'mother', 'child', 'sec', 'i1', 'i2', 'i3']) { pose(id, 'stand'); glow(id, 0.4); }
            faceLamps();
            face('jason', -1);
            const p = lampPts()[1];
            ringAt(b, p[0], p[1], 0.22, [255, 236, 190], 2.2, 2);
            sfx(b, 'bell', { soft: true });
          }],
          [9.4, b => { hold('aris', 'torch'); hold('sec', 'torch'); }],
          // 彼此相爱：手牵手；火把举起，城中一扇扇窗亮起来
          [13.2, b => {
            W.set('gale', 0, b.instant); W.set('clouds', 0.4, b.instant);
            hands('mourn', 'mother'); hands('i1', 'aris');
            pose('aris', 'raise'); pose('sec', 'raise');
            W.set('thCity', 0.92, b.instant);
            sfx(b, 'harp');
          }],
          [15, b => { ringOn(b, 'aris', 0.14, [255, 214, 150], 1.1); ringOn(b, 'sec', 0.14, [255, 214, 150], 1.1); }],
          [18.6, b => { pose('aris', 'stand'); pose('sec', 'stand'); }],
        ]);
      },
    },

    // ── 5 · 帖前 4:14 神也必将他们与耶稣一同带来 ─────────────────────
    {
      kind: 'promise', utter: '神也必将他们与耶稣一同带来', cmd: 'sleep(睡了的人) && await 一同带来', ref: '4:14',
      verse: [
        { text: '论到睡了的人，我们不愿意弟兄们不知道，<br>恐怕你们忧伤，像那些没有指望的人一样。', ref: '帖撒罗尼迦前书 4:13', hold: 6.5 },
        { text: '我们若信耶稣死而复活了，那已经在耶稣里睡了的人，<br>神也必将他们与耶稣一同带来。', ref: '帖撒罗尼迦前书 4:14', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            hands('mourn', 'mother', false); hands('i1', 'aris', false);
            const f = fig('mourn'); if (f) f.v = PORT ? 0.1 : 0.06;
            // 忧伤的人跪在坟地的右边、面向坟墓；亚里达古站在她身后——坟与碑前留空，好看见每块石头上的光
            walk('mourn', X.gMourn, { speed: 0.04, pose: 'weep' });
            walk('aris', X.gAris, { speed: 0.035, pose: 'stand' });
            walk('i1', X.mourn, { speed: 0.03, pose: 'stand' });
            W.goTo(0.095, 16, b.instant);
          }],
          [2.4, b => sfx(b, 'weep', { soft: true })],
          [4, b => { pose('mourn', 'kneel', { weep: true }); face('mourn', -1); face('aris', -1); face('i1', -1); }],
          // 坟上一处一处点起光
          [8.2, b => {
            W.set('thHope', 1, b.instant);
            sfx(b, 'stars', { soft: true });
            if (!b.instant) gravePts().forEach((p, i) => sparkleAt(b, p[0], p[1] - 6, 14, [255, 240, 210], 10));
          }],
          [10.4, b => { pose('mourn', 'kneel', { weep: false }); glow('mourn', 0.48); ringOn(b, 'mourn', 0.1, [255, 236, 200], 0.5); }],
          [13, b => { pose('mourn', 'gaze'); pose('aris', 'gaze'); }],
        ]);
      },
    },

    // ── 6 · 帖前 4:16 主必亲自从天降临 ───────────────────────────
    {
      kind: 'promise', utter: '主必亲自从天降临', cmd: 'descend --from 天 --trumpet  # 死了的人必先复活', ref: '4:16',
      verse: [
        { text: '因为主必亲自从天降临，有呼叫的声音和天使长的声音，<br>又有神的号吹响；那在基督里死了的人必先复活。', ref: '帖撒罗尼迦前书 4:16', hold: 10 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('thVision', 1, b.instant); W.set('thOpen', 1, b.instant);
            W.goTo(0.115, 14, b.instant);
            flashW(b, 0.25);
            const [vx] = VPT();
            all(id => { face(id, vx); glow(id, 0.42); });
            for (const id of ['jason', 'sec', 'mother', 'child', 'i1', 'i2', 'i3', 'aris']) pose(id, 'gaze');
            sfx(b, 'angel');
          }],
          [1.2, b => { W.set('thLord', 1, b.instant); sfx(b, 'harp'); }],
          // 呼叫的声音
          [4.2, b => { const p = lordPt(); ringAt(b, p[0], p[1] - PH() * 0.6, 0.6, [255, 248, 230], 3, 2.4); sfx(b, 'choir'); }],
          // 天使长
          [4.8, b => { W.set('thArch', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          // 神的号吹响
          [6, b => {
            const e = hornEnd();
            [0, 0.5, 1].forEach((d, i) => { if (!b.instant) GS.book.after(d, () => { if (isCur() && fx()) fx().ring(e[0], e[1], [255, 232, 170], M() * (0.35 + i * 0.2), 2.6, 1.8); }); });
            sfx(b, 'trumpet'); shake(b, 0.3);
            pose('mother', 'kneel'); pose('child', 'kneel'); pose('i3', 'kneel');
          }],
          // 在基督里死了的人必先复活
          [7.4, b => {
            W.set('thRise', 1, b.instant);
            if (!b.instant) gravePts().forEach(p => sparkleAt(b, p[0], p[1], 24, [255, 250, 236], 12));
            sfx(b, 'stars');
          }],
          [8.6, b => { pose('mourn', 'raise'); pose('aris', 'raise'); glow('mourn', 0.55); }],
          [13.2, b => { const [vx, vy] = VPT(); ringAt(b, vx * W.w, vy * W.h, 0.25, [255, 250, 236], 2.4, 1.6); }],
        ]);
      },
    },

    // ── 7 · 帖前 4:17 这样，我们就要和主永远同在 ───────────────────────
    {
      kind: 'promise', utter: '这样，我们就要和主永远同在', cmd: 'join --clouds --with 主 --forever', ref: '4:17',
      verse: [
        { text: '以后我们这活着还存留的人必和他们一同被提到云里，<br>在空中与主相遇。这样，我们就要和主永远同在。', ref: '帖撒罗尼迦前书 4:17', hold: 8.5 },
        { text: '所以，你们当用这些话彼此劝慰。', ref: '帖撒罗尼迦前书 4:18', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('thVision', 1, b.instant); W.set('thOpen', 1, b.instant); W.set('thLord', 1, b.instant); W.set('thArch', 1, b.instant); W.set('thRise', 1, b.instant);
            W.set('thCaught', 1, b.instant);
            // 一同被提：各人自己在光里改变（全身发光），光柱罩住他，他化作光往云里去
            all(id => { pose(id, 'raise'); glow(id, 1); });
            pose('child', 'gaze');
            sfx(b, 'angel');
            W.goTo(0.14, 16, b.instant);
            if (!b.instant) {
              const ids = riseIds();
              ids.forEach((id, j) => GS.book.after(j * 0.05 / 0.17, () => { if (isCur()) { sparkleOn(b, id, 14, [255, 248, 230], 0.5); ringOn(b, id, 0.05, [255, 246, 226], 0.5); } }));
            }
          }],
          // 在空中与主相遇
          [5.8, b => { const [vx, vy] = VPT(); ringAt(b, vx * W.w, vy * W.h, 0.55, [255, 248, 230], 3.2, 2.4); flashW(b, 0.2); sfx(b, 'bell'); }],
          // 永远同在：异象渐渐隐去，升到高处
          [8, b => { W.set('thVision', 0, b.instant); W.set('thOpen', 0, b.instant); }],
          // 彼此劝慰
          [9.9, b => {
            const f = fig('mourn'); if (f) f.v = vOf('mourn');
            all(id => { pose(id, 'stand'); glow(id, 0.5); });
            walk('aris', X.aris, { speed: 0.035, pose: 'stand' });
            embrace('mourn', 'i1', { at: X.embA });
            embrace('mother', 'i2', { at: (X.mother + X.lamps) / 2 + 0.004 });
            sfx(b, 'harp', { soft: true });
          }],
          [13.2, b => { for (const id of ['jason', 'sec', 'i3', 'child']) face(id, X.embA); }],
        ]);
      },
    },

    // ── 8 · 帖前 5:2 主的日子来到，好像夜间的贼一样 ────────────────────
    {
      kind: 'act', utter: '主的日子来到，好像夜间的贼一样', cmd: 'watch --awake --armor 信,爱,盼望', ref: '5:2',
      verse: [
        { text: '因为你们自己明明晓得，主的日子来到，好像夜间的贼一样。<br>人正说「平安稳妥」的时候，灾祸忽然临到他们……', ref: '帖撒罗尼迦前书 5:2–3', hold: 7.5 },
        { text: '弟兄们，你们却不在黑暗里，叫那日子临到你们像贼一样。<br>你们都是光明之子，都是白昼之子……', ref: '帖撒罗尼迦前书 5:4–5', hold: 7 },
        { text: '但我们既然属乎白昼，就应当谨守，<br>把信和爱当作护心镜遮胸，把得救的盼望当作头盔戴上。', ref: '帖撒罗尼迦前书 5:8', hold: 7 },
      ],
      apply(c) {
        T(c, [
          // 城睡了：窗一扇扇暗下去，月被云遮住
          [0, b => {
            W.set('thCity', 0.12, b.instant);
            W.set('moon', 0.3, b.instant); W.set('clouds', 0.58, b.instant); W.set('stars', 0.7, b.instant);
            all(id => pose(id, 'stand'));
            faceLamps();
            face('jason', -1);
            W.goTo(0.16, 22, b.instant);
            sfx(b, 'whisper', { soft: true });
          }],
          // 光明之子
          [9.2, b => {
            W.set('thDay', 1, b.instant);
            all(id => glow(id, 0.5));
            const p = lampPts()[1];
            ringAt(b, p[0], p[1], 0.35, [255, 236, 190], 2.8, 2.2);
            sfx(b, 'bell');
          }],
          // 护心镜与头盔
          [17.6, b => {
            W.set('thArmour', 1, b.instant);
            all(id => { pose(id, 'stand'); face(id, -1); });
            if (!b.instant) present().forEach(id => sparkleOn(b, id, 10, [255, 236, 190], 0.62));
            sfx(b, 'chime');
          }],
        ]);
      },
    },

    // ── 9 · 帖前 5:16–18 要常常喜乐，不住地祷告，凡事谢恩 ─────────────────
    {
      kind: 'cmd', utter: '要常常喜乐，不住地祷告，凡事谢恩', cmd: 'loop { 喜乐; 祷告; 谢恩; }', ref: '5:16–18',
      verse: [
        { text: '要常常喜乐，不住地祷告，凡事谢恩；<br>因为这是神在基督耶稣里向你们所定的旨意。', ref: '帖撒罗尼迦前书 5:16–18', hold: 7 },
        { text: '不要消灭圣灵的感动；不要藐视先知的讲论。<br>但要凡事察验；善美的要持守……', ref: '帖撒罗尼迦前书 5:19–21', hold: 6.5 },
      ],
      apply(c) {
        const R = PORT ? ['jason', 'sec', 'i2', 'i3'] : ['jason', 'sec', 'i2', 'i3'], Lf = ['aris', 'mourn', 'i1'], Md = ['mother', 'child'];
        T(c, [
          [0, b => {
            // 东方（左）低处初透一点冷灰的晨光；鸟自灯光照着的院子飞起
            W.goTo(0.208, 14, b.instant);
            W.set('thGrey', 1, b.instant);
            W.setPop('bird', 12, W.w * X.court, W.h * 0.57, b.instant);
            trans(b, { type: 'birds', n: 7, seed: 1, dur: 8 });
            sfx(b, 'bird', { soft: true });
          }],
          // 喜乐（右边的人举手）
          [0.9, b => {
            R.forEach(id => { pose(id, 'raise'); face(id, -1); });
            nameAt(b, '喜乐', PORT ? 0.78 : 0.79, PORT ? 0.5 : 0.53, { hold: 3 });
          }],
          // 祷告（左边的人跪下）
          [2.8, b => {
            Lf.forEach(id => { pose(id, 'pray'); face(id, 1); });
            nameAt(b, '祷告', PORT ? 0.45 : 0.6, PORT ? 0.56 : 0.47, { hold: 3 });
          }],
          // 谢恩（当中的人俯首）
          [4.7, b => {
            Md.forEach(id => { pose(id, 'bow'); face(id, 1); });
            nameAt(b, '谢恩', PORT ? 0.62 : 0.69, PORT ? 0.62 : 0.6, { hold: 3 });
          }],
          [5.2, b => { trans(b, { type: 'birds', n: 5, seed: 9, dur: 7.5 }); sfx(b, 'bird', { soft: true }); }],
          // 不要消灭圣灵的感动：灯火更高
          [8.8, b => {
            W.set('thSpirit', 1, b.instant);
            const p = lampPts()[1];
            ringAt(b, p[0], p[1] - 10, 0.25, [255, 236, 190], 2.4, 2);
            sparkleAt(b, p[0], p[1] - 16, 26, [255, 236, 190], 14);
            sfx(b, 'harp');
          }],
        ]);
      },
    },

    // ── 10 · 帖前 5:24 那召你们的本是信实的，他必成就这事 ────────────────
    {
      kind: 'promise', utter: '那召你们的本是信实的，他必成就这事', cmd: 'assert(信实) && complete()', ref: '5:24',
      verse: [
        { text: '愿赐平安的神亲自使你们全然成圣！又愿你们的灵与魂与身子得蒙保守，<br>在我们主耶稣基督降临的时候，完全无可指摘！', ref: '帖撒罗尼迦前书 5:23', hold: 8 },
        { text: '那召你们的本是信实的，他必成就这事。', ref: '帖撒罗尼迦前书 5:24', hold: 5 },
        { text: '愿我主耶稣基督的恩常与你们同在！', ref: '帖撒罗尼迦前书 5:28', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.232, 20, b.instant);
            W.set('thStar', 1, b.instant);
            all(id => { pose(id, 'stand'); face(id, -1); });
            sfx(b, 'harp', { soft: true });
          }],
          // 灵与魂与身子得蒙保守：一层光罩住这家与坟地
          [2.2, b => { W.set('thKeep', 1, b.instant); if (!b.instant) gravePts().forEach(p => sparkleAt(b, p[0], p[1] - 8, 8, [255, 240, 210], 8)); }],
          // 他必成就这事：晨星一亮
          [9.6, b => { const p = starPt(); ringAt(b, p[0], p[1], 0.28, [236, 242, 255], 2.8, 1.6); sparkleAt(b, p[0], p[1], 20, [236, 242, 255], 16); sfx(b, 'bell'); }],
          // 恩
          [15.8, b => { all(id => pose(id, 'bow')); pose('child', 'stand'); }],
        ]);
      },
    },

    // ── 11 · 帖后 1:10 要在他圣徒的身上得荣耀 ────────────────────────
    {
      kind: 'act', utter: '要在他圣徒的身上得荣耀', cmd: 'glorify --in 圣徒 --at sunrise', ref: '帖撒罗尼迦后书 1:10',
      verse: [
        { text: '弟兄们，我们该为你们常常感谢神，这本是合宜的；<br>因你们的信心格外增长，并且你们众人彼此相爱的心也都充足。', ref: '帖撒罗尼迦后书 1:3', hold: 7 },
        { text: '这正是主降临、要在他圣徒的身上得荣耀、<br>又在一切信的人身上显为希奇的那日子。', ref: '帖撒罗尼迦后书 1:10', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.262, 16, b.instant);
            W.set('moon', 0.6, b.instant); W.set('clouds', 0.4, b.instant); W.set('stars', 1, b.instant);
            W.set('thKeep', 0.25, b.instant); W.set('thDay', 0.3, b.instant); W.set('thArmour', 0.35, b.instant);
            W.set('thCity', 0.1, b.instant);
            all(id => { pose(id, 'stand'); face(id, -1); });
            sfx(b, 'bird', { soft: true });
          }],
          // 信心格外增长：又有信的人从城里来
          [2.4, b => {
            hold('aris', null); hold('sec', null);
            const c2 = C(), n = PORT ? 1 : 3;
            if (hasCrowd('newc')) c2.removeCrowd('newc', { fade: false });
            const ms = c2.crowd('newc', { n, x0: 1.02, x1: 1.07, layer: 2, label: '信的人', glow: 0.3, from: b.instant ? 'none' : 'fade', mill: false });
            c2.crowdWalk('newc', X.n0, X.n1, { speed: 0.045, pose: 'stand' });
            // 分开站、前后两排（俯首时不缠在一起）
            (ms || []).forEach((m, i) => {
              const x = n > 1 ? lerp(X.n0, X.n1, i / (n - 1)) : (X.n0 + X.n1) / 2;
              if (m.tx != null) m.tx = x; else m.nx = x;
              m.v = PORT ? 0.14 : [0.02, 0.2, 0.08][i % 3];
            });
            S.newc = 1;
            sfx(b, 'crowd', { soft: true });
          }],
          [6.4, b => { W.set('thStar', 0, b.instant); W.set('thL1', 0.45, b.instant); W.set('thL2', 0.45, b.instant); W.set('thL3', 0.45, b.instant); W.set('thSpirit', 0.3, b.instant); }],
          // 在他圣徒的身上得荣耀：晨光落在每一个人身上
          [8.8, b => {
            W.set('thGlory', 1, b.instant);
            all(id => { pose(id, 'gaze'); glow(id, 0.55); });
            { const c2 = C(), g = hasCrowd('newc') && c2.crowds.get('newc'); if (g) g.members.forEach(m => { m.glow = 0.55; }); }
            if (!b.instant) present().forEach(id => sparkleOn(b, id, 12, [255, 226, 160], 0.55));
            sfx(b, 'harp');
          }],
          [13.4, b => { const c2 = C(); if (hasCrowd('newc')) c2.crowdPose('newc', 'bow'); }],
        ]);
      },
    },

    // ── 12 · 帖后 2:8 用降临的荣光废掉他 ────────────────────────────
    {
      kind: 'judge', utter: '用降临的荣光废掉他', cmd: 'dispel 黑烟 --with 降临的荣光', ref: '帖撒罗尼迦后书 2:8',
      verse: [
        { text: '弟兄们，论到我们主耶稣基督降临和我们到他那里聚集，我劝你们：<br>……不要轻易动心，也不要惊慌。', ref: '帖撒罗尼迦后书 2:1–2', hold: 7 },
        { text: '那时这不法的人必显露出来。<br>主耶稣要用口中的气灭绝他，用降临的荣光废掉他。', ref: '帖撒罗尼迦后书 2:8', hold: 7 },
        { text: '所以，弟兄们，你们要站立得稳，凡所领受的教训……都要坚守。', ref: '帖撒罗尼迦后书 2:15', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          // 冷暗的烟自倒塌的小庙升起
          [0, b => {
            W.set('thShadow', 1, b.instant); W.set('thDispel', 0, b.instant);
            W.set('thGlory', 0.4, b.instant);
            W.goTo(0.285, 22, b.instant);
            all(id => { pose(id, 'stand'); face(id, 1); });
            const c2 = C(); if (hasCrowd('newc')) c2.crowdPose('newc', 'stand');
            sfx(b, 'whisper', { low: true });
          }],
          // 口中的气：光的风自东方来
          [10.6, b => { W.set('gale', 0.5, b.instant); W.set('thDispel', 1, b.instant); sfx(b, 'wind'); }],
          // 降临的荣光
          [12.6, b => {
            flashW(b, 0.35);
            ringAt(b, W.sun.x, W.sun.y, 0.9, [255, 244, 214], 3.4, 2);
            sfx(b, 'harp');
          }],
          [14.4, b => { W.set('thShadow', 0, b.instant); W.set('gale', 0, b.instant); }],
          // 站立得稳
          [16.8, b => {
            W.set('thScroll', 1, b.instant);
            all(id => { pose(id, 'stand'); face(id, -1); glow(id, 0.5); });
            pose('jason', 'carry');
            ringOn(b, 'jason', 0.12, [255, 236, 190], 0.6);
          }],
        ]);
      },
    },

    // ── 13 · 帖后 3:16 愿赐平安的主随时随事亲自给你们平安！ ────────────────
    {
      kind: 'bless', utter: '愿赐平安的主随时随事亲自给你们平安！', cmd: 'peace --always --every-way', ref: '帖撒罗尼迦后书 3:16',
      verse: [
        { text: '但主是信实的，要坚固你们，保护你们脱离那恶者。', ref: '帖撒罗尼迦后书 3:3', hold: 5 },
        { text: '弟兄们，你们行善不可丧志。', ref: '帖撒罗尼迦后书 3:13', hold: 4 },
        { text: '愿赐平安的主随时随事亲自给你们平安！愿主常与你们众人同在！', ref: '帖撒罗尼迦后书 3:16', hold: 6 },
        { text: '愿我们主耶稣基督的恩常与你们众人同在！', ref: '帖撒罗尼迦后书 3:18', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.31, 20, b.instant);
            W.set('thKeep', 0.7, b.instant); W.set('thScroll', 0.3, b.instant); W.set('thArmour', 0, b.instant); W.set('thDay', 0, b.instant);
            W.set('thL1', 0, b.instant); W.set('thL2', 0, b.instant); W.set('thL3', 0, b.instant); W.set('thSpirit', 0, b.instant);
            pose('jason', 'stand');
            sfx(b, 'bell', { soft: true });
          }],
          // 行善不可丧志：各人安静做工；西公都把一罐水送给忧伤的人
          [6.4, b => {
            W.set('thKeep', 0, b.instant); W.set('thGlory', 0, b.instant);
            S.work = 1;
            hold('sec', 'jar');
            walk('sec', X.mourn + (PORT ? 0.028 : 0.022), { speed: 0.04, pose: 'stand' });
            face('sec', -1);
            hold('aris', 'wood');
            walk('aris', PORT ? 0.52 : 0.6, { speed: 0.03, pose: 'carry' });
            hold('i3', 'bundle');
            walk('i3', PORT ? 0.95 : 0.975, { speed: 0.03, pose: 'stand' });
          }],
          [9.6, b => { face('mourn', 1); hold('mourn', 'jar'); hold('sec', null); pose('mourn', 'bow'); pose('sec', 'bow'); }],
          // 平安
          [11.8, b => {
            W.set('thPeace', 1, b.instant);
            W.set('bloom', 0.85, b.instant); W.set('grass', 0.9, b.instant); W.set('herbs', 0.7, b.instant);
            W.setPop('bird', 18, W.w * 0.7, W.h * 0.35, b.instant);
            all(id => { if (id !== 'aris' && id !== 'i3') pose(id, 'stand'); face(id, -1); glow(id, 0.45); });
            const c2 = C(); if (hasCrowd('newc')) c2.crowdPose('newc', 'stand');
            const p = figPt('jason', 0.5);
            if (p) ringAt(b, p[0], p[1], 0.9, [255, 240, 200], 4.2, 2);
            sfx(b, 'harp'); sfx(b, 'bird', { soft: true });
          }],
          // 恩
          [19.2, b => {
            const p = lampPts()[1];
            ringAt(b, p[0], p[1] - 20, 1.1, [255, 244, 220], 5, 2.2);
            sparkleAt(b, p[0], p[1] - 40, 30, [255, 240, 210], 40);
            sfx(b, 'bell', { soft: true });
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '帖撒罗尼迦书', books: [52, 53], title: '主必降临', sub: '帖撒罗尼迦前书 1 — 后书 3', tint: [230, 236, 255], music: 'twelve2',
    outro: 24,
    intro: [
      { text: '保罗、西拉、提摩太写信给帖撒罗尼迦在父神和主耶稣基督里的教会。<br>愿恩惠、平安归与你们！', ref: '帖撒罗尼迦前书 1:1', hold: 7 },
      { text: '我指着主嘱咐你们，要把这信念给众弟兄听。', ref: '帖撒罗尼迦前书 5:27', hold: 5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '耶孙': { text: '耸动合城的人闯进耶孙的家，要将保罗、西拉带到百姓那里。', ref: '使徒行传 17:5' },
      '耶孙的家': { text: '耶孙收留他们。', ref: '使徒行传 17:7' },
      '亚里达古': { text: '有马其顿的帖撒罗尼迦人亚里达古和我们同去。', ref: '使徒行传 27:2' },
      '西公都': { text: '同他到亚细亚去的，有……帖撒罗尼迦人亚里达古和西公都……', ref: '使徒行传 20:4' },
      '母亲': { text: '只在你们中间存心温柔，如同母亲乳养自己的孩子。', ref: '帖撒罗尼迦前书 2:7' },
      '孩子': { text: '你们也晓得，我们怎样劝勉你们，安慰你们，嘱咐你们各人，好像父亲待自己的儿女一样。', ref: '帖撒罗尼迦前书 2:11' },
      '忧伤的人': { text: '论到睡了的人，我们不愿意弟兄们不知道，恐怕你们忧伤，像那些没有指望的人一样。', ref: '帖撒罗尼迦前书 4:13' },
      '拜偶像的人': { text: '你们是怎样离弃偶像，归向神，要服事那又真又活的神。', ref: '帖撒罗尼迦前书 1:9' },
      '归向神的人': { text: '并且你们在大难之中，蒙了圣灵所赐的喜乐，领受真道就效法我们，也效法了主。', ref: '帖撒罗尼迦前书 1:6' },
      '信的人': { text: '这正是主降临、要在他圣徒的身上得荣耀、又在一切信的人身上显为希奇的那日子。', ref: '帖撒罗尼迦后书 1:10' },
      '偶像': { text: '你们是怎样离弃偶像，归向神，要服事那又真又活的神。', ref: '帖撒罗尼迦前书 1:9' },
      '坟墓': { text: '我们若信耶稣死而复活了，那已经在耶稣里睡了的人，神也必将他们与耶稣一同带来。', ref: '帖撒罗尼迦前书 4:14' },
      '灯': { text: '不住地记念你们因信心所做的工夫，因爱心所受的劳苦，因盼望我们主耶稣基督所存的忍耐。', ref: '帖撒罗尼迦前书 1:3' },
      '书信': { text: '我保罗亲笔问你们安。凡我的信都以此为记，我的笔迹就是这样。', ref: '帖撒罗尼迦后书 3:17' },
      '帖撒罗尼迦': { text: '保罗、西拉、提摩太写信给帖撒罗尼迦、在神我们的父与主耶稣基督里的教会。', ref: '帖撒罗尼迦后书 1:1' },
      '马其顿': { text: '你们向马其顿全地的众弟兄固然是这样行，但我劝弟兄们要更加勉励。', ref: '帖撒罗尼迦前书 4:10' },
      '亚该亚': { text: '甚至你们作了马其顿和亚该亚所有信主之人的榜样。', ref: '帖撒罗尼迦前书 1:7' },
      '云': { text: '以后我们这活着还存留的人必和他们一同被提到云里，在空中与主相遇。', ref: '帖撒罗尼迦前书 4:17' },
    },
  });
})(window.GS);
