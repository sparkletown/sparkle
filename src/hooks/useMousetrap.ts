import { MutableRefObject, useEffect, useState } from "react";
import Mousetrap, { ExtendedKeyboardEvent } from "mousetrap";

import { ReactHook } from "types/utility";

export type MousetrapCallbackWithTwoArgs = (
  e: ExtendedKeyboardEvent,
  combo: string
) => unknown;
export type MousetrapCallbackWithOneArg = (e: ExtendedKeyboardEvent) => unknown;
export type MousetrapCallbackWithNoArgs = () => unknown;

export type MousetrapCallback =
  | MousetrapCallbackWithTwoArgs
  | MousetrapCallbackWithOneArg
  | MousetrapCallbackWithNoArgs;

export interface MousetrapBaseProps {
  keys: string | string[];
  callback: MousetrapCallback;
  action?: "keyup" | "keydown" | "keypress";
}

export type MousetrapWithoutGlobalBind = MousetrapBaseProps & {
  /** @default false **/
  withGlobalBind?: false;
  bindRef: MutableRefObject<HTMLElement>;
};

export type MousetrapWithGlobalBind = MousetrapBaseProps & {
  withGlobalBind: true;
};

export type UseMousetrapProps =
  | MousetrapWithoutGlobalBind
  | MousetrapWithGlobalBind;

/**
 * React hook to efficiently bind keyboard shortcuts to callbacks.
 *
 * Note: if the reference to your callback function changes, shortcuts will re-bind.
 * To avoid this, make sure you wrap your callback functions with useCallback() or similar.
 *
 * @param keys {string|string[]} The keyboard keys to respond to
 * @param callback The callback function to be called when keys are pressed
 * @param action Specify the type of keyboard action (keyup, keydown, keypress) to respond to
 * @param withGlobalBind When this is true, keyboard shortcuts will respond globally within the application
 * @param bindRef Specify a HTMLElement ref to restrict keyboard shortcuts within (only when withGlobalBind = false)
 *
 * @see https://craig.is/killing/mice
 */
export const useMousetrap: ReactHook<UseMousetrapProps, void> = ({
  keys,
  callback,
  action,
  withGlobalBind = false,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  bindRef,
}) => {
  const [boundElement, setBoundElement] = useState<HTMLElement | undefined>(
    bindRef
  );

  // Update our boundElement if it ever changes so we trigger useEffect to re-subscribe
  if (bindRef !== boundElement) {
    setBoundElement(bindRef);
  }

  useEffect(() => {
    if (withGlobalBind && boundElement !== undefined) {
      throw new Error(
        `useMousetrap: withGlobalBind = ${withGlobalBind} but boundElement = ${boundElement} (TypeScript shouldn't have allowed this)`
      );
    }

    // We shouldn't need to check boundElement here because of the above check, but this helps TypeScript believe us
    const _mousetrap =
      withGlobalBind && boundElement ? Mousetrap(boundElement) : Mousetrap;

    _mousetrap.bind(keys, callback, action);

    // Cleanup after ourselves
    return () => {
      _mousetrap.unbind(keys);
    };
  }, [keys, callback, action, withGlobalBind, boundElement]);
};
