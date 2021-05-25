import React from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import sanitize from "rehype-sanitize";

export const RenderMarkdown = (
  text?: string,
  options?: { allowImages?: boolean }
) => {
  if (!text) return;
  const disallowed: Array<string> = [];
  if (options?.allowImages === false) disallowed.push("img");
  return (
    <ReactMarkdown
      linkTarget={"_blank"}
      remarkPlugins={[[glm], [emoji], [externalLinks]]}
      rehypePlugins={[[sanitize]]}
      disallowedElements={disallowed}
    >
      {text}
    </ReactMarkdown>
  );
};
