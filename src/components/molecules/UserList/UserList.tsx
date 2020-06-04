import React from "react";
import "./UserList.scss";

interface User {
  id: string;
  gratefulFor?: string;
  islandCompanion?: string;
  likeAboutParties?: string;
  partyName?: string;
}

interface PropsType {
  users: User[];
}

const UserList: React.FunctionComponent<PropsType> = ({ users }) => (
  <div className="userlist-container">
    <div className="row header">
      <p>
        <span className="bold">{users.length}</span> people partying
      </p>
      <p className="clickabke-text">See all</p>
    </div>
    <div className="row">
      {users.slice(0, 49).map((user) => (
        <img
          key={user.id}
          className="profile-icon"
          src="anonymous-profile-icon.jpeg"
          alt={`${user.partyName} profile`}
        />
      ))}
    </div>
  </div>
);

export default UserList;
