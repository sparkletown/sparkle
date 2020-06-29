import React, { useState } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";
import { User } from "types/User";

import "./UserList.scss";
import UserProfilePicture from "components/molecules/UserProfilePicture";

interface PropsType {
  users: User[];
  limit?: number;
  imageSize?: number;
  activity?: string;
  disableSeeAll?: boolean;
}

const UserList: React.FunctionComponent<PropsType> = ({
  users,
  limit = 60,
  imageSize = 40,
  activity = "partying",
  disableSeeAll = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(disableSeeAll);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  const usersToDisplay = isExpanded ? users : users.slice(0, limit);

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
