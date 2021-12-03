import { PortalBox, PortalInput } from "types/rooms";
import { PortalTemplate, VenueTemplate } from "types/venues";

import IconArtPiece from "assets/icons/icon-room-artpiece.svg";
import IconAuditorium from "assets/icons/icon-room-auditorium.svg";
import IconBurnBarrel from "assets/icons/icon-room-burnbarrel.svg";
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
import PosterEmbeddable from "assets/spaces/add-portal-embeddable.png";
import PosterExperience from "assets/spaces/add-portal-experience.png";
import PosterExternal from "assets/spaces/add-portal-external.png";
import PosterMusicBar from "assets/spaces/add-portal-jazzbar.png";
import PosterMap from "assets/spaces/add-portal-map.png";

// NOTE: local, use one of SpaceInfoListItem or PortalInfoListItem
type ListItem = {
  text: string;
  poster: string;
  description: string;
  icon: string;
  hidden?: boolean;
};

export type SpaceInfoListItem = ListItem & {
  template?: VenueTemplate;
};

export type PortalInfoListItem = ListItem & {
  template?: PortalTemplate;
};

// NOTE: Generally the PORTAL_INFO_LIST should be used, this one is for cases where narrow definition of Space is needed
export const SPACE_INFO_LIST: SpaceInfoListItem[] = [
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
    text: "Burn Firebarrel",
    icon: IconBurnBarrel,
    template: VenueTemplate.firebarrel,
    poster: "",
    description: "",
    hidden: true,
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
    poster: PosterEmbeddable,
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
];

export const PORTAL_INFO_LIST: PortalInfoListItem[] = [
  ...SPACE_INFO_LIST,
  {
    text: "External link",
    icon: IconExternalLink,
    poster: PosterExternal,
    description:
      "New Space will not be created and the Space name will be used as the title for the newly added External Link portal",
    template: "external",
    hidden: true,
  },
];

export const PORTAL_INFO_ICON_MAPPING: Record<string, string> = Object.freeze(
  Object.fromEntries(
    PORTAL_INFO_LIST.map(({ template, icon }) => [template, icon])
  )
);

export const DEFAULT_PORTAL_BOX: PortalBox = {
  width_percent: 5,
  height_percent: 5,
  x_percent: 50,
  y_percent: 50,
};

export const DEFAULT_PORTAL_INPUT: PortalInput = {
  ...DEFAULT_PORTAL_BOX,
  title: "",
  about: "",
  isEnabled: true,
  image_url: "",
  url: "",
};
