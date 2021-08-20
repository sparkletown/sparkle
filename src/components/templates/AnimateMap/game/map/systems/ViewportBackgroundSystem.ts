import { Engine, NodeList, System } from "@ash.ts/ash";
import { Box, Point, QuadTree } from "js-quadtree";
import { BaseTexture, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import { GameConfig } from "components/templates/AnimateMap/configs/GameConfig";

import { MAP_IMAGE } from "../../constants/AssetConstants";
import { tiles } from "../../constants/AssetsMapTilesConstants";
import { GameInstance } from "../../GameInstance";
import { KeyFramer } from "../../utils/KeyFramer";
//shaders
import {
  LightSize,
  mapLightningShader,
  zoomedLightningShader,
} from "../graphics/mapLightningShader";
import { ArtcarNode } from "../nodes/ArtcarNode";
import { BarrelNode } from "../nodes/BarrelNode";

export class ViewportBackgroundSystem extends System {
  private barrels?: NodeList<BarrelNode>;
  private artCars?: NodeList<ArtcarNode>;

  private viewport: Viewport;
  public readonly background: Sprite;
  private readonly zoomed: Sprite;
  private sunKeyFramer: KeyFramer;
  private moonKeyFramer: KeyFramer;

  private time: number = 0;

  private initialized = false;
  private worldDivision = 0;
  private worldTileWidth = 0;
  private worldTileHeight = 0;

  private tileScaleX = 1;
  private tileScaleY = 1;

  private tree?: QuadTree;
  private currentVisibleTiles: Map<number, Sprite> = new Map();

  constructor(viewport: Viewport) {
    super();
    this.viewport = viewport;

    this.background = new Sprite();
    this.background.name = "backgroundSprite";
    this.zoomed = new Sprite();

    const backgroundLightning = [mapLightningShader];
    const zoomedLightning = [zoomedLightningShader];
    this.zoomed.filters = backgroundLightning;
    this.background.filters = zoomedLightning;
    const lightsCol = new Array();
    const koef = new Array();
    const lightSizer = new LightSize();
    for (let i = 0; i < 256; i++) {
      lightsCol[3 * i] = Math.random();
      lightsCol[3 * i + 1] = Math.random();
      lightsCol[3 * i + 2] = Math.random();
      const size = lightSizer.getFrame(200);
      koef[i * 2] = size[0]; // linear component
      koef[i * 2 + 1] = size[1]; // quadratic component
    }
    this.background.filters[0].uniforms.lightsCol = lightsCol;
    this.background.filters[0].uniforms.koef = koef;
    this.zoomed.filters[0].uniforms.lightsCol = lightsCol;
    this.background.filters[0].uniforms.koef = koef;

    const interpolateDayNightKeys = (
      left: Array<number>,
      right: Array<number>,
      time: number
    ) => {
      const r = (right[0] - left[0]) * time + left[0];
      const g = (right[1] - left[1]) * time + left[1];
      const b = (right[2] - left[2]) * time + left[2];
      return [r, g, b];
    };
    this.sunKeyFramer = new KeyFramer(interpolateDayNightKeys);
    this.sunKeyFramer.addKey([0, 0, 0], -1);
    this.sunKeyFramer.addKey([0, 0, 0], 25);
    this.sunKeyFramer.addKey([0, 0, 0], 4);
    this.sunKeyFramer.addKey([0.6, 0.5, 0.5], 6);
    this.sunKeyFramer.addKey([0.8, 0.8, 0.8], 12);
    this.sunKeyFramer.addKey([0.6, 0.5, 0.5], 20);
    this.sunKeyFramer.addKey([0, 0, 0], 22);
    this.moonKeyFramer = new KeyFramer(interpolateDayNightKeys);
    this.moonKeyFramer.addKey([0.15, 0.15, 0.2], -1);
    this.moonKeyFramer.addKey([0.15, 0.15, 0.2], 25);
    this.moonKeyFramer.addKey([0.15, 0.15, 0.2], 4);
    this.moonKeyFramer.addKey([0, 0, 0], 7);
    this.moonKeyFramer.addKey([0, 0, 0], 19);
    this.moonKeyFramer.addKey([0.1, 0.1, 0.12], 20);
  }

  addToEngine(engine: Engine) {
    this.barrels = engine.getNodeList(BarrelNode);
    this.artCars = engine.getNodeList(ArtcarNode);
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

      //shaders setup
      this.background.filters[0].uniforms.frame = [
        this.viewport.center.x,
        this.viewport.center.y,
        this.viewport.worldWidth,
        this.viewport.worldHeight,
      ];
    });
  }

  removeFromEngine(engine: Engine) {
    if (this.zoomed.children.length) {
      this.zoomed.removeChildren();
      this.currentVisibleTiles.clear();
    }
  }

  update(time: number) {
    if (this.initialized) {
      let lightQuantity = 0;
      const lightsPos = new Array<number>();
      //let lightsCol = new Array<number>();

      for (let i = this.barrels?.head; i; i = i?.next) {
        lightsPos[lightQuantity * 2] = i.position.x;
        lightsPos[lightQuantity * 2 + 1] = i.position.y;
        lightQuantity += 1;
      }
      for (let i = this.artCars?.head; i; i = i?.next) {
        lightsPos[lightQuantity * 2] = i.position.x;
        lightsPos[lightQuantity * 2 + 1] = i.position.y;
        lightQuantity += 1;
      }
      this.background.filters[0].uniforms.lightsPos = lightsPos;
      this.zoomed.filters[0].uniforms.lightsPos = lightsPos;
      this.background.filters[0].uniforms.lightQuantity = lightQuantity;
      this.zoomed.filters[0].uniforms.lightQuantity = lightQuantity;

      this.background.filters[0].uniforms.frame = [
        this.viewport.left,
        this.viewport.top,
        this.viewport.worldScreenWidth,
        this.viewport.worldScreenHeight,
      ];
      this.zoomed.filters[0].uniforms.frame = [
        this.viewport.left,
        this.viewport.top,
        this.viewport.worldScreenWidth,
        this.viewport.worldScreenHeight,
      ];

      this.time += 0.01;
      this.setDayTime(this.time);
    }

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

  /**
   * changing the background visible time
   * @param time in hourse [0;24)
   */
  setDayTime(time: number) {
    //const ambientLight = 0.1;
    //TODO changing

    time = time % 24;

    const sunLight = this.sunKeyFramer.getFrame(time);
    const moonLight = this.moonKeyFramer.getFrame(time);
    console.log(moonLight);
    const light = [0, 0, 0];
    for (let i = 0; i < 3; i++) light[i] = moonLight[i] + sunLight[i];
    this.background.filters[0].uniforms.ambientLight = light;
    this.zoomed.filters[0].uniforms.ambientLight = light;
  }

  colorMatrixFilter() {
    const apply = false;

    if (!apply) {
      return;
    }
    const bool = true;

    const colors: PIXI.filters.ColorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

    colors.saturate(-1, bool); // multiple?
    colors.hue(317, bool);
    colors.brightness(0.1, bool);
    colors.contrast(13, bool);
    colors.night(0.3, bool);

    this.background.filters = [colors];
    this.zoomed.filters = [colors];
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

  private setupTree() {
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
