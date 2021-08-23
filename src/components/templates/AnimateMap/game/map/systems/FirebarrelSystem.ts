import { Engine, NodeList, System } from "@ash.ts/ash";
import { InteractionManager } from "pixi.js";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapFireBarrel,
} from "store/actions/AnimateMap";

import { ReplicatedUser } from "../../../../../../store/reducers/AnimateMap";
import { GameInstance } from "../../GameInstance";
import { Barrel } from "../graphics/Barrel";
import { BarrelNode } from "../nodes/BarrelNode";
import { BotNode } from "../nodes/BotNode";
import { PlayerNode } from "../nodes/PlayerNode";

export class FirebarrelSystem extends System {
  private bots?: NodeList<BotNode>;
  private player?: NodeList<PlayerNode>;
  private barrels?: NodeList<BarrelNode>;

  private _unsubscribeSetPointer!: () => void;

  addToEngine(engine: Engine) {
    this.bots = engine.getNodeList(BotNode);
    this.player = engine.getNodeList(PlayerNode);
    this.barrels = engine.getNodeList(BarrelNode);
    this.barrels?.nodeAdded.add(this.barrelNodeAdded);
    this.barrels?.nodeRemoved.add(this.barrelNodeRemoved);

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

  removeFromEngine(engine: Engine) {
    this._unsubscribeSetPointer();

    this.barrels?.nodeAdded.remove(this.barrelNodeAdded);
    this.barrels?.nodeRemoved.remove(this.barrelNodeRemoved);

    this.bots = undefined;
    this.player = undefined;
    this.barrels = undefined;
  }

  update(time: number) {
    if (!this.player?.head || !this.barrels?.head) {
      return;
    }
  }

  private barrelNodeAdded = (node: BarrelNode): void => {
    node.barrel.data.connectedUsers.forEach((user) => {
      const botNode = this.getBot(user);
      if (botNode) {
        botNode.bot.fsm.changeState("immobilized");
      } else if (this.player?.head?.player.data.data.id === user.data.id) {
        this.player?.head.player.fsm.changeState("immobilized");
      }
    });
  };

  private barrelNodeRemoved = (node: BarrelNode): void => {
    node.barrel.data.connectedUsers.forEach((user) => {
      const botNode = this.getBot(user);
      if (botNode) {
        botNode.bot.fsm.changeState("idle");
      } else if (this.player?.head?.player.data.data.id === user.data.id) {
        this.player?.head.player.fsm.changeState("immobilized");
      }
    });
  };

  private getBot(user: ReplicatedUser): BotNode | undefined {
    for (let node = this.bots?.head; node; node = node.next) {
      if (node.bot.data.data.id === user.data.id) {
        return node;
      }
    }
    return undefined;
  }
}
