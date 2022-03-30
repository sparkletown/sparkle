import React, { useCallback } from "react";
import {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "components/attendee/Input";

import { DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";

import { WithId } from "utils/id";

import { ProfileModalAvatar } from "./ProfileModalAvatar";

import styles from "./ProfileModalEditBasicInfo.module.scss";

export interface ProfileModalEditBasicInfoProps {
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
}) => {
  const pictureUrl = watch?.("pictureUrl");
  const setPictureUrl = useCallback(
    (url: string) => {
      if (setValue) {
        setValue("pictureUrl", url, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [setValue]
  );

  return (
    <div
      data-bem="ProfileModalEditBasicInfo"
      className={styles.ProfileModalEditBasicInfo}
    >
      <ProfileModalAvatar
        user={user}
        editMode={true}
        setPictureUrl={setPictureUrl}
        pictureUrl={pictureUrl}
        register={register}
      />
      <div className={styles.ProfileModalEditBasicInfo__content}>
        <span>Change your Sparkle username</span>
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
            variant="overlay-profile"
          />
        )}
      </div>
    </div>
  );
};
