import { Engine, NodeList, System } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { GameConfig } from "../../../GameConfig";
import { avatarCycles, avatarFeets } from "../../consts";
import EntityFactory from "../entities/EntityFactory";
import { Avatar } from "../graphics/Avatar";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { PlayerMovementNode } from "../nodes/PlayerMovementNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class AvatarTuningSystem extends System {
  private creator: EntityFactory;

  private viewport?: NodeList<ViewportNode>;
  private avatars?: NodeList<AvatarTuningNode>;
  private player?: NodeList<PlayerMovementNode>;
  private zoomLevelCurrent = 0;
  private zoomChanged = true;

  constructor(creator: EntityFactory) {
    super();
    this.creator = creator;
  }

  addToEngine(engine: Engine) {
    this.player = engine.getNodeList(PlayerMovementNode);
    this.player.nodeAdded.add(this.handlePlayerAdded);
    this.player.nodeRemoved.add(this.handlePlayerRemoved);

    this.avatars = engine.getNodeList(AvatarTuningNode);
    this.avatars.nodeAdded.add(this.handleAvatarAdded);
    this.avatars.nodeRemoved.add(this.handleAvatarRemoved);

    this.viewport = engine.getNodeList(ViewportNode);
    this.viewport.nodeAdded.add(this.handleViewportAdded);

    if (this.viewport.head) {
      this.zoomLevelCurrent = this.viewport.head.viewport.zoomLevel;
      this.zoomChanged = true;
    }
  }

  removeFromEngine(engine: Engine) {
    if (this.player) {
      this.player.nodeAdded.remove(this.handlePlayerAdded);
      this.player.nodeRemoved.remove(this.handlePlayerRemoved);
      this.player = undefined;
    }

    if (this.avatars) {
      this.avatars.nodeAdded.remove(this.handleAvatarAdded);
      this.avatars.nodeRemoved.remove(this.handleAvatarRemoved);
      this.avatars = undefined;
    }

    if (this.viewport) {
      this.viewport.nodeAdded.remove(this.handleViewportAdded);
      this.viewport = undefined;
    }
  }

  update(time: number) {
    this.updatePlayerDirections();

    if (!this.zoomChanged) {
      return;
    }
    this.zoomChanged = false;

    for (let avatar = this.avatars?.head; avatar; avatar = avatar.next) {
      this.handleAvatarAdded(avatar);
    }

    if (this.player && this.player.head) {
      this.handlePlayerAdded(this.player.head);
    }
  }

  private handlePlayerAdded = (node: PlayerMovementNode) => {
    this.creator.updatePlayerTuning(node);
  };

  private handlePlayerRemoved = (node: PlayerMovementNode) => {
    this.creator.removePlayerTuning(node);
  };

  private updatePlayerDirections = () => {
    if (
      this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_FLYING &&
      this.player &&
      this.player.head &&
      this.player.head.movement.velocityX !== 0
    ) {
      const sprite = (this.player.head.sprite.view as Avatar).cycle;
      if (sprite) {
        const scaleY = Math.abs(sprite.scale.y);
        const scaleX =
          scaleY * (this.player.head.movement.velocityX > 0 ? 1 : -1);
        // console.log(sprite.scale.x, sprite.scale.y, scaleX, this.player.head.movement.velocityX)
        sprite.scale.set(scaleX, scaleY);
      }
    }
  };

  private handleAvatarAdded = (node: AvatarTuningNode) => {
    const view: Avatar = node.sprite.view as Avatar;
    if (!view.avatar) {
      return;
    }

    if (
      this.player &&
      this.player.head &&
      this.player.head.player.data.data.id === node.tuning.user.data.id
    ) {
      if (view.cycle && view.cycle.parent) {
        view.cycle.parent.removeChild(view.cycle);
      }
      if (this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_WALKING) {
        view.cycle = Sprite.from(avatarFeets[0]);
        view.cycle.y = view.avatar.height * 0.55;
        view.cycle.anchor.set(0.5);
        // TODO HARDCODE
        view.cycle.scale.set(1);

        view.addChildAt(view.cycle, view.getChildIndex(view.avatar));
      } else if (this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_CYCLING) {
        view.cycle = Sprite.from(avatarCycles[0]);
        view.cycle.y = view.avatar.height * 0.46;
        view.cycle.anchor.set(0.5);
        // TODO HARDCODE
        view.cycle.scale.set(1.1);

        view.addChildAt(view.cycle, view.getChildIndex(view.avatar));
      }
    }

    // HAT
    if (
      node.tuning.user.data.hat &&
      this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_FLYING &&
      !view.hat
    ) {
      view.hat = Sprite.from(node.tuning.user.data.hat);
      view.hat.y = -view.avatar.height / 2;
      view.hat.anchor.set(0.5);
      view.addChild(view.hat);
    } else if (
      (!node.tuning.user.data.cycle ||
        this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_FLYING) &&
      view.hat
    ) {
      view.removeChild(view.hat);
      view.hat = undefined;
    }

    // ACCESSORIES
    if (
      node.tuning.user.data.accessories &&
      this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_FLYING &&
      !view.accessories
    ) {
      view.accessories = Sprite.from(node.tuning.user.data.accessories);
      view.accessories.anchor.set(0.5);
      view.addChild(view.accessories);
    } else if (
      (!node.tuning.user.data.accessories ||
        this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_FLYING) &&
      view.accessories
    ) {
      view.removeChild(view.accessories);
      view.accessories = undefined;
    }
  };

  private handleAvatarRemoved = (node: AvatarTuningNode) => {
    const avatar: Avatar = node.sprite.view as Avatar;
    if (!avatar) {
      return;
    }
    if (avatar.cycle) {
      avatar.removeChild(avatar.cycle);
      avatar.cycle = undefined;
    }
    if (avatar.hat) {
      avatar.removeChild(avatar.hat);
      avatar.hat = undefined;
    }
    if (avatar.accessories) {
      avatar.removeChild(avatar.accessories);
      avatar.accessories = undefined;
    }
  };

  private handleViewportAdded = (node: ViewportNode) => {
    if (this.zoomLevelCurrent !== node.viewport.zoomLevel) {
      this.zoomChanged = true;
      this.zoomLevelCurrent = node.viewport.zoomLevel;
    }
  };
}
