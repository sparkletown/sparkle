export const VALID_URL_PROTOCOLS = Object.freeze(["https:"]);

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
export const ADMIN_OLD_ROOT_URL = "/a1";
export const ADMIN_ROOT_URL = "/admin";
export const ENTER_ROOT_URL = "/enter";
// TODO Next line needs updating with world slugs
export const ENTRANCE_BASE_URL = "/e";
export const LOGIN_BASE_URL = `/login`;
export const SPARKLEVERSE_REDIRECT_URL = "/sparkleverse";
export const VERSION_URL = "/version";
export const VENUE_EMERGENCY_BASE_URL = "/m";
export const SPACE_INSIDE_BASE_URL = "/in";
export const SPACE_LANDING_BASE_URL = "/land";
export const VENUE_REDIRECT_BASE_URL = `/venue`;
export const WORLD_ROOT_URL = "/w";

// TODO Next line needs addressing
export const VENUE_EMERGENCY_PARAM_URL = `${VENUE_EMERGENCY_BASE_URL}/:spaceSlug`;
export const ATTENDEE_SPACE_INSIDE_URL = `${SPACE_INSIDE_BASE_URL}/w/:worldSlug/s/:spaceSlug`;
export const ATTENDEE_SPACE_LANDING_URL = `${SPACE_LANDING_BASE_URL}/w/:worldSlug/s/:spaceSlug`;
// TODO Next line needs addressing
export const VENUE_REDIRECT_PARAM_URL = `${VENUE_REDIRECT_BASE_URL}/*`;

export const ENTRANCE_STEP_VENUE_PARAM_URL = `${ENTRANCE_BASE_URL}/:step/:spaceSlug`;
export const LOGIN_CUSTOM_TOKEN_PARAM_URL = `${LOGIN_BASE_URL}/:spaceSlug/:customToken`;

// Account URLs
export const ACCOUNT_CODE_QUESTIONS_URL = `${ACCOUNT_ROOT_URL}/code-of-conduct`;
export const ACCOUNT_PROFILE_BASE_URL = `${ACCOUNT_ROOT_URL}/profile`;
export const ACCOUNT_PROFILE_VENUE_PARAM_URL = `${ACCOUNT_PROFILE_BASE_URL}?spaceSlug=:spaceSlug&worldSlug=:worldSlug`;
export const ACCOUNT_PROFILE_QUESTIONS_URL = `${ACCOUNT_ROOT_URL}/questions`;

// @debt remove unused v3 URLs and rename the useful ones as IA
// Admin v3 URLs
export const ADMIN_V3_CREATE_PARAM_URL = `${ADMIN_ROOT_URL}/create/venue/:worldSlug?`;
export const ADMIN_V3_EDIT_PARAM_URL = `${ADMIN_ROOT_URL}/edit/:spaceSlug`;
export const ADMIN_V3_SPACE_SETTINGS_PARAM_URL = `${ADMIN_ROOT_URL}/settings/:spaceSlug?/:selectedTab?`;

export const ADMIN_V3_WORLD_BASE_URL = `${ADMIN_ROOT_URL}/worlds`;
export const ADMIN_V3_WORLD_CREATE_URL = `${ADMIN_V3_WORLD_BASE_URL}/new`;
export const ADMIN_V3_WORLD_EDIT_PARAM_URL = `${ADMIN_V3_WORLD_BASE_URL}/old/:worldSlug?/:selectedTab?`;

// Admin IA URLs
export const ADMIN_IA_WORLD_BASE_URL = `${ADMIN_ROOT_URL}/w`; // e.g. /admin/w
export const ADMIN_IA_WORLD_PARAM_URL = `${ADMIN_IA_WORLD_BASE_URL}/:worldSlug`; // e.g. /admin/w/world123
export const ADMIN_IA_WORLD_EDIT_PARAM_URL = `${ADMIN_IA_WORLD_PARAM_URL}/:selectedTab?`; // e.g. /admin/w/world123/entrance
export const ADMIN_IA_SPACE_BASE_PARAM_URL = `${ADMIN_IA_WORLD_PARAM_URL}/s`; // e.g. /admin/w/world123/s
export const ADMIN_IA_SPACE_EDIT_PARAM_URL = `${ADMIN_IA_SPACE_BASE_PARAM_URL}/:spaceSlug?/:selectedTab?`; // e.g. /admin/w/world123/s/space456/timing
export const ADMIN_IA_SPACE_CREATE_PARAM_URL = `${ADMIN_IA_WORLD_PARAM_URL}/create-space`; // e.g. /admin/w/world123/create-space

// @debt remove v1 URLs
// Admin v1 URLs
export const ADMIN_V1_CREATE_URL = `${ADMIN_OLD_ROOT_URL}/venue/creation`;
export const ADMIN_V1_EDIT_BASE_URL = `${ADMIN_OLD_ROOT_URL}/venue/edit`;
export const ADMIN_V1_EDIT_PARAM_URL = `${ADMIN_V1_EDIT_BASE_URL}/:spaceSlug`;
export const ADMIN_V1_VENUE_PARAM_URL = `${ADMIN_OLD_ROOT_URL}/:spaceSlug`;
export const ADMIN_V1_ROOMS_BASE_URL = `${ADMIN_OLD_ROOT_URL}/venue/rooms`;
export const ADMIN_V1_ROOMS_PARAM_URL = `${ADMIN_V1_ROOMS_BASE_URL}/:spaceSlug`;

// Enter URLs
export const ENTER_STEP_1_URL = `${ENTER_ROOT_URL}/step1`;
export const ENTER_STEP_2_URL = `${ENTER_ROOT_URL}/step2`;
export const ENTER_STEP_3_URL = `${ENTER_ROOT_URL}/step3`;
export const ENTER_STEP_4_URL = `${ENTER_ROOT_URL}/step4`;
export const ENTER_STEP_5_URL = `${ENTER_ROOT_URL}/step5`;
export const ENTER_STEP_6A_URL = `${ENTER_ROOT_URL}/step6a`;
export const ENTER_STEP_6B_URL = `${ENTER_ROOT_URL}/step6b`;
