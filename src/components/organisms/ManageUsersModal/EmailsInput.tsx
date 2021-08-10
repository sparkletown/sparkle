import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import { ReactMultiEmail, isEmail } from "react-multi-email";

import "react-multi-email/style.css";

import "./EmailsInput.scss";

interface EmailsInputProps {
  className: string;
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
}

interface LabelProps {
  email: string;
  index: number;
  removeEmail(index: number): void;
}

export const EmailsInput: FC<EmailsInputProps> = ({
  className,
  value,
  onChange,
}) => {
  const getLabel = useCallback(
    (email: string, index: number, removeEmail: (index: number) => void) => (
      <Chip email={email} index={index} removeEmail={removeEmail} />
    ),
    []
  );

  return (
    <ReactMultiEmail
      className={className}
      placeholder="Enter emails"
      emails={value}
      onChange={onChange}
      validateEmail={isEmail}
      getLabel={getLabel}
    />
  );
};

const Chip: FC<LabelProps> = ({ email, index, removeEmail }) => {
  const onClickRemove = () => removeEmail(index);

  return (
    <div data-tag="true" key={index} className="EmailsInput__chip">
      {email}
      <span
        data-tag-handle="true"
        onClick={onClickRemove}
        className="EmailsInput__removeChip"
      >
        ×
      </span>
    </div>
  );
};
