import { useCallback, useMemo } from "react";

import { RootState } from "index";

import { ValidStoreAsKeys } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";
import { ReactHook } from "types/utility";
import { AnyVenue, Venue, VenueEvent } from "types/venues";

import { isTruthyFilter } from "utils/filter";
import { WithId, withVenueId, WithVenueId } from "utils/id";
import {
  makeSubvenueEventsSelector,
  maybeArraySelector,
  parentVenueEventsSelector,
  parentVenueOrderedSelector,
  siblingVenuesSelector,
  subvenuesSelector,
  venueEventsSelector,
} from "utils/selectors";

import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useSelector } from "./useSelector";
import {
  useFirestoreConnect,
  AnySparkleRFQuery,
  isLoaded,
  SparkleRFSubcollectionQuery,
} from "./useFirestoreConnect";

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

interface UseConnectRelatedVenuesProps {
  venueId?: string;

  /** @default false **/
  withEvents?: boolean;
}

interface UseConnectRelatedVenuesReturn {
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

export const useConnectRelatedVenues: ReactHook<
  UseConnectRelatedVenuesProps,
  UseConnectRelatedVenuesReturn
> = ({ venueId, withEvents = false }) => {
  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );

  const parentId: string | undefined = currentVenue?.parentId;

  const parentEventsWithVenueIdsSelector: SparkleSelector<
    WithVenueId<VenueEvent>[]
  > = useMemo(() => {
    if (!withEvents || !parentId) return () => [];

    return (state: RootState) =>
      parentVenueEventsSelector(state)?.map(toEventsWithVenueIds(parentId)) ??
      [];
  }, [parentId, withEvents]);

  const venueEventsWithVenueIdsSelector: SparkleSelector<
    WithVenueId<VenueEvent>[]
  > = useMemo(() => {
    if (!withEvents || !venueId) return () => [];

    return (state: RootState) =>
      venueEventsSelector(state)?.map(toEventsWithVenueIds(venueId)) ?? [];
  }, [venueId, withEvents]);

  const siblingNotVenueSelector: SparkleSelector<
    WithId<Venue>[]
  > = useCallback(
    (state) =>
      siblingVenuesSelector(state)?.filter(
        (sibling) => sibling.id !== venueId
      ) ?? [],
    [venueId]
  );

  const parentVenueRaw = useSelector(parentVenueOrderedSelector);
  const parentVenue = parentVenueRaw?.[0];

  const subvenuesRaw = useSelector(subvenuesSelector);
  const subvenues = subvenuesRaw ?? [];

  const siblingVenuesRaw = useSelector(siblingNotVenueSelector);
  const siblingVenues = siblingVenuesRaw ?? [];

  const isParentVenueLoaded = isLoaded(parentVenueRaw);
  const isSubvenuesLoaded = isLoaded(subvenuesRaw);
  const isSiblingVenuesLoaded = isLoaded(siblingVenuesRaw);

  const maybeParentEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(withEvents, parentEventsWithVenueIdsSelector)(state),
    [withEvents, parentEventsWithVenueIdsSelector]
  );

  const maybeVenueEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(withEvents, venueEventsWithVenueIdsSelector)(state),
    [withEvents, venueEventsWithVenueIdsSelector]
  );

  const maybeSiblingEventsSelector = useCallback(
    (state) =>
      maybeArraySelector(
        withEvents,
        venueEventsSelectorToEventsWithVenueIds(siblingVenues)
      )(state),
    [withEvents, siblingVenues]
  );

  const maybeSubvenueEventsSelector = useCallback(
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
