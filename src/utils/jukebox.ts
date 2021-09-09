import firebase from "firebase/app";

import { JukeboxMessage } from "types/jukebox";

export const buildJukeboxMessage = <T extends JukeboxMessage>(
  message: Pick<T, Exclude<keyof T, "ts_utc">>
) => ({
  ...message,
  ts_utc: firebase.firestore.Timestamp.now(),
});
