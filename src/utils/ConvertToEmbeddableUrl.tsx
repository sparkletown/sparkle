export const ConvertToEmbeddableUrl = (
  url: string | undefined,
  autoplay: boolean = true
) => {
  if (url?.includes("youtube")) {
    url = url?.replace("watch?v=", "embed/");
  } else if (url?.includes("vimeo") && !url?.includes("player")) {
    url = url?.replace("vimeo.com/", "player.vimeo.com/video/");
  } else {
    url = url?.includes("http") ? url : "//" + url;
  }
  if (autoplay) {
    url += url.includes("?") ? "&" : "?";
    url += "autoplay=1";
  }
  return url;
};
