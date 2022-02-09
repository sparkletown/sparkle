import React, { lazy } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { VENUES_WITH_CHAT_REQUIRED } from "settings";

import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isWebGl2Enabled } from "utils/webgl";

import { ReactionsProvider } from "hooks/reactions";
import { useSettings } from "hooks/useSettings";

import { AnimateMapErrorPrompt } from "components/templates/AnimateMap/components/AnimateMapErrorPrompt";
import { ArtPiece } from "components/templates/ArtPiece";
import { Auditorium } from "components/templates/Auditorium";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { Embeddable } from "components/templates/Embeddable";
import { ExternalRoom } from "components/templates/ExternalRoom";
import { FireBarrel } from "components/templates/FireBarrel";
import { JazzBarPage } from "components/templates/Jazzbar";
import { PartyMap } from "components/templates/PartyMap";
import { PosterHall } from "components/templates/PosterHall";
import { PosterPage } from "components/templates/PosterPage";
import { ReactionPage } from "components/templates/ReactionPage";
import { ScreeningRoom } from "components/templates/ScreeningRoom";
import { ViewingWindow } from "components/templates/ViewingWindow";

import { ChatSidebar } from "components/organisms/ChatSidebar";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { AnnouncementMessage } from "components/molecules/AnnouncementMessage";

const AnimateMap = lazy(() =>
  tracePromise("TemplateWrapper::lazy-import::AnimateMap", () =>
    import("components/templates/AnimateMap").then(({ AnimateMap }) => ({
      default: AnimateMap,
    }))
  )
);

interface TemplateWrapperProps {
  venue: WithId<AnyVenue>;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ venue }) => {
  const match = useRouteMatch();
  const { isLoaded: areSettingsLoaded, settings } = useSettings();

  const shouldShowChat =
    areSettingsLoaded &&
    (settings.showChat || VENUES_WITH_CHAT_REQUIRED.includes(venue.template));

  let template;
  // @debt remove backButton from Navbar
  let hasBackButton = true;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = (
        <Switch>
          <Route path={`${match.path}/reactions`} component={ReactionPage} />
          <Route render={() => <JazzBarPage venue={venue} />} />
        </Switch>
      );
      // NOTE: Remove the back button, because we don't need it in Table view
      hasBackButton = false;
      break;

    case VenueTemplate.partymap:
      template = <PartyMap venue={venue} />;
      break;

    case VenueTemplate.animatemap:
      // NOTE: this is a must check for not spilling over global errors from animatemap onto other templates when it is unused
      template = isWebGl2Enabled() ? (
        // <Suspense fallback={LoadingPage}> //todo: fix this
        <AnimateMap space={venue} />
      ) : (
        // </Suspense>
        <AnimateMapErrorPrompt variant="unsupported" />
      );
      break;

    case VenueTemplate.artpiece:
      template = <ArtPiece venue={venue} />;
      break;
    case VenueTemplate.zoomroom:
      template = <ExternalRoom venue={venue} />;
      break;

    case VenueTemplate.viewingwindow:
      template = <ViewingWindow venue={venue} />;
      break;

    case VenueTemplate.auditorium:
      template = <Auditorium venue={venue} />;
      // NOTE: Remove the back button, because we need to implement it differently in Section
      hasBackButton = false;
      break;

    case VenueTemplate.conversationspace:
      template = <ConversationSpace venue={venue} />;
      // Remove the back button, because we don't need it in Table view
      hasBackButton = false;
      break;

    case VenueTemplate.embeddable:
      template = <Embeddable venue={venue} />;
      break;

    case VenueTemplate.firebarrel:
      template = <FireBarrel venue={venue} />;
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

    case VenueTemplate.friendship:
    case VenueTemplate.themecamp:
    case VenueTemplate.audience:
    case VenueTemplate.artcar:
    case VenueTemplate.performancevenue:
    case VenueTemplate.avatargrid:
    case VenueTemplate.playa:
    case VenueTemplate.preplaya:
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

  return (
    <ReactionsProvider venueId={venue.id}>
      <WithNavigationBar hasBackButton={hasBackButton} withSchedule withRadio>
        <AnnouncementMessage isAnnouncementUserView />

        {template}

        {shouldShowChat && <ChatSidebar venue={venue} />}
      </WithNavigationBar>
    </ReactionsProvider>
  );
};
