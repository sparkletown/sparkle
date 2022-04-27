import IconAnimateMap from "common/AnimateMap/assets/icons/icon-room-animatemap.svg";

import { PortalBox, PortalInput } from "types/rooms";
import { PortalTemplate } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import IconArtPiece from "assets/icons/icon-room-artpiece.svg";
import IconAuditorium from "assets/icons/icon-room-auditorium.svg";
import IconConversation from "assets/icons/icon-room-conversation.svg";
import IconEmbeddable from "assets/icons/icon-room-embeddable.svg";
import IconExperience from "assets/icons/icon-room-experience.svg";
import IconMap from "assets/icons/icon-room-map.svg";
import IconMusicBar from "assets/icons/icon-room-musicbar.svg";
import IconPosterHall from "assets/icons/icon-room-posterhall.svg";
import IconScreening from "assets/icons/icon-room-screening.svg";

// NOTE: local, use one of SpaceInfoListItem or PortalInfoListItem
type InfoItem = {
  text: string;
  description: string;
  icon: string;
  hidden?: boolean;
  deprecated?: boolean;
};

export type SpaceInfoItem = InfoItem & {
  template?: VenueTemplate;
};

export type PortalInfoItem = InfoItem & {
  template?: PortalTemplate;
};

export const SPACE_INFO_MAP: Record<VenueTemplate, SpaceInfoItem> = {
  [VenueTemplate.posterhall]: {
    text: "Poster hall",
    description: "",
    icon: IconPosterHall,
    template: VenueTemplate.posterhall,
    hidden: true,
  },
  [VenueTemplate.posterpage]: {
    text: "Poster page",
    description: "",
    icon: IconPosterHall,
    template: VenueTemplate.posterpage,
    hidden: true,
  },
  [VenueTemplate.conversationspace]: {
    text: "Conversation Space",
    icon: IconConversation,
    description:
      "Host any number of small groups from 2-10 in video chats with each other.",
    template: VenueTemplate.conversationspace,
  },
  [VenueTemplate.auditorium]: {
    text: "Auditorium",
    icon: IconAuditorium,
    description:
      "Attendees sit in seats around your video content, and can react w/ emojis & shoutouts.",
    template: VenueTemplate.auditorium,
  },
  [VenueTemplate.jazzbar]: {
    text: "Music Bar",
    icon: IconMusicBar,
    description:
      "Host any number of small groups from 2-10 in video chats with each other around central content.",
    template: VenueTemplate.jazzbar,
  },
  [VenueTemplate.artpiece]: {
    text: "Art Piece",
    icon: IconArtPiece,
    description:
      "Small group video chatting around a central piece of content.",
    template: VenueTemplate.artpiece,
  },
  [VenueTemplate.zoomroom]: {
    text: "External Experience",
    icon: IconExperience,
    description:
      "Attendees will be directed off-platform, opening your content in a new tab.",
    template: VenueTemplate.zoomroom,
  },
  [VenueTemplate.partymap]: {
    text: "Map",
    icon: IconMap,
    description: "Create “mapception” - a map within a map!",
    template: VenueTemplate.partymap,
  },
  [VenueTemplate.animatemap]: {
    text: "Animated map",
    poster: "",
    description: "",
    icon: IconAnimateMap,
    template: VenueTemplate.animatemap,
    hidden: true,
  },
  [VenueTemplate.embeddable]: {
    text: "Embeddable",
    icon: IconEmbeddable,
    description:
      "Focus on a central piece of content without any video chatting.",
    template: VenueTemplate.embeddable,
  },
  [VenueTemplate.screeningroom]: {
    text: "Screening Room",
    icon: IconScreening,
    description: "",
    template: VenueTemplate.screeningroom,
  },
  [VenueTemplate.experiment]: {
    text: "Experimental space",
    icon: IconScreening,
    description: "",
    template: VenueTemplate.experiment,
  },
  [VenueTemplate.meetingroom]: {
    text: "Meeting room",
    icon: IconConversation,
    description: "",
    template: VenueTemplate.meetingroom,
  },
};

// NOTE: Generally the PORTAL_INFO_LIST should be used, this one is for cases where narrow definition of Space is needed
export const SPACE_INFO_LIST: SpaceInfoItem[] = [
  SPACE_INFO_MAP[VenueTemplate.conversationspace],
  SPACE_INFO_MAP[VenueTemplate.auditorium],
  SPACE_INFO_MAP[VenueTemplate.jazzbar],
  SPACE_INFO_MAP[VenueTemplate.artpiece],
  SPACE_INFO_MAP[VenueTemplate.zoomroom],
  SPACE_INFO_MAP[VenueTemplate.partymap],
  SPACE_INFO_MAP[VenueTemplate.embeddable],
  SPACE_INFO_MAP[VenueTemplate.screeningroom],
  SPACE_INFO_MAP[VenueTemplate.posterhall],
  SPACE_INFO_MAP[VenueTemplate.posterpage],
  SPACE_INFO_MAP[VenueTemplate.meetingroom],
];

export const PORTAL_INFO_ICON_MAPPING: Record<string, string> = Object.freeze(
  Object.fromEntries(
    SPACE_INFO_LIST.map(({ template, icon }) => [template, icon])
  )
);

export const DEFAULT_PORTAL_BOX: PortalBox = {
  width_percent: 5,
  height_percent: 5,
  x_percent: 50,
  y_percent: 50,
};
Object.freeze(DEFAULT_PORTAL_BOX);

export const DEFAULT_PORTAL_INPUT: PortalInput = {
  ...DEFAULT_PORTAL_BOX,
  title: "",
  about: "",
  isEnabled: true,
  image_url: "",
  url: "",
};
Object.freeze(DEFAULT_PORTAL_INPUT);
