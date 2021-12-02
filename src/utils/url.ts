import { generatePath } from "react-router";
import Bugsnag from "@bugsnag/js";

import {
  ACCOUNT_CODE_QUESTIONS_URL,
  ACCOUNT_PROFILE_QUESTIONS_URL,
  ACCOUNT_PROFILE_VENUE_PARAM_URL,
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  ADMIN_V3_CREATE_PARAM_URL,
  ADMIN_V3_SPACE_SETTINGS_PARAM_URL,
  ADMIN_V3_WORLD_EDIT_PARAM_URL,
  ATTENDEE_SPACE_INSIDE_URL,
  ATTENDEE_SPACE_LANDING_URL,
  EMPTY_SPACE_SLUG,
  EMPTY_WORLD_SLUG,
  ENTRANCE_STEP_VENUE_PARAM_URL,
  VALID_URL_PROTOCOLS,
  WORLD_ROOT_URL,
} from "settings";

import { Room } from "types/rooms";
import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

// @debt most of these (a,b,c)=>generatePath(PATH,{}) function should be just inlined where called
// like to={generatePath(params)} or actually have logic inside them that deals with missing params

const DEFAULT_MISSING_PARAM_URL = "#";

export const generateAdminIaSpacePath = (worldSlug?: string) =>
  !worldSlug ? "" : generatePath(ADMIN_IA_SPACE_BASE_PARAM_URL, { worldSlug });

export const adminNGVenueUrl = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug,
  selectedTab?: string
) =>
  !worldSlug || !spaceSlug
    ? DEFAULT_MISSING_PARAM_URL
    : generatePath(ADMIN_IA_SPACE_EDIT_PARAM_URL, {
        worldSlug,
        spaceSlug,
        selectedTab,
      });

export const adminNGSettingsUrl = (spaceSlug?: string, selectedTab?: string) =>
  generatePath(ADMIN_V3_SPACE_SETTINGS_PARAM_URL, { spaceSlug, selectedTab });

export const adminWorldUrl = (worldSlug?: string, selectedTab?: string) =>
  generatePath(ADMIN_V3_WORLD_EDIT_PARAM_URL, { worldSlug, selectedTab });

export const adminCreateWorldSpace = (worldSlug?: string) =>
  worldSlug
    ? generatePath(ADMIN_V3_CREATE_PARAM_URL, { worldSlug })
    : DEFAULT_MISSING_PARAM_URL;

export const adminCreateSpace = (worldSlug?: string) =>
  worldSlug
    ? generatePath(ADMIN_IA_SPACE_CREATE_PARAM_URL, { worldSlug })
    : DEFAULT_MISSING_PARAM_URL;

export const adminWorldSpacesUrl = (worldSlug?: string) =>
  generatePath(ADMIN_IA_WORLD_PARAM_URL, { worldSlug });

// TODO Figure out a better way of handling these being optional throughout.
export const attendeeSpaceInsideUrl = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug
) => generatePath(ATTENDEE_SPACE_INSIDE_URL, { worldSlug, spaceSlug });

// TODO Figure out a better way of handling these being optional throughout.
export const attendeeSpaceLandingUrl = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug
) => generatePath(ATTENDEE_SPACE_LANDING_URL, { worldSlug, spaceSlug });

export const getAbsoluteAttendeeSpaceInsideUrl = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug
) =>
  // TODO Figure out a better way of handling these being optional throughout.
  new URL(
    attendeeSpaceInsideUrl(
      worldSlug ?? EMPTY_WORLD_SLUG,
      spaceSlug ?? EMPTY_SPACE_SLUG
    ),
    window.location.origin
  ).href;

export const accountProfileUrlWithSlug = (
  worldSlug: WorldSlug,
  spaceSlug: SpaceSlug
) => {
  // @debt remove query param in favor of path param and/or
  // add comprehensive `redirect` solution project-wide
  return generatePath(ACCOUNT_PROFILE_VENUE_PARAM_URL, {
    spaceSlug,
    worldSlug,
  });
};

export const accountCodeQuestionsUrl = (
  worldSlug: WorldSlug,
  spaceSlug: SpaceSlug
) => {
  return generatePath(ACCOUNT_CODE_QUESTIONS_URL, { worldSlug, spaceSlug });
};

