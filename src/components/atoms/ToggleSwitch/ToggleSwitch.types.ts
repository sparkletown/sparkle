export interface SwitchProps {
  name: string;
  forwardRef?: (
    value: React.RefObject<HTMLInputElement> | HTMLInputElement | null
  ) => void;
  isChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  withText?: boolean;
  isLarge?: boolean;
}
