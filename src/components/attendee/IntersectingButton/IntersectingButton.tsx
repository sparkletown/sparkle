import { ButtonHTMLAttributes, RefObject, useEffect } from "react";
import { useIntersection } from "react-use";
import { Button } from "components/attendee/Button";

// Button And Border variant types are the same to allow variant mixing.
// But we might have different variants for either button or border in the future
type ButtonVariant = "primary" | "alternative";
type BorderVariant = ButtonVariant;

interface IntersectingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: ButtonVariant;
  transparent?: boolean;
  border?: BorderVariant;
  className?: string;
  forwardRef: RefObject<HTMLButtonElement>;
  updateIntersected: (el: RefObject<HTMLButtonElement>) => void;
}

export const IntersectingButton: React.FC<IntersectingButtonProps> = ({
  onClick,
  forwardRef,
  updateIntersected,
  ...rest
}) => {
  const buttonIntersect = useIntersection(forwardRef, {
    rootMargin: "0px",
  });

  useEffect(() => {
    if (buttonIntersect?.isIntersecting) {
      updateIntersected(forwardRef);
    }
  }, [buttonIntersect, updateIntersected, forwardRef]);

  return <Button {...rest} forwardRef={forwardRef} onClick={onClick} />;
};
