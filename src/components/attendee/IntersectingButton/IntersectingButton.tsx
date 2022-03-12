import { ButtonHTMLAttributes, RefObject, useEffect, useRef } from "react";
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
  forwardRef?: RefObject<HTMLButtonElement>;
  updateIntersected: (el: RefObject<HTMLButtonElement>) => void;
}

export const IntersectingButton: React.FC<IntersectingButtonProps> = ({
  onClick,
  forwardRef,
  updateIntersected,
  ...rest
}) => {
  const fallbackRef = useRef<HTMLButtonElement>(null);
  const targetRef = forwardRef ?? fallbackRef;
  const buttonIntersect = useIntersection(targetRef, {
    rootMargin: "0px",
  });

  useEffect(() => {
    if (buttonIntersect?.isIntersecting) {
      updateIntersected(targetRef);
    }
  }, [buttonIntersect, updateIntersected, targetRef]);

  return <Button {...rest} forwardRef={targetRef} onClick={onClick} />;
};
