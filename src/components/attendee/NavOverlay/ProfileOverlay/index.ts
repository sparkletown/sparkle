import { withCurrentUserId } from "components/hocs/db/withCurrentUserId";
import { withProfileById } from "components/hocs/db/withProfileById";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { Loading } from "components/molecules/Loading";

import { ProfileOverlay as _ProfileOverlay } from "./ProfileOverlay";

export const ProfileOverlay = compose(
  withCurrentUserId,
  withProfileById,
  withFallback(["isProfileByIdLoaded"], Loading)
)(_ProfileOverlay);
