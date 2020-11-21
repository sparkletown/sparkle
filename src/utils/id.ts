import { VenueEvent } from "types/VenueEvent";

export type WithId<T extends object> = T & { id: string };

export type WithVenueId<T extends object> = T & { venueId: string };

export const withVenueId = (
  event: VenueEvent,
  venueId: string
): WithVenueId<VenueEvent> => ({
  ...event,
  venueId,
});
