import { Sprite, Texture } from "pixi.js";

import { venues } from "../../consts";

import { Venue } from "./Venue";

export class VenueHalo {
  static VENUE_HALO = Texture.from(venues.VENUE_HALO);
  static SCALE = 2.6;

  constructor(protected view: Venue) {
    if (view.halo && view.halo.parent) {
      view.halo.parent.removeChild(view.halo);
    }

    view.halo = new Sprite(VenueHalo.VENUE_HALO); //Sprite.from(venues.VENUE_HALO);
    view.halo.scale.set(VenueHalo.SCALE);
    view.halo.anchor.set(0.5);
    view.addChildAt(view.halo, 0);
  }
}
