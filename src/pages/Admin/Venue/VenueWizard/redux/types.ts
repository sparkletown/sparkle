import { Template } from "settings";
import { Venue } from "types/Venue";

// Action Types
import { SUBMIT_TEMPLATE_PAGE, SUBMIT_DETAILS_PAGE } from "./actionTypes";

export interface WizardState {
  templatePage: {
    template?: Template;
  } | null;

  detailsPage: {
    venue?: Venue;
  } | null;
}

export interface SubmitTemplatePage {
  type: typeof SUBMIT_TEMPLATE_PAGE;
  payload: Template;
}

export interface SubmitDetailsPage {
  type: typeof SUBMIT_DETAILS_PAGE;
  payload: Venue;
}

export type WizardAction =
| { type: typeof SUBMIT_TEMPLATE_PAGE, payload: Template }
| { type: typeof SUBMIT_DETAILS_PAGE, payload: Venue }

export interface WizardReducer {
  state: WizardState;
  action: WizardAction;
}
