import { ChatMessage } from "types/chat";
import { isTruthy } from "utils/types";

export enum EmojiReactionType {
  heart = "heart",
  clap = "clap",
  wolf = "wolf",
  laugh = "laugh",
  thatsjazz = "thatsjazz",
  boo = "boo",
  burn = "burn",
  sparkle = "sparkle",
}

export const TextReactionType = "messageToTheBand" as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the type the same as the const
export type TextReactionType = typeof TextReactionType;

export type ReactionType = EmojiReactionType | TextReactionType;

interface BaseReaction {
  created_at: number;
  created_by: string;
  reaction: unknown;
}

export interface EmojiReaction extends BaseReaction {
  reaction: EmojiReactionType;
}

export interface TextReaction extends BaseReaction {
  reaction: TextReactionType;
  text: string;
}

export type Reaction = EmojiReaction | TextReaction;

export type ReactionData<T extends ReactionType = ReactionType> = {
  type: T;
  name: string;
  text: string;
  ariaLabel: string;
  audioPath: string;
};

export const EMOJI_REACTIONS: Readonly<ReactionData<EmojiReactionType>[]> = [
  {
    type: EmojiReactionType.heart,
    name: "heart",
    text: "❤️",
    ariaLabel: "heart-emoji",
    audioPath: "/sounds/woo.mp3",
  },
  {
    type: EmojiReactionType.clap,
    name: "clap",
    text: "👏",
    ariaLabel: "clap-emoji",
    audioPath: "/sounds/clap.mp3",
  },
  {
    type: EmojiReactionType.wolf,
    name: "wolf",
    text: "🐺",
    ariaLabel: "wolf-emoji",
    audioPath: "/sounds/wolf.mp3",
  },
  {
    type: EmojiReactionType.laugh,
    name: "laugh",
    text: "😂",
    ariaLabel: "laugh-emoji",
    audioPath: "/sounds/laugh.mp3",
  },
  {
    type: EmojiReactionType.thatsjazz,
    name: "thatsjazz",
    text: "🎹",
    ariaLabel: "piano-emoji",
    audioPath: "/sounds/thatsjazz.mp3",
  },
  {
    type: EmojiReactionType.boo,
    name: "boo",
    text: "👻",
    ariaLabel: "boo-emoji",
    audioPath: "/sounds/boo.mp3",
  },
  {
    type: EmojiReactionType.burn,
    name: "burn",
    text: "🔥",
    ariaLabel: "burn-emoji",
    audioPath: "/sounds/burn.mpeg",
  },
  {
    type: EmojiReactionType.sparkle,
    name: "sparkle",
    text: "✨",
    ariaLabel: "sparkle-emoji",
    audioPath: "/sounds/sparkle.mp3",
  },
];

export const reactionsDataMapReducer = <T extends ReactionType = ReactionType>(
  acc: Map<T, ReactionData<T>>,
  reactionData: ReactionData<T>
) => acc.set(reactionData.type, reactionData);

export const EmojiReactionsMap: Map<
  EmojiReactionType,
  ReactionData<EmojiReactionType>
> = EMOJI_REACTIONS.reduce(reactionsDataMapReducer, new Map());

export const isReactionCreatedBy = (userId: string) => (reaction: Reaction) =>
  reaction.created_by === userId;

export const isBaseReaction = (r: unknown): r is BaseReaction =>
  typeof r === "object" && isTruthy(r) && r.hasOwnProperty("reaction");

export const isEmojiReaction = (r: unknown): r is EmojiReaction => {
  if (!isBaseReaction(r)) return false;

  return EmojiReactionType[r.reaction as EmojiReactionType] !== undefined;
};

export const isTextReaction = (r: unknown): r is TextReaction => {
  if (!isBaseReaction(r)) return false;

  return r.reaction === TextReactionType;
};

export const isReaction = (r: unknown): r is Reaction =>
  isEmojiReaction(r) || isTextReaction(r);

export const chatMessageAsTextReaction = (
  message: ChatMessage
): TextReaction => ({
  created_at: message.ts_utc.toMillis() / 1000,
  created_by: message.from,
  reaction: TextReactionType,
  text: message.text,
});
