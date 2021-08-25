import { Sprite, Texture } from "pixi.js";

import { venues } from "../../constants/AssetConstants";

import { Venue } from "./Venue";

export class VenueHalo {
  static VENUE_HALO = Texture.from(venues.VENUE_HALO);

  constructor(protected view: Venue, protected scale = 1) {
    if (view.halo && view.halo.parent) {
      view.halo.parent.removeChild(view.halo);
    }

    view.halo = new Sprite(VenueHalo.VENUE_HALO); //Sprite.from(venues.VENUE_HALO);
    view.halo.anchor.set(0.5);
    view.addChildAt(view.halo, 0);
    view.halo.scale.set(1 / scale);
  }
}
