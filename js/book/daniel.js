/* ─────────────────────────────────────────────────────────────
 * book/daniel.js —— 但以理书 · 但以理（但以理书 1 — 12）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'daniel';
  GS.book.act({
    id: ACT, book: '但以理书', books: [27], title: '但以理', sub: '但以理书 1 — 12', tint: [255, 220, 170], music: 'joseph',
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
        kind: 'act', utter: '我的神差遣使者，封住狮子的口', cmd: 'echo "但以理"', ref: '6:22',
        verse: [{ text: '我的神差遣使者，封住狮子的口，叫狮子不伤我；因我在神面前无辜，我在王面前也没有行过亏损的事。」', ref: '但以理书 6:22', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
