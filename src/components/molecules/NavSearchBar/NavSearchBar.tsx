import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
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

const buildEventDescripiton = (startUtcSeconds: number) => {
  const eventTime = formatUtcSecondsRelativeToToday(startUtcSeconds);
  return `Event - ${uppercaseFirstChar(eventTime)}`;
};

const NavSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const onSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    []
  );

  const [foundRooms, setFoundRooms] = useState<Room[]>([]);
  const [foundUsers, setFoundUsers] = useState<readonly WithId<User>[]>([]);
  const [foundEvents, setFoundEvents] = useState<WithImageUrl<VenueEvent>[]>(
    []
  );

  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const hasSelectedRoom = !!selectedRoom;

  const venue = useSelector(currentVenueSelectorData);
  const venueEvents = useSelector(venueEventsSelector) ?? emptyEventsArray;
  const { worldUsers } = useWorldUsers();

  const { openUserProfileModal } = useProfileModalControls();

  useEffect(() => {
    const normalizedSearchQuery = searchQuery.toLowerCase();
    if (!normalizedSearchQuery) {
      setFoundRooms([]);
      setFoundUsers([]);
      setFoundEvents([]);
      return;
    }

    const venueUsersResults = worldUsers.filter((user) =>
      user.partyName?.toLowerCase()?.includes(normalizedSearchQuery)
    );

    const venueEventsResults: WithImageUrl<VenueEvent>[] = venueEvents
      .filter((event) =>
        event.name.toLowerCase().includes(normalizedSearchQuery)
      )
      .map((event) => {
        // @debt event can be related to the current venue as well but we don't receive its icon
        const room = venue?.rooms?.find((room) => room.title === event.room);
        return { ...event, image_url: room?.image_url };
      });

    const roomsResults: Room[] =
      venue?.rooms?.filter(
        (room) =>
          room.title.toLowerCase().includes(normalizedSearchQuery) &&
          room.type !== RoomTypes.unclickable
      ) ?? [];

    setFoundRooms(roomsResults);
    setFoundUsers(venueUsersResults);
    setFoundEvents(venueEventsResults);
  }, [searchQuery, venue, venueEvents, worldUsers]);

  const numberOfSearchResults =
    foundRooms.length + foundEvents.length + foundUsers.length;

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
        className="nav-search-input"
        value={searchQuery}
        onChange={onSearchInputChange}
        placeholder="Search for people, rooms, events..."
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
      />

      <div
        className={classNames("nav-dropdown nav-dropdown--search", {
          show: searchQuery,
        })}
      >
        <div className="nav-dropdown-title mb-05 mt-05">
          <b>{numberOfSearchResults}</b> search results
        </div>

        <div className="nav-dropdown--search-results">
          {/* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but rooms don't have a unique identifier */}
          {foundRooms.map((room, index) => (
            <NavSearchResult
              title={room.title}
              description="Room"
              image={room.image_url}
              key={`room-${room.title}-${index}`}
              onClick={() => {
                setSelectedRoom(room);
                clearSearchQuery();
              }}
            />
          ))}

          {foundEvents.map((event) => (
            <NavSearchResult
              title={event.name}
              description={buildEventDescripiton(event.start_utc_seconds)}
              image={event.image_url}
              key={`event-${event.id ?? event.name}`}
            />
          ))}

          {foundUsers.map((user) => (
            <NavSearchResult
              title={user.partyName as string}
              image={user.pictureUrl}
              isAvatar={true}
              key={`user-${user.id}`}
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
