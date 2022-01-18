import { withSlugs } from "components/hocs/context/withSlugs";
import { withUser } from "components/hocs/db/withUser";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { SpaceEditForm as _SpaceEditForm } from "./SpaceEditForm";

export const SpaceEditForm = compose(
  withUser,
  withSlugs,
  withWorldAndSpace,
  withRequired(["space", "userId", "worldId"])
)(_SpaceEditForm);
