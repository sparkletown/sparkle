import Bugsnag from "@bugsnag/js";
import { CODE_CHECK_URL } from "secrets";
import { VALID_URL_PROTOCOLS } from "settings";
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

export const isExternalUrl = (url: string) =>
  url.includes("http") &&
  window.location.host !== new URL(getRoomUrl(url)).host;

// @debt I feel like we could construct this url in a better way
export const getRoomUrl = (roomUrl: string) =>
  roomUrl.includes("http") ? roomUrl : "//" + roomUrl;

export const openRoomUrl = (url: string) => {
  openUrl(getRoomUrl(url));
};

export const openUrl = (url: string) => {
  if (!isValidUrl(url)) {
    Bugsnag.notify(
      new Error(`Invalid URL ${url} on page ${window.location.href}; ignoring`),
      (event) => {
        event.addMetadata("utils/url::openUrl", { url });
      }
    );
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

export const isValidUrl = (url: string): boolean => {
  try {
    return VALID_URL_PROTOCOLS.includes(new URL(url).protocol);
  } catch (e) {
    if (e.name === "TypeError") {
      return false;
    }
    throw e;
  }
};

export const externalUrlAdditionalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export const getExtraLinkProps = (isExternal: boolean) =>
  isExternal ? externalUrlAdditionalProps : {};

export const codeCheckUrl = (code: string) => CODE_CHECK_URL + code;
