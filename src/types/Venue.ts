import { VenueTemplate } from "./VenueTemplate";
import { Quotation } from "./Quotation";

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
  };
  host: {
    icon: string;
  };
}
