/* ─────────────────────────────────────────────────────────────
 * book/journeys.js —— 使徒行传 · 直到地极（使徒行传 13 — 28）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'journeys';
  GS.book.act({
    id: ACT, book: '使徒行传', books: [44], title: '直到地极', sub: '使徒行传 13 — 28', tint: [200,  226,  250], music: 'jeremiah',
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
        kind: 'act', utter: '不要怕，只管讲，不要闭口', cmd: 'echo "直到地极"', ref: '18:9',
        verse: [{ text: '夜间，主在异象中对保罗说：「不要怕，只管讲，不要闭口，', ref: '使徒行传 18:9', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [200,  226,  250], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
