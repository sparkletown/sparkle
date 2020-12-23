export interface SwitchProps {
  name: string;
  forwardRef?: any;
  isChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  withText?: boolean;
  isLarge?: boolean;
}
