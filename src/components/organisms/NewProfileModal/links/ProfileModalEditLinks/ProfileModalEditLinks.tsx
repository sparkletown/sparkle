import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { ProfileModalEditLink } from "components/organisms/NewProfileModal/links/ProfileModalEditLinks/ProfileModalEditLink/ProfileModalEditLink";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/ProfileModalSectionHeader/ProfileModalSectionHeader";
import React from "react";
import { ContainerClassName } from "types/utility";
import "components/organisms/NewProfileModal/links/ProfileModalEditLinks/ProfileModalEditLinks.scss";
import { ProfileLink } from "types/User";

interface Props extends ContainerClassName {
  links: ProfileLink[];
}

export const ProfileModalEditLinks: React.FC<Props> = ({
  containerClassName,
  links,
}: Props) => {
  return (
    <div className={classNames("ProfileModalEditLinks", containerClassName)}>
      <div className="ProfileModalEditLinks__header-container">
        <ProfileModalSectionHeader text="Profile links" />
        <ProfileModalRoundIcon icon={faPlus} size="sm" />
      </div>
      {links.map((link) => (
        <ProfileModalEditLink
          containerClassName="ProfileModalEditLinks__link"
          key={link.url}
          link={link}
        />
      ))}
    </div>
  );
};
