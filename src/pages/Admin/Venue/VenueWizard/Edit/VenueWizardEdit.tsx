import React from "react";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

export interface VenueWizardEditProps {
  spaceSlug: string;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({ spaceSlug }) => {
  const { space } = useSpaceBySlug(spaceSlug);

  return <SpaceEditorStartPanel venue={space} />;
};

export default VenueWizardEdit;
