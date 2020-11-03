import React, { useReducer } from "react";

// Components
import VenueWizardEdit from "./Edit";
import VenueWizardCreate from "./Create";

// Hooks
import { useParams } from "react-router-dom";

// Reducer
import { VenueWizardReducer, initialState } from "./redux";

const VenueWizard: React.FC = () => {
  const { venueId } = useParams<{ venueId?: string | undefined }>();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  if (venueId)
    return (
      <VenueWizardEdit venueId={venueId} state={state} dispatch={dispatch} />
    );

  return <VenueWizardCreate state={state} dispatch={dispatch} />;
};

export default VenueWizard;
