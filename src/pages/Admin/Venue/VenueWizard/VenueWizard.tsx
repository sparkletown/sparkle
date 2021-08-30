import React, { useReducer } from "react";

import { useVenueId } from "hooks/useVenueId";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import VenueWizardCreate from "./Create";
import VenueWizardEdit from "./Edit";
import { initialState, VenueWizardReducer } from "./redux";

const VenueWizard: React.FC = () => {
  const venueId = useVenueId();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  return (
    <AdminRestricted>
      {venueId ? (
        <VenueWizardEdit venueId={venueId} state={state} dispatch={dispatch} />
      ) : (
        <VenueWizardCreate state={state} dispatch={dispatch} />
      )}
    </AdminRestricted>
  );
};

export default VenueWizard;
