import React from "react";
import Resizer from "react-image-file-resizer";

import {
  DEFAULT_AVATAR_LIST,
  DEFAULT_PARTY_NAME,
  FIREBASE_STORAGE_IMAGES_IMGIX_URL,
  FIREBASE_STORAGE_IMAGES_ORIGIN,
} from "settings";

import { FireAuthUser } from "types/fire";
import { User } from "types/User";

import { isDefined } from "utils/types";

// See https://docs.imgix.com/apis/rendering/size
export interface ImageResizeOptions {
  width?: number;
  height?: number;
  fit?: "crop";
}

export const resizeFile = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      150,
      150,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri as Blob);
      },
      "blob"
    );
  });
};

/**
 * Generates a resized image URL.
 * This function does not guarantee a resized image. In some cases the original URL may be returned.
 */
export const getResizedImage = (
  originBasePath: string,
  imgixBasePath: string,
  url: string,
  options: ImageResizeOptions
): string => {
  if (originBasePath && imgixBasePath && url.startsWith(originBasePath)) {
    const newUrl = url.replace(originBasePath, imgixBasePath);

    const urlObject = new URL(newUrl);
    if (options.width)
      urlObject.searchParams.set("w", options.width.toString());
    if (options.height)
      urlObject.searchParams.set("h", options.height.toString());
    if (options.fit) urlObject.searchParams.set("fit", options.fit);
    return urlObject.toString();
  }

  return url;
};

/**
 * Like getResizedImage, but specific to any upload to the default Firebase storage bucket
 */
export const getFirebaseStorageResizedImage = (
  url: string,
  options: ImageResizeOptions
): string =>
  getResizedImage(
    FIREBASE_STORAGE_IMAGES_ORIGIN,
    FIREBASE_STORAGE_IMAGES_IMGIX_URL,
    url,
    options
  );

// @see https://crypto.stackexchange.com/questions/8533/why-are-bitwise-rotations-used-in-cryptography/8534#8534
const DIFFUSION_PRIME = 31;

type DetermineAvatarOptions = {
  avatars?: string[];
  email?: string;
  index?: number;
  partyName?: string;
  pictureUrl?: string;
  userInfo?: FireAuthUser;
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
