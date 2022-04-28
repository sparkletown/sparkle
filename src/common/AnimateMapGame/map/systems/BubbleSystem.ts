import { Engine, NodeList, System } from "@ash.ts/ash";
import {
  AnimateMapEventProvider,
  AnimateMapEventType,
} from "common/AnimateMapCommon";
import { Container, Graphics, Point, Sprite, Text, TextStyle } from "pixi.js";

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

    AnimateMapEventProvider.on(
      AnimateMapEventType.RECEIVE_SHOUT,
      this.recieveShoutHandler
    );
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
    AnimateMapEventProvider.off(
      AnimateMapEventType.RECEIVE_SHOUT,
      this.recieveShoutHandler
    );
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

    if (node.sprite.view) {
      const point: Point = node.sprite.view.toGlobal({ x: 0, y: 0 });

      // TODO HACK
      const bubbleHeight = 60;
      const k = 10 * this.viewport.head.viewport.zoomViewport;
      const delta = k + bubbleHeight / 2;

      node.bubble.view?.position.set(
        point.x - node.bubble.view.width / 2,
        point.y - delta
      );
    }
  }

  private drawBubbleElement(node: BubbleNode): Sprite {
    const textColor = 0xede8fe;
    const textSize = 20;
    const bubbleOffset = 20;
    const view = new Sprite();

    const txt = node.bubble.text;
    const style = new TextStyle({
      fill: textColor,
      fontSize: textSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 240,
    });

    const text: Text = new Text(txt, style);

    const h = text.height;
    const w = text.width;
    const r = textSize; //border radius
    const p = 6; //padding

    const g: Graphics = new Graphics();
    const container = new Container();
    this.drawNewDesign(g, 0, 0, w, h, p, r);
    g.position.set(bubbleOffset, -h);
    text.position.set(
      r / 2 + bubbleOffset + (w - text.width) / 2,
      p - text.height
    );
    container.addChild(g);
    g.cacheAsBitmap = true;
    text.cacheAsBitmap = true;
    view.addChild(container);
    container.alpha = 0.5;
    view.addChild(text);
    return view;
  }

  private drawNewDesign(
    target: Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    p: number,
    r: number = 16,
    lbCorner = 4
  ) {
    target.beginFill(0);
    target.drawRoundedRect(x, y, w + r, h + 2 * p, r);
    target.drawRoundedRect(x, y + h / 2 + p, r, h / 2 + p, lbCorner);
    target.endFill();
  }
}
