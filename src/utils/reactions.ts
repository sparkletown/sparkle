import {
  EmojiReactionsMap,
  EmojiReactionType,
  isEmojiReaction,
  Reaction,
  ReactionData,
  TextReactionType,
} from "types/reactions";
import { User } from "types/User";

import { WithId } from "utils/id";

export type CreateReactionReactionProps =
  | { reaction: EmojiReactionType }
  | { reaction: TextReactionType; text: string };

export const createEmojiReaction = (
  emojiReaction: EmojiReactionType,
  user: WithId<User>
): Reaction => createReaction({ reaction: emojiReaction }, user);

export const createTextReaction = (
  text: string,
  user: WithId<User>
): Reaction => createReaction({ reaction: TextReactionType, text }, user);

export const createReaction = (
  reaction: CreateReactionReactionProps,
  user: WithId<User>
): Reaction => ({
  created_at: Date.now(),
  created_by: user.id,
  ...reaction,
});

export const uniqueEmojiReactionsDataMapReducer = (
  emojiReactionsDataMap: Map<
    EmojiReactionType,
    ReactionData<EmojiReactionType>
  >,
  reaction: Reaction
): Map<EmojiReactionType, ReactionData<EmojiReactionType>> => {
  if (
    isEmojiReaction(reaction) &&
    !emojiReactionsDataMap.has(reaction.reaction)
  ) {
    const emojiReactionData = EmojiReactionsMap.get(reaction.reaction);

    if (emojiReactionData !== undefined) {
      emojiReactionsDataMap.set(reaction.reaction, emojiReactionData);
    }
  }

  return emojiReactionsDataMap;
};
