import { Engine, NodeList, System } from "@ash.ts/ash";
import { Box, Point, QuadTree } from "js-quadtree";
import { Application, BaseTexture, Container, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { MAP_IMAGE } from "../../constants/AssetConstants";
import { tiles } from "../../constants/AssetsMapTilesConstants";
import { GameInstance } from "../../GameInstance";
import { KeyFramer } from "../../utils/KeyFramer";
import {
  mapLightningShader,
  moonKeyFramer,
  staticLightKeyFramer,
  sunKeyFramer,
} from "../graphics/shaders/mapLightning";
import {
  ShaderDataProvider,
  staticLightData,
} from "../graphics/shaders/StaticShaderData";
import { ArtcarNode } from "../nodes/ArtcarNode";
import { FirebarrelNode } from "../nodes/FirebarrelNode";

export class ViewportBackgroundSystem extends System {
  private barrels?: NodeList<FirebarrelNode>;
  private artcars?: NodeList<ArtcarNode>;

  private viewport: Viewport;
  private staticLightManager: ShaderDataProvider;
  private readonly container: PIXI.Container;
  private readonly mapLOD_1: Sprite;
  private readonly mapLOD_0: Sprite;
  private sunKeyFramer: KeyFramer = sunKeyFramer;
  private moonKeyFramer: KeyFramer = moonKeyFramer;
  private lightsPos = new Float32Array(260);
  private lightsCol = new Int32Array(130);
  private initialized = false;
  private worldDivision = 0;
  private worldTileWidth = 0;
  private worldTileHeight = 0;

  private tileScaleX = 1;
  private tileScaleY = 1;

  private tree?: QuadTree;
  private currentVisibleTiles: Map<number, Sprite> = new Map();
  /**
   *
   * @param viewport the app viewport
   * @param timeAccelerator set to 1 in prod
   */
  constructor(
    viewport: Viewport,
    private app: Application,
    private timeAccelerator: number = 1
  ) {
    super();
    this.viewport = viewport;
    this.container = new Container();
    this.mapLOD_1 = new Sprite();
    this.mapLOD_1.name = "backgroundSprite";
    this.mapLOD_0 = new Sprite();

    this.initLighting();
    this.staticLightManager = new ShaderDataProvider(staticLightData, this.app);
  }

  public initLighting() {
    this.container.filters = [mapLightningShader];
  }

  addToEngine(engine: Engine) {
    this.barrels = engine.getNodeList(FirebarrelNode);
    this.artcars = engine.getNodeList(ArtcarNode);
    this.setup().then(() => {
      this.setupTree();

      this.container.filters[0].uniforms.texStaticLights = this.staticLightManager.renderSprite();

      const back: Sprite = Sprite.from(MAP_IMAGE);
      back.anchor.set(0.5);
      const scale = GameInstance.instance.getConfig().worldWidth / back.width;
      back.scale.set(scale);
      back.anchor.set(0);

      this.mapLOD_1.addChild(back);
      this.mapLOD_1.interactive = true;

      this.viewport.addChildAt(this.container, 0);

      this.container.addChildAt(this.mapLOD_0, 0);
      this.container.addChildAt(this.mapLOD_1, 0);

      //shaders setup
      this.container.filters[0].uniforms.frame = [
        this.viewport.center.x,
        this.viewport.center.y,
        this.viewport.worldWidth,
        this.viewport.worldHeight,
      ];

      this.initialized = true;

      this.staticLightManager.sprite.texture.update();
    });
  }

  removeFromEngine(engine: Engine) {
    this.barrels = undefined;
    this.artcars = undefined;
    if (this.mapLOD_0.children.length) {
      this.mapLOD_0.removeChildren();
      this.currentVisibleTiles.clear();
    }
  }

  update(time: number) {
    if (!this.initialized || !this.tree) {
      return;
    }

    this._updateFilters();

    const zoomLevel = GameInstance.instance
      .getConfig()
      .zoomViewportToLevel(this.viewport.scale.y);

    if (zoomLevel === GameInstance.instance.getConfig().ZOOM_LEVEL_FLYING) {
      // removing mapLOD_0
      if (this.mapLOD_0.children.length) {
        this.mapLOD_0.removeChildren();
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
        if (sprite && this.mapLOD_0.children.includes(sprite)) {
          this.mapLOD_0.removeChild(sprite);
          this.currentVisibleTiles.delete(key);
          break;
        }
      }
    }
  }

  private _updateFilters() {
    let lightQuantity = 0;

    for (let i = this.barrels?.head; i; i = i?.next) {
      this.lightsPos[lightQuantity * 2] = i.position.x;
      this.lightsPos[lightQuantity * 2 + 1] = i.position.y;
      this.lightsCol[lightQuantity] = i.firebarrel.model.data.connectedUsers
        ?.length
        ? 0xf6951d
        : 0xf6951d;
      lightQuantity += 1;
    }

    for (let i = this.artcars?.head; i; i = i?.next) {
      this.lightsPos[lightQuantity * 2] = i.position.x;
      this.lightsPos[lightQuantity * 2 + 1] = i.position.y;
      this.lightsCol[lightQuantity] = i.artcar.artcar.color;
      lightQuantity += 1;
    }

    for (let i = this.artcars?.head; i; i = i?.next) {
      this.lightsPos[lightQuantity * 2] = i.position.x;
      this.lightsPos[lightQuantity * 2 + 1] = i.position.y;
      this.lightsCol[lightQuantity] = i.artcar.artcar.color;
      lightQuantity += 1;
    }

    for (let i = this.artcars?.head; i; i = i?.next) {
      this.lightsPos[lightQuantity * 2] = i.position.x;
      this.lightsPos[lightQuantity * 2 + 1] = i.position.y;
      this.lightsCol[lightQuantity] = i.artcar.artcar.color;
      lightQuantity += 1;
    }

    for (let i = this.artcars?.head; i; i = i?.next) {
      this.lightsPos[lightQuantity * 2] = i.position.x;
      this.lightsPos[lightQuantity * 2 + 1] = i.position.y;
      this.lightsCol[lightQuantity] = i.artcar.artcar.color;
      lightQuantity += 1;
    }

    for (let i = this.artcars?.head; i; i = i?.next) {
      this.lightsPos[lightQuantity * 2] = i.position.x;
      this.lightsPos[lightQuantity * 2 + 1] = i.position.y;
      this.lightsCol[lightQuantity] = i.artcar.artcar.color;
      lightQuantity += 1;
    }

    this.container.filters[0].uniforms.lightsPos = this.lightsPos;
    this.container.filters[0].uniforms.lightsCol = this.lightsCol;
    this.container.filters[0].uniforms.lightQuantity = lightQuantity;
    this.container.filters[0].uniforms.zoom = this.viewport.scale.x;
    this.container.filters[0].uniforms.frame = [
      this.viewport.left,
      this.viewport.top,
      this.viewport.worldScreenWidth,
      this.viewport.worldScreenHeight,
    ];
    this.setDayTime(GameInstance.instance.getConfig().getCurUTCTime());
  }

  /**
   * changing the mapLOD_1 visible time
   * @param time in hourse [0;24)
   */
  public setDayTime(time: number) {
    time = (time * this.timeAccelerator) % 24;

    const sunLight = this.sunKeyFramer.getFrame(time);
    const moonLight = this.moonKeyFramer.getFrame(time);
    const light = [0, 0, 0];
    // note: what's happen, if sum of elements more than 1?
    // answer: white desert will happen
    for (let i = 0; i < 3; i++) light[i] = moonLight[i] + sunLight[i];
    this.container.filters[0].uniforms.ambientLight = light;
    this.container.filters[0].uniforms.staticLightAlpha = staticLightKeyFramer.getFrame(
      time
    )[0];
  }

  private addTile(point: Point): Sprite {
    const sprite: Sprite = Sprite.from(tiles[point.data]);
    sprite.scale.set(this.tileScaleX, this.tileScaleY);
    sprite.anchor.set(0.5);
    sprite.x = point.x;
    sprite.y = point.y;
    this.mapLOD_0.addChild(sprite);

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
    const config = GameInstance.instance.getConfig();
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
