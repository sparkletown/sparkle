import { AnimatedSprite, Graphics, Sprite, Texture } from "pixi.js";

import { flame } from "../../constants/AssetsFlame";

export class Flame extends Sprite {
  constructor() {
    super();

    // this.circle();
    this.flame();
  }

  private circle(): void {
    const g = new Graphics();
    g.beginFill(0xff0000);
    g.drawCircle(0, 0, 100);
    g.endFill();

    this.addChild(g);
  }

  private flame(): void {
    const textureArray = [];

    for (let i = 0; i < flame.length; i++) {
      const texture = Texture.from(flame[i]);
      textureArray.push(texture);
    }

    const mc = new AnimatedSprite(textureArray);
    mc.anchor.set(0.5, 1);
    mc.play();
    this.addChild(mc);
  }
}
