import React from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import externalLinks from "remark-external-links";
import sanitize from "rehype-sanitize";

export const convertMarkdown = (text: string | undefined) => {
  if (!text) return;
  return text.split("\\n").map((word, index) => {
    return (
      <ReactMarkdown
        linkTarget={"_blank"}
        remarkPlugins={[[glm], [emoji], [externalLinks]]}
        rehypePlugins={[[sanitize]]}
        key={index}
      >
        {word}
      </ReactMarkdown>
    );
  });
};
