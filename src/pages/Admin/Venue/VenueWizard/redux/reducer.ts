import {
  SubmitDetailsPage,
  SubmitTemplatePage,
  SetBannerUrl,
  SetSquareLogoUrl,
  WizardAction,
  WizardState,
} from "./types";

import * as ActionTypes from "./actionTypes";

export const initialState = {
  templatePage: null,
  detailsPage: null,
  bannerURL: "",
  squareLogoURL: "",
  formValues: {},
} as WizardState;

const submitTemplatePage = (state: WizardState, action: SubmitTemplatePage) => {
  return {
    ...state,
    templatePage: {
      template: action.payload,
    },
  };
};

const submitDetailsPage = (state: WizardState, action: SubmitDetailsPage) => ({
  ...state,
  detailsPage: {
    venue: action.payload,
  },
});

const setBannerURL = (state: WizardState, action: SetBannerUrl) => ({
  ...state,
  bannerURL: action.payload,
});

const setSquareLogoURL = (state: WizardState, action: SetSquareLogoUrl) => ({
  ...state,
  squareLogoURL: action.payload,
});

const updateFormValues = (state: WizardState, action: any) => ({
  ...state,
  formValues: action.payload,
});

export const VenueWizardReducer = (
  state: WizardState,
  action: WizardAction
) => {
  switch (action.type) {
    case ActionTypes.SUBMIT_TEMPLATE_PAGE:
      return submitTemplatePage(state, action);
    case ActionTypes.SUBMIT_DETAILS_PAGE:
      return submitDetailsPage(state, action);
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
