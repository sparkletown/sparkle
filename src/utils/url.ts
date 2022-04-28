import { generatePath } from "react-router";
import Bugsnag from "@bugsnag/js";

import {
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ATTENDEE_INSIDE_URL,
  DEFAULT_MISSING_PARAM_URL,
  VALID_URL_PROTOCOLS,
} from "settings";

import { SpaceSlug, WorldSlug } from "types/id";
import { Room } from "types/rooms";

import { errorForEmbed, errorType } from "utils/error";

// @debt most of these (a,b,c)=>generatePath(PATH,{}) functions should be replaced with inlined  generateUrl

type GenerateUrlParams = Record<string, string | undefined> | undefined;
type GenerateUrlOptions<T = GenerateUrlParams> = {
  route: string;
  fallback?: string;
  required?: string[];
  absolute?: boolean;
  params: T;
};

export const generateUrl: <T = GenerateUrlParams>(
  options: GenerateUrlOptions<T>
) => string = ({
  route,
  fallback = DEFAULT_MISSING_PARAM_URL,
  required = [],
  absolute = false,
  params,
}) => {
  // out of all the provided params
  const haystack = Object.entries(params);

  // check the required is there and has non-empty string as a value
  const invalidParam = (needle: string) =>
    !haystack.find(([name, value]) => name === needle && value);

  // and prevent generatePath blowing up with an error on missing or invalid param
  if (required.some(invalidParam)) {
    return fallback;
  }

  // NOTE: ?? {} stops TS from crying and the check makes the shorter generatePath is used
  const relativePath = params
    ? generatePath(route, params ?? {})
    : generatePath(route);

  // also be helpful with generating external links
  return absolute
    ? new URL(relativePath, window.location.origin).href
    : relativePath;
};

/** @deprecated use generateUrl instead */
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

type generateAttendeeInsideUrlOptions = {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
  absoluteUrl?: boolean;
};

// @debt These being optional is a problem waiting to happen. We need a better
// way of making world / space slug mandatory
/** @deprecated use generateUrl instead */
export const generateAttendeeInsideUrl = ({
  worldSlug,
  spaceSlug,
  absoluteUrl = false,
}: generateAttendeeInsideUrlOptions) => {
  const relativePath = generatePath(ATTENDEE_INSIDE_URL, {
    worldSlug,
    spaceSlug,
  });
  if (absoluteUrl) {
    return new URL(relativePath, window.location.origin).href;
  } else {
    return relativePath;
  }
};

export const isExternalUrl = (url: string) => {
  try {
    return new URL(url, window.location.origin).host !== window.location.host;
  } catch (e) {
    Bugsnag.notify(errorForEmbed(e), (event) => {
      event.severity = "info";
      event.addMetadata("utils::url::isExternalUrl", { url });
    });
    return false;
  }
};

export const isExternalPortal: (portal: Room) => boolean = (portal) =>
  portal?.template === "external" || !portal?.spaceId;

export const openRoomUrl = (url: string, options?: OpenUrlOptions) => {
  // @debt I feel like we could construct this url in a better way
  openUrl(url.includes("http") ? url : "//" + url, options);
};

export const enterSpace = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug,
  options?: OpenUrlOptions
) => openUrl(generateAttendeeInsideUrl({ worldSlug, spaceSlug }), options);

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
    const targetUrl = customOpenRelativeUrl
      ? extractLocalUrlPathname(url)
      : url;
    // @debt Is this a decent enough way to use react router here? Should we just use it always and get rid of window.location.href?
    customOpenRelativeUrl
      ? customOpenRelativeUrl(targetUrl)
      : (window.location.href = targetUrl);
  }
};

/**
 * @deprecated This function doesn't perform a url check and returns true each time;
 * Use isValidUrl instead if you want to validate that URL is correct
 */
export const isCurrentLocationValidUrl = (url: unknown): boolean => {
  // quickfix due to upgrade, entire function should be removed as it is deprecated
  const u = String(url ?? "");
  try {
    return VALID_URL_PROTOCOLS.includes(
      new URL(u, window.location.origin).protocol
    );
  } catch (e) {
    if (errorType(e) === "TypeError") {
      return false;
    }
    throw e;
  }
};

export const isValidUrl = (url: unknown) => {
  const urlString = String(url ?? "").trim();
  if (!urlString) return false;

  try {
    const urlObject = new URL(urlString);

    // @debt .begins() is better check than .includes() and should be used unless a RegExp is required
    return VALID_URL_PROTOCOLS.includes(urlObject.protocol);
  } catch (e) {
    if (errorType(e) === "TypeError") {
      return false;
    }
    throw e;
  }
};

export const externalUrlAdditionalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};
Object.freeze(externalUrlAdditionalProps);

export const getExtraLinkProps = (isExternal: boolean) =>
  isExternal ? externalUrlAdditionalProps : {};

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
  } catch (e) {
    Bugsnag.notify(errorForEmbed(e), (event) => {
      event.severity = "info";
      event.addMetadata("utils/url::resolveUrlPath", { path, base });
    });
    return "";
  }
};

export const extractLocalUrlPathname = (url: string) => {
  const { pathname } = new URL(url);

  return pathname;
};
