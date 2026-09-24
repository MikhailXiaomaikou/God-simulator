/* ─────────────────────────────────────────────────────────────
 * book/cross.js —— 四福音 · 十字架（马太福音 27 · 路加福音 23 · 约翰福音 18 — 19）
 *
 * 一日之间：从清早到正午，从正午的黑暗到申初，从申初到晚上，然后是安息日前的静夜。
 *   清早，耶稣站在巡抚彼拉多面前（衙门与铺华石处，近地的耶路撒冷，殿在城的右边）：
 *   「我的国不属这世界」「特为给真理作见证」「若不是从上头赐给你的」——一束从上头来的光。
 *   彼拉多洗手；巴拉巴被释放，走进人群里去了；耶稣背着自己的十字架出城门。
 *   古利奈人西门从乡下来，十字架搁在他身上；耶路撒冷的女子为他哭，耶稣转过身来。
 *   各各他在城外（中丘上的一座石冈，远远地看）：三个十字架立起来，只是三个暗的剪影。
 *   「父啊！赦免他们」——一片温和的光漫过地面。「今日你要同我在乐园里了」——右边那一个的心里亮了一点光。
 *   看的人都在城门外、园子前的草地上（各各他之下）：「母亲，看，你的儿子」——马利亚与约翰走到十字架底下，手牵着手。
 *   从午正到申初遍地都黑暗了（遍地的黑暗、乌云）；「以利！以利！」；「成了」——头低下，光沉成一点余烬，风止了，看的人都低头；
 *   「父啊！我将我的灵魂交在你手里」——那一点光升上去，没入上头开了的光里；十字架上暗了。
 *   殿里的幔子从上到下裂为两半（近地的殿，至圣所的金光透出来），地震动，磐石崩裂，百夫长跪下。
 *   晚上：身体从十字架上取下；亚利马太人约瑟与尼哥德慕从各各他脚下抬着一卷细麻布（只是白的一卷）走进园子里的新坟墓，
 *   大石头滚到墓门口；一粒麦子落在地里。妇女们对着坟墓坐着，回去安息；看守的兵封了石头；
 *   「你们拆毁这殿，我三日内要再建立起来」——但耶稣这话是以他的身体为殿。末了是寂静。
 *
 * 克制：没有钉子、没有血、没有伤、没有鞭打、没有荆棘冠冕的图像——戏弄与鞭打只由经文说出。
 * 父从不显为形像：只是上头来的光。耶稣无面目，与众人一样；只以衣袍与胸中的光（GS.cast.LOOK.jesus）相认。
 *
 * 方位：近地左 = 园子与新坟墓（城门外，各各他之下）；中丘 = 各各他（城外）；近地中右 = 城门、衙门与铺华石处、殿。东在左（日出之处）。
 * 彼拉多穿罗马人的深紫袍、金边（与耶稣的细麻衣分明）；在衙门前，耶稣是铺华石处唯一穿白的人。
 * 一切位置都以画面宽度的比例记下（手机竖屏另有一套）；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'cross';
  const isCur = () => GS.book.current(ACT);
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // ── 本幕的程度（缓动的量；恢复存档时直接到位）────────────────
  const LV = {
    crBeam: ['exp', 0.9],     // 从上头来的光，落在耶稣身上（18:36；19:11）
    crBasin: ['exp', 0.9],    // 彼拉多洗手的盆（太 27:24）
    crCarry: ['exp', 1.1],    // 背着的十字架（约 19:17）
    crBear: ['lin', 0.9],     // 0 = 在耶稣肩上，1 = 搁在西门身上（路 23:26）
    crRaise: ['lin', 0.19],   // 三个十字架立起来（0 → 1）
    crTitle: ['exp', 0.7],    // 名号的牌子（约 19:19）
    crForgive: ['exp', 0.45], // 「父啊！赦免他们」：一片温和的光漫过地面（一时）
    crThief: ['exp', 0.45],   // 右边那一个犯人心里的一点光（路 23:43）
    crTurn: ['exp', 0.8],     // 他转向中间
    crLife: ['lin', 0.2],     // 中间那一位胸中的光：1 → 余烬 → 0（看得见地慢慢暗下去，约两秒）
    crReed: ['lin', 0.75],    // 绑着海绒的牛膝草（约 19:29）
    crPulse: ['exp', 1.1],    // 「成了」：一口气那样的白光（一时）
    crBow: ['lin', 0.55],     // 便低下头
    crSpirit: ['lin', 0.17],  // 那一点光升上去（路 23:46）
    crAbove: ['exp', 0.6],    // 上头开了的光（父从不显为形像：只是光）
    crVeil: ['lin', 0.42],    // 幔子从上到下裂开（太 27:51）
    crHoly: ['exp', 0.5],     // 至圣所的金光
    crCrack: ['lin', 1.4],    // 磐石崩裂
    crBodies: ['lin', 0.3],   // 十字架上的身体（晚上取下）
    crBundle: ['exp', 1.2],   // 细麻布裹好的一卷
    crStone: ['lin', 0.38],   // 大石头滚到墓门口
    crSeal: ['lin', 0.5],     // 封了石头（太 27:66）
    crLamps: ['exp', 0.3],    // 安息日的灯
    crSow: ['exp', 0.5],      // 落在地里的麦子（约 12:24）：园子里几点细小的金光
    crHaze: ['exp', 0.4],     // 手机竖屏：遮住经文后面日头的一片云（上午渐阴；午正起由乌云接替）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);

  // ── 地上的位置：[桌面, 手机竖屏]（画面宽度的比例）────────────────
  const POS = {
    hill: [0.592, 0.6],      // 各各他（中丘）
    tomb: [0.556, 0.5],      // 园子里的新坟墓（近地）
    gate: [0.628, 0.636],    // 城门
    pr: [0.702, 0.748],      // 衙门
    seat: [0.684, 0.716],    // 审判的座位（铺华石处）
    tem: [0.87, 0.905],      // 殿
    basin: [0.708, 0.745],
    // 人（清早，衙门前）
    pil: [0.684, 0.716], jes: [0.727, 0.775], s1: [0.752, 0.812], s2: [0.662, 0.676], bar: [0.645, 0.655],
    pri0: [0.776, 0.84], pri1: [0.9, 0.975], peo0: [0.8, 0.85], peo1: [0.965, 0.99],
    // 往各各他去的路上（西门背着十字架跟在后面：十字架的脚拖在他身后，那里不站人）
    out: [0.612, 0.615], way: [0.596, 0.585], sim0: [0.515, 0.47], simT: [0.577, 0.555],
    wom0: [0.69, 0.72], wom1: [0.75, 0.8], solBack: [0.09, 0.125],
    // 看十字架的人：城门外、园子前的草地上（各各他之下；不在彼拉多的铺华石处）
    gal0: [0.452, 0.425], gal1: [0.494, 0.466], mag: [0.503, 0.48], mar: [0.522, 0.51], joh: [0.541, 0.54],
    cen: [0.614, 0.665], wat0: [0.78, 0.86], wat1: [0.93, 0.99],
    // 「站在耶稣十字架旁边的」：各各他脚下，正在十字架底下
    marNear: [0.568, 0.575], johNear: [0.588, 0.605],
    // 约瑟与尼哥德慕从各各他脚下抬着细麻布来
    josApp: [0.632, 0.64], nicApp: [0.656, 0.672],
    // 坟墓对面（墓门在右：她们在左前，面向墓门坐着）
    magSit: [0.522, 0.49], omSit: [0.5, 0.455],
  };
  // 近地纵深（v）：[桌面, 手机竖屏]——手机上新坟墓坐在坡上，看的人要站在它的脚前（更低），不像站在石头上
  const VPOS = { gal: [0.46, 0.7], mag: [0.36, 0.58], mar: [0.22, 0.46], joh: [0.28, 0.52], cen: [0.34, 0.5], om: [0.42, 0.66], jos: [0.14, 0.42], gu1: [0.26, 0.52], gu2: [0.16, 0.42] };
  const phone = () => W.w < 600;
  const px = k => POS[k][phone() ? 1 : 0];
  const pv = k => VPOS[k][phone() ? 1 : 0];

  const ROBE = {
    pilate: [84, 72, 118], pilAcc: [220, 184, 100], priest: [214, 204, 176], priAcc: [120, 92, 150],
    soldier: [150, 62, 50], solAcc: [196, 170, 110], barabbas: [98, 92, 86], simon: [146, 116, 84],
    centurion: [118, 96, 72], cenAcc: [176, 52, 44], joseph: [92, 84, 128], josAcc: [210, 190, 150],
    nico: [128, 104, 80], nicAcc: [200, 186, 150], omary: [120, 104, 132], guard: [130, 66, 54],
  };
  const WOOD = [84, 64, 48], FIG = [36, 30, 30], ROCK = [176, 158, 124], ROCK_S = [128, 112, 90], HILLG = [104, 124, 82];
  const STONE = [224, 214, 190], STONE_S = [168, 156, 132], MARBLE = [236, 230, 212], GOLD = [236, 196, 104], ROOF = [150, 96, 72];
  const LINEN = [240, 234, 220];
  const VEIL = [[58, 70, 150], [116, 58, 130], [178, 46, 54]];

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { place: 'praetorium', carrier: null, raised: false, thief: false, mother: false, bowed: false, spirit: false, veil: false, bundle: null, stone: false, sealed: false };
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const BOOST = () => (phone() ? 1.55 : 1);
  const PH = l => 34 * W.layerScale(l) * BOOST() * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
  const HK = () => (phone() ? 1.42 : 1);    // 各各他与十字架在手机上稍大
  const BK = () => (phone() ? 0.8 : 1);     // 手机上房屋窄一些
  const LS = l => W.layerScale(l) * (phone() ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const gloomK = () => clamp(W.lv.gloom, 0, 1);
  // 近地纵深里的一点（与人物模块的站位相同）：v 0 = 地的轮廓线，1 = 画面底
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const vK = v => 1 + 0.35 * v;

  // 确定性的随机表（只用于形状，不用于状态）
  const RT = [];
  (function () { const r = U.mulberry32(1930); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function look(id, key, o) { const L = (C().LOOK && C().LOOK[key]) || {}; return add(id, Object.assign({}, L, o)); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function follow(id, other, dx) { const c = C(); if (c.follow && fig(id)) c.follow(id, other, dx); }
  function attachFig(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); }
  function hold(a, b, on) { const c = C(); if (c.holdHands && fig(a) && fig(b)) c.holdHands(a, b, on); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  // 祭司长和长老：几个人（都是男子），一同走、一同喊
  const PRI_ROBES = [[196, 176, 120], [146, 124, 150], [178, 152, 112], [132, 120, 104], [150, 130, 96]];   // 没有近白的：白衣只是耶稣
  const PRI_V = [0.27, 0.35, 0.29, 0.37, 0.31];
  const priIds = () => (phone() ? ['pr1', 'pr2', 'pr3'] : ['pr1', 'pr2', 'pr3', 'pr4', 'pr5']);
  function priAdd(b, x0, x1) {
    const ids = priIds();
    ids.forEach((id, i) => add(id, { label: '祭司长和长老', sex: 'm', age: i === 1 ? 'elder' : 'adult', x: lerp(x0, x1, (i + 0.5) / ids.length), v: PRI_V[i], facing: -1,
      robe: PRI_ROBES[i], accent: i % 2 ? [120, 92, 150] : [214, 200, 160], hair: 'cloth', beard: true, glow: 0.05, from: b.instant ? 'none' : 'fade' }));
  }
  function priWalk(x0, x1, o) { const ids = priIds(); ids.forEach((id, i) => walk(id, lerp(x0, x1, (i + 0.5) / ids.length), o)); }
  function priPose(p) { for (const id of priIds()) pose(id, p); }
  function priFace(d) { for (const id of priIds()) face(id, d); }
  function priRm() { for (const id of priIds()) rm(id); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  const from = b => (b.instant ? 'none' : 'fade');
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    const l = f.layer == null ? 2 : f.layer;
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    return [x, y - PH(l) * vK(f.v || 0) * frac];
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function dustAt(b, x, y, n, rgb, spread) { if (!b.instant && fx()) fx().dust(x, y, n || 20, rgb || [200, 180, 150], spread || 14, 'near'); }
  function figH(id) { const f = fig(id); return f && f._vis && f._h ? f._h : 0; }
  function ringFig(b, id, rgb, k) { const p = figPt(id, 0.55); if (p) ringAt(b, p[0], p[1], rgb, PH(2) * (k || 2.2), 2); }
  // 一行字在某处聚成
  function wordsAt(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length;
    const size = Math.max(0.03 * M(), Math.min((o.size || 0.03) * M(), (W.w * 0.62) / Math.max(1, n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(x, half + 8, W.w - half - 8), cy = clamp(y, size + 8, W.h - size);
    const src = o.src || (() => [x + (Math.random() - 0.5) * 60 * SU(), y + 30 * SU() * Math.random()]);
    fx().nameStr(str, cx, cy, size, rgb, src, { hold: o.hold || 3.2, delay: o.delay, dark: o.dark });
  }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘的柔光）
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
    SP = {
      warm: radial([255, 196, 120], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      pale: radial([226, 236, 255], 1), ember: radial([255, 170, 90], 1, 0.4), soft: radial([255, 238, 206], 1, 0.5),
    };
    // 自天而降的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 同一束光的金色（白天画在白石上也看得见：不是加亮，而是染上一层暖金）
    const bg = cnv(64, 256), gg = bg.getContext('2d');
    const hz2 = gg.createLinearGradient(0, 0, 64, 0);
    hz2.addColorStop(0, 'rgba(255,206,120,0)'); hz2.addColorStop(0.5, 'rgba(255,212,128,1)'); hz2.addColorStop(1, 'rgba(255,206,120,0)');
    gg.fillStyle = hz2; gg.fillRect(0, 0, 64, 256);
    gg.globalCompositeOperation = 'destination-in';
    gg.fillStyle = vt; gg.fillRect(0, 0, 64, 256);
    SP.beamGold = bg;
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (!(a > 0.004) || !(r > 0.5)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }
  // 从上头来的一束光（x 处，自 y0 到 y1）
  function beam(ctx, x, y0, y1, w, a, gold) {
    if (a < 0.005) return;
    SP || sprites();
    const op = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = gold ? 'source-over' : 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(gold ? SP.beamGold : SP.beam, x - w / 2, y0, w, Math.max(1, y1 - y0));
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = op;
  }
  // 小火（城门的火把、安息日的灯）
  const FL = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.2, k * (0.25 + 0.45 * nightK()));
    for (let i = 0; i < 4; i++) {
      const q = FL[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
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

  // ════════════════════════════════════════════════════════════
  //  各各他（中丘上的一座石冈）与三个十字架
  // ════════════════════════════════════════════════════════════
  function hillGeo() {
    const m = PH(1) * HK(), cx = px('hill') * W.w;
    return { m, cx, half: (phone() ? 2.6 : 3.4) * m, peak: 1.55 * m, sp: 1.36 * m };
  }
  function hillProf(u) {
    const a = Math.abs(u);
    if (a >= 1) return 0;
    return (1 - smoothstep(0.26, 1, a)) * (1 + 0.06 * Math.sin(u * 7.3 + 0.8) * a);
  }
  function hillY(x, G) {
    G = G || hillGeo();
    const base = gY(1, x / W.w), u = (x - G.cx) / G.half;
    if (Math.abs(u) >= 1) return base;
    return base - G.peak * hillProf(u);
  }
  function drawHill(ctx) {
    const G = hillGeo(), n = 44, ml = moonLight();
    const x0 = G.cx - G.half, x1 = G.cx + G.half;
    const pts = [];
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); pts.push([x, hillY(x, G)]); }
    // 石冈
    // 沿着中丘的地面收口（不在地面以下多画一条石带）
    const groundBack = () => { for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); ctx.lineTo(x, gY(1, x / W.w) + 1.5); } };
    ctx.fillStyle = css(ROCK, 1, 1, ml);
    ctx.beginPath();
    ctx.moveTo(x0, gY(1, x0 / W.w) + 1.5);
    for (const p of pts) ctx.lineTo(p[0], p[1]);
    groundBack();
    ctx.closePath(); ctx.fill();
    // 背光的一面与石层
    const lr = litX() > G.cx;
    ctx.fillStyle = css(ROCK_S, 1, 0.55, ml * 0.5);
    ctx.beginPath();
    const side = lr ? -1 : 1;
    ctx.moveTo(G.cx + side * G.half * 0.05, hillY(G.cx, G) + G.m * 0.2);
    for (let i = 0; i <= 12; i++) { const x = G.cx + side * G.half * (0.05 + 0.95 * i / 12); ctx.lineTo(x, hillY(x, G) + G.m * (0.12 + 0.1 * rt(i + 7))); }
    for (let i = 12; i >= 0; i--) { const x = G.cx + side * G.half * (0.05 + 0.95 * i / 12); ctx.lineTo(x, gY(1, x / W.w) + 1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(ROCK_S, 1, 0.3, ml * 0.4);
    ctx.lineWidth = Math.max(0.6, 0.05 * G.m);
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const yk = 0.3 + 0.2 * k, xa = G.cx - G.half * (0.25 + 0.5 * yk), xb = G.cx + G.half * (0.2 + 0.5 * yk);
      ctx.moveTo(xa, lerp(hillY(xa, G), gY(1, xa / W.w), yk * 0.8));
      ctx.quadraticCurveTo((xa + xb) / 2, lerp(hillY(G.cx, G), gY(1, G.cx / W.w), yk) + G.m * 0.08 * (rt(k + 30) - 0.5), xb, lerp(hillY(xb, G), gY(1, xb / W.w), yk * 0.8));
    }
    ctx.stroke();
    // 几块暗的石
    ctx.fillStyle = css([112, 100, 86], 1, 0.5, ml * 0.3);
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const u = (rt(k + 50) - 0.5) * 1.5, x = G.cx + u * G.half, y = lerp(hillY(x, G), gY(1, x / W.w), 0.35 + 0.4 * rt(k + 60));
      const r = G.m * (0.1 + 0.1 * rt(k + 70));
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.55, 0, 0, TAU);
    }
    ctx.fill();
    // 山脚的草
    ctx.fillStyle = css(HILLG, 1, 0.85, ml * 0.4);
    ctx.beginPath();
    ctx.moveTo(x0, gY(1, x0 / W.w) + 2);
    for (let i = 0; i <= n; i++) {
      const x = lerp(x0, x1, i / n), u = Math.abs((x - G.cx) / G.half);
      const top = hillY(x, G), base = gY(1, x / W.w);
      ctx.lineTo(x, lerp(base, top, clamp(0.55 - 0.5 * (1 - u) + 0.08 * Math.sin(i * 1.7), 0, 1)));
    }
    groundBack();
    ctx.closePath(); ctx.fill();
    // 迎光的边
    ctx.strokeStyle = css([255, 238, 206], 1, 0.35 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.6, 0.06 * G.m);
    ctx.beginPath();
    const i0 = lr ? Math.floor(n * 0.45) : 0, i1 = lr ? n : Math.ceil(n * 0.55);
    for (let i = i0; i <= i1; i++) { if (i === i0) ctx.moveTo(pts[i][0], pts[i][1]); else ctx.lineTo(pts[i][0], pts[i][1]); }
    ctx.stroke();
    // 磐石崩裂
    const ck = W.lv.crCrack;
    if (ck > 0.01) {
      ctx.strokeStyle = css([40, 32, 28], 1, 0.9);
      ctx.lineWidth = Math.max(0.8, 0.07 * G.m);
      ctx.beginPath();
      const xs = G.cx + G.half * 0.42, ys = hillY(xs, G) + 1;
      ctx.moveTo(xs, ys);
      const N = 6;
      for (let i = 1; i <= Math.ceil(N * ck); i++) {
        const t = Math.min(i / N, ck);
        ctx.lineTo(xs - G.half * 0.12 * t + (rt(i + 90) - 0.5) * G.m * 0.25, lerp(ys, gY(1, xs / W.w), t * 0.9));
      }
      ctx.stroke();
    }
  }

  // 三个十字架：[相对中间的位置, 高（以 m 计）, 立起的区间]
  const CROSS = [[-1, 2.2, 0.34, 0.8], [0, 2.5, 0, 0.5], [1, 2.2, 0.5, 1]];
  function crossFrame(k, G) {
    G = G || hillGeo();
    const c = CROSS[k], m = G.m;
    const bx = G.cx + c[0] * G.sp, by = hillY(bx, G) + 0.12 * m;
    const e = ease(clamp((W.lv.crRaise - c[2]) / (c[3] - c[2]), 0, 1));
    return { k, bx, by, a: -(1 - e) * 1.42, e, H: c[1] * m, m };
  }
  // 十字架上的局部坐标（x 向右，y 向上，像素）→ 画面
  function toScr(F, lx, ly) {
    const c = Math.cos(F.a), s = Math.sin(F.a);
    return [F.bx + lx * c + ly * s, F.by + lx * s - ly * c];
  }
  // 身体各处（局部坐标）：头、胸（光）、脚
  function figLocal(F) {
    const m = F.m, barY = F.H * 0.8;
    const bow = F.k === 1 ? clamp(W.lv.crBow, 0, 1) : 0;
    const turn = F.k === 2 ? clamp(W.lv.crTurn, 0, 1) : 0;
    // 「便低下头」：头垂到胸前（小小的剪影上也看得出来）
    const hd = bow * 0.15 * m - turn * 0.04 * m;
    return { barY, head: [hd, barY + 0.14 * m - bow * 0.24 * m], chest: [0, barY - 0.2 * m], hip: [0, barY - 0.5 * m], foot: [0, barY - 0.92 * m] };
  }
  function drawCrosses(ctx) {
    if (W.lv.crRaise < 0.002) return;
    const G = hillGeo(), ml = moonLight(), bodies = clamp(W.lv.crBodies, 0, 1);
    for (let k = 0; k < 3; k++) {
      const F = crossFrame(k, G);
      const a = clamp(F.e * 5 + (W.lv.crRaise > CROSS[k][2] ? 0.35 : 0), 0, 1);
      if (a < 0.01) continue;
      const m = F.m, H = F.H, bw = Math.max(1.1, 0.1 * m), barY = H * 0.8, barW = 0.42 * m;
      ctx.save();
      ctx.translate(F.bx, F.by);
      ctx.rotate(F.a);
      ctx.fillStyle = css(WOOD, 1, a, ml * 0.6);
      ctx.fillRect(-bw / 2, -H, bw, H + 0.1 * m);
      ctx.fillRect(-barW, -barY - bw * 0.45, barW * 2, bw * 0.9);
      // 迎光的一道边
      ctx.fillStyle = css([236, 206, 160], 1, 0.35 * a * dayA(), 0.2);
      const lr = litX() > F.bx ? 1 : -1;
      ctx.fillRect(lr > 0 ? bw * 0.18 : -bw / 2, -H, bw * 0.32, H);
      // 名号的牌子
      if (k === 1 && W.lv.crTitle > 0.01) {
        ctx.fillStyle = css([238, 230, 206], 1, a * W.lv.crTitle, 0.25 + ml);
        ctx.fillRect(-0.2 * m, -H + 0.02 * m, 0.4 * m, 0.13 * m);
      }
      // 身体：小小的暗的剪影（无面目、无伤）
      if (bodies > 0.01) {
        const L = figLocal(F);
        ctx.fillStyle = css(FIG, 1, a * bodies, ml * 0.4);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineCap = 'round';
        // 两臂顺着横木
        ctx.lineWidth = Math.max(1, 0.075 * m);
        ctx.beginPath();
        ctx.moveTo(-0.36 * m, -(barY + 0.02 * m)); ctx.lineTo(-0.08 * m, -(barY - 0.04 * m));
        ctx.moveTo(0.36 * m, -(barY + 0.02 * m)); ctx.lineTo(0.08 * m, -(barY - 0.04 * m));
        ctx.stroke();
        // 身体
        ctx.beginPath();
        ctx.moveTo(-0.085 * m, -(barY - 0.02 * m));
        ctx.lineTo(0.085 * m, -(barY - 0.02 * m));
        ctx.lineTo(0.06 * m, -(barY - 0.52 * m));
        ctx.lineTo(0.035 * m, -(barY - 0.9 * m));
        ctx.lineTo(-0.035 * m, -(barY - 0.9 * m));
        ctx.lineTo(-0.06 * m, -(barY - 0.52 * m));
        ctx.closePath(); ctx.fill();
        // 颈（低头时头垂到胸前，颈连着）
        if (k === 1 && W.lv.crBow > 0.02) {
          ctx.lineWidth = Math.max(1, 0.07 * m);
          ctx.beginPath(); ctx.moveTo(0, -(barY - 0.02 * m)); ctx.lineTo(L.head[0] * 0.8, -L.head[1]); ctx.stroke();
        }
        // 头
        ctx.beginPath();
        ctx.arc(L.head[0], -L.head[1], Math.max(1, 0.075 * m), 0, TAU);
        ctx.fill();
        ctx.lineCap = 'butt';
      }
      ctx.restore();
    }
    // 绑着海绒的牛膝草（约 19:29）：从一个兵丁的手里举到中间那一位
    const rd = W.lv.crReed;
    if (rd > 0.01) {
      const p = figPt('m2', 0.85), F = crossFrame(1, G), L = figLocal(F);
      if (p) {
        const tip = toScr(F, L.head[0] + 0.06 * F.m, L.head[1] - 0.12 * F.m);
        const tx = lerp(p[0], tip[0], ease(rd)), ty = lerp(p[1] - 0.3 * F.m, tip[1], ease(rd));
        ctx.strokeStyle = css([96, 84, 62], 1, 0.9);
        ctx.lineWidth = Math.max(0.8, 0.045 * F.m);
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(tx, ty); ctx.stroke();
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷（中丘上远处的城、近地的城门、衙门、殿）
  // ════════════════════════════════════════════════════════════
  const moonLight = () => 0.18 * nightK() * (1 - 0.6 * gloomK());
  const CITY = (() => {
    const r = U.mulberry32(2719);
    const TONES = [[216, 198, 164], [206, 186, 152], [224, 208, 176], [198, 182, 152], [212, 192, 162]];
    const houses = [];
    for (let i = 0; i < 26; i++) houses.push({ u: (i + 0.5) / 26 + (r() - 0.5) * 0.02, w: 0.55 + 0.35 * r(), h: 1.05 + 0.75 * r(), dome: r() < 0.16, win: r() < 0.85, win2: r() < 0.45, k: r(), tone: TONES[i % 5] });
    const far = [];
    for (let i = 0; i < 16; i++) far.push({ u: (i + 0.5) / 16 + (r() - 0.5) * 0.03, w: 0.8 + 0.6 * r(), h: 0.4 + 0.5 * r(), tower: i === 4 || i === 12, dome: r() < 0.25, tone: TONES[(i + 2) % 5], k: r() });
    const olives = [];
    for (let i = 0; i < 40; i++) olives.push([r(), r(), r()]);
    const flowers = [];
    for (let i = 0; i < 16; i++) flowers.push({ u: r(), v: r(), c: r() < 0.6 ? [236, 232, 220] : r() < 0.6 ? [200, 72, 72] : [226, 190, 90], s: 0.6 + 0.5 * r() });
    return { houses, far, olives, flowers };
  })();
  // 窗里的灯：夜里、安息日
  function winK(seed) {
    const nk = nightK() * (1 - gloomK() * 0.8);
    let k = nk * (0.45 + 0.35 * Math.sin(W.t * 0.8 + seed * 6));
    k = Math.max(k, W.lv.crLamps * (0.6 + 0.35 * nk) * (0.8 + 0.2 * Math.sin(W.t * 1.3 + seed * 9)) * (seed < 0.82 ? 1 : 0.3));
    return k;
  }
  // 中丘上远处的城（城在殿的后面，往西北）
  function drawFarCity(ctx) {
    const m = PH(1), ml = moonLight();
    const x0 = (phone() ? 0.72 : 0.7), x1 = 0.995;
    const boxes = [];
    ctx.beginPath();
    ctx.fillStyle = css([212, 190, 150], 1, 1, ml);
    for (const h of CITY.far) {
      const xf = lerp(x0, x1, h.u), x = xf * W.w, w = (h.tower ? 0.55 : h.w) * m * BK(), g = gY(1, xf) + 2;
      const H = (h.tower ? 1.45 : h.h) * m;
      ctx.rect(x - w / 2, g - H, w, H);
      if (h.dome) { ctx.moveTo(x + w * 0.3, g - H); ctx.ellipse(x, g - H, w * 0.3, w * 0.26, 0, Math.PI, TAU); }
      boxes.push([x, g, H, w, h]);
    }
    ctx.fill();
    ctx.fillStyle = css([150, 134, 110], 1, 0.7, ml * 0.5);
    ctx.beginPath();
    for (const q of boxes) { const lr = litX() >= q[0]; ctx.rect(lr ? q[0] - q[3] / 2 : q[0] + q[3] * 0.2, q[1] - q[2], q[3] * 0.3, q[2]); }
    ctx.fill();
    // 窗灯
    const ws = Math.max(1, 0.06 * m);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,190,110)';
    for (const q of boxes) {
      const k = winK(q[4].k) * 0.8;
      if (k < 0.03) continue;
      ctx.globalAlpha = Math.min(1, k);
      ctx.fillRect(q[0] - ws / 2, q[1] - q[2] * 0.7, ws, ws * 1.4);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawHouses(ctx, ph) {
    const ml = moonLight(), x0 = px('gate') + 0.02, x1 = 0.997;
    const boxes = [];
    for (let tone = 0; tone < 5; tone++) {
      ctx.fillStyle = css(CITY.houses[tone].tone, 2, 1, ml);
      ctx.beginPath();
      for (let i = tone; i < CITY.houses.length; i += 5) {
        const h = CITY.houses[i];
        const xf = lerp(x0, x1, h.u), x = xf * W.w, w = h.w * ph * BK(), g = gY(2, xf) + 1, H = h.h * ph;
        ctx.rect(x - w / 2, g - H, w, H);
        if (h.dome) { ctx.moveTo(x + w * 0.34, g - H); ctx.ellipse(x, g - H, w * 0.34, w * 0.3, 0, Math.PI, TAU); }
        boxes.push([x, g, H, w, h]);
      }
      ctx.fill();
    }
    ctx.fillStyle = css([152, 134, 108], 2, 0.85, ml * 0.6);
    ctx.beginPath();
    for (const q of boxes) { const lr = litX() >= q[0]; ctx.rect(lr ? q[0] - q[3] / 2 : q[0] + q[3] * 0.2, q[1] - q[2], q[3] * 0.3, q[2]); }
    ctx.fill();
    ctx.strokeStyle = css([255, 236, 200], 2, 0.3 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.6, 0.8 * LS(2));
    ctx.beginPath();
    for (const q of boxes) { ctx.moveTo(q[0] - q[3] / 2, q[1] - q[2]); ctx.lineTo(q[0] + q[3] / 2, q[1] - q[2]); }
    ctx.stroke();
    return boxes;
  }
  function drawHouseLights(ctx, boxes, ph) {
    const ws = Math.max(1.2, 0.07 * ph);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,186,108)';
    for (const q of boxes) {
      const h = q[4];
      if (!h.win) continue;
      const k = winK(h.k);
      if (k < 0.02) continue;
      ctx.globalAlpha = Math.min(1, k);
      ctx.fillRect(q[0] - ws / 2, q[1] - q[2] * 0.8, ws, ws * 1.4);
      if (h.win2) ctx.fillRect(q[0] - ws / 2 + q[3] * 0.25, q[1] - q[2] * 0.62, ws, ws * 1.4);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 城墙（在房屋之后，自城门向右）与城门楼
  function drawWall(ctx, ph) {
    const ml = moonLight(), s = LS(2), x0 = px('gate') * W.w, x1 = W.w * 1.01, H = 1.25 * ph;
    ctx.fillStyle = css([204, 186, 150], 2, 1, ml);
    ctx.beginPath();
    const n = 14;
    ctx.moveTo(x0, gY(2, x0 / W.w) + 2);
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); ctx.lineTo(x, gY(2, Math.min(1, x / W.w)) - H); }
    ctx.lineTo(x1, gY(2, 1) + 2);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    const mw = 3.2 * s;
    for (let x = x0 + mw; x < x1; x += mw * 2.2) ctx.rect(x, gY(2, Math.min(1, x / W.w)) - H - 3 * s, mw, 3 * s);
    ctx.fill();
  }
  function drawGate(ctx, ph) {
    const ml = moonLight(), s = LS(2), cx = px('gate') * W.w, w = 1.1 * ph * BK(), H = 2.1 * ph;
    const g = Math.max(gY(2, (cx - w / 2) / W.w), gY(2, (cx + w / 2) / W.w)) + 2;
    ctx.fillStyle = css([210, 192, 156], 2, 1, ml);
    ctx.fillRect(cx - w / 2, g - H, w, H);
    ctx.beginPath();
    const n = 4, mw = w / (n * 2 - 1);
    for (let k = 0; k < n; k++) ctx.rect(cx - w / 2 + mw * 2 * k, g - H - 3.4 * s, mw, 3.4 * s);
    ctx.fill();
    ctx.fillStyle = css([156, 140, 112], 2, 0.8, ml * 0.5);
    const lr = litX() >= cx;
    ctx.fillRect(lr ? cx - w / 2 : cx + w * 0.3, g - H, w * 0.2, H);
    // 门洞
    const gw = 0.24 * ph, gh = 0.98 * ph;
    ctx.fillStyle = css([30, 24, 20], 2);
    ctx.beginPath(); ctx.moveTo(cx - gw, g); ctx.lineTo(cx - gw, g - gh * 0.72); ctx.quadraticCurveTo(cx, g - gh * 1.12, cx + gw, g - gh * 0.72); ctx.lineTo(cx + gw, g); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([255, 234, 196], 2, 0.4 * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(cx - w / 2, g - H); ctx.lineTo(cx + w / 2, g - H); ctx.stroke();
    // 夜里城门旁的火把
    const nk = nightK() * (1 - gloomK());
    if (nk > 0.1) { flame(ctx, cx - gw * 1.9, g - gh * 0.95, 4.2 * s, nk * 0.85, 11); flame(ctx, cx + gw * 1.9, g - gh * 0.95, 4.2 * s, nk * 0.85, 17); }
  }
  // 衙门（罗马的柱廊）与铺华石处、审判的座位
  function prGeo(ph) {
    const cx = px('pr') * W.w, w = 2.45 * ph * BK();
    const g = Math.min(gY(2, (cx - w / 2) / W.w), gY(2, (cx + w / 2) / W.w)) + 1;
    return { cx, w, g, pod: 0.26 * ph, colH: 1.3 * ph, ent: 0.2 * ph, ped: 0.42 * ph };
  }
  function drawPraetorium(ctx, ph) {
    const P = prGeo(ph), ml = moonLight(), s = LS(2), x0 = P.cx - P.w / 2, x1 = P.cx + P.w / 2;
    const top = P.g - P.pod - P.colH - P.ent;
    // 后墙
    ctx.fillStyle = css([184, 170, 146], 2, 1, ml * 0.7);
    ctx.fillRect(x0 + P.w * 0.04, top, P.w * 0.92, P.g - top);
    // 门
    const dw = 0.3 * ph, dh = 0.95 * ph, dy = P.g - P.pod;
    ctx.fillStyle = css([40, 32, 26], 2);
    ctx.fillRect(P.cx - dw / 2, dy - dh, dw, dh);
    // 门里的灯（夜里）
    const wk = winK(0.5);
    if (wk > 0.02) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = U.rgba(255, 180, 100, Math.min(0.8, wk * 0.8)); ctx.fillRect(P.cx - dw * 0.35, dy - dh * 0.8, dw * 0.7, dh * 0.8); ctx.globalCompositeOperation = 'source-over'; }
    // 台基
    ctx.fillStyle = css(MARBLE, 2, 1, ml);
    ctx.fillRect(x0 - 0.06 * ph, P.g - P.pod, P.w + 0.12 * ph, P.pod);
    ctx.fillStyle = css(STONE_S, 2, 0.8, ml * 0.5);
    for (let k = 1; k < 3; k++) ctx.fillRect(x0 - 0.06 * ph, P.g - P.pod * k / 3, P.w + 0.12 * ph, Math.max(0.6, 0.6 * s));
    // 柱
    const nC = 6, cw = Math.max(1.2, 0.1 * ph);
    ctx.fillStyle = css(MARBLE, 2, 1, ml);
    for (let i = 0; i < nC; i++) {
      const x = lerp(x0 + P.w * 0.07, x1 - P.w * 0.07, i / (nC - 1));
      if (Math.abs(x - P.cx) < dw * 0.7) continue;
      ctx.fillRect(x - cw / 2, P.g - P.pod - P.colH, cw, P.colH);
    }
    // 檐与山花
    const ey = P.g - P.pod - P.colH;
    ctx.fillRect(x0 - 0.04 * ph, ey - P.ent, P.w + 0.08 * ph, P.ent);
    ctx.fillStyle = css(ROOF, 2, 1, ml * 0.6);
    ctx.beginPath(); ctx.moveTo(x0 - 0.1 * ph, ey - P.ent); ctx.lineTo(P.cx, ey - P.ent - P.ped); ctx.lineTo(x1 + 0.1 * ph, ey - P.ent); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(MARBLE, 2, 1, ml);
    ctx.beginPath(); ctx.moveTo(x0 + 0.1 * ph, ey - P.ent - 0.04 * ph); ctx.lineTo(P.cx, ey - P.ent - P.ped * 0.8); ctx.lineTo(x1 - 0.1 * ph, ey - P.ent - 0.04 * ph); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([255, 238, 206], 2, 0.4 * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x0 - 0.1 * ph, ey - P.ent); ctx.lineTo(P.cx, ey - P.ent - P.ped); ctx.lineTo(x1 + 0.1 * ph, ey - P.ent); ctx.stroke();
    // 罗马的旗（一面暗红的小旗）
    ctx.fillStyle = css([150, 50, 44], 2, 0.9, 0.05);
    const fx0 = x1 - 0.06 * ph, fy0 = ey - P.ent - 0.02 * ph;
    ctx.fillRect(fx0, fy0 - 0.75 * ph, Math.max(0.8, 0.03 * ph), 0.75 * ph);
    ctx.beginPath(); ctx.moveTo(fx0, fy0 - 0.72 * ph); ctx.lineTo(fx0 + 0.26 * ph, fy0 - 0.64 * ph + Math.sin(W.t * 2) * 0.02 * ph); ctx.lineTo(fx0, fy0 - 0.54 * ph); ctx.closePath(); ctx.fill();
    return P;
  }
  // 铺华石处（约 19:13）：衙门前一片铺着石头的地，审判的座位
  function drawPavement(ctx, ph) {
    const P = prGeo(ph), ml = moonLight();
    const xa = P.cx - P.w * 0.62, xb = P.cx + P.w * 0.62;
    const ya = P.g - 1, yb = fieldY(P.cx / W.w, 0.34);
    ctx.fillStyle = css([206, 192, 164], 2, 0.9, ml);
    ctx.beginPath(); ctx.moveTo(xa + 0.2 * ph, ya); ctx.lineTo(xb - 0.2 * ph, ya); ctx.lineTo(xb + 0.15 * ph, yb); ctx.lineTo(xa - 0.15 * ph, yb); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([160, 146, 120], 2, 0.5, ml * 0.4);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let k = 1; k < 4; k++) { const y = lerp(ya, yb, k / 4); ctx.moveTo(lerp(xa + 0.2 * ph, xa - 0.15 * ph, k / 4), y); ctx.lineTo(lerp(xb - 0.2 * ph, xb + 0.15 * ph, k / 4), y); }
    for (let k = 1; k < 8; k++) { const u = k / 8; ctx.moveTo(lerp(xa + 0.2 * ph, xb - 0.2 * ph, u), ya); ctx.lineTo(lerp(xa - 0.15 * ph, xb + 0.15 * ph, u), yb); }
    ctx.stroke();
    // 审判的座位
    const sx = px('seat') * W.w, sy = fieldY(px('seat'), 0.1), k = vK(0.1), sh = 0.27 * ph * k, sw = 0.24 * ph * k;
    ctx.fillStyle = css(MARBLE, 2, 1, ml);
    ctx.fillRect(sx - sw, sy - sh, sw * 2, sh);
    ctx.fillRect(sx - sw * 1.05 - 0.02 * ph, sy - sh - 0.42 * ph * k, 0.07 * ph * k, 0.44 * ph * k);
    ctx.fillStyle = css(STONE_S, 2, 0.8, ml * 0.5);
    ctx.fillRect(sx - sw, sy - sh * 0.3, sw * 2, sh * 0.3);
  }
  // 殿（白石与金；殿廊的门里挂着幔子）
  function temGeo(ph) {
    const cx = px('tem') * W.w, bk = BK();
    const pw = 4.0 * ph * bk;
    const gL = gY(2, (cx - pw / 2) / W.w), gR = gY(2, Math.min(1, (cx + pw / 2) / W.w));
    const top = Math.min(gL, gR), plat = 0.5 * ph, base = top - plat;
    return { cx, pw, gL, gR, base, bw: 2.6 * ph * bk, bh: 2.25 * ph, pow: 1.55 * ph * bk, poh: 3.05 * ph, dw: 0.62 * ph * bk, dh: 1.75 * ph };
  }
  function drawTemple(ctx, ph) {
    const G = temGeo(ph), ml = moonLight(), s = LS(2), nk = nightK();
    // 殿的台基（摩利亚山）
    ctx.fillStyle = css([196, 180, 148], 2, 1, ml);
    ctx.beginPath();
    ctx.moveTo(G.cx - G.pw / 2 - 0.2 * ph, G.gL + 3); ctx.lineTo(G.cx - G.pw / 2, G.base); ctx.lineTo(G.cx + G.pw / 2, G.base); ctx.lineTo(G.cx + G.pw / 2 + 0.2 * ph, G.gR + 3); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css([240, 226, 196], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(G.cx - G.pw / 2, G.base); ctx.lineTo(G.cx + G.pw / 2, G.base); ctx.stroke();
    // 殿身与殿廊
    const bx0 = G.cx - G.bw / 2, bx1 = G.cx + G.bw / 2, px0 = G.cx - G.pow / 2, px1 = G.cx + G.pow / 2;
    ctx.fillStyle = css(MARBLE, 2, 1, ml * 1.2);
    ctx.fillRect(bx0, G.base - G.bh, G.bw, G.bh);
    ctx.fillRect(px0, G.base - G.poh, G.pow, G.poh);
    ctx.fillStyle = css([176, 164, 136], 2, 0.8, ml * 0.6);
    const lr = litX() >= G.cx;
    ctx.fillRect(lr ? bx0 : bx1 - G.bw * 0.12, G.base - G.bh, G.bw * 0.12, G.bh);
    ctx.fillRect(lr ? px0 : px1 - G.pow * 0.14, G.base - G.poh, G.pow * 0.14, G.poh);
    // 金的檐与横带
    ctx.fillStyle = css(GOLD, 2, 1, 0.2 + 0.15 * nk);
    ctx.fillRect(bx0 - 1.5 * s, G.base - G.bh - 2.4 * s, G.bw + 3 * s, 2.4 * s);
    ctx.fillRect(px0 - 1.5 * s, G.base - G.poh - 2.8 * s, G.pow + 3 * s, 2.8 * s);
    ctx.fillStyle = css(GOLD, 2, 0.8, 0.1);
    ctx.fillRect(px0, G.base - G.poh * 0.66, G.pow, 1.4 * s);
    // 屋顶上的金尖
    ctx.fillStyle = css(GOLD, 2, 0.9, 0.2);
    for (let i = 0; i < 5; i++) { const x = lerp(px0 + 2 * s, px1 - 2 * s, i / 4); ctx.fillRect(x - 0.6 * s, G.base - G.poh - 2.8 * s - 3.2 * s, 1.2 * s, 3.2 * s); }
    // 殿廊的门与幔子
    drawVeil(ctx, G, ph);
    return G;
  }
  // 幔子：蓝色、紫色、朱红色线织的（出 26:31）；从上到下裂为两半（太 27:51）
  function drawVeil(ctx, G, ph) {
    const s = LS(2), x0 = G.cx - G.dw / 2, x1 = G.cx + G.dw / 2, y1 = G.base, y0 = G.base - G.dh;
    const tear = clamp(W.lv.crVeil, 0, 1), holy = clamp(W.lv.crHoly, 0, 1.2);
    // 门洞（至圣所的光在幔子后面）
    ctx.fillStyle = css([30, 24, 20], 2);
    ctx.fillRect(x0 - 0.05 * ph, y0 - 0.06 * ph, G.dw + 0.1 * ph, G.dh + 0.06 * ph);
    if (holy > 0.01) {
      ctx.fillStyle = U.rgba(255, 226, 150, Math.min(1, 0.9 * holy));
      ctx.fillRect(x0, y0, G.dw, G.dh);
      ctx.fillStyle = U.rgba(255, 248, 226, Math.min(1, 0.7 * holy));
      ctx.fillRect(x0 + G.dw * 0.3, y0 + G.dh * 0.1, G.dw * 0.4, G.dh * 0.9);
    }
    // 裂开的地方：自上而下；已裂的部分两半向两旁拉开
    const yT = y0 + tear * G.dh;
    const gapMax = G.dw * 0.34 * smoothstep(0, 0.6, tear);
    const jag = y => Math.sin(y * 0.9) * 0.02 * ph + Math.sin(y * 2.3 + 1) * 0.012 * ph;
    const cxT = G.cx + 0.02 * ph;
    const gap = y => (y < yT ? gapMax * Math.pow(clamp((yT - y) / G.dh, 0, 1), 0.7) * (0.6 + 0.4 * tear) : 0);
    const N = 16;
    const half = side => {
      ctx.beginPath();
      if (side < 0) {
        ctx.moveTo(x0, y0);
        for (let i = 0; i <= N; i++) { const y = lerp(y0, y1, i / N); ctx.lineTo(cxT + jag(y) - gap(y) / 2, y); }
        ctx.lineTo(x0 + (tear > 0.02 ? G.dw * 0.03 * tear : 0), y1);
      } else {
        ctx.moveTo(x1, y0);
        for (let i = 0; i <= N; i++) { const y = lerp(y0, y1, i / N); ctx.lineTo(cxT + jag(y) + gap(y) / 2, y); }
        ctx.lineTo(x1 - (tear > 0.02 ? G.dw * 0.03 * tear : 0), y1);
      }
      ctx.closePath();
    };
    for (const side of [-1, 1]) {
      ctx.save();
      half(side);
      ctx.clip();
      // 竖的彩线
      const n = 9, sw = G.dw / n;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = css(VEIL[i % 3], 2, 1, 0.12 + moonLight());
        ctx.fillRect(x0 + i * sw - 0.5, y0, sw + 1, G.dh);
      }
      // 褶
      ctx.fillStyle = U.rgba(0, 0, 0, 0.22);
      for (let i = 0; i < n; i += 2) ctx.fillRect(x0 + i * sw + sw * 0.55, y0, sw * 0.35, G.dh);
      ctx.restore();
    }
    // 挂幔子的金杆
    ctx.fillStyle = css(GOLD, 2, 1, 0.25);
    ctx.fillRect(x0 - 0.06 * ph, y0 - 0.05 * ph, G.dw + 0.12 * ph, Math.max(1, 0.05 * ph));
    // 裂口正在往下走时的一线光
    if (tear > 0.01 && tear < 0.99) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,240,200,0.9)';
      ctx.beginPath(); ctx.arc(cxT + jag(yT), yT, Math.max(1, 0.05 * ph), 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ════════════════════════════════════════════════════════════
  //  园子与新坟墓（近地左）
  // ════════════════════════════════════════════════════════════
  function tombGeo(ph) {
    ph = ph || PH(2);
    const cx = px('tomb') * W.w, hw = 1.35 * ph * BK(), H = 1.5 * ph;
    const g = Math.max(gY(2, (cx - hw) / W.w), gY(2, (cx + hw) / W.w)) + 2;
    const dx = cx + 0.3 * ph * BK(), dw = 0.21 * ph, dh = 0.66 * ph, r = 0.36 * ph;
    const openX = dx + dw + r * 0.95;
    const sx = lerp(openX, dx, ease(clamp(W.lv.crStone, 0, 1)));
    return { ph, cx, hw, H, g, dx, dw, dh, r, openX, sx, sy: g - r + 0.02 * ph };
  }
  function olive(ctx, x, g, h, seed, ml) {
    const w = h * 0.55;
    ctx.fillStyle = css([88, 72, 56], 2, 1, ml * 0.5);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.09, g); ctx.quadraticCurveTo(x - w * 0.2, g - h * 0.3, x - w * 0.02, g - h * 0.5);
    ctx.lineTo(x + w * 0.06, g - h * 0.5); ctx.quadraticCurveTo(x + w * 0.02, g - h * 0.28, x + w * 0.12, g); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([112, 132, 100], 2, 1, ml * 0.5);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const q = CITY.olives[(seed * 6 + i) % CITY.olives.length];
      const ex = x + (q[0] - 0.5) * w * 1.3, ey = g - h * (0.55 + 0.35 * q[1]), rx = w * (0.28 + 0.15 * q[2]), ry = rx * 0.62;
      ctx.moveTo(ex + rx, ey); ctx.ellipse(ex, ey, rx, ry, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([150, 168, 136], 2, 0.5 * dayA(), 0.1);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const q = CITY.olives[(seed * 6 + i + 3) % CITY.olives.length];
      const ex = x + (q[0] - 0.5) * w * 1.0, ey = g - h * (0.7 + 0.25 * q[1]), rx = w * 0.2, ry = rx * 0.5;
      ctx.moveTo(ex + rx, ey); ctx.ellipse(ex, ey, rx, ry, 0, 0, TAU);
    }
    ctx.fill();
  }
  function drawGarden(ctx, ph) {
    const ml = moonLight(), T0 = tombGeo(ph);
    olive(ctx, T0.cx - T0.hw - 0.55 * ph, gY(2, (T0.cx - T0.hw - 0.55 * ph) / W.w) + 2, 1.6 * ph, 1, ml);
    olive(ctx, T0.cx + T0.hw + 0.9 * ph, gY(2, (T0.cx + T0.hw + 0.9 * ph) / W.w) + 2, 1.35 * ph, 3, ml);
    // 春天的花（百合、银莲花）
    if (W.daylight > 0.15) {
      const a = (0.35 + 0.4 * W.daylight) * (1 - gloomK());
      for (const f of CITY.flowers) {
        const xf = px('tomb') + (f.u - 0.35) * 2.6 * ph * BK() / W.w;
        const y = fieldY(xf, 0.03 + 0.3 * f.v), r = Math.max(0.7, 0.03 * ph * f.s);
        ctx.fillStyle = css(f.c, 2, a, 0.1);
        ctx.beginPath(); ctx.arc(xf * W.w, y - r, r, 0, TAU); ctx.fill();
      }
    }
  }
  // 磐石的轮廓：顶上起伏，右前方一面凿平的石壁（墓门在其上）
  const ROCKP = [[-1.35, 0], [-1.3, -0.5], [-1.14, -0.98], [-0.82, -1.3], [-0.4, -1.42], [0.05, -1.5], [0.46, -1.43], [0.84, -1.24], [1.08, -0.96], [1.16, -0.6], [1.3, -0.28], [1.35, 0]];
  function tombPath(T0) {
    const p = new Path2D();
    ROCKP.forEach((q, i) => {
      const edge = i === 0 || i === ROCKP.length - 1;
      const x = T0.cx + q[0] * T0.hw / 1.35 + (edge ? 0 : (rt(i + 200) - 0.5) * 0.1 * T0.ph);
      const y = T0.g + q[1] * T0.H / 1.5 + (edge ? 0 : (rt(i + 230) - 0.5) * 0.08 * T0.ph);
      if (i) p.lineTo(x, y); else p.moveTo(x, y);
    });
    p.closePath();
    return p;
  }
  function drawTomb(ctx, ph) {
    const T0 = tombGeo(ph), ml = moonLight(), s = LS(2);
    // 石
    ctx.fillStyle = css(ROCK, 2, 1, ml);
    ctx.fill(tombPath(T0));
    const lr = litX() >= T0.cx;
    ctx.save();
    ctx.clip(tombPath(T0));
    ctx.fillStyle = css(ROCK_S, 2, 0.6, ml * 0.5);
    ctx.fillRect(lr ? T0.cx - T0.hw : T0.cx + T0.hw * 0.35, T0.g - T0.H * 1.1, T0.hw * 0.65, T0.H * 1.1);
    ctx.strokeStyle = css(ROCK_S, 2, 0.6, ml * 0.4);
    ctx.lineWidth = Math.max(0.6, 0.03 * ph);
    ctx.beginPath();
    for (let k = 0; k < 4; k++) { const y = T0.g - T0.H * (0.2 + 0.2 * k); ctx.moveTo(T0.cx - T0.hw, y + rt(k + 210) * 0.1 * ph); ctx.quadraticCurveTo(T0.cx, y - 0.08 * ph, T0.cx + T0.hw, y + rt(k + 220) * 0.1 * ph); }
    ctx.stroke();
    // 凿平的石壁
    const fx0 = T0.dx - 0.46 * ph * BK(), fx1 = Math.min(T0.cx + T0.hw * 0.86, T0.dx + 0.5 * ph * BK()), fy = T0.g - 1.02 * ph;
    ctx.fillStyle = css([210, 194, 162], 2, 1, ml);
    ctx.beginPath(); ctx.moveTo(fx0, T0.g); ctx.lineTo(fx0 + 0.04 * ph, fy + 0.06 * ph); ctx.lineTo((fx0 + fx1) / 2, fy); ctx.lineTo(fx1, fy + 0.08 * ph); ctx.lineTo(fx1, T0.g); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(ROCK_S, 2, 0.7, ml * 0.4);
    ctx.fillRect(fx0 - 0.03 * ph, fy + 0.04 * ph, Math.max(1, 0.06 * ph), T0.g - fy);
    ctx.restore();
    // 石顶上的几丛小树
    ctx.fillStyle = css([74, 96, 62], 2, 1, ml * 0.4);
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      const q = ROCKP[3 + k], x = T0.cx + q[0] * T0.hw / 1.35, y = T0.g + q[1] * T0.H / 1.5, rr = (0.13 + 0.07 * rt(k + 260)) * ph;
      ctx.moveTo(x + rr, y); ctx.ellipse(x, y, rr, rr * 0.6, 0, 0, TAU);
    }
    ctx.fill();
    // 门（凿在磐石里的新坟墓）
    const dx = T0.dx, dw = T0.dw, dh = T0.dh, g = T0.g;
    ctx.fillStyle = css([22, 18, 16], 2);
    ctx.beginPath(); ctx.moveTo(dx - dw, g); ctx.lineTo(dx - dw, g - dh * 0.8); ctx.quadraticCurveTo(dx, g - dh * 1.08, dx + dw, g - dh * 0.8); ctx.lineTo(dx + dw, g); ctx.closePath(); ctx.fill();
    // 石槽
    ctx.fillStyle = css([120, 108, 90], 2, 0.9, ml * 0.5);
    ctx.fillRect(dx - dw - 0.1 * ph, g - 0.05 * ph, T0.openX - dx + dw + T0.r + 0.2 * ph, 0.07 * ph);
    // 磐石崩裂
    const ck = W.lv.crCrack;
    if (ck > 0.01) {
      ctx.strokeStyle = css([36, 30, 26], 2, 0.9);
      ctx.lineWidth = Math.max(0.8, 0.035 * ph);
      ctx.beginPath();
      const xs = T0.cx - T0.hw * 0.45, ys = T0.g - T0.H * 0.93;
      ctx.moveTo(xs, ys);
      for (let i = 1; i <= Math.ceil(7 * ck); i++) { const t = Math.min(i / 7, ck); ctx.lineTo(xs + T0.hw * 0.25 * t + (rt(i + 240) - 0.5) * 0.14 * ph, ys + T0.H * 0.6 * t); }
      ctx.stroke();
    }
    // 大石头
    const r = T0.r, sx = T0.sx, sy = T0.sy, rot = -(sx - T0.openX) / r;
    ctx.fillStyle = css([184, 172, 148], 2, 1, ml);
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([128, 116, 96], 2, 0.8, ml * 0.5);
    ctx.lineWidth = Math.max(0.7, 0.04 * ph);
    ctx.beginPath(); ctx.arc(sx, sy, r * 0.8, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx + Math.cos(rot) * r * 0.25, sy + Math.sin(rot) * r * 0.25); ctx.lineTo(sx + Math.cos(rot) * r * 0.72, sy + Math.sin(rot) * r * 0.72); ctx.stroke();
    ctx.strokeStyle = css([255, 238, 210], 2, 0.35 * dayA(), 0.2);
    ctx.beginPath(); ctx.arc(sx, sy, r, lr ? -1.3 : -Math.PI + 0.3, lr ? 0.1 : -1.8); ctx.stroke();
    // 封了石头（太 27:66）：一道绳，一块封泥
    const sl = clamp(W.lv.crSeal, 0, 1);
    if (sl > 0.01) {
      ctx.strokeStyle = css([150, 120, 80], 2, sl, 0.1);
      ctx.lineWidth = Math.max(0.6, 0.025 * ph);
      ctx.beginPath();
      ctx.moveTo(sx - r * 1.3, sy - r * 0.5); ctx.lineTo(sx, sy - r * 0.1); ctx.lineTo(sx + r * 1.25, sy - r * 0.55);
      ctx.stroke();
      ctx.fillStyle = css([170, 40, 36], 2, sl, 0.15);
      ctx.beginPath(); ctx.arc(sx, sy - r * 0.1, Math.max(1, 0.07 * ph), 0, TAU); ctx.fill();
    }
    return T0;
  }

  // ════════════════════════════════════════════════════════════
  //  光（画在"空中"那一层：在遍地的黑暗之上）
  // ════════════════════════════════════════════════════════════
  // 背着的十字架：肩上一端，另一端拖在身后的地上
  function drawCarried(ctx, id, a) {
    const f = fig(id);
    if (!f || !f._vis || a < 0.02) return;
    const ph = f._h || PH(2), dir = -(f.facing || 1);
    const sx = f._x - dir * 0.03 * ph, sy = f._y - 0.8 * ph, fy = f._y - 0.02 * ph;
    const L = 1.8 * ph, rem = 0.66 * L, dy = fy - sy;
    const dx = Math.sqrt(Math.max(0, rem * rem - dy * dy));
    const bx = sx + dir * dx, by = fy;
    const ux = (sx - bx) / rem, uy = (sy - by) / rem;
    const tx = sx + ux * 0.34 * L, ty = sy + uy * 0.34 * L;
    const cx = tx - ux * 0.22 * L, cy = ty - uy * 0.22 * L, nx = -uy, ny = ux, bw = 0.3 * L * 0.55;
    ctx.globalAlpha = Math.min(1, a) * f.alpha;
    ctx.strokeStyle = css(WOOD, 2, 1, 0.05);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.3, 0.08 * ph);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.moveTo(cx - nx * bw, cy - ny * bw); ctx.lineTo(cx + nx * bw, cy + ny * bw); ctx.stroke();
    ctx.strokeStyle = css([236, 206, 160], 2, 0.35 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath(); ctx.moveTo(bx, by - 0.03 * ph); ctx.lineTo(tx, ty - 0.03 * ph); ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 1;
  }
  // 细麻布裹好的一卷：在约瑟与尼哥德慕的手之间
  function drawBundle(ctx) {
    const a = clamp(W.lv.crBundle, 0, 1);
    if (a < 0.02) return;
    const A = figPt('joseph', 0.44), B = figPt('nico', 0.44);
    if (!A || !B) return;
    const ph = PH(2);
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.soft, (A[0] + B[0]) / 2, (A[1] + B[1]) / 2, ph * 1.1, a * (0.3 + 0.3 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    ctx.strokeStyle = css(LINEN, 2, 1, 0.3);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2.5, 0.23 * ph);
    const ex = (B[0] - A[0]) * 0.12;
    ctx.beginPath(); ctx.moveTo(A[0] - ex, A[1] + 0.02 * ph); ctx.lineTo(B[0] + ex, B[1] + 0.02 * ph); ctx.stroke();
    ctx.strokeStyle = U.rgba(200, 190, 170, 0.6);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let i = 1; i < 5; i++) { const u = i / 5, x = lerp(A[0] - ex, B[0] + ex, u), y = lerp(A[1], B[1], u) + 0.02 * ph; ctx.moveTo(x - 0.03 * ph, y - 0.07 * ph); ctx.lineTo(x + 0.03 * ph, y + 0.07 * ph); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 1;
  }
  // 洗手的盆（太 27:24）
  function drawBasin(ctx, ph) {
    const a = clamp(W.lv.crBasin, 0, 1);
    if (a < 0.02) return;
    const x = px('basin') * W.w, y = fieldY(px('basin'), 0.3), k = vK(0.3) * 1.9, top = y - 0.36 * ph * k;
    ctx.globalAlpha = a;
    // 盆架
    ctx.fillStyle = css([128, 110, 86], 2, 1, 0.05);
    ctx.fillRect(x - 0.03 * ph * k, top, 0.06 * ph * k, y - top);
    ctx.fillRect(x - 0.1 * ph * k, y - 0.03 * ph * k, 0.2 * ph * k, 0.03 * ph * k);
    // 铜盆
    ctx.fillStyle = css([204, 160, 96], 2, 1, 0.12);
    ctx.beginPath(); ctx.ellipse(x, top, 0.2 * ph * k, 0.09 * ph * k, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([236, 198, 130], 2, 1, 0.15);
    ctx.lineWidth = Math.max(0.8, 0.018 * ph * k);
    ctx.beginPath(); ctx.ellipse(x, top, 0.2 * ph * k, 0.045 * ph * k, 0, 0, TAU); ctx.stroke();
    // 水
    ctx.fillStyle = U.rgba(186, 222, 250, 0.9);
    ctx.beginPath(); ctx.ellipse(x, top + 0.004 * ph * k, 0.17 * ph * k, 0.034 * ph * k, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = U.rgba(255, 255, 255, 0.55 + 0.25 * Math.sin(W.t * 2.2));
    ctx.fillRect(x - 0.08 * ph * k, top - 0.008 * ph * k, 0.06 * ph * k, Math.max(0.8, 0.012 * ph * k));
    ctx.globalAlpha = 1;
  }
  function drawLights(ctx) {
    SP || sprites();
    const ph = PH(2), G = hillGeo(), gl = gloomK(), m = G.m;
    ctx.globalCompositeOperation = 'lighter';
    // 从上头来的光，落在耶稣身上（白天也要看得见：一层暖金染在白石上，加上亮光、脚前的一片光与缓缓落下的光点）
    const bm = W.lv.crBeam;
    if (bm > 0.01) {
      const p = figPt('jesus', 0.55), q = figPt('jesus', 0);
      if (p && q) {
        const dl = clamp(W.daylight, 0, 1), jh = figH('jesus') || ph;
        const hy = q[1] - jh * 1.02;     // 头顶：窄而亮的光心只到这里，好让他本人在光里仍看得清
        beam(ctx, p[0], 0, q[1] + 0.1 * jh, jh * 1.2, bm * 0.32 * dl, true);
        beam(ctx, p[0], 0, q[1] + 0.1 * jh, jh * 1.4, bm * (0.32 + 0.22 * dl));
        beam(ctx, p[0], 0, hy, jh * 0.42, bm * (0.2 + 0.25 * dl));
        glowSp(ctx, SP.soft, p[0], p[1], jh * 1.3, bm * 0.26);
        // 脚前的一片暖光
        ctx.save(); ctx.translate(q[0], q[1]); ctx.scale(1, 0.32);
        glowSp(ctx, SP.warm, 0, 0, jh * 1.3, bm * 0.35);
        ctx.restore();
        // 缓缓落下的光点（只关乎画面）
        for (let i = 0; i < 12; i++) {
          const u = (W.t * (0.05 + 0.02 * rt(i + 520)) + rt(i + 500)) % 1;
          const x = p[0] + (rt(i + 540) - 0.5) * jh * 0.7 + Math.sin(W.t * 0.7 + i * 2.1) * jh * 0.06, y = lerp(0, q[1] - 0.05 * jh, u);
          const a = bm * Math.sin(Math.PI * u) * (0.55 + 0.35 * Math.sin(W.t * 3 + i));
          glowSp(ctx, SP.gold, x, y, Math.max(2.2, jh * 0.09), a);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = U.rgba(255, 214, 128, Math.min(1, a * 0.85 * dl));
          ctx.beginPath(); ctx.arc(x, y, Math.max(0.9, jh * 0.018), 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
        }
      }
    }
    // 至圣所的金光（透过裂开的幔子）
    const holy = clamp(W.lv.crHoly, 0, 1.2);
    if (holy > 0.01) {
      const TG = temGeo(ph);
      glowSp(ctx, SP.gold, TG.cx, TG.base - TG.dh * 0.5, TG.dh * (1.1 + 0.2 * Math.sin(W.t * 0.8)), holy * (0.3 + 0.45 * gl + 0.2 * nightK()));
    }
    // 十字架：中间那一位胸中的光、右边那一个的一点光
    if (W.lv.crRaise > 0.3) {
      const bodies = clamp(W.lv.crBodies, 0, 1);
      const F1 = crossFrame(1, G), L1 = figLocal(F1), c1 = toScr(F1, L1.chest[0], L1.chest[1]);
      const life = clamp(W.lv.crLife, 0, 1) * bodies * F1.e;
      if (life > 0.01) {
        glowSp(ctx, SP.warm, c1[0], c1[1], m * (0.7 + 0.5 * life), life * (0.28 + 0.5 * gl + 0.2 * nightK()));
        glowSp(ctx, SP.white, c1[0], c1[1], m * 0.22, life * 0.55);
      }
      const pu = W.lv.crPulse;
      if (pu > 0.01) { glowSp(ctx, SP.white, c1[0], c1[1], m * 3.2 * (1.4 - 0.4 * pu), pu * 0.55); glowSp(ctx, SP.soft, c1[0], c1[1], M() * 0.5, pu * 0.18); }
      const th = clamp(W.lv.crThief, 0, 1) * bodies;
      if (th > 0.01) {
        const F2 = crossFrame(2, G), L2 = figLocal(F2), c2 = toScr(F2, L2.chest[0], L2.chest[1]);
        // 比中间那一位的光小而淡：只是被记念的一点光
        const lead = 0.45 + 0.55 * clamp(W.lv.crLife, 0.3, 1);
        glowSp(ctx, SP.warm, c2[0], c2[1], m * 0.42, th * (0.16 + 0.2 * gl) * lead);
        glowSp(ctx, SP.white, c2[0], c2[1], m * 0.1, th * 0.3 * lead);
      }
      // 「父啊！赦免他们」：一片温和的光自中间的十字架漫过地面
      const fg = W.lv.crForgive;
      if (fg > 0.01) {
        glowSp(ctx, SP.soft, c1[0], c1[1] + m * 0.5, W.w * 0.32, fg * 0.2);
        glowSp(ctx, SP.warm, c1[0], c1[1], m * 2.2, fg * 0.35);
      }
      // 遍地黑暗之时：十字架的轮廓仍依稀可辨
      if (gl > 0.05) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = U.rgba(170, 176, 196, 0.22 * gl);
        ctx.lineWidth = Math.max(0.6, 0.035 * m);
        ctx.beginPath();
        for (let k = 0; k < 3; k++) {
          const F = crossFrame(k, G);
          const a0 = toScr(F, 0, 0), a1 = toScr(F, 0, F.H), b0 = toScr(F, -0.42 * m, F.H * 0.8), b1 = toScr(F, 0.42 * m, F.H * 0.8);
          ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(b1[0], b1[1]);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
      }
    }
    // 上头开了的光（父：只是光）与升上去的那一点光（路 23:46）
    const ab = W.lv.crAbove;
    const topY = W.h * (phone() ? 0.37 : 0.17);     // 手机上经文在顶上：光开在经文之下
    if (ab > 0.01) {
      glowSp(ctx, SP.white, G.cx, topY, M() * 0.09, ab * 0.5);
      glowSp(ctx, SP.soft, G.cx, topY, M() * 0.22, ab * 0.26);
      const F1 = crossFrame(1, G);
      beam(ctx, G.cx, topY - M() * 0.05, F1.by - F1.H * 0.5, M() * 0.12, ab * 0.22);
    }
    const spv = W.lv.crSpirit;
    if (spv > 0.005 && spv < 0.995) {
      const F1 = crossFrame(1, G), L1 = figLocal(F1), c1 = toScr(F1, L1.chest[0], L1.chest[1]);
      const u = ease(spv), x = lerp(c1[0], G.cx, u) + Math.sin(spv * 9) * m * 0.12 * (1 - u), y = lerp(c1[1], topY, u);
      const a = (1 - smoothstep(0.75, 1, spv)) * 0.95;
      glowSp(ctx, SP.warm, x, y, m * 0.8, a * 0.5);
      glowSp(ctx, SP.white, x, y, m * 0.2, a);
    }
    // 一线光：从十字架到右边那一个（路 23:43）、到母亲（约 19:26）
    for (const e of FXL) {
      const k = e.t / e.dur, a = Math.sin(Math.PI * clamp(k, 0, 1));
      if (e.type === 'thread') {
        const F1 = crossFrame(1, G), L1 = figLocal(F1), c1 = toScr(F1, L1.chest[0], L1.chest[1]);
        let q = null;
        if (e.to === 'thief') { const F2 = crossFrame(2, G), L2 = figLocal(F2); q = toScr(F2, L2.chest[0], L2.chest[1]); }
        else q = figPt(e.to, 0.62);
        if (!q) continue;
        ctx.strokeStyle = U.rgba(255, 236, 196, 0.55 * a);
        ctx.lineWidth = Math.max(0.8, 0.05 * m);
        ctx.beginPath(); ctx.moveTo(c1[0], c1[1]);
        ctx.quadraticCurveTo((c1[0] + q[0]) / 2, Math.min(c1[1], q[1]) - m * 0.4, q[0], q[1]);
        ctx.stroke();
        glowSp(ctx, SP.warm, q[0], q[1], m * 0.9, a * 0.4);
      } else if (e.type === 'pulse') {
        glowSp(ctx, SP.gold, e.x, e.y, e.r * (0.6 + 0.6 * k), a * 0.4);
      } else if (e.type === 'drops') {
        for (let i = 0; i < e.n; i++) {
          const q = e.seed + i * 3, t = clamp(k * (1.1 + 0.4 * rt(q)) - 0.3 * rt(q + 1), 0, 1);
          if (t <= 0 || t >= 1) continue;
          const x = e.x + (rt(q + 2) - 0.5) * 2.6 * e.r * t, y = e.y - e.r * (1.2 + 1.4 * rt(q + 5)) * 4 * t * (1 - t);
          const da = Math.sin(Math.PI * t) * 0.9;
          glowSp(ctx, SP.pale, x, y, Math.max(2.4, e.r * 0.28), da * 0.7);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = U.rgba(222, 240, 255, da);
          ctx.beginPath(); ctx.arc(x, y, Math.max(0.9, e.r * 0.08), 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
        }
      } else if (e.type === 'arc') {
        // 一道弧光：从殿里裂开的幔子到封了的坟墓（「但耶稣这话是以他的身体为殿」）
        const TG = temGeo(ph), T0 = tombGeo(ph);
        const ax = TG.cx, ay = TG.base - TG.dh * 0.55, bx = T0.sx, by = T0.sy - T0.r * 0.2;
        const cx = (ax + bx) / 2, cy = Math.min(ay, by) - ph * 2.4, u = clamp(k * 1.7, 0, 1), fade = 1 - smoothstep(0.7, 1, k);
        const at = t => [(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by];
        ctx.strokeStyle = U.rgba(255, 226, 160, 0.5 * fade);
        ctx.lineWidth = Math.max(1, 0.045 * ph);
        ctx.beginPath(); ctx.moveTo(ax, ay);
        for (let i = 1; i <= 28; i++) { const q = at(u * i / 28); ctx.lineTo(q[0], q[1]); }
        ctx.stroke();
        const hd = at(u);
        glowSp(ctx, SP.gold, hd[0], hd[1], ph * 0.5, 0.6 * fade);
        if (u >= 1) glowSp(ctx, SP.gold, bx, by, T0.r * (2.2 + 0.6 * Math.sin(W.t * 1.5)), 0.4 * fade);
      }
    }
    // 遍地黑暗之时：十字架下的人各有一点微光，好在黑暗里认出他们
    if (gl > 0.05) {
      for (const id of ['mary', 'john', 'magdalene', 'centurion', 'omary']) {
        const f = fig(id);
        if (!f || !f._vis || f.dying) continue;
        const p = figPt(id, 0.6);
        glowSp(ctx, SP.warm, p[0], p[1], ph * 0.8, gl * 0.32 * (0.5 + (f.glow || 0.2)) * f.alpha);
      }
    }
    // 园子里落下的麦子（约 12:24）：先是几粒，后来「结出许多子粒来」
    const sw = W.lv.crSow;
    if (sw > 0.01) {
      const T0 = tombGeo(ph);
      for (let i = 0; i < 15; i++) {
        const vis = clamp(sw * 15 - i * 0.95, 0, 1);
        if (vis < 0.02) continue;
        const x = T0.dx + (rt(i + 400) - 0.45) * 3.4 * ph, y = fieldY(x / W.w, 0.08 + 0.34 * rt(i + 410));
        glowSp(ctx, SP.gold, x, y, ph * 0.15, vis * (0.4 + 0.2 * Math.sin(W.t * 1.6 + i)));
      }
    }
    // 封石之时的一点红光
    const se = W.lv.crSeal;
    if (se > 0.01 && se < 0.999) {
      const T0 = tombGeo(ph);
      glowSp(ctx, SP.ember, T0.sx, T0.sy - T0.r * 0.1, ph * 0.5, Math.sin(Math.PI * se) * 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    // 背着的十字架、盆、细麻布
    const ca = W.lv.crCarry, br = clamp(W.lv.crBear, 0, 1);
    if (ca > 0.02) { drawCarried(ctx, 'jesus', ca * (1 - br)); drawCarried(ctx, 'simon', ca * br); }
    drawBasin(ctx, ph);
    drawBundle(ctx);
  }

  // 一时的光（只关乎画面）
  const FXL = [];
  function fxAdd(e) { if (!W.replaying) FXL.push(Object.assign({ t: 0 }, e)); }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  function drawNear(ctx) {
    const ph = PH(2);
    drawWall(ctx, ph);
    const boxes = drawHouses(ctx, ph);
    drawHouseLights(ctx, boxes, ph);
    drawTemple(ctx, ph);
    drawPraetorium(ctx, ph);
    drawGate(ctx, ph);
    drawPavement(ctx, ph);
    drawGarden(ctx, ph);
    drawTomb(ctx, ph);
  }
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update(dt) {
      if (!isCur()) { FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'mid') { drawFarCity(ctx); drawHill(ctx); drawCrosses(ctx); return; }
      if (pass === 'near') { drawNear(ctx); return; }
      if (pass === 'air') { drawHaze(ctx); drawLights(ctx); }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, cx, cy) => { const d = Math.hypot(cx - x, cy - y); if (d < r && (!best || d < best.d)) best = { label, x: cx, y: cy - 10, d }; };
      const ph = PH(2), G = hillGeo();
      cand('各各他', G.cx, hillY(G.cx, G) + G.m * 0.4);
      if (W.lv.crRaise > 0.5) { const F = crossFrame(1, G); const p = toScr(F, 0, F.H * 0.7); cand('十字架', p[0], p[1]); }
      const TG = temGeo(ph);
      cand(W.lv.crVeil > 0.5 ? '裂开的幔子' : '殿里的幔子', TG.cx, TG.base - TG.dh * 0.5);
      cand('圣殿', TG.cx, TG.base - TG.poh * 0.85);
      const P = prGeo(ph);
      cand('衙门', P.cx, P.g - P.pod - P.colH * 0.7);
      cand('铺华石处', P.cx, fieldY(P.cx / W.w, 0.3));
      cand('城门', px('gate') * W.w, gY(2, px('gate')) - 1.6 * ph);
      const T0 = tombGeo(ph);
      cand('新坟墓', T0.dx, T0.g - T0.dh * 0.5);
      cand('大石头', T0.sx, T0.sy);
      cand('园子', T0.cx - T0.hw - 0.5 * ph, gY(2, (T0.cx - T0.hw - 0.5 * ph) / W.w) - 1.2 * ph);
      cand('耶路撒冷', 0.94 * W.w, gY(2, 0.94) - 1.6 * ph);
      return best;
    },
    // 给走查器：本幕的状态摘要（看完 == 直接恢复）
    sig() { return Object.assign({}, S); },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：清早的耶路撒冷，衙门前
  // ════════════════════════════════════════════════════════════
  const LV0 = {
    crBeam: 0, crBasin: 0, crCarry: 0, crBear: 0, crRaise: 0, crTitle: 0, crForgive: 0, crThief: 0, crTurn: 0,
    crLife: 1, crReed: 0, crPulse: 0, crBow: 0, crSpirit: 0, crAbove: 0, crVeil: 0, crHoly: 0, crCrack: 0, crBodies: 1,
    crBundle: 0, crStone: 0, crSeal: 0, crLamps: 0, crSow: 0, crHaze: 0,
  };
  const JG = 0.46;     // 在衙门前与往各各他的路上：耶稣的光稍亮（彼拉多在旁时也认得出是他）
  function setup() {
    const lv = Object.assign({ deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.85, herbs: 0.6, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0, bare: 0.12, bloom: 0.45,
      rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 }, LV0);
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    W.weatherExclude = [];
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 12, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    FXL.length = 0;
    S = fresh();
    const c = C();
    c.clear({ fade: false });
    // 清早：耶稣被捆绑解到衙门前；祭司长和长老站在衙门外（约 18:28）
    look('jesus', 'jesus', { x: px('jes') + 0.03, layer: 2, v: 0.22, facing: -1, glow: JG, from: 'none' });
    add('sol1', { label: '兵丁', sex: 'm', age: 'adult', x: px('s1') + 0.03, v: 0.3, facing: -1, robe: ROBE.soldier, accent: ROBE.solAcc, prop: 'spear', glow: 0.06, from: 'none' });
    add('sol2', { label: '兵丁', sex: 'm', age: 'adult', x: px('s2'), v: 0.32, facing: 1, robe: ROBE.soldier, accent: ROBE.solAcc, prop: 'spear', glow: 0.06, from: 'none' });
    priAdd({ instant: true }, px('pri0'), px('pri1'));
    avoid([0.44, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行，故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '到了早晨，众祭司长和民间的长老大家商议要治死耶稣，<br>就把他捆绑，解去，交给巡抚彼拉多。', ref: '马太福音 27:1–2', hold: 7 },
  ];
  const V1 = [
    { text: '……他们自己却不进衙门，恐怕染了污秽，<br>不能吃逾越节的筵席。', ref: '约翰福音 18:28', hold: 5.5 },
    { text: '彼拉多又进了衙门，叫耶稣来，对他说：<br>「你是犹太人的王吗？」', ref: '约翰福音 18:33', hold: 5.5 },
    { text: '耶稣回答说：「我的国不属这世界；我的国若属这世界，我的臣仆必要争战，<br>使我不至于被交给犹太人。只是我的国不属这世界。」', ref: '约翰福音 18:36', hold: 8 },
  ];
  const V2 = [
    { text: '彼拉多就对他说：「这样，你是王吗？」耶稣回答说：「你说我是王。<br>我为此而生，也为此来到世间，特为给真理作见证。凡属真理的人就听我的话。」', ref: '约翰福音 18:37', hold: 8.5 },
    { text: '彼拉多说：「真理是什么呢？」说了这话，又出来到犹太人那里，<br>对他们说：「我查不出他有什么罪来。」', ref: '约翰福音 18:38', hold: 7 },
    { text: '他们又喊着说：「不要这人，要巴拉巴！」<br>这巴拉巴是个强盗。', ref: '约翰福音 18:40', hold: 5.5 },
  ];
  const V3 = [
    { text: '当下彼拉多将耶稣鞭打了。<br>兵丁用荆棘编做冠冕戴在他头上，给他穿上紫袍……', ref: '约翰福音 19:1–2', hold: 6.5 },
    { text: '祭司长和差役看见他，就喊着说：<br>「钉他十字架！钉他十字架！」', ref: '约翰福音 19:6', hold: 5.5 },
    { text: '彼拉多说：「你不对我说话吗？你岂不知我有权柄释放你，也有权柄把你钉十字架吗？」<br>耶稣回答说：「若不是从上头赐给你的，你就毫无权柄办我……」', ref: '约翰福音 19:10–11', hold: 8.5 },
  ];
  const V4 = [
    { text: '彼拉多见说也无济于事，反要生乱，就拿水在众人面前洗手，<br>说：「流这义人的血，罪不在我，你们承当吧。」', ref: '马太福音 27:24', hold: 7 },
    { text: '把他们所求的那作乱杀人、下在监里的释放了，<br>把耶稣交给他们，任凭他们的意思行。', ref: '路加福音 23:25', hold: 6.5 },
    { text: '他们就把耶稣带了去。<br>耶稣背着自己的十字架出来……', ref: '约翰福音 19:17', hold: 5.5 },
  ];
  const V5 = [
    { text: '带耶稣去的时候，有一个古利奈人西门，从乡下来；<br>他们就抓住他，把十字架搁在他身上，叫他背着跟随耶稣。', ref: '路加福音 23:26', hold: 7.5 },
    { text: '有许多百姓跟随耶稣，内中有好些妇女；<br>妇女们为他号咷痛哭。', ref: '路加福音 23:27', hold: 5.5 },
    { text: '耶稣转身对她们说：「耶路撒冷的女子，不要为我哭，<br>当为自己和自己的儿女哭。」', ref: '路加福音 23:28', hold: 6.5 },
  ];
  const V6 = [
    { text: '到了一个地方，名叫「髑髅地」，就在那里把耶稣钉在十字架上，<br>又钉了两个犯人：一个在左边，一个在右边。', ref: '路加福音 23:33', hold: 7.5 },
    { text: '彼拉多又用牌子写了一个名号，安在十字架上，<br>写的是：「犹太人的王，拿撒勒人耶稣。」', ref: '约翰福音 19:19', hold: 6.5 },
    { text: '当下耶稣说：「父啊！赦免他们；因为他们所做的，他们不晓得。」<br>兵丁就拈阄分他的衣服。', ref: '路加福音 23:34', hold: 7.5 },
  ];
  const V7 = [
    { text: '那同钉的两个犯人有一个讥笑他，说：<br>「你不是基督吗？可以救自己和我们吧！」', ref: '路加福音 23:39', hold: 6 },
    { text: '那一个就应声责备他，说：「你既是一样受刑的，还不怕神吗？……」<br>就说：「耶稣啊，你得国降临的时候，求你记念我！」', ref: '路加福音 23:40–42', hold: 7.5 },
    { text: '耶稣对他说：「我实在告诉你，<br>今日你要同我在乐园里了。」', ref: '路加福音 23:43', hold: 6 },
  ];
  const V8 = [
    { text: '站在耶稣十字架旁边的，有他母亲与他母亲的姊妹，<br>并革罗罢的妻子马利亚，和抹大拉的马利亚。', ref: '约翰福音 19:25', hold: 6.5 },
    { text: '耶稣见母亲和他所爱的那门徒站在旁边，<br>就对他母亲说：「母亲，看，你的儿子！」', ref: '约翰福音 19:26', hold: 6.5 },
    { text: '又对那门徒说：「看，你的母亲！」<br>从此，那门徒就接她到自己家里去了。', ref: '约翰福音 19:27', hold: 6 },
  ];
  const V9 = [
    { text: '从午正到申初，遍地都黑暗了。', ref: '马太福音 27:45', hold: 5.5 },
    { text: '约在申初，耶稣大声喊着说：「以利！以利！拉马撒巴各大尼？」<br>就是说：「我的神！我的神！为什么离弃我？」', ref: '马太福音 27:46', hold: 8 },
  ];
  const V10 = [
    { text: '这事以后，耶稣知道各样的事已经成了，<br>为要使经上的话应验，就说：「我渴了。」', ref: '约翰福音 19:28', hold: 6.5 },
    { text: '有一个器皿盛满了醋，放在那里；<br>他们就拿海绒蘸满了醋，绑在牛膝草上，送到他口。', ref: '约翰福音 19:29', hold: 6.5 },
    { text: '耶稣尝了那醋，就说：「成了！」<br>便低下头……', ref: '约翰福音 19:30', hold: 6 },
  ];
  const V11 = [
    { text: '耶稣大声喊着说：「父啊！我将我的灵魂交在你手里。」<br>说了这话，气就断了。', ref: '路加福音 23:46', hold: 8 },
  ];
  const V12 = [
    { text: '忽然，殿里的幔子从上到下裂为两半，<br>地也震动，磐石也崩裂……', ref: '马太福音 27:51', hold: 6.5 },
    { text: '百夫长和一同看守耶稣的人看见地震并所经历的事，<br>就极其害怕，说：「这真是神的儿子了！」', ref: '马太福音 27:54', hold: 7 },
    { text: '聚集观看的众人见了这所成的事都捶着胸回去了。<br>还有一切与耶稣熟识的人，和从加利利跟着他来的妇女们，都远远地站着看这些事。', ref: '路加福音 23:48–49', hold: 8 },
  ];
  // 安葬：先说身体怎样从十字架上取下、安放、封口；末了才是他先前论到这时候的话（约 12:23–24）
  const V13 = [
    { text: '到了晚上，有一个财主，名叫约瑟，是亚利马太来的……<br>这人去见彼拉多，求耶稣的身体；彼拉多就吩咐给他。', ref: '马太福音 27:57–58', hold: 6.5 },
    { text: '约瑟取了身体，用干净细麻布裹好，安放在自己的新坟墓里，就是他凿在磐石里的。<br>他又把大石头滚到墓门口，就去了。', ref: '马太福音 27:59–60', hold: 8.5 },
    { text: '耶稣说：「人子得荣耀的时候到了。……<br>一粒麦子不落在地里死了，仍旧是一粒，若是死了，就结出许多子粒来。」', ref: '约翰福音 12:23–24', hold: 8 },
  ];
  // 封石；末了是他自己口里的应许（约 2:19，21）——「三日后我要复活」只由祭司长的话里转述
  const V14 = [
    { text: '有抹大拉的马利亚和那个马利亚在那里，<br>对着坟墓坐着。', ref: '马太福音 27:61', hold: 5 },
    { text: '次日……祭司长和法利赛人聚集来见彼拉多，说：<br>「大人，我们记得那诱惑人的还活着的时候曾说：『三日后我要复活。』」', ref: '马太福音 27:62–63', hold: 7.5 },
    { text: '他们就带着看守的兵同去，<br>封了石头，将坟墓把守妥当。', ref: '马太福音 27:66', hold: 5.5 },
    { text: '「你们拆毁这殿，我三日内要再建立起来。」……<br>但耶稣这话是以他的身体为殿。', ref: '约翰福音 2:19–21', hold: 7.5 },
  ];

  // 十字架上的兵丁（中丘，站在石冈上）
  function hillFeet(du) {
    return () => {
      const G = hillGeo(), x = G.cx + du * G.m;
      return [x, hillY(x, G) + 0.05 * G.m];
    };
  }
  function addHillSoldier(b, id, du, facing, ps) {
    add(id, { label: '兵丁', sex: 'm', age: 'adult', layer: 1, x: px('hill') + du * 0.01, facing, robe: ROBE.soldier, accent: ROBE.solAcc, prop: 'spear', glow: 0.06, pose: ps || 'stand', from: from(b) });
    attachFig(id, hillFeet(du));
  }
  // 从中间的十字架漫开的一圈光
  function crossRing(b, rgb, k, dur) {
    if (b.instant) return;
    const G = hillGeo(), F = crossFrame(1, G), L = figLocal(F), c = toScr(F, L.chest[0], L.chest[1]);
    ringAt(b, c[0], c[1], rgb, G.m * (k || 3), dur || 2.4);
  }
  const doorF = () => { const T0 = tombGeo(); return T0.dx / W.w; };
  // 洗手的水光：几点圆的水珠自盆里溅起又落回（白天也是柔和的圆点，不是方的像素）
  let dropSeed = 0;
  function basinSplash(b, n) {
    if (b.instant) return;
    const ph = PH(2), k = vK(0.3) * 1.9, x = px('basin') * W.w, y = fieldY(px('basin'), 0.3) - 0.36 * ph * k;
    fxAdd({ type: 'drops', x, y, r: 0.2 * ph * k, n, seed: (dropSeed += 37), dur: 1.8 });
    fxAdd({ type: 'pulse', x, y, r: 0.5 * ph * k, dur: 1.6 });
  }
  // 手机竖屏：经文在顶上，正午的日头正在经文之后——上午起天就蒙上一层薄薄的阴霾（也预示午正的黑暗）
  function phoneHaze(b) {
    if (!phone()) return;
    W.set('clouds', 0.75, b.instant);
    W.set('storm', 0.34, b.instant);
    W.set('crHaze', 1, b.instant);
  }
  // 那片云（画在"空中"一层，日头所在之处）
  function drawHaze(ctx) {
    const hz = W.lv.crHaze;
    if (hz < 0.01 || !W.sun || !phone()) return;
    const x = W.sun.x, y = W.sun.y, R = M() * 0.2;
    if (!(y < W.h * 0.5)) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, U.rgba(66, 80, 102, 0.9 * hz));
    g.addColorStop(0.45, U.rgba(70, 86, 110, 0.6 * hz));
    g.addColorStop(1, U.rgba(76, 94, 120, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - R, y - R, R * 2, R * 2);
  }

  // ════════════════════════════════════════════════════════════
  //  话语：子的话（约 18:36；18:37；19:11；路 23:28；23:34；23:43；约 19:26；太 27:46；约 19:30；路 23:46；约 12:24；约 2:19），
  //  与经上所记的作为（约 19:17 背着自己的十字架；太 27:51 幔子从上到下裂为两半）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 彼拉多：「我的国不属这世界」（约 18）─────────────────
    {
      kind: 'name', utter: '我的国不属这世界', cmd: 'kingdom --origin 天上  # 不属这世界', ref: '约翰福音 18:36', tint: [240, 226, 200],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => { W.goTo(0.32, 10, b.instant); priFace(-1); }],
          [L[1] - 0.8, b => {
            add('pilate', { label: '彼拉多', sex: 'm', age: 'adult', x: px('pr'), v: 0.1, facing: 1, robe: ROBE.pilate, accent: ROBE.pilAcc, hair: 'short', beard: false, glow: 0.1, from: from(b) });
            walk('pilate', px('pil'), { speed: 0.012, pose: 'seat' });
          }],
          [L[1] + 0.6, b => {
            walk('jesus', px('jes'), { speed: 0.012 });
            walk('sol1', px('s1'), { speed: 0.012 });
          }],
          [L[1] + 3.6, b => { face('pilate', 'jesus'); face('jesus', 'pilate'); }],
          [L[2] + 1.0, b => {
            W.set('crBeam', 1, b.instant);
            glow('jesus', 0.62);
            ringFig(b, 'jesus', [255, 240, 210], 2.4);
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 6.5, b => { W.set('crBeam', 0, b.instant); glow('jesus', JG); }],
        ]);
      },
    },
    // ── 2 · 「特为给真理作见证」；要巴拉巴（约 18:37–40）─────────
    {
      kind: 'name', utter: '特为给真理作见证', cmd: 'testify --to 真理  # 凡属真理的人就听我的话', ref: '约翰福音 18:37', tint: [246, 236, 214],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => { W.goTo(0.345, 12, b.instant); }],
          [L[0] + 3.5, b => { glow('jesus', 0.6); ringFig(b, 'jesus', [255, 246, 226], 2); sfx(b, 'chime', { soft: true }); }],
          [L[1] + 1.2, b => { pose('pilate', 'stand'); glow('jesus', JG); }],
          [L[1] + 2.4, b => { walk('pilate', px('pri0') - 0.01, { speed: 0.014, pose: 'raise' }); face('pilate', 1); }],
          [L[2] - 0.6, b => {
            crowd('people', { n: phone() ? 3 : 5, x0: px('peo0'), x1: px('peo1'), layer: 2, v: 0.5, label: '众人', from: from(b), mill: false });
            crowdFace('people', -1);
          }],
          [L[2] + 0.4, b => {
            crowdPose('people', 'raise'); priPose('raise');
            add('barabbas', { label: '巴拉巴', sex: 'm', age: 'adult', x: px('bar'), v: 0.46, facing: 1, robe: ROBE.barabbas, glow: 0.04, pose: 'bow', from: from(b) });
            sfx(b, 'shout'); sfx(b, 'crowd');
          }],
          [L[2] + 4.2, b => { crowdPose('people', 'stand'); priPose('stand'); pose('pilate', 'stand'); }],
        ]);
      },
    },
    // ── 3 · 「若不是从上头赐给你的」（约 19:1–11）─────────────────
    {
      kind: 'judge', utter: '若不是从上头赐给你的，你就毫无权柄办我', cmd: 'authority --source 上头  # 你就毫无权柄办我', ref: '约翰福音 19:11', tint: [236, 228, 214],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.4, 14, b.instant);
            phoneHaze(b);
            // 鞭打与戏弄只由经文说出：人被带进衙门里去，门外只剩等着的众人
            walk('jesus', px('pr'), { speed: 0.012 });
            walk('sol1', px('pr') + 0.012, { speed: 0.012 });
            walk('pilate', px('pil'), { speed: 0.014 });
          }],
          [2.8, b => { rm('jesus'); rm('sol1'); }],
          [L[1] - 0.8, b => {
            look('jesus', 'jesus', { x: px('pr'), layer: 2, v: 0.22, facing: 1, glow: JG, from: from(b) });
            add('sol1', { label: '兵丁', sex: 'm', age: 'adult', x: px('pr') + 0.012, v: 0.3, facing: 1, robe: ROBE.soldier, accent: ROBE.solAcc, prop: 'spear', glow: 0.06, from: from(b) });
            walk('jesus', px('jes'), { speed: 0.012 });
            walk('sol1', px('s1'), { speed: 0.012 });
          }],
          [L[1] + 1.2, b => { crowdPose('people', 'raise'); priPose('raise'); crowdFace('people', -1); priFace(-1); sfx(b, 'shout'); }],
          [L[1] + 5.2, b => { crowdPose('people', 'stand'); priPose('stand'); }],
          [L[2] + 0.4, b => { face('pilate', 'jesus'); pose('pilate', 'point'); face('jesus', 'pilate'); }],
          [L[2] + 4.4, b => {
            W.set('crBeam', 1, b.instant);
            glow('jesus', 0.66);
            ringFig(b, 'jesus', [255, 244, 220], 2.6);
            pose('pilate', 'stand');
            walk('pilate', px('pil') - 0.012, { speed: 0.008 });
            sfx(b, 'harp');
          }],
          [L[2] + 9.2, b => { W.set('crBeam', 0, b.instant); glow('jesus', JG); face('pilate', 'jesus'); }],
        ]);
      },
    },
    // ── 4 · 洗手；巴拉巴得释放；「耶稣背着自己的十字架出来」（太 27:24；路 23:25；约 19:17）──
    {
      kind: 'act', utter: '耶稣背着自己的十字架出来', cmd: 'carry 十字架 --by 耶稣 --out 城门', ref: '约翰福音 19:17', tint: [226, 214, 196],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            W.goTo(0.46, 14, b.instant);
            phoneHaze(b);
            W.set('crBasin', 1, b.instant);
            walk('pilate', px('basin') - 0.012, { speed: 0.012, pose: 'bow' });
          }],
          // 洗手：水光溅起，一阵又一阵（盆放大了；水光停留更久）
          [L[0] + 2.4, b => { basinSplash(b, 18); sfx(b, 'splash', { soft: true }); }],
          [L[0] + 3.6, b => { basinSplash(b, 14); }],
          [L[0] + 4.8, b => { basinSplash(b, 12); sfx(b, 'splash', { soft: true }); }],
          [L[0] + 5.6, b => { pose('pilate', 'stand'); face('pilate', 1); }],
          [L[1], b => {
            walk('barabbas', 1.04, { speed: 0.03 });
            crowdPose('people', 'stand');
            sfx(b, 'crowd', { soft: true });
          }],
          [L[1] + 2.5, b => { W.set('crBasin', 0, b.instant); walk('pilate', px('pr'), { speed: 0.012 }); }],
          [L[1] + 5.0, b => { rm('pilate'); rm('barabbas'); }],
          [L[2], b => {
            S.place = 'way'; S.carrier = 'jesus';
            W.set('crCarry', 1, b.instant); W.set('crBear', 0, true);
            face('jesus', -1);
            walk('jesus', px('out'), { speed: 0.011 });
            walk('sol1', px('out') + 0.028, { speed: 0.011 });
            walk('sol2', px('out') - 0.03, { speed: 0.011 });
            priWalk(px('out') + 0.075, px('out') + 0.16, { speed: 0.011 });
            crowdWalk('people', px('out') + 0.1, px('out') + 0.24, { speed: 0.011 });
            sfx(b, 'march', { soft: true });
          }],
        ]);
      },
    },
    // ── 5 · 古利奈人西门；「耶路撒冷的女子，不要为我哭」（路 23:26–28）──
    {
      kind: 'call', utter: '耶路撒冷的女子，不要为我哭', cmd: 'turn --to 耶路撒冷的女子  # 不要为我哭', ref: '路加福音 23:28', tint: [236, 214, 200],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.48, 12, b.instant);
            walk('jesus', px('way'), { speed: 0.008 });
            add('simon', { label: '古利奈人西门', sex: 'm', age: 'adult', x: px('sim0'), v: 0.18, facing: 1, robe: ROBE.simon, accent: [200, 176, 130], glow: 0.14, from: from(b) });
            walk('simon', px('simT'), { speed: 0.016 });
          }],
          [L[0] + 4.2, b => {
            S.carrier = 'simon';
            W.set('crBear', 1, b.instant);
            face('simon', 1);
            sfx(b, 'build', { soft: true });
          }],
          [L[0] + 5.4, b => {
            // 西门背着十字架，走到耶稣的后面去（跟随耶稣）
            walk('simon', px('way') + 0.026, { speed: 0.01 });
            face('simon', -1);
            follow('sol1', null);
            walk('sol1', px('way') + px('solBack'), { speed: 0.012 });
          }],
          [L[1] - 0.4, b => {
            // 妇女们在十字架拖地的一端之外、离看的人近一些（画面更低）：不与西门背的十字架叠在一起
            crowd('women', { n: phone() ? 3 : 4, x0: px('wom0'), x1: px('wom1'), layer: 2, v: 0.58, label: '耶路撒冷的女子', robe: [150, 108, 104], from: from(b), mill: false, pose: 'weep' });
            crowdFace('women', -1);
            sfx(b, 'weep', { soft: true });
          }],
          [L[2] + 0.4, b => {
            face('jesus', 1);
            glow('jesus', 0.55);
            ringFig(b, 'jesus', [255, 232, 206], 2.2);
          }],
          [L[2] + 5.6, b => { glow('jesus', JG); }],
        ]);
      },
    },
    // ── 6 · 各各他：「父啊！赦免他们」（路 23:33–34；约 19:19）──────
    {
      kind: 'bless', utter: '父啊！赦免他们；因为他们所做的，他们不晓得', cmd: 'forgive --all  # 他们所做的，他们不晓得', ref: '路加福音 23:34', tint: [255, 232, 206],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            S.place = 'golgotha';
            W.goTo(0.5, 10, b.instant);
            // 往石冈上去：一行人往左走，渐渐隐没（上了各各他）
            face('jesus', -1);
            walk('jesus', px('way') - 0.05, { speed: 0.012 });
            walk('simon', px('way') - 0.03, { speed: 0.012 });
            walk('sol1', px('way') - 0.02, { speed: 0.012 });
            walk('sol2', px('way') - 0.06, { speed: 0.012 });
            uncrowd('women');
            priWalk(px('wat0'), lerp(px('wat0'), px('wat1'), 0.45), { speed: 0.014 });
            crowdWalk('people', lerp(px('wat0'), px('wat1'), 0.4), px('wat1'), { speed: 0.014 });
          }],
          [2.6, b => { W.set('crCarry', 0, b.instant); S.carrier = null; rm('jesus'); rm('simon'); rm('sol1'); rm('sol2'); }],
          [3.0, b => {
            S.raised = true;
            W.set('crRaise', 1, b.instant);
            addHillSoldier(b, 'm1', -1.9, 1, 'stand');
            addHillSoldier(b, 'm2', 0.62, -1, 'stand');
            addHillSoldier(b, 'm3', 2.0, -1, 'stand');
            sfx(b, 'wind', { soft: true, far: true });
          }],
          [5.5, b => { priFace(-1); crowdFace('people', -1); }],
          [L[1] + 0.3, b => {
            W.set('crTitle', 1, b.instant);
            const G = hillGeo();
            wordsAt(b, '犹太人的王，拿撒勒人耶稣', G.cx, W.h * (phone() ? 0.5 : 0.44), [236, 226, 204], { size: 0.03, hold: 3.4, src: () => [G.cx + (Math.random() - 0.5) * G.m, hillY(G.cx, G) - 2 * G.m] });
          }],
          [L[1] + 1.4, b => {
            // 看的人在城门外、园子前的草地上，都面向各各他（不在彼拉多的铺华石处）
            look('mary', 'mary', { x: px('mar'), layer: 2, v: pv('mar'), facing: 1, from: from(b) });
            look('john', 'john', { x: px('joh'), layer: 2, v: pv('joh'), facing: 1, from: from(b) });
            look('magdalene', 'magdalene', { x: px('mag'), layer: 2, v: pv('mag'), facing: 1, from: from(b) });
            crowd('galilee', { n: phone() ? 2 : 3, x0: px('gal0'), x1: px('gal1'), layer: 2, v: pv('gal'), label: '从加利利跟随的妇女', robe: [140, 112, 120], from: from(b), mill: false });
            crowdFace('galilee', 1);
            add('centurion', { label: '百夫长', sex: 'm', age: 'adult', x: px('cen'), v: pv('cen'), facing: -1, robe: ROBE.centurion, accent: ROBE.cenAcc, prop: 'spear', glow: 0.1, from: from(b) });
          }],
          [L[2] + 0.6, b => {
            W.set('crForgive', 1, b.instant);
            crossRing(b, [255, 236, 206], 4, 3);
            sfx(b, 'harp');
          }],
          [L[2] + 4.2, b => { pose('m1', 'kneel'); pose('m3', 'kneel'); sfx(b, 'coins', { soft: true }); }],
          [L[2] + 6.0, b => { W.set('crForgive', 0, b.instant); }],
        ]);
      },
    },
    // ── 7 · 「今日你要同我在乐园里了」（路 23:39–43）─────────────
    {
      kind: 'promise', utter: '今日你要同我在乐园里了', cmd: 'remember 那个犯人 --in 乐园 --when 今日', ref: '路加福音 23:43', tint: [255, 230, 190],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => { W.goTo(0.51, 8, b.instant); }],
          [L[1] + 3.0, b => { W.set('crTurn', 1, b.instant); }],
          [L[2] + 1.2, b => {
            fxAdd({ type: 'thread', to: 'thief', dur: 5 });
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 2.8, b => { S.thief = true; W.set('crThief', 1, b.instant); }],
        ]);
      },
    },
    // ── 8 · 「母亲，看，你的儿子！」（约 19:25–27）────────────────
    {
      kind: 'call', utter: '母亲，看，你的儿子！', cmd: 'entrust 母亲 --to 所爱的门徒  # 看，你的母亲', ref: '约翰福音 19:26', tint: [236, 226, 240],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => { W.goTo(0.52, 8, b.instant); }],
          // 「站在耶稣十字架旁边的」：马利亚与约翰走到各各他脚下，正在十字架底下
          [0.8, b => {
            walk('mary', px('marNear'), { speed: 0.011 });
            walk('john', px('johNear'), { speed: 0.011 });
            walk('magdalene', px('mag') + 0.018, { speed: 0.008 });
          }],
          [L[1] - 0.4, b => { face('mary', px('hill')); face('john', px('hill')); pose('john', 'gaze'); }],
          [L[1] + 2.2, b => {
            pose('mary', 'gaze');
            fxAdd({ type: 'thread', to: 'mary', dur: 5 });
            glow('mary', 0.45);
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 1.0, b => { face('john', 'mary'); face('mary', 'john'); pose('mary', 'stand'); pose('john', 'stand'); }],
          [L[2] + 2.2, b => {
            S.mother = true;
            hold('john', 'mary', true);
            glow('john', 0.4); glow('mary', 0.4);
            ringFig(b, 'mary', [240, 230, 255], 1.8);
          }],
          [L[2] + 4.4, b => { face('john', px('hill')); face('mary', px('hill')); }],
        ]);
      },
    },
    // ── 9 · 遍地都黑暗了；「以利！以利！」（太 27:45–46）─────────
    {
      kind: 'ask', utter: '以利！以利！拉马撒巴各大尼？', cmd: 'darkness --from 午正 --to 申初', ref: '马太福音 27:46', tint: [190, 186, 206],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.625, 11, b.instant);
            W.set('crHaze', 0, b.instant);
            W.set('gloom', 0.7, b.instant);
            W.set('storm', 0.6, b.instant);
            W.set('clouds', 0.9, b.instant);
            sfx(b, 'wind', { far: true });
          }],
          [3.5, b => { W.setPop('bird', 0, W.w * 0.6, W.h * 0.3, b.instant); if (!b.instant) GS.book.resync(); crowdPose('galilee', 'weep'); }],
          [L[1] + 0.6, b => {
            W.set('crLife', 0.6, b.instant);
            pose('mary', 'weep', { weep: true });
            sfx(b, 'wind');
          }],
          [L[1] + 5.0, b => { crossRing(b, [200, 206, 230], 3.5, 3); }],
        ]);
      },
    },
    // ── 10 · 「成了」（约 19:28–30）─────────────────────────────
    {
      kind: 'act', utter: '成了', cmd: 'done  # 成了', ref: '约翰福音 19:30', tint: [255, 248, 232], hold: 2.6,
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => { W.goTo(0.63, 6, b.instant); }],
          [L[1] + 1.2, b => { pose('m2', 'raise'); W.set('crReed', 1, b.instant); }],
          [L[1] + 5.0, b => { W.set('crReed', 0, b.instant); }],
          [L[1] + 6.2, b => { pose('m2', 'stand'); }],
          [L[2] + 0.8, b => {
            W.set('crPulse', 1, b.instant);
            crossRing(b, [255, 250, 236], 6, 3.2);
            sfx(b, 'bell', { soft: true });
          }],
          [L[2] + 2.0, b => { W.set('crPulse', 0, b.instant); }],
          [L[2] + 2.4, b => {
            S.bowed = true;
            W.set('crBow', 1, b.instant);
            W.set('crLife', 0.22, b.instant);
            // 天地都静下来：风止了，乌云停住；一圈慢而宽的光漫过全地；看的人都转向各各他，低下头
            W.set('storm', 0.35, b.instant);
            W.set('gale', 0, b.instant);
            crossRing(b, [255, 244, 222], 12, 5.5);
            for (const id of ['mary', 'john', 'magdalene']) { face(id, px('hill')); pose(id, 'bow'); }
            crowdFace('galilee', 1); crowdPose('galilee', 'bow');
            face('centurion', px('hill'));
          }],
        ]);
      },
    },
    // ── 11 · 「父啊！我将我的灵魂交在你手里」（路 23:46）────────────
    {
      kind: 'bless', utter: '父啊！我将我的灵魂交在你手里', cmd: 'commit 灵魂 --into 父的手里', ref: '路加福音 23:46', tint: [236, 236, 255],
      verse: V11,
      apply(c) {
        T(c, [
          [0.4, b => { W.set('crAbove', 1, b.instant); sfx(b, 'wind', { soft: true, far: true }); }],
          [2.6, b => { W.set('crSpirit', 1, b.instant); W.set('crLife', 0, b.instant); }],
          [5.2, b => { pose('mary', 'kneel'); pose('john', 'weep', { weep: false }); pose('magdalene', 'kneel'); crowdPose('galilee', 'kneel'); }],
          [8.6, b => { S.spirit = true; W.set('crAbove', 0, b.instant); sfx(b, 'bell', { soft: true, far: true }); }],
        ]);
      },
    },
    // ── 12 · 「殿里的幔子从上到下裂为两半」（太 27:51–54；路 23:48–49）──
    {
      kind: 'act', utter: '殿里的幔子从上到下裂为两半', cmd: 'tear 幔子 --from 上 --to 下', ref: '马太福音 27:51', tint: [255, 226, 170],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0.2, b => {
            S.veil = true;
            W.set('crVeil', 1, b.instant);
            W.set('crHoly', 1, b.instant);
            if (!b.instant) { W.shake = 1; W.flash = 0.2; }
            sfx(b, 'quake');
            const TG = temGeo(PH(2));
            sparkAt(b, TG.cx, TG.base - TG.dh * 0.8, 24, [255, 236, 190], 10);
          }],
          [1.6, b => {
            W.set('crCrack', 1, b.instant);
            if (!b.instant) W.shake = Math.max(W.shake, 0.7);
            sfx(b, 'collapse', { soft: true });
            const T0 = tombGeo();
            dustAt(b, T0.cx, T0.g - T0.H * 0.5, 18, [196, 180, 150], 16);
          }],
          [2.6, b => { W.goTo(0.66, 14, b.instant); W.set('gloom', 0.26, b.instant); W.set('storm', 0.32, b.instant); W.set('clouds', 0.6, b.instant); }],
          [L[1] + 2.0, b => {
            pose('centurion', 'kneel');
            pose('m1', 'kneel'); pose('m3', 'kneel');
            ringFig(b, 'centurion', [255, 236, 200], 2);
          }],
          [L[2] + 0.5, b => {
            crowdWalk('people', 1.02, 1.12, { speed: 0.016 });
            priWalk(1.0, 1.1, { speed: 0.016 });
            sfx(b, 'weep', { soft: true, far: true });
          }],
          [L[2] + 5.5, b => {
            uncrowd('people'); priRm();
            pose('mary', 'stand'); pose('john', 'stand'); pose('magdalene', 'stand'); crowdPose('galilee', 'stand');
          }],
        ]);
      },
    },
    // ── 13 · 安葬：「若是死了，就结出许多子粒来」（太 27:57–60；约 12:23–24）──
    {
      kind: 'promise', utter: '若是死了，就结出许多子粒来', cmd: 'lay 身体 --in 新坟墓 && roll 大石头', ref: '约翰福音 12:24', tint: [240, 228, 204],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        const d = () => doorF();
        // 从各各他脚下到墓门：约五秒走到（手机上也一样快）
        const toDoor = (id, x0, x1) => walk(id, x1, { speed: Math.max(0.006, Math.abs(x1 - x0) / 5.4), pose: 'carry' });
        T(c, [
          [0, b => {
            S.place = 'garden';
            W.goTo(0.74, 18, b.instant);
            W.set('gloom', 0, b.instant); W.set('storm', 0.1, b.instant); W.set('clouds', 0.45, b.instant);
            W.set('crSow', 0.22, b.instant);          // 园子里先亮起几点：一粒麦子
            W.setPop('bird', 8, W.w * 0.7, W.h * 0.3, b.instant);
            // 百夫长与兵丁离去；约翰接马利亚到自己家里去；抹大拉的马利亚留下
            walk('centurion', 1.04, { speed: 0.02 });
            rm('m1'); rm('m2'); rm('m3');
            uncrowd('galilee');
            walk('mary', 1.05, { speed: 0.018 });
            walk('john', 1.07, { speed: 0.018 });
            walk('magdalene', px('magSit'), { speed: 0.01 });
            face('magdalene', 1);
          }],
          [0.8, b => {
            add('omary', { label: '那个马利亚', sex: 'f', age: 'adult', x: px('omSit'), v: pv('om'), facing: 1, robe: ROBE.omary, accent: [226, 214, 196], hair: 'veil', glow: 0.16, from: from(b) });
            const T0 = tombGeo();
            if (!b.instant) fxAdd({ type: 'pulse', x: T0.dx - 0.3 * T0.ph, y: fieldY(T0.dx / W.w, 0.2), r: T0.ph * 1.2, dur: 2.4 });
          }],
          // 「求耶稣的身体；彼拉多就吩咐给他」：身体从十字架上取下；约瑟与尼哥德慕在各各他脚下，抬着裹好的细麻布
          [L[0] + 3.4, b => { W.set('crBodies', 0, b.instant); }],
          [L[0] + 4.6, b => {
            S.bundle = 'carried';
            add('joseph', { label: '亚利马太人约瑟', sex: 'm', age: 'elder', x: px('josApp'), v: pv('jos'), facing: -1, robe: ROBE.joseph, accent: ROBE.josAcc, glow: 0.2, prop: null, pose: 'carry', from: from(b) });
            add('nico', { label: '尼哥德慕', sex: 'm', age: 'elder', x: px('nicApp'), v: pv('jos'), facing: -1, robe: ROBE.nico, accent: ROBE.nicAcc, glow: 0.18, prop: null, pose: 'carry', from: from(b) });
            W.set('crBundle', 1, b.instant);
          }],
          [L[1], b => { rm('centurion'); rm('mary'); rm('john'); }],
          // 「约瑟取了身体，用干净细麻布裹好，安放在…新坟墓里」：抬到墓门
          [L[1] + 0.2, b => {
            toDoor('joseph', px('josApp'), d() + 0.014);
            toDoor('nico', px('nicApp'), d() + 0.037);
          }],
          [L[1] + 5.9, b => { S.bundle = 'laid'; W.set('crBundle', 0, b.instant); pose('joseph', 'bow'); pose('nico', 'bow'); }],
          [L[1] + 7.1, b => {
            S.stone = true;
            W.set('crStone', 1, b.instant);
            walk('joseph', d() + 0.03, { speed: 0.004, pose: 'stand' });
            pose('nico', 'stand');
            sfx(b, 'collapse', { soft: true });
          }],
          // 「一粒麦子不落在地里死了……若是死了，就结出许多子粒来」：封了的坟墓前，园子里的金光一粒一粒多起来
          [L[2] + 1.0, b => {
            W.set('crSow', 1, b.instant);
            const T0 = tombGeo();
            if (!b.instant) fxAdd({ type: 'pulse', x: T0.dx, y: fieldY(T0.dx / W.w, 0.2), r: T0.ph * 2, dur: 3 });
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 1.6, b => { walk('joseph', 1.04, { speed: 0.02 }); walk('nico', 1.05, { speed: 0.02 }); }],
          [L[2] + 5.0, b => { const T0 = tombGeo(); if (!b.instant) fxAdd({ type: 'pulse', x: T0.dx - 0.6 * T0.ph, y: fieldY(T0.dx / W.w, 0.3), r: T0.ph * 2.4, dur: 3 }); }],
        ]);
      },
    },
    // ── 14 · 安息；封了石头；「你们拆毁这殿，我三日内要再建立起来」（太 27:61–66；约 2:19–21）──
    {
      kind: 'promise', utter: '你们拆毁这殿，我三日内要再建立起来', cmd: 'seal 坟墓 && raise 殿 --in 3d  # 以他的身体为殿', ref: '约翰福音 2:19', tint: [226, 222, 244],
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            S.place = 'tomb';
            W.goTo(0.78, 10, b.instant);
            rm('joseph'); rm('nico');
            W.set('crSow', 0.3, b.instant);
            walk('magdalene', px('magSit'), { speed: 0.01, pose: 'sit' });
            walk('omary', px('omSit'), { speed: 0.01, pose: 'sit' });
            face('magdalene', 1); face('omary', 1);
          }],
          // 话一出口：殿里裂开的幔子后，至圣所的光轻轻一亮
          [0.5, b => {
            W.set('crHoly', 1.15, b.instant);
            const TG = temGeo(PH(2));
            if (!b.instant) fxAdd({ type: 'pulse', x: TG.cx, y: TG.base - TG.dh * 0.5, r: TG.dh * 1.4, dur: 3 });
            sfx(b, 'chime', { soft: true, far: true });
          }],
          [L[1] + 0.8, b => {
            // 她们回去，在安息日安息（安息日的灯）
            walk('magdalene', 1.05, { speed: 0.018 });
            walk('omary', 1.07, { speed: 0.018 });
            W.set('crLamps', 1, b.instant);
            W.set('clouds', 0.2, b.instant);
          }],
          [L[1] + 4.2, b => {
            W.goTo(0.86, 12, b.instant);
            const d = doorF(), ph = PH(2);
            add('guard1', { label: '看守的兵', sex: 'm', age: 'adult', x: px('gate') + 0.05, v: pv('gu1'), facing: -1, robe: ROBE.guard, accent: ROBE.solAcc, prop: 'torch', glow: 0.1, from: from(b) });
            add('guard2', { label: '看守的兵', sex: 'm', age: 'adult', x: px('gate') + 0.072, v: pv('gu2'), facing: -1, robe: ROBE.guard, accent: ROBE.solAcc, prop: 'spear', glow: 0.1, from: from(b) });
            walk('guard1', d + (0.78 * ph * BK()) / W.w, { speed: 0.012 });
            walk('guard2', d + (1.55 * ph * BK()) / W.w, { speed: 0.012 });
          }],
          [L[2], b => { rm('magdalene'); rm('omary'); }],
          [L[2] + 2.4, b => {
            S.sealed = true;
            W.set('crSeal', 1, b.instant);
            sfx(b, 'seal');
            face('guard1', 1); face('guard2', 1);
          }],
          // 「你们拆毁这殿，我三日内要再建立起来……但耶稣这话是以他的身体为殿」：一道弧光从裂开的幔子落到封了的石头上
          [L[3] + 0.6, b => {
            if (!b.instant) fxAdd({ type: 'arc', dur: 6.5 });
            sfx(b, 'harp', { soft: true, far: true });
          }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '十字架', sub: '马太福音 27 · 路加福音 23 · 约翰福音 18 — 19', tint: [210, 200, 212], music: 'lamentations',
    intro: INTRO,
    outro: 24,
    behold: {
      '耶稣': { text: '耶稣尝了那醋，就说：「成了！」便低下头，将灵魂交付神了。', ref: '约翰福音 19:30' },
      '十字架': { text: '我若从地上被举起来，就要吸引万人来归我。', ref: '约翰福音 12:32' },
      '各各他': { text: '他们就把耶稣带了去。耶稣背着自己的十字架出来，到了一个地方，名叫「髑髅地」，希伯来话叫各各他。', ref: '约翰福音 19:17' },
      '殿里的幔子': { text: '忽然，殿里的幔子从上到下裂为两半，地也震动，磐石也崩裂……', ref: '马太福音 27:51' },
      '裂开的幔子': { text: '是藉着他给我们开了一条又新又活的路，从幔子经过，这幔子就是他的身体。', ref: '希伯来书 10:20' },
      '圣殿': { text: '耶稣回答说：「你们拆毁这殿，我三日内要再建立起来。」', ref: '约翰福音 2:19' },
      '衙门': { text: '众人将耶稣从该亚法那里往衙门内解去，那时天还早。', ref: '约翰福音 18:28' },
      '铺华石处': { text: '彼拉多听见这话，就带耶稣出来，到了一个地方，名叫「铺华石处」，希伯来话叫厄巴大，就在那里坐堂。', ref: '约翰福音 19:13' },
      '城门': { text: '他们出来的时候，遇见一个古利奈人，名叫西门，就勉强他同去，好背着耶稣的十字架。', ref: '马太福音 27:32' },
      '新坟墓': { text: '在耶稣钉十字架的地方有一个园子，园子里有一座新坟墓，是从来没有葬过人的。', ref: '约翰福音 19:41' },
      '大石头': { text: '他们就带着看守的兵同去，封了石头，将坟墓把守妥当。', ref: '马太福音 27:66' },
      '园子': { text: '只因是犹太人的预备日，又因那坟墓近，他们就把耶稣安放在那里。', ref: '约翰福音 19:42' },
      '耶路撒冷': { text: '耶路撒冷啊！耶路撒冷啊！……我多次愿意聚集你的儿女，好像母鸡把小鸡聚集在翅膀底下；只是你们不愿意。', ref: '路加福音 13:34' },
      '彼拉多': { text: '彼拉多说：「真理是什么呢？」', ref: '约翰福音 18:38' },
      '巴拉巴': { text: '这巴拉巴是因在城里作乱杀人，下在监里的。', ref: '路加福音 23:19' },
      '兵丁': { text: '……这要应验经上的话说：他们分了我的外衣，为我的里衣拈阄。兵丁果然做了这事。', ref: '约翰福音 19:24' },
      '祭司长和长老': { text: '到了早晨，众祭司长和民间的长老大家商议要治死耶稣，', ref: '马太福音 27:1' },
      '众人': { text: '聚集观看的众人见了这所成的事都捶着胸回去了。', ref: '路加福音 23:48' },
      '古利奈人西门': { text: '有一个古利奈人西门，就是亚历山大和鲁孚的父亲，从乡下来，经过那地方，他们就勉强他同去，好背着耶稣的十字架。', ref: '马可福音 15:21' },
      '耶路撒冷的女子': { text: '耶稣转身对她们说：「耶路撒冷的女子，不要为我哭，当为自己和自己的儿女哭。」', ref: '路加福音 23:28' },
      '马利亚': { text: '耶稣见母亲和他所爱的那门徒站在旁边，就对他母亲说：「母亲，看，你的儿子！」', ref: '约翰福音 19:26' },
      '约翰': { text: '又对那门徒说：「看，你的母亲！」从此，那门徒就接她到自己家里去了。', ref: '约翰福音 19:27' },
      '抹大拉的马利亚': { text: '有抹大拉的马利亚和那个马利亚在那里，对着坟墓坐着。', ref: '马太福音 27:61' },
      '那个马利亚': { text: '她们就回去，预备了香料香膏。她们在安息日，便遵着诫命安息了。', ref: '路加福音 23:56' },
      '从加利利跟随的妇女': { text: '有好些妇女在那里，远远地观看；她们是从加利利跟随耶稣来服事他的。', ref: '马太福音 27:55' },
      '百夫长': { text: '百夫长看见所成的事，就归荣耀与神，说：「这真是个义人！」', ref: '路加福音 23:47' },
      '亚利马太人约瑟': { text: '有一个人名叫约瑟，是个议士，为人善良公义；众人所谋所为，他并没有附从。', ref: '路加福音 23:50–51' },
      '尼哥德慕': { text: '又有尼哥德慕，就是先前夜里去见耶稣的，带着没药和沉香约有一百斤前来。', ref: '约翰福音 19:39' },
      '看守的兵': { text: '彼拉多说：「你们有看守的兵，去吧！尽你们所能的把守妥当。」', ref: '马太福音 27:65' },
    },
    setup, stages: STAGES, scene: SCENE,
  });
})(window.GS);
