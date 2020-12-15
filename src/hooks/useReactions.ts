import { useEffect, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { REACTION_TIMEOUT } from "settings";
import { Reaction } from "utils/reactions";

export const useReactions = (venueId?: string) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    if (!venueId) return;

    firebase
      .firestore()
      .collection(`experiences/${venueId}/reactions`)
      .where("created_at", ">", Date.now())
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newReaction = change.doc.data() as Reaction;
            setReactions((prevReactions) => [...prevReactions, newReaction]);

            setTimeout(() => {
              setReactions((prevReactions) =>
                prevReactions.filter((r) => r !== newReaction)
              );
            }, REACTION_TIMEOUT);
          }
        });
      });
  }, [firebase, setReactions, venueId]);

  return reactions;
};
