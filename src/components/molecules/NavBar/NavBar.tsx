import React from "react";
import firebase from "firebase/app";
import "./NavBar.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UpcomingEvent } from "types/UpcomingEvent";
import UpcomingTickets from "components/molecules/UpcomingTickets";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, users, venue } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
    venue: state.firestore.data.currentVenue,
  }));

  const hasUser = user && users && users[user.uid];

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming = venue?.events?.filter(
    (e: UpcomingEvent) => e.ts_utc.valueOf() > now.valueOf()
  );

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

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
        {(hasUser || hasUpcomingEvents) && (
          <div className="icons-container">
            {hasUpcomingEvents && <UpcomingTickets events={futureUpcoming} />}
            {hasUser && (
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
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
