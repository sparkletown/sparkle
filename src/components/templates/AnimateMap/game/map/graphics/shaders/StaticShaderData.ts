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

const BATCH_SIZE = 32;
const textureSize = 8128;
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
      this.lightsPos[this.lightQuantity << 1] = light.x;
      this.lightsPos[(this.lightQuantity << 1) + 1] = light.y;
      const koef = new LightSize().getFrame(light.size);
      this.koef[this.lightQuantity << 1] = koef[0];
      this.koef[(this.lightQuantity << 1) + 1] = koef[1];
      this.lightQuantity++;
    });
    this.renderer = autoDetectRenderer();
    this.baseRenderTexture = new BaseRenderTexture({
      width: textureSize,
      height: textureSize,
      scaleMode: SCALE_MODES.LINEAR,
      resolution: 0.5,
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
  }

  public renderSprite() {
    this.sprite.filterArea = new Rectangle(0, 0, textureSize, textureSize);
    const render = () => {
      setTimeout(() => {
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
          this.lightsCol.length > BATCH_SIZE
            ? BATCH_SIZE
            : this.lightsCol.length;
        this.app.renderer.render(this.sprite, this.renderTexture, false);
        if (this.lightsCol.length < BATCH_SIZE) {
          this.lightsCol = new Array<number>();
          this.lightsPos = new Array<number>();
        } else {
          this.lightsCol = this.lightsCol.slice(BATCH_SIZE);
          this.lightsPos = this.lightsPos.slice(BATCH_SIZE * 2);
          this.koef = this.koef.slice(BATCH_SIZE * 2);
          render();
        }
      }, 100);
    };
    render();
    return this.renderTexture;
  }
}
