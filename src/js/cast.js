/* ─────────────────────────────────────────────────────────────
 * cast.js —— 创世记中的人物：亚当、夏娃、该隐、亚伯、挪亚、亚伯拉罕、撒拉、以撒、雅各、约瑟……
 *
 * 他们都是小小的抽象剪影（无面目），站在大地的某一层上，由各卷的情节调度。
 * 与七日里的人、走兽同一种画法：由参数化的基元拼成剪影，W.shade 统一受光，迎光一侧一道暖边，
 * 胸中一点灵的微光，近地脚下有接地的影。横坐标 x 一律用 0..1 的比例（随屏幕缩放不变）。
 * W.replaying 为真时（恢复存档 / 快进情节），一切动作直接到位。
 *
 * ── 人 ──────────────────────────────────────────────────────
 *   GS.cast.add(id, { label, sex:'m'|'f', age:'adult'|'elder'|'child'|'baby', layer: 2 近 | 1 中 | 0 远, x: 0..1,
 *                     facing: 1|-1, pose, robe:[r,g,b], glow, from:'dust'|'fade'|'light'|'none', speed, scale,
 *                     // 以下为新增（皆可省略）
 *                     prop: 'staff'|'spear'|'blade'|'bundle'|'wood'|'torch'|'jar'|'coat'|'sword'|null,   // 所携之物（长者默认持杖；sword 是基路伯发火焰的剑，blade 是寻常的刀剑）
 *                     carry: 'baby'|'lamb'|null,     // 怀中抱着婴孩 / 羊羔
 *                     angel: true, wings: true,      // 天使：淡金、发光、微微离地（创世记的访客形如人，无翼）；wings → 基路伯
 *                     hair: 'veil'|'long'|'cloth'|'short'|'none', beard: bool, accent:[r,g,b],   // 头巾/长发/包头；默认：女子蒙头巾、女孩长发、长者包头有须
 *                     bare: true,                    // 未穿衣袍（伊甸之初）：身体剪影、女子长发
 *                     v: 0..1 })                     // 在近地纵深里稍靠前（画面更低、更大）；默认 0（站在地的轮廓线上）
 *     已存在的 id 再 add：更新所给的字段（可用来换衣袍、加物件），并取消正在进行的淡出。
 *   GS.cast.walk(id, x, { speed, pose, layer, run })   // 走到 x（到了换成 pose）；run:true 或 speed ≥ 0.07 → 奔跑
 *   GS.cast.run(id, x, o)                             // = walk(id, x, {run:true, ...o})
 *   GS.cast.place(id, x, layer)   GS.cast.pose(id, pose, { stop, weep })   GS.cast.face(id, 1|-1|x|'otherId')
 *   GS.cast.follow(id, otherId, dx)   // 跟随：目标 = other.x − dx × other.facing（dx>0 跟在后面；省略时为 −0.03，沿用旧义）
 *   GS.cast.glow(id, v)   GS.cast.remove(id, { fade })   GS.cast.clear({ fade:false })   has / get / list
 *   GS.cast.prop(id, kind|null)   GS.cast.carry(id, 'baby'|'lamb'|null)
 *   GS.cast.holdHands(id1, id2, on=true)   // 二人并立或同行时手牵手（相距不到约 0.8 身高时相握：近地 1280 宽约 0.02 以内）
 *   GS.cast.embrace(id1, id2, { run, weep, at })  // 二人相向走近（at：相拥之处 0..1，省略则在二人之间）、相拥（可同时哭泣）；
 *                                                 // 也可各自 face 对方后都 pose 'embrace'——相隔尚远时二人自会走近
 *   GS.cast.ride(id, mountId|null)     // 骑上骆驼 / 驴，坐上车；null 下来
 *   GS.cast.fly(id, x, y|null, { dur, pose })  // 升空 / 飞到 (x, y)（y 为画面高度的比例）；y 为 null 则落回地面（以诺被取去、天梯上的使者）
 *   GS.cast.attach(id, fn|null)        // 每帧由 fn() → [px, py] 给出脚下的位置（站在方舟上、梯子上……）
 *   GS.cast.light(key, x, y, r, a, rgb) // 局部的光（灯、火、火把）：每帧登记一次；半径 r 以内的人与牲畜被照亮（像素坐标；a 0..1）
 *
 *   pose：'stand' 'walk' 'run' 'kneel' 'bow' 'lie' 'sit' 'seat'（坐在座上） 'sleep'（坐着睡着） 'raise'（举手） 'pray' 'carry' 'point'
 *         'wrestle'（二人相对，会伸手角力） 'fall'（仆倒、脸伏于地） 'weep'（低头、掩面、双肩抽动）
 *         'embrace'（向前相拥） 'gaze'（仰望） 'ride'（由 ride() 自动设定）
 *   姿势之间平滑过渡（躺下经由坐、俯伏经由跪）；行走的步伐与移动的距离相合；站着时有细微的呼吸；
 *   神言说时，站着的人转向神的灵并仰首。重演时：正在走的先走到再换姿势，面朝去向，跟随者随之到位。
 *   性能：静止的人与牲畜每隔若干帧才重算一次几何，其余帧以缓存的 Path2D 直接填色。
 *
 * ── 牲畜 ────────────────────────────────────────────────────
 *   GS.cast.animal(id, { kind:'camel'|'donkey'|'ram'|'sheep'|'cow'|'goat'|'wagon', x, layer, label, facing,
 *                        pose:'stand'|'walk'|'lie'|'graze', follow: otherId, dx, from, speed, scale, pack: bool,
 *                        speckled: bool, col:[r,g,b], v })
 *     别名：ox/calf → cow，lamb/ewe → sheep，kid → goat，ass → donkey，cart → wagon（小者自动缩小）。
 *     walk / run / place / pose / face / follow / remove 对牲畜同样有效（同一个 id 空间）。
 *   GS.cast.herd(gid, { kind, n, x0, x1, layer, label, speckled, pose, from, mill })   // 一群羊 / 牛：crowdWalk / crowdPose / scatter / removeCrowd 通用
 *     speckled: true | 0..1（有斑点的比例，创 30:32）；mill:false 则不自行走动吃草
 *   GS.cast.POSES / GS.cast.KINDS：可用的姿势 / 牲畜种类
 *
 * ── 人群 ────────────────────────────────────────────────────
 *   GS.cast.crowd(gid, { n, x0, x1, layer, label, robe, pose, glow, from, mill })   GS.cast.crowdWalk(gid, x0, x1, { speed, pose })
 *   GS.cast.crowdPose(gid, pose)   GS.cast.scatter(gid)   GS.cast.removeCrowd(gid, { fade })
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU } = U;
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOut = t => 1 - (1 - t) * (1 - t) * (1 - t);
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const approach = (cur, tg, rate, dt) => cur + (tg - cur) * (1 - Math.exp(-rate * dt));
  const wrapPi = a => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
  const angLerp = (a, b, t) => a + wrapPi(b - a) * t;
  const fastK = () => Math.max(0.1, W.fast || 1);

  const people = new Map();     // id → 人物或牲畜
  const crowds = new Map();     // gid → { members: [...], o }
  let ORD = 0;

  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  const ROBE_M = [120, 92, 70], ROBE_F = [150, 108, 96];
  const SKIN = [70, 52, 42], HAIR = [36, 27, 22], GREY = [214, 208, 198];
  const WOOD = [104, 76, 50], FIREWOOD = [164, 124, 80], CLAY = [184, 122, 78], SWADDLE = [236, 228, 210], LAMB = [238, 232, 218], CLOTH = [150, 120, 88];
  const ANGEL = [240, 224, 184], ANGEL_SKIN = [236, 216, 180], ANGEL_ACC = [252, 232, 188], ANGEL_WING = [246, 232, 200];
  const COAT = [[184, 58, 50], [226, 172, 60], [66, 104, 168], [84, 140, 82], [146, 80, 146], [228, 206, 150]];
  const CROWD_ROBES = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [96, 80, 72], [120, 100, 84], [104, 96, 110], [140, 96, 80], [158, 138, 108]];
  const CROWD_ACC = [[220, 208, 186], [196, 176, 150], [168, 132, 116], [150, 158, 172], [206, 190, 160], [184, 150, 132]];
  const INNER = [220, 235, 255], WARM = [255, 222, 160], FLAME = [255, 176, 80];

  const groundY = (layer, x) => {
    const L = GS.land;
    let y = L && L.groundY ? L.groundY(layer, x) : W.ridgeY(layer, x);
    if (!isFinite(y)) y = W.ridgeY(layer, x);
    return y;
  };
  const PASS = { 0: 'far', 1: 'mid', 2: 'near' };
  // 七日之后，人是故事的主角：画得大一些；手机上再大一些
  const boost = () => (W.w < 600 ? (W.act >= 1 ? 1.55 : 1.15) : 1);
  const ACT_K = [1.1, 1.2, 1.3];
  const actK = layer => (W.act >= 1 ? ACT_K[layer] || 1 : 1);
  const fieldH = (layer, g) => (layer === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(layer) - g));

  // ════════════════════════════════════════════════════════════
  //  姿势：一组可插值的参数（长度以身高 h 为 1；角度自正下方量起，向前为正）
  //  髋高 · 躯干前倾 · 全身转角 · 低头 · 近/远 大腿 小腿 · 近/远 上臂 前臂 · 着地（1 = 双脚踏地，髋高由腿求出）
  // ════════════════════════════════════════════════════════════
  const HIP = 0, LEAN = 1, ROT = 2, HEAD = 3, NTH = 4, NSH = 5, FTH = 6, FSH = 7, NUA = 8, NFA = 9, FUA = 10, FFA = 11, GRD = 12, NP = 13;
  const PV = (...a) => Float32Array.from(a);
  const POSES = {
    stand:   PV(0.49, 0.02, 0, 0, 0.05, 0.01, -0.06, -0.03, 0.1, 0.16, -0.1, -0.03, 1),
    walk:    PV(0.49, 0.05, 0, 0.02, 0.02, 0.0, -0.02, -0.01, 0.02, 0.14, -0.02, 0.1, 1),
    run:     PV(0.48, 0.2, 0, -0.04, 0.02, 0.0, -0.02, -0.01, 0.1, 1.45, -0.1, 1.3, 1),
    kneel:   PV(0.27, 0.04, 0, 0.14, 0.12, -1.45, 0.07, -1.5, 0.2, 0.45, 0.14, 0.35, 0),
    pray:    PV(0.27, 0.08, 0, 0.38, 0.12, -1.45, 0.07, -1.5, 0.75, 2.45, 0.68, 2.35, 0),
    // 鞠躬：上身前倾约 45°，头垂得更低，膝微屈，两臂垂下——小小的一个人也看得出是在下拜
    bow:     PV(0.46, 0.76, 0, 0.55, 0.14, -0.12, 0.04, -0.1, 0.22, 0.14, 0.12, 0.06, 1),
    // 众人下拜：跪下，身子伏向前（成群时用它代替鞠躬，免得一排排直角的「钩子」）
    worship: PV(0.27, 0.68, 0, 0.55, 0.12, -1.45, 0.07, -1.5, 0.62, 0.95, 0.55, 0.9, 0),
    fall:    PV(0.07, 0, 1.5708, -0.1, 0.02, 0, -0.03, 0, 2.95, 3.05, 2.85, 2.95, 0),
    lie:     PV(0.07, 0, -1.5708, 0.05, 0.06, -0.04, 0.02, 0, 0.12, 0.3, 0.08, 0.2, 0),
    sit:     PV(0.126, -0.06, 0, 0.1, 2.0, 0.35, 1.85, 0.3, 0.95, 1.45, 0.85, 1.35, 0),
    seat:    PV(0.27, 0.02, 0, 0.05, 1.5, 0.02, 1.42, -0.05, 0.5, 1.2, 0.4, 1.1, 0),
    // 坐着睡着了：头垂下，身子微微前倾，两臂搭在膝上（客西马尼的门徒）
    sleep:   PV(0.126, 0.36, 0, 0.78, 2.0, 0.35, 1.85, 0.3, 0.55, 1.3, 0.48, 1.22, 0),
    raise:   PV(0.49, -0.04, 0, -0.35, 0.05, 0.01, -0.06, -0.03, 2.75, 2.95, 2.6, 2.8, 1),
    gaze:    PV(0.49, -0.05, 0, -0.5, 0.05, 0.01, -0.06, -0.03, 0.08, 0.14, -0.1, -0.03, 1),
    carry:   PV(0.49, 0.04, 0, 0.1, 0.05, 0.01, -0.06, -0.03, 0.55, 1.5, 0.45, 1.4, 1),
    point:   PV(0.49, 0.02, 0, -0.1, 0.06, 0.01, -0.07, -0.03, 1.85, 1.95, -0.12, -0.03, 1),
    wrestle: PV(0.42, 0.5, 0, 0.2, 0.45, -0.12, -0.45, -0.35, 1.35, 1.05, 1.2, 0.95, 1),
    weep:    PV(0.48, 0.16, 0, 0.62, 0.04, 0.01, -0.05, -0.03, 0.5, 2.6, 0.42, 2.5, 1),
    embrace: PV(0.48, 0.2, 0, 0.25, 0.08, 0.01, -0.1, -0.05, 1.25, 1.95, 1.1, 1.8, 1),
    ride:    PV(0.3, 0.03, 0, 0.05, 0.95, 0.05, 0.85, 0, 0.45, 1.2, 0.4, 1.1, 0),
  };
  const poseVec = n => POSES[n] || POSES.stand;
  const UPRIGHT = { stand: 1, walk: 1, run: 1, gaze: 1, point: 1, raise: 1, carry: 1, weep: 1, embrace: 1, wrestle: 1, bow: 1 };
  const LOW = { lie: 1, fall: 1 };
  // 身体各部的长度（成人 / 孩子，以自身身高为 1）
  const PR = {
    adult: { T: 0.31, TH: 0.25, SH: 0.245, UA: 0.17, FA: 0.155, NK: 0.035, HR: 0.068, W: 1 },
    child: { T: 0.285, TH: 0.215, SH: 0.2, UA: 0.15, FA: 0.14, NK: 0.03, HR: 0.09, W: 0.92 },
  };

  // ── 牲畜的物种（尺寸以近地 unit=1 的像素计，与 beasts.js 同一套：面向 +x，y 向上为负）──────
  const SPEC = {
    sheep: { cn: '羊', type: 'q', bl: 17, bh: 11.5, leg: 6.2, lw: [2.1, 1.55, 1.35], neck: 5.6, nw: [6.4, 4.2], up: 0.5, hd: 0.95,
      hl: 6.2, hh: 4.3, muz: 0.8, ear: 2.5, earOut: true, wool: true, stride: 6.5, col: [232, 225, 210], col2: [58, 49, 42], top: 20, len: 27 },
    ram: { cn: '公羊', type: 'q', bl: 18.5, bh: 12.4, leg: 6.8, lw: [2.3, 1.7, 1.45], neck: 5.8, nw: [7.0, 4.6], up: 0.55, hd: 0.9,
      hl: 6.6, hh: 4.6, muz: 0.8, ear: 2.2, earOut: true, wool: true, horn: 'ram', stride: 7, col: [214, 204, 184], col2: [56, 46, 40], acc: [206, 186, 150], top: 22, len: 29 },
    goat: { cn: '山羊', type: 'q', bl: 16.5, bh: 8.8, leg: 9, lw: [2.0, 1.35, 1.15], neck: 7.2, nw: [4.4, 3.0], up: 0.8, hd: 1.15,
      hl: 6.4, hh: 3.8, muz: 0.72, ear: 2.4, horn: 'goat', beard: true, tail: 'up', stride: 8, col: [140, 118, 94], alt: [216, 206, 188], col2: [70, 56, 44], top: 24, len: 27 },
    cow: { cn: '牛', type: 'q', bl: 30, bh: 13, leg: 11, lw: [3.6, 2.4, 2.1], neck: 7.6, nw: [9.6, 5.6], up: 0.28, hd: 0.8,
      hl: 10.4, hh: 5.8, muz: 0.95, ear: 2.8, earOut: true, horn: 'cow', tail: 'tuft', rump: 1.0, flat: true, dewlap: true,
      stride: 10, col: [90, 70, 51], alt: [42, 33, 26], col2: [34, 27, 22], acc: [222, 212, 196], top: 29, len: 42 },
    donkey: { cn: '驴', type: 'q', bl: 22, bh: 10.5, leg: 11.5, lw: [2.6, 1.7, 1.5], neck: 8.6, nw: [6.2, 3.5], up: 0.78, hd: 1.35,
      hl: 8.6, hh: 4.2, muz: 0.9, ear: 4.6, hmane: true, tail: 'tuft', chest: 0.9, rump: 0.95,
      stride: 9, col: [124, 112, 100], alt: [96, 84, 74], col2: [52, 45, 40], acc: [214, 204, 190], top: 29, len: 34 },
    horse: { cn: '马', type: 'q', bl: 26, bh: 11.5, leg: 15, lw: [2.9, 1.8, 1.55], neck: 11, nw: [6.8, 3.7], up: 0.98, hd: 1.3,
      hl: 9.4, hh: 4.1, muz: 0.85, ear: 2.3, hmane: true, tail: 'tuft', chest: 0.98, rump: 1.02,
      stride: 12, col: [92, 66, 46], alt: [44, 34, 28], col2: [30, 24, 20], acc: [226, 216, 200], top: 37, len: 40 },
    camel: { cn: '骆驼', type: 'c', bl: 30, bh: 12, leg: 21, lw: [3.1, 2.1, 3.0], neck: 18, up: 0.95, hl: 7.4, hh: 3.5,
      stride: 13, col: [182, 146, 104], alt: [150, 116, 82], col2: [110, 84, 58], acc: [210, 186, 150], top: 40, len: 46 },
    wagon: { cn: '车', type: 'w', bl: 30, bh: 8, leg: 7.5, stride: 7.5, col: [118, 88, 60], col2: [66, 50, 36], acc: [176, 146, 104], top: 22, len: 50 },
  };
  const ALIAS = { ox: 'cow', cattle: 'cow', calf: 'cow', bull: 'cow', ass: 'donkey', stallion: 'horse', mare: 'horse', steed: 'horse', lamb: 'sheep', ewe: 'sheep', kid: 'goat', cart: 'wagon', dromedary: 'camel' };
  const SMALL = { calf: 0.68, lamb: 0.7, kid: 0.72 };
  const ACN = { lamb: '羊羔', kid: '山羊羔', calf: '牛犊', ox: '牛', ass: '驴', cart: '车' };
  // 吃草时的颈角（口鼻几乎触地），与 beasts.js 同法求出
  for (const k in SPEC) {
    const M = SPEC[k];
    M.key = k;
    if (M.type !== 'q') { M.grazeA = M.type === 'c' ? -1.15 : 0; continue; }
    const by = -(M.leg + M.bh * 0.5);
    let al = M.up;
    for (; al > -1.55; al -= 0.02) {
      const sx = M.bl * 0.36, sy = by - M.bh * 0.05;
      const nx = sx + Math.cos(al) * M.neck, ny = sy - Math.sin(al) * M.neck;
      const be = al - (al > 0 ? M.hd : M.hd * 0.35);
      if (ny - Math.sin(be) * M.hl * 0.95 > -1.2) break;
    }
    M.grazeA = al;
  }

  // ════════════════════════════════════════════════════════════
  //  光：日 / 月 / 灵（夜里灵是唯一的灯）——与 beasts.js 相同的描光
  // ════════════════════════════════════════════════════════════
  const RIM_DAY = [255, 244, 222], RIM_WARM = [255, 178, 110], RIM_NIGHT = [168, 190, 240], RIM_SPIRIT = [150, 195, 255], HUMAN_RIM = [255, 217, 168];
  const LT = { sunA: 0, sunCol: RIM_DAY, sx: 0, sy: 0, moonA: 0, mx: 0, my: 0, spA: 0, spR: 200, spx: 0, spy: 0, sh: 0.18 };
  const RIM = { dx: 0, dy: -1, a: 0, c: [255, 255, 255], extra: 0 };
  function updLight() {
    const df = W.dayFactor, dk = W.dusk, L = W.lv.light;
    LT.sunA = L * c01(df * 1.25) * lerp(0.5, 1.0, dk);
    LT.sunCol = mix3(RIM_DAY, RIM_WARM, c01(dk * 1.2));
    LT.sx = W.core.x; LT.sy = W.core.y;
    const mo = W.moon;
    LT.moonA = mo && mo.vis > 0 ? mo.vis * W.night * U.smoothstep(-0.06, 0.2, mo.elev) * 0.85 : 0;
    LT.mx = mo ? mo.x : 0; LT.my = mo ? mo.y : 0;
    const sp = W.spirit;
    LT.spx = sp.x; LT.spy = sp.y;
    LT.spR = 230 * Math.max(0.6, W.unit);
    LT.spA = L * (0.1 + 0.9 * W.night);
    LT.sh = 0.2 * (0.25 + 0.75 * W.daylight);
  }
  // ── 局部的光：灯、火、火把、光柱……各幕每帧调用 GS.cast.light(key, x, y, r, a, rgb) 登记（像素坐标；r 为照到的半径，a 0..1）；
  //    近处的人与牲畜受它照亮（整体提亮，迎光一侧一道暖边）。两帧没有再登记的光自行熄灭——不会带到下一幕。
  const LIGHTS = new Map();
  const LOC = { a: 0, r: 0, g: 0, b: 0 };         // 此刻正在上色的这个人（或牲畜）所受的局部光
  function light(key, x, y, r, a, c) {
    let l = LIGHTS.get(key);
    if (!l) { l = {}; LIGHTS.set(key, l); }
    l.x = x; l.y = y; l.r = Math.max(1, r || 120); l.a = a == null ? 0.6 : a; l.c = c || [255, 196, 120]; l.f = W.frame;
  }
  function rimAt(x, y, warm) {
    let wx = 0, wy = 0, ws = 0, r = 0, g = 0, b = 0;
    if (LT.sunA > 0.004) {
      const dx = LT.sx - x, dy = LT.sy - y, d = Math.hypot(dx, dy) || 1, a = LT.sunA;
      const c = warm ? mix3(LT.sunCol, HUMAN_RIM, 0.55) : LT.sunCol;
      wx += dx / d * a; wy += dy / d * a; ws += a; r += c[0] * a; g += c[1] * a; b += c[2] * a;
    }
    if (LT.moonA > 0.004) {
      const dx = LT.mx - x, dy = LT.my - y, d = Math.hypot(dx, dy) || 1, a = LT.moonA;
      wx += dx / d * a; wy += dy / d * a; ws += a; r += RIM_NIGHT[0] * a; g += RIM_NIGHT[1] * a; b += RIM_NIGHT[2] * a;
    }
    const dx = LT.spx - x, dy = LT.spy - y, d = Math.hypot(dx, dy) || 1;
    const f = c01(1 - d / LT.spR), ff = f * f;
    RIM.extra = LT.spA * ff * 0.5 + LT.moonA * 0.12;
    const sa = LT.spA * ff * 1.7;
    if (sa > 0.004) {
      const c = warm ? mix3(RIM_SPIRIT, INNER, 0.5) : RIM_SPIRIT;
      wx += dx / d * sa; wy += dy / d * sa; ws += sa; r += c[0] * sa; g += c[1] * sa; b += c[2] * sa;
    }
    LOC.a = 0;
    if (LIGHTS.size) {
      let la0 = 0, lr = 0, lg = 0, lb = 0;
      for (const lt of LIGHTS.values()) {
        if (W.frame - lt.f > 2) continue;
        const lx = lt.x - x, ly = lt.y - y, ld = Math.hypot(lx, ly) || 1, lf = c01(1 - ld / lt.r);
        if (lf <= 0) continue;
        const la = lt.a * lf * lf, s2 = la * 1.6;
        la0 += la; lr += lt.c[0] * la; lg += lt.c[1] * la; lb += lt.c[2] * la;
        wx += lx / ld * s2; wy += ly / ld * s2; ws += s2; r += lt.c[0] * s2; g += lt.c[1] * s2; b += lt.c[2] * s2;
      }
      if (la0 > 0.004) {
        // 灯火的光直接加在衣袍上（按衣色反射），不被夜的冷色吞掉；ex 也随之变化，好让颜色缓存失效
        LOC.a = Math.min(1, la0); LOC.r = lr / la0; LOC.g = lg / la0; LOC.b = lb / la0;
        RIM.extra += LOC.a * 0.12;
      }
    }
    if (ws < 0.004) { RIM.a = 0; RIM.dx = 0; RIM.dy = -1; return RIM; }
    const L = Math.hypot(wx, wy) || 1;
    // 月光只该是一道细边：月占的份额越大，边越窄、越淡
    const ms = LT.moonA > 0.004 ? LT.moonA / ws : 0, nm = W.night * (1 - ms);
    const k = clamp(Math.max(0.3, W.unit) * (warm ? 0.8 : 0.85), 0.6, 1.15) * (1 + 0.45 * nm) * (1 - 0.35 * ms * W.night);
    RIM.dx = wx / L * k; RIM.dy = wy / L * k;
    RIM.c[0] = r / ws; RIM.c[1] = g / ws; RIM.c[2] = b / ws;
    RIM.a = Math.min(1 - 0.55 * ms, ws * (1 + 0.6 * nm)) * (warm ? 0.9 : 0.85);
    return RIM;
  }

  // ════════════════════════════════════════════════════════════
  //  几何：局部坐标 → 屏幕；同一路径内所有子路径同向，才能以 nonzero 合并（与 beasts.js 同法）
  // ════════════════════════════════════════════════════════════
  const T = { x: 0, y: 0, s: 1, f: 1, a: 0, c: 1, n: 0 };
  let PX = 0, PY = 0, IX = 0, IY = 0;
  // 路径不用 Path2D（慢）：记在一段命令缓冲里，再按组回放到 ctx（描光时整体回放一次）
  //   0 moveTo x y · 1 lineTo x y · 2 ellipse cx cy rx ry rot（fill 自会闭合子路径，不必 closePath）
  const CB = new Float64Array(16384);
  let cbN = 0;
  function setT(x, y, s, f, rot) {
    T.x = x; T.y = y; T.s = s;
    T.f = Math.abs(f) < 0.14 ? (f < 0 ? -0.14 : 0.14) : f;
    T.a = rot || 0; T.c = Math.cos(T.a); T.n = Math.sin(T.a);
  }
  function tp(lx, ly) {
    const rx = lx * T.c - ly * T.n, ry = lx * T.n + ly * T.c;
    PX = T.x + rx * T.s * T.f; PY = T.y + ry * T.s;
  }
  function inv(X, Y) {           // 屏幕 → 局部
    const rx = (X - T.x) / (T.s * T.f), ry = (Y - T.y) / T.s;
    IX = rx * T.c + ry * T.n; IY = -rx * T.n + ry * T.c;
  }
  function ell(lx, ly, rx, ry, rot) {
    tp(lx, ly);
    const r = (T.f < 0 ? -1 : 1) * ((rot || 0) + T.a);
    const cr = Math.cos(r), sr = Math.sin(r), kx = Math.abs(T.f);
    const RX = Math.max(0.05, rx * T.s * Math.sqrt(kx * kx * cr * cr + sr * sr));
    const RY = Math.max(0.05, ry * T.s * Math.sqrt(kx * kx * sr * sr + cr * cr));
    if (cbN > 16300) return;
    const big = RX > RY ? RX : RY;
    if (big > 4.5) {
      CB[cbN++] = 0; CB[cbN++] = PX + RX * cr; CB[cbN++] = PY + RX * sr;
      CB[cbN++] = 2; CB[cbN++] = PX; CB[cbN++] = PY; CB[cbN++] = RX; CB[cbN++] = RY; CB[cbN++] = r;
      return;
    }
    // 小的椭圆以多边形代之（便宜得多，看不出差别）；顺时针，与其余子路径同向
    const U_ = big < 1.8 ? CIR5 : CIR8, n = U_.length >> 1;
    for (let i = 0; i < n; i++) {
      const ex = U_[2 * i] * RX, ey = U_[2 * i + 1] * RY;
      CB[cbN++] = i ? 1 : 0; CB[cbN++] = PX + ex * cr - ey * sr; CB[cbN++] = PY + ex * sr + ey * cr;
    }
  }
  const PB = new Float64Array(96);
  const circ = n => { const a = new Float64Array(2 * n); for (let i = 0; i < n; i++) { a[2 * i] = Math.cos(i / n * TAU); a[2 * i + 1] = Math.sin(i / n * TAU); } return a; };
  const CIR5 = circ(5), CIR8 = circ(8);
  function polyN(n) {
    for (let i = 0; i < n; i++) { tp(PB[2 * i], PB[2 * i + 1]); PB[2 * i] = PX; PB[2 * i + 1] = PY; }
    let area = 0;
    for (let i = 0; i < n; i++) { const j = i + 1 === n ? 0 : i + 1; area += PB[2 * i] * PB[2 * j + 1] - PB[2 * j] * PB[2 * i + 1]; }
    if (cbN + 3 * n + 2 > 16380) return;
    if (area >= 0) {
      CB[cbN++] = 0; CB[cbN++] = PB[0]; CB[cbN++] = PB[1];
      for (let i = 1; i < n; i++) { CB[cbN++] = 1; CB[cbN++] = PB[2 * i]; CB[cbN++] = PB[2 * i + 1]; }
    } else {
      CB[cbN++] = 0; CB[cbN++] = PB[2 * n - 2]; CB[cbN++] = PB[2 * n - 1];
      for (let i = n - 2; i >= 0; i--) { CB[cbN++] = 1; CB[cbN++] = PB[2 * i]; CB[cbN++] = PB[2 * i + 1]; }
    }
  }
  function quad(x0, y0, x1, y1, x2, y2, x3, y3) { PB[0] = x0; PB[1] = y0; PB[2] = x1; PB[3] = y1; PB[4] = x2; PB[5] = y2; PB[6] = x3; PB[7] = y3; polyN(4); }
  function seg(x0, y0, x1, y1, w0, w1, cap) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1e-3;
    const nx = -dy / L, ny = dx / L, a = w0 / 2, b = w1 / 2;
    quad(x0 + nx * a, y0 + ny * a, x1 + nx * b, y1 + ny * b, x1 - nx * b, y1 - ny * b, x0 - nx * a, y0 - ny * a);
    if (cap) ell(x1, y1, b, b, 0);
  }
  function limb(x0, y0, x1, y1, x2, y2, w0, w1, w2, knee) {
    let ax = x1 - x0, ay = y1 - y0; const La = Math.hypot(ax, ay) || 1e-3; ax /= La; ay /= La;
    let bx = x2 - x1, by = y2 - y1; const Lb = Math.hypot(bx, by) || 1e-3; bx /= Lb; by /= Lb;
    let kx = -(ay + by), ky = ax + bx; const kl = Math.hypot(kx, ky);
    if (kl < 1e-4) { kx = -ay; ky = ax; } else { kx /= kl; ky /= kl; }
    const a = w0 / 2, m = w1 / 2, c = w2 / 2;
    PB[0] = x0 - ay * a; PB[1] = y0 + ax * a;
    PB[2] = x1 + kx * m; PB[3] = y1 + ky * m;
    PB[4] = x2 - by * c; PB[5] = y2 + bx * c;
    PB[6] = x2 + by * c; PB[7] = y2 - bx * c;
    PB[8] = x1 - kx * m; PB[9] = y1 - ky * m;
    PB[10] = x0 + ay * a; PB[11] = y0 - ax * a;
    polyN(6);
    if (knee !== false) ell(x1, y1, m * 1.05, m * 1.05, 0);
  }
  const STR = new Float64Array(64), SP_ = new Float64Array(32);
  function strand(pts, n, w0, w1) {
    const L = Math.min(n, 16);
    for (let i = 0; i < L; i++) {
      const i0 = Math.max(0, i - 1), i1 = Math.min(L - 1, i + 1);
      const dx = pts[2 * i1] - pts[2 * i0], dy = pts[2 * i1 + 1] - pts[2 * i0 + 1];
      const d = Math.hypot(dx, dy) || 1e-3;
      const w = lerp(w0, w1, i / (L - 1)) / 2;
      STR[4 * i] = pts[2 * i] - dy / d * w; STR[4 * i + 1] = pts[2 * i + 1] + dx / d * w;
      STR[4 * i + 2] = pts[2 * i] + dy / d * w; STR[4 * i + 3] = pts[2 * i + 1] - dx / d * w;
    }
    let k = 0;
    for (let i = 0; i < L; i++) { PB[k++] = STR[4 * i]; PB[k++] = STR[4 * i + 1]; }
    for (let i = L - 1; i >= 0; i--) { PB[k++] = STR[4 * i + 2]; PB[k++] = STR[4 * i + 3]; }
    polyN(2 * L);
  }
  // 两节臂的 IK：由肩 (jx,jy) 伸向 (tx,ty)，肘向下弯（bend=1）
  let IKU = 0, IKF = 0;
  function ik(jx, jy, tx, ty, L1, L2, bend) {
    let dx = tx - jx, dy = ty - jy, d = Math.hypot(dx, dy);
    const dmax = (L1 + L2) * 0.995, dmin = Math.abs(L1 - L2) + 1e-3;
    if (d > dmax) { dx *= dmax / d; dy *= dmax / d; d = dmax; }
    if (d < dmin) { const k = dmin / (d || 1e-3); dx *= k; dy *= k; d = dmin; }
    const phi = Math.atan2(dx, dy);
    const al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    IKU = phi - bend * al;
    const ex = jx + Math.sin(IKU) * L1, ey = jy + Math.cos(IKU) * L1;
    IKF = Math.atan2(jx + dx - ex, jy + dy - ey);
  }

  // 路径的分组：按次序填色；同色而相邻的组合并为一次填充；描光时把全部回放一遍，向光偏移，以边光之色先填
  const G_KEY = [], G_A = [], G_B = [];
  let nOps = 0;
  function op(key) { if (nOps) G_B[nOps - 1] = cbN; G_KEY[nOps] = key; G_A[nOps] = cbN; nOps++; }
  function replay(ctx, a, b, dx, dy) {
    for (let i = a; i < b;) {
      const c = CB[i];
      if (c === 0) { ctx.moveTo(CB[i + 1] + dx, CB[i + 2] + dy); i += 3; }
      else if (c === 1) { ctx.lineTo(CB[i + 1] + dx, CB[i + 2] + dy); i += 3; }
      else if (c === 2) { ctx.ellipse(CB[i + 1] + dx, CB[i + 2] + dy, CB[i + 3], CB[i + 4], CB[i + 5], 0, TAU); i += 6; }
      else { ctx.closePath(); i += 1; }
    }
  }
  const COL = {}, CRGB = {};
  const CSS = new Map();
  function css(c) {
    const r = c[0] < 0 ? 0 : c[0] > 255 ? 255 : c[0] | 0, g = c[1] < 0 ? 0 : c[1] > 255 ? 255 : c[1] | 0, b = c[2] < 0 ? 0 : c[2] > 255 ? 255 : c[2] | 0;
    const k = (r << 16) | (g << 8) | b;
    let v = CSS.get(k);
    if (!v) { if (CSS.size > 4000) CSS.clear(); v = 'rgb(' + r + ',' + g + ',' + b + ')'; CSS.set(k, v); }
    return v;
  }
  function lamp(c, rgb) {
    if (LOC.a <= 0.004) return;
    const q = LOC.a * 0.9 / 255;
    c[0] = Math.min(255, c[0] + rgb[0] * LOC.r * q / 255 * 1.6);
    c[1] = Math.min(255, c[1] + rgb[1] * LOC.g * q / 255 * 1.6);
    c[2] = Math.min(255, c[2] + rgb[2] * LOC.b * q / 255 * 1.6);
  }
  function setCol(key, rgb, depth, extra, k) {
    const c = W.shade(rgb, depth, extra);
    lamp(c, rgb);
    if (k != null) { c[0] *= k; c[1] *= k; c[2] *= k; }
    CRGB[key] = c; COL[key] = css(c);
  }
  // 自带光的颜色（天使）：一部分受环境光，一部分是自身的淡金
  function lumCol(key, rgb, depth, extra, lum, k) {
    const c = W.shade(rgb, depth, extra);
    lamp(c, rgb);
    for (let i = 0; i < 3; i++) c[i] = Math.min(255, lerp(c[i], rgb[i] * (i === 2 ? 0.88 : 0.96), lum) * (k || 1));
    CRGB[key] = c; COL[key] = css(c);
  }
  function aliasCol(key, from) { COL[key] = COL[from]; CRGB[key] = CRGB[from]; }
  // 颜色每隔几帧才重算（光随时辰缓缓变化）
  const PKEYS = ['robe', 'back', 'acc', 'hair', 'arm', 'prop', 'baby', 'wing', 'wingF'];
  const AKEYS = ['body', 'head', 'far', 'dark', 'darkF', 'acc', 'pk1', 'pk2'];
  function saveCols(cc, keys, ex, dp) {
    cc = cc || { f: 0, ex: 0, dp: 0, s: {}, r: [0, 0, 0], rk: null };
    for (let i = 0; i < keys.length; i++) cc.s[keys[i]] = COL[keys[i]];
    const base = CRGB[keys[0]] || RC;
    cc.r[0] = base[0]; cc.r[1] = base[1]; cc.r[2] = base[2];
    cc.f = W.frame; cc.ex = ex; cc.dp = dp;
    return cc;
  }
  function restoreCols(cc, keys) {
    for (let i = 0; i < keys.length; i++) COL[keys[i]] = cc.s[keys[i]];
    CRGB[keys[0]] = cc.r;
  }
  const DBG = { noFill: false, noRim: false };
  const RC = [0, 0, 0];
  function flushOps(ctx, rim, baseKey, after) {
    if (nOps) G_B[nOps - 1] = cbN;
    if (DBG.noFill || !nOps) { nOps = 0; cbN = 0; return; }
    if (DBG.noRim) rim = null;
    if (rim && rim.a > 0.03) {
      const c = CRGB[baseKey] || RC, rc = rim.c, a = Math.min(1, rim.a);
      RC[0] = c[0] + (rc[0] - c[0]) * a; RC[1] = c[1] + (rc[1] - c[1]) * a; RC[2] = c[2] + (rc[2] - c[2]) * a;
      ctx.fillStyle = css(RC);
      ctx.beginPath();
      replay(ctx, 0, cbN, rim.dx, rim.dy);
      ctx.fill();
    }
    let i = 0;
    while (i < nOps) {
      const col = COL[G_KEY[i]];
      ctx.beginPath();
      let j = i;
      do { replay(ctx, G_A[j], G_B[j], 0, 0); j++; }
      while (j < nOps && COL[G_KEY[j]] === col && !(after && (G_KEY[j - 1] === 'robe' || G_KEY[j] === 'robe')));
      ctx.fillStyle = col;
      ctx.fill();
      if (after && G_KEY[j - 1] === 'robe') after(ctx);
      i = j;
    }
    nOps = 0; cbN = 0;
  }
  // 发光（胸中的灵光、天使的光）：一层画完之后统一以 lighter 叠上，少切换合成模式
  const GL = [];
  let nGL = 0;
  function glowAt(img, x, y, w, h, a) {
    if (a < 0.03 || !img) return;         // 太淡的光不画（白昼里人群的微光）
    let g = GL[nGL];
    if (!g) g = GL[nGL] = { img: null, x: 0, y: 0, w: 0, h: 0, a: 0 };
    g.img = img; g.x = x; g.y = y; g.w = w; g.h = h; g.a = a > 1 ? 1 : a;
    nGL++;
  }
  // 静止的人与牲畜：几何每隔几帧才重算一次（呼吸、张望本就缓慢），其余帧直接回放缓存的路径
  function cacheSave(p, key0, key1, key2, key3, e0, e1, e2) {
    if (nOps) G_B[nOps - 1] = cbN;
    let c = p._cc;
    if (!c || c.cb.length < cbN) c = p._cc = { _owner: p, cb: new Float64Array(Math.max(512, (cbN * 1.4) | 0)), n: 0, gk: [], ga: new Int32Array(32), gb: new Int32Array(32), gn: 0, f: 0, k0: 0, k1: 0, k2: 0, k3: 0, e0: 0, e1: 0, e2: 0 };
    if (nOps > 32) { p._cc = null; return; }
    c.cb.set(CB.subarray(0, cbN)); c.n = cbN; c.gn = nOps;
    for (let i = 0; i < nOps; i++) { c.gk[i] = G_KEY[i]; c.ga[i] = G_A[i]; c.gb[i] = G_B[i]; }
    c.f = W.frame; c.k0 = key0; c.k1 = key1; c.k2 = key2; c.k3 = key3; c.e0 = e0; c.e1 = e1; c.e2 = e2;
    // 缓存为 Path2D：之后几帧只需 fill，不必逐条回放
    c.paths = c.paths || [];
    c.pk = c.pk || [];
    c.pn = 0;
    c.union = HAS_P2D ? new Path2D() : null;
    if (!HAS_P2D) return;
    // 相邻而同色的组合成一条路径（head 与 body 同色）
    let P = null, lastK = null;
    for (let i = 0; i < nOps; i++) {
      const k = G_KEY[i] === 'head' ? 'body' : G_KEY[i];
      if (k !== lastK) { P = new Path2D(); c.paths[c.pn] = P; c.pk[c.pn] = k; c.pn++; lastK = k; }
      replay(P, G_A[i], G_B[i], 0, 0);
      replay(c.union, G_A[i], G_B[i], 0, 0);
    }
  }
  const HAS_P2D = typeof Path2D !== 'undefined';
  // 以缓存的路径填色（描光：整体向光偏移先填一遍）
  function flushCached(ctx, c, rim, baseKey) {
    nOps = 0; cbN = 0;
    if (DBG.noFill) return;
    if (!c.union) { cacheLoad(c._owner); flushOps(ctx, rim, baseKey, null); return; }
    if (DBG.noRim) rim = null;
    if (rim && rim.a > 0.03) {
      const col = CRGB[baseKey] || RC, rc = rim.c, a = Math.min(1, rim.a);
      RC[0] = col[0] + (rc[0] - col[0]) * a; RC[1] = col[1] + (rc[1] - col[1]) * a; RC[2] = col[2] + (rc[2] - col[2]) * a;
      ctx.fillStyle = css(RC);
      ctx.translate(rim.dx, rim.dy);
      ctx.fill(c.union);
      ctx.translate(-rim.dx, -rim.dy);
    }
    let last = null;
    for (let i = 0; i < c.pn; i++) {
      const col = COL[c.pk[i]];
      if (col !== last) { ctx.fillStyle = col; last = col; }
      ctx.fill(c.paths[i]);
    }
  }
  function cacheHit(p, key0, key1, key2, key3, K) {
    const c = p._cc;
    return !!c && W.frame - c.f < K && W.frame >= c.f && c.k0 === key0 && c.k1 === key1 && c.k2 === key2 && c.k3 === key3;
  }
  function cacheLoad(p) {
    const c = p._cc;
    CB.set(c.cb.subarray(0, c.n)); cbN = c.n; nOps = c.gn;
    for (let i = 0; i < nOps; i++) { G_KEY[i] = c.gk[i]; G_A[i] = c.ga[i]; G_B[i] = c.gb[i]; }
    return c;
  }
  function flushGlows(ctx) {
    if (!nGL) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < nGL; i++) { const g = GL[i]; ctx.globalAlpha = g.a; ctx.drawImage(g.img, g.x, g.y, g.w, g.h); g.img = null; }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    nGL = 0;
  }

  // ── 光晕贴图 ────────────────────────────────────────────────
  const SPR = {};
  function glowSprite(key, c, a0) {
    if (SPR[key]) return SPR[key];
    const S = 64, cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const g = cv.getContext('2d'), h = S / 2, gr = g.createRadialGradient(h, h, 0, h, h, h);
    gr.addColorStop(0, U.rgba(c[0], c[1], c[2], a0));
    gr.addColorStop(0.28, U.rgba(c[0], c[1], c[2], a0 * 0.42));
    gr.addColorStop(0.62, U.rgba(c[0], c[1], c[2], a0 * 0.1));
    gr.addColorStop(1, U.rgba(c[0], c[1], c[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, S, S);
    return (SPR[key] = cv);
  }

  // ════════════════════════════════════════════════════════════
  //  造人 / 造牲畜
  // ════════════════════════════════════════════════════════════
  function styleOf(p) {
    if (p.hairOpt) return p.hairOpt;
    if (p.angel) return 'none';
    if (p.sex === 'f') return p.age === 'child' || p.bare ? 'long' : 'veil';
    return p.age === 'elder' ? 'cloth' : 'short';
  }
  function accentOf(p) {
    if (p.accent) return p.accent;
    if (p.angel) return ANGEL_ACC;
    const st = styleOf(p);
    if (st === 'veil') return mix3(p.robe, [238, 228, 208], 0.55);
    if (st === 'cloth') return p.age === 'elder' ? [212, 204, 188] : mix3(p.robe, [230, 220, 200], 0.5);
    return mix3(p.robe, [40, 30, 24], 0.45);           // 腰带
  }
  function dress(p, o) {
    if (o.label != null) p.label = o.label;
    if (o.sex) p.sex = o.sex;
    if (o.age) p.age = o.age;
    if (o.layer != null) p.layer = o.layer;
    if (o.robe) p.robe = o.robe;
    if (o.glow != null) p.glow = o.glow;
    if (o.facing === 1 || o.facing === -1) { p.facing = o.facing; if (W.replaying) p.fd = o.facing; }
    if (o.scale) p.scale = o.scale;
    if (o.speed) p.speed = o.speed;
    if (o.v != null) p.v = o.v;
    if (o.angel != null) p.angel = !!o.angel;
    if (o.wings != null) p.wings = !!o.wings;
    if (o.bare != null) p.bare = !!o.bare;
    if (o.hair !== undefined) p.hairOpt = o.hair || null;
    if (o.beard != null) p.beardOpt = !!o.beard;
    if (o.accent !== undefined) p.accent = o.accent || null;
    if (o.prop !== undefined) p.prop = o.prop && o.prop !== 'none' ? o.prop : null;
    else if (p.propDefault && p.age === 'elder' && !p.prop) p.prop = 'staff';
    if (o.carry !== undefined) p.carry = o.carry || null;
    if (p.angel && !o.robe && !p.robeSet) p.robe = ANGEL;
    if (o.robe) p.robeSet = true;
  }

  function mk(id, o) {
    const pose = o.pose || 'stand';
    const p = {
      id, label: o.label || '', sex: o.sex || 'm', age: o.age || 'adult',
      layer: o.layer == null ? 2 : o.layer,
      nx: o.x == null ? 0.7 : o.x, tx: null, speed: o.speed || 0.035,
      facing: o.facing || 1, pose, afterWalk: 'stand',
      robe: o.robe || (o.sex === 'f' ? ROBE_F : ROBE_M),
      glow: o.glow == null ? 0.25 : o.glow,
      alpha: 0, targetAlpha: 1, emerge: 1, from: o.from || (o.angel ? 'light' : 'fade'),
      phase: Math.random() * TAU, follow: null, fdx: 0, scale: o.scale || 1,
      poseT: 1, prevPose: pose,
      // ——
      ord: ORD++, fd: o.facing || 1, v: o.v || 0, via: null, q0: new Float32Array(NP),
      gait: pose === 'walk' || pose === 'run' ? 1 : 0, run: pose === 'run' ? 1 : 0, ph: Math.random() * TAU, moved: 0, sob: 0, sobbing: false,
      prop: null, carry: null, angel: false, wings: false, bare: false, hairOpt: null, beardOpt: null, accent: null, robeSet: !!o.robe,
      propDefault: o.prop === undefined,
      ny: null, fly: null, attach: null, mount: null, hold: null, holdW: 0, embrace: null, faceTo: null, lift: 0,
      _x: 0, _y: 0, _h: 1, _k: 0, _vis: false, _seat: null,
    };
    dress(p, o);
    return p;
  }
  function mkAnimal(id, o) {
    const raw = o.kind || 'sheep', kind = ALIAS[raw] || raw, M = SPEC[kind] || SPEC.sheep;
    const pose = o.pose || 'stand';
    const a = {
      id, isAnimal: true, kind: M.key, M, label: o.label != null ? o.label : (ACN[raw] || M.cn),
      layer: o.layer == null ? 2 : o.layer, nx: o.x == null ? 0.7 : o.x, tx: null, speed: o.speed || 0.03,
      facing: o.facing || 1, fd: o.facing || 1, pose, afterWalk: 'stand',
      alpha: 0, targetAlpha: 1, emerge: 1, from: o.from || 'fade', phase: Math.random() * TAU, follow: null, fdx: 0,
      scale: (o.scale || 1) * (SMALL[raw] || 1) * (o.size || 1), poseT: 1, prevPose: pose, ord: ORD++, v: o.v || 0,
      gait: pose === 'walk' || pose === 'run' ? 1 : 0, run: pose === 'run' ? 1 : 0, ph: Math.random() * TAU, moved: 0,
      lie: pose === 'lie' ? 1 : 0, neck: pose === 'graze' ? M.grazeA : M.up, headTilt: 0, ear: 0, pitch: 0, seed: Math.random(), sex: o.sex === 'f' ? 1 : 0,
      col: o.col || (M.alt && Math.random() < 0.35 ? M.alt : M.col), col2: M.col2, acc: M.acc || M.col,
      pack: o.pack != null ? !!o.pack : M.type === 'c', speckled: !!o.speckled, look: 0, lookT: 0, lookAt: 0, earAt: 0,
      ny: null, fly: null, attach: null, mount: null, _x: 0, _y: 0, _h: 1, _k: 0, _vis: false, _seatX: 0, _seatY: 0, _seatOK: false,
      glow: 0, faceTo: null,
    };
    if (a.speckled && M.wool) a.col = [226, 218, 200];
    return a;
  }

  // ── 人物 ────────────────────────────────────────────────────
  function appear(p) {
    if (W.replaying || p.from === 'none') { p.alpha = 1; p.emerge = 1; return; }
    p.alpha = 0; p.emerge = 0;
    const x = p.nx * W.w, y = groundY(p.layer, x);
    if (!GS.fx || !isFinite(y)) return;
    const u = W.layerScale(p.layer);
    if (p.from === 'dust') GS.fx.dust(x, y, p.isAnimal ? 24 : 40, [230, 206, 162], 10 * u);
    if (p.from === 'light') GS.fx.sparkle(x, y - 20 * u, 30, [255, 244, 220], 12, PASS[p.layer]);
  }
  function add(id, o) {
    o = o || {};
    let p = people.get(id);
    if (p && !p.isAnimal) {
      dress(p, o);
      if (o.x != null) p.nx = o.x;
      if (o.pose) setPose(p, o.pose);
      p.targetAlpha = 1; p.dying = false; p.fadeOnArrive = false;
      return p;
    }
    if (p) people.delete(id);
    p = mk(id, o);
    people.set(id, p);
    appear(p);
    return p;
  }
  function animal(id, o) {
    o = o || {};
    let a = people.get(id);
    if (a && a.isAnimal) {
      if (o.x != null) { a.nx = o.x; a.tx = null; }
      if (o.layer != null) a.layer = o.layer;
      if (o.label != null) a.label = o.label;
      if (o.pack != null) a.pack = !!o.pack;
      if (o.col) a.col = o.col;
      if (o.pose) setPose(a, o.pose);
      if (o.facing === 1 || o.facing === -1) a.facing = o.facing;
      a.targetAlpha = 1; a.dying = false;
    } else {
      if (a) people.delete(id);
      a = mkAnimal(id, o);
      people.set(id, a);
      appear(a);
    }
    if (o.follow) follow(id, o.follow, o.dx == null ? 0.04 : o.dx);
    if (W.replaying) settle(a);
    return a;
  }
  function remove(id, o) {
    const p = people.get(id);
    if (!p) return;
    for (const q of people.values()) { if (q.mount === id) dismount(q, p); if (q.hold === id) q.hold = null; if (q.embrace === id) q.embrace = null; }
    if (W.replaying || (o && o.fade === false)) people.delete(id);
    else { p.targetAlpha = 0; p.dying = true; }
  }
  const has = id => people.has(id) && !people.get(id).dying;
  const get = id => people.get(id) || null;
  function place(id, x, layer) {
    const p = people.get(id); if (!p) return;
    p.nx = x; p.tx = null; p.fly = null; if (layer != null) p.layer = layer;
    if (p.pose === 'walk' || p.pose === 'run') setPose(p, p.afterWalk || 'stand');
    if (W.replaying) settleFollowers(id);
  }
  function walk(id, x, o) {
    const p = people.get(id); if (!p) return;
    o = o || {};
    if (o.layer != null) p.layer = o.layer;
    p.faceEnd = null;
    const running = o.run || (o.speed && o.speed >= 0.07);
    if (W.replaying) {
      if (Math.abs(x - p.nx) > 1e-4) p.facing = p.fd = x > p.nx ? 1 : -1;     // 看着走完时也是面朝去向
      p.nx = x; p.tx = null; p.fly = null; setPose(p, o.pose || 'stand');
      if (p.faceTo) faceNow(p);
      settleFollowers(id);
      return;
    }
    p.tx = x; p.speed = o.speed || (running ? 0.085 : p.isAnimal ? 0.03 : 0.035); p.afterWalk = o.pose || 'stand';
    p.fly = null;
    setPose(p, running ? 'run' : 'walk');
    if (Math.abs(x - p.nx) > 1e-4) p.facing = x > p.nx ? 1 : -1;
  }
  const run = (id, x, o) => walk(id, x, Object.assign({ run: true }, o || {}));
  function setPose(p, pose) {
    if (p.isAnimal) pose = animalPose(pose);
    if (p.pose === pose) return;
    if (!p.isAnimal) {
      baseQ(p, p.q0);
      const was = p.pose;
      p.via = null;
      if (!W.replaying) {
        if (LOW[pose] && !LOW[was] && was !== 'sit' && was !== 'sleep' && was !== 'kneel' && was !== 'pray' && was !== 'seat') p.via = pose === 'fall' ? 'kneel' : 'sit';
        else if (LOW[was] && !LOW[pose] && pose !== 'sit' && pose !== 'sleep' && pose !== 'kneel' && pose !== 'pray') p.via = was === 'fall' ? 'kneel' : 'sit';
      }
    }
    p.prevPose = p.pose; p.pose = pose; p.poseT = W.replaying ? 1 : 0;
    if (W.replaying) {
      p.gait = pose === 'walk' || pose === 'run' ? 1 : 0; p.run = pose === 'run' ? 1 : 0;
      if (p.isAnimal) { p.lie = pose === 'lie' ? 1 : 0; p.neck = pose === 'graze' ? p.M.grazeA : p.M.up; }
    }
  }
  function animalPose(ps) {
    if (ps === 'walk' || ps === 'run' || ps === 'lie' || ps === 'graze' || ps === 'stand') return ps;
    if (ps === 'sit' || ps === 'sleep' || ps === 'kneel' || ps === 'fall' || ps === 'pray') return 'lie';
    if (ps === 'bow') return 'graze';
    return 'stand';
  }
  // 正在走路时改姿势：走到了再换（与"瞬间重演"时的结果一致）；o.stop 则立即停步
  function pose(id, ps, o) {
    const p = people.get(id); if (!p) return;
    o = o || {};
    if (o.weep != null) p.sobbing = !!o.weep;
    else if (ps !== 'embrace' && ps !== 'fall' && ps !== 'kneel' && ps !== 'bow' && ps !== 'weep') p.sobbing = false;
    if (ps === 'run' && p.tx != null && !W.replaying) { p.speed = Math.max(p.speed, 0.085); setPose(p, 'run'); return; }
    if (p.tx != null && !o.stop && !W.replaying) { p.afterWalk = ps; return; }
    // 重演时（下一句话提前成就）：正走着的先走到，再换姿势——与看完时一样
    if (p.tx != null && !o.stop && W.replaying) { p.nx = p.tx; if (p.faceTo) faceNow(p); p.fd = p.facing; settleFollowers(p.id); }
    p.tx = null; endFace(p); setPose(p, ps);
    if (ps === 'embrace' && W.replaying && !p.isAnimal) closeGap(p, true);
  }
  // face(id, 1 | -1)：朝右 / 朝左；face(id, 0.3)：朝向画面比例 0.3 处；face(id, 'eve')：朝向某人
  function face(id, d) {
    const p = people.get(id); if (!p) return;
    // 正走着时转身：走到了再转（与"瞬间重演"时的结果一致）
    if (p.tx != null && !W.replaying) { p.faceEnd = d; return; }
    p.faceEnd = null;
    faceDir(p, d);
  }
  function faceDir(p, d) {
    if (d === 1 || d === -1) p.facing = d;
    else if (typeof d === 'number') p.facing = d >= p.nx ? 1 : -1;
    else if (typeof d === 'string' && people.get(d)) p.facing = people.get(d).nx >= p.nx ? 1 : -1;
    if (W.replaying) p.fd = p.facing;
  }
  function endFace(p) {
    if (p.faceEnd == null) return;
    const d = p.faceEnd; p.faceEnd = null;
    faceDir(p, d);
  }
  function faceNow(p) {
    const o = people.get(p.faceTo);
    if (o && Math.abs(o.nx - p.nx) > 1e-4) p.facing = o.nx >= p.nx ? 1 : -1;
    p.faceTo = null;
    if (W.replaying) p.fd = p.facing;
  }
  function follow(id, other, dx) {
    const p = people.get(id); if (!p) return;
    p.follow = other; p.fdx = dx == null ? -0.03 : dx;
    if (W.replaying) settle(p);
  }
  function glow(id, v) { const p = people.get(id); if (p) p.glow = v; }
  function clear(o) { for (const id of Array.from(people.keys())) remove(id, o); for (const g of Array.from(crowds.keys())) removeCrowd(g, o); }
  function prop(id, kind) { const p = people.get(id); if (p && !p.isAnimal) { p.prop = kind && kind !== 'none' ? kind : null; p.propDefault = false; } }
  function carry(id, what) { const p = people.get(id); if (p && !p.isAnimal) p.carry = what || null; }
  function holdHands(a, b, on) {
    const A = people.get(a), B = people.get(b);
    if (on === false) { if (A && A.hold === b) A.hold = null; if (B && B.hold === a) B.hold = null; return; }
    if (A) A.hold = b; if (B) B.hold = a;
    if (W.replaying) { if (A) A.holdW = 1; if (B) B.holdW = 1; }
  }
  // 相拥：二人相向走近（或奔跑）到相距约四分之一身高，面对面，同时换成 embrace
  function embrace(a, b, o) {
    const A = people.get(a), B = people.get(b); if (!A || !B) return;
    o = o || {};
    A.embrace = b; B.embrace = a;
    if (o.weep != null) { A.sobbing = B.sobbing = !!o.weep; }
    const h = 34 * W.layerScale(A.layer) * boost();
    const gap = (h * 0.3) / Math.max(1, W.w);
    // 重演时，正在走的人按其去处来算（与看着走完一致）
    const ax = W.replaying && A.tx != null ? A.tx : A.nx, bx = W.replaying && B.tx != null ? B.tx : B.nx;
    const left = ax <= bx ? A : B, right = left === A ? B : A;
    const mid = o.at != null ? o.at : (ax + bx) / 2;
    const go = (p, x, dir) => {
      p.faceTo = (p === A ? b : a);
      if (Math.abs(p.nx - x) < 0.004 || W.replaying) { p.nx = x; p.tx = null; p.facing = dir; if (W.replaying) p.fd = dir; setPose(p, 'embrace'); p.faceTo = null; }
      else walk(p.id, x, { pose: 'embrace', run: o.run, speed: o.speed });
    };
    go(left, mid - gap / 2, 1);
    go(right, mid + gap / 2, -1);
  }
  // 两人都在 embrace 而相隔尚远：各走半程，相向而拥（重演时立即到位）
  function embracePartner(p) {
    const e = p.embrace && people.get(p.embrace);
    if (e && !e.isAnimal && (e.pose === 'embrace' || (e.tx != null && e.afterWalk === 'embrace'))) return e;
    let best = null, bd = 0.25;
    for (const q of people.values()) {
      if (q === p || q.isAnimal || q.dying || q.layer !== p.layer || q.pose !== 'embrace') continue;
      const d = q.nx - p.nx, ad = Math.abs(d);
      if (ad < bd && Math.sign(d) === p.facing && q.facing === -p.facing) { bd = ad; best = q; }
    }
    return best;
  }
  function closeGap(p, instant) {
    const e = embracePartner(p); if (!e || e.tx != null) return;     // 对方还在走来：等他到了再说
    const gap = scaleOf(p) * 0.3 / Math.max(1, W.w);
    const d = e.nx - p.nx, s = Math.sign(d) || p.facing;
    if (Math.abs(d) <= gap * 1.5) return;
    const mid = (p.nx + e.nx) / 2;
    if (instant) {
      p.nx = mid - s * gap / 2; e.nx = mid + s * gap / 2; p.tx = e.tx = null;
      p.facing = p.fd = s; e.facing = e.fd = -s;
      return;
    }
    for (const [q, x, dir, o] of [[p, mid - s * gap / 2, s, e], [e, mid + s * gap / 2, -s, p]]) {
      if (q.tx != null || q.mount) continue;
      q.tx = x; q.afterWalk = 'embrace'; q.faceTo = o.id; q.speed = Math.max(q.speed, 0.035);
      setPose(q, 'walk'); q.facing = dir;
    }
  }
  function dismount(p, m) {
    p.mount = null; p._seat = null;
    if (m) { p.nx = m.nx - 0.018 * (m.facing || 1); p.layer = m.layer; }
    setPose(p, 'stand');
  }
  function ride(id, mountId) {
    const p = people.get(id); if (!p || p.isAnimal) return;
    if (!mountId) { const m = p.mount && people.get(p.mount); if (p.mount) dismount(p, m); return; }
    const m = people.get(mountId); if (!m) return;
    p.mount = mountId; p.tx = null; p.follow = null; p.fly = null;
    p.nx = m.nx; p.layer = m.layer; p.facing = m.facing; p.fd = m.fd;
    setPose(p, 'ride');
  }
  function fly(id, x, y, o) {
    const p = people.get(id); if (!p) return;
    o = o || {};
    if (x == null) x = p.nx;
    const land = y == null;
    if (W.replaying) {
      p.fly = null; p.tx = null; p.nx = x; p.ny = land ? null : y;
      if (o.pose) setPose(p, o.pose);
      return;
    }
    const y0 = p.ny != null ? p.ny : footY(p) / W.h;
    const y1 = land ? groundY(p.layer, x * W.w) / W.h : y;
    const dist = Math.hypot((x - p.nx) * W.w, (y1 - y0) * W.h);
    p.fly = { x0: p.nx, y0, x1: x, y1: land ? null : y, land, t: 0, dur: o.dur || Math.max(1.5, dist / (60 * Math.max(0.4, W.unit))), pose: o.pose || null };
    p.tx = null;
    if (Math.abs(x - p.nx) > 1e-3) p.facing = x > p.nx ? 1 : -1;
  }
  function attach(id, fn) { const p = people.get(id); if (p) p.attach = typeof fn === 'function' ? fn : null; }

  // 重演时：跟随者也立即到位
  function followWant(p, o) { return o.nx + p.fdx * (o.facing || 1) * -1; }
  function settle(p) {
    if (!p.follow) return;
    const o = people.get(p.follow);
    if (!o) return;
    const want = followWant(p, o);
    if (Math.abs(want - p.nx) > 0.012 || p.tx != null) { p.nx = want; p.tx = null; p.layer = o.layer; }
    if (p.pose === 'walk' || p.pose === 'run') setPose(p, p.afterWalk && p.afterWalk !== 'walk' ? p.afterWalk : 'stand');
    p.fd = p.facing;
  }
  function settleFollowers(id, depth) {
    if ((depth || 0) > 8) return;
    for (const q of people.values()) if (q.follow === id) { settle(q); settleFollowers(q.id, (depth || 0) + 1); }
  }

  // ── 人群 / 畜群 ─────────────────────────────────────────────
  function crowd(gid, o) {
    o = o || {};
    const n = o.n || 12, members = [];
    for (let i = 0; i < n; i++) {
      const sex = Math.random() < 0.5 ? 'm' : 'f', r = Math.random();
      const m = mk(gid + ':' + i, {
        label: o.label || '', sex, age: r < 0.18 ? 'child' : r < 0.26 ? 'elder' : 'adult',
        layer: o.layer == null ? 2 : o.layer, x: lerp(o.x0 == null ? 0.55 : o.x0, o.x1 == null ? 0.95 : o.x1, (i + Math.random()) / n),
        facing: Math.random() < 0.5 ? 1 : -1, pose: o.pose || 'stand', robe: o.robe || U.pick(CROWD_ROBES),
        glow: o.glow == null ? 0.08 : o.glow, scale: 0.9 + Math.random() * 0.15, prop: o.prop !== undefined ? o.prop : null,
        accent: sex === 'f' ? U.pick(CROWD_ACC) : null, v: o.v != null ? o.v : Math.random() * 0.1,
      });
      m.crowd = gid;
      if (W.replaying || o.from === 'none') { m.alpha = 1; m.emerge = 1; } else { m.alpha = 0; m.emerge = 0; m.delay = Math.random() * 1.5; }
      m.mill = o.mill !== false;
      members.push(m);
    }
    crowds.set(gid, { members, o });
    return members;
  }
  function herd(gid, o) {
    o = o || {};
    const n = o.n || 8, members = [];
    for (let i = 0; i < n; i++) {
      const a = mkAnimal(gid + ':' + i, {
        kind: o.kind || 'sheep', layer: o.layer == null ? 2 : o.layer, label: o.label,
        x: lerp(o.x0 == null ? 0.6 : o.x0, o.x1 == null ? 0.9 : o.x1, (i + Math.random()) / n),
        facing: Math.random() < 0.5 ? 1 : -1, pose: o.pose || (Math.random() < 0.6 ? 'graze' : 'stand'),
        speckled: o.speckled ? (o.speckled === true ? true : Math.random() < o.speckled) : false, col: o.col, pack: o.pack,
        size: 0.9 + Math.random() * 0.16, v: o.v != null ? o.v : Math.random() * 0.12,
      });
      a.crowd = gid;
      if (W.replaying || o.from === 'none') { a.alpha = 1; a.emerge = 1; } else { a.alpha = 0; a.emerge = 0; a.delay = Math.random() * 1.5; }
      a.mill = o.mill !== false;
      members.push(a);
    }
    crowds.set(gid, { members, o, herd: true });
    return members;
  }
  function crowdWalk(gid, x0, x1, o) {
    const g = crowds.get(gid); if (!g) return;
    g.members.forEach((m, i) => {
      const x = lerp(x0, x1, (i + Math.random()) / g.members.length);
      if (W.replaying) { if (Math.abs(x - m.nx) > 1e-4) m.facing = m.fd = x > m.nx ? 1 : -1; m.nx = x; m.tx = null; setPose(m, (o && o.pose) || (m.isAnimal ? 'graze' : 'stand')); }
      else {
        m.tx = x; m.speed = (o && o.speed) || 0.03 + Math.random() * 0.01; m.afterWalk = (o && o.pose) || (m.isAnimal ? 'graze' : 'stand');
        setPose(m, o && o.run ? 'run' : 'walk'); m.facing = x >= m.nx ? 1 : -1;
      }
    });
  }
  function crowdPose(gid, ps) { const g = crowds.get(gid); if (g) g.members.forEach(m => { m.tx = null; setPose(m, ps); }); }
  // 四散：各往远处走去，渐渐隐没（巴别）
  function scatter(gid) {
    const g = crowds.get(gid); if (!g) return;
    g.members.forEach(m => {
      const x = m.nx < 0.75 ? rand(-0.1, 0.35) : rand(0.85, 1.12);
      if (W.replaying) { m.dying = true; m.alpha = 0; }
      else { m.tx = x; m.speed = 0.04 + Math.random() * 0.03; setPose(m, 'walk'); m.facing = x >= m.nx ? 1 : -1; m.fadeOnArrive = true; m.mill = false; }
    });
  }
  function removeCrowd(gid, o) {
    const g = crowds.get(gid); if (!g) return;
    if (W.replaying || (o && o.fade === false)) crowds.delete(gid);
    else g.members.forEach(m => { m.targetAlpha = 0; m.dying = true; });
  }

  // ════════════════════════════════════════════════════════════
  //  更新
  // ════════════════════════════════════════════════════════════
  function scaleOf(p) {
    if (p.isAnimal) return W.layerScale(p.layer) * boost() * actK(p.layer) * p.scale * (1 + 0.35 * p.v);
    return 34 * W.layerScale(p.layer) * (AGE_H[p.age] || 1) * p.scale * boost() * actK(p.layer) * (1 + 0.35 * p.v);
  }
  function footY(p) {
    const x = p.nx * W.w, g = groundY(p.layer, x);
    return p.v ? g + p.v * fieldH(p.layer, g) * 0.8 : g;
  }
  function step(p, dt) {
    if (p.delay > 0) { p.delay -= dt; return; }
    p.alpha = U.approach(p.alpha, p.targetAlpha, p.dying ? 1.2 : 1.6, dt);
    if (p.emerge < 1) p.emerge = Math.min(1, p.emerge + dt / 1.6);
    if (p.poseT < 1) { p.poseT = Math.min(1, p.poseT + dt / (p.via ? 1.4 : 0.7)); if (p.poseT >= 1) p.via = null; }
    // 骑乘：随坐骑而动
    if (p.mount) {
      const m = people.get(p.mount);
      if (!m) { p.mount = null; setPose(p, 'stand'); }
      else { p.nx = m.nx; p.layer = m.layer; p.facing = m.facing; p.fd = m.fd; p.v = m.v; p.tx = null; if (p.pose !== 'ride') setPose(p, 'ride'); }
    }
    if (p.attach) {
      const r = U.safe('cast.attach', () => p.attach());
      if (r && isFinite(r[0]) && isFinite(r[1])) { p.nx = r[0] / W.w; p._ax = r[0]; p._ay = r[1]; } else p._ax = null;
    }
    if (p.follow && !p.mount) {
      const o = people.get(p.follow);
      if (o) {
        const want = followWant(p, o);
        const d = Math.abs(want - p.nx);
        if (d > 0.012) {
          p.tx = want;
          const runLead = o.pose === 'run' || (o.speed || 0) >= 0.07;
          p.speed = Math.max(0.03, o.speed || 0.035) * (d > 0.08 ? 1.35 : 1);
          const gp = runLead ? 'run' : 'walk';
          if (p.pose !== gp) setPose(p, gp);
        }
      }
    }
    p.moved = 0;
    if (p.fly) {
      const F = p.fly;
      F.t = Math.min(1, F.t + dt * fastK() / F.dur);
      const e = ease(F.t);
      const y1 = F.land ? groundY(p.layer, F.x1 * W.w) / W.h : F.y1;
      p.nx = lerp(F.x0, F.x1, e); p.ny = lerp(F.y0, y1, e);
      if (F.t >= 1) { p.fly = null; p.nx = F.x1; p.ny = F.land ? null : F.y1; if (F.pose) setPose(p, F.pose); }
    } else if (p.tx != null) {
      const d = p.tx - p.nx, v = p.speed * dt * fastK();
      if (Math.abs(d) <= v) {
        p.moved = Math.abs(d);
        p.nx = p.tx; p.tx = null; setPose(p, p.afterWalk || 'stand');
        if (p.faceTo) faceNow(p);
        endFace(p);
        if (p.fadeOnArrive) { p.targetAlpha = 0; p.dying = true; }
      } else { p.nx += Math.sign(d) * v; p.moved = v; p.facing = Math.sign(d) || p.facing; }
    } else if (p.mill && !W.ritual.holding && Math.random() < dt * (p.isAnimal ? 0.07 : 0.05)) {
      // 人群里的人偶尔挪动几步；羊群慢慢移着吃草
      walkM(p, clamp(p.nx + rand(-0.03, 0.03), 0.02, 0.98));
    }
    if (p.pose === 'embrace' && p.tx == null && !p.isAnimal && !p.mount && ((W.frame + p.ord) % 12 === 0)) closeGap(p, false);
    // 神言说时，站着的人转向神的灵
    if (W.ritual.holding && !p.isAnimal && p.tx == null && !p.mount && !p.fly && UPRIGHT[p.pose] && p.pose !== 'wrestle' && p.pose !== 'embrace' && p.pose !== 'weep') {
      p.facing = W.spirit.x >= p.nx * W.w ? 1 : -1;
    }
    // 转身：由侧影经过正面（窄）再到另一侧
    if (p.fd !== p.facing) {
      const k = dt * 7;
      p.fd = Math.abs(p.facing - p.fd) <= k ? p.facing : p.fd + Math.sign(p.facing - p.fd) * k;
    }
    // 步伐：相位随移动的距离推进，脚不打滑
    const h = scaleOf(p);
    const gp = p.pose === 'walk' || p.pose === 'run';
    p.gait = approach(p.gait, gp ? 1 : 0, 6, dt);
    p.run = approach(p.run, p.pose === 'run' ? 1 : 0, 4, dt);
    if (p.isAnimal) {
      const M = p.M, stride = Math.max(1, (M.stride || 8) * h * (1 + 0.5 * p.run));
      if (p.moved > 0) p.ph += Math.PI * (p.moved * W.w) / stride;
      else if (gp) p.ph += dt * (5 + 4 * p.run);
      stepAnimal(p, dt);
    } else {
      const stride = Math.max(1, (0.34 + 0.34 * p.run) * h);
      if (p.moved > 0) p.ph += Math.PI * (p.moved * W.w) / stride;
      else if (gp) p.ph += dt * (6 + 4 * p.run) * fastK();
      p.sob = approach(p.sob, p.pose === 'weep' || p.sobbing ? 1 : 0, 2.2, dt);
      if (p.dying && p.angel) p.lift += dt * 0.35;
    }
  }
  function walkM(m, x) {
    m.tx = x; m.speed = m.isAnimal ? 0.008 : 0.015;
    m.afterWalk = m.pose === 'walk' ? 'stand' : m.pose;
    setPose(m, 'walk');
  }
  function stepAnimal(a, dt) {
    const M = a.M;
    a.lie = approach(a.lie, a.pose === 'lie' ? 1 : 0, 1.6, dt);
    // 站着时偶尔抬头、张望；吃草时低头
    if (W.t > a.lookAt) { a.lookAt = W.t + rand(2, 6); a.lookT = rand(-0.2, 0.3); }
    let nt = M.up + a.lookT * (a.pose === 'stand' ? 1 : 0.2);
    if (a.pose === 'graze') nt = M.grazeA + Math.sin(W.t * 0.8 + a.seed * 9) * 0.06;
    else if (a.pose === 'walk' || a.pose === 'run') nt = M.up - 0.08 - 0.15 * a.run;
    else if (a.pose === 'lie') nt = M.up + 0.1;
    a.neck = approach(a.neck, nt, 2.2, dt);
    if (W.t > a.earAt) { a.earAt = W.t + rand(1.5, 5); a.ear = 0.6; }
    a.ear = approach(a.ear, 0, 5, dt);
    // 畜群：时而吃草，时而站立
    if (a.mill && a.tx == null && Math.random() < dt * 0.06 && (a.pose === 'graze' || a.pose === 'stand')) setPose(a, a.pose === 'graze' ? 'stand' : 'graze');
  }

  function update(dt) {
    updLight();
    for (const [id, p] of people) { step(p, dt); if (p.dying && p.alpha < 0.01) people.delete(id); }
    for (const [gid, g] of crowds) {
      for (let i = 0; i < g.members.length; i++) step(g.members[i], dt);
      g.members = g.members.filter(m => !(m.dying && m.alpha < 0.01));
      if (!g.members.length) crowds.delete(gid);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  姿势的求值
  // ════════════════════════════════════════════════════════════
  function mixV(a, b, t, out) { for (let i = 0; i < NP; i++) out[i] = a[i] + (b[i] - a[i]) * t; return out; }
  // 成群的人（不是走兽）下拜：跪伏；单独的人仍是鞠躬
  const crowdPoseName = (p, n) => (n === 'bow' && p.crowd && !p.isAnimal ? 'worship' : n);
  function baseQ(p, out) {
    const tgt = poseVec(crowdPoseName(p, p.pose));
    if (p.poseT >= 1) { out.set(tgt); return out; }
    const t = p.poseT;
    if (p.via) {
      const v = poseVec(crowdPoseName(p, p.via));
      return t < 0.5 ? mixV(p.q0, v, ease(t * 2), out) : mixV(v, tgt, ease(t * 2 - 1), out);
    }
    return mixV(p.q0, tgt, ease(t), out);
  }
  const Q = new Float32Array(NP);
  function computeQ(p) {
    baseQ(p, Q);
    const A = p.age === 'child' ? PR.child : PR.adult;
    const up = Q[GRD];
    const upright = 1 - Math.min(1, Math.abs(Q[ROT]) / 1.2);
    // 长者：微驼，屈膝
    if (p.age === 'elder') {
      Q[LEAN] += 0.15 * upright; Q[HEAD] += 0.12 * upright;
      Q[NTH] += 0.07 * up; Q[FTH] += 0.07 * up; Q[NSH] -= 0.04 * up; Q[FSH] -= 0.06 * up;
    }
    // 天使：两臂微张，掌心向前
    if (p.angel && p.pose === 'stand') { Q[NUA] += 0.2 * upright; Q[NFA] += 0.45 * upright; Q[FUA] -= 0.12 * upright; Q[FFA] += 0.25 * upright; Q[HEAD] -= 0.05; }
    // 呼吸
    const br = Math.sin(W.t * 1.7 + p.phase);
    p._br = br;
    Q[HEAD] += 0.012 * br + 0.05 * U.noise1(W.t * 0.23 + p.phase * 7) * upright;
    Q[FUA] += 0.015 * br; Q[NUA] -= 0.012 * br;
    // 步态（与 beasts.js 同法：摆动时屈膝，臂与腿相反）
    const g = p.gait, r = p.run;
    if (g > 0.01) {
      const s = Math.sin(p.ph), c = Math.cos(p.ph);
      const A0 = (0.36 + 0.26 * r) * g * (p.age === 'elder' ? 0.72 : 1);
      Q[NTH] += A0 * s; Q[FTH] -= A0 * s;
      Q[NSH] = Q[NTH] - (0.72 + 0.7 * r) * g * Math.max(0, c) - 0.04 * g;
      Q[FSH] = Q[FTH] - (0.72 + 0.7 * r) * g * Math.max(0, -c) - 0.04 * g;
      const aw = (0.34 + 0.3 * r) * g;
      Q[NUA] += -aw * s; Q[FUA] += aw * s;
      Q[NFA] = Q[NUA] + lerp(0.22, 1.35, r) * g + 0.08;
      Q[FFA] = Q[FUA] + lerp(0.22, 1.2, r) * g + 0.08;
      Q[LEAN] += 0.04 * g * Math.abs(c) * (1 + r);
    }
    // 哭泣：双肩抽动
    if (p.sob > 0.01) {
      const env = 0.55 + 0.45 * Math.sin(W.t * 0.9 + p.phase);
      const sh = Math.sin(W.t * 10 + p.phase * 3) * p.sob * env;
      Q[LEAN] += 0.03 * sh; Q[HEAD] += 0.05 * sh + 0.08 * p.sob;
    }
    // 摔跤：来回角力
    if (p.pose === 'wrestle') {
      const w = Math.sin(W.t * 1.3) * (p.fd > 0 ? 1 : -1);
      Q[LEAN] += 0.08 * w; Q[NTH] += 0.08 * w; Q[FTH] -= 0.05 * w;
    }
    if (p.pose === 'embrace') Q[LEAN] += 0.02 * Math.sin(W.t * 1.1 + p.phase);
    // 怀中之物 / 手中之物：覆盖手臂
    const armFree = upright > 0.5 && p.pose !== 'pray' && p.pose !== 'raise' && p.pose !== 'wrestle' && p.pose !== 'embrace' && p.pose !== 'point' && p.pose !== 'weep';
    if (p.carry && armFree) {
      const k = upright;
      Q[NUA] = lerp(Q[NUA], 0.45, k); Q[NFA] = lerp(Q[NFA], 1.9, k);
      Q[FUA] = lerp(Q[FUA], 0.34, k); Q[FFA] = lerp(Q[FFA], 1.8, k);
    } else if (p.prop && armFree && up > 0.5) {
      const s = g > 0.01 ? Math.sin(p.ph) : 0;
      if (p.prop === 'staff' || p.prop === 'spear') { Q[NUA] = 0.34 + 0.1 * s * g; Q[NFA] = 0.62 + 0.06 * s * g; }
      else if (p.prop === 'blade') { Q[NUA] = 0.42 + 0.06 * s * g; Q[NFA] = 1.0; }
      else if (p.prop === 'torch') { Q[NUA] = 0.95; Q[NFA] = 1.95; }
      else if (p.prop === 'sword') { Q[NUA] = 2.2; Q[NFA] = 2.6; }
    }
    // 髋高：双脚踏地（由腿长求出，脚不陷、不浮）
    if (up > 0.001) {
      const lh = Math.max(A.TH * Math.cos(Q[NTH]) + A.SH * Math.cos(Q[NSH]), A.TH * Math.cos(Q[FTH]) + A.SH * Math.cos(Q[FSH]));
      Q[HIP] = lerp(Q[HIP], lh, up);
    }
    // 言说时，站着的人仰首向灵
    if (W.ritual.holding && upright > 0.5 && p.tx == null && p.pose !== 'bow' && p.pose !== 'weep') {
      const dy = (p._y - p._h * 0.9) - W.spirit.y;
      Q[HEAD] -= clamp(dy / (Math.abs(W.spirit.x - p._x) + p._h * 2), -0.2, 0.5) * 0.6 * W.ritual.charge;
    }
    return Q;
  }

  // ════════════════════════════════════════════════════════════
  //  画人：以髋为原点，身高 h 为单位
  // ════════════════════════════════════════════════════════════
  const HOLD_OK = { stand: 1, walk: 1, run: 1, gaze: 1 };
  function buildPerson(p, Q, lo) {
    const A = p.age === 'child' ? PR.child : PR.adult;
    const woman = p.sex === 'f', child = p.age === 'child', elder = p.age === 'elder';
    const lean = Q[LEAN];
    p._lean = lean;
    const ux = Math.sin(lean), uy = -Math.cos(lean);          // 躯干向上
    const fx = Math.cos(lean), fy = Math.sin(lean);           // 躯干向前
    const Tl = A.T * (1 + 0.012 * (p._br || 0));
    const sx = ux * Tl, sy = uy * Tl;                         // 肩
    const ha = lean + Q[HEAD];
    const hux = Math.sin(ha), huy = -Math.cos(ha), hfx = Math.cos(ha), hfy = Math.sin(ha);
    const hr = A.HR;
    const nbx = sx + ux * A.NK, nby = sy + uy * A.NK;
    const hcx = nbx + hux * hr * 0.95, hcy = nby + huy * hr * 0.95;
    const WK = A.W * (child ? 1 : 1);
    // 腿
    const nkx = 0.008 + Math.sin(Q[NTH]) * A.TH, nky = Math.cos(Q[NTH]) * A.TH;
    const nfx = nkx + Math.sin(Q[NSH]) * A.SH, nfy = nky + Math.cos(Q[NSH]) * A.SH;
    const fkx = -0.008 + Math.sin(Q[FTH]) * A.TH, fky = Math.cos(Q[FTH]) * A.TH;
    const ffx = fkx + Math.sin(Q[FSH]) * A.SH, ffy = fky + Math.cos(Q[FSH]) * A.SH;
    // 臂：肩关节
    const jnx = sx - ux * 0.028 + fx * 0.006, jny = sy - uy * 0.028 + fy * 0.006;
    const jfx = sx - ux * 0.028 - fx * 0.016, jfy = sy - uy * 0.028 - fy * 0.016;
    let nUa = Q[NUA], nFa = Q[NFA], fUa = Q[FUA], fFa = Q[FFA];
    // 牵手 / 相拥 / 角力 / 肩上的瓶：伸向世界中的某一点
    if (p._tN && p._wN > 0.01) { inv(p._tN[0], p._tN[1]); ik(jnx, jny, IX, IY, A.UA, A.FA, 1); nUa = angLerp(nUa, IKU, p._wN); nFa = angLerp(nFa, IKF, p._wN); }
    if (p._tF && p._wF > 0.01) { inv(p._tF[0], p._tF[1]); ik(jfx, jfy, IX, IY, A.UA, A.FA, 1); fUa = angLerp(fUa, IKU, p._wF); fFa = angLerp(fFa, IKF, p._wF); }
    const upright = 1 - Math.min(1, Math.abs(Q[ROT]) / 1.2);
    const grounded = Q[GRD] > 0.5 && upright > 0.8;
    const jarOn = p.prop === 'jar' && grounded && !p.carry && !HOLD_OK_BUSY(p);
    if (jarOn) {
      const jx = sx - fx * 0.05 + ux * 0.075, jy = sy - fy * 0.05 + uy * 0.075;
      ik(jfx, jfy, jx + fx * 0.02 + ux * 0.03, jy + fy * 0.02 + uy * 0.03, A.UA, A.FA, 1);
      fUa = IKU; fFa = IKF;
    }
    const sl = p.angel || elder ? 1.12 : 1;                     // 袖宽
    const hands = !lo && T.s >= 22;
    const arm = (jx, jy, ua, fa, bare, near) => {
      const ex = jx + Math.sin(ua) * A.UA, ey = jy + Math.cos(ua) * A.UA;
      const hx = ex + Math.sin(fa) * A.FA, hy = ey + Math.cos(fa) * A.FA;
      if (bare) limb(jx, jy, ex, ey, hx, hy, 0.052 * WK, 0.04 * WK, 0.03 * WK);
      else limb(jx, jy, ex, ey, hx, hy, 0.068 * WK * sl, 0.054 * WK * sl, 0.046 * WK * sl);
      if (hands) ell(hx + Math.sin(fa) * 0.014, hy + Math.cos(fa) * 0.014, 0.02 * WK, 0.024 * WK, -fa);
      if (near) { HN[0] = hx; HN[1] = hy; HN[2] = fa; } else { HF[0] = hx; HF[1] = hy; }
    };
    const foot = (kx, ky, fxx, fyy, sh) => {
      const dx = Math.cos(sh), dy = -Math.sin(sh);
      seg(fxx - dx * 0.008, fyy - dy * 0.008 - 0.004, fxx + dx * 0.052, fyy + dy * 0.052 - 0.002, 0.03 * WK, 0.018 * WK);
    };
    const style = styleOf(p);
    const bare = p.bare && !p.angel;
    const robeK = bare ? 0 : p.angel ? 0.97 : woman ? (child ? 0.72 : 0.97) : child ? 0.3 : elder ? 0.85 : 0.55;
    const hemN = [nkx + Math.sin(Q[NSH]) * A.SH * robeK, nky + Math.cos(Q[NSH]) * A.SH * robeK];
    const hemF = [fkx + Math.sin(Q[FSH]) * A.SH * robeK, fky + Math.cos(Q[FSH]) * A.SH * robeK];
    const headParts = () => {
      seg(sx - ux * 0.012, sy - uy * 0.012, hcx - hux * hr * 0.6, hcy - huy * hr * 0.6, 0.046 * WK, 0.04 * WK);
      ell(hcx, hcy, hr * 0.94, hr * 1.05, ha);
      if (!lo) ell(hcx + hfx * hr * 0.36 - hux * hr * 0.22, hcy + hfy * hr * 0.36 - huy * hr * 0.22, hr * 0.6, hr * 0.62, ha);
    };

    const backLoad = (p.prop === 'wood' || p.prop === 'bundle') && !p.carry;
    const armSep = !!p.carry || (p.prop === 'coat' && !p.angel);
    // ── 远侧的翼 ──
    if (p.wings) { op('wingF'); wing(p, sx, sy, ux, uy, fx, fy, -0.34); }
    // ── 发（长发垂于背后；近处的男子头后一片短发）──
    const capHair = style === 'short' && !lo && T.s >= 24;
    if (style === 'long' || capHair) {
      op('hair');
      if (style === 'long') {
        const L = hr * (child ? 2.6 : 3.4), wind = (W.wind || 0) * 0.4 * (p.fd < 0 ? 1 : -1) - 0.2 * p.gait;
        for (let i = 0; i < 6; i++) {
          const t = i / 5;
          SP_[2 * i] = hcx - hfx * hr * (0.35 + 0.55 * t) - hux * L * t * 0.95 + wind * t * t * hr + Math.sin(W.t * 1.3 + p.phase * 9 + t * 2) * 0.12 * t * hr;
          SP_[2 * i + 1] = hcy - hfy * hr * (0.35 + 0.55 * t) - huy * L * t * 0.95;
        }
        strand(SP_, 6, hr * 1.7, hr * 0.6);
        ell(hcx - hfx * hr * 0.16 + hux * hr * 0.1, hcy - hfy * hr * 0.16 + huy * hr * 0.1, hr * 1.1, hr * 1.12, ha);
      } else ell(hcx - hfx * hr * 0.2 + hux * hr * 0.16, hcy - hfy * hr * 0.2 + huy * hr * 0.16, hr * 1.02, hr * 1.0, ha);
    }
    // ── 袍后：远侧的臂与腿；（着衣者）颈、头、近侧的小腿 ──
    op('back');
    arm(jfx, jfy, fUa, fFa, bare, false);
    if (bare) { limb(-0.008, 0, fkx, fky, ffx, ffy, 0.1 * WK, 0.066 * WK, 0.042 * WK); if (!lo) foot(fkx, fky, ffx, ffy, Q[FSH]); }
    else {
      if (robeK < 0.95) seg(hemF[0], hemF[1], ffx, ffy, 0.044 * WK, 0.034 * WK);
      if (!lo || robeK < 0.95) foot(fkx, fky, ffx, ffy, Q[FSH]);
      headParts();
      if (robeK < 0.95) seg(hemN[0], hemN[1], nfx, nfy, 0.046 * WK, 0.035 * WK);
      foot(nkx, nky, nfx, nfy, Q[NSH]);
    }
    // ── 背上的负载（在躯干之后）──
    if (backLoad && upright > 0.5) { op('prop'); backProp(p.prop, Tl, ux, uy, fx, fy); }
    // ── 袍：裙身随两腿、躯干 ──
    op('robe');
    const hipW = (woman ? 0.064 : 0.057) * WK, waW = (woman ? 0.044 : 0.05) * WK, chW = (woman ? 0.058 : 0.068) * WK, shW = (woman ? 0.054 : 0.07) * WK;
    if (!bare) {
      const flare = (woman || p.angel ? 0.15 : child ? 0.1 : elder ? 0.13 : 0.11) * WK + 0.02 * p.gait;
      const kw = (woman || p.angel ? 0.118 : 0.104) * WK;
      limb(0.008, 0, nkx, nky, hemN[0], hemN[1], hipW * 2, kw, flare, false);
      limb(-0.008, 0, fkx, fky, hemF[0], hemF[1], hipW * 2, kw, flare, false);
      // 两腿之间的裙摆
      const nFront = hemN[0] >= hemF[0];
      const Fh = nFront ? hemN : hemF, Bh = nFront ? hemF : hemN;
      const wx = ux * Tl * 0.3, wy = uy * Tl * 0.3;
      quad(wx - fx * waW, wy - fy * waW, wx + fx * waW, wy + fy * waW, Fh[0] + flare * 0.45, Fh[1], Bh[0] - flare * 0.45, Bh[1]);
    }
    // 躯干（肩头圆起）
    const pt = (t, w, side, i) => { PB[2 * i] = ux * Tl * t + fx * w * side; PB[2 * i + 1] = uy * Tl * t + fy * w * side; };
    pt(0, hipW, -1, 0); pt(0.42, waW, -1, 1); pt(0.75, chW, -1, 2); pt(0.95, shW - 0.004, -1, 3); pt(1.02, shW * 0.55, -1, 4);
    pt(1.02, shW * 0.55, 1, 5); pt(0.95, shW - 0.004, 1, 6); pt(0.7, chW + (woman ? 0.006 : 0), 1, 7); pt(0.42, waW, 1, 8); pt(0, hipW, 1, 9);
    polyN(10);
    if (elder && !lo) ell(sx * 0.78 - fx * 0.03, sy * 0.78 - fy * 0.03, 0.05 * WK, 0.06 * WK, lean);    // 驼背
    if (bare) {
      headParts();
      limb(0.008, 0, nkx, nky, nfx, nfy, 0.104 * WK, 0.068 * WK, 0.043 * WK); foot(nkx, nky, nfx, nfy, Q[NSH]);
    }
    if (!armSep) arm(jnx, jny, nUa, nFa, bare, true);
    // ── 头巾 / 包头 / 须 / 腰带 ──
    const beard = p.beardOpt != null ? p.beardOpt : (elder && !woman && !p.angel);
    if (style === 'veil' || style === 'cloth' || beard || (!woman && !bare && !child && !lo)) {
      op('acc');
      if (style === 'veil' || style === 'cloth') {
        const veil = style === 'veil';
        const tr = (veil ? 0.022 : 0.012) + 0.03 * p.gait + 0.012 * Math.abs(W.wind || 0) + 0.02 * p.run;
        const dn = veil ? 0.2 : 0.035;
        PB[0] = hcx + hfx * hr * 0.8 + hux * hr * 0.45; PB[1] = hcy + hfy * hr * 0.8 + huy * hr * 0.45;
        PB[2] = hcx + hfx * hr * 0.15 + hux * hr * 1.2; PB[3] = hcy + hfy * hr * 0.15 + huy * hr * 1.2;
        PB[4] = hcx - hfx * hr * 0.85 + hux * hr * 0.88; PB[5] = hcy - hfy * hr * 0.85 + huy * hr * 0.88;
        PB[6] = hcx - hfx * hr * 1.25 - hux * hr * 0.05; PB[7] = hcy - hfy * hr * 1.25 - huy * hr * 0.05;
        PB[8] = sx - fx * (0.07 + tr) - ux * dn; PB[9] = sy - fy * (0.07 + tr) - uy * dn;
        PB[10] = sx - fx * 0.03 - ux * (dn - 0.012); PB[11] = sy - fy * 0.03 - uy * (dn - 0.012);
        PB[12] = hcx - hfx * hr * 0.2 - hux * hr * 1.15; PB[13] = hcy - hfy * hr * 0.2 - huy * hr * 1.15;
        PB[14] = hcx + hfx * hr * 0.28 - hux * hr * 0.5; PB[15] = hcy + hfy * hr * 0.28 - huy * hr * 0.5;
        polyN(8);
      }
      if (beard) {
        PB[0] = hcx + hfx * hr * 0.62 - hux * hr * 0.35; PB[1] = hcy + hfy * hr * 0.62 - huy * hr * 0.35;
        PB[2] = hcx + hfx * hr * 0.5 - hux * hr * 1.7; PB[3] = hcy + hfy * hr * 0.5 - huy * hr * 1.7;
        PB[4] = hcx - hfx * hr * 0.2 - hux * hr * 0.95; PB[5] = hcy - hfy * hr * 0.2 - huy * hr * 0.95;
        polyN(3);
      }
      if (!woman && !bare && !child && !lo && style !== 'veil') {
        const a0 = p.angel ? 0.4 : 0.36, a1 = p.angel ? 0.47 : 0.45, w = waW * 1.08;
        quad(ux * Tl * a0 - fx * w, uy * Tl * a0 - fy * w, ux * Tl * a0 + fx * w, uy * Tl * a0 + fy * w,
          ux * Tl * a1 + fx * w, uy * Tl * a1 + fy * w, ux * Tl * a1 - fx * w, uy * Tl * a1 - fy * w);
      }
    }
    // ── 怀中的婴孩 / 羊羔 ──
    if (p.carry && upright > 0.4) {
      op('baby');
      const cx = ux * Tl * 0.62 + fx * 0.085, cy = uy * Tl * 0.62 + fy * 0.085;
      if (p.carry === 'lamb') {
        ell(cx, cy - 0.005, 0.085, 0.048, lean * 0.3);
        ell(cx + 0.075, cy - 0.04, 0.03, 0.024, -0.3);
        seg(cx + 0.06, cy - 0.055, cx + 0.04, cy - 0.07, 0.014, 0.008);
        if (!lo) { seg(cx - 0.03, cy + 0.03, cx - 0.035, cy + 0.07, 0.012, 0.01); seg(cx + 0.03, cy + 0.03, cx + 0.028, cy + 0.07, 0.012, 0.01); }
      } else {
        ell(cx, cy, 0.075, 0.04, lean - 0.35);
        ell(cx + 0.055 * Math.cos(lean - 0.35), cy + 0.055 * Math.sin(lean - 0.35) - 0.012, 0.03, 0.03, 0);
      }
    }
    // ── 近侧的臂（盖在躯干上）──
    if (armSep) { op('arm'); arm(jnx, jny, nUa, nFa, bare, true); }
    if (p.wings) { op('wing'); wing(p, sx, sy, ux, uy, fx, fy, 0.08); }
    // ── 手中之物 ──
    P_FLAME = null; P_SWORD = null;
    const handBusy = p.carry && (p.prop === 'staff' || p.prop === 'spear' || p.prop === 'blade' || p.prop === 'torch' || p.prop === 'sword');
    if (p.prop && !(backLoad && upright > 0.5) && !handBusy) {
      op('prop');
      handProp(p, Q, A, upright, grounded, jarOn, sx, sy, ux, uy, fx, fy);
    }
    const cL = p._chestL || (p._chestL = [0, 0]), hL = p._headL || (p._headL = [0, 0]);
    cL[0] = ux * Tl * 0.68 + fx * 0.01; cL[1] = uy * Tl * 0.68 + fy * 0.01;
    hL[0] = hcx; hL[1] = hcy;
  }
  const HN = [0, 0, 0], HF = [0, 0];
  let P_FLAME = null, P_SWORD = null;
  function HOLD_OK_BUSY(p) { return p._wF > 0.5; }

  // 基路伯之翼：自肩后向上、向后展开；主羽一片片叠成柔和的扇边
  function wing(p, sx, sy, ux, uy, fx, fy, off) {
    const flap = Math.sin(W.t * 0.8 + p.phase) * 0.05;
    const th = p._lean + off + flap - 0.3;
    const wux = Math.sin(th), wuy = -Math.cos(th);        // 沿翼向上
    const wbx = -Math.cos(th), wby = -Math.sin(th);       // 翼的后缘一侧
    const rx = sx - fx * 0.025 - ux * 0.05, ry = sy - fy * 0.025 - uy * 0.05;
    const P = (u, b, i) => { PB[2 * i] = rx + wux * u + wbx * b; PB[2 * i + 1] = ry + wuy * u + wby * b; };
    P(0, -0.03, 0); P(0.24, -0.07, 1); P(0.56, -0.06, 2); P(0.84, -0.01, 3); P(0.96, 0.06, 4); P(0.78, 0.15, 5); P(0.4, 0.17, 6); P(0.06, 0.11, 7);
    polyN(8);
    const ang = Math.atan2(wuy, wux);
    for (let i = 0; i < 6; i++) {
      const u = 0.84 - i * 0.14, b = 0.13 + 0.012 * i;
      ell(rx + wux * u + wbx * b, ry + wuy * u + wby * b, 0.15 - i * 0.01, 0.036, ang + 0.3 + i * 0.07);
    }
  }
  function backProp(kind, Tl, ux, uy, fx, fy) {
    const lean = Math.atan2(fy, fx);
    if (kind === 'bundle') {
      const cx = ux * Tl * 0.7 - fx * 0.078, cy = uy * Tl * 0.7 - fy * 0.078;
      ell(cx, cy, 0.062, 0.074, Math.atan2(fy, fx));
      ell(cx + ux * 0.07, cy + uy * 0.07, 0.022, 0.02, 0);
    } else {
      // 燔祭的柴（创 22:6）：几根长柴斜捆在背上，上端越过肩头
      const px = ux * Tl * 0.12 - fx * 0.07, py = uy * Tl * 0.12 - fy * 0.07;
      for (let i = 0; i < 4; i++) {
        const t = 0.3 + 0.075 * i, c = Math.cos(t), sn = Math.sin(t);
        const dx = ux * c - fx * sn, dy = uy * c - fy * sn;
        const ox = -fx * 0.012 * i, oy = -fy * 0.012 * i;
        seg(px + ox - dx * 0.1, py + oy - dy * 0.1, px + ox + dx * (0.5 + 0.04 * (i % 2)), py + oy + dy * (0.5 + 0.04 * (i % 2)), 0.026, 0.021);
      }
      const t = 0.38, c = Math.cos(t), sn = Math.sin(t), mx = px + (ux * c - fx * sn) * 0.2, my = py + (uy * c - fy * sn) * 0.2;
      ell(mx - fx * 0.02, my - fy * 0.02, 0.05, 0.016, lean + 0.1);
    }
  }
  function handProp(p, Q, A, upright, grounded, jarOn, sx, sy, ux, uy, fx, fy) {
    const k = p.prop, gY = Q[HIP];          // 地面在局部坐标中的 y（直立时）
    const hx = HN[0], hy = HN[1];
    if (k === 'staff' || k === 'spear') {
      if (upright > 0.8 && p.pose !== 'raise' && p.pose !== 'pray' && p.pose !== 'wrestle' && p.pose !== 'embrace') {
        const bx = hx + 0.05, by = gY;
        let dx = hx - bx, dy = hy - by; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
        const len = k === 'spear' ? 1.2 : 1.08;
        seg(bx, by, bx + dx * len, by + dy * len, 0.02, 0.022);
        if (k === 'spear') seg(bx + dx * len, by + dy * len, bx + dx * (len + 0.1), by + dy * (len + 0.1), 0.032, 0.002);
        else if (p.age === 'elder') ell(bx + dx * 1.08, by + dy * 1.08, 0.016, 0.016, 0);
      } else {
        // 放在身旁的地上
        if (upright > 0.5) seg(-0.5, gY - 0.006, 0.55, gY - 0.012, 0.018, 0.018);
        else {
          // 身子倒下（俯伏、躺卧）时，杖仍平放在屏幕上的地面，不随身子转成竖的（否则看来像十字）
          const sc = T.s, gy = (isFinite(p._y) ? p._y : T.y + gY * sc) - 0.012 * sc;
          inv(T.x - 0.55 * sc * T.f, gy); const ax = IX, ay = IY;
          inv(T.x + 0.55 * sc * T.f, gy - 0.004 * sc);
          seg(ax, ay, IX, IY, 0.018, 0.018);
        }
      }
    } else if (k === 'blade') {
      // 寻常的刀剑：刃朝前下，护手一横
      seg(hx - 0.01, hy - 0.015, hx + 0.12, hy + 0.23, 0.016, 0.004);
      seg(hx - 0.04, hy + 0.028, hx + 0.03, hy - 0.022, 0.011, 0.011);
    } else if (k === 'torch') {
      const tx = hx + 0.03, ty = hy - 0.19;
      seg(hx - 0.005, hy + 0.03, tx, ty, 0.024, 0.03);
      tp(tx, ty - 0.035); P_FLAME = [PX, PY];
    } else if (k === 'sword') {
      P_SWORD = [hx, hy, W.t * 1.1 + p.phase];
      seg(hx - 0.03, hy, hx + 0.03, hy, 0.014, 0.014);
    } else if (k === 'jar') {
      if (jarOn) {
        const cx = sx - fx * 0.05 + ux * 0.075, cy = sy - fy * 0.05 + uy * 0.075;
        const ta = p._lean - 0.5;
        ell(cx, cy, 0.05, 0.064, ta);
        const nx = cx + Math.sin(ta) * 0.075, ny = cy - Math.cos(ta) * 0.075;
        seg(cx + Math.sin(ta) * 0.04, cy - Math.cos(ta) * 0.04, nx, ny, 0.034, 0.028);
        ell(nx, ny, 0.024, 0.01, ta);
      } else {
        const cx = 0.2, cy = (upright > 0.5 ? gY : 0.02) - 0.058;
        ell(cx, cy, 0.05, 0.058, 0);
        seg(cx, cy - 0.04, cx, cy - 0.085, 0.032, 0.026);
      }
    } else if (k === 'wood' || k === 'bundle') {
      const base = upright > 0.5 ? gY : 0.02;
      if (k === 'wood') for (let i = 0; i < 4; i++) seg(0.18 + i * 0.012, base - 0.012 - i * 0.016, 0.55 + i * 0.01, base - 0.02 - i * 0.012, 0.02, 0.018);
      else ell(0.3, base - 0.05, 0.07, 0.05, 0);
    }
  }

  // 约瑟的彩衣：袍上一道道颜色（沿身体的轴线分段）
  let STRIPE_P = null;
  function coatStripes(ctx) {
    const s = STRIPE_P;
    if (!s) return;
    ctx.save();
    ctx.clip();
    const n = COAT.length;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n;
      const ax = lerp(s.x0, s.x1, t0), ay = lerp(s.y0, s.y1, t0), bx = lerp(s.x0, s.x1, t1), by = lerp(s.y0, s.y1, t1);
      ctx.fillStyle = W.shadeCSS(COAT[(i + (s.odd ? 1 : 0)) % n], s.depth, null, s.extra);
      ctx.beginPath();
      ctx.moveTo(ax + s.nx * s.w, ay + s.ny * s.w); ctx.lineTo(bx + s.nx * s.w, by + s.ny * s.w);
      ctx.lineTo(bx - s.nx * s.w, by - s.ny * s.w); ctx.lineTo(ax - s.nx * s.w, ay - s.ny * s.w);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function drawPerson(ctx, p, lo) {
    const h = p._h;
    const em = p.emerge < 1 ? easeOut(p.emerge) : 1;
    const alpha = p.alpha * (p.from === 'light' ? 0.15 + 0.85 * em : 0.3 + 0.7 * em);
    if (alpha < 0.01) return;
    // 伸手的目标（世界坐标）
    targets(p);
    const still = em >= 1 && p.poseT >= 1 && p.gait < 0.003 && p.sob < 0.003 && !p.angel && !p.wings && !p._seat &&
      p.prop !== 'torch' && p.prop !== 'sword' && p.prop !== 'coat' && !(p._wN > 0) && !(p._wF > 0) &&
      (p.holdW < 0.001 || p.holdW > 0.999) && !W.ritual.holding && p.pose !== 'wrestle' && p.pose !== 'embrace';
    const lk = lo ? 1 : 0;
    let X = p._x, hipY;
    let hitC = null;
    if (still && cacheHit(p, p._x, p._y, h, p.fd * 2 + lk, p.crowd ? 40 : 12)) {
      hitC = p._cc;
      hipY = hitC.e0;
      setT(X, hipY, h, p.fd, hitC.e1);
      P_FLAME = null; P_SWORD = null;
    } else {
      const Qv = computeQ(p);
      if (p._seat) { X = p._seat[0]; hipY = p._seat[1]; }
      else hipY = p._y - Qv[HIP] * h;
      if (p.from === 'dust' && em < 1) hipY += (1 - em) * h * 0.95;
      if (p.angel && !p._seat) hipY -= h * (0.07 + 0.02 * Math.sin(W.t * 1.1 + p.phase) + p.lift);
      setT(X, hipY, h, p.fd, Qv[ROT]);
      nOps = 0; cbN = 0;
      buildPerson(p, Qv, lo);
      if (still) cacheSave(p, p._x, p._y, h, p.fd * 2 + lk, hipY, Qv[ROT], 0);
    }
    const sink = p.from === 'dust' && em < 1 ? (1 - em) * h * 0.95 : 0;
    // 颜色
    const depth = W.LAYERS[p.layer] ? W.LAYERS[p.layer].depth : 0;
    const rim = rimAt(X, hipY - h * 0.3, true);
    // 七日之后的夜里，人身上留一层月光：有名字的人再亮一些（黑地上的黑影认不出谁是谁）
    const ex = RIM.extra + (W.act >= 1 ? W.night * (p.label && !p.crowd ? 0.18 : 0.11) : 0);
    const pk = p.prop;
    const cc = p._colc;
    if (cc && W.frame - cc.f < 4 && W.frame >= cc.f && Math.abs(cc.ex - ex) < 0.015 && cc.dp === depth) restoreCols(cc, PKEYS);
    else {
    if (p.angel) {
      const lum = 0.42 + 0.4 * W.night;
      lumCol('robe', p.robe, depth, ex, lum); lumCol('back', ANGEL_SKIN, depth, ex, lum, 0.86);
      lumCol('acc', accentOf(p), depth, ex, lum, 1.02);
      if (p.wings) { lumCol('wing', ANGEL_WING, depth, ex, lum); lumCol('wingF', ANGEL_WING, depth, ex, lum, 0.8); }
      rim.a = Math.max(rim.a * 0.6, 0.35 + 0.3 * W.night); rim.c[0] = 255; rim.c[1] = 240; rim.c[2] = 200;
    } else if (p.bare) {
      setCol('robe', SKIN, depth, ex); setCol('back', SKIN, depth, ex, 0.76);
      setCol('acc', accentOf(p), depth, ex);
    } else {
      setCol('robe', p.robe, depth, ex); setCol('back', SKIN, depth, ex);
      setCol('acc', accentOf(p), depth, ex);
    }
    if (p.wings && !p.angel) { setCol('wing', ANGEL_WING, depth, ex + 0.1); setCol('wingF', ANGEL_WING, depth, ex, 0.8); }
    if (styleOf(p) === 'long' || (!lo && h >= 24)) setCol('hair', p.age === 'elder' ? GREY : HAIR, depth, ex, p.age === 'elder' ? 0.85 : 1);
    if (pk === 'coat' && !p.angel) setCol('arm', COAT[1], depth, ex); else aliasCol('arm', 'robe');
    if (pk) setCol('prop', pk === 'jar' ? CLAY : pk === 'bundle' ? CLOTH : pk === 'sword' ? [200, 190, 170] : pk === 'blade' ? [176, 178, 180] : pk === 'wood' ? FIREWOOD : WOOD, depth, ex);
    if (p.carry) setCol('baby', p.carry === 'lamb' ? LAMB : SWADDLE, depth, ex + 0.05);
    p._colc = saveCols(p._colc, PKEYS, ex, depth);
    }
    // 彩衣
    STRIPE_P = null;
    if (pk === 'coat' && !p.angel) {
      tp(0, 0); const hx0 = PX, hy0 = PY;
      tp(Math.sin(p._lean) * 0.31, -Math.cos(p._lean) * 0.31); const sx0 = PX, sy0 = PY;
      const dx = hx0 - sx0, dy = hy0 - sy0, L = Math.hypot(dx, dy) || 1;
      STRIPE_P = { x0: sx0 - dx / L * h * 0.04, y0: sy0 - dy / L * h * 0.04, x1: hx0 + dx / L * h * 0.52, y1: hy0 + dy / L * h * 0.52, nx: -dy / L, ny: dx / L, w: h * 0.4, depth, extra: ex, odd: false };
    }
    ctx.globalAlpha = alpha;
    const clip = sink > 0.5;   // 自尘土升起：地面以下的部分不画
    if (clip) { ctx.save(); ctx.beginPath(); ctx.rect(X - h * 2, p._y - h * 3, h * 4, h * 3 + 0.5); ctx.clip(); }
    // 天使：身后柔和的光
    if (p.angel) {
      const sp = glowSprite('warm', WARM, 0.9);
      tp(p._chestL[0], p._chestL[1]);
      const r = h * (p.wings ? 1.0 : 0.8) * (0.96 + 0.04 * Math.sin(W.t * 1.3 + p.phase));
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha * (0.14 + 0.36 * W.night) * (0.6 + 0.4 * em);
      ctx.drawImage(sp, PX - r, PY - r * 1.25, r * 2, r * 2.5);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = alpha;
    }
    const lowRim = h < 9 || ((W.quality || 1) < 0.75 && (p.layer < 2 || p.crowd));
    if (hitC) flushCached(ctx, hitC, lowRim ? null : rim, 'robe');
    else flushOps(ctx, lowRim ? null : rim, 'robe', STRIPE_P ? coatStripes : null);
    if (clip) ctx.restore();
    // 胸中灵的微光（人）/ 头上的光（天使）：记下，整层画完再叠
    if (p.angel) {
      tp(p._headL[0], p._headL[1]);
      const r = h * 0.2;
      glowAt(glowSprite('pale', [255, 246, 222], 1), PX - r, PY - r, r * 2, r * 2, alpha * (0.18 + 0.3 * W.night));
    } else if (p.glow > 0.01) {
      tp(p._chestL[0], p._chestL[1]);
      const g = p.glow * (0.45 + 0.55 * W.night + 0.2 * W.dusk);
      const sz = h * (0.5 + 0.12 * W.night);
      glowAt(glowSprite('inner', INNER, 0.95), PX - sz / 2, PY - sz / 2, sz, sz, alpha * g * 0.7);
    }
    if (p.from === 'light' && em < 1) {
      tp(p._chestL[0], p._chestL[1]);
      const r = h * (0.6 + (1 - em) * 0.8);
      glowAt(glowSprite('pale', [255, 246, 222], 1), PX - r, PY - r, r * 2, r * 2, (1 - em) * 0.8 * p.alpha);
    }
    if (P_FLAME) drawFlame(ctx, P_FLAME[0], P_FLAME[1], h, alpha);
    if (P_SWORD) drawSword(ctx, h, alpha);
    ctx.globalAlpha = 1;
  }
  function drawFlame(ctx, x, y, h, alpha) {
    const fl = 0.85 + 0.15 * Math.sin(W.t * 17) * Math.sin(W.t * 7.3);
    ctx.globalCompositeOperation = 'lighter';
    const r = h * 0.34 * fl;
    ctx.globalAlpha = alpha * (0.45 + 0.4 * W.night);
    ctx.drawImage(glowSprite('flame', FLAME, 1), x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgb(255,214,140)';
    const s = h * 0.05 * fl;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 2.4 - Math.sin(W.t * 11) * s * 0.3);
    ctx.quadraticCurveTo(x + s, y - s * 0.2, x, y + s * 0.8);
    ctx.quadraticCurveTo(x - s, y - s * 0.2, x, y - s * 2.4);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  // 发火焰的剑，四面转动（3:24）
  function drawSword(ctx, h, alpha) {
    const [lx, ly, a] = P_SWORD;
    tp(lx, ly); const x = PX, y = PY;
    const L = h * 0.62, dx = Math.sin(a), dy = -Math.cos(a) * 0.35 - 0.65;
    const d = Math.hypot(dx, dy) || 1;
    const tx = x + dx / d * L, ty = y + dy / d * L;
    ctx.globalCompositeOperation = 'lighter';
    const sp = glowSprite('flame', FLAME, 1);
    for (let i = 1; i <= 3; i++) {
      const k = i / 3, r = h * (0.16 + 0.08 * Math.sin(W.t * 13 + i));
      ctx.globalAlpha = alpha * 0.5;
      ctx.drawImage(sp, lerp(x, tx, k) - r, lerp(y, ty, k) - r, r * 2, r * 2);
    }
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgb(255,236,190)';
    ctx.lineWidth = Math.max(1, h * 0.03);
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  // 伸手的目标：牵手、相拥、角力（以对方此刻的位置为准）
  function targets(p) {
    const dt = W.dt || 0.016;
    p._tN = null; p._tF = null;
    let wN = 0, wF = 0;
    const h = p._h;
    // 牵手
    const o = p.hold && people.get(p.hold);
    let holdOK = false;
    if (o && !o.isAnimal && o._vis && !o.dying && o.layer === p.layer && HOLD_OK[p.pose] && HOLD_OK[o.pose] && !p.carry && !o.carry && !p.mount && !o.mount) {
      const d = Math.abs(o._x - p._x);
      if (d < (h + o._h) * 0.5 * 0.8 && d > h * 0.06) holdOK = true;
    }
    p.holdW = approach(p.holdW, holdOK ? 1 : 0, 6, dt);
    if (p.holdW > 0.01 && o) {
      const hm = (h + o._h) * 0.5, half = Math.abs(o._x - p._x) * 0.5, R = hm * 0.31;
      const tx = (p._x + o._x) / 2, ty = (p._y + o._y) / 2 - hm * 0.77 + Math.sqrt(Math.max(0, R * R - half * half)) * 0.95;
      const useFar = p.prop === 'staff' || p.prop === 'spear' || p.prop === 'blade' || p.prop === 'torch' || p.prop === 'sword';
      if (useFar) { p._tF = [tx, ty]; wF = p.holdW; } else { p._tN = [tx, ty]; wN = p.holdW; }
    }
    // 相拥 / 角力
    if (p.pose === 'embrace' || p.pose === 'wrestle') {
      let e = p.embrace && people.get(p.embrace);
      if (!e || e.pose !== p.pose || e.layer !== p.layer) e = nearestPartner(p);
      if (e) {
        const fe = e.fd >= 0 ? 1 : -1, he = e._h;
        const k = p.poseT < 1 ? ease(p.poseT) : 1;
        if (p.pose === 'embrace') {
          p._tN = [e._x - fe * he * 0.05, e._y - he * 0.7]; p._tF = [e._x - fe * he * 0.02, e._y - he * 0.62];
        } else {
          p._tN = [e._x + fe * he * 0.02, e._y - he * 0.72]; p._tF = [e._x - fe * he * 0.01, e._y - he * 0.5];
        }
        wN = wF = k;
      }
    }
    p._wN = wN; p._wF = wF;
  }
  function nearestPartner(p) {
    let best = null, bd = 1e9;
    for (const q of people.values()) {
      if (q === p || q.isAnimal || q.pose !== p.pose || q.layer !== p.layer || !q._vis) continue;
      const d = Math.abs(q._x - p._x);
      if (d < p._h * 0.9 && d < bd && Math.sign(q._x - p._x) === Math.sign(p.fd)) { bd = d; best = q; }
    }
    return best;
  }

  // 婴孩（独自一个时）：襁褓。单位取成人的身高
  function drawBaby(ctx, p) {
    const H = p._h / AGE_H.baby;
    const depth = W.LAYERS[p.layer] ? W.LAYERS[p.layer].depth : 0;
    const upright = !LOW[p.pose];
    setT(p._x, p._y, H, p.fd, 0);
    nOps = 0;
    op('baby');
    if (upright) { ell(0, -0.1, 0.05, 0.1, 0); ell(0.006, -0.225, 0.045, 0.045, 0); }
    else { ell(0, -0.038, 0.12, 0.038, 0); ell(0.13, -0.046, 0.042, 0.042, 0); }
    const rim = rimAt(p._x, p._y - H * 0.1, true);
    setCol('baby', SWADDLE, depth, RIM.extra + 0.05);
    ctx.globalAlpha = p.alpha;
    flushOps(ctx, rim, 'baby');
    if (p.glow > 0.01) {
      tp(0, upright ? -0.15 : -0.05);
      const sz = H * 0.4;
      glowAt(glowSprite('inner', INNER, 0.95), PX - sz / 2, PY - sz / 2, sz, sz, p.alpha * p.glow * (0.5 + 0.5 * W.night));
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画牲畜：与 beasts.js 同一种剪影语言
  // ════════════════════════════════════════════════════════════
  function seatAt(a, x, y) { const st = a._seatL || (a._seatL = [0, 0]); st[0] = x; st[1] = y; }
  function legQ(M, x0, y0, L, front, ph, A, g, lie) {
    const s = Math.sin(ph), c = Math.cos(ph);
    const th = A * s, lift = Math.max(0, c) * g;
    let u, l;
    if (front) { u = th + 0.03; l = th - lift * 1.05 - 0.02; }
    else { u = th - 0.22 - lift * 0.12; l = th + 0.16 + lift * 0.75; }
    if (lie > 0.001) { u = lerp(u, front ? 1.25 : 1.35, lie); l = lerp(l, front ? -1.5 : -1.6, lie); }
    const L1 = L * (front ? 0.5 : 0.52), L2 = L * 0.5;
    const kx = x0 + Math.sin(u) * L1, ky = y0 + Math.cos(u) * L1;
    const fx = kx + Math.sin(l) * L2, fy = Math.min(ky + Math.cos(l) * L2, 0.2);
    const w = M.lw;
    limb(x0, y0, kx, ky, fx, fy, w[0] * (front ? 1 : 1.35), w[1], w[2]);
  }
  function buildQuad(a) {
    const M = a.M, lie = a.lie, g = a.gait, run = a.run, ph = a.ph;
    const bl = M.bl, bh = M.bh, L0 = M.leg + bh * 0.32;
    const bob = -(0.04 + 0.12 * run) * g * L0 * Math.abs(Math.cos(ph));
    const by = lerp(-(M.leg + bh * 0.5), -bh * 0.46, lie) + bob;
    const pitch = a.pitch + (run ? 0.06 * Math.sin(ph * 2) * run : 0);
    const cp = Math.cos(pitch), spn = Math.sin(pitch);
    const rx = (x, y) => x * cp - (y - by) * spn, ry = (x, y) => by + x * spn + (y - by) * cp;
    const hy = by + bh * 0.2, L = L0 * (1 - 0.3 * lie);
    const A = lerp(0.3, 0.62, run) * g;
    const fx = bl * 0.27, bx = -bl * 0.29;
    op(M.wool ? 'darkF' : 'far');
    legQ(M, rx(fx, hy) - 0.8, ry(fx, hy), L, true, ph + Math.PI, A, g, lie);
    legQ(M, rx(bx, hy) - 0.8, ry(bx, hy), L, false, ph, A, g, lie);
    const t0x = rx(-bl * 0.47, by - bh * 0.22), t0y = ry(-bl * 0.47, by - bh * 0.22);
    const sway = Math.sin(W.t * 1.3 + a.seed * 7) * 0.5 + (g * Math.sin(ph) * 0.4);
    if (M.tail === 'tuft') {
      op('far');
      const n = 5, len = bh * 1.3;
      for (let i = 0; i < n; i++) {
        const k = i / (n - 1);
        SP_[2 * i] = t0x - k * 1.5 + sway * k * 1.6;
        SP_[2 * i + 1] = t0y + k * len * 0.95;
      }
      for (let i = 0; i < n; i++) { const over = SP_[2 * i + 1] + 0.6; if (over > 0) { SP_[2 * i + 1] = -0.6; SP_[2 * i] -= over * 0.9; } }
      strand(SP_, n, 1.3, 0.8);
      a._tuftX = SP_[2 * (n - 1)]; a._tuftY = Math.min(SP_[2 * (n - 1) + 1], -1.2);
    }
    op(M.wool ? 'dark' : 'body');
    legQ(M, rx(fx, hy) + 0.5, ry(fx, hy), L, true, ph, A, g, lie);
    legQ(M, rx(bx, hy) + 0.5, ry(bx, hy), L, false, ph + Math.PI, A, g, lie);
    if (M.wool) op('body');
    if (M.wool) {
      ell(0, by, bl * 0.47, bh * 0.5, pitch);
      for (let i = 0; i < 6; i++) {
        const k = i / 5, x = lerp(-bl * 0.4, bl * 0.3, k), y = by + (i % 2 ? -bh * 0.1 : bh * 0.06);
        const r = bh * (i % 2 ? 0.44 : 0.4);
        ell(rx(x, y), ry(x, y), r, r, 0);
      }
      ell(rx(-bl * 0.5, by - bh * 0.1), ry(-bl * 0.5, by - bh * 0.1), 1.8, 2.2, 0.4);
    } else {
      ell(0, by, bl * 0.5, bh * 0.5, pitch);
      if (M.chest) ell(rx(bl * 0.27, by + bh * 0.05), ry(bl * 0.27, by + bh * 0.05), bl * 0.22 * M.chest, bh * 0.52 * M.chest, pitch);
      if (M.rump) ell(rx(-bl * 0.29, by - bh * 0.02), ry(-bl * 0.29, by - bh * 0.02), bl * 0.22 * M.rump, bh * 0.51 * M.rump, pitch);
      if (M.flat) {
        ell(rx(-bl * 0.02, by - bh * 0.1), ry(-bl * 0.02, by - bh * 0.1), bl * 0.47, bh * 0.4, pitch);
        ell(rx(-bl * 0.36, by - bh * 0.3), ry(-bl * 0.36, by - bh * 0.3), bl * 0.13, bh * 0.3, pitch);
      }
      if (M.dewlap) ell(rx(bl * 0.4, by + bh * 0.2), ry(bl * 0.4, by + bh * 0.2), bl * 0.08, bh * 0.36, pitch - 0.3);
      if (M.tail === 'up') {
        const tx = rx(-bl * 0.49, by - bh * 0.3), ty = ry(-bl * 0.49, by - bh * 0.3);
        seg(tx, ty, tx - 2.2, ty - 1.9 - Math.max(0, sway) * 0.6, 2.0, 0.5);
      }
    }
    // 斑点、有纹的（创 30:32）
    if (a.speckled) {
      op('dark');
      for (let i = 0; i < 8; i++) {
        const hsh = U.hash1(a.seed * 1000 + i * 7.1), hs2 = U.hash1(a.seed * 1000 + i * 3.3 + 50);
        const x = lerp(-bl * 0.38, bl * 0.32, hsh), y = by + (hs2 - 0.5) * bh * 0.7;
        const r = bh * (0.07 + 0.08 * U.hash1(i * 11 + a.seed * 300));
        ell(rx(x, y), ry(x, y), r * 1.2, r, 0);
      }
    }
    // 驮着的包袱
    if (a.pack && M.key === 'donkey') {
      op('pk1');
      PB[0] = -bl * 0.22; PB[1] = by - bh * 0.52; PB[2] = bl * 0.16; PB[3] = by - bh * 0.54;
      PB[4] = bl * 0.13; PB[5] = by + bh * 0.1; PB[6] = -bl * 0.2; PB[7] = by + bh * 0.1; polyN(4);
      op('pk2');
      ell(-bl * 0.04, by + bh * 0.02, bl * 0.14, bh * 0.36, 0);
      ell(-bl * 0.03, by - bh * 0.62, bl * 0.12, bh * 0.2, 0);
    }
    // 颈与头
    if (M.wool || M.hmane) op('body');
    const al = a.neck;
    const sx = rx(bl * 0.36, by - bh * 0.05), sy = ry(bl * 0.36, by - bh * 0.05);
    const nx = sx + Math.cos(al) * M.neck, ny = sy - Math.sin(al) * M.neck;
    if (!M.wool) seg(sx, sy, nx, ny, M.nw[0], M.nw[1]);
    else seg(sx - 1, sy, nx, ny, M.nw[0], M.nw[1]);
    ell(nx, ny, M.nw[1] * 0.5, M.nw[1] * 0.5, 0);
    if (M.hmane) {
      op('dark');
      const ux = Math.cos(al), uy = -Math.sin(al), px = uy, py = -ux;
      const w0 = M.nw[0] * 0.42, w1 = M.nw[1] * 0.5;
      seg(sx + px * w0 - ux * 1.5, sy + py * w0 - uy * 1.5, nx + px * w1 + ux * 1.2, ny + py * w1 + uy * 1.2, 1.8, 1.3);
    }
    op(M.wool ? 'dark' : 'head');
    const be = al - (al > 0 ? M.hd : M.hd * 0.35) + a.headTilt;
    const fxv = Math.cos(be), fyv = -Math.sin(be);
    const uxv = fyv, uyv = -fxv;
    const cx = nx + fxv * M.hl * 0.28, cy = ny + fyv * M.hl * 0.28;
    ell(cx, cy, M.hl * 0.38, M.hh * 0.5, -be);
    const mx = nx + fxv * M.hl * 0.66, my = ny + fyv * M.hl * 0.66;
    ell(mx, my, M.hl * 0.32, M.hh * 0.37 * M.muz, -be);
    const ex = cx - fxv * M.hl * 0.12 + uxv * M.hh * 0.38, ey = cy - fyv * M.hl * 0.12 + uyv * M.hh * 0.38;
    const flick = a.ear || 0;
    if (M.earOut) seg(ex, ey, ex - fxv * M.ear * 0.9 + uxv * M.ear * (0.25 + flick), ey - fyv * M.ear * 0.9 + uyv * M.ear * (0.25 + flick), 1.6, 0.7);
    else if (M.key === 'donkey') {
      seg(ex, ey, ex - fxv * M.ear * 0.35 + uxv * M.ear * (0.95 + flick * 0.2), ey - fyv * M.ear * 0.35 + uyv * M.ear * (0.95 + flick * 0.2), 1.9, 0.9);
      seg(ex - fxv * 1.2, ey - fyv * 1.2, ex - fxv * (1.2 + M.ear * 0.55) + uxv * M.ear * 0.85, ey - fyv * (1.2 + M.ear * 0.55) + uyv * M.ear * 0.85, 1.6, 0.8);
    } else seg(ex, ey, ex - fxv * M.ear * 0.5 + uxv * M.ear * (0.9 + flick * 0.3), ey - fyv * M.ear * 0.5 + uyv * M.ear * (0.9 + flick * 0.3), M.ear * 0.55, 0.4);
    if (M.beard) seg(mx - fxv * 0.8 - uxv * M.hh * 0.3, my - fyv * 0.8 - uyv * M.hh * 0.3, mx - fxv * 1.8 - uxv * (M.hh * 0.3 + 2.4), my - fyv * 1.8 - uyv * (M.hh * 0.3 + 2.4), 1.2, 0.3);
    if (M.horn === 'goat') {
      const hx = cx + uxv * M.hh * 0.42, hy2 = cy + uyv * M.hh * 0.42;
      limb(hx, hy2, hx - fxv * 1.6 + uxv * 3.0, hy2 - fyv * 1.6 + uyv * 3.0, hx - fxv * 4.2 + uxv * 2.6, hy2 - fyv * 4.2 + uyv * 2.6, 1.4, 1.0, 0.3, false);
    }
    if (M.horn === 'cow') {
      op('acc');
      const hx = cx + uxv * M.hh * 0.4 - fxv * 0.8, hy2 = cy + uyv * M.hh * 0.4 - fyv * 0.8;
      limb(hx, hy2, hx + uxv * 2.2 - fxv * 0.6, hy2 + uyv * 2.2 - fyv * 0.6, hx + uxv * 3.1 + fxv * 1.2, hy2 + uyv * 3.1 + fyv * 1.2, 1.5, 1.0, 0.35, false);
    }
    if (M.horn === 'ram') {
      // 盘卷的角：一圈由粗到细的螺旋，绕在耳旁（创 22:13）
      op('acc');
      const hx = cx - fxv * M.hl * 0.08 + uxv * M.hh * 0.3, hy2 = cy - fyv * M.hl * 0.08 + uyv * M.hh * 0.3;
      const n = 8;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1), ang = -0.4 + t * 4.4, r = 3.1 * (1 - 0.62 * t);
        const ca = Math.cos(ang), sa = Math.sin(ang);
        SP_[2 * i] = hx + (-fxv * ca + uxv * sa) * r - fxv * 1.2;
        SP_[2 * i + 1] = hy2 + (-fyv * ca + uyv * sa) * r - fyv * 1.2;
      }
      strand(SP_, n, 2.6, 1.0);
    }
    if (M.tail === 'tuft') { op('dark'); ell(a._tuftX, a._tuftY + 0.5, 1.1, 1.6, 0); }
    // 骑者之座
    seatAt(a, -bl * 0.02, M.key === 'donkey' ? by - bh * 0.5 - (a.pack ? 1.2 : 0) : by - bh * 0.52);
  }
  // 骆驼：长腿、宽蹄、单峰、弯颈
  function buildCamel(a) {
    const M = a.M, lie = a.lie, g = a.gait, run = a.run, ph = a.ph;
    const bl = M.bl, bh = M.bh, L0 = M.leg + bh * 0.3;
    const bob = -(0.03 + 0.1 * run) * g * L0 * Math.abs(Math.cos(ph));
    const by = lerp(-(M.leg + bh * 0.5), -bh * 0.5, lie) + bob;
    const hy = by + bh * 0.22, L = L0 * (1 - 0.35 * lie);
    const A = lerp(0.26, 0.5, run) * g;
    const fx = bl * 0.3, bx = -bl * 0.3;
    op('far');
    legQ(M, fx - 0.8, hy, L, true, ph + Math.PI, A, g, lie);
    legQ(M, bx - 0.8, hy, L, false, ph, A, g, lie);
    // 尾
    const sway = Math.sin(W.t * 1.2 + a.seed * 7) * 0.6;
    seg(-bl * 0.49, by - bh * 0.15, -bl * 0.53 + sway * 0.4, by + bh * 0.55, 1.4, 0.8);
    op('body');
    legQ(M, fx + 0.5, hy, L, true, ph, A, g, lie);
    legQ(M, bx + 0.5, hy, L, false, ph + Math.PI, A, g, lie);
    ell(0, by, bl * 0.5, bh * 0.5, 0);
    ell(bl * 0.28, by + bh * 0.08, bl * 0.2, bh * 0.52, 0);          // 胸
    ell(-bl * 0.3, by - bh * 0.02, bl * 0.2, bh * 0.48, 0);          // 臀
    // 峰：自背脊缓缓隆起
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, b = Math.pow(Math.sin(Math.PI * t), 1.35);
      PB[2 * i] = lerp(-bl * 0.4, bl * 0.3, t); PB[2 * i + 1] = by - bh * 0.36 - bh * 0.6 * b;
    }
    PB[18] = bl * 0.3; PB[19] = by; PB[20] = -bl * 0.4; PB[21] = by;
    polyN(11);
    // 颈：先向前下垂，再向上弯到头
    const al = a.neck;
    const sx = bl * 0.4, sy = by - bh * 0.12;
    const d1 = lerp(-0.45, -0.9, c01(-al));
    const mx = sx + Math.cos(d1) * M.neck * 0.45, my = sy - Math.sin(d1) * M.neck * 0.45;
    const hx = mx + Math.cos(al) * M.neck * 0.62, hy2 = my - Math.sin(al) * M.neck * 0.62;
    limb(sx, sy, mx, my, hx, Math.min(hy2, -2.5), 6.4, 4.4, 3.0);
    const hyy = Math.min(hy2, -2.5);
    op('head');
    const be = Math.min(al, 0.4) * 0.3 - 0.12;
    const fxv = Math.cos(be), fyv = -Math.sin(be), uxv = fyv, uyv = -fxv;
    ell(hx + fxv * 2.6, hyy + fyv * 2.6, M.hl * 0.42, M.hh * 0.52, -be);
    ell(hx + fxv * 5.4 - uxv * 0.5, hyy + fyv * 5.4 - uyv * 0.5, M.hl * 0.26, M.hh * 0.42, -be);
    seg(hx + uxv * 1.2, hyy + uyv * 1.2, hx - fxv * 0.8 + uxv * 2.6, hyy - fyv * 0.8 + uyv * 2.6, 1.2, 0.5);
    // 鞍与驮袋（彩色的织物）：搭在峰上的毯子，两侧垂下，袋子挂在身侧
    if (a.pack) {
      op('pk1');
      const hx0 = -bl * 0.05, hy0 = by - bh * 0.42, rxh = bl * 0.24 + 0.9, ryh = bh * 0.54 + 0.9;
      const n = 7;
      for (let i = 0; i < n; i++) {
        const t = Math.PI * (1.12 + 0.76 * i / (n - 1));
        SP_[2 * i] = hx0 + Math.cos(t) * rxh; SP_[2 * i + 1] = hy0 + Math.sin(t) * ryh * 0.96;
      }
      strand(SP_, n, 2.6, 2.6);
      quad(hx0 - rxh * 0.62, hy0 - ryh * 0.5, hx0 - rxh * 0.16, hy0 - ryh * 0.62, hx0 - rxh * 0.2, by + bh * 0.2, hx0 - rxh * 0.66, by + bh * 0.16);
      quad(hx0 + rxh * 0.16, hy0 - ryh * 0.62, hx0 + rxh * 0.62, hy0 - ryh * 0.5, hx0 + rxh * 0.66, by + bh * 0.16, hx0 + rxh * 0.2, by + bh * 0.2);
      op('pk2');
      ell(hx0 - rxh * 0.4, by + bh * 0.12, bl * 0.075, bh * 0.28, 0);
      ell(hx0 + rxh * 0.42, by + bh * 0.12, bl * 0.07, bh * 0.26, 0);
      seg(hx0 - rxh * 0.66, by + bh * 0.2, hx0 + rxh * 0.66, by + bh * 0.2, 1.0, 1.0);
    }
    seatAt(a, -bl * 0.04, by - bh * (a.pack ? 1.08 : 1.0));
  }
  // 车：两轮，辕向前（创 45:19）
  function buildWagon(a) {
    const r = 7.5, spin = a.ph * 0.6;
    op('far');
    seg(12, -11, 31, -8.5, 1.6, 1.2);                              // 辕
    op('body');
    PB[0] = -16; PB[1] = -21; PB[2] = 14; PB[3] = -21; PB[4] = 13; PB[5] = -11.5; PB[6] = -15; PB[7] = -11.5; polyN(4);
    seg(-16.5, -21.5, 14.5, -21.5, 1.4, 1.4);
    if (a.pack) { op('pk2'); ell(-7, -24, 6.5, 3.4, 0); ell(3, -23.5, 5.5, 3, 0); op('pk1'); ell(-1, -26.5, 5, 2.6, 0); }
    op('dark');
    for (let i = 0; i < 12; i++) {
      const a0 = (i / 12) * TAU, a1 = ((i + 1) / 12) * TAU;
      seg(Math.cos(a0) * r, -r + Math.sin(a0) * r, Math.cos(a1) * r, -r + Math.sin(a1) * r, 1.5, 1.5);
    }
    for (let i = 0; i < 3; i++) {
      const ang = spin + (i / 3) * Math.PI;
      seg(-Math.cos(ang) * r, -r - Math.sin(ang) * r, Math.cos(ang) * r, -r + Math.sin(ang) * r, 0.9, 0.9);
    }
    ell(0, -r, 1.6, 1.6, 0);
    seatAt(a, -2, -21.5);
  }

  function drawAnimal(ctx, a) {
    const M = a.M, depth = W.LAYERS[a.layer] ? W.LAYERS[a.layer].depth : 0, s = a._h;
    const em = a.emerge < 1 ? easeOut(a.emerge) : 1;
    const alpha = a.alpha * (0.2 + 0.8 * em);
    if (alpha < 0.01) return;
    setT(a._x, a._y, s, a.fd, 0);
    const still = em >= 1 && a.gait < 0.003 && (a.lie < 0.002 || a.lie > 0.998);
    let hitC = null;
    if (still && cacheHit(a, a._x, a._y, s, a.fd, a.crowd ? 24 : 10)) {
      hitC = a._cc;
      a._seatL[0] = hitC.e0; a._seatL[1] = hitC.e1;
    } else {
      nOps = 0; cbN = 0;
      if (M.type === 'c') buildCamel(a); else if (M.type === 'w') buildWagon(a); else buildQuad(a);
      if (still) cacheSave(a, a._x, a._y, s, a.fd, a._seatL[0], a._seatL[1], 0);
    }
    const rim = rimAt(a._x, a._y - M.top * s * 0.5, false);
    const ex = RIM.extra + (W.act >= 1 ? W.night * 0.09 : 0);
    const cc = a._colc;
    if (cc && W.frame - cc.f < 4 && W.frame >= cc.f && Math.abs(cc.ex - ex) < 0.015 && cc.dp === depth) restoreCols(cc, AKEYS);
    else {
      setCol('body', a.col, depth, ex); aliasCol('head', 'body');
      setCol('far', a.col, depth, ex, 0.74);
      setCol('dark', a.col2, depth, ex); setCol('darkF', a.col2, depth, ex, 0.72);
      setCol('acc', a.acc, depth, ex + 0.05);
      if (a.pack) { setCol('pk1', M.type === 'w' ? [196, 170, 128] : [150, 52, 46], depth, ex); setCol('pk2', M.type === 'w' ? [150, 118, 84] : [58, 70, 112], depth, ex); }
      a._colc = saveCols(a._colc, AKEYS, ex, depth);
    }
    if (a.layer === 1) rim.a *= 0.7;
    ctx.globalAlpha = alpha;
    const rimA = (W.quality || 1) < 0.75 && a.layer < 2 ? null : rim;
    if (hitC) flushCached(ctx, hitC, rimA, 'body'); else flushOps(ctx, rimA, 'body');
    ctx.globalAlpha = 1;
    tp(a._seatL[0], a._seatL[1]);
    a._seatX = PX; a._seatY = PY; a._seatOK = true;
  }

  // ════════════════════════════════════════════════════════════
  //  每一层：定位、排序、影、画
  // ════════════════════════════════════════════════════════════
  const ENTS = [];
  function locate(p) {
    p._h = scaleOf(p);
    p._seat = null;
    if (p.attach && p._ax != null) { p._x = p._ax; p._y = p._ay; }
    else {
      p._x = p.nx * W.w;
      p._y = p.ny != null ? p.ny * W.h : footY(p);
    }
    // 大地沉入水中时，其上的人也随之隐没（旧义）
    if (p.ny == null && !p.attach && !p.mount) {
      const gy = groundY(p.layer, p._x);
      if (!isFinite(gy) || gy >= W.waterlineY(p.layer) + 2) return false;
    }
    return !(p._x < -80 || p._x > W.w + 80);
  }
  function collect(list, p, pass) {
    p._vis = false;
    if (p.delay > 0 || p.alpha < 0.01 || PASS[p.layer] !== pass) return;
    if (!locate(p)) return;
    p._vis = true;
    p._k = p._y + (p.isAnimal ? -0.02 : 0);
    list.push(p);
  }
  function drawShadows(ctx, list, pass) {
    if (LT.sh < 0.01) return;
    let any = false;
    ctx.beginPath();
    const sunDx = clamp((W.sun.x - W.w * 0.5) / (W.w * 0.5), -1, 1) * (W.daylight > 0.3 ? 1 : 0);
    for (const e of list) {
      if (e.alpha < 0.3 || e.angel || e.mount || e.ny != null || e.attach) continue;
      let w, hh, ox = 0;
      if (e.isAnimal) { w = e.M.len * e._h * (0.3 + 0.12 * e.lie); hh = 1.6 * e._h; }
      else {
        const q = e.pose;
        w = e._h * (LOW[q] ? 0.5 : q === 'sit' || q === 'sleep' || q === 'kneel' || q === 'pray' || q === 'seat' ? 0.26 : 0.17);
        hh = e._h * 0.04;
        if (LOW[q]) ox = (q === 'fall' ? 0.12 : -0.12) * e._h * (e.fd >= 0 ? 1 : -1);
      }
      ox -= sunDx * w * 0.25;
      ctx.moveTo(e._x + ox + w, e._y + 0.5);
      ctx.ellipse(e._x + ox, e._y + 0.5, w, Math.max(0.6, hh), 0, 0, TAU);
      ctx.closePath();
      any = true;
    }
    if (!any) return;
    ctx.fillStyle = U.rgba(8, 10, 16, LT.sh * (pass === 'near' ? 1 : 0.6));
    ctx.fill();
  }
  function drawPools(ctx, list) {
    // 天使脚下的一片光；夜里，有名字的人脚下也有一圈暖光，好在黑暗里认出他们
    let sp = null, wp = null;
    const night = W.night;
    for (const e of list) {
      if (e.alpha < 0.05 || e.ny != null || e.attach) continue;
      if (e.angel) {
        sp = sp || glowSprite('pale', [255, 246, 222], 1);
        const r = e._h * 0.55;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = e.alpha * (0.22 + 0.25 * night);
        ctx.drawImage(sp, e._x - r, e._y - r * 0.22, r * 2, r * 0.44);
        continue;
      }
      if (night < 0.15 || e.isAnimal || e.crowd || e.mount || !e.label) continue;
      wp = wp || glowSprite('pool', [255, 214, 160], 1);
      const r = e._h * 2.2, a = e.alpha * (0.35 + 0.15 * Math.min(1, e.glow || 0)) * c01((night - 0.15) / 0.5);
      if (a < 0.01) continue;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a;
      ctx.drawImage(wp, e._x - r, e._y - r * 0.2, r * 2, r * 0.4);
      ctx.globalAlpha = a * 0.45;
      ctx.drawImage(wp, e._x - r * 0.45, e._y - e._h * 0.75, r * 0.9, e._h * 1.1);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function draw(ctx, pass) {
    if (pass !== 'near' && pass !== 'mid' && pass !== 'far') return;
    ENTS.length = 0;
    for (const p of people.values()) collect(ENTS, p, pass);
    for (const g of crowds.values()) for (let i = 0; i < g.members.length; i++) collect(ENTS, g.members[i], pass);
    if (!ENTS.length) return;
    // 骑者紧随坐骑之后画
    for (const p of ENTS) if (p.mount) { const m = people.get(p.mount); if (m && m._vis) p._k = m._k + 0.001; }
    ENTS.sort((a, b) => a._k - b._k || a.ord - b.ord);
    drawShadows(ctx, ENTS, pass);
    drawPools(ctx, ENTS);
    const loQ = (W.quality || 1) < 0.75;
    for (const p of ENTS) {
      if (p.isAnimal) { drawAnimal(ctx, p); continue; }
      if (p.mount) {
        const m = people.get(p.mount);
        if (m && m._vis && m._seatOK) { const st = p._seatA || (p._seatA = [0, 0]); st[0] = m._seatX; st[1] = m._seatY; p._seat = st; p._x = m._x; p._y = m._y; }
      }
      if (p.age === 'baby') { drawBaby(ctx, p); continue; }
      const lo = p._h < 15 || (loQ && !!p.crowd);
      drawPerson(ctx, p, lo);
    }
    flushGlows(ctx);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function pick(x, y, r) {
    let best = null;
    const test = p => {
      if (!p.label || p.alpha < 0.3) return;
      let px, foot, hgt;
      if (p._vis) { px = p._x; foot = p._seat ? p._seat[1] + p._h * 0.3 : p._y; }
      else { px = p.nx * W.w; foot = p.ny != null ? p.ny * W.h : footY(p); }
      if (p.isAnimal) hgt = p.M.top * (p._vis ? p._h : scaleOf(p)) * (1 - 0.4 * (p.lie || 0));
      else { const h = p._vis ? p._h : scaleOf(p); hgt = LOW[p.pose] ? h * 0.2 : p.pose === 'sit' || p.pose === 'sleep' || p.pose === 'kneel' || p.pose === 'pray' ? h * 0.7 : h * 0.95; if (p._seat) hgt = h * 0.75; }
      const py = foot - hgt * 0.5;
      const d = Math.hypot(px - x, py - y);
      if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: foot - hgt, d };
    };
    for (const p of people.values()) test(p);
    for (const g of crowds.values()) g.members.forEach(test);
    return best;
  }

  // 恢复存档之后：一切立即成形、到位
  function restore() {
    const snap = p => {
      if (p.dying) return false;
      p.delay = 0; p.alpha = p.targetAlpha; p.emerge = 1; p.poseT = 1; p.via = null; p.fd = p.facing;
      if (p.fly) { p.nx = p.fly.x1; p.ny = p.fly.land ? null : p.fly.y1; if (p.fly.pose) p.pose = p.fly.pose; p.fly = null; }
      if (p.tx != null && !p.follow) {
        p.nx = p.tx; p.tx = null; p.pose = p.isAnimal ? animalPose(p.afterWalk || 'stand') : (p.afterWalk || 'stand');
        if (p.faceTo) faceNow(p);
        endFace(p);
        if (p.fadeOnArrive) return false;
      }
      p.faceEnd = null; p.fd = p.facing;
      if (p.isAnimal) { p.lie = p.pose === 'lie' ? 1 : 0; p.neck = p.pose === 'graze' ? p.M.grazeA : p.M.up; }
      p.gait = p.pose === 'walk' || p.pose === 'run' ? 1 : 0; p.run = p.pose === 'run' ? 1 : 0;
      p.holdW = p.hold ? 1 : 0;
      return true;
    };
    for (const [id, p] of people) if (!snap(p)) people.delete(id);
    for (const [gid, g] of crowds) { g.members = g.members.filter(snap); if (!g.members.length) crowds.delete(gid); }
    const prev = W.replaying; W.replaying = true;
    for (const p of people.values()) if (p.follow) settle(p);
    W.replaying = prev;
  }

  function reset() { people.clear(); crowds.clear(); }
  function init() { try { glowSprite('inner', INNER, 0.95); glowSprite('warm', WARM, 0.9); glowSprite('pale', [255, 246, 222], 1); glowSprite('flame', FLAME, 1); } catch (e) { /* 无画布时略过 */ } }

  // ── 新约里反复出场的人：各幕用同一副样子（无面目；只以衣袍、头巾与一点光相认）──
  //   用法：GS.cast.add('jesus', Object.assign({}, GS.cast.LOOK.jesus, { x: 0.6, layer: 2 }))
  //   耶稣：本色细麻的长衣、朱赭的外袍边、胸中的光略亮（glow 0.32）；复活后与登山变像时由各幕调高 glow。
  const LOOK = {
    jesus:     { label: '耶稣', sex: 'm', age: 'adult', robe: [232, 224, 206], accent: [150, 70, 58], hair: 'long', beard: true, glow: 0.32 },
    mary:      { label: '马利亚', sex: 'f', age: 'adult', robe: [96, 120, 170], accent: [226, 220, 204], hair: 'veil', glow: 0.24 },
    josephnt:  { label: '约瑟', sex: 'm', age: 'adult', robe: [136, 106, 78], accent: [196, 176, 150], beard: true, glow: 0.18 },
    baptist:   { label: '施洗约翰', sex: 'm', age: 'adult', robe: [118, 90, 60], accent: [70, 52, 36], hair: 'long', beard: true, glow: 0.22 },
    peter:     { label: '彼得', sex: 'm', age: 'adult', robe: [104, 112, 138], accent: [200, 170, 120], beard: true, glow: 0.2 },
    john:      { label: '约翰', sex: 'm', age: 'adult', robe: [150, 70, 64], accent: [220, 206, 180], hair: 'short', beard: false, glow: 0.2 },
    magdalene: { label: '抹大拉的马利亚', sex: 'f', age: 'adult', robe: [150, 84, 96], accent: [230, 214, 196], hair: 'veil', glow: 0.22 },
    paul:      { label: '保罗', sex: 'm', age: 'adult', robe: [128, 96, 72], accent: [200, 160, 100], beard: true, glow: 0.2 },
    andrew:    { label: '安得烈', sex: 'm', age: 'adult', robe: [122, 104, 84], beard: true, glow: 0.16 },
    james:     { label: '雅各', sex: 'm', age: 'adult', robe: [132, 98, 82], accent: [206, 186, 150], beard: true, glow: 0.16 },
    disciple:  { sex: 'm', age: 'adult', beard: true, glow: 0.14 },     // 其余门徒：robe 从 DISCIPLE_ROBES 里挑
  };
  const DISCIPLE_ROBES = [[122, 104, 84], [104, 92, 80], [138, 116, 92], [96, 104, 118], [132, 98, 82], [112, 118, 96], [146, 128, 104], [100, 88, 96], [126, 110, 120], [140, 104, 88], [108, 100, 86]];

  GS.cast = {
    LOOK, DISCIPLE_ROBES, light,
    init, resize() {}, update, draw, reset, restore, pick,
    add, remove, has, get, place, walk, run, pose, face, follow, glow, clear,
    crowd, crowdWalk, crowdPose, scatter, removeCrowd,
    animal, herd, prop, carry, holdHands, embrace, ride, fly, attach,
    list: () => Array.from(people.keys()),
    get people() { return people; }, get crowds() { return crowds; },
    POSES: Object.keys(POSES), KINDS: Object.keys(SPEC), _dbg: DBG,
  };
})(window.GS);
