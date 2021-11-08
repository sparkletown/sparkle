import React from "react";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import { VenueWizardCreateProps } from "./VenueWizardCreate.types";

const VenueWizardCreate: React.FC<VenueWizardCreateProps> = () => {
  return (
    <WithNavigationBar>
      <AdminRestricted>
        <SpaceEditorStartPanel />
      </AdminRestricted>
    </WithNavigationBar>
  );
};

export default VenueWizardCreate;
