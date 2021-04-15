import { ChatMessage } from "types/chat";

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
export type TextReactionType = typeof TextReactionType;

export type ReactionType = EmojiReactionType | TextReactionType;

interface BaseReaction {
  created_at: number;
  created_by: string;
}

export interface EmojiReaction extends BaseReaction {
  reaction: EmojiReactionType;
}

export interface TextReaction extends BaseReaction {
  reaction: TextReactionType;
  text: string;
}

export type Reaction = EmojiReaction | TextReaction;
export const ReactionsTextMap = {
  [EmojiReactionType.heart]: "❤️",
  [EmojiReactionType.clap]: "👏",
  [EmojiReactionType.wolf]: "🐺",
  [EmojiReactionType.laugh]: "😂",
  [EmojiReactionType.thatsjazz]: "🎹",
  [EmojiReactionType.boo]: "👻",
  [EmojiReactionType.burn]: "🔥",
  [EmojiReactionType.sparkle]: "✨",
};

export const AllReactions: ReactionData[] = [
  {
    type: EmojiReactionType.heart,
    name: "heart",
    text: ReactionsTextMap[EmojiReactionType.heart],
    ariaLabel: "heart-emoji",
    audioPath: "/sounds/woo.mp3",
  },
  {
    type: EmojiReactionType.clap,
    name: "clap",
    text: ReactionsTextMap[EmojiReactionType.clap],
    ariaLabel: "clap-emoji",
    audioPath: "/sounds/clap.mp3",
  },
  {
    type: EmojiReactionType.wolf,
    name: "wolf",
    text: ReactionsTextMap[EmojiReactionType.wolf],
    ariaLabel: "wolf-emoji",
    audioPath: "/sounds/wolf.mp3",
  },
  {
    type: EmojiReactionType.laugh,
    name: "laugh",
    text: ReactionsTextMap[EmojiReactionType.laugh],
    ariaLabel: "laugh-emoji",
    audioPath: "/sounds/laugh.mp3",
  },
  {
    type: EmojiReactionType.thatsjazz,
    name: "thatsjazz",
    text: ReactionsTextMap[EmojiReactionType.thatsjazz],
    ariaLabel: "piano-emoji",
    audioPath: "/sounds/thatsjazz.mp3",
  },
  {
    type: EmojiReactionType.boo,
    name: "boo",
    text: ReactionsTextMap[EmojiReactionType.boo],
    ariaLabel: "boo-emoji",
    audioPath: "/sounds/boo.mp3",
  },
  {
    type: EmojiReactionType.burn,
    name: "burn",
    text: ReactionsTextMap[EmojiReactionType.burn],
    ariaLabel: "burn-emoji",
    audioPath: "/sounds/burn.mpeg",
  },
  {
    type: EmojiReactionType.sparkle,
    name: "sparkle",
    text: ReactionsTextMap[EmojiReactionType.sparkle],
    ariaLabel: "sparkle-emoji",
    audioPath: "/sounds/sparkle.mpeg",
  },
];

export const isReactionCreatedBy = (userId: string) => (reaction: Reaction) =>
  reaction.created_by === userId;

export const isTextReaction = (r: Reaction): r is TextReaction =>
  r.reaction === TextReactionType;

export const chatMessageAsTextReaction = (chat: ChatMessage): TextReaction => ({
  created_at: chat.ts_utc.toMillis() / 1000,
  created_by: chat.from,
  reaction: TextReactionType,
  text: chat.text,
});
