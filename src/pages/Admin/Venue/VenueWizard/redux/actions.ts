import { SUBMIT_DETAILS_PAGE, SUBMIT_TEMPLATE_PAGE } from "./actionTypes";

import { Template } from "settings";
import { Venue } from "types/Venue";
import { WizardAction } from "./types";

export const submitTemplatePage = (
  dispatch: any,
  template: Template
): WizardAction => {
  console.log('Dispatch Template: ', template);
  return dispatch({ type: SUBMIT_TEMPLATE_PAGE, payload: template })};

export const submitDetailsPage = (dispatch: any, venue: Venue): WizardAction =>
  dispatch({ type: SUBMIT_DETAILS_PAGE, payload: venue });
