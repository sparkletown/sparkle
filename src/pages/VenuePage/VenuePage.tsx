import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import JazzbarRouter from "components/venues/Jazzbar/JazzbarRouter";
import PartyMap from "components/venues/PartyMap";
import { User as FUser } from "firebase";
import FriendShipPage from "pages/FriendShipPage";
import { User } from "types/User";
import ChatContext from "components/context/ChatContext";
import { updateTheme } from "./helpers";

export enum VenueTemplate {
  jazzbar = "jazzbar",
  friendship = "friendship",
  partymap = "partymap",
}

export interface Venue {
  id?: string;
  template: VenueTemplate;
  name: string;
  theme: {
    primaryColor: string;
    backgroundColor?: string;
  };
}

const VenuePage = () => {
  const { venueId } = useParams();

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    storeAs: "currentVenue",
  });

  const { venue, user, users } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
    users: state.firestore.ordered.partygoers,
  })) as { venue: Venue; user: FUser; users: User[] };

  venue && updateTheme(venue);

  const venueName = venue && venue.name;
  useUpdateLocationEffect(user, venueName);

  if (!user) {
    if (venueId === "kansassmittys") {
      return <Redirect to={`/venue/${venueId}/jazzbar-entrance-experience`} />;
    }
    return <Redirect to={`/venue/${venueId}/entrance-experience`} />;
  }

  if (!venue || !users) {
    return <>Loading...</>;
  }

  let template;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzbarRouter />;
      break;
    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;
    case VenueTemplate.partymap:
      template = <PartyMap />;
      break;
  }

  return <ChatContext>{template}</ChatContext>;
};

export default VenuePage;
