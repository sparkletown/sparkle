import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import { LoginForm as _LoginForm, LoginFormProps } from "./LoginForm";

export const LoginForm = compose(
  withWorldOrSpace,
  withFallback(["isSpacesLoaded", "isWorldLoaded"], LoadingPage),
  withFallback<LoginFormProps>(["spaceId", "space", "world"], NotFoundFallback)
)(_LoginForm);
