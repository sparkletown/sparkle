import { CSSProperties } from "react";

export interface ButtonProps {
  customClass?: string;
  loading?: boolean;
  onClick?: () => {};
  text: string;
  customStyle?: CSSProperties;
  type?: "button" | "reset" | "submit";
}
