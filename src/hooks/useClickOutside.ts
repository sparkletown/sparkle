import { RefObject, useEffect } from "react";

interface ClickOutsideProps {
  ref: RefObject<HTMLDivElement>;
  buttonRef: RefObject<HTMLButtonElement>;
  hide?: () => void;
  closeRoot?: boolean;
}

export const useClickOutside = ({
  ref,
  hide,
  closeRoot,
  buttonRef,
}: ClickOutsideProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        hide && closeRoot && hide();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, hide, closeRoot, buttonRef]);
};
