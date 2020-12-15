import { FormValues } from "pages/Admin/Venue/DetailsForm";

import { AvatarGridRoom } from "./AvatarGrid";
import { CampRoomData } from "./CampRoomData";
import { EntranceStepConfig } from "./EntranceStep";
import { Quotation } from "./Quotation";
import { RoomData } from "./RoomData";
import { Table } from "./Table";
import { UpcomingEvent } from "./UpcomingEvent";
import { VenueAccessType } from "./VenueAcccess";
import { VenueTemplate } from "./VenueTemplate";
import { VideoAspectRatio } from "./VideoAspectRatio";

export interface Question {
  name: string;
  text: string;
  link?: string;
}

interface TermOfService {
  name: string;
  text: string;
  link?: string;
}

export enum RoomVisibility {
  hover = "hover",
  count = "count",
  nameCount = "count/name",
}

export type AnyRoom = RoomData | CampRoomData | AvatarGridRoom;

// @debt refactor this into separated logical chunks? (eg. if certain params are only expected to be set for certain venue types)
export interface Venue {
  parentId?: string;
  template: VenueTemplate;
  name: string;
  access?: VenueAccessType[];
  entrance?: EntranceStepConfig[];
  config?: VenueConfig;
  host?: {
    icon: string;
  };
  profile_questions: Question[];
  code_of_conduct_questions: Question[];
  owners?: string[];
  iframeUrl?: string;
  events?: Array<UpcomingEvent>; //@debt typing is this optional? I have a feeling this no longer exists @chris confirm
  mapIconImageUrl?: string;
  placement?: VenuePlacement;
  zoomUrl?: string;
  mapBackgroundImageUrl?: string;
  placementRequests?: string;
  radioStations?: string[];
  radioTitle?: string;
  dustStorm?: boolean;
  activity?: string;
  bannerMessage?: string;
  playaIcon?: PlayaIcon;
  playaIcon2?: PlayaIcon;
  miniAvatars?: boolean;
  adultContent?: boolean;
  showAddress?: boolean;
  showGiftATicket?: boolean;
  columns?: number;
  rows?: number;
  nightCycle?: boolean;
  spaces?: AvatarGridRoom[];
  hasPaidEvents?: boolean;
  profileAvatars?: boolean;
  hideVideo?: boolean;
  showLiveSchedule?: boolean;
  showGrid?: boolean;
  roomVisibility?: RoomVisibility;
  rooms?: AnyRoom[];
  width: number;
  height: number;
  description?: {
    text: string;
  };
  showLearnMoreLink?: boolean;
  liveScheduleOtherVenues?: string[];
  start_utc_seconds?: number;
  attendeesTitle?: string;
  requiresDateOfBirth?: boolean;
  ticketUrl?: string;
  showRangers?: boolean;
  chatTitle?: string;
  showReactions?: boolean;
  auditoriumColumns?: number;
  auditoriumRows?: number;
  videoAspect?: VideoAspectRatio;
  termsAndConditions: TermOfService[];
  showRadio?: boolean;
  showBadges?: boolean;
  showZendesk?: boolean;
}

export interface VenueConfig {
  theme: {
    primaryColor: string;
    backgroundColor?: string;
  };

  landingPageConfig: VenueLandingPageConfig; // @debt should this be potentially undefined, or is it guaranteed to exist everywhere?
  redirectUrl?: string;
  memberEmails?: string[];
  showRangers?: boolean;
  tables?: Table[];
}

export interface VenueLandingPageConfig {
  coverImageUrl: string;
  subtitle: string;
  description?: string;
  presentation: string[];
  bannerImageUrl?: string;
  checkList: string[];
  iframeUrl?: string;
  joinButtonText?: string;
  quotations?: Quotation[];
}

export interface VenuePlacement {
  x: number;
  y: number;
  addressText?: string;
  state?: VenuePlacementState;
}

export enum VenuePlacementState {
  SelfPlaced = "SELF_PLACED",
  AdminPlaced = "ADMIN_PLACED",
  Hidden = "HIDDEN",
}

export interface PlayaIcon {
  x: number;
  y: number;
  fire: boolean;
  visible: boolean;
  className: string;
  clickable: boolean;
  venueId: string;
}

export const urlFromImage = (
  defaultValue: string,
  filesOrUrl?: FileList | string
) => {
  if (typeof filesOrUrl === "string") return filesOrUrl;
  return filesOrUrl && filesOrUrl.length > 0
    ? URL.createObjectURL(filesOrUrl[0])
    : defaultValue;
};

export const createJazzbar = (values: FormValues): Venue => {
  return {
    template: VenueTemplate.jazzbar,
    name: values.name || "Your Jazz Bar",
    mapIconImageUrl: urlFromImage(
      "/default-profile-pic.png",
      values.mapIconImageFile
    ),
    config: {
      theme: {
        primaryColor: "yellow",
        backgroundColor: "red",
      },
      landingPageConfig: {
        coverImageUrl: urlFromImage(
          "/default-profile-pic.png",
          values.bannerImageFile
        ),
        subtitle: values.subtitle || "Subtitle for your venue",
        description: values.description || "Description of your venue",
        presentation: [],
        checkList: [],
        quotations: [],
      },
    },
    host: {
      icon: urlFromImage("/default-profile-pic.png", values.logoImageFile),
    },
    owners: [],
    profile_questions: values.profile_questions ?? [],
    code_of_conduct_questions: [],
    termsAndConditions: [],
    adultContent: values.adultContent || false,
    width: values.width ?? 40,
    height: values.width ?? 40,
  };
};
