import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { BannerAdmin } from "components/organisms/BannerAdmin";

import AvatarGrid from ".";

export const AvatarRouter: FC = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.path}/admin`} component={BannerAdmin} />
      <Route path={`${match.path}/`} component={AvatarGrid} />
    </Switch>
  );
};
