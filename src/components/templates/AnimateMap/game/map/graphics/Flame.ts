import { Graphics, Sprite } from "pixi.js";

export class Flame extends Sprite {
  constructor() {
    super();

    const g = new Graphics();
    g.beginFill(0xff0000);
    g.drawCircle(0, 0, 100);
    g.endFill();

    this.addChild(g);
  }
}
