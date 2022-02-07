import { VenueIdSchema } from "../types/venue";

export const VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;
const INVALID_SLUG_CHARS_REGEX = /[^a-zA-Z0-9]/g;

export const generateSlug = (name: string) =>
  name.replace(INVALID_SLUG_CHARS_REGEX, "").toLowerCase();

export const checkIfValidVenueId = (venueId: string) =>
  VenueIdSchema.isValidSync(venueId);
