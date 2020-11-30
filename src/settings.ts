import { VenueTemplate } from "types/VenueTemplate";
import {
  API_KEY,
  APP_ID,
  MEASUREMENT_ID,
  BUCKET_URL,
  PROJECT_ID,
  IS_BURN,
} from "./secrets";
import { CSSProperties } from "react";

export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";
export const SPARKLEVERSE_MARKETING_URL = "https://sparklever.se/";
export const SPARKLEVERSE_LOGO_URL = "/sparkleverse-logo.png";
export const SPARKLE_LOGO_URL = "/sparkle-header.png";
export const MEMRISE_LOGO_URL = "/memrise-logo.png";
export const BURN_START_UTC_SECONDS = 1598770800; // Sunday Aug 30th, 2020 (easy to change later)
export const VENUE_CHAT_AGE_DAYS = 30;
export const DEFAULT_MAP_ICON_URL = "/icons/default-map-icon.png";
export const BURNING_MAN_DONATION_TITLE = `Donate to WWF Australia.`;
export const BURNING_MAN_DONATION_TEXT = `To assist in the rebuilding of the Australian ecology after the devastating fires over last summer.`;
export const BURNING_MAN_DONATION_SITE = `https://donate.wwf.org.au/donate/one-off-donation/one-off-donation`;
export const DEFAULT_USER_LIST_LIMIT = 22;
export const GIF_RESIZER_URL = "http://gifgifs.com/resizer/";
export const CREATE_EDIT_URL = "/admin";
export const SPARKLEVERSITY_URL = "https://sparklever.se/sparkleversity";
export const SPARKLEVERSE_COMMUNITY_URL =
  "https://www.facebook.com/groups/sparkleverse/";
export const TICKET_URL = "https://www.eventbrite.co.uk/e/129232464781";
export const CODE_CHECK_ENABLED = true;
export const CURRENT_TIME_IN_LOCATION = "Matong State Forest";
export const HOMEPAGE_URL = "https://sparklespaces.com/";

export const DUST_STORM_TEXT_1 = `A dust storm is ripping across the ${PLAYA_VENUE_NAME}!`;
export const DUST_STORM_TEXT_2 =
  "Your only option is to seek shelter in a nearby venue!";

// How often to refresh events schedule
export const REFETCH_SCHEDULE_MS = 10 * 60 * 1000; // 10 mins

// How often to update location for counting
export const LOC_UPDATE_FREQ_MS = 5 * 60 * 1000;

export const ROOM_IMAGE_WIDTH_PX = 300;
export const MAX_IMAGE_FILE_SIZE_BYTES = 1024 * 2000;
export const MAX_IMAGE_FILE_SIZE_TEXT = "2MB";
export const GIF_IMAGE_WIDTH_PX = 300;

export const PROFILE_IMAGE_SIZE = 30;
export const REACTION_PROFILE_IMAGE_SIZE_SMALL = 40;
export const REACTION_PROFILE_IMAGE_SIZE_LARGE = 50;
export const DEFAULT_ROOM_SIZE_PERCENTAGE = 5;

export const IFRAME_ALLOW =
  "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";

export const ENABLE_SUSPECTED_LOCATION = false;

export const ZOOM_URL_TEMPLATES = [
  VenueTemplate.zoomroom,
  VenueTemplate.artcar,
];

export const IFRAME_TEMPLATES = [
  VenueTemplate.jazzbar,
  VenueTemplate.performancevenue,
  VenueTemplate.audience,
  VenueTemplate.artpiece,
  VenueTemplate.firebarrel,
];

export const BACKGROUND_IMG_TEMPLATES = [VenueTemplate.themecamp];

export const SUBVENUE_TEMPLATES = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
];

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
      "Ideal for performances, debates, interactive sessions of all kinds: a Zoom room with its own spot on the Jam",
    ],
  },
  {
    template: VenueTemplate.themecamp,
    name: "Theme Camp",
    description: [
      "Add your camp to the Jam in the form of a clickable map; then add tents, bars, domes and other spaces to your camp map.",
    ],
  },
  {
    template: VenueTemplate.artpiece,
    name: "Art Piece",
    description: [
      "Embed any 2-D or 3-D art experience on the Jam with this special template, which allows viewers to chat to each other as they experience your art.",
    ],
  },
  {
    template: VenueTemplate.jazzbar,
    name: "Music Venue",
    description: [
      "Add a music venue with an embedded video and tables for people to join to have video chats and discuss life, the universe, and everything.",
    ],
  },
  {
    template: VenueTemplate.audience,
    name: "Auditorium",
    description: [
      "Add an auditorium with an embedded video and seats for people to take to watch the experience.",
    ],
  },
  {
    template: VenueTemplate.firebarrel,
    name: "Fire Barrel",
    description: ["Huddle around a fire barrel with your close friends"],
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
    description: ["Create a space on the Jam that moves around."],
  },
  {
    template: VenueTemplate.performancevenue,
    name: "Performance Venue",
    description: [
      "Create a live performance space with tables, audience reactions and video chat between people in the venue.",
    ],
  },
  {
    template: VenueTemplate.partymap,
    name: "Party Map",
    description: [""],
  },
];

export const HAS_ROOMS_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
];

export const HAS_GRID_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
  VenueTemplate.avatargrid,
];

export const BANNER_MESSAGE_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.avatargrid,
  VenueTemplate.themecamp,
  VenueTemplate.artpiece,
];

export const ALL_BURN_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.zoomroom,
  VenueTemplate.artcar,
  VenueTemplate.artpiece,
  VenueTemplate.audience,
  VenueTemplate.performancevenue,
  VenueTemplate.themecamp,
  VenueTemplate.avatargrid,
];

export const FIREBASE_CONFIG = {
  apiKey: API_KEY,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

export const DEFAULT_VENUE = "zilloween";
export const DEFAULT_REDIRECT_URL = IS_BURN ? "/enter" : HOMEPAGE_URL;

// Trouble connecting? Run a local relay:
// git clone git@github.com:sparkletown/sparkle-relay && cd sparkle-relay && docker-compose up
export const DEFAULT_WS_RELAY_URL = "ws://localhost:8080/";

export const USE_RANDOM_AVATAR = true;
export const RANDOM_AVATARS = [
  "avatar-01.png",
  "avatar-02.png",
  "avatar-03.png",
  "avatar-04.png",
  "avatar-05.png",
  "avatar-06.png",
  "avatar-07.png",
  "avatar-08.png",
  "avatar-09.png",
  "avatar-10.png",
  "avatar-11.png",
  "avatar-12.png",
];

export const REACTION_TIMEOUT = 5000; // time im ms
