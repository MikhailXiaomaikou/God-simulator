/* ─────────────────────────────────────────────────────────────
 * book/redsea.js —— 出埃及记 · 红海（出埃及记 13:17 — 18:27）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'redsea';
  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '红海', sub: '出埃及记 13:17 — 18:27', tint: [190, 220, 255], music: 'flood',
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
        kind: 'act', utter: '你举手向海伸杖，把水分开', cmd: 'echo "红海"', ref: '14:16',
        verse: [{ text: '你举手向海伸杖，把水分开。以色列人要下海中走干地。', ref: '出埃及记 14:16', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
