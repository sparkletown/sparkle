import { userProfileModalFormProp as formProp } from "utils/propName";
import React, { ChangeEvent, useCallback, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FieldError, NestDataObject, ValidateResult } from "react-hook-form";
import classNames from "classnames";

import { useBooleanState } from "hooks/useBooleanState";

import {
  getProfileModalLinkIcon,
  getProfileModalLinkUsername,
} from "utils/profileModalLinkUtilities";

import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput/ProfileModalInput";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";

import { FormFieldProps } from "types/forms";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { urlRegex } from "utils/types";

import "./ProfileModalEditLink.scss";

interface Props extends ContainerClassName {
  index: number;
  initialTitle?: string;
  link: ProfileLink;
  otherUrls: string[];
  setTitle: (title: string) => void;
  register: FormFieldProps["register"];
  error?: NestDataObject<ProfileLink, FieldError>;
  onDelete: () => void;
}

export const ProfileModalEditLink: React.FC<Props> = ({
  index,
  initialTitle,
  link,
  otherUrls,
  setTitle,
  register,
  error,
  onDelete,
  containerClassName,
}: Props) => {
  const [linkIcon, setLinkIcon] = useState<IconDefinition>(
    getProfileModalLinkIcon(link.url)
  );

  const getInputNameForForm = useCallback(
    (index: number, prop: keyof ProfileLink) =>
      `${formProp("profileLinks")}[${index}].${prop}`,
    []
  );

  const [titleTouched, setTitleTouched] = useBooleanState(!!initialTitle);

  const validateURLUnique: (url: string) => ValidateResult = useCallback(
    (url: string) => {
      return !otherUrls.includes(url) || "URL must be unique";
    },
    [otherUrls]
  );

  const handleUrlChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      if (url) {
        const username = getProfileModalLinkUsername(url);
        setLinkIcon(getProfileModalLinkIcon(url));
        if (!titleTouched && username && username !== initialTitle) {
          setTitle(username);
        }
      }
    },
    [initialTitle, setTitle, titleTouched]
  );

  return (
    <div className={classNames("ProfileModalEditLink", containerClassName)}>
      <div className="ProfileModalEditLink__url">
        <ProfileModalInput
          name={getInputNameForForm(index, "url")}
          placeholder="Link URL"
          onChange={handleUrlChanged}
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
      <div className="ProfileModalEditLink__text">
        <ProfileModalInput
          name={getInputNameForForm(index, "title")}
          onFocus={setTitleTouched}
          placeholder="Link Title"
          ref={register({ required: "Title cannot empty" })}
          error={error?.title}
          iconEnd={linkIcon}
        />
      </div>
      <ProfileModalRoundIcon
        onClick={onDelete}
        containerClassName="ProfileModalEditLink__delete-icon"
        icon={faTrash}
      />
    </div>
  );
};
