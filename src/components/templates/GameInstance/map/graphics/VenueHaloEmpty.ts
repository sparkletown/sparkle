import { Venue } from "./Venue";

export class VenueHaloEmpty {
  constructor(protected view: Venue) {
    if (view.halo && view.halo.parent) {
      view.halo.parent.removeChild(view.halo);
    }
  }
}
