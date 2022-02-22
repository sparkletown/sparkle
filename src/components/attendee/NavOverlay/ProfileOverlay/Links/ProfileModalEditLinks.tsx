import React, { useEffect, useMemo } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { Button } from "components/attendee/Button/Button";
import { ProfileModalEditLink } from "components/attendee/NavOverlay/ProfileOverlay/Links/ProfileModalEditLink";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import styles from "./ProfileModalEditLinks.module.scss";

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
  useEffect(() => {
    if (!links.length) {
      onAddLink();
    }
  }, [links, onAddLink]);

  const renderedLinks = useMemo(
    () =>
      links.map((link, i) => {
        const otherUrls = links.filter((l) => l !== links[i]).map((l) => l.url);

        return (
          <ProfileModalEditLink
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
    [errors, initialLinks, links, onDeleteLink, register]
  );

  return (
    <div
      className={classNames(styles.ProfileModalEditLinks, containerClassName)}
    >
      <div className={styles.ProfileModalEditLinks__header}>
        <div>Profile links</div>
        {renderedLinks}
        <Button onClick={onAddLink} variant="alternativeBorder">
          Add another link
        </Button>
      </div>
    </div>
  );
};
