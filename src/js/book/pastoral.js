/* ─────────────────────────────────────────────────────────────
 * book/pastoral.js —— 教牧书信 · 美好的仗（提摩太前书 · 提摩太后书 · 提多书）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'pastoral';
  GS.book.act({
    id: ACT, book: '教牧书信', books: [54, 55, 56], title: '美好的仗', sub: '提摩太前书 · 提摩太后书 · 提多书', tint: [255,  230,  190], music: 'nehemiah',
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
        kind: 'act', utter: '圣经都是神所默示的', cmd: 'echo "美好的仗"', ref: '提摩太后书 3:16',
        verse: [{ text: '圣经都是神所默示的，于教训、督责、使人归正、教导人学义都是有益的，', ref: '提摩太后书 3:16', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  230,  190], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
