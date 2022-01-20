import { withSlugs } from "components/hocs/context/withSlugs";
import { withSpacesBySlug } from "components/hocs/db/withSpacesBySlug";
import { withWorldBySlug } from "components/hocs/db/withWorldBySlug";
import { compose } from "lodash/fp";

export const withWorldOrSpace = compose(
  withSlugs,
  withWorldBySlug,
  withSpacesBySlug
);
