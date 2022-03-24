import { withProfileById } from "components/hocs/db/withProfileById";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { Loading } from "components/molecules/Loading";

import { UserProfileModalBody as _UserProfileModalBody } from "./UserProfileModalBody";

export const UserProfileModalBody = compose(
  withProfileById,
  withFallback(["isProfileByIdLoaded"], Loading)
)(_UserProfileModalBody);
