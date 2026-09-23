/* ─────────────────────────────────────────────────────────────
 * book/job.js —— 约伯记 · 约伯（约伯记 1 — 42）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'job';
  GS.book.act({
    id: ACT, book: '约伯记', books: [18], title: '约伯', sub: '约伯记 1 — 42', tint: [210, 220, 240], music: 'flood',
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
        kind: 'act', utter: '我立大地根基的时候，你在哪里呢', cmd: 'echo "约伯"', ref: '38:4',
        verse: [{ text: '我立大地根基的时候，你在哪里呢？你若有聪明，只管说吧！', ref: '约伯记 38:4', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
