/* ─────────────────────────────────────────────────────────────
 * book/throne.js —— 启示录 · 宝座（启示录 1 — 5）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'throne';
  GS.book.act({
    id: ACT, book: '启示录', books: [66], title: '宝座', sub: '启示录 1 — 5', tint: [236,  230,  255], music: 'ezekiel',
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
        kind: 'act', utter: '我是阿拉法，我是俄梅戛', cmd: 'echo "宝座"', ref: '1:8',
        verse: [{ text: '主神说：「我是阿拉法，我是俄梅戛，是昔在、今在、以后永在的全能者。」', ref: '启示录 1:8', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [236,  230,  255], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
