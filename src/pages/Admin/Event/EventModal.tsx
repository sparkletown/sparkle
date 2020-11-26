import Button from "components/atoms/Button";
import dayjs from "dayjs";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

import * as S from "./EventModal.styles";

// Typings
import { Event_v2 } from "./EventModal.types";
import { eventModalValidationSchema } from "./validationSchema";

const EventModal: React.FC<any> = (props) => {
  const { onHide, isVisible } = props;

  const {
    register,
    errors,
    formState: { isSubmitting },
    watch,
  } = useForm<Event_v2>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: eventModalValidationSchema,
  });
  const values = watch();

  const handleOnChange = () => console.log("values: ", values);

  const renderNameInput = () => (
    <S.InputWrapper>
      <S.InputTitle>Name</S.InputTitle>
      <input name="name" placeholder="Event name" ref={register} />
      {errors.name && <S.Error>{errors.name.message}</S.Error>}
    </S.InputWrapper>
  );

  const renderDescriptionInput = () => (
    <S.InputWrapper>
      <S.InputTitle>Description</S.InputTitle>
      <textarea name="description" placeholder="Description" ref={register} />
      {errors.description && <S.Error>{errors.description.message}</S.Error>}
    </S.InputWrapper>
  );

  const renderStartTimeInputs = () => (
    <S.InputWrapper>
      <S.InputTitle>Start Time</S.InputTitle>

      <p style={{ fontSize: 13, textAlign: "justify" }}>
        Please enter these in your local timezone.
        <br />
        Don&apos;t worry - your event times will be automatically shown in the
        local times of [BURNERS] around the world.
      </p>

      <S.InputInline>
        <S.InputLabel>Date:</S.InputLabel>
        <input
          type="date"
          min={dayjs().format("YYYY-MM-DD")}
          name="start_date"
          ref={register}
        />
        {errors.start_date && <S.Error>{errors.start_date.message}</S.Error>}
      </S.InputInline>

      <S.InputInline>
        <S.InputLabel>Time:</S.InputLabel>
        <input type="time" name="start_time" ref={register} />
        {errors.start_time && <S.Error>{errors.start_time.message}</S.Error>}
      </S.InputInline>
    </S.InputWrapper>
  );

  const renderDurationInput = () => (
    <S.InputWrapper>
      <S.InputTitle>Duration (hours)</S.InputTitle>

      <input
        type="number"
        name="duration_hours"
        placeholder="3"
        ref={register}
      />

      {errors.duration_hours && (
        <S.Error>{errors.duration_hours.message}</S.Error>
      )}
    </S.InputWrapper>
  );

  const renderHostInput = () => (
    <S.InputWrapper>
      <S.InputTitle>Host</S.InputTitle>

      <input name="host" placeholder="Dottie Longstockings" ref={register} />

      {errors.host && <S.Error>{errors.host.message}</S.Error>}
    </S.InputWrapper>
  );

  return (
    <Modal show={isVisible} onHide={onHide}>
      <S.InnerWrapper>
        <S.Title>Create an event</S.Title>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            return console.log("Submitting");
          }}
          onChange={handleOnChange}
        >
          {renderNameInput()}
          {renderDescriptionInput()}
          {renderStartTimeInputs()}
          {renderDurationInput()}

          {renderHostInput()}

          <Button gradient>Create</Button>
        </form>
      </S.InnerWrapper>
    </Modal>
  );
};

export default EventModal;
