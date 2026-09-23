/* ─────────────────────────────────────────────────────────────
 * book/numbers.js —— 民数记 · 旷野（民数记 1 — 36）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'numbers';
  GS.book.act({
    id: ACT, book: '民数记', books: [4], title: '旷野', sub: '民数记 1 — 36', tint: [255, 220, 170], music: 'abraham',
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
        kind: 'act', utter: '愿耶和华赐福给你，保护你', cmd: 'echo "旷野"', ref: '6:24',
        verse: [{ text: '『愿耶和华赐福给你，保护你。', ref: '民数记 6:24', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
