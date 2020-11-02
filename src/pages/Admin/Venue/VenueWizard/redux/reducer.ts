import {
  SubmitDetailsPage,
  SubmitTemplatePage,
  WizardAction,
  WizardState,
} from "./types";

import { SUBMIT_DETAILS_PAGE, SUBMIT_TEMPLATE_PAGE } from "./actionTypes";

export const initialState = {
  templatePage: null,
  detailsPage: null,
} as WizardState;

const submitTemplatePage = (state: WizardState, action: SubmitTemplatePage) => {
  console.log('Action: ', action)
  return {
  ...state,
  templatePage: {
    template: action.payload,
  },
}};

const submitDetailsPage = (state: WizardState, action: SubmitDetailsPage) => ({
  ...state,
  detailsPage: {
    venue: action.payload,
  },
});

export const VenueWizardReducer = (
  state: WizardState,
  action: WizardAction
) => {
  switch (action.type) {
    case SUBMIT_TEMPLATE_PAGE:
      return submitTemplatePage(state, action);
    case SUBMIT_DETAILS_PAGE:
      return submitDetailsPage(state, action);

    default:
      return state;
  }
};
