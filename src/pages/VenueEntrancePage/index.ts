import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { VenueEntrancePage as _VenueEntrancePage } from "./VenueEntrancePage";

export const VenueEntrancePage = compose(
  withAuth,
  withProfile,
  withWorldOrSpace,
  withFallback(
    ["isAuthLoaded", "isSpacesLoaded", "isWorldLoaded"],
    LoadingPage
  ),
  withFallback(["spaceId", "space", "spaceSlug", "world"], NotFound)
)(_VenueEntrancePage);
