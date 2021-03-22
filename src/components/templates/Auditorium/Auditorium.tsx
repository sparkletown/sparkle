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
      <Route
        path={`${match.path}/section/:sectionId`}
        render={() => <Section venue={venue} />}
      />
      <Route
        path={`${match.path}`}
        strict
        render={() => <SectionPreviews venue={venue} />}
      />
    </Switch>
  );
};
