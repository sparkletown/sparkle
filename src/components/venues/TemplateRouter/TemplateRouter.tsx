import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import EntranceExperience from "components/venues/Jazzbar/EntranceExperience";
import PartyMapRouter from "components/venues/PartyMap/router";
import { ChatContextWrapper } from "components/context/ChatContext";
import { useUser } from "hooks/useUser";

const TemplateRouter = () => {
  useConnectCurrentVenue();
  const { venueId } = useParams();

  const { user } = useUser();
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  })) as {
    venue: Venue;
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
          <ChatContextWrapper>
            <PartyMapRouter />
          </ChatContextWrapper>
        );
      }
      return <EntranceExperience />;
  }
  return <>Error loading venue {venueId}</>;
};

export default TemplateRouter;
