import React from "react";

import PartyMap from "./PartyMapPage";
import RoomPage from "./RoomPage";

import { Switch, Route, useRouteMatch } from "react-router-dom";

const PartyMapRouter = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:roomPath`} component={RoomPage} />
      <Route path={`${match.url}`} exact component={PartyMap} />
    </Switch>
  );
};

export default PartyMapRouter;
