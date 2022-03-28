import { RoomType } from "types/rooms";
import { Table } from "types/Table";
import { VenueTemplate } from "types/VenueTemplate";

import { generateTables } from "utils/table";
import { FIVE_MINUTES_MS } from "utils/time";

import {
  ROOM_TAXON,
  ROOMS_TAXON,
  SCREENING_ROOM_TAXON,
  SPACE_TAXON,
  ZOOM_ROOM_TAXON,
} from "./taxonomy";

// NOTE: please keep these exports sorted alphabetically for faster visual scan
export * from "./adminDesignSettings";
export * from "./apiSettings";
export * from "./dateSettings";
export * from "./disableSettings";
export * from "./embedUrlSettings";
export * from "./imageSettings";
export * from "./interpolationSettings";
export * from "./mapBackgrounds";
export * from "./placeholderSettings";
export * from "./playaSettings";
export * from "./portalSettings";
export * from "./sectionSettings";
export * from "./spacePortalsSettings";
export * from "./taxonomy";
export * from "./urlSettings";
export * from "./useSettingsDefaults";
export * from "./validationSettings";
export * from "./worldDefaultSettings";

export const ENABLE_POPUPS_URL =
  "https://support.google.com/chrome/answer/95472?hl=en&co=GENIE.Platform%3DDesktop";

// Sparkle facebook app id. More settings can be found at https://developers.facebook.com/apps/2633721400264126/dashboard/
export const FACEBOOK_SPARKLE_APP_ID = "2633721400264126";

export const PLATFORM_BRAND_NAME = "Sparkle";

export const SPARKLE_PHOTOBOOTH_URL = "outsnappedphotoboothcamp";

export const SPARKLE_ICON = "/sparkle-icon.png";
export const DEFAULT_MAP_BACKGROUND = "/maps/Sparkle_Field_Background.jpg";
export const DEFAULT_LANDING_BANNER = "/assets/Default_Venue_Banner.png";
export const DEFAULT_VENUE_BANNER_COLOR = "#000000";
export const DEFAULT_VENUE_LOGO = "/assets/Default_Venue_Logo.png";
export const DEFAULT_VENUE_AUTOPLAY = false;

export const DEFAULT_PARTY_NAME = "Anon";
export const DISPLAY_NAME_MAX_CHAR_COUNT = 40;
export const VENUE_CHAT_AGE_DAYS = 30;
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

export const DEFAULT_GLOBAL_CHAT_NAME = "global chat";

export const DUST_STORM_TEXT_1 = `A dust storm is ripping across the ${PLAYA_VENUE_NAME}!`;
export const DUST_STORM_TEXT_2 =
  "Your only option is to seek shelter in a nearby venue!";

// How often to refresh events schedule
export const SCHEDULE_SHOW_COPIED_TEXT_MS = 1000; // 1s

// @debt FIVE_MINUTES_MS is deprecated; use utils/time or date-fns functions instead
// How often to update location for counting
export const LOC_UPDATE_FREQ_MS = FIVE_MINUTES_MS;

export const WORLD_USERS_UPDATE_INTERVAL = 5000;
export const VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL = 10000;

// How often to increment user's timespent
export const LOCATION_INCREMENT_SECONDS = 10;
export const LOCATION_INCREMENT_MS = LOCATION_INCREMENT_SECONDS * 1000;

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

