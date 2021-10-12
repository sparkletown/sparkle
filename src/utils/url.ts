import { generatePath } from "react-router";
import Bugsnag from "@bugsnag/js";

import {
  ADMIN_ROOT_URL,
  ADMIN_V1_ROOT_URL,
  ADMIN_V3_ADVANCED_PARAM_URL,
  ADMIN_V3_CREATE_PARAM_URL,
  ADMIN_V3_OLD_WORLD_PARAM_URL,
  ADMIN_V3_ROOT_URL,
  ADMIN_V3_VENUE_PARAM_URL,
  ADMIN_V3_WORLD_SPACES_PARAM_URL,
  ENTRANCE_ROOT_URL,
  VALID_URL_PROTOCOLS,
  WORLD_ROOT_URL,
} from "settings";

import { Settings } from "types/settings";

export const venueLandingUrl = (venueId: string) => {
  return `/v/${venueId}`;
};

export const venueInsideUrl = (venueId: string) => {
  return `/in/${venueId}`;
};

export const adminNGVenueUrl = (venueId?: string, selectedTab?: string) =>
  generatePath(ADMIN_V3_VENUE_PARAM_URL, { venueId, selectedTab });

export const adminNGSettingsUrl = (venueId?: string, selectedTab?: string) =>
  generatePath(ADMIN_V3_ADVANCED_PARAM_URL, { venueId, selectedTab });

export const adminWorldUrl = (worldId?: string, selectedTab?: string) =>
  generatePath(ADMIN_V3_OLD_WORLD_PARAM_URL, { worldId, selectedTab });

export const adminCreateWorldSpace = (worldId?: string) =>
  generatePath(ADMIN_V3_CREATE_PARAM_URL, { worldId });

export const adminWorldSpacesUrl = (worldId?: string) =>
  generatePath(ADMIN_V3_WORLD_SPACES_PARAM_URL, { worldId });

export const venuePreviewUrl = (venueId: string, roomTitle: string) => {
  return `${venueInsideUrl(venueId)}/${roomTitle}`;
};

export const venueEntranceUrl = (venueId: string, step?: number) => {
  return `${ENTRANCE_ROOT_URL}/${step ?? 1}/${venueId}`;
};

export const worldUrl = (id: string) => `${WORLD_ROOT_URL}/${id}`;

export const simpleViewUrl = (venueId: string) => `/m/${venueId}`;

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

// @debt I feel like we could construct this url in a better way
export const getRoomUrl = (roomUrl: string) =>
  roomUrl.includes("http") ? roomUrl : "//" + roomUrl;

export const openRoomUrl = (url: string, options?: OpenUrlOptions) => {
  openUrl(getRoomUrl(url), options);
};

export const enterVenue = (venueId: string, options?: OpenUrlOptions) =>
  openUrl(venueInsideUrl(venueId), options);

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

export const getFullVenueInsideUrl = (venueId: string) =>
  new URL(venueInsideUrl(venueId), window.location.origin).href;

export const getUrlWithoutTrailingSlash = (url: string) => {
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const getLastUrlParam = (url: string) => {
  return url.split("/").slice(-1);
};

export const getUrlParamFromString = (data: string) => {
  return data.replaceAll(" ", "").toLowerCase();
};

export const resolveAdminRootUrl: (settings: Partial<Settings>) => string = ({
  enableAdmin1,
  enableAdmin3,
  adminVersion,
}) => {
  // Tie breaker for when both admins are enabled.
  // Currently only two exist, so anything other than explicit 3 defaults to 1
  if (enableAdmin1 && enableAdmin3) {
    // easier to compare to just a string
    return `${adminVersion}` === "3" ? ADMIN_V3_ROOT_URL : ADMIN_V1_ROOT_URL;
  }

  if (enableAdmin3) return ADMIN_V3_ROOT_URL;
  if (enableAdmin1) return ADMIN_V1_ROOT_URL;

  // No versions are enabled, just return the default even if it fails with 401, 403, 404
  return ADMIN_ROOT_URL;
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
