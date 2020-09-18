export const ConvertToEmbeddableUrl = (string: string | undefined) => {
  if (string?.includes("youtube")) {
    return string?.replace("watch?v=", "embed/");
  } else if (string?.includes("vimeo") && !string?.includes("player")) {
    return string?.replace("vimeo.com/", "player.vimeo.com/video/");
  } else {
    return string?.includes("http") ? string : "//" + string;
  }
};
