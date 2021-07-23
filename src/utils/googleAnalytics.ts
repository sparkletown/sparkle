import firebase from "firebase/app";

import { MEASUREMENT_ID } from "secrets";

// @debt properly type the props, not just string
type GAEvent = {
  eventName: string;
  // eventCategory: string;
  eventAction: Object;
};

export const logEventGoogleAnalytics = ({
  eventName,
  eventAction,
}: GAEvent) => {
  if (MEASUREMENT_ID) {
    firebase.analytics().logEvent(eventName, eventAction);
  }
};
