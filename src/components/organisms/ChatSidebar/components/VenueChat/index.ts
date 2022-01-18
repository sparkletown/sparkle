import { withMemo } from "components/hocs/withMemo";
import { withRequired } from "components/hocs/withRequired";
import { compose } from "lodash/fp";

import { VenueChat as _VenueChat } from "./VenueChat";
import { withMessages } from "./withMessages";

export const VenueChat = compose(
  withRequired(["space"]),
  withMessages,
  withMemo
)(_VenueChat);
