/* ─────────────────────────────────────────────────────────────
 * book/twelve1.js —— 小先知书 · 慈绳爱索（何西阿书 — 弥迦书）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'twelve1';
  GS.book.act({
    id: ACT, book: '小先知书', books: [28, 29, 30, 31, 32, 33], title: '慈绳爱索', sub: '何西阿书 — 弥迦书', tint: [220, 236, 255], music: 'flood',
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
        kind: 'act', utter: '我用慈绳爱索牵引他们', cmd: 'echo "慈绳爱索"', ref: '11:4',
        verse: [{ text: '我用慈绳爱索牵引他们；我待他们如人放松牛的两腮夹板，把粮食放在他们面前。', ref: '何西阿书 11:4', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
