import { DEFAULT_VENUE_AUTOPLAY } from "settings";

export interface ConvertToEmbeddableUrlOptions {
  url?: string;
  autoPlay?: boolean;
}

// @debt Replace the naive logic with use of new URL(url) which provides standard parsing before doing checks
export const convertToEmbeddableUrl: (
  options: ConvertToEmbeddableUrlOptions
) => string = ({ url, autoPlay = DEFAULT_VENUE_AUTOPLAY }) => {
  if (url?.includes("youtube")) {
    url = url?.replace("watch?v=", "embed/");
  } else if (
    url?.includes("vimeo") &&
    !url?.includes("player") &&
    // NOTE: If you have a scheduled live event, it gives you a different embed code
    !url?.includes("vimeo.com/event")
  ) {
    url = url?.replace("vimeo.com/", "player.vimeo.com/video/");
  } else if (
    url?.includes("facebook.com/plugins/video.php") &&
    !url.includes("mute=0")
  ) {
    url += url.includes("?") ? "&" : "?";
    url += "mute=0";
  } else {
    url = url?.includes("http") ? url : "//" + url;
  }
  if (autoPlay) {
    url += url.includes("?") ? "&" : "?";
    url += "autoplay=1";
  }
  return url;
};
