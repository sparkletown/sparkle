import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import EntranceExperience from "components/venues/Jazzbar/EntranceExperience";
import PartyMapRouter from "components/venues/PartyMap/router";
import ChatContext from "components/context/ChatContext";

const TemplateRouter = () => {
  useConnectCurrentVenue();
  const { venueId } = useParams();

  const { venue, user } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
  })) as {
    venue: Venue;
    user: any;
  };

  if (!venue) {
    return <>Loading...</>;
  }

  switch (venue.template) {
    case VenueTemplate.jazzbar:
      return <EntranceExperience />;
    case VenueTemplate.partymap:
      if (user) {
        return (
          <ChatContext>
            <PartyMapRouter />
          </ChatContext>
        );
      }
      return <EntranceExperience />;
  }
  return <>Error loading venue {venueId}</>;
};

export default TemplateRouter;
