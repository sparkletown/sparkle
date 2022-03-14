import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useMap } from "react-use";
import firebase from "firebase/compat/app";

import { REACTION_TIMEOUT } from "settings";

import { isReaction, isReactionCreatedBy, Reaction } from "types/reactions";

import { WithId, withId } from "utils/id";
import { isTruthy } from "utils/types";

export type ReactionsById = Partial<Record<string, WithId<Reaction>>>;

export interface ReactionsContextState {
  reactionsById: ReactionsById;
  reactions: Reaction[];
}

const ReactionsContext = createContext<ReactionsContextState | undefined>(
  undefined
);

export interface ReactionsProviderProps {
  venueId?: string;
  withPastReactions?: boolean;
}

export const ReactionsProvider: React.FC<ReactionsProviderProps> = ({
  venueId,
  withPastReactions = false,
  children,
}) => {
  const [
    reactionsMap,
    { set: setReaction, remove: removeReaction },
  ] = useMap<ReactionsById>({});

  useEffect(() => {
    if (!venueId) return;

    const reactionsCollectionRef = firebase
      .firestore()
      .collection("experiences")
      .doc(venueId)
      .collection("reactions");

    const reactionsQuery = withPastReactions
      ? reactionsCollectionRef
      : reactionsCollectionRef.where("created_at", ">", Date.now());

    const unsubscribeListener = reactionsQuery.onSnapshot((snapshot) => {
      // @debt Should we keep track of the returned timeoutIDs and call clearTimeout() in this hooks cleanup?
      snapshot.docChanges().map((change) => {
        const docId = change.doc.id;
        const docData = change.doc.data();

        if (change.type !== "added" || !isReaction(docData)) return undefined;

        setReaction(docId, withId(docData, docId));

        return setTimeout(() => {
          removeReaction(docId);
        }, REACTION_TIMEOUT);
      });
    });

    return () => {
      unsubscribeListener();
    };
  }, [venueId, withPastReactions, setReaction, removeReaction]);

  const reactionsState: ReactionsContextState = useMemo(
    () => ({
      reactionsById: reactionsMap,
      reactions: Object.values(reactionsMap).filter(isTruthy),
    }),
    [reactionsMap]
  );

  return (
    <ReactionsContext.Provider value={reactionsState}>
      {children}
    </ReactionsContext.Provider>
  );
};

export const useReactionsContext = (): ReactionsContextState => {
  const reactionsState = useContext(ReactionsContext);

  if (!reactionsState) {
    throw new Error(
      "<ReactionsProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return reactionsState;
};

interface UseReactionsOptions {
  userId?: string;
}

export const useReactions: (options: UseReactionsOptions) => Reaction[] = ({
  userId,
}) => {
  const { reactions } = useReactionsContext();

  return useMemo(() => {
    if (!userId) return reactions;

    return reactions.filter(isReactionCreatedBy(userId));
  }, [userId, reactions]);
};
