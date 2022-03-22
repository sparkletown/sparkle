import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

import { AuditoriumVenue } from "types/venues";

import { captureError, SparkleAssertError } from "utils/error";
import { WithId } from "utils/id";

import { useAllAuditoriumSections } from "hooks/auditorium";
import { useUser } from "hooks/useUser";

import { AllSectionPreviews } from "../AllSectionPreviews";
import { Section } from "../Section";

interface SeatingBlockProps {
  space: WithId<AuditoriumVenue>;
}

export const SeatingBlock: React.FC<SeatingBlockProps> = ({ space }) => {
  const match = useRouteMatch();

  const { allSections, isLoading } = useAllAuditoriumSections(space);
  const { sectionId: urlSectionId } = useParams<{ sectionId: string }>();
  const { userWithId: user, isLoading: isUserLoading } = useUser();

  if (isLoading || isUserLoading || !user) {
    return null;
  }

  // Sort the sections into a predictable order so that all clients get the
  // same first section. The consistency is important - not the actual order.
  const sortedSections = [...allSections];
  sortedSections.sort(({ id: idA }, { id: idB }) => idA.localeCompare(idB));
  const sectionId = urlSectionId || sortedSections[0]?.id;

  if (!sectionId) {
    captureError(
      new SparkleAssertError({
        message: `Invalid sectionId:${String(sectionId)}`,
        where: "SeatingBlock",
      })
    );
  }

  return (
    <Switch>
      {sectionId && <Section venue={space} sectionId={sectionId} user={user} />}
      <Route path={`${match.path}`}>
        <AllSectionPreviews venue={space} />
      </Route>
    </Switch>
  );
};
