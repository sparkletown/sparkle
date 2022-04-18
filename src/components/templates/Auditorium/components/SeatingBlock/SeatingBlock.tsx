import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

import { AuditoriumSpaceWithId } from "types/id";

import { captureAssertError } from "utils/error";

import { useAllAuditoriumSections } from "hooks/auditorium";
import { useLiveUser } from "hooks/user/useLiveUser";

import { AllSectionPreviews } from "../AllSectionPreviews";
import { Section } from "../Section";

interface SeatingBlockProps {
  space: AuditoriumSpaceWithId;
}

export const SeatingBlock: React.FC<SeatingBlockProps> = ({ space }) => {
  const match = useRouteMatch();

  const { allSections, isLoading } = useAllAuditoriumSections(space);
  const { sectionId: urlSectionId } = useParams<{ sectionId: string }>();
  const { userWithId: user, isLoading: isUserLoading } = useLiveUser();

  if (isLoading || isUserLoading || !user) {
    return null;
  }

  // Sort the sections into a predictable order so that all clients get the
  // same first section. The consistency is important - not the actual order.
  const sortedSections = [...allSections];
  sortedSections.sort(({ id: idA }, { id: idB }) => idA.localeCompare(idB));
  const sectionId = urlSectionId || sortedSections[0]?.id;

  if (!sectionId) {
    captureAssertError({
      message: `Invalid sectionId:${String(sectionId)}`,
      where: "SeatingBlock",
    });
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
