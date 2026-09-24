/* ─────────────────────────────────────────────────────────────
 * book/kingdavid.js —— 撒母耳记下 · 大卫王（撒母耳记下 1 — 24）
 *
 * 洗革拉的清晨，大卫为扫罗和约拿单作哀歌（「大英雄何竟死亡！」）；「上希伯仑去」——犹大人在希伯仑膏他作王，
 * 大卫家日见强盛；约拿单的乳母抱着五岁的米非波设逃跑。以色列的长老都来到希伯仑，膏他作以色列的王；
 * 他上到耶布斯人的保障，城门开了，锡安成了大卫的城，香柏木的王宫一层层建起来。
 * 约柜在俄别‧以东的院子里发光，全家蒙福；大卫穿着细麻布的以弗得，在约柜前极力跳舞，
 * 抬约柜的人一路走上大卫的城，角声、欢呼——米甲从王宫的窗户里观看——约柜安放在大卫所搭的帐幕里
 * （本卷的签名）。当夜，神的话临到拿单：众星在城的上空聚成一座「家」，一行星从王宫升起，直到永远。
 * 金盾牌抬进城，瘸腿的米非波设同席吃饭；约押的军围攻拉巴。太阳平西，王宫的平顶，远处院中的一盏灯；
 * 乌利亚带着信出城，远方一点光熄灭；「耶和华甚不喜悦」——天地暗下来。拿单的比喻：穷人怀中的小母羊羔；
 * 「你就是那人！」「我得罪耶和华了！」——暗云散去；耶底底亚。提哥亚的妇人把水泼在地上；押沙龙归来，
 * 在城门口偷了以色列人的心。大卫蒙头赤脚上橄榄山，示每在对面的磐石上咒骂；城上一团黑色的计谋被金光解开；
 * 夜里过约旦河，天亮。玛哈念的城门、以法莲的树林、大橡树下的石堆；报信的人跑来；
 * 王上城门楼去哀哭——「我儿押沙龙啊！」。饥荒三年，利斯巴在磐石上守着，直到天降雨；
 * 「耶和华是我的岩石」——暴风、雷电、从高天伸下的一道光，黑夜里手中的灯，雨后日出的晨光与嫩草上的露；
 * 数点百姓、三样灾、瘟疫的影子从但直到别是巴，天使向耶路撒冷伸手——「够了！住手吧！」；
 * 亚劳拿的禾场上筑起一座坛，燔祭的火与烟升到黄昏的天上：瘟疫止住了（全卷的末一幅）。
 *
 * 画面的方位：右 = 锡安山上的大卫城（城门、城墙、众房屋、香柏木的王宫、耶布斯人的保障、约柜的帐幕）；
 *            城门之左是亚劳拿的禾场与橄榄山（几棵橄榄树）；中间一带先后是希伯仑、俄别‧以东的家、
 *            玛哈念的城门与以法莲的树林；左边海岸上一块大磐石（示每、利斯巴、大卫的诗）；中丘上远远是亚扪人的拉巴。
 *            经文在左边的海上，故事都在右半边。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU } = U;
  const ACT = 'kingdavid';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  const LVS = {
    dkHebron: ['exp', 0.6],    // 希伯仑的城邑（2:3）
    dkZion: ['exp', 0.45],     // 耶布斯人的保障 → 大卫的城（5:7）
    dkPalace: ['lin', 0.2],    // 香柏木的王宫（5:11）
    dkTent: ['exp', 0.6],      // 大卫所搭的帐幕（6:17）
    dkObed: ['exp', 0.6],      // 俄别‧以东的家（6:10）
    dkBless: ['exp', 0.45],    // 耶和华赐福给俄别‧以东（6:11）
    dkName: ['exp', 0.9],      // 坐在二基路伯上万军之耶和华（6:2）：约柜上的光柱
    dkMichal: ['exp', 0.9],    // 米甲从窗户里观看（6:16）
    dkHouse: ['lin', 0.24],    // 众星聚成的家（7:11–13）
    dkLine: ['lin', 0.2],      // 一行星升起，直到永远（7:13，16）
    dkBeam: ['exp', 0.8],      // 自天而降的光
    dkTable: ['exp', 0.6],     // 王的席（9:7）
    dkRabbah: ['exp', 0.4],    // 亚扪人的京城拉巴（11:1）
    dkCourt: ['exp', 0.7],     // 远处院中的灯（11:2）
    dkCounsel: ['exp', 1.4],   // 亚希多弗的计谋（17:1–4）
    dkUnravel: ['lin', 0.3],   // 耶和华定意破坏（17:14）
    dkMaha: ['exp', 0.5],      // 玛哈念的城门（18:24）
    dkForest: ['exp', 0.5],    // 以法莲树林（18:6）
    dkCairn: ['lin', 0.5],     // 一大堆石头（18:17）
    dkRizpah: ['exp', 0.6],    // 利斯巴在磐石上用麻布搭的棚（21:10）
    dkRizFire: ['exp', 0.8],   // 夜间她的火
    dkDew: ['exp', 0.45],      // 雨后的晴光，嫩草上的露（23:4）
    dkFloor: ['exp', 0.5],     // 亚劳拿的禾场（24:16）
    dkCount: ['lin', 0.35],    // 数点百姓：遍地的小光（24:2–9）
    dkPlague: ['lin', 0.09],   // 瘟疫的影子，从但直到别是巴（24:15）：影子的前锋
    dkVeil: ['exp', 0.5],      // 影子的浓淡
    dkAltar: ['lin', 0.5],     // 筑坛（24:25）
    dkFire: ['exp', 0.7],      // 燔祭的火
  };
  for (const k in LVS) W.defineLevel(k, LVS[k][0], LVS[k][1]);

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    start: 0.578, hebron: 0.655, obed: 0.598, court: 0.628, sac: 0.676,
    gate: 0.786, atGate: 0.758, palace: 0.852, citadel: 0.908, tent: 0.952, uriah: 0.823,
    table: 0.724, rock: 0.54, maha: 0.614, oak: 0.706, floor: 0.7, altar: 0.708, rabbah: 0.585,
  };
  const HILL = { cx: 0.878, hw: 0.142 };
  const OLIVES = [[0.63, 0.9, 3], [0.657, 1.1, 7], [0.684, 0.85, 11]];
  const OAKS = [[0.672, 0.9, 5], [0.706, 1.15, 9], [0.742, 0.95, 13]];
  const ROBE = {
    david: [128, 100, 76], king: [146, 58, 66], linen: [240, 234, 216], old: [128, 70, 76],
    abigail: [160, 118, 104], ahinoam: [150, 128, 110], nurse: [150, 122, 100],
    nathan: [92, 106, 138], joab: [104, 88, 70], abishai: [122, 96, 74], elder: [132, 116, 92],
    obed: [138, 116, 90], levite: [236, 230, 212], mephi: [170, 150, 124], ziba: [120, 104, 86],
    uriah: [116, 96, 78], bath: [174, 128, 132], poor: [206, 196, 172], rich: [150, 92, 118],
    tekoa: [76, 68, 68], absalom: [216, 172, 102], shimei: [126, 110, 88], runner: [150, 124, 90], cushite: [98, 78, 66],
    rizpah: [104, 92, 78], gad: [104, 112, 134], araunah: [166, 140, 104],
    ahith: [92, 78, 98], hushai: [120, 136, 156],
  };
  const GOLD = [236, 194, 96];
  const LEV = ['lv0', 'lv1', 'lv2', 'lv3'];
  const LEV_DX = [-0.021, -0.007, 0.007, 0.021], LEV_V = [0.03, 0.09, 0.05, 0.1];
  const HORN = ['hn0', 'hn1', 'hn2'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { ark: 'none', dance: false, horns: false, crown: false, shields: false, letter: false, torch: false,
      beam: null, dRobe: 'david', dAge: 'adult', paths: {} };
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const MOB = () => W.w < 600;
  const PS = () => (MOB() ? 1.3 : 1);                                     // 手机上，抬约柜的队伍放大些
  const SU = () => Math.max(0.3, W.unit) * 1.75;                           // 布景的尺度（与人相称）
  const LS = l => W.layerScale(l) * (MOB() ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const PH = () => 34 * W.layerScale(2) * (MOB() ? 1.55 : 1) * 1.3;       // 近地上一个人的身高（像素）
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return isFinite(y) ? y : W.h * 0.85;
  };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + (v || 0) * Math.max(0, W.h - g) * 0.8; };
  const RT = [];
  (function () { const r = U.mulberry32(2410); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // 锡安山：近地上隆起的一座山（城在其上）
  function bump(xf) {
    const t = (xf - HILL.cx) / HILL.hw;
    if (t <= -1 || t >= 1) return 0;
    const q = 1 - t * t;
    return q * q * (1 - 0.1 * t);
  }
  const hillH = () => 40 * SU();
  const hillY = xf => gY(2, xf) - hillH() * bump(xf);
  const wallBase = xf => lerp(gY(2, xf), hillY(xf), 0.3) + 2 * SU();

  // ── 人物（皆经人物模块；接口若不在，只是不显出）──────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (!fig(id)) return; const c = C(); if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function place(id, x, layer) { if (fig(id)) C().place(id, x, layer); }
  function carry(id, what) { const c = C(); if (!fig(id)) return; if (c.carry) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function hold(id, what) { const c = C(); if (!fig(id)) return; if (c.prop) U.safe('cast.prop', () => c.prop(id, what || null)); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function ride(id, mount) { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, mount)); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) U.safe('cast.fly', () => c.fly(id, x, y, o)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && fig(a) && fig(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function animal(id, kind, x, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function herd(gid, o) { const c = C(); if (!c.herd) return null; return U.safe('cast.herd', () => c.herd(gid, o)); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function members(gid) { const c = C(); const g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null; return g ? g.members : []; }
  // 人群里各人在纵深里的前后（按序号定，重演时一样）
  function crowdV(gid, v0, v1) { members(gid).forEach((m, i) => { m.v = lerp(v0, v1, rt(i * 7 + gid.length * 31)); }); }
  function crowdFace(gid, d) { members(gid).forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function say(b, lines, delay) { if (b.instant) return; GS.ui.narrate(lines, { replace: false, delay: delay || 0 }); }
  const fromOf = b => (b.instant ? 'none' : 'fade');
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    const h0 = f.isAnimal ? 20 * LS(l) : PH() * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    if (f.attach && f._ax != null && isFinite(f._ax) && isFinite(f._ay)) return [f._ax, f._ay - h0 * frac];
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    const h = f.isAnimal ? 20 * LS(l) : PH() * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    return [x, y - h * frac];
  }
  // 在某人头上聚成一个名字（微尘自四围而来）
  function nameOver(b, id, str, rgb, o) {
    if (b.instant) return;
    o = o || {};
    const p = figPt(id, 1) || [W.w * 0.75, W.h * 0.8];
    const size = (o.size || 0.05) * M(), n = Array.from(str).length;
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(p[0], half + 8, W.w - half - 8), cy = clamp(p[1] - size * 1.1 - 6, size + 8, W.h - size);
    const k = 60 * SU();
    fx().nameStr(str, cx, cy, size, rgb, () => [p[0] + rand(-k, k), p[1] + rand(-k * 0.5, k * 0.3)], { hold: o.hold || 2.6 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }

  // ── 大卫：同一个人，不同的年岁与衣裳（记在 S 里，重新出场时照样穿戴）──
  function davidOpts(o) {
    const robe = S.dRobe === 'linen' ? ROBE.linen : S.dRobe === 'king' ? (S.dAge === 'elder' ? ROBE.old : ROBE.king) : ROBE.david;
    const linen = S.dRobe === 'linen';
    // 细麻布的以弗得：白袍、金色的腰带；光收敛些，免得在白墙前化成一团白
    return Object.assign({ label: '大卫', sex: 'm', age: S.dAge, robe, glow: linen ? 0.35 : 0.55, accent: S.dRobe === 'king' ? [226, 190, 110] : linen ? GOLD : null,
      beard: true, hair: linen ? 'short' : 'cloth', prop: S.torch ? 'torch' : null, scale: linen ? PS() : 1 }, o || {});
  }
  function dress(robe, age) { if (robe) S.dRobe = robe; if (age) S.dAge = age; if (fig('david')) add('david', davidOpts()); }

  // ── 走在高处：人物的脚随一条路（城门楼的梯、磐石、王宫的平顶）──
  const PATHS = {
    // 王宫的平顶（11:2）：宫的两侧有台阶
    roof(xf, f) {
      const b = palaceBox(), l = (b.cx - b.w / 2) / W.w, r = (b.cx + b.w / 2) / W.w;
      if (xf >= l && xf <= r) return b.roof;
      return hillY(xf);
    },
    // 玛哈念的城门楼（18:33）：楼右边的梯
    tower(xf, f) {
      const g = mahaBox(), foot = fieldY(xf, f ? f.v : 0), x0 = g.stairX1 / W.w, x1 = g.stairX0 / W.w;
      if (xf >= x0) return foot;
      if (xf <= x1) return g.floor;
      return lerp(g.floor, fieldY(x0, f ? f.v : 0), (xf - x1) / (x0 - x1));
    },
    // 磐石（22:2）：石右边的坡
    rock(xf, f) {
      const r = rockBox(), foot = fieldY(xf, f ? f.v : 0), x0 = r.rampX1 / W.w, x1 = r.rampX0 / W.w;
      if (xf >= x0) return foot;
      if (xf <= x1) return r.top;
      return lerp(r.top, fieldY(x0, f ? f.v : 0), (xf - x1) / (x0 - x1));
    },
  };
  function onPath(id, name) {
    S.paths[id] = name;
    attach(id, () => { const f = fig(id); if (!f) return null; return [f.nx * W.w, PATHS[name](f.nx, f)]; });
  }
  function onSpot(id, name, fn) { S.paths[id] = name; attach(id, fn); }
  function offPath(id) { delete S.paths[id]; attach(id, null); }

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
    try {
      SP = {
        warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([240, 244, 255], 1),
        pale: radial([226, 222, 255], 1), smoke: radial([128, 122, 118], 0.8, 0.55), silver: radial([226, 234, 250], 1),
        dark: radial([18, 14, 26], 0.9, 0.5), cold: radial([150, 160, 196], 0.9, 0.5),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (!sp || a < 0.004 || r < 0.5 || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  function add2(ctx, fn) { ctx.globalCompositeOperation = 'lighter'; fn(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }

  // 火与烟
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !sprites()) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.32 + 0.45 * nightK()));
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
    ctx.globalAlpha = 1;
  }
  function smoke(ctx, x, y, k, H, w, seed, n) {
    if (k < 0.01 || !sprites()) return;
    const N = n || 10, day = 0.35 + 0.65 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.35) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 窗里、门口的暖光
  function lampGlow(ctx, x, y, r, k, seed) {
    if (k < 0.01 || !sprites()) return;
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    add2(ctx, () => glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55));
  }
  // 迎光的一道边
  function rimLine(ctx, pts, rgb, a, w) {
    if (a < 0.01 || pts.length < 4) return;
    ctx.strokeStyle = U.rgba(rgb[0], rgb[1], rgb[2], a);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  大卫城：锡安山、城墙、城门、众房屋、王宫、保障、帐幕
  // ════════════════════════════════════════════════════════════
  const STONE = [[204, 184, 150], [188, 170, 140], [214, 198, 166], [178, 162, 134], [196, 172, 138]];
  const JEBUS = [150, 138, 120];
  // 山上的房屋：[x, 宽, 高, 色]
  const HOUSES = [
    [0.794, 11, 10, 0], [0.804, 10, 13, 1], [0.814, 12, 10, 2], [0.823, 11, 12, 3], [0.835, 9, 11, 4],
    [0.889, 10, 12, 1], [0.924, 10, 10, 3], [0.973, 11, 12, 0], [0.985, 12, 10, 4], [0.997, 11, 12, 1],
  ];
  const TOWERS = [0.757, 0.84, 0.895, 0.945, 0.99];
  function stoneOf(i, zk) { const s = STONE[i % STONE.length]; return U.mixRGB(JEBUS, s, 0.35 + 0.65 * zk); }
  function palaceBox() {
    const s = SU(), cx = X.palace * W.w, base = hillY(X.palace) + 2 * s, w = 44 * s, H = 26 * s, k = W.lv.dkPalace;
    return { cx, base, w, H, k, roof: base - H, top: base - H * k };
  }
  function tentBox() { const s = SU(), cx = X.tent * W.w, base = hillY(X.tent) + 2 * s; return { cx, base, w: 25 * s, h: 15 * s }; }
  function gateBox() {
    const s = SU(), cx = X.gate * W.w, base = gY(2, X.gate) + 2 * s;
    return { cx, base, aw: 9 * s, ah: 15 * s, tw: 9.5 * s, th: 31 * s };
  }

  function drawHouse(ctx, x, base, w, h, col, seed, lit, a, flat) {
    const s = SU();
    ctx.fillStyle = css(col, 2, a);
    ctx.fillRect(x - w / 2, base - h, w, h + 2 * s);
    // 平顶上的矮墙（申 22:8）
    ctx.fillStyle = css(U.mixRGB(col, [255, 250, 236], 0.12), 2, a, 0.08);
    ctx.fillRect(x - w / 2 - 0.6 * s, base - h - 1.6 * s, w + 1.2 * s, 1.8 * s);
    if (!flat && rt(seed) < 0.45) { ctx.fillStyle = css(U.mixRGB(col, [120, 100, 80], 0.3), 2, a); ctx.fillRect(x - w * 0.18, base - h - 4.2 * s, w * 0.36, 2.8 * s); }
    // 门与窗
    ctx.fillStyle = css([40, 32, 28], 2, a);
    const wx = x + (rt(seed + 1) - 0.5) * w * 0.4, wy = base - h * 0.62;
    ctx.fillRect(wx - 1.3 * s, wy - 1.4 * s, 2.6 * s, 2.8 * s);
    if (w > 11 * s) ctx.fillRect(x - w * 0.34, base - h * 0.35, 2.2 * s, 2.4 * s);
    // 迎光的边
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x - w / 2 - 0.6 * s, base - h - 1.6 * s, x + w / 2 + 0.6 * s, base - h - 1.6 * s], [255, 240, 208], a * 0.5 * dayA(), Math.max(0.6, 0.8 * s));
    rimLine(ctx, [x + d * w / 2, base - h - 1.6 * s, x + d * w / 2, base], [255, 236, 200], a * 0.32 * dayA(), Math.max(0.5, 0.7 * s));
    // 夜里窗中的灯
    if (lit > 0.02) {
      ctx.fillStyle = U.rgba(255, 196, 120, a * lit * 0.95);
      ctx.fillRect(wx - 1.3 * s, wy - 1.4 * s, 2.6 * s, 2.8 * s);
      lampGlow(ctx, wx, wy, 9 * s, a * lit * 0.8, seed);
    }
  }
  function drawZion(ctx) {
    const s = SU(), zk = W.lv.dkZion, nk = nightK(), dA = dayA();
    const xa = HILL.cx - HILL.hw, xb = HILL.cx + HILL.hw;
    // ── 山 ──
    const N = 44, top = [];
    for (let i = 0; i <= N; i++) { const xf = lerp(xa, xb, i / N); top.push(xf * W.w, hillY(xf)); }
    ctx.fillStyle = css([106, 112, 74], 2);
    ctx.beginPath();
    ctx.moveTo(top[0], top[1]);
    for (let i = 2; i < top.length; i += 2) ctx.lineTo(top[i], top[i + 1]);
    for (let i = N; i >= 0; i--) { const xf = lerp(xa, xb, i / N); ctx.lineTo(xf * W.w, gY(2, xf) + 4 * s); }
    ctx.closePath(); ctx.fill();
    // 山坡上的梯田与石
    ctx.strokeStyle = css([80, 84, 58], 2, 0.55);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (let k = 1; k <= 3; k++) {
      const f = k / 4;
      let pen = false;
      for (let i = 0; i <= N; i++) {
        const xf = lerp(xa, xb, i / N), b = bump(xf);
        if (b < 0.18) { pen = false; continue; }
        const y = lerp(gY(2, xf), hillY(xf), f) + 1.5 * s;
        if (pen) ctx.lineTo(xf * W.w, y); else { ctx.moveTo(xf * W.w, y); pen = true; }
      }
    }
    ctx.stroke();
    const d = litX() >= HILL.cx * W.w ? 1 : -1;
    // 山脊迎光
    const rim = [];
    for (let i = 0; i <= N; i++) { const xf = lerp(xa, xb, i / N); if ((xf - HILL.cx) * d > -0.03) rim.push(xf * W.w, hillY(xf)); }
    rimLine(ctx, rim, [236, 226, 176], 0.4 * dA, Math.max(0.8, 1.2 * s));

    // ── 山顶：帐幕、保障、王宫 ──
    drawTent(ctx);
    drawCitadel(ctx, zk);
    drawPalace(ctx);
    // ── 众房屋（自高而低，低处的遮住高处的底）──
    const hs = HOUSES.map((q, i) => ({ q, i, base: hillY(q[0]) + 3 * s })).sort((a, b) => a.base - b.base);
    for (const h of hs) {
      const q = h.q, x = q[0] * W.w;
      if (x - q[1] * s > W.w + 4) continue;
      const lit = nk * (rt(h.i * 7 + 3) < 0.6 ? 1 : 0) * (0.35 + 0.65 * zk);
      drawHouse(ctx, x, h.base, q[1] * s, q[2] * s, stoneOf(q[3], zk), h.i * 13 + 5, lit, 1);
      if (Math.abs(q[0] - X.uriah) < 0.004) drawCourt(ctx, x, h.base, q[1] * s, q[2] * s);
    }
    // ── 城墙与城楼 ──
    drawWalls(ctx, zk);
    drawGate(ctx, zk);
  }
  function drawWalls(ctx, zk) {
    const s = SU(), x0 = 0.757, x1 = 1.005, wh = 12 * s, cr = 4 * s;
    const col = U.mixRGB([150, 138, 118], [206, 188, 154], zk);
    // 墙身
    ctx.fillStyle = css(col, 2);
    ctx.beginPath();
    let px = x0 * W.w;
    ctx.moveTo(px, wallBase(x0) + 3 * s);
    const top = [];
    let up = true;
    for (let x = px; x <= x1 * W.w + cr; x += cr) {
      const xf = x / W.w, yt = wallBase(xf) - wh - (up ? 2.4 * s : 0);
      ctx.lineTo(x, yt); ctx.lineTo(x + cr, yt);
      top.push(x, yt, x + cr, yt);
      up = !up;
    }
    for (let x = x1 * W.w + cr; x >= px; x -= cr * 2) ctx.lineTo(x, wallBase(x / W.w) + 3 * s);
    ctx.closePath(); ctx.fill();
    // 石缝
    ctx.strokeStyle = css(U.mixRGB(col, [60, 50, 40], 0.4), 2, 0.4);
    ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let x = px; x <= x1 * W.w; x += 7 * s) {
      const xf = x / W.w, b = wallBase(xf);
      ctx.moveTo(x, b - wh * 0.5); ctx.lineTo(x + 7 * s, wallBase((x + 7 * s) / W.w) - wh * 0.5);
    }
    ctx.stroke();
    // 城楼
    for (let i = 0; i < TOWERS.length; i++) {
      const xf = TOWERS[i], x = xf * W.w, b = wallBase(xf) + 3 * s, tw = 8.5 * s, th = wh + 10 * s;
      if (x - tw > W.w + 4) continue;
      ctx.fillStyle = css(U.mixRGB(col, [255, 248, 230], 0.05), 2);
      ctx.fillRect(x - tw / 2, b - th, tw, th);
      for (let k = 0; k < 3; k++) ctx.fillRect(x - tw / 2 + k * tw * 0.4, b - th - 2.4 * s, tw * 0.22, 2.4 * s);
      ctx.fillStyle = css([36, 30, 26], 2);
      ctx.fillRect(x - 0.8 * s, b - th * 0.66, 1.6 * s, 3.2 * s);
      if (nightK() > 0.05 && zk > 0.3 && i % 2 === 0) lampGlow(ctx, x, b - th * 0.6, 10 * s, nightK() * zk * 0.7, i * 3);
      // 金色的旗（大卫的城）
      if (zk > 0.02) {
        const fy = b - th - 2.4 * s, wv = Math.sin(W.t * 2.2 + i) * 1.2 * s;
        ctx.strokeStyle = css([90, 70, 50], 2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
        ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, fy - 9 * s); ctx.stroke();
        ctx.fillStyle = css(GOLD, 2, zk, 0.15);
        ctx.beginPath(); ctx.moveTo(x, fy - 9 * s); ctx.quadraticCurveTo(x + 4 * s, fy - 8.5 * s + wv, x + 7.5 * s, fy - 7.5 * s + wv); ctx.lineTo(x, fy - 5.5 * s); ctx.closePath(); ctx.fill();
      }
    }
    const d = litX() >= HILL.cx * W.w ? 1 : -1;
    rimLine(ctx, top, [255, 238, 204], 0.3 * dayA(), Math.max(0.5, 0.7 * s));
    void d;
  }
  function drawGate(ctx, zk) {
    const G = gateBox(), s = SU(), col = U.mixRGB([146, 134, 114], [210, 192, 158], zk);
    const x = G.cx, b = G.base;
    ctx.fillStyle = css(col, 2);
    // 两座城楼与门楼
    ctx.fillRect(x - G.aw / 2 - G.tw, b - G.th, G.tw, G.th);
    ctx.fillRect(x + G.aw / 2, b - G.th, G.tw, G.th);
    ctx.fillRect(x - G.aw / 2, b - G.th * 0.86, G.aw, G.th * 0.86 - G.ah);
    for (let k = 0; k < 5; k++) ctx.fillRect(x - G.aw / 2 - G.tw + k * (G.aw + 2 * G.tw) / 4.6, b - G.th - 2.6 * s, 2.6 * s, 2.6 * s);
    // 门洞（关着的是木门；开了，里头有光）
    ctx.fillStyle = css([28, 22, 20], 2);
    ctx.beginPath();
    ctx.moveTo(x - G.aw / 2, b + s);
    ctx.lineTo(x - G.aw / 2, b - G.ah * 0.72);
    ctx.quadraticCurveTo(x, b - G.ah * 1.12, x + G.aw / 2, b - G.ah * 0.72);
    ctx.lineTo(x + G.aw / 2, b + s);
    ctx.closePath(); ctx.fill();
    const shut = 1 - zk;
    if (shut > 0.02) {
      ctx.fillStyle = css([104, 76, 50], 2, shut);
      ctx.fill();
      ctx.strokeStyle = css([60, 44, 30], 2, shut); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath(); ctx.moveTo(x, b); ctx.lineTo(x, b - G.ah * 0.9); ctx.stroke();
    }
    if (zk > 0.05) lampGlow(ctx, x, b - G.ah * 0.4, G.aw * 1.6, zk * (0.25 + 0.6 * nightK()), 17);
    // 城门楼上的窗
    ctx.fillStyle = css([36, 30, 26], 2);
    ctx.fillRect(x - 1.2 * s, b - G.th * 0.74, 2.4 * s, 3 * s);
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x + d * (G.aw / 2 + G.tw), b - G.th, x + d * (G.aw / 2 + G.tw), b], [255, 236, 200], 0.4 * dayA(), Math.max(0.6, 0.8 * s));
    rimLine(ctx, [x - G.aw / 2 - G.tw, b - G.th, x + G.aw / 2 + G.tw, b - G.th], [255, 240, 210], 0.4 * dayA(), Math.max(0.6, 0.8 * s));
  }
  // 耶布斯人的保障 → 大卫的保障（5:7，9）
  function drawCitadel(ctx, zk) {
    const s = SU(), x = X.citadel * W.w, b = hillY(X.citadel) + 2 * s, w = 15 * s, h = 28 * s;
    const col = U.mixRGB([140, 128, 110], [200, 182, 148], zk);
    ctx.fillStyle = css(col, 2);
    ctx.fillRect(x - w / 2, b - h, w, h + 2 * s);
    for (let k = 0; k < 4; k++) ctx.fillRect(x - w / 2 + k * w * 0.29, b - h - 3 * s, w * 0.16, 3 * s);
    ctx.fillStyle = css([34, 28, 24], 2);
    ctx.fillRect(x - 1.2 * s, b - h * 0.7, 2.4 * s, 4 * s);
    ctx.fillRect(x - w * 0.3, b - h * 0.42, 2 * s, 3 * s);
    if (nightK() > 0.05) {
      ctx.fillStyle = U.rgba(255, 196, 120, nightK() * (0.3 + 0.6 * zk));
      ctx.fillRect(x - 1.2 * s, b - h * 0.7, 2.4 * s, 4 * s);
      lampGlow(ctx, x, b - h * 0.68, 12 * s, nightK() * (0.3 + 0.6 * zk), 29);
    }
    // 旗杆与旗（大卫的城：金色）
    const fy = b - h - 3 * s, wv = Math.sin(W.t * 2 + 3) * 1.6 * s;
    ctx.strokeStyle = css([80, 64, 48], 2); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, fy - 14 * s); ctx.stroke();
    ctx.fillStyle = zk > 0.5 ? css(GOLD, 2, 1, 0.15) : css([96, 70, 60], 2);
    ctx.beginPath(); ctx.moveTo(x, fy - 14 * s); ctx.quadraticCurveTo(x + 6 * s, fy - 13 * s + wv, x + 11 * s, fy - 11.5 * s + wv); ctx.lineTo(x, fy - 8.5 * s); ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x + d * w / 2, b - h, x + d * w / 2, b], [255, 236, 200], 0.4 * dayA(), Math.max(0.6, 0.8 * s));
  }
  // 香柏木的王宫（5:11）；米甲的窗（6:16）；王宫的平顶（11:2）
  function drawPalace(ctx) {
    const P = palaceBox(), s = SU();
    if (P.k < 0.005) return;
    const x = P.cx, b = P.base, w = P.w, H = P.H;
    ctx.save();
    ctx.beginPath(); ctx.rect(x - w, P.top - 4 * s, w * 2, b - P.top + 8 * s); ctx.clip();
    // 下层：石
    ctx.fillStyle = css([214, 198, 166], 2);
    ctx.fillRect(x - w / 2, b - H * 0.46, w, H * 0.46 + 2 * s);
    // 上层：香柏木
    ctx.fillStyle = css([128, 86, 54], 2);
    ctx.fillRect(x - w / 2 + 1.5 * s, b - H * 0.88, w - 3 * s, H * 0.42);
    // 柱与梁
    ctx.fillStyle = css([96, 64, 40], 2);
    for (let k = 0; k <= 5; k++) ctx.fillRect(x - w / 2 + 1.5 * s + k * (w - 4.2 * s) / 5, b - H * 0.88, 1.2 * s, H * 0.42);
    ctx.fillStyle = css([226, 212, 182], 2, 1, 0.05);
    ctx.fillRect(x - w / 2 - 1.5 * s, b - H * 0.9, w + 3 * s, 2.2 * s);
    ctx.fillRect(x - w / 2 - 1.5 * s, b - H, w + 3 * s, H * 0.11);
    // 门
    ctx.fillStyle = css([36, 28, 24], 2);
    ctx.beginPath(); ctx.moveTo(x - 3 * s, b); ctx.lineTo(x - 3 * s, b - H * 0.3); ctx.quadraticCurveTo(x, b - H * 0.4, x + 3 * s, b - H * 0.3); ctx.lineTo(x + 3 * s, b); ctx.closePath(); ctx.fill();
    // 上层的窗
    const nk = nightK();
    for (let k = 0; k < 4; k++) {
      const mk = k === 0 ? W.lv.dkMichal : 0, ww = (2 + 1.2 * mk) * s, wh = (2.6 + 1.3 * mk) * s;
      const wx = x - w * 0.36 + k * w * 0.24, wy = b - H * 0.72 + mk * 0.6 * s;
      ctx.fillStyle = css([34, 26, 22], 2);
      ctx.fillRect(wx - ww, wy - wh, ww * 2, wh * 2);
      let lit = nk * (k === 2 ? 0.5 : 0.9);
      if (k === 0) lit = Math.max(lit, mk * 0.95);
      if (lit > 0.02) {
        ctx.fillStyle = U.rgba(255, 204, 136, lit);
        ctx.fillRect(wx - ww, wy - wh, ww * 2, wh * 2);
        lampGlow(ctx, wx, wy, (11 + 8 * mk) * s, lit * 0.8, k * 5);
      }
      // 米甲：窗里一个女子的身影（6:16）
      if (mk > 0.02) {
        const q = s * 1.45;
        ctx.fillStyle = css([56, 36, 42], 2, mk);
        ctx.beginPath();
        ctx.ellipse(wx + 0.2 * q, wy - 0.9 * q, 0.95 * q, 1.1 * q, 0, 0, TAU);
        ctx.moveTo(wx - 1.7 * q, wy + wh); ctx.quadraticCurveTo(wx - 1.5 * q, wy - 0.4 * q, wx + 0.2 * q, wy - 0.2 * q);
        ctx.quadraticCurveTo(wx + 1.9 * q, wy - 0.4 * q, wx + 1.9 * q, wy + wh); ctx.closePath();
        ctx.fill();
      }
    }
    // 下层的窗（夜里有灯）
    if (nk > 0.05) for (const f of [-0.32, 0.32]) lampGlow(ctx, x + f * w, b - H * 0.24, 9 * s, nk * 0.6, f * 9);
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x - w / 2 - 1.5 * s, b - H, x + w / 2 + 1.5 * s, b - H], [255, 240, 210], 0.55 * dayA(), Math.max(0.6, 0.9 * s));
    rimLine(ctx, [x + d * (w / 2 + 1.5 * s), b - H, x + d * w / 2, b], [255, 236, 200], 0.35 * dayA(), Math.max(0.6, 0.8 * s));
    // 建造时的架子
    if (P.k < 0.995) {
      ctx.strokeStyle = css([150, 120, 84], 2, 0.8); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath();
      for (let k = 0; k < 4; k++) { const px = x - w / 2 - 2 * s + k * (w + 4 * s) / 3; ctx.moveTo(px, b); ctx.lineTo(px, P.top - 2 * s); }
      ctx.moveTo(x - w / 2 - 2 * s, P.top + 2 * s); ctx.lineTo(x + w / 2 + 2 * s, P.top + 2 * s);
      ctx.stroke();
    }
    ctx.restore();
  }
  // 大卫所搭的帐幕（6:17）；约柜在里面时，幔子里透出金光
  function drawTent(ctx) {
    const k = W.lv.dkTent;
    if (k < 0.01) return;
    const t = tentBox(), s = SU(), x = t.cx, b = t.base, w = t.w, h = t.h;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([226, 216, 190], 2);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, b + 1.5 * s); ctx.lineTo(x - w * 0.44, b - h * 0.7); ctx.lineTo(x - w * 0.12, b - h); ctx.lineTo(x + w * 0.12, b - h);
    ctx.lineTo(x + w * 0.44, b - h * 0.7); ctx.lineTo(x + w / 2, b + 1.5 * s); ctx.closePath(); ctx.fill();
    // 蓝色、紫色、朱红色的幔子
    const C3 = [[72, 88, 146], [120, 76, 132], [176, 58, 56]];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = css(C3[i], 2, 0.75);
      const yy = b - h * (0.18 + i * 0.1);
      ctx.fillRect(x - w * (0.47 - i * 0.012), yy, w * (0.94 - i * 0.024), 1.1 * s);
    }
    // 门帘
    ctx.fillStyle = css([150, 126, 96], 2);
    ctx.fillRect(x - 3 * s, b - h * 0.55, 6 * s, h * 0.55 + 1.5 * s);
    const ark = S.ark === 'tent';
    if (ark) {
      add2(ctx, () => {
        const br = 0.85 + 0.15 * Math.sin(W.t * 1.3);
        glowSp(ctx, SP && SP.gold, x, b - h * 0.4, w * 1.2, k * br * (0.35 + 0.35 * nightK()));
        ctx.globalAlpha = k * br * (0.4 + 0.4 * nightK());
        ctx.fillStyle = 'rgb(255,214,140)';
        ctx.fillRect(x - 3 * s, b - h * 0.55, 6 * s, h * 0.55 + 1.5 * s);
        // 淡淡的光柱
        if (SP) { ctx.globalAlpha = k * (0.12 + 0.3 * nightK()) * br; const bh = Math.min(b, W.h * 0.5); ctx.drawImage(SP.beam, x - w * 0.5, b - h - bh, w, bh); }
      });
      ctx.globalAlpha = k;
    }
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x - w * 0.12, b - h, x + w * 0.12, b - h, x + d * w * 0.44, b - h * 0.7], [255, 244, 220], k * 0.5 * dayA(), Math.max(0.6, 0.8 * s));
    ctx.globalAlpha = 1;
  }
  // 乌利亚家院中的一盏灯（11:2）：只见远远的一点暖光
  function drawCourt(ctx, x, base, w, h) {
    const k = W.lv.dkCourt;
    if (k < 0.01) return;
    const s = SU(), cx = x - w * 0.5 - 4 * s, cy = base - 2 * s;
    add2(ctx, () => {
      glowSp(ctx, SP && SP.warm, cx, cy, 18 * s, k * 0.8);
      glowSp(ctx, SP && SP.gold, cx, cy, 6 * s, k * 0.9);
    });
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  中间一带：希伯仑、俄别‧以东的家、玛哈念、树林、橄榄树、磐石、禾场、王的席
  // ════════════════════════════════════════════════════════════
  function drawHebron(ctx) {
    const k = W.lv.dkHebron;
    if (k < 0.01) return;
    const s = SU(), nk = nightK();
    ctx.globalAlpha = k;
    // 低矮的城墙
    ctx.fillStyle = css([170, 150, 118], 2, k);
    ctx.beginPath();
    const xa = 0.604, xb = 0.7;
    ctx.moveTo(xa * W.w, gY(2, xa) + 2 * s);
    for (let i = 0; i <= 12; i++) { const xf = lerp(xa, xb, i / 12); ctx.lineTo(xf * W.w, gY(2, xf) - 6 * s - (i % 2) * 1.6 * s); }
    ctx.lineTo(xb * W.w, gY(2, xb) + 2 * s);
    ctx.closePath(); ctx.fill();
    const HB = [[0.614, 12, 11, 2], [0.632, 14, 13, 0], [0.65, 11, 10, 3], [0.669, 13, 12, 1], [0.688, 10, 9, 4]];
    HB.forEach((q, i) => drawHouse(ctx, q[0] * W.w, gY(2, q[0]) - 4 * s, q[1] * s, q[2] * s, STONE[q[3]], 300 + i * 7, nk * (i % 2 ? 1 : 0.6) * k, k));
    ctx.globalAlpha = 1;
  }
  function drawObed(ctx) {
    const k = W.lv.dkObed;
    if (k < 0.01) return;
    const s = SU(), x = X.obed * W.w, b = gY(2, X.obed), bl = W.lv.dkBless;
    // 院墙
    ctx.fillStyle = css([176, 156, 124], 2, k);
    const cx0 = x + 8 * s, cx1 = (X.court + 0.024) * W.w;
    ctx.fillRect(cx0, b - 5.5 * s, cx1 - cx0, 7.5 * s);
    drawHouse(ctx, x, b, 18 * s, 15 * s, [196, 176, 140], 411, nightK() * k, k, true);
    // 蒙福：葡萄藤、院中的花、金光（6:11）
    if (bl > 0.01) {
      ctx.strokeStyle = css([70, 112, 58], 2, k * bl); ctx.lineWidth = Math.max(0.7, 1.1 * s);
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const px = x - 8 * s + i * 1.6 * s, py = b - 15 * s + Math.sin(i * 1.3) * 1.4 * s; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.stroke();
      const FL = [[244, 211, 94], [232, 106, 146], [246, 241, 231], [154, 127, 224]];
      for (let i = 0; i < 16; i++) {
        const fx0 = cx0 + rt(i * 3 + 500) * (cx1 - cx0), fy0 = b - 5.5 * s - rt(i * 3 + 501) * 2 * s;
        ctx.fillStyle = css(FL[i % 4], 2, k * bl, 0.15);
        ctx.beginPath(); ctx.arc(fx0, fy0, (0.9 + rt(i) * 0.7) * s, 0, TAU); ctx.fill();
      }
      add2(ctx, () => glowSp(ctx, SP && SP.gold, (x + cx1) / 2, b - 6 * s, 40 * s, k * bl * (0.25 + 0.25 * nightK())));
    }
    ctx.globalAlpha = 1;
    if (S.ark === 'obed') drawArk(ctx, X.court * W.w, fieldY(X.court, 0.03), PS(), k, false, 0);
  }
  // 约柜：金的柜、施恩座与两个基路伯（翅膀相对）
  function drawArk(ctx, x, b, sc, a, carried, span) {
    if (!sprites() || a < 0.01) return;
    const s = SU() * 0.95 * sc, w = 11 * s, h = 7 * s;
    const nm = W.lv.dkName;
    add2(ctx, () => {
      glowSp(ctx, SP.gold, x, b - h * 0.8, w * (3.2 + 1.6 * nightK()), a * (0.2 + 0.35 * nightK()));
      if (nm > 0.01) {
        glowSp(ctx, SP.white, x, b - h * 1.2, w * 5.5, a * nm * 0.5);
        ctx.globalAlpha = a * nm * 0.7;
        const bh = Math.min(b - 4, W.h * 0.62);
        ctx.drawImage(SP.beam, x - w * 1.8, b - h - bh, w * 3.6, bh);
      }
    });
    ctx.globalAlpha = a;
    if (carried) {
      ctx.strokeStyle = css([150, 112, 56], 2); ctx.lineWidth = Math.max(1, 1.4 * s); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - span * 0.55 - 3 * s, b + 1 * s); ctx.lineTo(x + span * 0.55 + 3 * s, b + 1 * s); ctx.stroke();
    }
    ctx.fillStyle = css(GOLD, 2, 1, 0.18);
    ctx.fillRect(x - w, b - h, w * 2, h);
    ctx.fillStyle = css([176, 132, 58], 2, 1, 0.08);
    ctx.fillRect(x - w, b - h * 0.42, w * 2, h * 0.14);
    ctx.fillStyle = css([246, 214, 128], 2, 1, 0.25);
    ctx.fillRect(x - w * 1.06, b - h - 1.5 * s, w * 2.12, 1.5 * s);
    ctx.beginPath();
    for (const d of [-1, 1]) {
      const c0 = x + d * w * 0.72, y0 = b - h - 1.5 * s;
      ctx.moveTo(c0, y0); ctx.lineTo(c0 + d * 1.1 * s, y0 - 3.9 * s); ctx.lineTo(c0 - d * 1.3 * s, y0 - 3.4 * s); ctx.closePath();
      ctx.moveTo(c0 + d * 0.4 * s, y0 - 3.4 * s);
      ctx.quadraticCurveTo(c0 - d * w * 0.2, y0 - 8 * s, c0 - d * w * 0.66, y0 - 4.9 * s);
      ctx.quadraticCurveTo(c0 - d * w * 0.3, y0 - 5.5 * s, c0 - d * 0.6 * s, y0 - 2.2 * s);
      ctx.closePath();
    }
    ctx.fill();
    const lx = litX() >= x ? 1 : -1;
    rimLine(ctx, [x - w * 1.06, b - h - 1.5 * s, x + w * 1.06, b - h - 1.5 * s], [255, 242, 200], a * (0.55 * dayA() + 0.3 * nightK()), Math.max(0.6, 0.8 * s));
    rimLine(ctx, [x + lx * w, b - h, x + lx * w, b], [255, 242, 200], a * 0.4, Math.max(0.5, 0.7 * s));
    ctx.globalAlpha = 1;
  }
  // 抬着的约柜：在抬的人肩上（画在人之后）
  function arkCarried() {
    let sx = 0, sy = 0, sh = 0, n = 0, lo = 1e9, hi = -1e9;
    for (const id of LEV) {
      const f = fig(id);
      if (!f) continue;
      // 用人物的逻辑位置（每帧由 update 推进），不依赖上一帧画出的位置
      const p = [f.nx * W.w, fieldY(f.nx, f.v)], h = PH() * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
      sx += p[0]; sy += p[1]; sh += h; n++;
      lo = Math.min(lo, p[0]); hi = Math.max(hi, p[0]);
    }
    if (!n) return null;
    const h = sh / n;
    return { x: sx / n, y: sy / n - h * 0.84, span: hi - lo, a: Math.min(...LEV.map(id => (fig(id) ? fig(id).alpha : 1))) };
  }
  function arkPos() {
    if (S.ark === 'poles') { const q = arkCarried(); return q ? { x: q.x, y: q.y } : null; }
    if (S.ark === 'obed') return { x: X.court * W.w, y: fieldY(X.court, 0.03) };
    if (S.ark === 'tent') { const t = tentBox(); return { x: t.cx, y: t.base - 2 * SU() }; }
    return null;
  }

  function drawOlive(ctx, xf, size, seed) {
    const s = SU() * size, x = xf * W.w, b = gY(2, xf) + 1.5 * s;
    ctx.fillStyle = css([74, 60, 46], 2);
    ctx.beginPath();
    ctx.moveTo(x - 2.4 * s, b); ctx.quadraticCurveTo(x - 0.5 * s, b - 6 * s, x - 1.8 * s, b - 12 * s);
    ctx.lineTo(x + 0.4 * s, b - 12.5 * s); ctx.quadraticCurveTo(x + 1.6 * s, b - 6 * s, x + 2.6 * s, b);
    ctx.closePath(); ctx.fill();
    // 银绿色的树冠
    const cols = [[112, 128, 92], [128, 142, 104], [98, 116, 84]];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + seed, r = (5.5 + rt(seed * 5 + i) * 3) * s;
      const cx = x + Math.cos(a) * 7 * s * (0.8 + 0.3 * rt(seed + i)), cy = b - 15 * s + Math.sin(a) * 3.6 * s;
      ctx.fillStyle = css(cols[i % 3], 2);
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.72, 0, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = css([164, 172, 136], 2, 0.5 * dayA(), 0.1);
    const d = litX() >= x ? 1 : -1;
    for (let i = 0; i < 4; i++) {
      const cx = x + d * (2 + i * 2.2) * s, cy = b - 18.5 * s + i * 0.8 * s;
      ctx.beginPath(); ctx.ellipse(cx, cy, 3 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    }
  }
  function drawOak(ctx, xf, size, seed, great, a) {
    const s = SU() * size, x = xf * W.w, b = gY(2, xf) + 1.5 * s;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([58, 44, 34], 2);
    ctx.beginPath();
    ctx.moveTo(x - 3 * s, b); ctx.quadraticCurveTo(x - 1.4 * s, b - 10 * s, x - 2.2 * s, b - 20 * s);
    ctx.lineTo(x + 1.6 * s, b - 20 * s); ctx.quadraticCurveTo(x + 1.6 * s, b - 10 * s, x + 3.4 * s, b);
    ctx.closePath(); ctx.fill();
    if (great) {
      // 伸向左边的低枝（18:9）
      ctx.strokeStyle = css([58, 44, 34], 2); ctx.lineCap = 'round';
      ctx.lineWidth = 2.4 * s;
      ctx.beginPath(); ctx.moveTo(x - 1 * s, b - 14 * s); ctx.quadraticCurveTo(x - 8 * s, b - 17 * s, x - 15 * s, b - 15 * s); ctx.stroke();
      ctx.lineWidth = 1.2 * s;
      ctx.beginPath(); ctx.moveTo(x - 9 * s, b - 16.2 * s); ctx.lineTo(x - 12 * s, b - 20 * s); ctx.stroke();
    }
    const cols = [[46, 76, 44], [58, 90, 50], [40, 66, 42]];
    for (let i = 0; i < 9; i++) {
      const aa = (i / 9) * TAU + seed, r = (7 + rt(seed * 3 + i) * 4) * s;
      const cx = x + Math.cos(aa) * 10 * s * (0.8 + 0.3 * rt(seed + i)) - (great ? 3 * s : 0), cy = b - 27 * s + Math.sin(aa) * 6 * s;
      ctx.fillStyle = css(cols[i % 3], 2);
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.8, 0, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = css([120, 150, 96], 2, 0.4 * dayA(), 0.1);
    const d = litX() >= x ? 1 : -1;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(x + d * (3 + i * 3) * s, b - 34 * s + i * 1.4 * s, 4 * s, 2 * s, 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function oakBranchPt() { const s = SU() * OAKS[1][1], x = X.oak * W.w, b = gY(2, X.oak) + 1.5 * s; return [x - 12 * s, b - 15.5 * s]; }
  function drawCairn(ctx) {
    const k = W.lv.dkCairn;
    if (k < 0.01) return;
    const s = SU(), x = (X.oak - 0.012) * W.w, b = fieldY(X.oak - 0.012, 0.08), n = Math.round(k * 16);
    for (let i = 0; i < n; i++) {
      const row = i < 7 ? 0 : i < 12 ? 1 : i < 15 ? 2 : 3, inRow = [7, 5, 3, 1][row], j = i - [0, 7, 12, 15][row];
      const px = x + (j - (inRow - 1) / 2) * 3.6 * s + (rt(i + 800) - 0.5) * s, py = b - row * 2.8 * s - 1.4 * s;
      ctx.fillStyle = css([150 + rt(i) * 30, 140 + rt(i + 1) * 24, 120 + rt(i + 2) * 20], 2);
      ctx.beginPath(); ctx.ellipse(px, py, 2.2 * s, 1.6 * s, rt(i + 3), 0, TAU); ctx.fill();
    }
  }
  function mahaBox() {
    const s = SU(), cx = X.maha * W.w, b = gY(2, X.maha) + 2 * s, tw = 11 * s, th = 30 * s, aw = 8 * s, ah = 13 * s;
    const floor = b - th * 0.66;
    return { cx, b, tw, th, aw, ah, floor, stairX0: cx + aw / 2 + tw * 0.4, stairX1: cx + aw / 2 + tw + 9 * s };
  }
  // 玛哈念的城门与城门楼（18:24，33）
  function drawMaha(ctx) {
    const k = W.lv.dkMaha;
    if (k < 0.01) return;
    const g = mahaBox(), s = SU(), x = g.cx, b = g.b;
    ctx.globalAlpha = k;
    const col = [186, 166, 132];
    // 两侧的城墙
    ctx.fillStyle = css(U.mixRGB(col, [120, 100, 80], 0.15), 2);
    ctx.fillRect(x - 26 * s, b - 11 * s, 52 * s, 11 * s + 2 * s);
    for (let i = 0; i < 7; i++) ctx.fillRect(x - 26 * s + i * 7.9 * s, b - 13.4 * s, 3.4 * s, 2.4 * s);
    ctx.fillStyle = css(col, 2);
    ctx.fillRect(x - g.aw / 2 - g.tw, b - g.th, g.tw * 2 + g.aw, g.th + 2 * s);
    for (let i = 0; i < 5; i++) ctx.fillRect(x - g.aw / 2 - g.tw + i * (g.aw + 2 * g.tw) / 4.4, b - g.th - 2.6 * s, 2.8 * s, 2.6 * s);
    // 门洞
    ctx.fillStyle = css([26, 20, 18], 2);
    ctx.beginPath(); ctx.moveTo(x - g.aw / 2, b + s); ctx.lineTo(x - g.aw / 2, b - g.ah * 0.7); ctx.quadraticCurveTo(x, b - g.ah * 1.1, x + g.aw / 2, b - g.ah * 0.7); ctx.lineTo(x + g.aw / 2, b + s); ctx.closePath(); ctx.fill();
    // 城门楼的窗（王在里面哀哭时有灯）
    const wy = g.floor - 5 * s, lit = Math.max(nightK() * 0.7, S.paths.david === 'tower' ? 0.9 : 0);
    ctx.fillStyle = css([30, 24, 20], 2);
    ctx.fillRect(x - 3 * s, wy - 3.5 * s, 6 * s, 7 * s);
    if (lit > 0.02) { ctx.fillStyle = U.rgba(255, 196, 124, lit * k); ctx.fillRect(x - 3 * s, wy - 3.5 * s, 6 * s, 7 * s); lampGlow(ctx, x, wy, 16 * s, lit * k, 7); ctx.globalAlpha = k; }
    // 楼右边的梯
    ctx.fillStyle = css(U.mixRGB(col, [90, 76, 60], 0.25), 2);
    ctx.beginPath(); ctx.moveTo(g.stairX1, b + s); ctx.lineTo(g.stairX0, g.floor + 1.5 * s); ctx.lineTo(g.stairX0, b + s); ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x - g.aw / 2 - g.tw, b - g.th, x + g.aw / 2 + g.tw, b - g.th], [255, 240, 210], k * 0.45 * dayA(), Math.max(0.6, 0.8 * s));
    rimLine(ctx, [x + d * (g.aw / 2 + g.tw), b - g.th, x + d * (g.aw / 2 + g.tw), b], [255, 236, 200], k * 0.35 * dayA(), Math.max(0.6, 0.8 * s));
    ctx.globalAlpha = 1;
  }
  function rockBox() {
    const s = SU(), cx = X.rock * W.w, b = gY(2, X.rock) + 3 * s, w = 44 * s, h = 38 * s;
    return { cx, b, w, h, top: b - h, rampX0: cx + w * 0.22, rampX1: cx + w * 0.62 };
  }
  // 海边的大磐石（16:13 示每；21:10 利斯巴；22:2「耶和华是我的岩石」）
  function drawRock(ctx) {
    const r = rockBox(), s = SU(), x = r.cx, b = r.b, w = r.w, h = r.h;
    const pts = [[-0.62, 0], [-0.58, -0.36], [-0.5, -0.7], [-0.36, -0.93], [-0.14, -1], [0.1, -0.99], [0.22, -0.96], [0.34, -0.7], [0.5, -0.4], [0.62, -0.16], [0.66, 0]];
    ctx.fillStyle = css([164, 152, 132], 2);
    ctx.beginPath();
    pts.forEach((q, i) => { const px = x + q[0] * w, py = b + q[1] * h; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
    ctx.closePath(); ctx.fill();
    // 石的纹与影
    ctx.fillStyle = css([118, 108, 94], 2, 0.6);
    ctx.beginPath(); ctx.moveTo(x - 0.1 * w, b); ctx.lineTo(x - 0.02 * w, b - 0.55 * h); ctx.lineTo(x + 0.14 * w, b - 0.62 * h); ctx.lineTo(x + 0.3 * w, b - 0.3 * h); ctx.lineTo(x + 0.4 * w, b); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([108, 98, 86], 2, 0.6); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.4 * w, b - 0.5 * h); ctx.lineTo(x - 0.22 * w, b - 0.62 * h);
    ctx.moveTo(x - 0.3 * w, b - 0.2 * h); ctx.lineTo(x - 0.12 * w, b - 0.3 * h);
    ctx.stroke();
    // 苔与小草
    ctx.fillStyle = css([92, 118, 66], 2, 0.8);
    for (let i = 0; i < 6; i++) { const q = pts[3 + (i % 4)]; ctx.beginPath(); ctx.ellipse(x + q[0] * w + i * s, b + q[1] * h + 0.8 * s, 2.4 * s, 1 * s, 0, 0, TAU); ctx.fill(); }
    const d = litX() >= x ? 1 : -1;
    const rim = [];
    pts.forEach(q => { if (q[0] * d > -0.4) rim.push(x + q[0] * w, b + q[1] * h); });
    rimLine(ctx, rim, [255, 240, 206], 0.45 * dayA() + 0.1 * nightK(), Math.max(0.8, 1.1 * s));
    // 利斯巴的麻布棚（21:10）
    const rk = W.lv.dkRizpah;
    if (rk > 0.01) {
      const tx = x - 0.28 * w, ty = r.top + 1 * s;
      ctx.fillStyle = css([132, 116, 90], 2, rk);
      ctx.beginPath(); ctx.moveTo(tx - 9 * s, ty + 1 * s); ctx.lineTo(tx - 2 * s, ty - 10 * s); ctx.lineTo(tx + 5 * s, ty + 1 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([80, 66, 50], 2, rk); ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(tx - 2 * s, ty - 10 * s); ctx.lineTo(tx - 2 * s, ty + 1 * s); ctx.stroke();
    }
    const rf = W.lv.dkRizFire;
    if (rf > 0.01) flame(ctx, x + 0.18 * w, r.top + 0.5 * s, 6 * s, rf, 41);
  }
  function floorBox() { const s = SU(), cx = X.floor * W.w, b = gY(2, X.floor) + 2 * s; return { cx, b, rx: 22 * s, ry: 3.6 * s, top: b - 5 * s }; }
  // 亚劳拿的禾场（24:16–25）：石台上一片圆的场，碎麦、打粮的器具；其上筑起一座坛
  function drawFloor(ctx) {
    const k = W.lv.dkFloor;
    if (k < 0.01) return;
    const F = floorBox(), s = SU(), x = F.cx;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([150, 138, 116], 2);
    ctx.beginPath(); ctx.moveTo(x - F.rx * 1.25, F.b + 2 * s); ctx.quadraticCurveTo(x - F.rx * 1.1, F.top - 1 * s, x, F.top - 1.2 * s); ctx.quadraticCurveTo(x + F.rx * 1.1, F.top - 1 * s, x + F.rx * 1.25, F.b + 2 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([214, 196, 150], 2);
    ctx.beginPath(); ctx.ellipse(x, F.top, F.rx, F.ry, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([236, 206, 120], 2, 0.8, 0.1);
    for (let i = 0; i < 20; i++) { const a = rt(i + 900) * TAU, rr = Math.sqrt(rt(i + 950)) * 0.85; ctx.fillRect(x + Math.cos(a) * F.rx * rr, F.top + Math.sin(a) * F.ry * rr, 1.6 * s, 0.6 * s); }
    // 打粮的器具（24:22）与禾捆
    ctx.fillStyle = css([96, 72, 50], 2);
    ctx.fillRect(x - F.rx * 0.8, F.top - 1.2 * s, 8 * s, 2 * s);
    ctx.fillStyle = css([222, 186, 104], 2, 1, 0.08);
    for (const q of [[0.72, 1], [0.86, 0.8]]) { const px = x + F.rx * q[0], py = F.top; ctx.beginPath(); ctx.moveTo(px - 2 * s * q[1], py); ctx.lineTo(px, py - 7 * s * q[1]); ctx.lineTo(px + 2 * s * q[1], py); ctx.closePath(); ctx.fill(); }
    const d = litX() >= x ? 1 : -1;
    rimLine(ctx, [x - F.rx * d * 0.2, F.top - F.ry, x + F.rx * d, F.top], [255, 240, 200], 0.35 * dayA(), Math.max(0.6, 0.8 * s));
    ctx.globalAlpha = 1;
    drawAltar(ctx);
  }
  function altarBox() { const s = SU(), F = floorBox(), cx = X.altar * W.w; return { cx, b: F.top + 1 * s, w: 16 * s, h: 13 * s, top: F.top + 1 * s - 5 * 2.7 * s }; }
  function drawAltar(ctx) {
    const k = W.lv.dkAltar;
    if (k < 0.01) return;
    const A = altarBox(), s = SU(), n = Math.round(k * 20);
    // 没有凿过的石头，一块一块叠起来
    const ROWS = [6, 5, 4, 3, 2], OFF = [0, 6, 11, 15, 18];
    for (let i = 0; i < n; i++) {
      let row = 0; while (row < 4 && i >= OFF[row + 1]) row++;
      const inRow = ROWS[row], j = i - OFF[row];
      const px = A.cx + (j - (inRow - 1) / 2) * 3.1 * s, py = A.b - row * 2.7 * s - 1.4 * s;
      ctx.fillStyle = css([170 + rt(i + 40) * 30, 158 + rt(i + 41) * 26, 134 + rt(i + 42) * 20], 2);
      ctx.beginPath(); ctx.ellipse(px, py, 1.9 * s, 1.5 * s, rt(i + 43) - 0.5, 0, TAU); ctx.fill();
    }
    if (k > 0.95) rimLine(ctx, [A.cx - 3.5 * s, A.top + 1 * s, A.cx + 3.5 * s, A.top + 1 * s], [255, 236, 200], 0.5 * dayA(), Math.max(0.6, 0.8 * s));
  }
  // 燔祭的火与烟（画在人之后，不被人与牲畜挡住）
  function drawAltarFire(ctx) {
    const f = W.lv.dkFire;
    if (f < 0.01 || W.lv.dkAltar < 0.5 || !sprites()) return;
    const A = altarBox(), s = SU();
    add2(ctx, () => glowSp(ctx, SP.warm, A.cx, A.top - 4 * s, 60 * s, f * (0.35 + 0.35 * nightK())));
    smoke(ctx, A.cx, A.top - 10 * s, f * 1.3, W.h * 0.45, 8 * s, 5, 14);
    flame(ctx, A.cx, A.top + 1.5 * s, 17 * s, f, 3);
  }
  // 王的席（9:7，13）
  function drawTable(ctx) {
    const k = W.lv.dkTable;
    if (k < 0.01) return;
    const s = SU(), x = X.table * W.w, b = fieldY(X.table, 0.3), w = 34 * s;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([96, 70, 48], 2);
    ctx.fillRect(x - w / 2 + 2 * s, b - 6 * s, 1.6 * s, 6 * s); ctx.fillRect(x + w / 2 - 3.6 * s, b - 6 * s, 1.6 * s, 6 * s);
    ctx.fillStyle = css([236, 228, 206], 2);
    ctx.fillRect(x - w / 2, b - 7.4 * s, w, 1.8 * s);
    ctx.fillStyle = css([150, 110, 70], 2);
    ctx.fillRect(x - w / 2, b - 5.8 * s, w, 1 * s);
    // 饼、葡萄饼、杯
    for (let i = 0; i < 5; i++) {
      const px = x - w * 0.38 + i * w * 0.19;
      ctx.fillStyle = css(i % 2 ? [200, 150, 90] : [128, 60, 76], 2, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(px, b - 8.3 * s, 2 * s, 1 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = css(GOLD, 2, 1, 0.2);
    ctx.fillRect(x - 1 * s, b - 10.4 * s, 2 * s, 2.4 * s);
    ctx.globalAlpha = 1;
    lampGlow(ctx, x, b - 9 * s, 20 * s, k * (0.3 + 0.6 * nightK()), 11);
  }
  // 亚扪人的京城拉巴（中丘上远远的一座城；11:1）
  function drawRabbah(ctx) {
    const k = W.lv.dkRabbah;
    if (k < 0.01) return;
    const s = LS(1) / Math.max(0.3, W.layerScale(1)) * W.layerScale(1) * (MOB() ? 1.3 : 1.1), x = X.rabbah * W.w, b = gY(1, X.rabbah) + 2 * s;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([150, 134, 116], 1);
    ctx.fillRect(x - 26 * s, b - 12 * s, 52 * s, 12 * s + 2 * s);
    for (const q of [[-24, 20], [-8, 26], [10, 22], [24, 17]]) {
      ctx.fillRect(x + q[0] * s - 4 * s, b - q[1] * s, 8 * s, q[1] * s);
      for (let i = 0; i < 3; i++) ctx.fillRect(x + q[0] * s - 4 * s + i * 3 * s, b - q[1] * s - 2 * s, 1.8 * s, 2 * s);
    }
    // 约押的营火（围攻）
    const nk = 0.4 + 0.6 * nightK();
    for (let i = 0; i < 7; i++) {
      const px = x + (-50 + i * 17) * s * (i % 2 ? 1 : 0.9), py = b + (4 + (i % 3) * 3) * s;
      ctx.fillStyle = U.rgba(255, 170, 90, k * nk * 0.9);
      ctx.fillRect(px - 0.8 * s, py - 0.8 * s, 1.6 * s, 1.6 * s);
      lampGlow(ctx, px, py, 7 * s, k * nk * 0.6, i);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天上：众星聚成的家、一行直到永远的星、计谋、遍地的小光、瘟疫的影子、露
  // ════════════════════════════════════════════════════════════
  let HOUSE_PTS = null;
  function houseGeom() {
    if (HOUSE_PTS) return HOUSE_PTS;
    // 一座家（亦是殿）：台基、墙、两根柱、门、山墙（以 u 为单位）
    const segs = [
      [[-2.2, 0], [2.2, 0]], [[-2, 0], [-2, -2.2]], [[2, 0], [2, -2.2]], [[-2.5, -2.2], [2.5, -2.2]],
      [[-2.5, -2.2], [0, -3.7]], [[0, -3.7], [2.5, -2.2]], [[-1.1, 0], [-1.1, -2.2]], [[1.1, 0], [1.1, -2.2]],
      [[-0.45, 0], [-0.45, -1.2]], [[-0.45, -1.2], [0.45, -1.2]], [[0.45, -1.2], [0.45, 0]],
    ];
    const pts = [];
    segs.forEach(sg => {
      const [a, b] = sg, L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 0.55));
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t);
        if (!pts.some(p => Math.hypot(p[0] - x, p[1] - y) < 0.2)) pts.push([x, y, i === 0 || i === n ? 1 : 0]);
      }
    });
    pts.forEach((p, i) => { p[3] = (p[1] * -0.3 + (p[0] + 2.5) * 0.08 + rt(i + 1200) * 0.2); });
    const mx = Math.max(...pts.map(p => p[3])), mn = Math.min(...pts.map(p => p[3]));
    pts.forEach(p => { p[3] = (p[3] - mn) / (mx - mn || 1); });
    HOUSE_PTS = { segs, pts };
    return HOUSE_PTS;
  }
  function houseFrame() {
    const u = M() * (MOB() ? 0.042 : 0.048);
    return { cx: W.w * (MOB() ? 0.78 : 0.855), cy: W.h * (MOB() ? 0.47 : 0.4), u };
  }
  function star(ctx, x, y, r, a, warm) {
    if (a < 0.01) return;
    glowSp(ctx, warm ? SP.gold : SP.white, x, y, r * 4, a * 0.55);
    ctx.globalAlpha = a;
    ctx.fillStyle = warm ? 'rgb(255,238,196)' : 'rgb(248,246,255)';
    ctx.fillRect(x - r * 0.5, y - r * 0.5, r, r);
    ctx.fillRect(x - r * 1.6, y - 0.3, r * 3.2, 0.6);
    ctx.fillRect(x - 0.3, y - r * 1.6, 0.6, r * 3.2);
  }
  function drawStarHouse(ctx) {
    const k = W.lv.dkHouse, l = W.lv.dkLine;
    if ((k < 0.01 && l < 0.01) || !sprites()) return;
    const G = houseGeom(), F = houseFrame(), sk = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    if (k > 0.01) {
      // 淡淡的连线
      ctx.strokeStyle = U.rgba(255, 232, 190, 0.22 * sk * clamp(k * 1.4 - 0.4, 0, 1));
      ctx.lineWidth = Math.max(0.6, F.u * 0.02);
      ctx.beginPath();
      for (const sg of G.segs) { ctx.moveTo(F.cx + sg[0][0] * F.u, F.cy + sg[0][1] * F.u); ctx.lineTo(F.cx + sg[1][0] * F.u, F.cy + sg[1][1] * F.u); }
      ctx.stroke();
      for (let i = 0; i < G.pts.length; i++) {
        const p = G.pts[i], a = clamp((k - p[3] * 0.85) * 6, 0, 1) * sk;
        const tw = 0.75 + 0.25 * Math.sin(W.t * (1.3 + rt(i) * 2) + i);
        star(ctx, F.cx + p[0] * F.u, F.cy + p[1] * F.u, (p[2] ? 2.2 : 1.4) * Math.max(0.7, W.unit), a * tw, true);
      }
    }
    if (l > 0.01) {
      // 一行星：自王宫升起，经过这家，直到天顶（直到永远）
      const P = palaceBox(), x0 = P.cx, y0 = P.roof - 8 * SU(), n = 22;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1), y = lerp(y0, W.h * 0.1, Math.pow(t, 0.9)), x = lerp(x0, F.cx, Math.min(1, t * 1.6)) + Math.sin(t * 5 + 1) * F.u * 0.12;
        const a = clamp((l - t * 0.9) * 8, 0, 1) * sk * (1 - 0.75 * t * t);
        const tw = 0.7 + 0.3 * Math.sin(W.t * 2.1 + i * 1.7);
        star(ctx, x, y, (1.1 + (i % 4 === 0 ? 0.8 : 0)) * Math.max(0.7, W.unit), a * tw, i % 3 !== 1);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 亚希多弗的计谋（17:1–14）：城门口亚希多弗头上一团打了结的暗绳，旁边写着它的名；
  // 耶和华定意破坏——绳结一下子断开，化作金线向上散开，归于无有
  const KNOT_N = 96;
  function knotPt(t, cx, cy, R) {
    return [cx + R * (0.9 * Math.sin(2 * t) + 0.32 * Math.sin(5 * t + 0.4)), cy + R * 0.5 * (Math.cos(3 * t) + 0.35 * Math.cos(7 * t))];
  }
  function drawCounsel(ctx) {
    const k = W.lv.dkCounsel, u = clamp(W.lv.dkUnravel, 0, 1);
    if (k < 0.01 || !sprites()) return;
    const p = figPt('ahithophel', 1), s = PH();
    const cx = p ? p[0] : W.w * 0.78, cy = p ? p[1] - s * 1.05 : W.h * 0.55, R = s * (MOB() ? 0.8 : 0.78);
    const keep = k * (1 - u);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    // 身后一层淡淡的暗（白日里不成一团黑影）
    glowSp(ctx, SP.dark, cx, cy, R * 1.9, keep * 0.22);
    ctx.globalAlpha = 1;
    // 绳：解开时从断处向两头退去，向上舒展，由暗转金
    const gap = u * Math.PI * 0.98, col = U.mixRGB([84, 38, 50], [255, 214, 130], Math.min(1, u * 2.2));
    const lw = Math.max(2.4, s * 0.09) * (1 - 0.4 * u), fade = u > 0.02 ? Math.pow(1 - u, 0.6) : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const pass of [2, 0, 1]) {
      ctx.beginPath();
      let first = true;
      for (let i = 0; i <= KNOT_N; i++) {
        const t = gap + (TAU - 2 * gap) * i / KNOT_N;
        if (TAU - 2 * gap <= 0.01) break;
        let [x, y] = knotPt(t, cx, cy, R);
        const d = Math.min(t, TAU - t) / Math.PI;            // 离断处多远（0 断处 … 1 最远）
        x = cx + (x - cx) * (1 + u * 1.2) + Math.sin(t * 3 + W.t * 0.8) * u * R * 0.2;
        y -= u * R * (0.6 + 1.4 * (1 - d)) ;
        if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
      }
      // 2：绳外一圈淡的边（在海与城墙前都分得出）；0：绳；1：绳上的一道亮
      if (pass === 2) { ctx.strokeStyle = U.rgba(246, 236, 214, 0.5 * k * (1 - u)); ctx.lineWidth = lw * 2.3; }
      else if (pass === 0) { ctx.strokeStyle = U.rgba(col[0], col[1], col[2], 0.95 * fade * k); ctx.lineWidth = lw; }
      else { ctx.strokeStyle = U.rgba(255, 246, 226, (u > 0.02 ? 0.7 * fade : 0.22) * k); ctx.lineWidth = lw * 0.35; }
      ctx.stroke();
    }
    // 断开的一刹那：金光
    if (u > 0.005) {
      const f = Math.sin(Math.PI * Math.min(1, u * 1.6));
      add2(ctx, () => { glowSp(ctx, SP.gold, cx, cy - u * R * 0.8, R * (2 + u * 1.5), f * 0.85 * k); glowSp(ctx, SP.white, cx, cy - u * R * 0.5, R * 0.6, f * 0.5 * k); });
    }
    // 名：亚希多弗的计谋
    const la = keep * clamp(k * 1.6 - 0.4, 0, 1);
    if (la > 0.02) {
      const fs = Math.round(clamp(M() * 0.02, 13, 17));
      ctx.save();
      ctx.globalAlpha = la;
      ctx.font = fs + 'px "GS Kai", "KaiTi", "STKaiti", "Songti SC", serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgb(250,240,222)';
      ctx.fillText('亚希多弗的计谋', clamp(cx, fs * 4, W.w - fs * 4), cy - R * 0.72);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  // 数点百姓：遍地亮起的小光（24:2–9）；瘟疫的影子走过之处，光就灭了（24:15）
  const TALLY = [];
  (function () {
    for (let i = 0; i < 110; i++) {
      const l = i < 30 ? 0 : i < 60 ? 1 : 2;
      TALLY.push({ l, x: l === 0 ? lerp(0.14, 0.99, rt(i * 3 + 1500)) : l === 1 ? lerp(0.5, 0.99, rt(i * 3 + 1500)) : lerp(0.42, 0.99, rt(i * 3 + 1500)), v: rt(i * 3 + 1501) * 0.8, ph: rt(i * 3 + 1502) * TAU });
    }
  })();
  // 瘟疫的影子自西（左）向东走过全地，直走到亚劳拿的禾场前（24:15–16）；「够了！」时就停在那里
  let haltAt = null;          // 一时的：话语出口时影子的前锋（只影响画，不是本卷的状态；世界的程度仍由 dkPlague 决定）
  const PF0 = 0.18, PF1 = X.floor - 0.04;
  function plagueP() { const p = W.lv.dkPlague; return haltAt != null ? haltAt * p : p; }
  const plagueFront = () => lerp(PF0, PF1, 1 - Math.pow(1 - clamp(plagueP(), 0, 1), 2));
  function drawTally(ctx, l) {
    const k = W.lv.dkCount;
    if (k < 0.01 || !sprites()) return;
    const front = plagueFront(), dim = lerp(1, 0.1, clamp(W.lv.dkVeil, 0, 1)), s = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < TALLY.length; i++) {
      const q = TALLY[i];
      if (q.l !== l) continue;
      const on = clamp(k * TALLY.length - i * 0.8, 0, 1) * (q.x < front ? dim : 1);
      if (on < 0.02) continue;
      const g = gY(l, q.x), y = l === 2 ? g + q.v * (W.h - g) * 0.7 : g + q.v * Math.max(2, W.waterlineY(l) - g) * 0.8;
      const a = on * (0.55 + 0.45 * Math.sin(W.t * 2 + q.ph)) * (l === 0 ? 0.6 : 0.85);
      glowSp(ctx, SP.gold, q.x * W.w, y - 2 * s, (l + 2) * 2.2 * s, a * 0.8);
      ctx.globalAlpha = a; ctx.fillStyle = 'rgb(255,226,160)';
      ctx.fillRect(q.x * W.w - 0.8 * s, y - 2.8 * s, 1.6 * s, 1.6 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 影子：贴着各层地的轮廓，上缘柔和（不压到天与海上），前锋也柔和；在各层的布景之后、人之前画
  let VEIL = null, VEIL_H = 0;
  function veilSprite() {
    const H = Math.max(8, Math.round(W.h));
    if (VEIL && VEIL_H === H) return VEIL;
    try {
      const c = cnv(2, H), g = c.getContext('2d'), fe = Math.min(0.9, (W.h * 0.08) / H);
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, 'rgba(62,64,88,0)'); gr.addColorStop(fe, 'rgba(62,64,88,1)'); gr.addColorStop(1, 'rgba(56,58,82,1)');
      g.fillStyle = gr; g.fillRect(0, 0, 2, H);
      VEIL = c; VEIL_H = H;
    } catch (e) { VEIL = null; }
    return VEIL;
  }
  const SPANS = { key: '', v: [] };
  function landSpanF(l) {
    const key = W.w + 'x' + W.h;
    if (SPANS.key !== key) { SPANS.key = key; SPANS.v = [0, 1, 2].map(i => { const r = W.landSpan ? W.landSpan(i) : null; return r ? [r[0] / W.w, r[1] / W.w] : null; }); }
    return SPANS.v[l];
  }
  const VEIL_A = [0.36, 0.5, 0.66];
  function drawVeil(ctx, l) {
    const vk = W.lv.dkVeil;
    if (vk < 0.01 || W.lv.dkPlague < 0.002) return;
    const src = veilSprite(), sp = landSpanF(l);
    if (!src || !sp) return;
    const front = plagueFront(), x0 = Math.round(sp[0] * W.w), x1 = Math.round(Math.min(sp[1], front + 0.03) * W.w);
    if (x1 <= x0) return;
    const step = Math.max(3, Math.round(W.w / 200)), A = VEIL_A[l] * clamp(vk, 0, 1), fw = W.w * 0.05;
    for (let x = x0; x < x1; x += step) {
      const w = Math.min(step, x1 - x), xm = x + w * 0.5;
      const top = gY(l, xm / W.w) - 1, bot = l === 2 ? W.h : W.waterlineY(l) + 2, h = bot - top;
      if (!(h > 1)) continue;
      const e = clamp((front * W.w - xm) / fw + 0.4, 0, 1) * clamp((xm - x0) / (W.w * 0.025), 0, 1);
      if (e < 0.01) continue;
      ctx.globalAlpha = A * e;
      ctx.drawImage(src, 0, 0, 2, Math.min(src.height, h), x, top, w, h);
    }
    ctx.globalAlpha = 1;
  }
  // 雨后的晴光：嫩草上的露（23:4）
  function drawDew(ctx) {
    const k = W.lv.dkDew;
    if (k < 0.01 || !sprites()) return;
    const s = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) {
      const xf = lerp(0.4, 1, rt(i * 2 + 1800)), v = rt(i * 2 + 1801) * 0.9, y = fieldY(xf, v);
      const tw = Math.pow(Math.max(0, Math.sin(W.t * (1.2 + rt(i) * 1.6) + i * 2.1)), 3);
      const a = k * tw * 0.9;
      if (a < 0.02) continue;
      glowSp(ctx, SP.white, xf * W.w, y - 1.5 * s, 4 * s, a * 0.8);
      ctx.globalAlpha = a; ctx.fillStyle = 'rgb(255,252,236)';
      ctx.fillRect(xf * W.w - 0.6 * s, y - 2.1 * s, 1.2 * s, 1.2 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  人之后：抬着的约柜、角、王冠、金盾牌、信、自天而降的光、天使的光
  // ════════════════════════════════════════════════════════════
  function drawHorns(ctx) {
    if (!S.horns) return;
    for (const id of HORN) {
      const f = fig(id);
      if (!f || !f._vis || f.alpha < 0.05) continue;
      const h = f._h, d = f.fd >= 0 ? 1 : -1, x = f._x, y = f._y, blow = 0.6 + 0.4 * Math.sin(W.t * 2.4 + id.length);
      const mx = x + 0.07 * h * d, my = y - 0.85 * h, bx = x + 0.36 * h * d, by = y - (1.02 + 0.06 * blow) * h;
      ctx.globalAlpha = f.alpha;
      ctx.strokeStyle = css([226, 204, 156], 2, 1, 0.1);
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(1, 0.035 * h);
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(x + 0.24 * h * d, my + 0.02 * h, bx, by); ctx.stroke();
      ctx.lineWidth = Math.max(1.2, 0.06 * h);
      ctx.beginPath(); ctx.moveTo(lerp(mx, bx, 0.6), lerp(my, by, 0.55)); ctx.quadraticCurveTo(x + 0.3 * h * d, my - 0.04 * h, bx, by); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 3; k++) {
        const ph2 = U.fract(W.t * 0.9 + k / 3 + HORN.indexOf(id) * 0.17), r = h * (0.15 + ph2 * 0.9);
        ctx.strokeStyle = U.rgba(255, 234, 190, blow * 0.45 * (1 - ph2) * f.alpha);
        ctx.lineWidth = Math.max(0.6, 0.02 * h);
        ctx.beginPath(); ctx.arc(bx, by, r, d > 0 ? -1.1 : Math.PI - 0.4, d > 0 ? 0.4 : Math.PI + 1.1); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 王冠：一道细细的金圈（按人物模块记下的头的位置）
  const HIPK = { stand: 0.49, walk: 0.49, run: 0.48, raise: 0.49, gaze: 0.49, point: 0.49, carry: 0.49, weep: 0.48, embrace: 0.48, bow: 0.47, kneel: 0.27, pray: 0.27, seat: 0.27, sit: 0.126 };
  function drawCrown(ctx) {
    if (!S.crown) return;
    const f = fig('david');
    if (!f || !f._vis || f.alpha < 0.1 || !f._headL || HIPK[f.pose] == null) return;
    if (f.poseT < 1 && HIPK[f.prevPose] == null) return;
    const h = f._h, fd = Math.abs(f.fd) < 0.14 ? (f.fd < 0 ? -0.14 : 0.14) : f.fd;
    const hk = f.poseT < 1 ? lerp(HIPK[f.prevPose], HIPK[f.pose], f.poseT) : HIPK[f.pose];
    const hx = (f._seat ? f._seat[0] : f._x) + f._headL[0] * h * fd, hy = (f._seat ? f._seat[1] : f._y - hk * h) + f._headL[1] * h;
    if (!isFinite(hx) || !isFinite(hy)) return;
    const r = 0.06 * h, y = hy - 0.055 * h;
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = css(GOLD, 2, 1, 0.25);
    ctx.beginPath();
    ctx.moveTo(hx - r, y + r * 0.5); ctx.lineTo(hx - r, y - r * 0.2); ctx.lineTo(hx - r * 0.55, y + r * 0.1); ctx.lineTo(hx, y - r * 0.55);
    ctx.lineTo(hx + r * 0.55, y + r * 0.1); ctx.lineTo(hx + r, y - r * 0.2); ctx.lineTo(hx + r, y + r * 0.5); ctx.closePath(); ctx.fill();
    add2(ctx, () => glowSp(ctx, SP && SP.gold, hx, y, r * 3, f.alpha * (0.25 + 0.3 * nightK())));
    ctx.globalAlpha = 1;
  }
  // 从哈大底谢臣仆夺来的金盾牌（8:7）
  function drawShields(ctx) {
    if (!S.shields) return;
    for (const m of members('spoil')) {
      if (!m._vis || m.alpha < 0.05) continue;
      const h = m._h, d = m.fd >= 0 ? 1 : -1, x = m._x - 0.14 * h * d, y = m._y - 0.55 * h, r = 0.15 * h;
      ctx.globalAlpha = m.alpha;
      ctx.fillStyle = css(GOLD, 2, 1, 0.2);
      ctx.beginPath(); ctx.ellipse(x, y, r * 0.8, r, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([150, 110, 50], 2); ctx.lineWidth = Math.max(0.5, 0.02 * h);
      ctx.stroke();
      add2(ctx, () => glowSp(ctx, SP && SP.gold, x, y, r * 2.4, m.alpha * 0.35));
    }
    ctx.globalAlpha = 1;
  }
  // 乌利亚手中的信（11:14）
  function drawLetter(ctx) {
    if (!S.letter) return;
    const f = fig('uriah');
    if (!f || !f._vis) return;
    const h = f._h, d = f.fd >= 0 ? 1 : -1, x = f._x + 0.2 * h * d, y = f._y - 0.5 * h;
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = 'rgb(244,236,214)';
    ctx.fillRect(x - 0.05 * h, y - 0.03 * h, 0.1 * h, 0.06 * h);
    add2(ctx, () => glowSp(ctx, SP && SP.white, x, y, 0.12 * h, f.alpha * 0.35));
    ctx.globalAlpha = 1;
  }
  // 自天而降的光（拿单领受神的话 7:4；罪得赦免 12:13；从高天伸手 22:17）
  function drawBeam(ctx) {
    const k = W.lv.dkBeam;
    if (k < 0.01 || !S.beam || !sprites()) return;
    let p = null;
    if (S.beam === 'tent') { const t = tentBox(); p = [t.cx, t.base]; } else if (S.beam === 'altar') { const A = altarBox(); p = [A.cx, A.b]; } else p = figPt(S.beam, 0);
    if (!p) return;
    const ph = PH(), bw = ph * 1.7, bh = Math.min(p[1] + 10, W.h * 0.8);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * (0.32 + 0.3 * nightK() + 0.2 * W.lv.storm);
    ctx.drawImage(SP.beam, p[0] - bw / 2, p[1] - bh, bw, bh);
    glowSp(ctx, SP.gold, p[0], p[1] - ph * 0.5, ph * 1.3, k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 在耶和华面前极力跳舞（6:14）：脚下一片暖光，身边一点金光（收敛，免得把白袍化成一团白）；约柜与他之间一缕淡光
  function drawDance(ctx) {
    if (!S.dance || !sprites()) return;
    const f = fig('david'), p = figPt('david', 0.55), q = arkCarried();
    if (!p || !f) return;
    const ph = PH() * (f.scale || 1), br = 0.8 + 0.2 * Math.sin(W.t * 5.2), gy = fieldY(f.nx, f.v);
    add2(ctx, () => {
      if (q) glowSp(ctx, SP.gold, (p[0] + q.x) / 2, (p[1] + q.y) / 2, ph * 2.2, 0.12);
      // 脚下的暖光（扁的椭圆）
      ctx.save();
      ctx.translate(f.nx * W.w, gy);
      ctx.scale(1, 0.26);
      glowSp(ctx, SP.warm, 0, 0, ph * 1.3, 0.55);
      glowSp(ctx, SP.gold, 0, 0, ph * 0.7, 0.4 * br);
      ctx.restore();
      glowSp(ctx, SP.gold, p[0], p[1], ph * 1.1 * br, 0.16);
    });
  }
  function danceMotes(dt) {
    if (!S.dance || W.replaying || !GS.fx || !GS.fx.add) return;
    moteT += dt * (W.fast || 1);
    if (moteT < 0.09) return;
    moteT = 0;
    const p = figPt('david', 1.05);
    if (!p) return;
    const u = Math.max(0.5, W.unit);
    GS.fx.add({ x: p[0] + rand(-8, 8) * u, y: p[1] + rand(-4, 6) * u, vx: rand(-14, 14) * u, vy: rand(-46, -22) * u, max: rand(1.2, 2.2), size: rand(1, 2.2), c: [255, 226, 160], drag: 0.8, a: 0.9, pass: 'air' });
  }
  let moteT = 0;
  // 手中的灯（22:29）与夜里的火把：周围一团暖光，照明黑暗
  function drawTorches(ctx) {
    if (!sprites()) return;
    for (const id of ['david', 'abishai']) {
      const f = fig(id);
      if (!f || f.prop !== 'torch' || f.alpha < 0.05) continue;
      const p = figPt(id, 0.8), ph = PH(), d = f.facing >= 0 ? 1 : -1, fl = 0.9 + 0.1 * Math.sin(W.t * 11 + id.length);
      const k = f.alpha * (0.35 + 0.65 * nightK());
      add2(ctx, () => {
        glowSp(ctx, SP.warm, p[0] + d * ph * 0.2, p[1], ph * 2.6 * fl, k * 0.5);
        glowSp(ctx, SP.gold, p[0] + d * ph * 0.2, p[1] - ph * 0.1, ph * 0.7, k * 0.6);
      });
    }
  }
  function drawAngelHalo(ctx) {
    const f = fig('angel');
    if (!f || !f._vis || f.alpha < 0.02 || !sprites()) return;
    const h = f._h, x = f._x, y = f._y - 0.55 * h;
    add2(ctx, () => {
      glowSp(ctx, SP.white, x, y, h * 2.6, f.alpha * (0.35 + 0.25 * W.lv.gloom));
      glowSp(ctx, SP.gold, x, y, h * 1.2, f.alpha * 0.4);
      // 向耶路撒冷伸手（24:16）：从手里向下，一道渐宽渐淡的光落向城
      const ck = f.alpha * clamp(W.lv.dkVeil, 0, 1) * (f.pose === 'point' && !f.fly && f.poseT >= 1 ? 1 : 0);
      if (ck > 0.02) {
        const d = f.fd >= 0 ? 1 : -1, hx = x + d * 0.4 * h, hy = f._y - 0.74 * h;
        const P = palaceBox(), tx = lerp(X.gate * W.w, P.cx, 0.55), ty = P.roof - 4 * SU();
        const dx = tx - hx, dy = ty - hy, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, hw = L * 0.2;
        const br = 0.85 + 0.15 * Math.sin(W.t * 2.2);
        const gr = ctx.createLinearGradient(hx, hy, tx, ty);
        gr.addColorStop(0, U.rgba(255, 246, 226, 0.26 * ck * br)); gr.addColorStop(1, U.rgba(255, 246, 226, 0));
        ctx.globalAlpha = 1; ctx.fillStyle = gr;
        ctx.beginPath(); ctx.moveTo(hx + nx * 2, hy + ny * 2); ctx.lineTo(tx + nx * hw, ty + ny * hw); ctx.lineTo(tx - nx * hw, ty - ny * hw); ctx.lineTo(hx - nx * 2, hy - ny * 2); ctx.closePath(); ctx.fill();
        glowSp(ctx, SP.white, hx, hy, h * 0.32, ck * 0.7);
      }
    });
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  一时的光（重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxAdd(b, e) { if (b && b.instant) return null; e.t = 0; FXL.push(e); return e; }
  function drawFX(ctx, pass) {
    if (!FXL.length || !sprites()) return;
    for (const e of FXL) {
      if ((e.pass || 'air') !== pass) continue;
      const k = e.t / e.dur, env = Math.min(1, e.t / 0.5) * Math.min(1, (e.dur - e.t) / 0.8);
      switch (e.type) {
        case 'oil': {           // 膏油：金色的油滴自上落在头上（2:4；5:3）
          const p = figPt(e.id, 1);
          if (!p) break;
          const s = PH();
          add2(ctx, () => {
            glowSp(ctx, SP.gold, p[0], p[1] - s * 0.1, s * (0.9 + k), env * 0.6);
            for (let i = 0; i < 9; i++) {
              const ph = U.fract(e.t * 0.9 + i / 9), y = p[1] - s * (1.4 - ph * 1.35), x = p[0] + Math.sin(i * 2.3) * s * 0.06;
              glowSp(ctx, SP.gold, x, y, s * 0.12, env * (1 - ph) * 0.9);
            }
          });
          break;
        }
        case 'sac': {           // 走了六步的祭（6:13）
          const s = SU(), x = e.xf * W.w, y = fieldY(e.xf, 0.15);
          ctx.fillStyle = css([150, 138, 118], 2, env);
          ctx.beginPath(); ctx.ellipse(x, y - 2 * s, 5 * s, 2.6 * s, 0, 0, TAU); ctx.fill();
          ctx.globalAlpha = 1;
          smoke(ctx, x, y - 6 * s, env, W.h * 0.3, 5 * s, 2, 8);
          flame(ctx, x, y - 3 * s, 10 * s, env, 9);
          break;
        }
        case 'foes': {          // 四围的仇敌：远处一处处的火光熄灭（8:1–14）
          for (let i = 0; i < e.pts.length; i++) {
            const q = e.pts[i], t0 = i * 0.9, a = clamp((e.t - t0) * 2, 0, 1) * clamp(1 - (e.t - t0 - 1.2) * 0.9, 0, 1);
            if (a < 0.01) continue;
            const x = q[0] * W.w, y = gY(q[1], q[0]) - 3;
            add2(ctx, () => { glowSp(ctx, SP.warm, x, y, 26 * W.layerScale(q[1]) * 3, a * 0.8); glowSp(ctx, SP.white, x, y, 8 * W.layerScale(q[1]) * 3, a * 0.5); });
          }
          break;
        }
        case 'battle': {        // 拉巴城下的争战：远远的闪光（11:17）
          const x = X.rabbah * W.w, y = gY(1, X.rabbah) - 6 * LS(1);
          add2(ctx, () => {
            for (let i = 0; i < 5; i++) {
              const fl = Math.pow(Math.max(0, Math.sin(e.t * (7 + i * 2.3) + i * 1.7)), 8);
              glowSp(ctx, SP.warm, x + (i - 2) * 16 * LS(1), y + (i % 2) * 4 * LS(1), 18 * LS(1), env * fl * 0.9);
            }
          });
          break;
        }
        case 'out': {           // 一点光升起，熄灭（赫人乌利亚也死了）
          const x = X.rabbah * W.w + 10 * LS(1), y = gY(1, X.rabbah) - 10 * LS(1) - k * 30 * LS(1);
          add2(ctx, () => glowSp(ctx, SP.white, x, y, 10 * LS(1) * (1 + k), (1 - k) * Math.min(1, e.t * 3) * 0.9));
          break;
        }
        case 'pour': {          // 如同水泼在地上，不能收回（14:14）
          const p = figPt(e.id, 0.55);
          if (!p) break;
          const s = PH(), d = e.dir || 1, gx = p[0] + d * s * 0.55, gy = figPt(e.id, 0)[1] + s * 0.02;
          add2(ctx, () => {
            for (let i = 0; i < 16; i++) {
              const ph = U.fract(e.t * 1.2 + i / 16), a = env * (1 - Math.abs(ph - 0.5) * 1.2) * (e.t < e.dur - 1.2 ? 1 : 0);
              const x = lerp(p[0] + d * s * 0.2, gx, ph), y = lerp(p[1], gy, ph * ph);
              glowSp(ctx, SP.silver, x, y, s * 0.06, a * 0.9);
            }
            for (let i = 0; i < 8; i++) {
              const sx = gx + (rt(i + 60) - 0.5) * s * 0.5, sy = gy + (rt(i + 70) - 0.3) * s * 0.1, ph = U.fract(e.t * 0.6 + rt(i + 80));
              glowSp(ctx, SP.silver, sx, sy + ph * s * 0.05, s * 0.08 * (1 - ph), env * (1 - ph) * 0.7);
            }
          });
          break;
        }
        case 'three': {         // 三样灾：三点光，各有其名（24:13 一样一样地说出）；瘟疫的影子起来时，没有选的两样暗下去（24:14–15）
          const F = houseFrame(), cols = [SP.warm, SP.cold, SP.pale];
          const mob = MOB(), dx = mob ? W.w * 0.26 : F.u * 2.7, cx = mob ? W.w * 0.58 : W.w * 0.8, y = F.cy - F.u * 0.6;
          const fs = Math.round(clamp(M() * 0.021, 13, 18)), dim = e.dim == null ? 3.2 : e.dim;
          for (let i = 0; i < 3; i++) {
            const x = cx + (i - 1) * dx, keep = i === 2;
            const out = keep ? clamp((e.dur - e.t) / 1.5, 0, 1) : clamp(1 - (e.t - dim) * 0.6, 0, 1);
            const a = clamp(e.t * 1.2 - i * 0.4, 0, 1) * out * (keep && e.t > dim ? 1.25 : 1);
            add2(ctx, () => { glowSp(ctx, cols[i], x, y, F.u * 0.9, a * 0.7); glowSp(ctx, SP.white, x, y, F.u * 0.25, a * 0.8); });
            // 名：七年饥荒 · 三个月逃跑 · 三日瘟疫
            if (e.names && e.lab != null) {
              const la = clamp((e.t - e.lab - i * (e.step || 1.8)) / 1.1, 0, 1) * out;
              if (la > 0.01) {
                ctx.save();
                ctx.globalAlpha = la;
                ctx.font = fs + 'px "GS Kai", "KaiTi", "STKaiti", "Songti SC", serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 6;
                ctx.fillStyle = keep && e.t > dim ? 'rgb(236,232,255)' : 'rgb(250,242,224)';
                ctx.fillText(e.names[i], x, y + F.u * 0.75);
                ctx.restore();
              }
            }
          }
          break;
        }
        case 'enter': {         // 约柜请进帐幕（6:17）
          const t = tentBox();
          add2(ctx, () => glowSp(ctx, SP.gold, t.cx, t.base - t.h * 0.5, t.w * (1.2 + k * 2.5), (1 - k) * 0.8));
          break;
        }
        case 'trail': {         // 约柜的荣光从城门上到帐幕（6:17）
          const G = gateBox(), t = tentBox(), ez = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const x0 = G.cx, y0 = G.base - G.ah * 0.9, x1 = t.cx, y1 = t.base - t.h * 0.45;
          const pt = u => [lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(Math.PI * u) * t.h * 1.6];
          const fade = Math.min(1, e.t / 0.3) * Math.min(1, (e.dur - e.t) / 0.35);
          add2(ctx, () => {
            for (let i = 4; i >= 1; i--) {
              const q = pt(Math.max(0, ez - i * 0.06));
              glowSp(ctx, SP.gold, q[0], q[1], t.w * 0.5, (0.35 - i * 0.06) * fade);
            }
            const q = pt(ez);
            glowSp(ctx, SP.gold, q[0], q[1], t.w * 0.9, 0.85 * fade);
            glowSp(ctx, SP.white, q[0], q[1], t.w * 0.3, 0.9 * fade);
          });
          break;
        }
        case 'halt': {          // 「够了！住手吧！」：影子的前锋上立起一道光，影子停住（24:16）
          const x = plagueFront() * W.w, g = gY(2, plagueFront()), ph = PH(), fl = env * (0.75 + 0.25 * Math.sin(e.t * 9));
          add2(ctx, () => {
            ctx.globalAlpha = fl * 0.85;
            const bh = Math.min(g, W.h * 0.42);
            ctx.drawImage(SP.beam, x - ph * 0.55, g - bh, ph * 1.1, bh + ph * 0.3);
            glowSp(ctx, SP.white, x, g - ph * 0.3, ph * (1.2 + k * 1.5), fl * 0.7);
            glowSp(ctx, SP.gold, x, g, ph * 2.2, fl * 0.35);
          });
          break;
        }
        case 'dim': {           // 一时的暗（押沙龙死在橡树下，18:14–15，只以光说）
          ctx.fillStyle = U.rgba(6, 6, 12, 0.35 * env);
          ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
          break;
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：洗革拉的清晨（撒下 1:1）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; S = fresh(); haltAt = null; }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 1, herbs: 0.85, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0.12,
      bare: 0.06, bloom: 0.8, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 };
    for (const k in LVS) lv[k] = 0;
    lv.dkHebron = 1;
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.27, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 26, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    // 大卫与跟随他的人，为扫罗和约拿单哀哭（1:11–12）
    add('david', davidOpts({ x: X.start, v: 0.35, facing: 1, pose: 'weep', from: 'none' }));
    add('abigail', { label: '亚比该', sex: 'f', x: X.start - 0.02, v: 0.1, facing: 1, robe: ROBE.abigail, glow: 0.2, pose: 'weep', from: 'none' });
    add('ahinoam', { label: '亚希暖', sex: 'f', x: X.start - 0.036, v: 0.3, facing: 1, robe: ROBE.ahinoam, glow: 0.2, pose: 'weep', from: 'none' });
    crowd('men', { n: 6, x0: 0.53, x1: 0.566, layer: 2, label: '跟随大卫的人', robe: [112, 96, 80], pose: 'weep', from: 'none', mill: false });
    crowdV('men', 0.18, 0.42);
    avoid([0.5, 0.72], [0.74, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟），故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '扫罗死后，大卫击杀亚玛力人回来，在洗革拉住了两天。', ref: '撒母耳记下 1:1', hold: 5 },
    { text: '大卫作哀歌，吊扫罗和他儿子约拿单……<br>歌中说：以色列啊，你尊荣者在山上被杀！大英雄何竟死亡！', ref: '撒母耳记下 1:17–19', hold: 7.2 },
  ];
  const V1 = [
    { text: '大卫问耶和华说：「我上犹大的一个城去可以吗？」……<br>大卫说：「我上哪一个城去呢？」耶和华说：「上希伯仑去。」', ref: '撒母耳记下 2:1', hold: 7.2 },
    { text: '犹大人来到希伯仑，在那里膏大卫作犹大家的王。', ref: '撒母耳记下 2:4', hold: 4.6 },
    { text: '扫罗家和大卫家争战许久。大卫家日见强盛；扫罗家日见衰弱。', ref: '撒母耳记下 3:1', hold: 5.2 },
    { text: '扫罗的儿子约拿单有一个儿子名叫米非波设，是瘸腿的……<br>他乳母抱着他逃跑；……孩子掉在地上，腿就瘸了。', ref: '撒母耳记下 4:4', hold: 6.7 },
  ];
  const V2 = [
    { text: '以色列众支派来到希伯仑见大卫，说：「我们原是你的骨肉。……<br>耶和华也曾应许你说：『你必牧养我的民以色列，作以色列的君。』」', ref: '撒母耳记下 5:1–2', hold: 7 },
    { text: '于是以色列的长老都来到希伯仑见大卫王，大卫在希伯仑耶和华面前与他们立约，<br>他们就膏大卫作以色列的王。', ref: '撒母耳记下 5:3', hold: 6.7 },
    { text: '大卫和跟随他的人到了耶路撒冷，要攻打住那地方的耶布斯人……<br>然而大卫攻取锡安的保障，就是大卫的城。', ref: '撒母耳记下 5:6–7', hold: 6.5 },
    { text: '泰尔王希兰将香柏木运到大卫那里，又差遣使者和木匠、石匠给大卫建造宫殿。<br>大卫就知道耶和华坚立他作以色列王……', ref: '撒母耳记下 5:11–12', hold: 6.7 },
  ];
  const V3 = [
    { text: '……这约柜就是坐在二基路伯上万军之耶和华留名的约柜。', ref: '撒母耳记下 6:2', hold: 5.4 },
    { text: '耶和华赐福给俄别‧以东和他的全家。……<br>大卫就去，欢欢喜喜地将神的约柜从俄别‧以东家中抬到大卫的城里。', ref: '撒母耳记下 6:11–12', hold: 6.7 },
    { text: '大卫穿着细麻布的以弗得，在耶和华面前极力跳舞。<br>这样，大卫和以色列的全家欢呼吹角，将耶和华的约柜抬上来。', ref: '撒母耳记下 6:14–15', hold: 6.7 },
    { text: '……扫罗的女儿米甲从窗户里观看……<br>众人将耶和华的约柜请进去，安放在所预备的地方，就是在大卫所搭的帐幕里。', ref: '撒母耳记下 6:16–17', hold: 7 },
  ];
  const V4 = [
    { text: '那时，王对先知拿单说：「看哪，我住在香柏木的宫中，神的约柜反在幔子里。」', ref: '撒母耳记下 7:2', hold: 6 },
    { text: '当夜，耶和华的话临到拿单说：……<br>「我从羊圈中将你召来，叫你不再跟从羊群，立你作我民以色列的君。」', ref: '撒母耳记下 7:4–8', hold: 6.7 },
    { text: '「……我必使你的后裔接续你的位；我也必坚定他的国。……<br>你的家和你的国必在我面前永远坚立。你的国位也必坚定，直到永远。」', ref: '撒母耳记下 7:12–16', hold: 7.2 },
    { text: '于是大卫王进去，坐在耶和华面前，说：<br>「主耶和华啊，我是谁？我的家算什么？你竟使我到这地步呢？」', ref: '撒母耳记下 7:18', hold: 6.2 },
  ];
  const V5 = [
    { text: '大卫无论往哪里去，耶和华都使他得胜。<br>大卫作以色列众人的王，又向众民秉公行义。', ref: '撒母耳记下 8:14–15', hold: 6.2 },
    { text: '大卫问说：「扫罗家还有剩下的人没有？我要因约拿单的缘故向他施恩。」', ref: '撒母耳记下 9:1', hold: 6 },
    { text: '大卫说：「你不要惧怕，我必因你父亲约拿单的缘故施恩与你……<br>你也可以常与我同席吃饭。」', ref: '撒母耳记下 9:7', hold: 6.2 },
    { text: '「我们都当刚强，为本国的民和神的城邑作大丈夫。愿耶和华凭他的意旨而行！」', ref: '撒母耳记下 10:12', hold: 6 },
  ];
  const V6 = [
    { text: '过了一年，到列王出战的时候，大卫又差派约押，率领臣仆和以色列众人出战……<br>大卫仍住在耶路撒冷。', ref: '撒母耳记下 11:1', hold: 6 },
    { text: '一日，太阳平西，大卫从床上起来，在王宫的平顶上游行，看见一个妇人沐浴，容貌甚美，<br>大卫就差人打听那妇人是谁。', ref: '撒母耳记下 11:2–3', hold: 6.7 },
    { text: '次日早晨，大卫写信与约押，交乌利亚随手带去。……<br>大卫的仆人中有几个被杀的，赫人乌利亚也死了。', ref: '撒母耳记下 11:14–17', hold: 6.7 },
    { text: '乌利亚的妻听见丈夫乌利亚死了，就为他哀哭。……大卫差人将她接到宫里……<br>但大卫所行的这事，耶和华甚不喜悦。', ref: '撒母耳记下 11:26–27', hold: 7.2 },
  ];
  const V7 = [
    { text: '耶和华差遣拿单去见大卫。……「在一座城里有两个人：一个是富户，一个是穷人。……<br>却取了那穷人的羊羔，预备给客人吃。」', ref: '撒母耳记下 12:1–4', hold: 7.7 },
    { text: '大卫就甚恼怒那人……拿单对大卫说：「你就是那人！」', ref: '撒母耳记下 12:5–7', hold: 5.2 },
    { text: '大卫对拿单说：「我得罪耶和华了！」<br>拿单说：「耶和华已经除掉你的罪，你必不至于死。」', ref: '撒母耳记下 12:13', hold: 6.3 },
    { text: '……她就生了儿子，给他起名叫所罗门。耶和华也喜爱他，<br>就藉先知拿单赐他一个名字，叫耶底底亚，因为耶和华爱他。', ref: '撒母耳记下 12:24–25', hold: 7.2 },
  ];
  const V8 = [
    { text: '押沙龙逃到基述王亚米忽的儿子达买那里去了。大卫天天为他儿子悲哀。', ref: '撒母耳记下 13:37', hold: 5.4 },
    { text: '「我们都是必死的，如同水泼在地上，不能收回。<br>神并不夺取人的性命，乃设法使逃亡的人不致成为赶出、回不来的。」', ref: '撒母耳记下 14:14', hold: 7.2 },
    { text: '……押沙龙来见王，在王面前俯伏于地，王就与押沙龙亲嘴。', ref: '撒母耳记下 14:33', hold: 5 },
    { text: '……这样，押沙龙暗中得了以色列人的心。……<br>有人报告大卫说：「以色列人的心都归向押沙龙了！」', ref: '撒母耳记下 15:6–13', hold: 6.2 },
  ];
  const V9 = [
    { text: '大卫蒙头赤脚上橄榄山，一面上一面哭。跟随他的人也都蒙头哭着上去。', ref: '撒母耳记下 15:30', hold: 5.6 },
    { text: '……名叫示每。他一面走一面咒骂……<br>大卫……说：「……由他咒骂吧！……或者耶和华见我遭难……就施恩与我。」', ref: '撒母耳记下 16:5–12', hold: 7 },
    { text: '……「亚基人户筛的计谋比亚希多弗的计谋更好！」<br>这是因耶和华定意破坏亚希多弗的良谋，为要降祸与押沙龙。', ref: '撒母耳记下 17:14', hold: 7 },
    { text: '于是大卫和跟随他的人都起来，过约旦河。到了天亮，无一人不过约旦河的。', ref: '撒母耳记下 17:22', hold: 6 },
  ];
  const V10 = [
    { text: '押沙龙骑着骡子，从大橡树密枝底下经过，他的头发被树枝绕住，就悬挂起来，<br>所骑的骡子便离他去了。', ref: '撒母耳记下 18:9', hold: 6.2 },
    { text: '王问古示人说：「少年人押沙龙平安不平安？」<br>古示人回答说：「愿我主我王的仇敌……都与那少年人一样。」', ref: '撒母耳记下 18:32', hold: 6.6 },
    { text: '王就心里伤恸，上城门楼去哀哭，一面走一面说：<br>「我儿押沙龙啊！我儿，我儿押沙龙啊！我恨不得替你死，押沙龙啊，我儿！我儿！」', ref: '撒母耳记下 18:33', hold: 7.7 },
    { text: '于是王起来，坐在城门口。众民听说王坐在城门口，就都到王面前。', ref: '撒母耳记下 19:8', hold: 5 },
  ];
  const V11 = [
    { text: '王就回来，到了约旦河……<br>但犹大人从约旦河直到耶路撒冷，都紧紧跟随他们的王。', ref: '撒母耳记下 19:15—20:2', hold: 6 },
    { text: '大卫年间有饥荒，一连三年，大卫就求问耶和华。', ref: '撒母耳记下 21:1', hold: 4.5 },
    { text: '爱雅的女儿利斯巴用麻布在磐石上搭棚……<br>日间不容空中的雀鸟落在尸身上，夜间不让田野的走兽前来糟践。', ref: '撒母耳记下 21:10', hold: 7 },
    { text: '……将扫罗和他儿子约拿单的骸骨葬在便雅悯的洗拉，在扫罗父亲基士的坟墓里……<br>此后神垂听国民所求的。', ref: '撒母耳记下 21:14', hold: 6.7 },
  ];
  const V12 = [
    { text: '当耶和华救大卫脱离一切仇敌和扫罗之手的日子，他向耶和华念这诗，<br>说：耶和华是我的岩石，我的山寨，我的救主……', ref: '撒母耳记下 22:1–2', hold: 6.7 },
    { text: '耶和华从天上打雷；至高者发出声音……<br>他从高天伸手抓住我，把我从大水中拉上来。', ref: '撒母耳记下 22:14–17', hold: 6.7 },
    { text: '耶和华啊，你是我的灯；耶和华必照明我的黑暗。', ref: '撒母耳记下 22:29', hold: 5 },
    { text: '以色列的神、以色列的磐石晓谕我说……<br>他必像日出的晨光，如无云的清晨，雨后的晴光，使地发生嫩草。', ref: '撒母耳记下 23:3–4', hold: 7.2 },
  ];
  const V13 = [
    { text: '大卫就吩咐跟随他的元帅约押说：「你去走遍以色列众支派，从但直到别是巴，数点百姓……」', ref: '撒母耳记下 24:2', hold: 6.3 },
    { text: '大卫数点百姓以后，就心中自责……耶和华的话临到先知迦得……说：<br>「你去告诉大卫，说耶和华如此说：『我有三样灾，随你选择一样，我好降与你。』」', ref: '撒母耳记下 24:10–12', hold: 7 },
    { text: '于是迦得来见大卫，对他说：「你愿意国中有七年的饥荒呢？<br>是在你敌人面前逃跑，被追赶三个月呢？是在你国中有三日的瘟疫呢？……」', ref: '撒母耳记下 24:13', hold: 7 },
    { text: '大卫对迦得说：「我甚为难！我愿落在耶和华的手里……」<br>于是，耶和华降瘟疫与以色列人……从但直到别是巴，民间死了七万人。', ref: '撒母耳记下 24:14–15', hold: 7 },
  ];
  const V14 = [
    { text: '天使向耶路撒冷伸手要灭城的时候，耶和华后悔，就不降这灾了，<br>吩咐灭民的天使说：「够了！住手吧！」', ref: '撒母耳记下 24:16', hold: 6.6 },
    { text: '大卫看见灭民的天使，就祷告耶和华说：「我犯了罪，行了恶；但这群羊做了什么呢？……」', ref: '撒母耳记下 24:17', hold: 6.3 },
    { text: '王对亚劳拿说：「……我不肯用白得之物作燔祭献给耶和华我的神。」<br>大卫就用五十舍客勒银子买了那禾场与牛。', ref: '撒母耳记下 24:24', hold: 6.7 },
    { text: '大卫在那里为耶和华筑了一座坛，献燔祭和平安祭。<br>如此，耶和华垂听国民所求的，瘟疫在以色列人中就止住了。', ref: '撒母耳记下 24:25', hold: 7.2 },
  ];

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  function levites(b, x, o) {
    LEV.forEach((id, i) => add(id, { label: '抬约柜的人', sex: 'm', x: x + LEV_DX[i], v: LEV_V[i], facing: 1, robe: ROBE.levite, hair: 'cloth', accent: [206, 196, 170], glow: 0.25, scale: PS(), from: fromOf(b), pose: (o && o.pose) || 'stand' }));
  }
  function levWalk(x, speed, after) { LEV.forEach((id, i) => walk(id, x + LEV_DX[i], { speed, pose: after || 'stand' })); }
  // 大卫在约柜前跳舞：脚随约柜的位置走在前头，一起一落，转身（姿势的变换在 update 里）
  function danceAttach() {
    attach('david', () => {
      const q = arkCarried();
      const f = fig('david');
      if (!q || !f) return null;
      const t = W.t, ph = PH() * (f.scale || 1);
      // 在约柜前头（最近画面的一个人，背后是青草，不是白墙）
      const x = q.x + 0.06 * W.w + Math.sin(t * 2.1) * 0.015 * W.w;
      const y = fieldY(x / W.w, f.v) - Math.abs(Math.sin(t * 5.2)) * 0.2 * ph;
      return [x, y];
    });
  }
  const DANCE = ['raise', 'point', 'raise', 'embrace', 'raise', 'gaze'];
  let danceT = 0, danceI = 0;
  function danceTick(dt) {
    if (!S.dance || W.replaying) return;
    const f = fig('david');
    if (!f) return;
    danceT += dt * (W.fast || 1);
    if (danceT < Math.PI / 5.2) return;          // 与一起一落同拍
    danceT = 0;
    danceI = (danceI + 1) % DANCE.length;
    pose('david', DANCE[danceI]);
    if (danceI % 2 === 0) face('david', f.facing > 0 ? -1 : 1);   // 每两拍转一次身
  }
  function tentSpot() { const t = tentBox(); return [t.cx - t.w * 0.62, t.base + 1]; }
  function roofSpot() { const P = palaceBox(); return (P.cx - P.w * 0.22) / W.w; }

  // ════════════════════════════════════════════════════════════
  //  话语
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 上希伯仑去（2—4）──────────────────────────────────
    {
      kind: 'cmd', utter: '上希伯仑去', cmd: 'cd 希伯仑  # 我上哪一个城去呢？', ref: '2:1', tint: [255, 226, 176],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.33, 6, b.instant);
            pose('david', 'stand'); pose('abigail', 'stand'); pose('ahinoam', 'stand'); crowdPose('men', 'stand');
            face('david', 1);
          }],
          // 众人都站在希伯仑的东边（城邑本身露出来）；大卫前后留出空处
          [1.5, b => {
            walk('david', X.hebron, { speed: 0.02 });
            walk('abigail', X.hebron - 0.032, { speed: 0.021 });
            walk('ahinoam', X.hebron - 0.047, { speed: 0.021 });
            crowdWalk('men', 0.698, 0.726, { speed: 0.034 });
            crowd('judah', { n: 6, x0: 0.726, x1: 0.762, layer: 2, label: '犹大人', robe: [130, 112, 88], from: fromOf(b), mill: false });
            crowdV('judah', 0.3, 0.5);
            crowdFace('judah', -1);
            add('elderJ', { label: '犹大的长老', sex: 'm', age: 'elder', x: 0.705, v: 0.34, facing: -1, robe: ROBE.elder, glow: 0.2, from: fromOf(b) });
            avoid([0.55, 0.75]);
            sfx(b, 'harp');
          }],
          // 膏大卫作犹大家的王（2:4）
          [L[1], () => { walk('elderJ', X.hebron + 0.019, { speed: 0.02, pose: 'raise' }); }],
          [L[1] + 1.8, b => {
            pose('david', 'kneel'); face('david', 1);
            fxAdd(b, { type: 'oil', id: 'david', dur: 3.2 });
            sfx(b, 'harp', { soft: true });
          }],
          [L[1] + 4.2, b => {
            pose('david', 'stand'); pose('elderJ', 'stand'); glow('david', 0.7);
            S.crown = true; S.dRobe = 'king'; dress();
            crowdPose('judah', 'raise'); crowdPose('men', 'raise');
            if (!b.instant) fx().ring(W.w * X.hebron, figPt('david', 0.6)[1], [255, 230, 170], PH() * 2.4, 2, 1.2);
            sfx(b, 'crowd', { soft: true });
          }],
          // 大卫家日见强盛（3:1）：日子过去，投奔他的人越来越多
          [L[2], b => {
            crowdPose('judah', 'stand'); crowdPose('men', 'stand');
            walk('elderJ', 0.708, { speed: 0.02 });
            W.goTo(0.44, 9, b.instant);
            crowd('house', { n: 7, x0: 0.9, x1: 1.02, layer: 2, label: '大卫家的人', from: fromOf(b), mill: false });
            crowdV('house', 0.3, 0.5);
            crowdWalk('house', 0.752, 0.79, { speed: 0.035 });
          }],
          // 约拿单的乳母抱着五岁的米非波设逃跑（4:4）
          [L[3], b => {
            add('nurse', { label: '米非波设的乳母', sex: 'f', x: 0.99, v: 0.55, facing: -1, robe: ROBE.nurse, glow: 0.15, carry: 'baby', from: fromOf(b) });
            run('nurse', 0.8, { speed: 0.075, pose: 'kneel' });
          }],
          [L[3] + 4.2, () => { pose('nurse', 'stand'); walk('nurse', 0.73, { speed: 0.018 }); }],
          [L[3] + 6.8, () => rm('nurse')],
        ]);
      },
    },

    // ── 2 · 以色列的王；锡安的保障（5）───────────────────────
    {
      kind: 'promise', utter: '你必牧养我的民以色列，作以色列的君', cmd: 'sudo crown 大卫 --over 以色列  # 我们原是你的骨肉', ref: '5:2', tint: [255, 222, 160],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            rm('nurse', true);
            crowd('elders', { n: 8, x0: 0.9, x1: 1.02, layer: 2, label: '以色列的长老', robe: ROBE.elder, from: fromOf(b), mill: false });
            crowdV('elders', 0.28, 0.46);
            crowdWalk('elders', 0.692, 0.76, { speed: 0.03 });
            walk('david', X.hebron + 0.004, { speed: 0.02 }); face('david', 1);
            avoid([0.55, 0.82]);
          }],
          // 耶和华也曾应许你：你必牧养我的民以色列（5:2）
          [4.6, () => { face('david', 1); glow('david', 0.7); }],
          // 膏大卫作以色列的王（5:3）
          [L[1] + 0.4, b => {
            pose('david', 'kneel');
            crowdPose('elders', 'raise');
            fxAdd(b, { type: 'oil', id: 'david', dur: 3.4 });
            sfx(b, 'harp');
          }],
          [L[1] + 4.4, b => {
            pose('david', 'stand'); glow('david', 0.8);
            crowdPose('elders', 'bow'); crowdPose('judah', 'bow'); crowdPose('house', 'bow');
            if (!b.instant) { fx().ring(W.w * X.hebron, figPt('david', 0.6)[1], [255, 226, 160], PH() * 3.6, 2.4, 1.4); W.flash = Math.max(W.flash || 0, 0.12); }
            sfx(b, 'crowd');
          }],
          // 上到耶路撒冷，攻取锡安的保障（5:6–7）
          [L[2], b => {
            W.set('dkHebron', 0, b.instant);
            uncrowd('judah'); uncrowd('house'); rm('elderJ'); rm('abigail'); rm('ahinoam');
            walk('david', 0.75, { speed: 0.03 });
            crowdWalk('men', 0.7, 0.745, { speed: 0.032 });
            crowdWalk('elders', 0.63, 0.7, { speed: 0.03 });
          }],
          [L[2] + 4.2, b => {
            W.set('dkZion', 1, b.instant);
            if (!b.instant) { W.shake = Math.max(W.shake || 0, 3); W.flash = Math.max(W.flash || 0, 0.18); fx().ring(X.gate * W.w, gY(2, X.gate) - 12 * SU(), [255, 226, 160], M() * 0.2, 2, 1.4); }
            sfx(b, 'gate'); sfx(b, 'crowd');
            crowdPose('men', 'raise');
          }],
          // 希兰的香柏木，给大卫建造宫殿（5:11）
          [L[3], b => {
            W.set('dkPalace', 1, b.instant);
            walk('david', X.atGate, { speed: 0.02 }); face('david', -1);
            crowdWalk('men', X.gate - 0.004, X.gate + 0.006, { speed: 0.03 });
            sfx(b, 'build');
          }],
          [L[3] + 2.5, b => { sfx(b, 'build', { soft: true }); }],
          [L[3] + 4.5, () => { uncrowd('men'); crowdPose('elders', 'stand'); face('david', -1); }],
        ]);
      },
    },

    // ── 3 · 约柜上到大卫的城（6）── 本卷的签名 ────────────────
    {
      kind: 'name', utter: '坐在二基路伯上万军之耶和华', cmd: 'sudo mv 约柜 ./大卫城/帐幕 --with 角,欢呼  # 极力跳舞', ref: '6:2', tint: [255, 230, 170],
      verse: V3,
      apply(c) {
        const L = starts(V3), P = PS();
        T(c, [
          [0, b => {
            uncrowd('elders');
            W.goTo(0.62, 8, b.instant);                 // 午后渐斜的暖光
            W.set('dkObed', 1, b.instant); W.set('dkBless', 1, b.instant);
            S.ark = 'obed';
            W.set('dkName', 1, b.instant);
            rm('david');                                // 大卫进城去（再出来时穿着细麻布的以弗得）
            add('obed', { label: '俄别‧以东', sex: 'm', x: X.court + 0.02, v: 0.16, facing: -1, robe: ROBE.obed, glow: 0.3, from: fromOf(b) });
            add('obedW', { label: '俄别‧以东的全家', sex: 'f', x: X.obed - 0.018, v: 0.2, facing: 1, robe: [168, 130, 110], glow: 0.2, from: fromOf(b) });
            add('obedC', { label: '俄别‧以东的全家', sex: 'm', age: 'child', x: X.obed - 0.004, v: 0.32, facing: 1, robe: [180, 150, 110], glow: 0.2, from: fromOf(b) });
            herd('obedFlock', { kind: 'sheep', n: 3, x0: 0.646, x1: 0.672, label: '羊', v: 0.1, from: fromOf(b) });
            avoid([0.55, 0.86]);
            sfx(b, 'angel');
          }],
          [3.5, b => W.set('dkName', 0.5, b.instant)],     // 约柜上一道柔和的光柱，一路随着约柜
          // 大卫欢欢喜喜地去，带着抬约柜的人、以色列的全家；吹角的人在城门两旁等候（6:12）
          [L[1], b => {
            S.crown = false; S.dRobe = 'linen';
            add('david', davidOpts({ x: X.atGate, v: 0.5, facing: -1, pose: 'stand', from: fromOf(b) }));
            walk('david', X.court + 0.072, { speed: 0.028 });
            levites(b, 0.75);
            levWalk(X.court, 0.028);
            HORN.forEach((id, i) => add(id, { label: '吹角的人', sex: 'm', x: X.gate + 0.02 + i * 0.014, v: 0.05 + i * 0.05, facing: -1, robe: [150, 128, 96], glow: 0.15, scale: P, from: fromOf(b) }));
            crowd('isr', { n: 9, x0: 0.7, x1: 0.76, layer: 2, label: '以色列的全家', v: 0.35, from: fromOf(b), mill: false });
            crowdV('isr', 0.3, 0.42);
            crowdWalk('isr', 0.545, 0.605, { speed: 0.03 });
            sfx(b, 'crowd', { soft: true });
          }],
          [L[1] + 4.6, b => {
            S.ark = 'poles';
            LEV.forEach(id => face(id, 1));
            pose('obed', 'bow'); pose('obedW', 'bow');
            uncrowd('obedFlock');                     // 羊群散去，让出约柜与祭坛
            if (!b.instant) fx().sparkle(X.court * W.w, fieldY(X.court, 0.03) - 12 * SU(), 20, [255, 226, 160], 14 * SU(), 'air');
          }],
          // 走了六步，献牛与肥羊为祭（6:13）
          [L[1] + 5.4, () => levWalk(X.court + 0.012, 0.012)],
          [L[1] + 6.6, b => { fxAdd(b, { type: 'sac', xf: X.sac, dur: 7.5 }); face('david', -1); pose('david', 'bow'); sfx(b, 'fire'); }],
          // 大卫在耶和华面前极力跳舞；欢呼吹角（6:14–15）：他在约柜前头，以色列的全家跟在后面
          [L[2], b => {
            S.dance = true; S.horns = true;
            W.set('dkName', 0.5, b.instant);
            danceAttach();
            pose('david', 'raise');
            levWalk(X.gate - 0.002, 0.0125);
            HORN.forEach(id => face(id, -1));
            crowdWalk('isr', X.gate - 0.084, X.gate - 0.034, { speed: 0.0125, pose: 'raise' });
            sfx(b, 'crowd'); sfx(b, 'harp');
          }],
          [L[2] + 4, b => sfx(b, 'crowd')],
          [L[2] + 5, b => W.set('dkTent', 1, b.instant)],
          // 米甲从窗户里观看（6:16）
          [L[3], b => { W.set('dkMichal', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [L[3] + 3.2, b => sfx(b, 'crowd')],
          // 抬约柜的人进了城门；约柜的荣光上到帐幕，安放在里面（6:17）
          [L[3] + 3.9, () => LEV.forEach((id, i) => walk(id, X.gate + 0.006 + LEV_DX[i] * 0.35, { speed: 0.012 }))],
          [L[3] + 4.6, b => { LEV.forEach(id => rm(id)); fxAdd(b, { type: 'trail', dur: 1.8 }); sfx(b, 'harp', { soft: true }); }],
          [L[3] + 6.3, b => {
            S.ark = 'tent';
            W.set('dkName', 0, b.instant);
            fxAdd(b, { type: 'enter', dur: 3 });
            if (!b.instant) fx().ring(tentBox().cx, tentBox().base - 10 * SU(), [255, 230, 170], M() * 0.18, 2.2, 1.4);
            sfx(b, 'angel');
          }],
          [L[3] + 6.7, b => {
            S.dance = false; S.horns = false;
            attach('david', null);
            walk('david', X.gate + 0.045, { speed: 0.02, pose: 'bow' });
            face('david', 1);
            HORN.forEach(id => pose(id, 'bow'));
            crowdPose('isr', 'bow');
            W.set('dkMichal', 0, b.instant);
          }],
        ]);
      },
    },

    // ── 4 · 你的家和你的国必永远坚立（7）── 夜空 ───────────────
    {
      kind: 'promise', utter: '你的家和你的国必在我面前永远坚立', cmd: 'const 大卫家 = Object.freeze(国)  # 直到永远', ref: '7:16', tint: [236, 232, 255],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            uncrowd('isr'); HORN.forEach(id => rm(id));
            rm('obed'); rm('obedW'); rm('obedC'); uncrowd('obedFlock');
            W.set('dkObed', 0, b.instant); W.set('dkBless', 0, b.instant);
            W.goTo(0.79, 7, b.instant);
            S.dRobe = 'king'; S.crown = true; dress();
            pose('david', 'stand');
            walk('david', 0.748, { speed: 0.02 });
            add('nathan', { label: '拿单', sex: 'm', age: 'elder', x: 0.672, v: 0.42, facing: 1, robe: ROBE.nathan, glow: 0.4, from: fromOf(b), prop: 'staff' });
            walk('nathan', 0.722, { speed: 0.02 });
            avoid([0.62, 0.8]);
          }],
          [2.8, () => { face('david', -1); face('nathan', 1); pose('david', 'point'); face('david', 1); }],
          [4.6, () => { pose('david', 'stand'); face('david', -1); }],
          // 当夜，耶和华的话临到拿单（7:4）
          [L[1], b => {
            W.goTo(0.92, 5, b.instant);
            walk('nathan', 0.672, { speed: 0.018, pose: 'kneel' });
          }],
          [L[1] + 3.2, b => { S.beam = 'nathan'; W.set('dkBeam', 1, b.instant); sfx(b, 'angel'); }],
          // 众星聚成一座家（7:11–13）
          [L[2], b => { W.set('dkHouse', 1, b.instant); sfx(b, 'stars'); }],
          [L[2] + 1.2, b => { W.set('dkBeam', 0, b.instant); pose('nathan', 'stand'); walk('nathan', 0.73, { speed: 0.02 }); }],
          [L[2] + 4.4, b => { W.set('dkLine', 1, b.instant); sfx(b, 'harp'); }],
          [L[2] + 5.2, () => { face('david', 1); pose('david', 'gaze'); }],
          // 大卫王进去，坐在耶和华面前（7:18）
          [L[3] - 2, () => { pose('david', 'stand'); walk('david', X.gate - 0.002, { speed: 0.02 }); }],
          [L[3] - 0.2, () => rm('david')],
          [L[3] + 3.8, b => {
            add('david', davidOpts({ x: 0.93, v: 0, facing: 1, pose: 'sit', from: fromOf(b) }));
            onSpot('david', 'tent', tentSpot);
            S.beam = 'tent'; W.set('dkBeam', 0.8, b.instant);
            pose('nathan', 'bow');
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 5 · 耶和华都使他得胜；米非波设同席（8—10）───────────────
    {
      kind: 'act', utter: '大卫无论往哪里去，耶和华都使他得胜', cmd: 'for (敌 of 四围) 敌.归服()  # 秉公行义', ref: '8:6', tint: [255, 222, 160],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.36, 8, b.instant);
            W.set('dkHouse', 0, b.instant); W.set('dkLine', 0, b.instant); W.set('dkBeam', 0, b.instant);
            S.beam = null;
            rm('nathan'); rm('david');
            fxAdd(b, { type: 'foes', dur: 6.5, pts: [[0.22, 0], [0.4, 0], [0.62, 1], [0.95, 0], [0.8, 1]] });
            sfx(b, 'thunder', { soft: true, far: true });
            avoid([0.6, 0.82]);
          }],
          [2.5, b => {
            // 金盾牌带到耶路撒冷（8:7）
            crowd('spoil', { n: 6, x0: 0.52, x1: 0.58, layer: 2, label: '大卫的仆人', robe: [116, 96, 76], v: 0.2, from: fromOf(b), mill: false });
            crowdWalk('spoil', X.gate - 0.02, X.gate + 0.004, { speed: 0.042 });
            S.shields = true;
          }],
          [3.8, b => {
            offPath('david');
            add('david', davidOpts({ x: 0.768, v: 0.3, facing: -1, pose: 'stand', from: fromOf(b) }));
          }],
          [L[1] - 0.5, () => { uncrowd('spoil'); }],
          [L[1] + 0.5, () => { S.shields = false; }],
          // 米非波设来见大卫，伏地叩拜（9:6）
          [L[1], b => {
            add('mephi', { label: '米非波设', sex: 'm', x: 0.652, v: 0.3, facing: 1, robe: ROBE.mephi, glow: 0.3, prop: 'staff', from: fromOf(b) });
            walk('mephi', 0.736, { speed: 0.013 });
            add('ziba', { label: '洗巴', sex: 'm', x: 0.636, v: 0.12, facing: 1, robe: ROBE.ziba, glow: 0.12, from: fromOf(b) });
            walk('ziba', 0.712, { speed: 0.013 });
          }],
          [L[2] - 0.8, () => { pose('mephi', 'fall'); pose('ziba', 'bow'); }],
          // 常与我同席吃饭（9:7）
          [L[2] + 1.6, b => { pose('mephi', 'stand'); W.set('dkTable', 1, b.instant); }],
          [L[2] + 2.6, () => {
            walk('david', X.table + 0.03, { speed: 0.02, pose: 'seat' }); walk('mephi', X.table - 0.028, { speed: 0.012, pose: 'seat' });
            walk('ziba', 0.7, { speed: 0.015 });
          }],
          [L[2] + 5.8, () => { face('david', -1); face('mephi', 1); }],
          // 约押统带勇猛的全军出去（10:7，12）；远处的拉巴
          [L[3], b => {
            add('joab', { label: '约押', sex: 'm', x: 0.82, v: 0.2, facing: -1, robe: ROBE.joab, glow: 0.2, prop: 'staff', from: fromOf(b) });
            crowd('army', { n: 8, x0: 0.8, x1: 0.9, layer: 2, label: '勇猛的全军', robe: [104, 90, 74], v: 0.2, from: fromOf(b), mill: false });
            crowdV('army', 0.16, 0.34);
            walk('joab', 0.5, { speed: 0.036 });
            crowdWalk('army', 0.5, 0.58, { speed: 0.036 });
            sfx(b, 'crowd', { soft: true });
          }],
          [L[3] + 2.4, b => W.set('dkRabbah', 1, b.instant)],
          [L[3] + 5.6, () => { rm('joab'); uncrowd('army'); }],
        ]);
      },
    },

    // ── 6 · 太阳平西（11）─────────────────────────────────────
    {
      kind: 'judge', utter: '但大卫所行的这事，耶和华甚不喜悦', cmd: 'git blame 大卫  # 赫人乌利亚也死了', ref: '11:27', tint: [214, 206, 226],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            rm('joab', true); uncrowd('army', true);
            W.set('dkTable', 0, b.instant);
            rm('mephi'); rm('ziba');
            W.goTo(0.715, 7, b.instant);
            rm('david');
            avoid([0.62, 0.84]);
          }],
          // 在王宫的平顶上游行（11:2）
          [3.6, b => {
            add('david', davidOpts({ x: roofSpot(), v: 0, facing: 1, pose: 'stand', from: fromOf(b) }));
            onPath('david', 'roof');
            walk('david', roofSpot() + 0.012, { speed: 0.004 });
          }],
          [L[1], b => { W.set('dkCourt', 1, b.instant); }],
          [L[1] + 2, () => { face('david', -1); pose('david', 'gaze'); }],
          [L[1] + 5.2, () => { pose('david', 'stand'); }],
          // 夜过去了（慢慢地），次日早晨（11:14）
          [L[1] + 5.6, b => W.goTo(0.3, 9, b.instant)],
          // 乌利亚带着信出城
          [L[2], b => {
            W.set('dkCourt', 0, b.instant);
            add('uriah', { label: '赫人乌利亚', sex: 'm', x: X.gate, v: 0.16, facing: -1, robe: ROBE.uriah, glow: 0.25, prop: 'staff', from: fromOf(b) });
            S.letter = true;
            walk('uriah', 0.52, { speed: 0.04 });
          }],
          [L[2] + 3, b => fxAdd(b, { type: 'battle', dur: 4.5 })],
          [L[2] + 5.8, b => { fxAdd(b, { type: 'out', dur: 2.6 }); rm('uriah'); S.letter = false; sfx(b, 'thunder', { soft: true, far: true }); }],
          // 乌利亚的妻为他哀哭；接到宫里（11:26–27）
          [L[3], b => {
            W.goTo(0.66, 9, b.instant);
            add('bathsheba', { label: '拔示巴', sex: 'f', x: X.uriah - 0.012, v: 0.12, facing: -1, robe: ROBE.bath, glow: 0.3, pose: 'weep', from: fromOf(b) });
          }],
          [L[3] + 3.2, () => { pose('bathsheba', 'stand'); walk('bathsheba', X.gate + 0.004, { speed: 0.012 }); }],
          [L[3] + 5.2, b => { W.set('gloom', 0.32, b.instant); sfx(b, 'thunder', { soft: true, far: true }); }],
          [L[3] + 6.4, () => { rm('bathsheba'); pose('david', 'stand'); }],
        ]);
      },
    },

    // ── 7 · 你就是那人（12）───────────────────────────────────
    {
      kind: 'judge', utter: '你就是那人', cmd: 'grep -n 羊羔 大卫.心  # 我得罪耶和华了', ref: '12:7', tint: [226, 220, 240], hold: 2.6,
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            rm('bathsheba', true);
            rm('david');
            add('nathan', { label: '拿单', sex: 'm', age: 'elder', x: 0.64, v: 0.14, facing: 1, robe: ROBE.nathan, glow: 0.4, prop: 'staff', from: fromOf(b) });
            walk('nathan', 0.735, { speed: 0.022 });
            // 比喻：穷人怀中的小母羊羔，富户的牛群羊群（12:1–4）
            add('poor', { label: '穷人', sex: 'm', x: 0.672, v: 0.5, facing: -1, robe: ROBE.poor, glow: 0.5, carry: 'lamb', from: fromOf(b) });
            add('rich', { label: '富户', sex: 'm', x: 0.585, v: 0.38, facing: 1, robe: ROBE.rich, glow: 0.3, from: fromOf(b) });
            herd('richFlock', { kind: 'sheep', n: 6, x0: 0.55, x1: 0.61, label: '富户的羊群', v: 0.45, from: fromOf(b) });
            avoid([0.54, 0.82]);
          }],
          [3.2, b => {
            offPath('david');
            add('david', davidOpts({ x: 0.782, v: 0.16, facing: -1, pose: 'stand', from: fromOf(b) }));
          }],
          [4.5, () => walk('rich', 0.655, { speed: 0.03 })],
          [7.2, b => { carry('poor', null); carry('rich', 'lamb'); pose('poor', 'weep'); sfx(b, 'bleat', { soft: true }); }],
          [8.2, () => walk('rich', 0.59, { speed: 0.03 })],
          // 「你就是那人！」（12:7）
          [L[1], () => { pose('david', 'point'); face('david', -1); }],
          [L[1] + 2.4, b => {
            face('nathan', 1); pose('nathan', 'point');
            rm('poor'); rm('rich'); uncrowd('richFlock');
            if (!b.instant) { fx().ring(figPt('david', 0.5)[0], figPt('david', 0.5)[1], [236, 232, 255], PH() * 3, 1.6, 1.4); W.flash = Math.max(W.flash || 0, 0.1); }
            sfx(b, 'seal');
          }],
          [L[1] + 3.6, () => pose('david', 'kneel')],
          // 「我得罪耶和华了！」「耶和华已经除掉你的罪」（12:13）
          [L[2], () => { pose('david', 'fall'); pose('nathan', 'stand'); }],
          [L[2] + 3.4, b => {
            W.set('gloom', 0, b.instant);
            S.beam = 'david'; W.set('dkBeam', 1, b.instant);
            sfx(b, 'harp');
          }],
          [L[2] + 5, () => pose('david', 'pray')],
          // 所罗门；耶底底亚——因为耶和华爱他（12:24–25）
          [L[3], b => {
            W.set('dkBeam', 0, b.instant);
            pose('david', 'stand');
            add('bathsheba', { label: '拔示巴', sex: 'f', x: 0.81, v: 0.22, facing: -1, robe: ROBE.bath, glow: 0.35, carry: 'baby', from: fromOf(b) });
            walk('bathsheba', 0.796, { speed: 0.01 });
          }],
          [L[3] + 2.6, b => {
            pose('nathan', 'raise');
            nameOver(b, 'bathsheba', '耶底底亚', [255, 232, 170], { size: 0.048, hold: 3 });
            sfx(b, 'harp');
          }],
          [L[3] + 6, () => pose('nathan', 'stand')],
        ]);
      },
    },

    // ── 8 · 水泼在地上；押沙龙归来（13—15:13）──────────────────
    {
      kind: 'act', utter: '神并不夺取人的性命', cmd: 'return 押沙龙  # 不致成为赶出、回不来的', ref: '14:14', tint: [236, 226, 206],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            rm('bathsheba'); rm('nathan');
            W.set('dkRabbah', 0, b.instant);
            W.goTo(0.74, 7, b.instant);
            pose('david', 'sit', { weep: true }); face('david', -1);
            avoid([0.55, 0.82]);
          }],
          // 提哥亚的妇人（14:4–14）
          [L[1] - 1, b => {
            add('tekoa', { label: '提哥亚的妇人', sex: 'f', x: 0.64, v: 0.24, facing: 1, robe: ROBE.tekoa, glow: 0.2, prop: 'jar', from: fromOf(b) });
            walk('tekoa', 0.742, { speed: 0.028 });
          }],
          [L[1] + 3, () => { pose('tekoa', 'fall'); pose('david', 'sit', { weep: false }); }],
          [L[1] + 4.4, b => { pose('tekoa', 'stand'); fxAdd(b, { type: 'pour', id: 'tekoa', dir: -1, dur: 3.6 }); sfx(b, 'splash', { soft: true }); }],
          // 押沙龙回来，王与他亲嘴（14:23–33）
          [L[2] - 1.6, b => {
            rm('tekoa');
            add('joab', { label: '约押', sex: 'm', x: 0.585, v: 0.08, facing: 1, robe: ROBE.joab, glow: 0.2, prop: 'staff', from: fromOf(b) });
            add('absalom', { label: '押沙龙', sex: 'm', x: 0.56, v: 0.2, facing: 1, robe: ROBE.absalom, glow: 0.35, hair: 'long', from: fromOf(b) });
            walk('joab', 0.715, { speed: 0.04 });
            walk('absalom', 0.748, { speed: 0.04 });
            pose('david', 'stand');
          }],
          [L[2] + 2.4, () => pose('absalom', 'fall')],
          [L[2] + 4, () => { pose('absalom', 'stand'); embrace('david', 'absalom', { at: 0.762 }); }],
          // 押沙龙暗中得了以色列人的心（15:1–13）
          [L[3], b => {
            pose('david', 'stand'); pose('absalom', 'stand');
            walk('absalom', 0.705, { speed: 0.025 });
            crowd('hearts', { n: 8, x0: 0.58, x1: 0.66, layer: 2, label: '以色列人', v: 0.3, from: fromOf(b), mill: false });
            crowdWalk('hearts', 0.64, 0.69, { speed: 0.02 });
            rm('joab');
          }],
          [L[3] + 2.8, b => {
            face('absalom', -1); pose('absalom', 'raise');
            if (!b.instant) {
              const tg = figPt('absalom', 0.6);
              for (const m of members('hearts')) if (m._vis) fx().sow(m._x, m._y - m._h * 0.6, [[tg[0], tg[1], 1.6], [tg[0] + 3, tg[1] - 4, 1.2]], [255, 196, 150], { pass: 'air', dur: 2, stagger: 0.8 });
            }
          }],
          [L[3] + 4.6, () => { walk('absalom', 0.54, { speed: 0.03 }); crowdWalk('hearts', 0.52, 0.6, { speed: 0.028 }); }],
          [L[3] + 6.4, () => { rm('absalom'); uncrowd('hearts'); face('david', -1); }],
        ]);
      },
    },

    // ── 9 · 橄榄山；示每；亚希多弗的计谋；过约旦河（15—17）──────
    {
      kind: 'act', utter: '耶和华定意破坏亚希多弗的良谋', cmd: 'kill -9 亚希多弗.计谋  # 户筛的计谋更好', ref: '17:14', tint: [255, 226, 176],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            rm('absalom', true); uncrowd('hearts', true); rm('joab', true);
            W.goTo(0.31, 8, b.instant);
            // 大卫蒙头赤脚上橄榄山，一面上一面哭（15:30）
            walk('david', 0.648, { speed: 0.016 });
            pose('david', 'weep', { weep: true });
            add('abishai', { label: '亚比筛', sex: 'm', x: X.gate, v: 0.16, facing: -1, robe: ROBE.abishai, glow: 0.2, prop: 'staff', from: fromOf(b) });
            walk('abishai', 0.664, { speed: 0.017 });
            crowd('flee', { n: 8, x0: 0.77, x1: 0.8, layer: 2, label: '跟随大卫的人', robe: [110, 98, 84], v: 0.25, from: fromOf(b), mill: false });
            crowdWalk('flee', 0.66, 0.74, { speed: 0.017, pose: 'weep' });
            avoid([0.52, 0.82]);
            sfx(b, 'weep', { soft: true });
          }],
          // 示每在对面的磐石上咒骂，拿土扬他（16:5–13）
          [L[1], b => {
            add('shimei', { label: '示每', sex: 'm', x: X.rock - 0.005, v: 0, facing: 1, robe: ROBE.shimei, glow: 0.12, pose: 'raise', from: fromOf(b) });
            onPath('shimei', 'rock');
          }],
          [L[1] + 1.4, b => { if (!b.instant) { const p = figPt('shimei', 0.9); fx().dust(p[0] + 20 * SU(), p[1], 14, [200, 180, 150], 10 * SU(), 'air'); } }],
          [L[1] + 2.4, () => { pose('abishai', 'point'); face('abishai', -1); }],
          [L[1] + 3.6, b => { pose('david', 'raise', { weep: false }); if (!b.instant) { const p = figPt('shimei', 0.9); fx().dust(p[0] + 22 * SU(), p[1] + 6, 12, [200, 180, 150], 10 * SU(), 'air'); } }],
          [L[1] + 5.6, () => { pose('david', 'weep', { weep: true }); pose('abishai', 'stand'); pose('shimei', 'point'); }],
          // 耶路撒冷的城门口：押沙龙与亚希多弗、户筛商议（17:1–14）
          [L[2] - 1.4, b => {
            add('ahithophel', { label: '亚希多弗', sex: 'm', age: 'elder', x: X.gate - 0.012, v: 0.3, facing: 1, robe: ROBE.ahith, glow: 0.15, prop: 'staff', from: fromOf(b) });
            add('absalom', { label: '押沙龙', sex: 'm', x: X.gate + 0.016, v: 0.22, facing: -1, robe: ROBE.absalom, glow: 0.3, hair: 'long', from: fromOf(b) });
            add('hushai', { label: '户筛', sex: 'm', age: 'elder', x: X.gate + 0.046, v: 0.32, facing: -1, robe: ROBE.hushai, glow: 0.3, prop: 'staff', from: fromOf(b) });
          }],
          // 亚希多弗的计谋：他头上一团打了结的暗绳
          [L[2], b => { W.set('dkCounsel', 1, b.instant); rm('shimei'); pose('ahithophel', 'point'); sfx(b, 'wind', { soft: true }); }],
          [L[2] + 2.4, () => { pose('ahithophel', 'stand'); pose('hushai', 'point'); face('absalom', 1); }],
          // 「户筛的计谋比亚希多弗的计谋更好！」——耶和华定意破坏：绳结断开，化作金线散尽
          [L[2] + 3.6, b => { W.set('dkUnravel', 1, b.instant); glow('hushai', 0.55); sfx(b, 'harp'); }],
          [L[2] + 5, () => { pose('hushai', 'stand'); pose('absalom', 'raise'); pose('ahithophel', 'bow'); }],
          // 亚希多弗见不依从他的计谋，就……归回本城（17:23）
          [L[2] + 6.4, () => { pose('ahithophel', 'stand'); walk('ahithophel', 1.06, { speed: 0.03 }); }],
          // 夜里过约旦河；到了天亮（17:22）
          // 夜里（乌云遮了日头，遍地一层暗，亚比筛手中的火把）；解开的计谋已经散尽
          [L[3] - 0.8, b => { W.set('gloom', 0.55, b.instant); W.set('storm', 0.5, b.instant); }],
          [L[3], b => {
            offPath('shimei');
            W.set('dkCounsel', 0, true); W.set('dkUnravel', 0, true);
            rm('absalom'); rm('hushai'); rm('ahithophel');
            walk('david', 0.6, { speed: 0.02 }); pose('david', 'stand', { weep: false });
            walk('abishai', 0.618, { speed: 0.02 });
            hold('abishai', 'torch');
            crowdWalk('flee', 0.555, 0.63, { speed: 0.022 });
          }],
          // 到了天亮
          [L[3] + 4.2, b => {
            W.set('gloom', 0, b.instant); W.set('storm', 0, b.instant);
            hold('abishai', null);
          }],
        ]);
      },
    },

    // ── 10 · 我儿押沙龙啊（18—19:8）───────────────────────────
    {
      kind: 'judge', utter: '刀剑必永不离开你的家', cmd: 'while (家) 刀剑.留下()  # 我儿押沙龙啊', ref: '12:10', tint: [214, 214, 236],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.46, 5, b.instant);
            W.set('dkMaha', 1, b.instant); W.set('dkForest', 1, b.instant);
            walk('david', X.maha + 0.004, { speed: 0.02, pose: 'sit' });
            walk('abishai', 0.625, { speed: 0.02 });
            crowdWalk('flee', 0.52, 0.575, { speed: 0.02 });
            // 押沙龙骑着骡子从大橡树密枝底下经过（18:9）
            animal('mule', 'donkey', 0.99, { label: '骡子', facing: -1, v: 0.18, from: fromOf(b) });
            add('absalom', { label: '押沙龙', sex: 'm', x: 0.99, v: 0.18, facing: -1, robe: ROBE.absalom, glow: 0.3, hair: 'long', from: fromOf(b) });
            ride('absalom', 'mule');
            walk('mule', X.oak - 0.004, { speed: 0.05 });
            avoid([0.52, 0.8]);
            sfx(b, 'donkey', { soft: true });
          }],
          [5.8, b => {
            ride('absalom', null);
            place('absalom', X.oak - 0.008);
            const bp = oakBranchPt();
            fly('absalom', bp[0] / W.w + 0.004, (bp[1] + PH() * 1.08) / W.h, { dur: 0.6, pose: 'raise' });
            walk('mule', 0.64, { speed: 0.035 });
            sfx(b, 'wind', { soft: true });
          }],
          [L[1] - 0.4, b => { fxAdd(b, { type: 'dim', dur: 2.4 }); rm('absalom'); rm('mule'); }],
          [L[1] + 1.4, b => { W.set('dkCairn', 1, b.instant); sfx(b, 'build', { soft: true }); }],
          // 报信的人跑来（18:24–32）
          [L[1] + 1, b => {
            add('ahimaaz', { label: '亚希玛斯', sex: 'm', x: 0.78, v: 0.22, facing: -1, robe: ROBE.runner, glow: 0.2, from: fromOf(b) });
            run('ahimaaz', X.maha + 0.03, { speed: 0.06, pose: 'fall' });
            pose('david', 'stand');
          }],
          [L[1] + 3.2, b => {
            add('cushite', { label: '古示人', sex: 'm', x: 0.8, v: 0.1, facing: -1, robe: ROBE.cushite, glow: 0.2, from: fromOf(b) });
            run('cushite', X.maha + 0.046, { speed: 0.06, pose: 'bow' });
          }],
          [L[1] + 5, () => { pose('ahimaaz', 'stand'); walk('ahimaaz', X.maha + 0.07, { speed: 0.02 }); }],
          [L[1] + 6, () => { pose('david', 'point'); face('david', 1); }],
          // 王上城门楼去哀哭（18:33）
          [L[2], b => {
            W.goTo(0.745, 7, b.instant);
            pose('david', 'weep', { weep: true });
            walk('david', (mahaBox().stairX1 / W.w) + 0.004, { speed: 0.02 });
            sfx(b, 'weep');
          }],
          [L[2] + 1.6, () => {
            onPath('david', 'tower');
            walk('david', X.maha + 0.003, { speed: 0.011, pose: 'weep' });
            pose('david', 'weep', { weep: true });
            pose('cushite', 'bow'); pose('ahimaaz', 'bow'); pose('abishai', 'bow');
          }],
          [L[2] + 5.4, b => sfx(b, 'weep', { soft: true })],
          // 王坐在城门口；众民都到王面前（19:8）
          [L[3], b => {
            offPath('david');
            place('david', X.maha + 0.012);
            pose('david', 'sit', { weep: false }); face('david', 1);
            crowd('people', { n: 7, x0: 0.66, x1: 0.72, layer: 2, label: '众民', v: 0.3, from: fromOf(b), mill: false });
            crowdWalk('people', 0.63, 0.69, { speed: 0.02, pose: 'bow' });
            pose('abishai', 'stand');
          }],
        ]);
      },
    },

    // ── 11 · 饥荒三年；利斯巴；天降雨（19:15—21）────────────────
    {
      kind: 'act', utter: '神垂听国民所求的', cmd: 'await 雨  # 直到天降雨的时候', ref: '21:14', tint: [214, 226, 236],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            rm('ahimaaz'); rm('cushite');
            W.goTo(0.42, 8, b.instant);
            W.set('dkMaha', 0, b.instant); W.set('dkForest', 0, b.instant); W.set('dkCairn', 0, b.instant);
            pose('david', 'stand');
            walk('david', X.atGate, { speed: 0.03 });
            walk('abishai', X.atGate - 0.02, { speed: 0.03 });
            crowdWalk('people', 0.72, 0.78, { speed: 0.03 });
            crowdWalk('flee', 0.7, 0.77, { speed: 0.032 });
            avoid([0.52, 0.84]);
          }],
          [5.6, () => { uncrowd('people'); uncrowd('flee'); rm('abishai'); face('david', -1); }],
          // 大卫年间有饥荒，一连三年（21:1）
          [L[1], b => {
            W.goTo(0.5, 5, b.instant);
            W.set('bare', 0.82, b.instant); W.set('grass', 0.45, b.instant); W.set('bloom', 0.1, b.instant); W.set('clouds', 0.05, b.instant);
            sfx(b, 'wind', { soft: true });
          }],
          [L[1] + 1.6, () => pose('david', 'pray')],
          // 利斯巴在磐石上用麻布搭棚（21:10）
          [L[2], b => {
            pose('david', 'stand');
            W.set('dkRizpah', 1, b.instant);
            const r = rockBox();
            add('rizpah', { label: '利斯巴', sex: 'f', x: (r.cx - r.w * 0.12) / W.w, v: 0, facing: 1, robe: ROBE.rizpah, glow: 0.3, pose: 'sit', from: fromOf(b) });
            onSpot('rizpah', 'rockTop', () => { const q = rockBox(); return [q.cx - q.w * 0.12, q.top + 1.2]; });
          }],
          [L[2] + 1.8, b => { pose('rizpah', 'raise'); if (!b.instant) { const r = rockBox(); fx().sparkle(r.cx, r.top - PH() * 1.4, 10, [60, 56, 64], 30 * SU(), 'air'); } sfx(b, 'wings', { soft: true }); }],
          // 夜间（一层暗，她的火）；日间
          [L[2] + 3.2, b => { pose('rizpah', 'sit'); W.set('gloom', 0.5, b.instant); W.set('storm', 0.45, b.instant); W.set('dkRizFire', 1, b.instant); }],
          [L[2] + 6.4, b => { W.set('gloom', 0, b.instant); W.set('storm', 0, b.instant); W.set('dkRizFire', 0, b.instant); }],
          // 天降雨；神垂听（21:14）
          [L[3], b => {
            W.set('rain', 0.7, b.instant); W.set('clouds', 1, b.instant); W.set('storm', 0.35, b.instant);
            W.set('bare', 0.04, b.instant); W.set('grass', 1, b.instant); W.set('bloom', 0.8, b.instant);
            pose('rizpah', 'gaze');
            sfx(b, 'rain');
          }],
          [L[3] + 3.6, () => pose('david', 'raise')],
          [L[3] + 5.6, b => { W.set('rain', 0.25, b.instant); W.set('storm', 0.15, b.instant); pose('david', 'stand'); }],
        ]);
      },
    },

    // ── 12 · 耶和华是我的岩石（22—23）───────────────────────────
    {
      kind: 'act', utter: '耶和华从天上打雷；至高者发出声音', cmd: 'thunder --from 天上  # 耶和华是我的岩石', ref: '22:14', tint: [255, 236, 200],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            offPath('rizpah'); rm('rizpah');
            W.set('dkRizpah', 0, b.instant);
            S.dAge = 'elder'; dress();
            onPath('david', 'rock');
            walk('david', (X.rock - 0.004), { speed: 0.04, pose: 'raise' });
            W.goTo(0.54, 4, b.instant);
            W.set('storm', 0.95, b.instant); W.set('rain', 0.85, b.instant); W.set('gale', 0.8, b.instant); W.set('clouds', 1, b.instant);
            avoid([0.5, 0.62]);
            sfx(b, 'thunder');
          }],
          [3.5, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.7 }); }],
          [6.6, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.9, near: true }); }],
          [L[1] + 0.6, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.62, near: true }); W.shake = b.instant ? W.shake : Math.max(W.shake || 0, 3); }],
          // 他从高天伸手抓住我（22:17）
          [L[1] + 3.2, b => {
            S.beam = 'david'; W.set('dkBeam', 1, b.instant);
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.2); const p = figPt('david', 0.6); fx().ring(p[0], p[1], [255, 240, 210], M() * 0.16, 1.8, 1.4); }
            sfx(b, 'angel');
          }],
          // 暴风渐息，天慢慢黑下来
          [L[1] + 3.6, b => W.goTo(0.02, 8.5, b.instant)],
          [L[1] + 5, b => { W.set('storm', 0.3, b.instant); W.set('rain', 0.2, b.instant); W.set('gale', 0.2, b.instant); }],
          // 你是我的灯（22:29）
          [L[2], b => {
            W.set('storm', 0, b.instant); W.set('rain', 0, b.instant); W.set('gale', 0, b.instant); W.set('clouds', 0.3, b.instant);
            W.set('dkBeam', 0, b.instant);
          }],
          [L[2] + 1.8, b => { S.torch = true; hold('david', 'torch'); pose('david', 'stand'); sfx(b, 'fire', { soft: true }); }],
          // 日出的晨光，雨后的晴光，使地发生嫩草（23:4）
          [L[3], b => { W.goTo(0.3, 6, b.instant); W.set('dkDew', 1, b.instant); sfx(b, 'bird', { soft: true }); }],
          [L[3] + 3, b => { S.torch = false; hold('david', null); pose('david', 'raise'); sfx(b, 'harp'); }],
        ]);
      },
    },

    // ── 13 · 三样灾（24:1–15）──────────────────────────────────
    {
      kind: 'judge', utter: '我有三样灾，随你选择一样', cmd: 'census --from 但 --to 别是巴  # 我行这事大有罪了', ref: '24:12', tint: [214, 214, 226],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.set('dkDew', 0, b.instant);
            W.goTo(0.4, 5, b.instant);
            S.beam = null;
            add('david', davidOpts({ v: 0.3 }));
            walk('david', X.atGate - 0.012, { speed: 0.05 });
            W.set('dkFloor', 1, b.instant);
            // 亚劳拿在禾场上，他的牛在场的西边（不与人叠在一处）
            add('araunah', { label: '亚劳拿', sex: 'm', x: X.floor + 0.004, v: 0.12, facing: -1, robe: ROBE.araunah, glow: 0.2, from: fromOf(b) });
            animal('ox1', 'cow', X.floor - 0.052, { label: '牛', facing: -1, v: 0.02, from: fromOf(b) });
            animal('ox2', 'cow', X.floor - 0.03, { label: '牛', facing: -1, v: 0.02, from: fromOf(b) });
            add('joab', { label: '约押', sex: 'm', x: X.gate + 0.02, v: 0.18, facing: -1, robe: ROBE.joab, glow: 0.2, prop: 'staff', from: fromOf(b) });
            avoid([0.52, 0.84]);
          }],
          // 数点百姓：从但直到别是巴（24:2–9）——白日里，遍地亮起小光，地上一层薄薄的暗
          [4, b => {
            walk('joab', 0.5, { speed: 0.045 });
            W.set('dkCount', 1, b.instant);
            W.set('gloom', 0.16, b.instant);
            W.goTo(0.56, 14, b.instant);
          }],
          [4.6, () => { offPath('david'); face('david', -1); pose('david', 'point'); }],
          [6.2, () => pose('david', 'stand')],
          [L[1] - 0.5, () => { rm('joab'); }],
          // 大卫心中自责（24:10）
          [L[1] + 1, () => { face('david', 1); pose('david', 'kneel'); }],
          [L[1] + 2.6, () => pose('david', 'pray')],
          // 耶和华的话临到先见迦得：我有三样灾，随你选择一样（24:11–12）
          [L[1] + 2.2, b => {
            add('gad', { label: '迦得', sex: 'm', age: 'elder', x: 0.62, v: 0.25, facing: 1, robe: ROBE.gad, glow: 0.4, prop: 'staff', from: fromOf(b) });
            walk('gad', X.atGate - 0.028, { speed: 0.025 });
          }],
          // 三点光在天上；迦得一样一样地说出（24:13），名字随之显出；瘟疫的影子起来时，另两样暗下去
          [L[1] + 4.6, b => {
            const t0 = L[1] + 4.6;
            fxAdd(b, { type: 'three', dur: L[3] + 5 - t0, names: ['七年饥荒', '三个月逃跑', '三日瘟疫'], lab: L[2] + 0.6 - t0, step: 1.9, dim: L[3] + 2.6 - t0 });
            sfx(b, 'stars', { soft: true });
          }],
          [L[2] + 1, () => { face('david', -1); pose('david', 'kneel'); }],
          [L[2] + 4, () => pose('david', 'pray')],
          // 我愿落在耶和华的手里（24:14）
          [L[3] + 0.6, () => { pose('david', 'raise'); }],
          // 耶和华降瘟疫：影子自西向东走过全地（24:15）；天使向耶路撒冷伸手（24:16）
          [L[3] + 2.6, b => {
            W.set('dkPlague', 1, b.instant); W.set('dkVeil', 1, b.instant);
            W.set('gloom', 0.3, b.instant);
            pose('araunah', 'bow');
            pose('david', 'kneel');
            sfx(b, 'wind');
          }],
          [L[3] + 4.6, b => {
            // 天使在禾场的上空，向东边的耶路撒冷伸手（远离城楼与旗）
            add('angel', { label: '耶和华的使者', sex: 'm', x: X.floor + 0.02, v: 0, facing: 1, angel: true, glow: 1, scale: 1.3, from: b.instant ? 'none' : 'light', pose: 'point' });
            fly('angel', X.floor + 0.02, MOB() ? 0.47 : 0.4, { dur: 2.4, pose: 'point' });
            face('angel', 1);
            sfx(b, 'angel');
          }],
          [L[3] + 3.2, () => { pose('gad', 'kneel'); }],
          [L[3] + 6.2, () => { pose('david', 'pray'); pose('gad', 'pray'); }],
        ]);
      },
    },

    // ── 14 · 够了！住手吧！亚劳拿的禾场上的坛（24:16–25）──────────
    {
      kind: 'cmd', utter: '够了！住手吧！', cmd: 'kill -STOP 瘟疫  # 使民间的瘟疫止住', ref: '24:16', tint: [255, 240, 214], hold: 2.4,
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            // 影子停在它所到之处（前锋上立起一道光）；天使的手停住，下到亚劳拿的禾场那里
            haltAt = b.instant ? null : clamp(W.lv.dkPlague, 0, 1);
            W.set('dkPlague', 1, true);
            const F = floorBox();
            fly('angel', X.floor + 0.024, (F.top - PH() * 0.9) / W.h, { dur: 2.6, pose: 'stand' });
            W.set('gloom', 0.14, b.instant); W.set('dkVeil', 0.75, b.instant);
            fxAdd(b, { type: 'halt', dur: 3.8 });
            if (!b.instant) {
              const fx0 = plagueFront();
              W.flash = Math.max(W.flash || 0, 0.18);
              fx().ring(fx0 * W.w, gY(2, fx0) - PH() * 0.4, [255, 246, 222], M() * 0.22, 2.2, 1.6);
              fx().ring(X.floor * W.w, F.top - PH(), [255, 246, 222], M() * 0.3, 2.4, 1.6);
            }
            avoid([0.6, 0.84]);
            sfx(b, 'angel');
          }],
          // 大卫看见灭民的天使，就祷告（24:17）
          [L[1], b => {
            pose('david', 'stand'); face('david', -1);
            crowd('elders2', { n: 5, x0: 0.8, x1: 0.84, layer: 2, label: '以色列的长老', robe: [104, 94, 80], v: 0.3, from: fromOf(b), mill: false });
            crowdWalk('elders2', 0.768, 0.8, { speed: 0.02, pose: 'kneel' });
            pose('gad', 'stand');
          }],
          [L[1] + 1.4, () => pose('david', 'pray')],
          // 买那禾场与牛（24:18–24）
          [L[2], () => {
            pose('gad', 'point'); face('gad', -1);
            pose('david', 'stand');
            walk('david', X.altar + 0.036, { speed: 0.02 });
            walk('gad', X.altar + 0.07, { speed: 0.02, pose: 'point' });
            pose('araunah', 'stand'); face('araunah', 1);
          }],
          [L[2] + 2.6, () => { pose('araunah', 'fall'); pose('gad', 'stand'); }],
          [L[2] + 4.4, b => {
            pose('araunah', 'stand'); face('david', -1);
            if (!b.instant) { const p = figPt('david', 0.55), q = figPt('araunah', 0.55); if (p && q) fx().sow(p[0], p[1], Array.from({ length: 10 }, () => [q[0] + rand(-4, 4), q[1] + rand(-4, 4), 1.5]), [228, 236, 250], { pass: 'air', dur: 1.8, stagger: 0.8 }); }
            sfx(b, 'chime');
          }],
          // 筑一座坛，献燔祭；瘟疫止住了（24:25）
          [L[3], b => {
            W.set('dkAltar', 1, b.instant);
            // 牛作燔祭（24:22）：牛不再在场上
            rm('ox1'); rm('ox2');
            walk('araunah', X.altar - 0.036, { speed: 0.02 });
            pose('gad', 'stand');
            sfx(b, 'build');
          }],
          [L[3] + 2, b => {
            W.set('dkFire', 1, b.instant);
            W.set('gloom', 0, b.instant); W.set('dkPlague', 0, b.instant); W.set('dkVeil', 0, b.instant); W.set('dkCount', 0, b.instant);
            W.goTo(0.72, 10, b.instant);
            S.beam = 'altar'; W.set('dkBeam', 0.7, b.instant);
            pose('david', 'kneel'); face('david', -1); face('araunah', 1);
            if (!b.instant) { const A = altarBox(); fx().ring(A.cx, A.b - 8 * SU(), [255, 214, 150], M() * 0.25, 2.6, 1.6); fx().sparkle(A.cx, A.b - 14 * SU(), 24, [255, 214, 150], 10 * SU(), 'air'); }
            sfx(b, 'fire');
          }],
          [L[3] + 3.2, b => {
            fly('angel', X.floor + 0.024, 0.2, { dur: 4 });
            sfx(b, 'angel');
          }],
          [L[3] + 5.6, b => { rm('angel'); crowdPose('elders2', 'raise'); pose('gad', 'raise'); }],
          [L[3] + 7.2, () => { crowdPose('elders2', 'bow'); pose('gad', 'bow'); pose('araunah', 'bow'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      danceTick(dt);
      danceMotes(dt);
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawStarHouse(ctx); drawFX(ctx, 'sky'); return; }
      const l = LAYER_OF_PASS[pass];
      if (l === 0) { drawVeil(ctx, 0); drawTally(ctx, 0); drawFX(ctx, 'far'); return; }
      if (l === 1) { drawRabbah(ctx); drawVeil(ctx, 1); drawTally(ctx, 1); drawFX(ctx, 'mid'); return; }
      if (l === 2) {
        for (const q of OLIVES) drawOlive(ctx, q[0], q[1], q[2]);
        const fk = W.lv.dkForest;
        if (fk > 0.01) for (const q of OAKS) drawOak(ctx, q[0], q[1], q[2], q[0] === X.oak, fk);
        drawZion(ctx);
        drawHebron(ctx);
        drawObed(ctx);
        drawMaha(ctx);
        drawRock(ctx);
        drawFloor(ctx);
        drawCairn(ctx);
        drawTable(ctx);
        drawVeil(ctx, 2);
        drawTally(ctx, 2);
        drawFX(ctx, 'near');
        return;
      }
      if (pass === 'air') {
        if (S.ark === 'poles') { const q = arkCarried(); if (q) drawArk(ctx, q.x, q.y, PS(), q.a, true, q.span); }
        drawAltarFire(ctx);
        drawTorches(ctx);
        drawDance(ctx);
        drawHorns(ctx);
        drawCrown(ctx);
        drawShields(ctx);
        drawLetter(ctx);
        drawBeam(ctx);
        drawAngelHalo(ctx);
        drawDew(ctx);
        drawCounsel(ctx);
        drawFX(ctx, 'air');
      }
    },
    reset() { FXL.length = 0; S = fresh(); haltAt = null; },
    restore() { FXL.length = 0; haltAt = null; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const s = SU();
      cand('大卫城', X.citadel * W.w, hillY(X.citadel) - 34 * s);
      cand('城门', X.gate * W.w, gY(2, X.gate) - 26 * s);
      if (W.lv.dkPalace > 0.5) { const P = palaceBox(); cand('王宫', P.cx, P.roof - 4 * s); }
      if (W.lv.dkTent > 0.5) { const t = tentBox(); cand(S.ark === 'tent' ? '约柜' : '帐幕', t.cx, t.base - t.h - 4 * s); }
      if (W.lv.dkHebron > 0.5) cand('希伯仑', 0.66 * W.w, gY(2, 0.66) - 22 * s);
      if (W.lv.dkObed > 0.5) cand('俄别‧以东的家', X.obed * W.w, gY(2, X.obed) - 20 * s);
      if (S.ark === 'obed' || S.ark === 'poles') { const q = arkPos(); if (q) cand('约柜', q.x, q.y - 12 * s); }
      if (W.lv.dkMaha > 0.5) cand('玛哈念的城门', X.maha * W.w, gY(2, X.maha) - 34 * s);
      if (W.lv.dkForest > 0.5) cand('橡树', X.oak * W.w, gY(2, X.oak) - 40 * s * OAKS[1][1]);
      if (W.lv.dkCairn > 0.5) cand('石堆', (X.oak - 0.012) * W.w, fieldY(X.oak - 0.012, 0.08) - 10 * s);
      const rb = rockBox();
      cand('磐石', rb.cx, rb.top - 4 * s);
      if (W.lv.dkFloor > 0.5) { const F = floorBox(); cand('亚劳拿的禾场', F.cx, F.top - 6 * s); }
      if (W.lv.dkAltar > 0.5) { const A = altarBox(); cand('坛', A.cx, A.b - 14 * s); }
      if (W.lv.dkTable > 0.5) cand('王的席', X.table * W.w, fieldY(X.table, 0.3) - 12 * s);
      if (W.lv.dkRabbah > 0.5) cand('拉巴', X.rabbah * W.w, gY(1, X.rabbah) - 20 * LS(1));
      for (const q of OLIVES) cand('橄榄树', q[0] * W.w, gY(2, q[0]) - 18 * s * q[1]);
      return best;
    },
    // 给走查器：本卷的状态摘要（看完 == 直接恢复）
    sig() {
      const paths = Object.keys(S.paths).sort().map(k => k + ':' + S.paths[k]).join(',');
      return { ark: S.ark, dance: S.dance, horns: S.horns, crown: S.crown, shields: S.shields, letter: S.letter, torch: S.torch,
        beam: S.beam, robe: S.dRobe, age: S.dAge, paths };
    },
  };

  const PSALM = { text: '耶和华是我的岩石，我的山寨，我的救主，我的神，我的磐石，我所投靠的。', ref: '撒母耳记下 22:2–3' };
  GS.book.act({
    id: ACT, book: '撒母耳记下', books: [10], title: '大卫王', sub: '撒母耳记下 1 — 24', tint: [255, 214, 150], music: 'abraham',
    outro: 16,
    intro: INTRO,
    // 全卷终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '大卫': { text: '耶西的儿子大卫得居高位，是雅各神所膏的，作以色列的美歌者……', ref: '撒母耳记下 23:1' },
      '拿单': { text: '耶和华差遣拿单去见大卫。', ref: '撒母耳记下 12:1' },
      '约柜': { text: '……这约柜就是坐在二基路伯上万军之耶和华留名的约柜。', ref: '撒母耳记下 6:2' },
      '帐幕': { text: '众人将耶和华的约柜请进去，安放在所预备的地方，就是在大卫所搭的帐幕里。', ref: '撒母耳记下 6:17' },
      '大卫城': { text: '然而大卫攻取锡安的保障，就是大卫的城。', ref: '撒母耳记下 5:7' },
      '城门': { text: '于是王起来，坐在城门口。众民听说王坐在城门口，就都到王面前。', ref: '撒母耳记下 19:8' },
      '王宫': { text: '泰尔王希兰将香柏木运到大卫那里，又差遣使者和木匠、石匠给大卫建造宫殿。', ref: '撒母耳记下 5:11' },
      '希伯仑': { text: '在希伯仑作犹大王七年零六个月，在耶路撒冷作以色列和犹大王三十三年。', ref: '撒母耳记下 5:5' },
      '俄别‧以东的家': { text: '耶和华的约柜在迦特人俄别‧以东家中三个月；耶和华赐福给俄别‧以东和他的全家。', ref: '撒母耳记下 6:11' },
      '俄别‧以东': { text: '耶和华的约柜在迦特人俄别‧以东家中三个月；耶和华赐福给俄别‧以东和他的全家。', ref: '撒母耳记下 6:11' },
      '抬约柜的人': { text: '抬耶和华约柜的人走了六步，大卫就献牛与肥羊为祭。', ref: '撒母耳记下 6:13' },
      '吹角的人': { text: '这样，大卫和以色列的全家欢呼吹角，将耶和华的约柜抬上来。', ref: '撒母耳记下 6:15' },
      '以色列的全家': { text: '大卫和以色列的全家在耶和华面前，用松木制造的各样乐器和琴、瑟、鼓、钹、锣，作乐跳舞。', ref: '撒母耳记下 6:5' },
      '米非波设': { text: '于是米非波设住在耶路撒冷，常与王同席吃饭。他两腿都是瘸的。', ref: '撒母耳记下 9:13' },
      '王的席': { text: '于是米非波设住在耶路撒冷，常与王同席吃饭。他两腿都是瘸的。', ref: '撒母耳记下 9:13' },
      '拔示巴': { text: '大卫安慰他的妻拔示巴……她就生了儿子，给他起名叫所罗门。耶和华也喜爱他。', ref: '撒母耳记下 12:24' },
      '赫人乌利亚': { text: '乌利亚对大卫说：「约柜和以色列与犹大兵都住在棚里……我岂可回家吃喝、与妻子同寝呢？」', ref: '撒母耳记下 11:11' },
      '押沙龙': { text: '以色列全地之中，无人像押沙龙那样俊美，得人的称赞，从脚底到头顶毫无瑕疵。', ref: '撒母耳记下 14:25' },
      '约押': { text: '洗鲁雅的儿子约押作元帅。', ref: '撒母耳记下 8:16' },
      '亚比筛': { text: '洗鲁雅的儿子、约押的兄弟亚比筛是这三个勇士的首领；他举枪杀了三百人，就在三个勇士里得了名。', ref: '撒母耳记下 23:18' },
      '亚希多弗': { text: '那时亚希多弗所出的主意好像人问神的话一样；他昔日给大卫，今日给押沙龙所出的主意，都是这样。', ref: '撒母耳记下 16:23' },
      '户筛': { text: '押沙龙和以色列众人说：「亚基人户筛的计谋比亚希多弗的计谋更好！」', ref: '撒母耳记下 17:14' },
      '示每': { text: '于是大卫和跟随他的人往前行走。示每在大卫对面山坡，一面行走一面咒骂，又拿石头砍他，拿土扬他。', ref: '撒母耳记下 16:13' },
      '橄榄树': { text: '大卫蒙头赤脚上橄榄山，一面上一面哭。', ref: '撒母耳记下 15:30' },
      '橡树': { text: '押沙龙骑着骡子，从大橡树密枝底下经过，他的头发被树枝绕住，就悬挂起来。', ref: '撒母耳记下 18:9' },
      '石堆': { text: '他们将押沙龙丢在林中一个大坑里，上头堆起一大堆石头。', ref: '撒母耳记下 18:17' },
      '玛哈念的城门': { text: '王就心里伤恸，上城门楼去哀哭，一面走一面说：「我儿押沙龙啊！我儿，我儿押沙龙啊！」', ref: '撒母耳记下 18:33' },
      '拉巴': { text: '于是大卫聚集众军，往拉巴去攻城，就取了这城。', ref: '撒母耳记下 12:29' },
      '利斯巴': { text: '爱雅的女儿利斯巴用麻布在磐石上搭棚，从动手收割的时候直到天降雨在尸身上的时候。', ref: '撒母耳记下 21:10' },
      '磐石': PSALM,
      '亚劳拿的禾场': { text: '当日，迦得来见大卫，对他说：「你上去，在耶布斯人亚劳拿的禾场上为耶和华筑一座坛。」', ref: '撒母耳记下 24:18' },
      '亚劳拿': { text: '亚劳拿对大卫说：「我主我王，你喜悦用什么，就拿去献祭。看哪，这里有牛可以作燔祭……」', ref: '撒母耳记下 24:22' },
      '坛': { text: '大卫在那里为耶和华筑了一座坛，献燔祭和平安祭。如此，耶和华垂听国民所求的，瘟疫在以色列人中就止住了。', ref: '撒母耳记下 24:25' },
      '迦得': { text: '大卫早晨起来，耶和华的话临到先知迦得，就是大卫的先见。', ref: '撒母耳记下 24:11' },
      '耶和华的使者': { text: '那时耶和华的使者在耶布斯人亚劳拿的禾场那里。', ref: '撒母耳记下 24:16' },
      '以色列的长老': { text: '于是以色列的长老都来到希伯仑见大卫王……他们就膏大卫作以色列的王。', ref: '撒母耳记下 5:3' },
      '牛': { text: '大卫就用五十舍客勒银子买了那禾场与牛。', ref: '撒母耳记下 24:24' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

})(window.GS);
