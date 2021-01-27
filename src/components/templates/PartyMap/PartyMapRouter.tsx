import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import PartyMap from "./PartyMap";

export const PartyMapRouter: FC = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route path={`${match.path}/:roomTitle`} component={PartyMap} />
      <Route path={`${match.path}/`} component={PartyMap} />
    </Switch>
  );
};
