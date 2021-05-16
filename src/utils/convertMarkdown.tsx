import React from "react";

import ReactMarkdown from "react-markdown";
import glm from "remark-gfm";
import emoji from "remark-emoji";
import sanitize from "rehype-sanitize";

export const convertMarkdown = (text: string) => {
  return (
    <ReactMarkdown
      linkTarget={"_blank"}
      remarkPlugins={[[glm], [emoji]]}
      rehypePlugins={[[sanitize]]}
    >
      {text}
    </ReactMarkdown>
  );
};
