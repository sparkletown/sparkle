export const VALID_URL_PROTOCOLS = ["http:", "https:"];

export const ADMIN_V1_ROOT_URL = "/badmin";
export const ADMIN_V3_ROOT_URL = "/admin";

export const ADMIN_V1_CREATE_URL = `${ADMIN_V1_ROOT_URL}/venue/creation`;
export const ADMIN_V1_EDIT_URL = `${ADMIN_V1_ROOT_URL}/admin/venue/edit/:venueId`;
export const ADMIN_V1_VENUE_URL = `${ADMIN_V1_ROOT_URL}/:venueId`;
export const ADMIN_V1_ROOMS_URL = `${ADMIN_V1_ROOT_URL}/venue/rooms/:venueId`;

export const ADMIN_V3_CREATE_URL = `${ADMIN_V3_ROOT_URL}/create/venue`;
export const ADMIN_V3_EDIT_URL = `${ADMIN_V3_ROOT_URL}/edit/:venueId`;
export const ADMIN_V3_VENUE_URL = `${ADMIN_V3_ROOT_URL}/venue/:venueId?/:selectedTab?`;
export const ADMIN_V3_ADVANCED_URL = `${ADMIN_V3_ROOT_URL}/advanced-settings/:venueId?/:selectedTab?`;
