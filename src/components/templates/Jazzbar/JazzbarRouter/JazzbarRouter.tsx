import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import JazzBar from "../Jazzbar";
import ReactionPage from "pages/ReactionPage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import { ExperienceContextWrapper } from "components/context/ExperienceContext";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import VideoAdmin from "pages/VideoAdmin";

const JazzbarRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectPartyGoers();

  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  })) as { venue: Venue };

  return (
    <ExperienceContextWrapper venueName={venue.name}>
      <Switch>
        <Route path={`${match.url}/band`} component={ReactionPage} />
        <Route path={`${match.url}/admin`} component={VideoAdmin} />
        <Route path={`${match.url}/`} component={JazzBar} />
      </Switch>
    </ExperienceContextWrapper>
  );
};

export default JazzbarRouter;
