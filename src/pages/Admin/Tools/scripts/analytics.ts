import { SelfServeScript } from "../types";

export const AnalyticsScript: SelfServeScript = {
  name: "Analytics CSV",
  description: "Creates visit analytics based on the data supplied",
  functionLocation: "analytics-formCSV",
  arguments: [
    { name: "venueIds", title: "Venues with a , delimeter", isRequired: true },
  ],
};
