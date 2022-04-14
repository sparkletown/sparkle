export type GameConfig = {
  DEBUG_MODE_ON: boolean;

  ZOOM_LEVEL_WALKING: number;
  ZOOM_LEVEL_CYCLING: number;
  ZOOM_LEVEL_FLYING: number;

  QA_BOTS_NUMBER: number; //TODO: remove this

  AVATAR_TEXTURE_USE_WITHOUT_PREPROCESSING: boolean;
  AVATAR_TEXTURE_DEFAULT_SIZE: number;

  VENUE_MIN_PEOPLE_COUNT_FOR_HALO: number;
  VENUE_TEXTURE_DEFAULT_SIZE: number;
  VENUE_DEFAULT_COLLISION_RADIUS: number;
  VENUE_DEFAULT_SIZE: number;

  ARTCAR_ANGULAR_VELOCITY: number;

  _speedByZoomLevel: Array<number>;
  _zoomLevelViewportCorresponding: Array<number>;
  _zoomLevelAvatarRadiusCorresponding: Array<number>;
  _zoomLevelLineOfSightCorresponding: Array<number>;
  getCurUTCTime: () => number;
  borderRadius: number;
  backgroundImage: string;
  worldWidth: number;
  worldHeight: number;
  worldCenter: {
    x: number;
    y: number;
  };
  options: {
    worldWidth: number;
    worldHeight: number;
    backgroundImage: string;
  };
  pointForBezieSpeedCurve: Array<{
    x: number;
    y: number;
  }>;
  timeOffset: number;
  firstEntrance: boolean;
  minSpeed: number;
  maxSpeed: number;
  venuesMainCircleOuterRadius: number;
  speedByZoomLevelArray: Array<number>;
  zoomLevelsViewportCoresponding: Array<number>;
  zoomLevelAvatarRadiusCorresponding: Array<number>;
  zoomViewportToLevel(zoom: number): number;
  zoomLevelToViewport(zoomLevel: number): number;
  getSpeedByZoomLevel(zoomLevel?: number): number;
  getAvatarRadiusByZoomLevel(zoomLevel: number): number;
  getAvatarLineOfSightByZoomLevel(zoomLevel: number): number;
};
