import { compose } from "lodash/fp";

import { withAuth } from "components/hocs/db/withAuth";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { LoadingPage } from "components/molecules/LoadingPage";

import {
  VenueLandingPage as _VenueLandingPage,
  VenueLandingPageProps,
} from "./VenueLandingPage";

export const VenueLandingPage = compose(
  withAuth,
  withWorldOrSpace,
  withFallback<VenueLandingPageProps>(
    ["isAuthLoaded", "isSpacesLoaded", "isWorldLoaded"],
    LoadingPage
  )
)(_VenueLandingPage);
