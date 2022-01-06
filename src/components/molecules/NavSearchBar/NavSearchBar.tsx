import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { isEqual } from "lodash";

import {
  COVERT_ROOM_TYPES,
  DEFAULT_PARTY_NAME,
  ROOM_TAXON,
  ROOMS_TAXON,
  STRING_SPACE,
} from "settings";

import { AlgoliaSearchIndex } from "types/algolia";
import { Room } from "types/rooms";
import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";
import { isDefined, isTruthy } from "utils/types";

import { useAlgoliaSearch } from "hooks/algolia/useAlgoliaSearch";
import { useDebounceSearch } from "hooks/useDebounceSearch";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { PortalModal } from "components/templates/PartyMap/components/PortalModal";

import { EventModal } from "components/organisms/EventModal";

import { Loading } from "components/molecules/Loading";

import { InputField } from "components/atoms/InputField";

import { NavSearchResult } from "./NavSearchResult";

import "./NavSearchBar.scss";

export interface NavSearchBarProps {
  sovereignVenueId: string;
}

export const NavSearchBar: React.FC<NavSearchBarProps> = ({
  sovereignVenueId,
}) => {
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
  const hidePortalModal = useCallback(() => setSelectedRoom(undefined), []);

  const [selectedRoomVenue, setSelectedRoomVenue] = useState<
    WithId<AnyVenue>
  >();

  const [selectedEvent, setSelectedEvent] = useState<WorldEvent>();
  const hideEventModal = useCallback(() => setSelectedEvent(undefined), []);

  const { isLoading, relatedVenues } = useRelatedVenues();

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
            description={ROOM_TAXON.capital}
            image={room.image_url}
            onClick={() => {
              setSelectedRoom(room);
              // @debt we need to find room venue (selectedRoomVenue) because of PortalModal -> useRoom -> externalRoomSlug (which accepts venueName as a parameter)
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

  const algoliaSearchState = useAlgoliaSearch(searchQuery, {
    sovereignVenueId,
  });

  const foundUsers = useMemo<JSX.Element[]>(() => {
    const usersResults = algoliaSearchState?.value?.[AlgoliaSearchIndex.USERS];
    if (!usersResults) return [];

    return usersResults.hits.map((hit) => {
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
            openUserProfileModal(hit.objectID);
            clearSearch();
          }}
        />
      );
    });
  }, [algoliaSearchState.value, openUserProfileModal, clearSearch]);

  const numberOfSearchResults = foundRooms.length + foundUsers.length;

  const clearSearchIcon = (
    <FontAwesomeIcon
      size="lg"
      className="NavSearchBar__clear-search"
      icon={faTimesCircle}
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
          </strong>
          {STRING_SPACE}
          search results
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="NavSearchBar__search-results">
            {foundRooms}
            {foundUsers}
          </div>
        )}
      </div>

      <InputField
        value={searchInputValue}
        inputClassName="NavSearchBar__search-input"
        onChange={onSearchInputChange}
        placeholder={`Search for people, ${ROOMS_TAXON.lower}...`}
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
      />

      {/* @debt use only one PortalModal instance with state controlled with redux */}
      <PortalModal
        show={isDefined(selectedRoom)}
        portal={selectedRoom}
        venue={selectedRoomVenue}
        onHide={hidePortalModal}
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
