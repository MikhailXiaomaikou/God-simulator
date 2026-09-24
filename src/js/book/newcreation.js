/* ─────────────────────────────────────────────────────────────
 * book/newcreation.js —— 启示录 · 新天新地（启示录 21 — 22）· 全本圣经的末一幕
 *
 * 幕启：先前的天地——天是灰的，云低压，海上仍有浪；地是枯的，荆棘在地上；几个人在哀哭。
 *   一 · 「看哪！我造新天新地」——灰色的天如书卷向两边卷起，新的天放出珍珠与金的光；
 *        海平静下来，自远而近化作一片明如水晶的光原：「海也不再有了」。
 *   二 · 「圣城新耶路撒冷由神那里从天而降」——天开了一道门，城自光中缓缓降下，落在中丘上：
 *        碧玉的墙、珍珠的门、精金如玻璃的城，如新妇妆饰整齐。
 *   三 · 「看哪，神的帐幕在人间」——宝座的光一闪，一团荣耀的云自正门降到人中间，张开覆庇众人；万民聚来。
 *        （到第五句「一切都更新了」时，那云化入新造的光里，不停成一带。）
 *   四 · 「神要擦去他们一切的眼泪」——光一一临到哀哭的人：母亲的孩子自光中跑来，与她相拥；
 *        拄杖的老者直起身来；众人都穿上了白衣。
 *   五 · 「看哪，我将一切都更新了」——从灵所在之处，青草、菜蔬、树木、百花一齐长起，飞鸟、走兽自光与尘中出来。
 *   六 · 「都成了！我是阿拉法，我是俄梅戛」——天的东边聚成「初」，西边聚成「终」，一道光把首尾连成一环。
 *   七 · 「城中有神的荣耀」——碧玉的墙放光，十二根基一层一层显出宝石的颜色，十二个珍珠门发亮，街道是精金。
 *   八 · 「有神的荣耀光照，又有羔羊为城的灯」——日头与月亮隐去，光却不减：神的荣耀在天当中，
 *        城顶上一只小小的、发光的羔羊为城的灯；城门敞开，列国的人成行地走进城去；不再有黑夜。
 *   九 · 「我要将生命泉的水白白赐给那口渴的人喝」——宝座下涌出泉源，生命水的河明亮如水晶，
 *        从城中街道流出城门，流下山坡，流过众人脚前；天使指示约翰。
 *   十 · 「我必将神乐园中生命树的果子赐给他吃」——河这边与那边长起生命树，结十二样果子，叶子乃为医治万民。
 *   十一 · 「也要见他的面」——宝座的光临到众人：众人俯伏，起来时额上有他的名；荆棘化为花——再没有咒诅。
 *   十二 · 「我是明亮的晨星」——一颗明亮的星自东方升起。
 *   十三 · 「来」——圣灵（灵的光）和新妇都说「来」：珍珠门一圈一圈放光；远处的人成群而来，到河边取生命的水。
 *   十四 · 「是了，我必快来」——东方大放光明，众人举手：「阿们！主耶稣啊，我愿你来！」
 *        末了一句：「愿主耶稣的恩惠常与众圣徒同在。阿们！」——全本圣经在满满的光中结束。
 *
 * 父不显为人形：只有天上的光、宝座的光辉与旁白的声音；复活荣耀的基督只以光显出（晨星、羔羊为灯）；
 * 羔羊是一只小小的光的羔羊（不画伤痕）。灵是玩家自己的光。天使是发光的人形。
 *
 * 画面的方位（桌面）：左 = 先前的海（化为光原，经文在其上）；右 = 近地（众人站在岭线上）；
 *   中丘上是城（0.60 — 0.92，左侧的城墙面向画面中央）；河从当中的城门（0.76）流出，流到众人脚前；
 *   两棵生命树在河的这边与那边（0.598 / 0.922，在城的两角之前，不挡正面的珍珠门）。竖屏的手机：一切按 XP 另排，人数少些。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const sm = U.smoothstep;
  const ACT = 'newcreation';
  const isCur = () => GS.book.current(ACT);
  const HAS_P2D = typeof Path2D !== 'undefined';

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LVS = {
    ncOld: ['lin', 0.1],      // 先前的天（灰的书卷）：1 满天 → 0 卷尽
    ncGrey: ['exp', 0.35],    // 先前的地上的灰暗
    ncSky: ['exp', 0.35],     // 新天的光
    ncSea: ['lin', 0.1],      // 海不再有：化为明如水晶的光原（自远而近）
    ncThorn: ['exp', 0.45],   // 荆棘（咒诅的记号）
    ncOpen: ['exp', 0.7],     // 天开了一道门
    ncCity: ['lin', 0.115],   // 圣城自天而降（0 天上 → 1 落在山上）
    ncVeil: ['exp', 0.45],    // 降下时围着城的光纱（如新妇的纱）
    ncGlow: ['exp', 0.35],    // 城的荣光
    ncBeam: ['exp', 0.5],     // 自正门降到人间的一道光（云柱）
    ncTent: ['lin', 0.2],     // 神的帐幕在人间：荣耀的云自正门降下（0–0.55），张开覆庇众人（0.4–1）
    ncCloud: ['exp', 0.5],    // 那云的浓淡（一切更新时化入新造的光里）
    ncWall: ['exp', 0.6],     // 碧玉的墙放光
    ncFound: ['lin', 1.45],   // 十二根基一层层显出（0 … 12）
    ncGates: ['exp', 0.5],    // 十二个珍珠门发亮
    ncGateOpen: ['exp', 0.45],// 城门敞开，总不关闭
    ncGold: ['exp', 0.5],     // 精金的街道，如明透的玻璃
    ncLamb: ['exp', 0.45],    // 羔羊为城的灯
    ncNations: ['lin', 0.1],  // 列国在城的光里行走
    ncSpring: ['exp', 0.6],   // 宝座下的泉源
    ncRiver: ['lin', 0.085],  // 生命水的河（0 宝座 → 1 流到众人脚前）
    ncTree: ['lin', 0.12],    // 生命树长起
    ncFruit: ['exp', 0.5],    // 十二样果子
    ncLeaf: ['exp', 0.4],     // 叶子乃为医治万民
    ncFace: ['exp', 0.5],     // 宝座的光临到众人（见他的面）
    ncMark: ['exp', 0.6],     // 他的名字写在他们的额上
    ncRing: ['lin', 0.34],    // 初与终连成一环（描出的进度）
    ncRingA: ['exp', 0.6],    // 那一环的光
    ncStar: ['lin', 0.125],   // 晨星升起的路程
    ncStarA: ['exp', 0.6],    // 晨星的光
    ncCall: ['exp', 0.5],     // 「来！」自城门与灵发出的光
    ncGlory: ['exp', 0.28],   // 末了：东方大放光明
    ncShine: ['exp', 0.3],    // 日头落下，光却不减：神的荣耀光照（天上一层温和的金光）
  };
  for (const k in LVS) W.defineLevel(k, LVS[k][0], LVS[k][1]);
  const lv = k => W.lv[k] || 0;
  const setL = (k, v, b) => W.set(k, v, !!(b && b.instant) || !!W.replaying);

  // ── 地上的位置（画面宽度的比例）：桌面 XD；竖屏手机 XP ──────────────
  const XD = {
    angel: 0.515, john: 0.545, mother: 0.595, childFrom: 0.672, elder: 0.642, man: 0.808, woman: 0.9,
    rx: 0.76, treeL: 0.598, treeR: 0.922, treeH: 3.8, city0: 0.6, city1: 0.92, side: 0.05,
    cA0: 0.565, cA1: 0.715, cB0: 0.79, cB1: 0.95, nA: 6, nB: 5, nC: 5, nD: 6,
    cC0: 0.805, cC1: 0.935, vC: 0.42,
    bankL: 0.728, bankR: 0.79, drinkM: 0.715, drinkC: 0.735,
  };
  const XP = {
    angel: 0.455, john: 0.505, mother: 0.57, childFrom: 0.665, elder: 0.645, man: 0.83, woman: 0.905,
    rx: 0.755, treeL: 0.615, treeR: 0.878, treeH: 3.35, city0: 0.52, city1: 0.99, side: 0.045,
    cA0: 0.52, cA1: 0.69, cB0: 0.8, cB1: 0.93, nA: 3, nB: 3, nC: 3, nD: 3,
    cC0: 0.8, cC1: 0.94, vC: 0.4,
    bankL: 0.7, bankR: 0.8, drinkM: 0.69, drinkC: 0.715,
  };
  let X = XD, PORT = false;
  function layout() { PORT = W.w < W.h * 0.9; X = PORT ? XP : XD; }

  // ── 小工具 ──────────────────────────────────────────────────
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const PH = l => 34 * LS(l == null ? 2 : l);            // 人的身高（像素）
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  const litC = (c, k) => [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)];
  function gY(l, xf) {
    const x = xf * W.w;
    let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  }
  const gB = (l, xf) => W.ridgeBaseY(l, xf * W.w);
  // 城自己的光：不随天色暗下去太多
  const cityK = () => clamp(0.62 + 0.38 * W.daylight + 0.16 * lv('ncGlow') + 0.1 * lv('ncGlory'), 0, 1.22);

  // ── 发光的精灵图 ─────────────────────────────────────────────
  let SP = null, ctxA = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, rgba(rgb, a0));
    gr.addColorStop(mid || 0.3, rgba(rgb, a0 * 0.34));
    gr.addColorStop(0.7, rgba(rgb, a0 * 0.08));
    gr.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return c;
  }
  function vbeam(c0, c1) {
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, c0); hz.addColorStop(0.5, c1); hz.addColorStop(1, c0);
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return b;
  }
  // 云团：当中实、边上柔（没有硬边）
  function puff(rgb) {
    const c = cnv(96, 96), g = c.getContext('2d'), gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
    gr.addColorStop(0, rgba(rgb, 1)); gr.addColorStop(0.42, rgba(rgb, 0.86));
    gr.addColorStop(0.74, rgba(rgb, 0.34)); gr.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 96, 96);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        gold: radial([255, 222, 150], 1), white: radial([255, 252, 242], 1, 0.22), pale: radial([236, 240, 255], 1),
        warm: radial([255, 236, 196], 1, 0.4), jade: radial([180, 255, 214], 1), rose: radial([255, 214, 200], 1, 0.4),
        aqua: radial([200, 240, 255], 1, 0.35),
        beam: vbeam('rgba(255,244,214,0)', 'rgba(255,248,230,1)'),
        cloudL: puff([255, 250, 236]), cloudS: puff([230, 224, 228]),
      };
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(img, x, y, r, a, sy) {
    if (!img || !ctxA || !(a > 0.004) || !(r > 0.3)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 发光的人形（列国行走在城的光里，远远的小人）
  function lightFigure(ctx, x, y, h, a, seed) {
    if (a < 0.01 || h < 0.8) return;
    glowAt(SP.gold, x, y - h * 0.5, h * 0.9, a * 0.4);
    ctx.globalAlpha = Math.min(1, a);
    ctx.fillStyle = 'rgb(255,250,236)';
    const sw = Math.sin(W.t * 3 + seed) * 0.05 * h;
    ctx.beginPath();
    ctx.moveTo(x - 0.16 * h, y);
    ctx.quadraticCurveTo(x - 0.12 * h + sw, y - 0.45 * h, x - 0.07 * h, y - 0.78 * h);
    ctx.lineTo(x + 0.07 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.12 * h - sw, y - 0.45 * h, x + 0.16 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.075 * h, y - 0.88 * h); ctx.arc(x, y - 0.88 * h, 0.075 * h, 0, TAU);
    ctx.fill();
  }

  // ── 人物（皆经人物模块）───────────────────────────────────────
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o || {}); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function prop(id, k) { const c = C(); if (c.prop && has(id)) c.prop(id, k || null); }
  function robe(id, rgb) { const f = fig(id); if (f) { f.robe = rgb.slice(); f.robeSet = true; } }
  const hasCrowd = g => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(g)); };
  function members(g) { const c = C(); const q = c && c.crowds && c.crowds.get ? c.crowds.get(g) : null; return q ? q.members.filter(m => !m.dying) : []; }
  function crowd(g, o) {
    const c = C();
    if (hasCrowd(g)) c.removeCrowd(g, { fade: false });
    return c.crowd(g, Object.assign({ from: W.replaying ? 'none' : 'fade', v: 0, mill: false }, o));
  }
  function crowdPose(g, p) { const c = C(); if (hasCrowd(g)) c.crowdPose(g, p); }
  function crowdFace(g, xf) { for (const m of members(g)) { m.facing = m.nx <= xf ? 1 : -1; if (W.replaying) m.fd = m.facing; } }
  function crowdFaceDir(g, d) { for (const m of members(g)) { m.facing = d; if (W.replaying) m.fd = d; } }
  function crowdRobe(g) { members(g).forEach((m, i) => { m.robe = WHITES[i % WHITES.length].slice(); m.accent = null; }); }
  function crowdGlow(g, v) { for (const m of members(g)) m.glow = v; }
  const FOLK = ['folkA', 'folkB', 'folkC', 'folkD'];
  const NAMED = ['john', 'mother', 'child', 'elder', 'man', 'woman'];

  // 人身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id), k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.7, W.h * 0.8];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, gY(l, f.nx) - PH(l) * k];
  }

  // 音效、震动、闪光（瞬间重演时都略过）
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flash(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  function sparkleAt(b, x, y, n, rgb, spread) { if (b.instant || !fx()) return; fx().sparkle(x, y, n || 20, rgb || [255, 240, 206], (spread || 14) * SU(), 'top'); }
  function ringAt(b, x, y, r, rgb, dur) { if (b.instant || !fx()) return; fx().ring(x, y, rgb || [255, 244, 214], r, dur || 2.4, 1.6); }
  function chime(ch) { const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(ch)); }
  // 名字以光聚成（粒子）
  function nameAt(b, str, x, y, size, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const u = SU(), srcFn = o.src || (() => [x + (Math.random() - 0.5) * 160 * u, y + (Math.random() - 0.5) * 90 * u]);
    fx().nameStr(str, x, y, size, o.rgb || [255, 236, 190], srcFn, { hold: o.hold || 3.2 });
    chime(str);
  }

  // ── 颜色 ───────────────────────────────────────────────────
  const WHITES = [[242, 238, 228], [236, 234, 226], [246, 240, 230], [232, 234, 238], [240, 236, 222]];
  const JASPER = [202, 232, 214], JASPER_D = [150, 196, 176], JASPER_T = [236, 252, 242];
  const PEARL = [248, 244, 238], PEARL_S = [218, 212, 236];
  const GOLD = [246, 206, 118], GOLD_L = [255, 234, 172], GOLD_S = [206, 146, 70], GOLD_R = [255, 244, 206];
  // 十二根基（启 21:19–20）：第一 … 第十二
  const GEM = [
    [150, 206, 176], [74, 104, 214], [120, 178, 130], [40, 176, 104], [208, 112, 92], [216, 52, 66],
    [238, 206, 86], [126, 198, 210], [232, 136, 72], [72, 168, 114], [154, 94, 180], [172, 112, 218],
  ];
  // 十二样果子
  const FRUIT = [
    [236, 72, 62], [246, 150, 52], [248, 210, 76], [186, 216, 72], [104, 200, 104], [80, 200, 186],
    [96, 152, 236], [148, 116, 226], [214, 104, 204], [240, 116, 154], [252, 244, 226], [206, 64, 96],
  ];

  // ════════════════════════════════════════════════════════════
  //  本幕的状态（只在 setup / apply / 情节里改动）
  // ════════════════════════════════════════════════════════════
  let S = fresh();
  function fresh() { return { child: false, angel: false, called: false }; }
  const FXL = [];            // 短暂的光（泪滴、叶子、光扫过墙……）：只是画面，不入存档
  let lastFound = 0;

  // ════════════════════════════════════════════════════════════
  //  树与荆棘的模型（取自伊甸的生命树：以树高为 1 的归一化坐标，y 向上为负）
  // ════════════════════════════════════════════════════════════
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
  function foliage(m, R, tiers) {
    const blobs = [];
    for (const t of tiers) {
      for (let i = 0; i < t.n; i++) {
        const a = R() * TAU, rr = i < t.n * 0.45 ? 0.72 + R() * 0.3 : Math.sqrt(R()) * 0.85;
        const x = t.cx + Math.cos(a) * t.rx * rr;
        let y = t.cy + Math.sin(a) * t.ry * rr;
        if (y > t.cy) y = t.cy + (y - t.cy) * 0.6;
        const r = t.r * (0.7 + R() * 0.6);
        const up = (t.cy - y) / t.ry;
        blobs.push({ x, y, rx: r, ry: r * (0.6 + R() * 0.22), rot: (R() - 0.5) * 0.9, tone: up > -0.35 && R() < 0.72 ? 1 : 0, rr, t });
      }
    }
    blobs.sort((a, b) => a.tone - b.tone);
    const LD = [[-0.74, -0.67], [0.74, -0.67]];
    for (const b of blobs) {
      blob(b.tone === 0 ? m.back : m.mid, b);
      if (b.tone !== 1 || b.rr < 0.45) continue;
      const dx = b.x - b.t.cx, dy = b.y - b.t.cy;
      LD.forEach((ld, k) => {
        if (dx * ld[0] + dy * ld[1] * 1.6 < b.t.rx * 0.12) return;
        blob(k ? m.hiR : m.hiL, { x: b.x + ld[0] * b.rx * 0.28, y: b.y + ld[1] * b.ry * 0.3, rx: b.rx * 0.64, ry: b.ry * 0.6, rot: b.rot });
      });
    }
    return blobs;
  }
  function mkTree(o) {
    const R = U.mulberry32(o.seed);
    const m = { trunk: new Path2D(), back: new Path2D(), mid: new Path2D(), hiL: new Path2D(), hiR: new Path2D(), fruit: [], leaves: [] };
    const tp = [];
    for (let i = 0; i <= 9; i++) {
      const t = i / 9;
      tp.push([Math.sin(t * 2.4 + o.seed * 0.37) * (o.lean || 0.02) * t, -t * o.th, o.tw * lerp(1 + 0.9 * Math.pow(1 - t, 5), 0.5, t)]);
    }
    strip(m.trunk, tp);
    strip(m.trunk, quadPts(0, -0.012, -o.tw * 1.4, -0.004, -o.tw * 2.6, 0.004, o.tw * 0.5, o.tw * 0.12, 4));
    strip(m.trunk, quadPts(0, -0.012, o.tw * 1.4, -0.004, o.tw * 2.5, 0.004, o.tw * 0.5, o.tw * 0.12, 4));
    for (const L of o.limbs || []) {
      const k = L[2] == null ? 0.82 : L[2];
      const b = tp[Math.round(k * 9)];
      const x1 = b[0] + Math.sin(L[0]) * L[1], y1 = b[1] - Math.cos(L[0]) * L[1];
      const cxp = (b[0] + x1) / 2 + Math.sin(L[0]) * L[1] * 0.08, cyp = (b[1] + y1) / 2 - L[1] * 0.16;
      strip(m.trunk, quadPts(b[0], b[1], cxp, cyp, x1, y1, o.tw * (L[3] || 0.62), o.tw * 0.16, 7));
    }
    const blobs = foliage(m, R, o.tiers);
    for (let i = 0; i < (o.fruit || 0); i++) {
      const b = blobs[Math.floor(R() * blobs.length)];
      m.fruit.push([b.x + (R() - 0.5) * b.rx * 1.3, b.y + b.ry * (0.2 + R() * 0.7), 0.8 + R() * 0.45]);
    }
    for (let i = 0; i < 16; i++) { const b = blobs[Math.floor(R() * blobs.length)]; m.leaves.push([b.x, b.y]); }
    return m;
  }
  function mkThorn(seed) {
    const R = U.mulberry32(seed);
    const p = new Path2D();
    const n = 5 + Math.floor(R() * 4);
    for (let i = 0; i < n; i++) {
      let x = (R() - 0.5) * 0.3, y = 0, a = (R() - 0.5) * 1.5;
      const len = 0.55 + R() * 0.45, segs = 4;
      p.moveTo(x, y);
      for (let k = 0; k < segs; k++) {
        a += (R() - 0.5) * 0.8;
        const l = len / segs, nx = x + Math.sin(a) * l, ny = y - Math.cos(a) * l;
        p.lineTo(nx, ny);
        const sa = a + (R() < 0.5 ? 1 : -1) * (0.9 + R() * 0.6), mx = (x + nx) / 2, my = (y + ny) / 2;
        p.moveTo(mx, my); p.lineTo(mx + Math.sin(sa) * 0.1, my - Math.cos(sa) * 0.1);
        p.moveTo(nx, ny);
        x = nx; y = ny;
      }
    }
    return p;
  }
  const MOD = {};
  function models() {
    if (!HAS_P2D || MOD.tree) return;
    MOD.tree = [
      mkTree({ seed: 31, th: 0.56, tw: 0.034, lean: 0.03,
        limbs: [[-0.95, 0.24, 0.72], [0.9, 0.26, 0.74], [-0.35, 0.3, 0.9], [0.4, 0.28, 0.92]],
        tiers: [{ cx: 0, cy: -0.63, rx: 0.42, ry: 0.12, n: 34, r: 0.07 }, { cx: 0.015, cy: -0.79, rx: 0.32, ry: 0.1, n: 26, r: 0.066 }, { cx: -0.01, cy: -0.93, rx: 0.18, ry: 0.07, n: 13, r: 0.058 }],
        fruit: 24 }),
      mkTree({ seed: 77, th: 0.54, tw: 0.035, lean: -0.03,
        limbs: [[-0.9, 0.25, 0.74], [0.95, 0.24, 0.72], [-0.4, 0.28, 0.9], [0.35, 0.3, 0.9]],
        tiers: [{ cx: 0, cy: -0.62, rx: 0.42, ry: 0.12, n: 34, r: 0.07 }, { cx: -0.015, cy: -0.78, rx: 0.31, ry: 0.1, n: 25, r: 0.066 }, { cx: 0.01, cy: -0.92, rx: 0.17, ry: 0.07, n: 12, r: 0.058 }],
        fruit: 24 }),
    ];
    MOD.thorn = [mkThorn(5), mkThorn(9), mkThorn(13), mkThorn(17)];
  }
  const TREE_PAL = { trunk: [136, 124, 104], back: [40, 100, 70], mid: [78, 150, 92], hi: [196, 228, 138], rim: [255, 246, 212] };
  function lightK(x) { return clamp(0.5 + (W.core.x - x) / (W.w * 0.35), 0, 1); }
  function lightDir(x, y) {
    let dx = W.core.x - x, dy = Math.min(W.core.y - y, -W.h * 0.08);
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  }
  function paintTree(ctx, m, pal, x, y, H, g, extra, o) {
    if (g <= 0.001 || !m) return;
    o = o || {};
    const s = U.easeOut(clamp(g, 0, 1)) * H;
    if (s < 0.5) return;
    const fxs = o.fx || 1;
    const a0 = Math.min(1, g * 2.5);
    const ld = lightDir(x, y - s * 0.6);
    const k = lightK(x);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * fxs, s);
    if (o.sway) ctx.transform(1, 0, o.sway, 1, 0, 0);
    const rimA = clamp(0.35 + 0.45 * W.dusk + 0.2 * W.daylight, 0, 1);
    const off = 1.1 + 0.5 * SU();
    ctx.save();
    ctx.translate((ld[0] * off) / (s * fxs), (ld[1] * off) / s);
    ctx.globalAlpha = a0 * rimA;
    ctx.fillStyle = W.shadeCSS(pal.rim, 0, null, 0.3 + extra);
    ctx.fill(m.trunk); ctx.fill(m.back); ctx.fill(m.mid);
    ctx.restore();
    ctx.globalAlpha = a0;
    ctx.fillStyle = W.shadeCSS(pal.trunk, 0, null, extra); ctx.fill(m.trunk);
    ctx.fillStyle = W.shadeCSS(pal.back, 0, null, extra); ctx.fill(m.back);
    ctx.fillStyle = W.shadeCSS(pal.mid, 0, null, extra); ctx.fill(m.mid);
    const hiA = a0 * (0.55 + 0.35 * W.daylight);
    ctx.fillStyle = W.shadeCSS(pal.hi, 0, null, extra + 0.06);
    ctx.globalAlpha = hiA * (1 - k); ctx.fill(m.hiL);
    ctx.globalAlpha = hiA * k; ctx.fill(m.hiR);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  几何：城、河、树、帐幕、晨星、初与终的环（像素）
  // ════════════════════════════════════════════════════════════
  // 城的楼宇（归一化：u 沿正面的墙 0..1，高以城宽计）——四排，由后往前画；间或一座细高的楼
  const BLD = (function () {
    const R = U.mulberry32(2112), out = [];
    for (let r = 3; r >= 0; r--) {
      const inset = 0.03 + r * 0.07, u1 = 1 - inset;
      let u = inset;
      while (u < u1 - 0.015) {
        const tower = R() < 0.13;
        const w = Math.min(tower ? 0.022 + R() * 0.01 : 0.04 + R() * 0.045, u1 - u);
        const mid = 1 - Math.abs(u + w / 2 - 0.5) * 2;
        const h = tower ? 0.09 + R() * 0.05 + mid * 0.03 : (0.03 + R() * 0.04) * (0.7 + 0.8 * mid) + r * 0.008;
        out.push({ r, u, w, h, tone: R(), win: R(), tower });
        u += w + 0.003 + R() * 0.01;
      }
    }
    return out;
  })();
  function cityG() {
    const x0 = X.city0 * W.w, x1 = X.city1 * W.w, Wc = x1 - x0, cx = (x0 + x1) / 2;
    const ds = X.side * W.w, dz = 0.05 * Wc;
    // 城脚：正面跨度上最低的地面（城总是立在山上，不悬在水上）
    let yL = 0;
    for (let i = 0; i <= 12; i++) yL = Math.max(yL, Math.min(gB(1, lerp(X.city0, X.city1, i / 12)), W.waterlineY(1) - 0.004 * W.h));
    yL += 0.002 * W.h;
    const e = U.easeOut(clamp(lv('ncCity'), 0, 1));
    const off = -(1 - e) * (yL + 0.1 * W.h);
    const yB = yL + off;                          // 地面
    const tall = PORT ? 1.4 : 1, Hs = Wc * tall;    // 竖屏的手机上城高些（画面窄而高）
    const Hw = 0.15 * Hs, Fh = 0.5 * Hw, fb = Fh / 12;
    const yW = yB - Fh;                           // 墙脚（十二根基之上）
    const rowY = r => yW - Hw * 0.88 - r * 0.045 * Hs;
    const rowX = r => -r * 0.2 * ds;
    const tx = cx, ty = rowY(3.4) - 0.2 * Hs;
    const gw = 0.058 * Wc, gh = 0.7 * Hw;
    const gates = [0.2, 0.5, 0.8].map(u => ({ x: x0 + u * Wc, y: yW, w: gw, h: gh }));
    return { x0, x1, Wc, Hs, cx, ds, dz, yL, yB, yW, off, Hw, Fh, fb, rowY, rowX, tx, ty, gw, gh, gates, e };
  }
  const throneXY = () => { const G = cityG(); return [G.tx, G.ty]; };
  // 近地上的河：自岭线（正门之下）弯弯地流到众人脚前、流向画面的左下
  function riverNear() {
    const rx = X.rx, g = gY(2, rx), H = W.h, d = Math.max(4, H - g);
    const P = [[rx * W.w, g], [(rx + 0.035) * W.w, g + d * 0.42], [(rx - 0.085) * W.w, g + d * 0.58], [(rx - 0.15) * W.w, H + 8]];
    return { P, g, w0: 0.2 * PH(2), w1: 0.95 * PH(2) };
  }
  function bez(P, t) {
    const a = (1 - t) * (1 - t) * (1 - t), b = 3 * (1 - t) * (1 - t) * t, c = 3 * (1 - t) * t * t, d = t * t * t;
    return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]];
  }
  // 神的帐幕：荣耀的云自正门降到人中间（x 为河所出之处，正在正门之下），张开覆庇众人
  function tentG() {
    const x = X.rx * W.w, g = gY(2, X.rx), ph = PH(2);
    const x0 = X.cA0 * W.w, x1 = X.cB1 * W.w;
    return { x, g, ph, cx: (x0 + x1) / 2, half: (x1 - x0) / 2 + ph * 0.2, top: g - 2.4 * ph };
  }
  // 那云的一团团（确定的）：[沿云的位置 −1…1, 大小, 明暗, 相位]
  const TPUFF = (function () {
    const R = U.mulberry32(2103), out = [];
    for (let i = 0; i < 17; i++) out.push([(i / 16) * 2 - 1 + (R() - 0.5) * 0.06, R(), R(), R() * TAU]);
    return out;
  })();
  function treeG(i) { const xf = i ? X.treeR : X.treeL; return { x: xf * W.w, y: gY(2, xf) + 1, H: X.treeH * PH(2) }; }
  function starPt() {
    const t = U.easeInOut(clamp(lv('ncStar'), 0, 1));
    const P0 = PORT ? [0.14, 0.6] : [0.1, 0.6], P1 = PORT ? [0.25, 0.44] : [0.2, 0.17];
    return [lerp(P0[0], P1[0], t) * W.w, lerp(P0[1], P1[1], t) * W.h - Math.sin(Math.PI * t) * 0.03 * W.h];
  }
  function ringG() {
    return PORT ? { cx: 0.5 * W.w, cy: 0.455 * W.h, rx: 0.26 * W.w, ry: 0.055 * W.h, size: Math.max(0.03 * M(), 0.1 * M()) }
      : { cx: 0.52 * W.w, cy: 0.25 * W.h, rx: 0.16 * W.w, ry: 0.11 * W.h, size: Math.max(0.03 * M(), 0.085 * M()) };
  }
  // 荆棘所在（近地上：x 比例，深处 v）
  const THORNS_D = [[0.455, 0.42], [0.53, 0.66], [0.6, 0.3], [0.685, 0.55], [0.845, 0.36], [0.93, 0.68], [0.64, 0.84]];
  const THORNS_P = [[0.47, 0.5], [0.56, 0.72], [0.66, 0.36], [0.83, 0.5], [0.93, 0.74]];
  const thornPts = () => (PORT ? THORNS_P : THORNS_D).map((q, i) => { const g = gY(2, q[0]); return { x: q[0] * W.w, y: g + q[1] * (W.h - g) * 0.9, s: 0.5 * PH(2) * (0.8 + 0.5 * q[1]), i }; });

  // ════════════════════════════════════════════════════════════
  //  画：天
  // ════════════════════════════════════════════════════════════
  // 先前的天：灰色的书卷，自当中向两边卷起
  function drawOld(ctx) {
    const k = lv('ncOld');
    if (k < 0.003) return;
    const open = 1 - k, hz = W.horizonY + 2, cx = W.w * 0.5;
    const gap = open * W.w * 0.58;
    const lx = cx - gap, rx = cx + gap;
    ctx.save();
    const g = ctx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, 'rgba(56,60,72,0.82)'); g.addColorStop(0.6, 'rgba(82,86,96,0.72)'); g.addColorStop(1, 'rgba(108,110,116,0.56)');
    ctx.fillStyle = g;
    if (lx > 0) ctx.fillRect(-2, -2, lx + 2, hz + 2);
    if (rx < W.w) ctx.fillRect(rx, -2, W.w - rx + 2, hz + 2);
    // 卷起的边：一根渐粗的书卷（圆柱：迎光的一面亮，背光的一面暗），卷外的天上有一道淡影
    if (open > 0.002) {
      const rw = (4 + 22 * Math.sqrt(open)) * SU();
      for (const [ex, dir] of [[lx, -1], [rx, 1]]) {
        if (ex < -rw * 2 || ex > W.w + rw * 2) continue;
        const x1 = ex + dir * rw;
        const gr = ctx.createLinearGradient(ex, 0, x1, 0);
        gr.addColorStop(0, 'rgba(120,118,116,0.95)'); gr.addColorStop(0.18, 'rgba(214,208,198,0.95)');
        gr.addColorStop(0.45, 'rgba(160,156,150,0.95)'); gr.addColorStop(1, 'rgba(62,64,72,0.95)');
        ctx.fillStyle = gr;
        ctx.fillRect(Math.min(ex, x1), -2, Math.abs(x1 - ex), hz + 2);
        const sh = ctx.createLinearGradient(ex, 0, ex - dir * rw * 0.8, 0);
        sh.addColorStop(0, 'rgba(20,24,36,0.28)'); sh.addColorStop(1, 'rgba(20,24,36,0)');
        ctx.fillStyle = sh;
        ctx.fillRect(Math.min(ex, ex - dir * rw * 0.8), -2, rw * 0.8, hz + 2);
      }
    }
    ctx.restore();
  }
  // 新天：珍珠与金的光自高天洒下；日落之后，神的荣耀光照（ncShine）
  function drawNewSky(ctx) {
    const k = lv('ncSky'), gl = lv('ncGlory'), sh = lv('ncShine');
    if (k < 0.003 && gl < 0.003) return;
    sprites(); ctxA = ctx;
    const hz = W.horizonY;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const topK = PORT ? 0.4 : 1;
    const g = ctx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, 'rgba(255,232,196,' + ((0.08 + 0.05 * sh) * k * topK).toFixed(3) + ')');
    g.addColorStop(0.5, 'rgba(255,238,210,' + ((0.07 + 0.06 * sh) * k).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(255,244,224,' + ((0.15 + 0.1 * sh) * k).toFixed(3) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W.w, hz + 1);
    // 几道极淡的光，自高天当中斜斜洒下
    const ox = W.w * 0.55, oy = -W.h * 0.3, L = Math.hypot(W.w, W.h) * 1.2;
    ctx.fillStyle = 'rgb(255,244,220)';
    for (let i = 0; i < 5; i++) {
      const a = Math.PI / 2 + (i - 2) * 0.26 + Math.sin(W.t * 0.05 + i * 1.7) * 0.03;
      const wd = 0.03 + 0.015 * hsh(i + 3);
      ctx.globalAlpha = (0.022 + 0.012 * Math.sin(W.t * 0.3 + i * 2.1)) * k * (i === 2 ? topK : 1);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(a - wd) * L, oy + Math.sin(a - wd) * L);
      ctx.lineTo(ox + Math.cos(a + wd) * L, oy + Math.sin(a + wd) * L);
      ctx.closePath(); ctx.fill();
    }
    // 神的荣耀光照：城的上空一片温和的金光
    if (sh > 0.003 && lv('ncCity') > 0.9) {
      const G = cityG();
      glowAt(SP.warm, G.tx, G.ty - G.Wc * 0.1, G.Wc * 0.95, 0.18 * sh, 0.7);
    }
    // 末了：东方大放光明（他必快来）
    if (gl > 0.003) {
      const ex = W.w * (PORT ? 0.1 : 0.1), ey = W.h * (PORT ? 0.5 : 0.4);
      glowAt(SP.warm, ex, ey, Math.hypot(W.w, W.h) * 0.42, 0.4 * gl);
      glowAt(SP.white, ex, ey, M() * 0.16, 0.5 * gl);
      ctx.fillStyle = 'rgb(255,246,226)';
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI * 0.5 + i * 0.22 + Math.sin(W.t * 0.08 + i) * 0.02, wd = 0.025 + 0.01 * hsh(i + 20);
        ctx.globalAlpha = (0.03 + 0.015 * Math.sin(W.t * 0.4 + i * 1.3)) * gl;
        ctx.beginPath(); ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(a - wd) * L, ey + Math.sin(a - wd) * L);
        ctx.lineTo(ex + Math.cos(a + wd) * L, ey + Math.sin(a + wd) * L);
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 天开了一道门：城由此降下
  function drawOpen(ctx) {
    const k = lv('ncOpen');
    if (k < 0.004) return;
    const G = cityG();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.white, G.cx, W.h * 0.02, G.Wc * 0.45, 0.6 * k, 0.45);
    glowAt(SP.gold, G.cx, W.h * 0.04, G.Wc * 0.9, 0.32 * k, 0.4);
    const top = W.h * 0.02, bot = Math.max(top + 10, G.yW - G.Hw);
    ctx.globalAlpha = 0.18 * k;
    ctx.drawImage(SP.beam, G.cx - G.Wc * 0.36, top, G.Wc * 0.72, bot - top);
    ctx.restore();
  }
  // 初与终连成一环
  function drawRing(ctx) {
    const a = lv('ncRingA'), s = lv('ncRing');
    if (a < 0.005 || s < 0.005) return;
    const R = ringG();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const a0 = Math.PI, a1 = Math.PI + TAU * clamp(s, 0, 1);
    for (const [wd, al, col] of [[12, 0.1, 'rgb(255,214,150)'], [4.5, 0.26, 'rgb(255,232,186)'], [1.6, 0.8, 'rgb(255,250,236)']]) {
      ctx.strokeStyle = col; ctx.globalAlpha = al * a; ctx.lineWidth = wd * SU();
      ctx.beginPath(); ctx.ellipse(R.cx, R.cy, R.rx, R.ry, 0, a0, a1); ctx.stroke();
    }
    if (s < 0.999) {
      const px = R.cx + Math.cos(a1) * R.rx, py = R.cy + Math.sin(a1) * R.ry;
      glowAt(SP.white, px, py, 14 * SU(), a);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 明亮的晨星：一颗清亮的星，四道长芒、四道短芒
  function drawStar(ctx) {
    const k = lv('ncStarA');
    if (k < 0.005) return;
    const [x, y] = starPt(), u = SU(), tw = 0.9 + 0.1 * Math.sin(W.t * 2.7) * Math.sin(W.t * 1.3);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.rose, x, y, 90 * u * tw, 0.24 * k);
    glowAt(SP.pale, x, y, 34 * u * tw, 0.65 * k);
    glowAt(SP.white, x, y, 9 * u, Math.min(1, k * 1.3));
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + Math.PI / 2, long = i % 2 === 0, L = (long ? 30 : 12) * u * tw;
      const gr = ctx.createLinearGradient(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L);
      gr.addColorStop(0, 'rgba(250,250,255,' + (k * (long ? 0.75 : 0.45)).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(250,250,255,0)');
      ctx.strokeStyle = gr; ctx.globalAlpha = 1;
      ctx.lineWidth = Math.max(0.8, (long ? 1.8 : 1.1) * u);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：海不再有——明如水晶的光原（在海的每一段之上；大地随后盖住它）
  // ════════════════════════════════════════════════════════════
  const GLINT = [];
  for (let i = 0; i < 70; i++) GLINT.push([hsh(i * 1.37 + 0.2), hsh(i * 2.91 + 5.1), hsh(i * 4.7 + 1.3)]);
  // 光原：如蓝宝石的平台，明净如天（出 24:10 的回声）——近地平线处是珍珠的亮，往近处渐深
  function plainCols() {
    const d = clamp(W.daylight, 0, 1), gl = lv('ncGlory') * 0.6 + lv('ncShine') * 0.35;
    const warm = (c, t) => [Math.min(255, c[0] + 26 * t), Math.min(255, c[1] + 14 * t), c[2]];
    return {
      c0: warm(mix([60, 62, 84], [238, 234, 226], d), gl), c1: warm(mix([44, 48, 72], [170, 176, 206], d), gl),
      c2: warm(mix([32, 36, 60], [104, 114, 160], d), gl * 0.7), c3: warm(mix([20, 24, 44], [54, 62, 106], d), gl * 0.5),
    };
  }
  // 玻璃的铺地：几道向地平线收拢的淡线、几道横线（没有浪）
  function drawPave(ctx, y0, yb, k) {
    const hz = W.horizonY, H = W.h, vx = W.w * (PORT ? 0.4 : 0.3), rh = H - hz;
    ctx.save();
    ctx.lineWidth = Math.max(0.6, 0.7 * SU());
    ctx.strokeStyle = 'rgb(255,240,210)';
    const gr = ctx.createLinearGradient(0, hz, 0, H);
    gr.addColorStop(0, 'rgba(255,240,210,0)'); gr.addColorStop(0.35, 'rgba(255,240,210,' + (0.05 * k).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,240,210,' + (0.09 * k).toFixed(3) + ')');
    ctx.strokeStyle = gr;
    ctx.beginPath();
    for (let i = -14; i <= 22; i++) { const bx = vx + i * W.w * 0.09; ctx.moveTo(vx + (bx - vx) * 0.004, hz); ctx.lineTo(bx, H); }
    ctx.stroke();
    for (let j = 1; j <= 9; j++) {
      const y = hz + rh * Math.pow(j / 9, 1.9);
      if (y < y0 || y > yb) continue;
      ctx.globalAlpha = (0.02 + 0.07 * (j / 9)) * k;
      ctx.fillStyle = 'rgb(255,240,210)';
      ctx.fillRect(0, y, W.w, Math.max(0.6, 0.7 * SU()));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 光原的底（渐变与铺地的线）先画在一张离屏的画布上，颜色或大小变了才重画
  const PB = { key: '', cv: null };
  function plainBase(k) {
    const hz = W.horizonY, H = W.h, rh = Math.max(2, Math.round(H - hz)), w = Math.max(2, Math.round(W.w));
    const q = v => Math.round(v * 24);
    const key = [w, rh, PORT ? 1 : 0, q(W.daylight), q(lv('ncGlory')), q(lv('ncShine')), q(Math.min(1, k))].join('|');
    if (PB.key === key && PB.cv) return PB.cv;
    try {
      const cv = PB.cv && PB.cv.width === w && PB.cv.height === rh ? PB.cv : cnv(w, rh), g = cv.getContext('2d');
      g.clearRect(0, 0, w, rh);
      const Cc = plainCols(), gr = g.createLinearGradient(0, 0, 0, rh);
      gr.addColorStop(0, rgba(Cc.c0, 1)); gr.addColorStop(0.05, rgba(Cc.c1, 1)); gr.addColorStop(0.32, rgba(Cc.c2, 1)); gr.addColorStop(1, rgba(Cc.c3, 1));
      g.fillStyle = gr; g.fillRect(0, 0, w, rh);
      g.save(); g.translate(0, -hz); drawPave(g, hz, H, Math.min(1, k)); g.restore();
      PB.cv = cv; PB.key = key;
    } catch (e) { return null; }
    return PB.cv;
  }
  function drawPlain(ctx, pass) {
    const k = lv('ncSea');
    if (k < 0.003) return;
    const hz = W.horizonY, fw = W.waterlineY(0), mw = W.waterlineY(1), H = W.h;
    let y0, y1;
    if (pass === 'seaFar') { y0 = hz - 1; y1 = fw + 2; } else if (pass === 'seaMid') { y0 = fw - 1; y1 = mw + 2; } else { y0 = mw - 1; y1 = H + 2; }
    const front = hz + (H + 24 - hz) * U.easeInOut(clamp(k, 0, 1));
    const yb = Math.min(y1, front);
    ctx.save();
    if (yb > y0) {
      const rh = H - hz;
      ctx.beginPath(); ctx.rect(0, y0, W.w, yb - y0); ctx.clip();
      const cv = plainBase(k);
      if (cv) ctx.drawImage(cv, 0, 0, cv.width, cv.height, 0, hz, W.w, rh);
      sprites(); ctxA = ctx;
      ctx.globalCompositeOperation = 'lighter';
      // 光原上的光：天上的光核与城的荣光映在其中（如镜，却没有浪）
      glowAt(SP.warm, W.core.x, hz + rh * 0.04, W.w * 0.2, 0.12 * W.daylight, 0.3);
      const cg = lv('ncGlow') * sm(0.9, 1, lv('ncCity'));
      if (cg > 0.01) { const G = cityG(); glowAt(SP.gold, G.cx, mw + rh * 0.04, G.Wc * 0.55, 0.3 * cg, 0.3); }
      // 水晶的微光：一点一点慢慢地亮（四芒的小星，不是浪花）
      ctx.fillStyle = 'rgb(255,250,236)';
      for (let i = 0; i < GLINT.length; i++) {
        const q = GLINT[i], y = lerp(hz + 3, H, Math.pow(q[1], 1.3));
        if (y < y0 || y > yb) continue;
        const x = q[0] * W.w;
        const tw = 0.5 + 0.5 * Math.sin(W.t * (0.4 + 0.7 * q[2]) + q[2] * 40);
        if (tw < 0.6) continue;
        const dep = W.seaDepth(y), s = (1.2 + 3.2 * dep) * SU(), al = 0.34 * (tw - 0.6) / 0.4 * k;
        ctx.globalAlpha = al;
        ctx.fillRect(x - s, y - 0.4, s * 2, 0.8);
        ctx.fillRect(x - 0.4, y - s * 0.6, 0.8, s * 1.2);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      // 生命水的河流过光原（中丘之下 → 近地的岭线）
      if (pass === 'seaNear') drawRiverCross(ctx);
    }
    ctx.restore();
    // 正在化成光原的那一道边
    if (k < 0.999 && front >= y0 && front <= y1) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const s = 12 * SU();
      const gr = ctx.createLinearGradient(0, front - s, 0, front + 4 * SU());
      gr.addColorStop(0, 'rgba(255,246,222,0)'); gr.addColorStop(0.75, 'rgba(255,246,222,0.42)'); gr.addColorStop(1, 'rgba(255,246,222,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, front - s, W.w, s + 4 * SU());
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：圣城新耶路撒冷
  // ════════════════════════════════════════════════════════════
  const FACE = [[250, 236, 204], [246, 228, 190], [252, 242, 218]], SIDE = [222, 194, 146], ROOF = [255, 248, 230];
  const JAS_T = [240, 250, 242], JAS_B = [198, 224, 210], JAS_S = [176, 206, 192];
  // 城后的光晕（远山的一层之后：照亮城背后的天与远山）
  function drawCityHalo(ctx) {
    const c = lv('ncCity');
    if (c < 0.004) return;
    const G = cityG(), k = sm(0, 0.3, c) * (0.4 + 0.6 * lv('ncGlow'));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctxA = ctx;
    glowAt(SP.gold, G.cx - G.ds * 0.5, G.yW - G.Hw - G.Wc * 0.12, G.Wc * 0.85, 0.2 * k, 0.62);
    ctx.restore();
  }
  // 平行四边形（城的左面，面向画面当中）：u 0 远端 → 1 近端，v 0 墙脚 → 1 墙顶
  function sideT(ctx, G) { ctx.transform(G.ds, G.dz, 0, -G.Hw, G.x0 - G.ds, G.yW - G.dz); }
  function archPath(ctx, x, yb, w, h) {
    const r = w / 2;
    ctx.moveTo(x - r, yb); ctx.lineTo(x - r, yb - h + r);
    ctx.arc(x, yb - h + r, r, Math.PI, 0);
    ctx.lineTo(x + r, yb); ctx.closePath();
  }
  function archPathUV(ctx, u, w, h) {
    const r = w / 2;
    ctx.moveTo(u - r, 0); ctx.lineTo(u - r, h - r * 0.9);
    ctx.quadraticCurveTo(u - r, h + r * 0.3, u, h + r * 0.3);
    ctx.quadraticCurveTo(u + r, h + r * 0.3, u + r, h - r * 0.9);
    ctx.lineTo(u + r, 0); ctx.closePath();
  }
  function pearlFill(ctx, K, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, rgba(litC([252, 250, 246], K), 1)); g.addColorStop(0.4, rgba(litC([232, 228, 242], K), 1));
    g.addColorStop(0.7, rgba(litC([248, 236, 238], K), 1)); g.addColorStop(1, rgba(litC([232, 240, 246], K), 1));
    return g;
  }
  function tower(ctx, K, x, yb, w, h) {
    ctx.fillStyle = rgba(litC(mix(JAS_B, JAS_T, 0.4), K), 1);
    ctx.fillRect(x - w / 2, yb - h, w, h);
    ctx.fillStyle = rgba(litC(JAS_S, K), 1);
    ctx.fillRect(x - w / 2, yb - h, w * 0.28, h);
    ctx.fillStyle = rgba(litC(JAS_T, K * 1.02), 1);
    ctx.fillRect(x - w / 2 - w * 0.08, yb - h - w * 0.16, w * 1.16, w * 0.2);
  }
  function drawCity(ctx) {
    const c = lv('ncCity');
    if (c < 0.004) return;
    const G = cityG();
    sprites();
    ctxA = ctx;
    const K = clamp(0.74 + 0.26 * W.daylight, 0.5, 1) * (1 + 0.03 * lv('ncGlow'));
    const glowK = lv('ncGlow'), gold = lv('ncGold'), wall = lv('ncWall');
    const a = sm(0, 0.12, c);
    ctx.save();
    ctx.globalAlpha = a;
    // —— 城内：一排一排精金的楼宇（如明净的玻璃），渐高渐远，当中最高处是宝座的光 ——
    const bx = b => G.x0 + G.rowX(b.r) + b.u * G.Wc, by = b => G.rowY(b.r);
    ctx.fillStyle = rgba(litC(SIDE, K), 1);
    ctx.beginPath();
    for (const b of BLD) { const x = bx(b), y = by(b), h = b.h * G.Hs, sw = 0.01 * G.Wc; ctx.moveTo(x, y); ctx.lineTo(x - sw, y - sw * 0.5); ctx.lineTo(x - sw, y - h - sw * 0.5); ctx.lineTo(x, y - h); ctx.closePath(); }
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = rgba(litC(FACE[i], K), 1);
      ctx.beginPath();
      for (const b of BLD) if (Math.min(2, Math.floor(b.tone * 3)) === i) ctx.rect(bx(b), by(b) - b.h * G.Hs, b.w * G.Wc, b.h * G.Hs);
      ctx.fill();
    }
    ctx.fillStyle = rgba(litC(ROOF, K), 1);
    ctx.beginPath();
    for (const b of BLD) { const x = bx(b), y = by(b) - b.h * G.Hs, w = b.w * G.Wc, d = 0.01 * G.Wc; ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - d, y - d * 0.5); ctx.lineTo(x - d, y - d * 0.5); ctx.closePath(); }
    ctx.fill();
    // 如明净的玻璃：每座楼一道竖的亮光；窗里是温和的光
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,248,226)';
    for (const b of BLD) {
      const x = bx(b), y = by(b), h = b.h * G.Hs, w = b.w * G.Wc;
      ctx.globalAlpha = a * (0.07 + 0.08 * glowK + 0.08 * gold);
      ctx.fillRect(x + w * (0.6 + 0.25 * b.win), y - h, Math.max(1, w * 0.1), h);
      ctx.globalAlpha = a * (0.16 + 0.2 * glowK) * (0.8 + 0.2 * Math.sin(W.t * 0.9 + b.win * 30));
      const ww = Math.max(1, w * (b.tower ? 0.3 : 0.12)), wh = Math.max(1.5, h * (b.tower ? 0.12 : 0.22));
      ctx.fillRect(x + w * (b.tower ? 0.35 : 0.22), y - h * 0.62, ww, wh);
      if (!b.tower && w > 0.06 * G.Wc) ctx.fillRect(x + w * 0.55, y - h * 0.62, ww, wh);
    }
    // 精金的街道：各排楼前一道金光（「城内的街道是精金」）
    if (gold > 0.01) {
      ctx.fillStyle = 'rgb(255,222,140)';
      for (let r = 0; r < 4; r++) {
        const y = G.rowY(r), x0 = G.x0 + G.rowX(r) + (0.03 + r * 0.07) * G.Wc, x1 = G.x0 + G.rowX(r) + (1 - 0.03 - r * 0.07) * G.Wc;
        ctx.globalAlpha = a * gold * 0.4;
        ctx.fillRect(x0, y - 1 * SU(), x1 - x0, 2 * SU());
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    drawThrone(ctx, G, a);
    ctx.globalAlpha = a;
    drawRiverCity(ctx, G, a);
    ctx.globalAlpha = a;
    // —— 左面的墙（碧玉）与三个门 ——
    ctx.save();
    sideT(ctx, G);
    const sg = ctx.createLinearGradient(0, 1, 0, 0);
    sg.addColorStop(0, rgba(litC(mix(JAS_S, JAS_T, 0.35 + 0.3 * wall), K * 0.95), 1)); sg.addColorStop(1, rgba(litC(mix(JAS_S, JAS_B, 0.6), K * 0.9), 1));
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, 1, 0.97);
    ctx.fillStyle = rgba(litC(JAS_T, K), 1);
    ctx.fillRect(0, 0.94, 1, 0.05);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); archPathUV(ctx, 0.22 + i * 0.28, 0.1, 0.66);
      ctx.fillStyle = pearlFill(ctx, K * 0.94, 0, 0, 1, 0.6); ctx.fill();
    }
    // 根基（左面）
    for (let j = 0; j < 12; j++) {
      const lit = clamp(lv('ncFound') - j, 0, 1), v0 = -(12 - j) * (G.fb / G.Hw), v1 = v0 + G.fb / G.Hw;
      ctx.fillStyle = rgba(litC(mix(mix(GEM[j], [236, 232, 222], 0.66), mix(GEM[j], [250, 248, 240], 0.3), lit), K * 0.9), 1);
      ctx.fillRect(0, v0, 1, v1 - v0 + 0.004);
    }
    ctx.restore();
    // —— 正面的墙：碧玉，明如水晶 ——
    const wx0 = G.x0, wx1 = G.x1, wy0 = G.yW - G.Hw, wy1 = G.yW;
    const wg = ctx.createLinearGradient(0, wy0, 0, wy1);
    wg.addColorStop(0, rgba(litC(mix(JAS_T, [250, 255, 248], 0.12 * wall), K), 1)); wg.addColorStop(1, rgba(litC(mix(JAS_B, JAS_T, 0.15 * wall), K), 1));
    ctx.fillStyle = wg;
    ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    // 水晶的石缝：几道极淡的竖线
    ctx.fillStyle = rgba(litC([255, 255, 252], K), 0.35);
    for (let i = 1; i < 16; i++) ctx.fillRect(wx0 + (i / 16) * (wx1 - wx0), wy0 + G.Hw * 0.08, 1, G.Hw * 0.9);
    ctx.fillStyle = rgba(litC(JAS_T, K * 1.02), 1);
    ctx.fillRect(wx0, wy0 - 0.01 * G.Wc, wx1 - wx0, 0.012 * G.Wc);
    // 城角与门楼
    const tw = 0.034 * G.Wc;
    tower(ctx, K, wx0 + tw * 0.5, wy1, tw, G.Hw * 1.3);
    tower(ctx, K, wx1 - tw * 0.5, wy1, tw, G.Hw * 1.3);
    for (const q of G.gates) { const d = q.w / 2 + tw * 0.62; tower(ctx, K, q.x - d, wy1, tw * 0.8, G.Hw * 1.18); tower(ctx, K, q.x + d, wy1, tw * 0.8, G.Hw * 1.18); }
    // 墙上水晶的微光（如新妇的妆饰）
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,255,246)';
    for (let i = 0; i < 22; i++) {
      const q = hsh(i * 3.1 + 7), r2 = hsh(i * 5.3 + 1), tw2 = 0.5 + 0.5 * Math.sin(W.t * (0.8 + r2) + i * 2.3);
      if (tw2 < 0.62) continue;
      ctx.globalAlpha = a * (tw2 - 0.62) * (1.2 + 0.8 * wall);
      const s = (1 + 1.3 * r2) * SU(), px = wx0 + q * (wx1 - wx0), py = wy0 + (0.12 + 0.76 * r2) * G.Hw;
      ctx.fillRect(px - s, py - 0.4, s * 2, 0.8 * SU());
      ctx.fillRect(px - 0.4, py - s, 0.8 * SU(), s * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    // —— 正面的三个珍珠门 ——
    const open = lv('ncGateOpen'), gates = lv('ncGates');
    G.gates.forEach((q, i) => {
      ctx.beginPath(); archPath(ctx, q.x, q.y, q.w, q.h);
      ctx.fillStyle = pearlFill(ctx, K, q.x - q.w / 2, q.y - q.h, q.x + q.w / 2, q.y);
      ctx.fill();
      // 敞开的门：里面是精金的街与光
      if (open > 0.01) {
        ctx.save();
        ctx.beginPath(); archPath(ctx, q.x, q.y, q.w * 0.8 * open, q.h * 0.94);
        ctx.clip();
        const ig = ctx.createLinearGradient(0, q.y - q.h, 0, q.y);
        ig.addColorStop(0, rgba([255, 246, 220], 0.95)); ig.addColorStop(1, rgba([255, 214, 136], 0.95));
        ctx.globalAlpha = a * open;
        ctx.fillStyle = ig; ctx.fillRect(q.x - q.w, q.y - q.h, q.w * 2, q.h);
        if (i === 1) drawRiverGate(ctx, G, q);
        ctx.restore();
        ctx.globalAlpha = a;
      }
      // 珍珠的门框
      const rim = Math.max(1.2, 0.012 * G.Wc);
      ctx.lineWidth = rim;
      ctx.strokeStyle = rgba(litC([252, 250, 246], K), 1);
      ctx.beginPath(); archPathOpen(ctx, q.x, q.y, q.w + rim, q.h + rim * 0.5); ctx.stroke();
      if (gates > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.white, q.x, q.y - q.h * 0.5, q.w * 1.25, 0.22 * gates * (0.85 + 0.15 * Math.sin(W.t * 1.2 + i)));
        // 门上的天使：一点人形的光
        lightFigure(ctx, q.x, q.y - q.h - 0.06 * G.Hw, 0.3 * G.Hw, a * gates * 0.85, i * 3.3);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a;
      }
    });
    // —— 十二根基（正面）：自下而上第一至第十二，宝石的颜色 ——
    const fnd = lv('ncFound');
    for (let j = 0; j < 12; j++) {
      const lit = clamp(fnd - j, 0, 1), y0 = G.yW + (11 - j) * G.fb;
      ctx.fillStyle = rgba(litC(mix(mix(GEM[j], [236, 232, 222], 0.66), mix(GEM[j], [250, 248, 240], 0.3), lit), K), 1);
      ctx.fillRect(G.x0, y0, G.Wc, G.fb + 0.6);
      if (lit > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rgba(mix(GEM[j], [255, 255, 255], 0.6), 0.28 * lit);
        ctx.fillRect(G.x0, y0, G.Wc, Math.max(0.8, G.fb * 0.25));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // —— 河自正门流出，流过根基，流下山坡 ——
    drawRiverHill(ctx, G, a);
    // —— 城的荣光（在城之上，柔和的一层）与光扫过碧玉的墙 ——
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, G.cx, G.yW - G.Hw * 1.1, G.Wc * 0.5, (0.03 + 0.05 * glowK + 0.03 * gold) * a, 0.45);
    for (const f of FXL) if (f.k === 'sweep') {
      const p = clamp((W.t - f.t0) / f.dur, 0, 1), sx = lerp(wx0 - 0.1 * G.Wc, wx1 + 0.1 * G.Wc, p);
      const sw = ctx.createLinearGradient(sx - 0.07 * G.Wc, 0, sx + 0.07 * G.Wc, 0);
      sw.addColorStop(0, 'rgba(255,255,240,0)'); sw.addColorStop(0.5, 'rgba(255,255,240,' + (0.32 * Math.sin(Math.PI * p)).toFixed(3) + ')'); sw.addColorStop(1, 'rgba(255,255,240,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = sw; ctx.fillRect(wx0, wy0 - 0.012 * G.Wc, wx1 - wx0, G.Hw + 0.012 * G.Wc + G.Fh);
    }
    ctx.globalCompositeOperation = 'source-over';
    // —— 降下时围着城的光纱 ——
    const veil = lv('ncVeil');
    if (veil > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.pale, G.cx, G.yW - G.Hw, G.Wc * 0.7, 0.35 * veil, 0.6);
      ctx.fillStyle = 'rgb(255,252,240)';
      for (let i = 0; i < 30; i++) {
        const q = hsh(i * 1.7 + 3), r2 = hsh(i * 2.3 + 9), tw2 = 0.5 + 0.5 * Math.sin(W.t * 2 + i);
        ctx.globalAlpha = veil * tw2 * 0.8;
        const x = G.x0 - G.ds + q * (G.Wc + G.ds * 2), y = G.yW - G.Hw * (0.2 + 2.2 * r2);
        ctx.fillRect(x - 1, y - 1, 2 * SU(), 2 * SU());
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function archPathOpen(ctx, x, yb, w, h) {
    const r = w / 2;
    ctx.moveTo(x - r, yb); ctx.lineTo(x - r, yb - h + r);
    ctx.arc(x, yb - h + r, r, Math.PI, 0);
    ctx.lineTo(x + r, yb);
  }
  // 宝座：只是光（没有形像）——一柱柔光、一点极亮的光心、一圈极淡的如绿宝石的虹
  function drawThrone(ctx, G, a) {
    const gk = lv('ncGlow'), face = lv('ncFace');
    const x = G.tx, y = G.ty, R = G.Wc;
    ctx.save();
    // 宝座所在的高处：三层精金的台阶（城中最高处）
    const K = clamp(0.74 + 0.26 * W.daylight, 0.5, 1);
    const base = G.rowY(3) - 0.02 * R;
    for (let i = 0; i < 3; i++) {
      const w = R * (0.16 - i * 0.045), h = (base - (y + R * 0.045)) / 3, yy = base - (i + 1) * h;
      ctx.fillStyle = rgba(litC(mix(FACE[2], [255, 250, 236], 0.3 + i * 0.2), K), 1);
      ctx.fillRect(x - w / 2, yy, w, h + 0.5);
      ctx.fillStyle = rgba(litC(SIDE, K), 1);
      ctx.fillRect(x - w / 2, yy, Math.max(1, w * 0.06), h + 0.5);
    }
    ctx.globalCompositeOperation = 'lighter';
    const pulse = 0.92 + 0.08 * Math.sin(W.t * 0.8);
    glowAt(SP.warm, x, y - R * 0.12, R * (0.06 + 0.02 * gk + 0.02 * face), a * (0.2 + 0.12 * gk + 0.14 * face) * pulse, 2.4);
    glowAt(SP.gold, x, y, R * (0.15 + 0.04 * gk + 0.06 * face), a * (0.2 + 0.12 * gk + 0.16 * face) * pulse);
    glowAt(SP.white, x, y, R * (0.045 + 0.01 * gk + 0.02 * face), a * (0.7 + 0.2 * gk) * pulse);
    ctx.strokeStyle = 'rgb(170,240,200)';
    ctx.lineWidth = Math.max(0.8, 0.005 * R);
    ctx.globalAlpha = a * (0.1 + 0.08 * gk);
    ctx.beginPath(); ctx.ellipse(x, y, R * 0.08, R * 0.066, 0, 0, TAU); ctx.stroke();
    // 羔羊为城的灯：一只小小的光的羔羊
    const lk = lv('ncLamb');
    if (lk > 0.01) {
      const s = Math.max(10, 0.058 * R) * (PORT ? 1.15 : 1), lx = x, ly = y + R * 0.045;
      glowAt(SP.white, lx, ly - s * 0.45, s * 2.4, a * lk * 0.6 * pulse);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a * lk;
      drawLamb(ctx, lx, ly, s, true);
      ctx.globalCompositeOperation = 'lighter';
    }
    // 宝座下的泉源
    const sp = lv('ncSpring');
    if (sp > 0.01) glowAt(SP.aqua, x, y + R * 0.085, R * 0.08, a * sp * (0.6 + 0.3 * Math.sin(W.t * 2.2)));
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 光的羔羊（朝左，站着）：身子、头、耳、四足——只是光的剪影
  function drawLamb(ctx, x, y, s, edge) {
    // 一道淡金的轮廓，好在光里认出它的形状
    if (edge) {
      ctx.save();
      ctx.shadowColor = 'rgba(190,130,40,0.85)'; ctx.shadowBlur = Math.max(2, s * 0.18);
      ctx.fillStyle = 'rgb(255,253,246)';
      ctx.beginPath();
      ctx.ellipse(x, y - s * 0.55, s * 0.55, s * 0.32, 0, 0, TAU);
      ctx.ellipse(x - s * 0.52, y - s * 0.84, s * 0.2, s * 0.15, -0.3, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = 'rgb(255,253,246)';
    ctx.beginPath();
    ctx.ellipse(x, y - s * 0.55, s * 0.55, s * 0.32, 0, 0, TAU);
    ctx.moveTo(x - s * 0.32, y - s * 0.84);
    ctx.ellipse(x - s * 0.52, y - s * 0.84, s * 0.2, s * 0.15, -0.3, 0, TAU);
    ctx.fill();
    ctx.fillRect(x - s * 0.38, y - s * 0.4, s * 0.08, s * 0.4);
    ctx.fillRect(x - s * 0.2, y - s * 0.4, s * 0.08, s * 0.4);
    ctx.fillRect(x + s * 0.18, y - s * 0.4, s * 0.08, s * 0.4);
    ctx.fillRect(x + s * 0.34, y - s * 0.4, s * 0.08, s * 0.4);
    ctx.beginPath(); ctx.ellipse(x - s * 0.48, y - s * 0.92, s * 0.1, s * 0.05, 0.6, 0, TAU); ctx.fill();
  }

  // ── 生命水的河 ──────────────────────────────────────────────
  // 河的进度：0–0.25 城中（宝座 → 正门），0.25–0.42 山坡（正门 → 水边），0.42–0.55 光原（→ 近地的岭线），0.55–1 近地（岭线 → 众人脚前）
  const RCOL = [168, 216, 238];
  function waterStroke(ctx, pts, w0, w1, alpha) {
    if (pts.length < 2) return;
    const L = [], Rr = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], pp = pts[Math.max(0, i - 1)];
      let nx = -(q[1] - pp[1]), ny = q[0] - pp[0];
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const w = lerp(w0, w1, i / (pts.length - 1)) / 2;
      L.push([p[0] + nx * w, p[1] + ny * w]); Rr.push([p[0] - nx * w, p[1] - ny * w]);
    }
    const poly = () => {
      ctx.beginPath();
      L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      for (let i = Rr.length - 1; i >= 0; i--) ctx.lineTo(Rr[i][0], Rr[i][1]);
      ctx.closePath();
    };
    ctx.globalAlpha = alpha;
    poly();
    ctx.strokeStyle = W.shadeCSS([70, 92, 84], 0, 0.5); ctx.lineWidth = Math.max(1, 0.12 * Math.max(w0, w1)); ctx.stroke();
    ctx.fillStyle = rgba(RCOL, 0.94);
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(236,250,255)';
    ctx.lineWidth = Math.max(0.8, Math.min(w0, w1) * 0.22);
    ctx.globalAlpha = alpha * 0.5;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawRiverCity(ctx, G, a) {
    const r = lv('ncRiver');
    if (r < 0.003) return;
    const p = clamp(r / 0.25, 0, 1), y0 = G.ty + G.Wc * 0.09, y1 = G.yW - G.Hw * 0.5;
    const x0 = G.tx, x1 = G.cx;
    const pts = [];
    for (let i = 0; i <= 10; i++) { const t = (i / 10) * p; pts.push([lerp(x0, x1, t), lerp(y0, y1, t)]); }
    waterStroke(ctx, pts, 0.01 * G.Wc, 0.024 * G.Wc, a * 0.95);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.aqua, lerp(x0, x1, p), lerp(y0, y1, p), 0.04 * G.Wc, a * 0.5);
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawRiverGate(ctx, G, q) {
    const r = lv('ncRiver');
    if (r < 0.23) return;
    const k = clamp((r - 0.23) / 0.03, 0, 1), w = q.w * 0.4;
    ctx.globalAlpha = k;
    ctx.fillStyle = rgba(RCOL, 0.96);
    ctx.beginPath();
    ctx.moveTo(q.x - w * 0.3, q.y - q.h * 0.45); ctx.lineTo(q.x + w * 0.3, q.y - q.h * 0.45);
    ctx.lineTo(q.x + w * 0.5, q.y); ctx.lineTo(q.x - w * 0.5, q.y); ctx.closePath(); ctx.fill();
  }
  // 正门 → 根基 → 山坡 → 水边
  function drawRiverHill(ctx, G, a) {
    const r = lv('ncRiver');
    if (r < 0.25) return;
    const p = clamp((r - 0.25) / 0.17, 0, 1);
    const x = G.cx, y0 = G.yW, yE = W.waterlineY(1) + 1, y1 = lerp(y0, Math.max(y0 + 4, yE), p);
    const pts = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([x + Math.sin(t * 4 + 0.6) * 0.008 * G.Wc * t, lerp(y0, y1, t)]); }
    waterStroke(ctx, pts, G.gw * 0.4, G.gw * 0.55, a);
    // 流过宝石根基时的白沫
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(244,252,255)';
    ctx.lineWidth = Math.max(0.8, 0.8 * SU());
    for (let k = 0; k < 4; k++) {
      const ph = U.fract(W.t * 0.7 + k / 4), yy = lerp(y0, Math.min(y1, y0 + G.Fh), ph);
      ctx.globalAlpha = a * 0.45 * Math.sin(Math.PI * ph);
      ctx.beginPath(); ctx.moveTo(x + (k - 1.5) * G.gw * 0.08, yy); ctx.lineTo(x + (k - 1.5) * G.gw * 0.08, yy + G.fb * 2); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 水边 → 近地的岭线（在光原之上）
  function drawRiverCross(ctx) {
    const r = lv('ncRiver');
    if (r < 0.42 || lv('ncCity') < 0.99) return;
    const p = clamp((r - 0.42) / 0.13, 0, 1), G = cityG();
    const x0 = G.cx, y0 = W.waterlineY(1) - 1, x1 = X.rx * W.w, y1 = gY(2, X.rx) + 4;
    const pts = [];
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * p; pts.push([lerp(x0, x1, t), lerp(y0, y1, t)]); }
    waterStroke(ctx, pts, G.gw * 0.55, 0.22 * PH(2) + G.gw * 0.3, 1);
  }
  function drawRiverNear(ctx) {
    const r = lv('ncRiver');
    if (r < 0.55) return;
    const p = clamp((r - 0.55) / 0.45, 0, 1), R = riverNear();
    const pts = [];
    for (let i = 0; i <= 20; i++) pts.push(bez(R.P, (i / 20) * p));
    ctx.save();
    waterStroke(ctx, pts, R.w0, lerp(R.w0, R.w1, p), 1);
    // 顺流的粼光
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,255,255)';
    for (let i = 0; i < 22; i++) {
      const t = U.fract(hsh(i + 3) + W.t * (0.05 + 0.03 * hsh(i + 9)));
      if (t > p) continue;
      const q = bez(R.P, t), w = lerp(R.w0, R.w1, t) * (hsh(i + 17) - 0.5) * 0.6;
      ctx.globalAlpha = 0.45 * Math.sin(Math.PI * U.fract(t * 7 + i * 0.3));
      const L = (2 + 6 * t) * SU();
      ctx.fillRect(q[0] - L / 2 + w, q[1] + w * 0.2, L, Math.max(0.8, (0.7 + 0.8 * t) * SU()));
    }
    sprites(); ctxA = ctx;
    const m = bez(R.P, p * 0.3);
    glowAt(SP.aqua, m[0], m[1], 1.8 * PH(2), 0.16 * p, 0.45);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：地上——荆棘、生命树、帐幕、列国、叶子、额上的名
  // ════════════════════════════════════════════════════════════
  function drawGrey(ctx) {
    const k = lv('ncGrey');
    if (k < 0.01) return;
    ctx.fillStyle = 'rgba(38,42,52,' + (0.24 * k).toFixed(3) + ')';
    ctx.fillRect(-2, W.horizonY - 2, W.w + 4, W.h - W.horizonY + 4);
  }
  function drawThorns(ctx) {
    const k = lv('ncThorn');
    const bl = 1 - k;
    if (!MOD.thorn) return;
    const pts = thornPts();
    ctx.save();
    ctx.lineCap = 'round';
    for (const q of pts) {
      if (k > 0.01) {
        ctx.save();
        ctx.translate(q.x, q.y); ctx.scale(q.s, q.s);
        ctx.globalAlpha = k;
        ctx.strokeStyle = W.shadeCSS([74, 60, 48], 0, null, 0);
        ctx.lineWidth = 1.6 / Math.max(4, q.s) * SU();
        ctx.stroke(MOD.thorn[q.i % MOD.thorn.length]);
        ctx.restore();
      }
      // 再没有咒诅：荆棘所在之处开出花来
      if (bl > 0.02 && lv('ncFace') > 0.01) {
        for (let j = 0; j < 7; j++) {
          const r = (1.3 + 1.5 * hsh(q.i * 9 + j)) * SU() * sm(0, 1, bl), ax = (hsh(q.i * 5 + j) - 0.5) * q.s * 0.9, ay = -hsh(q.i * 7 + j) * q.s * 0.45;
          ctx.globalAlpha = bl;
          ctx.fillStyle = W.shadeCSS(j % 3 === 0 ? [250, 246, 236] : j % 3 === 1 ? [246, 170, 190] : [248, 214, 100], 0, null, 0.15);
          ctx.beginPath(); ctx.arc(q.x + ax, q.y + ay, r, 0, TAU); ctx.fill();
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawTrees(ctx) {
    const g = lv('ncTree');
    if (g < 0.003 || !MOD.tree) return;
    sprites(); ctxA = ctx;
    const fr = lv('ncFruit'), leaf = lv('ncLeaf');
    for (let i = 0; i < 2; i++) {
      const T0 = treeG(i), m = MOD.tree[i], fxs = 0.72 * (i ? -1 : 1);
      const pulse = 0.88 + 0.12 * Math.sin(W.t * 0.8 + i);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, T0.x, T0.y - 0.68 * T0.H * g, T0.H * 0.6, 0.24 * g * pulse * (0.6 + 0.4 * leaf), 0.8);
      ctx.globalCompositeOperation = 'source-over';
      const sw = Math.sin(W.t * 0.5 + i) * 0.008 + W.wind * 0.006;
      paintTree(ctx, m, TREE_PAL, T0.x, T0.y, T0.H, g, 0.06 + 0.05 * leaf, { sway: sw, fx: fxs });
      // 叶子的微光（乃为医治万民）
      if (leaf > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        const s = T0.H * U.easeOut(g);
        m.leaves.forEach((p, j) => {
          const tw = 0.5 + 0.5 * Math.sin(W.t * 1.1 + j * 1.7);
          glowAt(SP.jade, T0.x + (p[0] + p[1] * sw) * s * fxs, T0.y + p[1] * s, 0.045 * T0.H, 0.16 * leaf * tw);
        });
        ctx.globalCompositeOperation = 'source-over';
      }
      // 十二样果子：一粒粒的光
      if (fr > 0.01 && g > 0.5) {
        const s = T0.H * U.easeOut(g);
        m.fruit.forEach((f, j) => {
          const c = mix(FRUIT[j % 12], [255, 250, 240], 0.18), X0 = T0.x + (f[0] + f[1] * sw) * s * fxs, Y0 = T0.y + f[1] * s;
          const r = Math.max(1.3, 0.013 * T0.H * f[2]) * sm(0, 1, fr);
          ctx.globalCompositeOperation = 'lighter';
          glowAt(SP.gold, X0, Y0, r * 3, 0.26 * fr * (0.7 + 0.3 * Math.sin(W.t * 1.6 + j)));
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = fr;
          ctx.fillStyle = W.shadeCSS(c, 0, null, 0.2);
          ctx.beginPath(); ctx.arc(X0, Y0, r, 0, TAU); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,250,0.7)';
          ctx.fillRect(X0 - r * 0.45, Y0 - r * 0.55, Math.max(0.6, r * 0.38), Math.max(0.6, r * 0.38));
        });
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;
  }
  // 神的帐幕在人间：一团荣耀的云自正门出来，降到人中间，张开成覆庇众人的云（如会幕上的云，出 40:34）——只是光与云
  function drawTent(ctx) {
    const k = lv('ncTent'), col = lv('ncBeam'), cl = lv('ncCloud');
    if (k < 0.003 || cl < 0.004 || lv('ncCity') < 0.9) return;
    const T0 = tentG(), G = cityG(), q = G.gates[1], ph = T0.ph;
    sprites(); ctxA = ctx;
    const e1 = U.easeInOut(clamp(k / 0.55, 0, 1)), e2 = U.easeInOut(clamp((k - 0.4) / 0.6, 0, 1));
    // 云头：自正门里（y0）降到河所出之处的上空（yR），再向两边张开
    const y0 = q.y - q.h * 0.5, yR = T0.g - 2.0 * ph;
    const cy = lerp(y0, yR, e1), hx = lerp(q.x, T0.x, e1);
    const cx = lerp(hx, T0.cx, e2), half = lerp(ph * 0.55, T0.half, e2);
    const A = cl * (0.45 + 0.55 * sm(0, 0.25, e1));
    // up = 1：当中隆起的一层（云的顶，像帐幕的脊）
    const puffXY = (P, up) => {
      const t = up ? P[0] * 0.6 : P[0], x = cx + t * half + Math.sin(W.t * 0.3 + P[3]) * 0.06 * ph;
      let rest = gY(2, clamp(x / W.w, 0, 1)) - ph * (1.45 + 0.55 * (1 - t * t));   // 随地势，当中高、两边低（如帐幕的顶）
      if (up) rest -= ph * 0.5 * (1 - P[0] * P[0]);
      const y = lerp(cy + (P[2] - 0.5) * 0.35 * ph - (up ? 0.3 * ph : 0), rest, e2) + Math.sin(W.t * 0.4 + P[3] * 1.7) * 0.04 * ph;
      const r = ph * (0.5 + 0.32 * P[1]) * lerp(0.75, 1 - 0.22 * Math.abs(t), e2) * (up ? 0.82 : 1);
      return [x, y, r];
    };
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 自正门降下的一道光（云柱）：门里亮起，一直连到云中
    if (col > 0.01) {
      const top = q.y - q.h * 0.95, bot = cy + 0.3 * ph, wd = Math.max(q.w * 1.5, 0.8 * ph);
      if (bot > top + 2) {
        ctx.globalAlpha = clamp(0.55 * col * cl, 0, 1);
        ctx.drawImage(SP.beam, hx - wd / 2, top, wd, bot - top);
        ctx.globalAlpha = clamp(0.5 * col * cl, 0, 1);
        ctx.drawImage(SP.beam, hx - wd * 0.18, top, wd * 0.36, bot - top);
      }
      glowAt(SP.white, q.x, q.y - q.h * 0.45, q.w * 1.6, 0.5 * col * cl);
    }
    // 云身：先画背光的一层（略带珍珠灰），再画迎光的一层
    ctx.globalCompositeOperation = 'source-over';
    for (const P of TPUFF) { const [x, y, r] = puffXY(P, 0); glowAt(SP.cloudS, x, y + r * 0.2, r * 1.05, 0.45 * A, 0.62); }
    for (const P of TPUFF) { const [x, y, r] = puffXY(P, 0); glowAt(SP.cloudL, x, y - r * 0.14, r * 0.88, 0.85 * A, 0.62); }
    for (let i = 3; i < TPUFF.length - 3; i += 2) { const [x, y, r] = puffXY(TPUFF[i], 1); glowAt(SP.cloudL, x, y, r, 0.8 * A * sm(0, 0.35, e1), 0.66); }
    // 云里的荣光
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const t = (i / 4) * 2 - 1, x = cx + t * half * 0.8;
      const y = lerp(cy, gY(2, clamp(x / W.w, 0, 1)) - ph * (1.6 + 0.55 * (1 - t * t)), e2);
      glowAt(SP.warm, x, y, ph * 1.6, 0.26 * A * (0.85 + 0.15 * Math.sin(W.t * 0.9 + i)), 0.5);
      glowAt(SP.gold, x, y + 0.15 * ph, ph * 0.9, 0.12 * A, 0.5);
    }
    glowAt(SP.white, cx, lerp(cy, T0.g - 2.2 * ph, e2) - 0.1 * ph, ph * 1.2, 0.45 * A, 0.6);
    // 垂到众人身上的几幅光
    if (e2 > 0.01) {
      for (let i = 0; i < 5; i++) {
        const t = ((i + 0.5) / 5) * 2 - 1, x = cx + t * half * 0.82, g = gY(2, clamp(x / W.w, 0, 1));
        const y1 = g - ph * (1.45 + 0.5 * (1 - t * t)), wd = ph * 0.9;
        ctx.globalAlpha = clamp(0.3 * e2 * A * (0.85 + 0.15 * Math.sin(W.t * 0.6 + i * 1.9)), 0, 1);
        ctx.drawImage(SP.beam, x - wd / 2, y1, wd, g - y1 + 0.15 * ph);
      }
      glowAt(SP.gold, cx, T0.g - 0.3 * ph, half * 0.85, 0.14 * e2 * A, 0.25);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 宝座的光临到众人（见他的面）；「来」的光；城的光照在地上
  function drawLandLight(ctx) {
    const f = lv('ncFace'), gl = lv('ncGlow') * sm(0.9, 1, lv('ncCity')), glory = lv('ncGlory'), call = lv('ncCall');
    if (f < 0.003 && gl < 0.003 && glory < 0.003 && call < 0.003) return;
    sprites(); ctxA = ctx;
    const G = cityG(), g = gY(2, X.rx);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, G.cx, g, G.Wc * 0.7, 0.08 * gl + 0.06 * glory, 0.3);
    if (f > 0.003) {
      glowAt(SP.warm, (G.tx + X.rx * W.w) / 2, g - PH(2) * 1.2, (PORT ? 0.45 : 0.26) * W.w, 0.22 * f, 0.55);
      glowAt(SP.white, G.tx, G.ty, G.Wc * 0.22, 0.22 * f);
    }
    if (call > 0.003) {
      // 「来！」：每个珍珠门都放出光来，一圈一圈向外（约两秒一圈）
      for (const q of G.gates) {
        const pl = call * (0.82 + 0.18 * Math.sin(W.t * 2 + q.x));
        glowAt(SP.gold, q.x, q.y - q.h * 0.45, q.w * 2.3, 0.4 * pl, 1.1);       // 门里一团金光（墙不被洗白，门的形状仍看得见）
        glowAt(SP.white, q.x, q.y - q.h * 0.5, q.w * 0.9, 0.32 * pl, 1.4);
        // 门前的一条光路：自门口下到山坡、光原，一直到众人脚前（「来！」）
        const tx = q.x + (q.x - G.cx) * 0.9, g2 = gY(2, clamp(tx / W.w, 0, 1)), hw = q.w * 0.42, hw2 = PH(2) * 0.9;
        const lg = ctx.createLinearGradient(0, q.y, 0, g2);
        lg.addColorStop(0, 'rgba(255,238,196,' + (0.34 * pl).toFixed(3) + ')'); lg.addColorStop(1, 'rgba(255,238,196,0)');
        ctx.fillStyle = lg; ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.moveTo(q.x - hw, q.y); ctx.lineTo(q.x + hw, q.y); ctx.lineTo(tx + hw2, g2); ctx.lineTo(tx - hw2, g2); ctx.closePath(); ctx.fill();
      }
      const pk = sm(0.5, 0.85, call);
      if (pk > 0.01) {
        G.gates.forEach((q, i) => {
          const f = U.fract(W.t / 2 + i * 0.17), r = q.w * (0.8 + 5.4 * f);
          for (const [lw, al, c] of [[4.5, 0.22, 'rgb(255,214,140)'], [1.8, 0.7, 'rgb(255,250,232)']]) {
            ctx.strokeStyle = c;
            ctx.globalAlpha = clamp(al * pk * (1 - f) * (1 - f), 0, 1);
            ctx.lineWidth = Math.max(1, lw * (1 - 0.5 * f) * SU());
            ctx.beginPath(); ctx.ellipse(q.x, q.y - q.h * 0.5, r, r * 0.78, 0, 0, TAU); ctx.stroke();
          }
        });
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 列国在城的光里行走：中丘上成行的光的小人，走进城门（只是画面）
  function drawNations(ctx) {
    const k = lv('ncNations');
    if (k < 0.01 || lv('ncCity') < 0.99) return;
    const G = cityG(), h = 0.62 * PH(1);
    const L0 = 0.49, gl = G.x0 - G.ds * 0.5, gr = G.gates[2].x;
    const N = PORT ? 4 : 7;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let s = 0; s < 2; s++) {
      for (let i = 0; i < N; i++) {
        const ph = U.fract(W.t * 0.018 * (s ? 0.8 : 1) + i / N + s * 0.37);
        const xs = s ? 1.03 * W.w : L0 * W.w, xe = s ? gr : gl;
        const x = lerp(xs, xe, ph);
        const y = s ? Math.min(gY(1, x / W.w), G.yB) : lerp(gY(1, xs / W.w), G.yW - G.dz * 0.5, sm(0.6, 1, ph));
        const a = k * sm(0, 0.08, ph) * (1 - sm(0.9, 1, ph)) * sm((i + 0.5) / N - 0.2, (i + 0.5) / N + 0.1, k);
        lightFigure(ctx, x, y + (hsh(i * 3 + s) - 0.5) * h * 0.25, h * (0.8 + 0.25 * hsh(i + s * 20)), a * 0.55, i + s * 11);
        if (i % 3 === 0) glowAt(SP.gold, x + (s ? -1 : 1) * h * 0.2, y - h * 0.55, h * 0.3, a * 0.7);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 额上的名：每个人额前一点金光
  function drawMarks(ctx) {
    const k = lv('ncMark');
    if (k < 0.01) return;
    const c = C();
    if (!c || !c.people) return;
    sprites(); ctxA = ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,252,236)';
    const one = p => {
      if (!p || p.isAnimal || p.angel || p.dying || !p._vis || !(p.alpha > 0.3)) return;
      const h = p._h || 30, up = p.pose === 'worship' || p.pose === 'kneel' || p.pose === 'pray' ? 0.62 : 0.9;
      const x = p._x + (p.facing || 1) * h * 0.035, y = p._y - h * up;
      glowAt(SP.gold, x, y, Math.max(3, h * 0.1), 0.75 * k * p.alpha);
      const d = Math.max(0.8, h * 0.018);
      ctx.globalAlpha = 0.9 * k * p.alpha; ctx.fillRect(x - d, y - d, d * 2, d * 2);
    };
    for (const p of c.people.values()) one(p);
    if (c.crowds) for (const g of c.crowds.values()) for (const m of g.members) one(m);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 短暂的光：泪滴（落下，化去）、叶子（自树飘向众人）
  function drawFX(ctx, layer) {
    if (!FXL.length) return;
    sprites(); ctxA = ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const f of FXL) {
      const t = (W.t - f.t0) / f.dur;
      if (t < 0 || t > 1) continue;
      if (f.k === 'drop' && layer === 'top') {
        const y = f.y + t * f.fall, a = Math.sin(Math.PI * t) * 0.9;
        glowAt(SP.pale, f.x, y, 3 * SU(), a);
        ctx.globalAlpha = a; ctx.fillStyle = 'rgb(236,244,255)';
        ctx.fillRect(f.x - 0.6, y - 2.5 * SU(), 1.2, 3 * SU());
      } else if (f.k === 'leaf' && layer === 'air') {
        const x = lerp(f.x, f.tx, t) + Math.sin(t * 7 + f.s) * 10 * SU(), y = lerp(f.y, f.ty, t) - Math.sin(Math.PI * t) * 20 * SU();
        const a = Math.sin(Math.PI * t) * 0.8;
        glowAt(SP.jade, x, y, 6 * SU(), a * 0.5);
        ctx.globalAlpha = a; ctx.fillStyle = 'rgb(200,255,200)';
        ctx.save(); ctx.translate(x, y); ctx.rotate(t * 6 + f.s);
        ctx.fillRect(-2 * SU(), -0.7 * SU(), 4 * SU(), 1.4 * SU());
        ctx.restore();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const scene = {
    init() { sprites(); models(); layout(); },
    resize() { layout(); },
    update(dt) {
      for (let i = FXL.length - 1; i >= 0; i--) if (W.t - FXL[i].t0 > FXL[i].dur) FXL.splice(i, 1);
      if (!isCur()) return;
      // 十二根基一层层显出：每一层一声轻轻的钟
      const f = Math.floor(lv('ncFound') + 1e-4);
      if (f > lastFound && !W.replaying && W.lt.ncFound > lastFound) { const a = au(); if (a && a.sfx) U.safe('audio.sfx', () => a.sfx('bell', { soft: true, far: f % 2 === 0 })); }
      lastFound = f;
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      sprites();
      if (pass === 'sky') {
        drawNewSky(ctx);
        drawOld(ctx);
        drawOpen(ctx);
        drawRing(ctx);
        drawStar(ctx);
      } else if (pass === 'far') {
        drawCityHalo(ctx);
      } else if (pass === 'mid') {
        drawCity(ctx);
        drawNations(ctx);
      } else if (pass === 'near') {
        models();
        drawGrey(ctx);
        drawLandLight(ctx);
        drawThorns(ctx);
        drawRiverNear(ctx);
        drawTrees(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') drawPlain(ctx, pass);
      else if (pass === 'air') { drawTent(ctx); drawFX(ctx, 'air'); }
      else if (pass === 'top') { drawMarks(ctx); drawFX(ctx, 'top'); }
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; lastFound = Math.floor(lv('ncFound') + 1e-4); },
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py, rr) => { const d = Math.hypot(px - x, py - y); if (d < (rr || r) && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const G = cityG();
      if (lv('ncCity') > 0.95) {
        consider('新耶路撒冷', G.cx, G.yW - G.Hw * 1.3, r * 1.4);
        G.gates.forEach(q => consider('珍珠门', q.x, q.y - q.h * 0.55));
        consider('根基', G.cx - G.Wc * 0.25, G.yW + G.fb * 6);
        consider('宝座', G.tx, G.ty);
        if (lv('ncLamb') > 0.5) consider('羔羊', G.tx, G.ty + G.Wc * 0.03);
      }
      if (lv('ncRiver') > 0.7) { const R = riverNear(), q = bez(R.P, 0.45); consider('生命水的河', q[0], q[1]); }
      if (lv('ncTree') > 0.6) for (let i = 0; i < 2; i++) { const T0 = treeG(i); consider('生命树', T0.x, T0.y - T0.H * 0.62); }
      if (lv('ncTent') > 0.5 && lv('ncCloud') > 0.5) { const T0 = tentG(); consider('神的帐幕', T0.cx, T0.top); }
      if (lv('ncStarA') > 0.5) { const s = starPt(); consider('晨星', s[0], s[1]); }
      if (!best && lv('ncSea') > 0.9 && y > W.horizonY + 4 && W.isSea(x, y)) best = { label: '新天新地', x, y, d: r * 0.9 };
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  几件常用的事
  // ════════════════════════════════════════════════════════════
  // 光临到一个人：一点光落在他头上，泪滴化去
  function touch(b, id) {
    if (b.instant || !has(id)) return;
    const h = headOf(id, 0.9);
    sparkleAt(b, h[0], h[1], 18, [255, 244, 220], 10);
    for (let i = 0; i < 4; i++) FXL.push({ k: 'drop', x: h[0] + (i - 1.5) * 3 * SU(), y: h[1] + 4 * SU(), fall: (16 + 8 * i) * SU(), t0: W.t + i * 0.18, dur: 1.4 });
  }
  function leaves(b) {
    if (b.instant) return;
    const tg = [];
    for (const id of NAMED) if (has(id)) tg.push(headOf(id, 0.8));
    for (const g of ['folkA', 'folkB']) for (const m of members(g)) if (m._vis) tg.push([m._x, m._y - (m._h || 30) * 0.8]);
    if (!tg.length) tg.push([W.w * 0.7, W.h * 0.8]);
    for (let i = 0; i < (PORT ? 14 : 26); i++) {
      const T0 = treeG(i % 2), q = tg[i % tg.length];
      FXL.push({ k: 'leaf', x: T0.x + (Math.random() - 0.5) * T0.H * 0.5, y: T0.y - T0.H * (0.55 + Math.random() * 0.3), tx: q[0], ty: q[1], s: Math.random() * 6, t0: W.t + i * 0.22, dur: 4 + Math.random() * 2 });
    }
  }
  const allPeople = () => NAMED.filter(has);
  const EMB = ['mother', 'child'];        // 母亲与孩子相拥着：众人举手、站起时不打断她们
  function everyoneFaceOut(xf) {
    for (const id of allPeople()) { const f = fig(id); if (f && EMB.indexOf(id) < 0) face(id, f.nx < xf ? -1 : 1); }
    for (const g of FOLK) for (const m of members(g)) { m.facing = m.nx < xf ? -1 : 1; if (W.replaying) m.fd = m.facing; }
  }
  function everyoneFace(xf) {
    for (const id of allPeople()) face(id, xf);
    for (const g of FOLK) crowdFace(g, xf);
  }
  function everyoneFaceDir(d) {
    for (const id of allPeople()) face(id, d);
    for (const g of FOLK) crowdFaceDir(g, d);
  }
  function everyonePose(p, skip) {
    for (const id of allPeople()) if (!skip || skip.indexOf(id) < 0) pose(id, p);
    for (const g of FOLK) crowdPose(g, p);
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：先前的天地
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.85, land: 1, grass: 0.3, herbs: 0.2, trees: 0,
      lights: 1, moon: 0.4, stars: 0.3, life: 0.4, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    W.set('bare', 0.62, true); W.set('bloom', 0.04, true);
    W.set('storm', 0.32, true); W.set('gloom', 0.26, true); W.set('gale', 0.12, true);
    if (W.hasLevel('rainbow')) W.set('rainbow', 0, true);
    for (const k in LVS) W.set(k, 0, true);
    W.set('ncOld', 1, true); W.set('ncGrey', 1, true); W.set('ncThorn', 1, true);
    W.freeClock = false;
    W.goTo(0.27, 0, true);
    const lx = W.w * 0.72, ly = W.ridgeBaseY(2, lx);
    W.setOrigin('grass', W.w * X.rx, W.ridgeBaseY(2, W.w * X.rx));
    W.setOrigin('herbs', W.w * X.rx, W.ridgeBaseY(2, W.w * X.rx));
    W.setOrigin('trees', W.w * 0.6, W.ridgeBaseY(2, W.w * 0.6));
    W.setPop('fish', 36, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.14, W.h * 0.76, true);
    W.setPop('bird', 4, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    S = fresh();
    FXL.length = 0; lastFound = 0;
    const c = C();
    c.clear({ fade: false });
    // 约翰（启 21:2「我又看见」）：看这一切的人
    add('john', Object.assign({}, LOOK().john || { label: '约翰', sex: 'm', robe: [150, 70, 64] }, { x: X.john, layer: 2, facing: 1, pose: 'stand', glow: 0.32, v: 0.05 }));
    // 先前的事：哀哭的人
    add('mother', { label: '母亲', sex: 'f', age: 'adult', x: X.mother, layer: 2, facing: 1, pose: 'weep', robe: [104, 98, 112], hair: 'veil', glow: 0.2, v: 0.05 });
    pose('mother', 'weep', { weep: true });
    add('elder', { label: '老者', sex: 'm', age: 'elder', x: X.elder, layer: 2, facing: -1, pose: 'bow', robe: [112, 104, 94], prop: 'staff', glow: 0.18, v: 0.05 });
    add('man', { label: '圣徒', sex: 'm', age: 'adult', x: X.man, layer: 2, facing: -1, pose: 'kneel', robe: [92, 98, 110], glow: 0.18, v: 0.05 });
    add('woman', { label: '圣徒', sex: 'f', age: 'adult', x: X.woman, layer: 2, facing: -1, pose: 'weep', robe: [122, 106, 102], hair: 'veil', glow: 0.18, v: 0.05 });
    pose('woman', 'weep', { weep: true });
    W.beastAvoid = [[0.48, 0.98]];
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 看哪！我造新天新地（赛 65:17 → 启 21:1）──────────────────
    {
      kind: 'cmd', utter: '看哪！我造新天新地', cmd: 'git checkout 新天新地  # 先前的天地已经过去了', ref: '以赛亚书 65:17',
      verse: [
        { text: '看哪！我造新天新地；<br>从前的事不再被记念，也不再追想。', ref: '以赛亚书 65:17', hold: 6 },
        { text: '我又看见一个新天新地；<br>因为先前的天地已经过去了，海也不再有了。', ref: '启示录 21:1', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            flash(b, 0.55); sfx(b, 'harp'); sfx(b, 'wind', { soft: true });
            setL('ncOld', 0, b); setL('ncGrey', 0, b);
            W.set('storm', 0, b.instant); W.set('gloom', 0, b.instant); W.set('gale', 0, b.instant); W.set('clouds', 0.16, b.instant);
            W.goTo(0.34, 16, b.instant);
            pose('john', 'gaze'); face('john', 1);
          }],
          [1.2, b => { setL('ncSky', 1, b); }],
          [5, b => { W.set('bare', 0.2, b.instant); W.set('grass', 0.42, b.instant); W.set('bloom', 0.12, b.instant); }],
          // 海也不再有了：海平静，自远而近化作光原
          [7.2, b => { setL('ncSea', 1, b); sfx(b, 'wave', { soft: true, far: true }); }],
          [12.5, b => { W.setPop('fish', 0, null, null, b.instant); W.setPop('whale', 0, null, null, b.instant); GS.book.resync(); }],
          [17.6, b => { pose('john', 'stand'); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 2 · 圣城新耶路撒冷由神那里从天而降（启 21:2）──────────────
    {
      kind: 'act', utter: '圣城新耶路撒冷由神那里从天而降', cmd: 'deploy 新耶路撒冷 --from 天上 --as 新妇', ref: '21:2',
      verse: [
        { text: '我又看见圣城新耶路撒冷由神那里从天而降，<br>预备好了，就如新妇妆饰整齐，等候丈夫。', ref: '启示录 21:2', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { setL('ncOpen', 1, b); flash(b, 0.3); sfx(b, 'angel'); pose('john', 'gaze'); face('john', 1); }],
          [0.8, b => { setL('ncCity', 1, b); setL('ncVeil', 1, b); sfx(b, 'wind', { soft: true }); }],
          [7.4, b => { setL('ncVeil', 0, b); }],
          // 落在山上
          [9.6, b => {
            shake(b, 0.22); sfx(b, 'seal', { soft: true }); sfx(b, 'harp');
            setL('ncGlow', 0.45, b); setL('ncOpen', 0, b);
            if (!b.instant) { const G = cityG(); sparkleAt(b, G.cx, G.yW - G.Hw * 0.5, 40, [255, 248, 226], 60); ringAt(b, G.cx, G.yW - G.Hw, G.Wc * 0.7, [255, 244, 214], 2.6); }
          }],
          [11, b => { pose('john', 'stand'); face('elder', 1); pose('elder', 'stand'); }],
        ]);
      },
    },

    // ── 3 · 看哪，神的帐幕在人间（启 21:3）───────────────────────
    {
      kind: 'promise', utter: '看哪，神的帐幕在人间', cmd: 'mount 神的帐幕 /人间  # 他要与人同住', ref: '21:3',
      verse: [
        { text: '我听见有大声音从宝座出来说：<br>「看哪，神的帐幕在人间。他要与人同住，他们要作他的子民。<br>神要亲自与他们同在，作他们的神。」', ref: '启示录 21:3', hold: 9.5 },
      ],
      apply(c) {
        T(c, [
          // 大声音从宝座出来：宝座的光一闪，一道光自正门降下
          [0, b => {
            setL('ncBeam', 1, b); sfx(b, 'angel');
            if (!b.instant) { const G = cityG(); ringAt(b, G.tx, G.ty, G.Wc * 0.45, [255, 246, 220], 2.2); sparkleAt(b, G.tx, G.ty, 20, [255, 250, 236], 12); }
          }],
          [0.3, b => { setL('ncTent', 1, b); setL('ncCloud', 1, b); }],
          [3, b => { sfx(b, 'harp', { soft: true }); }],
          // 哀哭的人抬起头来
          [4.6, b => {
            pose('mother', 'kneel', { weep: true }); face('mother', 1);
            pose('elder', 'bow'); face('elder', 1);
            face('man', -1); pose('woman', 'kneel', { weep: true }); face('woman', -1);
          }],
          // 他们要作他的子民：万民聚来
          [6.4, b => {
            crowd('folkA', { n: X.nA, x0: X.cA0, x1: X.cA1, layer: 2, pose: 'stand', glow: 0.1, label: '万民' });
            crowd('folkB', { n: X.nB, x0: X.cB0, x1: X.cB1, layer: 2, pose: 'stand', glow: 0.1, label: '万民' });
            crowdFace('folkA', X.rx); crowdFace('folkB', X.rx);
            sfx(b, 'crowd', { soft: true });
          }],
          [10.4, b => { crowdPose('folkA', 'worship'); crowdPose('folkB', 'worship'); pose('john', 'bow'); face('john', 1); }],
          [12, b => { setL('ncBeam', 0.55, b); }],
        ]);
      },
    },

    // ── 4 · 神要擦去他们一切的眼泪（启 21:4）──────────────────────
    {
      kind: 'promise', utter: '神要擦去他们一切的眼泪', cmd: 'rm -rf 眼泪 死亡 悲哀 哭号 疼痛', ref: '21:4',
      verse: [
        { text: '「神要擦去他们一切的眼泪；不再有死亡，<br>也不再有悲哀、哭号、疼痛，因为以前的事都过去了。」', ref: '启示录 21:4', hold: 8.5 },
        { text: '他已经吞灭死亡直到永远。<br>主耶和华必擦去各人脸上的眼泪。', ref: '以赛亚书 25:8', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { touch(b, 'mother'); glow('mother', 0.42); sfx(b, 'harp', { soft: true }); }],
          [1.3, b => { pose('mother', 'stand', { weep: false }); robe('mother', WHITES[0]); face('mother', 1); }],
          // 母亲的孩子自光中跑来
          [2.4, b => {
            add('child', { label: '孩子', sex: 'f', age: 'child', x: X.childFrom, layer: 2, facing: -1, pose: 'stand', robe: [246, 242, 232], glow: 0.5, v: 0.05, from: b.instant ? 'none' : 'light' });
            S.child = true;
            if (!b.instant) { const h = headOf('child', 0.5); sparkleAt(b, h[0], h[1], 30, [255, 246, 226], 16); }
            sfx(b, 'chime');
          }],
          [3.6, b => { C().embrace('mother', 'child', { run: true, at: X.mother + 0.012 }); }],
          [5.2, b => { touch(b, 'elder'); }],
          [6.2, b => { pose('elder', 'stand'); prop('elder', null); robe('elder', WHITES[1]); glow('elder', 0.38); face('elder', 1); }],
          [7.6, b => { touch(b, 'man'); }],
          [8.6, b => { pose('man', 'raise'); robe('man', WHITES[2]); glow('man', 0.36); }],
          [9.6, b => { touch(b, 'woman'); }],
          [10.4, b => { pose('woman', 'stand', { weep: false }); robe('woman', WHITES[3]); glow('woman', 0.36); }],
          // 众人都穿上了白衣
          [11.8, b => {
            for (const g of ['folkA', 'folkB']) { crowdPose(g, 'stand'); crowdRobe(g); crowdGlow(g, 0.2); }
            if (!b.instant) for (const g of ['folkA', 'folkB']) for (const m of members(g)) if (m._vis) sparkleAt(b, m._x, m._y - (m._h || 30) * 0.6, 6, [255, 248, 230], 8);
            sfx(b, 'harp');
          }],
          [13.4, b => { pose('man', 'stand'); face('man', -1); pose('john', 'stand'); }],
        ]);
      },
    },

    // ── 5 · 看哪，我将一切都更新了（启 21:5）─────────────────────
    {
      kind: 'cmd', utter: '看哪，我将一切都更新了', cmd: 'renew --all  # 这些话是可信的，是真实的', ref: '21:5',
      verse: [
        { text: '坐宝座的说：「看哪，我将一切都更新了！」<br>又说：「你要写上；因这些话是可信的，是真实的。」', ref: '启示录 21:5', hold: 8.5 },
        { text: '但受造之物仍然指望脱离败坏的辖制，<br>得享神儿女自由的荣耀。', ref: '罗马书 8:21', hold: 6 },
      ],
      apply(c) {
        const span = W.landSpan(2) || [W.w * 0.45, W.w];
        const cx = c.choice && isFinite(c.choice.x) ? c.choice.x : clamp((c.x || W.w * 0.72) / W.w, span[0] / W.w + 0.02, span[1] / W.w - 0.02);
        T(c, [
          [0, b => {
            flash(b, 0.7); shake(b, 0.3); sfx(b, 'harp');
            setL('ncCloud', 0, b); setL('ncBeam', 0, b);      // 帐幕的云化入新造的光里（不再停成一带）
            const px = cx * W.w, py = W.ridgeBaseY(2, px);
            W.setOrigin('grass', px, py); W.setOrigin('herbs', px, py); W.setOrigin('trees', px, py);
            W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant);
            W.set('bloom', 1, b.instant); W.set('bare', 0, b.instant); W.set('life', 1, b.instant);
            if (!b.instant) { ringAt(b, c.x || px, c.y || py, M() * 0.9, [255, 246, 220], 3.2); ringAt(b, px, py, M() * 0.5, [214, 255, 200], 2.6); }
          }],
          // 飞鸟自东边的天上出来（不在城前）
          [2.4, b => { W.setPop('bird', PORT ? 10 : 16, W.w * 0.28, W.h * 0.3, b.instant); sfx(b, 'bird'); }],
          [4.6, b => {
            const px = cx * W.w, py = W.ridgeBaseY(2, px);
            W.setPop('cattle', PORT ? 3 : 5, px, py, b.instant); W.setPop('beast', PORT ? 2 : 4, px, py, b.instant); W.setPop('creeper', PORT ? 8 : 16, px, py, b.instant);
            sfx(b, 'bleat', { soft: true });
          }],
          [7, b => { everyonePose('raise', EMB); pose('john', 'gaze'); }],
          [13.4, b => { everyonePose('stand', EMB); }],
        ]);
        return { x: cx };
      },
    },

    // ── 6 · 都成了！我是阿拉法，我是俄梅戛（启 21:6–7）────────────────
    {
      kind: 'name', utter: '都成了！我是阿拉法，我是俄梅戛', cmd: 'exit 0  # 我是初，我是终', ref: '21:6',
      verse: [
        { text: '他又对我说：「都成了！我是阿拉法，我是俄梅戛；<br>我是初，我是终。……」', ref: '启示录 21:6', hold: 7 },
        { text: '「得胜的，必承受这些为业：<br>我要作他的神，他要作我的儿子。」', ref: '启示录 21:7', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 「初」与「终」都留到那一环合上之后
          [0, b => { const R = ringG(); nameAt(b, '初', R.cx - R.rx, R.cy, R.size, { hold: 6.2 }); flash(b, 0.2); }],
          [1, b => { const R = ringG(); nameAt(b, '终', R.cx + R.rx, R.cy, R.size, { hold: 5.2 }); }],
          [2.4, b => { setL('ncRing', 1, b); setL('ncRingA', 1, b); sfx(b, 'stars'); }],
          // 都成了：城的荣光更盛
          [7.8, b => { setL('ncGlow', 0.72, b); sfx(b, 'harp'); if (!b.instant) { const G = cityG(); ringAt(b, G.tx, G.ty, G.Wc * 0.8, [255, 240, 200], 2.8); } }],
          // 我要作他的神，他要作我的儿子
          [9.4, b => { everyonePose('raise', EMB); for (const g of FOLK) crowdGlow(g, 0.26); }],
          [12.6, b => { setL('ncRingA', 0, b); }],
          [15, b => { everyonePose('stand', EMB); }],
        ]);
      },
    },

    // ── 7 · 城中有神的荣耀（启 21:11–21）──────────────────────────
    {
      kind: 'act', utter: '城中有神的荣耀', cmd: 'render 城 --wall 碧玉 --gates 珍珠×12 --street 精金', ref: '21:11',
      verse: [
        { text: '城中有神的荣耀；城的光辉如同极贵的宝石，<br>好像碧玉，明如水晶。', ref: '启示录 21:11', hold: 6.5 },
        { text: '墙是碧玉造的；城是精金的，如同明净的玻璃。<br>城墙的根基是用各样宝石修饰的。', ref: '启示录 21:18–19', hold: 7 },
        { text: '十二个门是十二颗珍珠，每门是一颗珍珠。<br>城内的街道是精金，好像明透的玻璃。', ref: '启示录 21:21', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { setL('ncWall', 1, b); setL('ncGlow', 0.8, b); sfx(b, 'harp'); if (!b.instant) FXL.push({ k: 'sweep', t0: W.t, dur: 3.2 }); pose('john', 'gaze'); face('john', 1); }],
          // 十二根基，一层一层显出宝石的颜色
          [7.8, b => { setL('ncFound', 12, b); }],
          // 十二个珍珠门
          [16.2, b => { setL('ncGates', 1, b); sfx(b, 'chime'); if (!b.instant) for (const q of cityG().gates) sparkleAt(b, q.x, q.y - q.h * 0.5, 14, [255, 250, 240], 10); }],
          [18.6, b => { setL('ncGold', 1, b); if (!b.instant) FXL.push({ k: 'sweep', t0: W.t, dur: 2.6 }); pose('john', 'point'); }],
          [22.4, b => { pose('john', 'stand'); }],
        ]);
      },
    },

    // ── 8 · 有神的荣耀光照，又有羔羊为城的灯（启 21:22–25）──────────────
    {
      kind: 'act', utter: '有神的荣耀光照，又有羔羊为城的灯', cmd: 'unset 日 月  # 羔羊为城的灯', ref: '21:23',
      verse: [
        { text: '我未见城内有殿，因主神全能者和羔羊为城的殿。', ref: '启示录 21:22', hold: 5.5 },
        { text: '那城内又不用日月光照；<br>因有神的荣耀光照，又有羔羊为城的灯。', ref: '启示录 21:23', hold: 6.5 },
        { text: '列国要在城的光里行走；地上的君王必将自己的荣耀归与那城。<br>城门白昼总不关闭，在那里原没有黑夜。', ref: '启示录 21:24–25', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => { setL('ncGlow', 0.9, b); sfx(b, 'harp', { soft: true }); }],
          // 不再有黑夜：昼夜之分归于神的荣耀；日头奔走它的路程，落下——光却不减
          [1.4, b => { W.set('dayNight', 0, b.instant); W.set('moon', 0, b.instant); W.set('stars', 0, b.instant); W.goTo(0.8, 12.5, b.instant); }],
          // 羔羊为城的灯；神的荣耀光照
          [8.6, b => {
            setL('ncLamb', 1, b); setL('ncGlow', 1, b); setL('ncBeam', 0, b); setL('ncShine', 1, b);
            sfx(b, 'bleat', { soft: true, far: true }); sfx(b, 'angel');
            if (!b.instant) { const G = cityG(); ringAt(b, G.tx, G.ty, G.Wc * 0.5, [255, 250, 236], 2.4); sparkleAt(b, G.tx, G.ty, 24, [255, 252, 244], 16); }
          }],
          // 城门总不关闭；列国在城的光里行走
          [14.2, b => { setL('ncGateOpen', 1, b); sfx(b, 'gate', { soft: true }); }],
          [15.6, b => { setL('ncNations', 1, b); sfx(b, 'crowd', { soft: true, far: true }); }],
        ]);
      },
    },

    // ── 9 · 我要将生命泉的水白白赐给那口渴的人喝（启 21:6；22:1）──────────
    {
      kind: 'promise', utter: '我要将生命泉的水白白赐给那口渴的人喝', cmd: 'pipe 生命水 --free | 口渴的人', ref: '21:6',
      verse: [
        { text: '他又对我说：「……我要将生命泉的水白白赐给那口渴的人喝。」', ref: '启示录 21:6', hold: 6 },
        { text: '天使又指示我在城内街道当中一道生命水的河，<br>明亮如水晶，从神和羔羊的宝座流出来。', ref: '启示录 22:1', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { setL('ncSpring', 1, b); sfx(b, 'water'); if (!b.instant) { const G = cityG(); sparkleAt(b, G.tx, G.ty + G.Wc * 0.1, 20, [210, 246, 255], 10); } }],
          [1, b => { setL('ncRiver', 1, b); sfx(b, 'water', { soft: true }); }],
          // 天使指示约翰
          [7, b => {
            add('angel', { label: '天使', sex: 'm', age: 'adult', x: X.angel, layer: 2, facing: 1, angel: true, glow: 1, v: 0.05, from: b.instant ? 'none' : 'light' });
            S.angel = true;
            pose('angel', 'point'); sfx(b, 'angel');
            face('john', 1); pose('john', 'gaze');
          }],
          [10.5, b => { everyoneFace(X.rx); }],
          // 到河边来：母亲与孩子跪在河边
          [12.4, b => { walk('mother', X.drinkM, { speed: 0.03, pose: 'kneel' }); walk('child', X.drinkC, { speed: 0.03, pose: 'kneel' }); face('mother', 1); face('child', -1); sfx(b, 'water', { soft: true }); }],
          [14, b => { pose('angel', 'stand'); pose('john', 'stand'); }],
        ]);
      },
    },

    // ── 10 · 我必将神乐园中生命树的果子赐给他吃（启 2:7；22:2，14）──────────
    {
      kind: 'promise', utter: '我必将神乐园中生命树的果子赐给他吃', cmd: 'grow 生命树 --fruit 12 --leaves 医治万民', ref: '2:7',
      verse: [
        { text: '在河这边与那边有生命树，结十二样果子，每月都结果子；<br>树上的叶子乃为医治万民。', ref: '启示录 22:2', hold: 7.5 },
        { text: '圣灵向众教会所说的话，凡有耳的，就应当听！<br>得胜的，我必将神乐园中生命树的果子赐给他吃。', ref: '启示录 2:7', hold: 7 },
        { text: '那些洗净自己衣服的有福了！<br>可得权柄能到生命树那里，也能从门进城。', ref: '启示录 22:14', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { setL('ncTree', 1, b); sfx(b, 'wind', { soft: true }); }],
          [6.4, b => { setL('ncFruit', 1, b); sfx(b, 'harp'); }],
          [9.2, b => { setL('ncLeaf', 1, b); leaves(b); sfx(b, 'wind', { soft: true }); }],
          // 可得权柄能到生命树那里
          [12.6, b => { walk('elder', X.treeL + 0.018, { speed: 0.025, pose: 'raise' }); face('elder', -1); walk('woman', X.treeR - 0.02, { speed: 0.025, pose: 'raise' }); }],
          [16.6, b => { for (const g of FOLK) crowdGlow(g, 0.3); glow('elder', 0.46); glow('woman', 0.44); if (!b.instant) { for (const id of ['elder', 'woman']) { const h = headOf(id, 1.05); sparkleAt(b, h[0], h[1], 14, [255, 236, 200], 8); } } }],
          [20.4, b => { pose('elder', 'stand'); pose('woman', 'stand'); }],
        ]);
      },
    },

    // ── 11 · 也要见他的面（启 22:3–5）─────────────────────────────
    {
      kind: 'act', utter: '也要见他的面', cmd: 'rm 咒诅; see(他的面)  # 名字写在额上', ref: '22:4',
      verse: [
        { text: '以后再没有咒诅；在城里有神和羔羊的宝座；<br>他的仆人都要事奉他，也要见他的面。他的名字必写在他们的额上。', ref: '启示录 22:3–4', hold: 9 },
        { text: '不再有黑夜；他们也不用灯光、日光，因为主神要光照他们。<br>他们要作王，直到永永远远。', ref: '启示录 22:5', hold: 7.5 },
      ],
      apply(c) {
        const tx = () => (X.city0 + X.city1) / 2;
        T(c, [
          [0, b => { setL('ncFace', 1, b); sfx(b, 'angel'); everyoneFace(tx()); face('angel', 1); }],
          // 以后再没有咒诅：荆棘化为花
          [1.6, b => {
            setL('ncThorn', 0, b);
            if (!b.instant) for (const q of thornPts()) sparkleAt(b, q.x, q.y - q.s * 0.3, 12, [255, 240, 214], 8);
          }],
          // 他的仆人都要事奉他
          [2.8, b => { everyonePose('worship', ['child']); pose('child', 'kneel'); pose('angel', 'bow'); }],
          // 也要见他的面；他的名字必写在他们的额上
          [8.2, b => {
            everyonePose('stand'); pose('angel', 'stand');
            for (const id of allPeople()) glow(id, id === 'child' ? 0.55 : 0.46);
            for (const g of FOLK) crowdGlow(g, 0.34);
            setL('ncMark', 1, b); sfx(b, 'chime');
          }],
          [9.4, b => { C().embrace('mother', 'child', { at: X.drinkM + 0.012 }); }],
          [12.5, b => { setL('ncFace', 0.35, b); }],
        ]);
      },
    },

    // ── 12 · 我是明亮的晨星（启 22:12–16）──────────────────────────
    {
      kind: 'name', utter: '我是明亮的晨星', cmd: 'echo 明亮的晨星  # 我是首先的，我是末后的', ref: '22:16',
      verse: [
        { text: '「看哪，我必快来！赏罚在我，要照各人所行的报应他。<br>我是阿拉法，我是俄梅戛；我是首先的，我是末后的；我是初，我是终。」', ref: '启示录 22:12–13', hold: 9 },
        { text: '「我耶稣差遣我的使者为众教会将这些事向你们证明。<br>我是大卫的根，又是他的后裔。我是明亮的晨星。」', ref: '启示录 22:16', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => { setL('ncStarA', 1, b); setL('ncStar', 1, b); sfx(b, 'stars'); }],
          [7.4, b => { everyoneFaceDir(-1); pose('john', 'gaze'); pose('angel', 'point'); face('angel', -1); }],
          [10.8, b => {
            sfx(b, 'chime'); sfx(b, 'harp', { soft: true });
            if (!b.instant) { const s = starPt(); ringAt(b, s[0], s[1], M() * 0.3, [246, 246, 255], 2.6); sparkleAt(b, s[0], s[1], 26, [246, 248, 255], 18); }
          }],
          [16, b => { pose('john', 'stand'); pose('angel', 'stand'); }],
        ]);
      },
    },

    // ── 13 · 来（启 22:17）────────────────────────────────────────
    {
      kind: 'call', utter: '来', cmd: 'invite --all 来  # 愿意的，都可以白白取生命的水喝', ref: '22:17', hold: 1.6,
      verse: [
        { text: '圣灵和新妇都说：「来！」听见的人也该说：「来！」<br>口渴的人也当来；愿意的，都可以白白取生命的水喝。', ref: '启示录 22:17', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            setL('ncCall', 1, b); sfx(b, 'harp');
            if (!b.instant) { ringAt(b, c.x || W.w * 0.72, c.y || W.h * 0.55, M() * 0.7, [255, 246, 226], 3); for (const q of cityG().gates) ringAt(b, q.x, q.y - q.h * 0.5, M() * 0.35, [255, 250, 236], 2.6); }
          }],
          // 听见的人也该说：「来！」
          [1.4, b => { everyonePose('raise', EMB); everyoneFaceOut(X.rx); }],
          // 远处的人成群而来
          // （自右边远处来，走到河的右岸、岭线之前的坡上——不挤在岭上的人中间）
          [3, b => {
            crowd('folkC', { n: X.nC, x0: 1.03, x1: 1.12, layer: 2, v: X.vC, pose: 'walk', robe: WHITES[0], glow: 0.26, label: '万民' });
            C().crowdWalk('folkC', X.cC0, X.cC1, { speed: 0.036, pose: 'stand' });
            crowd('folkD', { n: X.nD, x0: PORT ? 0.485 : 0.487, x1: PORT ? 0.51 : 0.53, layer: 1, pose: 'stand', robe: WHITES[1], glow: 0.26, label: '万民' });
            C().crowdWalk('folkD', PORT ? 0.495 : 0.51, PORT ? 0.535 : 0.58, { speed: 0.012 });
            S.called = true;
            sfx(b, 'crowd', { soft: true });
          }],
          // 到河边取生命的水
          [7.6, b => { walk('man', X.bankR, { speed: 0.028, pose: 'kneel' }); face('man', -1); }],
          [10, b => {
            for (const id of allPeople()) if (['mother', 'child', 'man'].indexOf(id) < 0) pose(id, 'stand');
            for (const g of ['folkA', 'folkB', 'folkD']) crowdPose(g, 'stand');
            crowdFace('folkC', X.rx);
          }],
          [12.4, b => { setL('ncCall', 0.25, b); }],
        ]);
      },
    },

    // ── 14 · 是了，我必快来（启 22:20–21）──────────────────────────
    {
      kind: 'promise', utter: '是了，我必快来', cmd: 'await 主耶稣  # 阿们！', ref: '22:20',
      verse: [
        { text: '证明这事的说：「是了，我必快来！」<br>阿们！主耶稣啊，我愿你来！', ref: '启示录 22:20', hold: 7 },
        { text: '愿主耶稣的恩惠常与众圣徒同在。阿们！', ref: '启示录 22:21', hold: 9 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            setL('ncGlory', 1, b); W.set('good', 0.55, b.instant); flash(b, 0.45); sfx(b, 'angel'); setL('ncCall', 0, b);
            // 那城内又不用日月光照，也不再有黑夜：时辰就停在日落之后的光里——全书终了之后，日头也不再升起
            //（不论是看完还是恢复存档，都停住：goTo 自 0.8 到 0.8，历时极长；下一次言说或别的幕会照常接管时辰）
            W.goTo(0.8, 1e7);
          }],
          // 众人转向东方的光，举手：阿们！主耶稣啊，我愿你来！
          [1.6, b => { everyoneFaceDir(-1); everyonePose('raise'); pose('angel', 'raise'); face('angel', -1); for (const g of FOLK) crowdGlow(g, 0.4); }],
          [5, b => { sfx(b, 'harp'); }],
          [8.6, b => {
            everyonePose('stand'); pose('angel', 'stand');
            C().embrace('mother', 'child', { at: X.drinkM + 0.012 });
            for (const id of allPeople()) glow(id, 0.52);
          }],
          [12, b => { sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '启示录', books: [66], title: '新天新地', sub: '启示录 21 — 22', tint: [255, 246, 230], music: 'eden',
    outro: 30,
    intro: [
      { text: '但我们照他的应许，盼望新天新地，有义居在其中。', ref: '彼得后书 3:13', hold: 6 },
    ],
    behold: {
      '新天新地': { text: '我又看见一个新天新地；<br>因为先前的天地已经过去了，海也不再有了。', ref: '启示录 21:1' },
      '新耶路撒冷': { text: '我又看见圣城新耶路撒冷由神那里从天而降，<br>预备好了，就如新妇妆饰整齐，等候丈夫。', ref: '启示录 21:2' },
      '神的帐幕': { text: '看哪，神的帐幕在人间。<br>他要与人同住，他们要作他的子民。', ref: '启示录 21:3' },
      '珍珠门': { text: '十二个门是十二颗珍珠，每门是一颗珍珠。<br>城内的街道是精金，好像明透的玻璃。', ref: '启示录 21:21' },
      '根基': { text: '城墙的根基是用各样宝石修饰的：第一根基是碧玉；第二是蓝宝石；第三是绿玛瑙；第四是绿宝石；<br>第五是红玛瑙；第六是红宝石；第七是黄璧玺；第八是水苍玉；第九是红璧玺；第十是翡翠；第十一是紫玛瑙；第十二是紫晶。', ref: '启示录 21:19–20' },
      '宝座': { text: '以后再没有咒诅；在城里有神和羔羊的宝座；<br>他的仆人都要事奉他，也要见他的面。', ref: '启示录 22:3–4' },
      '羔羊': { text: '那城内又不用日月光照；<br>因有神的荣耀光照，又有羔羊为城的灯。', ref: '启示录 21:23' },
      '生命水的河': { text: '天使又指示我在城内街道当中一道生命水的河，<br>明亮如水晶，从神和羔羊的宝座流出来。', ref: '启示录 22:1' },
      '生命树': { text: '在河这边与那边有生命树，结十二样果子，每月都结果子；<br>树上的叶子乃为医治万民。', ref: '启示录 22:2' },
      '晨星': { text: '我是大卫的根，又是他的后裔。我是明亮的晨星。', ref: '启示录 22:16' },
      '约翰': { text: '这些事是我约翰所听见、所看见的。', ref: '启示录 22:8' },
      '天使': { text: '他对我说：「千万不可！……你要敬拜神。」', ref: '启示录 22:9' },
      '母亲': { text: '神要擦去他们一切的眼泪；不再有死亡，<br>也不再有悲哀、哭号、疼痛，因为以前的事都过去了。', ref: '启示录 21:4' },
      '孩子': { text: '神要擦去他们一切的眼泪；不再有死亡。', ref: '启示录 21:4' },
      '老者': { text: '也不再有悲哀、哭号、疼痛，因为以前的事都过去了。', ref: '启示录 21:4' },
      '圣徒': { text: '愿主耶稣的恩惠常与众圣徒同在。阿们！', ref: '启示录 22:21' },
      '万民': { text: '列国要在城的光里行走；地上的君王必将自己的荣耀归与那城。', ref: '启示录 21:24' },
    },
    setup,
    stages: STAGES,
    scene,
  });
})(window.GS);
