/* ─────────────────────────────────────────────────────────────
 * book/jeremiah.js —— 耶利米书 · 耶利米（耶利米书 1 — 52）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'jeremiah';
  GS.book.act({
    id: ACT, book: '耶利米书', books: [24], title: '耶利米', sub: '耶利米书 1 — 52', tint: [230, 210, 190], music: 'cain',
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
        kind: 'act', utter: '我未将你造在腹中，我已晓得你', cmd: 'echo "耶利米"', ref: '1:5',
        verse: [{ text: '我未将你造在腹中，我已晓得你；你未出母胎，我已分别你为圣；我已派你作列国的先知。', ref: '耶利米书 1:5', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
