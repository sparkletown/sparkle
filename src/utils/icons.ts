import { DEFAULT_VENUE_LOGO, SPACE_PORTALS_LIST } from "settings";

import { VenueTemplate } from "types/venues";

export const getDefaultPortalIcon = (template?: VenueTemplate) => {
  if (!template) {
    return DEFAULT_VENUE_LOGO;
  }

  return SPACE_PORTALS_LIST.find((portal) => portal.template === template)
    ?.icon;
};
