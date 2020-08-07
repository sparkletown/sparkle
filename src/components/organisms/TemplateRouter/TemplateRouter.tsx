import React from "react";
import { useParams } from "react-router-dom";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { VenueTemplate } from "types/VenueTemplate";
import PartyMap from "components/templates/PartyMap";
import { ChatContextWrapper } from "components/context/ChatContext";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { EntranceExperienceReduxProvider } from "components/templates/EntranceExperienceProvider";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const TemplateRouter = () => {
  useConnectCurrentVenue();
  const { venueId } = useParams();

  const { user } = useUser();
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));

  if (!venue) {
    return <>Loading...</>;
  }

  switch (venue.template) {
    case VenueTemplate.jazzbar:
    case VenueTemplate.artPiece:
      return (
        <WithNavigationBar>
          <EntranceExperienceReduxProvider />
        </WithNavigationBar>
      );
    case VenueTemplate.partymap:
      if (user) {
        return (
          // @debt .partymap should use the EntranceExperienceReduxProvider and this should be in VenuePage
          <ChatContextWrapper>
            <PartyMap />
          </ChatContextWrapper>
        );
      }
      return (
        <WithNavigationBar>
          <EntranceExperienceReduxProvider />
        </WithNavigationBar>
      );
  }
  return <>Error loading venue {venueId}</>;
};

export default TemplateRouter;
