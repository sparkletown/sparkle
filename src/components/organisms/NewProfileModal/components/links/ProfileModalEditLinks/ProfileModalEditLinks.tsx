import React, { useMemo } from "react";
import classNames from "classnames";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FieldError, NestDataObject } from "react-hook-form";

import { ProfileModalEditLink } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks/ProfileModalEditLink/ProfileModalEditLink";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";

import { FormFieldProps } from "types/forms";
import { ContainerClassName } from "types/utility";
import { ProfileLink } from "types/User";
import { WithId } from "utils/id";

import "./ProfileModalEditLinks.scss";

interface Props extends ContainerClassName {
  initialLinks: ProfileLink[];
  links: WithId<ProfileLink>[];
  setLinkTitle: (index: number, title: string) => void;
  register: FormFieldProps["register"];
  errors?: NestDataObject<ProfileLink, FieldError>[];
  onDeleteLink: (index: number) => void;
  onAddLink: () => void;
}

export const ProfileModalEditLinks: React.FC<Props> = ({
  initialLinks,
  links,
  setLinkTitle,
  register,
  errors,
  onDeleteLink,
  onAddLink,
  containerClassName,
}: Props) => {
  const setTitles = useMemo(
    () => links.map((_, i) => (title: string) => setLinkTitle(i, title)),
    [links, setLinkTitle]
  );

  const renderedLinks = useMemo(
    () =>
      register &&
      links.map(({ id, ...link }, i) => {
        const otherUrls = links.filter((l) => l !== links[i]).map((l) => l.url);

        return (
          <ProfileModalEditLink
            containerClassName="ProfileModalEditLinks__link-group"
            key={id}
            index={i}
            register={register}
            initialTitle={initialLinks?.[i]?.title}
            link={link}
            otherUrls={otherUrls}
            setTitle={setTitles[i]}
            error={errors?.[i]}
            onDelete={() => onDeleteLink(i)}
          />
        );
      }),
    [register, links, initialLinks, setTitles, errors, onDeleteLink]
  );

  return (
    <div className={classNames("ProfileModalEditLinks", containerClassName)}>
      <div className="ProfileModalEditLinks__header-container">
        <ProfileModalSectionHeader text="Profile links" />
        <ProfileModalRoundIcon onClick={onAddLink} icon={faPlus} size="sm" />
      </div>
      {renderedLinks}
    </div>
  );
};
