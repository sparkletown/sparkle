import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { useFirestore } from "react-redux-firebase";
import { Redirect, useHistory } from "react-router-dom";

import {
  ALL_VENUE_TEMPLATES,
  DEFAULT_SPACE_SLUG,
  DEFAULT_WORLD_SLUG,
  Template,
} from "settings";

import { AnyVenue, SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { generateAttendeeInsideSpaceUrl } from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useQuery } from "hooks/useQuery";
import { useUser } from "hooks/useUser";

import { VenueDetailsForm } from "pages/Admin/Venue/VenueDetailsForm";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { TemplateForm } from "./TemplateForm";

import "./Venue.scss";

export interface WizardPage {
  next?: (action: WizardActions) => void;
  previous?: () => void;
  state: WizardFormState;
}

interface WizardFormState {
  templatePage?: {
    template: Template;
  };
  detailsPage?: {
    venue: AnyVenue;
  };
}

type WizardActions =
  | {
      type: "SUBMIT_TEMPLATE_PAGE";
      payload: Template;
    }
  | {
      type: "SUBMIT_DETAILS_PAGE";
      payload: AnyVenue;
    };

const initialState = {};

const reducer = (
  state: WizardFormState,
  action: WizardActions
): WizardFormState => {
  switch (action.type) {
    case "SUBMIT_TEMPLATE_PAGE":
      return { ...state, templatePage: { template: action.payload } };
    case "SUBMIT_DETAILS_PAGE":
      return { ...state, detailsPage: { venue: action.payload } };
    default:
      throw new Error();
  }
};

export const VenueWizard: React.FC = () => {
  const { worldSlug, spaceSlug } = useSpaceParams();

  return spaceSlug ? (
    <VenueWizardEdit worldSlug={worldSlug} spaceSlug={spaceSlug} />
  ) : (
    <VenueWizardCreate />
  );
};

interface VenueWizardEditProps {
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  worldSlug,
  spaceSlug,
}) => {
  // get the venue
  const firestore = useFirestore();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { space, spaceId } = useSpaceBySlug(worldSlug, spaceSlug);

  // @debt refactor this to use useAsync / useAsyncFn as appropriate
  useEffect(() => {
    if (!space) return;

    //find the template
    const template = ALL_VENUE_TEMPLATES.find(
      (template) => space.template === template.template
    );

    if (!template) return;

    // ensure reducer is synchronised with API data
    dispatch({ type: "SUBMIT_TEMPLATE_PAGE", payload: template });
    dispatch({ type: "SUBMIT_DETAILS_PAGE", payload: space });
  }, [firestore, space]);

  // @debt replace this with LoadingPage or Loading as appropriate
  if (!state.detailsPage) return <div>Loading...</div>;

  return <VenueDetailsForm venueId={spaceId} state={state} />;
};

const VenueWizardCreate: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();
  const queryParams = useQuery();

  const [state, dispatch] = useReducer(reducer, initialState);

  const parentIdQuery = queryParams.get("parentId");
  const hasParent = !!parentIdQuery;

  const queryPageString = queryParams.get("page");
  const queryPage = queryPageString ? parseInt(queryPageString) : 1;

  const next = useCallback(
    (action: WizardActions) => {
      dispatch(action);
      const path = `${history.location.pathname}?page=${queryPage + 1}`;

      history.push(hasParent ? `${path}&parentId=${parentIdQuery}` : path);
    },
    [hasParent, history, parentIdQuery, queryPage]
  );

  const previous = useCallback(() => {
    const path = `${history.location.pathname}?page=${queryPage - 1}`;

    history.push(hasParent ? `${path}&parentId=${parentIdQuery}` : path);
  }, [hasParent, history, parentIdQuery, queryPage]);

  const Page = useMemo(() => {
    switch (queryPage) {
      case 1:
        return <TemplateForm next={next} state={state} />;
      case 2:
        return <VenueDetailsForm previous={previous} state={state} />;
      default:
        return <TemplateForm next={next} state={state} />;
    }
  }, [queryPage, next, previous, state]);

  if (!user) {
    return (
      <Redirect
        to={generateAttendeeInsideSpaceUrl({
          worldSlug: DEFAULT_WORLD_SLUG,
          spaceSlug: DEFAULT_SPACE_SLUG,
        })}
      />
    );
  }

  return <WithNavigationBar>{Page}</WithNavigationBar>;
};
