import { ChangeEvent, useCallback, useMemo, useState } from "react";

import {
  COVERT_ROOM_TYPES,
  DEFAULT_PARTY_NAME,
  PERSON_TAXON,
  SPACE_TAXON,
} from "settings";

import { AlgoliaSearchIndex } from "types/algolia";
import { Room } from "types/rooms";

import { isDefined } from "utils/types";

import { useAlgoliaSearch } from "hooks/algolia/useAlgoliaSearch";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useDebounceSearch } from "hooks/useDebounceSearch";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { Loading } from "components/molecules/Loading";

import { InputField } from "components/atoms/InputField";

import { PortalItem } from "./PortalItem/PortalItem";

import CN from "./SearchOverlay.module.scss";

type SearchOverlayProps = {
  onClose: () => void;
};
export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space, worldId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);
  const [searchValue, setSearchValue] = useState("");

  const { searchQuery, setSearchInputValue } = useDebounceSearch();

  const onSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue]
  );

  const initiateSearch = () => {
    setSearchInputValue(searchValue);
  };

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
        .map((portal, index) => {
          return (
            <div key={`portal-${portal.title}-${index}`}>
              <PortalItem portal={portal} onClick={onClose} />
            </div>
          );
        }) ?? []
    );
  }, [searchQuery, enabledRelatedPortals, onClose]);

  const algoliaSearchState = useAlgoliaSearch(searchQuery, {
    sovereignVenueId: worldId as string,
  });

  const foundUsers = useMemo<JSX.Element[]>(() => {
    const usersResults = algoliaSearchState?.value?.[AlgoliaSearchIndex.USERS];
    if (!usersResults) return [];

    return usersResults.hits.map((hit) => {
      // const userFields = {
      //   ...hit,
      //   id: hit.objectID,
      // };

      return (
        <div key={`user-${hit.objectID}`}>
          <div className={CN.searchOverlayResultHeader}>
            <h3>
              {hit?.partyName ?? DEFAULT_PARTY_NAME}
              <span>{PERSON_TAXON.title}</span>
            </h3>
          </div>
        </div>
      );
    });
  }, [algoliaSearchState.value]);

  const totalResultNumber = foundPortals.length + foundUsers.length;

  return (
    <div className={CN.searchOverlayWrapper}>
      <div className={CN.searchOverlayHeader}>
        {`Search ${space?.name ?? SPACE_TAXON.title}`}
      </div>
      <div className={CN.searchOverlaySearch}>
        <InputField
          value={searchValue}
          inputClassName={CN.searchOverlaySearchInput}
          onChange={onSearchInputChange}
          onLabelClick={initiateSearch}
          label="Search"
          autoComplete="off"
        />
      </div>
      {!!totalResultNumber && (
        <div>
          {totalResultNumber} results for {`"${searchQuery}"`}
        </div>
      )}
      <div className={CN.searchOverlayContent}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={CN.searchOverlayBody}>
            {foundPortals}
            {foundUsers}
          </div>
        )}
      </div>
    </div>
  );
};
