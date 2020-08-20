import React, { useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import "firebase/functions";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";

import "./OnlineStats.scss";
import { useSelector } from "hooks/useSelector";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max + 1));
};

const PotLuckButton = () => {
  const history = useHistory();
  const openedVenues = useSelector(
    (state) => state.firestore.ordered.statsOpenVenues
  );
  const goToRandomVenue = useCallback(() => {
    if (!openedVenues) return;
    const randomVenue = openedVenues[getRandomInt(openedVenues?.length - 1)];
    history.push(venueInsideUrl(randomVenue.id));
  }, [history, openedVenues]);
  if (!openedVenues) {
    return <></>;
  }
  return (
    <button onClick={goToRandomVenue} className="btn btn-primary">
      Pot Luck
    </button>
  );
};

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
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const popover = useMemo(
    () =>
      loaded ? (
        <Popover id="popover-onlinestats">
          <Popover.Content>
            <div className="stats-modal-container">
              <div className="open-venues">
                {openVenues?.length || 0} venues open now
              </div>
              <div className="search-container">
                <input
                  type={"text"}
                  className="search-bar"
                  placeholder="Search venues"
                />
                <PotLuckButton
                  openVenues={openVenues}
                  // Force popover to close
                  afterSelect={() => document.body.click()}
                />
              </div>
              <div className="venues-container">
                {openVenues.map((venue, index) => (
                  <div
                    className="venue-card"
                    key={index}
                    onClick={() => history.push(venueInsideUrl(venue.id))}
                  >
                    <span className="venue-name">{venue.name}</span>
                    <div className="img-container">
                      <img
                        className="venue-icon"
                        src={venue.host.icon}
                        alt={venue.name}
                        title={venue.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Popover.Content>
        </Popover>
      ) : (
        <></>
      ),
    [history, loaded, openVenues]
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
          <span>
            {openVenues.length} venues open now / {onlineUsers.length} burners
            live
          </span>
        </OverlayTrigger>
      )}
    </>
  );
};

export default OnlineStats;
