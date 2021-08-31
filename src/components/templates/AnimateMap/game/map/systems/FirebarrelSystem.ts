import { Engine, NodeList, System } from "@ash.ts/ash";

import { GameConfig } from "../../../configs/GameConfig";
import EntityFactory from "../entities/EntityFactory";
import { FirebarrelCamIcon } from "../graphics/FirebarrelCamIcon";
import { FirebarrelNode } from "../nodes/FirebarrelNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class FirebarrelSystem extends System {
  private firebarrels?: NodeList<FirebarrelNode>;
  private viewport?: NodeList<ViewportNode>;
  private zoomLevelCurrent = -1;
  private zoomLevelUpdated = false;

  constructor(private creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine) {
    this.firebarrels = engine.getNodeList(FirebarrelNode);
    this.firebarrels?.nodeAdded.add(this.handleFirebarrelAdded);

    this.viewport = engine.getNodeList(ViewportNode);
    this.viewport.nodeAdded.add(this.handleViewportAdded);
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

  private updateFirebarrel(node: FirebarrelNode): void {
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
