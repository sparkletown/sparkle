// eslint-disable-next-line no-restricted-imports
import mixpanel from "mixpanel-browser";

import { MIXPANEL_PROJECT_TOKEN } from "secrets";

export const initAnalytic = (opts?: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) {
    console.warn("Mixpanel is not set up correctly.");
    return;
  }

  return mixpanel.init(MIXPANEL_PROJECT_TOKEN, opts);
};

export const identifyAnalyticUser = (email: string, name = "N/A") => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  mixpanel.identify(email);
  mixpanel.people.set({ $email: email, $name: name });
};

export const trackAnalyticEvent = (eventName: string, data: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  return mixpanel.track(eventName, data);
};

export const setAnalyticGroup = (groupKey: string, groupIds: string[]) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  mixpanel.set_group(groupKey, groupIds);
  groupIds.forEach((id) => {
    mixpanel.get_group(groupKey, id).set({ $name: id });
  });
};
