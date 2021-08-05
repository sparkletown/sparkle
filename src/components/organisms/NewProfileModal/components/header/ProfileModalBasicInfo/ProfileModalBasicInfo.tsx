import { ProfileModalAvatar } from "components/organisms/NewProfileModal/components/header/ProfileModalAvatar/ProfileModalAvatar";
import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput/ProfileModalInput";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalBasicTextInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalBasicInfo.scss";
import { formProp } from "components/organisms/NewProfileModal/utility";
import React from "react";
import { FieldError } from "react-hook-form";
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
  partyNameError?: FieldError;
}

export const ProfileModalBasicInfo: React.FC<Props> = ({
  register,
  partyNameError,
  viewingUser,
  editMode,
  onEdit,
  containerClassName,
}) => {
  return (
    <div className={classNames("ProfileModalBasicInfo", containerClassName)}>
      <div className="ProfileModalBasicInfo__left-container">
        <ProfileModalAvatar viewingUser={viewingUser} />
        <div
          className={classNames("ProfileModalBasicInfo--section", {
            "ProfileModalBasicInfo--grow": editMode,
          })}
        >
          {editMode && register ? (
            <ProfileModalInput
              name={formProp("partyName")}
              defaultValue={viewingUser?.partyName}
              placeholder="Party Name"
              error={partyNameError}
              ref={register({ required: "Party Name cannot be empty" })}
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
