/* ─────────────────────────────────────────────────────────────
 * book/elisha.js —— 列王纪下 · 以利沙（列王纪下 1 — 13）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'elisha';
  GS.book.act({
    id: ACT, book: '列王纪下', books: [12], title: '以利沙', sub: '列王纪下 1 — 13', tint: [255, 200, 140], music: 'abraham',
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
        kind: 'act', utter: '耶和华啊，求你开这少年人的眼目，使他能看见', cmd: 'echo "以利沙"', ref: '6:17',
        verse: [{ text: '以利沙祷告说：「耶和华啊，求你开这少年人的眼目，使他能看见。」耶和华开他的眼目，他就看见满山有火车火马围绕以利沙。', ref: '列王纪下 6:17', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
