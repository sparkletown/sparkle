import {
  FACEBOOK_EMBED_URL,
  TWITCH_EMBED_URL,
  TWITCH_SHORT_URL,
  VIMEO_EMBED_URL,
  VIMEO_SHORT_EVENT_URL,
  YOUTUBE_EMBED_URL,
  YOUTUBE_SHORT_URL_STRING,
} from "../settings";
export interface ConvertToEmbeddableUrlOptions {
  url?: string;
  autoPlay?: boolean;
}

// @debt Replace the naive logic with use of new URL(url) which provides standard parsing before doing checks
export const convertToEmbeddableUrl: (
  options: ConvertToEmbeddableUrlOptions
) => string = ({ url, autoPlay }) => {
  if (!url) {
    return "";
  }

  let urlObj = new URL(url);
  const { host, searchParams, pathname } = urlObj;
  const youtubeVideoId = searchParams.get("v") || pathname.slice(1);
  const twitchVideoId = searchParams.get("video");
  const twitchId = searchParams.get("channel") || twitchVideoId;
  const isTwitch = host.includes(TWITCH_SHORT_URL);

  if (
    host?.includes(YOUTUBE_SHORT_URL_STRING) &&
    !pathname?.includes("embed")
  ) {
    urlObj = new URL(`${YOUTUBE_EMBED_URL}${youtubeVideoId}`);
    const params = searchParams.toString().split("&");
    params.forEach((param) => {
      const [key, value] = param.split("=");
      urlObj.searchParams.set(key, value);
    });
  } else if (
    host?.includes("vimeo") &&
    !host?.includes("player") &&
    // NOTE: If you have a scheduled live event, it gives you a different embed code
    !url?.includes(VIMEO_SHORT_EVENT_URL)
  ) {
    urlObj = new URL(`${VIMEO_EMBED_URL}${pathname}`);
  } else if (pathname?.includes(FACEBOOK_EMBED_URL)) {
    searchParams.set("mute", "0");
  } else if (isTwitch) {
    const id = pathname.split("/")?.slice(-1)?.[0] || twitchId || "";
    const twitchUrlObj = new URL(TWITCH_EMBED_URL);
    urlObj = twitchUrlObj;
    if (pathname.includes("video") || twitchVideoId) {
      twitchUrlObj.searchParams.set("video", id);
    } else {
      twitchUrlObj.searchParams.set("channel", id);
    }
    twitchUrlObj.searchParams.set("parent", "localhost");
  }

  if (autoPlay) {
    const autoPlayValue = isTwitch ? "true" : "1";
    urlObj.searchParams.set("autoplay", autoPlayValue);
  } else {
    urlObj.searchParams.delete("autoplay");
  }

  return urlObj.href;
};
