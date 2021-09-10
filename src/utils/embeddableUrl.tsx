import {
  FACEBOOK_EMBED_URL,
  TWITCH_EMBED_URL,
  TWITCH_SHORT_URL,
  VIMEO_EMBED_URL,
  VIMEO_SHORT_EVENT_URL,
  YOUTUBE_EMBED_URL,
  YOUTUBE_SHORT_URL_STRING,
} from "settings";

const setParamsIteratively = (urlObject: URL, urlParams?: string[]) => {
  urlParams?.forEach((param) => {
    const [key, value] = param.split("=");
    urlObject.searchParams.set(key, value);
  });
};

const withAutoPlay = ({
  urlObject,
  autoPlay,
}: {
  urlObject: URL;
  autoPlay?: string | false | null;
}) => {
  if (autoPlay === "1" || autoPlay === "true") {
    urlObject.searchParams.set("autoplay", autoPlay);
  } else {
    urlObject.searchParams.delete("autoplay");
  }
};

type ConvertTwitchUrlOptions = {
  pathname: string;
  twitchId?: string | null;
  twitchVideoId?: string | null;
  urlParameters?: string[];
};

const convertTwitchUrl: (options: ConvertTwitchUrlOptions) => string = ({
  pathname,
  twitchId,
  twitchVideoId,
  urlParameters,
}) => {
  const id = pathname.split("/")?.slice(-1)?.[0] || twitchId || "";
  const twitchUrl = new URL(TWITCH_EMBED_URL);

  if (pathname.includes("video") || twitchVideoId) {
    twitchUrl.searchParams.set("video", id);
  } else {
    twitchUrl.searchParams.set("channel", id);
  }

  setParamsIteratively(twitchUrl, urlParameters);
  twitchUrl.searchParams.set("parent", "localhost");

  return twitchUrl.href;
};

export interface ConvertToEmbeddableUrlOptions {
  url?: string;
  autoPlay?: boolean;
}

export const convertToEmbeddableUrl: (
  options: ConvertToEmbeddableUrlOptions
) => string = ({ url: urlString, autoPlay }) => {
  if (!urlString) {
    return "";
  }

  let urlObject = new URL(urlString);
  const { host, searchParams, pathname } = urlObject;
  const youtubeVideoId = searchParams.get("v") || pathname.slice(1);
  const youtubeStartTime =
    searchParams.get("start") || searchParams.get("t") || "0";
  const twitchVideoId = searchParams.get("video");
  const urlParameters = searchParams.toString().split("&");
  const urlAutoPlayValue =
    searchParams.get("autoplay") === "1" ||
    searchParams.get("autoplay") === "true"
      ? searchParams.get("autoplay")
      : false;
  const twitchId = searchParams.get("channel") || twitchVideoId;
  const isTwitch = host.includes(TWITCH_SHORT_URL);

  if (isTwitch) {
    return convertTwitchUrl({
      twitchId,
      twitchVideoId,
      pathname,
      urlParameters,
    });
  }

  if (
    host?.includes(YOUTUBE_SHORT_URL_STRING) &&
    !pathname?.includes("embed")
  ) {
    urlObject = new URL(`${YOUTUBE_EMBED_URL}${youtubeVideoId}`);
    setParamsIteratively(urlObject, urlParameters);
    urlObject.searchParams.set("start", youtubeStartTime);
  }

  if (
    host?.includes("vimeo") &&
    !host?.includes("player") &&
    // NOTE: If you have a scheduled live event, it gives you a different embed code
    !urlString?.includes(VIMEO_SHORT_EVENT_URL)
  ) {
    urlObject = new URL(`${VIMEO_EMBED_URL}${pathname}`);
  }

  if (pathname?.includes(FACEBOOK_EMBED_URL)) {
    searchParams.set("mute", "0");
  }

  withAutoPlay({ urlObject, autoPlay: autoPlay && urlAutoPlayValue });

  return urlObject.href;
};
