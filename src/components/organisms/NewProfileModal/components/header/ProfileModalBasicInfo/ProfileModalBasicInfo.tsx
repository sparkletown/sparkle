import { DefaultAvatars } from "components/molecules/DefaultAvatars/DefaultAvatars";
import { ProfileModalAvatar } from "components/organisms/NewProfileModal/components/header/ProfileModalAvatar/ProfileModalAvatar";
import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput/ProfileModalInput";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalBasicTextInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalBasicInfo.scss";
import { formProp } from "components/organisms/NewProfileModal/utilities";
import React, { useCallback } from "react";
import { FieldError, useForm } from "react-hook-form";
import { useToggle } from "react-use";
import { DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";
import { WithId } from "utils/id";
import { User } from "types/User";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { ContainerClassName } from "types/utility";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  venueId: string;
  editMode?: boolean;
  onEdit?: () => void;
  register?: ReturnType<typeof useForm>["register"];
  setValue?: ReturnType<typeof useForm>["setValue"];
  watch?: ReturnType<typeof useForm>["watch"];
  partyNameError?: FieldError;
}

export const ProfileModalBasicInfo: React.FC<Props> = ({
  viewingUser,
  venueId,
  editMode,
  onEdit,
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

  const [isShowDefaults, toggleDefaults] = useToggle(false);

  return (
    <div className={classNames("ProfileModalBasicInfo", containerClassName)}>
      <div className="ProfileModalBasicInfo__left-container">
        <ProfileModalAvatar
          viewingUser={viewingUser}
          editMode={editMode}
          setPictureUrl={setPictureUrl}
          pictureUrl={pictureUrl}
          register={register}
        />
        <div
          className={classNames("ProfileModalBasicInfo__party-name-section")}
        >
          {editMode && register ? (
            <>
              <ProfileModalInput
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
                notCondensed
              />
              <div
                className="ProfileModalBasicInfo__choose-text"
                onClick={toggleDefaults}
              >
                Choose a default sparkle pic
              </div>
            </>
          ) : (
            <ProfileModalBasicTextInfo viewingUser={viewingUser} />
          )}
        </div>

        {editMode && isShowDefaults && (
          <DefaultAvatars
            containerClassName="ProfileModalBasicInfo__default-pictures"
            avatarClassName="ProfileModalBasicInfo__avatar"
            venueId={venueId}
            onAvatarClick={setPictureUrl}
          />
        )}
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
