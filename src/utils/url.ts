import { CampVenue } from "types/CampVenue";
import { AnyVenue } from "types/Firestore";
import { WithId } from "./id";

export const venueLandingUrl = (venueId: string) => {
  return `/v/${venueId}`;
};

export const venueInsideUrl = (venueId: string) => {
  return `/in/${venueId}`;
};

export const venuePreviewUrl = (venueId: string, roomTitle: string) => {
  return `${venueInsideUrl(venueId)}/${roomTitle}`;
};

export const venueEntranceUrl = (venueId: string, step?: number) => {
  return `/e/${step ?? 1}/${venueId}`;
};

export const venueRoomUrl = (venue: WithId<AnyVenue>, roomTitle: string) => {
  const venueRoom = (venue as CampVenue)?.rooms.find(
    (r) => r.title === roomTitle
  );
  return venueRoom ? venueRoom.url : venueInsideUrl(venue.id);
};
