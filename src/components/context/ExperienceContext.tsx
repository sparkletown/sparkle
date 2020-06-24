import React, { useEffect, useState, useCallback } from "react";
import { useFirebase } from "react-redux-firebase";

type ExperienceContextType = {
  reactions: Reaction[];
  addReaction: (newReaction: Reaction) => void;
};

type Reaction = {
  reaction: "heart";
  created_at: number;
  created_by: string;
};

export const ExperienceContext = React.createContext<
  ExperienceContextType | undefined
>(undefined);

export default ({
  experienceName,
  children,
}: {
  experienceName: string;
  children: any;
}) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .firestore()
      .collection(`experiences/${experienceName}/reactions`)
      .where("created_at", ">", new Date().getTime())
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const newReaction = change.doc.data() as Reaction;
            setReactions((prevReactions) => [...prevReactions, newReaction]);
            setTimeout(() => {
              setReactions((prevReactions) => {
                return prevReactions.filter((r) => r !== newReaction);
              });
            }, 2000);
          }
        });
      });
  }, [firebase, setReactions, experienceName]);

  const addReaction = useCallback(
    (newReaction) => {
      firebase
        .firestore()
        .collection(`experiences/${experienceName}/reactions`)
        .add(newReaction);
    },
    [firebase, experienceName]
  );

  const store = { reactions, addReaction };

  return (
    <ExperienceContext.Provider value={store}>
      {children}
    </ExperienceContext.Provider>
  );
};
