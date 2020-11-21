import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";
import { siblingVenuesSelector, subvenuesSelector } from "utils/selectors";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useSelector } from "./useSelector";
import { SparkleRFQConfig } from "./useSparkleFirestoreConnect";

export const useConnectRelatedVenues = (venueId?: string) => {
  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  const subvenuesQuery: SparkleRFQConfig = {
    collection: "venues",
    where: [["parentId", "==", venueId]],
    storeAs: "subvenues",
  };
  const subvenues = useSelector(subvenuesSelector);
  const subvenueEventsQueries: ReduxFirestoreQuerySetting[] =
    subvenues?.map((subvenue) => ({
      collection: "venues",
      doc: subvenue.id,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: `subvenueEvents-${subvenue.id}`,
    })) ?? [];
  useFirestoreConnect([subvenuesQuery, ...subvenueEventsQueries]);

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
  const siblingVenueEventsQueries: ReduxFirestoreQuerySetting[] =
    siblingVenues
      ?.filter((v) => v.id !== venueId)
      .map((siblingVenue) => ({
        collection: "venues",
        doc: siblingVenue.id,
        storeAs: `siblingVenueEvents-${siblingVenue.id}`,
      })) ?? [];

  useFirestoreConnect(
    currentVenue?.parentId
      ? [
          parentVenueEventsQuery,
          siblingVenuesQuery,
          ...siblingVenueEventsQueries,
        ]
      : []
  );
};
