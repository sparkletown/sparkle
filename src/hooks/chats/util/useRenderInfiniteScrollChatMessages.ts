import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrevious } from "react-use";

import { CHATBOX_NEXT_RENDER_SIZE } from "settings";

import { ChatMessage, InfiniteChatActions, MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

export const useRenderInfiniteScrollChatMessages = <T extends ChatMessage>(
  messages: WithId<MessageToDisplay<T>>[]
): [WithId<MessageToDisplay<T>>[], InfiniteChatActions] => {
  const getNextMessagesRenderCount = useCallback(
    (currentCount: number) =>
      Math.min(currentCount + CHATBOX_NEXT_RENDER_SIZE, messages.length),
    [messages.length]
  );

  const [renderedMessagesCount, setRenderedMessagesCount] = useState(
    getNextMessagesRenderCount(0)
  );

  const increaseRenderedMessagesCount = useCallback(() => {
    setRenderedMessagesCount(getNextMessagesRenderCount(renderedMessagesCount));
  }, [getNextMessagesRenderCount, renderedMessagesCount]);

  const messagesToRender = messages.slice(0, renderedMessagesCount);

  const prevLength = usePrevious(messages.length);
  useEffect(() => {
    if (prevLength === 0 && messages.length > 0)
      increaseRenderedMessagesCount();
  }, [increaseRenderedMessagesCount, messages.length, prevLength]);

  const actions: InfiniteChatActions = useMemo(
    () => ({
      loadMore: increaseRenderedMessagesCount,
      allMessagesCount: messages.length,
    }),
    [increaseRenderedMessagesCount, messages.length]
  );

  return [messagesToRender, actions];
};
