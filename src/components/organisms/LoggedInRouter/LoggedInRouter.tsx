import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";

import JazzBarLoggedInPartyPage from "pages/JazzBar/LoggedInPartyPage";
// import LoggedInPartyPage from "pages/LoggedInPartyPage";
// import FriendShipPage from "pages/FriendShipPage";
// import Room from "pages/RoomPage";
import { getHoursAgoInSeconds } from "utils/time";
import ReactionPage from "pages/ReactionPage";
import ExperienceContextProvider from "components/context/ExperienceContext";
import Admin from "pages/Admin";

const LoggedInRouter = () => {
  const [userLastSeenLimit, setUserLastSeenLimit] = useState(
    getHoursAgoInSeconds(3)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setUserLastSeenLimit(getHoursAgoInSeconds(3));
    }, 5 * 60 * 1000);

    return () => clearInterval(id);
  }, [setUserLastSeenLimit]);

  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", userLastSeenLimit]],
      storeAs: "partygoers",
    },
  ]);

  return (
    <ExperienceContextProvider experienceName="kansassmittys">
      <Switch>
        <Route path="/band" component={ReactionPage} />
        <Route path="/admin" component={Admin} />
        <Route path="/" component={JazzBarLoggedInPartyPage} />
        {/* <Route path="/friendship" component={FriendShipPage} />
        <Route path="/" exact component={LoggedInPartyPage} />
        <Route path="/:roomName" component={Room} /> */}
      </Switch>
    </ExperienceContextProvider>
  );
};

export default LoggedInRouter;
