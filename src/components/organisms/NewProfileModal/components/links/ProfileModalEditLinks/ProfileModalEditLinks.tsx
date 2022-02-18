import React, { useMemo } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { ProfileModalEditLink } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks/ProfileModalEditLink";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader";

import "./ProfileModalEditLinks.scss";

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
      links.map(({ ...link }, i) => {
        const otherUrls = links.filter((l) => l !== links[i]).map((l) => l.url);

        return (
          <ProfileModalEditLink
            containerClassName="ProfileModalEditLinks__link-group"
            key={i}
            index={i}
            register={register}
            initialTitle={initialLinks?.[i]?.title}
            link={link}
            otherUrls={otherUrls}
            error={errors?.[i]}
            onDelete={() => onDeleteLink(i)}
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
