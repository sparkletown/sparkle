import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { NotFoundFallback } from "pages/VenuePage/NotFoundFallback";
import { NotLoggedInFallback } from "pages/VenuePage/NotLoggedInFallback";

import { LoadingPage } from "components/molecules/LoadingPage";

import { VenuePage as _VenuePage } from "./VenuePage";

export const VenuePage = compose(
  withAuth,
  withWorldOrSpace,
  withFallback(["isSpacesLoaded"], LoadingPage),
  withFallback(["spaceId", "spaceSlug", "space"], NotFoundFallback),
  withFallback(["isAuthLoaded", "userId"], NotLoggedInFallback),
  withProfile,
  withFallback(["isProfileLoaded"], LoadingPage)
)(_VenuePage);
