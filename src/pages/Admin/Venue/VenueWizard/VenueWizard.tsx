import React, { useReducer } from "react";

import { useWorldEditParams } from "hooks/useWorldEditParams";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import VenueWizardCreate from "./Create";
import VenueWizardEdit from "./Edit";
import { initialState, VenueWizardReducer } from "./redux";

const VenueWizard: React.FC = () => {
  const { worldId } = useWorldEditParams();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  return (
    <AdminRestricted>
      {worldId ? (
        <VenueWizardEdit worldId={worldId} state={state} dispatch={dispatch} />
      ) : (
        <VenueWizardCreate state={state} dispatch={dispatch} />
      )}
    </AdminRestricted>
  );
};

export default VenueWizard;
