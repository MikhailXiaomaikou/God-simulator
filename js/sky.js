/* ─────────────────────────────────────────────────────────────
 * sky.js —— 天幕：渊、光、穹苍与其上的水、云、日、月、星、海
 *
 * 一切连续的光都在这里：单个全屏三角形 + 一段片元着色器（WebGL2，
 * 退回 WebGL1；着色器以字符串内嵌，file:// 下亦可用），每帧只由 GS.W 驱动。
 * WebGL 不可用 / 编译失败 / 上下文丢失时，换上一张同位置的 Canvas2D 画布，
 * 用渐变、缓存的光晕与预先烘焙的星空画出同一个世界；上下文恢复后再切回。
 *
 * GS.sky = { init(canvas), resize(canvas, w, h, dpr), render() }
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W, U = GS.util;
  const { clamp, lerp, smoothstep } = U;

  // ── 色板（0..1）────────────────────────────────────────────
  const hx = s => [parseInt(s.slice(1, 3), 16) / 255, parseInt(s.slice(3, 5), 16) / 255, parseInt(s.slice(5, 7), 16) / 255];
  const PAL = {
    // 第一日：没有空气的光——无源的珍珠色（没有蓝）
    pearlTop: hx('#6c6a70'), pearlMid: hx('#b0aca6'), pearlHz: hx('#e6e0d4'),
    pearlNTop: hx('#030304'), pearlNMid: hx('#060608'), pearlNHz: hx('#0c0c0f'),
    pearlDTop: hx('#2b2731'), pearlDMid: hx('#6e5a5f'), pearlDHz: hx('#b8927e'),
    // 穹苍之后：有了空气，天才是蓝的
    dayTop: hx('#2f5e9e'), dayMid: hx('#6f9fd0'), dayHz: hx('#d6e6f0'),
    nightTop: hx('#050a18'), nightMid: hx('#0a1226'), nightHz: hx('#121c33'),
    duskTop: hx('#3a2f5a'), duskMid: hx('#c0506a'), duskHz: hx('#f29a5c'),
    goldHz: hx('#ffd9a0'),
    // 海
    pearlWFar: hx('#30343a'), pearlWNear: hx('#16191d'),
    waterFar: hx('#1d4f72'), waterNear: hx('#0e2f4a'),
    nightWFar: hx('#060d1b'), nightWNear: hx('#02050b'),
    // 穹苍以上的水
    waDay: hx('#0f2746'), waNight: hx('#03070f'),
    // 云
    clDayLit: hx('#f4f6fa'), clDaySh: hx('#8c9bb0'),
    clPearlLit: hx('#efece6'), clPearlSh: hx('#9a9ca4'),
    clDuskLit: hx('#ffb27a'), clDuskSh: hx('#6a4a66'),
    clNightLit: hx('#1f2a40'), clNightSh: hx('#070d1a'),
    // 光
    core: hx('#fff4dc'), coreLow: hx('#ffc890'),
    sun: hx('#fff6e0'), sunLow: hx('#ff9a55'),
    sunGlow: hx('#ffe3b0'), sunGlowLow: hx('#ff8a45'),
    moon: hx('#e4ebf5'), moonLow: hx('#f2d6a8'),
    spirit: hx('#96c3ff'),
  };
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // ── 着色器 ──────────────────────────────────────────────────
  const NU = 30; // vec4 uniform 的个数
  const VS = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }',
  ].join('\n');

  const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec4 U[${NU}];

#define RES      U[0].xy
#define TIME     U[0].z
#define MPX      U[0].w
#define CSSPX    U[1].xy
#define SHAKE    U[1].zw
#define CORE     U[2].xy
#define CORE_AMT U[2].z
#define GATHER   U[2].w
#define SUN      U[3].xy
#define SUN_AMT  U[3].z
#define SUN_R    U[3].w
#define MOON     U[4].xy
#define MOON_AMT U[4].z
#define MOON_R   U[4].w
#define MOON_PH  U[5].x
#define MOON_DAY U[5].y
#define STAR_VIS U[5].z
#define STAR_R   U[5].w
#define SOW      U[6].xy
#define LORIG    U[6].zw
#define LIGHT    U[7].x
#define LIGHT_R  U[7].y
#define DEEP     U[7].z
#define VAULT    U[7].w
#define CLOUDS   U[8].x
#define CDRIFT   U[8].y
#define BIO      U[8].z
#define FILM     U[8].w
#define SPIRIT   U[9].xy
#define SP_AMT   U[9].z
#define CHARGE   U[9].w
#define DAYF     U[10].x
#define DUSK     U[10].y
#define NIGHTW   U[10].z
#define GOOD     U[10].w
#define SABBATH  U[11].x
#define DOME_E   U[11].y
#define OCT      U[11].z
#define STAR_ROT U[11].w
#define C_TOP    U[12].rgb
#define HZ       U[12].w
#define C_MID    U[13].rgb
#define MILKY    U[13].w
#define C_HZ     U[14].rgb
#define WA_OP    U[14].w
#define D_TOP    U[15].rgb
#define SUN_LOW  U[15].w
#define D_MID    U[16].rgb
#define MIST     U[16].w
#define D_HZ     U[17].rgb
#define WA_GLOW  U[17].w
#define W_FAR    U[18].rgb
#define GLIT     U[18].w
#define W_NEAR   U[19].rgb
#define DAWN     U[19].w
#define HAZE     U[20].rgb
#define PEARL    U[20].w
#define CORE_COL U[21].rgb
#define RIPPLE   U[21].w
#define SUN_COL  U[22].rgb
#define SUN_DISC U[22].w
#define SUN_GLOW U[23].rgb
#define MOON_HALO U[23].w
#define CL_SH    U[24].rgb
#define KEYX     U[24].w
#define CL_LIT   U[25].rgb
#define KEYY     U[25].w
#define SHOOT_A  U[26]
#define SHOOT_B  U[27]
#define WA_COL   U[28].rgb
#define MOON_EL  U[28].w
#define MOON_COL U[29].rgb
#define SP_T     U[29].w

#define ASPECT (RES.x / RES.y)

// 平滑阶跃：两端可以倒置（GLSL 的 smoothstep 在 e0 >= e1 时未定义）
float sst(float a, float b, float x) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
float sq(float x) { return x * x; }

float h12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 h32(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = h12(i), b = h12(i + vec2(1.0, 0.0));
  float c = h12(i + vec2(0.0, 1.0)), d = h12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p, float oct) {
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= oct) break;
    s += a * vnoise(p); n += a;
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(17.3, -9.1);
    a *= 0.5;
  }
  return s / n;
}

// 穹顶（归一化 y）：随 vault 自地平线托起
float domeY(float x) {
  float d = 0.15 + 0.55 * (x - 0.5) * (x - 0.5);
  return mix(HZ + 0.02, d, DOME_E);
}

// 光：自话语成就之处扩散开来
float lightMask(vec2 px) {
  if (LIGHT <= 0.0005) return 0.0;
  float d = length(px - LORIG) / MPX;
  return LIGHT * sst(LIGHT_R, LIGHT_R - 0.5, d);
}

// 天空的底色：昼 / 夜（JS 已按 dayFactor 混好）+ 黄昏的色带（按太阳所在一侧加权）
vec3 skyGrad(float xpx, float a) {
  float t1 = smoothstep(0.0, 0.55, pow(a, 0.8));
  vec3 c = mix(C_HZ, C_MID, t1);
  c = mix(c, C_TOP, smoothstep(0.32, 1.0, a));
  if (DUSK > 0.002) {
    vec3 d = mix(D_HZ, D_MID, smoothstep(0.0, 0.3, a));
    d = mix(d, D_TOP, smoothstep(0.24, 0.85, a));
    float dx = (xpx - CORE.x) / RES.y;
    float side = exp(-dx * dx * 1.4);
    float w = DUSK * (0.38 + 0.62 * side) * (1.0 - 0.45 * smoothstep(0.15, 1.0, a));
    c = mix(c, d, clamp(w, 0.0, 1.0));
    // 对日一侧：地影之上的一抹粉带（维纳斯带）
    float band = exp(-sq((a - 0.13) / 0.07));
    c += DUSK * (1.0 - side) * band * vec3(0.16, 0.08, 0.11) * (0.3 + 0.7 * VAULT);
  }
  return c;
}

// 光核 / 日晕 / 月晕（天空与倒影共用）
vec3 glows(vec2 px) {
  vec3 c = vec3(0.0);
  if (CORE_AMT > 0.001) {
    vec2 d = (px - CORE) / MPX;
    float q = dot(d, d);
    float conc = 1.0 + GATHER * 9.0;
    float g = 1.0 / (1.0 + q * conc * 9.0);
    float gi = 1.0 / (1.0 + q * (60.0 + 1500.0 * GATHER));
    c += CORE_COL * CORE_AMT * (g * (0.15 + 0.45 * GATHER) + gi * 0.75 * GATHER);
  }
  if (SUN_AMT > 0.001) {
    float d = length(px - SUN) / MPX;
    c += SUN_GLOW * SUN_AMT * (exp(-18.0 * d) * 0.40 + exp(-4.0 * d) * (0.14 + 0.10 * SUN_LOW) + exp(-55.0 * d) * 0.75);
  }
  if (MOON_HALO > 0.001) {
    float d = length(px - MOON) / MPX;
    c += vec3(0.62, 0.71, 0.85) * MOON_HALO * (exp(-6.0 * d) * 0.06 + exp(-24.0 * d) * 0.13);
  }
  return c;
}

// 一层哈希星
vec3 starLayer(vec2 p, float cell, float prob, float rad, float b0, float b1, float flare, float a) {
  vec2 g = p / cell;
  vec2 id = floor(g);
  vec3 h = h32(id);
  if (h.x > prob) return vec3(0.0);
  vec3 k = h32(id + 71.3);
  vec2 d = (fract(g) - (0.2 + 0.6 * h.yz)) * cell;
  float r = max(rad, 0.6 * CSSPX.x);
  float e = (rad * rad) / (r * r);
  float b = mix(b0, b1, k.x * k.x * k.x) * e;
  float amp = 0.2 + 0.45 * (1.0 - smoothstep(0.0, 0.35, a));
  b *= 1.0 + amp * sin(TIME * (1.1 + 3.4 * k.y) + k.z * 60.0);
  float I = b * exp(-dot(d, d) / (r * r));
  if (flare > 0.0 && k.x > 0.55) {
    vec2 ad = abs(d);
    I += b * flare * (exp(-ad.x * 0.8 - d.y * d.y * 2.2) + exp(-ad.y * 0.8 - d.x * d.x * 2.2));
  }
  vec3 tint = k.z < 0.16 ? vec3(1.0, 0.886, 0.722) : (k.z < 0.34 ? vec3(0.749, 0.831, 1.0) : vec3(0.957, 0.969, 1.0));
  return tint * I;
}

// 银河：斜贯天穹的一条微光带——团簇的星云、中间一道暗隙
vec3 milky(vec2 p, out float dens) {
  dens = 0.0;
  vec2 q = p / RES.y;
  vec2 c0 = vec2(0.56 * ASPECT, 0.12);
  vec2 dir = vec2(0.906, -0.423);            // 约 25°，自左下升向右上
  vec2 v2 = q - c0;
  float u = dot(v2, dir);
  float v = dot(v2, vec2(-dir.y, dir.x)) + 0.07 * u * u;
  if (abs(v) > 0.3) return vec3(0.0);
  float n1 = fbm(q * 4.2 + vec2(3.0, 1.7), max(OCT - 1.0, 2.0));
  float n2 = vnoise(q * 13.0 + 7.3);
  float core = exp(-v * v / 0.004);
  float halo = exp(-v * v / 0.022);
  float band = halo * (0.12 + 0.95 * n1 * n1) + core * (0.2 + 0.7 * n1);
  float rift = exp(-sq((v + 0.008 + 0.05 * (n1 - 0.5)) / 0.016)) * sst(0.3, 0.62, n1 * 0.6 + n2 * 0.4);
  band *= (1.0 - 0.75 * rift) * (0.7 + 0.6 * n2);
  dens = clamp(band * 1.2, 0.0, 1.0);
  vec3 c = mix(vec3(0.561, 0.651, 0.847), vec3(0.86, 0.80, 0.70), clamp(core * n1 * 0.8, 0.0, 1.0));
  return c * band;
}

// 海浪：返回 (高度, dh/dX, dh/dZ)，按像素足迹衰减以免远处闪烁
vec3 waveAdd(vec2 P, vec2 d, float k, float w, float amp, vec2 fp) {
  float att = sst(2.2, 0.6, k * (abs(d.x) * fp.x + abs(d.y) * fp.y));
  float ph = dot(d, P) * k + TIME * w;
  return vec3(sin(ph), cos(ph) * k * d) * amp * att;
}
vec3 waves(vec2 P, vec2 fp) {
  vec3 r = vec3(0.0);
  r += waveAdd(P, vec2(0.24, 0.97), 5.0, 0.8, 0.50, fp);
  r += waveAdd(P, vec2(-0.51, 0.86), 8.7, 1.15, 0.27, fp);
  r += waveAdd(P, vec2(0.96, 0.28), 15.0, 1.7, 0.14, fp);
  r += waveAdd(P, vec2(-0.28, 0.96), 26.0, 2.35, 0.075, fp);
  r += waveAdd(P, vec2(0.62, 0.78), 43.0, 3.1, 0.04, fp);
  return r;
}

// 天空的底色（含珍珠光的晕彩与「光暗分开」的聚拢）——天空与倒影共用
vec3 skyBase(vec2 px, float a) {
  vec3 col = skyGrad(px.x, a);
  if (PEARL > 0.01) {
    // 珍珠母的晕彩：奶白与淡紫之间缓缓流转（不带绿）
    float s = vnoise(px / MPX * 0.8 + vec2(TIME * 0.012, -TIME * 0.008));
    vec3 sheen = mix(vec3(1.03, 0.996, 0.968), vec3(0.972, 0.982, 1.036), s);
    col *= mix(vec3(1.0), sheen, PEARL);
  }
  float gv = GATHER * (1.0 - 0.8 * VAULT);
  if (gv > 0.001) {
    vec2 dc = (px - CORE) / MPX;
    float broad = 1.0 / (1.0 + dot(dc, dc) * 3.0);
    vec2 v = (px / RES - vec2(0.5, 0.45)) * vec2(ASPECT, 1.0);
    float vig = 1.0 - 0.5 * smoothstep(0.35, 1.15, length(v));
    col *= mix(1.0, (0.52 + 0.6 * broad) * vig, gv);
  }
  return col;
}

vec3 sky(vec2 px, vec2 n, float lm) {
  float a = clamp((HZ - n.y) / HZ, 0.0, 1.0);
  vec3 col = skyBase(px, a) * lm;

  // 穹苍以上的水：倒悬的海，幽暗、缓缓涌动；焦散的微光在其中游走
  float dy = domeY(n.x);
  float above = dy - n.y;
  float tremble = 0.0;
  float waCover = 0.0;
  if (VAULT > 0.001) {
    if (above > 0.0) {
      waCover = WA_OP * smoothstep(0.0, 0.02, above);
      float den = above * 3.0 + 0.12;
      float Zc = 1.0 / den;                         // 天花板透视：近膜处最远
      vec2 Pc = vec2((n.x - 0.5) * ASPECT * Zc, Zc * 1.6);
      float att = 1.0 - smoothstep(0.08, 0.5, 12.5 / (den * den * RES.y));
      float t = TIME * 0.2;
      float sw = fbm(Pc * vec2(0.7, 1.1) + vec2(t * 0.2, t * 0.45), 2.0);
      float swell = mix(0.5, 0.5 + 0.5 * sin(Pc.y * 2.2 + Pc.x * 0.45 - t * 1.4 + sw * 4.0), att);
      float c1 = 1.0 - abs(sin(Pc.x * 2.9 + Pc.y * 1.6 + sw * 6.0 - t * 1.1));
      float c2 = 1.0 - abs(sin(-Pc.x * 2.2 + Pc.y * 2.5 + sw * 5.0 + t * 0.9));
      float caus = pow(c1 * c2, 5.0) * att;
      float nearF = exp(-above * 24.0);
      float farF = smoothstep(0.02, 0.3, above);
      vec3 wc = WA_COL * (0.5 + 0.65 * sw + 0.4 * swell) * (1.0 - 0.35 * farF);
      wc += WA_COL * 0.8 * nearF;
      wc += vec3(0.45, 0.66, 0.96) * WA_GLOW * (caus * (0.3 + 0.9 * swell) + 0.1 * swell * sw) * (1.0 - 0.5 * farF);
      col = mix(col, wc, waCover);
      tremble = VAULT;
    }
    // 水膜：发光的一线
    float dv = n.y - dy;
    float film = exp(-dv * dv / 0.0005) * 0.055 + exp(-dv * dv / 0.000007) * 0.42;
    float shim = 0.7 + 0.3 * sin(n.x * ASPECT * 38.0 - TIME * 1.1 + sin(n.x * 9.0 + TIME * 0.37) * 2.0);
    col += vec3(0.81, 0.90, 1.0) * film * FILM * shim;
  }

  // 众星与银河
  if (STAR_VIS > 0.002 && a > 0.004) {
    vec2 sp = px;
    if (tremble > 0.0 && above > 0.0) {
      sp += vec2(sin(TIME * 0.83 + sp.y * 0.045), cos(TIME * 0.71 + sp.x * 0.037)) * 0.9 * tremble;
    }
    vec2 pole = vec2(0.2 * RES.x, 0.02 * RES.y);
    float cr = cos(STAR_ROT), sr = sin(STAR_ROT);
    vec2 rp = sp - pole;
    rp = vec2(cr * rp.x - sr * rp.y, sr * rp.x + cr * rp.y) + pole;
    float rev = sst(STAR_R, STAR_R - 0.35, length(px - SOW) / MPX);
    float vis = STAR_VIS * rev * smoothstep(0.0, 0.14, a) * (1.0 - 0.35 * waCover);
    if (vis > 0.002) {
      vec3 mw = vec3(0.0);
      float dens = 0.0;
      if (MILKY > 0.01) { mw = milky(rp, dens) * MILKY; dens *= MILKY; }
      vec3 st = starLayer(rp, 7.0, 0.06 + 0.34 * dens, 0.5, 0.12, 0.55, 0.0, a);
      st += starLayer(rp + 311.0, 21.0, 0.16, 0.7, 0.32, 1.0, 0.0, a);
      st += starLayer(rp + 877.0, 70.0, 0.2, 1.0, 0.8, 2.0, 0.18, a);
      vec3 tint = mix(vec3(1.0), vec3(0.8, 0.9, 1.0), tremble * step(0.0, above));
      col += (st * tint + mw * 0.12) * vis;
    }
  }

  // 月
  float mAll = MOON_AMT + MOON_DAY;
  if (mAll > 0.001) {
    vec2 dm = (px - MOON) / MOON_R;
    float r2 = dot(dm, dm);
    if (r2 < 1.3) {
      float r = sqrt(r2);
      float z = sqrt(max(0.0, 1.0 - r2));
      vec3 N = vec3(dm.x, -dm.y, z);
      float ph = MOON_PH * 6.2831853;
      vec3 Ld = normalize(vec3(sin(ph), 0.12, -cos(ph)));
      float lit = smoothstep(-0.04, 0.1, dot(N, Ld));
      float disc = clamp((1.0 - r) * MOON_R / CSSPX.x * 0.9 + 0.5, 0.0, 1.0);
      float mar = smoothstep(0.42, 0.7, vnoise(dm * 1.6 + vec2(3.2, 7.1))) * 0.22
                + smoothstep(0.55, 0.8, vnoise(dm * 3.4 + vec2(1.3, 4.4))) * 0.1;
      vec3 mc = MOON_COL * (1.0 - mar) * (0.8 + 0.2 * z) * lit;
      // 夜：不透明的月盘（遮住身后的星，暗面有一点地照）
      col = mix(col, mc * 1.12 + vec3(0.012, 0.016, 0.026) * (1.0 - lit), disc * MOON_AMT);
      // 昼：月光叠加在天色上——淡淡的一枚白月
      col += mc * vec3(0.92, 0.96, 1.0) * disc * MOON_DAY * 0.42;
    }
  }

  // 光核、日晕、月晕
  vec3 gl = glows(px);
  col += gl * lm;

  // 神的灵：夜里唯一的灯，在空气里散开一点
  if (SP_AMT > 0.001) {
    vec2 ds = (px - SPIRIT) / MPX;
    col += PAL_SPIRIT * SP_AMT * 0.045 / (1.0 + dot(ds, ds) * 22.0);
  }

  // 云：穹苍以下的水汽——透视压扁的一片团云，向光的一面亮
  float cden = 0.0;
  if (CLOUDS > 0.002) {
    float top = dy + 0.035;
    float bot = HZ - 0.016;
    float band = smoothstep(top, top + 0.09, n.y) * sst(bot, bot - 0.1, n.y);
    if (band > 0.001) {
      float Zc = 0.3 / (HZ - n.y + 0.03);
      vec2 P = vec2((n.x - 0.5) * ASPECT * Zc * 1.3 + CDRIFT, Zc * 3.1);
      vec2 wq = vec2(vnoise(P * 0.55 + vec2(3.1, 1.3)), vnoise(P * 0.55 + vec2(8.3, 5.7)));
      P += (wq - 0.5) * 1.2;
      float d0 = fbm(P, OCT);
      float cov = 0.5 + 0.14 * (1.0 - band);
      float den = smoothstep(cov, cov + 0.2, d0) * CLOUDS;
      if (den > 0.002) {
        vec2 kd = vec2(KEYX, KEYY) - px;
        vec2 ld = kd / (length(kd) + 1.0);
        // 朝向主光（与天光自上而下）偏移取样：迎光的边缘更亮
        float d1 = fbm(P + ld * 0.26 + vec2(0.0, -0.1), 2.0);
        float lit = clamp(0.58 + (d0 - d1) * 4.2, 0.0, 1.0);
        vec3 cc = mix(CL_SH, CL_LIT, lit);
        cc += gl * (1.0 - den) * 1.3;         // 边缘透光（银边）
        col = mix(col, cc * max(lm, 0.02), den * 0.94);
        cden = den;
      }
    }
  }

  // 日轮
  if (SUN_DISC > 0.001) {
    vec2 ds = px - SUN;
    ds.y /= mix(1.0, 0.84, SUN_LOW);
    float r = length(ds) / SUN_R;
    float disc = clamp((1.0 - r) * SUN_R / CSSPX.x * 0.9 + 0.5, 0.0, 1.0);
    float limb = 1.0 - 0.22 * r * r;
    col = mix(col, SUN_COL * limb * 1.9, disc * SUN_DISC * (1.0 - cden * 0.8));
  }

  // 流星
  if (SHOOT_A.z > 0.001) {
    vec2 v = px - SHOOT_A.xy;
    vec2 dir = SHOOT_B.xy;
    float along = -dot(v, dir);
    float perp = dot(v, vec2(-dir.y, dir.x));
    float L = SHOOT_B.z;
    if (along > -4.0 && along < L) {
      float tl = clamp(1.0 - along / L, 0.0, 1.0);
      float w = SHOOT_A.w * (0.35 + 0.65 * tl);
      float I = tl * tl * exp(-perp * perp / (w * w)) * step(0.0, along) + 1.4 * exp(-dot(v, v) / 3.0);
      col += vec3(0.93, 0.96, 1.0) * I * SHOOT_A.z * (1.0 - cden);
    }
  }

  // 地平雾
  col = mix(col, HAZE, MIST * exp(-(HZ - n.y) * 38.0));
  return col;
}

// 光的粼光之路：从镜像点一直铺向地平线；光越低，路越长
vec3 glitter(float pxx, float am, float dz, vec2 s, float spk, vec2 L, vec3 lc, float amt, float soft) {
  float aL = (HZ - L.y / RES.y) / HZ;
  if (aL < -0.04 || amt < 0.001) return vec3(0.0);
  float low = 1.0 - smoothstep(0.0, 0.5, aL);
  float ar = am + s.y * (0.05 + 0.12 * low) * (0.35 + dz);
  float d = ar - max(aL, 0.0);
  float sd = d > 0.0 ? mix(0.13, 0.55, low) : mix(0.1 + 0.55 * aL, 1.2, low);
  float ev = exp(-sq(d / sd));
  float dX = (pxx + s.x * 30.0 * (0.25 + dz) - L.x) / RES.y;
  float wx = 0.004 + 0.075 * dz * (0.55 + 0.45 * low) + 0.012 * (1.0 - low);
  float env = exp(-sq(dX / wx)) * ev;
  float fade = smoothstep(-0.04, 0.03, aL);
  return lc * amt * fade * env * (soft * 0.26 + spk * 2.6);
}

vec3 sea(vec2 px, vec2 n, float lm) {
  float dz = clamp((n.y - HZ) / (1.0 - HZ), 0.0, 1.0);
  float Z = 1.0 / (dz + 0.016);
  vec2 fp = vec2(Z / RES.y, Z * Z / ((1.0 - HZ) * RES.y));
  vec2 P = vec2((n.x - 0.5) * ASPECT * Z, Z);
  float lz = log(Z);
  vec3 wv = waves(P, fp);
  vec2 s = wv.yz * 0.12;
  // 浪尖：随浪起伏的亮处（远处趋于平滑）
  float nz = vnoise(vec2(P.x * 9.0, lz * 34.0) + vec2(TIME * 0.35, -TIME * 0.9));
  float crest = clamp(0.5 + 0.32 * wv.x + 0.45 * (nz - 0.5), 0.0, 1.0);
  float spk = pow(crest, 8.0) * 0.8;
  // 细碎的闪点：贴在水面上的短横，越远越小；过小则化为平均亮度
  vec2 gq = vec2(P.x * 15.0, lz * 40.0 - TIME * 0.35);
  vec3 gh = h32(floor(gq) + 17.0);
  vec2 gf = fract(gq) - 0.25 - 0.5 * gh.xy;
  float tw = 0.5 + 0.5 * sin(TIME * (1.5 + 2.6 * gh.z) + gh.x * 40.0);
  float dash = exp(-(gf.x * gf.x * 10.0 + gf.y * gf.y * 14.0)) * step(0.4, gh.z) * tw * tw;
  float rowPx = (1.0 - HZ) * RES.y / (40.0 * Z) / CSSPX.y;
  spk += dash * 1.1 * smoothstep(1.6, 4.0, rowPx);
  spk = mix(spk, 0.1, smoothstep(0.012, 0.06, fp.y));

  // 渊面（光之前）：几乎看不见的暗水
  vec3 vw = mix(vec3(0.016, 0.024, 0.043), vec3(0.008, 0.013, 0.027), dz);
  vw *= 0.7 + 0.6 * clamp(0.5 + 0.55 * wv.x + 0.25 * (nz - 0.5), 0.0, 1.0);
  vw *= DEEP;

  // 有光之后：水色 + 菲涅耳反射的天色
  vec3 water = mix(W_FAR, W_NEAR, smoothstep(0.0, 0.9, dz));
  water *= 0.82 + 0.36 * clamp(0.5 - s.y * 1.6, 0.0, 1.0);
  float am = clamp((n.y - HZ) / HZ + s.y * 0.05 * (0.3 + dz), 0.002, 1.0);
  float xr = px.x + s.x * 22.0 * (0.2 + dz);
  vec2 mp = vec2(xr, (HZ - am * HZ) * RES.y);
  vec3 refl = skyBase(mp, am);
  refl += glows(mp) * 0.85;
  // 穹苍以上的水在海里的倒影（很淡）
  if (VAULT > 0.001) {
    float dyr = domeY(xr / RES.x);
    float mv = HZ - am * HZ;
    refl = mix(refl, WA_COL * 0.8, WA_OP * 0.6 * sst(dyr + 0.01, dyr - 0.03, mv));
  }
  float fr = 0.05 + 0.95 * pow(1.0 - dz, 3.2);
  vec3 lit = mix(water, refl * 0.92, fr);
  // 光暗分开：暗沉入海的深处
  lit *= mix(1.0, 1.0 - 0.45 * dz, GATHER * (1.0 - 0.7 * VAULT));
  // 光核 / 日 / 月的粼光
  float amR = (n.y - HZ) / HZ;
  lit += glitter(px.x, amR, dz, s, spk, CORE, CORE_COL, CORE_AMT * GLIT * GATHER, 1.0);
  lit += glitter(px.x, amR, dz, s, spk, SUN, SUN_GLOW, SUN_AMT * GLIT, 0.7);
  lit += glitter(px.x, amR, dz, s, spk, MOON, MOON_COL * 0.85, MOON_AMT * 0.8, 0.8);
  vec3 col = mix(vw, lit, lm);

  // 神的灵：倒影光柱与涟漪
  if (SP_AMT > 0.001 && DEEP > 0.001) {
    float sy = SPIRIT.y / RES.y;
    float over = step(HZ, sy);
    float sdz = clamp((sy - HZ) / (1.0 - HZ), 0.0, 1.0);
    float yr = over > 0.5 ? sy + 0.018 + 0.05 * sdz : HZ + (HZ - sy) * 0.8 + 0.012;
    yr = min(yr, 1.05);
    vec2 c = vec2(SPIRIT.x, yr * RES.y);
    vec2 d = (px - c) / MPX;
    float flt = 0.26 + 0.5 * dz;
    float r = length(vec2(d.x, d.y / flt));
    float pool = 1.0 / (1.0 + r * r * 55.0);
    float colW = 0.012 + 0.04 * dz;
    float cx = exp(-d.x * d.x / (colW * colW));
    float topY = over > 0.5 ? SPIRIT.y + 4.0 : HZ * RES.y;
    float below = (px.y - c.y) / MPX;
    float cy = smoothstep(topY, topY + 10.0, px.y) * (below < 0.0 ? exp(below * (over > 0.5 ? 14.0 : 3.0)) : exp(-below * 4.0));
    float streak = 0.35 + 0.65 * clamp(crest * 1.6 - 0.2, 0.0, 1.0);
    // 涟漪：被浪扰动的细环，静时极淡，言说时随力量扩开
    float rr = r + (s.x * 0.7 + s.y) * 0.012;
    float rip = sin(rr * 90.0 - SP_T * 2.6);
    rip = pow(max(rip, 0.0), 4.0) * exp(-r * 10.0) * smoothstep(0.0, 0.035, r) * (0.3 + 0.7 * crest);
    rip *= RIPPLE;
    float I = pool * (0.2 + 0.5 * spk) + cx * cy * streak * 0.5 + rip * 0.6;
    col += PAL_SPIRIT * SP_AMT * I * DEEP;
  }

  // 生命之光：夜海里的青色荧光，灵经过处更盛
  if (BIO > 0.002 && dz > 0.08) {
    vec2 g = vec2(P.x * 30.0, lz * 30.0);
    g.y += TIME * 0.05;
    vec2 ds = (px - SPIRIT) / MPX;
    float prox = 1.0 / (1.0 + dot(ds, ds) * 22.0);
    float patch = smoothstep(0.58, 0.9, vnoise(vec2(P.x * 1.6, lz * 5.0) + vec2(TIME * 0.03, TIME * 0.02)));
    float prob = 0.012 + 0.13 * patch + 0.4 * prox;
    vec2 id = floor(g);
    vec3 hh = h32(id + 13.7);
    float near = smoothstep(0.08, 0.25, dz);
    if (hh.x < prob) {
      vec2 f = fract(g) - 0.5 - (hh.yz - 0.5) * 0.6;
      float tw = pow(0.5 + 0.5 * sin(TIME * (0.7 + hh.y * 1.8) + hh.z * 40.0), 6.0);
      float I = exp(-dot(f, f) * 42.0) * tw * near;
      col += vec3(0.435, 0.949, 0.863) * I * BIO * (0.07 + 0.38 * patch + 2.4 * prox);
    }
    col += vec3(0.30, 0.80, 0.74) * BIO * near * (prox * 0.03 + patch * 0.006) * (0.5 + crest);
  }

  // 地平雾
  col = mix(col, HAZE, MIST * 0.9 * exp(-(n.y - HZ) * 64.0));
  return col;
}

vec3 tone(vec3 c) {
  vec3 k = max(c - 0.78, 0.0);
  return min(c, 0.78) + 0.22 * (1.0 - exp(-k / 0.22));
}

void main() {
  vec2 px = vec2(gl_FragCoord.x * CSSPX.x, RES.y - gl_FragCoord.y * CSSPX.y) - SHAKE;
  vec2 n = px / RES;
  float lm = lightMask(px);
  vec3 col = n.y < HZ ? sky(px, n, lm) : sea(px, n, lm);
  // 甚好：温暖而明亮的金色空气（不是发灰的暖滤镜）
  if (GOOD > 0.001) {
    float hzW = exp(-abs(n.y - HZ) * 3.2);
    col += vec3(1.0, 0.72, 0.4) * GOOD * lm * (0.02 + 0.1 * hzW) * (0.3 + 0.7 * DAYF);
    col *= mix(vec3(1.0), vec3(1.05, 1.01, 0.95), GOOD);
  }
  // 安息：柔和、温暖、高调——暗部被轻轻托起，对比降一成
  if (SABBATH > 0.001) {
    col = mix(col, col * 0.88 + vec3(1.0, 0.94, 0.82) * 0.1 * lm * (0.25 + 0.75 * DAYF), SABBATH * 0.6);
  }
  col = tone(max(col, 0.0));
  col += (h12(gl_FragCoord.xy + fract(TIME * 7.13) * 91.0) - 0.5) * (2.4 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`.replace(/PAL_SPIRIT/g, 'vec3(' + PAL.spirit.map(v => v.toFixed(4)).join(',') + ')');

  // ── 模块状态 ────────────────────────────────────────────────
  const ub = new Float32Array(NU * 4);
  const S = {
    mode: 'none',              // 'gl' | '2d' | 'none'
    glCanvas: null, fbCanvas: null,
    gl: null, prog: null, loc: null, buf: null, isGL2: false,
    cw: 1, ch: 1, w: 1, h: 1, scale: 1,
    lightO: [0, 0], sowO: [0, 0], lightSet: false, sowSet: false,
    drift: 0, spT: 0, lastT: -1,
    error: '',
    fb: null,
  };
  const params = (function () { try { return new URLSearchParams(location.search); } catch (e) { return null; } })();
  const FORCE_2D = !!(params && params.get('sky') === '2d');
  const FORCE_GL1 = !!(params && params.get('sky') === 'gl1');

  // ── 每帧的共同状态（GL 与 2D 共用）──────────────────────────
  const F = {};
  function hashInt(k) { return ih(k | 0, 7919); }

  function compute() {
    const lv = W.lv, w = Math.max(1, W.w), h = Math.max(1, W.h), M = Math.min(w, h);
    const L = lv.light, G = lv.gather, V = lv.vault, dn = lv.dayNight, LI = lv.lights;
    const df = W.dayFactor, dusk = W.dusk;
    const nightness = dn * smoothstep(0.62, 0.04, df);
    const t = W.t;
    const dt = S.lastT < 0 ? 0.016 : clamp(t - S.lastT, 0, 0.1);
    S.lastT = t;

    // 光的起点（话语成就之处）
    if (!S.lightSet) { S.lightO = [W.spirit.x || w * 0.5, W.spirit.y || h * 0.5]; }
    if (!S.sowSet) { S.sowO = [W.spirit.x || w * 0.5, W.spirit.y || h * 0.5]; }

    // 天色
    const dayT = mix3(PAL.pearlTop, PAL.dayTop, V), dayM = mix3(PAL.pearlMid, PAL.dayMid, V);
    let dayH = mix3(PAL.pearlHz, PAL.dayHz, V);
    dayH = mix3(dayH, PAL.goldHz, lv.good * 0.16);
    const nT = mix3(PAL.pearlNTop, PAL.nightTop, V), nM = mix3(PAL.pearlNMid, PAL.nightMid, V), nH = mix3(PAL.pearlNHz, PAL.nightHz, V);
    F.cTop = mix3(nT, dayT, df); F.cMid = mix3(nM, dayM, df); F.cHz = mix3(nH, dayH, df);
    F.dTop = mix3(PAL.pearlDTop, PAL.duskTop, V); F.dMid = mix3(PAL.pearlDMid, PAL.duskMid, V); F.dHz = mix3(PAL.pearlDHz, PAL.duskHz, V);

    // 光核 / 日
    const sEl = W.sun.elev;
    const lowS = 1 - smoothstep(0.02, 0.4, sEl);
    const aboveS = smoothstep(-0.3, 0.03, sEl);
    F.coreAmt = L * (1 - LI * 0.94) * aboveS;
    F.coreCol = mix3(PAL.core, PAL.coreLow, lowS * dn * 0.8);
    F.sunAmt = LI * L * smoothstep(-0.14, 0.02, sEl);
    F.sunDisc = LI * L * smoothstep(-0.06, 0.0, sEl);
    F.sunLow = lowS * dn;
    F.sunCol = mix3(PAL.sun, PAL.sunLow, F.sunLow);
    F.sunGlow = mix3(PAL.sunGlow, PAL.sunGlowLow, F.sunLow * 0.85);
    if (lv.good > 0.01) { F.sunGlow = mix3(F.sunGlow, [1, 0.8, 0.52], lv.good * 0.3); }
    F.sunR = Math.max(11, 0.028 * M);

    // 月
    const mEl = W.moon.elev, mo = lv.moon * smoothstep(-0.06, 0.02, mEl) * L;
    F.moonAmt = mo * nightness;
    F.moonDay = mo * (1 - nightness) * 0.85;
    F.moonHalo = mo * (0.25 + 0.75 * nightness);
    F.moonR = Math.max(10, 0.023 * M);
    F.moonCol = mix3(PAL.moon, PAL.moonLow, 1 - smoothstep(0.0, 0.3, mEl));
    F.moonPh = W.moon.phase == null ? 0.5 : W.moon.phase;

    // 星
    const s = lv.stars;
    const sowing = 4 * s * (1 - s) * (1 - smoothstep(0.0, 0.5, 1 - df));
    const starNight = dn * smoothstep(0.5, 0.02, df);
    F.starVis = s * (starNight + sowing * 0.55);
    const diagM = Math.hypot(w, h) / M;        // 以 min(w,h) 为单位的对角线：揭示半径须覆盖整幅
    F.diagM = diagM;
    F.starR = 0.25 + Math.pow(s, 0.6) * (diagM + 0.9);
    F.milky = smoothstep(0.35, 1.0, s) * (W.quality >= 0.7 ? 1 : 0.7);
    // 众星绕极缓转：只随夜的时辰（正午折返，那时看不见星）
    F.starRot = (U.fract((W.tod || 0) + 0.5) - 0.5) * 0.5;

    // 穹苍
    F.domeE = smoothstep(0, 1, V);
    const dayFilm = lerp(0.95, 0.45, lv.clouds) * lerp(1, 0.28, LI);
    F.film = V * (0.35 + 0.65 * L) * lerp(0.3, dayFilm, df);
    F.waOp = V * lerp(0.62, lerp(lerp(0.72, 0.6, lv.clouds), 0.16, LI), df);
    F.waGlow = V * lerp(0.1, lerp(0.42, 0.2, LI), df) * (0.3 + 0.7 * L);
    F.waCol = mix3(PAL.waNight, PAL.waDay, df * (0.2 + 0.8 * L));

    // 云
    F.clouds = lv.clouds;
    S.drift += dt * (0.012 + 0.02 * (W.wind || 0));
    F.drift = S.drift % 1000;
    let cLit = mix3(PAL.clPearlLit, PAL.clDayLit, LI), cSh = mix3(PAL.clPearlSh, PAL.clDaySh, LI);
    cLit = mix3(PAL.clNightLit, cLit, df); cSh = mix3(PAL.clNightSh, cSh, df);
    cLit = mix3(cLit, PAL.clDuskLit, dusk * 0.85); cSh = mix3(cSh, PAL.clDuskSh, dusk * 0.7);
    if (lv.good > 0.01) { cLit = mix3(cLit, [1, 0.86, 0.66], lv.good * 0.3); }
    F.clLit = cLit; F.clSh = cSh;
    // 主光（云的受光方向）
    if (nightness > 0.5 && lv.moon > 0.5 && mEl > 0) { F.keyX = W.moon.x; F.keyY = W.moon.y; }
    else { F.keyX = W.core.x; F.keyY = W.core.y; }

    // 海
    let wF = mix3(PAL.pearlWFar, PAL.waterFar, V), wN = mix3(PAL.pearlWNear, PAL.waterNear, V);
    wF = mix3(PAL.nightWFar, wF, df); wN = mix3(PAL.nightWNear, wN, df);
    if (dusk > 0.01) { wF = mix3(wF, [0.32, 0.2, 0.24], dusk * 0.35); }
    F.wFar = wF; F.wNear = wN;
    F.glit = 1.0;
    F.bio = lv.life * clamp(W.night * 1.25, 0, 1);

    // 地平雾（黎明多一层）
    const dawn = dn * Math.exp(-Math.pow((W.tod - 0.27) / 0.05, 2));
    F.mist = L * (0.3 + 0.22 * dusk + 0.35 * dawn);
    const hz = W.haze || [0, 0, 0];
    F.haze = [hz[0] / 255, hz[1] / 255, hz[2] / 255];
    F.pearl = L * (1 - V);

    // 神的灵
    const R = W.ritual || {};
    const ch = R.holding ? (R.charge || 0) : 0;
    F.charge = ch;
    F.spAmt = (0.35 + 0.65 * (1 - clamp(W.daylight, 0, 1) * 0.85)) * (1 + ch * 0.9);
    S.spT += dt * (1 + ch * 2.5);
    F.spT = S.spT % (Math.PI * 2 / 2.6 * 400);   // 与涟漪的周期对齐，取模不跳变
    F.ripple = clamp(0.22 - (+W.spirit.speed || 0) / 2000, 0, 0.22) + ch * 0.85;

    // 流星：每 25–45 秒一颗，0.6 秒
    F.shoot = null;
    const sv = s * nightness * (1 - F.clouds * 0.3);
    if (sv > 0.3 && !W.reduced) {
      const P = 35, k = Math.floor(t / P);
      for (let kk = k - 1; kk <= k; kk++) {
        const s0 = kk * P + 12.5 + hashInt(kk) * 10;
        const u = (t - s0) / 0.6;
        if (u >= 0 && u <= 1) {
          const h1 = hashInt(kk + 101), h2 = hashInt(kk + 202), h3 = hashInt(kk + 303);
          const ang = (h3 < 0.5 ? Math.PI - 0.35 - h3 * 0.9 : 0.35 + (h3 - 0.5) * 0.9);
          const dx = Math.cos(ang), dy = Math.sin(ang);
          const x0 = (0.12 + 0.76 * h1) * w, y0 = (0.04 + 0.26 * h2) * h;
          const travel = 0.42 * M;
          const hx0 = x0 + dx * travel * u, hy0 = y0 + dy * travel * u;
          const len = Math.min(travel * u, 0.16 * M) + 1;
          F.shoot = [hx0, hy0, sv * Math.pow(Math.sin(Math.PI * u), 0.6) * 0.9, 1.1, dx, dy, len];
        }
      }
    }

    F.L = L; F.G = G; F.V = V; F.df = df; F.dusk = dusk; F.nightness = nightness; F.M = M; F.w = w; F.h = h;
  }

  // ── WebGL ───────────────────────────────────────────────────
  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      S.error = 'shader: ' + gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function setupGL() {
    const gl = S.gl;
    if (!gl || gl.isContextLost()) return false;
    if (gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < NU + 2) { S.error = 'too few uniforms'; return false; }
    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return false;
    const pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs);
    gl.bindAttribLocation(pr, 0, 'aPos');
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS) && !gl.isContextLost()) { S.error = 'link: ' + gl.getProgramInfoLog(pr); return false; }
    S.prog = pr;
    S.loc = gl.getUniformLocation(pr, 'U');
    S.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, S.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
    gl.useProgram(pr);
    return !!S.loc;
  }

  function createGL(cv) {
    const attrs = { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false,
      preserveDrawingBuffer: false, powerPreference: 'default', desynchronized: false };
    let gl = null;
    if (!FORCE_GL1) { try { gl = cv.getContext('webgl2', attrs); S.isGL2 = !!gl; } catch (e) { gl = null; } }
    if (!gl) { try { gl = cv.getContext('webgl', attrs) || cv.getContext('experimental-webgl', attrs); } catch (e) { gl = null; } }
    return gl;
  }

  function put(i, a, b, c, d) { const o = i * 4; ub[o] = a; ub[o + 1] = b; ub[o + 2] = c; ub[o + 3] = d; }
  function putC(i, rgb, d) { put(i, rgb[0], rgb[1], rgb[2], d); }

  function renderGL() {
    const gl = S.gl;
    if (!gl || gl.isContextLost()) return;
    const w = F.w, h = F.h;
    const sp = W.spirit;
    put(0, w, h, W.t % 10000, F.M);
    put(1, w / S.cw, h / S.ch, W.jx || 0, W.jy || 0);
    put(2, W.core.x, W.core.y, F.coreAmt, F.G);
    put(3, W.sun.x, W.sun.y, F.sunAmt, F.sunR);
    put(4, W.moon.x, W.moon.y, F.moonAmt, F.moonR);
    put(5, F.moonPh, F.moonDay, F.starVis, F.starR);
    put(6, S.sowO[0], S.sowO[1], S.lightO[0], S.lightO[1]);
    put(7, F.L, 0.3 + Math.pow(F.L, 0.6) * (F.diagM + 1.0), W.lv.deep, F.V);
    put(8, F.clouds, F.drift, F.bio, F.film);
    put(9, sp.x, sp.y, W.lv.deep > 0.001 || F.L > 0 ? F.spAmt : F.spAmt * 0.3, F.charge);
    put(10, F.df, F.dusk, F.nightness, W.lv.good);
    put(11, W.lv.sabbath, F.domeE, W.quality >= 0.9 ? 4 : W.quality >= 0.7 ? 3 : 2, F.starRot);
    putC(12, F.cTop, W.HZ);
    putC(13, F.cMid, F.milky);
    putC(14, F.cHz, F.waOp);
    putC(15, F.dTop, F.sunLow);
    putC(16, F.dMid, F.mist);
    putC(17, F.dHz, F.waGlow);
    putC(18, F.wFar, F.glit);
    putC(19, F.wNear, 0);
    putC(20, F.haze, F.pearl);
    putC(21, F.coreCol, F.ripple);
    putC(22, F.sunCol, F.sunDisc);
    putC(23, F.sunGlow, F.moonHalo);
    putC(24, F.clSh, F.keyX);
    putC(25, F.clLit, F.keyY);
    if (F.shoot) { put(26, F.shoot[0], F.shoot[1], F.shoot[2], F.shoot[3]); put(27, F.shoot[4], F.shoot[5], F.shoot[6], 0); }
    else { put(26, 0, 0, 0, 1); put(27, 1, 0, 1, 0); }
    putC(28, F.waCol, W.moon.elev);
    putC(29, F.moonCol, F.spT);

    gl.viewport(0, 0, S.cw, S.ch);
    gl.useProgram(S.prog);
    gl.uniform4fv(S.loc, ub);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function onLost(e) {
    e.preventDefault();
    if (S.mode === 'gl') to2D();
  }
  function onRestored() {
    S.prog = null; S.buf = null; S.loc = null;
    if (!FORCE_2D && setupGL()) toGL();
  }

  // ── 切换（2D 画布与 GL 画布轮流占用 #sky 这个位置）─────────
  function to2D() {
    const gc = S.glCanvas;
    if (!S.fbCanvas) {
      const c = document.createElement('canvas');
      c.setAttribute('aria-hidden', 'true');
      S.fbCanvas = c;
    }
    const fc = S.fbCanvas;
    if (gc && gc.parentNode && !fc.parentNode) gc.parentNode.insertBefore(fc, gc);
    else if (!fc.parentNode && document.body) document.body.insertBefore(fc, document.body.firstChild);
    if (gc) { gc.id = 'sky-gl'; gc.style.display = 'none'; }
    fc.id = 'sky';
    fc.style.display = '';
    S.mode = '2d';
    resizeCanvas();
  }
  function toGL() {
    const gc = S.glCanvas;
    if (S.fbCanvas) { S.fbCanvas.id = 'sky-2d'; S.fbCanvas.style.display = 'none'; }
    gc.id = 'sky';
    gc.style.display = '';
    S.mode = 'gl';
    resizeCanvas();
  }

  // ── 画布尺寸：CSS 像素 × min(dpr,1.5) × 画质，上限约 2.2MP ──
  function resizeCanvas() {
    const w = Math.max(1, W.w | 0), h = Math.max(1, W.h | 0);
    const dpr = W.dpr || 1, q = clamp(W.quality || 1, 0.25, 1);
    let sc;
    if (S.mode === '2d') {
      sc = Math.min(dpr, 1) * (q < 0.9 ? 0.75 : 1);
      const cap = 1.3e6;
      if (w * h * sc * sc > cap) sc = Math.sqrt(cap / (w * h));
    } else {
      sc = Math.min(dpr, 1.5) * q;
      const cap = 2.2e6;
      if (w * h * sc * sc > cap) sc = Math.sqrt(cap / (w * h));
    }
    S.scale = sc;
    S.cw = Math.max(1, Math.round(w * sc));
    S.ch = Math.max(1, Math.round(h * sc));
    S.w = w; S.h = h;
    const c = S.mode === '2d' ? S.fbCanvas : S.glCanvas;
    if (c && (c.width !== S.cw || c.height !== S.ch)) { c.width = S.cw; c.height = S.ch; }
    if (S.mode === '2d') fbResize();
  }

  // ── Canvas2D 回退 ───────────────────────────────────────────
  // 自带的整数哈希值噪声（烘焙回退贴图用）
  function ih(x, y) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function vn(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return lerp(lerp(ih(ix, iy), ih(ix + 1, iy), ux), lerp(ih(ix, iy + 1), ih(ix + 1, iy + 1), ux), uy);
  }
  function fbn(x, y) {
    let s = 0, a = 0.5, n = 0;
    for (let i = 0; i < 4; i++) { s += a * vn(x, y); n += a; x = x * 2.03 + 17.3; y = y * 2.03 - 9.1; a *= 0.5; }
    return s / n;
  }
  function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; }
  function css(rgb, a) {
    const r = clamp(rgb[0] * 255, 0, 255) | 0, g = clamp(rgb[1] * 255, 0, 255) | 0, b = clamp(rgb[2] * 255, 0, 255) | 0;
    return a == null ? 'rgb(' + r + ',' + g + ',' + b + ')' : 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  }
  function fbInit() {
    const fb = { ctx: null, stars: null, glow: null, cloud: null, cloudTint: null, glit: null, key: '' };
    fb.ctx = S.fbCanvas.getContext('2d', { alpha: false });
    // 缓存的径向光晕（白）
    fb.glow = mk(128, 128);
    const g = fb.glow.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.08, 'rgba(255,255,255,0.55)');
    gr.addColorStop(0.3, 'rgba(255,255,255,0.16)');
    gr.addColorStop(0.65, 'rgba(255,255,255,0.04)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    // 云的遮罩（噪声），重新着色用的暂存画布
    const CW = 512, CH = 72;
    fb.cloud = mk(CW, CH);
    const cc = fb.cloud.getContext('2d');
    const img = cc.createImageData(CW, CH);
    const cf = (x, y) => fbn(x * 0.022, y * 0.09);
    for (let y = 0; y < CH; y++) {
      for (let x = 0; x < CW; x++) {
        // 横向可平铺：与平移一整幅的样本交叉混合
        const t = x / CW;
        const v = cf(x, y) * (1 - t) + cf(x - CW, y) * t;
        const band = Math.pow(Math.sin((y / CH) * Math.PI), 1.5);
        const d = smoothstep(0.52, 0.74, v + (band - 1) * 0.25) * band;
        const o = (y * CW + x) * 4;
        img.data[o] = img.data[o + 1] = img.data[o + 2] = 255;
        img.data[o + 3] = (d * 235) | 0;
      }
    }
    cc.putImageData(img, 0, 0);
    fb.cloudTint = mk(CW, CH);
    // 粼光之路：一条由水平短划组成的竖带
    fb.glit = mk(64, 256);
    const gg = fb.glit.getContext('2d');
    const rng = U.mulberry32(7);
    for (let i = 0; i < 420; i++) {
      const y = Math.pow(rng(), 0.9) * 256;
      const spread = 6 + (y / 256) * 26;
      const x = 32 + U.gauss() * spread;
      const len = 2 + (y / 256) * 10 * rng();
      gg.fillStyle = 'rgba(255,255,255,' + (0.25 + 0.6 * rng()).toFixed(2) + ')';
      gg.fillRect(x - len / 2, y, len, 1 + (y / 256) * 1.4);
    }
    S.fb = fb;
  }
  function fbResize() {
    if (!S.fb) fbInit();
    const fb = S.fb;
    // 预先烘焙的星空（只覆盖地平线以上）
    const w = S.w, h = S.h, sc = S.scale;
    const sw = Math.max(1, Math.round(w * sc)), sh = Math.max(1, Math.round(h * W.HZ * sc));
    fb.stars = mk(sw, sh);
    const g = fb.stars.getContext('2d');
    const rng = U.mulberry32(20240923);
    const n = Math.round((w * h * W.HZ) / 900);
    for (let i = 0; i < n; i++) {
      const x = rng() * sw, y = rng() * sh;
      const b = Math.pow(rng(), 3);
      const k = rng();
      const col = k < 0.15 ? '255,226,184' : k < 0.3 ? '191,212,255' : '244,247,255';
      const fade = smoothstep(0, 0.12, 1 - y / sh);
      g.fillStyle = 'rgba(' + col + ',' + ((0.2 + 0.8 * b) * fade).toFixed(3) + ')';
      const r = (0.5 + b * 1.1) * sc;
      g.fillRect(x - r / 2, y - r / 2, Math.max(1, r), Math.max(1, r));
      if (b > 0.75) {
        g.fillStyle = 'rgba(' + col + ',' + (0.25 * fade).toFixed(3) + ')';
        g.fillRect(x - 4 * sc, y - 0.5, 8 * sc, 1);
        g.fillRect(x - 0.5, y - 4 * sc, 1, 8 * sc);
      }
    }
  }
  function glowAt(g, x, y, r, rgb, a) {
    if (a <= 0.002 || r <= 0) return;
    g.globalAlpha = clamp(a, 0, 1);
    // 以 source-in 的方式着色太贵：用 lighter 叠一张白色光晕，再叠一层色
    g.drawImage(S.fb.glow, x - r, y - r, r * 2, r * 2);
    g.globalAlpha = 1;
    void rgb;
  }
  function tintGlow(g, x, y, r, rgb, a) {
    if (a <= 0.002 || r <= 0) return;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, css(rgb, a));
    gr.addColorStop(0.2, css(rgb, a * 0.32));
    gr.addColorStop(0.55, css(rgb, a * 0.07));
    gr.addColorStop(1, css(rgb, 0));
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function render2D() {
    const fb = S.fb;
    if (!fb || !fb.ctx) return;
    const g = fb.ctx, sc = S.scale, w = F.w, h = F.h, M = F.M;
    const HZy = W.HZ * h;
    const lm = F.L;
    g.setTransform(sc, 0, 0, sc, (W.jx || 0) * sc, (W.jy || 0) * sc);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
    g.fillStyle = '#000';
    g.fillRect(-20, -20, w + 40, h + 40);

    // 天
    if (lm > 0.002) {
      const dw = F.dusk * 0.62;
      const top = mix3(F.cTop, F.dTop, dw * 0.7), mid = mix3(F.cMid, F.dMid, dw), hz = mix3(F.cHz, F.dHz, dw);
      const gr = g.createLinearGradient(0, 0, 0, HZy);
      gr.addColorStop(0, css(top.map(v => v * lm)));
      gr.addColorStop(0.55, css(mid.map(v => v * lm)));
      gr.addColorStop(1, css(hz.map(v => v * lm)));
      g.fillStyle = gr;
      g.fillRect(-20, -20, w + 40, HZy + 21);
    }
    // 穹苍以上的水 + 水膜
    if (F.V > 0.002) {
      g.beginPath();
      g.moveTo(-20, -20);
      for (let i = 0; i <= 24; i++) {
        const x = i / 24;
        const y = lerp(W.HZ + 0.02, 0.15 + 0.55 * (x - 0.5) * (x - 0.5), F.domeE);
        g.lineTo(x * w, y * h);
      }
      g.lineTo(w + 20, -20);
      g.closePath();
      g.fillStyle = css(F.waCol, F.waOp);
      g.fill();
      g.beginPath();
      for (let i = 0; i <= 24; i++) {
        const x = i / 24;
        const y = lerp(W.HZ + 0.02, 0.15 + 0.55 * (x - 0.5) * (x - 0.5), F.domeE);
        if (i) g.lineTo(x * w, y * h); else g.moveTo(x * w, y * h);
      }
      g.strokeStyle = css([0.81, 0.9, 1], F.film * 0.18);
      g.lineWidth = 10; g.stroke();
      g.strokeStyle = css([0.81, 0.9, 1], F.film * 0.7);
      g.lineWidth = 1.4; g.stroke();
    }
    // 星
    if (F.starVis > 0.01 && fb.stars) {
      g.globalAlpha = clamp(F.starVis, 0, 1) * (0.85 + 0.15 * Math.sin(W.t * 1.7));
      g.drawImage(fb.stars, 0, 0, w, HZy);
      g.globalAlpha = 1;
    }
    g.globalCompositeOperation = 'lighter';
    // 光核 / 日晕 / 月晕
    if (F.coreAmt > 0.002) {
      tintGlow(g, W.core.x, W.core.y, M * (0.9 - 0.35 * F.G), F.coreCol, F.coreAmt * (0.25 + 0.45 * F.G));
      glowAt(g, W.core.x, W.core.y, M * 0.28, F.coreCol, F.coreAmt * F.G * 0.8);
    }
    if (F.sunAmt > 0.002) {
      tintGlow(g, W.sun.x, W.sun.y, M * 0.75, F.sunGlow, F.sunAmt * 0.22);
      tintGlow(g, W.sun.x, W.sun.y, M * 0.18, F.sunGlow, F.sunAmt * 0.45);
    }
    if (F.moonHalo > 0.002 && W.moon.y < HZy) tintGlow(g, W.moon.x, W.moon.y, M * 0.3, [0.62, 0.71, 0.85], F.moonHalo * 0.16);
    g.globalCompositeOperation = 'source-over';
    // 月
    const mAll = F.moonAmt + F.moonDay;
    if (mAll > 0.01 && W.moon.y < HZy + F.moonR) {
      const r = F.moonR, mx = W.moon.x, my = W.moon.y;
      g.save();
      g.beginPath(); g.rect(-20, -20, w + 40, HZy + 20); g.clip();
      // 暗面（夜里遮住身后的星）
      if (F.moonAmt > 0.01) {
        g.globalAlpha = clamp(F.moonAmt, 0, 1);
        g.fillStyle = css(mix3(F.cTop, F.cMid, 0.6).map(v => v * 0.8 + 0.01));
        g.beginPath(); g.arc(mx, my, r, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = clamp(F.moonAmt + F.moonDay * 0.45, 0, 1);
      g.fillStyle = css(F.moonCol);
      g.translate(mx, my);
      let ph = clamp(F.moonPh, 0, 1);
      if (ph > 0.5) { g.scale(-1, 1); ph = 1 - ph; }
      const c = Math.cos(ph * Math.PI * 2), rx = Math.max(0.01, Math.abs(c) * r);
      g.beginPath();
      g.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
      if (c > 0) g.ellipse(0, 0, rx, r, 0, Math.PI / 2, -Math.PI / 2, true);
      else g.ellipse(0, 0, rx, r, 0, Math.PI / 2, Math.PI * 1.5, false);
      g.fill();
      g.restore();
      g.globalAlpha = 1;
    }
    // 云
    if (F.clouds > 0.01) {
      const ct = fb.cloudTint.getContext('2d');
      const CW = fb.cloud.width, CH = fb.cloud.height;
      ct.globalCompositeOperation = 'source-over';
      ct.clearRect(0, 0, CW, CH);
      ct.drawImage(fb.cloud, 0, 0);
      ct.globalCompositeOperation = 'source-in';
      const cg = ct.createLinearGradient(0, 0, 0, CH);
      cg.addColorStop(0, css(F.clLit.map(v => v * Math.max(lm, 0.05))));
      cg.addColorStop(1, css(F.clSh.map(v => v * Math.max(lm, 0.05))));
      ct.fillStyle = cg; ct.fillRect(0, 0, CW, CH);
      ct.globalCompositeOperation = 'source-over';
      const y0 = h * 0.34, bh = HZy - y0 - h * 0.02;
      const off = ((F.drift * 0.25) % 1) * w * 1.6;
      g.globalAlpha = clamp(F.clouds, 0, 1) * 0.85;
      g.drawImage(fb.cloudTint, -off, y0, w * 1.6, bh);
      g.drawImage(fb.cloudTint, -off + w * 1.6, y0, w * 1.6, bh);
      g.globalAlpha = 1;
    }
    // 日轮
    if (F.sunDisc > 0.01) {
      g.save();
      g.beginPath(); g.rect(-20, -20, w + 40, HZy + 20); g.clip();
      g.globalAlpha = clamp(F.sunDisc, 0, 1);
      g.fillStyle = css(F.sunCol);
      g.beginPath(); g.ellipse(W.sun.x, W.sun.y, F.sunR, F.sunR * lerp(1, 0.84, F.sunLow), 0, 0, Math.PI * 2); g.fill();
      g.restore();
      g.globalAlpha = 1;
    }
    // 流星
    if (F.shoot) {
      const s = F.shoot;
      const tx = s[0] - s[4] * s[6], ty = s[1] - s[5] * s[6];
      const lg = g.createLinearGradient(s[0], s[1], tx, ty);
      lg.addColorStop(0, 'rgba(240,246,255,' + clamp(s[2], 0, 1).toFixed(3) + ')');
      lg.addColorStop(1, 'rgba(240,246,255,0)');
      g.strokeStyle = lg; g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(s[0], s[1]); g.lineTo(tx, ty); g.stroke();
    }

    // 海
    const seaH = h - HZy;
    {
      const hzR = mix3(F.cHz, F.dHz, F.dusk * 0.62);
      const gr = g.createLinearGradient(0, HZy, 0, h);
      const deep = [0.012, 0.02, 0.036].map(v => v * W.lv.deep);
      const m = (a, b) => mix3(deep, mix3(a, b, 1), lm);
      gr.addColorStop(0, css(m(mix3(F.wFar, hzR, 0.85), hzR)));
      gr.addColorStop(0.18, css(m(mix3(F.wFar, hzR, 0.4), hzR)));
      gr.addColorStop(0.55, css(m(F.wFar, F.wFar)));
      gr.addColorStop(1, css(m(F.wNear, F.wNear)));
      g.fillStyle = gr;
      g.fillRect(-20, HZy, w + 40, seaH + 20);
    }
    g.globalCompositeOperation = 'lighter';
    const glitPath = (lx, ly, rgb, amt) => {
      if (amt < 0.01 || ly > HZy) return;
      const aL = (HZy - ly) / HZy;
      const low = 1 - smoothstep(0, 0.55, aL);
      const len = seaH * (0.5 + 0.5 * low);
      const wid = M * (0.12 + 0.2 * (1 - low));
      g.globalAlpha = clamp(amt, 0, 1) * (0.45 + 0.15 * Math.sin(W.t * 3.1));
      g.drawImage(fb.glit, lx - wid / 2, HZy + (1 - low) * seaH * 0.3, wid, len);
      g.globalAlpha = 1;
      tintGlow(g, lx, HZy + (HZy - ly) * 0.6, M * 0.25, rgb, amt * 0.1);
    };
    glitPath(W.core.x, W.core.y, F.coreCol, F.coreAmt * F.G);
    glitPath(W.sun.x, W.sun.y, F.sunGlow, F.sunAmt);
    glitPath(W.moon.x, W.moon.y, F.moonCol, F.moonAmt * 0.8);
    // 神的灵的倒影
    const sp = W.spirit;
    if (W.lv.deep > 0.01) {
      const over = sp.y > HZy;
      const yr = over ? sp.y + h * 0.02 : Math.min(h * 1.05, HZy + (HZy - sp.y) * 0.8 + h * 0.012);
      const a = F.spAmt * W.lv.deep;
      g.save();
      g.beginPath(); g.rect(-20, HZy, w + 40, seaH + 20); g.clip();
      g.globalAlpha = clamp(a * 0.5, 0, 1);
      g.drawImage(fb.glit, sp.x - M * 0.05, over ? sp.y : HZy, M * 0.1, Math.max(10, yr - (over ? sp.y : HZy) + M * 0.15));
      g.globalAlpha = 1;
      g.translate(sp.x, yr); g.scale(1, 0.3);
      tintGlow(g, 0, 0, M * 0.2, PAL.spirit, a * 0.35);
      g.restore();
    }
    g.globalCompositeOperation = 'source-over';
    // 地平雾
    if (F.mist > 0.01) {
      const mg = g.createLinearGradient(0, HZy - h * 0.06, 0, HZy + h * 0.04);
      mg.addColorStop(0, css(F.haze, 0));
      mg.addColorStop(0.6, css(F.haze, F.mist * 0.85));
      mg.addColorStop(1, css(F.haze, 0));
      g.fillStyle = mg;
      g.fillRect(-20, HZy - h * 0.06, w + 40, h * 0.1);
    }
    // 甚好 / 安息
    if (W.lv.good > 0.01) {
      g.globalCompositeOperation = 'lighter';
      g.fillStyle = 'rgba(255,200,120,' + (W.lv.good * 0.05 * lm).toFixed(3) + ')';
      g.fillRect(-20, -20, w + 40, h + 40);
    }
    if (W.lv.sabbath > 0.01) {
      g.globalCompositeOperation = 'lighter';
      g.fillStyle = 'rgba(255,241,214,' + (W.lv.sabbath * 0.05 * lm * (0.25 + 0.75 * F.df)).toFixed(3) + ')';
      g.fillRect(-20, -20, w + 40, h + 40);
    }
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
  }

  // ── 对外接口 ────────────────────────────────────────────────
  function init(canvas) {
    S.glCanvas = canvas;
    if (GS.bus) {
      GS.bus.on('fulfill', e => {
        if (!e) return;
        if (W.lt.light > 0 && !S.lightSet && W.lv.light < 0.3) { S.lightO = [e.x, e.y]; S.lightSet = true; }
        if (W.lt.stars > 0 && !S.sowSet && W.lv.stars < 0.3) { S.sowO = [e.x, e.y]; S.sowSet = true; }
      });
    }
    let ok = false;
    if (!FORCE_2D && canvas) {
      S.gl = createGL(canvas);
      if (S.gl) {
        canvas.addEventListener('webglcontextlost', onLost, false);
        canvas.addEventListener('webglcontextrestored', onRestored, false);
        ok = setupGL();
      }
    }
    if (ok) { S.mode = 'gl'; }
    else { to2D(); }
  }

  function resize(canvas, w, h, dpr) {
    void canvas; void w; void h; void dpr; // 以 GS.W 为准（W.resize 已在此前调用）
    if (S.mode === 'none') return;
    resizeCanvas();
  }

  function render() {
    if (S.mode === 'none') return;
    if (W.w < 2 || W.h < 2) return;
    if (S.w !== (W.w | 0) || S.h !== (W.h | 0)) resizeCanvas();
    // 恢复存档后（程度被瞬间对齐）：光与星都已在，起点无所谓
    if (W.lt.light === 0) S.lightSet = false;
    if (W.lt.stars === 0) S.sowSet = false;
    compute();
    if (S.mode === 'gl') {
      if (S.gl && S.gl.isContextLost()) { to2D(); render2D(); return; }
      renderGL();
    } else render2D();
  }

  GS.sky = {
    init, resize, render,
    get mode() { return S.mode; },
    debug: {
      state: () => ({ mode: S.mode, gl2: S.isGL2, cw: S.cw, ch: S.ch, scale: S.scale, error: S.error }),
      lose() { const e = S.gl && S.gl.getExtension('WEBGL_lose_context'); if (e) { e.loseContext(); S._lc = e; return true; } return false; },
      restore() { if (S._lc) { S._lc.restoreContext(); return true; } return false; },
      gl: () => S.gl,
    },
  };
})(window.GS);
