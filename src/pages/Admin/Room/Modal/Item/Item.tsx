import React, { useCallback, useState } from "react";
// import { RoomModalItemProps } from './Item.types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as S from "./Item.styles";
import { useForm } from "react-hook-form";
import ImageInput from "components/atoms/ImageInput";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { createRoom } from "api/admin";

const RoomModalItem: React.FC<any> = ({
  name,
  description,
  icon,
  venueId,
  user,
  onSubmitHandler,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const values = watch();

  const onSubmit = useCallback(async () => {
    if (!user || !venueId) return;

    try {
      await createRoom(values, venueId, user);

      onSubmitHandler();
    } catch (err) {
      console.error(err);
    }
  }, [onSubmitHandler, user, values, venueId]);

  const handleOnChange = (val: string) => setValue("image_url", val, false);

  const renderNameInput = () => (
    <S.InputWrapper>
      <span>Name your room</span>
      <input type="text" ref={register} name="title" placeholder="Room name" />
    </S.InputWrapper>
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

  const renderZoomUrlInput = () => (
    <S.InputWrapper>
      <span>The Zoom url</span>

      <input type="text" ref={register} name="zoom_url" />
    </S.InputWrapper>
  );

  const renderLogoInput = () => (
    <S.InputWrapper>
      <span>How you want the room to appear on the map</span>

      <ImageInput
        onChange={handleOnChange}
        name="image"
        forwardRef={register}
        small
        nameWithUnderscore
      />
    </S.InputWrapper>
  );

  return (
    <S.Wrapper isOpen={isOpen}>
      <S.Header>
        <FontAwesomeIcon icon={icon} style={{ gridArea: "icon" }} />

        <S.TitleWrapper>
          <S.Title>{name}</S.Title>
          <S.Description>{description}</S.Description>
        </S.TitleWrapper>

        <FontAwesomeIcon
          icon={faPlusCircle}
          onClick={() => toggleIsOpen()}
          style={{ gridArea: "plus" }}
        />
      </S.Header>

      <S.InnerWrapper>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => console.log("Changing: ", values)}
        >
          {renderNameInput()}
          {renderDescriptionInput()}

          {renderZoomUrlInput()}
          {renderLogoInput()}

          <Button type="submit">Add the room</Button>
        </form>
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default RoomModalItem;
