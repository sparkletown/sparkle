import React, { useCallback } from "react";
import { FieldErrors, UseFormRegister, ValidateResult } from "react-hook-form";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { urlRegex } from "utils/types";

import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon";

import "./ProfileModalEditLink.scss";

export interface ProfileModalEditLinkProps extends ContainerClassName {
  index: number;
  initialTitle?: string;
  link: Partial<ProfileLink>;
  otherUrls: (string | undefined)[];
  setTitle?: (title: string) => void;
  register: UseFormRegister<UserProfileModalFormData>;
  error?: FieldErrors<ProfileLink>;
  onDelete: () => void;
}

export const ProfileModalEditLink: React.FC<ProfileModalEditLinkProps> = ({
  index,
  otherUrls,
  setTitle,
  register,
  error,
  onDelete,
  containerClassName,
}) => {
  const validateURLUnique: (url: string) => ValidateResult = useCallback(
    (url: string) => {
      return !otherUrls.includes(url) || "URL must be unique";
    },
    [otherUrls]
  );

  return (
    <div className={classNames("ProfileModalEditLink", containerClassName)}>
      <div className="ProfileModalEditLink__url">
        <ProfileModalInput
          placeholder="Link URL"
          name={`profileLinks.${index}.url`}
          register={register}
          rules={{
            required: "URL cannot be empty",
            pattern: {
              value: urlRegex,
              message: "URL must be valid",
            },
            validate: validateURLUnique,
          }}
          error={error?.url}
        />
      </div>
      <div className="ProfileModalEditLink__text">
        <ProfileModalInput
          placeholder="Link Title"
          register={register}
          name={`profileLinks.${index}.title`}
          rules={{
            required: "Title cannot empty",
          }}
          error={error?.title}
        />
      </div>
      <ProfileModalRoundIcon
        onClick={onDelete}
        containerClassName="ProfileModalEditLink__delete-icon"
        iconName={faTrash}
      />
    </div>
  );
};
