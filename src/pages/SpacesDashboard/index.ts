import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withWorldBySlug } from "components/hocs/db/withWorldBySlug";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { SpacesDashboard as _SpacesDashboard } from "./SpacesDashboard";

export const SpacesDashboard = compose(
  withAuth,
  withSlugs,
  withWorldBySlug,
  withRequired({
    required: ["worldId", "userId", "world"],
    fallback: LoadingPage,
  })
)(_SpacesDashboard);
