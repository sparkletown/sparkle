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

const MAX_LIGHTS = 512;
const BATCH_SIZE = 128;
const textureSize = 2048;
export interface LightData {
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
  size: number;
}

export class ShaderDataProvider {
  private lightsPos = new Float32Array(MAX_LIGHTS * 2);
  private lightsCol = new Int32Array(MAX_LIGHTS);
  private koef = new Float32Array(MAX_LIGHTS * 2);
  private lightsQuantity: number = 0;
  public baseRenderTexture;
  public renderTexture;
  public readonly sprite: Sprite;
  private renderer;
  constructor(data: LightData[], private app: Application) {
    data.forEach((light) => {
      const r: number = Math.floor(light.r * 255) << 16;
      const g: number = Math.floor(light.g * 255) << 8;
      const b: number = Math.floor(light.b * 255);
      this.lightsCol[this.lightsQuantity] = r + g + b;
      this.lightsPos[this.lightsQuantity << 1] = light.x;
      this.lightsPos[(this.lightsQuantity << 1) + 1] = light.y;
      const koef = new LightSize().getFrame(light.size);
      this.koef[this.lightsQuantity << 1] = koef[0];
      this.koef[(this.lightsQuantity << 1) + 1] = koef[1];
      this.lightsQuantity++;
    });
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
    this.sprite.filters[0].uniforms.lightsQuantity = this.lightsQuantity;
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
      if (this.lightsCol.length >= BATCH_SIZE) {
        this.sprite.filters[0].uniforms.lightsQuantity = BATCH_SIZE;
      } else {
        this.sprite.filters[0].uniforms.lightsQuantity = this.lightsCol.length;
      }
      this.app.renderer.render(this.sprite, this.renderTexture, true);
      if (this.lightsCol.length < BATCH_SIZE) {
        this.lightsCol = new Int32Array();
        this.lightsPos = new Float32Array();
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
  { r: 0.8, g: 0.254, b: 0.0, x: 4455, y: 5097, size: 128.146 },
  { r: 0.8, g: 0.254, b: 0.0, x: 4455, y: 5097, size: 3000 },
  {
    r: 0.254,
    g: 0.254,
    b: 0.254,
    x: 9000,
    y: 5544.292999514062,
    size: 128.146,
  },
];
