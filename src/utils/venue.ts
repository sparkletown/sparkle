import { VenueTemplate } from "types/VenueTemplate";
import { Venue } from "types/Venue";
import { User } from "types/User";
import { AnyVenue } from "types/Firestore";
import { CampVenue } from "types/CampVenue";

export const canHaveSubvenues = (venue: Venue): boolean =>
  [VenueTemplate.themecamp, VenueTemplate.partymap].includes(venue.template);

export const hasRooms = (venue: AnyVenue): venue is CampVenue =>
  "rooms" in venue;

export const peopleAttending = <T extends User>(
  users: Array<T> | undefined,
  venue: Venue
) =>
  users?.filter((p) =>
    [
      venue.name,
      ...(hasRooms(venue) ? venue.rooms?.map((r) => r.title) : []),
    ].includes(p.lastSeenIn)
  );
