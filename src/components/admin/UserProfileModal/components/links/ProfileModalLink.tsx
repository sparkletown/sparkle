import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { STRING_NON_BREAKING_SPACE } from "settings";

import { ProfileLink } from "types/User";

import { useProfileModalLinkIcon } from "utils/profileModalLinkUtilities";

export const ProfileModalLink: React.FC<{ link: ProfileLink }> = ({ link }) => {
  const linkIcon = useProfileModalLinkIcon(link.url);

  return (
    <a
      data-bem="ProfileModalLink"
      className="mr-4"
      href={link.url}
      target="_blank"
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={linkIcon} size="sm" />
      <span>
        {STRING_NON_BREAKING_SPACE}
        {STRING_NON_BREAKING_SPACE}
      </span>
      {link.title}
    </a>
  );
};
