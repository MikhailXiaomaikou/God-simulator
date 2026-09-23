/* ─────────────────────────────────────────────────────────────
 * book/psalms.js —— 诗篇 · 诗篇（诗篇 1 — 150）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'psalms';
  GS.book.act({
    id: ACT, book: '诗篇', books: [19], title: '诗篇', sub: '诗篇 1 — 150', tint: [255, 240, 210], music: 'eden',
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
        kind: 'act', utter: '你们要休息，要知道我是神', cmd: 'echo "诗篇"', ref: '46:10',
        verse: [{ text: '你们要休息，要知道我是神！我必在外邦中被尊崇，在遍地上也被尊崇。', ref: '诗篇 46:10', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
