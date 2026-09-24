/* ─────────────────────────────────────────────────────────────
 * book/glory.js —— 四福音 · 登山变像（马太福音 16 — 21 · 路加福音 18 — 19）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'glory';
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '登山变像', sub: '马太福音 16 — 21 · 路加福音 18 — 19', tint: [236,  240,  255], music: 'sinai',
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
        kind: 'act', utter: '这是我的爱子，我所喜悦的。你们要听他', cmd: 'echo "登山变像"', ref: '17:5',
        verse: [{ text: '说话之间，忽然有一朵光明的云彩遮盖他们，且有声音从云彩里出来，说：「这是我的爱子，我所喜悦的。你们要听他！」', ref: '马太福音 17:5', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [236,  240,  255], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
