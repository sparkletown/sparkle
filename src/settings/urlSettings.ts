export const VALID_URL_PROTOCOLS = Object.freeze(["http:", "https:"]);

// NOTE: URLs named with _PARAM_ aren't meant for direct browser consumption but React router

// Attendee URLs
export const ENTRANCE_ROOT_URL = "/e";
export const WORLD_ROOT_URL = "/w";

// Admin root URLs
export const ADMIN_ROOT_URL = "/admin";
export const ADMIN_V1_ROOT_URL = "/a1";
export const ADMIN_V3_ROOT_URL = "/a3";

// Admin v1 URLs
export const ADMIN_V1_CREATE_URL = `${ADMIN_V1_ROOT_URL}/venue/creation`;

export const ADMIN_V1_EDIT_URL = `${ADMIN_V1_ROOT_URL}/venue/edit`;
export const ADMIN_V1_EDIT_PARAM_URL = `${ADMIN_V1_EDIT_URL}/:venueId`;

export const ADMIN_V1_VENUE_PARAM_URL = `${ADMIN_V1_ROOT_URL}/:venueId`;

export const ADMIN_V1_ROOMS_URL = `${ADMIN_V1_ROOT_URL}/venue/rooms`;
export const ADMIN_V1_ROOMS_PARAM_URL = `${ADMIN_V1_ROOMS_URL}/:venueId`;

// Admin v3 URLs
export const ADMIN_V3_CREATE_PARAM_URL = `${ADMIN_V3_ROOT_URL}/create/venue/:worldId`;
export const ADMIN_V3_EDIT_PARAM_URL = `${ADMIN_V3_ROOT_URL}/edit/:venueId`;
export const ADMIN_V3_VENUE_PARAM_URL = `${ADMIN_V3_ROOT_URL}/venue/:venueId?/:selectedTab?`;
export const ADMIN_V3_ADVANCED_PARAM_URL = `${ADMIN_V3_ROOT_URL}/advanced-settings/:venueId?/:selectedTab?`;
export const ADMIN_V3_WORLDS_URL = `${ADMIN_V3_ROOT_URL}/worlds`;
export const ADMIN_V3_NEW_WORLD_URL = `${ADMIN_V3_WORLDS_URL}/new`;
export const ADMIN_V3_OLD_WORLD_PARAM_URL = `${ADMIN_V3_WORLDS_URL}/old/:worldId?/:selectedTab?`;
