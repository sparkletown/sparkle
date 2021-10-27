import { PortalTemplate, VenueTemplate } from "types/venues";

import IconArtPiece from "assets/icons/icon-room-artpiece.svg";
import IconAuditorium from "assets/icons/icon-room-auditorium.svg";
import IconConversation from "assets/icons/icon-room-conversation.svg";
import IconEmbeddable from "assets/icons/icon-room-embeddable.svg";
import IconExperience from "assets/icons/icon-room-experience.svg";
import IconExternalLink from "assets/icons/icon-room-externallink.svg";
import IconMap from "assets/icons/icon-room-map.svg";
import IconMusicBar from "assets/icons/icon-room-musicbar.svg";
import IconScreening from "assets/icons/icon-room-screening.svg";
import IconViewingWindow from "assets/icons/icon-room-viewingwindow.svg";
import PosterArtPiece from "assets/spaces/add-portal-artpiece.png";
import PosterAuditorium from "assets/spaces/add-portal-auditorium.png";
import PosterConversation from "assets/spaces/add-portal-conversation.png";
import PosterExperience from "assets/spaces/add-portal-experience.png";
import PosterMusicBar from "assets/spaces/add-portal-jazzbar.png";
import PosterMap from "assets/spaces/add-portal-map.png";

export interface SpacePortalsListItem {
  text: string;
  poster: string;
  description: string;
  template?: PortalTemplate;
  icon: string;
  hidden?: boolean;
}

export const SPACE_PORTALS_LIST: SpacePortalsListItem[] = [
  {
    text: "Conversation Space",
    icon: IconConversation,
    poster: PosterConversation,
    description:
      "Host any number of small groups from 2-10 in video chats with each other.",
    template: VenueTemplate.conversationspace,
  },
  {
    text: "Auditorium",
    icon: IconAuditorium,
    poster: PosterAuditorium,
    description:
      "Attendees sit in seats around your video content, and can react w/ emojis & shoutouts.",
    template: VenueTemplate.auditorium,
  },
  {
    text: "Music Bar",
    icon: IconMusicBar,
    poster: PosterMusicBar,
    description:
      "Host any number of small groups from 2-10 in video chats with each other around central content.",
    template: VenueTemplate.jazzbar,
  },
  {
    text: "Art Piece",
    icon: IconArtPiece,
    poster: PosterArtPiece,
    description:
      "Small group video chatting around a central piece of content.",
    template: VenueTemplate.artpiece,
  },
  {
    text: "External Experience",
    icon: IconExperience,
    poster: PosterExperience,
    description:
      "Attendees will be directed off-platform, opening your content in a new tab.",
    template: VenueTemplate.zoomroom,
  },
  {
    text: "Map",
    icon: IconMap,
    poster: PosterMap,
    description: "Create “mapception” - a map within a map!",
    template: VenueTemplate.partymap,
  },
  {
    text: "Viewing Window",
    icon: IconViewingWindow,
    poster: PosterArtPiece,
    description:
      "Focus on a central piece of content without any video chatting.",
    template: VenueTemplate.viewingwindow,
    hidden: true,
  },
  {
    text: "Embeddable",
    icon: IconEmbeddable,
    poster: "",
    description: "",
    template: VenueTemplate.embeddable,
    hidden: false,
  },
  {
    text: "Screening Room",
    icon: IconScreening,
    poster: "",
    description: "",
    template: VenueTemplate.screeningroom,
    hidden: true,
  },
  {
    text: "External link",
    icon: IconExternalLink,
    poster: "",
    description:
      "New Space will not be created and the Space name will be used as the title for the newly added External Link portal",
    template: "external",
    hidden: true,
  },
];

export const SPACE_PORTALS_ICONS_MAPPING: Record<
  string,
  string
> = Object.freeze(
  Object.fromEntries(
    SPACE_PORTALS_LIST.map(({ template, icon }) => [template, icon])
  )
);
