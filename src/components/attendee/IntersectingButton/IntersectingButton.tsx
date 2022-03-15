import { ButtonHTMLAttributes, RefObject, useEffect, useRef } from "react";
import { useIntersection } from "react-use";
import { Button, ButtonProps } from "components/attendee/Button";

interface IntersectingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {
  updateIntersected: (el: RefObject<HTMLButtonElement>) => void;
  onClick?: () => void;
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
