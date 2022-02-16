import React, { useCallback } from "react";
import { FieldError, useForm } from "react-hook-form";
import classNames from "classnames";

import { DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import { userProfileModalFormProp as formProp } from "utils/propName";

import { InputField } from "components/atoms/InputField";

import { ProfileModalAvatar } from "./ProfileModalAvatar";

import styles from "./ProfileModalEditBasicInfo.module.scss";

export interface ProfileModalEditBasicInfoProps extends ContainerClassName {
  user: WithId<User>;
  register: ReturnType<typeof useForm>["register"];
  setValue: ReturnType<typeof useForm>["setValue"];
  watch: ReturnType<typeof useForm>["watch"];
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
  const pictureUrl = watch?.(formProp("pictureUrl"));
  const setPictureUrl = useCallback(
    (url: string) => {
      if (setValue) setValue(formProp("pictureUrl"), url, true);
    },
    [setValue]
  );

  return (
    <div
      className={classNames(
        styles.ProfileModalEditBasicInfo,
        containerClassName
      )}
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
          <InputField
            name={formProp("partyName")}
            placeholder="Display Name"
            error={partyNameError}
            ref={register({
              required: "Display Name cannot be empty",
              maxLength: {
                value: DISPLAY_NAME_MAX_CHAR_COUNT,
                message: `Display name must be ${DISPLAY_NAME_MAX_CHAR_COUNT} characters or less`,
              },
            })}
            inputClassName={styles.ProfileModalEditBasicInfo__input}
          />
        )}
      </div>
    </div>
  );
};
