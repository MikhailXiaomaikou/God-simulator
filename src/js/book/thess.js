/* ─────────────────────────────────────────────────────────────
 * book/thess.js —— 帖撒罗尼迦书 · 主必降临（帖撒罗尼迦前书 1 — 帖撒罗尼迦后书 3）
 * 占位：这一幕尚在写作中。它已是一幕完整可走的戏（一句话），好让整部圣经从头到尾都走得通。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W;
  const ACT = 'thess';
  GS.book.act({
    id: ACT, book: '帖撒罗尼迦书', books: [52, 53], title: '主必降临', sub: '帖撒罗尼迦前书 1 — 帖撒罗尼迦后书 3', tint: [230,  236,  255], music: 'twelve2',
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
        kind: 'act', utter: '主必亲自从天降临', cmd: 'echo "主必降临"', ref: '4:16',
        verse: [{ text: '因为主必亲自从天降临，有呼叫的声音和天使长的声音，又有神的号吹响；那在基督里死了的人必先复活。', ref: '帖撒罗尼迦前书 4:16', hold: 7 }],
        apply(c) { if (!c.instant && GS.fx) GS.fx.ring(W.w * 0.7, W.h * 0.5, [230,  236,  255], Math.min(W.w, W.h) * 0.3, 2.2, 1.4); },
      },
    ],
  });
})(window.GS);
