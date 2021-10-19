import { VenueTemplate } from "types/venues";

import RoomIconArtPiece from "assets/icons/icon-room-artpiece.svg";
import RoomIconAuditorium from "assets/icons/icon-room-auditorium.svg";
import RoomIconConversation from "assets/icons/icon-room-conversation.svg";
import RoomEmbeddable from "assets/icons/icon-room-embeddable.svg";
import RoomIconExperience from "assets/icons/icon-room-experience.svg";
import RoomIconMap from "assets/icons/icon-room-map.svg";
import RoomIconMusicBar from "assets/icons/icon-room-musicbar.svg";
import RoomScreening from "assets/icons/icon-room-screening.svg";
import RoomIconViewingWindow from "assets/icons/icon-room-viewingwindow.svg";
import PosterArtPiece from "assets/spaces/add-portal-artpiece.png";
import PosterAuditorium from "assets/spaces/add-portal-auditorium.png";
import PosterConversation from "assets/spaces/add-portal-conversation.png";
import PosterExperience from "assets/spaces/add-portal-experience.png";
import PosterMusicBar from "assets/spaces/add-portal-jazzbar.png";
import PosterMap from "assets/spaces/add-portal-map.png";
// import PosterViewingWindow from "assets/spaces/add-portal-viewingwindow.png";

export interface SpacePortalsListItem {
  text: string;
  poster: string;
  description: string;
  template?: VenueTemplate;
  icon: string;
  hidden?: boolean;
}

export const SPACE_PORTALS_LIST: SpacePortalsListItem[] = [
  {
    text: "Conversation Space",
    icon: RoomIconConversation,
    poster: PosterConversation,
    description:
      "Host any number of small groups from 2-10 in video chats with each other.",
    template: VenueTemplate.conversationspace,
  },
  {
    text: "Auditorium",
    icon: RoomIconAuditorium,
    poster: PosterAuditorium,
    description:
      "Attendees sit in seats around your video content, and can react w/ emojis & shoutouts.",
    template: VenueTemplate.auditorium,
  },
  {
    text: "Music Bar",
    icon: RoomIconMusicBar,
    poster: PosterMusicBar,
    description:
      "Host any number of small groups from 2-10 in video chats with each other around central content.",
    template: VenueTemplate.jazzbar,
  },
  {
    text: "Art Piece",
    icon: RoomIconArtPiece,
    poster: PosterArtPiece,
    description:
      "Small group video chatting around a central piece of content.",
    template: VenueTemplate.artpiece,
  },
  {
    text: "External Experience",
    icon: RoomIconExperience,
    poster: PosterExperience,
    description:
      "Attendees will be directed off-platform, opening your content in a new tab.",
    template: VenueTemplate.zoomroom,
  },
  {
    text: "Map",
    icon: RoomIconMap,
    poster: PosterMap,
    description: "Create “mapception” - a map within a map!",
    template: VenueTemplate.partymap,
  },
  {
    text: "Viewing Window",
    icon: RoomIconViewingWindow,
    poster: PosterArtPiece,
    description:
      "Focus on a central piece of content without any video chatting.",
    template: VenueTemplate.viewingwindow,
  },
  {
    text: "Embeddable",
    icon: RoomEmbeddable,
    poster: "",
    description: "",
    template: VenueTemplate.embeddable,
    hidden: true,
  },
  {
    text: "Screening Room",
    icon: RoomScreening,
    poster: "",
    description: "",
    template: VenueTemplate.screeningroom,
    hidden: true,
  },
];

export const SPACE_PORTALS_ICONS_MAPPING: Record<
  string,
  string
> = Object.freeze(
  SPACE_PORTALS_LIST.reduce(
    (acc, space) => ({ ...acc, [`${space.template}`]: space.icon }),
    {}
  )
);
