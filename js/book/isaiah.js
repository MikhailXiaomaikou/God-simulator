/* ─────────────────────────────────────────────────────────────
 * book/isaiah.js —— 以赛亚书 · 以赛亚（以赛亚书 1 — 66）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'isaiah';
  GS.book.act({
    id: ACT, book: '以赛亚书', books: [23], title: '以赛亚', sub: '以赛亚书 1 — 66', tint: [255, 236, 190], music: 'abraham',
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
        kind: 'act', utter: '我可以差遣谁呢？谁肯为我们去呢', cmd: 'echo "以赛亚"', ref: '6:8',
        verse: [{ text: '我又听见主的声音说：「我可以差遣谁呢？谁肯为我们去呢？」我说：「我在这里，请差遣我！」', ref: '以赛亚书 6:8', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
