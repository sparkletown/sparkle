import {
  SetBannerUrl,
  SetSquareLogoUrl,
  WizardAction,
  WizardState,
  SetFormValues,
} from "./types";

import * as ActionTypes from "./actionTypes";

export const initialState = {
  bannerImageUrl: "",
  logoImageUrl: "",
  name: "",
  subtitle: "",
  description: "",
  showGrid: false,
  columns: 1,
} as WizardState;

const setBannerURL = (state: WizardState, action: SetBannerUrl) => ({
  ...state,
  bannerImageUrl: action.payload,
});

const setSquareLogoURL = (state: WizardState, action: SetSquareLogoUrl) => ({
  ...state,
  logoImageUrl: action.payload,
});

const updateFormValues = (state: WizardState, action: SetFormValues) => ({
  ...state,
  ...action.payload,
});

export const VenueWizardReducer = (
  state: WizardState,
  action: WizardAction
) => {
  switch (action.type) {
    case ActionTypes.SET_BANNER_URL:
      return setBannerURL(state, action);
    case ActionTypes.SET_SQUARE_LOGO_URL:
      return setSquareLogoURL(state, action);
    case ActionTypes.SET_FORM_VALUES:
      return updateFormValues(state, action);

    default:
      return initialState;
  }
};
