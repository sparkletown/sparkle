import { withRequired } from "components/hocs/withRequired";
import { withSlugs } from "components/hocs/withSlugs";
import { withSpace } from "components/hocs/withSpace";
import { withUser } from "components/hocs/withUser";
import { compose } from "lodash/fp";

import { SpaceEditForm as _SpaceEditForm } from "./SpaceEditForm";

export const SpaceEditForm = compose(
  withUser,
  withSlugs,
  withSpace,
  withRequired(["space", "userId", "worldId"])
)(_SpaceEditForm);
