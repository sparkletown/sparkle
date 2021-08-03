import { useLinkIcon } from "components/organisms/NewProfileModal/components/links/links";
import { ProfileLink } from "types/User";
import "./ProfileModalLink.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const ProfileModalLink: React.FC<{ link: ProfileLink }> = ({ link }) => {
  const linkIcon = useLinkIcon(link.url);

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
