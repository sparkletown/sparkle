import { SelfServeScript } from "../../types";

import { AnalyticsOutput } from "./AnalyticsOutput";

export const AnalyticsScript: SelfServeScript = {
  name: "Analytics CSV",
  description: "Creates visit analytics based on the data supplied",
  functionLocation: "analytics-generateAnalytics",
  arguments: [
    {
      name: "venueIds",
      title:
        "Venue ids separated with a comma(,) Example: venue1,venue2,venue3",
      isRequired: true,
    },
  ],
  outputComponent: AnalyticsOutput,
};
