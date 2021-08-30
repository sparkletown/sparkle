import { Sprite, Texture } from "pixi.js";

import { FIREBARELL_HALO } from "../../constants/AssetConstants";

import { Firebarrel } from "./Firebarrel";

export class FirebarrelHalo {
  static FIREBARELL_HALO = Texture.from(FIREBARELL_HALO);
  static SCALE = 1;

  constructor(protected view: Firebarrel) {
    if (view.halo && view.halo.parent) {
      view.halo.parent.removeChild(view.halo);
    }

    view.halo = new Sprite(FirebarrelHalo.FIREBARELL_HALO); //Sprite.from(venues.VENUE_HALO);
    view.halo.scale.set(FirebarrelHalo.SCALE);
    view.halo.anchor.set(0.5);
    view.addChildAt(view.halo, 0);
  }
}
