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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import UserProfileModal from "components/organisms/UserProfileModal";
import VenueInfoEvents from "../VenueInfoEvents/VenueInfoEvents";
import { OnlineStatsData } from "types/OnlineStatsData";
import { getRandomInt } from "../../../utils/getRandomInt";

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
    OnlineStatsData["onlineUsers"]
  >([]);
  const [openVenues, setOpenVenues] = useState<OnlineStatsData["openVenues"]>(
    []
  );
  const [loaded, setLoaded] = useState(false);
  const [filterVenueText, setFilterVenueText] = useState("");
  const [filterUsersText, setFilterUsersText] = useState("");
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getOnlineStats");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { onlineUsers, openVenues } = result.data as OnlineStatsData;
          setOnlineUsers(onlineUsers);
          setOpenVenues(openVenues);
          setLoaded(true);
        })
        .catch(() => {}); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  const fuseVenues = useMemo(
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
  const fuseUsers = useMemo(
    () =>
      new Fuse(onlineUsers, {
        keys: ["partyName"],
      }),
    [onlineUsers]
  );

  const filteredVenues = useMemo(() => {
    if (filterVenueText === "") return openVenues;
    const resultOfSearch: typeof openVenues = [];
    fuseVenues &&
      fuseVenues
        .search(filterVenueText)
        .forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuseVenues, filterVenueText, openVenues]);

  const filteredUsers = useMemo(() => {
    if (filterUsersText === "") return onlineUsers;
    const resultOfSearch: typeof onlineUsers = [];
    fuseUsers &&
      fuseUsers
        .search(filterUsersText)
        .forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuseUsers, filterUsersText, onlineUsers]);

  const popover = useMemo(
    () =>
      loaded ? (
        <Popover id="popover-onlinestats">
          <Popover.Content>
            <div className="stats-outer-container">
              <div className="stats-modal-container">
                <div className="open-venues">
                  {openVenues?.length || 0} venues open now
                </div>
                <div className="search-container">
                  <input
                    type={"text"}
                    className="search-bar"
                    placeholder="Search venues"
                    onChange={(e) => setFilterVenueText(e.target.value)}
                    value={filterVenueText}
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
                      <VenueInfoEvents
                        eventsNow={currentEvents}
                        venue={venue}
                        showButton={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="users-container">
                <div className="online-users">
                  {onlineUsers.length} burners live
                </div>
                <div className="search-container">
                  <input
                    type={"text"}
                    className="search-bar"
                    placeholder="Search people"
                    onChange={(e) => setFilterUsersText(e.target.value)}
                    value={filterUsersText}
                  />
                </div>
                <div className="people">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="user-row"
                      onClick={() => setSelectedUserProfile(user)}
                    >
                      <div>
                        <img src={user.pictureUrl} alt="user profile pic" />
                        <span>{user.partyName}</span>
                      </div>
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        className="chat-icon"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover>
      ) : (
        <></>
      ),
    [
      loaded,
      filterVenueText,
      filterUsersText,
      filteredVenues,
      openVenues,
      onlineUsers,
      filteredUsers,
    ]
  );

  return (
    <>
      {loaded && (
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          overlay={popover}
          rootClose={!selectedUserProfile} // allows modal inside popover
        >
          <span>
            {openVenues.length} venues open now / {onlineUsers.length} burners
            live
          </span>
        </OverlayTrigger>
      )}
      <UserProfileModal
        zIndex={2000} // popover has 1060 so needs to be greater than that to show on top
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </>
  );
};

export default OnlineStats;
