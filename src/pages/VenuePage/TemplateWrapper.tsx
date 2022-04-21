import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { SpaceWithId } from "types/id";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { ReactionsProvider } from "hooks/reactions";
import { useTrackPresence } from "hooks/user/usePresence";

import { ArtPiece } from "components/templates/ArtPiece";
import { Auditorium } from "components/templates/Auditorium";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { Embeddable } from "components/templates/Embeddable";
import { ExperimentalSpace } from "components/templates/ExperimentalSpace";
import { ExternalExperience } from "components/templates/ExternalExperience";
import { JazzBar } from "components/templates/Jazzbar";
import { MeetingRoom } from "components/templates/MeetingRoom";
import { PartyMap } from "components/templates/PartyMap";
import { PosterHall } from "components/templates/PosterHall";
import { PosterPage } from "components/templates/PosterPage";
import { ScreeningRoom } from "components/templates/ScreeningRoom";

import styles from "./TemplateWrapper.module.scss";

interface TemplateWrapperProps {
  venue: SpaceWithId;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ venue }) => {
  const { isExpanded: isChatExpanded } = useChatSidebarControls();

  useTrackPresence();

  let template;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzBar space={venue} />;
      break;

    case VenueTemplate.partymap:
      template = <PartyMap venue={venue} />;
      break;

    case VenueTemplate.artpiece:
      template = <ArtPiece space={venue} />;
      break;

    case VenueTemplate.zoomroom:
      template = <ExternalExperience space={venue} />;
      break;

    case VenueTemplate.auditorium:
      template = <Auditorium venue={venue} />;
      break;

    case VenueTemplate.conversationspace:
      template = <ConversationSpace space={venue} />;
      break;

    case VenueTemplate.embeddable:
      template = <Embeddable space={venue} />;
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
      template = <MeetingRoom space={venue} />;
      break;

    case VenueTemplate.experiment:
      template = <ExperimentalSpace venue={venue} />;
      break;

    default:
      // Technically TypeScript should prevent us missing a case here, but just in case, we work around it with an explicit cast to be able to render this
      template = (
        <div
          data-bem="TemplateWrapper__unknown"
          data-block="UnknownSpaceTemplate"
          data-side="att"
        >
          Unknown Template: ${(venue as AnyVenue).template}
        </div>
      );
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
      [styles.gradients]: !venue.backgroundImageUrl && !isPartyMap,
    }
  );

  const wrapperClassnames = classNames({
    [styles.shrunk]: isChatExpanded && venueShrinksForChat,
  });

  return (
    <ReactionsProvider venueId={venue.id}>
      {/* TODO <AnnouncementMessage isAnnouncementUserView /> */}
      <div className={containerClassnames}>
        <div className={wrapperClassnames}>{template}</div>
      </div>

      {/* TODO {shouldShowChat && <ChatSidebar venue={venue} />} */}
    </ReactionsProvider>
  );
};
