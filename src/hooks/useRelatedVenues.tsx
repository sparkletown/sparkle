import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useAsync } from "react-use";

import { RootState } from "index";

import { fetchRelatedVenues } from "api/venue";

import { ValidStoreAsKeys } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";
import { ReactHook } from "types/utility";
import { AnyVenue, VenueEvent } from "types/venues";

import { isTruthyFilter } from "utils/filter";
import { WithId, withVenueId, WithVenueId } from "utils/id";
import {
  emptyArraySelector,
  makeSubvenueEventsSelector,
  maybeArraySelector,
  parentVenueEventsSelector,
  parentVenueOrderedSelector,
  siblingVenuesSelector,
  subvenuesSelector,
  venueEventsSelector,
} from "utils/selectors";
import { isTruthy } from "utils/types";

import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useSelector } from "./useSelector";
import {
  useFirestoreConnect,
  AnySparkleRFQuery,
  isLoaded,
  SparkleRFSubcollectionQuery,
} from "./useFirestoreConnect";
import { useSovereignVenueId } from "./useSovereignVenueId";

const toEventsWithVenueIds = (venueId: string) => (event: VenueEvent) =>
  withVenueId(event, venueId);

const venueEventsSelectorToEventsWithVenueIds = (
  venues?: WithId<AnyVenue>[]
) => (state: RootState) =>
  venues?.flatMap(
    (venue) =>
      makeSubvenueEventsSelector(venue.id)(state)?.map(
        toEventsWithVenueIds(venue.id)
      ) ?? []
  ) ?? [];

const makeEventsQueryConfig = (
  doc: string,
  storeAs: ValidStoreAsKeys
): SparkleRFSubcollectionQuery => ({
  collection: "venues",
  doc,
  subcollections: [{ collection: "events" }],
  orderBy: ["start_utc_seconds", "asc"],
  storeAs,
});

const emptyArray: never[] = [];

export type VenueEventsSelector = SparkleSelector<WithVenueId<VenueEvent>[]>;

export interface RelatedVenuesContextState {
  isLoading: boolean;
  isError: boolean;

  sovereignVenueId?: string;
  isSovereignVenueIdLoading: boolean;
  sovereignVenueIdError?: string;

  relatedVenues: WithId<AnyVenue>[];
  isRelatedVenuesLoading: boolean;
  relatedVenuesError?: Error;
}

const RelatedVenuesContext = createContext<
  RelatedVenuesContextState | undefined
>(undefined);

export interface RelatedVenuesProviderProps {
  venueId: string;
}

export const RelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = ({
  venueId,
  children,
}) => {
  const {
    sovereignVenueId,
    isSovereignVenueIdLoading,
    errorMsg: sovereignVenueIdError,
  } = useSovereignVenueId({
    venueId,
  });

  const {
    loading: isRelatedVenuesLoading,
    error: relatedVenuesError,
    value: relatedVenues = emptyArray,
  } = useAsync(async () => {
    if (!sovereignVenueId) return emptyArray;

    return fetchRelatedVenues(sovereignVenueId);
  }, [sovereignVenueId]);

  const relatedVenuesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading: isSovereignVenueIdLoading || isRelatedVenuesLoading,
      isError: isTruthy(sovereignVenueIdError || relatedVenuesError),

      sovereignVenueId,
      isSovereignVenueIdLoading,
      sovereignVenueIdError,

      relatedVenues,
      isRelatedVenuesLoading,
      relatedVenuesError,
    }),
    [
      isRelatedVenuesLoading,
      isSovereignVenueIdLoading,
      relatedVenues,
      relatedVenuesError,
      sovereignVenueId,
      sovereignVenueIdError,
    ]
  );

  return (
    <RelatedVenuesContext.Provider value={relatedVenuesState}>
      {children}
    </RelatedVenuesContext.Provider>
  );
};

