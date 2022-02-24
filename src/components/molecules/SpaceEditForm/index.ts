import { compose } from "lodash/fp";

import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withRequired } from "components/hocs/gate/withRequired";

import { SpaceEditForm as _SpaceEditForm } from "./SpaceEditForm";

export const SpaceEditForm = compose(
  withAuth,
  withRequired(["auth"]),
  withProfile,
  withSlugs,
  withWorldAndSpace,
  withRequired(["space", "userId", "worldId"])
)(_SpaceEditForm);
