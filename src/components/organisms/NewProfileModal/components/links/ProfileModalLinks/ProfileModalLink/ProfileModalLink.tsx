import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { useProfileModalLinkIcon } from "utils/profileModalLinkUtilities";

import "./ProfileModalLink.scss";

export const ProfileModalLink: React.FC<
  { link: ProfileLink } & ContainerClassName
> = ({ link, containerClassName }) => {
  const linkIcon = useProfileModalLinkIcon(link.url);

  return (
    <a
      className={classNames("ProfileModalLink", containerClassName)}
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
