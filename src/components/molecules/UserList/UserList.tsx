import React, { useState } from "react";
import classNames from "classnames";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { useSelector } from "hooks/useSelector";

import { WithId } from "utils/id";
import { currentVenueSelectorData } from "utils/selectors";
import { DEFAULT_USER_LIST_LIMIT } from "settings";
import { IS_BURN } from "secrets";

import { User } from "types/User";

import "./UserList.scss";

interface UserListProps {
  users: readonly WithId<User>[];
  limit?: number;
  imageSize?: number;
  activity?: string;
  disableSeeAll?: boolean;
  isAudioEffectDisabled?: boolean;
  isCamp?: boolean;
  attendanceBoost?: number;
  showEvenWhenNoUsers?: boolean;
  containerClassName?: string;
}

export const UserList: React.FC<UserListProps> = ({
  users: _users,
  limit = DEFAULT_USER_LIST_LIMIT,
  imageSize = 40,
  activity = "partying",
  disableSeeAll = true,
  isAudioEffectDisabled,
  isCamp,
  attendanceBoost,
  showEvenWhenNoUsers = false,
  containerClassName,
}) => {
  const [isExpanded, setIsExpanded] = useState(disableSeeAll);

  const usersSanitized = _users.filter(
    (user) => !user.anonMode && user.partyName && user.id
  );

  const usersToDisplay = isExpanded
    ? usersSanitized
    : usersSanitized?.slice(0, limit);

  const attendance = usersSanitized.length + (attendanceBoost ?? 0);
  const venue = useSelector(currentVenueSelectorData);

  const containerClasses = classNames(
    "container",
    "userlist-container",
    containerClassName
  );

  if (!showEvenWhenNoUsers && attendance < 1) return null;

  return (
    <div className={containerClasses}>
      <div className="row header no-margin">
        <p>
          <span className="bold">{attendance}</span>{" "}
          {attendance === 1 ? "person" : "people"}{" "}
          {isCamp && IS_BURN ? "in the camp" : activity}
        </p>

        {!disableSeeAll && usersSanitized.length > limit && (
          <p
            className="clickable-text"
            onClick={() => setIsExpanded(!isExpanded)}
            id={`see-venue-information-${venue?.name}`}
          >
            See {isExpanded ? "less" : "all"}
          </p>
        )}
      </div>

      <div className="row no-margin">
        {usersToDisplay.map(
          (user) =>
            user && (
              <UserProfilePicture
                user={user}
                isAudioEffectDisabled={isAudioEffectDisabled}
                key={`${user.id}-${activity}-${imageSize}`}
              />
            )
        )}
      </div>
    </div>
  );
};

export default UserList;
