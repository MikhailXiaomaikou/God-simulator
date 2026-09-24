/* ─────────────────────────────────────────────────────────────
 * book/pastoral.js —— 教牧书信 · 美好的仗（提摩太前书 · 提摩太后书 · 提多书）
 *
 * 灯下的一间小屋，一张矮桌，一卷书信；屋门口一条路，一直通到以弗所——提摩太和那里的教会。
 * 书信没有情节：每一句话是世上的一幅光景，照着经文显出来；一句一章，十三章十三句。
 * 先是提摩太前书与提多书（保罗在各处奔走的时候写的），末了是提摩太后书——他在罗马被囚、最后的一封信。
 *
 * 提前 1:15「基督耶稣降世，为要拯救罪人」——一点光自天顶落到地上；落在路上，沿路走进保罗的屋里：罪魁蒙了怜悯。
 * 提前 2:4「他愿意万人得救」——以弗所的人举起圣洁的手；远近各地一盏一盏的灯亮起来；「只有一位中保」：天地之间一道光。
 * 提前 3:16「神在肉身显现」——神的家立起柱石与根基；敬虔的奥秘一句一句显在天地间：显现、称义、天使、外邦、信服、荣耀。
 * 提前 4:4「凡神所造的物都是好的」——早晨，遍地开花；饼与果子摆在桌上，老年人、少年人、妇女都来，如同父母兄弟姊妹。
 * 提前 6:16「住在人不能靠近的光里」——一堆金银化作尘土随风散去；提摩太举手持定永生；天上一团人不能靠近的光，众人俯伏。
 * 多 1:2「那无谎言的神……所应许的永生」——提多带着书信上船往克里特去；中丘上各城一盏一盏点起灯（设立长老）。
 * 多 2:11「神救众人的恩典已经显明出来」——夜尽天明，晨光自东向西扫过大地，照到的人都抬起头来；众人热心为善。
 * 多 3:5「藉着重生的洗和圣灵的更新」——先是一层灰暗、彼此相背；恩慈显明，一眼泉涌出来，人人洗过，衣裳都亮了；光如雨浇灌。
 * 提后 1:7「神赐给我们，不是胆怯的心」——黄昏：屋子成了罗马的监，保罗老了，带着锁链写信；书信沿路到了提摩太手里，恩赐如火挑旺。
 * 提后 2:9「神的道却不被捆绑」——锁链在他手上，字却一个个化作光，从监里的小窗飞出去，落在远近的地上。
 * 提后 3:16「圣经都是神所默示的」——提摩太幼年的光景：外祖母、母亲与孩子同读经卷；一口气自天吹过，所有的书卷都放出光来，
 *   一缕缕光自书上升起迎着那口气；远近各地落了道的地方，都成了一卷一卷发光的书。
 * 提后 4:17「惟有主站在我旁边，加给我力量」——初次申诉，同伴都离开了；一道光站在他旁边。
 * 提后 4:8「也赐给凡爱慕他显现的人」——日落：锁链脱落，门开了，老保罗拄杖沿着金色的路走到尽头；
 *   公义的冠冕如一圈光落在他头上，随后一圈一圈落在凡爱慕主显现的人头上。「愿恩惠常与你们同在！」
 *
 * 父不显为人形；主只是光（一道光落下、一道光站在旁边）；人都无面目。锁链、审判、离世——只以光、姿势与旁白说出。
 * 画面的方位（桌面）：近地 —— 小屋 / 监（0.55）、落光之处（0.668）、审判座（0.69）、以弗所的人（0.735–0.87）、神的家（0.915）；
 *   中丘 —— 克里特的各城 / 罗马；远近的灯在远山与中丘的岭线上。竖屏的手机另有一套位置（XP）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ease = U.easeInOut;
  const ACT = 'pastoral';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('pstDescend', 'lin', 0.26);  // 提前 1:15 光自天顶落到地上（约四秒）
  W.defineLevel('pstMercy', 'lin', 0.2);     // 那光沿路走进保罗的屋里（约五秒）
  W.defineLevel('pstRoad', 'lin', 0.12);     // 路自落光之处向两头亮起
  W.defineLevel('pstAll', 'lin', 0.13);      // 万人：远近各地一盏盏灯
  W.defineLevel('pstBeam', 'exp', 0.6);      // 一位中保：天地之间一道光
  W.defineLevel('pstHidden', 'exp', 0.5);    // 住在人不能靠近的光里
  W.defineLevel('pstGrace', 'lin', 0.085);   // 恩典显明：晨光自东向西扫过
  W.defineLevel('pstPour', 'exp', 0.55);     // 圣灵厚厚浇灌
  W.defineLevel('pstWord', 'lin', 0.1);      // 神的道不被捆绑：光自小窗飞向各地
  W.defineLevel('pstScroll', 'exp', 0.8);    // 圣经都是神所默示的：书卷发光
  W.defineLevel('pstFire', 'exp', 0.45);     // 恩赐如火挑旺起来
  W.defineLevel('pstBeside', 'exp', 0.5);    // 主站在我旁边
  W.defineLevel('pstCrown', 'exp', 0.35);    // 公义的冠冕
  W.defineLevel('pstCrowns', 'lin', 0.16);   // 也赐给凡爱慕他显现的人
  const LEVELS = ['pstDescend', 'pstMercy', 'pstRoad', 'pstAll', 'pstBeam', 'pstHidden', 'pstGrace', 'pstPour', 'pstWord', 'pstScroll', 'pstFire', 'pstBeside', 'pstCrown', 'pstCrowns'];

  // ── 地上的位置（画面宽度的比例）：桌面 XD；竖屏的手机 XP ─────────
  // 桌面：小屋在树的右边（0.55），落光之处（0.668）、审判座（0.69）在屋与以弗所之间；
  //   以弗所的人自 0.735 起每隔约 0.024 站一个（至少 14 个人物尺度），神的家（0.915）与房屋在他们的右边，各有各的地方。
  // 手机：屋子与落光、审判座在岭上；以弗所的人往前站（v），在岭下的草地上，与岭上的东西前后分开。
  const XD = {
    room: 0.55, roomW: 84, guard: 0.622, land: 0.668, trib: 0.69, paulT: 0.634, paulEnd: 0.672,
    tim: 0.735, timGo: 0.715, timTeach: 0.735, stand: 0.752, bro: 0.77, eldM: 0.794, eldF: 0.818, yM: 0.842, yF: 0.866,
    church: 0.915, churchSize: 1.15, spring: 0.7, coins: 0.7, table: 0.782, vis0: 0.64, vis1: 0.668, vis2: 0.696,
    demas: 0.62, comp: 0.604, demasGo: 0.46, compGo: 0.445, yMgo: 0.64, yFgo: 0.656,
    ship0: [0.668, 0.806], ship1: [0.768, 0.768], crete: [0.6, 0.7, 0.8, 0.9], rome0: 0.55, rome1: 0.995,
    houses: [[0.97, 0.9], [1.0, 1.05]],
    // 往前站的程度（cast 的 v）；物件与人同一排
    v: { timothy: 0.1, bro: 0.1, eldM: 0.1, eldF: 0.1, yM: 0.1, yF: 0.1, demas: 0.3, comp: 0.36, vision: 0.45 },
    pv: { table: 0, spring: 0, stand: 0, coins: 0, vision: 0.45 },
    // 重生的洗：各人跪在泉的两边（人物尺度；负 = 左边）；拿杖的老人在两头
    spot: { eldM: -58, yM: -42, yF: -26, timothy: 26, bro: 42, eldF: 58 },
  };
  const XP = {
    room: 0.57, roomW: 88, guard: 0.725, land: 0.77, trib: 0.81, paulT: 0.72, paulEnd: 0.77,
    tim: 0.74, timGo: 0.7, timTeach: 0.74, stand: 0.775, bro: null, eldM: 0.8, eldF: 0.86, yM: 0.915, yF: null,
    church: 0.915, churchSize: 0.9, spring: 0.7, coins: 0.66, table: 0.77, vis0: 0.585, vis1: 0.63, vis2: 0.675,
    demas: 0.7, comp: 0.68, demasGo: 0.44, compGo: 0.425, yMgo: 0.645, yFgo: 0.605,
    ship0: [0.74, 0.79], ship1: [0.82, 0.755], crete: [0.58, 0.7, 0.82, 0.94], rome0: 0.5, rome1: 1.0,
    houses: [[1.0, 0.85]],
    v: { timothy: 0.55, eldM: 0.45, eldF: 0.62, yM: 0.5, demas: 0.3, comp: 0.38, vision: 0.62 },
    pv: { table: 0.5, spring: 0.5, stand: 0.5, coins: 0.5, vision: 0.62 },
    spot: { eldF: -40, yM: -24, timothy: 24, eldM: 40 },
  };
  let X = XD, PORT = false;
  function layout() { PORT = W.w < W.h * 0.9; X = PORT ? XP : XD; }
  const VV = id => (X.v && X.v[id]) || 0;
  const PV = k => (X.pv && X.pv[k]) || 0;

  // ── 以弗所的教会：提摩太与几个信徒（手机上人少两个，免得挤在一处）──
  const CHURCH = ['bro', 'eldM', 'eldF', 'yM', 'yF'];
  const inChurch = id => X[id] != null;
  const church = () => CHURCH.filter(inChurch);
  const PEOPLE = {
    timothy: { label: '提摩太', sex: 'm', age: 'adult', robe: [92, 122, 152], accent: [214, 200, 170], hair: 'short', beard: false, glow: 0.3 },
    titus: { label: '提多', sex: 'm', age: 'adult', robe: [108, 126, 90], accent: [204, 188, 140], beard: true, glow: 0.24 },
    bro: { label: '弟兄', sex: 'm', age: 'adult', robe: [104, 100, 122], accent: [196, 186, 170], beard: true, glow: 0.2 },
    eldM: { label: '老年人', sex: 'm', age: 'elder', robe: [122, 102, 84], accent: [206, 196, 176], glow: 0.2, prop: 'staff' },
    eldF: { label: '老年妇女', sex: 'f', age: 'elder', robe: [120, 98, 112], accent: [222, 212, 196], hair: 'veil', glow: 0.2 },
    yM: { label: '少年人', sex: 'm', age: 'adult', robe: [152, 114, 80], accent: [214, 196, 160], hair: 'short', beard: false, glow: 0.2, scale: 0.94 },
    yF: { label: '少年妇女', sex: 'f', age: 'adult', robe: [172, 118, 102], accent: [232, 218, 196], hair: 'veil', glow: 0.2, scale: 0.94 },
    guard: { label: '看守的兵', sex: 'm', age: 'adult', robe: [134, 60, 50], accent: [192, 170, 118], beard: false, hair: 'short', glow: 0.1, prop: 'spear' },
    judge: { label: '官长', sex: 'm', age: 'elder', robe: [232, 226, 212], accent: [132, 44, 60], beard: false, hair: 'short', glow: 0.08, prop: null },
    demas: { label: '底马', sex: 'm', age: 'adult', robe: [126, 110, 92], accent: [190, 176, 150], beard: true, glow: 0.12 },
    comp: { label: '同伴', sex: 'm', age: 'adult', robe: [106, 116, 102], accent: [196, 186, 166], beard: true, glow: 0.12 },
    lois: { label: '罗以', sex: 'f', age: 'elder', robe: [150, 128, 150], accent: [230, 220, 206], hair: 'veil', glow: 0.5, prop: null },
    eunice: { label: '友妮基', sex: 'f', age: 'adult', robe: [118, 140, 172], accent: [232, 222, 206], hair: 'veil', glow: 0.5 },
    child: { label: '提摩太', sex: 'm', age: 'child', robe: [204, 194, 172], hair: 'short', glow: 0.55 },
  };
  // 洗过、更新了的衣裳：本色调亮些
  const renewRobe = c => [Math.round(c[0] + (244 - c[0]) * 0.45), Math.round(c[1] + (240 - c[1]) * 0.45), Math.round(c[2] + (230 - c[2]) * 0.45)];

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { chain: 0, fireAt: '', timScroll: 0, titLetter: 0, renewed: 0, paulOld: 0, child: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.8 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  // 以人物的尺度（s）偏移一段：xo(0.7, 30) = 0.7 右边 30 个 s
  const xo = (xf, ds, l) => xf + (ds * LS(l == null ? 2 : l)) / W.w;
  // 往前（v）之后的地面：与人物模块的 footY 同一算法（近地：v × 岭下的高 × 0.8）
  const gYv = (xf, v) => { const g = gY(2, xf); return v ? g + v * Math.max(0, W.h - g) * 0.8 : g; };
  const pY = (p, xf) => gYv(xf == null ? p.x : xf, p.layer === 2 ? p.v || 0 : 0);

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return !!c && (c.has ? c.has(id) : !!(c.get && c.get(id))); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function person(id, o) { return add(id, Object.assign({}, PEOPLE[id] || {}, { layer: 2 }, o)); }
  function paulAdd(o) { return add('paul', Object.assign({}, LOOK().paul || { label: '保罗', sex: 'm', robe: [128, 96, 72], beard: true, glow: 0.2 }, { layer: 2 }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function place(id, x) { if (!has(id)) return; C().place(id, x); const f = fig(id); if (f) f.ny = null; }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); }
  function rm(id, now) {
    const f = fig(id);
    if (!f) return;
    attach(id, null);
    f.follow = null; f.tx = null; f.fly = null; f.ny = null;
    C().remove(id, now ? { fade: false } : undefined);
  }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  // 人物身上的一点（像素）：up = 自脚起的高（身高的比例），fwd = 向前（面朝的一边）
  function figPt(id, up, fwd) {
    const f = fig(id);
    if (!f) return null;
    const h = f._vis && f._h ? f._h : 34 * LS(f.layer == null ? 2 : f.layer);
    const x = f._vis && isFinite(f._x) ? f._x : f.nx * W.w, y = f._vis && isFinite(f._y) ? f._y : gY(f.layer == null ? 2 : f.layer, f.nx);
    const d = f.fd == null ? (f.facing || 1) : f.fd;
    return [x + d * (fwd || 0) * h, y - (up || 0) * h, h, d];
  }
  const headOf = (id, k) => figPt(id, k == null ? 1 : k, 0) || [W.w * 0.7, W.h * 0.8, 40, 1];
  // 手的位置（按姿势估计）：[向前, 高]
  const HAND = { seat: [0.25, 0.36], sit: [0.2, 0.24], stand: [0.08, 0.45], walk: [0.08, 0.45], raise: [0.06, 1.02], carry: [0.27, 0.62], point: [0.36, 0.72], kneel: [0.18, 0.32], pray: [0.1, 0.62], gaze: [0.06, 0.44], bow: [0.26, 0.3] };
  function handOf(id) {
    const f = fig(id);
    if (!f) return null;
    const q = HAND[f.pose] || HAND.stand;
    return figPt(id, q[1], q[0]);
  }
  function nameOver(b, xf, yPx, str, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || 44 * u, (W.w * 0.6) / (n * 1.08)));
    const cy = Math.max(yPx, (PORT ? W.h * 0.34 : W.h * 0.14) + size * 0.5);
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(xf * W.w, half + 8, W.w - half - 8);
    const src = o.src || (() => [cx + (Math.random() - 0.5) * 60 * u, cy + 40 * u + Math.random() * 30 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 232, 180], src, { hold: o.hold || 3.2 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function sparkleAt(b, x, y, n, rgb, spread) { if (!b.instant && fx()) fx().sparkle(x, y, n || 18, rgb || [255, 236, 190], (spread || 14) * SU(), 'top'); }
  function sparkleOn(b, id, n, rgb, up) { const h = figPt(id, up == null ? 0.6 : up, 0); if (h) sparkleAt(b, h[0], h[1], n, rgb); }
  function ringOn(b, id, r, rgb, up) {
    if (b.instant || !fx()) return;
    const h = figPt(id, up == null ? 0.55 : up, 0);
    if (h) fx().ring(h[0], h[1], rgb || [255, 240, 204], M() * (r || 0.2), 2.4, 1.6);
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  const lvl = k => W.lv[k] || 0;

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // 缓动的量（每秒的线性步长 × 物件自己的 sp）：a 显隐 · k、k2 各物自己的状态 · lit 灯 · open 门 · grow 升起
  const EASE = { a: 0.7, k: 0.4, k2: 0.45, lit: 0.6, open: 0.6, grow: 0.16 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, layer: 2, size: 1, w: 84, v: 0, label: '', style: '', sp: 1, seed: hashStr(id) };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
    }
    for (const k of ['x', 'x0', 'x1', 'layer', 'size', 'w', 'v', 'label', 'style', 'sp']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (W.replaying) snap(p);
    return p;
  }
  function unprop(id) {
    const p = P.get(id);
    if (!p) return;
    if (W.replaying) { P.delete(id); return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function efx(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

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
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([226, 234, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
        dawn: radial([255, 214, 150], 1, 0.45), grey: radial([60, 64, 76], 1, 0.5),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,246,222,0)'); hz.addColorStop(0.5, 'rgba(255,250,236,1)'); hz.addColorStop(1, 'rgba(255,246,222,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.25)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
      // 自书卷升起的一缕细光：底下亮，往上渐淡
      const c2 = cnv(32, 256), g2 = c2.getContext('2d');
      const h2 = g2.createLinearGradient(0, 0, 32, 0);
      h2.addColorStop(0, 'rgba(255,236,190,0)'); h2.addColorStop(0.5, 'rgba(255,246,220,1)'); h2.addColorStop(1, 'rgba(255,236,190,0)');
      g2.fillStyle = h2; g2.fillRect(0, 0, 32, 256);
      g2.globalCompositeOperation = 'destination-in';
      const v2 = g2.createLinearGradient(0, 0, 0, 256);
      v2.addColorStop(0, 'rgba(0,0,0,0)'); v2.addColorStop(0.6, 'rgba(0,0,0,0.45)'); v2.addColorStop(1, 'rgba(0,0,0,1)');
      g2.fillStyle = v2; g2.fillRect(0, 0, 32, 256);
      SP.col = c2;
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;
  function glowAt(img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  const lighter = ctx => { ctx.globalCompositeOperation = 'lighter'; };
  const normal = ctx => { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; };
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    lighter(ctx);
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(SP.warm, x, y - h * 0.45, h * 2.4, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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
    normal(ctx);
  }
  // 一卷书（横着的）：纸、两头的轴；bright 发光
  function scrollAt(ctx, x, y, w, open, bright, a, l) {
    if (a < 0.02) return;
    l = l == null ? 2 : l;
    const h = w * 0.34, ww = w * (0.3 + 0.7 * open);
    ctx.globalAlpha = a;
    ctx.fillStyle = css([236, 222, 188], l, 1, 0.15 + 0.4 * bright);
    ctx.fillRect(x - ww / 2, y - h / 2, ww, h);
    ctx.fillStyle = css([112, 84, 58], l);
    ctx.fillRect(x - ww / 2 - w * 0.06, y - h * 0.62, w * 0.08, h * 1.24);
    ctx.fillRect(x + ww / 2 - w * 0.02, y - h * 0.62, w * 0.08, h * 1.24);
    if (open > 0.4) {
      ctx.fillStyle = bright > 0.05 ? rgba([255, 226, 160], 0.9 * a) : css([70, 52, 40], l, 0.75 * a);
      for (let i = 0; i < 3; i++) ctx.fillRect(x - ww * 0.36, y - h * 0.26 + i * h * 0.24, ww * 0.72 * (i === 2 ? 0.6 : 1), Math.max(0.5, h * 0.08));
    }
    if (bright > 0.02 && SP) { lighter(ctx); glowAt(SP.gold, x, y, w * 1.3, bright * a * 0.55); normal(ctx); }
    ctx.globalAlpha = 1;
  }
  // 圣经都是神所默示的（3:16）：每一卷书放出一大团金光，并有一缕细光自书上升起，迎着那口气
  //   s = 人物尺度；k = 程度（× 显隐）；col = 光柱的高（像素，0 = 不要光柱）
  function radiance(ctx, x, y, s, k, col) {
    if (k < 0.01 || !SP) return;
    const nk = nightK(), a = k * (0.5 + 0.3 * nk), tw = 0.88 + 0.12 * Math.sin(W.t * 1.9 + x * 0.013);
    lighter(ctx);
    glowAt(SP.gold, x, y, 46 * s, 0.72 * a * tw, 0.9);
    glowAt(SP.white, x, y, 11 * s, 0.85 * a);
    const ck = sm(0.45, 0.9, k);
    if (col > 0 && ck > 0.01 && SP.col) {
      const w = 4.5 * s * (0.9 + 0.1 * tw);
      ctx.globalAlpha = clamp(0.6 * ck * a * tw, 0, 1);
      ctx.drawImage(SP.col, x - w, y - col, w * 2, col);
    }
    normal(ctx);
  }

  // ════════════════════════════════════════════════════════════
  //  画：灯下的小屋（前面敞开）/ 罗马的监
  // ════════════════════════════════════════════════════════════
  const HP = () => 34 * LS(2);          // 近地上一个人的身高（像素）
  function roomG(p) {
    const s = LS(2), cx = p.x * W.w, w = p.w * s, x0 = cx - w / 2, x1 = cx + w / 2;
    const y = Math.max(gY(2, x0 / W.w), gY(2, x1 / W.w), gY(2, p.x), gY(2, (x0 + w * 0.25) / W.w), gY(2, (x0 + w * 0.75) / W.w)) + 2 * s;
    const h = 52 * s;
    return { s, cx, w, x0, x1, y, h, top: y - h };
  }
  const roomX = f => { const p = getP('study') || getP('cell'); if (!p) return X.room; const G = roomG(p); return (G.x0 + f * G.w) / W.w; };
  const SEAT_F = 0.4, DESK_F = 0.62;
  // 屋里的人站在屋里的地上（出了屋，站在地上）
  function onFloor(id) {
    attach(id, () => {
      const f = fig(id), p = getP('study') || getP('cell');
      if (!f) return null;
      if (!p) return [f.nx * W.w, gY(2, f.nx)];
      const G = roomG(p), x = f.nx * W.w;
      return [x, x > G.x0 - 2 && x < G.x1 + 2 ? G.y : gY(2, f.nx)];
    });
  }
  function drawRoom(ctx, p) {
    const G = roomG(p), s = G.s, cell = p.style === 'cell', hp = HP();
    const st = cell ? [150, 144, 136] : [212, 192, 156];
    const nk = nightK(), lamp = p.lit * (0.3 + 0.7 * nk);
    ctx.globalAlpha = p.a;
    // 后墙（屋里：暗些）
    ctx.fillStyle = css(mul(st, cell ? 0.4 : 0.5), 2, 1, -0.05);
    ctx.fillRect(G.x0, G.top, G.w, G.h);
    if (cell) {
      ctx.strokeStyle = css(mul(st, 0.3), 2, 0.7); ctx.lineWidth = Math.max(0.5, 0.5 * s);
      ctx.beginPath();
      for (let r = 0; r < 7; r++) {
        const y = G.top + (r + 1) * G.h / 7.4;
        ctx.moveTo(G.x0, y); ctx.lineTo(G.x1, y);
        for (let c = 0; c < 6; c++) { const x = G.x0 + ((c + (r % 2) * 0.5) / 6) * G.w; ctx.moveTo(x, y); ctx.lineTo(x, y - G.h / 7.4); }
      }
      ctx.stroke();
    }
    // 灯照亮后墙的一片（灯在桌上）
    const dx = G.x0 + G.w * DESK_F;
    if (lamp > 0.02 && SP) { lighter(ctx); glowAt(SP.warm, dx, G.y - hp * 0.5, G.w * 0.58, 0.3 * lamp * p.a, 0.75); normal(ctx); ctx.globalAlpha = p.a; }
    // 窗：小屋是一扇拱窗（看得见外面的天）；监里是高处的小窗，三根铁栏
    const sky = W.shadeCSS([150, 172, 204], 0.2, 1, 0.1);
    if (!cell) {
      const wx = G.x0 + G.w * 0.17, wy = G.top + G.h * 0.22, ww = 9 * s, wh = 13 * s;
      ctx.fillStyle = sky;
      ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + wh); ctx.lineTo(wx - ww / 2, wy + ww / 2); ctx.arc(wx, wy + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww / 2, wy + wh); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(mul(st, 0.62), 2); ctx.fillRect(wx - 0.5 * s, wy, 1 * s, wh);
      // 架子上的书卷（右边）
      for (let r = 0; r < 2; r++) {
        const sy = G.top + G.h * (0.3 + r * 0.24), sx0 = G.x0 + G.w * 0.72, sx1 = G.x0 + G.w * 0.93;
        ctx.fillStyle = css([96, 72, 50], 2); ctx.fillRect(sx0, sy, sx1 - sx0, 1.6 * s);
        for (let i = 0; i < 5; i++) {
          const cx = sx0 + (i + 0.5) * (sx1 - sx0) / 5, cy = sy - 2.2 * s;
          ctx.fillStyle = css([226, 210, 176], 2, 1, 0.1 + 0.5 * lvl('pstScroll'));
          ctx.beginPath(); ctx.arc(cx, cy, 2 * s, 0, TAU); ctx.fill();
          ctx.fillStyle = css([150, 120, 86], 2); ctx.beginPath(); ctx.arc(cx, cy, 0.7 * s, 0, TAU); ctx.fill();
        }
      }
    } else {
      const wx = G.x0 + G.w * 0.5, wy = G.top + G.h * 0.14, ww = 11 * s, wh = 7 * s;
      ctx.fillStyle = sky; ctx.fillRect(wx - ww / 2, wy, ww, wh);
      ctx.fillStyle = css([60, 58, 56], 2);
      for (let i = 1; i < 4; i++) ctx.fillRect(wx - ww / 2 + (ww * i) / 4 - 0.6 * s, wy, 1.2 * s, wh);
      // 墙上的铁环（锁链拴在这里）
      const rx = G.x0 + G.w * 0.2, ry = G.y - hp * 0.5;
      ctx.strokeStyle = css([70, 66, 62], 2); ctx.lineWidth = Math.max(0.6, 1 * s);
      ctx.beginPath(); ctx.arc(rx, ry, 2 * s, 0, TAU); ctx.stroke();
      // 地上的书与皮卷（4:13）
      for (let i = 0; i < 4; i++) {
        const bx = G.x0 + G.w * (0.08 + i * 0.045), by = G.y - 1.6 * s - (i === 3 ? 3 * s : 0);
        ctx.fillStyle = css(i % 2 ? [226, 212, 180] : [196, 170, 130], 2, 1, 0.1 + 0.5 * lvl('pstScroll'));
        ctx.beginPath(); ctx.ellipse(bx, by, 3.2 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
      }
      if (lvl('pstScroll') > 0.02) { radiance(ctx, G.x0 + G.w * 0.14, G.y - 3 * s, s * 0.85, lvl('pstScroll') * p.a, 0); ctx.globalAlpha = p.a; }
    }
    // 门（右边）：小屋是木门；监是铁栏的门。开时透出外面
    const dxc = G.x0 + G.w * 0.91, dw = 12 * s, dh = 30 * s, dy = G.y - dh;
    ctx.fillStyle = W.shadeCSS([40, 52, 76], 0.3, 1, 0.05 + 0.3 * W.daylight);
    ctx.fillRect(dxc - dw / 2, dy, dw, dh);
    const leaf = dw * (1 - 0.8 * p.open);
    if (!cell) {
      ctx.fillStyle = css([112, 82, 56], 2);
      ctx.fillRect(dxc - dw / 2, dy, leaf, dh);
    } else {
      ctx.fillStyle = css([58, 56, 54], 2);
      ctx.fillRect(dxc - dw / 2, dy, leaf, 1.4 * s); ctx.fillRect(dxc - dw / 2, dy + dh * 0.5, leaf, 1.2 * s);
      for (let i = 0; i <= 4; i++) ctx.fillRect(dxc - dw / 2 + (leaf * i) / 4 - 0.5 * s, dy, 1 * s, dh);
    }
    if (p.open > 0.05 && SP) { lighter(ctx); glowAt(SP.gold, dxc, G.y - dh * 0.45, dh * 0.8, 0.3 * p.open * p.a * (0.4 + 0.6 * nk)); normal(ctx); ctx.globalAlpha = p.a; }
    // 板凳（保罗坐的）
    const bx = G.x0 + G.w * SEAT_F, by = G.y - hp * 0.25;
    ctx.fillStyle = css([100, 76, 54], 2);
    ctx.fillRect(bx - hp * 0.12, by, hp * 0.24, 1.4 * s);
    ctx.fillRect(bx - hp * 0.1, by, 1.2 * s, G.y - by); ctx.fillRect(bx + hp * 0.1 - 1.2 * s, by, 1.2 * s, G.y - by);
    // 屋顶的梁、两边的墙、屋顶（屋外的颜色）
    ctx.fillStyle = css(mul(st, 0.36), 2);
    for (let i = 1; i < 5; i++) ctx.fillRect(G.x0 + (G.w * i) / 5 - 1.2 * s, G.top, 2.4 * s, 3 * s);
    ctx.fillStyle = css(st, 2);
    ctx.fillRect(G.x0 - 5 * s, G.top - 5 * s, 5 * s, G.h + 7 * s);
    ctx.fillRect(G.x1, G.top - 5 * s, 5 * s, G.h + 7 * s);
    ctx.fillRect(G.x0 - 7 * s, G.top - 7 * s, G.w + 14 * s, 5 * s);
    ctx.fillStyle = css(mul(st, 0.82), 2);
    ctx.fillRect(G.x0 - 7 * s, G.top - 10 * s, G.w + 14 * s, 3 * s);
    if (cell) {
      // 监的外墙：一道道石缝
      ctx.strokeStyle = css(mul(st, 0.6), 2, 0.8); ctx.lineWidth = Math.max(0.5, 0.5 * s);
      ctx.beginPath();
      for (let r = 0; r < 8; r++) { const y = G.top - 5 * s + r * (G.h + 7 * s) / 8; ctx.moveTo(G.x0 - 5 * s, y); ctx.lineTo(G.x0, y); ctx.moveTo(G.x1, y); ctx.lineTo(G.x1 + 5 * s, y); }
      ctx.stroke();
    }
    // 屋里的地
    ctx.fillStyle = css(mul(st, 0.7), 2);
    ctx.fillRect(G.x0 - 5 * s, G.y - 1 * s, G.w + 10 * s, 3 * s);
    // 迎光的边
    ctx.strokeStyle = css([252, 238, 210], 2, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(G.x0 - 7 * s, G.top - 10 * s); ctx.lineTo(G.x1 + 7 * s, G.top - 10 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 桌（画在人的前面）：一卷书信、墨、一盏泥灯
  function drawDesk(ctx, p) {
    const G = roomG(p), s = G.s, cell = p.style === 'cell', hp = HP();
    const x = G.x0 + G.w * DESK_F, y = G.y, top = y - hp * 0.3;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(cell ? [92, 82, 70] : [120, 90, 62], 2);
    ctx.fillRect(x - hp * 0.24, top, hp * 0.48, 1.8 * s);
    if (cell) { ctx.fillStyle = css([118, 112, 104], 2); ctx.fillRect(x - hp * 0.2, top + 1.8 * s, hp * 0.1, y - top - 1.8 * s); ctx.fillRect(x + hp * 0.1, top + 1.8 * s, hp * 0.1, y - top - 1.8 * s); }
    else { ctx.fillRect(x - hp * 0.21, top, 1.4 * s, y - top); ctx.fillRect(x + hp * 0.21 - 1.4 * s, top, 1.4 * s, y - top); }
    ctx.fillStyle = css([150, 118, 84], 2, 1, 0.05);
    ctx.fillRect(x - hp * 0.24, top - 0.4 * s, hp * 0.48, 0.8 * s);
    // 书信：摊开在桌上；写的时候与默示的时候发光
    const br = clamp(p.k2 * 0.7 + lvl('pstScroll'), 0, 1.2);
    scrollAt(ctx, x - hp * 0.06, top - 1.4 * s, hp * 0.26, 1, br, p.a);
    if (lvl('pstScroll') > 0.01) radiance(ctx, x - hp * 0.06, top - 1.4 * s, s, lvl('pstScroll') * p.a, W.h * (PORT ? 0.26 : 0.34));
    ctx.globalAlpha = p.a;
    // 墨盒与笔
    ctx.fillStyle = css([40, 34, 30], 2);
    ctx.beginPath(); ctx.ellipse(x + hp * 0.1, top - 1 * s, 1.4 * s, 1 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([150, 130, 96], 2); ctx.lineWidth = Math.max(0.5, 0.5 * s);
    ctx.beginPath(); ctx.moveTo(x + hp * 0.1, top - 1.5 * s); ctx.lineTo(x + hp * 0.14, top - 5 * s); ctx.stroke();
    // 泥灯
    const lx = x + hp * 0.19, ly = top - 1 * s;
    ctx.fillStyle = css([164, 112, 74], 2);
    ctx.beginPath(); ctx.ellipse(lx, ly, 2.6 * s, 1.2 * s, 0, 0, TAU); ctx.fill();
    if (p.lit > 0.02) {
      flame(ctx, lx + 1.6 * s, ly - 0.6 * s, 3.2 * s, p.lit * p.a, p.seed);
      if (SP) { lighter(ctx); glowAt(SP.warm, lx, ly - 4 * s, hp * 1.25, p.lit * p.a * (0.1 + 0.32 * nightK()), 0.8); normal(ctx); }
    }
    ctx.globalAlpha = 1;
  }
  // 锁链：墙上的铁环 → 保罗的手
  function drawChain(ctx) {
    const p = getP('cell');
    if (!S.chain || !p || p.a < 0.05 || !has('paul')) return;
    const f = fig('paul');
    if (!f || !f._vis) return;
    const G = roomG(p), s = G.s, hp = HP();
    const hnd = handOf('paul');
    if (!hnd) return;
    if (hnd[0] < G.x0 || hnd[0] > G.x1 - 6 * s) return;
    const ax = G.x0 + G.w * 0.2, ay = G.y - hp * 0.5, bx = hnd[0], by = hnd[1];
    const sag = Math.max(4 * s, Math.abs(bx - ax) * 0.25);
    const n = Math.max(6, Math.round(Math.hypot(bx - ax, by - ay) / (2.4 * s)));
    ctx.globalAlpha = p.a * f.alpha;
    ctx.strokeStyle = css([64, 62, 60], 2); ctx.lineWidth = Math.max(0.6, 0.7 * s);
    const glint = FXL.some(e => e.type === 'glint');
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = lerp(ax, bx, t), y = lerp(ay, by, t) + Math.sin(Math.PI * t) * sag;
      ctx.beginPath(); ctx.ellipse(x, y, 1.2 * s, 0.75 * s, i % 2 ? 0 : Math.PI / 2, 0, TAU); ctx.stroke();
    }
    // 灯光在铁上的一点亮
    if (SP) {
      lighter(ctx);
      const k = (0.15 + 0.35 * nightK()) * p.a * f.alpha + (glint ? 0.6 : 0);
      for (let i = 1; i < 4; i++) { const t = i / 4; glowAt(SP.gold, lerp(ax, bx, t), lerp(ay, by, t) + Math.sin(Math.PI * t) * sag, 3 * s, k * 0.5); }
      normal(ctx);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：路、以弗所（房屋、神的家、桌、泉、灯台）、金银、审判座、异象
  // ════════════════════════════════════════════════════════════
  function drawRoad(ctx, p) {
    const l = 2, s = LS(l), N = 56;
    ctx.globalAlpha = p.a;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? css([226, 206, 164], l, 0.5, 0.05) : css([176, 150, 110], l, 0.55);
      ctx.lineWidth = (pass ? 2.2 : 5) * s;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const f = lerp(p.x0, p.x1, i / N), y = gY(l, f) + (pass ? 3.2 : 3.6) * s; if (i) ctx.lineTo(f * W.w, y); else ctx.moveTo(f * W.w, y); }
      ctx.stroke();
    }
    // 亮起的路：自落光之处向两头（1:15）；末了整条路成了金色（4:7 当跑的路）
    const r = lvl('pstRoad'), gold = p.k;
    if ((r > 0.005 || gold > 0.01) && SP) {
      lighter(ctx);
      const c = X.land, reach = r * 0.42;
      for (let i = 0; i <= N; i += 2) {
        const f = lerp(p.x0, p.x1, i / N), d = Math.abs(f - c);
        const lit = Math.max(clamp((reach - d) * 30, 0, 1) * 0.55, gold);
        if (lit < 0.02) continue;
        const y = gY(l, f) + 3.3 * s, tw = 0.75 + 0.25 * Math.sin(W.t * 1.7 + i * 0.9);
        glowAt(SP.gold, f * W.w, y, 6.5 * s * (1 + gold), lit * tw * (0.25 + 0.35 * nightK() + 0.3 * gold) * p.a, 0.5);
      }
      normal(ctx);
    }
    ctx.globalAlpha = 1;
  }
  // 以弗所的房屋：平顶的小屋，夜里窗里有灯
  function drawHouses(ctx, p) {
    const l = 2, s = LS(l);
    ctx.globalAlpha = p.a;
    for (let i = 0; i < X.houses.length; i++) {
      const q = X.houses[i], xf = q[0], x = xf * W.w, y = gY(l, xf) + 2 * s, w = 20 * s * q[1], h = (15 + 4 * hsh(i * 3.3)) * s * q[1];
      const tone = [[206, 186, 150], [196, 176, 140], [214, 196, 160], [190, 170, 136]][i % 4];
      const d = W.core.x >= x ? 1 : -1;
      ctx.fillStyle = css(tone, l);
      ctx.fillRect(x - w / 2, y - h, w, h + 3 * s);
      ctx.fillStyle = css(mul(tone, 0.72), l, 0.85);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.22, y - h, w * 0.22, h);
      ctx.fillStyle = css(mul(tone, 0.8), l);
      ctx.fillRect(x - w / 2 - 1.2 * s, y - h - 1.8 * s, w + 2.4 * s, 2 * s);
      ctx.fillStyle = css([44, 36, 30], l);
      ctx.fillRect(x - 2 * s, y - 8 * s, 4 * s, 8 * s);
      const wx = x + w * 0.22, wy = y - h * 0.68;
      ctx.fillRect(wx, wy, 2.6 * s, 2.6 * s);
      const lk = nightK() * p.a * (0.55 + 0.45 * lvl('pstAll'));
      if (lk > 0.03 && SP) {
        lighter(ctx);
        ctx.globalAlpha = Math.min(1, lk);
        ctx.fillStyle = 'rgb(255,184,104)';
        ctx.fillRect(wx, wy, 2.6 * s, 2.6 * s);
        glowAt(SP.lamp, wx + 1.3 * s, wy + 1.3 * s, 12 * s, lk * 0.5);
        normal(ctx); ctx.globalAlpha = p.a;
      }
      ctx.strokeStyle = css([252, 238, 210], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x - w / 2 - 1.2 * s, y - h - 1.8 * s); ctx.lineTo(x + w / 2 + 1.2 * s, y - h - 1.8 * s); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 神的家：永生神的教会，真理的柱石和根基（3:15）——根基先亮，柱子一根根立起，末了是檐与山花
  function drawChurch(ctx, p) {
    const l = 2, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, g = p.grow;
    const w = 46 * s, colH = 26 * s;
    const eb = sm(0, 0.25, g), ec = sm(0.2, 0.75, g), er = sm(0.7, 1, g);
    const tone = [222, 210, 186];
    ctx.globalAlpha = p.a;
    // 根基（两级台阶）
    ctx.fillStyle = css(mul(tone, 0.86), l);
    ctx.fillRect(x - w / 2 - 4 * s, y - 3 * s * eb, w + 8 * s, 3 * s * eb + 2 * s);
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - w / 2 - 1.5 * s, y - 5.5 * s * eb, w + 3 * s, 2.5 * s * eb);
    const base = y - 5.5 * s * eb;
    // 里面的墙（暗）与夜里的光
    if (ec > 0.01) {
      ctx.fillStyle = css(mul(tone, 0.45), l, ec);
      ctx.fillRect(x - w * 0.42, base - colH * ec, w * 0.84, colH * ec);
      const lk = (0.25 + 0.75 * nightK()) * ec * p.a;
      if (SP && lk > 0.02) {
        // 夜里：里面点着灯，暖光从柱子之间透出来
        lighter(ctx);
        ctx.globalAlpha = clamp(0.4 * lk * nightK(), 0, 1); ctx.fillStyle = 'rgb(255,178,96)';
        ctx.fillRect(x - w * 0.42, base - colH * ec, w * 0.84, colH * ec);
        glowAt(SP.warm, x, base - colH * 0.4, w * 0.66, 0.75 * lk, 0.8);
        glowAt(SP.lamp, x, base - colH * 0.3, w * 0.22, 0.6 * lk * nightK());
        normal(ctx); ctx.globalAlpha = p.a;
      }
      // 柱子：四根，一根接一根立起
      for (let i = 0; i < 4; i++) {
        const k = sm(0.2 + i * 0.1, 0.5 + i * 0.08, g), cx = x - w * 0.4 + (i * w * 0.8) / 3;
        if (k < 0.01) continue;
        ctx.fillStyle = css(tone, l, 1, 0.08);
        ctx.fillRect(cx - 2.2 * s, base - colH * k, 4.4 * s, colH * k);
        ctx.fillStyle = css(mul(tone, 0.78), l);
        ctx.fillRect(cx + 0.8 * s, base - colH * k, 1.4 * s, colH * k);
        ctx.fillStyle = css(tone, l);
        ctx.fillRect(cx - 3 * s, base - colH * k - 1.4 * s, 6 * s, 1.6 * s);
      }
    }
    // 檐与山花
    if (er > 0.01) {
      const ty = base - colH - 1.4 * s;
      ctx.globalAlpha = p.a * er;
      ctx.fillStyle = css(tone, l);
      ctx.fillRect(x - w / 2, ty - 4 * s, w, 4 * s);
      ctx.fillStyle = css(mul(tone, 0.92), l);
      ctx.beginPath(); ctx.moveTo(x - w / 2 - 1.5 * s, ty - 4 * s); ctx.lineTo(x, ty - 14 * s); ctx.lineTo(x + w / 2 + 1.5 * s, ty - 4 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([252, 238, 210], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x - w / 2 - 1.5 * s, ty - 4 * s); ctx.lineTo(x, ty - 14 * s); ctx.lineTo(x + w / 2 + 1.5 * s, ty - 4 * s); ctx.stroke();
    }
    // 立起的时候：根基里一层金光
    if (g < 0.999 && g > 0.001 && SP) {
      lighter(ctx);
      glowAt(SP.gold, x, y - 3 * s, w * 0.9, 0.9 * Math.sin(Math.PI * g) * p.a, 0.35);
      glowAt(SP.white, x, y - 3 * s, w * 0.4, 0.6 * Math.sin(Math.PI * g) * p.a, 0.4);
      normal(ctx);
    }
    ctx.globalAlpha = 1;
  }
  // 桌：饼、果子、杯（4:4 感谢着领受）
  function drawTable(ctx, p) {
    const l = 2, s = LS(l) * (1 + 0.35 * (p.v || 0)), x = p.x * W.w, y = pY(p) + 3 * s, w = (PORT ? 30 : 40) * s, e = p.grow;
    if (e < 0.01) return;
    ctx.globalAlpha = p.a * e;
    ctx.fillStyle = css([126, 94, 64], l);
    ctx.fillRect(x - w / 2, y - 9 * s, w, 2 * s);
    ctx.fillRect(x - w / 2 + 2 * s, y - 7 * s, 1.6 * s, 7 * s); ctx.fillRect(x + w / 2 - 3.6 * s, y - 7 * s, 1.6 * s, 7 * s);
    ctx.fillStyle = css([236, 226, 204], l, 0.9, 0.05);
    ctx.fillRect(x - w / 2 - 0.6 * s, y - 9.6 * s, w + 1.2 * s, 1 * s);
    const items = PORT ? 5 : 7;
    for (let i = 0; i < items; i++) {
      const ix = x - w * 0.4 + (i * w * 0.8) / (items - 1), kind = i % 3;
      if (kind === 0) { ctx.fillStyle = css([214, 168, 106], l, 1, 0.1); ctx.beginPath(); ctx.ellipse(ix, y - 11 * s, 2.8 * s, 1.5 * s, 0, 0, TAU); ctx.fill(); }
      else if (kind === 1) { ctx.fillStyle = css([[200, 60, 56], [226, 150, 54], [120, 70, 120]][i % 3], l, 1, 0.1); for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(ix - 1.4 * s + j * 1.4 * s, y - 10.8 * s - (j === 1 ? 1.2 * s : 0), 1.1 * s, 0, TAU); ctx.fill(); } }
      else { ctx.fillStyle = css([176, 128, 84], l); ctx.fillRect(ix - 1 * s, y - 13 * s, 2 * s, 3.2 * s); }
    }
    if (SP && p.k > 0.01) { lighter(ctx); glowAt(SP.gold, x, y - 11 * s, w * 0.7, 0.3 * p.k * p.a, 0.35); normal(ctx); }
    ctx.globalAlpha = 1;
  }
  // 泉：重生的洗（多 3:5）——地上涌出一眼泉，水面发光
  function drawSpring(ctx, p) {
    const l = 2, s = LS(l) * (1 + 0.35 * (p.v || 0)), x = p.x * W.w, y = pY(p) + 3.5 * s, e = p.grow;
    if (e < 0.01) return;
    const rw = 15 * s * e;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([112, 104, 94], l);
    ctx.beginPath(); ctx.ellipse(x, y, rw + 2 * s, 3.4 * s * e + 1 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = W.shadeCSS([90, 150, 200], 0.1, 1, 0.2);
    ctx.beginPath(); ctx.ellipse(x, y - 0.4 * s, rw, 2.6 * s * e, 0, 0, TAU); ctx.fill();
    if (SP) {
      lighter(ctx);
      const k = p.k * p.a;
      glowAt(SP.pale, x, y - 1 * s, rw * 1.3, (0.25 + 0.3 * nightK()) * k, 0.35);
      // 泉上升起的一股柔光（在跪着的人中间看得见）
      glowAt(SP.pale, x, y - 12 * s, 11 * s, 0.5 * k, 2.2);
      glowAt(SP.white, x, y - 4 * s, 5 * s, 0.6 * k, 1.6);
      // 涌上来的水（一股光）
      for (let i = 0; i < 6; i++) {
        const ph = (W.t * 0.9 + i / 6) % 1, h = 18 * s * k;
        ctx.globalAlpha = 0.5 * k * Math.sin(Math.PI * ph);
        ctx.fillStyle = 'rgb(220,236,255)';
        ctx.beginPath(); ctx.arc(x + Math.sin(i * 2.1 + W.t) * 2 * s, y - 2 * s - ph * h, 1.1 * s, 0, TAU); ctx.fill();
      }
      normal(ctx);
    }
    ctx.globalAlpha = 1;
  }
  // 灯台：提摩太把挑旺的火放在上面（火画在「air」）
  function standTop(p) { const s = LS(2) * (1 + 0.35 * (p.v || 0)); return [p.x * W.w, pY(p) - 30 * s]; }
  function drawStand(ctx, p) {
    const l = 2, s = LS(l) * (1 + 0.35 * (p.v || 0)), x = p.x * W.w, y = pY(p) + 2 * s, top = standTop(p)[1];
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 118, 64], l, 1, 0.1);
    ctx.fillRect(x - 0.8 * s, top, 1.6 * s, y - top);
    ctx.beginPath(); ctx.moveTo(x - 5 * s, y); ctx.lineTo(x, y - 4 * s); ctx.lineTo(x + 5 * s, y); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, top, 3.6 * s, 1.3 * s, 0, 0, Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 一堆金银（6:7、6:10）：先闪着光，后化作尘土随风散去
  function drawCoins(ctx, p) {
    const l = 2, s = LS(l) * (1 + 0.35 * (p.v || 0)), x = p.x * W.w, y = pY(p) + 3 * s, k = 1 - p.k2;
    ctx.globalAlpha = p.a;
    const n = 26;
    for (let i = 0; i < n; i++) {
      const r = hsh(i * 3.7), ox = (hsh(i * 1.9) - 0.5) * 16 * s * (1 - 0.5 * r), oy = -r * 6 * s * (1 - Math.abs(ox) / (10 * s));
      const t = clamp(p.k2 * 1.6 - hsh(i * 7.1) * 0.6, 0, 1);
      if (t >= 1) continue;
      const dx = t * (30 + 40 * hsh(i)) * s, dy = -t * (10 + 20 * hsh(i * 2.2)) * s;
      ctx.globalAlpha = p.a * (1 - t);
      ctx.fillStyle = t > 0.05 ? css([168, 150, 120], l) : css(i % 3 ? [226, 186, 90] : [206, 206, 214], l, 1, 0.15);
      ctx.beginPath(); ctx.ellipse(x + ox + dx, y - 1 * s + oy + dy, 1.6 * s * (1 - 0.5 * t), 0.8 * s, 0, 0, TAU); ctx.fill();
    }
    if (SP && k > 0.02) {
      lighter(ctx);
      for (let i = 0; i < 5; i++) { const tw = 0.5 + 0.5 * Math.sin(W.t * 3 + i * 2.1); glowAt(SP.gold, x + (hsh(i * 9.1) - 0.5) * 12 * s, y - 3 * s - hsh(i * 3.3) * 4 * s, 3 * s, p.a * k * 0.6 * tw); }
      normal(ctx);
    }
    ctx.globalAlpha = 1;
  }
  // 审判座：两级石台，上面一把椅子（官长坐在上面）
  function daisG(p) { const s = LS(2), x = p.x * W.w, y = gY(2, p.x) + 2 * s; return { s, x, y, top: y - 7 * s, w: 30 * s }; }
  function drawDais(ctx, p) {
    const D = daisG(p), s = D.s, hp = HP();
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([188, 178, 160], 2);
    ctx.fillRect(D.x - D.w / 2, D.y - 3.5 * s, D.w, 3.5 * s + 2 * s);
    ctx.fillStyle = css([206, 196, 178], 2);
    ctx.fillRect(D.x - D.w * 0.4, D.top, D.w * 0.8, 3.6 * s);
    // 椅子（在台的右边；官长面向左）
    const cx = D.x + D.w * 0.14, cy = D.top - hp * 0.25;
    ctx.fillStyle = css([120, 86, 60], 2);
    ctx.fillRect(cx - hp * 0.14, cy, hp * 0.28, 1.6 * s);
    ctx.beginPath(); ctx.moveTo(cx - hp * 0.12, cy); ctx.lineTo(cx + hp * 0.12, D.top); ctx.moveTo(cx + hp * 0.12, cy); ctx.lineTo(cx - hp * 0.12, D.top);
    ctx.strokeStyle = css([120, 86, 60], 2); ctx.lineWidth = Math.max(0.6, 1.2 * s); ctx.stroke();
    ctx.strokeStyle = css([252, 238, 210], 2, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(D.x - D.w / 2, D.y - 3.5 * s); ctx.lineTo(D.x + D.w / 2, D.y - 3.5 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 异象里的一团柔光（提摩太幼年的光景）
  function drawVision(ctx, p) {
    if (!SP) return;
    const s = LS(2), x = p.x * W.w, y = pY(p) - 12 * s;
    lighter(ctx);
    glowAt(SP.dawn, x, y, 48 * s, 0.4 * p.a, 0.7);
    glowAt(SP.white, x, y + 4 * s, 26 * s, 0.25 * p.a, 0.6);
    normal(ctx);
  }

  // ════════════════════════════════════════════════════════════
  //  画：中丘上的城——克里特的各城 / 罗马；海上的船
  // ════════════════════════════════════════════════════════════
  function drawCrete(ctx, p) {
    const l = 1, s = LS(l), xs = X.crete, n = xs.length;
    ctx.globalAlpha = p.a;
    for (let i = 0; i < n; i++) {
      const xf = xs[i], lit = clamp((p.k * (n + 0.6) - i) * 1.6, 0, 1);
      for (let j = 0; j < 4; j++) {
        const ox = (j - 1.5) * 9 * s + (hsh(i * 7 + j) - 0.5) * 3 * s, hx = xf * W.w + ox, gy = gY(l, clamp(hx / W.w, 0, 1)) + 2 * s;
        const w = (8 + 3 * hsh(i * 3 + j)) * s, h = (6 + 4 * hsh(i * 5 + j * 2)) * s;
        const tone = [[226, 214, 190], [214, 200, 172], [232, 222, 200]][(i + j) % 3];
        ctx.fillStyle = css(tone, l);
        ctx.fillRect(hx - w / 2, gy - h, w, h + 2 * s);
        ctx.fillStyle = css(mul(tone, 0.75), l, 0.9);
        ctx.fillRect(hx + w * 0.2, gy - h, w * 0.3, h);
        const lk = lit * (0.6 + 0.4 * nightK()) * p.a;
        if (lk > 0.02 && SP && j % 2 === 0) {
          lighter(ctx);
          ctx.globalAlpha = Math.min(1, lk); ctx.fillStyle = 'rgb(255,190,110)';
          ctx.fillRect(hx - w * 0.25, gy - h * 0.6, 1.6 * s, 1.6 * s);
          glowAt(SP.lamp, hx - w * 0.25, gy - h * 0.55, 6 * s, lk * 0.5);
          normal(ctx); ctx.globalAlpha = p.a;
        }
      }
      // 设立的长老：城中一盏高高的灯
      if (lit > 0.01 && SP) {
        const gy = gY(l, xf) - 14 * s, tw = 0.85 + 0.15 * Math.sin(W.t * 2.3 + i);
        lighter(ctx);
        glowAt(SP.gold, xf * W.w, gy, 24 * s, lit * tw * (0.55 + 0.4 * nightK()) * p.a);
        glowAt(SP.white, xf * W.w, gy, 4 * s, lit * tw * 0.9 * p.a);
        normal(ctx); ctx.globalAlpha = p.a;
      }
    }
    ctx.globalAlpha = 1;
  }
  // 罗马（中丘）：一段水道桥的拱、城墙与城楼、殿、圆顶、红瓦的楼房；夜里窗里的灯
  function drawRome(ctx, p) {
    const l = 1, s = LS(l), x0 = p.x0 * W.w, x1 = p.x1 * W.w, nk = nightK();
    const G = xx => gY(l, clamp(xx / W.w, 0, 1));
    ctx.globalAlpha = p.a;
    // 水道桥（城外，左边一段）
    const ax0 = lerp(x0, x1, 0.02), ax1 = lerp(x0, x1, PORT ? 0.3 : 0.26), aTop = Math.min(G(ax0), G(ax1)) - 15 * s;
    const n = Math.max(3, Math.round((ax1 - ax0) / (8 * s))), step = (ax1 - ax0) / n;
    ctx.fillStyle = css([188, 164, 130], l);
    ctx.fillRect(ax0 - 1.4 * s, aTop, ax1 - ax0 + 2.8 * s, 3 * s);
    for (let i = 0; i <= n; i++) { const x = ax0 + i * step; ctx.fillRect(x - 1.3 * s, aTop, 2.6 * s, G(x) - aTop + 2 * s); }
    ctx.strokeStyle = css([188, 164, 130], l); ctx.lineWidth = 2.2 * s;
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const cx = ax0 + (i + 0.5) * step, r = step / 2 - 1.3 * s; ctx.moveTo(cx + r, aTop + 3 * s + r); ctx.arc(cx, aTop + 3 * s + r, r, 0, Math.PI, true); }
    ctx.stroke();
    // 城墙与城楼
    const w0 = lerp(x0, x1, PORT ? 0.34 : 0.3), wallC = [204, 178, 138];
    ctx.fillStyle = css(wallC, l);
    ctx.beginPath();
    for (let i = 0; i <= 30; i++) { const x = lerp(w0, x1, i / 30), y = G(x) - 6 * s; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.lineTo(x1, G(x1) + 3 * s); ctx.lineTo(w0, G(w0) + 3 * s); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) { const x = lerp(w0, x1, (i + 0.1) / 3.6); ctx.fillRect(x - 2.6 * s, G(x) - 11 * s, 5.2 * s, 11 * s); ctx.fillRect(x - 3.2 * s, G(x) - 12 * s, 6.4 * s, 1.6 * s); }
    // 城里
    const B = PORT ? [[0.44, 'block'], [0.58, 'temple'], [0.72, 'dome'], [0.86, 'block']]
      : [[0.36, 'block'], [0.46, 'temple'], [0.57, 'block'], [0.66, 'dome'], [0.76, 'block'], [0.85, 'temple'], [0.94, 'block']];
    for (let i = 0; i < B.length; i++) {
      const x = lerp(x0, x1, B[i][0]), gy = G(x) - 5 * s, kind = B[i][1], k = 1.2;
      if (kind === 'temple') {
        ctx.fillStyle = css([226, 212, 186], l);
        ctx.fillRect(x - 10 * s * k, gy - 2 * s, 20 * s * k, 2 * s);
        ctx.fillStyle = css([150, 132, 110], l);
        ctx.fillRect(x - 8 * s * k, gy - 11 * s * k, 16 * s * k, 9 * s * k);
        ctx.fillStyle = css([232, 220, 196], l);
        for (let c = 0; c < 5; c++) ctx.fillRect(x - 8.6 * s * k + c * 4 * s * k, gy - 11 * s * k, 1.6 * s * k, 9.2 * s * k);
        ctx.fillRect(x - 9.5 * s * k, gy - 13 * s * k, 19 * s * k, 2 * s * k);
        ctx.beginPath(); ctx.moveTo(x - 10 * s * k, gy - 13 * s * k); ctx.lineTo(x, gy - 17.5 * s * k); ctx.lineTo(x + 10 * s * k, gy - 13 * s * k); ctx.closePath(); ctx.fill();
      } else if (kind === 'dome') {
        ctx.fillStyle = css([214, 196, 168], l);
        ctx.fillRect(x - 9 * s * k, gy - 8 * s * k, 18 * s * k, 8 * s * k);
        ctx.fillStyle = css([190, 176, 156], l);
        ctx.beginPath(); ctx.arc(x, gy - 8 * s * k, 8 * s * k, Math.PI, 0); ctx.fill();
      } else {
        const bw = (11 + 4 * hsh(i * 2.1)) * s, bh = (10 + 5 * hsh(i * 4.3)) * s;
        ctx.fillStyle = css([206, 162, 118], l);
        ctx.fillRect(x - bw / 2, gy - bh, bw, bh + 3 * s);
        ctx.fillStyle = css([164, 82, 58], l);
        ctx.beginPath(); ctx.moveTo(x - bw / 2 - 1 * s, gy - bh); ctx.lineTo(x, gy - bh - 3.5 * s); ctx.lineTo(x + bw / 2 + 1 * s, gy - bh); ctx.closePath(); ctx.fill();
        const lit = nk > 0.05 && SP;
        if (lit) { lighter(ctx); ctx.globalAlpha = Math.min(1, nk * p.a); ctx.fillStyle = 'rgb(255,186,104)'; }
        else ctx.fillStyle = css([120, 90, 70], l);
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) if (!lit || hsh(i * 9 + r * 3 + c) > 0.4) ctx.fillRect(x - bw * 0.32 + c * bw * 0.28, gy - bh * 0.78 + r * bh * 0.4, 1.5 * s, 1.5 * s);
        if (lit) { normal(ctx); ctx.globalAlpha = p.a; }
      }
    }
    ctx.strokeStyle = css([252, 238, 210], l, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(ax0, aTop); ctx.lineTo(ax1, aTop); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 船：往克里特去（在中丘与近地之间的水面上）
  function shipPos(p) {
    const a = X.ship0, b = X.ship1, e = ease(clamp(p.k, 0, 1));
    return [lerp(a[0], b[0], e) * W.w, lerp(a[1], b[1], e) * W.h, lerp(1, 0.72, e)];
  }
  function drawShip(ctx, p) {
    const [x, y0, k] = shipPos(p), F = W.seaScale(y0) * boost() * 1.3 * k, L = 70 * F, y = y0 + Math.sin(W.t * 1.3) * 0.8 * F;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = 'rgba(8,16,28,0.25)';
    ctx.beginPath(); ctx.ellipse(x, y + 0.04 * L, 0.56 * L, 0.05 * L, 0, 0, TAU); ctx.fill();
    // 桅与方帆（鼓着风，向右）
    ctx.fillStyle = W.shadeCSS([96, 72, 50], 0.1);
    ctx.fillRect(-0.01 * L + x, y - 0.78 * L, 0.025 * L, 0.7 * L);
    ctx.fillStyle = W.shadeCSS([236, 224, 196], 0.1, 1, 0.05);
    ctx.beginPath();
    ctx.moveTo(x - 0.26 * L, y - 0.7 * L); ctx.quadraticCurveTo(x + 0.08 * L, y - 0.72 * L, x + 0.26 * L, y - 0.7 * L);
    ctx.quadraticCurveTo(x + 0.34 * L, y - 0.46 * L, x + 0.26 * L, y - 0.26 * L);
    ctx.quadraticCurveTo(x + 0.02 * L, y - 0.28 * L, x - 0.26 * L, y - 0.26 * L);
    ctx.quadraticCurveTo(x - 0.18 * L, y - 0.48 * L, x - 0.26 * L, y - 0.7 * L);
    ctx.closePath(); ctx.fill();
    // 船身
    ctx.fillStyle = W.shadeCSS([110, 82, 56], 0.1);
    ctx.beginPath();
    ctx.moveTo(x - 0.54 * L, y - 0.2 * L);
    ctx.quadraticCurveTo(x - 0.44 * L, y + 0.02 * L, x - 0.3 * L, y + 0.04 * L);
    ctx.lineTo(x + 0.3 * L, y + 0.04 * L);
    ctx.quadraticCurveTo(x + 0.46 * L, y + 0.01 * L, x + 0.58 * L, y - 0.24 * L);
    ctx.quadraticCurveTo(x, y - 0.12 * L, x - 0.54 * L, y - 0.2 * L);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS([255, 236, 204], 0.1, 0.45 * W.daylight + 0.1); ctx.lineWidth = Math.max(0.5, 0.8 * F);
    ctx.beginPath(); ctx.moveTo(x - 0.54 * L, y - 0.2 * L); ctx.quadraticCurveTo(x, y - 0.12 * L, x + 0.58 * L, y - 0.24 * L); ctx.stroke();
    // 船上带着的书信：一点光
    if (SP) { lighter(ctx); glowAt(SP.gold, x - 0.1 * L, y - 0.22 * L, 0.3 * L, 0.6 * p.a); normal(ctx); }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：远近各地的灯（万人）、不被捆绑的道（自小窗飞去的光）
  // ════════════════════════════════════════════════════════════
  let WL = null;
  function worldPts() {
    if (WL && WL.w === W.w && WL.h === W.h) return WL;
    const lamps = [], words = [];
    const c = X.tim;
    for (const l of [0, 1]) {
      const sp = W.landSpan(l);
      if (!sp) continue;
      let a = sp[0] / W.w, b = sp[1] / W.w;
      if (!PORT && l === 0) a = Math.max(a, 0.5);        // 桌面左边远处是经文
      const n = l === 0 ? (PORT ? 12 : 18) : (PORT ? 7 : 10);
      for (let i = 0; i < n; i++) {
        const f = a + (b - a) * ((i + 0.2 + hsh(i * 3.7 + l * 11) * 0.6) / n);
        lamps.push({ l, f, d: Math.abs(f - c) * 0.9 + (l === 0 ? 0.08 : 0.02), r: hsh(i * 5.1 + l) });
        const g = a + (b - a) * ((i + 0.6 + hsh(i * 8.3 + l * 5) * 0.3) / n);
        words.push({ l, f: g, d: hsh(i * 2.9 + l * 7) * 0.8, r: hsh(i * 6.7 + l * 3) });
      }
    }
    WL = { w: W.w, h: W.h, lamps, words };
    return WL;
  }
  function drawLamps(ctx, l) {
    const k = lvl('pstAll'), kw = lvl('pstWord');
    if ((k < 0.005 && kw < 0.005) || !SP) return;
    const G = worldPts(), s = LS(l), nk = nightK(), gold = lvl('pstCrowns');
    lighter(ctx);
    if (k > 0.005) {
      const front = k * 1.15;
      for (const q of G.lamps) {
        if (q.l !== l) continue;
        const a = clamp((front - q.d) * 6, 0, 1);
        if (a < 0.01) continue;
        const x = q.f * W.w, y = gY(l, q.f) - 2 * s;
        const tw = 0.8 + 0.2 * Math.sin(W.t * 2 + q.r * 9), br = a * tw * (0.25 + 0.75 * nk + 0.3 * gold);
        glowAt(SP.lamp, x, y, (l === 0 ? 9 : 12) * s, br * 0.8);
        glowAt(SP.white, x, y, (l === 0 ? 2 : 2.6) * s, br);
      }
    }
    const sc = lvl('pstScroll');
    if (kw > 0.005) {
      for (const q of G.words) {
        if (q.l !== l) continue;
        const a = clamp((kw - q.d - 0.2) * 8, 0, 1);
        if (a < 0.01) continue;
        const x = q.f * W.w, y = gY(l, q.f) - 3 * s, tw = 0.75 + 0.25 * Math.sin(W.t * 2.6 + q.r * 7);
        glowAt(SP.gold, x, y, (l === 0 ? 10 : 13) * s, a * tw * (0.3 + 0.5 * nk));
        glowAt(SP.white, x, y, (l === 0 ? 2.4 : 3) * s, a * tw * (0.5 + 0.5 * nk));
        // 圣经都是神所默示的：落在各地的道成了一卷一卷发光的书
        if (sc > 0.01) {
          const k = a * clamp(sc * 1.3 - q.r * 0.3, 0, 1);
          if (k < 0.01) continue;
          normal(ctx);
          scrollAt(ctx, x, y - 1.5 * s, (l === 0 ? 7 : 8) * s, 0.8, k, 1, l);
          radiance(ctx, x, y - 1.5 * s, s * (l === 0 ? 0.45 : 0.55), k, W.h * (l === 0 ? 0.08 : 0.12));
          lighter(ctx);
        }
      }
    }
    normal(ctx);
  }
  // 小窗（监）或桌上的书信：光从这里飞出去
  function windowPt() {
    const p = getP('cell');
    if (p) { const G = roomG(p); return [G.x0 + G.w * 0.5, G.top + G.h * 0.17]; }
    return [X.room * W.w, gY(2, X.room) - 40 * LS(2)];
  }
  function drawWordStreams(ctx) {
    const kw = lvl('pstWord');
    if (kw <= 0.001 || kw >= 0.999 || !SP) return;
    const G = worldPts(), w0 = windowPt();
    lighter(ctx);
    for (const q of G.words) {
      const t = (kw - q.d) / 0.2;
      if (t <= 0 || t >= 1.15) continue;
      const x1 = q.f * W.w, y1 = gY(q.l, q.f) - 3 * LS(q.l);
      for (let i = 0; i < 8; i++) {
        const u = clamp(t - i * 0.035, 0, 1);
        if (u <= 0 || u >= 1) continue;
        const x = lerp(w0[0], x1, u), y = lerp(w0[1], y1, u) - Math.sin(Math.PI * u) * W.h * (0.14 + 0.1 * q.r);
        glowAt(i ? SP.gold : SP.white, x, y, (i ? 9 - i * 0.6 : 6) * SU(), (1 - i / 8) * 0.85);
      }
    }
    normal(ctx);
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上来的光（1:15）、一位中保（2:5）、不能靠近的光（6:16）、恩典的晨光（多 2:11）、浇灌（多 3:6）
  //      主站在旁边的光（提后 4:17）、冠冕（4:8）、提摩太手里的火（1:6）
  // ════════════════════════════════════════════════════════════
  function landY() { return gY(2, X.land) + 2 * LS(2); }
  // 某一种转瞬的光此刻的强弱（0–1）
  function fxEnv(type) { let m = 0; for (const e of FXL) if (e.type === type && e.t >= 0) m = Math.max(m, Math.sin(Math.PI * clamp(e.t / e.dur, 0, 1))); return m; }
  function drawDescent(ctx) {
    const d = lvl('pstDescend');
    if (d < 0.001 || !SP) return;
    const x = X.land * W.w, g = landY(), s = LS(2);
    lighter(ctx);
    if (d < 0.999) {
      const e = ease(d), y = lerp(W.h * 0.04, g - 12 * s, e);
      for (let i = 0; i < 9; i++) glowAt(SP.white, x, y - i * 7 * s * (1 - e * 0.5), (14 - i) * s, 0.35 * (1 - i / 9));
      glowAt(SP.gold, x, y, 46 * s, 0.5);
      glowAt(SP.white, x, y, 12 * s, 0.95);
    } else {
      // 落在地上的光（世上的光）：一直留着；「神在肉身显现」时，它化作那道人高的光（这里暗下去）
      const tw = (0.85 + 0.15 * Math.sin(W.t * 1.4)) * (1 - 0.8 * fxEnv('figure'));
      glowAt(SP.gold, x, g - 8 * s, 46 * s, 0.38 * tw * (0.45 + 0.55 * nightK()), 0.6);
      glowAt(SP.white, x, g - 6 * s, 16 * s, 0.4 * tw, 0.8);
      glowAt(SP.white, x, g - 5 * s, 6 * s, 0.7 * tw);
    }
    // 那光沿路走进保罗的屋里
    const m = lvl('pstMercy');
    if (m > 0.001 && m < 0.999) {
      const px = roomX(SEAT_F) * W.w, e = ease(m), xx = lerp(x, px, e), yy = lerp(g - 8 * s, gY(2, px / W.w) - 20 * s, e) - Math.sin(Math.PI * e) * 14 * s;
      glowAt(SP.gold, xx, yy, 30 * s, 0.55);
      glowAt(SP.white, xx, yy, 8 * s, 0.9);
    }
    normal(ctx);
  }
  function drawBeam(ctx) {
    const k = lvl('pstBeam');
    if (k < 0.005 || !SP) return;
    const x = X.land * W.w, g = landY(), w = (20 + 60 * k) * SU();
    lighter(ctx);
    ctx.globalAlpha = clamp((0.1 + 0.55 * k) * Math.min(1, k / 0.2), 0, 0.7) * (0.55 + 0.45 * nightK());
    const top = PORT ? W.h * 0.27 : -10;
    ctx.drawImage(SP.beam, x - w / 2, top, w, g - top);
    glowAt(SP.white, x, g - 6 * LS(2), w * 0.5, 0.35 * k);
    if (!PORT) glowAt(SP.pale, x, 0, w * 2.2, 0.35 * k, 0.5);
    normal(ctx);
  }
  const HID = () => [W.w * (PORT ? 0.7 : 0.74), W.h * (PORT ? 0.44 : 0.16)];
  function drawHidden(ctx) {
    const k = lvl('pstHidden');
    if (k < 0.005 || !SP) return;
    const [x, y] = HID(), R = Math.max(W.w, W.h);
    lighter(ctx);
    glowAt(SP.dawn, x, y, R * 0.7 * (0.5 + 0.5 * k), 0.45 * k, 0.8);
    glowAt(SP.white, x, y, 240 * SU() * (0.6 + 0.4 * k), 0.9 * k);
    glowAt(SP.white, x, y, 80 * SU(), k);
    glowAt(SP.white, x, y, 30 * SU(), k);
    ctx.fillStyle = 'rgb(255,248,226)';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU + W.t * 0.015, w = 0.03 + 0.015 * Math.sin(i * 2.7);
      const aa = ((a % TAU) + TAU) % TAU;
      if (!PORT && aa > 1.75 && aa < 3.3) continue;          // 不照在左下的经文上
      ctx.globalAlpha = 0.12 * k * (0.7 + 0.3 * Math.sin(W.t * 0.6 + i));
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a - w) * R, y + Math.sin(a - w) * R); ctx.lineTo(x + Math.cos(a + w) * R, y + Math.sin(a + w) * R); ctx.closePath(); ctx.fill();
    }
    normal(ctx);
  }
  // 光太强时，一层白蒙在世上（人不能靠近）
  function drawHiddenVeil(ctx) {
    const k = lvl('pstHidden');
    if (k < 0.4 || !SP) return;
    const [x, y] = HID();
    lighter(ctx);
    glowAt(SP.white, x, y + W.h * 0.2, Math.max(W.w, W.h) * 0.62, (k - 0.4) * 0.75, 0.9);
    normal(ctx);
  }
  function drawGrace(ctx) {
    const k = lvl('pstGrace');
    if (k <= 0.001 || k >= 0.999 || !SP) return;
    // 桌面：自岸边（0.55）扫起，不从左下的经文后面经过
    const x = lerp(PORT ? -0.15 : 0.55, 1.15, k) * W.w;
    lighter(ctx);
    glowAt(SP.dawn, x, W.h * 0.62, W.w * 0.2, 0.28, 2.6);
    glowAt(SP.gold, x, W.h * 0.82, W.w * 0.12, 0.3, 0.6);
    normal(ctx);
  }
  function drawPour(ctx) {
    const k = lvl('pstPour');
    if (k < 0.01 || !SP) return;
    const a = Math.min(X.timTeach, X.spring) - 0.08, b = X.church + 0.02, s = LS(2), n = PORT ? 40 : 70, pv = PV('spring');
    lighter(ctx);
    ctx.fillStyle = 'rgb(255,240,200)';
    for (let i = 0; i < n; i++) {
      const f = a + (b - a) * hsh(i * 3.1), sp = 0.35 + 0.25 * hsh(i * 7.7), ph = (W.t * sp + hsh(i * 1.3)) % 1;
      const g = gYv(clamp(f, 0, 1), pv) - 4 * s, y = lerp(W.h * 0.2, g, ph);
      ctx.globalAlpha = k * 0.7 * Math.sin(Math.PI * ph);
      ctx.fillRect(f * W.w - 0.6 * s, y, 1.2 * s, 5 * s);
    }
    glowAt(SP.gold, ((a + b) / 2) * W.w, gYv((a + b) / 2, pv) - 30 * s, (b - a) * W.w * 0.7, 0.25 * k, 0.6);
    normal(ctx);
  }
  function drawBeside(ctx) {
    const k = lvl('pstBeside'), f = fig('paul');
    if (k < 0.01 || !f || !f._vis || !SP) return;
    const hp = f._h || HP(), d = f.fd == null ? 1 : f.fd, x = f._x + d * hp * 0.5, y = f._y;
    const a = k * f.alpha * (1 + 0.6 * W.daylight), tw = 0.9 + 0.1 * Math.sin(W.t * 1.6);
    lighter(ctx);
    // 一道人高的柔光，上接天光（不是人形，也不是一件东西）
    const bw = hp * 0.55, top = y - hp * 2.6;
    ctx.globalAlpha = clamp(0.3 * a, 0, 1);
    ctx.drawImage(SP.beam, x - bw / 2, top, bw, y - top);
    glowAt(SP.pale, x, y - hp * 0.62, hp * 0.62, a * 0.6 * tw, 2);
    glowAt(SP.white, x, y - hp * 0.6, hp * 0.24, a * 0.55 * tw, 2.4);
    glowAt(SP.white, x, y - hp * 0.66, hp * 0.1, a * 0.5 * tw, 3.2);
    glowAt(SP.gold, x, y - hp * 0.1, hp * 0.8, a * (0.15 + 0.3 * nightK()), 0.35);
    normal(ctx);
  }
  // 公义的冠冕：一圈光的叶冠（得胜者的冠冕，2:5），戴在头上——不是悬在头顶的光圈
  function wreath(ctx, x, y, r, a) {
    if (a < 0.01) return;
    lighter(ctx);
    glowAt(SP.gold, x, y, r * 3.2, a * 0.42, 0.7);
    ctx.globalAlpha = Math.min(1, a);
    const n = 14;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * TAU + 0.12, cx = x + Math.cos(t) * r, cy = y + Math.sin(t) * r * 0.36;
      const tang = Math.atan2(Math.cos(t) * r * 0.36, -Math.sin(t) * r) + (i % 2 ? 0.5 : -0.5);
      ctx.fillStyle = Math.sin(t) > 0 ? 'rgb(255,236,170)' : 'rgb(236,196,112)';
      ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(0.9, r * 0.32), Math.max(0.5, r * 0.13), tang, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = 'rgb(255,250,226)';
    ctx.beginPath(); ctx.arc(x, y + r * 0.36, Math.max(0.6, r * 0.14), 0, TAU); ctx.fill();
    normal(ctx);
  }
  // 头上戴冠之处（身高的比例）
  const CROWN_UP = { kneel: 0.7, pray: 0.7, worship: 0.5, sit: 0.52, seat: 0.7, bow: 0.8, weep: 0.86 };
  const crownAt = (id, g) => figPt(id, (CROWN_UP[g.pose] || 0.93), g.pose === 'bow' ? 0.18 : 0.015);
  const CROWNED = () => ['timothy'].concat(church());
  function drawCrowns(ctx) {
    if (!SP) return;
    const k = lvl('pstCrown'), f = fig('paul');
    if (k > 0.01 && f && f._vis) {
      const hp = f._h || HP(), top = crownAt('paul', f);
      const e = ease(clamp(k * 1.15, 0, 1)), y = lerp(W.h * 0.06, top[1], e);
      if (e < 0.98) { lighter(ctx); glowAt(SP.white, top[0], y, hp * 0.3, 0.6 * (1 - e) * f.alpha); normal(ctx); }
      wreath(ctx, top[0], y, hp * 0.085, Math.min(1, k * 1.4) * f.alpha);
    }
    const kk = lvl('pstCrowns');
    if (kk > 0.01) {
      const ids = CROWNED();
      ids.forEach((id, i) => {
        const g = fig(id);
        if (!g || !g._vis) return;
        const a = clamp(kk * (ids.length + 1) - i, 0, 1);
        if (a < 0.01) return;
        const q = crownAt(id, g), hp = g._h || HP();
        wreath(ctx, q[0], q[1] - (1 - ease(a)) * hp * 0.9, hp * 0.08, a * g.alpha * 0.95);
      });
    }
  }
  function drawFire(ctx) {
    const k = lvl('pstFire');
    if (k < 0.01) return;
    let x, y, s = LS(2);
    if (S.fireAt === 'hands') { const h = handOf('timothy'); if (!h) return; x = h[0]; y = h[1]; }
    else if (S.fireAt === 'stand') { const p = getP('stand'); if (!p) return; [x, y] = standTop(p); }
    else return;
    const H = lerp(2.4, 8.5, k) * s;
    flame(ctx, x, y, H, 0.6 + 0.4 * k, 7);
    if (SP) { lighter(ctx); glowAt(SP.warm, x, y - H * 0.4, (10 + 46 * k) * s, (0.25 + 0.4 * nightK()) * k); glowAt(SP.gold, x, y - H * 0.4, (5 + 14 * k) * s, 0.5 * k); normal(ctx); }
  }
  // 手里的书卷：提多拿着书信；提摩太拿着书卷；异象里的孩子
  function drawHeld(ctx) {
    const s = LS(2), sc = lvl('pstScroll');
    const one = (id, open, w) => {
      const f = fig(id); if (!f || !f._vis) return; const h = handOf(id); if (!h) return;
      scrollAt(ctx, h[0], h[1], (w || 9) * s, open, sc * 0.9, f.alpha);
      if (sc > 0.01 && id !== 'titus') radiance(ctx, h[0], h[1], s * (id === 'child' ? 0.85 : 1), sc * f.alpha, W.h * (PORT ? 0.24 : 0.32));
    };
    if (S.titLetter) one('titus', 0.1, 8);
    if (S.timScroll) one('timothy', fig('timothy') && fig('timothy').pose === 'raise' ? 1 : 0.7, 10);
    if (S.child) one('child', 1, 7);
  }

  // ── 转瞬的光：书信在路上飞、祷告升起、敬虔的奥秘、默示的气息、浇奠 ───
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    const s = LS(2);
    for (const e of FXL) {
      if (e.t < 0) continue;
      const q = clamp(e.t / e.dur, 0, 1), env = Math.sin(Math.PI * q);
      lighter(ctx);
      if (e.type === 'letter') {
        const a = typeof e.from === 'function' ? e.from() : e.from, b = typeof e.to === 'function' ? e.to() : e.to;
        if (!a || !b) continue;
        const u = ease(q), x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(Math.PI * u) * (e.arc || 30) * s;
        glowAt(SP.gold, x, y, 22 * s, 0.7);
        glowAt(SP.white, x, y, 6 * s, 0.9);
        normal(ctx);
        scrollAt(ctx, x, y, 7 * s, 0.1, 0.8, 1);
        continue;
      }
      if (e.type === 'prayer') {
        const a = figPt(e.id, 0.9, 0.05);
        if (!a) continue;
        for (let i = 0; i < 4; i++) {
          const u = clamp(q * 1.3 - i * 0.1, 0, 1);
          if (u <= 0 || u >= 1) continue;
          glowAt(SP.gold, a[0] + Math.sin(u * 6 + i + e.seed) * 4 * s, a[1] - u * W.h * 0.3, 5 * s, 0.6 * Math.sin(Math.PI * u));
        }
      } else if (e.type === 'figure') {
        // 神在肉身显现：落光之处立起一道人高的光（不是人形）
        const x = X.land * W.w, g = landY(), hp = HP(), rise = sm(0, 0.12, q), tw = 0.92 + 0.08 * Math.sin(W.t * 2.1);
        const bw = hp * 0.46, top = g - hp * 1.2 * rise;
        ctx.globalAlpha = clamp(0.75 * env, 0, 1);
        ctx.drawImage(SP.beam, x - bw / 2, top, bw, g - top);
        glowAt(SP.white, x, g - hp * 0.55 * rise, hp * 0.3, 1.0 * env * tw, 2.3);
        glowAt(SP.white, x, g - hp * 0.62 * rise, hp * 0.11, 0.95 * env, 3.4);
        glowAt(SP.gold, x, g - hp * 0.5 * rise, hp * 1.3, 0.55 * env, 1.1);
        glowAt(SP.dawn, x, g - hp * 0.4, hp * 2.6, 0.3 * env, 0.7);
      } else if (e.type === 'dove') {
        // 被圣灵称义：一只光的鸽子自天降下，落在那道人高的光上
        const hp = HP(), x = X.land * W.w, g = landY() - hp * 1.12, land = clamp(q * 1.6, 0, 1);
        const y = lerp(W.h * 0.06, g, ease(land)) + (land >= 1 ? Math.sin(W.t * 2.4) * 1.5 * s : 0);
        const fl = land >= 1 ? 0.35 + 0.15 * Math.sin(W.t * 4) : Math.sin(W.t * 9) * 0.5 + 0.5, r = 12 * s, a = sm(0, 0.08, q) * (1 - sm(0.82, 1, q));
        if (land >= 1) glowAt(SP.white, x, g + hp * 0.5, hp * 0.7, 0.5 * a, 1.6);
        ctx.globalAlpha = a; ctx.fillStyle = 'rgb(250,252,255)';
        ctx.beginPath(); ctx.ellipse(x, y, r * 0.55, r * 0.22, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - r * 0.1, y); ctx.quadraticCurveTo(x - r * 0.7, y - r * (0.5 + 0.6 * fl), x - r * 1.3, y - r * (0.2 + 0.5 * fl)); ctx.quadraticCurveTo(x - r * 0.6, y - r * 0.05, x - r * 0.1, y); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + r * 0.1, y); ctx.quadraticCurveTo(x + r * 0.7, y - r * (0.5 + 0.6 * fl), x + r * 1.3, y - r * (0.2 + 0.5 * fl)); ctx.quadraticCurveTo(x + r * 0.6, y - r * 0.05, x + r * 0.1, y); ctx.fill();
        glowAt(SP.white, x, y, r * 3.2, 0.5 * a);
      } else if (e.type === 'host') {
        // 被天使看见：天上一群光
        for (let i = 0; i < 9; i++) {
          const ang = -Math.PI / 2 + (i - 4) * 0.36, rr = W.h * (0.3 + 0.05 * Math.sin(i * 1.7));
          const x = X.land * W.w + Math.cos(ang) * rr * 0.9, y = landY() - HP() + Math.sin(ang) * rr * 0.62;
          const a = env * clamp(q * 3 - i * 0.12, 0, 1) * (0.8 + 0.2 * Math.sin(W.t * 2 + i));
          glowAt(SP.pale, x, y, 16 * s, 0.55 * a, 1.6);
          glowAt(SP.white, x, y - 2 * s, 4 * s, 0.9 * a, 1.8);
        }
      } else if (e.type === 'nations') {
        // 被传于外邦：光越过海到天边
        const x0 = X.land * W.w, y0 = landY() - HP() * 0.6;
        for (let i = 0; i < 7; i++) {
          const tx = (0.08 + i * 0.13) * W.w, ty = W.horizonY - 2 - hsh(i * 3.3) * 6;
          const u = clamp(q * 1.3 - i * 0.05, 0, 1);
          if (u <= 0 || u >= 1) continue;
          const x = lerp(x0, tx, u), y = lerp(y0, ty, u) - Math.sin(Math.PI * u) * W.h * 0.2;
          glowAt(SP.gold, x, y, 7 * SU(), 0.8 * Math.sin(Math.PI * u));
          if (u > 0.9) glowAt(SP.white, tx, ty, 4 * SU(), (1 - u) * 8);
        }
      } else if (e.type === 'ascend') {
        // 被接在荣耀里：光升入一片光明的云
        const top = W.h * (PORT ? 0.36 : 0.1), x = X.land * W.w, y = lerp(landY() - HP() * 0.55, top, ease(q));
        glowAt(SP.white, x, y, HP() * 0.28, 0.9 * (1 - q * 0.5), 2);
        glowAt(SP.gold, x, y, HP() * 0.8, 0.5 * (1 - q * 0.4));
        glowAt(SP.white, x, top, W.w * 0.14, 0.45 * sm(0.4, 0.8, q) * (1 - sm(0.85, 1, q)), 0.4);
      } else if (e.type === 'breath') {
        // 神所默示：一口气自天吹过——一缕缕光的风，头亮尾淡
        const L = W.w * 0.2, yA = PORT ? 0.36 : 0.12, yB = PORT ? 0.78 : 0.56;
        for (let i = 0; i < 9; i++) {
          const y0 = W.h * (yA + (i / 8) * (yB - yA)), u = q * 1.5 - hsh(i * 2.3) * 0.4;
          if (u <= 0 || u >= 1.3) continue;
          const head = lerp(-0.25, 1.25, u) * W.w, env2 = Math.sin(Math.PI * clamp(u / 1.3, 0, 1));
          // 一缕：自头至尾渐淡的一笔（宽的一层柔光，细的一层亮线）
          const gr = ctx.createLinearGradient(head, 0, head - L, 0);
          gr.addColorStop(0, 'rgba(236,242,255,0.9)'); gr.addColorStop(1, 'rgba(236,242,255,0)');
          ctx.strokeStyle = gr; ctx.lineCap = 'round';
          ctx.beginPath();
          for (let j = 0; j <= 12; j++) { const xx = head - (j / 12) * L, yy = y0 + Math.sin(xx * 0.01 + i * 1.7 + W.t * 1.2) * 10 * SU(); if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
          ctx.globalAlpha = 0.14 * env2; ctx.lineWidth = 9 * SU(); ctx.stroke();
          ctx.globalAlpha = 0.4 * env2; ctx.lineWidth = 1.6 * SU(); ctx.stroke();
          glowAt(SP.white, head, y0 + Math.sin(head * 0.01 + i * 1.7 + W.t * 1.2) * 10 * SU(), 5 * SU(), 0.5 * env2);
        }
      } else if (e.type === 'pour') {
        // 被浇奠：一股光自上浇下，落在他身上
        const a = figPt(e.id, 1, 0);
        if (!a) continue;
        for (let i = 0; i < 18; i++) {
          const ph = (W.t * 0.8 + i / 18) % 1, y = lerp(W.h * 0.05, a[1], ph);
          glowAt(SP.gold, a[0] + Math.sin(i * 1.7 + W.t) * 2 * s, y, 3.5 * s, 0.6 * env * Math.sin(Math.PI * ph));
        }
        glowAt(SP.gold, a[0], a[1], 20 * s, 0.4 * env);
      } else if (e.type === 'depart') {
        // 离弃我：离开的人背后一片冷
        const a = figPt(e.id, 0.5, 0);
        if (a) glowAt(SP.grey, a[0], a[1], 26 * s, 0.25 * env);
      } else if (e.type === 'flare') {
        glowAt(SP.white, e.x * W.w, e.y * W.h, (e.r || 60) * SU(), (e.k || 0.8) * env);
        glowAt(SP.gold, e.x * W.w, e.y * W.h, (e.r || 60) * 2.2 * SU(), (e.k || 0.8) * 0.45 * env);
      }
      normal(ctx);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const DRAW_UNDER = { road: drawRoad, houses: drawHouses, church: drawChurch, room: drawRoom, table: drawTable, spring: drawSpring, stand: drawStand, coins: drawCoins, dais: drawDais, vision: drawVision, crete: drawCrete, rome: drawRome };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const ORDER = { crete: 0, rome: 0, houses: 1, road: 2, church: 3, room: 4, vision: 5, dais: 6, spring: 7, table: 8, stand: 9, coins: 10 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  const SCENE = {
    init() { sprites(); },
    resize() { WL = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * (p.sp || 1) * f);
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { U.safe('pst.hidden', () => drawHidden(ctx)); return; }
      if (pass === 'air') {
        for (const r of ['study', 'cell']) { const p = getP(r); if (p && p.a > 0.005) U.safe('pst.desk', () => drawDesk(ctx, p)); }
        U.safe('pst.chain', () => drawChain(ctx));
        U.safe('pst.held', () => drawHeld(ctx));
        U.safe('pst.fire', () => drawFire(ctx));
        U.safe('pst.beam', () => drawBeam(ctx));
        U.safe('pst.descent', () => drawDescent(ctx));
        U.safe('pst.beside', () => drawBeside(ctx));
        U.safe('pst.crowns', () => drawCrowns(ctx));
        U.safe('pst.grace', () => drawGrace(ctx));
        U.safe('pst.pour', () => drawPour(ctx));
        U.safe('pst.streams', () => drawWordStreams(ctx));
        U.safe('pst.fx', () => drawTransients(ctx));
        U.safe('pst.veil', () => drawHiddenVeil(ctx));
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.005) continue;
        const fn = DRAW_UNDER[p.kind];
        if (fn) U.safe('pst.' + p.kind, () => fn(ctx, p));
      }
      if (l < 2) U.safe('pst.lamps', () => drawLamps(ctx, l));
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass !== 'seaNear') return;
      const sh = getP('ship');
      if (sh && sh.a > 0.005) U.safe('pst.ship', () => drawShip(ctx, sh));
    },
    reset() { P.clear(); FXL.length = 0; sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), p.layer, r2(p.v || 0), p.ta, r2(p.tk), r2(p.tk2), r2(p.tlit), r2(p.topen), r2(p.tgrow), p.label, p.style].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer);
        if (p.kind === 'room') {
          const G = roomG(p);
          consider(p.label, G.x0 + G.w * DESK_F, G.y - HP() * 0.34);
          if (p.style === 'cell') consider('书卷', G.x0 + G.w * 0.14, G.y - 3 * s);
        } else if (p.kind === 'road') { const xf = (X.land + X.tim) / 2; consider(p.label, xf * W.w, gY(2, xf) + 3 * s); }
        else if (p.kind === 'crete') { for (const xf of X.crete) consider(p.label, xf * W.w, gY(1, xf) - 8 * s); }
        else if (p.kind === 'rome') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, gY(1, xf) - 14 * s); }
        else if (p.kind === 'houses') { for (const q of X.houses) consider(p.label, q[0] * W.w, gY(2, q[0]) - 12 * s); }
        else if (p.kind === 'church') consider(p.label, p.x * W.w, gY(2, p.x) - 30 * s);
        else if (p.kind === 'dais') { const D = daisG(p); consider(p.label, D.x, D.top); }
        else consider(p.label, p.x * W.w, (p.layer === 2 ? pY(p) : gY(p.layer, p.x)) - 8 * s);
      }
      const sh = getP('ship');
      if (sh && sh.a > 0.4) { const q = shipPos(sh); consider('船', q[0], q[1] - 20 * SU()); }
      if (lvl('pstCrown') > 0.5 && has('paul')) { const h = figPt('paul', 1.1, 0); if (h) consider('冠冕', h[0], h[1]); }
      return best;
    },
  };

  function resetScene() {
    P.clear(); FXL.length = 0; sorted = []; sortedN = -1; WL = null;
    S = fresh();
  }

  // ════════════════════════════════════════════════════════════
  //  几件常用的事
  // ════════════════════════════════════════════════════════════
  // 保罗坐在桌前写信
  function paulAtDesk(o) {
    o = o || {};
    if (!has('paul')) paulAdd({ x: roomX(SEAT_F), facing: 1, pose: 'seat' });
    if (o.walk) walk('paul', roomX(SEAT_F), { speed: 0.02, pose: 'seat' });
    else { place('paul', roomX(SEAT_F)); pose('paul', 'seat'); }
    face('paul', 1);
    onFloor('paul');
  }
  // 以弗所的人：各在各的位置
  function churchAt(id, o) {
    o = o || {};
    if (!inChurch(id)) return;
    person(id, Object.assign({ x: X[id], facing: -1, v: VV(id) }, o));
  }
  // 书信在路上飞（自 a 到 b）
  function letterFly(b, from, to, dur, arc) { efx(b, { type: 'letter', from, to, dur: dur || 4, arc: arc || 30 }); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：黄昏，灯下的小屋；门口的路通到以弗所
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    W.set('bare', 0.05, true); W.set('bloom', 0.3, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.72, herbs: 0.5, trees: 0.2, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    for (const k of LEVELS) W.set(k, 0, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.72, W.ridgeBaseY(2, W.w * 0.72));
    const tx = PORT ? 0.34 : 0.42;
    W.setOrigin('trees', W.w * tx, W.ridgeBaseY(2, W.w * tx));
    W.goTo(0.79, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 12, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 小屋（灯点着）、路、以弗所的房屋
    prop('study', 'room', { x: X.room, w: X.roomW, style: 'study', lit: 1, label: '书信' });
    prop('road', 'road', { x0: roomX(0.93), x1: 1.02, label: '路' });
    prop('houses', 'houses', { x: X.houses[0][0], label: '以弗所' });
    const c = C();
    c.clear({ fade: false });
    // 保罗在灯下写信（1:1–2）；提摩太在以弗所（1:3）
    paulAtDesk();
    glow('paul', 0.12);
    person('timothy', { x: X.tim, facing: -1, v: VV('timothy') });
    churchAt('bro');
    churchAt('eldM');
    avoid([0.35, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 提前 1:15 基督耶稣降世，为要拯救罪人 ───────────────────────
    {
      kind: 'act', utter: '基督耶稣降世，为要拯救罪人', cmd: 'deploy 救恩 --to 世界 --for 罪人  # 罪魁也在其中', ref: '提摩太前书 1:15',
      verse: [
        { text: '「基督耶稣降世，为要拯救罪人。」这话是可信的，是十分可佩服的。<br>在罪人中我是个罪魁。', ref: '提摩太前书 1:15', hold: 6.5 },
        { text: '然而，我蒙了怜悯，是因耶稣基督要在我这罪魁身上显明他一切的忍耐，<br>给后来信他得永生的人作榜样。', ref: '提摩太前书 1:16', hold: 7.5 },
        { text: '但愿尊贵、荣耀归与那不能朽坏、不能看见、永世的君王、独一的神，<br>直到永永远远。阿们！', ref: '提摩太前书 1:17', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.86, 18, b.instant);
            W.set('pstDescend', 1, b.instant);
            pose('timothy', 'gaze'); face('timothy', -1);
            sfx(b, 'angel', { soft: true });
          }],
          // 落在地上：一圈光；路自这里向两头亮起
          [4, b => {
            W.set('pstRoad', 0.45, b.instant);
            if (!b.instant && fx()) { fx().ring(X.land * W.w, landY() - 6 * LS(2), [255, 240, 204], M() * 0.22, 2.4, 1.8); fx().sparkle(X.land * W.w, landY() - 8 * LS(2), 26, [255, 240, 210], 18 * SU(), 'top'); }
            sfx(b, 'chime');
          }],
          // 罪魁：保罗放下笔，转身跪下；光沿路走进他的屋里
          [5.2, () => { pose('paul', 'kneel'); face('paul', 1); }],
          [7.6, b => { W.set('pstMercy', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [12.6, b => {
            glow('paul', 0.42);
            ringOn(b, 'paul', 0.14, [255, 236, 190], 0.4); sparkleOn(b, 'paul', 22, [255, 236, 190], 0.5);
          }],
          // 给后来信他得永生的人作榜样：光自他那里沿路一直到以弗所
          [14.5, b => {
            W.set('pstRoad', 1, b.instant);
            glow('timothy', 0.4); glow('bro', 0.3); glow('eldM', 0.3);
            pose('timothy', 'stand'); pose('bro', 'raise'); pose('eldM', 'stand');
          }],
          // 但愿尊贵、荣耀归与……独一的神
          [17.2, b => { pose('paul', 'raise'); sfx(b, 'bell', { soft: true }); }],
          [22.4, () => { pose('paul', 'seat'); pose('bro', 'stand'); prop('study', null, { k2: 1 }); }],
        ]);
      },
    },

    // ── 2 · 提前 2:4 他愿意万人得救，明白真道 ─────────────────────────
    {
      kind: 'act', utter: '他愿意万人得救，明白真道', cmd: 'for 人 in 万人: pray(人)  # 一盏一盏亮', ref: '提摩太前书 2:4',
      verse: [
        { text: '我劝你，第一要为万人恳求、祷告、代求、祝谢；', ref: '提摩太前书 2:1', hold: 5.5 },
        { text: '这是好的，在神我们救主面前可蒙悦纳。<br>他愿意万人得救，明白真道。', ref: '提摩太前书 2:3–4', hold: 6.5 },
        { text: '因为只有一位神，在神和人中间，只有一位中保，<br>乃是降世为人的基督耶稣；他舍自己作万人的赎价……', ref: '提摩太前书 2:5–6', hold: 7.5 },
      ],
      apply(c) {
        const pray = ['timothy', 'bro', 'eldM'];
        T(c, [
          // 举起圣洁的手，随处祷告（2:8）
          [0, b => {
            W.goTo(0.96, 20, b.instant);
            pose('timothy', 'raise'); pose('bro', 'pray'); pose('eldM', 'raise');
            face('timothy', -1);
          }],
          [1.2, b => { pray.forEach((id, i) => efx(b, { type: 'prayer', id, dur: 5.5, t: -i * 0.6, seed: i * 1.7 })); sfx(b, 'sing', { soft: true }); }],
          // 万人：远近各地一盏一盏的灯
          [6.8, b => { W.set('pstAll', 1, b.instant); sfx(b, 'stars'); }],
          [11, b => { sfx(b, 'chime', { soft: true }); }],
          // 只有一位中保：天地之间一道光
          [14.8, b => {
            W.set('pstBeam', 1, b.instant);
            if (!b.instant && fx()) fx().ring(X.land * W.w, landY() - 20 * LS(2), [255, 246, 226], M() * 0.3, 2.8, 2);
            flashW(b, 0.25);
            sfx(b, 'harp');
            pose('timothy', 'kneel'); pose('bro', 'kneel'); pose('eldM', 'kneel');
          }],
          // 那道光收回去（到末了戴冠冕的时候才再显出来），免得后来的光都叠在它里面
          [22, b => { W.set('pstBeam', 0, b.instant); }],
        ]);
      },
    },

    // ── 3 · 提前 3:16 神在肉身显现 ───────────────────────────────────
    {
      kind: 'act', utter: '神在肉身显现', cmd: 'mount 柱石 && echo "大哉，敬虔的奥秘"', ref: '提摩太前书 3:16',
      verse: [
        { text: '……你也可以知道在神的家中当怎样行。<br>这家就是永生神的教会，真理的柱石和根基。', ref: '提摩太前书 3:15', hold: 6.5 },
        { text: '大哉，敬虔的奥秘，无人不以为然！<br>就是神在肉身显现，被圣灵称义，被天使看见，', ref: '提摩太前书 3:16', hold: 7 },
        { text: '被传于外邦，被世人信服，被接在荣耀里。', ref: '提摩太前书 3:16', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          // 神的家：根基、柱石
          [0, b => {
            W.goTo(0.13, 22, b.instant);
            pose('timothy', 'stand'); pose('bro', 'stand'); pose('eldM', 'stand');
            prop('church', 'church', { x: X.church, size: X.churchSize, grow: 0, label: '神的家' });
            prop('church', null, { grow: 1 });
            sfx(b, 'build');
          }],
          [3.5, b => {
            sfx(b, 'build', { soft: true }); face('timothy', 1); face('bro', 1); face('eldM', 1);
            nameOver(b, X.church, gY(2, X.church) - 96 * SU(), '神的家', { hold: 3.4, rgb: [255, 226, 176] });
          }],
          // 神在肉身显现
          [8.4, b => { efx(b, { type: 'figure', dur: 13 }); sfx(b, 'harp', { soft: true }); face('timothy', -1); face('bro', -1); face('eldM', -1); }],
          // 被圣灵称义
          [10.6, b => { efx(b, { type: 'dove', dur: 5.6 }); sfx(b, 'dove'); }],
          // 被天使看见
          [12.8, b => { efx(b, { type: 'host', dur: 6 }); sfx(b, 'angel', { soft: true }); }],
          // 被传于外邦
          [16.2, b => { efx(b, { type: 'nations', dur: 4.2 }); sfx(b, 'stars'); }],
          // 被世人信服
          [18, () => { pose('timothy', 'kneel'); pose('bro', 'kneel'); pose('eldM', 'kneel'); pose('paul', 'kneel'); }],
          // 被接在荣耀里
          [19.4, b => { efx(b, { type: 'ascend', dur: 4.5 }); sfx(b, 'bell', { soft: true }); }],
          [23.2, () => { pose('paul', 'seat'); }],
        ]);
      },
    },

    // ── 4 · 提前 4:4 凡神所造的物都是好的 ───────────────────────────
    {
      kind: 'bless', utter: '凡神所造的物都是好的', cmd: 'assert(all(神所造的物).好)  # 感谢着领受', ref: '提摩太前书 4:4',
      verse: [
        { text: '凡神所造的物都是好的，若感谢着领受，就没有一样可弃的，<br>都因神的道和人的祈求成为圣洁了。', ref: '提摩太前书 4:4–5', hold: 7 },
        { text: '不可叫人小看你年轻，总要在言语、行为、爱心、信心、清洁上，<br>都作信徒的榜样。', ref: '提摩太前书 4:12', hold: 6.5 },
        { text: '不可严责老年人，只要劝他如同父亲；劝少年人如同弟兄；<br>劝老年妇女如同母亲；劝少年妇女如同姊妹；总要清清洁洁的。', ref: '提摩太前书 5:1–2', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          // 天亮了；遍地开花
          [0, b => {
            W.goTo(0.31, 12, b.instant);
            W.set('bloom', 1, b.instant); W.set('grass', 0.95, b.instant); W.set('herbs', 0.85, b.instant);
            W.setPop('bird', 26, W.w * 0.7, W.h * 0.3, b.instant);
            pose('timothy', 'stand'); pose('bro', 'stand'); pose('eldM', 'stand');
            sfx(b, 'bird', { soft: true });
          }],
          // 饼与果子摆在桌上：感谢着领受
          [2.6, b => {
            prop('table', 'table', { x: X.table, v: PV('table'), grow: 0, label: '食物' });
            prop('table', null, { grow: 1, k: 1 });
            walk('bro', xo(X.table, -28), { speed: 0.02 }); walk('eldM', xo(X.table, 26), { speed: 0.02 });
          }],
          [5.2, b => { pose('bro', 'raise'); pose('eldM', 'raise'); face('bro', 1); face('eldM', -1); sfx(b, 'harp', { soft: true }); }],
          // 作信徒的榜样：提摩太宣读（4:13）
          [8.6, b => {
            S.timScroll = 1;
            pose('timothy', 'carry'); face('timothy', 1);
            glow('timothy', 0.5);
            sparkleOn(b, 'timothy', 16, [255, 236, 190], 0.62);
          }],
          // 老年人如同父亲，老年妇女如同母亲，少年人如同弟兄，少年妇女如同姊妹
          [16.2, b => {
            churchAt('eldF', { x: xo(X.eldF, 60), facing: -1 }); walk('eldF', X.eldF, { speed: 0.02 });
            churchAt('yM', { x: xo(X.yM, 60), facing: -1 }); walk('yM', X.yM, { speed: 0.022 });
            churchAt('yF', { x: xo(X.yF, 60), facing: -1 }); walk('yF', X.yF, { speed: 0.022 });
            walk('bro', X.bro, { speed: 0.02 }); walk('eldM', X.eldM, { speed: 0.02 });
          }],
          [21.5, b => {
            pose('timothy', 'bow'); face('timothy', 1);
            church().forEach(id => { pose(id, 'stand'); face(id, -1); glow(id, 0.3); });
            sfx(b, 'crowd', { soft: true });
          }],
          [24, () => { pose('timothy', 'stand'); }],
        ]);
      },
    },

    // ── 5 · 提前 6:16 住在人不能靠近的光里 ─────────────────────────────
    {
      kind: 'act', utter: '住在人不能靠近的光里', cmd: 'ls 世上/  # 没有带什么来，也不能带什么去', ref: '提摩太前书 6:16',
      verse: [
        { text: '然而，敬虔加上知足的心便是大利了；<br>因为我们没有带什么到世上来，也不能带什么去。', ref: '提摩太前书 6:6–7', hold: 6.5 },
        { text: '你要为真道打那美好的仗，持定永生。<br>你为此被召，也在许多见证人面前，已经作了那美好的见证。', ref: '提摩太前书 6:12', hold: 7 },
        { text: '就是那独一不死、住在人不能靠近的光里，是人未曾看见、也是不能看见的，<br>要将他显明出来。但愿尊贵和永远的权能都归给他。阿们！', ref: '提摩太前书 6:16', hold: 8 },
      ],
      apply(c) {
        T(c, [
          // 一堆金银，化作尘土随风散去
          [0, b => {
            W.goTo(0.45, 14, b.instant);
            prop('coins', 'coins', { x: X.coins, v: PV('coins'), label: '金银' });
            sfx(b, 'coins');
          }],
          [3, b => { prop('coins', null, { k2: 1 }); W.set('gale', 0.35, b.instant); sfx(b, 'wind'); }],
          [6.6, b => { unprop('coins'); W.set('gale', 0, b.instant); }],
          // 打那美好的仗，持定永生：提摩太在许多见证人面前
          [7.8, b => {
            S.timScroll = 0;
            unprop('table');
            walk('timothy', X.timGo, { speed: 0.012, pose: 'stand' }); face('timothy', -1);
            church().forEach(id => face(id, 'timothy'));
          }],
          [10.6, b => {
            pose('timothy', 'raise'); glow('timothy', 0.6);
            const h = figPt('timothy', 1.05, 0);
            if (h && !b.instant) efx(b, { type: 'flare', x: h[0] / W.w, y: h[1] / W.h, r: 16, k: 0.9, dur: 2.6 });
            sfx(b, 'harp', { soft: true });
          }],
          // 住在人不能靠近的光里
          [16.2, b => {
            W.set('pstHidden', 1, b.instant);
            flashW(b, 0.5);
            sfx(b, 'angel');
          }],
          [17.2, () => { pose('timothy', 'kneel'); church().forEach(id => pose(id, 'kneel')); pose('paul', 'kneel'); }],
          [22.6, b => { W.set('pstHidden', 0.22, b.instant); }],
          [24.4, () => { pose('timothy', 'stand'); church().forEach(id => pose(id, 'stand')); pose('paul', 'seat'); }],
        ]);
      },
    },

    // ── 6 · 多 1:2 那无谎言的神在万古之先所应许的永生 ──────────────────
    {
      kind: 'promise', utter: '那无谎言的神在万古之先所应许的永生', cmd: 'sail 克里特 && light --each 城 长老', ref: '提多书 1:2',
      verse: [
        { text: '神的仆人，耶稣基督的使徒保罗，凭着神选民的信心与敬虔真理的知识，<br>盼望那无谎言的神在万古之先所应许的永生，', ref: '提多书 1:1–2', hold: 7.5 },
        { text: '现在写信给提多，就是照着我们共信之道作我真儿子的。', ref: '提多书 1:4', hold: 5 },
        { text: '我从前留你在克里特，是要你将那没有办完的事都办整齐了，<br>又照我所吩咐你的，在各城设立长老。', ref: '提多书 1:5', hold: 7 },
      ],
      apply(c) {
        const give = () => roomX(0.99);
        T(c, [
          [0, b => {
            W.goTo(0.7, 24, b.instant);
            W.set('pstHidden', 0, b.instant);
            prop('study', null, { k2: 1.4 });
            paulAtDesk();
            sfx(b, 'write');
            // 提多自路上来
            person('titus', { x: xo(give(), 60), facing: -1 });
            walk('titus', xo(give(), 12), { speed: 0.016 });
          }],
          [4, b => { sparkleAt(b, roomX(DESK_F) * W.w, gY(2, roomX(DESK_F)) - HP() * 0.36, 20, [255, 236, 190], 10); }],
          // 写信给提多：保罗起来，把书信交在他手里
          [8.8, b => {
            attach('paul', null);
            walk('paul', xo(give(), -4), { speed: 0.016, pose: 'stand' });
            onFloor('paul');
            prop('study', null, { k2: 0 });
          }],
          [11.6, b => { face('paul', 1); face('titus', -1); S.titLetter = 1; pose('titus', 'carry'); pose('paul', 'point'); sfx(b, 'scroll'); }],
          // 往克里特：上船
          [13.4, b => {
            walk('titus', X.ship0[0], { speed: 0.014 });
            prop('ship', 'ship', { k: 0, label: '船' });
          }],
          [16.4, b => { rm('titus'); S.titLetter = 0; prop('ship', null, { k: 1 }); sfx(b, 'wave', { soft: true }); }],
          // 在各城设立长老：中丘上各城一盏一盏点起灯
          // 近黄昏：各城的灯看得清楚
          [18.6, b => {
            W.goTo(0.76, 10, b.instant);
            prop('crete', 'crete', { layer: 1, k: 0, label: '克里特', sp: 0.5 });
            prop('crete', null, { k: 1 });
            nameOver(b, 0.62, W.h * 0.5, '克里特', { hold: 3.4, rgb: [255, 214, 150] });
            sfx(b, 'bell', { soft: true });
            paulAtDesk({ walk: true });
          }],
          [25.5, () => { unprop('ship'); }],
        ]);
      },
    },

    // ── 7 · 多 2:11 神救众人的恩典已经显明出来 ─────────────────────────
    {
      kind: 'act', utter: '神救众人的恩典已经显明出来', cmd: 'sunrise 恩典 --for 众人', ref: '提多书 2:11',
      verse: [
        { text: '因为神救众人的恩典已经显明出来，<br>教训我们除去不敬虔的心和世俗的情欲，在今世自守、公义、敬虔度日，', ref: '提多书 2:11–12', hold: 7.5 },
        { text: '等候所盼望的福，并等候至大的神和我们救主耶稣基督的荣耀显现。', ref: '提多书 2:13', hold: 6 },
        { text: '他为我们舍了自己，要赎我们脱离一切罪恶，<br>又洁净我们，特作自己的子民，热心为善。', ref: '提多书 2:14', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 夜尽天明：晨光自东（左）向西扫过大地
          [0, b => {
            unprop('ship');
            W.goTo(0.285, 12, b.instant);
            church().forEach(id => pose(id, 'sit'));
            pose('timothy', 'sit'); pose('paul', 'seat');
          }],
          [3.5, b => { W.set('pstGrace', 1, b.instant); sfx(b, 'harp'); }],
          [7, b => { glow('paul', 0.5); sparkleOn(b, 'paul', 14, [255, 226, 170], 0.5); }],
          [9.4, b => {
            pose('timothy', 'stand'); glow('timothy', 0.55); sparkleOn(b, 'timothy', 12, [255, 226, 170], 0.6);
            church().forEach((id, i) => { pose(id, 'stand'); glow(id, 0.42); });
            sfx(b, 'bird');
          }],
          // 等候……荣耀显现：众人向东仰望
          [11.2, () => { pose('timothy', 'gaze'); church().forEach(id => { face(id, -1); pose(id, 'gaze'); }); face('timothy', -1); }],
          // 热心为善：少年人拿着包袱、少年妇女拿着瓦罐，沿路出去
          [16.4, b => {
            pose('timothy', 'stand'); church().forEach(id => pose(id, 'stand'));
            const sp = PORT ? 0.04 : 0.03;
            if (inChurch('yM')) { person('yM', { prop: 'bundle' }); walk('yM', X.yMgo, { speed: sp }); }
            if (inChurch('yF')) { person('yF', { prop: 'jar' }); walk('yF', X.yFgo, { speed: sp }); }
            if (!inChurch('yF')) { person('eldF', { prop: 'jar' }); walk('eldF', X.yFgo, { speed: sp }); }
            pose('eldM', 'raise');
            sfx(b, 'crowd', { soft: true });
          }],
          [23.5, () => { pose('eldM', 'stand'); }],
        ]);
      },
    },

    // ── 8 · 多 3:5 藉着重生的洗和圣灵的更新 ───────────────────────────
    {
      kind: 'act', utter: '藉着重生的洗和圣灵的更新', cmd: 'wash --rebirth && renew --by 圣灵', ref: '提多书 3:5',
      verse: [
        { text: '我们从前也是无知、悖逆、受迷惑、服事各样私欲，和宴乐，<br>常存恶毒嫉妒的心，是可恨的，又是彼此相恨。', ref: '提多书 3:3', hold: 6.5 },
        { text: '但到了神我们救主的恩慈和他向人所施的慈爱显明的时候，他便救了我们；<br>并不是因我们自己所行的义，乃是照他的怜悯，藉着重生的洗和圣灵的更新。', ref: '提多书 3:4–5', hold: 8.5 },
        { text: '圣灵就是神藉着耶稣基督我们救主厚厚浇灌在我们身上的，<br>好叫我们因他的恩得称为义，可以凭着永生的盼望成为后嗣。', ref: '提多书 3:6–7', hold: 7.5 },
      ],
      apply(c) {
        const all = () => ['timothy'].concat(church());
        // 各人跪在泉的两边（左三右三；手机左二右二），拿杖的老人在两头，泉与升起的光露在中间
        const spot = id => xo(X.spring, X.spot[id] || 0);
        const goTo = (id, x, sec, o) => { const f = fig(id); const d = f ? Math.abs((f.tx != null ? f.tx : f.nx) - x) : 0; walk(id, x, Object.assign({ speed: Math.max(0.02, d / sec) }, o)); };
        T(c, [
          // 从前：一层灰暗，彼此相背
          [0, b => {
            W.goTo(0.36, 10, b.instant);
            W.set('gloom', 0.45, b.instant);
            all().forEach((id, i) => { face(id, i % 2 ? 1 : -1); pose(id, 'bow'); glow(id, 0.08); });
            if (inChurch('yM')) person('yM', { prop: null });
            if (inChurch('yF')) person('yF', { prop: null });
            person('eldF', { prop: null });
            sfx(b, 'wind', { soft: true });
          }],
          // 恩慈显明：灰暗退去，一眼泉涌出来
          [7.8, b => {
            W.set('gloom', 0, b.instant);
            prop('spring', 'spring', { x: X.spring, v: PV('spring'), grow: 0, k: 0, label: '重生的洗' });
            prop('spring', null, { grow: 1, k: 1 });
            sfx(b, 'splash');
            if (!b.instant && fx()) fx().ring(X.spring * W.w, gYv(X.spring, PV('spring')), [220, 236, 255], M() * 0.18, 2.2, 1.6);
          }],
          // 人人来到泉边洗过：衣裳都亮了
          [10.2, b => {
            all().forEach(id => { goTo(id, spot(id), 3.6, { pose: 'kneel' }); });
          }],
          [14, b => {
            S.renewed = 1;
            all().forEach(id => face(id, X.spring));
            all().forEach((id, i) => {
              const base = (PEOPLE[id] || {}).robe;
              if (base) person(id, { robe: renewRobe(base) });
              glow(id, 0.45);
              sparkleOn(b, id, 10, [226, 238, 255], 0.5);
            });
            sfx(b, 'harp');
          }],
          // 厚厚浇灌：光如雨落下
          [17.8, b => {
            W.set('pstPour', 1, b.instant);
            all().forEach(id => pose(id, 'raise'));
            sfx(b, 'rain', { soft: true });
          }],
          // 各回各的地方（仍在光雨里）
          [21.6, () => { all().forEach(id => goTo(id, id === 'timothy' ? X.tim : X[id], 4.2, { pose: 'stand' })); }],
          [24.2, b => { W.set('pstPour', 0, b.instant); all().forEach(id => face(id, -1)); }],
        ]);
      },
    },

    // ── 9 · 提后 1:7 神赐给我们，不是胆怯的心 ─────────────────────────
    {
      kind: 'act', utter: '神赐给我们，不是胆怯的心', cmd: 'rekindle 恩赐 --like 火  # 乃是刚强、仁爱、谨守的心', ref: '提摩太后书 1:7',
      verse: [
        { text: '我感谢神……祈祷的时候，不住的想念你，<br>记念你的眼泪，昼夜切切地想要见你，好叫我满心快乐。', ref: '提摩太后书 1:3–4', hold: 7 },
        { text: '为此我提醒你，使你将神藉我按手所给你的恩赐再如火挑旺起来。<br>因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。', ref: '提摩太后书 1:6–7', hold: 8.5 },
        { text: '你不要以给我们的主作见证为耻，也不要以我这为主被囚的为耻；<br>总要按神的能力，与我为福音同受苦难。', ref: '提摩太后书 1:8', hold: 7 },
      ],
      apply(c) {
        const ids = () => ['timothy'].concat(church());
        T(c, [
          // 黄昏：屋子成了罗马的监；保罗老了，带着锁链
          [0, b => {
            W.goTo(0.8, 8, b.instant);
            prop('study', null, { lit: 0 });
            unprop('crete');
            unprop('spring');
            unprop('table');
            W.set('gloom', 0.35, b.instant);
            ids().forEach(id => pose(id, 'stand'));
            sfx(b, 'wind', { soft: true });
          }],
          [2.4, b => {
            unprop('study');
            prop('cell', 'room', { x: X.room, w: X.roomW, style: 'cell', lit: 1, label: '锁链' });
            prop('rome', 'rome', { layer: 1, x0: X.rome0, x1: X.rome1, label: '罗马' });
            S.paulOld = 1; S.chain = 1;
            paulAdd({ age: 'elder', glow: 0.34 });
            paulAtDesk();
            person('guard', { x: X.guard, facing: -1 });
            W.set('gloom', 0, b.instant);
            sfx(b, 'chains');
          }],
          [4.6, b => { nameOver(b, 0.72, W.h * 0.46, '罗马', { hold: 3.2 }); }],
          // 记念你的眼泪
          [5, b => { pose('timothy', 'weep', { weep: true }); sfx(b, 'weep', { soft: true }); }],
          // 书信沿路到了提摩太手里
          [8.6, b => {
            prop('cell', null, { k2: 1 });
            sfx(b, 'write');
            letterFly(b, () => { const p = getP('cell'); return p ? [roomG(p).x1, roomG(p).y - HP() * 0.5] : null; }, () => handOf('timothy'), 4.2, 40);
          }],
          [12.8, b => {
            prop('cell', null, { k2: 0 });
            pose('timothy', 'carry', { weep: false }); face('timothy', -1);
            S.fireAt = 'hands';
            W.set('pstFire', 0.2, b.instant);
            sfx(b, 'scroll');
          }],
          // 再如火挑旺起来
          [15, b => {
            W.set('pstFire', 1, b.instant);
            glow('timothy', 0.6);
            sfx(b, 'fire');
            const h = handOf('timothy');
            if (h && !b.instant && fx()) fx().sparkle(h[0], h[1] - 6 * SU(), 24, [255, 200, 120], 12 * SU(), 'top');
          }],
          // 不以为耻：他转向罗马，走上几步
          [18.4, () => { walk('timothy', X.timGo, { speed: 0.01, pose: 'carry' }); church().forEach(id => face(id, -1)); }],
        ]);
      },
    },

    // ── 10 · 提后 2:9 神的道却不被捆绑 ─────────────────────────────────
    {
      kind: 'act', utter: '神的道却不被捆绑', cmd: 'chmod +x 神的道  # 锁链 ≠ 捆绑', ref: '提摩太后书 2:9',
      verse: [
        { text: '你要和我同受苦难，好像基督耶稣的精兵。', ref: '提摩太后书 2:3', hold: 4.5 },
        { text: '你要记念耶稣基督乃是大卫的后裔，他从死里复活，正合乎我所传的福音。<br>我为这福音受苦难，甚至被捆绑，像犯人一样。然而神的道却不被捆绑。', ref: '提摩太后书 2:8–9', hold: 9 },
        { text: '你当竭力在神面前得蒙喜悦，作无愧的工人，<br>按着正意分解真理的道。', ref: '提摩太后书 2:15', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 夜里：他举起带锁链的手
          [0, b => {
            W.goTo(0.93, 10, b.instant);
            attach('paul', null); pose('paul', 'stand'); onFloor('paul');
            face('guard', -1);
          }],
          [1.6, b => { pose('paul', 'raise'); sfx(b, 'chains'); efx(b, { type: 'glint', dur: 1.2 }); }],
          // 他又坐下写；字化作光，从小窗飞出去，落在远近的地上
          [5.8, b => { paulAtDesk(); prop('cell', null, { k2: 1 }); sfx(b, 'write'); }],
          [8, b => { W.set('pstWord', 1, b.instant); sfx(b, 'scroll'); }],
          [11, b => { sfx(b, 'stars'); }],
          [13.6, b => {
            efx(b, { type: 'glint', dur: 1.6 });
            if (!b.instant && fx()) { const w0 = windowPt(); fx().ring(w0[0], w0[1], [255, 236, 190], M() * 0.25, 2.4, 1.6); }
            sfx(b, 'bell', { soft: true });
          }],
          // 作无愧的工人：提摩太把火放在灯台上，拿起书卷教导人
          [16.4, b => {
            prop('cell', null, { k2: 0 });
            prop('stand', 'stand', { x: X.stand, v: PV('stand'), label: '灯台' });
            walk('timothy', xo(X.stand, -9), { speed: 0.012, pose: 'stand' }); face('timothy', 1);
          }],
          [18.6, b => {
            S.fireAt = 'stand';
            S.timScroll = 1;
            walk('timothy', X.timTeach, { speed: 0.01, pose: 'carry' });
            church().forEach(id => { face(id, -1); pose(id, 'sit'); });
            sfx(b, 'fire', { soft: true });
          }],
          [21.2, () => { face('timothy', 1); pose('timothy', 'point'); }],
        ]);
      },
    },

    // ── 11 · 提后 3:16 圣经都是神所默示的 ─────────────────────────────
    {
      kind: 'act', utter: '圣经都是神所默示的', cmd: 'cat 圣经/* | breathe --from 神', ref: '提摩太后书 3:16',
      verse: [
        { text: '但你所学习的，所确信的，要存在心里；因为你知道是跟谁学的，<br>并且知道你是从小明白圣经，这圣经能使你因信基督耶稣，有得救的智慧。', ref: '提摩太后书 3:14–15', hold: 8.5 },
        { text: '圣经都是神所默示的，于教训、督责、使人归正、<br>教导人学义都是有益的，', ref: '提摩太后书 3:16', hold: 6.5 },
        { text: '叫属神的人得以完全，预备行各样的善事。', ref: '提摩太后书 3:17', hold: 5 },
      ],
      apply(c) {
        T(c, [
          // 幼年的光景：外祖母罗以、母亲友妮基与孩子同读经卷
          [0, b => {
            W.goTo(0.04, 12, b.instant);
            prop('vision', 'vision', { x: X.vis1, v: PV('vision'), label: '' });
            person('lois', { x: X.vis0, facing: 1, pose: 'sit', v: VV('vision'), from: b.instant ? 'none' : 'light' });
            person('child', { x: X.vis1, facing: 1, pose: 'sit', v: VV('vision'), from: b.instant ? 'none' : 'light' });
            person('eunice', { x: X.vis2, facing: -1, pose: 'sit', v: VV('vision'), from: b.instant ? 'none' : 'light' });
            S.child = 1;
            face('timothy', -1); pose('timothy', 'carry');
            sfx(b, 'harp', { soft: true });
          }],
          [3.6, () => { face('child', -1); }],
          // 神所默示：一口气自天吹过，所有的书卷都亮了
          [9.8, b => {
            efx(b, { type: 'breath', dur: 5.5 });
            sfx(b, 'wind', { soft: true });
          }],
          [11.4, b => {
            W.set('pstScroll', 1, b.instant);
            flashW(b, 0.2);
            sfx(b, 'harp');
            if (!b.instant && fx()) {
              const p = getP('cell');
              if (p) { const G = roomG(p); fx().sparkle(G.x0 + G.w * DESK_F, G.y - HP() * 0.36, 26, [255, 232, 170], 14 * SU(), 'top'); fx().sparkle(G.x0 + G.w * 0.14, G.y - 4 * LS(2), 18, [255, 232, 170], 12 * SU(), 'top'); }
              const h = handOf('timothy'); if (h) fx().sparkle(h[0], h[1], 22, [255, 232, 170], 12 * SU(), 'top');
              const k = handOf('child'); if (k) fx().sparkle(k[0], k[1], 14, [255, 232, 170], 10 * SU(), 'top');
            }
          }],
          // 叫属神的人得以完全，预备行各样的善事
          [17.8, b => {
            unprop('vision');
            rm('lois'); rm('child'); rm('eunice'); S.child = 0;
            pose('timothy', 'raise'); glow('timothy', 0.62);
            church().forEach(id => { pose(id, 'stand'); face(id, -1); });
          }],
          [22.4, () => { pose('timothy', 'carry'); face('timothy', 1); }],
        ]);
      },
    },

    // ── 12 · 提后 4:17 惟有主站在我旁边，加给我力量 ─────────────────────
    {
      kind: 'act', utter: '惟有主站在我旁边，加给我力量', cmd: 'stand --beside 保罗 --when 无人', ref: '提摩太后书 4:17',
      verse: [
        { text: '我初次申诉，没有人前来帮助，竟都离弃我；但愿这罪不归与他们。', ref: '提摩太后书 4:16', hold: 6.5 },
        { text: '惟有主站在我旁边，加给我力量，使福音被我尽都传明，叫外邦人都听见；<br>我也从狮子口里被救出来。', ref: '提摩太后书 4:17', hold: 7.5 },
        { text: '主必救我脱离诸般的凶恶，也必救我进他的天国。<br>愿荣耀归给他，直到永永远远。阿们。', ref: '提摩太后书 4:18', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 审判座；保罗被带出来，站在官长面前；两个同伴跟着他出来
          [0, b => {
            W.goTo(0.37, 8, b.instant);
            prop('dais', 'dais', { x: X.trib, label: '申诉' });
            person('judge', { x: xo(X.trib, 4), facing: -1, pose: 'seat' });
            attach('judge', () => { const p = getP('dais'); return p ? [daisG(p).x + daisG(p).w * 0.14, daisG(p).top] : null; });
            prop('cell', null, { open: 1 });
            sfx(b, 'gate');
            walk('guard', roomX(0.8), { speed: 0.014 }); onFloor('guard');
            person('demas', { x: X.demas, facing: 1, v: VV('demas') }); person('comp', { x: X.comp, facing: 1, v: VV('comp') });
            W.set('pstScroll', 0.35, b.instant);   // 书卷仍有柔光，光柱收了
          }],
          [1.2, b => {
            attach('paul', null);
            walk('paul', X.paulT, { speed: 0.026, pose: 'stand' });
          }],
          // 竟都离弃我：同伴背过身去，离开审判座，经过监外往树那边走，不见了（一片冷跟着他们）
          [4.4, b => {
            for (const id of ['demas', 'comp']) {
              const f = fig(id), to = X[id + 'Go'];
              if (f) walk(id, to, { speed: Math.max(0.03, Math.abs(f.nx - to) / 3.2) });
              efx(b, { type: 'depart', id, dur: 4.6 });
            }
          }],
          [7.7, () => { rm('demas'); rm('comp'); }],
          [7.4, () => { face('paul', 1); }],
          // 惟有主站在我旁边
          [8, b => {
            W.set('pstBeside', 1, b.instant);
            glow('paul', 0.62);
            flashW(b, 0.2);
            sfx(b, 'angel');
          }],
          [9.6, b => { pose('paul', 'raise'); ringOn(b, 'paul', 0.24, [255, 244, 220], 0.6); }],
          // 叫外邦人都听见：远近的光一齐一亮
          [12.4, b => {
            pose('paul', 'stand');
            if (!b.instant && fx()) { const h = figPt('paul', 0.6, 0); if (h) fx().ring(h[0], h[1], [255, 236, 196], M() * 0.55, 3.2, 2); }
            sfx(b, 'stars');
          }],
          // 审判座退去；他回到监里，那光仍在他旁边
          [16.8, b => {
            unprop('dais'); rm('judge');
            walk('paul', roomX(SEAT_F), { speed: 0.016, pose: 'seat' });
            onFloor('paul');
            walk('guard', X.guard, { speed: 0.012 });
          }],
          [22.4, () => { prop('cell', null, { open: 0 }); pose('paul', 'seat'); face('paul', 1); }],
        ]);
      },
    },

    // ── 13 · 提后 4:8 也赐给凡爱慕他显现的人 ─────────────────
    {
      kind: 'promise', utter: '也赐给凡爱慕他显现的人', cmd: 'finish 仗 路 道 && award 冠冕 --to 凡爱慕他显现的人', ref: '提摩太后书 4:8',
      verse: [
        { text: '我现在被浇奠，我离世的时候到了。<br>那美好的仗我已经打过了，当跑的路我已经跑尽了，所信的道我已经守住了。', ref: '提摩太后书 4:6–7', hold: 8.5 },
        { text: '从此以后，有公义的冠冕为我存留，就是按着公义审判的主到了那日要赐给我的；<br>不但赐给我，也赐给凡爱慕他显现的人。', ref: '提摩太后书 4:8', hold: 8.5 },
        { text: '愿主与你的灵同在！愿恩惠常与你们同在！', ref: '提摩太后书 4:22', hold: 5.5 },
      ],
      apply(c) {
        const ids = () => ['timothy'].concat(church());
        T(c, [
          // 被浇奠：一股光自上浇下；锁链脱落，门开了
          [0, b => {
            W.goTo(0.742, 12, b.instant);
            efx(b, { type: 'pour', id: 'paul', dur: 4.5 });
            sfx(b, 'harp', { soft: true });
          }],
          [2.2, b => { S.chain = 0; prop('cell', null, { open: 1 }); sfx(b, 'chains'); sfx(b, 'gate', { soft: true }); pose('paul', 'stand'); face('guard', 1); }],
          // 当跑的路：老保罗拄杖沿着金色的路走到尽头
          [3.2, b => {
            attach('paul', null);
            prop('road', null, { k: 1 });
            walk('paul', X.paulEnd, { speed: 0.02, pose: 'stand' });
            walk('guard', roomX(0.8), { speed: 0.012 }); onFloor('guard');
            ids().forEach(id => { face(id, -1); pose(id, 'stand'); });
          }],
          // 公义的冠冕：在他旁边的光归入天地之间的那道光；一圈光自天落在他头上
          [10.2, b => {
            W.set('pstBeam', 0.9, b.instant);
            W.set('pstBeside', 0, b.instant);
            face('paul', 1); pose('paul', 'raise');
            W.set('pstCrown', 1, b.instant);
            sfx(b, 'bell');
          }],
          [13.8, b => { pose('paul', 'kneel'); ringOn(b, 'paul', 0.2, [255, 232, 170], 0.7); }],
          // 也赐给凡爱慕他显现的人
          [15.6, b => {
            W.set('pstCrowns', 1, b.instant);
            ids().forEach(id => pose(id, 'kneel'));
            sfx(b, 'sing', { soft: true });
          }],
          // 愿主与你的灵同在！愿恩惠常与你们同在！
          [19.8, b => {
            pose('timothy', 'raise');
            W.set('bloom', 1, b.instant);
            if (!b.instant && fx()) fx().ring(X.land * W.w, landY() - 20 * LS(2), [255, 236, 190], Math.max(W.w, W.h) * 0.8, 4, 2.4);
            sfx(b, 'harp');
          }],
          [23.5, b => { W.set('pstBeam', 0.4, b.instant); pose('timothy', 'stand'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '教牧书信', books: [54, 55, 56], title: '美好的仗', sub: '提摩太前书 · 提摩太后书 · 提多书', tint: [255, 230, 190], music: 'nehemiah',
    outro: 24,
    intro: [
      { text: '奉我们救主神和我们的盼望基督耶稣之命，作基督耶稣使徒的保罗<br>写信给那因信主作我真儿子的提摩太。', ref: '提摩太前书 1:1–2', hold: 7 },
      { text: '我往马其顿去的时候，曾劝你仍住在以弗所……', ref: '提摩太前书 1:3', hold: 4.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '保罗': { text: '那美好的仗我已经打过了，当跑的路我已经跑尽了，所信的道我已经守住了。', ref: '提摩太后书 4:7' },
      '提摩太': { text: '不可叫人小看你年轻，总要在言语、行为、爱心、信心、清洁上，都作信徒的榜样。', ref: '提摩太前书 4:12' },
      '提多': { text: '现在写信给提多，就是照着我们共信之道作我真儿子的。', ref: '提多书 1:4' },
      '书信': { text: '我指望快到你那里去，所以先将这些事写给你。', ref: '提摩太前书 3:14' },
      '锁链': { text: '愿主怜悯阿尼色弗一家的人；因他屡次使我畅快，不以我的锁链为耻，', ref: '提摩太后书 1:16' },
      '书卷': { text: '我在特罗亚留于加布的那件外衣，你来的时候可以带来，那些书也要带来，更要紧的是那些皮卷。', ref: '提摩太后书 4:13' },
      '路': { text: '那美好的仗我已经打过了，当跑的路我已经跑尽了……', ref: '提摩太后书 4:7' },
      '神的家': { text: '这家就是永生神的教会，真理的柱石和根基。', ref: '提摩太前书 3:15' },
      '以弗所': { text: '我往马其顿去的时候，曾劝你仍住在以弗所，好嘱咐那几个人不可传异教，', ref: '提摩太前书 1:3' },
      '克里特': { text: '我从前留你在克里特，是要你将那没有办完的事都办整齐了，又照我所吩咐你的，在各城设立长老。', ref: '提多书 1:5' },
      '罗马': { text: '反倒在罗马的时候，殷勤地找我，并且找着了。', ref: '提摩太后书 1:17' },
      '船': { text: '我打发亚提马或是推基古到你那里去的时候，你要赶紧往尼哥坡里去见我，因为我已经定意在那里过冬。', ref: '提多书 3:12' },
      '食物': { text: '……又禁戒食物，就是神所造、叫那信而明白真道的人感谢着领受的。', ref: '提摩太前书 4:3' },
      '金银': { text: '贪财是万恶之根。', ref: '提摩太前书 6:10' },
      '老年人': { text: '劝老年人要有节制、端庄、自守，在信心、爱心、忍耐上都要纯全无疵。', ref: '提多书 2:2' },
      '老年妇女': { text: '又劝老年妇人，举止行动要恭敬，不说谗言，不给酒作奴仆，用善道教训人，', ref: '提多书 2:3' },
      '少年人': { text: '又劝少年人要谨守。', ref: '提多书 2:6' },
      '少年妇女': { text: '好指教少年妇人，爱丈夫，爱儿女，', ref: '提多书 2:4' },
      '弟兄': { text: '你若将这些事提醒弟兄们，便是基督耶稣的好执事，', ref: '提摩太前书 4:6' },
      '罗以': { text: '想到你心里无伪之信，这信是先在你外祖母罗以和你母亲友妮基心里的，我深信也在你的心里。', ref: '提摩太后书 1:5' },
      '友妮基': { text: '想到你心里无伪之信，这信是先在你外祖母罗以和你母亲友妮基心里的，我深信也在你的心里。', ref: '提摩太后书 1:5' },
      '看守的兵': { text: '凡在军中当兵的，不将世务缠身，好叫那招他当兵的人喜悦。', ref: '提摩太后书 2:4' },
      '官长': { text: '我初次申诉，没有人前来帮助，竟都离弃我；但愿这罪不归与他们。', ref: '提摩太后书 4:16' },
      '申诉': { text: '我初次申诉，没有人前来帮助，竟都离弃我；但愿这罪不归与他们。', ref: '提摩太后书 4:16' },
      '底马': { text: '因为底马贪爱现今的世界，就离弃我往帖撒罗尼迦去了；', ref: '提摩太后书 4:10' },
      '同伴': { text: '凡在亚细亚的人都离弃我，这是你知道的，其中有腓吉路和黑摩其尼。', ref: '提摩太后书 1:15' },
      '重生的洗': { text: '他便救了我们；并不是因我们自己所行的义，乃是照他的怜悯，藉着重生的洗和圣灵的更新。', ref: '提多书 3:5' },
      '灯台': { text: '为此我提醒你，使你将神藉我按手所给你的恩赐再如火挑旺起来。', ref: '提摩太后书 1:6' },
      '冠冕': { text: '从此以后，有公义的冠冕为我存留，就是按着公义审判的主到了那日要赐给我的；', ref: '提摩太后书 4:8' },
    },
  });
})(window.GS);
