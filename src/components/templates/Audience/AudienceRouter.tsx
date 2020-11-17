import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useSelector } from "hooks/useSelector";
import VideoAdmin from "pages/VideoAdmin";
import { Venue } from "types/Venue";
import { ExperienceContextWrapper } from "components/context/ExperienceContext";
import { Audience } from "./Audience";

const AudienceRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  })) as { venue: Venue };

  return (
    <Switch>
      <Route path={`${match.url}/admin`} component={VideoAdmin} />
      <Route
        path={`${match.url}/`}
        render={() => (
          <ExperienceContextWrapper venueName={venue.name}>
            <Audience />
          </ExperienceContextWrapper>
        )}
      />
    </Switch>
  );
};

export default AudienceRouter;
