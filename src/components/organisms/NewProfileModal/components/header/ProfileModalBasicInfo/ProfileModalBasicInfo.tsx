import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { UserAvatar } from "components/atoms/UserAvatar";
import { ProfileModalBasicTextInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalBasicInfo.scss";
import { formProp } from "components/organisms/NewProfileModal/UserProfileModal";
import React from "react";
import { FormFieldProps } from "types/forms";
import { WithId } from "utils/id";
import { User } from "types/User";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useSameUser } from "hooks/useIsSameUser";
import classNames from "classnames";
import { ContainerClassName } from "types/utility";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  editMode?: boolean;
  onEdit?: () => void;
  register?: FormFieldProps["register"];
}

export const ProfileModalBasicInfo: React.FC<Props> = ({
  register,
  viewingUser,
  editMode,
  onEdit,
  containerClassName,
}) => {
  const sameUser = useSameUser(viewingUser);

  return (
    <div className={classNames("ProfileModalBasicInfo", containerClassName)}>
      <div className="ProfileModalBasicInfo__left-container">
        <div className="ProfileModalBasicInfo__avatar-container">
          <UserAvatar
            viewingUser={viewingUser}
            size="profileModal"
            showStatus={!sameUser}
          />
          {editMode && (
            <div className="ProfileModalBasicInfo__upload-new">Upload new</div>
          )}
        </div>
        <div
          className={classNames("ProfileModalBasicInfo--section", {
            "ProfileModalBasicInfo--grow": editMode,
          })}
        >
          {editMode && register ? (
            <input
              name={formProp("partyName")}
              className="ProfileModalBasicInfo__input"
              defaultValue={viewingUser?.partyName}
              ref={register()}
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
