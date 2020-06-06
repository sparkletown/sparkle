import React from "react";
import "./NavBar.scss";
import { useFirebase } from "react-redux-firebase";

const NavBar = ({ isUserLoggedIn }) => {
  const firebase = useFirebase();

  const logout = (event) => {
    firebase.auth().signOut();
  };

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark navbar-container">
        <div className="container">
          <span className="navbar-brand title">Co-Reality</span>
          {isUserLoggedIn && (
            <span onClick={logout} className="logout-span">
              Log out
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
