import { CSSProperties } from "react";

export interface ButtonProps {
  customClass?: string;
  loading?: boolean;
  onClick?: () => void;
  text?: string;
  customStyle?: CSSProperties;
  gradient?: boolean;
  type?: "button" | "reset" | "submit";
}
