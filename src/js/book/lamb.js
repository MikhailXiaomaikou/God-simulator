/* ─────────────────────────────────────────────────────────────
 * book/lamb.js —— 启示录 · 羔羊（启示录 6 — 20）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'lamb';
  GS.book.act({
    id: ACT, book: '启示录', books: [66], title: '羔羊', sub: '启示录 6 — 20', tint: [255,  236,  214], music: 'daniel',
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
        kind: 'act', utter: '哈利路亚！因为主我们的神、全能者作王了', cmd: 'echo "羔羊"', ref: '19:6',
        verse: [{ text: '我听见好像群众的声音，众水的声音，大雷的声音，说：哈利路亚！因为主－我们的神、全能者作王了。', ref: '启示录 19:6', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  236,  214], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
