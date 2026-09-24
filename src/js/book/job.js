/* ─────────────────────────────────────────────────────────────
 * book/job.js —— 约伯记 · 约伯（约伯记 1 — 42）
 *
 * 序幕（1–2）：乌斯地的清晨——约伯的家、长子家里的筵宴、坛上的燔祭，山上的羊、牛、驴、骆驼。
 *   「你曾用心察看我的仆人约伯没有？」——天上一圈光之会（神的众子；正中只是光，不画神的形像），
 *   其中一个冷而暗的影（撒但）；一道光落在约伯身上；金色的篱笆四面圈上，围护他的家和一切所有的。
 *   「凡他所有的都在你手中」——影落到地上，篱笆收拢，只围着约伯一人；四个报信的一个接一个跑来：
 *   牛驴被掳（尘土滚滚而去），神的火从天降在羊群上（山上只剩余烬），骆驼被掳（三股尘土），
 *   狂风从旷野刮来，击打房屋的四角——长子的房屋倒塌，灯灭，筵宴的人都不见了（只以尘土、光与缺席讲述）。
 *   「赏赐的是耶和华，收取的也是耶和华」——约伯撕裂外袍，剃了头，伏在地上下拜；
 *   夜里光之会再现；影落在约伯身上：他的衣袍成了灰色，他走到城外的炉灰中坐下；大地枯黄；妻子的话。
 *   「难道我们从神手里得福，不也受祸吗？」——三个朋友远远走来、放声大哭、把尘土扬向天，
 *   同他坐在地上七天七夜（天光七次明暗；灰里一粒一粒摆下七块小石）。
 * 辩论（3–37）：咒诅生日；火星飞腾（5:7）；树墩发芽（14:7）；「我知道我的救赎主活着」——字以光镌刻在磐石上，
 *   远地上立起一道光；精金的光边（23:10）；地中的金银与蓝宝石闪烁（28）；以利户持火把而来（32）；
 *   云聚、雷声、北方的金光（37:22）。
 * 耶和华的言语（38–41，本卷的签名之景）：旋风自天垂下，雷电在其中——「我立大地根基的时候，你在哪里呢？」
 *   大地的轮廓以准绳之光一层层量过，角石在旋风脚下发光；晨星一颗接一颗唱起来，神的众子欢呼；
 *   海水冲出，云彩当衣服、幽暗当包裹它的布，海岸划出一道光的界限，狂傲的浪到此止住；晨光掠过全地；
 *   夜里昴星被一条光索系住，参星的带解开，北斗领着众星转动，闪电说「我们在这里」；
 *   黎明的野山羊、母鹿、野驴、马与狮子；大鹰盘旋上腾，落在山岩顶上的窝里；
 *   河马自芦苇与水洼中起来，河水涨到它口边也安然；鳄鱼自远海游来，行过的路随后发光如白发，
 *   它起来，打喷嚏就发出光来，眼睛好像早晨的光线。「我从前风闻有你，现在亲眼看见你」——旋风收去。
 * 尾声（42）：朋友的燔祭、约伯为他们祈祷；金光遍地，房屋重新建起，羊、骆驼、牛、驴加倍，
 *   又有七个儿子、三个女儿；黄昏里儿孙四代围着年纪老迈的约伯。
 *
 * 画面的方位（近地，画面宽度的比例）：树墩 · 琐法 · 约伯与炉灰 · 以利法 · 比勒达 · 磐石 · 长子的房屋 · 坛 · 约伯的房屋；
 *   中景的山上是羊、牛、驴与骆驼；右边的中景立着一座高高的山岩；左边是海（鳄鱼），中景小岛的岸边是芦苇与水洼（河马）。
 * 规矩：本卷的一切状态只在 setup / apply / 情节（beats）里设定——瞬间重演时得到同样的世界；
 *       布景只在本卷进行时绘制；一切位置以画面比例记下。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'job';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('ybCouncil', 'exp', 0.5);   // 神的众子来侍立在耶和华面前（1:6，2:1）：天上的一圈光
  W.defineLevel('ybRegard', 'exp', 0.55);   // 「你曾用心察看我的仆人约伯没有？」：落在约伯身上的一道光
  W.defineLevel('ybHedge', 'exp', 0.4);     // 四面圈上篱笆围护他（1:10）
  W.defineLevel('ybGuard', 'exp', 0.5);     // 只是不可伸手加害于他（1:12）：只围着约伯一人的光圈
  W.defineLevel('ybEmbers', 'exp', 0.3);    // 神从天上降下火来（1:16）：山上的余烬
  W.defineLevel('ybFall', 'lin', 0.7);      // 长子的房屋倒塌（1:19）
  W.defineLevel('ybBuild', 'lin', 0.14);    // 房屋重新建起（42）
  W.defineLevel('ybFeast', 'exp', 0.8);     // 长子家里的筵宴（灯）
  W.defineLevel('ybAltar', 'exp', 0.8);     // 坛上的火（1:5，42:8）
  W.defineLevel('ybAsh', 'exp', 0.5);      // 炉灰中飘起的灰（2:8）
  W.defineLevel('ybFire', 'exp', 0.7);      // 朋友们夜里的一堆火（5:7 火星飞腾）
  W.defineLevel('ybSparks', 'exp', 0.6);    // 火星飞腾（5:7）
  W.defineLevel('ybSprout', 'lin', 0.16);   // 树若被砍下，还可指望发芽（14:7）
  W.defineLevel('ybCarve', 'lin', 0.2);     // 用铁笔镌刻，用铅灌在磐石上（19:24）
  W.defineLevel('ybStand', 'exp', 0.35);    // 末了必站立在地上（19:25）
  W.defineLevel('ybGold', 'exp', 0.5);      // 他试炼我之后，我必如精金（23:10）
  W.defineLevel('ybVeins', 'exp', 0.5);     // 地中的金、银、蓝宝石（28）
  W.defineLevel('ybNorth', 'exp', 0.3);     // 金光出于北方（37:22）
  W.defineLevel('ybWhirl', 'exp', 0.32);    // 旋风（38:1，40:6）
  W.defineLevel('ybFound', 'exp', 0.45);    // 地的根基、准绳、角石（38:4–6）
  W.defineLevel('ybMorning', 'lin', 0.16);  // 晨星一同歌唱（38:7）
  W.defineLevel('ybJoy', 'exp', 0.5);       // 神的众子也都欢呼（38:7）
  W.defineLevel('ybSurge', 'exp', 0.55);    // 海水冲出，如出胎胞（38:8）
  W.defineLevel('ybSwaddle', 'exp', 0.4);   // 用云彩当海的衣服，用幽暗当包裹它的布（38:9）
  W.defineLevel('ybBound', 'lin', 0.22);    // 为它定界限，又安门和闩（38:10–11）
  W.defineLevel('ybCons', 'exp', 0.45);     // 昴星、参星、北斗（38:31–32）
  W.defineLevel('ybKnot', 'lin', 0.22);     // 系住昴星的结
  W.defineLevel('ybBelt', 'lin', 0.2);      // 解开参星的带
  W.defineLevel('ybWheel', 'lin', 0.07);    // 引导北斗和随它的众星
  W.defineLevel('ybIbex', 'lin', 0.3);      // 山岩间的野山羊（39:1）：立在山岩的石阶上
  W.defineLevel('ybEagle', 'lin', 0.1);     // 大鹰上腾在高处搭窝（39:27）：0 → 1 飞到山岩的窝
  W.defineLevel('ybBehe', 'lin', 0.13);     // 河马自芦苇与水洼中起来（40:15–21）
  W.defineLevel('ybFlood', 'exp', 0.35);    // 河水氾滥，涨到它口边（40:23）
  W.defineLevel('ybLevi', 'lin', 0.06);     // 鳄鱼（41）：自远海游来，起来，歇在水上
  W.defineLevel('ybLeviA', 'exp', 0.45);    // 鳄鱼与它身后发光的路
  W.defineLevel('ybSeen', 'exp', 0.4);      // 现在亲眼看见你（42:5）
  W.defineLevel('ybBless', 'exp', 0.3);     // 耶和华后来赐福给约伯比先前更多（42:12）

  // ── 地上的位置（画面宽度的比例）───────────────────────────────
  const X = {
    stump: 0.545, zophar: 0.583, job: 0.622, eliphaz: 0.66, bildad: 0.692, rock: 0.728, elihu: 0.774,
    son: 0.792, altar: 0.853, house: 0.928, fire: 0.642, open: 0.665,
    whirl: 0.8, crag: 0.962, behe: 0.53,
  };
  const ROBE = {
    job: [96, 80, 138], jobTorn: [104, 94, 86], jobAsh: [124, 120, 114], jobNew: [216, 198, 152],
    wife: [150, 100, 96], eliphaz: [120, 96, 72], bildad: [84, 96, 120], zophar: [128, 84, 70], elihu: [150, 124, 84],
    msg: [150, 132, 104],
  };
  const KIDS = [[118, 92, 70], [150, 104, 96], [96, 104, 128], [140, 112, 80], [170, 120, 110], [110, 96, 84], [132, 100, 128], [176, 136, 104], [104, 88, 76], [158, 110, 120]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { acc: 1, nights: 0, torch: 0, restored: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const narrowK = () => (W.w < 600 ? 1.4 : 1);
  const LS = l => W.layerScale(l) * narrowK() * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const port = () => W.w < W.h * 0.9;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const c01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const sstep = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const eio = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function dress(id, o) { if (has(id)) C().add(id, o); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (has(id)) C().walk(id, x, Object.assign({ run: true }, o)); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return;
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    if (has(id)) c.remove(id, { fade: false });
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 1, from: W.replaying ? 'none' : 'fade' }, o || {})));
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      m.facing = d;
      if (W.replaying) m.fd = d;
    }
  }
  // 人物身上的一点（像素）：k 0 = 脚，1 = 头顶
  function at(id, k) {
    const f = fig(id);
    if (!f) return [W.w * X.job, gY(2, X.job) - 30 * LS(2)];
    const l = f.layer == null ? 2 : f.layer;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (k == null ? 1 : k)];
    return [f.nx * W.w, gY(l, f.nx) - 34 * LS(l) * (k == null ? 1 : k)];
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  const lv = (name, v, b) => W.set(name, v, !!(b && b.instant));
  function bolt(b, xf, near) { if (b.instant || !GS.weather || !GS.weather.bolt) return; U.safe('bolt', () => GS.weather.bolt({ x: xf, near: !!near })); }

  // 转瞬的光（不属于世界的状态；重演时不放）
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  预渲染的光与烟
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
  function beamSprite(rgb) {
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], 0)); hz.addColorStop(0.5, U.rgba(rgb[0], rgb[1], rgb[2], 1)); hz.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.25, 'rgba(0,0,0,0.8)'); vt.addColorStop(0.8, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return b;
  }
  // 一团云（遮盖海的"衣服"与旋风顶上的乌云）
  function cloudBank(seed, n, dark, lit) {
    const cw = 512, ch = 200, c = cnv(cw, ch), g = c.getContext('2d'), r = U.mulberry32(seed);
    for (let k = 0; k < n; k++) {
      const x = cw * (0.06 + 0.88 * r()), y = ch * (0.3 + 0.55 * Math.pow(r(), 0.8));
      const rad = (0.06 + 0.1 * r()) * cw * (0.5 + 0.8 * (1 - Math.abs(x / cw - 0.5)));
      const litb = r() < 0.4;
      const col = litb ? lit : dark;
      const gr = g.createRadialGradient(x, y - (litb ? rad * 0.3 : 0), 0, x, y, rad);
      gr.addColorStop(0, U.rgba(col[0], col[1], col[2], litb ? 0.32 : 0.55));
      gr.addColorStop(0.5, U.rgba(col[0], col[1], col[2], litb ? 0.16 : 0.34));
      gr.addColorStop(1, U.rgba(col[0], col[1], col[2], 0));
      g.fillStyle = gr;
      g.save(); g.translate(x, y); g.scale(1, 0.55); g.translate(-x, -y);
      g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
      g.restore();
    }
    // 四边柔和地淡去
    g.globalCompositeOperation = 'destination-in';
    const fh = g.createLinearGradient(0, 0, cw, 0);
    fh.addColorStop(0, 'rgba(0,0,0,0)'); fh.addColorStop(0.15, 'rgba(0,0,0,1)'); fh.addColorStop(0.85, 'rgba(0,0,0,1)'); fh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = fh; g.fillRect(0, 0, cw, ch);
    const fv = g.createLinearGradient(0, 0, 0, ch);
    fv.addColorStop(0, 'rgba(0,0,0,0)'); fv.addColorStop(0.25, 'rgba(0,0,0,1)'); fv.addColorStop(0.8, 'rgba(0,0,0,1)'); fv.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = fv; g.fillRect(0, 0, cw, ch);
    g.globalCompositeOperation = 'source-over';
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([236, 242, 255], 1), pale: radial([255, 250, 236], 1, 0.2),
      ember: radial([255, 92, 36], 1), smoke: radial([132, 124, 118], 0.8, 0.55), soot: radial([34, 28, 34], 0.85, 0.55),
      cold: radial([120, 108, 150], 0.9, 0.5), green: radial([170, 236, 150], 1), blue: radial([150, 190, 255], 1),
      dust: radial([196, 170, 132], 0.7, 0.5), grey: radial([170, 166, 160], 0.7, 0.5), dustDk: radial([128, 106, 84], 0.9, 0.6),
      beam: beamSprite([255, 247, 226]), beamGold: beamSprite([255, 214, 140]),
      cDark: radial([34, 36, 50], 0.95, 0.55), cMid: radial([104, 108, 124], 0.9, 0.55), cLit: radial([214, 210, 202], 0.85, 0.5),
    };
    SP.bank = cloudBank(3311, 60, [18, 20, 34], [176, 166, 190]);
    SP.bank2 = cloudBank(907, 46, [26, 26, 40], [190, 176, 170]);
    return SP;
  }
  function glowAt(ctx, spr, x, y, r, a) {
    if (a < 0.004 || !(r > 0.5)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
  }
  // 自 (x0,y0) 到 (x1,y1) 的一道光
  function beamLine(ctx, spr, x0, y0, x1, y1, w, a) {
    if (a < 0.004) return;
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    if (L < 2) return;
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(Math.atan2(dy, dx) - Math.PI / 2);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(spr, -w / 2, 0, w, L);
    ctx.restore();
  }

  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.3, k * (0.3 + 0.45 * nightK()));
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
  // 烟柱：程序化的烟团（按时间确定，无粒子）
  function smoke(ctx, x, y, k, H, w, seed, dark, rate) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 12, day = 0.3 + 0.7 * W.daylight;
    const spr = dark ? SP.soot : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3 + W.lv.gale * 1.5) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.55 : 0.42 * day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：房屋、坛、炉灰、磐石、树墩、山岩
  // ════════════════════════════════════════════════════════════
  // 石屋：平顶、女儿墙、梁头、门与窗；fall 0..1 倒塌（只以墙的坍落与尘土讲述）
  function drawHouse(ctx, xf, w0, h0, o) {
    const l = 2, s = LS(l), x = xf * W.w, y = gY(l, xf) + 3 * s, w = w0 * s, h = h0 * s;
    const fall = c01(o.fall || 0), seed = o.seed || 1;
    const d = litX() >= x ? 1 : -1;
    const stone = [186, 166, 136], side = [132, 116, 96], dark = [26, 20, 18];
    const N = 9, tops = [];
    for (let i = 0; i <= N; i++) {
      const ruin = h * (0.12 + 0.34 * hsh(seed * 13 + i * 3.7)) * (i === 0 || i === N ? 0.7 : 1);
      tops.push(lerp(h, ruin, eio(fall)));
    }
    const lean = fall * 0.08 * w;
    // 背光的一侧：一点厚度
    const dep = 0.14 * w;
    ctx.fillStyle = css(side, l);
    ctx.beginPath();
    const sx = x - d * w / 2;
    ctx.moveTo(sx, y); ctx.lineTo(sx, y - (d > 0 ? tops[0] : tops[N]));
    ctx.lineTo(sx - d * dep, y - (d > 0 ? tops[0] : tops[N]) * 0.96 - dep * 0.25);
    ctx.lineTo(sx - d * dep, y - dep * 0.2);
    ctx.closePath(); ctx.fill();
    // 墙
    ctx.fillStyle = css(stone, l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    for (let i = 0; i <= N; i++) {
      const u = i / N, xx = x - w / 2 + u * w + lean * (u - 0.5) * (tops[i] / h);
      ctx.lineTo(xx, y - tops[i]);
      if (fall > 0.02 && i < N) ctx.lineTo(xx + w / N * 0.5, y - tops[i] + fall * 3 * s * (hsh(i + seed) - 0.3));
    }
    ctx.lineTo(x + w / 2, y);
    ctx.closePath(); ctx.fill();
    // 石缝的横纹
    ctx.strokeStyle = css([150, 132, 106], l, 0.35); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let r = 1; r < 5; r++) {
      const yy = y - h * r / 5;
      for (let i = 0; i < N; i++) if (tops[i] > h * r / 5 && tops[i + 1] > h * r / 5) { const x0 = x - w / 2 + i * w / N; ctx.moveTo(x0, yy); ctx.lineTo(x0 + w / N, yy); }
    }
    ctx.stroke();
    // 屋顶只在墙大致立齐时出现；门与窗更早显出（重建时不至于久久是一块空墙）
    const whole = 1 - sstep(0, 0.25, fall), doorK = 1 - sstep(0.1, 0.6, fall), winK = 1 - sstep(0.08, 0.4, fall);
    const dw = 0.16 * w, dh = 0.5 * h, dx = x - d * w * 0.12;
    const wins = [[x + d * w * 0.24, y - h * 0.66], [x - d * w * 0.34, y - h * 0.7]];
    const lamp = clamp(nightK() * 1.05 + (o.lamp || 0) * 0.7, 0, 1) * (o.lit == null ? 1 : o.lit);
    if (doorK > 0.01 && whole <= 0.01) {
      ctx.fillStyle = css(dark, l);
      ctx.globalAlpha = doorK;
      ctx.beginPath(); ctx.moveTo(dx - dw / 2, y); ctx.lineTo(dx - dw / 2, y - dh + dw / 2); ctx.arc(dx, y - dh + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw / 2, y); ctx.closePath(); ctx.fill();
      if (winK > 0.01) { ctx.globalAlpha = winK; for (const q of wins) ctx.fillRect(q[0] - 0.045 * w, q[1] - 0.07 * h, 0.09 * w, 0.14 * h); }
      ctx.globalAlpha = 1;
    }
    if (whole > 0.01) {
      ctx.globalAlpha = whole;
      // 平顶与梁头
      ctx.fillStyle = css([112, 92, 72], l);
      ctx.fillRect(x - w * 0.53, y - h - 0.07 * h, w * 1.06, 0.08 * h);
      ctx.fillStyle = css([70, 54, 42], l);
      for (let i = 0; i < 7; i++) ctx.fillRect(x - w * 0.46 + i * w * 0.153, y - h + 0.01 * h, 0.035 * w, 0.045 * h);
      // 女儿墙
      ctx.fillStyle = css(stone, l);
      ctx.fillRect(x - w * 0.5, y - h - 0.16 * h, w, 0.09 * h);
      if (o.upper) {       // 屋顶上的一间楼房
        const uw = w * 0.36, uh = h * 0.42, ux = x + d * w * 0.16;
        ctx.fillStyle = css(mix(stone, side, 0.25), l);
        ctx.fillRect(ux - uw / 2, y - h - 0.16 * h - uh, uw, uh);
        ctx.fillStyle = css([112, 92, 72], l);
        ctx.fillRect(ux - uw * 0.56, y - h - 0.16 * h - uh - 0.06 * h, uw * 1.12, 0.07 * h);
        ctx.fillStyle = css(dark, l);
        ctx.fillRect(ux - uw * 0.12, y - h - 0.16 * h - uh * 0.72, uw * 0.24, uh * 0.4);
      }
      // 门与窗
      ctx.fillStyle = css(dark, l);
      ctx.beginPath(); ctx.moveTo(dx - dw / 2, y); ctx.lineTo(dx - dw / 2, y - dh + dw / 2); ctx.arc(dx, y - dh + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw / 2, y); ctx.closePath(); ctx.fill();
      for (const q of wins) ctx.fillRect(q[0] - 0.045 * w, q[1] - 0.07 * h, 0.09 * w, 0.14 * h);
      // 灯光（夜里，或筵宴时）
      if (lamp > 0.02) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        const fl = 0.86 + 0.14 * Math.sin(W.t * 6 + seed);
        ctx.globalAlpha = whole * lamp * fl * 0.7;
        ctx.fillStyle = 'rgb(255,178,96)';
        for (const q of wins) ctx.fillRect(q[0] - 0.045 * w, q[1] - 0.07 * h, 0.09 * w, 0.14 * h);
        ctx.beginPath(); ctx.moveTo(dx - dw / 2, y); ctx.lineTo(dx - dw / 2, y - dh + dw / 2); ctx.arc(dx, y - dh + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw / 2, y); ctx.closePath(); ctx.fill();
        glowAt(ctx, SP.warm, dx, y - dh * 0.4, w * 0.5, whole * lamp * fl * 0.5);
        for (const q of wins) glowAt(ctx, SP.warm, q[0], q[1], w * 0.2, whole * lamp * fl * 0.45);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
    // 迎光的边
    ctx.strokeStyle = css([255, 236, 204], l, 0.45 * (0.3 + 0.7 * W.daylight), 0.25); ctx.lineWidth = Math.max(0.7, 1.1 * s);
    ctx.beginPath();
    const ex = x + d * w / 2;
    ctx.moveTo(ex, y); ctx.lineTo(ex, y - (d > 0 ? tops[N] : tops[0]) - (whole > 0.5 ? 0.16 * h : 0));
    ctx.stroke();
    // 瓦砾
    if (fall > 0.05) {
      ctx.fillStyle = css(mix(stone, side, 0.4), l, fall);
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const bx = x + (hsh(seed * 7 + i) - 0.5) * w * 1.5, bw = (3 + 6 * hsh(i * 3.3 + seed)) * s, bh = bw * (0.5 + 0.4 * hsh(i * 1.7));
        ctx.rect(bx - bw / 2, y - bh + 2 * s * hsh(i * 9.1), bw, bh);
      }
      ctx.fill();
    }
  }

  function drawAltar(ctx, xf, k) {
    const l = 2, s = LS(l), x = xf * W.w, y = gY(l, xf) + 2 * s, u = 12 * s;
    const st = [[-0.62, -0.18, 0.42, 0.26], [0, -0.2, 0.48, 0.28], [0.6, -0.17, 0.4, 0.25], [-0.34, -0.58, 0.4, 0.24], [0.32, -0.58, 0.42, 0.24], [0, -0.92, 0.46, 0.2]];
    ctx.fillStyle = css([128, 116, 100], l);
    ctx.beginPath();
    for (const q of st) { const cx = x + q[0] * u, cy = y + q[1] * u; ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u, 0, 0, TAU); }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([214, 200, 172], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2);
    ctx.beginPath();
    for (const q of st) { const cx = x + q[0] * u + d * q[2] * u * 0.25, cy = y + q[1] * u - q[3] * u * 0.35; ctx.moveTo(cx + q[2] * u * 0.55, cy); ctx.ellipse(cx, cy, q[2] * u * 0.55, q[3] * u * 0.4, 0, 0, TAU); }
    ctx.fill();
    if (k > 0.01) {
      const top = y - 1.05 * u;
      smoke(ctx, x, top - 6 * s, k, 150 * s + W.h * 0.12, 7 * s, 3.3, false, 0.07);
      flame(ctx, x, top + 1 * s, 13 * s, k, 3.3);
    }
  }

  // 城外的炉灰（2:8）
  function drawAsh(ctx) {
    const l = 2, s = LS(l), x = X.job * W.w, y = gY(l, X.job) + 4 * s, rx = 40 * s, ry = 9 * s;
    const fade = 1 - 0.85 * W.lv.ybBless;
    // 灰堆自身淡淡的一层灰白的光：黄昏与夜里也看得出这一堆炉灰
    const ashLit = W.lv.ybAsh * fade;
    if (ashLit > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = ashLit * (0.14 + 0.36 * nightK());
      ctx.drawImage(SP.grey, x - rx * 1.7, y - ry * 3.2, rx * 3.4, ry * 5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = fade;
    ctx.fillStyle = css([104, 98, 92], l);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, Math.PI, TAU); ctx.lineTo(x + rx, y + 2 * s); ctx.lineTo(x - rx, y + 2 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 144, 138], l, 0.6);
    ctx.beginPath(); ctx.ellipse(x - 3 * s, y - ry * 0.55, rx * 0.62, ry * 0.36, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([40, 34, 32], l, 0.55);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const cx = x + (hsh(i * 3.1) - 0.5) * rx * 1.5, cy = y - ry * 0.3 * hsh(i * 5.3); ctx.moveTo(cx + 1.4 * s, cy); ctx.arc(cx, cy, 1.4 * s * (0.6 + hsh(i)), 0, TAU); }
    ctx.fill();
    // 瓦片
    ctx.fillStyle = css([170, 110, 76], l, 0.9);
    ctx.beginPath(); ctx.moveTo(x + 10 * s, y - 2 * s); ctx.lineTo(x + 15 * s, y - 3.5 * s); ctx.lineTo(x + 16 * s, y - 1.2 * s); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    // 灰中飘起的微尘
    const k = W.lv.ybAsh;
    if (k > 0.02) {
      SP || sprites();
      for (let i = 0; i < 10; i++) {
        const ph = U.fract(W.t * 0.07 + i / 10);
        const px = x + (hsh(i * 7.7) - 0.5) * rx * 1.6 + Math.sin(W.t * 0.6 + i) * 6 * s + W.wind * ph * 20 * s;
        const py = y - ry - ph * 34 * s;
        glowAt(ctx, SP.grey, px, py, (2.6 + 3 * ph) * s, k * 0.8 * (1 - ph) * Math.min(1, ph * 5));
      }
      ctx.globalAlpha = 1;
    }
  }

  // 七天七夜：灰前一粒一粒摆下的小石
  function drawNights(ctx) {
    const n = S.nights;
    if (!n) return;
    const l = 2, s = LS(l), y = gY(l, X.job) + 13 * s;
    SP || sprites();
    for (let i = 0; i < n; i++) {
      const x = (X.job - 0.03 + i * 0.01) * W.w;
      ctx.fillStyle = css([204, 196, 184], l, 1, 0.15);
      ctx.beginPath(); ctx.ellipse(x, y, 2.2 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
      if (nightK() > 0.2) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.pale, x, y - 1 * s, 5 * s, 0.35 * nightK());
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 被砍下的树墩；得了水气，还要发芽（14:7–9）
  function drawStump(ctx) {
    const l = 2, s = LS(l), x = X.stump * W.w, y = gY(l, X.stump) + 3 * s;
    const w = 11 * s, h = 9 * s;
    ctx.fillStyle = css([74, 56, 42], l);
    ctx.beginPath();
    ctx.moveTo(x - w * 1.25, y); ctx.quadraticCurveTo(x - w * 0.8, y - 1.5 * s, x - w * 0.7, y - h);
    ctx.lineTo(x + w * 0.72, y - h * 0.9); ctx.quadraticCurveTo(x + w * 0.85, y - 1.5 * s, x + w * 1.3, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([176, 140, 100], l);
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.95, w * 0.72, 2.2 * s, -0.04, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([120, 92, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.5 * s);
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.95, w * 0.42, 1.2 * s, -0.04, 0, TAU); ctx.stroke();
    const k = W.lv.ybSprout;
    if (k > 0.01) {
      const bx = x + w * 0.3, by = y - h * 0.95, H = 26 * s * k;
      ctx.strokeStyle = css([96, 150, 70], l, 1, 0.25); ctx.lineWidth = Math.max(1, 1.6 * s); ctx.lineCap = 'round';
      const sw = Math.sin(W.t * 1.3) * 1.5 * s;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 4 * s, by - H * 0.5, bx + 1 * s + sw, by - H); ctx.stroke();
      const leaf = (px, py, a, L) => { ctx.beginPath(); ctx.ellipse(px + Math.cos(a) * L * 0.5, py + Math.sin(a) * L * 0.5, L * 0.5, L * 0.22, a, 0, TAU); ctx.fill(); };
      ctx.fillStyle = css([120, 182, 84], l, 1, 0.3);
      const lk = c01((k - 0.3) / 0.7);
      if (lk > 0) {
        leaf(bx + 2.5 * s, by - H * 0.45, -2.4, 9 * s * lk);
        leaf(bx + 3 * s, by - H * 0.62, -0.6, 10 * s * lk);
        leaf(bx + 1 * s + sw, by - H, -1.3, 8 * s * lk);
      }
      ctx.globalCompositeOperation = 'lighter';
      SP || sprites();
      glowAt(ctx, SP.green, bx + 2 * s, by - H * 0.6, 22 * s, k * (0.15 + 0.4 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // 磐石；用铁笔镌刻，用铅灌在磐石上（19:24）
  const ROCK = [[-1, 0], [-1.05, -0.35], [-0.86, -0.8], [-0.44, -1.02], [0.1, -1.08], [0.58, -0.96], [0.94, -0.62], [1.08, -0.2], [1.1, 0]];
  const CARVE = ['我知道我的', '救赎主活着'];
  const CARV = { c: null, key: '' };
  // 刻字的大小与磐石的大小：字至少 12px（手机 10px），磐石按字撑开
  function rockGeo() {
    const l = 2, s = LS(l), P = port();
    const fs = P ? Math.max(10, 0.026 * M()) : Math.max(12, 0.018 * M());
    const w = Math.max(27 * s, 2.8 * fs), h = Math.max(72 * s, 7.6 * fs);
    const x = X.rock * W.w, y = gY(l, X.rock) + 4 * s;
    return { l, s, fs, w, h, x, y, fx: x - 0.1 * w, top: y - 0.86 * h };
  }
  function drawRock(ctx) {
    const G = rockGeo(), { l, s, fs, w, h, x, y } = G;
    ctx.fillStyle = css([118, 108, 98], l);
    ctx.beginPath();
    ROCK.forEach((q, i) => (i ? ctx.lineTo(x + q[0] * w, y + q[1] * h) : ctx.moveTo(x + q[0] * w, y + q[1] * h)));
    ctx.closePath(); ctx.fill();
    // 背光的一侧稍暗，显出石的厚
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([70, 62, 58], l, 0.4);
    ctx.beginPath();
    if (d > 0) { ctx.moveTo(x - 1 * w, y); ctx.lineTo(x - 1.05 * w, y - 0.35 * h); ctx.lineTo(x - 0.86 * w, y - 0.8 * h); ctx.lineTo(x - 0.7 * w, y - 0.78 * h); ctx.lineTo(x - 0.76 * w, y); }
    else { ctx.moveTo(x + 1.1 * w, y); ctx.lineTo(x + 1.08 * w, y - 0.2 * h); ctx.lineTo(x + 0.94 * w, y - 0.62 * h); ctx.lineTo(x + 0.6 * w, y - 0.6 * h); ctx.lineTo(x + 0.62 * w, y); }
    ctx.closePath(); ctx.fill();
    // 平整的石面
    ctx.fillStyle = css([150, 140, 126], l);
    ctx.beginPath();
    ctx.moveTo(x - 0.72 * w, y - 0.08 * h); ctx.lineTo(x - 0.66 * w, y - 0.88 * h); ctx.lineTo(x + 0.44 * w, y - 0.93 * h); ctx.lineTo(x + 0.56 * w, y - 0.08 * h);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([236, 222, 196], l, 0.4 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.7, 1 * s);
    ctx.beginPath();
    if (d > 0) { ctx.moveTo(x + 0.1 * w, y - 1.08 * h); ctx.lineTo(x + 0.58 * w, y - 0.96 * h); ctx.lineTo(x + 0.94 * w, y - 0.62 * h); }
    else { ctx.moveTo(x + 0.1 * w, y - 1.08 * h); ctx.lineTo(x - 0.44 * w, y - 1.02 * h); ctx.lineTo(x - 0.86 * w, y - 0.8 * h); }
    ctx.stroke();
    // 镌刻的字（两行竖写，自右而左），以光灌入；已刻成的字缓存在一张小画布上
    const k = W.lv.ybCarve;
    if (k > 0.005) {
      SP || sprites();
      const n = 10, shown = k * n, full = Math.min(n, Math.floor(shown + 1e-6));
      const cw = 2.8 * fs, ch = 5.9 * fs, ox = G.fx - cw / 2, oy = G.top;
      const pos = i => { const col = i < 5 ? 0 : 1, row = i % 5; return [cw / 2 + (col ? -0.72 : 0.72) * fs, fs * (0.72 + row * 1.08)]; };
      const font = '600 ' + fs.toFixed(1) + 'px "GS Kai", "KaiTi", "STKaiti", serif';
      // 石面被刻字的光照亮
      const lightA = 0.6 + 0.4 * nightK();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, G.fx, oy + ch * 0.48, ch * 0.9, k * (0.22 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      const key = [fs.toFixed(2), full, W.dpr].join('|');
      if (CARV.key !== key) {
        try {
          const c = CARV.c || (CARV.c = document.createElement('canvas'));
          c.width = Math.max(1, Math.ceil(cw * W.dpr)); c.height = Math.max(1, Math.ceil(ch * W.dpr));
          const g = c.getContext('2d');
          g.setTransform(W.dpr, 0, 0, W.dpr, 0, 0);
          g.clearRect(0, 0, cw, ch);
          g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgb(255,226,160)';
          for (let i = 0; i < full; i++) { const q = pos(i); g.fillText(CARVE[i < 5 ? 0 : 1][i % 5], q[0], q[1]); }
          CARV.key = key;
        } catch (e) { CARV.c = null; }
      }
      if (CARV.c && full > 0) {
        // 刻进石里的字，再以光灌入
        ctx.globalAlpha = 0.55;
        ctx.drawImage(CARV.c, ox, oy, cw, ch);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = lightA;
        ctx.drawImage(CARV.c, ox, oy, cw, ch);
        ctx.globalAlpha = lightA * 0.5;
        ctx.drawImage(CARV.c, ox, oy, cw, ch);
        ctx.globalCompositeOperation = 'source-over';
      }
      if (full < n) {             // 正在刻的一个字：一点火光落在笔画上
        const i = full, a = c01(shown - i), q = pos(i);
        ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a * lightA;
        ctx.fillStyle = 'rgb(255,226,160)';
        ctx.fillText(CARVE[i < 5 ? 0 : 1][i % 5], ox + q[0], oy + q[1]);
        glowAt(ctx, SP.warm, ox + q[0] + (a - 0.5) * fs * 0.6, oy + q[1] + (a - 0.5) * fs * 0.8, fs * 0.9, 0.8 * (1 - Math.abs(a - 0.5)));
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
  }

  // 山岩：野山羊的家，大鹰的窝（39:1，39:27–28）
  function cragGeo() {
    const l = 1, s = LS(l), x = X.crag * W.w, y = gY(l, X.crag) + 4 * s;
    const H = Math.min(port() ? 0.2 * W.h : 0.28 * W.h, 230 * s), w = Math.max(18, H * 0.22);
    return { l, s, x, y, H, w, top: [x - 0.05 * w, y - H] };
  }
  const CRAG = [[-1.6, 0], [-1.1, -0.18], [-0.95, -0.34], [-0.7, -0.42], [-0.62, -0.6], [-0.44, -0.7], [-0.4, -0.86], [-0.22, -0.97], [0.06, -1], [0.22, -0.9],
    [0.3, -0.76], [0.52, -0.66], [0.56, -0.5], [0.8, -0.38], [0.9, -0.2], [1.3, -0.06], [1.8, 0]];
  // 石阶上的野山羊：[x/w, y/H, 朝向, 大小, 出现的先后]
  const IBEX = [[-0.7, -0.37, -1, 1, 0], [-0.4, -0.65, 1, 0.9, 0.8], [0.3, -0.7, 1, 0.8, 1.4], [0.58, -0.44, -1, 0.95, 1.8], [0.92, -0.14, 1, 0.85, 2.2]];
  function drawIbex(ctx, x, y, u, dir, a, seed, l) {
    if (a < 0.01) return;
    const bob = Math.max(0, Math.sin(W.t * 0.7 + seed)) * 0.25;
    ctx.save();
    ctx.translate(x, y); ctx.scale(dir, 1);
    ctx.globalAlpha = Math.min(1, a);
    ctx.fillStyle = css([150, 120, 88], l);
    // 身、腿
    ctx.beginPath(); ctx.ellipse(0, -1.25 * u, 0.95 * u, 0.45 * u, -0.05, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([120, 96, 70], l); ctx.lineWidth = Math.max(0.8, 0.16 * u); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const lx of [-0.7, -0.45, 0.45, 0.7]) { ctx.moveTo(lx * u, -1.1 * u); ctx.lineTo(lx * u + (lx > 0 ? 0.05 : -0.05) * u, 0); }
    ctx.stroke();
    // 颈、头、须
    ctx.beginPath(); ctx.moveTo(0.6 * u, -1.45 * u); ctx.lineTo(1.05 * u, -(2.05 - bob) * u); ctx.lineTo(1.3 * u, -(1.95 - bob) * u); ctx.lineTo(0.95 * u, -1.2 * u); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(1.28 * u, -(1.98 - bob) * u, 0.34 * u, 0.2 * u, 0.5, 0, TAU); ctx.fill();
    // 向后弯的长角
    ctx.strokeStyle = css([96, 80, 62], l); ctx.lineWidth = Math.max(0.9, 0.2 * u);
    ctx.beginPath(); ctx.moveTo(1.12 * u, -(2.12 - bob) * u); ctx.quadraticCurveTo(0.95 * u, -(3.05 - bob) * u, 0.35 * u, -(2.75 - bob) * u); ctx.stroke();
    // 迎光的背
    ctx.strokeStyle = css([236, 214, 176], l, 0.5 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.6, 0.1 * u);
    ctx.beginPath(); ctx.ellipse(0, -1.25 * u, 0.95 * u, 0.45 * u, -0.05, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.restore();
    ctx.lineCap = 'butt';
  }
  function drawCrag(ctx) {
    const g = cragGeo(), { l, s, x, y, H, w } = g;
    ctx.fillStyle = css([112, 100, 92], l);
    ctx.beginPath();
    CRAG.forEach((q, i) => (i ? ctx.lineTo(x + q[0] * w, y + q[1] * H) : ctx.moveTo(x + q[0] * w, y + q[1] * H)));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([80, 70, 66], l, 0.55);
    ctx.beginPath();
    ctx.moveTo(x + 0.06 * w, y - H); ctx.lineTo(x + 0.22 * w, y - 0.9 * H); ctx.lineTo(x + 0.3 * w, y - 0.76 * H); ctx.lineTo(x + 0.52 * w, y - 0.66 * H);
    ctx.lineTo(x + 0.56 * w, y - 0.5 * H); ctx.lineTo(x + 0.8 * w, y - 0.38 * H); ctx.lineTo(x + 0.9 * w, y - 0.2 * H); ctx.lineTo(x + 1.3 * w, y - 0.06 * H); ctx.lineTo(x + 1.8 * w, y);
    ctx.lineTo(x + 0.3 * w, y); ctx.lineTo(x + 0.1 * w, y - 0.6 * H);
    ctx.closePath(); ctx.fill();
    // 岩上的横裂与小灌木
    ctx.strokeStyle = css([70, 62, 58], l, 0.6); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (const q of [[-0.6, -0.55, 0.5], [-0.35, -0.8, 0.4], [-0.9, -0.3, 0.6], [0.1, -0.45, 0.5]]) { ctx.moveTo(x + q[0] * w, y + q[1] * H); ctx.lineTo(x + (q[0] + q[2]) * w, y + (q[1] + 0.02) * H); }
    ctx.stroke();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([238, 222, 196], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.7, 1 * s);
    ctx.beginPath();
    const side = d < 0 ? CRAG.slice(0, 9) : CRAG.slice(8);
    side.forEach((q, i) => (i ? ctx.lineTo(x + q[0] * w, y + q[1] * H) : ctx.moveTo(x + q[0] * w, y + q[1] * H)));
    ctx.stroke();
    // 山岩间的野山羊（39:1）：立在石阶上
    const ib = W.lv.ybIbex;
    if (ib > 0.01) for (const q of IBEX) drawIbex(ctx, x + q[0] * w, y + q[1] * H, Math.max(3.2, 8.5 * s) * (q[3] || 1), q[2], ib * c01(ib * 3 - (q[4] || 0)), q[0] * 7, l);
    // 窝
    const [nx, ny] = g.top;
    ctx.strokeStyle = css([96, 74, 52], l); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * 0.5; ctx.moveTo(nx - 6 * s + i * 0.4 * s, ny + 1 * s - (i % 2) * 0.8 * s); ctx.lineTo(nx + 6 * s - i * 0.3 * s, ny + 0.5 * s + Math.sin(a) * 0.8 * s); }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上——光之会、落下的影、看顾的光、篱笆
  // ════════════════════════════════════════════════════════════
  function councilPos() { return port() ? [0.62 * W.w, 0.43 * W.h] : [0.76 * W.w, 0.17 * W.h]; }
  const FORMS = 11, ACC_I = 8;
  function formAt(i, spread) {
    const [cx, cy] = councilPos();
    const R = (port() ? 0.34 : 0.14) * W.w * (spread || 1), ry = (port() ? 0.035 : 0.045) * W.h * (spread || 1);
    const th = Math.PI * (1 - (0.04 + 0.92 * i / (FORMS - 1)));
    return [cx + Math.cos(th) * R, cy + Math.sin(th) * ry + ry * 0.35];
  }
  // 一个光的形（神的众子）：修长、无面目，只有光
  function lightForm(ctx, x, y, h, a, cold, seed) {
    if (a < 0.01) return;
    const t = W.t, br = 0.85 + 0.15 * Math.sin(t * 1.3 + seed * 2.1);
    if (cold) {
      // 冷而暗的影：兜帽般的形，下半如烟散去
      ctx.globalCompositeOperation = 'source-over';
      glowAt(ctx, SP.cold, x, y - h * 0.5, h * 0.8, a * 0.35);
      const gr = ctx.createLinearGradient(0, y - h, 0, y + h * 0.1);
      gr.addColorStop(0, rgba([40, 36, 56], a * 0.85)); gr.addColorStop(0.55, rgba([46, 40, 62], a * 0.6)); gr.addColorStop(1, rgba([46, 40, 62], 0));
      ctx.fillStyle = gr;
      const sw = Math.sin(W.t * 0.9 + seed) * h * 0.03;
      ctx.beginPath();
      ctx.moveTo(x - h * 0.2 + sw, y + h * 0.05);
      ctx.quadraticCurveTo(x - h * 0.17, y - h * 0.45, x - h * 0.1, y - h * 0.78);
      ctx.quadraticCurveTo(x - h * 0.02, y - h * 1.0, x + h * 0.08, y - h * 0.86);
      ctx.quadraticCurveTo(x + h * 0.14, y - h * 0.5, x + h * 0.22 - sw, y + h * 0.05);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba([150, 140, 196], a * 0.3); ctx.lineWidth = Math.max(0.6, h * 0.018);
      ctx.beginPath(); ctx.moveTo(x - h * 0.1, y - h * 0.78); ctx.quadraticCurveTo(x - h * 0.02, y - h * 1.0, x + h * 0.08, y - h * 0.86); ctx.stroke();
      for (let i = 0; i < 3; i++) { const ph = U.fract(W.t * 0.2 + i / 3); glowAt(ctx, SP.soot, x + Math.sin(i * 2 + W.t) * h * 0.1, y - ph * h * 0.3, h * (0.12 + 0.1 * ph), a * 0.35 * (1 - ph)); }
      return;
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.white, x, y - h * 0.5, h * 0.9, a * 0.35 * br);
    ctx.fillStyle = rgba([255, 246, 222], a * 0.34 * br);
    ctx.beginPath();
    ctx.moveTo(x - h * 0.17, y); ctx.quadraticCurveTo(x - h * 0.13, y - h * 0.5, x - h * 0.05, y - h * 0.78);
    ctx.lineTo(x + h * 0.05, y - h * 0.78); ctx.quadraticCurveTo(x + h * 0.13, y - h * 0.5, x + h * 0.17, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba([255, 252, 240], a * 0.55 * br);
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.45, h * 0.05, h * 0.36, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y - h * 0.87, h * 0.075, 0, TAU); ctx.fill();
    glowAt(ctx, SP.pale, x, y - h * 0.87, h * 0.2, a * 0.6 * br);
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawCouncil(ctx) {
    const k = W.lv.ybCouncil;
    if (k < 0.01) return;
    SP || sprites();
    const [cx, cy] = councilPos(), m = M();
    // 正中：只是光（不画神的形像）
    ctx.globalCompositeOperation = 'lighter';
    const pul = 0.9 + 0.1 * Math.sin(W.t * 0.8);
    glowAt(ctx, SP.white, cx, cy, m * 0.3, k * 0.3 * pul);
    glowAt(ctx, SP.pale, cx, cy, m * 0.09, k * 0.95);
    glowAt(ctx, SP.gold, cx, cy, m * 0.16, k * 0.45);
    // 缓缓转动的光芒
    ctx.strokeStyle = rgba([255, 244, 214], 0.12 * k);
    ctx.lineWidth = Math.max(1, m * 0.004);
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = W.t * 0.05 + i * TAU / 16, r0 = m * 0.05, r1 = m * (0.16 + 0.05 * Math.sin(i * 2.3 + W.t * 0.4));
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.8); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.8);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    const h = m * (port() ? 0.075 : 0.07);
    for (let i = 0; i < FORMS; i++) {
      const cold = i === ACC_I;
      if ((cold && !S.acc) || i === (FORMS - 1) / 2) continue;     // 正中只留光
      const p = formAt(i, 1);
      lightForm(ctx, p[0], p[1], h * (0.9 + 0.1 * hsh(i)), k * (cold ? 1 : 0.95), cold, i);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 神的众子也都欢呼（38:7）：满天一弧光的形
  function drawJoy(ctx) {
    const k = W.lv.ybJoy;
    if (k < 0.01) return;
    SP || sprites();
    const P = port(), n = P ? 9 : 15, h = M() * (P ? 0.07 : 0.06);
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = W.w * (0.08 + 0.84 * u), y = W.h * (P ? 0.5 - 0.1 * Math.sin(u * Math.PI) : 0.36 - 0.2 * Math.sin(u * Math.PI));
      const lift = Math.max(0, Math.sin(W.t * 2.2 + i * 0.9)) * h * 0.08;
      const a = k * c01(k * 1.6 - u * 0.5);
      lightForm(ctx, x, y - lift, h * (0.85 + 0.2 * hsh(i * 3)), a, false, i + 20);
      // 举起的双臂：两道向上的光
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba([255, 244, 214], a * 0.4);
      ctx.lineWidth = Math.max(1, h * 0.035); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - h * 0.06, y - lift - h * 0.7); ctx.lineTo(x - h * 0.2, y - lift - h * 1.08);
      ctx.moveTo(x + h * 0.06, y - lift - h * 0.7); ctx.lineTo(x + h * 0.2, y - lift - h * 1.08);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 看顾的一道光（1:8）与现在亲眼看见你（42:5）
  function drawRegard(ctx) {
    const k = W.lv.ybRegard, k2 = W.lv.ybSeen;
    if (k < 0.01 && k2 < 0.01) return;
    SP || sprites();
    const [jx, jy] = at('job', 0.5);
    ctx.globalCompositeOperation = 'lighter';
    if (k > 0.01) {
      const [cx, cy] = councilPos();
      beamLine(ctx, SP.beam, cx, cy, jx, jy + 20 * LS(2), 60 * LS(2), k * 0.4);
      glowAt(ctx, SP.gold, jx, jy, 60 * LS(2), k * 0.45);
    }
    if (k2 > 0.01) {
      beamLine(ctx, SP.beamGold, jx, -20, jx, jy + 22 * LS(2), 90 * LS(2), k2 * 0.5);
      glowAt(ctx, SP.gold, jx, jy, 70 * LS(2), k2 * 0.5);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 四面圈上篱笆（1:10）；只围着约伯的光圈（1:12）
  function drawHedge(ctx) {
    const k = W.lv.ybHedge;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    if (k > 0.01) {
      const s = LS(2), cx = 0.81 * W.w, cy = gY(2, 0.81) + 8 * s;
      const rx = (port() ? 0.26 : 0.2) * W.w, ry = 12 * s, dome = Math.min(0.3 * W.h, rx * 0.9);
      const tw = 0.85 + 0.15 * Math.sin(W.t * 1.7);
      // 穹形
      ctx.strokeStyle = rgba([255, 226, 150], 0.18 * k * tw); ctx.lineWidth = Math.max(1, 1.4 * s);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, dome, 0, Math.PI, TAU); ctx.stroke();
      ctx.strokeStyle = rgba([255, 226, 150], 0.08 * k); ctx.lineWidth = Math.max(4, 7 * s);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, dome, 0, Math.PI, TAU); ctx.stroke();
      // 地上一圈光的篱笆
      const N = 64;
      ctx.lineWidth = Math.max(1, 1.3 * s);
      for (let pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = rgba([255, 222, 140], (pass ? 0.55 : 0.2) * k);
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const th = i / N * TAU, front = Math.sin(th) > 0;
          if (front !== !!pass) continue;
          const px = cx + Math.cos(th) * rx, py = cy + Math.sin(th) * ry;
          const hp = (16 + 4 * Math.sin(i * 1.7 + W.t * 2)) * s * (front ? 1 : 0.7);
          ctx.moveTo(px, py); ctx.lineTo(px, py - hp);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = rgba([255, 230, 160], 0.4 * k);
      ctx.beginPath(); ctx.ellipse(cx, cy - 14 * s, rx, ry, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.stroke();
    }
    const g = W.lv.ybGuard;
    if (g > 0.01 && has('job')) {
      const s = LS(2), [x, y] = at('job', 0);
      const rx = 17 * s, ry = 4.5 * s;
      ctx.strokeStyle = rgba([255, 226, 160], 0.55 * g); ctx.lineWidth = Math.max(1, 1.2 * s);
      ctx.beginPath(); ctx.ellipse(x, y + 1 * s, rx, ry, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = rgba([255, 226, 160], 0.14 * g); ctx.lineWidth = Math.max(3, 5 * s);
      ctx.beginPath(); ctx.ellipse(x, y + 1 * s, rx, ry, 0, 0, TAU); ctx.stroke();
      beamLine(ctx, SP.beamGold, x, y - 56 * s, x, y + 4 * s, rx * 2.2, 0.12 * g);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 我必如精金（23:10）：约伯周身的金边
  function drawGold(ctx) {
    const k = W.lv.ybGold;
    if (k < 0.01 || !has('job')) return;
    SP || sprites();
    const [x, y] = at('job', 0.5), s = LS(2), pul = 0.85 + 0.15 * Math.sin(W.t * 2);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, 70 * s, k * 0.9 * pul);
    glowAt(ctx, SP.pale, x, y - 4 * s, 16 * s, k * 0.5 * pul);
    for (let i = 0; i < 12; i++) {
      const ph = U.fract(W.t * 0.25 + i / 12);
      glowAt(ctx, SP.gold, x + Math.sin(i * 2.4 + W.t) * 16 * s, y + 20 * s - ph * 70 * s, 3.2 * s, k * (1 - ph) * 0.95);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 金边：约伯身后一道窄而亮的金光，把他的剪影勾出一圈金边（画在人物之下）
  function drawGoldBack(ctx) {
    const k = W.lv.ybGold;
    if (k < 0.01 || !has('job')) return;
    SP || sprites();
    const [x, y] = at('job', 0), [, yt] = at('job', 1), s = LS(2), hh = Math.max(20 * s, y - yt);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.95;
    ctx.drawImage(SP.gold, x - 13 * s, y - hh * 1.2, 26 * s, hh * 1.35);
    ctx.globalAlpha = k * 0.8;
    ctx.drawImage(SP.pale, x - 8 * s, y - hh * 1.08, 16 * s, hh * 1.12);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的光：落下的影、从天降下的火、尘土、狂风、晨光 ──
  function drawTransients(ctx, pass) {
    SP || sprites();
    for (const f of FXL) {
      const u = c01(f.t / f.dur);
      if (f.type === 'descend' && pass === 'air') {
        // 冷的影从光之会中落下，落到地上散去
        const e = eio(c01(u / 0.8)), x = lerp(f.x0, f.x1, e), y = lerp(f.y0, f.y1, e) - Math.sin(e * Math.PI) * 0.06 * W.h;
        const a = (1 - sstep(0.75, 1, u));
        for (let i = 0; i < 7; i++) {
          const b = c01(e - i * 0.04), px = lerp(f.x0, f.x1, b), py = lerp(f.y0, f.y1, b) - Math.sin(b * Math.PI) * 0.06 * W.h;
          glowAt(ctx, SP.soot, px, py, M() * 0.03 * (1 - i * 0.1), a * 0.5 * (1 - i / 7));
        }
        glowAt(ctx, SP.cold, x, y, M() * 0.035, a * 0.4);
      } else if (f.type === 'firefall' && pass === 'mid') {
        // 神从天上降下火来（1:16）：暗云里劈下一道红橙的火，落在群羊上（不用看顾之光的金白）
        const x = f.xf * W.w, gy = gY(1, f.xf), cy = Math.max(W.h * 0.12, gy - 0.34 * W.h), cx = x + 0.025 * W.w;
        const a = u < 0.08 ? u / 0.08 : 1 - sstep(0.35, 1, u);
        const cloud = u < 0.05 ? u / 0.05 : 1 - sstep(0.55, 1, u);
        for (let i = 0; i < 11; i++) {
          const rw = (0.035 + 0.03 * hsh(i * 2.2)) * W.w, rh = rw * (0.42 + 0.15 * hsh(i * 4.4));
          ctx.globalAlpha = cloud * 0.7;
          ctx.drawImage(SP.soot, cx + (hsh(i * 3.7) - 0.5) * 0.16 * W.w - rw, cy + (hsh(i * 5.1) - 0.5) * 0.035 * W.h - rh, rw * 2, rh * 2);
        }
        const fl = u < 0.45 ? (0.55 + 0.45 * Math.abs(Math.sin(f.t * 31))) : 1;
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.ember, cx, cy + 0.01 * W.h, 0.05 * W.w, a * 0.45 * fl);
        ctx.lineJoin = 'miter'; ctx.lineCap = 'round';
        for (let br = 0; br < 2; br++) {
          const n = 9, pts = [];
          for (let i = 0; i <= n; i++) {
            const t = i / n, jx = (i === 0 || i === n) ? 0 : (hsh(i * 7.3 + br * 31) - 0.5) * 0.028 * W.w;
            pts.push([lerp(cx + (br ? 0.012 * W.w : 0), x + (br ? -0.018 * W.w : 0), t) + jx, lerp(cy, gy, br ? t * 0.72 : t)]);
          }
          if (br) pts.splice(0, 3);
          for (const [lw, col, al] of [[7, [255, 96, 40], 0.35], [2.6, [255, 150, 70], 0.9], [1.1, [255, 228, 180], 1]]) {
            ctx.strokeStyle = rgba(col, a * al * fl * (br ? 0.6 : 1));
            ctx.lineWidth = lw * Math.max(0.7, W.unit) * (br ? 0.6 : 1);
            ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
          }
        }
        glowAt(ctx, SP.warm, x, gy, 0.1 * W.w, a * 0.7);
        glowAt(ctx, SP.ember, x, gy, 0.06 * W.w, a);
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
      } else if (f.type === 'raid' && (pass === (f.l === 1 ? 'mid' : 'near'))) {
        // 尘土滚滚而去（1:15，1:17）
        const l = f.l, s = LS(l), e = eio(u), a = (u < 0.15 ? u / 0.15 : 1) * (1 - sstep(0.75, 1, u));
        for (let j = 0; j < (f.n || 1); j++) {
          const x = lerp(f.x0, f.x1, c01(e - j * 0.08)) * W.w, gy = gY(l, clamp(x / W.w, 0, 1)) - 6 * s - j * 5 * s;
          for (let i = 0; i < 6; i++) glowAt(ctx, SP.dust, x - i * 9 * s, gy - Math.sin(i * 1.3 + W.t * 3) * 4 * s, (18 - i * 1.5) * s, a * 0.5);
        }
      } else if (f.type === 'gust' && pass === 'air') {
        // 狂风从旷野刮来（1:19）：贴着地面自右而左卷过的一道尘土
        const s = LS(2), x = lerp(1.08, f.xf - 0.05, eio(c01(u / 0.55))) * W.w, a = (1 - sstep(0.6, 1, u)) * c01(u * 5);
        const g0 = gY(2, clamp(x / W.w, 0, 1));
        for (let i = 0; i < 22; i++) {
          const back = i * 13 * s, xx = x + back + Math.sin(i * 2.1 + W.t * 4) * 6 * s;
          if (xx > W.w * 1.1) continue;
          const yy = Math.min(g0, gY(2, clamp(xx / W.w, 0, 1))) - (8 + 44 * hsh(i * 3.3)) * s * (0.6 + 0.4 * Math.sin(W.t * 3 + i));
          const rw = (40 - i * 0.7) * s, rh = (15 + 7 * hsh(i * 1.9)) * s, al = a * (0.8 - i * 0.026);
          if (al < 0.01) continue;
          ctx.globalAlpha = al;
          ctx.drawImage(i % 2 ? SP.dust : SP.dustDk, xx - rw, yy - rh, rw * 2, rh * 2);
        }
      } else if (f.type === 'veil' && pass === 'air') {
        // 房屋倒塌：一层低低的尘土遮住长子的房屋与院中（只以尘土与缺席讲述）
        const s = LS(2), a = sstep(0, 0.08, u) * (1 - sstep(0.45, 1, u)), cx = f.xf * W.w, g0 = gY(2, f.xf);
        for (let i = 0; i < 24; i++) {
          const ox = (hsh(i * 4.1) - 0.5) * 0.13 * W.w * (0.7 + 0.5 * u), oy = (4 + 40 * hsh(i * 2.3)) * s * (0.6 + 0.8 * u);
          const rw = (30 + 24 * hsh(i * 7.7)) * s * (0.8 + 0.5 * u), rh = rw * 0.5;
          ctx.globalAlpha = Math.min(1, a * 0.95);
          ctx.drawImage(i % 3 === 0 ? SP.dust : i % 3 === 1 ? SP.dustDk : SP.smoke, cx + ox + W.wind * u * 20 * s - rw, g0 - oy - rh, rw * 2, rh * 2);
        }
      } else if (f.type === 'sweep' && pass === 'air') {
        // 晨光掠过全地（38:12–14）
        const x = lerp(-0.2, 1.2, eio(u)) * W.w, a = Math.sin(u * Math.PI);
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createLinearGradient(x - 0.18 * W.w, 0, x + 0.18 * W.w, 0);
        g.addColorStop(0, 'rgba(255,214,150,0)'); g.addColorStop(0.5, rgba([255, 222, 168], 0.22 * a)); g.addColorStop(1, 'rgba(255,214,150,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - 0.18 * W.w, W.horizonY - 0.04 * W.h, 0.36 * W.w, W.h);
        ctx.globalCompositeOperation = 'source-over';
      } else if (f.type === 'puff' && pass === 'air') {
        // 柔和的一团尘土或灰（撕裂外袍、长疮、把尘土向天扬起）：不用引擎的方块粒子
        const s = LS(2), [x, y] = at(f.id, f.k == null ? 0.6 : f.k), spr = f.col === 'grey' ? SP.grey : SP.dust;
        for (let i = 0; i < (f.n || 6); i++) {
          const q = c01(u * (1 + 0.3 * hsh(i * 3.1)));
          const px = x + (hsh(i * 7.3) - 0.5) * 16 * s + (hsh(i * 2.9) - 0.5) * 30 * s * q, py = y - q * (f.rise || 26) * s * (0.6 + 0.6 * hsh(i * 5.3));
          glowAt(ctx, spr, px, py, (5 + 12 * q) * s, (f.a || 0.7) * Math.min(1, q * 8) * (1 - q));
        }
      } else if (f.type === 'sneeze' && pass === 'air') {
        // 它打喷嚏就发出光来（41:18）：自鼻孔向前迸出的柔和金光与火星
        if (W.lv.ybLeviA < 0.3) continue;
        const h = leviHead(), hs = h[2], n = f.small ? 12 : 26, e = 1 - Math.pow(1 - u, 2.2);
        const dir = leviState(0.8).dir;
        for (let i = 0; i < n; i++) {
          const a = (hsh(i * 3.7) - 0.5) * 1.9 - (dir > 0 ? 0.25 : Math.PI - 0.25), sp = (40 + 90 * hsh(i * 1.3)) * hs * (f.small ? 0.6 : 1);
          const px = h[0] + dir * 14 * hs + Math.cos(a) * sp * e * (dir > 0 ? 1 : 1), py = h[1] + Math.sin(a) * sp * e * 0.7 + 20 * hs * u * u;
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, i % 3 ? SP.gold : SP.warm, px, py, (3 + 3 * hsh(i)) * hs, (1 - u) * 0.9);
        }
        glowAt(ctx, SP.pale, h[0] + dir * 16 * hs, h[1], (18 + 40 * e) * hs, (1 - u) * (f.small ? 0.35 : 0.6));
        ctx.globalCompositeOperation = 'source-over';
      } else if (f.type === 'pulse' && pass === 'air') {
        const [x, y] = at(f.id || 'job', 0.55);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, x, y, 60 * LS(2) * (0.6 + u), (1 - u) * 0.6);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 山上的余烬（1:16）
  function drawEmbers(ctx) {
    const k = W.lv.ybEmbers;
    if (k < 0.01) return;
    SP || sprites();
    const l = 1, s = LS(l);
    for (let i = 0; i < 7; i++) {
      const xf = 0.6 + i * 0.016 + (hsh(i * 3.3) - 0.5) * 0.01, x = xf * W.w, y = gY(l, xf) + 1 * s;
      if (i % 2 === 0) smoke(ctx, x, y, k * 0.8, 90 * s + 0.1 * W.h, 11 * s, i * 1.7, true, 0.05);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.ember, x, y, (9 + 4 * Math.sin(W.t * 3 + i)) * s, k * (0.5 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 朋友们的一堆火；火星飞腾（5:7）
  function drawFire(ctx) {
    const k = W.lv.ybFire;
    if (k < 0.01) return;
    SP || sprites();
    const l = 2, s = LS(l), x = X.fire * W.w, y = gY(l, X.fire) + 9 * s;
    ctx.strokeStyle = css([70, 50, 36], l); ctx.lineWidth = Math.max(1, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - 7 * s, y + 1 * s); ctx.lineTo(x + 6 * s, y - 2 * s); ctx.moveTo(x + 7 * s, y + 1 * s); ctx.lineTo(x - 5 * s, y - 2 * s); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y - 10 * s, 95 * s, k * (0.12 + 0.3 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    flame(ctx, x, y - 1 * s, 12 * s, k, 7.7);
    const sp = W.lv.ybSparks, n = Math.round(6 + 26 * sp);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const ph = U.fract(W.t * (0.35 + 0.25 * hsh(i)) + hsh(i * 7.3));
      const H = (40 + 90 * sp) * s * (0.5 + hsh(i * 2.9));
      const px = x + Math.sin(ph * 5 + i * 1.3) * (4 + 10 * ph) * s + W.wind * ph * 16 * s, py = y - 8 * s - ph * H;
      glowAt(ctx, SP.ember, px, py, (2.2 + 1.2 * (1 - ph)) * s, k * (1 - ph) * 0.9);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：辩论之夜——站立的光、地中的宝藏、北方的金光
  // ════════════════════════════════════════════════════════════
  function drawStand(ctx) {
    const k = W.lv.ybStand;
    if (k < 0.01) return;
    SP || sprites();
    const xf = port() ? 0.46 : 0.6, x = xf * W.w, y = Math.min(gY(0, xf), W.horizonY + 2);
    const H = (port() ? 0.2 : 0.26) * W.h;
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.85 + 0.15 * Math.sin(W.t * 0.9);
    beamLine(ctx, SP.beam, x, y - H, x, y + 4, 0.022 * W.w + 6, k * 0.8 * br);
    beamLine(ctx, SP.beamGold, x, y - H * 1.4, x, y + 4, 0.06 * W.w, k * 0.3);
    glowAt(ctx, SP.pale, x, y, 0.05 * W.w, k * 0.8);
    glowAt(ctx, SP.gold, x, y, 0.12 * W.w, k * 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawVeins(ctx, l) {
    const k = W.lv.ybVeins;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(l), n = l === 2 ? 22 : l === 1 ? 26 : 18;
    const cols = [SP.gold, SP.white, SP.blue];
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const xf = (l === 2 ? 0.4 : 0.5) + (l === 2 ? 0.6 : 0.5) * hsh(i * 3.7 + l * 11);
      if (!W.hasLandBase(l, xf * W.w, 4)) continue;
      const g = gY(l, xf), bot = l === 2 ? W.h : W.waterlineY(l === 1 ? 1 : 0);
      const depth = (bot - g) * (l === 2 ? 0.18 + 0.7 * hsh(i * 1.9 + l) : 0.25 + 0.6 * hsh(i * 1.9 + l));
      const tw = Math.max(0, Math.sin(W.t * (1.2 + hsh(i) * 2) + i * 2.3));
      const r = (l === 2 ? 7 + 7 * tw : 6 + 6 * tw) * s;
      glowAt(ctx, cols[i % 3], xf * W.w, g + depth, r, k * (0.55 + 0.45 * tw));
      glowAt(ctx, SP.pale, xf * W.w, g + depth, r * 0.35, k * (0.4 + 0.6 * tw));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 金光出于北方（37:22）：远山后面升起的金色光幕
  function drawNorth(ctx) {
    const k = W.lv.ybNorth;
    if (k < 0.01) return;
    SP || sprites();
    const hz = W.horizonY, P = port();
    ctx.globalCompositeOperation = 'lighter';
    const gcx = (P ? 0.55 : 0.72) * W.w, grx = (P ? 0.7 : 0.42) * W.w, gry = 0.3 * W.h;
    ctx.globalAlpha = 0.55 * k;
    ctx.drawImage(SP.gold, gcx - grx, hz - gry, grx * 2, gry * 2);
    ctx.globalAlpha = 0.35 * k;
    ctx.drawImage(SP.warm, gcx - grx * 0.6, hz - gry * 0.45, grx * 1.2, gry * 0.9);
    const n = 22;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), x = W.w * (P ? 0.05 + 0.9 * u : 0.42 + 0.56 * u);
      const H = W.h * (0.12 + 0.14 * (0.5 + 0.5 * Math.sin(W.t * 0.5 + i * 0.9)) * (1 - Math.abs(u - 0.55)));
      const a = k * (0.25 + 0.2 * Math.sin(W.t * 0.8 + i * 1.7));
      beamLine(ctx, SP.beamGold, x + Math.sin(W.t * 0.3 + i) * 6, hz - H, x, hz, 0.03 * W.w, a);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：旋风（38:1，40:6）——本卷的签名之景
  // ════════════════════════════════════════════════════════════
  function whirlGeo() {
    const P = port(), cx = X.whirl * W.w, base = gY(1, X.whirl) + 2, top = -0.05 * W.h;
    return { P, cx, base, top, H: base - top, Rt: (P ? 0.5 : 0.25) * W.w, Rb: (P ? 0.04 : 0.02) * W.w };
  }
  function whirlAxis(g, f, k) { return g.cx + Math.sin(W.t * 0.45 + f * 2.4) * 0.018 * W.w * f * k + (1 - f) * 0.03 * W.w * Math.sin(W.t * 0.2); }
  // 旋风由许多绕轴而转的云团组成：外缘暗，近轴处被其中的光照亮
  let PUFF = null;
  const WG = { ctx: null, night: null, day: null };
  function puffs() {
    if (PUFF) return PUFF;
    const r = U.mulberry32(3801), n = 96;
    PUFF = [];
    for (let i = 0; i < n; i++) {
      const f = Math.pow(r(), 0.85);
      PUFF.push({ f, a: r() * TAU, sz: 0.7 + 0.6 * r(), dk: r(), w: 0.85 + 0.3 * r() });
    }
    PUFF.sort((p, q) => p.f - q.f);
    return PUFF;
  }
  function drawWhirl(ctx) {
    const k = W.lv.ybWhirl;
    if (k < 0.01) return;
    SP || sprites();
    const g = whirlGeo(), day = W.daylight, night = 1 - day;
    const speak = W.ritual && W.ritual.holding ? W.ritual.charge : 0;
    const grow = c01(k * 2.4);
    const list = puffs(), n = g.P ? 72 : list.length;
    const br = 0.8 + 0.2 * Math.sin(W.t * 1.1) + speak * 0.8;
    const dayDim = 1 - 0.5 * sstep(0.3, 0.7, day);        // 白昼里暗的云团减半：旋风是光，不是灾
    const rAt = f => g.Rb + (g.Rt - g.Rb) * Math.pow(1 - f, 1.5);
    // 顶上压下来的云
    glowAt(ctx, SP.cDark, g.cx, g.top + g.H * 0.04, g.Rt * 1.25, k * (0.12 + 0.4 * night) * dayDim);
    const puffAt = (p, front) => {
      if (p.f > grow) return;
      const r = rAt(p.f) * p.w;
      const a = p.a + W.t * (0.5 + 2.2 * p.f) * (0.6 + 0.4 * k);
      const sn = Math.sin(a), cs = Math.cos(a);
      if ((sn > 0) !== front) return;
      const x = whirlAxis(g, p.f, k) + cs * r, y = g.top + g.H * p.f + sn * r * 0.2;
      const size = (r * 0.5 + g.Rb * 1.4) * p.sz;
      const edge = Math.abs(cs);
      // 外缘稍暗，近轴处被其中的光照亮；白昼是明亮的白云，夜里是被内里的光照着的云
      let spr, al;
      const dayLit = day > 0.5;                 // 白昼：暗的云团换成灰白，灰的换成亮白
      if (!front) { spr = p.dk < 0.3 ? (dayLit ? SP.cMid : SP.cDark) : (dayLit ? SP.cLit : SP.cMid); al = p.dk < 0.3 ? 0.3 * dayDim : 0.3; }
      else if (edge > 0.8 && p.dk < 0.6) { spr = dayLit ? SP.cMid : SP.cDark; al = 0.34 * dayDim; }
      else if (p.dk > 0.55 - 0.35 * day || edge < 0.4) { spr = SP.cLit; al = 0.34 + 0.2 * day; }
      else { spr = dayLit ? SP.cLit : SP.cMid; al = 0.36 * (1 - 0.3 * day); }
      ctx.globalAlpha = Math.min(1, k * al * (0.55 + 0.45 * (1 - p.f * 0.4)));
      ctx.drawImage(spr, x - size, y - size * 0.62, size * 2, size * 1.24);
    };
    // 漏斗的身：一层一层横切的云，两缘稍暗、中间被光照亮（以缓存的渐变缩放而画）
    if (!WG.ctx || WG.ctx !== ctx) {
      WG.ctx = ctx;
      const mk = (dk, md, lt, ea, ca) => {
        const gr = ctx.createLinearGradient(-1, 0, 1, 0);
        gr.addColorStop(0, rgba(dk, 0)); gr.addColorStop(0.1, rgba(dk, ea)); gr.addColorStop(0.3, rgba(md, 0.45));
        gr.addColorStop(0.5, rgba(lt, ca)); gr.addColorStop(0.7, rgba(md, 0.45)); gr.addColorStop(0.9, rgba(dk, ea)); gr.addColorStop(1, rgba(dk, 0));
        return gr;
      };
      WG.night = mk([22, 24, 40], [86, 88, 114], [236, 226, 204], 0.55, 0.42);
      WG.day = mk([188, 184, 180], [236, 232, 224], [255, 250, 236], 0.32, 0.5);
    }
    {
      const S2 = g.P ? 36 : 50, m0 = ctx.getTransform();
      for (let pass = 0; pass < 2; pass++) {
        const a = pass ? day : 1 - day;
        if (a < 0.02) continue;
        ctx.fillStyle = pass ? WG.day : WG.night;
        ctx.globalAlpha = Math.min(1, k * a * 0.85);
        for (let i = 0; i < S2; i++) {
          const f = (i + 0.5) / S2;
          if (f > grow) break;
          const r = rAt(f), cx = whirlAxis(g, f, k);
          const ya = Math.round(g.top + g.H * i / S2), yb = Math.round(g.top + g.H * (i + 1) / S2);
          ctx.setTransform(m0); ctx.translate(cx, 0); ctx.scale(r, 1);
          ctx.fillRect(-1, ya, 2, yb - ya);
        }
      }
      ctx.setTransform(m0);
      ctx.globalAlpha = 1;
    }
    for (let i = 0; i < n; i++) puffAt(list[i], false);
    // 其中的光（耶和华从旋风中回答——只有光与声，不画形像）：白昼也亮
    ctx.globalCompositeOperation = 'lighter';
    const botY = g.top + g.H * grow;
    beamLine(ctx, SP.beam, whirlAxis(g, 0.08, k), g.top + g.H * 0.08, whirlAxis(g, grow, k), botY, g.Rb * 5 + 10, k * (0.62 + 0.2 * night) * br);
    beamLine(ctx, SP.beamGold, whirlAxis(g, 0.05, k), g.top, whirlAxis(g, grow, k), botY, g.Rt * 0.45, k * (0.3 + 0.12 * night) * br);
    glowAt(ctx, SP.pale, whirlAxis(g, 0.5 * grow, k), g.top + g.H * 0.5 * grow, g.Rt * 0.3, k * (0.34 + 0.2 * night) * br);
    glowAt(ctx, SP.gold, whirlAxis(g, 0.25, k), g.top + g.H * 0.25, g.Rt * 0.6, k * (0.26 + 0.2 * night) * br);
    // 漏斗内缘的暖白光边：看得出光在旋风里面
    {
      const N = 30, L = [], R = [];
      for (let i = 0; i <= N; i++) {
        const f = 0.04 + (grow - 0.04) * i / N, r = rAt(f) * 0.62, cx = whirlAxis(g, f, k), y = g.top + g.H * f;
        L.push([cx - r, y]); R.push([cx + r, y]);
      }
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const [lw, al] of [[Math.max(6, 9 * W.unit), 0.1], [Math.max(1.4, 2 * W.unit), 0.34]]) {
        ctx.strokeStyle = rgba([255, 238, 206], k * al * br * (0.8 + 0.4 * day));
        ctx.lineWidth = lw;
        for (const E of [L, R]) { ctx.beginPath(); E.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); }
      }
    }
    // 云中的电光（装饰）
    if (W.lv.storm > 0.3 && k > 0.4) {
      const ti = Math.floor(W.t * 0.37), ph = U.fract(W.t * 0.37);
      if (ph < 0.05 || (ph > 0.12 && ph < 0.14)) {
        const f = 0.12 + 0.4 * hsh(ti), yy = g.top + g.H * f;
        glowAt(ctx, SP.white, whirlAxis(g, f, k) + (hsh(ti + 3) - 0.5) * g.Rt * (1 - f), yy, g.Rt * 0.45, 0.55 * k);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < n; i++) puffAt(list[i], true);
    // 绕轴盘旋的几道光带：看得出漏斗的形与它的转动
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const bandC = U.mixRGB([222, 218, 246], [255, 248, 230], day);
    for (let bd = 0; bd < 4; bd++) {
      const M2 = 56;
      let pen = false;
      ctx.beginPath();
      for (let i = 0; i <= M2; i++) {
        const f = 0.03 + (grow - 0.03) * i / M2;
        const ang = -W.t * 1.4 + bd * TAU / 4 + f * 5.2;
        const sn = Math.sin(ang), r = rAt(f) * 0.86;
        if (sn < 0.05) { pen = false; continue; }
        const x = whirlAxis(g, f, k) + Math.cos(ang) * r, y = g.top + g.H * f + sn * r * 0.2;
        if (pen) ctx.lineTo(x, y); else { ctx.moveTo(x, y); pen = true; }
      }
      ctx.strokeStyle = rgba(bandC, 0.6 * k * (0.7 + 0.3 * br));
      ctx.lineWidth = Math.max(1.8, 3 * W.unit) * (g.P ? 0.8 : 1);
      ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba([255, 236, 196], 0.14 * k);
      ctx.lineWidth = Math.max(5, 9 * W.unit) * (g.P ? 0.8 : 1);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    // 旋转的细纹
    ctx.strokeStyle = rgba(U.mixRGB([170, 176, 206], [250, 246, 236], day), 0.28 * k);
    ctx.lineWidth = Math.max(1, 1.3 * W.unit);
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const f = 0.06 + 0.9 * i / 25;
      if (f > grow) break;
      const r = rAt(f), cx = whirlAxis(g, f, k), y = g.top + g.H * f, ry = r * 0.2;
      const a0 = ((W.t * (0.7 + 2.4 * f) + i * 1.9) % TAU + TAU) % TAU;
      const lo = Math.max(0.15, a0 % Math.PI), hi = Math.min(Math.PI - 0.15, lo + 1.1);
      if (hi > lo) { ctx.moveTo(cx + Math.cos(lo) * r * 0.9, y + Math.sin(lo) * ry * 0.9); ctx.ellipse(cx, y, r * 0.9, ry * 0.9, 0, lo, hi); }
    }
    ctx.stroke();
    // 旋风脚下的尘土（淡）
    if (grow > 0.95) {
      const bx = whirlAxis(g, 1, k), s = LS(1);
      for (let i = 0; i < 12; i++) {
        const a = W.t * 2.2 + i * TAU / 12, rr = g.Rb * (2.4 + 0.8 * Math.sin(i * 1.3));
        glowAt(ctx, SP.dust, bx + Math.cos(a) * rr, g.base - 4 * s + Math.sin(a) * rr * 0.2 - 6 * s * hsh(i), 14 * s, k * 0.3);
      }
    }
    // 绕行的金色微光（不再是黑色的碎屑）
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 30; i++) {
      const f = 0.12 + 0.86 * hsh(i * 5.1);
      if (f > grow) continue;
      const r = rAt(f), a = W.t * (1 + 2.5 * f) + i * 2.1;
      const x = whirlAxis(g, f, k) + Math.cos(a) * r * 0.95, y = g.top + g.H * f + Math.sin(a) * r * 0.2;
      glowAt(ctx, SP.gold, x, y, (2.2 + 2.4 * hsh(i)) * Math.max(0.8, W.unit), k * (0.45 + 0.35 * Math.sin(a) ));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  }

  // ── 地的根基、准绳、角石（38:4–6）──
  function drawFound(ctx) {
    const k = W.lv.ybFound;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round';
    for (let l = 0; l < 3; l++) {
      const reach = c01(k * 1.4 - l * 0.15);
      if (reach <= 0) continue;
      const step = Math.max(6, W.w / 140);
      ctx.strokeStyle = rgba([255, 220, 150], (0.55 - l * 0.08) * k);
      ctx.lineWidth = l === 2 ? 1.6 : 1.1;
      ctx.beginPath();
      let started = false;
      for (let x = 0; x <= W.w * reach; x += step) {
        if (!W.hasLand(l, x, 1)) { started = false; continue; }
        const y = W.ridgeY(l, x);
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // 尺度的刻痕
      ctx.strokeStyle = rgba([255, 230, 170], 0.3 * k);
      ctx.beginPath();
      for (let x = step * 6; x <= W.w * reach; x += step * 12) {
        if (!W.hasLand(l, x, 1)) continue;
        const y = W.ridgeY(l, x);
        ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5);
      }
      ctx.stroke();
    }
    // 准绳：自远处拉到旋风脚下
    const g = whirlGeo(), bx = whirlAxis(g, 1, W.lv.ybWhirl), by = g.base;
    const lg = ctx.createLinearGradient(0, 0, bx, 0);
    lg.addColorStop(0, 'rgba(255,230,170,0)'); lg.addColorStop(0.6, rgba([255, 234, 180], 0.3 * k)); lg.addColorStop(1, rgba([255, 240, 200], 0.6 * k));
    ctx.strokeStyle = lg;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0.1 * W.w, W.horizonY - 0.004 * W.h); ctx.lineTo(bx, by - 2); ctx.stroke();
    // 角石
    const s = LS(1) * 1.4, cs = 7 * s;
    glowAt(ctx, SP.gold, bx, by - cs * 0.5, cs * 6, k * 0.55);
    ctx.fillStyle = rgba([255, 226, 170], 0.55 * k);
    ctx.beginPath();
    ctx.moveTo(bx - cs, by); ctx.lineTo(bx - cs, by - cs); ctx.lineTo(bx - cs * 0.4, by - cs * 1.35); ctx.lineTo(bx + cs * 1.1, by - cs * 1.35); ctx.lineTo(bx + cs * 1.1, by - cs * 0.3); ctx.lineTo(bx + cs * 0.5, by);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba([255, 244, 214], 0.8 * k); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bx - cs, by - cs); ctx.lineTo(bx + cs * 0.5, by - cs); ctx.lineTo(bx + cs * 1.1, by - cs * 1.35); ctx.moveTo(bx + cs * 0.5, by - cs); ctx.lineTo(bx + cs * 0.5, by); ctx.stroke();
    glowAt(ctx, SP.pale, bx, by - cs * 0.6, cs * 1.6, k * 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 晨星一同歌唱（38:7）──
  const MSTARS_L = [[0.16, 0.44, 1.8], [0.1, 0.14, 1], [0.24, 0.24, 0.9], [0.33, 0.08, 1], [0.42, 0.2, 0.8], [0.5, 0.06, 1.1], [0.57, 0.3, 0.8], [0.63, 0.12, 1],
    [0.7, 0.26, 0.9], [0.76, 0.06, 0.8], [0.83, 0.18, 1.1], [0.9, 0.3, 0.8], [0.95, 0.1, 0.9], [0.3, 0.36, 0.7], [0.47, 0.4, 0.7], [0.05, 0.3, 0.8]];
  const MSTARS_P = [[0.18, 0.54, 1.8], [0.1, 0.36, 1], [0.3, 0.4, 0.9], [0.44, 0.34, 1], [0.58, 0.42, 0.8], [0.72, 0.36, 1.1], [0.86, 0.44, 0.8], [0.9, 0.34, 1],
    [0.66, 0.5, 0.9], [0.4, 0.5, 0.8], [0.24, 0.48, 1.1], [0.52, 0.55, 0.8], [0.8, 0.56, 0.9], [0.06, 0.46, 0.7], [0.34, 0.58, 0.7], [0.96, 0.5, 0.8]];
  function starFlare(ctx, x, y, r, c, a) {
    ctx.fillStyle = rgba(c, a);
    ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(c, a * 0.45);
    ctx.fillRect(x - r * 4, y - 0.5, r * 8, 1);
    ctx.fillRect(x - 0.5, y - r * 4, 1, r * 8);
    glowAt(ctx, SP.pale, x, y, r * 4, a * 0.4);
  }
  function drawMorning(ctx) {
    const k = W.lv.ybMorning;
    if (k < 0.01) return;
    SP || sprites();
    const L = port() ? MSTARS_P : MSTARS_L, n = L.length, dim = 1 - 0.7 * W.daylight;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const a = c01(k * n - i) * dim;
      if (a <= 0) continue;
      const q = L[i], x = q[0] * W.w, y = q[1] * W.h, r = (1.3 + q[2] * 1.3) * Math.max(0.8, W.unit);
      const sing = 0.8 + 0.2 * Math.sin(W.t * (1.6 + i * 0.13) + i * 1.7);
      starFlare(ctx, x, y, r * sing, i === 0 ? [255, 240, 200] : [236, 242, 255], a * sing);
      // 歌声：自星上一圈一圈荡开的光环
      const ph = U.fract(W.t * 0.35 + i * 0.137);
      ctx.strokeStyle = rgba([236, 240, 255], a * 0.22 * (1 - ph));
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r * (3 + ph * 14), 0, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：海（38:8–11）——冲出的海、云彩的衣服、光的界限
  // ════════════════════════════════════════════════════════════
  // 近地的岸线：每帧（或画面大小改变时）只取一次 61 个样点，之后按 y 查
  const SHORE = { t: -1, w: 0, h: 0, r: new Float32Array(61) };
  function shoreRows() {
    if (SHORE.t !== W.t || SHORE.w !== W.w || SHORE.h !== W.h) {
      for (let i = 0; i <= 60; i++) SHORE.r[i] = W.ridgeY(2, W.w * (0.2 + 0.4 * i / 60));
      SHORE.t = W.t; SHORE.w = W.w; SHORE.h = W.h;
    }
    return SHORE.r;
  }
  function shoreX(y) {
    // 近地在高度 y 处与海相接的 x（像素）；无则 null
    const r = shoreRows();
    for (let i = 0; i <= 60; i++) if (r[i] <= y) return W.w * (0.2 + 0.4 * i / 60);
    return null;
  }
  function drawSurge(ctx, pass) {
    const k = W.lv.ybSurge;
    if (k < 0.02) return;
    const hz = W.horizonY, a = W.waterlineY(0), b = W.waterlineY(1);
    const y0 = pass === 'seaFar' ? hz : pass === 'seaMid' ? a : b, y1 = pass === 'seaFar' ? a : pass === 'seaMid' ? b : W.h;
    if (!(y1 - y0 > 2)) return;
    const n = pass === 'seaNear' ? 7 : pass === 'seaMid' ? 5 : 3;
    const lit = 0.5 + 0.5 * W.daylight;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      // 浪一排一排自远处涌向岸边：一段一段翻起的白头
      const cyc = W.t * 0.14 + i / n, ph = U.fract(cyc), rnd0 = Math.floor(cyc) * 17.3 + i * 5.1 + (pass === 'seaNear' ? 0 : pass === 'seaMid' ? 40 : 80);
      const y = y0 + (y1 - y0) * ph, ss = W.seaScale(y) * (port() ? 1.5 : 1);
      const xEnd = shoreX(y) || W.w * 0.62;
      const env = Math.sin(ph * Math.PI) * k * lit;
      const m = 7;
      for (let j = 0; j < m; j++) {
        const hw = (34 + 60 * hsh(rnd0 + j * 3.7)) * ss;
        const xc = (hsh(rnd0 + j * 1.9) * 1.1 - 0.05) * W.w + W.t * 14 * ss;
        if (xc + hw > xEnd - 4 || xc - hw < -40) continue;
        const amp = (6 + 16 * k) * ss * (0.6 + 0.4 * hsh(rnd0 + j));
        const yy = y + (hsh(rnd0 + j * 2.3) - 0.5) * (y1 - y0) / n;
        ctx.beginPath();
        ctx.moveTo(xc - hw, yy); ctx.quadraticCurveTo(xc - hw * 0.1, yy - amp * 1.4, xc + hw * 0.45, yy - amp * 0.3);
        ctx.strokeStyle = rgba([226, 236, 250], 0.7 * env);
        ctx.lineWidth = Math.max(1, 2.2 * ss);
        ctx.stroke();
        ctx.strokeStyle = rgba([214, 228, 246], 0.1 * env);
        ctx.lineWidth = Math.max(3, 9 * ss);
        ctx.stroke();
      }
    }
    // 浪拍在岸上：白沫一团一团涌起（有了界限之后便低下去）
    if (pass === 'seaNear') drawCrests(ctx, k, lit);
    if (pass === 'seaNear') {
      const lim = W.lv.ybBound;
      for (let i = 0; i < 10; i++) {
        const y = b + (W.h - b) * (0.08 + 0.095 * i);
        const x = shoreX(y);
        if (x == null) continue;
        const ss = W.seaScale(y) * (port() ? 1.5 : 1), ph = U.fract(W.t * 0.45 + i * 0.37);
        const hgt = (22 + 46 * k) * ss * Math.sin(ph * Math.PI) * (1 - 0.7 * lim);
        glowAt(ctx, SP.white, x - 6 * ss, y - hgt * 0.5, (10 + 14 * k) * ss + hgt * 0.4, 0.4 * k * lit * (1 - ph * 0.6));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }
  // 一排一排翻滚的浪头涌向近岸（浪脊与岸平行，向岸推进）；有了界限（38:10–11）之后，浪到那道金线便止住、碎成白沫
  const boundGap = ss => 12 * ss;              // 金线离岸的距离（在水里）
  function drawCrests(ctx, k, lit) {
    const n = 5, bound = W.lv.ybBound, env0 = Math.min(1, k * 1.7);
    if (env0 < 0.02) return;
    const b = W.waterlineY(1), P = port(), sK = P ? 1.5 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 0; i < n; i++) {
      const cyc = W.t / 5.6 + i / n, ph = U.fract(cyc), rnd = Math.floor(cyc) * 13.7 + i * 3.1;
      const yc = b + (W.h - b) * (0.22 + 0.6 * hsh(rnd)), hl = (W.h - b) * (0.14 + 0.1 * hsh(rnd + 1.3));
      const sc = W.seaScale(yc) * sK;
      const dFree = lerp(P ? 150 : 250, -12, eio(ph)), dStop = bound > 0.5 ? 12 + 9 : -12;
      const d = Math.max(dFree, dStop), over = dFree < dStop ? c01((dStop - dFree) / 40) : 0;
      const env = env0 * Math.min(1, ph * 5) * (1 - over) * (0.75 + 0.25 * lit);
      if (env < 0.01) continue;
      const pts = [];
      for (let q = 0; q <= 14; q++) {
        const yy = yc - hl + 2 * hl * q / 14, sx = shoreX(yy);
        if (sx == null) continue;
        const ss = W.seaScale(yy) * sK;
        pts.push([sx - d * ss + Math.sin(q * 1.3 + rnd + W.t * 1.7) * 2.5 * ss, yy, q / 14]);
      }
      if (pts.length < 3) continue;
      const line = (from, to, lw, col, al) => {
        ctx.strokeStyle = rgba(col, al); ctx.lineWidth = lw;
        ctx.beginPath(); let st = false;
        for (const p of pts) { if (p[2] < from || p[2] > to) continue; if (st) ctx.lineTo(p[0], p[1]); else { ctx.moveTo(p[0], p[1]); st = true; } }
        ctx.stroke();
      };
      line(0, 1, Math.max(4, 12 * sc), [210, 228, 250], 0.14 * env);
      line(0.05, 0.95, Math.max(1, 1.6 * sc), [240, 246, 255], 0.55 * env);
      line(0.22, 0.78, Math.max(1.6, 3.6 * sc), [248, 251, 255], 0.9 * env);
    }
    // 浪撞在金线上碎开的白沫（有了界限之后）
    if (bound > 0.3) {
      const k2 = env0 * c01((bound - 0.3) / 0.4);
      for (let i = 0; i < 12; i++) {
        const yy = b + (W.h - b) * (0.12 + 0.075 * i), sx = shoreX(yy);
        if (sx == null) continue;
        const ss = W.seaScale(yy) * sK, ph = U.fract(W.t * 0.5 + hsh(i * 3.3));
        glowAt(ctx, SP.white, sx - boundGap(ss) - 8 * ss, yy - ph * 10 * ss, (6 + 10 * ph) * ss, k2 * 0.5 * Math.sin(ph * Math.PI));
      }
    }
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  }
  // 海岸上与金线前的白沫：本卷自己的柔和水珠（纯装饰，不属于世界的状态）
  const DROPS = [];
  function spray(dt) {
    for (let i = DROPS.length - 1; i >= 0; i--) {
      const d = DROPS[i];
      d.life += dt;
      if (d.life >= d.max) { DROPS.splice(i, 1); continue; }
      d.vy += d.grav * dt; d.vx *= 1 - 0.9 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
    }
    const k = W.lv.ybSurge;
    if (k < 0.25 || W.replaying || DROPS.length > 160 || Math.random() > 0.5 * k) return;
    const b = W.waterlineY(1), bound = W.lv.ybBound;
    let x, y;
    if (Math.random() < 0.7) { y = b + (W.h - b) * (0.08 + 0.85 * Math.random()); x = shoreX(y); }
    else { const sp = W.landSpan(1, 2); if (!sp) return; x = sp[0] + Math.random() * 12; y = b; }
    if (x == null) return;
    const ss = W.seaScale(y) * (port() ? 1.5 : 1), up = (0.5 + 0.5 * bound) * Math.min(1, k * 1.4);
    if (bound > 0.5 && y > b + 2) x -= boundGap(ss) + 6 * ss;      // 浪撞在金线上
    for (let i = 0; i < 6; i++) {
      DROPS.push({ x: x + (Math.random() - 0.5) * 10 * ss, y, vx: -20 * ss - Math.random() * 40 * ss, vy: -(70 + Math.random() * 150) * ss * up,
        life: 0, max: 0.8 + Math.random() * 0.7, r: (2.4 + Math.random() * 3) * Math.max(0.8, ss), grav: 240 * ss });
    }
  }
  function drawDrops(ctx) {
    if (!DROPS.length) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    for (const d of DROPS) { const u = d.life / d.max; glowAt(ctx, SP.white, d.x, d.y, d.r * (1 + 0.6 * u), 0.55 * (1 - u) * (0.5 + 0.5 * W.daylight)); }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawSwaddle(ctx) {
    const k = W.lv.ybSwaddle;
    if (k < 0.01) return;
    SP || sprites();
    const hz = W.horizonY, P = port(), w = P ? 1.1 * W.w : 0.72 * W.w, h = (P ? 0.22 : 0.3) * W.h;
    ctx.globalAlpha = k * 0.95;
    ctx.drawImage(SP.bank, -0.08 * W.w, hz - h * 0.8, w, h);
    ctx.globalAlpha = k * 0.7;
    ctx.drawImage(SP.bank2, -0.02 * W.w, hz - h * 0.55, w * 0.85, h * 0.7);
    // 幽暗的布：贴着海面的一带黑
    ctx.globalAlpha = k * 0.8;
    ctx.drawImage(SP.soot, -0.1 * W.w, hz - h * 0.28, w * 0.95, h * 0.56);
    ctx.globalAlpha = 1;
  }
  function drawBound(ctx) {
    const k = W.lv.ybBound;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const tw = 0.85 + 0.15 * Math.sin(W.t * 2);
    const glowLine = (pts, frac, w) => {
      const n = Math.floor(pts.length * c01(frac));
      if (n < 2) return;
      for (const [lw, a] of [[22 * w, 0.12], [7 * w, 0.32], [3 * w, 0.95]]) {
        ctx.strokeStyle = rgba(a > 0.5 ? [255, 250, 232] : [255, 222, 160], a * k * tw);
        ctx.lineWidth = lw * Math.max(0.8, W.unit);
        ctx.beginPath();
        for (let i = 0; i < n; i++) (i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]));
        ctx.stroke();
      }
      const e = pts[n - 1];
      glowAt(ctx, SP.gold, e[0], e[1], 22 * w * Math.max(0.8, W.unit), 0.6 * k * (frac < 1 ? 1 : 0.4));
    };
    // 近岸：离岸一点、在水里，自下而上
    const near = [];
    for (let i = 0; i <= 40; i++) {
      const y = W.h - (W.h - W.waterlineY(1) - 2) * (i / 40), x = shoreX(y);
      if (x != null) near.push([x - boundGap(W.seaScale(y) * (port() ? 1.5 : 1)), y]);
    }
    glowLine(near, k * 1.3, 1.2);
    // 中景与远景的岛：沿水线
    for (const l of [1, 0]) {
      const sp = W.landSpan(l, 1);
      if (!sp) continue;
      const wl = W.waterlineY(l) - 1, step = Math.max(6, W.w / 120);
      let pts = [];
      const flush = () => { if (pts.length > 2) glowLine(pts, k * 1.3 - (l === 1 ? 0.2 : 0.35), l === 1 ? 0.9 : 0.6); pts = []; };
      for (let x = sp[0]; x <= W.w + 2; x += step) { if (W.hasLandBase(l, x, 1)) pts.push([x, wl]); else flush(); }
      flush();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }

  // ════════════════════════════════════════════════════════════
  //  画：昴星、参星、北斗（38:31–32）
  // ════════════════════════════════════════════════════════════
  const PLEI = [[0, 0], [-1.2, 0.15], [-1.3, -0.25], [0.95, -0.12], [0.55, 0.52], [0.72, -0.58], [1.22, -0.72]];
  const ORI = { s: [[-1.0, -1.25], [1.0, -1.05], [-0.28, 0.08], [0, 0], [0.28, -0.08], [-0.82, 1.4], [1.02, 1.22], [0.05, -1.85]],
    e: [[0, 7], [7, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]] };
  const DIP = { s: [[0, 0], [0.05, 0.62], [0.82, 0.72], [0.92, 0.16], [1.55, 0.04], [2.12, 0.1], [2.72, 0.5]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]] };
  function consLayout() {
    const P = port(), m = M();
    return P
      ? { plei: [0.62 * W.w, 0.33 * W.h, 0.016 * m], ori: [0.35 * W.w, 0.45 * W.h, 0.075 * m], dip: [0.2 * W.w, 0.27 * W.h, 0.055 * m], pole: [0.12 * W.w, 0.21 * W.h] }
      : { plei: [0.45 * W.w, 0.1 * W.h, 0.016 * m], ori: [0.62 * W.w, 0.25 * W.h, 0.075 * m], dip: [0.17 * W.w, 0.12 * W.h, 0.06 * m], pole: [0.1 * W.w, 0.04 * W.h] };
  }
  function drawCons(ctx) {
    const k = W.lv.ybCons * (1 - 0.85 * W.lv.storm) * clamp(W.night * 1.3 + W.dusk * 0.2, 0, 1);
    if (k < 0.01) return;
    SP || sprites();
    const Lo = consLayout(), star = [236, 242, 255];
    ctx.globalCompositeOperation = 'lighter';
    // 昴星与系住它的光索
    const [px, py, ps] = Lo.plei;
    for (let i = 0; i < PLEI.length; i++) starFlare(ctx, px + PLEI[i][0] * ps, py + PLEI[i][1] * ps, 1.5 + (i ? 0 : 0.6), [220, 232, 255], k * (0.8 + 0.2 * Math.sin(W.t * 2 + i)));
    glowAt(ctx, SP.blue, px, py, ps * 3.5, k * 0.25);
    const kn = W.lv.ybKnot;
    if (kn > 0.01) {
      ctx.strokeStyle = rgba([255, 226, 160], 0.7 * k);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const R = ps * 2.2, tight = 1 - 0.18 * c01((kn - 0.8) / 0.2);
      const a1 = -Math.PI / 2 + TAU * c01(kn / 0.85);
      for (let a = -Math.PI / 2; a <= a1; a += 0.1) {
        const rr = R * tight * (1 + 0.06 * Math.sin(a * 5));
        const x = px + Math.cos(a) * rr * 1.15, y = py + Math.sin(a) * rr * 0.9;
        if (a === -Math.PI / 2) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (kn > 0.85) {           // 结
        const kx = px, ky = py - R * tight * 0.9, bb = c01((kn - 0.85) / 0.15);
        ctx.beginPath();
        ctx.ellipse(kx - ps * 0.5 * bb, ky - ps * 0.2, ps * 0.5 * bb, ps * 0.28 * bb, -0.4, 0, TAU);
        ctx.ellipse(kx + ps * 0.5 * bb, ky - ps * 0.2, ps * 0.5 * bb, ps * 0.28 * bb, 0.4, 0, TAU);
        ctx.stroke();
        glowAt(ctx, SP.gold, kx, ky, ps * 1.4, k * 0.5 * bb);
      }
    }
    // 参星：带子先系上，后解开
    const [ox, oy, os] = Lo.ori, sp = ORI.s.map(q => [ox + q[0] * os, oy + q[1] * os]);
    ctx.strokeStyle = rgba([200, 214, 255], 0.22 * k); ctx.lineWidth = 1;
    ctx.beginPath();
    for (const e of ORI.e) { ctx.moveTo(sp[e[0]][0], sp[e[0]][1]); ctx.lineTo(sp[e[1]][0], sp[e[1]][1]); }
    ctx.stroke();
    const bt = W.lv.ybBelt;
    sp.forEach((p, i) => {
      const belt = i >= 2 && i <= 4;
      starFlare(ctx, p[0], p[1], i === 0 ? 2.4 : i === 6 ? 2.2 : belt ? 2.2 : 1.5, i === 0 ? [255, 206, 170] : i === 6 ? [210, 226, 255] : star, k);
      if (belt) glowAt(ctx, SP.blue, p[0], p[1], os * 0.28, k * 0.35);
    });
    if (bt > 0.01) {
      // 带子先系上（一圈金线绕着三颗星），后解开：两段金弧向两边漂开，仍留在天上
      const tie = c01(bt / 0.45), loose = eio(c01((bt - 0.55) / 0.45));
      const bc = sp[3], ang = Math.atan2(sp[4][1] - sp[2][1], sp[4][0] - sp[2][0]);
      const bw = os * 0.55 * tie, bh = os * 0.13;
      ctx.save();
      ctx.translate(bc[0], bc[1]); ctx.rotate(ang);
      ctx.lineCap = 'round';
      for (const [lw, al] of [[5, 0.16], [1.8, 0.8]]) {
        ctx.strokeStyle = rgba([255, 226, 160], al * k * (1 - loose * 0.25));
        ctx.lineWidth = lw * Math.max(0.8, W.unit);
        if (loose < 0.01) { ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, TAU); ctx.stroke(); }
        else {
          const off = loose * os * 0.75, dy = loose * os * 0.28, rot = 0.35 * loose;
          ctx.beginPath(); ctx.ellipse(-off, dy, bw * 0.6, bh, -rot, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(off, -dy, bw * 0.6, bh, -rot, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
        }
      }
      ctx.restore();
      ctx.lineCap = 'butt';
    }
    // 北斗与随它的众星，绕北极缓缓转动
    const [dx, dy, ds] = Lo.dip, [qx, qy] = Lo.pole, rot = -0.35 * W.lv.ybWheel;
    const rotP = (x, y) => { const c = Math.cos(rot), s = Math.sin(rot), vx = x - qx, vy = y - qy; return [qx + vx * c - vy * s, qy + vx * s + vy * c]; };
    const dp = DIP.s.map(q => rotP(dx + q[0] * ds, dy + q[1] * ds));
    ctx.strokeStyle = rgba([200, 214, 255], 0.25 * k); ctx.lineWidth = 1;
    ctx.beginPath();
    for (const e of DIP.e) { ctx.moveTo(dp[e[0]][0], dp[e[0]][1]); ctx.lineTo(dp[e[1]][0], dp[e[1]][1]); }
    ctx.stroke();
    dp.forEach(p => starFlare(ctx, p[0], p[1], 1.7, star, k));
    starFlare(ctx, qx, qy, 1.6, [255, 246, 220], k * 0.9);
    const wk = W.lv.ybWheel;
    if (wk > 0.01) {
      for (let i = 0; i < 14; i++) {
        const p = rotP(dx + (hsh(i * 3.1) * 4 - 1) * ds, dy + (hsh(i * 5.7) * 2.4 - 0.7) * ds);
        starFlare(ctx, p[0], p[1], 0.9, star, k * c01(wk * 3 - i * 0.1) * 0.7);
      }
      // 转动的弧
      ctx.strokeStyle = rgba([220, 230, 255], 0.14 * k * c01(wk * 4));
      ctx.beginPath();
      const R = Math.hypot(dx - qx, dy - qy);
      const a0 = Math.atan2(dy - qy, dx - qx);
      ctx.arc(qx, qy, R, a0, a0 + rot, rot < 0);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：大鹰（39:27）
  // ════════════════════════════════════════════════════════════
  function eaglePose(e) {
    const P = port(), top = cragGeo().top;
    const nest = [top[0], top[1] - 3 * LS(1)];
    const A = [-0.06 * W.w, (P ? 0.46 : 0.26) * W.h], B = [(P ? 0.4 : 0.42) * W.w, (P ? 0.4 : 0.22) * W.h];
    const cx = (P ? 0.6 : 0.64) * W.w, R0 = (P ? 0.22 : 0.13) * W.w;
    if (e < 0.2) {
      const u = e / 0.2, x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u) + Math.sin(u * Math.PI) * 0.03 * W.h;
      return { x, y, dir: 1, spread: 1, flap: u * 6, bank: 0 };
    }
    if (e < 0.72) {
      const u = (e - 0.2) / 0.52;
      const a = Math.PI + u * TAU * 1.6, R = R0 * (1 - 0.45 * u);
      const cy = lerp(P ? 0.42 : 0.26, P ? 0.36 : 0.13, u) * W.h;
      const ccx = lerp(B[0] + R0, cx, c01(u * 3));
      const x = ccx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.28;
      return { x, y, dir: -Math.sin(a) >= 0 ? 1 : -1, spread: 1, flap: u < 0.3 ? u * 20 : 0, bank: Math.cos(a) * 0.25 };
    }
    const u = (e - 0.72) / 0.28;
    const a = Math.PI + TAU * 1.6, R = R0 * 0.55;
    const s0 = [cx + Math.cos(a) * R, lerp(P ? 0.42 : 0.26, P ? 0.36 : 0.13, 1) * W.h + Math.sin(a) * R * 0.28];
    const ue = eio(u);
    return { x: lerp(s0[0], nest[0], ue), y: lerp(s0[1], nest[1], ue) - Math.sin(u * Math.PI) * 0.03 * W.h, dir: nest[0] >= s0[0] ? 1 : -1, spread: u > 0.9 ? 1 - (u - 0.9) * 10 : 1, flap: u > 0.8 ? (u - 0.8) * 25 : 0, bank: 0, perch: u >= 1 };
  }
  function drawEagle(ctx) {
    const e = W.lv.ybEagle;
    if (e < 0.003) return;
    const p = eaglePose(e), span = (port() ? 0.1 : 0.055) * W.w * (p.perch ? 0.5 : 1);
    const x = p.x, y = p.y, d = p.dir;
    const body = [70, 52, 38], head = [178, 138, 84];
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(d, 1);
    ctx.rotate(p.bank * 0.4);
    const sh = W.shadeCSS(body, 0.2), hc = W.shadeCSS(head, 0.2, 1, 0.1);
    if (p.perch || p.spread < 0.05) {
      // 立在窝上：收起翅膀
      const h = span * 0.9;
      ctx.fillStyle = sh;
      ctx.beginPath(); ctx.ellipse(0, -h * 0.4, h * 0.2, h * 0.42, 0.12, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-h * 0.12, -h * 0.05); ctx.lineTo(-h * 0.28, h * 0.12); ctx.lineTo(-h * 0.02, h * 0.02); ctx.closePath(); ctx.fill();
      ctx.fillStyle = hc;
      ctx.beginPath(); ctx.arc(h * 0.06, -h * 0.84, h * 0.13, 0, TAU); ctx.fill();
      ctx.fillStyle = W.shadeCSS([232, 196, 90], 0.2);
      ctx.beginPath(); ctx.moveTo(h * 0.16, -h * 0.88); ctx.quadraticCurveTo(h * 0.3, -h * 0.86, h * 0.24, -h * 0.76); ctx.lineTo(h * 0.16, -h * 0.8); ctx.closePath(); ctx.fill();
    } else {
      const flap = p.flap > 0 ? Math.sin(p.flap * TAU * 0.5) : 0;
      const s = span / 2, lift = flap * s * 0.35;
      ctx.fillStyle = sh;
      // 两翼（远翼稍暗）
      for (const side of [-1, 1]) {
        const tipY = -lift * (side > 0 ? 1 : 0.8) + (side > 0 ? 0 : s * 0.04);
        ctx.fillStyle = side < 0 ? W.shadeCSS(mix(body, [20, 16, 12], 0.3), 0.2) : sh;
        ctx.beginPath();
        ctx.moveTo(-s * 0.08, 0);
        ctx.quadraticCurveTo(-s * 0.1, side * -s * 0.02 + tipY * 0.5 - s * 0.12, -s * 0.18, tipY - s * 0.02 + side * 0);
        // 飞羽的指
        const fx0 = -s * 0.18, fy0 = tipY;
        const len = s * p.spread;
        for (let f = 0; f < 5; f++) {
          const ang = -Math.PI / 2 - 0.35 + f * 0.17;
          const fx = fx0 + Math.cos(ang) * len * (0.95 - f * 0.05) * (side > 0 ? 1 : 0.92);
          const fy = fy0 + Math.sin(ang) * len * 0.16 - len * 0.02 * f;
          ctx.lineTo(fx - len * 0.02, fy); ctx.lineTo(fx + len * 0.03, fy + len * 0.03);
        }
        ctx.quadraticCurveTo(s * 0.1, tipY * 0.4 + s * 0.08, s * 0.16, s * 0.02);
        ctx.closePath();
        // 翼向两侧展开：以 x 轴为身长方向，翼向 ±y（画面上下）——换成左右展开：旋转 90°
        ctx.save();
        ctx.restore();
        ctx.fill();
      }
      // 身、尾、头
      ctx.fillStyle = sh;
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.3, s * 0.085, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-s * 0.26, 0); ctx.lineTo(-s * 0.5, -s * 0.08); ctx.lineTo(-s * 0.52, s * 0.08); ctx.closePath(); ctx.fill();
      ctx.fillStyle = hc;
      ctx.beginPath(); ctx.ellipse(s * 0.32, -s * 0.02, s * 0.08, s * 0.06, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = W.shadeCSS([232, 196, 90], 0.2);
      ctx.beginPath(); ctx.moveTo(s * 0.39, -s * 0.03); ctx.quadraticCurveTo(s * 0.47, -s * 0.02, s * 0.44, s * 0.03); ctx.lineTo(s * 0.38, s * 0.01); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：河马（40:15–24）——卧在芦苇隐密处和水洼子里
  // ════════════════════════════════════════════════════════════
  function beheGeo() {
    const P = port(), wl = W.waterlineY(1), L = (P ? 0.34 : 0.155) * W.w;
    return { P, wl, L, x: (P ? 0.6 : X.behe) * W.w, H: L * 0.42 };
  }
  function drawBehemoth(ctx) {
    const b = W.lv.ybBehe;
    if (b < 0.005) return;
    const g = beheGeo(), { wl, L, x, H } = g;
    const rise = eio(c01(b / 0.8)), head = eio(c01((b - 0.45) / 0.55));
    const flood = W.lv.ybFlood;
    const water = wl - flood * H * 0.42;               // 水涨到它口边（40:23）
    const base = wl + H * 0.25 + (1 - rise) * H * 1.3; // 腹下（在水下）
    const dep = 0.18, lit = 0.3 + 0.7 * W.daylight;
    const col = [88, 78, 82], belly = [132, 116, 110], dk = [42, 36, 40], hi = [214, 198, 182];
    const hl = -0.16 * H * head;                        // 头抬起
    const P = (u, v) => [x + u * L * 0.86, base + v * H];
    const body = new Path2D();
    {
      const m = (u, v) => P(u, v), mv = (u, v) => { const q = m(u, v); body.moveTo(q[0], q[1]); };
      const bz = (a1, b1, a2, b2, a3, b3) => { const c1 = m(a1, b1), c2 = m(a2, b2), e = m(a3, b3); body.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], e[0], e[1]); };
      const qd = (a1, b1, a2, b2) => { const c1 = m(a1, b1), e = m(a2, b2); body.quadraticCurveTo(c1[0], c1[1], e[0], e[1]); };
      const hq = (a1, b1, a2, b2) => { const c1 = m(a1, b1), e = m(a2, b2); body.quadraticCurveTo(c1[0], c1[1] + hl, e[0], e[1] + hl); };
      mv(-0.42, 0.4);
      bz(-0.52, -0.2, -0.5, -1.0, -0.3, -1.18);          // 圆圆的后臀
      bz(-0.12, -1.34, 0.12, -1.3, 0.24, -1.12);          // 宽厚的背
      qd(0.3, -1.02, 0.33, -1.0);                         // 颈
      hq(0.38, -1.06, 0.45, -1.04);                       // 额与眼上的隆起
      hq(0.56, -0.98, 0.64, -0.86);                       // 口鼻的上沿
      hq(0.7, -0.9, 0.74, -0.74);                         // 鼻孔处的隆起
      hq(0.8, -0.56, 0.74, -0.38);                        // 方阔的吻
      hq(0.66, -0.26, 0.5, -0.3);                         // 下颌
      qd(0.38, -0.3, 0.3, -0.18);
      bz(0.2, 0.1, -0.2, 0.45, -0.42, 0.4);               // 腹
      body.closePath();
    }
    ctx.save();
    ctx.beginPath(); ctx.rect(x - L, -10, L * 2.2, wl + 11); ctx.clip();
    // 尾：短而粗，摇动如香柏树（40:17）
    const sway = Math.sin(W.t * 0.55) * 0.35;
    {
      const [tx, ty] = P(-0.46, -0.78), len = 0.13 * L;
      ctx.strokeStyle = W.shadeCSS(mix(col, dk, 0.25), dep); ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(2, 0.045 * L);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - len * 0.6, ty - len * 0.1, tx - len * Math.cos(0.9 + sway), ty + len * Math.sin(0.9 + sway)); ctx.stroke();
      ctx.lineWidth = Math.max(1.2, 0.022 * L);
      ctx.beginPath(); ctx.moveTo(tx - len * 0.5, ty); ctx.lineTo(tx - len * 1.08 * Math.cos(0.9 + sway), ty + len * 1.08 * Math.sin(0.9 + sway)); ctx.stroke();
    }
    // 腿（粗短如柱，半在水中）
    ctx.fillStyle = W.shadeCSS(mix(col, dk, 0.2), dep);
    ctx.beginPath();
    for (const lx of [-0.34, -0.2, 0.1, 0.22]) { const q = P(lx, -0.35); ctx.rect(q[0], q[1], L * 0.1, H * 1.1); }
    ctx.fill();
    // 身躯
    ctx.fillStyle = W.shadeCSS(col, dep);
    ctx.fill(body);
    // 腹下稍亮、背上稍暗：显出圆厚的体量
    ctx.save();
    ctx.clip(body);
    const gr = ctx.createLinearGradient(0, base - H * 1.3, 0, base + H * 0.2);
    gr.addColorStop(0, W.shadeCSS(mix(col, dk, 0.35), dep, 0.7)); gr.addColorStop(0.45, W.shadeCSS(col, dep, 0));
    gr.addColorStop(0.7, W.shadeCSS(belly, dep, 0.55)); gr.addColorStop(1, W.shadeCSS(belly, dep, 0.8));
    ctx.fillStyle = gr;
    ctx.fillRect(x - L, base - H * 1.5, L * 2, H * 2);
    ctx.restore();
    // 耳（小，在头顶）、眼、鼻孔、口
    ctx.fillStyle = W.shadeCSS(dk, dep);
    for (const [u, v, r] of [[0.345, -1.05, 1], [0.375, -1.07, 0.85]]) { const q = P(u, v); ctx.beginPath(); ctx.ellipse(q[0], q[1] + hl, L * 0.014 * r, H * 0.07 * r, -0.2, 0, TAU); ctx.fill(); }
    for (const [u, v] of [[0.665, -0.9], [0.705, -0.86]]) { const q = P(u, v); ctx.beginPath(); ctx.ellipse(q[0], q[1] + hl, L * 0.018, H * 0.05, 0, Math.PI, TAU); ctx.fill(); }
    {
      const e = P(0.445, -1.0);
      ctx.beginPath(); ctx.ellipse(e[0], e[1] + hl, L * 0.02, H * 0.06, 0, Math.PI, TAU); ctx.fill();
      ctx.fillStyle = W.shadeCSS([236, 220, 190], dep, 0.85 * (0.4 + 0.6 * W.daylight));
      ctx.beginPath(); ctx.arc(e[0] + L * 0.004, e[1] + hl - H * 0.03, Math.max(0.9, L * 0.006), 0, TAU); ctx.fill();
      const m0 = P(0.755, -0.46), m1 = P(0.52, -0.42);
      ctx.strokeStyle = W.shadeCSS(dk, dep, 0.85); ctx.lineWidth = Math.max(0.8, L * 0.005);
      ctx.beginPath(); ctx.moveTo(m0[0], m0[1] + hl); ctx.quadraticCurveTo((m0[0] + m1[0]) / 2, m0[1] + hl + H * 0.1, m1[0], m1[1] + hl); ctx.stroke();
    }
    // 皮上的褶（颈后）
    ctx.strokeStyle = W.shadeCSS(dk, dep, 0.35); ctx.lineWidth = Math.max(0.7, L * 0.004);
    ctx.beginPath();
    for (const q of [0.24, 0.29]) { const a1 = P(q, -1.08), a2 = P(q + 0.03, -0.75), a3 = P(q, -0.42); ctx.moveTo(a1[0], a1[1]); ctx.quadraticCurveTo(a2[0], a2[1], a3[0], a3[1]); }
    ctx.stroke();
    // 迎光的背脊与头顶
    ctx.strokeStyle = W.shadeCSS(hi, dep, 0.4 * lit, 0.15); ctx.lineWidth = Math.max(1, L * 0.007); ctx.lineCap = 'round';
    ctx.beginPath();
    { const q = [P(-0.3, -1.18), P(-0.12, -1.34), P(0.12, -1.3), P(0.24, -1.12)];
      ctx.moveTo(q[0][0], q[0][1]); ctx.bezierCurveTo(q[1][0], q[1][1], q[2][0], q[2][1], q[3][0], q[3][1]); }
    { const a1 = P(0.38, -1.06), a2 = P(0.45, -1.04), a3 = P(0.56, -0.98), a4 = P(0.64, -0.86);
      ctx.moveTo(a1[0], a1[1] + hl); ctx.quadraticCurveTo(a1[0], a1[1] + hl, a2[0], a2[1] + hl); ctx.quadraticCurveTo(a3[0], a3[1] + hl, a4[0], a4[1] + hl); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    // 河水涨到它口边（40:23）：水只画在它的身上（身子下半没在水里），不铺到岛上的草地
    if (flood > 0.02 && wl - water > 1) {
      ctx.save();
      ctx.clip(body);
      const deep = W.shade([34, 66, 92], 0.3), top = W.shade([96, 136, 164], 0.3);
      const vg = ctx.createLinearGradient(0, water, 0, wl + 4);
      vg.addColorStop(0, rgba(top, 0.6 * flood)); vg.addColorStop(0.12, rgba(deep, 0.5 * flood)); vg.addColorStop(1, rgba(deep, 0.72 * flood));
      ctx.fillStyle = vg;
      ctx.beginPath(); ctx.moveTo(x - L, wl + 6);
      for (let i = 0; i <= 20; i++) { const u = i / 20; ctx.lineTo(lerp(x - L, x + L, u), water + Math.sin(u * 14 + W.t * 1.3) * 0.9); }
      ctx.lineTo(x + L, wl + 6); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    const lit2 = 0.35 + 0.65 * W.daylight;
    if (flood > 0.05) {          // 涨起的水面：一道亮线，两端淡去
      const x0 = x - 0.62 * L, x1 = x + 0.8 * L, lg = ctx.createLinearGradient(x0, 0, x1, 0), c = W.shade([236, 244, 250], 0.25);
      lg.addColorStop(0, rgba(c, 0)); lg.addColorStop(0.2, rgba(c, 0.75 * lit2 * flood)); lg.addColorStop(0.8, rgba(c, 0.75 * lit2 * flood)); lg.addColorStop(1, rgba(c, 0));
      ctx.strokeStyle = lg; ctx.lineWidth = Math.max(1, L * 0.008);
      ctx.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20; ctx[i ? 'lineTo' : 'moveTo'](lerp(x0, x1, u), water + Math.sin(u * 14 + W.t * 1.3) * 0.9); } ctx.stroke();
    }
    ctx.strokeStyle = W.shadeCSS([226, 238, 246], 0.25, 0.6 * lit2); ctx.lineWidth = Math.max(0.8, L * 0.005);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const rr = L * (0.46 + 0.06 * i + 0.03 * Math.sin(W.t * 0.8 + i)), yy = water + i * (1.2 + 2 * (1 - flood));
      ctx.moveTo(x + 0.1 * L - rr, yy); ctx.quadraticCurveTo(x + 0.1 * L, yy + 3, x + 0.1 * L + rr * 0.8, yy);
    }
    ctx.stroke();
    drawReeds(ctx, g, water);
  }
  function drawReeds(ctx, g, water) {
    const { L, x } = g, n = 34;
    const col = W.shadeCSS([104, 116, 66], 0.25), head = W.shadeCSS([150, 118, 76], 0.25);
    const reed = i => { const u = hsh(i * 4.1), rx = x + (u - 0.5) * L * 1.9; return (Math.abs(rx - x - L * 0.05) < L * 0.4 && i % 4) ? null : rx; };
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.7, L * 0.006); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const rx = reed(i);
      if (rx == null) continue;
      const h = L * (0.16 + 0.2 * hsh(i * 2.7)), sw = Math.sin(W.t * 0.9 + i) * h * 0.08 + W.wind * h * 0.1;
      ctx.moveTo(rx, water + 2); ctx.quadraticCurveTo(rx + sw * 0.3, water - h * 0.5, rx + sw, water - h);
    }
    ctx.stroke();
    ctx.fillStyle = head;
    ctx.beginPath();
    for (let i = 0; i < n; i += 2) {
      const rx = reed(i);
      if (rx == null) continue;
      const h = L * (0.16 + 0.2 * hsh(i * 2.7)), sw = Math.sin(W.t * 0.9 + i) * h * 0.08 + W.wind * h * 0.1;
      ctx.moveTo(rx + sw + L * 0.006, water - h); ctx.ellipse(rx + sw, water - h, L * 0.006, L * 0.022, 0, 0, TAU);
    }
    ctx.fill();
    // 莲叶（40:21）
    ctx.fillStyle = W.shadeCSS([62, 104, 60], 0.25);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const lx = x + (hsh(i * 9.3) - 0.5) * L * 1.7, ly = water + 2 + hsh(i * 2.2) * 6;
      ctx.moveTo(lx + L * 0.045, ly); ctx.ellipse(lx, ly, L * 0.045, L * 0.011, 0, 0, TAU);
    }
    ctx.fill();
    ctx.lineCap = 'butt';
  }

  // ════════════════════════════════════════════════════════════
  //  画：鳄鱼（41）——它行的路随后发光，令人想深渊如同白发
  // ════════════════════════════════════════════════════════════
  // 自近处的海（左下）游来，贴着近岸，到中景小岛前的水道里起来：头与颈立在画面右半（经文在左下）
  function leviPath(u) {
    const P = port();
    const p0 = P ? [0.0, 0.95] : [0.02, 0.975], p1 = P ? [0.2, 0.93] : [0.3, 0.97], p2 = P ? [0.35, 0.88] : [0.4, 0.83], p3 = P ? [0.5, 0.79] : [0.535, 0.8];
    const v = 1 - u;
    return [(v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0]) * W.w,
      (v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]) * W.h];
  }
  const leviBig = () => (port() ? 1.3 : 1.35);
  const leviSS = y => Math.max(W.seaScale(y), 0.5 * W.unit) * leviBig();
  // sink：鳄鱼退去时（ybLeviA → 0）颈与身沉回水里
  function leviState(L, sink) {
    const uh = c01(L / 0.4);
    const rise = (L < 0.4 ? 0 : L < 0.6 ? eio((L - 0.4) / 0.2) : L < 0.85 ? 1 : 1 - 0.35 * eio((L - 0.85) / 0.15)) * (sink == null ? 1 : sink);
    const [bx, by] = leviPath(uh), q = leviPath(Math.max(0, uh - 0.02)), dir = bx >= q[0] ? 1 : -1;
    const hs = 0.95 * W.unit * leviBig();
    const hx = bx + dir * 30 * hs * rise, hy = by - (port() ? 190 : 150) * hs * rise - 6 * hs;
    return { uh, rise, bx, by, dir, hs, hx, hy };
  }
  function leviHead() { const s = leviState(0.8); return [s.hx + s.dir * 38 * s.hs, s.hy - 4 * s.hs, s.hs]; }
  function drawLeviathan(ctx) {
    const A = W.lv.ybLeviA, Lv = W.lv.ybLevi;
    if (A < 0.01 || Lv < 0.002) return;
    SP || sprites();
    const st = leviState(Lv, sstep(0.08, 0.75, A)), { uh, rise, bx, by, dir, hs, hx, hy } = st;
    const lit = 0.35 + 0.65 * W.daylight;
    // 发光的路：白发一般的尾迹（41:32）
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const segs = 48, pts = [];
    for (let i = 0; i <= segs; i++) pts.push(leviPath(uh * i / segs));
    for (let c = 0; c < segs; c += 4) {
      const p0 = pts[c], m = pts[Math.min(segs, c + 2)], ss = leviSS(m[1]), age = 1 - c / segs;
      const e = Math.min(segs, c + 4);
      for (const [lw, al] of [[22, 0.07], [8, 0.16]]) {
        ctx.strokeStyle = rgba([226, 236, 255], A * al * (0.55 + 0.45 * (1 - age * 0.6)));
        ctx.lineWidth = lw * ss;
        ctx.beginPath(); ctx.moveTo(p0[0], p0[1]);
        for (let i = c + 1; i <= e; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      }
    }
    for (let strand = 0; strand < 5; strand++) {
      ctx.beginPath();
      for (let i = 0; i <= segs; i++) {
        const p = pts[i], ss = leviSS(p[1]);
        const off = (strand - 2) * 3.2 * ss * (0.6 + 0.4 * Math.sin(i * 0.9 + W.t * 0.7 + strand * 1.7));
        if (i) ctx.lineTo(p[0], p[1] + off); else ctx.moveTo(p[0], p[1] + off);
      }
      ctx.strokeStyle = rgba([240, 246, 255], A * (strand === 2 ? 0.5 : 0.22) * (0.6 + 0.4 * lit));
      ctx.lineWidth = strand === 2 ? 1.8 : 1;
      ctx.stroke();
    }
    // 使深渊开滚如锅，使洋海如锅中的膏油（41:31）：它起来之处一圈圈油光
    const boil = A * (0.4 + 0.6 * rise);
    for (let i = 0; i < 5; i++) {
      const ph = U.fract(W.t * 0.3 + i * 0.2), ss = leviSS(by);
      const cc = i % 2 ? [220, 236, 200] : [255, 226, 180];
      ctx.strokeStyle = rgba(cc, boil * 0.35 * (1 - ph));
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.ellipse(bx, by + 2, (26 + 70 * ph) * ss, (5 + 14 * ph) * ss, 0, 0, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // 身子一环一环拱出水面（鳞甲紧紧合闭，封得严密 41:15）
    const body = [34, 44, 46], scale = [120, 140, 126], dark = [14, 18, 20];
    const coils = 4, cstep = port() ? 0.12 : 0.085, chalf = port() ? 0.045 : 0.03;
    ctx.lineCap = 'round';
    ctx.globalAlpha = Math.min(1, A);           // 整个身子随 ybLeviA 淡去（不是一下子消失）
    for (let j = coils - 1; j >= 0; j--) {
      const uc = uh - cstep - j * cstep;
      if (uc - chalf < 0) continue;
      const pa = leviPath(uc - chalf), pb = leviPath(uc + chalf), pm = leviPath(uc);
      const ss = leviSS(pm[1]);
      const wave = 0.7 + 0.3 * Math.sin(W.t * 1.2 - j * 1.1);
      const hgt = (30 + 9 * (coils - j)) * ss * wave * (0.5 + 0.5 * A);
      const th = 17 * ss;
      const cx = (pa[0] + pb[0]) / 2, cy = Math.min(pa[1], pb[1]) - hgt * 2;
      ctx.strokeStyle = W.shadeCSS(body, 0.1);
      ctx.lineWidth = th;
      ctx.beginPath(); ctx.moveTo(pa[0], pa[1] + th * 0.3); ctx.quadraticCurveTo(cx, cy, pb[0], pb[1] + th * 0.3); ctx.stroke();
      // 背上的棘
      ctx.fillStyle = W.shadeCSS(dark, 0.1);
      ctx.beginPath();
      for (let q = 1; q < 8; q++) {
        const t = q / 8, v = 1 - t;
        const px = v * v * pa[0] + 2 * v * t * cx + t * t * pb[0], py = v * v * (pa[1] + th * 0.3) + 2 * v * t * cy + t * t * (pb[1] + th * 0.3);
        const dx = 2 * v * (cx - pa[0]) + 2 * t * (pb[0] - cx), dy = 2 * v * (cy - pa[1]) + 2 * t * (pb[1] - cy), dl = Math.hypot(dx, dy) || 1;
        const nx = dy / dl, ny = -dx / dl, sg = ny < 0 ? 1 : -1;
        const sz = (5 + 3 * Math.sin(t * Math.PI)) * ss;
        const bx0 = px + nx * sg * th * 0.45, by0 = py + ny * sg * th * 0.45;
        ctx.moveTo(bx0 - dx / dl * sz * 0.5, by0 - dy / dl * sz * 0.5); ctx.lineTo(bx0 + nx * sg * sz, by0 + ny * sg * sz); ctx.lineTo(bx0 + dx / dl * sz * 0.5, by0 + dy / dl * sz * 0.5);
      }
      ctx.fill();
      ctx.strokeStyle = W.shadeCSS(scale, 0.1, 0.5 * lit, 0.25); ctx.lineWidth = Math.max(0.8, 1.2 * ss);
      ctx.beginPath(); ctx.moveTo(pa[0] + th * 0.2, pa[1] - th * 0.1); ctx.quadraticCurveTo(cx, cy - th * 0.35, pb[0] - th * 0.2, pb[1] - th * 0.1); ctx.stroke();
      ctx.strokeStyle = W.shadeCSS([226, 238, 250], 0.2, 0.55 * lit); ctx.lineWidth = Math.max(1, 1.2 * ss);
      for (const pe of [pa, pb]) { ctx.beginPath(); ctx.ellipse(pe[0], pe[1] + th * 0.35, th * 1.1, th * 0.25, 0, 0, TAU); ctx.stroke(); }
    }
    // 颈：自水中立起，一道弯弯的弧，越往上越细
    const x0 = bx - dir * 18 * hs, y0 = by + 2;
    const c1 = [bx + dir * 26 * hs, by - 60 * hs * rise], c2 = [hx - dir * 34 * hs, hy + 40 * hs * rise + 10 * hs];
    const NP = 18, L1 = [], R1 = [];
    const bez = t => { const v = 1 - t; return [v * v * v * x0 + 3 * v * v * t * c1[0] + 3 * v * t * t * c2[0] + t * t * t * hx, v * v * v * y0 + 3 * v * v * t * c1[1] + 3 * v * t * t * c2[1] + t * t * t * hy]; };
    for (let i = 0; i <= NP; i++) {
      const t = i / NP, p0 = bez(Math.max(0, t - 0.02)), p1 = bez(Math.min(1, t + 0.02)), pp = bez(t);
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], dl = Math.hypot(dx, dy) || 1;
      const wd = (19 - 9 * t) * hs * (0.75 + 0.25 * rise);
      L1.push([pp[0] - dy / dl * wd, pp[1] + dx / dl * wd]); R1.push([pp[0] + dy / dl * wd, pp[1] - dx / dl * wd]);
    }
    ctx.fillStyle = W.shadeCSS(body, 0.1);
    ctx.beginPath();
    L1.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    for (let i = R1.length - 1; i >= 0; i--) ctx.lineTo(R1[i][0], R1[i][1]);
    ctx.closePath(); ctx.fill();
    // 腹下一道稍亮的鳞（朝向观者的一侧）
    {
      const fr = dir > 0 ? L1 : R1, bk = dir > 0 ? R1 : L1;
      ctx.fillStyle = W.shadeCSS([74, 84, 76], 0.1);
      ctx.beginPath();
      fr.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
      for (let i = fr.length - 1; i >= 0; i--) ctx.lineTo(fr[i][0] * 0.62 + bk[i][0] * 0.38, fr[i][1] * 0.62 + bk[i][1] * 0.38);
      ctx.closePath(); ctx.fill();
    }
    // 颈后的一排棘（在背光的一侧）
    const back = dir > 0 ? R1 : L1, front = dir > 0 ? L1 : R1;
    ctx.fillStyle = W.shadeCSS(dark, 0.1);
    ctx.beginPath();
    for (let i = 2; i < NP - 1; i += 2) {
      const q = back[i], q2 = back[i + 1], cxp = (q[0] + q2[0]) / 2, cyp = (q[1] + q2[1]) / 2;
      const sz = (9 - 4 * i / NP) * hs * (0.3 + 0.7 * rise);
      ctx.moveTo(q[0], q[1]); ctx.lineTo(cxp - dir * sz, cyp - sz * 0.35); ctx.lineTo(q2[0], q2[1]);
    }
    ctx.fill();
    // 颈上的鳞与迎光的边
    ctx.strokeStyle = W.shadeCSS(scale, 0.1, 0.4 * lit, 0.2); ctx.lineWidth = Math.max(0.7, 0.9 * hs);
    ctx.beginPath();
    for (let i = 2; i < NP; i += 2) { const q = back[i], r = front[i]; ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo((q[0] + r[0]) / 2, (q[1] + r[1]) / 2 + 5 * hs, r[0], r[1]); }
    ctx.stroke();
    ctx.strokeStyle = W.shadeCSS([255, 214, 170], 0.1, 0.55 * lit, 0.3); ctx.lineWidth = Math.max(1, 1.3 * hs);
    ctx.beginPath(); front.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
    // 头：长吻、眉棱、紧闭的上下牙骨（41:14）
    const HL = 64 * hs, HH = 17 * hs;
    ctx.save();
    ctx.translate(hx, hy); ctx.scale(dir, 1); ctx.rotate(-0.1 * rise);
    ctx.fillStyle = W.shadeCSS(body, 0.1);
    ctx.beginPath();
    ctx.moveTo(-HL * 0.18, -HH * 0.5);
    ctx.quadraticCurveTo(HL * 0.08, -HH * 1.05, HL * 0.3, -HH * 0.62);
    ctx.lineTo(HL * 0.9, -HH * 0.32);
    ctx.quadraticCurveTo(HL * 1.02, -HH * 0.05, HL * 0.92, HH * 0.2);
    ctx.lineTo(HL * 0.2, HH * 0.62);
    ctx.quadraticCurveTo(-HL * 0.05, HH * 0.75, -HL * 0.2, HH * 0.4);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS(dark, 0.1, 0.9); ctx.lineWidth = Math.max(0.9, 1.2 * hs);
    ctx.beginPath(); ctx.moveTo(HL * 0.9, HH * 0.02); ctx.lineTo(HL * 0.1, HH * 0.28); ctx.stroke();
    ctx.strokeStyle = W.shadeCSS(scale, 0.1, 0.7 * lit, 0.3); ctx.lineWidth = Math.max(0.8, 1.2 * hs);
    ctx.beginPath(); ctx.moveTo(-HL * 0.12, -HH * 0.6); ctx.quadraticCurveTo(HL * 0.08, -HH * 1.05, HL * 0.3, -HH * 0.62); ctx.lineTo(HL * 0.9, -HH * 0.34); ctx.stroke();
    // 牙齿四围是可畏的
    ctx.fillStyle = W.shadeCSS([226, 220, 200], 0.1, 0.8);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const tx = HL * (0.3 + i * 0.1), ty = HH * (0.24 - i * 0.035); ctx.moveTo(tx, ty); ctx.lineTo(tx + HL * 0.02, ty + HH * 0.14); ctx.lineTo(tx + HL * 0.04, ty); }
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
    // 眼睛好像早晨的光线（41:18）
    const ex = hx + dir * HL * 0.22, ey = hy - HH * 0.62;
    const eye = A * (0.3 + 0.7 * c01(rise * 1.4));
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, ex, ey, 26 * hs, eye * 0.85);
    glowAt(ctx, SP.pale, ex, ey, 7 * hs, eye);
    if (rise > 0.3) {
      ctx.strokeStyle = rgba([255, 226, 160], eye * 0.22); ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 7; i++) { const a = -Math.PI * 0.9 + i * 0.3; const r0 = 8 * hs, r1 = (22 + 10 * (i % 2)) * hs; ctx.moveTo(ex + Math.cos(a) * r0, ey + Math.sin(a) * r0); ctx.lineTo(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); }
      ctx.stroke();
    }
    // 从它鼻孔冒出烟来（41:20）
    if (rise > 0.5) {
      const nx = hx + dir * HL * 0.92, ny = hy - HH * 0.28;
      for (let i = 0; i < 5; i++) { const ph = U.fract(W.t * 0.3 + i / 5); glowAt(ctx, SP.warm, nx + dir * ph * 20 * hs, ny - ph * 30 * hs, (4 + 10 * ph) * hs, A * 0.25 * (1 - ph)); }
    }
    ctx.globalCompositeOperation = 'source-over';
    // 颈下的水纹
    const ss0 = leviSS(by);
    ctx.globalAlpha = Math.min(1, A);
    ctx.strokeStyle = W.shadeCSS([232, 242, 250], 0.2, 0.55 * lit); ctx.lineWidth = Math.max(1, 1.3 * ss0);
    ctx.beginPath(); ctx.ellipse(x0, y0, 34 * ss0, 6 * ss0, 0, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }

  // 以利户手中的火把：夜与黎明里给他一圈暖光
  function drawTorch(ctx) {
    if (!S.torch || !has('elihu')) return;
    SP || sprites();
    const s = LS(2), [x, y] = at('elihu', 0.85), f = 0.85 + 0.15 * Math.sin(W.t * 11) + 0.06 * Math.sin(W.t * 23);
    const d = (fig('elihu') && fig('elihu').facing) || 1;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x + d * 5 * s, y - 4 * s, 46 * s, (0.25 + 0.4 * nightK()) * f);
    glowAt(ctx, SP.ember, x + d * 5 * s, y - 6 * s, 8 * s, 0.7 * f);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 赐福：金光遍地（42:12）
  function drawBless(ctx) {
    const k = W.lv.ybBless;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.45 * k;
    ctx.drawImage(SP.gold, 0.3 * W.w, W.horizonY - 0.05 * W.h, 0.9 * W.w, 0.6 * W.h);
    ctx.globalAlpha = 0.3 * k * (0.5 + 0.5 * W.daylight);
    ctx.drawImage(SP.warm, 0.45 * W.w, W.horizonY + 0.08 * W.h, 0.7 * W.w, 0.4 * W.h);
    for (let i = 0; i < 18; i++) {
      const ph = U.fract(W.t * 0.05 + hsh(i * 2.3)), xf = 0.4 + 0.6 * hsh(i * 7.1);
      glowAt(ctx, SP.gold, xf * W.w + Math.sin(W.t * 0.5 + i) * 10, gY(2, xf) - ph * 0.3 * W.h, 3 * Math.max(0.7, W.unit), k * (1 - ph) * Math.min(1, ph * 6) * 0.7);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  本卷的布景
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {},
    update(dt) {
      if (!isCur()) { FXL.length = 0; DROPS.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      U.safe('job.spray', () => spray(f));
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'seaFar') {
        // 天上的一切画在这里：暴风的天（天气模块）之上，远山之下
        drawNorth(ctx);
        drawCons(ctx);
        drawMorning(ctx);
        drawSwaddle(ctx);
        drawStand(ctx);
        drawCouncil(ctx);
        drawJoy(ctx);
      } else if (pass === 'far') {
        drawVeins(ctx, 0);
      } else if (pass === 'mid') {
        drawVeins(ctx, 1);
        drawEmbers(ctx);
        drawCrag(ctx);
        drawBehemoth(ctx);
        drawWhirl(ctx);
        drawTransients(ctx, 'mid');
      } else if (pass === 'near') {
        drawVeins(ctx, 2);
        drawFound(ctx);
        drawStump(ctx);
        drawAsh(ctx);
        drawRock(ctx);
        const fall = W.lv.ybFall * (1 - W.lv.ybBuild);
        drawHouse(ctx, X.son, 60, 40, { fall, seed: 3, lamp: W.lv.ybFeast, lit: 1 - sstep(0.1, 0.4, fall) });
        drawAltar(ctx, X.altar, W.lv.ybAltar);
        drawHouse(ctx, X.house, 72, 46, { fall: 0, seed: 7, upper: true });
        drawNights(ctx);
        drawFire(ctx);
        drawGoldBack(ctx);
        drawHedge(ctx);
        drawTransients(ctx, 'near');
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') drawSurge(ctx, pass);
      if (pass === 'seaNear') { drawLeviathan(ctx); drawBound(ctx); drawDrops(ctx); }
      if (pass === 'air') {
        drawRegard(ctx);
        drawGold(ctx);
        drawTorch(ctx);
        drawEagle(ctx);
        drawBless(ctx);
        drawTransients(ctx, 'air');
      }
    },
    reset() { FXL.length = 0; DROPS.length = 0; },
    restore() { FXL.length = 0; DROPS.length = 0; },
    sig() { return { acc: S.acc, nights: S.nights, torch: S.torch, restored: S.restored }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const s = LS(2);
      cand('长子的房屋', X.son * W.w, gY(2, X.son) - 30 * s);
      cand('约伯的家', X.house * W.w, gY(2, X.house) - 40 * s);
      cand('坛', X.altar * W.w, gY(2, X.altar) - 12 * s);
      cand('炉灰', X.job * W.w, gY(2, X.job) - 2 * s);
      { const rg = rockGeo(); cand('磐石', rg.x, rg.y - rg.h * 0.5); }
      if (W.lv.ybSprout > 0.3) cand('树墩', X.stump * W.w, gY(2, X.stump) - 16 * s);
      const cg = cragGeo();
      cand('山岩', cg.x, cg.y - cg.H * 0.5);
      if (W.lv.ybIbex > 0.5) cand('野山羊', cg.x + IBEX[0][0] * cg.w, cg.y + IBEX[0][1] * cg.H - 8 * cg.s);
      if (W.lv.ybEagle > 0.99) cand('大鹰', cg.top[0], cg.top[1] - 10 * LS(1));
      if (W.lv.ybWhirl > 0.3) { const g = whirlGeo(); cand('旋风', whirlAxis(g, 0.5, 1), g.top + g.H * 0.5); }
      if (W.lv.ybBehe > 0.5) { const g = beheGeo(); cand('河马', g.x + g.L * 0.3, g.wl - g.H * 0.5); }
      if (W.lv.ybLeviA > 0.3 && W.lv.ybLevi > 0.5) { const h = leviHead(); cand('鳄鱼', h[0], h[1]); }
      if (W.lv.ybCons > 0.1 && W.night > 0.4) {
        const Lo = consLayout();
        cand('昴星', Lo.plei[0], Lo.plei[1]); cand('参星', Lo.ori[0], Lo.ori[1]); cand('北斗', Lo.dip[0] + Lo.dip[2], Lo.dip[1]);
      }
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：乌斯地的清晨
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 乌斯：东方的草场，半干的地
    W.set('bare', 0.32, true); W.set('bloom', 0.2, true);
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.4, land: 1, grass: 1, herbs: 0.8, trees: 0.32, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      ybCouncil: 0, ybRegard: 0, ybHedge: 0, ybGuard: 0, ybEmbers: 0, ybFall: 0, ybBuild: 0, ybFeast: 1, ybAltar: 0, ybFire: 0, ybSparks: 0, ybSprout: 0,
      ybCarve: 0, ybStand: 0, ybGold: 0, ybVeins: 0, ybNorth: 0, ybWhirl: 0, ybFound: 0, ybMorning: 0, ybJoy: 0, ybSurge: 0, ybSwaddle: 0, ybBound: 0,
      ybCons: 0, ybKnot: 0, ybBelt: 0, ybWheel: 0, ybEagle: 0, ybBehe: 0, ybFlood: 0, ybLevi: 0, ybLeviA: 0, ybSeen: 0, ybBless: 0, ybAsh: 0.4 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    W.freeClock = false;
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.26, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 16, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    S = fresh();
    FXL.length = 0;
    const c = C();
    c.clear({ fade: false });
    add('job', { label: '约伯', sex: 'm', age: 'adult', x: X.house - 0.035, facing: -1, robe: ROBE.job, glow: 0.5, hair: 'cloth', beard: true, prop: null, from: 'none' });
    add('wife', { label: '约伯的妻子', sex: 'f', age: 'adult', x: X.house + 0.012, facing: -1, robe: ROBE.wife, glow: 0.2, from: 'none' });
    crowd('hh', { n: 3, x0: X.house + 0.03, x1: X.house + 0.07, layer: 2, label: '仆婢', from: 'none' }, (m, i) => { m.sex = i === 1 ? 'f' : 'm'; m.robe = [[132, 116, 96], [150, 120, 104], [112, 100, 88]][i]; m.accent = null; m.facing = -1; m.fd = -1; });
    // 长子家里的筵宴（1:4）：七个儿子、三个女儿坐在院中
    crowd('kids', { n: 10, x0: X.son - 0.055, x1: X.son + 0.05, layer: 2, label: '约伯的儿女', pose: 'sit', from: 'none' }, (m, i) => {
      m.sex = i % 3 === 1 && i < 9 ? 'f' : 'm'; m.age = 'adult'; m.robe = KIDS[i % KIDS.length]; m.accent = null; m.v = 0.06 + 0.12 * ((i * 0.618) % 1);
    });
    // 中景山上的牲畜与仆人
    herd('sheep', { kind: 'sheep', n: 8, x0: 0.585, x1: 0.68, layer: 1, label: '群羊', from: 'none' });
    herd('oxen', { kind: 'cow', n: 3, x0: 0.7, x1: 0.77, layer: 1, label: '牛', from: 'none' });
    animal('don1', 'donkey', 0.735, { facing: 1, label: '母驴' });
    animal('don2', 'donkey', 0.765, { facing: -1, label: '母驴' });
    animal('cam1', 'camel', 0.84, { facing: -1 });
    animal('cam2', 'camel', 0.87, { facing: 1 });
    animal('cam3', 'camel', 0.9, { facing: -1 });
    crowd('shep', { n: 2, x0: 0.6, x1: 0.66, layer: 1, label: '仆人', from: 'none' });
    crowd('plow', { n: 1, x0: 0.745, x1: 0.75, layer: 1, label: '仆人', from: 'none' });
    crowd('camh', { n: 1, x0: 0.885, x1: 0.89, layer: 1, label: '仆人', from: 'none' });
    avoid([0.5, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:8 「你曾用心察看我的仆人约伯没有？」────────────────
    {
      kind: 'ask', utter: '你曾用心察看我的仆人约伯没有？', cmd: 'watch --servant 约伯  # 完全正直，敬畏神，远离恶事', ref: '1:8',
      verse: [
        { text: '他清早起来，按着他们众人的数目献燔祭；……约伯常常这样行。', ref: '约伯记 1:5', hold: 5.5 },
        { text: '有一天，神的众子来侍立在耶和华面前，撒但也来在其中。', ref: '约伯记 1:6', hold: 5.5 },
        { text: '耶和华问撒但说：「你曾用心察看我的仆人约伯没有？<br>地上再没有人像他完全正直，敬畏神，远离恶事。」', ref: '约伯记 1:8', hold: 6.5 },
        { text: '撒但回答耶和华说：「约伯敬畏神，岂是无故呢？<br>你岂不是四面圈上篱笆围护他和他的家，并他一切所有的吗？」', ref: '约伯记 1:9–10', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { walk('job', X.altar - 0.024, { speed: 0.02, pose: 'pray' }); W.goTo(0.34, 12, b.instant); }],
          [3, b => { lv('ybAltar', 1, b); sfx(b, 'fire'); }],
          [6.8, b => { lv('ybCouncil', 1, b); S.acc = 1; sfx(b, 'angel', { soft: true }); }],
          [13.6, b => { lv('ybRegard', 1, b); glow('job', 0.9); sfx(b, 'harp'); }],
          [20.5, b => { lv('ybRegard', 0.25, b); lv('ybHedge', 1, b); sfx(b, 'chime'); }],
          [25, b => { lv('ybAltar', 0.35, b); pose('job', 'stand'); face('job', -1); }],
        ]);
      },
    },

    // ── 1:12 「凡他所有的都在你手中」：四个报信的 ──────────────
    {
      kind: 'judge', utter: '凡他所有的都在你手中', cmd: 'chown -R 撒但 ./约伯/所有的 --exclude 约伯', ref: '1:12',
      verse: [
        { text: '耶和华对撒但说：「凡他所有的都在你手中；只是不可伸手加害于他。」<br>于是撒但从耶和华面前退去。', ref: '约伯记 1:12', hold: 6 },
        { text: '有报信的来见约伯，说：「……示巴人忽然闯来，把牲畜掳去……」<br>又有人来说：「神从天上降下火来，将群羊和仆人都烧灭了……」', ref: '约伯记 1:14–16', hold: 7 },
        { text: '又有人来说：「迦勒底人分作三队忽然闯来，把骆驼掳去……」', ref: '约伯记 1:17', hold: 5.2 },
        { text: '又有人来说：「你的儿女正在他们长兄的家里吃饭喝酒，<br>不料，有狂风从旷野刮来，击打房屋的四角，<br>房屋倒塌在少年人身上，他们就都死了……」', ref: '约伯记 1:18–19', hold: 7.6 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => {
            flash(b, { type: 'descend', dur: 4, x0: formAt(ACC_I, 1)[0], y0: formAt(ACC_I, 1)[1] - M() * 0.03, x1: 0.74 * W.w, y1: gY(1, 0.74) - 10 });
            S.acc = 0;
            lv('ybHedge', 0, b); lv('ybRegard', 0, b); lv('ybGuard', 1, b); lv('ybAltar', 0, b);
            W.goTo(0.5, 20, b.instant);
          }],
          [3.5, b => { lv('ybCouncil', 0, b); walk('job', X.house - 0.045, { speed: 0.02 }); }],
          // 示巴人：牛驴被掳去
          [7.3, b => {
            add('m1', { label: '报信的', sex: 'm', x: 1.06, facing: -1, robe: ROBE.msg, glow: 0.1 });
            run('m1', X.house - 0.01, { pose: 'bow' });
            cwalk('oxen', 1.14, 1.22, { speed: 0.07 }); run('don1', 1.16); run('don2', 1.2);
            flash(b, { type: 'raid', l: 1, x0: 0.74, x1: 1.2, dur: 6 });
            crm('plow');
            sfx(b, 'donkey'); sfx(b, 'crowd', { far: true });
            face('job', 1);
          }],
          // 神的火从天降在羊群上：暗云里劈下的红火（不是看顾之光）
          [10.5, b => {
            flash(b, { type: 'firefall', xf: 0.63, dur: 2.8 });
            if (!b.instant) { W.shake = 0.5; }
            sfx(b, 'thunder'); sfx(b, 'fire');
          }],
          [11.2, b => { crm('sheep'); crm('shep'); lv('ybEmbers', 1, b); }],
          [12, () => {
            add('m2', { label: '报信的', sex: 'm', x: 1.07, facing: -1, robe: [140, 120, 96], glow: 0.1 });
            run('m2', X.house + 0.018, { pose: 'bow' });
          }],
          // 迦勒底人：骆驼被掳去（三队）
          [15.6, b => {
            run('cam1', 1.14); run('cam2', 1.2); run('cam3', 1.26);
            crm('camh');
            flash(b, { type: 'raid', l: 1, x0: 0.82, x1: 1.25, dur: 6, n: 3 });
            add('m3', { label: '报信的', sex: 'm', x: 1.08, facing: -1, robe: [156, 136, 110], glow: 0.1 });
            run('m3', X.house + 0.046, { pose: 'bow' });
            sfx(b, 'camel');
          }],
          // 狂风从旷野刮来：贴地卷来的尘土；房屋倒塌在尘土之下
          [21.7, b => { lv('gale', 1, b); flash(b, { type: 'gust', xf: X.son, dur: 4.5 }); sfx(b, 'wind'); }],
          [23.3, b => { flash(b, { type: 'veil', xf: X.son, dur: 5.5 }); }],
          [23.6, b => {
            lv('ybFall', 1, b); lv('ybFeast', 0, b);
            if (!b.instant) W.shake = 0.9;
            sfx(b, 'build'); sfx(b, 'weep', { far: true });
          }],
          [24, () => { crm('kids', true); }],
          [26, b => {
            lv('gale', 0, b); lv('ybEmbers', 0.35, b);
            add('m4', { label: '报信的', sex: 'm', x: 1.08, facing: -1, robe: [128, 112, 94], glow: 0.1 });
            run('m4', X.house + 0.074, { pose: 'bow' });
          }],
          [28, () => { rm('don1'); rm('don2'); rm('cam1'); rm('cam2'); rm('cam3'); crm('oxen'); }],
        ]);
      },
    },

    // ── 1:21 「赏赐的是耶和华，收取的也是耶和华」──────────────
    {
      kind: 'act', utter: '赏赐的是耶和华，收取的也是耶和华', cmd: 'echo "赏赐 · 收取" | bless 耶和华的名', ref: '1:21',
      verse: [
        { text: '约伯便起来，撕裂外袍，剃了头，伏在地上下拜，', ref: '约伯记 1:20', hold: 5.5 },
        { text: '说：「我赤身出于母胎，也必赤身归回；<br>赏赐的是耶和华，收取的也是耶和华。<br>耶和华的名是应当称颂的。」', ref: '约伯记 1:21', hold: 8 },
        { text: '在这一切的事上约伯并不犯罪，也不以神为愚妄。', ref: '约伯记 1:22', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          // 约伯走出家门，到磐石旁的空地上（画面右半的开阔处），在那里撕裂外袍、伏地下拜
          [0.2, b => { rm('m1'); rm('m2'); rm('m3'); rm('m4'); pose('job', 'stand'); walk('job', X.open, { speed: 0.05 }); W.goTo(0.74, 16, b.instant); avoid([0.5, 1]); }],
          [4.4, b => {
            dress('job', { robe: ROBE.jobTorn, hair: 'none' }); face('job', -1);
            flash(b, { type: 'puff', id: 'job', k: 0.7, n: 7, dur: 2.2, col: 'dust', a: 0.6 });
            sfx(b, 'weep');
          }],
          [5.8, b => { pose('job', 'fall'); cpose('hh', 'weep'); pose('wife', 'weep'); flash(b, { type: 'pulse', id: 'job', dur: 3 }); }],
          [8.5, b => { flash(b, { type: 'pulse', id: 'job', dur: 3.5 }); glow('job', 0.8); sfx(b, 'harp', { soft: true }); }],
          [15.5, () => { pose('job', 'kneel'); }],
          [18.5, () => { pose('wife', 'stand'); cpose('hh', 'stand'); }],
        ]);
      },
    },

    // ── 2:6 「他在你手中，只要存留他的性命」──────────────────
    {
      kind: 'judge', utter: '他在你手中，只要存留他的性命', cmd: 'chown 撒但 ./约伯 --keep 性命', ref: '2:6',
      verse: [
        { text: '耶和华对撒但说：「他在你手中，只要存留他的性命。」<br>于是撒但从耶和华面前退去，击打约伯，<br>使他从脚掌到头顶长毒疮。', ref: '约伯记 2:6–7', hold: 7.5 },
        { text: '约伯就坐在炉灰中，拿瓦片刮身体。', ref: '约伯记 2:8', hold: 5.2 },
        { text: '他的妻子对他说：「你仍然持守你的纯正吗？你弃掉神，死了吧！」', ref: '约伯记 2:9', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 黄昏（不是深夜）：人与炉灰都看得见
          [0, b => { W.goTo(0.766, 9, b.instant); lv('ybCouncil', 0.9, b); S.acc = 1; pose('job', 'stand'); glow('wife', 0.5); }],
          [3.5, b => {
            const p = formAt(ACC_I, 1), [jx, jy] = at('job', 0.6);
            flash(b, { type: 'descend', dur: 3.6, x0: p[0], y0: p[1] - M() * 0.03, x1: jx, y1: jy });
            S.acc = 0;
          }],
          [6.3, b => {
            dress('job', { robe: ROBE.jobAsh });
            glow('job', 0.5);
            lv('ybGuard', 0.45, b);
            lv('ybCouncil', 0, b);
            lv('bare', 0.72, b); lv('bloom', 0.08, b);
            flash(b, { type: 'puff', id: 'job', k: 0.5, n: 8, dur: 2.6, col: 'grey', a: 0.7 });
            if (!b.instant) W.shake = 0.3;
            sfx(b, 'weep', { low: true });
          }],
          [7.5, () => { walk('job', X.job, { speed: 0.014, pose: 'sit' }); avoid([0.5, 0.74], [0.88, 0.98]); }],
          [9, b => { lv('ybAsh', 1, b); lv('ybEmbers', 0, b); }],
          [14.6, () => { walk('wife', X.job + 0.03, { speed: 0.028, pose: 'point' }); }],
          [22.5, () => { pose('wife', 'stand'); face('wife', -1); }],
        ]);
      },
    },

    // ── 2:3 「他仍然持守他的纯正」；朋友来了，七天七夜 ────────────
    {
      kind: 'bless', utter: '他仍然持守他的纯正', cmd: 'assert 约伯.纯正  # 他仍然持守', ref: '2:3',
      verse: [
        { text: '约伯却对她说：「你说话像愚顽的妇人一样。嗳！难道我们从神手里得福，不也受祸吗？」<br>在这一切的事上约伯并不以口犯罪。', ref: '约伯记 2:10', hold: 7 },
        { text: '约伯的三个朋友……各人就从本处约会同来，为他悲伤，安慰他。<br>他们远远地举目观看，认不出他来，就放声大哭。', ref: '约伯记 2:11–12', hold: 7 },
        { text: '他们就同他七天七夜坐在地上，<br>一个人也不向他说句话，因为他极其痛苦。', ref: '约伯记 2:13', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.42, 7, b.instant); face('job', 1); flash(b, { type: 'pulse', id: 'job', dur: 3 }); }],
          [3, () => { walk('wife', X.house + 0.012, { speed: 0.022 }); glow('wife', 0.2); }],
          [5.5, () => {
            add('eliphaz', { label: '提幔人以利法', sex: 'm', age: 'elder', x: 1.05, facing: -1, robe: ROBE.eliphaz, glow: 0.25 });
            add('bildad', { label: '书亚人比勒达', sex: 'm', age: 'elder', x: 1.1, facing: -1, robe: ROBE.bildad, glow: 0.25 });
            add('zophar', { label: '拿玛人琐法', sex: 'm', age: 'adult', x: 1.15, facing: -1, robe: ROBE.zophar, glow: 0.25, beard: true, hair: 'cloth' });
            walk('eliphaz', 0.8, { speed: 0.04 }); walk('bildad', 0.835, { speed: 0.04 }); walk('zophar', 0.87, { speed: 0.04 });
          }],
          [10.5, b => { pose('eliphaz', 'gaze'); pose('bildad', 'gaze'); pose('zophar', 'gaze'); sfx(b, 'weep'); }],
          [11.8, b => {
            pose('eliphaz', 'weep'); pose('bildad', 'weep'); pose('zophar', 'weep');
            for (const id of ['eliphaz', 'bildad', 'zophar']) flash(b, { type: 'puff', id, k: 1.05, n: 7, dur: 2.4, col: 'dust', rise: 40, a: 0.65 });
          }],
          [14, () => {
            walk('eliphaz', X.eliphaz, { speed: 0.03, pose: 'sit' }); walk('bildad', X.bildad, { speed: 0.03, pose: 'sit' });
            walk('zophar', X.zophar, { speed: 0.036, pose: 'sit' });
          }],
          // 七天七夜：天光缓缓明暗四轮（不再急闪），灰前一粒一粒摆下七块小石
          ...[0, 1, 2, 3].map(i => [16.4 + i * 3.2, b => { W.passDay(3.2, b.instant); if (!b.instant && i === 0) sfx(b, 'harp', { soft: true }); }]),
          ...[0, 1, 2, 3, 4, 5, 6].map(i => [16.9 + i * 1.8, () => { S.nights = i + 1; }]),
          [29.5, () => { face('eliphaz', -1); face('bildad', -1); face('zophar', 1); }],
        ]);
      },
    },

    // ── 3–19 辩论：「他打破，又缠裹」；「我知道我的救赎主活着」（刻在磐石上）───
    {
      kind: 'act', utter: '他打破，又缠裹；他击伤，用手医治', cmd: 'wound && bind && heal  # 他打破，又缠裹', ref: '5:18',
      verse: [
        { text: '此后，约伯开口咒诅自己的生日，说：<br>「愿我生的那日和说怀了男胎的那夜都灭没。」', ref: '约伯记 3:1–3', hold: 6.2 },
        { text: '人生在世必遇患难，如同火星飞腾。……<br>因为他打破，又缠裹；他击伤，用手医治。', ref: '约伯记 5:7–18', hold: 6.5 },
        { text: '树若被砍下，还可指望发芽，嫩枝生长不息；', ref: '约伯记 14:7', hold: 5.2 },
        { text: '我知道我的救赎主活着，末了必站立在地上。<br>我这皮肉灭绝之后，我必在肉体之外得见神。', ref: '约伯记 19:25–26', hold: 7.2 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.8, 8, b.instant); pose('job', 'weep'); sfx(b, 'weep', { soft: true }); }],
          [4.5, b => { lv('ybFire', 1, b); lv('ybSparks', 0.2, b); }],
          [7.6, b => { W.goTo(0.93, 9, b.instant); pose('eliphaz', 'stand'); face('eliphaz', -1); lv('ybSparks', 1, b); sfx(b, 'fire'); }],
          [9.3, () => { pose('eliphaz', 'point'); pose('job', 'sit'); }],
          [12.5, b => { pose('eliphaz', 'sit'); lv('ybSparks', 0.3, b); }],
          [13.2, b => { lv('ybSprout', 1, b); sfx(b, 'chime'); }],
          // 惟愿我的言语……用铁笔镌刻，用铅灌在磐石上（19:23–24）：先刻成，19:25 念出时字已满
          [15.8, b => { pose('job', 'pray'); face('job', 1); lv('ybCarve', 1, b); sfx(b, 'build', { soft: true }); }],
          [21.6, b => { flash(b, { type: 'pulse', id: 'job', dur: 3 }); sfx(b, 'harp'); }],
          [23, b => { lv('ybStand', 1, b); sfx(b, 'angel', { soft: true }); }],
        ]);
      },
    },

    // ── 23–37 精金；智慧；以利户；北方的金光（灰白的黎明）────────
    {
      kind: 'act', utter: '金光出于北方，在神那里有可怕的威严', cmd: 'tail -f /北方  # 金光', ref: '37:22',
      verse: [
        { text: '然而他知道我所行的路；他试炼我之后，我必如精金。', ref: '约伯记 23:10', hold: 5.2 },
        { text: '他对人说：敬畏主就是智慧；远离恶便是聪明。', ref: '约伯记 28:28', hold: 5.2 },
        { text: '布西人巴拉迦的儿子以利户回答说：我年轻，你们老迈……<br>但在人里面有灵；全能者的气使人有聪明。', ref: '约伯记 32:6–8', hold: 6.8 },
        { text: '现在有云遮蔽，人不得见穹苍的光亮；但风吹过，天又发晴。<br>金光出于北方，在神那里有可怕的威严。', ref: '约伯记 37:21–22', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.24, 10, b.instant); lv('ybStand', 0.3, b); lv('ybSparks', 0.2, b); pose('job', 'stand'); face('job', 1); }],
          [1.5, b => { lv('ybGold', 1, b); glow('job', 1); sfx(b, 'harp', { soft: true }); }],
          [6.5, b => { lv('ybVeins', 1, b); lv('ybGold', 0.3, b); glow('job', 0.6); sfx(b, 'stars'); }],
          [12, b => { lv('ybVeins', 0, b); lv('ybStand', 0, b); }],
          [13, b => {
            add('elihu', { label: '以利户', sex: 'm', age: 'adult', x: 1.06, facing: -1, robe: ROBE.elihu, glow: 0.35, prop: 'torch', hair: 'short' });
            S.torch = 1;
            walk('elihu', X.elihu, { speed: 0.05 });
            sfx(b, 'crowd', { soft: true });
          }],
          [18.8, () => { pose('elihu', 'point'); }],
          [21.1, b => { lv('storm', 0.55, b); lv('clouds', 0.9, b); lv('gale', 0.35, b); lv('ybFire', 0.4, b); lv('ybGold', 0, b); sfx(b, 'thunder', { far: true }); pose('elihu', 'stand'); face('elihu', 1); }],
          [23, b => { bolt(b, 0.9); }],
          [24.5, b => { lv('ybNorth', 1, b); sfx(b, 'wind'); }],
          [26.5, b => { bolt(b, 0.7); }],
        ]);
      },
    },

    // ── 38:1–7 旋风；地的根基；晨星歌唱 ──────────────────────
    {
      kind: 'ask', utter: '我立大地根基的时候，你在哪里呢？', cmd: 'stat /地/根基  # Birth: 你在哪里呢？', ref: '38:4',
      verse: [
        { text: '那时，耶和华从旋风中回答约伯说：', ref: '约伯记 38:1', hold: 5.2 },
        { text: '谁用无知的言语使我的旨意暗昧不明？<br>你要如勇士束腰；我问你，你可以指示我。', ref: '约伯记 38:2–3', hold: 6.5 },
        { text: '我立大地根基的时候，你在哪里呢？你若有聪明，只管说吧！<br>……地的根基安置在何处？地的角石是谁安放的？', ref: '约伯记 38:4–6', hold: 7.5 },
        { text: '那时，晨星一同歌唱；神的众子也都欢呼。', ref: '约伯记 38:7', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('ybWhirl', 1, b); lv('storm', 0.8, b); lv('gale', 0.85, b); lv('ybNorth', 0.35, b); lv('ybFire', 0, b); lv('ybSparks', 0, b);
            sfx(b, 'wind'); sfx(b, 'thunder');
            pose('eliphaz', 'fall'); pose('bildad', 'fall'); pose('zophar', 'fall'); pose('elihu', 'bow');
            pose('job', 'kneel'); face('job', 1);
            if (!b.instant) W.shake = 0.6;
          }],
          [1.2, b => bolt(b, X.whirl + 0.03, true)],
          [3.6, b => bolt(b, X.whirl - 0.05)],
          [6.3, () => { pose('job', 'stand'); }],
          [8.5, b => bolt(b, X.whirl + 0.06, true)],
          [14.1, b => { lv('storm', 0.25, b); lv('gale', 0.3, b); lv('ybNorth', 0, b); lv('ybFound', 1, b); sfx(b, 'build', { soft: true }); pose('job', 'gaze'); }],
          [22.9, b => { W.goTo(0.245, 5, b.instant); lv('storm', 0, b); lv('clouds', 0.35, b); lv('ybFound', 0, b); lv('ybMorning', 1, b); lv('ybJoy', 1, b); sfx(b, 'stars'); sfx(b, 'angel'); }],
        ]);
      },
    },

    // ── 38:8–14 海的界限；晨光 ──────────────────────────────
    {
      kind: 'cmd', utter: '你只可到这里，不可越过', cmd: 'ulimit -海 这里  # 你狂傲的浪要到此止住', ref: '38:11',
      verse: [
        { text: '海水冲出，如出胎胞，那时谁将它关闭呢？<br>是我用云彩当海的衣服，用幽暗当包裹它的布，', ref: '约伯记 38:8–9', hold: 7 },
        { text: '为它定界限，又安门和闩，<br>说：你只可到这里，不可越过；你狂傲的浪要到此止住。', ref: '约伯记 38:10–11', hold: 7 },
        { text: '你自生以来，曾命定晨光，使清晨的日光知道本位……<br>因这光，地面改变如泥上印印，万物出现如衣服一样。', ref: '约伯记 38:12–14', hold: 7 },
      ],
      apply(c) {
        T(c, [
          // 天已破晓：看得见一排排涌来的浪
          [0, b => { W.goTo(0.252, 5, b.instant); lv('ybJoy', 0, b); lv('ybMorning', 0.12, b); lv('ybWhirl', 0.45, b); lv('ybSurge', 1, b); lv('gale', 0.9, b); sfx(b, 'splash', { size: 3 }); sfx(b, 'wind'); pose('job', 'stand'); face('job', -1); }],
          [3, b => { lv('ybSwaddle', 1, b); }],
          [7.5, b => { lv('ybBound', 1, b); sfx(b, 'seal'); }],
          [13.5, b => { lv('ybSurge', 0.45, b); lv('gale', 0.25, b); sfx(b, 'splash'); }],
          [16.6, b => { W.goTo(0.31, 7, b.instant); lv('ybSwaddle', 0, b); lv('ybSurge', 0, b); lv('gale', 0, b); lv('ybMorning', 0, b); flash(b, { type: 'sweep', dur: 6 }); sfx(b, 'harp'); }],
          [19.5, b => { lv('ybBound', 0, b); }],
          [20, () => { pose('eliphaz', 'kneel'); pose('bildad', 'kneel'); pose('zophar', 'kneel'); pose('elihu', 'kneel'); }],
        ]);
      },
    },

    // ── 38:31–35 昴星、参星、北斗、闪电 ──────────────────────
    {
      kind: 'ask', utter: '你能系住昴星的结吗？能解开参星的带吗？', cmd: 'knot 昴星 && untie 参星.带', ref: '38:31',
      verse: [
        { text: '你能系住昴星的结吗？能解开参星的带吗？', ref: '约伯记 38:31', hold: 6 },
        { text: '你能按时领出十二宫吗？能引导北斗和随它的众星吗？<br>你知道天的定例吗？能使地归在天的权下吗？', ref: '约伯记 38:32–33', hold: 6.5 },
        { text: '你能向云彩扬起声来，使倾盆的雨遮盖你吗？<br>你能发出闪电，叫它行去，使它对你说：我们在这里？', ref: '约伯记 38:34–35', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 旋风退到高处（只剩天上淡淡的一环），让出星空
          [0, b => { W.goTo(0.94, 9, b.instant); lv('ybWhirl', 0.15, b); face('job', 1); pose('job', 'gaze'); }],
          [5, b => { lv('ybCons', 1, b); sfx(b, 'stars'); }],
          [6.5, b => { lv('ybKnot', 1, b); lv('ybBelt', 1, b); sfx(b, 'chime'); }],
          [7.3, b => { lv('ybWheel', 1, b); }],
          [15.1, b => { lv('storm', 0.45, b); lv('clouds', 0.85, b); lv('rain', 0.35, b); sfx(b, 'rain'); }],
          [17.5, b => bolt(b, 0.58, true)],
          [18.6, b => bolt(b, 0.74)],
          [19.8, b => bolt(b, 0.9, true)],
          [23, b => { lv('storm', 0, b); lv('rain', 0, b); lv('clouds', 0.4, b); }],
        ]);
      },
    },

    // ── 39 野山羊、母鹿、野驴、野牛、大鹰 ──────────────────────
    {
      kind: 'ask', utter: '大鹰上腾在高处搭窝，岂是听你的吩咐吗？', cmd: 'sudo -u 大鹰 mkdir /山岩/窝  # 岂是听你的吩咐', ref: '39:27',
      verse: [
        { text: '山岩间的野山羊几时生产，你知道吗？母鹿下犊之期，你能察定吗？', ref: '约伯记 39:1', hold: 6 },
        { text: '谁放野驴出去自由？谁解开快驴的绳索？', ref: '约伯记 39:5', hold: 5.2 },
        { text: '野牛岂肯服事你？岂肯住在你的槽旁？<br>你岂能用套绳将野牛笼在犁沟之间？它岂肯随你耙山谷之地？', ref: '约伯记 39:9–10', hold: 6.5 },
        { text: '大鹰上腾在高处搭窝，岂是听你的吩咐吗？<br>它住在山岩，以山峰和坚固之所为家，', ref: '约伯记 39:27–28', hold: 6.2 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.29, 8, b.instant); lv('ybCons', 0.35, b); lv('ybWhirl', 0.2, b); }],
          [1.5, b => { lv('ybIbex', 1, b); avoid([0.5, 0.74], [0.88, 0.98]); sfx(b, 'bleat', { soft: true }); }],
          [3, () => { W.setPop('beast', 2, W.w * 0.86, W.ridgeBaseY(1, W.w * 0.86)); }],
          [7.8, b => {
            animal('wd1', 'donkey', 1.06, { facing: -1, label: '野驴' }); animal('wd2', 'donkey', 1.1, { facing: -1, label: '野驴' }); animal('wd3', 'donkey', 1.14, { facing: -1, label: '野驴' });
            run('wd1', 0.6); run('wd2', 0.65); run('wd3', 0.7);
            sfx(b, 'donkey');
          }],
          [12.5, () => { pose('wd1', 'graze'); pose('wd2', 'graze'); }],
          [13.9, b => {
            herd('wildox', { kind: 'cow', n: 3, x0: 1.08, x1: 1.16, layer: 1, label: '野牛' });
            cwalk('wildox', 0.76, 0.86, { speed: 0.05, run: true });
            sfx(b, 'cow');
          }],
          // 大鹰上腾：天上只留这一只鹰（其余的鸟不再有鹰隼）
          [16.8, b => { lv('ybEagle', 1, b); W.setPop('bird', 7); sfx(b, 'wings'); }],
          [20.7, () => { pose('job', 'gaze'); face('job', 1); }],
        ]);
      },
    },

    // ── 40 「我是卑贱的！」；河马 ────────────────────────────
    {
      kind: 'cmd', utter: '你且观看河马；我造你也造它', cmd: 'cat 河马  # 我造你也造它', ref: '40:15',
      verse: [
        { text: '于是，约伯回答耶和华说：<br>我是卑贱的！我用什么回答你呢？只好用手捂口。', ref: '约伯记 40:3–4', hold: 6.2 },
        { text: '于是，耶和华从旋风中回答约伯说：……<br>你且观看河马；我造你也造它。它吃草与牛一样；', ref: '约伯记 40:6–15', hold: 7 },
        { text: '它伏在莲叶之下，卧在芦苇隐密处和水洼子里。……<br>河水氾滥，它不发战；就是约旦河的水涨到它口边，也是安然。', ref: '约伯记 40:21–23', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.5, 10, b.instant); pose('job', 'weep'); face('job', 1); }],
          [4, () => { pose('job', 'kneel'); }],
          // 野驴跑开，让出岛的这一头给河马
          [6, () => { run('wd1', 1.12); run('wd2', 1.16); run('wd3', 1.2); }],
          [7.5, b => { lv('ybWhirl', 1, b); sfx(b, 'wind'); }],
          [9, b => { lv('ybBehe', 1, b); sfx(b, 'splash', { size: 3 }); }],
          [13, () => { rm('wd1'); rm('wd2'); rm('wd3'); }],
          [15.8, b => { lv('ybFlood', 1, b); sfx(b, 'splash'); lv('ybWhirl', 0.5, b); }],
          [21, () => { face('job', -1); pose('job', 'gaze'); }],
        ]);
      },
    },

    // ── 41 鳄鱼；42:5 「现在亲眼看见你」──────────────────────
    {
      kind: 'ask', utter: '你能用鱼钩钓上鳄鱼吗？', cmd: 'fish --hook 鳄鱼  # Permission denied', ref: '41:1',
      verse: [
        { text: '你能用鱼钩钓上鳄鱼吗？能用绳子压下它的舌头吗？', ref: '约伯记 41:1', hold: 6 },
        { text: '它打喷嚏就发出光来；它眼睛好像早晨的光线。<br>从它口中发出烧着的火把，与飞迸的火星；', ref: '约伯记 41:18–19', hold: 6.5 },
        { text: '它使深渊开滚如锅，使洋海如锅中的膏油。<br>它行的路随后发光，令人想深渊如同白发。', ref: '约伯记 41:31–32', hold: 7 },
        { text: '我从前风闻有你，现在亲眼看见你。', ref: '约伯记 42:5', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.76, 12, b.instant); W.setPop('whale', 0); lv('ybFlood', 0, b); lv('ybBehe', 0, b); lv('ybLeviA', 1, b); lv('ybLevi', 1, b); sfx(b, 'splash', { size: 3 }); face('job', -1); pose('job', 'stand'); }],
          [3, b => { sfx(b, 'wind', { soft: true }); }],
          [7, b => { sfx(b, 'splash', { size: 3 }); }],
          [10.4, b => {
            if (b.instant) return;
            const h = leviHead();
            fx().burst(h[0], h[1], { dur: 1.2, c: [255, 236, 190], motes: 0, strength: 0.5 });
            flash(b, { type: 'sneeze', dur: 2.2 });
            sfx(b, 'fire');
          }],
          [12.2, b => { flash(b, { type: 'sneeze', dur: 1.8, small: true }); }],
          // 旋风收去，鳄鱼也沉回海里：只剩落在约伯身上的光
          [23.4, b => { lv('ybWhirl', 0, b); lv('ybLeviA', 0, b); lv('ybSeen', 1, b); pose('job', 'pray'); face('job', 1); sfx(b, 'harp'); }],
          [28.5, b => { lv('ybSeen', 0.4, b); }],
        ]);
      },
    },

    // ── 42:7–17 「你们议论我不如我的仆人约伯说的是」；加倍的赐福 ─────
    {
      kind: 'judge', utter: '你们议论我不如我的仆人约伯说的是', cmd: 'diff 朋友 约伯  # 不如我的仆人约伯说的是', ref: '42:7',
      verse: [
        { text: '耶和华对约伯说话以后，就对提幔人以利法说：「我的怒气向你和你两个朋友发作，<br>因为你们议论我不如我的仆人约伯说的是。……我的仆人约伯就为你们祈祷。……」', ref: '约伯记 42:7–8', hold: 7.5 },
        { text: '约伯为他的朋友祈祷。耶和华就使约伯从苦境转回，<br>并且耶和华赐给他的比他从前所有的加倍。', ref: '约伯记 42:10', hold: 6.2 },
        { text: '这样，耶和华后来赐福给约伯比先前更多。<br>他有一万四千羊，六千骆驼，一千对牛，一千母驴。<br>他也有七个儿子，三个女儿。', ref: '约伯记 42:12–13', hold: 7 },
        { text: '此后，约伯又活了一百四十年，得见他的儿孙，直到四代。<br>这样，约伯年纪老迈，日子满足而死。', ref: '约伯记 42:16–17', hold: 6.2 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.36, 7, b.instant);
            lv('ybLeviA', 0, b); lv('ybSeen', 0, b); lv('ybGuard', 0, b); lv('ybCons', 0.2, b); lv('ybWhirl', 0, b);
            walk('job', X.altar - 0.026, { speed: 0.03, pose: 'raise' });
            walk('eliphaz', X.altar - 0.07, { speed: 0.03, pose: 'kneel' }); walk('bildad', X.altar - 0.1, { speed: 0.03, pose: 'kneel' });
            walk('zophar', X.altar + 0.03, { speed: 0.03, pose: 'kneel' });
            rm('elihu'); S.torch = 0;
            herd('bulls', { kind: 'cow', n: 3, x0: 1.04, x1: 1.12, layer: 2, label: '七只公牛' });
            herd('rams', { kind: 'ram', n: 3, x0: 1.06, x1: 1.14, layer: 2, label: '七只公羊' });
            cwalk('bulls', 0.93, 0.99, { speed: 0.04 }); cwalk('rams', 0.96, 1.02, { speed: 0.04 });
            avoid([0.5, 1]);
          }],
          [3.5, b => { lv('ybAltar', 1, b); sfx(b, 'fire'); }],
          // 约伯为朋友祈祷；耶和华使他从苦境转回
          [9.4, b => {
            lv('ybBless', 1, b); lv('bare', 0.08, b); lv('bloom', 0.9, b); lv('ybAsh', 0, b); lv('ybBuild', 1, b); lv('ybStand', 0, b);
            dress('job', { robe: ROBE.jobNew, hair: 'cloth' }); glow('job', 0.8);
            S.restored = 1; S.nights = 0;
            flash(b, { type: 'pulse', id: 'job', dur: 3.5 });
            sfx(b, 'harp'); sfx(b, 'build', { soft: true });
          }],
          [11.5, b => {
            crm('bulls'); crm('rams');
            herd('sheep2', { kind: 'sheep', n: 14, x0: 0.56, x1: 0.72, layer: 1, label: '羊群' });
            herd('oxen2', { kind: 'cow', n: 5, x0: 0.72, x1: 0.8, layer: 1, label: '牛' });
            animal('cam4', 'camel', 0.82, { facing: -1 }); animal('cam5', 'camel', 0.85, { facing: 1 }); animal('cam6', 'camel', 0.88, { facing: -1 });
            animal('cam7', 'camel', 0.91, { facing: 1 }); animal('cam8', 'camel', 0.94, { facing: -1 }); animal('cam9', 'camel', 0.97, { facing: 1 });
            animal('don3', 'donkey', 0.75, { facing: 1, label: '母驴' }); animal('don4', 'donkey', 0.78, { facing: -1, label: '母驴' });
            animal('don5', 'donkey', 0.8, { facing: 1, label: '母驴' }); animal('don6', 'donkey', 0.765, { facing: -1, label: '母驴' });
            crowd('shep2', { n: 2, x0: 0.6, x1: 0.7, layer: 1, label: '仆人' });
            sfx(b, 'bleat'); sfx(b, 'camel');
          }],
          [13, () => { pose('job', 'stand'); pose('eliphaz', 'stand'); pose('bildad', 'stand'); pose('zophar', 'stand'); }],
          [14.5, b => { walk('eliphaz', 1.1, { speed: 0.03 }); walk('bildad', 1.12, { speed: 0.03 }); walk('zophar', 1.14, { speed: 0.03 }); W.goTo(0.725, 15, b.instant); }],
          // 又有七个儿子、三个女儿：分立在约伯两旁（不挡住他，也不挡住磐石上的字）
          [17.8, b => {
            const kid = (off) => (m, i) => { const j = i + off; m.sex = j >= 7 ? 'f' : 'm'; m.age = 'adult'; m.robe = KIDS[(j + 3) % KIDS.length]; m.accent = null; m.v = 0.05 + 0.1 * ((j * 0.618) % 1); };
            crowd('kids2', { n: 5, x0: X.son - 0.028, x1: X.son + 0.006, layer: 2, label: '约伯的儿女', from: b.instant ? 'none' : 'light' }, kid(0));
            crowd('kids3', { n: 5, x0: X.son + 0.034, x1: X.son + 0.078, layer: 2, label: '约伯的儿女', from: b.instant ? 'none' : 'light' }, kid(5));
            walk('job', X.son + 0.02, { speed: 0.025 }); walk('wife', X.son + 0.1, { speed: 0.025 });
            dress('job', { v: 0.3 });
            sfx(b, 'laugh', { soft: true });
          }],
          [21, () => { rm('eliphaz'); rm('bildad'); rm('zophar'); }],
          [24.8, b => {
            const ch = (off) => (m, i) => { const j = i + off; m.sex = j % 2 ? 'f' : 'm'; m.age = 'child'; m.robe = KIDS[(j + 5) % KIDS.length]; m.accent = null; m.v = 0.2 + 0.04 * (j % 3); };
            crowd('gen', { n: 3, x0: X.son - 0.024, x1: X.son + 0.004, layer: 2, label: '约伯的儿孙', from: b.instant ? 'none' : 'light' }, ch(0));
            crowd('gen2', { n: 3, x0: X.son + 0.036, x1: X.son + 0.07, layer: 2, label: '约伯的儿孙', from: b.instant ? 'none' : 'light' }, ch(3));
            dress('job', { age: 'elder' });
            pose('job', 'sit'); face('job', -1);
            lv('ybAltar', 0, b);
          }],
          [28, b => { lv('ybBless', 0.6, b); glow('job', 0.9); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '约伯记', books: [18], title: '约伯', sub: '约伯记 1 — 42', tint: [210, 220, 240], music: 'flood',
    outro: 18,
    intro: [
      { text: '乌斯地有一个人名叫约伯；那人完全正直，敬畏神，远离恶事。', ref: '约伯记 1:1', hold: 6.5 },
      { text: '他生了七个儿子，三个女儿。<br>他的家产有七千羊，三千骆驼，五百对牛，五百母驴，并有许多仆婢。<br>这人在东方人中就为至大。', ref: '约伯记 1:2–3', hold: 8 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '约伯': { text: '乌斯地有一个人名叫约伯；那人完全正直，敬畏神，远离恶事。', ref: '约伯记 1:1' },
      '约伯的妻子': { text: '他的妻子对他说：「你仍然持守你的纯正吗？你弃掉神，死了吧！」', ref: '约伯记 2:9' },
      '提幔人以利法': { text: '神所惩治的人是有福的！所以你不可轻看全能者的管教。<br>因为他打破，又缠裹；他击伤，用手医治。', ref: '约伯记 5:17–18' },
      '书亚人比勒达': { text: '你起初虽然微小，终久必甚发达。', ref: '约伯记 8:7' },
      '拿玛人琐法': { text: '你考察就能测透神吗？你岂能尽情测透全能者吗？', ref: '约伯记 11:7' },
      '以利户': { text: '神的灵造我；全能者的气使我得生。', ref: '约伯记 33:4' },
      '报信的': { text: '……惟有我一人逃脱，来报信给你。', ref: '约伯记 1:15' },
      '长子的房屋': { text: '他的儿子按着日子各在自己家里设摆筵宴，<br>就打发人去，请了他们的三个姊妹来，与他们一同吃喝。', ref: '约伯记 1:4' },
      '约伯的家': { text: '你岂不是四面圈上篱笆围护他和他的家，并他一切所有的吗？', ref: '约伯记 1:10' },
      '坛': { text: '现在你们要取七只公牛，七只公羊，到我仆人约伯那里去，为自己献上燔祭，<br>我的仆人约伯就为你们祈祷。', ref: '约伯记 42:8' },
      '炉灰': { text: '因此我厌恶自己，在尘土和炉灰中懊悔。', ref: '约伯记 42:6' },
      '磐石': { text: '惟愿我的言语现在写上，都记录在书上；<br>用铁笔镌刻，用铅灌在磐石上，直存到永远。', ref: '约伯记 19:23–24' },
      '树墩': { text: '其根虽然衰老在地里，干也死在土中，<br>及至得了水气，还要发芽，又长枝条，像新栽的树一样。', ref: '约伯记 14:8–9' },
      '旋风': { text: '于是，耶和华从旋风中回答约伯说：<br>你要如勇士束腰；我问你，你可以指示我。', ref: '约伯记 40:6–7' },
      '山岩': { text: '它住在山岩，以山峰和坚固之所为家，', ref: '约伯记 39:28' },
      '野山羊': { text: '山岩间的野山羊几时生产，你知道吗？', ref: '约伯记 39:1' },
      '野驴': { text: '我使旷野作它的住处，使咸地当它的居所。', ref: '约伯记 39:6' },
      '野牛': { text: '野牛岂肯服事你？岂肯住在你的槽旁？', ref: '约伯记 39:9' },
      '大鹰': { text: '大鹰上腾在高处搭窝，岂是听你的吩咐吗？', ref: '约伯记 39:27' },
      '河马': { text: '它在神所造的物中为首；创造它的给它刀剑。', ref: '约伯记 40:19' },
      '鳄鱼': { text: '在地上没有像它造的那样，无所惧怕。<br>凡高大的，它无不藐视；它在骄傲的水族上作王。', ref: '约伯记 41:33–34' },
      '昴星': { text: '你能系住昴星的结吗？能解开参星的带吗？', ref: '约伯记 38:31' },
      '参星': { text: '他造北斗、参星、昴星，并南方的密宫；', ref: '约伯记 9:9' },
      '北斗': { text: '你能按时领出十二宫吗？能引导北斗和随它的众星吗？', ref: '约伯记 38:32' },
      '约伯的儿女': { text: '他给长女起名叫耶米玛，次女叫基洗亚，三女叫基连‧哈朴。<br>在那全地的妇女中找不着像约伯的女儿那样美貌。', ref: '约伯记 42:14–15' },
      '约伯的儿孙': { text: '此后，约伯又活了一百四十年，得见他的儿孙，直到四代。', ref: '约伯记 42:16' },
      '羊群': { text: '这样，耶和华后来赐福给约伯比先前更多。<br>他有一万四千羊，六千骆驼，一千对牛，一千母驴。', ref: '约伯记 42:12' },
      '骆驼': { text: '这样，耶和华后来赐福给约伯比先前更多。<br>他有一万四千羊，六千骆驼，一千对牛，一千母驴。', ref: '约伯记 42:12' },
      '七只公牛': { text: '于是提幔人以利法、书亚人比勒达、拿玛人琐法照着耶和华所吩咐的去行；<br>耶和华就悦纳约伯。', ref: '约伯记 42:9' },
      '七只公羊': { text: '于是提幔人以利法、书亚人比勒达、拿玛人琐法照着耶和华所吩咐的去行；<br>耶和华就悦纳约伯。', ref: '约伯记 42:9' },
    },
  });
})(window.GS);
