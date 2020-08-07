import React from "react";
import { EntranceExperience } from "./EntranceExperience";
import { EntranceExperienceProps } from "./EntranceExperience/EntranceExperience";
import { useSelector } from "hooks/useSelector";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";

// this abstraction is due to uncertainty about whether there are different entrance experiences for different venue types
export const EntranceExperiencePreviewProvider: React.FC<EntranceExperienceProps> = (
  props
) => {
  return <EntranceExperience {...props} />;
};

export const EntranceExperienceReduxProvider: React.FC = () => {
  const data = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    venueEvents: state.firestore.ordered.venueEvents,
    purchaseHistory: state.firestore.ordered.userPurchaseHistory,
  }));

  const { venueId } = useParams();
  useConnectCurrentVenue();

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    subcollections: [{ collection: "events" }],
    storeAs: "venueEvents",
    orderBy: ["start_utc_seconds", "asc"],
  });

  return <EntranceExperience venueId={venueId} {...data} />;
};
