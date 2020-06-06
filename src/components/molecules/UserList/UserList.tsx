import React, { useState } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";

import "./UserList.scss";

interface User {
  id: string;
  gratefulFor?: string;
  islandCompanion?: string;
  likeAboutParties?: string;
  partyName?: string;
  pictureUrl?: string;
}

interface PropsType {
  users: User[];
  limit?: number;
}

const UserList: React.FunctionComponent<PropsType> = ({
  users,
  limit = 49,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  const usersToDisplay = isExpanded ? users : users.slice(0, limit);

  return (
    <>
      <div className="userlist-container">
        <div className="row header no-margin">
          <p>
            <span className="bold">{users.length}</span> people partying
          </p>
          <p
            className="clickabke-text"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            See {isExpanded ? "less" : "all"}
          </p>
        </div>
        <div className="row no-margin">
          {usersToDisplay.map((user) => (
            <img
              onClick={() => setSelectedUserProfile(user)}
              key={user.id}
              className="profile-icon"
              src={user.pictureUrl || "anonymous-profile-icon.jpeg"}
              alt={`${user.partyName} profile`}
            />
          ))}
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
