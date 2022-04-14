import { GameConfig } from "../AnimateMap/game/common";
import { MAP_IMAGE } from "../AnimateMap/game/constants/AssetConstants";

export interface AnimateMapGameOptions {
  worldWidth: number;
  worldHeight: number;
  backgroundImage: string;
}

export class AnimateMapGameConfig implements GameConfig {
  public options: AnimateMapGameOptions;

  constructor(
    options: AnimateMapGameOptions,
    public timeOffset: number = new Date().getTimezoneOffset() / 60
  ) {
    this.options = {
      ...{
        //default options can be here
        worldWidth: 9920,
        worldHeight: 9920,
        backgroundImage: MAP_IMAGE,
        timeOffset: new Date().getTimezoneOffset(),
      },
      ...options,
    };
  }

  public DEBUG_MODE_ON = true;

  public ZOOM_LEVEL_WALKING = 0;
  public ZOOM_LEVEL_CYCLING = 1;
  public ZOOM_LEVEL_FLYING = 2;

  public QA_BOTS_NUMBER = 0; //TODO: remove this

  public AVATAR_TEXTURE_USE_WITHOUT_PREPROCESSING = false;
  public AVATAR_TEXTURE_DEFAULT_SIZE = 128;

  public VENUE_MIN_PEOPLE_COUNT_FOR_HALO = 1;
  public VENUE_TEXTURE_DEFAULT_SIZE = 256;
  public VENUE_DEFAULT_COLLISION_RADIUS = 60;
  public VENUE_DEFAULT_SIZE = Math.floor(
    ((this.VENUE_DEFAULT_COLLISION_RADIUS * (4 * Math.sqrt(2))) / 4) * 1.2
  );

  public ARTCAR_ANGULAR_VELOCITY = 0.05;

  public minSpeed = 0;
  public maxSpeed = 8;
  public firstEntrance = false;

  public pointForBezieSpeedCurve = [
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: 1, y: 0.42 },
    { x: 1, y: 1 },
  ];

  public _speedByZoomLevel: Array<number> = [0.3, 1, 2];
  public _zoomLevelViewportCorresponding: Array<number> = [1.6137, 0.809, 0.32];
  public _zoomLevelAvatarRadiusCorresponding: Array<number> = [25, 17, 3];
  public _zoomLevelLineOfSightCorresponding: Array<number> = [
    78 * 10,
    28 * 30,
    8 * 100,
  ];

  public get backgroundImage() {
    return this.options.backgroundImage;
  }

  public get worldWidth(): number {
    return this.options.worldWidth;
  }

  public get worldHeight(): number {
    return this.options.worldHeight;
  }

  public get worldCenter(): { x: number; y: number } {
    return { x: this.worldWidth * 0.4947, y: this.worldHeight * 0.4858 };
  }

  public get venuesMainCircleOuterRadius(): number {
    return this.worldWidth * 0.17;
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

  /**
   * returns current time for Black Rock City
   */
  public getCurUTCTime(): number {
    const date = new Date();
    return (
      ((date.getHours() + 24 - 7 + this.timeOffset) % 24) +
      date.getUTCMinutes() / 60 +
      date.getUTCSeconds() / 3600 +
      date.getUTCMilliseconds() / 3600000
    );
  }
}
