import React, { useMemo } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { ProfileModalRoundIcon } from "components/admin/UserProfileModal/components/ProfileModalRoundIcon";
import { ProfileModalSectionHeader } from "components/admin/UserProfileModal/components/ProfileModalSectionHeader";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { ProfileModalEditLink } from "./ProfileModalEditLink";

export interface ProfileModalEditLinksProps extends ContainerClassName {
  initialLinks: ProfileLink[];
  links: ProfileLink[];
  register: UseFormRegister<UserProfileModalFormData>;
  errors?: FieldErrors<ProfileLink>[];
  onDeleteLink: (index: number) => void;
  onAddLink: () => void;
}

export const ProfileModalEditLinks: React.FC<ProfileModalEditLinksProps> = ({
  initialLinks,
  links,
  register,
  errors,
  onDeleteLink,
  onAddLink,
  containerClassName,
}) => {
  const renderedLinks = useMemo(
    () =>
      register &&
      links.map(({ ...link }, index) => {
        const otherUrls = links
          .filter((l) => l !== links[index])
          .map((l) => l.url);

        return (
          <ProfileModalEditLink
            containerClassName="ProfileModalEditLinks__link-group"
            key={index}
            index={index}
            register={register}
            initialTitle={initialLinks?.[index]?.title}
            link={link}
            otherUrls={otherUrls}
            error={errors?.[index]}
            onDelete={() => onDeleteLink(index)}
          />
        );
      }),
    [register, links, initialLinks, errors, onDeleteLink]
  );

  return (
    <div className={classNames("ProfileModalEditLinks", containerClassName)}>
      <div className="ProfileModalEditLinks__header-container">
        <ProfileModalSectionHeader text="Profile links" />
        <ProfileModalRoundIcon onClick={onAddLink} iconName={faPlus} />
      </div>
      {renderedLinks}
    </div>
  );
};
