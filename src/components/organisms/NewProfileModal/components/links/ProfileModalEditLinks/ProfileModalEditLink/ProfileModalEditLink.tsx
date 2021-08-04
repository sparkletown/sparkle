import { faTrash } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import {
  getLinkUsername,
  useLinkIcon,
} from "components/organisms/NewProfileModal/components/links/linkUtilities";
import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput/ProfileModalInput";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { useBooleanState } from "hooks/useBooleanState";
import React, { useCallback, useEffect } from "react";
import { FieldError, NestDataObject, ValidateResult } from "react-hook-form";
import { FormFieldProps } from "types/forms";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";
import "./ProfileModalEditLink.scss";
import { urlRegex } from "utils/types";

interface Props extends ContainerClassName {
  index: number;
  initialLink: ProfileLink;
  link: ProfileLink;
  otherUrls: string[];
  setTitle: (title: string) => void;
  register: FormFieldProps["register"];
  error?: NestDataObject<ProfileLink, FieldError>;
}

export const ProfileModalEditLink: React.FC<Props> = ({
  index,
  initialLink,
  link,
  otherUrls,
  setTitle,
  register,
  error,
  containerClassName,
}: Props) => {
  const linkIcon = useLinkIcon(link.url);

  const getInputNameForForm = useCallback(
    (index: number, prop: keyof ProfileLink) =>
      `${formProp("links")}[${index}].${prop}`,
    []
  );

  const [titleTouched, setTitleTouched] = useBooleanState(
    initialLink.title !== ""
  );

  useEffect(() => {
    const username = getLinkUsername(link.url);
    if (!titleTouched && username)
      if (username !== link.title) setTitle(username);
  }, [link.title, link.url, setTitle, titleTouched]);

  const validateURLUnique: (url: string) => ValidateResult = useCallback(
    (url: string) => {
      return !otherUrls.includes(url) || "URL must be unique";
    },
    [otherUrls]
  );

  return (
    <div className={classNames("ProfileModalEditLink", containerClassName)}>
      <div className="ProfileModalEditLink__text">
        <ProfileModalInput
          name={getInputNameForForm(index, "title")}
          onFocus={setTitleTouched}
          defaultValue={initialLink.title}
          placeholder="Link Title"
          ref={register({ required: "Title cannot empty" })}
          error={error?.title}
          iconEnd={linkIcon}
        />
      </div>
      <div className="ProfileModalEditLink__url">
        <ProfileModalInput
          name={getInputNameForForm(index, "url")}
          placeholder="Link URL"
          defaultValue={initialLink.url}
          ref={register({
            required: "URL cannot be empty",
            pattern: {
              value: urlRegex,
              message: "URL must be valid",
            },
            validate: validateURLUnique,
          })}
          error={error?.url}
        />
      </div>
      <ProfileModalRoundIcon
        containerClassName="ProfileModalEditLink__delete-icon"
        icon={faTrash}
      />
    </div>
  );
};
