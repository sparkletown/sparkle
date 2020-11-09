import { FieldError } from "react-hook-form";

export interface ImageInputProps {
  onChange: (url: string) => void;
  name: string;
  customClass?: string;
  imgUrl?: string;
  error?: FieldError;
  small?: boolean;
  forwardRef: any;
}
