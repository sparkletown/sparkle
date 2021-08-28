import { Engine, NodeList, System } from "@ash.ts/ash";
import { subscribeActionAfter } from "redux-subscribe-action";

import { ReplicatedUser } from "store/reducers/AnimateMap";

import { AnimateMapActionTypes } from "../../../../../../store/actions/AnimateMap";
import EntityFactory from "../entities/EntityFactory";
import { BarrelNode } from "../nodes/BarrelNode";
import { BotNode } from "../nodes/BotNode";
import { PlayerNode } from "../nodes/PlayerNode";

export class FirebarrelSystem extends System {
  private bots?: NodeList<BotNode>;
  private player?: NodeList<PlayerNode>;
  private barrels?: NodeList<BarrelNode>;

  private _unsubscribeFirebarrelSet!: () => void;
  private _unsubscribeFirebarrelEnter!: () => void;
  private _unsubscribeFirebarrelExit!: () => void;

  private creator: EntityFactory;
  private waitingEnterFirebarrelId?: number;
  private WAITING_ENTER_FIREBARREL_TIMEOUT = 30000;

  // private _unsubscribeSetPointer!: () => void;
  constructor(creator: EntityFactory) {
    super();
    this.creator = creator;
  }

  addToEngine(engine: Engine) {
    this.bots = engine.getNodeList(BotNode);
    this.player = engine.getNodeList(PlayerNode);
    this.barrels = engine.getNodeList(BarrelNode);
    // this.barrels?.nodeAdded.add(this.barrelNodeAdded);
    // this.barrels?.nodeRemoved.add(this.barrelNodeRemoved);

    this._unsubscribeFirebarrelEnter = subscribeActionAfter(
      AnimateMapActionTypes.ENTER_FIREBARREL,
      () => {
        clearTimeout(this.waitingEnterFirebarrelId);
        // this.creator.enterFirebarrel(barrelId);
      }
    );
    this._unsubscribeFirebarrelSet = subscribeActionAfter(
      AnimateMapActionTypes.SET_FIREBARREL,
      () => {
        this.waitingEnterFirebarrelId = setTimeout(() => {
          if (this.player) {
            this.creator.exitFirebarrel();
            console.log("exit firebarrel 2");
          }
        }, this.WAITING_ENTER_FIREBARREL_TIMEOUT);
      }
    );
    this._unsubscribeFirebarrelExit = subscribeActionAfter(
      AnimateMapActionTypes.EXIT_FIREBARREL,
      () => {
        this.creator.exitFirebarrel();
        console.log("exit firebarrel 1");
      }
    );

    for (let node = this.barrels?.head; node; node = node.next) {
      this.barrelNodeAdded(node);
    }
  }

  removeFromEngine(engine: Engine) {
    this._unsubscribeFirebarrelSet();
    this._unsubscribeFirebarrelEnter();
    this._unsubscribeFirebarrelExit();

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
          nodeBarrel.barrel.model.data.connectedUsers.push(nodeBot.bot.data);
          if (count > 5) {
            return;
          }
        }
        nodeBarrel.entity.add(nodeBarrel.barrel);
      }
    }
  }

  private barrelNodeDraw(node: BarrelNode): void {
    // to place bots around barrel
    if (node.barrel.model.data.connectedUsers.length === 0) {
      return;
    }

    const radius = 50;
    const angle = (2 * Math.PI) / node.barrel.model.data.connectedUsers.length;
    for (let i = 0; i < node.barrel.model.data.connectedUsers.length; i++) {
      const user = node.barrel.model.data.connectedUsers[i];
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
    node.barrel.model.data.connectedUsers.forEach((user) => {
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
    node.barrel.model.data.connectedUsers.forEach((user) => {
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
