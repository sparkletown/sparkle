import { Graphics, Sprite, Text, TextStyle } from "pixi.js";

export class FirebarrelTooltip extends Sprite {
  constructor(message: string) {
    super();
    this.draw(message);
  }

  private draw(message: string): void {
    const backgroundColor = 0xffffff;
    const style = new TextStyle({
      fill: "#ede8fe",
      fontSize: 28,
      fontWeight: "bold",
    });

    const text: Text = new Text(message, style);
    text.position.set(-text.width / 2, -text.height / 2);

    this.addChild(text);

    const h = Math.max(text.height * 1.2, 18);
    const w = Math.max(text.width, text.width) + text.height;
    const r = h / 2;

    const g: Graphics = new Graphics();
    g.beginFill(backgroundColor, 0.3);
    g.drawRoundedRect(0, 0, w, h, r);

    g.position.set(-w / 2, -h / 2);
    g.alpha = 0.5;
    this.addChildAt(g, 0);
  }
}
