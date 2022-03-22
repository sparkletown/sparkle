import React, { useCallback } from "react";
import { FieldErrors, UseFormRegister, ValidateResult } from "react-hook-form";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import { ProfileModalRoundIcon } from "components/admin/UserProfileModal/components/ProfileModalRoundIcon";

import { UserProfileModalFormData } from "types/profileModal";
import { ProfileLink } from "types/User";

import { urlRegex } from "utils/types";

export interface ProfileModalEditLinkProps {
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
}) => {
  const validateURLUnique: (url: string) => ValidateResult = useCallback(
    (url: string) => {
      return !otherUrls.includes(url) || "URL must be unique";
    },
    [otherUrls]
  );

  return (
    <div data-bem="ProfileModalEditLink" className="flex">
      <div className="flex-1 mr-2">
        <InputGroup title={`Profile Link ${index + 1}`}>
          <div data-bem="ProfileModalEditLink__url" className="mb-1">
            <Input
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
          <div data-bem="ProfileModalEditLink__text">
            <Input
              placeholder="Link Title"
              register={register}
              name={`profileLinks.${index}.title`}
              rules={{
                required: "Title cannot empty",
              }}
              error={error?.title}
            />
          </div>
        </InputGroup>
      </div>

      <ProfileModalRoundIcon
        onClick={onDelete}
        containerClassName="ProfileModalEditLink__delete-icon"
        iconName={faTrash}
      />
    </div>
  );
};
