import React, { useState } from "react";

// Styles
import * as S from "./ToggleSwitch.styles";

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

// @deprecate Use atoms/toggler instead
export const ToggleSwitch: React.FC<SwitchProps> = ({
  name,
  forwardRef,
  isChecked = false,
  onChange,
  withText = false,
  isLarge = false,
}) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }

    return setChecked(e.target.checked);
  };

  return (
    <S.Wrapper large={isLarge}>
      {withText && <S.Text>OFF</S.Text>}
      <S.Label>
        <S.Input
          name={name}
          ref={forwardRef}
          onChange={(e) => handleOnChange(e)}
          checked={checked}
        />

        <S.Slider checked={checked} large={isLarge} />
      </S.Label>
      {withText && <S.Text>ON</S.Text>}
    </S.Wrapper>
  );
};

// @deprecate Use atoms/toggler instead
export default ToggleSwitch;
