/* ─────────────────────────────────────────────────────────────
 * book/exile.js —— 列王纪下 · 亡国（列王纪下 14 — 25）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'exile';
  GS.book.act({
    id: ACT, book: '列王纪下', books: [12], title: '亡国', sub: '列王纪下 14 — 25', tint: [220, 200, 190], music: 'cain',
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
        kind: 'act', utter: '我在耶和华殿里得了律法书', cmd: 'echo "亡国"', ref: '22:8',
        verse: [{ text: '大祭司希勒家对书记沙番说：「我在耶和华殿里得了律法书。」希勒家将书递给沙番，沙番就看了。', ref: '列王纪下 22:8', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
