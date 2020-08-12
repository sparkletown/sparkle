import { VenueTemplate } from "types/VenueTemplate";

export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";
export const SPARKLEVERSE_MARKETING_URL = "https://sparklever.se/";
export const BURN_START_UTC_SECONDS = 1598770800; // Sunday Aug 30th, 2020 (easy to change later)
export const DEFAULT_MAP_ICON_URL = "/icons/default-map-icon.png";

// playa is 4000x4000 pixels
export const PLAYA_WIDTH_AND_HEIGHT = 4000;

export const ZOOM_URL_TEMPLATES = [
  VenueTemplate.zoomroom,
  VenueTemplate.artcar,
];

export const VIDEO_IFRAME_TEMPLATES = [
  VenueTemplate.jazzbar,
  VenueTemplate.performancevenue,
];

export const EMBED_IFRAME_TEMPLATES = [VenueTemplate.artpiece];

export const BACKGROUND_IMG_TEMPLATES = [VenueTemplate.themecamp];

export interface Template {
  template: VenueTemplate;
  name: string;
  description: Array<string>;
}

export const BURN_VENUE_TEMPLATES: Array<Template> = [
  {
    template: VenueTemplate.zoomroom,
    name: "Zoom Room",
    description: [
      "Give your Zoom room a place on the Playa",
      "Add descriptive details",
      "Customise entrance experience",
    ],
  },
  {
    template: VenueTemplate.themecamp,
    name: "Theme Camp",
    description: [
      "Add your camp to the Playa in the form of a clickable map; then add tents, bars, domes and other spaces to your camp map. ",
    ],
  },
  {
    template: VenueTemplate.performancevenue,
    name: "Performance Venue",
    description: [
      "Create a live performance space with tables, audience reactions and video chat between people in the venue.",
    ],
  },
  {
    template: VenueTemplate.artpiece,
    name: "Art Piece",
    description: [
      "Embed any 2-D or 3-D art experience with this special template, which allows viewers to chat to each other as they experience your art.",
    ],
  },
  {
    template: VenueTemplate.artcar,
    name: "Art Car",
    description: ["Create a space on the Playa that moves around."],
  },
];

export const ALL_VENUE_TEMPLATES: Array<Template> = [
  ...BURN_VENUE_TEMPLATES,
  {
    template: VenueTemplate.jazzbar,
    name: "Jazz Bar",
    description: ["Create a jazzbar."],
  },
];
