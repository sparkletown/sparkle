import { Engine, NodeList, System } from "@ash.ts/ash";
import { Container, Graphics, Point, Sprite, Text, TextStyle } from "pixi.js";

import { TooltipNode } from "../nodes/TooltipNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class TooltipSystem extends System {
  private tooltips: NodeList<TooltipNode> | null = null;
  private viewport: NodeList<ViewportNode> | null = null;

  constructor(private container: Container) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.tooltips = engine.getNodeList(TooltipNode);
    this.tooltips.nodeAdded.add(this.handleTooltipAdded);
    this.tooltips.nodeRemoved.add(this.handleTooltipRemoved);

    this.viewport = engine.getNodeList(ViewportNode);
  }

  removeFromEngine(engine: Engine): void {
    if (this.tooltips) {
      for (
        let node: TooltipNode | null | undefined = this.tooltips?.head;
        node;
        node = node.next
      ) {
        this.handleTooltipRemoved(node);
      }

      this.tooltips.nodeAdded.remove(this.handleTooltipAdded);
      this.tooltips.nodeRemoved.remove(this.handleTooltipRemoved);
      this.tooltips = null;
    }

    this.viewport = null;
  }

  update(time: number): void {
    for (
      let node: TooltipNode | null | undefined = this.tooltips?.head;
      node;
      node = node.next
    ) {
      this.updateTooltipElementPosition(node);
    }
  }

  private handleTooltipAdded = (node: TooltipNode): void => {
    let view: Sprite | null = node.tooltip.view;
    if (!view) {
      view = this.drawTooltipElement(node);
      node.tooltip.view = view;
    }

    if (!this.container?.children.includes(view)) {
      this.container?.addChild(view);
    }

    this.updateTooltipElementPosition(node);
  };

  private handleTooltipRemoved = (node: TooltipNode): void => {
    if (
      node.tooltip.view &&
      this.container?.children.includes(node.tooltip.view)
    ) {
      this.container?.removeChild(node.tooltip.view);
    }
  };

  private updateTooltipElementPosition(node: TooltipNode): void {
    const point: Point = node.sprite.view.toGlobal({ x: 0, y: 0 });

    // TODO HACK
    const tooltipHeight = 40;
    const collisionRadius = node.tooltip.collisionRadius;
    const k = collisionRadius * this.viewport!.head!.viewport.zoomViewport!;
    const delta =
      (k + tooltipHeight / 2) * (node.tooltip.position === "bottom" ? 1 : -1);

    node.tooltip.view?.position.set(
      point.x - node.tooltip.view.width / 2,
      point.y + delta
    );
  }

  private drawTooltipElement(node: TooltipNode): Sprite {
    const textColor = 0xede8fe;
    const textSize = 14;
    const borderThikness = 3;
    const borderColor = 0x9178f6;
    const backgroundColor = 0x6943f5;

    const view = new Sprite();

    const txt = node.tooltip.text;
    const style = new TextStyle({
      fill: textColor,
      fontSize: textSize,
    });

    const text: Text = new Text(txt, style);

    const h = Math.max(text.height * 2, 18);
    const w = text.width + 2 * text.height;
    const r = h / 2;

    const g: Graphics = new Graphics();
    g.beginFill(borderColor, 1);
    g.drawRoundedRect(0, 0, w, h, r);
    g.beginFill(backgroundColor, 1);
    g.drawRoundedRect(
      borderThikness,
      borderThikness,
      w - 2 * borderThikness,
      h - 2 * borderThikness,
      r - borderThikness
    );
    g.position.set(-w / 2, -h / 2);
    view.addChild(g);

    text.position.set(-text.width / 2, -text.height / 2);
    view.addChild(text);

    return view;
  }
}
