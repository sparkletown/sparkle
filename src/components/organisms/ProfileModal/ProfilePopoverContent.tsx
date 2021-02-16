import React, { useState } from "react";
import "./ProfilePopoverContent.scss";
import UserInformationContent from "./UserInformationContent";
import EditProfileForm from "./EditProfileForm";
import EditPasswordForm from "./EditPasswordForm";

export const ProfilePopoverContent: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);

  return (
    <div className="profile-modal-container">
      {!isEditMode && !isPasswordEditMode && (
        <UserInformationContent
          setIsEditMode={setIsEditMode}
          setIsPasswordEditMode={setIsPasswordEditMode}
          hideModal={() => {}}
        />
      )}
      {isEditMode && <EditProfileForm setIsEditMode={setIsEditMode} />}
      {isPasswordEditMode && (
        <EditPasswordForm setIsPasswordEditMode={setIsPasswordEditMode} />
      )}
    </div>
  );
};
