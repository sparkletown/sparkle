import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

export interface VenueWizardEditProps {
  venueId: string;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({ venueId }) => {
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  return <SpaceEditorStartPanel venue={venue} />;
};

export default VenueWizardEdit;
