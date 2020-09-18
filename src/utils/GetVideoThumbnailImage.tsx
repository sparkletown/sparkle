import { parse } from "url";

export const GetVideoThumbnailImage = (string: string | undefined) => {
  if (string?.includes("youtube")) {
    return `https://img.youtube.com/vi/${GetYoutubeId(string)}/default.jpg`;
  } else if (string?.includes("vimeo")) {
    return `http://vimeo.com/api/oembed.json?url=${string}`;
  } else {
    return string?.includes("http") ? string : "//" + string;
  }
};
export const GetYoutubeId = (string: string) => {
  const i = string.indexOf("v=") || string.indexOf("d/");
  return string.substring(i + 2);
};
export const GetVimeoId = (string: string) => {
  const i = string.indexOf("m/") || string.indexOf("m/"); //"https://vimeo.com/201990344"
  return string.substring(i + 2);
};

// import bluebird from 'bluebird';
//import rp from 'request-promise';

//extract id from url path
const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;
const RE_FACEBOOK = /^\/[\w-]+\/videos\/(\d+)(\/)?$/;

export const getThumbnailURL = async (url: string) => {
  url = url || "";

  const urlobj = parse(url, true);

  //youtube
  if (
    ["www.youtube.com", "youtube.com", "youtu.be"].indexOf(
      urlobj.host ?? ""
    ) !== -1
  ) {
    let video_id = null;
    if ("v" in urlobj.query) {
      if (urlobj.query.v && urlobj.query.v.toString().match(/^[\w-]{10,12}$/)) {
        video_id = urlobj.query.v.toString();
      }
    } else {
      const match = RE_YOUTUBE.exec(urlobj.pathname ?? "");
      if (match) {
        video_id = match[1];
      }
    }

    if (video_id) {
      return `http://img.youtube.com/vi/${video_id}/hqdefault.jpg`;
    }
  }

  //vimeo
  if (
    ["www.vimeo.com", "vimeo.com", "player.vimeo.com"].indexOf(
      urlobj.host ?? ""
    ) !== -1
  ) {
    const match = RE_VIMEO.exec(urlobj.pathname ?? "");
    if (match) {
      const video_id = match[1];
      return (
        await (
          await fetch(`https://vimeo.com/api/v2/video/${video_id}.json`)
        ).json()
      ).thumbnail_large;
      //   .then(
      //   (data) => {
      //     if (data) {
      //       return data.json().then((j) => j.thumbnail_large);
      //     }
      //   }
      // );
    }
  }

  //facebook
  if (["facebook.com", "www.facebook.com"].indexOf(urlobj.host ?? "") !== -1) {
    const match = RE_FACEBOOK.exec(urlobj.pathname ?? "");

    if (match) {
      const video_id = match[1];
      return (
        await (await fetch(`https://graph.facebook.com/${video_id}`)).json()
      ).picture;
      // .then((data) => {
      //   if (data) {
      //     return data.json().then((j) => j.picture);
      //   }
      // });
    }
  }
  return null;
};
