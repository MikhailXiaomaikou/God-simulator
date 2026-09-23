/* ─────────────────────────────────────────────────────────────
 * cast.js —— 创世记中的人物：亚当、夏娃、该隐、亚伯、挪亚、亚伯拉罕、撒拉、以撒、雅各、约瑟……
 *
 * 他们都是小小的抽象剪影（无面目），站在大地的某一层上，由各卷的情节调度：
 *   GS.cast.add(id, { label, sex, age, layer, x, facing, pose, robe, glow, from })
 *   GS.cast.walk(id, x, { speed, pose })   GS.cast.place(id, x)   GS.cast.pose(id, pose)
 *   GS.cast.face(id, dirOrX)   GS.cast.follow(id, otherId, dx)   GS.cast.remove(id, { fade })
 *   GS.cast.crowd(gid, { n, x0, x1, layer, label, robe })   GS.cast.scatter(gid)   GS.cast.removeCrowd(gid)
 * 横坐标 x 一律用 0..1 的比例（随屏幕缩放不变）。
 * W.replaying 为真时（恢复存档 / 快进情节），一切动作直接到位。
 *
 * pose：'stand' 'walk' 'kneel' 'bow' 'lie' 'sit' 'raise'（举手）'pray' 'carry' 'point' 'wrestle' 'fall'（仆倒）
 * age：'adult' 'elder' 'child' 'baby'；sex：'m' | 'f'；from：'dust'（从尘土而出）| 'fade' | 'light' | 'none'
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU } = U;

  const people = new Map();     // id → figure
  const crowds = new Map();     // gid → { members: [...] }
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  const ROBE_M = [120, 92, 70], ROBE_F = [150, 108, 96];

  const groundY = (layer, x) => (GS.land && GS.land.groundY ? GS.land.groundY(layer, x) : W.ridgeY(layer, x));
  const PASS = { 1: 'mid', 2: 'near', 0: 'far' };

  function mk(id, o) {
    return {
      id, label: o.label || '', sex: o.sex || 'm', age: o.age || 'adult',
      layer: o.layer == null ? 2 : o.layer,
      nx: o.x == null ? 0.7 : o.x, tx: null, speed: o.speed || 0.035,
      facing: o.facing || 1, pose: o.pose || 'stand', afterWalk: 'stand',
      robe: o.robe || (o.sex === 'f' ? ROBE_F : ROBE_M),
      glow: o.glow == null ? 0.25 : o.glow,
      alpha: 0, targetAlpha: 1, emerge: 1, from: o.from || 'fade',
      phase: Math.random() * TAU, follow: null, fdx: 0, scale: o.scale || 1,
      poseT: 1, prevPose: o.pose || 'stand',
    };
  }

  // ── 人物 ────────────────────────────────────────────────────
  function add(id, o) {
    o = o || {};
    let p = people.get(id);
    if (p) { Object.assign(p, { label: o.label || p.label }); if (o.x != null) p.nx = o.x; if (o.pose) setPose(p, o.pose); p.targetAlpha = 1; return p; }
    p = mk(id, o);
    people.set(id, p);
    if (W.replaying || o.from === 'none') { p.alpha = 1; p.emerge = 1; }
    else {
      p.alpha = 0; p.emerge = 0;
      const x = p.nx * W.w, y = groundY(p.layer, x);
      if (p.from === 'dust' && GS.fx) GS.fx.dust(x, y, 40, [230, 206, 162], 10 * W.unit);
      if (p.from === 'light' && GS.fx) GS.fx.sparkle(x, y - 20 * W.unit, 30, [255, 244, 220], 12, PASS[p.layer]);
    }
    return p;
  }
  function remove(id, o) {
    const p = people.get(id);
    if (!p) return;
    if (W.replaying || (o && o.fade === false)) people.delete(id);
    else { p.targetAlpha = 0; p.dying = true; }
  }
  const has = id => people.has(id) && !people.get(id).dying;
  const get = id => people.get(id) || null;
  function place(id, x, layer) {
    const p = people.get(id); if (!p) return;
    p.nx = x; p.tx = null; if (layer != null) p.layer = layer;
  }
  function walk(id, x, o) {
    const p = people.get(id); if (!p) return;
    o = o || {};
    if (o.layer != null) p.layer = o.layer;
    if (W.replaying) { p.nx = x; p.tx = null; setPose(p, o.pose || 'stand'); return; }
    p.tx = x; p.speed = o.speed || 0.035; p.afterWalk = o.pose || 'stand';
    setPose(p, 'walk');
    p.facing = x >= p.nx ? 1 : -1;
  }
  function setPose(p, pose) { if (p.pose !== pose) { p.prevPose = p.pose; p.pose = pose; p.poseT = W.replaying ? 1 : 0; } }
  // 正在走路时改姿势：走到了再换（与"瞬间重演"时的结果一致）；o.stop 则立即停步
  function pose(id, ps, o) {
    const p = people.get(id); if (!p) return;
    if (p.tx != null && !(o && o.stop) && !W.replaying) { p.afterWalk = ps; return; }
    p.tx = null; setPose(p, ps);
  }
  // face(id, 1 | -1)：朝右 / 朝左；face(id, 0.3)：朝向画面比例 0.3 处；face(id, 'eve')：朝向某人
  function face(id, d) {
    const p = people.get(id); if (!p) return;
    if (d === 1 || d === -1) p.facing = d;
    else if (typeof d === 'number') p.facing = d >= p.nx ? 1 : -1;
    else if (typeof d === 'string' && people.get(d)) p.facing = people.get(d).nx >= p.nx ? 1 : -1;
  }
  function follow(id, other, dx) { const p = people.get(id); if (p) { p.follow = other; p.fdx = dx == null ? -0.03 : dx; } }
  function glow(id, v) { const p = people.get(id); if (p) p.glow = v; }
  function clear(o) { for (const id of Array.from(people.keys())) remove(id, o); for (const g of Array.from(crowds.keys())) removeCrowd(g, o); }

  // ── 人群 ────────────────────────────────────────────────────
  function crowd(gid, o) {
    o = o || {};
    const n = o.n || 12, members = [];
    for (let i = 0; i < n; i++) {
      const m = mk(gid + ':' + i, {
        label: o.label || '', sex: Math.random() < 0.5 ? 'm' : 'f', age: Math.random() < 0.2 ? 'child' : 'adult',
        layer: o.layer == null ? 2 : o.layer, x: lerp(o.x0 == null ? 0.55 : o.x0, o.x1 == null ? 0.95 : o.x1, (i + Math.random()) / n),
        facing: Math.random() < 0.5 ? 1 : -1, pose: o.pose || 'stand', robe: o.robe || U.pick([[132, 104, 78], [110, 86, 70], [150, 118, 90], [96, 80, 72]]),
        glow: o.glow == null ? 0.08 : o.glow, scale: 0.9 + Math.random() * 0.15,
      });
      if (W.replaying || o.from === 'none') { m.alpha = 1; m.emerge = 1; } else { m.alpha = 0; m.emerge = 0; m.delay = Math.random() * 1.5; }
      m.mill = o.mill !== false;
      members.push(m);
    }
    crowds.set(gid, { members, o });
    return members;
  }
  function crowdWalk(gid, x0, x1, o) {
    const g = crowds.get(gid); if (!g) return;
    g.members.forEach((m, i) => {
      const x = lerp(x0, x1, (i + Math.random()) / g.members.length);
      if (W.replaying) { m.nx = x; m.tx = null; } else { m.tx = x; m.speed = (o && o.speed) || 0.03 + Math.random() * 0.01; m.afterWalk = (o && o.pose) || 'stand'; setPose(m, 'walk'); m.facing = x >= m.nx ? 1 : -1; }
    });
  }
  function crowdPose(gid, ps) { const g = crowds.get(gid); if (g) g.members.forEach(m => { m.tx = null; setPose(m, ps); }); }
  // 四散：各往远处走去，渐渐隐没（巴别）
  function scatter(gid) {
    const g = crowds.get(gid); if (!g) return;
    g.members.forEach(m => {
      const x = m.nx < 0.75 ? rand(-0.1, 0.35) : rand(0.85, 1.12);
      if (W.replaying) { m.dying = true; m.alpha = 0; } else { m.tx = x; m.speed = 0.04 + Math.random() * 0.03; setPose(m, 'walk'); m.facing = x >= m.nx ? 1 : -1; m.fadeOnArrive = true; m.mill = false; }
    });
  }
  function removeCrowd(gid, o) {
    const g = crowds.get(gid); if (!g) return;
    if (W.replaying || (o && o.fade === false)) crowds.delete(gid);
    else g.members.forEach(m => { m.targetAlpha = 0; m.dying = true; });
  }

  // ── 更新 ────────────────────────────────────────────────────
  function step(p, dt) {
    if (p.delay > 0) { p.delay -= dt; return; }
    p.alpha = U.approach(p.alpha, p.targetAlpha, p.dying ? 1.2 : 1.6, dt);
    if (p.emerge < 1) p.emerge = Math.min(1, p.emerge + dt / 1.6);
    if (p.poseT < 1) p.poseT = Math.min(1, p.poseT + dt / 0.6);
    if (p.follow) {
      const o = people.get(p.follow);
      if (o) { const want = o.nx + p.fdx * (o.facing || 1) * -1; if (Math.abs(want - p.nx) > 0.012) { p.tx = want; p.speed = Math.max(0.03, o.speed || 0.035); if (p.pose !== 'walk') setPose(p, 'walk'); } }
    }
    if (p.tx != null) {
      const d = p.tx - p.nx, v = p.speed * dt * (W.fast || 1);
      if (Math.abs(d) <= v) {
        p.nx = p.tx; p.tx = null; setPose(p, p.afterWalk || 'stand');
        if (p.fadeOnArrive) { p.targetAlpha = 0; p.dying = true; }
      } else { p.nx += Math.sign(d) * v; p.facing = Math.sign(d) || p.facing; }
    } else if (p.mill && !W.ritual.holding && Math.random() < dt * 0.05) {
      // 人群里的人偶尔挪动几步
      walkM(p, clamp(p.nx + rand(-0.03, 0.03), 0.02, 0.98));
    }
    // 神言说时，众人转向神的灵
    if (W.ritual.holding && p.pose !== 'lie' && p.pose !== 'wrestle') p.facing = W.spirit.x >= p.nx * W.w ? 1 : -1;
  }
  function walkM(m, x) { m.tx = x; m.speed = 0.015; m.afterWalk = m.pose === 'walk' ? 'stand' : m.pose; setPose(m, 'walk'); }

  function update(dt) {
    for (const [id, p] of people) { step(p, dt); if (p.dying && p.alpha < 0.01) people.delete(id); }
    for (const [gid, g] of crowds) {
      g.members.forEach(m => step(m, dt));
      g.members = g.members.filter(m => !(m.dying && m.alpha < 0.01));
      if (!g.members.length) crowds.delete(gid);
    }
  }

  // ── 画人 ────────────────────────────────────────────────────
  // 由姿势得出关节（以脚下为原点，向上为负，单位 = 身高 h）
  function joints(pose, t, sex) {
    const sw = Math.sin(t);
    switch (pose) {
      case 'walk': return { hip: [0, -0.48], sh: [0.02, -0.8], head: [0.03, -0.92], lf: [0.13 * sw, 0], rf: [-0.13 * sw, 0], lh: [-0.1 * sw, -0.52], rh: [0.1 * sw, -0.52], bob: Math.abs(Math.cos(t)) * 0.015 };
      case 'kneel': return { hip: [0, -0.3], sh: [0.02, -0.6], head: [0.03, -0.72], lf: [-0.2, 0], rf: [0.08, -0.02], knee: true, lh: [0.08, -0.4], rh: [0.1, -0.42] };
      case 'pray': return { hip: [0, -0.3], sh: [0.02, -0.6], head: [0.04, -0.72], lf: [-0.2, 0], rf: [0.08, -0.02], knee: true, lh: [0.14, -0.74], rh: [0.16, -0.76] };
      case 'bow': return { hip: [0, -0.46], sh: [0.3, -0.6], head: [0.4, -0.58], lf: [0.02, 0], rf: [-0.04, 0], lh: [0.36, -0.36], rh: [0.3, -0.34] };
      case 'fall': return { hip: [-0.12, -0.2], sh: [0.26, -0.12], head: [0.38, -0.1], lf: [-0.32, 0], rf: [-0.3, -0.02], lh: [0.46, -0.04], rh: [0.44, -0.02] };
      case 'lie': return { hip: [0, -0.06], sh: [0.34, -0.07], head: [0.46, -0.08], lf: [-0.44, -0.03], rf: [-0.42, -0.05], lh: [0.12, -0.08], rh: [0.16, -0.1], lying: true };
      case 'sit': return { hip: [0, -0.24], sh: [0.02, -0.56], head: [0.03, -0.68], lf: [0.28, 0], rf: [0.24, 0], lh: [0.18, -0.3], rh: [0.14, -0.32] };
      case 'raise': return { hip: [0, -0.48], sh: [0, -0.8], head: [0, -0.92], lf: [0.06, 0], rf: [-0.06, 0], lh: [-0.16, -1.08], rh: [0.16, -1.08] };
      case 'carry': return { hip: [0, -0.48], sh: [0.03, -0.8], head: [0.04, -0.92], lf: [0.06, 0], rf: [-0.05, 0], lh: [0.2, -0.62], rh: [0.22, -0.66] };
      case 'point': return { hip: [0, -0.48], sh: [0.02, -0.8], head: [0.03, -0.92], lf: [0.06, 0], rf: [-0.06, 0], lh: [-0.06, -0.5], rh: [0.4, -0.86] };
      case 'wrestle': return { hip: [0, -0.44], sh: [0.18, -0.72], head: [0.22, -0.82], lf: [-0.16, 0], rf: [0.12, 0], lh: [0.42, -0.7], rh: [0.4, -0.58] };
      default: return { hip: [0, -0.48], sh: [0, -0.8], head: [0.01, -0.92], lf: [0.06, 0], rf: [-0.06, 0], lh: [-0.1, -0.5], rh: [0.1, -0.5] };
    }
  }
  function mixJ(a, b, t) {
    const o = {};
    for (const k in b) o[k] = Array.isArray(b[k]) && a[k] ? [lerp(a[k][0], b[k][0], t), lerp(a[k][1], b[k][1], t)] : b[k];
    return o;
  }

  let glowSprite = null;
  function sprite() {
    if (glowSprite) return glowSprite;
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(220,235,255,0.9)'); gr.addColorStop(0.35, 'rgba(180,210,255,0.35)'); gr.addColorStop(1, 'rgba(160,190,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (glowSprite = c);
  }

  function drawFigure(ctx, p) {
    if (p.alpha < 0.01 || p.delay > 0) return;
    const x = p.nx * W.w;
    if (x < -40 || x > W.w + 40) return;
    const gy = groundY(p.layer, x);
    if (!isFinite(gy) || gy >= W.waterlineY(p.layer) + 2) return;
    const depth = W.LAYERS[p.layer] ? W.LAYERS[p.layer].depth : 0;
    const h = 34 * W.layerScale(p.layer) * (AGE_H[p.age] || 1) * p.scale * (W.w < 600 ? 1.15 : 1);
    const t = W.t * 5.2 * (p.speed / 0.035) + p.phase;
    let J = joints(p.pose, t, p.sex);
    if (p.poseT < 1) J = mixJ(joints(p.prevPose, t, p.sex), J, U.easeInOut(p.poseT));
    const f = p.facing;
    const em = p.emerge < 1 ? U.easeOut(p.emerge) : 1;
    const sink = (1 - em) * h * 0.6;
    const X = (v) => x + v[0] * h * f;
    const Y = (v) => gy + v[1] * h + sink - (J.bob || 0) * h;
    ctx.globalAlpha = p.alpha * (0.3 + 0.7 * em);

    const base = W.shade(p.robe, depth);
    const col = U.rgb(base[0], base[1], base[2]);
    const lit = W.shade([Math.min(255, p.robe[0] * 1.7 + 50), Math.min(255, p.robe[1] * 1.6 + 40), Math.min(255, p.robe[2] * 1.5 + 30)], depth, 0.25);
    const rim = U.rgb(lit[0], lit[1], lit[2]);

    // 接地的影
    if (p.layer === 2 && !J.lying) {
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.beginPath(); ctx.ellipse(x, gy + 1, h * 0.2, h * 0.04, 0, 0, TAU); ctx.fill();
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // 腿
    ctx.strokeStyle = col;
    ctx.lineWidth = Math.max(1, h * 0.085);
    ctx.beginPath();
    if (J.knee) {
      ctx.moveTo(X(J.hip), Y(J.hip)); ctx.lineTo(X([J.hip[0] + 0.12, -0.02]), Y([0, -0.02])); ctx.lineTo(X(J.lf), Y(J.lf));
    } else {
      ctx.moveTo(X(J.hip), Y(J.hip)); ctx.lineTo(X(J.lf), Y(J.lf));
      ctx.moveTo(X(J.hip), Y(J.hip)); ctx.lineTo(X(J.rf), Y(J.rf));
    }
    ctx.stroke();
    // 袍：由肩到腰（女子的袍更长）
    const robeLen = p.sex === 'f' ? 0.34 : 0.2;
    ctx.fillStyle = col;
    ctx.beginPath();
    const sw = h * 0.1, hw = h * (p.sex === 'f' ? 0.15 : 0.12);
    const shx = X(J.sh), shy = Y(J.sh), hx = X(J.hip), hy = Y(J.hip);
    const dx = hx - shx, dy = hy - shy, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const ex = hx + dx / L * robeLen * h, ey = hy + dy / L * robeLen * h;
    ctx.moveTo(shx + nx * sw, shy + ny * sw);
    ctx.lineTo(ex + nx * hw, ey + ny * hw);
    ctx.lineTo(ex - nx * hw, ey - ny * hw);
    ctx.lineTo(shx - nx * sw, shy - ny * sw);
    ctx.closePath(); ctx.fill();
    // 手臂
    ctx.lineWidth = Math.max(1, h * 0.07);
    ctx.beginPath();
    ctx.moveTo(shx, shy); ctx.lineTo(X(J.lh), Y(J.lh));
    ctx.moveTo(shx, shy); ctx.lineTo(X(J.rh), Y(J.rh));
    ctx.stroke();
    // 头（女子有长发）
    const hr = h * 0.085;
    ctx.beginPath(); ctx.arc(X(J.head), Y(J.head), hr, 0, TAU); ctx.fill();
    if (p.sex === 'f' && !J.lying) {
      ctx.beginPath(); ctx.ellipse(X(J.head) - f * hr * 0.5, Y(J.head) + hr * 0.9, hr * 0.7, hr * 1.4, 0, 0, TAU); ctx.fill();
    }
    // 迎光的一道边
    ctx.strokeStyle = rim; ctx.lineWidth = Math.max(0.6, h * 0.025);
    ctx.globalAlpha *= 0.7;
    ctx.beginPath(); ctx.arc(X(J.head), Y(J.head), hr, -Math.PI * 0.95, -Math.PI * 0.2); ctx.stroke();
    ctx.globalAlpha = p.alpha * (0.3 + 0.7 * em);
    // 内里一点灵的光（神的形像）
    if (p.glow > 0.01) {
      const g = p.glow * (0.6 + 0.4 * W.night);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.alpha * g * 0.55;
      const s = h * 0.55;
      ctx.drawImage(sprite(), X(J.sh) - s / 2, Y(J.sh) - s / 2 + h * 0.08, s, s);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  function draw(ctx, pass) {
    for (const p of people.values()) if (PASS[p.layer] === pass) drawFigure(ctx, p);
    for (const g of crowds.values()) for (const m of g.members) if (PASS[m.layer] === pass) drawFigure(ctx, m);
  }

  function pick(x, y, r) {
    let best = null;
    const test = p => {
      if (!p.label || p.alpha < 0.3) return;
      const px = p.nx * W.w, py = groundY(p.layer, px) - 18 * W.layerScale(p.layer);
      const d = Math.hypot(px - x, py - y);
      if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 18 * W.layerScale(p.layer), d };
    };
    for (const p of people.values()) test(p);
    for (const g of crowds.values()) g.members.forEach(test);
    return best;
  }

  function reset() { people.clear(); crowds.clear(); }

  GS.cast = {
    init() {}, resize() {}, update, draw, reset, restore() {}, pick,
    add, remove, has, get, place, walk, pose, face, follow, glow, clear,
    crowd, crowdWalk, crowdPose, scatter, removeCrowd,
    list: () => Array.from(people.keys()),
    get people() { return people; }, get crowds() { return crowds; },
  };
})(window.GS);
