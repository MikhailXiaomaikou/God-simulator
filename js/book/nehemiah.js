/* ─────────────────────────────────────────────────────────────
 * book/nehemiah.js —— 尼希米记 · 城墙（尼希米记 1 — 13）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'nehemiah';
  GS.book.act({
    id: ACT, book: '尼希米记', books: [16], title: '城墙', sub: '尼希米记 1 — 13', tint: [250, 224, 190], music: 'babel',
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
        kind: 'act', utter: '因靠耶和华而得的喜乐是你们的力量', cmd: 'echo "城墙"', ref: '8:10',
        verse: [{ text: '又对他们说：「你们去吃肥美的，喝甘甜的，有不能预备的就分给他，因为今日是我们主的圣日。你们不要忧愁，因靠耶和华而得的喜乐是你们的力量。」', ref: '尼希米记 8:10', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
