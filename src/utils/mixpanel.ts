import { MIXPANEL_PROJECT_TOKEN } from "secrets";

export const initMixpanel = (opts?: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  return window.mixpanel.init(MIXPANEL_PROJECT_TOKEN, opts);
};

export const identifyMixpanelEmail = (email: string) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  return window.mixpanel.identify(email);
};

export const trackVenueEntrance = (eventName: string, data: Object) => {
  if (!MIXPANEL_PROJECT_TOKEN) return;

  return window.mixpanel.track(eventName, data);
};
