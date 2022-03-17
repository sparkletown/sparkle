import React, { useCallback } from "react";
import { FieldErrors, UseFormRegister, ValidateResult } from "react-hook-form";
import { InputSelect } from "components/attendee/InputSelect";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { urlRegex } from "utils/types";

export interface ProfileModalEditLinkProps extends ContainerClassName {
  index: number;
  otherUrls: (string | undefined)[];
  register: UseFormRegister<UserProfileModalFormData>;
  error?: FieldErrors<ProfileLink>;
}

export const ProfileModalEditLink: React.FC<ProfileModalEditLinkProps> = ({
  index,
  otherUrls,
  register,
  error,
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
      selectPlaceholder="Select type"
      inputRules={{
        pattern: {
          value: urlRegex,
          message: "URL must be valid",
        },
        validate: validateURLUnique,
      }}
      selectRules={{ required: "Title cannot empty" }}
      register={register}
      errorInput={error?.url}
      errorSelect={error?.title}
    />
  );
};
