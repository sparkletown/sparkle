import { ProfileLink } from "types/User";
import "./ProfileModalLink.scss";
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
  faVimeoV,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";

export const ProfileModalLink: React.FC<{ link: ProfileLink }> = ({ link }) => {
  const linkIcon = useMemo(() => {
    const type = tryMatchLinkType(link.url);
    return type
      ? profileModalLinkTypesIcons[type] ?? profileModalGenericLinkIcon
      : profileModalGenericLinkIcon;
  }, [link.url]);

  return (
    <a
      className="ProfileModalLink"
      href={link.url}
      target="_blank"
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={linkIcon} size="sm" />
      <span>&nbsp;&nbsp;</span>
      {link.title}
    </a>
  );
};

const tryMatchLinkType: (link: string) => ProfileModalLinkType | undefined = (
  link
) => {
  return Object.entries(profileModalLinkTypesRegexes).find(([, regex]) =>
    link.match(regex)
  )?.[0] as ProfileModalLinkType | undefined;
};

enum ProfileModalLinkType {
  Instagram = "Instagram",
  Facebook = "Facebook",
  Medium = "Medium",
  Snapchat = "Snapchat",
  Stackexchange = "Stackexchange",
  Stackoverflow = "Stackoverflow",
  Telegram = "Telegram",
  Twitter = "Twitter",
  Github = "Github",
  Vimeo = "Vimeo",
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
  [ProfileModalLinkType.Vimeo]: faVimeoV,
  [ProfileModalLinkType.Youtube]: faYoutube,
  [ProfileModalLinkType.Tiktok]: faTiktok,
  [ProfileModalLinkType.Mail]: faEnvelope,
};

function buildMatchingRegex(...hosts: string[]) {
  const escaped = hosts.map((h) => h.replace(".", "\\."));

  return new RegExp(`^(https?:\\/\\/)?(www\\.)?(${escaped.join("|")}).*$`);
}

export const profileModalLinkTypesRegexes: Record<
  ProfileModalLinkType,
  RegExp
> = {
  [ProfileModalLinkType.Mail]: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
  [ProfileModalLinkType.Vimeo]: buildMatchingRegex("vimeo.com"),
  [ProfileModalLinkType.Youtube]: buildMatchingRegex("youtube.com"),
  [ProfileModalLinkType.Tiktok]: buildMatchingRegex("tiktok.com"),
};
