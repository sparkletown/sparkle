import { Engine, NodeList, System } from "@ash.ts/ash";
import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";

import EventProvider, {
  EventType,
} from "components/templates/AnimateMap/bridges/EventProvider/EventProvider";

import EntityFactory from "../entities/EntityFactory";
import { BubbleNode } from "../nodes/BubbleNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class BubbleSystem extends System {
  private bubbles?: NodeList<BubbleNode>;
  private viewport?: NodeList<ViewportNode>;

  constructor(private container: Container, private creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine) {
    this.bubbles = engine.getNodeList(BubbleNode);
    this.bubbles.nodeAdded.add(this.handleBubbleAdded);
    this.bubbles.nodeRemoved.add(this.handleBubbleRemoved);

    this.viewport = engine.getNodeList(ViewportNode);

    EventProvider.on(EventType.RECEIVE_SHOUT, this.recieveShoutHandler);
  }

  removeFromEngine(engine: Engine) {
    if (this.bubbles) {
      for (
        let node: BubbleNode | null | undefined = this.bubbles?.head;
        node;
        node = node.next
      ) {
        this.handleBubbleRemoved(node);
      }

      this.bubbles.nodeAdded.remove(this.handleBubbleAdded);
      this.bubbles.nodeRemoved.remove(this.handleBubbleRemoved);
      this.bubbles = undefined;
    }

    this.viewport = undefined;
    EventProvider.off(EventType.RECEIVE_SHOUT, this.recieveShoutHandler);
  }

  update(time: number) {
    for (
      let node: BubbleNode | null | undefined = this.bubbles?.head;
      node;
      node = node.next
    ) {
      this.updateBubbleElementPosition(node);

      node.bubble.lifeTime -= time;
      if (node.bubble.lifeTime <= 0) {
        this.creator.removeBubble(node.entity);
      }
    }
  }
  private recieveShoutHandler = (userId: string, msg: string) => {
    this.creator.createBubble(userId, msg);
  };
  private handleBubbleAdded = (node: BubbleNode) => {
    let view = node.bubble.view;
    if (!view) {
      view = this.drawBubbleElement(node);
      node.bubble.view = view;
    }

    if (!this.container?.children.includes(view)) {
      this.container?.addChild(view);
    }

    this.updateBubbleElementPosition(node);
  };

  private handleBubbleRemoved = (node: BubbleNode) => {
    if (
      node.bubble.view &&
      this.container?.children.includes(node.bubble.view)
    ) {
      this.container?.removeChild(node.bubble.view);
    }
  };

  private updateBubbleElementPosition(node: BubbleNode) {
    if (!this.viewport?.head) return;

    const point = node.sprite.view?.toGlobal({ x: 0, y: 0 });
    if (!point) {
      return;
    }
    // TODO HACK
    const bubbleHeight = 60;
    const k = 10 * this.viewport.head.viewport.zoomViewport;
    const delta = k + bubbleHeight / 2;

    node.bubble.view?.position.set(
      point.x - node.bubble.view.width / 2,
      point.y - delta
    );
  }

  private drawBubbleElement(node: BubbleNode): Sprite {
    const textColor = 0xede8fe;
    const textSize = 14;

    const view = new Sprite();

    const txt = node.bubble.text;
    const style = new TextStyle({
      fill: textColor,
      fontSize: textSize,
      wordWrap: true,
      wordWrapWidth: 120,
    });

    const text: Text = new Text(txt, style);

    const h = Math.max(text.height * 2, 18);
    const w =
      text.width < 120 ? text.width + 2 * text.height : 120 + 2 * text.height;
    const r = 6;
    const borderThikness = 2;
    const borderColor = 0x9178f6;
    const backgroundColor = node.bubble.backgroudnColor;

    const pointerCenterOffset = -12;
    const pointerCenterWidth = 8;
    const pointerCenterHeight = 12;

    const g: Graphics = new Graphics();
    this.draw(
      g,
      0,
      0,
      w,
      h,
      r,
      backgroundColor,
      borderThikness,
      borderColor,
      pointerCenterWidth,
      pointerCenterHeight,
      pointerCenterOffset
    );
    g.position.set(-w / 2 - pointerCenterOffset, -h / 2);
    view.addChild(g);

    text.position.set(-text.width / 2 - pointerCenterOffset, -text.height / 2);
    view.addChild(text);

    return view;
  }

  /**
   * draws the text bubble
   * @param target
   * @param x      x position of  fill
   * @param y      y position of  fill
   * @param w      width of  fill
   * @param h      height of  fill
   * @param r      corner radius of fill :: number or object {br:#,bl:#,tl:#,tr:#}
   * @param c      hex color of fill :: number or array [0x######,0x######]
   * @param borderThickness
   * @param borderColor
   * @param pointerWidth
   * @param pointerHeight
   * @param centerOffset
   * @param clearPrevious
   */
  private draw(
    target: Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    c: number,
    borderThickness: number,
    borderColor: number,
    pointerWidth: number,
    pointerHeight: number,
    centerOffset: number
  ) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);

    if (w < 30) w = 30;
    h = Math.round(h);

    const rbr = typeof r === "object" && r["br"] ? r["br"] : r;
    const rbl = typeof r === "object" && r["bl"] ? r["bl"] : r;
    const rtl = typeof r === "object" && r["tl"] ? r["tl"] : r;
    const rtr = typeof r === "object" && r["tr"] ? r["tr"] : r;

    // the standart type of pointer's direction
    let pointerTypeDirection = 0;

    if (centerOffset < 2 * pointerWidth - w / 2) {
      centerOffset = 2 * pointerWidth - w / 2;
      pointerTypeDirection = 1;
    } else if (centerOffset > w / 2 - pointerWidth) {
      centerOffset = w / 2 - pointerWidth;
    }

    //bottom right corner
    r = rbr;
    let a: number = r - r * 0.707106781186547;
    //radius - anchor pt;
    let s: number = r - r * 0.414213562373095;
    //radius - control pt;
    target.beginFill(c);
    //set border
    if (borderThickness > 0) {
      target.lineStyle(borderThickness, borderColor);
    } else {
      target.lineStyle(undefined, borderColor);
    }
    target.moveTo(x + w, y + h - r);
    target.lineTo(x + w, y + h - r);

    if (r > 0) {
      target.quadraticCurveTo(x + w, y + h - s, x + w - a, y + h - a);
      target.quadraticCurveTo(x + w - s, y + h, x + w - r, y + h);
    }
    //bottom left corner
    r = rbl;
    a = r - r * 0.707106781186547;
    s = r - r * 0.414213562373095;
    // centerOffset
    // pointerWidth
    const halfW: number = Math.floor(w / 2);
    if (pointerTypeDirection === 0) {
      target.lineTo(x + halfW + centerOffset, y + h);
      target.lineTo(x + halfW + centerOffset, y + h + pointerHeight);
      target.lineTo(x + halfW + centerOffset - pointerWidth, y + h);
    } else {
      target.lineTo(x + halfW + centerOffset + pointerWidth, y + h);
      target.lineTo(x + halfW + centerOffset, y + h + pointerHeight);
      target.lineTo(x + halfW + centerOffset, y + h);
    }
    target.lineTo(x + r, y + h);

    if (r > 0) {
      target.quadraticCurveTo(x + s, y + h, x + a, y + h - a);
      target.quadraticCurveTo(x, y + h - s, x, y + h - r);
    }
    //top left corner
    r = rtl;
    a = r - r * 0.707106781186547;
    s = r - r * 0.414213562373095;
    target.lineTo(x, y + r);
    if (r > 0) {
      target.quadraticCurveTo(x, y + s, x + a, y + a);
      target.quadraticCurveTo(x + s, y, x + r, y);
    }
    //top right
    r = rtr;
    a = r - r * 0.707106781186547;
    s = r - r * 0.414213562373095;
    target.lineTo(x + w - r, y);
    if (r > 0) {
      target.quadraticCurveTo(x + w - s, y, x + w - a, y + a);
      target.quadraticCurveTo(x + w, y + s, x + w, y + r);
    }

    target.lineTo(x + w, y + h - r);

    if (c !== undefined) target.endFill();
  }
}
