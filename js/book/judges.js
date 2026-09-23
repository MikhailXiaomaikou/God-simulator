/* ─────────────────────────────────────────────────────────────
 * book/judges.js —— 士师记 · 士师（士师记 1 — 21）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'judges';
  GS.book.act({
    id: ACT, book: '士师记', books: [7], title: '士师', sub: '士师记 1 — 21', tint: [250, 200, 160], music: 'cain',
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
        kind: 'act', utter: '大能的勇士啊，耶和华与你同在', cmd: 'echo "士师"', ref: '6:12',
        verse: [{ text: '耶和华的使者向基甸显现，对他说：「大能的勇士啊，耶和华与你同在！」', ref: '士师记 6:12', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
