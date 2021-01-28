import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import PartyMap from "./PartyMap";
import { PartyMapAdmin } from "./PartyMapAdmin";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

export const PartyMapRouter: FC = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.path}/admin`} component={PartyMapAdmin} />
      <Route path={`${match.path}/:roomTitle`} component={PartyMap} />
      <Route path={`${match.path}/`} component={PartyMap} />
    </Switch>
  );
};
