export const ConvertToEmbeddableUrl = (
  url: string | undefined,
  autoplay: boolean = true
) => {
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
  if (autoplay) {
    url += url.includes("?") ? "&" : "?";
    url += "autoplay=1";
  }
  return url;
};
