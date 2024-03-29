import { useEffect, useRef } from "react";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

/**
 * Resolves a bug in 'react-infinite-scroll-component' when
 * 'next' function is not being called when height of initially loaded items is less than container's height.
 * https://github.com/ankeetmaini/react-infinite-scroll-component/issues/217
 */
export const useTriggerScrollFix = (messages: WithId<MessageToDisplay>[]) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.dispatchEvent(new CustomEvent("scroll"));
  }, [messages.length, ref]);

  return ref;
};
