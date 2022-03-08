import { withCurrentUserId } from "components/hocs/db/withCurrentUserId";
import { withProfileById } from "components/hocs/db/withProfileById";
import { compose } from "lodash/fp";

import { ProfileOverlay as _ProfileOverlay } from "./ProfileOverlay";

export const ProfileOverlay = compose(
  // @debt replace this compose with newer useLife and useFire hooks once they're ready for use
  withCurrentUserId,
  withProfileById
)(_ProfileOverlay);
