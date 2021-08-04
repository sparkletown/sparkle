import classNames from "classnames";
import { useLinkIcon } from "components/organisms/NewProfileModal/components/links/linkUtilities";
import { ProfileLink } from "types/User";
import "./ProfileModalLink.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ContainerClassName } from "types/utility";

export const ProfileModalLink: React.FC<
  { link: ProfileLink } & ContainerClassName
> = ({ link, containerClassName }) => {
  const linkIcon = useLinkIcon(link.url);

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
