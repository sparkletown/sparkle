import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import AvatarGrid from ".";
import AvatarAdmin from "./AvatarAdmin";

export const AvatarRouter: FC = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.url}/admin`} component={AvatarAdmin} />
      <Route path={`${match.url}/`} component={AvatarGrid} />
    </Switch>
  );
};
