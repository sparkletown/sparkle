import React, { useMemo, useCallback, useReducer } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import "./Venue.scss";
import { TemplateForm } from "./TemplateForm";
import { DetailsForm } from "./DetailsForm";
import { useHistory } from "react-router-dom";
import { useQuery } from "hooks/useQuery";
import { Template } from "settings";

export interface WizardPage {
  next?: (action: WizardActions) => void;
  previous?: () => void;
  state: WizardFormState;
}

interface WizardFormState {
  templatePage?: {
    template: Template;
  };
}
type WizardActions = {
  type: "SUBMIT_TEMPLATE_PAGE";
  payload: Template;
};

const initialState = {};

const reducer = (
  state: WizardFormState,
  action: WizardActions
): WizardFormState => {
  switch (action.type) {
    case "SUBMIT_TEMPLATE_PAGE":
      return { ...state, templatePage: { template: action.payload } };
    default:
      throw new Error();
  }
};

export const VenueWizard: React.FC = () => {
  const history = useHistory();
  const queryParams = useQuery();
  const [state, dispatch] = useReducer(reducer, initialState);

  const queryPageString = queryParams.get("page");
  const queryPage = queryPageString ? parseInt(queryPageString) : 1;

  const next = useCallback(
    (action: WizardActions) => {
      dispatch(action);
      history.push(`${history.location.pathname}?page=${queryPage + 1}`);
    },
    [history, queryPage]
  );
  const previous = useCallback(
    () => history.push(`${history.location.pathname}?page=${queryPage - 1}`),
    [history, queryPage]
  );

  const Page = useMemo(() => {
    switch (queryPage) {
      case 1:
        return <TemplateForm next={next} state={state} />;
      case 2:
        return <DetailsForm previous={previous} state={state} />;
      default:
        return <TemplateForm next={next} state={state} />;
    }
  }, [queryPage, next, previous, state]);

  return <WithNavigationBar fullscreen>{Page}</WithNavigationBar>;
};
