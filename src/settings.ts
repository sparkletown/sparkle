import { VenueTemplate } from "types/VenueTemplate";
import {
  API_KEY,
  APP_ID,
  MEASUREMENT_ID,
  BUCKET_URL,
  PROJECT_ID,
} from "./secrets";
import { venueLandingUrl } from "utils/url";

export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";
export const SPARKLEVERSE_MARKETING_URL = "https://sparklever.se/";
export const SPARKLEVERSE_LOGO_URL = "/sparkleverse-logo.png";
export const BURN_START_UTC_SECONDS = 1598770800; // Sunday Aug 30th, 2020 (easy to change later)
export const DEFAULT_MAP_ICON_URL = "/icons/default-map-icon.png";
export const PLAYA_VENUE_NAME = "Playa";
export const BURNING_MAN_DONATION_SITE = `https://donate.burningman.org/?utm_source=sparkleverse&utm_medium=donate&utm_campaign=multiverse`;
export const PLAYA_INFO_URL = "https://playa.sparklever.se/in/playainfo";
export const REALITY_RANGERS_URL = "https://multiverserangers.org/rangers911/";
export const DEFAULT_USER_LIST_LIMIT = 22;

export const LOGO_IMAGE_WIDTH_PX = 200;
export const BANNER_IMAGE_WIDTH_PX = 600;
export const MAP_ICON_WIDTH_PX = 100;
export const MAP_BACKGROUND_IMAGE_WIDTH_PX = 600;
export const ROOM_IMAGE_WIDTH_PX = 300;

// playa is 4000x4000 pixels
export const PLAYA_WIDTH_AND_HEIGHT = 4000;
export const PLAYA_AVATAR_SIZE = 50;
export const PLAYA_VENUE_SIZE = 50;
export const PLAYA_ICON_SIDE_PERCENTAGE = 5;
export const PLAYA_IMAGE = "/maps/playa4k.jpg";
export const PLAYA_HD_IMAGE = "/maps/playa16k.jpg";

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

export const SUBVENUE_TEMPLATES = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
];

export const PLACEABLE_VENUE_TEMPLATES = [
  VenueTemplate.artcar,
  VenueTemplate.artpiece,
  VenueTemplate.friendship,
  VenueTemplate.jazzbar,
  VenueTemplate.partymap,
  VenueTemplate.performancevenue,
  VenueTemplate.themecamp,
  VenueTemplate.zoomroom,
];
export const PLAYA_TEMPLATES = [VenueTemplate.playa, VenueTemplate.preplaya];

export interface Template {
  template: VenueTemplate;
  name: string;
  description: Array<string>;
}

export const BURN_VENUE_TEMPLATES: Array<Template> = [
  {
    template: VenueTemplate.zoomroom, // keeping as zoom room for backward compatibility
    name: "Experience",
    description: [
      "Ideal for performances, debates, interactive sessions of all kinds: a Zoom room with its own spot on the Playa",
    ],
  },
  {
    template: VenueTemplate.themecamp,
    name: "Theme Camp",
    description: [
      "Add your camp to the Playa in the form of a clickable map; then add tents, bars, domes and other spaces to your camp map.",
    ],
  },

  {
    template: VenueTemplate.artpiece,
    name: "Art Piece",
    description: [
      "Embed any 2-D or 3-D art experience on the Playa with this special template, which allows viewers to chat to each other as they experience your art.",
    ],
  },
];

export const ALL_VENUE_TEMPLATES: Array<Template> = [
  ...BURN_VENUE_TEMPLATES,
  {
    template: VenueTemplate.jazzbar,
    name: "Jazz Bar",
    description: ["Create a jazzbar."],
  },

  {
    template: VenueTemplate.artcar,
    name: "Art Car",
    description: ["Create a space on the Playa that moves around."],
  },
  {
    template: VenueTemplate.performancevenue,
    name: "Performance Venue",
    description: [
      "Create a live performance space with tables, audience reactions and video chat between people in the venue.",
    ],
  },
];

export const FIREBASE_CONFIG = {
  apiKey: API_KEY,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

export const DEFAULT_REDIRECT_URL =
  FIREBASE_CONFIG.projectId === "co-reality-map"
    ? venueLandingUrl("kansassmittys")
    : "/enter";

// Trouble connecting? Run a local relay:
// git clone git@github.com:sparkletown/sparkle-relay && cd sparkle-relay && docker-compose up
export const DEFAULT_WS_RELAY_URL = "ws://localhost:8080/";
