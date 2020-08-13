import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import getQueryParameters from "utils/getQueryParameters";
import { useState } from "react";

const useConnectCurrentVenue = () => {
  let { venueId } = useParams();
  if (!venueId) {
    venueId = getQueryParameters(window.location.search)?.venueId;
  }
  const [currentTimestamp] = useState(Date.now() / 1000);

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      storeAs: "currentVenue",
    },
  ]);

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events" }],
      where: [["start_utc_seconds", ">=", currentTimestamp]],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "venueEvents",
    },
  ]);
};

export default useConnectCurrentVenue;
