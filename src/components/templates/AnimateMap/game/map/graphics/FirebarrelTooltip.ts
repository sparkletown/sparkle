import { Graphics, Sprite, Text, TextStyle } from "pixi.js";

export class FirebarrelTooltip extends Sprite {
  constructor(message: string) {
    super();
    this.draw(message);
  }

  private draw(message: string): void {
    const backgroundColor = 0xffffff;
    const backgroundAlpha = 0.2;
    const style = new TextStyle({
      fill: "#ede8fe",
      dropShadow: true,
      dropShadowAlpha: 0.3,
      dropShadowAngle: 0.8,
      dropShadowBlur: 6,
      dropShadowDistance: 2,
      fontSize: 24,
      miterLimit: 1,
      stroke: "#9c9c9c",
    });

    const text: Text = new Text(message, style);
    text.position.set(-text.width / 2, -text.height / 2);

    this.addChild(text);

    const h = Math.max(text.height * 1.5, 10);
    const w = Math.max(text.width, text.width) + text.height * 2;
    const r = h * 0.7;

    const g: Graphics = new Graphics();
    g.beginFill(backgroundColor, backgroundAlpha);
    g.drawRoundedRect(0, 0, w, h, r);

    g.position.set(-w / 2, -h / 2);

    this.addChildAt(g, 0);
  }
}
