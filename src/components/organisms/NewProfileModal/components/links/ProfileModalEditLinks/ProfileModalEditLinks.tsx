import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { ProfileModalEditLink } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks/ProfileModalEditLink/ProfileModalEditLink";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";
import React from "react";
import { ContainerClassName } from "types/utility";
import "./ProfileModalEditLinks.scss";
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
          containerClassName="ProfileModalEditLinks__link-group"
          key={link.url}
          link={link}
        />
      ))}
    </div>
  );
};
