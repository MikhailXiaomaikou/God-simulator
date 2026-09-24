/* ─────────────────────────────────────────────────────────────
 * book/godislove.js —— 普通书信 · 神就是爱（约翰一书 · 约翰二书 · 约翰三书 · 犹大书）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'godislove';
  GS.book.act({
    id: ACT, book: '普通书信', books: [62, 63, 64, 65], title: '神就是爱', sub: '约翰一书 · 约翰二书 · 约翰三书 · 犹大书', tint: [255,  220,  214], music: 'song',
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
        kind: 'act', utter: '神就是爱', cmd: 'echo "神就是爱"', ref: '4:8',
        verse: [{ text: '没有爱心的，就不认识神，因为神就是爱。', ref: '约翰一书 4:8', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  220,  214], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
