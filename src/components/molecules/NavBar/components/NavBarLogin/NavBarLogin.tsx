import React, { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { DEFAULT_SPACE_SLUG, DEFAULT_WORLD_SLUG } from "settings";

import { venueEntranceUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import "./NavBarLogin.scss";

export const NavBarLogin: FC = () => {
  const history = useHistory();
  const { worldSlug, spaceSlug } = useSpaceParams();

  const navigateToDefault = useCallback(
    () =>
      history.push(
        venueEntranceUrl(
          worldSlug ?? DEFAULT_WORLD_SLUG,
          spaceSlug ?? DEFAULT_SPACE_SLUG
        )
      ),
    [history, worldSlug, spaceSlug]
  );

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
