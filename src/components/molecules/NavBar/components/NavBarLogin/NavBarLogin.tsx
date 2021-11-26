import React, { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { DEFAULT_SPACE_SLUG } from "settings";

import { venueEntranceUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import "./NavBarLogin.scss";

export const NavBarLogin: FC = () => {
  const history = useHistory();
  const { spaceSlug } = useSpaceParams();

  const navigateToDefault = useCallback(
    () => history.push(venueEntranceUrl(spaceSlug ?? DEFAULT_SPACE_SLUG)),
    [history, spaceSlug]
  );

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
