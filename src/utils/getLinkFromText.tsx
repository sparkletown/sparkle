import React from "react";

import { getExtraLinkProps, isExternalUrl } from "./url";

export const getLinkFromText = (text: string) => {
  const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;
  return text.split(" ").map((word, index) => {
    if (new RegExp(urlRegex).test(word)) {
      const extraProps = getExtraLinkProps(isExternalUrl(word));
      return (
        <a
          href={
            word.startsWith("http://") ||
            word.startsWith("https://") ||
            word.startsWith("mailto:") ||
            word.startsWith("/")
              ? word
              : `https://${word}`
          }
          key={index}
          {...extraProps}
        >
          {word}{" "}
        </a>
      );
    } else {
      return <React.Fragment key={index}>{word} </React.Fragment>;
    }
  });
};
