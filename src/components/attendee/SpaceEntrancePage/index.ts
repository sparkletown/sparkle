import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { NotFound } from "components/shared/NotFound";
import { compose } from "lodash/fp";

import { Login } from "pages/auth/Login";

import { LoadingPage } from "components/molecules/LoadingPage";

import { SpaceEntrancePage as _SpaceEntrancePage } from "./SpaceEntrancePage";

export const SpaceEntrancePage = compose(
  withAuth,
  withFallback(["auth"], Login),
  withProfile,
  withWorldOrSpace,
  withFallback(
    ["isAuthLoaded", "isSpacesLoaded", "isWorldLoaded"],
    LoadingPage
  ),
  withFallback(["spaceId", "spaceSlug", "world"], NotFound)
)(_SpaceEntrancePage);
