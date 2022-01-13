import React from "react";
import ReactModal from "react-modal";

import "./Modal.scss";

interface StyleProps {
  isCentered?: boolean;
  fullWidth?: boolean;
}

interface CustomStylesProps extends StyleProps {
  isCustom?: boolean;
}

export interface ModalProps extends StyleProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  shouldCloseOnOverlayClick?: boolean;
}

const customStyles = ({
  isCustom,
  fullWidth,
  isCentered,
}: CustomStylesProps) => ({
  // ReactModal uses some default inline styles that need to be overwritten using !important or built-in
  // styles prop. I've decided using the prop approach (recommended by the library),
  // thus we're having these css rules here
  content: {
    ...(!isCustom && { backgroundColor: "black" }),
    inset: "",
    border: "none",
    outline: "none",
    borderRadius: "50px",
    overflow: "none",
    margin: !isCentered ? "40px auto" : "",
    top: "0",
    ...(fullWidth && { width: "90%" }),
  },
  overlay: {
    ...(isCentered && {
      "-webkit-box-align": "center",
      "-webkit-box-pack": "center",
      display: "-webkit-box",
    }),
  },
});

ReactModal.setAppElement("#root");

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  className = "",
  isCentered,
  shouldCloseOnOverlayClick,
  fullWidth,
}) => {
  const styles = customStyles({ isCentered, isCustom: !!className, fullWidth });

  return (
    <ReactModal
      isOpen={isOpen}
      style={styles}
      onRequestClose={onClose}
      overlayClassName="Modal__overlay"
      className={className}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      htmlOpenClassName="Modal__html"
    >
      {children}
    </ReactModal>
  );
};
