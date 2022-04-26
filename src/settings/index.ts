import { RoomType } from "types/rooms";
import { Table } from "types/Table";
import { VenueTemplate } from "types/VenueTemplate";

import { generateTables } from "utils/table";
import { FIVE_MINUTES_MS } from "utils/time";

// This export is purposefully done before the rest as there are dependency
// issues between them
export * from "./taxonomy";

// NOTE: please keep these exports sorted alphabetically for faster visual scan
export * from "./adminDesignSettings";
export * from "./apiSettings";
export * from "./dateSettings";
export * from "./disableSettings";
export * from "./domSettings";
export * from "./embedUrlSettings";
export * from "./imageSettings";
export * from "./interpolationSettings";
export * from "./mapBackgrounds";
export * from "./placeholderSettings";
export * from "./portalSettings";
export * from "./sectionSettings";
export * from "./spacePortalsSettings";
export * from "./urlSettings";
export * from "./useSettingsDefaults";
export * from "./validationSettings";
export * from "./worldDefaultSettings";

export const PLATFORM_BRAND_NAME = "Sparkle";

export const DEFAULT_MAP_BACKGROUND = "/maps/Sparkle_Field_Background.jpg";
export const DEFAULT_LANDING_BANNER = "/assets/Default_Venue_Banner.png";
export const DEFAULT_VENUE_BANNER_COLOR = "#000000";
export const DEFAULT_VENUE_LOGO = "/assets/Default_Venue_Logo.png";
export const DEFAULT_VENUE_AUTOPLAY = false;
export const BASE_PORTAL_ICON_PATH = "static/media";

export const DEFAULT_PARTY_NAME = "Anon";
export const DISPLAY_NAME_MAX_CHAR_COUNT = 40;
export const GIF_RESIZER_URL = "https://gifgifs.com/resizer/";

// How often to refresh events schedule
export const SCHEDULE_SHOW_COPIED_TEXT_MS = 1000; // 1s

// @debt FIVE_MINUTES_MS is deprecated; use utils/time or date-fns functions instead
// How often to update location for counting
export const LOC_UPDATE_FREQ_MS = FIVE_MINUTES_MS;

export const VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL = 10000;
export const USER_PRESENCE_CHECKIN_INTERVAL = 60000;
export const USER_PRESENCE_DEBOUNCE_INTERVAL = 1000;

export const ATTENDEE_HEADER_AVATAR_LIMIT = 50;
export const ATTENDEE_DESCRIPTION_AVATAR_LIMIT = 200;

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

export const ACCEPTED_IMAGE_TYPES =
  "image/png,image/x-png,image/gif,image/jpg,image/jpeg,image/tiff,image/bmp,image/gif,image/webp";

export const IFRAME_ALLOW =
  "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen;";
export const IFRAME_ALLOW_ADVANCED = `${IFRAME_ALLOW} camera; microphone;`;

// These templates use zoomUrl (they should remain alphabetically sorted)
// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
// @debt unify this with ZOOM_URL_TEMPLATES in functions/venue.js + share the same code between frontend/backend
export const ZOOM_URL_TEMPLATES = Object.freeze([VenueTemplate.zoomroom]);

// These templates use iframeUrl (they should remain alphabetically sorted)
// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
// @debt unify this with IFRAME_TEMPLATES in functions/venue.js + share the same code between frontend/backend
export const IFRAME_TEMPLATES = Object.freeze([
  VenueTemplate.artpiece,
  VenueTemplate.auditorium,
  VenueTemplate.embeddable,
  VenueTemplate.firebarrel,
  VenueTemplate.jazzbar,
  VenueTemplate.posterpage,
]);

export const EMBEDDABLE_CONTENT_TEMPLATES = Object.freeze([
  ...IFRAME_TEMPLATES,
  ...ZOOM_URL_TEMPLATES,
]);

// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
export const BACKGROUND_IMG_TEMPLATES = [VenueTemplate.partymap];

// @debt Refactor this constant into types/venues + create an actual custom type grouping for it
export const SUBVENUE_TEMPLATES = [VenueTemplate.partymap];

export const COVERT_ROOM_TYPES: RoomType[] = [
  RoomType.unclickable,
  RoomType.mapFrame,
];

// @debt Refactor this constant into types/templates or similar?
export interface Template {
  template: VenueTemplate;
  name: string;
  description: Array<string>;
}

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
export const HAS_ROOMS_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.partymap,
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
export const HAS_GRID_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.partymap,
];

// @debt Refactor this constant into types/templates + create an actual custom type grouping for it
// @debt unify this with HAS_REACTIONS_TEMPLATES in functions/venue.js + share the same code between frontend/backend
export const HAS_REACTIONS_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.auditorium,
  VenueTemplate.jazzbar,
];

export const CHAT_MESSAGE_TIMEOUT = 500;

export const REACTION_TIMEOUT = 5000; // time in ms
export const SHOW_EMOJI_IN_REACTION_PAGE = true;
export const DEFAULT_SHOW_SHOUTOUTS = true;
export const DEFAULT_SHOW_REACTIONS = true;
export const DEFAULT_REACTIONS_MUTED = false;
export const DEFAULT_SHOW_CONTENT = true;

export const DEFAULT_CAMERA_ENABLED = true;

export const DEFAULT_SHOW_USER_STATUSES = true;

// Max questions number for Poll inside Chat
export const MAX_POLL_QUESTIONS = 8;

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

export const EVENT_STARTING_SOON_TIMEFRAME = 120; // in minutes

export const EVENTS_PREVIEW_LIST_LENGTH = 50;

// Set these to have images uploaded to Firebase Storage served off of Imgix
// @debt load this from an env variable. This is good enough for Burning Man but we want to have env-specific conf
export const FIREBASE_STORAGE_IMAGES_ORIGIN =
  "https://firebasestorage.googleapis.com/v0/b/sparkle-burn.appspot.com/o/";
export const FIREBASE_STORAGE_IMAGES_IMGIX_URL =
  "https://sparkle-burn-users.imgix.net/";

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

export const DEFAULT_SAFE_ZONE = { width: 100.0, height: 100.0 };
Object.freeze(DEFAULT_SAFE_ZONE);

// JS constants derived and in sync with their SCSS constants
// "scss/attendee/layout";
export const SCSS_SPACE_PORTAL_EVENT_WIDTH = 180;
// Configurable - allow for the top and bottom UI. Ideally, this would come from CSS
export const PARTY_MAP_VERTICAL_PAD = 0;

// The min/max for the maximum number of booths a space can contain
export const MIN_MAX_BOOTHS = 1;
// Firebase has a limit of how many values can be provided to an IN query. Due
// to how we query for presence data we cap the number of booths to this limit.
export const MAX_MAX_BOOTHS = 10;
