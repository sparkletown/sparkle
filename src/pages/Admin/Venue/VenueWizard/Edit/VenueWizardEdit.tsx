import React from "react";

import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

export interface VenueWizardEditProps {
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  worldSlug,
  spaceSlug,
}) => {
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  return <SpaceEditorStartPanel venue={space} />;
};

export default VenueWizardEdit;
