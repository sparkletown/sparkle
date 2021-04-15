import { useEffect, useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { REACTION_TIMEOUT } from "settings";

import { Reaction } from "types/reactions";
import { User } from "types/User";

import { WithId } from "utils/id";

export interface UseReactionsProps {
  venueId?: string;
  user?: WithId<User>;
}

// @debt refactor this to use useConnect like in src/components/templates/ReactionPage/ReactionPage.tsx ?
export const useReactions = ({ venueId, user }: UseReactionsProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    if (!venueId) return;

    const reactionsCollectionRef = firebase
      .firestore()
      .collection("experiences")
      .doc(venueId)
      .collection("reactions");

    // We only want to retrieve new reactions
    const baseReactionsQuery = reactionsCollectionRef.where(
      "created_at",
      ">",
      Date.now()
    );

    // When we provide a user, only retrieve their reactions
    const reactionsQuery = user
      ? baseReactionsQuery.where("created_by", "==", user.id)
      : baseReactionsQuery;

    const unsubscribeListener = reactionsQuery.onSnapshot((snapshot) => {
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

    return () => {
      unsubscribeListener();
    };
  }, [firebase, setReactions, user, venueId]);

  return reactions;
};
