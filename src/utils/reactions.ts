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

export type TextReactionType = "messageToTheBand";

export type ReactionType = EmojiReactionType | TextReactionType;

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
    name: "wolf",
    text: ReactionsTextMap[EmojiReactionType.wolf],
    type: EmojiReactionType.wolf,
    ariaLabel: "wolf-emoji",
    audioPath: "/sounds/wolf.mp3",
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
  {
    name: "burn",
    text: ReactionsTextMap[EmojiReactionType.burn],
    type: EmojiReactionType.burn,
    ariaLabel: "burn-emoji",
    audioPath: "/sounds/burn.mpeg",
  },
  {
    name: "sparkle",
    text: ReactionsTextMap[EmojiReactionType.sparkle],
    type: EmojiReactionType.sparkle,
    ariaLabel: "sparkle-emoji",
    audioPath: "/sounds/sparkle.mpeg",
  },
];

interface BaseReaction {
  created_at: number;
  created_by: string;
}

export interface EmojiReaction extends BaseReaction {
  reaction: EmojiReactionType;
}
export interface MessageToTheBandReaction extends BaseReaction {
  reaction: TextReactionType;
  text: string;
}

export type Reaction = EmojiReaction | MessageToTheBandReaction;
