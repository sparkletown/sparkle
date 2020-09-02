import { VenueTemplate } from "types/VenueTemplate";
import {
  API_KEY,
  APP_ID,
  MEASUREMENT_ID,
  BUCKET_URL,
  PROJECT_ID,
} from "./secrets";
import { venueLandingUrl } from "utils/url";
import { CSSProperties } from "react";

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
export const GIF_RESIZER_URL = "http://gifgifs.com/resizer/";
export const CREATE_EDIT_URL = "/admin";
export const SPARKLEVERSITY_URL = "https://sparklever.se/sparkleversity";
export const SPARKLEVERSE_COMMUNITY_URL =
  "https://www.facebook.com/groups/sparkleverse/";

// Hide inactive avatars on playa
export const MAX_IDLE_TIME_MS = 10 * 60 * 1000;
// How often to refresh events schedule
export const REFETCH_SCHEDULE_MS = 10 * 60 * 1000; // 10 mins

export const LOGO_IMAGE_WIDTH_PX = 200;
export const BANNER_IMAGE_WIDTH_PX = 600;
export const MAP_ICON_WIDTH_PX = 100;
export const MAP_BACKGROUND_IMAGE_WIDTH_PX = 600;
export const ROOM_IMAGE_WIDTH_PX = 300;
export const MAX_IMAGE_FILE_SIZE_BYTES = 1024 * 250; // 250kB
export const GIF_IMAGE_WIDTH_PX = 300;

// playa is 4000x4000 pixels
export const PLAYA_WIDTH_AND_HEIGHT = 4000;
export const PLAYA_AVATAR_SIZE = 30;
export const PLAYA_VENUE_SIZE = 40;
export const PLAYA_ICON_SIDE_PERCENTAGE = 5;
export const PLAYA_IMAGE = "/maps/playa4k.jpg";
export const PLAYA_HD_IMAGE = "/maps/playa16k.jpg";
export const PLAYA_VENUE_STYLES: Record<string, CSSProperties> = {
  iconImage: {
    width: PLAYA_VENUE_SIZE,
    height: PLAYA_VENUE_SIZE,
    overflow: "hidden",
    borderRadius: "25%",
    background: "rgba(147, 124, 99, 0.2)",
    border: "2px solid rgba(147, 124, 99, 0.2)",
    animation: "ripple 4s linear infinite",
  },
  draggableIconImage: {
    width: PLAYA_VENUE_SIZE * 1.5,
    height: PLAYA_VENUE_SIZE * 1.5,
    overflow: "hidden",
    borderRadius: "25%",
    background: "rgba(147, 124, 99, 0.2)",
    border: "2px solid rgba(147, 124, 99, 0.2)",
    animation: "ripple 4s linear infinite",
  },
};

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
