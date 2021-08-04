import { Engine, NodeList, System } from "@ash.ts/ash";
import { GameConfig } from "components/templates/AnimateMap/configs/GameConfig";
import { DisplayObject, Sprite } from "pixi.js";
import { SpriteComponent } from "../components/SpriteComponent";
import { AvatarTuningNode } from "../nodes/AvatarTuningNode";
import { ViewportNode } from "../nodes/ViewportNode";
import { avatarCycles } from "../../constants/AssetConstants";
import { PlayerNode } from "../nodes/PlayerNode";
import EntityFactory from "../entities/EntityFactory";

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
    const view: Sprite = node.sprite.view;
    const avatar: Sprite = view.getChildByName(
      SpriteComponent.AVATAR
    ) as Sprite;
    if (!avatar) {
      return;
    }

    // CYCLE
    if (
      // node.tuning.user.data.cycle &&
      this.player &&
      this.player.head &&
      this.player.head.player.data.id === node.tuning.user.id &&
      this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_CYCLING &&
      !view.getChildByName(SpriteComponent.CYCLE)
    ) {
      const cycle: Sprite = Sprite.from(avatarCycles[0]);
      cycle.name = SpriteComponent.CYCLE;
      cycle.y = avatar.height / 2;
      cycle.anchor.set(0.5);
      // TODO HARDCODE
      cycle.scale.set(1.3);

      view.addChildAt(cycle, view.getChildIndex(avatar));
    } else if (
      (!node.tuning.user.data.cycle ||
        this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_CYCLING) &&
      view.getChildByName(SpriteComponent.CYCLE)
    ) {
      view.removeChild(view.getChildByName(SpriteComponent.CYCLE));
    }

    // HAT
    if (
      node.tuning.user.data.hat &&
      this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_FLYING &&
      !view.getChildByName(SpriteComponent.HAT)
    ) {
      const sprite: Sprite = Sprite.from(node.tuning.user.data.hat);
      sprite.name = SpriteComponent.HAT;
      sprite.y = -avatar.height / 2;
      sprite.anchor.set(0.5);
      view.addChild(sprite);
    } else if (
      (!node.tuning.user.data.cycle ||
        this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_FLYING) &&
      view.getChildByName(SpriteComponent.HAT)
    ) {
      view.removeChild(view.getChildByName(SpriteComponent.HAT));
    }

    // ACCESSORIES
    if (
      node.tuning.user.data.accessories &&
      this.zoomLevelCurrent !== GameConfig.ZOOM_LEVEL_FLYING &&
      !view.getChildByName(SpriteComponent.ACCESSORIES)
    ) {
      const sprite: Sprite = Sprite.from(node.tuning.user.data.accessories);
      sprite.name = SpriteComponent.ACCESSORIES;
      sprite.anchor.set(0.5);
      view.addChild(sprite);
    } else if (
      (!node.tuning.user.data.accessories ||
        this.zoomLevelCurrent === GameConfig.ZOOM_LEVEL_FLYING) &&
      view.getChildByName(SpriteComponent.ACCESSORIES)
    ) {
      view.removeChild(view.getChildByName(SpriteComponent.ACCESSORIES));
    }
  };

  private handleAvatarRemoved = (node: AvatarTuningNode): void => {
    const names: Array<string> = [
      SpriteComponent.CYCLE,
      SpriteComponent.HAT,
      SpriteComponent.ACCESSORIES,
    ];
    for (let i = 0; i < names.length; i++) {
      const sprite: DisplayObject | null = node.sprite.view.getChildByName(
        names[i]
      );
      if (sprite) {
        node.sprite.view.removeChild(sprite);
      }
    }
  };

  private handleViewportAdded = (node: ViewportNode): void => {
    if (this.zoomLevelCurrent !== node.viewport.zoomLevel) {
      this.zoomChanged = true;
      this.zoomLevelCurrent = node.viewport.zoomLevel;
    }
  };
}