export const useRelatedVenues = (): RelatedVenuesContextState => {
  const relatedVenuesState = useContext(RelatedVenuesContext);

  if (!relatedVenuesState) {
    throw new Error(
      "<RelatedVenuesProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return relatedVenuesState;
};

interface UseLegacyConnectRelatedVenuesProps {
  venueId?: string;

  /** @default false **/
  withEvents?: boolean;
}

interface UseLegacyConnectRelatedVenuesReturn {
  parentVenue?: WithId<AnyVenue>;
  currentVenue?: WithId<AnyVenue>;
  relatedVenues: WithId<AnyVenue>[];

  relatedVenueEvents: WithVenueId<VenueEvent>[];
  parentVenueEvents: WithVenueId<VenueEvent>[];
  venueEvents: WithVenueId<VenueEvent>[];
  siblingVenueEvents: WithVenueId<VenueEvent>[];
  subvenueEvents: WithVenueId<VenueEvent>[];

  isRelatedVenuesLoaded: boolean;
  isParentVenueLoaded: boolean;
  isCurrentVenueLoaded: boolean;
}

/**
 * @deprecated use useRelatedVenues instead
 */
export const useLegacyConnectRelatedVenues: ReactHook<
  UseLegacyConnectRelatedVenuesProps,
  UseLegacyConnectRelatedVenuesReturn
> = ({ venueId, withEvents = false }) => {
  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );

  const parentId: string | undefined = currentVenue?.parentId;

  const siblingNotVenueSelector: SparkleSelector<
    WithId<AnyVenue>[]
  > = useCallback(
    (state) =>
      siblingVenuesSelector(state)?.filter(
        (sibling) => sibling.id !== venueId
      ) ?? [],
    [venueId]
  );

  const parentVenueRaw: WithId<AnyVenue>[] | undefined = useSelector(
    parentVenueOrderedSelector
  );
  const parentVenue: WithId<AnyVenue> | undefined = parentVenueRaw?.[0];

  const subvenuesRaw: WithId<AnyVenue>[] | undefined = useSelector(
    subvenuesSelector
  );
  const subvenues: WithId<AnyVenue>[] = subvenuesRaw ?? emptyArray;

  const siblingVenuesRaw = useSelector(siblingNotVenueSelector);
  const siblingVenues: WithId<AnyVenue>[] = siblingVenuesRaw ?? emptyArray;

  const isParentVenueLoaded = isLoaded(parentVenueRaw);
  const isSubvenuesLoaded = isLoaded(subvenuesRaw);
  const isSiblingVenuesLoaded = isLoaded(siblingVenuesRaw);

  const parentEventsWithVenueIdsSelector: VenueEventsSelector = useMemo((): VenueEventsSelector => {
    if (!withEvents || !parentId) return emptyArraySelector;

    return (state) =>
      parentVenueEventsSelector(state)?.map(toEventsWithVenueIds(parentId)) ??
      [];
  }, [parentId, withEvents]);

  const venueEventsWithVenueIdsSelector: VenueEventsSelector = useMemo((): VenueEventsSelector => {
    if (!withEvents || !venueId) return emptyArraySelector;

    return (state) =>
      venueEventsSelector(state)?.map(toEventsWithVenueIds(venueId)) ?? [];
  }, [venueId, withEvents]);

  const maybeParentEventsSelector: VenueEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(withEvents, parentEventsWithVenueIdsSelector)(state),
    [withEvents, parentEventsWithVenueIdsSelector]
  );

  const maybeVenueEventsSelector: VenueEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(withEvents, venueEventsWithVenueIdsSelector)(state),
    [withEvents, venueEventsWithVenueIdsSelector]
  );

  const maybeSiblingEventsSelector: VenueEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(
        withEvents,
        venueEventsSelectorToEventsWithVenueIds(siblingVenues)
      )(state),
    [withEvents, siblingVenues]
  );

  const maybeSubvenueEventsSelector: VenueEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(
        withEvents,
        venueEventsSelectorToEventsWithVenueIds(subvenues)
      )(state),
    [withEvents, subvenues]
  );

  const parentVenueEvents: WithVenueId<VenueEvent>[] = useSelector(
    maybeParentEventsSelector
  );

  const venueEvents: WithVenueId<VenueEvent>[] = useSelector(
    maybeVenueEventsSelector
  );

  const siblingVenueEvents: WithVenueId<VenueEvent>[] = useSelector(
    maybeSiblingEventsSelector
  );

  const subvenueEvents: WithVenueId<VenueEvent>[] = useSelector(
    maybeSubvenueEventsSelector
  );

  /////////////////////////////////
  // Firestore Connect Configs/etc
  /////////////////////////////////

  // Parent
  const parentVenueQuery: AnySparkleRFQuery | undefined = !!parentId
    ? {
        collection: "venues",
        doc: parentId,
        storeAs: "parentVenue",
      }
    : undefined;

  // Sibling
  const siblingVenuesQuery: AnySparkleRFQuery | undefined = !!parentId
    ? {
        collection: "venues",
        where: [["parentId", "==", parentId]],
        storeAs: "siblingVenues",
      }
    : undefined;

  // Sub
  const subvenuesQuery: AnySparkleRFQuery | undefined = !!venueId
    ? {
        collection: "venues",
        where: [["parentId", "==", venueId]],
        storeAs: "subvenues",
      }
    : undefined;

  // Parent Events
  const parentVenueEventsQuery: AnySparkleRFQuery | undefined =
    parentId && withEvents
      ? makeEventsQueryConfig(parentId, "parentVenueEvents")
      : undefined;

  // Sibling Events
  const siblingVenueEventsQueries: AnySparkleRFQuery[] = withEvents
    ? siblingVenues.map((sibling) =>
        makeEventsQueryConfig(
          sibling.id,
          `siblingVenueEvents-${sibling.id}` as ValidStoreAsKeys // @debt a little hacky, but we're consciously subverting our helper protections;
        )
      )
    : [];

  // Sub Events
  const subvenueEventsQueries: AnySparkleRFQuery[] = withEvents
    ? subvenues.map((subvenue) =>
        makeEventsQueryConfig(
          subvenue.id,
          `subvenueEvents-${subvenue.id}` as ValidStoreAsKeys // @debt a little hacky, but we're consciously subverting our helper protections;
        )
      )
    : [];

  // Combine / filter for valid queries
  const allValidQueries: AnySparkleRFQuery[] = [
    parentVenueQuery,
    siblingVenuesQuery,
    subvenuesQuery,
    parentVenueEventsQuery,
    ...siblingVenueEventsQueries,
    ...subvenueEventsQueries,
  ].filter(isTruthyFilter);

  // Connect
  useFirestoreConnect(allValidQueries);

  /////////////////////////////////
  // Return
  /////////////////////////////////

  const relatedVenueEvents: WithVenueId<VenueEvent>[] = useMemo(
    () =>
      [
        ...parentVenueEvents,
        ...venueEvents,
        ...siblingVenueEvents,
        ...subvenueEvents,
      ].sort((a, b) => a.start_utc_seconds - b.start_utc_seconds),
    [parentVenueEvents, venueEvents, siblingVenueEvents, subvenueEvents]
  );

  const relatedVenues = useMemo(
    () =>
      [currentVenue, parentVenue, ...siblingVenues, ...subvenues].filter(
        isTruthyFilter
      ),
    [currentVenue, parentVenue, siblingVenues, subvenues]
  );

  const isRelatedVenuesLoaded =
    isCurrentVenueLoaded &&
    isSubvenuesLoaded &&
    isSiblingVenuesLoaded &&
    (parentId ? isParentVenueLoaded : true);

  return useMemo(
    () => ({
      parentVenue,
      currentVenue,
      relatedVenues,
      relatedVenueEvents,
      parentVenueEvents,
      venueEvents,
      siblingVenueEvents,
      subvenueEvents,
      isRelatedVenuesLoaded,
      isParentVenueLoaded,
      isCurrentVenueLoaded,
    }),
    [
      parentVenue,
      currentVenue,
      relatedVenues,
      isRelatedVenuesLoaded,
      relatedVenueEvents,
      parentVenueEvents,
      venueEvents,
      siblingVenueEvents,
      subvenueEvents,
      isParentVenueLoaded,
      isCurrentVenueLoaded,
    ]
  );
};
