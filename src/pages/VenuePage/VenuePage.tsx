import React from "react";
import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import JazzbarRouter from "components/venues/Jazzbar/JazzbarRouter";
import { User as FUser } from "firebase";

enum VenueTemplate {
  jazzbar = "jazzbar",
}

interface Venue {
  template: VenueTemplate;
  iframeUrl?: string;
}

const VenuePage = () => {
  let { venueName } = useParams();

  useFirestoreConnect({
    collection: "venues",
    doc: venueName,
    storeAs: "currentVenue",
  });

  const { venue, user } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
  })) as { venue: Venue; user: FUser };

  useUpdateLocationEffect(user, venueName);

  if (!venue) {
    return "Loading...";
  }

  let template;
  if (venue.template === VenueTemplate.jazzbar) {
    template = <JazzbarRouter venueName={venueName} />;
  }

  return template;
};

export default VenuePage;
