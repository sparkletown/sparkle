import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { RouterLocation } from "types/RouterLocation";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import EntranceExperience from "components/venues/Jazzbar/EntranceExperience";
import PartyMapRouter from "components/venues/PartyMap/router";
import ChatContext from "components/context/ChatContext";
import { useUser } from "hooks/useUser";

interface PropsType {
  location: RouterLocation;
}

const TemplateRouter: React.FunctionComponent<PropsType> = ({ location }) => {
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
      return <EntranceExperience location={location} />;
    case VenueTemplate.partymap:
      if (user) {
        return (
          <ChatContext>
            <PartyMapRouter />
          </ChatContext>
        );
      }
      return <EntranceExperience location={location} />;
  }
  return <>Error loading venue {venueId}</>;
};

export default TemplateRouter;
