import { VenueTemplate } from "./VenueTemplate";
import { Quotation } from "./Quotation";

interface Question {
  name: string;
  text: string;
  link?: string;
}

export interface Venue {
  id?: string;
  template: VenueTemplate;
  name: string;
  config: {
    theme: {
      primaryColor: string;
      backgroundColor?: string;
    };
    landingPageConfig: {
      coverImageUrl: string;
      subtitle: string;
      presentation: string[];
      checkList: string[];
      videoIframeUrl: string;
      joinButtonText: string;
      quotations?: Quotation[];
    };
    memberEmails?: string[];
  };
  host: {
    icon: string;
  };
  profile_questions: Question[];
  code_of_conduct_questions: Question[];
  iframeUrl?: string; //@debt typing is this optional
}
