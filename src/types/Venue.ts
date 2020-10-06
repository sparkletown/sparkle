import { Quotation } from "./Quotation";
import { UpcomingEvent } from "./UpcomingEvent";
import { VenueTemplate } from "./VenueTemplate";
import { FormValues } from "pages/Admin/Venue/DetailsForm";
import { AvatarGridRoom } from "./AvatarGrid";
import { EntranceStepConfig } from "./EntranceStep";

interface Question {
  name: string;
  text: string;
  link?: string;
}

export interface Venue {
  parentId?: string;
  template: VenueTemplate;
  name: string;
  entrance?: EntranceStepConfig[];
  config?: {
    theme: {
      primaryColor: string;
      backgroundColor?: string;
    };
    landingPageConfig: {
      coverImageUrl: string;
      subtitle: string;
      description?: string;
      presentation: string[];
      bannerImageUrl?: string;
      checkList: string[];
      videoIframeUrl?: string;
      embedIframeUrl?: string;
      joinButtonText?: string;
      quotations?: Quotation[];
    };
    memberEmails?: string[];
  };
  host: {
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
  embedIframeUrl?: string;
  mapBackgroundImageUrl?: string;
  placementRequests?: string;
  radioStations?: string[];
  radioTitle?: string;
  dustStorm?: boolean;
  activity?: any;
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
    profile_questions: values.profileQuestions ?? [],
    code_of_conduct_questions: [],
    adultContent: values.adultContent || false,
  };
};
