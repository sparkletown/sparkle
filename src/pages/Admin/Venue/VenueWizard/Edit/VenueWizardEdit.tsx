import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import Details from "pages/Admin/Details";

import { VenueWizardEditProps } from "./VenueWizardEdit.types";

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({ venueId }) => {
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  return <Details venue={venue} />;
};

export default VenueWizardEdit;
