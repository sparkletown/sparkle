import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import AvatarGrid from ".";
import AvatarAdmin from "./AvatarAdmin";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

export const AvatarRouter: FC = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.path}/admin`} component={AvatarAdmin} />
      <Route path={`${match.path}/`} component={AvatarGrid} />
    </Switch>
  );
};
