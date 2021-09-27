import { VenueIdSchema } from "../types/venue";

export const VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;

export const getVenueId = (name: string) => {
  return name.replace(/\W/g, "").toLowerCase();
};

export const checkIfValidVenueId = (venueId: string) =>
  VenueIdSchema.isValidSync(venueId);
