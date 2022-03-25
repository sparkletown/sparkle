import { withProfileById } from "components/hocs/db/withProfileById";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { Loading } from "components/molecules/Loading";

import { MiniProfileModal as _MiniProfileModal } from "./MiniProfileModal";

export const MiniProfileModal = compose(
  withProfileById,
  withFallback(["isProfileByIdLoaded"], Loading)
)(_MiniProfileModal);
