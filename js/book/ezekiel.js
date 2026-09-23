/* ─────────────────────────────────────────────────────────────
 * book/ezekiel.js —— 以西结书 · 以西结（以西结书 1 — 48）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'ezekiel';
  GS.book.act({
    id: ACT, book: '以西结书', books: [26], title: '以西结', sub: '以西结书 1 — 48', tint: [200, 230, 255], music: 'babel',
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
        kind: 'act', utter: '我必使气息进入你们里面，你们就要活了', cmd: 'echo "以西结"', ref: '37:5',
        verse: [{ text: '主耶和华对这些骸骨如此说：『我必使气息进入你们里面，你们就要活了。', ref: '以西结书 37:5', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
