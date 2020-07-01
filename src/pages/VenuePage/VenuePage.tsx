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
  name: string;
}

const VenuePage = () => {
  const { venueId } = useParams();

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    storeAs: "currentVenue",
  });

  const { venue, user } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
  })) as { venue: Venue; user: FUser };

  const venueName = venue && venue.name;
  useUpdateLocationEffect(user, venueName);

  if (!venue) {
    return "Loading...";
  }

  let template;
  if (venue.template === VenueTemplate.jazzbar) {
    template = <JazzbarRouter venueName={venue.name} />;
  }

  return template;
};

export default VenuePage;
