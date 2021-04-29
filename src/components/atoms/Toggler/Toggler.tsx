import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
} from "react";
import classNames from "classnames";

import "./Toggler.scss";

export interface TogglerProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  title?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const Toggler: React.ForwardRefRenderFunction<
  HTMLLabelElement,
  TogglerProps
> = (
  { containerClassName, inputClassName, title, ...extraInputProps },
  ref
) => {
  const sliderClasses = classNames("Toggler__slider", {
    "Toggler__slider--checked": extraInputProps.checked,
  });

  return (
    <label ref={ref} className="Toggler">
      <div className="Toggler__input">
        <span className={sliderClasses} />
        <input hidden type="checkbox" {...extraInputProps} />
      </div>
      {title && <div className="Toggler__title">{title}</div>}
    </label>
  );
};

export default forwardRef(Toggler);
