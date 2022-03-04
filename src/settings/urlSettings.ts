import { SpaceSlug, WorldSlug } from "types/id";

export const DEFAULT_SPACE_SLUG = "bootstrap" as SpaceSlug;
export const DEFAULT_WORLD_SLUG = "bootstrap" as WorldSlug;
export const DEFAULT_ENTER_STEP = "1";

export const DEFAULT_MISSING_PARAM_URL = "#";

export const VALID_URL_PROTOCOLS = Object.freeze(["https:"]);

// External URLs
export const EXTERNAL_WEBGL_CHECK_URL = "https://webglreport.com/?v=2";

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
// NOTE: URLs ending with _BASE_URL are the bases for other (often parametrized) URLs, but not at sub-router level

// Top level URLs
export const ROOT_URL = "/";

export const ACCOUNT_ROOT_URL = "/account";
export const ADMIN_ROOT_URL = "/admin";
export const SPARKLEVERSE_REDIRECT_URL = "/sparkleverse";
export const VERSION_URL = "/version";

// Attendee URLs
const EMERGENCY_BASE_URL = "/m";
const INSIDE_BASE_URL = "/in";
const LANDING_BASE_URL = "/v";
const ENTRANCE_BASE_URL = "/e";
const LOGIN_BASE_URL = `/login`;

export const ATTENDEE_EMERGENCY_PARAM_URL = `${EMERGENCY_BASE_URL}/w/:worldSlug/s/:spaceSlug`;
export const ATTENDEE_INSIDE_URL = `${INSIDE_BASE_URL}/w/:worldSlug/s/:spaceSlug`;
export const ATTENDEE_LANDING_URL = `${LANDING_BASE_URL}/w/:worldSlug/s/:spaceSlug`;
export const ATTENDEE_STEPPING_PARAM_URL = `${ENTRANCE_BASE_URL}/w/:worldSlug/s/:spaceSlug/:step`;

// @debt I don't think we support custom tokens right now. Probably remove this.
export const LOGIN_CUSTOM_TOKEN_PARAM_URL = `${LOGIN_BASE_URL}/:spaceSlug/:customToken`;

// Account URLs
export const ACCOUNT_CODE_QUESTIONS_URL = `${ACCOUNT_ROOT_URL}/code-of-conduct/:worldSlug/:spaceSlug?`;
export const ACCOUNT_PROFILE_BASE_URL = `${ACCOUNT_ROOT_URL}/profile`;
export const ACCOUNT_PROFILE_VENUE_PARAM_URL = `${ACCOUNT_PROFILE_BASE_URL}/:worldSlug/:spaceSlug?`;
export const ACCOUNT_PROFILE_QUESTIONS_URL = `${ACCOUNT_ROOT_URL}/questions/:worldSlug/:spaceSlug?`;

// Admin IA URLs
export const ADMIN_IA_WORLD_BASE_URL = `${ADMIN_ROOT_URL}/w`; // e.g. /admin/w
export const ADMIN_IA_WORLD_CREATE_URL = `${ADMIN_ROOT_URL}/create-world`; // e.g. /admin/create-world
export const ADMIN_IA_WORLD_PARAM_URL = `${ADMIN_IA_WORLD_BASE_URL}/:worldSlug`; // e.g. /admin/w/world123
export const ADMIN_IA_WORLD_EDIT_PARAM_URL = `${ADMIN_IA_WORLD_PARAM_URL}/settings/:selectedTab?`; // e.g. /admin/w/world123/entrance
export const ADMIN_IA_SPACE_BASE_PARAM_URL = `${ADMIN_IA_WORLD_PARAM_URL}/s`; // e.g. /admin/w/world123/s
export const ADMIN_IA_SPACE_EDIT_PARAM_URL = `${ADMIN_IA_SPACE_BASE_PARAM_URL}/:spaceSlug?/:selectedTab?`; // e.g. /admin/w/world123/s/space456/timing
export const ADMIN_IA_SPACE_CREATE_PARAM_URL = `${ADMIN_IA_WORLD_PARAM_URL}/create-space`; // e.g. /admin/w/world123/create-space
// @debt this is in the wrong place completely
export const ADMIN_IA_SPACE_ADMIN_PARAM_URL = `${ADMIN_IA_SPACE_BASE_PARAM_URL}/:spaceSlug/admin`; // e.g. /admin/w/world123/s/space456/admin

export const ADMIN_IA_WORLD_SCHEDULE = `${ADMIN_IA_WORLD_PARAM_URL}/world-schedule`; // e.g. /admin/w/world123/world-schedule
export const ADMIN_IA_WORLD_USERS = `${ADMIN_IA_WORLD_PARAM_URL}/users`; // e.g. /admin/w/world123/users
export const ADMIN_IA_WORLD_REPORTS = `${ADMIN_IA_WORLD_PARAM_URL}/reports`; // e.g. /admin/w/world123/reports
export const ADMIN_IA_WORLD_SETTINGS = `${ADMIN_IA_WORLD_PARAM_URL}/settings`; // e.g. /admin/w/world123/settings

// @debt replace with real URLs
export const ABOUT_URL = "#about";
export const BLOG_URL = "#blog";
export const JOBS_URL = "#jobs";
export const PRESS_URL = "#press";
export const ACCESSIBILITY_URL = "#accessibility";
export const PARTNERS_URL = "#partners";
