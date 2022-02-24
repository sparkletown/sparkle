import { compose } from "lodash/fp";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { LoadingPage } from "components/molecules/LoadingPage";

import {
  RegisterForm as _RegisterForm,
  RegisterFormProps,
} from "./RegisterForm";

export const RegisterForm = compose(
  withWorldOrSpace,
  withFallback(["isSpacesLoaded", "isWorldLoaded"], LoadingPage),
  withFallback<RegisterFormProps>(
    ["spaceId", "space", "world"],
    NotFoundFallback
  )
)(_RegisterForm);
