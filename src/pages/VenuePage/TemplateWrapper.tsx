import React from "react";
import { useHistory } from "react-router-dom";

import { ArtPiece } from "components/templates/ArtPiece";
import { AudienceRouter } from "components/templates/Audience/AudienceRouter";
import { AvatarRouter } from "components/templates/AvatarGrid/Router";
import { CampRouter } from "components/templates/Camp/Router";
import { ConversationSpace } from "components/templates/ConversationSpace";
import FireBarrel from "components/templates/FireBarrel";
import { JazzbarRouter } from "components/templates/Jazzbar/JazzbarRouter";
import { PlayaRouter } from "components/templates/Playa/Router";
import { PartyMapRouter } from "components/templates/PartyMap/PartyMapRouter";

import { FriendShipPage } from "pages/FriendShipPage";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { VenueTemplate } from "types/VenueTemplate";
import { Venue } from "types/Venue";

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
      template = <PartyMapRouter />;
      break;
    case VenueTemplate.artpiece:
      template = <ArtPiece />;
      break;
    case VenueTemplate.themecamp:
      template = <CampRouter />;
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
      template = <AudienceRouter />;
      fullscreen = true;
      break;
    case VenueTemplate.avatargrid:
      template = <AvatarRouter />;
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
