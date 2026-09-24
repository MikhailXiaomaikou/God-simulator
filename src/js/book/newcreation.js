/* ─────────────────────────────────────────────────────────────
 * book/newcreation.js —— 启示录 · 新天新地（启示录 21 — 22）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'newcreation';
  GS.book.act({
    id: ACT, book: '启示录', books: [66], title: '新天新地', sub: '启示录 21 — 22', tint: [255,  246,  230], music: 'eden',
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
        kind: 'act', utter: '看哪，我将一切都更新了', cmd: 'echo "新天新地"', ref: '21:5',
        verse: [{ text: '坐宝座的说：「看哪，我将一切都更新了！」又说：「你要写上；因这些话是可信的，是真实的。」', ref: '启示录 21:5', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  246,  230], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
