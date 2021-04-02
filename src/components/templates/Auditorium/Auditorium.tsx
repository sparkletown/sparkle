import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { Section } from "./components/Section";
import { SectionPreviews } from "./components/SectionPreviews";

export interface AuditoriumProps {
  venue: AuditoriumVenue;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ venue }) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/section/:sectionId`}>
        <Section venue={venue} />
      </Route>
      <Route
        path={`${match.path}`}
        strict
      >
        <SectionPreviews venue={venue} />
      </Route>
    </Switch>
  );
};
