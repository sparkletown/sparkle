import { Sprite, Texture } from "pixi.js";

import { FIREBARELL_CAM_ICON } from "../../consts";

import { Firebarrel } from "./Firebarrel";

export class FirebarrelCamIcon {
  static FIREBARELL_CAM_ICON = Texture.from(FIREBARELL_CAM_ICON);
  static SCALE = 0.8;

  constructor(public view: Firebarrel) {
    if (view.camIcon && view.camIcon.parent) {
      view.camIcon.parent.removeChild(view.camIcon);
    }

    view.camIcon = new Sprite(FirebarrelCamIcon.FIREBARELL_CAM_ICON);
    view.camIcon.scale.set(FirebarrelCamIcon.SCALE);
    view.camIcon.anchor.set(0.5);
    view.camIcon.position.y = 60;

    view.addChildAt(view.camIcon, 0);
  }
}
