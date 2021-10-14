import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";

import { AllSectionPreviews } from "./components/AllSectionPreviews";
import { Section } from "./components/Section";

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
