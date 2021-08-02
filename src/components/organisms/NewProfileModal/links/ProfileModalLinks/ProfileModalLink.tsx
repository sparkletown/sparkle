import {
  profileModalGenericLinkIcon,
  profileModalLinkTypesIcons,
  tryMatchLinkType,
} from "components/organisms/NewProfileModal/links/links";
import { ProfileLink } from "types/User";
import "components/organisms/NewProfileModal/links/ProfileModalLinks/ProfileModalLink.scss";
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
