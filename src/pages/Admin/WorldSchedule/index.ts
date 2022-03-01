import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withWorldBySlug } from "components/hocs/db/withWorldBySlug";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { WorldSchedule as _WorldSchedule } from "./WorldSchedule";

export const WorldSchedule = compose(
  withAuth,
  withSlugs,
  withWorldBySlug,
  withRequired({
    required: ["worldId", "userId", "world"],
    fallback: LoadingPage,
  })
)(_WorldSchedule);
