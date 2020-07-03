import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import JazzBar from "../Jazzbar";
import ReactionPage from "pages/ReactionPage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import ExperienceContextProvider from "components/context/ExperienceContext";
import { useFirestoreConnect } from "react-redux-firebase";

interface PropsType {
  venueName: string;
}

const JazzbarRouter: React.FunctionComponent<PropsType> = ({ venueName }) => {
  const match = useRouteMatch();
  useConnectPartyGoers();
  useFirestoreConnect("users");
  return (
    <ExperienceContextProvider venueName={venueName}>
      <Switch>
        <Route path={`${match.url}/band`} component={ReactionPage} />
        <Route path={`${match.url}/`} component={JazzBar} />
      </Switch>
    </ExperienceContextProvider>
  );
};

export default JazzbarRouter;
