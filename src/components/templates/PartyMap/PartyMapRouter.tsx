import React from "react";

import PartyMapPage from "./PartyMapPage";

import { Switch, Route, useRouteMatch } from "react-router-dom";
import RoomModal from "./RoomModal";

const PartyMapRouter = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:roomPath`} component={RoomModal} />
      <Route path={`${match.url}`} exact component={PartyMapPage} />
    </Switch>
  );
};

export default PartyMapRouter;
