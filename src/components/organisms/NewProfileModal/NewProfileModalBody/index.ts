import { compose } from "lodash/fp";

import { withProfileById } from "components/hocs/db/withProfileById";
import { withFallback } from "components/hocs/gate/withFallback";
import { Loading } from "components/molecules/Loading";

import { NewProfileModalBody as _NewProfileModalBody } from "./NewProfileModalBody";

export const NewProfileModalBody = compose(
  withProfileById,
  withFallback(["isProfileByIdLoaded"], Loading)
)(_NewProfileModalBody);
