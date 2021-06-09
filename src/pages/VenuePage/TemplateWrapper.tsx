import React, { useCallback } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import { AnyVenue, VenueTemplate } from "types/venues";
import { TemplatesWithoutBackButton } from "types/templates";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";
import { parentVenueSelector } from "utils/selectors";

import { ReactionsProvider } from "hooks/reactions";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";

import { FriendShipPage } from "pages/FriendShipPage";

import { ArtPiece } from "components/templates/ArtPiece";
import { Audience } from "components/templates/Audience/Audience";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { Embeddable } from "components/templates/Embeddable";
import { FireBarrel } from "components/templates/FireBarrel";
import { Jazzbar } from "components/templates/Jazzbar";
import { PartyMap } from "components/templates/PartyMap";
import { PlayaRouter } from "components/templates/Playa/Router";
import { PosterHall } from "components/templates/PosterHall";
import { PosterPage } from "components/templates/PosterPage";
import { ScreeningRoom } from "components/templates/ScreeningRoom";
import { ReactionPage } from "components/templates/ReactionPage";
import { ChatSidebar } from "components/organisms/ChatSidebar";
import { UserProfileModal } from "components/organisms/UserProfileModal";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";
import { AnnouncementMessage } from "components/molecules/AnnouncementMessage";
import { BackButton } from "components/atoms/BackButton";

export interface TemplateWrapperProps {
  venue: WithId<AnyVenue>;
}

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ venue }) => {
  const { push: openUrlUsingRouter, ...history } = useHistory();
  const match = useRouteMatch();
  const parentVenue = useSelector(parentVenueSelector);

  let template;
  let fullscreen = false;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = (
        <Switch>
          <Route path={`${match.path}/reactions`} component={ReactionPage} />
          <Route component={Jazzbar} />
        </Switch>
      );
      break;

    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;

    case VenueTemplate.partymap:
    case VenueTemplate.themecamp:
      template = <PartyMap venue={venue} />;
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

  const parentVenueId = venue.parentId;

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [openUrlUsingRouter, parentVenueId]);

  const showBackButton =
    !TemplatesWithoutBackButton.includes(venue.template) && parentVenue;

  return (
    <RelatedVenuesProvider venueId={venue.id}>
      <ReactionsProvider venueId={venue.id}>
        <WithNavigationBar fullscreen={fullscreen}>
          <AnnouncementMessage message={venue.bannerMessage} />
          {template}
          {showBackButton && (
            <BackButton
              onClick={backToParentVenue}
              title={parentVenue ? `Back to ${parentVenue.name}` : "Back"}
            />
          )}
          <ChatSidebar venue={venue} />
          <UserProfileModal venue={venue} />
        </WithNavigationBar>
      </ReactionsProvider>
    </RelatedVenuesProvider>
  );
};

export default TemplateWrapper;
