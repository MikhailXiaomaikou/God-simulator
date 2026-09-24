/* ─────────────────────────────────────────────────────────────
 * book/galatians.js —— 加拉太书 · 圣灵的果子（加拉太书 1 — 6）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'galatians';
  GS.book.act({
    id: ACT, book: '加拉太书', books: [48], title: '圣灵的果子', sub: '加拉太书 1 — 6', tint: [214,  240,  200], music: 'eden',
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
        kind: 'act', utter: '圣灵所结的果子，就是仁爱、喜乐、和平', cmd: 'echo "圣灵的果子"', ref: '5:22',
        verse: [{ text: '圣灵所结的果子，就是仁爱、喜乐、和平、忍耐、恩慈、良善、信实、', ref: '加拉太书 5:22', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [214,  240,  200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
