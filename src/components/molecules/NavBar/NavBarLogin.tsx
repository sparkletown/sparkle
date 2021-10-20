import React, { FC } from "react";
import { useHistory } from "react-router-dom";

import { DEFAULT_VENUE } from "settings";

import { venueEntranceUrl } from "utils/url";

import { useVenueId } from "hooks/useVenueId";

export const NavBarLogin: FC = () => {
  const history = useHistory();
  const venueId = useVenueId();
  return (
    <div
      className="log-in-button"
      style={{ marginTop: "20px" }}
      onClick={() => history.push(venueEntranceUrl(venueId ?? DEFAULT_VENUE))}
    >
      Log in
    </div>
  );
};
