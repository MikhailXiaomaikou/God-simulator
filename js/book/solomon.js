/* ─────────────────────────────────────────────────────────────
 * book/solomon.js —— 列王纪上 · 所罗门（列王纪上 1 — 11）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'solomon';
  GS.book.act({
    id: ACT, book: '列王纪上', books: [11], title: '所罗门', sub: '列王纪上 1 — 11', tint: [255, 222, 150], music: 'joseph',
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
        kind: 'act', utter: '你愿我赐你什么？你可以求', cmd: 'echo "所罗门"', ref: '3:5',
        verse: [{ text: '在基遍，夜间梦中，耶和华向所罗门显现，对他说：「你愿我赐你什么？你可以求。」', ref: '列王纪上 3:5', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
