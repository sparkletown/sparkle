import React, { Fragment } from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import sanitize from "rehype-sanitize";

export const convertMarkdown = (
  text: string | undefined,
  options?: { images?: boolean; allowP?: boolean }
) => {
  if (!text) return;
  const disallowed: Array<string> = [];
  if (options?.images === false) disallowed.push("img");
  return text.split("\\n").map((word, index) => {
    return (
      <ReactMarkdown
        linkTarget={"_blank"}
        remarkPlugins={[[glm], [emoji], [externalLinks]]}
        rehypePlugins={[[sanitize]]}
        key={index}
        disallowedElements={disallowed}
        components={options?.allowP ? {} : { p: Fragment }}
      >
        {word}
      </ReactMarkdown>
    );
  });
};
