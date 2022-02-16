import { SelfServeScript } from "../../types";

import { AnalyticsOutput } from "./AnalyticsOutput";

export const AnalyticsScript: SelfServeScript = {
  name: "Analytics CSV",
  description: "Creates visit analytics based on the data supplied",
  functionLocation: "analytics-generateAnalytics",
  arguments: [],
  outputComponent: AnalyticsOutput,
};
