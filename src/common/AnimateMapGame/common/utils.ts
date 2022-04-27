import React from "react";

import { DEFAULT_AVATAR_LIST, DEFAULT_PARTY_NAME } from "./GameSettings";
import { User, UserInfo } from "./User";

// @see https://crypto.stackexchange.com/questions/8533/why-are-bitwise-rotations-used-in-cryptography/8534#8534
const DIFFUSION_PRIME = 31;

type DetermineAvatarOptions = {
  avatars?: string[];
  email?: string;
  index?: number;
  partyName?: string;
  pictureUrl?: string;
  userInfo?: UserInfo;
  user?: User;
};

type DetermineAvatarResult = {
  src: string;
  onError: React.ReactEventHandler<HTMLImageElement>;
};

type DetermineAvatar = (
  options?: DetermineAvatarOptions
) => DetermineAvatarResult;

export const determineAvatar: DetermineAvatar = (options) => {
  const { avatars, pictureUrl, user, index } = options ?? {};
  const list = avatars ?? DEFAULT_AVATAR_LIST;
  const url = pictureUrl || user?.pictureUrl || "";
  const onError = makeProfileImageLoadErrorHandler(generateFallback(options));

  if (isDefined(index) && Number.isSafeInteger(index) && index >= 0) {
    return { src: list[index % list.length], onError };
  }

  return { src: url, onError };
};

type GenerateFallback = (options?: DetermineAvatarOptions) => string;

export const generateFallback: GenerateFallback = (options) => {
  const { avatars, email, partyName, user, userInfo } = options ?? {};
  const list = avatars ?? DEFAULT_AVATAR_LIST;

  // few fallbacks from most stable value to least
  // just in case callers have different access to user data
  const seed =
    email ??
    userInfo?.email ??
    partyName ??
    user?.partyName ??
    DEFAULT_PARTY_NAME ??
    "";

  // generate a single number as a hash from the given seed
  const hash = Array.from(seed)
    .map((c) => c.codePointAt(0) ?? 0)
    .reduce((hash, code) => hash * DIFFUSION_PRIME + code, 0);

  return list[hash % list.length];
};

const makeProfileImageLoadErrorHandler = (
  src: string
): React.ReactEventHandler<HTMLImageElement> => ({ currentTarget }) => {
  // @debt if our fallback image does not exist either we can report that to Bugsnag
  currentTarget.onerror = null; // prevents looping
  currentTarget.src = src;
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max + 1));
};

export const isDefined = <T>(
  value: T | null | undefined
): value is NonNullable<T> => value !== null && value !== undefined;

const convertStringToInt = (hash: string) => {
  const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const radix = alphabet.length;

  let result = 0;
  for (let i = 0, pow = hash.length - 1; i < hash.length; i++, pow--) {
    result += alphabet.indexOf(hash[i]) * Math.pow(radix, pow);
  }
  return result;
};

export const getIntByHash = (hash: string, complexity = 30) => {
  const max = Math.floor(256 / complexity);

  let result = 0;
  let i = 0;
  while (i < hash.length) {
    let str = "";
    for (let j = 0; j < max && i < hash.length; j++, i++) {
      str += hash[i];
    }
    result += convertStringToInt(str);
  }
  return result;
};
