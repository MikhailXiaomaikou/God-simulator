/* ─────────────────────────────────────────────────────────────
 * book/galatians.js —— 加拉太书 · 圣灵的果子（加拉太书 1 — 6）
 *
 * 一封信，一座园子，一天一夜又一天。书信没有情节：每一句话是信里的一句，在园中成为一幅发光的图画。
 * 近岸的左边是保罗写信的地方：橄榄树下一张小桌、一盏陶灯、一卷书信（写一句，信上多一行金色的字）；
 * 右边是加拉太的一座园子：园中的众人（犹太人、希腊人、为奴的、自主的、妇人、父亲、孩童、训蒙的师傅），
 * 园子当中是一粒种、一棵树；远山上，十字架活画在他们眼前。
 *   1:3–7   黎明。愿恩惠、平安……一道光自上而来，一粒光的种子落进园子当中，发出芽来；
 *           随后，搅扰的人从右边进来，灰冷的雾爬进园中，三个人的肩上被套上了轭。
 *   1:13–24 施恩召我的神：一根光柱落在保罗身上，他跪下又起来；一条光路自他脚前铺向外邦人的园子。
 *   2:11–16 安提阿的桌子：矶法与外邦人一同吃饭；搅扰的人来到，他就退去隔开了，犹太人随着他；
 *           保罗当面抵挡他；人称义乃是因信——光落在所有人身上，一样的光。
 *   2:20–3:1 远山上，一个光的十字架一笔一笔画出来（活画在你们眼前）；保罗跪下：他是爱我，为我舍己。
 *   3:6–9   夜。亚伯拉罕的众星布满天空，一点一点落在每一个外邦人头上；远近的山上亮起万国的灯。
 *   3:23–26 黎明。训蒙的师傅牵着孩童的手，把他领到园子当中的树下，放了手，退后一步：都是神的儿子。
 *   3:27–29 披戴基督：众人的衣裳一件件亮起来；隔开的人都回来，围着树成双成对地牵手——犹太人与希腊人、
 *           为奴的与自主的、男与女；众人的光聚成一个「一」字。
 *   4:4–7   时候满足：一点光自天顶降到远山的村庄里；儿子的灵自灵所在之处流进每个人心里——孩童奔向父亲，
 *           「阿爸！父！」；为奴的那人换上了儿子的衣裳。
 *   5:1–14  轭断了，落在地上；三个人直起腰来举手；搅扰的人走了，雾散了，鸟飞起来；自主的在为奴的面前跪下服事他。
 *   5:16–23 本幕的签名之景：树长大、开花，结出九样发光的果子，一样一样亮起，各有其名：
 *           仁爱、喜乐、和平、忍耐、恩慈、良善、信实、温柔、节制；遍地开花。
 *   5:25–6:2 一条淡青的光路自树下伸向园子东头；众人顺着圣灵同行。背着重担的人跌倒了，两个人用温柔的心扶他起来，
 *           把担子分过来一同担当。
 *   6:7–10  金色的下午：父亲在田里撒种；出苗、抽穗、黄熟，远处中丘的山坡也一片金黄；众人收割，禾捆立在田里。
 *   6:11–18 黄昏：保罗亲手写大字——一个大大的「恩」字自书信升起，停在园子的上空；十字架又亮起来，园子全然更新；
 *           他卷起书信，站起来举手；恩光落在每个人心里。阿们。
 *
 * 神的显现：父从不成形——只是自上而来的光与经文的声音；子只以远山上活画的光的十字架显出；
 * 圣灵是玩家自己漂游的光（4:6 儿子的灵自它所在之处流进人心）。人都无面目。
 * 画面的方位：近地用逻辑位置 f（0 = 保罗的桌子，1 = 园子东头）映到画面的比例；竖屏时向左展开（经文在上方）。
 * 规矩：一切状态只在 setup / apply / 情节里设定（瞬间重演时一样）；布景只在本幕进行时绘制。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'galatians';
  const LV = W.lv;
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时对齐）───────────────────
  const LEVELS = [
    ['gaLetter', 'lin', 0.03],   // 书信上写了几行（0..1 → 0..13 行）
    ['gaLamp', 'exp', 0.6],      // 桌上的灯
    ['gaHaze', 'exp', 0.25],     // 搅扰：园中灰冷的雾（1:7）
    ['gaGift', 'exp', 0.9],      // 自上而来的一道光（1:4）
    ['gaTree', 'lin', 0.09],     // 园子当中的树：芽 → 小树 → 大树
    ['gaTreeG', 'exp', 0.4],     // 树的光
    ['gaBlos', 'exp', 0.45],     // 树开花
    ['gaFruit', 'lin', 0.085],   // 九样果子一样一样亮起（5:22–23）
    ['gaCall', 'exp', 0.8],      // 施恩召我的光柱（1:15）
    ['gaRoad', 'lin', 0.16],     // 往外邦人去的光路（铺开，1:16）
    ['gaRoadA', 'exp', 0.4],     // 光路的亮度
    ['gaTable', 'exp', 0.7],     // 安提阿的桌子（2:12）
    ['gaSplit', 'exp', 0.6],     // 隔开了
    ['gaFaith', 'exp', 0.5],     // 因信称义的光落在众人身上（2:16）
    ['gaCross', 'lin', 0.3],     // 十字架活画在眼前（笔画渐成，3:1）
    ['gaCrossB', 'exp', 0.5],    // 十字架的光
    ['gaStars', 'exp', 0.3],     // 亚伯拉罕的众星（3:6–9）
    ['gaNations', 'lin', 0.12],  // 万国的灯（3:8）
    ['gaYoke', 'exp', 1.2],      // 奴仆的轭（5:1）
    ['gaBroke', 'exp', 0.35],    // 断了的轭落在地上（渐渐化去）
    ['gaSent', 'exp', 0.5],      // 神差遣他的儿子：远山村庄里的一点光（4:4）
    ['gaHearts', 'exp', 0.8],    // 儿子的灵进入人心（4:6）
    ['gaOne', 'exp', 0.6],       // 都成为一：众人脚下的一圈光（3:28）
    ['gaPath', 'lin', 0.2],      // 靠圣灵行事：淡青的光路（5:25）
    ['gaPathA', 'exp', 0.4],     // 光路的亮度
    ['gaField', 'exp', 0.5],     // 田：犁出的陇沟
    ['gaSprout', 'lin', 0.2],    // 出苗、抽穗
    ['gaGold', 'exp', 0.35],     // 成熟、金黄（6:9）
    ['gaSheaf', 'exp', 0.8],     // 禾捆
    ['gaFlow', 'lin', 0.1],      // 园中花开
    ['gaNew', 'exp', 0.4],       // 新造的人：园子全然更新（6:15）
    ['gaGrace', 'exp', 0.5],     // 恩常在你们心里：金色的恩光（6:18）
    ['gaSeal', 'exp', 0.9],      // 书信卷起
    ['gaAbba', 'exp', 1.3],      // 呼叫阿爸父时，自天顶降在众人身上的柔光（4:6：父只是自上而来的光）
    ['gaSon', 'exp', 0.8],       // 都是神的儿子：落在孩童身上的一道光（3:26）
    ['gaStar', 'exp', 0.5],      // 远山村庄上空的一点星光（4:4，伯利恒的回声）
    ['gaSack', 'exp', 0.8],      // 重担（6:1–2）：背上的口袋
  ];
  for (const L of LEVELS) W.defineLevel(L[0], L[1], L[2]);
  const MY = LEVELS.map(L => L[0]);

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const port = () => W.w < W.h * 0.9;
  // 近地的逻辑位置 f（0 = 保罗的桌子，1 = 园子东头）→ 画面宽度的比例
  const LXp = (f, p) => (p ? 0.44 + 0.54 * f : 0.535 + 0.445 * f);
  const XLp = (x, p) => (p ? (x - 0.44) / 0.54 : (x - 0.535) / 0.445);
  const LX = f => LXp(f, port());
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.55 : 1) * (LK[l] || 1);
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const gY = (l, xf) => { const x = xf * W.w; let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const sstep = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const easeO = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const nightK = () => clamp(W.night * 1.1 + W.dusk * 0.3, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const r3 = v => Math.round(v * 1000) / 1000;
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function sfx(b, name, o) { if (inst(b)) return; const a = au(); if (a && a.sfx) U.safe('galatians.sfx', () => a.sfx(name, o || {})); }

  // ── 园中的位置 ────────────────────────────────────────────
  const DESK_F = 0.075, PAUL_F = 0.03, OLIVE_F = 0.1, TREE_F = 0.56, TREE_V = 0.12, DESK_V = 0.36, PAUL_V = 0.34;
  const TABLE = [0.18, 0.5], TABLE_V = 0.62, SEAT_V = 0.55;
  const TABLE_GAP = [0.265, 0.36];   // 矶法与犹太人原先坐的地方（退去之后空下来）
  const FIELD = [0.56, 0.9], FIELD_V = [0.6, 0.92];
  const XC = 0.6;                    // 远山上十字架的位置（画面比例）
  const XB = 0.69;                   // 远山上的村庄（4:4）：在十字架与园中的树之间，离开手机的右边
  const treeX = () => LX(TREE_F) * W.w;
  const treeY = () => baseY(2, LX(TREE_F), TREE_V) + 1;
  const treeH = () => (port() ? Math.min(W.h * 0.22, W.w * 0.44) : Math.min(W.h * 0.3, W.w * 0.24));
  // 5:25–6:2 同行的六个人（f, v）：前三个在后排，背重担的与扶他的三个在前排；相隔 0.065
  const WALK = { tutor: [0.12, 0.58], peter: [0.185, 0.6], jew: [0.25, 0.62], free: [0.35, 0.8], greek: [0.415, 0.78], slave: [0.48, 0.76] };
  const WALK_FREE = WALK.free;
  // 两人牵手时的间距（画面比例）
  const PAIR = () => (port() ? 0.026 : 0.011);

  // ════════════════════════════════════════════════════════════
  //  人物（皆经人物模块）
  // ════════════════════════════════════════════════════════════
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const fig = id => { const c = C(); return c.get ? c.get(id) : null; };
  const look = (key, o) => { const L = (C() && C().LOOK) || {}; return Object.assign({}, L[key] || {}, o || {}); };
  const TRK = new Set();            // 在近地纵深里缓缓前后移动的人
  function setV(id, v, now) {
    const p = fig(id); if (!p || v == null) return;
    p._gaV = v; TRK.add(p);
    if (now || W.replaying) p.v = v;
  }
  function person(id, o, f, v, dx) {
    const p = C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade', x: LX(f) + (dx || 0) }, o));
    setV(id, v || 0, true);
    return p;
  }
  function go(id, f, v, pose, o) {
    if (!has(id)) return;
    o = o || {};
    C().walk(id, LX(f) + (o.dx || 0), { pose: pose || 'stand', speed: o.speed, run: o.run });
    if (v != null) setV(id, v, false);
  }
  // 在约 sec 秒内走到（远的走快些，近的慢慢走；不致奔跑）
  function goIn(id, f, v, ps, sec) {
    const p = fig(id); if (!p) return;
    const d = Math.abs(LX(f) - (p.tx != null ? p.tx : p.nx));
    go(id, f, v, ps, { speed: clamp(d / (sec || 4), 0.022, 0.066) });
  }
  function pose(id, ps, o) { if (has(id)) C().pose(id, ps, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function faceF(id, f) { if (has(id)) C().face(id, LX(f)); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.hands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function rm(id) { if (has(id)) C().remove(id); }
  function robe(id, rgb, acc) { const p = fig(id); if (!p) return; C().add(id, acc ? { robe: rgb, accent: acc } : { robe: rgb }); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 园中的众人（加拉太的信徒）与其余的人
  const FOLK = ['jew', 'greek', 'slave', 'free', 'woman', 'father', 'child', 'tutor'];
  const BELIEVERS = FOLK.concat(['peter']);
  const YOKED = ['greek', 'woman', 'free'];
  const LOOKS = {
    jew:    { label: '犹太人', sex: 'm', age: 'adult', robe: [206, 198, 180], accent: [74, 92, 140], hair: 'cloth', beard: true },
    greek:  { label: '希腊人', sex: 'm', age: 'adult', robe: [172, 100, 70], accent: [214, 190, 150], hair: 'short', beard: false },
    slave:  { label: '为奴的', sex: 'm', age: 'adult', robe: [110, 102, 92], accent: [84, 76, 68], hair: 'short', beard: true },
    free:   { label: '自主的', sex: 'm', age: 'adult', robe: [118, 72, 110], accent: [222, 192, 128], hair: 'short', beard: true },
    woman:  { label: '妇人', sex: 'f', age: 'adult', robe: [150, 112, 118], accent: [226, 212, 194], hair: 'veil' },
    father: { label: '父亲', sex: 'm', age: 'adult', robe: [118, 94, 70], accent: [196, 176, 150], beard: true },
    child:  { label: '孩童', sex: 'm', age: 'child', robe: [176, 152, 112] },
    tutor:  { label: '师傅', sex: 'm', age: 'elder', robe: [146, 138, 124], prop: 'staff' },
    // 搅扰的人：寻常的衣裳、寻常的头，不以族裔或暗色为记号——只以他们所做的事（带来轭、套在人身上）与随之而来的灰雾显出
    tr:     { label: '搅扰的人', sex: 'm', age: 'adult', robe: [150, 128, 100], accent: [198, 180, 146], hair: 'short', beard: true, glow: 0.1 },
  };
  const SON_ROBE = [228, 214, 180];            // 儿子的衣裳（4:7）
  const HEIR_ROBE = [238, 204, 128];           // 后嗣的衣裳
  const LINEN = [246, 240, 226];

  // 人物身上的一点（像素）：肩、胸、头
  const HIPS = { stand: 0.49, walk: 0.49, run: 0.48, kneel: 0.27, pray: 0.27, bow: 0.46, worship: 0.27, fall: 0.07, lie: 0.07,
    sit: 0.126, seat: 0.27, raise: 0.49, gaze: 0.49, carry: 0.49, point: 0.49, wrestle: 0.42, weep: 0.48, embrace: 0.48, ride: 0.3 };
  function bodyOf(id) {
    const p = typeof id === 'string' ? fig(id) : id;
    if (!p) return null;
    const h = p._h || 34 * LS(2);
    let X, Y;
    if (p._vis && isFinite(p._x) && isFinite(p._y)) { X = p._x; Y = p._y; }
    else { X = p.nx * W.w; Y = baseY(p.layer == null ? 2 : p.layer, p.nx, p.v || 0); }
    const e = sstep(p.poseT == null ? 1 : p.poseT);
    const hp = lerp(HIPS[p.prevPose] != null ? HIPS[p.prevPose] : 0.49, HIPS[p.pose] != null ? HIPS[p.pose] : 0.49, e);
    const lean = p._lean || 0, fd = p.fd || p.facing || 1;
    const Tl = (p.age === 'child' ? 0.285 : 0.31) * h;
    const hipY = Y - hp * h;
    const sx = X + fd * Math.sin(lean) * Tl, sy = hipY - Math.cos(lean) * Tl;
    return { x: X, y: Y, h, hipY, sx, sy, cx: lerp(X, sx, 0.68), cy: lerp(hipY, sy, 0.68), lean, fd, alpha: p.alpha == null ? 1 : p.alpha };
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
      SP.gold = mk([255, 222, 150], 64, 0.4); SP.cool = mk([206, 226, 255], 64, 0.3);
      SP.grey = mk([150, 156, 168], 64, 0.45); SP.green = mk([200, 255, 220], 64, 0.3);
      SP.flame = mk([255, 176, 84], 32, 0.35);
      // 光柱：上下一样宽、两边柔化、上浓下淡
      const col = (rgb, fadeTop) => {
        const bw = 64, bh = 128, c = document.createElement('canvas'); c.width = bw; c.height = bh;
        const g = c.getContext('2d'), im = g.createImageData(bw, bh), d = im.data;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
          const t = (y + 0.5) / bh, q = Math.abs(x + 0.5 - bw / 2) / (bw / 2);
          const a = (0.4 + 0.6 * t) * Math.exp(-q * q * 3.2) * Math.min(1, (1 - t) * 10 + 0.15) * (fadeTop ? Math.min(1, t * 3.5) : 1);
          const i = (y * bw + x) * 4;
          d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = Math.round(255 * Math.min(1, a));
        }
        g.putImageData(im, 0, 0);
        return c;
      };
      SP.col = col([255, 244, 214]); SP.colG = col([255, 226, 160]); SP.colF = col([255, 244, 214], true);
    } catch (e) { /* 无画布时略过 */ }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, ry) {
    if (!img || !(a > 0.004) || !(r > 0.3) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    const rr = ry || r;
    ctx.drawImage(img, x - r, y - rr, 2 * r, 2 * rr);
  }
  // 自天而降的光从哪里起：竖屏时经文在上方，光自经文框之下柔柔地淡入（不在字的背后放亮光）
  const skyTop = () => (port() ? W.h * 0.34 : 0);
  function skyColumn(ctx, x, y1, w, a) {
    if (port()) column(ctx, SP.colF, x, skyTop(), y1, w, a);
    else column(ctx, SP.col, x, 0, y1, w, a);
  }
  // 一道自天而降的光柱（x 处，自 y0 到 y1）
  function column(ctx, img, x, y0, y1, w, a) {
    if (!img || !(a > 0.004) || !(y1 > y0) || !isFinite(x)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - w / 2, y0, w, y1 - y0);
  }
  const TINT = new Map();
  function tint(rgb) {
    const k = (rgb[0] | 0) + ',' + (rgb[1] | 0) + ',' + (rgb[2] | 0);
    let c = TINT.get(k);
    if (c) return c;
    c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d'), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, rgba([255, 255, 250], 1)); gr.addColorStop(0.18, rgba(rgb, 0.9)); gr.addColorStop(0.5, rgba(rgb, 0.25)); gr.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
    if (TINT.size > 40) TINT.clear();
    TINT.set(k, c);
    return c;
  }

  // ════════════════════════════════════════════════════════════
  //  树的模型（以树高为 1 的归一化坐标，y 向上为负；Path2D 缓存）——与伊甸的树同一画法
  // ════════════════════════════════════════════════════════════
  const HAS_P2D = typeof Path2D !== 'undefined';
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
    const m = { trunk: new Path2D(), back: new Path2D(), mid: new Path2D(), hiL: new Path2D(), hiR: new Path2D(), blobs: null, top: 0, half: 0 };
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
    let minY = 0, maxX = 0;
    for (const b of blobs) { minY = Math.min(minY, b.y - b.ry); maxX = Math.max(maxX, Math.abs(b.x) + b.rx); }
    m.top = minY; m.half = maxX; m.blobs = blobs;
    // 花：从叶团里挑一些（开花时点在冠上）
    m.blos = [];
    for (let i = 0; i < 70; i++) { const b = blobs[Math.floor(R() * blobs.length)]; m.blos.push([b.x + (R() - 0.5) * b.rx * 1.4, b.y - b.ry * (R() - 0.3), 0.6 + R() * 0.7, R()]); }
    return m;
  }
  let MOD = null;
  function models() {
    if (MOD || !HAS_P2D) return MOD;
    MOD = {
      spirit: mkTree({ seed: 522, th: 0.52, tw: 0.036, lean: 0.02,
        limbs: [[-1.0, 0.26, 0.7], [0.95, 0.27, 0.72], [-0.4, 0.3, 0.88], [0.42, 0.29, 0.9]],
        tiers: [
          { cx: 0, cy: -0.6, rx: 0.44, ry: 0.13, n: 38, r: 0.07 },
          { cx: 0.01, cy: -0.77, rx: 0.34, ry: 0.11, n: 28, r: 0.066 },
          { cx: -0.01, cy: -0.92, rx: 0.2, ry: 0.075, n: 14, r: 0.058 },
        ] }),
      olive: mkTree({ seed: 83, th: 0.42, tw: 0.055, lean: 0.07,
        limbs: [[-0.95, 0.22, 0.72], [0.85, 0.26, 0.78], [0.2, 0.22, 0.95]],
        tiers: [{ cx: 0.03, cy: -0.58, rx: 0.42, ry: 0.13, n: 32, r: 0.08 }, { cx: 0, cy: -0.76, rx: 0.24, ry: 0.08, n: 12, r: 0.07 }] }),
      cypress: mkTree({ seed: 17, th: 0.3, tw: 0.035, lean: 0.01, limbs: [],
        tiers: [{ cx: 0, cy: -0.45, rx: 0.1, ry: 0.28, n: 20, r: 0.07 }, { cx: 0, cy: -0.82, rx: 0.06, ry: 0.14, n: 8, r: 0.055 }] }),
    };
    return MOD;
  }
  const PAL = {
    spirit: { trunk: [112, 96, 80], back: [34, 80, 56], mid: [62, 122, 76], hi: [156, 196, 110], rim: [255, 240, 200] },
    bare: { trunk: [104, 92, 80], back: [74, 86, 64], mid: [96, 110, 80], hi: [150, 160, 120], rim: [240, 232, 206] },
    olive: { trunk: [84, 70, 56], back: [62, 82, 64], mid: [104, 126, 92], hi: [164, 180, 140], rim: [240, 240, 216] },
    cypress: { trunk: [70, 56, 44], back: [22, 48, 36], mid: [36, 70, 48], hi: [80, 110, 70], rim: [230, 230, 200] },
  };
  function lightDir(x, y) {
    const day = W.dayFactor > 0.3;
    const lx = day ? W.core.x : W.moon.x, ly = day ? W.core.y : W.moon.y;
    const dx = lx - x, dy = Math.min(ly - y, -W.h * 0.08);
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  }
  function lightK(x) {
    const lx = W.dayFactor > 0.3 ? W.core.x : W.moon.x;
    return clamp(0.5 + (lx - x) / (W.w * 0.35), 0, 1);
  }
  // 先把剪影向光偏移一两像素、以描光色填一遍，再正常地画——迎光的一侧便留下一道亮边
  function paintTree(ctx, m, pal, x, y, H, extra, o) {
    if (!m || !(H > 1)) return;
    o = o || {};
    const a0 = o.alpha == null ? 1 : o.alpha;
    if (a0 < 0.01) return;
    const ld = lightDir(x, y - H * 0.6);
    const k = lightK(x);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(H, H);
    if (o.sway) ctx.transform(1, 0, o.sway, 1, 0, 0);
    const rimA = clamp(0.35 + 0.45 * W.dusk + 0.2 * W.daylight, 0, 1);
    if (rimA > 0.02) {
      const off = 1.1 + 0.5 * SU();
      ctx.save();
      ctx.translate((ld[0] * off) / H, (ld[1] * off) / H);
      ctx.globalAlpha = a0 * rimA;
      ctx.fillStyle = W.shadeCSS(pal.rim, 0, null, 0.3 + extra);
      ctx.fill(m.trunk); ctx.fill(m.back); ctx.fill(m.mid);
      ctx.restore();
    }
    ctx.globalAlpha = a0;
    ctx.fillStyle = W.shadeCSS(pal.trunk, 0, null, extra); ctx.fill(m.trunk);
    ctx.fillStyle = W.shadeCSS(pal.back, 0, null, extra); ctx.fill(m.back);
    ctx.fillStyle = W.shadeCSS(pal.mid, 0, null, extra); ctx.fill(m.mid);
    const hiA = a0 * (0.55 + 0.35 * W.daylight);
    ctx.fillStyle = W.shadeCSS(pal.hi, 0, null, extra + 0.06);
    if (k < 0.99) { ctx.globalAlpha = hiA * (1 - k); ctx.fill(m.hiL); }
    if (k > 0.01) { ctx.globalAlpha = hiA * k; ctx.fill(m.hiR); }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 圣灵的果子：九样，各在冠上一处；名字自果子聚成，写在冠外 ──
  const FRUITS = [
    { n: '仁爱', c: [255, 120, 122], p: [-0.34, -0.6] },
    { n: '喜乐', c: [255, 210, 96], p: [0.32, -0.61] },
    { n: '和平', c: [156, 206, 255], p: [0.0, -0.79] },
    { n: '忍耐', c: [150, 224, 134], p: [-0.24, -0.76] },
    { n: '恩慈', c: [255, 172, 130], p: [0.23, -0.76] },
    { n: '良善', c: [255, 250, 236], p: [-0.1, -0.92] },
    { n: '信实', c: [255, 190, 98], p: [0.11, -0.91] },
    { n: '温柔', c: [214, 176, 255], p: [-0.13, -0.58] },
    { n: '节制', c: [124, 224, 208], p: [0.12, -0.59] },
  ];
  // 树的大小：芽（< 0.15）→ 小树 → 大树
  const treeK = g => (g < 0.15 ? 0 : 0.3 + 0.7 * sstep((g - 0.15) / 0.85));
  function treeGeo() {
    const x = treeX(), y = treeY(), H = treeH(), K = treeK(LV.gaTree);
    return { x, y, H, K, s: H * K };
  }
  function fruitXY(i, G) {
    G = G || treeGeo();
    const f = FRUITS[i].p, sway = Math.sin(W.t * 0.5) * 0.008 + W.wind * 0.006;
    return [G.x + (f[0] + f[1] * sway) * G.s, G.y + f[1] * G.s];
  }
  // 九个名字排成三行三列，写在冠顶之上的空中（按经文的次序：一行三个，自左而右、自上而下）；
  // 列距 2.75 字、行距 1.45 字——两个名字永不相叠，无论先后同时显出几个
  const LBL_CW = 2.75, LBL_RH = 1.45;
  function fruitLabelXY(i, G) {
    G = G || treeGeo();
    const md = models(), top = md ? md.spirit.top : -0.98;
    const sz = labelSize(), cw = sz * LBL_CW, rh = sz * LBL_RH;
    const r = Math.floor(i / 3), c = i % 3;
    const gx = clamp(G.x, cw * 1.5 + 6, W.w - cw * 1.5 - 6);
    const yb = G.y + top * G.s - sz * 1.0;          // 最下一行：离冠顶一字
    return [gx + (c - 1) * cw, yb - (2 - r) * rh];
  }
  const labelSize = () => Math.max(18, 0.031 * M());

  // ════════════════════════════════════════════════════════════
  //  状态（只在 setup / apply / 情节里改动）
  // ════════════════════════════════════════════════════════════
  let S = fresh();
  function fresh() {
    return { lines: 0, sprout: false, trouble: 'none', yoked: [], broken: [], road: false, praise: false, table: false, split: false,
      faith: false, cross: false, crucified: false, stars: false, sons: false, clothed: false, one: false, sent: false, abba: false,
      heir: false, free: false, serve: false, fruits: 0, walk: false, fell: false, shared: false, sown: false, reaped: false,
      big: false, renewed: false, sealed: false, grace: false, sack: 'none' };
  }

  // ── 转瞬的事（不属于世界的状态；重演时不放；恢复时清空）──────
  const FXL = [];     // {type, t0, dur, ...}
  const PT = [];      // 自己的微光粒子
  function addFx(b, o) { if (inst(b)) return; FXL.push(Object.assign({ t0: W.t, dur: 3 }, o)); }
  function addPt(p) { if (PT.length > 500) PT.shift(); p.t = 0; PT.push(p); }
  function motes(x, y, n, rgb, spread, o) {
    o = o || {};
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, sp = (o.speed || 30) * (0.3 + Math.random());
      addPt({ x: x + (Math.random() - 0.5) * spread, y: y + (Math.random() - 0.5) * spread * 0.6, vx: Math.cos(a) * sp + (o.vx || 0), vy: Math.sin(a) * sp * 0.6 + (o.vy || -12),
        max: (o.life || 2) * (0.6 + Math.random() * 0.8), s: (o.size || 1.6) * (0.6 + Math.random() * 0.8) * SU(), c: rgb, drag: o.drag == null ? 1.2 : o.drag, grav: o.grav || 0,
        tx: o.tx, ty: o.ty, home: !!o.home, pass: o.pass || 'air', alpha: o.alpha || 0.9 });
    }
  }
  function updatePts(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      p.t += dt;
      if (p.t >= p.max) { PT.splice(i, 1); continue; }
      if (p.home && p.tx != null) {
        const k = Math.min(1, dt * 2.2);
        p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k;
      } else {
        p.vx *= Math.exp(-p.drag * dt); p.vy = p.vy * Math.exp(-p.drag * dt) + p.grav * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
    }
  }
  function drawPts(ctx, pass) {
    if (!PT.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of PT) {
      if (p.pass !== pass) continue;
      const u = p.t / p.max, a = p.alpha * Math.min(1, u * 6) * (1 - u) * (1 - u * 0.2);
      if (a < 0.01) continue;
      ctx.globalAlpha = Math.min(1, a);
      const r = p.s * 2.4;
      ctx.drawImage(tint(p.c), p.x - r, p.y - r, 2 * r, 2 * r);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：远山上的十字架、万国的灯、远方的村庄
  // ════════════════════════════════════════════════════════════
  function crossGeo() {
    const x = XC * W.w, y = gY(0, XC) + 1, H = port() ? W.h * 0.075 : W.h * 0.1;
    return { x, y, H, bar: y - H * 0.72, arm: H * 0.3 };
  }
  function drawCross(ctx) {
    const c = LV.gaCross;
    if (c < 0.003) return;
    const G = crossGeo(), s = Math.max(1.2, G.H * 0.045);
    const b = 0.45 + 0.55 * LV.gaCrossB;
    const vt = clamp(c / 0.6, 0, 1), ht = clamp((c - 0.55) / 0.45, 0, 1);
    const pulse = 0.92 + 0.08 * Math.sin(W.t * 1.1);
    sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 光晕
    glowAt(ctx, SP.gold, G.x, G.bar, G.H * 0.75, 0.32 * b * sstep(c * 1.4) * pulse * (0.6 + 0.4 * nightK()), G.H * 0.9);
    ctx.lineCap = 'round';
    const draw = (w, a, rgb) => {
      ctx.strokeStyle = rgba(rgb, a);
      ctx.lineWidth = w;
      ctx.beginPath();
      if (vt > 0) { ctx.moveTo(G.x, G.y); ctx.lineTo(G.x, G.y - G.H * vt); }
      if (ht > 0) { ctx.moveTo(G.x - G.arm * ht, G.bar); ctx.lineTo(G.x + G.arm * ht, G.bar); }
      ctx.stroke();
    };
    draw(s * 3.4, 0.16 * b * pulse, [255, 214, 150]);
    draw(s * 1.7, 0.45 * b * pulse, [255, 236, 190]);
    draw(s * 0.75, 0.95 * b, [255, 252, 238]);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 万国的灯：远山与中丘上散着的小灯（3:8）
  const NATIONS = [];
  (function () { const r = U.mulberry32(3808); for (let i = 0; i < 26; i++) NATIONS.push([i % 3 === 2 ? 1 : 0, 0.08 + 0.9 * r(), r(), 0.6 + r() * 0.6]); })();
  function drawNations(ctx, layer) {
    const n = LV.gaNations;
    if (n < 0.003) return;
    sprites();
    const a0 = 0.3 + 0.7 * nightK();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    NATIONS.forEach((q, i) => {
      if (q[0] !== layer) return;
      const k = clamp(n * NATIONS.length - i * 0.9, 0, 1);
      if (k <= 0) return;
      const xf = layer === 1 ? lerp(0.52, 0.99, q[1]) : q[1];
      if (!W.hasLand(layer, xf * W.w, 2)) return;
      const y = gY(layer, xf) + (layer === 1 ? 2 + q[2] * 6 * LS(1) : 1 + q[2] * 2);
      const tw = 0.8 + 0.2 * Math.sin(W.t * (1.3 + q[2]) + i);
      const r = (layer === 1 ? 6 : 4) * SU() * q[3];
      glowAt(ctx, SP.warm, xf * W.w, y, r * 2.2, a0 * k * 0.55 * tw);
      ctx.globalAlpha = Math.min(1, a0 * k * tw);
      ctx.fillStyle = 'rgb(255,232,186)';
      ctx.fillRect(xf * W.w - 0.7, y - 0.7, 1.4, 1.4);
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 远山上的村庄：几座小屋、一扇暖窗（4:4 神就差遣他的儿子）；其上一点柔和的星光（伯利恒的回声）
  function drawBeth(ctx) {
    const a = LV.gaSent;
    if (a < 0.004) return;
    sprites();
    const x = XB * W.w, y = gY(0, XB) + 1, s = LS(0) * 2;
    ctx.fillStyle = css([150, 132, 110], 0, a);
    ctx.fillRect(x - 5 * s, y - 5 * s, 10 * s, 5 * s);
    ctx.fillRect(x + 1 * s, y - 8 * s, 5 * s, 3 * s);
    ctx.fillStyle = css([132, 116, 98], 0, a);
    ctx.fillRect(x - 12 * s, y - 3.6 * s, 6 * s, 3.6 * s);
    ctx.fillRect(x + 5.6 * s, y - 3 * s, 5 * s, 3 * s);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const tw = 0.9 + 0.1 * Math.sin(W.t * 1.7);
    glowAt(ctx, SP.warm, x - 1 * s, y - 2.6 * s, 26 * SU(), a * (0.4 + 0.5 * nightK()) * tw);
    glowAt(ctx, SP.pale, x - 1 * s, y - 2.6 * s, 8 * SU(), a * 0.9 * tw);
    const st = LV.gaStar;
    if (st > 0.01) {
      const sx = x - 1 * s, sy = y - Math.max(34 * SU(), 22 * s), tw2 = 0.8 + 0.2 * Math.sin(W.t * 2.3);
      glowAt(ctx, SP.warm, sx, sy, 20 * SU(), st * 0.35 * tw2);
      glowAt(ctx, SP.pale, sx, sy, 6 * SU(), st * 0.95 * tw2);
      ctx.strokeStyle = rgba([255, 246, 220], st * 0.6 * tw2);
      ctx.lineWidth = Math.max(0.8, 0.9 * SU());
      const L = 11 * SU() * tw2, l2 = L * 0.45;
      ctx.beginPath(); ctx.moveTo(sx - L, sy); ctx.lineTo(sx + L, sy); ctx.moveTo(sx, sy - L); ctx.lineTo(sx, sy + L * 1.3);
      ctx.moveTo(sx - l2, sy - l2); ctx.lineTo(sx + l2, sy + l2); ctx.moveTo(sx + l2, sy - l2); ctx.lineTo(sx - l2, sy + l2); ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：亚伯拉罕的众星（3:6–9）——比寻常夜里多得数不过来
  // ════════════════════════════════════════════════════════════
  let STARF = null;
  function starField() {
    const key = W.w + 'x' + W.h;
    if (STARF && STARF.key === key) return STARF;
    const c = document.createElement('canvas');
    const d = Math.min(2, W.dpr || 1);
    c.width = Math.max(1, Math.round(W.w * d)); c.height = Math.max(1, Math.round(W.horizonY * d));
    const g = c.getContext('2d');
    g.scale(d, d);
    const r = U.mulberry32(1508), n = Math.round(clamp(W.w * W.horizonY / 900, 180, 900));
    const bright = [];
    for (let i = 0; i < n; i++) {
      const x = r() * W.w, y = Math.pow(r(), 1.3) * W.horizonY * 0.97, m = r();
      const sz = m < 0.9 ? 0.5 + r() * 0.6 : 0.9 + r() * 0.9;
      g.fillStyle = m < 0.5 ? 'rgba(255,246,224,' + (0.35 + r() * 0.5).toFixed(2) + ')' : 'rgba(220,230,255,' + (0.35 + r() * 0.5).toFixed(2) + ')';
      g.beginPath(); g.arc(x, y, sz, 0, TAU); g.fill();
      if (m > 0.985 && bright.length < 40) bright.push([x / W.w, y / W.h, r()]);
    }
    STARF = { key, c, bright };
    return STARF;
  }
  function drawStars(ctx) {
    const s = LV.gaStars * clamp(W.night * 1.3 - 0.1, 0, 1);
    if (s < 0.01) return;
    const F = starField();
    ctx.globalAlpha = Math.min(1, s);
    ctx.drawImage(F.c, 0, 0, W.w, W.horizonY);
    sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of F.bright) {
      const tw = 0.6 + 0.4 * Math.sin(W.t * (1.2 + q[2] * 2) + q[2] * 20);
      glowAt(ctx, SP.pale, q[0] * W.w, q[1] * W.h, 4 * SU(), s * 0.8 * tw);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：保罗写信的地方——橄榄树、小桌、凳子、陶灯、书信
  // ════════════════════════════════════════════════════════════
  const WOOD = [112, 84, 58], WOOD_D = [78, 58, 42], PARCH = [236, 224, 196], CLAYC = [176, 116, 76];
  function deskGeo() {
    const s = LS(2), xf = LX(DESK_F), x = xf * W.w, y = baseY(2, xf, DESK_V);
    const top = y - 15 * s, w = 22 * s;
    return { s, x, y, top, w, lampX: x + w * 0.36, lampY: top - 1.2 * s, scX: x - w * 0.12, scY: top - 0.8 * s };
  }
  function drawOlive(ctx) {
    const md = models(); if (!md) return;
    const xf = LX(OLIVE_F), x = xf * W.w, y = baseY(2, xf, 0.06) + 1, H = treeH() * 0.62;
    paintTree(ctx, md.olive, PAL.olive, x, y, H, 0.02, { sway: Math.sin(W.t * 0.45 + 2) * 0.006 + W.wind * 0.005 });
  }
  function drawCypress(ctx) {
    const md = models(); if (!md) return;
    for (const q of [[0.985, 0.6], [1.04, 0.75]]) {
      const xf = LX(q[0]); if (xf > 1.03) continue;
      paintTree(ctx, md.cypress, PAL.cypress, xf * W.w, gY(2, Math.min(1, xf)) + 1, treeH() * q[1], 0, { sway: Math.sin(W.t * 0.5 + q[0] * 9) * 0.01 });
    }
  }
  function drawDesk(ctx) {
    const D = deskGeo(), s = D.s;
    // 凳子（保罗坐在上面）
    const px = LX(PAUL_F) * W.w, py = baseY(2, LX(PAUL_F), PAUL_V);
    ctx.fillStyle = css(WOOD_D, 2);
    ctx.fillRect(px - 4.2 * s, py - 9.2 * s, 8.4 * s, 1.8 * s);
    ctx.fillRect(px - 3.6 * s, py - 8 * s, 1.3 * s, 8 * s);
    ctx.fillRect(px + 2.3 * s, py - 8 * s, 1.3 * s, 8 * s);
    // 桌子
    ctx.fillStyle = css(WOOD_D, 2);
    ctx.fillRect(D.x - D.w * 0.42, D.top, 1.6 * s, D.y - D.top);
    ctx.fillRect(D.x + D.w * 0.36, D.top, 1.6 * s, D.y - D.top);
    ctx.fillStyle = css(WOOD, 2);
    ctx.fillRect(D.x - D.w / 2, D.top - 1.2 * s, D.w, 2.4 * s);
    ctx.fillStyle = css([150, 118, 84], 2, 0.8, 0.08);
    ctx.fillRect(D.x - D.w / 2, D.top - 1.2 * s, D.w, 0.7 * s);
    // 书信：展开时是一卷铺开的皮卷，写一句多一行金字；末了卷起
    const sealK = LV.gaSeal;
    if (sealK < 0.98) {
      const a = 1 - sealK;
      const wS = 12 * s * (1 - 0.7 * sealK), hS = 2.6 * s;
      ctx.fillStyle = css(PARCH, 2, a, 0.1);
      ctx.fillRect(D.scX - wS / 2, D.scY - hS * 0.5, wS, hS * 0.9);
      ctx.fillStyle = css([200, 180, 140], 2, a);
      ctx.beginPath(); ctx.ellipse(D.scX - wS / 2, D.scY - hS * 0.05, 0.9 * s, hS * 0.55, 0, 0, TAU); ctx.ellipse(D.scX + wS / 2, D.scY - hS * 0.05, 0.9 * s, hS * 0.55, 0, 0, TAU); ctx.fill();
      const n = Math.min(13, LV.gaLetter * 13);
      if (n > 0.02) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const lit = 0.55 + 0.45 * nightK();
        for (let i = 0; i < Math.ceil(n); i++) {
          const k = Math.min(1, n - i), row = i % 4, col = Math.floor(i / 4);
          const x0 = D.scX - wS * 0.42 + col * wS * 0.22, yy = D.scY - hS * 0.32 + row * hS * 0.2;
          ctx.strokeStyle = rgba([255, 214, 140], a * lit * 0.9);
          ctx.lineWidth = Math.max(0.6, 0.35 * s);
          ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + wS * 0.18 * k, yy); ctx.stroke();
        }
        ctx.restore();
      }
    }
    if (sealK > 0.02) {
      ctx.globalAlpha = sealK;
      ctx.fillStyle = css(PARCH, 2, 1, 0.08);
      ctx.beginPath(); ctx.ellipse(D.scX, D.scY - 0.9 * s, 4.6 * s, 1.3 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([170, 50, 40], 2, 1, 0.1);
      ctx.beginPath(); ctx.arc(D.scX, D.scY - 0.9 * s, 0.8 * s, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // 陶灯
    ctx.fillStyle = css(CLAYC, 2);
    ctx.beginPath(); ctx.ellipse(D.lampX, D.lampY, 2.4 * s, 1.1 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(D.lampX + 1.8 * s, D.lampY - 0.4 * s); ctx.lineTo(D.lampX + 3.4 * s, D.lampY - 0.9 * s); ctx.lineTo(D.lampX + 2 * s, D.lampY + 0.4 * s); ctx.fill();
  }
  function drawLampLight(ctx) {
    const a = LV.gaLamp;
    if (a < 0.01) return;
    sprites();
    const D = deskGeo(), s = D.s;
    const fl = 0.85 + 0.15 * Math.sin(W.t * 13) * Math.sin(W.t * 5.3);
    const fx0 = D.lampX + 3.2 * s, fy0 = D.lampY - 1.6 * s;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, fx0, fy0, 40 * s * (0.6 + 0.4 * nightK()), a * (0.12 + 0.45 * nightK()) * fl);
    glowAt(ctx, SP.flame, fx0, fy0, 4 * s, a * 0.9 * fl);
    ctx.restore();
    ctx.fillStyle = rgba([255, 236, 190], Math.min(1, a * 0.95));
    ctx.beginPath(); ctx.ellipse(fx0, fy0 + 0.3 * s, 0.55 * s, 1.3 * s * fl, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：园子——矮石墙、花、树
  // ════════════════════════════════════════════════════════════
  const FLOWER_C = [[250, 246, 236], [240, 128, 160], [246, 208, 92], [168, 142, 232], [226, 84, 70], [255, 180, 120]];
  let GL = null;
  function gardenLayout() {
    const key = W.w + 'x' + W.h + (port() ? 'p' : 'l') + ':' + Math.round(gY(2, 0.7)) + ':' + Math.round(gY(2, 0.9));
    if (GL && GL.key === key) return GL;
    FLDP = null;
    const r = U.mulberry32(4806), stones = [], flowers = [];
    for (let i = 0; i < 54; i++) stones.push([0.16 + 0.86 * (i / 53) + (r() - 0.5) * 0.006, 0.75 + r() * 0.5, r()]);
    const FC = FLOWER_C;
    for (let i = 0; i < 150; i++) {
      const f = 0.1 + r() * 0.92, v = 0.04 + Math.pow(r(), 0.9) * 0.9;
      if (f > FIELD[0] - 0.02 && v > FIELD_V[0] - 0.04 && v < FIELD_V[1] + 0.06) continue;
      flowers.push([f, v, FC[i % FC.length], r(), 0.7 + r() * 0.6]);
    }
    GL = { key, stones, flowers };
    return GL;
  }
  function wallPaths() {
    const L = gardenLayout();
    if (L.wall || !HAS_P2D) return L.wall;
    const s = LS(2), body = new Path2D(), top = new Path2D();
    for (const q of L.stones) {
      if (q[0] > 0.34 && q[0] < 0.4) continue;              // 园门
      const xf = LX(q[0]); if (xf > 1.02) continue;
      const x = xf * W.w, y = baseY(2, xf, 0.05) + 1.5 * s;
      const w = 5 * s * q[1], h = 4.4 * s * (0.7 + q[2] * 0.5);
      body.moveTo(x + w, y - h * 0.4); body.ellipse(x, y - h * 0.4, w, h * 0.6, 0, 0, TAU);
      top.moveTo(x + w * 0.6, y - h * 0.62); top.ellipse(x, y - h * 0.62, w * 0.6, h * 0.22, 0, 0, TAU);
    }
    L.wall = { body, top };
    return L.wall;
  }
  function drawWall(ctx) {
    const P = wallPaths(), s = LS(2);
    if (!P) return;
    ctx.fillStyle = css([128, 118, 102], 2);
    ctx.fill(P.body);
    ctx.fillStyle = css([190, 178, 158], 2, 0.5 * dayA(), 0.06);
    ctx.fill(P.top);
    // 园门的两根柱
    ctx.fillStyle = css([150, 138, 118], 2);
    for (const f of [0.335, 0.405]) { const xf = LX(f), x = xf * W.w, y = baseY(2, xf, 0.05) + 1.5 * s; ctx.fillRect(x - 1.8 * s, y - 11 * s, 3.6 * s, 11 * s); }
  }
  function drawFlowers(ctx) {
    const b = LV.gaFlow, nw = LV.gaNew;
    if (b < 0.01 && nw < 0.01) return;
    const L = gardenLayout(), s = LS(2), N = L.flowers.length;
    // 茎一笔画完，花按颜色分组一次填（开放时只随大小变化，不逐朵改透明度）
    const heads = [[], [], [], [], [], []];
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const q = L.flowers[i];
      const k = Math.min(1, clamp(b * 1.3 - (i / N) * 0.3, 0, 1) + nw * (i % 2) * 0.6);
      if (k < 0.04) continue;
      const xf = LX(q[0]); if (xf > 1.01) continue;
      const x = xf * W.w, y = baseY(2, xf, q[1]);
      const h = (3 + q[3] * 4) * s * k * (0.7 + 0.35 * q[1]);
      const tx = x + Math.sin(W.t * 0.8 + i) * 0.4 * s;
      ctx.moveTo(x, y); ctx.lineTo(tx, y - h);
      heads[i % 6].push(tx, y - h, (0.9 + 0.7 * q[4]) * s * k);
    }
    ctx.strokeStyle = css([70, 110, 60], 2);
    ctx.lineWidth = Math.max(0.6, 0.4 * s);
    ctx.stroke();
    for (let c = 0; c < 6; c++) {
      const H = heads[c]; if (!H.length) continue;
      ctx.fillStyle = css(FLOWER_C[c], 2, 1, 0.1 + 0.1 * nw);
      ctx.beginPath();
      for (let j = 0; j < H.length; j += 3) { ctx.moveTo(H[j] + H[j + 2], H[j + 1]); ctx.arc(H[j], H[j + 1], H[j + 2], 0, TAU); }
      ctx.fill();
    }
  }
  // 园子当中的树：芽 → 小树 → 大树；开花；九样果子
  function drawTree(ctx) {
    const g = LV.gaTree;
    if (g < 0.003) return;
    sprites();
    const G = treeGeo(), md = models();
    const lit = LV.gaTreeG;
    // 身后的光（夜里、恩光里更显）
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const gl = lit * (0.35 + 0.5 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 0.9));
    if (G.K > 0) glowAt(ctx, SP.pale, G.x, G.y - 0.72 * G.s, G.s * 0.8, 0.28 * gl, G.s * 0.6);
    else { glowAt(ctx, SP.pale, G.x, G.y - 10 * LS(2), 30 * LS(2), 0.75 * Math.min(1, g * 12) * (0.6 + 0.4 * lit)); glowAt(ctx, SP.gold, G.x, G.y - 4 * LS(2), 12 * LS(2), 0.6 * Math.min(1, g * 12)); }
    ctx.restore();
    ctx.globalAlpha = 1;
    if (G.K <= 0) {
      // 芽：一根细茎、两三片嫩叶，微微发光
      const s = LS(2), k = clamp(g / 0.15, 0, 1), h = 24 * s * k;
      if (h < 0.5) return;
      const sw = Math.sin(W.t * 1.1) * 0.8 * s * k;
      ctx.strokeStyle = css([96, 150, 80], 2, 1, 0.15);
      ctx.lineWidth = Math.max(0.8, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(G.x, G.y); ctx.quadraticCurveTo(G.x - 1 * s, G.y - h * 0.5, G.x + sw, G.y - h); ctx.stroke();
      ctx.fillStyle = css([128, 196, 104], 2, 1, 0.2);
      const lf = (t, d, len) => { const x = G.x + sw * t, y = G.y - h * t; ctx.beginPath(); ctx.ellipse(x + d * len * 0.55, y - len * 0.15, len * 0.6, len * 0.28, d * -0.5, 0, TAU); ctx.fill(); };
      lf(0.5, -1, 5.4 * s * k); lf(0.75, 1, 5.8 * s * k); if (k > 0.6) lf(0.98, -1, 4.2 * s * k);
      return;
    }
    const sway = Math.sin(W.t * 0.5) * 0.008 + W.wind * 0.006;
    const pal = LV.gaTree > 0.3 ? PAL.spirit : PAL.bare;
    if (md) paintTree(ctx, md.spirit, pal, G.x, G.y, G.s, 0.04 + 0.06 * lit + 0.08 * LV.gaNew, { sway });
    // 花
    const bl = LV.gaBlos;
    if (bl > 0.02 && md) {
      ctx.save();
      ctx.translate(G.x, G.y);
      const n = md.spirit.blos.length;
      for (let i = 0; i < n; i++) {
        const q = md.spirit.blos[i];
        // 果子结出时，花谢到三成五上下，免得果子的颜色淹没在花瓣里
        const k = clamp(bl * 1.4 - q[3] * 0.4, 0, 1) * (1 - 0.65 * sstep(LV.gaFruit * 1.25));
        if (k < 0.03) continue;
        ctx.fillStyle = W.shadeCSS(i % 3 ? [252, 240, 244] : [246, 196, 214], 0, k, 0.14);
        ctx.beginPath(); ctx.arc((q[0] + q[1] * sway) * G.s, q[1] * G.s, Math.max(0.7, 0.012 * q[2] * G.s), 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }
  function drawFruits(ctx) {
    const fr = LV.gaFruit;
    if (fr < 0.003 || LV.gaTree < 0.3) return;
    sprites();
    const G = treeGeo(), s = LS(2);
    ctx.save();
    for (let i = 0; i < FRUITS.length; i++) {
      const k = clamp(fr * FRUITS.length - i, 0, 1);
      if (k <= 0) continue;
      const P = fruitXY(i, G), F = FRUITS[i];
      const tw = 0.86 + 0.14 * Math.sin(W.t * (1.1 + i * 0.13) + i * 1.9);
      const r = 5 * s * (0.4 + 0.6 * easeO(k));
      // 果子是园中最亮的：一圈白亮的光晕（白昼里也 ≥ 0.8），外面再一层本色的光
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.pale, P[0], P[1], r * 3.4, k * (0.82 + 0.18 * nightK()) * tw);
      ctx.globalAlpha = Math.min(1, k * (0.7 + 0.3 * nightK() + 0.3 * LV.gaGrace) * tw);
      ctx.drawImage(tint(F.c), P[0] - r * 4.8, P[1] - r * 4.8, r * 9.6, r * 9.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = Math.min(1, k);
      // 果身：饱满的本色，一道略深的边把它与花、叶分开
      ctx.fillStyle = rgba(mix(F.c, [70, 44, 40], 0.5), 1);
      ctx.beginPath(); ctx.arc(P[0], P[1], r * 1.14, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba(mix(F.c, [255, 255, 255], 0.12), 1);
      ctx.beginPath(); ctx.arc(P[0], P[1], r, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba([255, 255, 250], 0.9 * k);
      ctx.beginPath(); ctx.arc(P[0] - r * 0.3, P[1] - r * 0.35, r * 0.34, 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：光——赐下的光、施恩的光柱、光路、因信的光、心里的光、恩光
  // ════════════════════════════════════════════════════════════
  function ribbon(ctx, f0, f1, v0, v1, t, rgb, wid, a) {
    if (!(a > 0.004) || t <= 0.002) return;
    const n = 48, fe = lerp(f0, f1, t);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const f = lerp(f0, fe, i / n), xf = LX(f), v = lerp(v0, v1, (i / n) * t);
      const x = xf * W.w, y = baseY(2, Math.min(1, xf), v);
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [w, k] of [[wid * 3.2, 0.14], [wid * 1.6, 0.3], [wid * 0.6, 0.85]]) {
      ctx.strokeStyle = rgba(rgb, a * k);
      ctx.lineWidth = Math.max(0.6, w);
      ctx.stroke();
    }
  }
  function drawRoad(ctx) {
    const a = LV.gaRoadA * (0.45 + 0.4 * nightK());
    const s = LS(2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ribbon(ctx, 0.08, 1.05, 0.44, 0.5, LV.gaRoad, [255, 220, 150], 2.2 * s, a);
    // 靠圣灵行事：淡青的光路（5:25）
    const p = LV.gaPath;
    if (p > 0.002) ribbon(ctx, TREE_F - 0.01, 0.16, 0.22, 0.74, p, [196, 236, 255], 2 * s, (0.4 + 0.3 * nightK()) * Math.min(1, p * 3) * LV.gaPathA);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawHaze(ctx) {
    const h = LV.gaHaze;
    if (h < 0.01) return;
    sprites();
    const s = LS(2);
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const f = 0.2 + i * 0.1 + Math.sin(W.t * 0.07 + i * 1.7) * 0.03, xf = LX(f);
      if (xf > 1.1) continue;
      const y = baseY(2, Math.min(1, xf), 0.4) - 18 * s + Math.sin(W.t * 0.11 + i) * 3 * s;
      glowAt(ctx, SP.grey, xf * W.w, y, 56 * s, h * 0.7 * (0.7 + 0.3 * Math.sin(W.t * 0.13 + i * 2.1)), 26 * s);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawBeams(ctx) {
    sprites();
    const s = LS(2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 1:4 自上而来的一道光，落在园子当中
    const gA = LV.gaGift;
    if (gA > 0.005) {
      const x = treeX(), y = treeY();
      skyColumn(ctx, x, y, 26 * s, 0.55 * gA);
      glowAt(ctx, SP.pale, x, y - 4 * s, 26 * s, 0.7 * gA, 12 * s);
    }
    // 1:15 施恩召我的光柱，落在保罗身上
    const cA = LV.gaCall;
    if (cA > 0.005) {
      const B = bodyOf('paul');
      if (B) { skyColumn(ctx, B.x, B.y + 2 * s, 34 * s, 0.7 * cA); glowAt(ctx, SP.pale, B.x, B.y - B.h * 0.5, B.h * 0.9, 0.5 * cA); }
    }
    // 3:26 都是神的儿子：一道光落在孩童身上（与施恩召保罗的光同一样子）
    const sA = LV.gaSon;
    if (sA > 0.005) {
      const B = bodyOf('child');
      if (B) { skyColumn(ctx, B.x, B.y + 2 * s, 30 * s, 0.7 * sA); glowAt(ctx, SP.pale, B.x, B.y - B.h * 0.5, B.h * 1.1, 0.55 * sA); }
    }
    // 4:6 呼叫「阿爸！父！」：一片柔光自天顶降在围着树的众人身上——父只是自上而来的光
    const aA = LV.gaAbba;
    if (aA > 0.005) {
      const x = treeX(), yb = baseY(2, LX(TREE_F), 0.72), w = (port() ? 0.52 : 0.26) * W.w, pk = port() ? 0.72 : 1;
      if (!port()) glowAt(ctx, SP.pale, x, W.h * 0.02, w * 0.8, 0.7 * aA, w * 0.24);
      skyColumn(ctx, x, yb, w, 0.46 * aA * pk);
      skyColumn(ctx, x, yb, w * 0.45, 0.34 * aA * pk);
      glowAt(ctx, SP.warm, x, yb - 20 * s, w * 0.6, 0.24 * aA, 26 * s);
    }
    // 2:16 因信称义：光落在所有人身上，一样的光
    const fA = LV.gaFaith;
    if (fA > 0.005) {
      for (const id of BELIEVERS) {
        const B = bodyOf(id); if (!B) continue;
        column(ctx, SP.colG, B.x, B.y - B.h * 4, B.y + 1, B.h * 0.8, 0.28 * fA * B.alpha);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 心里的光（4:6）与众人的光（3:28），恩光（6:18）
  function drawHearts(ctx) {
    const h = LV.gaHearts, o = LV.gaOne, gr = LV.gaGrace;
    if (h < 0.01 && o < 0.01 && gr < 0.01) return;
    sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (h > 0.01 || gr > 0.01) {
      for (const id of BELIEVERS) {
        const B = bodyOf(id); if (!B) continue;
        const pul = 0.85 + 0.15 * Math.sin(W.t * 2.2 + B.x * 0.05);
        glowAt(ctx, SP.warm, B.cx, B.cy, B.h * 0.42, (0.35 * h + 0.3 * gr) * pul * B.alpha * (0.6 + 0.4 * nightK()));
      }
    }
    if (o > 0.01) {
      const x = treeX(), y = baseY(2, LX(TREE_F), 0.4), rx = (port() ? 0.3 : 0.15) * W.w;
      ctx.strokeStyle = rgba([255, 232, 180], 0.3 * o * (0.6 + 0.4 * nightK()));
      ctx.lineWidth = 2.4 * LS(2);
      ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.12 + 4, 0, 0, TAU); ctx.stroke();
      glowAt(ctx, SP.gold, x, y, rx * 1.1, 0.16 * o, rx * 0.22 + 8);
    }
    if (gr > 0.01) {
      // 园子上空一层温暖的光
      const x = treeX(), y = treeY() - treeH() * 0.4;
      glowAt(ctx, SP.gold, x - W.w * 0.05, y, W.w * 0.36, 0.14 * gr, treeH() * 0.9);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：安提阿的桌子（在人之前画——坐在后面的人只露出上身）
  // ════════════════════════════════════════════════════════════
  function drawTable(ctx) {
    const a = LV.gaTable;
    if (a < 0.01) return;
    sprites();
    const s = LS(2);
    const x0 = LX(TABLE[0]) * W.w, x1 = LX(TABLE[1]) * W.w;
    const y0 = baseY(2, LX(TABLE[0]), TABLE_V), y1 = baseY(2, LX(TABLE[1]), TABLE_V);
    const Ht = 11.5 * s, th = 2.2 * s, dep = 2.6 * s;
    const Y = t => lerp(y0, y1, t);
    const sp = LV.gaSplit;
    // 同桌的暖光（隔开时，空下的座位那里暗下去）
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7, f = lerp(TABLE[0], TABLE[1], t);
      const gap = f > TABLE_GAP[0] && f < TABLE_GAP[1] ? 1 - 0.85 * sp : 1;
      glowAt(ctx, SP.warm, lerp(x0, x1, t), Y(t) - Ht - 4 * s, 16 * s, a * gap * (0.1 + 0.25 * nightK() + 0.12 * LV.gaFaith), 9 * s);
    }
    ctx.restore();
    ctx.globalAlpha = a;
    ctx.fillStyle = css(WOOD_D, 2);
    for (const t of [0.04, 0.5, 0.96]) { const x = lerp(x0, x1, t); ctx.fillRect(x - 0.9 * s, Y(t) - Ht, 1.8 * s, Ht); }
    // 桌面（略见其面）与前面的横板
    ctx.fillStyle = css([150, 116, 80], 2, 1, 0.03);
    ctx.beginPath();
    ctx.moveTo(x0 - 0.5 * s, y0 - Ht - dep); ctx.lineTo(x1 + 0.5 * s, y1 - Ht - dep); ctx.lineTo(x1 + 2 * s, y1 - Ht); ctx.lineTo(x0 - 2 * s, y0 - Ht);
    ctx.fill();
    ctx.fillStyle = css([104, 78, 54], 2);
    ctx.beginPath();
    ctx.moveTo(x0 - 2 * s, y0 - Ht); ctx.lineTo(x1 + 2 * s, y1 - Ht); ctx.lineTo(x1 + 2 * s, y1 - Ht + th + 1.4 * s); ctx.lineTo(x0 - 2 * s, y0 - Ht + th + 1.4 * s);
    ctx.fill();
    // 一条细麻的桌巾，沿桌面铺开
    ctx.fillStyle = css([200, 188, 160], 2, 0.8);
    ctx.beginPath();
    ctx.moveTo(x0 + 3 * s, y0 - Ht - dep * 0.75); ctx.lineTo(x1 - 3 * s, y1 - Ht - dep * 0.75); ctx.lineTo(x1 - 3 * s, y1 - Ht - dep * 0.3); ctx.lineTo(x0 + 3 * s, y0 - Ht - dep * 0.3);
    ctx.fill();
    // 饼与杯
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7, f = lerp(TABLE[0], TABLE[1], t), x = lerp(x0, x1, t), y = Y(t) - Ht - dep * 0.45;
      const k = f > TABLE_GAP[0] && f < TABLE_GAP[1] ? 1 - 0.5 * sp : 1;
      ctx.globalAlpha = a * k;
      if (i % 2) { ctx.fillStyle = css([196, 146, 86], 2, 1, 0.05); ctx.beginPath(); ctx.ellipse(x, y - 0.9 * s, 2 * s, 1.1 * s, 0, 0, TAU); ctx.fill(); }
      else {
        ctx.fillStyle = css([150, 108, 76], 2);
        ctx.beginPath(); ctx.moveTo(x - 1.1 * s, y - 2.6 * s); ctx.lineTo(x + 1.1 * s, y - 2.6 * s); ctx.lineTo(x + 0.4 * s, y - 1.2 * s); ctx.lineTo(x + 0.8 * s, y); ctx.lineTo(x - 0.8 * s, y); ctx.lineTo(x - 0.4 * s, y - 1.2 * s); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：轭（套在肩上；断了落在地上）
  // ════════════════════════════════════════════════════════════
  const YOKE_C = [92, 68, 48];
  function yokeShape(ctx, x, y, ang, L, th, bows) {
    const c = Math.cos(ang), sn = Math.sin(ang);
    const P = (u, w) => [x + c * u - sn * w, y + sn * u + c * w];
    ctx.beginPath();
    const a = P(-L / 2, -th / 2), b = P(L / 2, -th / 2), d = P(L / 2, th / 2), e = P(-L / 2, th / 2), m = P(0, -th * 1.1);
    ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(m[0], m[1], b[0], b[1]); ctx.lineTo(d[0], d[1]); ctx.lineTo(e[0], e[1]); ctx.closePath();
    ctx.fill();
    if (bows) {
      ctx.lineWidth = Math.max(0.7, th * 0.4);
      ctx.beginPath();
      for (const u of [-L * 0.28, L * 0.28]) {
        const p0 = P(u - th * 0.9, th * 0.4), p1 = P(u + th * 0.9, th * 0.4), q = P(u, th * 2.6);
        ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(q[0], q[1], p1[0], p1[1]);
      }
      ctx.stroke();
    }
  }
  // 搅扰的人手里带来的轭：横在身前（tr1 两副、tr2 一副）；正在递出去的不再画在手里
  const YOKE_FROM = { greek: 'tr1', woman: 'tr1', free: 'tr2' };
  function handAt(B) { return [B.x + B.fd * B.h * 0.16, B.hipY - B.h * 0.1]; }
  function flying(from) { for (const e of FXL) if (e.type === 'yokefly' && e.from === from && W.t - e.t0 <= e.dur) return true; return false; }
  function drawCarriedYokes(ctx) {
    if (S.trouble !== 'here' || S.yoked.length || S.free) return;
    for (const [id, n] of [['tr1', 2], ['tr2', 1]]) {
      if (flying(id)) continue;
      const B = bodyOf(id); if (!B) continue;
      const L = B.h * 0.46, th = B.h * 0.08, H = handAt(B);
      ctx.globalAlpha = B.alpha;
      ctx.fillStyle = css(YOKE_C, 2);
      ctx.strokeStyle = css(YOKE_C, 2);
      for (let i = 0; i < n; i++) yokeShape(ctx, H[0] + B.fd * i * th * 0.6, H[1] - i * th * 1.5, -0.12 * B.fd, L, th, true);
    }
    ctx.globalAlpha = 1;
  }
  // 递出去的轭：自搅扰的人手里划一道弧，落到外邦人的肩上
  function drawYokeFly(ctx) {
    for (const e of FXL) {
      if (e.type !== 'yokefly') continue;
      const u = (W.t - e.t0) / e.dur;
      if (u < 0 || u > 1) continue;
      const A = bodyOf(e.from), B = bodyOf(e.to); if (!A || !B) continue;
      const H = handAt(A), k = sstep(u);
      const x = lerp(H[0], B.sx, k), y = lerp(H[1], B.sy, k) - Math.sin(Math.PI * k) * B.h * 0.45;
      const L = lerp(A.h * 0.46, B.h * 0.5, k), th = lerp(A.h * 0.08, B.h * 0.085, k);
      ctx.globalAlpha = Math.min(A.alpha, B.alpha);
      ctx.fillStyle = css(YOKE_C, 2);
      ctx.strokeStyle = css(YOKE_C, 2);
      yokeShape(ctx, x, y, lerp(-0.12 * A.fd, B.lean * B.fd, k), L, th, true);
    }
    ctx.globalAlpha = 1;
  }
  // 重担（6:1–2）：一个灰褐的大口袋，一道浅色的绳；分担之后成了两个小的
  const SACK_C = [96, 86, 76], ROPE_C = [226, 212, 180];
  function sackShape(ctx, x, y, R, a) {
    ctx.globalAlpha = a;
    ctx.fillStyle = css(SACK_C, 2, 1, 0.02);
    ctx.beginPath(); ctx.ellipse(x, y, R * 0.86, R, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - R * 0.34, y - R * 0.8); ctx.lineTo(x, y - R * 1.28); ctx.lineTo(x + R * 0.34, y - R * 0.8); ctx.fill();
    ctx.fillStyle = css([140, 128, 114], 2, 0.55, 0.04);
    ctx.beginPath(); ctx.ellipse(x - R * 0.28, y - R * 0.25, R * 0.3, R * 0.5, -0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(ROPE_C, 2, 1, 0.08);
    ctx.lineWidth = Math.max(0.7, R * 0.12);
    ctx.beginPath(); ctx.moveTo(x - R * 0.36, y - R * 0.84); ctx.lineTo(x + R * 0.36, y - R * 0.84); ctx.stroke();
  }
  function sackOn(ctx, id, big, a) {
    const B = bodyOf(id); if (!B) return;
    const R = B.h * (big ? 0.19 : 0.12);
    const x = B.sx - B.fd * (B.h * 0.1 + R * 0.55), y = B.sy + R * 0.55;
    // 绳：自袋口越过肩头，到胸前
    ctx.globalAlpha = a * B.alpha;
    ctx.strokeStyle = css(ROPE_C, 2, 1, 0.08);
    ctx.lineWidth = Math.max(0.7, B.h * 0.022);
    ctx.beginPath(); ctx.moveTo(x, y - R * 0.84); ctx.quadraticCurveTo(B.sx, B.sy - B.h * 0.05, B.sx + B.fd * B.h * 0.06, B.sy + B.h * 0.14); ctx.stroke();
    sackShape(ctx, x, y, R, a * B.alpha);
  }
  function drawSacks(ctx) {
    const a = LV.gaSack;
    if (a < 0.01 || S.sack === 'none') return;
    if (S.sack === 'one') sackOn(ctx, 'free', true, a);
    else if (S.sack === 'down') {
      // 他跌倒了：担子落在地上，在他身边
      const f = WALK_FREE[0] + 0.03, v = WALK_FREE[1] - 0.04, xf = LX(f);
      const R = 34 * LS(2) * 0.19;
      sackShape(ctx, xf * W.w, baseY(2, Math.min(1, xf), v) - R * 0.9, R, a);
    } else if (S.sack === 'two') { sackOn(ctx, 'free', false, a); sackOn(ctx, 'slave', false, a); }
    ctx.globalAlpha = 1;
  }
  function drawYokes(ctx) {
    drawCarriedYokes(ctx);
    drawYokeFly(ctx);
    drawSacks(ctx);
    const y = LV.gaYoke, br = LV.gaBroke;
    if (y > 0.01) {
      for (const id of S.yoked) {
        const B = bodyOf(id); if (!B) continue;
        const L = B.h * 0.5, th = B.h * 0.085;
        const ang = B.lean * B.fd;   // 横木与躯干垂直：沿着"前"的方向
        ctx.globalAlpha = y * B.alpha;
        ctx.fillStyle = css(YOKE_C, 2);
        ctx.strokeStyle = css(YOKE_C, 2);
        yokeShape(ctx, B.sx, B.sy - th * 0.2, ang, L, th, true);
        ctx.fillStyle = css([170, 140, 104], 2, 0.6 * dayA() * y * B.alpha, 0.05);
        const c = Math.cos(ang), sn = Math.sin(ang);
        ctx.beginPath(); ctx.moveTo(B.sx - c * L * 0.45, B.sy - th * 0.7 - sn * L * 0.45); ctx.lineTo(B.sx + c * L * 0.45, B.sy - th * 0.7 + sn * L * 0.45);
        ctx.lineWidth = Math.max(0.5, th * 0.3); ctx.strokeStyle = css([176, 146, 110], 2, 0.5 * dayA() * y * B.alpha); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (br > 0.01) {
      const s = LS(2);
      for (const q of S.broken) {
        const xf = LX(q[0]); const x = xf * W.w, yy = baseY(2, Math.min(1, xf), q[1]);
        const L = 34 * s * 0.32, th = 34 * s * 0.07;
        ctx.globalAlpha = br;
        ctx.fillStyle = css(YOKE_C, 2);
        ctx.strokeStyle = css(YOKE_C, 2);
        yokeShape(ctx, x - L * 0.5, yy - th * 0.6, 0.18, L, th, false);
        yokeShape(ctx, x + L * 0.55, yy - th * 0.5, -0.3, L * 0.9, th, false);
      }
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：田——陇沟、苗、金黄的禾稼、禾捆；中丘的山坡也一片金黄
  // ════════════════════════════════════════════════════════════
  let FLD = null;
  function fieldModel() {
    if (FLD) return FLD;
    const r = U.mulberry32(6070), stalks = [], sheaves = [];
    for (let row = 0; row < 5; row++) for (let i = 0; i < 32; i++) stalks.push([FIELD[0] + 0.01 + (i + r() * 0.6) / 32 * (FIELD[1] - FIELD[0] - 0.02), lerp(FIELD_V[0] + 0.03, FIELD_V[1] - 0.03, row / 4) + (r() - 0.5) * 0.03, r(), r()]);
    for (let i = 0; i < 6; i++) sheaves.push([FIELD[0] + 0.05 + i * 0.052 + (r() - 0.5) * 0.012, lerp(FIELD_V[0] + 0.06, FIELD_V[1] - 0.06, (i * 0.37) % 1), r()]);
    FLD = { stalks, sheaves };
    return FLD;
  }
  let FLDP = null;
  function stalkPos(F) {
    gardenLayout();
    if (FLDP) return FLDP;
    FLDP = new Float32Array(F.stalks.length * 2);
    F.stalks.forEach((q, i) => { const xf = LX(q[0]); FLDP[i * 2] = xf * W.w; FLDP[i * 2 + 1] = baseY(2, Math.min(1, xf), q[1]); });
    return FLDP;
  }
  function drawField(ctx) {
    const fa = LV.gaField;
    if (fa < 0.01) return;
    const s = LS(2), F = fieldModel();
    const f1 = Math.min(FIELD[1], XLp(port() ? 0.93 : 0.97, port()));
    // 田地
    ctx.fillStyle = css([92, 70, 50], 2, fa * 0.9);
    ctx.beginPath();
    const n = 24;
    const tap = t => 0.1 * (1 - sstep(t * 5));        // 田的西头收窄，边缘不那么方
    for (let i = 0; i <= n; i++) { const t = i / n, xf = LX(lerp(FIELD[0], f1, t)); const x = xf * W.w, y = baseY(2, Math.min(1, xf), FIELD_V[0] + tap(t) + 0.015 * Math.sin(i * 1.7)); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = n; i >= 0; i--) { const t = i / n, xf = LX(lerp(FIELD[0], f1, t)); ctx.lineTo(xf * W.w, baseY(2, Math.min(1, xf), FIELD_V[1] - tap(t) + 0.012 * Math.sin(i * 2.3))); }
    ctx.closePath(); ctx.fill();
    // 陇沟
    ctx.strokeStyle = css([60, 44, 32], 2, fa * 0.8);
    ctx.lineWidth = Math.max(0.6, 0.6 * s);
    ctx.beginPath();
    for (let row = 1; row < 5; row++) {
      const v = lerp(FIELD_V[0], FIELD_V[1], row / 5);
      for (let i = 0; i <= n; i++) { const xf = LX(lerp(FIELD[0], f1, i / n)); const x = xf * W.w, y = baseY(2, Math.min(1, xf), v); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    }
    ctx.stroke();
    // 苗与禾稼
    const sp = LV.gaSprout, gd = LV.gaGold, sh = LV.gaSheaf;
    if (sp > 0.01) {
      const green = [96, 150, 70], gold = [226, 184, 92];
      const col = mix(green, gold, gd);
      ctx.strokeStyle = css(col, 2, 1, 0.04 + 0.1 * gd);
      ctx.lineWidth = Math.max(0.6, 0.5 * s);
      ctx.beginPath();
      const heads = [];
      const PP = stalkPos(F);
      for (let si = 0; si < F.stalks.length; si++) {
        const q = F.stalks[si];
        if (q[0] > f1) continue;
        const k = clamp(sp * 1.25 - q[2] * 0.25, 0, 1);
        if (k <= 0) continue;
        const cut = sh > 0.02 && q[3] < 0.55 * sh;       // 收割过的
        const x = PP[si * 2], y = PP[si * 2 + 1];
        const h = (cut ? 1.2 : (4 + 7 * sstep(sp) + 2 * q[3]) * k) * s;
        const bend = Math.sin(W.t * 1.2 + q[0] * 40) * 0.6 * s * gd + W.wind * s;
        ctx.moveTo(x, y); ctx.lineTo(x + bend, y - h);
        if (!cut && gd > 0.2) heads.push([x + bend, y - h]);
      }
      ctx.stroke();
      if (heads.length) {
        ctx.fillStyle = css([236, 196, 104], 2, sstep((gd - 0.2) / 0.6), 0.1);
        ctx.beginPath();
        for (const p of heads) ctx.rect(p[0] - 0.75 * s, p[1] - 2.4 * s, 1.5 * s, 2.6 * s);
        ctx.fill();
      }
    }
    if (sh > 0.01) {
      for (const q of F.sheaves) {
        if (q[0] > f1) continue;
        const xf = LX(q[0]), x = xf * W.w, y = baseY(2, Math.min(1, xf), q[1]);
        const k = clamp(sh * 1.6 - q[2] * 0.6, 0, 1); if (k <= 0) continue;
        const h = 9 * s * k;
        ctx.fillStyle = css([222, 178, 90], 2, 1, 0.08);
        ctx.beginPath(); ctx.moveTo(x - 2.6 * s, y); ctx.lineTo(x - 0.8 * s, y - h * 0.55); ctx.lineTo(x - 1.8 * s, y - h); ctx.lineTo(x + 1.8 * s, y - h); ctx.lineTo(x + 0.8 * s, y - h * 0.55); ctx.lineTo(x + 2.6 * s, y); ctx.fill();
        ctx.fillStyle = css([150, 110, 60], 2);
        ctx.fillRect(x - 1.1 * s, y - h * 0.58, 2.2 * s, 0.8 * s);
      }
    }
  }
  function drawMidGold(ctx) {
    const gd = LV.gaGold;
    if (gd < 0.01) return;
    const s = LS(1), n = 30;
    const x0 = 0.6, x1 = 1.0;
    ctx.fillStyle = css([226, 186, 96], 1, 0.5 * gd, 0.08);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const xf = lerp(x0, x1, i / n); const y = gY(1, xf) + 1; if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let i = n; i >= 0; i--) { const xf = lerp(x0, x1, i / n); ctx.lineTo(xf * W.w, gY(1, xf) + (6 + 5 * Math.sin(i * 1.3)) * s * (0.4 + 0.6 * Math.sin(Math.PI * i / n))); }
    ctx.closePath(); ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（只是装饰）
  // ════════════════════════════════════════════════════════════
  function drawFxl(ctx) {
    if (!FXL.length) return;
    sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const u = (W.t - e.t0) / e.dur;
      if (u < 0 || u > 1) continue;
      if (e.type === 'orb') {
        // 自天顶降下的一点光
        const k = easeO(u), x = lerp(e.x0, e.x1, k), y = lerp(e.y0, e.y1, k * k);
        const a = Math.min(1, u * 4) * (u > 0.85 ? (1 - u) / 0.15 : 1);
        glowAt(ctx, SP.pale, x, y, e.r * 2.6, 0.5 * a);
        glowAt(ctx, SP.warm, x, y, e.r, 0.95 * a);
        column(ctx, SP.col, x, Math.max(0, y - e.r * 16), y, e.r * 0.9, 0.35 * a);
      } else if (e.type === 'thread') {
        // 十字架的光一线落进保罗心里
        const B = bodyOf('paul'), G = crossGeo();
        if (!B) continue;
        const a = Math.sin(Math.PI * u);
        ctx.strokeStyle = rgba([255, 232, 180], 0.35 * a);
        ctx.lineWidth = 1.6 * SU();
        ctx.beginPath(); ctx.moveTo(G.x, G.bar); ctx.quadraticCurveTo((G.x + B.cx) / 2, Math.min(G.bar, B.cy) - 30 * SU(), B.cx, B.cy); ctx.stroke();
        glowAt(ctx, SP.warm, B.cx, B.cy, B.h * 0.5, 0.5 * a);
      } else if (e.type === 'flash') {
        const a = Math.sin(Math.PI * u);
        glowAt(ctx, SP[e.img || 'pale'], e.x, e.y, e.r, (e.a || 0.6) * a, e.ry);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的总调度
  // ════════════════════════════════════════════════════════════
  function drawUnder(ctx, pass) {
    if (!isCur()) return;
    if (pass === 'sky') { U.safe('ga.stars', () => drawStars(ctx)); return; }
    if (pass === 'far') { U.safe('ga.cross', () => drawCross(ctx)); U.safe('ga.nat0', () => drawNations(ctx, 0)); U.safe('ga.beth', () => drawBeth(ctx)); return; }
    if (pass === 'mid') { U.safe('ga.gold', () => drawMidGold(ctx)); U.safe('ga.nat1', () => drawNations(ctx, 1)); return; }
    if (pass === 'near') {
      U.safe('ga.wall', () => drawWall(ctx));
      U.safe('ga.cypress', () => drawCypress(ctx));
      U.safe('ga.olive', () => drawOlive(ctx));
      U.safe('ga.field', () => drawField(ctx));
      U.safe('ga.road', () => drawRoad(ctx));
      U.safe('ga.flowers', () => drawFlowers(ctx));
      U.safe('ga.tree', () => drawTree(ctx));
      U.safe('ga.fruits', () => drawFruits(ctx));
      U.safe('ga.desk', () => drawDesk(ctx));
      return;
    }
    if (pass === 'air') {
      U.safe('ga.table', () => drawTable(ctx));
      U.safe('ga.yokes', () => drawYokes(ctx));
      U.safe('ga.haze', () => drawHaze(ctx));
      U.safe('ga.lamp', () => drawLampLight(ctx));
      U.safe('ga.beams', () => drawBeams(ctx));
      U.safe('ga.hearts', () => drawHearts(ctx));
      U.safe('ga.fxl', () => drawFxl(ctx));
      U.safe('ga.pts', () => drawPts(ctx, 'air'));
    }
    if (pass === 'top') U.safe('ga.ptsT', () => drawPts(ctx, 'top'));
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function pick(x, y, r) {
    if (!isCur()) return null;
    let best = null;
    const test = (label, px, py, d0) => {
      if (!isFinite(px) || !isFinite(py)) return;
      const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const D = deskGeo();
    test('书信', D.scX, D.scY - 2 * D.s, 5 * D.s);
    if (LV.gaTree > 0.3) { const G = treeGeo(); test(LV.gaFruit > 0.5 ? '圣灵的果子' : '树', G.x, G.y - 0.72 * G.s, G.s * 0.3); }
    if (LV.gaCross > 0.5) { const G = crossGeo(); test('十字架', G.x, G.bar, G.H * 0.1); }
    if (LV.gaYoke > 0.5) for (const id of S.yoked) { const B = bodyOf(id); if (B) test('轭', B.sx, B.sy, B.h * 0.1); }
    if (LV.gaBroke > 0.5) for (const q of S.broken) { const xf = LX(q[0]); test('轭', xf * W.w, baseY(2, Math.min(1, xf), q[1]) - 3, 6); }
    if (LV.gaSheaf > 0.5) { const xf = LX(0.73); test('禾捆', xf * W.w, baseY(2, Math.min(1, xf), 0.76) - 6, 30 * LS(2)); }
    else if (LV.gaField > 0.5) { const xf = LX(0.73); test('田', xf * W.w, baseY(2, Math.min(1, xf), 0.76), 30 * LS(2)); }
    if (LV.gaNations > 0.5 && W.night > 0.4) test('万国的灯', XB * W.w, gY(0, XB) - 4, 20);
    return best;
  }

  let lastPort = null;
  function remap(from, to) {
    const c = C();
    if (!c || !c.people) return;
    const fix = q => { if (!q || q.layer !== 2) return; q.nx = LXp(XLp(q.nx, from), to); if (q.tx != null) q.tx = LXp(XLp(q.tx, from), to); };
    for (const q of c.people.values()) fix(q);
  }
  const SCENE = {
    init() { sprites(); models(); },
    resize() {
      GL = null; STARF = null; FLDP = null;
      const p = port();
      if (lastPort !== null && p !== lastPort && isCur()) U.safe('galatians.remap', () => remap(lastPort, p));
      lastPort = p;
    },
    update(dt) {
      const t = W.t;
      for (let i = FXL.length - 1; i >= 0; i--) if (t - FXL[i].t0 > FXL[i].dur) FXL.splice(i, 1);
      updatePts(dt);
      if (!isCur()) { if (PT.length) PT.length = 0; STARF = null; return; }
      // 在近地纵深里走动的人：v 缓缓到位
      for (const p of TRK) {
        if (p.dying && p.alpha < 0.02) { TRK.delete(p); continue; }
        if (p._gaV == null || p.v === p._gaV) continue;
        const st = 0.16 * dt * (W.fast || 1);
        if (Math.abs(p._gaV - p.v) <= st) p.v = p._gaV; else p.v += Math.sign(p._gaV - p.v) * st;
      }
      if (W.replaying) return;
      // 恩光：金色的微光自上而下落在园中
      const gr = LV.gaGrace;
      if (gr > 0.05 && Math.random() < dt * 22 * gr) {
        const xf = LX(0.12 + Math.random() * 0.88);
        if (xf < 1.02) addPt({ x: xf * W.w, y: gY(2, Math.min(1, xf)) - treeH() * (0.4 + Math.random() * 0.9), vx: (Math.random() - 0.5) * 6, vy: 9 + Math.random() * 12,
          max: 3 + Math.random() * 2.5, s: (0.9 + Math.random() * 0.9) * SU(), c: Math.random() < 0.5 ? [255, 226, 160] : [255, 244, 214], drag: 0.1, grav: 0, pass: 'air', alpha: 0.8 });
      }
      // 结了果子的树：偶尔自果子上飘起一点同色的光
      if (LV.gaFruit > 0.95 && LV.gaTree > 0.9 && Math.random() < dt * 1.4) {
        const i = Math.floor(Math.random() * FRUITS.length), P = fruitXY(i);
        motes(P[0], P[1], 1, FRUITS[i].c, 4, { speed: 6, vy: -10, life: 2.6, size: 1.1, alpha: 0.7 });
      }
    },
    drawUnder,
    draw() {},
    reset() { TRK.clear(); PT.length = 0; FXL.length = 0; },
    restore() {
      PT.length = 0; FXL.length = 0;
      for (const p of TRK) if (p._gaV != null) p.v = p._gaV;
    },
    pick,
    sig() {
      return { lines: S.lines, sprout: S.sprout, trouble: S.trouble, yoked: S.yoked.slice(), broken: S.broken.length, road: S.road, praise: S.praise,
        table: S.table, split: S.split, faith: S.faith, cross: S.cross, crucified: S.crucified, stars: S.stars, sons: S.sons, clothed: S.clothed,
        one: S.one, sent: S.sent, abba: S.abba, heir: S.heir, free: S.free, serve: S.serve, fruits: S.fruits, walk: S.walk, fell: S.fell,
        shared: S.shared, sown: S.sown, reaped: S.reaped, big: S.big, renewed: S.renewed, sealed: S.sealed, grace: S.grace, sack: S.sack };
    },
    get debug() {
      const md = models(), G = treeGeo();
      return { S: Object.assign({}, S), trk: TRK.size, pt: PT.length, lv: MY.reduce((o, k) => { o[k] = +LV[k].toFixed(3); return o; }, {}),
        tree: { x: G.x, y: G.y, s: G.s, top: md ? md.spirit.top : null, half: md ? md.spirit.half : null }, labels: FRUITS.map((F, i) => fruitLabelXY(i, { x: G.x, y: G.y, H: G.H, K: 1, s: G.H }).map(Math.round)) };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕的开端：黎明前的园子，冬末（与上一幕怎样结束无关）
  // ════════════════════════════════════════════════════════════
  const SPOT0 = {
    jew: [0.24, 0.22], greek: [0.34, 0.46], woman: [0.44, 0.6], free: [0.5, 0.42], slave: [0.64, 0.26], father: [0.74, 0.32],
  };
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.55, herbs: 0.3, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.set('bloom', 0, true); W.set('bare', 0.3, true);
    W.set('gale', 0.08, true); W.set('rain', 0, true); W.set('storm', 0, true); W.set('gloom', 0, true); W.set('hail', 0, true);
    W.weatherExclude = [];
    W.freeClock = false;
    const gx = W.w * 0.75;
    W.setOrigin('grass', gx, W.ridgeBaseY(2, gx)); W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.262, 0, true);
    W.setPop('fish', 60, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.2, W.h * 0.8, true);
    W.setPop('bird', 6, W.w * 0.4, W.h * 0.3, true);
    W.setPop('cattle', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('beast', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('creeper', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('human', 0, W.w * 0.9, W.h * 0.8, true);
    W.set('gaLamp', 1, true);
    W.set('gaHaze', 0.18, true);
    S = fresh();
    TRK.clear(); FXL.length = 0; PT.length = 0; GL = null;
    lastPort = port();
    const c = C();
    c.clear({ fade: false });
    person('paul', look('paul', { facing: 1, pose: 'seat', from: 'none', prop: null }), PAUL_F, PAUL_V);
    person('tutor', Object.assign({}, LOOKS.tutor, { facing: 1, pose: 'stand', glow: 0.1, from: 'none' }), 0.2, 0.3, -PAIR());
    person('child', Object.assign({}, LOOKS.child, { facing: 1, pose: 'stand', glow: 0.12, from: 'none' }), 0.2, 0.3, PAIR());
    hands('tutor', 'child', true);
    for (const id of ['jew', 'greek', 'woman', 'slave', 'free', 'father']) {
      const sp = SPOT0[id];
      person(id, Object.assign({}, LOOKS[id], { facing: sp[0] < 0.55 ? 1 : -1, pose: 'stand', glow: 0.1, from: 'none' }), sp[0], sp[1]);
    }
    face('jew', 1); face('greek', -1); face('slave', 1); face('free', -1); face('father', -1);
    avoid([0.3, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function write(b, n) {
    // 保罗写下一句：信上多一行金字，几点金光自书信飘向这一句成就之处
    S.lines = Math.min(13, n);
    lv('gaLetter', S.lines / 13, b);
    sfx(b, 'write', { soft: true, x: 0.5 });
  }
  function letterTo(b, x, y, n) {
    if (inst(b) || !fx()) return;
    const D = deskGeo(), tg = [];
    for (let i = 0; i < (n || 14); i++) tg.push([x + (Math.random() - 0.5) * 40 * SU(), y + (Math.random() - 0.5) * 24 * SU(), 1 + Math.random() * 1.4]);
    fx().sow(D.scX, D.scY - 3 * D.s, tg, [255, 224, 160], { pass: 'top', dur: 2.6, stagger: 0.9 });
  }
  function ringAt(b, x, y, rgb, rf, dur, w) { if (inst(b) || !fx()) return; fx().ring(x, y, rgb, M() * rf, dur || 2.4, w || 1.4); }
  function sparkAt(b, x, y, n, rgb, spread) { if (inst(b) || !fx()) return; fx().sparkle(x, y, n, rgb, spread || 12, 'top'); }
  function glowAll(ids, v) { for (const id of ids) glow(id, v); }
  function believersHere() { return BELIEVERS.filter(id => has(id)); }
  function faceAll(ids, target) { for (const id of ids) faceF(id, target); }
  function flash(b, x, y, r, a, img) { addFx(b, { type: 'flash', x, y, r, a: a || 0.6, img, dur: 1.6 }); }

  // ════════════════════════════════════════════════════════════
  //  话语（每一句的故事约二十至二十八秒）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:3–7 恩惠、平安；一粒光的种子；搅扰的人与轭 ─────────────
    {
      kind: 'act', utter: '基督照我们父神的旨意，为我们的罪舍己', cmd: 'send 书信 --to 加拉太的各教会 --with 恩惠,平安', ref: '1:4',
      verse: [
        { text: '愿恩惠、平安从父神<br>与我们的主耶稣基督归与你们！', ref: '加拉太书 1:3', hold: 5.5 },
        { text: '基督照我们父神的旨意，为我们的罪舍己，<br>要救我们脱离这罪恶的世代。', ref: '加拉太书 1:4', hold: 6.5 },
        { text: '我希奇你们这么快离开<br>那藉着基督之恩召你们的，去从别的福音。……<br>不过有些人搅扰你们，<br>要把基督的福音更改了。', ref: '加拉太书 1:6–7', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.3, 22, inst(b));
            write(b, 1);
            if (!inst(b)) { const G = treeGeo(); letterTo(b, G.x, G.y - 30 * LS(2), 12); }
          }],
          [1.2, () => { faceAll(['jew', 'greek', 'woman', 'slave', 'free', 'father', 'tutor', 'child'], TREE_F); }],
          // 1:4 一道光自上而来，落在园子当中；一粒光的种子落进地里
          [6.9, b => { lv('gaGift', 1, b); sfx(b, 'harp', { soft: true }); }],
          [8.4, b => {
            lv('gaTree', 0.1, b); lv('gaTreeG', 0.6, b); S.sprout = true;
            if (!inst(b)) { const G = treeGeo(); ringAt(b, G.x, G.y, [255, 240, 200], 0.2, 2.6, 1.4); sparkAt(b, G.x, G.y - 4, 22, [255, 244, 214], 10); }
            sfx(b, 'chime', { soft: true });
          }],
          [9.4, b => { lv('gaHaze', 0.05, b); glowAll(FOLK, 0.16); }],
          [12.6, b => lv('gaGift', 0, b)],
          // 1:6–7 搅扰的人来了，手里带着轭；灰冷的雾随他们爬进园中
          [13.4, b => {
            person('tr1', Object.assign({}, LOOKS.tr, { facing: -1, pose: 'carry' }), XLp(1.03, port()), 0.6);
            person('tr2', Object.assign({}, LOOKS.tr, { facing: -1, pose: 'carry', robe: [128, 118, 104], accent: [186, 174, 150], beard: false }), XLp(1.07, port()), 0.5);
            go('tr1', 0.63, 0.62, 'carry', { speed: 0.06 }); go('tr2', 0.7, 0.52, 'carry', { speed: 0.06 });
            S.trouble = 'here';
            lv('gaHaze', 0.55, b);
            sfx(b, 'whisper', { soft: true, x: 0.9 });
          }],
          [17.2, () => { for (const id of YOKED) faceF(id, 0.66); face('tr1', -1); face('tr2', -1); }],
          // 他们把轭递过去，套在外邦人的肩上
          [18, b => {
            pose('tr1', 'point'); pose('tr2', 'point');
            for (const id of YOKED) addFx(b, { type: 'yokefly', from: YOKE_FROM[id], to: id, dur: 1.35 });
          }],
          // 轭落在肩上（与递过去的弧同时落定）
          [19.3, b => {
            S.yoked = YOKED.slice();
            W.set('gaYoke', 1, true);
            for (const id of YOKED) { pose(id, 'bow'); glow(id, 0.06); }
            if (!inst(b)) for (const id of YOKED) { const B = bodyOf(id); if (B) motes(B.sx, B.sy, 8, [150, 156, 170], 10 * SU(), { speed: 12, life: 1.6, alpha: 0.5 }); }
            sfx(b, 'chains', { soft: true, x: 0.7 });
          }],
          [20.8, () => { pose('tr1', 'stand'); pose('tr2', 'stand'); for (const id of ['jew', 'slave', 'father']) faceF(id, 0.5); }],
        ]);
      },
    },

    // ── 1:13–24 施恩召我的神 ────────────────────────────────────
    {
      kind: 'call', utter: '那把我从母腹里分别出来、又施恩召我的神', cmd: 'reveal 他的儿子 --in 保罗的心 --to 外邦人', ref: '1:15',
      verse: [
        { text: '你们听见我从前在犹太教中所行的事，<br>怎样极力逼迫残害神的教会。', ref: '加拉太书 1:13', hold: 6 },
        { text: '然而，那把我从母腹里分别出来、<br>又施恩召我的神，既然乐意<br>将他儿子启示在我心里，<br>叫我把他传在外邦人中，……', ref: '加拉太书 1:15–16', hold: 8 },
        { text: '不过听说那从前逼迫我们的，<br>现在传扬他原先所残害的真道。<br>他们就为我的缘故，归荣耀给神。', ref: '加拉太书 1:23–24', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.335, 22, inst(b));
            write(b, 2);
            // 1:13 从前：保罗站起来，低下头；他心里的光暗了，天色也暗一点
            pose('paul', 'stand'); face('paul', 1);
            W.set('gloom', 0.22, inst(b));
          }],
          [1.6, () => { pose('paul', 'bow'); glow('paul', 0.04); }],
          // 1:15 一根光柱落在他身上
          [7, b => {
            W.set('gloom', 0, inst(b));
            lv('gaCall', 1, b);
            sfx(b, 'angel', { soft: true, x: 0.5 });
            if (!inst(b)) { W.flash = Math.max(W.flash || 0, 0.25); }
          }],
          [7.6, () => pose('paul', 'kneel')],
          [11.2, b => {
            glow('paul', 0.45); pose('paul', 'stand');
            if (!inst(b)) { const B = bodyOf('paul'); if (B) { ringAt(b, B.cx, B.cy, [255, 236, 190], 0.3, 2.6, 1.6); sparkAt(b, B.cx, B.cy, 26, [255, 240, 200], 14); } }
          }],
          [12.4, b => {
            lv('gaCall', 0, b);
            // 一条光路自他脚前铺向外邦人的园子
            lv('gaRoad', 1, b); lv('gaRoadA', 1, b); S.road = true;
            sfx(b, 'harp', { soft: true });
          }],
          [15, () => { faceAll(['jew', 'slave', 'father', 'tutor', 'child'], PAUL_F); }],
          [16.2, b => { glowAll(FOLK.filter(id => YOKED.indexOf(id) < 0), 0.22); if (!inst(b)) for (const id of ['jew', 'slave', 'father', 'child']) { const B = bodyOf(id); if (B) sparkAt(b, B.cx, B.cy, 10, [255, 226, 170], 8); } }],
          // 1:23–24 他们就为我的缘故，归荣耀给神
          [18.4, b => { for (const id of ['jew', 'slave', 'father', 'tutor', 'child']) pose(id, 'raise'); sfx(b, 'sing', { soft: true }); }],
          [19.6, () => { pose('paul', 'seat'); face('paul', 1); }],
          [23, b => { for (const id of ['jew', 'slave', 'father', 'tutor', 'child']) pose(id, 'stand'); lv('gaRoadA', 0.45, b); S.praise = true; }],
        ]);
      },
    },

    // ── 2:11–16 安提阿的桌子；人称义乃是因信 ─────────────────────
    {
      kind: 'act', utter: '人称义不是因行律法，乃是因信耶稣基督', cmd: 'unset 隔断 && justify --by 信 --not 行律法', ref: '2:16',
      verse: [
        { text: '后来，矶法到了安提阿；……<br>从雅各那里来的人未到以先，<br>他和外邦人一同吃饭，及至他们来到，<br>他因怕奉割礼的人，就退去与外邦人隔开了。', ref: '加拉太书 2:11–12', hold: 8.5 },
        { text: '但我一看见他们行的不正，与福音的真理不合，<br>就在众人面前对矶法说：「你既是犹太人，<br>若随外邦人行事，不随犹太人行事，<br>怎么还勉强外邦人随犹太人呢？」', ref: '加拉太书 2:14', hold: 9 },
        { text: '既知道人称义不是因行律法，<br>乃是因信耶稣基督，……<br>因为凡有血气的，没有一人因行律法称义。', ref: '加拉太书 2:16', hold: 7.5 },
      ],
      apply(c) {
        const SEAT = { father: 0.2, greek: 0.245, peter: 0.29, jew: 0.335, woman: 0.38, slave: 0.425, free: 0.47 };
        T(c, [
          [0, b => {
            W.goTo(0.4, 24, inst(b));
            write(b, 3);
            lv('gaTable', 1, b); S.table = true; lv('gaRoadA', 0.2, b);
            // 矶法自西边来，坐在外邦人中间
            person('peter', look('peter', { label: '矶法', facing: 1, pose: 'walk' }), 0.12, 0.5);
            for (const id in SEAT) go(id, SEAT[id], SEAT_V, 'sit', { speed: 0.045 });
            sfx(b, 'crowd', { soft: true });
          }],
          [5.2, () => {
            for (const id in SEAT) face(id, SEAT[id] < 0.34 ? 1 : -1);
            face('peter', 1);
          }],
          // 及至他们来到：搅扰的人走到桌子东头
          [5.8, () => { go('tr1', 0.68, 0.4, 'stand', { speed: 0.03 }); go('tr2', 0.73, 0.3, 'stand', { speed: 0.03 }); }],
          // 他就退去与外邦人隔开了；其余的犹太人也随着他
          [6.6, b => { go('peter', 0.58, 0.44, 'stand', { speed: 0.035 }); lv('gaSplit', 1, b); S.split = true; }],
          [7.4, () => go('jew', 0.625, 0.5, 'stand', { speed: 0.035 })],
          [8.6, () => { for (const id of ['greek', 'father', 'woman', 'slave', 'free']) faceF(id, 0.6); }],
          // 2:14 保罗当面抵挡他（在桌子东头的前面，众人面前）
          [10, b => { go('paul', 0.53, 0.7, 'stand', { speed: 0.05 }); sfx(b, 'wind', { soft: true }); }],
          [16.2, () => { face('paul', 1); face('peter', -1); face('jew', -1); pose('paul', 'point'); }],
          [19.4, () => pose('paul', 'stand')],
          // 2:16 光落在所有人身上，一样的光
          [20, b => {
            lv('gaFaith', 1, b); S.faith = true;
            glowAll(BELIEVERS, 0.3);
            sfx(b, 'harp', { soft: true });
            if (!inst(b)) { const G = treeGeo(); ringAt(b, G.x, G.y - 10, [255, 236, 190], 0.4, 3.4, 1.4); }
          }],
          [26.2, b => lv('gaFaith', 0.12, b)],
        ]);
      },
    },

    // ── 2:20–3:1 十字架活画在眼前 ────────────────────────────
    {
      kind: 'act', utter: '他是爱我，为我舍己', cmd: 'crucify --with 基督 self && exec 基督 --in 我', ref: '2:20',
      verse: [
        { text: '我已经与基督同钉十字架，<br>现在活着的不再是我，<br>乃是基督在我里面活着；', ref: '加拉太书 2:20', hold: 7 },
        { text: '并且我如今在肉身活着，<br>是因信神的儿子而活；<br>他是爱我，为我舍己。', ref: '加拉太书 2:20', hold: 6.5 },
        { text: '无知的加拉太人哪，耶稣基督钉十字架，<br>已经活画在你们眼前，谁又迷惑了你们呢？', ref: '加拉太书 3:1', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.56, 24, inst(b));
            write(b, 4);
            // 远山上，一个光的十字架一笔一笔画出来
            lv('gaCross', 1, b); lv('gaCrossB', 1, b); S.cross = true;
            lv('gaSplit', 0.5, b);
            sfx(b, 'chime', { soft: true, x: 0.6 });
          }],
          [1.2, () => { face('paul', -1); }],
          [3.2, b => {
            pose('paul', 'kneel');
            // 现在活着的不再是我：一缕灰影自他身上散去
            if (!inst(b)) { const B = bodyOf('paul'); if (B) motes(B.cx, B.cy, 26, [140, 144, 156], 14 * SU(), { speed: 16, vx: -14, vy: -22, life: 2.4, alpha: 0.55, size: 2 }); }
            glow('paul', 0.1);
          }],
          [5.6, b => {
            glow('paul', 0.55); S.crucified = true;
            if (!inst(b)) { const B = bodyOf('paul'); if (B) { ringAt(b, B.cx, B.cy, [255, 232, 180], 0.22, 2.4, 1.4); sparkAt(b, B.cx, B.cy, 22, [255, 236, 190], 10); } }
            sfx(b, 'harp', { soft: true });
          }],
          // 他是爱我，为我舍己：十字架的光一线落进他心里
          [9, b => { addFx(b, { type: 'thread', dur: 5.2 }); sfx(b, 'heart', { soft: true }); }],
          [13.4, () => pose('paul', 'stand')],
          // 3:1 众人都转向远山；桌子撤去
          [15.4, b => {
            for (const id of ['father', 'greek', 'woman', 'slave', 'free']) pose(id, YOKED.indexOf(id) >= 0 ? 'bow' : 'stand');
            lv('gaTable', 0, b);
          }],
          [16.2, () => {
            go('father', 0.25, 0.4); go('greek', 0.32, 0.5, 'bow'); go('free', 0.4, 0.56, 'bow'); go('woman', 0.7, 0.58, 'bow'); go('slave', 0.66, 0.3);
          }],
          [17.2, b => {
            faceAll(['jew', 'slave', 'father', 'tutor', 'child', 'peter'], XLp(XC, port()));
            for (const id of ['jew', 'slave', 'father', 'tutor', 'child', 'peter']) pose(id, 'gaze');
            lv('gaCrossB', 1, b);
          }],
          [19.2, () => { go('paul', PAUL_F, PAUL_V, 'seat', { speed: 0.055 }); }],
          [22.6, () => { for (const id of ['jew', 'slave', 'father', 'tutor', 'child', 'peter']) pose(id, 'stand'); faceAll(['greek', 'woman', 'free'], XLp(XC, port())); }],
          [24.4, b => { lv('gaCrossB', 0.25, b); face('paul', 1); }],
        ]);
      },
    },

    // ── 3:6–9 夜：亚伯拉罕的众星；万国都必因你得福 ─────────────
    {
      kind: 'promise', utter: '万国都必因你得福', cmd: 'bless --all 万国 --via 亚伯拉罕 --by 信', ref: '3:8',
      verse: [
        { text: '正如「亚伯拉罕信神，这就算为他的义」。<br>所以，你们要知道：<br>那以信为本的人，就是亚伯拉罕的子孙。', ref: '加拉太书 3:6–7', hold: 7.5 },
        { text: '并且圣经既然预先看明，<br>神要叫外邦人因信称义，<br>就早已传福音给亚伯拉罕，说：<br>「万国都必因你得福。」', ref: '加拉太书 3:8', hold: 8 },
        { text: '可见那以信为本的人<br>和有信心的亚伯拉罕一同得福。', ref: '加拉太书 3:9', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.01, 14, inst(b));
            write(b, 5);
            lv('gaFaith', 0, b);
            glowAll(BELIEVERS, 0.3); glow('paul', 0.4);
          }],
          [4.5, b => {
            for (const id of ['jew', 'slave', 'father', 'tutor', 'child', 'peter']) pose(id, 'gaze');
            lv('gaStars', 1, b); S.stars = true;
            sfx(b, 'stars', { soft: true });
          }],
          // 万国都必因你得福：星光一点一点落在每个人头上；远近的山上亮起万国的灯
          [10.5, b => {
            lv('gaNations', 1, b);
            if (!inst(b) && fx()) {
              for (const id of believersHere()) {
                const B = bodyOf(id); if (!B) continue;
                const tg = [];
                for (let i = 0; i < 6; i++) tg.push([B.x + (Math.random() - 0.5) * 6, B.y - B.h * (0.9 + Math.random() * 0.2), 1 + Math.random()]);
                fx().sow(B.x + (Math.random() - 0.5) * 200 * SU(), W.h * (0.05 + Math.random() * 0.2), tg, [236, 240, 255], { pass: 'top', dur: 2.8, stagger: 1.2 });
              }
            }
            sfx(b, 'chime', { soft: true });
          }],
          [13.4, b => {
            glowAll(BELIEVERS, 0.38);
            lv('gaHaze', 0.3, b);
            if (!inst(b)) for (const id of believersHere()) { const B = bodyOf(id); if (B) sparkAt(b, B.x, B.y - B.h, 8, [236, 240, 255], 6); }
          }],
          [18.4, b => { for (const id of ['jew', 'slave', 'father', 'tutor', 'child', 'peter']) pose(id, 'stand'); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 3:23–26 训蒙的师傅；都是神的儿子 ───────────────────────
    {
      kind: 'name', utter: '你们因信基督耶稣都是神的儿子', cmd: 'release --from 师傅的手下 && adopt 神的儿子 --all', ref: '3:26',
      verse: [
        { text: '但这因信得救的理还未来以先，<br>我们被看守在律法之下，……<br>这样，律法是我们训蒙的师傅，<br>引我们到基督那里，使我们因信称义。', ref: '加拉太书 3:23–24', hold: 8.5 },
        { text: '但这因信得救的理既然来到，<br>我们从此就不在师傅的手下了。<br>所以，你们因信基督耶稣都是神的儿子。', ref: '加拉太书 3:25–26', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.27, 16, inst(b));
            write(b, 6);
            // 黎明：园子当中的芽长成一棵小树
            lv('gaTree', 0.45, b); lv('gaTreeG', 0.8, b);
            W.set('grass', 0.8, inst(b)); W.set('bare', 0.14, inst(b));
          }],
          // 师傅牵着孩童，把他领到树前（走在众人的前面，好叫人看清他们）
          [1.6, () => {
            glow('tutor', 0.32); glow('child', 0.34);
            go('tutor', 0.51, 0.68, 'stand', { speed: 0.024, dx: -PAIR() });
            go('child', 0.51, 0.68, 'stand', { speed: 0.024, dx: PAIR() });
          }],
          [8, b => lv('gaStars', 0, b)],
          // 不在师傅的手下了：他放了手，退后一步；孩童自己走到树下
          [10, () => { hands('tutor', 'child', false); }],
          [10.6, () => { go('child', TREE_F - 0.02, 0.34, 'stand', { speed: 0.012 }); go('tutor', 0.45, 0.74, 'bow', { speed: 0.012 }); }],
          [12.6, () => { face('tutor', 1); face('child', -1); }],
          // 都是神的儿子：一道光落在孩童身上，光自他向众人漾开
          [13.2, b => {
            lv('gaSon', 1, b); glow('child', 0.6); S.sons = true;
            if (!inst(b)) { const B = bodyOf('child'); if (B) { ringAt(b, B.cx, B.cy, [255, 240, 200], 0.3, 2.8, 1.5); sparkAt(b, B.cx, B.cy, 24, [255, 244, 214], 10); } W.flash = Math.max(W.flash || 0, 0.12); }
            sfx(b, 'harp', { soft: true });
          }],
          [14.4, b => {
            glowAll(BELIEVERS.filter(id => id !== 'child'), 0.34); lv('gaHaze', 0.2, b);
            if (!inst(b)) {
              const B = bodyOf('child'); if (B) { ringAt(b, B.cx, B.y - B.h * 0.3, [255, 236, 190], 0.55, 3.2, 1.6); ringAt(b, B.cx, B.y - B.h * 0.3, [255, 244, 214], 0.85, 3.8, 1.2); }
              for (const id of believersHere()) { const P = bodyOf(id); if (P && id !== 'child') sparkAt(b, P.cx, P.cy, 10, [255, 236, 190], 6); }
            }
          }],
          [16.4, b => { pose('tutor', 'stand'); lv('gaSon', 0.25, b); }],
        ]);
      },
    },

    // ── 3:27–29 披戴基督；都成为一了 ───────────────────────────
    {
      kind: 'act', utter: '你们在基督耶稣里都成为一了', cmd: 'merge 犹太人 希腊人 为奴的 自主的 男 女 --into 一', ref: '3:28',
      verse: [
        { text: '你们受洗归入基督的都是披戴基督了。', ref: '加拉太书 3:27', hold: 5 },
        { text: '并不分犹太人、希腊人，<br>自主的、为奴的，或男或女，<br>因为你们在基督耶稣里都成为一了。', ref: '加拉太书 3:28', hold: 7.5 },
        { text: '你们既属乎基督，就是亚伯拉罕的后裔，<br>是照着应许承受产业的了。', ref: '加拉太书 3:29', hold: 6 },
      ],
      apply(c) {
        const RING = {
          jew: [0.37, 0.34, -1], greek: [0.37, 0.34, 1], slave: [0.48, 0.5, -1], free: [0.48, 0.5, 1],
          woman: [0.67, 0.42, -1], father: [0.67, 0.42, 1], peter: [0.46, 0.2, 0], tutor: [0.73, 0.2, 0], child: [0.56, 0.66, 0],
        };
        T(c, [
          [0, b => {
            W.goTo(0.34, 20, inst(b));
            write(b, 7);
            lv('gaTree', 0.55, b); lv('gaSon', 0, b);
          }],
          // 3:27 披戴基督：各人的衣裳一件件亮起来
          [0.6, b => {
            S.clothed = true;
            FOLK.concat(['peter']).forEach((id, i) => {
              const p = fig(id); if (!p) return;
              // 矶法的衣袍是各幕共用的样子，不改；他同样披上一层光
              if (id !== 'peter') { if (!p._gaRobe0) p._gaRobe0 = p.robe.slice(); robe(id, mix(p._gaRobe0, LINEN, 0.3)); }
              if (!inst(b)) { const B = bodyOf(id); if (B) motes(B.cx, B.cy - B.h * 0.1, 7, [255, 248, 230], B.h * 0.4, { speed: 8, vy: -6, life: 1.8, size: 1.3, alpha: 0.8 }); }
            });
            sfx(b, 'chime', { soft: true });
          }],
          // 3:28 隔开的都回来；众人围着树，成双成对地牵手
          [6.4, b => {
            lv('gaSplit', 0, b); S.split = false;
            for (const id in RING) { const q = RING[id]; go(id, q[0], q[1], YOKED.indexOf(id) >= 0 ? 'bow' : 'stand', { speed: 0.03, dx: q[2] * PAIR() }); }
            go('tr1', 0.8, 0.2); go('tr2', 0.85, 0.1);
            sfx(b, 'crowd', { soft: true });
          }],
          [12.2, b => {
            hands('jew', 'greek', true); hands('slave', 'free', true); hands('woman', 'father', true);
            face('jew', 1); face('greek', -1); face('slave', 1); face('free', -1); face('woman', 1); face('father', -1);
            faceF('peter', TREE_F); faceF('tutor', TREE_F); faceF('child', TREE_F);
            lv('gaOne', 1, b); S.one = true;
            // 众人的光聚成一个「一」字
            if (!inst(b) && fx()) {
              // 写在空中：冠顶与地平线之上，大而暖金，笔画看得出粗细
              const G = treeGeo(), sz = Math.max(60, 0.2 * M());
              const ids = believersHere();
              let k = 0;
              const src = () => { const B = bodyOf(ids[(k++) % ids.length]); return B ? [B.cx, B.cy] : [G.x, G.y]; };
              const top = G.y - G.H * 0.98 * treeK(0.55);
              const y = Math.max(sz * 0.7, Math.min(top - 1.6 * sz, W.horizonY - 1.4 * sz));
              const x = clamp(G.x, sz * 0.7, W.w - sz * 0.7);
              fx().name('一', x, y, sz, [255, 204, 104], src, { hold: 4.6 });
            }
            sfx(b, 'harp', { soft: true });
          }],
          [15.6, b => { W.set('bloom', 0.3, inst(b)); W.set('herbs', 0.6, inst(b)); glowAll(BELIEVERS, 0.36); }],
          [19.6, b => lv('gaOne', 0.3, b)],
        ]);
      },
    },

    // ── 4:4–7 时候满足；阿爸！父！ ───────────────────────────
    {
      kind: 'call', utter: '阿爸！父！', cmd: 'send 儿子的灵 --into 你们的心  # 阿爸，父', ref: '4:6',
      verse: [
        { text: '及至时候满足，神就差遣他的儿子，<br>为女子所生，且生在律法以下，<br>要把律法以下的人赎出来，<br>叫我们得着儿子的名分。', ref: '加拉太书 4:4–5', hold: 8.5 },
        { text: '你们既为儿子，<br>神就差他儿子的灵进入你们的心，<br>呼叫：「阿爸！父！」', ref: '加拉太书 4:6', hold: 6.5 },
        { text: '可见，从此以后，<br>你不是奴仆，乃是儿子了；<br>既是儿子，就靠着神为后嗣。', ref: '加拉太书 4:7', hold: 6.5 },
      ],
      apply(c) {
        const sx = c && c.x != null ? c.x : W.w * 0.72, sy = c && c.y != null ? c.y : W.h * 0.55;
        T(c, [
          [0, b => {
            W.goTo(0.42, 22, inst(b));
            write(b, 8);
            lv('gaTree', 0.7, b);
          }],
          // 时候满足：一点光自天顶降到远山的村庄里
          [1.2, b => {
            addFx(b, { type: 'orb', x0: XB * W.w - W.w * 0.04, y0: -10, x1: XB * W.w, y1: gY(0, XB) - 3, r: 5 * SU(), dur: 4.4 });
            sfx(b, 'angel', { soft: true, x: 0.9 });
          }],
          [5.4, b => {
            lv('gaSent', 1, b); lv('gaStar', 1, b); S.sent = true;
            if (!inst(b)) ringAt(b, XB * W.w, gY(0, XB) - 3, [255, 236, 190], 0.12, 2.4, 1.2);
          }],
          // 儿子的灵自灵所在之处流进每个人心里
          [9.8, b => {
            if (!inst(b) && fx()) {
              for (const id of believersHere()) {
                const B = bodyOf(id); if (!B) continue;
                const tg = []; for (let i = 0; i < 7; i++) tg.push([B.cx + (Math.random() - 0.5) * 4, B.cy + (Math.random() - 0.5) * 4, 1 + Math.random() * 1.2]);
                fx().sow(sx, sy, tg, [255, 238, 200], { pass: 'top', dur: 2.2, stagger: 0.8 });
              }
            }
            sfx(b, 'dove', { soft: true });
          }],
          [11.8, b => {
            lv('gaHearts', 1, b); glowAll(BELIEVERS, 0.42);
            hands('woman', 'father', false);
            sfx(b, 'heart', { soft: true });
          }],
          // 呼叫「阿爸！父！」：柔光自天顶降在众人身上，人人仰起脸来——父是自上而来的光
          [12.3, b => {
            lv('gaAbba', 1, b); S.abba = true;
            for (const id of BELIEVERS) { pose(id, 'gaze'); faceF(id, TREE_F); }
            sfx(b, 'angel', { soft: true, x: 0.75 });
            if (!inst(b)) { const G = treeGeo(); sparkAt(b, G.x, W.h * 0.08, 30, [255, 246, 226], W.w * 0.08); }
          }],
          // 4:7 儿子、后嗣：在那光里，孩童奔向父亲，相拥
          [15.2, b => {
            for (const id of BELIEVERS) if (id !== 'child' && id !== 'father') pose(id, YOKED.indexOf(id) >= 0 && S.yoked.length ? 'bow' : 'stand');
            setV('child', 0.72, inst(b)); setV('father', 0.72, inst(b));
            embrace('child', 'father', { run: true, at: LX(0.59) });
          }],
          [16.8, b => {
            robe('child', HEIR_ROBE); glow('child', 0.55);
            if (!inst(b)) { const B = bodyOf('child'); if (B) sparkAt(b, B.cx, B.cy, 18, [255, 240, 200], 8); }
          }],
          // 4:7 你不是奴仆，乃是儿子了：为奴的那人换上儿子的衣裳
          [18.2, b => {
            hands('slave', 'free', false);
            robe('slave', SON_ROBE, [200, 170, 110]);
            pose('slave', 'raise'); glow('slave', 0.5); S.heir = true;
            if (!inst(b)) { const B = bodyOf('slave'); if (B) { ringAt(b, B.cx, B.cy, [255, 236, 190], 0.18, 2.2, 1.3); sparkAt(b, B.cx, B.cy, 22, [255, 240, 200], 10); } }
            sfx(b, 'harp', { soft: true });
          }],
          [21.5, b => { lv('gaHearts', 0.4, b); lv('gaAbba', 0.3, b); }],
          [23, () => pose('slave', 'stand')],
        ]);
      },
    },

    // ── 5:1–14 轭断了；用爱心互相服事 ──────────────────────────
    {
      kind: 'act', utter: '基督释放了我们，叫我们得以自由', cmd: 'rm -f 奴仆的轭 && chmod +自由 众人', ref: '5:1',
      verse: [
        { text: '基督释放了我们，叫我们得以自由。<br>所以要站立得稳，<br>不要再被奴仆的轭挟制。', ref: '加拉太书 5:1', hold: 7 },
        { text: '弟兄们，你们蒙召是要得自由，……<br>总要用爱心互相服事。<br>因为全律法都包在「爱人如己」<br>这一句话之内了。', ref: '加拉太书 5:13–14', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.46, 20, inst(b));
            write(b, 9);
            lv('gaTree', 0.8, b); lv('gaBlos', 0.35, b); lv('gaAbba', 0, b); lv('gaStar', 0, b);
            if (!inst(b)) for (const id of S.yoked) { const B = bodyOf(id); if (B) motes(B.sx, B.sy, 10, [255, 236, 190], B.h * 0.3, { speed: 10, life: 1.4, size: 1.3 }); }
          }],
          // 轭断了，落在地上
          [1.8, b => {
            const br = [];
            for (const id of S.yoked) { const p = fig(id); if (p) br.push([r3(XLp(p.tx != null ? p.tx : p.nx, port())), r3(p._gaV != null ? p._gaV : p.v || 0)]); }
            S.broken = br; S.yoked = []; S.free = true;
            lv('gaYoke', 0, b); W.set('gaBroke', 1, true);
            for (const id of YOKED) { pose(id, 'stand'); glow(id, 0.4); }
            if (!inst(b)) {
              for (const id of YOKED) { const B = bodyOf(id); if (B) { flash(b, B.sx, B.sy, B.h * 0.8, 0.8, 'pale'); motes(B.sx, B.sy, 16, [255, 236, 190], B.h * 0.3, { speed: 40, life: 1.2, size: 1.2 }); } }
              W.shake = Math.max(W.shake || 0, 0.25);
            }
            sfx(b, 'shatter', { x: 0.65 }); sfx(b, 'chains', { soft: true });
          }],
          [3.2, b => {
            for (const id of YOKED) pose(id, 'raise');
            lv('gaHaze', 0, b);
            W.setPop('bird', 26, treeX(), treeY() - treeH() * 0.6, inst(b));
            sfx(b, 'bird', {}); sfx(b, 'wings', { soft: true });
          }],
          // 搅扰的人走了
          [4.4, () => { go('tr1', XLp(1.08, port()), 0.12, 'stand', { speed: 0.035 }); go('tr2', XLp(1.1, port()), 0.04, 'stand', { speed: 0.035 }); S.trouble = 'gone'; }],
          [8.6, () => { rm('tr1'); rm('tr2'); for (const id of YOKED) pose(id, 'stand'); }],
          // 5:13 总要用爱心互相服事：自主的在为奴的面前跪下服事他
          [9.4, () => { face('free', 'slave'); face('slave', 'free'); pose('free', 'kneel'); }],
          [10.4, b => { S.serve = true; const B = bodyOf('free'); if (B && !inst(b)) sparkAt(b, B.cx, B.cy, 12, [255, 226, 170], 8); sfx(b, 'harp', { soft: true }); }],
          [12.4, () => { face('woman', 'greek'); face('greek', 'woman'); pose('woman', 'bow'); pose('greek', 'bow'); }],
          [15.6, () => { pose('woman', 'stand'); pose('greek', 'stand'); }],
        ]);
      },
    },

    // ── 5:16–23 圣灵所结的果子（本幕的签名之景）───────────────────
    {
      kind: 'act', utter: '圣灵所结的果子，就是仁爱、喜乐、和平', cmd: 'grow 果子 --by 圣灵 --count 9  # 这样的事没有律法禁止', ref: '5:22',
      verse: [
        { text: '我说，你们当顺着圣灵而行，<br>就不放纵肉体的情欲了。', ref: '加拉太书 5:16', hold: 5.5 },
        { text: '圣灵所结的果子，<br>就是仁爱、喜乐、和平、<br>忍耐、恩慈、良善、信实、<br>温柔、节制。这样的事没有律法禁止。', ref: '加拉太书 5:22–23', hold: 11 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.5, 20, inst(b));
            write(b, 10);
            pose('free', 'stand');
            // 树长大、开满了花
            lv('gaTree', 1, b); lv('gaTreeG', 1, b); lv('gaBlos', 1, b);
            lv('gaBroke', 0, b);
            sfx(b, 'wind', { soft: true });
          }],
          [2, () => { for (const id of BELIEVERS) { faceF(id, TREE_F); } }],
          [4.6, () => { for (const id of ['jew', 'greek', 'slave', 'free', 'woman', 'peter', 'tutor']) pose(id, 'gaze'); }],
          // 九样果子一样一样亮起，各有其名
          [6.9, b => {
            lv('gaFruit', 1, b); S.fruits = 9;
            if (!inst(b) && fx()) {
              const G0 = treeGeo(), sz = labelSize();
              // 一样一样亮起、各自聚成其名；先成的名字留着，等九样都齐了，一同驻留三秒再散
              const last = 9 / 9 / 0.085 - 0.4;
              FRUITS.forEach((F, i) => {
                const delay = (i + 1) / 9 / 0.085 - 0.4;
                const L = fruitLabelXY(i, { x: G0.x, y: G0.y, H: G0.H, K: 1, s: G0.H });
                fx().nameStr(F.n, L[0], L[1], sz, mix(F.c, [255, 255, 255], 0.4), () => { const P = fruitXY(i); return [P[0], P[1], F.c]; }, { hold: 3.4 + (last - delay), delay });
              });
            }
            sfx(b, 'harp', {});
          }],
          [8.2, b => sfx(b, 'chime', { soft: true })],
          [12, b => sfx(b, 'chime', { soft: true })],
          [16, b => sfx(b, 'chime', { soft: true })],
          // 遍地开花
          [17.2, b => {
            lv('gaFlow', 1, b); W.set('bloom', 1, inst(b)); W.set('bare', 0, inst(b)); W.set('herbs', 0.85, inst(b)); W.set('grass', 1, inst(b));
            if (!inst(b)) { const G = treeGeo(); ringAt(b, G.x, G.y - G.s * 0.7, [255, 240, 200], 0.5, 3.4, 1.4); }
            sfx(b, 'bird', {});
          }],
          [20, () => { for (const id of BELIEVERS) pose(id, 'stand'); }],
        ]);
      },
    },

    // ── 5:25–6:2 靠圣灵行事；重担要互相担当 ─────────────────────
    {
      kind: 'call', utter: '我们若是靠圣灵得生，就当靠圣灵行事', cmd: 'walk --by 圣灵 && share 重担 --each', ref: '5:25',
      verse: [
        { text: '我们若是靠圣灵得生，<br>就当靠圣灵行事。', ref: '加拉太书 5:25', hold: 5 },
        { text: '弟兄们，若有人偶然被过犯所胜，<br>你们属灵的人就当用温柔的心<br>把他挽回过来；……', ref: '加拉太书 6:1', hold: 7 },
        { text: '你们各人的重担要互相担当，<br>如此，就完全了基督的律法。', ref: '加拉太书 6:2', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.58, 22, inst(b));
            write(b, 11);
            // 一条淡青的光路自树下伸向园子西头
            lv('gaPath', 1, b); lv('gaPathA', 1, b); S.walk = true;
            hands('jew', 'greek', false);
            // 自主的背起一个大口袋（场景画的重担，比寻常的包袱大得多）
            S.sack = 'one'; lv('gaSack', 1, b);
            sfx(b, 'wind', { soft: true });
          }],
          [1.4, () => { hands('slave', 'free', false); hands('woman', 'father', false); for (const id in WALK) goIn(id, WALK[id][0], WALK[id][1], 'stand', 4); }],
          // 6:1 背着重担的人跌倒了：担子落在地上
          [7.2, b => {
            pose('free', 'fall', { stop: true }); S.fell = true; S.sack = 'down';
            if (!inst(b)) { const B = bodyOf('free'); if (B) motes(B.x - B.fd * B.h * 0.3, B.y - 3, 10, [150, 140, 128], B.h * 0.3, { speed: 14, vy: -8, life: 1.2, alpha: 0.5 }); }
            sfx(b, 'build', { soft: true, x: 0.6 });
          }],
          [8.4, () => { go('greek', WALK.free[0] - 0.06, 0.86, 'kneel', { speed: 0.03 }); go('slave', WALK.free[0] + 0.065, 0.84, 'kneel', { speed: 0.035 }); }],
          [10.8, () => { face('greek', 1); face('slave', -1); }],
          [11.4, b => {
            pose('free', 'kneel');
            if (!inst(b)) { const B = bodyOf('free'); if (B) sparkAt(b, B.cx, B.cy, 12, [206, 236, 255], 8); }
          }],
          [12.8, () => { pose('free', 'stand'); pose('greek', 'stand'); pose('slave', 'stand'); face('free', 1); }],
          // 6:2 把担子分过来一同担当：一个大的分成两个小的，暖光落在两人的肩上
          [14.8, b => {
            S.shared = true; S.sack = 'two';
            if (!inst(b)) for (const id of ['free', 'slave']) {
              const B = bodyOf(id); if (!B) continue;
              flash(b, B.sx - B.fd * B.h * 0.1, B.sy, B.h * 0.9, 0.85, 'warm');
              sparkAt(b, B.sx, B.sy, 16, [255, 232, 180], 8);
            }
            sfx(b, 'harp', { soft: true });
          }],
          [16.2, () => {
            go('free', 0.29, 0.86, 'stand', { speed: 0.016 }); go('slave', 0.345, 0.85, 'stand', { speed: 0.016 }); go('greek', 0.4, 0.84, 'stand', { speed: 0.016 });
          }],
          [20, () => { for (const id of ['tutor', 'peter', 'jew', 'free', 'greek', 'slave']) faceF(id, TREE_F); }],
        ]);
      },
    },

    // ── 6:7–10 种的是什么，收的也是什么 ─────────────────────────
    {
      kind: 'judge', utter: '神是轻慢不得的。人种的是什么，收的也是什么', cmd: 'sow --by 圣灵 && sleep 时候 && reap 永生', ref: '6:7',
      verse: [
        { text: '不要自欺，神是轻慢不得的。<br>人种的是什么，收的也是什么。<br>顺着情欲撒种的，必从情欲收败坏；<br>顺着圣灵撒种的，必从圣灵收永生。', ref: '加拉太书 6:7–8', hold: 9 },
        { text: '我们行善，不可丧志；<br>若不灰心，到了时候就要收成。', ref: '加拉太书 6:9', hold: 6 },
        { text: '所以，有了机会就当向众人行善，<br>向信徒一家的人更当这样。', ref: '加拉太书 6:10', hold: 6 },
      ],
      apply(c) {
        const f0 = FIELD[0] + 0.02, f1 = 0.84;
        T(c, [
          [0, b => {
            W.goTo(0.69, 24, inst(b));
            write(b, 12);
            lv('gaField', 1, b); lv('gaPathA', 0.35, b); lv('gaSack', 0, b);
            go('father', f0, 0.74, 'stand', { speed: 0.045 });
            go('free', 0.62, 0.44); go('greek', 0.5, 0.5); go('slave', 0.68, 0.34); go('jew', 0.38, 0.52); go('peter', 0.3, 0.46); go('tutor', 0.22, 0.42);
            go('child', 0.46, 0.56); go('woman', 0.44, 0.36);
          }],
          // 父亲在田里撒种
          [2.8, b => { go('father', f1, 0.74, 'stand', { speed: 0.017 }); S.sown = true; sfx(b, 'wind', { soft: true }); }],
          ...[3.6, 4.6, 5.6, 6.6, 7.6, 8.6, 9.6].map(t => [t, b => {
            if (inst(b) || !fx()) return;
            const B = bodyOf('father'); if (!B) return;
            const tg = [];
            for (let i = 0; i < 9; i++) { const xf = clamp(B.x / W.w + (0.01 + Math.random() * 0.05) * (B.fd || 1), 0, 1); tg.push([xf * W.w, baseY(2, xf, FIELD_V[0] + Math.random() * (FIELD_V[1] - FIELD_V[0])), 1.1]); }
            fx().sow(B.sx, B.sy, tg, [236, 206, 140], { pass: 'near', dur: 1.2, stagger: 0.3 });
          }]),
          // 到了时候就要收成：出苗、抽穗、黄熟
          [10.4, b => { lv('gaSprout', 1, b); sfx(b, 'chime', { soft: true }); }],
          [13.6, b => { lv('gaGold', 1, b); }],
          [16.4, b => { if (!inst(b)) ringAt(b, LX(0.73) * W.w, baseY(2, LX(0.73), 0.76), [255, 222, 150], 0.3, 3, 1.2); sfx(b, 'harp', { soft: true }); }],
          // 6:10 众人收割：禾捆立在田里
          [17.8, () => {
            go('greek', 0.66, 0.72, 'bow', { speed: 0.03 }); go('slave', 0.76, 0.78, 'bow', { speed: 0.03 });
            face('father', -1); pose('father', 'bow');
          }],
          [20.4, b => { lv('gaSheaf', 1, b); S.reaped = true; sfx(b, 'sing', { soft: true }); }],
          [23, () => { for (const id of ['greek', 'slave', 'father']) pose(id, 'stand'); }],
        ]);
      },
    },

    // ── 6:11–18 亲手写的大字；十字架；新造的人；恩 ─────────────────
    {
      kind: 'act', utter: '要紧的就是作新造的人', cmd: 'sign --hand 保罗 --large && renew 园子 --as 新造的人', ref: '6:15',
      verse: [
        { text: '请看我亲手写给你们的字是何等的大呢！', ref: '加拉太书 6:11', hold: 5.5 },
        { text: '但我断不以别的夸口，<br>只夸我们主耶稣基督的十字架；……<br>受割礼不受割礼都无关紧要，<br>要紧的就是作新造的人。', ref: '加拉太书 6:14–15', hold: 9 },
        { text: '弟兄们，<br>愿我主耶稣基督的恩常在你们心里。<br>阿们！', ref: '加拉太书 6:18', hold: 7 },
      ],
      apply(c) {
        const FIN = {
          tutor: [0.2, 0.3], jew: [0.3, 0.44], greek: [0.38, 0.58], slave: [0.47, 0.46], peter: [0.47, 0.22],
          woman: [0.64, 0.3], free: [0.68, 0.52], father: [0.75, 0.4], child: [0.75, 0.4],
        };
        T(c, [
          [0, b => {
            W.goTo(0.748, 22, inst(b));
            write(b, 13);
            lv('gaLamp', 1, b);
            // 保罗亲手写大字：一个大大的「恩」字自书信升起
            S.big = true;
            if (!inst(b) && fx()) {
              const D = deskGeo(), sz = Math.max(56, 0.14 * M());
              const x = port() ? W.w * 0.6 : W.w * 0.7, y = port() ? W.h * 0.42 : W.h * 0.28;
              fx().name('恩', x, y, sz, [255, 226, 160], () => [D.scX + (Math.random() - 0.5) * 8, D.scY - 3], { hold: 16.4 });
            }
            sfx(b, 'write', {});
          }],
          [1.4, () => {
            for (const id in FIN) go(id, FIN[id][0], FIN[id][1], 'stand', { speed: 0.03, dx: id === 'child' ? PAIR() * 2 : 0 });
          }],
          // 6:14 十字架又亮起来
          [7, b => { lv('gaCrossB', 1, b); faceAll(BELIEVERS, XLp(XC, port())); sfx(b, 'chime', { soft: true, x: 0.6 }); }],
          // 6:15 新造的人：园子全然更新
          [12, b => {
            lv('gaNew', 1, b); S.renewed = true;
            if (!inst(b)) { const G = treeGeo(); ringAt(b, G.x, G.y - G.s * 0.5, [255, 244, 214], 0.6, 3.6, 1.4); sparkAt(b, G.x, G.y - G.s * 0.7, 40, [255, 240, 200], G.s * 0.4); }
            sfx(b, 'harp', {});
          }],
          [13.4, () => { faceAll(BELIEVERS, PAUL_F); }],
          // 6:18 书信卷起；他站起来举手；恩光落在每个人心里
          [16.6, b => { lv('gaSeal', 1, b); S.sealed = true; sfx(b, 'scroll', { soft: true }); }],
          [17.6, b => {
            pose('paul', 'raise'); face('paul', 1);
            lv('gaGrace', 1, b); lv('gaHearts', 0.8, b); S.grace = true;
            glowAll(BELIEVERS, 0.45);
            sfx(b, 'angel', { soft: true });
          }],
          [19.4, () => { for (const id of BELIEVERS) pose(id, 'raise'); }],
          [23.6, b => {
            for (const id of BELIEVERS) pose(id, 'stand');
            pose('paul', 'stand');
            W.goTo(0.8, 30, inst(b));
            lv('gaCrossB', 0.6, b);
          }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '加拉太书', books: [48], title: '圣灵的果子', sub: '加拉太书 1 — 6', tint: [214, 240, 200], music: 'eden',
    outro: 24,
    intro: [
      { text: '作使徒的保罗……<br>和一切与我同在的众弟兄，<br>写信给加拉太的各教会。', ref: '加拉太书 1:1–2', hold: 6 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '保罗': { text: '从今以后，人都不要搅扰我，<br>因为我身上带着耶稣的印记。', ref: '加拉太书 6:17' },
      '书信': { text: '请看我亲手写给你们的字是何等的大呢！', ref: '加拉太书 6:11' },
      '圣灵的果子': { text: '圣灵所结的果子，就是仁爱、喜乐、和平、忍耐、恩慈、良善、信实、<br>温柔、节制。这样的事没有律法禁止。', ref: '加拉太书 5:22–23' },
      '树': { text: '我们若是靠圣灵得生，就当靠圣灵行事。', ref: '加拉太书 5:25' },
      '十字架': { text: '但我断不以别的夸口，只夸我们主耶稣基督的十字架；<br>因这十字架，就我而论，世界已经钉在十字架上；就世界而论，我已经钉在十字架上。', ref: '加拉太书 6:14' },
      '轭': { text: '基督释放了我们，叫我们得以自由。所以要站立得稳，<br>不要再被奴仆的轭挟制。', ref: '加拉太书 5:1' },
      '矶法': { text: '又知道所赐给我的恩典，那称为教会柱石的雅各、矶法、约翰，<br>就向我和巴拿巴用右手行相交之礼……', ref: '加拉太书 2:9' },
      '犹太人': { text: '并不分犹太人、希腊人，自主的、为奴的，或男或女，<br>因为你们在基督耶稣里都成为一了。', ref: '加拉太书 3:28' },
      '希腊人': { text: '并不分犹太人、希腊人，自主的、为奴的，或男或女，<br>因为你们在基督耶稣里都成为一了。', ref: '加拉太书 3:28' },
      '为奴的': { text: '可见，从此以后，你不是奴仆，乃是儿子了；<br>既是儿子，就靠着神为后嗣。', ref: '加拉太书 4:7' },
      '自主的': { text: '弟兄们，你们蒙召是要得自由，只是不可将你们的自由当作放纵情欲的机会，<br>总要用爱心互相服事。', ref: '加拉太书 5:13' },
      '妇人': { text: '你们受洗归入基督的都是披戴基督了。', ref: '加拉太书 3:27' },
      '父亲': { text: '你们既为儿子，神就差他儿子的灵进入你们的心，呼叫：「阿爸！父！」', ref: '加拉太书 4:6' },
      '孩童': { text: '我说那承受产业的，虽然是全业的主人，<br>但为孩童的时候却与奴仆毫无分别，乃在师傅和管家的手下，直等他父亲预定的时候来到。', ref: '加拉太书 4:1–2' },
      '师傅': { text: '这样，律法是我们训蒙的师傅，引我们到基督那里，使我们因信称义。', ref: '加拉太书 3:24' },
      '搅扰的人': { text: '……但搅扰你们的，无论是谁，必担当他的罪名。', ref: '加拉太书 5:10' },
      '田': { text: '顺着情欲撒种的，必从情欲收败坏；<br>顺着圣灵撒种的，必从圣灵收永生。', ref: '加拉太书 6:8' },
      '禾捆': { text: '我们行善，不可丧志；若不灰心，到了时候就要收成。', ref: '加拉太书 6:9' },
      '万国的灯': { text: '并且圣经既然预先看明，神要叫外邦人因信称义，<br>就早已传福音给亚伯拉罕，说：「万国都必因你得福。」', ref: '加拉太书 3:8' },
    },
  });
})(window.GS);
