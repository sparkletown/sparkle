import React, { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { venueLandingUrl } from "utils/url";

interface AccessDeniedModalProps {
  show?: boolean;
  venueId: string;
  venueName: string;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  show,
  venueId,
  venueName,
}) => {
  const [isVisible, setIsVisible] = useState(show ?? true);
  const history = useHistory();

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const confirm = useCallback(() => {
    history.push(venueLandingUrl(venueId));
    hide();
  }, [history, venueId, hide]);

  return (
    <Modal show={isVisible} onHide={hide}>
      <Modal.Body>
        <div className="confirmation-modal">
          <h2 className="confirm-header">Access Denied</h2>
          <div className="confirm-message">
            It seems you do not have access to {venueName}. Click OK to return
            to the landing page.
          </div>
          <div className="confirmation-buttons">
            <Button className="confirm-button" onClick={confirm}>
              OK
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
