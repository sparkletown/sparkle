import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";

import "./EditTableTitleModal.scss";

export interface EditTableTitleModalProps {
  isShown: boolean;
  title: string;
  error: string;
  onHide: () => void;
  onCancel: () => void;
  onSave: (newTableTitle: string) => void;
}

export const EditTableTitleModal: React.FC<EditTableTitleModalProps> = ({
  isShown,
  title,
  error,
  onSave,
  onHide,
  onCancel,
}) => {
  const [newTableTitle, setNewTableTitle] = useState<string>(title);

  const saveChanges = useCallback(() => {
    onSave(newTableTitle);
    onHide();
  }, [newTableTitle, onHide, onSave]);

  const changeTableTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTableTitle(e.target.value);
    },
    []
  );

  return (
    <Modal show={isShown} onHide={onHide}>
      <Modal.Body>
        <input value={newTableTitle} onChange={changeTableTitle}></input>
        {error && <label className="input-error">{error}</label>}
        <div className="edit-title-buttons">
          <button className="btn btn-centered btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-centered btn-primary"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
