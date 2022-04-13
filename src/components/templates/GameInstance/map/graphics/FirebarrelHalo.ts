import { Sprite, Texture } from "pixi.js";

import { FIREBARELL_HALO, FIREBARELL_HALO_GREEN } from "../../consts";

import { Firebarrel } from "./Firebarrel";

export class FirebarrelHalo {
  static FIREBARELL_HALO = Texture.from(FIREBARELL_HALO);
  static FIREBARELL_HALO_GREEN = Texture.from(FIREBARELL_HALO_GREEN);
  static SCALE = 1;

  constructor(protected view: Firebarrel) {
    if (view.halo && view.halo.parent) {
      view.halo.parent.removeChild(view.halo);
    }
    this.setup();
  }

  protected get texture(): Texture {
    return FirebarrelHalo.FIREBARELL_HALO;
  }

  protected setup(): void {
    this.view.halo = new Sprite(this.texture); //Sprite.from(venues.VENUE_HALO);
    this.view.halo.scale.set(FirebarrelHalo.SCALE);
    this.view.halo.anchor.set(0.5);
    this.view.addChildAt(this.view.halo, 0);
  }
}
