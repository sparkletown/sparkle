import { CSSProperties } from "react";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  BUCKET_URL,
  MEASUREMENT_ID,
  PROJECT_ID,
} from "secrets";

import { RoomType } from "types/rooms";
import { VenueTemplate } from "types/venues";

import { FIVE_MINUTES_MS } from "utils/time";

import defaultMapIcon from "assets/icons/default-map-icon.png";
import sparkleNavLogo from "assets/icons/sparkle-nav-logo.png";
import sparkleverseLogo from "assets/images/sparkleverse-logo.png";

export const SPARKLE_HOMEPAGE_URL = "https://sparklespaces.com/";
export const SPARKLE_TERMS_AND_CONDITIONS_URL =
  "https://sparklespaces.com/terms-of-use/";
export const SPARKLE_PRIVACY_POLICY =
  "https://sparklespaces.com/privacy-policy/";

// Sparkle facebook app id. More settings can be found at https://developers.facebook.com/apps/2633721400264126/dashboard/
export const FACEBOOK_SPARKLE_APP_ID = "2633721400264126";

export const SPARKLEVERSE_HOMEPAGE_URL = "https://sparklever.se/";
export const PLATFORM_BRAND_NAME = "Sparkle";

export const HOMEPAGE_URL = SPARKLE_HOMEPAGE_URL;

export const TERMS_AND_CONDITIONS_URL = SPARKLE_TERMS_AND_CONDITIONS_URL;

export const PRIVACY_POLICY = SPARKLE_PRIVACY_POLICY;

export const SPARKLE_ICON = "/sparkle-icon.png";
export const DEFAULT_MAP_BACKGROUND = "/maps/Sparkle_Field_Background.jpg";
export const DEFAULT_LANDING_BANNER = "/assets/DEFAULT_VENUE_BANNER_COLOR.png";
export const DEFAULT_VENUE_BANNER_COLOR = "#000000";
export const DEFAULT_VENUE_LOGO = "/assets/Default_Venue_Logo.png";
export const DEFAULT_VENUE_AUTOPLAY = false;
// @debt de-duplicate DEFAULT_PROFILE_IMAGE, DEFAULT_AVATAR_IMAGE, DEFAULT_PROFILE_PIC. Are they all used for the same concept?
export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_AVATAR_IMAGE = sparkleNavLogo;
export const DEFAULT_PROFILE_PIC = "/default-profile-pic.png";
export const DEFAULT_MAP_ICON_URL = defaultMapIcon;
export const SPARKLEVERSE_LOGO_URL = sparkleverseLogo;

export const DEFAULT_PARTY_NAME = "Anon";
export const DISPLAY_NAME_MAX_CHAR_COUNT = 40;
export const VENUE_CHAT_AGE_DAYS = 30;
export const VENUE_NAME_MIN_CHAR_COUNT = 3;
export const VENUE_NAME_MAX_CHAR_COUNT = 50;
export const PLAYA_VENUE_NAME = "Jam";
export const PLAYA_VENUE_ID = "jamonline";
export const GIFT_TICKET_MODAL_URL =
  "https://here.burningman.org/event/virtualburn";
export const BURNING_MAN_DONATION_TITLE = `Donate to WWF Australia.`;
export const BURNING_MAN_DONATION_TEXT = `To assist in the rebuilding of the Australian ecology after the devastating fires over last summer.`;
export const BURNING_MAN_DONATION_SITE = `https://donate.wwf.org.au/donate/one-off-donation/one-off-donation`;
export const DEFAULT_USER_LIST_LIMIT = 22;
export const DEFAULT_ROOM_ATTENDANCE_LIMIT = 2;
export const GIF_RESIZER_URL = "https://gifgifs.com/resizer/";
export const CREATE_EDIT_URL = "/admin";
export const SPARKLEVERSITY_URL = "https://sparklever.se/sparkleversity";
export const SPARKLEVERSE_COMMUNITY_URL =
  "https://www.facebook.com/groups/sparkleverse/";

export const DUST_STORM_TEXT_1 = `A dust storm is ripping across the ${PLAYA_VENUE_NAME}!`;
export const DUST_STORM_TEXT_2 =
  "Your only option is to seek shelter in a nearby venue!";
export const TWITCH_SHORT_URL = "twitch.tv";
export const TWITCH_EMBED_URL = "https://player.twitch.tv";
export const FACEBOOK_EMBED_URL = "plugins/video.php";
export const VIMEO_SHORT_EVENT_URL = "vimeo.com/event";
export const VIMEO_EMBED_URL = "https://player.vimeo.com/video";
export const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/";
export const YOUTUBE_SHORT_URL_STRING = "youtu";

