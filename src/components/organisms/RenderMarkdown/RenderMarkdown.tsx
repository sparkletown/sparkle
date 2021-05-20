import React, { Fragment } from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import sanitize from "rehype-sanitize";

export const RenderMarkdown = (
  text?: string,
  options?: { allowImages?: boolean; allowP?: boolean }
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
      components={
        options?.allowP
          ? {}
          : {
              p: Fragment,
              h1: Fragment,
              h2: Fragment,
              h3: Fragment,
              h4: Fragment,
              h5: Fragment,
              h6: Fragment,
              pre: Fragment,
            }
      }
    >
      {text}
    </ReactMarkdown>
  );
};
