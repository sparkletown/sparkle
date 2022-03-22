import React from "react";
import { Button } from "components/admin/Button";

export interface UserProfileModalButtonsProps {
  onCancelClick: () => void;
  onChangePasswordClick: () => void;
  isChangePasswordShown: boolean;
  isSubmitting: boolean;
}

export const EditProfileModalButtons: React.FC<UserProfileModalButtonsProps> = ({
  onCancelClick,
  onChangePasswordClick,
  isChangePasswordShown,
  isSubmitting,
}) => {
  return (
    <div data-bem="EditProfileModalButtons">
      {isChangePasswordShown && (
        <Button variant="secondary" onClick={onChangePasswordClick}>
          Change Password
        </Button>
      )}
      <Button
        variant="secondary"
        disabled={isSubmitting}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};
