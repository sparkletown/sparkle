import { withMemo } from "components/hocs/withMemo";
import { withRequired } from "components/hocs/withRequired";
import { withSpaceById } from "components/hocs/withSpaceById";
import { compose } from "lodash/fp";

import { VenueChat as _VenueChat } from "./VenueChat";
import { withMessages } from "./withMessages";

export const VenueChat = compose(
  withSpaceById,
  withRequired(["space", "spaceId"]),
  withMessages,
  withMemo
)(_VenueChat);
