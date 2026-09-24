/* ─────────────────────────────────────────────────────────────
 * book/pentecost.js —— 使徒行传 · 五旬节（使徒行传 1 — 7）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'pentecost';
  GS.book.act({
    id: ACT, book: '使徒行传', books: [44], title: '五旬节', sub: '使徒行传 1 — 7', tint: [255,  210,  160], music: 'babel',
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
        kind: 'act', utter: '但圣灵降临在你们身上，你们就必得着能力', cmd: 'echo "五旬节"', ref: '1:8',
        verse: [{ text: '但圣灵降临在你们身上，你们就必得着能力，并要在耶路撒冷、犹太全地，和撒马利亚，直到地极，作我的见证。」', ref: '使徒行传 1:8', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  210,  160], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
