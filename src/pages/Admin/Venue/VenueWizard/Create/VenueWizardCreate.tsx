import React, { useReducer } from "react";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import { initialState, VenueWizardReducer } from "../redux";

import { VenueWizardCreateProps } from "./VenueWizardCreate.types";

const VenueWizardCreate: React.FC<VenueWizardCreateProps> = () => {
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

  return (
    <WithNavigationBar>
      <AdminRestricted>
        <SpaceEditorStartPanel state={state} dispatch={dispatch} />
      </AdminRestricted>
    </WithNavigationBar>
  );
};

export default VenueWizardCreate;
