/* ─────────────────────────────────────────────────────────────
 * book/isaiah.js —— 以赛亚书 · 以赛亚（以赛亚书 1 — 66）
 *
 * 以赛亚得默示，论到犹大和耶路撒冷：锡安城立在中丘上，殿在城的高处。
 * 一 · 「你们的罪虽像朱红，必变成雪白」——朱红衣袍的百姓，天降大雪，衣袍渐白如羊毛；
 *      耶和华殿的山高举过于万岭，万民流归；刀打成犁头，牛在雪地里犁出新沟（1—5）。
 * 二 · 乌西雅王崩的那年：高高的宝座（以光的线条画成，座上只有不可直视的白光），
 *      衣裳如光的帷幔垂下，遮满圣殿；六翼的撒拉弗侍立，彼此呼喊「圣哉！圣哉！圣哉！」；
 *      门槛震动，殿充满烟云（6 · 本卷的标志）。
 * 三 · 「祸哉！我灭亡了！」——一撒拉弗从坛上取红炭，飞来沾他的口；「我可以差遣谁呢？」「我在这里，请差遣我！」
 * 四 · 黑暗中举着火把行走的百姓看见了大光；童女怀抱婴孩，「以马内利」；四个名号自光中写成（7—10）。
 * 五 · 耶西的本发出嫩枝；豺狼与羊羔同卧，豹子与山羊羔，少壮狮子与牛犊，小孩子牵引它们；知识如水充满洋海（11—12）。
 * 六 · 耶和华使地空虚（列国的默示，13—27）；「你们要刚强，不要惧怕」——旷野有水发出，沙漠开花，瘸子跳跃像鹿（28—35）。
 * 七 · 亚述围城：营火满野；耶和华的使者出去，营火一一熄灭；希西家病中流泪，日晷上的日影往后退了十度（36—39）。
 * 八 · 「你们要安慰，安慰我的百姓」——旷野里一条修平的大道；草必枯干，惟有神的话永远立定（40:1–11）。
 * 九 · 「你们向上举目」——众星按数目被领出，一一称其名（北斗、参星、昴星）；黎明时鹰展翅上腾（40:12–31 · 本卷的第二幅）。
 * 十 · 「你不要害怕！因为我救赎了你」——百姓从水中、从火中经过；厚云消散（41—49）。
 * 十一 · 受苦的仆人：被藐视、被厌弃；我们如羊走迷，众人的黑暗归在他身上；随后光临到他（50—54）。
 * 十二 · 雨雪从天而降，并不返回；撒种的撒种，田地转为金黄；大山小山发声歌唱，树木拍掌（55）。
 * 十三 · 「兴起，发光！」——黑暗遮盖大地，锡安成为光的城；万国与君王骑着骆驼来就这光（56—64）。
 * 十四 · 「看哪！我造新天新地」——新的光扫过天地；从前的（大道、坛、田）不再被记念；豺狼与羊羔同食，狮子吃草与牛一样（65—66）。
 *
 * 布景（自画）：锡安城与殿（中丘层）、宝座与衣裳、撒拉弗、烟云、坛与红炭、雪与雪被、槽与犁与田、
 * 耶西的本与枝子、豺狼·豹子·狮子、大光、旷野的河、亚述营、亚哈斯的日晷、大道、众星与星座、鹰、江河与火、
 * 仆人身上的黑暗、歌唱的山、光的城、新天的光幔。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU } = U;
  const sm = U.smoothstep;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'isaiah';
  const isCur = () => GS.book.current(ACT);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    isSnow: ['exp', 0.55],     // 雪下着（1:18；55:10）
    isCover: ['lin', 0.085],   // 地上、城上的雪被
    isWhite: ['lin', 0.1],     // 百姓的衣袍：朱红 → 雪白
    isMount: ['exp', 0.4],     // 耶和华殿的山高举（2:2）
    isThrone: ['exp', 1.2],    // 高高的宝座（6:1）
    isTrain: ['lin', 0.1],     // 衣裳垂下，遮满圣殿
    isSeraph: ['exp', 0.5],    // 撒拉弗（6:2）
    isGlory: ['exp', 0.4],     // 荣光充满全地（6:3）
    isSmoke: ['exp', 0.35],    // 殿充满了烟云（6:4）
    isLight: ['exp', 1.0],     // 大光（9:2）
    isShoot: ['lin', 0.13],    // 耶西的本发出的枝子（11:1）；> 1 长成小树
    isBeasts: ['exp', 0.6],    // 豺狼、豹子、狮子（11:6；65:25）
    isSea: ['exp', 1.0],       // 知识充满遍地，好像水充满洋海（11:9）
    isStreams: ['lin', 0.12],  // 旷野的河（35:6）
    isCamp: ['exp', 0.7],      // 亚述营（36—37）
    isCampOut: ['lin', 0.28],  // 营火熄灭
    isDialA: ['exp', 0.9],     // 亚哈斯的日晷显出
    isDial: ['lin', 0.17],     // 日影往后退（38:8）
    isRoad: ['lin', 0.13],     // 旷野的大道（40:3）：修到哪里
    isRoadA: ['exp', 0.5],     // 大道的浓淡（修成之后渐成一道淡痕）
    isHost: ['lin', 0.14],     // 众星按数目领出（40:26）
    isConst: ['exp', 0.6],     // 星座之线
    isEagles: ['lin', 0.075],  // 鹰展翅上腾（40:31）
    isRiver: ['exp', 0.5],     // 江河（43:2）
    isFire: ['exp', 0.7],      // 火（43:2）
    isBurden: ['exp', 0.45],   // 众人的罪孽归在他身上（53:6）
    isField: ['lin', 0.15],    // 田：0 犁过 → 1 发芽 → 2 金黄
    isHills: ['exp', 0.6],     // 大山小山发声歌唱（55:12）
    isZion: ['exp', 0.3],      // 锡安发光（60:1）
    isNew: ['exp', 0.3],       // 新天新地（65:17）
    isOld: ['exp', 0.45],      // 从前的事不再被记念：坛、田、槽渐隐（65:17）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  // 经文显在左边的海上，故要紧的事都在 x ≥ 0.5 的地上发生；锡安城在中丘层 0.645 … 0.955
  const X = {
    isaiah: 0.585, stump: 0.64, altar: 0.705, temple: 0.8, city0: 0.645, city1: 0.955, gate: 0.705,
    ox: 0.925, ass: 0.975, manger: 0.952, field1: 0.945, furrow: 0.852,
    mother: 0.672, dial: 0.82, hez: 0.745, servant: 0.78,
    wolf: 0.742, lamb: 0.768, leopard: 0.806, kid: 0.832, lion: 0.872, calf: 0.905, child: 0.714,
  };
  const TREE_X = 0.37;
  const ROBE = {
    isaiah: [86, 92, 128], hez: [112, 66, 128], mother: [214, 204, 226], servant: [156, 144, 124], plowman: [124, 100, 76],
    lame: [150, 128, 104], sower: [138, 110, 82], child: [230, 218, 192], king1: [150, 58, 70], king2: [70, 92, 150], king3: [196, 150, 60],
  };
  const CRIMSON = [[172, 30, 44], [150, 24, 40], [190, 48, 52]], WOOL = [240, 236, 226];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { plow: 0, furrow: 1, clean: 0, leap: 0, beasts: null }; }
  let CLK = 0;   // 装饰用的时钟（雪、火、烟、鹰）

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
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const lighten = (c, k) => U.mixRGB(c, [250, 244, 230], k == null ? 0.35 : k);

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const crowdObj = gid => { const c = C(); return c.crowds && c.crowds.get ? c.crowds.get(gid) || null : null; };
  const hasCrowd = gid => !!crowdObj(gid);
  const members = gid => { const g = crowdObj(gid); return g ? g.members.filter(m => !m.dying) : []; };
  const fig = id => { const c = C(); return c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function hold(id, what) { const c = C(); if (c.prop) U.safe('cast.prop', () => c.prop(id, what || null)); }
  function ride(id, mount) { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, mount)); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) c.fly(id, x, y, o); }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) { const c = C(); if (!c.herd) return null; return U.safe('cast.herd', () => c.herd(gid, o)); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crowdFace(gid, d) { for (const m of members(gid)) { if (m.tx != null && !W.replaying) continue; m.facing = d; m.fd = d; } }
  function crowdGlow(gid, v) { for (const m of members(gid)) m.glow = v; }
  function crowdProp(gid, what) { for (const m of members(gid)) { m.prop = what || null; m.propDefault = false; } }
  function uncrowd(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  // 人群在近地纵深里走到 v（走上大道 / 回到地的轮廓线上）；null = 回到原来的纵深。看着时慢慢移过去
  function crowdDepth(gid, v, instant) {
    for (const m of members(gid)) {
      if (m._v0 == null) m._v0 = m.v || 0;
      m._vT = v == null ? m._v0 : v;
      if (instant || W.replaying) m.v = m._vT;
    }
  }
  function easeDepth(f) {
    for (const gid of ['folk']) for (const m of members(gid)) {
      if (m._vT == null || m.v === m._vT) continue;
      const d = m._vT - (m.v || 0), st = 0.28 * f;
      m.v = Math.abs(d) <= st ? m._vT : (m.v || 0) + Math.sign(d) * st;
    }
  }
  // 百姓从水中经过：脚下溅起水花（只是装饰）
  function splash(dt) {
    if (W.lv.isRiver < 0.5 || !fx()) return;
    for (const m of members('folk')) {
      if (m.tx == null) continue;
      const v = (m.v || 0) * 0.8, rx = RIV.x(v), hw = RIV.w(v) * LS(2) / W.w;
      if (Math.abs(m.nx - rx) > hw) continue;
      m._spl = (m._spl || 0) - dt;
      if (m._spl > 0) continue;
      m._spl = 0.22 + Math.random() * 0.2;
      const p = nearPt(m.nx, v);
      fx().sparkle(p[0], p[1] - 2, 5, [220, 238, 255], 7 * LS(2), 'near');
    }
  }
  // 地上的走兽避开这几段（画面宽度的比例）
  function avoid(...r) { W.beastAvoid = r; }

  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o || {}));
  }
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
    const l = f.layer == null ? 2 : f.layer;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (f.isAnimal ? 0.6 : 1) * frac];
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    const h = f.isAnimal ? 20 * LS(l) : 34 * LS(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    return [x, y - h * frac];
  }
  function memberPt(m, frac) {
    if (m._vis && isFinite(m._x) && isFinite(m._y)) return [m._x, m._y - (m._h || 30) * (m.isAnimal ? 0.6 : 1) * frac];
    const l = m.layer == null ? 2 : m.layer;
    return [m.nx * W.w, gY(l, m.nx) - 34 * LS(l) * frac];
  }
  // 名字的位置：在画面之内
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  function chime(str) { const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0])); }
  // 在某人头上聚成一个名字
  function nameOver(b, id, str, rgb, src, o) {
    if (b.instant) return;
    o = o || {};
    const p = figPt(id, 1) || [W.w * 0.7, W.h * 0.8];
    const size = (o.size || 0.045) * M(), n = Array.from(str).length;
    const c = nameAt(p[0], p[1] - size * (o.lift || 0.95) - 6, size, n);
    const from = src || (() => [p[0] + rand(-50, 50) * SU(), p[1] + rand(-20, 40) * SU()]);
    writeName(str, c[0], c[1], size, rgb, from, { hold: o.hold || 2.4, dot: o.dot, delay: o.delay });
    chime(str);
  }
  // 名字：先由光点聚成（与全书一样），再显为一个实在的、发光的毛笔字，停留，散去
  const GFONT = '"GS Brush", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "STSong", "Noto Serif CJK SC", "SimSun", serif';
  function writeName(str, cx, cy, size, rgb, src, o) {
    o = o || {};
    const hold = o.hold || 2.8, delay = o.delay || 0, n = Array.from(str).length;
    fx().nameStr(str, cx, cy, size, rgb, src, { hold, delay, dot: o.dot });
    FXL.push({ type: 'glyph', t: 0, dur: delay + 0.12 * n + 1.7 + hold + 1.6, str, cx, cy, size, rgb, delay, hold });
  }
  function drawGlyph(ctx, e) {
    const chars = Array.from(e.str), gap = e.size * 1.08, x0 = e.cx - gap * (chars.length - 1) / 2, c = e.rgb;
    ctx.save();
    ctx.font = '900 ' + Math.max(8, Math.round(e.size)) + 'px ' + GFONT;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < chars.length; i++) {
      const t = e.t - e.delay - 0.12 * i;
      const a = sm(0.9, 1.8, t) * (1 - sm(1.7 + e.hold, 3 + e.hold, t));
      if (a < 0.01) continue;
      const x = x0 + i * gap, y = e.cy + 0.04 * e.size, ch = chars[i];
      // 一层暗的衬底：在亮处也看得清
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.32 * a;
      ctx.shadowColor = 'rgb(12,8,4)'; ctx.shadowBlur = e.size * 0.35;
      ctx.fillStyle = 'rgb(40,28,14)'; ctx.fillText(ch, x, y);
      // 字与字的光
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.85 * a;
      ctx.shadowColor = U.rgb(c[0], c[1], c[2]); ctx.shadowBlur = e.size * 0.5;
      ctx.fillStyle = U.rgb(c[0], c[1], c[2]); ctx.fillText(ch, x, y);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.5 * a;
      ctx.fillStyle = 'rgb(255,250,236)'; ctx.fillText(ch, x, y);
    }
    ctx.restore();
  }
  const srcAround = (id, r) => () => { const p = figPt(id, 0.5) || [W.w * 0.7, W.h * 0.8]; const k = (r || 60) * SU(); return [p[0] + rand(-k, k), p[1] + rand(-k * 0.6, k * 0.4)]; };
  const srcGround = (x0, x1) => () => { const xf = rand(x0, x1), g = gY(2, xf); return [xf * W.w, g + rand(0, 1) * (W.h - g) * 0.6]; };

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
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
  // 一只翅膀：根在左 (6, 36)，尖在右；下缘是一片片的羽
  const WING_W = 170, WING_H = 72, WING_RX = 6, WING_RY = 36;
  const FEATH = [[142, 40], [124, 44], [104, 52], [82, 56], [58, 60], [32, 56]];
  function makeWing() {
    const c = cnv(WING_W, WING_H), g = c.getContext('2d');
    g.beginPath();
    g.moveTo(6, 34);
    g.bezierCurveTo(40, 6, 110, 4, 166, 20);
    g.quadraticCurveTo(152, 30, 142, 40);
    g.quadraticCurveTo(136, 34, 124, 44);
    g.quadraticCurveTo(116, 40, 104, 52);
    g.quadraticCurveTo(96, 46, 82, 56);
    g.quadraticCurveTo(72, 50, 58, 60);
    g.quadraticCurveTo(46, 52, 32, 56);
    g.quadraticCurveTo(18, 48, 6, 40);
    g.closePath();
    const gr = g.createLinearGradient(6, 0, 166, 0);
    gr.addColorStop(0, 'rgba(255,252,242,0.95)'); gr.addColorStop(0.45, 'rgba(255,234,184,0.78)'); gr.addColorStop(1, 'rgba(255,164,86,0.3)');
    g.fillStyle = gr; g.fill();
    g.strokeStyle = 'rgba(255,255,250,0.5)'; g.lineWidth = 1.3;
    g.beginPath();
    for (const [x, y] of FEATH) { g.moveTo(12, 36); g.quadraticCurveTo((x + 12) / 2, 26 + y * 0.18, x, y - 4); }
    g.stroke();
    return c;
  }
  // 撒拉弗（6:2）：火焰般的身形；两个翅膀遮脸，两个翅膀遮脚（飞翔的两个翅膀在画时另加）
  // 精灵 256×256，锚点 (128, 150)，每个单位 2 像素
  const SER = 256, SER_AX = 128, SER_AY = 150;
  function makeSeraph(wing) {
    const c = cnv(SER, SER), g = c.getContext('2d');
    g.globalCompositeOperation = 'lighter';
    const ga = g.createRadialGradient(128, 138, 0, 128, 138, 118);
    ga.addColorStop(0, 'rgba(255,200,120,0.34)'); ga.addColorStop(0.5, 'rgba(255,170,90,0.1)'); ga.addColorStop(1, 'rgba(255,150,80,0)');
    g.fillStyle = ga; g.fillRect(0, 0, SER, SER);
    const gb = g.createLinearGradient(0, 84, 0, 208);
    gb.addColorStop(0, 'rgba(255,252,242,1)'); gb.addColorStop(0.55, 'rgba(255,228,168,0.9)'); gb.addColorStop(1, 'rgba(255,140,64,0)');
    g.fillStyle = gb;
    g.beginPath();
    g.moveTo(128, 98);
    g.bezierCurveTo(150, 106, 146, 150, 139, 178);
    g.quadraticCurveTo(133, 202, 128, 210);
    g.quadraticCurveTo(123, 202, 117, 178);
    g.bezierCurveTo(110, 150, 106, 106, 128, 98);
    g.fill();
    const gh = g.createRadialGradient(128, 92, 0, 128, 92, 13);
    gh.addColorStop(0, 'rgba(255,255,250,1)'); gh.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = gh; g.beginPath(); g.arc(128, 92, 13, 0, TAU); g.fill();
    const w = (rx, ry, ang, sc, flip) => {
      g.save(); g.translate(rx, ry); if (flip) g.scale(-1, 1); g.rotate(ang);
      g.drawImage(wing, -WING_RX * sc, -WING_RY * sc, WING_W * sc, WING_H * sc);
      g.restore();
    };
    // 遮脸：自两肩向上、向内交叉于头前
    w(136, 112, -2.3, 0.54, false); w(120, 112, -2.3, 0.54, true);
    // 遮脚：自两胯向下、向内交叉于足前
    w(135, 170, 2.3, 0.5, false); w(121, 170, 2.3, 0.5, true);
    return c;
  }
  function sprites() {
    SP = {};
    SP.gold = radial([255, 222, 156], 1, 0.3);
    SP.white = radial([255, 250, 240], 1, 0.28);
    SP.ember = radial([255, 112, 48], 1, 0.3);
    SP.warm = radial([255, 178, 96], 1, 0.32);
    SP.dark = radial([6, 4, 10], 1, 0.55);
    SP.cool = radial([206, 224, 255], 1, 0.3);
    const b = cnv(64, 256), g = b.getContext('2d');
    const h = g.createLinearGradient(0, 0, 64, 0);
    h.addColorStop(0, 'rgba(255,240,210,0)'); h.addColorStop(0.5, 'rgba(255,244,222,1)'); h.addColorStop(1, 'rgba(255,240,210,0)');
    g.fillStyle = h; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const v = g.createLinearGradient(0, 0, 0, 256);
    v.addColorStop(0, 'rgba(0,0,0,0.05)'); v.addColorStop(0.7, 'rgba(0,0,0,0.9)'); v.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = v; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 暗的柱：众人的罪孽自上而下归在他身上（53:6）
    const d = cnv(64, 256), dg = d.getContext('2d');
    const dh = dg.createLinearGradient(0, 0, 64, 0);
    dh.addColorStop(0, 'rgba(12,8,16,0)'); dh.addColorStop(0.5, 'rgba(12,8,16,1)'); dh.addColorStop(1, 'rgba(12,8,16,0)');
    dg.fillStyle = dh; dg.fillRect(0, 0, 64, 256);
    dg.globalCompositeOperation = 'destination-in';
    const dv = dg.createLinearGradient(0, 0, 0, 256);
    dv.addColorStop(0, 'rgba(0,0,0,0)'); dv.addColorStop(0.3, 'rgba(0,0,0,0.12)'); dv.addColorStop(0.62, 'rgba(0,0,0,0.5)'); dv.addColorStop(0.9, 'rgba(0,0,0,0.95)'); dv.addColorStop(1, 'rgba(0,0,0,0.25)');
    dg.fillStyle = dv; dg.fillRect(0, 0, 64, 256);
    SP.shade = d;
    const p = cnv(96, 96), pg = p.getContext('2d'), r = U.mulberry32(66);
    for (let i = 0; i < 7; i++) {
      const x = 48 + (r() - 0.5) * 34, y = 48 + (r() - 0.5) * 26, rr = 18 + r() * 16;
      const gr = pg.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, 'rgba(240,232,216,0.5)'); gr.addColorStop(0.6, 'rgba(234,224,206,0.22)'); gr.addColorStop(1, 'rgba(228,218,200,0)');
      pg.fillStyle = gr; pg.fillRect(0, 0, 96, 96);
    }
    SP.puff = p;
    SP.wing = makeWing();
    SP.seraph = makeSeraph(SP.wing);
    return SP;
  }

  // ════════════════════════════════════════════════════════════
  //  锡安城与殿（中丘层）
  // ════════════════════════════════════════════════════════════
  const CITY = (function () {
    const r = U.mulberry32(2323), houses = [];
    const N = 48;
    for (let i = 0; i < N; i++) {
      const x = 0.652 + 0.298 * (i + 0.15 + r() * 0.7) / N;
      if (x > 0.774 && x < 0.826) continue;             // 殿山
      const row = i % 3;                                 // 0 后 · 1 中 · 2 前
      houses.push({ x, w: 5.5 + r() * 6.5, h: 6 + r() * 9 + (row === 0 ? 2 : 0), row, up: r() < 0.28 ? 2.5 + r() * 3.5 : 0, win: r() < 0.8, wx: r(), tone: r() });
    }
    houses.sort((a, b) => a.row - b.row);
    const towers = [0.648, 0.69, 0.742, 0.858, 0.906, 0.952].map(x => ({ x, w: 6, h: 14 }));
    return { houses, towers };
  })();
  const ROWC = [[172, 158, 134], [198, 182, 152], [216, 200, 168]], WALLC = [194, 176, 144], TEMPLEC = [236, 226, 200], GOLDC = [226, 186, 104], HILLC = [140, 132, 100];
  const cityK = () => LS(1) * 1.85 * (tall() ? 1.3 : 1);
  // 城在山上：越近殿山越高
  const hill = xf => 14 * Math.pow(Math.max(0, 1 - Math.abs(xf - X.temple) / 0.17), 1.3);
  const ROWUP = [6, 3, 0];
  function houseGeo(h, K) {
    const g = gY(1, h.x) + 3 * K - (hill(h.x) + ROWUP[h.row]) * K;
    return [h.x * W.w - h.w * K / 2, g - h.h * K, h.w * K, h.h * K, g];
  }
  function templeGeom() {
    const K = cityK(), x = X.temple * W.w, g = gY(1, X.temple);
    const base = g + 3 * K - (hill(X.temple) + 7 + 7 + 20 * W.lv.isMount) * K;
    return { K, x, g, base, top: base - 30 * K };
  }
  function drawCity(ctx) {
    const K = cityK(), tg = templeGeom(), day = W.daylight;
    const cover = W.lv.isCover, lit = litX();
    // 城所在的山，与其上的殿山（锡安）
    const x0 = X.city0 - 0.012, x1 = X.city1 + 0.012;
    ctx.fillStyle = css(HILLC, 1);
    ctx.beginPath();
    ctx.moveTo(x0 * W.w, gY(1, x0) + 4 * K);
    for (let xf = x0; xf <= x1 + 1e-6; xf += 0.006) ctx.lineTo(xf * W.w, gY(1, xf) + 3 * K - (hill(xf) + 6.5) * K);
    ctx.lineTo(x1 * W.w, gY(1, x1) + 4 * K);
    ctx.closePath(); ctx.fill();
    const ma = X.temple - 0.045, mb = X.temple + 0.045;
    const ya = gY(1, ma) + 3 * K - (hill(ma) + 6.5) * K, yb = gY(1, mb) + 3 * K - (hill(mb) + 6.5) * K;
    ctx.beginPath();
    ctx.moveTo(ma * W.w, ya);
    ctx.bezierCurveTo((ma + 0.02) * W.w, ya, tg.x - 0.026 * W.w, tg.base, tg.x - 0.015 * W.w, tg.base);
    ctx.lineTo(tg.x + 0.015 * W.w, tg.base);
    ctx.bezierCurveTo(tg.x + 0.026 * W.w, tg.base, (mb - 0.02) * W.w, yb, mb * W.w, yb);
    ctx.closePath(); ctx.fill();
    // 殿山上的阶地
    ctx.strokeStyle = css(lighten(HILLC, 0.25), 1, 0.5);
    ctx.lineWidth = Math.max(0.6, 0.45 * K);
    ctx.beginPath();
    for (let j = 1; j <= 3; j++) {
      const f = j / 4, yy = lerp(tg.base, ya, f), hw = lerp(0.015, 0.04, f) * W.w;
      ctx.moveTo(tg.x - hw, yy); ctx.lineTo(tg.x + hw, yy);
    }
    ctx.stroke();
    // 殿
    drawTemple(ctx, tg);
    // 房屋：后、中、前三排
    for (let row = 0; row < 3; row++) {
      ctx.fillStyle = css(ROWC[row], 1);
      ctx.beginPath();
      for (const h of CITY.houses) {
        if (h.row !== row) continue;
        const q = houseGeo(h, K);
        ctx.rect(q[0], q[1], q[2], q[3] + 3 * K);
        if (h.up) ctx.rect(q[0] + q[2] * (h.tone > 0.5 ? 0.5 : 0.08), q[1] - h.up * K, q[2] * 0.42, h.up * K + 1);
      }
      ctx.fill();
      // 背光的一面
      ctx.fillStyle = css(mix(ROWC[row], [90, 84, 90], 0.35), 1, 0.55);
      ctx.beginPath();
      for (const h of CITY.houses) {
        if (h.row !== row) continue;
        const q = houseGeo(h, K), sw = q[2] * 0.3;
        ctx.rect(lit > q[0] + q[2] / 2 ? q[0] : q[0] + q[2] - sw, q[1], sw, q[3] + 3 * K);
      }
      ctx.fill();
      // 平顶的檐（迎光处亮）
      ctx.fillStyle = css(lighten(ROWC[row], 0.4), 1, 0.35 + 0.5 * day);
      ctx.beginPath();
      for (const h of CITY.houses) { if (h.row !== row) continue; const q = houseGeo(h, K); ctx.rect(q[0] - 0.3 * K, q[1] - 0.6 * K, q[2] + 0.6 * K, 0.9 * K); }
      ctx.fill();
      // 门窗（白昼是暗的洞）
      ctx.fillStyle = css([64, 52, 44], 1, 0.6 * (0.3 + 0.7 * day));
      ctx.beginPath();
      for (const h of CITY.houses) {
        if (h.row !== row || !h.win) continue;
        const q = houseGeo(h, K);
        ctx.rect(q[0] + q[2] * (0.2 + 0.5 * h.wx), q[1] + q[3] * 0.3, 1.1 * K, 1.6 * K);
      }
      ctx.fill();
    }
    // 城墙与城楼（在山脚）
    const wx0 = X.city0 * W.w, wx1 = X.city1 * W.w, wh = 7 * K;
    ctx.fillStyle = css(WALLC, 1);
    ctx.beginPath();
    const step = Math.max(3, 2.6 * K);
    ctx.moveTo(wx0, gYp(1, wx0) + 4 * K);
    let up = true;
    for (let x = wx0; x <= wx1; x += step) { const y = gYp(1, x) + 3 * K - wh - (up ? 1.3 * K : 0); ctx.lineTo(x, y); ctx.lineTo(Math.min(wx1, x + step), y); up = !up; }
    ctx.lineTo(wx1, gYp(1, wx1) + 4 * K);
    ctx.closePath();
    for (const t of CITY.towers) { const x = t.x * W.w, g = gYp(1, x) + 3 * K; ctx.rect(x - t.w * K / 2, g - t.h * K, t.w * K, t.h * K); }
    ctx.fill();
    // 墙面的石缝
    ctx.strokeStyle = css(mix(WALLC, [100, 90, 80], 0.4), 1, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.3 * K);
    ctx.beginPath();
    for (let x = wx0; x < wx1; x += step * 2) { const y = gYp(1, x) + 3 * K - wh * 0.45; ctx.moveTo(x, y); ctx.lineTo(x + step * 1.6, y); }
    ctx.stroke();
    // 城门
    const gx = X.gate * W.w, gg = gY(1, X.gate) + 3 * K;
    ctx.fillStyle = css([40, 32, 28], 1);
    ctx.beginPath(); ctx.moveTo(gx - 2.2 * K, gg); ctx.lineTo(gx - 2.2 * K, gg - 4 * K); ctx.arc(gx, gg - 4 * K, 2.2 * K, Math.PI, 0); ctx.lineTo(gx + 2.2 * K, gg); ctx.fill();
    // 城楼迎光的一道边
    ctx.strokeStyle = css(lighten(WALLC, 0.55), 1, 0.55 * (0.25 + 0.75 * day));
    ctx.lineWidth = Math.max(0.7, 0.5 * K);
    ctx.beginPath();
    for (const t of CITY.towers) { const x = t.x * W.w, g = gYp(1, x) + 3 * K, sx = lit > x ? 1 : -1; ctx.moveTo(x - t.w * K / 2, g - t.h * K); ctx.lineTo(x + t.w * K / 2, g - t.h * K); ctx.lineTo(x + sx * t.w * K / 2, g - t.h * K * 0.4); }
    ctx.stroke();
    // 夜里的灯（围城之时稀少，锡安发光时满城皆明）
    const lamps = W.night * (1 - 0.75 * W.lv.isCamp) + W.lv.isZion;
    if (lamps > 0.03) {
      ctx.fillStyle = U.rgba(255, 196, 120, Math.min(1, 0.85 * lamps));
      ctx.beginPath();
      for (const h of CITY.houses) {
        if (!h.win) continue;
        const q = houseGeo(h, K);
        ctx.rect(q[0] + q[2] * (0.2 + 0.5 * h.wx), q[1] + q[3] * 0.3, 1.1 * K, 1.6 * K);
      }
      ctx.fill();
    }
    // 城上的雪
    if (cover > 0.01) {
      ctx.fillStyle = W.shadeCSS([244, 246, 252], DEP(1) * 0.6, 0.92 * cover, 0.2);
      ctx.beginPath();
      for (const h of CITY.houses) { const q = houseGeo(h, K); ctx.rect(q[0] - 0.3 * K, q[1] - 0.9 * K, q[2] + 0.6 * K, 1.3 * K); }
      for (const t of CITY.towers) { const x = t.x * W.w, g = gYp(1, x) + 3 * K; ctx.rect(x - t.w * K / 2, g - t.h * K - 0.8 * K, t.w * K, 1.3 * K); }
      ctx.rect(tg.x - 16 * K, tg.top - 0.9 * K, 10 * K, 1.4 * K);
      ctx.rect(tg.x - 6 * K, tg.base - 22 * K - 0.9 * K, 24 * K, 1.4 * K);
      ctx.fill();
    }
  }
  function drawTemple(ctx, tg) {
    const K = tg.K, x = tg.x, yb = tg.base;
    ctx.fillStyle = css(WALLC, 1);
    ctx.beginPath(); ctx.rect(x - 27 * K, yb - 5 * K, 54 * K, 6 * K); ctx.fill();
    ctx.fillStyle = css(TEMPLEC, 1);
    ctx.beginPath();
    ctx.rect(x - 16 * K, yb - 30 * K, 10 * K, 30 * K);    // 廊（向东，门朝左）
    ctx.rect(x - 6 * K, yb - 22 * K, 24 * K, 22 * K);     // 殿
    ctx.fill();
    // 背光的一面
    const lit = litX();
    ctx.fillStyle = css(mix(TEMPLEC, [96, 90, 96], 0.3), 1, 0.5);
    ctx.beginPath();
    if (lit > x) ctx.rect(x - 16 * K, yb - 30 * K, 3 * K, 30 * K); else ctx.rect(x + 12 * K, yb - 22 * K, 6 * K, 22 * K);
    ctx.fill();
    ctx.fillStyle = css(GOLDC, 1, 1, 0.14);
    ctx.beginPath();
    ctx.rect(x - 16.5 * K, yb - 30.8 * K, 11 * K, 1.4 * K);
    ctx.rect(x - 6.5 * K, yb - 22.8 * K, 25 * K, 1.4 * K);
    // 雅斤与波阿斯
    ctx.rect(x - 21.6 * K, yb - 13 * K, 1.5 * K, 13 * K);
    ctx.rect(x - 18.8 * K, yb - 13 * K, 1.5 * K, 13 * K);
    ctx.rect(x - 22.1 * K, yb - 14.2 * K, 2.5 * K, 1.3 * K);
    ctx.rect(x - 19.3 * K, yb - 14.2 * K, 2.5 * K, 1.3 * K);
    ctx.fill();
    // 门：异象时、锡安发光时，里面透出光
    const inner = Math.max(W.lv.isTrain * W.lv.isThrone, W.lv.isZion);
    ctx.fillStyle = inner > 0.05 ? U.rgba(255, 236, 190, 0.35 + 0.6 * inner) : css([52, 42, 34], 1);
    ctx.beginPath(); ctx.rect(x - 13 * K, yb - 13 * K, 4 * K, 13 * K); ctx.fill();
    // 迎光的边
    ctx.strokeStyle = css(lighten(TEMPLEC, 0.6), 1, 0.65 * (0.25 + 0.75 * W.daylight));
    ctx.lineWidth = Math.max(0.7, 0.5 * K);
    ctx.beginPath(); ctx.moveTo(x - 16 * K, yb - 30 * K); ctx.lineTo(x - 6 * K, yb - 30 * K); ctx.moveTo(x - 6 * K, yb - 22 * K); ctx.lineTo(x + 18 * K, yb - 22 * K); ctx.stroke();
  }
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  // 锡安发光（60:1）：黑暗之中，城成为光的城（画在 'air' 层，在遍地的黑暗之上）
  function drawZion(ctx) {
    const k = Math.max(W.lv.isZion, 0.65 * W.lv.isTrain * W.lv.isThrone);
    if (k < 0.01) return;
    SP || sprites();
    const z = W.lv.isZion;                               // 光的城（60:1）独有的：灯、倒影、照到近地与来朝之人的光
    const K = cityK(), tg = templeGeom(), u = SU();
    const dark = 0.4 + 0.6 * (1 - W.daylight);
    const dk = k * dark;                                  // 白昼里只是一层淡光，黑暗中才是光的城
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const cx = (X.city0 + X.city1) / 2 * W.w, cy = tg.g - 12 * K;
    // 城上的光穹
    ctx.globalAlpha = 0.5 * dk; ctx.drawImage(SP.gold, cx - W.w * 0.32, cy - W.h * 0.22, W.w * 0.64, W.h * 0.36);
    if (z > 0.01) { ctx.globalAlpha = 0.42 * z * dark; ctx.drawImage(SP.gold, cx - W.w * 0.42, cy - W.h * 0.36, W.w * 0.84, W.h * 0.56); }
    ctx.globalAlpha = 0.55 * k; ctx.drawImage(SP.white, tg.x - 70 * K, tg.top - 44 * K, 140 * K, 100 * K);
    // 城所在的山与城墙也被照亮
    const x0 = X.city0 - 0.012, x1 = X.city1 + 0.012;
    ctx.globalAlpha = 1;
    ctx.fillStyle = U.rgba(255, 214, 140, (0.13 + 0.12 * z) * dk);
    ctx.beginPath();
    ctx.moveTo(x0 * W.w, gY(1, x0) + 4 * K);
    for (let xf = x0; xf <= x1 + 1e-6; xf += 0.006) ctx.lineTo(xf * W.w, gY(1, xf) + 3 * K - (hill(xf) + 6.5) * K);
    ctx.lineTo(x1 * W.w, gY(1, x1) + 4 * K);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tg.x - 0.04 * W.w, gY(1, X.temple - 0.04) - hill(X.temple - 0.04) * K);
    ctx.quadraticCurveTo(tg.x - 0.022 * W.w, tg.base, tg.x - 0.015 * W.w, tg.base); ctx.lineTo(tg.x + 0.015 * W.w, tg.base);
    ctx.quadraticCurveTo(tg.x + 0.022 * W.w, tg.base, tg.x + 0.04 * W.w, gY(1, X.temple + 0.04) - hill(X.temple + 0.04) * K);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = U.rgba(255, 226, 160, 0.3 * dk);
    ctx.beginPath();
    for (let x = X.city0 * W.w; x <= X.city1 * W.w; x += 3 * K) { const y = gYp(1, x) + 3 * K; ctx.rect(x, y - 7.5 * K, 3 * K, 7.5 * K); }
    ctx.fill();
    // 自上而下的光柱
    ctx.globalAlpha = 0.32 * k; ctx.drawImage(SP.beam, tg.x - 44 * K, -10, 88 * K, tg.base + 10);
    ctx.globalAlpha = 1;
    // 城以光重描：屋、城楼、殿，屋顶的边
    ctx.fillStyle = U.rgba(255, 222, 150, (0.2 + 0.16 * z) * dk);
    ctx.beginPath();
    for (const h of CITY.houses) { const q = houseGeo(h, K); ctx.rect(q[0], q[1], q[2], q[3]); }
    for (const t of CITY.towers) { const x = t.x * W.w, g = gYp(1, x) + 3 * K; ctx.rect(x - t.w * K / 2, g - t.h * K, t.w * K, t.h * K); }
    ctx.rect(tg.x - 16 * K, tg.top, 10 * K, 30 * K); ctx.rect(tg.x - 6 * K, tg.base - 22 * K, 24 * K, 22 * K);
    ctx.fill();
    ctx.fillStyle = U.rgba(255, 238, 196, 0.55 * dk);
    ctx.beginPath();
    for (const h of CITY.houses) { const q = houseGeo(h, K); ctx.rect(q[0] - 0.3 * K, q[1] - 0.6 * K, q[2] + 0.6 * K, 0.9 * K); }
    ctx.rect(tg.x - 16.5 * K, tg.top - 0.8 * K, 11 * K, 1.4 * K); ctx.rect(tg.x - 6.5 * K, tg.base - 22.8 * K, 25 * K, 1.4 * K);
    ctx.fill();
    if (z > 0.01) {
      const zd = z * dark;
      // 满城的灯：每一扇窗都亮，窗外一团暖光
      ctx.fillStyle = U.rgba(255, 236, 180, Math.min(1, 1.1 * zd));
      ctx.beginPath();
      for (const h of CITY.houses) {
        const q = houseGeo(h, K);
        ctx.rect(q[0] + q[2] * (0.2 + 0.5 * h.wx), q[1] + q[3] * 0.3, 1.2 * K, 1.7 * K);
        if (!h.win) ctx.rect(q[0] + q[2] * 0.55, q[1] + q[3] * 0.45, 1.1 * K, 1.5 * K);
      }
      ctx.fill();
      ctx.globalAlpha = 0.5 * zd;
      for (let i = 0; i < CITY.houses.length; i += 2) {
        const q = houseGeo(CITY.houses[i], K), r = 7 * K * (0.8 + 0.4 * hsh(i * 1.3)) * (0.9 + 0.1 * Math.sin(CLK * 1.7 + i));
        ctx.drawImage(SP.warm, q[0] + q[2] / 2 - r, q[1] + q[3] * 0.4 - r, 2 * r, 2 * r);
      }
      // 光落在海上：城下一道长长的倒影
      ctx.save();
      seaClip(ctx, true);
      const y0 = W.waterlineY(1) + 1, y1 = W.h;
      ctx.globalAlpha = 0.5 * zd;
      ctx.save(); ctx.translate(tg.x, y0); ctx.scale(1, -1);
      ctx.drawImage(SP.beam, -50 * K, -(y1 - y0) * 1.05, 100 * K, (y1 - y0) * 1.05);
      ctx.restore();
      ctx.fillStyle = 'rgb(255,228,168)';
      for (let i = 0; i < 30; i++) {
        const t = i / 30, y = lerp(y0, y1, t * t), w = (18 + 70 * t) * K * (0.5 + 0.5 * hsh(i * 2.9)), sw = Math.sin(CLK * 1.6 + i * 1.9) * 6 * K;
        ctx.globalAlpha = 0.7 * zd * (1 - 0.7 * t) * (0.55 + 0.45 * Math.sin(CLK * 2.3 + i * 2.7));
        ctx.fillRect(tg.x - w / 2 + sw, y, w, Math.max(1, (0.8 + 1.8 * t) * u));
      }
      ctx.restore();
      ctx.globalCompositeOperation = 'lighter';
      // 光照到近处的地上，照到来就这光的人与骆驼
      const gx = 0.8 * W.w, gg = gY(2, 0.8), gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      gr.addColorStop(0, U.rgba(255, 214, 150, 0.42 * zd)); gr.addColorStop(0.55, U.rgba(255, 206, 140, 0.17 * zd)); gr.addColorStop(1, 'rgba(255,200,130,0)');
      ctx.save(); ctx.translate(gx, gg + (W.h - gg) * 0.15); ctx.scale(W.w * 0.46, W.h * 0.26);
      ctx.fillStyle = gr; ctx.globalAlpha = 1; ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
      for (const id of ['cam1', 'cam2', 'cam3', 'king1', 'king2', 'king3']) {
        const f = fig(id);
        if (!f) continue;
        const p = figPt(id, id[0] === 'c' ? 0.55 : 0.5), r = (id[0] === 'c' ? 44 : 30) * u;
        if (!p) continue;
        ctx.globalAlpha = 0.45 * zd * (f.alpha == null ? 1 : f.alpha);
        ctx.drawImage(SP.gold, p[0] - r, p[1] - r, 2 * r, 2 * r);
      }
    }
    ctx.restore();
  }
  // 海面的剪裁（除去远山、中丘；withNear 时连近岸也除去）
  function seaClip(ctx, withNear) {
    const hz = W.horizonY, step = Math.max(5, W.w / 140);
    ctx.beginPath();
    ctx.rect(0, hz, W.w, W.h - hz);
    for (const l of withNear ? [0, 1, 2] : [0, 1]) {
      const bot = l === 2 ? W.h + 4 : W.waterlineY(l);
      ctx.moveTo(-2, bot);
      for (let x = -2; x <= W.w + step; x += step) ctx.lineTo(x, clamp(gYp(l, Math.min(W.w, Math.max(0, x))), hz, bot));
      ctx.lineTo(W.w + step, bot);
      ctx.closePath();
    }
    ctx.clip('evenodd');
  }

  // ════════════════════════════════════════════════════════════
  //  宝座、衣裳、撒拉弗、烟云、荣光（6:1–4）
  // ════════════════════════════════════════════════════════════
  function vis() {
    const port = tall();
    const tg = templeGeom();
    // 横屏：宝座放低一些、离右上角的按钮远一些（撒拉弗的翅膀、光芒都不压在按钮上）
    return { port, tx: W.w * (port ? 0.7 : 0.76), ty: W.h * (port ? 0.405 : 0.29), s: M() * (port ? 0.0012 : 0.0011), tempX: tg.x, tempTop: tg.top, tempBase: tg.base };
  }
  function drawThrone(ctx) {
    const k = W.lv.isThrone;
    if (k < 0.008) return;
    SP || sprites();
    const V = vis(), s = V.s, x = V.tx, y = V.ty;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const pulse = 0.92 + 0.08 * Math.sin(W.t * 1.3);
    let r = 430 * s;
    ctx.globalAlpha = 0.42 * k * pulse; ctx.drawImage(SP.gold, x - r, y - 30 * s - r, 2 * r, 2 * r);
    // 光芒（在画面最上方渐隐，不穿过按钮）
    const rg = ctx.createLinearGradient(0, W.h * 0.05, 0, W.h * 0.05 + 90);
    rg.addColorStop(0, 'rgba(255,236,196,0)'); rg.addColorStop(1, 'rgba(255,236,196,1)');
    ctx.strokeStyle = rg; ctx.lineWidth = Math.max(1, 1.4 * s);
    ctx.beginPath();
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * TAU + W.t * 0.03, L0 = 70 * s, L1 = (230 + 120 * hsh(i * 7)) * s;
      ctx.moveTo(x + Math.cos(a) * L0, y - 30 * s + Math.sin(a) * L0); ctx.lineTo(x + Math.cos(a) * L1, y - 30 * s + Math.sin(a) * L1);
    }
    ctx.globalAlpha = 0.1 * k; ctx.stroke();
    // 宝座：以光的线条画出——高背、扶手、座、足，其下六级台阶
    ctx.strokeStyle = 'rgb(255,242,212)'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 26 * s, y); ctx.lineTo(x - 26 * s, y - 62 * s); ctx.quadraticCurveTo(x - 26 * s, y - 86 * s, x, y - 90 * s);
    ctx.quadraticCurveTo(x + 26 * s, y - 86 * s, x + 26 * s, y - 62 * s); ctx.lineTo(x + 26 * s, y);
    ctx.moveTo(x - 26 * s, y - 24 * s); ctx.lineTo(x - 40 * s, y - 24 * s); ctx.lineTo(x - 40 * s, y + 2 * s);
    ctx.moveTo(x + 26 * s, y - 24 * s); ctx.lineTo(x + 40 * s, y - 24 * s); ctx.lineTo(x + 40 * s, y + 2 * s);
    ctx.moveTo(x - 44 * s, y + 2 * s); ctx.lineTo(x + 44 * s, y + 2 * s);
    ctx.moveTo(x - 36 * s, y + 2 * s); ctx.lineTo(x - 38 * s, y + 26 * s);
    ctx.moveTo(x + 36 * s, y + 2 * s); ctx.lineTo(x + 38 * s, y + 26 * s);
    for (let i = 0; i < 6; i++) { const yy = y + (28 + i * 6) * s, hw = (46 + i * 10) * s; ctx.moveTo(x - hw, yy); ctx.lineTo(x + hw, yy); }
    ctx.lineWidth = Math.max(2, 8 * s); ctx.globalAlpha = 0.16 * k; ctx.stroke();
    ctx.lineWidth = Math.max(1, 2.3 * s); ctx.globalAlpha = 0.9 * k; ctx.stroke();
    // 座上：不可直视的白光（不画形像）
    r = 116 * s;
    ctx.globalAlpha = 0.95 * k * pulse; ctx.drawImage(SP.white, x - r, y - 38 * s - r, 2 * r, 2 * r);
    r = 44 * s;
    ctx.globalAlpha = k; ctx.drawImage(SP.white, x - r, y - 36 * s - r * 1.4, 2 * r, 2.8 * r);
    ctx.restore();
  }
  function drawTrain(ctx) {
    const k = W.lv.isTrain, a0 = W.lv.isThrone;
    if (k < 0.004 || a0 < 0.01) return;
    SP || sprites();
    const V = vis(), s = V.s;
    const y0 = V.ty + 4 * s, y1 = lerp(y0, V.tempBase + 4 * s, k);
    if (y1 - y0 < 2) return;
    const hw0 = 38 * s, hw1 = lerp(hw0, W.w * (V.port ? 0.2 : 0.16), k * k);
    const cx0 = V.tx, cx1 = lerp(V.tx, V.tempX, k), ym = (y0 + y1) / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, 'rgba(255,248,232,0.95)'); gr.addColorStop(0.55, 'rgba(255,230,180,0.62)'); gr.addColorStop(1, 'rgba(255,214,150,0.16)');
    ctx.fillStyle = gr;
    const N = 12;
    for (let i = 0; i < N; i++) {
      const f0 = i / N - 0.5, f1 = (i + 1) / N - 0.5;
      const rp = Math.sin(W.t * 0.55 + i * 1.7) * 5 * s;
      const xa = cx0 + f0 * 2 * hw0, xb = cx0 + f1 * 2 * hw0;
      const xc = cx1 + f1 * 2 * hw1 + rp, xd = cx1 + f0 * 2 * hw1 + rp;
      const bul = (f0 + f1) * 0.5 * hw1 * 0.22;
      ctx.globalAlpha = a0 * (0.13 + 0.1 * (i % 2) + 0.05 * Math.sin(W.t * 0.8 + i * 2.1));
      ctx.beginPath();
      ctx.moveTo(xa, y0);
      ctx.quadraticCurveTo((xa + xd) / 2 + bul, ym, xd, y1);
      ctx.lineTo(xc, y1);
      ctx.quadraticCurveTo((xb + xc) / 2 + bul, ym, xb, y0);
      ctx.closePath(); ctx.fill();
    }
    // 遮满圣殿：落到殿上，化作一层光的帷幔盖住城的上方
    const cov = sm(0.7, 1, k);
    if (cov > 0.01) {
      const hh = V.tempBase - V.tempTop;
      ctx.globalAlpha = 0.5 * cov * a0;
      const w = W.w * 0.42, h = hh * 2.8 + 50 * s;
      ctx.drawImage(SP.gold, V.tempX - w / 2, V.tempBase - h * 0.62, w, h);
      ctx.globalAlpha = 0.55 * cov * a0;
      const w2 = hh * 2.6;
      ctx.drawImage(SP.white, V.tempX - w2 / 2, V.tempTop - w2 * 0.25, w2, w2 * 0.8);
    }
    ctx.restore();
  }
  // 四位撒拉弗在宝座的两旁（竖屏收拢一些）
  const SERAPH = [[-128, -58], [128, -58], [-208, 22], [208, 22]];
  function seraphPos(i, V) {
    const q = SERAPH[i], s = V.s, bob = Math.sin(W.t * 1.1 + i * 1.9) * 5 * s;
    return [V.tx + q[0] * s * (V.port ? 0.8 : 1), V.ty + q[1] * s + bob];
  }
  function drawSeraph(ctx, x, y, s, a, i) {
    const q = s / 2;
    const flap = -0.62 + 0.3 * Math.sin(W.t * 2.3 + i * 1.3);
    const sc = q * 0.88;
    for (const side of [1, -1]) {
      ctx.save();
      ctx.translate(x + side * 6 * q, y - 36 * q);
      ctx.scale(side, 1);
      ctx.rotate(flap);
      ctx.globalAlpha = a * 0.9;
      ctx.drawImage(SP.wing, -WING_RX * sc, -WING_RY * sc, WING_W * sc, WING_H * sc);
      ctx.restore();
    }
    ctx.globalAlpha = a;
    ctx.drawImage(SP.seraph, x - SER_AX * q, y - SER_AY * q, SER * q, SER * q);
  }
  const coalFlying = () => FXL.some(e => e.type === 'coal');
  function drawSeraphim(ctx) {
    const k = W.lv.isSeraph * W.lv.isThrone;
    if (k < 0.01) return;
    SP || sprites();
    const V = vis();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const flying = coalFlying();
    // 显现时先是一团白金的光，而后光中现出形状（不是由暗转亮）
    const kh = Math.sqrt(k), kb = Math.pow(k, 0.6);
    for (let i = 0; i < SERAPH.length; i++) {
      if (i === 2 && flying) continue;
      const p = seraphPos(i, V), r = 62 * V.s * (1.25 - 0.25 * k);
      ctx.globalAlpha = 0.5 * kh * (1 - 0.4 * k); ctx.drawImage(SP.white, p[0] - r, p[1] - 44 * V.s - r, 2 * r, 2 * r);
      ctx.globalAlpha = 0.3 * kh; ctx.drawImage(SP.gold, p[0] - r * 1.5, p[1] - 44 * V.s - r * 1.5, 3 * r, 3 * r);
      drawSeraph(ctx, p[0], p[1], V.s * 1.15, kb * (0.85 + 0.15 * Math.sin(W.t * 1.7 + i)), i);
    }
    ctx.restore();
  }
  // 殿充满了烟云：自殿升起，漫向宝座
  function drawSmoke(ctx) {
    const k = W.lv.isSmoke;
    if (k < 0.01) return;
    SP || sprites();
    const V = vis(), s = V.s;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const N = 36;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(CLK * 0.032 + hsh(i * 3.1));
      const col = hsh(i * 1.7) - 0.5;
      const e = ph * ph * (3 - 2 * ph);
      const x0 = V.tempX + col * W.w * 0.22, y0 = V.tempBase - 6 * s;
      const x1 = V.tx + col * W.w * (V.port ? 0.7 : 0.45), y1 = V.ty - 60 * s;
      const x = lerp(x0, x1, e) + Math.sin(CLK * 0.3 + i) * 12 * s, y = lerp(y0, y1, e);
      const r = (46 + 100 * e) * s * (0.7 + 0.6 * hsh(i * 5.3));
      ctx.globalAlpha = k * 0.34 * Math.sin(Math.PI * ph) * (1 - 0.4 * e);
      ctx.drawImage(SP.puff, x - r, y - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 荣光充满全地
  function drawGlory(ctx) {
    const k = W.lv.isGlory;
    if (k < 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const y0 = W.horizonY - W.h * 0.08;
    const g = ctx.createLinearGradient(0, y0, 0, W.h);
    g.addColorStop(0, 'rgba(255,214,140,0)'); g.addColorStop(0.3, U.rgba(255, 214, 140, 0.12 * k)); g.addColorStop(1, U.rgba(255, 200, 120, 0.2 * k));
    ctx.fillStyle = g; ctx.fillRect(0, y0, W.w, W.h - y0);
    ctx.restore();
  }
  // 异象之中，以赛亚身上有光
  function drawSeerLight(ctx) {
    const k = Math.max(W.lv.isThrone * 0.8, W.lv.isGlory);
    if (k < 0.02) return;
    const p = figPt('isaiah', 0.5);
    if (!p) return;
    SP || sprites();
    const r = 60 * SU();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.32 * k * (0.4 + 0.6 * nightK());
    ctx.drawImage(SP.gold, p[0] - r, p[1] - r, 2 * r, 2 * r);
    ctx.restore();
  }

  // 遍地的黑暗里（9:2；60:2）：人手中的火把、童女身上的光、发光的人（画在黑暗之上，人才看得见）
  function drawGloomLights(ctx) {
    const gl = W.lv.gloom;
    if (gl < 0.05) return;
    SP || sprites();
    const u = SU();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const mp = figPt('mother', 0.55);
    if (mp) {
      const f = fig('mother'), a = gl * (f && f.alpha != null ? f.alpha : 1), r = 72 * u;
      ctx.globalAlpha = 0.6 * a; ctx.drawImage(SP.gold, mp[0] - r, mp[1] - r, 2 * r, 2 * r);
      ctx.globalAlpha = 0.45 * a; ctx.drawImage(SP.white, mp[0] - r * 0.3, mp[1] - r * 0.3, r * 0.6, r * 0.6);
    }
    for (const gid of ['folk', 'nations', 'weary']) for (const m of members(gid)) {
      const al = m.alpha == null ? 1 : m.alpha;
      if (m.prop === 'torch') {
        const p = memberPt(m, 0.95), r = 32 * u, fl = 0.85 + 0.15 * Math.sin(CLK * 8 + (m.phase || 0));
        ctx.globalAlpha = 0.8 * gl * fl * al;
        ctx.drawImage(SP.warm, p[0] + (m.facing || 1) * 5 * u - r, p[1] - r, 2 * r, 2 * r);
      } else if ((m.glow || 0) > 0.25) {
        const p = memberPt(m, 0.5), r = 36 * u;
        ctx.globalAlpha = 0.55 * gl * m.glow * al;
        ctx.drawImage(SP.gold, p[0] - r, p[1] - r, 2 * r, 2 * r);
      }
    }
    for (const id of ['isaiah', 'king1', 'king2', 'king3']) {
      const f = fig(id);
      if (!f || !(f.glow > 0.25)) continue;
      const p = figPt(id, 0.5), r = 40 * u;
      ctx.globalAlpha = 0.5 * gl * f.glow * (f.alpha == null ? 1 : f.alpha);
      ctx.drawImage(SP.gold, p[0] - r, p[1] - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  坛与红炭；耶西的本与枝子
  // ════════════════════════════════════════════════════════════
  function drawAltar(ctx) {
    const oa = 1 - W.lv.isOld;                 // 新天新地：从前的事不再被记念
    if (oa < 0.01) return;
    ctx.save(); ctx.globalAlpha = oa;
    drawAltar0(ctx, oa);
    ctx.restore();
  }
  function drawAltar0(ctx, oa) {
    SP || sprites();
    const s = LS(2) * 1.15, x = X.altar * W.w, g = gY(2, X.altar) + 2 * s;
    const stone = [150, 128, 102];
    ctx.fillStyle = css(stone, 2);
    ctx.beginPath();
    ctx.rect(x - 12.5 * s, g - 3 * s, 25 * s, 3.5 * s);
    ctx.rect(x - 10 * s, g - 14 * s, 20 * s, 11.5 * s);
    ctx.fill();
    ctx.fillStyle = css(mix(stone, [70, 58, 50], 0.35), 2);
    ctx.beginPath();
    ctx.rect(x - 11 * s, g - 15.8 * s, 22 * s, 2.2 * s);
    for (const hx of [-11, 11]) { const d = Math.sign(hx); ctx.moveTo(x + (hx - d * 2.6) * s, g - 15.6 * s); ctx.lineTo(x + (hx + d * 0.4) * s, g - 19.5 * s); ctx.lineTo(x + hx * s, g - 15.6 * s); ctx.closePath(); }
    ctx.fill();
    // 石的层与缝
    ctx.strokeStyle = css(mix(stone, [60, 50, 44], 0.5), 2, 0.45);
    ctx.lineWidth = Math.max(0.5, 0.35 * s);
    ctx.beginPath();
    ctx.moveTo(x - 10 * s, g - 7 * s); ctx.lineTo(x + 10 * s, g - 7 * s);
    ctx.moveTo(x - 10 * s, g - 10.5 * s); ctx.lineTo(x + 10 * s, g - 10.5 * s);
    for (const [jx, y0, y1] of [[-4, 3, 7], [5, 3, 7], [0.5, 7, 10.5], [-6.5, 10.5, 14], [4, 10.5, 14]]) { ctx.moveTo(x + jx * s, g - y0 * s); ctx.lineTo(x + jx * s, g - y1 * s); }
    ctx.stroke();
    const lx = litX() > x ? 1 : -1;
    ctx.strokeStyle = css(lighten(stone, 0.55), 2, 0.55 * (0.2 + 0.8 * W.daylight));
    ctx.lineWidth = Math.max(0.7, 0.6 * s);
    ctx.beginPath(); ctx.moveTo(x - 11 * s, g - 15.8 * s); ctx.lineTo(x + 11 * s, g - 15.8 * s); ctx.moveTo(x + lx * 10 * s, g - 14 * s); ctx.lineTo(x + lx * 10 * s, g - 3 * s); ctx.stroke();
    // 坛上的红炭
    const fl = 0.75 + 0.25 * Math.sin(CLK * 5.1) * Math.sin(CLK * 3.3 + 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = (0.3 + 0.5 * nightK()) * fl * oa;
    ctx.drawImage(SP.ember, x - 17 * s, g - 27 * s, 34 * s, 20 * s);
    ctx.fillStyle = 'rgb(255,128,56)';
    ctx.globalAlpha = 0.9 * fl * oa;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) { const cx = x + (i - 3) * 2.8 * s, cy = g - 16.4 * s - (i % 2) * 0.8 * s; ctx.moveTo(cx + 1.2 * s, cy); ctx.arc(cx, cy, 1.2 * s, 0, TAU); }
    ctx.fill();
    ctx.restore();
    // 一缕细烟
    ctx.strokeStyle = W.shadeCSS([226, 220, 210], 0.1, 0.18);
    ctx.lineWidth = Math.max(0.8, 1.2 * s);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const t = i / 12, yy = g - 17 * s - t * 40 * s, xx = x + Math.sin(CLK * 0.9 + t * 5) * 3 * s * t + t * 6 * s; if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
    ctx.stroke();
  }
  function drawStump(ctx) {
    SP || sprites();
    const s = LS(2) * 1.2, x = X.stump * W.w, g = gY(2, X.stump) + 2 * s;
    const BARK = [92, 70, 52];
    ctx.fillStyle = css(BARK, 2);
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, g + 1.5 * s);
    ctx.quadraticCurveTo(x - 9 * s, g - 1.5 * s, x - 7.5 * s, g - 12 * s);
    ctx.lineTo(x + 7.5 * s, g - 13 * s);
    ctx.quadraticCurveTo(x + 9 * s, g - 1.5 * s, x + 15 * s, g + 1.5 * s);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([198, 160, 112], 2);
    ctx.beginPath(); ctx.ellipse(x, g - 12.5 * s, 7.6 * s, 2.2 * s, -0.06, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([146, 110, 76], 2, 0.85); ctx.lineWidth = Math.max(0.6, 0.45 * s);
    ctx.beginPath(); ctx.ellipse(x, g - 12.5 * s, 4.8 * s, 1.35 * s, -0.06, 0, TAU); ctx.moveTo(x + 2 * s, g - 12.5 * s); ctx.ellipse(x, g - 12.5 * s, 2 * s, 0.6 * s, -0.06, 0, TAU); ctx.stroke();
    const k = W.lv.isShoot;
    if (k > 0.01) drawShoot(ctx, x - 3.5 * s, g - 13 * s, s, k);
  }
  function drawShoot(ctx, bx, by, s, k) {
    const k1 = Math.min(1, k), k2 = Math.max(0, k - 1);
    const h = 34 * s * sm(0, 1, k1) + 40 * s * sm(0, 1, k2);
    if (h < 1) return;
    const P = t => { const u = 1 - t; return [u * u * bx + 2 * u * t * (bx - 5 * s) + t * t * (bx + 2 * s), u * u * by + 2 * u * t * (by - h * 0.5) + t * t * (by - h)]; };
    const stem = mix([88, 132, 62], [96, 76, 56], sm(0, 1, k2));
    ctx.strokeStyle = css(stem, 2); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, (1.3 + 3.2 * k2) * s);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 5 * s, by - h * 0.5, bx + 2 * s, by - h); ctx.stroke();
    ctx.lineCap = 'butt';
    // 叶
    ctx.fillStyle = css([92, 150, 70], 2);
    ctx.beginPath();
    for (let j = 0; j < 7; j++) {
      const t = 0.3 + j * 0.1;
      const g = sm(t * 0.9, t * 0.9 + 0.18, k1);
      if (g < 0.02) continue;
      const p = P(t), side = j % 2 ? 1 : -1, L = (4.2 + 1.2 * (j % 3)) * s * g, a = -Math.PI / 2 + side * (0.95 - 0.08 * j);
      const cx = p[0] + Math.cos(a) * L * 0.55, cy = p[1] + Math.sin(a) * L * 0.55;
      ctx.moveTo(cx + L * 0.5, cy); ctx.ellipse(cx, cy, L * 0.55, L * 0.22, a, 0, TAU);
    }
    // 长成小树：树冠
    if (k2 > 0.02) {
      const top = P(1), R = 16 * s * sm(0, 1, k2);
      for (const [dx, dy, rr] of [[0, -0.2, 1], [-0.8, 0.25, 0.75], [0.8, 0.2, 0.8], [-0.35, -0.75, 0.7], [0.45, -0.7, 0.7]]) {
        const cx = top[0] + dx * R, cy = top[1] + dy * R;
        ctx.moveTo(cx + R * rr * 0.62, cy); ctx.ellipse(cx, cy, R * rr * 0.62, R * rr * 0.5, 0, 0, TAU);
      }
    }
    ctx.fill();
    // 花与果子（枝子必结果实）
    const tip = P(1);
    const fl = sm(0.75, 0.9, k1) * (1 - sm(0.3, 0.8, k2));
    if (fl > 0.02) {
      ctx.fillStyle = css([252, 246, 236], 2, fl, 0.2);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU, r = 1.5 * s; ctx.moveTo(tip[0] + Math.cos(a) * r * 1.4 + r, tip[1] + Math.sin(a) * r * 1.4); ctx.arc(tip[0] + Math.cos(a) * r * 1.4, tip[1] + Math.sin(a) * r * 1.4, r, 0, TAU); }
      ctx.fill();
    }
    const fr = sm(0.92, 1, k1);
    if (fr > 0.02) {
      ctx.fillStyle = css([222, 112, 60], 2, fr, 0.1);
      ctx.beginPath();
      const R = 16 * s * sm(0, 1, k2);
      const spots = k2 > 0.1 ? [[-0.6, 0.3], [0.5, 0.35], [0.1, -0.3], [-0.2, 0.6], [0.7, -0.1]] : [[-0.9, 1.2], [0.9, 1.5]];
      for (const [dx, dy] of spots) { const cx = tip[0] + dx * Math.max(R, 3 * s), cy = tip[1] + dy * Math.max(R, 3 * s); ctx.moveTo(cx + 1.3 * s, cy); ctx.arc(cx, cy, 1.3 * s, 0, TAU); }
      ctx.fill();
    }
    // 嫩枝上的一点光
    const gl = sm(0.3, 1, k1) * (0.5 + 0.5 * (1 - sm(0.5, 1, k2)));
    if (gl > 0.02) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.3 * gl * (0.5 + 0.5 * nightK() + 0.3);
      const r = 18 * s;
      ctx.drawImage(SP.gold, tip[0] - r, tip[1] - r, 2 * r, 2 * r);
      ctx.restore();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  豺狼、豹子、狮子（11:6；65:25）
  // ════════════════════════════════════════════════════════════
  const BEAST = {
    wolf: { cn: '豺狼', bl: 24, bh: 8.4, leg: 10, col: [128, 124, 120], dk: [88, 84, 82], head: 'wolf', tail: 'bush' },
    leopard: { cn: '豹子', bl: 27, bh: 8, leg: 9, col: [210, 164, 92], dk: [150, 110, 60], head: 'cat', tail: 'long', spots: [70, 50, 32] },
    lion: { cn: '少壮狮子', bl: 28, bh: 10, leg: 10, col: [198, 152, 88], dk: [140, 100, 56], head: 'lion', tail: 'tuft', mane: [140, 92, 50] },
  };
  const bScale = () => LS(2) * 1.3;
  // 画一只野兽：局部坐标里面朝 +x，地面 y = 0，y 向上为负；pose：'lie' 卧 | 'stand' 立 | 'feed' 低头吃
  function beastShape(ctx, B, pose, br, dark) {
    const lie = pose === 'lie', feed = pose === 'feed';
    const bl = B.bl, bh = B.bh, by = lie ? -bh * 0.5 - 0.3 : -(B.leg + bh * 0.5);
    ctx.beginPath();
    // 远侧的腿
    if (!lie) {
      legPath(ctx, bl * 0.27, by + bh * 0.2, -1.6, B.leg + bh * 0.3, 2.3);
      legPath(ctx, -bl * 0.33, by + bh * 0.1, -1.4, B.leg + bh * 0.4, 2.6, true);
    }
    if (dark) return;
    ctx.beginPath();
    // 躯干、胸、臀
    ctx.ellipse(0, by + br, bl * 0.46, bh * 0.5, 0, 0, TAU);
    ctx.moveTo(bl * 0.3 + bh * 0.55, by); ctx.ellipse(bl * 0.3, by - bh * 0.05, bh * 0.56, bh * 0.6, 0, 0, TAU);
    ctx.moveTo(-bl * 0.3 + bh * 0.55, by); ctx.ellipse(-bl * 0.3, by, bh * 0.56, bh * 0.58, 0, 0, TAU);
    // 近侧的腿
    if (lie) {
      ctx.rect(bl * 0.22, -2.6, 10, 2.6);                       // 前腿伸向前
      ctx.moveTo(bl * 0.22 + 10, -1.3); ctx.ellipse(bl * 0.22 + 10, -1.3, 1.8, 1.3, 0, 0, TAU);
      ctx.moveTo(-bl * 0.1 + 4, -1.2); ctx.ellipse(-bl * 0.1, -1.2, 4, 1.4, 0, 0, TAU);   // 后足收在腹下
    } else {
      legPath(ctx, bl * 0.32, by + bh * 0.2, 0, B.leg + bh * 0.3, 2.5);
      legPath(ctx, -bl * 0.28, by + bh * 0.1, 0, B.leg + bh * 0.4, 2.8, true);
    }
    // 颈与头
    const hx = feed ? bl * 0.54 + 3 : bl * 0.5 + 3.5, hy = feed ? -3.2 : by - bh * 0.6 - 3.2;
    ctx.moveTo(bl * 0.3, by - bh * 0.5); ctx.lineTo(hx - 1, hy - 2.5); ctx.lineTo(hx + 1.5, hy + 2.5); ctx.lineTo(bl * 0.38, by + bh * 0.3); ctx.closePath();
    if (B.head === 'lion') { ctx.moveTo(hx - 1.2 + 5.6, hy); ctx.arc(hx - 1.2, hy + 0.3, 5.6, 0, TAU); }
    ctx.moveTo(hx + 4, hy); ctx.ellipse(hx, hy, 4, B.head === 'cat' ? 3.2 : 3.4, 0, 0, TAU);
    // 口鼻
    if (B.head === 'wolf') { ctx.moveTo(hx + 2, hy - 1.6); ctx.lineTo(hx + 8.2, hy + 0.6); ctx.lineTo(hx + 7.6, hy + 1.8); ctx.lineTo(hx + 1.6, hy + 2.4); ctx.closePath(); }
    else { ctx.moveTo(hx + 5.8, hy + 1); ctx.ellipse(hx + 3.8, hy + 1, 2.1, 1.7, 0, 0, TAU); }
    // 耳
    if (B.head === 'wolf') { ctx.moveTo(hx - 2, hy - 2.4); ctx.lineTo(hx - 1.2, hy - 6.8); ctx.lineTo(hx + 0.8, hy - 2.8); ctx.closePath(); }
    else if (B.head === 'cat') { ctx.moveTo(hx - 0.4, hy - 3); ctx.arc(hx - 1.4, hy - 3, 1.1, 0, TAU); }
    // 尾
    const tx = -bl * 0.46, ty = by - bh * 0.1;
    if (B.tail === 'bush') { ctx.moveTo(tx, ty - 1.5); ctx.quadraticCurveTo(tx - 6, ty + 1, tx - 7, ty + (lie ? 3 : 7)); ctx.quadraticCurveTo(tx - 4, ty + 4, tx + 0.5, ty + 1.8); ctx.closePath(); }
    ctx.fill();
    if (B.tail !== 'bush') {
      ctx.lineWidth = B.tail === 'long' ? 1.3 : 1.1;
      ctx.beginPath();
      if (B.tail === 'long') { ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 9, ty + 8, tx - 13, ty + (lie ? 2 : 3)); ctx.quadraticCurveTo(tx - 15, ty - 1, tx - 13, ty - 3); }
      else { ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 7, ty + 6, tx - 10, ty + (lie ? 3 : 8)); }
      ctx.stroke();
      if (B.tail === 'tuft') { ctx.beginPath(); ctx.ellipse(tx - 10.3, ty + (lie ? 3 : 8), 1.5, 1.9, 0, 0, TAU); ctx.fill(); }
    }
  }
  function legPath(ctx, x, y0, dx, L, w, hind) {
    const kx = hind ? x - 1.2 : x + 0.4, ky = y0 + L * 0.55;
    ctx.moveTo(x - w / 2 + dx, y0);
    ctx.lineTo(x + w / 2 + dx, y0);
    ctx.lineTo(kx + w * 0.35 + dx, ky);
    ctx.lineTo(x + w * 0.3 + dx + (hind ? 0.8 : 0), 0);
    ctx.lineTo(x - w * 0.3 + dx + (hind ? 0.8 : 0), 0);
    ctx.lineTo(kx - w * 0.35 + dx, ky);
    ctx.closePath();
  }
  // v：在近地纵深里靠前（与人物的 v 同义：脚在 地面 + v·0.8·(画面底 − 地面)，也按 1 + 0.35v 放大）
  const beastY = (xf, v) => { const g = gY(2, xf); return g + (v || 0) * 0.8 * (W.h - g); };
  function drawBeastAt(ctx, kind, xf, facing, pose, a, i, v) {
    const B = BEAST[kind];
    if (!B) return;
    const s = bScale() * (1 + 0.35 * (v || 0)), x = xf * W.w, g = beastY(xf, v) + 1.5 * s;
    const br = Math.sin(CLK * 1.4 + i * 1.7) * 0.25;
    ctx.save();
    ctx.translate(x, g);
    ctx.scale(facing * s, s);
    ctx.globalAlpha = a;
    // 远侧的腿（暗一些）
    ctx.fillStyle = css(B.dk, 2);
    beastShape(ctx, B, pose, br, true);
    ctx.fill();
    ctx.fillStyle = css(B.col, 2);
    ctx.strokeStyle = css(B.col, 2);
    beastShape(ctx, B, pose, br, false);
    if (B.mane) {
      const feed = pose === 'feed', lie = pose === 'lie', bl = B.bl, bh = B.bh, by = lie ? -bh * 0.5 - 0.3 : -(B.leg + bh * 0.5);
      const hx = feed ? bl * 0.54 + 3 : bl * 0.5 + 3.5, hy = feed ? -3.2 : by - bh * 0.6 - 3.2;
      ctx.fillStyle = css(B.mane, 2);
      ctx.beginPath(); ctx.ellipse(hx - 1.8, hy + 0.4, 5.2, 5.8, -0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = css(B.col, 2);
      ctx.beginPath(); ctx.ellipse(hx + 0.6, hy + 0.2, 3.6, 3.3, 0, 0, TAU); ctx.moveTo(hx + 6, hy + 1.2); ctx.ellipse(hx + 4, hy + 1.2, 2.1, 1.7, 0, 0, TAU); ctx.fill();
    }
    if (B.spots) {
      const lie = pose === 'lie', by = lie ? -B.bh * 0.5 - 0.3 : -(B.leg + B.bh * 0.5);
      ctx.fillStyle = css(B.spots, 2, 0.8);
      ctx.beginPath();
      for (let j = 0; j < 16; j++) { const sx = (hsh(j * 3.3) - 0.5) * B.bl * 0.8, sy = by + br + (hsh(j * 7.1) - 0.5) * B.bh * 0.7; ctx.moveTo(sx + 0.8, sy); ctx.arc(sx, sy, 0.75, 0, TAU); }
      ctx.fill();
    }
    // 背上迎光的一道边
    const lit = litX() > x ? 1 : -1;
    const lie = pose === 'lie', by = lie ? -B.bh * 0.5 - 0.3 : -(B.leg + B.bh * 0.5);
    ctx.strokeStyle = css(lighten(B.col, 0.55), 2, 0.55 * (0.25 + 0.75 * W.daylight));
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.ellipse(0, by + br, B.bl * 0.46, B.bh * 0.5, 0, lit * facing > 0 ? -2.4 : -2.9, lit * facing > 0 ? -0.2 : -0.7); ctx.stroke();
    ctx.restore();
  }
  function drawBeasts(ctx) {
    const k = W.lv.isBeasts;
    if (k < 0.01 || !S.beasts) return;
    let i = 0;
    for (const kind in S.beasts) { const b = S.beasts[kind]; drawBeastAt(ctx, kind, b[0], b[1], b[2], k, i++, b[3]); }
  }

  // ════════════════════════════════════════════════════════════
  //  雪与雪被；槽、犁与田
  // ════════════════════════════════════════════════════════════
  function drawSnow(ctx) {
    const k = W.lv.isSnow;
    if (k < 0.01) return;
    const q = W.quality || 1, u = Math.max(0.5, W.unit), n = Math.round(240 * q * k) + 4, H = W.h + 20;
    ctx.fillStyle = U.rgba(246, 248, 255, (0.6 + 0.35 * W.daylight) * Math.min(1, k * 1.4));
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const sp = (24 + 34 * hsh(i * 2.1)) * u, yy = hsh(i * 3.7) * H + CLK * sp;
      const y = (yy % H) - 10;
      const x = ((hsh(i * 1.3) * W.w * 1.2 + Math.sin(CLK * 0.7 + i * 1.9) * 14 * u + yy * 0.08) % (W.w * 1.2)) - W.w * 0.1;
      const r = (0.7 + 1.5 * hsh(i * 5.1)) * u;
      ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
    }
    ctx.fill();
  }
  function drawCover(ctx, layer) {
    const k = W.lv.isCover;
    if (k < 0.01) return;
    const sp = W.landSpan(layer);
    if (!sp) return;
    const x0 = Math.max(0, sp[0]), x1 = Math.min(W.w, sp[1]);
    const step = Math.max(4, W.w / 150), th = [2, 3, 4.5][layer] * Math.max(0.6, W.unit);
    const bottom = layer === 2 ? W.h + 2 : W.waterlineY(layer);
    const lim = layer === 2 ? W.h - 3 : W.waterlineY(layer) - [0.022 * W.h, 2][layer];
    // 只画真正露出水面的地（远处的小岛、没入海中的缓坡不画）
    const runs = [];
    let cur = null;
    for (let x = x0; x < x1 + step; x += step) {
      const xx = Math.min(x, x1), y = gYp(layer, xx);
      if (y < lim) { if (!cur) runs.push(cur = []); cur.push(xx, y); } else cur = null;
    }
    const fillA = W.shadeCSS([236, 240, 248], DEP(layer) * 0.7, 0.34 * k, 0.1), capA = W.shadeCSS([246, 248, 253], DEP(layer) * 0.6, 0.78 * k, 0.18);
    for (const pts of runs) {
      if (pts.length < 6) continue;
      ctx.fillStyle = fillA;
      ctx.beginPath();
      ctx.moveTo(pts[0], bottom);
      for (let i = 0; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1] - 0.5);
      ctx.lineTo(pts[pts.length - 2], bottom);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = capA;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1] - 1);
      for (let i = pts.length - 2; i >= 0; i -= 2) ctx.lineTo(pts[i], pts[i + 1] + th * (0.7 + 0.3 * hsh(i)) * Math.min(1, Math.min(i, pts.length - 2 - i) / 8));
      ctx.closePath(); ctx.fill();
    }
  }
  function drawManger(ctx) {
    if (!fig('ox') && !fig('ass')) return;
    if (W.lv.isOld > 0.5) return;
    const s = LS(2) * 1.1, x = X.manger * W.w, g = gY(2, X.manger) + 2 * s;
    ctx.fillStyle = css([112, 86, 60], 2);
    ctx.beginPath();
    ctx.moveTo(x - 9 * s, g - 9 * s); ctx.lineTo(x + 9 * s, g - 9 * s); ctx.lineTo(x + 7 * s, g - 4 * s); ctx.lineTo(x - 7 * s, g - 4 * s); ctx.closePath();
    ctx.rect(x - 7 * s, g - 4 * s, 1.4 * s, 4 * s); ctx.rect(x + 5.6 * s, g - 4 * s, 1.4 * s, 4 * s);
    ctx.fill();
    ctx.fillStyle = css([196, 170, 104], 2);
    ctx.beginPath(); ctx.ellipse(x, g - 9.2 * s, 8 * s, 1.4 * s, 0, Math.PI, TAU); ctx.fill();
  }
  // 犁：套在牛后，扶犁的人在后面
  function drawPlow(ctx) {
    if (!S.plow) return;
    const ox = fig('ox');
    if (!ox) return;
    const s = LS(2) * 1.3, x = ox.nx * W.w, g = gY(2, ox.nx) + 1.5 * s, d = -(ox.facing || -1);
    ctx.strokeStyle = css([96, 72, 50], 2); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 1.4 * s);
    ctx.beginPath();
    ctx.moveTo(x + d * 10 * s, g - 14 * s); ctx.lineTo(x + d * 26 * s, g - 2 * s);     // 犁辕
    ctx.lineTo(x + d * 31 * s, g);                                                     // 犁头
    ctx.moveTo(x + d * 26 * s, g - 2 * s); ctx.lineTo(x + d * 32 * s, g - 12 * s);     // 犁把
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.fillStyle = css([150, 150, 156], 2, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(x + d * 27 * s, g - 1.5 * s); ctx.lineTo(x + d * 33 * s, g + 0.5 * s); ctx.lineTo(x + d * 27 * s, g + 0.8 * s); ctx.closePath(); ctx.fill();
  }
  // 田：犁过的沟（1:18 之后），发芽（55:10），转为金黄（55:10「使要吃的有粮」）
  function fieldX0() {
    if (S.plow) { const ox = fig('ox'); if (ox) return Math.min(X.field1, ox.nx + 0.03); }
    return S.furrow;
  }
  function drawField(ctx) {
    const oa = 1 - W.lv.isOld;
    if (oa < 0.01) return;
    ctx.save(); ctx.globalAlpha = oa;
    drawField0(ctx);
    ctx.restore();
  }
  function drawField0(ctx) {
    const x0f = fieldX0();
    if (!(x0f < X.field1 - 0.005)) return;
    const x0 = x0f * W.w, x1 = X.field1 * W.w, s = LS(2);
    if (x1 - x0 < 3) return;
    const rows = [0.07, 0.13, 0.19, 0.25, 0.31, 0.37];
    const yAt = (x, v) => { const g = gYp(2, x); return g + v * (W.h - g); };
    const st = Math.max(5, (x1 - x0) / 14);
    // 两端渐隐（不成方块）
    const band = (rgb, a) => {
      const c = W.shade(rgb, 0), g = ctx.createLinearGradient(x0, 0, x1, 0), f = Math.min(0.3, 22 * s / (x1 - x0));
      g.addColorStop(0, U.rgba(c[0], c[1], c[2], 0)); g.addColorStop(f, U.rgba(c[0], c[1], c[2], a));
      g.addColorStop(1 - f, U.rgba(c[0], c[1], c[2], a)); g.addColorStop(1, U.rgba(c[0], c[1], c[2], 0));
      return g;
    };
    const k = W.lv.isField, ripe = sm(1, 2, k);
    ctx.fillStyle = band(mix([112, 84, 58], [150, 118, 70], ripe * 0.5), 0.5);
    ctx.beginPath();
    ctx.moveTo(x0, yAt(x0, 0.04));
    for (let x = x0; x <= x1 + 0.1; x += st) ctx.lineTo(x, yAt(x, 0.04));
    for (let x = x1; x >= x0 - 0.1; x -= st) ctx.lineTo(x, yAt(x, 0.41));
    ctx.closePath(); ctx.fill();
    // 犁沟：暗的沟、亮的垄
    ctx.lineWidth = Math.max(0.8, 1 * s);
    for (const [col, a, dy] of [[[58, 42, 30], 0.6, 0], [[196, 170, 132], 0.3, -1.2]]) {
      ctx.strokeStyle = band(col, a);
      ctx.beginPath();
      for (const v of rows) { ctx.moveTo(x0, yAt(x0, v) + dy * s); for (let x = x0 + st; x <= x1 + 0.1; x += st) ctx.lineTo(x, yAt(x, v) + dy * s); }
      ctx.stroke();
    }
    if (k > 0.02) {
      const h0 = (2 + 4 * sm(0, 1, k) + 5 * ripe) * s, gap = Math.max(3, 4.5 * s), edge = 14 * s;
      const stalks = (fn) => {
        for (let ri = 0; ri < rows.length; ri++) {
          const v = rows[ri], hh = h0 * (0.75 + ri * 0.08);
          for (let x = x0 + gap * 0.5 * (ri % 2); x <= x1; x += gap) {
            const e = Math.min(1, (x - x0) / edge, (x1 - x) / edge);
            if (e < hsh(x * 0.37 + ri)) continue;
            fn(x, yAt(x, v), hh, Math.sin(CLK * 1.3 + x * 0.05) * hh * 0.12);
          }
        }
      };
      ctx.strokeStyle = css(mix([96, 150, 66], [222, 184, 90], ripe), 2);
      ctx.lineWidth = Math.max(0.8, 0.9 * s);
      ctx.beginPath();
      stalks((x, y, hh, sw) => { ctx.moveTo(x, y); ctx.lineTo(x + sw, y - hh); });
      ctx.stroke();
      if (ripe > 0.05) {
        ctx.fillStyle = css([236, 196, 104], 2, ripe, 0.1);
        ctx.beginPath();
        stalks((x, y, hh, sw) => { ctx.moveTo(x + sw + 0.9 * s, y - hh); ctx.ellipse(x + sw, y - hh, 0.9 * s, 1.8 * s, 0, 0, TAU); });
        ctx.fill();
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  大光（9:2）；知识如水充满洋海（11:9）
  // ════════════════════════════════════════════════════════════
  // 大光的位置：横屏在右上（名号在它的左边），竖屏在城的上方（名号在它之上）
  function bigLightXY(k) {
    const port = tall();
    return [W.w * (port ? 0.8 : 0.87), lerp(W.horizonY + W.h * 0.02, W.h * (port ? 0.55 : 0.3), sm(0, 0.75, k))];
  }
  function drawBigLight(ctx) {
    const k = W.lv.isLight;
    if (k < 0.01) return;
    SP || sprites();
    const [x, y] = bigLightXY(k);
    const R = M() * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 光照在黑暗中行走的人身上：近地与城都被照亮
    const gg = gY(2, 0.78), gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, U.rgba(255, 222, 164, 0.26 * k)); gr.addColorStop(0.6, U.rgba(255, 214, 150, 0.1 * k)); gr.addColorStop(1, 'rgba(255,210,150,0)');
    ctx.save(); ctx.translate(W.w * 0.78, gg); ctx.scale(W.w * 0.45, W.h * 0.3);
    ctx.fillStyle = gr; ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
    ctx.globalAlpha = 0.5 * k; ctx.drawImage(SP.gold, x - R * 1.7, y - R * 1.7, R * 3.4, R * 3.4);
    ctx.globalAlpha = 0.95 * k; ctx.drawImage(SP.white, x - R * 0.36, y - R * 0.36, R * 0.72, R * 0.72);
    ctx.strokeStyle = 'rgb(255,240,210)'; ctx.lineWidth = Math.max(1, 1.2 * SU());
    ctx.beginPath();
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + CLK * 0.02, L = R * (0.55 + 0.5 * hsh(i * 3)); ctx.moveTo(x + Math.cos(a) * R * 0.12, y + Math.sin(a) * R * 0.12); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); }
    ctx.globalAlpha = 0.14 * k; ctx.stroke();
    ctx.restore();
  }
  // 知识充满遍地，好像水充满洋海：海面上一片柔和的光（只在海上），与一闪一闪的粼光
  function drawSeaGlow(ctx) {
    const k = W.lv.isSea;
    if (k < 0.01) return;
    const u = SU(), hz = W.horizonY;
    ctx.save();
    seaClip(ctx, false);
    ctx.globalCompositeOperation = 'lighter';
    // 柔光：椭圆的径向渐变，中心在左边的海上，约到 0.55 宽处淡尽
    const cy = hz + (W.h - hz) * 0.55, g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, U.rgba(255, 232, 184, 0.26 * k)); g.addColorStop(0.45, U.rgba(250, 230, 190, 0.12 * k)); g.addColorStop(1, 'rgba(210,228,255,0)');
    ctx.save(); ctx.translate(W.w * 0.2, cy); ctx.scale(W.w * 0.36, (W.h - hz) * 0.75);
    ctx.fillStyle = g; ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
    // 粼光：两头尖的短光，长短、明暗各异，闪烁
    const COL = ['rgb(255,236,196)', 'rgb(255,246,226)', 'rgb(255,226,170)', 'rgb(255,252,240)'];
    for (let b = 0; b < 4; b++) {
      ctx.beginPath();
      let any = false;
      for (let i = 0; i < 260; i++) {
        const yn = Math.pow(hsh(i * 2.7 + 1), 1.4), y = hz + 2 + (W.h - hz) * yn;
        const x = hsh(i * 5.3) * W.w;
        const tw = 0.5 + 0.5 * Math.sin(CLK * (1.1 + hsh(i) * 2.2) + i * 1.7);
        if (Math.min(3, Math.floor(tw * 4)) !== b) continue;
        if (!W.isSea(x, y)) continue;
        const near = 0.25 + 0.75 * yn, L = (3 + 16 * hsh(i * 9.1)) * near * u * (0.55 + 0.45 * tw), h = Math.max(0.5, (0.35 + 0.9 * near) * u * (0.6 + 0.4 * tw));
        ctx.moveTo(x - L / 2, y); ctx.lineTo(x, y - h); ctx.lineTo(x + L / 2, y); ctx.lineTo(x, y + h * 0.6); ctx.closePath();
        any = true;
      }
      if (!any) continue;
      ctx.fillStyle = COL[b];
      ctx.globalAlpha = k * (0.1 + 0.24 * b);
      ctx.fill();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  旷野的河（35:6）；江河与火（43:2）
  // ════════════════════════════════════════════════════════════
  const waterCol = () => U.mixRGB(W.haze || [150, 180, 210], [74, 124, 164], 0.4);
  // 近地上一点：xf 处、纵深 v（0 = 地的轮廓线，1 = 画面底）
  const nearPt = (xf, v) => { const g = gY(2, xf); return [xf * W.w, g + v * (W.h - g)]; };
  // 旷野的河流到海边的那一点：近地变薄、将没入海中之处
  let MOUTH = null;
  function mouthX() {
    const key = W.w + 'x' + W.h;
    if (MOUTH && MOUTH.key === key) return MOUTH.x;
    let x = 0.43;
    for (let xf = 0.6; xf > 0.2; xf -= 0.003) { if (W.h - gY(2, xf) < W.h * 0.1) { x = xf + 0.006; break; } }
    MOUTH = { key, x };
    return x;
  }
  function drawStreams(ctx) {
    const k = W.lv.isStreams;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(2), col = waterCol(), N = 44, xm = mouthX();
    const reach = sm(0, 1, k);
    // 自右边的高处流下，蜿蜒穿过旷野，一直流到海边，从地的边上泻入海中
    const cen = t => {
      const xf = lerp(0.975, xm, t);
      const v = (0.3 + 0.06 * Math.sin(t * 8.5 + 0.6) + 0.1 * t) * (1 - sm(0.8, 1, t));
      const g = gY(2, xf);
      return [xf * W.w + Math.sin(t * 13) * 6 * s * (1 - t), g + v * (W.h - g)];
    };
    const wid = t => (2.5 + 5 * t + 3 * Math.max(0, Math.sin(t * 6.3 - 1))) * s * (1 - 0.35 * sm(0.85, 1, t));
    const L = [], R = [];
    const n = Math.max(2, Math.round(N * reach));
    for (let i = 0; i <= n; i++) {
      const t = i / N;
      const p = cen(t), p2 = cen(t + 0.01), dx = p2[0] - p[0], dy = p2[1] - p[1], d = Math.hypot(dx, dy) || 1, w = wid(t) * (i === n && reach < 0.999 ? 0.3 : 1);
      L.push([p[0] - dy / d * w, p[1] + dx / d * w]); R.push([p[0] + dy / d * w, p[1] - dx / d * w]);
    }
    const A = Math.min(1, k * 3);
    ctx.fillStyle = U.rgba(col[0], col[1], col[2], 0.9 * A);
    ctx.beginPath();
    L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath(); ctx.fill();
    // 河岸：一道湿的暗边
    const bank = U.mixRGB(col, [40, 52, 44], 0.55);
    ctx.strokeStyle = U.rgba(bank[0], bank[1], bank[2], 0.45 * A);
    ctx.lineWidth = Math.max(0.8, 0.9 * s);
    ctx.beginPath();
    L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    R.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    // 两处水池、两道溪
    ctx.fillStyle = U.rgba(col[0], col[1], col[2], 0.9 * A);
    ctx.beginPath();
    for (const t of [0.34, 0.66]) {
      if (t > reach) continue;
      const p = cen(t), r = (10 + 6 * t) * s;
      ctx.moveTo(p[0] + r, p[1]); ctx.ellipse(p[0], p[1], r, r * 0.3, 0, 0, TAU);
    }
    ctx.fill();
    ctx.strokeStyle = U.rgba(col[0], col[1], col[2], 0.85 * A);
    ctx.lineWidth = Math.max(1, 2.2 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [xf, t] of [[0.64, 0.62], [0.82, 0.29]]) {
      if (t > reach) continue;
      const p = cen(t), g = gY(2, xf);
      ctx.moveTo(xf * W.w, g + 2 * s); ctx.quadraticCurveTo(xf * W.w - 8 * s, (g + p[1]) / 2, p[0], p[1]);
    }
    ctx.stroke();
    ctx.lineCap = 'butt';
    // 水上的光；河口泻入海中的一道白水
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(255,250,236)'; ctx.lineWidth = Math.max(0.8, 1 * s);
    ctx.globalAlpha = 0.5 * Math.min(1, k * 2) * (0.35 + 0.65 * W.daylight);
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const t = U.fract(hsh(i * 3.3) + CLK * 0.05);
      if (t > reach) continue;
      const p = cen(t), Lg = (3 + 4 * t) * s;
      ctx.moveTo(p[0] - Lg, p[1]); ctx.lineTo(p[0] + Lg * 0.6, p[1] + 0.3);
    }
    ctx.stroke();
    if (reach > 0.97) {
      const m = cen(1), a = sm(0.97, 1, reach);
      ctx.globalAlpha = 0.55 * a;
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const ox = (j - 2) * 1.6 * s, len = (10 + 8 * hsh(j * 3.7)) * s, ph = U.fract(CLK * 0.9 + hsh(j * 1.9));
        ctx.moveTo(m[0] + ox, m[1] + len * ph * 0.4); ctx.quadraticCurveTo(m[0] + ox - 3 * s, m[1] + len * 0.6, m[0] + ox - 5 * s, m[1] + len);
      }
      ctx.stroke();
      const r = 26 * s;
      ctx.globalAlpha = 0.5 * a; ctx.drawImage(SP.cool, m[0] - 5 * s - r, m[1] + 14 * s - r * 0.5, 2 * r, r);
    }
    ctx.restore();
  }

  // 江河（43:2）：自中丘脚下蜿蜒流下近岸，愈近愈宽，直到画面之下
  const RIV = {
    x: v => 0.585 - 0.07 * v + 0.03 * Math.sin(v * 7 + 0.4) * (0.35 + 0.65 * v),
    w: v => 6 + 30 * Math.pow(Math.max(0, v), 1.15),
  };
  const riverPt = v => nearPt(RIV.x(v), v);
  // 火（43:2）：一道火横过近岸，由远而近
  const FIRE = {
    x: v => 0.738 - 0.055 * v + 0.012 * Math.sin(v * 9 + 1),
    w: v => 11 + 24 * v,
  };
  const firePt = v => nearPt(FIRE.x(v), v);
  const FLAMES = (function () {
    const r = U.mulberry32(432), out = [];
    for (let i = 0; i < 58; i++) { const big = r(); out.push({ v: 0.02 + 1.04 * (i + r()) / 58, off: r() - 0.5, h: 0.35 + 1.1 * big * big, w: 0.65 + 0.7 * r(), ph: r() * TAU, sp: 5 + 8 * r() }); }
    return out;
  })();
  // 正在经过的百姓（江河与火里的人：水在脚下分开、溅起；火焰向两旁弯开）
  function passers() {
    const out = [];
    for (const m of members('folk')) out.push({ x: m.nx, v: (m.v || 0) * 0.8, walking: m.tx != null });
    return out;
  }
  function drawRiver(ctx) {
    const k = W.lv.isRiver;
    if (k < 0.01) return;
    const s = LS(2), col = waterCol(), A = 0.92 * Math.min(1, k * 2);
    const N = 30, Lp = [], Rp = [], C = [];
    for (let i = 0; i <= N; i++) {
      const v = 0.015 + 1.08 * i / N, p = riverPt(v), w = RIV.w(v) * s * (0.4 + 0.6 * k) * (i === 0 ? 0.5 : 1);
      C.push([p[0], p[1], w]); Lp.push([p[0] - w, p[1]]); Rp.push([p[0] + w, p[1]]);
    }
    const poly = (Lq, Rq) => { ctx.beginPath(); Lq.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = Rq.length - 1; i >= 0; i--) ctx.lineTo(Rq[i][0], Rq[i][1]); ctx.closePath(); };
    ctx.fillStyle = U.rgba(col[0], col[1], col[2], A);
    poly(Lp, Rp); ctx.fill();
    // 较深的河心、较浅的一道流
    const deep = U.mixRGB(col, [28, 58, 92], 0.4);
    ctx.fillStyle = U.rgba(deep[0], deep[1], deep[2], 0.45 * A);
    poly(C.map((c, i) => [c[0] - c[2] * 0.45 + Math.sin(i * 0.9 + CLK * 0.6) * c[2] * 0.1, c[1]]), C.map((c, i) => [c[0] + c[2] * 0.2 + Math.sin(i * 0.9 + CLK * 0.6) * c[2] * 0.1, c[1]]));
    ctx.fill();
    // 河岸：暗的湿边
    const bank = U.mixRGB(col, [34, 44, 36], 0.6);
    ctx.strokeStyle = U.rgba(bank[0], bank[1], bank[2], 0.6 * A);
    ctx.lineWidth = Math.max(1, 1.5 * s);
    ctx.beginPath();
    Lp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    Rp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 流动的粼光
    ctx.strokeStyle = 'rgb(236,246,255)'; ctx.lineWidth = Math.max(0.8, 1.1 * s);
    ctx.globalAlpha = 0.45 * k * (0.35 + 0.65 * W.daylight);
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      const v = U.fract(hsh(i * 4.1) + CLK * 0.09) * 1.05, p = riverPt(v), w = RIV.w(v) * s * 0.8;
      const ox = (hsh(i * 7.7) - 0.5) * 2 * w, Lg = (2 + 7 * v) * s;
      ctx.moveTo(p[0] + ox, p[1] - Lg); ctx.lineTo(p[0] + ox - Lg * 0.2, p[1] + Lg * 0.4);
    }
    ctx.stroke();
    // 人在水中经过：脚下水分开，两道白的水纹
    if (k > 0.4) {
      ctx.strokeStyle = 'rgb(240,248,255)';
      ctx.lineWidth = Math.max(0.8, 1.2 * s);
      for (const q of passers()) {
        const rx = RIV.x(q.v), hw = RIV.w(q.v) * s / W.w;
        if (Math.abs(q.x - rx) > hw * 1.05) continue;
        const p = nearPt(q.x, q.v), r = (6 + 5 * q.v) * s, ph = U.fract(CLK * 1.2 + q.x * 37);
        ctx.globalAlpha = 0.6 * k * (1 - ph);
        ctx.beginPath(); ctx.ellipse(p[0], p[1] + 1, r * (0.6 + ph), r * 0.25 * (0.6 + ph), 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
        ctx.globalAlpha = 0.5 * k;
        ctx.beginPath(); ctx.moveTo(p[0] - r * 1.1, p[1] + 1); ctx.lineTo(p[0] - r * 0.5, p[1] - 1); ctx.moveTo(p[0] + r * 1.1, p[1] + 1); ctx.lineTo(p[0] + r * 0.5, p[1] - 1); ctx.stroke();
      }
    }
    ctx.restore();
  }
  // 一条火舌：两边弯曲，尖端随风、并向远离人的一边弯去
  function tongue(ctx, x, y, h, w, lean) {
    const tx = x + lean * h, mx = x + lean * h * 0.35;
    ctx.moveTo(x + w * 0.2, y);
    ctx.bezierCurveTo(x - w * 1.3, y - h * 0.04, mx - w * 1.1, y - h * 0.5, tx, y - h);
    ctx.bezierCurveTo(mx + w * 0.7, y - h * 0.46, x + w * 1.3, y - h * 0.12, x + w * 0.2, y);
    ctx.closePath();
  }
  function flamePath(ctx, x, y, h, w, seed) {
    const f = Math.sin(CLK * 9 + seed) * 0.12 + Math.sin(CLK * 13.7 + seed * 2) * 0.08;
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.9, y - h * 0.5, x + f * w * 3, y - h);
    ctx.quadraticCurveTo(x + w * 0.9, y - h * 0.45, x + w, y);
    ctx.closePath();
  }
  // front：画在人之前（近于人的火焰，半透明——人从火中行过）
  function drawFire(ctx, front) {
    const k = W.lv.isFire;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(2), ps = passers();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (!front) {
      // 地上的火光
      for (let i = 0; i < 12; i++) {
        const v = 0.03 + i * 0.09, p = firePt(v), r = (40 + 50 * v) * s;
        ctx.globalAlpha = 0.3 * k * (0.75 + 0.25 * Math.sin(CLK * 5 + i * 1.7)) * (0.55 + 0.45 * nightK() + 0.2);
        ctx.drawImage(SP.warm, p[0] - r, p[1] - r * 0.75, 2 * r, 1.5 * r);
      }
    }
    const COL = ['rgb(214,70,28)', 'rgb(255,140,50)', 'rgb(255,230,160)'];
    for (let pass = 0; pass < 3; pass++) {
      ctx.beginPath();
      for (const f of FLAMES) {
        if (front ? f.v < 0.5 : f.v >= 0.5) continue;
        const p = firePt(f.v), sc = s * (0.75 + 0.6 * f.v), bw = FIRE.w(f.v) * s;
        const x = p[0] + f.off * bw * 2, y = p[1] + (hsh(f.ph) - 0.5) * 4 * s;
        const fl = 0.66 + 0.22 * Math.sin(CLK * f.sp + f.ph) + 0.12 * Math.sin(CLK * f.sp * 1.7 + f.ph * 2);
        let away = 0;
        for (const q of ps) {
          if (Math.abs(q.v - f.v) > 0.18) continue;
          const dx = x - q.x * W.w, R = 34 * sc;
          if (Math.abs(dx) < R) away += Math.sign(dx || 1) * (1 - Math.abs(dx) / R);
        }
        away = clamp(away, -1, 1);
        // 火焰向两旁弯开、低伏下去，让人从中行过
        const lean = 0.14 * Math.sin(CLK * 1.4 + f.ph) + 0.06 * Math.sin(CLK * 4.3 + f.ph * 3) + 0.4 * away;
        const h = [46, 31, 16][pass] * sc * f.h * fl * k * (1 - 0.45 * Math.abs(away)), w = [5.2, 3.4, 1.7][pass] * sc * f.w * (0.8 + 0.4 * f.h);
        tongue(ctx, x + lean * [0, 1.2, 2.4][pass] * s, y - pass * 0.8 * s, h, w, lean);
      }
      ctx.fillStyle = COL[pass];
      ctx.globalAlpha = (front ? 0.5 : 0.85) * k;
      ctx.fill();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  亚述营（36—37）；亚哈斯的日晷（38:8）
  // ════════════════════════════════════════════════════════════
  const TENTS = [[2, 0.378], [2, 0.41], [2, 0.445], [2, 0.48], [2, 0.515], [1, 0.508], [1, 0.538], [1, 0.568], [1, 0.598], [1, 0.626]];
  function drawCamp(ctx, layer) {
    const k = W.lv.isCamp;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(layer) * 1.15;
    const tentC = css([98, 74, 60], layer, k), dark = css([34, 26, 22], layer, k);
    ctx.fillStyle = tentC;
    ctx.beginPath();
    for (const [l, xf] of TENTS) {
      if (l !== layer) continue;
      const x = xf * W.w, g = gY(l, xf) + 1.5 * s;
      ctx.moveTo(x - 11 * s, g); ctx.lineTo(x - 7 * s, g - 9 * s); ctx.lineTo(x + 6 * s, g - 10 * s); ctx.lineTo(x + 11 * s, g); ctx.closePath();
    }
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath();
    for (const [l, xf] of TENTS) {
      if (l !== layer) continue;
      const x = xf * W.w, g = gY(l, xf) + 1.5 * s;
      ctx.moveTo(x - 2 * s, g); ctx.lineTo(x - 0.5 * s, g - 6 * s); ctx.lineTo(x + 1.5 * s, g); ctx.closePath();
    }
    ctx.fill();
    // 营火：使者经过时自右向左一一熄灭
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    TENTS.forEach(([l, xf], i) => {
      if (l !== layer) return;
      const th = clamp((0.66 - xf) / 0.3, 0.02, 0.98);
      const on = k * (1 - sm(th - 0.06, th + 0.06, W.lv.isCampOut));
      if (on < 0.01) return;
      const x = (xf + 0.014) * W.w, g = gY(l, xf + 0.014) + 2 * s;
      const fl = 0.8 + 0.2 * Math.sin(CLK * 7 + i * 2.1);
      ctx.globalAlpha = on * (0.3 + 0.5 * nightK()) * fl;
      const r = 30 * s;
      ctx.drawImage(SP.warm, x - r, g - r * 1.1, 2 * r, 2 * r);
      ctx.globalAlpha = on * 0.9;
      ctx.fillStyle = 'rgb(255,150,60)';
      ctx.beginPath(); flamePath(ctx, x, g, 7 * s * fl, 2.4 * s, i); ctx.fill();
      ctx.fillStyle = 'rgb(255,230,150)';
      ctx.beginPath(); flamePath(ctx, x, g, 4 * s * fl, 1.2 * s, i + 3); ctx.fill();
    });
    ctx.restore();
  }
  // 亚哈斯的日晷：十级台阶，右端一根表柱；表柱的影盖在阶上，一级一级地往后退（38:8）
  function drawDial(ctx) {
    const a = W.lv.isDialA;
    if (a < 0.01) return;
    SP || sprites();
    const s = LS(2) * 2, x = X.dial * W.w, g = gY(2, X.dial) + 2 * s;
    const xL = x - 22 * s, stepW = 4 * s, rise = 2.5 * s, xR = xL + 10 * stepW;
    ctx.save();
    ctx.globalAlpha = a;
    const stone = [200, 184, 152];
    const stair = () => {
      ctx.beginPath();
      ctx.moveTo(xL, g);
      for (let i = 0; i < 10; i++) { ctx.lineTo(xL + i * stepW, g - (i + 1) * rise); ctx.lineTo(xL + (i + 1) * stepW, g - (i + 1) * rise); }
      ctx.lineTo(xR, g); ctx.closePath();
    };
    ctx.fillStyle = css(stone, 2);
    stair(); ctx.fill();
    // 表柱
    ctx.beginPath();
    ctx.rect(xR, g - 38 * s, 5 * s, 38 * s);
    ctx.rect(xR - 1 * s, g - 40 * s, 7 * s, 2.4 * s);
    ctx.fill();
    // 每一级：阶沿亮，阶面暗
    ctx.strokeStyle = css(lighten(stone, 0.6), 2, 0.9);
    ctx.lineWidth = Math.max(0.8, 0.45 * s);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const y = g - (i + 1) * rise; ctx.moveTo(xL + i * stepW + 0.3 * s, y + 0.4); ctx.lineTo(xL + (i + 1) * stepW, y + 0.4); }
    ctx.stroke();
    ctx.strokeStyle = css(mix(stone, [80, 70, 60], 0.5), 2, 0.55);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const y = g - (i + 1) * rise; ctx.moveTo(xL + i * stepW, y); ctx.lineTo(xL + i * stepW, y + rise); }
    ctx.stroke();
    // 日影：起初盖过十级；后来一级一级往后退，每退一级，那一级上闪一点光
    const n = 10 * (1 - W.lv.isDial), ni = Math.min(10, Math.floor(n + 1e-6)), f = n - ni;
    const covered = ni + sm(0.55, 1, f);
    if (covered > 0.02) {
      const tipX = xR - covered * stepW;
      ctx.save();
      stair(); ctx.rect(xR, g - 38 * s, 5 * s, 38 * s); ctx.clip();
      ctx.fillStyle = 'rgba(28,20,18,0.66)';
      ctx.fillRect(tipX, g - 42 * s, xR + 6 * s - tipX, 44 * s);
      // 表柱的影的边：自柱顶斜落到影的前端
      ctx.fillStyle = 'rgba(28,20,18,0.35)';
      ctx.beginPath(); ctx.moveTo(xR, g - 40 * s); ctx.lineTo(tipX, g - (10 - covered) * rise); ctx.lineTo(tipX - 2 * s, g + 1); ctx.lineTo(xR, g + 1); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    // 日影退后之时，日晷上有光；刚露出的那一级闪一下
    if (W.lv.isDial > 0.005 && W.lv.isDial < 0.995) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.35 * a;
      const r = 40 * s;
      ctx.drawImage(SP.gold, x - r, g - 18 * s - r, 2 * r, 2 * r);
      const gl = f < 0.55 && ni < 10 ? sm(0.1, 0.55, f) : 0;
      if (gl > 0.01) {
        const sx = xL + (9.5 - ni) * stepW, sy = g - (10 - ni) * rise, rr = 9 * s * (0.6 + 0.4 * gl);
        ctx.globalAlpha = 0.9 * a * gl;
        ctx.drawImage(SP.white, sx - rr, sy - rr, 2 * rr, 2 * rr);
        ctx.fillStyle = 'rgb(255,246,220)';
        const L = 7 * s * gl, w = 0.7 * s;
        ctx.beginPath();
        ctx.moveTo(sx - L, sy); ctx.lineTo(sx, sy - w); ctx.lineTo(sx + L, sy); ctx.lineTo(sx, sy + w); ctx.closePath();
        ctx.moveTo(sx, sy - L); ctx.lineTo(sx + w, sy); ctx.lineTo(sx, sy + L * 0.6); ctx.lineTo(sx - w, sy); ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  旷野的大道（35:8；40:3–4）
  // ════════════════════════════════════════════════════════════
  // 大道依着近地的起伏，在地面与画面底之间的 ROAD_V 处；起点在近地够宽之处（不悬在崖上）
  const ROAD_V = 0.5, ROAD1 = 1.03;
  let ROADK = null;
  function roadX0() {
    const key = W.w + 'x' + W.h;
    if (ROADK && ROADK.key === key) return ROADK.x;
    let x = 0.44;
    for (let xf = 0.25; xf < 0.7; xf += 0.003) { if (W.h - gY(2, xf) > W.h * 0.1) { x = xf + 0.02; break; } }
    ROADK = { key, x };
    return x;
  }
  const roadYp = x => { const g = gYp(2, x); return g + ROAD_V * (W.h - g); };
  const roadY = xf => roadYp(xf * W.w);
  function drawRoad(ctx) {
    const k = W.lv.isRoad, A = W.lv.isRoadA * (1 - W.lv.isOld);
    if (k < 0.01 || A < 0.01) return;
    SP || sprites();
    const s = LS(2), r0 = roadX0(), xe = lerp(r0, ROAD1, sm(0, 1, k)), x0 = r0 * W.w, x1 = xe * W.w;
    if (x1 - x0 < 3) return;
    const th = Math.max(2.5, W.h * 0.0075);
    const n = Math.max(4, Math.ceil((x1 - x0) / 7)), P = [];
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; P.push([x, roadYp(x)]); }
    // 两端渐隐：起点慢慢显出；修路时前端也是虚的
    const fin = Math.min(0.45, 0.06 * W.w / (x1 - x0)), fout = k < 0.999 ? Math.min(0.4, 0.04 * W.w / (x1 - x0)) : 0;
    const band = (rgb, a) => {
      const c = W.shade(rgb, 0), g = ctx.createLinearGradient(x0, 0, x1, 0);
      g.addColorStop(0, U.rgba(c[0], c[1], c[2], 0)); g.addColorStop(fin, U.rgba(c[0], c[1], c[2], a));
      g.addColorStop(Math.max(fin, 1 - fout), U.rgba(c[0], c[1], c[2], a)); g.addColorStop(1, U.rgba(c[0], c[1], c[2], fout ? 0 : a));
      return g;
    };
    const edge = (dy) => { P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))); };
    // 路面
    ctx.fillStyle = band([200, 184, 150], 0.62 * A);
    ctx.beginPath();
    edge(-th);
    for (let i = n; i >= 0; i--) ctx.lineTo(P[i][0], P[i][1] + th * 1.1);
    ctx.closePath(); ctx.fill();
    // 路的两边：一道暗的边（上边细，下边稍宽）
    ctx.strokeStyle = band([96, 80, 60], 0.38 * A);
    ctx.lineWidth = Math.max(0.7, 0.7 * s);
    ctx.beginPath(); edge(-th); ctx.stroke();
    ctx.lineWidth = Math.max(0.9, 1.1 * s);
    ctx.beginPath(); edge(th * 1.1); ctx.stroke();
    // 铺路的石：不规则的一块一块（两端稀疏）
    const m = Math.floor((x1 - x0) / (6 * s)), fw = Math.max(1, fin * (x1 - x0));
    ctx.fillStyle = band([150, 134, 106], 0.5 * A);
    ctx.beginPath();
    for (let i = 0; i < m; i++) {
      const x = x0 + (i + hsh(i * 3.1)) * 6 * s;
      if (Math.min(1, (x - x0) / fw, (x1 - x) / Math.max(1, 20 * s)) < hsh(i * 2.3)) continue;
      const y = roadYp(x) + (hsh(i * 5.7) - 0.5) * th * 1.2;
      const w = (2 + 2.2 * hsh(i * 1.9)) * s, h = (0.8 + 0.6 * hsh(i * 7.3)) * s;
      ctx.moveTo(x + w / 2, y); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, TAU);
    }
    ctx.fill();
    // 路上的光：耶和华的荣耀必然显现；修路时，路的前端有一团柔光
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = band([255, 232, 176], 1);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, th * 0.45);
    ctx.globalAlpha = 0.12 * A * (0.75 + 0.25 * Math.sin(CLK * 1.1)) * (0.6 + 0.6 * nightK());
    ctx.beginPath(); edge(0); ctx.stroke();
    if (k > 0.01 && k < 0.99) { const r = 42 * s, y1 = roadYp(x1); ctx.globalAlpha = 0.5 * A; ctx.drawImage(SP.gold, x1 - r, y1 - r * 0.7, 2 * r, 1.4 * r); }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  众星（40:26）；鹰（40:31）
  // ════════════════════════════════════════════════════════════
  // 三个星座：北斗、参星、昴星（位置以 M() 为单位的偏移）
  // 横屏：北斗在月亮黎明时走过的弧线之下，参星在右上，昴星低悬城上；竖屏：都在经文之下
  const CONST = [
    { name: '北斗', pts: [[0, 0], [0.045, 0.01], [0.085, 0.028], [0.12, 0.048], [0.125, 0.088], [0.18, 0.1], [0.19, 0.058]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]], L: [0.52, 0.27], P: [0.56, 0.33] },
    { name: '参星', pts: [[0, 0], [0.08, 0.012], [0.03, 0.062], [0.043, 0.066], [0.056, 0.07], [0.012, 0.118], [0.086, 0.112]], edges: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]], L: [0.86, 0.13], P: [0.22, 0.37] },
    { name: '昴星', pts: [[0, 0], [0.012, 0.005], [0.021, -0.006], [0.03, 0.007], [0.018, 0.015], [0.006, 0.017], [0.031, -0.003]], edges: [], L: [0.74, 0.4], P: [0.42, 0.52] },
  ];
  let HOST = null;
  function buildHost() {
    const r = U.mulberry32(4026), list = [];
    for (let i = 0; i < 150; i++) list.push({ x: 0.02 + 0.96 * r(), y: r(), m: Math.pow(r(), 2.6), tw: r() * TAU, sp: 0.8 + r() * 2, c: -1 });
    list.sort((a, b) => a.x - b.x);
    list.forEach((s, i) => { s.rank = 0.02 + 0.74 * (i / list.length); });
    CONST.forEach((c, ci) => c.pts.forEach((p, j) => list.push({ c: ci, j, m: 0.85 + 0.15 * hsh(ci * 9 + j), tw: hsh(j * 3 + ci) * TAU, sp: 1.2, rank: 0.8 + 0.04 * ci + 0.005 * j })));
    HOST = list;
  }
  function starXY(st) {
    if (st.c >= 0) {
      const C0 = CONST[st.c], port = tall(), base = port ? C0.P : C0.L, p = C0.pts[st.j];
      return [base[0] * W.w + p[0] * M(), base[1] * W.h + p[1] * M()];
    }
    const port = tall();
    return [st.x * W.w, (port ? 0.06 + 0.5 * st.y : 0.03 + 0.46 * st.y) * W.h];
  }
  // 众星：柔和的圆光；亮星有短短的、渐隐的四道芒；被一一称名而领出时闪一下
  const FLASH = 0.05;
  function drawHost(ctx) {
    const lv = W.lv.isHost;
    if (lv < 0.005) return;
    const A = clamp(W.night * 1.3 + W.dusk * 0.28, 0, 1) * (1 - clamp(W.lv.storm, 0, 1)) * (1 - 0.8 * W.lv.gloom);
    if (A < 0.01) return;
    if (!HOST) buildHost();
    SP || sprites();
    const u = Math.max(0.7, W.unit);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,248,232)';
    for (let b = 0; b < 3; b++) {
      ctx.beginPath();
      for (const st of HOST) {
        const age = lv - st.rank;
        if (age < 0) continue;
        const bb = st.m > 0.6 || st.c >= 0 ? 2 : st.m > 0.25 ? 1 : 0;
        if (bb !== b) continue;
        const tw = 0.7 + 0.3 * Math.sin(CLK * st.sp + st.tw);
        const p = starXY(st), r = (0.45 + st.m * 1.1) * u * (0.65 + 0.35 * tw);
        ctx.moveTo(p[0] + r, p[1]); ctx.arc(p[0], p[1], r, 0, TAU);
      }
      ctx.globalAlpha = A * (0.5 + 0.25 * b);
      ctx.fill();
    }
    // 亮星的光晕与芒；刚被领出的星闪一下
    for (const st of HOST) {
      const age = lv - st.rank;
      if (age < 0) continue;
      const bright = st.m > 0.6 || st.c >= 0, fl = age < FLASH ? 1 - age / FLASH : 0;
      if (!bright && fl <= 0) continue;
      const p = starXY(st), tw = 0.75 + 0.25 * Math.sin(CLK * st.sp * 1.3 + st.tw);
      const g = (bright ? 3.5 + 4 * st.m : 2.5) * u * (1 + 2.4 * fl);
      ctx.globalAlpha = A * ((bright ? 0.32 : 0) + 0.7 * fl);
      ctx.drawImage(SP.white, p[0] - g, p[1] - g, 2 * g, 2 * g);
      const L = (bright ? 2.8 + 3.2 * st.m : 2) * u * tw * (1 + 1.8 * fl), w = 0.45 * u;
      ctx.globalAlpha = A * ((bright ? 0.42 : 0) + 0.55 * fl);
      ctx.beginPath();
      ctx.moveTo(p[0] - L, p[1]); ctx.lineTo(p[0], p[1] - w); ctx.lineTo(p[0] + L, p[1]); ctx.lineTo(p[0], p[1] + w); ctx.closePath();
      ctx.moveTo(p[0], p[1] - L); ctx.lineTo(p[0] + w, p[1]); ctx.lineTo(p[0], p[1] + L); ctx.lineTo(p[0] - w, p[1]); ctx.closePath();
      ctx.fill();
    }
    // 星座之线（昴星只以其名标出）
    const cl = W.lv.isConst;
    if (cl > 0.01) {
      ctx.strokeStyle = 'rgb(255,226,170)';
      ctx.lineWidth = Math.max(0.8, 0.9 * u);
      ctx.globalAlpha = A * cl * 0.36;
      ctx.beginPath();
      CONST.forEach(c => {
        const base = tall() ? c.P : c.L;
        const P = j => [base[0] * W.w + c.pts[j][0] * M(), base[1] * W.h + c.pts[j][1] * M()];
        for (const [a, b] of c.edges) { const pa = P(a), pb = P(b); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); }
      });
      ctx.stroke();
    }
    ctx.restore();
  }
  function constCenter(ci) {
    const c = CONST[ci], base = tall() ? c.P : c.L;
    let sx = 0, sy = 0;
    for (const p of c.pts) { sx += p[0]; sy += p[1]; }
    return [base[0] * W.w + sx / c.pts.length * M(), base[1] * W.h + sy / c.pts.length * M()];
  }
  function drawEagles(ctx) {
    const k = W.lv.isEagles;
    if (k < 0.01) return;
    const u = SU();
    const col = W.shadeCSS([44, 36, 30], 0.15);
    const rim = U.rgba(255, 214, 160, 0.5 * W.dusk + 0.2 * W.daylight);
    for (let i = 0; i < 3; i++) {
      const cx = W.w * (0.72 + 0.07 * Math.sin(CLK * 0.13 + i * 2.1)), base = gY(2, 0.72);
      const cy = lerp(base - 30 * u, W.h * ((tall() ? 0.36 : 0.18) + 0.06 * i), sm(0, 1, k));
      const R = (40 + 26 * i) * u * (0.35 + 0.65 * k);
      const a = CLK * (0.42 + 0.1 * i) + i * 2.1;
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.3;
      const span = 20 * u * (1 + 0.12 * i), flap = (1 - k) * Math.sin(CLK * 7 + i) * 0.6 + 0.1 * Math.sin(CLK * 1.3 + i);
      const dir = -Math.sin(a) >= 0 ? 1 : -1;
      ctx.globalAlpha = Math.min(1, k * 3);
      ctx.fillStyle = col;
      eaglePath(ctx, x, y, span, flap, dir);
      ctx.fill();
      ctx.strokeStyle = rim; ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function eaglePath(ctx, x, y, span, flap, dir) {
    ctx.beginPath();
    ctx.ellipse(x, y, span * 0.2, span * 0.065, 0, 0, TAU);
    const tipY = y - span * (0.1 + flap * 0.5);
    for (const sd of [-1, 1]) {
      ctx.moveTo(x, y - span * 0.03);
      ctx.quadraticCurveTo(x + sd * span * 0.45, tipY - span * 0.16, x + sd * span, tipY);
      ctx.lineTo(x + sd * span * 0.93, tipY + span * 0.07);
      ctx.lineTo(x + sd * span * 0.88, tipY + span * 0.04);
      ctx.lineTo(x + sd * span * 0.82, tipY + span * 0.1);
      ctx.quadraticCurveTo(x + sd * span * 0.42, y + span * 0.12, x, y + span * 0.05);
      ctx.closePath();
    }
    ctx.moveTo(x + dir * span * 0.26, y - span * 0.02); ctx.arc(x + dir * span * 0.22, y - span * 0.02, span * 0.05, 0, TAU);
    ctx.moveTo(x - dir * span * 0.18, y); ctx.lineTo(x - dir * span * 0.34, y - span * 0.05); ctx.lineTo(x - dir * span * 0.34, y + span * 0.06); ctx.closePath();
  }

  // ════════════════════════════════════════════════════════════
  //  仆人身上的黑暗（53:6）；歌唱的山（55:12）；新天的光幔（65:17）
  // ════════════════════════════════════════════════════════════
  // 仆人：脚下一片清楚的、被照亮的地；众人的罪孽如一道暗的柱，自上而下落在他身上（53:6）
  // 画在近地的底层（人之前画），他的身形在暗柱与亮地上都看得清
  function drawServantGround(ctx) {
    const f = fig('servant');
    if (!f) return;
    SP || sprites();
    const p = figPt('servant', 0);
    if (!p) return;
    const u = SU(), al = f.alpha == null ? 1 : f.alpha, k = W.lv.isBurden;
    ctx.save();
    if (k > 0.01) {
      const w = 96 * u;
      ctx.globalAlpha = 0.56 * k * al;
      ctx.drawImage(SP.shade, p[0] - w / 2, -10, w, p[1] + 22);
      ctx.globalAlpha = 0.4 * k * al;
      ctx.drawImage(SP.shade, p[0] - w * 0.3, -10, w * 0.6, p[1] + 16);
    }
    ctx.globalCompositeOperation = 'lighter';
    const r = 72 * u, gl = (0.42 + 0.3 * (f.glow || 0)) * (1 - 0.3 * k) * al;
    ctx.globalAlpha = gl;
    ctx.drawImage(SP.gold, p[0] - r, p[1] - r * 0.2, 2 * r, r * 0.5);
    ctx.globalAlpha = gl * 0.6;
    ctx.drawImage(SP.white, p[0] - r * 0.5, p[1] - r * 0.1, r, r * 0.26);
    ctx.restore();
  }
  function drawBurden(ctx) {
    const k = W.lv.isBurden;
    if (k < 0.01) return;
    SP || sprites();
    const p = figPt('servant', 0);
    if (!p) return;
    const w = 56 * SU();
    ctx.save();
    ctx.globalAlpha = 0.22 * k;
    ctx.drawImage(SP.shade, p[0] - w / 2, -10, w, p[1] + 6);
    ctx.restore();
  }
  function drawHillGlow(ctx, layer) {
    const k = W.lv.isHills;
    if (k < 0.01) return;
    const sp = W.landSpan(layer);
    if (!sp) return;
    const x0 = Math.max(0, sp[0]), x1 = Math.min(W.w, sp[1]), step = Math.max(4, W.w / 160);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    for (let x = x0; x <= x1; x += step) { const y = gYp(layer, x); if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.strokeStyle = 'rgb(255,226,170)';
    const pul = 0.75 + 0.25 * Math.sin(CLK * 2.2 + layer);
    ctx.lineWidth = Math.max(3, 9 * SU()); ctx.globalAlpha = 0.12 * k * pul; ctx.stroke();
    ctx.lineWidth = Math.max(1, 2 * SU()); ctx.globalAlpha = 0.45 * k * pul; ctx.stroke();
    ctx.restore();
  }
  function drawNewSky(ctx) {
    const k = W.lv.isNew;
    if (k < 0.01) return;
    const hz = W.horizonY;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const COLS = [[255, 214, 170], [236, 196, 232], [190, 236, 222]];
    for (let b = 0; b < 3; b++) {
      const col = COLS[b], y0 = hz * (0.16 + b * 0.17);
      for (let layer = 0; layer < 3; layer++) {
        const th = hz * 0.06 * (1 - layer * 0.3);
        ctx.beginPath();
        const n = 24;
        for (let i = 0; i <= n; i++) { const x = i / n * W.w, y = y0 + Math.sin(i / n * TAU * 1.1 + CLK * 0.12 + b * 1.7) * hz * 0.05 - th; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        for (let i = n; i >= 0; i--) { const x = i / n * W.w, y = y0 + Math.sin(i / n * TAU * 1.1 + CLK * 0.12 + b * 1.7 + 0.4) * hz * 0.05 + th; ctx.lineTo(x, y); }
        ctx.closePath();
        ctx.fillStyle = U.rgba(col[0], col[1], col[2], 0.065 * k * (0.55 + 0.45 * W.daylight));
        ctx.fill();
      }
    }
    ctx.restore();
  }
  // 新天新地：豺狼与羊羔、狮子与牛、小孩子所在的那一片地上有柔和的光（65:25）
  const NEWG = [0.68, 0.86];
  function drawNewGround(ctx) {
    const k = Math.min(W.lv.isNew, W.lv.isOld);
    if (k < 0.01 || !S.beasts || !S.beasts.lion) return;
    const xm = (NEWG[0] + NEWG[1]) / 2, g = gY(2, xm), y = g + 0.32 * (W.h - g);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, U.rgba(255, 234, 186, 0.3 * k)); gr.addColorStop(0.6, U.rgba(255, 226, 170, 0.12 * k)); gr.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.translate(xm * W.w, y); ctx.scale((NEWG[1] - NEWG[0]) * W.w * 0.75, (W.h - g) * 0.42);
    ctx.fillStyle = gr; ctx.fillRect(-1, -1, 2, 2);
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
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 6, xf, l, w: (o.w || 70) * SU(), k: o.k || 1 });
    if (o.ring !== false) fx().ring(xf * W.w, gY(l, xf) - 16 * LS(l), [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.nx, f.layer, o); }
  // 暗的微尘：自众人（与羊）流向仆人
  function motes(b, gids, dur) {
    if (b.instant) return;
    const list = [];
    for (const gid of gids) for (const m of members(gid)) {
      const p = memberPt(m, m.isAnimal ? 0.5 : 0.55);
      for (let j = 0; j < 3; j++) list.push({ x: p[0] + rand(-6, 6), y: p[1] + rand(-8, 8), d: rand(0, 1.6), arc: rand(-0.4, 0.4) });
    }
    FXL.push({ type: 'motes', t: 0, dur: dur || 4.5, list });
  }
  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam') {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const env = sm(0, 0.15, q) * (1 - sm(0.6, 1, q));
        const x = e.xf * W.w, y = gY(e.l, e.xf);
        ctx.globalAlpha = env * 0.5 * e.k;
        ctx.drawImage(SP.beam, x - e.w / 2, -10, e.w, y + 10);
        ctx.globalAlpha = env * 0.55 * e.k;
        const g = e.w * 2.4;
        ctx.drawImage(SP.gold, x - g / 2, y - g * 0.45, g, g * 0.9);
        ctx.restore();
      } else if (e.type === 'glyph') {
        drawGlyph(ctx, e);
      } else if (e.type === 'coal') {
        drawCoal(ctx, e, q);
      } else if (e.type === 'angel') {
        // 耶和华的使者：一道光的人形自右向左掠过亚述营
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const xf = lerp(0.7, 0.33, U.easeInOut ? U.easeInOut(q) : q), env = sm(0, 0.12, q) * (1 - sm(0.85, 1, q));
        const x = xf * W.w, y = gY(1, clamp(xf, 0.5, 0.95)) - 48 * LS(2);
        for (let j = 0; j < 6; j++) {
          const xx = x + j * 18 * u, r = (60 - j * 7) * u;
          ctx.globalAlpha = env * 0.22 * (1 - j / 6);
          ctx.drawImage(SP.white, xx - r, y - r, 2 * r, 2 * r);
        }
        lightFigure(ctx, x, y + 20 * LS(2), 36 * LS(2), env);
        ctx.restore();
      } else if (e.type === 'motes') {
        const p1 = figPt('servant', 0.5);
        if (!p1) continue;
        ctx.fillStyle = 'rgba(14,10,18,0.85)';
        ctx.beginPath();
        for (const m of e.list) {
          const t = clamp((e.t - m.d) / Math.max(0.5, e.dur - 1.8), 0, 1);
          if (t <= 0 || t >= 1) continue;
          const ee = t * t * (3 - 2 * t);
          const mx = (m.x + p1[0]) / 2, my = Math.min(m.y, p1[1]) - 40 * u + m.arc * 60 * u;
          const x = (1 - ee) * (1 - ee) * m.x + 2 * (1 - ee) * ee * mx + ee * ee * p1[0], y = (1 - ee) * (1 - ee) * m.y + 2 * (1 - ee) * ee * my + ee * ee * p1[1];
          const r = 1.6 * u * (1 - 0.4 * ee);
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
        }
        ctx.fill();
      } else if (e.type === 'sweep') {
        // 光沿着大道自左而右跑过
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const xf = lerp(roadX0(), ROAD1, q), x = xf * W.w, y = roadY(xf), env = sm(0, 0.1, q) * (1 - sm(0.85, 1, q)), r = 64 * u;
        ctx.globalAlpha = 0.55 * env; ctx.drawImage(SP.gold, x - r, y - r * 0.7, 2 * r, 1.4 * r);
        ctx.globalAlpha = 0.6 * env; ctx.drawImage(SP.white, x - r * 0.35, y - r * 0.3, r * 0.7, r * 0.6);
        ctx.restore();
      } else if (e.type === 'wave') {
        // 新天新地：一道新的光自灵所在之处向两边扫过天地
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const R = q * Math.max(W.w, W.h) * 1.1, env = sm(0, 0.08, q) * (1 - sm(0.6, 1, q));
        for (const sd of [-1, 1]) {
          const x = e.x + sd * R, w = 90 * u;
          ctx.globalAlpha = 0.5 * env; ctx.drawImage(SP.beam, x - w, -20, 2 * w, W.h + 40);
          ctx.globalAlpha = 0.3 * env; ctx.drawImage(SP.white, x - w, W.horizonY - w, 2 * w, 2 * w);
        }
        ctx.restore();
      }
    }
  }
  function lightFigure(ctx, x, y, h, a) {
    if (a < 0.01 || h < 0.8) return;
    ctx.globalAlpha = a * 0.45;
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(255,250,236)';
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * h, y);
    ctx.quadraticCurveTo(x - 0.13 * h, y - 0.45 * h, x - 0.075 * h, y - 0.78 * h);
    ctx.lineTo(x + 0.075 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.13 * h, y - 0.45 * h, x + 0.17 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.078 * h, y - 0.88 * h); ctx.arc(x, y - 0.88 * h, 0.078 * h, 0, TAU);
    ctx.fill();
  }
  // 一撒拉弗飞到坛前取红炭，飞来沾以赛亚的口，又飞回宝座旁
  function coalPos(q) {
    const V = vis(), P0 = seraphPos(2, V);
    const s = V.s, q2 = s / 2, hand = [22 * q2, -40 * q2];
    const altar = [X.altar * W.w - hand[0], gY(2, X.altar) - 20 * LS(2) - hand[1]];
    const mp = figPt('isaiah', 0.62) || [X.isaiah * W.w, gY(2, X.isaiah) - 26 * LS(2)];
    const mouth = [mp[0] + 16 * LS(2) - hand[0], mp[1] - hand[1]];
    const seg = (a, b, t) => { const e = t * t * (3 - 2 * t); return [lerp(a[0], b[0], e), lerp(a[1], b[1], e) - Math.sin(Math.PI * t) * 30 * s]; };
    let p, coal = false;
    if (q < 0.33) p = seg(P0, altar, q / 0.33);
    else if (q < 0.42) { p = altar; coal = q > 0.37; }
    else if (q < 0.65) { p = seg(altar, mouth, (q - 0.42) / 0.23); coal = true; }
    else if (q < 0.72) { p = mouth; coal = q < 0.69; }
    else p = seg(mouth, P0, (q - 0.72) / 0.28);
    return { p, coal, hand, s };
  }
  function drawCoal(ctx, e, q) {
    const env = W.lt.isThrone > 0.5 ? 1 : W.lv.isThrone;      // 异象若已收起（下一句提前成就），飞行的撒拉弗也随之隐去
    if (env < 0.01) return;
    const c = coalPos(q);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawSeraph(ctx, c.p[0], c.p[1], c.s, env, 2);
    ctx.restore();
    if (c.coal) {
      // 火剪夹着的红炭：画在光之上，才看得出是一块炭
      const hx = c.p[0] + c.hand[0], hy = c.p[1] + c.hand[1], r = 20 * c.s, fl = 0.85 + 0.15 * Math.sin(CLK * 11);
      ctx.save();
      ctx.strokeStyle = 'rgba(120,96,80,0.9)'; ctx.lineWidth = Math.max(1, 1.2 * c.s);
      ctx.beginPath(); ctx.moveTo(hx - 12 * c.s, hy - 10 * c.s); ctx.lineTo(hx, hy); ctx.moveTo(hx - 12 * c.s, hy - 7 * c.s); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.9 * fl; ctx.drawImage(SP.ember, hx - r, hy - r, 2 * r, 2 * r);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      const rr = Math.max(2, 4 * c.s);
      ctx.fillStyle = 'rgb(150,30,16)';
      ctx.beginPath(); ctx.arc(hx, hy, rr * 1.15, 0, TAU); ctx.fill();
      ctx.fillStyle = U.rgb(255, 110 + 60 * fl, 40);
      ctx.beginPath(); ctx.arc(hx - rr * 0.15, hy - rr * 0.15, rr * 0.8, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  // 异象显现时，画面顶上的卷名与按钮退为淡影，不压在荣光上
  const HUD = { k: 1, els: null };
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }
  function hudFade(dt) {
    const want = isCur() && W.lv.isThrone > 0.4 && !tall() ? 0.6 : 1;
    if (want === 1 && HUD.k === 1) return;
    if (typeof document === 'undefined') return;
    if (!HUD.els) HUD.els = ['act', 'tools'].map(id => document.getElementById(id)).filter(Boolean);
    const k0 = HUD.k;
    HUD.k = approachLin(HUD.k, want, Math.max(0, dt) * 0.8);
    if (Math.abs(HUD.k - k0) < 1e-4 && HUD.k !== want) return;
    const f = HUD.k >= 0.999 ? '' : 'opacity(' + HUD.k.toFixed(3) + ')';
    for (const el of HUD.els) if (el.style.filter !== f) el.style.filter = f;
  }

  // 百姓的衣袍：朱红 → 雪白（随 isWhite）
  function tintFolk() {
    const g = crowdObj('folk');
    if (!g) return;
    const k = Math.round(W.lv.isWhite * 100) / 100;
    if (g._isTint === k) return;
    g._isTint = k;
    g.members.forEach((m, i) => { m.robe = mix(CRIMSON[i % 3], WOOL, k); });
  }

  // ════════════════════════════════════════════════════════════
  //  布景的调度
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      W.setOrigin('trees', W.w * TREE_X, W.ridgeBaseY(2, W.w * TREE_X));
    },
    update(dt) {
      U.safe('isaiah.hud', () => hudFade(dt));
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      CLK += f;
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      tintFolk();
      easeDepth(f);
      if (!W.replaying) U.safe('isaiah.splash', () => splash(f));
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawNewSky(ctx); drawHost(ctx); }
      else if (pass === 'far') { drawCover(ctx, 0); drawHillGlow(ctx, 0); }
      else if (pass === 'mid') { drawCover(ctx, 1); drawHillGlow(ctx, 1); drawCamp(ctx, 1); drawCity(ctx); }
      else if (pass === 'near') {
        drawCover(ctx, 2); drawField(ctx); drawStreams(ctx); drawRoad(ctx); drawRiver(ctx);
        drawCamp(ctx, 2); drawStump(ctx); drawAltar(ctx); drawManger(ctx); drawDial(ctx); drawFire(ctx, false);
        drawServantGround(ctx); drawNewGround(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'mid') { drawTrain(ctx); drawSmoke(ctx); }
      else if (pass === 'seaNear') drawSeaGlow(ctx);
      else if (pass === 'near') { drawPlow(ctx); drawBeasts(ctx); }
      else if (pass === 'air') {
        drawGlory(ctx); drawGloomLights(ctx); drawFire(ctx, true); drawBurden(ctx); drawSnow(ctx); drawZion(ctx); drawBigLight(ctx);
        drawThrone(ctx); drawSeraphim(ctx); drawSeerLight(ctx); drawEagles(ctx); drawFX(ctx);
      }
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      const tg = templeGeom();
      cand('圣殿', tg.x, tg.top + 10 * tg.K);
      cand('耶路撒冷', 0.69 * W.w, gY(1, 0.69) - 10 * tg.K);
      cand('耶路撒冷', 0.9 * W.w, gY(1, 0.9) - 10 * tg.K);
      if (W.lv.isOld < 0.5) cand('坛', X.altar * W.w, gY(2, X.altar) - 14 * LS(2));
      cand(W.lv.isShoot > 0.4 ? '枝子' : '耶西的本', X.stump * W.w, gY(2, X.stump) - (W.lv.isShoot > 0.4 ? 30 : 12) * LS(2));
      if (W.lv.isThrone > 0.4) { const V = vis(); cand('宝座', V.tx, V.ty - 30 * V.s); if (W.lv.isSeraph > 0.4) for (let i = 0; i < 4; i++) { const p = seraphPos(i, V); cand('撒拉弗', p[0], p[1] - 30 * V.s); } }
      if (W.lv.isBeasts > 0.4 && S.beasts) for (const kind in S.beasts) { const b = S.beasts[kind]; cand(BEAST[kind].cn, b[0] * W.w, beastY(b[0], b[3]) - 14 * bScale()); }
      if (W.lv.isDialA > 0.4) cand('日晷', X.dial * W.w, gY(2, X.dial) - 30 * LS(2));
      if (W.lv.isCamp > 0.4) for (const [l, xf] of TENTS) cand('亚述营', xf * W.w, gY(l, xf) - 8 * LS(l));
      if (W.lv.isRoad > 0.5 && W.lv.isRoadA * (1 - W.lv.isOld) > 0.25) for (const xf of [0.5, 0.65, 0.8, 0.95]) cand('圣路', xf * W.w, roadY(xf));
      if (W.lv.isOld < 0.5 && (W.lv.isField > 0.3 || S.furrow < X.field1 - 0.01)) cand('田地', (fieldX0() + X.field1) / 2 * W.w, gY(2, (fieldX0() + X.field1) / 2) + 20 * LS(2));
      if (W.lv.isStreams > 0.5) cand('旷野的河', 0.7 * W.w, gY(2, 0.7) + 0.35 * (W.h - gY(2, 0.7)));
      if (W.lv.isConst > 0.3 && W.night > 0.4) CONST.forEach((c, ci) => { const p = constCenter(ci); cand(c.name, p[0], p[1]); });
      return best;
    },
    sig() { return { plow: S.plow, furrow: Math.round(S.furrow * 1000) / 1000, clean: S.clean, leap: S.leap, beasts: S.beasts ? JSON.stringify(S.beasts) : null }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：乌西雅作王的年间，犹大的午后（1:1）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; S = fresh(); }
  function setup() {
    W.set('bare', 0.12, true); W.set('bloom', 0.45, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 0.9, herbs: 0.8, trees: 0.18, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.setOrigin('trees', W.w * TREE_X, W.ridgeBaseY(2, W.w * TREE_X));
    W.freeClock = false;
    W.goTo(0.64, 0, true);
    const lx = W.w * 0.6, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 16, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    avoid([0.5, 1.02]);
    const c = C();
    c.clear({ fade: false });
    add('isaiah', { label: '以赛亚', sex: 'm', age: 'adult', x: X.isaiah, facing: 1, robe: ROBE.isaiah, glow: 0.4, pose: 'stand', from: 'none', prop: 'staff', beard: true });
    crowd('folk', { n: 9, x0: 0.74, x1: 0.88, layer: 2, label: '百姓', from: 'none', mill: false, robe: CRIMSON[0] });
    tintFolk();
    crowdFace('folk', -1);
    crowd('arms', { n: 3, x0: 0.47, x1: 0.53, layer: 2, label: '拿刀的人', from: 'none', mill: false, prop: 'blade', robe: [118, 96, 78] });
    members('arms').forEach((m, i) => { if (i === 1) m.prop = 'spear'; });
    animal('ox', 'ox', X.ox, { facing: -1, pose: 'stand', from: 'none', label: '牛' });
    animal('ass', 'ass', X.ass, { facing: -1, pose: 'graze', from: 'none', label: '驴' });
  }

  // ════════════════════════════════════════════════════════════
  //  经文与话语（每句话的经文不过四行，它的故事约三十秒）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '当乌西雅、约坦、亚哈斯、<br>希西家作犹大王的时候，<br>亚摩斯的儿子以赛亚得默示，<br>论到犹大和耶路撒冷。', ref: '以赛亚书 1:1', hold: 6.5 },
    { text: '天哪，要听！地啊，侧耳而听！<br>因为耶和华说：我养育儿女，<br>将他们养大，他们竟悖逆我。', ref: '以赛亚书 1:2', hold: 6.5 },
  ];
  const V1 = [
    { text: '耶和华说：你们来，我们彼此辩论。<br>你们的罪虽像朱红，必变成雪白；<br>虽红如丹颜，必白如羊毛。', ref: '以赛亚书 1:18', hold: 8 },
    { text: '末后的日子，耶和华殿的山必坚立，<br>超乎诸山，高举过于万岭；<br>万民都要流归这山。', ref: '以赛亚书 2:2', hold: 7 },
    { text: '……他们要将刀打成犁头，<br>把枪打成镰刀。这国不举刀攻击那国；<br>他们也不再学习战事。', ref: '以赛亚书 2:4', hold: 7.5 },
  ];
  const V2 = [
    { text: '当乌西雅王崩的那年，<br>我见主坐在高高的宝座上。<br>他的衣裳垂下，遮满圣殿。', ref: '以赛亚书 6:1', hold: 7.5 },
    { text: '其上有撒拉弗侍立，各有六个翅膀：<br>用两个翅膀遮脸，两个翅膀遮脚，<br>两个翅膀飞翔；', ref: '以赛亚书 6:2', hold: 7 },
    { text: '彼此呼喊说：圣哉！圣哉！圣哉！<br>万军之耶和华；他的荣光充满全地！<br>因呼喊者的声音，门槛的根基震动，<br>殿充满了烟云。', ref: '以赛亚书 6:3–4', hold: 8 },
  ];
  const V3 = [
    { text: '那时我说：「祸哉！我灭亡了！<br>因为我是嘴唇不洁的人，<br>又住在嘴唇不洁的民中，<br>又因我眼见大君王万军之耶和华。」', ref: '以赛亚书 6:5', hold: 7 },
    { text: '有一撒拉弗飞到我跟前，手里拿着红炭，<br>是用火剪从坛上取下来的，', ref: '以赛亚书 6:6', hold: 5 },
    { text: '将炭沾我的口，说：「看哪，<br>这炭沾了你的嘴，你的罪孽便除掉，<br>你的罪恶就赦免了。」', ref: '以赛亚书 6:7', hold: 6.5 },
    { text: '我又听见主的声音说：<br>「我可以差遣谁呢？谁肯为我们去呢？」<br>我说：「我在这里，请差遣我！」', ref: '以赛亚书 6:8', hold: 6.5 },
  ];
  const V4 = [
    { text: '因此，主自己要给你们一个兆头，<br>必有童女怀孕生子，给他起名叫以马内利。', ref: '以赛亚书 7:14', hold: 7 },
    { text: '在黑暗中行走的百姓看见了大光；<br>住在死荫之地的人有光照耀他们。', ref: '以赛亚书 9:2', hold: 6.5 },
    { text: '因有一婴孩为我们而生；有一子赐给我们。<br>政权必担在他的肩头上；<br>他名称为「奇妙策士、全能的神、<br>永在的父、和平的君」。', ref: '以赛亚书 9:6', hold: 8 },
  ];
  const V5 = [
    { text: '从耶西的本必发一条；<br>从他根生的枝子必结果实。', ref: '以赛亚书 11:1', hold: 5.5 },
    { text: '豺狼必与绵羊羔同居，豹子与山羊羔同卧；<br>少壮狮子与牛犊并肥畜同群；<br>小孩子要牵引它们。', ref: '以赛亚书 11:6', hold: 8 },
    { text: '在我圣山的遍处，这一切都不伤人，不害物；<br>因为认识耶和华的知识要充满遍地，<br>好像水充满洋海一般。', ref: '以赛亚书 11:9', hold: 8 },
  ];
  const V6 = [
    { text: '看哪，耶和华使地空虚，变为荒凉；<br>又翻转大地，将居民分散。', ref: '以赛亚书 24:1', hold: 5.5 },
    { text: '对胆怯的人说：你们要刚强，不要惧怕。<br>看哪，你们的神必来……他必来拯救你们。', ref: '以赛亚书 35:4', hold: 6.5 },
    { text: '旷野和干旱之地必然欢喜；沙漠也必快乐；<br>又像玫瑰开花，必开花繁盛，<br>乐上加乐，而且欢呼。', ref: '以赛亚书 35:1–2', hold: 7 },
    { text: '那时，瘸子必跳跃像鹿；<br>哑巴的舌头必能歌唱。<br>在旷野必有水发出；在沙漠必有河涌流。', ref: '以赛亚书 35:6', hold: 7 },
  ];
  const V7 = [
    { text: '希西家王十四年，<br>亚述王西拿基立上来攻击犹大的一切坚固城，<br>将城攻取。', ref: '以赛亚书 36:1', hold: 6.5 },
    { text: '耶和华的使者出去，<br>在亚述营中杀了十八万五千人。', ref: '以赛亚书 37:36', hold: 5.5 },
    { text: '那时希西家病得要死……<br>耶和华你祖大卫的神如此说：<br>我听见了你的祷告，看见了你的眼泪。', ref: '以赛亚书 38:1–5', hold: 8 },
    { text: '于是，前进的日影<br>果然在日晷上往后退了十度。', ref: '以赛亚书 38:8', hold: 5.5 },
  ];
  const V8 = [
    { text: '你们的神说：你们要安慰，安慰我的百姓。<br>要对耶路撒冷说安慰的话……<br>她争战的日子已满了；她的罪孽赦免了……', ref: '以赛亚书 40:1–2', hold: 8 },
    { text: '有人声喊着说：在旷野预备耶和华的路，<br>在沙漠地修平我们神的道。<br>一切山洼都要填满，大小山冈都要削平……', ref: '以赛亚书 40:3–4', hold: 8 },
    { text: '草必枯干，花必凋残，<br>惟有我们神的话必永远立定。', ref: '以赛亚书 40:8', hold: 6 },
  ];
  const V9 = [
    { text: '你们向上举目，看谁创造这万象，<br>按数目领出，他一一称其名；<br>因他的权能，又因他的大能大力，<br>连一个都不缺。', ref: '以赛亚书 40:26', hold: 8 },
    { text: '疲乏的，他赐能力；软弱的，他加力量。', ref: '以赛亚书 40:29', hold: 5 },
    { text: '但那等候耶和华的必重新得力。<br>他们必如鹰展翅上腾；<br>他们奔跑却不困倦，行走却不疲乏。', ref: '以赛亚书 40:31', hold: 8 },
  ];
  const V10 = [
    { text: '以色列啊，造成你的那位，现在如此说：<br>你不要害怕！因为我救赎了你。<br>我曾提你的名召你，你是属我的。', ref: '以赛亚书 43:1', hold: 8 },
    { text: '你从水中经过，我必与你同在；<br>你趟过江河，水必不漫过你；<br>你从火中行过，必不被烧，<br>火焰也不着在你身上。', ref: '以赛亚书 43:2', hold: 8 },
    { text: '我涂抹了你的过犯，像厚云消散；<br>我涂抹了你的罪恶，如薄云灭没。<br>你当归向我，因我救赎了你。', ref: '以赛亚书 44:22', hold: 8 },
  ];
  const V11 = [
    { text: '他被藐视，被人厌弃；多受痛苦，常经忧患。', ref: '以赛亚书 53:3', hold: 5 },
    { text: '哪知他为我们的过犯受害，<br>为我们的罪孽压伤。<br>因他受的刑罚，我们得平安；<br>因他受的鞭伤，我们得医治。', ref: '以赛亚书 53:5', hold: 8 },
    { text: '我们都如羊走迷；各人偏行己路；<br>耶和华使我们众人的罪孽都归在他身上。', ref: '以赛亚书 53:6', hold: 6.5 },
    { text: '他必看见自己劳苦的功效，便心满意足。', ref: '以赛亚书 53:11', hold: 5 },
  ];
  const V12 = [
    { text: '雨雪从天而降，并不返回，却滋润地土，<br>使地上发芽结实，<br>使撒种的有种，使要吃的有粮。', ref: '以赛亚书 55:10', hold: 7.5 },
    { text: '我口所出的话也必如此，决不徒然返回，<br>却要成就我所喜悦的，<br>在我发他去成就的事上必然亨通。', ref: '以赛亚书 55:11', hold: 7.5 },
    { text: '你们必欢欢喜喜而出来，平平安安蒙引导。<br>大山小山必在你们面前发声歌唱；<br>田野的树木也都拍掌。', ref: '以赛亚书 55:12', hold: 8 },
  ];
  const V13 = [
    { text: '兴起，发光！因为你的光已经来到！<br>耶和华的荣耀发现照耀你。', ref: '以赛亚书 60:1', hold: 6 },
    { text: '看哪，黑暗遮盖大地，幽暗遮盖万民，<br>耶和华却要显现照耀你；<br>他的荣耀要现在你身上。', ref: '以赛亚书 60:2', hold: 7 },
    { text: '万国要来就你的光；<br>君王要来就你发现的光辉。', ref: '以赛亚书 60:3', hold: 6 },
  ];
  const V14 = [
    { text: '看哪！我造新天新地；<br>从前的事不再被记念，也不再追想。', ref: '以赛亚书 65:17', hold: 6.5 },
    { text: '豺狼必与羊羔同食；狮子必吃草与牛一样……<br>在我圣山的遍处，这一切都不伤人，不害物。<br>这是耶和华说的。', ref: '以赛亚书 65:25', hold: 8 },
    { text: '耶和华说：我所要造的新天新地，<br>怎样在我面前长存；<br>你们的后裔和你们的名字也必照样长存。', ref: '以赛亚书 66:22', hold: 7.5 },
  ];

  // 圣哉：一个「圣」字自撒拉弗之间的光中聚成——左边一对撒拉弗之间、右边一对之间、宝座之上
  function holy(b, i) {
    if (b.instant) return;
    const V = vis(), s = V.s, size = M() * (V.port ? 0.075 : 0.058);
    const spots = V.port ? [[-150, 50], [150, 50], [0, -130]] : [[-160, -24], [160, -24], [0, -136]];
    const q = spots[i], cx = clamp(V.tx + q[0] * s, size, W.w - size), cy = Math.max(V.ty + q[1] * s, 60 + size * 0.6);
    const a = seraphPos(i === 2 ? 0 : i, V), bpos = seraphPos(i === 2 ? 1 : i + 2, V);
    writeName('圣', cx, cy, size, [255, 238, 196], () => (Math.random() < 0.5 ? [a[0] + rand(-20, 20) * s, a[1] + rand(-30, 20) * s] : [bpos[0] + rand(-20, 20) * s, bpos[1] + rand(-30, 20) * s]), { hold: 2.6 });
    fx().ring(cx, cy, [255, 236, 196], M() * 0.25, 1.8, 1.6);
    chime('圣');
    sfx(b, 'angel', { soft: i < 2 });
  }
  // 奇妙策士、全能的神、永在的父、和平的君：写在大光的旁边（不在它的强光里），四个一齐停留
  function crowns(b) {
    if (b.instant) return;
    const port = tall(), size = M() * (port ? 0.052 : 0.042);
    const N = ['奇妙策士', '全能的神', '永在的父', '和平的君'];
    const P = port ? [[0.28, 0.35], [0.72, 0.35], [0.28, 0.42], [0.72, 0.42]] : [[0.52, 0.27], [0.67, 0.27], [0.52, 0.35], [0.67, 0.35]];
    const src = srcAround('mother', 40), L = bigLightXY(1);
    N.forEach((nm, i) => {
      const c = nameAt(P[i][0] * W.w, P[i][1] * W.h, size, 4);
      writeName(nm, c[0], c[1], size, [255, 232, 180], () => (Math.random() < 0.5 ? src() : [L[0] + rand(-40, 40), L[1] + rand(-30, 30)]), { delay: i * 0.9, hold: 7.7 - i * 0.9, dot: 1.9 });
    });
    chime('奇');
  }
  function sayLabels(b, ci) {
    if (b.instant) return;
    const c = CONST[ci], p = constCenter(ci), size = M() * 0.032;
    const at = nameAt(p[0], p[1] - (ci === 2 ? 0.04 : 0.075) * M(), size, 2);
    writeName(c.name, at[0], at[1], size, [255, 236, 200], () => [p[0] + rand(-30, 30), p[1] + rand(-20, 20)], { hold: 3.2, dot: 1.6 });
    chime(c.name);
  }

  const STAGES = [
    // ── 1 · 你们的罪虽像朱红，必变成雪白（1—5）────────────────────
    {
      kind: 'promise', utter: '你们的罪虽像朱红，必变成雪白', cmd: "sed -i 's/朱红/雪白/g' 心  # 虽红如丹颜，必白如羊毛", ref: '1:18',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.set('storm', 0.26, b.instant); W.set('clouds', 0.85, b.instant);
            W.goTo(0.7, 10, b.instant);
            W.set('isSnow', 1, b.instant);
            pose('isaiah', 'raise');
            crowdPose('folk', 'gaze');
            sfx(b, 'wind', { soft: true });
          }],
          [1.5, b => W.set('isCover', 1, b.instant)],
          [2.5, b => { W.set('isWhite', 1, b.instant); pose('isaiah', 'stand'); }],
          [6.5, b => {
            crowdPose('folk', 'raise');
            if (!b.instant) for (const m of members('folk')) { const p = memberPt(m, 0.6); fx().sparkle(p[0], p[1], 6, [255, 250, 240], 6, 'top'); }
          }],
          [9.2, () => crowdPose('folk', 'stand')],
          // 2:2 耶和华殿的山必坚立，高举过于万岭；万民都要流归这山
          [L[1], b => {
            W.set('isMount', 1, b.instant); W.set('isSnow', 0.4, b.instant);
            if (!b.instant) { const tg = templeGeom(); fx().ring(tg.x, tg.top, [255, 236, 196], M() * 0.35, 2.6, 2); }
            sfx(b, 'harp');
          }],
          [L[1] + 1.2, b => {
            crowdWalk('folk', 0.715, 0.795, { speed: 0.02 });     // 让出犁田的一条路（牛自 0.925 犁到 0.822）
            if (!hasCrowd('nations')) crowd('nations', { n: 8, x0: 0.5, x1: 0.58, layer: 1, label: '万民', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('nations', 0.6, 0.68, { speed: 0.012 });
          }],
          // 2:4 刀打成犁头
          [L[2], b => {
            if (!b.instant) for (const m of members('arms')) { const p = memberPt(m, 0.45); fx().sparkle(p[0] + 8 * SU(), p[1], 22, [255, 190, 110], 7, 'top'); }
            crowdProp('arms', null);
            crowdPose('arms', 'kneel');
            sfx(b, 'build');
          }],
          [L[2] + 2, b => {
            S.plow = 1; S.furrow = X.furrow;
            walk('ox', X.furrow - 0.03, { speed: 0.013 });
            add('plowman', { label: '扶犁的', sex: 'm', age: 'adult', x: X.ox + 0.036, facing: -1, robe: ROBE.plowman, glow: 0.15, from: b.instant ? 'none' : 'fade', prop: null });
            walk('plowman', X.furrow + 0.006, { speed: 0.013 });
            if (!b.instant) fx().sparkle(X.ox * W.w, gY(2, X.ox), 16, [255, 200, 130], 10, 'top');
          }],
          [L[2] + 3.4, () => { crowdPose('arms', 'stand'); crowdWalk('arms', 0.49, 0.56, { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 2 · 圣哉！圣哉！圣哉！（6:1–4）─────────────────────────
    {
      kind: 'act', utter: '圣哉！圣哉！圣哉！万军之耶和华', cmd: 'echo 圣哉 圣哉 圣哉 > 全地  # 荣光充满', ref: '6:3',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.set('isSnow', 0, b.instant); W.set('isCover', 0, b.instant);
            W.set('storm', 0, b.instant); W.set('clouds', 0.3, b.instant);
            W.goTo(0.86, 8, b.instant);
            crowdWalk('folk', 0.97, 1.08, { speed: 0.03 });
            crowdWalk('arms', 0.98, 1.08, { speed: 0.035 });
            crowdWalk('nations', 0.7, 0.72, { speed: 0.02 });
            if (S.plow) { S.furrow = X.furrow; S.plow = 0; }
            walk('ox', 1.08, { speed: 0.03 }); walk('ass', 1.1, { speed: 0.03 });
            walk('plowman', 1.1, { speed: 0.035 });
            walk('isaiah', X.isaiah, { speed: 0.02 });
            face('isaiah', 1);
            W.set('isThrone', 1, b.instant);
            avoid([0.5, 1.02]);
            sfx(b, 'angel');
          }],
          [2.2, b => { W.set('isTrain', 1, b.instant); pose('isaiah', 'gaze'); }],
          [5.5, () => { uncrowd('folk'); uncrowd('arms'); uncrowd('nations'); rm('ox'); rm('ass'); rm('plowman'); }],
          [L[1], b => { W.set('isSeraph', 1, b.instant); sfx(b, 'wings'); }],
          [L[2], b => holy(b, 0)],
          [L[2] + 1.3, b => holy(b, 1)],
          [L[2] + 2.6, b => holy(b, 2)],
          [L[2] + 3.4, b => W.set('isGlory', 1, b.instant)],
          [L[2] + 5, b => {
            W.set('isSmoke', 1, b.instant);
            if (!b.instant) { W.shake = 0.7; const tg = templeGeom(); fx().ring(tg.x, tg.base, [255, 230, 190], M() * 0.3, 1.6, 2); }
            sfx(b, 'thunder', { soft: true, far: true });
          }],
          [L[2] + 6.5, () => pose('isaiah', 'fall')],
        ]);
      },
    },

    // ── 3 · 我可以差遣谁呢？（6:5–8）──────────────────────────
    {
      kind: 'ask', utter: '我可以差遣谁呢？谁肯为我们去呢？', cmd: 'ping 以赛亚  # 我在这里，请差遣我！', ref: '6:8',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => { pose('isaiah', 'kneel', { weep: true }); W.set('isSmoke', 0.65, b.instant); sfx(b, 'weep', { soft: true }); }],
          // 6:6 一撒拉弗飞到坛前取红炭（飞行 9 秒：到坛前 3 秒，取炭，飞来，正在 6:7 那一行显出时沾他的口）
          [L[1] + 0.3, b => { fxPush(b, { type: 'coal', dur: 9 }); sfx(b, 'wings'); }],
          [L[1] + 3.3, b => sfx(b, 'fire', { soft: true })],
          // 6:7 炭沾了你的嘴
          [L[2], b => {
            S.clean = 1;
            glow('isaiah', 0.85);
            pose('isaiah', 'kneel', { weep: false });
            if (!b.instant) {
              W.flash = 0.3;
              const p = figPt('isaiah', 0.62);
              if (p) { fx().ring(p[0], p[1], [255, 200, 140], M() * 0.18, 1.4, 2); fx().sparkle(p[0], p[1], 30, [255, 214, 150], 6, 'top'); }
            }
          }],
          // 6:8 我在这里，请差遣我！
          [L[3] + 1, () => pose('isaiah', 'stand')],
          [L[3] + 3.2, b => {
            pose('isaiah', 'raise');
            if (!b.instant) { const p = figPt('isaiah', 0.9); if (p) fx().ring(p[0], p[1], [255, 236, 196], M() * 0.4, 2.6, 2); }
            sfx(b, 'harp');
          }],
          [L[3] + 5.4, b => {
            W.set('isSmoke', 0, b.instant); W.set('isGlory', 0, b.instant);
            W.set('isSeraph', 0, b.instant); W.set('isTrain', 0, b.instant); W.set('isThrone', 0, b.instant);
            W.goTo(0.19, 12, b.instant);
          }],
          [L[3] + 7, b => { pose('isaiah', 'stand'); glow('isaiah', 0.55); walk('isaiah', 0.56, { speed: 0.012 }); }],
        ]);
      },
    },

    // ── 4 · 因有一婴孩为我们而生（7—10）────────────────────────
    {
      kind: 'promise', utter: '因有一婴孩为我们而生；有一子赐给我们', cmd: 'spawn 婴孩 --name 奇妙策士,全能的神,永在的父,和平的君', ref: '9:6',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            // 异象已收起：宝座、衣裳、撒拉弗、烟云不留在夜空里
            for (const k of ['isThrone', 'isTrain', 'isSeraph', 'isGlory', 'isSmoke']) W.set(k, 0, true);
            W.set('gloom', 0.72, b.instant);
            add('mother', { label: '童女', sex: 'f', age: 'adult', x: X.mother, facing: -1, robe: ROBE.mother, glow: 0.6, carry: 'baby', from: b.instant ? 'none' : 'light', prop: null });
            if (!hasCrowd('folk')) crowd('folk', { n: 7, x0: 0.86, x1: 0.97, layer: 2, label: '百姓', from: b.instant ? 'none' : 'fade', mill: false, prop: 'torch' });
            tintFolk();
            crowdWalk('folk', 0.74, 0.88, { speed: 0.012 });
            face('isaiah', 1);
            avoid([0.5, 1.02]);
          }],
          [3.5, b => { nameOver(b, 'mother', '以马内利', [255, 236, 200], srcAround('mother', 50), { size: 0.042, hold: 3.2 }); }],
          // 9:2 在黑暗中行走的百姓看见了大光
          [L[1] + 1.2, b => {
            W.set('isLight', 1, b.instant); W.set('gloom', 0.1, b.instant);
            W.goTo(0.235, 8, b.instant);        // 黎明之前：天边微明，日头未出——大光是唯一的光
            sfx(b, 'harp');
          }],
          [L[1] + 3, () => { crowdPose('folk', 'gaze'); pose('isaiah', 'gaze'); }],
          // 9:6 他名称为……
          [L[2], b => { crowns(b); glow('mother', 0.95); beamOn(b, 'mother', { dur: 8, r: 0.25 }); pose('mother', 'gaze'); }],
          [L[2] + 3, () => { crowdPose('folk', 'kneel'); pose('isaiah', 'kneel'); }],
          [L[2] + 7.5, b => {
            W.set('gloom', 0, b.instant);
            crowdProp('folk', null);
            crowdPose('folk', 'stand'); pose('isaiah', 'stand'); pose('mother', 'stand');
          }],
        ]);
      },
    },

    // ── 5 · 在我圣山的遍处，这一切都不伤人，不害物（11—12）──────────
    {
      kind: 'bless', utter: '在我圣山的遍处，这一切都不伤人，不害物', cmd: 'peace --scope 圣山 --wolf=羊羔 --leopard=山羊羔 --lion=牛犊', ref: '11:9',
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.set('isLight', 0, b.instant);
            W.goTo(0.4, 6, b.instant);
            W.set('isShoot', 1, b.instant);
            walk('mother', 0.96, { speed: 0.02 });
            crowdWalk('folk', 0.46, 0.55, { speed: 0.03 });
            walk('isaiah', X.isaiah, { speed: 0.02 });
            if (!b.instant) { const x = X.stump * W.w, y = gY(2, X.stump) - 16 * LS(2); fx().sparkle(x, y, 26, [220, 255, 200], 8, 'top'); fx().ring(x, y, [230, 255, 214], M() * 0.2, 2, 1.5); }
            sfx(b, 'harp');
          }],
          [4, () => rm('mother')],
          // 11:6 豺狼与羊羔同居……小孩子要牵引它们
          [L[1], b => {
            S.beasts = { wolf: [X.wolf, 1, 'lie'], leopard: [X.leopard, 1, 'lie'], lion: [X.lion, -1, 'stand'] };
            W.set('isBeasts', 1, b.instant);
            animal('lamb', 'lamb', X.lamb, { facing: -1, pose: 'lie', from: b.instant ? 'none' : 'fade', label: '绵羊羔' });
            animal('kid', 'kid', X.kid, { facing: -1, pose: 'lie', from: b.instant ? 'none' : 'fade', label: '山羊羔' });
            animal('calf', 'calf', X.calf, { facing: -1, pose: 'graze', from: b.instant ? 'none' : 'fade', label: '牛犊' });
            avoid([0.44, 1.02]);
            if (!b.instant) for (const xf of [X.wolf, X.leopard, X.lion]) fx().sparkle(xf * W.w, gY(2, xf) - 12 * LS(2), 20, [255, 240, 210], 12, 'top');
            sfx(b, 'bleat', { soft: true });
          }],
          [L[1] + 1.6, b => {
            add('child', { label: '小孩子', sex: 'm', age: 'child', x: 0.97, facing: -1, robe: ROBE.child, glow: 0.45, from: b.instant ? 'none' : 'fade', prop: null });
            walk('child', X.child, { speed: 0.022 });
          }],
          [L[1] + 6.5, () => { face('child', 1); pose('child', 'point'); }],
          // 11:9 知识充满遍地，好像水充满洋海
          [L[2], b => {
            W.set('isSea', 1, b.instant);
            if (!b.instant) { fx().ring(W.w * 0.18, W.h * 0.78, [255, 236, 196], M() * 0.6, 3.6, 2.5); fx().ring(W.w * 0.7, gY(2, 0.7), [255, 236, 196], M() * 0.5, 3.2, 2); }
            pose('child', 'stand');
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 7, b => W.set('isSea', 0.35, b.instant)],
        ]);
      },
    },

    // ── 6 · 你们要刚强，不要惧怕（13—35）──────────────────────────
    {
      kind: 'cmd', utter: '你们要刚强，不要惧怕', cmd: 'water --desert && bloom --rose  # 瘸子跳跃像鹿', ref: '35:4',
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          // 24:1 耶和华使地空虚
          [0, b => {
            W.goTo(0.5, 6, b.instant);
            W.set('bare', 0.9, b.instant); W.set('grass', 0.22, b.instant); W.set('herbs', 0.12, b.instant); W.set('bloom', 0, b.instant);
            W.set('gale', 0.3, b.instant); W.set('isSea', 0, b.instant); W.set('isBeasts', 0, b.instant);
            rm('lamb'); rm('kid'); rm('calf'); rm('child');
            crowdWalk('folk', 1.05, 1.15, { speed: 0.075, run: true });   // 居民分散：往右边的远处去（不从崖上下海）
            sfx(b, 'wind');
          }],
          [3.5, b => {
            uncrowd('folk');
            if (!hasCrowd('weary')) crowd('weary', { n: 4, x0: 0.7, x1: 0.8, layer: 2, label: '胆怯的人', from: b.instant ? 'none' : 'fade', mill: false, pose: 'sit' });
            add('lame', { label: '瘸子', sex: 'm', age: 'adult', x: 0.665, facing: 1, robe: ROBE.lame, glow: 0.2, pose: 'sit', from: b.instant ? 'none' : 'fade', prop: 'staff' });
          }],
          // 35:4 你们要刚强，不要惧怕
          [L[1], b => { pose('isaiah', 'raise'); face('isaiah', 1); if (!b.instant) { const p = figPt('isaiah', 0.9); if (p) fx().ring(p[0], p[1], [255, 236, 196], M() * 0.35, 2.4, 2); } }],
          [L[1] + 2.6, () => { crowdPose('weary', 'stand'); crowdGlow('weary', 0.3); pose('isaiah', 'stand'); }],
          // 35:1–2 旷野和干旱之地必然欢喜
          [L[2], b => {
            W.set('isStreams', 1, b.instant);
            W.set('gale', 0, b.instant);
            W.set('bare', 0.04, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant); W.set('bloom', 1, b.instant);
            if (!b.instant) { fx().sparkle(0.97 * W.w, gY(2, 0.97) + 20, 40, [220, 240, 255], 10, 'top'); fx().ring(0.97 * W.w, gY(2, 0.97), [220, 240, 255], M() * 0.3, 2.4, 2); }
            sfx(b, 'splash');
          }],
          [L[2] + 3.5, b => { W.setPop('beast', 2, W.w * 0.42, W.ridgeBaseY(2, W.w * 0.42), b.instant); avoid([0.52, 1.02]); }],
          // 35:6 瘸子必跳跃像鹿
          [L[3], b => { pose('lame', 'stand'); hold('lame', null); glow('lame', 0.6); }],
          [L[3] + 1, () => { const f = fig('lame'); if (f) fly('lame', 0.685, (gY(2, 0.685) - 22 * LS(2) * 1.3) / W.h, { dur: 0.55 }); }],
          [L[3] + 1.55, () => fly('lame', 0.705, null, { dur: 0.45 })],
          [L[3] + 2.1, () => fly('lame', 0.725, (gY(2, 0.725) - 26 * LS(2) * 1.3) / W.h, { dur: 0.55 })],
          [L[3] + 2.65, b => { fly('lame', 0.745, null, { dur: 0.45 }); S.leap = 1; if (!b.instant) { const p = figPt('lame', 0.1); if (p) fx().dust(p[0], p[1], 14, [230, 210, 170], 8); } }],
          [L[3] + 3.4, () => pose('lame', 'raise')],
          [L[3] + 6, () => pose('lame', 'stand')],
        ]);
      },
    },

    // ── 7 · 我听见了你的祷告，看见了你的眼泪（36—39）─────────────────
    {
      kind: 'promise', utter: '我听见了你的祷告，看见了你的眼泪', cmd: 'undo 日影 --steps 10  # 加增十五年', ref: '38:5',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          // 36:1 亚述王上来：营火满野
          [0, b => {
            W.goTo(0.9, 7, b.instant);
            W.set('isStreams', 0, b.instant);
            W.set('isCamp', 1, b.instant); W.set('isCampOut', 0, b.instant);
            uncrowd('weary'); rm('lame');
            W.setPop('beast', 0); GS.book.resync();          // 35 章的鹿不留在亚述营里
            if (!hasCrowd('army')) crowd('army', { n: 6, x0: 0.43, x1: 0.56, layer: 2, label: '亚述军', from: b.instant ? 'none' : 'fade', mill: false, prop: 'blade', robe: [92, 60, 52] });
            if (!hasCrowd('armyM')) crowd('armyM', { n: 7, x0: 0.51, x1: 0.63, layer: 1, label: '亚述军', from: b.instant ? 'none' : 'fade', mill: false, prop: 'blade', robe: [92, 60, 52] });
            for (const gid of ['army', 'armyM']) members(gid).forEach((m, i) => { m.prop = i % 3 === 1 ? 'spear' : 'blade'; });
            crowdFace('army', 1); crowdFace('armyM', 1);
            add('hezekiah', { label: '希西家', sex: 'm', age: 'adult', x: X.hez, facing: 1, robe: ROBE.hez, accent: [226, 186, 104], glow: 0.35, pose: 'pray', from: b.instant ? 'none' : 'fade', prop: null, beard: true });
            walk('isaiah', 0.6, { speed: 0.02 });
            avoid([0.34, 1.02]);
            sfx(b, 'crowd', { far: true });
          }],
          // 37:36 耶和华的使者出去：营火一一熄灭
          [L[1], b => {
            fxPush(b, { type: 'angel', dur: 4.2 });
            W.set('isCampOut', 1, b.instant);
            sfx(b, 'angel', { soft: true });
          }],
          [L[1] + 2.4, () => { uncrowd('army'); uncrowd('armyM'); }],
          [L[1] + 4.6, b => W.goTo(0.29, 7, b.instant)],
          // 38:1–5 希西家病得要死……我听见了你的祷告
          [L[2], b => { W.set('isCamp', 0, b.instant); pose('hezekiah', 'lie', { weep: true }); }],
          [L[2] + 1.2, () => { walk('isaiah', 0.675, { speed: 0.02 }); face('isaiah', 1); }],
          [L[2] + 4.2, b => { glow('hezekiah', 0.75); beamOn(b, 'hezekiah', { dur: 6, r: 0.22 }); sfx(b, 'harp'); }],
          [L[2] + 6.2, () => pose('hezekiah', 'stand', { weep: false })],
          // 38:8 日影往后退了十度
          [L[2] + 5, b => { W.set('isDialA', 1, b.instant); W.goTo(0.45, 6, b.instant); }],
          [L[3], b => { W.set('isDial', 1, b.instant); face('hezekiah', 1); pose('hezekiah', 'gaze'); if (!b.instant) fx().ring(X.dial * W.w, gY(2, X.dial) - 36 * LS(2), [255, 236, 196], M() * 0.2, 2.4, 1.6); sfx(b, 'chime'); }],
          [L[3] + 4.2, () => { pose('hezekiah', 'pray'); }],
        ]);
      },
    },

    // ── 8 · 你们要安慰，安慰我的百姓（40:1–11）────────────────────
    {
      kind: 'bless', utter: '你们要安慰，安慰我的百姓', cmd: 'comfort 我的百姓 && pave 旷野  # 修平我们神的道', ref: '40:1',
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.set('isDialA', 0, b.instant);
            W.goTo(0.56, 10, b.instant);
            pose('hezekiah', 'stand'); walk('hezekiah', 1.08, { speed: 0.03 });
            if (!hasCrowd('folk')) crowd('folk', { n: 8, x0: 0.97, x1: 1.07, layer: 2, label: '百姓', from: b.instant ? 'none' : 'fade', mill: false });
            tintFolk();
            crowdWalk('folk', 0.72, 0.88, { speed: 0.028 });
            walk('isaiah', X.isaiah, { speed: 0.02 });
            pose('isaiah', 'raise');
            avoid([0.44, 1.02]);
            sfx(b, 'harp');
          }],
          [5.5, b => { rm('hezekiah'); crowdGlow('folk', 0.35); if (!b.instant) for (const m of members('folk')) { const p = memberPt(m, 0.6); fx().sparkle(p[0], p[1], 5, [255, 236, 200], 6, 'top'); } }],
          [6.5, () => pose('isaiah', 'stand')],
          // 40:3–4 在旷野预备耶和华的路
          [L[1], b => { W.set('isRoad', 1, b.instant); W.set('isRoadA', 1, b.instant); fxPush(b, { type: 'sweep', dur: 7.5 }); sfx(b, 'build', { soft: true }); }],
          // 百姓走上这条大道
          [L[1] + 4.5, b => { crowdDepth('folk', ROAD_V / 0.8, b.instant); crowdWalk('folk', 0.6, 0.8, { speed: 0.02 }); }],
          // 40:8 草必枯干，花必凋残，惟有神的话永远立定
          [L[2], b => {
            W.set('grass', 0.38, b.instant); W.set('herbs', 0.3, b.instant); W.set('bloom', 0.04, b.instant); W.set('bare', 0.5, b.instant);
            if (!b.instant) {
              const port = tall(), size = M() * (port ? 0.075 : 0.06), c2 = nameAt(W.w * (port ? 0.64 : 0.72), W.h * (port ? 0.42 : 0.33), size, 3);
              writeName('神的话', c2[0], c2[1], size, [255, 232, 180], srcGround(0.5, 0.98), { hold: 4.5, dot: 2 });
              chime('神');
            }
            sfx(b, 'wind', { soft: true });
          }],
        ]);
      },
    },

    // ── 9 · 你们向上举目，看谁创造这万象（40:12–31）─────────────────
    {
      kind: 'cmd', utter: '你们向上举目，看谁创造这万象', cmd: 'ls 万象 | while read 星; do name "$星"; done  # 连一个都不缺', ref: '40:26',
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.98, 7, b.instant);
            W.set('stars', 0, b.instant);
            crowdPose('folk', 'sit');
            pose('isaiah', 'gaze');
          }],
          [1.5, b => { W.set('isHost', 1, b.instant); sfx(b, 'stars'); }],
          [5, b => sfx(b, 'stars', { soft: true })],
          // 众星领出之后，最后是三个星座，一一称其名（40:26 那一行将尽之时）
          [7.4, b => { W.set('isConst', 1, b.instant); }],
          [7.6, b => sayLabels(b, 0)],
          [8.0, b => sayLabels(b, 1)],
          [8.4, b => { sayLabels(b, 2); W.set('stars', 1, b.instant); }],
          // 40:29 疲乏的，他赐能力
          [L[1] + 1, b => { crowdGlow('folk', 0.55); if (!b.instant) for (const m of members('folk')) { const p = memberPt(m, 0.4); fx().sparkle(p[0], p[1], 5, [255, 236, 200], 5, 'top'); } }],
          // 40:31 如鹰展翅上腾
          [L[2], b => { W.goTo(0.27, 8, b.instant); W.set('isEagles', 1, b.instant); crowdPose('folk', 'stand'); pose('isaiah', 'stand'); sfx(b, 'wings'); }],
          [L[2] + 2.5, () => { crowdWalk('folk', 0.6, 0.76, { speed: 0.05, run: true }); crowdGlow('folk', 0.35); }],
        ]);
      },
    },

    // ── 10 · 你不要害怕！因为我救赎了你（41—49）──────────────────
    {
      kind: 'call', utter: '你不要害怕！因为我救赎了你', cmd: 'chown 以色列:耶和华  # 你是属我的', ref: '43:1',
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.42, 6, b.instant);
            W.set('storm', 0.62, b.instant); W.set('clouds', 1, b.instant);
            W.set('isEagles', 0, b.instant); W.set('isConst', 0, b.instant);
            W.set('isRoadA', 0.35, b.instant);        // 大道渐成一道淡痕
            crowdWalk('folk', 0.43, 0.52, { speed: 0.03 });
            walk('isaiah', 0.54, { speed: 0.02 });
            avoid([0.36, 1.02]);
          }],
          [3.2, b => {
            const g = members('folk');
            if (!b.instant && g.length) {
              const p = memberPt(g[Math.floor(g.length / 2)], 1);
              const size = M() * 0.05, c2 = nameAt(Math.max(p[0], W.w * 0.52), p[1] - size * 1.6, size, 3);
              writeName('以色列', c2[0], c2[1], size, [255, 232, 186], () => { const m = g[Math.floor(Math.random() * g.length)], q = memberPt(m, 0.5); return [q[0] + rand(-8, 8), q[1] + rand(-10, 10)]; }, { hold: 3 });
              chime('以');
            }
            crowdGlow('folk', 0.5);
          }],
          // 43:2 你从水中经过……你从火中行过
          [L[1], b => { W.set('isRiver', 1, b.instant); W.set('isFire', 1, b.instant); sfx(b, 'splash'); }],
          [L[1] + 1.2, () => crowdWalk('folk', 0.8, 0.9, { speed: 0.03 })],
          [L[1] + 6, b => sfx(b, 'fire', { soft: true })],
          // 44:22 像厚云消散
          [L[2], b => {
            W.set('storm', 0, b.instant); W.set('clouds', 0.2, b.instant);
            W.set('isFire', 0, b.instant); W.set('isRiver', 0.3, b.instant);
            if (!b.instant) { const g = members('folk'); if (g.length) beam(b, g[0].nx + 0.04, 2, { dur: 7, w: 120, r: 0.35 }); }
            sfx(b, 'harp');
          }],
        ]);
      },
    },

    // ── 11 · 我的仆人……必被高举上升（50—54）──────────────────────
    {
      kind: 'promise', utter: '我的仆人行事必有智慧，必被高举上升', cmd: 'mv 我们众人的罪孽 仆人/  # 因他受的鞭伤，我们得医治', ref: '52:13',
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.71, 8, b.instant);
            W.set('isRiver', 0, b.instant);
            // 仆人独自站在一片空地上（离开本、坛与群羊）；我们（百姓）在右边远远站着，羊群在左边
            add('servant', { label: '仆人', sex: 'm', age: 'adult', x: X.servant, facing: -1, robe: ROBE.servant, glow: 0.3, from: b.instant ? 'none' : 'fade', prop: null });
            crowdDepth('folk', null, b.instant);
            crowdWalk('folk', 0.87, 0.97, { speed: 0.03 });
            if (!hasCrowd('flock')) herd('flock', { kind: 'sheep', n: 9, x0: 0.53, x1: 0.61, label: '羊', from: b.instant ? 'none' : 'fade', mill: false });
            walk('isaiah', 0.455, { speed: 0.02 });
            avoid([0.36, 1.02]);
          }],
          // 53:3 被藐视，被人厌弃
          [3, () => { crowdFace('folk', 1); crowdGlow('folk', 0.1); }],
          // 53:5 他为我们的过犯受害
          [L[1], b => { motes(b, ['folk'], 5); pose('servant', 'bow'); W.set('isBurden', 0.5, b.instant); sfx(b, 'weep', { soft: true }); }],
          [L[1] + 3, () => pose('servant', 'kneel')],
          [L[1] + 5.5, b => { crowdGlow('folk', 0.45); if (!b.instant) for (const m of members('folk')) { const p = memberPt(m, 0.5); fx().sparkle(p[0], p[1], 4, [255, 236, 200], 5, 'top'); } }],
          // 53:6 我们都如羊走迷
          [L[2], b => {
            // 各人偏行己路：羊各自散开（不下崖、不盖住以赛亚），却不从仆人身边（0.74 … 0.82）穿过
            crowdWalk('flock', 0.48, 0.72, { speed: 0.045 });
            const XS = [0.485, 0.66, 0.51, 0.715, 0.54, 0.6, 0.495, 0.69, 0.63];
            members('flock').forEach((m, i) => { const x = XS[i % XS.length]; if (b.instant || W.replaying) m.nx = x; else { m.tx = x; m.facing = x >= m.nx ? 1 : -1; } });
            motes(b, ['flock'], 4.5); sfx(b, 'bleat');
          }],
          [L[2] + 2.5, b => { W.set('isBurden', 1, b.instant); pose('servant', 'lie'); }],
          // 53:11 他必看见自己劳苦的功效，便心满意足
          [L[3], b => {
            W.set('isBurden', 0, b.instant);
            pose('servant', 'stand'); glow('servant', 1);
            beamOn(b, 'servant', { dur: 7, w: 90, r: 0.4 });
            crowdFace('folk', -1);
            crowdWalk('flock', 0.6, 0.72, { speed: 0.04 });
            sfx(b, 'harp');
          }],
          [L[3] + 2.5, () => pose('servant', 'raise')],
        ]);
      },
    },

    // ── 12 · 我口所出的话也必如此，决不徒然返回（55）─────────────────
    {
      kind: 'promise', utter: '我口所出的话也必如此，决不徒然返回', cmd: 'assert(话.return !== void 0)  // 必然亨通', ref: '55:11',
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            W.goTo(0.6, 6, b.instant);          // 雨雪降在白昼（云厚，不见星）；雨后才是金黄的黄昏
            W.set('rain', 0.7, b.instant); W.set('storm', 0.38, b.instant); W.set('clouds', 0.9, b.instant); W.set('isSnow', 0.3, b.instant);
            W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant); W.set('bloom', 0.6, b.instant); W.set('bare', 0, b.instant); W.set('trees', 0.24, b.instant);
            W.set('isField', 1, b.instant);
            pose('servant', 'stand'); walk('servant', 0.3, { speed: 0.02 });
            uncrowd('flock');
            add('sower', { label: '撒种的', sex: 'm', age: 'adult', x: 0.955, facing: -1, robe: ROBE.sower, glow: 0.2, from: b.instant ? 'none' : 'fade', prop: 'bundle' });
            walk('sower', 0.82, { speed: 0.012 });
            crowdWalk('folk', 0.52, 0.62, { speed: 0.03 });
            walk('isaiah', X.isaiah, { speed: 0.02 });
            avoid([0.44, 1.02]);
            sfx(b, 'rain');
          }],
          [2, b => { if (!b.instant) for (let i = 0; i < 6; i++) { const xf = 0.95 - i * 0.022; fx().sparkle(xf * W.w, gY(2, xf) + 16 * LS(2), 8, [236, 214, 160], 10, 'near'); } }],
          [7, () => rm('servant')],
          // 55:11 决不徒然返回
          [L[1], b => {
            W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('isSnow', 0, b.instant); W.set('clouds', 0.35, b.instant);
            W.goTo(0.715, 8, b.instant);
            W.set('isField', 2, b.instant);
            beam(b, 0.88, 2, { dur: 7, w: 160, r: 0.3 });
            sfx(b, 'harp');
          }],
          [L[1] + 3, () => pose('sower', 'stand')],
          // 55:12 大山小山发声歌唱，树木拍掌
          [L[2], b => {
            W.set('isHills', 1, b.instant);
            crowdWalk('folk', 0.6, 0.76, { speed: 0.03 });
            if (!b.instant) {
              for (const [xf, l] of [[0.62, 0], [0.82, 0], [0.95, 0], [0.56, 1]]) fx().ring(xf * W.w, gY(l, xf), [255, 230, 180], M() * 0.25, 2.8, 1.6);
            }
            sfx(b, 'angel', { soft: true });
          }],
          [L[2] + 2.5, b => { crowdPose('folk', 'raise'); clap(b); }],
          [L[2] + 4, b => clap(b)],
          [L[2] + 5.5, b => clap(b)],
          [L[2] + 7, b => { crowdPose('folk', 'stand'); W.set('isHills', 0.25, b.instant); }],
        ]);
      },
    },

    // ── 13 · 兴起，发光！（56—64）───────────────────────────────
    {
      kind: 'cmd', utter: '兴起，发光！因为你的光已经来到', cmd: 'light --on 锡安  # 万国要来就你的光', ref: '60:1',
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.set('gloom', 0.52, b.instant);
            W.set('isHills', 0, b.instant);
            W.goTo(0.93, 6, b.instant);
            rm('sower');
            crowdPose('folk', 'sit');
            avoid([0.3, 1.02]);
          }],
          [2.8, b => { W.set('isZion', 1, b.instant); sfx(b, 'harp'); }],
          [4, b => {
            crowdPose('folk', 'stand'); pose('isaiah', 'raise');
            crowdGlow('folk', 0.55);
            if (!b.instant) { const tg = templeGeom(); fx().ring(tg.x, tg.top, [255, 236, 196], M() * 0.5, 3, 2.4); }
          }],
          [6.5, () => { crowdPose('folk', 'raise'); pose('isaiah', 'stand'); }],
          // 耶和华却要显现照耀你：天将破晓（万国与君王在晨光中来到）
          [L[1] + 1, b => W.goTo(0.27, 12, b.instant)],
          [L[1] + 2, b => W.set('gloom', 0.36, b.instant)],
          // 60:3 万国要来就你的光；君王要来就你发现的光辉
          [L[2], b => {
            W.set('gloom', 0.12, b.instant);
            if (!hasCrowd('nations')) crowd('nations', { n: 7, x0: 0.33, x1: 0.4, layer: 2, label: '万国', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('nations', 0.44, 0.54, { speed: 0.02 });
            for (const [id, x, k] of [['cam1', 1.03, 'king1'], ['cam2', 1.07, 'king2'], ['cam3', 1.11, 'king3']]) {
              animal(id, 'camel', x, { facing: -1, pose: 'stand', from: b.instant ? 'none' : 'fade', label: '骆驼', pack: false });
              add(k, { label: '君王', sex: 'm', age: 'adult', x, facing: -1, robe: ROBE[k], accent: [236, 196, 108], glow: 0.75, from: b.instant ? 'none' : 'fade', prop: null });
              ride(k, id);
            }
            walk('cam1', 0.9, { speed: 0.045 }); walk('cam2', 0.86, { speed: 0.05 }); walk('cam3', 0.82, { speed: 0.055 });
            sfx(b, 'camel');
          }],
          // 百姓身上有了光（60:2「他的荣耀要现在你身上」）
          [L[2] + 4.5, b => {
            W.set('gloom', 0, b.instant);
            crowdGlow('folk', 0.7); crowdGlow('nations', 0.45);
            crowdPose('folk', 'stand');
            if (!b.instant) for (const gid of ['folk', 'nations']) for (const m of members(gid)) { const p = memberPt(m, 0.95); fx().sparkle(p[0], p[1], 6, [255, 226, 150], 5, 'top'); }
          }],
        ]);
      },
    },

    // ── 14 · 看哪！我造新天新地（65—66）─────────────────────────
    {
      kind: 'cmd', utter: '看哪！我造新天新地', cmd: 'git init 新天新地  # 从前的事不再被记念', ref: '65:17',
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            W.goTo(0.36, 6, b.instant);
            W.set('isNew', 1, b.instant);
            W.set('bloom', 1, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant); W.set('bare', 0, b.instant); W.set('trees', 0.24, b.instant);
            W.set('isShoot', 2, b.instant); W.set('isZion', 0.3, b.instant); W.set('gloom', 0, b.instant);
            // 从前的事不再被记念：大道、坛、田、槽渐渐隐去；骆驼与君王往远处去
            W.set('isOld', 1, b.instant); W.set('isRoadA', 0, b.instant);
            fxPush(b, { type: 'wave', dur: 5, x: c.x || W.w * 0.6 });
            if (!b.instant) fx().ring(c.x || W.w * 0.6, c.y || W.h * 0.5, [255, 244, 222], Math.hypot(W.w, W.h), 4.5, 3);
            crowdWalk('folk', 0.47, 0.56, { speed: 0.03 });
            crowdWalk('nations', 0.38, 0.46, { speed: 0.02 });
            walk('cam1', 1.12, { speed: 0.035 }); walk('cam2', 1.16, { speed: 0.035 }); walk('cam3', 1.2, { speed: 0.035 });
            sfx(b, 'harp');
          }],
          [2, b => { if (!b.instant) W.flash = 0.25; }],
          [6.5, () => { for (const id of ['king1', 'king2', 'king3', 'cam1', 'cam2', 'cam3']) rm(id); }],
          // 65:25 豺狼必与羊羔同食；狮子必吃草与牛一样
          [L[1], b => {
            // 一片干净的地上（0.68 … 0.86，靠前一些）：豺狼与羊羔同食，狮子与牛同吃草，小孩子在旁
            S.beasts = { wolf: [0.726, 1, 'feed', 0.4], lion: [0.8, 1, 'feed', 0.4] };
            W.set('isBeasts', 1, b.instant);
            animal('lamb', 'lamb', 0.757, { facing: -1, pose: 'graze', from: b.instant ? 'none' : 'fade', label: '羊羔', v: 0.4 });
            animal('ox', 'ox', 0.842, { facing: -1, pose: 'graze', from: b.instant ? 'none' : 'fade', label: '牛', v: 0.4 });
            add('child', { label: '小孩子', sex: 'f', age: 'child', x: 0.69, facing: 1, robe: ROBE.child, glow: 0.45, from: b.instant ? 'none' : 'fade', prop: null, v: 0.42 });
            if (!b.instant) for (const xf of [0.726, 0.8]) fx().sparkle(xf * W.w, beastY(xf, 0.4) - 14 * LS(2), 18, [255, 240, 210], 12, 'top');
            sfx(b, 'bleat', { soft: true });
          }],
          // 66:22 你们的后裔和你们的名字也必照样长存
          [L[2], b => {
            crowdGlow('folk', 0.6); crowdGlow('nations', 0.6);
            glow('isaiah', 0.7);
            W.set('isHills', 0.5, b.instant);
            if (!b.instant) { const tg = templeGeom(); fx().ring(tg.x, tg.top, [255, 240, 210], M() * 0.6, 3.4, 2); }
            pose('isaiah', 'raise');
          }],
          [L[2] + 4, () => pose('isaiah', 'stand')],
        ]);
      },
    },
  ];
  // 拍掌的树：树冠上一阵阵的光
  function clap(b) {
    if (b.instant) return;
    const L = GS.land && GS.land.treeSpots ? GS.land.treeSpots() : [];
    for (const t of L || []) { if (!t || t.grown < 0.3) continue; fx().sparkle(t.x, t.top + (t.y - t.top) * 0.3, 10, [255, 240, 190], Math.max(6, t.w * 0.3), t.layer === 2 ? 'near' : t.layer === 1 ? 'mid' : 'far'); }
    sfx(b, 'wings', { soft: true });
  }

  GS.book.act({
    id: ACT, book: '以赛亚书', books: [23], title: '以赛亚', sub: '以赛亚书 1 — 66', tint: [255, 236, 190], music: 'abraham',
    intro: INTRO,
    outro: 20,
    behold: {
      '以赛亚': { text: '我又听见主的声音说：「我可以差遣谁呢？谁肯为我们去呢？」我说：「我在这里，请差遣我！」', ref: '以赛亚书 6:8' },
      '圣殿': { text: '当乌西雅王崩的那年，我见主坐在高高的宝座上。他的衣裳垂下，遮满圣殿。', ref: '以赛亚书 6:1' },
      '耶路撒冷': { text: '兴起，发光！因为你的光已经来到！耶和华的荣耀发现照耀你。', ref: '以赛亚书 60:1' },
      '宝座': { text: '耶和华如此说：天是我的座位；地是我的脚凳。', ref: '以赛亚书 66:1' },
      '撒拉弗': { text: '彼此呼喊说：圣哉！圣哉！圣哉！万军之耶和华；他的荣光充满全地！', ref: '以赛亚书 6:3' },
      '坛': { text: '有一撒拉弗飞到我跟前，手里拿着红炭，是用火剪从坛上取下来的，', ref: '以赛亚书 6:6' },
      '耶西的本': { text: '从耶西的本必发一条；从他根生的枝子必结果实。', ref: '以赛亚书 11:1' },
      '枝子': { text: '耶和华的灵必住在他身上，就是使他有智慧和聪明的灵，谋略和能力的灵，知识和敬畏耶和华的灵。', ref: '以赛亚书 11:2' },
      '豺狼': { text: '豺狼必与羊羔同食；狮子必吃草与牛一样……', ref: '以赛亚书 65:25' },
      '豹子': { text: '豺狼必与绵羊羔同居，豹子与山羊羔同卧……', ref: '以赛亚书 11:6' },
      '少壮狮子': { text: '少壮狮子与牛犊并肥畜同群；小孩子要牵引它们。', ref: '以赛亚书 11:6' },
      '绵羊羔': { text: '豺狼必与绵羊羔同居……', ref: '以赛亚书 11:6' },
      '羊羔': { text: '他必像牧人牧养自己的羊群，用膀臂聚集羊羔抱在怀中，慢慢引导那乳养小羊的。', ref: '以赛亚书 40:11' },
      '山羊羔': { text: '……豹子与山羊羔同卧……', ref: '以赛亚书 11:6' },
      '牛犊': { text: '牛必与熊同食；牛犊必与小熊同卧；狮子必吃草，与牛一样。', ref: '以赛亚书 11:7' },
      '小孩子': { text: '吃奶的孩子必玩耍在虺蛇的洞口；断奶的婴儿必按手在毒蛇的穴上。', ref: '以赛亚书 11:8' },
      '牛': { text: '牛认识主人，驴认识主人的槽，以色列却不认识；我的民却不留意。', ref: '以赛亚书 1:3' },
      '驴': { text: '牛认识主人，驴认识主人的槽……', ref: '以赛亚书 1:3' },
      '童女': { text: '因此，主自己要给你们一个兆头，必有童女怀孕生子，给他起名叫以马内利。', ref: '以赛亚书 7:14' },
      '百姓': { text: '在黑暗中行走的百姓看见了大光；住在死荫之地的人有光照耀他们。', ref: '以赛亚书 9:2' },
      '万民': { text: '末后的日子，耶和华殿的山必坚立，超乎诸山，高举过于万岭；万民都要流归这山。', ref: '以赛亚书 2:2' },
      '万国': { text: '万国要来就你的光；君王要来就你发现的光辉。', ref: '以赛亚书 60:3' },
      '君王': { text: '成群的骆驼，并米甸和以法的独峰驼必遮满你；示巴的众人都必来到；要奉上黄金乳香，又要传说耶和华的赞美。', ref: '以赛亚书 60:6' },
      '骆驼': { text: '成群的骆驼，并米甸和以法的独峰驼必遮满你……', ref: '以赛亚书 60:6' },
      '拿刀的人': { text: '他们要将刀打成犁头，把枪打成镰刀。', ref: '以赛亚书 2:4' },
      '扶犁的': { text: '他们要将刀打成犁头，把枪打成镰刀。', ref: '以赛亚书 2:4' },
      '胆怯的人': { text: '你们要使软弱的手坚壮，无力的膝稳固。', ref: '以赛亚书 35:3' },
      '瘸子': { text: '那时，瘸子必跳跃像鹿；哑巴的舌头必能歌唱。', ref: '以赛亚书 35:6' },
      '旷野的河': { text: '在旷野必有水发出；在沙漠必有河涌流。', ref: '以赛亚书 35:6' },
      '希西家': { text: '「……我听见了你的祷告，看见了你的眼泪。我必加增你十五年的寿数；」', ref: '以赛亚书 38:5' },
      '亚述军': { text: '希西家王十四年，亚述王西拿基立上来攻击犹大的一切坚固城，将城攻取。', ref: '以赛亚书 36:1' },
      '亚述营': { text: '耶和华的使者出去，在亚述营中杀了十八万五千人。', ref: '以赛亚书 37:36' },
      '日晷': { text: '于是，前进的日影果然在日晷上往后退了十度。', ref: '以赛亚书 38:8' },
      '圣路': { text: '在那里必有一条大道，称为圣路。污秽人不得经过，必专为赎民行走；行路的人虽愚昧，也不致失迷。', ref: '以赛亚书 35:8' },
      '北斗': { text: '你们向上举目，看谁创造这万象，按数目领出，他一一称其名……', ref: '以赛亚书 40:26' },
      '参星': { text: '……因他的权能，又因他的大能大力，连一个都不缺。', ref: '以赛亚书 40:26' },
      '昴星': { text: '你们将谁比我，叫他与我相等呢？', ref: '以赛亚书 40:25' },
      '仆人': { text: '哪知他为我们的过犯受害，为我们的罪孽压伤。因他受的刑罚，我们得平安；因他受的鞭伤，我们得医治。', ref: '以赛亚书 53:5' },
      '羊': { text: '我们都如羊走迷；各人偏行己路；耶和华使我们众人的罪孽都归在他身上。', ref: '以赛亚书 53:6' },
      '撒种的': { text: '雨雪从天而降，并不返回，却滋润地土，使地上发芽结实，使撒种的有种，使要吃的有粮。', ref: '以赛亚书 55:10' },
      '田地': { text: '你们必欢欢喜喜而出来，平平安安蒙引导。大山小山必在你们面前发声歌唱；田野的树木也都拍掌。', ref: '以赛亚书 55:12' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._isaiah = { get S() { return S; }, X, vis, templeGeom, FXL };
})(window.GS);
