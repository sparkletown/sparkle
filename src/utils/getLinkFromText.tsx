import React from "react";

export const getLinkFromText = (text: string) => {
  const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const newText = text.split(" ");
  return (
    <>
      {newText.map((word) => {
        if (new RegExp(urlRegex).test(word)) return <a href={word}>{word}</a>;
        else return word;
      })}
    </>
  );
};
