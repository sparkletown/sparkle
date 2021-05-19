import React, { FC, DetailedHTMLProps, AnchorHTMLAttributes } from "react";
import "./LinkButton.scss";

export interface LinkButtonProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href: string;
}

export const LinkButton: FC<LinkButtonProps> = ({ children, href }) => (
  <a href={href} target="_blank" rel="noreferrer" className="button-link">
    {children}
  </a>
);
