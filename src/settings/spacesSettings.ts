import { VenueTemplate } from "types/venues";

import RoomIconArtPiece from "assets/icons/icon-room-artpiece.svg";
import RoomIconAuditorium from "assets/icons/icon-room-auditorium.svg";
import RoomIconBurnBarrel from "assets/icons/icon-room-burnbarrel.svg";
import RoomIconConversation from "assets/icons/icon-room-conversation.svg";
import RoomIconExperience from "assets/icons/icon-room-experience.svg";
import RoomIconMap from "assets/icons/icon-room-map.svg";
import RoomIconMusicBar from "assets/icons/icon-room-musicbar.svg";

export interface SpacesListItem {
  text: string;
  template?: VenueTemplate;
  icon: string;
}

export const VENUE_SPACES_LIST: SpacesListItem[] = [
  {
    text: "Conversation Space",
    icon: RoomIconConversation,
    template: VenueTemplate.conversationspace,
  },
  {
    text: "Auditorium",
    icon: RoomIconAuditorium,
    template: VenueTemplate.auditorium,
  },
  {
    text: "Music Bar",
    icon: RoomIconMusicBar,
    template: VenueTemplate.jazzbar,
  },
  {
    text: "Burn Firebarrel",
    icon: RoomIconBurnBarrel,
    template: VenueTemplate.firebarrel,
  },
  {
    text: "Art Piece",
    icon: RoomIconArtPiece,
    template: VenueTemplate.artpiece,
  },
  {
    text: "Experience",
    icon: RoomIconExperience,
    template: VenueTemplate.zoomroom,
  },
  {
    text: "Map",
    icon: RoomIconMap,
    template: VenueTemplate.partymap,
  },
];

export const VENUE_SPACES_ICONS_MAPPING: Record<string, string> = Object.freeze(
  VENUE_SPACES_LIST.reduce(
    (acc, space) => ({ ...acc, [`${space.template}`]: space.icon }),
    {}
  )
);
