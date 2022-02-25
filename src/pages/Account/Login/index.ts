import { withAnalytics } from "components/hocs/db/withAnalytics";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import { Login as _Login, LoginProps } from "./Login";

export const Login = compose(
  withWorldOrSpace,
  withFallback(["isSpacesLoaded", "isWorldLoaded"], LoadingPage),
  withFallback<LoginProps>(["spaceId", "world"], NotFoundFallback),
  withAnalytics
)(_Login);
