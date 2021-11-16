import React, { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { DEFAULT_VENUE } from "settings";

import { venueEntranceUrl } from "utils/url";

import { useVenueId } from "hooks/useVenueId";

import "./NavBarLogin.scss";

export const NavBarLogin: FC = () => {
  const history = useHistory();
  const venueId = useVenueId();

  const navigateToDefault = useCallback(
    () => history.push(venueEntranceUrl(venueId ?? DEFAULT_VENUE)),
    [history, venueId]
  );

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
