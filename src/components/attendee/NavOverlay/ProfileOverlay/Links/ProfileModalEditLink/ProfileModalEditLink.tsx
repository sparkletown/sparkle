import React, { useCallback } from "react";
import { FieldErrors, UseFormRegister, ValidateResult } from "react-hook-form";
import { InputSelect } from "components/attendee/InputSelect";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { urlRegex } from "utils/types";

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
  initialTitle,
  link,
  otherUrls,
  setTitle,
  register,
  error,
  onDelete,
  containerClassName,
  ...props
}) => {
  const validateURLUnique: (url: string) => ValidateResult = useCallback(
    (url: string) => {
      return !otherUrls.includes(url) || "URL must be unique";
    },
    [otherUrls]
  );

  return (
    <InputSelect
      inputName={`profileLinks.${index}.url`}
      selectName={`profileLinks.${index}.title`}
      inputPlaceholder="url"
      selectPlaceholder="Select link type"
      selectRules={{ required: "Title cannot empty" }}
      inputRules={{
        required: "URL cannot be empty",
        pattern: {
          value: urlRegex,
          message: "URL must be valid",
        },
        validate: validateURLUnique,
      }}
      register={register}
      error={error?.url}
    />
  );
};