// How often to refresh events schedule
export const REFETCH_SCHEDULE_MS = 10 * 60 * 1000; // 10 mins
export const SCHEDULE_LONG_EVENT_LENGTH_MIN = 60;
export const SCHEDULE_MEDIUM_EVENT_LENGTH_MIN = 45;
export const SCHEDULE_SHORT_EVENT_LENGTH_MIN = 10;
export const SCHEDULE_SHOW_COPIED_TEXT_MS = 1000; // 1s

// @debt FIVE_MINUTES_MS is deprecated; use utils/time or date-fns functions instead
// How often to update location for counting
export const LOC_UPDATE_FREQ_MS = FIVE_MINUTES_MS;

export const WORLD_USERS_UPDATE_INTERVAL = 5000;

// How often to increment user's timespent
export const LOCATION_INCREMENT_SECONDS = 10;
export const LOCATION_INCREMENT_MS = LOCATION_INCREMENT_SECONDS * 1000;

// How often to refresh current time line in the schedule
export const SCHEDULE_CURRENT_TIMELINE_MS = 60 * 1000; // 1 min

// How often to refresh event status (passed / happening now / haven't started)
export const EVENT_STATUS_REFRESH_MS = 60 * 1000; // 1 min

export const MAX_UPLOAD_IMAGE_FILE_SIZE_MB = 2;
export const MAX_UPLOAD_IMAGE_FILE_SIZE_BYTES =
  MAX_UPLOAD_IMAGE_FILE_SIZE_MB * 1024 * 1024;
export const MAX_SELECTABLE_IMAGE_FILE_SIZE_MB = 30;
export const MAX_SELECTABLE_IMAGE_FILE_SIZE_BYTES =
  MAX_SELECTABLE_IMAGE_FILE_SIZE_MB * 1024 * 1024;
export const MAX_AVATAR_IMAGE_FILE_SIZE_BYTES = 1024 * 150;

export const MIN_TABLE_CAPACITY = 2;
export const MAX_TABLE_CAPACITY = 10;

export const DOCUMENT_ID = "__name__";

export const MINIMUM_PARTYMAP_COLUMNS_COUNT = 5;
export const MAXIMUM_PARTYMAP_COLUMNS_COUNT = 100;

export const MINIMUM_AUDITORIUM_COLUMNS_COUNT = 5;
export const MAXIMUM_AUDITORIUM_COLUMNS_COUNT = 5;
export const MINIMUM_AUDITORIUM_ROWS_COUNT = 5;
export const MAXIMUM_AUDITORIUM_ROWS_COUNT = 5;
// playa is 4000x4000 pixels, Burning Seed paddock is 2000x2000
export const PLAYA_HEIGHT = 2000;
export const PLAYA_WIDTH = 3000;
export const PLAYA_AVATAR_SIZE = 48;
export const PLAYA_VENUE_SIZE = 40;
export const PLAYA_ICON_SIDE_PERCENTAGE = 5;
// Burning Seed: playa is named paddock
export const PLAYA_IMAGE = "/maps/paddock2k.jpg";
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

export const ACCEPTED_IMAGE_TYPES =
  "image/png,image/x-png,image/gif,image/jpg,image/jpeg,image/tiff,image/bmp,image/gif,image/webp";

export const VALID_URL_PROTOCOLS = ["http:", "https:"];

export const IFRAME_ALLOW =
  "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen;";
export const IFRAME_ALLOW_ADVANCED = `${IFRAME_ALLOW} camera; microphone;`;

export const ENABLE_PLAYA_ADDRESS = false;

// These templates use zoomUrl (they should remain alphabetically sorted)
// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
// @debt unify this with ZOOM_URL_TEMPLATES in functions/venue.js + share the same code between frontend/backend
export const ZOOM_URL_TEMPLATES = [
  VenueTemplate.artcar,
  VenueTemplate.zoomroom,
];

// These templates use iframeUrl (they should remain alphabetically sorted)
// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
// @debt unify this with IFRAME_TEMPLATES in functions/venue.js + share the same code between frontend/backend
export const IFRAME_TEMPLATES = [
  VenueTemplate.artpiece,
  VenueTemplate.audience,
  VenueTemplate.auditorium,
  VenueTemplate.embeddable,
  VenueTemplate.firebarrel,
  VenueTemplate.jazzbar,
  VenueTemplate.performancevenue,
  VenueTemplate.posterpage,
];

// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
export const BACKGROUND_IMG_TEMPLATES = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
  VenueTemplate.animatemap,
];

// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
export const SUBVENUE_TEMPLATES = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
  VenueTemplate.animatemap,
];

export const COVERT_ROOM_TYPES: RoomType[] = [
  RoomType.unclickable,
  RoomType.mapFrame,
];

// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
export const PLAYA_TEMPLATES = [VenueTemplate.playa, VenueTemplate.preplaya];

// @debt Refactor this constant into types/templates or similar?
export interface Template {
  template: VenueTemplate;
  name: string;
  description: Array<string>;
}

// @debt Refactor this constant into types/templates or similar?
export interface Template_v2 {
  template?: VenueTemplate;
  name: string;
  subtitle?: string;
  description: Array<string>;
}

// @debt Refactor this constant into types/templates or similar?
export const BURN_VENUE_TEMPLATES: Array<Template> = [
  {
    template: VenueTemplate.conversationspace,
    name: "Conversation Space",
    description: ["A room of tables in which to talk and make merry."],
  },
  {
    template: VenueTemplate.zoomroom, // keeping as zoom room for backward compatibility
    name: "Experience",
    description: [
      "Ideal for performances, debates, interactive sessions of all kinds: a Zoom room with its own spot on the Jam",
    ],
  },
  {
    template: VenueTemplate.partymap,
    name: "Party Map",
    description: [
      "An explorable party map into which you can place all your party rooms.",
    ],
  },
  {
    template: VenueTemplate.animatemap,
    name: "Animate Map",
    description: [
      "An explorable party map into which you can place all your party rooms.",
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
    template: VenueTemplate.auditorium,
    name: "New Auditorium",
    description: ["Add an NEW auditorium with an embedded video and sections"],
  },
  {
    template: VenueTemplate.firebarrel,
    name: "Fire Barrel",
    description: ["Huddle around a fire barrel with your close friends"],
  },
  {
    template: VenueTemplate.embeddable,
    name: "Embeddable",
    description: [
      "Insert almost anything into a styled iFrame. This space does not have video chatting.",
    ],
  },
  {
    template: VenueTemplate.screeningroom,
    name: "Screening Room",
    description: ["Add an screening room with the videos listed inside."],
  },
];

// @debt Refactor this constant into types/templates or similar?
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
  {
    template: VenueTemplate.themecamp,
    name: "Theme Camp (legacy)",
    description: ["To be removed asap"],
  },
  {
    template: VenueTemplate.animatemap,
    name: "AnimateMap",
    description: [""],
  },
];

// @debt Refactor this into types/???
export type CustomInputsType = {
  name: string;
  title: string;
  type: "text" | "textarea" | "number" | "switch";
  // ? Maybe add a field for specific regex patterns
  // ? if we want the field to be a zoom url
  // ? it must include `zoom.com/`
};

// @debt Refactor this into types/templates or similar?
export type RoomTemplate = {
  template: VenueTemplate;
  name: string;
  description: string;
  icon: string;
  url?: string;
  customInputs?: CustomInputsType[];
};

