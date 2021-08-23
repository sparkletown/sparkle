export const LIGHT_KEYFRAMES = [
  { time: 0, data: [0.7, 2] },
  { time: 7, data: [0.7, 1.8] },
  { time: 13, data: [0.35, 0.44] },
  { time: 20, data: [0.22, 0.2] },
  { time: 32, data: [0.14, 0.07] },
  { time: 50, data: [0.09, 0.032] },
  { time: 65, data: [0.07, 0.017] },
  { time: 100, data: [0.045, 0.0075] },
  { time: 160, data: [0.027, 0.0028] },
  { time: 200, data: [0.022, 0.0019] },
  { time: 325, data: [0.014, 0.0007] },
  { time: 600, data: [0.007, 0.0002] },
  { time: 3250, data: [0.0014, 0.000007] },
  { time: Infinity, data: [0.0014, 0.000007] },
];

export const SUN_KEYFRAMES = [
  { time: -1, data: [0, 0, 0] },
  { time: 25, data: [0, 0, 0] },
  { time: 4, data: [0, 0, 0] },
  { time: 6, data: [0.6, 0.5, 0.5] },
  { time: 12, data: [0.8, 0.8, 0.8] },
  { time: 20, data: [0.6, 0.5, 0.5] },
  { time: 22, data: [0, 0, 0] },
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_SR = SUN_KEYFRAMES[0].data[0];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_SG = SUN_KEYFRAMES[0].data[1];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_SB = SUN_KEYFRAMES[0].data[2];

export const MOON_KEYFRAMES = [
  { time: -1, data: [0.15, 0.15, 0.2] },
  { time: 25, data: [0.15, 0.15, 0.2] },
  { time: 4, data: [0.15, 0.15, 0.2] },
  { time: 7, data: [0, 0, 0] },
  { time: 19, data: [0, 0, 0] },
  { time: 20, data: [0.1, 0.1, 0.12] },
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_MR = MOON_KEYFRAMES[0].data[0];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_MG = MOON_KEYFRAMES[0].data[1];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_MB = MOON_KEYFRAMES[0].data[2];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_R = 0.5;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_G = 0.5;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_B = 0.5;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.LIGHT_S = 100;
