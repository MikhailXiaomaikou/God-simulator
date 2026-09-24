/* ─────────────────────────────────────────────────────────────
 * book/risen.js —— 四福音 · 复活（马太福音 28 · 路加福音 24 · 约翰福音 20 — 21）
 *
 * 七日的头一日，天快亮的时候：园中凿在磐石里的新坟墓，门口一块封了的大圆石头，两个看守的兵，一支火把；
 * 两个马利亚远远站着，手里捧着香料。「有主的使者从天上下来，把石头滚开」——地大震动，天开了一道光，
 * 洁白如雪的使者自光中降下，石头滚开，他坐在上面；看守的人仆倒如死人。墓门里只有一点白：细麻布。
 * 「钉在十字架上，第三日复活」——两个衣服放光的人站在门旁，妇女们将脸伏地；天边第一线日光。
 * 「马利亚」——她在墓外哭，转过身来，看见一人站在晨光里；听见自己的名，跪下：「拉波尼！」满园的花开了。
 * （先是彼得和约翰跑到坟墓前，低头往里看，又回去了。）
 * 「我要升上去见我的父，也是你们的父」——他指着门徒所在的地方差她去，在原处渐渐隐去；她去告诉正在哀哭的门徒，他们却是不信。
 * 午后，往以马忤斯的路：两个人愁容满面，第三个人与他们同行；摩西与众先知的话在他们头上发光。
 * 日头平西，村中的屋里点了灯：「耶稣拿起饼来，祝谢了，擘开，递给他们」——饼发光，他们的眼睛明亮了，他却不见了；
 * 二人心里火热，连夜跑回耶路撒冷。那日晚上，门都关了的屋里：「愿你们平安」——他站在当中，惧怕的人都站起来欢喜；
 * 「你们受圣灵」——他向他们吹一口气，一缕缕光落在每个人心上，门闩落下，门开了。
 * 过了八日（天在窗外转了一周）：「不要疑惑，总要信」——多马跪下：「我的主！我的神！」城中一扇扇窗亮起来。
 * 提比哩亚海：一夜打鱼，一无所得；天将亮，岸上站着一人，岸边一堆炭火。「你们把网撒在船的右边，就必得着」——
 * 网里满是银光的鱼；彼得跳在海里，船把网拉到岸上，一百五十三条；「你们来吃早饭」——饼和鱼，围着炭火。
 * 「约翰的儿子西门，你爱我吗？」——问三次，答三次；每一句「喂养我的羊」，坡上就多几只羊；「你跟从我吧！」
 * 加利利那座约定的山：十一个门徒拜他；「你们要去，使万民作我的门徒」——光从山顶一路走到地极，远山、海岛一处处亮起；
 * 「我就常与你们同在，直到世界的末了」——满地的花，满天的光。
 *
 * 父不显为人形：只有天上来的光与旁白的声音。复活的主是无面目的人，本色细麻的衣，胸中的光比先前亮些（glow ≥ 0.5）；
 * 不画钉痕，不画伤：「把手和肋旁指给他们看」只由他张开的手与旁白说出。
 *
 * 画面的方位（桌面）：右边近地 —— 园子（0.5–0.66）、坟墓（门在 0.745，磐石向右伸展）；中丘 —— 耶路撒冷（城墙、殿、房屋）。
 *   以马忤斯的路沿近地的岭线自左向右，村子（0.72）在右；屋子「前面敞开」，看得见里面的人。
 *   门都关了的屋子：人分前后两排，由前面受光，耶稣在当中，两边空出一段。
 *   加利利：海在左，船靠在 0.54（船头到 0.59）；网拉上岸在船头之外（0.6–0.62）；耶稣与炭火在 0.68–0.71，门徒围坐到 0.79；
 *   约定的山在右（0.86），十一个人站在山的左坡上，山脚与草地相接。大树（桌面）在右边的尽头，不在经文的下面。
 * 竖屏的手机：位置经 PX 收拢到 0.4–0.85；物件以人物的尺度（LS）画，房屋里、船上的人数少几个。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ease = U.easeInOut;
  const ACT = 'risen';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('rnHeaven', 'exp', 0.7);    // 天开了一道光（主的使者从天上下来；天上地下所有的权柄）
  W.defineLevel('rnDescend', 'lin', 0.36);  // 使者自天降下的路程（0 天上 → 1 地上）
  W.defineLevel('rnRisen', 'exp', 0.3);     // 复活的晨光：园子里一层暖金的光
  W.defineLevel('rnPeace', 'exp', 0.6);     // 关着门的屋里：平安的光
  W.defineLevel('rnScroll', 'exp', 0.5);    // 以马忤斯的路上：经上的话发光
  W.defineLevel('rnWorld', 'lin', 0.12);    // 往万民去：光一路走到地极（约八秒）
  W.defineLevel('rnGlory', 'exp', 0.3);     // 常与你们同在：满地满天的光

  // ── 地上的位置（桌面的画面宽度比例）；竖屏经 PX 收拢 ─────────────
  const XL = {
    door: 0.745, women: 0.566, mary2: 0.546, jesusG: 0.62,
    road0: 0.44, road1: 1.02, emm: 0.72, vil0: 0.905, vil1: 1.03,
    room: 0.705, fire: 0.71, talkJ: 0.742, talkP: 0.698,
    mount: 0.862, walk0: 0.5,
  };
  const X = Object.assign({}, XL);
  let PORT = false;
  const PX = x => (!PORT || x >= 1.001 ? x : 0.4 + (x - 0.45) * 0.9);
  // 桌面用 d；竖屏用 p 经 PX 收拢（竖屏的布置沿用原来的比例）
  const DP = (d, p) => (PORT ? PX(p) : d);
  function layout() {
    PORT = W.w < W.h * 0.9;
    for (const k in XL) X[k] = PX(XL[k]);
    if (PORT) X.emm = PX(0.845);
  }
  // 船：在海上（中丘与近地之间的水面），与靠岸之处；彼得涉水到岸的一点与上岸之处；
  // 网先拖到船头右边的水边（edge），再由彼得拉上岸（net，略靠前）——都在船头之外，不在人的头后
  const BOAT = {
    d: { sea: [0.56, 0.787], shore: [0.54, 0.817], swim: 0.556, land: 0.569, edge: 0.602, net: 0.616 },
    p: { sea: [0.362, 0.745], shore: [0.35, 0.797], swim: 0.412, land: 0.46, edge: 0.474, net: 0.49 },
  };
  const BQ = () => (PORT ? BOAT.p : BOAT.d);
  // 彼得涉水的一点：在近岸的浅水里（脚在岸边的水线上，头在船身之下，看得见他）
  const swimY = () => (gY(2, BQ().swim) - 1.5 * LS(2)) / W.h;
  // 岸上的耶稣站在炭火的左边
  const jShore = () => xo(X.fire, PORT ? -22 : -26);

  const ROBE = {
    mary2: [118, 104, 142], guard: [118, 72, 58], angel: [252, 252, 246],
  };

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { scene: 'tomb', breath: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  // 物件与人物同一尺度（人物模块在七日之后把人画大些：近地 ×1.3；手机上 ×1.55）
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  // 以人物的尺度（s）偏移一段：xo(0.7, 30) = 0.7 右边 30 个 s
  const xo = (xf, ds, l) => xf + (ds * LS(l == null ? 2 : l)) / W.w;

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return c && (c.has ? c.has(id) : !!(c.get && c.get(id))); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (has(id)) C().walk(id, x, Object.assign({ run: true }, o || {})); }
  function place(id, x, layer) { if (!has(id)) return; C().place(id, x, layer); const f = fig(id); if (f) f.ny = null; }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  // 退场：先放下一切牵挂（跟随、行走、飞、挂在船上），免得淡出之后又被叫回来时带着旧的样子
  function rm(id, now) {
    SCL.delete(id);
    const f = fig(id);
    if (!f) return;
    attach(id, null);
    f.follow = null; f.tx = null; f.fly = null; f.ny = null; f.v = 0;
    C().remove(id, now ? { fade: false } : undefined);
  }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && has(id)) c.fly(id, x, y, o); }
  function follow(id, other, dx) { const c = C(); if (c.follow && has(id)) c.follow(id, other, dx); }
  // 人的大小：船上的人小些（远），上了岸慢慢回到原来的大小（只是画面；重演时直接到位）
  const SCL = new Map();
  function scaleTo(id, k) { const f = fig(id); if (!f) return; if (W.replaying) { f.scale = k; SCL.delete(id); } else SCL.set(id, k); }

  // 复活的主：本色细麻、朱赭的边，光比先前亮些
  function jesus(o) { return add('jesus', Object.assign({}, LOOK().jesus || { label: '耶稣', sex: 'm', robe: [232, 224, 206] }, { glow: 0.52, layer: 2 }, o)); }
  // 门徒：彼得、约翰用各自的样子；其余用门徒的样子，各有一色衣袍
  const DLOOK = {
    peter: ['peter'], john: ['john'],
    james: ['disciple', '雅各', 0], andrew: ['disciple', '安得烈', 2], philip: ['disciple', '腓力', 6], nathanael: ['disciple', '拿但业', 5],
    thomas: ['disciple', '多马', 3], matthew: ['disciple', '马太', 4], jamesA: ['disciple', '亚勒腓的儿子雅各', 7],
    thaddaeus: ['disciple', '达太', 8], simonZ: ['disciple', '奋锐党的西门', 9],
    cleopas: ['disciple', '革流巴', 10], emm2: ['disciple', '同行的门徒', 1],
  };
  function disciple(id, o) {
    const d = DLOOK[id] || ['disciple', '门徒', 0], L = LOOK();
    const base = Object.assign({ sex: 'm', age: 'adult' }, L[d[0]] || {});
    if (d[1]) base.label = d[1];
    if (d[2] != null) { const R = (GS.cast && GS.cast.DISCIPLE_ROBES) || []; base.robe = R[d[2]] || [120, 100, 80]; }
    return add(id, Object.assign(base, { layer: 2, pose: 'stand' }, o));
  }
  const ALLD = ['peter', 'john', 'james', 'andrew', 'philip', 'nathanael', 'thomas', 'matthew', 'jamesA', 'thaddaeus', 'simonZ', 'cleopas', 'emm2'];

  // 旁白（情节里补充的经文；瞬间重演时不念）与音效
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.7, W.h * 0.8];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    return [f.nx * W.w, gY(f.layer == null ? 2 : f.layer, f.nx) - 34 * LS(f.layer == null ? 2 : f.layer) * k];
  }
  // 名字在人的上方、干净的天上以光聚成
  function nameOver(b, id, str, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const h = headOf(id, 1), n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || 50 * u, (W.w * 0.7) / (n * 1.08)));
    let cy = Math.min(h[1] - 70 * u, W.horizonY - 30 * u) - size * 0.55 + (o.dy || 0);
    cy = Math.max(cy, (PORT ? W.h * 0.36 : W.h * 0.14) + size * 0.5);
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(h[0] + (o.dx || 0), half + 8, W.w - half - 8);
    const src = o.src || (() => [h[0] + (Math.random() - 0.5) * 40 * u, h[1] + (Math.random() - 0.3) * 30 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 230, 170], src, { hold: o.hold || 2.8 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.6 : frac);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 236, 190], 14 * SU(), 'top');
  }
  function ringOn(b, id, r, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.55 : frac);
    fx().ring(h[0], h[1], rgb || [255, 240, 204], M() * (r || 0.2), 2.4, 1.6);
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // 缓动的量（每秒的线性步长 × 物件自己的 sp）：a 显隐 · k、k2 各物自己的状态 · lit 灯 · fire 火 · open 门 · grow 升起
  const EASE = { a: 0.8, k: 0.4, k2: 0.45, lit: 0.6, fire: 0.6, open: 0.7, grow: 0.16 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  // prop(id, kind, { x, x0, x1, xt, layer, size, w, label, style, sp, show, k, k2, lit, fire, open, grow })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, xt: 0.5, layer: 2, size: 1, w: 100, label: '', style: '', sp: 1, seed: hashStr(id) };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
    }
    for (const k of ['x', 'x0', 'x1', 'xt', 'layer', 'size', 'w', 'label', 'style', 'sp']) if (o[k] != null) p[k] = o[k];
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
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  // 自天而降的一道光，落在某处
  function beam(b, xf, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, y: o.y, w: (o.w || 70) * SU(), k: o.k || 1 });
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, Object.assign({ y: headOf(id, 0)[1] }, o)); }
  // 一缕缕的光：自一人飞向众人（吹一口气；递饼）
  function breath(b, from, tos, o) {
    if (b.instant) return;
    o = o || {};
    tos.forEach((id, i) => FXL.push({ type: 'breath', t: -(o.stagger || 0.18) * i, dur: o.dur || 2.2, from, to: id, rgb: o.rgb || [226, 238, 255], seed: i * 1.7 + (o.seed || 0) }));
  }

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
        silver: radial([220, 236, 250], 1, 0.4), dawn: radial([255, 214, 150], 1, 0.45),
      };
      // 自天而降的光柱：上淡、中亮、下渐隐
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,246,222,0)'); hz.addColorStop(0.5, 'rgba(255,250,236,1)'); hz.addColorStop(1, 'rgba(255,246,222,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.15)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
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
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
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
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：园中的新坟墓——凿在磐石里（太 27:60）；门口一块大圆石头，封了（27:66）
  // ════════════════════════════════════════════════════════════
  // 磐石的轮廓（以门为原点，单位 s；[右, 高]）：门左边矮，右边隆起、伸展
  const ROCK = [[-44, 0], [-43, 10], [-40, 22], [-36, 30], [-30, 36], [-27, 43], [-18, 47], [-6, 49], [4, 52], [14, 57], [26, 59], [38, 58], [50, 61], [62, 59],
    [74, 55], [84, 49], [92, 44], [100, 36], [106, 26], [112, 16], [116, 6], [118, 0]];
  function tombG(p) {
    const s = LS(2) * (p.size || 1), x = p.x * W.w, y = gY(2, p.x) + 1.5 * s;
    return { s, x, y, dw: 15 * s, dh: 24 * s, r: 13.5 * s };
  }
  // 石头：封着时挡在门口；滚开后在门的右边（重演时直接到位）
  function stoneAt(p) {
    const G = tombG(p), e = ease(clamp(p.k, 0, 1));
    const dx = lerp(0.5, 33, e) * G.s;
    return { x: G.x + dx, y: G.y - G.r, r: G.r, rot: dx / G.r };
  }
  // 使者坐在石头上：脚在石头前面（坐姿的髋高约为身高的 0.27）
  function stoneSeat() {
    const p = getP('tomb');
    if (!p) return null;
    const st = stoneAt(p), f = fig('angel1'), h = f && f._h > 1 ? f._h : 34 * LS(2);
    return [st.x + st.r * 0.15, st.y - st.r * 0.92 + h * 0.27];
  }
  function drawTomb(ctx, p) {
    const G = tombG(p), s = G.s, x = G.x, y = G.y;
    const d = litX() >= x + 30 * s ? 1 : -1;
    const stoneC = [182, 170, 148];
    ctx.globalAlpha = p.a;
    // 磐石：上浅下深
    const pts = ROCK.map(q => [x + q[0] * s, y - q[1] * s]);
    const xl = pts[0][0], xr = pts[pts.length - 1][0];
    const gr = ctx.createLinearGradient(0, y - 64 * s, 0, y);
    gr.addColorStop(0, css(mix(stoneC, [236, 224, 196], 0.18), 2)); gr.addColorStop(0.6, css(stoneC, 2)); gr.addColorStop(1, css(mul(stoneC, 0.78), 2));
    ctx.fillStyle = gr;
    ctx.beginPath();
    pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.lineTo(xr, Math.max(y, gY(2, xr / W.w) + 5 * s));
    ctx.lineTo(x + 40 * s, Math.max(y, gY(2, (x + 40 * s) / W.w) + 5 * s));
    ctx.lineTo(xl, Math.max(y, gY(2, xl / W.w) + 5 * s));
    ctx.closePath(); ctx.fill();
    // 背光的一面
    ctx.fillStyle = css([70, 62, 56], 2, 0.42);
    ctx.beginPath();
    if (d > 0) {
      ctx.moveTo(x - 44 * s, y); ctx.lineTo(x - 43 * s, y - 10 * s); ctx.lineTo(x - 40 * s, y - 22 * s); ctx.lineTo(x - 36 * s, y - 30 * s); ctx.lineTo(x - 30 * s, y - 36 * s);
      ctx.quadraticCurveTo(x - 28 * s, y - 18 * s, x - 20 * s, y); ctx.closePath();
    } else {
      ctx.moveTo(x + 118 * s, y); ctx.lineTo(x + 116 * s, y - 6 * s); ctx.lineTo(x + 112 * s, y - 16 * s); ctx.lineTo(x + 106 * s, y - 26 * s); ctx.lineTo(x + 100 * s, y - 36 * s); ctx.lineTo(x + 92 * s, y - 44 * s);
      ctx.quadraticCurveTo(x + 86 * s, y - 20 * s, x + 74 * s, y); ctx.closePath();
    }
    ctx.fill();
    // 岩层与裂纹
    ctx.lineCap = 'round';
    ctx.strokeStyle = css([96, 86, 76], 2, 0.55); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const STR = [[30, 48, 18], [66, 46, 16], [48, 30, 24], [86, 28, 14], [100, 14, 10], [-34, 24, 6], [36, 14, 12], [76, 12, 10]];
    for (const q of STR) { ctx.moveTo(x + (q[0] - q[2]) * s, y - q[1] * s + 1.2 * s); ctx.quadraticCurveTo(x + q[0] * s, y - q[1] * s - 1.4 * s, x + (q[0] + q[2]) * s, y - q[1] * s + 0.6 * s); }
    ctx.stroke();
    ctx.strokeStyle = css([240, 230, 206], 2, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (const q of STR) { ctx.moveTo(x + (q[0] - q[2]) * s, y - q[1] * s - 0.4 * s); ctx.quadraticCurveTo(x + q[0] * s, y - q[1] * s - 3 * s, x + (q[0] + q[2]) * s, y - q[1] * s - 1 * s); }
    ctx.stroke();
    // 迎光的石脊
    ctx.strokeStyle = css([252, 240, 214], 2, 0.45 * dayA() + 0.1, 0.25); ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.stroke();
    // 石上的草：一丛丛细草，两棵矮灌木
    ctx.strokeStyle = css([88, 112, 66], 2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    const TUFT = [[-24, 45], [-2, 50], [20, 58], [44, 59], [58, 60], [80, 52], [96, 40]];
    for (const q of TUFT) {
      const cx = x + q[0] * s, cy = y - q[1] * s + 0.8 * s;
      for (let k = -2; k <= 2; k++) { ctx.moveTo(cx + k * 1.1 * s, cy); ctx.lineTo(cx + k * 1.8 * s + Math.sin(W.t * 1.3 + q[0] + k) * 0.4 * s, cy - (2.6 + (k & 1)) * s); }
    }
    ctx.stroke();
    ctx.fillStyle = css([70, 92, 56], 2);
    ctx.beginPath();
    for (const q of [[32, 59, 3.4], [70, 57, 2.8]]) { const cx = x + q[0] * s, cy = y - q[1] * s, r = q[2] * s; ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy - r * 0.35, r, r * 0.6, 0, Math.PI, 0); }
    ctx.fill();
    // 凿平的石面：门的四围（凿在磐石里）
    const fw = 16 * s, fh = 36 * s;
    ctx.fillStyle = css(mix(stoneC, [240, 232, 214], 0.16), 2);
    ctx.fillRect(x - fw, y - fh, fw * 2, fh);
    ctx.fillStyle = css([80, 70, 60], 2, 0.45);
    ctx.fillRect(x - fw, y - fh, fw * 2, 1.4 * s);
    ctx.fillRect(d > 0 ? x + fw - 1.4 * s : x - fw, y - fh, 1.4 * s, fh);
    // 石头滚动的槽
    ctx.fillStyle = css([92, 82, 70], 2, 0.8);
    ctx.fillRect(x - 12 * s, y - 1.6 * s, 58 * s, 2.4 * s);
    // 墓门：凿出的拱门，里面是暗的
    const dw = G.dw, dh = G.dh;
    ctx.fillStyle = css([150, 138, 118], 2);
    ctx.beginPath(); ctx.moveTo(x - dw / 2 - 3 * s, y); ctx.lineTo(x - dw / 2 - 3 * s, y - dh + dw / 2); ctx.arc(x, y - dh + dw / 2, dw / 2 + 3 * s, Math.PI, 0); ctx.lineTo(x + dw / 2 + 3 * s, y); ctx.closePath(); ctx.fill();
    const door = new Path2D();
    door.moveTo(x - dw / 2, y); door.lineTo(x - dw / 2, y - dh + dw / 2); door.arc(x, y - dh + dw / 2, dw / 2, Math.PI, 0); door.lineTo(x + dw / 2, y); door.closePath();
    ctx.fillStyle = 'rgb(16,13,12)';
    ctx.fill(door);
    // 墓里的光与细麻布（石头滚开之后）：空的坟墓
    const open = clamp(p.k * 1.4, 0, 1), inner = p.k2 * open;
    if (inner > 0.01 && SP) {
      ctx.save();
      ctx.clip(door);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.white, x + 1 * s, y - dh * 0.45, dh * 1.1, 0.5 * inner * p.a);
      glowAt(SP.gold, x, y - 4 * s, dw * 1.1, 0.45 * inner * p.a, 0.5);
      ctx.globalCompositeOperation = 'source-over';
      // 放尸首的石台与其上的细麻布；裹头巾另在一处卷着（约 20:7）
      ctx.globalAlpha = p.a * open;
      ctx.fillStyle = 'rgb(58,50,44)';
      ctx.fillRect(x - dw / 2, y - 6 * s, dw, 6 * s);
      ctx.fillStyle = rgba([238, 232, 216], 0.85 * p.a * open);
      ctx.beginPath(); ctx.ellipse(x + 1.5 * s, y - 7 * s, 5.2 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - 4.8 * s, y - 7.4 * s, 1.6 * s, 1.2 * s, 0, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.globalAlpha = p.a;
    }
    // 大圆石头：厚重的一块圆石，贴着石面立着；滚动时石上的斑点随之转
    const st = stoneAt(p);
    ctx.fillStyle = css([40, 34, 30], 2, 0.35);
    ctx.beginPath(); ctx.ellipse(st.x + 2 * s, st.y + st.r - 0.5 * s, st.r * 1.05, 2.2 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(st.x + 1.6 * s, st.y + 0.8 * s, st.r, 0, TAU); ctx.fill();
    const sg = ctx.createRadialGradient(st.x - st.r * 0.35, st.y - st.r * 0.45, st.r * 0.15, st.x, st.y, st.r * 1.02);
    sg.addColorStop(0, css([222, 212, 192], 2, 1, 0.05)); sg.addColorStop(0.7, css([184, 172, 150], 2)); sg.addColorStop(1, css([138, 126, 108], 2));
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([110, 100, 86], 2, 0.55); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r * 0.62, 0, TAU); ctx.stroke();
    ctx.fillStyle = css([120, 110, 94], 2, 0.7);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { const a = st.rot + i * 1.9 + 0.4, rr = st.r * (0.3 + 0.12 * i); ctx.moveTo(st.x + Math.cos(a) * rr + 1 * s, st.y + Math.sin(a) * rr); ctx.arc(st.x + Math.cos(a) * rr, st.y + Math.sin(a) * rr, (0.8 + 0.25 * i) * s, 0, TAU); }
    ctx.fill();
    ctx.strokeStyle = css([252, 242, 220], 2, 0.45 * dayA() + 0.1, 0.25); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r - 0.6 * s, Math.PI * 1.02, Math.PI * 1.75); ctx.stroke();
    // 封条（太 27:66）：一道绳，一方封印；石头一动就断了
    if (p.k < 0.03) {
      ctx.strokeStyle = css([150, 120, 80], 2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.moveTo(x - dw / 2 - 5 * s, y - dh * 0.62); ctx.quadraticCurveTo(st.x, st.y - st.r * 0.2, x + dw / 2 + 8 * s, y - dh * 0.66); ctx.stroke();
      ctx.fillStyle = css([164, 40, 34], 2, 1, 0.1);
      ctx.beginPath(); ctx.arc(st.x + st.r * 0.1, st.y - st.r * 0.1, 2.6 * s, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── 园子：橄榄树、百合（春天，花一丛丛开了）──────────────────
  function drawOlive(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, r = U.mulberry32(p.seed);
    ctx.globalAlpha = p.a;
    // 扭曲的树干
    ctx.fillStyle = css([88, 74, 60], l);
    ctx.beginPath();
    ctx.moveTo(x - 4.5 * s, y);
    ctx.bezierCurveTo(x - 1 * s, y - 8 * s, x - 6 * s, y - 16 * s, x - 2 * s, y - 26 * s);
    ctx.lineTo(x + 2.2 * s, y - 25 * s);
    ctx.bezierCurveTo(x + 1 * s, y - 16 * s, x + 5 * s, y - 9 * s, x + 4.6 * s, y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 74, 60], l); ctx.lineWidth = Math.max(0.8, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - 1 * s, y - 22 * s); ctx.quadraticCurveTo(x - 8 * s, y - 27 * s, x - 13 * s, y - 29 * s);
    ctx.moveTo(x + 1 * s, y - 23 * s); ctx.quadraticCurveTo(x + 7 * s, y - 28 * s, x + 12 * s, y - 31 * s); ctx.stroke();
    // 银绿的树冠：几团
    const cols = [[112, 128, 96], [98, 116, 86], [132, 146, 112]];
    for (let i = 0; i < 7; i++) {
      const cx = x + (r() - 0.5) * 30 * s, cy = y - (28 + r() * 12) * s, rx = (8 + r() * 6) * s, ry = rx * (0.55 + r() * 0.2);
      ctx.fillStyle = css(cols[i % 3], l);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, (r() - 0.5) * 0.4, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = css([226, 236, 210], l, 0.28 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.ellipse(x, y - 36 * s, 16 * s, 7 * s, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawLilies(ctx, p) {
    const l = p.layer, s = LS(l), n = Math.round(p.w), open = p.k;
    ctx.globalAlpha = p.a;
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const xf = p.x0 + (p.x1 - p.x0) * ((i + 0.5 + (hsh(p.seed + i) - 0.5) * 0.8) / n), x = xf * W.w, y = gY(l, xf) + (1 + hsh(p.seed + i * 3) * 4) * s;
      const h = (6 + hsh(p.seed + i * 7) * 5) * s * (0.5 + 0.5 * p.grow);
      ctx.strokeStyle = css([70, 104, 58], l); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 1.2 * s, y - h * 0.5, x + 0.4 * s, y - h); ctx.stroke();
      ctx.fillStyle = css([70, 104, 58], l);
      ctx.beginPath(); ctx.ellipse(x - 1.4 * s, y - h * 0.35, 2 * s, 0.7 * s, -0.5, 0, TAU); ctx.fill();
      // 花：合着是青绿的苞，开了是白的（间有淡红、淡金）
      const tone = hsh(p.seed + i * 11);
      const c = tone < 0.6 ? [248, 246, 236] : tone < 0.8 ? [244, 196, 206] : [248, 222, 150];
      const o = clamp(open * 1.3 - hsh(p.seed + i * 5) * 0.3, 0, 1);
      ctx.fillStyle = css(mix([150, 176, 120], c, o), l, 1, 0.1 + 0.2 * o);
      const px = x + 0.4 * s, py = y - h, pr = (0.9 + 1.2 * o) * s;
      ctx.beginPath();
      for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k - 1) * (0.35 + 0.55 * o); ctx.moveTo(px, py); ctx.ellipse(px + Math.cos(a) * pr, py + Math.sin(a) * pr, pr, pr * 0.42, a, 0, TAU); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── 耶路撒冷（中丘）：城墙、城楼、殿、房屋；夜里窗里的灯 ─────────
  function cityModel(p) {
    if (p.model && p.model.w === W.w && p.model.h === W.h) return p.model;
    const r = U.mulberry32(p.seed * 13 + 7), hs = [];
    const village = p.style === 'village';
    const n = Math.max(3, Math.round((p.x1 - p.x0) * (village ? 18 : 44)));
    for (let i = 0; i < n; i++) {
      hs.push({ f: p.x0 + (p.x1 - p.x0) * (i + 0.15 + r() * 0.7) / n, w: (village ? 7 : 6) + r() * 8, h: (village ? 5 : 6) + r() * (village ? 5 : 11), tone: r(), win: r(), lit: r(), back: !village && r() < 0.45 });
    }
    hs.sort((a, b) => (b.back ? 1 : 0) - (a.back ? 1 : 0));
    const tw = [];
    if (!village) for (let f = p.x0 + 0.01; f < p.x1; f += 0.05 + r() * 0.02) tw.push({ f, h: 14 + r() * 5 });
    p.model = { w: W.w, h: W.h, hs, tw };
    return p.model;
  }
  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, m = cityModel(p), nk = nightK(), village = p.style === 'village';
    const d = litX() >= (p.x0 + p.x1) * 0.5 * W.w ? 1 : -1;
    const ST = [214, 198, 168], ST2 = [190, 172, 142], ROOF = [170, 150, 120];
    ctx.globalAlpha = p.a;
    const wins = [];
    // 房屋（靠后的先画）
    for (const h of m.hs) {
      const x = h.f * W.w, gy = gY(l, h.f) + 2 * s - (h.back ? 7 * s : 0), w = h.w * s, hh = h.h * s * (h.back ? 1.25 : 1);
      ctx.fillStyle = css(mix(ST, ST2, h.tone), l, 1, h.back ? -0.04 : 0);
      ctx.fillRect(x - w / 2, gy - hh, w, hh + (h.back ? 7 * s : 2 * s));
      ctx.fillStyle = css(mul(mix(ST, ST2, h.tone), 0.72), l, 0.8);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.25, gy - hh, w * 0.25, hh);
      ctx.fillStyle = css(ROOF, l);
      ctx.fillRect(x - w / 2 - 0.6 * s, gy - hh - 1.2 * s, w + 1.2 * s, 1.4 * s);
      if (h.win > 0.3) wins.push([x + (h.win - 0.65) * w * 0.8, gy - hh * 0.6, h.lit]);
    }
    if (!village) {
      // 殿：台基、殿身、金边、门里的灯
      const tx = p.xt * W.w, tg = gY(l, p.xt) + 2 * s;
      ctx.fillStyle = css([226, 212, 182], l);
      ctx.fillRect(tx - 30 * s, tg - 7 * s, 60 * s, 9 * s);
      ctx.fillStyle = css([236, 226, 204], l, 1, 0.04);
      ctx.fillRect(tx - 11 * s, tg - 31 * s, 22 * s, 24 * s);
      ctx.fillRect(tx - 16 * s, tg - 22 * s, 32 * s, 15 * s);
      ctx.fillStyle = css([222, 186, 96], l, 1, 0.2);
      ctx.fillRect(tx - 12 * s, tg - 32.5 * s, 24 * s, 1.8 * s);
      ctx.fillRect(tx - 17 * s, tg - 23.4 * s, 34 * s, 1.4 * s);
      ctx.fillStyle = css([70, 56, 40], l);
      ctx.fillRect(tx - 2.6 * s, tg - 19 * s, 5.2 * s, 12 * s);
      wins.push([tx, tg - 13 * s, 0.02, 1.6]);
      // 城墙与城楼：沿着中丘的岭线
      ctx.fillStyle = css([200, 184, 150], l);
      ctx.beginPath();
      const N = 40, wx0 = p.x0, wx1 = p.x1;
      for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N); const yy = gY(l, f) + 2 * s - 8 * s; if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
      for (let i = N; i >= 0; i--) { const f = lerp(wx0, wx1, i / N); ctx.lineTo(f * W.w, gY(l, f) + 4 * s); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([200, 184, 150], l);
      for (let f = wx0; f < wx1; f += (3.2 * s) / W.w) { const yy = gY(l, f) + 2 * s - 8 * s; ctx.fillRect(f * W.w, yy - 1.8 * s, 1.6 * s, 1.8 * s); }
      for (const t of m.tw) {
        const x = t.f * W.w, gy = gY(l, t.f) + 2 * s;
        ctx.fillStyle = css([206, 190, 156], l);
        ctx.fillRect(x - 4 * s, gy - t.h * s, 8 * s, t.h * s);
        ctx.fillRect(x - 5 * s, gy - t.h * s - 1.6 * s, 10 * s, 1.8 * s);
        ctx.fillStyle = css([60, 48, 38], l, 0.8);
        ctx.fillRect(x - 0.8 * s, gy - t.h * s + 3 * s, 1.6 * s, 2.6 * s);
      }
      ctx.strokeStyle = css([252, 238, 206], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N); const yy = gY(l, f) + 2 * s - 8 * s - 1.8 * s; if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
      ctx.stroke();
    }
    // 窗里的灯（夜里；lit 决定亮几扇）；满城都点了灯时（lit > 0.6）灯更大、更亮，城上一层暖光
    const lk = nk * p.a, big = clamp((p.lit - 0.6) / 0.4, 0, 1);
    if (lk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const ws = 1 + 0.9 * big;
      for (const q of wins) {
        if (q[2] > p.lit) continue;
        const fl = 0.8 + 0.2 * Math.sin(W.t * 3 + q[0] * 0.07);
        ctx.globalAlpha = Math.min(1, lk * fl * (1 + 0.3 * big));
        ctx.fillStyle = big > 0.3 ? 'rgb(255,214,140)' : 'rgb(255,190,110)';
        ctx.fillRect(q[0] - 0.8 * s * ws, q[1] - 0.8 * s * ws, 1.6 * s * ws, 1.6 * s * ws * (q[3] || 1));
        glowAt(SP.lamp, q[0], q[1], 7 * s * (q[3] || 1) * (1 + 1.6 * big), lk * fl * (0.5 + 0.4 * big));
      }
      if (big > 0.01 && !village) {
        const cx = (p.x0 + p.x1) * 0.5 * W.w, cy = gY(l, (p.x0 + p.x1) * 0.5) - 8 * s;
        glowAt(SP.amber, cx, cy, (p.x1 - p.x0) * W.w * 0.62, 0.36 * big * lk, 0.28);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 以马忤斯：路、村中的小屋 ─────────────────────────────────
  function drawRoad(ctx, p) {
    const l = 2, s = LS(l), N = 48;
    ctx.globalAlpha = p.a;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? css([226, 206, 164], l, 0.5, 0.05) : css([176, 150, 110], l, 0.55);
      ctx.lineWidth = (pass ? 2.2 : 5) * s;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const f = lerp(p.x0, p.x1, i / N), y = gY(l, f) + (pass ? 3.2 : 3.6) * s; if (i) ctx.lineTo(f * W.w, y); else ctx.moveTo(f * W.w, y); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawHut(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, w = 22 * s, h = 15 * s, tone = [188, 164, 126];
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - w / 2, y - h, w, h + 3 * s);
    ctx.fillStyle = css(mul(tone, 0.7), l, 0.85);
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.24, y - h, w * 0.24, h);
    ctx.fillStyle = css([150, 128, 98], l);
    ctx.fillRect(x - w / 2 - 1.2 * s, y - h - 1.8 * s, w + 2.4 * s, 2 * s);
    ctx.fillStyle = css([40, 32, 26], l);
    ctx.fillRect(x - 2 * s, y - 8 * s, 4 * s, 8 * s);
    ctx.fillRect(x + w * 0.24, y - h * 0.7, 2.6 * s, 2.6 * s);
    const lk = nightK() * p.a * p.lit;
    if (lk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lk);
      ctx.fillStyle = 'rgb(255,184,104)';
      ctx.fillRect(x + w * 0.24, y - h * 0.7, 2.6 * s, 2.6 * s);
      glowAt(SP.lamp, x + w * 0.24 + 1.3 * s, y - h * 0.7 + 1.3 * s, 12 * s, lk * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = css([252, 238, 210], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 1.2 * s, y - h - 1.8 * s); ctx.lineTo(x + w / 2 + 1.2 * s, y - h - 1.8 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── 前面敞开的屋子（以马忤斯的屋；耶路撒冷门都关了的屋）─────────
  // 地面取两头与当中最低的一处（屋里的地是平的；人都站在这条线上）；门在后墙的右边
  function roomG(p) {
    const s = LS(2), cx = p.x * W.w, w = p.w * s, x0 = cx - w / 2, x1 = cx + w / 2;
    const y = Math.max(gY(2, x0 / W.w), gY(2, x1 / W.w), gY(2, p.x), gY(2, (x0 + w * 0.25) / W.w), gY(2, (x0 + w * 0.75) / W.w)) + 2 * s;
    const h = (p.style === 'emmaus' ? 46 : 54) * s;
    return { s, cx, w, x0, x1, y, h, top: y - h, doorF: 0.9 };
  }
  const roomX = (id, f) => { const p = getP(id); if (!p) return 0.7; const G = roomG(p); return (G.x0 + f * G.w) / W.w; };
  // 屋里的地有深浅：后排站在后墙根（row 0），前排靠前一步（row 1，画面低些）
  const ROWD = 7;
  // 屋里的人站在屋里的地上
  function onFloor(id, rid, row) { attach(id, () => { const p = getP(rid), f = fig(id); if (!p || !f) return null; const G = roomG(p); return [f.nx * W.w, G.y + (row ? ROWD * G.s : 0)]; }); }
  function drawRoom(ctx, p) {
    const G = roomG(p), s = G.s, emm = p.style === 'emmaus';
    const st = emm ? [196, 172, 134] : [206, 190, 160], nk = nightK(), lamp = p.lit * Math.max(0.35, nk);
    const lx = G.cx + (emm ? 0 : G.w * 0.08), ly = G.top + 9 * s;
    ctx.globalAlpha = p.a;
    // 后墙（屋里：暗；灯只照亮灯下的一小片——人由前面受光，不衬在亮墙上）
    ctx.fillStyle = css(mul(st, emm ? 0.46 : 0.4), 2, 1, -0.05);
    ctx.fillRect(G.x0, G.top, G.w, G.h);
    if (lamp > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, lx, ly + 2 * s, Math.min(G.w * 0.42, 100 * s), 0.3 * lamp * p.a, 0.5);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 后墙上的窗：看得见外面的天
    const wx = G.x0 + G.w * (emm ? 0.2 : 0.18), wy = G.top + G.h * 0.26, ww = 7 * s, wh = 9 * s;
    ctx.fillStyle = W.shadeCSS([150, 170, 200], 0.2, 1, 0.1);
    ctx.fillRect(wx - ww / 2, wy, ww, wh);
    ctx.fillStyle = css(mul(st, 0.62), 2);
    ctx.fillRect(wx - 0.5 * s, wy, 1 * s, wh);
    // 门（后墙的右边）：关着、上了闩；开时透出外面的夜（月色的蓝，一两颗星）
    const dxc = G.x0 + G.w * G.doorF, dw = 13 * s, dh = 30 * s, dy = G.y - dh;
    ctx.fillStyle = W.shadeCSS([54, 72, 108], 0.3, 1, 0.12);
    ctx.fillRect(dxc - dw / 2, dy, dw, dh);
    if (p.open > 0.3) {
      ctx.fillStyle = rgba([226, 232, 250], 0.8 * p.a * (p.open - 0.3) / 0.7);
      ctx.fillRect(dxc + dw * 0.18, dy + dh * 0.2, Math.max(1, 0.8 * s), Math.max(1, 0.8 * s));
      ctx.fillRect(dxc + dw * 0.38, dy + dh * 0.42, Math.max(1, 0.6 * s), Math.max(1, 0.6 * s));
    }
    const leaf = dw * (1 - 0.72 * p.open);
    ctx.fillStyle = css([112, 82, 56], 2);
    ctx.fillRect(dxc - dw / 2, dy, leaf, dh);
    ctx.strokeStyle = css([80, 58, 40], 2, 0.8); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { const xx = dxc - dw / 2 + (leaf * i) / 4; ctx.moveTo(xx, dy + 1 * s); ctx.lineTo(xx, G.y - 1 * s); }
    ctx.stroke();
    // 门闩：一根横木
    const bar = p.k2;
    if (bar > 0.02) {
      ctx.globalAlpha = p.a * bar;
      ctx.fillStyle = css([90, 66, 44], 2);
      ctx.fillRect(dxc - dw / 2 - 2.5 * s, dy + dh * 0.46 - (1 - bar) * 6 * s, dw + 5 * s, 2.6 * s);
      ctx.fillStyle = css([60, 46, 34], 2);
      ctx.fillRect(dxc - dw / 2 - 3.2 * s, dy + dh * 0.42, 1.8 * s, 5 * s); ctx.fillRect(dxc + dw / 2 + 1.4 * s, dy + dh * 0.42, 1.8 * s, 5 * s);
      ctx.globalAlpha = p.a;
    }
    // 门开了：屋里的光洒到门外——门框一圈亮，门口的地上一道光
    if (p.open > 0.02 && SP && lamp > 0.02) {
      const ok = p.open * p.a * Math.max(nk, 0.3);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, dxc, G.y - dh * 0.45, dh * 1.05, 0.55 * ok, 0.9);
      glowAt(SP.amber, dxc, G.y - 1 * s, dw * 1.6, 0.6 * ok, 0.3);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
      ctx.strokeStyle = rgba([255, 214, 150], 0.75 * ok); ctx.lineWidth = Math.max(0.8, 1.1 * s);
      ctx.strokeRect(dxc - dw / 2 + leaf, dy, dw - leaf, dh);
    }
    // 屋顶的梁（屋里）与两边的墙、屋顶（屋外的颜色）
    ctx.fillStyle = css(mul(st, 0.36), 2);
    for (let i = 1; i < 5; i++) ctx.fillRect(G.x0 + (G.w * i) / 5 - 1.2 * s, G.top, 2.4 * s, 3.2 * s);
    ctx.fillStyle = css(st, 2);
    ctx.fillRect(G.x0 - 5 * s, G.top - 5 * s, 5 * s, G.h + 7 * s + (emm ? 0 : 9 * s));
    ctx.fillRect(G.x1, G.top - 5 * s, 5 * s, G.h + 7 * s + (emm ? 0 : 9 * s));
    ctx.fillRect(G.x0 - 7 * s, G.top - 7 * s, G.w + 14 * s, 5 * s);
    ctx.fillStyle = css(mul(st, 0.84), 2);
    ctx.fillRect(G.x0 - 7 * s, G.top - 10 * s, G.w + 14 * s, 3 * s);
    if (!emm) {
      // 楼上的屋：外面有一道上楼的石阶（右边）
      ctx.fillStyle = css(mul(st, 0.9), 2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) ctx.rect(G.x1 + 5 * s, G.y - (i + 1) * 4 * s, (6 - i) * 3.6 * s, 4 * s);
      ctx.fill();
    }
    // 屋里的地（楼上的屋：地有进深，前排的人站在靠前的一步；灯光落在地上）
    if (emm) {
      ctx.fillStyle = css(mul(st, 0.7), 2);
      ctx.fillRect(G.x0 - 5 * s, G.y - 1 * s, G.w + 10 * s, 3 * s);
    } else {
      ctx.fillStyle = css(mul(st, 0.5), 2);
      ctx.fillRect(G.x0 - 5 * s, G.y - 1 * s, G.w + 10 * s, 11 * s);
      ctx.fillStyle = css(mul(st, 0.74), 2);
      ctx.fillRect(G.x0 - 5 * s, G.y + 8.5 * s, G.w + 10 * s, 2.5 * s);
      if (lamp > 0.02 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.warm, G.cx, G.y + 4 * s, G.w * 0.5, 0.2 * lamp * p.a, 0.12);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.a;
      }
    }
    // 灯：挂在当中的梁下（泥灯一盏）
    ctx.strokeStyle = css([70, 56, 44], 2); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath(); ctx.moveTo(lx, G.top + 3 * s); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.fillStyle = css([160, 110, 72], 2);
    ctx.beginPath(); ctx.ellipse(lx, ly + 1 * s, 3 * s, 1.3 * s, 0, 0, TAU); ctx.fill();
    if (p.lit > 0.02) flame(ctx, lx + 2 * s, ly + 0.4 * s, 3 * s, p.lit * p.a, p.seed);
    ctx.globalAlpha = p.a;
    // 迎光的边
    ctx.strokeStyle = css([252, 238, 210], 2, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(G.x0 - 7 * s, G.top - 10 * s); ctx.lineTo(G.x1 + 7 * s, G.top - 10 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 以马忤斯的矮桌与饼（画在人的前面：人坐在桌后）
  function drawTable(ctx, p) {
    if (p.style !== 'emmaus' || p.a < 0.01) return;
    const G = roomG(p), s = G.s, x = G.x0 + G.w * 0.45, y = G.y;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([118, 88, 60], 2);
    ctx.fillRect(x - 16 * s, y - 6 * s, 32 * s, 2.4 * s);
    ctx.fillRect(x - 14 * s, y - 4 * s, 2 * s, 4 * s); ctx.fillRect(x + 12 * s, y - 4 * s, 2 * s, 4 * s);
    ctx.fillStyle = css([150, 118, 84], 2, 1, 0.05);
    ctx.fillRect(x - 16 * s, y - 6.4 * s, 32 * s, 0.8 * s);
    // 饼：整的一个；擘开后是两半，发光
    const br = p.k, gl = p.k2;
    ctx.fillStyle = css([214, 170, 110], 2, 1, 0.1 + 0.3 * gl);
    if (br < 0.5) { ctx.beginPath(); ctx.ellipse(x, y - 7.6 * s, 4.2 * s, 1.9 * s, 0, 0, TAU); ctx.fill(); }
    else {
      const g = 1.6 * s * (br - 0.5) * 2;
      ctx.beginPath(); ctx.ellipse(x - 2.3 * s - g, y - 7.6 * s, 2.4 * s, 1.8 * s, 0.2, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 2.3 * s + g, y - 7.6 * s, 2.4 * s, 1.8 * s, -0.2, 0, TAU); ctx.fill();
    }
    if (gl > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, x, y - 8 * s, 16 * s, 0.7 * gl * p.a);
      glowAt(SP.white, x, y - 8 * s, 6 * s, 0.6 * gl * p.a);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 屋里的人由前面受光（在人之上叠一层）：灯光只落在每个人的身形上（以人物模块缓存的剪影为界），
  // 各人衣袍的颜色在灯下显出来；耶稣的细麻衣在平安的光里最亮。走动中的人（没有缓存的剪影）只在胸前一点暖光。
  const LOWP = { sit: 0.62, seat: 0.66, kneel: 0.66, pray: 0.66, worship: 0.45, bow: 0.85, weep: 0.9, fall: 0.25, lie: 0.2 };
  function inRoomNow(f, G) { return f._vis && f.alpha > 0.05 && !f.isAnimal && f.layer === 2 && f._x > G.x0 && f._x < G.x1 && f._y > G.y - 4 * G.s && f._y < G.y + 12 * G.s; }
  const LAMPC = [255, 196, 132];
  function litFigure(ctx, f, rgb, a, hi) {
    const cc = f._cc, h = f._h || 30;
    if (!cc || !cc.union || Math.abs(cc.k0 - f._x) > 1 || Math.abs(cc.k1 - f._y) > 1) return false;
    ctx.save();
    ctx.clip(cc.union);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = rgba(rgb, 1);
    ctx.fillRect(f._x - h, f._y - h * 1.4, h * 2, h * 1.5);
    if (hi > 0.01) glowAt(SP.gold, f._x, f._y - h * (LOWP[f.pose] || 1) * 0.62, h * 0.5, hi);
    ctx.restore();
    return true;
  }
  function drawRoomLight(ctx) {
    const c = C();
    if (!SP || !c || !c.people) return;
    for (const rid of ['room', 'emm']) {
      const p = getP(rid);
      if (!p || p.a < 0.02) continue;
      const G = roomG(p), nk = nightK(), lamp = p.lit * Math.max(0.35, nk) * p.a;
      const pk = rid === 'room' ? W.lv.rnPeace * p.a : 0;
      for (const f of c.people.values()) {
        if (!inRoomNow(f, G)) continue;
        const h = f._h || 30, cy = f._y - h * (LOWP[f.pose] || 1) * 0.55;
        if (f.id === 'jesus') {
          const k = f.alpha * (0.5 + 0.25 * pk) * Math.max(0.5, nk);
          if (!litFigure(ctx, f, [236, 226, 206], k, 0.3 * k)) { ctx.globalCompositeOperation = 'lighter'; glowAt(SP.pale, f._x, cy, h * 0.3, 0.8 * k, 1.6); }
          ctx.globalCompositeOperation = 'lighter';
          glowAt(SP.pale, f._x, cy, h * 0.6, f.alpha * (0.1 + 0.12 * pk), 1.4);
        } else {
          const k = f.alpha * (0.42 * lamp + 0.16 * pk);
          const col = mix(f.robe || [150, 120, 90], LAMPC, 0.35);
          if (!litFigure(ctx, f, col, k, 0.18 * k)) { ctx.globalCompositeOperation = 'lighter'; glowAt(SP.amber, f._x, cy, h * 0.24, 0.6 * k, 1.6); }
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：提比哩亚海——船、网、炭火
  // ════════════════════════════════════════════════════════════
  function boatPos(p) {
    const q = BQ(), e = ease(clamp(p.k, 0, 1));
    return [lerp(q.sea[0], q.shore[0], e) * W.w, lerp(q.sea[1], q.shore[1], e) * W.h];
  }
  // 船与船上的人：比透视略大些（手机上再大些），好看清船上的人
  const BK = () => (PORT ? 1.25 : 1.08);
  const boatF = y => W.seaScale(y) * boost() * 1.3 * BK();
  const bob = () => Math.sin(W.t * 1.3) * 0.9;
  // 船上第 i 个位置（自船尾至船头）
  const CREW = ['andrew', 'philip', 'nathanael', 'thomas', 'james', 'john', 'peter'];
  function boatSlot(i) {
    const p = getP('boat');
    if (!p) return null;
    const [x, y] = boatPos(p), F = boatF(y), L = 122 * F;
    const f = -0.36 + (i / (CREW.length - 1)) * 0.7;
    return [x + f * L, y - 0.075 * L + bob() * F + netTilt() * f * L * 0.12];
  }
  const netTilt = () => { const n = getP('net'); return n ? clamp(n.k, 0, 1) * (1 - clamp(n.k2, 0, 1)) : 0; };
  const crewScale = () => { const p = getP('boat'); const y = p ? BQ().sea[1] * W.h : W.h * 0.77; return (W.seaScale(y) * BK()) / Math.max(0.01, W.layerScale(2)); };
  function drawBoatBack(ctx, p) {
    const [x, y0] = boatPos(p), F = boatF(y0), L = 122 * F, y = y0 + bob() * F;
    const tilt = netTilt() * 0.08;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(tilt);
    ctx.globalAlpha = p.a;
    // 桅与收起的帆
    const WOOD = [96, 72, 50];
    ctx.fillStyle = W.shadeCSS(WOOD, 0.1);
    ctx.fillRect(0.05 * L, -0.62 * L, 0.02 * L, 0.52 * L);
    ctx.fillRect(-0.12 * L, -0.56 * L, 0.36 * L, 0.018 * L);
    ctx.fillStyle = W.shadeCSS([214, 200, 172], 0.1);
    ctx.beginPath(); ctx.ellipse(0.06 * L, -0.55 * L, 0.17 * L, 0.02 * L, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = W.shadeCSS([140, 116, 90], 0.1, 0.7); ctx.lineWidth = Math.max(0.5, 0.6 * F);
    ctx.beginPath(); ctx.moveTo(0.06 * L, -0.62 * L); ctx.lineTo(0.48 * L, -0.12 * L); ctx.moveTo(0.06 * L, -0.62 * L); ctx.lineTo(-0.44 * L, -0.12 * L); ctx.stroke();
    // 船里（远的一舷，暗）
    ctx.fillStyle = W.shadeCSS(mul(WOOD, 0.6), 0.1);
    ctx.beginPath();
    ctx.moveTo(-0.5 * L, -0.16 * L); ctx.quadraticCurveTo(0, -0.1 * L, 0.52 * L, -0.19 * L); ctx.lineTo(0.46 * L, -0.08 * L); ctx.lineTo(-0.44 * L, -0.07 * L);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawBoatFront(ctx, p) {
    const [x, y0] = boatPos(p), F = boatF(y0), L = 122 * F, y = y0 + bob() * F;
    const tilt = netTilt() * 0.08;
    const WOOD = [110, 82, 56];
    // 水里的倒影与水沫
    ctx.globalAlpha = p.a;
    ctx.fillStyle = 'rgba(8,16,28,0.28)';
    ctx.beginPath(); ctx.ellipse(x, y + 0.05 * L, 0.56 * L, 0.05 * L, 0, 0, TAU); ctx.fill();
    ctx.save();
    ctx.translate(x, y); ctx.rotate(tilt);
    // 船身（船头朝右，向着岸）
    ctx.fillStyle = W.shadeCSS(WOOD, 0.1);
    ctx.beginPath();
    ctx.moveTo(-0.52 * L, -0.17 * L);
    ctx.quadraticCurveTo(-0.44 * L, 0.02 * L, -0.3 * L, 0.04 * L);
    ctx.lineTo(0.3 * L, 0.04 * L);
    ctx.quadraticCurveTo(0.46 * L, 0.01 * L, 0.56 * L, -0.21 * L);
    ctx.quadraticCurveTo(0.02 * L, -0.1 * L, -0.52 * L, -0.17 * L);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = W.shadeCSS([150, 116, 80], 0.1, 1, 0.05);
    ctx.beginPath();
    ctx.moveTo(-0.52 * L, -0.17 * L); ctx.quadraticCurveTo(0.02 * L, -0.1 * L, 0.56 * L, -0.21 * L);
    ctx.lineTo(0.55 * L, -0.18 * L); ctx.quadraticCurveTo(0.02 * L, -0.075 * L, -0.51 * L, -0.14 * L);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS([70, 50, 34], 0.1, 0.6); ctx.lineWidth = Math.max(0.5, 0.6 * F);
    ctx.beginPath(); ctx.moveTo(-0.46 * L, -0.06 * L); ctx.quadraticCurveTo(0, -0.02 * L, 0.48 * L, -0.08 * L); ctx.stroke();
    ctx.strokeStyle = W.shadeCSS([255, 236, 204], 0.1, 0.45 * W.daylight + 0.1); ctx.lineWidth = Math.max(0.5, 0.8 * F);
    ctx.beginPath(); ctx.moveTo(-0.52 * L, -0.17 * L); ctx.quadraticCurveTo(0.02 * L, -0.1 * L, 0.56 * L, -0.21 * L); ctx.stroke();
    // 船尾的灯（夜里打鱼）
    if (p.lit > 0.02) {
      const lx = -0.46 * L, ly = -0.3 * L;
      ctx.strokeStyle = W.shadeCSS(WOOD, 0.1); ctx.lineWidth = Math.max(0.6, 1 * F);
      ctx.beginPath(); ctx.moveTo(-0.5 * L, -0.15 * L); ctx.lineTo(lx, ly); ctx.stroke();
      flame(ctx, lx, ly + 2 * F, 4 * F, p.lit * p.a, p.seed);
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.warm, lx, ly, 70 * F, p.lit * p.a * (0.25 + 0.6 * nightK()));
        glowAt(SP.amber, lx + 0.4 * L, ly + 0.15 * L, 0.7 * L, p.lit * p.a * 0.35 * nightK(), 0.5);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
    ctx.globalAlpha = p.a;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(224,236,248)';
    ctx.globalAlpha = 0.28 * p.a;
    ctx.lineWidth = Math.max(0.6, 0.9 * F);
    ctx.beginPath(); ctx.ellipse(x, y + 0.04 * L, 0.52 * L, 0.03 * L, 0, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 船上的人：船身画在人之前（岸上的人自然挡住它），再只在船上的人的位置补画一次船身，遮住他们的腿
  function drawCrewHull(ctx, p) {
    const c = C();
    if (!c || !c.people) return;
    const [bx, by] = boatPos(p), L = 122 * boatF(by);
    let any = false;
    ctx.save();
    ctx.beginPath();
    for (const f of c.people.values()) {
      if (!f._vis || f.alpha < 0.02 || !f.attach || Math.abs(f._x - bx) > 0.62 * L || !(f._y < by + 2)) continue;
      const h = f._h || 20;
      ctx.rect(f._x - 0.45 * h, f._y - 1.15 * h, 0.9 * h, 1.15 * h + 0.03 * L);
      any = true;
    }
    if (any) { ctx.clip(); drawBoatFront(ctx, p); }
    ctx.restore();
  }
  // 网：撒在船的右边（船头之外的水里，浮子一圈）；鱼满了，银光翻腾；后来拉到岸上成一堆
  // k2：0 在船头外的水里 → 0.5 拖到船头右边的水边（沙上）→ 1 由彼得拉上岸（再靠前一些）
  function netAt(p) {
    const b = getP('boat');
    const [bx, by] = b ? boatPos(b) : [W.w * 0.56, W.h * 0.77], F = boatF(by), L = 122 * F;
    const water = [bx + 0.78 * L, by + 0.02 * L];
    const q = BQ(), s = LS(2), edge = [q.edge * W.w, gY(2, q.edge) - 1], land = [q.net * W.w, gY(2, q.net) + 6 * s];
    const k2 = clamp(p.k2, 0, 1), e = ease(clamp(k2 * 2, 0, 1)), e2 = ease(clamp(k2 * 2 - 1, 0, 1));
    const ax = lerp(water[0], edge[0], e), ay = lerp(water[1], edge[1], e);
    return { x: lerp(ax, land[0], e2), y: lerp(ay, land[1], e2), L, F, e, s: lerp(F, s * 0.8, e) };
  }
  // 水里的网（画在人之前：岸上的人挡住它，不会像一圈光套在人头上）
  function drawNetWater(ctx, p) {
    const N = netAt(p), full = p.k, e = N.e;
    ctx.globalAlpha = p.a;
    if (e < 0.98) {
      // 水里：一圈浮子与网绳（连到船头）
      const a = p.a * (1 - e), rx = 0.36 * N.L * (1 - 0.3 * full), ry = 0.07 * N.L;
      ctx.strokeStyle = rgba([220, 214, 196], 0.55 * a); ctx.lineWidth = Math.max(0.5, 0.7 * N.F);
      ctx.beginPath(); ctx.ellipse(N.x, N.y, rx, ry, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(N.x - rx, N.y); ctx.lineTo(N.x - 0.32 * N.L, N.y - 0.2 * N.L); ctx.stroke();
      ctx.fillStyle = rgba([236, 214, 170], 0.9 * a);
      for (let i = 0; i < 10; i++) { const t = (i / 10) * TAU; ctx.beginPath(); ctx.arc(N.x + Math.cos(t) * rx, N.y + Math.sin(t) * ry, Math.max(0.8, 1.1 * N.F), 0, TAU); ctx.fill(); }
      // 银光翻腾的鱼
      if (full > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        const n = Math.round(26 * full);
        for (let i = 0; i < n; i++) {
          const ph = W.t * (2.4 + hsh(i) * 2) + i * 1.7, ox = (hsh(i * 3.1) - 0.5) * 1.7 * rx, oy = (hsh(i * 5.3) - 0.5) * 1.6 * ry;
          const tw = 0.5 + 0.5 * Math.sin(ph);
          ctx.globalAlpha = a * full * (0.25 + 0.6 * tw);
          ctx.fillStyle = 'rgb(214,232,248)';
          ctx.beginPath(); ctx.ellipse(N.x + ox, N.y + oy - tw * 1.5 * N.F, 2.2 * N.F, 0.8 * N.F, Math.sin(ph) * 0.8, 0, TAU); ctx.fill();
        }
        if (SP) glowAt(SP.silver, N.x, N.y, rx * 1.3, a * full * 0.35, 0.4);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 岸上的一堆网（在人的脚前）
  function drawNetLand(ctx, p) {
    const N = netAt(p), e = N.e;
    if (e > 0.02) {
      // 岸上：一堆满是大鱼的网，网却没有破（约 21:11）
      const a = p.a * e, s = N.s, x = N.x, y = N.y;
      ctx.globalAlpha = a;
      ctx.fillStyle = css([92, 84, 70], 2, 0.9);
      ctx.beginPath(); ctx.ellipse(x, y - 2 * s, 17 * s, 5.5 * s, 0, Math.PI, 0); ctx.fill();
      for (let i = 0; i < 34; i++) {
        const ox = (hsh(i * 2.3) - 0.5) * 30 * s, oy = -hsh(i * 4.1) * 6 * s * (1 - Math.abs(ox) / (18 * s));
        ctx.fillStyle = css(hsh(i * 7.7) < 0.5 ? [196, 206, 214] : [168, 176, 170], 2, 1, 0.15);
        ctx.beginPath(); ctx.ellipse(x + ox, y - 1.5 * s + oy, 2.6 * s, 0.95 * s, (hsh(i) - 0.5) * 0.9, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = css([60, 54, 46], 2, 0.6); ctx.lineWidth = Math.max(0.4, 0.45 * s);
      ctx.beginPath();
      for (let i = -3; i <= 3; i++) { ctx.moveTo(x + i * 5 * s - 3 * s, y - 1 * s); ctx.lineTo(x + i * 5 * s + 3 * s, y - 7 * s); ctx.moveTo(x + i * 5 * s + 3 * s, y - 1 * s); ctx.lineTo(x + i * 5 * s - 3 * s, y - 7 * s); }
      ctx.stroke();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 6; i++) {
          const tw = 0.5 + 0.5 * Math.sin(W.t * 2.2 + i * 2.1);
          glowAt(SP.silver, x + (hsh(i * 9.1) - 0.5) * 26 * s, y - 3 * s - hsh(i * 3.3) * 4 * s, 3 * s, a * 0.5 * tw * dayA());
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 炭火：一圈石头、发红的炭、小小的火苗；上面有鱼，旁边有饼（约 21:9）
  function drawFire(ctx, p) {
    const s = LS(2), x = p.x * W.w, y = gY(2, p.x) + 2.5 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([112, 104, 94], 2);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const ox = (i - 2.5) * 3.3 * s; ctx.moveTo(x + ox + 2 * s, y); ctx.ellipse(x + ox, y - 0.6 * s, 2 * s, 1.5 * s, 0, 0, TAU); }
    ctx.fill();
    const f = p.fire;
    ctx.fillStyle = rgba([60 + 170 * f, 26 + 50 * f, 18], p.a);
    ctx.beginPath(); ctx.ellipse(x, y - 1.6 * s, 7.5 * s, 1.8 * s, 0, 0, TAU); ctx.fill();
    if (f > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) { const tw = 0.6 + 0.4 * Math.sin(W.t * (3 + i) + i * 1.9); glowAt(SP.lamp, x + (i - 2) * 3 * s, y - 1.8 * s, 3.2 * s, f * p.a * tw * 0.7); }
      glowAt(SP.warm, x, y - 5 * s, 40 * s, f * p.a * (0.12 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x - 2 * s, y - 2 * s, 5 * s * f, f * p.a * (0.55 + 0.45 * nightK()), p.seed);
      flame(ctx, x + 2.6 * s, y - 2 * s, 3.6 * s * f, f * p.a * (0.5 + 0.5 * nightK()), p.seed + 3);
    }
    // 鱼在炭上
    if (p.k > 0.01) {
      ctx.globalAlpha = p.a * p.k;
      ctx.fillStyle = css([150, 132, 110], 2, 1, 0.1);
      for (const ox of [-3.2, 3]) {
        const fx0 = x + ox * s, fy = y - 3.6 * s;
        ctx.beginPath(); ctx.ellipse(fx0, fy, 3 * s, 0.95 * s, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(fx0 + 2.6 * s, fy); ctx.lineTo(fx0 + 4.2 * s, fy - 1 * s); ctx.lineTo(fx0 + 4.2 * s, fy + 1 * s); ctx.closePath(); ctx.fill();
      }
    }
    // 饼
    if (p.k2 > 0.01) {
      ctx.globalAlpha = p.a * p.k2;
      ctx.fillStyle = css([210, 164, 104], 2, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(x + 12 * s, y - 1.4 * s, 2.8 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 15.6 * s, y - 1.2 * s, 2.6 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：加利利那座约定的山（太 28:16）
  // ════════════════════════════════════════════════════════════
  const mountHW = () => (PORT ? 108 : 150) * LS(2);
  const mountH = () => (PORT ? 100 : 118) * LS(2);
  function mountK(u) {
    if (u <= -1 || u >= 1) return 0;
    const b = Math.pow(1 - u * u, 1.35) * (1 - 0.12 * u);
    return b * (1 + 0.05 * Math.sin(u * 9.3) + 0.03 * Math.sin(u * 23.1));
  }
  // 山上某一处的地面（像素 y）：自当地的地面量起（山脚与草地相接，没有台阶；山外就是原来的地面）
  function mountY(xf) {
    const p = getP('mount');
    const g = gY(2, xf);
    if (!p || p.grow < 0.001) return g;
    const u = (xf * W.w - p.x * W.w) / mountHW();
    if (u <= -1 || u >= 1) return g;
    return g - mountH() * p.grow * mountK(u);
  }
  const summitX = () => { const p = getP('mount'); return p ? p.x - (0.02 * mountHW()) / W.w : X.mount; };
  function onMount(id) { attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, mountY(f.nx) + 1] : null; }); }
  function drawMount(ctx, p) {
    const g = p.grow;
    if (g <= 0.005) return;
    const cx = p.x * W.w, hw = mountHW(), H = mountH() * g, gc = gY(2, p.x) + 3, s = LS(2);
    const gl = u => gY(2, (cx + u * hw) / W.w);
    const N = 60, top = u => gl(u) - H * mountK(u);
    ctx.globalAlpha = p.a;
    const gr = ctx.createLinearGradient(0, gc - H, 0, gc);
    gr.addColorStop(0, css([128, 142, 104], 2)); gr.addColorStop(0.5, css([98, 122, 80], 2)); gr.addColorStop(1, css([78, 104, 64], 2));
    ctx.fillStyle = gr;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const u = -1 + (2 * i) / N; const X1 = cx + u * hw; if (i) ctx.lineTo(X1, top(u)); else ctx.moveTo(X1, top(u)); }
    ctx.lineTo(cx + hw, gY(2, (cx + hw) / W.w) + 10 * s); ctx.lineTo(cx - hw, gY(2, (cx - hw) / W.w) + 10 * s);
    ctx.closePath(); ctx.fill();
    // 背光的一面
    const d = litX() >= cx ? 1 : -1;
    ctx.fillStyle = css([40, 52, 40], 2, 0.3);
    ctx.beginPath();
    ctx.moveTo(cx - d * 0.02 * hw, top(-d * 0.02));
    for (let i = 0; i <= 20; i++) { const u = -d * (0.02 + (0.98 * i) / 20); ctx.lineTo(cx + u * hw, top(u)); }
    ctx.lineTo(cx - d * hw, gl(-d) + 8 * s);
    ctx.quadraticCurveTo(cx - d * 0.35 * hw, gc - H * 0.3, cx - d * 0.02 * hw, top(-d * 0.02));
    ctx.fill();
    // 岩石与灌木
    ctx.fillStyle = css([150, 146, 128], 2);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const u = -0.8 + hsh(i * 3.3 + p.seed) * 1.6, k = mountK(u);
      if (k < 0.15) continue;
      const x = cx + u * hw, y = gl(u) - H * k * (0.35 + 0.55 * hsh(i * 7.1)), r = (2.5 + 3 * hsh(i * 1.9)) * s;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.6, 0, Math.PI, 0);
    }
    ctx.fill();
    ctx.fillStyle = css([62, 88, 50], 2);
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const u = -0.92 + hsh(i * 5.7 + p.seed) * 1.84, k = mountK(u);
      const x = cx + u * hw, y = Math.min(top(u) + (2 + 12 * hsh(i * 2.9)) * s, gl(u)), r = (2.4 + 2.6 * hsh(i * 4.4)) * s;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.66, 0, 0, TAU);
    }
    ctx.fill();
    // 上山的小路（左坡）
    ctx.strokeStyle = css([206, 190, 150], 2, 0.4 * dayA() + 0.1, 0.1); ctx.lineWidth = Math.max(0.6, 1.4 * s);
    ctx.beginPath();
    for (let i = 0; i <= 14; i++) { const u = -1.05 + (1.02 * i) / 14; const X1 = cx + u * hw, Y1 = top(u) + 2.2 * s; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.stroke();
    // 迎光的山脊
    ctx.strokeStyle = css([240, 236, 200], 2, 0.4 * dayA() + 0.08, 0.2); ctx.lineWidth = Math.max(0.7, 1.4 * s);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const u = -1 + (2 * i) / N; if (u * d < -0.05 || mountK(u) < 0.05) continue; const X1 = cx + u * hw; ctx.lineTo(X1, top(u)); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上来的光、复活的晨光、万民之光、常同在的光
  // ════════════════════════════════════════════════════════════
  // 天开了：自天顶落下一道光柱（落在坟墓 / 山顶）
  function drawHeaven(ctx) {
    const k = W.lv.rnHeaven;
    if (k < 0.01 || !SP) return;
    const tp = getP('tomb'), mp = getP('mount');
    let xf, gy;
    if (mp && mp.a > 0.3) { xf = summitX(); gy = mountY(xf); }
    else if (tp) { const st = stoneAt(tp); xf = st.x / W.w; gy = tombG(tp).y; }
    else return;
    const x = xf * W.w, w = 120 * SU() * (0.6 + 0.4 * k);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.5 * k;
    ctx.drawImage(SP.beam, x - w / 2, -10, w, gy + 10);
    glowAt(SP.white, x, 0, 200 * SU(), 0.55 * k, 0.6);
    glowAt(SP.gold, x, gy - 30 * SU(), 90 * SU(), 0.3 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 使者自天降下时，路上一串光
  function drawDescent(ctx) {
    const d = W.lv.rnDescend, f = fig('angel1');
    if (!f || d <= 0.01 || d >= 0.999 || !SP || !f._vis) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 8; i++) glowAt(SP.white, f._x, f._y - f._h * 0.5 - i * f._h * 0.45, f._h * (0.9 - i * 0.08), 0.28 * (1 - i / 8));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 复活的晨光：园子里（坟墓前）一层暖金
  function drawRisen(ctx) {
    const k = W.lv.rnRisen;
    if (k < 0.01 || !SP) return;
    const tp = getP('tomb');
    const x = tp ? tp.x * W.w : W.w * 0.7, y = tp ? gY(2, tp.x) : W.h * 0.86;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.dawn, x - 40 * SU(), y - 40 * SU(), 260 * SU(), 0.16 * k * (tp ? tp.a : 1), 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 万民之光：自山顶向两边，沿远山、中丘的岭线一路亮去；远处的海岛也亮起来
  let WL = null;
  function worldPts() {
    if (WL && WL.w === W.w && WL.h === W.h) return WL;
    const pts = [];
    const sx = summitX();
    for (const l of [0, 1]) {
      const sp = W.landSpan(l);
      if (!sp) continue;
      const a = sp[0] / W.w, b = sp[1] / W.w, n = l === 0 ? 22 : 12;
      for (let i = 0; i < n; i++) {
        const f = a + (b - a) * ((i + 0.2 + hsh(i * 3.7 + l * 11) * 0.6) / n);
        pts.push({ l, f, d: Math.abs(f - sx) / 1.0, r: hsh(i * 5.1 + l) });
      }
    }
    WL = { w: W.w, h: W.h, pts, sx };
    return WL;
  }
  function drawWorld(ctx, l) {
    const k = W.lv.rnWorld;
    if (k < 0.005 || !SP) return;
    const G = worldPts(), front = k * 1.02;
    const s = LS(l);
    ctx.globalCompositeOperation = 'lighter';
    for (const q of G.pts) {
      if (q.l !== l) continue;
      const a = clamp((front - q.d) * 7, 0, 1);
      if (a < 0.01) continue;
      const x = q.f * W.w, y = gY(l, q.f) - 2 * s;
      const tw = 0.8 + 0.2 * Math.sin(W.t * 2 + q.r * 9);
      glowAt(SP.gold, x, y, (l === 0 ? 10 : 14) * s * (1 + 0.6 * (1 - a)), a * tw * 0.8);
      glowAt(SP.white, x, y, (l === 0 ? 3 : 4) * s, a * tw);
    }
    // 光走过的前沿：一道亮的沿着岭线向两边去
    if (k < 1) {
      for (const dir of [-1, 1]) {
        const f = G.sx + dir * front;
        if (f < -0.05 || f > 1.05) continue;
        const x = f * W.w, y = gY(l, clamp(f, 0, 1)) - 2 * s;
        glowAt(SP.white, x, y, 22 * s, 0.6 * (1 - k));
        glowAt(SP.gold, x, y, 60 * s, 0.25 * (1 - k), 0.5);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 那没有看见就信的有福了：满城点灯时，远山上的村落也一处处点起灯来（夜里）
  function drawFarLamps(ctx) {
    const cp = getP('city');
    if (!cp || cp.style === 'village' || !SP) return;
    const big = clamp((cp.lit - 0.6) / 0.4, 0, 1) * cp.a * nightK();
    if (big < 0.02) return;
    const G = worldPts(), s = LS(0);
    ctx.globalCompositeOperation = 'lighter';
    let i = 0;
    for (const q of G.pts) {
      if (q.l !== 0) continue;
      i++;
      const a = clamp(big * 1.6 - q.r * 0.6, 0, 1);
      if (a < 0.01) continue;
      const x = q.f * W.w, y = gY(0, q.f) - 1.5 * s, tw = 0.8 + 0.2 * Math.sin(W.t * 2.6 + i * 1.7);
      glowAt(SP.lamp, x, y, 9 * s, a * tw * 0.75);
      ctx.globalAlpha = a * tw;
      ctx.fillStyle = 'rgb(255,206,130)';
      ctx.fillRect(x - 0.7 * s, y - 0.7 * s, 1.4 * s, 1.4 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 海上的光路：自岸边一直到天边（地极）
  function drawSeaPath(ctx) {
    const k = W.lv.rnWorld;
    if (k < 0.02 || !SP) return;
    const x0 = W.w * (PORT ? 0.36 : 0.5), y0 = W.h * 0.76, x1 = W.w * 0.08, y1 = W.horizonY + 2;
    const e = clamp(k * 1.3, 0, 1);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      if (t > e) break;
      const x = lerp(x0, x1, t), y = lerp(y0, y1, Math.pow(t, 0.7)), sc = W.seaScale(y);
      const tw = 0.7 + 0.3 * Math.sin(W.t * 2.5 + i * 1.3);
      glowAt(SP.gold, x, y, 26 * sc * boost(), 0.3 * tw);
    }
    if (e >= 1) glowAt(SP.white, x1, y1, 18 * SU(), 0.5 + 0.2 * Math.sin(W.t * 2));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 常与你们同在：山顶的光照满天，光芒缓缓转动
  function drawGlory(ctx) {
    const k = W.lv.rnGlory;
    if (k < 0.01 || !SP) return;
    const mp = getP('mount');
    const xf = mp ? summitX() : 0.8, y = mp ? mountY(xf) - 40 * LS(2) : W.h * 0.6, x = xf * W.w;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.dawn, x, y, Math.max(W.w, W.h) * 0.75, 0.3 * k, 0.5);
    glowAt(SP.gold, x, y, 260 * SU(), 0.3 * k, 0.8);
    glowAt(SP.white, x, y, 110 * SU(), 0.45 * k);
    const R = Math.max(W.w, W.h) * 0.9;
    ctx.fillStyle = 'rgb(255,240,200)';
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU + W.t * 0.02, w = 0.045 + 0.02 * Math.sin(i * 2.7);
      ctx.globalAlpha = 0.075 * k * (0.7 + 0.3 * Math.sin(W.t * 0.7 + i));
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a - w) * R, y + Math.sin(a - w) * R); ctx.lineTo(x + Math.cos(a + w) * R, y + Math.sin(a + w) * R); ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 以马忤斯的路上：摩西与众先知的话——头上一卷展开的光
  function drawScroll(ctx) {
    const k = W.lv.rnScroll;
    if (k < 0.01 || !SP) return;
    const a = headOf('jesus', 1), b = headOf('cleopas', 1);
    const x = (a[0] + b[0]) / 2, y = Math.min(a[1], b[1]) - 46 * SU(), w = 70 * SU() * k;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, x, y, w * 1.4, 0.35 * k, 0.4);
    ctx.globalAlpha = 0.55 * k;
    ctx.fillStyle = 'rgb(255,236,190)';
    ctx.fillRect(x - w, y - 5 * SU(), w * 2, 10 * SU());
    ctx.globalAlpha = 0.8 * k;
    ctx.fillStyle = 'rgb(255,248,226)';
    ctx.fillRect(x - w - 2 * SU(), y - 7 * SU(), 4 * SU(), 14 * SU());
    ctx.fillRect(x + w - 2 * SU(), y - 7 * SU(), 4 * SU(), 14 * SU());
    // 字行：一行行小的光点
    for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) {
      const t = (i + 0.5) / 16, tw = 0.5 + 0.5 * Math.sin(W.t * 3 + i * 1.3 + r * 2);
      ctx.globalAlpha = 0.5 * k * tw;
      ctx.fillRect(x - w * 0.9 + t * w * 1.8, y - 3.2 * SU() + r * 3 * SU(), 1.6 * SU(), 1.2 * SU());
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 转瞬的光：光柱、一缕缕的光（吹气、递饼）
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      if (e.t < 0) continue;
      const q = e.t / e.dur;
      if (e.type === 'beam') {
        const env = Math.sin(Math.PI * Math.min(1, q)) * e.k, x = e.xf * W.w, y = e.y || W.h * 0.8;
        ctx.globalAlpha = 0.55 * env;
        ctx.drawImage(SP.beam, x - e.w / 2, -10, e.w, y + 10);
        glowAt(SP.white, x, y - 20 * SU(), e.w * 0.7, 0.4 * env);
      } else if (e.type === 'breath') {
        const a = headOf(e.from, 0.72), b = headOf(e.to, 0.62);
        const n = 7;
        for (let i = 0; i < n; i++) {
          const t = clamp(q * 1.25 - i * 0.05, 0, 1);
          if (t <= 0 || t >= 1) continue;
          const x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t) - Math.sin(Math.PI * t) * 20 * SU() + Math.sin(W.t * 5 + e.seed + i) * 2 * SU();
          ctx.globalAlpha = 0.8 * Math.sin(Math.PI * t) * (1 - i / n);
          ctx.drawImage(SP.pale, x - 7 * SU(), y - 7 * SU(), 14 * SU(), 14 * SU());
          ctx.fillStyle = U.rgba(e.rgb[0], e.rgb[1], e.rgb[2], 1);
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
        if (q > 0.78) glowAt(SP.pale, b[0], b[1], 14 * SU(), (1 - q) * 3 * 0.7);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 复活的主身边一层淡淡的光（夜里、晨昏更显；人认得出他在哪里）
  function drawAura(ctx) {
    const f = fig('jesus');
    if (!f || !f._vis || f.alpha < 0.02 || !SP) return;
    // 屋里另由前面照亮（drawRoomLight）：身后不再衬一团光
    for (const rid of ['room', 'emm']) { const p = getP(rid); if (p && p.a > 0.3 && inRoomNow(f, roomG(p))) return; }
    const k = f.alpha * (0.14 + 0.4 * nightK());
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.pale, f._x, f._y - f._h * 0.5, f._h * 1.25, k, 1.2);
    glowAt(SP.gold, f._x, f._y - f._h * 0.2, f._h * 0.9, k * 0.6, 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 彼得在水里：站着涉水，水齐到腰（只盖住下半身），腰间一圈圈水纹（只是画面：涉水的那几秒）
  let swimming = false;
  function drawSwim(ctx) {
    const f = fig('peter');
    if (!swimming || !f || !f._vis) return;
    const h = f._h || 30, x = f._x, y = f._y, wl = y - h * 0.44, hw = h * 0.4;
    // 不画到船身上（刚离船的那一刻）
    const bp = getP('boat');
    ctx.save();
    if (bp) { const q = boatPos(bp), L = 122 * boatF(q[1]); ctx.beginPath(); ctx.rect(0, q[1] + 0.05 * L, W.w, W.h); ctx.clip(); }
    // 水色随天光（天将亮时是暗的蓝灰）；两边渐淡，与后面的海融在一起
    const wc = mix([22, 28, 44], [60, 96, 130], Math.pow(clamp((W.daylight - 0.3) / 0.7, 0, 1), 1.5));
    const gr = ctx.createLinearGradient(x - hw, 0, x + hw, 0);
    gr.addColorStop(0, rgba(wc, 0)); gr.addColorStop(0.28, rgba(wc, 0.93)); gr.addColorStop(0.72, rgba(wc, 0.93)); gr.addColorStop(1, rgba(wc, 0));
    ctx.fillStyle = gr;
    ctx.fillRect(x - hw, wl, hw * 2, y + 2 - wl);
    ctx.strokeStyle = 'rgba(226,238,250,0.7)'; ctx.lineWidth = Math.max(0.6, h * 0.018);
    for (let i = 0; i < 3; i++) {
      const r = h * (0.16 + i * 0.12 + ((W.t * 0.9) % 1) * 0.12);
      ctx.globalAlpha = 0.55 * (1 - i / 3);
      ctx.beginPath(); ctx.ellipse(x, wl, r, r * 0.22, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const DRAW_UNDER = { tomb: drawTomb, olive: drawOlive, lilies: drawLilies, city: drawCity, road: drawRoad, hut: drawHut, room: drawRoom, fire: drawFire, mount: drawMount };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const ORDER = { mount: 0, city: 1, olive: 2, road: 3, hut: 4, room: 5, tomb: 6, lilies: 7, fire: 8 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  const SCENE = {
    init() { sprites(); },
    resize() { WL = null; for (const p of P.values()) p.model = null; },
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
      // 人的大小慢慢变（上岸）
      for (const [id, k] of SCL) {
        const q = fig(id);
        if (!q) { SCL.delete(id); continue; }
        const st = 0.5 * f;
        if (Math.abs(k - q.scale) <= st) { q.scale = k; SCL.delete(id); } else q.scale += Math.sign(k - q.scale) * st;
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { drawGlory(ctx); drawHeaven(ctx); return; }
      if (pass === 'air') {
        U.safe('risen.swim', () => drawSwim(ctx));
        const b = getP('boat');
        if (b && b.a > 0.005) U.safe('risen.boat.crew', () => drawCrewHull(ctx, b));
        const n = getP('net');
        if (n && n.a > 0.005) U.safe('risen.net', () => drawNetLand(ctx, n));
        U.safe('risen.roomLight', () => drawRoomLight(ctx));
        for (const r of ['emm', 'room']) { const p = getP(r); if (p) U.safe('risen.table', () => drawTable(ctx, p)); }
        drawRisen(ctx);
        drawDescent(ctx);
        U.safe('risen.scroll', () => drawScroll(ctx));
        drawTransients(ctx);
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.005) continue;
        const fn = DRAW_UNDER[p.kind];
        if (fn) U.safe('risen.' + p.kind, () => fn(ctx, p));
      }
      if (l < 2) U.safe('risen.world', () => drawWorld(ctx, l));
      else drawAura(ctx);
      if (l === 0) U.safe('risen.farLamps', () => drawFarLamps(ctx));
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'seaNear') { drawSeaPath(ctx); return; }
      if (pass !== 'near') return;
      const b = getP('boat');
      if (b && b.a > 0.005) { U.safe('risen.boat.back', () => drawBoatBack(ctx, b)); U.safe('risen.boat.front', () => drawBoatFront(ctx, b)); }
      const n = getP('net');
      if (n && n.a > 0.005) U.safe('risen.net.water', () => drawNetWater(ctx, n));
    },
    reset() { P.clear(); FXL.length = 0; SCL.clear(); sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
      for (const [id, k] of SCL) { const q = fig(id); if (q) q.scale = k; }
      SCL.clear();
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), p.ta, r2(p.tk), r2(p.tk2), r2(p.tlit), r2(p.tfire), r2(p.topen), r2(p.tgrow), p.label, p.style].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer);
        if (p.kind === 'tomb') {
          const G = tombG(p), st = stoneAt(p);
          consider(p.k > 0.5 ? '空坟墓' : '坟墓', G.x, G.y - G.dh * 0.6);
          consider('石头', st.x, st.y - st.r * 0.6);
        } else if (p.kind === 'city') consider(p.label, p.xt * W.w, gY(p.layer, p.xt) - 26 * s);
        else if (p.kind === 'room') { const G = roomG(p); consider(p.label, G.cx, G.top - 4 * s); if (p.style === 'emmaus' && p.k > 0.5) consider('饼', G.x0 + G.w * 0.45, G.y - 8 * s); }
        else if (p.kind === 'mount') { const xf = summitX(); consider(p.label, xf * W.w, mountY(xf) - 6 * s); }
        else if (p.kind === 'fire') consider(p.label, p.x * W.w, gY(2, p.x) - 6 * s);
        else if (p.kind === 'boat') { const q = boatPos(p); consider(p.label, q[0], q[1] - 20 * boatF(q[1])); }
        else if (p.kind === 'net') { const q = netAt(p); consider(p.label, q.x, q.y - 4 * q.s); }
        else if (p.kind === 'road' || p.kind === 'lilies') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, gY(2, xf)); }
        else consider(p.label, p.x * W.w, gY(p.layer, p.x) - 14 * s);
      }
      return best;
    },
  };

  // 本幕开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0; SCL.clear(); sorted = []; sortedN = -1; WL = null; swimming = false;
    S = fresh();
  }

  // ════════════════════════════════════════════════════════════
  //  几件常用的事
  // ════════════════════════════════════════════════════════════
  // 园子：橄榄树与百合（显 / 隐）
  function garden(show) {
    const ol = [[0.528, 1.05], [0.588, 0.85], [0.935, 1.1]];
    ol.forEach((q, i) => { if (show) prop('olive' + i, 'olive', { x: PX(q[0]), size: q[1], label: '园子' }); else unprop('olive' + i); });
    if (show) {
      prop('lilyA', 'lilies', { x0: PX(0.505), x1: PX(0.6), w: PORT ? 7 : 12, label: '园子' });
      prop('lilyB', 'lilies', { x0: PX(0.84), x1: PX(0.93), w: PORT ? 5 : 9 });
    } else { unprop('lilyA'); unprop('lilyB'); }
  }
  // 屋里的人（前面敞开的屋子）：按屋里的位置（0..1）放好，站在屋里的地上
  function inRoom(rid, id, f, o) {
    o = o || {};
    const x = roomX(rid, f);
    if (o.walk) walk(id, x, { speed: o.speed || 0.03, pose: o.pose });
    else { place(id, x); if (o.pose) pose(id, o.pose); }
    onFloor(id, rid, o.row);
    if (o.face != null) face(id, o.face);
  }
  // 屋里的座次：[id, 屋里的位置 0..1, 排（0 后 / 1 前）, 起初的姿势]；耶稣站在当中（0.5），两边各空出一段
  const ROOM7 = {
    d: [['andrew', 0.1, 0, 'sit'], ['cleopas', 0.18, 1, 'kneel'], ['james', 0.25, 0, 'bow'], ['emm2', 0.31, 1, 'sit'], ['peter', 0.38, 0, 'kneel'],
      ['john', 0.62, 0, 'kneel'], ['nathanael', 0.68, 1, 'sit'], ['philip', 0.74, 0, 'bow'], ['matthew', 0.8, 1, 'sit']],
    p: [['andrew', 0.09, 0, 'sit'], ['james', 0.19, 1, 'bow'], ['peter', 0.29, 0, 'kneel'], ['cleopas', 0.37, 1, 'sit'],
      ['john', 0.64, 0, 'kneel'], ['nathanael', 0.72, 1, 'sit'], ['emm2', 0.8, 0, 'bow']],
  };
  // 门徒看见主，就喜乐了：各样的姿势（前排跪、拜；后排站、举手），都转向他
  const JOY = { peter: 'worship', john: 'kneel', james: 'raise', andrew: 'stand', cleopas: 'raise', emm2: 'kneel', nathanael: 'worship', philip: 'raise', matthew: 'kneel' };
  const ROOM9 = {
    d: [['andrew', 0.1, 0], ['james', 0.18, 1], ['peter', 0.27, 0], ['john', 0.35, 1], ['nathanael', 0.68, 0], ['philip', 0.74, 1], ['matthew', 0.8, 0]],
    p: [['andrew', 0.09, 0], ['james', 0.19, 1], ['peter', 0.29, 0], ['john', 0.37, 1], ['nathanael', 0.76, 0]],
  };
  const faceJ = id => { const f = fig(id); if (f) face(id, f.nx < roomX('room', 0.5) ? 1 : -1); };
  // 一只一只的羊（位置、远近都定好，重演时一样）：[x, v, 朝向]
  function flock(gid, kind, label, list, b) {
    list.forEach((q, i) => {
      const id = gid + i;
      if (has(id)) return;
      C().animal(id, { kind, x: q[0], layer: 2, label, facing: q[2] || (i % 2 ? -1 : 1), pose: 'graze', v: q[1], from: b.instant ? 'none' : 'fade' });
    });
  }
  function unflock(gid, n) { for (let i = 0; i < n; i++) if (has(gid + i)) C().remove(gid + i); }
  // 船上的人：挂在船的第 i 个位置上，小些
  function aboard(id, i) {
    attach(id, () => boatSlot(i));
    SCL.delete(id);
    const f = fig(id); if (f) f.scale = crewScale();
  }
  // 从船上跳到岸上的某处（先挂在船上的一点，再落到地上）
  function ashore(b, id, x, poseAfter) {
    const f = fig(id);
    if (!f) return;
    const at = f._vis && isFinite(f._y) ? f._y / W.h : null;
    attach(id, null);
    if (!b.instant && at != null) { f.ny = at; fly(id, x, null, { dur: 1.1, pose: poseAfter || 'stand' }); }
    else { place(id, x); f.ny = null; if (poseAfter) pose(id, poseAfter); }
    scaleTo(id, 1);
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：七日的头一日，天快亮的时候——园中的坟墓
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    W.set('bare', 0.08, true); W.set('bloom', 0.12, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.72, herbs: 0.5, trees: 0.16, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      rnHeaven: 0, rnDescend: 0, rnRisen: 0, rnPeace: 0, rnScroll: 0, rnWorld: 0, rnGlory: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * PX(0.6), W.ridgeBaseY(2, W.w * PX(0.6)));
    W.setOrigin('herbs', W.w * PX(0.56), W.ridgeBaseY(2, W.w * PX(0.56)));
    // 大树：桌面放在右边的尽头（不在经文的下面，也不挡船、屋、山）；竖屏的经文在上面，树仍在左边
    const tx = PORT ? 0.44 : 0.965;
    W.setOrigin('trees', W.w * tx, W.ridgeBaseY(2, W.w * tx));
    W.goTo(0.212, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 14, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 园子、坟墓（封着）、耶路撒冷在中丘上
    garden(true);
    prop('tomb', 'tomb', { x: X.door, k: 0, k2: 0, label: '坟墓' });
    prop('city', 'city', { x0: PORT ? 0.6 : 0.62, x1: 0.99, xt: PORT ? 0.8 : 0.84, layer: 1, lit: 0.35, label: '耶路撒冷' });
    const c = C();
    c.clear({ fade: false });
    // 看守的兵（太 27:66）：一个举着火把
    add('guard1', { label: '看守的人', sex: 'm', x: xo(X.door, -64), facing: -1, robe: ROBE.guard, accent: [176, 150, 104], glow: 0.12, prop: 'torch' });
    // 另一个站在磐石右端之外的平地上（不站在石面上）
    add('guard2', { label: '看守的人', sex: 'm', x: xo(X.door, 127), facing: -1, robe: ROBE.guard, accent: [176, 150, 104], glow: 0.1, prop: 'spear' });
    // 两个马利亚远远站着，捧着香料（可 16:1）
    add('magdalene', Object.assign({}, LOOK().magdalene || { label: '抹大拉的马利亚', sex: 'f', robe: [150, 84, 96] }, { x: X.women, facing: 1, prop: 'jar', glow: 0.3 }));
    add('mary2', { label: '那个马利亚', sex: 'f', x: X.mary2, facing: 1, robe: ROBE.mary2, accent: [224, 214, 196], hair: 'veil', glow: 0.26, prop: 'jar' });
    avoid([0.35, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 太 28:2 有主的使者从天上下来，把石头滚开 ──────────────────
    {
      kind: 'act', utter: '有主的使者从天上下来，把石头滚开', cmd: 'rollback 石头 --from 墓门  # 地大震动', ref: '马太福音 28:2',
      verse: [
        { text: '忽然，地大震动；因为有主的使者从天上下来，<br>把石头滚开，坐在上面。', ref: '马太福音 28:2', hold: 6.5 },
        { text: '他的相貌如同闪电，衣服洁白如雪。<br>看守的人就因他吓得浑身乱战，甚至和死人一样。', ref: '马太福音 28:3–4', hold: 7 },
      ],
      apply(c) {
        const landX = () => xo(X.door, -22);
        T(c, [
          [0, b => {
            shake(b, 0.9); sfx(b, 'quake');
            W.set('rnHeaven', 1, b.instant);
            W.goTo(0.235, 14, b.instant);
            face('guard1', 1); face('guard2', -1);
            pose('magdalene', 'gaze'); pose('mary2', 'gaze');
          }],
          // 使者自光中降下（一路光）
          [0.6, b => {
            add('angel1', { label: '主的使者', sex: 'm', age: 'adult', x: landX(), facing: 1, angel: true, robe: ROBE.angel, glow: 1, from: b.instant ? 'none' : 'light' });
            const yTop = W.h * 0.1;
            attach('angel1', () => { const x = landX() * W.w, g = gY(2, landX()); return [x, lerp(yTop, g, ease(clamp(W.lv.rnDescend, 0, 1)))]; });
            W.set('rnDescend', 1, b.instant);
            sfx(b, 'angel');
          }],
          [3.6, b => {
            attach('angel1', null); place('angel1', landX()); pose('angel1', 'point'); face('angel1', 1);
            if (!b.instant && fx()) { const h = headOf('angel1', 0); fx().ring(h[0], h[1], [255, 250, 236], M() * 0.2, 1.8, 2); }
          }],
          // 石头滚开
          [4, b => { prop('tomb', null, { k: 1 }); shake(b, 0.5); sfx(b, 'stone', { low: true }); }],
          [6.6, b => { prop('tomb', null, { k2: 1, label: '空坟墓' }); pose('angel1', 'stand'); }],
          // 坐在上面
          [7.2, b => {
            const st = stoneSeat();
            if (st && !b.instant) fly('angel1', st[0] / W.w, st[1] / W.h, { dur: 1.1, pose: 'seat' });
          }],
          [8.4, b => { attach('angel1', stoneSeat); pose('angel1', 'seat'); face('angel1', -1); }],
          // 他的相貌如同闪电
          [8.6, b => { flashW(b, 0.85); sfx(b, 'thunder', { soft: true, far: true }); }],
          [9.8, b => { face('guard2', 1); pose('guard1', 'fall'); pose('guard2', 'fall'); glow('guard1', 0.05); glow('guard2', 0.05); sfx(b, 'collapse', { soft: true }); }],
          [11, b => { pose('magdalene', 'kneel'); pose('mary2', 'kneel'); glow('magdalene', 0.4); glow('mary2', 0.36); }],
          [12.4, b => { W.set('rnHeaven', 0.18, b.instant); W.set('rnRisen', 0.3, b.instant); }],
        ]);
      },
    },

    // ── 2 · 路 24:7 钉在十字架上，第三日复活 ──────────────────────
    {
      kind: 'promise', utter: '钉在十字架上，第三日复活', cmd: 'assert(第三日 → 复活)  # 照他所说的', ref: '路加福音 24:7',
      verse: [
        { text: '她们就进去，只是不见主耶稣的身体。<br>正在猜疑之间，忽然有两个人站在旁边，衣服放光。', ref: '路加福音 24:3–4', hold: 6.5 },
        { text: '妇女们惊怕，将脸伏地。那两个人就对她们说：<br>「为什么在死人中找活人呢？他不在这里，已经复活了。', ref: '路加福音 24:5–6', hold: 7 },
        { text: '当记念他还在加利利的时候怎样告诉你们，说：<br>『人子必须被交在罪人手里，钉在十字架上，第三日复活。』」', ref: '路加福音 24:6–7', hold: 7.5 },
        { text: '她们就想起耶稣的话来，便从坟墓那里回去……', ref: '路加福音 24:8–9', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          // 看守的人起来逃进城去；妇女们到墓门口
          [0, b => {
            W.goTo(0.27, 20, b.instant);
            pose('guard1', 'stand'); pose('guard2', 'stand');
            run('guard1', 1.08, { speed: 0.09 }); run('guard2', 1.1, { speed: 0.09 });
            pose('magdalene', 'stand'); pose('mary2', 'stand');
            walk('magdalene', xo(X.door, -26), { speed: 0.042 }); walk('mary2', xo(X.door, -44), { speed: 0.042 });
          }],
          [4.2, () => { pose('magdalene', 'bow'); pose('mary2', 'bow'); face('magdalene', 1); face('mary2', 1); }],
          [5.5, () => { rm('guard1'); rm('guard2'); }],
          // 两个人站在旁边，衣服放光
          [6.4, b => {
            attach('angel1', null); place('angel1', xo(X.door, 17)); pose('angel1', 'stand'); face('angel1', -1);
            add('angel2', { label: '天使', sex: 'm', age: 'adult', x: xo(X.door, -72), facing: 1, angel: true, robe: ROBE.angel, glow: 1, from: b.instant ? 'none' : 'light' });
            ringOn(b, 'angel2', 0.16, [255, 250, 236]); ringOn(b, 'angel1', 0.16, [255, 250, 236]);
            flashW(b, 0.4); sfx(b, 'angel');
          }],
          // 将脸伏地：跪下，俯伏在地（不是仆倒如死）
          [8.2, () => { pose('magdalene', 'worship'); pose('mary2', 'worship'); }],
          // 「第三日复活」：一圈光自墓门涌出；天边第一线日光
          [18.6, b => {
            W.set('rnRisen', 0.7, b.instant); W.set('bloom', 0.3, b.instant);
            prop('tomb', null, { k2: 1.4 });
            if (!b.instant && fx()) { const tp = getP('tomb'), G = tp && tombG(tp); if (G) { fx().ring(G.x, G.y - G.dh * 0.5, [255, 236, 190], M() * 0.45, 3, 2.4); fx().sparkle(G.x, G.y - G.dh * 0.5, 36, [255, 240, 210], 20 * SU(), 'top'); } }
            sfx(b, 'harp');
          }],
          [20.4, () => { pose('magdalene', 'kneel'); pose('mary2', 'kneel'); glow('magdalene', 0.5); glow('mary2', 0.45); }],
          // 她们就想起耶稣的话来，回去——那个马利亚跑去；抹大拉的马利亚走开几步，又站住
          [25, () => {
            pose('magdalene', 'stand'); pose('mary2', 'stand');
            run('mary2', PX(0.43), { speed: 0.075 });
            walk('magdalene', xo(X.door, -64), { speed: 0.03 });
          }],
          [26, () => { rm('angel1'); rm('angel2'); prop('tomb', null, { k2: 1 }); }],
          [28.5, () => { rm('mary2'); face('magdalene', 1); }],
        ]);
      },
    },

    // ── 3 · 约 20:16 马利亚 ──────────────────────────────────────
    {
      kind: 'call', utter: '马利亚', cmd: 'call 马利亚  # 拉波尼！', ref: '约翰福音 20:16',
      verse: [
        { text: '彼得和那门徒就出来，往坟墓那里去。两个人同跑，<br>那门徒比彼得跑得更快，先到了坟墓，低头往里看，就见细麻布还放在那里……', ref: '约翰福音 20:3–5', hold: 6.5 },
        { text: '马利亚却站在坟墓外面哭。……<br>就转过身来，看见耶稣站在那里，却不知道是耶稣。', ref: '约翰福音 20:11–14', hold: 6 },
        { text: '耶稣问她说：「妇人，为什么哭？你找谁呢？」马利亚以为是看园的，就对他说：<br>「先生，若是你把他移了去，请告诉我，你把他放在哪里，我便去取他。」', ref: '约翰福音 20:15', hold: 8 },
        { text: '耶稣说：「马利亚。」马利亚就转过来，用希伯来话对他说：「拉波尼！」<br>（拉波尼就是夫子的意思。）', ref: '约翰福音 20:16', hold: 6.5 },
      ],
      apply(c) {
        const mx = () => xo(X.door, -22), jx = () => xo(X.door, -104);
        T(c, [
          // 彼得和那门徒跑到坟墓：那门徒先到，低头往里看；抹大拉的马利亚站在后面
          [0, b => {
            rm('mary2'); rm('angel1', true); rm('angel2', true);
            W.goTo(0.305, 12, b.instant);
            hold('magdalene', null); pose('magdalene', 'stand'); face('magdalene', 1);
            disciple('peter', { x: PX(0.42), facing: 1, glow: 0.24 });
            disciple('john', { x: PX(0.44), facing: 1, glow: 0.24 });
            run('john', xo(X.door, -13), { speed: 0.1 }); run('peter', xo(X.door, -31), { speed: 0.08 });
          }],
          [3.6, () => { pose('john', 'bow'); face('john', 1); }],
          [4.6, () => { face('peter', 1); pose('peter', 'bow'); }],
          [6.2, b => {
            pose('john', 'gaze');
            if (!b.instant && fx()) { const tp = getP('tomb'), G = tp && tombG(tp); if (G) fx().sparkle(G.x, G.y - 6 * G.s, 14, [250, 246, 230], 8 * SU(), 'top'); }
          }],
          // 于是两个门徒回自己的住处去了
          [7.6, () => {
            pose('peter', 'stand'); pose('john', 'stand');
            walk('peter', PX(0.4), { speed: 0.06 }); walk('john', PX(0.42), { speed: 0.06 });
          }],
          // 马利亚却站在坟墓外面哭
          [8.2, b => {
            walk('magdalene', mx(), { speed: 0.03, pose: 'weep' }); face('magdalene', 1);
            sfx(b, 'weep', { soft: true });
          }],
          [10, () => { rm('peter'); rm('john'); }],
          [10.6, () => { pose('magdalene', 'weep', { weep: true }); }],
          // 看见耶稣站在那里（在晨光里）
          [11.6, b => {
            jesus({ x: jx(), facing: 1, from: b.instant ? 'none' : 'light' });
            if (!b.instant && fx()) { const h = headOf('jesus', 0.5); fx().sparkle(h[0], h[1], 24, [255, 240, 214], 16 * SU(), 'top'); }
          }],
          [13, () => { pose('magdalene', 'stand', { weep: false }); face('magdalene', -1); }],
          // 「妇人，为什么哭？」——她以为是看园的
          [15.8, () => { walk('jesus', xo(X.door, -86), { speed: 0.012 }); }],
          [17.8, () => { pose('magdalene', 'bow'); }],
          // 「马利亚。」
          [24.8, b => {
            nameOver(b, 'magdalene', '马利亚', { hold: 3 });
            glow('jesus', 0.66);
            sparkleOn(b, 'jesus', 18, [255, 236, 196], 0.55);
          }],
          [26.6, b => {
            walk('magdalene', xo(X.door, -46), { speed: 0.03, pose: 'kneel' }); face('magdalene', -1);
            glow('magdalene', 0.66);
            W.set('bloom', 0.8, b.instant); W.set('grass', 0.9, b.instant); W.set('herbs', 0.7, b.instant); W.set('rnRisen', 1, b.instant);
            prop('lilyA', null, { k: 1 }); prop('lilyB', null, { k: 1 });
            sfx(b, 'harp'); sfx(b, 'bird', { soft: true });
          }],
          [28.4, b => {
            if (!b.instant && fx()) for (const xf of [PX(0.54), PX(0.6), PX(0.66), PX(0.88)]) fx().sparkle(xf * W.w, gY(2, xf) - 8 * SU(), 10, [255, 236, 214], 26 * SU(), 'top');
          }],
        ]);
      },
    },

    // ── 4 · 约 20:17 我要升上去见我的父，也是你们的父 ─────────────────
    {
      kind: 'promise', utter: '我要升上去见我的父，也是你们的父', cmd: 'send 马利亚 --to 弟兄们 --msg "我已经看见了主"', ref: '约翰福音 20:17',
      verse: [
        { text: '耶稣说：「不要摸我，因我还没有升上去见我的父。你往我弟兄那里去，告诉他们说，<br>我要升上去见我的父，也是你们的父，见我的神，也是你们的神。」', ref: '约翰福音 20:17', hold: 8.5 },
        { text: '抹大拉的马利亚就去告诉门徒说：「我已经看见了主。」<br>她又将主对她说的这话告诉他们。', ref: '约翰福音 20:18', hold: 6.5 },
        { text: '……那时他们正哀恸哭泣。<br>他们听见耶稣活了，被马利亚看见，却是不信。', ref: '马可福音 16:10–11', hold: 6 },
      ],
      apply(c) {
        // 门徒在园子的左边，正哀恸哭泣（坐着、低头）
        const MOURN = [['peter', 0.462, 0.445, 'sit'], ['john', 0.488, 0.468, 'weep'], ['james', 0.515, 0.491, 'sit'], ['andrew', 0.54, 0.514, 'weep']];
        const meet = () => (PORT ? 0.55 : 0.575);
        T(c, [
          // 他差她去：先向着她，暖光落在马利亚身上
          [0, b => {
            W.goTo(0.345, 14, b.instant);
            pose('jesus', 'stand'); face('jesus', 1); glow('jesus', 0.62);
            glow('magdalene', 0.72); ringOn(b, 'magdalene', 0.1, [255, 222, 170], 0.5);
            sfx(b, 'harp', { soft: true });
          }],
          [2.2, () => { pose('magdalene', 'stand'); face('magdalene', -1); }],
          // 「你往我弟兄那里去」：他指向门徒所在的地方
          [4.6, () => { face('jesus', -1); pose('jesus', 'point'); }],
          // 他在原处渐渐隐去（没有天上的光）
          [8.4, () => { pose('jesus', 'stand'); rm('jesus'); }],
          [9.2, b => {
            MOURN.forEach(q => { disciple(q[0], { x: PORT ? q[2] : q[1], facing: 1, glow: 0.24, from: b.instant ? 'none' : 'fade' }); pose(q[0], q[3], { weep: q[3] === 'sit' }); });
          }],
          // 马利亚就去告诉门徒
          [9.9, () => { run('magdalene', meet(), { speed: 0.075 }); }],
          [13.2, () => { face('magdalene', -1); pose('magdalene', 'raise'); }],
          [14.6, () => { face('peter', 1); face('john', 1); pose('john', 'stand'); }],
          [16.2, () => { pose('magdalene', 'stand'); }],
          // 他们正哀恸哭泣；却是不信
          [17.8, () => { pose('john', 'weep'); face('john', -1); face('andrew', -1); pose('peter', 'sit', { weep: true }); }],
          [19.6, () => { pose('magdalene', 'point'); face('magdalene', 1); }],
          [22.2, () => { face('james', -1); pose('magdalene', 'stand'); face('magdalene', -1); }],
        ]);
      },
    },

    // ── 5 · 路 24:17 你们走路彼此谈论的是什么事呢？ ───────────────────
    {
      kind: 'ask', utter: '你们走路彼此谈论的是什么事呢？', cmd: 'join --road 以马忤斯 --incognito', ref: '路加福音 24:17',
      verse: [
        { text: '正当那日，门徒中有两个人往一个村子去；<br>这村子名叫以马忤斯，离耶路撒冷约有二十五里。', ref: '路加福音 24:13', hold: 6.5 },
        { text: '正谈论相问的时候，耶稣亲自就近他们，和他们同行；<br>只是他们的眼睛迷糊了，不认识他。', ref: '路加福音 24:15–16', hold: 6.5 },
        { text: '耶稣对他们说：「你们走路彼此谈论的是什么事呢？」<br>他们就站住，脸上带着愁容。', ref: '路加福音 24:17', hold: 6 },
        { text: '于是从摩西和众先知起，<br>凡经上所指着自己的话都给他们讲解明白了。', ref: '路加福音 24:27', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 午后：往以马忤斯的路；坟墓已在身后
          [0, b => {
            S.scene = 'road';
            W.goTo(0.6, 7, b.instant);
            rm('peter'); rm('john'); rm('james'); rm('andrew'); rm('magdalene');
            unprop('tomb');
            W.set('rnRisen', 0, b.instant); W.set('rnHeaven', 0, b.instant);
            prop('road', 'road', { x0: X.road0, x1: X.road1, label: '往以马忤斯的路' });
            prop('emm', 'room', { x: X.emm, w: PORT ? 74 : 112, style: 'emmaus', lit: 0, open: 0, k: 0, k2: 0, label: '以马忤斯' });
            unprop('lilyB'); unprop('olive2');
            prop('hut1', 'hut', { x: PORT ? 0.93 : 0.835, size: 0.9, lit: 1 });
            if (!PORT) prop('hut2', 'hut', { x: 0.905, size: 1.05, lit: 1 });
          }],
          [1.2, () => {
            disciple('cleopas', { x: DP(0.47, 0.49), facing: 1, glow: 0.2 });
            disciple('emm2', { x: DP(0.447, 0.465), facing: 1, glow: 0.2 });
            walk('cleopas', DP(0.54, 0.575), { speed: 0.01 }); walk('emm2', DP(0.517, 0.55), { speed: 0.01 });
          }],
          // 耶稣亲自就近他们，和他们同行（他们不认识他：光不外显）
          [8, b => {
            jesus({ x: DP(0.44, 0.47), facing: 1, glow: 0.4, from: b.instant ? 'none' : 'fade' });
            walk('jesus', DP(0.565, 0.6), { speed: 0.02 });
            walk('cleopas', DP(0.61, 0.66), { speed: 0.012 }); walk('emm2', DP(0.587, 0.635), { speed: 0.012 });
          }],
          // 他们就站住，脸上带着愁容
          [16, () => {
            walk('jesus', DP(0.567, 0.61), { speed: 0.03 });
            pose('cleopas', 'weep', { weep: false }); pose('emm2', 'weep', { weep: false });
            face('cleopas', -1); face('emm2', -1);
          }],
          [19.4, () => { face('jesus', 1); pose('jesus', 'point'); }],
          // 从摩西和众先知起……讲解明白
          [23, b => {
            W.set('rnScroll', 1, b.instant);
            pose('cleopas', 'stand'); pose('emm2', 'stand'); pose('jesus', 'stand');
            sfx(b, 'scroll', { soft: true });
          }],
          [23.4, b => {
            if (b.instant || !fx()) return;
            const a = headOf('emm2', 1), q = headOf('cleopas', 1), size = Math.max(0.034 * M(), 34 * SU());
            const cy = Math.min(a[1], q[1]) - 110 * SU();
            const cx = (a[0] + q[0]) / 2;
            fx().nameStr('摩西', cx - size * 1.7, cy, size, [255, 232, 176], () => [cx, cy + 60 * SU()], { hold: 3.2 });
            fx().nameStr('先知', cx + size * 1.7, cy, size, [255, 232, 176], () => [cx, cy + 60 * SU()], { hold: 3.2, delay: 1.4 });
          }],
          [25.5, () => {
            walk('jesus', DP(0.625, 0.7), { speed: 0.012 }); walk('cleopas', DP(0.603, 0.675), { speed: 0.012 }); walk('emm2', DP(0.58, 0.65), { speed: 0.012 });
            glow('cleopas', 0.34); glow('emm2', 0.34);
          }],
          [29.4, b => { W.set('rnScroll', 0, b.instant); }],
        ]);
      },
    },

    // ── 6 · 路 24:30 耶稣拿起饼来，祝谢了，擘开，递给他们 ─────────────
    {
      kind: 'act', utter: '耶稣拿起饼来，祝谢了，擘开，递给他们', cmd: 'break 饼 && open --eyes  # 忽然不见了', ref: '路加福音 24:30',
      verse: [
        { text: '他们却强留他，说：「时候晚了，日头已经平西了，请你同我们住下吧！」<br>耶稣就进去，要同他们住下。', ref: '路加福音 24:29', hold: 7 },
        { text: '到了坐席的时候，耶稣拿起饼来，祝谢了，擘开，递给他们。<br>他们的眼睛明亮了，这才认出他来。忽然耶稣不见了。', ref: '路加福音 24:30–31', hold: 7.5 },
        { text: '他们彼此说：「在路上，他和我们说话，给我们讲解圣经的时候，<br>我们的心岂不是火热的吗？」', ref: '路加福音 24:32', hold: 6.5 },
        { text: '他们就立时起身，回耶路撒冷去……', ref: '路加福音 24:33', hold: 4 },
      ],
      apply(c) {
        const seat = { emm2: 0.24, jesus: 0.47, cleopas: 0.68 };
        T(c, [
          [0, b => {
            W.set('rnScroll', 0, b.instant);
            W.goTo(0.755, 8, b.instant);
            prop('emm', null, { lit: 1 });
            // 他好像还要往前行；他们强留他
            walk('jesus', DP(0.8, 0.76), { speed: 0.024 });
            walk('cleopas', DP(0.665, 0.72), { speed: 0.02 }); walk('emm2', DP(0.64, 0.695), { speed: 0.02 });
          }],
          [2.6, () => { face('cleopas', 1); pose('cleopas', 'raise'); face('jesus', -1); }],
          // 进去，要同他们住下
          [4.2, () => {
            pose('cleopas', 'stand');
            for (const id of ['emm2', 'jesus', 'cleopas']) inRoom('emm', id, seat[id], { walk: true, speed: 0.028, pose: 'sit' });
          }],
          [7.6, () => { face('emm2', 1); face('cleopas', -1); face('jesus', 1); }],
          // 拿起饼来，祝谢了
          [9, b => { pose('jesus', 'raise'); prop('emm', null, { k2: 0.5 }); sfx(b, 'harp', { soft: true }); }],
          // 擘开，递给他们
          [10.8, b => {
            prop('emm', null, { k: 1, k2: 1 });
            pose('jesus', 'sit');
            const p = getP('emm');
            if (p && !b.instant && fx()) { const G = roomG(p); fx().ring(G.x0 + G.w * 0.45, G.y - 8 * G.s, [255, 230, 170], M() * 0.3, 2.6, 2); fx().sparkle(G.x0 + G.w * 0.45, G.y - 8 * G.s, 30, [255, 236, 190], 10 * SU(), 'top'); }
            sfx(b, 'chime');
          }],
          // 他们的眼睛明亮了
          [12.4, b => {
            glow('cleopas', 0.75); glow('emm2', 0.75);
            ringOn(b, 'cleopas', 0.12, [255, 244, 220], 0.85); ringOn(b, 'emm2', 0.12, [255, 244, 220], 0.85);
            pose('cleopas', 'kneel'); pose('emm2', 'kneel');
          }],
          // 忽然耶稣不见了
          [14, b => { sparkleOn(b, 'jesus', 34, [255, 246, 226], 0.5); rm('jesus'); prop('emm', null, { k2: 0.7 }); }],
          // 我们的心岂不是火热的吗？
          [17.6, b => {
            face('emm2', 1); face('cleopas', -1);
            pose('cleopas', 'sit'); pose('emm2', 'sit');
            glow('cleopas', 0.9); glow('emm2', 0.9);
            sparkleOn(b, 'cleopas', 12, [255, 200, 130], 0.62); sparkleOn(b, 'emm2', 12, [255, 200, 130], 0.62);
          }],
          // 立时起身，回耶路撒冷去
          [25.2, b => {
            W.goTo(0.84, 6, b.instant);
            for (const id of ['cleopas', 'emm2']) { attach(id, null); pose(id, 'stand'); }
            run('cleopas', PX(0.47), { speed: 0.08 }); run('emm2', PX(0.45), { speed: 0.08 });
            prop('emm', null, { lit: 0.4 });
          }],
          [28.8, () => { rm('cleopas'); rm('emm2'); }],
        ]);
      },
    },

    // ── 7 · 约 20:19 愿你们平安（门都关了）─────────────────────────
    {
      kind: 'bless', utter: '愿你们平安', cmd: 'shalom --through 关着的门', ref: '约翰福音 20:19',
      verse: [
        { text: '那日（就是七日的第一日）晚上，门徒所在的地方，因怕犹太人，门都关了。<br>耶稣来，站在当中，对他们说：「愿你们平安！」', ref: '约翰福音 20:19', hold: 8 },
        { text: '说了这话，就把手和肋旁指给他们看。<br>门徒看见主，就喜乐了。', ref: '约翰福音 20:20', hold: 6 },
      ],
      apply(c) {
        const R = () => (PORT ? ROOM7.p : ROOM7.d);
        const who = () => R().map(q => q[0]);
        T(c, [
          // 那日晚上：耶路撒冷，楼上的屋，门都关了、上了闩；惧怕的门徒（两排，坐着、跪着、低头哭）
          [0, b => {
            S.scene = 'room';
            W.goTo(0.93, 5, b.instant);
            rm('cleopas', true); rm('emm2', true); rm('jesus', true);
            unprop('road'); unprop('emm'); unprop('hut1'); unprop('hut2');
            garden(false);
            prop('room', 'room', { x: X.room, w: PORT ? 190 : 236, style: 'upper', lit: 1, open: 0, k2: 1, label: '门都关了的屋子' });
            prop('city', null, { lit: 0.35 });
            R().forEach(q => {
              disciple(q[0], { x: roomX('room', q[1]), facing: q[1] < 0.5 ? 1 : -1, glow: 0.16, from: b.instant ? 'none' : 'fade' });
              inRoom('room', q[0], q[1], { pose: q[3], row: q[2] });
            });
          }],
          [2.2, b => { flash(b, { type: 'beam', xf: roomX('room', 0.5), y: getP('room') ? roomG(getP('room')).y : W.h * 0.85, w: 60 * SU(), dur: 2.4, k: 0.8 }); }],
          // 耶稣来，站在当中
          [3.2, b => {
            jesus({ x: roomX('room', 0.5), facing: 1, glow: 0.7, from: b.instant ? 'none' : 'light' });
            onFloor('jesus', 'room', 1);
            W.set('rnPeace', 1, b.instant);
            sfx(b, 'angel', { soft: true });
          }],
          [4.6, () => { who().forEach(faceJ); }],
          [6, () => { ['peter', 'john'].forEach(id => pose(id, 'stand')); }],
          // 把手和肋旁指给他们看（只张开手）
          [9.6, () => { pose('jesus', 'raise'); }],
          // 门徒看见主，就喜乐了
          [11, b => {
            who().forEach(id => { pose(id, JOY[id] || 'stand'); glow(id, 0.34); faceJ(id); });
            sfx(b, 'laugh', { soft: true }); sfx(b, 'harp', { soft: true });
          }],
          [13.6, () => { pose('jesus', 'stand'); }],
        ]);
      },
    },

    // ── 8 · 约 20:22 你们受圣灵 ─────────────────────────────────────
    {
      kind: 'cmd', utter: '你们受圣灵', cmd: 'exhale 圣灵 --into 门徒', ref: '约翰福音 20:22',
      verse: [
        { text: '耶稣又对他们说：「愿你们平安！<br>父怎样差遣了我，我也照样差遣你们。」', ref: '约翰福音 20:21', hold: 6.5 },
        { text: '说了这话，就向他们吹一口气，说：「你们受圣灵！」', ref: '约翰福音 20:22', hold: 5.5 },
        { text: '那十二个门徒中，有称为低土马的多马；<br>耶稣来的时候，他没有和他们同在。', ref: '约翰福音 20:24', hold: 5.5 },
      ],
      apply(c) {
        const who = () => ['andrew', 'james', 'peter', 'john', 'nathanael', 'philip', 'matthew', 'cleopas', 'emm2'].filter(has);
        const front = id => { const q = (PORT ? ROOM7.p : ROOM7.d).find(r => r[0] === id); return q ? q[2] : 0; };
        T(c, [
          // 听他说话：后排站着，前排跪着
          [0, () => { who().forEach(id => { pose(id, front(id) ? 'kneel' : 'stand'); faceJ(id); }); }],
          // 父怎样差遣了我：他指向门
          [3.4, () => { face('jesus', 1); pose('jesus', 'point'); }],
          // 向他们吹一口气
          [8.2, b => {
            pose('jesus', 'raise');
            breath(b, 'jesus', who(), { stagger: 0.16, dur: 2.4 });
            sfx(b, 'wind', { soft: true });
            S.breath = 1;
          }],
          [10.6, b => { who().forEach((id, i) => { glow(id, 0.55); pose(id, front(id) ? 'kneel' : i % 2 ? 'raise' : 'stand'); }); sfx(b, 'harp', { soft: true }); }],
          // 门闩落下，门开了（我也照样差遣你们）
          [12, b => { prop('room', null, { k2: 0, open: 1 }); sfx(b, 'door', { soft: true }); }],
          [13, () => { pose('jesus', 'stand'); }],
          // 多马没有和他们同在；他隐去
          [15, b => { sparkleOn(b, 'jesus', 30, [255, 246, 226], 0.5); rm('jesus'); W.set('rnPeace', 0.3, b.instant); }],
        ]);
      },
    },

    // ── 9 · 约 20:27 不要疑惑，总要信 ──────────────────────────────
    {
      kind: 'cmd', utter: '不要疑惑，总要信', cmd: 'verify --hands && believe  # 我的主！我的神！', ref: '约翰福音 20:27',
      verse: [
        { text: '过了八日，门徒又在屋里，多马也和他们同在，门都关了。<br>耶稣来，站在当中说：「愿你们平安！」', ref: '约翰福音 20:26', hold: 7 },
        { text: '就对多马说：「伸过你的指头来，摸我的手；伸出你的手来，探入我的肋旁。<br>不要疑惑，总要信！」', ref: '约翰福音 20:27', hold: 7 },
        { text: '多马说：「我的主！我的神！」', ref: '约翰福音 20:28', hold: 4.5 },
        { text: '耶稣对他说：「你因看见了我才信；<br>那没有看见就信的有福了。」', ref: '约翰福音 20:29', hold: 6 },
      ],
      apply(c) {
        const R = () => (PORT ? ROOM9.p : ROOM9.d);
        const who = R().map(q => q[0]);
        T(c, [
          // 过了八日：天在窗外转了一周；多马进来，门又关了、上了闩
          [0, b => {
            W.goTo(0.915, 8, b.instant);
            W.set('rnPeace', 0, b.instant);
            rm('jesus', true); rm('cleopas'); rm('emm2');
            disciple('thomas', { x: roomX('room', 0.9), facing: -1, glow: 0.16, from: b.instant ? 'none' : 'fade' });
            onFloor('thomas', 'room');
            walk('thomas', roomX('room', 0.63), { speed: 0.02 });
            R().forEach(q => { if (!has(q[0])) disciple(q[0], { x: roomX('room', q[1]), glow: 0.2 }); inRoom('room', q[0], q[1], { walk: true, speed: 0.02, pose: q[2] ? 'kneel' : 'sit', row: q[2] }); });
          }],
          [5.2, b => { prop('room', null, { open: 0, k2: 1 }); sfx(b, 'door', { soft: true }); }],
          [6, () => { who.forEach(faceJ); face('thomas', -1); pose('thomas', 'stand'); }],
          // 耶稣来，站在当中
          [6.6, b => {
            jesus({ x: roomX('room', 0.5), facing: 1, glow: 0.7, from: b.instant ? 'none' : 'light' });
            onFloor('jesus', 'room');
            W.set('rnPeace', 1, b.instant);
            sfx(b, 'angel', { soft: true });
          }],
          [7.6, () => { R().forEach(q => pose(q[0], q[2] ? 'kneel' : 'stand')); }],
          // 伸过你的指头来，摸我的手
          [9, () => { face('jesus', 1); pose('jesus', 'carry'); }],
          [10.6, () => { walk('thomas', roomX('room', 0.565), { speed: 0.01, pose: 'point' }); }],
          // 我的主！我的神！
          [17, b => {
            pose('thomas', 'kneel'); glow('thomas', 0.7);
            ringOn(b, 'thomas', 0.16, [255, 240, 210], 0.5);
            sfx(b, 'harp');
          }],
          [19, () => { pose('thomas', 'bow'); pose('jesus', 'stand'); }],
          // 那没有看见就信的有福了：城里一扇扇窗亮起来，远处也亮
          [22.8, b => {
            pose('jesus', 'raise');
            prop('city', null, { lit: 1, sp: 0.3 });
            const p = getP('room');
            if (p && !b.instant && fx()) { const G = roomG(p); fx().ring(G.cx, G.y - G.h * 0.4, [130, 118, 96], Math.max(W.w, W.h) * 0.6, 5, 1); }
          }],
          [26.4, () => { pose('jesus', 'stand'); pose('thomas', 'kneel'); }],
        ]);
      },
    },

    // ── 10 · 约 21:6 你们把网撒在船的右边，就必得着 ──────────────────
    {
      kind: 'cmd', utter: '你们把网撒在船的右边，就必得着', cmd: 'cast 网 --side right  # 鱼甚多', ref: '约翰福音 21:6',
      verse: [
        { text: '这些事以后，耶稣在提比哩亚海边又向门徒显现。', ref: '约翰福音 21:1', hold: 4.5 },
        { text: '西门‧彼得对他们说：「我打鱼去。」他们说：「我们也和你同去。」<br>他们就出去，上了船；那一夜并没有打着什么。', ref: '约翰福音 21:3', hold: 6.5 },
        { text: '天将亮的时候，耶稣站在岸上，门徒却不知道是耶稣。<br>耶稣就对他们说：「小子！你们有吃的没有？」他们回答说：「没有。」', ref: '约翰福音 21:4–5', hold: 7 },
        { text: '耶稣说：「你们把网撒在船的右边，就必得着。」<br>他们便撒下网去，竟拉不上来了，因为鱼甚多。', ref: '约翰福音 21:6', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 提比哩亚海：夜里；屋子与城都隐去，海上一只船，船尾一盏灯
          [0, b => {
            S.scene = 'sea';
            W.goTo(0.205, 13, b.instant);
            W.set('rnPeace', 0, b.instant);
            rm('jesus', true);
            for (const id of ALLD) rm(id);
            unprop('room'); unprop('city');
            prop('gvil', 'city', { x0: PORT ? 0.72 : 0.78, x1: 0.97, xt: 0.9, layer: 1, style: 'village', lit: 0.6, label: '加利利' });
            prop('boat', 'boat', { k: 0, lit: 1, sp: 0.42, label: '船' });
            W.setPop('fish', 90, W.w * 0.3, W.h * 0.8, b.instant);
          }],
          [2.4, b => {
            CREW.forEach((id, i) => {
              disciple(id, { x: 0.5, facing: i % 2 ? -1 : 1, glow: 0.34, from: b.instant ? 'none' : 'fade' });
              const f = fig(id); if (f) { f.ny = null; f.fly = null; }
              aboard(id, i);
              pose(id, i % 3 === 0 ? 'bow' : 'stand');
            });
          }],
          // 那一夜并没有打着什么
          [7.5, () => { CREW.forEach((id, i) => pose(id, i % 2 ? 'bow' : 'stand')); }],
          [10.5, () => { CREW.forEach((id, i) => pose(id, i % 3 === 1 ? 'kneel' : 'stand')); }],
          // 天将亮的时候，耶稣站在岸上；岸边一堆炭火
          [13.8, b => {
            jesus({ x: jShore(), facing: -1, glow: 0.62, from: b.instant ? 'none' : 'light' });
            prop('fire', 'fire', { x: X.fire, fire: 0.7, k: 0, k2: 0, label: '炭火' });
            W.goTo(0.245, 9, b.instant);
            sparkleOn(b, 'jesus', 16, [255, 240, 214], 0.5);
          }],
          [16.2, () => { CREW.forEach(id => { pose(id, 'stand'); face(id, 1); }); pose('jesus', 'raise'); }],
          [19.5, () => { pose('jesus', 'point'); }],
          // 撒下网去：鱼甚多
          [22.4, b => {
            prop('net', 'net', { k: 0, k2: 0, label: '网' });
            CREW.forEach((id, i) => pose(id, i >= 3 ? 'raise' : 'stand'));
            sfx(b, 'splash');
            const n = getP('net');
            if (n && !b.instant && fx()) { const q = netAt(n); fx().sparkle(q.x, q.y, 16, [220, 236, 250], 14 * q.F, 'top'); }
          }],
          [23.8, b => { prop('net', null, { k: 1 }); sfx(b, 'wave', { soft: true }); prop('boat', null, { lit: 0.3 }); }],
          [25, b => { CREW.forEach((id, i) => pose(id, i >= 2 ? 'bow' : 'stand')); sfx(b, 'splash', { soft: true }); pose('jesus', 'stand'); }],
        ]);
      },
    },

    // ── 11 · 约 21:12 你们来吃早饭 ─────────────────────────────────
    {
      kind: 'call', utter: '你们来吃早饭', cmd: 'serve 早饭 --fish 153 --net intact', ref: '约翰福音 21:12',
      verse: [
        { text: '耶稣所爱的那门徒对彼得说：「是主！」<br>……一听见是主，就束上一件外衣，跳在海里。', ref: '约翰福音 21:7', hold: 6 },
        { text: '他们上了岸，就看见那里有炭火，上面有鱼，又有饼。', ref: '约翰福音 21:9', hold: 5 },
        { text: '西门‧彼得就去，把网拉到岸上。<br>那网满了大鱼，共一百五十三条；鱼虽这样多，网却没有破。', ref: '约翰福音 21:11', hold: 6.5 },
        { text: '耶稣说：「你们来吃早饭。」……<br>耶稣就来拿饼和鱼给他们。', ref: '约翰福音 21:12–13', hold: 6 },
      ],
      apply(c) {
        const q = () => BQ();
        // 围着炭火：约翰、雅各在耶稣的左边，其余的在火的右边
        const SEAT = ['peter', 'john', 'james', 'thomas', 'nathanael', 'andrew', 'philip'];
        const seatDs = PORT ? [15, -38, -50, 25, 35, 45, 55] : [18, -42, -56, 31, 44, 57, 70];
        const seatV = [0.08, 0.04, 0.12, 0, 0.1, 0.03, 0.12];
        const seatX = id => xo(X.fire, seatDs[SEAT.indexOf(id)]);
        const OTH = ['john', 'james', 'thomas', 'nathanael', 'andrew', 'philip'];
        // 彼得拉网：站在网的右边（船头之外，看得清楚）
        const haulX = () => xo(q().net, PORT ? 12 : 15);
        T(c, [
          // 「是主！」
          [0, b => { W.goTo(0.28, 22, b.instant); face('john', 1); pose('john', 'point'); prop('boat', null, { lit: 0 }); }],
          // 彼得束上外衣，跳在海里，站着涉水往岸上去（水齐到腰）
          [1.8, b => {
            const f = fig('peter');
            if (!f) return;
            const at = f._vis && isFinite(f._y) ? f._y / W.h : q().sea[1];
            attach('peter', null);
            pose('peter', 'stand'); face('peter', 1);
            if (!b.instant) {
              f.ny = at;
              fly('peter', q().swim, swimY(), { dur: 3.4, pose: 'stand' });
              swimming = true;
              if (fx()) fx().sparkle(f._x, f._y, 18, [220, 236, 250], 10 * SU(), 'top');
              sfx(b, 'splash');
            } else { place('peter', q().land); f.ny = null; }
            scaleTo('peter', 1);
          }],
          // 其余的门徒在小船上把那网鱼拉过来（约 21:8）：彼得涉水时船还在后面
          [4.4, () => { prop('boat', null, { k: 1 }); }],
          [5.4, b => {
            const f = fig('peter');
            if (f && f.fly) { f.fly = null; }
            pose('peter', 'stand');
            if (f && !b.instant) { f.ny = swimY(); fly('peter', q().land, null, { dur: 1.1, pose: 'stand' }); sfx(b, 'splash', { soft: true }); }
            else { place('peter', q().land); if (f) f.ny = null; }
          }],
          // 网拖到船头外的水边
          [7.6, () => { prop('net', null, { k2: 0.5, sp: 0.45 }); }],
          [6.5, () => { swimming = false; }],
          [6.8, () => { walk('peter', xo(jShore(), -18), { speed: 0.03, pose: 'kneel' }); face('peter', 1); }],
          // 他们上了岸（在网的左边），走到炭火旁
          ...OTH.map((id, i) => [9.4 + i * 0.25, b => ashore(b, id, xo(q().land, (PORT ? -20 : -26) + i * (PORT ? 5 : 6)), 'stand')]),
          // 都落到岸上之后（跳下船的一跃已完），才走到炭火旁
          [12.2, () => {
            OTH.forEach(id => { const f = fig(id); if (f) { f.fly = null; f.ny = null; } walk(id, seatX(id), { speed: 0.034 }); if (f) f.v = seatV[SEAT.indexOf(id)]; });
          }],
          // 就看见那里有炭火，上面有鱼，又有饼
          [8.8, () => { prop('fire', null, { k: 1, k2: 1, fire: 0.85 }); }],
          // 西门‧彼得就去，把网拉到岸上：一百五十三条
          [13.8, () => { pose('peter', 'stand'); walk('peter', haulX(), { speed: 0.04, pose: 'bow' }); }],
          [15.6, () => { face('peter', -1); pose('peter', 'bow'); }],
          [16.2, b => { prop('net', null, { k2: 1, sp: 0.5 }); sfx(b, 'splash', { soft: true }); }],
          [19, b => {
            const n = getP('net');
            if (n && !b.instant && fx()) { const nq = netAt(n); fx().sparkle(nq.x, nq.y - 3 * nq.s, 30, [226, 240, 252], 16 * nq.s, 'top'); }
            pose('peter', 'stand');
          }],
          // 你们来吃早饭
          [21.6, b => {
            pose('jesus', 'raise'); face('jesus', 1);
            walk('peter', seatX('peter'), { speed: 0.03, pose: 'sit' });
            OTH.forEach(id => { pose(id, 'sit'); face(id, seatDs[SEAT.indexOf(id)] < 0 ? 1 : -1); });
            sfx(b, 'harp', { soft: true });
          }],
          [24, b => {
            pose('jesus', 'carry');
            breath(b, 'jesus', SEAT.filter(has), { rgb: [255, 220, 160], stagger: 0.2, dur: 2 });
            prop('fire', null, { k2: 0.4 });
          }],
          [26.6, () => { face('peter', -1); pose('jesus', 'stand'); }],
        ]);
      },
    },

    // ── 12 · 约 21:16 约翰的儿子西门，你爱我吗？ ─────────────────────
    {
      kind: 'ask', utter: '约翰的儿子西门，你爱我吗？', cmd: 'for i in 1 2 3; do ask 爱我吗; feed 羊; done', ref: '约翰福音 21:16',
      verse: [
        { text: '他们吃完了早饭，耶稣对西门‧彼得说：「约翰的儿子西门，你爱我比这些更深吗？」<br>彼得说：「主啊，是的，你知道我爱你。」耶稣对他说：「你喂养我的小羊。」', ref: '约翰福音 21:15', hold: 7.5 },
        { text: '耶稣第二次又对他说：「约翰的儿子西门，你爱我吗？」<br>彼得说：「主啊，是的，你知道我爱你。」耶稣说：「你牧养我的羊。」', ref: '约翰福音 21:16', hold: 7 },
        { text: '第三次对他说：「约翰的儿子西门，你爱我吗？」彼得……就忧愁，对耶稣说：<br>「主啊，你是无所不知的；你知道我爱你。」耶稣说：「你喂养我的羊。」', ref: '约翰福音 21:17', hold: 7.5 },
        { text: '……说了这话，就对他说：「你跟从我吧！」', ref: '约翰福音 21:19', hold: 4 },
      ],
      apply(c) {
        // 吃完了早饭：其余的门徒往左边退开几步，坐在船边；耶稣与彼得在炭火两边说话；羊一群群出现在右边的坡上（远近错开）
        const OTH = ['john', 'james', 'thomas', 'nathanael', 'andrew', 'philip'];
        const back = PORT ? [0.5, 0.475, 0.525, 0.55, 0.455, 0.575] : [0.585, 0.56, 0.535, 0.61, 0.51, 0.635];
        const backV = [0.1, 0.02, 0.14, 0.04, 0.08, 0.16];
        // 羊（[x, v]）：靠后的一排在 0.84 以右，靠前的一排（v ≥ 0.3，在人的脚下方）在 0.72–0.86；耶稣与彼得走的那一段（0.73–0.83）不挡
        const LAMBS = PORT ? [[0.852, 0.04], [0.785, 0.36]] : [[0.852, 0.04], [0.785, 0.34], [0.872, 0.16]];
        const SHEEP1 = PORT ? [[0.875, 0.02], [0.74, 0.38], [0.84, 0.32]] : [[0.87, 0.02], [0.84, 0.3], [0.745, 0.38], [0.895, 0.1]];
        const SHEEP2 = PORT ? [[0.815, 0.46], [0.89, 0.2], [0.7, 0.34]] : [[0.815, 0.44], [0.72, 0.3], [0.865, 0.42], [0.77, 0.48], [0.9, 0.24]];
        const LX = l => l.map(q => [PX(q[0]), q[1]]);
        T(c, [
          [0, b => {
            W.goTo(0.31, 26, b.instant);
            prop('fire', null, { k: 0, k2: 0, fire: 0.5 });
            OTH.forEach((id, i) => { const f = fig(id); if (f) { f.fly = null; f.ny = null; f.v = backV[i]; } walk(id, back[i], { speed: 0.03, pose: 'sit' }); });
            walk('jesus', X.talkJ, { speed: 0.022 });
            walk('peter', X.talkP, { speed: 0.022 });
          }],
          [4.4, () => { face('jesus', -1); face('peter', 1); OTH.forEach(id => face(id, 1)); }],
          // 你喂养我的小羊
          [6.2, b => {
            flock('lamb', 'lamb', '小羊', LX(LAMBS), b);
            sfx(b, 'bleat', { soft: true });
          }],
          [8.8, () => { pose('peter', 'raise'); }],
          [11, () => { pose('peter', 'stand'); }],
          // 你牧养我的羊
          [14.4, b => {
            flock('sheepA', 'sheep', '羊', LX(SHEEP1), b);
            sfx(b, 'bleat');
          }],
          // 第三次：彼得忧愁
          [17.4, () => { pose('peter', 'weep', { weep: false }); }],
          [20.4, () => { pose('peter', 'kneel'); }],
          // 你喂养我的羊
          [22.6, b => {
            flock('sheepB', 'sheep', '羊', LX(SHEEP2), b);
            sfx(b, 'bleat');
            if (!b.instant && fx()) { const xf = PX(0.81); fx().sparkle(xf * W.w, gY(2, xf) - 6 * SU(), 24, [255, 240, 210], 40 * SU(), 'top'); }
            glow('peter', 0.5);
          }],
          // 你跟从我吧！——短短一段路，不出 0.85
          [26.2, () => { pose('peter', 'stand'); walk('jesus', PX(0.81), { speed: 0.02 }); }],
          [26.8, () => { walk('peter', PX(0.775), { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 13 · 太 28:19 你们要去，使万民作我的门徒 ─────────────────────
    {
      kind: 'cmd', utter: '你们要去，使万民作我的门徒', cmd: 'deploy --to 万民  # 奉父、子、圣灵的名', ref: '马太福音 28:19',
      verse: [
        { text: '十一个门徒往加利利去，到了耶稣约定的山上。<br>他们见了耶稣就拜他，然而还有人疑惑。', ref: '马太福音 28:16–17', hold: 7 },
        { text: '耶稣进前来，对他们说：<br>「天上地下所有的权柄都赐给我了。', ref: '马太福音 28:18', hold: 5.5 },
        { text: '所以，你们要去，使万民作我的门徒，<br>奉父、子、圣灵的名给他们施洗。', ref: '马太福音 28:19', hold: 6.5 },
      ],
      apply(c) {
        const ELEVEN = PORT ? ['andrew', 'thomas', 'james', 'peter', 'john', 'nathanael', 'matthew']
          : ['simonZ', 'thaddaeus', 'jamesA', 'andrew', 'thomas', 'philip', 'nathanael', 'matthew', 'james', 'john', 'peter'];
        // 十一个人站在山的左坡上（自山脚到半山，一个比一个高）；耶稣在山顶，进前来几步
        const mcx = () => { const p = getP('mount'); return p ? p.x * W.w : X.mount * W.w; };
        const slot = i => (mcx() + mountHW() * lerp(-0.97, -0.38, i / (ELEVEN.length - 1))) / W.w;
        const jNear = () => (mcx() - 0.19 * mountHW()) / W.w;
        const DOUBT = { simonZ: 1, andrew: 1 };
        T(c, [
          // 加利利那座约定的山
          [0, b => {
            S.scene = 'mount';
            W.goTo(0.36, 12, b.instant);
            rm('jesus'); rm('peter');
            for (const id of CREW) rm(id);
            unflock('lamb', 3); unflock('sheepA', 4); unflock('sheepB', 5);
            unprop('fire'); unprop('net'); unprop('boat');
            prop('mount', 'mount', { x: X.mount, label: '耶稣约定的山' });
            unprop('gvil');
          }],
          [2.6, b => {
            ELEVEN.forEach((id, i) => {
              const x0 = PX(0.47) + i * (PORT ? 0.017 : 0.018);
              disciple(id, { x: x0, facing: 1, glow: 0.22, scale: 1, from: b.instant ? 'none' : 'fade' });
              const f = fig(id); if (f) { f.ny = null; f.fly = null; f.scale = 1; }
              onMount(id);
              walk(id, slot(i), { speed: 0.04 + 0.002 * (i % 3), pose: DOUBT[id] ? 'stand' : 'worship' });
              face(id, 1);
            });
          }],
          [4.2, b => {
            jesus({ x: summitX(), facing: -1, glow: 0.7, from: b.instant ? 'none' : 'light' });
            onMount('jesus');
            sparkleOn(b, 'jesus', 20, [255, 244, 220], 0.5);
            sfx(b, 'angel', { soft: true });
          }],
          // 耶稣进前来：天上地下所有的权柄
          [8.6, b => {
            walk('jesus', jNear(), { speed: 0.01 });
            W.set('rnHeaven', 0.75, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [11.4, () => { pose('jesus', 'raise'); }],
          // 你们要去，使万民作我的门徒：光自山顶走到地极
          [15.4, b => {
            pose('jesus', 'point'); face('jesus', -1);
            W.set('rnWorld', 1, b.instant); W.set('rnHeaven', 0.3, b.instant);
            ELEVEN.forEach(id => { pose(id, 'stand'); face(id, -1); });
            sfx(b, 'bell'); sfx(b, 'harp');
          }],
          [18, b => { if (!b.instant && fx()) { const h = headOf('jesus', 0.5); fx().ring(h[0], h[1], [255, 236, 196], Math.max(W.w, W.h) * 0.9, 6, 2); } }],
        ]);
      },
    },

    // ── 14 · 太 28:20 我就常与你们同在，直到世界的末了 ───────────────
    {
      kind: 'promise', utter: '我就常与你们同在，直到世界的末了', cmd: 'with --you --until 世界的末了', ref: '马太福音 28:20',
      verse: [
        { text: '凡我所吩咐你们的，都教训他们遵守，<br>我就常与你们同在，直到世界的末了。」', ref: '马太福音 28:20', hold: 7.5 },
        { text: '但记这些事要叫你们信耶稣是基督，是神的儿子，<br>并且叫你们信了他，就可以因他的名得生命。', ref: '约翰福音 20:31', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.42, 14, b.instant);
            W.set('rnGlory', 1, b.instant); W.set('rnHeaven', 0, b.instant);
            W.set('bloom', 1, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant);
            pose('jesus', 'raise'); glow('jesus', 0.9);
            sfx(b, 'harp');
          }],
          [1.6, b => {
            const sx = summitX() * W.w;
            W.setPop('bird', 40, sx, W.h * 0.35, b.instant);
            sfx(b, 'bird', { soft: true });
          }],
          [2.6, b => {
            for (const id of ALLD) if (has(id)) { face(id, 1); glow(id, 0.45); }
            ['peter', 'john', 'thomas', 'james', 'nathanael', 'matthew', 'philip'].forEach((id, i) => pose(id, i % 2 ? 'gaze' : 'raise'));
            ['simonZ', 'thaddaeus', 'jamesA', 'andrew'].forEach(id => pose(id, 'gaze'));
          }],
          [9.4, b => {
            if (!b.instant && fx()) { const h = headOf('jesus', 0.5); fx().ring(h[0], h[1], [255, 246, 220], Math.max(W.w, W.h), 6, 2.4); fx().sparkle(h[0], h[1], 40, [255, 244, 220], 30 * SU(), 'top'); }
            sfx(b, 'bell', { soft: true });
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '复活', sub: '马太福音 28 · 路加福音 24 · 约翰福音 20 — 21', tint: [255, 246, 220], music: 'song',
    outro: 24,
    intro: [
      { text: '安息日将尽，七日的头一日，天快亮的时候，<br>抹大拉的马利亚和那个马利亚来看坟墓。', ref: '马太福音 28:1', hold: 6.5 },
      { text: '彼此说：「谁给我们把石头从墓门滚开呢？」', ref: '马可福音 16:3', hold: 5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '耶稣': { text: '耶稣进前来，对他们说：「天上地下所有的权柄都赐给我了。」', ref: '马太福音 28:18' },
      '抹大拉的马利亚': { text: '抹大拉的马利亚就去告诉门徒说：「我已经看见了主。」', ref: '约翰福音 20:18' },
      '那个马利亚': { text: '安息日将尽，七日的头一日，天快亮的时候，抹大拉的马利亚和那个马利亚来看坟墓。', ref: '马太福音 28:1' },
      '主的使者': { text: '他的相貌如同闪电，衣服洁白如雪。', ref: '马太福音 28:3' },
      '天使': { text: '那两个人就对她们说：「为什么在死人中找活人呢？」', ref: '路加福音 24:5' },
      '看守的人': { text: '看守的人就因他吓得浑身乱战，甚至和死人一样。', ref: '马太福音 28:4' },
      '坟墓': { text: '安放在自己的新坟墓里，就是他凿在磐石里的。他又把大石头滚到墓门口，就去了。', ref: '马太福音 27:60' },
      '空坟墓': { text: '他不在这里，照他所说的，已经复活了。你们来看安放主的地方。', ref: '马太福音 28:6' },
      '石头': { text: '那石头原来很大，她们抬头一看，却见石头已经滚开了。', ref: '马可福音 16:4' },
      '园子': { text: '马利亚以为是看园的，就对他说：「先生，若是你把他移了去，请告诉我，你把他放在哪里，我便去取他。」', ref: '约翰福音 20:15' },
      '耶路撒冷': { text: '并且人要奉他的名传悔改、赦罪的道，从耶路撒冷起直传到万邦。', ref: '路加福音 24:47' },
      '彼得': { text: '「主啊，你是无所不知的；你知道我爱你。」', ref: '约翰福音 21:17' },
      '约翰': { text: '耶稣所爱的那门徒对彼得说：「是主！」', ref: '约翰福音 21:7' },
      '多马': { text: '多马说：「我的主！我的神！」', ref: '约翰福音 20:28' },
      '革流巴': { text: '二人中有一个名叫革流巴的回答说：「你在耶路撒冷作客，还不知道这几天在那里所出的事吗？」', ref: '路加福音 24:18' },
      '同行的门徒': { text: '他们彼此说：「在路上，他和我们说话，给我们讲解圣经的时候，我们的心岂不是火热的吗？」', ref: '路加福音 24:32' },
      '拿但业': { text: '有西门‧彼得和称为低土马的多马，并加利利的迦拿人拿但业，还有西庇太的两个儿子，又有两个门徒，都在一处。', ref: '约翰福音 21:2' },
      '雅各': { text: '西庇太的儿子雅各和雅各的兄弟约翰，', ref: '马太福音 10:2' },
      '安得烈': { text: '头一个叫西门（又称彼得），还有他兄弟安得烈，', ref: '马太福音 10:2' },
      '腓力': { text: '腓力和巴多罗买，多马和税吏马太，', ref: '马太福音 10:3' },
      '马太': { text: '腓力和巴多罗买，多马和税吏马太，', ref: '马太福音 10:3' },
      '亚勒腓的儿子雅各': { text: '亚勒腓的儿子雅各，和达太，', ref: '马太福音 10:3' },
      '达太': { text: '亚勒腓的儿子雅各，和达太，', ref: '马太福音 10:3' },
      '奋锐党的西门': { text: '奋锐党的西门，', ref: '马太福音 10:4' },
      '往以马忤斯的路': { text: '正谈论相问的时候，耶稣亲自就近他们，和他们同行；只是他们的眼睛迷糊了，不认识他。', ref: '路加福音 24:15–16' },
      '以马忤斯': { text: '正当那日，门徒中有两个人往一个村子去；这村子名叫以马忤斯，离耶路撒冷约有二十五里。', ref: '路加福音 24:13' },
      '饼': { text: '两个人就把路上所遇见，和擘饼的时候怎么被他们认出来的事，都述说了一遍。', ref: '路加福音 24:35' },
      '门都关了的屋子': { text: '过了八日，门徒又在屋里，多马也和他们同在，门都关了。耶稣来，站在当中说：「愿你们平安！」', ref: '约翰福音 20:26' },
      '加利利': { text: '这些事以后，耶稣在提比哩亚海边又向门徒显现。', ref: '约翰福音 21:1' },
      '船': { text: '他们就出去，上了船；那一夜并没有打着什么。', ref: '约翰福音 21:3' },
      '网': { text: '那网满了大鱼，共一百五十三条；鱼虽这样多，网却没有破。', ref: '约翰福音 21:11' },
      '炭火': { text: '他们上了岸，就看见那里有炭火，上面有鱼，又有饼。', ref: '约翰福音 21:9' },
      '小羊': { text: '耶稣对他说：「你喂养我的小羊。」', ref: '约翰福音 21:15' },
      '羊': { text: '耶稣说：「你喂养我的羊。」', ref: '约翰福音 21:17' },
      '耶稣约定的山': { text: '十一个门徒往加利利去，到了耶稣约定的山上。', ref: '马太福音 28:16' },
    },
  });
})(window.GS);
