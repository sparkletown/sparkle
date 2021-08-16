import { Engine, NodeList, System } from "@ash.ts/ash";
import { InteractionManager } from "pixi.js";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapFireBarrel,
} from "../../../../../../store/actions/AnimateMap";
import { GameInstance } from "../../GameInstance";
import { Barrel } from "../graphics/Barrel";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { BarrelNode } from "../nodes/BarrelNode";
import { PlayerNode } from "../nodes/PlayerNode";

export class FirebarrelSystem extends System {
  private bots: NodeList<AvatarTuningNode> | null = null;
  private player: NodeList<PlayerNode> | null = null;
  private barrels: NodeList<BarrelNode> | null = null;

  private _unsubscribeSetPointer!: () => void;

  addToEngine(engine: Engine): void {
    this.bots = engine.getNodeList(AvatarTuningNode);
    this.player = engine.getNodeList(PlayerNode);
    this.barrels = engine.getNodeList(BarrelNode);

    this._unsubscribeSetPointer = subscribeActionAfter(
      AnimateMapActionTypes.SET_POINTER,
      () => {
        const renderer = GameInstance.instance.getRenderer();
        const map = GameInstance.instance.getMapContainer();

        if (renderer && map) {
          const interaction = renderer.plugins
            .interaction as InteractionManager;
          const pointer = interaction.mouse.global;
          const hitTest = interaction.hitTest(pointer, map);

          const target = Array.isArray(hitTest) ? hitTest[0] : hitTest;

          if (target instanceof Barrel) {
            GameInstance.instance
              .getStore()
              .dispatch(setAnimateMapFireBarrel(target.name));
          }
        }
      }
    );
  }

  removeFromEngine(engine: Engine): void {
    this._unsubscribeSetPointer();

    this.bots = null;
    this.player = null;
    this.barrels = null;
  }

  update(time: number): void {
    if (!this.player?.head || !this.barrels?.head) {
      return;
    }
  }
}
