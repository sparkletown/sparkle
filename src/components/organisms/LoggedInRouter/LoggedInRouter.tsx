import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Venue from "pages/VenuePage";
import { getHoursAgoInSeconds } from "utils/time";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";

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

  useConnectPartyGoers();

  return (
    <Switch>
      <Route path="/venue/:venueId" component={Venue} />
    </Switch>
  );
};

export default LoggedInRouter;
