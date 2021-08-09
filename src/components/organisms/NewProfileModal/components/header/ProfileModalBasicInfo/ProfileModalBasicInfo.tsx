import React from "react";
import classNames from "classnames";

import { ProfileModalAvatar } from "components/organisms/NewProfileModal/components/header/ProfileModalAvatar/ProfileModalAvatar";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon/ProfileModalRoundIcon";
import { ProfileModalBasicTextInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";

import { faPen } from "@fortawesome/free-solid-svg-icons";

import { WithId } from "utils/id";
import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import "./ProfileModalBasicInfo.scss";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  onEdit?: () => void;
}

export const ProfileModalBasicInfo: React.FC<Props> = ({
  viewingUser,
  onEdit,
  containerClassName,
}) => {
  return (
    <div className={classNames("ProfileModalBasicInfo", containerClassName)}>
      <div className="ProfileModalBasicInfo__main-container">
        <ProfileModalAvatar viewingUser={viewingUser} editMode={false} />
        <ProfileModalBasicTextInfo
          containerClassName="ProfileModalBasicInfo--section"
          viewingUser={viewingUser}
        />
      </div>
      <div className="ProfileModalBasicInfo__edit-container">
        {onEdit && (
          <ProfileModalRoundIcon
            containerClassName="ProfileModalBasicInfo--section"
            onClick={onEdit}
            icon={faPen}
            size="sm"
          />
        )}
      </div>
    </div>
  );
};
