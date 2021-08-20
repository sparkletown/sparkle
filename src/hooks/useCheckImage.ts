import { useMemo } from "react";
import { useAsync } from "react-use";

export const useCheckImage = (
  src: string | undefined
): {
  isValid: boolean;
  isLoading: boolean;
  error: string | undefined;
} => {
  const { loading, error } = useAsync(async () => {
    const checkImage = new Image();
    if (!src) throw Error("src is not defined.");
    checkImage.src = src;

    await checkImage.decode();
  }, [src]);

  return useMemo(
    () => ({
      //here we consider the image valid event while it still loading
      isValid: !error,
      isLoading: loading,
      error: error?.message,
    }),
    [error, loading]
  );
};

export const useCheckImageWithFallback = (
  src: string | undefined,
  fallbackSrc: string
): [string | undefined, ReturnType<typeof useCheckImage>] => {
  const checkImageState = useCheckImage(src);

  const processedSrc = checkImageState.isValid
    ? src ?? fallbackSrc
    : fallbackSrc;

  return [processedSrc, checkImageState];
};
