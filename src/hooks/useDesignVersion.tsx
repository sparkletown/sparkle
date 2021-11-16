import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

import { ReactHook } from "types/utility";

export enum DesignVersion {
  original = "original",
  disco = "disco",
}

const COOKIE_NAME = "design-version";

const getVersionFromCookie = () =>
  Cookies.get(COOKIE_NAME) || DesignVersion.original;

const setVersionInCookie = (designVersion: DesignVersion) =>
  Cookies.set(COOKIE_NAME, designVersion);

export const DesignVersionContext = createContext(getVersionFromCookie());

export const useDesignVersion: ReactHook<void, DesignVersion> = () => {
  return useContext(DesignVersionContext) as DesignVersion;
};

const KEY_UP_ARROW = "ArrowUp";
const KEY_DOWN_ARROW = "ArrowDown";
const KEY_LEFT_ARROW = "ArrowLeft";
const KEY_RIGHT_ARROW = "ArrowRight";

const CHEAT_CODE = [
  KEY_UP_ARROW,
  KEY_DOWN_ARROW,
  KEY_LEFT_ARROW,
  KEY_RIGHT_ARROW,
];

const keysPressed: string[] = [];

const attachListener = (toggleDesignVersion: () => void) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const keyHandler = (ev: KeyboardEvent) => {
      console.log(ev);
      keysPressed.push(ev.key);
      if (keysPressed.length > CHEAT_CODE.length) {
        keysPressed.shift();
      }

      if (JSON.stringify(keysPressed) === JSON.stringify(CHEAT_CODE)) {
        toggleDesignVersion();
      }
    };

    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
};

export const DesignVersionProvider: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [designVersion, setCurrentVersion] = useState(getVersionFromCookie());

  const toggleDesignVersion = () => {
    const currentVersion = getVersionFromCookie();
    const desiredVersion =
      currentVersion === DesignVersion.original
        ? DesignVersion.disco
        : DesignVersion.original;
    setCurrentVersion(desiredVersion);
    setVersionInCookie(desiredVersion);
  };

  attachListener(toggleDesignVersion);

  return (
    <DesignVersionContext.Provider value={designVersion}>
      {children}
    </DesignVersionContext.Provider>
  );
};
