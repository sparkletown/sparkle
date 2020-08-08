import { TemplateType } from "settings";

// @debt this should be replaced with TemplateType
export enum VenueTemplate {
  jazzbar = "jazzbar",
  friendship = "friendship",
  partymap = "partymap",
  artpiece = "artpiece",
  camp = "camp",
}

export const venueTemplateToTemplateType: Record<
  VenueTemplate,
  TemplateType
> = {
  [VenueTemplate.jazzbar]: "ZOOM_ROOM",
  [VenueTemplate.friendship]: "ZOOM_ROOM",
  [VenueTemplate.partymap]: "THEME_CAMP",
  [VenueTemplate.artpiece]: "ZOOM_ROOM",
  [VenueTemplate.camp]: "THEME_CAMP",
};
