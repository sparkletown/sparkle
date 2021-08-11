import { Engine, NodeList, System } from "@ash.ts/ash";
import { Container, InteractionEvent } from "pixi.js";

import { ClickableSpriteNode } from "../nodes/ClickableSpriteNode";

export class ClickableSpriteSystem extends System {
  private clickables: NodeList<ClickableSpriteNode> | null = null;

  constructor(private container: Container) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.container.interactive = true;

    this.clickables = engine.getNodeList(ClickableSpriteNode);
    this.clickables.nodeAdded.add(this.handleClickableAdded);

    this.container.on("pointerdown", this.handlePointerDown, this);
  }

  removeFromEngine(engine: Engine): void {
    this.container.off("pointerdown", this.handlePointerDown, this);

    if (this.clickables) {
      this.clickables.nodeAdded.remove(this.handleClickableAdded);
      this.clickables = null;
    }
  }

  update(time: number): void {}

  private handleClickableAdded = (node: ClickableSpriteNode): void => {
    node.sprite.view.interactive = true;
  };

  private handlePointerDown = (event: InteractionEvent): void => {
    for (
      let node: ClickableSpriteNode | null | undefined = this.clickables?.head;
      node;
      node = node.next
    ) {
      if (event.target === node.sprite.view) {
        if (node.click.click) {
          node.click.click();
        }
        break;
      }
    }
  };
}
