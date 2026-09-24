/* ─────────────────────────────────────────────────────────────
 * book/light.js —— 四福音 · 生命的光（约翰福音 3 — 12）
 *
 * 夜里的耶路撒冷：城边一间平顶的屋，院中一盏灯，耶稣坐在灯旁。尼哥德慕举着火把夜里来见他——
 * 「人若不重生，就不能见神的国」：一道光自上头轻轻落下。风随着意思吹，灵的微光掠过全地；
 * 「神爱世人」：从耶稣那里起，普天下的屋里一盏一盏点起灯来；光来到世间——东方破晓。
 * 撒马利亚：叙加城、雅各井、城后的那座山；约有午正。「请你给我水喝」——妇人打水；
 * 「人若喝我所赐的水就永远不渴」：井中涌起一股光的泉源；她留下水罐子跑进城，城里的人出来，田里的庄稼白了。
 * 毕士大池旁的五个廊子：水动的时候，别的病人抢先下去，那病了三十八年的人没有人把他放在池子里——
 * 「起来，拿你的褥子走吧」：不靠池水，只凭一句话；他拿起褥子，往城里走去。
 * 第二日，众人坐船过海，往迦百农去找耶稣；「他从天上赐下粮来」——暖光如吗哪从天上飘落在坐着的人中间，
 * 「我就是生命的粮」：那从天上降下来的光都聚到他身上；许多人退去了，彼得说：「你有永生之道」。
 * 住棚节的夜：殿里的四座大灯台点起；耶稣站着高声说，活水的江河从他那里流出，流到每一个过节的人脚前；
 * 「我是世界的光」——一道暖白的光自他向外一波一波：棚里的灯、全地的灯、殿里的大灯一盏一盏亮起，过节的人都被照亮，转向他（本卷的签名之景）。
 * 生来瞎眼的人：世界是灰的；和泥抹眼，「你往西罗亚池子里去洗」——他一洗，颜色从池边一圈一圈涌回全世界。
 * 羊圈的门开了，好牧人在前头走，羊跟着他；另外的一群也来了，他迎上去，合成一群。
 * 伯大尼：坟墓是个洞，有一块石头挡着。「复活在我，生命也在我」：一道光沿地从他那里奔到石头边，石缝透出光来，坟前开了花；
 * 「耶稣哭了」；石头挪开，「拉撒路出来！」——他裹着细麻从洞里出来，解开，走到姊妹中间。
 * 伯大尼的筵席：马利亚用真哪哒香膏抹耶稣的脚，满屋、满地都是膏的香气；犹大起来说「为什么不卖了周济穷人」——「由她吧！」
 * 末了，耶路撒冷的夜：「应当趁着有光行走」「使你们成为光明之子」——光从他传到众人身上；
 * 「我到世上来，乃是光」——普天下的灯又一盏一盏亮起来，在光里落幕。
 *
 * 画面的方位：左是海（加利利海）；近地是故事发生之处，随话语换景；中丘上是耶路撒冷城与殿（在撒马利亚、加利利时隐去）。
 * 神在新约里：父从不画成形象（光、云、声音）；子是无面目的人，以衣袍与光相认；灵是光、风。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'light';
  const isCur = () => GS.book.current(ACT);
  const JN = '约翰福音 ';

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('lgtWorld', 'lin', 0.16);   // 神爱世人 / 我到世上来，乃是光：普天下点起的灯（自耶稣那里向外一波一波）
  W.defineLevel('lgtFrom', 'exp', 0.5);     // 重生（3:3）：自上头轻轻落下的一道光
  W.defineLevel('lgtWind', 'exp', 0.9);     // 风随着意思吹（3:8）：灵的微光随风掠过
  W.defineLevel('lgtRiver', 'lin', 0.2);    // 活水的江河（7:38）：从耶稣脚前流出，流到每一个过节的人那里
  W.defineLevel('lgtShine', 'lin', 0.13);   // 我是世界的光（8:12）：自耶稣向外的一波暖白的光（点亮灯、人、殿里的大灯）
  W.defineLevel('lgtManna', 'exp', 0.6);    // 他从天上赐下粮来（6:31–33）：暖光如吗哪从天上飘落
  W.defineLevel('lgtGather', 'lin', 0.45);  // 我就是生命的粮（6:35）：飘落的光都聚到他身上
  W.defineLevel('lgtGrey', 'exp', 1.1);     // 生来瞎眼（9:1）：世界是灰的
  W.defineLevel('lgtSee', 'lin', 0.3);      // 他去一洗，回头就看见了（9:7）：颜色自池边涌回
  W.defineLevel('lgtScent', 'exp', 0.32);   // 屋里就满了膏的香气（12:3）

  // ── 地上的位置（画面宽度的比例）──────────────────────────────
  const XL = {
    // 夜里的耶路撒冷：尼哥德慕
    house: 0.785, lampS: 0.736, jNight: 0.708, nic: 0.764, nicIn: 1.04, nicOut: 0.96,
    // 撒马利亚：雅各井、叙加、田
    well: 0.618, jWell: 0.592, woman: 0.648, jarAt: 0.664, field0: 0.69, field1: 0.815, town0: 0.855, town1: 1.05, townGate: 0.905,
    // 毕士大
    pool0: 0.63, pool1: 0.865, lame: 0.617, jPool: 0.584,
    // 迦百农（第二日，众人坐船来找他）
    jCap: 0.6, capIn0: 0.64, capIn1: 0.77, cap0: 0.645, cap1: 0.955, capV0: 0.815, capV1: 1.06, bay: 0.56,
    // 住棚节
    jFeast: 0.615, feast0: 0.675, feast1: 0.955,
    // 西罗亚
    siloam: 0.53, blind: 0.735, jBlind: 0.7, washed: 0.556, jMeet: 0.598,
    // 羊圈
    fold: 0.815, gateX: 0.768, jPast: 0.592, flock0: 0.612, flock1: 0.73, other0: 0.47, other1: 0.572,
    // 伯大尼
    tomb: 0.668, jBeth: 0.525, vill0: 0.845, vill1: 1.05, martha0: 0.822, maryb0: 0.868, jews0: 0.785, jews1: 0.925,
    // 筵席
    table: 0.738, jSup: 0.716, laz: 0.764, marySup: 0.692,
    // 末了：耶路撒冷
    jEnd: 0.63, end0: 0.69, end1: 0.955,
  };
  // 竖屏的手机上：近地的故事收拢到 0.42–0.89 之间；画面以外（≥ 1）的进出之处不变。每一幕开场（setup）按屏幕的形状定下一次。
  // 伯大尼在手机上另排：坟墓挪到右边，村子退到画面边上，好让耶稣、马大、马利亚、拉撒路在坟前各自分得开。
  const XP = { tomb: 0.74, vill0: 0.915, vill1: 1.14, martha0: 0.925, maryb0: 0.958, jews0: 0.852, jews1: 0.985, jBeth: 0.51 };
  const X = Object.assign({}, XL);
  let PORT = false;
  const PX = x => (!PORT || x >= 1 ? x : 0.42 + (x - 0.45) * 0.86);
  function layout() {
    PORT = GS.W.w < GS.W.h * 0.9;
    for (const k in XL) X[k] = PX(XL[k]);
    if (PORT) Object.assign(X, XP);
  }
  // 门徒站在耶稣身后（左边）的间距
  const DG = () => (PORT ? 0.03 : 0.024);

  const ROBE = {
    nic: [72, 66, 104], woman: [168, 96, 82], lame: [124, 114, 100], blind: [128, 116, 102],
    martha: [170, 124, 78], maryb: [112, 92, 140], laz: [150, 118, 90], linen: [240, 236, 224], boy: [176, 150, 108],
  };
  const SICK = [[118, 112, 106], [104, 100, 98], [132, 124, 112], [110, 106, 114], [126, 118, 104]];
  const MOURN = [[74, 66, 72], [88, 78, 80], [64, 60, 68], [96, 84, 78], [80, 74, 86], [70, 70, 76]];
  const SAMAR = [[164, 118, 86], [140, 104, 80], [176, 142, 100], [124, 110, 128], [150, 100, 90], [186, 160, 116]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { worldX: 0.7, fromX: 0.73, seeX: 0.53, scentX: 0.72, shineX: 0.62, mannaX: 0.8 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
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
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = k => Object.assign({}, (C() && C().LOOK && C().LOOK[k]) || {});
  const DROBE = i => { const r = (C() && C().DISCIPLE_ROBES) || [[122, 104, 84], [104, 92, 80], [138, 116, 92]]; return r[i % r.length]; };
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  const FIGK = () => (PORT ? 1.12 : 1);
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, has(id) ? {} : { scale: FIGK() }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function place(id, x, layer) { if (has(id)) C().place(id, x, layer); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { VT.delete(id); if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  // 本卷里耶稣的光不过 0.7（耀眼的白留给下一卷的登山变像）
  function glow(id, v) { if (has(id)) C().glow(id, id === 'jesus' ? Math.min(0.7, v) : v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function babe(id, what) { const c = C(); if (c.carry && has(id)) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function embrace(a, b, o) { const c = C(); if (!has(a) || !has(b)) return; if (c.embrace) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    if (PORT) ms.forEach(m => { m.scale = (m.scale || 1) * FIGK(); });
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const ms = c.herd(gid, Object.assign({ kind: 'sheep', from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    ms.forEach((m, i) => { m.v = lerp(o.v0 || 0.02, o.v1 || 0.2, ((i * 0.618) % 1)); if (PORT) m.scale = (m.scale || 1) * FIGK(); });
    return ms;
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members.filter(m => !m.dying) : []; }
  function cglow(gid, v) { for (const m of cmembers(gid)) m.glow = v; }
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  const spreadV = (v0, v1) => (m, i) => { m.v = lerp(v0, v1, ((i * 0.618) % 1)); };
  const dressCrowd = (pal, v0, v1, g) => (m, i) => { m.robe = pal[i % pal.length]; if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); if (g != null) m.glow = g; };

  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.7, W.h * 0.75];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v) - 34 * LS(l) * k];
  }
  function ringOn(b, id, rgb, r, dur) {
    if (b.instant || !fx()) return;
    const h = headOf(id, 0.55);
    fx().ring(h[0], h[1], rgb || [255, 240, 204], M() * (r || 0.2), dur || 2.2, 1.6);
  }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.6 : frac);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 236, 190], 14 * SU(), 'top');
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 三个门徒站在某处之后（side 1：左边，面向右；side -1：右边，面向左）；手机上伯大尼只有彼得在场，不在的就略过
  const DISC = ['peter', 'john', 'andrew'];
  function discTo(x, o) {
    o = o || {};
    const sd = o.side || 1;
    DISC.forEach((id, i) => {
      const j = sd > 0 ? i : DISC.length - 1 - i;     // 退到右边时，近的先站近处，免得彼此交错
      const tx = x - sd * ((j + 1) * DG() + (o.gap || 0));
      if (o.place) place(id, tx); else walk(id, tx, { speed: o.speed || 0.04, pose: o.pose || 'stand' });
      face(id, o.face || sd);
    });
  }
  function discAdd(x, o) {
    o = o || {};
    add('peter', Object.assign(LOOK('peter'), { x: x - DG(), layer: 2, facing: 1, pose: 'stand', v: o.v || 0 }));
    if (o.only1) return;
    add('john', Object.assign(LOOK('john'), { x: x - 2 * DG(), layer: 2, facing: 1, pose: 'stand', v: (o.v || 0) + 0.04 }));
    add('andrew', Object.assign(LOOK('disciple'), { label: '安得烈', robe: DROBE(2), x: x - 3 * DG(), layer: 2, facing: 1, pose: 'stand', v: (o.v || 0) + 0.02 }));
  }

  // ── 名字：以微尘在人与地方的上头聚成（瞬间重演时不显；两个名字不相叠；桌面上不落在左下经文那一片）──
  const NAMES = [];      // 正显着的名字所占的框 [x0, y0, x1, y1, 到何时]
  function nameAt(b, str, x, y, o) {
    if (b.instant || !fx() || !fx().nameStr || !isFinite(x) || !isFinite(y)) return;
    o = o || {};
    const n = Array.from(str).length;
    const size = Math.max(0.03 * M(), (o.size || (PORT ? 0.05 : 0.036)) * M());
    const half = size * 1.08 * (n - 1) / 2 + size * 0.62;
    let cx = clamp(x, half + 8, W.w - half - 8);
    let cy = y - size * (PORT ? 1.5 : 0.9);
    if (!PORT && cy > W.h * 0.5) cx = Math.min(W.w - half - 8, Math.max(cx, W.w * 0.53 + half));
    if (PORT) cy = Math.max(cy, W.h * 0.42);
    const now = W.t;
    for (let i = NAMES.length - 1; i >= 0; i--) if (NAMES[i][4] < now) NAMES.splice(i, 1);
    for (let tries = 0; tries < 8; tries++) {
      const hit = NAMES.find(q => cx - half < q[2] && cx + half > q[0] && cy - size * 0.72 < q[3] && cy + size * 0.72 > q[1]);
      if (!hit) break;
      cy = hit[1] - size * 0.8;
    }
    const hold = Math.max(3, o.hold || 3.4), delay = o.delay || 0;
    NAMES.push([cx - half, cy - size * 0.72, cx + half, cy + size * 0.72, now + delay + 1.7 + hold + 2 + n * 0.12]);
    const sx = x, sy = y + 30 * SU();
    const src = o.src || (() => [sx + (Math.random() - 0.5) * 80 * SU(), sy + (Math.random() - 0.3) * 40 * SU()]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 236, 198], src, { hold, delay, step: o.step, dot: o.dot });
    const a = au();
    if (a && a.nameChime && !o.quiet) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  // 某人头上（按他将到之处：正走着的，以目的地为准）
  function nameOn(b, id, str, o) {
    const f = fig(id);
    if (!f) return;
    const xf = f.tx != null ? f.tx : f.nx, l = f.layer == null ? 2 : f.layer;
    const head = baseY(l, xf, VT.has(id) ? VT.get(id) : f.v) - 36 * LS(l) * (f.scale || 1);
    nameAt(b, str, xf * W.w, head, o);
  }
  // 地上某处（布景）
  function nameX(b, str, xf, lift, o) { nameAt(b, str, xf * W.w, gY(2, xf) - (lift || 50) * LS(2), o); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // 各物件缓动的量（每秒的线性步长）：a 显隐 · k、k2 各物自己的状态 · open 开 · lit 灯 · m 慢慢的行程（船过海）
  const EASE = { a: 0.7, k: 0.3, k2: 0.28, open: 0.42, lit: 0.6, m: 0.15 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) if (k !== 'a') p[k] = p['t' + k]; }
  // prop(id, kind, { x, x0, x1, v, layer, size, label, show, k, k2, open, lit, now })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, v: 0, layer: 2, size: 1, label: '', seed: hashStr(id), a: 0, ta: 1, dying: false };
      for (const k in EASE) if (k !== 'a') { p[k] = 0; p['t' + k] = 0; }
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'x0', 'x1', 'v', 'layer', 'size', 'label', 'tx', 'xs']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.now) for (const k in EASE) if (k !== 'a' && o[k] != null) p[k] = p['t' + k];
    if (o.show != null) { p.ta = o.show ? 1 : 0; p.dying = false; }
    if (W.replaying) { snap(p); p.a = p.ta; }
    return p;
  }
  const show = (id, on) => prop(id, null, { show: on !== false });
  const getP = id => P.get(id) || null;
  const vis = id => { const p = P.get(id); return p && p.a > 0.004 ? p : null; };
  let sorted = [], sortedN = -1;
  const ORDER = { jeru: 0, mount: 0, village: 1, house: 2, pool: 2, fold: 2, tomb: 2, booths: 3, field: 3, well: 4, siloam: 4, table: 5, mat: 5, jar: 6 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function beam(b, xf, layer, o) {                // 自天而降的一道光，落在某处
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l, v: o.v || 0, w: (o.w || 70) * SU() * (l === 2 ? 1 : 0.7), k: o.k || 1 });
    if (o.ring !== false && fx()) fx().ring(xf * W.w, baseY(l, xf, o.v || 0) - 16 * LS(l), o.rgb || [255, 236, 190], M() * (o.r || 0.24), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, f.layer, Object.assign({ v: f.v }, o)); }

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
        warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([242, 246, 255], 1),
        pale: radial([226, 232, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
        aqua: radial([196, 236, 255], 1, 0.4), soft: radial([255, 240, 214], 1, 0.6),
        ww: radial([255, 246, 228], 1, 0.28), manna: radial([255, 236, 186], 1, 0.3),
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
      // 上窄下宽、两头淡去的一束（自天而降的光、云隙的光）
      const r = cnv(64, 256), q = r.getContext('2d');
      const rz = q.createLinearGradient(0, 0, 64, 0);
      rz.addColorStop(0, 'rgba(255,240,206,0)'); rz.addColorStop(0.5, 'rgba(255,244,216,1)'); rz.addColorStop(1, 'rgba(255,240,206,0)');
      q.fillStyle = rz; q.fillRect(0, 0, 64, 256);
      q.globalCompositeOperation = 'destination-in';
      const rv = q.createLinearGradient(0, 0, 0, 256);
      rv.addColorStop(0, 'rgba(0,0,0,0)'); rv.addColorStop(0.2, 'rgba(0,0,0,0.9)'); rv.addColorStop(0.8, 'rgba(0,0,0,0.55)'); rv.addColorStop(1, 'rgba(0,0,0,0)');
      q.fillStyle = rv; q.fillRect(0, 0, 64, 256);
      SP.ray = r;
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;   // 当前绘制的画布（glowAt 用）
  function glowAt(img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 一小团火苗（灯、火把）
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    const bend = (W.lv.gale || 0) * h * 0.5;
    glowAt(SP.warm, x, y - h * 0.45, h * 2.4, k * (0.28 + 0.5 * nightK()));
    const T4 = [[0, 1, 'rgb(255,128,48)', 0.75], [-0.24, 0.7, 'rgb(255,166,70)', 0.7], [0.22, 0.72, 'rgb(255,146,60)', 0.7], [0, 0.52, 'rgb(255,240,180)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = k * q[3];
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9, y - H * 0.55, sx + Math.sin(W.t * 8 + seed + i) * w * 0.45 + bend, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一间平顶的屋（墙、背光的一面、檐、门、窗、夜里的灯）
  function house(ctx, l, x, y, w, h, tone, o) {
    o = o || {};
    const s = LS(l) * (o.size || 1);
    const d = litX() >= x ? 1 : -1;
    const a0 = ctx.globalAlpha, ex = o.ex || 0;
    ctx.fillStyle = css(tone, l, 1, ex);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), l, 0.9, ex * 0.5);
    const sw = w * 0.22;
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - sw, y - h, sw, h);
    // 灯照在墙上的一片暖光（夜里）
    if (o.warm > 0.01) {
      const gx = o.warmX != null ? o.warmX : x, dir = gx < x ? 1 : -1;
      const gr = ctx.createLinearGradient(gx, 0, gx + dir * w * 1.3, 0);
      gr.addColorStop(0, 'rgba(255,176,100,' + (0.42 * o.warm).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,176,100,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = gr; ctx.fillRect(x - w / 2, y - h - 4.6 * s, w, h + 4.6 * s);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 平顶的檐与矮栏（申 22:8）
    ctx.fillStyle = css(mix(tone, [70, 58, 46], 0.3), l, 1, ex * 0.7);
    ctx.fillRect(x - w / 2 - 1.2 * s, y - h - 1.8 * s, w + 2.4 * s, 2 * s);
    ctx.fillStyle = css(mix(tone, [236, 226, 204], 0.12), l, 1, ex);
    ctx.fillRect(x - w / 2, y - h - 4.6 * s, w, 2.8 * s);
    // 门与窗
    const dx = x + (o.door != null ? o.door : 0) * w, dw = 7 * s, dh = Math.min(h * 0.6, 15 * s);
    ctx.fillStyle = css([28, 22, 18], l);
    if (o.door !== false) { ctx.beginPath(); ctx.moveTo(dx - dw / 2, y); ctx.lineTo(dx - dw / 2, y - dh + dw * 0.4); ctx.quadraticCurveTo(dx, y - dh - dw * 0.15, dx + dw / 2, y - dh + dw * 0.4); ctx.lineTo(dx + dw / 2, y); ctx.closePath(); ctx.fill(); }
    const wx = x + (o.win != null ? o.win : 0.28) * w * (o.flip ? -1 : 1), wy = y - h * 0.68;
    if (o.win !== false) ctx.fillRect(wx - 2.2 * s, wy - 2.6 * s, 4.4 * s, 5.2 * s);
    // 迎光的边
    ctx.strokeStyle = css([255, 240, 214], l, 0.42 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - h - 4.6 * s); ctx.lineTo(x + w / 2, y - h - 4.6 * s);
    if (d > 0) { ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); } else { ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2, y); }
    ctx.stroke();
    // 灯（夜里、黄昏；lampDay：白日也看得见的屋中之光）
    const lk = (o.lamp || 0) * Math.min(1, nightK() * 1.1 + (o.lampDay || 0));
    if (lk > 0.02 && SP) {
      const fl = 0.85 + 0.15 * Math.sin(W.t * 6 + x * 0.1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lk * fl * 0.9) * a0;
      ctx.fillStyle = 'rgb(255,184,104)';
      if (o.win !== false) ctx.fillRect(wx - 2.2 * s, wy - 2.6 * s, 4.4 * s, 5.2 * s);
      if (o.door !== false) {
        ctx.globalAlpha = Math.min(1, lk * fl * 0.55) * a0;
        ctx.beginPath(); ctx.moveTo(dx - dw / 2, y); ctx.lineTo(dx - dw / 2, y - dh + dw * 0.4); ctx.quadraticCurveTo(dx, y - dh - dw * 0.15, dx + dw / 2, y - dh + dw * 0.4); ctx.lineTo(dx + dw / 2, y); ctx.closePath(); ctx.fill();
      }
      glowAt(SP.warm, o.door !== false ? dx : wx, y - dh * 0.6, (o.door !== false ? 30 : 16) * s, lk * fl * 0.45 * a0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a0;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：耶路撒冷（中丘上的城与殿）
  // ════════════════════════════════════════════════════════════
  let JM = null;
  function jeruModel(p) {
    if (JM && JM.key === p.x0 + ':' + p.x1 + ':' + p.tx) return JM;
    const r = U.mulberry32(9127), hs = [];
    const n = 22;
    for (let i = 0; i < n; i++) {
      const xf = lerp(p.x0 + 0.01, p.x1 - 0.008, (i + 0.2 + r() * 0.6) / n);
      if (Math.abs(xf - p.tx) < 0.05) { r(); r(); r(); r(); continue; }
      const near = 1 - clamp(Math.abs(xf - p.tx) / 0.16, 0, 1);
      hs.push({ xf, w: 20 + r() * 14, h: 16 + r() * 12, lift: (4 + r() * 16) * (0.5 + near), tone: r(), win: r() < 0.8, tw: r() * 6, lamp: r() < 0.7 });
    }
    hs.sort((a, b) => b.lift - a.lift);
    const towers = [];
    for (let x = p.x0 + 0.012; x < p.x1 - 0.006; x += 0.052) towers.push(x);
    JM = { key: p.x0 + ':' + p.x1 + ':' + p.tx, hs, towers };
    return JM;
  }
  function drawJeru(ctx, p) {
    const m = jeruModel(p), l = 1, s = LS(1) * p.size, nk = nightK(), d = litX() >= p.tx * W.w ? 1 : -1;
    const A = p.a;
    const lampK = clamp(0.55 + p.lit * 0.6 + W.lv.lgtWorld * 0.5, 0, 1.4);
    // 夜里：城的白石仍依稀可见（灯与月），大灯台点起时殿与近殿的房屋被照亮
    const fkL = p.k * A;
    const exOf = xf => nk * (0.16 + 0.08 * p.lit) + fkL * 0.42 * (1 - clamp(Math.abs(xf - p.tx) / 0.12, 0, 1)) * (0.4 + 0.6 * nk);
    // 房屋：在山上层层叠起（后排在上）
    const wins = [];
    for (const h of m.hs) {
      ctx.globalAlpha = A;
      const x = h.xf * W.w, g = gY(l, h.xf) + 2 * s, top = g - (h.lift + h.h) * s, w = h.w * s;
      const col = mix([196, 178, 146], [226, 212, 184], h.tone);
      ctx.fillStyle = css(col, l, 1, exOf(h.xf));
      ctx.fillRect(x - w / 2, top, w, g - top);
      ctx.fillStyle = css(mix(col, [60, 48, 40], 0.4), l, 0.7);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.24, top, w * 0.24, g - top);
      ctx.fillStyle = css([246, 236, 212], l, 0.45 * dayA(), 0.1);
      ctx.fillRect(x - w / 2, top, w, 1.2 * s);
      if (h.win) { ctx.fillStyle = css([40, 32, 28], l, 0.8); ctx.fillRect(x - w * 0.12, top + h.h * s * 0.3, 2.6 * s, 3.2 * s); wins.push([x - w * 0.12, top + h.h * s * 0.3, h]); }
    }
    // 殿：高台、廊、圣所（白石与金）
    const tx = p.tx * W.w, tg = gY(l, p.tx) + 2 * s;
    const pw = 120 * s, ph = 16 * s, py = tg - ph;
    const exT = exOf(p.tx) + fkL * 0.15;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([200, 186, 156], l, 1, exT);
    ctx.beginPath(); ctx.moveTo(tx - pw / 2 - 8 * s, tg + 2 * s); ctx.lineTo(tx - pw / 2, py); ctx.lineTo(tx + pw / 2, py); ctx.lineTo(tx + pw / 2 + 8 * s, tg + 2 * s); ctx.closePath(); ctx.fill();
    // 廊下的柱（所罗门的廊，10:23）
    ctx.fillStyle = css([226, 216, 192], l, 1, exT);
    ctx.fillRect(tx - pw / 2, py - 11 * s, pw, 2 * s);
    for (let i = 0; i <= 22; i++) { const cx = tx - pw / 2 + (i / 22) * pw; ctx.fillRect(cx - 0.7 * s, py - 10 * s, 1.4 * s, 10 * s); }
    // 圣所与廊（门廊更高）
    const sw = 30 * s, sh = 42 * s, sx = tx + 6 * s;
    ctx.fillStyle = css([238, 232, 216], l, 1, 0.04 + exT);
    ctx.fillRect(sx - sw / 2, py - sh, sw, sh);
    ctx.fillRect(sx - sw / 2 - 12 * s, py - sh - 12 * s, 13 * s, sh + 12 * s);
    ctx.fillStyle = css(mix([238, 232, 216], [80, 70, 60], 0.35), l, 0.8);
    ctx.fillRect(d > 0 ? sx - sw / 2 - 12 * s : sx + sw / 2 - 7 * s, py - (d > 0 ? sh + 12 * s : sh), 7 * s, d > 0 ? sh + 12 * s : sh);
    ctx.fillStyle = css([34, 28, 24], l, 0.85);
    ctx.fillRect(sx - sw / 2 - 8.5 * s, py - 17 * s, 6 * s, 17 * s);
    // 金的顶边
    ctx.fillStyle = css([236, 196, 110], l, 1, 0.12 + exT);
    ctx.fillRect(sx - sw / 2 - 1 * s, py - sh - 2 * s, sw + 2 * s, 2.4 * s);
    ctx.fillRect(sx - sw / 2 - 13 * s, py - sh - 14 * s, 15 * s, 2.4 * s);
    for (let i = 0; i < 6; i++) ctx.fillRect(sx - sw / 2 + i * sw / 5.2, py - sh - 4.4 * s, 1.1 * s, 2.6 * s);
    // 城墙与城楼
    ctx.fillStyle = css([184, 168, 138], l, 1, nk * 0.1);
    ctx.beginPath();
    ctx.moveTo(p.x0 * W.w, gY(l, p.x0) + 3 * s);
    for (let i = 0; i <= 28; i++) { const xf = lerp(p.x0, p.x1, i / 28); ctx.lineTo(xf * W.w, gY(l, xf) - 10 * s); }
    for (let i = 28; i >= 0; i--) { const xf = lerp(p.x0, p.x1, i / 28); ctx.lineTo(xf * W.w, gY(l, xf) + 3 * s); }
    ctx.closePath(); ctx.fill();
    for (const tf of m.towers) {
      const x = tf * W.w, g = gY(l, tf) + 3 * s;
      ctx.fillStyle = css([194, 178, 148], l, 1, exOf(tf));
      ctx.fillRect(x - 5 * s, g - 19 * s, 10 * s, 19 * s);
      for (let j = 0; j < 3; j++) ctx.fillRect(x - 5 * s + j * 3.9 * s, g - 22 * s, 2.2 * s, 3 * s);
      ctx.fillStyle = css([246, 236, 212], l, 0.4 * dayA(), 0.1);
      ctx.fillRect(d > 0 ? x + 4 * s : x - 5 * s, g - 19 * s, 1 * s, 19 * s);
    }
    ctx.fillStyle = css([150, 136, 112], l, 0.45);
    ctx.fillRect(p.x0 * W.w, gY(l, p.x0) - 1 * s, (p.x1 - p.x0) * W.w, 0.8 * s);
    // 迎光的边：殿
    ctx.strokeStyle = css([255, 244, 220], l, 0.5 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(sx - sw / 2 - 12 * s, py - sh - 12 * s); ctx.lineTo(sx - sw / 2 + 1 * s, py - sh - 12 * s); ctx.moveTo(sx - sw / 2, py - sh); ctx.lineTo(sx + sw / 2, py - sh); ctx.stroke();
    // 夜里的灯
    SP || sprites();
    const lk = A * Math.min(1, nk * 1.1 + p.lit * 0.3) * lampK;
    if (lk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,196,118)';
      for (const w of wins) {
        if (!w[2].lamp && p.lit < 0.5 && W.lv.lgtWorld < 0.3) continue;
        const k = lk * (0.7 + 0.3 * Math.sin(W.t * 1.3 + w[2].tw));
        ctx.globalAlpha = Math.min(1, k);
        ctx.fillRect(w[0], w[1], 2.6 * s, 3.2 * s);
        glowAt(SP.warm, w[0] + 1.3 * s, w[1] + 1.6 * s, 9 * s, k * 0.45);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 住棚节殿里的四座大灯台（点起时，全城、全殿都被照亮）
    const fk = p.k * A;
    if (fk > 0.01 && SP) {
      const STANDS = [-58, -30, 36, 64];
      ctx.strokeStyle = css([150, 120, 70], l, 0.9, 0.2); ctx.lineWidth = Math.max(0.7, 1.4 * s);
      ctx.globalAlpha = A;
      ctx.beginPath();
      for (const o of STANDS) { const x = tx + o * s; ctx.moveTo(x, py - 1 * s); ctx.lineTo(x, py - 36 * s); ctx.moveTo(x - 4 * s, py - 36 * s); ctx.lineTo(x + 4 * s, py - 36 * s); }
      ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, tx + 3 * s, py - 30 * s, 170 * s * (0.8 + 0.2 * fk), fk * (0.22 + 0.25 * nk), 0.7);
      ctx.globalCompositeOperation = 'source-over';
      // 「我是世界的光」的那一波到了殿里：四座大灯台一齐腾起（前沿经过时最亮，之后仍比先前亮）
      const sw = shineWave(p.tx, 1), boost = 1 + 0.4 * sw[0] + 0.9 * sw[1];
      for (let i = 0; i < STANDS.length; i++) flame(ctx, tx + STANDS[i] * s, py - 37 * s, 11 * s * boost, fk, i * 2.1);
      ctx.globalCompositeOperation = 'lighter';
      for (const o of STANDS) {
        glowAt(SP.amber, tx + o * s, py - 42 * s, 16 * s * boost, fk * (0.3 + 0.35 * nk));
        glowAt(SP.ww, tx + o * s, py - 42 * s, 26 * s * boost, fk * (0.3 * sw[0] + 0.55 * sw[1]));
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 撒马利亚的那座山（「我们的祖宗在这山上礼拜」4:20）
  function drawMount(ctx, p) {
    const l = 1, s = LS(1), x0 = (p.x - p.x1) * W.w, x1 = (p.x + p.x1) * W.w, H = p.v * s;
    const N = 36, pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, xf = lerp(p.x - p.x1, p.x + p.x1, u);
      const b = Math.pow(Math.sin(Math.PI * u), 1.6) * (1 + 0.08 * U.noise1(u * 7 + 2.3));
      pts.push([xf * W.w, gY(l, xf) + 3 * s - H * b]);
    }
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([112, 122, 96], l);
    ctx.beginPath();
    ctx.moveTo(x0, gY(l, p.x - p.x1) + 4 * s);
    for (const q of pts) ctx.lineTo(q[0], q[1]);
    ctx.lineTo(x1, gY(l, p.x + p.x1) + 4 * s);
    ctx.closePath(); ctx.fill();
    // 背光的一面
    const d = litX() >= p.x * W.w ? 1 : -1;
    ctx.fillStyle = css([50, 58, 50], l, 0.28);
    ctx.beginPath();
    const mid = N / 2 | 0;
    if (d > 0) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 0; i <= mid; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[mid][0] + 4 * s, gY(l, p.x) + 4 * s); ctx.lineTo(x0, gY(l, p.x - p.x1) + 4 * s); }
    else { ctx.moveTo(pts[mid][0], pts[mid][1]); for (let i = mid; i <= N; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(x1, gY(l, p.x + p.x1) + 4 * s); ctx.lineTo(pts[mid][0] - 4 * s, gY(l, p.x) + 4 * s); }
    ctx.closePath(); ctx.fill();
    // 坡上的橄榄树（暗点）
    ctx.fillStyle = css([74, 92, 62], l, 0.9);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const u = 0.12 + 0.76 * hsh(i * 3.1 + 7), k = Math.floor(u * N), q = pts[k];
      const yy = q[1] + (gY(l, lerp(p.x - p.x1, p.x + p.x1, u)) - q[1]) * (0.25 + 0.6 * hsh(i * 5.3)), r = (2.4 + 1.6 * hsh(i)) * s;
      ctx.moveTo(q[0] + r, yy); ctx.ellipse(q[0], yy, r, r * 0.7, 0, 0, TAU);
    }
    ctx.fill();
    // 迎光的边
    ctx.strokeStyle = css([236, 230, 200], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const i0 = d > 0 ? mid - 4 : 2, i1 = d > 0 ? N - 2 : mid + 4;
    for (let i = i0; i <= i1; i++) { if (i === i0) ctx.moveTo(pts[i][0], pts[i][1]); else ctx.lineTo(pts[i][0], pts[i][1]); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：近地的屋与村
  // ════════════════════════════════════════════════════════════
  // 尼哥德慕夜里来见的那屋：平顶、外梯；院中一座灯台（p.k）
  function drawHouse(ctx, p) {
    const l = 2, s = LS(2) * p.size, x = p.x * W.w, w = 56 * s, h = 44 * s;
    const gm = gY(l, p.x), gl = gY(l, p.x - w / (2 * W.w)), y = Math.min(gl, gm) + 3 * s;
    ctx.globalAlpha = p.a;
    // 屋基（坡上）
    const nk = nightK(), ex = nk * (0.2 + 0.25 * p.k);
    ctx.fillStyle = css([132, 116, 94], l, 1, ex * 0.6);
    ctx.fillRect(x - w / 2 - 3 * s, y - 1 * s, w + 30 * s, Math.max(3 * s, gm - y + 5 * s));
    // 外梯（屋的右边，通到房顶）
    ctx.fillStyle = css([150, 132, 104], l, 1, ex * 0.7);
    ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2 + 5 * s, y - h); ctx.lineTo(x + w / 2 + 26 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([110, 96, 78], l, 0.8); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 1; i < 7; i++) { const t = i / 7, sx = x + w / 2 + 5 * s + 21 * s * t, sy = y - h + h * t; ctx.moveTo(sx - 4 * s, sy); ctx.lineTo(sx, sy); }
    ctx.stroke();
    house(ctx, l, x, y, w, h, p.tone || [168, 144, 112], { door: -0.2, win: 0.22, lamp: 0.85 + p.lit, lampDay: p.lit * 0.5, ex, warm: nk * p.k * p.a, warmX: p.x0 * W.w });
    // 院中的灯台
    if (p.k > 0.01) {
      const lx = p.x0 * W.w, ly = gY(l, p.x0) + 1 * s;
      ctx.globalAlpha = p.a;
      ctx.strokeStyle = css([96, 78, 58], l); ctx.lineWidth = Math.max(0.8, 1.6 * s);
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly - 26 * s); ctx.moveTo(lx - 5 * s, ly); ctx.lineTo(lx + 5 * s, ly); ctx.stroke();
      ctx.fillStyle = css([150, 110, 70], l);
      ctx.beginPath(); ctx.ellipse(lx, ly - 27 * s, 4 * s, 1.8 * s, 0, 0, TAU); ctx.fill();
      SP || sprites();
      flame(ctx, lx, ly - 28 * s, 7.5 * s, p.k * p.a, p.seed);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, lx, ly - 22 * s, 90 * s, p.a * p.k * (0.12 + 0.4 * nightK()), 0.8);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 村与城（叙加、伯大尼）：几间屋
  function villageModel(p) {
    if (p.model && p.model.key === p.x0 + ':' + p.x1) return p.model;
    const r = U.mulberry32(p.seed * 7 + 3), hs = [];
    const n = 6;
    for (let i = 0; i < n; i++) {
      const xf = p.x0 + (p.x1 - p.x0) * (i + 0.2 + r() * 0.6) / n;
      hs.push({ xf, w: 40 + r() * 16, h: 32 + r() * 14, lift: r() < 0.5 ? 6 + r() * 14 : 0, door: (r() - 0.5) * 0.5, win: r() < 0.85 ? (r() - 0.5) * 0.7 : false, tone: r() });
    }
    hs.sort((a, b) => b.lift - a.lift);
    p.model = { key: p.x0 + ':' + p.x1, hs };
    return p.model;
  }
  function drawVillage(ctx, p) {
    const m = villageModel(p), l = 2, s = LS(l) * p.size;
    const lamp = clamp(0.6 + p.lit * 0.8 + W.lv.lgtWorld * 0.5, 0, 1.4);
    for (const q of m.hs) {
      ctx.globalAlpha = p.a;
      const x = q.xf * W.w, g = gY(l, q.xf) + 2 * s, lift = q.lift * s, h = q.h * s + lift, w = q.w * s;
      const tone = mix([184, 164, 132], [214, 198, 168], q.tone);
      house(ctx, l, x, g, w, h, tone, { door: lift > 0 ? false : q.door, win: q.win, lamp: lamp * (q.win === false ? 0.6 : 1), lampDay: p.lit * 0.4, ex: nightK() * (0.14 + 0.12 * p.lit), warm: nightK() * p.lit * 0.6, warmX: X.table * W.w });
    }
    // 叙加的城门（p.k）
    if (p.k > 0.01) {
      const gx = p.tx * W.w, g = gY(l, p.tx) + 2 * s;
      ctx.globalAlpha = p.a * p.k;
      ctx.fillStyle = css([176, 158, 126], l);
      ctx.fillRect(gx - 22 * s, g - 50 * s, 12 * s, 50 * s);
      ctx.fillRect(gx + 10 * s, g - 50 * s, 12 * s, 50 * s);
      ctx.fillRect(gx - 22 * s, g - 54 * s, 44 * s, 8 * s);
      ctx.fillStyle = css([30, 24, 20], l);
      ctx.beginPath(); ctx.moveTo(gx - 10 * s, g); ctx.lineTo(gx - 10 * s, g - 30 * s); ctx.quadraticCurveTo(gx, g - 40 * s, gx + 10 * s, g - 30 * s); ctx.lineTo(gx + 10 * s, g); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([250, 238, 214], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(gx - 22 * s, g - 54 * s); ctx.lineTo(gx + 22 * s, g - 54 * s); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：雅各井与活水的泉源；田
  // ════════════════════════════════════════════════════════════
  function wellPos(p) { const s = LS(2) * p.size; return { s, x: p.x * W.w, y: gY(2, p.x) + 4 * s }; }
  function drawWell(ctx, p) {
    const { s, x, y } = wellPos(p);
    const R = 17 * s, rh = 5.6 * s, hh = 9 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([132, 120, 100], 2);
    ctx.beginPath(); ctx.ellipse(x, y - hh, R, rh, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - R, y - hh, 2 * R, hh);
    ctx.beginPath(); ctx.ellipse(x, y, R, rh, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = css([96, 86, 72], 2, 0.7); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) { ctx.moveTo(x + i * R * 0.42, y - hh + rh * 0.9); ctx.lineTo(x + i * R * 0.42, y + rh * 0.8); }
    ctx.moveTo(x - R, y - hh * 0.45); ctx.lineTo(x + R, y - hh * 0.45);
    ctx.stroke();
    ctx.fillStyle = css([22, 28, 38], 2);
    ctx.beginPath(); ctx.ellipse(x, y - hh - 0.2 * s, R * 0.72, rh * 0.62, 0, 0, TAU); ctx.fill();
    // 水光（泉源涌起时满井是光）
    SP || sprites();
    const k = p.k;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(236,244,255)';
    for (let i = 0; i < 4; i++) {
      const gx = x + Math.sin(W.t * 0.9 + i * 1.7 + p.seed) * 7 * s, gy = y - hh + (i - 1.5) * 0.7 * s;
      ctx.globalAlpha = p.a * (0.3 + 0.7 * k) * (0.35 + 0.35 * Math.sin(W.t * 3 + i * 2.1)) * (0.4 + 0.6 * W.daylight + nightK() * 0.3);
      ctx.fillRect(gx - 2 * s, gy - 0.4, 4 * s, Math.max(0.8, 1 * s));
    }
    ctx.globalCompositeOperation = 'source-over';
    // 迎光的边
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.45;
    ctx.strokeStyle = css([226, 210, 180], 2, 1, 0.25); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.ellipse(x, y - hh, R, rh, 0, d > 0 ? Math.PI * 1.5 : Math.PI, d > 0 ? Math.PI * 2 : Math.PI * 1.5); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 泉源：一股光的水自井中涌起，落下又涌起（直涌到永生，4:14）
  function drawSpring(ctx, p) {
    const k = p.k * p.a;
    if (k < 0.01 || !SP) return;
    const { s, x, y } = wellPos(p);
    const top = y - 9 * s, H = (92 + 16 * Math.sin(W.t * 1.3)) * s * k, day = 0.6 + 0.4 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    // 柱
    ctx.globalAlpha = 0.7 * k;
    ctx.drawImage(SP.beam, x - 13 * s, top - H, 26 * s, H + 3 * s);
    glowAt(SP.aqua, x, top - H * 0.4, 80 * s, k * 0.5 * day, 1.3);
    glowAt(SP.white, x, top - H, 30 * s, k * 0.75);
    glowAt(SP.aqua, x, top, 50 * s, k * 0.5, 0.4);
    // 水珠：抛物线升落
    ctx.fillStyle = 'rgb(226,244,255)';
    const N = 48;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.42 + i / N + hsh(i) * 0.3);
      const dir = (i % 2 ? 1 : -1) * (0.3 + 0.7 * hsh(i * 3.7));
      const px = x + dir * 36 * s * ph, py = top - H * (1 - Math.pow(ph * 2 - 1, 2)) * (0.75 + 0.25 * hsh(i * 1.9)) - H * 0.12 * (1 - ph);
      ctx.globalAlpha = k * (0.95 - 0.5 * ph);
      const r = (1.3 + hsh(i * 5.1) * 1.2) * s * 0.85;
      ctx.beginPath(); ctx.arc(px, py, Math.max(0.7, r), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 田：一行一行的麦子，青 → 黄 → 白（「庄稼已经熟了」4:35）；k2 一道光掠过全田
  function drawField(ctx, p) {
    const l = 2, s = LS(2), x0 = p.x0 * W.w, x1 = p.x1 * W.w, ripe = p.k;
    const green = [92, 136, 66], gold = [222, 196, 118], white = [240, 232, 200];
    const col = ripe < 0.7 ? mix(green, gold, ripe / 0.7) : mix(gold, white, (ripe - 0.7) / 0.3);
    const sway = Math.sin(W.t * 1.3) * 1.6 * s * (1 + 2 * (W.lv.gale || 0));
    ctx.globalAlpha = p.a;
    // 垄
    ctx.fillStyle = css([112, 92, 64], l, 0.55);
    ctx.beginPath();
    ctx.moveTo(x0, baseY(l, p.x0, 0.02));
    for (let i = 0; i <= 12; i++) { const xf = lerp(p.x0, p.x1, i / 12); ctx.lineTo(xf * W.w, baseY(l, xf, 0.01)); }
    for (let i = 12; i >= 0; i--) { const xf = lerp(p.x0, p.x1, i / 12); ctx.lineTo(xf * W.w, baseY(l, xf, 0.3)); }
    ctx.closePath(); ctx.fill();
    const ROWS = [0.03, 0.1, 0.17, 0.24];
    const step = Math.max(2.2, 3.2 * s);
    for (let r = 0; r < ROWS.length; r++) {
      const v = ROWS[r], sc = 1 + 0.35 * v;
      ctx.strokeStyle = css(mix(col, [40, 50, 30], 0.12 * (ROWS.length - r - 1)), l);
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath();
      const tops = [];
      for (let x = x0 + (r % 2) * step * 0.5; x <= x1; x += step) {
        const xf = x / W.w, gy = baseY(l, xf, v) + 1, hh = (13 + 4 * hsh(x * 0.37 + r)) * s * sc * (0.55 + 0.45 * Math.min(1, ripe + 0.4));
        const sw = sway * (0.6 + 0.4 * Math.sin(x * 0.05 + W.t));
        ctx.moveTo(x, gy); ctx.quadraticCurveTo(x + sw * 0.4, gy - hh * 0.55, x + sw, gy - hh);
        tops.push(x + sw, gy - hh);
      }
      ctx.stroke();
      if (ripe > 0.2) {
        ctx.fillStyle = css(mix(col, [255, 250, 230], 0.15), l, Math.min(1, (ripe - 0.2) * 2));
        ctx.beginPath();
        for (let i = 0; i < tops.length; i += 2) { const tx = tops[i], ty = tops[i + 1]; ctx.moveTo(tx + 1.1 * s, ty); ctx.ellipse(tx, ty, 1.1 * s * sc, 2.6 * s * sc, 0.2, 0, TAU); }
        ctx.fill();
      }
    }
    // 一道光掠过全田
    const wk = Math.sin(Math.PI * clamp(p.k2, 0, 1));
    if (wk > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 3; j++) {
        const u = clamp(p.k2 * 1.2 - 0.1 - j * 0.06, 0, 1), xf = lerp(p.x0, p.x1, u);
        glowAt(SP.gold, xf * W.w, baseY(l, xf, 0.14) - 10 * s, (0.05 + j * 0.02) * W.w, wk * (0.3 - j * 0.08), 0.45);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 留下的水罐子（4:28）
  function drawJar(ctx, p) {
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v) + 1 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([184, 122, 78], 2);
    ctx.beginPath(); ctx.moveTo(x - 2 * s, y); ctx.quadraticCurveTo(x - 6 * s, y - 5 * s, x - 2.2 * s, y - 10 * s); ctx.lineTo(x + 2.2 * s, y - 10 * s); ctx.quadraticCurveTo(x + 6 * s, y - 5 * s, x + 2 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillRect(x - 2.4 * s, y - 11.4 * s, 4.8 * s, 1.6 * s);
    ctx.strokeStyle = css([236, 200, 160], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(x + 2.2 * s, y - 9.5 * s); ctx.quadraticCurveTo(x + 5.6 * s, y - 5 * s, x + 2 * s, y - 0.5 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：毕士大的五个廊子与池子；西罗亚池子；褥子
  // ════════════════════════════════════════════════════════════
  function drawPool(ctx, p) {
    const l = 2, s = LS(2), x0 = p.x0 * W.w, x1 = p.x1 * W.w, d = litX() >= (x0 + x1) / 2 ? 1 : -1;
    const g0 = gY(l, p.x0), g1 = gY(l, p.x1), gb = Math.max(g0, g1) + 2 * s;
    const H = 44 * s;
    ctx.globalAlpha = p.a;
    // 廊后的墙
    ctx.fillStyle = css([150, 134, 108], l);
    ctx.fillRect(x0, gb - H, x1 - x0, H);
    ctx.fillStyle = css([90, 78, 64], l, 0.55);
    ctx.fillRect(x0, gb - H + 6 * s, x1 - x0, H - 6 * s);
    // 屋顶与额枋
    ctx.fillStyle = css([196, 180, 150], l);
    ctx.fillRect(x0 - 5 * s, gb - H - 5 * s, x1 - x0 + 10 * s, 6 * s);
    ctx.fillStyle = css([222, 208, 180], l, 1, 0.04);
    ctx.fillRect(x0 - 5 * s, gb - H - 6.5 * s, x1 - x0 + 10 * s, 1.8 * s);
    // 六根柱，五个廊子（5:2）
    for (let i = 0; i <= 5; i++) {
      const cx = lerp(x0 + 5 * s, x1 - 5 * s, i / 5);
      ctx.fillStyle = css([214, 200, 172], l);
      ctx.fillRect(cx - 3 * s, gb - H + 1 * s, 6 * s, H - 1 * s);
      ctx.fillRect(cx - 4.5 * s, gb - H, 9 * s, 2.4 * s);
      ctx.fillRect(cx - 4.5 * s, gb - 2.4 * s, 9 * s, 2.4 * s);
      ctx.fillStyle = css([236, 228, 206], l, 0.5 * dayA(), 0.15);
      ctx.fillRect(d > 0 ? cx + 1.6 * s : cx - 3 * s, gb - H + 2 * s, 1.4 * s, H - 4 * s);
    }
    // 池：廊前一方水（有台阶）
    const pa = lerp(p.x0, p.x1, 0.1), pb = lerp(p.x0, p.x1, 0.9);
    const ya = baseY(l, (pa + pb) / 2, 0.16), yb = baseY(l, (pa + pb) / 2, 0.42);
    const xa = pa * W.w, xb = pb * W.w, ins = (yb - ya) * 0.35;
    ctx.fillStyle = css([170, 156, 128], l);
    ctx.beginPath(); ctx.moveTo(xa - 6 * s, ya - 2 * s); ctx.lineTo(xb + 6 * s, ya - 2 * s); ctx.lineTo(xb + 6 * s + ins, yb + 3 * s); ctx.lineTo(xa - 6 * s - ins, yb + 3 * s); ctx.closePath(); ctx.fill();
    const wg = ctx.createLinearGradient(0, ya, 0, yb);
    const wa = W.shade([70, 128, 150], 0), wb = W.shade([40, 84, 110], 0);
    wg.addColorStop(0, U.rgb(wa[0], wa[1], wa[2])); wg.addColorStop(1, U.rgb(wb[0], wb[1], wb[2]));
    ctx.fillStyle = wg;
    ctx.beginPath(); ctx.moveTo(xa, ya + 1.5 * s); ctx.lineTo(xb, ya + 1.5 * s); ctx.lineTo(xb + ins * 0.8, yb); ctx.lineTo(xa - ins * 0.8, yb); ctx.closePath(); ctx.fill();
    // 水光
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(230,242,255)';
    for (let i = 0; i < 9; i++) {
      const u = U.fract(hsh(i * 3.1) + W.t * 0.02 * (i % 2 ? 1 : -1)), gx = lerp(xa + 4 * s, xb - 4 * s, u), gy = lerp(ya + 3 * s, yb - 2 * s, hsh(i * 7.7));
      ctx.globalAlpha = p.a * (0.25 + 0.25 * Math.sin(W.t * 2 + i * 1.9)) * (0.4 + 0.6 * W.daylight);
      ctx.fillRect(gx - 3 * s, gy, 6 * s, Math.max(0.8, 0.8 * s));
    }
    if (p.k > 0.02) glowAt(SP.aqua, (xa + xb) / 2, (ya + yb) / 2, (xb - xa) * 0.45, p.a * p.k * 0.35, 0.3);
    // 水动的时候（5:7）：池面一圈一圈荡开
    if (p.k2 > 0.02) {
      const cxw = (xa + xb) / 2, cyw = (ya + yb) / 2, ww = xb - xa, hh = yb - ya;
      ctx.strokeStyle = 'rgb(226,242,255)'; ctx.lineWidth = Math.max(0.7, 1 * s);
      for (let i = 0; i < 6; i++) {
        const ph = U.fract(W.t * 0.4 + i / 6), ox = (hsh(i * 3.3) - 0.5) * ww * 0.55, oy = (hsh(i * 1.7) - 0.5) * hh * 0.35;
        ctx.globalAlpha = p.a * p.k2 * 0.6 * (1 - ph) * (0.5 + 0.5 * W.daylight);
        ctx.beginPath(); ctx.ellipse(cxw + ox, cyw + oy, ww * 0.13 * (0.25 + ph), hh * 0.16 * (0.25 + ph), 0, 0, TAU); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // 台阶
    ctx.strokeStyle = css([210, 196, 166], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 1; i <= 3; i++) { const t = i / 4, yy = lerp(ya, yb, t); ctx.moveTo(xa - ins * t - 5 * s, yy); ctx.lineTo(xa - ins * t + 8 * s, yy); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawSiloam(ctx, p) {
    const l = 2, s = LS(2), xa = (p.x - 0.045) * W.w, xb = (p.x + 0.04) * W.w;
    const ya = baseY(l, p.x, 0.2), yb = baseY(l, p.x, 0.42), ins = (yb - ya) * 0.4;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([166, 150, 122], l);
    ctx.beginPath(); ctx.moveTo(xa - 7 * s, ya - 2 * s); ctx.lineTo(xb + 7 * s, ya - 2 * s); ctx.lineTo(xb + 7 * s + ins, yb + 4 * s); ctx.lineTo(xa - 7 * s - ins, yb + 4 * s); ctx.closePath(); ctx.fill();
    // 台阶（左边一级一级下到水里）
    ctx.fillStyle = css([196, 180, 150], l);
    for (let i = 0; i < 4; i++) { const t = i / 4, yy = lerp(ya, yb, t); ctx.fillRect(xa - ins * t - 6 * s, yy, 16 * s - i * 2 * s, 2 * s); }
    const wg = ctx.createLinearGradient(0, ya, 0, yb);
    const wa = W.shade([84, 140, 160], 0), wb = W.shade([44, 90, 118], 0);
    wg.addColorStop(0, U.rgb(wa[0], wa[1], wa[2])); wg.addColorStop(1, U.rgb(wb[0], wb[1], wb[2]));
    ctx.fillStyle = wg;
    ctx.beginPath(); ctx.moveTo(xa + 10 * s, ya + 1.5 * s); ctx.lineTo(xb, ya + 1.5 * s); ctx.lineTo(xb + ins * 0.8, yb); ctx.lineTo(xa + 2 * s - ins * 0.8, yb); ctx.closePath(); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(230,242,255)';
    for (let i = 0; i < 6; i++) {
      const u = U.fract(hsh(i * 2.3) + W.t * 0.025 * (i % 2 ? 1 : -1)), gx = lerp(xa + 14 * s, xb - 4 * s, u), gy = lerp(ya + 3 * s, yb - 2 * s, hsh(i * 5.7));
      ctx.globalAlpha = p.a * (0.3 + 0.25 * Math.sin(W.t * 2 + i * 1.9)) * (0.4 + 0.6 * W.daylight);
      ctx.fillRect(gx - 3 * s, gy, 6 * s, Math.max(0.8, 0.8 * s));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 病人的褥子（5:8–9）
  function drawMat(ctx, p) {
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v) + 1.5 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 132, 104], 2);
    ctx.beginPath(); ctx.ellipse(x, y, 28 * s, 3.4 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([110, 90, 70], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.ellipse(x, y, 24 * s, 2.2 * s, 0, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：加利利海上的船；十二个篮子；住棚节的棚
  // ════════════════════════════════════════════════════════════
  // 众人坐船过海往迦百农去找耶稣（6:24）：几只船从远处的海上驶来，绕过中丘的西端，泊在近地背后的湾里
  //   （船在哪一片水上，就在哪一趟画：中丘之后的 seaMid 或之前的 seaNear）
  function boatPos(p, i) {
    const hz = W.horizonY, wl = W.waterlineY(1), u0 = Math.max(0.6, W.unit);
    const u = smoothstep(0, 1, clamp(p.m * 1.18 - i * 0.08, 0, 1));
    const x0 = 0.1 + i * 0.05, y0 = lerp(hz, wl, 0.42 + i * 0.1);
    const x1 = PORT ? 0.34 : 0.42, y1 = wl + (2 + i * 3) * u0;
    const x2 = p.x1 + i * (PORT ? 0.075 : 0.058), y2 = wl + (9 + i * 5) * u0;
    const A = (1 - u) * (1 - u), B = 2 * u * (1 - u), Cc = u * u;
    return [(A * x0 + B * x1 + Cc * x2) * W.w, A * y0 + B * y1 + Cc * y2, u];
  }
  function drawBoats(ctx, p, pass) {
    const wl = W.waterlineY(1);
    for (let i = 0; i < 3; i++) {
      const q = boatPos(p, i);
      if ((q[1] < wl ? 'seaMid' : 'seaNear') !== pass) continue;
      const s = W.seaScale(q[1]) * 1.6, x = q[0] + Math.sin(W.t * 0.3 + i) * 2, y = q[1] + Math.sin(W.t * 1.1 + i * 2) * 0.8 * s;
      const L = 30 * s, hd = 5 * s;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = W.shadeCSS([86, 64, 46], 0.3);
      ctx.beginPath(); ctx.moveTo(x - L / 2, y - hd); ctx.quadraticCurveTo(x - L * 0.3, y + hd * 0.7, x, y + hd * 0.6); ctx.quadraticCurveTo(x + L * 0.35, y + hd * 0.6, x + L / 2 + 2 * s, y - hd * 1.1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = W.shadeCSS([70, 54, 40], 0.3); ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.moveTo(x - 2 * s, y - hd * 0.4); ctx.lineTo(x - 2 * s, y - 26 * s); ctx.stroke();
      // 帆：行船时张着，泊了便收起一半
      const furl = 1 - 0.55 * smoothstep(0.85, 1, q[2]);
      ctx.fillStyle = W.shadeCSS([226, 214, 190], 0.3);
      ctx.beginPath(); ctx.moveTo(x - 2 * s, y - 25 * s); ctx.quadraticCurveTo(x + 8 * s * furl, y - 16 * s, x + 1 * s, y - 25 * s + 18 * s * furl); ctx.lineTo(x - 2 * s, y - 25 * s + 18 * s * furl); ctx.closePath(); ctx.fill();
      // 倒影与船后的水纹
      ctx.globalAlpha = p.a * 0.2;
      ctx.fillStyle = W.shadeCSS([40, 34, 30], 0.3);
      ctx.fillRect(x - L * 0.4, y + hd * 0.8, L * 0.8, 1.2 * s);
      if (q[2] < 0.97) {
        ctx.globalAlpha = p.a * 0.3 * (1 - q[2]);
        ctx.fillStyle = W.shadeCSS([236, 240, 244], 0.3);
        ctx.fillRect(x - L * 1.1, y + hd * 0.3, L * 0.55, Math.max(0.6, 0.8 * s));
      }
    }
    ctx.globalAlpha = 1;
  }
  const BLEAF = [[62, 96, 52], [84, 118, 60], [104, 128, 64], [74, 110, 70]];
  function drawBooths(ctx, p) {
    const s = LS(2);
    SP || sprites();
    const xs = p.xs || [];
    for (let i = 0; i < xs.length; i++) {
      const xf = xs[i], x = xf * W.w, y = gY(2, xf) + 3 * s, w = (40 + 8 * hsh(i * 3.3)) * s, H = w * 0.78;
      ctx.globalAlpha = p.a;
      ctx.strokeStyle = css([98, 72, 46], 2); ctx.lineWidth = Math.max(0.8, 1.6 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - w * 0.46, y); ctx.lineTo(x - w * 0.4, y - H);
      ctx.moveTo(x + w * 0.46, y); ctx.lineTo(x + w * 0.4, y - H);
      ctx.moveTo(x - w * 0.5, y - H); ctx.lineTo(x + w * 0.5, y - H);
      ctx.stroke();
      ctx.lineCap = 'butt';
      // 夜里棚中的灯
      const nk = nightK();
      if (nk > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.warm, x, y - H * 0.35, w * 0.9, p.a * nk * 0.55);
        ctx.fillStyle = 'rgb(255,204,124)';
        ctx.globalAlpha = p.a * nk;
        ctx.beginPath(); ctx.arc(x, y - H * 0.35, Math.max(0.8, 1.3 * s), 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      // 「我是世界的光」那一波经过：棚里的灯与檐下挂的小灯一齐亮起（暖白）
      const sw = shineWave(xf, 2), sk = sw[0] * 0.8 + sw[1];
      if (sk > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.ww, x, y - H * 0.4, w * (0.75 + 0.8 * sw[1]), p.a * (0.3 * sw[0] + 0.45 * sw[1]));
        ctx.fillStyle = 'rgb(255,248,232)';
        for (let j = -1; j <= 1; j++) {
          const lx = x + j * w * 0.3, ly = y - H + 6 * s;
          glowAt(SP.ww, lx, ly, 9 * s, p.a * (0.45 * sw[0] + 0.5 * sw[1]));
          ctx.globalAlpha = p.a * Math.min(1, sk);
          ctx.beginPath(); ctx.arc(lx, ly, Math.max(0.9, 1.4 * s), 0, TAU); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      // 顶上的枝叶（棕树枝、橄榄枝、番石榴枝……尼 8:15）
      for (let c = 0; c < 4; c++) {
        ctx.globalAlpha = p.a;
        ctx.fillStyle = css(BLEAF[c], 2, 1, 0.03 * c);
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const q = hsh(i * 17 + c * 5 + j), ex = x + (j / 4 - 0.5) * w * 0.95 + (q - 0.5) * 4 * s, ey = y - H - (1.5 + 3 * hsh(q * 9)) * s;
          const sw = Math.sin(W.t * 1.1 + i + j) * 0.6 * s;
          ctx.moveTo(ex + 6 * s, ey); ctx.ellipse(ex + sw, ey, (6 + 3 * q) * s, (2.4 + 1.2 * q) * s, (q - 0.5) * 0.6, 0, TAU);
        }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：羊圈（后墙在人之前画，前墙在人之后画）
  // ════════════════════════════════════════════════════════════
  function foldGeom(p) {
    const s = LS(2), cx = p.x * W.w, cy = baseY(2, p.x, 0.15), rx = 62 * s * (PORT ? 0.9 : 1), ry = 15 * s, hw = 9 * s;
    return { s, cx, cy, rx, ry, hw };
  }
  const GATE_A = Math.PI * 0.86;     // 门在左前方
  function drawFoldPart(ctx, p, front) {
    const G = foldGeom(p), { s, cx, cy, rx, ry, hw } = G;
    const a0 = front ? 0 : Math.PI, a1 = front ? Math.PI : TAU;
    ctx.globalAlpha = p.a;
    const N = 28;
    const seg = (b0, b1) => {
      const pts = [];
      for (let i = 0; i <= N; i++) { const a = lerp(b0, b1, i / N); pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
      ctx.fillStyle = css(front ? [150, 138, 116] : [124, 114, 98], 2);
      ctx.beginPath();
      pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1] - hw) : ctx.moveTo(q[0], q[1] - hw)));
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + 1 * s);
      ctx.closePath(); ctx.fill();
      // 石缝
      ctx.strokeStyle = css([96, 88, 74], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath();
      pts.forEach((q, i) => { if (i % 2) { ctx.moveTo(q[0], q[1] - hw * 0.45); ctx.lineTo(q[0] + 3 * s, q[1] - hw * 0.45); } });
      ctx.stroke();
      // 顶上的一道光边
      ctx.strokeStyle = css([236, 226, 204], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1] - hw) : ctx.moveTo(q[0], q[1] - hw))); ctx.stroke();
    };
    if (!front) seg(a0, a1);
    else {
      const gw = 0.2;
      seg(0, GATE_A - gw);
      seg(GATE_A + gw, Math.PI);
      // 门：关着时横在门口；开了便向外转
      const ax = cx + Math.cos(GATE_A + gw) * rx, ay = cy + Math.sin(GATE_A + gw) * ry;
      const bx0 = cx + Math.cos(GATE_A - gw) * rx, by0 = cy + Math.sin(GATE_A - gw) * ry;
      const ang = Math.atan2(by0 - ay, bx0 - ax) + p.open * 1.9, L = Math.hypot(bx0 - ax, by0 - ay);
      const bx = ax + Math.cos(ang) * L, by = ay + Math.sin(ang) * L * 0.6;
      ctx.fillStyle = css([112, 84, 58], 2);
      ctx.beginPath(); ctx.moveTo(ax, ay - hw * 1.1); ctx.lineTo(bx, by - hw * 1.1); ctx.lineTo(bx, by + 0.5 * s); ctx.lineTo(ax, ay + 0.5 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([80, 60, 42], 2, 0.9); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(ax, ay - hw * 0.5); ctx.lineTo(bx, by - hw * 0.5); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：伯大尼的坟墓（是个洞，有一块石头挡着 11:38）
  // ════════════════════════════════════════════════════════════
  const MOUTH = -0.006;      // 洞口相对坟墓中心（画面宽度的比例）
  function tombGeom(p) {
    const s = LS(2) * (PORT ? 0.9 : 1), x = p.x * W.w, y = gY(2, p.x) + 4 * s;
    return { s, x, y, mx: (p.x + MOUTH) * W.w, mw: 13 * s, mh: 36 * s, R: 17 * s };
  }
  function drawTomb(ctx, p) {
    const G = tombGeom(p), { s, x, y, mx, mw, mh, R } = G;
    const hw = 64 * s, H = 64 * s;
    ctx.globalAlpha = p.a;
    // 岩
    const pts = [[-1, 0.02], [-0.92, -0.35], [-0.7, -0.66], [-0.4, -0.86], [-0.08, -1], [0.3, -0.93], [0.62, -0.74], [0.86, -0.46], [1, -0.1], [1.04, 0.04]];
    ctx.fillStyle = css([140, 128, 110], 2);
    ctx.beginPath();
    pts.forEach((q, i) => { const X1 = x + q[0] * hw, Y1 = y + q[1] * H; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    // 岩的明暗与裂纹
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([70, 62, 56], 2, 0.3);
    ctx.beginPath(); ctx.moveTo(x - d * 0.1 * hw, y - H); pts.forEach(q => { if (q[0] * d <= 0.05) ctx.lineTo(x + q[0] * hw, y + q[1] * H); }); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([96, 86, 74], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x + 0.3 * hw, y - 0.9 * H); ctx.lineTo(x + 0.38 * hw, y - 0.6 * H); ctx.lineTo(x + 0.52 * hw, y - 0.5 * H);
    ctx.moveTo(x - 0.6 * hw, y - 0.6 * H); ctx.lineTo(x - 0.5 * hw, y - 0.4 * H); ctx.stroke();
    ctx.strokeStyle = css([236, 226, 204], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    let st = false;
    pts.forEach(q => { if (q[0] * d < -0.2) return; const X1 = x + q[0] * hw, Y1 = y + q[1] * H; if (st) ctx.lineTo(X1, Y1); else { ctx.moveTo(X1, Y1); st = true; } });
    ctx.stroke();
    // 岩顶的小树
    ctx.fillStyle = css([74, 96, 60], 2);
    ctx.beginPath(); ctx.ellipse(x + 0.2 * hw, y - H * 1.02, 12 * s, 6 * s, 0, 0, TAU); ctx.ellipse(x + 0.34 * hw, y - H * 0.97, 8 * s, 4.6 * s, 0, 0, TAU); ctx.fill();
    // 洞口
    ctx.fillStyle = css([14, 12, 10], 2);
    ctx.beginPath(); ctx.moveTo(mx - mw, y); ctx.lineTo(mx - mw, y - mh * 0.7); ctx.quadraticCurveTo(mx, y - mh * 1.18, mx + mw, y - mh * 0.7); ctx.lineTo(mx + mw, y); ctx.closePath(); ctx.fill();
    SP || sprites();
    if (p.lit > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * p.lit * 0.7;
      ctx.fillStyle = 'rgb(255,236,196)';
      ctx.beginPath(); ctx.moveTo(mx - mw * 0.8, y); ctx.lineTo(mx - mw * 0.8, y - mh * 0.66); ctx.quadraticCurveTo(mx, y - mh * 1.08, mx + mw * 0.8, y - mh * 0.66); ctx.lineTo(mx + mw * 0.8, y); ctx.closePath(); ctx.fill();
      glowAt(SP.gold, mx, y - mh * 0.5, mw * 6, p.a * p.lit * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 挡着的圆石：挪开（向右滚开，11:41）
    const o = smoothstep(0, 1, p.open), sx = mx + o * (mw + R * 1.25), sy = y - R + 1 * s;
    ctx.fillStyle = css([150, 138, 120], 2);
    ctx.beginPath(); ctx.ellipse(sx, sy, R * 0.55, R, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([118, 108, 94], 2);
    ctx.beginPath(); ctx.ellipse(sx + R * 0.18, sy, R * 0.34, R * 0.94, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([96, 86, 74], 2, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    const rot = o * 4.2;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const a = rot + i * 2.1; ctx.moveTo(sx + Math.cos(a) * R * 0.1, sy + Math.sin(a) * R * 0.3); ctx.lineTo(sx + Math.cos(a) * R * 0.4, sy + Math.sin(a) * R * 0.85); }
    ctx.stroke();
    ctx.strokeStyle = css([236, 226, 204], 2, 0.4 * dayA(), 0.2);
    ctx.beginPath(); ctx.ellipse(sx, sy, R * 0.55, R, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    // 「复活在我」（11:25）：石头的四边透出光来（石头挪开之后便只剩洞里的光）
    const rim = p.k * (1 - o);
    if (rim > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, sx - R * 0.1, sy, R * 2.4, p.a * rim * 0.55, 1.25);
      ctx.strokeStyle = 'rgb(255,238,196)'; ctx.lineWidth = Math.max(1.2, 2 * s);
      ctx.globalAlpha = p.a * rim * (0.75 + 0.15 * Math.sin(W.t * 2.2));
      ctx.beginPath(); ctx.ellipse(sx, sy, R * 0.6, R * 1.05, 0, 0, TAU); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    if (p.k2 > 0.01) drawTombFlowers(ctx, p);
    ctx.globalAlpha = 1;
  }
  // 坟前开了花（11:25 之后）：从坟墓那里向两边一丛一丛地开
  const FLW = [[250, 250, 244], [255, 214, 96], [236, 96, 110], [196, 150, 230], [255, 186, 204]];
  function drawTombFlowers(ctx, p) {
    const s = LS(2), k = p.k2, span = PORT ? 0.26 : 0.21;
    for (let i = 0; i < 56; i++) {
      const u = hsh(i * 7.3 + 1), xf = p.x + (u - 0.5) * span, v = 0.03 + 0.36 * hsh(i * 3.9 + 2);
      const g = clamp(k * 1.7 - hsh(i * 5.1) * 0.5 - Math.abs(u - 0.5) * 1.2, 0, 1);
      if (g <= 0) continue;
      const x = xf * W.w, y = baseY(2, xf, v) + 1, sc = 1 + 0.4 * v, h = (4.5 + 4 * hsh(i * 2.2)) * s * sc * g;
      ctx.globalAlpha = p.a;
      ctx.strokeStyle = css(i % 2 ? [84, 142, 62] : [104, 156, 70], 2); ctx.lineWidth = Math.max(0.6, 0.75 * s);
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 1 * s, y - h * 0.5, x, y - h);
      ctx.moveTo(x, y - h * 0.25); ctx.lineTo(x - 2.4 * s * g, y - h * 0.55);
      ctx.moveTo(x, y); ctx.lineTo(x + 2.6 * s * g, y - h * 0.7);
      ctx.stroke();
      if (i % 4 !== 3) {
        const c = FLW[i % FLW.length], r = (1.3 + 0.8 * hsh(i * 4.4)) * s * sc * g;
        ctx.fillStyle = css(c, 2, 1, 0.12);
        ctx.beginPath(); ctx.arc(x, y - h, Math.max(0.7, r), 0, TAU); ctx.fill();
        ctx.fillStyle = css([255, 226, 120], 2, 1, 0.1);
        ctx.beginPath(); ctx.arc(x, y - h, Math.max(0.4, r * 0.35), 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：伯大尼的筵席（矮桌、饼与杯、两座灯台、地上的席）
  // ════════════════════════════════════════════════════════════
  function drawTable(ctx, p) {
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, 0.12), w = 58 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([140, 60, 52], 2, 0.85);
    ctx.beginPath(); ctx.ellipse(x, y + 3 * s, w * 1.3, 7 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([118, 84, 56], 2);
    ctx.fillRect(x - w / 2, y - 7 * s, w, 3 * s);
    ctx.fillRect(x - w / 2 + 3 * s, y - 4 * s, 2.4 * s, 5 * s);
    ctx.fillRect(x + w / 2 - 5.4 * s, y - 4 * s, 2.4 * s, 5 * s);
    ctx.fillStyle = css([214, 176, 110], 2, 1, 0.05);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(x - w * 0.34 + i * w * 0.2, y - 8.4 * s, 3.4 * s, 1.6 * s, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = css([170, 112, 70], 2);
    ctx.fillRect(x + w * 0.08, y - 11 * s, 2.6 * s, 3.6 * s);
    ctx.fillRect(x - w * 0.12, y - 11 * s, 2.6 * s, 3.6 * s);
    // 灯台
    SP || sprites();
    for (const o of [-0.78, 0.78]) {
      const lx = x + o * w, ly = y + 2 * s;
      ctx.globalAlpha = p.a;
      ctx.strokeStyle = css([96, 78, 58], 2); ctx.lineWidth = Math.max(0.8, 1.5 * s);
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly - 30 * s); ctx.moveTo(lx - 4 * s, ly); ctx.lineTo(lx + 4 * s, ly); ctx.stroke();
      flame(ctx, lx, ly - 31 * s, 7 * s, p.a * p.lit, o * 7 + 3);
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, x, y - 16 * s, w * 2.2, p.a * p.lit * (0.2 + 0.5 * nightK()), 0.65);
    glowAt(SP.amber, x, y - 10 * s, w * 1.1, p.a * p.lit * (0.12 + 0.3 * nightK()), 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：光（普天下的灯、自上头的光、风、活水的江河、世界的光、灰与色、香气、天上的声音）
  // ════════════════════════════════════════════════════════════
  // 普天下的灯：远山、中丘、近地，确定的位置（两套：神爱世人 / 我到世上来的橙色灯，与「世界的光」那一波点起的暖白灯）
  const LAMPC = {};
  function lampSpots(seed, want) {
    const key = seed + ':' + W.w + 'x' + W.h;
    if (LAMPC[seed] && LAMPC[seed].key === key) return LAMPC[seed].out;
    const r = U.mulberry32(seed), out = [[], [], []];
    for (let l = 0; l < 3; l++) {
      let tries = 0;
      while (out[l].length < want[l] && tries++ < 400) {
        const xf = l === 0 ? 0.08 + r() * 0.92 : l === 1 ? 0.5 + r() * 0.5 : 0.4 + r() * 0.6;
        const v = l === 2 ? r() * 0.4 : 0, d = r() * 0.12, tw = r() * 6;
        if (!W.hasLandBase(l, xf * W.w, 4)) continue;
        out[l].push({ xf, v, d, tw });
      }
    }
    LAMPC[seed] = { key, out };
    return out;
  }
  function drawLamps(ctx, l) {
    const k = W.lv.lgtWorld;
    if (k < 0.005 || !SP) return;
    const vis = 0.18 + 0.82 * nightK();
    const wave = k * 1.35, s = LS(l);
    ctx.globalCompositeOperation = 'lighter';
    for (const q of lampSpots(31216, [30, 20, 16])[l]) {
      const dist = Math.abs(q.xf - S.worldX) * (l === 2 ? 1 : l === 1 ? 0.9 : 0.75) + (2 - l) * 0.05 + q.d;
      const a = smoothstep(dist, dist + 0.14, wave) * vis;
      if (a < 0.01) continue;
      const x = q.xf * W.w, y = (l === 2 ? baseY(2, q.xf, q.v) : gY(l, q.xf) + 1.5 * s) - (l === 2 ? 6 * s : 2 * s);
      const fl = 0.8 + 0.2 * Math.sin(W.t * 3 + q.tw);
      glowAt(SP.warm, x, y, (l === 0 ? 7 : l === 1 ? 10 : 14) * s * (1 + 0.3 * (1 - vis)) * 1.4, a * fl * 0.6);
      ctx.globalAlpha = Math.min(1, a * fl);
      ctx.fillStyle = 'rgb(255,214,140)';
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.7, (l === 2 ? 1.5 : 1.0) * s), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 「我是世界的光」（8:12）：自耶稣向外的一波。某处（xf，某层）被波及的程度 → [已亮 0..1, 前沿正经过 0..1]
  function shineWave(xf, l) {
    const k = W.lv.lgtShine;
    if (k < 0.004) return [0, 0];
    const R = k * 1.2;
    const d = Math.abs(xf - S.shineX) * (l === 2 ? 1 : l === 1 ? 0.9 : 0.75) + (2 - l) * 0.06;
    return [smoothstep(d, d + 0.07, R), Math.max(0, 1 - Math.abs(R - d - 0.035) / 0.09)];
  }
  function drawShineLamps(ctx, l) {
    if (W.lv.lgtShine < 0.004 || !SP) return;
    const s = LS(l), vis = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,248,230)';
    for (const q of lampSpots(58213, [26, 18, 14])[l]) {
      const sw = shineWave(q.xf + q.d * 0.3, l), a = (sw[0] * 0.85 + sw[1] * 0.6) * vis;
      if (a < 0.01) continue;
      const x = q.xf * W.w, y = (l === 2 ? baseY(2, q.xf, q.v) : gY(l, q.xf) + 1.5 * s) - (l === 2 ? 7 * s : 2.5 * s);
      const fl = 0.86 + 0.14 * Math.sin(W.t * 2.3 + q.tw);
      const r = (l === 0 ? 8 : l === 1 ? 11 : 16) * s * (1 + 0.8 * sw[1]);
      glowAt(SP.ww, x, y, r, a * fl * 0.55);
      ctx.globalAlpha = Math.min(1, a * fl);
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, (l === 2 ? 1.7 : 1.1) * s), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 自上头落下的光（3:3）
  function drawFrom(ctx) {
    const k = W.lv.lgtFrom;
    if (k < 0.01 || !SP) return;
    const x = S.fromX * W.w, y = gY(2, S.fromX) + 6 * LS(2), w = 150 * SU() * (PORT ? 0.7 : 1);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * (0.22 + 0.2 * nightK());
    ctx.drawImage(SP.ray, x - w / 2, -20, w, y + 24);
    glowAt(SP.soft, x, y - 20 * LS(2), w * 0.9, k * 0.3, 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 风随着意思吹（3:8）：灵的微光随风掠过
  function drawWind(ctx) {
    const k = W.lv.lgtWind;
    if (k < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(246,240,222)';
    ctx.lineWidth = Math.max(0.7, 1 * SU());
    const N = 42;
    for (let i = 0; i < N; i++) {
      const sp = 0.07 + 0.08 * hsh(i * 1.3);
      const u = U.fract(hsh(i * 2.1) + W.t * sp);
      const x = lerp(-0.05, 1.05, u) * W.w, y0 = lerp(0.25, 0.9, hsh(i * 4.7)) * W.h;
      const y = y0 + Math.sin(W.t * 1.4 + i) * 16 * SU() + Math.sin(u * 9 + i) * 10 * SU();
      const L = (40 + 60 * hsh(i * 9.1)) * SU();
      ctx.globalAlpha = k * 0.3 * Math.sin(Math.PI * u) * (0.4 + 0.6 * hsh(i * 3.3));
      ctx.beginPath(); ctx.moveTo(x - L, y + Math.sin(W.t + i) * 4 * SU()); ctx.bezierCurveTo(x - L * 0.66, y - 6 * SU(), x - L * 0.33, y + 5 * SU(), x, y); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 活水的江河（7:38）：从站着高声说话的耶稣脚前流出，一道一道流到每一个过节的人（与门徒）脚前；
  //   另有一道干流从他那里向前（画面之下）流出去，流向世界。贴着地画，在人之下：软而宽的一层、一道细的亮线、十来点微光。
  // （近地这一趟在人之前画：人的 _vis/_x/_y 此时还未为这一帧置上，故按人物模块的同一算法自己求脚下的位置）
  const seen = m => m && !m.dying && !(m.delay > 0) && m.alpha > 0.05 && m.layer === 2;
  const footOf = m => [m.nx * W.w, baseY(2, m.nx, m.v)];
  function riverTargets() {
    const out = [];
    for (const m of cmembers('feast')) if (seen(m)) out.push(m);
    for (const id of DISC) { const f = fig(id); if (seen(f)) out.push(f); }
    return out;
  }
  function qpt(x0, y0, cx, cy, x1, y1, t) { const u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; }
  function strokeQ(ctx, x0, y0, cx, cy, x1, y1, reach) {
    // 只画到 reach（0..1）为止：以折线逼近
    const N = 14, n = Math.max(1, Math.ceil(N * reach));
    ctx.beginPath(); ctx.moveTo(x0, y0);
    for (let i = 1; i <= n; i++) { const q = qpt(x0, y0, cx, cy, x1, y1, Math.min(reach, i / N)); ctx.lineTo(q[0], q[1]); }
    ctx.stroke();
  }
  function drawRiver(ctx) {
    const k = W.lv.lgtRiver;
    if (k < 0.01 || !SP) return;
    const f = fig('jesus');
    if (!seen(f)) return;
    const f0 = footOf(f), sx = f0[0], sy = f0[1] + 1, s = LS(2), nk = nightK();
    const tg = riverTargets();
    const paths = [];
    tg.forEach((m, i) => {
      const e0 = footOf(m), ex = e0[0], ey = e0[1] + 1;
      const dist = Math.abs(ex - sx) / W.w;
      const reach = clamp((k * 1.25 - dist * 1.6 - 0.04) / 0.3, 0, 1);
      if (reach <= 0) return;
      paths.push([sx, sy, (sx + ex) / 2, Math.max(sy, ey) + (5 + 9 * hsh(i * 1.7)) * s, ex, ey, reach, m]);
    });
    // 干流：从他脚前向前、向左下，流出画面（流向世界）
    const mr = clamp(k * 1.4, 0, 1);
    const mx = sx - (PORT ? 0.1 : 0.07) * W.w, my = W.h + 12;
    paths.push([sx, sy, sx - 0.01 * W.w, lerp(sy, my, 0.55), mx, my, mr, null, 1]);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    // 软而宽的一层、一层淡的、一道细的亮线；支流在源头处淡（免得众流汇在他脚前成一团白）
    const LAY = [[[160, 215, 255], 11, 0.04], [[192, 232, 255], 4.5, 0.055], [[242, 250, 255], 0.9, 0.17]];
    for (const [c, wb, al] of LAY) {
      for (const q of paths) {
        const main = !!q[8];
        ctx.lineWidth = Math.max(0.7, wb * s * (main ? 1.6 : 1));
        const A = al * (0.8 + 0.35 * nk);
        if (main) ctx.strokeStyle = U.rgba(c[0], c[1], c[2], A);
        else {
          const g = ctx.createLinearGradient(q[0], q[1], q[4], q[5]);
          g.addColorStop(0, U.rgba(c[0], c[1], c[2], A * 0.15));
          g.addColorStop(0.4, U.rgba(c[0], c[1], c[2], A));
          g.addColorStop(1, U.rgba(c[0], c[1], c[2], A));
          ctx.strokeStyle = g;
        }
        ctx.globalAlpha = 1;
        strokeQ(ctx, q[0], q[1], q[2], q[3], q[4], q[5], q[6]);
      }
    }
    ctx.lineCap = 'butt';
    // 流到之处：那人脚下一小汪光（从他腹中也流出活水来）
    for (const q of paths) {
      if (!q[7] || q[6] < 0.98) continue;
      glowAt(SP.aqua, q[4], q[5] - 2 * s, 12 * s, 0.32 * (0.6 + 0.4 * nk), 0.4);
    }
    glowAt(SP.aqua, sx, sy - 2 * s, 20 * s, clamp(k * 3, 0, 1) * 0.4, 0.45);
    // 顺流而下的十来点微光
    ctx.fillStyle = 'rgb(236,248,255)';
    for (let i = 0; i < 12; i++) {
      const q = paths[i % paths.length];
      const t = U.fract(W.t * 0.16 + hsh(i * 2.9)) * q[6];
      const pt = qpt(q[0], q[1], q[2], q[3], q[4], q[5], t);
      const fa = 0.4 * Math.sin(Math.PI * clamp(t / Math.max(0.05, q[6]), 0, 1));
      glowAt(SP.aqua, pt[0], pt[1], 5 * s, fa * 0.5);
      ctx.globalAlpha = fa;
      ctx.beginPath(); ctx.arc(pt[0], pt[1], Math.max(0.7, 0.8 * s), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 我是世界的光（8:12）：不铺满全地；光落在物与人身上——
  //   他身边一团不大的金光；一道贴地的光环自他向外（前沿）；被波及的人各自亮起（灯、殿里的大灯另画）
  function drawShine(ctx) {
    const k = W.lv.lgtShine;
    if (k < 0.004 || !SP) return;
    const f = fig('jesus');
    const s = LS(2), x = f && f._vis ? f._x : S.shineX * W.w, y = f && f._vis ? f._y : gY(2, S.shineX);
    const nk = nightK();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, x, y - 22 * s, 46 * s, Math.min(1, k * 4) * (0.16 + 0.16 * nk));
    glowAt(SP.ww, x, y + 2 * s, 70 * s, Math.min(1, k * 4) * (0.1 + 0.14 * nk), 0.28);
    // 前沿：贴着近地、中丘的一道光（左右两头）
    const R = k * 1.2;
    if (k < 0.99) {
      const env = Math.sin(Math.PI * clamp(k, 0, 1));
      for (const sd of [-1, 1]) {
        const xf = S.shineX + sd * R;
        if (xf > -0.05 && xf < 1.05) {
          glowAt(SP.ww, xf * W.w, baseY(2, clamp(xf, 0, 1), 0.2) - 4 * s, 90 * s, env * (0.22 + 0.2 * nk), 0.26);
          glowAt(SP.ww, xf * W.w, baseY(2, clamp(xf, 0, 1), 0.05) - 20 * s, 40 * s, env * 0.25, 0.8);
        }
        const xm = S.shineX + sd * (R - 0.06) / 0.9;
        if (xm > 0.45 && xm < 1.05 && W.hasLandBase(1, xm * W.w, 4)) glowAt(SP.ww, xm * W.w, gY(1, xm) - 6 * LS(1), 60 * LS(1), env * (0.16 + 0.16 * nk), 0.3);
      }
    }
    // 被照亮的人：前沿经过时一亮，之后留着一层暖白的光
    const people = riverTargets();
    for (const m of people) {
      const sw = shineWave(m.nx, 2), a = 0.2 * sw[0] + 0.45 * sw[1];
      if (a < 0.01) continue;
      glowAt(SP.ww, m._x, m._y - m._h * 0.5, m._h * (0.7 + 0.5 * sw[1]), a * (0.6 + 0.4 * nk), 1.2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 他从天上赐下粮来（6:31–33）：暖光如吗哪，细细地从天上飘落在坐着的众人中间；
  // 我就是生命的粮（6:35）：飘落的光都聚到他身上（lgtGather）
  function drawManna(ctx) {
    const k = W.lv.lgtManna;
    if (k < 0.01 || !SP) return;
    const gk = W.lv.lgtGather;
    const f = fig('jesus');
    const jx = f && f._vis ? f._x : X.jCap * W.w, jy = f && f._vis ? f._y - f._h * 0.55 : gY(2, X.jCap) - 30 * LS(2);
    const s = LS(2), x0 = (S.mannaX - (PORT ? 0.2 : 0.17)) * W.w, x1 = (S.mannaX + (PORT ? 0.2 : 0.17)) * W.w;
    const top = W.h * (PORT ? 0.4 : 0.22), bot = baseY(2, S.mannaX, 0.35);
    ctx.globalCompositeOperation = 'lighter';
    const N = 72;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (0.05 + 0.03 * hsh(i * 1.3)) + hsh(i * 7.7));
      let x = lerp(x0, x1, hsh(i * 3.1)) + Math.sin(W.t * 0.8 + i * 1.9) * 10 * s;
      let y = lerp(top, bot, ph);
      const fall = Math.sin(Math.PI * ph);
      // 聚到他身上：各点按自己的先后被引向他
      const g = smoothstep(0, 1, clamp(gk * 1.6 - hsh(i * 5.3) * 0.6, 0, 1));
      x = lerp(x, jx + Math.sin(W.t * 2 + i) * 6 * s * (1 - g), g);
      y = lerp(y, jy + Math.cos(W.t * 1.7 + i) * 6 * s * (1 - g), g);
      const a = k * (fall * (1 - g) + g * (1 - gk * 0.5)) * (0.55 + 0.45 * hsh(i * 9.1));
      if (a < 0.01) continue;
      const r = (1.25 + 0.9 * hsh(i * 4.2)) * s;
      glowAt(SP.manna, x, y, r * 6, a * 0.62);
      ctx.globalAlpha = Math.min(1, a * 0.95);
      ctx.fillStyle = i % 3 ? 'rgb(255,244,214)' : 'rgb(255,232,176)';
      ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.9, r), Math.max(0.7, r * 0.7), Math.sin(W.t + i) * 0.6, 0, TAU); ctx.fill();
    }
    if (gk > 0.02) glowAt(SP.gold, jx, jy, 40 * s * (0.6 + 0.6 * gk), k * gk * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 生来瞎眼：世界是灰的；一洗，颜色从池边涌回（画在一切之上、灵与名之下）
  function drawGrey(ctx) {
    const g = W.lv.lgtGrey;
    if (g < 0.01) return;
    const see = W.lv.lgtSee;
    const cx = S.seeX * W.w, cy = baseY(2, S.seeX, 0.3) - 14 * LS(2);
    const far = Math.hypot(Math.max(cx, W.w - cx), Math.max(cy, W.h - cy)) + 40;
    const R = see * far * 1.08, feather = Math.max(40, 0.25 * R);
    ctx.save();
    ctx.globalCompositeOperation = 'saturation';
    const lum = Math.round(60 + 120 * W.daylight);
    const a = clamp(g * 0.92, 0, 1);
    if (R > 2) {
      const gr = ctx.createRadialGradient(cx, cy, Math.max(0, R - feather), cx, cy, R);
      gr.addColorStop(0, 'rgba(' + lum + ',' + lum + ',' + lum + ',0)');
      gr.addColorStop(1, 'rgba(' + lum + ',' + lum + ',' + lum + ',' + a.toFixed(3) + ')');
      ctx.fillStyle = gr;
    } else ctx.fillStyle = 'rgba(' + lum + ',' + lum + ',' + lum + ',' + a.toFixed(3) + ')';
    // 画面最上头（桌面：标题与按钮；手机：标题与上头的经文框）不灰：那里淡出，好让字仍然清楚
    const yA = W.h * (PORT ? 0.34 : 0.05), yB = W.h * (PORT ? 0.47 : 0.17), N = Math.max(24, Math.ceil((yB - yA) / 2.5));
    const yb = Math.round(yB);
    ctx.fillRect(-20, yb, W.w + 40, W.h + 20 - yb);
    for (let i = 0; i < N; i++) {
      const y0 = Math.round(lerp(yA, yb, i / N)), y1 = Math.round(lerp(yA, yb, (i + 1) / N));
      if (y1 <= y0) continue;
      ctx.globalAlpha = (i + 0.5) / N;
      ctx.fillRect(-20, y0, W.w + 40, y1 - y0);
    }
    ctx.restore();
  }
  // 屋里就满了膏的香气（12:3）：金色的微尘从她那里升起，满屋，又漫到全地
  function drawScent(ctx) {
    const k = W.lv.lgtScent;
    if (k < 0.01) return;
    const x0 = S.scentX * W.w, y0 = baseY(2, S.scentX, 0.12) - 12 * LS(2), s = LS(2);
    ctx.globalCompositeOperation = 'lighter';
    SP || sprites();
    glowAt(SP.amber, x0, y0 - 10 * s, 120 * s * (0.6 + 0.6 * k), k * (0.12 + 0.2 * nightK()), 0.6);
    const N = 64;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (0.03 + 0.03 * hsh(i * 1.7)) + hsh(i * 3.9));
      const spread = (0.1 + 0.6 * k) * W.w * hsh(i * 5.3);
      const dir = hsh(i * 7.1) < 0.5 ? -1 : 1;
      const x = x0 + dir * spread * ph + Math.sin(W.t * 0.7 + i) * 8 * s;
      const y = y0 - (40 + 160 * hsh(i * 2.9)) * s * ph * (0.5 + 0.5 * k) + Math.sin(W.t * 1.3 + i * 0.7) * 5 * s;
      const a = k * Math.sin(Math.PI * ph) * (0.35 + 0.4 * hsh(i));
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = i % 3 ? 'rgb(255,208,120)' : 'rgb(255,232,176)';
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.7, (0.9 + 1.2 * hsh(i * 8.8)) * s * 0.8), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 转瞬的光
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctxA = ctx;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = baseY(e.l, e.xf, e.v) + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.4 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        const g = e.w * 1.6;
        glowAt(SP.gold, x, y - g * 0.2, g, env * e.k * 0.45);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'kindle') {
        // 使你们成为光明之子（12:36）：光从他那里一点一点传到每一个人身上（到了便在那人身上一亮）
        const f = fig('jesus');
        if (!f || !f._vis) continue;
        const hx = f._x, hy = f._y - f._h * 0.6, s = LS(2);
        const ms = cmembers(e.gid).concat(DISC.map(fig).filter(Boolean));
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < ms.length; i++) {
          const m = ms[i];
          if (!m._vis) continue;
          const tt = (e.t - (Math.abs(m._x - hx) / W.w) * 7 - 0.1 * (i % 3)) / 1.3;
          if (tt <= 0 || tt >= 1.8) continue;
          const u = Math.min(1, tt), tx = m._x, ty = m._y - m._h * 0.55;
          if (tt < 1) {
            const x = lerp(hx, tx, u), y = lerp(hy, ty, u) - Math.sin(u * Math.PI) * 22 * s;
            glowAt(SP.ww, x, y, 8 * s, 0.7);
            ctx.globalAlpha = 0.95; ctx.fillStyle = 'rgb(255,248,230)';
            ctx.beginPath(); ctx.arc(x, y, Math.max(0.9, 1.4 * s), 0, TAU); ctx.fill();
          } else glowAt(SP.ww, tx, ty, m._h * (0.5 + 0.5 * (tt - 1)), 0.55 * (1 - (tt - 1) / 0.8));
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'band') {
        // 复活在我（11:25）：一道光贴着地，从他脚前奔到坟墓的石头边
        const f = fig('jesus'), tb = getP('tomb');
        if (!f || !f._vis || !tb) continue;
        const s = LS(2), x0 = f._x, x1 = (tb.x + MOUTH) * W.w, head = clamp(e.t / 1.6, 0, 1);
        const fade = 1 - smoothstep(0.55, 1, q), n = 18;
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i <= n * head; i++) {
          const u = i / n, x = lerp(x0, x1, u), y = baseY(2, x / W.w, 0.05) - 2 * s;
          glowAt(SP.gold, x, y, 24 * s, fade * (0.3 + 0.35 * Math.max(0, 1 - (head - u) * 3)), 0.32);
        }
        const hx = lerp(x0, x1, head), hy = baseY(2, hx / W.w, 0.05) - 8 * s;
        glowAt(SP.ww, hx, hy, 34 * s, fade * (head < 1 ? 0.75 : 0.4));
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'tears') {
        // 耶稣哭了（11:35）：几滴光，从他脸上落到地上，落处留下一点微光
        const f = fig('jesus');
        if (!f || !f._vis) continue;
        const s = LS(2) * (f.scale || 1), dir = f.fd || f.facing || 1;
        for (let i = 0; i < 4; i++) {
          const tt = e.t - (0.3 + i * 1.35);
          if (tt < 0) continue;
          const x = f._x + dir * (0.1 + 0.05 * hsh(i * 3.1)) * f._h, y0 = f._y - f._h * 0.78, y1 = f._y + 1;
          ctx.globalCompositeOperation = 'lighter';
          if (tt < 1.15) {
            const u = tt / 1.15, y = lerp(y0, y1, u * u);
            glowAt(SP.pale, x, y, 9 * s + 5, 0.85);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.95;
            ctx.fillStyle = 'rgb(222,238,255)'; ctx.strokeStyle = 'rgba(64,98,156,0.75)'; ctx.lineWidth = 0.9;
            const rx = Math.max(1.9, 1.5 * s), ry = Math.max(2.8, 2.2 * s);
            ctx.beginPath(); ctx.moveTo(x, y - ry * 1.6); ctx.quadraticCurveTo(x + rx, y - ry * 0.2, x + rx, y + ry * 0.2);
            ctx.arc(x, y + ry * 0.2, rx, 0, Math.PI); ctx.quadraticCurveTo(x - rx, y - ry * 0.2, x, y - ry * 1.6); ctx.fill(); ctx.stroke();
          } else {
            const u = (tt - 1.15) / 3.2;
            if (u < 1) { glowAt(SP.pale, x, y1, (8 + 12 * u) * s + 5, 0.8 * (1 - u), 0.45); glowAt(SP.gold, x, y1 - 1, 5 * s + 3, 0.5 * (1 - u)); }
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'strips') {
        // 解开（11:44）：裹着的布一条一条落下
        const f = fig('lazarus');
        if (!f || !f._vis) continue;
        const s = LS(2);
        ctx.strokeStyle = 'rgb(244,240,228)'; ctx.lineWidth = Math.max(0.8, 1.2 * s);
        for (let i = 0; i < 8; i++) {
          const ph = clamp((e.t - i * 0.18) / 1.6, 0, 1);
          if (ph <= 0 || ph >= 1) continue;
          const x = f._x + (hsh(i * 2.7) - 0.5) * f._h * 0.4 + ph * (hsh(i) - 0.5) * 20 * s, y = f._y - f._h * (0.85 - 0.1 * i) + ph * f._h * (0.7 + 0.1 * i);
          ctx.globalAlpha = 0.8 * (1 - ph);
          ctx.beginPath(); ctx.moveTo(x - 4 * s, y); ctx.quadraticCurveTo(x, y - 2 * s * Math.sin(ph * 6 + i), x + 4 * s, y + 1 * s); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.white, f._x, f._y - f._h * 0.5, f._h * 0.9, (1 - q) * 0.5);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'fold') {
        // 合成一群：一圈淡淡的光围住全群（10:16）
        const env = Math.sin(Math.PI * q);
        const x = e.xf * W.w, y = baseY(2, e.xf, 0.18);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.soft, x, y - 10 * LS(2), e.r * W.w, env * 0.35, 0.28);
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
    jeru: drawJeru, mount: drawMount, house: drawHouse, village: drawVillage, well: drawWell, field: drawField, jar: drawJar,
    pool: drawPool, siloam: drawSiloam, mat: drawMat, booths: drawBooths, tomb: drawTomb, table: drawTable,
    fold: (ctx, p) => drawFoldPart(ctx, p, false),
  };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const SCENE = {
    init() { sprites(); },
    resize() { JM = null; for (const k in LAMPC) delete LAMPC[k]; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        if (p.a !== p.ta) p.a = approachLin(p.a, p.ta, EASE.a * f);
        for (const k in EASE) {
          if (k === 'a') continue;
          const tg = p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.ta === 0 && p.a < 0.002 && p.dying) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const [id, v] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = 0.09 * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      SP || sprites();
      if (pass === 'seaMid' || pass === 'seaNear') { const b = vis('boats'); if (b) U.safe('light.boats', () => drawBoats(ctx, b, pass)); return; }
      if (pass === 'air') {
        const fo = vis('fold');
        if (fo) U.safe('light.fold.front', () => drawFoldPart(ctx, fo, true));
        const w = vis('well');
        if (w) U.safe('light.spring', () => drawSpring(ctx, w));
        U.safe('light.shine', () => drawShine(ctx));
        U.safe('light.manna', () => drawManna(ctx));
        U.safe('light.from', () => drawFrom(ctx));
        U.safe('light.scent', () => drawScent(ctx));
        U.safe('light.wind', () => drawWind(ctx));
        U.safe('light.fx', () => drawTransients(ctx));
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.004 || p.kind === 'boats') continue;
        const fn = DRAW[p.kind];
        if (fn) U.safe('light.' + p.kind, () => fn(ctx, p));
      }
      U.safe('light.lamps', () => drawLamps(ctx, l));
      U.safe('light.lamps2', () => drawShineLamps(ctx, l));
      if (l === 2) U.safe('light.river', () => drawRiver(ctx));
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'top') U.safe('light.grey', () => drawGrey(ctx));
    },
    reset() { P.clear(); FXL.length = 0; VT.clear(); sortedN = -1; },
    restore() {
      for (const p of P.values()) { p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
      for (const [id, v] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear();
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (p.ta > 0) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), r2(p.tk), r2(p.tk2), r2(p.topen), r2(p.tlit), p.label].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(clamp(p.layer, 0, 2)) * (p.size || 1);
        if (p.kind === 'jeru') consider(p.label, p.tx * W.w, gY(1, p.tx) - 40 * s);
        else if (p.kind === 'mount') consider(p.label, p.x * W.w, gY(1, p.x) - p.v * s * 0.8);
        else if (p.kind === 'field' || p.kind === 'pool' || p.kind === 'village') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, baseY(2, xf, 0.1) - 20 * s); }
        else if (p.kind === 'boats') { const q = boatPos(p, 1); consider(p.label, q[0], q[1] - 10); }
        else if (p.kind === 'booths') { const xf = (p.xs && p.xs[1]) || 0.85; consider(p.label, xf * W.w, gY(2, xf) - 30 * s); }
        else if (p.kind === 'tomb') consider(p.label, p.x * W.w, gY(2, p.x) - 40 * s);
        else if (p.kind === 'fold') consider(p.label, p.x * W.w, baseY(2, p.x, 0.15) - 10 * s);
        else consider(p.label, p.x * W.w, baseY(2, p.x, p.v || 0.2) - 14 * s);
      }
      return best;
    },
  };

  // 本卷开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0; VT.clear(); sorted = []; sortedN = -1; JM = null; NAMES.length = 0;
    S = fresh();
  }
  const L0 = ['lgtWorld', 'lgtFrom', 'lgtWind', 'lgtRiver', 'lgtShine', 'lgtManna', 'lgtGather', 'lgtGrey', 'lgtSee', 'lgtScent'];

  // ════════════════════════════════════════════════════════════
  //  幕后布置：夜里的耶路撒冷；城边的屋，院中一盏灯，耶稣坐在灯旁
  // ════════════════════════════════════════════════════════════
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.85, herbs: 0.7, trees: 0.3, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      bare: 0.12, bloom: 0.55, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    for (const k of L0) W.set(k, 0, true);
    W.freeClock = false;
    layout();
    W.setOrigin('grass', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('herbs', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('trees', W.w * 0.3, W.ridgeBaseY(2, W.w * 0.36));
    W.goTo(0.95, 0, true);
    const lx = W.w * 0.6, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 18, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    S.worldX = X.jNight; S.fromX = (X.jNight + X.nic) / 2;
    prop('jeru', 'jeru', { x0: PX(0.645), x1: PX(0.985), tx: PX(0.83), layer: 1, label: '耶路撒冷', lit: 0.2 });
    prop('house', 'house', { x: X.house, x0: X.lampS, k: 1, lit: 0.3, label: '屋' });
    const c = C();
    c.clear({ fade: false });
    add('jesus', Object.assign(LOOK('jesus'), { x: X.jNight, layer: 2, facing: 1, pose: 'sit', glow: 0.4 }));
    avoid([0.5, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒；情节里补充的经文排在其后。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 3:3 夜里来见耶稣：人若不重生 ─────────────────────────────
    {
      kind: 'promise', utter: '人若不重生，就不能见神的国', cmd: 'born --again --from 上头  # 夜里来的人', ref: JN + '3:3',
      verse: [
        { text: '这人夜里来见耶稣，说：「拉比，我们知道你是由神那里来作师傅的；<br>因为你所行的神迹，若没有神同在，无人能行。」', ref: JN + '3:2', hold: 7 },
        { text: '耶稣回答说：「我实实在在地告诉你，人若不重生，就不能见神的国。」', ref: JN + '3:3', hold: 6 },
        { text: '尼哥德慕说：「人已经老了，如何能重生呢？岂能再进母腹生出来吗？」', ref: JN + '3:4', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            add('nic', { label: '尼哥德慕', sex: 'm', age: 'elder', x: X.nicIn, layer: 2, facing: -1, pose: 'stand', robe: ROBE.nic, accent: [206, 176, 112], glow: 0.3, prop: 'torch' });
            walk('nic', X.nic, { speed: 0.042 });
            avoid([0.5, 1]);
          }],
          [3, b => { nameOn(b, 'nic', '尼哥德慕'); }],
          [7.2, () => { face('nic', -1); pose('nic', 'sit'); face('jesus', 1); }],
          [8.4, b => {
            W.set('lgtFrom', 1, b.instant); glow('jesus', 0.6);
            beam(b, S.fromX, 2, { dur: 5, w: 120, r: 0.2 });
            sfx(b, 'harp', { soft: true });
          }],
          [15.2, b => { pose('nic', 'gaze'); glow('nic', 0.42); sfx(b, 'wind', { soft: true }); }],
          [20, b => { W.set('lgtFrom', 0.35, b.instant); }],
        ]);
      },
    },

    // ── 3:16 风随着意思吹；神爱世人；光来到世间 ───────────────────
    {
      kind: 'act', utter: '神爱世人', cmd: 'for 人 in 世人: 爱(人)  # 甚至将他的独生子赐给他们', ref: JN + '3:16',
      verse: [
        { text: '「风随着意思吹，你听见风的响声，却不晓得从哪里来，往哪里去；<br>凡从圣灵生的，也是如此。」', ref: JN + '3:8', hold: 7 },
        { text: '「神爱世人，甚至将他的独生子赐给他们，<br>叫一切信他的，不致灭亡，反得永生。」', ref: JN + '3:16', hold: 8 },
        { text: '「光来到世间……<br>但行真理的必来就光，要显明他所行的是靠神而行。」', ref: JN + '3:19，21', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('gale', 0.55, b.instant); W.set('lgtWind', 1, b.instant); W.set('clouds', 0.45, b.instant);
            pose('nic', 'sit'); sfx(b, 'wind');
          }],
          [7, b => { W.set('gale', 0.08, b.instant); W.set('lgtWind', 0, b.instant); W.set('clouds', 0.3, b.instant); }],
          [8.4, b => {
            S.worldX = X.jNight;
            W.set('lgtWorld', 1, b.instant); glow('jesus', 0.8); W.set('lgtFrom', 0.7, b.instant);
            prop('jeru', null, { lit: 1 });
            if (!b.instant && fx()) { const h = headOf('jesus', 0.6); fx().ring(h[0], h[1], [255, 236, 190], M() * 0.45, 3.2, 2); }
            sfx(b, 'harp'); sfx(b, 'stars', { soft: true });
          }],
          [17.2, b => {
            W.goTo(0.27, 6.5, b.instant);
            pose('nic', 'stand'); glow('nic', 0.5);
            walk('nic', X.nicOut, { speed: 0.018 });
            sfx(b, 'bird', { soft: true });
          }],
          [22, b => { W.set('lgtFrom', 0, b.instant); glow('jesus', 0.45); }],
          [25.5, b => { W.set('lgtWorld', 0, b.instant); rm('nic'); prop('jeru', null, { lit: 0.2 }); }],
        ]);
      },
    },

    // ── 4:7 撒马利亚，雅各井，约有午正：请你给我水喝 ─────────────
    {
      kind: 'ask', utter: '请你给我水喝', cmd: 'ask 撒马利亚的妇人 --for 水  # 约有午正', ref: JN + '4:7',
      verse: [
        { text: '于是到了撒马利亚的一座城，名叫叙加……<br>在那里有雅各井；耶稣因走路困乏，就坐在井旁。那时约有午正。', ref: JN + '4:5–6', hold: 7.5 },
        { text: '有一个撒马利亚的妇人来打水。耶稣对她说：「请你给我水喝。」', ref: JN + '4:7', hold: 5.5 },
        { text: '撒马利亚的妇人对他说：「你既是犹太人，怎么向我一个撒马利亚妇人要水喝呢？」<br>原来犹太人和撒马利亚人没有来往。', ref: JN + '4:9', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.49, 8, b.instant);
            show('jeru', false); show('house', false);
            prop('mount', 'mount', { x: PX(0.81), x1: 0.13, v: 70, layer: 1, label: '山' });
            prop('sychar', 'village', { x0: X.town0, x1: X.town1, tx: X.townGate, k: 1, label: '叙加' });
            prop('well', 'well', { x: X.well, label: '雅各井' });
            prop('field', 'field', { x0: X.field0, x1: X.field1, k: 0.22, label: '田' });
            W.set('bare', 0.2, b.instant); W.set('bloom', 0.5, b.instant);
            glow('jesus', 0.4);
            pose('jesus', 'stand');
            walk('jesus', X.jWell, { speed: 0.03, pose: 'sit' });
            discAdd(X.jNight - 0.02);
            ['peter', 'john', 'andrew'].forEach((id, i) => walk(id, X.townGate + 0.02 + i * 0.02, { speed: 0.045 }));
            add('woman', { label: '撒马利亚的妇人', sex: 'f', x: X.townGate + 0.04, layer: 2, facing: -1, pose: 'stand', robe: ROBE.woman, accent: [236, 214, 186], glow: 0.28, prop: 'jar' });
            walk('woman', X.woman, { speed: 0.04 });
            avoid([0.5, 1]);
          }],
          [1.2, b => { nameX(b, '叙加', X.townGate, 70, { hold: 3 }); }],
          [2.8, b => { nameX(b, '雅各井', X.well, 44, { hold: 3 }); }],
          [7.6, () => { ['peter', 'john', 'andrew'].forEach(id => rm(id)); }],
          [8.8, () => { face('jesus', 1); face('woman', -1); }],
          [10.2, b => { nameOn(b, 'woman', '撒马利亚的妇人'); }],
          [10.6, b => { pose('woman', 'bow'); sfx(b, 'splash', { soft: true }); }],
          [13.4, () => { pose('woman', 'stand'); }],
          [15.6, () => { face('woman', -1); }],
        ]);
      },
    },

    // ── 4:14 活水的泉源；她留下水罐子进城去；田里的庄稼熟了 ───────
    {
      kind: 'promise', utter: '人若喝我所赐的水就永远不渴', cmd: 'spring --in 心里 --until 永生', ref: JN + '4:14',
      verse: [
        { text: '耶稣回答说：「凡喝这水的还要再渴；人若喝我所赐的水就永远不渴。<br>我所赐的水要在他里头成为泉源，直涌到永生。」', ref: JN + '4:13–14', hold: 8 },
        { text: '那妇人就留下水罐子，往城里去，对众人说：<br>「你们来看！有一个人将我素来所行的一切事都给我说出来了，莫非这就是基督吗？」', ref: JN + '4:28–29', hold: 7.5 },
        { text: '「……我告诉你们，举目向田观看，庄稼已经熟了，可以收割了。」', ref: JN + '4:35', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { pose('jesus', 'stand'); face('jesus', 1); glow('jesus', 0.6); }],
          [0.8, b => {
            prop('well', null, { k: 1 }); glow('woman', 0.55);
            if (!b.instant && fx()) { const p = getP('well'); if (p) { const q = wellPos(p); fx().ring(q.x, q.y - 12 * q.s, [206, 236, 255], M() * 0.2, 2.4, 1.6); } }
            sfx(b, 'splash'); sfx(b, 'harp', { soft: true });
          }],
          // 门徒回来（4:27）
          [2.5, () => {
            discAdd(X.townGate + 0.03);
            discTo(X.jWell, { speed: 0.05 });
          }],
          [9.3, () => {
            hold('woman', null);
            prop('jar', 'jar', { x: X.jarAt, v: 0.05, label: '水罐子' });
            pose('woman', 'stand');
            run('woman', X.townGate, { speed: 0.09 });
          }],
          [13.5, b => {
            crowd('samar', { n: 9, x0: X.townGate - 0.01, x1: X.townGate + 0.05, layer: 2, label: '撒马利亚人' }, dressCrowd(SAMAR, 0.04, 0.34, 0.12));
            cwalk('samar', X.field0 + 0.01, X.field1 + 0.01, { speed: 0.025 });
            sfx(b, 'crowd', { soft: true });
          }],
          [14.5, () => { walk('woman', X.field1 + 0.03, { speed: 0.03 }); }],
          [18.2, b => {
            prop('field', null, { k: 1, k2: 1 });
            pose('jesus', 'point'); face('jesus', 1);
            sfx(b, 'wind', { soft: true });
          }],
          [23.5, () => { pose('jesus', 'stand'); cface('samar', -1); face('woman', -1); }],
        ]);
      },
    },

    // ── 5:8 毕士大：水动的时候没有人把我放在池子里；起来，拿你的褥子走吧 ─────────
    {
      kind: 'cmd', utter: '起来，拿你的褥子走吧', cmd: 'rise --take 褥子 && walk  # 不靠池水，只凭一句话', ref: JN + '5:8',
      verse: [
        { text: '在耶路撒冷，靠近羊门有一个池子，希伯来话叫作毕士大，旁边有五个廊子；<br>里面躺着瞎眼的、瘸腿的、血气枯干的许多病人。', ref: JN + '5:2–3', hold: 7.5 },
        { text: '在那里有一个人，病了三十八年。耶稣……问他说：「你要痊愈吗？」<br>病人回答说：「先生，水动的时候，没有人把我放在池子里……」', ref: JN + '5:5–7', hold: 8.5 },
        { text: '耶稣对他说：「起来，拿你的褥子走吧！」<br>那人立刻痊愈，就拿起褥子来走了。', ref: JN + '5:8–9', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.58, 5, b.instant);
            for (const id of ['mount', 'sychar', 'well', 'field', 'jar']) show(id, false);
            crm('samar'); rm('woman');
            show('jeru', true);
            prop('pool', 'pool', { x0: X.pool0, x1: X.pool1, k: 0, k2: 0, label: '毕士大' });
            prop('mat', 'mat', { x: X.lame + 0.003, v: 0.36, label: '褥子' });
            W.set('bare', 0.12, b.instant);
            const SX = [0.06, 0.26, 0.47, 0.68, 0.86];
            SX.forEach((u, i) => add('sick' + i, { label: '病人', sex: i % 2 ? 'f' : 'm', age: i === 3 ? 'elder' : 'adult', x: lerp(X.pool0, X.pool1, u), layer: 2, facing: i % 2 ? 1 : -1,
              pose: i % 2 ? 'sit' : 'lie', robe: SICK[i], glow: 0.06, prop: null, v: 0.03 }));
            add('lame', { label: '病了三十八年的人', sex: 'm', x: X.lame, layer: 2, facing: -1, pose: 'lie', robe: ROBE.lame, glow: 0.12, prop: null, v: 0.34 });
            walk('jesus', X.jPool, { speed: 0.03 });
            sink('jesus', 0.18);
            discTo(X.jPool, { speed: 0.03 });
            avoid([0.45, 1]);
          }],
          [1.6, b => { nameX(b, '毕士大', lerp(X.pool0, X.pool1, 0.5), 62); }],
          [9.9, b => { face('jesus', 1); nameOn(b, 'lame', '病了三十八年的人'); }],
          // 水动了（5:7）：别的病人抢着下到池子里；他撑起身来，却没有人把他放下去
          [13.2, b => {
            prop('pool', null, { k: 0.6, k2: 1 });
            sfx(b, 'splash');
            pose('lame', 'sit'); face('lame', 1);
            [[1, 0.28], [3, 0.52], [4, 0.7], [2, 0.44]].forEach(([i, u], j) => {
              pose('sick' + i, 'stand');
              walk('sick' + i, lerp(X.pool0, X.pool1, u), { speed: 0.05 + j * 0.006, pose: 'kneel' });
              sink('sick' + i, 0.2);
            });
          }],
          [16.4, b => { pose('lame', 'lie'); face('lame', -1); face('jesus', 1); sfx(b, 'splash', { soft: true }); }],
          // 起来（5:8）：不在水边，只凭一句话
          [19.7, b => {
            prop('pool', null, { k: 0, k2: 0 });
            pose('jesus', 'point'); glow('jesus', 0.6);
            if (!b.instant && fx()) { const h = headOf('jesus', 0.6), q = headOf('lame', 0.2); fx().ring(h[0], h[1], [255, 236, 196], Math.hypot(q[0] - h[0], q[1] - h[1]) * 1.2 + 20, 1.8, 1.8); }
            sfx(b, 'harp');
          }],
          [20.7, b => { pose('lame', 'stand'); glow('lame', 0.6); sparkleOn(b, 'lame', 22); }],
          [22, b => { show('mat', false); hold('lame', 'bundle'); pose('jesus', 'stand'); ringOn(b, 'lame', [255, 236, 196], 0.12, 1.6); }],
          // 往城里去：从池子前面走过（不踩进水里），出了画面
          [23.2, () => { sink('lame', PORT ? 0.62 : 0.58); walk('lame', 1.06, { speed: 0.06 }); }],
          [28.5, () => { rm('lame'); }],
        ]);
      },
    },

    // ── 6:35 第二日，迦百农：他们坐船来找他；我就是生命的粮 ───────────
    {
      kind: 'name', utter: '我就是生命的粮', cmd: 'bread --from 天上 --of 生命  # 到我这里来的，必定不饿', ref: JN + '6:35',
      verse: [
        { text: '众人见耶稣和门徒都不在那里，就上了船，往迦百农去找耶稣。', ref: JN + '6:24', hold: 5.5 },
        { text: '他们又说：「……我们的祖宗在旷野吃过吗哪，如经上写着说：『他从天上赐下粮来给他们吃。』」<br>耶稣说：「……神的粮就是那从天上降下来、赐生命给世界的。」', ref: JN + '6:30–33', hold: 8.5 },
        { text: '耶稣说：「我就是生命的粮。到我这里来的，必定不饿；信我的，永远不渴。」', ref: JN + '6:35', hold: 6 },
        { text: '耶稣就对那十二个门徒说：「你们也要去吗？」<br>西门‧彼得回答说：「主啊，你有永生之道，我们还归从谁呢？」', ref: JN + '6:67–68', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.4, 6, b.instant);
            for (let i = 0; i < 5; i++) rm('sick' + i);
            rm('lame');
            for (const id of ['jeru', 'pool', 'mat']) show(id, false);
            prop('caper', 'village', { x0: X.capV0, x1: X.capV1, label: '迦百农' });
            prop('boats', 'boats', { x1: X.bay, layer: 3, m: 1, label: '船' });
            W.set('grass', 1, b.instant); W.set('bloom', 0.7, b.instant); W.set('bare', 0, b.instant);
            sink('jesus', 0);
            glow('jesus', 0.45);
            walk('jesus', X.jCap, { speed: 0.03 });
            discTo(X.jCap, { speed: 0.03 });
            avoid([0.45, 1]);
            sfx(b, 'oars', { soft: true });
          }],
          [1.4, b => { nameX(b, '迦百农', lerp(X.capV0, Math.min(1, X.capV1), 0.4), 66); }],
          // 船泊了：众人上岸，来到他面前（6:24–25）
          [5.8, b => {
            crowd('cap', { n: 12, x0: X.capIn0, x1: X.capIn1, layer: 2, label: '众人' }, spreadV(0.04, 0.44));
            crowd('capB', { n: 6, x0: X.capIn0 + 0.02, x1: X.capIn1, layer: 2, label: '众人' }, spreadV(0.06, 0.4));
            cwalk('cap', X.cap0, X.cap1 - 0.04, { speed: 0.035 });
            cwalk('capB', X.cap0 + 0.06, X.cap1, { speed: 0.035 });
            sfx(b, 'crowd', { soft: true });
          }],
          [8.6, () => { face('jesus', 1); cface('cap', -1); cface('capB', -1); }],
          [10.4, () => { cpose('cap', 'sit'); cpose('capB', 'sit'); cface('cap', -1); cface('capB', -1); }],
          // 他从天上赐下粮来（6:31–33）：暖光如吗哪，细细地飘落在众人中间
          [11.2, b => {
            S.mannaX = (X.cap0 + X.cap1) / 2;
            W.set('lgtManna', 1, b.instant); W.set('lgtGather', 0, true);
            sfx(b, 'stars', { soft: true });
          }],
          [14.2, () => { cpose('cap', 'gaze'); }],
          // 我就是生命的粮（6:35）：那从天上降下来的光都聚到他身上
          [17.3, b => {
            W.set('lgtGather', 1, b.instant);
            pose('jesus', 'raise'); glow('jesus', 0.6);
            cpose('cap', 'sit'); cface('cap', -1);
            sfx(b, 'harp');
          }],
          [19.8, b => {
            W.set('lgtManna', 0, b.instant);
            pose('jesus', 'stand'); cglow('cap', 0.3);
            if (!b.instant && fx()) { const h = headOf('jesus', 0.6); fx().ring(h[0], h[1], [255, 228, 170], M() * 0.3, 2.8, 2); }
            sfx(b, 'bell', { soft: true });
          }],
          // 从此他门徒中多有退去的（6:66）；你们也要去吗？
          [23.4, () => {
            cpose('capB', 'stand');
            cwalk('capB', 1.04, 1.14, { speed: 0.045 });
            face('jesus', -1);
          }],
          [27, b => { pose('peter', 'kneel'); glow('peter', 0.45); sparkleOn(b, 'peter', 12); crm('capB'); }],
        ]);
      },
    },

    // ── 7:37 / 8:12 住棚节的夜：活水的江河；我是世界的光 ───────────
    {
      kind: 'name', utter: '我是世界的光', cmd: 'light --world  # 跟从我的，就不在黑暗里走', ref: JN + '8:12', hold: 3.4,
      verse: [
        { text: '节期的末日，就是最大之日，耶稣站着高声说：「人若渴了，可以到我这里来喝。<br>信我的人就如经上所说：『从他腹中要流出活水的江河来。』」', ref: JN + '7:37–38', hold: 8 },
        { text: '耶稣又对众人说：「我是世界的光。<br>跟从我的，就不在黑暗里走，必要得着生命的光。」', ref: JN + '8:12', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.93, 9, b.instant);
            show('boats', false); show('caper', false);
            crm('cap'); crm('capB'); pose('peter', 'stand'); glow('peter', 0.25);
            W.set('lgtManna', 0, b.instant); W.set('lgtGather', 0, b.instant);
            W.set('grass', 0.85, b.instant); W.set('bloom', 0.5, b.instant);
            prop('jeru', 'jeru', { lit: 1, k: 0 }); show('jeru', true);
            prop('booths', 'booths', { x0: X.feast0, x1: X.feast1, label: '棚', xs: [PX(0.735), PX(0.815), PX(0.89), PX(0.962)] });
            crowd('feast', { n: 12, x0: X.feast0, x1: X.feast1, layer: 2, label: '过节的人', glow: 0.3 }, spreadV(0.04, 0.4));
            cface('feast', -1);
            glow('jesus', 0.45);
            walk('jesus', X.jFeast, { speed: 0.03 });
            discTo(X.jFeast, { speed: 0.03 });
            DISC.forEach(id => glow(id, 0.3));
            S.shineX = X.jFeast;
            avoid([0.45, 1]);
          }],
          [2.2, b => { prop('jeru', null, { k: 1 }); sfx(b, 'fire', { soft: true }); }],
          // 耶稣站着高声说（7:37）：过节的人被他的光照着，转过来，向他走近
          [3.4, b => {
            pose('jesus', 'raise'); glow('jesus', 0.6);
            cglow('feast', 0.4); cface('feast', -1);
            cwalk('feast', X.jFeast + 0.05, X.feast1 - 0.05, { speed: 0.022 });
            sfx(b, 'harp', { soft: true });
          }],
          // 从他腹中要流出活水的江河来（7:38）：从他脚前流到每一个人那里，又向前流出去
          [4.8, b => { W.set('lgtRiver', 1, b.instant); sfx(b, 'splash', { soft: true }); }],
          [8.6, () => { pose('jesus', 'stand'); cface('feast', -1); }],
          // 我是世界的光（8:12）：一道暖白的光自他向外——灯、殿里的大灯、人，一一亮起
          [10.3, b => {
            S.shineX = X.jFeast;
            W.set('lgtShine', 1, b.instant); glow('jesus', 0.7);
            DISC.forEach(id => glow(id, 0.45));
            if (!b.instant && fx()) { const h = headOf('jesus', 0.55); fx().ring(h[0], h[1], [255, 246, 226], M() * 0.5, 4, 2.2); fx().sparkle(h[0], h[1], 30, [255, 246, 226], 16 * SU(), 'top'); }
            sfx(b, 'angel', { soft: true }); sfx(b, 'stars', { soft: true });
          }],
          [13.4, () => { cglow('feast', 0.55); cpose('feast', 'gaze'); }],
          // 跟从我的（8:12）：众人跟着他，走在光里
          [15.2, () => {
            cpose('feast', 'stand');
            walk('jesus', X.jFeast + 0.03, { speed: 0.016 });
            discTo(X.jFeast + 0.03, { speed: 0.016 });
            cwalk('feast', X.jFeast + 0.075, X.feast1 - 0.07, { speed: 0.016 });
          }],
          [18.6, () => { face('jesus', 1); cface('feast', -1); }],
        ]);
      },
    },

    // ── 9:7 生来瞎眼的人：你往西罗亚池子里去洗 ───────────────────
    {
      kind: 'cmd', utter: '你往西罗亚池子里去洗', cmd: 'wash --at 西罗亚  # 奉差遣 → see --color', ref: JN + '9:7',
      verse: [
        { text: '耶稣过去的时候，看见一个人生来是瞎眼的。', ref: JN + '9:1', hold: 4.5 },
        { text: '「我在世上的时候，是世上的光。」耶稣说了这话，就吐唾沫在地上，用唾沫和泥抹在瞎子的眼睛上，<br>对他说：「你往西罗亚池子里去洗。」……他去一洗，回头就看见了。', ref: JN + '9:5–7', hold: 8.5 },
        { text: '他说：「……有一件事我知道，从前我是眼瞎的，如今能看见了。」', ref: JN + '9:25', hold: 6 },
        { text: '耶稣……后来遇见他，就说：「你信神的儿子吗？」……<br>他说：「主啊，我信！」就拜耶稣。', ref: JN + '9:35–38', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.34, 7, b.instant);
            W.set('lgtShine', 0, b.instant); W.set('lgtRiver', 0, b.instant);
            prop('jeru', null, { k: 0, lit: 0.2 });
            show('booths', false); crm('feast');
            prop('siloam', 'siloam', { x: X.siloam, label: '西罗亚池子' });
            add('blind', { label: '生来瞎眼的人', sex: 'm', x: X.blind, layer: 2, facing: -1, pose: 'sit', robe: ROBE.blind, glow: 0.1, prop: 'staff', v: 0.12 });
            glow('jesus', 0.45); DISC.forEach(id => glow(id, 0.2));
            walk('jesus', X.jBlind, { speed: 0.03 });
            discTo(X.jBlind - 0.035, { speed: 0.03 });
            S.seeX = X.washed;
            W.set('lgtSee', 0, true);
            avoid([0.45, 1]);
          }],
          [1.2, b => { W.set('lgtGrey', 1, b.instant); W.set('bloom', 0.2, b.instant); }],
          // 吐唾沫在地上，用唾沫和泥抹在瞎子的眼睛上（9:6）
          [6.9, () => { face('jesus', 1); pose('jesus', 'kneel'); }],
          [8.2, () => { pose('jesus', 'point'); }],
          [9.2, () => { pose('jesus', 'stand'); pose('blind', 'stand'); face('blind', -1); }],
          [9.7, b => { walk('blind', X.washed + 0.012, { speed: 0.046, pose: 'bow' }); sink('blind', 0.26); nameX(b, '西罗亚', X.siloam, 30); }],
          // 他去一洗，回头就看见了（9:7）：颜色从池边一圈一圈涌回全世界
          [13.9, b => {
            W.set('lgtSee', 1, b.instant);
            pose('blind', 'raise'); hold('blind', null); glow('blind', 0.6);
            W.set('bloom', 1, b.instant);
            if (!b.instant && fx()) {
              const x = S.seeX * W.w, y = baseY(2, S.seeX, 0.3) - 14 * LS(2);
              fx().ring(x, y, [255, 214, 150], Math.hypot(W.w, W.h) * 0.8, 3.6, 3);
              fx().ring(x, y, [150, 214, 255], Math.hypot(W.w, W.h) * 0.6, 3, 2);
              fx().sparkle(x, y, 50, [255, 226, 180], 30 * SU(), 'top');
            }
            sfx(b, 'harp'); sfx(b, 'bird');
          }],
          [18.2, b => { W.set('lgtGrey', 0, b.instant); pose('blind', 'stand'); }],
          // 后来遇见他（9:35）：门徒先退到他身后（右边），他走到那人面前
          [23.4, () => {
            discTo(X.jMeet, { speed: 0.035, side: -1 });
            walk('jesus', X.jMeet, { speed: 0.035 });
            face('blind', 1);
          }],
          [27.4, b => { face('jesus', -1); pose('blind', 'worship'); glow('jesus', 0.6); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 10:11 我是好牧人 ────────────────────────────────────────
    {
      kind: 'name', utter: '我是好牧人', cmd: 'lead 羊 --by-name --out  # 合成一群，归一个牧人', ref: JN + '10:11',
      verse: [
        { text: '「……看门的就给他开门；羊也听他的声音。他按着名叫自己的羊，把羊领出来。<br>既放出自己的羊来，就在前头走，羊也跟着他，因为认得他的声音。」', ref: JN + '10:3–4', hold: 8 },
        { text: '「我是好牧人；好牧人为羊舍命。」', ref: JN + '10:11', hold: 5 },
        { text: '「我另外有羊，不是这圈里的；我必须领他们来，<br>他们也要听我的声音，并且要合成一群，归一个牧人了。」', ref: JN + '10:16', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.44, 6, b.instant);
            W.set('lgtSee', 0, true);
            show('siloam', false); rm('blind');
            prop('fold', 'fold', { x: X.fold, open: 0, label: '羊圈' });
            herd('flock', { n: 9, x0: X.fold - 0.035, x1: X.fold + 0.04, layer: 2, label: '羊', pose: 'graze', v0: 0.05, v1: 0.22 });
            glow('jesus', 0.45);
            walk('jesus', X.gateX - 0.012, { speed: 0.035 });
            DISC.forEach((id, i) => walk(id, PX(0.44) - i * 0.02, { speed: 0.035 }));
            W.set('grass', 0.8, b.instant); W.set('bloom', 0.6, b.instant);
            avoid([0.42, 1]);
          }],
          [4.2, b => { prop('fold', null, { open: 1 }); sfx(b, 'gate', { soft: true }); DISC.forEach(id => rm(id)); }],
          [5.4, b => {
            walk('jesus', X.jPast, { speed: 0.02 });
            cwalk('flock', X.flock0, X.flock1, { speed: 0.018, pose: 'graze' });
            sfx(b, 'bleat');
          }],
          [9.3, b => { sfx(b, 'bleat', { soft: true }); }],
          [13.8, b => {
            face('jesus', 1); babe('jesus', 'lamb'); glow('jesus', 0.65);
            W.set('grass', 1, b.instant); W.set('bloom', 0.95, b.instant);
            ringOn(b, 'jesus', [255, 236, 190], 0.22);
          }],
          // 我另外有羊（10:16）：从左边的坡上来（离开那棵大树），他转身迎上去
          [15.6, b => {
            herd('other', PORT ? { n: 6, x0: 0.475, x1: 0.51, layer: 2, label: '另外的羊', pose: 'walk', v0: 0.08, v1: 0.24 }
              : { n: 6, x0: 0.46, x1: 0.505, layer: 2, label: '另外的羊', pose: 'walk', v0: 0.14, v1: 0.36 });
            cwalk('other', X.other0 + (PORT ? 0.03 : 0.01), X.other1, { speed: 0.02, pose: 'graze' });
            sfx(b, 'bleat', { soft: true });
          }],
          [17.2, () => { face('jesus', -1); walk('jesus', X.jPast - 0.018, { speed: 0.012 }); }],
          [22.5, b => { flash(b, { type: 'fold', xf: (X.other0 + X.flock1) / 2, r: 0.26, dur: 4 }); face('jesus', 1); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 11:25 伯大尼：复活在我，生命也在我 ───────────────────────
    {
      kind: 'name', utter: '复活在我，生命也在我', cmd: 'resurrect --life  # 你信这话吗？', ref: JN + '11:25',
      verse: [
        { text: '有一个患病的人，名叫拉撒路，住在伯大尼，就是马利亚和她姊姊马大的村庄。……<br>耶稣到了，就知道拉撒路在坟墓里已经四天了。', ref: JN + '11:1，17', hold: 7 },
        { text: '马大听见耶稣来了，就出去迎接他；马利亚却仍然坐在家里。<br>马大对耶稣说：「主啊，你若早在这里，我兄弟必不死。」', ref: JN + '11:20–21', hold: 6.5 },
        { text: '耶稣对她说：「复活在我，生命也在我。信我的人虽然死了，也必复活；<br>凡活着信我的人必永远不死。你信这话吗？」', ref: JN + '11:25–26', hold: 7 },
        { text: '马大说：「主啊，是的，我信你是基督，是神的儿子，就是那要临到世界的。」', ref: JN + '11:27', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.56, 5, b.instant);
            show('fold', false); crm('flock'); crm('other');
            babe('jesus', null); glow('jesus', 0.45);
            prop('beth', 'village', { x0: X.vill0, x1: X.vill1, label: '伯大尼' });
            prop('tomb', 'tomb', { x: X.tomb, open: 0, lit: 0, k: 0, k2: 0, label: '坟墓' });
            W.set('bloom', 0.5, b.instant);
            add('martha', { label: '马大', sex: 'f', x: X.martha0, layer: 2, facing: -1, pose: 'stand', robe: ROBE.martha, accent: [226, 206, 176], glow: 0.26, v: PORT ? 0.16 : 0.04 });
            add('maryb', { label: '马利亚', sex: 'f', x: X.maryb0, layer: 2, facing: -1, pose: 'sit', robe: ROBE.maryb, accent: [230, 220, 204], glow: 0.26, v: 0.06 });
            pose('maryb', 'sit', { weep: true });
            crowd('jews', { n: 7, x0: X.jews0, x1: X.jews1, layer: 2, label: '犹太人', pose: 'weep' }, dressCrowd(MOURN, 0.08, 0.4, 0.08));
            walk('jesus', X.jBeth, { speed: 0.035 });
            // 手机上只彼得跟着（地方窄，免得人挤在坟前）
            discAdd(X.jBeth - 0.09, { only1: PORT });
            discTo(X.jBeth, { speed: 0.035 });
            avoid([0.42, 1]);
          }],
          [1.8, b => { nameX(b, '伯大尼', lerp(X.vill0, Math.min(1, X.vill1), 0.45), 66); }],
          [9.4, b => {
            run('martha', X.jBeth + (PORT ? 0.05 : 0.034));
            sink('martha', PORT ? 0.2 : 0.04);
            sfx(b, 'weep', { soft: true });
          }],
          [10.4, b => { nameOn(b, 'martha', '马大'); }],
          [12.4, () => { face('martha', -1); face('jesus', 1); }],
          // 复活在我，生命也在我（11:25）：一道光贴着地从他那里奔到石头边，石缝透出光来，坟前的草与花一丛丛开了
          [17.2, b => {
            glow('jesus', 0.7);
            ringOn(b, 'jesus', [255, 240, 204], 0.3, 2.8);
            flash(b, { type: 'band', dur: 3.6 });
            sfx(b, 'harp');
          }],
          [18.8, b => {
            prop('tomb', null, { lit: 0.6, k: 1, k2: 1 });
            if (!b.instant && fx()) { const t = getP('tomb'); if (t) { const G = tombGeom(t); fx().sparkle(G.mx, G.y - G.R, 24, [255, 236, 190], 14 * SU(), 'top'); } }
            sfx(b, 'stars', { soft: true });
          }],
          // 犹太人转过来望着他；深色的丧服被照得亮了些
          [20.2, () => {
            cpose('jews', 'stand'); cface('jews', -1); cglow('jews', 0.2);
            for (const m of cmembers('jews')) m.robe = mix(m.robe, [206, 196, 184], 0.32);
          }],
          [25.5, b => { pose('martha', 'kneel'); glow('martha', 0.45); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 11:35 耶稣哭了；到了坟墓前：你们把石头挪开 ─────────────────
    {
      kind: 'act', utter: '耶稣哭了', cmd: 'weep  # 你看他爱这人是何等恳切', ref: JN + '11:35', hold: 3,
      verse: [
        { text: '马利亚到了耶稣那里，看见他，就俯伏在他脚前，<br>说：「主啊，你若早在这里，我兄弟必不死。」', ref: JN + '11:32', hold: 6.5 },
        { text: '耶稣看见她哭，并看见与她同来的犹太人也哭，就心里悲叹，又甚忧愁……<br>耶稣哭了。', ref: JN + '11:33–35', hold: 6.5 },
        { text: '犹太人就说：「你看他爱这人是何等恳切。」', ref: JN + '11:36', hold: 4.5 },
        { text: '耶稣又心里悲叹，来到坟墓前；那坟墓是个洞，有一块石头挡着。<br>耶稣说：「你们把石头挪开。」……', ref: JN + '11:38–39', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            pose('martha', 'stand'); walk('martha', X.jBeth + (PORT ? 0.095 : 0.066), { speed: 0.03 });
            pose('maryb', 'stand');
            run('maryb', X.jBeth + (PORT ? 0.05 : 0.03));
            sink('maryb', PORT ? 0.26 : 0.1);
            // 与她同来的犹太人：停在坟墓的右边，不挡着洞口
            cpose('jews', 'stand');
            cwalk('jews', X.tomb + 0.1, Math.max(X.jews1, X.tomb + 0.2), { speed: 0.03, pose: 'weep' });
            cface('jews', -1);
          }],
          [4.6, b => { face('maryb', -1); pose('maryb', 'fall', { weep: true }); sfx(b, 'weep'); nameOn(b, 'maryb', '马利亚'); }],
          // 耶稣哭了（11:35）：几滴光落到地上；日光也暗了一些
          [8.4, b => {
            pose('jesus', 'weep', { weep: true }); glow('jesus', 0.4);
            flash(b, { type: 'tears', dur: 8.5 });
            W.set('clouds', 0.85, b.instant); W.set('gloom', 0.16, b.instant);
            sfx(b, 'weep', { soft: true });
          }],
          // 你看他爱这人是何等恳切（11:36）：犹太人都转向他
          [16.6, () => { cpose('jews', 'stand'); cface('jews', -1); cglow('jews', 0.22); }],
          [20.6, b => { W.set('gloom', 0, b.instant); W.set('clouds', 0.4, b.instant); }],
          [21.6, () => {
            pose('jesus', 'stand'); glow('jesus', 0.55);
            walk('jesus', X.tomb - (PORT ? 0.075 : 0.045), { speed: 0.02 });
            pose('maryb', 'stand');
            walk('maryb', X.tomb - (PORT ? 0.12 : 0.105), { speed: 0.02 }); sink('maryb', PORT ? 0.28 : 0.2);
            walk('martha', X.tomb - (PORT ? 0.16 : 0.135), { speed: 0.02 }); sink('martha', PORT ? 0.2 : 0.1);
            discTo(X.tomb - (PORT ? 0.17 : 0.135), { speed: 0.02 });
            cwalk('jews', X.tomb + 0.1, Math.max(X.jews1, X.tomb + 0.2) + 0.01, { speed: 0.02 });
          }],
          [27, () => { face('jesus', 1); pose('jesus', 'point'); cface('jews', -1); }],
        ]);
      },
    },

    // ── 11:43 拉撒路出来！─────────────────────────────────────
    {
      kind: 'call', utter: '拉撒路出来！', cmd: 'call 拉撒路 --out && unbind  # 叫他走', ref: JN + '11:43', hold: 3,
      verse: [
        { text: '耶稣说：「我不是对你说过，你若信，就必看见神的荣耀吗？」<br>他们就把石头挪开。耶稣举目望天，说：「父啊，我感谢你，因为你已经听我。」', ref: JN + '11:40–41', hold: 8 },
        { text: '说了这话，就大声呼叫说：「拉撒路出来！」那死人就出来了，手脚裹着布，脸上包着手巾。<br>耶稣对他们说：「解开，叫他走！」', ref: JN + '11:43–44', hold: 8 },
        { text: '那些来看马利亚的犹太人见了耶稣所做的事，就多有信他的。', ref: JN + '11:45', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            pose('jesus', 'stand'); W.set('gloom', 0, b.instant);
            add('roll1', { label: '犹太人', sex: 'm', x: X.tomb + (PORT ? 0.095 : 0.085), layer: 2, facing: -1, pose: 'stand', robe: MOURN[1], glow: 0.08, v: 0.02 });
            add('roll2', { label: '犹太人', sex: 'm', x: X.tomb + (PORT ? 0.12 : 0.1), layer: 2, facing: -1, pose: 'stand', robe: MOURN[3], glow: 0.08, v: 0.05 });
          }],
          [1.6, b => { pose('roll1', 'bow'); pose('roll2', 'bow'); prop('tomb', null, { open: 1 }); sfx(b, 'rollstone', { soft: true }); }],
          [4.4, () => { pose('roll1', 'stand'); pose('roll2', 'stand'); walk('roll1', X.tomb + 0.2, { speed: 0.02 }); walk('roll2', X.tomb + 0.225, { speed: 0.02 }); }],
          [4.9, b => {
            pose('jesus', 'gaze'); glow('jesus', 0.7);
            beamOn(b, 'jesus', { dur: 5, w: 90, r: 0.2 });
            sfx(b, 'harp', { soft: true });
          }],
          [9.3, b => {
            pose('jesus', 'raise'); prop('tomb', null, { lit: 1 });
            W.flash = Math.max(W.flash || 0, b.instant ? 0 : 0.18);
            sfx(b, 'angel');
          }],
          // 那死人就出来了（11:44）：他从洞里出来；耶稣退后一步，好让两个白衣的人分得开
          [10.6, b => {
            add('lazarus', { label: '拉撒路', sex: 'm', x: X.tomb + MOUTH, layer: 2, facing: -1, pose: 'stand', robe: ROBE.linen, accent: ROBE.linen, hair: 'cloth', glow: 0.35, prop: null, v: 0.01 });
            walk('lazarus', X.tomb - 0.012, { speed: 0.008 });
            walk('jesus', X.tomb - (PORT ? 0.13 : 0.088), { speed: 0.018 });
            nameAt(b, '拉撒路', (X.tomb + MOUTH) * W.w, gY(2, X.tomb) - 62 * LS(2) * (PORT ? 0.9 : 1));
          }],
          [12.5, () => { pose('jesus', 'stand'); face('jesus', 1); walk('maryb', X.tomb - (PORT ? 0.05 : 0.036), { speed: 0.02 }); sink('maryb', 0.06); }],
          [15, b => {
            add('lazarus', { robe: ROBE.laz, accent: [214, 196, 170], hair: 'short', glow: 0.55 });
            flash(b, { type: 'strips', dur: 2.6 });
            prop('tomb', null, { lit: 0.25 });
            sfx(b, 'harp');
          }],
          [16.4, () => { embrace('maryb', 'lazarus', { weep: false }); }],
          [18.6, b => {
            cpose('jews', 'bow'); cglow('jews', 0.22);
            W.set('bloom', 1, b.instant);
            ringOn(b, 'lazarus', [255, 236, 196], 0.4, 3);
            sfx(b, 'crowd', { soft: true });
          }],
        ]);
      },
    },

    // ── 12:7 伯大尼的筵席：香膏；犹大的话；由她吧 ───────────────────
    {
      kind: 'bless', utter: '由她吧！她是为我安葬之日存留的', cmd: 'anoint --with 真哪哒 && fill 屋里 --fragrance', ref: JN + '12:7',
      verse: [
        { text: '有人在那里给耶稣预备筵席；马大伺候，拉撒路也在那同耶稣坐席的人中。', ref: JN + '12:2', hold: 6 },
        { text: '马利亚就拿着一斤极贵的真哪哒香膏，抹耶稣的脚，又用自己头发去擦，<br>屋里就满了膏的香气。', ref: JN + '12:3', hold: 7.5 },
        { text: '有一个门徒，就是那将要卖耶稣的加略人犹大，<br>说：「这香膏为什么不卖三十两银子周济穷人呢？」', ref: JN + '12:4–5', hold: 6 },
        { text: '耶稣说：「由她吧！她是为我安葬之日存留的。<br>因为常有穷人和你们同在，只是你们不常有我。」', ref: JN + '12:7–8', hold: 7 },
      ],
      apply(c) {
        // 席上的座次（手机上座位放宽，门徒只有彼得与犹大）
        const q = PORT ? { j: -0.03, m: -0.068, l: 0.045, p: 0.1, ju: 0.155, ma: 0.205, an: -0.12 } : { j: -0.022, m: -0.046, l: 0.026, p: 0.052, ju: 0.078, jo: 0.104, ma: 0.137, an: -0.092 };
        const T0 = X.table;
        T(c, [
          [0, b => {
            W.goTo(0.77, 9, b.instant);
            crm('jews'); rm('roll1'); rm('roll2');
            show('tomb', false);
            prop('beth', null, { lit: 1 });
            prop('table', 'table', { x: X.table, lit: 1, label: '筵席' });
            W.set('bloom', 0.6, b.instant);
            S.scentX = T0 + q.m;
            if (!PORT && !has('john')) add('john', Object.assign(LOOK('john'), { x: X.jBeth - 0.06, layer: 2, facing: 1, pose: 'stand' }));
            if (!PORT && !has('andrew')) add('andrew', Object.assign(LOOK('disciple'), { label: '安得烈', robe: DROBE(2), x: X.jBeth - 0.08, layer: 2, facing: 1, pose: 'stand' }));
            add('judas', Object.assign(LOOK('disciple'), { label: '犹大', robe: DROBE(5), x: 1.04, layer: 2, facing: -1, pose: 'stand', glow: 0.2 }));
            glow('jesus', 0.55); glow('lazarus', 0.45); glow('martha', 0.36); glow('maryb', 0.36); DISC.forEach(id => glow(id, 0.3));
            pose('jesus', 'stand'); pose('martha', 'stand');
            for (const id of ['jesus', 'lazarus', 'maryb', 'martha', 'peter', 'john', 'andrew']) sink(id, 0);
            walk('jesus', T0 + q.j, { speed: 0.03, pose: 'sit' });
            walk('lazarus', T0 + q.l, { speed: 0.03, pose: 'sit' });
            walk('peter', T0 + q.p, { speed: 0.03, pose: 'sit' });
            walk('judas', T0 + q.ju, { speed: 0.04, pose: 'sit' });
            if (q.jo) walk('john', T0 + q.jo, { speed: 0.03, pose: 'sit' });
            walk('andrew', T0 + q.an, { speed: 0.03, pose: 'sit' });
            walk('martha', T0 + q.ma, { speed: 0.03, pose: 'carry' });
            walk('maryb', T0 + q.ma + 0.03, { speed: 0.03 });
            avoid([0.42, 1]);
          }],
          [5.6, () => { face('jesus', 1); face('lazarus', -1); face('peter', -1); face('judas', -1); face('john', -1); face('andrew', 1); face('martha', -1); face('maryb', -1); }],
          [8.4, () => { hold('maryb', 'jar'); walk('maryb', T0 + q.m, { speed: 0.035, pose: 'kneel' }); }],
          [11, b => {
            face('maryb', 1); pose('maryb', 'worship');
            W.set('lgtScent', 1, b.instant);
            sfx(b, 'pour', { soft: true }); sfx(b, 'harp');
          }],
          [11.8, b => { nameAt(b, '真哪哒', (T0 + q.m) * W.w, baseY(2, T0 + q.m, 0.12) - 64 * LS(2)); }],
          [15.5, b => { glow('maryb', 0.5); glow('jesus', 0.7); }],
          // 犹大（12:4–5）：欠身起来，指着那香膏
          [17.2, b => { pose('judas', 'point'); face('judas', -1); nameOn(b, 'judas', '犹大', { rgb: [226, 214, 196] }); }],
          // 由她吧（12:7）：耶稣转向他
          [24.6, b => { face('jesus', 1); ringOn(b, 'jesus', [255, 236, 196], 0.16, 2); }],
          [26.4, () => { pose('judas', 'sit'); }],
          [28.6, () => { face('jesus', -1); }],
        ]);
      },
    },

    // ── 12:35–46 耶路撒冷的夜：趁着有光行走；光明之子；我到世上来，乃是光 ─────
    {
      kind: 'promise', utter: '我到世上来，乃是光', cmd: 'come --as 光  # 叫凡信我的，不住在黑暗里', ref: JN + '12:46', hold: 3.4,
      verse: [
        { text: '耶稣对他们说：「光在你们中间还有不多的时候，<br>应当趁着有光行走，免得黑暗临到你们……」', ref: JN + '12:35', hold: 7 },
        { text: '「你们应当趁着有光，信从这光，使你们成为光明之子。」', ref: JN + '12:36', hold: 6 },
        { text: '耶稣大声说：「……我到世上来，乃是光，叫凡信我的，不住在黑暗里。」', ref: JN + '12:44，46', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.94, 8, b.instant);
            W.set('lgtScent', 0, b.instant);
            show('table', false); show('beth', false);
            for (const id of ['lazarus', 'martha', 'maryb', 'judas']) rm(id);
            prop('jeru', 'jeru', { lit: 1, k: 0 }); show('jeru', true);
            crowd('many', { n: 13, x0: X.end0, x1: X.end1, layer: 2, label: '众人', glow: 0.3 }, spreadV(0.03, 0.42));
            cface('many', -1);
            pose('jesus', 'stand'); glow('jesus', 0.5);
            walk('jesus', X.jEnd, { speed: 0.03 });
            discTo(X.jEnd, { speed: 0.03 });
            DISC.forEach(id => { pose(id, 'stand'); glow(id, 0.3); });
            S.worldX = X.jEnd;
            avoid([0.45, 1]);
          }],
          // 光在你们中间还有不多的时候（12:35）：云从四围聚拢，暗了下来；他身边仍有光
          [2.4, b => { W.set('clouds', 0.7, b.instant); cface('many', -1); sfx(b, 'wind', { soft: true }); }],
          [4.2, b => { pose('jesus', 'raise'); glow('jesus', 0.6); cglow('many', 0.4); sfx(b, 'harp', { soft: true }); }],
          [7.8, () => { pose('jesus', 'stand'); }],
          // 使你们成为光明之子（12:36）：光从他那里一点一点传到每一个人身上
          [9.4, b => {
            flash(b, { type: 'kindle', gid: 'many', dur: 6 });
            sfx(b, 'stars', { soft: true });
          }],
          [12.6, () => { cglow('many', 0.5); DISC.forEach(id => glow(id, 0.5)); cpose('many', 'gaze'); }],
          // 我到世上来，乃是光（12:46）：云散了，普天下的灯自他那里一盏一盏亮起来
          [16.8, b => {
            W.set('lgtWorld', 1, b.instant);
            W.set('clouds', 0.3, b.instant);
            glow('jesus', 0.7); prop('jeru', null, { k: 1 });
            cpose('many', 'stand'); cface('many', -1);
            if (!b.instant && fx()) { const h = headOf('jesus', 0.55); fx().ring(h[0], h[1], [255, 236, 196], M() * 0.55, 4.5, 2.2); }
            sfx(b, 'bell'); sfx(b, 'harp', { soft: true });
          }],
          [20, () => { cwalk('many', X.jEnd + 0.05, X.end1 - 0.04, { speed: 0.016 }); }],
          [23.8, () => { cface('many', -1); }],
        ]);
      },
    },
  ];
  function run(id, x, o) { const c = C(); if (!has(id)) return; if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ run: true }, o || {})); }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '生命的光', sub: '约翰福音 3 — 12', tint: [255, 244, 214], music: 'isaiah',
    outro: 24,
    intro: [
      { text: '有一个法利赛人，名叫尼哥德慕，是犹太人的官。', ref: JN + '3:1', hold: 5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '耶稣': { text: '耶稣又对众人说：「我是世界的光。跟从我的，就不在黑暗里走，必要得着生命的光。」', ref: JN + '8:12' },
      '屋': { text: '这人夜里来见耶稣……', ref: JN + '3:2' },
      '尼哥德慕': { text: '有一个法利赛人，名叫尼哥德慕，是犹太人的官。<br>这人夜里来见耶稣……', ref: JN + '3:1–2' },
      '撒马利亚的妇人': { text: '那妇人就留下水罐子，往城里去，对众人说：「你们来看！……莫非这就是基督吗？」', ref: JN + '4:28–29' },
      '撒马利亚人': { text: '便对妇人说：「现在我们信，不是因为你的话，是我们亲自听见了，知道这真是救世主。」', ref: JN + '4:42' },
      '雅各井': { text: '在那里有雅各井；耶稣因走路困乏，就坐在井旁。那时约有午正。', ref: JN + '4:6' },
      '叙加': { text: '于是到了撒马利亚的一座城，名叫叙加，靠近雅各给他儿子约瑟的那块地。', ref: JN + '4:5' },
      '山': { text: '我们的祖宗在这山上礼拜，你们倒说，应当礼拜的地方是在耶路撒冷。', ref: JN + '4:20' },
      '田': { text: '举目向田观看，庄稼已经熟了，可以收割了。', ref: JN + '4:35' },
      '水罐子': { text: '那妇人就留下水罐子，往城里去。', ref: JN + '4:28' },
      '毕士大': { text: '在耶路撒冷，靠近羊门有一个池子，希伯来话叫作毕士大，旁边有五个廊子。', ref: JN + '5:2' },
      '病人': { text: '里面躺着瞎眼的、瘸腿的、血气枯干的许多病人。', ref: JN + '5:3' },
      '病了三十八年的人': { text: '那人立刻痊愈，就拿起褥子来走了。', ref: JN + '5:9' },
      '褥子': { text: '耶稣对他说：「起来，拿你的褥子走吧！」', ref: JN + '5:8' },
      '迦百农': { text: '这些话是耶稣在迦百农会堂里教训人说的。', ref: JN + '6:59' },
      '众人': { text: '「你们应当趁着有光，信从这光，使你们成为光明之子。」', ref: JN + '12:36' },
      '船': { text: '众人见耶稣和门徒都不在那里，就上了船，往迦百农去找耶稣。', ref: JN + '6:24' },
      '耶路撒冷': { text: '这事以后，到了犹太人的一个节期，耶稣就上耶路撒冷去。', ref: JN + '5:1' },
      '棚': { text: '当时犹太人的住棚节近了。', ref: JN + '7:2' },
      '过节的人': { text: '节期的末日，就是最大之日，耶稣站着高声说：「人若渴了，可以到我这里来喝。」', ref: JN + '7:37' },
      '西罗亚池子': { text: '对他说：「你往西罗亚池子里去洗。」（西罗亚翻出来就是「奉差遣」。）他去一洗，回头就看见了。', ref: JN + '9:7' },
      '生来瞎眼的人': { text: '有一件事我知道，从前我是眼瞎的，如今能看见了。', ref: JN + '9:25' },
      '羊圈': { text: '我另外有羊，不是这圈里的；我必须领他们来，他们也要听我的声音，并且要合成一群，归一个牧人了。', ref: JN + '10:16' },
      '羊': { text: '我的羊听我的声音，我也认识他们，他们也跟着我。', ref: JN + '10:27' },
      '另外的羊': { text: '我另外有羊，不是这圈里的；我必须领他们来。', ref: JN + '10:16' },
      '伯大尼': { text: '伯大尼离耶路撒冷不远，约有六里路。', ref: JN + '11:18' },
      '坟墓': { text: '耶稣又心里悲叹，来到坟墓前；那坟墓是个洞，有一块石头挡着。', ref: JN + '11:38' },
      '马大': { text: '马大说：「主啊，是的，我信你是基督，是神的儿子，就是那要临到世界的。」', ref: JN + '11:27' },
      '马利亚': { text: '马利亚就拿着一斤极贵的真哪哒香膏，抹耶稣的脚，又用自己头发去擦，屋里就满了膏的香气。', ref: JN + '12:3' },
      '拉撒路': { text: '那死人就出来了，手脚裹着布，脸上包着手巾。耶稣对他们说：「解开，叫他走！」', ref: JN + '11:44' },
      '犹太人': { text: '犹太人就说：「你看他爱这人是何等恳切。」', ref: JN + '11:36' },
      '筵席': { text: '有人在那里给耶稣预备筵席；马大伺候，拉撒路也在那同耶稣坐席的人中。', ref: JN + '12:2' },
      '彼得': { text: '西门‧彼得回答说：「主啊，你有永生之道，我们还归从谁呢？」', ref: JN + '6:68' },
      '安得烈': { text: '听见约翰的话跟从耶稣的那两个人，一个是西门‧彼得的兄弟安得烈。<br>他先找着自己的哥哥西门，对他说：「我们遇见弥赛亚了。」', ref: JN + '1:40–41' },
      '犹大': { text: '有一个门徒，就是那将要卖耶稣的加略人犹大，说：「这香膏为什么不卖三十两银子周济穷人呢？」', ref: JN + '12:4–5' },
    },
  });
})(window.GS);
