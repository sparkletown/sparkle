import React from "react";
import { Redirect } from "react-router-dom";

import { ATTENDEE_SPACE_URL } from "settings";

import { WorldWithId } from "types/id";

import { generateUrl } from "utils/url";

type WorldPageProps = {
  world: WorldWithId;
};

export const WorldPage: React.FC<WorldPageProps> = ({ world }) => {
  const defaultSpaceUrl = generateUrl({
    route: ATTENDEE_SPACE_URL,
    required: ["worldSlug", "spaceSlug"],
    params: { worldSlug: world.slug, spaceSlug: world.defaultSpaceSlug },
  });
  return <Redirect to={defaultSpaceUrl} />;
};
