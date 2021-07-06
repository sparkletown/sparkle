import React, { Suspense } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { ReactionsProvider } from "hooks/reactions";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { FriendShipPage } from "pages/FriendShipPage";

import { ArtPiece } from "components/templates/ArtPiece";
import { Audience } from "components/templates/Audience/Audience";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { Embeddable } from "components/templates/Embeddable";
import { FireBarrel } from "components/templates/FireBarrel";
import { Jazzbar } from "components/templates/Jazzbar";
import { PlayaRouter } from "components/templates/Playa/Router";
import { PosterHall } from "components/templates/PosterHall";
import { PosterPage } from "components/templates/PosterPage";
import { ScreeningRoom } from "components/templates/ScreeningRoom";
import { ReactionPage } from "components/templates/ReactionPage";

const PartyMap = React.lazy(() =>
  import("components/templates/PartyMap").then((m) => ({ default: m.PartyMap }))
);

const ChatSidebar = React.lazy(() =>
  import("components/organisms/ChatSidebar").then((m) => ({
    default: m.ChatSidebar,
  }))
);

const UserProfileModal = React.lazy(() =>
  import("components/organisms/UserProfileModal").then((m) => ({
    default: m.UserProfileModal,
  }))
);

const WithNavigationBar = React.lazy(() =>
  import("components/organisms/WithNavigationBar").then((m) => ({
    default: m.WithNavigationBar,
  }))
);

const AnnouncementMessage = React.lazy(() =>
  import("components/molecules/AnnouncementMessage").then((m) => ({
    default: m.AnnouncementMessage,
  }))
);

export interface TemplateWrapperProps {
  venue: WithId<AnyVenue>;
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
      template = (
        <Suspense fallback={<></>}>
          <PartyMap venue={venue} />
        </Suspense>
      );
      break;

    case VenueTemplate.artpiece:
      template = <ArtPiece venue={venue} />;
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
          <Route>
            <Audience venue={venue} />
          </Route>
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

    case VenueTemplate.posterhall:
      template = <PosterHall venue={venue} />;
      break;

    case VenueTemplate.posterpage:
      template = <PosterPage venue={venue} />;
      break;

    case VenueTemplate.screeningroom:
      template = <ScreeningRoom venue={venue} />;
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

  // @debt remove backButton from Navbar
  return (
    <RelatedVenuesProvider venueId={venue.id}>
      <ReactionsProvider venueId={venue.id}>
        <Suspense fallback={<></>}>
          <WithNavigationBar
            fullscreen={fullscreen}
            hasBackButton={hasBackButton}
          >
            <Suspense fallback={<></>}>
              <AnnouncementMessage message={venue.bannerMessage} />
            </Suspense>
            {template}
            <Suspense fallback={<></>}>
              <ChatSidebar venue={venue} />
            </Suspense>
            <Suspense fallback={<></>}>
              <UserProfileModal venue={venue} />
            </Suspense>
          </WithNavigationBar>
        </Suspense>
      </ReactionsProvider>
    </RelatedVenuesProvider>
  );
};

export default TemplateWrapper;
