/* ─────────────────────────────────────────────────────────────
 * book/ruth.js —— 路得记 · 路得（路得记 1 — 4）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'ruth';
  GS.book.act({
    id: ACT, book: '路得记', books: [8], title: '路得', sub: '路得记 1 — 4', tint: [255, 226, 170], music: 'jacob',
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
        kind: 'act', utter: '耶和华眷顾自己的百姓，赐粮食与他们', cmd: 'echo "路得"', ref: '1:6',
        verse: [{ text: '她就与两个儿妇起身，要从摩押地归回；因为她在摩押地听见耶和华眷顾自己的百姓，赐粮食与他们。', ref: '路得记 1:6', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
