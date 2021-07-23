import { event, initialize, pageview } from "react-ga";
import { REACT_APP_GA_MEASUREMENT_ID } from "secrets";

export const initGoogleAnalytics = () => {
  if (REACT_APP_GA_MEASUREMENT_ID) {
    initialize(REACT_APP_GA_MEASUREMENT_ID);
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
  if (REACT_APP_GA_MEASUREMENT_ID) {
    event({
      category: eventCategory,
      action: eventAction,
      label: eventLabel,
    });
  }
};
