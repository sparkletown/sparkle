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

const customStyles = ({ isCustom, fullWidth }: CustomStylesProps) => ({
  content: {
    ...(!isCustom && { backgroundColor: "black" }),
    inset: "",
    border: "none",
    outline: "none",
    borderRadius: "50px",
    overflow: "none",
    margin: "40px auto",
    top: "0",
    ...(fullWidth && { width: "90%" }),
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
