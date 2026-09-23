/* ─────────────────────────────────────────────────────────────
 * book/chronicles.js —— 历代志 · 历代（历代志上 1 — 历代志下 36）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'chronicles';
  GS.book.act({
    id: ACT, book: '历代志', books: [13, 14], title: '历代', sub: '历代志上 1 — 历代志下 36', tint: [255, 232, 190], music: 'babel',
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
        kind: 'act', utter: '这称为我名下的子民', cmd: 'echo "历代"', ref: '7:14',
        verse: [{ text: '这称为我名下的子民，若是自卑、祷告，寻求我的面，转离他们的恶行，我必从天上垂听，赦免他们的罪，医治他们的地。', ref: '历代志下 7:14', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
