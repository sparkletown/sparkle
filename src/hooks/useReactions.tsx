import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFirebase } from "react-redux-firebase";
import { useMap } from "react-use";

import { REACTION_TIMEOUT } from "settings";

import { isReaction, isReactionCreatedBy, Reaction } from "types/reactions";
import { ReactHook } from "types/utility";

import { isTruthyFilter } from "utils/filter";
import { withId, WithId } from "utils/id";

export interface ReactionsProviderProps {
  venueId?: string;
  withPastReactions?: boolean;
}

export type ReactionsById = Partial<Record<string, WithId<Reaction>>>;

export interface ReactionsState {
  reactionsById: ReactionsById;
  reactions: Reaction[];
}

const ReactionsContext = createContext<ReactionsState | undefined>(undefined);

export const ReactionsProvider: React.FC<ReactionsProviderProps> = ({
  venueId,
  withPastReactions = false,
  children,
}) => {
  const [
    reactionsMap,
    { set: setReaction, remove: removeReaction },
  ] = useMap<ReactionsById>({});

  const firebase = useFirebase();

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
  }, [firebase, venueId, withPastReactions, setReaction, removeReaction]);

  const reactionsState: ReactionsState = useMemo(
    () => ({
      reactionsById: reactionsMap,
      reactions: Object.values(reactionsMap).filter(isTruthyFilter),
    }),
    [reactionsMap]
  );

  return (
    <ReactionsContext.Provider value={reactionsState}>
      {children}
    </ReactionsContext.Provider>
  );
};

export const useReactionsContext = (): ReactionsState => {
  const reactionsState = useContext(ReactionsContext);

  if (!reactionsState) {
    throw new Error(
      "<ReactionsProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return reactionsState;
};

export interface UseReactionsProps {
  userId?: string;
}

export const useReactions: ReactHook<UseReactionsProps, Reaction[]> = ({
  userId,
}) => {
  const { reactions } = useReactionsContext();

  return useMemo(() => {
    if (!userId) return reactions;

    return reactions.filter(isReactionCreatedBy(userId));
  }, [userId, reactions]);
};

export interface UseReactionsLegacyProps {
  venueId?: string;
  userId?: string;
}

// @debt refactor this to use useConnect like in src/components/templates/ReactionPage/ReactionPage.tsx ?
export const useReactionsLegacy = ({
  venueId,
  userId,
}: UseReactionsLegacyProps) => {
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
