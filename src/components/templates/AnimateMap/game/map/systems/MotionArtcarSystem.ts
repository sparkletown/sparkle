import { Engine, NodeList } from "@ash.ts/ash";
import { settings } from "pixi.js";

import EntityFactory from "../entities/EntityFactory";
import { ArtcarNode } from "../nodes/ArtcarNode";

import { MotionBaseSystem } from "./MotionBaseSystem";

const DEFAULT_ARTCAR_ANGULAR_VELOCITY = 0.05 / 1000;

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
    const ms = time / settings.TARGET_FPMS;

    for (let node = this.artcars?.head; node; node = node.next) {
      node.elipse.rotation += DEFAULT_ARTCAR_ANGULAR_VELOCITY * ms;

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
