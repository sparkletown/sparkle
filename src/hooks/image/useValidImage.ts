import { useMemo } from "react";

import { ImageCheck } from "hooks/image/ImageCheck";
import { useCheckImage } from "hooks/image/useCheckImage";

type UseValidImage = (
  src: string | undefined,
  fallbackIfInvalid: string
) => ImageCheck & {
  src: string | undefined;
};
export const useValidImage: UseValidImage = (src, fallbackIfInvalid) => {
  const checkImageState = useCheckImage(src);
  const processedSrc = checkImageState.isValid ? src : fallbackIfInvalid;

  return useMemo(() => ({ src: processedSrc, ...checkImageState }), [
    processedSrc,
    checkImageState,
  ]);
};
