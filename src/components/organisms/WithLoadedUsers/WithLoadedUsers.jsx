import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { setUser } from "actions";
import { PARTY_NAME } from "config";

const WithLoadedUsers = ({ children }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  useFirestoreConnect([{ collection: "config", doc: PARTY_NAME }, "users"]);
  const { config, time } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
    time: state.timer.time,
  }));

  const killLoginsFromBeforePartyStart = (user) => {
    if (user && config) {
      const partyHasStarted = time >= config.start_utc_seconds;
      const lastSignInTimeSeconds =
        new Date(user.metadata.lastSignInTime) / 1000;
      const signedInBeforePartyStart =
        lastSignInTimeSeconds < config.start_utc_seconds;

      if (partyHasStarted && signedInBeforePartyStart) {
        firebase.auth().signOut();
      }
    }
  };

  // REVISIT: properly wrap dependencies in useRef per https://github.com/facebook/create-react-app/issues/6880
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      dispatch(setUser(user));
      killLoginsFromBeforePartyStart(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default WithLoadedUsers;
