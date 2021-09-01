import { Easing } from "../../utils/Easing";

import { Animatable } from "./Animatable";
import { Venue } from "./Venue";

export class VenueHoverIn implements Animatable {
  public easing?: Easing;

  constructor(venue: Venue, duration: number) {
    if (venue.venue) {
      this.easing = new Easing(venue.venue.scale.x, 1.1, duration);
      this.easing.onStep = (value: number) => {
        venue.venue?.scale.set(value);
      };
    }
    if (venue.halo) {
      venue.halo.scale.set(venue.halo.scale.y + venue.halo.scale.y / 9);
    }
  }

  animate(time: number) {
    if (this.easing) {
      this.easing.update(time);
    }
  }
}
