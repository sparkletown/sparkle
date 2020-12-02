import React, { useEffect, useState } from "react";

// Typings
import { SwitchProps } from "./ToggleSwitch.types";

// Styles
import * as S from "./ToggleSwitch.styles";

const ToggleSwitch: React.FC<SwitchProps> = ({
  name,
  forwardRef,
  isChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }

    return setChecked(e.target.checked);
  };

  return (
    <S.Label>
      <S.Input
        name={name}
        ref={forwardRef}
        onChange={(e) => handleOnChange(e)}
        checked={checked}
      />

      <S.Slider checked={checked} />
    </S.Label>
  );
};

export default ToggleSwitch;
