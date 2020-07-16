import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Venue from "pages/VenuePage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

const LoggedInRouter = () => {
  useConnectPartyGoers();
  useProfileInformationCheck();

  return <Switch></Switch>;
};

export default LoggedInRouter;
