import React from "react";

export const getLinkFromText = (text: string) => {
  const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  return text.split(" ").map((word) => {
    if (new RegExp(urlRegex).test(word))
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
        >
          {word}
        </a>
      );
    else return <span>{word}</span>;
  });
};
