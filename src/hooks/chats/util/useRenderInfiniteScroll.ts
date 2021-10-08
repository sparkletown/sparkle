import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrevious } from "react-use";

import { CHATBOX_NEXT_RENDER_SIZE } from "settings";

import { ChatMessage, InfiniteScrollProps, MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

export const useRenderMessagesCount = (): [number, () => void] => {
  const getNextMessagesRenderCount = useCallback(
    (currentCount: number) => currentCount + CHATBOX_NEXT_RENDER_SIZE,
    []
  );

  const [renderedMessagesCount, setRenderedMessagesCount] = useState(
    getNextMessagesRenderCount(0)
  );

  const increaseRenderedMessagesCount = useCallback(() => {
    setRenderedMessagesCount(getNextMessagesRenderCount(renderedMessagesCount));
  }, [getNextMessagesRenderCount, renderedMessagesCount]);

  return [renderedMessagesCount, increaseRenderedMessagesCount];
};

export const useRenderInfiniteScroll = <T extends ChatMessage>(
  messages: WithId<MessageToDisplay<T>>[]
): [WithId<MessageToDisplay<T>>[], InfiniteScrollProps] => {
  const [
    renderedMessagesCount,
    increaseRenderedMessagesCount,
  ] = useRenderMessagesCount();

  const messagesToRender = useMemo(
    () => messages.slice(0, renderedMessagesCount),
    [messages, renderedMessagesCount]
  );

  const prevLength = usePrevious(messages.length);
  useEffect(() => {
    if (prevLength === 0 && messages.length > 0)
      increaseRenderedMessagesCount();
  }, [increaseRenderedMessagesCount, messages.length, prevLength]);

  const infiniteProps: InfiniteScrollProps = useMemo(
    () => ({
      loadMore: increaseRenderedMessagesCount,
      hasMore: renderedMessagesCount < messages.length,
    }),
    [increaseRenderedMessagesCount, messages.length, renderedMessagesCount]
  );

  return [messagesToRender, infiniteProps];
};
