import { useEffect, useState } from "react";

import { MOVEMENT_INTERVAL } from "./useKeyboardControls";

// TODO: We can probably replace this with the mousetrap library
//   https://craig.is/killing/mice
export const useKeyPress = function (targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(true);
      setTimeout(() => setKeyPressed(false), MOVEMENT_INTERVAL);
    }
  };

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) > -1
      ) {
        e.preventDefault();
      }
      downHandler(e);
    });
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};
