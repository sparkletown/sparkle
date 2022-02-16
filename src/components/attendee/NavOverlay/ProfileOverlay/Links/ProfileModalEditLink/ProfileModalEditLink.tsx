import React, { ChangeEvent, useCallback } from "react";
import { FieldError, NestDataObject, ValidateResult } from "react-hook-form";
import { InputSelect } from "components/attendee/InputSelect";

import { FormFieldProps } from "types/forms";
import { ProfileLink } from "types/User";
import { ContainerClassName } from "types/utility";

import { userProfileModalFormProp as formProp } from "utils/propName";
import { urlRegex } from "utils/types";

export interface ProfileModalEditLinkProps extends ContainerClassName {
  index: number;
  initialTitle?: string;
  link: Partial<ProfileLink>;
  otherUrls: (string | undefined)[];
  setTitle: (title: string) => void;
  setUrl: (url: string) => void;
  register: FormFieldProps["register"];
  error?: NestDataObject<ProfileLink, FieldError>;
  onDelete: () => void;
}

export const ProfileModalEditLink: React.FC<ProfileModalEditLinkProps> = ({
  index,
  initialTitle,
  link,
  otherUrls,
  setTitle,
  setUrl,
  register,
  error,
  onDelete,
  containerClassName,
  ...props
}) => {
  const getInputNameForForm = useCallback(
    (index: number, prop: keyof ProfileLink) =>
      `${formProp("profileLinks")}[${index}].${prop}`,
    []
  );

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
        setUrl(url);
      }
    },
    [setUrl]
  );

  const handleTitleChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const title = e.target.value;
      if (title) {
        setTitle(title);
      }
    },
    [setTitle]
  );

  return (
    <InputSelect
      inputName={getInputNameForForm(index, "url")}
      selectName={getInputNameForForm(index, "title")}
      inputPlaceholder="url"
      selectPlaceholder="Select link type"
      inputOnChange={handleUrlChanged}
      selectOnChange={handleTitleChanged}
      selectRef={register({ required: "Title cannot empty" })}
      inputRef={register({
        required: "URL cannot be empty",
        pattern: {
          value: urlRegex,
          message: "URL must be valid",
        },
        validate: validateURLUnique,
      })}
      error={error?.url}
    />
  );
};
