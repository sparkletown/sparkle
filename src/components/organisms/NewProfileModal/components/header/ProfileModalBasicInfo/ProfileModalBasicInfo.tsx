import React from "react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { ProfileModalAvatar } from "components/organisms/NewProfileModal/components/header/ProfileModalAvatar";
import { ProfileModalBasicTextInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicTextInfo";
import { ProfileModalRoundIcon } from "components/organisms/NewProfileModal/components/ProfileModalRoundIcon";

import "./ProfileModalBasicInfo.scss";

export interface ProfileModalBasicInfoProps extends ContainerClassName {
  user: WithId<User>;
  onEdit?: () => void;
}

export const ProfileModalBasicInfo: React.FC<ProfileModalBasicInfoProps> = ({
  user,
  onEdit,
  containerClassName,
}) => {
  return (
    <div className={classNames("ProfileModalBasicInfo", containerClassName)}>
      <div className="ProfileModalBasicInfo__main-container">
        <ProfileModalAvatar user={user} editMode={false} />
        <ProfileModalBasicTextInfo
          containerClassName="ProfileModalBasicInfo--section"
          user={user}
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
