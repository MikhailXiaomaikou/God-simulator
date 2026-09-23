/* sky.js —— 占位（将由完整的 WebGL 天幕取代） */
(function (GS) {
  'use strict';
  const W = GS.W, U = GS.util;
  let cv, g;
  GS.sky = {
    init(canvas) { cv = canvas; g = cv.getContext('2d'); },
    resize(canvas, w, h, dpr) { cv.width = w; cv.height = h; },
    render() {
      const L = W.lv.light, d = W.daylight;
      const top = U.mixRGB([2, 3, 8], [70, 120, 190], d), bot = U.mixRGB([4, 6, 12], W.haze, L);
      const gr = g.createLinearGradient(0, 0, 0, W.horizonY);
      gr.addColorStop(0, U.rgb(...top)); gr.addColorStop(1, U.rgb(...bot));
      g.fillStyle = gr; g.fillRect(0, 0, W.w, W.horizonY + 1);
      const sg = g.createLinearGradient(0, W.horizonY, 0, W.h);
      sg.addColorStop(0, U.rgb(...U.mixRGB([3, 5, 10], U.mixRGB(W.haze, [20, 50, 90], 0.5), Math.max(L, W.lv.deep * 0.1))));
      sg.addColorStop(1, U.rgb(...U.mixRGB([1, 2, 5], [10, 30, 60], L)));
      g.fillStyle = sg; g.fillRect(0, W.horizonY, W.w, W.h - W.horizonY);
      if (L > 0.01) {
        const r = g.createRadialGradient(W.core.x, W.core.y, 0, W.core.x, W.core.y, 200);
        r.addColorStop(0, U.rgba(255, 245, 220, L * 0.9)); r.addColorStop(1, 'rgba(255,245,220,0)');
        g.fillStyle = r; g.fillRect(0, 0, W.w, W.horizonY);
      }
    },
  };
})(window.GS);
