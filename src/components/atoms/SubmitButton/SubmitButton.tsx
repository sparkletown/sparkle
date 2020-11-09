import React from "react";

// Typings
import { SubmitButtonProps } from "./SubmitButton.types";

const SubmitButton: React.FC<SubmitButtonProps> = ({
  customClass,
  loading,
  editing,
  templateType,
}) => {
  if (loading)
    return (
      <div className="spinner-border">
        <span className="sr-only">Loading...</span>
      </div>
    );

  return (
    <input
      className={`btn btn-primary ${customClass}`}
      type="submit"
      value={editing ? `Update ${templateType}` : `Create ${templateType}`}
    />
  );
};

SubmitButton.defaultProps = {
  editing: false,
  templateType: "Venue",
};

export default SubmitButton;
