import React, { FC } from "react";
import "./LinkButton.scss";

interface LinkButtonProps {
  href: string;
}

export const LinkButton: FC<LinkButtonProps> = ({ children, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="button-link">
      {children}
    </a>
  );
};
