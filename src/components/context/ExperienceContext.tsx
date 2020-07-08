import React, { useEffect, useState, useCallback } from "react";
import { useFirebase } from "react-redux-firebase";

type ExperienceContextType = {
  reactions: Reaction[];
  addReaction: (newReaction: Reaction) => void;
};

export enum EmojiReactionType {
  heart = "heart",
  clap = "clap",
  laugh = "laugh",
  thatsjazz = "thatsjazz",
  boo = "boo",
}

export type TextReactionType = "messageToTheBand";

export type ReactionType = EmojiReactionType | TextReactionType;

export const ReactionsTextMap = {
  [EmojiReactionType.heart]: "❤️",
  [EmojiReactionType.clap]: "👏",
  [EmojiReactionType.laugh]: "😂",
  [EmojiReactionType.thatsjazz]: "🎹",
  [EmojiReactionType.boo]: "👻",
};

export const Reactions = [
  {
    name: "heart",
    text: ReactionsTextMap[EmojiReactionType.heart],
    type: EmojiReactionType.heart,
    ariaLabel: "heart-emoji",
    audioPath: "/sounds/woo.mp3",
  },
  {
    name: "clap",
    text: ReactionsTextMap[EmojiReactionType.clap],
    type: EmojiReactionType.clap,
    ariaLabel: "clap-emoji",
    audioPath: "/sounds/clap.mp3",
  },
  {
    name: "laugh",
    text: ReactionsTextMap[EmojiReactionType.laugh],
    type: EmojiReactionType.laugh,
    ariaLabel: "laugh-emoji",
    audioPath: "/sounds/laugh.mp3",
  },
  {
    name: "thatsjazz",
    text: ReactionsTextMap[EmojiReactionType.thatsjazz],
    type: EmojiReactionType.thatsjazz,
    ariaLabel: "piano-emoji",
    audioPath: "/sounds/thatsjazz.mp3",
  },
  {
    name: "boo",
    text: ReactionsTextMap[EmojiReactionType.boo],
    type: EmojiReactionType.boo,
    ariaLabel: "boo-emoji",
    audioPath: "/sounds/boo.mp3",
  },
];

export type MessageToTheBandReaction = {
  reaction: TextReactionType;
  text: string;
  created_at: number;
  created_by: string;
};

export const isMessageToTheBand = (
  reaction: Reaction
): reaction is MessageToTheBandReaction => {
  return reaction.reaction === "messageToTheBand";
};

export type Reaction =
  | {
      reaction: EmojiReactionType;
      created_at: number;
      created_by: string;
    }
  | MessageToTheBandReaction;

export const ExperienceContext = React.createContext<
  ExperienceContextType | undefined
>(undefined);

export default ({
  venueName,
  children,
}: {
  venueName: string;
  children: any;
}) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .firestore()
      .collection(`experiences/${venueName}/reactions`)
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
  }, [firebase, setReactions, venueName]);

  const addReaction = useCallback(
    (newReaction: Reaction) => {
      firebase
        .firestore()
        .collection(`experiences/${venueName}/reactions`)
        .add(newReaction);
    },
    [firebase, venueName]
  );

  const store = { reactions, addReaction };

  return (
    <ExperienceContext.Provider value={store}>
      {children}
    </ExperienceContext.Provider>
  );
};
