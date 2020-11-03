import { Template } from "settings";
import { Venue } from "types/Venue";

// Action Types
import * as ActionTypes from "./actionTypes";

export type FormValues = {
  name?: string;
  subtitle?: string;
  description?: string;
}

export interface WizardState {
  templatePage: {
    template?: Template;
  } | null;

  detailsPage: {
    venue?: Venue;
  } | null;

  bannerURL?: string;
  squareLogoURL?: string;
  formValues?: FormValues;
}

export interface SubmitTemplatePage {
  type: typeof ActionTypes.SUBMIT_TEMPLATE_PAGE;
  payload: Template;
}

export interface SubmitDetailsPage {
  type: typeof ActionTypes.SUBMIT_DETAILS_PAGE;
  payload: Venue;
}

export interface SetBannerUrl {
  type: typeof ActionTypes.SET_BANNER_URL;
  payload: string
}

export interface SetSquareLogoUrl {
  type: typeof ActionTypes.SET_SQUARE_LOGO_URL;
  payload: string;
}

export interface SetFormValues {
  type: typeof ActionTypes.SET_FORM_VALUES;
  payload: FormValues;
}

export type WizardAction =
| SubmitTemplatePage
| SubmitDetailsPage
| SetBannerUrl
| SetSquareLogoUrl
| SetFormValues;


export interface WizardReducer {
  state: WizardState;
  action: WizardAction;
}
