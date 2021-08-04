import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { FieldError, NestDataObject, useForm } from "react-hook-form";
import { FormFieldProps } from "types/forms";
import { ProfileModalEditLink } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks/ProfileModalEditLink/ProfileModalEditLink";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import "./ProfileModalEditLinks.scss";
import { ProfileLink } from "types/User";

interface Props extends ContainerClassName {
  initialLinks: ProfileLink[];
  setLinkTitle: (index: number, title: string) => void;
  watch: ReturnType<typeof useForm>["watch"];
  register: FormFieldProps["register"];
  errors?: NestDataObject<ProfileLink, FieldError>[];
}

export const ProfileModalEditLinks: React.FC<Props> = ({
  initialLinks,
  setLinkTitle,
  watch,
  register,
  errors,
  containerClassName,
}: Props) => {
  const links = watch(formProp("links"), initialLinks) as ProfileLink[];

  const setTitles = useMemo(
    () => initialLinks.map((_, i) => (title: string) => setLinkTitle(i, title)),
    [initialLinks, setLinkTitle]
  );

  const renderedLinks = useMemo(
    () =>
      register &&
      initialLinks.map((initialLink, i) => {
        const otherUrls = links.filter((l) => l !== links[i]).map((l) => l.url);

        return (
          <ProfileModalEditLink
            containerClassName="ProfileModalEditLinks__link-group"
            key={initialLink.url}
            index={i}
            register={register}
            initialLink={initialLink}
            link={links[i]}
            otherUrls={otherUrls}
            setTitle={setTitles[i]}
            error={errors?.[i]}
          />
        );
      }),
    [register, initialLinks, links, setTitles, errors]
  );

  return (
    <div className={classNames("ProfileModalEditLinks", containerClassName)}>
      <div className="ProfileModalEditLinks__header-container">
        <ProfileModalSectionHeader text="Profile links" />
        <ProfileModalRoundIcon icon={faPlus} size="sm" />
      </div>
      {renderedLinks}
    </div>
  );
};
