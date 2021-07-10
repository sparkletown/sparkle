import React, { Fragment, useCallback, useEffect, useState } from "react";
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

import { roomCreateSchema } from "pages/Admin/Details/ValidationSchema";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import { Toggler } from "components/atoms/Toggler";

import { RoomModalItemProps } from "./Item.types";

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
  const [useUrl, setUseUrl] = useState<boolean>(false);

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
      url: editValues ? editValues.url : "",
      title: editValues ? editValues.title : "",
      description: editValues ? editValues.description : "",
      image_url: editValues ? editValues.image_url : "",
    },
  });

  const values = watch();

  const onSubmit = useCallback(async () => {
    if (!user || !venueId) return;

    try {
      const valuesWithTemplate = {
        ...values,
        template,
        isEnabled: true,
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
        if (!editValues && !useUrl) {
          await createVenue_v2(venueInput, user);
        }
        await createRoom(valuesWithTemplate, venueId, user);

        onSubmitHandler();
      } catch (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  }, [editValues, onSubmitHandler, template, useUrl, user, values, venueId]);

  const handleOnChange = (val: string) => setValue("image_url", val);

  const handleUrlToggle = useCallback(() => {
    setUseUrl((value) => !value);
  }, []);

  const renderUrlToggle = () => (
    <S.UrlToggleWrapper>
      <S.Flex>
        <h4 className="italic input-header">Create venue</h4>
      </S.Flex>
      <S.Flex>
        <Toggler
          id="useUrl"
          forwardedRef={register}
          checked={useUrl}
          onToggle={handleUrlToggle}
        />
      </S.Flex>
      <S.Flex>
        <h4 className="italic input-header">Use url</h4>
      </S.Flex>
    </S.UrlToggleWrapper>
  );

  const renderVenueNameInput = () => (
    <Fragment>
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
    </Fragment>
  );

  const renderUrlInput = () => (
    <Fragment>
      <S.InputWrapper key={"url"}>
        <span>The url for the room</span>
        <input type="text" ref={register} name="url" placeholder="Room url" />
      </S.InputWrapper>
      {errors.url && <span className="input-error">{errors.url.message}</span>}
    </Fragment>
  );

  const renderNameInput = () => (
    <Fragment>
      <S.InputWrapper>
        <span>Name your room</span>
        <input
          type="text"
          ref={register}
          name="title"
          placeholder="Room name"
        />
      </S.InputWrapper>
      {errors.title && (
        <span className="input-error">{errors.title.message}</span>
      )}
    </Fragment>
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
      {errors.image_url && (
        <span className="input-error">{errors.image_url.message}</span>
      )}
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
          <S.Description>
            <RenderMarkdown text={description} />
          </S.Description>
        </S.TitleWrapper>

        <FontAwesomeIcon
          icon={isOpen ? faChevronCircleUp : faChevronCircleDown}
          onClick={() => toggleIsOpen()}
          style={{ gridArea: "plus" }}
        />
      </S.Header>

      <S.InnerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderUrlToggle()}

          {!useUrl && renderVenueNameInput()}
          {useUrl && renderUrlInput()}

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
