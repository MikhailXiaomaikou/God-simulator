/* ─────────────────────────────────────────────────────────────
 * story.js —— 剧本：七日的每一句话语
 *
 * 每一句话语（stage）只成就它自己的一步，绝不擅自越过上帝。
 * apply(c) 只设定世界的"目标"（程度、数量、起点），从而：
 *   - 正常言说时，世界逐渐走向目标（带动画、声音、经文）；
 *   - 恢复存档时（c.instant），同一段代码瞬间对齐，无需另写一套。
 * c = { instant, x, y }  —— x, y 是话语成就时神的灵所在（像素）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, rand } = U;
  const fx = () => GS.fx, au = () => GS.audio;

  const TINT = [
    [190, 215, 255], // 起初
    [255, 240, 200], // 一：光
    [180, 212, 255], // 二：穹苍
    [196, 240, 176], // 三：地与草木
    [255, 222, 150], // 四：光体
    [150, 228, 240], // 五：水与空中的生命
    [255, 204, 164], // 六：活物与人
    [255, 250, 240], // 七：安息
  ];

  // ── 位置助手：话语在灵所在之处成就；若灵不在其疆域，则取最近的一处 ──
  function seaPoint(x, y) {
    if (W.isSea(x, y) && y > W.horizonY + W.h * 0.05) return [x, y];
    for (let r = 20; r < Math.max(W.w, W.h); r += 24) {
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * U.TAU;
        const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
        if (px > 10 && px < W.w - 10 && py < W.h - 10 && py > W.horizonY + W.h * 0.05 && W.isSea(px, py)) return [px, py];
      }
    }
    return [W.w * 0.14, W.h * 0.82];
  }
  function landPoint(x) {
    const span = W.landSpan(2, W.h * 0.02) || [W.w * 0.5, W.w];
    const px = clamp(x, span[0] + 20, span[1] - 20);
    return [px, W.ridgeBaseY(2, px)];
  }
  function skyPoint(x, y) { return [clamp(x, 30, W.w - 30), clamp(y, W.h * 0.1, W.horizonY - W.h * 0.06)]; }

  // 名字的来处
  const inSea = () => { for (let k = 0; k < 30; k++) { const x = rand(0, W.w), y = rand(W.horizonY + 4, W.h); if (W.isSea(x, y)) return [x, y]; } return [rand(0, W.w * 0.25), rand(W.horizonY, W.h)]; };
  const inLand = () => { const x = W.randomLandX(2); const top = W.ridgeBaseY(2, x); return [x, top + Math.random() * (W.h - top)]; };
  const nearCore = () => { const a = Math.random() * U.TAU, r = Math.sqrt(Math.random()) * Math.min(W.w, W.h) * 0.4; return [W.core.x + Math.cos(a) * r, W.core.y + Math.sin(a) * r * 0.7]; };
  const fromEdges = () => { const s = Math.random(); return s < 0.25 ? [0, rand(0, W.h)] : s < 0.5 ? [W.w, rand(0, W.h)] : s < 0.75 ? [rand(0, W.w), 0] : [rand(0, W.w), W.h]; };
  const fromDome = () => { const nx = Math.random(); return [nx * W.w, (0.15 + 0.55 * (nx - 0.5) * (nx - 0.5)) * W.h + rand(-25, 25)]; };

  const M = () => Math.min(W.w, W.h);

  // 「有晚上，有早晨」——每一日的收尾
  function eveningMorning(day, ref, c) {
    W.passDay(19, c.instant);
    if (!c.instant) au().daySeal && au().daySeal(day);
  }

  const STAGES = [
    // ── 起初 ─────────────────────────────────────────────────
    {
      day: 0, utter: '起初，神创造天地', cmd: 'git init 天地', ref: '1:1',
      verse: [
        { text: '起初，神创造天地。', ref: '创世记 1:1' },
        { text: '地是空虚混沌，渊面黑暗；<br>神的灵运行在水面上。', ref: '创世记 1:2', hold: 6 },
      ],
      apply(c) { W.set('deep', 1, c.instant); },
    },

    // ── 第一日 ───────────────────────────────────────────────
    {
      day: 1, utter: '要有光', cmd: 'add 光', ref: '1:3',
      verse: [{ text: '神说：「要有光」，就有了光。', ref: '创世记 1:3' }],
      apply(c) {
        W.set('light', 1, c.instant);
        if (!c.instant) { fx().burst(c.x, c.y); W.flash = 1; }
      },
    },
    {
      day: 1, utter: '把光暗分开', cmd: 'separate 光 暗', ref: '1:4',
      verse: [{ text: '神看光是好的，就把光暗分开了。', ref: '创世记 1:4' }],
      apply(c) { W.set('gather', 1, c.instant); },
    },
    {
      day: 1, utter: '称光为昼，称暗为夜', cmd: 'name 光 as 昼, 暗 as 夜', ref: '1:5',
      verse: [{ text: '神称光为「昼」，称暗为「夜」。', ref: '创世记 1:5' }],
      apply(c) {
        W.set('dayNight', 1, c.instant);
        if (!c.instant) {
          fx().name('昼', W.w * 0.5, W.h * 0.3, M() * 0.24, [255, 228, 170], nearCore);
          fx().name('夜', W.w * 0.5, W.h * 0.42, M() * 0.2, [150, 172, 236], fromEdges, { delay: fx().name.DURATION + 0.2 });
          au().nameChime && au().nameChime();
        }
      },
    },
    {
      day: 1, utter: '有晚上，有早晨', cmd: 'commit -m "头一日"', ref: '1:5', evening: true,
      verse: [{ text: '有晚上，有早晨，这是头一日。', ref: '创世记 1:5', hold: 7 }],
      apply(c) { eveningMorning(1, '1:5', c); },
    },

    // ── 第二日 ───────────────────────────────────────────────
    {
      day: 2, utter: '诸水之间要有穹苍', cmd: 'add 穹苍 --between 水 水', ref: '1:6–7',
      verse: [
        { text: '神说：「诸水之间要有穹苍，将水与水分开。」', ref: '创世记 1:6' },
        { text: '神就造出穹苍，将穹苍以上的水、<br>穹苍以下的水分开了。事就这样成了。', ref: '创世记 1:7', hold: 6 },
      ],
      apply(c) { W.set('vault', 1, c.instant); },
    },
    {
      day: 2, utter: '称穹苍为天', cmd: 'name 穹苍 as 天', ref: '1:8',
      verse: [{ text: '神称穹苍为「天」。', ref: '创世记 1:8' }],
      apply(c) {
        W.set('clouds', 1, c.instant);
        if (!c.instant) {
          fx().name('天', W.w * 0.5, W.h * 0.25, M() * 0.28, [205, 228, 255], fromDome);
          au().nameChime && au().nameChime();
        }
      },
    },
    {
      day: 2, utter: '有晚上，有早晨', cmd: 'commit -m "第二日"', ref: '1:8', evening: true,
      verse: [{ text: '有晚上，有早晨，是第二日。', ref: '创世记 1:8', hold: 7 }],
      apply(c) { eveningMorning(2, '1:8', c); },
    },

    // ── 第三日 ───────────────────────────────────────────────
    {
      day: 3, utter: '天下的水要聚在一处，使旱地露出来', cmd: 'gather 水 && add 旱地', ref: '1:9',
      verse: [
        { text: '神说：「天下的水要聚在一处，使旱地露出来。」', ref: '创世记 1:9' },
        { text: '事就这样成了。', ref: '创世记 1:9' },
      ],
      apply(c) { W.set('land', 1, c.instant); },
    },
    {
      day: 3, utter: '称旱地为地，称水的聚处为海', cmd: 'name 旱地 as 地, 水 as 海', ref: '1:10',
      verse: [{ text: '神称旱地为「地」，称水的聚处为「海」。<br>神看着是好的。', ref: '创世记 1:10', hold: 6 }],
      apply(c) {
        if (!c.instant) {
          const sea = seaPoint(W.w * 0.14, W.h * 0.8);
          fx().name('海', Math.max(M() * 0.1, Math.min(sea[0], W.w * 0.17)), W.h * 0.8, M() * 0.13, [175, 215, 255], inSea);
          const lx = W.landSpan(2, W.h * 0.05);
          const cx = lx ? (lx[0] + lx[1]) / 2 + W.w * 0.05 : W.w * 0.72;
          fx().name('地', cx, (W.ridgeBaseY(2, cx) + W.h) / 2, M() * 0.12, [255, 205, 150], inLand, { delay: fx().name.DURATION + 0.2 });
          au().nameChime && au().nameChime();
        }
      },
    },
    {
      day: 3, utter: '地要发生青草和结种子的菜蔬', cmd: 'grow 青草 菜蔬 --from 灵', ref: '1:11',
      verse: [{ text: '神说：「地要发生青草和结种子的菜蔬，<br>并结果子的树木，各从其类，果子都包着核。」', ref: '创世记 1:11', hold: 6.5 }],
      apply(c) {
        const p = landPoint(c.x);
        W.setOrigin('grass', p[0], p[1]);
        W.setOrigin('herbs', p[0], p[1]);
        W.set('grass', 1, c.instant);
        W.set('herbs', 1, c.instant);
        if (!c.instant) fx().sparkle(p[0], p[1] - 6, 30, [200, 255, 190], 20, 'near');
      },
    },
    {
      day: 3, utter: '并结果子的树木，各从其类', cmd: 'grow 树木 --kind 各从其类', ref: '1:12',
      verse: [{ text: '于是地发生了青草和结种子的菜蔬，各从其类；<br>并结果子的树木，各从其类。神看着是好的。', ref: '创世记 1:12', hold: 6.5 }],
      apply(c) {
        const p = landPoint(c.x);
        W.setOrigin('trees', p[0], p[1]);
        W.set('trees', 1, c.instant);
        if (!c.instant) fx().sparkle(p[0], p[1] - 10, 40, [255, 236, 170], 30, 'near');
      },
    },
    {
      day: 3, utter: '有晚上，有早晨', cmd: 'commit -m "第三日"', ref: '1:13', evening: true,
      verse: [{ text: '有晚上，有早晨，是第三日。', ref: '创世记 1:13', hold: 7 }],
      apply(c) { eveningMorning(3, '1:13', c); },
    },

    // ── 第四日 ───────────────────────────────────────────────
    {
      day: 4, utter: '天上要有光体，可以分昼夜', cmd: 'add 光体 --in 穹苍', ref: '1:14–15',
      verse: [
        { text: '神说：「天上要有光体，可以分昼夜，<br>作记号，定节令、日子、年岁，', ref: '创世记 1:14' },
        { text: '并要发光在天空，普照在地上。」事就这样成了。', ref: '创世记 1:15' },
      ],
      apply(c) {
        W.set('lights', 1, c.instant);
        if (!c.instant) { fx().ring(W.sun.x, W.sun.y, [255, 230, 170], M() * 0.8, 2.4, 3); W.flash = 0.6; }
      },
    },
    {
      day: 4, utter: '大的管昼，小的管夜', cmd: 'assign 日 → 昼, 月 → 夜', ref: '1:16',
      verse: [{ text: '于是神造了两个大光，大的管昼，小的管夜，', ref: '创世记 1:16' }],
      apply(c) {
        W.set('moon', 1, c.instant);
        if (!c.instant) fx().ring(W.moon.x, W.moon.y, [200, 214, 255], M() * 0.4, 2.2, 2);
      },
    },
    {
      day: 4, utter: '又造众星', cmd: 'for (星 of 众星) 摆列(星, 天空)', ref: '1:16–18',
      verse: [
        { text: '又造众星，就把这些光摆列在天空，普照在地上，', ref: '创世记 1:16–17' },
        { text: '管理昼夜，分别明暗。神看着是好的。', ref: '创世记 1:18' },
      ],
      apply(c) {
        W.set('stars', 1, c.instant);
        if (!c.instant) {
          const tg = [];
          for (let i = 0; i < 220; i++) tg.push([rand(0, W.w), Math.pow(Math.random(), 1.3) * (W.horizonY - 12), rand(0.7, 1.9)]);
          fx().sow(c.x, c.y, tg, [255, 250, 236], { stagger: 1.2, dur: 3.2, pass: 'sky' });
        }
      },
    },
    {
      day: 4, utter: '有晚上，有早晨', cmd: 'commit -m "第四日"', ref: '1:19', evening: true,
      verse: [{ text: '有晚上，有早晨，是第四日。', ref: '创世记 1:19', hold: 7 }],
      apply(c) { eveningMorning(4, '1:19', c); },
    },

    // ── 第五日 ───────────────────────────────────────────────
    {
      day: 5, utter: '水要多多滋生有生命的物', cmd: 'spawn 鱼 大鱼 --count 多多', ref: '1:20–21',
      verse: [
        { text: '神说：「水要多多滋生有生命的物；<br>要有雀鸟飞在地面以上，天空之中。」', ref: '创世记 1:20' },
        { text: '神就造出大鱼和水中所滋生各样有生命的动物，各从其类。', ref: '创世记 1:21' },
      ],
      apply(c) {
        const p = seaPoint(c.x, c.y);
        W.set('life', 1, c.instant);
        W.setPop('fish', 70, p[0], p[1], c.instant);
        W.setPop('whale', 2, p[0], p[1], c.instant);
        if (!c.instant) fx().sparkle(p[0], p[1], 60, [170, 240, 255], 26, 'top');
      },
    },
    {
      day: 5, utter: '要有雀鸟飞在天空之中', cmd: 'spawn 雀鸟 --in 天空', ref: '1:21',
      verse: [{ text: '又造出各样飞鸟，各从其类。神看着是好的。', ref: '创世记 1:21' }],
      apply(c) {
        const p = skyPoint(c.x, c.y);
        W.setPop('bird', 26, p[0], p[1], c.instant);
        if (!c.instant) fx().sparkle(p[0], p[1], 50, [255, 255, 255], 30, 'top');
      },
    },
    {
      day: 5, utter: '滋生繁多，充满海中的水', cmd: 'bless 鱼 鸟 --multiply', ref: '1:22',
      verse: [{ text: '神就赐福给这一切，说：「滋生繁多，充满海中的水；<br>雀鸟也要多生在地上。」', ref: '创世记 1:22', hold: 6.5 }],
      apply(c) {
        const s = seaPoint(c.x, c.y);
        W.setPop('fish', 140, s[0], s[1], c.instant);
        W.setPop('whale', 3, s[0], s[1], c.instant);
        const b = skyPoint(c.x, c.y);
        W.setPop('bird', 54, b[0], b[1], c.instant);
        if (!c.instant) { fx().ring(c.x, c.y, [190, 240, 255], M() * 0.9, 2.6, 2); au().bless && au().bless(); }
      },
    },
    {
      day: 5, utter: '有晚上，有早晨', cmd: 'commit -m "第五日"', ref: '1:23', evening: true,
      verse: [{ text: '有晚上，有早晨，是第五日。', ref: '创世记 1:23', hold: 7 }],
      apply(c) { eveningMorning(5, '1:23', c); },
    },

    // ── 第六日 ───────────────────────────────────────────────
    {
      day: 6, utter: '地要生出活物来，各从其类', cmd: 'spawn 牲畜 昆虫 野兽 --kind 各从其类', ref: '1:24–25',
      verse: [
        { text: '神说：「地要生出活物来，各从其类；<br>牲畜、昆虫、野兽，各从其类。」事就这样成了。', ref: '创世记 1:24', hold: 6 },
        { text: '于是神造出野兽，各从其类；牲畜，各从其类；<br>地上一切昆虫，各从其类。神看着是好的。', ref: '创世记 1:25', hold: 6.5 },
      ],
      apply(c) {
        const p = landPoint(c.x);
        W.setPop('cattle', 9, p[0], p[1], c.instant);
        W.setPop('beast', 8, p[0], p[1], c.instant);
        W.setPop('creeper', 36, p[0], p[1], c.instant);
        if (!c.instant) fx().dust(p[0], p[1], 50, [226, 196, 150], 40);
      },
    },
    {
      day: 6, utter: '我们要照着我们的形像造人', cmd: 'create 人 --image 神 --as 男,女', ref: '1:26–27',
      verse: [
        { text: '神说：「我们要照着我们的形像、按着我们的样式造人，<br>使他们管理海里的鱼、空中的鸟、地上的牲畜，和全地。」', ref: '创世记 1:26', hold: 7 },
        { text: '神就照着自己的形像造人，<br>乃是照着他的形像造男造女。', ref: '创世记 1:27', hold: 6 },
      ],
      apply(c) {
        const p = landPoint(c.x);
        W.setPop('human', 2, p[0], p[1], c.instant);
        if (!c.instant) { fx().dust(p[0], p[1], 70, [240, 214, 170], 16); fx().ring(p[0], p[1] - 20 * W.unit, [255, 236, 200], M() * 0.35, 2, 2); }
      },
    },
    {
      day: 6, utter: '要生养众多，遍满地面', cmd: 'bless 人 --fruitful --multiply', ref: '1:28–30',
      verse: [
        { text: '神就赐福给他们，又对他们说：<br>「要生养众多，遍满地面，治理这地。」', ref: '创世记 1:28' },
        { text: '「看哪，我将遍地上一切结种子的菜蔬<br>和一切树上所结有核的果子，全赐给你们作食物。」', ref: '创世记 1:29', hold: 6.5 },
      ],
      apply(c) {
        W.setPop('human', 6, c.x, c.y, c.instant);
        if (!c.instant) { fx().ring(c.x, c.y, [255, 226, 180], M() * 0.9, 2.8, 2); au().bless && au().bless(); }
      },
    },
    {
      day: 6, utter: '看哪，一切所造的都甚好', cmd: 'review --all  # ✓ 甚好', ref: '1:31',
      verse: [{ text: '神看着一切所造的都甚好。', ref: '创世记 1:31', hold: 6 }],
      apply(c) {
        W.set('good', 1, c.instant);
        if (!c.instant) { fx().ring(W.w / 2, W.h * 0.6, [255, 220, 160], Math.hypot(W.w, W.h), 3.4, 3); W.flash = 0.7; }
      },
    },
    {
      day: 6, utter: '有晚上，有早晨', cmd: 'commit -m "第六日"', ref: '1:31', evening: true,
      verse: [{ text: '有晚上，有早晨，是第六日。', ref: '创世记 1:31', hold: 7 }],
      apply(c) { W.set('good', 0.35, c.instant); eveningMorning(6, '1:31', c); },
    },

    // ── 第七日 ───────────────────────────────────────────────
    {
      day: 7, utter: '天地万物都造齐了', cmd: 'git status  # nothing to create, working tree clean', ref: '2:1–2',
      verse: [
        { text: '天地万物都造齐了。', ref: '创世记 2:1' },
        { text: '到第七日，神造物的工已经完毕，<br>就在第七日歇了他一切的工，安息了。', ref: '创世记 2:2', hold: 7 },
      ],
      apply(c) {
        W.set('sabbath', 0.6, c.instant);
        W.set('good', 0.2, c.instant);
      },
    },
    {
      day: 7, utter: '赐福给第七日，定为圣日', cmd: 'git tag v7 -m "安息"', ref: '2:3', final: true,
      verse: [{ text: '神赐福给第七日，定为圣日；<br>因为在这日神歇了他一切创造的工，就安息了。', ref: '创世记 2:3', hold: 9 }],
      apply(c) {
        W.set('sabbath', 1, c.instant);
        W.freeClock = true;
      },
    },
  ];

  STAGES.forEach((s, i) => { s.index = i; s.tint = TINT[s.day]; });

  GS.story = { STAGES, TINT, seaPoint, landPoint, skyPoint };
})(window.GS);
