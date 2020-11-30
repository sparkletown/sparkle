import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";

import { PartyMap } from "../PartyMap";
import { PartyMapAdmin } from "../PartyMap/PartyMapAdmin";

export const CampRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();
  useConnectCurrentEvent();

  return (
    <Switch>
      <Route exact path={`${match.url}/admin`} component={PartyMapAdmin} />
      <Route path={`${match.url}/:roomTitle`} component={PartyMap} />
      <Route path={`${match.url}/`} component={PartyMap} />
    </Switch>
  );
};
