import { PLAYA_VENUE_NAME } from "settings";

export const venueLandingUrl = (venueId: string) => {
  return `/v/${venueId}`;
};

export const venueInsideUrl = (venueId: string) => {
  return `/in/${venueId}`;
};

export const venuePlayaPreviewUrl = (venueId: string) => {
  return `${venueInsideUrl(PLAYA_VENUE_NAME.toLowerCase())}/${venueId}`;
};

export const venuePreviewUrl = (venueId: string, roomTitle: string) => {
  return `${venueInsideUrl(venueId)}/${roomTitle}`;
};
