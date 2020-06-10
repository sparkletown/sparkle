import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap";
import qs from "qs";

import { startTimer, stopTimer, leaveRoom } from "./actions";

import EntranceExperience from "pages/JazzBar/EntranceExperience";
import LockedSite from "./LockedSite";
import { PARTY_NAME } from "./config";
import LoggedInPartyPage from "pages/LoggedInPartyPage";

const ONE_HOUR_IN_SECONDS = 60 * 60;

function isAfterEvent(time, startUtcSeconds, durationHours) {
  const endUtcSeconds = startUtcSeconds + durationHours * ONE_HOUR_IN_SECONDS;
  const lockSiteAfterUtcSeconds = endUtcSeconds + 12 * ONE_HOUR_IN_SECONDS;
  return time >= lockSiteAfterUtcSeconds;
}

export default function App(props) {
  const dispatch = useDispatch();
  const { config, user, users, time, timerInterval } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
    user: state.user,
    users: state.firestore.ordered.users,
    time: state.timer.time,
    timerInterval: state.timer.timerInterval,
  }));

  // REVISIT: properly wrap dependencies in useRef per https://github.com/facebook/create-react-app/issues/6880
  useEffect(() => {
    dispatch(startTimer());
    return () => {
      dispatch(stopTimer(timerInterval));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Remove room presence etc. on disconnect
    window.onbeforeunload = () => {
      if (user) {
        dispatch(leaveRoom(user.uid));
      }
    };
  }, [dispatch, user]);

  const attendances = users
    ? users.reduce((acc, value) => {
        acc[value.room] = (acc[value.room] || 0) + 1;
        return acc;
      }, {})
    : [];

  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const unlock = search.unlock !== undefined;

  if (!config) {
    return "Loading...";
  }

  if (
    !unlock &&
    isAfterEvent(time, config.start_utc_seconds, config.duration_hours)
  ) {
    return <LockedSite />;
  }

  if (!user) {
    return <EntranceExperience />;
  }

  return (
    <LoggedInPartyPage
      config={config}
      users={users}
      attendances={attendances}
    />
  );
}
