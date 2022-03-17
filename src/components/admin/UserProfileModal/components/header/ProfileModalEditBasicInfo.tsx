import React, { useCallback } from "react";
import {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import classNames from "classnames";
import { Input } from "components/admin/Input";
import { ProfileModalAvatar } from "components/admin/UserProfileModal/components/header/ProfileModalAvatar";

import { DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { DefaultAvatars } from "components/molecules/DefaultAvatars/DefaultAvatars";

export interface ProfileModalEditBasicInfoProps extends ContainerClassName {
  user: WithId<User>;
  register: UseFormRegister<UserProfileModalFormData>;
  setValue: UseFormSetValue<UserProfileModalFormData>;
  watch: UseFormWatch<UserProfileModalFormData>;
  partyNameError?: FieldError;
}

export const ProfileModalEditBasicInfo: React.FC<ProfileModalEditBasicInfoProps> = ({
  user,
  register,
  setValue,
  watch,
  partyNameError,
  containerClassName,
}) => {
  const pictureUrl = watch?.("pictureUrl");
  const setPictureUrl = useCallback(
    (url: string) => {
      if (setValue)
        setValue("pictureUrl", url, {
          shouldValidate: true,
          shouldDirty: true,
        });
    },
    [setValue]
  );

  return (
    <div
      className={classNames("ProfileModalEditBasicInfo", containerClassName)}
    >
      <ProfileModalAvatar
        user={user}
        editMode={true}
        setPictureUrl={setPictureUrl}
        pictureUrl={pictureUrl}
        register={register}
      />
      <div className="ProfileModalEditBasicInfo__default-avatars mb-2">
        <div className="ProfileModalEditBasicInfo__choose-text">
          or pick one from our Sparkle profile pics
        </div>
        <DefaultAvatars
          avatarClassName="ProfileModalEditBasicInfo__avatar"
          avatarPictureClassName="ProfileModalEditBasicInfo__avatar-picture"
          onAvatarClick={setPictureUrl}
        />
      </div>
      {register && (
        <Input
          placeholder="Display Name"
          error={partyNameError}
          name="partyName"
          rules={{
            required: "Display Name cannot be empty",
            maxLength: {
              value: DISPLAY_NAME_MAX_CHAR_COUNT,
              message: `Display name must be ${DISPLAY_NAME_MAX_CHAR_COUNT} characters or less`,
            },
          }}
          register={register}
        />
      )}
    </div>
  );
};
