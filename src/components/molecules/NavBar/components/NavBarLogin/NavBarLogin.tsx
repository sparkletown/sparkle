import React, { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";

import {
  ATTENDEE_STEPPING_PARAM_URL,
  DEFAULT_ENTER_STEP,
  DEFAULT_SPACE_SLUG,
  DEFAULT_WORLD_SLUG,
} from "settings";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import "./NavBarLogin.scss";

export const NavBarLogin: FC = () => {
  const history = useHistory();
  const { worldSlug, spaceSlug } = useSpaceParams();

  const navigateToDefault = useCallback(
    () =>
      history.push(
        generateUrl({
          route: ATTENDEE_STEPPING_PARAM_URL,
          required: ["worldSlug", "spaceSlug", "step"],
          params: {
            worldSlug: worldSlug ?? DEFAULT_WORLD_SLUG,
            spaceSlug: spaceSlug ?? DEFAULT_SPACE_SLUG,
            step: DEFAULT_ENTER_STEP,
          },
        })
      ),
    [history, worldSlug, spaceSlug]
  );

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
