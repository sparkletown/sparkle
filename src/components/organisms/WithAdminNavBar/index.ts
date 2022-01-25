import { withSlugs } from "components/hocs/context/withSlugs";
import { withSpacesBySlug } from "components/hocs/db/withSpacesBySlug";
import { withWorldBySlug } from "components/hocs/db/withWorldBySlug";
import { compose } from "lodash/fp";

import { WithAdminNavBar as _WithAdminNavBar } from "./WithAdminNavBar";

export const WithAdminNavBar = compose(
  withSlugs,
  withWorldBySlug,
  withSpacesBySlug
)(_WithAdminNavBar);
