import React, { useCallback, useState, ChangeEvent, useMemo } from "react";
import classNames from "classnames";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { VenueEvent } from "types/venues";
import { Room, RoomTypes } from "types/rooms";
import { User } from "types/User";

import { WithId } from "utils/id";
import { isTruthy } from "utils/types";
import { uppercaseFirstChar } from "utils/string";
import { formatUtcSecondsRelativeToToday } from "utils/time";
import { currentVenueSelectorData, venueEventsSelector } from "utils/selectors";

import { useWorldUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { InputField } from "components/atoms/InputField";
import { RoomModal } from "components/templates/PartyMap/components";

import { NavSearchResult } from "./NavSearchResult";

import "./NavSearchBar.scss";

type WithImageUrl<T extends object> = T & { image_url?: string };

const emptyEventsArray: VenueEvent[] = [];

const normalizeSearchQuery = (searchQuery: string): string => {
  return searchQuery.toLowerCase();
};

const buildEventDescription = (startUtcSeconds: number) => {
  const eventTime = formatUtcSecondsRelativeToToday(startUtcSeconds);
  return `Event - ${uppercaseFirstChar(eventTime)}`;
};

const NavSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const onSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    []
  );

  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const hasSelectedRoom = !!selectedRoom;

  const venue = useSelector(currentVenueSelectorData);
  const venueEvents = useSelector(venueEventsSelector) ?? emptyEventsArray;
  const { worldUsers } = useWorldUsers();

  const { openUserProfileModal } = useProfileModalControls();

  const foundRooms = useMemo<readonly Room[]>(() => {
    const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedSearchQuery) {
      return [];
    }

    return (
      venue?.rooms?.filter(
        (room) =>
          room.title.toLowerCase().includes(normalizedSearchQuery) &&
          room.type !== RoomTypes.unclickable
      ) ?? []
    );
  }, [searchQuery, venue]);

  const foundUsers = useMemo<readonly WithId<User>[]>(() => {
    const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedSearchQuery) {
      return [];
    }

    return worldUsers.filter((user) =>
      user.partyName?.toLowerCase().includes(normalizedSearchQuery)
    );
  }, [searchQuery, worldUsers]);

  const foundEvents = useMemo<readonly WithImageUrl<VenueEvent>[]>(() => {
    const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedSearchQuery) {
      return [];
    }

    return venueEvents
      .filter((event) =>
        event.name.toLowerCase().includes(normalizedSearchQuery)
      )
      .map((event) => {
        // @debt event can be related to the current venue as well but we don't receive its icon
        const room = venue?.rooms?.find((room) => room.title === event.room);
        return { ...event, image_url: room?.image_url };
      });
  }, [searchQuery, venueEvents, venue]);

  const numberOfSearchResults =
    foundRooms.length + foundEvents.length + foundUsers.length;

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearSearchIcon = (
    <img
      className="NavSearchBar__clear-search"
      src="/icons/nav-dropdown-close.png"
      alt="close button"
      onClick={clearSearchQuery}
    />
  );

  const navDropdownClassnames = classNames("NavSearchBar__nav-dropdown", {
    "NavSearchBar__nav-dropdown--show": searchQuery,
  });

  return (
    <div className="NavSearchBar">
      <InputField
        className="NavSearchBar__search-input"
        value={searchQuery}
        onChange={onSearchInputChange}
        placeholder="Search for people, rooms, events..."
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
      />

      <div className={navDropdownClassnames}>
        <div className="NavSearchBar__nav-dropdown__title mb--05 mt--05 font-size--small">
          <b className="NavSearchBar__search-results-number">
            {numberOfSearchResults}
          </b>{" "}
          search results
        </div>

        <div className="NavSearchBar__search-results">
          {/* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but rooms don't have a unique identifier */}
          {foundRooms.map((room, index) => (
            <NavSearchResult
              key={`room-${room.title}-${index}`}
              title={room.title}
              description="Room"
              image={room.image_url}
              onClick={() => {
                setSelectedRoom(room);
                clearSearchQuery();
              }}
            />
          ))}

          {foundEvents.map((event) => (
            <NavSearchResult
              key={`event-${event.id ?? event.name}`}
              title={event.name}
              description={buildEventDescription(event.start_utc_seconds)}
              image={event.image_url}
            />
          ))}

          {foundUsers.map((user) => (
            <NavSearchResult
              key={`user-${user.id}`}
              title={user.partyName as string}
              image={user.pictureUrl}
              isAvatar={true}
              onClick={() => {
                openUserProfileModal(user);
                clearSearchQuery();
              }}
            />
          ))}
        </div>
      </div>

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
