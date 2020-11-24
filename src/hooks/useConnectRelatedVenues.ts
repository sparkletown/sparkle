import { useCallback, useMemo } from "react";

import { RootState } from "index";

import { AnyVenue } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";
import { ReactHook } from "types/utility";
import { Venue } from "types/Venue";
import { VenueEvent } from "types/VenueEvent";

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

import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useSelector } from "./useSelector";
import {
  SparkleDocRFQSetting,
  SparkleRFQSetting,
  useFirestoreConnect,
} from "./useFirestoreConnect";

const toEventsWithVenueIds = (venueId: string) => (event: VenueEvent) =>
  withVenueId(event, venueId);

const venueEventsSelectorToEventsWithVenueIds = (
  venues: WithId<AnyVenue>[]
) => (state: RootState) =>
  venues.flatMap(
    (venue) =>
      makeSubvenueEventsSelector(venue.id)(state)?.map(
        toEventsWithVenueIds(venue.id)
      ) ?? []
  );

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
}

export const useConnectRelatedVenues: ReactHook<
  UseConnectRelatedVenuesProps,
  UseConnectRelatedVenuesReturn
> = ({ venueId, withEvents = false }) => {
  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  const parentId: string | undefined = currentVenue?.parentId;

  const parentEventsWithVenueIdsSelector: SparkleSelector<
    WithVenueId<VenueEvent>[]
  > = useMemo(() => {
    if (!withEvents || !parentId)
      return emptyArraySelector as SparkleSelector<WithVenueId<VenueEvent>[]>;

    return (state: RootState) =>
      parentVenueEventsSelector(state)?.map(toEventsWithVenueIds(parentId)) ??
      [];
  }, [parentId, withEvents]);

  const venueEventsWithVenueIdsSelector: SparkleSelector<
    WithVenueId<VenueEvent>[]
  > = useMemo(() => {
    if (!withEvents || !venueId)
      return emptyArraySelector as SparkleSelector<WithVenueId<VenueEvent>[]>;

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

  const parentVenue = useSelector(parentVenueOrderedSelector);
  const subvenues = useSelector(subvenuesSelector) ?? [];
  const siblingVenues = useSelector(siblingNotVenueSelector) ?? [];

  const maybeParentEventsSelector = useCallback(
    maybeArraySelector(withEvents, parentEventsWithVenueIdsSelector),
    [withEvents, parentEventsWithVenueIdsSelector] // @debt our linters didnt tell us about these deps not being exhaustive
  );

  const maybeVenueEventsSelector = useCallback(
    maybeArraySelector(withEvents, venueEventsWithVenueIdsSelector),
    [withEvents, venueEventsWithVenueIdsSelector] // @debt our linters didnt tell us about these deps not being exhaustive
  );

  const maybeSiblingEventsSelector = useCallback(
    maybeArraySelector(
      withEvents,
      venueEventsSelectorToEventsWithVenueIds(siblingVenues)
    ),
    [withEvents, siblingVenues] // @debt our linters didnt tell us about these deps not being exhaustive
  );

  const maybeSubvenueEventsSelector = useCallback(
    maybeArraySelector(
      withEvents,
      venueEventsSelectorToEventsWithVenueIds(subvenues)
    ),
    [withEvents, subvenues] // @debt our linters didnt tell us about these deps not being exhaustive
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

  // Sibling
  const siblingVenuesQuery: SparkleRFQSetting | undefined = !!parentId
    ? {
        collection: "venues",
        where: [["parentId", "==", parentId]],
        storeAs: "siblingVenues",
      }
    : undefined;

  // Sub
  const subvenuesQuery: SparkleRFQSetting | undefined = !!venueId
    ? {
        collection: "venues",
        where: [["parentId", "==", venueId]],
        storeAs: "subvenues",
      }
    : undefined;

  const makeEventsQueryConfig = (
    doc: string,
    storeAs: string
  ): SparkleDocRFQSetting =>
    ({
      collection: "venues",
      doc,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs,
    } as SparkleDocRFQSetting); // @debt a little hacky, but we're consciously subverting our helper protections;

  // Parent Events
  const parentVenueEventsQuery: SparkleDocRFQSetting | undefined =
    parentId && withEvents
      ? makeEventsQueryConfig(parentId, "parentVenueEvents")
      : undefined;

  // Sibling Events
  const siblingVenueEventsQueries: SparkleDocRFQSetting[] = withEvents
    ? siblingVenues.map((sibling) =>
        makeEventsQueryConfig(sibling.id, `siblingVenueEvents-${sibling.id}`)
      )
    : [];

  // Sub Events
  const subvenueEventsQueries: SparkleDocRFQSetting[] = withEvents
    ? subvenues.map((subvenue) =>
        makeEventsQueryConfig(subvenue.id, `subvenueEvents-${subvenue.id}`)
      )
    : [];

  // Combine / filter for valid queries
  const allValidQueries: (SparkleRFQSetting | SparkleDocRFQSetting)[] = [
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
    }),
    [
      parentVenue,
      currentVenue,
      relatedVenues,
      relatedVenueEvents,
      parentVenueEvents,
      venueEvents,
      siblingVenueEvents,
      subvenueEvents,
    ]
  );
};
