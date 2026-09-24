/* ─────────────────────────────────────────────────────────────
 * book/ezekiel.js —— 以西结书 · 以西结（以西结书 1 — 48）
 *
 * 迦巴鲁河边，被掳的人坐在帐棚前；祭司以西结在他们中间。
 * 一 · 「天就开了」——狂风从北方刮来，一朵包括闪烁火的大云自远而近，从火中显出四个活物（1:4–13）。
 * 二 · 轮中套轮，轮辋周围满有眼睛；活物头上的穹苍如可畏的水晶，其上有宝座仿佛蓝宝石，
 *      宝座以上只有精金与火的光辉，周围的光辉如下雨之日云中的虹（1:15–28 · 本卷的第一幅）。
 * 三 · 「人子啊，你站起来」——灵进入他里面；一卷内外都写着字的书卷自宝座降到他面前（2）。
 * 四 · 「要吃这书卷」——其甜如蜜；灵将他举起，异象带着轰轰的声音离去；在被掳的人中坐了七日；守望的人（3）。
 * 五 · 灵将他举到天地中间，在神的异象中看见耶路撒冷：穿细麻衣的人在叹息哀哭的人额上画记号；
 *      耶和华的荣耀离了殿的门槛，停在东门，又从城中上升，停在城东的山上（8—11）。
 * 六 · 香柏树梢的一根嫩枝，栽在极高的山上，长成佳美的香柏树，各类飞鸟宿在其下（17）。
 * 七 · 泰尔坐在海口，全然美丽，自比为神；海使波浪涌上，城倾倒，成为晒网的磐石（26—28）。
 * 八 · 「城已攻破」——逃来的人；密云黑暗的日子里四散的羊群，一道光亲自寻找，使它们躺卧；时雨如甘霖（33—34）。
 * 九 · 清水洒在众人身上；各人胸中的石心化为肉心；荒废之地成如伊甸园（36）。
 * 十 · 夜里，灵带他到遍满骸骨的平原——「这些骸骨能复活吗？」（37:1–3）
 * 十一 · 有响声，有地震，骨与骨互相联络；有筋，有肉，有皮，只是还没有气息（37:4–8）。
 * 十二 · 「气息啊，要从四方而来」——四风汇聚，气息进入，他们在黎明站起来，成为极大的军队（37:9–14 · 本卷的第二幅）。
 * 十三 · 至高的山从地上升起，颜色如铜的人以光的准绳量出圣殿；以色列神的荣光从东而来，地因他的荣耀发光，充满了殿（40—43）。
 * 十四 · 水从殿的门槛下往东流出，到踝、到膝、到腰，成了不能趟过的河；两岸满了树木，叶子乃为治病；
 *      河水流入海，海水变甜，渔夫在岸上晒网；城的名字必称为「耶和华的所在」（47—48 · 本卷的终幅）。
 *
 * 布景（自画）：迦巴鲁河与帐棚、远山的塔庙、异象（大云、四活物、轮、穹苍、宝座、虹）、书卷、
 * 耶路撒冷与殿（中丘）、荣耀的车驾、额上的记号、香柏树与飞鸟、泰尔与海浪与晒网的磐石、石心与肉心、
 * 骸骨（近地、中丘、远山）、远处极大的军队、四方的风、至高的山与圣殿、量度的光线、东来的荣光、
 * 殿中流出的河、两岸的树木、变甜的海、渔夫的网、「耶和华的所在」。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU } = U;
  const sm = U.smoothstep;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'ezekiel';
  const isCur = () => GS.book.current(ACT);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, clamp(a, 0, 1));
  const FONT = '"GS Brush", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "STSong", "Noto Serif CJK SC", "SimSun", serif';

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    ekCamp: ['exp', 0.5],      // 迦巴鲁河与被掳之人的帐棚
    ekZig: ['exp', 0.4],       // 远山上巴比伦的塔庙
    ekHide: ['exp', 0.45],     // 灵带他出去：先前的布景隐去（37:1）
    ekCloud: ['exp', 0.45],    // 包括闪烁火的大云（1:4）
    ekNear: ['lin', 0.11],     // 狂风从北方刮来：自远而近
    ekCreat: ['exp', 0.45],    // 四个活物（1:5）
    ekFire: ['exp', 0.6],      // 火在活物中间上去下来，发出闪电（1:13）
    ekWheel: ['exp', 0.45],    // 轮中套轮（1:15–18）
    ekFirm: ['exp', 0.5],      // 穹苍（1:22）
    ekThrone: ['exp', 0.4],    // 宝座，仿佛蓝宝石（1:26）
    ekBow: ['exp', 0.35],      // 周围的光辉如虹（1:28）
    ekGo: ['lin', 0.12],       // 异象带着轰轰的声音离去（3:12–14）
    ekScroll: ['exp', 0.5],    // 书卷降下、展开（2:9–10）
    ekEat: ['lin', 0.25],      // 吃这书卷（3:3）
    ekCity: ['exp', 0.4],      // 耶路撒冷（中丘，神的异象中）
    ekGlory: ['exp', 0.5],     // 以色列神的荣耀（8:4）
    ekGloryP: ['lin', 0.3],    // 荣耀离去的路：0 殿上 → 1 门槛 → 2 东门 → 3 城东的山（10:18–11:23）
    ekMark: ['lin', 0.12],     // 额上的记号（9:4）
    ekDim: ['exp', 0.35],      // 荣耀离去后，城暗了
    ekCedar: ['lin', 0.075],   // 香柏树（17:22–23）
    ekNest: ['lin', 0.12],     // 各类飞鸟宿在其下
    ekTyre: ['exp', 0.5],      // 泰尔（27:3）
    ekPride: ['exp', 0.5],     // 在海中坐神之位（28:2）
    ekWave: ['exp', 0.5],      // 如同海使波浪涌上来（26:3）
    ekFall: ['lin', 0.14],     // 泰尔倾倒
    ekNets: ['exp', 0.45],     // 晒网的磐石（26:14）
    ekRuin: ['exp', 0.35],     // 城已攻破（33:21）
    ekStone: ['exp', 0.6],     // 石心（36:26）
    ekHeart: ['lin', 0.14],    // 石心 → 肉心
    ekBones: ['exp', 0.35],    // 遍满骸骨（37:1）
    ekJoin: ['lin', 0.2],      // 骨与骨互相联络（37:7）
    ekSinew: ['lin', 0.3],     // 骸骨上有筋（37:8）
    ekFlesh: ['lin', 0.22],    // 长了肉，又有皮遮蔽其上（37:8）
    ekArmy: ['lin', 0.1],      // 远处：极大的军队站起来（37:10）
    ekMount: ['lin', 0.14],    // 至高的山（40:2）
    ekMeasure: ['lin', 0.13],  // 麻绳和量度的竿（40:3）
    ekTemple: ['exp', 0.35],   // 殿成形
    ekGloryE: ['lin', 0.1],    // 以色列神的荣光从东而来（43:2）
    ekFill: ['exp', 0.4],      // 耶和华的荣光充满了殿（43:5）
    ekFlow: ['lin', 0.08],     // 水往东流出：流到多远（47:1–8）
    ekWater: ['lin', 0.12],    // 水的深浅
    ekWade: ['exp', 0.9],      // 以西结趟水：水到他身上的高度
    ekTrees: ['lin', 0.09],    // 河两岸的树木（47:7，12）
    ekHeal: ['lin', 0.1],      // 海水变甜（47:8–9）
    ekNets2: ['exp', 0.5],     // 渔夫晒网（47:10）
    ekName: ['exp', 0.3],      // 「耶和华的所在」（48:35）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  // 经文显在左边的海上，故要紧的事都在 x ≥ 0.5 的地上发生
  const X = {
    ezek: 0.505, tentA: 0.428, tentB: 0.463, zig: 0.93, poplar: [0.925, 0.962],
    city0: 0.705, city1: 0.985, temple: 0.888, gateE: 0.79, mountE: 0.645,    // 中丘：耶路撒冷
    cedar: 0.645, tyre0: 0.478, tyre1: 0.574,                                // 中丘：香柏树、泰尔
  };
  const ROBE = {
    ezek: [92, 104, 142], linen: [242, 238, 228], fugitive: [128, 96, 74], shepherd: [150, 118, 78], bronze: [214, 150, 84],
  };
  const MUTED = [[112, 100, 90], [96, 88, 82], [124, 108, 92], [104, 96, 100], [118, 104, 86], [92, 86, 78]];
  const CROWD_A = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [96, 80, 72], [120, 100, 84], [104, 96, 110], [140, 96, 80], [158, 138, 108]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return {}; }
  let CLK = 0;   // 装饰用的时钟

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const tall = () => W.h > W.w * 1.05;
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gYp = (l, x) => {
    const L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const gY = (l, xf) => gYp(l, xf * W.w);
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const shade = (rgb, d, ex) => W.shade(rgb, d, ex);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  // 人的身高（与人物模块同一算法）
  const personH = (l, v) => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * ([1.1, 1.2, 1.3][l] || 1) * (1 + 0.35 * (v || 0));
  // 中丘上城与树的单位长度
  const CU = () => W.layerScale(1) * (W.w < 600 ? 1.3 : 1) * 1.45;

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const crowdObj = gid => { const c = C(); return c.crowds && c.crowds.get ? c.crowds.get(gid) || null : null; };
  const hasCrowd = gid => !!crowdObj(gid);
  const members = gid => { const g = crowdObj(gid); return g ? g.members.filter(m => !m.dying) : []; };
  const fig = id => { const c = C(); return c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function run(id, x, o) { const c = C(); if (!fig(id)) return; if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) c.fly(id, x, y, o); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) { const c = C(); if (!c.herd) return null; return U.safe('cast.herd', () => c.herd(gid, o)); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crowdFace(gid, d) { members(gid).forEach((m, i) => { const f = typeof d === 'function' ? d(m, i) : d; if (m.tx != null && !W.replaying) return; m.facing = f; if (W.replaying) m.fd = f; }); }
  function crowdGlow(gid, v) { for (const m of members(gid)) m.glow = v; }
  function crowdLabel(gid, s) { for (const m of members(gid)) m.label = s; }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  // 一群人（或羊）站在指定的位置：spots = [[x, v, facing], …]
  function placeCrowd(gid, o, spots, isHerd) {
    if (hasCrowd(gid)) return;
    const ms = (isHerd ? herd : crowd)(gid, Object.assign({ n: spots.length, mill: false }, o));
    if (!ms) return;
    ms.forEach((m, i) => {
      const s = spots[i] || spots[spots.length - 1];
      m.nx = s[0]; m.v = s[1] || 0;
      if (s[2]) { m.facing = s[2]; m.fd = s[2]; }
      if (!isHerd) { m.age = s[3] || 'adult'; m.scale = 1; }
      if (o.robes) m.robe = o.robes[i % o.robes.length];
    });
  }
  // 地上的走兽避开这几段
  function avoid(...r) { W.beastAvoid = r; }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o || {}));
  }
  function narrate(b, lines) { if (!b.instant && GS.ui && GS.ui.narrate) GS.ui.narrate(lines, { replace: false }); }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    return memberPt(f, frac);
  }
  function memberPt(m, frac) {
    if (m._vis && isFinite(m._x) && isFinite(m._y)) return [m._x, m._y - (m._h || 30) * (m.isAnimal ? 0.6 : 1) * frac];
    const l = m.layer == null ? 2 : m.layer;
    const x = m.nx * W.w, g = gY(l, m.nx);
    const y = m.ny != null ? m.ny * W.h : g + (m.v || 0) * fieldH(l, g) * 0.8;
    const h = m.isAnimal ? 20 * LS(l) : personH(l, m.v) * (AGE_H[m.age] || 1) * (m.scale || 1);
    return [x, y - h * frac];
  }
  // 站在地上某处离地 k·H 的空中（画面高度的比例，给 fly 用）
  const liftY = (xf, k) => clamp((gY(2, xf) - W.h * k) / W.h, 0.05, 0.95);
  // 名字的位置：在画面之内
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  function chime(str) { const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0])); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(rgb, a0));
    gr.addColorStop(mid || 0.35, rgba(rgb, a0 * 0.32));
    gr.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  // 大云：暗的云团，中间有精金的火光
  function makeCloud() {
    const S0 = 512, c = cnv(S0, S0), g = c.getContext('2d'), r = U.mulberry32(1402);
    for (let i = 0; i < 110; i++) {
      const a = r() * TAU, d = Math.pow(r(), 0.75) * 180;
      const x = S0 / 2 + Math.cos(a) * d * 1.12, y = S0 / 2 + Math.sin(a) * d * 0.95;
      const rad = 36 + r() * 74, v = 30 + r() * 46, al = 0.22 + r() * 0.22;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, U.rgba(v | 0, v | 0, (v + 10) | 0, al));
      gr.addColorStop(0.55, U.rgba(v | 0, v | 0, (v + 10) | 0, al * 0.55));
      gr.addColorStop(1, U.rgba(v | 0, v | 0, (v + 10) | 0, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
    }
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 36; i++) {
      const a = r() * TAU, d = Math.pow(r(), 1.3) * 150;
      const x = S0 / 2 + Math.cos(a) * d, y = S0 / 2 + Math.sin(a) * d * 0.85;
      const rad = 26 + r() * 60, al = 0.05 + r() * 0.1;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, U.rgba(255, 196, 110, al)); gr.addColorStop(1, U.rgba(255, 160, 80, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
    }
    return c;
  }
  // 活物：直的腿，四个翅膀（两个向上伸直、与别的活物相接；两个遮体），头上一团光（不画面目）
  const CRW = 256, CRH = 340, CRFX = 128, CRFY = 330;
  function makeCreature() {
    const c = cnv(CRW, CRH), g = c.getContext('2d');
    const cx = CRFX;
    // 一只翅膀：前缘一道弧，后缘是一片一片的羽尖
    const wing = (s, root, ctrl, tip, back, nF, colA, colB, a) => {
      const R = [cx + s * root[0], root[1]], Cc = [cx + s * ctrl[0], ctrl[1]], Tp = [cx + s * tip[0], tip[1]], Bk = [cx + s * back[0], back[1]];
      g.beginPath();
      g.moveTo(R[0], R[1]);
      g.quadraticCurveTo(Cc[0], Cc[1], Tp[0], Tp[1]);
      // 后缘：自翼尖回到翼根，沿一条弧，每片羽毛一个圆弧的尖
      let px = Tp[0], py = Tp[1];
      for (let i = 1; i <= nF; i++) {
        const t = i / nF, it = 1 - t;
        const qx = it * it * Tp[0] + 2 * it * t * Bk[0] + t * t * R[0], qy = it * it * Tp[1] + 2 * it * t * Bk[1] + t * t * R[1];
        const mx = (px + qx) / 2, my = (py + qy) / 2, dx = qx - px, dy = qy - py;
        const bul = -0.36 * s;
        g.quadraticCurveTo(mx - dy * bul, my + dx * bul, qx, qy);
        px = qx; py = qy;
      }
      g.closePath();
      const gr = g.createLinearGradient(R[0], R[1], Tp[0], Tp[1]);
      gr.addColorStop(0, rgba(colA, a)); gr.addColorStop(0.55, rgba(mix(colA, colB, 0.5), a * 0.85)); gr.addColorStop(1, rgba(colB, a * 0.45));
      g.fillStyle = gr; g.fill();
      g.strokeStyle = U.rgba(255, 244, 222, a * 0.7); g.lineWidth = 1.2; g.stroke();
      // 羽轴
      g.strokeStyle = U.rgba(255, 250, 236, a * 0.45); g.lineWidth = 0.9;
      g.beginPath();
      for (let i = 1; i < nF; i++) {
        const t = i / nF, it = 1 - t;
        const qx = it * it * Tp[0] + 2 * it * t * Bk[0] + t * t * R[0], qy = it * it * Tp[1] + 2 * it * t * Bk[1] + t * t * R[1];
        const lx = it * it * Tp[0] + 2 * it * t * Cc[0] + t * t * R[0], ly = it * it * Tp[1] + 2 * it * t * Cc[1] + t * t * R[1];
        g.moveTo(lerp(lx, qx, 0.15), lerp(ly, qy, 0.15)); g.lineTo(lerp(lx, qx, 0.92), lerp(ly, qy, 0.92));
      }
      g.stroke();
    };
    const WA = [255, 246, 226], WB = [246, 206, 140];
    for (const s of [-1, 1]) {
      // 遮体的两个翅膀（在后）
      wing(s, [6, 186], [44, 214], [30, 318], [4, 262], 5, [252, 236, 206], [236, 190, 120], 0.85);
      // 向上伸直的翅膀
      wing(s, [8, 178], [40, 40], [114, 20], [70, 150], 7, WA, WB, 0.88);
    }
    // 身：直的腿，脚掌如牛犊之蹄，灿烂如光明的铜（1:7）
    g.beginPath();
    g.moveTo(cx - 13, 186); g.quadraticCurveTo(cx - 16, 222, cx - 11, 258); g.lineTo(cx - 9, 320); g.lineTo(cx - 3, 320); g.lineTo(cx - 1, 268);
    g.lineTo(cx + 1, 268); g.lineTo(cx + 3, 320); g.lineTo(cx + 9, 320); g.lineTo(cx + 11, 258); g.quadraticCurveTo(cx + 16, 222, cx + 13, 186);
    g.quadraticCurveTo(cx, 178, cx - 13, 186); g.closePath();
    const bg = g.createLinearGradient(0, 180, 0, 322);
    bg.addColorStop(0, 'rgba(255,246,224,0.95)'); bg.addColorStop(0.5, 'rgba(246,208,146,0.92)'); bg.addColorStop(1, 'rgba(214,146,74,0.95)');
    g.fillStyle = bg; g.fill();
    for (const s of [-1, 1]) {
      g.fillStyle = 'rgba(236,180,100,1)';
      g.beginPath(); g.ellipse(cx + s * 6, 324, 6.5, 4, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,236,190,0.9)';
      g.beginPath(); g.ellipse(cx + s * 6 - 1.5, 322.5, 3, 1.6, 0, 0, TAU); g.fill();
    }
    // 胸中如火炭
    g.globalCompositeOperation = 'lighter';
    const eg = g.createRadialGradient(cx, 214, 0, cx, 214, 20);
    eg.addColorStop(0, 'rgba(255,190,110,0.8)'); eg.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = eg; g.fillRect(cx - 22, 192, 44, 44);
    // 头：一团光（四个脸面只以四点微光示意，不画面目）
    const hy = 164;
    const h1 = g.createRadialGradient(cx, hy, 0, cx, hy, 26);
    h1.addColorStop(0, 'rgba(255,255,250,1)'); h1.addColorStop(0.4, 'rgba(255,236,196,0.7)'); h1.addColorStop(1, 'rgba(255,210,140,0)');
    g.fillStyle = h1; g.fillRect(cx - 28, hy - 28, 56, 56);
    // 头上的光环
    g.strokeStyle = 'rgba(255,240,206,0.55)'; g.lineWidth = 1.2;
    g.beginPath(); g.ellipse(cx, hy, 17, 15, 0, 0, TAU); g.stroke();
    return c;
  }
  // 虹：一圈光环（下雨的日子云中虹的形状）
  function makeBow() {
    const S0 = 256, c = cnv(S0, S0), g = c.getContext('2d'), C0 = S0 / 2, R = 100;
    const cols = [[255, 72, 72], [255, 150, 60], [255, 226, 90], [104, 226, 120], [84, 170, 255], [150, 104, 255]];
    g.globalCompositeOperation = 'lighter';
    try { g.filter = 'blur(3px)'; } catch (e) { /* 无滤镜也可 */ }
    cols.forEach((col, i) => {
      g.strokeStyle = rgba(col, 0.62); g.lineWidth = 6;
      g.beginPath(); g.arc(C0, C0, R + 12 - i * 5, 0, TAU); g.stroke();
    });
    try { g.filter = 'none'; } catch (e) { /* */ }
    cols.forEach((col, i) => {
      g.strokeStyle = rgba(col, 0.4); g.lineWidth = 2.2;
      g.beginPath(); g.arc(C0, C0, R + 12 - i * 5, 0, TAU); g.stroke();
    });
    return c;
  }
  // 自天而降的光柱
  function makeBeam() {
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return b;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      gold: radial([255, 228, 166], 1), white: radial([246, 248, 255], 1), warm: radial([255, 176, 96], 1), amber: radial([255, 198, 104], 1),
      blue: radial([96, 140, 255], 1), beryl: radial([168, 238, 214], 1), ember: radial([255, 110, 48], 1), smoke: radial([118, 112, 106], 0.8, 0.55),
      teal: radial([96, 224, 214], 1), pale: radial([226, 232, 255], 1), rose: radial([255, 132, 110], 1), leaf: radial([170, 255, 170], 1),
      dark: radial([16, 14, 20], 1, 0.5), mist: radial([236, 240, 250], 0.7, 0.5),
    };
    SP.cloud = makeCloud();
    SP.creature = makeCreature();
    SP.bow = makeBow();
    SP.beam = makeBeam();
    return SP;
  }

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(2648); for (let i = 0; i < 1024; i++) RT.push(r()); })();
  const rt = i => RT[((i % 1024) + 1024) % 1024];

  // ════════════════════════════════════════════════════════════
  //  迦巴鲁河边：帐棚、河、白杨、远山的塔庙
  // ════════════════════════════════════════════════════════════
  const campA = () => lv('ekCamp') * (1 - lv('ekHide'));
  // 迦巴鲁河：近地前景里一道自右向左、流入海的河
  function chebarY(xf) { const g = gY(2, xf); return g + (W.h - g) * (0.56 + 0.05 * Math.sin(xf * 17)); }
  function drawChebar(ctx) {
    const a = campA();
    if (a < 0.01) return;
    const u = SU(), N = 40, x0 = 0.4, x1 = 1.02;
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const xf = lerp(x0, x1, i / N), y = chebarY(xf), w = (7 + 5 * (i / N)) * u;
      top.push([xf * W.w, y - w * 0.5]); bot.push([xf * W.w, y + w * 0.5]);
    }
    ctx.save();
    ctx.globalAlpha = a;
    ctx.beginPath();
    top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath();
    ctx.fillStyle = css([74, 112, 138], 2, 1, 0.1);
    ctx.fill();
    // 岸边的暗线与水面的天光
    ctx.strokeStyle = css([52, 44, 34], 2, 0.5); ctx.lineWidth = 1.2 * u;
    ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.strokeStyle = css([210, 226, 236], 2, 0.35 + 0.25 * nightK() * lv('moon'), 0.3); ctx.lineWidth = 1 * u;
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const xf = lerp(x0 + 0.02, x1, rt(i * 7)), y = chebarY(xf) + (rt(i * 7 + 1) - 0.5) * 5 * u, L = (8 + 14 * rt(i * 7 + 2)) * u;
      const sh = Math.sin(CLK * 0.8 + i) * 3 * u;
      ctx.moveTo(xf * W.w + sh, y); ctx.lineTo(xf * W.w + sh + L, y);
    }
    ctx.stroke();
    // 芦苇
    ctx.strokeStyle = css([96, 104, 64], 2, 0.8); ctx.lineWidth = 1 * u;
    ctx.beginPath();
    for (let i = 0; i < 34; i++) {
      const xf = lerp(0.52, 1.0, rt(i * 5 + 300)); if (xf > 0.6 && xf < 0.68) continue;
      const y = chebarY(xf) - (6 + 5 * rt(i * 5 + 301)) * u * 0.5, h = (8 + 10 * rt(i * 5 + 302)) * u, sw = Math.sin(CLK * 1.2 + i) * 1.5 * u + W.wind * 2 * u;
      ctx.moveTo(xf * W.w, y); ctx.quadraticCurveTo(xf * W.w + sw * 0.5, y - h * 0.6, xf * W.w + sw, y - h);
    }
    ctx.stroke();
    ctx.restore();
  }
  function drawTent(ctx, xf, size, a) {
    const u = LS(2) * size, x = xf * W.w, g = gY(2, xf) + 2 * u;
    const w = 30 * u, h = 17 * u;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = css([112, 88, 66], 2, 1);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.62, g);
    ctx.lineTo(x - w * 0.46, g - h * 0.72); ctx.quadraticCurveTo(x - w * 0.2, g - h * 1.06, x, g - h); ctx.quadraticCurveTo(x + w * 0.2, g - h * 1.06, x + w * 0.46, g - h * 0.72);
    ctx.lineTo(x + w * 0.62, g); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 124, 92], 2, 0.55, 0.12);
    ctx.beginPath(); ctx.moveTo(x - w * 0.46, g - h * 0.72); ctx.quadraticCurveTo(x - w * 0.2, g - h * 1.06, x, g - h); ctx.lineTo(x, g - h * 0.9); ctx.quadraticCurveTo(x - w * 0.2, g - h * 0.95, x - w * 0.44, g - h * 0.64); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([34, 26, 20], 2, 0.9);
    ctx.beginPath(); ctx.moveTo(x - w * 0.1, g); ctx.lineTo(x - w * 0.06, g - h * 0.55); ctx.lineTo(x + w * 0.1, g - h * 0.55); ctx.lineTo(x + w * 0.14, g); ctx.fill();
    // 夜里帐棚里的一点灯
    const nk = nightK();
    if (nk > 0.05) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * nk * 0.7;
      const r = 26 * u;
      ctx.drawImage(SP.warm, x + w * 0.02 - r, g - h * 0.3 - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  function drawPoplar(ctx, xf, a, seed) {
    const u = LS(2), x = xf * W.w, g = gY(2, xf) + 2 * u, h = (74 + 16 * rt(seed)) * u;
    ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = css([62, 48, 36], 2, 1); ctx.lineWidth = 2.4 * u;
    ctx.beginPath(); ctx.moveTo(x, g); ctx.lineTo(x, g - h * 0.55); ctx.stroke();
    const sw = Math.sin(CLK * 0.7 + seed) * 2 * u + W.wind * 3 * u;
    ctx.fillStyle = css([70, 96, 64], 2, 1);
    ctx.beginPath();
    ctx.moveTo(x, g - h * 0.2);
    ctx.quadraticCurveTo(x - 12 * u, g - h * 0.55, x + sw, g - h);
    ctx.quadraticCurveTo(x + 12 * u, g - h * 0.55, x, g - h * 0.2);
    ctx.fill();
    ctx.fillStyle = css([122, 150, 96], 2, 0.45, 0.2);
    ctx.beginPath(); ctx.moveTo(x + 1 * u, g - h * 0.3); ctx.quadraticCurveTo(x + 9 * u, g - h * 0.6, x + sw, g - h * 0.98); ctx.quadraticCurveTo(x + 4 * u, g - h * 0.6, x + 1 * u, g - h * 0.3); ctx.fill();
    ctx.restore();
  }
  // 远山上的塔庙（巴比伦）
  function drawZig(ctx) {
    const a = lv('ekZig') * (1 - lv('ekHide'));
    if (a < 0.01) return;
    const u = LS(0) * 1.3, x = X.zig * W.w, g = gY(0, X.zig) + 2 * u;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = css([150, 120, 92], 0, 1);
    const tiers = [[60, 14], [44, 12], [30, 11], [16, 10]];
    let y = g;
    for (const [w, h] of tiers) { ctx.fillRect(x - w * u / 2, y - h * u, w * u, h * u); y -= h * u; }
    ctx.fillStyle = css([190, 160, 120], 0, 0.6, 0.15);
    y = g; for (const [w, h] of tiers) { ctx.fillRect(x - w * u / 2, y - h * u, w * u, 1.2 * u); y -= h * u; }
    // 台阶
    ctx.fillStyle = css([120, 96, 74], 0, 0.9);
    ctx.beginPath(); ctx.moveTo(x - 3 * u, g); ctx.lineTo(x - 2 * u, g - 36 * u); ctx.lineTo(x + 2 * u, g - 36 * u); ctx.lineTo(x + 3 * u, g); ctx.fill();
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  异象：狂风、大云、四活物、轮中套轮、穹苍、宝座、虹（1:4–28）
  // ════════════════════════════════════════════════════════════
  function VG() {
    const port = tall();
    const xk = port ? 0.8 : 1;
    const cxF = port ? 0.62 : 0.75;
    const gy = port ? W.h * 0.8 : gY(2, cxF) - 3 * SU();
    const top = W.h * (port ? 0.37 : 0.085);
    const s0 = Math.max(0.2, Math.min((gy - top) / 600, (port ? 0.96 : 0.5) * W.w / (560 * xk)));
    const n = U.easeInOut(clamp(lv('ekNear'), 0, 1)), g = clamp(lv('ekGo'), 0, 1);
    let x = lerp(W.w * (port ? 0.8 : 0.9), W.w * cxF, n);
    let y = lerp(W.horizonY - W.h * 0.03, gy, n);
    let s = s0 * lerp(0.09, 1, n);
    let a = sm(0, 0.2, lv('ekCloud'));
    if (g > 0) {
      const d = U.easeIn(g);
      x = lerp(x, W.w * (port ? 0.78 : 0.86), d); y = lerp(y, W.h * (port ? 0.34 : 0.14), d); s *= lerp(1, 0.18, d);
      a *= 1 - sm(0.55, 1, g);
    }
    return { x, y, s, s0, xk, port, a, n };
  }
  const vp = (V, lx, ly) => [V.x + lx * V.s * V.xk, V.y + ly * V.s];
  // 轮：外辋、辐、轮中套轮、满有眼睛
  function drawWheel(ctx, V, lx, ly, R0, a, ph) {
    const [x, y] = vp(V, lx, ly), R = R0 * V.s, rx = R * V.xk, rot = CLK * 0.32 + ph;
    const u = V.s;
    ctx.strokeStyle = 'rgb(176,238,212)';
    ctx.globalAlpha = a * 0.22; ctx.lineWidth = Math.max(2, R * 0.2);
    ctx.beginPath(); ctx.ellipse(x, y, rx, R, 0, 0, TAU); ctx.stroke();
    ctx.globalAlpha = a * 0.95; ctx.lineWidth = Math.max(1, R * 0.045);
    ctx.beginPath(); ctx.ellipse(x, y, rx, R, 0, 0, TAU); ctx.stroke();
    ctx.globalAlpha = a * 0.5; ctx.lineWidth = Math.max(0.8, R * 0.025);
    ctx.beginPath(); ctx.ellipse(x, y, rx * 0.84, R * 0.84, 0, 0, TAU); ctx.stroke();
    // 辐
    ctx.globalAlpha = a * 0.4;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const an = rot + i * TAU / 8, c = Math.cos(an), s = Math.sin(an);
      ctx.moveTo(x + c * rx * 0.14, y + s * R * 0.14); ctx.lineTo(x + c * rx * 0.84, y + s * R * 0.84);
    }
    ctx.stroke();
    // 轮中套轮：与它垂直的一轮，转动时忽宽忽窄
    const iw = Math.abs(Math.cos(rot * 0.7 + ph)) * 0.9 + 0.08;
    ctx.globalAlpha = a * 0.75; ctx.lineWidth = Math.max(0.9, R * 0.035);
    ctx.beginPath(); ctx.ellipse(x, y, rx * iw, R * 0.94, 0, 0, TAU); ctx.stroke();
    // 毂
    ctx.globalAlpha = a * 0.9;
    const hr = R * 0.5;
    ctx.drawImage(SP.beryl, x - hr, y - hr, 2 * hr, 2 * hr);
    // 眼睛：轮辋周围满有眼睛（随轮转动，时而闪动）
    const NE = 18;
    for (let i = 0; i < NE; i++) {
      const an = rot + i * TAU / NE, c = Math.cos(an), s = Math.sin(an);
      const px = x + c * rx * 0.92, py = y + s * R * 0.92;
      const bl = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(CLK * 1.3 + i * 2.17 + ph * 3), 2);
      const er = Math.max(1.2, 3.4 * u);
      ctx.globalAlpha = a * bl * 0.8;
      ctx.fillStyle = 'rgb(255,250,226)';
      ctx.beginPath(); ctx.ellipse(px, py, er, er * 0.5, an + Math.PI / 2, 0, TAU); ctx.fill();
      ctx.globalAlpha = a * bl;
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath(); ctx.arc(px, py, Math.max(0.7, er * 0.32), 0, TAU); ctx.fill();
    }
    // 内轮上的眼睛
    for (let i = 0; i < 8; i++) {
      const an = rot * 1.3 + i * TAU / 8 + ph, px = x + Math.cos(an) * rx * iw * 0.9, py = y + Math.sin(an) * R * 0.86;
      const bl = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(CLK * 1.1 + i * 1.7 + ph), 2);
      ctx.globalAlpha = a * bl * 0.8;
      ctx.fillStyle = 'rgb(255,252,236)';
      ctx.beginPath(); ctx.arc(px, py, Math.max(0.8, 2 * u), 0, TAU); ctx.fill();
    }
  }
  // 火焰（一簇）
  function flamePath(ctx, x, y, h, w, seed) {
    const sw = Math.sin(CLK * 5.3 + seed) * w * 0.35, sw2 = Math.sin(CLK * 7.1 + seed * 1.7) * w * 0.2;
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.9 + sw2, y - h * 0.5, x + sw, y - h);
    ctx.quadraticCurveTo(x + w * 0.9 + sw2, y - h * 0.5, x + w, y);
    ctx.closePath();
  }
  // 闪电：在活物中间（确定的时刻，纯装饰）
  function drawZaps(ctx, V, a) {
    const period = 1.6, k = Math.floor(CLK / period), ph = CLK - k * period;
    if (ph > 0.18) return;
    const seed = k * 7;
    const env = 1 - ph / 0.18;
    let [x, y] = vp(V, (rt(seed) - 0.5) * 100, -60 - rt(seed + 1) * 130);
    const dir = rt(seed + 2) < 0.5 ? -1 : 1;
    ctx.strokeStyle = 'rgb(236,244,255)';
    ctx.lineWidth = Math.max(1, 1.8 * V.s);
    ctx.globalAlpha = a * env;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 0; i < 6; i++) { x += dir * (14 + 20 * rt(seed + 3 + i)) * V.s * V.xk; y += (rt(seed + 9 + i) - 0.3) * 30 * V.s; ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.globalAlpha = a * env * 0.35;
    ctx.lineWidth = Math.max(3, 7 * V.s); ctx.stroke();
  }
  // 活物的位置：[lx, ly(脚), 比例, 前/后]
  const CREAT = [[-56, -26, 0.84, 0], [56, -26, 0.84, 0], [-92, -4, 1, 1], [92, -4, 1, 1]];
  const WHEELS = [[-150, -84, 54, 0], [150, -84, 54, 0], [-212, -68, 66, 1], [212, -68, 66, 1]];
  function drawVision(ctx) {
    const A0 = lv('ekCloud');
    if (A0 < 0.004) return;
    SP || sprites();
    const V = VG();
    if (V.a < 0.004) return;
    const a = V.a, s = V.s;
    ctx.save();
    // 大云（暗）：旋转的两层
    const cl = A0 * a;
    const [cx, cy] = vp(V, 0, -250);
    const cw = 880 * s * V.xk, ch = 740 * s;
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((i ? -1 : 1) * CLK * (0.05 + 0.12 * (1 - V.n)) + i * 1.3);
      ctx.scale(1, ch / cw);
      ctx.globalAlpha = cl * (i ? 0.55 : 0.75);
      ctx.drawImage(SP.cloud, -cw / 2, -cw / 2, cw, cw);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'lighter';
    // 周围有光辉
    let r = 520 * s;
    ctx.globalAlpha = cl * 0.16; ctx.drawImage(SP.gold, cx - r * V.xk, cy - r, 2 * r * V.xk, 2 * r);
    // 狂风：旋转的风线
    ctx.strokeStyle = 'rgb(236,226,210)';
    ctx.lineWidth = Math.max(1, 1.6 * s);
    for (let i = 0; i < 9; i++) {
      const R = (150 + 160 * rt(i * 3)) * s, a0 = CLK * (0.9 + 0.6 * rt(i * 3 + 1)) + i * 0.7;
      ctx.globalAlpha = cl * (0.08 + 0.25 * (1 - V.n)) * (0.5 + 0.5 * Math.sin(CLK * 0.7 + i));
      ctx.beginPath(); ctx.ellipse(cx, cy, R * V.xk, R * 0.62, 0, a0, a0 + 0.9 + 0.8 * rt(i * 3 + 2)); ctx.stroke();
    }
    // 火内发出好像光耀的精金（活物显出之后，退为活物之间的火）
    const ca = lv('ekCreat') * a, wa = lv('ekWheel') * a, fa = lv('ekFire') * a;
    const core = 1 - 0.6 * lv('ekCreat');
    r = 190 * s * (1 + 0.06 * Math.sin(CLK * 3.1));
    ctx.globalAlpha = cl * 0.55 * core; ctx.drawImage(SP.amber, cx - r, cy + 40 * s - r, 2 * r, 2 * r);
    r = 70 * s;
    ctx.globalAlpha = cl * 0.7 * core; ctx.drawImage(SP.white, cx - r, cy + 40 * s - r, 2 * r, 2 * r);
    // 后面的轮与活物
    if (wa > 0.01) for (const w of WHEELS) if (!w[3]) drawWheel(ctx, V, w[0], w[1], w[2], wa * 0.65, w[0] * 0.01);
    const drawC = c => {
      const [px, py] = vp(V, c[0], c[1]), k = s * c[2];
      const flick = 0.93 + 0.07 * Math.sin(CLK * 4.3 + c[0]);
      ctx.globalCompositeOperation = 'lighter';
      const gr = 150 * k;
      ctx.globalAlpha = ca * 0.22 * flick; ctx.drawImage(SP.gold, px - gr * V.xk, py - 190 * k - gr, 2 * gr * V.xk, 2 * gr);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = ca * (c[3] ? 0.96 : 0.8) * flick;
      ctx.drawImage(SP.creature, px - CRFX * k * V.xk, py - CRFY * k, CRW * k * V.xk, CRH * k);
      ctx.globalCompositeOperation = 'lighter';
    };
    if (ca > 0.01) for (const c of CREAT) if (!c[3]) drawC(c);
    // 火在四活物中间上去下来：烧着的火炭
    if (fa > 0.01 || ca > 0.3) {
      const k = Math.max(fa, ca * 0.4);
      r = 120 * s;
      ctx.globalAlpha = k * 0.35 * (0.85 + 0.15 * Math.sin(CLK * 6.1)); ctx.drawImage(SP.ember, cx - r, cy + 110 * s - r * 1.2, 2 * r, 2.4 * r);
      for (let i = 0; i < 11; i++) {
        const ph = U.fract(CLK * (0.16 + 0.08 * rt(i * 5)) + rt(i * 5 + 1));
        const up = i % 2 ? ph : 1 - ph;
        const [px, py] = vp(V, (rt(i * 5 + 2) - 0.5) * 110 + Math.sin(CLK * 1.3 + i) * 10, lerp(-30, -200, up));
        const rr = (14 + 10 * rt(i * 5 + 3)) * s;
        ctx.globalAlpha = k * 0.7 * Math.sin(Math.PI * ph);
        ctx.drawImage(SP.ember, px - rr, py - rr, 2 * rr, 2 * rr);
        ctx.globalAlpha = k * Math.sin(Math.PI * ph);
        ctx.fillStyle = 'rgb(255,226,170)';
        ctx.beginPath(); ctx.arc(px, py, Math.max(1, 2.4 * s), 0, TAU); ctx.fill();
      }
      if (fa > 0.2) drawZaps(ctx, V, fa);
    }
    if (ca > 0.01) for (const c of CREAT) if (c[3]) drawC(c);
    if (wa > 0.01) for (const w of WHEELS) if (w[3]) drawWheel(ctx, V, w[0], w[1], w[2], wa, w[0] * 0.013 + 1);
    // 穹苍：可畏的水晶
    const fm = lv('ekFirm') * a;
    if (fm > 0.01) {
      const [fx0, fy0] = vp(V, 0, -322);
      const rx = 236 * s * V.xk, ry = 24 * s;
      const gr = ctx.createRadialGradient(fx0, fy0, 0, fx0, fy0, rx);
      gr.addColorStop(0, 'rgba(206,232,255,0.22)'); gr.addColorStop(0.75, 'rgba(180,214,255,0.1)'); gr.addColorStop(1, 'rgba(170,210,255,0.02)');
      ctx.globalAlpha = fm;
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.ellipse(fx0, fy0, rx, ry, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgb(220,240,255)'; ctx.lineWidth = Math.max(0.8, 1 * s);
      ctx.globalAlpha = fm * 0.45;
      ctx.beginPath(); ctx.ellipse(fx0, fy0, rx, ry, 0, 0, TAU); ctx.stroke();
      ctx.globalAlpha = fm * 0.22;
      ctx.beginPath(); ctx.ellipse(fx0, fy0 - 2 * s, rx * 0.96, ry * 0.8, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      // 水晶的棱光
      ctx.globalAlpha = fm * 0.18;
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const t0 = rt(i * 3 + 40) * TAU, t1 = t0 + 1.2 + rt(i * 3 + 41);
        ctx.moveTo(fx0 + Math.cos(t0) * rx, fy0 + Math.sin(t0) * ry); ctx.lineTo(fx0 + Math.cos(t1) * rx * 0.6, fy0 + Math.sin(t1) * ry * 0.6);
      }
      ctx.stroke();
      const gl = U.fract(CLK * 0.12);
      ctx.globalAlpha = fm * 0.6 * Math.sin(Math.PI * gl);
      const gx = fx0 + lerp(-rx * 0.8, rx * 0.8, gl);
      r = 26 * s; ctx.drawImage(SP.white, gx - r, fy0 - r * 0.4, 2 * r, r * 0.8);
    }
    // 宝座：仿佛蓝宝石
    const th = lv('ekThrone') * a;
    if (th > 0.01) {
      const [tx, ty] = vp(V, 0, -334);
      const q = s;
      r = 170 * q;
      ctx.globalAlpha = th * 0.45; ctx.drawImage(SP.blue, tx - r, ty - 50 * q - r, 2 * r, 2 * r);
      // 宝座以上：先是火，其上是精金的光辉（不画形像）
      const fl = th * (0.9 + 0.1 * Math.sin(CLK * 2.3));
      r = 150 * q;
      ctx.globalAlpha = fl * 0.55; ctx.drawImage(SP.amber, tx - r * 0.62, ty - 205 * q - r, 1.24 * r, 2 * r);
      r = 52 * q;
      ctx.globalAlpha = fl * 0.85; ctx.drawImage(SP.white, tx - r * 0.7, ty - 200 * q - r * 1.3, 1.4 * r, 2.6 * r);
      ctx.fillStyle = 'rgb(255,140,60)';
      ctx.globalAlpha = fl * 0.42;
      ctx.beginPath();
      for (let i = 0; i < 7; i++) flamePath(ctx, tx + (i - 3) * 8 * q, ty - 96 * q, (48 + 26 * rt(i + 60)) * q, 7 * q, i * 1.7);
      ctx.fill();
      ctx.fillStyle = 'rgb(255,210,130)'; ctx.globalAlpha = fl * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) flamePath(ctx, tx + (i - 2) * 7 * q, ty - 98 * q, (32 + 16 * rt(i + 70)) * q, 5 * q, i * 2.3 + 1);
      ctx.fill();
      // 光芒
      ctx.strokeStyle = 'rgb(255,238,200)'; ctx.lineWidth = Math.max(1, 1.1 * q);
      ctx.beginPath();
      for (let i = 0; i < 18; i++) {
        const an = (i / 18) * TAU + CLK * 0.03, L0 = 70 * q, L1 = (170 + 90 * rt(i * 7 + 90)) * q;
        ctx.moveTo(tx + Math.cos(an) * L0, ty - 190 * q + Math.sin(an) * L0); ctx.lineTo(tx + Math.cos(an) * L1, ty - 190 * q + Math.sin(an) * L1);
      }
      ctx.globalAlpha = fl * 0.08; ctx.stroke();
      // 宝座本身（蓝宝石）：不相加，才看得出颜色
      ctx.globalCompositeOperation = 'source-over';
      const g2 = ctx.createLinearGradient(tx - 40 * q, ty - 100 * q, tx + 40 * q, ty);
      g2.addColorStop(0, 'rgba(120,170,255,0.97)'); g2.addColorStop(0.5, 'rgba(52,96,214,0.97)'); g2.addColorStop(1, 'rgba(30,58,160,0.97)');
      ctx.fillStyle = g2; ctx.globalAlpha = th;
      ctx.beginPath();
      ctx.moveTo(tx - 44 * q, ty); ctx.lineTo(tx - 40 * q, ty - 30 * q); ctx.lineTo(tx - 30 * q, ty - 32 * q); ctx.lineTo(tx - 30 * q, ty - 84 * q);
      ctx.quadraticCurveTo(tx, ty - 102 * q, tx + 30 * q, ty - 84 * q); ctx.lineTo(tx + 30 * q, ty - 32 * q); ctx.lineTo(tx + 40 * q, ty - 30 * q); ctx.lineTo(tx + 44 * q, ty);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgb(200,224,255)'; ctx.lineWidth = Math.max(1, 1.3 * q); ctx.globalAlpha = th * 0.9; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx - 22 * q, ty - 36 * q); ctx.lineTo(tx - 22 * q, ty - 80 * q); ctx.quadraticCurveTo(tx, ty - 92 * q, tx + 22 * q, ty - 80 * q); ctx.lineTo(tx + 22 * q, ty - 36 * q);
      ctx.globalAlpha = th * 0.4; ctx.stroke();
      for (let i = 0; i < 3; i++) { const yy = ty - (4 + i * 5) * q, hw = (46 - i * 4) * q; ctx.beginPath(); ctx.moveTo(tx - hw, yy); ctx.lineTo(tx + hw, yy); ctx.globalAlpha = th * 0.45; ctx.stroke(); }
      // 宝石的闪光
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) {
        const tw = Math.max(0, Math.sin(CLK * 1.7 + i * 1.9));
        ctx.globalAlpha = th * tw * 0.8; r = 10 * q;
        ctx.drawImage(SP.white, tx + (rt(i + 120) - 0.5) * 60 * q - r, ty - (20 + 70 * rt(i + 125)) * q - r, 2 * r, 2 * r);
      }
    }
    // 周围光辉如虹
    ctx.globalCompositeOperation = 'lighter';
    const bw = lv('ekBow') * a;
    if (bw > 0.01) {
      const [bx, by] = vp(V, 0, -436);
      const R = 158 * s / 100 * 128;
      ctx.globalAlpha = bw * (0.72 + 0.18 * Math.sin(CLK * 0.9));
      ctx.drawImage(SP.bow, bx - R, by - R, 2 * R, 2 * R);
      r = 240 * s;
      ctx.globalAlpha = bw * 0.12; ctx.drawImage(SP.gold, bx - r, by - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 异象里，以西结身上有光
  function drawSeerLight(ctx) {
    const k = Math.max(lv('ekCloud') * (1 - lv('ekGo')) * 0.8, lv('ekGlory') * (1 - sm(2.6, 3, lv('ekGloryP'))) * 0.7, lv('ekFill') * 0.5);
    if (k < 0.02) return;
    const p = figPt('ezekiel', 0.5);
    if (!p) return;
    SP || sprites();
    const r = 60 * SU();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.35 * k;
    ctx.drawImage(SP.gold, p[0] - r, p[1] - r, 2 * r, 2 * r);
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  书卷（2:9–3:3）
  // ════════════════════════════════════════════════════════════
  function scrollPos() {
    const V = VG(), k = sm(0, 0.65, lv('ekScroll'));
    const src = vp(V, 0, -380);
    const ez = figPt('ezekiel', 0.95) || [X.ezek * W.w, W.h * 0.8];
    const u = SU();
    const dst = [ez[0] + 34 * u, ez[1] - 20 * u];
    const e = U.easeInOut(k);
    let x = lerp(src[0], dst[0], e), y = lerp(src[1], dst[1], e) - Math.sin(Math.PI * e) * 40 * u;
    // 吃：移到口边，卷起，隐入
    const t = lv('ekEat');
    if (t > 0) { const m = [ez[0] + 6 * u, ez[1] + 4 * u]; const q = U.easeInOut(clamp(t / 0.7, 0, 1)); x = lerp(x, m[0], q); y = lerp(y, m[1], q); }
    return [x, y];
  }
  function drawScroll(ctx) {
    const k = lv('ekScroll');
    if (k < 0.01) return;
    SP || sprites();
    const t = lv('ekEat');
    const [x, y] = scrollPos();
    const u = SU() * (W.w < 600 ? 0.8 : 1);
    const open = sm(0.55, 1, k) * (1 - sm(0, 0.6, t));
    const size = 1 - sm(0.5, 1, t);
    if (size < 0.01) return;
    const w = (6 + 58 * open) * u * size, h = 30 * u * size;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    let r = (40 + 40 * open) * u * size;
    ctx.globalAlpha = 0.55 * k; ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = Math.min(1, k * 1.2);
    ctx.fillStyle = 'rgb(238,224,188)';
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    // 内外都写着字：细细的几行墨
    if (open > 0.2) {
      ctx.fillStyle = 'rgba(70,50,34,0.75)';
      const cols = Math.floor(open * 9);
      for (let i = 0; i < cols; i++) for (let j = 0; j < 5; j++) {
        if (rt(i * 11 + j) < 0.18) continue;
        const px = x - w / 2 + (i + 0.6) * (w / 9.4), py = y - h / 2 + (j + 0.7) * h / 5.6;
        ctx.fillRect(px, py, Math.max(1, 3.4 * u * size), Math.max(0.8, 1.1 * u * size));
      }
    }
    // 两端的轴
    ctx.fillStyle = 'rgb(150,112,72)';
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(x + sx * w / 2, y, 3.2 * u * size, h * 0.58, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷（中丘）：城墙、房屋、殿；荣耀；额上的记号；城已攻破
  // ════════════════════════════════════════════════════════════
  const CITY = (function () {
    const r = U.mulberry32(911), houses = [];
    for (let i = 0; i < 20; i++) {
      const x = 0.714 + 0.262 * (i + 0.15 + r() * 0.7) / 20;
      if (Math.abs(x - X.temple) < 0.032) continue;
      houses.push({ x, w: 9 + r() * 8, h: 17 + r() * 13, dome: r() < 0.14, win: r(), dz: r() });
    }
    return { houses, towers: [0.707, X.gateE, 0.848, 0.93, 0.983] };
  })();
  const cityA = () => lv('ekCity') * (1 - lv('ekHide'));
  function templeGeomM() {
    const cu = CU(), x = X.temple * W.w, g = gY(1, X.temple);
    const base = g - 9 * cu;
    return { cu, x, g, base, top: base - 40 * cu, porchTop: base - 47 * cu, w: 30 * cu };
  }
  function drawJerusalem(ctx) {
    const A = cityA();
    if (A < 0.01) return;
    const cu = CU(), ru = lv('ekRuin'), dim = lv('ekDim'), nk = nightK();
    const dk = DEP(1);
    const stone = mix([214, 198, 162], [80, 68, 60], ru * 0.65), wallc = mix([196, 178, 140], [84, 72, 62], ru * 0.6);
    const ex = -0.12 * dim - 0.1 * ru;
    ctx.save();
    ctx.globalAlpha = A;
    // 房屋
    for (let i = 0; i < CITY.houses.length; i++) {
      const hs = CITY.houses[i], x = hs.x * W.w, g = gY(1, hs.x) + 2 * cu;
      const hh = hs.h * cu * (1 - ru * 0.55 * hsh(i + 3)), w = hs.w * cu;
      ctx.fillStyle = W.shadeCSS(mix(stone, [150, 136, 116], hs.dz * 0.4), dk, 1, ex);
      ctx.fillRect(x - w / 2, g - hh, w, hh);
      ctx.fillStyle = W.shadeCSS(mix(stone, [255, 240, 210], 0.3), dk, 0.6, ex + 0.1);
      ctx.fillRect(x - w / 2, g - hh, w, Math.max(1, 1.2 * cu));
      if (hs.dome && ru < 0.5) { ctx.fillStyle = W.shadeCSS(stone, dk, 1, ex); ctx.beginPath(); ctx.arc(x, g - hh, w * 0.32, Math.PI, 0); ctx.fill(); }
      // 夜里的窗
      if (nk > 0.05 && ru < 0.6 && hs.win > 0.35) {
        ctx.fillStyle = U.rgba(255, 200, 120, nk * (1 - ru) * (0.5 + 0.4 * hs.win));
        ctx.fillRect(x - w * 0.12, g - hh * 0.6, Math.max(1, 2 * cu), Math.max(1, 2.4 * cu));
      }
    }
    // 殿（在城中的高处）
    const T0 = templeGeomM(), tx = T0.x;
    ctx.fillStyle = W.shadeCSS([176, 160, 128], dk, 1, ex);
    ctx.beginPath(); ctx.ellipse(tx, T0.g + 2 * cu, 42 * cu, 13 * cu, 0, Math.PI, 0); ctx.fill();
    const tc = mix([238, 228, 200], [86, 74, 66], ru * 0.7);
    const hTop = lerp(T0.top, T0.base - 18 * cu, ru), pTop = lerp(T0.porchTop, T0.base - 22 * cu, ru * 0.9);
    ctx.fillStyle = W.shadeCSS(tc, dk, 1, ex + 0.05);
    ctx.fillRect(tx - T0.w * 0.5, hTop, T0.w, T0.base - hTop);
    ctx.fillStyle = W.shadeCSS(mix(tc, [255, 250, 236], 0.2), dk, 1, ex + 0.1);
    ctx.fillRect(tx - T0.w * 0.5 - 10 * cu, pTop, 11 * cu, T0.base - pTop);
    // 两根柱子（雅斤、波阿斯）
    ctx.fillStyle = W.shadeCSS(mix([226, 186, 104], [80, 66, 56], ru), dk, 1, ex + 0.1);
    ctx.fillRect(tx - T0.w * 0.5 - 14 * cu, T0.base - 30 * cu * (1 - ru * 0.7), 2.2 * cu, 30 * cu * (1 - ru * 0.7));
    ctx.fillRect(tx - T0.w * 0.5 - 18.5 * cu, T0.base - 30 * cu, 2.2 * cu, 30 * cu);
    if (ru < 0.5) {
      ctx.fillStyle = W.shadeCSS([226, 186, 104], dk, 1 - ru * 2, 0.1);
      ctx.fillRect(tx - T0.w * 0.5 - 10 * cu, pTop, T0.w + 10 * cu, Math.max(1, 1.6 * cu));
    }
    // 门
    ctx.fillStyle = W.shadeCSS([40, 32, 26], dk, 0.9);
    ctx.fillRect(tx - T0.w * 0.5 - 6.5 * cu, T0.base - 16 * cu, 4 * cu, 16 * cu);
    // 城墙与城楼（有破口）
    ctx.fillStyle = W.shadeCSS(wallc, dk, 1, ex);
    const N = 56;
    for (let i = 0; i < N; i++) {
      const x0 = lerp(X.city0, X.city1, i / N), x1 = lerp(X.city0, X.city1, (i + 1) / N);
      if (ru > 0.05 && hsh(i * 3 + 7) < 0.34 * ru) continue;
      const gx = gY(1, (x0 + x1) / 2) + 3 * cu;
      const wh = 13 * cu * (1 - (ru > 0.05 ? 0.4 * ru * hsh(i + 50) : 0));
      ctx.fillRect(x0 * W.w, gx - wh, (x1 - x0) * W.w + 0.6, wh);
      if (i % 2 === 0 && ru < 0.6) ctx.fillRect(x0 * W.w, gx - wh - 2.4 * cu, (x1 - x0) * W.w * 0.55, 2.4 * cu);
    }
    for (let i = 0; i < CITY.towers.length; i++) {
      const xf = CITY.towers[i], x = xf * W.w, g = gY(1, xf) + 3 * cu;
      const east = xf === X.gateE;
      const th = (east ? 25 : 21) * cu * (1 - ru * 0.45 * hsh(i + 90)), tw = (east ? 15 : 9) * cu;
      ctx.fillStyle = W.shadeCSS(mix(wallc, [230, 214, 180], 0.15), dk, 1, ex);
      ctx.fillRect(x - tw / 2, g - th, tw, th);
      if (east) { ctx.fillStyle = W.shadeCSS([36, 28, 24], dk, 0.9); ctx.beginPath(); ctx.moveTo(x - 3.4 * cu, g); ctx.lineTo(x - 3.4 * cu, g - 9 * cu); ctx.arc(x, g - 9 * cu, 3.4 * cu, Math.PI, 0); ctx.lineTo(x + 3.4 * cu, g); ctx.fill(); }
    }
    ctx.restore();
  }
  // 城已攻破：殿上的烟柱
  function drawSmokeCol(ctx) {
    const ru = lv('ekRuin') * cityA();
    if (ru < 0.02) return;
    SP || sprites();
    const T0 = templeGeomM(), cu = T0.cu;
    ctx.save();
    for (let i = 0; i < 16; i++) {
      const ph = U.fract(CLK * 0.05 + rt(i * 3 + 500));
      const x = T0.x - 8 * cu + Math.sin(ph * 3 + i) * 6 * cu - ph * 60 * cu, y = T0.base - 20 * cu - ph * 150 * cu;
      const r = (10 + 40 * ph) * cu;
      ctx.globalAlpha = ru * 0.3 * Math.sin(Math.PI * ph);
      ctx.drawImage(SP.smoke, x - r, y - r, 2 * r, 2 * r);
    }
    // 余火
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const xf = X.city0 + 0.02 + (X.city1 - X.city0 - 0.04) * rt(i * 5 + 520), r = (8 + 6 * rt(i * 5 + 521)) * cu;
      ctx.globalAlpha = ru * (0.25 + 0.2 * Math.sin(CLK * 3 + i)) * (0.4 + 0.6 * nightK());
      ctx.drawImage(SP.ember, xf * W.w - r, gY(1, xf) - 4 * cu - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 荣耀的车驾：光、四翼的微光、轮的光圈
  function gloryPt(p) {
    const T0 = templeGeomM(), cu = T0.cu;
    const P = [
      [T0.x, T0.top - 26 * cu],
      [T0.x - T0.w * 0.5 - 8 * cu, T0.base - 16 * cu],
      [X.gateE * W.w, gY(1, X.gateE) - 40 * cu],
      [X.mountE * W.w, gY(1, X.mountE) - 88 * cu],
    ];
    const i = clamp(Math.floor(p), 0, 2), t = U.easeInOut(clamp(p - i, 0, 1));
    const a = P[i], b = P[Math.min(3, i + 1)];
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t) - Math.sin(Math.PI * t) * 16 * cu];
  }
  function drawGloryCar(ctx, x, y, s, a) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    let r = 150 * s;
    ctx.globalAlpha = a * 0.45; ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
    r = 56 * s;
    ctx.globalAlpha = a * 0.95; ctx.drawImage(SP.white, x - r, y - r, 2 * r, 2 * r);
    // 基路伯的翅膀（四道弧光）
    ctx.strokeStyle = 'rgb(255,240,206)'; ctx.lineWidth = Math.max(1, 1.5 * s);
    for (let i = 0; i < 4; i++) {
      const side = i % 2 ? 1 : -1, up = i < 2 ? 1 : 0.6, fl = Math.sin(CLK * 2 + i) * 0.12;
      ctx.globalAlpha = a * 0.6;
      ctx.beginPath(); ctx.moveTo(x + side * 8 * s, y - 4 * s);
      ctx.quadraticCurveTo(x + side * 40 * s, y - (34 * up + 10 * fl) * s, x + side * 62 * s, y - (12 * up - 20) * s);
      ctx.stroke();
    }
    // 轮
    ctx.strokeStyle = 'rgb(176,238,212)';
    for (let i = 0; i < 4; i++) {
      const wx = x + (i - 1.5) * 20 * s, wy = y + 22 * s, rr = 8 * s;
      ctx.globalAlpha = a * 0.7;
      ctx.beginPath(); ctx.ellipse(wx, wy, rr, rr, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(wx, wy, rr * Math.abs(Math.cos(CLK + i)), rr, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }
  function drawGloryM(ctx) {
    const a = lv('ekGlory') * cityA();
    if (a < 0.01) return;
    SP || sprites();
    const p = gloryPt(lv('ekGloryP'));
    drawGloryCar(ctx, p[0], p[1], CU(), a);
    // 殿中满了云彩
    const T0 = templeGeomM(), inside = a * (1 - sm(0.3, 1.2, lv('ekGloryP')));
    if (inside > 0.01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const r = 70 * T0.cu;
      ctx.globalAlpha = inside * 0.5; ctx.drawImage(SP.mist, T0.x - r * 1.4, T0.base - 30 * T0.cu - r, 2.8 * r, 2 * r);
      ctx.restore();
    }
  }
  // 额上的记号：穿细麻衣的人走过，叹息哀哭的人额上显出一点光
  const MARKED = [1, 3, 6];
  function drawMarks(ctx) {
    const k = lv('ekMark');
    if (k < 0.001 || cityA() < 0.05) return;
    const ms = members('jer');
    if (!ms.length) return;
    const lx = lerp(X.gateE, 0.975, k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    SP || sprites();
    for (const i of MARKED) {
      const m = ms[i];
      if (!m || m.nx > lx + 0.004) continue;
      const p = memberPt(m, 0.93), r = 9 * SU() * W.layerScale(1);
      const tw = 0.8 + 0.2 * Math.sin(CLK * 2 + i);
      ctx.globalAlpha = 0.9 * tw * cityA();
      ctx.drawImage(SP.gold, p[0] - r * 2, p[1] - r * 2, r * 4, r * 4);
      ctx.fillStyle = 'rgb(255,246,214)';
      const L = Math.max(1.5, r * 0.55);
      ctx.fillRect(p[0] - L, p[1] - 0.6, 2 * L, 1.2); ctx.fillRect(p[0] - 0.6, p[1] - L, 1.2, 2 * L);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  香柏树与飞鸟（17:22–24）
  // ════════════════════════════════════════════════════════════
  const TIERS = 7;
  function cedarGeom() { const cu = CU(); return { cu, x: X.cedar * W.w, g: gY(1, X.cedar) + 2 * cu, H: 150 * cu }; }
  function drawCedar(ctx) {
    const k = lv('ekCedar') * (1 - lv('ekHide'));
    if (k < 0.004) return;
    const G = cedarGeom(), cu = G.cu, dk = DEP(1);
    ctx.save();
    if (k < 0.1) {
      // 嫩枝
      const h = (8 + 60 * k) * cu;
      ctx.strokeStyle = W.shadeCSS([86, 110, 70], dk, 1); ctx.lineWidth = Math.max(1, 1.4 * cu);
      ctx.beginPath(); ctx.moveTo(G.x, G.g); ctx.lineTo(G.x, G.g - h); ctx.stroke();
      ctx.fillStyle = W.shadeCSS([96, 150, 90], dk, 1, 0.1);
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(G.x + (i - 1) * 3 * cu, G.g - h + i * 2 * cu, 3.2 * cu, 1.6 * cu, 0, 0, TAU); ctx.fill(); }
      ctx.restore();
      return;
    }
    const gk = sm(0.08, 1, k), H = G.H * lerp(0.12, 1, gk);
    // 干
    ctx.fillStyle = W.shadeCSS([70, 52, 40], dk, 1);
    const tw = lerp(1.5, 5.5, gk) * cu;
    ctx.beginPath(); ctx.moveTo(G.x - tw, G.g); ctx.lineTo(G.x - tw * 0.3, G.g - H * 0.95); ctx.lineTo(G.x + tw * 0.3, G.g - H * 0.95); ctx.lineTo(G.x + tw, G.g); ctx.fill();
    // 层层平展的枝
    for (let i = 0; i < TIERS; i++) {
      const vis = sm(0.12 + i * 0.1, 0.24 + i * 0.1, k);
      if (vis < 0.01) continue;
      const hy = G.g - H * (0.24 + 0.105 * i), hw = (66 - 7.5 * i) * cu * lerp(0.35, 1, gk) * vis, th = (8 - 0.4 * i) * cu * lerp(0.5, 1, gk);
      const sway = Math.sin(CLK * 0.6 + i) * 1.2 * cu;
      ctx.fillStyle = W.shadeCSS([44, 80, 58], dk, 1);
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const ox = (j - 1.5) * hw * 0.45 + (rt(i * 9 + j) - 0.5) * 6 * cu + sway, oy = (rt(i * 9 + j + 4) - 0.5) * 3 * cu;
        ctx.moveTo(G.x + ox + hw * 0.36, hy + oy); ctx.ellipse(G.x + ox, hy + oy, hw * 0.36, th * 0.5, 0, 0, TAU);
      }
      ctx.fill();
      ctx.fillStyle = W.shadeCSS([96, 132, 86], dk, 0.7, 0.12);
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const ox = (j - 1.5) * hw * 0.45 + (rt(i * 9 + j) - 0.5) * 6 * cu + sway, oy = (rt(i * 9 + j + 4) - 0.5) * 3 * cu;
        ctx.moveTo(G.x + ox + hw * 0.3, hy + oy - th * 0.25); ctx.ellipse(G.x + ox, hy + oy - th * 0.25, hw * 0.3, th * 0.18, 0, 0, TAU);
      }
      ctx.fill();
    }
    // 树顶
    ctx.fillStyle = W.shadeCSS([44, 80, 58], dk, 1);
    ctx.beginPath(); ctx.moveTo(G.x - 8 * cu * gk, G.g - H * 0.9); ctx.lineTo(G.x, G.g - H); ctx.lineTo(G.x + 8 * cu * gk, G.g - H * 0.9); ctx.fill();
    ctx.restore();
  }
  // 各类飞鸟：自天而来，宿在枝子的荫下
  const BIRDS = [[0, 0.55], [2, -0.45], [1, 0.25], [4, -0.2], [3, 0.5], [5, 0.1], [2, 0.7], [1, -0.65], [4, 0.4]];
  const BIRD_COL = [[40, 40, 48], [236, 232, 222], [120, 86, 60], [60, 74, 110], [170, 150, 120], [34, 34, 40], [214, 196, 160], [90, 70, 58], [200, 206, 214]];
  function drawNest(ctx) {
    const k = lv('ekNest') * (1 - lv('ekHide'));
    if (k < 0.001 || lv('ekCedar') < 0.6) return;
    const G = cedarGeom(), cu = G.cu, dk = DEP(1);
    ctx.save();
    BIRDS.forEach((b, i) => {
      const p = clamp((k - i * 0.07) / 0.4, 0, 1);
      if (p <= 0) return;
      const tier = b[0], hy = G.g - G.H * (0.24 + 0.105 * tier) - 4 * cu, hx = G.x + b[1] * (66 - 7.5 * tier) * cu * 0.55;
      const sx = (i % 2 ? 1 : -1) * W.w * (0.12 + 0.1 * rt(i + 700)) + hx, sy = W.h * (0.08 + 0.15 * rt(i + 710));
      const e = U.easeInOut(p);
      const x = lerp(sx, hx, e), y = lerp(sy, hy, e) - Math.sin(Math.PI * e) * 20 * cu;
      const col = W.shadeCSS(BIRD_COL[i % BIRD_COL.length], dk, 1);
      ctx.fillStyle = col; ctx.strokeStyle = col;
      if (p < 1) {
        const fl = Math.sin(CLK * 14 + i) * 3 * cu, dir = hx > sx ? 1 : -1;
        ctx.lineWidth = Math.max(1, 1.2 * cu);
        ctx.beginPath(); ctx.moveTo(x - 4 * cu, y - fl); ctx.quadraticCurveTo(x - 1.5 * cu, y - 1 * cu, x, y); ctx.quadraticCurveTo(x + 1.5 * cu, y - 1 * cu, x + 4 * cu, y - fl); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(x + dir * 0.6 * cu, y + 0.3 * cu, 1.6 * cu, 0.9 * cu, 0, 0, TAU); ctx.fill();
      } else {
        const bob = Math.abs(Math.sin(CLK * 1.5 + i * 2)) * 0.5 * cu;
        ctx.beginPath(); ctx.ellipse(x, y - 1.6 * cu - bob, 2 * cu, 1.4 * cu, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(x + (i % 2 ? 1.6 : -1.6) * cu, y - 3 * cu - bob, 0.95 * cu, 0, TAU); ctx.fill();
      }
    });
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  泰尔（中丘的海口）：全然美丽的城、海浪、晒网的磐石（26—28）
  // ════════════════════════════════════════════════════════════
  const TYRE = (function () {
    const r = U.mulberry32(2603), b = [];
    for (let i = 0; i < 9; i++) {
      const x = lerp(X.tyre0 + 0.01, X.tyre1 - 0.008, (i + 0.5) / 9);
      b.push({ x, w: 8 + r() * 6, h: 16 + r() * 22, d: 0.05 + 0.5 * r(), gold: r() < 0.4 });
    }
    b[4].h = 50; b[4].w = 10; b[4].gold = true; b[4].throne = true;
    return b;
  })();
  function tyreTop() { const cu = CU(); return Math.min(gY(1, 0.52), W.waterlineY(1)) - 7 * cu; }
  function drawTyre(ctx) {
    const A = lv('ekTyre') * (1 - lv('ekHide'));
    if (A < 0.01) return;
    const cu = CU(), dk = DEP(1), wl = W.waterlineY(1), top = tyreTop(), fall = lv('ekFall');
    ctx.save(); ctx.globalAlpha = A;
    // 磐石（城倾倒后露出，净光）
    const rock = mix([128, 116, 100], [196, 188, 172], sm(0.6, 1, fall));
    ctx.fillStyle = W.shadeCSS(rock, dk, 1);
    ctx.beginPath();
    ctx.moveTo(X.tyre0 * W.w - 6 * cu, wl + 3 * cu);
    ctx.lineTo(X.tyre0 * W.w - 2 * cu, top + 3 * cu);
    ctx.quadraticCurveTo(lerp(X.tyre0, X.tyre1, 0.5) * W.w, top - 2 * cu, X.tyre1 * W.w, top + 1 * cu);
    ctx.lineTo(X.tyre1 * W.w + 8 * cu, gY(1, X.tyre1 + 0.01) + 4 * cu);
    ctx.lineTo(X.tyre1 * W.w + 8 * cu, wl + 3 * cu);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = W.shadeCSS(mix(rock, [255, 246, 226], 0.3), dk, 0.8, 0.12);
    ctx.beginPath(); ctx.moveTo(X.tyre0 * W.w - 2 * cu, top + 3 * cu); ctx.quadraticCurveTo(lerp(X.tyre0, X.tyre1, 0.5) * W.w, top - 2 * cu, X.tyre1 * W.w, top + 1 * cu);
    ctx.lineTo(X.tyre1 * W.w, top + 2.4 * cu); ctx.quadraticCurveTo(lerp(X.tyre0, X.tyre1, 0.5) * W.w, top - 0.6 * cu, X.tyre0 * W.w - 2 * cu, top + 4.4 * cu); ctx.fill();
    // 城
    const pride = lv('ekPride');
    const col = [222, 206, 176];
    for (let i = 0; i < TYRE.length; i++) {
      const b = TYRE[i], f = 1 - sm(b.d, b.d + 0.38, fall);
      if (f < 0.02) continue;
      const x = b.x * W.w, w = b.w * cu, h = b.h * cu * f;
      const y0 = top + 2 * cu + (1 - f) * 4 * cu;
      ctx.fillStyle = W.shadeCSS(mix(col, [180, 160, 130], rt(i + 800) * 0.3), dk, 1);
      ctx.fillRect(x - w / 2, y0 - h, w, h);
      ctx.fillStyle = W.shadeCSS([255, 240, 214], dk, 0.5, 0.15);
      ctx.fillRect(x - w / 2, y0 - h, Math.max(1, 1.4 * cu), h);
      if (b.gold && f > 0.6) {
        ctx.fillStyle = W.shadeCSS([232, 186, 90], dk, 1, 0.1 + 0.3 * pride);
        if (b.throne) { ctx.beginPath(); ctx.arc(x, y0 - h, w * 0.55, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 0.6 * cu, y0 - h - w * 0.55 - 5 * cu, 1.2 * cu, 5 * cu); }
        else ctx.fillRect(x - w / 2, y0 - h - 2 * cu, w, 2 * cu);
      }
      // 窗与城垛
      ctx.fillStyle = W.shadeCSS([60, 48, 40], dk, 0.7);
      for (let j = 0; j < Math.floor(h / (7 * cu)); j++) ctx.fillRect(x - 1 * cu, y0 - h + (3 + j * 7) * cu, 2 * cu, 2.6 * cu);
    }
    // 海边的城墙
    const wf = 1 - sm(0.1, 0.55, fall);
    if (wf > 0.02) {
      ctx.fillStyle = W.shadeCSS([206, 190, 158], dk, 1);
      ctx.fillRect(X.tyre0 * W.w - 3 * cu, top + 3 * cu - 9 * cu * wf, (X.tyre1 - X.tyre0) * W.w + 6 * cu, 9 * cu * wf);
      for (let i = 0; i < 12; i++) ctx.fillRect(lerp(X.tyre0, X.tyre1, i / 11) * W.w - 1.5 * cu, top + 3 * cu - 11.5 * cu * wf, 3 * cu, 2.5 * cu * wf);
    }
    ctx.restore();
    // 在海中坐神之位：一圈虚假的金光
    if (pride > 0.01 && fall < 0.3) {
      SP || sprites();
      const b = TYRE[4], x = b.x * W.w, y = top - b.h * cu - 6 * cu;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const r = 42 * cu;
      ctx.globalAlpha = A * pride * 0.55 * (1 - fall * 3) * (0.8 + 0.2 * Math.sin(CLK * 2));
      ctx.drawImage(SP.amber, x - r, y - r, 2 * r, 2 * r);
      ctx.strokeStyle = 'rgb(255,214,130)'; ctx.lineWidth = Math.max(1, 1.2 * cu);
      ctx.beginPath(); ctx.ellipse(x, y - 4 * cu, 11 * cu, 3.4 * cu, 0, 0, TAU); ctx.stroke();
      // 城上的金光点点
      for (let i = 0; i < 8; i++) {
        const bb = TYRE[i];
        const tw = Math.max(0, Math.sin(CLK * 2.5 + i * 1.9));
        ctx.globalAlpha = A * pride * tw * 0.8;
        const gx = bb.x * W.w, gy = top - bb.h * cu;
        ctx.drawImage(SP.gold, gx - 6 * cu, gy - 6 * cu, 12 * cu, 12 * cu);
      }
      ctx.restore();
    }
  }
  // 海浪涌上
  function drawWaves(ctx) {
    const k = lv('ekWave') * lv('ekTyre') * (1 - lv('ekHide'));
    if (k < 0.01) return;
    const cu = CU(), wl = W.waterlineY(1);
    ctx.save();
    for (let i = 0; i < 7; i++) {
      const ph = U.fract(CLK * 0.35 + i / 7);
      const x = lerp(0.468, X.tyre0 + 0.02, rt(i + 900)) * W.w + ph * 14 * cu;
      const h = Math.sin(Math.PI * ph) * (14 + 16 * rt(i + 910)) * cu * k;
      const w = (16 + 10 * rt(i + 920)) * cu;
      ctx.fillStyle = W.shadeCSS([70, 104, 130], DEP(1), 0.9);
      ctx.beginPath(); ctx.moveTo(x - w, wl + 2 * cu); ctx.quadraticCurveTo(x - w * 0.2, wl - h * 1.1, x + w * 0.35, wl - h * 0.7); ctx.quadraticCurveTo(x + w * 0.5, wl - h * 0.2, x + w * 0.8, wl + 2 * cu); ctx.fill();
      ctx.strokeStyle = W.shadeCSS([240, 246, 250], DEP(1), 0.85 * Math.sin(Math.PI * ph), 0.2); ctx.lineWidth = Math.max(1, 1.6 * cu);
      ctx.beginPath(); ctx.moveTo(x - w * 0.4, wl - h * 0.75); ctx.quadraticCurveTo(x + w * 0.1, wl - h * 1.05, x + w * 0.35, wl - h * 0.7); ctx.stroke();
      // 浪花
      ctx.fillStyle = W.shadeCSS([240, 246, 250], DEP(1), 0.6 * Math.sin(Math.PI * ph), 0.2);
      for (let j = 0; j < 5; j++) { const sx = x + (rt(i * 7 + j) - 0.3) * w, sy = wl - h * (0.8 + 0.8 * rt(i * 7 + j + 3)) - ph * 8 * cu; ctx.fillRect(sx, sy, 1.5 * cu, 1.5 * cu); }
    }
    ctx.restore();
  }
  // 晒网的地方：竿与网
  function drawNets(ctx) {
    const k = lv('ekNets') * lv('ekTyre') * (1 - lv('ekHide'));
    if (k < 0.01) return;
    const cu = CU(), dk = DEP(1), top = tyreTop() + 2 * cu;
    const poles = [X.tyre0 + 0.012, X.tyre0 + 0.04, X.tyre0 + 0.068, X.tyre0 + 0.09];
    ctx.save(); ctx.globalAlpha = k;
    ctx.strokeStyle = W.shadeCSS([96, 74, 54], dk, 1); ctx.lineWidth = Math.max(1, 1.3 * cu);
    ctx.beginPath();
    for (const p of poles) { ctx.moveTo(p * W.w, top); ctx.lineTo(p * W.w, top - 18 * cu); }
    ctx.stroke();
    ctx.strokeStyle = W.shadeCSS([150, 136, 112], dk, 0.75); ctx.lineWidth = Math.max(0.6, 0.6 * cu);
    for (let i = 0; i < poles.length - 1; i++) {
      const x0 = poles[i] * W.w, x1 = poles[i + 1] * W.w, y0 = top - 17 * cu, sag = 7 * cu;
      ctx.beginPath();
      for (let r = 0; r < 4; r++) { const yy = y0 + r * 3 * cu; ctx.moveTo(x0, yy); ctx.quadraticCurveTo((x0 + x1) / 2, yy + sag, x1, yy); }
      for (let c = 0; c <= 6; c++) { const t = c / 6, x = lerp(x0, x1, t), dy = 4 * t * (1 - t) * sag; ctx.moveTo(x, y0 + dy); ctx.lineTo(x, y0 + dy + 9 * cu); }
      ctx.stroke();
    }
    // 一只小船
    const bx = (X.tyre0 - 0.004) * W.w, by = W.waterlineY(1) + 2 * cu;
    ctx.fillStyle = W.shadeCSS([86, 64, 46], dk, 1);
    ctx.beginPath(); ctx.moveTo(bx - 9 * cu, by - 3 * cu); ctx.quadraticCurveTo(bx, by + 2 * cu, bx + 9 * cu, by - 3 * cu); ctx.lineTo(bx + 7 * cu, by); ctx.lineTo(bx - 7 * cu, by); ctx.fill();
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  石心与肉心（36:26）
  // ════════════════════════════════════════════════════════════
  const HEARTED = ['folk', 'exiles'];
  function drawHearts(ctx) {
    const st = lv('ekStone');
    if (st < 0.01) return;
    SP || sprites();
    const hk = lv('ekHeart');
    ctx.save();
    let n = 0;
    for (const gid of HEARTED) {
      for (const m of members(gid)) {
        const p = memberPt(m, m.pose === 'sit' ? 0.42 : 0.64), u = Math.max(0.5, (m._h || 40) / 48);
        const d = (n % 9) / 9 * 0.45, q = clamp((hk - d) / 0.5, 0, 1);
        n++;
        const a = st * (m.alpha == null ? 1 : m.alpha);
        // 石
        if (q < 1) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = a * (1 - q);
          ctx.fillStyle = 'rgb(118,116,112)';
          ctx.beginPath();
          const r = 3.6 * u;
          for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + 0.3, rr = r * (0.8 + 0.3 * rt(n * 6 + i)); if (i) ctx.lineTo(p[0] + Math.cos(an) * rr, p[1] + Math.sin(an) * rr); else ctx.moveTo(p[0] + Math.cos(an) * rr, p[1] + Math.sin(an) * rr); }
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgb(70,68,66)'; ctx.lineWidth = 0.8; ctx.stroke();
          if (q > 0) { ctx.strokeStyle = 'rgb(255,190,150)'; ctx.globalAlpha = a * q; ctx.beginPath(); ctx.moveTo(p[0] - r * 0.6, p[1] - r * 0.3); ctx.lineTo(p[0] + r * 0.1, p[1] + r * 0.2); ctx.lineTo(p[0] + r * 0.5, p[1] - r * 0.5); ctx.stroke(); }
        }
        // 肉心：温暖跳动的光
        if (q > 0) {
          ctx.globalCompositeOperation = 'lighter';
          const beat = 0.85 + 0.15 * Math.pow(Math.max(0, Math.sin(CLK * 5.2 + n)), 6);
          const r = 11 * u * beat;
          ctx.globalAlpha = a * q * 0.8;
          ctx.drawImage(SP.rose, p[0] - r, p[1] - r, 2 * r, 2 * r);
          ctx.globalAlpha = a * q;
          ctx.fillStyle = 'rgb(255,214,190)';
          ctx.beginPath(); ctx.arc(p[0], p[1], 1.6 * u * beat, 0, TAU); ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  遍满骸骨的平原（37:1–10）
  // ════════════════════════════════════════════════════════════
  // 一副骨头：[u0, w0, u1, w1, 粗]（u 自脚 0 至头 1，w 离地的高度；皆以身长为 1）
  const BONES = [
    [0.52, -0.05, 0.83, -0.05, 1.9],   // 脊
    [0.62, -0.02, 0.63, -0.12, 1], [0.68, -0.02, 0.69, -0.13, 1], [0.74, -0.02, 0.75, -0.12, 1],   // 肋
    [0.47, -0.03, 0.55, -0.09, 2.6],   // 盆
    [0.5, -0.04, 0.27, -0.03, 2], [0.5, -0.07, 0.28, -0.09, 2],       // 股
    [0.27, -0.03, 0.03, -0.03, 1.6], [0.28, -0.09, 0.05, -0.1, 1.6],  // 胫
    [0.81, -0.07, 0.63, -0.11, 1.5], [0.63, -0.11, 0.47, -0.12, 1.3], // 臂
    [0.81, -0.03, 0.64, 0.0, 1.5], [0.64, 0.0, 0.48, 0.01, 1.3],
  ];
  const SKULL = [0.9, -0.055, 0.058];
  // 骸骨的位置：近地 22、中丘 26（与后来的身体同一处）
  const SKEL = (function () {
    const r = U.mulberry32(3707), near = [], mid = [];
    for (let i = 0; i < 22; i++) near.push({ x: 0.43 + 0.56 * ((i + 0.25 + 0.5 * r()) / 22), v: 0.04 + 0.72 * r(), f: r() < 0.5 ? 1 : -1, seed: (r() * 1e6) | 0 });
    for (let i = 0; i < 26; i++) mid.push({ x: 0.515 + 0.47 * ((i + 0.2 + 0.6 * r()) / 26), v: 0.05 + 0.6 * r(), f: r() < 0.5 ? 1 : -1, seed: (r() * 1e6) | 0 });
    // 每根骨头散开时的偏移
    for (const s of near.concat(mid)) {
      const q = U.mulberry32(s.seed);
      s.sc = BONES.map(() => [(q() - 0.5) * 1.3, (q() - 0.5) * 0.16, (q() - 0.5) * 3.2, q() * 0.35]);
      s.sk = [(q() - 0.5) * 1.1, (q() - 0.5) * 0.08, q() * 0.3];
    }
    return { near, mid };
  })();
  // 近地四群、中丘三群（身体站起时按群先后）
  const GROUPS_N = [[0, 6], [6, 11], [11, 16], [16, 22]], GROUPS_M = [[0, 9], [9, 18], [18, 26]];
  const bodyGroups = () => GROUPS_N.map((g, i) => ['bodyN' + i, 2, g]).concat(GROUPS_M.map((g, i) => ['bodyM' + i, 1, g]));
  // 身体的中心：人物模块里躺卧的人，髋在 nx 处，头朝面向的一侧
  function skelFrame(s, l) {
    const g = gY(l, s.x), h = personH(l, s.v);
    const y = g + s.v * fieldH(l, g) * 0.8;
    return { x: s.x * W.w, y, h };
  }
  function drawSkeletons(ctx, l) {
    const A = lv('ekBones') * (1 - lv('ekFlesh') * 0.97);
    if (A < 0.01) return;
    const list = l === 2 ? SKEL.near : SKEL.mid, join = lv('ekJoin'), sin = lv('ekSinew');
    const lit = mix([214, 206, 184], [236, 230, 212], W.lv.moon * nightK());
    const boneCol = W.shadeCSS(lit, DEP(l), 1, 0.25 + 0.3 * nightK());
    const edge = W.shadeCSS([70, 62, 54], DEP(l), 0.6);
    const pBone = new Path2D(), pSkull = new Path2D(), pSin = new Path2D();
    let wBase = 0;
    for (const s of list) {
      const F = skelFrame(s, l), h = F.h, f = s.f;
      wBase = h * 0.02;
      const P = (u, w) => [F.x + (u - 0.5) * h * f, F.y + w * h];
      BONES.forEach((b, i) => {
        const sc = s.sc[i], t = U.easeInOut(clamp((join - sc[3]) / 0.65, 0, 1));
        let a0 = P(b[0], b[1]), a1 = P(b[2], b[3]);
        if (t < 1) {
          const cx = (a0[0] + a1[0]) / 2, cy = (a0[1] + a1[1]) / 2;
          const ox = sc[0] * h * (1 - t), oy = sc[1] * h * (1 - t), rot = sc[2] * (1 - t);
          const dx = (a1[0] - a0[0]) / 2, dy = (a1[1] - a0[1]) / 2, c = Math.cos(rot), sn = Math.sin(rot);
          // 散着的骨头都平躺在地上
          const fl = 1 - t;
          const rdx = dx * c - dy * sn, rdy = (dx * sn + dy * c) * (1 - 0.8 * fl);
          const ccy = lerp(cy, F.y - h * 0.03, fl);
          a0 = [cx + ox - rdx, ccy + oy - rdy]; a1 = [cx + ox + rdx, ccy + oy + rdy];
        }
        pBone.moveTo(a0[0], a0[1]); pBone.lineTo(a1[0], a1[1]);
        if (sin > 0.01 && t > 0.9) { pSin.moveTo(a0[0], a0[1]); pSin.lineTo(a1[0], a1[1]); }
      });
      const kt = U.easeInOut(clamp((join - s.sk[2]) / 0.65, 0, 1));
      const sk = P(SKULL[0], SKULL[1]);
      const sx = sk[0] + s.sk[0] * h * (1 - kt), sy = lerp(sk[1], F.y - h * SKULL[2], 1 - kt) + s.sk[1] * h * (1 - kt);
      pSkull.moveTo(sx + h * SKULL[2], sy); pSkull.arc(sx, sy, h * SKULL[2], 0, TAU);
    }
    ctx.save();
    ctx.globalAlpha = A;
    ctx.lineCap = 'round';
    ctx.strokeStyle = edge; ctx.lineWidth = Math.max(1.4, wBase * 2.4 + 1); ctx.stroke(pBone);
    ctx.strokeStyle = boneCol; ctx.lineWidth = Math.max(1, wBase * 2.2); ctx.stroke(pBone);
    ctx.fillStyle = boneCol; ctx.fill(pSkull);
    ctx.strokeStyle = edge; ctx.lineWidth = 0.8; ctx.stroke(pSkull);
    if (sin > 0.01) { ctx.globalAlpha = A * sin * 0.85; ctx.strokeStyle = W.shadeCSS([150, 70, 60], DEP(l), 1); ctx.lineWidth = Math.max(0.8, wBase * 1.1); ctx.stroke(pSin); }
    ctx.restore();
  }
  // 远山：更远处的骸骨，后来站起来的极大的军队
  const FARM = (function () { const a = []; for (let i = 0; i < 120; i++) a.push({ x: 0.47 + 0.52 * ((i + hsh(i * 3.3)) / 120), d: hsh(i * 7.7), f: hsh(i * 1.9) < 0.5 ? -1 : 1 }); return a; })();
  function drawFarHost(ctx) {
    const bo = lv('ekBones') * (1 - lv('ekFlesh')), fl = lv('ekFlesh'), ar = lv('ekArmy');
    if (bo < 0.01 && fl < 0.01) return;
    const hh = personH(0, 0) * 0.95, u = Math.max(0.8, hh / 13);
    const sil = W.shadeCSS([62, 52, 46], DEP(0), 1), rim = W.shadeCSS([255, 214, 160], DEP(0), 0.7, 0.3);
    const bone = W.shadeCSS([226, 218, 196], DEP(0), 1, 0.3);
    ctx.save();
    if (bo > 0.01) {
      ctx.globalAlpha = bo * 0.8; ctx.fillStyle = bone;
      for (let i = 0; i < FARM.length; i++) { const m = FARM[i], x = m.x * W.w, g = gY(0, m.x); ctx.fillRect(x - 2.5 * u, g - 1 * u, 5 * u, 1.2 * u); ctx.fillRect(x + m.f * 3 * u, g - 1.8 * u, 1.6 * u, 1.6 * u); }
    }
    if (fl > 0.01) {
      ctx.lineCap = 'round';
      const pb = new Path2D(), ph = new Path2D(), pr = new Path2D();
      for (let i = 0; i < FARM.length; i++) {
        const m = FARM[i], x = m.x * W.w, g = gY(0, m.x) + 0.5 * u;
        const st = U.easeInOut(clamp((ar - m.x * 0.5 + 0.2 - m.d * 0.15) / 0.28, 0, 1));
        const an = (1 - st) * Math.PI / 2 * m.f;
        const hx = x + Math.sin(an) * hh * 0.82, hy = g - Math.cos(an) * hh * 0.82;
        pb.moveTo(x, g); pb.lineTo(hx, hy);
        ph.moveTo(hx + hh * 0.1, hy - hh * 0.04); ph.arc(hx, hy - hh * 0.04, hh * 0.1, 0, TAU);
        if (st > 0.5) { pr.moveTo(x - hh * 0.05, g - hh * 0.2); pr.lineTo(hx - hh * 0.05, hy); }
      }
      ctx.globalAlpha = fl;
      ctx.strokeStyle = sil; ctx.lineWidth = Math.max(1.2, hh * 0.16); ctx.stroke(pb);
      ctx.fillStyle = sil; ctx.fill(ph);
      if (ar > 0.2 && W.dayFactor > 0.05) { ctx.globalAlpha = fl * ar * 0.6; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(0.6, hh * 0.05); ctx.stroke(pr); }
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  至高的山与圣殿（40—43）；殿中流出的河（47）
  // ════════════════════════════════════════════════════════════
  function MG() {
    const port = tall();
    const b0 = port ? 0.6 : 0.7, b1 = 1.08, p0 = port ? 0.715 : 0.79, p1 = port ? 0.995 : 0.978;
    const k = U.easeInOut(clamp(lv('ekMount'), 0, 1));
    const top = W.h * (port ? 0.605 : 0.53);
    const u = SU() * (port ? 0.85 : 0.82) * (W.w < 600 ? 1.15 : 1);
    return { port, b0, b1, p0, p1, k, top, u, xc: (p0 + p1) / 2 + 0.006 };
  }
  function mountY(G, xf) {
    const base = gY(2, xf) + 30 * G.u;
    const shp = sm(G.b0, G.p0, xf) * (1 - sm(G.p1 + 0.01, G.b1, xf));
    const bump = (Math.sin(xf * 41) * 0.5 + Math.sin(xf * 97) * 0.25) * 5 * G.u * (1 - sm(G.p0 - 0.01, G.p0 + 0.01, xf) * (1 - sm(G.p1 - 0.01, G.p1 + 0.01, xf)));
    const peak = lerp(base, G.top + bump, shp);
    return lerp(base, peak, G.k);
  }
  function drawMountain(ctx) {
    const G = MG();
    if (G.k < 0.004) return;
    const dk = 0.22;
    ctx.save();
    ctx.beginPath();
    const N = 60;
    for (let i = 0; i <= N; i++) { const xf = lerp(G.b0, G.b1, i / N), y = mountY(G, xf); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    ctx.lineTo(G.b1 * W.w, W.h); ctx.lineTo(G.b0 * W.w, W.h); ctx.closePath();
    const gr = ctx.createLinearGradient(0, G.top, 0, W.h * 0.9);
    gr.addColorStop(0, W.shadeCSS(mix([168, 150, 118], [120, 150, 96], 0.5 * lv('ekTrees')), dk, 1, 0.05));
    gr.addColorStop(1, W.shadeCSS([112, 100, 82], dk, 1));
    ctx.fillStyle = gr; ctx.fill();
    // 迎光的一道边
    ctx.strokeStyle = W.shadeCSS([255, 236, 200], dk, 0.5, 0.25); ctx.lineWidth = Math.max(1, 1.2 * G.u);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const xf = lerp(G.b0, G.b1, i / N), y = mountY(G, xf); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    ctx.stroke();
    // 岩层
    ctx.strokeStyle = W.shadeCSS([90, 78, 62], dk, 0.35); ctx.lineWidth = Math.max(0.8, 0.9 * G.u);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const xf = lerp(G.b0 + 0.02, G.b1 - 0.05, rt(i * 3 + 1100)), y0 = mountY(G, xf), yb = gY(2, xf);
      if (yb - y0 < 20) continue;
      const y = lerp(y0 + 8 * G.u, yb, 0.2 + 0.6 * rt(i * 3 + 1101)), L = (14 + 26 * rt(i * 3 + 1102)) * G.u;
      ctx.moveTo(xf * W.w, y); ctx.lineTo(xf * W.w + L, y + L * 0.12);
    }
    ctx.stroke();
    ctx.restore();
  }
  // 殿的几何：外墙、三座门楼、殿、廊与柱
  function templeGeom() {
    const G = MG(), u = G.u, py = G.top + 2 * u;
    const X0 = (G.p0 + 0.012) * W.w, X1 = (G.p1 - 0.012) * W.w, xc = G.xc * W.w;
    const gate = [X0 + 10 * u, xc - 44 * u, X1 - 10 * u];
    return {
      G, u, py, X0, X1, xc, gate,
      wallH: 22 * u, gateH: 38 * u, gateW: 20 * u,
      house: { x0: xc - 24 * u, x1: xc + 34 * u, top: py - 78 * u },
      porch: { x0: xc - 38 * u, x1: xc - 24 * u, top: py - 64 * u },
      pillars: [xc - 45 * u, xc - 41 * u],
    };
  }
  // 量度的线：一段一段依次画出（颜色如铜的人拿着麻绳和量度的竿）
  function templeLines(TG) {
    const u = TG.u, py = TG.py, L = [];
    const seg = (x0, y0, x1, y1) => L.push([x0, y0, x1, y1]);
    // 外墙
    seg(TG.X0, py, TG.X1, py); seg(TG.X0, py - TG.wallH, TG.X1, py - TG.wallH);
    seg(TG.X0, py, TG.X0, py - TG.wallH); seg(TG.X1, py, TG.X1, py - TG.wallH);
    for (const gx of TG.gate) { seg(gx - TG.gateW / 2, py, gx - TG.gateW / 2, py - TG.gateH); seg(gx - TG.gateW / 2, py - TG.gateH, gx + TG.gateW / 2, py - TG.gateH); seg(gx + TG.gateW / 2, py - TG.gateH, gx + TG.gateW / 2, py); }
    // 殿与廊
    const H = TG.house, P = TG.porch;
    seg(H.x0, py - TG.wallH, H.x0, H.top); seg(H.x0, H.top, H.x1, H.top); seg(H.x1, H.top, H.x1, py - TG.wallH);
    seg(P.x0, py - TG.wallH, P.x0, P.top); seg(P.x0, P.top, P.x1, P.top);
    for (const px of TG.pillars) seg(px, py - TG.wallH, px, P.top + 10 * u);
    // 至圣所：长二十肘，宽二十肘（41:4）
    seg(H.x1 - 20 * u, H.top, H.x1 - 20 * u, py - TG.wallH);
    return L;
  }
  function drawTemple(ctx) {
    const G = MG();
    if (G.k < 0.9) return;
    const ms = lv('ekMeasure'), tf = lv('ekTemple'), fill = lv('ekFill');
    if (ms < 0.001 && tf < 0.01) return;
    SP || sprites();
    const TG = templeGeom(), u = TG.u, py = TG.py, dk = 0.2;
    ctx.save();
    // 石与金（量完之后渐渐成形）
    if (tf > 0.01) {
      ctx.globalAlpha = tf;
      const stone = [236, 226, 204];
      ctx.fillStyle = W.shadeCSS(stone, dk, 1, 0.08 + 0.2 * fill);
      const H = TG.house, P = TG.porch;
      ctx.fillRect(H.x0, H.top, H.x1 - H.x0, py - H.top);
      ctx.fillStyle = W.shadeCSS(mix(stone, [255, 250, 236], 0.25), dk, 1, 0.1 + 0.2 * fill);
      ctx.fillRect(P.x0, P.top, P.x1 - P.x0, py - P.top);
      ctx.fillStyle = W.shadeCSS([226, 186, 104], dk, 1, 0.15 + 0.2 * fill);
      ctx.fillRect(P.x0 - 1 * u, P.top - 2.5 * u, H.x1 - P.x0 + 2 * u, 2.5 * u);
      ctx.fillRect(H.x0, H.top - 2.5 * u, H.x1 - H.x0, 2.5 * u);
      for (const px of TG.pillars) ctx.fillRect(px - 1.3 * u, P.top + 10 * u, 2.6 * u, py - P.top - 10 * u);
      // 外墙与门楼
      ctx.fillStyle = W.shadeCSS([214, 200, 170], dk, 1, 0.06 + 0.15 * fill);
      ctx.fillRect(TG.X0, py - TG.wallH, TG.X1 - TG.X0, TG.wallH);
      for (const gx of TG.gate) {
        ctx.fillStyle = W.shadeCSS([228, 214, 184], dk, 1, 0.08 + 0.15 * fill);
        ctx.fillRect(gx - TG.gateW / 2, py - TG.gateH, TG.gateW, TG.gateH);
        ctx.fillStyle = fill > 0.05 ? U.rgba(255, 236, 190, 0.6 + 0.4 * fill) : W.shadeCSS([46, 38, 30], dk, 0.9);
        ctx.beginPath(); ctx.moveTo(gx - 4.5 * u, py); ctx.lineTo(gx - 4.5 * u, py - 14 * u); ctx.arc(gx, py - 14 * u, 4.5 * u, Math.PI, 0); ctx.lineTo(gx + 4.5 * u, py); ctx.fill();
      }
      // 墙上的窗（荣光充满时，光自内透出）
      for (let i = 0; i < 3; i++) {
        const wx = H.x0 + (12 + i * 16) * u;
        ctx.fillStyle = fill > 0.05 ? U.rgba(255, 240, 200, 0.5 + 0.5 * fill) : W.shadeCSS([60, 50, 40], dk, 0.8);
        ctx.fillRect(wx, H.top + 12 * u, 3 * u, 8 * u);
      }
    }
    // 量度的光线
    if (ms > 0.001) {
      const L = templeLines(TG), n = L.length, f = ms * n;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(255,214,150)';
      const la = 1 - 0.75 * sm(0.5, 1, tf);
      for (const pass of [0, 1]) {
        ctx.lineWidth = pass ? Math.max(1, 1.1 * u) : Math.max(2, 4 * u);
        ctx.globalAlpha = la * (pass ? 0.9 : 0.2);
        ctx.beginPath();
        for (let i = 0; i < n && i < f; i++) {
          const s = L[i], t = Math.min(1, f - i);
          ctx.moveTo(s[0], s[1]); ctx.lineTo(lerp(s[0], s[2], t), lerp(s[1], s[3], t));
        }
        ctx.stroke();
      }
      // 正在量的那一点
      if (ms < 1) {
        const i = Math.min(n - 1, Math.floor(f)), s = L[i], t = f - i;
        const x = lerp(s[0], s[2], t), y = lerp(s[1], s[3], t), r = 14 * u;
        ctx.globalAlpha = 0.9; ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
      }
    }
    ctx.restore();
  }
  // 荣光充满了殿：殿发光，一道光柱
  function drawTempleGlory(ctx) {
    const fill = lv('ekFill');
    if (fill < 0.01) return;
    SP || sprites();
    const TG = templeGeom(), u = TG.u, H = TG.house;
    const cx = (H.x0 + H.x1) / 2, cy = H.top + 20 * u;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    let r = 170 * u;
    ctx.globalAlpha = fill * 0.5 * (0.9 + 0.1 * Math.sin(CLK * 1.1)); ctx.drawImage(SP.gold, cx - r, cy - r, 2 * r, 2 * r);
    r = 60 * u;
    ctx.globalAlpha = fill * 0.8; ctx.drawImage(SP.white, cx - r, cy - r, 2 * r, 2 * r);
    // 光柱
    const bw = 44 * u, top = -10;
    ctx.globalAlpha = fill * 0.32;
    ctx.save(); ctx.translate(cx, H.top); ctx.scale(1, -1); ctx.drawImage(SP.beam, -bw / 2, 0, bw, H.top - top); ctx.restore();
    // 光芒自三门射出
    ctx.strokeStyle = 'rgb(255,236,190)';
    for (const gx of TG.gate) {
      ctx.globalAlpha = fill * 0.2; ctx.lineWidth = Math.max(1, 1.2 * u);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { const an = Math.PI * (0.35 + 0.075 * i); ctx.moveTo(gx, TG.py - 10 * u); ctx.lineTo(gx + Math.cos(an) * 90 * u, TG.py - 10 * u + Math.sin(an) * 60 * u); }
      ctx.stroke();
    }
    ctx.restore();
  }
  // 以色列神的荣光从东而来（画面左边、日出之处），地就因他的荣耀发光
  function gloryEPos() {
    const e = U.easeInOut(clamp(lv('ekGloryE'), 0, 1)), TG = templeGeom();
    const x0 = W.w * 0.04, y0 = W.horizonY - W.h * 0.03, x1 = (TG.house.x0 + TG.house.x1) / 2, y1 = TG.house.top - 34 * TG.u;
    return [lerp(x0, x1, e), lerp(y0, y1, e) - Math.sin(Math.PI * e) * W.h * 0.2, e];
  }
  function drawGloryE(ctx) {
    const k = lv('ekGloryE');
    if (k < 0.002) return;
    SP || sprites();
    const [x, y, e] = gloryEPos(), u = SU();
    const a = sm(0, 0.06, k) * (1 - 0.6 * sm(0.9, 1, e) * lv('ekFill'));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    let r = 260 * u;
    ctx.globalAlpha = a * 0.45; ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
    r = 90 * u;
    ctx.globalAlpha = a * 0.95; ctx.drawImage(SP.white, x - r, y - r, 2 * r, 2 * r);
    // 他的声音如同多水的声音：一圈一圈的光波
    ctx.strokeStyle = 'rgb(255,236,200)';
    for (let i = 0; i < 3; i++) {
      const ph = U.fract(CLK * 0.4 + i / 3), rr = (40 + 200 * ph) * u;
      ctx.globalAlpha = a * 0.25 * (1 - ph); ctx.lineWidth = Math.max(1, 2 * u);
      ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.8, 0, 0, TAU); ctx.stroke();
    }
    // 地因他的荣耀发光：光下的一片大地
    const g0 = W.horizonY;
    if (e < 0.99) {
      const lw = W.w * 0.36, gr = ctx.createRadialGradient(x, W.h * 0.85, 0, x, W.h * 0.85, lw);
      gr.addColorStop(0, U.rgba(255, 224, 160, 0.34 * a)); gr.addColorStop(1, U.rgba(255, 214, 150, 0));
      ctx.globalAlpha = 1; ctx.fillStyle = gr; ctx.fillRect(x - lw, g0, 2 * lw, W.h - g0);
    }
    ctx.restore();
  }
  // 荣光之后，大地留下的一层暖光
  function drawShine(ctx) {
    const k = lv('ekFill') * 0.5 + sm(0.3, 1, lv('ekGloryE')) * 0.3;
    if (k < 0.01) return;
    const g0 = W.horizonY + W.h * 0.02;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(0, g0, 0, W.h);
    gr.addColorStop(0, U.rgba(255, 220, 160, 0)); gr.addColorStop(1, U.rgba(255, 214, 150, 0.12 * k));
    ctx.fillStyle = gr; ctx.fillRect(W.w * 0.35, g0, W.w * 0.65, W.h - g0);
    ctx.restore();
  }
  // 河的路：自东门的门槛下，下山，横过近地，流入海
  let RIV = null, RIVkey = '';
  function riverPath() {
    const G = MG(), key = W.w + 'x' + W.h + ':' + G.port + ':' + (G.k > 0.999 ? 1 : G.k.toFixed(3));
    if (RIV && RIVkey === key) return RIV;
    const TG = templeGeom(), port = G.port;
    const sx = (TG.gate[0] - 2 * TG.u) / W.w;
    const fld = (xf, k) => { const g = gY(2, xf); return g + (W.h - g) * k; };
    const pts = [
      [sx, TG.py],
      [sx - 0.012, lerp(TG.py, mountY(G, sx - 0.012), 0.3) + 10 * TG.u],
      [G.p0 - 0.03, mountY(G, G.p0 - 0.03) + 8 * TG.u],
    ];
    const near = port ? [[0.66, 0.1], [0.6, 0.3], [0.52, 0.48], [0.44, 0.66], [0.37, 0.86], [0.32, 1.02]]
      : [[0.735, 0.08], [0.68, 0.28], [0.61, 0.44], [0.53, 0.6], [0.46, 0.78], [0.405, 1.02]];
    for (const [xf, k] of near) pts.push([xf, fld(xf, k)]);
    // 平滑（Catmull-Rom）并按长度参数化
    const P = pts.map(p => [p[0] * W.w, p[1]]), out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let j = 0; j < 10; j++) {
        const t = j / 10, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        ]);
      }
    }
    out.push(P[P.length - 1]);
    const len = [0];
    for (let i = 1; i < out.length; i++) len.push(len[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
    const tot = len[len.length - 1] || 1;
    RIV = { pts: out, t: len.map(l => l / tot), tot };
    RIVkey = key;
    return RIV;
  }
  function riverAt(t) {
    const R = riverPath(), n = R.pts.length;
    let i = 1;
    while (i < n - 1 && R.t[i] < t) i++;
    const a = R.pts[i - 1], b = R.pts[i], k = clamp((t - R.t[i - 1]) / Math.max(1e-6, R.t[i] - R.t[i - 1]), 0, 1);
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), nx: -dy / L, ny: dx / L };
  }
  // 某一处（画面比例 xf）河心的纵深 v（给站在河里的人用）
  function riverV(xf) {
    const R = riverPath();
    let best = null;
    for (const p of R.pts) if (!best || Math.abs(p[0] - xf * W.w) < Math.abs(best[0] - xf * W.w)) best = p;
    const g = gY(2, xf), fh = fieldH(2, g);
    return fh > 1 ? clamp((best[1] - g) / (fh * 0.8), 0, 1) : 0;
  }
  const riverW = t => SU() * (2.2 + lv('ekWater') * (12 + 30 * t)) * (tall() ? 0.8 : 1);
  function drawRiver(ctx) {
    const fl = lv('ekFlow');
    if (fl < 0.004 || MG().k < 0.9) return;
    const R = riverPath(), n = R.pts.length;
    const left = [], right = [];
    for (let i = 0; i < n; i++) {
      const t = R.t[i];
      if (t > fl) break;
      const p = R.pts[i], q = R.pts[Math.min(n - 1, i + 1)], pp = R.pts[Math.max(0, i - 1)];
      const dx = q[0] - pp[0], dy = q[1] - pp[1], L = Math.hypot(dx, dy) || 1;
      const w = riverW(t) * (1 - sm(fl - 0.04, fl, t) * 0.7) / 2;
      left.push([p[0] - dy / L * w, p[1] + dx / L * w]); right.push([p[0] + dy / L * w, p[1] - dx / L * w]);
    }
    if (left.length < 2) return;
    const heal = lv('ekHeal');
    ctx.save();
    ctx.beginPath();
    left.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath();
    ctx.fillStyle = W.shadeCSS(mix([70, 126, 150], [84, 170, 170], heal), 0.05, 1, 0.12);
    ctx.fill();
    ctx.strokeStyle = W.shadeCSS([226, 240, 246], 0.05, 0.45, 0.3); ctx.lineWidth = Math.max(0.8, SU());
    ctx.stroke();
    // 流动的光（自殿往海）
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(236,250,255)'; ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const t = U.fract(rt(i + 1200) + CLK * 0.05);
      if (t > fl - 0.02) continue;
      const p = riverAt(t), w = riverW(t) * 0.35 * (rt(i + 1230) - 0.5) * 2;
      const q = riverAt(Math.min(1, t + 0.012));
      ctx.globalAlpha = 0.35 * Math.sin(Math.PI * U.fract(t * 7 + i * 0.3)) * (0.5 + 0.5 * W.daylight);
      ctx.lineWidth = Math.max(0.8, 1.2 * SU());
      ctx.beginPath(); ctx.moveTo(p.x + p.nx * w, p.y + p.ny * w); ctx.lineTo(q.x + p.nx * w, q.y + p.ny * w); ctx.stroke();
    }
    // 门槛下的泉源
    SP || sprites();
    const s0 = riverAt(0), r = 24 * SU();
    ctx.globalAlpha = 0.6; ctx.drawImage(SP.pale, s0.x - r, s0.y - r, 2 * r, 2 * r);
    ctx.restore();
  }
  // 河两岸的树木：其果可作食物，叶子乃为治病
  const RTREES = (function () { const a = []; for (let i = 0; i < 14; i++) a.push({ t: 0.3 + 0.64 * (i / 13) + 0.015 * (hsh(i) - 0.5), side: i % 2 ? 1 : -1, s: 0.85 + 0.35 * hsh(i * 3.7), d: hsh(i * 5.1) * 0.35 }); return a; })();
  function treePt(tr) {
    const p = riverAt(tr.t), off = (riverW(tr.t) * 0.5 + 9 * SU()) * tr.side;
    return [p.x + p.nx * off * 0.3, p.y + Math.abs(p.ny) * off];
  }
  function drawRiverTrees(ctx, back) {
    const k = lv('ekTrees');
    if (k < 0.004 || lv('ekFlow') < 0.3) return;
    const heal = lv('ekHeal');
    ctx.save();
    for (let i = 0; i < RTREES.length; i++) {
      const tr = RTREES[i];
      if ((tr.side < 0) !== back) continue;
      const g = clamp((k - tr.d) / 0.6, 0, 1);
      if (g < 0.01) continue;
      const [x, y] = treePt(tr), dz = clamp((y - W.horizonY) / (W.h - W.horizonY), 0, 1);
      const s = SU() * tr.s * (0.75 + 0.6 * dz) * (tall() ? 0.8 : 1) * U.easeOut(g);
      const h = 34 * s, cr = 14 * s;
      ctx.strokeStyle = W.shadeCSS([74, 56, 40], 0.05, 1); ctx.lineWidth = Math.max(1, 2.2 * s);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(i) * 2 * s, y - h * 0.62); ctx.stroke();
      const sway = Math.sin(CLK * 0.8 + i) * 1.2 * s;
      ctx.fillStyle = W.shadeCSS([62, 112, 66], 0.05, 1);
      ctx.beginPath();
      ctx.ellipse(x + sway, y - h * 0.78, cr, cr * 0.8, 0, 0, TAU);
      ctx.ellipse(x - cr * 0.6 + sway, y - h * 0.66, cr * 0.7, cr * 0.55, 0, 0, TAU);
      ctx.ellipse(x + cr * 0.65 + sway, y - h * 0.68, cr * 0.7, cr * 0.55, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = W.shadeCSS([128, 176, 104], 0.05, 0.7, 0.15);
      ctx.beginPath(); ctx.ellipse(x + sway - cr * 0.2, y - h * 0.86, cr * 0.6, cr * 0.36, 0, 0, TAU); ctx.fill();
      // 果子
      if (g > 0.7) {
        ctx.fillStyle = W.shadeCSS(i % 3 ? [236, 150, 70] : [214, 70, 70], 0.05, 1, 0.1);
        for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc(x + sway + (rt(i * 9 + j) - 0.5) * cr * 1.6, y - h * (0.64 + 0.26 * rt(i * 9 + j + 4)), Math.max(0.8, 1.5 * s), 0, TAU); ctx.fill(); }
      }
      // 叶子的微光（治病）
      if (heal > 0.2 && g > 0.9) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.25 * (0.6 + 0.4 * Math.sin(CLK * 1.3 + i)) * g;
        const r = cr * 1.6; ctx.drawImage(SP.leaf, x - r, y - h * 0.78 - r, 2 * r, 2 * r);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
  }
  // 飘落的叶子（叶子乃为治病）：纯装饰
  function drawLeaves(ctx) {
    const k = lv('ekTrees') * lv('ekHeal');
    if (k < 0.3) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgb(190,255,190)';
    for (let i = 0; i < 18; i++) {
      const tr = RTREES[i % RTREES.length], [x0, y0] = treePt(tr), ph = U.fract(CLK * 0.08 + rt(i + 1300));
      const x = x0 + Math.sin(ph * 6 + i) * 18 * SU() - ph * 40 * SU(), y = y0 - 30 * SU() + ph * 40 * SU();
      ctx.globalAlpha = k * 0.6 * Math.sin(Math.PI * ph);
      ctx.fillRect(x, y, 2 * SU(), 1.2 * SU());
    }
    ctx.restore();
  }
  // 海水变甜：自河口向海里铺开的一片青光
  function drawHeal(ctx, pass) {
    const k = lv('ekHeal');
    if (k < 0.01 || lv('ekFlow') < 0.9) return;
    const m = riverAt(1), R = (0.08 + 0.95 * U.easeOut(k)) * W.w;
    const y0 = pass === 'seaMid' ? W.waterlineY(0) : W.waterlineY(1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R);
    gr.addColorStop(0, U.rgba(110, 230, 210, 0.2 * k)); gr.addColorStop(0.6, U.rgba(90, 210, 200, 0.1 * k)); gr.addColorStop(1, U.rgba(80, 200, 200, 0));
    ctx.fillStyle = gr; ctx.fillRect(0, y0, W.w, W.h - y0);
    // 粼粼的光
    ctx.fillStyle = 'rgb(220,255,244)';
    for (let i = 0; i < 40; i++) {
      const x = rt(i * 3 + 1400) * W.w * 0.62, y = lerp(W.horizonY + 4, W.h, Math.pow(rt(i * 3 + 1401), 0.7));
      if (pass === 'seaMid' && y > W.waterlineY(1)) continue;
      if (pass === 'seaNear' && y < W.waterlineY(1)) continue;
      if (Math.hypot(x - m.x, y - m.y) > R) continue;
      const tw = Math.max(0, Math.sin(CLK * (1.5 + rt(i * 3 + 1402) * 2) + i));
      ctx.globalAlpha = k * tw * 0.6;
      const L = (3 + 6 * (y - W.horizonY) / (W.h - W.horizonY)) * SU();
      ctx.fillRect(x - L, y, 2 * L, 1);
    }
    ctx.restore();
  }
  // 渔夫晒网（47:10）
  function drawShoreNets(ctx) {
    const k = lv('ekNets2');
    if (k < 0.01) return;
    const u = LS(2), port = tall();
    const poles = port ? [0.345, 0.375, 0.405] : [0.415, 0.44, 0.465];
    ctx.save(); ctx.globalAlpha = k;
    ctx.strokeStyle = W.shadeCSS([96, 74, 54], 0, 1); ctx.lineWidth = Math.max(1, 1.4 * u);
    ctx.beginPath();
    for (const p of poles) { const g = gY(2, p); ctx.moveTo(p * W.w, g + 2); ctx.lineTo(p * W.w, g - 24 * u); }
    ctx.stroke();
    ctx.strokeStyle = W.shadeCSS([170, 156, 128], 0, 0.8); ctx.lineWidth = Math.max(0.6, 0.6 * u);
    for (let i = 0; i < poles.length - 1; i++) {
      const x0 = poles[i] * W.w, x1 = poles[i + 1] * W.w, y0 = gY(2, poles[i]) - 23 * u, y1 = gY(2, poles[i + 1]) - 23 * u, sag = 9 * u;
      ctx.beginPath();
      for (let r = 0; r < 5; r++) { const d = r * 3.2 * u; ctx.moveTo(x0, y0 + d); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + d + sag, x1, y1 + d); }
      for (let c = 0; c <= 7; c++) { const t = c / 7, x = lerp(x0, x1, t), y = lerp(y0, y1, t) + 4 * t * (1 - t) * sag; ctx.moveTo(x, y); ctx.lineTo(x, y + 13 * u); }
      ctx.stroke();
    }
    ctx.restore();
  }
  // 以西结趟水：水到他身上的高度
  function drawWade(ctx) {
    const k = lv('ekWade');
    if (k < 0.02) return;
    const f = fig('ezekiel');
    if (!f) return;
    const p0 = figPt('ezekiel', 0), p1 = figPt('ezekiel', k);
    if (!p0 || !p1) return;
    const h = p0[1] - p1[1], w = Math.max(10, (f._h || 40) * 0.55);
    ctx.save();
    ctx.fillStyle = W.shadeCSS([70, 126, 150], 0.05, 0.82, 0.12);
    ctx.beginPath(); ctx.ellipse(p0[0], p0[1], w, w * 0.22, 0, 0, TAU); ctx.fill();
    ctx.fillRect(p0[0] - w * 0.48, p1[1], w * 0.96, h);
    ctx.strokeStyle = W.shadeCSS([236, 248, 255], 0.05, 0.8, 0.3); ctx.lineWidth = Math.max(1, SU());
    ctx.beginPath(); ctx.ellipse(p1[0], p1[1], w * 0.5, w * 0.1, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  // 「耶和华的所在」
  const NAME = '耶和华的所在';
  function namePos() {
    const port = tall(), size = M() * (port ? 0.07 : 0.05);
    const TG = templeGeom();
    const x = port ? W.w * 0.6 : (TG.house.x0 + TG.house.x1) / 2 - W.w * 0.03;
    const y = port ? W.h * 0.46 : W.h * 0.2;
    return nameAt(x, y, size, 6).concat([size]);
  }
  function drawName(ctx) {
    const k = lv('ekName');
    if (k < 0.01) return;
    SP || sprites();
    const [x, y, size] = namePos(), gap = size * 1.08, chars = Array.from(NAME), x0 = x - gap * (chars.length - 1) / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const r = gap * 4.2;
    ctx.globalAlpha = k * 0.28; ctx.drawImage(SP.gold, x - r, y - r * 0.4, 2 * r, r * 0.8);
    ctx.font = '900 ' + size.toFixed(1) + 'px ' + FONT;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgb(255,200,120)';
    ctx.globalAlpha = k * 0.35;
    chars.forEach((ch, i) => { ctx.fillText(ch, x0 + i * gap + 1, y + 1); ctx.fillText(ch, x0 + i * gap - 1, y - 1); });
    ctx.fillStyle = 'rgb(255,246,224)';
    ctx.globalAlpha = k * 0.92;
    chars.forEach((ch, i) => ctx.fillText(ch, x0 + i * gap, y));
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxPush(b, e) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, e)); }
  function beam(b, xf, layer, o) {
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    fxPush(b, { type: 'beam', dur: o.dur || 6, xf, l, w: (o.w || 70) * SU(), k: o.k || 1 });
    if (o.ring !== false) fx().ring(xf * W.w, gY(l, xf) - 16 * LS(l), [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.nx, f.layer, o); }
  // 一点光自 A 飞到 B（A、B 为返回 [x, y] 的函数）
  function mote(b, A, B, o) { fxPush(b, Object.assign({ type: 'mote', dur: 2.6, A, B, c: [255, 232, 180], arc: 40 }, o || {})); }
  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam') {
        const env = sm(0, 0.15, q) * (1 - sm(0.6, 1, q)), x = e.xf * W.w, y = gY(e.l, e.xf);
        ctx.globalAlpha = env * 0.5 * e.k; ctx.drawImage(SP.beam, x - e.w / 2, -10, e.w, y + 10);
        ctx.globalAlpha = env * 0.55 * e.k; const g = e.w * 2.4; ctx.drawImage(SP.gold, x - g / 2, y - g * 0.45, g, g * 0.9);
      } else if (e.type === 'mote') {
        const A = e.A(), B = e.B();
        if (!A || !B) continue;
        const k = U.easeInOut(q), x = lerp(A[0], B[0], k), y = lerp(A[1], B[1], k) - Math.sin(k * Math.PI) * e.arc * u;
        const env = sm(0, 0.1, q) * (1 - sm(0.85, 1, q));
        for (let j = 0; j < 5; j++) {
          const kk = Math.max(0, k - j * 0.025), xx = lerp(A[0], B[0], kk), yy = lerp(A[1], B[1], kk) - Math.sin(kk * Math.PI) * e.arc * u;
          ctx.globalAlpha = env * 0.35 * (1 - j / 5); const g = (26 - j * 3) * u; ctx.drawImage(SP.gold, xx - g / 2, yy - g / 2, g, g);
        }
        ctx.globalAlpha = env; ctx.fillStyle = U.rgb(e.c[0], e.c[1], e.c[2]);
        ctx.beginPath(); ctx.arc(x, y, 2.2 * u, 0, TAU); ctx.fill();
      } else if (e.type === 'sprinkle') {
        // 清水洒在他们身上
        ctx.fillStyle = 'rgb(220,240,255)';
        for (let i = 0; i < 70; i++) {
          const x = lerp(e.x0, e.x1, rt(i * 3 + 1500)) * W.w, y0 = W.h * (0.25 + 0.2 * rt(i * 3 + 1501));
          const ph = clamp(q * 1.6 - rt(i * 3 + 1502) * 0.6, 0, 1);
          if (ph <= 0 || ph >= 1) continue;
          const g = gY(2, x / W.w), y = lerp(y0, g - 20 * u, ph);
          ctx.globalAlpha = Math.sin(Math.PI * ph) * 0.8;
          ctx.fillRect(x, y, 1.4 * u, 4 * u);
        }
      } else if (e.type === 'seek') {
        // 亲自寻找：一道光在地上缓缓走过
        const x = lerp(e.x0, e.x1, U.easeInOut(q)) * W.w, g = gY(2, x / W.w);
        const env = sm(0, 0.12, q) * (1 - sm(0.8, 1, q));
        let r = 110 * u; ctx.globalAlpha = env * 0.6; ctx.drawImage(SP.gold, x - r, g - 20 * u - r * 0.8, 2 * r, r * 1.6);
        r = 30 * u; ctx.globalAlpha = env * 0.9; ctx.drawImage(SP.white, x - r, g - 26 * u - r, 2 * r, 2 * r);
        ctx.globalAlpha = env * 0.28; ctx.drawImage(SP.beam, x - 30 * u, -10, 60 * u, g + 10);
      } else if (e.type === 'winds') {
        // 四方的风：四道光的气息自四方汇聚于平原
        const T0 = [[-0.05, 0.45], [1.05, 0.4], [0.62, -0.05], [0.3, 0.02]];
        if (e.sx != null) T0.push([e.sx, e.sy]);
        ctx.strokeStyle = 'rgb(236,244,255)'; ctx.lineCap = 'round';
        T0.forEach((o, j) => {
          for (let s = 0; s < 3; s++) {
            const k0 = clamp(q * 1.4 - s * 0.08 - j * 0.04, 0, 1);
            if (k0 <= 0) continue;
            const tx = lerp(0.5, 0.95, (j + 0.5) / T0.length), ty = 0.84;
            const pts = [];
            for (let i = 0; i <= 20; i++) {
              const t = Math.min(k0, i / 20);
              const x = lerp(o[0], tx, t) * W.w + Math.sin(t * 9 + s * 2 + j) * 30 * u * (1 - t), y = lerp(o[1], ty, t) * W.h + Math.cos(t * 7 + s + j) * 22 * u * (1 - t);
              pts.push([x, y]);
            }
            ctx.globalAlpha = 0.35 * (1 - sm(0.75, 1, q)) * (1 - s * 0.25);
            ctx.lineWidth = (2.4 - s * 0.6) * u;
            ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
            const hp = pts[pts.length - 1], g = 26 * u;
            ctx.globalAlpha = 0.5 * (1 - sm(0.75, 1, q)); ctx.drawImage(SP.pale, hp[0] - g, hp[1] - g, 2 * g, 2 * g);
          }
        });
      } else if (e.type === 'breath') {
        // 气息进入他们里面
        for (const [gid] of bodyGroups()) {
          members(gid).forEach((m, i) => {
            const p = memberPt(m, 0.15), ph = clamp(q * 1.5 - (i % 5) * 0.08, 0, 1);
            if (ph <= 0 || ph >= 1) return;
            const y = p[1] - (1 - ph) * 60 * u, g = 14 * u * (m.layer === 1 ? 0.6 : 1);
            ctx.globalAlpha = Math.sin(Math.PI * ph) * 0.8; ctx.drawImage(SP.pale, p[0] - g, y - g, 2 * g, 2 * g);
          });
        }
      } else if (e.type === 'flash') {
        const env = Math.pow(1 - q, 2), r = e.r * (0.6 + 0.8 * q);
        ctx.globalAlpha = env * 0.8; ctx.drawImage(SP.white, e.x - r, e.y - r, 2 * r, 2 * r);
      } else if (e.type === 'twig') {
        // 嫩枝：自荣耀之中，落在极高的山上
        const A = e.A(), G = cedarGeom(), B = [G.x, G.g - 6 * G.cu];
        const k = U.easeInOut(q), x = lerp(A[0], B[0], k), y = lerp(A[1], B[1], k) - Math.sin(Math.PI * k) * 20 * u;
        const env = sm(0, 0.1, q) * (1 - sm(0.9, 1, q));
        let g = 30 * u; ctx.globalAlpha = env * 0.7; ctx.drawImage(SP.gold, x - g, y - g, 2 * g, 2 * g);
        ctx.globalAlpha = env; ctx.strokeStyle = 'rgb(200,255,190)'; ctx.lineWidth = 1.4 * u;
        ctx.beginPath(); ctx.moveTo(x, y + 5 * u); ctx.lineTo(x, y - 5 * u); ctx.moveTo(x, y - 1 * u); ctx.lineTo(x + 3 * u, y - 4 * u); ctx.moveTo(x, y + 1 * u); ctx.lineTo(x - 3 * u, y - 2 * u); ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画面顶上的卷名：异象显现时退为淡影，不压在荣光上
  // ════════════════════════════════════════════════════════════
  const HUD = { k: 1, els: null };
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }
  function hudFade(dt) {
    const want = isCur() && !tall() && lv('ekCreat') > 0.4 && lv('ekGo') < 0.5 ? 0.3 : 1;
    if (want === 1 && HUD.k === 1) return;
    if (typeof document === 'undefined') return;
    if (!HUD.els) HUD.els = ['act', 'tools'].map(id => document.getElementById(id)).filter(Boolean);
    const k0 = HUD.k;
    HUD.k = approachLin(HUD.k, want, Math.max(0, dt) * 0.8);
    if (Math.abs(HUD.k - k0) < 1e-4 && HUD.k !== want) return;
    const f = HUD.k >= 0.999 ? '' : 'opacity(' + HUD.k.toFixed(3) + ')';
    for (const el of HUD.els) if (el.style.filter !== f) el.style.filter = f;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的调度
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {
      RIV = null;
      if (!isCur()) return;
      W.setOrigin('trees', W.w * 0.9, W.ridgeBaseY(2, W.w * 0.9));
    },
    update(dt) {
      U.safe('ezekiel.hud', () => hudFade(dt));
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      CLK += f;
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'far') { drawZig(ctx); drawFarHost(ctx); }
      else if (pass === 'mid') { drawTyre(ctx); drawJerusalem(ctx); drawCedar(ctx); drawSkeletons(ctx, 1); }
      else if (pass === 'seaMid') drawHeal(ctx, 'seaMid');
      else if (pass === 'seaNear') { drawHeal(ctx, 'seaNear'); drawMountain(ctx); drawTemple(ctx); }
      else if (pass === 'near') {
        drawChebar(ctx);
        const ca = campA();
        if (ca > 0.01) { drawTent(ctx, X.tentA, 1, ca); drawTent(ctx, X.tentB, 0.82, ca); X.poplar.forEach((p, i) => drawPoplar(ctx, p, ca, i + 3)); }
        drawRiverTrees(ctx, true);
        drawRiver(ctx);
        drawRiverTrees(ctx, false);
        drawShoreNets(ctx);
        drawSkeletons(ctx, 2);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'mid') { drawWaves(ctx); drawNets(ctx); drawSmokeCol(ctx); drawNest(ctx); }
      else if (pass === 'near') drawVision(ctx);
      else if (pass === 'air') {
        drawShine(ctx); drawTempleGlory(ctx); drawGloryE(ctx); drawGloryM(ctx); drawMarks(ctx);
        drawSeerLight(ctx); drawScroll(ctx); drawHearts(ctx); drawWade(ctx); drawLeaves(ctx); drawName(ctx); drawFX(ctx);
      }
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      const V = VG();
      if (lv('ekCloud') > 0.5 && V.a > 0.5) {
        if (lv('ekCreat') > 0.4) for (const c of CREAT) { const p = vp(V, c[0], c[1] - 150); cand('活物', p[0], p[1]); }
        if (lv('ekWheel') > 0.4) for (const w of WHEELS) { const p = vp(V, w[0], w[1]); cand('轮', p[0], p[1]); }
        if (lv('ekThrone') > 0.4) { const p = vp(V, 0, -380); cand('宝座', p[0], p[1]); }
        if (lv('ekBow') > 0.4) { const p = vp(V, 0, -590); cand('虹', p[0], p[1]); }
      }
      if (lv('ekScroll') > 0.5 && lv('ekEat') < 0.5) { const p = scrollPos(); cand('书卷', p[0], p[1]); }
      if (campA() > 0.5) { cand('迦巴鲁河', 0.8 * W.w, chebarY(0.8)); cand('帐棚', X.tentA * W.w, gY(2, X.tentA) - 10 * LS(2)); }
      if (cityA() > 0.5) {
        const T0 = templeGeomM();
        cand(lv('ekRuin') > 0.5 ? '被攻破的城' : '耶路撒冷', 0.76 * W.w, gY(1, 0.76) - 14 * T0.cu);
        cand('圣殿', T0.x, T0.top + 10 * T0.cu);
        if (lv('ekGlory') > 0.5) { const p = gloryPt(lv('ekGloryP')); cand('耶和华的荣耀', p[0], p[1]); }
      }
      if (lv('ekCedar') > 0.5 && lv('ekHide') < 0.5) { const G = cedarGeom(); cand('香柏树', G.x, G.g - G.H * 0.5); }
      if (lv('ekTyre') > 0.5 && lv('ekHide') < 0.5) cand(lv('ekFall') > 0.6 ? '磐石' : '泰尔', 0.52 * W.w, tyreTop() - 12 * CU());
      if (lv('ekBones') > 0.5 && lv('ekFlesh') < 0.5) for (const s of SKEL.near) { const F = skelFrame(s, 2); cand('骸骨', F.x, F.y - 4); }
      if (MG().k > 0.8) {
        const TG = templeGeom();
        cand('至高的山', TG.xc, (TG.py + gY(2, TG.xc / W.w)) / 2);
        if (lv('ekTemple') > 0.5) cand('殿', (TG.house.x0 + TG.house.x1) / 2, TG.house.top + 20 * TG.u);
      }
      if (lv('ekFlow') > 0.5) { const p = riverAt(0.62); cand('河', p.x, p.y); }
      if (lv('ekTrees') > 0.5) for (const tr of RTREES) { const p = treePt(tr); cand('树木', p[0], p[1] - 20 * SU()); }
      if (lv('ekHeal') > 0.5) cand('海', W.w * 0.3, W.h * 0.9);
      if (lv('ekName') > 0.5) { const p = namePos(); cand('耶和华的所在', p[0], p[1]); }
      return best;
    },
    sig() {
      const out = [];
      const cr = GS.cast && GS.cast.crowds;
      if (cr) for (const [g, o] of cr) { const ms = o.members.filter(m => !m.dying); if (ms.length) out.push(g + ':' + ms[0].pose + ':' + (ms[0].glow > 0.1 ? 1 : 0)); }
      return { crowds: out.sort().join(',') };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：迦巴鲁河边，被掳的人中（1:1）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; S = fresh(); RIV = null; }
  function setup() {
    // 迦勒底的平原：干旱，草稀，河边几棵白杨
    W.set('bare', 0.5, true); W.set('bloom', 0.2, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.5, herbs: 0.35, trees: 0.1, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('ekCamp', 1, true); W.set('ekZig', 1, true);
    W.setOrigin('trees', W.w * 0.9, W.ridgeBaseY(2, W.w * 0.9));
    W.freeClock = false;
    W.goTo(0.62, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 12, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    avoid([0.38, 0.62]);
    const c = C();
    c.clear({ fade: false });
    add('ezekiel', { label: '以西结', sex: 'm', age: 'adult', x: X.ezek, facing: 1, robe: ROBE.ezek, glow: 0.4, pose: 'sit', from: 'none', beard: true, prop: null });
    placeCrowd('exiles', { layer: 2, label: '被掳的人', from: 'none', pose: 'sit', robes: CROWD_A },
      [[0.414, 0.22, 1], [0.432, 0.36, 1, 'elder'], [0.447, 0.18, -1], [0.462, 0.3, 1, 'child'], [0.478, 0.24, 1], [0.49, 0.4, -1, 'elder']]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '当三十年四月初五日，以西结在迦巴鲁河边被掳的人中……', ref: '以西结书 1:1', hold: 5.5 },
    { text: '在迦勒底人之地、迦巴鲁河边，耶和华的话特特临到布西的儿子祭司以西结；<br>耶和华的灵降在他身上。', ref: '以西结书 1:3', hold: 7 },
  ];
  const V1 = [
    { text: '我观看，见狂风从北方刮来，随着有一朵包括闪烁火的大云，周围有光辉；<br>从其中的火内发出好像光耀的精金。', ref: '以西结书 1:4', hold: 8 },
    { text: '又从其中显出四个活物的形象来。他们的形状是这样：有人的形象，<br>各有四个脸面，四个翅膀。', ref: '以西结书 1:5–6', hold: 7 },
    { text: '至于四活物的形象，就如烧着火炭的形状，又如火把的形状。<br>火在四活物中间上去下来，这火有光辉，从火中发出闪电。', ref: '以西结书 1:13', hold: 7.5 },
  ];
  const V2 = [
    { text: '我正观看活物的时候，见活物的脸旁各有一轮在地上。……<br>形状和作法好像轮中套轮。……四个轮辋周围满有眼睛。', ref: '以西结书 1:15–18', hold: 7.5 },
    { text: '在他们头以上的穹苍之上有宝座的形象，仿佛蓝宝石；<br>在宝座形象以上有仿佛人的形状。', ref: '以西结书 1:26', hold: 6.5 },
    { text: '下雨的日子，云中虹的形状怎样，周围光辉的形状也是怎样。这就是耶和华荣耀的形象。<br>我一看见就俯伏在地，又听见一位说话的声音。', ref: '以西结书 1:28', hold: 8.5 },
  ];
  const V3 = [
    { text: '他对我说话的时候，灵就进入我里面，使我站起来，<br>我便听见那位对我说话的声音。', ref: '以西结书 2:2', hold: 6 },
    { text: '他对我说：「人子啊，我差你往悖逆的国民以色列人那里去……<br>他们或听，或不听……必知道在他们中间有了先知。」', ref: '以西结书 2:3–5', hold: 7.5 },
    { text: '我观看，见有一只手向我伸出来，手中有一书卷。<br>他将书卷在我面前展开，内外都写着字，其上所写的有哀号、叹息、悲痛的话。', ref: '以西结书 2:9–10', hold: 8 },
  ];
  const V4 = [
    { text: '又对我说：「人子啊，要吃我所赐给你的这书卷，充满你的肚腹。」<br>我就吃了，口中觉得其甜如蜜。', ref: '以西结书 3:3', hold: 6.5 },
    { text: '那时，灵将我举起，我就听见在我身后有震动轰轰的声音，说：<br>「从耶和华的所在显出来的荣耀是该称颂的！」', ref: '以西结书 3:12', hold: 7 },
    { text: '我就来到提勒‧亚毕，住在迦巴鲁河边被掳的人那里……<br>在他们中间忧忧闷闷地坐了七日。', ref: '以西结书 3:15', hold: 6.5 },
    { text: '「人子啊，我立你作以色列家守望的人，<br>所以你要听我口中的话，替我警戒他们。」', ref: '以西结书 3:17', hold: 6 },
  ];
  const V5 = [
    { text: '……灵就将我举到天地中间，在神的异象中，带我到耶路撒冷……', ref: '以西结书 8:3', hold: 5.5 },
    { text: '耶和华对他说：「你去走遍耶路撒冷全城，<br>那些因城中所行可憎之事叹息哀哭的人，画记号在额上。」', ref: '以西结书 9:4', hold: 7 },
    { text: '耶和华的荣耀从殿的门槛那里出去，停在基路伯以上。<br>基路伯出去的时候，就展开翅膀，在我眼前离地上升……都停在耶和华殿的东门口。', ref: '以西结书 10:18–19', hold: 8 },
    { text: '耶和华的荣耀从城中上升，停在城东的那座山上。', ref: '以西结书 11:23', hold: 5.5 },
  ];
  const V6 = [
    { text: '主耶和华如此说：「我要将香柏树梢拧去栽上，<br>就是从尽尖的嫩枝中折一嫩枝，栽于极高的山上……」', ref: '以西结书 17:22', hold: 7 },
    { text: '「在以色列高处的山栽上。它就生枝子，结果子，成为佳美的香柏树，<br>各类飞鸟都必宿在其下，就是宿在枝子的荫下。」', ref: '以西结书 17:23', hold: 8 },
    { text: '「田野的树木都必知道我耶和华使高树矮小，矮树高大；<br>青树枯干，枯树发旺。我耶和华如此说，也如此行了。」', ref: '以西结书 17:24', hold: 7.5 },
  ];
  const V7 = [
    { text: '你居住海口，是众民的商埠……泰尔啊，你曾说：我是全然美丽的。', ref: '以西结书 27:3', hold: 5.5 },
    { text: '「……因你心里高傲，说：我是神；我在海中坐神之位。<br>你虽然居心自比神，也不过是人，并不是神！」', ref: '以西结书 28:2', hold: 7 },
    { text: '所以，主耶和华如此说：泰尔啊，我必与你为敌，<br>使许多国民上来攻击你，如同海使波浪涌上来一样。', ref: '以西结书 26:3', hold: 7 },
    { text: '我必使你成为净光的磐石，作晒网的地方。<br>你不得再被建造，因为这是主耶和华说的。', ref: '以西结书 26:14', hold: 6.5 },
  ];
  const V8 = [
    { text: '我们被掳之后十二年十月初五日，有人从耶路撒冷逃到我这里，说：「城已攻破。」', ref: '以西结书 33:21', hold: 6.5 },
    { text: '「……这些羊在密云黑暗的日子散到各处，我必从那里救回它们来。……<br>我必亲自作我羊的牧人，使它们得以躺卧。」', ref: '以西结书 34:12–15', hold: 7.5 },
    { text: '「失丧的，我必寻找；被逐的，我必领回；受伤的，我必缠裹；有病的，我必医治……」', ref: '以西结书 34:16', hold: 6.5 },
    { text: '「……我也必叫时雨落下，必有福如甘霖而降。」', ref: '以西结书 34:26', hold: 5 },
  ];
  const V9 = [
    { text: '我必从各国收取你们，从列邦聚集你们，引导你们归回本地。<br>我必用清水洒在你们身上，你们就洁净了。', ref: '以西结书 36:24–25', hold: 7.5 },
    { text: '我也要赐给你们一个新心，将新灵放在你们里面，<br>又从你们的肉体中除掉石心，赐给你们肉心。', ref: '以西结书 36:26', hold: 7.5 },
    { text: '他们必说：「这先前为荒废之地，现在成如伊甸园……」', ref: '以西结书 36:35', hold: 5.5 },
  ];
  const V10 = [
    { text: '耶和华的灵降在我身上。耶和华藉他的灵带我出去，<br>将我放在平原中；这平原遍满骸骨。', ref: '以西结书 37:1', hold: 7 },
    { text: '他使我从骸骨的四围经过，谁知在平原的骸骨甚多，而且极其枯干。', ref: '以西结书 37:2', hold: 6 },
    { text: '他对我说：「人子啊，这些骸骨能复活吗？」<br>我说：「主耶和华啊，你是知道的。」', ref: '以西结书 37:3', hold: 6.5 },
  ];
  const V11 = [
    { text: '「……主耶和华对这些骸骨如此说：我必使气息进入你们里面，你们就要活了。<br>我必给你们加上筋，使你们长肉，又将皮遮蔽你们……」', ref: '以西结书 37:5–6', hold: 8 },
    { text: '于是，我遵命说预言。正说预言的时候，不料，有响声，有地震；骨与骨互相联络。', ref: '以西结书 37:7', hold: 6.5 },
    { text: '我观看，见骸骨上有筋，也长了肉，又有皮遮蔽其上，只是还没有气息。', ref: '以西结书 37:8', hold: 6.5 },
  ];
  const V12 = [
    { text: '主对我说：「人子啊，你要发预言，向风发预言，说主耶和华如此说：<br>气息啊，要从四方而来，吹在这些被杀的人身上，使他们活了。」', ref: '以西结书 37:9', hold: 8.5 },
    { text: '于是我遵命说预言，气息就进入骸骨，骸骨便活了，<br>并且站起来，成为极大的军队。', ref: '以西结书 37:10', hold: 7 },
    { text: '「我必将我的灵放在你们里面，你们就要活了。我将你们安置在本地……」', ref: '以西结书 37:14', hold: 6 },
  ];
  const V13 = [
    { text: '在神的异象中带我到以色列地，安置在至高的山上……<br>见有一人，颜色如铜，手拿麻绳和量度的竿，站在门口。', ref: '以西结书 40:2–3', hold: 8 },
    { text: '以色列神的荣光从东而来。他的声音如同多水的声音；<br>地就因他的荣耀发光。', ref: '以西结书 43:2', hold: 6.5 },
    { text: '耶和华的荣光从朝东的门照入殿中。灵将我举起，带入内院，<br>不料，耶和华的荣光充满了殿。', ref: '以西结书 43:4–5', hold: 7 },
    { text: '他带我回到殿门，见殿的门槛下有水往东流出……', ref: '以西结书 47:1', hold: 5 },
  ];
  const V14 = [
    { text: '他手拿准绳往东出去的时候，量了一千肘，使我趟过水，水到踝子骨。<br>……水就到膝；……水便到腰；……水便成了河，使我不能趟过。', ref: '以西结书 47:3–5', hold: 7.5 },
    { text: '这河水所到之处，凡滋生的动物都必生活，<br>并且因这流来的水必有极多的鱼，海水也变甜了。', ref: '以西结书 47:9', hold: 6.5 },
    { text: '在河这边与那边的岸上必生长各类的树木……<br>树上的果子必作食物，叶子乃为治病。', ref: '以西结书 47:12', hold: 6.5 },
    { text: '从此以后，这城的名字必称为「耶和华的所在」。', ref: '以西结书 48:35', hold: 6 },
  ];

  // ── 情节的助手 ───────────────────────────────────────────────
  // 骸骨长了肉：躺着的身体，与骸骨同一处
  function bodies(b) {
    for (const [gid, l, g] of bodyGroups()) {
      if (hasCrowd(gid)) continue;
      const list = (l === 2 ? SKEL.near : SKEL.mid).slice(g[0], g[1]);
      placeCrowd(gid, { layer: l, label: '被杀的人', from: b.instant ? 'none' : 'fade', pose: 'lie', glow: 0, robes: MUTED }, list.map(s => [s.x, s.v, s.f]));
    }
  }
  function flashAt(b, x, y, r) { fxPush(b, { type: 'flash', dur: 1.8, x, y, r }); }
  // 先前的布景（帐棚、城、泰尔、羊群……）都隐去：灵带他到平原（37:1）
  function clearScene(b) {
    W.set('ekHide', 1, b.instant);
    W.set('ekZig', 0, b.instant);
    for (const g of ['exiles', 'folk', 'jer', 'flock', 'fishers']) uncrowd(g);
    for (const id of ['fugitive', 'shepherd', 'lost1', 'lost2', 'linen']) rm(id);
    W.set('ekStone', 0, b.instant); W.set('ekHeart', 0, b.instant);
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每句话的经文不过四行，它的故事约三十秒：一按一放，便是一步）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 天就开了：狂风、大云、四活物 ─────────────────────
    {
      kind: 'act', utter: '天就开了，得见神的异象', cmd: 'open /heavens --at 迦巴鲁河  # 狂风从北方刮来', ref: '1:1', tint: [255, 226, 170],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.set('storm', 0.62, b.instant); W.set('gale', 0.55, b.instant); W.set('clouds', 0.9, b.instant);
            W.set('ekCloud', 1, b.instant); W.set('ekNear', 1, b.instant);
            avoid([0.38, 1.02]);
            sfx(b, 'wind');
          }],
          [1.5, b => { pose('ezekiel', 'stand'); face('ezekiel', 1); if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.93 }); sfx(b, 'thunder', { far: true }); }],
          [3.5, () => pose('ezekiel', 'gaze')],
          [L[1] - 0.6, b => { W.set('ekCreat', 1, b.instant); sfx(b, 'wings'); if (!b.instant) { const V = VG(), p = vp(V, 0, -150); flashAt(b, p[0], p[1], 260 * V.s); } }],
          [L[2] - 0.4, b => { W.set('ekFire', 1, b.instant); sfx(b, 'fire'); }],
          [L[2] + 2.5, b => sfx(b, 'thunder', { soft: true })],
        ]);
      },
    },
    // ── 2 · 这就是耶和华荣耀的形象：轮、穹苍、宝座、虹 ─────────
    {
      kind: 'act', utter: '这就是耶和华荣耀的形象', cmd: 'render 荣耀 --wheels 轮中套轮 --halo 虹', ref: '1:28', hold: 3, tint: [210, 226, 255],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => { W.set('ekWheel', 1, b.instant); sfx(b, 'wings'); }],
          [L[1] - 0.4, b => { W.set('ekFirm', 1, b.instant); sfx(b, 'stars', { soft: true }); }],
          [L[1] + 1.8, b => { W.set('ekThrone', 1, b.instant); sfx(b, 'angel'); }],
          [L[2] - 0.5, b => { W.set('rain', 0.22, b.instant); W.set('ekBow', 1, b.instant); sfx(b, 'harp'); }],
          [L[2] + 3.4, () => pose('ezekiel', 'fall')],
        ]);
      },
    },
    // ── 3 · 人子啊，你站起来：灵进入他里面；书卷 ────────────────
    {
      kind: 'call', utter: '人子啊，你站起来，我要和你说话', cmd: 'spirit.enter 人子 && stand', ref: '2:1',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => mote(b, () => { const V = VG(); return vp(V, 0, -420); }, () => figPt('ezekiel', 0.4), { dur: 2.4, arc: 10 })],
          [2.4, b => { pose('ezekiel', 'stand'); glow('ezekiel', 0.65); if (!b.instant) { const p = figPt('ezekiel', 0.5); if (p) fx().sparkle(p[0], p[1], 24, [255, 240, 210], 12, 'top'); } sfx(b, 'harp'); }],
          [L[1], () => { face('ezekiel', -1); crowdFace('exiles', (m, i) => (i % 2 ? -1 : 1)); crowdPose('exiles', 'sit'); }],
          [L[1] + 2.5, () => pose('ezekiel', 'point')],
          [L[2] - 0.6, b => { pose('ezekiel', 'stand'); face('ezekiel', 1); W.set('ekScroll', 1, b.instant); }],
          [L[2] + 3.6, b => {
            if (b.instant) return;
            const p = scrollPos(), size = M() * (tall() ? 0.042 : 0.03);
            ['哀号', '叹息', '悲痛'].forEach((s, i) => {
              const c0 = nameAt(p[0] + (i - 1) * size * 3.2, p[1] - size * 1.6 - (i === 1 ? size * 0.8 : 0), size, 2);
              fx().nameStr(s, c0[0], c0[1], size, [236, 214, 186], () => [p[0] + rand(-20, 20), p[1] + rand(-8, 8)], { delay: i * 0.7, hold: 1.8, dot: 1.6 });
            });
            chime('哀');
          }],
        ]);
      },
    },
    // ── 4 · 要吃这书卷：其甜如蜜；异象离去；坐了七日；守望的人 ───────
    {
      kind: 'cmd', utter: '人子啊，要吃我所赐给你的这书卷', cmd: 'eat 书卷 --taste 蜜  # 哀号、叹息、悲痛', ref: '3:3',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => { W.set('ekScroll', 1, true); pose('ezekiel', 'raise'); W.set('ekEat', 1, b.instant); }],
          [4.2, b => {
            pose('ezekiel', 'stand'); glow('ezekiel', 0.75);
            if (!b.instant) { const p = figPt('ezekiel', 0.85); if (p) fx().sparkle(p[0], p[1], 30, [255, 214, 120], 14, 'top'); }
          }],
          [L[1] - 0.2, b => {
            fly('ezekiel', X.ezek + 0.012, liftY(X.ezek + 0.012, 0.09), { dur: 2.5 });
            W.set('ekGo', 1, b.instant);
            W.set('storm', 0, b.instant); W.set('gale', 0.12, b.instant); W.set('rain', 0, b.instant); W.set('clouds', 0.4, b.instant);
            sfx(b, 'thunder'); sfx(b, 'wind');
            if (!b.instant) W.shake = 0.5;
          }],
          [L[2] - 0.6, b => { fly('ezekiel', X.ezek, null, { dur: 2.2 }); glow('ezekiel', 0.45); }],
          [L[2] + 1.8, b => { pose('ezekiel', 'sit'); face('ezekiel', -1); crowdFace('exiles', 1); W.goTo(0.34, 7.5, b.instant); }],
          // 异象已远去：收起它的一切
          [L[3] - 0.4, b => {
            for (const k of ['ekCloud', 'ekNear', 'ekCreat', 'ekFire', 'ekWheel', 'ekFirm', 'ekThrone', 'ekBow', 'ekGo', 'ekScroll', 'ekEat']) W.set(k, 0, true);
            pose('ezekiel', 'stand'); walk('ezekiel', X.ezek + 0.02, { speed: 0.02, pose: 'gaze' });
            beamOn(b, 'ezekiel', { dur: 5, k: 0.5, ring: false });
          }],
        ]);
      },
    },
    // ── 5 · 画记号在额上：神的异象中的耶路撒冷；荣耀离去 ─────────
    {
      kind: 'cmd', utter: '叹息哀哭的人，画记号在额上', cmd: 'mark --forehead 叹息哀哭的人 && glory.depart --east', ref: '9:4',
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.set('ekCity', 1, b.instant); W.set('ekZig', 0, b.instant); W.set('ekGlory', 1, b.instant); W.set('ekGloryP', 0, true); W.set('ekMark', 0, true);
            placeCrowd('jer', { layer: 1, label: '城中的人', from: b.instant ? 'none' : 'fade', robes: CROWD_A },
              [[0.724, 0.2, 1], [0.742, 0.4, -1], [0.767, 0.15, 1], [0.816, 0.35, -1], [0.834, 0.12, 1], [0.858, 0.42, -1], [0.925, 0.2, 1], [0.946, 0.38, -1], [0.965, 0.16, 1]]);
            pose('ezekiel', 'stand');
            fly('ezekiel', 0.56, liftY(0.56, 0.13), { dur: 3 });
            glow('ezekiel', 0.7);
            if (!b.instant) { const T0 = templeGeomM(); flashAt(b, T0.x - 60 * T0.cu, T0.top, 260 * T0.cu); }
            sfx(b, 'wind', { soft: true });
          }],
          [3.2, () => face('ezekiel', 1)],
          [L[1] - 0.3, b => add('linen', { label: '穿细麻衣的人', sex: 'm', age: 'adult', layer: 1, x: X.gateE + 0.004, facing: 1, angel: true, robe: ROBE.linen, glow: 0.7, from: b.instant ? 'none' : 'light', prop: null })],
          [L[1] + 1, b => { walk('linen', 0.975, { speed: 0.022 }); W.set('ekMark', 1, b.instant); }],
          [L[1] + 5, () => crowdPose('jer', 'bow')],
          [L[2] - 0.5, b => { W.set('ekGloryP', 2, b.instant); sfx(b, 'wings'); }],
          [L[2] + 5.5, b => { rm('linen'); crowdPose('jer', 'stand'); }],
          [L[3] - 0.5, b => { W.set('ekGloryP', 3, b.instant); W.set('ekDim', 1, b.instant); sfx(b, 'wind', { soft: true }); }],
          [L[3] + 3.6, b => { fly('ezekiel', X.ezek, null, { dur: 2.5 }); glow('ezekiel', 0.4); }],
        ]);
      },
    },
    // ── 6 · 我要将香柏树梢拧去栽上 ───────────────────────────
    {
      kind: 'promise', utter: '我要将香柏树梢拧去栽上', cmd: 'plant 嫩枝 --on 极高的山  # 飞鸟宿在其下', ref: '17:22', tint: [214, 240, 200],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => { fxPush(b, { type: 'twig', dur: 2.6, A: () => gloryPt(3) }); sfx(b, 'harp'); pose('ezekiel', 'gaze'); }],
          [2.6, b => { W.set('ekCedar', 0.05, b.instant); if (!b.instant) { const G = cedarGeom(); fx().sparkle(G.x, G.g - 4, 20, [220, 255, 200], 10, 'mid'); } }],
          [3.6, b => { W.set('ekGlory', 0, b.instant); }],
          [L[1] - 1.2, b => { W.set('ekCedar', 1, b.instant); }],
          [L[1] + 5, b => { W.set('ekNest', 1, b.instant); sfx(b, 'bird'); }],
          [L[2], b => { W.set('trees', 0.42, b.instant); W.set('grass', 0.75, b.instant); W.set('bloom', 0.5, b.instant); W.set('bare', 0.3, b.instant); sfx(b, 'bird'); }],
          [L[2] + 4, () => pose('ezekiel', 'stand')],
        ]);
      },
    },
    // ── 7 · 泰尔啊，我必与你为敌 ─────────────────────────────
    {
      kind: 'judge', utter: '泰尔啊，我必与你为敌', cmd: 'sink 泰尔 --by 波浪  # 作晒网的地方', ref: '26:3', tint: [255, 214, 190],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.set('ekTyre', 1, b.instant); W.goTo(0.5, 4, b.instant);
            if (!b.instant) { const cu = CU(); flashAt(b, 0.525 * W.w, tyreTop() - 20 * cu, 120 * cu); }
          }],
          [L[1], b => { W.set('ekPride', 1, b.instant); sfx(b, 'chime'); }],
          [L[2] - 0.3, b => {
            W.set('ekPride', 0, b.instant); W.set('ekWave', 1, b.instant);
            W.set('gale', 0.85, b.instant); W.set('storm', 0.45, b.instant); W.set('clouds', 0.85, b.instant);
            sfx(b, 'thunder'); sfx(b, 'splash', { size: 2 });
            if (!b.instant) W.shake = 0.4;
          }],
          [L[2] + 2.4, b => { W.set('ekFall', 1, b.instant); sfx(b, 'build'); sfx(b, 'splash', { size: 2 }); }],
          [L[2] + 4.6, b => { if (!b.instant) { const cu = CU(); fx().dust(0.53 * W.w, tyreTop(), 40, [220, 206, 180], 30 * cu); } sfx(b, 'thunder', { soft: true }); }],
          [L[3] - 0.4, b => {
            W.set('gale', 0.1, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.45, b.instant); W.set('ekWave', 0, b.instant);
            W.set('ekNets', 1, b.instant); W.goTo(0.72, 6, b.instant);
          }],
        ]);
      },
    },
    // ── 8 · 我必亲自寻找我的羊：城已攻破；四散的羊 ────────────────
    {
      kind: 'promise', utter: '我必亲自寻找我的羊', cmd: 'find 羊 --lost --scattered  # 我必亲自', ref: '34:11',
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.34, 5, b.instant);
            add('fugitive', { label: '逃来的人', sex: 'm', age: 'adult', x: 1.04, facing: -1, robe: ROBE.fugitive, glow: 0.15, from: 'none', prop: null });
            run('fugitive', X.ezek + 0.028, { speed: 0.09 });
            avoid([0.38, 1.02]);
          }],
          [1.5, b => { W.set('ekRuin', 1, b.instant); W.set('ekDim', 1, b.instant); uncrowd('jer'); sfx(b, 'thunder', { far: true }); }],
          [6.2, () => { pose('fugitive', 'kneel'); face('fugitive', -1); pose('ezekiel', 'stand'); face('ezekiel', 1); }],
          [7.2, b => { pose('ezekiel', 'raise'); glow('ezekiel', 0.6); sfx(b, 'weep'); }],
          [L[1] - 1, b => {
            W.set('gloom', 0.32, b.instant); W.set('clouds', 0.95, b.instant); W.set('storm', 0.3, b.instant);
            placeCrowd('flock', { kind: 'sheep', label: '羊', from: b.instant ? 'none' : 'fade', pose: 'stand' },
              [[0.56, 0.62, 1], [0.64, 0.12, -1], [0.7, 0.5, 1], [0.77, 0.2, -1], [0.84, 0.66, 1], [0.9, 0.3, -1], [0.95, 0.52, 1]], true);
            animal('lost1', 'sheep', 0.985, { facing: 1, from: b.instant ? 'none' : 'fade', label: '失丧的羊', v: 0.1 });
            animal('lost2', 'lamb', 0.535, { facing: -1, from: b.instant ? 'none' : 'fade', label: '受伤的羊', v: 0.78, pose: 'lie' });
            walk('fugitive', 0.455, { speed: 0.03, pose: 'sit' });
            pose('ezekiel', 'stand');
            sfx(b, 'bleat');
          }],
          [L[1] + 1.2, b => { fxPush(b, { type: 'seek', dur: 8, x0: 1.02, x1: 0.66 }); }],
          [L[1] + 3.5, () => { crowdWalk('flock', 0.62, 0.74, { speed: 0.028, pose: 'lie' }); }],
          [L[2] - 0.4, b => { walk('lost1', 0.752, { speed: 0.035, pose: 'lie' }); fxPush(b, { type: 'seek', dur: 5, x0: 0.53, x1: 0.6 }); }],
          [L[2] + 2, b => {
            walk('lost2', 0.61, { speed: 0.02, pose: 'lie' });
            add('shepherd', { label: '牧人', sex: 'm', age: 'adult', x: 0.775, facing: -1, robe: ROBE.shepherd, glow: 0.35, from: b.instant ? 'none' : 'light', prop: 'staff' });
          }],
          [L[3] - 0.5, b => { W.set('gloom', 0, b.instant); W.set('storm', 0.15, b.instant); W.set('rain', 0.45, b.instant); sfx(b, 'rain'); }],
          [L[3] + 3.4, b => {
            W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.4, b.instant);
            W.set('grass', 0.95, b.instant); W.set('herbs', 0.7, b.instant); W.set('bloom', 0.65, b.instant); W.set('bare', 0.18, b.instant);
          }],
        ]);
      },
    },
    // ── 9 · 我也要赐给你们一个新心 ───────────────────────────
    {
      kind: 'promise', utter: '我也要赐给你们一个新心', cmd: 'replace 石心 --with 肉心', ref: '36:26', tint: [255, 200, 190],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.5, 5, b.instant);
            crowdWalk('flock', 0.85, 0.95, { speed: 0.03, pose: 'lie' });
            walk('lost1', 0.955, { speed: 0.03, pose: 'lie' }); walk('lost2', 0.965, { speed: 0.03, pose: 'lie' });
            walk('shepherd', 0.9, { speed: 0.03 });
            placeCrowd('folk', { layer: 2, label: '以色列家', from: b.instant ? 'none' : 'fade', robes: CROWD_A },
              [[1.04, 0.2, -1], [1.06, 0.38, -1], [1.08, 0.12, -1], [1.1, 0.3, -1], [1.12, 0.45, -1], [1.14, 0.2, -1], [1.16, 0.35, -1], [1.18, 0.1, -1]]);
            crowdWalk('folk', 0.57, 0.8, { speed: 0.045 });
            crowdPose('exiles', 'stand');
            walk('fugitive', 0.52, { speed: 0.03 });
            pose('ezekiel', 'stand'); walk('ezekiel', X.ezek + 0.02, { speed: 0.02 });
            avoid([0.38, 0.9]);
          }],
          [4.2, b => { fxPush(b, { type: 'sprinkle', dur: 4, x0: 0.4, x1: 0.82 }); sfx(b, 'splash'); }],
          [6.5, b => { W.set('ekStone', 1, b.instant); crowdFace('folk', -1); }],
          [L[1] + 0.4, b => { W.set('ekHeart', 1, b.instant); sfx(b, 'harp'); }],
          [L[1] + 6.8, b => { crowdPose('folk', 'raise'); crowdPose('exiles', 'raise'); crowdGlow('folk', 0.35); crowdGlow('exiles', 0.35); sfx(b, 'crowd', { soft: true }); }],
          [L[2] - 0.4, b => {
            W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant); W.set('bloom', 1, b.instant); W.set('trees', 0.62, b.instant); W.set('bare', 0.05, b.instant);
            W.setPop('bird', 28, W.w * 0.7, W.h * 0.35, b.instant);
            sfx(b, 'bird');
          }],
          [L[2] + 3, () => { crowdPose('folk', 'stand'); crowdPose('exiles', 'stand'); }],
        ]);
      },
    },
    // ── 10 · 这些骸骨能复活吗？ ─────────────────────────────
    {
      kind: 'ask', utter: '人子啊，这些骸骨能复活吗？', cmd: 'ls 平原/骸骨 | wc -l  # 极其枯干', ref: '37:3', tint: [226, 226, 240],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => { fly('ezekiel', 0.5, liftY(0.5, 0.16), { dur: 3 }); glow('ezekiel', 0.6); W.goTo(0.93, 8, b.instant); sfx(b, 'wind'); }],
          [3.4, b => {
            clearScene(b);
            W.set('bare', 0.95, b.instant); W.set('grass', 0.04, b.instant); W.set('herbs', 0, b.instant); W.set('bloom', 0, b.instant); W.set('trees', 0, b.instant);
            W.set('clouds', 0.3, b.instant);
            W.setPop('bird', 4, W.w * 0.5, W.h * 0.3, b.instant); W.setPop('creeper', 0, W.w * 0.7, W.h * 0.8, b.instant);
            avoid([0.38, 1.02]);
          }],
          [5, b => { W.set('ekBones', 1, b.instant); }],
          [7, () => fly('ezekiel', 0.5, null, { dur: 2.5 })],
          [L[1], () => walk('ezekiel', 0.72, { speed: 0.03 })],
          [L[2], () => walk('ezekiel', 0.6, { speed: 0.03 })],
          [L[2] + 4.3, () => { face('ezekiel', 1); pose('ezekiel', 'gaze'); }],
        ]);
      },
    },
    // ── 11 · 枯干的骸骨啊，要听耶和华的话 ──────────────────────
    {
      kind: 'cmd', utter: '枯干的骸骨啊，要听耶和华的话', cmd: 'join 骨 骨 && add 筋 肉 皮  # 还没有气息', ref: '37:4', tint: [236, 230, 216],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, () => pose('ezekiel', 'raise')],
          [L[1], b => { if (!b.instant) W.shake = 0.7; sfx(b, 'thunder'); W.set('ekJoin', 1, b.instant); }],
          [L[1] + 2.5, b => { if (!b.instant) W.shake = 0.4; sfx(b, 'build', { soft: true }); }],
          [L[1] + 4.2, b => { W.set('ekSinew', 1, b.instant); }],
          [L[2] - 0.5, b => { bodies(b); W.set('ekFlesh', 1, b.instant); }],
          [L[2] + 5, () => pose('ezekiel', 'stand')],
        ]);
      },
    },
    // ── 12 · 气息啊，要从四方而来：极大的军队 ──────────────────
    {
      kind: 'cmd', utter: '气息啊，要从四方而来', cmd: 'breathe --from 四方  # 极大的军队', ref: '37:9', hold: 3.2, tint: [226, 238, 255],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        // 气息从四方而来，也从神的灵所在之处；军队由近及远，一群一群站起来
        const sx = c && c.x != null && W.w ? clamp(c.x / W.w, 0, 1) : 0.72;
        const sy = c && c.y != null && W.h ? clamp(c.y / W.h, 0, 1) : 0.4;
        const order = bodyGroups().map(g => { const list = g[1] === 2 ? SKEL.near : SKEL.mid; const mid = list[Math.floor((g[2][0] + g[2][1] - 1) / 2)]; return [g[0], Math.abs(mid.x - sx) + (g[1] === 1 ? 0.12 : 0)]; }).sort((a, b) => a[1] - b[1]);
        const beats = [
          [0, b => {
            W.set('gale', 0.9, b.instant); W.set('clouds', 0.65, b.instant);
            fxPush(b, { type: 'winds', dur: 7, sx, sy });
            sfx(b, 'wind');
          }],
          [3.6, b => { fxPush(b, { type: 'breath', dur: 4 }); for (const [gid] of bodyGroups()) crowdGlow(gid, 0.22); sfx(b, 'angel', { soft: true }); }],
          [L[1] - 0.5, b => { W.goTo(0.285, 9, b.instant); pose('ezekiel', 'stand'); }],
          [L[1] + 0.4, b => { W.set('ekArmy', 1, b.instant); sfx(b, 'crowd'); }],
          [L[1] + 6, b => {
            W.set('gale', 0.2, b.instant);
            for (const [gid] of bodyGroups()) { crowdLabel(gid, '以色列全家'); crowdFace(gid, -1); }
          }],
          [L[2], b => { W.set('grass', 0.35, b.instant); W.set('bloom', 0.2, b.instant); W.set('bare', 0.65, b.instant); pose('ezekiel', 'raise'); }],
          [L[2] + 4, () => pose('ezekiel', 'stand')],
        ];
        order.forEach(([gid], i) => beats.push([L[1] + 0.2 + i * 0.75, () => crowdPose(gid, 'stand')]));
        T(c, beats);
      },
    },
    // ── 13 · 人子啊，这是我宝座之地：至高的山；荣光从东而来 ─────────
    {
      kind: 'promise', utter: '人子啊，这是我宝座之地', cmd: 'return 荣光 --from 东 --to 殿', ref: '43:7', tint: [255, 232, 186],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.goTo(0.3, 4, b.instant);
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.5);
            for (let i = 0; i < 4; i++) uncrowd('bodyN' + i);
            placeCrowd('israel', { layer: 2, label: '以色列全家', from: b.instant ? 'none' : 'fade', robes: MUTED, glow: 0.22 },
              [[0.43, 0.1, 1], [0.448, 0.02, 1], [0.466, 0.14, 1, 'child'], [0.485, 0.04, 1], [0.505, 0.12, 1], [0.524, 0.02, 1, 'elder'], [0.545, 0.1, 1], [0.566, 0.03, 1], [0.588, 0.12, 1, 'child'], [0.61, 0.04, 1]]);
            W.set('ekBones', 0, b.instant);
            W.set('ekMount', 1, b.instant);
            walk('ezekiel', 0.665, { speed: 0.025 });
            W.set('grass', 0.6, b.instant); W.set('bloom', 0.35, b.instant); W.set('bare', 0.4, b.instant);
            avoid([0.38, 1.02]);
            sfx(b, 'thunder', { soft: true });
          }],
          [4.5, () => face('ezekiel', 1)],
          [5, b => {
            add('bronze', { label: '颜色如铜的人', sex: 'm', age: 'adult', layer: 2, x: 0.8, facing: 1, angel: true, robe: ROBE.bronze, glow: 0.55, scale: 0.6, from: b.instant ? 'none' : 'light', prop: 'staff' });
            attach('bronze', () => { const TG = templeGeom(); return [lerp(TG.gate[0] - 12 * TG.u, TG.gate[2] + 12 * TG.u, clamp(lv('ekMeasure'), 0, 1)), TG.py]; });
          }],
          [6, b => { W.set('ekMeasure', 1, b.instant); sfx(b, 'build', { soft: true }); }],
          [L[1] - 1.6, b => { W.set('ekTemple', 1, b.instant); }],
          [L[1] - 0.2, b => { W.set('ekGloryE', 1, b.instant); sfx(b, 'wind'); sfx(b, 'angel'); }],
          [L[1] + 3.5, () => { crowdPose('israel', 'bow'); }],
          [L[1] + 6.5, () => { pose('ezekiel', 'fall'); crowdPose('israel', 'fall'); }],
          [L[2], b => { W.set('ekFill', 1, b.instant); sfx(b, 'harp'); }],
          [L[3] - 0.6, b => { W.set('ekFlow', 0.3, b.instant); W.set('ekWater', 0.08, b.instant); pose('ezekiel', 'stand'); crowdPose('israel', 'stand'); sfx(b, 'splash', { soft: true }); }],
        ]);
      },
    },
    // ── 14 · 这河水所到之处，百物都必生活；耶和华的所在 ─────────
    {
      kind: 'bless', utter: '这河水所到之处，百物都必生活', cmd: 'flow 圣所 → 海 --heal  # 耶和华的所在', ref: '47:9', tint: [200, 244, 230],
      verse: V14,
      apply(c) {
        const L = starts(V14);
        const port = tall(), wx = port ? 0.605 : 0.705;
        T(c, [
          [0, b => {
            attach('bronze', null);
            add('bronze', { layer: 2, x: wx + 0.05, scale: 1, v: 0 });
            if (!b.instant) { const p = figPt('bronze', 0.5); if (p) fx().sparkle(p[0], p[1], 20, [255, 220, 170], 12, 'top'); }
            W.set('ekFlow', 1, b.instant); W.set('ekWater', 0.3, b.instant);
            add('ezekiel', { v: riverV(wx) });
            walk('ezekiel', wx, { speed: 0.02 });
            W.set('ekWade', 0.1, b.instant);
            sfx(b, 'splash');
          }],
          [2.6, b => { W.set('ekWater', 0.5, b.instant); W.set('ekWade', 0.3, b.instant); sfx(b, 'splash'); }],
          [5, b => { W.set('ekWater', 0.72, b.instant); W.set('ekWade', 0.52, b.instant); sfx(b, 'splash'); }],
          [7.4, b => { W.set('ekWater', 1, b.instant); W.set('ekWade', 0, b.instant); add('ezekiel', { v: 0 }); walk('ezekiel', wx - 0.035, { speed: 0.02 }); }],
          [L[1] - 0.2, b => {
            W.set('ekHeal', 1, b.instant);
            const m = riverAt(1);
            W.setPop('fish', 220, m.x - W.w * 0.1, m.y, b.instant); W.setPop('whale', 3, W.w * 0.15, W.h * 0.8, b.instant); W.setPop('bird', 30, W.w * 0.4, W.h * 0.3, b.instant);
            placeCrowd('fishers', { layer: 2, label: '渔夫', from: b.instant ? 'none' : 'fade', robes: CROWD_A },
              port ? [[0.36, 0.05, -1], [0.39, 0.02, -1], [0.418, 0.06, 1]] : [[0.425, 0.05, -1], [0.452, 0.02, -1], [0.475, 0.05, 1]]);
            W.set('ekNets2', 1, b.instant);
            sfx(b, 'splash', { size: 2 });
          }],
          [L[2] - 0.4, b => { W.set('ekTrees', 1, b.instant); W.set('grass', 0.95, b.instant); W.set('bloom', 0.8, b.instant); W.set('bare', 0.1, b.instant); sfx(b, 'bird'); }],
          [L[3] - 0.3, b => {
            W.set('ekName', 1, b.instant);
            crowdPose('israel', 'raise'); pose('ezekiel', 'raise');
            W.goTo(0.42, 6, b.instant);
            if (!b.instant) {
              const [x, y, size] = namePos(), TG = templeGeom();
              fx().nameStr(NAME, x, y, size, [255, 236, 196], () => [(TG.house.x0 + TG.house.x1) / 2 + rand(-40, 40), TG.house.top + rand(-20, 30)], { hold: 2.2, dot: 2.2 });
              chime('耶');
            }
            sfx(b, 'angel');
          }],
          [L[3] + 4.5, () => { crowdPose('israel', 'stand'); pose('ezekiel', 'stand'); }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '以西结书', books: [26], title: '以西结', sub: '以西结书 1 — 48', tint: [200, 230, 255], music: 'babel',
    outro: 18,
    intro: INTRO,
    // 全书终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '以西结': { text: '「人子啊，我立你作以色列家守望的人，所以你要听我口中的话，替我警戒他们。」', ref: '以西结书 3:17' },
      '被掳的人': { text: '我就来到提勒‧亚毕，住在迦巴鲁河边被掳的人那里……在他们中间忧忧闷闷地坐了七日。', ref: '以西结书 3:15' },
      '迦巴鲁河': { text: '当三十年四月初五日，以西结在迦巴鲁河边被掳的人中，天就开了，得见神的异象。', ref: '以西结书 1:1' },
      '帐棚': { text: '在迦勒底人之地、迦巴鲁河边，耶和华的话特特临到布西的儿子祭司以西结……', ref: '以西结书 1:3' },
      '活物': { text: '灵往哪里去，活物就往那里去；活物上升，轮也在活物旁边上升，因为活物的灵在轮中。', ref: '以西结书 1:20' },
      '轮': { text: '轮的形状和颜色好像水苍玉。四轮都是一个样式，形状和作法好像轮中套轮。', ref: '以西结书 1:16' },
      '宝座': { text: '在他们头以上的穹苍之上有宝座的形象，仿佛蓝宝石……', ref: '以西结书 1:26' },
      '虹': { text: '下雨的日子，云中虹的形状怎样，周围光辉的形状也是怎样。这就是耶和华荣耀的形象。', ref: '以西结书 1:28' },
      '书卷': { text: '我就吃了，口中觉得其甜如蜜。', ref: '以西结书 3:3' },
      '耶路撒冷': { text: '耶和华的荣耀从城中上升，停在城东的那座山上。', ref: '以西结书 11:23' },
      '被攻破的城': { text: '我们被掳之后十二年十月初五日，有人从耶路撒冷逃到我这里，说：「城已攻破。」', ref: '以西结书 33:21' },
      '圣殿': { text: '耶和华的荣耀从基路伯那里上升，停在门槛以上；殿内满了云彩，院宇也被耶和华荣耀的光辉充满。', ref: '以西结书 10:4' },
      '耶和华的荣耀': { text: '耶和华的荣耀从殿的门槛那里出去，停在基路伯以上。', ref: '以西结书 10:18' },
      '城中的人': { text: '「……那些因城中所行可憎之事叹息哀哭的人，画记号在额上。」', ref: '以西结书 9:4' },
      '穿细麻衣的人': { text: '耶和华对他说：「你去走遍耶路撒冷全城，那些因城中所行可憎之事叹息哀哭的人，画记号在额上。」', ref: '以西结书 9:4' },
      '香柏树': { text: '它就生枝子，结果子，成为佳美的香柏树，各类飞鸟都必宿在其下，就是宿在枝子的荫下。', ref: '以西结书 17:23' },
      '泰尔': { text: '说：你居住海口，是众民的商埠；你的交易通到许多的海岛。', ref: '以西结书 27:3' },
      '磐石': { text: '我必使你成为净光的磐石，作晒网的地方。', ref: '以西结书 26:14' },
      '逃来的人': { text: '到第二日早晨，那人来到我这里，我口就开了，不再缄默。', ref: '以西结书 33:22' },
      '羊': { text: '「主耶和华说：我必亲自作我羊的牧人，使它们得以躺卧。」', ref: '以西结书 34:15' },
      '失丧的羊': { text: '「失丧的，我必寻找；被逐的，我必领回……」', ref: '以西结书 34:16' },
      '受伤的羊': { text: '「……受伤的，我必缠裹；有病的，我必医治……」', ref: '以西结书 34:16' },
      '牧人': { text: '我必立一牧人照管他们，牧养他们，就是我的仆人大卫。', ref: '以西结书 34:23' },
      '以色列家': { text: '「我也要赐给你们一个新心，将新灵放在你们里面，又从你们的肉体中除掉石心，赐给你们肉心。」', ref: '以西结书 36:26' },
      '骸骨': { text: '他使我从骸骨的四围经过，谁知在平原的骸骨甚多，而且极其枯干。', ref: '以西结书 37:2' },
      '被杀的人': { text: '「……气息啊，要从四方而来，吹在这些被杀的人身上，使他们活了。」', ref: '以西结书 37:9' },
      '以色列全家': { text: '主对我说：「人子啊，这些骸骨就是以色列全家。」', ref: '以西结书 37:11' },
      '至高的山': { text: '在神的异象中带我到以色列地，安置在至高的山上；在山上的南边有仿佛一座城建立。', ref: '以西结书 40:2' },
      '颜色如铜的人': { text: '那人对我说：「人子啊，凡我所指示你的，你都要用眼看，用耳听，并要放在心上……」', ref: '以西结书 40:4' },
      '殿': { text: '他对我说：「人子啊，这是我宝座之地，是我脚掌所踏之地。我要在这里住，在以色列人中直到永远……」', ref: '以西结书 43:7' },
      '河': { text: '又量了一千肘，水便成了河，使我不能趟过。因为水势涨起，成为可洑的水，不可趟的河。', ref: '以西结书 47:5' },
      '树木': { text: '在河这边与那边的岸上必生长各类的树木；其果可作食物，叶子不枯干，果子不断绝。', ref: '以西结书 47:12' },
      '海': { text: '他对我说：「这水往东方流去，必下到亚拉巴，直到海。所发出来的水必流入海，使水变甜。」', ref: '以西结书 47:8' },
      '渔夫': { text: '必有渔夫站在河边，从隐‧基底直到隐‧以革莲，都作晒网之处。', ref: '以西结书 47:10' },
      '耶和华的所在': { text: '城四围共一万八千肘。从此以后，这城的名字必称为「耶和华的所在」。', ref: '以西结书 48:35' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._ezekiel = { get S() { return S; }, SKEL, FXL, VG, MG, templeGeom, riverPath, sprites };
})(window.GS);
