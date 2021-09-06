import React, { lazy, Suspense } from "react";

import { tracePromise } from "utils/performance";

const RenderMarkdownInner = lazy(() =>
  tracePromise("RenderMarkdown::lazy-import::RenderMarkdownInner", () =>
    import("./RenderMarkdownInner").then(({ RenderMarkdownInner }) => ({
      default: RenderMarkdownInner,
    }))
  )
);

export interface RenderMarkdownProps {
  text?: string;
  components?: object;
  allowBasicFormatting?: boolean;
  allowPreAndCode?: boolean;
  allowHeadings?: boolean;
  allowLinks?: boolean;
  allowImages?: boolean;
  allowLists?: boolean;
}

const _RenderMarkdown: React.FC<RenderMarkdownProps> = ({
  text,
  components,
  allowBasicFormatting = true,
  allowPreAndCode = true,
  allowHeadings = true,
  allowLinks = true,
  allowImages = true,
  allowLists = true,
}) => (
  <Suspense fallback={<div>{text}</div>}>
    <RenderMarkdownInner
      components={components}
      text={text}
      {...{
        allowBasicFormatting,
        allowPreAndCode,
        allowHeadings,
        allowLinks,
        allowImages,
        allowLists,
      }}
    />
  </Suspense>
);

export const RenderMarkdown = React.memo(_RenderMarkdown);
