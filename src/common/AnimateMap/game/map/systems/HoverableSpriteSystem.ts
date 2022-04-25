import { Engine, Entity, NodeList, System } from "@ash.ts/ash";
import { Container, InteractionEvent } from "pixi.js";

import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { HoverableSpriteNode } from "../nodes/HoverableSpriteNode";

export class HoverableSpriteSystem extends System {
  private hoverables?: NodeList<HoverableSpriteNode>;
  private hovered?: Entity;

  constructor(private container: Container) {
    super();
  }

  addToEngine(engine: Engine) {
    this.container.interactive = true;

    this.hoverables = engine.getNodeList(HoverableSpriteNode);
    this.hoverables.nodeAdded.add(this.handleHoverableAdded);
    this.hoverables.nodeRemoved.add(this.handleHoverableRemoved);

    this.container.on("mouseover", this.handleMouseOver, this);
    this.container.on("mouseout", this.handleMouseOut, this);
  }

  removeFromEngine(engine: Engine) {
    this.container.off("mouseover", this.handleMouseOver, this);
    this.container.off("mouseout", this.handleMouseOut, this);

    if (this.hoverables) {
      this.hoverables.nodeAdded.remove(this.handleHoverableAdded);
      this.hoverables.nodeRemoved.remove(this.handleHoverableRemoved);
      this.hoverables = undefined;
    }
  }

  update(time: number) {}

  private handleHoverableAdded = (node: HoverableSpriteNode) => {
    if (node.sprite.view) {
      node.sprite.view.interactive = true;
    }
  };

  private handleHoverableRemoved = (node: HoverableSpriteNode) => {
    if (this.hovered === node.entity) {
      this.hovered = undefined;
    }
  };

  private handleMouseOver = (event: InteractionEvent) => {
    this.handleMouseOut(event);

    for (let node = this.hoverables?.head; node; node = node.next) {
      if (event.target === node.sprite.view) {
        this.hovered = node.entity;
        if (node.hover.on) {
          node.hover.on();
        }
        break;
      }
    }
  };

  private handleMouseOut = (event: InteractionEvent) => {
    if (this.hovered) {
      const comp = this.hovered.get(HoverableSpriteComponent);
      if (comp && comp.off) {
        comp.off();
      }
      this.hovered = undefined;
    }
  };
}
