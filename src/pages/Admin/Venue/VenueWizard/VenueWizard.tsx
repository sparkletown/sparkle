import React, { useReducer } from "react";

// Components
import VenueWizardEdit from "./Edit";
import VenueWizardCreate from "./Create";

// Reducer
import { VenueWizardReducer, initialState } from "./redux";
import { useVenueId } from "hooks/useVenueId";

export interface VenueWizardProps {
  onSave?: () => void;
}

const VenueWizard: React.FC<VenueWizardProps> = ({ onSave }) => {
  const venueId = useVenueId();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  if (venueId)
    return (
      <VenueWizardEdit venueId={venueId} state={state} dispatch={dispatch} />
    );

  return (
    <VenueWizardCreate state={state} dispatch={dispatch} onSave={onSave} />
  );
};

export default VenueWizard;
