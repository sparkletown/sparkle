import React from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

import JazzBarLoggedInPartyPage from "pages/JazzBar/LoggedInPartyPage";
import LoggedInPartyPage from "pages/LoggedInPartyPage";
import FriendShipPage from "pages/FriendShipPage";
import Room from "pages/RoomPage";
import { PARTY_NAME } from "config";

const LoggedInRouter = () => {
  const { config } = useSelector((state: any) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
  }));
  useFirestoreConnect([
    {
      collection: "users",
      where: ["lastSeenAt", ">", config.start_utc_seconds],
      storeAs: "partygoers",
    },
  ]);

  return (
    <Switch>
      <Route path="/kansassmittys" component={JazzBarLoggedInPartyPage} />
      <Route path="/friendship" component={FriendShipPage} />
      <Route path="/" exact component={LoggedInPartyPage} />
      <Route path="/:roomName" component={Room} />
    </Switch>
  );
};

export default LoggedInRouter;
