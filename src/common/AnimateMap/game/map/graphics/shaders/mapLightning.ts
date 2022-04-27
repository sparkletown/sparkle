import { Filter } from "pixi.js";

import {
  KeyFramer,
  LinearInterpolationCallback,
} from "../../../utils/KeyFramer";

import fragShader from "./ColorMatrixFS.glsl";
import vertShader from "./ColorMatrixVS.glsl";
import {
  LIGHT_KEYFRAMES,
  MOON_KEYFRAMES,
  STAT_LIGHT_KEYFRAMES,
  SUN_KEYFRAMES,
} from "./KeyframesConfigs";
import staticLightsFS from "./StaticLigthsFS.glsl";

export const mapLightningShader = new Filter(vertShader, fragShader, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 9920, 9920],
  zoom: 4.0,
});

export const mapStaticLightningShader = new Filter(vertShader, staticLightsFS, {
  frame: [0, 0, 9920, 9920],
  koef: [0.027, 0.0028],
});

mapLightningShader.uniforms.lightsPos = [];
mapLightningShader.uniforms.lightsCol = [];

export class LightSize extends KeyFramer {
  constructor() {
    super((a, b, size) => {
      const l = (b[0] - a[0]) * size + a[0];
      const q = (b[1] - a[1]) * size + a[1];
      return [l, q];
    }, LIGHT_KEYFRAMES);
  }
}

const interpolateDayNightKeys: LinearInterpolationCallback = (
  left,
  right,
  time
) => {
  const r = (right[0] - left[0]) * time + left[0];
  const g = (right[1] - left[1]) * time + left[1];
  const b = (right[2] - left[2]) * time + left[2];
  return [r, g, b];
};

const interpolateStaticLightKeys: LinearInterpolationCallback = (
  left,
  right,
  time
) => {
  return [(right[0] - left[0]) * time + left[0]];
};

export const staticLightKeyFramer = new KeyFramer(
  interpolateStaticLightKeys,
  STAT_LIGHT_KEYFRAMES
);

export const sunKeyFramer = new KeyFramer(
  interpolateDayNightKeys,
  SUN_KEYFRAMES
);

export const moonKeyFramer = new KeyFramer(
  interpolateDayNightKeys,
  MOON_KEYFRAMES
);
