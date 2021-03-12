import { CustomLoader, isCustomLoader } from "types/CustomLoader";

export enum StorageKeys {
  customLoaders = "customLoaders",
}

const JSON_STRINGIFIED_ARRAY = "[]";

export const accessTokenKey = (venueId: string) => `token-${venueId}`;

export const setLocalStorageToken = (venueId: string, token: string) =>
  localStorage.setItem(accessTokenKey(venueId), token);

export const getLocalStorageToken = (venueId: string) =>
  localStorage.getItem(accessTokenKey(venueId));

export const removeLocalStorageToken = (venueId: string) =>
  localStorage.removeItem(accessTokenKey(venueId));

export const storeCustomLoaders = (customLoaders: CustomLoader[]) =>
  sessionStorage.setItem(
    StorageKeys.customLoaders,
    JSON.stringify(customLoaders)
  );

export const retrieveCustomLoaders = (): CustomLoader[] => {
  const customLoadersJson =
    sessionStorage.getItem(StorageKeys.customLoaders) ?? JSON_STRINGIFIED_ARRAY;

  try {
    const customLoaders = JSON.parse(customLoadersJson);

    if (Array.isArray(customLoaders)) {
      return customLoaders.filter(isCustomLoader);
    }
  } catch {
    return [];
  }

  return [];
};
