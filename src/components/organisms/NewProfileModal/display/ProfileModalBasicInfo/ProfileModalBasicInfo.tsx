import { UserAvatar } from "../../../../atoms/UserAvatar";
import { ProfileModalBasicTextInfo } from "../ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalBasicInfo.scss";
import React from "react";
import { WithId } from "../../../../../utils/id";
import { User } from "../../../../../types/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useSameUser } from "../../../../../hooks/useIsSameUser";
import classNames from "classnames";

interface Props {
  viewingUser: WithId<User>;
  editMode?: boolean;
  onEdit?: () => void;
}

export const ProfileModalBasicInfo: React.FC<Props> = ({
  viewingUser,
  editMode,
  onEdit,
}) => {
  const sameUser = useSameUser(viewingUser);

  return (
    <div className="ProfileModalBasicInfo">
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
          {editMode ? (
            <input
              name={"party-name"}
              className="ProfileModalBasicInfo--input"
              value={viewingUser?.partyName}
            />
          ) : (
            <ProfileModalBasicTextInfo viewingUser={viewingUser} />
          )}
        </div>
      </div>
      {onEdit && !editMode && (
        <div className="ProfileModalBasicInfo__edit-container">
          <div className="ProfileModalBasicInfo__edit" onClick={onEdit}>
            <FontAwesomeIcon icon={faPen} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
};
