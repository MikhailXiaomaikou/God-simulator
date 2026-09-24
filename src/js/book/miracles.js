/* ─────────────────────────────────────────────────────────────
 * book/miracles.js —— 四福音 · 神迹（马可福音 1 — 8 · 约翰福音 6；海面上行走取自马太福音 14）
 *
 * 同一片地：左边是加利利海；近地是加利利的岸——迦百农的几间玄武岩平顶房（西门的家、睚鲁的家），
 * 中丘上一座白石的会堂；近地与中丘之间一道海湾，船停在那里、也在那里遇见风浪。
 *
 * 十三句话（主的话语；都在各自的经文里被说出、被看见）：
 *   1 我肯，你洁净了吧！（可 1:41）—— 早晨，长大麻风的人跪下；主伸手一摸，灰色的衣变作洁白。
 *   2 起来！拿你的褥子回家去吧（可 2:11）—— 西门的家挤满了人；四个人抬着瘫子上房，拆通房顶，把褥子缒下来；他起来，扛着褥子出去。
 *   3 我们渡到那边去吧（可 4:35）—— 黄昏，主在船上；开船，别的船同行；他在船尾枕着枕头睡了；忽然起了暴风。
 *   4 ★ 住了吧！静了吧！（可 4:39）—— 他醒了，斥责风：一圈平静自船向全海铺开，浪平了，云散了，星与月出来。
 *   5 污鬼啊，从这人身上出来吧！（可 5:8）—— 黎明，海那边的坟茔；那人身上的黑影升起，飘下山崖，没入海中；他坐着，穿上衣服，心里明白过来。
 *   6 女儿，你的信救了你，平平安安地回去吧！（可 5:34）—— 回到迦百农，睚鲁俯伏；人拥挤他，一个女人从后头摸他的衣裳：一线光自衣裳䍁子流到她身上。
 *   7 闺女，我吩咐你起来！（可 5:41）—— 睚鲁的家，哭泣的人；他拉着孩子的手，她起来走，投入母亲的怀里。
 *   8 你们给他们吃吧（可 6:37）—— 坐船往旷野去；众人沿岸跑来先到；青草地；一个孩童带着五个饼、两条鱼。
 *   9 你们叫众人坐下（约 6:10）—— 一排一排坐在草上；他望天祝谢，擘开饼，光一路传到每一排；十二个篮子装满了零碎。
 *  10 你们放心，是我，不要怕！（太 14:27）—— 夜里，他独自在山上祷告；船在海中逆风；四更天，他在海面上走来。
 *  11 你来吧（太 14:29）—— 彼得下船在水面上走，见风甚大，将要沉下去；主伸手拉住他；上了船，风就住了，黎明，众人拜他。
 *  12 以法大！（可 7:34）—— 低加坡里；耳聋舌结的人身边一团闷静，主望天叹息：一圈圈声音的光散开，鸟都飞起来歌唱。
 *  13 你看见什么了？（可 8:23）—— 伯赛大：世界失了颜色；第一次按手，模糊的光（人好像树木在行走）；再按手，颜色自灵所在之处绽放，样样都看得清楚了。
 *
 * 神迹只画复原，不画病痛；鬼只是一团冷的暗影，离开时像烟散去；主与门徒都用 GS.cast.LOOK 的样子（无面目）。
 * 规矩：一切状态只在 setup / apply / 情节（beats）里设定，瞬间重演时得到同样的世界；装饰（粒子、光环）只在非瞬间时出现。
 * 位置都以画面的比例记下；竖屏另一套布局。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'miracles';
  const safe = U.safe;
  const cur = () => GS.book.current(ACT);

  // ── 本幕的程度 ──────────────────────────────────────────────
  const LV = {
    mcTown: ['exp', 0.55],     // 迦百农 / 伯赛大：房屋与会堂
    mcLamp: ['exp', 0.5],      // 房里的灯
    mcRoof: ['lin', 0.7],      // 西门家的房顶拆通
    mcMat: ['lin', 0.3],       // 褥子缒下（0 在房顶 → 1 在地上）
    mcMatA: ['exp', 1.2],      // 缒下来的褥子（瘫子起来拿走之后隐去）
    mcBed: ['exp', 0.8],       // 睚鲁家门前闺女躺卧的褥子
    mcBoatA: ['exp', 0.8],     // 船
    mcBoat: ['lin', 0.2],      // 船自一处驶向另一处（0 → 1）
    mcSail: ['exp', 0.6],      // 帆张开
    mcRow: ['exp', 1],         // 摇橹
    mcFleet: ['exp', 0.5],     // 别的船和他同行
    mcStorm: ['exp', 0.9],     // 海上的风浪（本幕自己的浪、雨、船的颠簸；比天上的云散得快）
    mcCalm: ['lin', 0.42],     // 平静自船向全海铺开
    mcGerasa: ['exp', 0.5],    // 格拉森人的地方：坟茔与山崖
    mcShadow: ['exp', 0.6],    // 那人身上的黑影
    mcSmoke: ['lin', 0.2],     // 黑影离开：飘下山崖、没入海中（0 → 1）
    mcMany: ['exp', 0.45],     // 山坡上的许多人（五千）
    mcBasket: ['exp', 1],      // 孩童的篮子：五个饼、两条鱼
    mcBasketG: ['exp', 2],     // 篮子放在主的面前（0 在孩童手里 → 1 在地上）
    mcBread: ['lin', 0.14],    // 饼的光一路传到众人
    mcBaskets: ['lin', 0.3],   // 十二个篮子
    mcPray: ['exp', 0.6],      // 山上祷告的光
    mcWalk: ['lin', 0.085],    // 他在海面上走来（0 → 1）
    mcReach: ['lin', 0.7],     // 他走向将要沉下的彼得
    mcPeter: ['lin', 0.22],    // 彼得在水面上走（0 → 1；约四秒半）
    mcBack: ['lin', 0.42],     // 二人一同走回船上（0 → 1）
    mcSink: ['lin', 0.8],      // 彼得将要沉下去（被拉住时随即浮起）
    mcDeca: ['exp', 0.5],      // 低加坡里：中丘上白石的城
    mcHush: ['exp', 0.9],      // 聋子身边的闷静
    mcMute: ['exp', 0.5],      // 伯赛大：世界失了颜色
    mcSight: ['lin', 0.32],    // 颜色自一点绽放（0 → 1 满目）
    mcHaze: ['exp', 0.7],      // 第一次按手：模糊的光
    mcLeper: ['exp', 1.2],     // 大麻风的灰影
    mcMirror: ['exp', 0.35],   // 大大地平静了：海面如镜，映着星
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const MY = Object.keys(LV);
  const L = k => W.lv[k] || 0;

  // ── 布局（画面宽的比例；竖屏另一套）─────────────────────────
  // 船位：[x, 水线 y]；船头朝左。人位：x（近地）。
  const LAYL = {
    houseA: 0.52, houseB: 0.605, houseC: 0.705, syn: 0.655,
    moor: [0.835, 0.827], sea: [0.62, 0.827], sea2: [0.56, 0.8], feed: [0.56, 0.83], land: [0.645, 0.827], boatK: 1,
    fleet: [[0.66, 0.646, 0.34], [0.77, 0.654, 0.4], [0.9, 0.65, 0.3]],
    // 一
    jesus0: 0.615, peter0: 0.585, john0: 0.565, andrew0: 0.548, james0: 0.532, leperFrom: 1.03, leperAt: 0.652, touch: 0.634,
    vil: [0.455, 0.505], capIn: [0.7, 0.93],
    // 二
    jesusIn: 0.617, bearAt: 0.76, paraAt: 0.598, crowdL: [0.5, 0.56], crowdR: [0.655, 0.73], ajAt: [0.66, 0.675],
    // 三
    shore: [0.53, 0.71], boardAt: 0.775, waitAt: 0.724, waitDir: -1,
    // 五
    tomb0: 0.8, demonFrom: 0.905, demonAt: 0.685, geraFolk: [0.8, 0.93],
    // 六
    landAt: 0.795, walkTo: 0.64, womanFrom: 0.9, many: [0.6, 0.78],
    // 七
    bed: 0.532, bedV: 0.16, mourn: [[0.455, 0.505], [0.565, 0.6]], mournOut: [0.44, 0.47],
    // 八、九
    feedJ: 0.61, rows: [[0.66, 0.95, 0], [0.62, 0.93, 0.3], [0.64, 0.96, 0.58], [0.6, 0.9, 0.85]], basketX: 0.628, baskets: [0.555, 0.705],
    // 十、十一
    mount: 0.915, walk0: [0.86, 0.815], walk1: [0.76, 0.8], coast: null,
    // 十二
    decaFolk: [0.78, 0.95], deafAt: 0.7, aside: 0.585,
    // 十三
    blindFrom: 0.5, blindAt: 0.64, out: 0.8,
  };
  const LAYP = Object.assign({}, LAYL, {
    houseA: 0.52, houseB: 0.72, houseC: null, syn: 0.8,
    moor: [0.24, 0.9], sea: [0.3, 0.8], sea2: [0.27, 0.8], feed: [0.24, 0.905], land: [0.26, 0.9], boatK: 0.86,
    fleet: [[0.12, 0.66, 0.5], [0.4, 0.67, 0.55]],
    jesus0: 0.64, peter0: 0.585, john0: 0.555, andrew0: 0.53, james0: 0.505, leperFrom: 1.05, leperAt: 0.74, touch: 0.7,
    vil: [0.44, 0.5], capIn: [0.78, 0.97],
    jesusIn: 0.745, bearAt: 0.9, paraAt: 0.705, crowdL: [0.5, 0.6], crowdR: [0.84, 0.95], ajAt: [0.578, 0.594],
    shore: [0.45, 0.62], boardAt: 0.43, waitAt: 0.448, waitDir: 1,
    tomb0: 0.72, demonFrom: 0.9, demonAt: 0.66, geraFolk: [0.82, 0.97],
    landAt: 0.5, walkTo: 0.66, womanFrom: 0.95, many: [0.62, 0.85],
    bed: 0.545, bedV: 0.35, mourn: [[0.44, 0.49], [0.63, 0.68]], mournOut: [0.43, 0.46],
    feedJ: 0.52, rows: [[0.62, 0.97, 0], [0.56, 0.95, 0.3], [0.58, 0.97, 0.58], [0.55, 0.93, 0.85]], basketX: 0.55, baskets: [0.47, 0.64],
    mount: 0.9, walk0: [0.9, 0.806], walk1: [0.72, 0.8], coast: 0.46,
    decaFolk: [0.8, 0.97], deafAt: 0.72, aside: 0.56,
    blindFrom: 0.46, blindAt: 0.64, out: 0.8,
  });
  // 竖屏的伯赛大：不再是西门那间敞开的大屋（它会占去半个画面、外梯正在「村外」）；一间小屋挨着睚鲁家那样的屋，村外是空的坡地
  const BETHP = { houseB: null, houseC: 0.665 };
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => {
    if (tall()) return S.town === 'beth' && k in BETHP ? BETHP[k] : LAYP[k];
    return LAYL[k];
  };

  // ── 颜色 ────────────────────────────────────────────────────
  const TINT = [200, 226, 255];
  const BASALT = [128, 118, 106], BASALT_D = [96, 88, 80], ROOF = [146, 124, 94], MUD = [168, 146, 112], DOOR = [38, 30, 24];
  const LIME = [226, 218, 198], LIME_D = [188, 178, 158];
  const WOOD = [98, 72, 50], WOOD_D = [74, 54, 38], WOOD_L = [150, 116, 80], SAIL = [226, 214, 188];
  const ROCK = [150, 134, 118], ROCK_D = [104, 92, 82], TOMB = [26, 22, 20];
  const MAT = [196, 176, 138], MAT_D = [150, 128, 96];
  const GOLD = [255, 214, 140], WARM = [255, 226, 170], LOAF = [214, 160, 88], FISHC = [196, 204, 212], WICKER = [150, 110, 64];
  const ROBE = {
    leper: [150, 148, 140], clean: [232, 238, 246], para: [128, 110, 92], jairus: [72, 86, 128], mother: [146, 104, 98],
    girl: [230, 216, 198], woman: [128, 98, 110], demon: [62, 56, 54], clothed: [198, 186, 160], boy: [166, 138, 96],
    deaf: [110, 118, 132], blind: [130, 114, 98], friend: [120, 104, 86],
  };
  const TINT_1 = [236, 240, 255], TINT_SEA = [190, 222, 255], TINT_W = [255, 226, 196], TINT_B = [255, 230, 170];

  // ── 小工具 ──────────────────────────────────────────────────
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const c01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ss = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const ease = t => { t = c01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const H2 = () => 34 * W.layerScale(2) * 1.3 * boost();     // 近地的人高
  const H1 = () => 34 * W.layerScale(1) * 1.2 * boost();     // 中丘的人高
  const M = () => Math.min(W.w, W.h);
  const sh = (rgb, depth, a, ex) => W.shadeCSS(rgb, depth || 0, a == null ? 1 : a, ex || 0);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  function gY(px, layer) {
    const l = layer == null ? 2 : layer;
    const x = clamp(px, 0, W.w);
    let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  }
  const gYb = (px, layer) => W.ridgeBaseY(layer == null ? 2 : layer, clamp(px, 0, W.w));
  // 近地纵深：v 越大越靠前（画面更低）——与 cast 同一算法
  const fieldY = (xf, v) => { const g = gY(xf * W.w); return g + (v || 0) * Math.max(0, W.h - g) * 0.8; };
  function lv(k, v, b) { W.set(k, v, inst(b)); }
  function sfx(b, name, o) {
    if (inst(b)) return;
    const a = au();
    if (a && a.sfx) safe('miracles.sfx', () => a.sfx(name, o || {}));
  }
  function time(tod, dur, b) { W.goTo(tod, dur, inst(b)); }
  function avoid(r) { W.beastAvoid = r || []; }
  const C = () => cast();
  const LOOK = () => (C() && C().LOOK) || {};
  function add(id, o) { const c = C(); if (c) c.add(id, Object.assign({ layer: 2, from: 'fade', glow: 0.2 }, o)); }
  // 新约里反复出场的人：用共同的样子
  function addLook(id, look, o) { const c = C(); if (!c) return; const base = LOOK()[look] || {}; c.add(id, Object.assign({ layer: 2, from: 'fade' }, base, o)); }
  function walk(id, x, o) { const c = C(); if (c && c.get(id)) c.walk(id, x, o || {}); }
  function run(id, x, o) { walk(id, x, Object.assign({ run: true }, o || {})); }
  function pose(id, p, o) { const c = C(); if (c && c.get(id)) c.pose(id, p, o); }
  function face(id, d) { const c = C(); if (c && c.get(id)) c.face(id, d); }
  function glowP(id, v) { const c = C(); if (c) c.glow(id, v); }
  function rm(id, fade) { const c = C(); if (c) c.remove(id, { fade: fade !== false }); }
  function person(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function has(id) { const c = C(); return !!(c && c.has && c.has(id)); }
  function crowdOf(gid) { const c = C(); return c && c.crowds ? c.crowds.get(gid) : null; }
  function crowdGlow(gid, v) { const g = crowdOf(gid); if (g) g.members.forEach(m => { m.glow = v; }); }
  function crowdFace(gid, d) { const g = crowdOf(gid); if (g) g.members.forEach(m => { if (m.tx == null) { m.facing = d < 0 ? -1 : 1; if (W.replaying) m.fd = m.facing; } }); }
  function crowdFaceX(gid, xf) { const g = crowdOf(gid); if (g) g.members.forEach(m => { if (m.tx == null) { m.facing = xf >= m.nx ? 1 : -1; if (W.replaying) m.fd = m.facing; } }); }
  function crowdPose(gid, p) { const c = C(); if (c && crowdOf(gid)) c.crowdPose(gid, p); }
  function crowdWalk(gid, x0, x1, o) { const c = C(); if (c && crowdOf(gid)) c.crowdWalk(gid, x0, x1, o || {}); }
  function crowdRm(gid, fade) { const c = C(); if (c) c.removeCrowd(gid, { fade: fade !== false }); }
  // 竖屏的地窄：人群少一些
  function crowd(gid, o) {
    const c = C(); if (!c) return;
    const n = Math.max(2, Math.round((o.n || 8) * (tall() ? 0.6 : 1)));
    c.crowd(gid, Object.assign({ layer: 2, from: 'fade' }, o, { n }));
  }
  // 竖屏：右边的地往上坡，站在那里的人看上去像站在西门家的外梯与房顶上——让这群人站到前面的草地上（v 大些）
  function forward(gid, v0, dv) {
    if (!tall()) return;
    const g = crowdOf(gid); if (!g) return;
    g.members.forEach((m, i) => { m.v = v0 + dv * hsh(i * 7 + gid.length); });
  }
  // 人此刻在画面上的位置（脚下）与身高
  function fpos(id) {
    const p = person(id);
    if (!p) return null;
    if (p._vis && isFinite(p._x) && isFinite(p._y)) return { x: p._x, y: p._y, h: p._h, p };
    const x = p.nx * W.w;
    const y = p.ny != null ? p.ny * W.h : fieldY(p.nx, p.v || 0);
    return { x, y, h: H2() * (p.age === 'child' ? 0.62 : 1), p };
  }
  const pxOf = id => { const f = fpos(id); return f ? f.x : null; };

  // ── 局部状态 ────────────────────────────────────────────────
  // 情节的状态（船从哪里驶向哪里、谁在船上）只在 setup 与情节里改动，所以瞬间重演也一样；其余只是装饰
  function fresh() {
    return { clock: 0, boatA: 'moor', boatB: 'moor', aboard: {}, calmX: 0.6, calmY: 0.82, sprayAcc: 0, rippleAcc: 0, breadAcc: 0,
      birdAcc: 0, bloomX: 0.6, bloomY: 0.6, lastBolt: 0, town: 'cap' };
  }
  let S = fresh();
  const FXL = [];
  function addFX(b, o) { if (inst(b)) return; FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  贴图
  // ════════════════════════════════════════════════════════════
  const SP = {};
  function glowSprite(key, rgb) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, rgba(rgb, 1)); gr.addColorStop(0.22, rgba(rgb, 0.55)); gr.addColorStop(0.55, rgba(rgb, 0.14)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      SP[key] = c;
    } catch (e) { SP[key] = null; }
  }
  function softSprite(key, rgb) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, rgba(rgb, 0.9)); gr.addColorStop(0.5, rgba(rgb, 0.45)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      SP[key] = c;
    } catch (e) { SP[key] = null; }
  }
  function beamSprite() {
    try {
      const w = 32, h = 128, c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
      for (let y = 0; y < h; y++) {
        const v = y / (h - 1), vy = Math.min(1, v / 0.3) * Math.min(1, (1 - v) / 0.1);
        for (let x = 0; x < w; x++) {
          const hx = ((x + 0.5) / w) * 2 - 1, a = vy * (Math.exp(-hx * hx * 5) * 0.75 + Math.exp(-hx * hx * 40) * 0.25);
          const i = (y * w + x) * 4;
          d[i] = 255; d[i + 1] = 246; d[i + 2] = 224; d[i + 3] = Math.round(255 * clamp(a, 0, 1));
        }
      }
      g.putImageData(img, 0, 0);
      SP.beam = c;
    } catch (e) { SP.beam = null; }
  }
  function sprites() {
    if (SP.w) return;
    glowSprite('w', [255, 248, 232]); glowSprite('g', [255, 214, 140]); glowSprite('b', [190, 214, 255]);
    glowSprite('f', [255, 150, 70]); glowSprite('r', [255, 236, 200]);
    softSprite('k', [14, 12, 20]); softSprite('s', [120, 126, 140]); softSprite('m', [236, 236, 240]); softSprite('d', [40, 52, 72]);
    beamSprite();
  }
  function glow(ctx, key, x, y, r, a, ry) {
    const s = SP[key];
    if (!s || !(a > 0.004) || !(r > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    const rr = ry || r;
    ctx.drawImage(s, x - r, y - rr, 2 * r, 2 * rr);
  }
  function beam(ctx, x, y0, y1, w, a) {
    if (!SP.beam || !(a > 0.004) || y1 <= y0) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.beam, x - w / 2, y0, w, y1 - y0);
  }

  // ════════════════════════════════════════════════════════════
  //  船
  // ════════════════════════════════════════════════════════════
  // 船长约五个人高；u = 一个人高（近地）× 船的比例
  const boatU = () => H2() * X('boatK');
  function spot(name) { const s = X(name); return s && s.length ? s : X('moor'); }
  function boatPos() {
    const A = spot(S.boatA), B = spot(S.boatB), e = ease(L('mcBoat'));
    return { x: lerp(A[0], B[0], e) * W.w, y: lerp(A[1], B[1], e) * W.h };
  }
  // 风浪里的起伏（只作用在高低上，人随船的 x 不变——看完与重演一致）
  function stormK() { return L('mcStorm') * (1 - calmAt(boatPos().x, boatPos().y)); }
  function boatRoll() {
    const g = stormK(), c = S.clock;
    return {
      roll: Math.sin(c * 1.2) * 0.012 + g * (Math.sin(c * 2.2) * 0.1 + Math.sin(c * 3.6) * 0.035),
      bob: Math.sin(c * 1.6) * 0.012 + g * Math.sin(c * 2.8) * 0.09,
    };
  }
  // 船上的位子：自船中量起（以 u 计），dy 为甲板离水线的高（负 = 向上）
  const SLOTS = { stern: [1.72, -0.36], 0: [0.98, -0.06], 1: [0.36, -0.06], 2: [-0.3, -0.06], 3: [-0.98, -0.06], 4: [-1.6, -0.06] };
  function deckPt(slot) {
    const P = boatPos(), u = boatU(), R = boatRoll(), s = SLOTS[slot] || SLOTS[1];
    const x = P.x + s[0] * u;
    const y = P.y + R.bob * u + s[1] * u + Math.sin(R.roll) * s[0] * u;
    return [x, y];
  }
  const deckFn = slot => () => deckPt(slot);
  // 附着到一条路径上（海面上行走）：先停下正在走的路，位置即由路径给出
  function attachTo(id, fn) {
    const c = C(); if (!c || !c.get(id)) return;
    const p = c.get(id);
    c.attach(id, fn);
    p.tx = null; p.fly = null;
    const q = fn && fn(); if (q && isFinite(q[0])) p.nx = q[0] / W.w;
  }
  function board(id, slot) {
    const c = C(); if (!c || !c.get(id)) return;
    S.aboard[id] = String(slot);
    c.attach(id, deckFn(slot));
    const p = c.get(id);
    p.nx = deckPt(slot)[0] / W.w; p.tx = null; p.fly = null; p.ny = null;
  }
  function unboard(id, x, b) {
    const c = C(); if (!c || !c.get(id)) return;
    delete S.aboard[id];
    c.attach(id, null);
    c.place(id, x);
    if (!inst(b)) { const p = c.get(id); if (p) { p.emerge = 1; } }
  }
  const anyAboard = () => { for (const k in S.aboard) if (has(k)) return true; return false; };
  function boatTo(name, b, rate) {
    // 从此刻所在之处（上一程的终点）驶向 name
    S.boatA = S.boatB; S.boatB = name;
    W.set('mcBoat', 0, true);
    lv('mcBoat', 1, b);
  }
  function boatAt(name) { S.boatA = S.boatB = name; W.set('mcBoat', 1, true); }

  function hullPath(ctx, u) {
    ctx.beginPath();
    ctx.moveTo(-2.62 * u, -0.5 * u);                                  // 船头
    ctx.quadraticCurveTo(-2.45 * u, -0.08 * u, -2.05 * u, 0.06 * u);
    ctx.lineTo(1.95 * u, 0.07 * u);
    ctx.quadraticCurveTo(2.4 * u, 0.0, 2.55 * u, -0.56 * u);           // 船尾
    ctx.lineTo(2.36 * u, -0.5 * u);
    ctx.quadraticCurveTo(2.25 * u, -0.34 * u, 1.9 * u, -0.33 * u);
    ctx.lineTo(-2.1 * u, -0.3 * u);
    ctx.quadraticCurveTo(-2.35 * u, -0.34 * u, -2.44 * u, -0.46 * u);
    ctx.closePath();
  }
  // 船的后半：桅、帆、舱里、船尾高起的座与枕头（画在人之前）
  function drawBoatBack(ctx) {
    const A = L('mcBoatA'); if (A < 0.01) return;
    const P = boatPos(), u = boatU(), R = boatRoll(), sail = L('mcSail');
    ctx.save();
    ctx.translate(P.x, P.y + R.bob * u);
    ctx.rotate(R.roll);
    ctx.globalAlpha = A;
    // 舱里（远侧的船舷内壁）
    ctx.fillStyle = sh(WOOD_D, 0.05, 1, -0.05);
    ctx.beginPath();
    ctx.moveTo(-2.1 * u, -0.3 * u); ctx.lineTo(1.9 * u, -0.33 * u); ctx.lineTo(1.9 * u, -0.42 * u); ctx.lineTo(-2.05 * u, -0.4 * u); ctx.closePath(); ctx.fill();
    // 船尾高起的座
    ctx.fillStyle = sh(WOOD, 0.05);
    ctx.fillRect(1.25 * u, -0.4 * u, 0.95 * u, 0.1 * u);
    // 枕头
    ctx.fillStyle = sh([214, 200, 172], 0.05);
    ctx.beginPath(); ctx.ellipse(2.05 * u, -0.43 * u, 0.2 * u, 0.065 * u, -0.1, 0, TAU); ctx.fill();
    // 桅
    const mx = -0.66 * u;
    ctx.fillStyle = sh(WOOD_D, 0.05);
    ctx.fillRect(mx - 0.03 * u, -2.05 * u, 0.06 * u, 1.8 * u);
    // 横桁与帆：张开时鼓着风，收起时卷在桁上
    const yard = -1.9 * u, bil = (0.08 + 0.2 * Math.max(W.lv.gale || 0, stormK())) * sail;
    ctx.save();
    ctx.translate(mx, yard);
    ctx.fillStyle = sh(WOOD, 0.05);
    ctx.fillRect(-0.72 * u, -0.03 * u, 1.44 * u, 0.06 * u);
    if (sail > 0.02) {
      const hgt = 1.25 * u * sail;
      ctx.fillStyle = sh(SAIL, 0.05, 1, 0.06);
      ctx.beginPath();
      ctx.moveTo(-0.68 * u, 0.02 * u); ctx.lineTo(0.68 * u, 0.02 * u);
      ctx.quadraticCurveTo((0.68 - bil) * u, 0.5 * hgt, 0.62 * u, hgt);
      ctx.lineTo(-0.62 * u, hgt);
      ctx.quadraticCurveTo((-0.68 - bil) * u, 0.5 * hgt, -0.68 * u, 0.02 * u);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sh([168, 150, 120], 0.05, 0.6);
      ctx.lineWidth = Math.max(0.6, 0.02 * u);
      ctx.beginPath();
      for (let i = 1; i < 4; i++) { const x = (-0.68 + i * 0.34) * u; ctx.moveTo(x, 0.03 * u); ctx.lineTo(x - bil * 0.3 * u, hgt); }
      ctx.stroke();
    }
    if (sail < 0.98) {
      ctx.globalAlpha = A * (1 - sail);
      ctx.fillStyle = sh(SAIL, 0.05, 1, -0.05);
      ctx.beginPath(); ctx.moveTo(-0.66 * u, 0.02 * u); ctx.quadraticCurveTo(0, 0.13 * u, 0.66 * u, 0.02 * u); ctx.lineTo(0.62 * u, 0.06 * u); ctx.quadraticCurveTo(0, 0.17 * u, -0.62 * u, 0.06 * u); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = A;
    }
    ctx.restore();
    // 船尾的灯杆与灯（夜里点着）
    ctx.fillStyle = sh(WOOD_D, 0.05);
    ctx.fillRect(2.28 * u, -1.25 * u, 0.045 * u, 0.8 * u);
    ctx.fillRect(2.12 * u, -1.25 * u, 0.2 * u, 0.035 * u);
    const lampK = lanternK();
    ctx.fillStyle = lampK > 0.05 ? rgba([255, 214, 140], 0.6 + 0.4 * lampK) : sh([90, 76, 60], 0.05);
    ctx.fillRect(2.1 * u, -1.2 * u, 0.09 * u, 0.13 * u);
    // 绳
    ctx.strokeStyle = sh([70, 56, 44], 0.05, 0.7);
    ctx.lineWidth = Math.max(0.5, 0.015 * u);
    ctx.beginPath();
    ctx.moveTo(mx, -2.03 * u); ctx.lineTo(-2.5 * u, -0.46 * u);
    ctx.moveTo(mx, -2.03 * u); ctx.lineTo(2.3 * u, -0.5 * u);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 船上的灯：夜里点着（风浪里摇晃）
  const lanternK = () => (L('mcBoatA') > 0.05 ? nightK() * L('mcBoatA') : 0);
  function lanternPt() {
    const P = boatPos(), u = boatU(), R = boatRoll(), x = 2.145 * u, y = -1.13 * u;
    return [P.x + x * Math.cos(R.roll) - y * Math.sin(R.roll), P.y + R.bob * u + x * Math.sin(R.roll) + y * Math.cos(R.roll)];
  }
  function drawLantern(ctx) {
    const k = lanternK(); if (k < 0.02) return;
    const q = lanternPt(), u = boatU(), fl = 0.9 + 0.1 * Math.sin(S.clock * 9) * Math.sin(S.clock * 5.3);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', q[0], q[1], 2.6 * u, 0.42 * k * fl);
    glow(ctx, 'g', q[0] - 1.2 * u, q[1] + 0.6 * u, 2.4 * u, 0.2 * k * fl, 1.2 * u);
    glow(ctx, 'w', q[0], q[1], 0.25 * u, 0.9 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 船的前半：近侧的船舷与船板、橹（有人在船上时画在人之后，遮住膝下）
  function drawBoatFront(ctx) {
    const A = L('mcBoatA'); if (A < 0.01) return;
    const P = boatPos(), u = boatU(), R = boatRoll(), row = L('mcRow');
    ctx.save();
    ctx.translate(P.x, P.y + R.bob * u);
    ctx.rotate(R.roll);
    ctx.globalAlpha = A;
    // 橹
    if (row > 0.02) {
      ctx.strokeStyle = sh(WOOD_L, 0.05);
      ctx.lineWidth = Math.max(1, 0.045 * u);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const ox = (-1.25 + i * 0.95) * u, sw = Math.sin(S.clock * (2.6 + 1.6 * stormK()) + i * 0.5) * 0.28 * u * row;
        ctx.moveTo(ox, -0.28 * u); ctx.lineTo(ox - 0.45 * u + sw, 0.28 * u);
      }
      ctx.stroke();
    }
    hullPath(ctx, u);
    ctx.fillStyle = sh(WOOD, 0.05);
    ctx.fill();
    // 船板的缝与一道受光的边
    ctx.strokeStyle = sh(WOOD_D, 0.05, 0.9);
    ctx.lineWidth = Math.max(0.6, 0.022 * u);
    ctx.beginPath();
    ctx.moveTo(-2.2 * u, -0.17 * u); ctx.quadraticCurveTo(0, -0.14 * u, 2.1 * u, -0.2 * u);
    ctx.moveTo(-2.1 * u, -0.04 * u); ctx.quadraticCurveTo(0, -0.01 * u, 2.0 * u, -0.06 * u);
    ctx.stroke();
    const lit = litX() >= P.x ? 1 : -1;
    ctx.strokeStyle = sh(WOOD_L, 0.05, 0.9, 0.2);
    ctx.lineWidth = Math.max(0.8, 0.035 * u);
    ctx.beginPath();
    ctx.moveTo(-2.44 * u, -0.46 * u); ctx.quadraticCurveTo(-2.35 * u, -0.34 * u, -2.1 * u, -0.3 * u);
    ctx.lineTo(1.9 * u, -0.33 * u); ctx.quadraticCurveTo(2.25 * u, -0.34 * u, 2.36 * u, -0.5 * u);
    ctx.stroke();
    if (lit > 0) { ctx.beginPath(); ctx.moveTo(2.36 * u, -0.5 * u); ctx.lineTo(2.55 * u, -0.56 * u); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-2.44 * u, -0.46 * u); ctx.lineTo(-2.62 * u, -0.5 * u); ctx.stroke(); }
    ctx.restore();
    // 船边的水沫：只落在水面上（船拉上岸边的草地时不画）
    const k = 0.25 + 0.6 * stormK();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(226,236,248)';
    ctx.globalAlpha = k * A * (0.4 + 0.6 * W.daylight + 0.3 * W.night * W.lv.moon);
    ctx.lineWidth = Math.max(0.7, 0.03 * u);
    const fy = P.y + (R.bob + 0.07) * u, frx = 2.4 * u, fry = 0.1 * u, NF = 18, a0 = 0.15, a1 = Math.PI - 0.15;
    ctx.beginPath();
    for (let i = 0; i < NF; i++) {
      const s0 = a0 + (a1 - a0) * i / NF, s1 = a0 + (a1 - a0) * (i + 1) / NF, sm = (s0 + s1) / 2;
      if (!W.isSea(P.x + Math.cos(sm) * frx, fy + Math.sin(sm) * fry + 1.5)) continue;
      ctx.moveTo(P.x + Math.cos(s0) * frx, fy + Math.sin(s0) * fry);
      ctx.ellipse(P.x, fy, frx, fry, 0, s0, s1);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 水中的倒影
  function drawBoatShadow(ctx) {
    const A = L('mcBoatA'); if (A < 0.01) return;
    const P = boatPos(), u = boatU(), R = boatRoll();
    if (W.seaBand(P.y) !== 'seaNear' && W.seaBand(P.y) !== 'seaMid') return;
    ctx.save();
    ctx.translate(P.x, P.y + R.bob * u + 0.12 * u);
    ctx.scale(1, -0.55);
    ctx.globalAlpha = A * 0.28 * (1 - 0.8 * stormK());
    hullPath(ctx, u);
    ctx.fillStyle = 'rgb(8,14,24)';
    ctx.fill();
    ctx.fillRect(-0.7 * u, 0, 0.06 * u, 2 * u * (1 - 0.3 * stormK()));
    ctx.restore();
    const k = lanternK();
    if (k > 0.02) {
      const q = lanternPt();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) glow(ctx, 'g', q[0] + Math.sin(S.clock * 2 + i) * 0.1 * u, P.y + (0.25 + i * 0.22) * u, 0.5 * u, 0.22 * k * (1 - i / 6), 0.08 * u);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 别的船和他同行（远处的小帆）
  function drawFleet(ctx, pass) {
    const A = L('mcFleet'); if (A < 0.01) return;
    const list = X('fleet') || [];
    list.forEach((f, i) => {
      const drift = (L('mcBoat') * 0.03 + Math.sin(S.clock * 0.2 + i) * 0.004) * (i % 2 ? 1 : -1);
      const x = (f[0] + drift) * W.w, y = f[1] * W.h;
      if (W.seaBand(y) !== pass) return;
      const u = W.seaScale(y) * 34 * f[2] * (tall() ? 2.2 : 1.3);
      const roll = stormK() * Math.sin(S.clock * 2 + i * 2) * 0.12;
      ctx.save(); ctx.translate(x, y + Math.sin(S.clock * 1.5 + i) * u * 0.05); ctx.rotate(roll);
      ctx.globalAlpha = A * 0.9;
      hullPath(ctx, u);
      ctx.fillStyle = sh(WOOD_D, 0.35); ctx.fill();
      ctx.fillStyle = sh(WOOD_D, 0.35); ctx.fillRect(-0.03 * u, -1.8 * u, 0.06 * u, 1.55 * u);
      ctx.fillStyle = sh(SAIL, 0.4, 1, -0.05);
      ctx.beginPath(); ctx.moveTo(-0.6 * u, -1.7 * u); ctx.lineTo(0.6 * u, -1.7 * u); ctx.lineTo(0.55 * u, -0.6 * u); ctx.lineTo(-0.55 * u, -0.6 * u); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  海：风浪、平静、雨
  // ════════════════════════════════════════════════════════════
  // 平静自船铺开：d 处此刻已平静的程度（0..1）
  function calmAt(x, y) {
    const c = L('mcCalm');
    if (c <= 0) return 0;
    if (c >= 1) return 1;
    const R = c * Math.hypot(W.w, W.h) * 1.05, d = Math.hypot(x - S.calmX * W.w, (y - S.calmY * W.h) * 1.6);
    return 1 - ss(R - 60, R + 30, d);
  }
  function drawWaves(ctx, pass) {
    const g0 = Math.max(L('mcStorm'), 0);
    if (g0 < 0.03) return;
    const q = W.quality || 1, tl = tall();
    ctx.strokeStyle = 'rgba(230,240,250,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const NC = Math.round(170 * q * g0);
    for (let i = 0; i < NC; i++) {
      const ph = U.fract(S.clock * (0.3 + 0.2 * hsh(i + 760)) + hsh(i + 761));
      const y = W.horizonY + (0.008 + 0.4 * Math.pow(hsh(i + 762), 0.85)) * W.h;
      const x = (hsh(i + 763) * 1.04 - 0.03) * W.w + ph * 20;
      if (W.seaBand(y) !== pass || ph > 0.6 || !W.isSea(x, y)) continue;
      if (calmAt(x, y) > 0.6) continue;
      const len = (8 + 16 * hsh(i + 764)) * W.seaScale(y) * (tl ? 1.5 : 1);
      ctx.moveTo(x, y); ctx.lineTo(x + len * (0.4 + ph), y - 0.5);
    }
    ctx.globalAlpha = 0.7 * g0;
    ctx.stroke();
    const N = Math.round(70 * q);
    for (let i = 0; i < N; i++) {
      const ph = U.fract(S.clock * (0.1 + 0.05 * hsh(i + 710)) + hsh(i + 711));
      const y = W.horizonY + (0.012 + 0.4 * Math.pow(hsh(i + 701), 0.7)) * W.h;
      const x = (hsh(i + 700) * 1.06 - 0.04 + ph * 0.05) * W.w;
      if (W.seaBand(y) !== pass || !W.isSea(x, y)) continue;
      const g = g0 * (1 - calmAt(x, y));
      if (g < 0.03) continue;
      const s = W.seaScale(y) * (tl ? 1.7 : 1.2);
      const w = (46 + 60 * hsh(i + 702)) * s, h = (7 + 12 * hsh(i + 703)) * s * (0.4 + 0.9 * g);
      const env = Math.sin(Math.PI * ph);
      const lift = h * env;
      ctx.globalAlpha = g * env * 0.85;
      ctx.fillStyle = 'rgba(12,26,42,0.55)';
      ctx.beginPath(); ctx.ellipse(x - w * 0.1, y + lift * 0.3, w * 0.8, lift * 0.45 + 1, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(40,66,92,0.9)';
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.35, y - lift * 0.5, x, y - lift); ctx.quadraticCurveTo(x + w * 0.25, y - lift * 0.8, x + w * 0.55, y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(236,244,252,0.95)'; ctx.lineWidth = Math.max(0.8, 1.6 * s);
      ctx.beginPath(); ctx.moveTo(x - w * 0.5, y - lift * 0.62); ctx.quadraticCurveTo(x - w * 0.15, y - lift * 1.05, x + w * 0.02, y - lift); ctx.quadraticCurveTo(x + w * 0.2, y - lift * 0.7, x + w * 0.28, y - lift * 0.2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 平静铺开时，前沿一圈柔和的光（只落在海面上）
  function drawCalmFront(ctx) {
    const c = L('mcCalm');
    if (c <= 0.001 || c >= 0.999) return;
    const R = c * Math.hypot(W.w, W.h) * 1.05, cx = S.calmX * W.w, cy = S.calmY * W.h;
    const env = Math.sin(Math.PI * Math.min(1, c * 1.3));
    ctx.globalCompositeOperation = 'lighter';
    const n = 140, r0 = Math.max(12, 0.012 * M());
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, x = cx + Math.cos(a) * R, y = cy + (Math.sin(a) * R) / 1.6;
      if (y < W.horizonY + 2 || !W.isSea(x, y)) continue;
      const s = W.seaScale(y) / Math.max(0.3, W.unit);
      glow(ctx, 'b', x, y, r0 * 2.4 * s, 0.7 * env, r0 * 0.55 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 海面如镜：星的倒影（只在平静的夜里）
  function drawMirror(ctx, pass) {
    const k = L('mcMirror') * clamp(W.night * 1.3, 0, 1) * (1 - L('mcStorm'));
    if (k < 0.02) return;
    // 星的倒影：柔和的圆光（不是一个个方点），近处大些；一些带一道横的水光
    const n = Math.round(260 * (W.quality || 1));
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const y = W.horizonY + (0.004 + 0.38 * Math.pow(hsh(i + 300), 1.35)) * W.h;
      if (W.seaBand(y) !== pass) continue;
      const x = hsh(i + 301) * W.w;
      if (!W.isSea(x, y)) continue;
      const tw = 0.5 + 0.5 * Math.sin(S.clock * (0.8 + hsh(i + 302)) + i);
      const sc = Math.max(0.7, W.seaScale(y) / Math.max(0.3, W.unit)) * (tall() ? 1.25 : 1);
      const r = (1.2 + 1.8 * hsh(i + 303)) * sc;
      const a = (0.45 + 0.45 * tw) * k;
      glow(ctx, hsh(i + 304) < 0.3 ? 'b' : 'w', x, y, r * 2.2, a, r * 1.2);
      if (hsh(i + 305) < 0.45) glow(ctx, 'b', x, y + 0.5, r * 6, a * 0.45, Math.max(0.8, r * 0.45));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 风浪里的雨（本幕自己的；止住得快）
  function drawRain(ctx) {
    const k = L('mcStorm') * (W.lv.rain > 0.05 ? 1 : 0.25);
    if (k < 0.05) return;
    const q = W.quality || 1, n = Math.round(260 * q * k), slant = 0.35 + 0.5 * (W.lv.gale || 0);
    ctx.strokeStyle = 'rgba(200,214,232,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const sp = 0.9 + 0.6 * hsh(i + 90);
      const y = U.fract(S.clock * sp * 1.4 + hsh(i + 91)) * (W.h * 1.1) - 0.05 * W.h;
      const x = U.fract(hsh(i + 92) + S.clock * 0.05 * slant) * W.w * 1.2 - 0.1 * W.w;
      if (calmAt(x, Math.max(y, W.horizonY)) > 0.5) continue;
      const len = (10 + 14 * hsh(i + 93)) * Math.max(0.6, W.unit);
      ctx.moveTo(x, y); ctx.lineTo(x - len * slant, y + len);
    }
    ctx.globalAlpha = 0.55 * k * (1 - L('mcCalm') * 0.9);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 夜里船上与海面上的人：一片柔光（cast 不为附着的人画脚下的光）
  function drawSeaLights(ctx) {
    const n = W.night;
    const list = [];
    for (const id in S.aboard) if (has(id)) list.push(id);
    if (L('mcWalk') > 0.001 || L('mcReach') > 0.001) list.push('jesus');
    if (L('mcPeter') > 0.001 && !S.aboard.peter) list.push('peter');
    safe('mc.lantern', () => drawLantern(ctx));
    ctx.globalCompositeOperation = 'lighter';
    // 大大地平静了：月下的海面上，船与船上的人笼着一片清凉的光
    const mk = L('mcMirror') * clamp(W.night * 1.3, 0, 1) * (1 - L('mcStorm')) * L('mcBoatA');
    if (mk > 0.02) { const P = boatPos(), u = boatU(); glow(ctx, 'b', P.x + 0.2 * u, P.y - 0.8 * u, 3.8 * u, 0.34 * mk, 1.8 * u); }
    for (const id of list) {
      const f = fpos(id); if (!f) continue;
      const isJ = id === 'jesus';
      if (n > 0.1) glow(ctx, 'g', f.x, f.y - f.h * 0.5, f.h * (isJ ? 1.4 : 0.9), (isJ ? 0.3 : 0.14) * n * (f.p ? f.p.alpha : 1), f.h * (isJ ? 1.2 : 0.8));
      if (!S.aboard[id]) {
        // 在海面上：脚下一片光、水中一道倒影
        glow(ctx, isJ ? 'r' : 'b', f.x, f.y, f.h * (isJ ? 1.3 : 0.7), (isJ ? 0.6 : 0.3) * (0.4 + 0.6 * n), f.h * 0.2);
        if (isJ) {
          for (let i = 0; i < 4; i++) glow(ctx, 'r', f.x + Math.sin(S.clock * 1.7 + i * 1.3) * f.h * 0.05, f.y + f.h * (0.12 + i * 0.16), f.h * 0.28, 0.3 * (1 - i / 5) * (0.4 + 0.6 * n), f.h * 0.05);
          glow(ctx, 'w', f.x, f.y - f.h * 0.55, f.h * 1.1, 0.22 * (0.3 + 0.7 * n), f.h * 1.0);
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 彼得将要沉下去：水面以下的身子不画——人画之前裁去他脚下水里的一小块，画完人（下一层之初）即复原。
  // 不在他身上盖任何色块：水里露出的就是底下真的海。
  let CLIP = null;
  function sinkGeom() {
    const k = L('mcSink');
    if (k < 0.01 || S.aboard.peter || !has('peter')) return null;
    const q = peterWaterPt(), wy = peterWaterY(), h = H2();
    if (!isFinite(q[0]) || !isFinite(wy) || !W.isSea(q[0], wy + 2)) return null;
    return { x: q[0], wy, h, k };
  }
  function sinkClipOn(ctx) {
    sinkClipOff();
    const g = sinkGeom(); if (!g) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(-60, -60, W.w + 120, W.h + 120);
    ctx.rect(g.x - g.h * 0.55, g.wy + 0.5, g.h * 1.1, g.h * 1.2);
    ctx.clip('evenodd');
    CLIP = ctx;
  }
  function sinkClipOff() { if (CLIP) { const c = CLIP; CLIP = null; try { c.restore(); } catch (e) { /* 已复原 */ } } }
  // 水面：他腰间一圈翻起的水沫与柔光（只是光，不遮人）
  function drawSinkWater(ctx) {
    const g = sinkGeom(); if (!g) return;
    const { x, wy, h, k } = g;
    ctx.globalCompositeOperation = 'lighter';
    const lum = 0.55 + 0.45 * W.night;
    glow(ctx, 'b', x, wy, h * 0.9, 0.3 * k * lum, h * 0.12);
    ctx.strokeStyle = 'rgb(220,234,250)';
    for (let i = 0; i < 3; i++) {
      const ph = U.fract(S.clock * 0.9 + i / 3), rx = h * (0.22 + 0.5 * ph), ry = h * (0.04 + 0.06 * ph);
      ctx.globalAlpha = 0.5 * k * (1 - ph) * lum;
      ctx.lineWidth = Math.max(0.8, h * 0.022 * (1 - ph * 0.5));
      ctx.beginPath(); ctx.ellipse(x, wy + 1, rx, ry, 0, 0, TAU); ctx.stroke();
    }
    // 腰间一道翻动的水线
    ctx.globalAlpha = 0.55 * k * lum;
    ctx.lineWidth = Math.max(1, h * 0.03);
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, xx = x - h * 0.3 + h * 0.6 * t, yy = wy - Math.sin(t * Math.PI * 2 + S.clock * 6) * h * 0.02 - Math.sin(t * Math.PI) * h * 0.02;
      if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  海面上行走
  // ════════════════════════════════════════════════════════════
  // 他自岸边的山脚走上海面（walk0 → walk1），停在离船尾远远的水上
  function jesusWaterPt() {
    const a = X('walk0'), b = X('walk1'), t = ease(L('mcWalk'));
    let x = lerp(a[0], b[0], t) * W.w, y = lerp(a[1], b[1], t) * W.h;
    const r = L('mcReach');
    if (r > 0) { const m = meetPt(); x = lerp(x, m[0] + boatU() * 0.3, ease(r)); y = lerp(y, m[1], ease(r)); }
    const k = L('mcBack');
    // 拉住他以后：与他并肩走回船尾
    if (k > 0) { const e = ease(r); x = lerp(x, peterWaterPt()[0] + boatU() * 0.3, e); y = lerp(y, peterWaterY(), e); }
    return [x, y];
  }
  // 彼得自船尾下到水面，走向主：走过船尾与主之间四分之三的水面，离主还有一段时，见风甚大
  function sternPt() { const P = boatPos(), u = boatU(); return [P.x + 2.2 * u, P.y + 0.02 * u]; }
  function meetPt() {
    const s = sternPt(), b = X('walk1');
    return [lerp(s[0], b[0] * W.w, 0.75), lerp(s[1], b[1] * W.h, 0.75)];
  }
  const peterT = () => ease(L('mcPeter')) * (1 - ease(L('mcBack')));
  function peterWaterY() { const s = sternPt(), m = meetPt(); return lerp(s[1], m[1], peterT()); }
  function peterWaterPt() {
    const s = sternPt(), m = meetPt(), t = peterT();
    return [lerp(s[0], m[0], t), lerp(s[1], m[1], t) + L('mcSink') * H2() * 0.42];
  }

  // ════════════════════════════════════════════════════════════
  //  迦百农：房屋、会堂、灯
  // ════════════════════════════════════════════════════════════
  // 房屋的尺寸（以近地人高 h 计）
  function houseG(key) {
    const xf = X(key); if (xf == null) return null;
    const h = H2(), x = xf * W.w, y = gYb(x) + 2;
    const dims = { houseA: [2.1, 1.35], houseB: [3.0, 1.5], houseC: [2.3, 1.3] }[key];
    const w = dims[0] * h, hh = dims[1] * h;
    return { h, x, y, w, hh, x0: x - w / 2, x1: x + w / 2, top: y - hh, slab: 0.15 * h };
  }
  function drawHouse(ctx, key, a) {
    const G = houseG(key); if (!G) return;
    const s = G.h, nk = nightK(), lamp = L('mcLamp') * nk;
    const d = litX() >= G.x ? 1 : -1;
    ctx.globalAlpha = a;
    if (key === 'houseB') {
      // 西门的家：前面敞开，看得见屋里；右边一道外梯上房顶；房顶可拆通
      ctx.fillStyle = sh(mix(BASALT_D, [30, 26, 22], 0.35), 0);
      ctx.fillRect(G.x0 + 0.1 * s, G.top, G.w - 0.2 * s, G.hh);
      // 屋里的灯（黄昏以后）与拆通房顶时照进来的天光
      if (lamp > 0.02) { ctx.globalCompositeOperation = 'lighter'; glow(ctx, 'g', G.x - 0.6 * s, G.top + 0.55 * s, 1.1 * s, 0.5 * lamp); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = a; }
      const op = L('mcRoof');
      if (op > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        const ox = G.x - 0.1 * s;
        ctx.globalAlpha = a * op * (0.1 + 0.12 * W.daylight);
        ctx.fillStyle = 'rgb(255,236,196)';
        ctx.beginPath(); ctx.moveTo(ox - 0.42 * s, G.top); ctx.lineTo(ox + 0.42 * s, G.top); ctx.lineTo(ox + 0.62 * s, G.y); ctx.lineTo(ox - 0.62 * s, G.y); ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a;
      }
      // 墙角的石柱与两侧的墙
      ctx.fillStyle = sh(BASALT, 0);
      ctx.fillRect(G.x0, G.top, 0.32 * s, G.hh);
      ctx.fillRect(G.x1 - 0.32 * s, G.top, 0.32 * s, G.hh);
      ctx.fillStyle = sh(BASALT_D, 0);
      ctx.fillRect(G.x0 + 0.32 * s, G.top, 0.12 * s, G.hh);
      ctx.strokeStyle = sh(BASALT_D, 0, 0.55); ctx.lineWidth = Math.max(0.5, 0.018 * s);
      ctx.beginPath();
      for (let r = 1; r < 6; r++) { const yy = G.top + (r / 6) * G.hh; ctx.moveTo(G.x0, yy); ctx.lineTo(G.x0 + 0.32 * s, yy); ctx.moveTo(G.x1 - 0.32 * s, yy); ctx.lineTo(G.x1, yy); }
      ctx.stroke();
      // 屋里靠墙的一张矮凳、一盏未点的灯台
      ctx.fillStyle = sh(WOOD, 0, 0.9, -0.1);
      ctx.fillRect(G.x1 - 1.05 * s, G.y - 0.22 * s, 0.55 * s, 0.06 * s);
      ctx.fillRect(G.x1 - 1.0 * s, G.y - 0.2 * s, 0.05 * s, 0.2 * s); ctx.fillRect(G.x1 - 0.57 * s, G.y - 0.2 * s, 0.05 * s, 0.2 * s);
      // 房顶（拆通处留一个口）
      const ox = G.x - 0.1 * s, gap = 0.4 * s * op;
      ctx.fillStyle = sh(ROOF, 0);
      ctx.fillRect(G.x0 - 0.1 * s, G.top - G.slab, ox - gap - (G.x0 - 0.1 * s), G.slab);
      ctx.fillRect(ox + gap, G.top - G.slab, G.x1 + 0.1 * s - (ox + gap), G.slab);
      ctx.fillStyle = sh(MUD, 0);
      ctx.fillRect(G.x0 - 0.1 * s, G.top - G.slab - 0.1 * s, 0.25 * s, 0.1 * s);
      ctx.fillRect(G.x1 - 0.15 * s, G.top - G.slab - 0.1 * s, 0.25 * s, 0.1 * s);
      // 梁的端头
      ctx.fillStyle = sh(WOOD_D, 0);
      for (let i = 0; i < 6; i++) { const bx = G.x0 + (0.2 + i * 0.52) * s; if (Math.abs(bx - ox) > gap + 0.05 * s) ctx.fillRect(bx, G.top - 0.05 * s, 0.1 * s, 0.07 * s); }
      // 外梯
      ctx.fillStyle = sh(BASALT, 0, 1, -0.04);
      ctx.beginPath();
      const st = stairG();
      for (let i = 0; i < 5; i++) ctx.rect(st.x0 + i * st.dx * 0.2 - 0.02 * s, G.y - (i + 1) * st.dy / 5, st.dx - i * st.dx * 0.2 + 0.02 * s, st.dy / 5 + 1);
      ctx.fill();
      // 受光的一边
      ctx.strokeStyle = sh([236, 220, 190], 0, 0.35 * W.daylight);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(G.x0 - 0.1 * s, G.top - G.slab); ctx.lineTo(G.x1 + 0.1 * s, G.top - G.slab); ctx.stroke();
      ctx.globalAlpha = 1;
      return;
    }
    // 平顶的玄武岩小屋
    ctx.fillStyle = sh(BASALT, 0);
    ctx.fillRect(G.x0, G.top, G.w, G.hh);
    stones(ctx, G, key === 'houseA' ? 3 : 7);
    // 墙脚一道暗的石基
    ctx.fillStyle = sh(BASALT_D, 0);
    ctx.fillRect(G.x0 - 0.04 * s, G.y - 0.16 * s, G.w + 0.08 * s, 0.16 * s);
    ctx.fillStyle = sh(ROOF, 0);
    ctx.fillRect(G.x0 - 0.1 * s, G.top - G.slab, G.w + 0.2 * s, G.slab);
    ctx.fillStyle = sh(MUD, 0);
    ctx.fillRect(G.x0 - 0.1 * s, G.top - G.slab - 0.09 * s, G.w + 0.2 * s, 0.05 * s);
    // 门与窗
    const dx = G.x + (key === 'houseA' ? 0.35 : -0.3) * s, dw = 0.42 * s, dh = 0.85 * s;
    ctx.fillStyle = sh(DOOR, 0);
    ctx.fillRect(dx - dw / 2, G.y - dh, dw, dh);
    const wx = G.x + (key === 'houseA' ? -0.55 : 0.5) * s, wy = G.top + 0.35 * s, ws = 0.22 * s;
    ctx.fillRect(wx - ws / 2, wy, ws, ws);
    if (lamp > 0.02) {
      ctx.fillStyle = rgba([255, 200, 120], 0.85 * lamp * a);
      ctx.fillRect(wx - ws / 2, wy, ws, ws);
      ctx.fillRect(dx - dw / 2, G.y - dh, dw, dh * 0.2);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', wx, wy + ws / 2, 0.7 * s, 0.5 * lamp * a);
      glow(ctx, 'g', dx, G.y - dh * 0.5, 0.9 * s, 0.35 * lamp * a);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = a;
    // 门楣、门边的水罐；睚鲁的家门前一架芦席的荫棚
    ctx.fillStyle = sh(LIME_D, 0);
    ctx.fillRect(dx - dw / 2 - 0.06 * s, G.y - dh - 0.07 * s, dw + 0.12 * s, 0.07 * s);
    ctx.fillStyle = sh([176, 122, 80], 0);
    for (let i = 0; i < 2; i++) {
      const jx = dx + (key === 'houseA' ? -1 : 1) * (dw / 2 + (0.16 + i * 0.17) * s), jy = G.y - 0.02 * s;
      ctx.beginPath(); ctx.ellipse(jx, jy - 0.12 * s, 0.08 * s, 0.12 * s, 0, 0, TAU); ctx.fill();
      ctx.fillRect(jx - 0.04 * s, jy - 0.27 * s, 0.08 * s, 0.05 * s);
    }
    if (key === 'houseA') {
      ctx.strokeStyle = sh(WOOD_D, 0); ctx.lineWidth = Math.max(0.8, 0.04 * s);
      const ax0 = G.x1 - 0.1 * s, ax1 = G.x1 + 0.9 * s, ay = G.top + 0.25 * G.hh;
      ctx.beginPath(); ctx.moveTo(ax1, ay + 0.1 * s); ctx.lineTo(ax1, G.y); ctx.stroke();
      ctx.fillStyle = sh([176, 150, 100], 0, 0.95);
      ctx.beginPath(); ctx.moveTo(ax0, ay); ctx.lineTo(ax1 + 0.1 * s, ay + 0.12 * s); ctx.lineTo(ax1 + 0.1 * s, ay + 0.2 * s); ctx.lineTo(ax0, ay + 0.1 * s); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = sh([236, 220, 190], 0, 0.3 * W.daylight);
    ctx.lineWidth = 1;
    ctx.beginPath();
    const ex = d > 0 ? G.x1 : G.x0;
    ctx.moveTo(G.x0 - 0.1 * s, G.top - G.slab); ctx.lineTo(G.x1 + 0.1 * s, G.top - G.slab);
    ctx.moveTo(ex, G.top); ctx.lineTo(ex, G.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 玄武岩的石块：交错的短缝（固定的花样）
  function stones(ctx, G, seed) {
    const s = G.h, rows = 5;
    ctx.strokeStyle = sh(BASALT_D, 0, 0.55);
    ctx.lineWidth = Math.max(0.5, 0.018 * s);
    ctx.beginPath();
    for (let r = 1; r < rows; r++) {
      const yy = G.top + (r / rows) * G.hh;
      ctx.moveTo(G.x0, yy); ctx.lineTo(G.x1, yy);
      const n = Math.max(2, Math.round(G.w / (0.42 * s)));
      for (let k = 0; k < n; k++) {
        const xx = G.x0 + ((k + (r % 2) * 0.5 + 0.3 * hsh(seed * 31 + r * 7 + k)) / n) * G.w;
        if (xx > G.x1 - 2) continue;
        ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - G.hh / rows);
      }
    }
    ctx.stroke();
    // 几块颜色略浅的石头
    ctx.fillStyle = sh(mix(BASALT, [190, 180, 164], 0.3), 0, 0.5);
    for (let k = 0; k < 6; k++) {
      const xx = G.x0 + hsh(seed * 13 + k) * (G.w - 0.4 * s), yy = G.top + Math.floor(hsh(seed * 17 + k) * rows) * (G.hh / rows);
      ctx.fillRect(xx, yy + 1, 0.32 * s, G.hh / rows - 2);
    }
  }
  function stairG() {
    const G = houseG('houseB'); if (!G) return null;
    const s = G.h;
    return { x0: G.x1, dx: 0.75 * s, dy: G.hh, top: G.top - G.slab, x1: G.x1 + 0.75 * s };
  }
  function roofY() { const G = houseG('houseB'); return G ? G.top - G.slab : W.h * 0.7; }
  // 会堂（中丘上的白石）
  function drawSynagogue(ctx, a) {
    const xf = X('syn'); if (xf == null) return;
    const h = H1(), x = xf * W.w, y = gYb(x, 1) + 1, w = 3.2 * h, hh = 1.7 * h;
    const dep = 0.45;
    ctx.globalAlpha = a;
    ctx.fillStyle = sh(LIME, dep);
    ctx.fillRect(x - w / 2, y - hh, w, hh);
    ctx.fillStyle = sh(LIME_D, dep);
    ctx.fillRect(x - w / 2 - 0.12 * h, y - hh - 0.18 * h, w + 0.24 * h, 0.18 * h);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 0.12 * h, y - hh - 0.18 * h); ctx.lineTo(x, y - hh - 0.6 * h); ctx.lineTo(x + w / 2 + 0.12 * h, y - hh - 0.18 * h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh([150, 140, 124], dep);
    for (let i = 0; i < 5; i++) ctx.fillRect(x - w / 2 + (0.28 + i * 0.66) * h, y - hh + 0.15 * h, 0.14 * h, hh - 0.15 * h);
    ctx.fillStyle = sh(DOOR, dep);
    ctx.fillRect(x - 0.22 * h, y - 0.9 * h, 0.44 * h, 0.9 * h);
    const lamp = L('mcLamp') * nightK();
    if (lamp > 0.02) { ctx.globalCompositeOperation = 'lighter'; glow(ctx, 'g', x, y - 0.5 * h, 1.2 * h, 0.4 * lamp * a); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }
  // 地上的褥子（缒下来的、睚鲁家门前的）
  function drawMat(ctx, x, y, len, a, rolled) {
    if (a < 0.01) return;
    const s = H2();
    ctx.globalAlpha = a;
    ctx.fillStyle = sh(MAT, 0);
    ctx.beginPath(); ctx.ellipse(x, y, len / 2, 0.06 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh(MAT_D, 0);
    ctx.fillRect(x - len / 2, y, len, 0.03 * s);
    ctx.globalAlpha = 1;
  }
  // 缒下来的褥子：抬在四人肩上、上了房顶、自拆通处缒到屋里主的面前
  const BEARERS = ['b1', 'b2', 'b3', 'b4'];
  function matPt() {
    const G = houseG('houseB'), s = H2();
    const m = L('mcMat');
    if (m > 0.001 && G) {
      const x = G.x - 0.1 * s, y0 = roofY() - 0.05 * s, y1 = G.y - 0.1 * s;
      return [x - 0.45 * s * ss(0.85, 1, m), lerp(y0, y1, ease(m))];
    }
    // 上了房顶：放在拆通处的旁边
    const b1 = person('b1');
    if (G && b1 && b1.ny != null && !(b1.fly)) return [G.x - 0.1 * s + 0.62 * s, roofY() - 0.04 * s];
    // 抬着走：四人手上
    let sx = 0, sy = 0, n = 0;
    for (const id of BEARERS) { const f = fpos(id); if (!f) continue; sx += f.x; sy += f.y - f.h * 0.52; n++; }
    if (!n) return null;
    return [sx / n, sy / n];
  }
  function drawLoweredMat(ctx) {
    const A = L('mcMatA'); if (A < 0.01) return;
    const P = matPt(); if (!P) return;
    const s = H2();
    drawMat(ctx, P[0], P[1] + 0.02 * s, 1.15 * s, A);
    // 缒下时的绳子：自房顶的口垂到褥子四角
    const m = L('mcMat');
    if (m > 0.001 && m < 0.999) {
      const G = houseG('houseB'), ox = G.x - 0.1 * s, ry = roofY();
      ctx.strokeStyle = sh([90, 72, 52], 0, 0.9 * A);
      ctx.lineWidth = Math.max(0.6, 0.025 * s);
      ctx.beginPath();
      ctx.moveTo(ox - 0.35 * s, ry); ctx.lineTo(P[0] - 0.55 * s, P[1]);
      ctx.moveTo(ox + 0.35 * s, ry); ctx.lineTo(P[0] + 0.55 * s, P[1]);
      ctx.stroke();
    }
  }
  // 睚鲁家门前：闺女躺卧的褥子
  function drawBed(ctx) {
    const A = L('mcBed') * Math.max(L('mcTown'), 0.001); if (A < 0.01) return;
    const x = X('bed') * W.w, y = fieldY(X('bed'), X('bedV')), s = H2();
    drawMat(ctx, x - 0.1 * s, y + 0.02 * s, 0.95 * s, A);
    ctx.globalAlpha = A;
    ctx.fillStyle = sh([226, 216, 196], 0);
    ctx.beginPath(); ctx.ellipse(x - 0.45 * s, y - 0.02 * s, 0.13 * s, 0.05 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  格拉森人的地方：坟茔、山崖、断了的铁链；黑影
  // ════════════════════════════════════════════════════════════
  let ROCKS = null;
  function rockShape() {
    if (ROCKS) return ROCKS;
    const r = U.mulberry32(517), pts = [];
    const n = 16;
    for (let i = 0; i <= n; i++) pts.push([i / n, 0.55 + 0.45 * Math.sin((i / n) * Math.PI) * (0.75 + 0.35 * r()) - (i % 3 === 0 ? 0.08 * r() : 0)]);
    ROCKS = pts;
    return pts;
  }
  function drawTombs(ctx) {
    const A = L('mcGerasa'); if (A < 0.01) return;
    const s = H2(), x0 = X('tomb0') * W.w, x1 = W.w * 1.02, pts = rockShape();
    const hmax = 1.9 * s;
    ctx.globalAlpha = A;
    ctx.fillStyle = sh(ROCK, 0);
    ctx.beginPath();
    ctx.moveTo(x0, gYb(x0) + 4);
    for (const p of pts) { const x = lerp(x0, x1, p[0]); ctx.lineTo(x, gYb(Math.min(x, W.w)) - p[1] * hmax * ss(0, 0.15, p[0])); }
    ctx.lineTo(x1, gYb(W.w) + 6);
    ctx.closePath(); ctx.fill();
    // 岩面的层理与阴影
    ctx.strokeStyle = sh(ROCK_D, 0, 0.7);
    ctx.lineWidth = Math.max(0.6, 0.03 * s);
    ctx.beginPath();
    for (let k = 1; k < 4; k++) {
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], x = lerp(x0, x1, p[0]), y = gYb(Math.min(x, W.w)) - p[1] * hmax * ss(0, 0.15, p[0]) * (1 - k * 0.24);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    // 凿在岩里的坟茔：暗的门洞，旁边一块圆石
    const doors = [0.3, 0.55, 0.8];
    for (let i = 0; i < doors.length; i++) {
      const x = lerp(x0, x1, doors[i]), gy = gYb(Math.min(x, W.w));
      const dw = 0.36 * s, dh = 0.55 * s;
      ctx.fillStyle = sh(TOMB, 0);
      ctx.beginPath(); ctx.moveTo(x - dw / 2, gy - 0.05 * s); ctx.lineTo(x - dw / 2, gy - dh); ctx.quadraticCurveTo(x, gy - dh - 0.2 * s, x + dw / 2, gy - dh); ctx.lineTo(x + dw / 2, gy - 0.05 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = sh(ROCK_D, 0);
      ctx.beginPath(); ctx.ellipse(x + dw * 0.95, gy - 0.26 * s, 0.26 * s, 0.28 * s, 0, 0, TAU); ctx.fill();
    }
    // 断了的铁链与碎了的脚镣
    const cx = lerp(x0, x1, 0.12), cy = gYb(cx) - 0.03 * s;
    ctx.strokeStyle = sh([70, 66, 64], 0, 0.95);
    ctx.lineWidth = Math.max(0.8, 0.035 * s);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const lx = cx + i * 0.11 * s; ctx.moveTo(lx + 0.05 * s, cy - (i % 2) * 0.03 * s); ctx.ellipse(lx, cy - (i % 2) * 0.03 * s, 0.05 * s, 0.028 * s, 0, 0, TAU); }
    ctx.moveTo(cx + 0.95 * s, cy); ctx.arc(cx + 0.9 * s, cy - 0.02 * s, 0.05 * s, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 那人身上冷的暗影（不是任何活物：只是一团不安的暗）
  function drawShadow(ctx) {
    const k = L('mcShadow');
    if (k > 0.01 && has('demon')) {
      const f = fpos('demon');
      if (f) {
        const cx = f.x, cy = f.y - f.h * 0.5;
        for (let i = 0; i < 9; i++) {
          const a = S.clock * (0.7 + 0.2 * (i % 3)) + i * 0.7, r = f.h * (0.25 + 0.18 * Math.sin(S.clock * 1.3 + i));
          glow(ctx, 'k', cx + Math.cos(a) * r, cy + Math.sin(a * 1.3) * r * 0.9, f.h * (0.42 + 0.1 * (i % 2)), 0.3 * k);
        }
      }
    }
    const m = L('mcSmoke');
    if (m > 0.001 && m < 0.999) {
      // 离开：升起、向左越过山崖、落进海里、散尽
      const s = H2(), ax = X('demonAt') * W.w, ay = gYb(ax) - 0.6 * s;
      const bx = ax - 0.05 * W.w, by = ay - 1.6 * s;
      const cx2 = X('sea')[0] * W.w - 0.02 * W.w, cy2 = X('sea')[1] * W.h - 0.2 * s;
      const q = ease(m), x = q < 0.5 ? lerp(ax, bx, q * 2) : lerp(bx, cx2, (q - 0.5) * 2);
      const y = q < 0.5 ? lerp(ay, by, Math.sin(q * Math.PI)) : lerp(by, cy2, Math.pow((q - 0.5) * 2, 1.4));
      const fade = 1 - ss(0.72, 1, m);
      for (let i = 0; i < 7; i++) {
        const a = S.clock * 1.4 + i * 0.9;
        glow(ctx, 'k', x + Math.cos(a) * s * 0.3 * (1 - q * 0.5), y + Math.sin(a) * s * 0.2, s * (0.45 - 0.2 * q), 0.34 * fade);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  五饼二鱼、十二个篮子、山坡上的众人
  // ════════════════════════════════════════════════════════════
  function basketPt() {
    const g = L('mcBasketG');
    const s = H2();
    let bx = null, by = null;
    if (g < 0.999) { const f = fpos('boy'); if (f) { bx = f.x + (f.p && f.p.facing < 0 ? -1 : 1) * 0.16 * f.h; by = f.y - f.h * 0.42; } }
    const gx = X('basketX') * W.w, gy = fieldY(X('basketX'), 0.12) - 0.1 * s;
    if (bx == null) return [gx, gy];
    return [lerp(bx, gx, ease(g)), lerp(by, gy, ease(g))];
  }
  function basket(ctx, x, y, s, fill, a) {
    ctx.globalAlpha = a;
    ctx.fillStyle = sh(WICKER, 0);
    ctx.beginPath(); ctx.moveTo(x - 0.2 * s, y - 0.12 * s); ctx.lineTo(x + 0.2 * s, y - 0.12 * s); ctx.lineTo(x + 0.15 * s, y + 0.06 * s); ctx.lineTo(x - 0.15 * s, y + 0.06 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh([110, 80, 46], 0, 0.8); ctx.lineWidth = Math.max(0.5, 0.02 * s);
    ctx.beginPath(); ctx.moveTo(x - 0.18 * s, y - 0.05 * s); ctx.lineTo(x + 0.18 * s, y - 0.05 * s); ctx.moveTo(x - 0.16 * s, y + 0.01 * s); ctx.lineTo(x + 0.16 * s, y + 0.01 * s); ctx.stroke();
    if (fill > 0.01) {
      ctx.fillStyle = sh(LOAF, 0, 1, 0.1);
      const n = Math.max(1, Math.round(4 * fill));
      for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.ellipse(x + (-0.12 + i * 0.08) * s, y - 0.13 * s, 0.06 * s, 0.035 * s, 0, 0, TAU); ctx.fill(); }
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', x, y - 0.12 * s, 0.4 * s, 0.4 * fill * a);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function drawLoaves(ctx) {
    const A = L('mcBasket'); if (A < 0.01) return;
    const P = basketPt(), s = H2();
    const x = P[0], y = P[1];
    basket(ctx, x, y, s * 0.9, 0, A);
    // 五个饼、两条鱼
    ctx.globalAlpha = A;
    ctx.fillStyle = sh(LOAF, 0, 1, 0.15);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(x + (-0.12 + i * 0.06) * s, y - (0.13 + (i % 2) * 0.03) * s, 0.045 * s, 0.03 * s, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh(FISHC, 0, 1, 0.1);
    for (let i = 0; i < 2; i++) {
      const fx0 = x + (0.02 + i * 0.1) * s, fy = y - (0.19 + i * 0.02) * s;
      ctx.beginPath(); ctx.ellipse(fx0, fy, 0.07 * s, 0.022 * s, -0.3 + i * 0.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(fx0 + 0.07 * s, fy); ctx.lineTo(fx0 + 0.11 * s, fy - 0.03 * s); ctx.lineTo(fx0 + 0.11 * s, fy + 0.03 * s); ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x, y - 0.15 * s, 0.45 * s, (0.35 + 0.25 * Math.sin(S.clock * 2)) * A);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function basketSpots() {
    const r = X('baskets'), out = [];
    for (let i = 0; i < 12; i++) {
      const row = i < 6 ? 0 : 1, k = i % 6;
      out.push([lerp(r[0], r[1], (k + (row ? 0.5 : 0)) / 6), row ? 0.62 : 0.38]);
    }
    return out;
  }
  // 「十二个篮子」这名字的位置：横屏在篮子的左上、船头之下的岸边（草地与水上）；竖屏在篮子上方的海湾上
  function basketNamePt() {
    const r = X('baskets'), s = H2();
    if (tall()) { const x = lerp(r[0], r[1], 0.62) * W.w; return [x, gY(x) - 2.3 * s]; }
    return [(r[0] - 0.062) * W.w, fieldY(r[0], 0.38) - 0.9 * s];
  }
  function drawBaskets(ctx) {
    const A = L('mcBaskets'); if (A < 0.005) return;
    const s = H2();
    basketSpots().forEach((b, i) => {
      const k = c01(A * 12 - i); if (k < 0.01) return;
      const x = b[0] * W.w, y = fieldY(b[0], b[1]);
      basket(ctx, x, y - 0.06 * s, s * 0.8, k, Math.min(1, k * 2));
    });
  }
  // 山坡上的许多人：中丘上一排一排坐着的小影子（「吃饼的男人共有五千」）
  let MANY = null;
  function manyPts() {
    if (MANY) return MANY;
    const r = U.mulberry32(605), pts = [];
    for (let row = 0; row < 7; row++) for (let i = 0; i < 38; i++) pts.push([0.6 + 0.4 * ((i + r() * 0.8) / 38), row, r(), r()]);
    MANY = pts;
    return pts;
  }
  function drawMany(ctx) {
    const A = L('mcMany'); if (A < 0.01) return;
    const h = H1() * 0.5, pts = manyPts(), bread = L('mcBread');
    const cols = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [120, 100, 84], [104, 96, 110], [158, 138, 108]];
    for (const p of pts) {
      const x = p[0] * W.w; if (x > W.w) continue;
      const gy = gYb(x, 1) + p[1] * h * 0.55 + 0.5;
      if (gy > W.waterlineY(1) - 1) continue;
      ctx.globalAlpha = A * (0.8 + 0.2 * p[3]);
      ctx.fillStyle = sh(cols[(p[3] * cols.length) | 0], 0.45);
      ctx.beginPath(); ctx.ellipse(x, gy - h * 0.3, h * 0.2, h * 0.32, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x, gy - h * 0.72, h * 0.13, 0, TAU); ctx.fill();
    }
    if (bread > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < pts.length; i += 3) {
        const p = pts[i], x = p[0] * W.w, reach = c01((bread - 0.35 - (p[0] - 0.6) * 0.8) * 4);
        if (reach < 0.01 || x > W.w) continue;
        const gy = gYb(x, 1) + p[1] * h * 0.55;
        glow(ctx, 'g', x, gy - h * 0.4, h * 0.9, 0.35 * reach * A);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  低加坡里：中丘上白石的城
  // ════════════════════════════════════════════════════════════
  function drawDeca(ctx) {
    const A = L('mcDeca'); if (A < 0.01) return;
    const h = H1(), dep = 0.45;
    const xs = tall() ? [0.66, 0.78, 0.9] : [0.8, 0.86, 0.93];
    ctx.globalAlpha = A;
    xs.forEach((xf, i) => {
      const x = xf * W.w, y = gYb(x, 1) + 1, w = (i === 1 ? 2.6 : 1.8) * h, hh = (i === 1 ? 1.5 : 1.1) * h;
      ctx.fillStyle = sh(LIME, dep);
      ctx.fillRect(x - w / 2, y - hh, w, hh);
      if (i === 1) {
        ctx.fillStyle = sh(LIME_D, dep);
        ctx.beginPath(); ctx.moveTo(x - w / 2 - 0.1 * h, y - hh); ctx.lineTo(x, y - hh - 0.5 * h); ctx.lineTo(x + w / 2 + 0.1 * h, y - hh); ctx.closePath(); ctx.fill();
        ctx.fillStyle = sh([140, 132, 118], dep);
        for (let k = 0; k < 5; k++) ctx.fillRect(x - w / 2 + (0.2 + k * 0.52) * h, y - hh + 0.1 * h, 0.12 * h, hh - 0.1 * h);
      } else {
        ctx.fillStyle = sh([150, 140, 124], dep);
        ctx.fillRect(x - 0.15 * h, y - 0.6 * h, 0.3 * h, 0.6 * h);
        ctx.fillRect(x - w / 2 - 0.05 * h, y - hh - 0.08 * h, w + 0.1 * h, 0.08 * h);
      }
    });
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  失色与复明（伯赛大）
  // ════════════════════════════════════════════════════════════
  // 陆地的剪影（近地、中丘、远山）：用"饱和度"混合把它们的颜色褪去；天与海上蒙一层灰
  function landPath(ctx) {
    ctx.beginPath();
    const step = Math.max(4, W.w / 160);
    for (let layer = 0; layer < 3; layer++) {
      const wl = W.waterlineY(layer), bottom = layer === 2 ? W.h + 4 : wl + 1;
      let open = false;
      for (let x = -step; x <= W.w + step; x += step) {
        const xx = clamp(x, 0, W.w), y = W.ridgeY(layer, xx);
        const on = y < wl;
        if (on && !open) { ctx.moveTo(x, bottom); ctx.lineTo(x, y); open = true; }
        else if (on) ctx.lineTo(x, y);
        else if (open) { ctx.lineTo(x, bottom); ctx.closePath(); open = false; }
      }
      if (open) { ctx.lineTo(W.w + step, bottom); ctx.closePath(); }
    }
  }
  // 失色：视野（复明的圆）之外，陆地褪去颜色、天与海蒙一层灰；
  // 第一次按手（mcHaze）：颜色回来一半，却一片模糊的乳白；再按手（mcSight）：颜色自一点绽放，满目清楚
  function drawMute(ctx) {
    const m = L('mcMute'); if (m < 0.01) return;
    const sight = L('mcSight'), hz = L('mcHaze');
    if (sight >= 0.999) return;
    const R = ease(sight) * Math.hypot(W.w, W.h) * 1.15;
    const cx = S.bloomX * W.w, cy = S.bloomY * W.h;
    const edge = Math.max(30, 0.07 * M());
    const rings = sight > 0.001 ? [R + edge * 1.2, R + edge * 0.6, R] : [0, 0, 0];
    const desat = 0.6 * (1 - 0.42 * hz), veil = 0.1 * (1 - 0.3 * hz);
    for (const r of rings) {
      ctx.save();
      ctx.beginPath(); ctx.rect(-10, -10, W.w + 20, W.h + 20);
      if (r > 0) ctx.arc(cx, cy, r, 0, TAU, true);
      ctx.clip('evenodd');
      // 陆地：去饱和（天与海是底下的另一张画布，不能这样褪色，只蒙灰）
      landPath(ctx);
      ctx.globalCompositeOperation = 'saturation';
      ctx.globalAlpha = desat * m;
      ctx.fillStyle = 'rgb(128,128,128)';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = veil * m;
      ctx.fillStyle = 'rgb(120,122,128)';
      ctx.fillRect(-10, -10, W.w + 20, W.h + 20);
      // 模糊：一片乳白与几团柔光
      if (hz > 0.01) {
        ctx.globalAlpha = 0.07 * hz * m;
        ctx.fillStyle = 'rgb(236,232,222)';
        ctx.fillRect(-10, -10, W.w + 20, W.h + 20);
      }
      ctx.restore();
    }
    if (hz > 0.01) {
      ctx.save();
      if (R > 0) { ctx.beginPath(); ctx.rect(-10, -10, W.w + 20, W.h + 20); ctx.arc(cx, cy, R + edge * 0.6, 0, TAU, true); ctx.clip('evenodd'); }
      for (let i = 0; i < 16; i++) {
        const a = hsh(i + 40) * TAU + S.clock * 0.04, rr = hsh(i + 41);
        const x = (0.45 + 0.55 * hsh(i + 43)) * W.w + Math.cos(a) * 0.03 * W.w, y = (0.62 + 0.3 * rr) * W.h + Math.sin(a) * 0.02 * W.h;
        glow(ctx, 'm', x, y, M() * (0.05 + 0.05 * hsh(i + 42)), 0.22 * hz * m, M() * (0.08 + 0.05 * hsh(i + 44)));
      }
      ctx.restore();
    }
    // 颜色绽放的前沿：只在绽放的那一刻有一圈淡淡的虹彩
    const moving = Math.abs((W.lt.mcSight || 0) - sight) > 0.002;
    if (moving && sight > 0.001 && R > 2) {
      const HUES = [[255, 150, 140], [255, 214, 130], [236, 240, 150], [150, 230, 170], [140, 196, 255], [200, 160, 255]];
      ctx.globalCompositeOperation = 'lighter';
      const lw = Math.max(1.5, 0.004 * M());
      ctx.lineWidth = lw;
      HUES.forEach((c, i) => {
        ctx.strokeStyle = rgba(c, 0.16 * m);
        ctx.beginPath(); ctx.arc(cx, cy, Math.max(1, R + edge * 0.3 - i * lw * 1.2), 0, TAU); ctx.stroke();
      });
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光
  // ════════════════════════════════════════════════════════════
  function drawFXL(ctx) {
    for (const e of FXL) {
      const q = c01(e.t / e.dur), env = Math.sin(Math.PI * q);
      if (e.type === 'beam') {
        // 父的光：自天上落在主身上
        const f = fpos(e.id); if (!f) continue;
        ctx.globalCompositeOperation = 'lighter';
        beam(ctx, f.x, 0, f.y + 4, f.h * 3.4, 0.3 * env);
        glow(ctx, 'w', f.x, f.y - f.h * 0.6, f.h * 1.5, 0.35 * env);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'thread') {
        // 能力从他身上出去：一线光自衣裳䍁子流到她身上
        const a = fpos(e.from), b = fpos(e.to); if (!a || !b) continue;
        const ax = a.x, ay = a.y - a.h * 0.12, bx = b.x + (b.p && b.p.facing > 0 ? 1 : -1) * b.h * 0.18, by = b.y - b.h * 0.35;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba([255, 236, 190], 0.7 * env);
        ctx.lineWidth = Math.max(1, a.h * 0.025);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + bx) / 2, Math.min(ay, by) - a.h * 0.15, bx, by); ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const t = U.fract(q * 2.2 + i / 4), x = lerp(ax, bx, t), y = lerp(ay, by, t) - Math.sin(Math.PI * t) * a.h * 0.15;
          glow(ctx, 'w', x, y, a.h * 0.12, 0.8 * env);
        }
        glow(ctx, 'g', bx, by, b.h * 0.9, 0.5 * env);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'sound') {
        // 以法大：一圈圈声音的光
        const f = fpos(e.id); if (!f) continue;
        const cx = f.x, cy = f.y - f.h * 0.85;
        ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 4; k++) {
          const qq = q * 1.25 - k * 0.12; if (qq <= 0 || qq >= 1) continue;
          const r = f.h * (0.35 + 3.2 * qq);
          ctx.lineWidth = Math.max(1, f.h * 0.05 * (1 - qq));
          ctx.strokeStyle = rgba([255, 236, 190], 0.4 * (1 - qq) * (1 - qq));
          ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.7, 0, 0, TAU); ctx.stroke();
          glow(ctx, 'g', cx, cy, r * 0.9, 0.08 * (1 - qq), r * 0.6);
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'clean') {
        // 洁净：一道自上而下的白光
        const f = fpos(e.id); if (!f) continue;
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'w', f.x, f.y - f.h * 0.5, f.h * (0.8 + 1.4 * q), 0.9 * env);
        beam(ctx, f.x, f.y - f.h * 2.5, f.y + 2, f.h * 1.1, 0.6 * env);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'ripple') {
        const s = e.s || 1;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba([220, 234, 252], 0.6 * (1 - q));
        ctx.lineWidth = Math.max(0.8, 1.2 * s);
        ctx.beginPath(); ctx.ellipse(e.x, e.y, (6 + 40 * q) * s, (1.5 + 8 * q) * s, 0, 0, TAU); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'hush') {
        // 闷静散开（以法大一刻）
        const f = fpos(e.id); if (!f) continue;
        glow(ctx, 'd', f.x, f.y - f.h * 0.8, f.h * (0.7 + 2 * q), 0.5 * (1 - q));
      }
    }
    ctx.globalAlpha = 1;
  }
  // 麻风的灰影；聋子身边的闷静；山上祷告的光
  function drawAuras(ctx) {
    const lp = L('mcLeper');
    if (lp > 0.01 && has('leper')) {
      const f = fpos('leper');
      if (f) for (let i = 0; i < 5; i++) glow(ctx, 's', f.x + Math.sin(S.clock * 0.6 + i * 1.3) * f.h * 0.2, f.y - f.h * (0.3 + 0.13 * i), f.h * 0.42, 0.22 * lp);
    }
    const hs = L('mcHush');
    if (hs > 0.01 && has('deaf')) {
      const f = fpos('deaf');
      if (f) { glow(ctx, 'd', f.x, f.y - f.h * 0.82, f.h * 0.75, 0.55 * hs); glow(ctx, 's', f.x, f.y - f.h * 0.82, f.h * 0.45, 0.35 * hs); }
    }
    const pr = L('mcPray');
    if (pr > 0.01) {
      const f = fpos('jesus');
      if (f) {
        ctx.globalCompositeOperation = 'lighter';
        beam(ctx, f.x, 0, f.y + 3, f.h * 1.7, 0.32 * pr);
        glow(ctx, 'w', f.x, f.y - f.h * 0.5, f.h * 1.2, 0.3 * pr);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    sinkClipOff();     // 万一上一帧裁剪没有复原（本不该发生）
    const k = dt * (W.fast || 1);
    S.clock += k;
    if (!cur()) { if (FXL.length) FXL.length = 0; return; }
    for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += k; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    if (W.replaying) return;
    const f = fx(); if (!f) return;
    const u = boatU();
    // 浪打进船里：船头溅起水花
    const st = stormK();
    if (st > 0.3 && L('mcBoatA') > 0.5) {
      S.sprayAcc += k * 9 * st;
      const P = boatPos(), R = boatRoll();
      while (S.sprayAcc > 1) {
        S.sprayAcc -= 1;
        f.add({ x: P.x - 2.3 * u + rnd(-0.2, 0.3) * u, y: P.y + R.bob * u - 0.2 * u, vx: rnd(-40, 70) * u / 40, vy: -rnd(60, 160) * u / 40, max: rnd(0.5, 1.1),
          size: rnd(0.9, 1.9), c: [220, 234, 250], drag: 0.8, grav: 260 * u / 40, a: 0.8, pass: 'air' });
      }
    }
    // 海面上行走：一步一圈涟漪
    const back = L('mcBack') > 0.001 && L('mcBack') < 0.999;
    const walking = (L('mcWalk') > 0.001 && L('mcWalk') < 0.999) || (L('mcPeter') > 0.001 && L('mcPeter') < 0.999 && !S.aboard.peter) || back;
    if (walking) {
      S.rippleAcc += k * 1.6;
      while (S.rippleAcc > 1) {
        S.rippleAcc -= 1;
        for (const id of ['jesus', 'peter']) {
          if (S.aboard[id]) continue;
          const on = back || (id === 'jesus' ? L('mcWalk') > 0.001 && L('mcWalk') < 0.999 : L('mcPeter') > 0.001 && L('mcPeter') < 0.999);
          if (!on) continue;
          const p = fpos(id); if (p) FXL.push({ type: 'ripple', x: p.x, y: p.y + 1, s: p.h / 40, t: 0, dur: 1.6 });
        }
      }
    }
    // 饼的光：自主手中流向众人
    const br = L('mcBread');
    if (br > 0.02 && br < 0.995) {
      S.breadAcc += k * 10;
      const J = fpos('jesus');
      while (S.breadAcc > 1 && J) {
        S.breadAcc -= 1;
        const rows = X('rows'), r = rows[(Math.random() * rows.length) | 0];
        const tx = rnd(r[0], Math.min(r[1], r[0] + (r[1] - r[0]) * Math.min(1, br * 1.6))) * W.w, ty = fieldY(tx / W.w, r[2]) - H2() * 0.4;
        const sx = J.x + J.h * 0.15, sy = J.y - J.h * 0.55, T0 = rnd(1.1, 1.8);
        f.add({ x: sx, y: sy, vx: (tx - sx) / T0, vy: (ty - sy) / T0 - 60, max: T0, size: rnd(1.2, 2.2), c: [255, 216, 140], drag: 0, grav: 60 / T0 * 2, a: 0.9, pass: 'air', twinkle: true });
      }
    }
    // 以法大之后：鸟飞起歌唱
    if (S.birdAcc > 0) {
      S.birdAcc -= k;
      if (Math.random() < k * 3) sfx(null, 'bird', { soft: true, x: rnd(0.5, 0.95) });
    }
  }

  function drawUnder(ctx, pass) {
    if (pass === 'air') sinkClipOff();     // 人已画完：复原裁剪
    if (!cur()) return;
    if (pass === 'mid') {
      const t = L('mcTown');
      if (t > 0.01) safe('mc.syn', () => drawSynagogue(ctx, t));
      safe('mc.deca', () => drawDeca(ctx));
      safe('mc.many', () => drawMany(ctx));
      return;
    }
    if (pass === 'near') {
      safe('mc.tombs', () => drawTombs(ctx));
      const t = L('mcTown');
      if (t > 0.01) { for (const k of ['houseA', 'houseC', 'houseB']) safe('mc.house', () => drawHouse(ctx, k, t)); }
      safe('mc.bed', () => drawBed(ctx));
      return;
    }
    if (pass === 'air') {
      // 船上有人：近侧的船舷画在人之后，遮住他们的膝下
      if (anyAboard()) safe('mc.boatFront', () => drawBoatFront(ctx));
    }
  }
  function draw(ctx, pass) {
    if (!cur()) return;
    if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') {
      safe('mc.waves', () => drawWaves(ctx, pass));
      safe('mc.mirror', () => drawMirror(ctx, pass));
      safe('mc.fleet', () => drawFleet(ctx, pass));
      if (pass === 'seaNear' || pass === 'seaMid') safe('mc.boatShadow', () => { if (W.seaBand(boatPos().y) === pass) drawBoatShadow(ctx); });
      if (pass === 'seaNear') safe('mc.calm', () => drawCalmFront(ctx));
      return;
    }
    if (pass === 'near') {
      safe('mc.boatBack', () => drawBoatBack(ctx));
      if (!anyAboard()) safe('mc.boatFront', () => drawBoatFront(ctx));
      safe('mc.mat', () => drawLoweredMat(ctx));
      safe('mc.baskets', () => drawBaskets(ctx));
      // 最后：彼得沉下时，裁去他脚下水里的一小块（紧接着 cast 画人；下一层之初复原）
      safe('mc.sinkClip', () => sinkClipOn(ctx));
      return;
    }
    if (pass === 'air') {
      safe('mc.seaLights', () => drawSeaLights(ctx));
      safe('mc.sink', () => drawSinkWater(ctx));
      safe('mc.loaves', () => drawLoaves(ctx));
      safe('mc.shadow', () => drawShadow(ctx));
      safe('mc.auras', () => drawAuras(ctx));
      safe('mc.fxl', () => drawFXL(ctx));
      safe('mc.rain', () => drawRain(ctx));
      return;
    }
    if (pass === 'top') safe('mc.mute', () => drawMute(ctx));
  }

  function pick(x, y, r) {
    if (!cur()) return null;
    let best = null;
    const test = (label, cx, cy, top, rad) => {
      if (!isFinite(cx) || !isFinite(cy)) return;
      const d = Math.max(0, Math.hypot(cx - x, cy - y) - (rad || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: cx, y: top, d };
    };
    const s = H2();
    if (L('mcBoatA') > 0.5) { const P = boatPos(), u = boatU(); test('船', P.x, P.y - 0.5 * u, P.y - 2 * u, 1.6 * u); }
    if (L('mcTown') > 0.5) {
      for (const k of ['houseA', 'houseB', 'houseC']) {
        const G = houseG(k); if (!G) continue;
        const label = S.town === 'beth' ? '伯赛大' : k === 'houseB' ? '西门的家' : k === 'houseA' ? '睚鲁的家' : '迦百农';
        test(label, G.x, G.y - G.hh * 0.5, G.top - G.slab, G.w * 0.3);
      }
      const sx = X('syn'); if (sx != null) { const gx = sx * W.w; test('会堂', gx, gYb(gx, 1) - H1(), gYb(gx, 1) - 2.2 * H1(), 1.2 * H1()); }
    }
    if (L('mcMatA') > 0.5) { const P = matPt(); if (P) test('褥子', P[0], P[1], P[1] - 0.2 * s, 0.4 * s); }
    if (L('mcGerasa') > 0.5) { const tx = lerp(X('tomb0'), 1, 0.5) * W.w; test('坟茔', tx, gYb(Math.min(tx, W.w)) - s, gYb(Math.min(tx, W.w)) - 1.8 * s, 1.2 * s); }
    if (L('mcBasket') > 0.5) { const P = basketPt(); test('五饼二鱼', P[0], P[1], P[1] - 0.3 * s, 0.25 * s); }
    if (L('mcBaskets') > 0.5) { const sp = basketSpots(); const m = sp[3]; const bx = m[0] * W.w, by = fieldY(m[0], m[1]); test('十二个篮子', bx, by, by - 0.4 * s, 0.1 * W.w); }
    if (L('mcDeca') > 0.5) { const dx = (tall() ? 0.78 : 0.86) * W.w; test('低加坡里', dx, gYb(dx, 1) - H1(), gYb(dx, 1) - 2 * H1(), 1.5 * H1()); }
    if (L('mcMany') > 0.5) { const mx = 0.8 * W.w; test('五千人', mx, gYb(mx, 1), gYb(mx, 1) - H1(), 0.12 * W.w); }
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  function ring(c, rgb) { if (!c.instant) safe('miracles.ring', () => fx().ring(c.x, c.y, rgb || TINT, Math.min(W.w, W.h) * 0.3, 1.8, 1.5)); }
  function flashAt(b, id, rgb, n) {
    if (inst(b)) return;
    const f = fpos(id); if (!f) return;
    safe('mc.flash', () => {
      fx().ring(f.x, f.y - f.h * 0.5, rgb || [255, 248, 232], f.h * 3, 1.6, 1.4);
      fx().sparkle(f.x, f.y - f.h * 0.5, n || 30, rgb || [255, 248, 232], f.h * 0.4, 'air');
    });
  }
  function dust(b, x, y, n, rgb, sp) { if (!inst(b)) safe('mc.dust', () => fx().dust(x, y, n || 20, rgb || [200, 186, 160], sp || 10, 'near')); }
  function bolt(b, x, near) { if (!inst(b) && GS.weather && GS.weather.bolt) safe('mc.bolt', () => GS.weather.bolt({ x, near: !!near })); }
  function names(b, str, x, y, rgb) {
    if (inst(b)) return;
    const size = Math.max(0.034 * M(), 16);
    safe('mc.name', () => fx().nameStr(str, x, y, size, rgb || [255, 230, 180], () => [x + rnd(-40, 40), y + rnd(-10, 30)], { hold: 3.4 }));
  }
  // 主与四个门徒
  const DISC = ['peter', 'john', 'andrew', 'james'];
  function twelve() {
    const R = (C() && C().DISCIPLE_ROBES) || [[122, 104, 84], [104, 92, 80], [138, 116, 92], [96, 104, 118]];
    addLook('jesus', 'jesus', { x: X('jesus0'), facing: 1, from: 'none' });
    addLook('peter', 'peter', { x: X('peter0'), facing: 1, from: 'none' });
    addLook('john', 'john', { x: X('john0'), facing: 1, from: 'none' });
    addLook('andrew', 'disciple', { label: '安得烈', robe: R[0], x: X('andrew0'), facing: 1, from: 'none' });
    addLook('james', 'disciple', { label: '雅各', robe: R[3], x: X('james0'), facing: 1, from: 'none' });
  }
  function boardAll(b, list) {
    (list || [['jesus', 'stern'], ['peter', 0], ['john', 1], ['andrew', 2], ['james', 3]]).forEach(([id, slot]) => board(id, slot));
  }
  // 下船：各人站到岸上（x 由近到远）
  function landAll(b, xs) {
    const ids = ['jesus', 'peter', 'john', 'andrew', 'james'];
    const coast = X('coast');
    ids.forEach((id, i) => {
      if (S.aboard[id] == null || xs[i] == null) return;
      // 下船之处：船在岸边的海湾里（横屏）就在各自的位子上；船在开阔的海上（竖屏）就在岸边
      const at = coast != null ? coast + i * 0.012 : clamp(deckPt(S.aboard[id])[0] / W.w, 0.47, 0.98);
      unboard(id, at, b);
      walk(id, xs[i], { speed: 0.04 });
    });
  }
  function toTown(b, on) { lv('mcTown', on ? 1 : 0, b); }

  // ════════════════════════════════════════════════════════════
  //  布置
  // ════════════════════════════════════════════════════════════
  function setup() {
    S = fresh();
    FXL.length = 0;
    const base = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.9, herbs: 0.7, trees: 0.24,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in base) if (W.hasLevel(k)) W.set(k, base[k], true);
    for (const k of MY) W.set(k, 0, true);
    for (const k of ['rain', 'storm', 'gale', 'hail', 'gloom']) if (W.hasLevel(k)) W.set(k, 0, true);
    W.set('bare', 0.06, true); W.set('bloom', 0.75, true);
    W.set('mcTown', 1, true); W.set('mcBoatA', 1, true); W.set('mcBoat', 1, true);
    boatAt('moor');
    // 树从右边的高处长起：海湾前不挡船
    const ox = W.w * 0.72, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy);
    W.setOrigin('trees', W.w * 0.995, W.ridgeBaseY(2, W.w * 0.995));
    W.freeClock = false;
    W.goTo(0.34, 0, true);
    W.setPop('fish', 90, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.2, W.h * 0.8, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, ox, oy, true);
    W.setPop('beast', 0, ox, oy, true);
    W.setPop('creeper', 6, ox, oy, true);
    W.setPop('human', 0, ox, oy, true);
    const c = C();
    c.clear({ fade: false });
    twelve();
    crowd('vil', { n: 5, x0: X('vil')[0], x1: X('vil')[1], label: '迦百农人', from: 'none' });
    avoid([[0.4, 1]]);
  }

  // ════════════════════════════════════════════════════════════
  //  十三句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 一 · 马可福音 1：长大麻风的 ──────────────────────────────
    {
      kind: 'cmd', utter: '我肯，你洁净了吧！', cmd: 'chmod +clean 长大麻风的  # 我肯', ref: '马可福音 1:41', tint: TINT_1,
      verse: [
        { text: '有一个长大麻风的来求耶稣，向他跪下，说：「你若肯，必能叫我洁净了。」', ref: '马可福音 1:40', hold: 6.5 },
        { text: '耶稣动了慈心，就伸手摸他，说：「我肯，你洁净了吧！」<br>大麻风即时离开他，他就洁净了。', ref: '马可福音 1:41–42', hold: 7 },
        { text: '那人出去，倒说许多的话，把这件事传扬开了……人从各处都就了他来。', ref: '马可福音 1:45', hold: 6.5 },
      ],
      apply(c) {
        ring(c, TINT_1);
        T(c, [
          [0, b => {
            time(0.42, 20, b);
            add('leper', { label: '长大麻风的', sex: 'm', x: X('leperFrom'), v: 0.1, facing: -1, robe: ROBE.leper, accent: [120, 118, 112], hair: 'cloth', beard: true, glow: 0.04 });
            lv('mcLeper', 1, b);
            walk('leper', X('leperAt'), { speed: 0.052, pose: 'kneel' });
            crowdFaceX('vil', X('leperAt'));
          }],
          [2.5, b => { face('jesus', 1); DISC.forEach(id => face(id, 1)); walk('peter', X('peter0') - 0.012, { speed: 0.02 }); }],
          [7.2, b => { pose('leper', 'pray'); }],
          [8.2, b => { walk('jesus', X('touch'), { speed: 0.02, pose: 'point' }); }],
          [9.8, b => {
            // 洁白的衣，一条灰蓝的腰带（与主的麻衣分得开）；光只在洁净的一刻亮
            add('leper', { robe: ROBE.clean, accent: [104, 128, 162], glow: 0.42, label: '得洁净的人' });
            lv('mcLeper', 0, b);
            addFX(b, { type: 'clean', id: 'leper', dur: 2.4 });
            flashAt(b, 'leper', [255, 250, 238], 40);
            sfx(b, 'harp'); sfx(b, 'chime', { soft: true });
          }],
          [11.4, b => { pose('jesus', 'stand'); pose('leper', 'stand'); glowP('leper', 0.2); walk('leper', X('leperAt') + 0.024, { speed: 0.02 }); }],
          [12.8, b => { face('leper', -1); pose('leper', 'raise'); }],
          [16.4, b => {
            run('leper', 1.08, {});
            crowd('cap', { n: 9, x0: 0.98, x1: 1.12, label: '众人' });
            forward('cap', 0.28, 0.16);
            crowdWalk('cap', X('capIn')[0], X('capIn')[1], { speed: 0.03 });
            crowdWalk('vil', X('vil')[0] + 0.02, X('vil')[1] + 0.03, { speed: 0.02 });
            sfx(b, 'crowd', { soft: true });
          }],
          [20.5, b => { rm('leper'); crowdFaceX('cap', X('jesus0')); crowdFaceX('vil', X('jesus0')); }],
        ]);
      },
    },
    // ── 二 · 马可福音 2：拆通房顶 ────────────────────────────────
    {
      kind: 'cmd', utter: '起来！拿你的褥子回家去吧', cmd: 'rm -r 房顶 && mv 褥子 ~/家', ref: '马可福音 2:11', tint: TINT_1,
      verse: [
        { text: '耶稣又进了迦百农。人听见他在房子里，<br>就有许多人聚集，甚至连门前都没有空地', ref: '马可福音 2:1–2', hold: 5.5 },
        { text: '有人带着一个瘫子来见耶稣，是用四个人抬来的；<br>因为人多，不得近前，就把耶稣所在的房子，拆了房顶……把瘫子连所躺卧的褥子都缒下来。', ref: '马可福音 2:3–4', hold: 7.5 },
        { text: '耶稣见他们的信心，就对瘫子说：「小子，你的罪赦了。」', ref: '马可福音 2:5', hold: 5.5 },
        { text: '「我吩咐你，起来！拿你的褥子回家去吧。」<br>那人就起来，立刻拿着褥子，当众人面前出去了，以致众人都惊奇，归荣耀与神', ref: '马可福音 2:11–12', hold: 8 },
      ],
      apply(c) {
        ring(c, TINT_1);
        T(c, [
          [0, b => {
            time(0.45, 12, b);
            rm('leper', true);
            walk('jesus', X('jesusIn'), { speed: 0.03 });
            walk('peter', X('houseB') - 0.058, { speed: 0.035 }); walk('john', X('houseB') - 0.075, { speed: 0.035 });
            walk('andrew', X('ajAt')[0], { speed: 0.035 }); walk('james', X('ajAt')[1], { speed: 0.035 });
            crowdWalk('cap', X('crowdR')[0] + 0.03, X('crowdR')[1], { speed: 0.03 });
            crowdWalk('vil', X('crowdL')[0], X('crowdL')[1], { speed: 0.03 });
            crowd('door', { n: 3, x0: X('houseB') - 0.058, x1: X('houseB') - 0.03, label: '众人', v: 0.3, mill: false });
            crowd('door2', { n: 3, x0: X('houseB') + 0.042, x1: X('houseB') + 0.07, label: '众人', v: 0.3, mill: false });
            // 四个人抬着瘫子
            const x0 = 1.02, sp = 0.028;
            [['b1', -0.022, 0], ['b2', 0.022, 0], ['b3', -0.015, 0.12], ['b4', 0.028, 0.12]].forEach(([id, dx, v]) => {
              add(id, { label: '抬褥子的人', sex: 'm', x: x0 + dx, facing: -1, v, robe: [[124, 100, 80], [104, 92, 78], [140, 112, 86], [98, 88, 80]][BEARERS.indexOf(id)], pose: 'carry', beard: true });
              walk(id, X('bearAt') + dx, { speed: sp, pose: 'carry' });
            });
            add('para', { label: '瘫子', sex: 'm', x: x0, facing: -1, pose: 'lie', robe: ROBE.para, glow: 0.08 });
            const cst = C(); if (cst && cst.attach) cst.attach('para', () => { const P = matPt(); return P ? [P[0], P[1] - 0.02 * H2()] : null; });
            lv('mcMatA', 1, b); W.set('mcMat', 0, true); W.set('mcRoof', 0, true);
          }],
          [8.2, b => {
            // 绕到外梯
            const st = stairG(); if (!st) return;
            BEARERS.forEach((id, i) => walk(id, (st.x1 + (0.2 + i * 0.25) * H2()) / W.w, { speed: 0.03, pose: 'carry' }));
          }],
          [10.2, b => {
            // 上房顶：先沿外梯上到房顶的一角
            const st = stairG(); if (!st) return;
            const ry = roofY() / W.h, s = H2();
            BEARERS.forEach((id, i) => {
              const cst = C(); const p = person(id); if (!cst || !p) return;
              p.v = 0;
              cst.fly(id, (st.x0 - (0.1 + i * 0.22) * s) / W.w, ry, { dur: 1.3 + i * 0.25, pose: 'walk' });
            });
          }],
          [12, b => {
            // 再沿房顶走到拆房顶的地方，跪下
            const G = houseG('houseB'); if (!G) return;
            const ry = roofY() / W.h, s = H2();
            const spots = [G.x - 1.05 * s, G.x - 0.65 * s, G.x + 0.55 * s, G.x + 0.95 * s];
            BEARERS.forEach((id, i) => { const cst = C(); if (cst && person(id)) { pose(id, 'walk'); cst.fly(id, spots[i] / W.w, ry, { dur: 1.3, pose: 'kneel' }); } });
          }],
          [13.6, b => {
            lv('mcRoof', 1, b);
            const G = houseG('houseB'); if (G) dust(b, G.x - 0.1 * H2(), roofY(), 30, [176, 150, 118], 0.4 * H2());
            sfx(b, 'build', { soft: true });
          }],
          [14.6, b => { lv('mcMat', 1, b); face('jesus', -1); }],
          [16.2, b => { glowP('para', 0.45); flashAt(b, 'para', [255, 236, 200], 16); sfx(b, 'harp', { soft: true }); }],
          [22.6, b => {
            const cst = C(); if (cst && cst.attach) cst.attach('para', null);
            const P = matPt(); if (P) { const p = person('para'); if (p) { p.nx = P[0] / W.w; p.ny = null; } }
            pose('para', 'stand');
            flashAt(b, 'para', [255, 248, 232], 26);
            sfx(b, 'chime');
          }],
          [24.2, b => { lv('mcMatA', 0, b); const cst = C(); if (cst && cst.prop) cst.prop('para', 'bundle'); }],
          [25, b => {
            walk('para', 1.08, { speed: 0.04 });
            crowdPose('cap', 'raise'); crowdPose('vil', 'raise'); crowdPose('door', 'raise'); crowdPose('door2', 'raise');
            BEARERS.forEach(id => pose(id, 'raise'));
            sfx(b, 'crowd');
          }],
          [29.5, b => { rm('para'); }],
        ]);
      },
    },
    // ── 三 · 马可福音 3—4：我们渡到那边去吧 ─────────────────────
    {
      kind: 'call', utter: '我们渡到那边去吧', cmd: 'git push origin 那边  # 也有别的船和他同行', ref: '马可福音 4:35', tint: TINT_SEA,
      verse: [
        { text: '他因为人多，就吩咐门徒叫一只小船伺候着，免得众人拥挤他。', ref: '马可福音 3:9', hold: 6 },
        { text: '当那天晚上，耶稣对门徒说：「我们渡到那边去吧。」<br>门徒离开众人，耶稣仍在船上，他们就把他一同带去；也有别的船和他同行。', ref: '马可福音 4:35–36', hold: 7.5 },
        { text: '忽然起了暴风，波浪打入船内，甚至船要满了水。', ref: '马可福音 4:37', hold: 5.5 },
        { text: '耶稣在船尾上，枕着枕头睡觉。门徒叫醒了他，说：<br>「夫子！我们丧命，你不顾吗？」', ref: '马可福音 4:38', hold: 7 },
      ],
      apply(c) {
        ring(c, TINT_SEA);
        T(c, [
          [0, b => {
            time(0.73, 16, b);
            BEARERS.forEach(id => rm(id)); rm('para');
            lv('mcMatA', 0, b);
            crowdRm('door'); crowdRm('door2');
            walk('jesus', X('boardAt'), { speed: 0.04 });
            // 门徒等在船头之外（不站进船身里：主上船以后，近侧的船舷画在人之后）
            DISC.forEach((id, i) => walk(id, X('waitAt') + X('waitDir') * i * 0.014, { speed: 0.04 }));
            crowdWalk('cap', X('shore')[0] + 0.06, X('shore')[1], { speed: 0.03 });
            crowdWalk('vil', X('shore')[0], X('shore')[0] + 0.06, { speed: 0.03 });
            lv('mcLamp', 1, b);
          }],
          [4.6, b => { board('jesus', 'stern'); pose('jesus', 'seat'); face('jesus', -1); crowdFaceX('cap', X('moor')[0]); crowdFaceX('vil', X('moor')[0]); }],
          // 门徒离开众人：一个个跨进船里（走上甲板，再随船）
          [7.8, b => {
            const slots = [0, 1, 2, 3], cst = C();
            DISC.forEach((id, i) => { if (cst && cst.fly && person(id)) { pose(id, 'walk'); const q = deckPt(slots[i]); cst.fly(id, q[0] / W.w, q[1] / W.h, { dur: 1.0 + i * 0.18, pose: 'stand' }); } });
            toTown(b, false);
          }],
          [9.2, b => { boardAll(b, [['peter', 0], ['john', 1], ['andrew', 2], ['james', 3]]); DISC.forEach(id => { pose(id, 'stand'); face(id, 1); }); }],
          [9.8, b => {
            lv('mcSail', 1, b); lv('mcFleet', 1, b);
            boatTo('sea', b);
            crowdPose('cap', 'raise');
            sfx(b, 'wave', { soft: true });
          }],
          [11, b => { crowdRm('cap'); crowdRm('vil'); DISC.forEach(id => pose(id, 'seat')); lv('storm', 0.55, b); lv('clouds', 0.85, b); }],
          [15, b => { W.set('mcRoof', 0, true); }],
          [13, b => { pose('jesus', 'lie'); }],
          [15.6, b => {
            lv('storm', 0.9, b); lv('gale', 0.8, b); lv('rain', 0.32, b); lv('clouds', 1, b); lv('mcStorm', 1, b);
            time(0.03, 9, b);
            lv('mcLamp', 0, b);
            sfx(b, 'thunder'); sfx(b, 'wind');
          }],
          [16.6, b => { bolt(b, 0.72); }],
          [17.4, b => { lv('mcSail', 0, b); lv('mcRow', 1, b); sfx(b, 'wave'); }],
          [18.8, b => { DISC.forEach(id => pose(id, 'raise')); }],
          [20.2, b => { bolt(b, 0.56, true); sfx(b, 'wave'); }],
          [23.4, b => { pose('john', 'kneel'); pose('andrew', 'raise'); }],
          [25.2, b => { pose('peter', 'point'); face('peter', 1); bolt(b, 0.84); }],
          [28.4, b => { sfx(b, 'wave'); }],
        ]);
      },
    },
    // ── 四 · 马可福音 4：住了吧！静了吧！★ ──────────────────────
    {
      kind: 'cmd', utter: '住了吧！静了吧！', cmd: 'kill -STOP 风 && echo 平静 > 海', ref: '马可福音 4:39', tint: TINT_SEA, hold: 3.2,
      verse: [
        { text: '耶稣醒了，斥责风，向海说：「住了吧！静了吧！」<br>风就止住，大大地平静了。', ref: '马可福音 4:39', hold: 8 },
        { text: '耶稣对他们说：「为什么胆怯？你们还没有信心吗？」', ref: '马可福音 4:40', hold: 5.5 },
        { text: '他们就大大地惧怕，彼此说：<br>「这到底是谁，连风和海也听从他了。」', ref: '马可福音 4:41', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { pose('jesus', 'stand'); face('jesus', -1); time(0.08, 22, b); }],
          // 他醒了，斥责风：光在他身上亮起来（看得见是谁在船上说话）
          [1.6, b => { pose('jesus', 'raise'); glowP('jesus', 0.62); }],
          [2.4, b => {
            const P = boatPos();
            S.calmX = P.x / W.w; S.calmY = P.y / W.h;
            W.set('mcCalm', 0, true); lv('mcCalm', 1, b);
            lv('mcStorm', 0, b); lv('storm', 0, b); lv('gale', 0, b); lv('rain', 0, b); lv('clouds', 0.25, b); lv('mcRow', 0, b);
            lv('mcMirror', 1, b);
            if (!inst(b)) { const f = fpos('jesus'); if (f) safe('mc.calmRing', () => { fx().ring(f.x, f.y - f.h * 0.6, [214, 232, 255], f.h * 5, 2.4, 1.2); fx().sparkle(f.x, f.y - f.h * 0.7, 36, [230, 240, 255], f.h * 0.5, 'air'); }); }
            sfx(b, 'whisper'); sfx(b, 'harp');
          }],
          [5.2, b => { pose('jesus', 'stand'); DISC.forEach(id => pose(id, 'stand')); }],
          [9.5, b => { face('jesus', -1); glowP('jesus', 0.48); }],
          [16.3, b => { pose('john', 'kneel'); }],
          [17.2, b => { pose('andrew', 'kneel'); pose('james', 'kneel'); }],
          [18.4, b => { pose('peter', 'bow'); }],
          [22, b => { glowP('jesus', LOOK().jesus ? LOOK().jesus.glow : 0.32); }],
        ]);
      },
    },
    // ── 五 · 马可福音 5：格拉森 ──────────────────────────────────
    {
      kind: 'cmd', utter: '污鬼啊，从这人身上出来吧！', cmd: 'kill -9 群  # 他坐着，穿上衣服，心里明白过来', ref: '马可福音 5:8', tint: [236, 226, 255],
      verse: [
        { text: '他们来到海那边格拉森人的地方。<br>耶稣一下船，就有一个被污鬼附着的人从坟茔里出来迎着他。', ref: '马可福音 5:1–2', hold: 7 },
        { text: '那人常住在坟茔里……铁链竟被他挣断了，脚镣也被他弄碎了……<br>他远远地看见耶稣，就跑过去拜他', ref: '马可福音 5:3–6', hold: 7 },
        { text: '是因耶稣曾吩咐他说：「污鬼啊，从这人身上出来吧！」', ref: '马可福音 5:8', hold: 5.5 },
        { text: '……看见那被鬼附着的人，就是从前被群鬼所附的，<br>坐着，穿上衣服，心里明白过来', ref: '马可福音 5:15', hold: 7 },
      ],
      apply(c) {
        ring(c, [236, 226, 255]);
        T(c, [
          [0, b => {
            time(0.33, 10, b);
            lv('mcFleet', 0, b); lv('mcSail', 1, b); lv('mcMirror', 0, b);
            lv('mcGerasa', 1, b); lv('bare', 0.4, b); lv('bloom', 0.15, b); lv('grass', 0.55, b);
            boatTo('land', b);
            DISC.forEach(id => pose(id, 'stand'));
          }],
          [4, b => {
            lv('mcSail', 0, b);
            landAll(b, [X('demonAt') - 0.03, X('demonAt') - 0.06, X('demonAt') - 0.078, X('demonAt') - 0.094, X('demonAt') - 0.11]);
            ['jesus', ...DISC].forEach(id => { pose(id, 'stand'); face(id, 1); });
          }],
          [4.6, b => {
            add('demon', { label: '被鬼附的人', sex: 'm', x: X('demonFrom'), facing: -1, robe: ROBE.demon, accent: [48, 44, 42], hair: 'long', beard: true, glow: 0, pose: 'raise' });
            lv('mcShadow', 1, b);
            sfx(b, 'chains', { soft: true });
          }],
          [8.6, b => { run('demon', X('demonAt') + 0.018, { pose: 'fall' }); sfx(b, 'wind', { soft: true }); }],
          [11.5, b => { DISC.forEach((id, i) => walk(id, X('demonAt') - 0.075 - i * 0.015, { speed: 0.02 })); }],
          [17, b => { pose('jesus', 'point'); }],
          [17.6, b => {
            lv('mcShadow', 0, b); W.set('mcSmoke', 0, true); lv('mcSmoke', 1, b);
            sfx(b, 'wind'); sfx(b, 'whisper', { soft: true });
          }],
          [19, b => { pose('demon', 'lie'); }],
          [20.8, b => {
            add('demon', { robe: ROBE.clothed, accent: [214, 204, 180], hair: 'short', glow: 0.38, label: '从前被鬼附的人' });
            pose('demon', 'sit'); face('demon', -1);
            flashAt(b, 'demon', [236, 240, 255], 24);
            pose('jesus', 'stand');
            sfx(b, 'harp');
          }],
          [22.4, b => { if (!inst(b)) { const P = X('sea'); FXL.push({ type: 'ripple', x: P[0] * W.w - 0.02 * W.w, y: P[1] * W.h, s: H2() / 30, t: 0, dur: 2.2 }); } }],
          [23.6, b => {
            crowd('gera', { n: 7, x0: 1.02, x1: 1.12, label: '格拉森人' });
            crowdWalk('gera', X('geraFolk')[0], X('geraFolk')[1], { speed: 0.03 });
            sfx(b, 'crowd', { soft: true });
          }],
          [28, b => { crowdFaceX('gera', X('demonAt')); }],
        ]);
      },
    },
    // ── 六 · 马可福音 5：摸他衣裳的女人 ──────────────────────────
    {
      kind: 'bless', utter: '女儿，你的信救了你，平平安安地回去吧！', cmd: 'heal --by faith 女儿 && echo 平安', ref: '马可福音 5:34', tint: TINT_W, hold: 4.2,
      verse: [
        { text: '耶稣坐船又渡到那边去，就有许多人到他那里聚集……<br>有一个管会堂的人，名叫睚鲁，来见耶稣，就俯伏在他脚前', ref: '马可福音 5:21–22', hold: 6.5 },
        { text: '有一个女人，患了十二年的血漏……<br>就从后头来，杂在众人中间，摸耶稣的衣裳', ref: '马可福音 5:25–27', hold: 6 },
        { text: '耶稣顿时心里觉得有能力从自己身上出去，<br>就在众人中间转过来，说：「谁摸我的衣裳？」', ref: '马可福音 5:30', hold: 6 },
        { text: '那女人……来俯伏在耶稣跟前……耶稣对她说：<br>「女儿，你的信救了你，平平安安地回去吧！你的灾病痊愈了。」', ref: '马可福音 5:33–34', hold: 7.5 },
      ],
      apply(c) {
        ring(c, TINT_W);
        T(c, [
          [0, b => {
            time(0.42, 9, b);
            boardAll(b);
            ['jesus', ...DISC].forEach(id => pose(id, 'stand'));
            walk('demon', 1.1, { speed: 0.035 });
            crowdRm('gera');
            lv('mcSail', 1, b);
            boatTo('moor', b);
            lv('mcGerasa', 0, b); lv('bare', 0.06, b); lv('bloom', 0.75, b); lv('grass', 0.9, b);
          }],
          [3.2, b => { toTown(b, true); rm('demon'); }],
          [5, b => {
            lv('mcSail', 0, b);
            landAll(b, [X('landAt'), X('landAt') + 0.02, X('landAt') + 0.036, X('landAt') + 0.05, X('landAt') + 0.064]);
            ['jesus', ...DISC].forEach(id => { pose(id, 'stand'); face(id, -1); });
            crowd('many', { n: 10, x0: X('many')[0] - 0.12, x1: X('many')[0] - 0.02, label: '众人' });
            forward('many', 0.2, 0.2);
            crowdWalk('many', X('many')[0], X('many')[1] - 0.03, { speed: 0.035 });
            add('jairus', { label: '睚鲁', sex: 'm', x: X('houseA'), facing: 1, robe: ROBE.jairus, accent: [226, 220, 204], beard: true, glow: 0.24, prop: null });
            walk('jairus', X('landAt') - 0.02, { speed: 0.05, pose: 'fall' });
          }],
          [8.6, b => {
            pose('jairus', 'stand');
            walk('jairus', X('walkTo') - 0.02, { speed: 0.028 });
            walk('jesus', X('walkTo'), { speed: 0.028 });
            DISC.forEach((id, i) => walk(id, X('walkTo') + 0.015 + i * 0.013, { speed: 0.028 }));
            crowdWalk('many', X('walkTo') + 0.03, X('walkTo') + 0.14, { speed: 0.028 });
            add('woman', { label: '患血漏的女人', sex: 'f', x: X('womanFrom'), v: 0.12, facing: -1, robe: ROBE.woman, accent: [196, 176, 170], hair: 'veil', glow: 0.06 });
            walk('woman', X('walkTo') + 0.018, { speed: 0.036, pose: 'kneel' });
          }],
          [14.2, b => {
            addFX(b, { type: 'thread', from: 'jesus', to: 'woman', dur: 2.6 });
            glowP('woman', 0.42);
            sfx(b, 'chime'); sfx(b, 'harp', { soft: true });
          }],
          [15.6, b => { face('jesus', 1); crowdPose('many', 'stand'); crowdFaceX('many', X('walkTo')); }],
          [19.8, b => { pose('woman', 'fall'); }],
          [23.4, b => { pose('jesus', 'point'); }],
          [24.6, b => {
            pose('woman', 'stand'); pose('jesus', 'stand');
            add('woman', { robe: mix(ROBE.woman, [236, 226, 222], 0.45), glow: 0.5 });
            flashAt(b, 'woman', [255, 236, 210], 22);
            sfx(b, 'harp');
          }],
          [27.4, b => { walk('woman', 1.08, { speed: 0.03 }); }],
        ]);
      },
    },
    // ── 七 · 马可福音 5：睚鲁的女儿 ──────────────────────────────
    {
      kind: 'cmd', utter: '闺女，我吩咐你起来！', cmd: 'wake 闺女  # 孩子不是死了，是睡着了', ref: '马可福音 5:41', tint: TINT_W,
      verse: [
        { text: '还说话的时候，有人从管会堂的家里来，说：<br>「你的女儿死了，何必还劳动先生呢？」', ref: '马可福音 5:35', hold: 6 },
        { text: '耶稣……就对管会堂的说：「不要怕，只要信！」……<br>他们来到管会堂的家里；耶稣看见那里乱嚷，并有人大大地哭泣哀号', ref: '马可福音 5:36–38', hold: 7 },
        { text: '就拉着孩子的手，对她说：「大利大，古米！」<br>（翻出来就是说：「闺女，我吩咐你起来！」）', ref: '马可福音 5:41', hold: 7 },
        { text: '那闺女立时起来走。他们就大大地惊奇；闺女已经十二岁了。', ref: '马可福音 5:42', hold: 6 },
      ],
      apply(c) {
        ring(c, TINT_W);
        T(c, [
          [0, b => {
            time(0.47, 20, b);
            rm('woman');
            add('msg1', { label: '报信的人', sex: 'm', x: X('houseA') + 0.01, facing: 1, robe: [112, 100, 88] });
            run('msg1', X('walkTo') - 0.035, { pose: 'weep' });
            lv('mcBed', 1, b);
            add('girl', { label: '闺女', sex: 'f', age: 'child', x: X('bed'), v: X('bedV'), facing: -1, pose: 'lie', robe: ROBE.girl, hair: 'long', glow: 0.1, from: 'fade' });
            add('mother', { label: '孩子的母亲', sex: 'f', x: X('bed') - 0.022, v: X('bedV') * 0.6, facing: 1, pose: 'weep', robe: ROBE.mother, glow: 0.18 });
          }],
          [3.2, b => { pose('jairus', 'weep'); }],
          [7.6, b => {
            face('jesus', -1); pose('jairus', 'stand');
            walk('jesus', X('bed') + 0.03, { speed: 0.03 });
            walk('jairus', X('bed') + 0.045, { speed: 0.03 });
            walk('peter', X('bed') + 0.06, { speed: 0.03 }); walk('james', X('bed') + 0.074, { speed: 0.03 }); walk('john', X('bed') + 0.088, { speed: 0.03 });
            walk('msg1', X('walkTo') + 0.05, { speed: 0.03 });
            crowd('mourn', { n: 4, x0: X('mourn')[0][0], x1: X('mourn')[0][1], label: '哭泣哀号的人', pose: 'weep', mill: false });
            crowd('mourn2', { n: 3, x0: X('mourn')[1][0], x1: X('mourn')[1][1], label: '哭泣哀号的人', pose: 'weep', mill: false });
            forward('mourn2', 0.18, 0.2);
            sfx(b, 'weep', { soft: true });
          }],
          // 耶稣把他们都撵出去：往岸上的坡地走开、隐去（不走进海里）
          [14.4, b => { crowdWalk('mourn', X('mournOut')[0], X('mournOut')[1], { speed: 0.03 }); crowdWalk('mourn2', X('many')[0] + 0.02, X('many')[1], { speed: 0.03 }); }],
          [14.9, b => { crowdRm('mourn'); }],
          // 他跪在孩子身旁（与她同在褥子前），拉着她的手
          [16, b => {
            const cst = C(), x = X('bed') + 0.009;
            if (cst && cst.fly && person('jesus')) { pose('jesus', 'walk'); cst.fly('jesus', x, fieldY(x, X('bedV') * 0.85) / W.h, { dur: 1.1, pose: 'kneel' }); }
            face('jesus', -1);
          }],
          [16.9, b => { const cst = C(); if (cst && cst.holdHands) cst.holdHands('jesus', 'girl', true); }],
          [17.4, b => {
            flashAt(b, 'girl', [255, 236, 200], 20);
            glowP('girl', 0.4);
            sfx(b, 'harp');
          }],
          [18.6, b => { pose('girl', 'sit'); }],
          [20.6, b => { pose('girl', 'stand'); pose('jesus', 'stand'); lv('mcBed', 0.35, b); }],
          [21.4, b => {
            const cst = C(); if (cst && cst.holdHands) cst.holdHands('jesus', 'girl', false);
            if (cst && cst.fly && person('jesus')) { pose('jesus', 'walk'); cst.fly('jesus', X('bed') + 0.034, null, { dur: 1.0, pose: 'stand' }); }
            face('jesus', -1);
          }],
          [22, b => { pose('mother', 'stand'); const cst = C(); if (cst && cst.embrace) cst.embrace('girl', 'mother', { weep: false }); }],
          [24.2, b => { pose('jairus', 'raise'); pose('peter', 'raise'); pose('john', 'raise'); pose('james', 'raise'); sfx(b, 'chime'); }],
          [28, b => { pose('peter', 'stand'); pose('john', 'stand'); pose('james', 'stand'); }],
        ]);
      },
    },
    // ── 八 · 马可福音 6：你们给他们吃吧 ─────────────────────────
    {
      kind: 'cmd', utter: '你们给他们吃吧', cmd: 'feed --count 5000 --from 五饼二鱼', ref: '马可福音 6:37', tint: TINT_B,
      verse: [
        { text: '他们就坐船，暗暗地往旷野地方去。众人……<br>就从各城步行，一同跑到那里，比他们先赶到了。', ref: '马可福音 6:32–33', hold: 7 },
        { text: '耶稣出来，见有许多的人，就怜悯他们，<br>因为他们如同羊没有牧人一般', ref: '马可福音 6:34', hold: 6 },
        { text: '天已经晚了，门徒进前来……<br>耶稣回答说：「你们给他们吃吧。」', ref: '马可福音 6:35–37', hold: 6.5 },
        { text: '耶稣说：「你们有多少饼，可以去看看。」<br>他们知道了，就说：「五个饼，两条鱼。」', ref: '马可福音 6:38', hold: 6.5 },
      ],
      apply(c) {
        ring(c, TINT_B);
        T(c, [
          [0, b => {
            time(0.6, 14, b);
            ['msg1', 'girl', 'mother', 'jairus'].forEach(id => rm(id));
            crowdRm('mourn2'); crowdRm('many');
            const bx = X('moor')[0] - 0.05;
            walk('jesus', bx, { speed: 0.062 });
            DISC.forEach((id, i) => walk(id, bx - 0.02 - i * 0.012, { speed: 0.062 }));
            lv('mcBed', 0, b);
          }],
          [2, b => { toTown(b, false); }],
          [4.2, b => { boardAll(b); ['jesus', ...DISC].forEach(id => pose(id, 'seat')); face('jesus', -1); }],
          [4.8, b => {
            lv('mcSail', 1, b); boatTo('feed', b);
            lv('grass', 1, b); lv('bloom', 1, b); lv('herbs', 0.9, b);
            crowd('run', { n: 14, x0: 1.04, x1: 1.22, label: '众人' });
            crowdWalk('run', X('rows')[0][0], X('rows')[0][1], { speed: 0.075, run: true });
            sfx(b, 'crowd', { soft: true });
          }],
          [10, b => {
            lv('mcSail', 0, b);
            const j = X('feedJ');
            landAll(b, [j, j - 0.02, j - 0.034, j - 0.048, j - 0.062]);
            ['jesus', ...DISC].forEach(id => { pose(id, 'stand'); face(id, 1); });
            crowdFaceX('run', j); crowdPose('run', 'gaze');
            lv('mcMany', 1, b);
          }],
          [11.5, b => { pose('jesus', 'point'); }],
          [15.8, b => {
            time(0.67, 12, b);
            pose('jesus', 'stand');
            const j = X('feedJ');
            walk('peter', j + 0.016, { speed: 0.02 }); walk('andrew', j - 0.016, { speed: 0.02 });
            face('peter', -1);
          }],
          [19.2, b => { face('jesus', -1); }],
          [23.6, b => {
            const j = X('feedJ');
            add('boy', { label: '孩童', sex: 'm', age: 'child', x: X('rows')[0][0] + 0.06, facing: -1, robe: ROBE.boy, glow: 0.2, pose: 'carry' });
            lv('mcBasket', 1, b); W.set('mcBasketG', 0, true);
            walk('boy', j + 0.03, { speed: 0.03, pose: 'carry' });
            walk('andrew', j + 0.045, { speed: 0.03 });
          }],
          [27, b => {
            face('jesus', 1);
            if (!inst(b)) { const P = basketPt(); names(b, '五饼二鱼', P[0], P[1] - H2() * 1.6, [255, 226, 160]); }
            sfx(b, 'chime', { soft: true });
          }],
        ]);
      },
    },
    // ── 九 · 约翰福音 6：你们叫众人坐下 ──────────────────────────
    {
      kind: 'cmd', utter: '你们叫众人坐下', cmd: 'sort 众人 --by 排 && break 饼 | tee 众人', ref: '约翰福音 6:10', tint: TINT_B,
      verse: [
        { text: '耶稣说：「你们叫众人坐下。」<br>原来那地方的草多，众人就坐下，数目约有五千。', ref: '约翰福音 6:10', hold: 7 },
        { text: '耶稣拿起饼来，祝谢了，就分给那坐着的人；<br>分鱼也是这样，都随着他们所要的。', ref: '约翰福音 6:11', hold: 7 },
        { text: '他们吃饱了，耶稣对门徒说：<br>「把剩下的零碎收拾起来，免得有糟蹋的。」', ref: '约翰福音 6:12', hold: 6 },
        { text: '他们便将那五个大麦饼的零碎，就是众人吃了剩下的，<br>收拾起来，装满了十二个篮子。', ref: '约翰福音 6:13', hold: 6.5 },
      ],
      apply(c) {
        ring(c, TINT_B);
        T(c, [
          [0, b => {
            lv('mcBasketG', 1, b);
            pose('boy', 'stand');
            crowdWalk('run', X('rows')[0][0], X('rows')[0][1], { speed: 0.02, pose: 'sit' });
            X('rows').slice(1).forEach((r, i) => {
              crowd('row' + i, { n: 9, x0: r[0], x1: r[1], label: '众人', v: r[2], pose: 'sit', mill: false });
            });
            lv('mcMany', 1, b);
            sfx(b, 'crowd', { soft: true });
          }],
          [2.2, b => { walk('boy', X('feedJ') + 0.05, { speed: 0.02, pose: 'sit' }); }],
          [8.6, b => {
            pose('jesus', 'gaze');
            addFX(b, { type: 'beam', id: 'jesus', dur: 4.2 });
            sfx(b, 'angel', { soft: true });
          }],
          [11.4, b => {
            pose('jesus', 'point');
            W.set('mcBread', 0, true); lv('mcBread', 1, b);
            lv('mcBasket', 0, b);
            const rows = X('rows');
            walk('peter', lerp(rows[1][0], rows[1][1], 0.3), { speed: 0.03, pose: 'carry' });
            walk('john', lerp(rows[2][0], rows[2][1], 0.55), { speed: 0.03, pose: 'carry' });
            walk('andrew', lerp(rows[0][0], rows[0][1], 0.75), { speed: 0.03, pose: 'carry' });
            walk('james', lerp(rows[3][0], rows[3][1], 0.45), { speed: 0.03, pose: 'carry' });
            sfx(b, 'harp');
          }],
          [13.5, b => { crowdGlow('run', 0.3); }],
          [15.5, b => { crowdGlow('row0', 0.3); crowdGlow('row1', 0.3); }],
          [17.5, b => { crowdGlow('row2', 0.3); pose('jesus', 'stand'); }],
          [18.2, b => {
            const j = X('feedJ');
            walk('peter', j + 0.02, { speed: 0.04 }); walk('john', j - 0.02, { speed: 0.04 }); walk('andrew', j - 0.034, { speed: 0.04 }); walk('james', j - 0.048, { speed: 0.04 });
          }],
          // 「装满了十二个篮子」：随这一行经文装满，名字随即显出（落在篮子旁的草地与水面上，不压在船上）
          [21.4, b => {
            W.set('mcBaskets', 0, true); lv('mcBaskets', 1, b);
            time(0.73, 10, b);
            sfx(b, 'harp', { soft: true });
          }],
          [24.4, b => {
            if (!inst(b)) { const P = basketNamePt(); names(b, '十二个篮子', P[0], P[1], [255, 226, 160]); }
            ['run', 'row0', 'row1', 'row2'].forEach(g => crowdPose(g, 'sit'));
            sfx(b, 'chime');
          }],
        ]);
      },
    },
    // ── 十 · 马太福音 14：是我，不要怕 ───────────────────────────
    {
      kind: 'promise', utter: '你们放心，是我，不要怕！', cmd: 'ping 门徒 # 四更天 · 海面上', ref: '马太福音 14:27', tint: [230, 236, 255],
      verse: [
        { text: '耶稣随即催门徒上船，先渡到那边去……<br>散了众人以后，他就独自上山去祷告。', ref: '马太福音 14:22–23', hold: 7 },
        { text: '那时船在海中，因风不顺，被浪摇撼。<br>夜里四更天，耶稣在海面上走，往门徒那里去。', ref: '马太福音 14:24–25', hold: 7 },
        { text: '门徒看见他在海面上走，就惊慌了，说：「是个鬼怪！」便害怕，喊叫起来。', ref: '马太福音 14:26', hold: 6 },
        { text: '耶稣连忙对他们说：「你们放心，是我，不要怕！」', ref: '马太福音 14:27', hold: 5 },
      ],
      apply(c) {
        ring(c, [230, 236, 255]);
        T(c, [
          [0, b => {
            time(0.95, 13, b);
            lv('mcBaskets', 0, b); lv('mcMany', 0, b); lv('mcBread', 0, b);
            rm('boy');
            ['run', 'row0', 'row1', 'row2'].forEach(g => crowdWalk(g, 1.05, 1.25, { speed: 0.03 }));
            const f = X('feed')[0];
            DISC.forEach((id, i) => walk(id, f + 0.03 + i * 0.012, { speed: 0.04 }));
            walk('jesus', X('mount'), { speed: 0.045, pose: 'kneel' });
          }],
          [3.4, b => { boardAll(b, [['peter', 'stern'], ['john', 1], ['andrew', 2], ['james', 3]]); DISC.forEach(id => { pose(id, 'seat'); face(id, 1); }); }],
          // 船往海中去：停在海湾的开阔处（主从右边的岸上走来，离船尾还远）
          [4, b => { lv('mcSail', 1, b); boatTo('sea2', b); }],
          [7, b => { ['run', 'row0', 'row1', 'row2'].forEach(g => crowdRm(g)); }],
          [8.4, b => {
            pose('jesus', 'pray'); lv('mcPray', 1, b);
            lv('gale', 0.62, b); lv('storm', 0.25, b); lv('clouds', 0.7, b); lv('mcStorm', 0.55, b); lv('mcSail', 0, b); lv('mcRow', 1, b);
            W.set('mcCalm', 0, true);
            sfx(b, 'wind');
          }],
          [11.2, b => { time(0.09, 8, b); }],
          [12.2, b => { lv('mcPray', 0, b); pose('jesus', 'stand'); walk('jesus', X('walk0')[0] + 0.012, { speed: 0.03 }); }],
          [13.6, b => {
            W.set('mcWalk', 0, true); lv('mcWalk', 1, b);
            attachTo('jesus', jesusWaterPt);
            pose('jesus', 'walk'); face('jesus', -1);
            glowP('jesus', 0.7);
            sfx(b, 'wave', { soft: true });
          }],
          [16.8, b => { DISC.forEach(id => pose(id, 'raise')); face('peter', 1); sfx(b, 'crowd', { soft: true }); }],
          [24.4, b => { pose('jesus', 'stand'); flashAt(b, 'jesus', [236, 240, 255], 20); sfx(b, 'harp'); }],
          [25.6, b => { DISC.forEach(id => pose(id, 'stand')); }],
        ]);
      },
    },
    // ── 十一 · 马太福音 14：你来吧 ───────────────────────────────
    {
      kind: 'call', utter: '你来吧', cmd: 'walk 彼得 --on 水面  # 你这小信的人哪', ref: '马太福音 14:29', tint: [230, 236, 255],
      verse: [
        { text: '彼得说：「主，如果是你，请叫我从水面上走到你那里去。」', ref: '马太福音 14:28', hold: 5.5 },
        { text: '耶稣说：「你来吧。」彼得就从船上下去，在水面上走，要到耶稣那里去；', ref: '马太福音 14:29', hold: 6 },
        { text: '只因见风甚大，就害怕，将要沉下去，便喊着说：「主啊，救我！」<br>耶稣赶紧伸手拉住他，说：「你这小信的人哪，为什么疑惑呢？」', ref: '马太福音 14:30–31', hold: 8 },
        { text: '他们上了船，风就住了。<br>在船上的人都拜他，说：「你真是神的儿子了。」', ref: '马太福音 14:32–33', hold: 6.5 },
      ],
      apply(c) {
        ring(c, [230, 236, 255]);
        T(c, [
          [0, b => { pose('peter', 'stand'); face('peter', 1); }],
          // 「你来吧。」
          [5.6, b => { pose('jesus', 'point'); face('jesus', -1); }],
          [6.4, b => {
            delete S.aboard.peter;
            W.set('mcPeter', 0, true); lv('mcPeter', 1, b); W.set('mcSink', 0, true); W.set('mcBack', 0, true);
            attachTo('peter', peterWaterPt);
            pose('peter', 'walk'); face('peter', 1);
          }],
          [7.8, b => { pose('jesus', 'stand'); }],
          // 见风甚大
          [10.6, b => {
            lv('gale', 0.85, b); lv('mcStorm', 0.85, b);
            sfx(b, 'wind'); sfx(b, 'wave');
          }],
          [11, b => { pose('peter', 'stand'); }],
          [12.2, b => { lv('mcSink', 1, b); pose('peter', 'raise'); face('peter', 1); if (!inst(b)) { const f = fpos('peter'); if (f) FXL.push({ type: 'ripple', x: f.x, y: peterWaterY(), s: f.h / 25, t: 0, dur: 1.6 }); } sfx(b, 'splash', { size: 1.5 }); }],
          [16.6, b => { W.set('mcReach', 0, true); lv('mcReach', 1, b); pose('jesus', 'walk'); face('jesus', -1); }],
          // 耶稣赶紧伸手拉住他
          [18.2, b => {
            pose('jesus', 'point');
            const cst = C(); if (cst && cst.holdHands) cst.holdHands('jesus', 'peter', true);
            lv('mcSink', 0, b); pose('peter', 'stand');
            flashAt(b, 'peter', [236, 240, 255], 18);
            sfx(b, 'harp', { soft: true });
          }],
          // 他们一同走回船上（手还拉着）
          [20.6, b => {
            W.set('mcBack', 0, true); lv('mcBack', 1, b);
            face('peter', -1); face('jesus', -1); pose('peter', 'walk'); pose('jesus', 'walk');
          }],
          [23.4, b => { const cst = C(); if (cst && cst.holdHands) cst.holdHands('jesus', 'peter', false); }],
          [23.6, b => {
            board('jesus', 'stern'); board('peter', 0);
            ['mcWalk', 'mcReach', 'mcPeter', 'mcBack', 'mcSink'].forEach(k => W.set(k, 0, true));
            pose('jesus', 'stand'); face('jesus', -1); pose('peter', 'stand');
            lv('gale', 0, b); lv('mcStorm', 0, b); lv('storm', 0, b); lv('clouds', 0.3, b); lv('mcRow', 0, b); lv('mcMirror', 1, b);
            time(0.27, 9, b);
            sfx(b, 'whisper', { soft: true });
          }],
          [25, b => { ['john', 'andrew', 'james'].forEach(id => pose(id, 'kneel')); face('peter', 1); }],
          [26, b => { pose('peter', 'kneel'); glowP('jesus', 0.4); sfx(b, 'harp'); }],
        ]);
      },
    },
    // ── 十二 · 马可福音 7：以法大 ───────────────────────────────
    {
      kind: 'cmd', utter: '以法大！', cmd: 'open 耳朵 舌结  # 开了吧', ref: '马可福音 7:34', tint: [255, 240, 200],
      verse: [
        { text: '耶稣又离了泰尔的境界，经过西顿，就从低加坡里境内来到加利利海。<br>有人带着一个耳聋舌结的人来见耶稣，求他按手在他身上。', ref: '马可福音 7:31–32', hold: 7.5 },
        { text: '耶稣领他离开众人，到一边去……<br>望天叹息，对他说：「以法大！」就是说：「开了吧！」', ref: '马可福音 7:33–34', hold: 7 },
        { text: '他的耳朵就开了，舌结也解了，说话也清楚了。', ref: '马可福音 7:35', hold: 5 },
        { text: '众人分外希奇，说：「他所做的事都好，<br>他连聋子也叫他们听见，哑巴也叫他们说话。」', ref: '马可福音 7:37', hold: 7 },
      ],
      apply(c) {
        ring(c, [255, 240, 200]);
        T(c, [
          [0, b => {
            time(0.38, 9, b);
            ['john', 'andrew', 'james', 'peter'].forEach(id => pose(id, 'stand'));
            glowP('jesus', LOOK().jesus ? LOOK().jesus.glow : 0.32);
            lv('mcMirror', 0, b);
            lv('mcDeca', 1, b);
            boatTo('land', b);
          }],
          [2.6, b => {
            landAll(b, [X('deafAt') - 0.03, X('deafAt') - 0.06, X('deafAt') - 0.075, X('deafAt') - 0.09, X('deafAt') - 0.105]);
            ['jesus', ...DISC].forEach(id => { pose(id, 'stand'); face(id, 1); });
            crowd('deca', { n: 8, x0: X('decaFolk')[0], x1: X('decaFolk')[1], label: '低加坡里人' });
            add('deaf', { label: '耳聋舌结的人', sex: 'm', x: X('decaFolk')[0] + 0.04, v: 0.1, facing: -1, robe: ROBE.deaf, beard: true, glow: 0.08 });
            add('f1', { label: '带他来的人', sex: 'm', x: X('decaFolk')[0] + 0.058, facing: -1, robe: ROBE.friend, beard: true });
            lv('mcHush', 1, b);
            walk('deaf', X('deafAt'), { speed: 0.025 }); walk('f1', X('deafAt') + 0.018, { speed: 0.025 });
          }],
          [9.2, b => {
            walk('jesus', X('aside') + 0.018, { speed: 0.028 }); walk('deaf', X('aside'), { speed: 0.028 });
            DISC.forEach((id, i) => walk(id, X('aside') - 0.04 - i * 0.014, { speed: 0.03 }));
            face('jesus', -1);
          }],
          [13, b => { face('jesus', -1); face('deaf', 1); pose('jesus', 'point'); }],
          [14.4, b => { pose('jesus', 'gaze'); addFX(b, { type: 'beam', id: 'jesus', dur: 3.6 }); sfx(b, 'whisper'); }],
          [15.8, b => {
            lv('mcHush', 0, b);
            addFX(b, { type: 'sound', id: 'deaf', dur: 3.2 }); addFX(b, { type: 'hush', id: 'deaf', dur: 1.4 });
            flashAt(b, 'deaf', [255, 240, 200], 18);
            if (!inst(b)) S.birdAcc = 6;
            W.setPop('bird', 40, W.w * 0.62, W.h * 0.62, inst(b));
            sfx(b, 'harp'); sfx(b, 'bird');
          }],
          [17.6, b => { pose('jesus', 'stand'); pose('deaf', 'raise'); glowP('deaf', 0.4); sfx(b, 'sing', { soft: true }); }],
          [20.4, b => { walk('deaf', X('deafAt') + 0.03, { speed: 0.035, pose: 'raise' }); }],
          [23.8, b => { crowdPose('deca', 'raise'); pose('f1', 'raise'); crowdFaceX('deca', X('deafAt')); sfx(b, 'crowd'); }],
        ]);
      },
    },
    // ── 十三 · 马可福音 8：伯赛大的瞎子 ─────────────────────────
    {
      kind: 'ask', utter: '你看见什么了？', cmd: 'diff 模糊 清楚  # 样样都看得清楚了', ref: '马可福音 8:23', tint: [255, 236, 200],
      verse: [
        { text: '他们来到伯赛大，有人带一个瞎子来，求耶稣摸他。', ref: '马可福音 8:22', hold: 5 },
        { text: '耶稣拉着瞎子的手，领他到村外……<br>按手在他身上，问他说：「你看见什么了？」', ref: '马可福音 8:23', hold: 6.5 },
        { text: '他就抬头一看，说：「我看见人了；他们好像树木，并且行走。」', ref: '马可福音 8:24', hold: 6 },
        { text: '随后又按手在他眼睛上，他定睛一看，就复了原，样样都看得清楚了。', ref: '马可福音 8:25', hold: 6.5 },
      ],
      apply(c) {
        const bx = c && isFinite(c.x) ? c.x / Math.max(1, W.w) : 0.7, by = c && isFinite(c.y) ? c.y / Math.max(1, W.h) : 0.5;
        T(c, [
          [0, b => {
            time(0.52, 10, b);
            lv('mcBoatA', 0, b); lv('mcDeca', 0, b);
            crowdRm('deca'); rm('deaf'); rm('f1');
            lv('mcMute', 1, b); W.set('mcSight', 0, true); W.set('mcHaze', 0, true);
            walk('jesus', X('blindAt') + 0.03, { speed: 0.03 });
            DISC.forEach((id, i) => walk(id, X('blindAt') + 0.06 + i * 0.014, { speed: 0.03 }));
          }],
          [2.4, b => { S.town = 'beth'; toTown(b, true); }],
          [1.2, b => {
            add('blind', { label: '瞎子', sex: 'm', x: X('blindFrom'), facing: 1, robe: ROBE.blind, beard: true, glow: 0.06, prop: 'staff' });
            add('f2', { label: '带他来的人', sex: 'm', x: X('blindFrom') - 0.018, facing: 1, robe: ROBE.friend, beard: true });
            walk('blind', X('blindAt'), { speed: 0.022 }); walk('f2', X('blindAt') - 0.018, { speed: 0.022 });
            const cst = C(); if (cst && cst.holdHands) cst.holdHands('blind', 'f2', true);
            crowd('beth', { n: 5, x0: X('houseA') - 0.04, x1: X('houseA') + 0.02, label: '伯赛大人' });
          }],
          [6.6, b => {
            const cst = C(); if (cst && cst.holdHands) { cst.holdHands('blind', 'f2', false); cst.holdHands('jesus', 'blind', true); }
            face('jesus', 1);
            walk('jesus', X('out') + 0.02, { speed: 0.03 }); walk('blind', X('out'), { speed: 0.03 });
          }],
          [11.6, b => {
            const cst = C(); if (cst && cst.holdHands) cst.holdHands('jesus', 'blind', false);
            face('jesus', -1); face('blind', 1); pose('jesus', 'point');
          }],
          [12.6, b => {
            lv('mcHaze', 1, b);
            flashAt(b, 'blind', [236, 232, 222], 12);
            sfx(b, 'chime', { soft: true });
          }],
          [14.4, b => { pose('jesus', 'stand'); pose('blind', 'gaze'); DISC.forEach((id, i) => walk(id, X('blindAt') - 0.02 + i * 0.03, { speed: 0.015 })); }],
          [21.6, b => { pose('jesus', 'point'); pose('blind', 'stand'); }],
          [22.4, b => {
            // 颜色自灵此刻所在之处绽放（只是看的样子；重演时直接满目）
            const sp = W.spirit;
            S.bloomX = !inst(b) && sp && isFinite(sp.x) ? sp.x / Math.max(1, W.w) : bx;
            S.bloomY = !inst(b) && sp && isFinite(sp.y) ? sp.y / Math.max(1, W.h) : by;
            W.set('mcSight', 0, true); lv('mcSight', 1, b); lv('bloom', 1, b);
            flashAt(b, 'blind', [255, 244, 220], 26);
            add('blind', { glow: 0.42, label: '得看见的人', prop: null });
            sfx(b, 'harp'); sfx(b, 'bird', { soft: true });
          }],
          [24, b => { pose('jesus', 'stand'); pose('blind', 'raise'); }],
          [25.8, b => { lv('mcHaze', 0, b); W.set('mcMute', 0, true); W.set('mcSight', 0, true); }],
          [26, b => { face('blind', -1); }],
          [27.2, b => { pose('blind', 'stand'); face('blind', 1); time(0.64, 28, b); }],
          // 「耶稣打发他回家」：他往家里去；主与门徒往前走（落幕之前，世界还在动）
          [27.8, b => {
            walk('blind', 1.1, { speed: 0.024 });
            walk('jesus', X('out') + 0.11, { speed: 0.012 });
            DISC.forEach((id, i) => walk(id, X('out') + 0.08 - i * 0.016, { speed: 0.014 }));
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '神迹', sub: '马可福音 1 — 8 · 马太福音 14 · 约翰福音 6', tint: TINT, music: 'redsea',
    outro: 24,
    intro: [
      { text: '约翰下监以后，耶稣来到加利利，宣传神的福音，说：<br>「日期满了，神的国近了。你们当悔改，信福音！」', ref: '马可福音 1:14–15', hold: 7 },
      { text: '于是在加利利全地，进了会堂，传道，赶鬼。', ref: '马可福音 1:39', hold: 5 },
    ],
    setup,
    stages: STAGES,
    behold: {
      '耶稣': { text: '耶稣出来，见有许多的人，就怜悯他们，因为他们如同羊没有牧人一般，于是开口教训他们许多道理。', ref: '马可福音 6:34' },
      '彼得': { text: '耶稣赶紧伸手拉住他，说：「你这小信的人哪，为什么疑惑呢？」', ref: '马太福音 14:31' },
      '约翰': { text: '耶稣稍往前走，又见西庇太的儿子雅各和雅各的兄弟约翰在船上补网。', ref: '马可福音 1:19' },
      '雅各': { text: '于是带着彼得、雅各，和雅各的兄弟约翰同去，不许别人跟随他。', ref: '马可福音 5:37' },
      '安得烈': { text: '有一个门徒，就是西门‧彼得的兄弟安得烈，对耶稣说：', ref: '约翰福音 6:8' },
      '长大麻风的': { text: '有一个长大麻风的来求耶稣，向他跪下，说：「你若肯，必能叫我洁净了。」', ref: '马可福音 1:40' },
      '得洁净的人': { text: '大麻风即时离开他，他就洁净了。', ref: '马可福音 1:42' },
      '迦百农人': { text: '合城的人都聚集在门前。', ref: '马可福音 1:33' },
      '众人': { text: '耶稣和门徒退到海边去，有许多人从加利利跟随他。', ref: '马可福音 3:7' },
      '瘫子': { text: '有人带着一个瘫子来见耶稣，是用四个人抬来的；', ref: '马可福音 2:3' },
      '抬褥子的人': { text: '因为人多，不得近前，就把耶稣所在的房子，拆了房顶，既拆通了，就把瘫子连所躺卧的褥子都缒下来。', ref: '马可福音 2:4' },
      '褥子': { text: '那人就起来，立刻拿着褥子，当众人面前出去了……', ref: '马可福音 2:12' },
      '西门的家': { text: '他们一出会堂，就同着雅各、约翰，进了西门和安得烈的家。', ref: '马可福音 1:29' },
      '迦百农': { text: '到了迦百农，耶稣就在安息日进了会堂教训人。', ref: '马可福音 1:21' },
      '会堂': { text: '众人很希奇他的教训；因为他教训他们，正像有权柄的人，不像文士。', ref: '马可福音 1:22' },
      '船': { text: '门徒离开众人，耶稣仍在船上，他们就把他一同带去；也有别的船和他同行。', ref: '马可福音 4:36' },
      '被鬼附的人': { text: '他远远地看见耶稣，就跑过去拜他，', ref: '马可福音 5:6' },
      '从前被鬼附的人': { text: '那人就走了，在低加坡里传扬耶稣为他做了何等大的事，众人就都希奇。', ref: '马可福音 5:20' },
      '坟茔': { text: '那人常住在坟茔里，没有人能捆住他，就是用铁链也不能；', ref: '马可福音 5:3' },
      '格拉森人': { text: '他们来到耶稣那里，看见那被鬼附着的人，就是从前被群鬼所附的，坐着，穿上衣服，心里明白过来，他们就害怕。', ref: '马可福音 5:15' },
      '睚鲁': { text: '再三地求他，说：「我的小女儿快要死了，求你去按手在她身上，使她痊愈，得以活了。」', ref: '马可福音 5:23' },
      '睚鲁的家': { text: '他们来到管会堂的家里；耶稣看见那里乱嚷，并有人大大地哭泣哀号，', ref: '马可福音 5:38' },
      '患血漏的女人': { text: '意思说：「我只摸他的衣裳，就必痊愈。」', ref: '马可福音 5:28' },
      '报信的人': { text: '还说话的时候，有人从管会堂的家里来，说：「你的女儿死了，何必还劳动先生呢？」', ref: '马可福音 5:35' },
      '哭泣哀号的人': { text: '进到里面，就对他们说：「为什么乱嚷哭泣呢？孩子不是死了，是睡着了。」', ref: '马可福音 5:39' },
      '闺女': { text: '那闺女立时起来走。他们就大大地惊奇；闺女已经十二岁了。', ref: '马可福音 5:42' },
      '孩子的母亲': { text: '耶稣把他们都撵出去，就带着孩子的父母和跟随的人进了孩子所在的地方，', ref: '马可福音 5:40' },
      '孩童': { text: '「在这里有一个孩童，带着五个大麦饼、两条鱼，只是分给这许多人还算什么呢？」', ref: '约翰福音 6:9' },
      '五饼二鱼': { text: '耶稣拿着这五个饼，两条鱼，望着天祝福，擘开饼，递给门徒，摆在众人面前，也把那两条鱼分给众人。', ref: '马可福音 6:41' },
      '十二个篮子': { text: '门徒就把碎饼碎鱼收拾起来，装满了十二个篮子。', ref: '马可福音 6:43' },
      '五千人': { text: '吃饼的男人共有五千。', ref: '马可福音 6:44' },
      '低加坡里': { text: '耶稣又离了泰尔的境界，经过西顿，就从低加坡里境内来到加利利海。', ref: '马可福音 7:31' },
      '低加坡里人': { text: '耶稣嘱咐他们不要告诉人；但他越发嘱咐，他们越发传扬开了。', ref: '马可福音 7:36' },
      '耳聋舌结的人': { text: '他的耳朵就开了，舌结也解了，说话也清楚了。', ref: '马可福音 7:35' },
      '带他来的人': { text: '有人带着一个耳聋舌结的人来见耶稣，求他按手在他身上。', ref: '马可福音 7:32' },
      '瞎子': { text: '他们来到伯赛大，有人带一个瞎子来，求耶稣摸他。', ref: '马可福音 8:22' },
      '得看见的人': { text: '随后又按手在他眼睛上，他定睛一看，就复了原，样样都看得清楚了。', ref: '马可福音 8:25' },
      '伯赛大人': { text: '他们来到伯赛大，有人带一个瞎子来，求耶稣摸他。', ref: '马可福音 8:22' },
      '伯赛大': { text: '耶稣打发他回家，说：「连这村子你也不要进去。」', ref: '马可福音 8:26' },
    },
    scene: {
      init() { sprites(); },
      resize() { ROCKS = null; },
      update,
      drawUnder,
      draw,
      reset() { sinkClipOff(); S = fresh(); FXL.length = 0; },
      restore() { sinkClipOff(); FXL.length = 0; },
      pick,
      sig() {
        const ab = Object.keys(S.aboard).filter(has).sort().map(k => k + ':' + S.aboard[k]);
        return { boat: S.boatA + '>' + S.boatB, aboard: ab, town: S.town };
      },
    },
  });
})(window.GS);
