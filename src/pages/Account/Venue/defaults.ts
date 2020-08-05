import { EntranceExperiencePreviewProvider } from "components/templates/EntranceExperienceProvider";
import { ExtractProps } from "types/utility";
import { VenueTemplate } from "types/VenueTemplate";

type Venue = ExtractProps<typeof EntranceExperiencePreviewProvider>["venue"];

export const venueDefaults: Venue = {
  template: VenueTemplate.jazzbar,
  name: "My Lovely Venue",
  config: {
    theme: {
      primaryColor: "yellow",
      backgroundColor: "red",
    },
    landingPageConfig: {
      coverImageUrl: "/default-profile-pic.png",
      subtitle: "A glorious venue",
      checkList: ["Listen to incredible music", "hang out with mates"],
      presentation: ["Listen to incredible music", "hang out with mates"],
      videoIframeUrl: "https://www.youtube.com/embed/aFfLdgmgLSg",
      joinButtonText: "Join my venue",
      quotations: [{ author: "Max ", text: "This venue rocks" }],
    },
  },
  host: {
    icon: "/logo512.png",
  },
  owners: [],
  profile_questions: [],
  code_of_conduct_questions: [],
};
