/* ─────────────────────────────────────────────────────────────
 * book/ezra.js —— 以斯拉记 · 归回（以斯拉记 1 — 10）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'ezra';
  GS.book.act({
    id: ACT, book: '以斯拉记', books: [15], title: '归回', sub: '以斯拉记 1 — 10', tint: [240, 228, 200], music: 'jacob',
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
        kind: 'act', utter: '激动波斯王塞鲁士的心', cmd: 'echo "归回"', ref: '1:1',
        verse: [{ text: '波斯王塞鲁士元年，耶和华为要应验藉耶利米口所说的话，就激动波斯王塞鲁士的心，使他下诏通告全国说：', ref: '以斯拉记 1:1', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
