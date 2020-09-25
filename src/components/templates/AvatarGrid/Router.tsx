import React, { FC } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import AvatarGrid from ".";
import AvatarAdmin from "./Admin";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

interface Props {
  venueName: string;
}

export const AvatarRouter: FC<Props> = ({ venueName }) => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.url}/admin`} component={AvatarAdmin} />
      <Route
        path={`${match.url}/`}
        render={() => <AvatarGrid venueName={venueName} />}
      />
    </Switch>
  );
};
