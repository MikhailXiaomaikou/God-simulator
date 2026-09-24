/* ─────────────────────────────────────────────────────────────
 * book/parables.js —— 四福音 · 比喻（路加福音 10 — 16 · 马太福音 13）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'parables';
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '比喻', sub: '路加福音 10 — 16 · 马太福音 13', tint: [255,  226,  180], music: 'ruth',
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
        kind: 'act', utter: '我这个儿子是死而复活，失而又得的', cmd: 'echo "比喻"', ref: '路加福音 15:24',
        verse: [{ text: '因为我这个儿子是死而复活，失而又得的。』他们就快乐起来。', ref: '路加福音 15:24', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  226,  180], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
