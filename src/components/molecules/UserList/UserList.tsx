import React, { useState } from "react";

// Components
import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";

// Hooks
import { useSelector } from "hooks/useSelector";

// Utils | Settings | Constants
import { WithId } from "utils/id";
import { currentVenueSelectorData } from "utils/selectors";
import { DEFAULT_USER_LIST_LIMIT } from "settings";
import { IS_BURN } from "secrets";

// Typings
import { User } from "types/User";

// Styles
import "./UserList.scss";

interface PropsType {
  users: readonly WithId<User>[];
  limit?: number;
  imageSize?: number;
  activity?: string;
  disableSeeAll?: boolean;
  isAudioEffectDisabled?: boolean;
  isCamp?: boolean;
  attendanceBoost?: number;
}

const UserList: React.FunctionComponent<PropsType> = ({
  users: _users,
  limit = DEFAULT_USER_LIST_LIMIT,
  imageSize = 40,
  activity = "partying",
  disableSeeAll = true,
  isAudioEffectDisabled,
  isCamp,
  attendanceBoost,
}) => {
  const [isExpanded, setIsExpanded] = useState(disableSeeAll);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const usersSanitized = _users?.filter(
    (user) => !user.anonMode && user.partyName && user.id
  );
  const usersToDisplay = isExpanded
    ? usersSanitized
    : usersSanitized?.slice(0, limit);
  const attendance = usersSanitized.length + (attendanceBoost ?? 0);
  const venue = useSelector(currentVenueSelectorData);

  if (!usersSanitized || attendance < 1) return <></>;
  return (
    <>
      <div className="userlist-container">
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
                  setSelectedUserProfile={setSelectedUserProfile}
                  isAudioEffectDisabled={isAudioEffectDisabled}
                  key={`${user.id}-${activity}-${imageSize}`}
                />
              )
          )}
        </div>
      </div>

      <UserProfileModal
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
        userProfile={selectedUserProfile}
      />
    </>
  );
};

export default UserList;
