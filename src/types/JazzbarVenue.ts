import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";

export interface JazzbarVenue extends Venue {
  template: VenueTemplate.jazzbar;
  iframeUrl: string;
  logoImageUrl: string;
  host: {
    icon: string;
  };
}
