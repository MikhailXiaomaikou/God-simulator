/* ─────────────────────────────────────────────────────────────
 * book/prison.js —— 监狱书信 · 恩典（以弗所书 · 腓立比书 · 歌罗西书 · 腓利门书）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'prison';
  GS.book.act({
    id: ACT, book: '监狱书信', books: [49, 50, 51, 57], title: '恩典', sub: '以弗所书 · 腓立比书 · 歌罗西书 · 腓利门书', tint: [240,  226,  200], music: 'kingdavid',
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
        kind: 'act', utter: '你们得救是本乎恩，也因着信', cmd: 'echo "恩典"', ref: '2:8',
        verse: [{ text: '你们得救是本乎恩，也因着信；这并不是出于自己，乃是神所赐的；', ref: '以弗所书 2:8', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [240,  226,  200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
