import { withRequired } from "components/hocs/withRequired";
import { withSlugs } from "components/hocs/withSlugs";
import { withUser } from "components/hocs/withUser";
import { withWorldAndSpace } from "components/hocs/withWorldAndSpace";
import { compose } from "lodash/fp";

import { SpaceEditForm as _SpaceEditForm } from "./SpaceEditForm";

export const SpaceEditForm = compose(
  withUser,
  withSlugs,
  withWorldAndSpace,
  withRequired(["space", "userId", "worldId"])
)(_SpaceEditForm);
