import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";

import { AuditoriumVenue } from "types/venues";
import { WithId } from "utils/id";

import { Section } from "./components/Section";
import { AllSectionPreviews } from "./components/AllSectionPreviews";

export interface AuditoriumProps {
  venue: WithId<AuditoriumVenue>;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ venue }) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/section/:sectionId`}>
        <Section venue={venue} />
      </Route>
      <Route path={`${match.path}`}>
        <AllSectionPreviews venue={venue} />
      </Route>
    </Switch>
  );
};
