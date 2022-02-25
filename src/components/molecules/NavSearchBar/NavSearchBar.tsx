import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import {
  ALWAYS_NOOP_FUNCTION,
  COVERT_ROOM_TYPES,
  DEFAULT_PARTY_NAME,
  ROOM_TAXON,
  ROOMS_TAXON,
  STRING_SPACE,
} from "settings";

import { AlgoliaSearchIndex } from "types/algolia";
import { Room } from "types/rooms";

import { isDefined, isTruthy } from "utils/types";

import { useAlgoliaSearch } from "hooks/algolia/useAlgoliaSearch";
import { useDebounceSearch } from "hooks/useDebounceSearch";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { PortalModal } from "components/templates/PartyMap/components/PortalModal";

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

  const [selectedPortal, setSelectedPortal] = useState<Room>();
  const hidePortalModal = useCallback(() => setSelectedPortal(undefined), []);

  const { isLoading, relatedVenues } = useRelatedVenues();

  const enabledRelatedPortals = useMemo<Room[]>(
    () =>
      relatedVenues
        .flatMap((venue) => venue.rooms ?? [])
        .filter((portal) => {
          if (
            isDefined(portal.type) &&
            COVERT_ROOM_TYPES.includes(portal.type)
          ) {
            return false;
          }

          return portal.isEnabled;
        }),
    [relatedVenues]
  );

  const foundPortals = useMemo<JSX.Element[]>(() => {
    if (!searchQuery) return [];

    /* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but portals don't have a unique identifier */
    return (
      enabledRelatedPortals
        .filter((portal) => portal.title.toLowerCase().includes(searchQuery))
        .map((portal, index) => (
          <NavSearchResult
            key={`portal-${portal.title}-${index}`}
            title={portal.title}
            description={ROOM_TAXON.capital}
            image={portal.image_url}
            onClick={() => {
              setSelectedPortal(portal);
              clearSearch();
            }}
          />
        )) ?? []
    );
  }, [searchQuery, enabledRelatedPortals, clearSearch]);

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

  const numberOfSearchResults = foundPortals.length + foundUsers.length;

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
            {foundPortals}
            {foundUsers}
          </div>
        )}
      </div>

      <InputField
        value={searchInputValue}
        inputClassName="NavSearchBar__search-input"
        onChange={onSearchInputChange}
        register={ALWAYS_NOOP_FUNCTION}
        placeholder={`Search for people, ${ROOMS_TAXON.lower}...`}
        autoComplete="off"
        iconStart={faSearch}
        iconEnd={isTruthy(searchQuery) ? clearSearchIcon : undefined}
      />

      {/* @debt use only one PortalModal instance with state controlled with redux */}
      <PortalModal
        show
        portal={selectedPortal}
        onHide={hidePortalModal}
        absolute
      />
    </div>
  );
};
