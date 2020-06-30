import React from "react";
import "./NavBar.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, users } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark navbar-container">
        <Link to={redirectionUrl || "/"}>
          <span className="navbar-brand title">
            <img
              className="sparkle-icon"
              src="/sparkle-header.png"
              alt="Sparkle collective"
            />
          </span>
        </Link>
        {user && users && users[user.uid] && (
          <div>
            <Link to="/account/edit">
              <img
                src={users[user.uid].pictureUrl}
                className="profile-icon"
                alt="avatar"
                width="40"
                height="40"
              />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