export const ACCEPTED_IMAGE_TYPES =
  "image/png,image/x-png,image/gif,image/jpg,image/jpeg,image/tiff,image/bmp,image/gif,image/webp";

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
  VenueTemplate.viewingwindow,
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
    description: [
      `A ${SPACE_TAXON.lower} of tables in which to talk and make merry.`,
    ],
  },
  {
    template: VenueTemplate.zoomroom, // keeping as zoom room for backward compatibility
    name: "Experience",
    description: [
      `Ideal for performances, debates, interactive sessions of all kinds: a ${ZOOM_ROOM_TAXON.capital} with its own spot on the Jam`,
    ],
  },
  {
    template: VenueTemplate.partymap,
    name: "Party Map",
    description: [
      `An explorable party map into which you can place all your party ${ROOMS_TAXON.lower}.`,
    ],
  },
  {
    template: VenueTemplate.animatemap,
    name: "Animate Map",
    description: [
      `An explorable party map into which you can place all your party ${ROOMS_TAXON.lower}.`,
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
    template: VenueTemplate.auditorium,
    name: "Auditorium",
    description: ["Add an auditorium with an embedded video and sections"],
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
    name: SCREENING_ROOM_TAXON.title,
    description: [
      `Add an screening ${ROOM_TAXON.lower} with the videos listed inside.`,
    ],
  },
  {
    template: VenueTemplate.viewingwindow,
    name: "Viewing Window",
    description: [
      "Embed any 2-D or 3-D art experience on the Jam with this special template, which allows viewers to chat to each other as they experience your art.",
    ],
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
    template: VenueTemplate.partymap,
    name: "Party Map",
    description: [""],
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
    description: `Ideal for performances, debates, interactive sessions of all kinds: a ${ZOOM_ROOM_TAXON.capital} with its own spot on the Jam`,
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
  // {
  //   template: VenueTemplate.viewingwindow,
  //   name: "Viewing Window",
  //   description:
  //     "Embed any 2-D or 3-D art experience on the Jam with this special template, which allows viewers to chat to each other as they experience your art.",
  //   icon: "/venues/pickspace-thumbnail_art.png",
  //   customInputs: [
  //     {
  //       name: "iframeUrl",
  //       title: "Livestream URL",
  //       type: "text",
  //     },
  //     {
  //       name: "bannerMessage",
  //       title: "Show an announcement in the venue (or leave blank for none)",
  //       type: "text",
  //     },
  //     {
  //       name: "isWithParticipants",
  //       title: "has participants?",
  //       type: "switch",
  //     },
  //   ],
  // },
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
  VenueTemplate.viewingwindow,
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
  VenueTemplate.viewingwindow,
];

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

export const CHAT_MESSAGE_TIMEOUT = 500;

export const REACTION_TIMEOUT = 5000; // time in ms
export const SHOW_EMOJI_IN_REACTION_PAGE = true;
export const DEFAULT_ENABLE_JUKEBOX = false;
export const DEFAULT_SHOW_SHOUTOUTS = true;
export const DEFAULT_SHOW_REACTIONS = true;
export const DEFAULT_REACTIONS_MUTED = false;

export const DEFAULT_CAMERA_ENABLED = true;

export const DEFAULT_SHOW_USER_STATUSES = true;

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

// Analytics
export const DEFAULT_ANALYTICS_GROUP_KEY = "world";
export const DEFAULT_ANALYTICS_WORLD_NAME = "Undefined World";
export const LOG_IN_EVENT_NAME = "Login successful";
export const SIGN_UP_EVENT_NAME = "Sign up";
export const VENUE_PAGE_LOADED_EVENT_NAME = "VenuePage loaded";
export const OPEN_ROOM_MODAL_EVENT_NAME = "Open room modal";
export const ENTER_ROOM_EVENT_NAME = "Enter room";
export const ENTER_AUDITORIUM_SECTION_EVENT_NAME = "Enter auditorium section";
export const SELECT_TABLE_EVENT_NAME = "Select table";
export const TAKE_SEAT_EVENT_NAME = "Take a seat";
export const ENTER_JAZZ_BAR_EVENT_NAME = "Enter jazz bar";

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
export const ALLOWED_EMPTY_TABLES_NUMBER = 4;
export const DEFAULT_JAZZBAR_TABLES_NUMBER = 12;
export const DEFAULT_CONVERSATION_SPACE_TABLES_NUMBER = 10;

export const JAZZBAR_TABLES: Table[] = generateTables({
  num: DEFAULT_JAZZBAR_TABLES_NUMBER,
  generateTableReference: (title: string) => title,
});

export const CONVERSATION_TABLES: Table[] = generateTables({
  num: DEFAULT_CONVERSATION_SPACE_TABLES_NUMBER,
  generateTableReference: (title: string) => title,
});

// These are really supposed to be constants and to avoid possible mutable shared state in the code elsewhere
Object.freeze(JAZZBAR_TABLES);
Object.freeze(CONVERSATION_TABLES);

export const CHATBOX_NEXT_FETCH_SIZE = 50;
export const SECTIONS_NEXT_FETCH_SIZE = 50;

export const REACT_BOOTSTRAP_MODAL_HIDE_DURATION = 150;

export const EVENT_STARTING_SOON_TIMEFRAME = 120; // in minutes

export const EVENTS_PREVIEW_LIST_LENGTH = 50;

// Set these to have images uploaded to Firebase Storage served off of Imgix
// @debt load this from an env variable. This is good enough for Burning Man but we want to have env-specific conf
export const FIREBASE_STORAGE_IMAGES_ORIGIN =
  "https://firebasestorage.googleapis.com/v0/b/sparkle-burn.appspot.com/o/";
export const FIREBASE_STORAGE_IMAGES_IMGIX_URL =
  "https://sparkle-burn-users.imgix.net/";

export const VENUES_WITH_CHAT_REQUIRED = [
  VenueTemplate.conversationspace,
  VenueTemplate.screeningroom,
  VenueTemplate.artpiece,
  VenueTemplate.embeddable,
  VenueTemplate.auditorium,
  VenueTemplate.audience,
  VenueTemplate.viewingwindow,
];

export const VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT = 10;

export const NON_EXISTENT_FIRESTORE_ID = "NON_EXISTENT_FIRESTORE_ID";

export const INVALID_SLUG_CHARS_REGEX = /[^a-zA-Z0-9]/g;

export const DEFAULT_SHOW_MORE_SETTINGS = {
  more: "Show more",
  less: "Show less",
  expanded: false,
  truncatedEndingComponent: "... ",
};
export const DEFAULT_MISSING_PLACEHOLDER = "Placeholder";

export const POPOVER_CONTAINER_ID = "popoverContainer";
export const ATTENDEE_LAYOUT_CLASSNAME = "AttendeeLayout";
export const DEFAULT_SAFE_ZONE = { width: 100.0, height: 100.0 };
Object.freeze(DEFAULT_SAFE_ZONE);

// Allow 70px for the top and bottom UI. Ideally, this would come from CSS
export const PARTY_MAP_VERTICAL_PAD = 140;
