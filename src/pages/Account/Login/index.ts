import { withRelatedSpacesById } from "components/hocs/db/withRelatedSpacesById";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import { Login as _Login } from "./Login";

export const Login = compose(
  withWorldOrSpace,
  withFallback(["isSpacesLoaded", "isWorldLoaded"], LoadingPage),
  withFallback(["spaceId", "space", "world"], NotFoundFallback),
  withRelatedSpacesById
)(_Login);
