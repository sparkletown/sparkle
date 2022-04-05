import { NotFound } from "components/admin/errors/NotFound";
import { withAuth } from "components/hocs/db/withAuth";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminVenueView as _AdminVenueView } from "./AdminVenueView";

export const AdminVenueView = compose(
  withWorldOrSpace,
  withFallback(["isSpacesLoaded", "isWorldLoaded"], LoadingPage),
  withFallback(["spaceId", "space", "world"], NotFound),
  withAuth
)(_AdminVenueView);
