import { ListIteratingSystem } from "@ash.ts/ash";
import { Container, Sprite } from "pixi.js";

import { SpriteNode } from "../nodes/SpriteNode";

export class SpriteSystem extends ListIteratingSystem<SpriteNode> {
  private _container?: Container | null;

  constructor(container?: Container | null) {
    super(SpriteNode);

    this._container = container;
  }

  public updateNode(node: SpriteNode, time: number) {
    const view = node.sprite.view;
    const position = node.position;

    if (!view) {
      return;
    }

    view.setTransform(
      position.x,
      position.y,
      position.scaleX,
      position.scaleY,
      position.rotation
    );
  }

  public nodeAdded = (node: SpriteNode) => {
    let view = node.sprite.view;

    if (!view) {
      const imageUrl = node.sprite.imageUrl;

      if (imageUrl && imageUrl !== "") {
        view = Sprite.from(node.sprite.imageUrl);
      } else {
        view = new Sprite();
      }

      node.sprite.view = view;
    }

    view.anchor.set(0.5);

    if (!this._container?.children.includes(view)) {
      this._container?.addChild(view);
    }
  };

  public nodeRemoved = (node: SpriteNode) => {
    const view = node.sprite.view;
    console.log("REMOVED!!!!!!!!!");
    if (view && this._container?.children.includes(view)) {
      this._container?.removeChild(view);
    }
  };
}
