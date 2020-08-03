import React from "react";
import { Modal } from "react-bootstrap";
import CreateEventForm from "./CreateEventForm";

interface PropsType {
  show: boolean;
  onHide: () => void;
}
const CreateEventModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <CreateEventForm venueId={"42"} onComplete={onHide} />
    </Modal>
  );
};

export default CreateEventModal;
