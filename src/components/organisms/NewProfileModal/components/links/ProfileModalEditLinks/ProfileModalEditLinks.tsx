import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { useForm } from "react-hook-form";
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
}

// const isTitleUnique = (title: string, otherLinks: ProfileLink[]): boolean => {
//   const isDuplicateTitle =
//     otherLinks?.find((link) => link.title === title) ?? false;
//
//   return !isDuplicateTitle;
// };

export const ProfileModalEditLinks: React.FC<Props> = ({
  initialLinks,
  setLinkTitle,
  watch,
  register,
  containerClassName,
}: Props) => {
  const links = watch(formProp("links"), initialLinks) as ProfileLink[];

  // const getUniqueTitleValidator = (link: ProfileLink) => {
  //   const otherLinks = links.filter((l) => l !== link);
  //
  //   return (title: string) => isTitleUnique(title, otherLinks);
  // };

  // const getSchema = (
  //   link: ProfileLink
  // ): ObjectSchema<Shape<object | undefined, ProfileLink>> =>
  //   Yup.object().shape<ProfileLink>({
  //     title: Yup.string()
  //       .required("Title is required")
  //       .test(
  //         "unique title",
  //         "Title must be unique",
  //         getUniqueTitleValidator(link)
  //       ),
  //     url: Yup.string()
  //       .required("URL is required")
  //       .matches(
  //         /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??([-+=&;%@.\w_]*)#?([.!/\\\w]*))?)/,
  //         "URL must be valid"
  //       ),
  //   });

  const setTitles = useMemo(
    () => initialLinks.map((_, i) => (title: string) => setLinkTitle(i, title)),
    [initialLinks, setLinkTitle]
  );

  const renderedLinks = useMemo(
    () =>
      register &&
      initialLinks.map((link, i) => (
        <ProfileModalEditLink
          containerClassName="ProfileModalEditLinks__link-group"
          key={`link-${i}`}
          index={i}
          register={register}
          initialLink={link}
          link={links[i]}
          setTitle={setTitles[i]}
        />
      )),
    [register, initialLinks, links, setTitles]
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
