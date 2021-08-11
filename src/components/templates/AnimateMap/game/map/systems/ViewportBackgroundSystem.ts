import { Engine, System } from "@ash.ts/ash";
import { Box, Point, QuadTree } from "js-quadtree";
import { BaseTexture, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { GameConfig } from "components/templates/AnimateMap/configs/GameConfig";

import { MAP_IMAGE } from "../../constants/AssetConstants";
import { tiles } from "../../constants/AssetsMapTilesConstants";
import { GameInstance } from "../../GameInstance";

export class ViewportBackgroundSystem extends System {
  private viewport: Viewport;
  private background: Sprite;
  private zoomed: Sprite;

  private initialized = false;
  private worldDivision = 0;
  private worldTileWidth = 0;
  private worldTileHeight = 0;

  private tileScaleX = 1;
  private tileScaleY = 1;

  private tree: QuadTree | null = null;
  private currentVisibleTiles: Map<number, Sprite> = new Map();

  constructor(viewport: Viewport) {
    super();
    this.viewport = viewport;
    this.background = new Sprite();
    this.zoomed = new Sprite();
  }

  addToEngine(engine: Engine): void {
    this.setup().then(() => {
      this.setupTree();

      const back: Sprite = Sprite.from(MAP_IMAGE);
      back.anchor.set(0.5);
      const scale = GameInstance.instance.getConfig().worldWidth / back.width;
      back.scale.set(scale);
      back.anchor.set(0);

      this.background.addChild(back);
      this.background.interactive = true;

      this.viewport.addChildAt(this.zoomed, 0);
      this.viewport.addChildAt(this.background, 0);

      this.initialized = true;
    });
  }

  removeFromEngine(engine: Engine): void {
    if (this.zoomed.children.length) {
      this.zoomed.removeChildren();
      this.currentVisibleTiles.clear();
    }
  }

  update(time: number): void {
    if (!this.initialized || !this.tree) {
      return;
    }

    const zoomLevel = GameInstance.instance
      .getConfig()
      .zoomViewportToLevel(this.viewport.scale.y);

    if (zoomLevel === GameConfig.ZOOM_LEVEL_FLYING) {
      // remove zoomed
      if (this.zoomed.children.length) {
        this.zoomed.removeChildren();
        this.currentVisibleTiles.clear();
      }
      return;
    }

    const deltaX = this.worldTileWidth;
    const deltaY = this.worldTileHeight;
    const box: Box = new Box(
      this.viewport.left - deltaX,
      this.viewport.top - deltaY,
      this.viewport.right - this.viewport.left + 2 * deltaX,
      this.viewport.bottom - this.viewport.top + 2 * deltaY
    );

    const result: Array<Point> = this.tree.query(box);
    if (result.length === 0) {
      // find tile by point
      const x = Math.floor(this.viewport.center.x / this.worldTileWidth);
      const y = Math.floor(this.viewport.center.y / this.worldTileHeight);
      const tileIndex = x + y * this.worldDivision;

      const points: Array<Point> = this.tree.getAllPoints();
      for (let i = 0; i < points.length; i++) {
        if (points[i].data === tileIndex) {
          result.push(points[i]);
        }
      }
    }

    const str = [];
    for (let i = 0; i < result.length; i++) {
      str.push(result[i].data);
    }

    for (let i = 0; i < result.length; i++) {
      if (!this.currentVisibleTiles.get(result[i].data)) {
        // add tile
        this.currentVisibleTiles.set(result[i].data, this.addTile(result[i]));
      }
    }

    const itr: IterableIterator<number> = this.currentVisibleTiles.keys();
    for (
      let key: number = itr.next().value;
      key !== undefined;
      key = itr.next().value
    ) {
      let br = false;
      for (let i = 0; i < result.length; i++) {
        if (key === result[i].data) {
          br = true;
          break;
        }
      }
      if (!br) {
        const sprite: Sprite | undefined = this.currentVisibleTiles.get(key);
        if (sprite && this.zoomed.children.includes(sprite)) {
          this.zoomed.removeChild(sprite);
          this.currentVisibleTiles.delete(key);
          break;
        }
      }
    }
  }

  private addTile(point: Point): Sprite {
    const sprite: Sprite = Sprite.from(tiles[point.data]);
    sprite.scale.set(this.tileScaleX, this.tileScaleY);
    sprite.anchor.set(0.5);
    sprite.x = point.x;
    sprite.y = point.y;
    this.zoomed.addChild(sprite);

    return sprite;
  }

  private setup(): Promise<void> {
    const baseTexture: BaseTexture = new BaseTexture(tiles[0]);
    return new Promise((resolve) => {
      if (baseTexture.width) {
        resolve(baseTexture);
      } else {
        baseTexture.on("loaded", () => {
          resolve(baseTexture);
        });
      }
    }).then(() => {
      this.worldDivision = Math.sqrt(tiles.length);

      this.worldTileWidth =
        GameInstance.instance.getConfig().worldWidth / this.worldDivision;
      this.worldTileHeight =
        GameInstance.instance.getConfig().worldHeight / this.worldDivision;

      this.tileScaleX = this.worldTileWidth / baseTexture.width;
      this.tileScaleY = this.worldTileHeight / baseTexture.height;
    });
  }

  private setupTree(): void {
    const config: GameConfig = GameInstance.instance.getConfig();
    this.tree = new QuadTree(
      new Box(0, 0, config.worldWidth, config.worldWidth)
    );
    for (let i = 0; i < tiles.length; i++) {
      const x = i % this.worldDivision;
      const y = (i - x) / this.worldDivision;
      const point: Point = new Point(
        x * this.worldTileWidth + this.worldTileWidth / 2,
        y * this.worldTileHeight + this.worldTileHeight / 2,
        i
      );
      this.tree.insert(point);
    }
  }
}
