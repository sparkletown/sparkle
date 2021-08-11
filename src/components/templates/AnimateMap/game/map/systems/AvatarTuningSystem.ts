import { Engine, NodeList, System } from "@ash.ts/ash";
import { Sprite } from "pixi.js";

import { GameConfig } from "components/templates/AnimateMap/configs/GameConfig";

import { avatarCycles } from "../../constants/AssetConstants";
import EntityFactory from "../entities/EntityFactory";
import { Avatar } from "../graphics/Avatar";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { PlayerNode } from "../nodes/PlayerNode";
import { ViewportNode } from "../nodes/ViewportNode";

export class AvatarTuningSystem extends System {
  private creator: EntityFactory;

  private viewport: NodeList<ViewportNode> | null = null;
  private avatars: NodeList<AvatarTuningNode> | null = null;
  private player: NodeList<PlayerNode> | null = null;
  private zoomLevelCurrent = 0;
  private zoomChanged = true;

  constructor(creator: EntityFactory) {
    super();
    this.creator = creator;
  }

  addToEngine(engine: Engine): void {
    this.player = engine.getNodeList(PlayerNode);
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

  removeFromEngine(engine: Engine): void {
    if (this.player) {
      this.player.nodeAdded.remove(this.handlePlayerAdded);
      this.player.nodeRemoved.remove(this.handlePlayerRemoved);
      this.player = null;
    }

    if (this.avatars) {
      this.avatars.nodeAdded.remove(this.handleAvatarAdded);
      this.avatars.nodeRemoved.remove(this.handleAvatarRemoved);
      this.avatars = null;
    }

    if (this.viewport) {
      this.viewport.nodeAdded.remove(this.handleViewportAdded);
      this.viewport = null;
    }
  }

  update(time: number): void {
    if (!this.zoomChanged) {
      return;
    }
    this.zoomChanged = false;

    for (
      let avatar: AvatarTuningNode | null | undefined = this.avatars?.head;
      avatar;
      avatar = avatar.next
    ) {
      this.handleAvatarAdded(avatar);
    }

    if (this.player && this.player.head) {
      this.handlePlayerAdded(this.player.head);
    }
  }

  private handlePlayerAdded = (node: PlayerNode): void => {
    if (this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_FLYING) {
      this.creator.removePlayerTuning(node);
    } else {
      this.creator.updatePlayerTuning(node);
    }
  };

  private handlePlayerRemoved = (node: PlayerNode): void => {
    this.creator.removePlayerTuning(node);
  };

  private handleAvatarAdded = (node: AvatarTuningNode): void => {
    const view: Avatar = node.sprite.view as Avatar;
    if (!view.avatar) {
      return;
    }

    // CYCLE
    if (
      this.player &&
      this.player.head &&
      this.player.head.player.data.id === node.tuning.user.id &&
      this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_CYCLING &&
      !view.cycle
    ) {
      view.cycle = Sprite.from(avatarCycles[0]);
      view.cycle.y = view.avatar.height / 2;
      view.cycle.anchor.set(0.5);
      // TODO HARDCODE
      view.cycle.scale.set(1.3);

      view.addChildAt(view.cycle, view.getChildIndex(view.avatar));
    } else if (
      (!node.tuning.user.data.cycle ||
        this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_CYCLING) &&
      view.cycle
    ) {
      view.removeChild(view.cycle);
      view.cycle = null;
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
      view.hat = null;
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
      view.accessories = null;
    }
  };

  private handleAvatarRemoved = (node: AvatarTuningNode): void => {
    const avatar: Avatar = node.sprite.view as Avatar;
    if (!avatar) {
      return;
    }
    if (avatar.cycle) {
      avatar.removeChild(avatar.cycle);
      avatar.cycle = null;
    }
    if (avatar.hat) {
      avatar.removeChild(avatar.hat);
      avatar.hat = null;
    }
    if (avatar.accessories) {
      avatar.removeChild(avatar.accessories);
      avatar.accessories = null;
    }
  };

  private handleViewportAdded = (node: ViewportNode): void => {
    if (this.zoomLevelCurrent !== node.viewport.zoomLevel) {
      this.zoomChanged = true;
      this.zoomLevelCurrent = node.viewport.zoomLevel;
    }
  };
}
