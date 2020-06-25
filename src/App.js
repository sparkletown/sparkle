import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap";
import qs from "qs";

import EntranceExperience from "pages/JazzBar/EntranceExperience";
import LockedSite from "./LockedSite";
import { PARTY_NAME } from "./config";
import LoggedInRouter from "components/organisms/LoggedInRouter";
import { leaveRoom } from "utils/useLocationUpdateEffect";

const ONE_HOUR_IN_SECONDS = 60 * 60;

function isAfterEvent(startUtcSeconds, durationMinutes) {
  const endUtcSeconds = startUtcSeconds + durationMinutes * 60;
  const lockSiteAfterUtcSeconds = endUtcSeconds + 12 * ONE_HOUR_IN_SECONDS;
  return new Date() / 1000 >= lockSiteAfterUtcSeconds;
}

export default function App(props) {
  const dispatch = useDispatch();
  const { config, user } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
    user: state.user,
  }));

  useEffect(() => {
    // Remove room presence etc. on disconnect
    window.onbeforeunload = () => {
      if (user) {
        leaveRoom(user);
      }
    };
  }, [dispatch, user]);

  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const unlock = search.unlock !== undefined;

  if (!config) {
    return "Loading...";
  }

  if (
    !unlock &&
    isAfterEvent(config.start_utc_seconds, config.duration_minutes)
  ) {
    return <LockedSite />;
  }

  if (!user) {
    return <EntranceExperience config={config} />;
  }

  return <LoggedInRouter />;
}
