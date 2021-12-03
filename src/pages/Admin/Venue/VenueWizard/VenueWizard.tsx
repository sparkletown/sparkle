import React, { useReducer } from "react";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import VenueWizardCreate from "./Create";
import VenueWizardEdit from "./Edit";
import { initialState, VenueWizardReducer } from "./redux";

const VenueWizard: React.FC = () => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  return (
    <AdminRestricted>
      {spaceSlug ? (
        <VenueWizardEdit worldSlug={worldSlug} spaceSlug={spaceSlug} />
      ) : (
        <VenueWizardCreate state={state} dispatch={dispatch} />
      )}
    </AdminRestricted>
  );
};

export default VenueWizard;
