export interface SwitchProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forwardRef?: any;
  isChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  withText?: boolean;
  isLarge?: boolean;
}
