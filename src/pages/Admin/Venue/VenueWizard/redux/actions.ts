import * as ActionTypes from "./actionTypes";

import { Template } from "settings";
import { Venue } from "types/Venue";
import { WizardAction } from "./types";

export const submitTemplatePage = (
  dispatch: any,
  template: Template
): WizardAction =>
  dispatch({ type: ActionTypes.SUBMIT_TEMPLATE_PAGE, payload: template });

export const submitDetailsPage = (dispatch: any, venue: Venue): WizardAction =>
  dispatch({ type: ActionTypes.SUBMIT_DETAILS_PAGE, payload: venue });

export const setBannerURL = (dispatch: any, url: string) => dispatch({ type: ActionTypes.SET_BANNER_URL, payload: url })

export const setSquareLogoUrl = (dispatch: any, url: string) => dispatch({ type: ActionTypes.SET_SQUARE_LOGO_URL, payload: url })
