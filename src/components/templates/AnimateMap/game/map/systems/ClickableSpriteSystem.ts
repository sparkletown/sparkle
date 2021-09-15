import { Engine, NodeList, System } from "@ash.ts/ash";
import { Container, InteractionEvent } from "pixi.js";

import { ClickableSpriteNode } from "../nodes/ClickableSpriteNode";
import { PlayerMovementNode } from "../nodes/PlayerMovementNode";

export class ClickableSpriteSystem extends System {
  private clickables?: NodeList<ClickableSpriteNode>;
  private players?: NodeList<PlayerMovementNode>;

  constructor(private container: Container) {
    super();
  }

  addToEngine(engine: Engine) {
    this.container.interactive = true;

    this.clickables = engine.getNodeList(ClickableSpriteNode);
    this.clickables.nodeAdded.add(this.handleClickableAdded);

    this.players = engine.getNodeList(PlayerMovementNode);

    this.container.on("pointerdown", this.handlePointerDown, this);
  }

  removeFromEngine(engine: Engine) {
    this.container.off("pointerdown", this.handlePointerDown, this);
    this.players = undefined;

    if (this.clickables) {
      this.clickables.nodeAdded.remove(this.handleClickableAdded);
      this.clickables = undefined;
    }
  }

  update(time: number) {}

  private handleClickableAdded = (node: ClickableSpriteNode) => {
    if (node.sprite.view) {
      node.sprite.view.interactive = true;
    }
  };

  private handlePointerDown = (event: InteractionEvent) => {
    if (!this.players?.head) {
      return;
    }
    for (let node = this.clickables?.head; node; node = node.next) {
      if (event.target === node.sprite.view) {
        if (node.click.click) {
          node.click.click(event);
        }
        break;
      }
    }
  };
}
