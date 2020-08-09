import React from "react";
import { useParams } from "react-router-dom";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import EntranceExperience from "components/templates/Jazzbar/EntranceExperience";
import PartyMapRouter from "components/templates/PartyMap";
import { ChatContextWrapper } from "components/context/ChatContext";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { WalkerRouter } from "components/templates/Walker/Router";

const TemplateRouter = () => {
  useConnectCurrentVenue();
  const { venueId } = useParams();

  const { user } = useUser();
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  })) as {
    venue: Venue;
  };

  if (!venue) {
    return <>Loading...</>;
  }

  if (!user) {
    return <EntranceExperience />;
  }

  switch (venue.template) {
    case VenueTemplate.jazzbar:
      return <EntranceExperience />;
    case VenueTemplate.partymap:
      return (
        <ChatContextWrapper>
          <PartyMapRouter />
        </ChatContextWrapper>
      );
    case VenueTemplate.walker:
      return (
        <ChatContextWrapper>
          <WalkerRouter />
        </ChatContextWrapper>
      );
  }
  return <>Error loading venue {venueId}</>;
};

export default TemplateRouter;
