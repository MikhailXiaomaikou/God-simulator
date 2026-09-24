/* ─────────────────────────────────────────────────────────────
 * book/chronicles.js —— 卷「历代」：历代志上 1 — 历代志下 36
 *
 * 历代志把整部历史讲成一座殿的故事：
 * 从亚当起，众名如一道光的河流过天空，一代一代流到锡安（代上 1—9）；雅比斯求告，神就应允他（4:10）；
 * 扫罗死在基利波，国归于耶西的儿子大卫（10）；大卫在希伯仑受膏，攻取锡安，天天有人来帮助他（11—12）；
 * 约柜先是坐新车，后由利未人用杠肩抬，欢呼吹角、敲钹、鼓瑟、弹琴，安放在大卫所搭的帐幕里（13—16）；
 * 「他必为我建造殿宇」——大卫的灯在锡安点起（17）；天使手拿拔出来的刀站在天地间，「够了，住手吧！」
 * 阿珥楠的禾场上筑坛，火从天降（21）；材料、利未人的班次、二百八十八个歌唱的（22—27）；
 * 殿的样式由耶和华用手划出——一幅金线的图画在空中写成（28）；大卫老迈而死（29）。
 * 所罗门求智慧（代下 1），殿在摩利亚山上建成：两根铜柱雅斤、波阿斯，铜坛，铜海（2—4）；
 * ★ 奉献：吹号的、歌唱的声合为一，「耶和华本为善，他的慈爱永远长存」，云充满了殿；
 *   所罗门跪在铜台上向天举手；火从天上降下，烧尽燔祭，荣光充满了殿，以色列众人在铺石地俯伏（5—7）★；
 * 夜间的应许：「这称为我名下的子民……医治他们的地」（7:14）；示巴女王；国分裂（8—12）；
 * 耶和华的眼目遍察全地（13—17）；歌唱的走在军前（18—20）；大卫的灯永不熄灭——诸王一个一个过去（21—27）；
 * 殿门被封，又被打开，逾越节的喜乐，祷告达到天上（28—33）；火焚烧神的殿，百姓被掳，
 * 地享受安息七十年，草木覆盖废墟（34—36:21）；塞鲁士的诏书——光转向归家的路（36:22—23）。
 *
 * 布景（自画）：众名之河、大卫城与王宫（中丘层）、阿珥楠的禾场、约柜、大卫的帐幕、殿（近地，东向，门朝左）、
 * 雅斤与波阿斯、铜坛、铜海、铜台、建殿的材料、金线的样式、云与荣光、自天降下的火、耶和华的使者与刀、
 * 大卫的灯、号角与钹琴、声合为一的光环、敌营的火、银柜、堆垒、焚烧与废墟、归回的路。
 * 十五句话：神自己的话（代上 11:2、21:15、22:9、28:6，代下 1:7、7:14、20:15），应许的转述（代下 21:7、30:9），
 * 其余是经文里描述神作为或性情的短句（kind 'act'：代上 4:10、15:26，代下 5:13、16:9、36:15、36:22）。
 * 六十五章每章都有一句经文讲到（代上 1—3 在卷首的 intro 里）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'chronicles';
  const cur = () => GS.book.current(ACT);
  const safe = U.safe;
  const M = () => Math.min(W.w, W.h);
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const sm = (a, b, x) => U.smoothstep(a, b, x);

  // ── 本卷的程度（恢复时由 W.snapAll 对齐）────────────────────
  const LV = {
    chRiver: ['exp', 0.45],    // 众名之河
    chBorder: ['lin', 0.14],   // 雅比斯扩张的境界（金线向两旁展开）
    chBorderA: ['exp', 0.5],   // 境界线的亮度
    chCity: ['lin', 0.08],     // 耶布斯 → 大卫城 → 耶路撒冷
    chPalace: ['exp', 0.5],    // 大卫香柏木的宫
    chTower: ['exp', 0.4],     // 乌西雅在城上筑的城楼
    chFloor: ['exp', 0.6],     // 阿珥楠的禾场
    chObed: ['exp', 0.6],      // 约柜暂住的那家
    chTent: ['exp', 0.6],      // 大卫所搭的帐幕
    chDAltar: ['exp', 0.5],    // 大卫在禾场上筑的坛
    chDFire: ['exp', 0.8],
    chSite: ['exp', 0.4],      // 「这就是耶和华神的殿」：地上显出殿基的金线
    chMat: ['lin', 0.14],      // 建殿的材料
    chPlan: ['lin', 0.1],      // 样式：金线一笔一笔写出
    chPlanA: ['exp', 0.5],     // 样式的亮度
    chBuild: ['lin', 0.075],   // 殿的建造
    chAltar: ['exp', 0.5],     // 铜坛
    chSea: ['exp', 0.5],       // 铜海
    chPlat: ['exp', 0.6],      // 所罗门的铜台
    chFire: ['exp', 0.7],      // 坛上的火
    chDoor: ['exp', 0.5],      // 殿门（1 开 · 0 封锁）
    chGlory: ['exp', 0.45],    // 荣光充满了殿
    chCloud: ['exp', 0.3],     // 云充满了殿
    chPlay: ['exp', 1.2],      // 吹号、敲钹、鼓瑟、弹琴
    chSong: ['exp', 0.9],      // 歌声（声合为一的光环）
    chLamp: ['exp', 0.6],      // 大卫的灯
    chAngel: ['exp', 0.6],     // 耶和华的使者
    chSword: ['exp', 0.9],     // 拔出来的刀（1）→ 收刀入鞘（0）
    chGibeon: ['exp', 0.5],    // 基遍的会幕与铜坛
    chEyes: ['exp', 0.5],      // 耶和华的眼目遍察全地
    chCamp: ['exp', 0.5],      // 敌营的火
    chCampOut: ['lin', 0.16],  // 敌营的火一处一处熄灭
    chChest: ['exp', 0.6],     // 银柜
    chCorner: ['exp', 0.5],    // 城中各处拐角的坛（亚哈斯）
    chHeaps: ['exp', 0.4],     // 堆垒
    chBurn: ['exp', 0.5],      // 焚烧
    chRuin: ['lin', 0.12],     // 殿与城成为废墟
    chWild: ['lin', 0.09],     // 地享受安息：草木覆盖废墟
    chEast: ['exp', 0.35],     // 东方的光（塞鲁士的心被激动）
    chRoad: ['lin', 0.1],      // 归回的路
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 布局（画面宽度的比例；竖屏另有一套）────────────────────
  // 院子从左到右：以色列众人 · 歌唱的与吹号的（坛的东边，两排）· 铜台 · 坛 · 殿（门朝东）
  const LAYL = {
    tx0: 0.69, tuW: 0.25, tuH: 0.42,
    plat: 0.565, pr: [0.47, 0.538], sg: [0.476, 0.544], isr: [0.388, 0.458],
    tent: 0.445, obed: 0.93, jabez: 0.58, dav: 0.565, dav2: 0.668, king: 0.565,
    gil: 0.527, palace: 0.625, city: [0.566, 0.9], camp: [0.53, 0.8], ret: [0.4, 0.44],
  };
  const LAYP = {
    tx0: 0.62, tuW: 0.34, tuH: 0.6,
    plat: 0.476, pr: [0.4, 0.452], sg: [0.404, 0.456], isr: [0.33, 0.392],
    tent: 0.4, obed: 0.93, jabez: 0.52, dav: 0.476, dav2: 0.59, king: 0.476,
    gil: 0.53, palace: 0.625, city: [0.566, 0.93], camp: [0.5, 0.96], ret: [0.36, 0.4],
  };
  const X = k => (tall() ? LAYP : LAYL)[k];
  const TU = () => { const L = tall() ? LAYP : LAYL; return Math.max(40, Math.min(W.w * L.tuW, W.h * L.tuH)); };
  const altX = () => (X('tx0') * W.w - 0.25 * TU()) / W.w;       // 铜坛（亦即大卫在禾场上筑坛之处）
  const seaX = () => (X('tx0') * W.w + 0.56 * TU()) / W.w;

  // ── 小工具 ──────────────────────────────────────────────────
  const narrowK = () => (W.w < 600 ? 1.15 : 1);
  const LS = l => W.layerScale(l) * narrowK();
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * [1.1, 1.2, 1.3][l];   // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const lit = c => [Math.min(255, c[0] * 1.22 + 20), Math.min(255, c[1] * 1.18 + 16), Math.min(255, c[2] * 1.14 + 12)];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const mix = (a, b, t) => U.mixRGB(a, b, clamp(t, 0, 1));
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const sunLeft = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x) < W.w * 0.62;
  const say = (b, lines) => { if (!b.instant && GS.ui) safe('ch.narrate', () => GS.ui.narrate(lines, { replace: false })); };
  const sfx = (b, name, o) => { if (b && b.instant) return; if (W.replaying) return; const a = au(); if (a && a.sfx) safe('ch.sfx', () => a.sfx(name, o || {})); };
  const avoid = (...rs) => { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); };

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!(c && c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : (o && o.from) || 'fade' }, o)); }
  const walk = (id, x, o) => { if (has(id)) C().walk(id, x, o); };
  const pose = (id, p, o) => { if (has(id)) C().pose(id, p, o); };
  const face = (id, d) => { if (has(id)) C().face(id, d); };
  const rm = (id, now) => { if (has(id)) C().remove(id, now ? { fade: false } : undefined); };
  const glow = (id, v) => { if (has(id)) C().glow(id, v); };
  const place = (id, x, l) => { if (has(id)) C().place(id, x, l); };
  function crowd(gid, o) {
    const c = C();
    if (!c || hasCrowd(gid)) return;
    c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o));
  }
  const cwalk = (gid, x0, x1, o) => { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); };
  const cpose = (gid, p) => { if (hasCrowd(gid)) C().crowdPose(gid, p); };
  const crm = gid => { if (hasCrowd(gid)) C().removeCrowd(gid); };
  function animal(id, o) {
    const c = C();
    if (!c || !c.animal) return null;
    return safe('ch.animal', () => c.animal(id, Object.assign({ layer: 2, from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function herd(gid, o) {
    const c = C();
    if (!c || !c.herd || hasCrowd(gid)) return;
    safe('ch.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  const setProp = (id, k) => { const c = C(); if (c && c.prop && has(id)) safe('ch.prop', () => c.prop(id, k || null)); };
  function headOf(id) {
    const f = fig(id);
    if (!f) return [W.w * 0.6, W.h * 0.7];
    if (f._vis && isFinite(f._x) && isFinite(f._y) && f._h > 0) return [f._x, f._y - f._h * 1.02];
    const x = f.nx * W.w;
    return [x, gY(f.layer == null ? 2 : f.layer, f.nx) - PH(f.layer == null ? 2 : f.layer) * 1.02];
  }

  // 衣袍
  const LINEN = [236, 232, 218], LINEN2 = [224, 220, 204], ROYAL = [132, 60, 74], ROYAL2 = [112, 66, 104], GOLDACC = [232, 188, 92];
  const SACK = [98, 86, 70];
  const KING = (robe, extra) => Object.assign({ robe: robe || ROYAL, hair: 'cloth', accent: GOLDACC, glow: 0.35 }, extra || {});

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）──
  function fresh() {
    return {
      riverT0: -1e9, w1T0: -1e9,       // 众名之河（装饰的时刻，不入签名）
      ark: 'none',                     // 'none' | 'cart' | 'poles' | 'obed' | 'tent' | 'in'
      bearers: [],                     // 抬约柜的人
      angel: 'none',                   // 'none' | 'sword' | 'sheath' | 'gone'
      fireT0: -1e9, fireX: 0,          // 自天降下的火（转瞬）
      one: false, oneT0: -1e9,         // 声合为一（状态）与那一刻（装饰）
      lamp: 'none',                    // 'none' | 'zion' | 'hidden' | 'exile' | 'home'
      eyesT0: -1e9, prayT0: -1e9, msgT0: -1e9, sweepT0: -1e9,
      camp: 'none',                    // 'moab' | 'assyria'
      scroll: false,                   // 律法书（约西亚）
      names: [],                       // 情节里写在地上的名 [{ s, xf, l, t0 }]
    };
  }
  let S = fresh();
  // 转瞬的光（不属于世界的状态；重演时不放）
  const FXL = [];
  const flash = (b, o) => { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); };

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], a0));
    gr.addColorStop(mid || 0.35, U.rgba(rgb[0], rgb[1], rgb[2], a0 * 0.32));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function vbeam(rgbC, rgbE, headFade, soft) {
    const w = 64, h = 256, c = cnv(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      const vy = Math.min(1, v / (headFade || 0.08)) * (v > 0.8 ? Math.pow(Math.max(0, 1 - (v - 0.8) / 0.2), 1.5) : 1);
      for (let x = 0; x < w; x++) {
        const hx = ((x + 0.5) / w) * 2 - 1;
        const core = soft ? Math.exp(-hx * hx * 9) : Math.exp(-hx * hx * 40), edge = Math.exp(-hx * hx * (soft ? 3.2 : 5));
        const a = vy * (soft ? edge * 0.7 + core * 0.3 : edge * 0.65 + core * 0.35);
        const i = (y * w + x) * 4;
        d[i] = lerp(rgbE[0], rgbC[0], core); d[i + 1] = lerp(rgbE[1], rgbC[1], core); d[i + 2] = lerp(rgbE[2], rgbC[2], core);
        d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
      ember: radial([255, 104, 44], 1), smoke: radial([138, 130, 122], 0.8, 0.55), soot: radial([40, 32, 28], 0.85, 0.55),
      cloud: radial([255, 250, 236], 0.9, 0.55), green: radial([160, 214, 120], 0.8), silver: radial([230, 236, 250], 1),
      beam: vbeam([255, 250, 232], [255, 232, 180], 0.06), fire: vbeam([255, 244, 200], [255, 120, 40], 0.02),
      soft: vbeam([255, 248, 226], [255, 230, 176], 0.35, true),
    };
    return SP;
  }
  const FONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  const TXT = new Map();
  function textSprite(str, px, rgb) {
    const dpr = Math.min(2, W.dpr || 1), key = str + '|' + px + '|' + dpr + '|' + rgb.join(',');
    let s = TXT.get(key);
    if (s) return s;
    if (TXT.size > 200) TXT.clear();
    const c = document.createElement('canvas'), g = c.getContext('2d');
    const font = Math.round(px * dpr) + 'px ' + FONT;
    g.font = font;
    const tw = Math.ceil(g.measureText(str).width) + Math.ceil(18 * dpr);
    c.width = Math.max(4, tw); c.height = Math.ceil(px * 2 * dpr);
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(14, 9, 5, 0.8)'; g.shadowBlur = 5 * dpr;
    g.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
    g.fillText(str, c.width / 2, c.height / 2);
    g.shadowColor = U.rgba(rgb[0], rgb[1], rgb[2], 0.55); g.shadowBlur = 9 * dpr;
    g.fillText(str, c.width / 2, c.height / 2);
    s = { c, w: c.width / dpr, h: c.height / dpr };
    TXT.set(key, s);
    return s;
  }
  function loadFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('20px "GS Kai"', '亚当塞特大卫所罗门').then(() => TXT.clear()).catch(() => {});
        if (document.fonts.ready) document.fonts.ready.then(() => TXT.clear()).catch(() => {});
      }
    } catch (e) { /* 用系统字 */ }
  }
  function glowAt(ctx, spr, x, y, s, a) {
    if (a <= 0.004 || s <= 0) return;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.drawImage(spr, x - s / 2, y - s / 2, s, s);
  }

  // ════════════════════════════════════════════════════════════
  //  众名之河（代上 1—9）：从天边（起初）流到锡安
  // ════════════════════════════════════════════════════════════
  const R_INTRO = [
    ['亚当', 1.3], ['塞特'], ['以挪士'], ['该南'], ['玛勒列'], ['雅列'], ['以诺'], ['玛土撒拉'], ['拉麦'], ['挪亚', 1.15],
    ['闪'], ['亚法撒'], ['希伯'], ['法勒'], ['他拉'], ['亚伯拉罕', 1.25], ['以撒'], ['以色列', 1.25],
    ['吕便', 1, 1], ['西缅', 1, -1], ['利未', 1, 1], ['犹大', 1.1, 0], ['以萨迦', 1, -1], ['西布伦', 1, 1], ['但', 1, -1], ['约瑟', 1, 1],
    ['便雅悯', 1, -1], ['拿弗他利', 1, 1], ['迦得', 1, -1], ['亚设', 1, 1],
    ['法勒斯'], ['希斯伦'], ['兰'], ['亚米拿达'], ['拿顺'], ['撒门'], ['波阿斯'], ['俄备得'], ['耶西'], ['大卫', 1.3], ['所罗门', 1.1],
  ];
  const R_W1 = [
    [0.6, '雅比斯', 1.15], [7.5, '吕便'], [8.1, '迦得'], [8.7, '玛拿西'], [9.6, '利未'], [10.2, '亚萨', 1.05], [10.8, '希幔', 1.05], [11.4, '耶杜顿', 1.05],
    [15.6, '以萨迦'], [16.2, '以法莲'], [16.8, '嫩'], [17.4, '约书亚', 1.1], [18.2, '便雅悯'], [18.8, '基士'], [19.4, '扫罗', 1.1], [20, '约拿单'],
  ];
  const RIVER = [];
  let R_INTRO_END = 0;
  (function () {
    // 相邻两名之间的间隔按字数来算：长的名、大的名，后面空得多一些，免得挤在一起
    let t = 4.5, prev = null;     // 幕布升起之后才开始流
    R_INTRO.forEach(n => {
      const k = n[1] || 1, w = n[0].length * k;
      if (prev != null) t += 0.15 * (prev + w) / 2 + 0.2;
      RIVER.push({ s: n[0], k, br: n[2] || 0, t, w1: false });
      prev = w;
    });
    R_INTRO_END = t + 0.8;
    R_W1.forEach(n => RIVER.push({ s: n[1], k: n[2] || 1, br: 0, t: n[0], w1: true }));
  })();
  const rDur = () => (tall() ? 8.5 : 13);
  // 河道：自东边天海相接处（起初）升起，越过高天，落到锡安；按弧长取点，众名匀速而行
  function riverPts() {
    return tall()
      ? [[0.05, 0.57], [0.12, 0.38], [0.64, 0.35], [X('palace'), 0.655]]
      : [[0.05, 0.47], [0.2, 0.13], [0.62, 0.1], [X('palace') + 0.005, 0.645]];
  }
  function bez(P, s) {
    const u = 1 - s;
    return [
      (u * u * u * P[0][0] + 3 * u * u * s * P[1][0] + 3 * u * s * s * P[2][0] + s * s * s * P[3][0]) * W.w,
      (u * u * u * P[0][1] + 3 * u * u * s * P[1][1] + 3 * u * s * s * P[2][1] + s * s * s * P[3][1]) * W.h,
    ];
  }
  let RL = null;
  function riverLUT() {
    if (RL && RL.w === W.w && RL.h === W.h) return RL;
    const P = riverPts(), N = 96, pts = [], cum = [0];
    for (let i = 0; i <= N; i++) pts.push(bez(P, i / N));
    for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return (RL = { w: W.w, h: W.h, pts, cum, L: cum[N] });
  }
  // 沿河道弧长的比例 u（0..1）处的点与切向
  function riverAt(u) {
    const R = riverLUT(), d = clamp(u, 0, 1) * R.L, c = R.cum;
    let lo = 0, hi = c.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= d) lo = m; else hi = m; }
    const f = (d - c[lo]) / Math.max(1e-6, c[hi] - c[lo]), a = R.pts[lo], b = R.pts[hi];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), dx / L, dy / L];
  }
  function drawRiver(ctx) {
    const k = lv('chRiver');
    if (k < 0.01) return;
    const R = riverLUT(), un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const night = 0.5 + 0.5 * nightK();
    for (const [wd, a] of [[18, 0.045], [7, 0.08], [1.8, 0.26]]) {
      ctx.strokeStyle = U.rgba(255, 226, 170, a * k * night);
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      R.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
    }
    // 流动的光点
    ctx.fillStyle = 'rgb(255, 238, 200)';
    for (let i = 0; i < 50; i++) {
      const s = U.fract(W.t * 0.05 + i * 0.618);
      const p = riverAt(s), off = (U.hash1(i * 7 + 1) - 0.5) * 12 * un;
      ctx.globalAlpha = clamp(k * Math.sin(Math.PI * s) * 0.7 * night, 0, 1);
      const z = (1 + (i % 3) * 0.6) * un;
      ctx.fillRect(p[0] - p[3] * off - z / 2, p[1] + p[2] * off - z / 2, z, z);
    }
    // 源头与流到锡安的一汪光
    sprites();
    const s0 = R.pts[0], e = R.pts[R.pts.length - 1];
    glowAt(ctx, SP.gold, s0[0], s0[1], 60 * un, 0.3 * k * night);
    glowAt(ctx, SP.gold, e[0], e[1], 100 * un, 0.38 * k * night);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    // 众名：一个接一个，匀速顺流而下；十二个儿子在河上分开，又汇合
    const px0 = clamp(15 * W.unit, 12, 19), dur = rDur();
    const w1Base = Math.max(S.w1T0, S.riverT0 + R_INTRO_END);
    for (const n of RIVER) {
      const age = W.t - ((n.w1 ? w1Base : S.riverT0) + n.t);
      if (age < 0 || age > dur) continue;
      const s = age / dur;
      const p = riverAt(s);
      let x = p[0], y = p[1];
      if (n.br) {
        const off = n.br * Math.sin(Math.PI * clamp((s - 0.1) / 0.8, 0, 1)) * 0.032 * W.h;
        x += -p[3] * off; y += p[2] * off;
      }
      const a = sm(0, 0.05, s) * (1 - sm(0.88, 1, s)) * k;
      if (a < 0.02) continue;
      const sp = textSprite(n.s, Math.round(px0 * n.k), n.k > 1.1 ? [255, 236, 190] : [248, 232, 206]);
      ctx.globalAlpha = a;
      ctx.drawImage(sp.c, x - sp.w / 2, y - sp.h / 2, sp.w, sp.h);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  雅比斯的境界（代上 4:10）
  // ════════════════════════════════════════════════════════════
  function drawBorder(ctx) {
    const e = lv('chBorder'), a = lv('chBorderA');
    if (e < 0.01 || a < 0.01) return;
    const cx = X('jabez'), R = 0.72 * e, x0 = Math.max(0.31, cx - R), x1 = Math.min(0.999, cx + R);
    const un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const [wd, al] of [[7, 0.1], [2.2, 0.4]]) {
      ctx.strokeStyle = U.rgba(255, 222, 150, al * a * (0.6 + 0.4 * nightK()));
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const xf = lerp(x0, x1, i / 60), y = gY(2, xf) + 2 * un;
        if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y);
      }
      ctx.stroke();
    }
    sprites();
    for (const xf of [x0, x1]) glowAt(ctx, SP.gold, xf * W.w, gY(2, xf), 40 * un, 0.6 * a * (1 - e * 0.3));
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  大卫城（中丘层）：房屋、城墙、城楼、王宫、大卫的灯
  // ════════════════════════════════════════════════════════════
  const STONE = [212, 194, 160], STONE_OLD = [150, 140, 126], CEDAR = [112, 78, 52], HOLE = [52, 38, 30], SOOT = [46, 38, 34];
  let CITY = null;
  function cityLayout() {
    if (CITY && CITY.w === W.w && CITY.h === W.h && CITY.tall === tall()) return CITY;
    const r = U.mulberry32(2913), hm = PH(1), [a, b] = X('city'), core = X('palace'), out = [];
    for (let row = 0; row < 2; row++) {
      let x = a * W.w + r() * hm * 0.5;
      while (x < b * W.w) {
        const w = hm * (0.9 + r() * 1.1) * (row ? 1 : 0.9), h = hm * (0.95 + r() * 0.75) * (row ? 1 : 1.12);
        const xf = (x + w / 2) / W.w;
        const dist = Math.abs(xf - core) / Math.max(0.05, xf < core ? core - a : b - core);
        out.push({ xf, wk: w / hm, hk: h / hm, row, th: clamp(dist * 0.86 + r() * 0.12, 0, 0.98), ruin: r(), door: r() < 0.55, win: r() < 0.75, dx: r(), dome: r() < 0.08 });
        x += w * (0.55 + r() * 0.55);
      }
    }
    return (CITY = { w: W.w, h: W.h, tall: tall(), houses: out });
  }
  const cityEdge = k => { const [a, b] = X('city'), c = X('palace'); return [lerp(c - 0.04, a + 0.01, sm(0.15, 1, k)), lerp(c + 0.06, b - 0.01, sm(0.15, 1, k))]; };
  function drawCity(ctx) {
    const k = lv('chCity');
    if (k < 0.01) return;
    const L = cityLayout(), hm = PH(1), un = W.unit, ruin = lv('chRuin'), wild = lv('chWild'), burn = lv('chBurn');
    const base = mix(STONE, STONE_OLD, ruin * 0.5), sooty = mix(base, SOOT, ruin * 0.55);
    const body = css(sooty, 1), rim = css(lit(sooty), 1, rimA(), 0.1), hole = css(HOLE, 1);
    const sl = sunLeft();
    const [e0, e1] = cityEdge(k);
    for (let row = 0; row < 2; row++) {
      const R = [];
      for (const hs of L.houses) {
        if (hs.row !== row || k < hs.th) continue;
        const v = clamp((k - hs.th) / 0.1, 0, 1), x = hs.xf * W.w, w = hs.wk * hm;
        const g = gY(1, hs.xf) + (row ? 0.05 : -0.18) * hm;
        const h = hs.hk * hm * U.easeOut(v) * (1 - ruin * (0.35 + 0.5 * hs.ruin));
        if (h < 0.5) continue;
        R.push([x - w / 2, g - h, w, h + 3 * un, hs]);
      }
      if (!R.length) continue;
      ctx.fillStyle = body;
      ctx.beginPath();
      for (const q of R) {
        if (ruin > 0.2) {   // 残垣：参差的顶
          const n = 4, jag = q[3] * 0.25 * ruin;
          ctx.moveTo(q[0], q[1] + q[3]);
          for (let i = 0; i <= n; i++) ctx.lineTo(q[0] + q[2] * i / n, q[1] + jag * U.hash1(q[4].xf * 999 + i));
          ctx.lineTo(q[0] + q[2], q[1] + q[3]);
          ctx.closePath();
        } else ctx.rect(q[0], q[1], q[2], q[3]);
      }
      ctx.fill();
      // 背光的一面（给房屋一点体积）与平顶的檐
      ctx.fillStyle = css(dim(sooty, 0.78), 1);
      ctx.beginPath();
      for (const q of R) { const sw = q[2] * (0.18 + 0.12 * q[4].dx); ctx.rect(sl ? q[0] + q[2] - sw : q[0], q[1], sw, q[3]); }
      ctx.fill();
      if (ruin < 0.2) {
        ctx.fillStyle = css(mix(lit(sooty), [196, 170, 130], 0.3), 1, null, 0.04);
        ctx.beginPath();
        for (const q of R) if (!q[4].dome) ctx.rect(q[0] - 0.8 * un, q[1] - 1.2 * un, q[2] + 1.6 * un, 1.6 * un);
        ctx.fill();
        // 偶有圆顶
        ctx.fillStyle = body;
        ctx.beginPath();
        for (const q of R) if (q[4].dome) { const r0 = q[2] * 0.32; ctx.moveTo(q[0] + q[2] / 2 + r0, q[1] + 0.5); ctx.arc(q[0] + q[2] / 2, q[1] + 0.5, r0, 0, Math.PI, true); }
        ctx.fill();
      }
      ctx.fillStyle = hole;
      ctx.beginPath();
      for (const q of R) {
        const hs = q[4];
        if (hs.door && q[3] > hm * 0.5) { const dw = Math.max(1, hm * 0.15), dh = Math.min(q[3] * 0.45, hm * 0.4); ctx.rect(q[0] + q[2] * (0.25 + 0.5 * hs.dx) - dw / 2, q[1] + q[3] - 3 * un - dh, dw, dh); }
        if (hs.win && q[3] > hm * 0.7) { const s = Math.max(1, hm * 0.08); ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s * 1.4); }
      }
      ctx.fill();
      ctx.strokeStyle = rim;
      ctx.lineWidth = Math.max(0.6, un);
      ctx.beginPath();
      for (const q of R) { const ex = sl ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.7); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] * 0.5, q[1]); }
      ctx.stroke();
      // 夜里的灯火
      const lamps = W.night * (1 - ruin) * (1 - burn);
      if (lamps > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(255, 196, 120, 0.85 * lamps);
        ctx.beginPath();
        for (const q of R) {
          const hs = q[4];
          if (!hs.win || q[3] < hm * 0.5) continue;
          const s = Math.max(1, hm * 0.08);
          ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s * 1.4);
        }
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      if (row === 0) drawWall(ctx, k, e0, e1, ruin);
    }
    // 草木覆盖（地享受安息）
    if (wild > 0.02) {
      ctx.fillStyle = css([92, 128, 70], 1, 0.75 * wild);
      ctx.beginPath();
      for (const hs of L.houses) {
        if (k < hs.th) continue;
        const x = hs.xf * W.w, w = hs.wk * hm, g = gY(1, hs.xf);
        const hh = hm * (0.12 + 0.4 * hs.ruin) * wild;
        ctx.moveTo(x - w * 0.6, g + 2); ctx.quadraticCurveTo(x - w * 0.1, g - hh * 1.6, x + w * 0.55, g + 2); ctx.closePath();
      }
      ctx.fill();
    }
  }
  function drawWall(ctx, k, x0, x1, ruin) {
    const v = sm(0.05, 0.3, k);
    if (v <= 0) return;
    const hm = PH(1), un = W.unit, wh = hm * 0.7 * v, cren = Math.max(2, hm * 0.2);
    ctx.fillStyle = css(mix(mix([200, 182, 150], STONE_OLD, ruin * 0.5), SOOT, ruin * 0.5), 1);
    ctx.beginPath();
    let x = x0 * W.w, i = 0;
    while (x < x1 * W.w) {
      const seg = cren * 2, xe = Math.min(x1 * W.w, x + seg);
      const broken = ruin > 0.05 && U.hash1(i * 7 + 3) < ruin * 0.55;
      const g0 = gY(1, x / W.w) + hm * 0.12, h = broken ? wh * (0.15 + 0.3 * U.hash1(i + 9)) : wh;
      ctx.rect(x, g0 - h, xe - x + 0.5, h + 4 * un);
      if (!broken) ctx.rect(x, g0 - h - cren * 0.6, cren, cren * 0.6 + 1);
      x = xe; i++;
    }
    // 城楼（乌西雅又筑城楼：代下 26:9）
    const tw = lv('chTower');
    const towers = [x0 + 0.015, x0 + (x1 - x0) * 0.33, x0 + (x1 - x0) * 0.66, x1 - 0.015];
    towers.forEach((f, j) => {
      const gx = f * W.w, g0 = gY(1, f) + hm * 0.12, th = wh * (1.35 + 0.7 * tw * (j % 2 ? 1 : 0.6)) * (1 - ruin * 0.6 * U.hash1(j + 3)), w = hm * 0.62;
      ctx.rect(gx - w / 2, g0 - th, w, th + 4 * un);
      if (ruin < 0.4) { ctx.rect(gx - w / 2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1); ctx.rect(gx + w * 0.2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1); }
    });
    ctx.fill();
    // 城门（锡安的门）
    ctx.fillStyle = css(HOLE, 1);
    ctx.beginPath();
    const gx = (x0 + 0.015) * W.w, g0 = gY(1, x0 + 0.015) + hm * 0.12, gw = hm * 0.26, gh = wh * 0.8;
    ctx.moveTo(gx - gw / 2, g0 + 1); ctx.lineTo(gx - gw / 2, g0 - gh + gw / 2); ctx.arc(gx, g0 - gh + gw / 2, gw / 2, Math.PI, 0); ctx.lineTo(gx + gw / 2, g0 + 1); ctx.closePath();
    ctx.fill();
  }
  // 王宫（大卫香柏木的宫）
  function palaceBox() {
    const x = X('palace') * W.w, hm = PH(1), g = gY(1, X('palace')) + hm * 0.1;
    return { x, g, w: hm * 2.4, h: hm * 1.9, hm };
  }
  function drawPalace(ctx) {
    const k = lv('chPalace');
    if (k < 0.01) return;
    const { x, g, w, h, hm } = palaceBox(), un = W.unit, ruin = lv('chRuin');
    const hh = h * U.easeOut(k) * (1 - 0.5 * ruin);
    ctx.fillStyle = css(mix(mix([214, 198, 166], STONE_OLD, ruin * 0.5), SOOT, ruin * 0.6), 1);
    ctx.beginPath();
    ctx.rect(x - w / 2, g - hh * 0.62, w, hh * 0.62 + 3 * un);
    ctx.rect(x - w * 0.3, g - hh, w * 0.6, hh * 0.4 + 1);
    ctx.fill();
    // 香柏木的梁与柱廊
    if (ruin < 0.6) {
      ctx.fillStyle = css(CEDAR, 1, 1 - ruin);
      ctx.beginPath();
      ctx.rect(x - w / 2 - 2 * un, g - hh * 0.62 - 2.2 * un, w + 4 * un, 2.2 * un);
      ctx.rect(x - w * 0.3 - 1.5 * un, g - hh - 2 * un, w * 0.6 + 3 * un, 2 * un);
      for (let i = 0; i < 6; i++) ctx.rect(x - w * 0.42 + i * w * 0.168, g - hh * 0.55, Math.max(1, hm * 0.07), hh * 0.5);
      ctx.fill();
    }
    ctx.strokeStyle = css(lit([214, 198, 166]), 1, rimA() * (1 - ruin), 0.1);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath();
    const ex = sunLeft() ? x - w / 2 : x + w / 2;
    ctx.moveTo(ex, g); ctx.lineTo(ex, g - hh * 0.62);
    ctx.stroke();
    if (W.night > 0.05 && ruin < 0.3 && lv('chBurn') < 0.3) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 200, 120, 0.8 * W.night * k);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) ctx.rect(x - w * 0.36 + i * w * 0.22, g - hh * 0.4, Math.max(1, hm * 0.1), Math.max(1, hm * 0.12));
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ── 大卫的灯（代下 21:7）──
  const lampPos = { x: 0, y: 0, init: false };
  function lampTarget() {
    const m = S.lamp;
    if (m === 'hidden') { const t = temple(); return [t.x0 + 0.12 * t.tu, t.top - 0.12 * t.tu]; }
    if (m === 'exile') return [0.315 * W.w, gY(2, 0.33) - PH(2) * 1.6];
    const p = palaceBox();
    return [p.x, p.g - p.h - p.hm * (S.lamp === 'home' || lv('chRoad') > 0.3 ? 1.8 : 0.9)];
  }
  function stepLamp(dt, snap) {
    const t = lampTarget();
    if (snap || !lampPos.init) { lampPos.x = t[0]; lampPos.y = t[1]; lampPos.init = true; return; }
    const k = 1 - Math.exp(-dt * (S.lamp === 'exile' ? 0.35 : S.lamp === 'home' ? 0.45 : 1.2));
    lampPos.x += (t[0] - lampPos.x) * k; lampPos.y += (t[1] - lampPos.y) * k;
  }
  function drawLamp(ctx) {
    const k = lv('chLamp');
    if (k < 0.01 || S.lamp === 'none') return;
    sprites();
    const un = Math.max(0.6, W.unit), x = lampPos.x, y = lampPos.y;
    const fl = 0.86 + 0.1 * Math.sin(W.t * 7.3) + 0.05 * Math.sin(W.t * 13.1);
    const small = S.lamp === 'hidden' ? 0.55 : S.lamp === 'exile' ? 0.6 : 1 + 0.5 * lv('chRoad');
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y, 70 * un * small * (0.8 + 0.4 * k), k * (0.35 + 0.35 * nightK()) * fl);
    glowAt(ctx, SP.gold, x, y, 26 * un * small, k * 0.9 * fl);
    // 小小的火苗
    const h = 7 * un * small * fl, w = 2.4 * un * small;
    ctx.globalAlpha = clamp(k, 0, 1);
    ctx.fillStyle = 'rgb(255, 236, 170)';
    ctx.beginPath();
    ctx.moveTo(x - w, y + h * 0.3); ctx.quadraticCurveTo(x - w, y - h * 0.4, x + Math.sin(W.t * 5) * w * 0.3, y - h);
    ctx.quadraticCurveTo(x + w, y - h * 0.4, x + w, y + h * 0.3); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // 灯盏
    ctx.fillStyle = css([150, 110, 60], 1, k);
    ctx.beginPath(); ctx.ellipse(x, y + h * 0.42, w * 2.2, w * 0.8, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 基利波（扫罗）与基遍（会幕与铜坛）：中丘层的右端 ──
  function drawGibeon(ctx) {
    const k = lv('chGibeon');
    if (k < 0.01) return;
    sprites();
    const xf = X('gil'), x = xf * W.w, g = gY(1, xf), hm = PH(1), un = W.unit;
    ctx.globalAlpha = k;
    // 会幕（摩西在旷野所造的，1:3）
    const tw = hm * 1.9, th = hm * 0.9, tx = x + hm * 0.9;
    ctx.fillStyle = css([118, 64, 52], 1);
    ctx.beginPath();
    ctx.moveTo(tx - tw / 2, g + 2); ctx.lineTo(tx - tw / 2, g - th * 0.8); ctx.lineTo(tx - tw * 0.3, g - th); ctx.lineTo(tx + tw * 0.3, g - th); ctx.lineTo(tx + tw / 2, g - th * 0.8); ctx.lineTo(tx + tw / 2, g + 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 30, 26], 1);
    ctx.fillRect(tx - tw / 2 + tw * 0.08, g - th * 0.6, tw * 0.12, th * 0.6);
    // 铜坛与一千牺牲的火
    const ax = x - hm * 0.4, aw = hm * 0.7, ah = hm * 0.4;
    ctx.fillStyle = css([150, 96, 58], 1);
    ctx.fillRect(ax - aw / 2, g - ah, aw, ah + 2);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.8 + 0.2 * Math.sin(W.t * 9);
    glowAt(ctx, SP.warm, ax, g - ah, hm * 3.5, k * (0.35 + 0.45 * nightK()) * fl);
    for (let i = 0; i < 7; i++) {
      const fx0 = ax + (i - 3) * aw * 0.16, h = hm * (0.25 + 0.15 * Math.sin(W.t * 7 + i * 1.7)) * k;
      ctx.fillStyle = i % 2 ? 'rgb(255, 150, 60)' : 'rgb(255, 214, 130)';
      ctx.globalAlpha = 0.8 * k;
      ctx.beginPath(); ctx.moveTo(fx0 - aw * 0.07, g - ah); ctx.quadraticCurveTo(fx0, g - ah - h * 1.4, fx0 + aw * 0.07, g - ah); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    smoke(ctx, ax, g - ah - hm * 0.3, k * 0.8, hm * 7, hm * 0.4, 5, false, 0.06);
  }

  // ════════════════════════════════════════════════════════════
  //  殿（近地）：殿台、廊子、圣所与至圣所、旁屋、雅斤与波阿斯、铜坛、铜海
  //  东向：门朝左（左 = 东，日出之处）
  // ════════════════════════════════════════════════════════════
  const LIME = [226, 210, 178], LIME_D = [180, 164, 136], GOLD = [232, 190, 96], BRONZE = [176, 112, 64], BRONZE_D = [118, 72, 44];
  let TG = null;
  function temple() {
    if (TG && TG.w === W.w && TG.h === W.h && TG.tall === tall()) return TG;
    const tu = TU(), x0 = X('tx0') * W.w;
    let gmin = 1e9, gmax = -1e9;
    for (let i = 0; i <= 12; i++) {
      const x = lerp(x0 - 0.1 * tu, x0 + 1.03 * tu, i / 12), g = gY(2, x / W.w);
      gmin = Math.min(gmin, g); gmax = Math.max(gmax, g);
    }
    const top = gmin - 0.035 * tu;
    // 竖屏时殿稍高一些（画面窄而高，殿不至于缩成一小块）
    const vk = tall() ? 1.35 : 1;
    return (TG = { w: W.w, h: W.h, tall: tall(), tu, vk, x0, x1: x0 + tu, top, base: gmax + 6 * W.unit, hH: 0.42 * tu * vk, hP: 0.7 * tu * vk });
  }
  function drawGloryBack(ctx) {
    const gl = lv('chGlory');
    if (gl < 0.01) return;
    sprites();
    const t = temple(), cx = t.x0 + 0.5 * t.tu, cy = t.top - t.hH * 0.6;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, cy, t.tu * 2.6, gl * (0.35 + 0.25 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawTemple(ctx) {
    const b = lv('chBuild');
    if (b < 0.004) return;
    const t = temple(), tu = t.tu, x0 = t.x0, top = t.top, un = W.unit;
    const ruin = lv('chRuin'), wild = lv('chWild'), burn = lv('chBurn'), gl = lv('chGlory'), door = lv('chDoor');
    const soot = ruin * 0.65 + burn * 0.25;
    const body = mix(LIME, SOOT, soot), bodyD = mix(LIME_D, SOOT, soot);
    const sl = sunLeft();
    const cBody = css(body, 2), cDark = css(bodyD, 2), cRim = css(lit(body), 2, rimA() * (1 - ruin * 0.7), 0.12);
    // ── 殿台 ──
    const pk = sm(0, 0.14, b), pTop = lerp(t.base, top, pk);
    ctx.fillStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(x0 - 0.08 * tu, t.base); ctx.lineTo(x0 - 0.08 * tu, pTop); ctx.lineTo(x0 + 1.03 * tu, pTop); ctx.lineTo(x0 + 1.03 * tu, t.base);
    ctx.closePath(); ctx.fill();
    // 石的层理
    ctx.strokeStyle = css(dim(bodyD, 0.7), 2, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let y = pTop + 0.018 * tu; y < t.base; y += 0.018 * tu) { ctx.moveTo(x0 - 0.08 * tu, y); ctx.lineTo(x0 + 1.03 * tu, y); }
    ctx.stroke();
    // 台阶（在廊前）
    if (pk > 0.5) {
      const s0 = x0 - 0.155 * tu, s1 = x0 - 0.08 * tu, n = 6;
      ctx.fillStyle = cBody;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const yy = lerp(t.base, pTop, (i + 1) / n);
        ctx.rect(lerp(s0, s1, i / n), yy, s1 - lerp(s0, s1, i / n) + 1, t.base - yy);
      }
      ctx.fill();
    }
    ctx.strokeStyle = cRim; ctx.lineWidth = Math.max(0.8, 1.2 * un);
    ctx.beginPath(); ctx.moveTo(x0 - 0.08 * tu, pTop); ctx.lineTo(x0 + 1.03 * tu, pTop); ctx.stroke();
    if (b < 0.1) return;
    // ── 墙渐渐升起 ──
    const wk = sm(0.1, 0.66, b);
    const hH = t.hH * (1 - ruin * 0.55), hP = t.hP * (1 - ruin * 0.62);
    const clipY = top - Math.max(hH, hP) * wk - 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0 - 0.3 * tu, clipY, 1.5 * tu, top - clipY + 2); ctx.clip();
    // 圣所与至圣所（长的殿身）
    const hx0 = x0 + 0.2 * tu, hx1 = x0 + tu;
    const gr = ctx.createLinearGradient(0, top - hH, 0, top);
    gr.addColorStop(0, css(lit(body), 2, null, 0.05 * (1 - ruin))); gr.addColorStop(1, cBody);
    ctx.fillStyle = gr;
    ctx.beginPath();
    if (ruin > 0.05) {
      ctx.moveTo(hx0, top);
      const n = 10;
      for (let i = 0; i <= n; i++) ctx.lineTo(lerp(hx0, hx1, i / n), top - hH * (1 - ruin * 0.6 * U.hash1(i * 3.1 + 7)));
      ctx.lineTo(hx1, top); ctx.closePath();
    } else ctx.rect(hx0, top - hH, hx1 - hx0, hH + 1);
    ctx.fill();
    // 旁屋（三层）
    const sh = 0.2 * tu * t.vk * (1 - ruin * 0.4);
    ctx.fillStyle = css(mix(LIME_D, SOOT, soot), 2);
    ctx.fillRect(hx0 + 0.04 * tu, top - sh, hx1 - hx0 - 0.02 * tu, sh + 1);
    ctx.strokeStyle = css(dim(bodyD, 0.6), 2, 0.5);
    ctx.lineWidth = Math.max(0.5, 0.7 * un);
    ctx.beginPath();
    for (let j = 1; j < 3; j++) { const y = top - sh * j / 3; ctx.moveTo(hx0 + 0.04 * tu, y); ctx.lineTo(hx1 - 0.02 * tu, y); }
    ctx.stroke();
    // 旁屋的小窗与殿身的窄窗（荣光时透出金光）
    const winGlow = clamp(gl * 0.9 + nightK() * 0.35 * (1 - ruin) * (1 - burn) * door, 0, 1);
    ctx.fillStyle = css(HOLE, 2);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const wx = lerp(hx0 + 0.09 * tu, hx1 - 0.06 * tu, i / 8);
      for (let j = 0; j < 3; j++) ctx.rect(wx - 0.008 * tu, top - sh * (j + 0.72) / 3, 0.016 * tu, sh * 0.13);
      if (ruin < 0.3) ctx.rect(wx - 0.007 * tu, top - hH * 0.84, 0.014 * tu, hH * 0.2);
    }
    ctx.fill();
    if (winGlow > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 214, 130, 0.85 * winGlow);
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const wx = lerp(hx0 + 0.09 * tu, hx1 - 0.06 * tu, i / 8);
        if (ruin < 0.3) ctx.rect(wx - 0.007 * tu, top - hH * 0.84, 0.014 * tu, hH * 0.2);
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    // 石的层理与壁柱（分开一间一间的窗）
    ctx.strokeStyle = css(dim(body, 0.72), 2, 0.22);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let y = top - sh - 0.035 * tu; y > top - hH + 0.02 * tu; y -= 0.035 * tu) { ctx.moveTo(hx0, y); ctx.lineTo(hx1, y); }
    ctx.stroke();
    ctx.strokeStyle = css(dim(body, 0.8), 2, 0.4);
    ctx.lineWidth = Math.max(0.7, 1.1 * un);
    ctx.beginPath();
    for (let i = 0; i <= 9; i++) { const px = lerp(hx0 + 0.045 * tu, hx1 - 0.015 * tu, i / 9); ctx.moveTo(px, top - sh); ctx.lineTo(px, top - hH * (1 - ruin * 0.6)); }
    ctx.stroke();
    // 檐：一道挑出的檐口，檐下一线阴影，檐上一线金
    const rk = sm(0.6, 0.78, b) * (1 - sm(0.05, 0.3, ruin));
    if (rk > 0.01) {
      ctx.globalAlpha = rk;
      ctx.fillStyle = css(dim(body, 0.62), 2, 0.6);
      ctx.fillRect(hx0, top - hH, hx1 - hx0, 0.012 * tu);
      ctx.fillStyle = css(mix(lit(LIME), SOOT, soot), 2, null, 0.05);
      ctx.fillRect(hx0 - 0.006 * tu, top - hH - 0.024 * tu, hx1 - hx0 + 0.012 * tu, 0.026 * tu);
      ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.12);
      ctx.fillRect(hx0 - 0.006 * tu, top - hH - 0.03 * tu, hx1 - hx0 + 0.012 * tu, 0.007 * tu);
      ctx.globalAlpha = 1;
    }
    // ── 廊子（高耸的门楼，里面贴上精金）──
    const px0 = x0, px1 = x0 + 0.24 * tu;
    const gp = ctx.createLinearGradient(px0, 0, px1, 0);
    gp.addColorStop(0, sl ? css(lit(body), 2, null, 0.06) : cDark); gp.addColorStop(1, sl ? cBody : css(lit(body), 2, null, 0.04));
    ctx.fillStyle = gp;
    ctx.beginPath();
    if (ruin > 0.05) {
      ctx.moveTo(px0, top); ctx.lineTo(px0 + 0.01 * tu, top - hP * (1 - 0.3 * ruin)); ctx.lineTo(px0 + 0.07 * tu, top - hP * (1 - 0.1 * ruin));
      ctx.lineTo(px0 + 0.13 * tu, top - hP * (1 - 0.5 * ruin)); ctx.lineTo(px1 - 0.03 * tu, top - hP * (1 - 0.2 * ruin)); ctx.lineTo(px1, top - hP * 0.55); ctx.lineTo(px1, top);
      ctx.closePath();
    } else {
      ctx.moveTo(px0, top); ctx.lineTo(px0 + 0.008 * tu, top - hP); ctx.lineTo(px1 - 0.008 * tu, top - hP); ctx.lineTo(px1, top); ctx.closePath();
    }
    ctx.fill();
    // 廊的石层、两道金带、挑出的檐
    ctx.strokeStyle = css(dim(body, 0.72), 2, 0.22);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let y = top - 0.04 * tu; y > top - hP * 0.98; y -= 0.04 * tu) { ctx.moveTo(px0 + 0.004 * tu, y); ctx.lineTo(px1 - 0.004 * tu, y); }
    ctx.stroke();
    if (rk > 0.01) {
      ctx.globalAlpha = rk;
      ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.12);
      ctx.fillRect(px0 + 0.004 * tu, top - hP * 0.62, px1 - px0 - 0.008 * tu, 0.008 * tu);
      ctx.fillStyle = css(dim(body, 0.62), 2, 0.6);
      ctx.fillRect(px0, top - hP, px1 - px0, 0.012 * tu);
      ctx.fillStyle = css(mix(lit(LIME), SOOT, soot), 2, null, 0.05);
      ctx.fillRect(px0 - 0.012 * tu, top - hP - 0.028 * tu, px1 - px0 + 0.024 * tu, 0.03 * tu);
      ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.14);
      ctx.fillRect(px0 - 0.012 * tu, top - hP - 0.036 * tu, px1 - px0 + 0.024 * tu, 0.008 * tu);
      ctx.globalAlpha = 1;
    }
    // 门：金门框，开着时里面是灯台的光；封锁时是深色的门扇
    const dw = 0.1 * tu, dh = 0.32 * tu * t.vk, dx = (px0 + px1) / 2;
    const gk = sm(0.78, 0.95, b) * (1 - ruin);
    ctx.fillStyle = css(dim(body, 0.7), 2);
    ctx.fillRect(dx - dw / 2 - 0.03 * tu, top - dh - 0.04 * tu, dw + 0.06 * tu, dh + 0.04 * tu);
    ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.12 * gk);
    ctx.fillRect(dx - dw / 2 - 0.014 * tu, top - dh - 0.02 * tu, dw + 0.028 * tu, dh + 0.02 * tu);
    const inner = clamp(door * (0.35 + 0.65 * Math.max(gl, nightK() * 0.8)), 0, 1) * (1 - ruin);
    ctx.fillStyle = ruin > 0.4 ? css([30, 24, 20], 2) : U.rgba(lerp(40, 255, inner), lerp(30, 206, inner), lerp(24, 120, inner), 1);
    ctx.fillRect(dx - dw / 2, top - dh, dw, dh);
    if (door < 0.98 && ruin < 0.4) {   // 门扇
      const cw = (dw / 2) * (1 - door);
      ctx.fillStyle = css(mix([120, 84, 52], GOLD, 0.35 * gk), 2);
      ctx.fillRect(dx - dw / 2, top - dh, cw, dh);
      ctx.fillRect(dx + dw / 2 - cw, top - dh, cw, dh);
      ctx.strokeStyle = css(GOLD, 2, 0.6 * gk);
      ctx.lineWidth = Math.max(0.5, 0.6 * un);
      ctx.beginPath(); ctx.moveTo(dx - dw / 2 + cw, top - dh); ctx.lineTo(dx - dw / 2 + cw, top); ctx.moveTo(dx + dw / 2 - cw, top - dh); ctx.lineTo(dx + dw / 2 - cw, top); ctx.stroke();
    }
    // 迎光的边
    ctx.strokeStyle = cRim; ctx.lineWidth = Math.max(0.8, 1.3 * un);
    ctx.beginPath();
    if (sl) { ctx.moveTo(px0, top); ctx.lineTo(px0 + 0.008 * tu, top - hP); ctx.lineTo(px1, top - hP); ctx.moveTo(px1, top - hH); ctx.lineTo(hx1, top - hH); }
    else { ctx.moveTo(hx1, top); ctx.lineTo(hx1, top - hH); ctx.lineTo(px1, top - hH); ctx.moveTo(px1, top - hP); ctx.lineTo(px0, top - hP); }
    ctx.stroke();
    ctx.restore();
    // 脚手架（建造时）
    const sc = sm(0.08, 0.2, b) * (1 - sm(0.84, 0.97, b));
    if (sc > 0.01) {
      const yT = top - Math.max(hH, hP) * wk;
      ctx.globalAlpha = sc * 0.75;
      ctx.strokeStyle = css([96, 72, 50], 2);
      ctx.lineWidth = Math.max(0.7, 1.1 * un);
      ctx.beginPath();
      const xs = [];
      for (let i = 0; i <= 5; i++) xs.push(lerp(x0 - 0.03 * tu, x0 + 1.02 * tu, i / 5));
      for (const x of xs) { ctx.moveTo(x, top); ctx.lineTo(x, yT - 0.06 * tu); }
      for (let y = top - 0.12 * tu; y > yT - 0.05 * tu; y -= 0.12 * tu) { ctx.moveTo(xs[0], y); ctx.lineTo(xs[xs.length - 1], y); }
      for (let i = 0; i < xs.length - 1; i += 2) { ctx.moveTo(xs[i], top - 0.12 * tu); ctx.lineTo(xs[i + 1], Math.max(yT, top - 0.24 * tu)); }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // ── 雅斤与波阿斯 ──
    const pl = sm(0.84, 1, b);
    if (pl > 0.01) drawPillars(ctx, t, pl, ruin, soot);
    // 残垣断壁：殿台上与台前的乱石
    if (ruin > 0.2) {
      const rr = sm(0.2, 0.8, ruin);
      ctx.fillStyle = css(mix(LIME_D, SOOT, 0.45), 2);
      ctx.beginPath();
      for (let i = 0; i < 18; i++) {
        const x = lerp(x0 - 0.05 * tu, x0 + 1.0 * tu, U.hash1(i * 7 + 2)), r0 = 0.035 * tu * (0.5 + U.hash1(i + 9)) * rr;
        ctx.moveTo(x + r0, top + 1); ctx.ellipse(x, top + 1, r0, r0 * 0.7, 0, Math.PI, 0, false);
      }
      for (let i = 0; i < 9; i++) {
        const x = lerp(x0 - 0.35 * tu, x0 + 1.05 * tu, U.hash1(i * 11 + 5)), g = gY(2, x / W.w) + 2 * un, bw = 0.03 * tu * (0.6 + U.hash1(i + 3)) * rr;
        ctx.save(); ctx.translate(x, g - bw * 0.3); ctx.rotate((U.hash1(i + 17) - 0.5) * 0.8); ctx.rect(-bw, -bw * 0.5, bw * 2, bw); ctx.restore();
      }
      ctx.fill();
      ctx.strokeStyle = css(dim(LIME_D, 0.5), 2, 0.5 * rr);
      ctx.lineWidth = Math.max(0.5, 0.6 * un);
      ctx.stroke();
    }
    // 废墟上的草木
    if (wild > 0.02) {
      ctx.fillStyle = css([88, 126, 66], 2, 0.8 * wild);
      ctx.beginPath();
      for (let i = 0; i < 14; i++) {
        const x = lerp(x0 - 0.06 * tu, x0 + 1.02 * tu, i / 13), hh = 0.04 * tu * (0.5 + U.hash1(i + 3)) * wild;
        ctx.moveTo(x - 0.05 * tu, top + 1); ctx.quadraticCurveTo(x, top - hh * 2, x + 0.05 * tu, top + 1);
      }
      ctx.fill();
      ctx.strokeStyle = css([76, 110, 58], 2, 0.8 * wild);
      ctx.lineWidth = Math.max(0.6, 0.9 * un);
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const x = lerp(hx0 + 0.05 * tu, hx1 - 0.05 * tu, i / 8), h0 = top - hH * 0.5 * U.hash1(i + 11);
        ctx.moveTo(x, top); ctx.bezierCurveTo(x + 0.02 * tu, lerp(top, h0, 0.4), x - 0.02 * tu, lerp(top, h0, 0.7), x + 0.01 * tu, lerp(top, h0, wild));
      }
      ctx.stroke();
      // 花
      const cols = ['#f4d35e', '#e86a92', '#f6f1e7', '#9a7fe0'];
      for (let i = 0; i < 16; i++) {
        const x = lerp(x0 - 0.3 * tu, x0 + 1.02 * tu, U.hash1(i * 5 + 1)), y = gY(2, x / W.w) + PH(2) * (0.02 + 0.2 * U.hash1(i * 3 + 2));
        ctx.globalAlpha = clamp(wild * 1.4 - 0.4, 0, 1) * (0.4 + 0.6 * W.daylight);
        ctx.fillStyle = cols[i % 4];
        ctx.beginPath(); ctx.arc(x, y, 1.3 * un, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }
  function drawPillars(ctx, t, pl, ruin, soot) {
    const tu = t.tu, un = W.unit, H = 0.45 * tu * t.vk * pl;
    const col = mix([150, 98, 58], SOOT, soot * 0.8), capC = mix([206, 158, 84], SOOT, soot * 0.8);
    const rimC = css(lit(col), 2, rimA(), 0.15), sl = sunLeft();
    // 波阿斯（左，在后）· 雅斤（右，在前）：侧看时一前一后
    const P = [[t.x0 - 0.018 * tu, 0.03 * tu, 0.85], [t.x0 - 0.062 * tu, 0, 1]];
    for (const [px, dy, k] of P) {
      const y0 = t.top - dy, w = 0.032 * tu * k, h = H * (ruin > 0.3 ? 0.35 + 0.3 * (k - 0.85) * 4 : 1);
      const back = (1 - k) * 1.5;
      // 柱身：一侧迎光的圆柱
      const g = ctx.createLinearGradient(px - w / 2, 0, px + w / 2, 0);
      const cL = css(mix(lit(col), [40, 30, 26], back), 2, null, 0.08), cD = css(mix(dim(col, 0.62), [40, 30, 26], back), 2);
      g.addColorStop(0, sl ? cL : cD); g.addColorStop(0.55, css(mix(col, [40, 30, 26], back), 2)); g.addColorStop(1, sl ? cD : cL);
      ctx.fillStyle = g;
      ctx.fillRect(px - w / 2, y0 - h, w, h + 1);
      // 柱础
      ctx.fillStyle = css(mix(dim(col, 0.8), [40, 30, 26], back), 2);
      ctx.fillRect(px - w * 0.7, y0 - 0.012 * tu, w * 1.4, 0.012 * tu + 1);
      if (ruin < 0.3) {
        // 柱顶：百合花样的碗、网子与石榴（3:15–16）
        const cy = y0 - h, cw = w * 2, ch = 0.055 * tu * k;
        ctx.fillStyle = css(mix(capC, [40, 30, 26], back), 2, null, 0.1);
        ctx.beginPath();
        ctx.moveTo(px - w / 2, cy + 1); ctx.quadraticCurveTo(px - cw * 0.56, cy - ch * 0.35, px - cw * 0.5, cy - ch);
        ctx.quadraticCurveTo(px - cw * 0.3, cy - ch * 0.82, px - cw * 0.16, cy - ch * 1.12);
        ctx.quadraticCurveTo(px, cy - ch * 0.86, px + cw * 0.16, cy - ch * 1.12);
        ctx.quadraticCurveTo(px + cw * 0.3, cy - ch * 0.82, px + cw * 0.5, cy - ch);
        ctx.quadraticCurveTo(px + cw * 0.56, cy - ch * 0.35, px + w / 2, cy + 1); ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = css(dim(capC, 0.6), 2, 0.6 * k);
        ctx.lineWidth = Math.max(0.4, 0.5 * un);
        ctx.beginPath();
        for (let i = 1; i < 4; i++) { ctx.moveTo(px - cw * 0.46 + i * cw * 0.23, cy - ch * 0.15); ctx.lineTo(px - cw * 0.46 + i * cw * 0.23 + cw * 0.08, cy - ch * 0.75); }
        ctx.stroke();
        ctx.fillStyle = css(mix([186, 70, 64], SOOT, soot), 2, k);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) { const cx = px - cw * 0.42 + i * cw * 0.168, r = Math.max(0.8, 0.0055 * tu); ctx.moveTo(cx + r, cy - ch * 0.3); ctx.arc(cx, cy - ch * 0.3, r, 0, TAU); }
        ctx.fill();
      }
      ctx.strokeStyle = rimC; ctx.lineWidth = Math.max(0.6, un);
      ctx.beginPath(); const ex = sl ? px - w / 2 : px + w / 2; ctx.moveTo(ex, y0); ctx.lineTo(ex, y0 - h); ctx.stroke();
    }
  }
  // 铜坛（4:1）：方的，四角有角；坛东有上去的斜坡
  function altarGeom() {
    const tu = TU(), x = altX() * W.w, g = gY(2, altX()) + 2 * W.unit;
    return { x, g, w: 0.13 * tu, h: 0.085 * tu, tu };
  }
  function drawAltar(ctx) {
    const k = lv('chAltar'), ruin = lv('chRuin');
    if (k < 0.01) return;
    const A = altarGeom(), un = W.unit, col = mix(BRONZE, SOOT, ruin * 0.6);
    const h = A.h * U.easeOut(k) * (1 - ruin * 0.4);
    ctx.fillStyle = css(col, 2);
    ctx.beginPath();
    ctx.rect(A.x - A.w / 2, A.g - h, A.w, h);
    // 坛东的斜坡
    ctx.moveTo(A.x - A.w / 2, A.g - h * 0.72); ctx.lineTo(A.x - A.w * 1.25, A.g); ctx.lineTo(A.x - A.w / 2, A.g); ctx.closePath();
    ctx.fill();
    // 四角的角
    if (ruin < 0.5) {
      ctx.beginPath();
      for (const s of [-1, 1]) { const cx = A.x + s * (A.w / 2 - 0.006 * A.tu); ctx.moveTo(cx - 0.008 * A.tu, A.g - h); ctx.lineTo(cx, A.g - h - 0.018 * A.tu); ctx.lineTo(cx + 0.008 * A.tu, A.g - h); }
      ctx.fill();
    }
    // 铜网与环
    ctx.strokeStyle = css(dim(col, 0.6), 2, 0.7);
    ctx.lineWidth = Math.max(0.5, 0.7 * un);
    ctx.beginPath();
    ctx.moveTo(A.x - A.w / 2, A.g - h * 0.5); ctx.lineTo(A.x + A.w / 2, A.g - h * 0.5);
    for (let i = 1; i < 6; i++) { const x = A.x - A.w / 2 + A.w * i / 6; ctx.moveTo(x, A.g - h * 0.5); ctx.lineTo(x, A.g); }
    ctx.stroke();
    ctx.strokeStyle = css(lit(col), 2, rimA(), 0.2);
    ctx.lineWidth = Math.max(0.7, 1.1 * un);
    ctx.beginPath(); ctx.moveTo(A.x - A.w / 2, A.g - h); ctx.lineTo(A.x + A.w / 2, A.g - h); ctx.stroke();
    const f = lv('chFire');
    if (f > 0.01) {
      smoke(ctx, A.x, A.g - h - 0.02 * A.tu, Math.min(1, f) * k, W.h * 0.25 + 0.6 * A.tu, 0.03 * A.tu, 3, false, 0.07);
      flame(ctx, A.x, A.g - h + 1, 0.06 * A.tu * (0.6 + 0.5 * Math.min(1.6, f)), Math.min(1, f) * k, 3, A.w * 0.4);
    }
  }
  // 大卫在禾场上筑的坛（石坛）
  function drawDAltar(ctx) {
    const k = lv('chDAltar');
    if (k < 0.01) return;
    const A = altarGeom(), un = W.unit, s = A.tu * 0.012;
    const n = 9, shown = k * n;
    ctx.fillStyle = css([140, 128, 110], 2);
    ctx.beginPath();
    const R = U.mulberry32(77);
    for (let i = 0; i < n && i < shown; i++) {
      const row = i < 4 ? 0 : i < 7 ? 1 : 2, idx = row === 0 ? i : row === 1 ? i - 4 : i - 7, cnt = [4, 3, 2][row];
      const cx = A.x + (idx - (cnt - 1) / 2) * 4.6 * s + (R() - 0.5) * s, cy = A.g - 1.6 * s - row * 3.2 * s, kk = clamp(shown - i, 0, 1);
      ctx.moveTo(cx + 2.6 * s, cy); ctx.ellipse(cx, cy, 2.6 * s, 1.9 * s * kk, (R() - 0.5) * 0.4, 0, TAU);
    }
    ctx.fill();
    const f = lv('chDFire');
    if (f > 0.01) {
      const top = A.g - 9.5 * s;
      smoke(ctx, A.x, top - 4 * s, f * k, W.h * 0.22, 5 * s, 11, false, 0.07);
      flame(ctx, A.x, top + 2 * s, 11 * s * (0.8 + 0.4 * Math.min(1.5, f)), Math.min(1, f) * k, 11, 6 * s);
    }
  }
  // 铜海（4:2–5）：圆的，边如百合花，立在十二只铜牛上
  function drawSea(ctx) {
    const k = lv('chSea'), ruin = lv('chRuin');
    if (k < 0.01 || ruin > 0.9) return;
    const t = temple(), x = seaX() * W.w, g = gY(2, seaX()) + 3 * W.unit, tu = t.tu, un = W.unit;
    const col = mix([160, 104, 60], SOOT, ruin * 0.6), a = k * (1 - sm(0.5, 0.9, ruin)), sl = sunLeft();
    const bw = 0.18 * tu, bh = 0.07 * tu, ob = 0.042 * tu, rimY = g - ob - bh;
    ctx.globalAlpha = a;
    // 铜牛：头朝外，一行站着（侧看只见一半）
    ctx.fillStyle = css(dim(col, 0.72), 2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const ox = x - bw * 0.36 + i * bw * 0.18, f = i < 2 ? -1 : i > 2 ? 1 : (i % 2 ? 1 : -1);
      const bx = ob * 0.55, by = ob * 0.3;
      ctx.moveTo(ox + bx, g - ob * 0.62); ctx.ellipse(ox, g - ob * 0.62, bx, by, 0, 0, TAU);
      ctx.moveTo(ox + f * bx * 1.3 + ob * 0.16, g - ob * 0.75); ctx.ellipse(ox + f * bx * 1.3, g - ob * 0.75, ob * 0.16, ob * 0.13, 0, 0, TAU);
      for (const lx of [-0.6, -0.25, 0.25, 0.6]) ctx.rect(ox + lx * bx - 0.3 * un, g - ob * 0.4, Math.max(0.8, 0.004 * tu), ob * 0.4);
    }
    ctx.fill();
    // 碗：深而圆
    const gr = ctx.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0);
    gr.addColorStop(0, css(sl ? lit(col) : dim(col, 0.7), 2, null, 0.06)); gr.addColorStop(0.5, css(col, 2)); gr.addColorStop(1, css(sl ? dim(col, 0.7) : lit(col), 2, null, 0.06));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x - bw / 2, rimY);
    ctx.bezierCurveTo(x - bw * 0.48, rimY + bh * 0.9, x - bw * 0.22, g - ob + 1, x, g - ob + 1);
    ctx.bezierCurveTo(x + bw * 0.22, g - ob + 1, x + bw * 0.48, rimY + bh * 0.9, x + bw / 2, rimY);
    ctx.closePath(); ctx.fill();
    // 碗边（向外翻，如百合花）与一圈瓜样的饰纹（4:3）
    ctx.fillStyle = css(lit(col), 2, null, 0.12);
    ctx.beginPath(); ctx.ellipse(x, rimY, bw * 0.54, Math.max(1.2, 0.012 * tu), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css(dim(col, 0.6), 2, 0.7);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const cx = x - bw * 0.4 + i * bw * 0.1, r = Math.max(0.7, 0.005 * tu); ctx.moveTo(cx + r, rimY + bh * 0.28); ctx.arc(cx, rimY + bh * 0.28, r, 0, TAU); }
    ctx.fill();
    // 水面的反光
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = U.rgba(220, 236, 255, 0.25 * (0.3 + 0.7 * W.daylight));
    ctx.beginPath(); ctx.ellipse(x, rimY - 0.3 * un, bw * 0.46, Math.max(0.8, 0.006 * tu), 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 所罗门的铜台（6:13）
  function drawPlatform(ctx) {
    const k = lv('chPlat');
    if (k < 0.01) return;
    const x = X('plat') * W.w, g = gY(2, X('plat')) + 2 * W.unit, w = PH(2) * 0.95, h = PH(2) * 0.16;
    ctx.globalAlpha = k;
    ctx.fillStyle = css(BRONZE, 2);
    ctx.fillRect(x - w / 2, g - h, w, h + 1);
    ctx.fillStyle = css(lit(BRONZE), 2, rimA(), 0.2);
    ctx.fillRect(x - w / 2, g - h, w, Math.max(1, W.unit));
    ctx.globalAlpha = 1;
  }
  // 站在铜台上的人，脚下的高度
  const platY = () => gY(2, X('plat')) + 2 * W.unit - PH(2) * 0.16;

  // ── 火与烟 ──
  function flame(ctx, x, y, h, k, seed, wBase) {
    if (k < 0.01) return;
    sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 4.5, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.3, 0.7, 'rgb(255,160,64)', 0.75], [0.28, 0.74, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    const wb = wBase || h * 0.3;
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = Math.max(h * 0.26 * q[1], wb * q[1] * 0.5);
      const sx = x + q[0] * wb + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = k * q[3];
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
  function smoke(ctx, x, y, k, H, w, seed, dark, rate) {
    if (k < 0.01) return;
    sprites();
    const N = 12, day = 0.3 + 0.7 * W.daylight, spr = dark ? SP.soot : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.08) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.6 : 0.42 * day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  地上的布景：禾场、约柜暂住之家、帐幕、材料、样式、银柜、堆垒
  // ════════════════════════════════════════════════════════════
  function drawFloor(ctx) {
    const k = lv('chFloor');
    if (k < 0.01) return;
    const x = altX() * W.w, g = gY(2, altX()) + 3 * W.unit, rx = TU() * 0.2, ry = PH(2) * 0.1, b = lv('chBuild');
    ctx.globalAlpha = k * (1 - 0.6 * sm(0.3, 1, b));
    ctx.fillStyle = css([196, 168, 120], 2);
    ctx.beginPath(); ctx.ellipse(x, g, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([150, 124, 88], 2, 0.6);
    ctx.lineWidth = Math.max(0.5, 0.8 * W.unit);
    ctx.beginPath(); ctx.ellipse(x, g, rx * 0.7, ry * 0.62, 0, 0, TAU); ctx.stroke();
    // 麦堆（还没有筑坛时）
    const wheat = k * (1 - lv('chDAltar')) * (1 - sm(0.05, 0.3, b));
    if (wheat > 0.01) {
      ctx.globalAlpha = wheat;
      ctx.fillStyle = css([222, 186, 110], 2);
      const hx = x + rx * 0.55;
      ctx.beginPath(); ctx.moveTo(hx - rx * 0.28, g); ctx.quadraticCurveTo(hx, g - PH(2) * 0.55, hx + rx * 0.28, g); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawObed(ctx) {
    const k = lv('chObed');
    if (k < 0.01) return;
    const xf = X('obed'), x = xf * W.w, g = gY(2, xf) + 2 * W.unit, hm = PH(2), w = hm * 1.5, h = hm * 1.05;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([190, 170, 136], 2);
    ctx.fillRect(x - w / 2, g - h, w, h + 1);
    ctx.fillStyle = css([150, 128, 96], 2);
    ctx.fillRect(x - w / 2 - 2 * W.unit, g - h - 3 * W.unit, w + 4 * W.unit, 3 * W.unit);
    ctx.fillStyle = css(HOLE, 2);
    ctx.fillRect(x + w * 0.1, g - h * 0.55, w * 0.18, h * 0.55);
    if (W.night > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 196, 120, 0.7 * W.night);
      ctx.fillRect(x + w * 0.1, g - h * 0.55, w * 0.18, h * 0.55);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = css(lit([190, 170, 136]), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, W.unit);
    ctx.beginPath(); ctx.moveTo(sunLeft() ? x - w / 2 : x + w / 2, g); ctx.lineTo(sunLeft() ? x - w / 2 : x + w / 2, g - h); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 大卫所搭的帐幕（代上 16:1）：幔子的蓝、紫、朱红
  function drawTent(ctx) {
    const k = lv('chTent');
    if (k < 0.01) return;
    const xf = X('tent'), x = xf * W.w, g = gY(2, xf) + 2 * W.unit, hm = PH(2), w = hm * 1.9, h = hm * 1.15, un = W.unit;
    ctx.globalAlpha = k;
    ctx.strokeStyle = css([110, 92, 70], 2, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath(); ctx.moveTo(x - w / 2, g - h * 0.9); ctx.lineTo(x - w * 0.85, g); ctx.moveTo(x + w / 2, g - h * 0.9); ctx.lineTo(x + w * 0.85, g); ctx.stroke();
    ctx.fillStyle = css([226, 216, 196], 2);
    ctx.beginPath(); ctx.moveTo(x - w / 2, g + 1); ctx.lineTo(x - w / 2, g - h * 0.86); ctx.lineTo(x, g - h); ctx.lineTo(x + w / 2, g - h * 0.86); ctx.lineTo(x + w / 2, g + 1); ctx.closePath(); ctx.fill();
    const bands = [[70, 88, 150], [110, 70, 128], [176, 60, 60]];
    bands.forEach((c, i) => { ctx.fillStyle = css(c, 2); ctx.fillRect(x - w / 2, g - h * (0.6 - i * 0.07), w, h * 0.06); });
    // 门帘；里面约柜的光
    const inner = S.ark === 'tent' ? 1 : 0;
    ctx.fillStyle = inner ? U.rgba(255, 214, 140, 0.9) : css([60, 46, 38], 2);
    ctx.fillRect(x - w * 0.1, g - h * 0.55, w * 0.2, h * 0.55);
    if (inner) {
      sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, g - h * 0.3, hm * 2.2, k * (0.3 + 0.4 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 建殿的材料（代上 22:2–5，14）
  const MAT = (function () {
    const r = U.mulberry32(5101), out = [];
    const kinds = ['stone', 'stone', 'cedar', 'stone', 'bronze', 'cedar', 'iron', 'gold', 'stone', 'silver', 'cedar', 'gold', 'stone', 'bronze'];
    kinds.forEach((kd, i) => out.push({ kd, u: 0.02 + i * 0.072 + (r() - 0.5) * 0.02, th: i / kinds.length * 0.9, s: 0.8 + r() * 0.4, seed: r() * 100 }));
    return out;
  })();
  function drawMaterials(ctx) {
    const k = lv('chMat'), b = lv('chBuild');
    const a = 1 - sm(0.12, 0.55, b);
    if (k < 0.01 || a < 0.01) return;
    const t = temple(), tu = t.tu, un = W.unit;
    for (const m of MAT) {
      const v = clamp((k - m.th) / 0.1, 0, 1);
      if (v <= 0) continue;
      const x = t.x0 + m.u * tu, g = gY(2, x / W.w) + 2 * un, s = 0.028 * tu * m.s;
      ctx.globalAlpha = v * a;
      if (m.kd === 'stone') {
        ctx.fillStyle = css([214, 200, 170], 2);
        ctx.fillRect(x - s * 1.5, g - s, s * 3, s); ctx.fillRect(x - s, g - s * 2, s * 2, s * 1.02);
        ctx.strokeStyle = css([160, 146, 118], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.6 * un);
        ctx.strokeRect(x - s * 1.5, g - s, s * 3, s);
      } else if (m.kd === 'cedar') {
        ctx.fillStyle = css(CEDAR, 2);
        for (let j = 0; j < 3; j++) ctx.fillRect(x - s * 1.8 + j * s * 0.3, g - s * 0.7 * (j + 1), s * 3.2, s * 0.64);
        ctx.fillStyle = css([176, 130, 88], 2);
        for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(x - s * 1.8 + j * s * 0.3, g - s * 0.7 * (j + 0.5), s * 0.32, 0, TAU); ctx.fill(); }
      } else {
        const col = m.kd === 'gold' ? [236, 196, 96] : m.kd === 'silver' ? [214, 220, 228] : m.kd === 'bronze' ? BRONZE : [96, 96, 104];
        ctx.fillStyle = css(col, 2, null, m.kd === 'gold' ? 0.15 : 0.05);
        ctx.beginPath(); ctx.moveTo(x - s * 1.3, g); ctx.quadraticCurveTo(x, g - s * 2, x + s * 1.3, g); ctx.closePath(); ctx.fill();
        if (m.kd === 'gold' || m.kd === 'silver') {
          const tw = 0.5 + 0.5 * Math.sin(W.t * 3 + m.seed);
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = m.kd === 'gold' ? 'rgb(255, 236, 170)' : 'rgb(240, 244, 255)';
          ctx.globalAlpha = v * a * tw * 0.8;
          ctx.fillRect(x - s * 0.3 + Math.sin(m.seed) * s * 0.4, g - s * 0.9, 1.6 * un, 1.6 * un);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  // 样式：殿的轮廓，由金线一笔一笔写出（代上 28:19）
  function planPaths() {
    const t = temple(), tu = t.tu, x0 = t.x0, top = t.top, A = altarGeom(), hH = t.hH, hP = t.hP;
    const P = [];
    // 殿台与台阶
    P.push([[x0 - 0.08 * tu, t.base], [x0 - 0.08 * tu, top], [x0 + 1.03 * tu, top], [x0 + 1.03 * tu, t.base]]);
    const st = [];
    for (let i = 0; i <= 6; i++) { const y = lerp(t.base, top, i / 6), x = lerp(x0 - 0.155 * tu, x0 - 0.08 * tu, i / 6); st.push([x, y]); if (i < 6) st.push([x, lerp(t.base, top, (i + 1) / 6)]); }
    P.push(st);
    // 廊子（高一百二十肘）与檐
    P.push([[x0, top], [x0 + 0.008 * tu, top - hP], [x0 + 0.232 * tu, top - hP], [x0 + 0.24 * tu, top]]);
    P.push([[x0 - 0.012 * tu, top - hP - 0.03 * tu], [x0 + 0.252 * tu, top - hP - 0.03 * tu]]);
    // 殿身：长六十肘；至圣所的幔子；三层旁屋
    P.push([[x0 + 0.24 * tu, top - hH], [x0 + tu, top - hH], [x0 + tu, top]]);
    P.push([[x0 + 0.24 * tu, top - hH - 0.024 * tu], [x0 + tu + 0.006 * tu, top - hH - 0.024 * tu]]);
    P.push([[x0 + 0.76 * tu, top], [x0 + 0.76 * tu, top - hH]]);
    const vk = t.vk;
    for (let j = 1; j <= 3; j++) P.push([[x0 + 0.24 * tu, top - 0.2 * tu * vk * j / 3], [x0 + 0.98 * tu, top - 0.2 * tu * vk * j / 3]]);
    // 窗
    for (let i = 0; i < 9; i++) { const wx = lerp(x0 + 0.29 * tu, x0 + 0.94 * tu, i / 8); P.push([[wx, top - hH * 0.84], [wx, top - hH * 0.64]]); }
    // 门
    P.push([[x0 + 0.07 * tu, top], [x0 + 0.07 * tu, top - 0.32 * tu * vk], [x0 + 0.17 * tu, top - 0.32 * tu * vk], [x0 + 0.17 * tu, top]]);
    // 两根柱子与柱顶
    for (const [px, dy, h] of [[x0 - 0.062 * tu, 0, 0.45], [x0 - 0.018 * tu, 0.03, 0.38]]) {
      const y0 = top - dy * tu, yt = y0 - h * tu * vk;
      P.push([[px, y0], [px, yt]]);
      P.push([[px - 0.032 * tu, yt - 0.05 * tu], [px - 0.016 * tu, yt], [px + 0.016 * tu, yt], [px + 0.032 * tu, yt - 0.05 * tu]]);
    }
    // 坛（长二十肘，宽二十肘，高十肘）
    P.push([[A.x - A.w * 1.25, A.g], [A.x - A.w / 2, A.g - A.h * 0.72], [A.x - A.w / 2, A.g - A.h], [A.x + A.w / 2, A.g - A.h], [A.x + A.w / 2, A.g]]);
    // 海（圆的）
    const sx = seaX() * W.w, sg = gY(2, seaX()) + 3 * W.unit, bw = 0.18 * tu, bh = 0.07 * tu, ob = 0.042 * tu, ry = sg - ob - bh;
    const bowl = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; bowl.push([sx - Math.cos(a) * bw / 2, ry + Math.sin(a) * bh]); }
    P.push(bowl);
    // 尺度：殿长的一道量线，两端有记
    const my = t.base + 0.035 * tu;
    P.push([[x0 + 0.24 * tu, my - 0.012 * tu], [x0 + 0.24 * tu, my + 0.012 * tu]]);
    P.push([[x0 + 0.24 * tu, my], [x0 + tu, my]]);
    P.push([[x0 + tu, my - 0.012 * tu], [x0 + tu, my + 0.012 * tu]]);
    let L = 0;
    for (const p of P) for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    return { P, L };
  }
  function drawPlan(ctx) {
    const a = lv('chPlanA'), prog = lv('chPlan');
    if (a < 0.01 || prog < 0.005) return;
    const { P, L } = planPaths(), un = Math.max(0.6, W.unit);
    let left = prog * L;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pulse = 0.85 + 0.15 * Math.sin(W.t * 2.2);
    const tip = [0, 0];
    for (const [wd, al] of [[6, 0.12], [1.6, 0.7]]) {
      ctx.strokeStyle = U.rgba(255, 222, 150, al * a * pulse);
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      let rem = left;
      for (const p of P) {
        if (rem <= 0) break;
        ctx.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < p.length && rem > 0; i++) {
          const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
          if (d <= rem) { ctx.lineTo(p[i][0], p[i][1]); rem -= d; tip[0] = p[i][0]; tip[1] = p[i][1]; }
          else { const f = rem / d, x = lerp(p[i - 1][0], p[i][0], f), y = lerp(p[i - 1][1], p[i][1], f); ctx.lineTo(x, y); tip[0] = x; tip[1] = y; rem = 0; }
        }
      }
      ctx.stroke();
    }
    // 笔尖的光
    if (prog < 0.999) { sprites(); glowAt(ctx, SP.gold, tip[0], tip[1], 30 * un, 0.9 * a); }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 「这就是耶和华神的殿」：殿基在地上显出（代上 22:1）
  function drawSite(ctx) {
    const k = lv('chSite');
    if (k < 0.01) return;
    const t = temple(), un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(255, 224, 160, 0.4 * k);
    ctx.lineWidth = 2 * un;
    ctx.setLineDash([6 * un, 5 * un]);
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const x = lerp(t.x0 - 0.08 * t.tu, t.x0 + 1.03 * t.tu, i / 20), y = gY(2, x / W.w) + 1; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 银柜（代下 24:8–10）
  function drawChest(ctx) {
    const k = lv('chChest');
    if (k < 0.01) return;
    const t = temple(), x = t.x0 - 0.13 * t.tu, xf = x / W.w, g = gY(2, xf) + 2 * W.unit, w = PH(2) * 0.5, h = PH(2) * 0.28;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([128, 90, 56], 2);
    ctx.fillRect(x - w / 2, g - h, w, h + 1);
    ctx.fillStyle = css(GOLD, 2);
    ctx.fillRect(x - w / 2, g - h, w, Math.max(1, h * 0.14));
    ctx.fillStyle = css([30, 24, 20], 2);
    ctx.fillRect(x - w * 0.12, g - h - 0.5, w * 0.24, Math.max(1, h * 0.1));
    // 投入柜中的银子
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(236, 240, 250)';
    for (let i = 0; i < 5; i++) {
      const ph = U.fract(W.t * 0.7 + i * 0.37);
      ctx.globalAlpha = k * (1 - ph) * 0.9;
      ctx.fillRect(x - w * 0.05 + Math.sin(i * 3) * w * 0.05, g - h - PH(2) * 0.5 * (1 - ph), 1.8 * W.unit, 1.8 * W.unit);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 堆垒（代下 31:6）
  function drawHeaps(ctx) {
    const k = lv('chHeaps');
    if (k < 0.01) return;
    const t = temple(), un = W.unit;
    const cols = [[224, 186, 104], [196, 150, 84], [168, 120, 70], [232, 200, 120]];
    for (let i = 0; i < 5; i++) {
      const xf = (t.x0 + (0.3 + i * 0.13) * t.tu) / W.w, x = xf * W.w, g = gY(2, xf) + 3 * un, w = PH(2) * (0.55 + 0.1 * (i % 2)), h = PH(2) * 0.5 * U.easeOut(clamp(k * 1.4 - i * 0.08, 0, 1));
      if (h < 1) continue;
      ctx.fillStyle = css(cols[i % 4], 2, null, 0.05);
      ctx.beginPath(); ctx.moveTo(x - w, g); ctx.quadraticCurveTo(x - w * 0.2, g - h * 1.4, x, g - h); ctx.quadraticCurveTo(x + w * 0.2, g - h * 1.4, x + w, g); ctx.closePath(); ctx.fill();
    }
  }
  // 城中各处拐角的坛（代下 28:24）：小小的烟
  function drawCorners(ctx) {
    const k = lv('chCorner');
    if (k < 0.01) return;
    const [a, b] = X('city'), hm = PH(1);
    for (let i = 0; i < 6; i++) {
      const xf = lerp(a + 0.02, b - 0.03, (i + 0.5) / 6), x = xf * W.w, g = gY(1, xf) - hm * 0.3;
      smoke(ctx, x, g, k * 0.8, hm * 3, hm * 0.18, 20 + i, true, 0.09);
      ctx.globalCompositeOperation = 'lighter';
      sprites();
      glowAt(ctx, SP.ember, x, g, hm * 0.8, k * 0.5 * (0.5 + 0.5 * Math.sin(W.t * 6 + i)));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 焚烧时，城上的天被火映红
  function drawBurnSky(ctx) {
    const k = lv('chBurn');
    if (k < 0.01) return;
    const t = temple(), cx = (t.x0 + 0.2 * t.tu), cy = W.horizonY;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W.w * 0.6);
    const f = 0.85 + 0.15 * Math.sin(W.t * 3.1) * Math.sin(W.t * 1.7);
    g.addColorStop(0, U.rgba(255, 110, 50, 0.45 * k * f)); g.addColorStop(0.45, U.rgba(190, 60, 30, 0.18 * k)); g.addColorStop(1, 'rgba(120, 30, 20, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.w, cy + 6);
  }
  // 焚烧（代下 36:19）
  function drawBurn(ctx, pass) {
    const k = lv('chBurn');
    if (k < 0.01) return;
    sprites();
    if (pass === 'mid') {
      const [a, b] = X('city'), hm = PH(1);
      for (let i = 0; i < 5; i++) {
        const xf = lerp(a + 0.02, b - 0.02, i / 4), x = xf * W.w, g = gY(1, xf) - hm * 0.6;
        smoke(ctx, x, g - hm * 0.4, k, W.h * 0.35, hm * 1.1, 31 + i, true, 0.045);
        flame(ctx, x, g + hm * 0.5, hm * (1.1 + 0.6 * U.hash1(i)), k, 31 + i, hm * 0.7);
      }
      return;
    }
    const t = temple(), tu = t.tu;
    glowAt(ctx, SP.warm, t.x0 + 0.5 * tu, t.top - t.hH * 0.5, tu * 2.2, 0.35 * k);
    ctx.globalAlpha = 1;
    for (let i = 0; i < 5; i++) {
      const x = t.x0 + (0.02 + i * 0.24) * tu, y = t.top - t.hH * (0.3 + 0.35 * U.hash1(i + 2));
      smoke(ctx, x, y - 0.12 * tu, k, W.h * 0.5, 0.11 * tu, 41 + i, true, 0.04);
    }
    // 火：大小不一，此起彼伏
    for (let i = 0; i < 11; i++) {
      const x = t.x0 + (-0.04 + i * 0.1 + 0.03 * U.hash1(i * 5)) * tu, y = t.top - t.hH * (0.12 + 0.6 * U.hash1(i + 2)) * (i % 3 ? 1 : 0.5);
      const pulse = 0.6 + 0.4 * Math.sin(W.t * (0.7 + U.hash1(i + 8)) + i * 2.3);
      flame(ctx, x, y + 0.05 * tu, 0.16 * tu * (0.5 + 0.7 * U.hash1(i + 5)) * pulse, k * (0.55 + 0.45 * pulse), 41 + i, 0.05 * tu * (0.6 + U.hash1(i + 1)));
    }
  }

  // ════════════════════════════════════════════════════════════
  //  约柜：金的柜，施恩座上两个基路伯张着翅膀
  // ════════════════════════════════════════════════════════════
  function arkPos() {
    const m = S.ark;
    if (m === 'none' || m === 'tent' || m === 'in') return null;
    if (m === 'obed') { const xf = X('obed') - 0.035; return { x: xf * W.w, y: gY(2, xf) - PH(2) * 0.02, s: 1 }; }
    if (m === 'cart') {
      const c = fig('ch:cart');
      if (!c) return null;
      const xf = c.nx, y = (c._vis ? c._y : gY(2, xf)) - PH(2) * 0.42;
      return { x: xf * W.w, y, s: 1, a: c.alpha == null ? 1 : c.alpha };
    }
    if (m === 'poles') {
      let sx = 0, n = 0, sy = 0, al = 1;
      for (const id of S.bearers) {
        const p = fig(id);
        if (!p) continue;
        sx += p._vis ? p._x : p.nx * W.w; sy += p._vis ? p._y : gY(2, p.nx); n++;
        al = Math.min(al, p.alpha == null ? 1 : p.alpha);
      }
      if (!n) return null;
      return { x: sx / n, y: sy / n - PH(2) * 0.72, s: 1, a: al };
    }
    return null;
  }
  function drawArk(ctx) {
    const p = arkPos();
    if (!p) return;
    const u = PH(2) * 0.5 * p.s, x = p.x, y = p.y, un = W.unit, al = clamp(p.a == null ? 1 : p.a, 0, 1);
    sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - u * 0.3, u * 5, al * (0.3 + 0.3 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = al;
    // 杠
    if (S.ark === 'poles') {
      ctx.strokeStyle = css([150, 110, 56], 2);
      ctx.lineWidth = Math.max(1, 1.4 * un);
      ctx.beginPath(); ctx.moveTo(x - u * 2.4, y + u * 0.15); ctx.lineTo(x + u * 2.4, y + u * 0.15); ctx.stroke();
    }
    // 柜
    ctx.fillStyle = css([226, 182, 86], 2, null, 0.12);
    ctx.fillRect(x - u * 0.75, y - u * 0.55, u * 1.5, u * 0.7);
    ctx.fillStyle = css([248, 214, 120], 2, null, 0.18);
    ctx.fillRect(x - u * 0.8, y - u * 0.62, u * 1.6, u * 0.1);
    // 两个基路伯（翅膀向前相遮）
    ctx.beginPath();
    for (const s of [-1, 1]) {
      const bx = x + s * u * 0.5;
      ctx.moveTo(bx, y - u * 0.62);
      ctx.quadraticCurveTo(bx + s * u * 0.08, y - u * 1.0, bx - s * u * 0.02, y - u * 1.02);
      ctx.quadraticCurveTo(bx - s * u * 0.35, y - u * 1.15, bx - s * u * 0.52, y - u * 0.98);
      ctx.quadraticCurveTo(bx - s * u * 0.25, y - u * 0.86, bx - s * u * 0.12, y - u * 0.62);
      ctx.closePath();
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  乐器（号、钹、瑟、琴）与声合为一的光环
  // ════════════════════════════════════════════════════════════
  const TRUMP = ['pr0', 'pr1', 'pr2', 'pr3', 'pr4', 'pr5'];
  const SING = ['sg0', 'sg1', 'sg2', 'sg3', 'sg4', 'sg5'];
  const INSTR = { sg0: 'cym', sg1: 'harp', sg2: 'lyre', sg3: 'cym', sg4: 'harp', sg5: 'lyre' };
  const UPRIGHT = { stand: 1, walk: 1, run: 1, raise: 1, point: 1, carry: 1, gaze: 1 };
  function drawInstruments(ctx) {
    const play = lv('chPlay');
    const any = TRUMP.concat(SING).some(id => has(id));
    if (!any) return;
    const un = Math.max(0.6, W.unit);
    const beat = U.fract(W.t / 0.9);
    for (const id of TRUMP) {
      const p = fig(id);
      if (!p || !p._vis || !UPRIGHT[p.pose] || p.alpha < 0.05) continue;
      const h = p._h, f = p.facing || 1, up = play;
      const mx = p._x + f * h * 0.05, my = p._y - h * 0.9;
      const ang = lerp(1.2, -0.35, up), L = h * 0.62;
      const ex = mx + f * Math.cos(ang) * L, ey = my + Math.sin(ang) * L;
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = 'rgb(214, 220, 228)';
      ctx.lineWidth = Math.max(0.9, h * 0.028);
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
      // 号口
      const bx = f * Math.cos(ang), by = Math.sin(ang), nx = -by, ny = bx;
      ctx.fillStyle = 'rgb(226, 232, 240)';
      ctx.beginPath();
      ctx.moveTo(ex - bx * h * 0.06 + nx * h * 0.012, ey - by * h * 0.06 + ny * h * 0.012);
      ctx.lineTo(ex + nx * h * 0.05, ey + ny * h * 0.05); ctx.lineTo(ex - nx * h * 0.05, ey - ny * h * 0.05);
      ctx.lineTo(ex - bx * h * 0.06 - nx * h * 0.012, ey - by * h * 0.06 - ny * h * 0.012);
      ctx.closePath(); ctx.fill();
      if (play > 0.5) {
        sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.silver, ex, ey, h * 0.5, 0.35 * play * (0.6 + 0.4 * Math.sin(W.t * 6 + p.nx * 40)));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    for (const id of SING) {
      const p = fig(id);
      if (!p || !p._vis || !UPRIGHT[p.pose] || p.alpha < 0.05) continue;
      const h = p._h, f = p.facing || 1, kind = INSTR[id];
      const cx = p._x + f * h * 0.2, cy = p._y - h * 0.6;
      ctx.globalAlpha = p.alpha;
      if (kind === 'cym') {
        const gap = h * (0.03 + 0.1 * (play > 0.3 ? Math.abs(Math.sin(W.t * Math.PI / 0.9)) : 0.5));
        ctx.fillStyle = 'rgb(232, 196, 100)';
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx, cy + s * gap, h * 0.09, h * 0.025, 0, 0, TAU); ctx.fill(); }
        if (play > 0.3 && beat < 0.15) {
          sprites(); ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, SP.gold, cx, cy, h * 0.6, 0.5 * play * (1 - beat / 0.15));
          ctx.globalCompositeOperation = 'source-over';
        }
      } else if (kind === 'harp') {
        ctx.strokeStyle = 'rgb(176, 128, 72)';
        ctx.lineWidth = Math.max(0.8, h * 0.025);
        ctx.beginPath(); ctx.moveTo(cx - f * h * 0.04, cy + h * 0.14); ctx.lineTo(cx + f * h * 0.08, cy - h * 0.22); ctx.lineTo(cx + f * h * 0.14, cy + h * 0.1); ctx.closePath(); ctx.stroke();
        ctx.strokeStyle = 'rgba(240, 230, 200, 0.7)';
        ctx.lineWidth = Math.max(0.4, h * 0.008);
        ctx.beginPath();
        for (let i = 1; i < 4; i++) { const tt = i / 4; ctx.moveTo(lerp(cx - f * h * 0.04, cx + f * h * 0.08, tt), lerp(cy + h * 0.14, cy - h * 0.22, tt)); ctx.lineTo(lerp(cx - f * h * 0.04, cx + f * h * 0.14, tt), lerp(cy + h * 0.14, cy + h * 0.1, tt)); }
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgb(168, 120, 70)';
        ctx.lineWidth = Math.max(0.8, h * 0.025);
        ctx.beginPath(); ctx.moveTo(cx - h * 0.07, cy - h * 0.14); ctx.quadraticCurveTo(cx - h * 0.08, cy + h * 0.08, cx, cy + h * 0.08); ctx.quadraticCurveTo(cx + h * 0.08, cy + h * 0.08, cx + h * 0.07, cy - h * 0.14);
        ctx.moveTo(cx - h * 0.08, cy - h * 0.12); ctx.lineTo(cx + h * 0.08, cy - h * 0.12); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 歌声：每人头上一圈光环，都在同一个拍子上；声合为一时，众声汇成一道光，升到殿上
  function drawSong(ctx) {
    const k = lv('chSong');
    if (k < 0.01) return;
    const un = Math.max(0.6, W.unit), per = 1.8;
    const ids = TRUMP.concat(SING);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = Math.max(0.6, 1 * un);
    let cx = 0, cy = 0, n = 0, top = 1e9;
    const ph = U.fract(W.t / per);
    for (const id of ids) {
      const p = fig(id);
      if (!p || !p._vis || p.alpha < 0.1) continue;
      const hx = p._x, hy = p._y - p._h * 1.02;
      cx += hx; cy += hy; n++; top = Math.min(top, hy);
      const r = p._h * (0.1 + ph * 0.42);
      ctx.strokeStyle = U.rgba(255, 228, 164, 0.3 * k * (1 - ph) * p.alpha);
      ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.stroke();
    }
    if (n && S.one) {
      cx /= n; cy = top;
      const since = W.t - S.oneT0, a0 = k * Math.min(1, since / 2);
      sprites();
      // 一个大的光环（众声在同一拍上）
      for (let j = 0; j < 2; j++) {
        const q = U.fract(W.t / 2.4 + j / 2);
        ctx.strokeStyle = U.rgba(255, 236, 184, 0.18 * a0 * (1 - q) * lv('chPlay'));
        ctx.lineWidth = Math.max(1, 1.6 * un);
        ctx.beginPath(); ctx.ellipse(cx, cy, M() * (0.04 + 0.2 * q), M() * (0.012 + 0.06 * q), 0, 0, TAU); ctx.stroke();
      }
      // 一道升起的光：有殿时落在殿上，否则升到天上
      const t = temple(), built = lv('chBuild') > 0.9 && lv('chRuin') < 0.5;
      const tx = built ? t.x0 + 0.12 * t.tu : cx + M() * 0.1, ty = built ? t.top - t.hP : cy - M() * 0.45;
      const mx = (cx + tx) / 2, my = Math.min(cy, ty) - M() * 0.1;
      const g = ctx.createLinearGradient(cx, cy, tx, ty);
      const a = 0.22 * a0 * (0.85 + 0.15 * Math.sin(W.t * 2));
      g.addColorStop(0, U.rgba(255, 230, 170, a)); g.addColorStop(1, U.rgba(255, 244, 214, a * 0.35));
      ctx.strokeStyle = g;
      ctx.lineCap = 'round';
      for (const [wd, f] of [[14, 0.35], [4, 1]]) {
        ctx.lineWidth = Math.max(2, wd * un);
        ctx.globalAlpha = f;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(mx, my, tx, ty); ctx.stroke();
      }
      // 沿光而上的点
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgb(255, 240, 200)';
      for (let i = 0; i < 14; i++) {
        const s2 = U.fract(W.t * 0.35 + i / 14), u2 = 1 - s2;
        const x = u2 * u2 * cx + 2 * u2 * s2 * mx + s2 * s2 * tx, y = u2 * u2 * cy + 2 * u2 * s2 * my + s2 * s2 * ty;
        ctx.globalAlpha = a0 * 0.7 * Math.sin(Math.PI * s2);
        ctx.fillRect(x - un, y - un, 2 * un, 2 * un);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  云充满了殿；荣光（代下 5:13–14，7:1–3）
  // ════════════════════════════════════════════════════════════
  // 云团：预先画好的几朵积云（顶亮、底略暗，边缘柔和）
  let PUFFS = null, PUFFW = null;
  function puffs(warm) {
    if (PUFFS) return warm ? PUFFW : PUFFS;
    PUFFS = []; PUFFW = [];
    for (let v = 0; v < 8; v++) {
      const wv = v >= 4;
      const W0 = 160, H0 = 112, c = cnv(W0, H0), g = c.getContext('2d'), r = U.mulberry32(7301 + v * 37);
      for (let i = 0; i < 11; i++) {
        const u = r(), x = W0 * (0.16 + 0.68 * u), rad = H0 * (0.17 + 0.15 * r()) * (1 - 0.35 * Math.abs(u - 0.5));
        const y = H0 * 0.7 - rad * (0.2 + 1.1 * Math.sin(Math.PI * u) * r());
        const gr = g.createRadialGradient(x - rad * 0.2, y - rad * 0.35, rad * 0.1, x, y, rad);
        if (wv) { gr.addColorStop(0, 'rgba(255, 250, 226, 1)'); gr.addColorStop(0.62, 'rgba(255, 232, 178, 0.9)'); gr.addColorStop(1, 'rgba(250, 214, 150, 0)'); }
        else { gr.addColorStop(0, 'rgba(255, 254, 250, 1)'); gr.addColorStop(0.62, 'rgba(248, 244, 234, 0.9)'); gr.addColorStop(1, 'rgba(236, 230, 216, 0)'); }
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
      }
      g.globalCompositeOperation = 'source-atop';
      const sh = g.createLinearGradient(0, H0 * 0.35, 0, H0);
      if (wv) { sh.addColorStop(0, 'rgba(230, 180, 110, 0)'); sh.addColorStop(1, 'rgba(214, 150, 90, 0.35)'); }
      else { sh.addColorStop(0, 'rgba(200, 196, 190, 0)'); sh.addColorStop(1, 'rgba(172, 166, 160, 0.45)'); }
      g.fillStyle = sh; g.fillRect(0, 0, W0, H0);
      (wv ? PUFFW : PUFFS).push(c);
    }
    return warm ? PUFFW : PUFFS;
  }
  const CLOUD = (function () {
    const r = U.mulberry32(5131), out = [];
    // 自门中涌出，满了廊子与殿，又漫到院中（u：自廊前量起的殿长比例；v：殿高之上的比例）
    for (let i = 0; i < 40; i++) {
      const zone = i < 10 ? 0 : i < 26 ? 1 : i < 34 ? 2 : 3;
      const u = zone === 0 ? -0.05 + r() * 0.35 : zone === 1 ? 0.1 + r() * 0.95 : zone === 2 ? -0.55 + r() * 0.5 : 0.0 + r() * 1.0;
      const v = zone === 0 ? 0.05 + r() * 0.9 : zone === 1 ? 0.45 + r() * 0.5 : zone === 2 ? -0.05 + r() * 0.35 : 0.95 + r() * 0.35;
      out.push({ u, v, s: (zone === 3 ? 0.28 : 0.2) + r() * 0.22, ph: r() * TAU, sp: 0.12 + r() * 0.2, n: i % 4, th: zone === 2 ? 0.35 + r() * 0.5 : r() * 0.3, flip: r() < 0.5 });
    }
    return out;
  })();
  function drawCloud(ctx, veil) {
    const k = lv('chCloud');
    if (k < 0.01) return;
    sprites();
    const t = temple(), tu = t.tu, gl = lv('chGlory');
    if (veil) {
      // 前景的一层薄纱：整座院子都在云里（祭司不能站立供职）
      const cx = t.x0 + 0.2 * tu, cy = t.top - 0.15 * tu;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.cloud, cx, cy, tu * 3.4, 0.2 * k);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      return;
    }
    const P = puffs(false), PW = puffs(true), wk = sm(0.6, 0.95, gl);
    // 云里透出的光
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, t.x0 + 0.3 * tu, t.top - t.hH * 0.8, tu * 2.2, k * (0.25 + 0.3 * gl));
    ctx.globalCompositeOperation = 'source-over';
    for (const c of CLOUD) {
      const e = clamp((k - c.th) / 0.35, 0, 1);
      if (e <= 0.01) continue;
      const x = t.x0 + c.u * tu + Math.sin(W.t * c.sp + c.ph) * 0.025 * tu;
      const y = t.top - c.v * t.hP + Math.cos(W.t * c.sp * 0.8 + c.ph) * 0.015 * tu;
      const w = c.s * tu * (0.6 + 0.4 * e) * 1.4, h = w * 0.7, a = clamp(e * 0.8, 0, 1);
      if (c.flip) { ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); }
      const px = c.flip ? -w / 2 : x - w / 2, py = c.flip ? -h * 0.7 : y - h * 0.7;
      ctx.globalAlpha = a * (1 - wk); if (wk < 0.99) ctx.drawImage(P[c.n], px, py, w, h);
      ctx.globalAlpha = a * wk; if (wk > 0.01) ctx.drawImage(PW[c.n], px, py, w, h);
      if (c.flip) ctx.restore();
    }
    // 荣光：云被照亮成金白色
    if (gl > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, t.x0 + 0.25 * tu, t.top - t.hH * 0.6, tu * 1.8, 0.3 * gl * k);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function drawGloryFront(ctx) {
    const gl = lv('chGlory');
    if (gl < 0.01) return;
    sprites();
    const t = temple(), tu = t.tu, dx = t.x0 + 0.12 * tu, dy = t.top - 0.16 * tu;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, dx, dy, tu * 0.9, gl * 0.55);
    // 自门里射出的光
    const a = gl * 0.18 * (0.85 + 0.15 * Math.sin(W.t * 1.4));
    const g = ctx.createLinearGradient(dx, dy, dx - tu * 0.9, dy + tu * 0.1);
    g.addColorStop(0, U.rgba(255, 228, 160, a)); g.addColorStop(1, U.rgba(255, 228, 160, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(dx, dy - 0.14 * tu); ctx.lineTo(dx - tu * 0.9, dy - 0.05 * tu); ctx.lineTo(dx - tu * 0.9, dy + 0.25 * tu); ctx.lineTo(dx, dy + 0.16 * tu); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶和华的使者：站在天地间，手里有拔出来的刀，伸在耶路撒冷以上（代上 21:16）
  // ════════════════════════════════════════════════════════════
  function angelGeom() {
    const tl = tall();
    return { x: (tl ? 0.74 : 0.73) * W.w, y: (tl ? 0.47 : 0.36) * W.h, h: (tl ? 0.2 : 0.33) * W.h };
  }
  function drawAngel(ctx) {
    const k = lv('chAngel');
    if (k < 0.01) return;
    sprites();
    const g = angelGeom(), x = g.x + Math.sin(W.t * 0.5) * 3 * W.unit, y = g.y + Math.sin(W.t * 0.7) * 4 * W.unit, H = g.h, sw = lv('chSword');
    ctx.globalCompositeOperation = 'lighter';
    // 光晕
    glowAt(ctx, SP.white, x, y, H * 2.2, 0.28 * k);
    glowAt(ctx, SP.gold, x, y - H * 0.35, H * 0.8, 0.4 * k);
    // 身形：一道长长的光，像袍
    const gr = ctx.createLinearGradient(0, y - H * 0.5, 0, y + H * 0.5);
    gr.addColorStop(0, U.rgba(255, 250, 236, 0.75 * k)); gr.addColorStop(0.6, U.rgba(250, 236, 200, 0.42 * k)); gr.addColorStop(1, U.rgba(240, 220, 180, 0));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x, y - H * 0.4);
    ctx.bezierCurveTo(x + H * 0.1, y - H * 0.36, x + H * 0.13, y - H * 0.05, x + H * 0.2, y + H * 0.5);
    ctx.lineTo(x - H * 0.2, y + H * 0.5);
    ctx.bezierCurveTo(x - H * 0.13, y - H * 0.05, x - H * 0.1, y - H * 0.36, x, y - H * 0.4);
    ctx.fill();
    // 头
    glowAt(ctx, SP.white, x, y - H * 0.46, H * 0.2, 0.9 * k);
    // 光的衣边：一层淡淡的、向下飘动的光
    for (let i = 0; i < 3; i++) {
      const sw2 = Math.sin(W.t * 0.8 + i * 2.1) * H * 0.03;
      ctx.strokeStyle = U.rgba(255, 244, 220, (0.16 - i * 0.04) * k);
      ctx.lineWidth = Math.max(1, H * (0.01 + i * 0.008));
      ctx.beginPath();
      ctx.moveTo(x - H * 0.05, y - H * 0.34);
      ctx.bezierCurveTo(x - H * (0.18 + i * 0.05), y - H * 0.1, x - H * (0.24 + i * 0.05) + sw2, y + H * 0.2, x - H * (0.28 + i * 0.06) + sw2, y + H * 0.5);
      ctx.moveTo(x + H * 0.05, y - H * 0.34);
      ctx.bezierCurveTo(x + H * (0.18 + i * 0.05), y - H * 0.1, x + H * (0.24 + i * 0.05) - sw2, y + H * 0.2, x + H * (0.28 + i * 0.06) - sw2, y + H * 0.5);
      ctx.stroke();
    }
    // 刀：自手中伸向城上（伸在耶路撒冷以上）
    if (sw > 0.01) {
      const hx = x - H * 0.14, hy = y - H * 0.18;
      const tx = X('palace') * W.w, ty = gY(1, X('palace')) - PH(1) * 3;
      const dx = tx - hx, dy = ty - hy, L = Math.hypot(dx, dy) || 1;
      const len = Math.min(L * 0.7, H * 0.95) * sw;
      const ux = dx / L, uy = dy / L;
      const ex = hx + ux * len, ey = hy + uy * len;
      const flick = 0.85 + 0.15 * Math.sin(W.t * 5);
      ctx.strokeStyle = U.rgba(255, 252, 240, 0.9 * k * flick);
      ctx.lineWidth = Math.max(1.2, H * 0.014);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = U.rgba(255, 236, 200, 0.25 * k * flick);
      ctx.lineWidth = Math.max(4, H * 0.05);
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      glowAt(ctx, SP.white, ex, ey, H * 0.2, 0.6 * k * sw);
      // 臂
      ctx.strokeStyle = U.rgba(255, 248, 230, 0.5 * k);
      ctx.lineWidth = Math.max(1.5, H * 0.03);
      ctx.beginPath(); ctx.moveTo(x - H * 0.04, y - H * 0.3); ctx.lineTo(hx, hy); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶和华的眼目遍察全地（代下 16:9）
  // ════════════════════════════════════════════════════════════
  function eyesAt(t) {
    // 光之所及在地上来回：近地 → 中丘 → 远山 → 回到近地
    const s = t * 0.11;
    const xf = 0.62 + 0.3 * Math.sin(s * TAU * 0.5) + 0.06 * Math.sin(s * TAU * 1.3);
    const layer = Math.sin(s * TAU * 0.37) > 0.35 ? 1 : 2;
    return [clamp(xf, 0.34, 0.98), layer];
  }
  function drawEyes(ctx) {
    const k = lv('chEyes');
    if (k < 0.01) return;
    sprites();
    const age = W.t - S.eyesT0, un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 2; j++) {
      const [xf, layer] = eyesAt(age - j * 1.8);
      const x = xf * W.w, y = gY(layer, xf);
      const R = (layer === 2 ? 0.13 : 0.08) * W.w;
      ctx.globalAlpha = clamp(k * (j ? 0.4 : 0.85), 0, 1);
      ctx.save();
      ctx.translate(x, y); ctx.scale(1, 0.28);
      ctx.drawImage(SP.gold, -R, -R, R * 2, R * 2);
      ctx.restore();
      // 自天而来的光：柔和，没有硬边
      if (!j) {
        ctx.globalAlpha = clamp(k * 0.32, 0, 1);
        ctx.drawImage(SP.soft, x - R * 0.9, W.h * 0.1, R * 1.8, y - W.h * 0.1);
      }
    }
    // 诚实的心：地上一点一点的光
    for (let i = 0; i < 18; i++) {
      const xf = 0.36 + 0.62 * U.hash1(i * 13 + 5), layer = i % 3 ? 2 : 1;
      const x = xf * W.w, y = gY(layer, xf) - PH(layer) * 0.7;
      const [ex] = eyesAt(age);
      const near = Math.max(0, 1 - Math.abs(ex - xf) / 0.14);
      const a = k * (0.15 + 0.85 * near) * (0.6 + 0.4 * Math.sin(W.t * 2 + i));
      glowAt(ctx, SP.gold, x, y, 16 * un * (1 + near), a * 0.7);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  敌营（摩押、亚扪、西珥山人 · 亚述）：远山上的火
  // ════════════════════════════════════════════════════════════
  const CAMP = (function () {
    const r = U.mulberry32(8811), out = [];
    for (let i = 0; i < 26; i++) out.push({ u: r(), v: r(), ph: r() * TAU, out: r() });
    return out;
  })();
  function drawCamp(ctx) {
    const k = lv('chCamp');
    if (k < 0.01) return;
    sprites();
    const [a, b] = X('camp'), o = lv('chCampOut'), un = Math.max(0.6, W.unit), hf = PH(0);
    const red = S.camp === 'assyria' ? [255, 120, 60] : [255, 150, 70];
    // 兵的剪影
    ctx.fillStyle = css([34, 28, 26], 0, k * 0.85);
    ctx.beginPath();
    for (const c of CAMP) {
      if (c.out < o) continue;
      const xf = lerp(a, b, c.u), x = xf * W.w, g = gY(0, xf) + 1;
      for (let j = 0; j < 2; j++) { const px = x + (j - 0.5) * hf * 0.4; ctx.moveTo(px - hf * 0.1, g); ctx.lineTo(px - hf * 0.05, g - hf * 0.82); ctx.lineTo(px + hf * 0.05, g - hf * 0.82); ctx.lineTo(px + hf * 0.1, g); ctx.closePath(); ctx.moveTo(px + hf * 0.09, g - hf * 0.93); ctx.arc(px, g - hf * 0.93, hf * 0.09, 0, TAU); }
    }
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    for (const c of CAMP) {
      if (c.out < o) continue;
      const xf = lerp(a, b, c.u), x = xf * W.w, g = gY(0, xf) - 1;
      const fl = 0.7 + 0.3 * Math.sin(W.t * 7 + c.ph);
      glowAt(ctx, SP.warm, x, g, 18 * un, k * fl * (0.3 + 0.6 * nightK()));
      ctx.globalAlpha = k * fl;
      ctx.fillStyle = U.rgb(red[0], red[1], red[2]);
      ctx.fillRect(x - un, g - 2 * un, 2 * un, 2 * un);
      // 枪尖的闪光（白昼）
      if (W.dayFactor > 0.3 && U.fract(W.t * 0.4 + c.ph) < 0.08) {
        ctx.fillStyle = 'rgb(255, 250, 230)';
        ctx.globalAlpha = k * W.dayFactor;
        ctx.fillRect(x + hf * 0.3, g - hf * 1.3, 1.5 * un, 1.5 * un);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  东方的光与归回的路（代下 36:22–23）
  // ════════════════════════════════════════════════════════════
  function drawEast(ctx) {
    const k = lv('chEast');
    if (k < 0.01) return;
    const hy = W.horizonY, x = 0.02 * W.w;
    const g = ctx.createRadialGradient(x, hy, 0, x, hy, W.w * 0.9);
    g.addColorStop(0, U.rgba(255, 214, 140, 0.55 * k)); g.addColorStop(0.35, U.rgba(255, 180, 110, 0.22 * k)); g.addColorStop(1, 'rgba(255,170,100,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.w, hy + 4);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 归回的路：东方（左）天海相接处的一道金光，越过海面，到岸边；再沿着地，上到锡安的废墟
  function roadEnds() {
    const r0 = X('ret')[0], hy = W.horizonY;
    return { sx: 0.05 * W.w, sy: hy + 1, cx: (r0 - 0.03) * W.w, cy: gY(2, r0 - 0.03) + PH(2) * 0.12, x0: r0, x1: X('isr')[1] + 0.06 };
  }
  function drawRoadSea(ctx) {
    const k = lv('chRoad');
    if (k < 0.01) return;
    const E = roadEnds(), e1 = clamp(k / 0.6, 0, 1), un = Math.max(0.6, W.unit);
    const P = t => [lerp(E.sx, E.cx, t), lerp(E.sy, E.cy, Math.pow(t, 1.25)), lerp(0.004, 0.05, t) * W.w];
    ctx.globalCompositeOperation = 'lighter';
    const N = 28;
    for (const [wk, al] of [[1.7, 0.045], [1, 0.07], [0.45, 0.1]]) {
      for (let i = 0; i < N; i++) {
        const t0 = (i / N) * e1, t1 = ((i + 1) / N) * e1, a = P(t0), c = P(t1);
        ctx.fillStyle = U.rgba(255, 214, 140, al * (0.4 + 0.6 * t0));
        ctx.beginPath(); ctx.moveTo(a[0] - a[2] * wk, a[1]); ctx.lineTo(a[0] + a[2] * wk, a[1]); ctx.lineTo(c[0] + c[2] * wk, c[1]); ctx.lineTo(c[0] - c[2] * wk, c[1]); ctx.closePath(); ctx.fill();
      }
    }
    // 水面上闪烁的光（短，散，一闪一闪）
    ctx.strokeStyle = 'rgb(255, 234, 180)';
    for (let j = 0; j < 34; j++) {
      const t = Math.pow(U.hash1(j * 7 + 3), 0.8) * e1, p = P(t), f = Math.max(0, Math.sin(W.t * (1.6 + U.hash1(j) * 2.5) + j * 2.1));
      const x = p[0] + (U.hash1(j * 13 + 1) - 0.5) * p[2] * 1.4, len = p[2] * (0.12 + 0.22 * U.hash1(j + 5));
      ctx.globalAlpha = 0.55 * f * (0.3 + 0.7 * t);
      ctx.lineWidth = Math.max(0.6, (0.5 + 1.1 * t) * un);
      ctx.beginPath(); ctx.moveTo(x - len / 2, p[1]); ctx.lineTo(x + len / 2, p[1]); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawRoadLand(ctx) {
    const k = lv('chRoad');
    const e2 = clamp((k - 0.5) / 0.5, 0, 1);
    if (e2 < 0.01) return;
    const E = roadEnds(), un = Math.max(0.6, W.unit), xe = lerp(E.x0 - 0.03, E.x1, e2), off = PH(2) * 0.12;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [wd, a] of [[12, 0.07], [4, 0.16], [1.4, 0.4]]) {
      ctx.strokeStyle = U.rgba(255, 222, 150, a);
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) { const xf = lerp(E.x0 - 0.03, xe, i / 30), y = gY(2, xf) + off; if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
      ctx.stroke();
    }
    // 往锡安去的光点
    ctx.fillStyle = 'rgb(255, 240, 200)';
    for (let i = 0; i < 16; i++) {
      const s2 = U.fract(W.t * 0.06 + i * 0.618), xf = lerp(E.x0 - 0.03, xe, s2);
      ctx.globalAlpha = 0.7 * Math.sin(Math.PI * s2) * e2;
      ctx.fillRect(xf * W.w - un, gY(2, xf) + off - 3 * un, 2 * un, 2 * un);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光：自天降下的火、光柱、传递的冠冕、使者（先知）的光、上升的祷告……
  // ════════════════════════════════════════════════════════════
  function drawFireFall(ctx) {
    const age = W.t - S.fireT0;
    if (age < 0 || age > 4.6) return;
    sprites();
    const x = S.fireX * W.w, A = altarGeom(), gy = A.g - A.h * 0.5, land = 0.85;
    const head = lerp(-W.h * 0.08, gy, U.easeIn(clamp(age / land, 0, 1)));
    const tail = age < land ? -W.h * 0.12 : lerp(-W.h * 0.12, gy - A.tu * 0.1, U.easeIn(clamp((age - land) / 1.5, 0, 1)));
    const a = 1 - sm(2.8, 4.6, age);
    const w = Math.max(W.w * 0.05, A.tu * 0.36) * (1 + 0.07 * Math.sin(W.t * 23));
    ctx.globalCompositeOperation = 'lighter';
    if (head - tail > 2) {
      // 外层：一团一团翻滚的火光顺着落下（不是一道硬的光柱）
      const n = Math.max(6, Math.round((head - tail) / (w * 0.55)));
      for (let i = 0; i < n; i++) {
        const q = (i + U.fract(W.t * 1.7)) / n, y = lerp(tail, head, q);
        const jx = Math.sin(W.t * 7 + i * 1.9) * w * 0.28, sz = w * (1.1 + 0.5 * U.hash1(i * 3 + 1)) * (0.7 + 0.3 * q);
        glowAt(ctx, SP.warm, x + jx, y, sz * 1.7, a * 0.36);
        glowAt(ctx, SP.ember, x + jx * 0.6, y, sz, a * 0.38);
      }
      ctx.globalAlpha = a * 0.8;
      ctx.drawImage(SP.fire, x - w * 0.42, tail, w * 0.84, head - tail);
      ctx.globalAlpha = a * 0.7;
      ctx.drawImage(SP.beam, x - w * 0.12, tail, w * 0.24, head - tail);
    }
    // 着地：坛上一团火光
    if (age > land - 0.05) {
      const b2 = clamp((age - land) / 0.5, 0, 1);
      glowAt(ctx, SP.warm, x, gy, A.tu * (0.7 + 1.4 * b2), a * 0.9);
      glowAt(ctx, SP.gold, x, gy, A.tu * 0.55, a);
    }
    // 火星
    for (let i = 0; i < 34; i++) {
      const s2 = U.fract(i * 0.618 + age * 0.9), yy = lerp(tail, Math.max(tail + 1, head), s2);
      ctx.fillStyle = i % 3 ? 'rgb(255, 200, 110)' : 'rgb(255, 244, 210)';
      ctx.globalAlpha = a * 0.8 * Math.sin(Math.PI * s2);
      ctx.fillRect(x + (U.hash1(i) - 0.5) * w * 0.9, yy, 2 * W.unit, 2 * W.unit);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawFXL(ctx) {
    if (!FXL.length) return;
    sprites();
    const un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (const f of FXL) {
      const e = f.t / f.dur;
      if (f.type === 'beam') {
        const x = f.xf * W.w, gy = gY(f.l, f.xf), w = f.w * un;
        const a = Math.min(1, f.t / 0.6) * (1 - sm(0.6, 1, e)) * (f.k || 1), y0 = Math.min(gy - PH(f.l) * 4, W.h * (tall() ? 0.3 : 0.12));
        ctx.globalAlpha = a * 0.6;
        ctx.drawImage(SP.soft, x - w * 0.8, y0, w * 1.6, gy - y0);
        glowAt(ctx, SP.gold, x, gy - PH(f.l) * 0.5, PH(f.l) * 3, a * 0.6);
      } else if (f.type === 'travel') {
        // 一点光从 a 飞到 b（国归于大卫、灯回锡安）
        const s = U.easeInOut(clamp(e, 0, 1));
        const x = lerp(f.x0, f.x1, s) * W.w, y = lerp(f.y0, f.y1, s) * W.h - Math.sin(Math.PI * s) * W.h * 0.12;
        glowAt(ctx, SP.gold, x, y, 40 * un, 0.9 * (1 - sm(0.9, 1, e)));
        glowAt(ctx, SP.white, x, y, 12 * un, 1 - sm(0.9, 1, e));
      } else if (f.type === 'rise') {
        // 祷告达到天上（代下 30:27）
        for (let i = 0; i < 40; i++) {
          const s = clamp(e * 1.6 - U.hash1(i * 3 + 1) * 0.6, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const x0 = lerp(f.x0, f.x1, U.hash1(i * 7 + 2)) * W.w, y0 = gY(2, x0 / W.w) - PH(2);
          const x = x0 + Math.sin(s * 6 + i) * 8 * un, y = lerp(y0, -10, s);
          ctx.globalAlpha = Math.sin(Math.PI * s) * 0.8;
          ctx.fillStyle = 'rgb(255, 236, 196)';
          ctx.fillRect(x - un, y - un, 2 * un, 2 * un);
        }
      } else if (f.type === 'messengers') {
        // 从早起来差遣使者（代下 36:15）：光一再飞向城中，又被吹灭
        const t0 = temple();
        for (let i = 0; i < 6; i++) {
          const s = clamp(e * 2.2 - i * 0.22, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const tx = lerp(X('city')[0] + 0.03, X('city')[1] - 0.2, U.hash1(i + 4)) * W.w, ty = gY(1, tx / W.w) - PH(1);
          const sx = t0.x0 + 0.12 * t0.tu, sy = t0.top - 0.2 * t0.tu;
          const q = clamp(s / 0.7, 0, 1), x = lerp(sx, tx, q), y = lerp(sy, ty, q) - Math.sin(Math.PI * q) * W.h * 0.1;
          const a = s < 0.7 ? 1 : 1 - (s - 0.7) / 0.3;
          glowAt(ctx, SP.gold, x, y, 22 * un, a * 0.8);
        }
      } else if (f.type === 'sweep') {
        // 耶和华的使者进入亚述王营中（代下 32:21）
        const [a, b] = X('camp');
        const x = lerp(b + 0.05, a - 0.05, U.easeInOut(clamp(e, 0, 1))) * W.w, g = gY(0, lerp(a, b, 0.5));
        glowAt(ctx, SP.white, x, g - PH(0) * 2, W.w * 0.12, 0.6 * Math.sin(Math.PI * e));
        ctx.globalAlpha = 0.3 * Math.sin(Math.PI * e);
        ctx.drawImage(SP.soft, x - W.w * 0.04, W.h * 0.15, W.w * 0.08, g - W.h * 0.15);
      } else if (f.type === 'heal') {
        // 医治他们的地：一道绿光在地上漫开
        const R = e * W.w * 0.9, x = f.x * W.w;
        for (const l of [2, 1]) {
          ctx.globalAlpha = 0.35 * (1 - e);
          ctx.save(); ctx.translate(x, gY(l, f.x)); ctx.scale(1, 0.12);
          ctx.drawImage(SP.green, -R, -R, R * 2, R * 2);
          ctx.restore();
        }
      } else if (f.type === 'lights') {
        // 大卫的家：一行灯沿着远山点起（直到永远）
        const n = 11;
        for (let i = 0; i < n; i++) {
          const s = clamp(e * 1.8 - i / n, 0, 1);
          if (s <= 0) continue;
          const xf = lerp(X('palace') + 0.02, 0.99, Math.pow(i / (n - 1), 0.8)), y = gY(0, xf) - PH(0) * 0.8, z = (1 - i / n * 0.5);
          glowAt(ctx, SP.gold, xf * W.w, y, 16 * un * z, Math.min(1, s * 3) * (1 - sm(0.7, 1, e)) * 0.75 * z);
        }
      } else if (f.type === 'steps') {
        // 桑树梢上的脚步声：光一步一步走过树梢
        f.pts.forEach((q, i) => {
          const s2 = clamp((f.t - i * 0.4) / 1.1, 0, 1);
          if (s2 <= 0 || s2 >= 1) return;
          const x = q[0] * W.w, y = q[1] * W.h;
          glowAt(ctx, SP.gold, x, y, 60 * un * (0.5 + s2), 0.8 * Math.sin(Math.PI * s2));
          ctx.strokeStyle = U.rgba(255, 240, 200, 0.6 * (1 - s2));
          ctx.lineWidth = 1.2 * un;
          ctx.beginPath(); ctx.ellipse(x, y, 40 * un * s2, 14 * un * s2, 0, 0, TAU); ctx.stroke();
        });
      } else if (f.type === 'lots') {
        // 掣签：各人头上亮一下
        f.pts.forEach((xf, i) => {
          const s2 = clamp((f.t - i * 0.25) / 0.9, 0, 1);
          if (s2 <= 0 || s2 >= 1) return;
          glowAt(ctx, SP.gold, xf * W.w, gY(2, xf) - PH(2) * 1.35, 22 * un, Math.sin(Math.PI * s2));
        });
      } else if (f.type === 'burst') {
        const x = f.xf * W.w, y = gY(f.l, f.xf) - PH(f.l) * 0.8;
        glowAt(ctx, SP.white, x, y, PH(f.l) * 6 * (0.5 + e), 0.8 * (1 - e));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 情节里写在地上空中的名（诸王）
  function drawNames(ctx) {
    if (!S.names.length) return;
    const px = Math.round(clamp(17 * W.unit, 13, 21));
    for (const n of S.names) {
      const age = W.t - n.t0;
      if (age < 0 || age > 6) continue;
      const a = clamp(age / 0.8, 0, 1) * (1 - sm(4, 6, age));
      if (a < 0.01) continue;
      const x = n.xf * W.w, y = gY(n.l, n.xf) - PH(n.l) * 1.9 - age * 3 * W.unit;
      const sp = textSprite(n.s, px, [255, 232, 186]);
      ctx.globalAlpha = a;
      ctx.drawImage(sp.c, x - sp.w / 2, y - sp.h / 2, sp.w, sp.h);
    }
    ctx.globalAlpha = 1;
  }
  // 律法书（代下 34:15）：发光的书卷
  function drawScroll(ctx) {
    if (!S.scroll) return;
    const p = fig('hilkiah');
    if (!p || !p._vis) return;
    sprites();
    const h = p._h, f = p.facing || 1, x = p._x + f * h * 0.22, y = p._y - h * 0.62;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, h * 1.2, 0.6 * p.alpha);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = 'rgb(240, 226, 190)';
    ctx.fillRect(x - h * 0.1, y - h * 0.04, h * 0.2, h * 0.08);
    ctx.fillStyle = 'rgb(150, 110, 70)';
    ctx.fillRect(x - h * 0.12, y - h * 0.06, h * 0.03, h * 0.12);
    ctx.fillRect(x + h * 0.09, y - h * 0.06, h * 0.03, h * 0.12);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  let buildT = 2;
  function update(dt) {
    if (!cur()) { FXL.length = 0; return; }
    const f = dt * (W.fast || 1);
    for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    stepLamp(dt, W.replaying);
    if (W.replaying) return;
    // 殿在建造时：敲打之声与石粉
    if (W.lv.chBuild < W.lt.chBuild - 0.002 && W.lv.chBuild > 0.05) {
      buildT -= dt;
      if (buildT <= 0) {
        buildT = 1.6 + Math.random() * 2;
        const t = temple();
        safe('ch.dust', () => fx().dust(t.x0 + Math.random() * t.tu, t.top - Math.max(t.hH, t.hP) * W.lv.chBuild * 0.8, 6, [228, 214, 186], t.tu * 0.1));
        const a = au(); if (a && a.sfx) safe('ch.sfx', () => a.sfx('build', { soft: true }));
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function beam(b, xf, l, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l: l == null ? 2 : l, w: o.w || 70, k: o.k || 1 });
    if (o.ring !== false) safe('ch.ring', () => fx().ring(xf * W.w, gY(l == null ? 2 : l, xf) - PH(l == null ? 2 : l) * 0.5, [255, 236, 190], M() * (o.r || 0.25), 2.2, 1.8));
  }
  const beamOn = (b, id, o) => { const p = fig(id); if (p) beam(b, p.nx, p.layer == null ? 2 : p.layer, o); };
  function ring(b, x, y, r, rgb) { if (!b.instant) safe('ch.ring', () => fx().ring(x, y, rgb || [255, 232, 186], M() * (r || 0.3), 2.2, 1.6)); }
  function nameAbove(b, s, xf, l) { if (!b.instant) S.names.push({ s, xf, l: l == null ? 2 : l, t0: W.t }); }
  function fireFall(b, xf) {
    if (b.instant) return;
    S.fireT0 = W.t; S.fireX = xf;
    safe('ch.flash', () => { W.flash = 0.6; W.shake = 0.6; });
  }
  // 利未人的歌唱班与吹号的祭司：站在坛的东边（代下 5:12）
  function choir(b, o) {
    o = o || {};
    const [p0, p1] = X('pr'), [s0, s1] = X('sg');
    TRUMP.forEach((id, i) => {
      const x = lerp(p0, p1, i / (TRUMP.length - 1));
      if (!has(id)) add(id, { label: '吹号的祭司', x: o.fromX != null ? o.fromX + i * 0.012 : x, facing: 1, robe: LINEN, hair: 'cloth', accent: [206, 196, 170], glow: 0.2, v: 0.22 });
      if (o.walk) walk(id, x, { speed: o.speed || 0.035, pose: o.pose || 'stand' }); else if (o.pose) pose(id, o.pose);
    });
    SING.forEach((id, i) => {
      const x = lerp(s0, s1, i / (SING.length - 1));
      if (!has(id)) add(id, { label: '歌唱的利未人', x: o.fromX != null ? o.fromX + 0.08 + i * 0.012 : x, facing: 1, robe: i % 2 ? LINEN2 : LINEN, hair: 'cloth', accent: [196, 186, 160], glow: 0.2, v: 0 });
      if (o.walk) walk(id, x, { speed: o.speed || 0.035, pose: o.pose || 'stand' }); else if (o.pose) pose(id, o.pose);
    });
  }
  function choirPose(p, tp) { TRUMP.forEach(id => pose(id, tp || p)); SING.forEach(id => pose(id, p)); }
  function choirOff() { TRUMP.concat(SING).forEach(id => rm(id)); }
  // 一位王：到院中，头上金冠（金色的包头），名字浮在头上
  function king(b, id, name, o) {
    o = o || {};
    const x = o.x != null ? o.x : X('king');
    add(id, KING(o.robe, { label: name, x: o.fromX != null ? o.fromX : x, facing: o.facing || 1, age: o.age || 'adult', from: o.from || 'fade' }));
    if (o.fromX != null) walk(id, x, { speed: o.speed || 0.04, pose: o.pose || 'stand' });
    else if (o.pose) pose(id, o.pose);
    nameAbove(b, name, x);
  }
  // 以色列众人（院前，靠近看的人）
  function israel(b, o) {
    o = o || {};
    const [a, c] = X('isr');
    crowd('ch:isr', { n: o.n || 14, x0: a, x1: c, layer: 2, label: '以色列众人', v: 0.35 });
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  const TINT = [255, 232, 190];
  GS.book.act({
    id: ACT, book: '历代志', books: [13, 14], title: '历代', sub: '历代志上 1 — 历代志下 36', tint: TINT, music: 'babel',
    intro: [
      { text: '亚当生塞特；塞特生以挪士；以挪士生该南；……<br>拉麦生挪亚；挪亚生闪、含、雅弗。', ref: '历代志上 1:1–4', hold: 6.5 },
      { text: '以色列的儿子是吕便、西缅、利未、犹大……七子大卫。……<br>大卫在耶路撒冷所生的儿子是示米亚、朔罢、拿单、所罗门。', ref: '历代志上 2:1—3:5', hold: 7.5 },
    ],
    outro: 20,
    behold: {
      '雅比斯': { text: '雅比斯求告以色列的神说：「甚愿你赐福与我，扩张我的境界，常与我同在，保佑我不遭患难，不受艰苦。」<br>神就应允他所求的。', ref: '历代志上 4:10' },
      '大卫': { text: '大卫日见强盛，因为万军之耶和华与他同在。', ref: '历代志上 11:9' },
      '所罗门': { text: '所罗门王的财宝与智慧胜过天下的列王。', ref: '历代志下 9:22' },
      '扫罗': { text: '这样，扫罗死了。因为他干犯耶和华，没有遵守耶和华的命；', ref: '历代志上 10:13' },
      '大卫城': { text: '然而大卫攻取锡安的保障，就是大卫的城。', ref: '历代志上 11:5' },
      '耶路撒冷': { text: '迦勒底人焚烧神的殿，拆毁耶路撒冷的城墙，用火烧了城里的宫殿，毁坏了城里宝贵的器皿。', ref: '历代志下 36:19' },
      '大卫的宫': { text: '大卫住在自己宫中，对先知拿单说：「看哪，我住在香柏木的宫中，耶和华的约柜反在幔子里。」', ref: '历代志上 17:1' },
      '约柜': { text: '祭司将耶和华的约柜抬进内殿，就是至圣所，放在两个基路伯的翅膀底下。', ref: '历代志下 5:7' },
      '大卫的帐幕': { text: '众人将神的约柜请进去，安放在大卫所搭的帐幕里，就在神面前献燔祭和平安祭。', ref: '历代志上 16:1' },
      '阿珥楠的禾场': { text: '耶和华的使者吩咐迦得去告诉大卫，叫他上去，在耶布斯人阿珥楠的禾场上为耶和华筑一座坛；', ref: '历代志上 21:18' },
      '耶和华的使者': { text: '耶和华吩咐使者，他就收刀入鞘。', ref: '历代志上 21:27' },
      '建殿的材料': { text: '我在困难之中为耶和华的殿预备了金子十万他连得，银子一百万他连得，铜和铁多得无法可称；<br>我也预备了木头、石头，你还可以增添。', ref: '历代志上 22:14' },
      '殿的样式': { text: '说：「这一切工作的样式都是耶和华用手划出来使我明白的。」', ref: '历代志上 28:19' },
      '耶和华的殿': { text: '现在我已选择这殿，分别为圣，使我的名永在其中，<br>我的眼、我的心也必常在那里。', ref: '历代志下 7:16' },
      '殿的废墟': { text: '这就应验耶和华藉耶利米口所说的话：地享受安息；<br>因为地土荒凉便守安息，直满了七十年。', ref: '历代志下 36:21' },
      '雅斤': { text: '将两根柱子立在殿前，一根在右边，一根在左边；<br>右边的起名叫雅斤，左边的起名叫波阿斯。', ref: '历代志下 3:17' },
      '波阿斯': { text: '将两根柱子立在殿前，一根在右边，一根在左边；<br>右边的起名叫雅斤，左边的起名叫波阿斯。', ref: '历代志下 3:17' },
      '铜坛': { text: '所罗门祈祷已毕，就有火从天上降下来，烧尽燔祭和别的祭。耶和华的荣光充满了殿；', ref: '历代志下 7:1' },
      '铜海': { text: '又铸一个铜海，样式是圆的，高五肘，径十肘，围三十肘；', ref: '历代志下 4:2' },
      '坛': { text: '大卫在那里为耶和华筑了一座坛，献燔祭和平安祭，求告耶和华。<br>耶和华就应允他，使火从天降在燔祭坛上。', ref: '历代志上 21:26' },
      '吹号的祭司': { text: '……同着他们有一百二十个祭司吹号。', ref: '历代志下 5:12' },
      '歌唱的利未人': { text: '吹号的、歌唱的都一齐发声，声合为一，赞美感谢耶和华。', ref: '历代志下 5:13' },
      '以色列众人': { text: '……以色列众人看见，就在铺石地俯伏叩拜，称谢耶和华说：<br>耶和华本为善，他的慈爱永远长存！', ref: '历代志下 7:3' },
      '大卫的灯': { text: '耶和华却因自己与大卫所立的约，不肯灭大卫的家，<br>照他所应许的，永远赐灯光与大卫和他的子孙。', ref: '历代志下 21:7' },
      '示巴女王': { text: '示巴女王听见所罗门的名声，就来到耶路撒冷，要用难解的话试问所罗门；<br>跟随她的人甚多，又有骆驼驮着香料、宝石，和许多金子。', ref: '历代志下 9:1' },
      '基遍的会幕': { text: '所罗门和会众都往基遍的邱坛去，因那里有神的会幕，<br>就是耶和华仆人摩西在旷野所制造的。', ref: '历代志下 1:3' },
      '约阿施': { text: '于是领王子出来，给他戴上冠冕，将律法书交给他，立他作王。<br>耶何耶大和众子膏他，众人说：「愿王万岁！」', ref: '历代志下 23:11' },
      '希西家': { text: '凡他所行的，无论是办神殿的事，是遵律法守诫命，是寻求他的神，都是尽心去行，无不亨通。', ref: '历代志下 31:21' },
      '约西亚': { text: '约西亚在世的日子，就跟从耶和华他们列祖的神，总不离开。', ref: '历代志下 34:33' },
      '归回的人': { text: '你们中间凡作他子民的，可以上去，<br>愿耶和华他的神与他同在。', ref: '历代志下 36:23' },
      '归回的路': { text: '波斯王塞鲁士元年，耶和华为要应验藉耶利米口所说的话，<br>就激动波斯王塞鲁士的心，使他下诏通告全国，说：', ref: '历代志下 36:22' },
      '堆垒': { text: '……就是十分取一之物，尽都送来，积成堆垒；', ref: '历代志下 31:6' },
    },
    setup() {
      // 犹大的山地：略干的草场，锡安与摩利亚山
      W.set('bare', 0.16, true); W.set('bloom', 0.5, true);
      S = fresh(); FXL.length = 0; TG = null; CITY = null; RL = null; lampPos.init = false;
      const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 1, herbs: 0.85, trees: 0.3,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
      for (const k in LV) W.set(k, 0, true);
      W.set('chRiver', 1, true);
      W.set('chCity', 0.3, true);
      W.set('chFloor', 1, true);
      W.set('chObed', 1, true);
      W.set('chDoor', 1, true);
      // 树只在西边（右缘）：锡安与摩利亚一带开阔
      const tx = W.w * 0.995, gx = W.w * 0.6;
      W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
      W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
      W.freeClock = false;
      W.goTo(0.215, 0, true);
      const lx = W.w * 0.4, ly = W.ridgeBaseY(2, lx);
      W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
      W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
      W.setPop('bird', 30, W.w * 0.55, W.h * 0.3, true);
      W.setPop('cattle', 4, lx, ly, true);
      W.setPop('beast', 0, lx, ly, true);
      W.setPop('creeper', 14, lx, ly, true);
      W.setPop('human', 0, lx, ly, true);
      S.riverT0 = W.t;
      cast().clear({ fade: false });
      avoid([0.46, 0.99]);
    },
    stages: [
      // ── 代上 1—10：众名之河；雅比斯；扫罗死了，国归于大卫 ─────────
      {
        kind: 'act', utter: '神就应允他所求的', cmd: 'git log --graph 亚当..大卫  # 雅比斯：已应允', ref: '4:10',
        verse: [
          { text: '雅比斯求告以色列的神说：「甚愿你赐福与我，扩张我的境界……」<br>神就应允他所求的。', ref: '历代志上 4:10', hold: 6.5 },
          { text: '……他们在阵上呼求神，倚赖神，神就应允他们。<br>……约柜安设之后，大卫派人在耶和华殿中管理歌唱的事。', ref: '历代志上 5:20—6:31', hold: 7 },
          { text: '……嫩的儿子是约书亚。……基士生扫罗……<br>以色列人都按家谱计算，写在以色列诸王记上。', ref: '历代志上 7:27—9:1', hold: 6.5 },
          { text: '这样，扫罗死了……所以耶和华使他被杀，<br>把国归于耶西的儿子大卫。', ref: '历代志上 10:13–14', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              S.w1T0 = b.instant ? -1e9 : W.t;
              W.goTo(0.3, 22, b.instant);
              add('jabez', { label: '雅比斯', x: X('jabez'), facing: -1, robe: [132, 104, 80], glow: 0.45, from: 'light', pose: 'pray' });
              avoid([0.5, 0.99]);
            }],
            [1.2, b => { beamOn(b, 'jabez', { dur: 6, r: 0.22 }); sfx(b, 'harp'); }],
            [3, b => {
              // 扩张我的境界：金线沿着地向两边展开，地上开花
              W.set('chBorder', 1, b.instant);
              W.set('chBorderA', 1, b.instant);
              W.set('bloom', 0.9, b.instant);
              W.set('bare', 0.05, b.instant);
              glow('jabez', 0.8);
            }],
            [8, () => { pose('jabez', 'stand'); }],
            [13, b => {
              // 基利波山上的扫罗：一盏将熄的灯
              add('saul', { label: '扫罗', layer: 1, x: X('gil'), facing: -1, robe: [128, 52, 56], hair: 'cloth', accent: [210, 170, 90], glow: 0.5, prop: 'sword' });
              W.set('chBorderA', 0.3, b.instant);
              walk('jabez', 0.47, { speed: 0.02 });
            }],
            [19, () => { pose('saul', 'fall'); glow('saul', 0); }],
            [20.5, b => {
              // 国归于耶西的儿子大卫：一点光自基利波飞到牧羊的少年那里
              add('david', { label: '大卫', x: X('dav') + 0.05, facing: -1, robe: [122, 98, 70], glow: 0.55, from: 'light', age: 'adult', scale: 0.92 });
              herd('ch:flock', { kind: 'sheep', n: 5, x0: X('dav') + 0.08, x1: X('dav') + 0.17, layer: 2, label: '羊群' });
              flash(b, { type: 'travel', dur: 3, x0: X('gil'), y0: gY(1, X('gil')) / W.h - 0.05, x1: X('dav') + 0.05, y1: gY(2, X('dav') + 0.05) / W.h - 0.07 });
              rm('jabez');
            }],
            [23.5, b => { rm('saul'); glow('david', 0.9); ring(b, (X('dav') + 0.05) * W.w, gY(2, X('dav') + 0.05) - PH(2) * 0.6, 0.2); sfx(b, 'harp', { soft: true }); }],
            [25, b => { W.set('chRiver', 0, b.instant); }],
          ]);
        },
      },

      // ── 代上 11—14：大卫在希伯仑受膏；锡安；大军；约柜坐新车；桑树梢上的脚步声 ─────
      {
        kind: 'promise', utter: '你必牧养我的民以色列', cmd: 'sudo anoint 大卫 --king 以色列 && mount 锡安', ref: '11:2',
        verse: [
          { text: '……他们就膏大卫作以色列的王……<br>然而大卫攻取锡安的保障，就是大卫的城。', ref: '历代志上 11:3–5', hold: 6.5 },
          { text: '大卫日见强盛，因为万军之耶和华与他同在。……<br>那时天天有人来帮助大卫，以致成了大军，如神的军一样。', ref: '历代志上 11:9—12:22', hold: 7 },
          { text: '大卫和以色列众人在神前用琴、瑟、锣、鼓、号作乐，极力跳舞歌唱。', ref: '历代志上 13:8', hold: 5.5 },
          { text: '「你听见桑树梢上有脚步的声音，就要出战，<br>因为神已经在你前头去攻打非利士人的军队。」', ref: '历代志上 14:15', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.37, 10, b.instant);
              W.set('chBorderA', 0, b.instant);
              crowd('ch:elders', { n: 6, x0: 1.02, x1: 1.12, layer: 2, label: '以色列的长老', robe: [150, 132, 104] });
              cwalk('ch:elders', X('dav') + 0.08, X('dav') + 0.18, { speed: 0.05 });
              face('david', 1);
              crm('ch:flock');
              avoid([0.5, 0.99]);
            }],
            [3.2, b => {
              // 膏大卫作王
              pose('david', 'kneel');
              beamOn(b, 'david', { dur: 4.5, r: 0.2 });
              sfx(b, 'harp');
            }],
            [5.5, b => {
              add('david', KING(ROYAL, { scale: 1 }));
              pose('david', 'stand');
              glow('david', 0.6);
              cpose('ch:elders', 'bow');
            }],
            [7.5, b => {
              // 攻取锡安的保障：耶布斯成了大卫的城
              W.set('chCity', 0.62, b.instant);
              W.set('chPalace', 1, b.instant);
              walk('david', X('dav') - 0.02, { speed: 0.03, pose: 'point' });
              cwalk('ch:elders', X('dav') + 0.04, X('dav') + 0.14, { speed: 0.03 });
              if (!b.instant) { const p = palaceBox(); fx().dust(p.x, p.g, 26, [224, 206, 170], p.w); sfx(b, 'gate'); }
            }],
            [13, b => {
              // 天天有人来帮助大卫，成了大军
              crowd('ch:army', { n: 12, x0: 1.02, x1: 1.2, layer: 2, label: '大卫的军', robe: [112, 96, 80], prop: 'staff' });
              cwalk('ch:army', 0.7, 0.93, { speed: 0.045 });
              sfx(b, 'crowd', { soft: true });
            }],
            [17, b => {
              // 约柜坐新车，牛拉着，众人在神前作乐跳舞
              pose('david', 'stand');
              animal('ch:cart', { kind: 'wagon', x: 1.1, facing: -1, label: '新车' });
              animal('ch:ox1', { kind: 'cow', x: 1.04, facing: -1, label: '牛', follow: 'ch:cart', dx: -0.035 });
              S.ark = 'cart';
              walk('ch:cart', X('obed') - 0.035, { speed: 0.03 });
            }],
            [20.5, b => {
              crm('ch:elders');
              cwalk('ch:army', 0.62, 0.8, { speed: 0.03, pose: 'raise' });
              walk('david', 0.66, { speed: 0.03, pose: 'raise' });
              sfx(b, 'harp');
            }],
            [25, b => {
              // 约柜转到那家（不在经文里说出：只是车停下，约柜留在那家的院中）
              S.ark = 'obed';
              rm('ch:cart'); rm('ch:ox1');
              cpose('ch:army', 'stand');
              pose('david', 'stand');
            }],
            [26.5, b => {
              // 桑树梢上的脚步声：光在右边的树梢上走过，往前头去
              if (!b.instant) {
                const spots = (GS.land && GS.land.treeSpots ? GS.land.treeSpots() : []).filter(q => q.layer === 2 && q.grown > 0.5).sort((a, c) => c.x - a.x).slice(0, 6);
                if (spots.length) flash(b, { type: 'steps', dur: 4.5, pts: spots.map(q => [q.x / W.w, q.top / W.h]) });
                sfx(b, 'wind', { soft: true });
              }
              cwalk('ch:army', 0.5, 0.64, { speed: 0.05 });
              walk('david', 0.55, { speed: 0.04, pose: 'point' });
            }],
            [29.5, b => { flash(b, { type: 'burst', dur: 1.6, xf: 0.52, l: 1 }); sfx(b, 'thunder', { soft: true, far: true }); }],
          ]);
        },
      },

      // ── 代上 15—20：利未人肩抬约柜；帐幕；「他必为我建造殿宇」；大卫得胜 ─────
      {
        kind: 'act', utter: '神赐恩与抬耶和华约柜的利未人', cmd: 'mv 约柜 → 大卫城 --on 利未人的肩 --with 角,号,钹,瑟,琴', ref: '15:26',
        verse: [
          { text: '这样，以色列众人欢呼吹角、吹号、敲钹、鼓瑟、弹琴，<br>大发响声，将耶和华的约柜抬上来。', ref: '历代志上 15:28', hold: 6.5 },
          { text: '众人将神的约柜请进去，安放在大卫所搭的帐幕里……<br>应当称谢耶和华；因他本为善，他的慈爱永远长存！', ref: '历代志上 16:1–34', hold: 7 },
          { text: '当夜，神的话临到拿单，说：……<br>「他必为我建造殿宇；我必坚定他的国位直到永远。」', ref: '历代志上 17:3–12', hold: 6.5 },
          { text: '大卫无论往哪里去，耶和华都使他得胜。……于是亚兰人不敢再帮助亚扪人了。<br>……人将这冠冕戴在大卫头上。', ref: '历代志上 18:6—20:2', hold: 7 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.5, 12, b.instant);
              W.set('chTent', 1, b.instant);
              crm('ch:army');
              // 利未人用杠肩抬神的约柜（15:15）
              // 抬约柜的在前，吹号的、歌唱的随后，大卫穿着细麻布的以弗得跳舞，以色列众人欢呼
              const ox = X('obed') - 0.035, tx = X('tent');
              S.bearers = ['lv0', 'lv1', 'lv2', 'lv3'];
              S.bearers.forEach((id, i) => add(id, { label: '抬约柜的利未人', x: ox - 0.027 + i * 0.018, facing: -1, robe: LINEN, hair: 'cloth', accent: [206, 196, 170], glow: 0.25 }));
              S.ark = 'poles';
              S.bearers.forEach((id, i) => walk(id, tx + 0.03 + i * 0.018, { speed: 0.03, pose: 'stand' }));
              choir(b, { fromX: ox + 0.05, walk: false });
              TRUMP.forEach((id, i) => walk(id, tx + 0.105 + i * 0.012, { speed: 0.034, pose: 'point' }));
              SING.forEach((id, i) => walk(id, tx + 0.18 + i * 0.012, { speed: 0.036, pose: 'raise' }));
              add('david', KING([236, 230, 214], { label: '大卫', x: 1.14, facing: -1 }));
              walk('david', tx + 0.26, { speed: 0.04, pose: 'raise' });
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 0.6, b.instant);
              crowd('ch:isr', { n: 10, x0: 1.06, x1: 1.2, layer: 2, label: '以色列众人', v: 0.3 });
              cwalk('ch:isr', tx + 0.29, tx + 0.45, { speed: 0.04, pose: 'raise' });
              avoid([0.46, 0.99]);
              sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
            }],
            [15, b => {
              // 请进去，安放在帐幕里
              S.ark = 'tent';
              S.bearers.forEach((id, i) => walk(id, X('tent') + 0.035 + i * 0.016, { speed: 0.03, pose: 'bow' }));
              S.bearers = [];
              W.set('chPlay', 0.3, b.instant);
              W.set('chSong', 0.35, b.instant);
              cpose('ch:isr', 'bow');
              pose('david', 'raise');
              if (!b.instant) { const x = X('tent') * W.w; ring(b, x, gY(2, X('tent')) - PH(2) * 0.6, 0.22); sfx(b, 'angel'); }
            }],
            [19, b => {
              // 当夜，神的话临到拿单
              W.goTo(0.93, 6, b.instant);
              W.set('chPlay', 0, b.instant); W.set('chSong', 0, b.instant);
              crm('ch:isr');
              ['lv0', 'lv1', 'lv2', 'lv3'].forEach(id => rm(id));
              choirOff();
              add('david', KING(ROYAL, { label: '大卫' }));
              walk('david', X('tent') + 0.05, { speed: 0.03, pose: 'sit' });
            }],
            [22.5, b => {
              // 大卫的家：一盏灯在锡安点起；一行灯沿着远山亮起，直到永远；将来的殿的影子
              S.lamp = 'zion';
              W.set('chLamp', 1, b.instant);
              flash(b, { type: 'lights', dur: 6 });
              W.set('chPlan', 1, b.instant);
              W.set('chPlanA', 0.22, b.instant);
              sfx(b, 'stars');
            }],
            [27, b => {
              // 大卫得胜：远处的战事，掳来的金、银、铜分别为圣（18:8，18:11）
              W.goTo(0.33, 6, b.instant);
              W.set('chPlanA', 0, b.instant);
              W.set('chMat', 0.3, b.instant);
              pose('david', 'stand');
              flash(b, { type: 'burst', dur: 1.5, xf: 0.6, l: 0 });
              sfx(b, 'thunder', { soft: true, far: true });
            }],
            [30, b => { flash(b, { type: 'burst', dur: 1.5, xf: 0.9, l: 0 }); beamOn(b, 'david', { dur: 3, r: 0.12, w: 40 }); }],
          ]);
        },
      },

      // ── 代上 21—22:1：「够了，住手吧！」阿珥楠的禾场，火从天降 ─────
      {
        kind: 'cmd', utter: '够了，住手吧！', cmd: 'kill -STOP 灭城的天使  # 够了', ref: '21:15', hold: 3,
        verse: [
          { text: '神差遣使者去灭耶路撒冷，刚要灭的时候，耶和华看见后悔，就不降这灾了，<br>吩咐灭城的天使说：「够了，住手吧！」', ref: '历代志上 21:15', hold: 7 },
          { text: '大卫举目，看见耶和华的使者站在天地间，手里有拔出来的刀，伸在耶路撒冷以上。<br>大卫和长老都身穿麻衣，面伏于地。', ref: '历代志上 21:16', hold: 7.5 },
          { text: '大卫在那里为耶和华筑了一座坛……耶和华就应允他，使火从天降在燔祭坛上。<br>耶和华吩咐使者，他就收刀入鞘。', ref: '历代志上 21:26–27', hold: 7 },
          { text: '大卫说：「这就是耶和华神的殿，为以色列人献燔祭的坛。」', ref: '历代志上 22:1', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 使者持刀而来；神说够了——刀停在城上
              W.goTo(0.45, 8, b.instant);
              W.set('gloom', 0.3, b.instant);
              W.set('storm', 0.3, b.instant);
              S.angel = 'sword';
              W.set('chAngel', 1, b.instant);
              W.set('chSword', 1, b.instant);
              add('ornan', { label: '阿珥楠', x: altX() + 0.03, facing: -1, robe: [140, 120, 90], glow: 0.2, pose: 'carry' });
              animal('ch:oxA', { kind: 'cow', x: altX() + 0.07, facing: -1, label: '牛' });
              if (!b.instant) { W.flash = 0.35; sfx(b, 'wind'); }
            }],
            [2, b => { const g = angelGeom(); ring(b, g.x, g.y, 0.45, [255, 248, 230]); sfx(b, 'angel'); }],
            [7.5, b => {
              // 大卫和长老身穿麻衣，面伏于地
              add('david', KING(SACK, { label: '大卫' }));
              walk('david', X('dav') - 0.01, { speed: 0.035, pose: 'fall' });
              crowd('ch:elders', { n: 5, x0: X('dav') - 0.12, x1: X('dav') - 0.045, layer: 2, label: '长老', robe: SACK, pose: 'fall' });
              pose('ornan', 'bow');
            }],
            [14.5, b => {
              // 在阿珥楠的禾场上筑坛
              pose('david', 'stand');
              walk('david', altX() - 0.035, { speed: 0.035, pose: 'kneel' });
              walk('ornan', altX() + 0.06, { speed: 0.03, pose: 'stand' });
              W.set('chDAltar', 1, b.instant);
              cpose('ch:elders', 'kneel');
              sfx(b, 'build');
            }],
            [17.5, b => {
              // 火从天降在燔祭坛上
              fireFall(b, altX());
              pose('david', 'pray');
              if (!b.instant) sfx(b, 'fire');
            }],
            [18.4, b => {
              W.set('chDFire', 1, b.instant);
              W.set('gloom', 0, b.instant);
              W.set('storm', 0, b.instant);
              cpose('ch:elders', 'fall');
              pose('ornan', 'fall');
            }],
            [21, b => { S.angel = 'sheath'; W.set('chSword', 0, b.instant); if (!b.instant) sfx(b, 'seal'); }],
            [24, b => { S.angel = 'gone'; W.set('chAngel', 0, b.instant); W.goTo(0.6, 8, b.instant); }],
            [25.5, b => {
              // 这就是耶和华神的殿
              pose('david', 'stand');
              face('david', 1);
              W.set('chSite', 1, b.instant);
              rm('ornan'); rm('ch:oxA');
              cpose('ch:elders', 'stand');
              if (!b.instant) { const t = temple(); ring(b, t.x0 + 0.5 * t.tu, t.top, 0.35); sfx(b, 'harp'); }
            }],
          ]);
        },
      },

      // ── 代上 22—27：他的名要叫所罗门；材料；利未人的班次；歌唱的；守门的 ─────
      {
        kind: 'name', utter: '他的名要叫所罗门', cmd: 'name 所罗门  # 太平的人；为我的名建造殿宇', ref: '22:9', hold: 3,
        verse: [
          { text: '「你要生一个儿子，他必作太平的人……他的名要叫所罗门……<br>他必为我的名建造殿宇。」', ref: '历代志上 22:9–10', hold: 6.5 },
          { text: '每日早晚，站立称谢赞美耶和华……<br>都掣签分立，彼此一样。', ref: '历代志上 23:30—24:5', hold: 5.5 },
          { text: '他们和他们的弟兄学习颂赞耶和华；善于歌唱的共有二百八十八人。', ref: '历代志上 25:7', hold: 5.5 },
          { text: '他们无论大小，都按着宗族掣签分守各门。……<br>每班是二万四千人，周年按月轮流，替换出入服事王。', ref: '历代志上 26:13—27:1', hold: 6.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.38, 10, b.instant);
              W.set('chSite', 0.25, b.instant);
              W.set('chDFire', 0.35, b.instant);
              crm('ch:elders');
              add('david', KING(ROYAL, { label: '大卫', age: 'elder' }));
              walk('david', X('dav'), { speed: 0.03, pose: 'stand' });
              add('solomon', { label: '所罗门', x: X('dav2'), facing: -1, age: 'child', robe: [176, 140, 84], glow: 0.6, from: 'light' });
              if (!b.instant) {
                const size = M() * 0.1, cx = clamp(X('dav2') * W.w, size * 1.8, W.w - size * 1.8), cy = tall() ? W.h * 0.44 : W.horizonY * 0.55;
                safe('ch.name', () => fx().nameStr('所罗门', cx, cy, size, [255, 226, 160], () => [cx + (Math.random() - 0.5) * size * 3, cy + (Math.random() - 0.5) * size, [255, 236, 190]], { hold: 3.5 }));
                if (au() && au().nameChime) safe('ch.chime', () => au().nameChime('所'));
              }
            }],
            [3, b => {
              // 材料：石头、香柏木、铜、铁、金、银（22:2–5，14）
              W.set('chMat', 1, b.instant);
              crowd('ch:work', { n: 6, x0: 1.02, x1: 1.12, layer: 2, label: '石匠', robe: [150, 130, 104], prop: 'bundle' });
              cwalk('ch:work', 0.72, 0.9, { speed: 0.05, pose: 'carry' });
              sfx(b, 'build');
            }],
            [9, b => {
              // 利未人、祭司掣签分班
              crm('ch:work');
              choir(b, {});
              flash(b, { type: 'lots', dur: 5, pts: [...TRUMP, ...SING].map(id => { const p = fig(id); return p ? p.nx : null; }).filter(v => v != null) });
            }],
            [15, b => {
              // 学习颂赞：二百八十八个歌唱的
              W.set('chPlay', 0.8, b.instant);
              W.set('chSong', 0.45, b.instant);
              TRUMP.forEach(id => pose(id, 'point'));
              sfx(b, 'harp');
            }],
            [21, b => {
              W.set('chPlay', 0, b.instant);
              W.set('chSong', 0.15, b.instant);
              TRUMP.forEach(id => pose(id, 'stand'));
              // 守门的与轮班的军
              add('gk0', { label: '守门的', layer: 1, x: cityEdge(0.62)[0] + 0.012, facing: -1, robe: [140, 120, 96], prop: 'staff', glow: 0.2 });
              add('gk1', { label: '守门的', x: 0.96, facing: -1, robe: [140, 120, 96], prop: 'staff', glow: 0.2 });
              crowd('ch:watch', { n: 8, x0: 1.02, x1: 1.12, layer: 1, label: '轮班的军', robe: [112, 96, 80], prop: 'staff' });
              cwalk('ch:watch', 0.66, 0.84, { speed: 0.04 });
              pose('solomon', 'stand');
            }],
          ]);
        },
      },

      // ── 代上 28—29：「我拣选他作我的子」；样式；乐意奉献；大卫老迈而死 ─────
      {
        kind: 'promise', utter: '我拣选他作我的子', cmd: 'adopt 所罗门 --as 子 && render 殿.样式  # 耶和华用手划出', ref: '28:6',
        verse: [
          { text: '耶和华对我说：『你儿子所罗门必建造我的殿和院宇；<br>因为我拣选他作我的子，我也必作他的父。』', ref: '历代志上 28:6', hold: 6.5 },
          { text: '「这一切工作的样式都是耶和华用手划出来使我明白的。」', ref: '历代志上 28:19', hold: 5.5 },
          { text: '耶和华啊，尊大、能力、荣耀、强胜、威严都是你的；<br>凡天上地下的都是你的……', ref: '历代志上 29:11', hold: 6.5 },
          { text: '他年纪老迈，日子满足，享受丰富、尊荣，就死了。<br>他儿子所罗门接续他作王。', ref: '历代志上 29:28', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.5, 12, b.instant);
              crm('ch:watch'); rm('gk0'); rm('gk1');
              W.set('chSong', 0, b.instant);
              add('solomon', { label: '所罗门', age: 'adult', robe: [176, 140, 84], glow: 0.6 });
              walk('solomon', X('dav2'), { speed: 0.03, pose: 'kneel' });
              face('solomon', -1);
              beamOn(b, 'solomon', { dur: 5, r: 0.2 });
              sfx(b, 'harp');
            }],
            [2.5, b => {
              // 殿的样式：金线在空中一笔一笔写出
              W.set('chPlan', 0, true);
              W.set('chPlan', 1, b.instant);
              W.set('chPlanA', 1, b.instant);
              pose('david', 'point');
              face('david', 1);
            }],
            [12.5, b => {
              // 众人乐意奉献；大卫称颂耶和华
              israel(b, { n: 12 });
              pose('david', 'raise');
              pose('solomon', 'stand');
              W.set('chMat', 1, b.instant);
              flash(b, { type: 'rise', dur: 5, x0: X('isr')[0], x1: X('isr')[1] });
              sfx(b, 'crowd', { soft: true });
            }],
            [17, () => { cpose('ch:isr', 'bow'); }],
            [19.5, b => {
              // 他年纪老迈，日子满足，就死了
              W.goTo(0.77, 9, b.instant);
              pose('david', 'lie');
              glow('david', 0.1);
              if (!b.instant) sfx(b, 'weep', { soft: true });
            }],
            [24, b => {
              rm('david');
              add('solomon', KING([176, 140, 84], { label: '所罗门', glow: 0.6 }));
              W.set('chLamp', 1, b.instant);
              cpose('ch:isr', 'stand');
              ring(b, X('dav') * W.w, gY(2, X('dav')) - PH(2), 0.2);
            }],
          ]);
        },
      },

      // ── 代下 1—4：基遍的夜，求智慧；殿在摩利亚山上建成 ─────
      {
        kind: 'ask', utter: '你愿我赐你什么，你可以求', cmd: 'prompt 所罗门 "你愿我赐你什么？"  # → 智慧聪明', ref: '历代志下 1:7', hold: 3.4,
        verse: [
          { text: '所罗门对神说：「……求你赐我智慧聪明……」<br>神对所罗门说：「……我必赐你智慧聪明，也必赐你资财、丰富、尊荣……」', ref: '历代志下 1:8–12', hold: 7 },
          { text: '天和天上的天，尚且不足他居住的，谁能为他建造殿宇呢？', ref: '历代志下 2:6', hold: 5.5 },
          { text: '所罗门就在耶路撒冷、耶和华向他父大卫显现的摩利亚山上，<br>就是耶布斯人阿珥楠的禾场上……开工建造耶和华的殿。', ref: '历代志下 3:1', hold: 7 },
          { text: '将两根柱子立在殿前……右边的起名叫雅斤，左边的起名叫波阿斯。<br>他又制造一座铜坛……又铸一个铜海……', ref: '历代志下 3:17—4:2', hold: 7 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 当夜，在基遍
              W.goTo(0.02, 4, b.instant);
              crm('ch:isr');
              choirOff();
              W.set('chGibeon', 1, b.instant);
              W.set('chPlanA', 0.1, b.instant);
              rm('solomon');
              add('sol:g', KING([176, 140, 84], { label: '所罗门', layer: 1, x: X('gil') - 0.028, facing: 1, glow: 0.7, from: 'fade', pose: 'kneel' }));
            }],
            [1.5, b => { beam(b, X('gil') - 0.028, 1, { dur: 6, w: 50, r: 0.15 }); sfx(b, 'angel'); }],
            [4.5, b => { glow('sol:g', 1); if (!b.instant) { const p = fig('sol:g'); if (p) fx().sparkle(p.nx * W.w, gY(1, p.nx) - PH(1), 20, [255, 236, 190], 10, 'mid'); } }],
            [8.5, b => {
              // 天亮：所罗门回到耶路撒冷；工人与香柏木
              W.goTo(0.3, 6, b.instant);
              W.set('chGibeon', 0, b.instant);
              rm('sol:g');
              add('solomon', KING([176, 140, 84], { label: '所罗门', x: X('dav'), facing: 1, glow: 0.6 }));
              crowd('ch:work', { n: 8, x0: 1.02, x1: 1.14, layer: 2, label: '工匠', robe: [150, 130, 104], prop: 'bundle' });
              cwalk('ch:work', 0.72, 0.95, { speed: 0.05, pose: 'carry' });
            }],
            [15.5, b => {
              // 开工建造：墙一层一层升起，样式渐渐被石头填满
              W.set('chBuild', 1, b.instant);
              W.set('chPlanA', 0, b.instant);
              W.set('chDFire', 0, b.instant);
              W.set('chSite', 0, b.instant);
              W.goTo(0.46, 12, b.instant);
              sfx(b, 'build');
            }],
            [24, b => {
              // 铜坛与铜海
              W.set('chDAltar', 0, b.instant);
              W.set('chAltar', 1, b.instant);
              W.set('chSea', 1, b.instant);
              W.set('chFloor', 0, b.instant);
              W.set('chObed', 0, b.instant);
              W.set('chMat', 0, b.instant);
              cwalk('ch:work', 0.93, 1.1, { speed: 0.05 });
              sfx(b, 'build');
            }],
            [29, b => { crm('ch:work'); }],
          ]);
        },
      },

      // ── 代下 5—7:10 ★ 奉献：声合为一，云充满了殿；铜台上的祷告；火从天降 ─────
      {
        kind: 'act', utter: '耶和华本为善，他的慈爱永远长存', cmd: 'sync 号 钹 琴 瑟 歌 --one-voice && fill 殿 --cloud --fire', ref: '历代志下 5:13', hold: 3.6,
        verse: [
          { text: '吹号的、歌唱的都一齐发声，声合为一，赞美感谢耶和华……那时，耶和华的殿有云充满，<br>甚至祭司不能站立供职，因为耶和华的荣光充满了神的殿。', ref: '历代志下 5:13–14', hold: 7.5 },
          { text: '所罗门……当着以色列的会众跪下，向天举手……<br>「神果真与世人同住在地上吗？看哪，天和天上的天尚且不足你居住的……」', ref: '历代志下 6:13–18', hold: 7 },
          { text: '所罗门祈祷已毕，就有火从天上降下来，烧尽燔祭和别的祭。<br>耶和华的荣光充满了殿；', ref: '历代志下 7:1', hold: 6 },
          { text: '……以色列众人看见，就在铺石地俯伏叩拜，称谢耶和华说：<br>耶和华本为善，他的慈爱永远长存！', ref: '历代志下 7:3', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 祭司将约柜从帐幕抬进内殿（5:7）
              W.goTo(0.735, 16, b.instant);
              const t = temple(), door = (t.x0 + 0.12 * t.tu) / W.w;
              S.bearers = ['lv0', 'lv1', 'lv2', 'lv3'];
              S.bearers.forEach((id, i) => add(id, { label: '抬约柜的祭司', x: X('tent') - 0.02 + i * 0.02, facing: 1, robe: LINEN, hair: 'cloth', accent: [206, 196, 170], glow: 0.3 }));
              S.ark = 'poles';
              S.bearers.forEach((id, i) => walk(id, door - 0.03 + i * 0.02, { speed: 0.05 }));
              choir(b, {});
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => pose(id, 'stand'));
              W.set('chPlay', 0.8, b.instant);
              W.set('chSong', 0.45, b.instant);
              israel(b, { n: 14 });
              add('solomon', KING([176, 140, 84], { label: '所罗门', x: X('plat') - 0.04, facing: 1, glow: 0.6 }));
              W.set('chTent', 0, b.instant);
              W.set('chPlat', 1, b.instant);
              W.set('chFire', 0.5, b.instant);
              avoid([0.4, 0.99]);
            }],
            [4.2, b => {
              S.ark = 'in';
              S.bearers.forEach(id => rm(id));
              S.bearers = [];
            }],
            [5, b => {
              // 声合为一
              S.one = true;
              S.oneT0 = b.instant ? -1e9 : W.t;
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 1, b.instant);
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => pose(id, 'raise'));
              sfx(b, 'angel'); sfx(b, 'harp');
            }],
            [7.5, b => {
              // 云充满了殿，祭司不能站立供职
              W.set('chCloud', 1, b.instant);
              W.set('chGlory', 0.55, b.instant);
              if (!b.instant) sfx(b, 'wind', { soft: true });
            }],
            [10.5, b => {
              TRUMP.forEach(id => pose(id, 'kneel'));
              W.set('chPlay', 0.35, b.instant);
              // 所罗门站在铜台上，跪下，向天举手
              walk('solomon', X('plat'), { speed: 0.03, pose: 'pray' });
              C().attach && C().attach('solomon', null);
            }],
            [12, b => {
              const c2 = C();
              if (c2 && c2.attach) c2.attach('solomon', () => { const p = fig('solomon'); return p ? [p.nx * W.w, platY()] : null; });
            }],
            [18, b => {
              // 火从天上降下来
              fireFall(b, altX());
              W.set('chCloud', 0.6, b.instant);
              sfx(b, 'fire'); sfx(b, 'thunder', { soft: true });
            }],
            [18.9, b => {
              W.set('chFire', 1.5, b.instant);
              W.set('chGlory', 1, b.instant);
              cpose('ch:isr', 'fall');
              SING.forEach(id => pose(id, 'kneel'));
              W.set('chSong', 0.7, b.instant);
              W.set('chPlay', 0, b.instant);
            }],
            [25, b => {
              W.set('chFire', 1, b.instant);
              W.set('chSong', 0.55, b.instant);
              sfx(b, 'angel');
            }],
          ]);
        },
      },

      // ── 代下 7:11—12：夜间的应许；示巴女王；所罗门死；国分裂；示撒 ─────
      {
        kind: 'promise', utter: '这称为我名下的子民，若是自卑、祷告', cmd: 'if (自卑 && 祷告 && 寻求我面 && 转离恶行) { 垂听(); 赦免(); 医治(地); }', ref: '历代志下 7:14', hold: 3.6,
        verse: [
          { text: '夜间耶和华向所罗门显现……「这称为我名下的子民，若是自卑、祷告，寻求我的面，转离他们的恶行，<br>我必从天上垂听，赦免他们的罪，医治他们的地。」', ref: '历代志下 7:12–14', hold: 8.5 },
          { text: '……耶和华的殿全然完毕。……<br>示巴女王听见所罗门的名声，就来到耶路撒冷……', ref: '历代志下 8:16—9:1', hold: 5.5 },
          { text: '所罗门与他列祖同睡……以色列众人都回自己家里去了。……<br>凡立定心意寻求耶和华以色列神的，都随从利未人，来到耶路撒冷……', ref: '历代志下 9:31—11:16', hold: 7 },
          { text: '耶和华见他们自卑，耶和华的话就临到示玛雅说：<br>「他们既自卑，我必不灭绝他们……」', ref: '历代志下 12:7', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.97, 5, b.instant);
              C().attach && C().attach('solomon', null);
              add('solomon', KING([176, 140, 84], { label: '所罗门' }));
              walk('solomon', X('dav') - 0.03, { speed: 0.03, pose: 'sit' });
              W.set('chPlat', 0, b.instant);
              W.set('chCloud', 0, b.instant);
              W.set('chGlory', 0.45, b.instant);
              W.set('chFire', 0.6, b.instant);
              W.set('chSong', 0, b.instant);
              S.one = false;
              cwalk('ch:isr', 1.02, 1.15, { speed: 0.05 });
              choirPose('stand');
            }],
            [3, b => { crm('ch:isr'); beamOn(b, 'solomon', { dur: 6, r: 0.18 }); sfx(b, 'angel'); }],
            [5.5, b => {
              // 医治他们的地
              flash(b, { type: 'heal', dur: 5, x: altX() });
              W.set('bloom', 1, b.instant);
              W.set('bare', 0, b.instant);
              sfx(b, 'harp');
            }],
            [8, b => { W.goTo(0.33, 4, b.instant); }],
            [10, b => {
              // 示巴女王的驼队
              choirOff();
              add('solomon', KING([176, 140, 84], { label: '所罗门' }));
              walk('solomon', X('dav') + 0.03, { speed: 0.03, pose: 'stand' });
              face('solomon', 1);
              add('sheba', { label: '示巴女王', sex: 'f', x: 1.06, facing: -1, robe: [150, 64, 112], accent: [236, 200, 110], glow: 0.35 });
              walk('sheba', X('dav') + 0.1, { speed: 0.04, pose: 'bow' });
              animal('ch:cam1', { kind: 'camel', x: 1.12, facing: -1, label: '骆驼', pack: true });
              animal('ch:cam2', { kind: 'camel', x: 1.18, facing: -1, label: '骆驼', pack: true });
              walk('ch:cam1', X('dav') + 0.17, { speed: 0.04 });
              walk('ch:cam2', X('dav') + 0.23, { speed: 0.04 });
              sfx(b, 'camel');
            }],
            [16.5, b => {
              // 所罗门与他列祖同睡；国分裂
              rm('sheba'); rm('ch:cam1'); rm('ch:cam2');
              pose('solomon', 'lie');
              glow('solomon', 0.1);
              W.goTo(0.52, 8, b.instant);
            }],
            [19, b => {
              rm('solomon');
              king(b, 'k:rehob', '罗波安', { robe: ROYAL2 });
              crowd('ch:north', { n: 10, x0: 0.62, x1: 0.8, layer: 2, label: '以色列众人', from: 'fade' });
              cwalk('ch:north', 1.06, 1.25, { speed: 0.04 });
              crowd('ch:levn', { n: 4, x0: 1.04, x1: 1.12, layer: 2, label: '利未人', robe: LINEN });
              cwalk('ch:levn', X('king') + 0.04, X('king') + 0.1, { speed: 0.035 });
              sfx(b, 'crowd', { soft: true });
            }],
            [23.5, b => {
              // 示撒上来；王和首领自卑
              crm('ch:north');
              crowd('ch:egypt', { n: 8, x0: 1.04, x1: 1.16, layer: 2, label: '埃及的军', robe: [70, 62, 60], prop: 'staff' });
              cwalk('ch:egypt', 0.86, 0.98, { speed: 0.045 });
              pose('k:rehob', 'kneel');
              cpose('ch:levn', 'bow');
            }],
            [27.5, b => {
              cwalk('ch:egypt', 1.06, 1.2, { speed: 0.04 });
              pose('k:rehob', 'stand');
              beamOn(b, 'k:rehob', { dur: 3, r: 0.12, w: 40 });
            }],
            [30.5, () => { crm('ch:egypt'); crm('ch:levn'); }],
          ]);
        },
      },

      // ── 代下 13—17：耶和华的眼目遍察全地 ─────
      {
        kind: 'act', utter: '耶和华的眼目遍察全地', cmd: 'scan --all-earth --for 诚实的心 | strengthen', ref: '历代志下 16:9',
        verse: [
          { text: '犹大人……就呼求耶和华，祭司也吹号。……<br>神就使耶罗波安和以色列众人败在亚比雅与犹大人面前。', ref: '历代志下 13:14–15', hold: 6.5 },
          { text: '亚撒呼求耶和华他的神说：<br>「耶和华啊，惟有你能帮助软弱的，胜过强盛的……」', ref: '历代志下 14:11', hold: 5.5 },
          { text: '「……你们若寻求他，就必寻见……」……<br>耶和华的眼目遍察全地，要显大能帮助向他心存诚实的人。', ref: '历代志下 15:2—16:9', hold: 6.5 },
          { text: '他高兴遵行耶和华的道……<br>他们带着耶和华的律法书，走遍犹大各城教训百姓。', ref: '历代志下 17:6–9', hold: 5.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.42, 8, b.instant);
              S.eyesT0 = b.instant ? -1e9 : W.t;
              W.set('chEyes', 1, b.instant);
              rm('k:rehob');
              // 亚比雅：前后都有敌兵，呼求，吹号，呐喊
              king(b, 'k:abijah', '亚比雅', { robe: ROYAL });
              choir(b, {});
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => rm(id));
              W.set('chPlay', 1, b.instant);
              crowd('ch:foeL', { n: 5, x0: 0.33, x1: 0.4, layer: 2, label: '以色列的兵', robe: [60, 56, 58], prop: 'staff' });
              crowd('ch:foeR', { n: 5, x0: 0.93, x1: 0.99, layer: 2, label: '以色列的兵', robe: [60, 56, 58], prop: 'staff' });
              sfx(b, 'crowd');
            }],
            [4, b => {
              cwalk('ch:foeL', 0.12, 0.2, { speed: 0.06 });
              cwalk('ch:foeR', 1.1, 1.2, { speed: 0.06 });
              pose('k:abijah', 'raise');
              W.set('chPlay', 0, b.instant);
              flash(b, { type: 'burst', dur: 1.4, xf: X('king'), l: 2 });
            }],
            [8, b => {
              crm('ch:foeL'); crm('ch:foeR');
              TRUMP.forEach(id => pose(id, 'stand'));
              rm('k:abijah');
              king(b, 'k:asa', '亚撒', { robe: ROYAL2, pose: 'pray' });
            }],
            [11, b => { glow('k:asa', 0.9); beamOn(b, 'k:asa', { dur: 4, r: 0.14, w: 44 }); }],
            [15, b => {
              // 你们若寻求他，就必寻见：众人立约，欢呼
              israel(b, { n: 12 });
              cpose('ch:isr', 'raise');
              pose('k:asa', 'stand');
              sfx(b, 'crowd', { soft: true });
            }],
            [21.5, b => {
              // 约沙法：带着律法书，走遍犹大各城
              cpose('ch:isr', 'stand');
              crm('ch:isr');
              rm('k:asa');
              king(b, 'k:jehosh', '约沙法', { robe: ROYAL });
              crowd('ch:teach', { n: 6, x0: X('king') - 0.02, x1: X('king') + 0.06, layer: 2, label: '教训百姓的利未人', robe: LINEN, prop: 'bundle' });
              cwalk('ch:teach', 0.34, 0.44, { speed: 0.03 });
            }],
            [28, b => { W.set('chEyes', 0, b.instant); crm('ch:teach'); }],
          ]);
        },
      },

      // ── 代下 18—20：胜败不在乎你们，乃在乎神；歌唱的走在军前 ─────
      {
        kind: 'promise', utter: '胜败不在乎你们，乃在乎神', cmd: 'delegate 争战 --to 神 && send 歌唱的 --before 军', ref: '历代志下 20:15',
        verse: [
          { text: '约沙法一呼喊，耶和华就帮助他……<br>约沙法……出巡民间……引导民归向耶和华他们列祖的神。', ref: '历代志下 18:31—19:4', hold: 6 },
          { text: '「……耶和华对你们如此说：『不要因这大军恐惧惊惶；<br>因为胜败不在乎你们，乃在乎神。』」', ref: '历代志下 20:15', hold: 6 },
          { text: '……使他们穿上圣洁的礼服，走在军前赞美耶和华说：<br>「当称谢耶和华，因他的慈爱永远长存！」', ref: '历代志下 20:21', hold: 6.5 },
          { text: '众人方唱歌赞美的时候，耶和华就派伏兵……<br>他们就被打败了。', ref: '历代志下 20:22', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.78, 8, b.instant);
              W.set('chEyes', 0, b.instant);
              S.camp = 'moab';
              W.set('chCamp', 1, b.instant);
              W.set('chCampOut', 0, true);
              add('k:jehosh', KING(ROYAL, { label: '约沙法' }));
              walk('k:jehosh', X('king'), { speed: 0.03, pose: 'raise' });
              beamOn(b, 'k:jehosh', { dur: 4, r: 0.14, w: 44 });
              israel(b, { n: 14 });
              cpose('ch:isr', 'kneel');
            }],
            [7, b => {
              W.goTo(0.02, 6, b.instant);
              pose('k:jehosh', 'fall');
              cpose('ch:isr', 'fall');
              choir(b, {});
              choirPose('stand');
              W.set('chSong', 0.5, b.instant);
              sfx(b, 'harp');
            }],
            [13.5, b => {
              // 次日清早：歌唱的穿上圣洁的礼服，走在军前
              W.goTo(0.27, 6, b.instant);
              pose('k:jehosh', 'stand');
              cpose('ch:isr', 'stand');
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 1, b.instant);
              S.one = true;
              S.oneT0 = b.instant ? -1e9 : W.t;
              // 往敌营那边去（远山在殿的后面）：歌唱的在最前，吹号的随后，军兵在后
              const t = temple(), a0 = (t.x0 + 0.3 * t.tu) / W.w;
              SING.forEach((id, i) => { walk(id, a0 + 0.1 + i * 0.022, { speed: 0.03, pose: 'raise' }); face(id, 1); });
              TRUMP.forEach((id, i) => { walk(id, a0 + i * 0.018, { speed: 0.03, pose: 'point' }); face(id, 1); });
              cwalk('ch:isr', X('isr')[1], a0 - 0.03, { speed: 0.03 });
              walk('k:jehosh', a0 - 0.05, { speed: 0.03 });
              sfx(b, 'angel');
            }],
            [20.5, b => {
              // 伏兵：敌营的火一处一处熄灭
              W.set('chCampOut', 1, b.instant);
              flash(b, { type: 'burst', dur: 1.5, xf: 0.62, l: 0 });
              sfx(b, 'thunder', { soft: true, far: true });
            }],
            [23, b => { flash(b, { type: 'burst', dur: 1.5, xf: 0.74, l: 0 }); }],
            [26.5, b => {
              W.set('chCamp', 0, b.instant);
              S.camp = 'none';
              S.one = false;
              W.set('chPlay', 0.2, b.instant);
              W.set('chSong', 0.4, b.instant);
              cpose('ch:isr', 'raise');
              SING.forEach(id => pose(id, 'stand'));
            }],
          ]);
        },
      },

      // ── 代下 21—27：大卫的灯；约阿施藏在殿里六年；银柜；诸王 ─────
      {
        kind: 'promise', utter: '永远赐灯光与大卫和他的子孙', cmd: 'while (王) { 灯.keepAlive(大卫家); }', ref: '历代志下 21:7', hold: 3.4,
        verse: [
          { text: '耶和华却因自己与大卫所立的约，不肯灭大卫的家，<br>照他所应许的，永远赐灯光与大卫和他的子孙。', ref: '历代志下 21:7', hold: 6.5 },
          { text: '约阿施……藏在神殿里六年……<br>于是领王子出来，给他戴上冠冕……众人说：「愿王万岁！」', ref: '历代志下 22:12—23:11', hold: 6.5 },
          { text: '众首领和百姓都欢欢喜喜地将银子送来，投入柜中……<br>亚玛谢行耶和华眼中看为正的事，只是心不专诚。', ref: '历代志下 24:10—25:2', hold: 6.5 },
          { text: '……他寻求耶和华，神就使他亨通。……<br>约坦在耶和华他神面前行正道，以致日渐强盛。', ref: '历代志下 26:5—27:6', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.45, 6, b.instant);
              W.set('chPlay', 0, b.instant); W.set('chSong', 0, b.instant);
              S.one = false;
              choirOff();
              crm('ch:isr');
              rm('k:jehosh');
              S.lamp = 'zion';
              W.set('chLamp', 1, b.instant);
              if (!b.instant) { ring(b, lampPos.x, lampPos.y, 0.2); sfx(b, 'harp'); }
              king(b, 'k:joram', '约兰', { robe: [90, 60, 70] });
            }],
            [4.5, b => {
              rm('k:joram');
              // 亚她利雅篡位：城暗了；灯藏进神殿（约阿施和她们一同藏在神殿里六年）
              W.goTo(0.9, 5, b.instant);
              S.lamp = 'hidden';
              W.set('chLamp', 0.8, b.instant);
              W.set('chDoor', 0.3, b.instant);
            }],
            [10.5, b => {
              // 第七年：领王子出来，戴上冠冕
              W.goTo(0.3, 5, b.instant);
              add('jehoiada', { label: '耶何耶大', x: X('king') + 0.07, facing: -1, robe: LINEN, hair: 'cloth', accent: [226, 200, 120], age: 'elder', glow: 0.35 });
              king(b, 'joash', '约阿施', { age: 'child', robe: ROYAL, fromX: (temple().x0 + 0.12 * temple().tu) / W.w, speed: 0.03 });
              israel(b, { n: 12 });
            }],
            [14, b => {
              S.lamp = 'zion';
              W.set('chLamp', 1, b.instant);
              W.set('chDoor', 1, b.instant);
              cpose('ch:isr', 'raise');
              beamOn(b, 'joash', { dur: 3.5, r: 0.14, w: 40 });
              sfx(b, 'crowd');
            }],
            [16.5, b => {
              // 银柜：众人欢欢喜喜地将银子投入柜中；殿修造得坚固
              W.set('chChest', 1, b.instant);
              const t = temple(), cx = (t.x0 - 0.13 * t.tu) / W.w;
              cwalk('ch:isr', cx - 0.12, cx - 0.02, { speed: 0.03 });
              rm('jehoiada');
            }],
            [20.5, b => {
              W.set('chChest', 0, b.instant);
              rm('joash');
              king(b, 'k:amaz', '亚玛谢', { robe: ROYAL2 });
              W.set('chLamp', 0.6, b.instant);
            }],
            [24, b => {
              rm('k:amaz');
              king(b, 'k:uzz', '乌西雅', { robe: ROYAL });
              W.set('chTower', 1, b.instant);
              W.set('chLamp', 1, b.instant);
              sfx(b, 'build');
            }],
            [27.5, b => {
              rm('k:uzz');
              king(b, 'k:jotham', '约坦', { robe: ROYAL2 });
              crm('ch:isr');
            }],
          ]);
        },
      },

      // ── 代下 28—33：殿门被封，又被打开；逾越节的喜乐；堆垒；亚述；玛拿西 ─────
      {
        kind: 'promise', utter: '你们若转向他，他必不转脸不顾你们', cmd: 'git revert 亚哈斯 && open 殿门 && resume 歌', ref: '历代志下 30:9', hold: 3.6,
        verse: [
          { text: '亚哈斯……封锁耶和华殿的门……<br>……元年正月，开了耶和华殿的门，重新修理。', ref: '历代志下 28:24—29:3', hold: 6 },
          { text: '……燔祭一献，就唱赞美耶和华的歌……在耶路撒冷大有喜乐……<br>他们的祷告达到天上的圣所。', ref: '历代志下 29:27—30:27', hold: 7 },
          { text: '……积成堆垒。……<br>耶和华就差遣一个使者进入亚述王营中……', ref: '历代志下 31:6—32:21', hold: 5.5 },
          { text: '他在急难的时候，就恳求耶和华他的神……<br>玛拿西这才知道惟独耶和华是神。', ref: '历代志下 33:12–13', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 亚哈斯封锁殿门；城中各处拐角的坛
              W.goTo(0.7, 4, b.instant);
              rm('k:jotham');
              king(b, 'k:ahaz', '亚哈斯', { robe: [70, 56, 62] });
              W.set('chDoor', 0, b.instant);
              W.set('chGlory', 0, b.instant);
              W.set('chFire', 0, b.instant);
              W.set('chCorner', 1, b.instant);
              W.set('chLamp', 0.45, b.instant);
              sfx(b, 'seal');
            }],
            [4, b => {
              // 希西家开了殿门
              rm('k:ahaz');
              king(b, 'k:hez', '希西家', { robe: ROYAL, fromX: X('king') - 0.06 });
              W.goTo(0.3, 5, b.instant);
            }],
            [6, b => {
              W.set('chDoor', 1, b.instant);
              W.set('chGlory', 0.6, b.instant);
              W.set('chCorner', 0, b.instant);
              W.set('chLamp', 1, b.instant);
              if (!b.instant) { const t = temple(); ring(b, t.x0 + 0.12 * t.tu, t.top - 0.16 * t.tu, 0.3); sfx(b, 'gate'); }
            }],
            [8, b => {
              // 燔祭一献，就唱赞美耶和华的歌
              W.set('chFire', 1, b.instant);
              choir(b, {});
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => pose(id, 'raise'));
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 1, b.instant);
              S.one = true;
              S.oneT0 = b.instant ? -1e9 : W.t;
              crowd('ch:pass', { n: 12, x0: 1.02, x1: 1.16, layer: 2, label: '守逾越节的人', v: 0.3 });
              cwalk('ch:pass', X('isr')[0] + 0.02, X('isr')[1] + 0.1, { speed: 0.05, pose: 'raise' });
              sfx(b, 'angel');
            }],
            [12.5, b => { flash(b, { type: 'rise', dur: 6, x0: X('isr')[0], x1: X('isr')[1] + 0.1 }); sfx(b, 'stars', { soft: true }); }],
            [16, b => {
              // 堆垒；亚述王的营
              W.set('chHeaps', 1, b.instant);
              W.set('chPlay', 0, b.instant); W.set('chSong', 0.2, b.instant);
              S.one = false;
              W.goTo(0.96, 5, b.instant);
              S.camp = 'assyria';
              W.set('chCamp', 1, b.instant);
              W.set('chCampOut', 0, true);
            }],
            [20, b => {
              // 耶和华差遣一个使者进入亚述王营中
              flash(b, { type: 'sweep', dur: 3 });
              W.set('chCampOut', 1, b.instant);
              pose('k:hez', 'pray');
              sfx(b, 'angel');
            }],
            [23, b => {
              W.set('chCamp', 0, b.instant);
              S.camp = 'none';
              crm('ch:pass');
              choirOff();
              W.set('chSong', 0, b.instant);
              W.goTo(0.35, 5, b.instant);
              rm('k:hez');
              // 玛拿西：被带到巴比伦，在急难中自卑，归回耶路撒冷
              king(b, 'k:man', '玛拿西', { robe: [84, 60, 66], x: X('ret')[0], pose: 'kneel' });
            }],
            [26.5, b => {
              beamOn(b, 'k:man', { dur: 3, r: 0.12, w: 40 });
              glow('k:man', 0.7);
              walk('k:man', X('king'), { speed: 0.04, pose: 'stand' });
            }],
          ]);
        },
      },

      // ── 代下 34—36:21：律法书；约西亚；使者；焚烧；被掳；地享受安息 ─────
      {
        kind: 'act', utter: '因为爱惜自己的民和他的居所', cmd: 'retry --from-early 使者 → 百姓  # 因为爱惜', ref: '历代志下 36:15', hold: 3.4,
        verse: [
          { text: '希勒家对书记沙番说：「我在耶和华殿里得了律法书。」……<br>耶利米为约西亚作哀歌……', ref: '历代志下 34:15—35:25', hold: 6 },
          { text: '耶和华他们列祖的神因为爱惜自己的民和他的居所，从早起来差遣使者去警戒他们。<br>他们却嘻笑神的使者……', ref: '历代志下 36:15–16', hold: 7 },
          { text: '迦勒底人焚烧神的殿，拆毁耶路撒冷的城墙，用火烧了城里的宫殿……<br>凡脱离刀剑的，迦勒底王都掳到巴比伦去……', ref: '历代志下 36:19–20', hold: 7 },
          { text: '……地享受安息；因为地土荒凉便守安息，直满了七十年。', ref: '历代志下 36:21', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.42, 6, b.instant);
              W.set('chHeaps', 0, b.instant);
              rm('k:man');
              king(b, 'k:jos', '约西亚', { robe: ROYAL });
              const t = temple(), door = (t.x0 + 0.12 * t.tu) / W.w;
              add('hilkiah', { label: '希勒家', x: door, facing: -1, robe: LINEN, hair: 'cloth', accent: [226, 200, 120], age: 'elder', glow: 0.4, from: 'fade' });
              walk('hilkiah', X('king') + 0.035, { speed: 0.03, pose: 'carry' });
              S.scroll = true;
              israel(b, { n: 12 });
              sfx(b, 'harp');
            }],
            [4.5, b => {
              // 约西亚死了，众人悲哀
              pose('k:jos', 'lie');
              glow('k:jos', 0.1);
              cpose('ch:isr', 'weep');
              pose('hilkiah', 'weep');
              if (!b.instant) sfx(b, 'weep');
            }],
            [7.5, b => {
              rm('k:jos'); rm('hilkiah'); S.scroll = false;
              W.goTo(0.8, 8, b.instant);
              S.msgT0 = b.instant ? -1e9 : W.t;
              flash(b, { type: 'messengers', dur: 7 });
              cpose('ch:isr', 'stand');
              W.set('chLamp', 0.5, b.instant);
            }],
            [11.5, b => { cpose('ch:isr', 'point'); W.set('chGlory', 0.2, b.instant); }],
            [14.5, b => {
              // 焚烧神的殿，拆毁城墙；被掳到巴比伦（东边）
              W.goTo(0.02, 3, b.instant);
              W.set('chBurn', 1, b.instant);
              W.set('chRuin', 1, b.instant);
              W.set('chGlory', 0, b.instant);
              W.set('chFire', 0, b.instant);
              W.set('chDoor', 0.4, b.instant);
              W.set('chTower', 0, b.instant);
              S.lamp = 'exile';
              W.set('chLamp', 0.45, b.instant);
              const g2 = C().crowds && C().crowds.get('ch:isr');
              if (g2) g2.members.forEach(m => { m.glow = 0.45; });
              cwalk('ch:isr', X('ret')[0] - 0.08, X('ret')[0] - 0.02, { speed: 0.028 });
              if (!b.instant) { W.shake = 0.5; sfx(b, 'fire'); sfx(b, 'weep', { soft: true }); }
            }],
            [21, b => { crm('ch:isr'); W.set('chBurn', 0, b.instant); }],
            [22.5, b => {
              // 地享受安息：火熄了，年岁一年一年过去，草木覆盖废墟
              W.set('chLamp', 0.2, b.instant);
              W.passDay(3, b.instant);
              W.set('chWild', 1, b.instant);
              W.set('bloom', 1, b.instant);
              W.set('grass', 1, b.instant);
            }],
            [25.5, b => { W.passDay(3, b.instant); }],
            [28.5, b => { W.passDay(3, b.instant); }],
          ]);
        },
      },

      // ── 代下 36:22–23：塞鲁士的诏书——光转向归家的路 ─────
      {
        kind: 'act', utter: '激动波斯王塞鲁士的心', cmd: 'exec 塞鲁士 --decree "可以上去"  # 七十年满', ref: '历代志下 36:22', hold: 3.2,
        verse: [
          { text: '波斯王塞鲁士元年……耶和华……就激动波斯王塞鲁士的心，<br>使他下诏通告全国，说：', ref: '历代志下 36:22', hold: 5.5 },
          { text: '「波斯王塞鲁士如此说：耶和华天上的神已将天下万国赐给我，<br>又嘱咐我在犹大的耶路撒冷为他建造殿宇。', ref: '历代志下 36:23', hold: 7 },
          { text: '你们中间凡作他子民的，可以上去，<br>愿耶和华他的神与他同在。」', ref: '历代志下 36:23', hold: 7 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.2, 5, b.instant);
              W.set('chEast', 1, b.instant);
              sfx(b, 'wind', { soft: true });
            }],
            [3, b => { sfx(b, 'harp'); }],
            [6.5, b => {
              // 归回的路：自东方越过海面，上岸，到锡安
              W.set('chRoad', 1, b.instant);
              S.lamp = 'home';
              W.set('chLamp', 1, b.instant);
              W.goTo(0.27, 12, b.instant);
            }],
            [13.5, b => {
              crowd('ch:ret', { n: 12, x0: X('ret')[0], x1: X('ret')[1], layer: 2, label: '归回的人', from: 'light', glow: 0.35, v: 0.2 });
              cwalk('ch:ret', X('isr')[1] + 0.02, altX() - 0.015, { speed: 0.022 });
              sfx(b, 'crowd', { soft: true });
            }],
            [20, b => {
              S.lamp = 'zion';
              W.set('chEast', 0.5, b.instant);
              if (!b.instant) sfx(b, 'harp');
            }],
            [22.5, () => { cpose('ch:ret', 'kneel'); }],
          ]);
        },
      },
    ],

    scene: {
      init() { sprites(); loadFonts(); },
      resize() { TG = null; CITY = null; RL = null; lampPos.init = false; },
      update,
      drawUnder(ctx, pass) {
        if (!cur()) return;
        if (pass === 'sky') { drawEast(ctx); drawBurnSky(ctx); return; }
        if (pass === 'far') { drawCamp(ctx); return; }
        if (pass === 'mid') { drawCity(ctx); drawPalace(ctx); drawCorners(ctx); drawBurn(ctx, 'mid'); drawGibeon(ctx); return; }
        if (pass === 'seaNear') { drawRoadSea(ctx); return; }
        if (pass === 'near') {
          drawBorder(ctx);
          drawRoadLand(ctx);
          drawFloor(ctx);
          drawSite(ctx);
          drawObed(ctx);
          drawTent(ctx);
          drawGloryBack(ctx);
          drawMaterials(ctx);
          drawTemple(ctx);
          drawCloud(ctx, false);
          drawSea(ctx);
          drawHeaps(ctx);
          drawDAltar(ctx);
          drawAltar(ctx);
          drawPlatform(ctx);
          drawChest(ctx);
          drawBurn(ctx, 'near');
        }
      },
      draw(ctx, pass) {
        if (!cur()) return;
        if (pass !== 'air') return;
        drawPlan(ctx);
        drawArk(ctx);
        drawGloryFront(ctx);
        drawCloud(ctx, true);
        drawInstruments(ctx);
        drawSong(ctx);
        drawScroll(ctx);
        drawEyes(ctx);
        drawAngel(ctx);
        drawFireFall(ctx);
        drawFXL(ctx);
        drawLamp(ctx);
        drawRiver(ctx);
        drawNames(ctx);
      },
      reset() { FXL.length = 0; },
      restore() { FXL.length = 0; TG = null; CITY = null; RL = null; stepLamp(0, true); },
      sig() {
        return { ark: S.ark, bearers: S.bearers.slice(), angel: S.angel, lamp: S.lamp, camp: S.camp, scroll: S.scroll, one: S.one };
      },
      pick(x, y, r) {
        if (!cur()) return null;
        let best = null;
        const put = (label, px, py, d) => { if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
        const t = temple(), hn = PH(2), hm = PH(1);
        if (lv('chBuild') > 0.3 && x > t.x0 - 0.1 * t.tu && x < t.x1 + 0.03 * t.tu && y > t.top - t.hP && y < t.base) {
          const ruin = lv('chRuin') > 0.5;
          if (!ruin && lv('chBuild') > 0.9 && x < t.x0 - 0.035 * t.tu) put(y > t.top - 0.25 * t.tu ? '雅斤' : '波阿斯', x, t.top - 0.5 * t.tu, r * 0.5);
          else put(ruin ? '殿的废墟' : '耶和华的殿', t.x0 + 0.5 * t.tu, t.top - t.hP - 10, r * 0.7);
        }
        const A = altarGeom();
        if (lv('chAltar') > 0.5) put('铜坛', A.x, A.g - A.h - 12, Math.hypot(x - A.x, y - (A.g - A.h * 0.5)));
        else if (lv('chDAltar') > 0.5) put('坛', A.x, A.g - hn * 0.4, Math.hypot(x - A.x, y - (A.g - hn * 0.2)));
        else if (lv('chFloor') > 0.5) put('阿珥楠的禾场', A.x, A.g - hn * 0.5, Math.hypot(x - A.x, (y - A.g) * 2));
        if (lv('chSea') > 0.5 && lv('chRuin') < 0.5) { const sx = seaX() * W.w, sg = gY(2, seaX()); put('铜海', sx, sg - 0.12 * t.tu, Math.hypot(x - sx, y - (sg - 0.07 * t.tu))); }
        if (lv('chTent') > 0.5) { const tx = X('tent') * W.w, tg = gY(2, X('tent')); put('大卫的帐幕', tx, tg - hn * 1.3, Math.hypot(x - tx, y - (tg - hn * 0.5))); }
        const ap = arkPos();
        if (ap) put('约柜', ap.x, ap.y - hn * 0.5, Math.hypot(x - ap.x, y - ap.y));
        if (lv('chCity') > 0.2) {
          const [a, b2] = cityEdge(lv('chCity'));
          if (x > a * W.w && x < b2 * W.w) { const gy = gY(1, x / W.w); if (y > gy - hm * 2.2 && y < gy + hm * 0.4) put(lv('chCity') > 0.8 ? '耶路撒冷' : lv('chCity') > 0.5 ? '大卫城' : '耶布斯', x, gy - hm * 2.3, r * 0.75); }
          if (lv('chPalace') > 0.5) { const p = palaceBox(); put('大卫的宫', p.x, p.g - p.h - 8, Math.hypot(x - p.x, y - (p.g - p.h * 0.5)) * 1.2); }
        }
        if (lv('chLamp') > 0.3 && S.lamp !== 'none') put('大卫的灯', lampPos.x, lampPos.y - 12, Math.hypot(x - lampPos.x, y - lampPos.y));
        if (lv('chMat') > 0.3 && lv('chBuild') < 0.3 && x > t.x0 && x < t.x1 && y > t.top - hn && y < t.base) put('建殿的材料', x, t.top - hn, r * 0.6);
        if (lv('chPlanA') > 0.5 && lv('chPlan') > 0.5 && x > t.x0 - 0.1 * t.tu && x < t.x1 && y > t.top - t.hP && y < t.top) put('殿的样式', t.x0 + 0.5 * t.tu, t.top - t.hP - 10, r * 0.8);
        if (lv('chGibeon') > 0.5) { const gx = X('gil') * W.w, gg = gY(1, X('gil')); put('基遍的会幕', gx, gg - hm * 1.5, Math.hypot(x - gx, y - gg)); }
        if (lv('chAngel') > 0.5) { const g = angelGeom(); put('耶和华的使者', g.x, g.y - g.h * 0.55, Math.hypot(x - g.x, y - g.y) * 0.6); }
        if (lv('chHeaps') > 0.5) { const hx = t.x0 + 0.56 * t.tu; put('堆垒', hx, gY(2, hx / W.w) - hn, Math.hypot(x - hx, y - gY(2, hx / W.w)) * 0.8); }
        if (lv('chRoad') > 0.5) { const E = roadEnds(); put('归回的路', E.cx, E.cy - 14, Math.hypot(x - E.cx, y - E.cy) * 1.2); }
        return best;
      },
    },
  });
})(window.GS);
