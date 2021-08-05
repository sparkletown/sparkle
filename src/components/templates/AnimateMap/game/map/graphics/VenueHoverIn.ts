import { Easing } from "../../utils/Easing";
import { Animatable } from "./Animatable";
import { Venue } from "./Venue";

export class VenueHoverIn implements Animatable {
  public easing: Easing | null = null;

  constructor(venue: Venue, duration: number) {
    if (venue.venue) {
      this.easing = new Easing(venue.venue.scale.x, 2, duration);
      this.easing.onStep = (value: number) => {
        venue.venue?.scale.set(value);
      };
    }
  }

  animate(time: number): void {
    if (this.easing) {
      this.easing.update(time);
    }
  }
}
