import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { useUser } from "hooks/useUser";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import { VenueWizardCreateProps } from "./VenueWizardCreate.types";

const VenueWizardCreate: React.FC<VenueWizardCreateProps> = ({
  state,
  dispatch,
}) => {
  const history = useHistory();
  const { user } = useUser();

  const previous = useCallback(
    () => history.push(`${history.location.pathname}`),
    [history]
  );

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
      <SpaceEditorStartPanel
        previous={previous}
        dispatch={dispatch}
        data={state}
      />
    </AdminRestricted>
  );
};

export default VenueWizardCreate;
