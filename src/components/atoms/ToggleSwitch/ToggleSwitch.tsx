import React, { useState } from "react";

// Typings
import { SwitchProps } from "./ToggleSwitch.types";

// Styles
import * as S from "./ToggleSwitch.styles";

const ToggleSwitch: React.FC<SwitchProps> = ({
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

export default ToggleSwitch;
