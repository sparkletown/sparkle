import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap";
import qs from "qs";

import { leaveRoom } from "./actions";

import EntranceExperience from "pages/JazzBar/EntranceExperience";
import LockedSite from "./LockedSite";
import { PARTY_NAME } from "./config";
import LoggedInPartyPage from "pages/JazzBar/LoggedInPartyPage";

const ONE_HOUR_IN_SECONDS = 60 * 60;

function isAfterEvent(startUtcSeconds, durationHours) {
  const endUtcSeconds = startUtcSeconds + durationHours * ONE_HOUR_IN_SECONDS;
  const lockSiteAfterUtcSeconds = endUtcSeconds + 12 * ONE_HOUR_IN_SECONDS;
  return new Date() / 1000 >= lockSiteAfterUtcSeconds;
}

export default function App(props) {
  const dispatch = useDispatch();
  const { config, user, users } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
    user: state.user,
    users:
      state.firestore.ordered.users &&
      state.firestore.ordered.users.filter(
        (user) => user.lastLoginUtc > new Date("2020-06-06")
      ), //  option1: change this to the number of users who are logged in
  }));

  useEffect(() => {
    // Remove room presence etc. on disconnect
    window.onbeforeunload = () => {
      if (user) {
        dispatch(leaveRoom(user.uid));
      }
    };
  }, [dispatch, user]);

  // const attendances = users
  //   ? users.reduce((acc, value) => {
  //       acc[value.room] = (acc[value.room] || 0) + 1;
  //       return acc;
  //     }, {})
  //   : [];

  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const unlock = search.unlock !== undefined;

  if (!config) {
    return "Loading...";
  }

  if (
    !unlock &&
    isAfterEvent(config.start_utc_seconds, config.duration_hours)
  ) {
    return <LockedSite />;
  }

  if (!user) {
    return <EntranceExperience />;
  }

  if (users) {
    return <LoggedInPartyPage users={users} />;
  }

  return "Loading...";
}
