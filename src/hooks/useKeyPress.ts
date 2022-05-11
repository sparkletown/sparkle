import { SyntheticEvent, useCallback } from "react";

export type UseKeyPressOptions = {
  keys: string[];
  onPress: (event: SyntheticEvent) => void;
};

export const useKeyPress = ({ keys, onPress }: UseKeyPressOptions) =>
  useCallback((event) => void (keys.includes(event.code) && onPress(event)), [
    onPress,
    keys,
  ]);
