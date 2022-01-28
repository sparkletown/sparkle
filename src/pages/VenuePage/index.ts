import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";
import { NotLoggedInFallback } from "components/atoms/NotLoggedInFallback";

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
