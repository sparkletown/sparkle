import { withAuth } from "components/hocs/withAuth";
import { withOwnSpaces } from "components/hocs/withOwnSpaces";
import { withRequired } from "components/hocs/withRequired";
import { withSlugs } from "components/hocs/withSlugs";
import { withWorld } from "components/hocs/withWorld";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { SpacesDashboard as _SpacesDashboard } from "./SpacesDashboard";

export const SpacesDashboard = compose(
  withAuth,
  withSlugs,
  withWorld,
  withRequired({
    required: ["worldId", "userId", "world"],
    fallback: LoadingPage,
  }),
  withOwnSpaces,
  withRequired({ required: ["ownSpaces"], fallback: LoadingPage })
)(_SpacesDashboard);
