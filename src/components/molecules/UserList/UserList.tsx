import React, { useState } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";
import { User } from "types/User";
import "./UserList.scss";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  users: User[];
  limit?: number;
  imageSize?: number;
  activity?: string;
  disableSeeAll?: boolean;
  isAudioEffectDisabled?: boolean;
}

const UserList: React.FunctionComponent<PropsType> = ({
  users,
  limit = 60,
  imageSize = 40,
  activity = "partying",
  disableSeeAll = true,
  isAudioEffectDisabled,
}) => {
  const [isExpanded, setIsExpanded] = useState(disableSeeAll);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();
  users = users?.filter((user) => user.partyName && user.id); // quick fix to get rid of anonymous users
  const usersToDisplay = isExpanded ? users : users?.slice(0, limit);
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));

  if (!users) return <></>;

  return (
    <>
      <div className="userlist-container">
        <div className="row header no-margin">
          <p>
            <span className="bold">{users.length}</span>{" "}
            {users.length === 1 ? "person" : "people"} {activity}
          </p>
          {!disableSeeAll && users.length > limit && (
            <p
              className="clickable-text"
              onClick={() => setIsExpanded(!isExpanded)}
              id={`see-venue-information-${venue.name}`}
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
                  imageSize={imageSize}
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
