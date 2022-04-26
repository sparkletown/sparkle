/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export const KEYS = {
  ESCAPE_KEY: "Escape",
};

export const useKeyboardKeys = ({
  handleKeyPress,
}: {
  handleKeyPress: (e: any) => void;
}) => {
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};
