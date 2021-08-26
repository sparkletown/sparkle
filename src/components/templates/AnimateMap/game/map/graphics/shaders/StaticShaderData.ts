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

const BATCH_SIZE = 64;
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
    while (this.lightsCol.length > 0) {
      this.sprite.filters[0].uniforms.lightsCol = this.lightsCol.slice(
        0,
        BATCH_SIZE
      );
      this.sprite.filters[0].uniforms.lightsPos = this.lightsPos.slice(
        0,
        BATCH_SIZE << 1
      );
      this.sprite.filters[0].uniforms.koef = this.koef.slice(
        0,
        BATCH_SIZE << 1
      );
      this.sprite.filters[0].uniforms.lightQuantity =
        this.lightsCol.length > BATCH_SIZE ? BATCH_SIZE : this.lightsCol.length;
      this.app.renderer.render(this.sprite, this.renderTexture, false);
      if (this.lightsCol.length < BATCH_SIZE) {
        this.lightsCol = new Array<number>();
        this.lightsPos = new Array<number>();
      } else {
        this.lightsCol = this.lightsCol.slice(BATCH_SIZE);
        this.lightsPos = this.lightsPos.slice(BATCH_SIZE * 2);
        this.koef = this.koef.slice(BATCH_SIZE * 2);
      }
    }
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
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 5470.872632326921,
    y: 5252.011643870314,
    size: 99.965,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 4909.689266108222,
    y: 6194.576285618718,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3989.8276688796764,
    y: 5680.715818780861,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3904.2250209057356,
    y: 5328.522067116647,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 5782.102538459783,
    y: 5247.810999026931,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 5831.018337302035,
    y: 5164.654140995103,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 5884.581137034302,
    y: 5016.194691508868,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 6026.436953676832,
    y: 5035.761011045769,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3895.4201771141315,
    y: 4751.560219772286,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3932.10702624582,
    y: 4749.114429830172,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3913.763601679977,
    y: 4655.685254041471,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3521.458894965117,
    y: 5114.026289193371,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 3719.567880276235,
    y: 4223.025013281751,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 5897.543823727494,
    y: 4550.760865524838,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 6367.135492613112,
    y: 5367.899285184654,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.929,
    b: 0.074,
    x: 6438.063400934377,
    y: 5174.68187975776,
    size: 238.174,
  },
  {
    r: 0.294,
    g: 0.246,
    b: 0.543,
    x: 4906.998897171896,
    y: 5609.54333146538,
    size: 238.174,
  },
  {
    r: 0,
    g: 0.332,
    b: 0.677,
    x: 4904.553107229784,
    y: 5611.989121407492,
    size: 238.174,
  },
  {
    r: 0,
    g: 0.332,
    b: 0.677,
    x: 4906.998897171896,
    y: 5609.54333146538,
    size: 403.571,
  },
  {
    r: 1,
    g: 0.332,
    b: 0.677,
    x: 4525.52479064244,
    y: 5403.318377114934,
    size: 306.145,
  },
  {
    r: 1,
    g: 0.157,
    b: 0.677,
    x: 4224.41272829773,
    y: 5057.039505418517,
    size: 306.145,
  },
  {
    r: 1,
    g: 0.157,
    b: 0.677,
    x: 5658.609481245585,
    y: 4802.900924799583,
    size: 306.145,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 5601.39818940009,
    y: 4459.633173726615,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 4180.751479257748,
    y: 4547.557895931272,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 5460.778856285111,
    y: 5773.08398967424,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 5819.1022104753165,
    y: 5673.7170091004855,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 4202.130435684222,
    y: 6001.929157056219,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 4500.231377405486,
    y: 6278.952254413352,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 4563.464910497874,
    y: 6297.018978154034,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 4714.020941670229,
    y: 6315.085701894717,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 5243.97817139692,
    y: 6158.507429475469,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0.677,
    x: 3641.1635182679297,
    y: 4494.093728073292,
    size: 220.048,
  },
  {
    r: 1,
    g: 0,
    b: 0,
    x: 4175.152151556157,
    y: 4640.141901280329,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 0,
    x: 4247.434283099172,
    y: 4386.580880633178,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 0,
    x: 5637.854742250478,
    y: 4952.5628620765365,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 0,
    x: 5808.702234016462,
    y: 4736.02359925686,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 5667.653723372452,
    y: 4696.29162442756,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 5094.8024183095085,
    y: 5483.916996421718,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 4946.517444970926,
    y: 5383.824639418175,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 5395.079489320138,
    y: 5339.339147416601,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 4312.599183948486,
    y: 5287.439406748097,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 4197.678329611084,
    y: 4979.748087070539,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 4401.570167951635,
    y: 5283.732282414632,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 3938.1796262685652,
    y: 5005.697957404791,
    size: 111.294,
  },
  {
    r: 0,
    g: 0.617,
    b: 1,
    x: 5557.132990527749,
    y: 5376.457226533072,
    size: 111.294,
  },
  {
    r: 1,
    g: 0,
    b: 1,
    x: 5922.253423545339,
    y: 4746.6244795777275,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.412,
    b: 1,
    x: 5630.157077131267,
    y: 4600.576306370692,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.412,
    b: 1,
    x: 4517.0610269383815,
    y: 4755.918388479245,
    size: 174.734,
  },
  {
    r: 1,
    g: 1,
    b: 0,
    x: 4066.5992764051616,
    y: 4984.165234578465,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4310.950921605348,
    y: 5206.664293622536,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4479.8118146298675,
    y: 5359.632396715336,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4599.007739117764,
    y: 5427.176753925143,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4851.30577928381,
    y: 5411.283963993425,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4169.902410961338,
    y: 4809.344545329552,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4212.018304280394,
    y: 4463.676364314655,
    size: 174.734,
  },
  {
    r: 1,
    g: 0.749,
    b: 0.123,
    x: 4243.406564395539,
    y: 4107.2805500958475,
    size: 174.734,
  },
];
