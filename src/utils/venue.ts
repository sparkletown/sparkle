import { Venue } from "types/Venue";
import { User } from "types/User";
import { isCampVenue } from "types/CampVenue";
import {
  SUBVENUE_TEMPLATES,
  PLAYA_TEMPLATES,
  PLACEABLE_VENUE_TEMPLATES,
} from "settings";
import { WithId } from "./id";

export const canHaveEvents = (venue: Venue): boolean =>
  PLACEABLE_VENUE_TEMPLATES.includes(venue.template);

export const canHaveSubvenues = (venue: Venue): boolean =>
  SUBVENUE_TEMPLATES.includes(venue.template);

export const canBeDeleted = (venue: Venue): boolean =>
  !PLAYA_TEMPLATES.includes(venue.template);

export const canHavePlacement = (venue: Venue): boolean =>
  PLAYA_TEMPLATES.includes(venue.template);

export const peopleAttending = (
  users: Array<WithId<User>> | undefined,
  venue: Venue
) =>
  users
    ?.filter((u) => u.id !== undefined)
    .filter((p) =>
      [
        venue.name,
        ...(isCampVenue(venue) ? venue.rooms?.map((r) => r.title) : []),
      ].includes(p.lastSeenIn)
    );
