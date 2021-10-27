import React from "react";
import { Dispatch } from "redux";

import { useCurrentSpace } from "hooks/useCurrentSpace";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import { Loading } from "components/molecules/Loading";

import { WizardAction, WizardState } from "../redux";

export interface VenueWizardEditProps {
  venueId: string;
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  venueId,
  state,
  dispatch,
}) => {
  const { space, isLoaded: isSpaceLoaded } = useCurrentSpace({
    spaceId: venueId,
  });

  if (!isSpaceLoaded) return <Loading />;

  return <SpaceEditorStartPanel venue={space} dispatch={dispatch} state={state} />;
};

export default VenueWizardEdit;
