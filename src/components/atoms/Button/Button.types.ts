import { CSSProperties } from "react";

type ButtonAsLink = {
  isLink: true;
  linkTo: string;
};

type NotLink = {
  isLink?: false;
  linkTo?: never;
};

type LinkProps = ButtonAsLink | NotLink;

export type ButtonProps = LinkProps & {
  customClass?: string;
  customStyle?: CSSProperties;
  gradient?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
};
