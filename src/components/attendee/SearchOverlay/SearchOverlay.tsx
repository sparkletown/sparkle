import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Hit } from "@algolia/client-search";
import { Input } from "components/attendee/Input";
import { EventItem } from "components/attendee/SearchOverlay/EventItem/EventItem";
import { PortalItem } from "components/attendee/SearchOverlay/PortalItem/PortalItem";
import { SpaceItem } from "components/attendee/SearchOverlay/SpaceItem/SpaceItem";
import { UserItem } from "components/attendee/SearchOverlay/UserItem/UserItem";

import { ALWAYS_EMPTY_ARRAY, COVERT_ROOM_TYPES } from "settings";

import { AlgoliaSearchIndex } from "types/algolia";
import { SpaceWithId } from "types/id";
import { Room } from "types/rooms";
import { UserWithLocation } from "types/User";
import { ScheduledEvent } from "types/venues";

import { isDefined } from "utils/types";

import { useAlgoliaSearch } from "hooks/algolia/useAlgoliaSearch";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useDebounceSearch } from "hooks/useDebounceSearch";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { Loading } from "components/molecules/Loading";

import CN from "./SearchOverlay.module.scss";

type SearchOverlayProps = {
  onClose: () => void;
  setNavMenu: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  onClose,
  setNavMenu,
}) => {
  const {
    world,
    worldId,
    isLoaded: hasWorldLoaded,
  } = useWorldAndSpaceByParams();
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

  const { isLoading, worldSpaces } = useRelatedVenues();

  const enabledRelatedPortals = useMemo<Room[]>(
    () =>
      worldSpaces
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
    [worldSpaces]
  );

  const { liveAndFutureEvents } = useVenueScheduleEvents();

  const foundEvents = useMemo<ScheduledEvent[]>(() => {
    if (!searchQuery) return ALWAYS_EMPTY_ARRAY;

    /* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but portals don't have a unique identifier */
    return (
      liveAndFutureEvents.filter((event) =>
        event.name.toLowerCase().includes(searchQuery)
      ) ?? []
    );
  }, [searchQuery, liveAndFutureEvents]);

  const foundPortals = useMemo<Room[]>(() => {
    if (!searchQuery) return ALWAYS_EMPTY_ARRAY;

    /* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but portals don't have a unique identifier */
    return (
      enabledRelatedPortals.filter((portal) =>
        portal.title.toLowerCase().includes(searchQuery)
      ) ?? []
    );
  }, [searchQuery, enabledRelatedPortals]);

  const foundSpaces = useMemo<SpaceWithId[]>(() => {
    if (!searchQuery) return ALWAYS_EMPTY_ARRAY;

    /* @debt we really shouldn't be using the index as part of the key here, it's unstable.. but portals don't have a unique identifier */
    return (
      worldSpaces.filter((portal) =>
        portal.name.toLowerCase().includes(searchQuery)
      ) ?? []
    );
  }, [searchQuery, worldSpaces]);

  const algoliaSearchState = useAlgoliaSearch(
    searchQuery,
    worldId && {
      worldId,
    }
  );

  const foundUsers = useMemo<
    Hit<
      Pick<UserWithLocation, "partyName" | "pictureUrl" | "enteredVenueIds">
    >[]
  >(() => {
    const usersResults = algoliaSearchState?.value?.[AlgoliaSearchIndex.USERS];
    if (!usersResults) return [];

    return usersResults.hits;
  }, [algoliaSearchState.value]);

  const totalResultNumber =
    foundPortals.length +
    foundUsers.length +
    foundEvents.length +
    foundSpaces.length;

  return (
    <div className={CN.searchOverlayWrapper}>
      <div className={CN.searchOverlayHeader}>
        {hasWorldLoaded && `Search ${world?.name}`}
      </div>
      <div className={CN.searchOverlaySearch}>
        <Input
          value={searchValue}
          variant="overlay"
          onChange={onSearchInputChange}
          onLabelClick={initiateSearch}
          onEnter={initiateSearch}
          label="Search"
          autoComplete="off"
        />
      </div>

      {searchQuery && (
        <div className={CN.searchOverlayCount}>
          {totalResultNumber} results for {`"${searchQuery}"`}
        </div>
      )}
      <div className={CN.searchOverlayContent}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={CN.searchOverlayBody}>
            {foundPortals.map((portal, index) => (
              <div key={`portal-${portal.title}-${index}`}>
                <PortalItem portal={portal} onClick={onClose} />
              </div>
            ))}
            {foundSpaces.map((space, index) => (
              <div key={`portal-${space.name}-${index}`}>
                <SpaceItem space={space} onClick={onClose} />
              </div>
            ))}
            {foundUsers.map((user) => (
              <div key={`user-${user.objectID}`}>
                <UserItem user={user} onClick={onClose} />
              </div>
            ))}
            {foundEvents.map((event, index) => (
              <div key={`portal-${event.name}-${index}`}>
                <EventItem
                  event={event}
                  onClick={onClose}
                  setNavMenu={setNavMenu}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
