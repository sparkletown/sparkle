import { SyntheticEvent, useCallback } from "react";

export type UseKeyPressOptions = {
  keys: string[];
  onPress: (event: SyntheticEvent) => void;
};

export const useKeyPress = ({ keys, onPress }: UseKeyPressOptions) =>
  useCallback(
    (event) => {
      console.log(useKeyPress.name, event);
      if (!keys.includes(event.code)) return;
      onPress(event);
    },
    [onPress, keys]
  );
