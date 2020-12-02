import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { BannerAdmin } from "components/organisms/BannerAdmin";

import PartyMap from "./PartyMap";

export const PartyMapRouter: FC = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.url}/admin`} component={BannerAdmin} />
      <Route path={`${match.url}/`} component={PartyMap} />
    </Switch>
  );
};
