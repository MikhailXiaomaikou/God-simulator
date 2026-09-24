/* ─────────────────────────────────────────────────────────────
 * book/nehemiah.js —— 尼希米记 · 城墙（尼希米记 1 — 13）
 *
 * 书珊城的宫（1—2）：黄昏，高台上的柱廊、琉璃砖的蓝带与金色的花饰。哈拿尼从犹大来：
 * 「耶路撒冷的城墙拆毁，城门被火焚烧」——尼希米坐下哭泣，夜里向西跪祷；
 * 「我也必从那里将他们招聚回来」：散在天涯的点点微光从海上、山上、天边升起，
 * 缓缓聚向远山上那座城的影子。尼散月，王前摆酒——「你要求什么？」默祷的一线光；
 * 「因我神施恩的手帮助我」：一道暖光落在他身上；军长护送，驼着木料，向着西边的落日去了。
 * 夜里，书珊的宫隐去，耶路撒冷的废墟在月光下显出（2:11）：断墙、瓦砾、烧黑的城门。
 * 尼希米骑着牲口出谷门，到粪厂门、泉门，牲口没有地方过去，沿溪回来（2:13–15）。
 * 「我们起来建造吧！」——各家各段修造，门的名字一个个亮在墙上（3）；参巴拉、多比雅嗤笑；
 * 「我们的神必为我们争战」：城墙高至一半，敌营的火在城外，修造的人一手做工一手拿兵器，
 * 吹角的人在尼希米旁边，从天亮直到星宿出现（4）。「阿们」——豁免（5）；「我现在办理大工，
 * 不能下去」；日子飞逝，五十二天，城墙修完，全墙一道金边（6）。安门扇，派守门的；
 * 城大民少，房屋未建；家谱的名字升起，远山上各城的灯（7）。
 * 水门前的宽阔处：以斯拉站在木台上展开律法书，光从书卷上发出，众民站起、举手「阿们」、
 * 面伏于地（8:1–6）；「因靠耶和华而得的喜乐是你们的力量」——房顶上、院内、水门前，
 * 青翠的棚一座座搭起，夜里棚中点灯（8:9–17）。禁食、麻衣、灰尘；「你，惟独你是耶和华」，
 * 满天星斗；远山上火柱的回影——「在旷野不丢弃他们」；立约签名，印一个个盖上（9—10）。
 * 十人中一人住进「圣城」，房屋建起，窗里有灯（11）。
 * ★ 告成之礼（12:27–43，本卷的签名）：称谢的人分为两大队，从谷门上城，一队向右、一队向左，
 *   沿着城墙绕城而行，金色的光随着他们描出整座城的轮廓，两队在神的殿里相遇；献大祭，
 *   欢声一圈一圈传到远处，连海上、远山都听见。
 * 多比雅的家具被抛出殿院，库房洁净；安息日的前一日，城门有黑影的时候关门上锁，
 * 推罗的商人住在城外；利未人持灯守门——「我的神啊，求你记念我，施恩与我」（13）。
 *
 * 画面的方位：近地右半 = 书珊的宫（前两句话），其后同一处化为耶路撒冷：一座山城，
 *            前墙沿着地的轮廓线（水门在左，谷门居中，粪厂门、泉门在右），两侧的墙顺着山坡上去，
 *            后墙在山脊上（羊门、鱼门、哈楠业楼），神的殿在山顶正中；城里是一层层的房屋。
 *            水门前的宽阔处在城的左前方；敌营在更左的地上。经文在左边的海上，故事都在右半边。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'nehemiah';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('neSusa', 'exp', 0.9);      // 书珊的宫
  W.defineLevel('neJeru', 'exp', 0.9);      // 耶路撒冷（山城、城墙、房屋、殿）
  W.defineLevel('neVision', 'exp', 0.35);   // 远山上那城的影子（1:9 我所选择立为我名的居所）
  W.defineLevel('neGather', 'lin', 0.075);  // 散在天涯的微光聚回（1:9）
  W.defineLevel('neHand', 'exp', 0.6);      // 神施恩的手：落在尼希米身上的暖光（2:8；13:31）
  W.defineLevel('nePray', 'exp', 0.9);      // 默祷天上的神（2:4）：一线上升的光
  W.defineLevel('neWall', 'lin', 0.03);     // 城墙的修造（0 拆毁 → 0.5 高至一半 → 1 修完）
  W.defineLevel('neGlow', 'exp', 0.5);      // 城墙修完时全墙的金边（6:16）
  W.defineLevel('neDoors', 'exp', 0.5);     // 安了门扇（7:1）
  W.defineLevel('neShut', 'exp', 0.5);      // 关门上闩（7:3；13:19）
  W.defineLevel('neHouses', 'lin', 0.05);   // 城里的房屋建起（7:4 → 11:1）
  W.defineLevel('neLamps', 'exp', 0.4);     // 夜里窗中的灯（住的人多少）
  W.defineLevel('neBooths', 'lin', 0.08);   // 房顶上、院内、水门前的棚（8:16）
  W.defineLevel('neFoe', 'exp', 0.4);       // 城外敌营的火（4:7–8）
  W.defineLevel('nePulpit', 'exp', 0.8);    // 为这事特备的木台（8:4）
  W.defineLevel('neScroll', 'exp', 0.7);    // 律法书展开，发出光（8:5）
  W.defineLevel('nePillar', 'exp', 0.35);   // 火柱的回影（9:19）
  W.defineLevel('neCovenant', 'lin', 0.15); // 立约，签名、盖印（9:38）
  W.defineLevel('neVillage', 'exp', 0.3);   // 各住在自己的城里：远山上各城的灯（7:73）
  W.defineLevel('neChoir', 'lin', 0.075);   // 两大队称谢的人绕城而行（12:31–40）
  W.defineLevel('neJoy', 'exp', 0.5);       // 欢声听到远处（12:43）
  W.defineLevel('neAltar', 'exp', 0.5);     // 殿中坛上的火（献大祭）
  W.defineLevel('neHoly', 'exp', 0.45);     // 圣城的金光（11:1）
  W.defineLevel('neSack', 'exp', 0.5);      // 麻衣、灰尘（9:1）
  W.defineLevel('neClean', 'exp', 0.4);     // 库房洁净，乳香的烟（13:9）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  // 山城：HX0..HX1 是山；前墙 FL..FR 沿地的轮廓线；后墙 CL..CR 在山脊上；殿在 TX（山顶正中）
  const C = { HX0: 0.528, HX1: 0.994, FL: 0.562, FR: 0.962, CL: 0.592, CR: 0.934, TX: 0.762, THW: 0.047 };
  const X = {
    // 书珊
    palace0: 0.585, palace1: 0.965, throne: 0.842, queen: 0.878, nehS: 0.7, cup: 0.8,
    // 耶路撒冷
    valley: 0.762, dung: 0.868, fount: 0.931, water: 0.607, square: 0.56, pulpit: 0.64,
    foe0: 0.43, foe1: 0.5,
  };
  const ROBE = {
    neh: [74, 92, 150], hanani: [128, 110, 88], king: [118, 58, 112], queen: [150, 74, 104], guard: [96, 84, 110],
    captain: [110, 82, 70], ezra: [236, 232, 214], levite: [226, 220, 200], priest: [240, 236, 222],
    sanb: [80, 66, 72], tobiah: [98, 78, 60], geshem: [150, 110, 70], sack: [92, 80, 66], tyre: [118, 64, 104], noble: [148, 104, 120],
  };
  const LIME = [206, 186, 148], LIME2 = [190, 170, 134], CHAR = [70, 58, 48], GOLD = [236, 198, 108], BLUE = [44, 84, 150];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { cup: false, letter: false, throne: false, horn: false, choir: false, done: false, tossed: false, keepLamps: false };
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const phone = () => W.w < 600;
  const LS = l => W.layerScale(l) * (phone() ? 1.15 : 1);
  const PH = l => 34 * W.layerScale(l) * (phone() ? 1.4 : 1) * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  // 月光下的石灰石：夜里亮的石色向一种冷的灰蓝靠拢（暗处仍暗），城在月下看得见
  const moonK = () => W.night * Math.min(1, W.lv.moon) * clamp(W.moon.elev * 1.6 + 0.35, 0.25, 1);
  function shadeM(rgb, d, ex) {
    const c = W.shade(rgb, d, ex), mk = moonK() * 0.55;
    if (mk > 0.01 && rgb[0] + rgb[1] + rgb[2] > 330) {
      c[0] = lerp(c[0], rgb[0] * 0.3 + 14, mk); c[1] = lerp(c[1], rgb[1] * 0.34 + 18, mk); c[2] = lerp(c[2], rgb[2] * 0.44 + 36, mk);
    }
    return c;
  }
  const cssD = (rgb, d, a, ex) => { const c = shadeM(rgb, d, ex); return a == null ? U.rgb(c[0], c[1], c[2]) : U.rgba(c[0], c[1], c[2], a); };
  const css = (rgb, l, a, ex) => cssD(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const moonEx = () => 0.25 * W.night * Math.min(1, W.lv.moon) * clamp(W.moon.elev * 1.6 + 0.35, 0.3, 1);   // 月光照在石灰石上
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const easeIO = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(1613); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const CA = () => cast();
  const fig = id => { const c = CA(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = CA(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return CA().add(id, o); }
  function walk(id, x, o) { if (fig(id)) CA().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) CA().pose(id, p, o); }
  function face(id, d) { if (fig(id)) CA().face(id, d); }
  function rm(id, now) { if (fig(id)) CA().remove(id, now ? { fade: false } : undefined); }
  function propOf(id, k) { if (fig(id)) CA().prop(id, k); }
  function attach(id, fn) { const c = CA(); if (c.attach && fig(id)) c.attach(id, fn); }
  function ride(id, m) { const c = CA(); if (c.ride && fig(id)) c.ride(id, m); }
  function animal(id, kind, x, o) { const c = CA(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function crowd(gid, o) { const c = CA(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) CA().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) CA().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) CA().removeCrowd(gid, now ? { fade: false } : undefined); }
  function members(gid) { const c = CA(); const g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null; return g ? g.members : []; }
  function crowdFace(gid, d) { members(gid).forEach(m => { m.facing = d === 1 || d === -1 ? d : (d > m.nx ? 1 : -1); if (W.replaying) m.fd = m.facing; }); }
  function crowdProp(gid, k) { members(gid).forEach(m => { m.prop = k; m.propDefault = false; }); }
  function crowdRobe(gid, rgb) { members(gid).forEach((m, i) => { m.robe = rgb ? U.mixRGB(rgb, [rgb[0] * 0.8, rgb[1] * 0.8, rgb[2] * 0.8], (i % 3) / 3) : m.robe0 || m.robe; m.robeSet = true; }); }
  function crowdAttach(gid, fnOf) { members(gid).forEach((m, j) => { m.attach = fnOf ? fnOf(j, m) : null; if (!fnOf) m._ax = null; }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  const fromOf = b => (b.instant ? 'none' : 'fade');
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
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (f.isAnimal ? 0.6 : 1) * frac];
    const l = f.layer == null ? 2 : f.layer;
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f._ax != null && f.attach ? f._ay : f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    return [x, y - PH(l) * (f.age === 'elder' ? 0.96 : 1) * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某处聚成一个名字（微尘自 src 而来）
  function nameHere(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const size = (o.size || 0.03) * M() * (phone() ? 1.25 : 1), n = Array.from(str).length;
    const c = nameAt(x, y - size * 0.9, size, n);
    const src = o.src || (() => [x + U.rand(-50, 50) * SU(), y + U.rand(-10, 30) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, src, { hold: o.hold || 2.6, delay: o.delay });
    const a = au();
    if (a && a.nameChime && !o.quiet) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  function ringAt(b, x, y, rgb, r, dur, w) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, w || 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function dustAt(b, x, y, n, rgb, spread) { if (!b.instant && fx()) fx().dust(x, y, n || 20, rgb || [214, 184, 140], spread || 14, 'near'); }

  // ── 装饰性的补间（只关乎画面；瞬间重演时不存在）───────────────
  const TW = {};
  function tween(b, name, v0, v1, dur) { if (b.instant) { delete TW[name]; return; } TW[name] = { v0, v1, t0: W.t, dur: Math.max(0.05, dur / (W.fast || 1)) }; }
  function tv(name, def) {
    const q = TW[name];
    if (!q) return def;
    return lerp(q.v0, q.v1, clamp((W.t - q.t0) / q.dur, 0, 1));
  }
  const tweening = name => { const q = TW[name]; return !!q && W.t - q.t0 < q.dur; };

  // ── 精灵图（离屏预绘的柔光）──────────────────────────────────
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
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
      pale: radial([226, 240, 255], 1), smoke: radial([120, 112, 106], 0.8, 0.55), ember: radial([255, 120, 50], 1, 0.4),
      dust: radial([178, 150, 116], 0.85, 0.55), incense: radial([226, 220, 210], 0.7, 0.5),
    };
    // 自天而降的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,236,196,0)'); hz.addColorStop(0.5, 'rgba(255,242,214,1)'); hz.addColorStop(1, 'rgba(255,236,196,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.04)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 火柱（下亮上淡）
    const f = cnv(64, 256), h = f.getContext('2d');
    const fz = h.createLinearGradient(0, 0, 64, 0);
    fz.addColorStop(0, 'rgba(255,150,60,0)'); fz.addColorStop(0.3, 'rgba(255,170,80,0.55)'); fz.addColorStop(0.5, 'rgba(255,236,190,1)');
    fz.addColorStop(0.7, 'rgba(255,170,80,0.55)'); fz.addColorStop(1, 'rgba(255,150,60,0)');
    h.fillStyle = fz; h.fillRect(0, 0, 64, 256);
    h.globalCompositeOperation = 'destination-in';
    const fv = h.createLinearGradient(0, 0, 0, 256);
    fv.addColorStop(0, 'rgba(0,0,0,0)'); fv.addColorStop(0.35, 'rgba(0,0,0,0.5)'); fv.addColorStop(0.92, 'rgba(0,0,0,1)'); fv.addColorStop(1, 'rgba(0,0,0,0.3)');
    h.fillStyle = fv; h.fillRect(0, 0, 64, 256);
    SP.pillar = f;
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }

  // ── 火、烟、灯 ────────────────────────────────────────────────
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    const a0 = ctx.globalAlpha;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
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
    ctx.globalAlpha = a0;
  }
  function smoke(ctx, x, y, k, H, w, seed, sp) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 10, day = 0.3 + 0.7 * W.daylight, a0 = ctx.globalAlpha;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.35) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.8);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.4 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(sp || SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = a0;
  }
  function lamp(ctx, x, y, r, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  山城的几何（随屏幕尺寸重算；地形的「全然升起」之形）
  // ════════════════════════════════════════════════════════════
  let GC = null;
  const HN = 72;
  function geo() {
    const key = W.w + 'x' + W.h + ':' + Math.round(gY(2, 0.8)) + ':' + Math.round(gY(2, 0.6));   // 地此刻的高低（恢复存档时地可能尚未升起）
    if (GC && GC.key === key) return GC;
    const ph = PH(2), s = LS(2);
    const G = { key, ph, s, gro: new Float32Array(HN + 1), cre: new Float32Array(HN + 1) };
    for (let i = 0; i <= HN; i++) G.gro[i] = gY(2, lerp(C.HX0, C.HX1, i / HN)) + 1;
    const g = xf => sampleArr(G, G.gro, xf);
    const gL = g(C.FL), gR = g(C.FR);
    const HH = 2.72 * ph;
    const crestC = xf => {
      const u = (xf - C.CL) / (C.CR - C.CL);
      const base = lerp(gL, gR, clamp((xf - C.FL) / (C.FR - C.FL), 0, 1));
      const bump = Math.exp(-Math.pow((xf - C.TX) / 0.05, 2));
      return base - HH * (0.86 + 0.14 * clamp(u, 0, 1) + 0.09 * bump + 0.03 * Math.sin(u * 7.3 + 0.6));
    };
    for (let i = 0; i <= HN; i++) {
      const xf = lerp(C.HX0, C.HX1, i / HN), gr = G.gro[i];
      let y;
      if (xf <= C.FL) y = gr - 0.12 * ph * smoothstep(C.HX0, C.FL, xf);
      else if (xf < C.CL) { const k = (xf - C.FL) / (C.CL - C.FL); y = lerp(gL - 0.12 * ph, crestC(C.CL), Math.sin(k * Math.PI / 2)); }
      else if (xf <= C.CR) y = crestC(xf);
      else if (xf < C.FR) { const k = (C.FR - xf) / (C.FR - C.CR); y = lerp(gR - 0.12 * ph, crestC(C.CR), Math.sin(k * Math.PI / 2)); }
      else y = gr - 0.12 * ph * smoothstep(C.HX1, C.FR, xf);
      G.cre[i] = Math.min(gr, y);
    }
    G.g = g;
    G.c = xf => sampleArr(G, G.cre, xf);
    G.WH = 1.28 * ph; G.WT = 1.62 * ph; G.WG = 1.46 * ph; G.WHc = 0.72 * ph; G.WTc = 0.95 * ph;
    G.plat = G.c(C.TX) - 0.2 * ph;                 // 殿的台（摩利亚山顶）
    // ── 前墙：13 段 ──
    const r = U.mulberry32(5213);
    const NF = 13, F = [];
    const KIND = { 0: ['tower', ''], 1: ['gate', '水门'], 3: ['tower', '炉楼'], 6: ['gate', '谷门'], 9: ['gate', '粪厂门'], 11: ['gate', '泉门'], 12: ['tower', ''] };
    for (let i = 0; i < NF; i++) {
      const xa = lerp(C.FL, C.FR, i / NF), xb = lerp(C.FL, C.FR, (i + 1) / NF);
      const kk = KIND[i] || ['wall', ''];
      const breach = kk[0] === 'wall' && r() < 0.3;
      F.push({ i, row: 'front', xa, xb, kind: kk[0], name: kk[1], hb: breach ? 0.04 + 0.06 * r() : kk[0] === 'gate' ? 0.3 + 0.1 * r() : 0.14 + 0.36 * r(),
        d: r() * 0.34, j: [r(), r(), r(), r(), r()], rub: [r(), r(), r(), r()] });
    }
    G.front = F;
    // ── 后墙（山脊）：殿的左右各 4 段 ──
    const CRS = [];
    const KL = { 0: ['tower', ''], 3: ['gate', '羊门'] }, KR = { 1: ['gate', '鱼门'], 2: ['tower', '哈楠业楼'], 3: ['tower', ''] };
    for (let i = 0; i < 4; i++) {
      const xa = lerp(C.CL, C.TX - C.THW, i / 4), xb = lerp(C.CL, C.TX - C.THW, (i + 1) / 4), kk = KL[i] || ['wall', ''];
      CRS.push({ i, row: 'crest', xa, xb, kind: kk[0], name: kk[1], hb: 0.1 + 0.4 * r(), d: r() * 0.3, j: [r(), r(), r(), r(), r()], rub: [r(), r(), r(), r()] });
    }
    for (let i = 0; i < 4; i++) {
      const xa = lerp(C.TX + C.THW, C.CR, i / 4), xb = lerp(C.TX + C.THW, C.CR, (i + 1) / 4), kk = KR[i] || ['wall', ''];
      CRS.push({ i: i + 4, row: 'crest', xa, xb, kind: kk[0], name: kk[1], hb: 0.1 + 0.4 * r(), d: r() * 0.3, j: [r(), r(), r(), r(), r()], rub: [r(), r(), r(), r()] });
    }
    G.crest = CRS;
    // ── 两侧顺着山坡上去的墙 ──
    G.side = [];
    for (const [x0, x1] of [[C.FL, C.CL], [C.FR, C.CR]]) {
      for (let k = 0; k < 2; k++) {
        const xa = lerp(x0, x1, k / 2), xb = lerp(x0, x1, (k + 1) / 2);
        G.side.push({ row: 'side', xa: Math.min(xa, xb), xb: Math.max(xa, xb), kind: 'wall', name: '', hb: 0.12 + 0.3 * r(), d: r() * 0.3, j: [r(), r(), r(), r(), r()], rub: [r(), r(), r(), r()], lo: x0, hi: x1 });
      }
    }
    // ── 城里的房屋：三排（后排贴着山脊，前排从前墙后探出屋顶）──
    const H = [];
    const rowY = [2.24, 1.76, 1.3];
    let n = 0;
    for (let row = 0; row < 3; row++) {
      let x = C.CL + 0.012 + r() * 0.01;
      while (x < C.CR - 0.012) {
        const w = (0.62 + 0.42 * r()) * ph / W.w;
        const inTemple = row === 0 && Math.abs(x - C.TX) < C.THW + 0.01;
        const inTemple1 = row === 1 && Math.abs(x - C.TX) < C.THW * 0.55;
        if (!inTemple && !inTemple1) {
          H.push({ x, w, row, base: rowY[row] - 0.05 * r(), h: (0.5 + 0.42 * r()) * (r() < 0.14 ? 1.45 : 1), ruinH: 0.16 + 0.26 * r(),
            th: r() * 0.92, win: r(), win2: r(), booth: r(), lampT: r(), tw: r() * 6, j: [r(), r(), r()], shade: r() });
          n++;
        }
        x += w + (0.12 + 0.35 * r()) * ph / W.w;
      }
    }
    // 越后排越先画
    G.houses = H;
    GC = G;
    return G;
  }
  function sampleArr(G, arr, xf) {
    if (xf <= C.HX0 || xf >= C.HX1) return gY(2, xf) + 1;
    const f = (xf - C.HX0) / (C.HX1 - C.HX0) * HN, i = Math.min(HN - 1, Math.floor(f)), k = f - i;
    return arr[i] + (arr[i + 1] - arr[i]) * k;
  }
  // 一段墙此刻的高度比例（修造的进度 w；各段各家各有先后）
  function segFrac(sg, w) {
    if (w == null) w = W.lv.neWall;
    const k = clamp(w * 1.36 - sg.d, 0, 1);
    return Math.max(sg.hb, k);
  }
  function segFull(G, sg) {
    if (sg.row === 'front') return sg.kind === 'tower' ? G.WT : sg.kind === 'gate' ? G.WG : G.WH;
    if (sg.row === 'crest') return sg.kind === 'tower' ? G.WTc : sg.kind === 'gate' ? G.WTc * 0.92 : G.WHc;
    return lerp(G.WH, G.WHc, 0.5) * 0.92;
  }
  // 墙脚（像素）
  function segBase(G, sg, xf) {
    if (sg.row === 'front') return G.g(xf);
    if (sg.row === 'crest') return G.c(xf) + 1;
    return G.c(xf) + 2;
  }
  // 前墙墙顶（像素）：修造的人、称谢的人站在上面
  function frontTop(xf, w) {
    const G = geo(), F = G.front;
    const i = clamp(Math.floor((xf - C.FL) / (C.FR - C.FL) * F.length), 0, F.length - 1), sg = F[i];
    const fr = segFrac(sg, w);
    return G.g(xf) - segFull(G, sg) * fr * (fr < 0.97 ? 0.9 : 1);
  }
  function crestTop(xf, w) {
    const G = geo();
    let sg = G.crest.find(q => xf >= q.xa && xf <= q.xb);
    if (!sg) return G.plat;
    const fr = segFrac(sg, w);
    return G.c(xf) - segFull(G, sg) * fr * (fr < 0.97 ? 0.9 : 1);
  }

  // ════════════════════════════════════════════════════════════
  //  画：耶路撒冷
  // ════════════════════════════════════════════════════════════
  const NIGHT_EX = () => moonEx() + 0.04 * nightK();
  function drawHill(ctx, G, A) {
    ctx.globalAlpha = A;
    ctx.fillStyle = css([150, 132, 100], 2, 1, NIGHT_EX() * 0.6);
    ctx.beginPath();
    ctx.moveTo(C.HX0 * W.w, G.g(C.HX0) + 3);
    for (let i = 0; i <= HN; i++) ctx.lineTo(lerp(C.HX0, C.HX1, i / HN) * W.w, G.cre[i]);
    ctx.lineTo(C.HX1 * W.w, G.g(C.HX1) + 3);
    for (let i = HN; i >= 0; i--) ctx.lineTo(lerp(C.HX0, C.HX1, i / HN) * W.w, G.gro[i] + 3);
    ctx.closePath(); ctx.fill();
    // 山坡上的台地（几道淡淡的横纹）与橄榄树的暗点
    ctx.strokeStyle = css([112, 98, 76], 2, 0.35);
    ctx.lineWidth = Math.max(0.6, 0.9 * G.s);
    ctx.beginPath();
    for (const k of [0.3, 0.55, 0.8]) {
      for (let i = 0; i <= HN; i++) {
        const xf = lerp(C.HX0, C.HX1, i / HN), y = lerp(G.cre[i], G.gro[i], k);
        if (G.gro[i] - G.cre[i] < 4) { ctx.moveTo(xf * W.w, y); continue; }
        if (i === 0) ctx.moveTo(xf * W.w, y); else ctx.lineTo(xf * W.w, y);
      }
    }
    ctx.stroke();
  }
  // 一段墙：墙身（残缺时顶上参差）、石层、垛口、门洞、门扇、瓦砾
  function drawSeg(ctx, G, sg, depth, A, over) {
    const s = G.s, fr = segFrac(sg), full = segFull(G, sg);
    const tower = sg.kind === 'tower', gate = sg.kind === 'gate';
    const ext = tower ? 0.14 * (sg.xb - sg.xa) : gate ? 0.06 * (sg.xb - sg.xa) : 0;
    const xa = (sg.xa - ext) * W.w, xb = (sg.xb + ext) * W.w;
    const ya = segBase(G, sg, sg.xa - ext), yb = segBase(G, sg, sg.xb + ext);
    const H = full * fr, broken = fr < 0.97, ex = NIGHT_EX() + (over || 0);
    const burnt = clamp(1 - fr * 1.6, 0, 1) * (gate ? 1 : 0.6);
    const col = U.mixRGB(sg.row === 'crest' ? LIME2 : LIME, [150, 128, 100], burnt * 0.5);
    ctx.globalAlpha = A;
    // 墙身
    const top = [];
    const N = 5;
    for (let k = 0; k < N; k++) {
      const u = k / (N - 1), x = lerp(xa, xb, u), b = lerp(ya, yb, u);
      const jag = broken ? (sg.j[k] * 0.7 + 0.15) * (1 - fr) * 0.8 : 0;
      top.push([x, b - H * (1 - jag)]);
    }
    ctx.fillStyle = cssD(col, depth, 1, ex);
    ctx.beginPath();
    ctx.moveTo(xa, ya + 2);
    for (const p of top) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(xb, yb + 2);
    ctx.closePath();
    ctx.fill();
    if (H < 1) return;
    // 背光的一侧（塔与门楼）
    if (tower || gate) {
      const lx = litX() >= (xa + xb) / 2 ? 1 : -1, sw = (xb - xa) * 0.18;
      ctx.fillStyle = cssD([90, 76, 60], depth, 0.3);
      ctx.beginPath();
      if (lx > 0) { ctx.moveTo(xa, ya + 2); ctx.lineTo(top[0][0], top[0][1]); ctx.lineTo(xa + sw, lerp(top[0][1], top[1][1], sw / ((xb - xa) / 4))); ctx.lineTo(xa + sw, lerp(ya, yb, 0.18) + 2); }
      else { ctx.moveTo(xb, yb + 2); ctx.lineTo(top[N - 1][0], top[N - 1][1]); ctx.lineTo(xb - sw, lerp(top[N - 1][1], top[N - 2][1], sw / ((xb - xa) / 4))); ctx.lineTo(xb - sw, lerp(ya, yb, 0.82) + 2); }
      ctx.closePath(); ctx.fill();
    }
    // 石层（淡淡的横缝）
    if (sg.row !== 'crest' && H > full * 0.3 && !phone()) {
      ctx.strokeStyle = cssD([120, 104, 82], depth, 0.22);
      ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath();
      for (const k of [0.28, 0.52, 0.76]) {
        if (k * full > H * 0.92) continue;
        ctx.moveTo(xa, ya - full * k); ctx.lineTo(xb, yb - full * k);
      }
      ctx.stroke();
    }
    // 烧黑的痕迹：残墙的上半
    if (burnt > 0.05) {
      ctx.fillStyle = cssD(CHAR, depth, 0.38 * burnt);
      ctx.beginPath();
      ctx.moveTo(top[0][0], top[0][1]);
      for (const p of top) ctx.lineTo(p[0], p[1]);
      for (let k = N - 1; k >= 0; k--) ctx.lineTo(top[k][0], top[k][1] + H * 0.35);
      ctx.closePath(); ctx.fill();
    }
    // 垛口
    if (!broken) {
      const n = tower ? 3 : gate ? 3 : sg.row === 'crest' ? 3 : 4, mw = (xb - xa) / (n * 2), mh = (sg.row === 'crest' ? 2.4 : 3.4) * s;
      ctx.fillStyle = cssD(col, depth, 1, ex);
      ctx.beginPath();
      for (let k = 0; k < n; k++) {
        const mx = xa + mw * (2 * k + 0.5), my = lerp(ya, yb, (mx - xa) / (xb - xa)) - H;
        ctx.rect(mx, my - mh, mw, mh + 0.5);
      }
      ctx.fill();
    }
    // 迎光的墙头
    ctx.strokeStyle = W.night > 0.5 ? cssD([214, 226, 255], depth, 0.5 * W.night * W.lv.moon * (broken ? 0.7 : 1), 0.5) : cssD([255, 234, 196], depth, 0.4 * dayA() * (broken ? 0.6 : 1), 0.3);
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    ctx.moveTo(top[0][0], top[0][1]);
    for (const p of top) ctx.lineTo(p[0], p[1]);
    ctx.stroke();
    // 门洞
    if (gate) drawGateHole(ctx, G, sg, depth, A, xa, xb, ya, yb, fr, full);
  }
  function drawGateHole(ctx, G, sg, depth, A, xa, xb, ya, yb, fr, full) {
    const s = G.s, gx = (xa + xb) / 2, gw = (xb - xa) * 0.2, gb = (ya + yb) / 2 + 1;
    const gh = Math.min(full * 0.6, full * fr * 0.86);
    if (gh < 2) return;
    const built = smoothstep(0.82, 0.97, fr);
    // 门洞（拱）
    ctx.fillStyle = cssD([22, 18, 14], depth, 1);
    ctx.beginPath();
    if (built > 0.5) {
      ctx.moveTo(gx - gw, gb); ctx.lineTo(gx - gw, gb - gh * 0.72); ctx.quadraticCurveTo(gx, gb - gh * 1.12, gx + gw, gb - gh * 0.72); ctx.lineTo(gx + gw, gb);
    } else {
      // 拆毁的门：参差的缺口
      const j = sg.j;
      ctx.moveTo(gx - gw * 1.2, gb); ctx.lineTo(gx - gw * (1 + 0.2 * j[0]), gb - gh * (0.7 + 0.3 * j[1])); ctx.lineTo(gx - gw * 0.2, gb - gh * (0.85 + 0.2 * j[2]));
      ctx.lineTo(gx + gw * 0.5, gb - gh * (0.6 + 0.3 * j[3])); ctx.lineTo(gx + gw * 1.15, gb - gh * (0.8 + 0.2 * j[4])); ctx.lineTo(gx + gw * 1.2, gb);
    }
    ctx.closePath(); ctx.fill();
    const lvDoor = W.lv.neDoors * built;
    if (built < 0.5) {
      // 被火焚烧的门：烧黑的横梁斜倒在门洞里，余烬早已冷了
      ctx.strokeStyle = cssD([34, 26, 20], depth, 1);
      ctx.lineWidth = Math.max(1.2, 2.2 * s);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gx - gw * 1.05, gb - gh * 0.1); ctx.lineTo(gx + gw * 0.5, gb - gh * 0.62);
      ctx.moveTo(gx - gw * 0.3, gb - 0.5 * s); ctx.lineTo(gx + gw * 1.1, gb - gh * 0.3);
      ctx.stroke();
      ctx.strokeStyle = cssD([120, 70, 40], depth, 0.35);
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(gx - gw * 0.9, gb - gh * 0.16); ctx.lineTo(gx + gw * 0.4, gb - gh * 0.6); ctx.stroke();
      ctx.lineCap = 'butt';
      return;
    }
    if (lvDoor > 0.01) {
      // 门扇：木，包铜；开时折在两旁，关时合拢
      const shut = W.lv.neShut, top = gb - gh * 0.72;
      const leaf = gw * lerp(0.28, 1, shut);
      ctx.globalAlpha = A * lvDoor;
      ctx.fillStyle = cssD([118, 84, 54], depth, 1, NIGHT_EX() * 0.5);
      ctx.beginPath();
      ctx.rect(gx - gw, top, leaf, gb - top);
      ctx.rect(gx + gw - leaf, top, leaf, gb - top);
      if (shut > 0.6) { ctx.moveTo(gx - gw, top); ctx.quadraticCurveTo(gx, gb - gh * 1.12, gx + gw, top); ctx.closePath(); }
      ctx.fill();
      ctx.strokeStyle = cssD([200, 162, 90], depth, 0.75, 0.1);
      ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      for (const k of [0.3, 0.65]) { const y = lerp(top, gb, k); ctx.moveTo(gx - gw, y); ctx.lineTo(gx - gw + leaf, y); ctx.moveTo(gx + gw - leaf, y); ctx.lineTo(gx + gw, y); }
      if (shut > 0.9) { ctx.moveTo(gx, top - gh * 0.1); ctx.lineTo(gx, gb); }
      ctx.stroke();
      ctx.globalAlpha = A;
    }
  }
  function drawRubble(ctx, G, sg, A) {
    const fr = segFrac(sg), k = 1 - fr;
    if (k < 0.05) return;
    const s = G.s, xa = sg.xa * W.w, xb = sg.xb * W.w;
    const rw = (xb - xa) * 0.3, rh = G.ph * 0.2 * k;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([150, 132, 104], 2, 1, NIGHT_EX());
    ctx.beginPath();
    for (let q = 0; q < 4; q++) {
      const rx = lerp(xa, xb, 0.1 + 0.8 * sg.rub[q]), ry = segBase(G, sg, rx / W.w) + 2 * s + (sg.row === 'front' ? 1.5 * s * sg.rub[(q + 1) % 4] : 0);
      const r1 = rw * (0.5 + 0.6 * sg.rub[(q + 2) % 4]) * (0.5 + 0.5 * k), r2 = rh * (0.6 + 0.5 * sg.rub[(q + 3) % 4]);
      ctx.moveTo(rx + r1, ry); ctx.ellipse(rx, ry, r1, r2, 0, Math.PI, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([226, 210, 176], 2, 0.3 * dayA() * k + 0.15 * W.night * W.lv.moon, 0.15);
    ctx.beginPath();
    for (let q = 0; q < 4; q += 2) {
      const rx = lerp(xa, xb, 0.1 + 0.8 * sg.rub[q]), ry = segBase(G, sg, rx / W.w) - rh * 0.4;
      ctx.moveTo(rx + rw * 0.2, ry); ctx.ellipse(rx, ry, rw * 0.2, rh * 0.25, 0, 0, TAU);
    }
    ctx.fill();
  }
  // 房屋：残垣（烧黑、参差）→ 建起（平顶、矮墙、门窗）；夜里窗中有灯；住棚节时房顶上有棚
  function drawHouses(ctx, G, A, rowSel) {
    const s = G.s, ph = G.ph, built = W.lv.neHouses, nk = nightK(), lx = litX();
    const lampOn = W.lv.neLamps, booths = W.lv.neBooths;
    const cols = [[214, 196, 160], [196, 176, 140], [222, 206, 172], [186, 166, 132]];
    const winL = [];
    for (const h of G.houses) {
      if (h.row !== rowSel) continue;
      const k = clamp((built - h.th) / 0.1, 0, 1), eK = easeIO(k);
      const x0 = h.x * W.w, w = h.w * W.w, xc = x0 + w / 2;
      const gr = G.g(h.x + h.w / 2), base = gr - h.base * ph;
      const cr = G.c(h.x + h.w / 2);
      if (base < cr - ph * 0.2) continue;
      const hh = lerp(h.ruinH, h.h, eK) * ph;
      const col = U.mixRGB([170, 150, 118], cols[Math.floor(h.shade * 4) % 4], eK);
      const depth = 0.05 * (2 - h.row);
      ctx.globalAlpha = A;
      ctx.fillStyle = cssD(col, depth, 1, NIGHT_EX());
      ctx.beginPath();
      if (eK < 0.98) {
        const j = h.j, jag = (1 - eK) * 0.5;
        ctx.moveTo(x0, base + 1); ctx.lineTo(x0, base - hh * (1 - jag * j[0])); ctx.lineTo(x0 + w * 0.35, base - hh * (1 - jag * 0.2));
        ctx.lineTo(x0 + w * 0.55, base - hh * (1 - jag * j[1])); ctx.lineTo(x0 + w, base - hh * (1 - jag * j[2])); ctx.lineTo(x0 + w, base + 1);
      } else {
        ctx.rect(x0, base - hh, w, hh + 1);
        ctx.rect(x0 - 0.6 * s, base - hh - 1.6 * s, w + 1.2 * s, 1.6 * s);     // 房顶的矮墙（申 22:8）
      }
      ctx.fill();
      // 残垣顶上烧过的黑痕
      if (eK < 0.9) {
        ctx.strokeStyle = cssD(CHAR, depth, 0.5 * (1 - eK));
        ctx.lineWidth = Math.max(0.8, 1.4 * s);
        const j = h.j, jag = (1 - eK) * 0.5;
        ctx.beginPath();
        ctx.moveTo(x0, base - hh * (1 - jag * j[0])); ctx.lineTo(x0 + w * 0.35, base - hh * (1 - jag * 0.2));
        ctx.lineTo(x0 + w * 0.55, base - hh * (1 - jag * j[1])); ctx.lineTo(x0 + w, base - hh * (1 - jag * j[2]));
        ctx.stroke();
      }
      // 背光的一侧
      ctx.fillStyle = cssD([70, 58, 46], depth, 0.3);
      if (lx >= xc) ctx.fillRect(x0, base - hh, w * 0.22, hh);
      else ctx.fillRect(x0 + w * 0.78, base - hh, w * 0.22, hh);
      if (eK > 0.6) {
        // 门与窗
        ctx.fillStyle = cssD([34, 26, 20], depth, 0.85);
        const dw = Math.max(1.2, w * 0.16), wy = base - hh * 0.62;
        ctx.fillRect(x0 + w * (0.25 + 0.4 * h.win), base - hh * 0.42, dw, hh * 0.42);
        if (h.win2 < 0.8) ctx.fillRect(x0 + w * (0.6 - 0.3 * h.win), wy, dw * 0.9, dw * 1.1);
        if (nk > 0.05 && h.lampT < lampOn) winL.push([x0 + w * (0.6 - 0.3 * h.win) + dw * 0.45, wy + dw * 0.55, dw, h.tw]);
      }
      // 棚：树枝搭在房顶（8:16）
      const bk = clamp((booths - h.booth * 0.8) / 0.2, 0, 1) * (eK > 0.95 ? 1 : 0);
      if (bk > 0.01 && h.booth < 0.85) drawBooth(ctx, xc + (h.win - 0.5) * w * 0.3, base - hh - 1.6 * s, Math.min(w * 0.9, ph * 0.5) * (0.6 + 0.4 * bk), bk, depth, h.tw, A);
    }
    // 窗中的灯
    if (winL.length) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,180,96)';
      for (const q of winL) {
        ctx.globalAlpha = A * nk * (0.6 + 0.3 * Math.sin(W.t * 0.8 + q[3]));
        ctx.fillRect(q[0] - q[2] * 0.45, q[1] - q[2] * 0.55, q[2] * 0.9, q[2] * 1.1);
      }
      ctx.globalCompositeOperation = 'source-over';
      SP || sprites();
      for (const q of winL) lamp(ctx, q[0], q[1], q[2] * 5, A * nk * 0.8, q[3]);
    }
    ctx.globalAlpha = 1;
  }
  // 棚：几根枝子架起的青翠顶子
  function drawBooth(ctx, x, y, w, k, depth, seed, A) {
    const s = LS(2), h = w * 0.8;
    ctx.globalAlpha = A * Math.min(1, k * 1.5);
    ctx.strokeStyle = cssD([96, 72, 48], depth, 1);
    ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, y); ctx.lineTo(x - w * 0.42, y - h * k);
    ctx.moveTo(x + w * 0.42, y); ctx.lineTo(x + w * 0.42, y - h * k);
    ctx.stroke();
    const leaf = [[66, 110, 52], [84, 128, 60], [58, 96, 50]];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = cssD(leaf[i], depth, 1, 0.04 * i);
      ctx.beginPath();
      const ox = (i - 1) * w * 0.3, sway = Math.sin(W.t * 1.2 + seed + i) * 0.6 * s;
      ctx.ellipse(x + ox + sway, y - h * k - w * 0.06, w * 0.34, w * 0.2 * k, 0, 0, TAU);
      ctx.fill();
    }
    // 棚中的灯（夜）
    const nk = nightK();
    if (nk > 0.1) lamp(ctx, x, y - h * 0.4 * k, w * 1.6, A * nk * k * 0.9, seed);
    ctx.globalAlpha = A;
  }
  // 水门前的宽阔处、以法莲门的宽阔处、神殿的院内的棚（8:16）
  const GBOOTH = [[0.458, 0.3, 1.1], [0.505, 0.18, 1], [0.548, 0.34, 1.15], [0.905, 0.2, 1], [0.94, 0.3, 1.1]];
  function drawGroundBooths(ctx) {
    const k0 = W.lv.neBooths;
    if (k0 < 0.01 || W.lv.neJeru < 0.3) return;
    const G = geo(), ph = G.ph;
    GBOOTH.forEach((q, i) => {
      const k = clamp((k0 - i * 0.08) / 0.4, 0, 1);
      if (k < 0.01) return;
      drawBooth(ctx, q[0] * W.w, fieldY(q[0], q[1]) + 1, ph * 0.72 * q[2], k, 0, i * 1.7 + 3, W.lv.neJeru);
    });
    // 殿的院内
    const t = templeG(G);
    for (const [xf, i] of [[C.TX + 0.02, 0], [C.TX + 0.04, 1]]) {
      const k = clamp((k0 - 0.3 - i * 0.1) / 0.4, 0, 1);
      if (k > 0.01) drawBooth(ctx, xf * W.w, t.top - t.cw, ph * 0.38, k, 0.05, 9 + i, W.lv.neJeru);
    }
    ctx.globalAlpha = 1;
  }
  // 神的殿：山顶的台、院墙、殿与廊、坛
  function templeG(G) {
    const ph = G.ph, top = G.plat;
    return {
      top, x0: (C.TX - C.THW) * W.w, x1: (C.TX + C.THW) * W.w, cw: 0.24 * ph,
      sx0: (C.TX - 0.017) * W.w, sx1: (C.TX + 0.035) * W.w, sh: 1.12 * ph,        // 殿：圣所与至圣所
      px0: (C.TX - 0.03) * W.w, px1: (C.TX - 0.015) * W.w, psh: 1.52 * ph,        // 廊（朝东，高）
      ax: (C.TX - 0.04) * W.w, aw: 0.011 * W.w, ah: 0.3 * ph,                     // 坛
      room: (C.TX + 0.041) * W.w,                                               // 库房
    };
  }
  function drawTemple(ctx, G, A) {
    const s = G.s, ph = G.ph, t = templeG(G), nk = nightK(), ex = NIGHT_EX();
    ctx.globalAlpha = A;
    // 台（挡土的大石墙）
    const cL = G.c(C.TX - C.THW), cR = G.c(C.TX + C.THW);
    ctx.fillStyle = css([190, 172, 138], 2, 1, ex);
    ctx.beginPath();
    ctx.moveTo(t.x0 - 2 * s, cL + ph * 0.5); ctx.lineTo(t.x0, t.top); ctx.lineTo(t.x1, t.top); ctx.lineTo(t.x1 + 2 * s, cR + ph * 0.5); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css([128, 112, 88], 2, 0.3);
    ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (const k of [0.3, 0.62]) { const y = lerp(t.top, Math.max(cL, cR) + ph * 0.5, k); ctx.moveTo(t.x0 - 1 * s, y); ctx.lineTo(t.x1 + 1 * s, y); }
    ctx.stroke();
    // 院：矮墙与一排小柱的廊
    const stone = [238, 228, 202];
    ctx.fillStyle = css([220, 206, 172], 2, 1, ex);
    ctx.fillRect(t.x0, t.top - t.cw, t.x1 - t.x0, t.cw + 1);
    ctx.fillStyle = css(stone, 2, 1, ex);
    ctx.beginPath();
    const nC = Math.max(8, Math.round((t.x1 - t.x0) / (0.16 * ph)));
    for (let k = 0; k <= nC; k++) { const x = lerp(t.x0 + 1.5 * s, t.x1 - 1.5 * s, k / nC); ctx.rect(x - 0.6 * s, t.top - t.cw - 0.3 * ph, 1.2 * s, 0.3 * ph); }
    ctx.rect(t.x0, t.top - t.cw - 0.34 * ph, t.x1 - t.x0, 0.05 * ph);
    ctx.fill();
    // 殿身
    ctx.fillStyle = css(stone, 2, 1, ex + 0.04);
    ctx.fillRect(t.sx0, t.top - t.sh, t.sx1 - t.sx0, t.sh);
    // 廊（高于殿身）
    ctx.fillRect(t.px0, t.top - t.psh, t.px1 - t.px0, t.psh);
    // 背光的一侧
    const lx = litX();
    ctx.fillStyle = css([110, 96, 76], 2, 0.26);
    if (lx < (t.sx0 + t.sx1) / 2) ctx.fillRect(t.sx1 - (t.sx1 - t.sx0) * 0.14, t.top - t.sh, (t.sx1 - t.sx0) * 0.14, t.sh);
    else ctx.fillRect(t.px0, t.top - t.psh, (t.px1 - t.px0) * 0.3, t.psh);
    // 高处的窗棂
    ctx.fillStyle = css([60, 48, 36], 2, 0.8);
    const nW = 4;
    for (let k = 0; k < nW; k++) { const x = lerp(t.sx0, t.sx1, (k + 0.7) / (nW + 0.4)); ctx.fillRect(x - 0.6 * s, t.top - t.sh * 0.84, 1.2 * s, t.sh * 0.22); }
    // 金的檐与屋顶的尖饰
    ctx.fillStyle = css(GOLD, 2, 1, 0.14 + ex);
    ctx.fillRect(t.sx0 - 1 * s, t.top - t.sh - 1.8 * s, t.sx1 - t.sx0 + 2 * s, 1.8 * s);
    ctx.fillRect(t.px0 - 1.4 * s, t.top - t.psh - 2.2 * s, t.px1 - t.px0 + 2.8 * s, 2.2 * s);
    ctx.fillRect(t.px0 - 0.6 * s, t.top - t.psh * 0.78, t.px1 - t.px0 + 1.2 * s, 1.1 * s);
    ctx.beginPath();
    const spk = (x0, x1, y, n, hgt) => { for (let k = 0; k <= n; k++) { const x = lerp(x0, x1, k / n); ctx.moveTo(x - 0.7 * s, y); ctx.lineTo(x, y - hgt); ctx.lineTo(x + 0.7 * s, y); } };
    spk(t.sx0, t.sx1, t.top - t.sh - 1.8 * s, 9, 3.4 * s);
    spk(t.px0, t.px1, t.top - t.psh - 2.2 * s, 3, 4.2 * s);
    ctx.fill();
    // 廊前的两根柱
    const pc = [238, 226, 196];
    for (const dx of [-0.0062, -0.0022]) {
      const x = t.px0 + dx * W.w, h = 0.98 * ph;
      ctx.fillStyle = css(pc, 2, 1, ex + 0.05);
      ctx.fillRect(x - 0.9 * s, t.top - h, 1.8 * s, h);
      ctx.fillStyle = css(GOLD, 2, 1, 0.2 + ex);
      ctx.beginPath(); ctx.ellipse(x, t.top - h - 1 * s, 2 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    }
    // 廊的门（夜里灯台的光）
    const dw = (t.px1 - t.px0) * 0.5, dh = t.psh * 0.56;
    const dx = (t.px0 + t.px1) / 2;
    ctx.fillStyle = css([40, 30, 22], 2, 1);
    ctx.beginPath(); ctx.moveTo(dx - dw / 2, t.top); ctx.lineTo(dx - dw / 2, t.top - dh + dw * 0.4); ctx.quadraticCurveTo(dx, t.top - dh - dw * 0.2, dx + dw / 2, t.top - dh + dw * 0.4); ctx.lineTo(dx + dw / 2, t.top); ctx.closePath(); ctx.fill();
    const glowK = 0.45 * nk + 0.5 * W.lv.neHoly + 0.3 * W.lv.neJoy + 0.4 * W.lv.neClean;
    if (glowK > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = A * Math.min(1, glowK) * 0.75;
      ctx.fillStyle = 'rgb(255,196,110)';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, dx, t.top - dh * 0.5, ph * 1.5, A * Math.min(1, glowK), 4);
      ctx.globalAlpha = A;
    }
    // 迎光的边
    ctx.strokeStyle = W.night > 0.5 ? css([214, 226, 255], 2, 0.45 * W.night * W.lv.moon, 0.5) : css([255, 240, 206], 2, 0.5 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(t.sx0, t.top - t.sh); ctx.lineTo(t.sx1, t.top - t.sh); ctx.moveTo(t.px0, t.top - t.psh); ctx.lineTo(t.px1, t.top - t.psh); ctx.stroke();
    // 坛
    ctx.fillStyle = css([176, 156, 124], 2, 1, ex);
    ctx.fillRect(t.ax - t.aw / 2, t.top - t.cw - t.ah, t.aw, t.ah + 1);
    ctx.fillRect(t.ax - t.aw * 0.62, t.top - t.cw - t.ah - 1.2 * s, t.aw * 1.24, 1.2 * s);
    const fire = 0.3 + 0.7 * W.lv.neAltar;
    flame(ctx, t.ax, t.top - t.cw - t.ah - 1 * s, ph * (0.2 + 0.45 * W.lv.neAltar), A * fire, 3.3);
    if (W.lv.neAltar > 0.05) smoke(ctx, t.ax, t.top - t.cw - t.ah - ph * 0.3, A * W.lv.neAltar, W.h * 0.28, 9 * s, 1.7);
    // 库房（多比雅的屋子洁净后，乳香的烟）
    if (W.lv.neClean > 0.02) {
      smoke(ctx, t.room, t.top - 0.3 * ph, A * W.lv.neClean * 0.8, W.h * 0.12, 5 * s, 4.2, SP.incense);
      lamp(ctx, t.room, t.top - 0.2 * ph, ph * 0.9, A * W.lv.neClean * 0.7, 2);
    }
    ctx.globalAlpha = 1;
  }
  function drawCity(ctx) {
    const A = W.lv.neJeru;
    if (A < 0.005) return;
    const G = geo();
    SP || sprites();
    drawHill(ctx, G, A);
    // 后墙（山脊，远一些：略带雾色）
    for (const sg of G.crest) drawSeg(ctx, G, sg, 0.1, A);
    for (const sg of G.crest) drawRubble(ctx, G, sg, A * 0.8);
    drawTemple(ctx, G, A);
    drawHouses(ctx, G, A, 0);
    drawHouses(ctx, G, A, 1);
    drawHouses(ctx, G, A, 2);
    // 两侧的墙
    for (const sg of G.side) drawSeg(ctx, G, sg, 0.04, A);
    // 前墙
    const glowOver = 0.12 * W.lv.neGlow;
    for (const sg of G.front) drawSeg(ctx, G, sg, 0, A, glowOver);
    for (const sg of G.front) drawRubble(ctx, G, sg, A);
    // 城墙修完：全墙一道金边（6:16）
    if (W.lv.neGlow > 0.01) drawWallGlow(ctx, G, A * W.lv.neGlow, 1);
    // 城门两旁的灯（夜里；门扇安好之后，守门的在那里）
    const nk = nightK();
    if (nk > 0.1 && W.lv.neDoors > 0.3) {
      for (const sg of G.front) {
        if (sg.kind !== 'gate') continue;
        const gx = (sg.xa + sg.xb) / 2 * W.w, gb = G.g((sg.xa + sg.xb) / 2), gw = (sg.xb - sg.xa) * W.w * 0.34;
        flame(ctx, gx - gw, gb - G.WG * 0.62, 4.5 * G.s, A * nk * W.lv.neDoors * 0.8, sg.i * 3.1);
        flame(ctx, gx + gw, gb - G.WG * 0.62, 4.5 * G.s, A * nk * W.lv.neDoors * 0.8, sg.i * 1.7);
      }
    }
    ctx.globalAlpha = 1;
  }
  // 沿着墙头的一道光（修完时全墙；称谢的人走过之处）
  function wallPath(G) {
    // 自谷门起，向右（前墙 → 右坡 → 山脊 → 殿），向左同样；返回两条折线（像素）
    const P = side => {
      const pts = [];
      const x0 = C.TX, fx1 = side > 0 ? C.FR : C.FL, cx1 = side > 0 ? C.CR : C.CL, tx = C.TX + side * (C.THW + 0.002);
      const N1 = 10;
      for (let i = 0; i <= N1; i++) { const xf = lerp(x0, fx1 - side * 0.004, i / N1); pts.push([xf * W.w, frontTop(xf, 1)]); }
      const a = [(fx1 - side * 0.004) * W.w, frontTop(fx1 - side * 0.004, 1)], b = [(cx1 - side * 0.004) * W.w, crestTop(cx1 - side * 0.004, 1)];
      for (let i = 1; i <= 4; i++) pts.push([lerp(a[0], b[0], i / 4), lerp(a[1], b[1], i / 4)]);
      const N2 = 8;
      for (let i = 1; i <= N2; i++) { const xf = lerp(cx1 - side * 0.004, tx + side * 0.004, i / N2); pts.push([xf * W.w, crestTop(xf, 1)]); }
      // 进到殿的院里
      pts.push([(C.TX + side * 0.028) * W.w, G.plat - 0.24 * G.ph]);
      const L = [0];
      for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      return { pts, L, len: L[L.length - 1] };
    };
    const key = W.w + 'x' + W.h + ':' + G.key;
    if (!G.paths || G.paths.key !== key) G.paths = { key, A: P(1), B: P(-1) };
    return G.paths;
  }
  function pathAt(p, s) {
    const d = clamp(s, 0, 1) * p.len;
    let i = 1;
    while (i < p.L.length - 1 && p.L[i] < d) i++;
    const k = (d - p.L[i - 1]) / Math.max(1e-6, p.L[i] - p.L[i - 1]);
    return [lerp(p.pts[i - 1][0], p.pts[i][0], k), lerp(p.pts[i - 1][1], p.pts[i][1], k), Math.sign(p.pts[i][0] - p.pts[i - 1][0])];
  }
  function strokePath(ctx, p, s1) {
    const d = clamp(s1, 0, 1) * p.len;
    ctx.moveTo(p.pts[0][0], p.pts[0][1]);
    for (let i = 1; i < p.pts.length; i++) {
      if (p.L[i] <= d) ctx.lineTo(p.pts[i][0], p.pts[i][1]);
      else { const k = (d - p.L[i - 1]) / Math.max(1e-6, p.L[i] - p.L[i - 1]); ctx.lineTo(lerp(p.pts[i - 1][0], p.pts[i][0], k), lerp(p.pts[i - 1][1], p.pts[i][1], k)); break; }
    }
  }
  function drawWallGlow(ctx, G, k, s1) {
    const P = wallPath(G), s = G.s;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const pul = 0.8 + 0.2 * Math.sin(W.t * 1.3);
    for (const [wd, a, col] of [[7, 0.12, 'rgb(255,196,110)'], [3, 0.28, 'rgb(255,214,140)'], [1.2, 0.7, 'rgb(255,244,214)']]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = Math.max(0.8, wd * s);
      ctx.globalAlpha = Math.min(1, k * a * pul);
      ctx.beginPath(); strokePath(ctx, P.A, s1); strokePath(ctx, P.B, s1); ctx.stroke();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：书珊的宫
  // ════════════════════════════════════════════════════════════
  const COLS = 8;
  function palaceG() {
    const ph = PH(2), s = LS(2);
    const g0 = gY(2, X.palace0), g1 = gY(2, X.palace1);
    const ttop = Math.min(g0, g1, gY(2, 0.75)) - 0.36 * ph;
    return { ph, s, ttop, colTop: ttop - 2.05 * ph, x0: X.palace0 * W.w, x1: X.palace1 * W.w };
  }
  function drawPalace(ctx) {
    const A = W.lv.neSusa;
    if (A < 0.005) return;
    const P = palaceG(), ph = P.ph, s = P.s, ex = NIGHT_EX(), nk = nightK();
    SP || sprites();
    ctx.globalAlpha = A;
    // 棕树（宫的两旁）
    drawPalm(ctx, 0.563, 1.05, A, 1); drawPalm(ctx, 0.985, 0.95, A, -1);
    // 高台
    const tx0 = P.x0, tx1 = P.x1;
    ctx.fillStyle = css([176, 152, 118], 2, 1, ex);
    ctx.beginPath();
    ctx.moveTo(tx0 - 3 * s, gY(2, X.palace0) + 3);
    ctx.lineTo(tx0, P.ttop); ctx.lineTo(tx1, P.ttop); ctx.lineTo(tx1 + 3 * s, gY(2, X.palace1) + 3);
    ctx.closePath(); ctx.fill();
    // 台阶（正中偏左）
    const st0 = 0.655 * W.w, st1 = 0.705 * W.w, gs = gY(2, 0.68);
    ctx.fillStyle = css([204, 182, 146], 2, 1, ex);
    ctx.beginPath(); ctx.moveTo(st0 - 5 * s, gs + 2); ctx.lineTo(st0, P.ttop); ctx.lineTo(st1, P.ttop); ctx.lineTo(st1 + 5 * s, gs + 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([140, 120, 92], 2, 0.5);
    ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let k = 1; k < 5; k++) { const y = lerp(P.ttop, gs, k / 5), e = 5 * s * k / 5; ctx.moveTo(st0 - e, y); ctx.lineTo(st1 + e, y); }
    ctx.stroke();
    // 殿廊深处（暗）
    const h0 = 0.61 * W.w, h1 = 0.94 * W.w;
    ctx.fillStyle = css([64, 50, 40], 2, 0.9);
    ctx.fillRect(h0, P.colTop, h1 - h0, P.ttop - P.colTop);
    // 深处的帘与灯
    if (nk > 0.05) { for (let k = 0; k < 3; k++) lamp(ctx, lerp(h0, h1, 0.25 + 0.25 * k), lerp(P.colTop, P.ttop, 0.55), ph * 1.2, A * nk * 0.6, k); ctx.globalAlpha = A; }
    // 柱子（细高，柱头是双牛）
    const colC = [222, 206, 172], cw = Math.max(1.5, 0.1 * ph);
    ctx.fillStyle = css(colC, 2, 1, ex);
    ctx.beginPath();
    for (let k = 0; k < COLS; k++) {
      const cx = lerp(0.632, 0.918, k / (COLS - 1)) * W.w;
      ctx.rect(cx - cw / 2, P.colTop + 0.18 * ph, cw, P.ttop - P.colTop - 0.18 * ph);
      ctx.rect(cx - cw * 1.1, P.ttop - 0.08 * ph, cw * 2.2, 0.08 * ph);                // 柱础
    }
    ctx.fill();
    // 柱头：双牛（两端向外探出的头）
    ctx.fillStyle = css([196, 176, 138], 2, 1, ex);
    ctx.beginPath();
    for (let k = 0; k < COLS; k++) {
      const cx = lerp(0.632, 0.918, k / (COLS - 1)) * W.w, y = P.colTop + 0.16 * ph, bw = 0.2 * ph;
      ctx.rect(cx - bw, y - 0.07 * ph, bw * 2, 0.1 * ph);
      ctx.moveTo(cx - bw + 0.05 * ph, y - 0.07 * ph); ctx.ellipse(cx - bw, y - 0.05 * ph, 0.06 * ph, 0.05 * ph, 0, 0, TAU);
      ctx.moveTo(cx + bw + 0.05 * ph, y - 0.07 * ph); ctx.ellipse(cx + bw, y - 0.05 * ph, 0.06 * ph, 0.05 * ph, 0, 0, TAU);
    }
    ctx.fill();
    // 额枋（香柏木）与琉璃砖的蓝带（金色的花饰）
    ctx.fillStyle = css([98, 70, 48], 2, 1, ex);
    ctx.fillRect(h0 - 0.02 * W.w, P.colTop - 0.02 * ph, h1 - h0 + 0.04 * W.w, 0.13 * ph);
    const fb0 = P.colTop - 0.3 * ph, fb1 = P.colTop - 0.02 * ph;
    ctx.fillStyle = css(BLUE, 2, 1, 0.08 + ex);
    ctx.fillRect(h0 - 0.02 * W.w, fb0, h1 - h0 + 0.04 * W.w, fb1 - fb0);
    ctx.fillStyle = css([240, 206, 120], 2, 0.95, 0.15 + ex);
    ctx.beginPath();
    const nR = Math.max(6, Math.round((h1 - h0) / (0.22 * ph)));
    for (let k = 0; k <= nR; k++) { const x = lerp(h0 - 0.01 * W.w, h1 + 0.01 * W.w, k / nR), y = (fb0 + fb1) / 2; ctx.moveTo(x + 0.045 * ph, y); ctx.arc(x, y, 0.045 * ph, 0, TAU); }
    ctx.fill();
    // 阶梯状的垛（波斯式）
    ctx.fillStyle = css([188, 164, 128], 2, 1, ex);
    ctx.beginPath();
    const mN = Math.max(8, Math.round((h1 - h0) / (0.16 * ph)));
    for (let k = 0; k < mN; k++) {
      const x = lerp(h0 - 0.02 * W.w, h1 + 0.02 * W.w, (k + 0.5) / mN), mw = 0.05 * ph, y = fb0;
      ctx.rect(x - mw * 1.5, y - 0.05 * ph, mw * 3, 0.05 * ph); ctx.rect(x - mw, y - 0.1 * ph, mw * 2, 0.05 * ph); ctx.rect(x - mw * 0.5, y - 0.15 * ph, mw, 0.05 * ph);
    }
    ctx.fill();
    // 两端的塔门
    for (const [a, b] of [[X.palace0, 0.622], [0.928, X.palace1]]) {
      const x0 = a * W.w, x1 = b * W.w, th = P.ttop - 2.7 * ph;
      ctx.fillStyle = css([196, 170, 132], 2, 1, ex);
      ctx.fillRect(x0, th, x1 - x0, P.ttop - th + 1);
      ctx.fillStyle = css(BLUE, 2, 1, 0.08 + ex);
      ctx.fillRect(x0, th + 0.22 * ph, x1 - x0, 0.2 * ph);
      ctx.fillStyle = css([240, 206, 120], 2, 0.9, 0.15 + ex);
      ctx.fillRect(x0, th + 0.3 * ph, x1 - x0, 0.03 * ph);
      ctx.fillStyle = css([196, 170, 132], 2, 1, ex);
      ctx.beginPath();
      for (let k = 0; k < 3; k++) { const x = lerp(x0, x1, (k + 0.5) / 3), mw = (x1 - x0) / 7; ctx.rect(x - mw, th - 0.1 * ph, mw * 2, 0.1 * ph); ctx.rect(x - mw * 0.5, th - 0.18 * ph, mw, 0.08 * ph); }
      ctx.fill();
      ctx.fillStyle = css([90, 72, 56], 2, 0.3);
      if (litX() < (x0 + x1) / 2) ctx.fillRect(x1 - (x1 - x0) * 0.25, th, (x1 - x0) * 0.25, P.ttop - th);
      else ctx.fillRect(x0, th, (x1 - x0) * 0.25, P.ttop - th);
    }
    // 迎光的边
    ctx.strokeStyle = css([255, 238, 200], 2, 0.45 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(tx0, P.ttop); ctx.lineTo(tx1, P.ttop); ctx.moveTo(h0 - 0.02 * W.w, fb0 - 0.15 * ph); ctx.lineTo(h1 + 0.02 * W.w, fb0 - 0.15 * ph); ctx.stroke();
    // 台上的火盆
    const bz = 0.3 + 0.7 * nk;
    for (const bx of [0.645, 0.912]) {
      const x = bx * W.w;
      ctx.fillStyle = css([150, 110, 60], 2, 1, 0.1);
      ctx.beginPath(); ctx.moveTo(x - 0.1 * ph, P.ttop - 0.3 * ph); ctx.lineTo(x + 0.1 * ph, P.ttop - 0.3 * ph); ctx.lineTo(x + 0.03 * ph, P.ttop); ctx.lineTo(x - 0.03 * ph, P.ttop); ctx.closePath(); ctx.fill();
      flame(ctx, x, P.ttop - 0.3 * ph, 0.28 * ph, A * bz, bx * 30);
      ctx.globalAlpha = A;
    }
    // 宝座与华盖（2:1–6）
    if (S.throne) drawThrone(ctx, P, A);
    ctx.globalAlpha = 1;
  }
  function drawThrone(ctx, P, A) {
    const ph = P.ph, s = P.s;
    for (const [xf, big] of [[X.throne, 1], [X.queen, 0.82]]) {
      const x = xf * W.w + 0.08 * ph, g = fieldY(xf, 0.06);
      ctx.fillStyle = css([150, 112, 60], 2, 1, 0.1);
      ctx.fillRect(x - 0.02 * ph, g - 0.95 * ph * big, 0.1 * ph, 0.95 * ph * big);          // 椅背
      ctx.fillRect(x - 0.36 * ph, g - 0.28 * ph, 0.46 * ph, 0.06 * ph);                     // 座
      ctx.fillRect(x - 0.34 * ph, g - 0.28 * ph, 0.04 * ph, 0.28 * ph);
      ctx.fillStyle = css(GOLD, 2, 1, 0.18);
      ctx.beginPath(); ctx.arc(x + 0.03 * ph, g - 0.97 * ph * big, 0.06 * ph, 0, TAU); ctx.fill();
    }
    // 华盖
    const cx0 = (X.throne - 0.03) * W.w, cx1 = (X.queen + 0.03) * W.w, gy = fieldY(X.throne, 0.06), top = gy - 1.55 * ph;
    ctx.strokeStyle = css([160, 120, 64], 2, 1, 0.1); ctx.lineWidth = Math.max(0.8, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(cx0, gy); ctx.lineTo(cx0, top); ctx.moveTo(cx1, gy); ctx.lineTo(cx1, top); ctx.stroke();
    ctx.fillStyle = css([118, 52, 96], 2, 1, 0.06);
    ctx.beginPath(); ctx.moveTo(cx0 - 3 * s, top); ctx.lineTo(cx1 + 3 * s, top); ctx.lineTo(cx1 + 1 * s, top + 0.16 * ph); ctx.lineTo(cx0 - 1 * s, top + 0.16 * ph); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(GOLD, 2, 1, 0.15);
    ctx.beginPath();
    for (let k = 0; k <= 8; k++) { const x = lerp(cx0, cx1, k / 8); ctx.moveTo(x + 1.1 * s, top + 0.16 * ph); ctx.arc(x, top + 0.16 * ph, 1.1 * s, 0, Math.PI); }
    ctx.fill();
  }
  function drawPalm(ctx, xf, sz, A, flip) {
    const s = LS(2) * sz, x = xf * W.w, g = gY(2, xf) + 2, h = 64 * s;
    const sway = Math.sin(W.t * 0.6 + xf * 9) * 1.5 * s;
    ctx.strokeStyle = css([92, 70, 50], 2, A);
    ctx.lineWidth = Math.max(1, 2.4 * s);
    ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x + flip * 6 * s, g - h * 0.5, x + flip * 4 * s + sway, g - h); ctx.stroke();
    const tx = x + flip * 4 * s + sway, ty = g - h;
    ctx.strokeStyle = css([62, 96, 56], 2, A);
    ctx.lineWidth = Math.max(0.8, 1.6 * s);
    ctx.beginPath();
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI / 2 + (k - 3) * 0.48 + Math.sin(W.t * 0.8 + k) * 0.03, L = (18 + 5 * (k % 2)) * s;
      const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.6 + L * 0.35;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 4 * s, ex, ey);
    }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  画：远山上那城的影子、散在天涯的光、各城的灯、敌营的火、火柱
  // ════════════════════════════════════════════════════════════
  const VX = 0.905;
  function visionPt() { return [VX * W.w, gY(0, VX) - 2]; }
  function drawVision(ctx) {
    const k = W.lv.neVision;
    if (k < 0.005) return;
    SP || sprites();
    const [x, y] = visionPt(), s = LS(0) * 1.4, gat = W.lv.neGather;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y - 8 * s, M() * (0.05 + 0.05 * gat), k * (0.35 + 0.45 * gat));
    ctx.globalCompositeOperation = 'source-over';
    // 小小的城：墙、殿
    ctx.globalAlpha = k * 0.85;
    ctx.fillStyle = U.rgba(255, 226, 170, 1);
    const w = 44 * s, h = 6 * s;
    ctx.beginPath();
    ctx.rect(x - w / 2, y - h, w, h);
    for (let i = 0; i < 6; i++) ctx.rect(x - w / 2 + (i + 0.25) * w / 6, y - h - 1.6 * s, w / 12, 1.6 * s);
    ctx.rect(x - 4 * s, y - h - 7 * s, 9 * s, 7 * s);
    ctx.rect(x - 6 * s, y - h - 9 * s, 3 * s, 9 * s);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  const NG = 46;
  function drawGather(ctx) {
    const g = W.lv.neGather;
    if (g < 0.002 || g >= 0.999) return;
    SP || sprites();
    const [vx, vy] = visionPt(), vis = smoothstep(0, 0.08, g);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < NG; i++) {
      const x0 = (0.03 + 0.94 * rt(i * 7 + 1)) * W.w, y0 = (0.3 + 0.62 * rt(i * 7 + 2)) * W.h;
      const t = easeIO(clamp((g - 0.08 - 0.42 * rt(i * 7 + 3)) / 0.5, 0, 1));
      const cx = lerp(x0, vx, 0.5) + (rt(i * 7 + 4) - 0.5) * W.w * 0.15, cy = Math.min(y0, vy) - (0.08 + 0.14 * rt(i * 7 + 5)) * W.h;
      const x = qb(x0, cx, vx, t), y = qb(y0, cy, vy - 6, t);
      const tw = 0.7 + 0.3 * Math.sin(W.t * (2 + rt(i * 7 + 6) * 3) + i);
      const a = vis * (1 - smoothstep(0.9, 1, t)) * tw;
      if (a < 0.01) continue;
      const r = (2.2 + 1.6 * rt(i * 7 + 6)) * SU();
      glowSp(ctx, SP.gold, x, y, r * 5, a * 0.5);
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(255,244,214)';
      ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 远山上各城的灯（7:73）
  const VILL = [0.575, 0.625, 0.69, 0.8, 0.86, 0.95, 0.985];
  function drawVillages(ctx) {
    const k = W.lv.neVillage;
    if (k < 0.01) return;
    const s = LS(0) * 1.6, nk = nightK();
    ctx.globalAlpha = k;
    ctx.fillStyle = css([196, 176, 140], 0, 1, 0.05);
    ctx.beginPath();
    VILL.forEach((xf, i) => {
      const x = xf * W.w, y = gY(0, xf) + 1;
      for (let q = 0; q < 3; q++) { const w = (3 + 2 * rt(i * 5 + q)) * s, h = (2.4 + 2 * rt(i * 5 + q + 50)) * s; ctx.rect(x + (q - 1) * 4.2 * s - w / 2, y - h, w, h); }
    });
    ctx.fill();
    if (nk > 0.05) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      VILL.forEach((xf, i) => {
        const x = xf * W.w, y = gY(0, xf) - 2 * s;
        const a = k * nk * (0.65 + 0.35 * Math.sin(W.t * 0.9 + i * 2.1));
        glowSp(ctx, SP.warm, x, y, 12 * s, a);
        ctx.globalAlpha = a; ctx.fillStyle = 'rgb(255,200,120)';
        ctx.fillRect(x - 0.8 * s, y - 0.8 * s, 1.6 * s, 1.6 * s);
      });
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 城外敌营的火（4:7–8）
  const FOE_FIRES = [[2, 0.448, 0.22], [2, 0.49, 0.34], [1, 0.497, 0], [1, 0.515, 0]];
  function drawFoe(ctx, l) {
    const k = W.lv.neFoe;
    if (k < 0.01) return;
    for (let i = 0; i < FOE_FIRES.length; i++) {
      const q = FOE_FIRES[i];
      if (q[0] !== l) continue;
      const s = LS(l), x = q[1] * W.w, y = l === 2 ? fieldY(q[1], q[2]) : gY(1, q[1]) + 1;
      flame(ctx, x, y, (l === 2 ? 11 : 9) * s, k, i * 2.3);
      smoke(ctx, x, y - 8 * s, k * 0.6, W.h * 0.12, 5 * s, i * 1.3);
    }
  }
  // 火柱的回影（9:19）：远山上，自地直上天
  function drawPillar(ctx) {
    const k = W.lv.nePillar;
    if (k < 0.01) return;
    SP || sprites();
    const x = 0.93 * W.w, y = gY(0, 0.93) + 2, w = Math.max(12, 0.03 * W.w), H = y + 10;
    const fl = 0.85 + 0.1 * Math.sin(W.t * 3.1) + 0.05 * Math.sin(W.t * 7.7);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * fl * (0.3 + 0.4 * nightK());
    ctx.drawImage(SP.pillar, x - w, y - H, w * 2, H);
    ctx.globalAlpha = k * 0.38;
    ctx.drawImage(SP.pillar, x - w * 0.4, y - H * 0.9, w * 0.8, H * 0.9);
    glowSp(ctx, SP.warm, x, y - 4, w * 3.5, k * 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：人手里的东西与光
  // ════════════════════════════════════════════════════════════
  // 施恩的手：一道暖光自天落在尼希米身上
  function drawHand(ctx) {
    const k = W.lv.neHand;
    if (k < 0.01) return;
    const p = figPt('neh', 0.5);
    if (!p) return;
    SP || sprites();
    const ph = PH(2), topY = -20, hgt = p[1] + ph * 0.5 - topY, w = ph * 1.3;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.4;
    ctx.translate(p[0], p[1] + ph * 0.5);
    ctx.rotate(-0.12);
    ctx.drawImage(SP.beam, -w / 2, -hgt, w, hgt);
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1], ph * 1.1, k * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 默祷：一线上升的光
  function drawPray(ctx) {
    const k = W.lv.nePray;
    if (k < 0.01) return;
    const p = figPt('neh', 1.02);
    if (!p) return;
    const len = p[1] + 10;
    const gr = ctx.createLinearGradient(0, p[1], 0, p[1] - len);
    gr.addColorStop(0, 'rgba(255,240,200,0.9)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.8;
    ctx.strokeStyle = gr;
    ctx.lineWidth = Math.max(1, 1.4 * SU());
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + Math.sin(W.t * 0.7) * 2, p[1] - len * Math.min(1, k * 1.2)); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 酒杯（2:1）、诏书（2:8）、角（4:18）
  function drawProps(ctx) {
    const ph = PH(2), s = LS(2);
    if (S.cup) {
      const f = fig('neh'), p = figPt('neh', 0.56);
      if (f && p) {
        const x = p[0] + (f.fd || f.facing || 1) * ph * 0.2, y = p[1];
        ctx.fillStyle = css(GOLD, 2, 1, 0.2);
        ctx.beginPath(); ctx.moveTo(x - 0.07 * ph, y - 0.08 * ph); ctx.lineTo(x + 0.07 * ph, y - 0.08 * ph); ctx.lineTo(x + 0.02 * ph, y); ctx.lineTo(x + 0.02 * ph, y + 0.04 * ph);
        ctx.lineTo(x + 0.05 * ph, y + 0.06 * ph); ctx.lineTo(x - 0.05 * ph, y + 0.06 * ph); ctx.lineTo(x - 0.02 * ph, y + 0.04 * ph); ctx.lineTo(x - 0.02 * ph, y); ctx.closePath(); ctx.fill();
        lamp(ctx, x, y - 0.04 * ph, ph * 0.3, 0.3 * dayA(), 1);
      }
    }
    // 诏书自王手中飞到尼希米手里
    const lk = tv('letter', S.letter ? 1 : -1);
    if (lk >= 0) {
      const a = figPt('king', 0.55), b = figPt('neh', 0.55);
      if (a && b) {
        const t = easeIO(clamp(lk, 0, 1)), x = lerp(a[0], b[0] + 0.12 * ph, t), y = lerp(a[1], b[1], t) - Math.sin(t * Math.PI) * ph * 0.5;
        if (lk < 1 || S.letter) drawScrollSmall(ctx, x, y, ph, s);
      }
    }
    if (S.horn) {
      const f = fig('horn'), p = figPt('horn', 0.88);
      if (f && p) {
        const d = f.fd || f.facing || 1, bl = tweening('blow') ? 1 : 0;
        ctx.strokeStyle = css([226, 196, 150], 2, 1, 0.15);
        ctx.lineWidth = Math.max(1.2, 0.07 * ph);
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p[0] + d * 0.06 * ph, p[1]); ctx.quadraticCurveTo(p[0] + d * 0.3 * ph, p[1] + 0.05 * ph, p[0] + d * 0.42 * ph, p[1] - 0.18 * ph - bl * 0.03 * ph); ctx.stroke();
        ctx.lineCap = 'butt';
      }
    }
  }
  function drawScrollSmall(ctx, x, y, ph, s) {
    ctx.fillStyle = css([236, 224, 196], 2, 1, 0.2);
    ctx.fillRect(x - 0.12 * ph, y - 0.05 * ph, 0.24 * ph, 0.1 * ph);
    ctx.fillStyle = css([150, 110, 70], 2, 1, 0.1);
    ctx.fillRect(x - 0.14 * ph, y - 0.06 * ph, 0.04 * ph, 0.12 * ph); ctx.fillRect(x + 0.1 * ph, y - 0.06 * ph, 0.04 * ph, 0.12 * ph);
    ctx.fillStyle = 'rgb(190,40,40)';
    ctx.beginPath(); ctx.arc(x, y + 0.02 * ph, 0.035 * ph, 0, TAU); ctx.fill();
  }
  // 木台（8:4）、律法书（8:5）、立约的册（9:38）
  function pulpitG() {
    const ph = PH(2), x = X.pulpit * W.w, base = fieldY(X.pulpit, 0.1);
    return { ph, x, base, top: base - 0.62 * ph * W.lv.nePulpit, hw: Math.max(14, 0.042 * W.w) };
  }
  function drawPulpit(ctx) {
    const k = W.lv.nePulpit;
    if (k < 0.01) return;
    const P = pulpitG(), s = LS(2), ph = P.ph;
    ctx.globalAlpha = Math.min(1, k * 1.4);
    ctx.fillStyle = css([134, 98, 62], 2, 1, NIGHT_EX());
    ctx.fillRect(P.x - P.hw, P.top, P.hw * 2, P.base - P.top + 1);
    ctx.fillStyle = css([164, 124, 82], 2, 1, NIGHT_EX() + 0.05);
    ctx.fillRect(P.x - P.hw - 2 * s, P.top - 1.6 * s, P.hw * 2 + 4 * s, 2.2 * s);
    ctx.strokeStyle = css([92, 66, 42], 2, 0.6);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let q = 1; q < 6; q++) { const x = lerp(P.x - P.hw, P.x + P.hw, q / 6); ctx.moveTo(x, P.top + 1); ctx.lineTo(x, P.base); }
    ctx.stroke();
    // 台阶（左侧）
    ctx.fillStyle = css([150, 112, 72], 2, 1, NIGHT_EX());
    ctx.beginPath();
    for (let q = 0; q < 3; q++) { const h = (P.base - P.top) * (q + 1) / 4; ctx.rect(P.x - P.hw - (3 - q) * 3.5 * s, P.base - h, 3.5 * s, h); }
    ctx.fill();
    // 立约的册：摊在台上，印一个个盖上
    const cv = W.lv.neCovenant;
    if (cv > 0.01) {
      const cx = P.x, cy = P.top - 2 * s, w = P.hw * 0.9;
      ctx.fillStyle = css([236, 226, 200], 2, 1, 0.25);
      ctx.fillRect(cx - w / 2, cy - 1.2 * s, w, 2.4 * s);
      ctx.fillStyle = 'rgb(178,40,36)';
      const n = Math.floor(cv * 9 + 1e-6);
      ctx.beginPath();
      for (let q = 0; q < n; q++) { const x = cx - w / 2 + w * (q + 0.5) / 9; ctx.moveTo(x + 1.1 * s, cy + 1.6 * s); ctx.arc(x, cy + 1.6 * s, 1.1 * s, 0, TAU); }
      ctx.fill();
      lamp(ctx, cx, cy, ph * 0.9, cv * 0.5, 7);
    }
    ctx.globalAlpha = 1;
  }
  function drawLawScroll(ctx) {
    const k = W.lv.neScroll;
    if (k < 0.01) return;
    const f = fig('ezra');
    if (!f) return;
    const ph = PH(2), s = LS(2), up = f.pose === 'raise';
    const p = figPt('ezra', up ? 1.12 : 0.6);
    if (!p) return;
    SP || sprites();
    const open = clamp((k - 0.3) / 0.7, 0, 1), d = f.fd || f.facing || 1;
    const x = p[0] + (up ? 0 : d * 0.16 * ph), y = p[1];
    const w = lerp(0.05, 0.36, open) * ph, h = 0.26 * ph;
    // 光
    if (open > 0.02) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const R = ph * (1.2 + 1.8 * open);
      glowSp(ctx, SP.gold, x, y, R, open * 0.55);
      ctx.strokeStyle = 'rgb(255,236,190)';
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      for (let i = 0; i < 11; i++) {
        const a = -Math.PI / 2 + (i - 5) * 0.22 + Math.sin(W.t * 0.5 + i) * 0.02;
        const r0 = h * 0.8, r1 = R * (0.7 + 0.3 * rt(i + 300)) * (0.9 + 0.1 * Math.sin(W.t * 1.3 + i * 2));
        ctx.globalAlpha = open * 0.14 * (0.7 + 0.3 * Math.sin(W.t * 1.7 + i));
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke();
      }
      ctx.restore();
    }
    // 书卷：两轴之间的皮卷
    ctx.globalAlpha = Math.min(1, k * 2);
    ctx.fillStyle = css([244, 234, 206], 2, 1, 0.3 + 0.4 * open);
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.fillStyle = css([140, 100, 62], 2, 1, 0.1);
    const rw = 0.045 * ph;
    ctx.fillRect(x - w / 2 - rw, y - h / 2 - 0.04 * ph, rw * 1.4, h + 0.08 * ph);
    ctx.fillRect(x + w / 2 - rw * 0.4, y - h / 2 - 0.04 * ph, rw * 1.4, h + 0.08 * ph);
    if (open > 0.3) {
      ctx.strokeStyle = css([120, 96, 70], 2, 0.5 * open);
      ctx.lineWidth = Math.max(0.4, 0.5 * s);
      ctx.beginPath();
      for (let c = 0; c < 3; c++) for (let r = 0; r < 4; r++) {
        const cx = x - w / 2 + w * (c + 0.2) / 3, cy = y - h / 2 + h * (r + 0.6) / 4.6;
        ctx.moveTo(cx, cy); ctx.lineTo(cx + w * 0.22, cy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 称谢的人走过的墙头：光随着他们描出城的轮廓（12:31–40）
  function drawChoirTrail(ctx) {
    if (!S.choir || W.lv.neJeru < 0.5) return;
    const G = geo(), h = W.lv.neChoir, N = 7, gap = choirGap(G);
    const head = gap * (N - 1) + h * (1 - gap * (N - 1));
    drawWallGlow(ctx, G, 0.9, head);
  }
  // 欢声听到远处（12:43）：一圈一圈金色的环自殿扩散，越过全地与海
  function drawJoy(ctx) {
    const k = W.lv.neJoy;
    if (k < 0.01) return;
    const G = geo(), t = templeG(G), cx = (t.sx0 + t.sx1) / 2, cy = t.top - t.sh * 0.5;
    const Rm = Math.hypot(W.w, W.h) * 1.05, per = 2.2, life = 7.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const age = ((W.t / (W.fast || 1)) + i * per) % (per * 4);
      if (age > life) continue;
      const u = age / life, r = Rm * (1 - Math.pow(1 - u, 1.8));
      const a = k * (1 - u) * Math.min(1, u * 8);
      ctx.strokeStyle = 'rgb(255,214,140)';
      ctx.globalAlpha = a * 0.16; ctx.lineWidth = Math.max(2, 9 * SU() * (1 - u * 0.5));
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = 'rgb(255,242,210)';
      ctx.globalAlpha = a * 0.4; ctx.lineWidth = Math.max(0.8, 1.4 * SU());
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, TAU); ctx.stroke();
    }
    SP || sprites();
    glowSp(ctx, SP.gold, cx, cy, G.ph * 4, k * 0.4 * (0.85 + 0.15 * Math.sin(W.t * 2)));
    ctx.restore();
  }
  // 圣城的金光（11:1）
  function drawHoly(ctx) {
    const k = W.lv.neHoly;
    if (k < 0.01 || W.lv.neJeru < 0.3) return;
    const G = geo();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const cx = C.TX * W.w, cy = lerp(G.plat, G.g(C.TX), 0.35);
    glowSp(ctx, SP.gold, cx, cy, (C.FR - C.FL) * W.w * 0.7, k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 多比雅的家具被抛出去（13:8，装饰性的补间）
  function drawToss(ctx) {
    if (!tweening('toss')) return;
    const G = geo(), t = templeG(G), k = tv('toss', 1), ph = G.ph;
    ctx.fillStyle = css([96, 72, 50], 2, 1, NIGHT_EX());
    for (let i = 0; i < 4; i++) {
      const u = clamp((k - i * 0.12) / 0.6, 0, 1);
      if (u <= 0 || u >= 1) continue;
      const x0 = t.room, y0 = t.top - 0.3 * ph, x1 = (0.9 + 0.02 * i) * W.w, y1 = G.c(0.9 + 0.02 * i) + ph * 0.3;
      const x = lerp(x0, x1, u), y = lerp(y0, y1, u) - Math.sin(u * Math.PI) * ph * 0.9, a = u * 7 + i;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.fillRect(-0.1 * ph, -0.06 * ph, 0.2 * ph, 0.12 * ph);
      ctx.restore();
    }
  }
  // 麻衣、灰尘（9:1）：众人头上淡淡的尘
  function drawSack(ctx) {
    const k = W.lv.neSack;
    if (k < 0.01) return;
    SP || sprites();
    const day = 0.35 + 0.65 * W.daylight;
    for (let i = 0; i < 12; i++) {
      const xf = lerp(0.47, 0.72, rt(i + 900)), y = fieldY(xf, 0.3 + 0.4 * rt(i + 920)) - PH(2) * (1.1 + 0.5 * U.fract(W.t * 0.05 + rt(i + 940)));
      glowSp(ctx, SP.dust, xf * W.w + Math.sin(W.t * 0.3 + i) * 6, y, PH(2) * (0.8 + 0.6 * rt(i + 960)), k * 0.3 * day);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  称谢的人、修造的人：站在墙头
  // ════════════════════════════════════════════════════════════
  const choirGap = G => (G.ph * 0.5) / Math.max(1, wallPath(G).A.len);
  function choirPos(side, j) {
    const G = geo(), P = wallPath(G), p = side > 0 ? P.A : P.B, N = 7, gap = choirGap(G);
    const s = gap * (N - 1 - j) + W.lv.neChoir * (1 - gap * (N - 1));
    return pathAt(p, s);
  }
  function attachChoir(gid, side) {
    crowdAttach(gid, (j, m) => () => {
      const q = choirPos(side, j), G = geo();
      const moving = W.lv.neChoir > 0.001 && W.lv.neChoir < 0.999;
      if (moving && q[2]) m.facing = q[2];
      // 越往山脊（越远）越小
      const depthK = clamp((G.g(q[0] / W.w) - q[1] - G.WH) / Math.max(1, G.g(C.TX) - G.plat - G.WH), 0, 1);
      m.scale = 1 - 0.2 * depthK;
      return [q[0], q[1]];
    });
  }
  const BLD_X = [0.583, 0.628, 0.668, 0.708, 0.815, 0.842, 0.885, 0.912, 0.948];
  function attachBuilders() {
    crowdAttach('bld', j => () => { const xf = BLD_X[j % BLD_X.length]; return [xf * W.w, frontTop(xf)]; });
    crowdAttach('bldc', j => () => { const xf = [0.656, 0.683, 0.704][j % 3]; return [xf * W.w, crestTop(xf)]; });
  }
  // 从墙头 / 木台上下来：先解开，再落到地上（看着时是一段短短的下行）
  function descend(b, id, x) {
    const f = fig(id);
    if (!f) return;
    const ay = f._ay;
    attach(id, null);
    if (!b.instant && ay != null && isFinite(ay)) f.ny = ay / W.h;
    pose(id, 'walk');
    const c = CA();
    if (c.fly) c.fly(id, x, null, { dur: 1.6, pose: 'stand' });
  }
  function onPulpit(id, dx) { attach(id, () => { const P = pulpitG(); return [P.x + dx * W.w, P.top - 1]; }); }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {
      GC = null;
      if (!isCur()) return;
      originVeg();
    },
    update(dt) {
      if (!isCur()) return;
      for (const k in TW) if (W.t - TW[k].t0 > TW[k].dur + 1) delete TW[k];
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'far') { drawVillages(ctx); drawVision(ctx); drawPillar(ctx); return; }
      if (pass === 'mid') { drawFoe(ctx, 1); return; }
      if (pass === 'near') {
        drawPalace(ctx);
        drawCity(ctx);
        drawHoly(ctx);
        drawGroundBooths(ctx);
        drawFoe(ctx, 2);
        drawPulpit(ctx);
        return;
      }
      if (pass === 'air') {
        drawChoirTrail(ctx);
        drawProps(ctx);
        drawLawScroll(ctx);
        drawToss(ctx);
        drawSack(ctx);
        drawPray(ctx);
        drawHand(ctx);
        drawJoy(ctx);
        drawGather(ctx);
      }
    },
    draw() {},
    reset() { for (const k in TW) delete TW[k]; },
    restore() { for (const k in TW) delete TW[k]; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      if (W.lv.neSusa > 0.5) { const P = palaceG(); cand('书珊的宫', 0.78 * W.w, P.colTop + P.ph * 0.6); }
      if (W.lv.neJeru > 0.5) {
        const G = geo();
        cand('耶路撒冷', 0.66 * W.w, lerp(G.c(0.66), G.g(0.66), 0.25));
        cand('耶路撒冷', 0.86 * W.w, lerp(G.c(0.86), G.g(0.86), 0.25));
        const t = templeG(G);
        cand('神的殿', (t.sx0 + t.sx1) / 2, t.top - t.sh * 0.6);
        cand('祭坛', t.ax, t.top - t.cw - t.ah);
        for (const sg of G.front.concat(G.crest)) {
          const xm = (sg.xa + sg.xb) / 2, top = sg.row === 'front' ? frontTop(xm) : crestTop(xm);
          const lab = sg.name || (W.lv.neWall > 0.97 ? '城墙' : '拆毁的城墙');
          cand(lab, xm * W.w, top + G.ph * 0.3);
        }
        if (W.lv.neBooths > 0.5) for (const q of GBOOTH) cand('棚', q[0] * W.w, fieldY(q[0], q[1]) - G.ph * 0.6);
      }
      if (W.lv.nePulpit > 0.5) { const P = pulpitG(); cand('木台', P.x, P.top + 4); }
      if (W.lv.neVision > 0.3) { const v = visionPt(); cand('我名的居所', v[0], v[1] - 8); }
      return best;
    },
    // 给走查器：本卷的状态摘要（看完 == 直接恢复）
    sig() { return Object.assign({}, S); },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：书珊城的宫，基斯流月的黄昏（1:1）
  // ════════════════════════════════════════════════════════════
  function originVeg() {
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
  }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.7, herbs: 0.55, trees: 0.22, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0.1,
      bare: 0.28, bloom: 0.55,
      neSusa: 1, neJeru: 0, neVision: 0, neGather: 0, neHand: 0, nePray: 0, neWall: 0, neGlow: 0, neDoors: 0, neShut: 0, neHouses: 0.2, neLamps: 0.3,
      neBooths: 0, neFoe: 0, nePulpit: 0, neScroll: 0, nePillar: 0, neCovenant: 0, neVillage: 0, neChoir: 0, neJoy: 0, neAltar: 0, neHoly: 0, neSack: 0, neClean: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    originVeg();
    W.goTo(0.7, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    for (const k in TW) delete TW[k];
    S = fresh();
    GC = null;
    const c = CA();
    c.clear({ fade: false });
    add('neh', { label: '尼希米', sex: 'm', age: 'adult', x: X.nehS, v: 0.14, facing: 1, robe: ROBE.neh, accent: [214, 190, 120], glow: 0.45, from: 'none' });
    add('guard1', { label: '王的护卫', sex: 'm', age: 'adult', x: 0.62, v: 0.02, facing: 1, robe: ROBE.guard, accent: [200, 170, 110], glow: 0.05, prop: 'staff', from: 'none' });
    add('guard2', { label: '王的护卫', sex: 'm', age: 'adult', x: 0.945, v: 0.02, facing: -1, robe: ROBE.guard, accent: [200, 170, 110], glow: 0.05, prop: 'staff', from: 'none' });
    avoid([0.42, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟），故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const B = '尼希米记 ';
  const INTRO = [
    { text: '哈迦利亚的儿子尼希米的言语如下：<br>亚达薛西王二十年基斯流月，我在书珊城的宫中。', ref: B + '1:1', hold: 6 },
  ];
  const V1 = [
    { text: '那时，有我一个弟兄哈拿尼，同着几个人从犹大来……<br>他们对我说：「……耶路撒冷的城墙拆毁，城门被火焚烧。」', ref: B + '1:2–3', hold: 6.5 },
    { text: '我听见这话，就坐下哭泣，悲哀几日，<br>在天上的神面前禁食祈祷……', ref: B + '1:4', hold: 5.5 },
    { text: '「求你记念所吩咐你仆人摩西的话，说：『……你们被赶散的人虽在天涯，<br>我也必从那里将他们招聚回来，带到我所选择立为我名的居所。』」', ref: B + '1:8–9', hold: 7.5 },
    { text: '「主啊，求你侧耳听你仆人的祈祷……使你仆人现今亨通，在王面前蒙恩。」<br>我是作王酒政的。', ref: B + '1:11', hold: 6 },
  ];
  const V2 = [
    { text: '亚达薛西王二十年尼散月，在王面前摆酒，我拿起酒来奉给王……<br>王对我说：「你既没有病，为什么面带愁容呢？」', ref: B + '2:1–2', hold: 6.5 },
    { text: '王问我说：「你要求什么？」于是我默祷天上的神。我对王说：<br>「……求王差遣我往犹大，到我列祖坟墓所在的那城去，我好重新建造。」', ref: B + '2:4–5', hold: 7.5 },
    { text: '那时王后坐在王的旁边……于是王喜欢差遣我去……<br>王就允准我，因我神施恩的手帮助我。', ref: B + '2:6–8', hold: 6 },
    { text: '王派了军长和马兵护送我。<br>我到了河西的省长那里，将王的诏书交给他们。', ref: B + '2:9', hold: 5 },
  ];
  const V3 = [
    { text: '我到了耶路撒冷，在那里住了三日。我夜间起来，有几个人也一同起来；<br>但神使我心里要为耶路撒冷做什么事，我并没有告诉人。', ref: B + '2:11–12', hold: 7.5 },
    { text: '当夜我出了谷门，往野狗井去，到了粪厂门，<br>察看耶路撒冷的城墙，见城墙拆毁，城门被火焚烧。', ref: B + '2:13', hold: 7 },
    { text: '我又往前，到了泉门和王池，但所骑的牲口没有地方过去。<br>于是夜间沿溪而上，察看城墙，又转身进入谷门，就回来了。', ref: B + '2:14–15', hold: 7.5 },
  ];
  const V4 = [
    { text: '我对他们说：「……耶路撒冷怎样荒凉，城门被火焚烧，你们都看见了。<br>来吧，我们重建耶路撒冷的城墙，免得再受凌辱！」', ref: B + '2:17', hold: 6.5 },
    { text: '他们就说：「我们起来建造吧！」于是他们奋勇做这善工。', ref: B + '2:18', hold: 4.5 },
    { text: '但和伦人参巴拉，并为奴的亚扪人多比雅和阿拉伯人基善听见就嗤笑我们……<br>我回答他们说：「天上的神必使我们亨通。我们作他仆人的，要起来建造……」', ref: B + '2:19–20', hold: 7.5 },
    { text: '那时，大祭司以利亚实和他的弟兄众祭司起来建立羊门……<br>其次是管理耶路撒冷那一半、哈罗黑的儿子沙龙和他的女儿们修造。', ref: B + '3:1–12', hold: 6.5 },
  ];
  const V5 = [
    { text: '这样，我们修造城墙，城墙就都连络，高至一半，因为百姓专心做工。', ref: B + '4:6', hold: 5 },
    { text: '参巴拉、多比雅、阿拉伯人、亚扪人、亚实突人……就甚发怒……<br>然而，我们祷告我们的神，又因他们的缘故，就派人看守，昼夜防备。', ref: B + '4:7–9', hold: 6.5 },
    { text: '修造城墙的，扛抬材料的，都一手做工一手拿兵器。<br>修造的人都腰间佩刀修造，吹角的人在我旁边。', ref: B + '4:17–18', hold: 6 },
    { text: '「……你们听见角声在哪里，就聚集到我们那里去。我们的神必为我们争战。」<br>于是，我们做工，一半拿兵器，从天亮直到星宿出现的时候。', ref: B + '4:20–21', hold: 7.5 },
  ];
  const V6 = [
    { text: '众人说：「我们必归还，不再向他们索要，必照你的话行。」……<br>会众都说：「阿们！」又赞美耶和华。', ref: B + '5:12–13', hold: 6 },
    { text: '于是我差遣人去见他们，说：「我现在办理大工，不能下去。<br>焉能停工下去见你们呢？」', ref: B + '6:3', hold: 5.5 },
    { text: '以禄月二十五日，城墙修完了，共修了五十二天。', ref: B + '6:15', hold: 5.5 },
    { text: '我们一切仇敌、四围的外邦人听见了便惧怕，愁眉不展；<br>因为见这工作完成是出乎我们的神。', ref: B + '6:16', hold: 6.5 },
  ];
  const V7 = [
    { text: '城墙修完，我安了门扇，守门的、歌唱的，和利未人都已派定。', ref: B + '7:1', hold: 5.5 },
    { text: '我吩咐他们说：「等到太阳上升才可开耶路撒冷的城门；<br>人尚看守的时候就要关门上闩……」', ref: B + '7:3', hold: 5.5 },
    { text: '城是广大，其中的民却稀少，房屋还没有建造。<br>我的神感动我心，招聚贵胄、官长，和百姓，要照家谱计算。', ref: B + '7:4–5', hold: 7 },
    { text: '会众共有四万二千三百六十名……<br>于是祭司、利未人……并以色列众人，各住在自己的城里。', ref: B + '7:66–73', hold: 6 },
  ];
  const V8 = [
    { text: '到了七月……他们如同一人聚集在水门前的宽阔处，<br>请文士以斯拉将耶和华藉摩西传给以色列人的律法书带来。', ref: B + '8:1', hold: 6.5 },
    { text: '在水门前的宽阔处，从清早到晌午，在众男女、一切听了能明白的人面前读这律法书。<br>众民侧耳而听。', ref: B + '8:3', hold: 6.5 },
    { text: '以斯拉站在众民以上，在众民眼前展开这书。<br>他一展开，众民就都站起来。', ref: B + '8:5', hold: 5 },
    { text: '以斯拉称颂耶和华至大的神；众民都举手应声说：「阿们！阿们！」<br>就低头，面伏于地，敬拜耶和华。', ref: B + '8:6', hold: 6.5 },
  ];
  const V9 = [
    { text: '……对众民说：「今日是耶和华你们神的圣日，不要悲哀哭泣。」<br>这是因为众民听见律法书上的话都哭了；', ref: B + '8:9', hold: 6 },
    { text: '「你们去吃肥美的，喝甘甜的，有不能预备的就分给他，因为今日是我们主的圣日。<br>你们不要忧愁，因靠耶和华而得的喜乐是你们的力量。」', ref: B + '8:10', hold: 7.5 },
    { text: '众民都去吃喝，也分给人，大大快乐，<br>因为他们明白所教训他们的话。', ref: B + '8:12', hold: 5 },
    { text: '于是百姓出去，取了树枝来，各人在自己的房顶上，或院内，或神殿的院内，<br>或水门的宽阔处，或以法莲门的宽阔处搭棚……于是众人大大喜乐。', ref: B + '8:16–17', hold: 7.5 },
  ];
  const V10 = [
    { text: '这月二十四日，以色列人聚集禁食，身穿麻衣，头蒙灰尘……<br>站着承认自己的罪恶和列祖的罪孽。', ref: B + '9:1–2', hold: 6 },
    { text: '「你，惟独你是耶和华！你造了天和天上的天，并天上的万象……<br>这一切都是你所保存的。天军也都敬拜你。」', ref: B + '9:6', hold: 6.5 },
    { text: '「你还是大施怜悯，在旷野不丢弃他们。白昼，云柱不离开他们，仍引导他们行路；<br>黑夜，火柱也不离开他们，仍照亮他们当行的路。」', ref: B + '9:19', hold: 7.5 },
    { text: '因这一切的事，我们立确实的约，写在册上。<br>我们的首领、利未人，和祭司都签了名。', ref: B + '9:38', hold: 5.5 },
  ];
  const V11 = [
    { text: '……发咒起誓，必遵行神藉他仆人摩西所传的律法……<br>又定每年将我们地上初熟的土产和各样树上初熟的果子都奉到耶和华的殿里。', ref: B + '10:29–35', hold: 7.5 },
    { text: '百姓的首领住在耶路撒冷。其余的百姓掣签，每十人中使一人来住在圣城耶路撒冷，<br>那九人住在别的城邑。', ref: B + '11:1', hold: 7 },
    { text: '凡甘心乐意住在耶路撒冷的，百姓都为他们祝福。', ref: B + '11:2', hold: 5 },
  ];
  const V12 = [
    { text: '耶路撒冷城墙告成的时候，众民就把各处的利未人招到耶路撒冷，<br>要称谢、歌唱、敲钹、鼓瑟、弹琴，欢欢喜喜地行告成之礼。', ref: B + '12:27', hold: 6.5 },
    { text: '我带犹大的首领上城，使称谢的人分为两大队，排列而行……<br>第二队称谢的人要与那一队相迎而行。', ref: B + '12:31–38', hold: 6 },
    { text: '于是，这两队称谢的人连我和官长的一半，站在神的殿里。', ref: B + '12:40', hold: 5 },
    { text: '那日，众人献大祭而欢乐；因为神使他们大大欢乐，连妇女带孩童也都欢乐，<br>甚至耶路撒冷中的欢声听到远处。', ref: B + '12:43', hold: 7.5 },
  ];
  const V13 = [
    { text: '当日，人念摩西的律法书给百姓听……<br>因为他们……雇了巴兰咒诅他们，但我们的神使那咒诅变为祝福。', ref: B + '13:1–2', hold: 6.5 },
    { text: '我甚恼怒，就把多比雅的一切家具从屋里都抛出去，<br>吩咐人洁净这屋子，遂将神殿的器皿和素祭、乳香又搬进去。', ref: B + '13:8–9', hold: 6.5 },
    { text: '在安息日的前一日，耶路撒冷城门有黑影的时候，我就吩咐人将门关锁，<br>不过安息日不准开放……', ref: B + '13:19', hold: 6 },
    { text: '我又派百姓按定期献柴和初熟的土产。<br>我的神啊，求你记念我，施恩与我。', ref: B + '13:31', hold: 6.5 },
  ];

  // ── 情节的助手 ──────────────────────────────────────────────
  const JUDAH = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [120, 100, 84], [140, 96, 80], [158, 138, 108]];
  function people(b, gid, n, x0, x1, v, o) {
    crowd(gid, Object.assign({ n, x0, x1, layer: 2, v, label: '百姓', from: fromOf(b) }, o || {}));
    members(gid).forEach(m => { m.robe0 = m.robe; });
  }
  function hideSusa(b) {
    for (const id of ['king', 'queen', 'guard1', 'guard2', 'captain', 'camel', 'hanani', 'jud1', 'jud2']) rm(id, b.instant);
    S.throne = false; S.cup = false; S.letter = false;
  }

  // ════════════════════════════════════════════════════════════
  //  十三句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 我也必从那里将他们招聚回来（1:1–11）── 书珊的宫，哭泣与祈祷；散在天涯的光聚回 ──
    {
      kind: 'promise', utter: '我也必从那里将他们招聚回来', cmd: 'git fetch --all 天涯  # 被赶散的人', ref: '1:9', tint: [255, 226, 176],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.79, 9, b.instant);
            const f = fromOf(b);
            add('hanani', { label: '哈拿尼', sex: 'm', age: 'adult', x: 1.03, v: 0.2, facing: -1, robe: ROBE.hanani, glow: 0.15, prop: 'staff', from: f });
            add('jud1', { label: '从犹大来的人', sex: 'm', age: 'elder', x: 1.06, v: 0.26, facing: -1, robe: [112, 98, 82], glow: 0.08, from: f });
            add('jud2', { label: '从犹大来的人', sex: 'm', age: 'adult', x: 1.09, v: 0.16, facing: -1, robe: [136, 118, 90], glow: 0.08, prop: 'bundle', from: f });
            walk('hanani', 0.745, { speed: 0.04 }); walk('jud1', 0.77, { speed: 0.038 }); walk('jud2', 0.79, { speed: 0.04 });
            face('neh', 1);
          }],
          [L[0] + 4.5, () => { pose('hanani', 'point'); face('neh', 1); }],
          [L[1], b => {
            pose('hanani', 'bow'); pose('jud1', 'bow');
            pose('neh', 'sit', { weep: true });
            W.goTo(0.93, 9, b.instant);
            sfx(b, 'weep', { soft: true });
          }],
          [L[2], b => {
            // 夜里向西（耶路撒冷的方向）跪祷；散在天涯的光聚回
            pose('neh', 'pray'); face('neh', 1);
            W.set('neGather', 1, b.instant);
            W.set('neVision', 1, b.instant);
            sfx(b, 'stars'); sfx(b, 'angel', { soft: true });
          }],
          [L[3], () => {
            walk('hanani', 1.06, { speed: 0.03 }); walk('jud1', 1.08, { speed: 0.03 }); walk('jud2', 1.1, { speed: 0.03 });
          }],
          [L[3] + 5.5, b => { rm('hanani', b.instant); rm('jud1', b.instant); rm('jud2', b.instant); }],
        ]);
      },
    },

    // ── 2 · 因我神施恩的手帮助我（2:1–10）── 王前摆酒、默祷、诏书；向西去 ──
    {
      kind: 'act', utter: '因我神施恩的手帮助我', cmd: 'sudo 亚达薛西 --grant 诏书 木料  # 施恩的手', ref: '2:8', tint: [255, 222, 160],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.4, 6, b.instant);
            W.set('neVision', 0.4, b.instant);
            const f = fromOf(b);
            S.throne = true;
            add('king', { label: '亚达薛西王', sex: 'm', age: 'adult', x: X.throne, v: 0.06, facing: -1, pose: 'seat', robe: ROBE.king, accent: [236, 196, 110], glow: 0.12, from: f });
            add('queen', { label: '王后', sex: 'f', age: 'adult', x: X.queen, v: 0.06, facing: -1, pose: 'seat', robe: ROBE.queen, accent: [236, 196, 110], glow: 0.1, from: f });
            pose('neh', 'stand');
            walk('neh', 0.72, { speed: 0.02 });
            S.cup = true;
          }],
          [1.5, () => { walk('neh', 0.8, { speed: 0.02, pose: 'carry' }); }],
          [L[1], b => { pose('neh', 'gaze'); W.set('nePray', 1, b.instant); sfx(b, 'chime', { soft: true }); }],
          [L[1] + 3.5, b => { W.set('nePray', 0, b.instant); pose('neh', 'bow'); }],
          [L[2], b => {
            S.cup = false; S.letter = true;
            tween(b, 'letter', 0, 1, 2.2);
            pose('neh', 'stand');
            W.set('neHand', 1, b.instant);
            sfx(b, 'harp');
          }],
          [L[2] + 3, b => { W.goTo(0.72, 9, b.instant); }],
          [L[3], b => {
            // 军长和马兵护送；驼着王园林的木料；尼希米骑上牲口，向西，往落日去
            W.set('neHand', 0.3, b.instant);
            W.set('neVision', 0.7, b.instant);
            const f = fromOf(b);
            animal('donkey', 'donkey', 0.8, { v: 0.2, facing: 1, label: '尼希米骑的牲口', from: f });
            add('captain', { label: '军长', sex: 'm', age: 'adult', x: 0.74, v: 0.24, facing: 1, robe: ROBE.captain, accent: [200, 170, 110], glow: 0.06, prop: 'staff', from: f });
            animal('camel', 'camel', 0.7, { v: 0.14, facing: 1, pack: true, label: '驮木料的骆驼', from: f });
          }],
          [L[3] + 0.6, () => {
            ride('neh', 'donkey');
            walk('donkey', 1.04, { speed: 0.06 }); walk('captain', 1.07, { speed: 0.062 }); walk('camel', 1.06, { speed: 0.062 });
          }],
        ]);
      },
    },

    // ── 3 · 神使我心里要为耶路撒冷做什么事（2:11–16）── 月夜，察看拆毁的城墙 ──
    {
      kind: 'act', utter: '神使我心里要为耶路撒冷做什么事', cmd: 'ssh 耶路撒冷 --night --audit 城墙', ref: '2:12', tint: [214, 226, 255],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.1, 5, b.instant);
            W.set('neSusa', 0, b.instant); W.set('neJeru', 1, b.instant); W.set('neVision', 0, b.instant); W.set('neHand', 0, b.instant);
            hideSusa(b);
            ride('neh', null);
            rm('donkey', true); rm('neh', true);
            W.set('bare', 0.4, b.instant); W.set('bloom', 0.35, b.instant);
            avoid([0.42, 1]);
          }],
          [2, b => {
            const f = fromOf(b);
            animal('donkey', 'donkey', X.valley, { v: 0.1, facing: 1, label: '尼希米骑的牲口', from: f });
            add('neh', { label: '尼希米', sex: 'm', age: 'adult', x: X.valley, v: 0.1, facing: 1, robe: ROBE.neh, accent: [214, 190, 120], glow: 0.5, from: f });
            ride('neh', 'donkey');
            add('comp1', { label: '同去的人', sex: 'm', age: 'adult', x: X.valley - 0.02, v: 0.16, facing: 1, robe: [110, 96, 84], glow: 0.1, prop: 'torch', from: f });
            add('comp2', { label: '同去的人', sex: 'm', age: 'adult', x: X.valley - 0.035, v: 0.08, facing: 1, robe: [96, 88, 80], glow: 0.08, from: f });
          }],
          [3, () => {
            walk('donkey', X.dung, { speed: 0.02 });
            walk('comp1', X.dung - 0.022, { speed: 0.02 }); walk('comp2', X.dung - 0.036, { speed: 0.02 });
          }],
          [L[1] + 1.5, () => {
            walk('donkey', X.fount - 0.012, { speed: 0.018 });
            walk('comp1', X.fount - 0.034, { speed: 0.018 }); walk('comp2', X.fount - 0.048, { speed: 0.018 });
          }],
          [L[2] + 0.8, b => { face('neh', -1); sfx(b, 'donkey', { soft: true }); }],
          [L[2] + 2, () => {
            walk('donkey', X.valley + 0.004, { speed: 0.034 });
            walk('comp1', X.valley + 0.03, { speed: 0.034 }); walk('comp2', X.valley + 0.045, { speed: 0.034 });
          }],
        ]);
      },
    },

    // ── 4 · 天上的神必使我们亨通（2:17–3:32）── 「我们起来建造吧」，各家各段修造 ──
    {
      kind: 'bless', utter: '天上的神必使我们亨通', cmd: 'git init 城墙 && git commit -m "我们起来建造吧"', ref: '2:20', tint: [255, 230, 184],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            W.goTo(0.3, 6, b.instant);
            ride('neh', null); rm('donkey', b.instant); rm('comp1', b.instant); rm('comp2', b.instant);
            add('neh', { x: X.valley - 0.01, v: 0.14, facing: -1, pose: 'raise' });
            add('eliashib', { label: '大祭司以利亚实', sex: 'm', age: 'elder', x: 0.66, v: 0.14, facing: 1, robe: ROBE.priest, accent: [90, 110, 170], glow: 0.25, from: fromOf(b) });
            people(b, 'judah', 9, 0.6, 0.73, 0.42);
            people(b, 'judah2', 7, 0.79, 0.92, 0.36);
            crowdFace('judah', X.valley); crowdFace('judah2', X.valley);
          }],
          [L[1], b => { crowdPose('judah', 'raise'); crowdPose('judah2', 'raise'); pose('eliashib', 'raise'); sfx(b, 'crowd'); }],
          [L[1] + 3.5, () => { crowdPose('judah', 'stand'); crowdPose('judah2', 'stand'); pose('eliashib', 'stand'); pose('neh', 'stand'); }],
          [L[2], b => {
            // 参巴拉、多比雅、基善在城外嗤笑
            const f = fromOf(b);
            add('sanballat', { label: '参巴拉', sex: 'm', age: 'adult', x: 0.44, v: 0.24, facing: 1, robe: ROBE.sanb, accent: [150, 60, 60], glow: 0.03, from: f });
            add('tobiah', { label: '多比雅', sex: 'm', age: 'adult', x: 0.42, v: 0.3, facing: 1, robe: ROBE.tobiah, glow: 0.03, from: f });
            add('geshem', { label: '基善', sex: 'm', age: 'adult', x: 0.4, v: 0.18, facing: 1, robe: ROBE.geshem, accent: [220, 200, 160], glow: 0.03, from: f });
            walk('sanballat', 0.52, { speed: 0.03, pose: 'point' }); walk('tobiah', 0.5, { speed: 0.03, pose: 'point' }); walk('geshem', 0.485, { speed: 0.028 });
            sfx(b, 'laugh', { soft: true });
          }],
          [L[2] + 4, b => { walk('neh', 0.62, { speed: 0.03, pose: 'raise' }); face('neh', -1); }],
          [L[2] + 7.5, () => { walk('sanballat', 0.41, { speed: 0.03 }); walk('tobiah', 0.4, { speed: 0.03 }); walk('geshem', 0.39, { speed: 0.03 }); }],
          [L[3], b => {
            // 各家各段修造：羊门、鱼门……名字一个个亮在墙上
            pose('neh', 'stand');
            W.set('neWall', 0.22, b.instant);
            people(b, 'bld', 9, 0.58, 0.95, 0, { label: '修造城墙的', robe: null });
            people(b, 'bldc', 3, 0.65, 0.7, 0, { label: '祭司', robe: ROBE.priest });
            attachBuilders();
            crowdPose('bld', 'carry'); crowdPose('bldc', 'carry');
            walk('eliashib', 0.69, { speed: 0.02, pose: 'point' });
            crowdPose('judah', 'carry'); crowdPose('judah2', 'carry');
            sfx(b, 'build');
            if (!b.instant) {
              const G = geo();
              const names = [['羊门', G.crest[3], 1], ['鱼门', G.crest[5], 1], ['谷门', G.front[6], 0], ['粪厂门', G.front[9], 0], ['泉门', G.front[11], 0], ['水门', G.front[1], 0]];
              names.forEach((q, i) => {
                const xm = (q[1].xa + q[1].xb) / 2, y = q[2] ? G.c(xm) - G.WHc * 1.1 : G.g(xm) - G.WH * 1.25;
                nameHere(b, q[0], xm * W.w, y, [255, 232, 186], { size: 0.022, hold: 2.2, delay: i * 0.8, quiet: i > 0 });
              });
            }
          }],
          [L[3] + 4, b => { rm('sanballat', b.instant); rm('tobiah', b.instant); rm('geshem', b.instant); }],
        ]);
      },
    },

    // ── 5 · 我们的神必为我们争战（4:1–23）── 高至一半；一手做工一手拿兵器；吹角 ──
    {
      kind: 'promise', utter: '我们的神必为我们争战', cmd: 'while (建造) { 一手做工(); 一手拿兵器(); }', ref: '4:20', tint: [255, 214, 170],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.48, 5, b.instant);
            W.set('neWall', 0.5, b.instant);
            crowdPose('bld', 'carry'); crowdPose('bldc', 'carry');
            uncrowd('judah2', b.instant);
            crowdWalk('judah', 0.6, 0.76, { speed: 0.02, pose: 'carry' });
            rm('eliashib', b.instant);
            walk('neh', 0.7, { speed: 0.02 });
            sfx(b, 'build');
          }],
          [L[1], b => {
            // 城外敌营
            W.set('neFoe', 1, b.instant);
            W.goTo(0.72, 9, b.instant);
            people(b, 'foe', 5, 0.425, 0.505, 0.26, { label: '仇敌', robe: [70, 58, 60], glow: 0 });
            crowdProp('foe', 'staff'); crowdFace('foe', 1);
            crowdPose('judah', 'pray'); crowdPose('bld', 'pray');
            sfx(b, 'fire', { soft: true });
          }],
          [L[1] + 3.5, () => { crowdPose('judah', 'carry'); crowdPose('bld', 'carry'); }],
          [L[2], b => {
            // 一手做工一手拿兵器；吹角的人在我旁边
            crowdProp('bld', 'staff'); crowdProp('judah', 'staff');
            propOf('neh', 'staff'); face('neh', -1);
            add('horn', { label: '吹角的人', sex: 'm', age: 'adult', x: 0.722, v: 0.18, facing: -1, robe: [150, 132, 104], glow: 0.12, from: fromOf(b) });
            S.horn = true;
          }],
          [L[3], b => {
            tween(b, 'blow', 0, 1, 2.5);
            pose('horn', 'raise');
            const p = figPt('horn', 0.9);
            if (p) { ringAt(b, p[0], p[1], [255, 226, 170], M() * 0.35, 2.6, 2); ringAt(b, p[0], p[1], [255, 236, 200], M() * 0.2, 1.8, 1.2); }
            sfx(b, 'chime'); sfx(b, 'angel', { soft: true });
            crowdFace('judah', 0.72);
          }],
          [L[3] + 3, b => {
            pose('horn', 'stand');
            W.set('neWall', 0.62, b.instant);
            W.set('neFoe', 0, b.instant);
            uncrowd('foe', b.instant);
            W.goTo(0.88, 6, b.instant);
          }],
        ]);
      },
    },

    // ── 6 · 这工作完成是出乎我们的神（5:1–6:19）── 阿们；我现在办理大工；五十二天，城墙修完 ──
    {
      kind: 'act', utter: '这工作完成是出乎我们的神', cmd: 'make 城墙 --days 52  # build passed', ref: '6:16', tint: [255, 226, 160],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.34, 5, b.instant);
            S.horn = false; rm('horn', b.instant);
            propOf('neh', null); walk('neh', 0.64, { speed: 0.03, pose: 'raise' });
            people(b, 'poor', 7, 0.47, 0.58, 0.44, { label: '百姓' });
            people(b, 'nobles', 4, 0.555, 0.61, 0.24, { label: '贵胄和官长', robe: ROBE.noble });
            crowdFace('poor', 1); crowdFace('nobles', 1);
            crowdPose('nobles', 'bow');
            crowdWalk('judah', 0.66, 0.78, { speed: 0.02, pose: 'carry' });
          }],
          [L[0] + 4.5, b => { crowdPose('poor', 'raise'); crowdPose('nobles', 'raise'); pose('neh', 'stand'); sfx(b, 'crowd'); }],
          [L[1] - 1, b => {
            crowdPose('poor', 'stand'); crowdPose('nobles', 'stand');
            // 尼希米上到墙上做工，不肯下去
            const c = CA();
            if (c.fly && fig('neh')) { pose('neh', 'walk'); c.fly('neh', 0.705, frontTop(0.705) / W.h, { dur: 1.8, pose: 'carry' }); }
            add('msg', { label: '参巴拉差来的人', sex: 'm', age: 'adult', x: 0.44, v: 0.3, facing: 1, robe: ROBE.sanb, glow: 0.02, from: fromOf(b) });
            walk('msg', 0.66, { speed: 0.04, pose: 'point' });
          }],
          [L[1] + 1, () => { attach('neh', () => [0.705 * W.w, frontTop(0.705)]); pose('neh', 'carry'); }],
          [L[1] + 4, () => { pose('neh', 'point'); face('neh', -1); }],
          [L[1] + 6.5, b => { walk('msg', 0.42, { speed: 0.04 }); pose('neh', 'carry'); uncrowd('poor', b.instant); uncrowd('nobles', b.instant); }],
          [L[2], b => {
            // 日子飞逝：五十二天
            W.goTo(0.3, 3.4, b.instant);
            W.set('neWall', 1, b.instant);
            rm('msg', b.instant);
            sfx(b, 'build');
          }],
          [L[2] + 3.5, b => { W.goTo(0.3, 3.4, b.instant); }],
          [L[2] + 7, b => { W.goTo(0.38, 2, b.instant); }],
          [L[3], b => {
            W.set('neGlow', 1, b.instant);
            crowdPose('bld', 'raise'); crowdPose('bldc', 'raise'); crowdPose('judah', 'raise');
            pose('neh', 'raise');
            const G = geo();
            ringAt(b, C.TX * W.w, lerp(G.plat, G.g(C.TX), 0.5), [255, 226, 160], M() * 0.45, 3, 2);
            sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
            add('sanballat', { label: '参巴拉', sex: 'm', age: 'adult', x: 0.46, v: 0.26, facing: 1, robe: ROBE.sanb, accent: [150, 60, 60], glow: 0.03, pose: 'bow', from: fromOf(b) });
            add('tobiah', { label: '多比雅', sex: 'm', age: 'adult', x: 0.44, v: 0.32, facing: 1, robe: ROBE.tobiah, glow: 0.03, pose: 'bow', from: fromOf(b) });
          }],
          [L[3] + 4, b => { W.set('neGlow', 0.25, b.instant); walk('sanballat', 0.38, { speed: 0.02 }); walk('tobiah', 0.37, { speed: 0.02 }); }],
          [L[3] + 6.5, b => { rm('sanballat', b.instant); rm('tobiah', b.instant); }],
        ]);
      },
    },

    // ── 7 · 我的神感动我心（7:1–73）── 安门扇、派守门的；城大民少；家谱；各住在自己的城里 ──
    {
      kind: 'act', utter: '我的神感动我心', cmd: 'chmod 755 城门 && cron "日出开门"', ref: '7:5', tint: [240, 226, 196],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.goTo(0.46, 4, b.instant);
            W.set('neGlow', 0.15, b.instant);
            W.set('neDoors', 1, b.instant);
            descend(b, 'neh', 0.735);
            uncrowd('bld', b.instant); uncrowd('bldc', b.instant);
            crowdProp('judah', null);
            crowdWalk('judah', 0.52, 0.62, { speed: 0.02 });
            const f = fromOf(b);
            add('keep1', { label: '守门的', sex: 'm', age: 'adult', x: X.valley + 0.028, v: 0.04, facing: -1, robe: [120, 106, 90], glow: 0.1, prop: 'staff', from: f });
            add('keep2', { label: '守门的', sex: 'm', age: 'adult', x: X.water + 0.026, v: 0.04, facing: -1, robe: [110, 98, 86], glow: 0.1, prop: 'staff', from: f });
            add('keep3', { label: '守门的', sex: 'm', age: 'elder', x: X.dung + 0.026, v: 0.04, facing: -1, robe: [128, 110, 92], glow: 0.1, prop: 'staff', from: f });
            add('hanani', { label: '哈拿尼', sex: 'm', age: 'adult', x: 0.705, v: 0.18, facing: 1, robe: ROBE.hanani, glow: 0.2, from: f });
            people(b, 'lev', 5, 0.8, 0.9, 0.2, { label: '歌唱的和利未人', robe: ROBE.levite });
            crowdFace('lev', -1);
            sfx(b, 'gate');
          }],
          [L[1], b => { pose('neh', 'point'); face('neh', -1); W.goTo(0.79, 9, b.instant); }],
          [L[1] + 4.5, b => { W.set('neShut', 1, b.instant); pose('neh', 'stand'); sfx(b, 'gate', { soft: true }); }],
          [L[2], b => {
            // 家谱上的名字，一个个升起
            if (!b.instant) {
              const G = geo();
              ['所罗巴伯', '耶书亚', '尼希米', '亚撒利雅', '末底改'].forEach((n, i) => {
                const xf = [0.63, 0.7, 0.77, 0.84, 0.9][i];
                nameHere(b, n, xf * W.w, lerp(G.c(xf), G.g(xf), 0.4) - G.ph * (i % 2 ? 0.2 : 0.7), [255, 236, 200], { size: 0.02, hold: 2.4, delay: i * 0.9, quiet: i > 0 });
              });
            }
            pose('neh', 'gaze');
          }],
          [L[3], b => { W.set('neVillage', 1, b.instant); W.goTo(0.9, 6, b.instant); pose('neh', 'stand'); sfx(b, 'stars', { soft: true }); }],
        ]);
      },
    },

    // ── 8 · 耶和华藉摩西传给以色列人的律法书（8:1–8）── 水门前，以斯拉展开律法书 ──
    {
      kind: 'cmd', utter: '耶和华藉摩西传给以色列人的律法书', cmd: 'cat 律法书 | 众民 --from 清早 --to 晌午', ref: '8:1', tint: [255, 240, 206],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.27, 6, b.instant);
            W.set('neVillage', 0.4, b.instant);
            rm('hanani', b.instant); uncrowd('lev', b.instant); uncrowd('judah', b.instant);
            W.set('nePulpit', 1, b.instant);
            walk('neh', 0.7, { speed: 0.02 }); face('neh', -1);
            add('ezra', { label: '文士以斯拉', sex: 'm', age: 'elder', x: X.water, v: 0.04, facing: 1, robe: ROBE.ezra, accent: [70, 96, 160], glow: 0.45, from: fromOf(b) });
            W.set('neScroll', 0.2, b.instant);
            people(b, 'ppl1', 9, 0.44, 0.52, 0.5); people(b, 'ppl2', 8, 0.66, 0.76, 0.56); people(b, 'ppl3', 7, 0.54, 0.64, 0.72);
            crowdWalk('ppl1', 0.47, 0.6, { speed: 0.03 }); crowdWalk('ppl2', 0.58, 0.72, { speed: 0.03 }); crowdWalk('ppl3', 0.5, 0.66, { speed: 0.03 });
          }],
          [3, b => { W.set('neShut', 0, b.instant); sfx(b, 'gate', { soft: true }); walk('ezra', X.pulpit - 0.045, { speed: 0.02 }); }],
          [L[1], b => {
            // 以斯拉站在木台上；利未人左右
            onPulpit('ezra', 0); face('ezra', 1);
            const f = fromOf(b);
            add('lv1', { label: '利未人', sex: 'm', age: 'adult', x: X.pulpit - 0.024, v: 0.1, facing: 1, robe: ROBE.levite, glow: 0.12, from: f });
            add('lv2', { label: '利未人', sex: 'm', age: 'elder', x: X.pulpit + 0.022, v: 0.1, facing: -1, robe: [220, 214, 196], glow: 0.12, from: f });
            onPulpit('lv1', -0.026); onPulpit('lv2', 0.026);
            crowdFace('ppl1', X.pulpit); crowdFace('ppl2', X.pulpit); crowdFace('ppl3', X.pulpit);
            crowdPose('ppl1', 'sit'); crowdPose('ppl2', 'sit'); crowdPose('ppl3', 'sit');
            W.goTo(0.5, 22, b.instant);
          }],
          [L[2], b => {
            pose('ezra', 'raise');
            W.set('neScroll', 1, b.instant);
            crowdPose('ppl1', 'stand'); crowdPose('ppl2', 'stand'); crowdPose('ppl3', 'stand');
            sfx(b, 'harp');
          }],
          [L[3], b => { crowdPose('ppl1', 'raise'); crowdPose('ppl2', 'raise'); crowdPose('ppl3', 'raise'); sfx(b, 'crowd'); }],
          [L[3] + 3.5, b => { crowdPose('ppl1', 'fall'); crowdPose('ppl2', 'fall'); crowdPose('ppl3', 'fall'); pose('lv1', 'bow'); pose('lv2', 'bow'); }],
        ]);
      },
    },

    // ── 9 · 因靠耶和华而得的喜乐是你们的力量（8:9–18）── 哭泣变为喜乐；房顶上的棚 ──
    {
      kind: 'bless', utter: '因靠耶和华而得的喜乐是你们的力量', cmd: 'mkdir -p 房顶/棚 && echo 喜乐 > 力量', ref: '8:10', tint: [255, 232, 170],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            crowdPose('ppl1', 'weep'); crowdPose('ppl2', 'weep'); crowdPose('ppl3', 'weep');
            pose('lv1', 'stand'); pose('lv2', 'stand');
            pose('ezra', 'stand'); W.set('neScroll', 0.3, b.instant);
            pose('neh', 'raise');
            sfx(b, 'weep', { soft: true });
          }],
          [L[1], b => {
            crowdPose('ppl1', 'stand'); crowdPose('ppl2', 'stand'); crowdPose('ppl3', 'stand');
            pose('ezra', 'raise'); pose('lv1', 'raise'); pose('lv2', 'raise');
            const p = figPt('ezra', 0.8);
            if (p) ringAt(b, p[0], p[1], [255, 232, 170], M() * 0.3, 2.4, 1.6);
            sfx(b, 'harp');
          }],
          [L[2], b => {
            crowdPose('ppl1', 'raise'); crowdPose('ppl3', 'raise');
            crowdWalk('ppl2', 0.62, 0.78, { speed: 0.025, pose: 'carry' });
            pose('ezra', 'stand'); pose('lv1', 'stand'); pose('lv2', 'stand'); pose('neh', 'stand');
            sfx(b, 'laugh', { soft: true });
          }],
          [L[3], b => {
            W.set('neBooths', 1, b.instant);
            W.goTo(0.79, 9, b.instant);
            crowdPose('ppl1', 'stand'); crowdPose('ppl2', 'stand'); crowdPose('ppl3', 'raise');
            sfx(b, 'wind', { soft: true });
          }],
        ]);
      },
    },

    // ── 10 · 你还是大施怜悯，在旷野不丢弃他们（9:1–10:27）── 禁食；星空；火柱的回影；立约 ──
    {
      kind: 'act', utter: '你还是大施怜悯，在旷野不丢弃他们', cmd: 'git log --since 亚伯兰 --reverse  # 并不丢弃他们', ref: '9:19', tint: [255, 214, 170],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.36, 5, b.instant);
            W.set('neBooths', 0, b.instant);
            W.set('neScroll', 0, b.instant);
            W.set('neSack', 1, b.instant);
            for (const g of ['ppl1', 'ppl2', 'ppl3']) { crowdRobe(g, ROBE.sack); crowdPose(g, 'bow'); }
            crowdWalk('ppl2', 0.66, 0.76, { speed: 0.025, pose: 'bow' });
            descend(b, 'ezra', X.pulpit + 0.05);
            const P = pulpitG();
            dustAt(b, P.x - W.w * 0.08, fieldY(0.55, 0.5) - PH(2), 30, [170, 150, 120], 40);
            sfx(b, 'weep', { soft: true });
          }],
          [L[1], b => {
            W.goTo(0.99, 8, b.instant);
            pose('lv1', 'raise'); pose('lv2', 'raise');
            for (const g of ['ppl1', 'ppl2', 'ppl3']) crowdPose(g, 'gaze');
            sfx(b, 'stars');
          }],
          [L[2], b => { W.set('nePillar', 1, b.instant); sfx(b, 'fire', { soft: true }); sfx(b, 'angel', { soft: true }); }],
          [L[3], b => {
            W.set('nePillar', 0, b.instant);
            W.set('neSack', 0, b.instant);
            W.set('neCovenant', 1, b.instant);
            pose('lv1', 'bow'); pose('lv2', 'bow');
            walk('neh', X.pulpit + 0.05, { speed: 0.02, pose: 'bow' });
            for (const g of ['ppl1', 'ppl2', 'ppl3']) crowdPose(g, 'stand');
            sfx(b, 'seal');
          }],
        ]);
      },
    },

    // ── 11 · 圣城耶路撒冷（10:28–11:36）── 初熟之物奉到殿里；十人中一人住进圣城 ──
    {
      kind: 'name', utter: '圣城耶路撒冷', cmd: 'mv 十分之一/ 圣城/  # 甘心乐意', ref: '11:1', tint: [255, 236, 190],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.32, 6, b.instant);
            W.set('neCovenant', 0, b.instant);
            for (const g of ['ppl1', 'ppl2', 'ppl3']) crowdRobe(g, null);
            uncrowd('ppl3', b.instant);
            rm('lv1', b.instant); rm('lv2', b.instant); rm('ezra', b.instant);
            W.set('nePulpit', 0, b.instant);
            crowdProp('ppl2', 'bundle');
            crowdWalk('ppl2', X.valley - 0.03, X.valley + 0.03, { speed: 0.025, pose: 'carry' });
            walk('neh', 0.7, { speed: 0.02 }); face('neh', 1);
          }],
          [L[0] + 5.5, b => { uncrowd('ppl2', b.instant); sfx(b, 'gate', { soft: true }); }],
          [L[1], b => {
            // 掣签；远处各城的人来住进圣城
            W.set('neVillage', 0.55, b.instant);
            W.set('neHouses', 1, b.instant);
            W.set('neLamps', 1, b.instant);
            W.set('bare', 0.15, b.instant); W.set('bloom', 0.7, b.instant);
            people(b, 'settle', 8, 0.93, 1.02, 0.3, { label: '甘心乐意住在耶路撒冷的' });
            crowdWalk('settle', X.dung - 0.02, X.fount, { speed: 0.03 });
            crowdFace('ppl1', 1);
            sfx(b, 'build', { soft: true });
          }],
          [L[1] + 2.5, b => {
            W.set('neHoly', 1, b.instant);
            const G = geo();
            nameHere(b, '圣城', C.TX * W.w, G.plat - G.ph * 2.2, [255, 226, 160], { size: 0.05, hold: 3.6 });
            sfx(b, 'harp');
          }],
          [L[2], b => {
            crowdPose('ppl1', 'raise'); pose('neh', 'raise');
            W.set('neHoly', 0.35, b.instant);
            sfx(b, 'crowd', { soft: true });
          }],
          [L[2] + 4, b => { crowdPose('ppl1', 'stand'); pose('neh', 'stand'); uncrowd('settle', b.instant); }],
        ]);
      },
    },

    // ── 12 · 因为神使他们大大欢乐（12:27–47）── 告成之礼：两大队称谢的人绕城而行，欢声听到远处 ──
    {
      kind: 'act', utter: '因为神使他们大大欢乐', cmd: 'broadcast 欢声 --to 远处 --loud', ref: '12:43', tint: [255, 222, 150],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            W.goTo(0.6, 6, b.instant);
            W.set('neHoly', 0, b.instant); W.set('neShut', 0, b.instant);
            uncrowd('ppl1', b.instant);
            walk('neh', X.valley - 0.022, { speed: 0.025 });
            add('ezra', { label: '文士以斯拉', sex: 'm', age: 'elder', x: X.valley + 0.024, v: 0.1, facing: -1, robe: ROBE.ezra, accent: [70, 96, 160], glow: 0.45, from: fromOf(b) });
            // 称谢的人上城，分为两大队
            S.choir = true;
            people(b, 'choirA', 7, X.valley, X.valley + 0.05, 0, { label: '称谢的人', robe: ROBE.levite, glow: 0.3 });
            people(b, 'choirB', 7, X.valley - 0.05, X.valley, 0, { label: '称谢的人', robe: [232, 226, 206], glow: 0.3 });
            attachChoir('choirA', 1); attachChoir('choirB', -1);
            crowdFace('choirA', 1); crowdFace('choirB', -1);
            people(b, 'wc', 10, 0.5, 0.66, 0.5, { label: '妇女和孩童' });
            people(b, 'wc2', 7, 0.8, 0.93, 0.44, { label: '妇女和孩童' });
            sfx(b, 'angel', { soft: true });
          }],
          [L[1], b => {
            W.set('neChoir', 1, b.instant);
            crowdPose('choirA', 'walk'); crowdPose('choirB', 'walk');
            crowdFace('wc', 0.76); crowdFace('wc2', 0.76);
            sfx(b, 'choir'); sfx(b, 'harp');
          }],
          [L[1] + 13.4, b => {
            // 两队在神的殿里相遇
            crowdPose('choirA', 'raise'); crowdPose('choirB', 'raise');
            crowdFace('choirA', -1); crowdFace('choirB', 1);
            sfx(b, 'chime');
          }],
          [L[3], b => {
            W.set('neAltar', 1, b.instant);
            W.set('neJoy', 1, b.instant);
            crowdPose('wc', 'raise'); crowdPose('wc2', 'raise'); pose('neh', 'raise'); pose('ezra', 'raise');
            W.setPop('bird', 40, C.TX * W.w, W.h * 0.5, b.instant);
            sfx(b, 'crowd'); sfx(b, 'fire', { soft: true });
            const G = geo();
            ringAt(b, C.TX * W.w, G.plat - G.ph, [255, 226, 160], M() * 0.6, 3.2, 2.4);
          }],
          [L[3] + 3.2, () => { crowdPose('wc', 'stand'); crowdWalk('wc2', 0.78, 0.95, { speed: 0.03, pose: 'raise' }); }],
          [L[3] + 5.5, () => { crowdPose('wc', 'raise'); }],
        ]);
      },
    },

    // ── 13 · 我们的神使那咒诅变为祝福（13:1–31）── 库房洁净；安息日关门；「求你记念我」──
    {
      kind: 'act', utter: '我们的神使那咒诅变为祝福', cmd: 'map(咒诅 => 祝福)', ref: '13:2', tint: [255, 236, 200],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.goTo(0.56, 5, b.instant);
            W.set('neJoy', 0, b.instant); W.set('neAltar', 0.2, b.instant);
            S.choir = false;
            uncrowd('choirA', b.instant); uncrowd('choirB', b.instant);
            uncrowd('wc2', b.instant);
            crowdPose('wc', 'stand');
            rm('ezra', b.instant);
            walk('neh', 0.7, { speed: 0.025 }); face('neh', -1);
            add('reader', { label: '念律法书的', sex: 'm', age: 'elder', x: 0.64, v: 0.18, facing: -1, robe: ROBE.levite, glow: 0.25, pose: 'carry', from: fromOf(b) });
            crowdFace('wc', 0.64);
          }],
          [L[1], b => {
            S.tossed = true;
            tween(b, 'toss', 0, 1, 3);
            pose('neh', 'point'); face('neh', 1);
            sfx(b, 'build', { soft: true });
          }],
          [L[1] + 3.2, b => { W.set('neClean', 1, b.instant); pose('neh', 'stand'); sfx(b, 'harp', { soft: true }); }],
          [L[2], b => {
            // 安息日的前一日，城门有黑影的时候
            W.goTo(0.77, 7, b.instant);
            uncrowd('wc', b.instant); rm('reader', b.instant);
            const f = fromOf(b);
            add('tyre', { label: '推罗人', sex: 'm', age: 'adult', x: 1.04, v: 0.26, facing: -1, robe: ROBE.tyre, accent: [200, 170, 120], glow: 0.03, from: f });
            animal('tyreD', 'donkey', 1.07, { v: 0.3, facing: -1, pack: true, label: '驮货的驴', from: f });
            walk('tyre', 0.83, { speed: 0.035 }); walk('tyreD', 0.85, { speed: 0.035 });
            walk('neh', X.valley - 0.01, { speed: 0.03 });
          }],
          [L[2] + 3.5, b => { W.set('neShut', 1, b.instant); sfx(b, 'gate'); pose('tyre', 'sit'); face('neh', 1); }],
          [L[3], b => {
            W.goTo(0.04, 8, b.instant);
            walk('tyre', 1.06, { speed: 0.03 }); walk('tyreD', 1.08, { speed: 0.03 });
            const f = fromOf(b);
            add('keep1', { label: '守门的利未人', sex: 'm', age: 'adult', x: X.valley + 0.028, v: 0.04, facing: -1, robe: ROBE.levite, glow: 0.15, prop: 'torch', from: f });
            add('keep2', { label: '守门的利未人', sex: 'm', age: 'adult', x: X.water + 0.026, v: 0.04, facing: -1, robe: ROBE.levite, glow: 0.15, prop: 'torch', from: f });
            add('keep3', { label: '守门的利未人', sex: 'm', age: 'elder', x: X.dung + 0.026, v: 0.04, facing: -1, robe: ROBE.levite, glow: 0.15, prop: 'torch', from: f });
            pose('neh', 'pray');
            W.set('neHand', 0.7, b.instant);
            sfx(b, 'harp');
          }],
          [L[3] + 5, b => { rm('tyre', b.instant); rm('tyreD', b.instant); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '尼希米记', books: [16], title: '城墙', sub: '尼希米记 1 — 13', tint: [250, 224, 190], music: 'babel',
    outro: 18,
    intro: INTRO,
    // 全卷终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '尼希米': { text: '我的神啊，求你记念我为这百姓所行的一切事，施恩与我。', ref: B + '5:19' },
      '耶路撒冷': { text: '那日，众人献大祭而欢乐；因为神使他们大大欢乐……甚至耶路撒冷中的欢声听到远处。', ref: B + '12:43' },
      '城墙': { text: '以禄月二十五日，城墙修完了，共修了五十二天。', ref: B + '6:15' },
      '拆毁的城墙': { text: '我们所遭的难，耶路撒冷怎样荒凉，城门被火焚烧，你们都看见了。', ref: B + '2:17' },
      '神的殿': { text: '这样，我们就不离弃我们神的殿。', ref: B + '10:39' },
      '祭坛': { text: '那日，众人献大祭而欢乐……', ref: B + '12:43' },
      '谷门': { text: '当夜我出了谷门，往野狗井去，到了粪厂门，察看耶路撒冷的城墙……', ref: B + '2:13' },
      '粪厂门': { text: '管理伯‧哈基琳、利甲的儿子玛基雅修造粪厂门，立门，安门扇和闩锁。', ref: B + '3:14' },
      '泉门': { text: '管理米斯巴、各荷西的儿子沙仑修造泉门，立门，盖门顶，安门扇和闩锁……', ref: B + '3:15' },
      '水门': { text: '他们如同一人聚集在水门前的宽阔处，请文士以斯拉将耶和华藉摩西传给以色列人的律法书带来。', ref: B + '8:1' },
      '羊门': { text: '那时，大祭司以利亚实和他的弟兄众祭司起来建立羊门，分别为圣，安立门扇……', ref: B + '3:1' },
      '鱼门': { text: '哈西拿的子孙建立鱼门，架横梁、安门扇，和闩锁。', ref: B + '3:3' },
      '炉楼': { text: '哈琳的儿子玛基雅和巴哈‧摩押的儿子哈述修造一段，并修造炉楼。', ref: B + '3:11' },
      '哈楠业楼': { text: '又过了以法莲门、古门、鱼门、哈楠业楼、哈米亚楼，直到羊门，就在护卫门站住。', ref: B + '12:39' },
      '守门的利未人': { text: '我吩咐利未人洁净自己，来守城门，使安息日为圣。我的神啊，求你因这事记念我，照你的大慈爱怜恤我。', ref: B + '13:22' },
      '守门的': { text: '城墙修完，我安了门扇，守门的、歌唱的，和利未人都已派定。', ref: B + '7:1' },
      '文士以斯拉': { text: '以斯拉站在众民以上，在众民眼前展开这书。他一展开，众民就都站起来。', ref: B + '8:5' },
      '木台': { text: '文士以斯拉站在为这事特备的木台上。', ref: B + '8:4' },
      '利未人': { text: '他们清清楚楚地念神的律法书，讲明意思，使百姓明白所念的。', ref: B + '8:8' },
      '称谢的人': { text: '于是，这两队称谢的人连我和官长的一半，站在神的殿里。', ref: B + '12:40' },
      '妇女和孩童': { text: '……连妇女带孩童也都欢乐，甚至耶路撒冷中的欢声听到远处。', ref: B + '12:43' },
      '百姓': { text: '这样，我们修造城墙，城墙就都连络，高至一半，因为百姓专心做工。', ref: B + '4:6' },
      '修造城墙的': { text: '修造城墙的，扛抬材料的，都一手做工一手拿兵器。', ref: B + '4:17' },
      '祭司': { text: '那时，大祭司以利亚实和他的弟兄众祭司起来建立羊门，分别为圣……', ref: B + '3:1' },
      '棚': { text: '从掳到之地归回的全会众就搭棚，住在棚里……于是众人大大喜乐。', ref: B + '8:17' },
      '参巴拉': { text: '参巴拉听见我们修造城墙就发怒，大大恼恨，嗤笑犹大人。', ref: B + '4:1' },
      '多比雅': { text: '亚扪人多比雅站在旁边，说：「他们所修造的石墙，就是狐狸上去也必跐倒。」', ref: B + '4:3' },
      '推罗人': { text: '又有泰尔人住在耶路撒冷；他们把鱼和各样货物运进来，在安息日卖给犹大人。', ref: B + '13:16' },
      '书珊的宫': { text: '哈迦利亚的儿子尼希米的言语如下：亚达薛西王二十年基斯流月，我在书珊城的宫中。', ref: B + '1:1' },
      '亚达薛西王': { text: '王问我说：「你要求什么？」于是我默祷天上的神。', ref: B + '2:4' },
      '我名的居所': { text: '……你们被赶散的人虽在天涯，我也必从那里将他们招聚回来，带到我所选择立为我名的居所。', ref: B + '1:9' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._nehemiah = { get S() { return S; }, geo, C, X, TW, frontTop, crestTop, wallPath, choirPos };
})(window.GS);
