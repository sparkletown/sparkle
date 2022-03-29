import React, { lazy, Suspense } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { SpaceWithId } from "types/id";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isWebGl2Enabled } from "utils/webgl";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { ReactionsProvider } from "hooks/reactions";

import { AnimateMapErrorPrompt } from "components/templates/AnimateMap/components/AnimateMapErrorPrompt";
import { ArtPiece } from "components/templates/ArtPiece";
import { Auditorium } from "components/templates/Auditorium";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { Embeddable } from "components/templates/Embeddable";
import { ExperimentalSpace } from "components/templates/ExperimentalSpace";
import { ExternalRoom } from "components/templates/ExternalRoom";
import { FireBarrel } from "components/templates/FireBarrel";
import { JazzBar } from "components/templates/Jazzbar/JazzBar";
import { MeetingRoom } from "components/templates/MeetingRoom";
import { PartyMap } from "components/templates/PartyMap";
import { PosterHall } from "components/templates/PosterHall";
import { PosterPage } from "components/templates/PosterPage";
import { ScreeningRoom } from "components/templates/ScreeningRoom";
import { ViewingWindow } from "components/templates/ViewingWindow";

import { LoadingPage } from "components/molecules/LoadingPage";

import styles from "./TemplateWrapper.module.scss";

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
  const { isExpanded: isChatExpanded } = useChatSidebarControls();

  let template;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzBar space={venue} />;
      break;

    case VenueTemplate.partymap:
      template = <PartyMap venue={venue} />;
      break;

    case VenueTemplate.animatemap:
      // NOTE: this is a must check for not spilling over global errors from animatemap onto other templates when it is unused
      template = isWebGl2Enabled() ? (
        <Suspense fallback={LoadingPage}>
          <AnimateMap space={venue} />
        </Suspense>
      ) : (
        <AnimateMapErrorPrompt variant="unsupported" />
      );
      break;

    case VenueTemplate.artpiece:
      template = <ArtPiece space={venue} />;
      break;

    case VenueTemplate.zoomroom:
      template = <ExternalRoom venue={venue} />;
      break;

    case VenueTemplate.viewingwindow:
      template = <ViewingWindow venue={venue} />;
      break;

    case VenueTemplate.auditorium:
      template = <Auditorium venue={venue} />;
      break;

    case VenueTemplate.conversationspace:
      template = <ConversationSpace space={venue} />;
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

    case VenueTemplate.meetingroom:
      template = <MeetingRoom space={venue as SpaceWithId} />;
      break;

    case VenueTemplate.experiment:
      template = <ExperimentalSpace venue={venue} />;
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

  const isPartyMap = venue.template === VenueTemplate.partymap;
  const venueShrinksForChat = !isPartyMap;

  const backgroundCss = useCss({
    backgroundImage:
      venue.backgroundImageUrl && `url(${venue.backgroundImageUrl})`,
  });

  const containerClassnames = classNames(
    styles.templateContainer,
    backgroundCss,
    {
      [styles.shrunk]: isChatExpanded && venueShrinksForChat,
      [styles.gradients]: !venue.backgroundImageUrl && !isPartyMap,
    }
  );

  return (
    <ReactionsProvider venueId={venue.id}>
      {/* TODO <AnnouncementMessage isAnnouncementUserView /> */}
      <div className={containerClassnames}>{template}</div>

      {/* TODO {shouldShowChat && <ChatSidebar venue={venue} />} */}
    </ReactionsProvider>
  );
};
