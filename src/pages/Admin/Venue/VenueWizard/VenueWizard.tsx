import React, { useReducer } from "react";

import { useSpaceParams } from "hooks/useSpaceParams";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import VenueWizardCreate from "./Create";
import VenueWizardEdit from "./Edit";
import { initialState, VenueWizardReducer } from "./redux";

const VenueWizard: React.FC = () => {
  const spaceSlug = useSpaceParams();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  return (
    <AdminRestricted>
      {spaceSlug ? (
        <VenueWizardEdit spaceSlug={spaceSlug} />
      ) : (
        <VenueWizardCreate state={state} dispatch={dispatch} />
      )}
    </AdminRestricted>
  );
};

export default VenueWizard;
