import { Point } from "types/utility";

import { PlaygroundMap } from "../game/utils/PlaygroundMap";

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

  public static VENUE_TEXTURE_DEFAULT_SIZE = 256;
  public static VENUE_DEFAULT_COLLISION_RADIUS = 60;
  public static VENUE_DEFAULT_SIZE = Math.floor(
    ((GameConfig.VENUE_DEFAULT_COLLISION_RADIUS * (4 * Math.sqrt(2))) / 4) * 1.2
  );
  public static ACTIVE_VENUE_MIN_PEOPLE_FOR_ANIMATED_HALO = 25;

  public minSpeed = 0;
  public maxSpeed = 8;
  public firstEntrance = false;

  public pointForBezieSpeedCurve = [
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: 1, y: 0.42 },
    { x: 1, y: 1 },
  ];

  private _speedByZoomLevel: Array<number> = [0.3, 1, 2];
  private _zoomLevelViewportCorresponding: Array<number> = [
    1.6137,
    0.809,
    0.32,
  ];
  private _zoomLevelAvatarRadiusCorresponding: Array<number> = [25, 17, 3];
  private _zoomLevelLineOfSightCorresponding: Array<number> = [
    78 * 10,
    28 * 30,
    8 * 100,
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

  public get speedByZoomLevelArray(): Array<number> {
    return this._speedByZoomLevel.slice(0);
  }

  public get zoomLevelsViewportCoresponding(): Array<number> {
    return this._zoomLevelViewportCorresponding.slice(0);
  }

  public get zoomLevelAvatarRadiusCorresponding(): Array<number> {
    return this._zoomLevelAvatarRadiusCorresponding.slice(0);
  }

  public zoomLevelToViewport(zoomLevel: number): number {
    zoomLevel = Math.max(zoomLevel, 0);
    zoomLevel = Math.min(
      zoomLevel,
      this._zoomLevelViewportCorresponding.length - 1
    );
    return this._zoomLevelViewportCorresponding[zoomLevel];
  }

  public zoomViewportToLevel(zoom: number): number {
    zoom = Math.max(zoom, 0.1);
    for (let i = 0; i < this._zoomLevelViewportCorresponding.length; i++) {
      if (zoom >= this._zoomLevelViewportCorresponding[i]) {
        return i;
      }
    }
    return this._zoomLevelViewportCorresponding.length - 1;
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
      this._zoomLevelAvatarRadiusCorresponding.length - 1
    );
    return this._zoomLevelAvatarRadiusCorresponding[zoomLevel];
  }

  public getAvatarLineOfSightByZoomLevel(zoomLevel: number): number {
    zoomLevel = Math.max(zoomLevel, 0);
    zoomLevel = Math.min(
      zoomLevel,
      this._zoomLevelLineOfSightCorresponding.length - 1
    );
    return this._zoomLevelLineOfSightCorresponding[zoomLevel];
  }
}
