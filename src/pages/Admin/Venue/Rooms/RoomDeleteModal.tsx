import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { deleteRoom } from "api/admin";

import { Room, RoomData_v2 } from "types/rooms";

import "./RoomDeleteModal.scss";

interface PropsType {
  venueId: string;
  room: Room | RoomData_v2;
  show: boolean;
  onHide: () => void;
  onDelete?: () => void;
}

const RoomDeleteModal: React.FunctionComponent<PropsType> = ({
  venueId,
  room,
  show,
  onHide,
  onDelete,
}) => {
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string>();

  const history = useHistory();

  const closeDeleteModal = useCallback(() => {
    if (onDelete) onDelete();
    onHide();
    setDeleted(false);
    history.push(`/admin/${venueId}`);
  }, [history, onDelete, onHide, venueId]);

  const [{ loading: isDeleting }, deleteVenueRoom] = useAsyncFn(async () => {
    try {
      await deleteRoom(venueId, room);
      setDeleted(true);
    } catch (error) {
      setError(error.message);
    }
  }, [venueId, room]);

  return (
    <Modal show={show} onHide={closeDeleteModal}>
      <div className="room-delete-modal-container">
        <h2 className="centered">Delete room</h2>
        <div className="secondary-action">
          WARNING: Permanently removes this room from SparkleVerse
        </div>
        {!deleted && (
          <>
            <div className="input-group">
              <span className="info">
                WARNING: This action cannot be undone! Are you sure you wish to
                delete room: <em>{room.title}</em>?
              </span>
            </div>
            {isDeleting && (
              <div className="centered-flex" style={{ marginBottom: 10 }}>
                <div className="spinner-border">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <div className="input-group">
              <button
                disabled={isDeleting}
                className="btn btn-danger btn-block btn-centered"
                onClick={deleteVenueRoom}
              >
                Yes, Delete
              </button>
              {error && <span className="input-error">{error}</span>}
              <button
                disabled={isDeleting}
                className="btn btn-primary btn-block btn-centered"
                onClick={closeDeleteModal}
              >
                No, Cancel
              </button>
            </div>
          </>
        )}
        {deleted && (
          <div className="input-group">
            <span className="info">
              Room {room.title} has been permanently deleted.
            </span>
            <button
              className="btn btn-primary btn-block btn-centered"
              type="submit"
              onClick={closeDeleteModal}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RoomDeleteModal;
