import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";

import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";

import { Section } from "./components/Section";
import { AllSectionPreviews } from "./components/AllSectionPreviews";

export interface AuditoriumProps {
  venue: WithId<AnyVenue>;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ venue }) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/section/:sectionId`}>
        <Section venue={venue} />
      </Route>
      <Route path={`${match.path}`} strict>
        <AllSectionPreviews venue={venue} />
      </Route>
    </Switch>
  );
};
