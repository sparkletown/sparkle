import React from "react";
import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

import Jazzbar from "components/venues/Jazzbar";

enum VenueTemplate {
  jazzbar = "jazzbar",
}

interface Venue {
  template: VenueTemplate;
}

const VenuePage = () => {
  let { venueName } = useParams();

  useFirestoreConnect({
    collection: "venues",
    doc: venueName,
    storeAs: "currentVenue",
  });

  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  })) as { venue: Venue };

  if (!venue) {
    return "Loading...";
  }

  let template;
  if (venue.template === VenueTemplate.jazzbar) {
    template = <Jazzbar />;
  }

  return template;
};

export default VenuePage;
