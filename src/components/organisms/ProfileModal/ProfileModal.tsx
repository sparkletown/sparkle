import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./ProfileModal.scss";
import UserInformationContent from "./UserInformationContent";
import EditProfileForm from "./EditProfileForm";
import EditPasswordForm from "./EditPasswordForm";

interface PropsType {
  show: boolean;
  onHide: () => void;
}

const ProfileModal: React.FunctionComponent<PropsType> = ({ show, onHide }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);

  const onHideModal = () => {
    onHide();
    setIsEditMode(false);
    setIsPasswordEditMode(false);
  };

  return (
    <Modal
      show={show}
      onHide={onHideModal}
      dialogClassName="edit-profile-modal-dialog"
    >
      <Modal.Body className="profile-modal-container">
        {!isEditMode && !isPasswordEditMode && (
          <UserInformationContent
            setIsEditMode={setIsEditMode}
            setIsPasswordEditMode={setIsPasswordEditMode}
            hideModal={onHide}
          />
        )}
        {isEditMode && <EditProfileForm setIsEditMode={setIsEditMode} />}
        {isPasswordEditMode && (
          <EditPasswordForm setIsPasswordEditMode={setIsPasswordEditMode} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
