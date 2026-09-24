/* ─────────────────────────────────────────────────────────────
 * book/damascus.js —— 使徒行传 · 大马色（使徒行传 8 — 12）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'damascus';
  GS.book.act({
    id: ACT, book: '使徒行传', books: [44], title: '大马色', sub: '使徒行传 8 — 12', tint: [255,  236,  200], music: 'elijah',
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
        kind: 'act', utter: '扫罗，扫罗，你为什么逼迫我', cmd: 'echo "大马色"', ref: '9:4',
        verse: [{ text: '他就仆倒在地，听见有声音对他说：「扫罗！扫罗！你为什么逼迫我？」', ref: '使徒行传 9:4', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [255,  236,  200], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