export const accountProfileQuestionsUrl = (
  worldSlug: WorldSlug,
  spaceSlug: SpaceSlug
) => {
  return generatePath(ACCOUNT_PROFILE_QUESTIONS_URL, { worldSlug, spaceSlug });
};

export const venueEntranceUrl = (
  worldSlug: WorldSlug,
  spaceSlug: SpaceSlug,
  step?: number
) => {
  return generatePath(ENTRANCE_STEP_VENUE_PARAM_URL, {
    worldSlug,
    spaceSlug,
    step: step ?? 1,
  });
};

// @debt combine with accountProfileUrlWithSlug
export const accountProfileVenueUrl = (
  worldSlug: WorldSlug,
  spaceSlug: SpaceSlug
) => generatePath(ACCOUNT_PROFILE_VENUE_PARAM_URL, { worldSlug, spaceSlug });

export const worldUrl = (id: string) => `${WORLD_ROOT_URL}/${id}`;

export const isExternalUrl = (url: string) => {
  try {
    return new URL(url, window.location.origin).host !== window.location.host;
  } catch (error) {
    Bugsnag.notify(new Error(error), (event) => {
      event.severity = "info";
      event.addMetadata("utils::url::isExternalUrl", { url });
    });
    return false;
  }
};

export const isExternalPortal: (portal: Room) => boolean = (portal) =>
  portal?.template === "external" || portal?.url.startsWith("http");

export const openRoomUrl = (url: string, options?: OpenUrlOptions) => {
  // @debt I feel like we could construct this url in a better way
  openUrl(url.includes("http") ? url : "//" + url, options);
};

export const enterVenue = (
  worldSlug: WorldSlug,
  spaceSlug: SpaceSlug,
  options?: OpenUrlOptions
) => openUrl(attendeeSpaceInsideUrl(worldSlug, spaceSlug), options);

export interface OpenUrlOptions {
  customOpenRelativeUrl?: (url: string) => void;
  customOpenExternalUrl?: (url: string) => void;
}

export const openUrl = (url: string, options?: OpenUrlOptions) => {
  const { customOpenExternalUrl, customOpenRelativeUrl } = options ?? {};

  // @debt possible replace with isValidUrl, see isCurrentLocationValidUrl for deprecation comments
  if (!isCurrentLocationValidUrl(url)) {
    Bugsnag.notify(
      // new Error(`Invalid URL ${url} on page ${window.location.href}; ignoring`),
      new Error(
        `Invalid URL ${url} on page ${window.location.href}; allowing for now (workaround)`
      ),
      (event) => {
        event.addMetadata("context", { func: "utils/url::openUrl", url });
      }
    );
    // @debt keep the checking in place so we can debug further, but don't block attempts to open
    // return;
  }

  if (isExternalUrl(url)) {
    customOpenExternalUrl
      ? customOpenExternalUrl(url)
      : window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // @debt Is this a decent enough way to use react router here? Should we just use it always and get rid of window.location.href?
    customOpenRelativeUrl
      ? customOpenRelativeUrl(url)
      : (window.location.href = url);
  }
};

/**
 * @deprecated This function doesn't perform a url check and returns true each time;
 * Use isValidUrl instead if you want to validate that URL is correct
 */
export const isCurrentLocationValidUrl = (url: string): boolean => {
  try {
    return VALID_URL_PROTOCOLS.includes(
      new URL(url, window.location.origin).protocol
    );
  } catch (e) {
    if (e.name === "TypeError") {
      return false;
    }
    throw e;
  }
};

export const isValidUrl = (urlString: string) => {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);

    return VALID_URL_PROTOCOLS.includes(url.protocol);
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

// TODO delete the below completely
/*export const getFullVenueInsideUrl = (spaceSlug: string) =>
  new URL(venueInsideUrl(spaceSlug), window.location.origin).href;
  */

export const getUrlWithoutTrailingSlash = (url: string) => {
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const getLastUrlParam = (url: string) => {
  return url.split("/").slice(-1);
};

export const getUrlParamFromString = (data: string) => {
  return data.replaceAll(" ", "").toLowerCase();
};

export const resolveUrlPath: (path: string) => string = (path) => {
  const base = window.location.href;
  try {
    return new URL(path, base).href;
  } catch (error) {
    Bugsnag.notify(new Error(error), (event) => {
      event.severity = "info";
      event.addMetadata("utils/url::resolveUrlPath", { path, base });
    });
    return "";
  }
};
