import React from "react";

import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

export interface VenueWizardEditProps {
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  worldSlug,
  spaceSlug,
}) => {
  const { space } = useSpaceBySlug(worldSlug, spaceSlug);

  return <SpaceEditorStartPanel venue={space} />;
};

export default VenueWizardEdit;
