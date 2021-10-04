// eslint-disable-next-line no-restricted-imports
import mixpanel from "mixpanel-browser";

import { MIXPANEL_PROJECT_TOKEN } from "secrets";

export const initMixpanel = (opts?: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) {
    console.warn("Mixpanel is not set up correctly.");
    return;
  }

  return mixpanel.init(MIXPANEL_PROJECT_TOKEN, opts);
};

export const identifyMixpanelUser = (name: string, email: string) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  mixpanel.identify(email);
  mixpanel.people.set({ $name: name, $email: email });
};

export const trackMixpanelEvent = (eventName: string, data: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  return mixpanel.track(eventName, data);
};
