import { Graphics, Sprite, Text, TextStyle } from "pixi.js";

export class VenueTooltipEnter extends Sprite {
  constructor(public text = "default tooltip", public backgroundColor: number) {
    super();

    this.draw();
  }

  private draw(): void {
    const style = new TextStyle({
      fill: "#ede8fe",
      fontSize: 14,
      fontWeight: "bold",
    });

    const text1: Text = new Text(this.text, style);

    style.fontWeight = "normal";
    const text2: Text = new Text("Click ENTER to join", style);

    style.fontWeight = "bold";
    const text3: Text = new Text("ENTER", style);

    text1.position.set(-text1.width / 2, -text1.height / 2);
    text2.position.set(
      -text2.width / 2,
      -text2.height / 2 + text1.position.y + 30
    );
    text3.position.set(text2.position.x + 37, text2.position.y);
    this.addChild(text1);
    this.addChild(text2);
    this.addChild(text3);

    const h = Math.max(text1.height * 3, 18);
    const w = Math.max(text1.width, text2.width) + 2 * text1.height;
    const r = h / 4;

    const g: Graphics = new Graphics();
    g.beginFill(this.backgroundColor, 1);
    g.drawRoundedRect(0, 0, w, h, r);

    g.position.set(-w / 2, -text1.height / 1.2);
    g.alpha = 0.7;
    this.addChildAt(g, 0);
  }
}
