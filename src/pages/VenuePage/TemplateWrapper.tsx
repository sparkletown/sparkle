import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import { AnyVenue, VenueTemplate, AuditoriumVenue } from "types/venues";

import { FriendShipPage } from "pages/FriendShipPage";

import { ArtPiece } from "components/templates/ArtPiece";
import { Audience } from "components/templates/Audience/Audience";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { Embeddable } from "components/templates/Embeddable";
import { FireBarrel } from "components/templates/FireBarrel";
import { Jazzbar } from "components/templates/Jazzbar";
import { PartyMap } from "components/templates/PartyMap";
import { PlayaRouter } from "components/templates/Playa/Router";
import { ReactionPage } from "components/templates/ReactionPage";
import { Auditorium } from "components/templates/Auditorium";

import { ChatSidebar } from "components/organisms/ChatSidebar";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { AnnouncementMessage } from "components/molecules/AnnouncementMessage";

export interface TemplateWrapperProps {
  venue: AnyVenue;
}

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ venue }) => {
  const history = useHistory();
  const match = useRouteMatch();

  let template;
  // @debt remove backButton from Navbar
  let hasBackButton = true;
  let fullscreen = false;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = (
        <Switch>
          <Route path={`${match.path}/reactions`} component={ReactionPage} />
          <Route component={Jazzbar} />
        </Switch>
      );
      hasBackButton = false;
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

    // Note: This is the template that is used for the Auditorium
    case VenueTemplate.audience:
      template = (
        <Switch>
          <Route path={`${match.path}/reactions`} component={ReactionPage} />
          <Route component={Audience} />
        </Switch>
      );
      fullscreen = true;
      break;

    case VenueTemplate.conversationspace:
      template = <ConversationSpace />;
      break;

    case VenueTemplate.embeddable:
      template = <Embeddable venue={venue} />;
      fullscreen = true;
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
      // Technically TypeScript should prevent us missing a case here, but just in case, we work around it with an explicit cast to be able to render this
      template = <div>Unknown Template: ${(venue as AnyVenue).template}</div>;
  }

  // DEVELOPMENT-MODE HACK
  template = <Auditorium venue={venue as AuditoriumVenue} />;
  fullscreen = true;

  return (
    // @debt remove backButton from Navbar
    <WithNavigationBar fullscreen={fullscreen} hasBackButton={hasBackButton}>
      <AnnouncementMessage message={venue?.bannerMessage} />
      {template}
      <ChatSidebar />
    </WithNavigationBar>
  );
};

export default TemplateWrapper;
