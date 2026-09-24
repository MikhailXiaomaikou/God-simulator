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
    ekTrees: ['lin', 0.09],    // 河两岸的树木：其果可作食物，叶子乃为治病
  const RTREES = (function () { const a = []; for (let i = 0; i < 16; i++) a.push({ t: 0.26 + 0.7 * (i / 15) + 0.012 * (hsh(i) - 0.5), side: i % 2 ? 1 : -1, s: 0.85 + 0.35 * hsh(i * 3.7), d: hsh(i * 5.1) * 0.35 }); return a; })();
  function treePt(tr) {
    const p = riverAt(tr.t), off = (riverW(tr.t) * 0.5 + 7 * SU()) * tr.side;
    return [p.x + off * 0.25, p.y + off * 0.8];
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
  function drawHeal(ctx) {
    const k = lv('ekHeal');
    if (k < 0.01 || lv('ekFlow') < 0.9) return;
    const m = riverAt(1), R = (0.08 + 0.95 * U.easeOut(k)) * W.w;
    const y0 = W.horizonY + 2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.translate(m.x, m.y); ctx.scale(1, 0.55);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    gr.addColorStop(0, U.rgba(110, 230, 210, 0.2 * k)); gr.addColorStop(0.55, U.rgba(90, 210, 200, 0.1 * k)); gr.addColorStop(1, U.rgba(80, 200, 200, 0));
    ctx.fillStyle = gr; ctx.fillRect(-R, (y0 - m.y) / 0.55, 2 * R, R + (m.y - y0) / 0.55);
    ctx.setTransform(ctx.getTransform().scale(1, 1 / 0.55));
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 粼粼的光
    ctx.fillStyle = 'rgb(220,255,244)';
    for (let i = 0; i < 44; i++) {
      const x = rt(i * 3 + 1400) * W.w * 0.62, y = lerp(W.horizonY + 4, W.h, Math.pow(rt(i * 3 + 1401), 0.7));
      const dx = x - m.x, dy = (y - m.y) / 0.55;
      if (dx * dx + dy * dy > R * R) continue;
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
      else if (pass === 'seaNear') { drawHeal(ctx); drawMountain(ctx); drawTemple(ctx); }
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
