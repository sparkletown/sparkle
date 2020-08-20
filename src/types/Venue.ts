import { Quotation } from "./Quotation";
import { UpcomingEvent } from "./UpcomingEvent";
import { VenueTemplate } from "./VenueTemplate";
import { FormValues } from "pages/Admin/Venue/DetailsForm";

interface Question {
  name: string;
  text: string;
  link?: string;
}

export interface Venue {
  parentId?: string;
  template: VenueTemplate;
  name: string;
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
  };
};
