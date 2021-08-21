import * as PIXI from "pixi.js";

import { KeyFramer } from "../../../utils/KeyFramer";

import fragShader from "./fsColorMatrix.glsl";
import vertShader from "./vsColorMatrix.glsl";

const mapLightningShader = new PIXI.Filter(vertShader, fragShader, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 9000, 9000],
  koef: [0.027, 0.0028],
});
const zoomedLightningShader = new PIXI.Filter(vertShader, fragShader, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 100, 100],
  koef: [0.027, 0.0028],
});
export { mapLightningShader, zoomedLightningShader };

export class LightSize extends KeyFramer {
  constructor() {
    super((a: Array<number>, b: Array<number>, size: number) => {
      const l = (b[0] - a[0]) * size + a[0];
      const q = (b[1] - a[1]) * size + a[1];
      return [l, q];
    });

    this.addKey([0.7, 2], 0);
    this.addKey([0.7, 1.8], 7);
    this.addKey([0.35, 0.44], 13);
    this.addKey([0.22, 0.2], 20);
    this.addKey([0.14, 0.07], 32);
    this.addKey([0.09, 0.032], 50);
    this.addKey([0.07, 0.017], 65);
    this.addKey([0.045, 0.0075], 100);
    this.addKey([0.027, 0.0028], 160);
    this.addKey([0.022, 0.0019], 200);
    this.addKey([0.014, 0.0007], 325);
    this.addKey([0.007, 0.0002], 600);
    this.addKey([0.0014, 0.000007], 3250);
    this.addKey([0.0014, 0.000007], Infinity);
  }
}
