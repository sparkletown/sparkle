import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faMedium,
  faSnapchat,
  faStackExchange,
  faStackOverflow,
  faTelegram,
  faTiktok,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { memoize } from "lodash";
import { useMemo } from "react";

export const useLinkIcon = (url: string) =>
  useMemo(() => {
    const type = Object.entries(
      profileModalLinkTypesRegexes
    ).find(([, regex]) => url.match(regex))?.[0] as
      | ProfileModalLinkType
      | undefined;

    return type
      ? profileModalLinkTypesIcons[type] ?? profileModalGenericLinkIcon
      : profileModalGenericLinkIcon;
  }, [url]);

export const getLinkUsername = (url: string) => {
  const execute = (url: string) => {
    const res = Object.entries(profileModalProfileNameRegex).map(
      ([, regex]) => {
        const match = url.match(regex);
        return match?.[1] as string;
      }
    );

    return res.find((x) => x);
  };

  return memoize(execute)(url);
};

export enum ProfileModalLinkType {
  Instagram = "Instagram",
  Facebook = "Facebook",
  Medium = "Medium",
  Snapchat = "Snapchat",
  Stackexchange = "Stackexchange",
  Stackoverflow = "Stackoverflow",
  Telegram = "Telegram",
  Twitter = "Twitter",
  Github = "Github",
  Youtube = "Youtube",
  Tiktok = "Tiktok",
  Mail = "Mail",
}

export const profileModalGenericLinkIcon = faLink;
export const profileModalLinkTypesIcons: Record<
  ProfileModalLinkType,
  IconDefinition
> = {
  [ProfileModalLinkType.Instagram]: faInstagram,
  [ProfileModalLinkType.Facebook]: faFacebook,
  [ProfileModalLinkType.Medium]: faMedium,
  [ProfileModalLinkType.Snapchat]: faSnapchat,
  [ProfileModalLinkType.Stackexchange]: faStackExchange,
  [ProfileModalLinkType.Stackoverflow]: faStackOverflow,
  [ProfileModalLinkType.Telegram]: faTelegram,
  [ProfileModalLinkType.Twitter]: faTwitter,
  [ProfileModalLinkType.Github]: faGithub,
  [ProfileModalLinkType.Youtube]: faYoutube,
  [ProfileModalLinkType.Tiktok]: faTiktok,
  [ProfileModalLinkType.Mail]: faEnvelope,
};

export function buildMatchingRegex(...hosts: string[]) {
  const escaped = hosts.map((h) => h.replace(".", "\\."));

  return new RegExp(`^(https?:\\/\\/)?(www\\.)?(${escaped.join("|")}).*$`);
}

export const profileModalLinkTypesRegexes: Record<
  ProfileModalLinkType,
  RegExp
> = {
  [ProfileModalLinkType.Mail]: /^((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/,
  [ProfileModalLinkType.Instagram]: buildMatchingRegex(
    "instagram.com",
    "instagr.am"
  ),
  [ProfileModalLinkType.Facebook]: buildMatchingRegex("facebook.com", "fb.com"),
  [ProfileModalLinkType.Medium]: buildMatchingRegex("medium.com"),
  [ProfileModalLinkType.Snapchat]: buildMatchingRegex("snapchat.com"),
  [ProfileModalLinkType.Stackexchange]: buildMatchingRegex("stackexchange.com"),
  [ProfileModalLinkType.Stackoverflow]: buildMatchingRegex("stackoverflow.com"),
  [ProfileModalLinkType.Telegram]: buildMatchingRegex(
    "telegram.me",
    "telegram.org",
    "t.me"
  ),
  [ProfileModalLinkType.Twitter]: buildMatchingRegex("twitter.com"),
  [ProfileModalLinkType.Github]: buildMatchingRegex("github.com"),
  [ProfileModalLinkType.Youtube]: buildMatchingRegex("youtube.com"),
  [ProfileModalLinkType.Tiktok]: buildMatchingRegex("tiktok.com"),
};

export const profileModalProfileNameRegex: Record<
  ProfileModalLinkType,
  RegExp
> = {
  [ProfileModalLinkType.Mail]:
    profileModalLinkTypesRegexes[ProfileModalLinkType.Mail],
  [ProfileModalLinkType.Instagram]: /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|\.(?!\.)){0,28}[A-Za-z0-9_])?)/,
  [ProfileModalLinkType.Facebook]: /(?:https?:)?\/\/(?:www\.)?(?:facebook|fb)\.com\/((?![A-z]+\.php)(?!marketplace|gaming|watch|me|messages|help|search|groups)[A-z0-9_\-.]+)\/?/,
  [ProfileModalLinkType.Medium]: /(?:https?:)?\/\/medium\.com\/@([A-z0-9]+)(?:\?.*)?/,
  [ProfileModalLinkType.Snapchat]: / (?:https?:)?\/\/(?:www\.)?snapchat\.com\/add\/([A-z0-9._-]+)\/?/,
  [ProfileModalLinkType.Stackexchange]: /(?:https?:)?\/\/(?:www\.)?stackexchange\.com\/users\/[0-9]+\/([A-z0-9-_.]+)\/?/,
  [ProfileModalLinkType.Stackoverflow]: / (?:https?:)?\/\/(?:www\.)?stackoverflow\.com\/users\/[0-9]+\/([A-z0-9-_.]+)\/?/,
  [ProfileModalLinkType.Telegram]: /(?:https?:)?\/\/(?:t(?:elegram)?\.me|telegram\.org)\/([a-z0-9_]{5,32})\/?/,
  [ProfileModalLinkType.Twitter]: /(?:https?:)?\/\/(?:[A-z]+\.)?twitter\.com\/@?(?!home|share|privacy|tos)([A-z0-9_]+)\/?/,
  [ProfileModalLinkType.Github]: /(?:https?:)?\/\/(?:www\.)?github\.com\/([A-z0-9_-]+)\/?/,
  [ProfileModalLinkType.Youtube]: / (?:https?:)?\/\/(?:[A-z]+\.)?youtube.com\/user\/([A-z0-9]+)\/?/,
  [ProfileModalLinkType.Tiktok]: /(?:https?:)?\/\/(?:www\.)?tiktok\.com\/@([A-z0-9-_.]+)\/?/,
};
