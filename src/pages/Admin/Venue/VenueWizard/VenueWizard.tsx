import React, { useReducer } from "react";

// Components
import VenueWizardEdit from "./Edit";
import VenueWizardCreate from "./Create";

// Hooks
import { useVenueId } from "hooks/useVenueId";

// Reducer
import { VenueWizardReducer, initialState } from "./redux";

const VenueWizard: React.FC = () => {
  const venueId = useVenueId();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  if (venueId)
    return (
      <VenueWizardEdit venueId={venueId} state={state} dispatch={dispatch} />
    );

  return <VenueWizardCreate state={state} dispatch={dispatch} />;
};

export default VenueWizard;
