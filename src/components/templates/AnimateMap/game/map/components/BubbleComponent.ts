import { Sprite } from "pixi.js";

export class BubbleComponent {
  public text: string;
  public backgroudnColor: number;
  public lifeTime: number;
  public view: Sprite | null = null;

  constructor(text: string, backgroudnColor = 0xffffff) {
    this.text = text;
    this.backgroudnColor = backgroudnColor;
    this.lifeTime = 100;
  }
}
