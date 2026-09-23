/* ─────────────────────────────────────────────────────────────
 * book/sinai.js —— 出埃及记 · 西奈（出埃及记 19 — 40）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'sinai';
  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '西奈', sub: '出埃及记 19 — 40', tint: [255, 236, 200], music: 'babel',
    outro: 8,
    setup() {
      const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.4, land: 1, grass: 0.8, herbs: 0.7, trees: 0.5,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
      W.freeClock = false;
      W.goTo(0.36, 0, true);
      if (GS.cast) GS.cast.clear({ fade: false });
    },
    stages: [
      {
        kind: 'act', utter: '我是耶和华你的神', cmd: 'echo "西奈"', ref: '20:2',
        verse: [{ text: '「我是耶和华你的神，曾将你从埃及地为奴之家领出来。', ref: '出埃及记 20:2', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
