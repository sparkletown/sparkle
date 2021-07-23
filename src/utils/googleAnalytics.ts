import { event, initialize, pageview } from "react-ga";
import { MEASUREMENT_ID } from "secrets";

export const initGoogleAnalytics = () => {
  if (MEASUREMENT_ID) {
    initialize(MEASUREMENT_ID);
    pageview(window.location.pathname + window.location.search);
  }
};
// @debt properly type the props, not just string
type GAEvent = {
  eventCategory: string;
  eventAction: string;
  eventLabel: string;
};

export const logEventGoogleAnalytics = ({
  eventCategory,
  eventAction,
  eventLabel,
}: GAEvent) => {
  if (MEASUREMENT_ID) {
    event({
      category: eventCategory,
      action: eventAction,
      label: eventLabel,
    });
  }
};
