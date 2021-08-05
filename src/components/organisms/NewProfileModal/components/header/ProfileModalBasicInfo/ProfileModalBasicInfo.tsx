import { ProfileModalAvatar } from "components/organisms/NewProfileModal/components/header/ProfileModalAvatar/ProfileModalAvatar";
import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput/ProfileModalInput";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalBasicTextInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalBasicInfo.scss";
import { formProp } from "components/organisms/NewProfileModal/utility";
import React from "react";
import { FieldError, useForm } from "react-hook-form";
import { DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";
import { FormFieldProps } from "types/forms";
import { WithId } from "utils/id";
import { User } from "types/User";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { ContainerClassName } from "types/utility";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  editMode?: boolean;
  onEdit?: () => void;
  register?: FormFieldProps["register"];
  setValue?: ReturnType<typeof useForm>["setValue"];
  watch?: ReturnType<typeof useForm>["watch"];
  partyNameError?: FieldError;
}

export const ProfileModalBasicInfo: React.FC<Props> = ({
  register,
  watch,
  setValue,
  partyNameError,
  viewingUser,
  editMode,
  onEdit,
  containerClassName,
}) => {
  return (
    <div className={classNames("ProfileModalBasicInfo", containerClassName)}>
      <div className="ProfileModalBasicInfo__left-container">
        <ProfileModalAvatar
          editMode={editMode}
          setValue={setValue}
          watch={watch}
          register={register}
          viewingUser={viewingUser}
        />
        <div
          className={classNames("ProfileModalBasicInfo--section", {
            "ProfileModalBasicInfo--grow": editMode,
          })}
        >
          {editMode && register ? (
            <ProfileModalInput
              name={formProp("partyName")}
              defaultValue={viewingUser?.partyName}
              placeholder="Display Name"
              error={partyNameError}
              ref={register({
                required: "Display Name cannot be empty",
                maxLength: {
                  value: DISPLAY_NAME_MAX_CHAR_COUNT,
                  message: `Display name must be ${DISPLAY_NAME_MAX_CHAR_COUNT} characters or less`,
                },
              })}
              notCondensed
            />
          ) : (
            <ProfileModalBasicTextInfo viewingUser={viewingUser} />
          )}
        </div>
      </div>
      {onEdit && !editMode && (
        <div className="ProfileModalBasicInfo__edit-container">
          <ProfileModalRoundIcon
            containerClassName="ProfileModalBasicInfo--section"
            onClick={onEdit}
            icon={faPen}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};
