import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import JazzBar from "../Jazzbar";
import ReactionPage from "pages/ReactionPage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import { ExperienceContextWrapper } from "components/context/ExperienceContext";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import useConnectRecentUsers from "hooks/useConnectRecentUsers";

const JazzbarRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectPartyGoers();
  useConnectRecentUsers();

  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  })) as { venue: Venue };

  return (
    <ExperienceContextWrapper venueName={venue.name}>
      <Switch>
        <Route path={`${match.url}/band`} component={ReactionPage} />
        <Route path={`${match.url}/`} component={JazzBar} />
      </Switch>
    </ExperienceContextWrapper>
  );
};

export default JazzbarRouter;
