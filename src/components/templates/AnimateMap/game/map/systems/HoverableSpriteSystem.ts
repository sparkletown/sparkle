import { Engine, Entity, NodeList, System } from "@ash.ts/ash";
import { Container, InteractionEvent } from "pixi.js";
import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { HoverableSpriteNode } from "../nodes/HoverableSpriteNode";

export class HoverableSpriteSystem extends System {
  private hoverables: NodeList<HoverableSpriteNode> | null = null;
  private hovered: Entity | null = null;

  constructor(private container: Container) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.container.interactive = true;

    this.hoverables = engine.getNodeList(HoverableSpriteNode);
    this.hoverables.nodeAdded.add(this.handleHoverableAdded);
    this.hoverables.nodeRemoved.add(this.handleHoverableRemoved);

    this.container.on("mouseover", this.handleMouseOver, this);
    this.container.on("mouseout", this.handleMouseOut, this);
  }

  removeFromEngine(engine: Engine): void {
    this.container.off("mouseover", this.handleMouseOver, this);
    this.container.off("mouseout", this.handleMouseOut, this);

    if (this.hoverables) {
      this.hoverables.nodeAdded.remove(this.handleHoverableAdded);
      this.hoverables.nodeRemoved.remove(this.handleHoverableRemoved);
      this.hoverables = null;
    }
  }

  update(time: number): void {}

  private handleHoverableAdded = (node: HoverableSpriteNode): void => {
    node.sprite.view.interactive = true;
  };

  private handleHoverableRemoved = (node: HoverableSpriteNode): void => {
    if (this.hovered === node.entity) {
      this.hovered = null;
    }
  };

  private handleMouseOver = (event: InteractionEvent): void => {
    this.handleMouseOut();

    for (
      let node: HoverableSpriteNode | null | undefined = this.hoverables?.head;
      node;
      node = node.next
    ) {
      if (event.target === node.sprite.view) {
        this.hovered = node.entity;
        if (node.hover.on) {
          node.hover.on();
        }
        break;
      }
    }
  };

  private handleMouseOut = (event: InteractionEvent | null = null) => {
    if (this.hovered) {
      const comp: HoverableSpriteComponent | null = this.hovered.get(
        HoverableSpriteComponent
      );
      if (comp && comp.off) {
        comp.off();
      }
      this.hovered = null;
    }
  };
}
