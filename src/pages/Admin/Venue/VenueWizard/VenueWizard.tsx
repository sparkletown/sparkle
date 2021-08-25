import React, { useReducer } from "react";

import { useVenueId } from "hooks/useVenueId";

import VenueWizardCreate from "./Create";
// Components
import VenueWizardEdit from "./Edit";
// Reducer
import { initialState, VenueWizardReducer } from "./redux";

const VenueWizard: React.FC = () => {
  const venueId = useVenueId();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  return venueId ? (
    <VenueWizardEdit venueId={venueId} state={state} dispatch={dispatch} />
  ) : (
    <VenueWizardCreate state={state} dispatch={dispatch} />
  );
};

export default VenueWizard;
