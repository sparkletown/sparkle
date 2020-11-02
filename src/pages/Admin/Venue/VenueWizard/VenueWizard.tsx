import React from "react";

// Components
import VenueWizardEdit from "./Edit";

// Hooks
import { useParams } from "react-router-dom";
import VenueWizardCreate from "./Create/VenueWizardCreate";


const VenueWizard: React.FC = () => {
  const { venueId } = useParams<{ venueId?: string | undefined }>();

  if (venueId) return <VenueWizardEdit venueId={venueId} />;
  // if (venueId) return <h1>Edit</h1>

  // return <h1>Create Venue</h1>;
  return <VenueWizardCreate />
};

export default VenueWizard;
