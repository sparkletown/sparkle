import { FC, useCallback } from "react";

import {
  ATTENDEE_SPACE_ENTRANCE_URL,
  ATTENDEE_SPACE_INSIDE_URL,
} from "settings";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import "./NavBarLogin.scss";

export interface NavBarLoginProps {
  hasEntrance: boolean;
}

export const NavBarLogin: FC<NavBarLoginProps> = ({ hasEntrance }) => {
  const { worldSlug, spaceSlug } = useSpaceParams();

  const navigateToDefault = useCallback(() => {
    const redirectUrl = generateUrl({
      route: !hasEntrance
        ? ATTENDEE_SPACE_INSIDE_URL
        : ATTENDEE_SPACE_ENTRANCE_URL,
      required: ["worldSlug", "spaceSlug"],
      params: { worldSlug, spaceSlug, step: "1" },
    });

    /**
     * Using history.push() doesn't work correctly for some strange reason and firebase returns 403 (Missing or insufficient premissions).
     * It's almost like it doesn't detect when the user logs in and the rules consider the `uid` to be `null`
     */
    window.location.href = redirectUrl;
  }, [hasEntrance, worldSlug, spaceSlug]);

  return (
    <div className="NavBarLogin" onClick={navigateToDefault}>
      Log in
    </div>
  );
};
