import React, { useEffect, useRef } from "react";

type AllowedKeys =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowRight"
  | "ArrowLeft"
  | "KeyW"
  | "keyS"
  | "keyA"
  | "keyD";

export const useKeysListeners = () => {
  const { current: keys } = useRef<Record<string, boolean>>({});

  const keysPressed = (e: KeyboardEvent) => {
    keys[e.code] = true;
  };

  const keysReleased = (e: KeyboardEvent) => {
    keys[e.code] = false;
  };

  useEffect(() => {
    window.addEventListener("keydown", keysPressed);
    window.addEventListener("keyup", keysReleased);
  }, []);

  const on = (key: string, callback: () => void) => {
    if (keys[key]) {
      callback();
    }
  };

  return on;
};

// export default class ListenKeys {
//   constructor() {
//     this.keys = {};
//     this.listenKeys();
//   }

//   on(key, callback) {
//     if (this.keys[key]) {
//       callback();
//     } else {
//       return false;
//     }
//   }

//   listenKeys() {
//     const keysPressed = (e) => {
//       this.keys[keysmap[e.keyCode]] = true;
//     };

//     const keysReleased = (e) => {
//       this.keys[keysmap[e.keyCode]] = false;
//     };

//     window.onkeydown = keysPressed;
//     window.onkeyup = keysReleased;
//   }
// }
