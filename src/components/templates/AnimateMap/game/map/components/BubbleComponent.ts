import { Sprite } from "pixi.js";

export class BubbleComponent {
  public text: string;
  public backgroudnColor: number;
  public lifeTime: number;
  public view?: Sprite;

  constructor(text: string, backgroudnColor = 0x0) {
    this.text = text;
    this.backgroudnColor = backgroudnColor;
    this.lifeTime = 250;
  }
}
