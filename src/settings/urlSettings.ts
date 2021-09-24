export const VALID_URL_PROTOCOLS = Object.freeze(["http:", "https:"]);

// NOTE: URLs named with _PARAM_ aren't meant for direct browser consumption but React router

// Root admin URLs
export const ADMIN_ROOT_URL = "/admin";
export const ADMIN_V1_ROOT_URL = "/a1";
export const ADMIN_V3_ROOT_URL = "/a3";

// V1 URLs
export const ADMIN_V1_CREATE_URL = `${ADMIN_V1_ROOT_URL}/venue/creation`;

export const ADMIN_V1_EDIT_URL = `${ADMIN_V1_ROOT_URL}/venue/edit`;
export const ADMIN_V1_EDIT_PARAM_URL = `${ADMIN_V1_EDIT_URL}/:venueId`;

export const ADMIN_V1_VENUE_PARAM_URL = `${ADMIN_V1_ROOT_URL}/:venueId`;

export const ADMIN_V1_ROOMS_URL = `${ADMIN_V1_ROOT_URL}/venue/rooms`;
export const ADMIN_V1_ROOMS_PARAM_URL = `${ADMIN_V1_ROOMS_URL}/:venueId`;

// V3 URLs
export const ADMIN_V3_CREATE_URL = `${ADMIN_V3_ROOT_URL}/create/venue`;
export const ADMIN_V3_EDIT_PARAM_URL = `${ADMIN_V3_ROOT_URL}/edit/:venueId`;
export const ADMIN_V3_VENUE_PARAM_URL = `${ADMIN_V3_ROOT_URL}/venue/:venueId?/:selectedTab?`;
export const ADMIN_V3_ADVANCED_PARAM_URL = `${ADMIN_V3_ROOT_URL}/advanced-settings/:venueId?/:selectedTab?`;
