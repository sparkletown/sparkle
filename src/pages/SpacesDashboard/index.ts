import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withOwnSpaces } from "components/hocs/db/withOwnSpaces";
import { withWorld } from "components/hocs/db/withWorld";
import { withRequired } from "components/hocs/gate/withRequired";
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
