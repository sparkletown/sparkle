import { MEASUREMENT_ID } from "env";
import firebase from "firebase/compat/app";

// @debt properly type the props, not just string
type GAEvent = {
  eventName: string;
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
