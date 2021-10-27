import React from "react";

import { useUser } from "hooks/useUser";

import Details from "pages/Admin/Details";

import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import { VenueWizardCreateProps } from "./VenueWizardCreate.types";

const VenueWizardCreate: React.FC<VenueWizardCreateProps> = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <WithNavigationBar>
        <AuthenticationModal
          show={true}
          onHide={() => {}}
          showAuth={AuthOptions.login}
        />
      </WithNavigationBar>
    );
  }

  return (
    <AdminRestricted>
      <Details />
    </AdminRestricted>
  );
};

export default VenueWizardCreate;
