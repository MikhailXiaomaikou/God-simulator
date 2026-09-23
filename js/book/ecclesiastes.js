/* ─────────────────────────────────────────────────────────────
 * book/ecclesiastes.js —— 传道书 · 虚空（传道书 1 — 12）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'ecclesiastes';
  GS.book.act({
    id: ACT, book: '传道书', books: [21], title: '虚空', sub: '传道书 1 — 12', tint: [220, 222, 230], music: 'cain',
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
        kind: 'act', utter: '神造万物，各按其时成为美好', cmd: 'echo "虚空"', ref: '3:11',
        verse: [{ text: '神造万物，各按其时成为美好，又将永生安置在世人心里。然而神从始至终的作为，人不能参透。', ref: '传道书 3:11', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
