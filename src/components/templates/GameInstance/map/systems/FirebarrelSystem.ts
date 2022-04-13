import { Engine, NodeList, System } from "@ash.ts/ash";
import { subscribeActionAfter } from "redux-subscribe-action";

import { AnimateMapActionTypes } from "store/actions/AnimateMap";

import { GameConfig } from "../../../GameConfig/GameConfig";
import EntityFactory from "../entities/EntityFactory";
import { FirebarrelCamIcon } from "../graphics/FirebarrelCamIcon";
import { FirebarrelNode } from "../nodes/FirebarrelNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class FirebarrelSystem extends System {
  private player?: NodeList<PlayerNode>;
  private firebarrels?: NodeList<FirebarrelNode>;
  private viewport?: NodeList<ViewportNode>;
  private zoomLevelCurrent = -1;
  private zoomLevelUpdated = false;

  private _unsubscribeFirebarrelSet!: () => void;
  private _unsubscribeFirebarrelEnter!: () => void;
  private _unsubscribeFirebarrelExit!: () => void;

  private creator: EntityFactory;
  private waitingEnterFirebarrelId?: number;
  private WAITING_ENTER_FIREBARREL_TIMEOUT = 15000;
  private SHOUTER_ON = false;

  constructor(creator: EntityFactory) {
    super();
    this.creator = creator;
  }

  addToEngine(engine: Engine) {
    this.firebarrels = engine.getNodeList(FirebarrelNode);
    this.firebarrels?.nodeAdded.add(this.handleFirebarrelAdded);

    this.viewport = engine.getNodeList(ViewportNode);
    this.viewport.nodeAdded.add(this.handleViewportAdded);

    this._unsubscribeFirebarrelEnter = subscribeActionAfter(
      AnimateMapActionTypes.ENTER_FIREBARREL,
      () => {
        if (this.waitingEnterFirebarrelId) {
          clearTimeout(this.waitingEnterFirebarrelId);
        }
        // this.creator.enterFirebarrel(barrelId);
      }
    );
    this._unsubscribeFirebarrelSet = subscribeActionAfter(
      AnimateMapActionTypes.SET_FIREBARREL,
      () => {
        this.waitingEnterFirebarrelId = window.setTimeout(() => {
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
  }

  removeFromEngine(engine: Engine) {
    this.firebarrels?.nodeAdded.remove(this.handleFirebarrelAdded);
    this.firebarrels = undefined;

    this.viewport?.nodeAdded.remove(this.handleViewportAdded);
    this.viewport = undefined;
  }

  update(time: number) {
    if (this.zoomLevelUpdated) {
      this.zoomLevelUpdated = false;
      for (let node = this.firebarrels?.head; node; node = node.next) {
        this.updateFirebarrel(node);
      }
    }

    if (this.SHOUTER_ON) {
      for (let node = this.firebarrels?.head; node; node = node.next) {
        node.shouter.currentTime += time;
        if (node.shouter.currentTime >= node.shouter.timeOut) {
          node.shouter.currentTime = 0;
          this.creator.createShout(
            node.position.x,
            node.position.y - node.collision.radius,
            "Join Firebarrel Video chat!"
          );
        }
      }
    }
  }

  private updateFirebarrel(node: FirebarrelNode): void {
    node.firebarrel.fsm.changeState(node.firebarrel.HALO_ANIMATED);
    const usersCount = node.firebarrel.model.data.connectedUsers
      ? node.firebarrel.model.data.connectedUsers.length
      : 0;
    if (usersCount) {
      node.firebarrel.fsm.changeState(node.firebarrel.HALO_ANIMATED);
    } else {
      node.firebarrel.fsm.changeState(node.firebarrel.HALO);
    }

    const camIcon = node.entity.get(FirebarrelCamIcon);
    if (camIcon && camIcon.view.camIcon) {
      camIcon.view.camIcon.visible =
        this.viewport?.head?.viewport.zoomLevel !==
        GameConfig.ZOOM_LEVEL_FLYING;
    }
  }

  private handleViewportAdded = (node: ViewportNode): void => {
    if (this.zoomLevelCurrent !== node.viewport.zoomLevel) {
      this.zoomLevelCurrent = node.viewport.zoomLevel;
      this.zoomLevelUpdated = true;
    }
  };

  private handleFirebarrelAdded = (node: FirebarrelNode): void => {
    this.updateFirebarrel(node);
  };
}
