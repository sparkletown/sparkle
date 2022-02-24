import { compose } from "lodash/fp";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";
import { NotLoggedInFallback } from "components/atoms/NotLoggedInFallback";
import { withAuth } from "components/hocs/db/withAuth";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminVenueView as _AdminVenueView } from "./AdminVenueView";

export const AdminVenueView = compose(
  withWorldOrSpace,
  withFallback(["isSpacesLoaded", "isWorldLoaded"], LoadingPage),
  withFallback(["spaceId", "space", "world"], NotFoundFallback),
  withAuth,
  withFallback(["isAuthLoaded", "userId"], NotLoggedInFallback)
)(_AdminVenueView);
