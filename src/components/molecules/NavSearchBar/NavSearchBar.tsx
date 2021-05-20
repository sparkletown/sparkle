import React, { useCallback, useState, ChangeEvent, useMemo } from "react";
import classNames from "classnames";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_VENUE_LOGO,
  KEYBOARD_SHORTCUTS,
} from "settings";

import { VenueEvent } from "types/venues";
import { Room, RoomTypes } from "types/rooms";

import { isTruthy } from "utils/types";
import { uppercaseFirstChar } from "utils/string";
import { formatUtcSecondsRelativeToNow } from "utils/time";
import { currentVenueSelectorData, venueEventsSelector } from "utils/selectors";

import { useWorldUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useDebounceSearch } from "hooks/useDebounceSearch";
import { useMousetrap } from "hooks/useMousetrap";

import { RoomModal } from "components/templates/PartyMap/components";

import { InputField } from "components/atoms/InputField";

import navDropdownCloseIcon from "assets/icons/nav-dropdown-close.png";

import { NavSearchResult } from "./NavSearchResult";

import "./NavSearchBar.scss";

const emptyEventsArray: VenueEvent[] = [];

const NavSearchBar = () => {
  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
    clearSearch,
  } = useDebounceSearch();

  const onSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [setSearchInputValue]
  );

  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const hasSelectedRoom = !!selectedRoom;

  const venue = useSelector(currentVenueSelectorData);
  const venueEvents = useSelector(venueEventsSelector) ?? emptyEventsArray;
  const { worldUsers } = useWorldUsers();

  const { openUserProfileModal } = useProfileModalControls();

  const foundRooms = useMemo<JSX.Element[]>(() => {
    if (!searchQuery) return [];

    /* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but rooms don't have a unique identifier */
    return (
      venue?.rooms
        ?.filter(
          (room) =>
            room.type !== RoomTypes.unclickable &&
            room.title.toLowerCase().includes(searchQuery)
        )
        .map((room, index) => (
          <NavSearchResult
            key={`room-${room.title}-${index}`}
            title={room.title}
            description="Room"
            image={room.image_url}
            onClick={() => {
              setSelectedRoom(room);
              clearSearch();
            }}
          />
        )) ?? []
    );
  }, [searchQuery, venue, clearSearch]);

  const foundUsers = useMemo<JSX.Element[]>(() => {
    if (!searchQuery) return [];

    return worldUsers
      .filter((user) => user.partyName?.toLowerCase().includes(searchQuery))
      .map((user) => (
        <NavSearchResult
          key={`user-${user.id}`}
          title={user.partyName ?? DEFAULT_PARTY_NAME}
          user={user}
          onClick={() => {
            openUserProfileModal(user);
            clearSearch();
          }}
        />
      ));
  }, [searchQuery, worldUsers, clearSearch, openUserProfileModal]);

  const foundEvents = useMemo<JSX.Element[]>(() => {
    if (!searchQuery) return [];

    return venueEvents
      .filter((event) => event.name.toLowerCase().includes(searchQuery))
      .map((event) => {
        const imageUrl =
          venue?.rooms?.find((room) => room.title === event.room)?.image_url ??
          venue?.host?.icon;

        return (
          <NavSearchResult
            key={`event-${event.id ?? event.name}`}
            title={event.name}
            description={`Event - ${uppercaseFirstChar(
              formatUtcSecondsRelativeToNow(event.start_utc_seconds)
            )}`}
            image={imageUrl ?? DEFAULT_VENUE_LOGO}
          />
        );
      });
  }, [searchQuery, venueEvents, venue]);

  const numberOfSearchResults =
    foundRooms.length + foundEvents.length + foundUsers.length;

  const clearSearchIcon = (
    <img
      className="NavSearchBar__clear-search"
      src={navDropdownCloseIcon}
      alt="close button"
      onClick={clearSearch}
    />
  );

  const navDropdownClassnames = useMemo(
    () =>
      classNames("NavSearchBar__nav-dropdown", {
        "NavSearchBar__nav-dropdown--show": isTruthy(searchQuery),
      }),
    [searchQuery]
  );

  const focusSearchBar = useCallback((e) => {
    e.preventDefault();
    const searchBar = document.getElementById("NavSearchBar__search-input");
    if (searchBar) searchBar.focus();
    // TODO: we need to remove "f" from being entered into the input which would happen now
  }, []);

  useMousetrap({
    keys: KEYBOARD_SHORTCUTS.search,
    callback: focusSearchBar,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  return (
    <div className="NavSearchBar">
      <div className={navDropdownClassnames}>
        <div className="NavSearchBar__nav-dropdown__title font-size--small">
          <strong className="NavSearchBar__search-results-number">
            {numberOfSearchResults}
          </strong>{" "}
          search results
        </div>

        <div className="NavSearchBar__search-results">
          {foundRooms}
          {foundEvents}
          {foundUsers}
        </div>
      </div>

      <InputField
        value={searchInputValue}
        inputClassName="NavSearchBar__search-input"
        id="NavSearchBar__search-input"
        onChange={onSearchInputChange}
        placeholder="Search for people, rooms, events..."
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
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
