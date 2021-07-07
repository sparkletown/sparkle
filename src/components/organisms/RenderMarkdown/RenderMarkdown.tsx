import React, { Suspense, lazy } from "react";

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
  allowBasicFormatting?: boolean;
  allowPreAndCode?: boolean;
  allowHeadings?: boolean;
  allowLinks?: boolean;
  allowImages?: boolean;
  allowLists?: boolean;
}

const _RenderMarkdown: React.FC<RenderMarkdownProps> = ({
  text,
  allowBasicFormatting = true,
  allowPreAndCode = true,
  allowHeadings = true,
  allowLinks = true,
  allowImages = true,
  allowLists = true,
}) => (
  <Suspense fallback={<div>{text}</div>}>
    <RenderMarkdownInner
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
