import { getVenueRef } from "./venue";

export const getVenueEventCollectionRef = (venueId: string) =>
  getVenueRef(venueId).collection("events");
