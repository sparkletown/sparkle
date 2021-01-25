import { Venue, urlFromImage } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
import { FormValues } from "pages/Admin/Venue/DetailsForm";

export interface JazzbarVenue extends Venue {
  template: VenueTemplate.jazzbar;
  iframeUrl: string;
  logoImageUrl: string;
  host: {
    icon: string;
  };
}

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
    height: values.height ?? 40,
  };
};
