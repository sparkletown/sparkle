import { Engine, NodeList } from "@ash.ts/ash";
import { settings } from "pixi.js";

import { GameConfig } from "../../../GameConfig";
import EntityFactory from "../entities/EntityFactory";
import { ArtcarNode } from "../nodes/ArtcarNode";

import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionArtcarSystem extends MotionBaseSystem {
  private artcars?: NodeList<ArtcarNode>;

  constructor(private creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine) {
    this.artcars = engine.getNodeList(ArtcarNode);
  }

  removeFromEngine(engine: Engine) {
    this.artcars = undefined;
  }

  update(time: number) {
    const sec = time / settings.TARGET_FPMS / 1000;
    for (let node = this.artcars?.head; node; node = node.next) {
      node.elipse.rotation += GameConfig.ARTCAR_ANGULAR_VELOCITY * sec;

      const oldX = node.position.x;
      const oldY = node.position.y;

      node.position.x =
        node.elipse.x + Math.cos(node.elipse.rotation) * node.elipse.radiusX;
      node.position.y =
        node.elipse.y + Math.sin(node.elipse.rotation) * node.elipse.radiusY;
      node.position.rotation = Math.atan2(
        node.position.y - oldY,
        node.position.x - oldX
      );
    }
  }
}
