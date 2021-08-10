import React, { FC, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";

import {
  addEmailsToWhitelist,
  getWhitelistedEmails,
  removeEmailFromWhitelist,
} from "api/auth";

import Button from "components/atoms/Button";

import { EmailsInput } from "./EmailsInput";

import "./ManageUsersModal.scss";

interface ManageUsersModalProps {
  show: boolean;
  venueId?: string;
  onHide(): void;
}

export const ManageUsersModal: FC<ManageUsersModalProps> = ({
  venueId,
  show,
  onHide,
}) => {
  const [whitelistedEmails, setWhitelistedEmails] = useState<string[]>([]);
  const [emailsInInput, setEmailsInInput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWhitelistedEmails = useCallback(async () => {
    if (!venueId) return;

    setIsLoading(true);
    const res = await getWhitelistedEmails({ venueId });

    setIsLoading(false);
    setWhitelistedEmails(res.data);
  }, [venueId]);

  const removeFromWhitelist = useCallback(
    async (email: string) => {
      if (!venueId) return;

      setIsLoading(true);
      await removeEmailFromWhitelist({ venueId, email });
      await fetchWhitelistedEmails();

      setIsLoading(false);
    },
    [fetchWhitelistedEmails, venueId]
  );

  const addToWhitelist = useCallback(async () => {
    if (!venueId) return;

    setIsLoading(true);
    await addEmailsToWhitelist({ venueId, emails: emailsInInput });
    await fetchWhitelistedEmails();

    setEmailsInInput([]);
    setIsLoading(false);
  }, [emailsInInput, fetchWhitelistedEmails, venueId]);

  useEffect(() => {
    fetchWhitelistedEmails();
  }, [fetchWhitelistedEmails]);

  return (
    <Modal className="ManageUsersModal" show={show} onHide={onHide}>
      <Modal.Body>
        <div className="ManageUsersModal__title">
          <h2>Manage Users</h2>
        </div>
        <div className="ManageUsersModal__description">
          Add emails to whitelist (allow them to register to your venue)
        </div>
        <EmailsInput
          className="ManageUsersModal__input"
          value={emailsInInput}
          onChange={setEmailsInInput}
        />
        <Button
          customClass="ManageUsersModal__addEmailsButton"
          onClick={addToWhitelist}
          loading={isLoading}
          disabled={!emailsInInput.length}
        >
          Add emails
        </Button>
        <div className="ManageUsersModal__whitelist">
          {!!whitelistedEmails.length && (
            <div className="ManageUsersModal__whitelistTitle">
              Whitelisted emails
            </div>
          )}
          <div className="ManageUsersModal__whitelistEmails">
            {whitelistedEmails.map((email) => {
              return (
                <div className="ManageUsersModal__whitelistEmail" key={email}>
                  <span>{email}</span>
                  <button
                    className="ManageUsersModal__whitelistEmailCloseButton"
                    onClick={() => removeFromWhitelist(email)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
