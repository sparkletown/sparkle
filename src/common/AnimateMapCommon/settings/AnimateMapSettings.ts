import { DeferredAction } from "../AnimateMapIds";

import sparkleNavLogo from "assets/icons/sparkle-nav-logo.png";

export const ALWAYS_EMPTY_ARRAY = [];
Object.freeze(ALWAYS_EMPTY_ARRAY);

export const COLLECTION_WORLD_EVENTS = "worldEvents";

export const COLLECTION_USERS = "users";

export const EXTERNAL_WEBGL_CHECK_URL = "https://webglreport.com/?v=2";

export const STRING_SPACE = " ";

export const FIREBASE_STORAGE_IMAGES_ORIGIN =
  "https://firebasestorage.googleapis.com/v0/b/sparkle-burn.appspot.com/o/";
export const FIREBASE_STORAGE_IMAGES_IMGIX_URL =
  "https://sparkle-burn-users.imgix.net/";

export interface PortalBox {
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
}

export const DEFAULT_PORTAL_BOX: PortalBox = {
  width_percent: 5,
  height_percent: 5,
  x_percent: 50,
  y_percent: 50,
};
Object.freeze(DEFAULT_PORTAL_BOX);

export const DEFERRED = Symbol("deferred action") as DeferredAction;

export const DEFAULT_BADGE_IMAGE = sparkleNavLogo;
