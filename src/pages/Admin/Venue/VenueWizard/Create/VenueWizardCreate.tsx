import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { useUser } from "hooks/useUser";

import Details from "pages/Admin/Details";

import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";

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
    <WithNavigationBar>
      <Details previous={previous} dispatch={dispatch} data={state} />
    </WithNavigationBar>
  );
};

export default VenueWizardCreate;
