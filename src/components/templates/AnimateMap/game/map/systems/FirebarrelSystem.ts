import { Engine, NodeList, System } from "@ash.ts/ash";
import { InteractionManager } from "pixi.js";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapFireBarrel,
} from "store/actions/AnimateMap";
import { ReplicatedUser } from "store/reducers/AnimateMap";

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

    for (let node = this.barrels?.head; node; node = node.next) {
      this.barrelNodeAdded(node);
    }

    // setTimeout(() => {
    //   this.updateDebug();
    // }, 3000);
  }

  removeFromEngine(engine: Engine) {
    this._unsubscribeSetPointer();

    this.barrels?.nodeAdded.remove(this.barrelNodeAdded);
    this.barrels?.nodeRemoved.remove(this.barrelNodeRemoved);

    this.bots = undefined;
    this.player = undefined;
    this.barrels = undefined;
  }

  update(time: number) {}

  private updateDebug(): void {
    for (
      let nodeBarrel = this.barrels?.head;
      nodeBarrel;
      nodeBarrel = nodeBarrel.next
    ) {
      let count = 0;
      for (let nodeBot = this.bots?.head; nodeBot; nodeBot = nodeBot.next) {
        if (nodeBot.bot.fsm.currentStateName !== nodeBot.bot.IMMOBILIZED) {
          count++;
          nodeBot.bot.fsm.changeState(nodeBot.bot.IMMOBILIZED);
          nodeBarrel.barrel.data.connectedUsers.push(nodeBot.bot.data);
          if (count > 5) {
            return;
          }
        }
        nodeBarrel.entity.add(nodeBarrel.barrel);
      }
    }
  }

  private barrelNodeDraw(node: BarrelNode): void {
    console.log("barrelNodeDraw", node.barrel.data.connectedUsers.length);
    // to place bots around barrel
    if (node.barrel.data.connectedUsers.length === 0) {
      return;
    }

    const radius = 50;
    const angle = (2 * Math.PI) / node.barrel.data.connectedUsers.length;
    for (let i = 0; i < node.barrel.data.connectedUsers.length; i++) {
      const user = node.barrel.data.connectedUsers[i];
      const botNode = this.getBot(user);
      if (botNode) {
        botNode.position.x = Math.cos(angle) * radius;
        botNode.position.y = Math.sin(angle) * radius;
      } else if (this.player?.head?.player.data.data.id === user.data.id) {
        this.player.head.position.x = Math.cos(angle) * radius;
        this.player.head.position.y = Math.sin(angle) * radius;
      }
    }
  }

  private barrelNodeAdded = (node: BarrelNode): void => {
    node.barrel.data.connectedUsers.forEach((user) => {
      const botNode = this.getBot(user);
      if (botNode) {
        botNode.bot.fsm.changeState(botNode.bot.IMMOBILIZED);
      } else if (this.player?.head?.player.data.data.id === user.data.id) {
        this.player?.head.player.fsm.changeState(
          this.player?.head.player.IMMOBILIZED
        );
      }
    });

    this.barrelNodeDraw(node);
  };

  private barrelNodeRemoved = (node: BarrelNode): void => {
    node.barrel.data.connectedUsers.forEach((user) => {
      const botNode = this.getBot(user);
      if (botNode) {
        botNode.bot.fsm.changeState(botNode.bot.IDLE);
      } else if (this.player?.head?.player.data.data.id === user.data.id) {
        this.player?.head.player.fsm.changeState(
          this.player?.head.player.FLYING
        );
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
