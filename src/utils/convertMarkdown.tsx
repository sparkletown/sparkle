import React from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import sanitize from "rehype-sanitize";

export const convertMarkdown = (text: string) => {
  return (
    <ReactMarkdown
      linkTarget={"_blank"}
      remarkPlugins={[[glm]]}
      rehypePlugins={[[sanitize]]}
    >
      {text}
    </ReactMarkdown>
  );
};
