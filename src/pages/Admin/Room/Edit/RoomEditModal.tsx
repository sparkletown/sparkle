import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ImageInput from "components/atoms/ImageInput";

import { RoomTemplate, ROOM_TEMPLATES } from "settings";
import { RoomEditModalProps } from "./RoomEditModal.types";

import "./RoomEditModal.scss";

export const RoomEditModal: React.FC<RoomEditModalProps> = ({
  isVisible,
  onClickOutsideHandler,
  room,
  submitHandler,
  deleteHandler,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    room.template
  );

  const [roomTemplate, setRoomTemplate] = useState<RoomTemplate | null>(null);

  useEffect(() => {
    const template = ROOM_TEMPLATES.find(
      (roomTemplate) => roomTemplate.template === selectedTemplate
    );
    setRoomTemplate(template);
  }, [selectedTemplate]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, dirty },
  } = useForm({
    defaultValues: {
      title: room.title,
      url: room.url,
      description: room.description,
      template: room.template,
    },
  });

  const values = watch();

  const handleImageChange = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
    },
    [setValue]
  );

  function onSubmit() {
    return submitHandler(values, room.roomIndex!);
  }

  const customInputFields = useMemo(
    () =>
      roomTemplate?.customInputs?.map((input) => (
        <div className="room-edit-modal__input" key={input.name}>
          <span>{input.title}</span>
          <input type="text" name={input.name} ref={register} />
        </div>
      )),
    [register, roomTemplate]
  );

  return (
    <Modal
      show={isVisible}
      onHide={onClickOutsideHandler}
      className="room-edit-modal"
    >
      <Modal.Header>
        <Modal.Title>Editing - {room.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Name your room</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="title"
                placeholder="Room name"
                custom
              />
            </div>
          </Form.Row>

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>The room url</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="url"
                placeholder="Room url"
                custom
              />
            </div>
          </Form.Row>

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>The room description (optional)</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="description"
                placeholder="Description"
                custom
              />
            </div>
          </Form.Row>

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>
                How you want the room to appear on the map
              </Form.Label>
              <ImageInput
                onChange={handleImageChange}
                name="image"
                forwardRef={register}
                small
                nameWithUnderscore
                imgUrl={room.image_url}
              />
            </div>
          </Form.Row>

          {customInputFields}

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Change room template</Form.Label>
              <Form.Control
                as="select"
                custom
                name="template"
                ref={register}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedTemplate(e.target.value)
                }
              >
                {ROOM_TEMPLATES.map((template) => (
                  <option key={template.name}>{template.template}</option>
                ))}
              </Form.Control>
            </div>
          </Form.Row>

          <div className="room-edit-modal__buttons">
            <Button variant="danger" onClick={deleteHandler}>
              Delete room
            </Button>

            <Button type="submit" disabled={isSubmitting || !dirty}>
              Save room
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
