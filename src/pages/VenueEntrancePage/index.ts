import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { NotFound } from "components/shared/NotFound";
import { compose } from "lodash/fp";

import { Login } from "pages/auth/Login";

import { LoadingPage } from "components/molecules/LoadingPage";

import { VenueEntrancePage as _VenueEntrancePage } from "./VenueEntrancePage";

export const VenueEntrancePage = compose(
  withAuth,
  withFallback(["auth"], Login),
  withProfile,
  withWorldOrSpace,
  withFallback(
    ["isAuthLoaded", "isSpacesLoaded", "isWorldLoaded"],
    LoadingPage
  ),
  withFallback(["spaceId", "space", "spaceSlug", "world"], NotFound)
)(_VenueEntrancePage);
