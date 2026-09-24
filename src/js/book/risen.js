/* ─────────────────────────────────────────────────────────────
 * book/risen.js —— 四福音 · 复活（马太福音 28 · 路加福音 24 · 约翰福音 20 — 21）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'risen';
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '复活', sub: '马太福音 28 · 路加福音 24 · 约翰福音 20 — 21', tint: [255,  246,  220], music: 'song',
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
        kind: 'act', utter: '愿你们平安', cmd: 'echo "复活"', ref: '约翰福音 20:19',
        verse: [{ text: '那日（就是七日的第一日）晚上，门徒所在的地方，因怕犹太人，门都关了。耶稣来，站在当中，对他们说：「愿你们平安！」', ref: '约翰福音 20:19', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  246,  220], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
