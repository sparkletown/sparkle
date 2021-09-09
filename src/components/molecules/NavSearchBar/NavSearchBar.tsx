import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { isEqual, reduce } from "lodash";

import { COVERT_ROOM_TYPES, DEFAULT_PARTY_NAME } from "settings";

import { AlgoliaSearchIndex, AlgoliaUsersSearchResult } from "types/algolia";
import { Room } from "types/rooms";
import { AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { isDefined, isTruthy } from "utils/types";

import { useAlgoliaSearchFn } from "hooks/algolia/useAlgoliaSearchFn";
import { useVenueEvents } from "hooks/events";
import { useDebounceSearch } from "hooks/useDebounceSearch";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { RoomModal } from "components/templates/PartyMap/components";

import { EventModal } from "components/organisms/EventModal";

import { Loading } from "components/molecules/Loading";
import { NavSearchBarFoundEvent } from "components/molecules/NavSearchBar/NavSearchBarFoundEvent";

import { InputField } from "components/atoms/InputField";

import { NavSearchResult } from "./NavSearchResult";

import navDropdownCloseIcon from "assets/icons/nav-dropdown-close.png";

import "./NavSearchBar.scss";

export interface NavSearchBarProps {
  venueId: string;
}

export const NavSearchBar: React.FC<NavSearchBarProps> = ({ venueId }) => {
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
  const hideRoomModal = useCallback(() => setSelectedRoom(undefined), []);

  const [selectedRoomVenue, setSelectedRoomVenue] = useState<
    WithId<AnyVenue>
  >();

  const [selectedEvent, setSelectedEvent] = useState<WithVenueId<VenueEvent>>();
  const hideEventModal = useCallback(() => setSelectedEvent(undefined), []);

  const { isLoading, relatedVenues, relatedVenueIds } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const enabledRelatedRooms = useMemo<Room[]>(
    () =>
      relatedVenues
        .flatMap((venue) => venue.rooms ?? [])
        .filter((room) => {
          if (isDefined(room.type) && COVERT_ROOM_TYPES.includes(room.type)) {
            return false;
          }

          return room.isEnabled;
        }),
    [relatedVenues]
  );

  const enabledRelatedRoomsByTitle = useMemo<Partial<Record<string, Room>>>(
    () =>
      reduce(
        enabledRelatedRooms,
        (enabledRelatedRoomsByTitle, room) => ({
          ...enabledRelatedRoomsByTitle,
          [room.title]: room,
        }),
        {}
      ),
    [enabledRelatedRooms]
  );

  const { isEventsLoading, events: relatedEvents } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const foundRooms = useMemo<JSX.Element[]>(() => {
    if (!searchQuery) return [];

    /* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but rooms don't have a unique identifier */
    return (
      enabledRelatedRooms
        .filter((room) => room.title.toLowerCase().includes(searchQuery))
        .map((room, index) => (
          <NavSearchResult
            key={`room-${room.title}-${index}`}
            title={room.title}
            description="Room"
            image={room.image_url}
            onClick={() => {
              setSelectedRoom(room);
              // @debt we need to find room venue (selectedRoomVenue) because of RoomModal -> useRoom -> externalRoomSlug (which accepts venueName as a parameter)
              //  probably would be better to extend Room type with the venueId it's related to, and use it in the `externalRoomSlug` instead of venueName
              setSelectedRoomVenue(
                relatedVenues.find((venue) =>
                  venue.rooms?.filter((venueRoom) => isEqual(venueRoom, room))
                )
              );

              clearSearch();
            }}
          />
        )) ?? []
    );
  }, [searchQuery, enabledRelatedRooms, clearSearch, relatedVenues]);

  const { openUserProfileModal } = useProfileModalControls();

  const [
    algoliaSearchResult,
    setAlgoliaSearchResult,
  ] = useState<AlgoliaUsersSearchResult>();
  const [, algoliaSearch] = useAlgoliaSearchFn();

  useEffect(() => {
    const performSearch = async () => {
      const results = await algoliaSearch(searchQuery);
      if (results) setAlgoliaSearchResult(results[AlgoliaSearchIndex.USERS]);
    };
    if (searchQuery) void performSearch();
    else setAlgoliaSearchResult(undefined);
  }, [algoliaSearch, searchQuery]);

  const foundUsers = useMemo<JSX.Element[]>(() => {
    if (!algoliaSearchResult) return [];

    return algoliaSearchResult.hits.map((hit) => {
      const userFields = {
        ...hit,
        id: hit.objectID,
      };
      return (
        <NavSearchResult
          key={`user-${hit.objectID}`}
          title={hit?.partyName ?? DEFAULT_PARTY_NAME}
          user={userFields}
          onClick={() => {
            // TODO:
            console.log(openUserProfileModal);
            clearSearch();
          }}
        />
      );
    });
  }, [algoliaSearchResult, clearSearch, openUserProfileModal]);

  const foundEvents = useMemo<JSX.Element[]>(() => {
    if (!searchQuery) return [];

    return relatedEvents
      .filter((event) => {
        const isEventRoomEnabled =
          isDefined(event.room) && event.room !== ""
            ? isDefined(enabledRelatedRoomsByTitle[event.room])
            : true;

        return (
          isEventRoomEnabled && event.name.toLowerCase().includes(searchQuery)
        );
      })
      .map((event) => (
        <NavSearchBarFoundEvent
          key={`event-${event.id ?? event.name}`}
          event={event}
          enabledRelatedRooms={enabledRelatedRooms}
          relatedVenues={relatedVenues}
          onClick={() => {
            setSelectedEvent(event);
            clearSearch();
          }}
        />
      ));
  }, [
    searchQuery,
    relatedEvents,
    enabledRelatedRoomsByTitle,
    enabledRelatedRooms,
    relatedVenues,
    clearSearch,
  ]);

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

  return (
    <div className="NavSearchBar">
      <div className={navDropdownClassnames}>
        <div className="NavSearchBar__nav-dropdown__title font-size--small">
          <strong className="NavSearchBar__search-results-number">
            {numberOfSearchResults}
          </strong>{" "}
          search results
        </div>

        {isLoading || isEventsLoading ? (
          <Loading />
        ) : (
          <div className="NavSearchBar__search-results">
            {foundRooms}
            {foundEvents}
            {foundUsers}
          </div>
        )}
      </div>

      <InputField
        value={searchInputValue}
        inputClassName="NavSearchBar__search-input"
        onChange={onSearchInputChange}
        placeholder="Search for people, rooms, events..."
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
      />

      {/* @debt use only one RoomModal instance with state controlled with redux */}
      <RoomModal
        show={isDefined(selectedRoom)}
        room={selectedRoom}
        venue={selectedRoomVenue}
        onHide={hideRoomModal}
      />

      {/* @debt use only one EventModal instance with state controlled with redux */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          show={isDefined(selectedEvent)}
          onHide={hideEventModal}
        />
      )}
    </div>
  );
};
