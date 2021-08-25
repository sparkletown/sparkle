import { Engine, NodeList, System } from "@ash.ts/ash";
import { Texture } from "pixi.js";

import { GameConfig } from "../../../configs/GameConfig";
import { PlayerNode } from "../nodes/PlayerNode";
import { ViewportNode } from "../nodes/ViewportNode";
import { ZoomedSpriteNode } from "../nodes/ZoomedSpriteNode";

export class ZoomedSpriteSystem extends System {
  private zoomUpdated = true;
  private currentZoomLevel = -1;
  private sprites?: NodeList<ZoomedSpriteNode>;
  private viewport?: NodeList<ViewportNode>;

  private player?: NodeList<PlayerNode>;

  public addToEngine(engine: Engine) {
    this.player = engine.getNodeList(PlayerNode);
    this.player.nodeAdded.add(this.handlePlayerAdded);

    this.sprites = engine.getNodeList(ZoomedSpriteNode);
    this.sprites.nodeAdded.add(this.handleSpriteAdded);

    this.viewport = engine.getNodeList(ViewportNode);
    this.viewport.nodeAdded.add(this.handleViewportAdded);
  }

  public removeFromEngine() {
    if (this.player) {
      this.player.nodeAdded.remove(this.handlePlayerAdded);
      this.player = undefined;
    }

    this.sprites?.nodeAdded.remove(this.handleSpriteAdded);
    this.sprites = undefined;

    this.viewport?.nodeAdded.remove(this.handleViewportAdded);
    this.viewport = undefined;
  }

  public update(time: number) {
    if (
      this.zoomUpdated &&
      this.viewport?.head &&
      this.currentZoomLevel !== this.viewport.head.viewport.zoomLevel
    ) {
      this.zoomUpdated = false;
      this.currentZoomLevel = this.viewport.head.viewport.zoomLevel;

      this.updatePlayer();

      for (let node = this.sprites?.head; node; node = node.next) {
        this.updateNode(node, this.currentZoomLevel);
      }
    }
  }

  private handlePlayerAdded = (node: PlayerNode) => {
    this.updatePlayer(node);
  };

  private updatePlayer(
    node: PlayerNode | null | undefined = this.player?.head
  ) {
    if (!node) {
      node = this.player?.head;
    }

    if (!node) {
      return;
    }

    if (this.currentZoomLevel === GameConfig.ZOOM_LEVEL_WALKING) {
      node.player.fsm.changeState(node.player.WALKING);
    } else if (this.currentZoomLevel === GameConfig.ZOOM_LEVEL_CYCLING) {
      node.player.fsm.changeState(node.player.CYCLING);
    } else {
      node.player.fsm.changeState(node.player.FLYING);
    }
  }

  private updateNode(node: ZoomedSpriteNode, zoom: number) {
    const view = node.sprite.view;
    const imageUrls = node.zoomedSprite.imageUrls;

    let image;

    if (Array.isArray(imageUrls)) {
      image = imageUrls[Math.min(zoom, imageUrls.length - 1)];
    } else {
      image = imageUrls;
    }

    if (image && view) {
      view.texture = Texture.from(image);
    }
  }

  public handleSpriteAdded = (node: ZoomedSpriteNode) => {
    this.updateNode(node, this.currentZoomLevel);
  };

  private handleViewportAdded = (node: ViewportNode) => {
    if (node.viewport.zoomLevel !== this.currentZoomLevel) {
      this.zoomUpdated = true;
    }
  };
}
