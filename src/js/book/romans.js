/* ─────────────────────────────────────────────────────────────
 * book/romans.js —— 罗马书 · 因信称义（罗马书 1 — 16）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'romans';
  GS.book.act({
    id: ACT, book: '罗马书', books: [45], title: '因信称义', sub: '罗马书 1 — 16', tint: [255,  232,  196], music: 'ezra',
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
        kind: 'act', utter: '义人必因信得生', cmd: 'echo "因信称义"', ref: '1:17',
        verse: [{ text: '因为神的义正在这福音上显明出来；这义是本于信，以至于信。如经上所记：「义人必因信得生。」', ref: '罗马书 1:17', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  232,  196], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
