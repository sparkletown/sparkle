import React, { useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import "firebase/functions";
import { OverlayTrigger, Popover } from "react-bootstrap";
import UserList from "../UserList";
import { useHistory } from "react-router-dom";
import { venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";

import "./OnlineStats.scss";

const OnlineStats: React.FC = () => {
  const history = useHistory();
  const [onlineUsers, setOnlineUsers] = useState<WithId<User>[]>([]);
  const [openVenues, setOpenVenues] = useState<WithId<AnyVenue>[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getOnlineStats");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { onlineUsers, openVenues } = result.data as any;
          setOnlineUsers(onlineUsers);
          setOpenVenues(openVenues);
          setLoaded(true);
        })
        .catch(() => {}); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, 5 * 1000);
    return () => clearInterval(id);
  }, []);

  const popover = useMemo(
    () =>
      loaded ? (
        <Popover id="popover-onlinestats">
          <Popover.Content>
            <div className="stats-modal-container">
              <div className="online-users">
                <h1 className="title modal-title">People Online</h1>
                <UserList users={onlineUsers} activity="online" />
              </div>
              <div className="open-venues">
                <h1 className="title modal-title">Venues Open</h1>
                <span className="bold">{openVenues?.length || 0}</span> venues
                open
                {openVenues.map((venue, index) => (
                  <div
                    key={index}
                    onClick={() => history.push(venueInsideUrl(venue.id))}
                  >
                    <img
                      className="venue-icon"
                      src={venue.host.icon}
                      alt={venue.name}
                      title={venue.name}
                    />
                    <span className="venue-name">{venue.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Popover.Content>
        </Popover>
      ) : (
        <></>
      ),
    [history, loaded, onlineUsers, openVenues]
  );

  return (
    <>
      {loaded && (
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          overlay={popover}
          rootClose
        >
          <small className="counter">
            {onlineUsers.length} people online, {openVenues.length} venues open
          </small>
        </OverlayTrigger>
      )}
    </>
  );
};

export default OnlineStats;
