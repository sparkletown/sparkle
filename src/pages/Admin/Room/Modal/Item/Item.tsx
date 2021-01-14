import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as S from "./Item.styles";
import { useForm } from "react-hook-form";
import ImageInput from "components/atoms/ImageInput";
import {
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { createRoom, createVenue_v2, VenueInput_v2 } from "api/admin";
import { CustomInputsType } from "settings";
import { RoomModalItemProps } from "./Item.types";
import { roomCreateSchema } from "pages/Admin/Details/ValidationSchema";

const RoomModalItem: React.FC<RoomModalItemProps> = ({
  name,
  icon,
  description,
  venueId,
  user,
  onSubmitHandler,
  template,
  editValues,
  customInputs,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (editValues) {
      setIsOpen(true);
    }
  }, [editValues]);

  const {
    register,
    watch,
    errors,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomCreateSchema,
    defaultValues: {
      venueName: "",
      title: editValues ? editValues.title : "",
      description: editValues ? editValues.description : "",
    },
  });

  const values = watch();

  const onSubmit = useCallback(async () => {
    if (!user || !venueId) return;

    try {
      const valuesWithTemplate = {
        ...values,
        template,
      };

      const list = new DataTransfer();

      const fileList = list.files;

      const venueInput: VenueInput_v2 = {
        name: values.venueName,
        subtitle: "",
        description: "",
        template: template,
        bannerImageFile: fileList,
        bannerImageUrl: "",
        logoImageUrl: "",
        mapBackgroundImageUrl: "",
        logoImageFile: fileList,
        rooms: [],
      };

      try {
        if (!editValues) {
          await createVenue_v2(venueInput, user);
        }
        await createRoom(valuesWithTemplate, venueId, user);

        onSubmitHandler();
      } catch (error) {}
    } catch (err) {
      console.error(err);
    }
  }, [editValues, onSubmitHandler, template, user, values, venueId]);

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

  const renderLogoInput = () => (
    <S.InputWrapper>
      <span>How you want the room to appear on the map</span>

      <ImageInput
        onChange={handleOnChange}
        name="image"
        forwardRef={register}
        small
        nameWithUnderscore
        imgUrl={editValues ? editValues.image_url : ""}
      />
    </S.InputWrapper>
  );

  const renderCustomInput = (input: CustomInputsType) => (
    <S.InputWrapper key={input.name}>
      <span>{input.title}</span>

      <input type="text" name={input.name} ref={register} />
    </S.InputWrapper>
  );

  return (
    <S.Wrapper isOpen={isOpen}>
      <S.Header>
        <S.ItemIcon src={icon} alt="venue thumb" />

        <S.TitleWrapper>
          <S.Title>{name}</S.Title>
          <S.Description>{description}</S.Description>
        </S.TitleWrapper>

        <FontAwesomeIcon
          icon={isOpen ? faChevronCircleUp : faChevronCircleDown}
          onClick={() => toggleIsOpen()}
          style={{ gridArea: "plus" }}
        />
      </S.Header>

      <S.InnerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <S.InputWrapper key={"venueName"}>
            <span>Name your venue</span>

            <input
              type="text"
              placeholder="Venue name"
              name={"venueName"}
              ref={register}
            />
          </S.InputWrapper>

          {errors.venueName && (
            <span className="input-error">{errors.venueName.message}</span>
          )}

          {renderNameInput()}
          {renderDescriptionInput()}

          {customInputs &&
            customInputs.map((input: CustomInputsType) =>
              renderCustomInput(input)
            )}

          {renderLogoInput()}

          <Button type="submit" disabled={isSubmitting}>
            Add the room
          </Button>
        </form>
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default RoomModalItem;
