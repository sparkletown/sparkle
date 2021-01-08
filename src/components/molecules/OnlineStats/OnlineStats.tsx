import React, { useCallback, useEffect, useState, useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";
import "firebase/functions";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { openUrl, venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { VenueEvent } from "types/VenueEvent";
import { User } from "types/User";
import "./OnlineStats.scss";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faSearch } from "@fortawesome/free-solid-svg-icons";
import UserProfileModal from "components/organisms/UserProfileModal";
import { useInterval } from "hooks/useInterval";
import VenueInfoEvents from "components/molecules/VenueInfoEvents/VenueInfoEvents";
import { OnlineStatsData } from "types/OnlineStatsData";
import { getRandomInt } from "utils/getRandomInt";
import { peopleAttending, peopleByLastSeenIn } from "utils/venue";
import { useSelector } from "hooks/useSelector";
import { usePartygoers } from "hooks/users";
import { ENABLE_PLAYA_ADDRESS, PLAYA_VENUE_NAME } from "settings";
import { playaAddress } from "utils/address";
import { currentVenueSelectorData } from "utils/selectors";
import { FIVE_MINUTES_MS } from "utils/time";

interface PotLuckButtonProps {
  venues?: Array<WithId<AnyVenue>>;
  afterSelect: () => void;
}

interface AttendanceVenueEvent {
  venue: WithId<AnyVenue>;
  currentEvents: Array<VenueEvent>;
  attendance: number;
}

const PotLuckButton: React.FC<PotLuckButtonProps> = ({
  venues,
  afterSelect,
}) => {
  const goToRandomVenue = useCallback(() => {
    if (!venues) return;
    const randomVenue = venues[getRandomInt(venues?.length - 1)];
    afterSelect();

    // there is a bug in useConnectCurrentVenue that does not update correctly on url change
    openUrl(venueInsideUrl(randomVenue.id));
  }, [venues, afterSelect]);
  if (!venues) {
    return <></>;
  }
  return (
    <button onClick={goToRandomVenue} className="btn btn-primary">
      Pot Luck
    </button>
  );
};

const OnlineStats: React.FC = () => {
  const [venuesWithAttendance, setVenuesWithAttendance] = useState<
    OnlineStatsData["openVenues"]
  >([]);
  const [openVenues, setOpenVenues] = useState<OnlineStatsData["openVenues"]>(
    []
  );
  const [liveEvents, setLiveEvents] = useState<Array<VenueEvent>>([]);
  const [loaded, setLoaded] = useState(false);
  const [filterVenueText, setFilterVenueText] = useState("");
  const [filterUsersText, setFilterUsersText] = useState("");
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const venue = useSelector(currentVenueSelectorData);
  const partygoers = usePartygoers();

  const venueName = venue?.name;

  useInterval(() => {
    firebase
      .functions()
      .httpsCallable("stats-getOnlineStats")()
      .then((result) => {
        const { openVenues } = result.data as OnlineStatsData;

        setOpenVenues(openVenues);
        setLoaded(true);
      })
      .catch(Bugsnag.notify);
  }, FIVE_MINUTES_MS);

  useEffect(() => {
    const liveEvents: Array<VenueEvent> = [];
    const venuesWithAttendance: AttendanceVenueEvent[] = [];
    const peopleByLastSeen = peopleByLastSeenIn(venueName ?? "", partygoers);
    openVenues.forEach(
      (venue: {
        venue: WithId<AnyVenue>;
        currentEvents: Array<VenueEvent>;
      }) => {
        const venueAttendance = peopleAttending(peopleByLastSeen, venue.venue);
        liveEvents.push(...venue.currentEvents);
        venuesWithAttendance.push({
          ...venue,
          attendance: venueAttendance ? venueAttendance.length : 0,
        });
      }
    );
    venuesWithAttendance.sort((a, b) => b.attendance - a.attendance);
    setVenuesWithAttendance(venuesWithAttendance);
    setLiveEvents(liveEvents);
  }, [openVenues, partygoers, venue, venueName]);

  const fuseVenues = useMemo(
    () =>
      venuesWithAttendance
        ? new Fuse(venuesWithAttendance, {
            keys: [
              "venue.name",
              "venue.config.landingPageConfig.subtitle",
              "venue.config.landingPageConfig.description",
            ],
          })
        : undefined,
    [venuesWithAttendance]
  );
  const fuseUsers = useMemo(
    () =>
      new Fuse(partygoers, {
        keys: ["partyName"],
      }),
    [partygoers]
  );

  const filteredVenues = useMemo(() => {
    if (filterVenueText === "") return venuesWithAttendance;
    const resultOfSearch: typeof venuesWithAttendance = [];
    fuseVenues &&
      fuseVenues
        .search(filterVenueText)
        .forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuseVenues, filterVenueText, venuesWithAttendance]);

  const filteredUsers = useMemo(() => {
    if (filterUsersText === "") return partygoers;
    const resultOfSearch: WithId<User>[] = [];
    fuseUsers &&
      fuseUsers
        .search(filterUsersText)
        .forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuseUsers, filterUsersText, partygoers]);

  const liveVenues = filteredVenues.filter(
    (venue) => venue.currentEvents.length
  );

  const allVenues = filteredVenues.filter(
    (venue) => !venue.currentEvents.length
  );

  const peopleByLastSeen = useMemo(
    () => peopleByLastSeenIn(venueName ?? "", partygoers),
    [partygoers, venueName]
  );

  const popover = useMemo(
    () =>
      loaded ? (
        <Popover id="popover-onlinestats">
          <Popover.Content>
            <div className="stats-outer-container">
              <div className="stats-modal-container">
                <div className="open-venues">
                  {venuesWithAttendance?.length || 0} venues on{" "}
                  {PLAYA_VENUE_NAME}
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
                    venues={venuesWithAttendance.map((v) => v.venue)}
                    // Force popover to close
                    afterSelect={() => document.body.click()}
                  />
                </div>
                <div className="venues-container">
                  <div>
                    {liveVenues.length && (
                      <>
                        <h5>
                          {liveVenues.length}{" "}
                          {liveVenues.length === 1 ? "Venue" : "Venues"} with
                          live events now
                        </h5>
                        <div className="venues-container">
                          {liveVenues.map(({ venue, currentEvents }, index) => {
                            const attendance =
                              peopleAttending(peopleByLastSeen, venue)
                                ?.length ?? 0;
                            return (
                              <div className="venue-card" key={index}>
                                <div className="img-container">
                                  <img
                                    className="venue-icon"
                                    src={venue.host?.icon}
                                    alt={venue.name}
                                    title={venue.name}
                                  />
                                </div>
                                <span className="venue-name">{venue.name}</span>
                                {attendance > 0 && (
                                  <span className="venue-people">
                                    <b>{attendance}</b> people in this room
                                  </span>
                                )}
                                {ENABLE_PLAYA_ADDRESS && venue.placement && (
                                  <span className="venue-address">
                                    Address:{" "}
                                    {playaAddress(
                                      venue.placement.x,
                                      venue.placement.y
                                    )}
                                  </span>
                                )}
                                <span className="venue-subtitle">
                                  {venue.config?.landingPageConfig.subtitle}
                                </span>

                                <VenueInfoEvents
                                  eventsNow={currentEvents}
                                  venue={venue}
                                  showButton={true}
                                  futureEvents={false}
                                  joinNowButton={false}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <h5>All venues</h5>
                    <div className="venues-container">
                      {allVenues.map(({ venue }, index) => (
                        <div className="venue-card" key={index}>
                          <div className="img-container">
                            <img
                              className="venue-icon"
                              src={venue.host?.icon}
                              alt={venue.name}
                              title={venue.name}
                            />
                          </div>
                          <span className="venue-name">{venue.name}</span>
                          <span className="venue-subtitle">
                            {venue.config?.landingPageConfig.subtitle}
                          </span>

                          <VenueInfoEvents
                            eventsNow={[]}
                            venue={venue}
                            showButton={true}
                            futureEvents={false}
                            joinNowButton={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="users-container">
                <div className="online-users">
                  {partygoers.length} burners live
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
                  {filteredUsers.map(
                    (user, index) =>
                      !user.anonMode && (
                        <div
                          key={index}
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
                      )
                  )}
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
      filteredUsers,
      venuesWithAttendance,
      partygoers,
      allVenues,
      liveVenues,
      peopleByLastSeen,
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
            <FontAwesomeIcon className={"search-icon"} icon={faSearch} />
            {liveEvents.length} live events / {partygoers.length} burners online
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
