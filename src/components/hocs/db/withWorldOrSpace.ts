import { compose } from "lodash/fp";

import { withSlugs, WithSlugsProps } from "components/hocs/context/withSlugs";
import {
  withSpacesBySlug,
  WithSpacesBySlugProps,
} from "components/hocs/db/withSpacesBySlug";
import {
  withWorldBySlug,
  WithWorldBySlugProps,
} from "components/hocs/db/withWorldBySlug";
import { withChildren } from "components/hocs/gate/withChildren";

export type WithWorldOrSpaceProps = WithSlugsProps &
  WithWorldBySlugProps &
  WithSpacesBySlugProps;

export const withWorldOrSpace = compose(
  withSlugs,
  withChildren(["worldSlug"]),
  withWorldBySlug,
  withChildren(["isWorldLoaded"]),
  withSpacesBySlug,
  withChildren(["isSpacesLoaded"])
);
