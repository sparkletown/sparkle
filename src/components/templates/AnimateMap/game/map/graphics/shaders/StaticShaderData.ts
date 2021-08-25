import {
  Application,
  autoDetectRenderer,
  BaseRenderTexture,
  Rectangle,
  RenderTexture,
  SCALE_MODES,
  Sprite,
} from "pixi.js";

import { LightSize, mapStaticLightningShader } from "./mapLightning";

const BATCH_SIZE = 10;
const textureSize = 9920;
export interface LightData {
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
  size: number;
}

export class ShaderDataProvider {
  private lightsPos = new Array<number>();
  private lightsCol = new Array<number>();
  private koef = new Array<number>();
  private lightQuantity: number = 0;
  public baseRenderTexture;
  public renderTexture;
  public readonly sprite: Sprite;
  private renderer;
  constructor(data: LightData[], private app: Application) {
    data.forEach((light) => {
      const r: number = Math.floor(light.r * 255) << 16;
      const g: number = Math.floor(light.g * 255) << 8;
      const b: number = Math.floor(light.b * 255);
      this.lightsCol[this.lightQuantity] = r + g + b;
      this.lightsPos[this.lightQuantity << 1] = (light.x / 9920) * 9000;
      this.lightsPos[(this.lightQuantity << 1) + 1] = (light.y / 9920) * 9000;
      const koef = new LightSize().getFrame(light.size);
      this.koef[this.lightQuantity << 1] = koef[0];
      this.koef[(this.lightQuantity << 1) + 1] = koef[1];
      this.lightQuantity++;
    });
    console.log("lights quantity", this.lightQuantity);
    this.renderer = autoDetectRenderer();
    this.baseRenderTexture = new BaseRenderTexture({
      width: textureSize,
      height: textureSize,
      scaleMode: SCALE_MODES.LINEAR,
      resolution: 1.0,
    });
    this.renderTexture = new RenderTexture(this.baseRenderTexture);
    this.sprite = new Sprite(this.renderTexture);
    this.sprite.filters = [mapStaticLightningShader];
    this.sprite.filters[0].uniforms.lightsCol = this.lightsCol;
    this.sprite.filters[0].uniforms.lightsPos = this.lightsPos;
    this.sprite.filters[0].uniforms.koef = this.koef;
    this.sprite.filters[0].uniforms.lightsQuantity = this.lightQuantity;
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.name = "staticLightBuffer";
    this.sprite.width = textureSize;
    this.sprite.height = textureSize;
    console.log("static shadering", this);
  }

  public renderSprite() {
    this.sprite.filterArea = new Rectangle(0, 0, textureSize, textureSize);
    // while (this.lightsCol.length > 0) {
    //   if (this.lightsCol.length >= BATCH_SIZE) {
    //     this.sprite.filters[0].uniforms.lightsQuantity = BATCH_SIZE;
    //   } else {
    //     this.sprite.filters[0].uniforms.lightsQuantity = this.lightsCol.length;
    //   }
    this.sprite.filters[0].uniforms.lightsCol = this.lightsCol;
    this.sprite.filters[0].uniforms.lightsPos = this.lightsPos;
    this.sprite.filters[0].uniforms.koef = this.koef;
    this.sprite.filters[0].uniforms.lightQuantity = this.lightsCol.length;
    this.app.renderer.render(this.sprite, this.renderTexture, true);
    if (this.lightsCol.length < BATCH_SIZE) {
      this.lightsCol = new Array<number>();
      this.lightsPos = new Array<number>();
    } else {
      this.lightsCol = this.lightsCol.slice(BATCH_SIZE);
      this.lightsPos = this.lightsPos.slice(BATCH_SIZE * 2);
      this.koef = this.koef.slice(BATCH_SIZE * 2);
    }
    // }
    return this.renderTexture;
  }
}

export const staticLightData: LightData[] = [
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3387.499999999998,
    y: 4339.187500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3896.874999999998,
    y: 4179.812500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3928.124999999998,
    y: 4482.937500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4062.499999999998,
    y: 4523.562500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4171.874999999998,
    y: 4720.437500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3796.874999999998,
    y: 5051.687500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3753.124999999998,
    y: 4751.687500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3468.749999999998,
    y: 4751.687500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3328.124999999998,
    y: 4754.812500000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3655.937499999999,
    y: 5467.625000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3771.562499999999,
    y: 5398.875000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4021.562499999999,
    y: 5258.250000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4259.062499999999,
    y: 5127.000000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4293.437499999999,
    y: 5364.500000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4680.937499999999,
    y: 5589.500000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4702.812499999999,
    y: 5473.875000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4327.812499999999,
    y: 5748.875000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3884.062499999999,
    y: 5777.000000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 3787.187499999999,
    y: 5870.750000000009,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4537.812499999999,
    y: 6146.687500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4900.312499999999,
    y: 6334.187500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 4906.562499999999,
    y: 5912.312500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5212.812499999999,
    y: 5859.187500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5237.812499999999,
    y: 5999.812500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5559.687499999999,
    y: 5877.937500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5412.812499999999,
    y: 5637.312500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5281.562499999999,
    y: 5402.937500000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5662.812499999998,
    y: 5183.250000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5750.312499999998,
    y: 4980.125000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5731.562499999998,
    y: 5567.625000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5931.562499999998,
    y: 5767.625000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6025.312499999998,
    y: 5864.500000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6278.437499999998,
    y: 5545.750000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6162.812499999998,
    y: 5480.125000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6031.562499999998,
    y: 5402.000000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6156.562499999998,
    y: 5086.375000000011,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6069.062499999998,
    y: 4749.812500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6022.187499999998,
    y: 4446.687500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5797.187499999998,
    y: 4249.812500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5556.562499999998,
    y: 4384.187500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 5631.562499999998,
    y: 4549.812500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6297.187499999998,
    y: 4377.937500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6347.187499999998,
    y: 4740.437500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6487.812499999998,
    y: 4752.937500000013,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6278.124999999996,
    y: 3962.0000000000127,
    size: 100,
  },
  {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    x: 6156.249999999996,
    y: 4033.8750000000127,
    size: 100,
  },
];
