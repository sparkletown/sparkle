import React, { useCallback, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import "firebase/functions";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { venuePlayaPreviewUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";

import "./OnlineStats.scss";
import Fuse from "fuse.js";
import { EventData } from "types/EventData";

interface getOnlineStatsData {
  onlineUsers: Array<WithId<User>>;
  openVenues: Array<{
    venue: WithId<AnyVenue>;
    currentEvents: EventData;
  }>;
}

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
    window.location.href = venuePlayaPreviewUrl(randomVenue.id);
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
  const [onlineUsers, setOnlineUsers] = useState<
    getOnlineStatsData["onlineUsers"]
  >([]);
  const [openVenues, setOpenVenues] = useState<
    getOnlineStatsData["openVenues"]
  >([]);
  const [loaded, setLoaded] = useState(false);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getOnlineStats");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { onlineUsers, openVenues } = result.data as getOnlineStatsData;
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
              "venue.name",
              "venue.config.landingPageConfig.subtitle",
              "venue.config.landingPageConfig.description",
            ],
          })
        : undefined,
    [openVenues]
  );

  const filteredVenues = useMemo(() => {
    if (filterText === "") return openVenues;
    const resultOfSearch: typeof openVenues = [];
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
                {filteredVenues?.length || 0} venues open now
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
                  openVenues={openVenues.map((ov) => ov.venue)}
                  // Force popover to close
                  afterSelect={() => document.body.click()}
                />
              </div>
              <div className="venues-container">
                {filteredVenues.map(({ venue, currentEvents }, index) => (
                  <div className="venue-card" key={index}>
                    <span className="venue-name">{venue.name}</span>
                    <span className="venue-subtitle">
                      {venue.config?.landingPageConfig.subtitle}
                    </span>
                    <div className="img-container">
                      <img
                        className="venue-icon"
                        src={venue.host.icon}
                        alt={venue.name}
                        title={venue.name}
                      />
                    </div>
                    <div className="venue-info-container">
                      <div className="whats-on-container">
                        <div className="title-container">
                          <img src="/sparkle-icon.png" alt="sparkle icon" />
                          <span className="title">{`What's on now`}</span>
                        </div>
                        <div className="description-container">
                          {currentEvents.length > 0 ? (
                            <>
                              <span className="yellow">
                                {currentEvents[0].name}
                              </span>
                              <span> by </span>
                              <span className="yellow">
                                {currentEvents[0].host}
                              </span>
                            </>
                          ) : (
                            <span className="yellow">No events currently</span>
                          )}
                        </div>
                      </div>
                      <div className="centered-flex">
                        <button
                          className="btn btn-primary"
                          // @debt would be nice not to refresh the page
                          onClick={() =>
                            (window.location.href = venuePlayaPreviewUrl(
                              venue.id
                            ))
                          }
                        >
                          View on Playa
                        </button>
                      </div>
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
    [loaded, filterText, filteredVenues, openVenues]
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
