/* ─────────────────────────────────────────────────────────────
 * book/livingstone.js —— 普通书信 · 活石（雅各书 · 彼得前书 · 彼得后书）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'livingstone';
  GS.book.act({
    id: ACT, book: '普通书信', books: [59, 60, 61], title: '活石', sub: '雅各书 · 彼得前书 · 彼得后书', tint: [240,  230,  210], music: 'solomon',
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
        kind: 'act', utter: '你们来到主面前，也就像活石', cmd: 'echo "活石"', ref: '彼得前书 2:5',
        verse: [{ text: '你们来到主面前，也就像活石，被建造成为灵宫，作圣洁的祭司，藉着耶稣基督奉献神所悦纳的灵祭。', ref: '彼得前书 2:5', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [240,  230,  210], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
