import { PlaygroundMap } from "../game/utils/PlaygroundMap";
import { Point } from "../game/utils/Point";

export interface GameOptions {
  worldWidth: number;
  worldHeight: number;
  backgroundImage: string;
}

export class GameConfig {
  private options: GameOptions;

  constructor(options: GameOptions) {
    this.options = {
      ...{
        //default options can be here
        worldWidth: 9920,
        worldHeight: 9920,
      },
      ...options,
    };
  }

  public static ZOOM_LEVEL_WALKING = 0;
  public static ZOOM_LEVEL_CYCLING = 1;
  public static ZOOM_LEVEL_FLYING = 2;

  public static QA_BOTS_NUMBER = 20; //TODO: remove this

  public minSpeed = 0;
  public maxSpeed = 2;
  public minZoom = 0.1;
  public maxZoom = 6;
  public pointForBezieSpeedCurve = [
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: 1, y: 0.42 },
    { x: 1, y: 1 },
  ];

  private _speedByZoomLevel: Array<number> = [0.3, 1, 2];
  private _zoomLevelViewportCoresponding: Array<number> = [1.6137, 0.809, 0.32];
  private _zoomLevelAvatarRadiusCoresponding: Array<number> = [25, 17, 6];
  private _zoomLevelLineOfSightCoresponding: Array<number> = [
    78 * 10,
    28 * 30,
    8 * 20,
  ];

  private _playgroundMap: PlaygroundMap = new PlaygroundMap();

  public get backgroundImage() {
    return this.options.backgroundImage;
  }

  public get playgroundMap(): PlaygroundMap {
    return this._playgroundMap;
  }

  public get worldWidth(): number {
    return this.options.worldWidth;
  }

  public get worldHeight(): number {
    return this.options.worldHeight;
  }

  public get worldCenter(): Point {
    return { x: this.worldWidth * 0.4947, y: this.worldHeight * 0.4858 };
  }

  public get venuesMainCircleOuterRadius(): number {
    return this.worldWidth * 0.16;
  }

  public get borderRadius(): number {
    return this.worldWidth * 0.371;
  }

  public get zoomInOutStep(): number {
    return 0.1;
  }

  public get viewportScaleMin(): number {
    return 0.1;
  }

  public get viewportScaleMax(): number {
    return 6;
  }

  public get speedByZoomLevelArray(): Array<number> {
    return this._speedByZoomLevel.slice(0);
  }

  public get zoomLevelsViewportCoresponding(): Array<number> {
    return this._zoomLevelViewportCoresponding.slice(0);
  }

  public get zoomLevelAvatarRadiusCoresponding(): Array<number> {
    return this._zoomLevelAvatarRadiusCoresponding.slice(0);
  }

  public zoomLevelToViewport(zoomLevel: number): number {
    zoomLevel = Math.max(zoomLevel, 0);
    zoomLevel = Math.min(
      zoomLevel,
      this._zoomLevelViewportCoresponding.length - 1
    );
    return this._zoomLevelViewportCoresponding[zoomLevel];
  }

  public zoomViewportToLevel(zoom: number): number {
    zoom = Math.max(zoom, 0.1);
    for (let i = 0; i < this._zoomLevelViewportCoresponding.length; i++) {
      if (zoom >= this._zoomLevelViewportCoresponding[i]) {
        return i;
      }
    }
    return this._zoomLevelViewportCoresponding.length - 1;
  }

  public getSpeedByZoomLevel(zoomLevel: number = 0): number {
    zoomLevel = Math.max(zoomLevel, 0);
    zoomLevel = Math.min(zoomLevel, this._speedByZoomLevel.length - 1);
    return this._speedByZoomLevel[zoomLevel];
  }

  public getAvatarRadiusByZoomLevel(zoomLevel: number): number {
    zoomLevel = Math.max(zoomLevel, 0);
    zoomLevel = Math.min(
      zoomLevel,
      this._zoomLevelAvatarRadiusCoresponding.length - 1
    );
    return this._zoomLevelAvatarRadiusCoresponding[zoomLevel];
  }

  public getAvatarLineOfSightByZoomLevel(zoomLevel: number): number {
    zoomLevel = Math.max(zoomLevel, 0);
    zoomLevel = Math.min(
      zoomLevel,
      this._zoomLevelLineOfSightCoresponding.length - 1
    );
    return this._zoomLevelLineOfSightCoresponding[zoomLevel];
  }
}