// @debt Refactor this constant into types/templates or similar?
export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    template: VenueTemplate.artpiece,
    name: "Art Piece",
    description:
      "Embed any 2-D or 3-D art experience on the Jam with this special template, which allows viewers to chat to each other as they experience your art.",
    icon: "/venues/pickspace-thumbnail_art.png",
    customInputs: [
      {
        name: "iframeUrl",
        title: "Livestream URL",
        type: "text",
      },
      {
        name: "bannerMessage",
        title: "Show an announcement in the venue (or leave blank for none)",
        type: "text",
      },
    ],
  },
  {
    template: VenueTemplate.audience,
    name: "Auditorium",
    description:
      "Add an auditorium with an embedded video and seats for people to take to watch the experience.",
    icon: "/venues/pickspace-thumbnail_auditorium.png",
    customInputs: [
      {
        name: "iframeUrl",
        title: "Livestream URL",
        type: "text",
      },
    ],
  },
  {
    template: VenueTemplate.auditorium,
    name: "New Auditorium",
    description: "Add an NEW auditorium with an embedded video and sections",
    icon: "/venues/pickspace-thumbnail_auditorium.png",
    customInputs: [
      {
        name: "iframeUrl",
        title: "Livestream URL",
        type: "text",
      },
    ],
  },
  {
    template: VenueTemplate.zoomroom,
    name: "Experience",
    description:
      "Ideal for performances, debates, interactive sessions of all kinds: a Zoom room with its own spot on the Jam",
    icon: "/venues/pickspace-thumbnail_zoom.png",
  },
  {
    template: VenueTemplate.firebarrel,
    name: "Burn Barrel (Campfire?)",
    description: "Huddle around a fire barrel with your close friends",
    icon: "/rooms/room-icon-fire.png",
  },
  {
    template: VenueTemplate.jazzbar,
    name: "Music Bar",
    description:
      "Add a music venue with an embedded video and tables for people to join to have video chats and discuss life, the universe, and everything.",
    icon: "/rooms/room-icon-musicbar.png",
    customInputs: [
      {
        name: "iframeUrl",
        title: "Livestream URL",
        type: "text",
      },
    ],
  },
  {
    template: VenueTemplate.partymap,
    name: "Partymap",
    description:
      "Add your camp to the Jam in the form of a clickable map; then add tents, bars, domes and other spaces to your camp map.",
    icon: "/venues/pickspace-thumbnail_camp.png",
    customInputs: [
      {
        name: "bannerMessage",
        title: "Show an announcement in the venue (or leave blank for none)",
        type: "text",
      },
    ],
  },
  {
    template: VenueTemplate.animatemap,
    name: "AnimateMap",
    description: "Add your Animate Map",
    icon: "/venues/pickspace-thumbnail_camp.png",
    customInputs: [
      {
        name: "bannerMessage",
        title: "Show an announcement in the venue (or leave blank for none)",
        type: "text",
      },
    ],
  },
  {
    template: VenueTemplate.embeddable,
    name: "Embeddable",
    description:
      "Insert almost anything into a styled iFrame. This space does not have video chatting.",
    icon: "",
    customInputs: [
      {
        name: "iframeUrl",
        title: "Livestream URL",
        type: "text",
      },
    ],
  },
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
export const HAS_ROOMS_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
  VenueTemplate.animatemap,
  VenueTemplate.playa,
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
export const HAS_GRID_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
  VenueTemplate.animatemap,
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
// @debt unify this with HAS_REACTIONS_TEMPLATES in functions/venue.js + share the same code between frontend/backend
export const HAS_REACTIONS_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.audience,
  VenueTemplate.auditorium,
  VenueTemplate.jazzbar,
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
export const BANNER_MESSAGE_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.playa,
  VenueTemplate.preplaya,
  VenueTemplate.themecamp,
  VenueTemplate.artpiece,
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
export const ALL_BURN_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.playa,
  VenueTemplate.preplaya,
  VenueTemplate.zoomroom,
  VenueTemplate.artcar,
  VenueTemplate.artpiece,
  VenueTemplate.audience,
  VenueTemplate.auditorium,
  VenueTemplate.animatemap,
  VenueTemplate.performancevenue,
  VenueTemplate.themecamp,
];

