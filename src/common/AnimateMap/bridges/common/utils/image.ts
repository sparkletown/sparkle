import {
  FIREBASE_STORAGE_IMAGES_IMGIX_URL,
  FIREBASE_STORAGE_IMAGES_ORIGIN,
} from "../DataProviderSettings";

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  fit?: "crop";
}

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
