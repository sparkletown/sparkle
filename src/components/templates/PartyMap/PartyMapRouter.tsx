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
      <Route exact path={`${match.url}/admin`} component={PartyMapAdmin} />
      <Route path={`${match.url}/:roomTitle`} component={PartyMap} />
      <Route path={`${match.url}/`} component={PartyMap} />
    </Switch>
  );
};
