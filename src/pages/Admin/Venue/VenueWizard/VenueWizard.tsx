import React from "react";

// Components
import VenueWizardEdit from "./Edit";

// Hooks
import { useParams } from "react-router-dom";


const VenueWizard: React.FC = () => {
  const { venueId } = useParams<{ venueId?: string | undefined }>();

  if (venueId) return <VenueWizardEdit venueId={venueId} />;
  // if (venueId) return <h1>Edit</h1>

  return <h1>Create Venue</h1>;
};

export default VenueWizard;
