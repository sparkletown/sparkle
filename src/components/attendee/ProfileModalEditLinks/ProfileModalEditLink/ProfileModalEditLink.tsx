import React, { useCallback } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  ValidateResult,
} from "react-hook-form";
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
  watch: UseFormWatch<UserProfileModalFormData>;
  setValue: UseFormSetValue<UserProfileModalFormData>;
}

export const ProfileModalEditLink: React.FC<ProfileModalEditLinkProps> = ({
  index,
  otherUrls,
  register,
  error,
  watch,
  setValue,
}) => {
  const validateURLUnique: (url: string) => ValidateResult = useCallback(
    (url: string) => {
      return !otherUrls.includes(url) || "URL must be unique";
    },
    [otherUrls]
  );
  const linkUrlValue = watch(`profileLinks.${index}.url`);
  return (
    <InputSelect
      inputName={`profileLinks.${index}.url`}
      index={index}
      inputPlaceholder="url"
      inputRules={{
        pattern: {
          value: urlRegex,
          message: "URL must be valid",
        },
        validate: validateURLUnique,
      }}
      register={register}
      errorInput={error?.url}
      urlValue={linkUrlValue}
      setValue={setValue}
    />
  );
};
