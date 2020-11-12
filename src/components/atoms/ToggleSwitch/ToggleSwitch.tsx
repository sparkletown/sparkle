import React, { useEffect, useState } from "react";

// Typings
import { SwitchProps } from "./ToggleSwitch.types";

// Styles
import * as S from "./ToggleSwitch.styles";

const ToggleSwitch: React.FC<SwitchProps> = ({
  name,
  forwardRef,
  isChecked = false,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  return (
    <S.Label>
      <S.Input
        name={name}
        ref={forwardRef}
        onChange={(e) => setChecked(e.target.checked)}
        checked={checked}
      />

      <S.Slider checked={checked} />
    </S.Label>
  );
};

export default ToggleSwitch;
