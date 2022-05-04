// use this constant to signal a DB query should wait for complete data
// must be a symbol to keep it unique throughout the life of this program
import { DeferredAction } from "types/id";

export const DEFERRED = Symbol("deferred action") as DeferredAction;

export const KEY_INVALID_PREFIX = "INVALID-FIRESTORE-KEY-";

// constants for the collections, just in case some get renamed (e.g. venues->spaces)
export const COLLECTION_EXPERIMENTS = "experiments";
export const COLLECTION_PRIVATE_CHATS = "privatechats";
export const COLLECTION_RETUNABLE_MEDIA_ELEMENTS = "retunableMediaElements";
export const COLLECTION_ROLES = "roles";
export const COLLECTION_SEATED_USERS = "seatedUsers";
export const COLLECTION_SEATED_USERS_CHECKINS = "recentSeatedUsers";
export const COLLECTION_SECTIONS = "sections";
export const COLLECTION_SETTINGS = "settings";
export const COLLECTION_SPACE_CHATS = "chats";
export const COLLECTION_SPACE_EVENTS = "events";
export const COLLECTION_SPACES = "venues";
export const COLLECTION_USER_PRESENCE = "userPresence";
export const COLLECTION_USERS = "users";
export const COLLECTION_WORLDS = "worlds";
export const COLLECTION_WORLD_EVENTS = "worldEvents";
export const COLLECTION_ONBOARDED_WORLDS = "onboardedWorlds";

// common search fields, please keep the list short and simple
export const FIELD_HIDDEN = "isHidden";
export const FIELD_OWNERS = "owners";
export const FIELD_SLUG = "slug";
export const FIELD_SPACE_ID = "spaceId";
export const FIELD_WORLD_ID = "worldId";

// some common constant paths for queries to avoid `useMemo`
// it's a single constant rather a bunch of exports because of the code that follows
// please name them as they're found in DB and sort them alphabetically
export const PATH = {
  rolesAdmin: [COLLECTION_ROLES, "admin"],
  spaces: [COLLECTION_SPACES],
  worldEvents: [COLLECTION_WORLD_EVENTS],
  worlds: [COLLECTION_WORLDS],
};

// this is a short robust way to ensure those shared paths are in deed constant
Object.freeze(PATH);
for (const path of Object.values(PATH)) {
  Object.freeze(path);
}
