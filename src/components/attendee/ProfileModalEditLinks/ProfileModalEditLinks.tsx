import React, { useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { Button } from "components/attendee/Button/Button";
import { ProfileModalEditLink } from "components/attendee/ProfileModalEditLinks/ProfileModalEditLink";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import styles from "./ProfileModalEditLinks.module.scss";

export interface ProfileModalEditLinksProps extends ContainerClassName {
  links: ProfileLink[];
  register: UseFormRegister<UserProfileModalFormData>;
  errors?: FieldErrors<ProfileLink>[];
  onAddLink: () => void;
}

export const ProfileModalEditLinks: React.FC<ProfileModalEditLinksProps> = ({
  links,
  register,
  errors,
  onAddLink,
  containerClassName,
}) => {
  useEffect(() => {
    if (!links.length) {
      onAddLink();
    }
  }, [links, onAddLink]);

  const renderedLinks = links.map((link, i) => {
    const otherUrls = links.filter((l) => l !== links[i]).map((l) => l.url);

    return (
      <ProfileModalEditLink
        key={i}
        index={i}
        register={register}
        otherUrls={otherUrls}
        error={errors?.[i]}
      />
    );
  });

  return (
    <div
      className={classNames(styles.ProfileModalEditLinks, containerClassName)}
    >
      <div className={styles.ProfileModalEditLinks__header}>
        <div>Profile links</div>
        {renderedLinks}
        <Button onClick={onAddLink} variant="alternative" border="alternative">
          Add another link
        </Button>
      </div>
    </div>
  );
};
