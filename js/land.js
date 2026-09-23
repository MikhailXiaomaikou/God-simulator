/* land.js —— 占位（将由完整的大地与草木取代） */
(function (GS) {
  'use strict';
  const W = GS.W, U = GS.util;
  const PASS = { far: 0, mid: 1, near: 2 };
  const COL = [[120, 130, 150], [110, 96, 70], [84, 62, 40]];
  GS.land = {
    init() {}, resize() {}, update() {}, reset() {}, restore() {},
    draw(ctx, pass) {
      const l = PASS[pass];
      if (l == null || W.lv.land <= 0) return;
      const wl = W.waterlineY(l);
      ctx.beginPath();
      ctx.moveTo(0, wl);
      for (let x = 0; x <= W.w; x += 6) ctx.lineTo(x, Math.min(wl, W.ridgeY(l, x)));
      ctx.lineTo(W.w, wl);
      ctx.closePath();
      ctx.fillStyle = W.shadeCSS(COL[l], W.LAYERS[l].depth);
      ctx.fill();
    },
  };
})(window.GS);
