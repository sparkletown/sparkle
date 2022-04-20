import { useMemo } from "react";
import { useAsync } from "react-use";

import { ImageCheck } from "hooks/image/ImageCheck";

type UseCheckImage = (src: string | undefined | null) => ImageCheck;

export const useCheckImage: UseCheckImage = (src) => {
  const { loading, error, value } = useAsync(async () => {
    if (!src) throw Error("src is not defined.");

    const checkImage = new Image();
    checkImage.src = src;
    await checkImage.decode();

    return {
      width: checkImage.naturalWidth,
      height: checkImage.naturalHeight,
    };
  }, [src]);

  return useMemo(
    () => ({
      // we consider the image valid while it's still loading
      isValid: !error,
      isLoading: loading,
      isLoaded: !loading,
      error,
      width: value?.width,
      height: value?.height,
    }),
    [error, loading, value]
  );
};
