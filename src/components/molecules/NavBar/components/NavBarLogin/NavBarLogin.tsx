import React, { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { DEFAULT_VENUE } from "settings";

import { venueEntranceUrl } from "utils/url";

import { useSpaceParams } from "hooks/useVenueId";

import "./NavBarLogin.scss";

export const NavBarLogin: FC = () => {
  const history = useHistory();
  const spaceSlug = useSpaceParams();

  const navigateToDefault = useCallback(
    () => history.push(venueEntranceUrl(spaceSlug ?? DEFAULT_VENUE)),
    [history, spaceSlug]
  );

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
