import React, { useCallback, useEffect, useState } from "react";

import { VenueEvent } from "types/venues";
import { Room, RoomTypes } from "types/rooms";
import { User } from "types/User";

import UserProfileModal from "components/organisms/UserProfileModal";
import { RoomModal } from "components/templates/PartyMap/components";

import { useWorldUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";

import { WithId } from "utils/id";
import { currentVenueSelectorData, venueEventsSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import "./NavSearchBar.scss";
import { InputField } from "components/atoms/InputField";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchResult {
  rooms: Room[];
  users: readonly WithId<User>[];
  events: VenueEvent[];
}

const NavSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const onSearchInputChange = useCallback(
    (e) => setSearchQuery(e.target.value),
    []
  );

  const [searchResult, setSearchResult] = useState<SearchResult>({
    rooms: [],
    users: [],
    events: [],
  });

  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const hasSelectedRoom = !!selectedRoom;

  const venue = useSelector(currentVenueSelectorData);

  const venueEvents = useSelector(venueEventsSelector) ?? [];
  const { worldUsers } = useWorldUsers();

  useEffect(() => {
    const normalizedSearchQuery = searchQuery.toLowerCase();
    if (!normalizedSearchQuery) {
      setSearchResult({
        rooms: [],
        users: [],
        events: [],
      });
      return;
    }

    const venueUsersResults = worldUsers.filter((user) =>
      user.partyName?.toLowerCase()?.includes(normalizedSearchQuery)
    );

    const venueEventsResults = venueEvents.filter((event) =>
      event.name.toLowerCase().includes(normalizedSearchQuery)
    );

    const roomsResults: Room[] =
      venue?.rooms?.filter(
        (room) =>
          room.title.toLowerCase().includes(normalizedSearchQuery) &&
          room.type !== RoomTypes.unclickable
      ) ?? [];

    setSearchResult({
      rooms: roomsResults,
      users: venueUsersResults,
      events: venueEventsResults,
    });
  }, [searchQuery, venue, venueEvents, worldUsers]);

  const numberOfSearchResults =
    searchResult.rooms.length +
    searchResult.events.length +
    searchResult.users.length;

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearSearchIcon = (
    <img
      className="nav__clear-search"
      src="/icons/nav-dropdown-close.png"
      alt="close button"
      onClick={clearSearchQuery}
    />
  );

  return (
    <div className="nav-search-links">
      <InputField
        className="nav__search"
        value={searchQuery}
        onChange={onSearchInputChange}
        placeholder="Search for people, rooms, events..."
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
      />

      {numberOfSearchResults > 0 && (
        <div className="nav-search-results">
          <div className="nav-search-result-number">
            <b>{numberOfSearchResults}</b> search results
          </div>

          {/* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but rooms don't have a unique identifier */}
          {searchResult.rooms.map((room, index) => {
            return (
              <div
                className="row"
                key={`room-${room.title}-${index}`}
                onClick={() => {
                  setSelectedRoom(room);
                  clearSearchQuery();
                }}
              >
                <div
                  className="result-avatar"
                  style={{
                    backgroundImage: `url(${room.image_url})`,
                  }}
                />
                <div className="result-info">
                  <div className="result-title">{room.title}</div>
                  <div>Room</div>
                </div>
              </div>
            );
          })}

          {searchResult.events.map((event) => {
            return (
              <div className="row" key={`event-${event.id ?? event.name}`}>
                <div>
                  <div>{event.name}</div>
                  <div>Event</div>
                </div>
              </div>
            );
          })}

          {searchResult.users.map((user) => {
            return (
              <div
                className="row"
                key={`user-${user.id}`}
                onClick={() => {
                  setSelectedUserProfile(user);
                  clearSearchQuery();
                }}
              >
                <div
                  className="result-avatar"
                  style={{
                    backgroundImage: `url(${user.pictureUrl})`,
                  }}
                />
                <div className="result-info">
                  <div>{user.partyName}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* @debt use only one UserProfileModal instance with state controlled with redux  */}
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
      {/* @debt use only one RoomModal instance with state controlled with redux */}
      <RoomModal
        show={hasSelectedRoom}
        room={selectedRoom}
        venue={venue}
        onHide={() => setSelectedRoom(undefined)}
      />
    </div>
  );
};

export default NavSearchBar;
