import Resizer from "react-image-file-resizer";

import {
  FIREBASE_STORAGE_IMAGES_IMGIX_URL,
  FIREBASE_STORAGE_IMAGES_ORIGIN,
} from "settings";

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
