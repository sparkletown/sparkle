import { DEFAULT_MAP_BACKGROUND } from "settings";

import { useCheckImage } from "hooks/useCheckImage";

export const useMapBackground = (
  mapBackgroundUrl: string | undefined
): [string, boolean] => {
  const { isValid } = useCheckImage(mapBackgroundUrl ?? "");

  return [
    isValid
      ? mapBackgroundUrl ?? DEFAULT_MAP_BACKGROUND
      : DEFAULT_MAP_BACKGROUND,
    isValid,
  ];
};
