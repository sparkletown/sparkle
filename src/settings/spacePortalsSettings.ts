import { PortalBox, PortalInput } from "types/rooms";
import { PortalTemplate, VenueTemplate } from "types/venues";

import IconAnimateMap from "assets/icons/icon-room-animatemap.svg";
import IconArtPiece from "assets/icons/icon-room-artpiece.svg";
import IconAuditorium from "assets/icons/icon-room-auditorium.svg";
import IconBurnBarrel from "assets/icons/icon-room-burnbarrel.svg";
import IconConversation from "assets/icons/icon-room-conversation.svg";
import IconEmbeddable from "assets/icons/icon-room-embeddable.svg";
import IconExperience from "assets/icons/icon-room-experience.svg";
import IconExternalLink from "assets/icons/icon-room-externallink.svg";
import IconMap from "assets/icons/icon-room-map.svg";
import IconMusicBar from "assets/icons/icon-room-musicbar.svg";
import IconPosterHall from "assets/icons/icon-room-posterhall.svg";
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
type InfoItem = {
  text: string;
  poster: string;
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

const LEGACY_SPACE_INFO_ITEM: SpaceInfoItem = {
  text: "Legacy space",
  poster: "",
  description: "This space is no longer in use",
  icon: "",
  deprecated: true,
};
Object.freeze(LEGACY_SPACE_INFO_ITEM);

export const SPACE_INFO_MAP: Record<VenueTemplate, SpaceInfoItem> = {
  [VenueTemplate.friendship]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.themecamp]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.audience]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.artcar]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.performancevenue]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.avatargrid]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.playa]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.preplaya]: LEGACY_SPACE_INFO_ITEM,
  [VenueTemplate.posterhall]: {
    text: "Poster hall",
    poster: "",
    description: "",
    icon: IconPosterHall,
    template: VenueTemplate.posterhall,
    hidden: true,
  },
  [VenueTemplate.posterpage]: {
    text: "Poster page",
    poster: "",
    description: "",
    icon: IconPosterHall,
    template: VenueTemplate.posterpage,
    hidden: true,
  },
  [VenueTemplate.animatemap]: {
    text: "Animated map",
    poster: "",
    description: "",
    icon: IconAnimateMap,
    template: VenueTemplate.animatemap,
    hidden: true,
  },
  [VenueTemplate.conversationspace]: {
    text: "Conversation Space",
    icon: IconConversation,
    poster: PosterConversation,
    description:
      "Host any number of small groups from 2-10 in video chats with each other.",
    template: VenueTemplate.conversationspace,
  },
  [VenueTemplate.auditorium]: {
    text: "Auditorium",
    icon: IconAuditorium,
    poster: PosterAuditorium,
    description:
      "Attendees sit in seats around your video content, and can react w/ emojis & shoutouts.",
    template: VenueTemplate.auditorium,
  },
  [VenueTemplate.jazzbar]: {
    text: "Music Bar",
    icon: IconMusicBar,
    poster: PosterMusicBar,
    description:
      "Host any number of small groups from 2-10 in video chats with each other around central content.",
    template: VenueTemplate.jazzbar,
  },
  [VenueTemplate.firebarrel]: {
    text: "Burn Firebarrel",
    icon: IconBurnBarrel,
    template: VenueTemplate.firebarrel,
    poster: "",
    description: "",
    hidden: true,
  },
  [VenueTemplate.artpiece]: {
    text: "Art Piece",
    icon: IconArtPiece,
    poster: PosterArtPiece,
    description:
      "Small group video chatting around a central piece of content.",
    template: VenueTemplate.artpiece,
  },
  [VenueTemplate.zoomroom]: {
    text: "External Experience",
    icon: IconExperience,
    poster: PosterExperience,
    description:
      "Attendees will be directed off-platform, opening your content in a new tab.",
    template: VenueTemplate.zoomroom,
  },
  [VenueTemplate.partymap]: {
    text: "Map",
    icon: IconMap,
    poster: PosterMap,
    description: "Create “mapception” - a map within a map!",
    template: VenueTemplate.partymap,
  },
  [VenueTemplate.viewingwindow]: {
    text: "Viewing Window",
    icon: IconViewingWindow,
    poster: PosterArtPiece,
    description:
      "Focus on a central piece of content without any video chatting.",
    template: VenueTemplate.viewingwindow,
    hidden: true,
  },
  [VenueTemplate.embeddable]: {
    text: "Embeddable",
    icon: IconEmbeddable,
    poster: PosterEmbeddable,
    description: "",
    template: VenueTemplate.embeddable,
  },
  [VenueTemplate.screeningroom]: {
    text: "Screening Room",
    icon: IconScreening,
    poster: "",
    description: "",
    template: VenueTemplate.screeningroom,
  },
};

// NOTE: Generally the PORTAL_INFO_LIST should be used, this one is for cases where narrow definition of Space is needed
export const SPACE_INFO_LIST: SpaceInfoItem[] = [
  SPACE_INFO_MAP[VenueTemplate.conversationspace],
  SPACE_INFO_MAP[VenueTemplate.auditorium],
  SPACE_INFO_MAP[VenueTemplate.jazzbar],
  SPACE_INFO_MAP[VenueTemplate.firebarrel],
  SPACE_INFO_MAP[VenueTemplate.artpiece],
  SPACE_INFO_MAP[VenueTemplate.zoomroom],
  SPACE_INFO_MAP[VenueTemplate.partymap],
  SPACE_INFO_MAP[VenueTemplate.viewingwindow],
  SPACE_INFO_MAP[VenueTemplate.embeddable],
  SPACE_INFO_MAP[VenueTemplate.screeningroom],
  SPACE_INFO_MAP[VenueTemplate.posterhall],
  SPACE_INFO_MAP[VenueTemplate.posterpage],
  SPACE_INFO_MAP[VenueTemplate.animatemap],
];

export const PORTAL_INFO_LIST: PortalInfoItem[] = [
  ...SPACE_INFO_LIST,
  // @debt external templates need to be implemented properly again
  // enabled to fix broken icon as per https://github.com/sparkletown/internal-sparkle-issues/issues/1576
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
