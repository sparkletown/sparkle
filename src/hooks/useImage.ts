import { useEffect, useRef, useState } from "react";

import { ReactHook, TFuncOrT } from "types/utility";

export interface UseImageProps {
  src?: string;
  fallbackSrc: TFuncOrT<string>;
}

export interface UseImageReturn {
  isLoading: boolean;
  isError: boolean;
  error?: string;
  loadedImageUrl?: string;
  originalSrc?: string;
}

const wrapWithFunc = (value: TFuncOrT<string>): (() => string) =>
  typeof value === "function" ? value : () => value;

/**
 * Check that we can load the provided image URL, and use a fallback if not.
 *
 * @param src The url of the image to be loaded.
 * @param fallbackSrc The url of a fallback image to load if the original image load fails.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode
 *
 * @debt Using this function can cause us to try and fetch the image from the server twice
 *   which is particularly bad when we aren't caching images
 */
export const useImage: ReactHook<UseImageProps, UseImageReturn> = ({
  src,
  fallbackSrc,
}) => {
  const [loadedImageUrl, setloadedImageUrl] = useState<string>();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fallbackSrcRef = useRef<() => string>(wrapWithFunc(fallbackSrc));
  useEffect(() => {
    fallbackSrcRef.current = wrapWithFunc(fallbackSrc);
  }, [fallbackSrc]);

  useEffect(() => {
    if (src === undefined) {
      setloadedImageUrl(fallbackSrcRef.current());
      return;
    }

    const checkImage = new Image();
    checkImage.src = src;

    setLoading(true);
    checkImage
      .decode()
      .then(() => {
        setloadedImageUrl(src);
        setLoading(false);
      })
      .catch((err) => {
        setloadedImageUrl(fallbackSrcRef.current());
        setError(err.message);
        setLoading(false);
      });
  }, [src]);

  return {
    isLoading,
    isError: !!error,
    error,
    loadedImageUrl,
    originalSrc: src,
  };
};
