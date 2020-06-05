import React, { useState } from "react";
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
}

const UserList: React.FunctionComponent<PropsType> = ({ users }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const usersToDisplay = isExpanded ? users : users.slice(0, 49);

  return (
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
        {usersToDisplay.map((user) =>
          user.pictureUrl ? (
            <img
              key={user.id}
              className="profile-icon"
              src={user.pictureUrl}
              alt={`${user.partyName} profile`}
            />
          ) : (
            <img
              key={user.id}
              className="profile-icon"
              src="anonymous-profile-icon.jpeg"
              alt={`${user.partyName} profile`}
            />
          )
        )}
      </div>
    </div>
  );
};

export default UserList;
