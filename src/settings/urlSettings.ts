export const VALID_URL_PROTOCOLS = Object.freeze(["http:", "https:"]);

// External Sparkle URLs
export const EXTERNAL_SPARKLE_HOMEPAGE_URL = "https://sparklespaces.com/";
export const EXTERNAL_SPARKLE_TOC_URL =
  "https://sparklespaces.com/terms-of-use/";
export const EXTERNAL_SPARKLE_PRIVACY_POLICY =
  "https://sparklespaces.com/privacy-policy/";

export const EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL = "https://sparklever.se/";

export const EXTERNAL_SPARKLEVERSITY_URL =
  "https://sparklever.se/sparkleversity";
export const EXTERNAL_SPARKLEVERSE_COMMUNITY_URL =
  "https://www.facebook.com/groups/sparkleverse/";

// NOTE: URLs ending with _PARAM_URL aren't meant for direct browser consumption but React router
// NOTE: URLs ending with _ROOT_URL are the bases for sub-routers and URLs used inside them
// NOTE: URLs ending with _BASE_URL are the bases for other (often parametrized) URLs, but not at subrouter level

// Top level and attendee URLs
export const ROOT_URL = "/";

export const ACCOUNT_ROOT_URL = "/account";
export const ADMIN_V1_ROOT_URL = "/a1";
export const ADMIN_V3_ROOT_URL = "/admin";
export const ENTER_ROOT_URL = "/enter";
export const ENTRANCE_BASE_URL = "/e";
export const LOGIN_BASE_URL = `/login`;
export const SPARKLEVERSE_REDIRECT_URL = "/sparkleverse";
export const VERSION_URL = "/version";
export const VENUE_EMERGENCY_BASE_URL = "/m";
export const VENUE_INSIDE_BASE_URL = "/in";
export const VENUE_LANDING_BASE_URL = "/v";
export const VENUE_REDIRECT_BASE_URL = `/venue`;
export const WORLD_ROOT_URL = "/w";

export const VENUE_EMERGENCY_PARAM_URL = `${VENUE_EMERGENCY_BASE_URL}/:venueId`;
export const VENUE_INSIDE_PARAM_URL = `${VENUE_INSIDE_BASE_URL}/:venueId`;
export const VENUE_INSIDE_ADMIN_PARAM_URL = `${VENUE_INSIDE_BASE_URL}/:venueId/admin`;
export const VENUE_LANDING_PARAM_URL = `${VENUE_LANDING_BASE_URL}/:venueId`;
export const VENUE_REDIRECT_PARAM_URL = `${VENUE_REDIRECT_BASE_URL}/*`;

export const ENTRANCE_STEP_VENUE_PARAM_URL = `${ENTRANCE_BASE_URL}/:step/:venueId`;
export const LOGIN_CUSTOM_TOKEN_PARAM_URL = `${LOGIN_BASE_URL}/:venueId/:customToken`;

// Account URLs
export const ACCOUNT_CODE_URL = `${ACCOUNT_ROOT_URL}/code-of-conduct`;
export const ACCOUNT_PROFILE_URL = `${ACCOUNT_ROOT_URL}/profile`;
export const ACCOUNT_QUESTIONS_URL = `${ACCOUNT_ROOT_URL}/questions`;

// Admin v3 URLs
export const ADMIN_V3_CREATE_PARAM_URL = `${ADMIN_V3_ROOT_URL}/create/venue/:worldId`;
export const ADMIN_V3_EDIT_PARAM_URL = `${ADMIN_V3_ROOT_URL}/edit/:venueId`;
export const ADMIN_V3_VENUE_PARAM_URL = `${ADMIN_V3_ROOT_URL}/venue/:venueId?/:selectedTab?`;
export const ADMIN_V3_ADVANCED_PARAM_URL = `${ADMIN_V3_ROOT_URL}/advanced-settings/:venueId?/:selectedTab?`;

export const ADMIN_V3_WORLDS_BASE_URL = `${ADMIN_V3_ROOT_URL}/worlds`;
export const ADMIN_V3_NEW_WORLD_URL = `${ADMIN_V3_WORLDS_BASE_URL}/new`;
export const ADMIN_V3_OLD_WORLD_PARAM_URL = `${ADMIN_V3_WORLDS_BASE_URL}/old/:worldId?/:selectedTab?`;
export const ADMIN_V3_WORLD_SPACES_PARAM_URL = `${ADMIN_V3_WORLDS_BASE_URL}/:worldId?/spaces`;

// Admin v1 URLs
export const ADMIN_V1_CREATE_URL = `${ADMIN_V1_ROOT_URL}/venue/creation`;

export const ADMIN_V1_EDIT_BASE_URL = `${ADMIN_V1_ROOT_URL}/venue/edit`;
export const ADMIN_V1_EDIT_PARAM_URL = `${ADMIN_V1_EDIT_BASE_URL}/:venueId`;

export const ADMIN_V1_VENUE_PARAM_URL = `${ADMIN_V1_ROOT_URL}/:venueId`;

export const ADMIN_V1_ROOMS_BASE_URL = `${ADMIN_V1_ROOT_URL}/venue/rooms`;
export const ADMIN_V1_ROOMS_PARAM_URL = `${ADMIN_V1_ROOMS_BASE_URL}/:venueId`;

// Enter URLs
export const ENTER_STEP_1_URL = `${ENTER_ROOT_URL}/step1`;
export const ENTER_STEP_2_URL = `${ENTER_ROOT_URL}/step2`;
export const ENTER_STEP_3_URL = `${ENTER_ROOT_URL}/step3`;
export const ENTER_STEP_4_URL = `${ENTER_ROOT_URL}/step4`;
export const ENTER_STEP_5_URL = `${ENTER_ROOT_URL}/step5`;
export const ENTER_STEP_6A_URL = `${ENTER_ROOT_URL}/step6a`;
export const ENTER_STEP_6B_URL = `${ENTER_ROOT_URL}/step6b`;
