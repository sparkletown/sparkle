import { FC, useCallback } from "react";
import { useHistory } from "react-router-dom";

import {
  ATTENDEE_INSIDE_URL,
  ATTENDEE_STEPPING_PARAM_URL,
  DEFAULT_ENTER_STEP,
} from "settings";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import "./NavBarLogin.scss";

export interface NavBarLoginProps {
  hasEntrance: boolean;
}

export const NavBarLogin: FC<NavBarLoginProps> = ({ hasEntrance }) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const history = useHistory();

  const navigateToDefault = useCallback(
    () =>
      history.push(
        generateUrl({
          route: !hasEntrance
            ? ATTENDEE_INSIDE_URL
            : ATTENDEE_STEPPING_PARAM_URL,
          required: ["worldSlug", "spaceSlug", "step"],
          params: {
            worldSlug: worldSlug,
            spaceSlug: spaceSlug,
            step: DEFAULT_ENTER_STEP,
          },
        })
      ),
    [history, hasEntrance, worldSlug, spaceSlug]
  );

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
