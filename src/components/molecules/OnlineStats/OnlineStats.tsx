import React, { useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import "firebase/functions";
import { OverlayTrigger, Popover } from "react-bootstrap";
// import { useHistory } from "react-router-dom";
import { venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";

import "./OnlineStats.scss";
import Fuse from "fuse.js";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max + 1));
};

interface PoLuckButtonProps {
  openVenues?: Array<WithId<AnyVenue>>;
  afterSelect: () => void;
}
const PotLuckButton: React.FC<PoLuckButtonProps> = ({
  openVenues,
  afterSelect,
}) => {
  // const history = useHistory();
  const goToRandomVenue = useCallback(() => {
    if (!openVenues) return;
    const randomVenue = openVenues[getRandomInt(openVenues?.length - 1)];
    afterSelect();

    // there is a bug in useConnectCurrentVenue that does not update correctly on url change
    // history.push(venueInsideUrl(randomVenue.id));
    window.location.href = venueInsideUrl(randomVenue.id);
  }, [/*history,*/ openVenues, afterSelect]);
  if (!openVenues) {
    return <></>;
  }
  return (
    <button onClick={goToRandomVenue} className="btn btn-primary">
      Pot Luck
    </button>
  );
};

const OnlineStats: React.FC = () => {
  // const history = useHistory();
  const [onlineUsers, setOnlineUsers] = useState<WithId<User>[]>([]);
  const [openVenues, setOpenVenues] = useState<WithId<AnyVenue>[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filterText, setFilterText] = useState("");

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

  const fuse = useMemo(
    () =>
      openVenues
        ? new Fuse(openVenues, {
            keys: [
              "name",
              "config.landingPageConfig.subtitle",
              "config.landingPageConfig.description",
            ],
          })
        : undefined,
    [openVenues]
  );

  const filteredVenues = useMemo(() => {
    if (filterText === "") return openVenues;
    const resultOfSearch: WithId<AnyVenue>[] = [];
    fuse && fuse.search(filterText).forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuse, filterText, openVenues]);

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
                  onChange={(e) => setFilterText(e.target.value)}
                  value={filterText}
                />
                <PotLuckButton
                  openVenues={openVenues}
                  // Force popover to close
                  afterSelect={() => document.body.click()}
                />
              </div>
              <div className="venues-container">
                {filteredVenues.map((venue, index) => (
                  <div
                    className="venue-card"
                    key={index}
                    // there is a bug in useConnectCurrentVenue that does not update correctly on url change
                    // onClick={() => history.push(venueInsideUrl(venue.id))}
                    onClick={() =>
                      (window.location.href = venueInsideUrl(venue.id))
                    }
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
    [/*history,*/ loaded, filteredVenues, filterText, openVenues]
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
