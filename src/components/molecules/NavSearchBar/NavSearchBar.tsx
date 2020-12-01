import UserProfileModal from "components/organisms/UserProfileModal";
import { RoomModal } from "components/templates/PartyMap/components";
import { useSelector } from "hooks/useSelector";
import React, { useCallback, useEffect, useState } from "react";
import { CampRoomData } from "types/CampRoomData";
import { User } from "types/User";
import { VenueEvent } from "types/VenueEvent";
import { WithId } from "utils/id";
import {
  currentVenueSelectorData,
  partygoersSelector,
  venueEventsSelector,
} from "utils/selectors";
import { isTruthy } from "utils/types";
import "./NavSearchBar.scss";
import { NavSearchBarInput } from "./NavSearchBarInput";

interface SearchResult {
  rooms: CampRoomData[];
  users: WithId<User>[];
  events: VenueEvent[];
}

const NavSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult>({
    rooms: [],
    users: [],
    events: [],
  });
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [selectedRoom, setSelectedRoom] = useState<CampRoomData>();

  const venue = useSelector(currentVenueSelectorData);
  const partygoers = useSelector(partygoersSelector);
  const venueEvents = useSelector(venueEventsSelector);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult({
        rooms: [],
        users: [],
        events: [],
      });
      return;
    }
    const filteredPartygoers = partygoers
      ? Object.values(partygoers).filter((partygoer) =>
          partygoer.partyName
            ?.toLowerCase()
            ?.includes(searchQuery.toLowerCase())
        )
      : [];
    const filteredEvents = venueEvents
      ? Object.values(venueEvents).filter((event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
    const filteredRooms =
      venue && venue.rooms
        ? (venue?.rooms as CampRoomData[]).filter((room) =>
            room.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
    setSearchResult({
      rooms: filteredRooms,
      users: filteredPartygoers,
      events: filteredEvents,
    });
  }, [partygoers, searchQuery, venue, venueEvents]);

  const numberOfSearchResults =
    searchResult.rooms.length +
    searchResult.events.length +
    searchResult.users.length;

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="nav-search-links">
      <div className="nav-search-icon" />
      <NavSearchBarInput value={searchQuery} onChange={setSearchQuery} />
      {isTruthy(searchQuery) && (
        <div className="nav-search-close-icon" onClick={clearSearchQuery} />
      )}
      {isTruthy(numberOfSearchResults) && (
        <>
          <div className="nav-search-results">
            <div className="nav-search-result-number">
              <b>{numberOfSearchResults}</b> search results
            </div>
            {searchResult.rooms.map((room, index) => {
              return (
                <div
                  className="row"
                  key={`room-${index}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div
                    className="result-avatar"
                    style={{
                      backgroundImage: `url(${room.image_url})`,
                    }}
                  ></div>
                  <div className="result-info">
                    <div className="result-title">{room.title}</div>
                    <div>Room</div>
                  </div>
                </div>
              );
            })}
            {searchResult.events.map((event, index) => {
              return (
                <div className="row" key={`event-${index}`}>
                  <div>
                    <div>{event.name}</div>
                    <div>Event</div>
                  </div>
                </div>
              );
            })}
            {searchResult.users.map((user, index) => {
              return (
                <div
                  className="row"
                  key={`room-${index}`}
                  onClick={() => setSelectedUserProfile(user)}
                >
                  <div
                    className="result-avatar"
                    style={{
                      backgroundImage: `url(${user.pictureUrl})`,
                    }}
                  ></div>
                  <div className="result-info">
                    <div key={`user-${index}`}>{user.partyName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
      <RoomModal
        show={isTruthy(selectedRoom)}
        room={selectedRoom}
        onHide={() => setSelectedRoom(undefined)}
      />
    </div>
  );
};

export default NavSearchBar;