export const FIREBASE_CONFIG = {
  apiKey: API_KEY,
  appId: APP_ID,
  authDomain: AUTH_DOMAIN,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

export const DEFAULT_VENUE = "zilloween";
export const DEFAULT_REDIRECT_URL = HOMEPAGE_URL;

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

export const CHAT_MESSAGE_TIMEOUT = 500; // time in ms

export const DEFAULT_AVATARS = [
  "/avatars/default-profile-pic-1.png",
  "/avatars/default-profile-pic-2.png",
  "/avatars/default-profile-pic-3.png",
  "/avatars/default-profile-pic-4.png",
];

export const REACTION_TIMEOUT = 5000; // time in ms
export const SHOW_EMOJI_IN_REACTION_PAGE = true;
export const DEFAULT_SHOW_REACTIONS = true;
export const DEFAULT_ENABLE_JUKEBOX = false;
export const DEFAULT_SHOW_SHOUTOUTS = true;

export const DEFAULT_CAMERA_ENABLED = true;

export const DEFAULT_SHOW_USER_STATUSES = true;

export const REACTIONS_CONTAINER_HEIGHT_IN_SEATS = 2;

// Audience
// Always have an odd number of rows and columns (because of the firelane delimiter).
export const DEFAULT_AUDIENCE_COLUMNS_NUMBER = 25;
export const DEFAULT_AUDIENCE_ROWS_NUMBER = 19;

// These must both be odd, otherwise the video won't be centered properly
export const SECTION_DEFAULT_ROWS_COUNT = 17;
export const SECTION_DEFAULT_COLUMNS_COUNT = 23;

export const SECTION_VIDEO_MIN_WIDTH_IN_SEATS = 17;

export const SECTION_PREVIEW_USER_DISPLAY_COUNT = 14;
// Max questions number for Poll inside Chat
export const MAX_POLL_QUESTIONS = 8;

export const POSTERPAGE_MAX_VIDEO_PARTICIPANTS = 10;

export const POSTERPAGE_MORE_INFO_URL_TITLE = "Full abstract";

export const POSTERHALL_POSTER_IS_LIVE_TEXT = "Presenter is online";

export const SEARCH_DEBOUNCE_TIME = 200; // ms

export const DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT = 48;
export const DEFAULT_DISPLAYED_VIDEO_PREVIEW_COUNT = 12;

export const DEFAULT_USER_STATUS = {
  status: "Online",
  color: "#53E52A",
};

// SCHEDULE
export const DEFAULT_SHOW_SCHEDULE = true;
// @debt probably would be better to adjust max hour based on user's display size
export const SCHEDULE_MAX_START_HOUR = 16;
export const SCHEDULE_HOUR_COLUMN_WIDTH_PX = 200;
export const SCHEDULE_SHOW_DAYS_AHEAD = 7;

/**
 * @see https://firebase.google.com/docs/firestore/query-data/queries#in_not-in_and_array-contains-any
 */
export const FIRESTORE_QUERY_IN_ARRAY_MAX_ITEMS = 10;

export const FACEBOOK_SHARE_URL = "https://www.facebook.com/sharer/sharer.php?";
export const TWITTER_SHARE_URL = "https://twitter.com/intent/tweet?";

// Markdown

export const MARKDOWN_BASIC_FORMATTING_TAGS = [
  "p",
  "strong",
  "em",
  "blockquote",
  "hr",
  "del",
];
export const MARKDOWN_HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
export const MARKDOWN_IMAGE_TAGS = ["img"];
export const MARKDOWN_LINK_TAGS = ["a"];
export const MARKDOWN_LIST_TAGS = ["ol", "ul", "li"];
export const MARKDOWN_PRE_CODE_TAGS = ["pre", "code"];

export const DEFAULT_TABLE_ROWS = 2;
export const DEFAULT_TABLE_COLUMNS = 3;
export const DEFAULT_TABLE_CAPACITY =
  DEFAULT_TABLE_ROWS * DEFAULT_TABLE_COLUMNS;
export const ALLOWED_EMPTY_TABLES_NUMBER = 4;
export const DEFAULT_JAZZBAR_TABLES_NUMBER = 12;
export const DEFAULT_CONVERSATION_SPACE_TABLES_NUMBER = 10;

export const CHATBOX_NEXT_RENDER_SIZE = 50;
export const PRIVATE_CHAT_NEXT_RENDER_SIZE = 50;

export const REACT_BOOTSTRAP_MODAL_HIDE_DURATION = 150;

export const EVENT_STARTING_SOON_TIMEFRAME = 120; // in minutes

export const EVENTS_PREVIEW_LIST_LENGTH = 50;

export const ALGOLIA_APP_ID = "RMJ2K10PCV";

// Set these to have images uploaded to Firebase Storage served off of Imgix
// @debt load this from an env variable. This is good enough for Burning Man but we want to have env-specific conf
export const FIREBASE_STORAGE_IMAGES_ORIGIN =
  "https://firebasestorage.googleapis.com/v0/b/sparkle-burn.appspot.com/o/";
export const FIREBASE_STORAGE_IMAGES_IMGIX_URL =
  "https://sparkle-burn-users.imgix.net/";

// Helper values that can be safely used in places that might re-render but don't have useMemo/useCallback
export const ALWAYS_EMPTY_OBJECT = {};
Object.freeze(ALWAYS_EMPTY_OBJECT);
export const ALWAYS_EMPTY_ARRAY = [];
Object.freeze(ALWAYS_EMPTY_ARRAY);
export const ALWAYS_NOOP_FUNCTION = () => {};
Object.freeze(ALWAYS_NOOP_FUNCTION);

export const DEFAULT_SHOW_CHAT = true;
export const VENUES_WITH_CHAT_REQUIRED = [
  VenueTemplate.conversationspace,
  VenueTemplate.screeningroom,
  VenueTemplate.artpiece,
  VenueTemplate.embeddable,
  VenueTemplate.auditorium,
  VenueTemplate.audience,
];
