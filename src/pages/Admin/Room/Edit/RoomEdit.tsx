import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ImageInput from "components/atoms/ImageInput";

import * as S from "./RoomEdit.styles";
import { CustomInputsType, RoomTemplate, ROOM_TEMPLATES } from "settings";

const EditRoom: React.FC<any> = (props) => {
  const { isVisible, onClickOutsideHandler, room } = props;

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [roomTemplate, setRoomTemplate] = useState<RoomTemplate | null>(null);

  const initialRender = useRef<boolean>(true);

  useEffect(() => {
    if (initialRender) {
      setSelectedTemplate(room.template);
    }
  }, [room.template]);

  useEffect(() => {
    initialRender.current = false;
  });

  useEffect(() => {
    const template = ROOM_TEMPLATES.find(
      (i) => i.template === selectedTemplate
    );
    setRoomTemplate(template!);
  }, [selectedTemplate]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: room.title,
      description: room.description,
    },
  });

  const handleImageChange = (val: string) => setValue("image_url", val, false);

  const renderNameInput = () => (
    <Form.Row>
      <S.InputWrapper>
        <Form.Label>Name your room</Form.Label>
        <Form.Control
          type="text"
          ref={register}
          name="title"
          placeholder="Room name"
          custom
        />
      </S.InputWrapper>
    </Form.Row>
  );

  const renderDescriptionInput = () => (
    <S.InputWrapper>
      <span>The room description (optional)</span>
      <input
        type="text"
        ref={register}
        name="description"
        placeholder="Description"
      />
    </S.InputWrapper>
  );

  const renderLogoInput = () => (
    <S.InputWrapper>
      <span>How you want the room to appear on the map</span>

      <ImageInput
        onChange={handleImageChange}
        name="image"
        forwardRef={register}
        small
        nameWithUnderscore
        imgUrl={room.image_url}
      />
    </S.InputWrapper>
  );

  const renderCustomInput = (input: CustomInputsType) => (
    <S.InputWrapper key={input.name}>
      <span>{input.title}</span>

      <input type="text" name={input.name} ref={register} />
    </S.InputWrapper>
  );

  const renderTemplateSelect = () => {
    return (
      <S.InputWrapper>
        <Form.Label>Change room template</Form.Label>
        <Form.Control
          as="select"
          custom
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedTemplate(e.target.value)
          }
        >
          {ROOM_TEMPLATES.map((template) => (
            <option key={template.name}>{template.template}</option>
          ))}
        </Form.Control>
      </S.InputWrapper>
    );
  };

  return (
    <Modal show={isVisible} onHide={onClickOutsideHandler}>
      <Modal.Header>
        <Modal.Title>Editing - {room.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {renderNameInput()}
          {renderDescriptionInput()}
          {renderLogoInput()}

          {roomTemplate?.customInputs?.map((input) => renderCustomInput(input))}

          {renderTemplateSelect()}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRoom;
