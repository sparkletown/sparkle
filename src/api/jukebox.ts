import Bugsnag from "@bugsnag/js";
import { noop } from "lodash";

import { JukeboxMessage } from "types/jukebox";

import { getVenueRef } from "./venue";

export interface SendVenueMessageProps {
  venueId: string;
  tableId: string;
  message: JukeboxMessage;
}

export const sendJukeboxMessage = async ({
  venueId,
  message,
  tableId,
}: SendVenueMessageProps): Promise<void> =>
  getVenueRef(venueId)
    .collection("jukeboxMessages")
    .add(message)
    .then(noop)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::sendJukeboxMessage",
          venueId,
          message,
          tableId,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });
