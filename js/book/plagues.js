/* ─────────────────────────────────────────────────────────────
 * book/plagues.js —— 出埃及记 · 十灾（出埃及记 5 — 13:16）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'plagues';
  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '十灾', sub: '出埃及记 5 — 13:16', tint: [255, 190, 150], music: 'joseph',
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
        kind: 'act', utter: '我一见这血，就越过你们去', cmd: 'echo "十灾"', ref: '12:13',
        verse: [{ text: '这血要在你们所住的房屋上作记号；我一见这血，就越过你们去。我击杀埃及地头生的时候，灾殃必不临到你们身上灭你们。」', ref: '出埃及记 12:13', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
