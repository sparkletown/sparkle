import { siblingVenuesSelector, subvenuesSelector } from "utils/selectors";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useSelector } from "./useSelector";
import {
  SparkleRFQConfig,
  useSparkleFirestoreConnect,
} from "./useSparkleFirestoreConnect";

export const useConnectRelatedVenues = (venueId: string | null) => {
  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  const subvenuesQuery: SparkleRFQConfig = {
    collection: "venues",
    where: [["parentId", "==", venueId]],
    storeAs: "subvenues",
  };
  const subvenues = useSelector(subvenuesSelector);
  const subvenueEventsQueries: SparkleRFQConfig[] =
    subvenues?.map((subvenue) => ({
      collection: "venues",
      doc: subvenue.id,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "subvenueEvents",
    })) ?? [];
  useSparkleFirestoreConnect([subvenuesQuery, ...subvenueEventsQueries]);

  const parentVenueEventsQuery: SparkleRFQConfig = {
    collection: "venues",
    doc: currentVenue?.parentId,
    subcollections: [{ collection: "events" }],
    orderBy: ["start_utc_seconds", "asc"],
    storeAs: "parentVenueEvents",
  };

  const siblingVenuesQuery: SparkleRFQConfig = {
    collection: "venues",
    where: [["parentId", "==", currentVenue?.parentId]],
    storeAs: "siblingVenues",
  };
  const siblingVenues = useSelector(siblingVenuesSelector);
  const siblingVenueEventsQueries: SparkleRFQConfig[] =
    siblingVenues
      ?.filter((v) => v.id !== venueId)
      .map((siblingVenue) => ({
        collection: "venues",
        doc: siblingVenue.id,
        storeAs: "siblingVenueEvents",
      })) ?? [];

  useSparkleFirestoreConnect(
    currentVenue?.parentId
      ? [
          parentVenueEventsQuery,
          siblingVenuesQuery,
          ...siblingVenueEventsQueries,
        ]
      : []
  );
};
