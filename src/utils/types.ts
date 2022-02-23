export const isTruthy = <T>(item: T): item is NonNullable<T> => !!item;

export const isDefined = <T>(
  value: T | null | undefined
): value is NonNullable<T> => value !== null && value !== undefined;

export const arrayIncludes = <T>(arr?: T[], element?: T | null): boolean => {
  if (!isDefined(element) || !isDefined(arr)) return false;

  return arr.includes(element);
};

export const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??[-+=&;%@.\w_]*#?[.!/\\\w]*)?)/;

/*
 * Type branding can be very useful to differentiate between properties that
 * are easily interchanged by accident, e.g a world slug and a space slug.
 * Treating them as plain strings makes it far too easy to get ordering wrong
 * and introduce a bug that isn't picked up quickly.
 *
 * This adds no overhead at runtime.
 *
 * For more info, see this post here: https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
 */
export type Branded<K, T extends string> = K & { __brand: T };
