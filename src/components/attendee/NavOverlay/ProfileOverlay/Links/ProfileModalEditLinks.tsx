import React, { useEffect, useMemo } from "react";
import { ArrayField, FieldError, NestDataObject } from "react-hook-form";
import classNames from "classnames";
import { Button } from "components/attendee/Button/Button";
import { ProfileModalEditLink } from "components/attendee/NavOverlay/ProfileOverlay/Links/ProfileModalEditLink";

import { FormFieldProps } from "types/forms";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import styles from "./ProfileModalEditLinks.module.scss";

export interface ProfileModalEditLinksProps extends ContainerClassName {
  initialLinks: ProfileLink[];
  links: Partial<ArrayField<ProfileLink>>[];
  setLinkTitle: (index: number, title: string) => void;
  setLinkUrl: (index: number, title: string) => void;
  register: FormFieldProps["register"];
  errors?: NestDataObject<ProfileLink, FieldError>[];
  onDeleteLink: (index: number) => void;
  onAddLink: () => void;
}

export const ProfileModalEditLinks: React.FC<ProfileModalEditLinksProps> = ({
  initialLinks,
  links,
  setLinkTitle,
  setLinkUrl,
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

  const setTitles = useMemo(
    () => links.map((_, i) => (title: string) => setLinkTitle(i, title)),
    [links, setLinkTitle]
  );

  const setUrls = useMemo(
    () => links.map((_, i) => (url: string) => setLinkUrl(i, url)),
    [links, setLinkUrl]
  );

  const renderedLinks = links.map((link, i) => {
    const otherUrls = links.filter((l) => l !== links[i]).map((l) => l.url);

    return (
      <ProfileModalEditLink
        key={i}
        index={i}
        register={register}
        initialTitle={initialLinks?.[i]?.title}
        link={link}
        otherUrls={otherUrls}
        setTitle={setTitles[i]}
        setUrl={setUrls[i]}
        error={errors?.[i]}
        onDelete={() => onDeleteLink(i)}
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
        <Button onClick={onAddLink} variant="alternativeBorder">
          Add another link
        </Button>
      </div>
    </div>
  );
};
