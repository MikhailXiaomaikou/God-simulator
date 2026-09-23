/* ─────────────────────────────────────────────────────────────
 * book/joshua.js —— 约书亚记 · 耶利哥（约书亚记 1 — 24）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'joshua';
  GS.book.act({
    id: ACT, book: '约书亚记', books: [6], title: '耶利哥', sub: '约书亚记 1 — 24', tint: [255, 210, 160], music: 'abraham',
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
        kind: 'act', utter: '你当刚强壮胆', cmd: 'echo "耶利哥"', ref: '1:9',
        verse: [{ text: '我岂没有吩咐你吗？你当刚强壮胆！不要惧怕，也不要惊惶；因为你无论往哪里去，耶和华你的神必与你同在。」', ref: '约书亚记 1:9', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
