import React from "react";
import { useHistory } from "react-router-dom";

import { Venue, VenueTemplate } from "types/venues";

import { FriendShipPage } from "pages/FriendShipPage";
import { ArtPiece } from "components/templates/ArtPiece";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { JazzbarRouter } from "components/templates/Jazzbar/JazzbarRouter";
import { PlayaRouter } from "components/templates/Playa/Router";
import { PartyMapRouter } from "components/templates/PartyMap/PartyMapRouter";
import { FireBarrel } from "components/templates/FireBarrel";
import { Audience } from "components/templates/Audience/Audience";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";
import { AvatarGrid } from "components/templates/AvatarGrid";


type Props = {
  venue: Venue;
};

const TemplateWrapper: React.FC<Props> = ({ venue }) => {
  const history = useHistory();

  let template;
  let fullscreen = false;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzbarRouter />;
      break;
    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;
    case VenueTemplate.partymap:
    case VenueTemplate.themecamp:
      template = <PartyMapRouter />;
      break;
    case VenueTemplate.artpiece:
      template = <ArtPiece />;
      break;
    case VenueTemplate.playa:
    case VenueTemplate.preplaya:
      template = <PlayaRouter />;
      fullscreen = true;
      break;
    case VenueTemplate.zoomroom:
    case VenueTemplate.performancevenue:
    case VenueTemplate.artcar:
      if (venue.zoomUrl) {
        window.location.replace(venue.zoomUrl);
      }
      template = (
        <p>
          Venue {venue.name} should redirect to a URL, but none was set.
          <br />
          <button
            role="link"
            className="btn btn-primary"
            onClick={() => history.goBack()}
          >
            Go Back
          </button>
        </p>
      );
      break;
    case VenueTemplate.audience:
      template = <Audience />;
      fullscreen = true;
      break;
    case VenueTemplate.avatargrid:
      template = <AvatarGrid />;
      break;
    case VenueTemplate.conversationspace:
      template = <ConversationSpace />;
      break;

    case VenueTemplate.firebarrel:
      template = <FireBarrel />;
      break;
  }

  return (
    <WithNavigationBar fullscreen={fullscreen}>{template}</WithNavigationBar>
  );
};

export default TemplateWrapper;
