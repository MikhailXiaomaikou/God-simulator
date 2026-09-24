/* ─────────────────────────────────────────────────────────────
 * book/light.js —— 四福音 · 生命的光（约翰福音 3 — 12）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'light';
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '生命的光', sub: '约翰福音 3 — 12', tint: [255,  244,  214], music: 'isaiah',
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
        kind: 'act', utter: '我是世界的光', cmd: 'echo "生命的光"', ref: '约翰福音 8:12',
        verse: [{ text: '耶稣又对众人说：「我是世界的光。跟从我的，就不在黑暗里走，必要得着生命的光。」', ref: '约翰福音 8:12', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  244,  214], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
