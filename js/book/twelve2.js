/* ─────────────────────────────────────────────────────────────
 * book/twelve2.js —— 小先知书 · 公义的日头（那鸿书 — 玛拉基书）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部旧约从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'twelve2';
  GS.book.act({
    id: ACT, book: '小先知书', books: [34, 35, 36, 37, 38, 39], title: '公义的日头', sub: '那鸿书 — 玛拉基书', tint: [255, 236, 180], music: 'eden',
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
        kind: 'act', utter: '必有公义的日头出现', cmd: 'echo "公义的日头"', ref: '4:2',
        verse: [{ text: '但向你们敬畏我名的人必有公义的日头出现，其光线有医治之能。你们必出来跳跃如圈里的肥犊。', ref: '玛拉基书 4:2', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255, 236, 200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
