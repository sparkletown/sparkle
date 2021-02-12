import React from "react";
import { useHistory } from "react-router-dom";

import { Venue, VenueTemplate } from "types/venues";

import { FriendShipPage } from "pages/FriendShipPage";
import { ArtPiece } from "components/templates/ArtPiece";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { PlayaRouter } from "components/templates/Playa/Router";
import { FireBarrel } from "components/templates/FireBarrel";
import { Audience } from "components/templates/Audience/Audience";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";
import { PartyMap } from "components/templates/PartyMap";
import { Jazzbar } from "components/templates/Jazzbar";
import { AnnouncementMessage } from "components/molecules/AnnouncementMessage";

type TemplateWrapperProps = {
  venue: Venue;
};

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ venue }) => {
  const history = useHistory();

  let template;
  let fullscreen = false;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <Jazzbar />;
      break;
    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;
    case VenueTemplate.partymap:
    case VenueTemplate.themecamp:
      template = <PartyMap />;
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
    case VenueTemplate.conversationspace:
      template = <ConversationSpace />;
      break;

    case VenueTemplate.firebarrel:
      template = <FireBarrel />;
      break;

    case VenueTemplate.avatargrid:
      template = (
        <div>
          Legacy Template: ${venue.template} has been removed from the platform
        </div>
      );
      break;

    default:
      template = <div>Unknown Template: ${venue.template}</div>;
  }

  return (
    <WithNavigationBar fullscreen={fullscreen}>
      <AnnouncementMessage
        message={venue?.bannerMessage}
        template={venue.template}
      />
      {template}
    </WithNavigationBar>
  );
};

export default TemplateWrapper;
