import { useEffect, useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { REACTION_TIMEOUT } from "settings";

import { isReactionCreatedBy, Reaction } from "types/reactions";
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

  const userId = user?.id;

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
    // TODO: for this to work with filtering users we need to create a composite index on created_by + created_at
    //   I feel like we can handle this in a better way by using our more standard patterns
    // const reactionsQuery = user
    //   ? baseReactionsQuery.where("created_by", "==", user.id)
    //   : baseReactionsQuery;
    const reactionsQuery = baseReactionsQuery;

    const unsubscribeListener = reactionsQuery.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newReaction = change.doc.data() as Reaction;

          // When we provide a user, if this reaction isn't by them, don't update our state
          // @debt This is an interim workaround to avoid creating the composite index mentioned above
          //   I feel like we can handle this in a better way by using our more standard patterns
          if (userId && !isReactionCreatedBy(userId)(newReaction)) return;

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
  }, [firebase, setReactions, userId, venueId]);

  return reactions;
};
