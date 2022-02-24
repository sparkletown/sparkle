import React, { useCallback, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";

import { DAYJS_INPUT_DATE_FORMAT, DAYJS_INPUT_TIME_FORMAT } from "settings";

import { createEvent, EventInput, updateEvent } from "api/admin";

import { AnyVenue, WorldEvent } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { MaybeWithId, WithId } from "utils/id";

import { eventEditSchema } from "forms/eventEditSchema";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Modal } from "components/molecules/Modal";

import "./TimingEventModal.scss";

export type TimingEventModalProps = {
  show: boolean;
  onHide: () => void;
  venueId: string | undefined;
  event?: WorldEvent;
  template?: VenueTemplate;
  venue: WithId<AnyVenue>;
  setEditedEvent: Function | undefined;
  setShowDeleteEventModal: () => void;
};

// Dispatch<SetStateAction<WithId<Experience> | undefined>>
export const TimingEventModal: React.FC<TimingEventModalProps> = ({
  show,
  onHide,
  venue,
  setEditedEvent,
  event,
  setShowDeleteEventModal,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState,
    reset,
  } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(eventEditSchema),
  });

  const { errors } = useFormState({ control });

  // When we're creating a new event it will default to
  // being on the space that triggered this modal.
  const eventSpaceId = event?.spaceId || venue.id;
  const { findVenueInRelatedVenues } = useRelatedVenues();
  const eventSpace = findVenueInRelatedVenues({ spaceId: eventSpaceId });

  useEffect(() => {
    if (event?.id) {
      reset({
        name: event.name,
        description: event.description,
        start_date: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        start_time: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        duration_hours: Math.floor(event.durationMinutes / 60),
        duration_minutes: event.durationMinutes % 60,
        host: event.host,
      });
    }
  }, [event, reset, eventSpaceId]);

  const onUpdateEvent = useCallback(
    async (data: EventInput) => {
      const start = dayjs(`${data.start_date} ${data.start_time}`);
      const formEvent: MaybeWithId<WorldEvent> = {
        name: data.name,
        description: data.description,
        startUtcSeconds:
          start.unix() || Math.floor(new Date().getTime() / 1000),
        durationMinutes:
          data.duration_hours * 60 + (data.duration_minutes ?? 0),
        host: data.host,
        spaceId: eventSpaceId,
        // @debt this needs figuring out. We shouldn't get to here without
        // an eventSpace
        worldId: eventSpace?.worldId ?? "",
      };
      // Add the ID conditionally - otherwise the field is set to undefined
      // which firebase does not like.
      if (eventSpaceId) {
        if (event?.id) {
          formEvent.id = event.id;
          await updateEvent(formEvent as WorldEvent);
        } else {
          await createEvent(formEvent);
        }
      }
      onHide();
    },
    [onHide, eventSpaceId, eventSpace, event]
  );

  const showDeleteButton = event?.id;
  const handleDelete = () => {
    onHide();
    setEditedEvent && setEditedEvent(event);
    setShowDeleteEventModal();
  };

  return (
    <Modal show={show} onHide={onHide} centered autoHide>
      <div className="TimingEventModal form-container">
        <h2>Add experience</h2>
        <form className="form" onSubmit={handleSubmit(onUpdateEvent)}>
          <p>Your experience is in {eventSpace?.name}</p>

          <div className="TimingEventModal__input-group">
            <label htmlFor="name">Name your experience</label>
            <input
              id="name"
              name="name"
              className="TimingEventModal__input-group__modal-input"
              placeholder="Name"
              {...register}
            />
            {errors.name && (
              <span className="input-error">{errors.name.message}</span>
            )}
          </div>

          <div className="TimingEventModal__input-group">
            <label htmlFor="description">Describe your experience</label>
            <textarea
              name="description"
              className="TimingEventModal__input-group__modal-input"
              placeholder="Description"
              {...register}
            />
            {errors.description && (
              <span className="input-error">{errors.description.message}</span>
            )}
          </div>

          <div className="TimingEventModal__input-group">
            <label htmlFor="host">Host (people hosting the event)</label>
            <input
              id="host"
              name="host"
              className="TimingEventModal__input-group__modal-input"
              placeholder="Dottie Longstockings"
              {...register}
            />
            {errors.host && (
              <span className="input-error">{errors.host.message}</span>
            )}
          </div>

          <div className="TimingEventModal__input-group">
            <label htmlFor="date">
              Start date and time (use your own time zone; it will be
              automatically localized)
            </label>
            <div className="TimingEventModal__container">
              {/*
                  These wrapper divs are here to unmuddle some precedance issues
                  in the CSS that causes the inputs to have 100% width. This
                  form is going to have some layout changes applied that should
                  resolve this..
                  */}
              <div>
                <input
                  type="date"
                  min={dayjs().format(DAYJS_INPUT_DATE_FORMAT)}
                  name="start_date"
                  className="TimingEventModal__input-group__modal-input"
                  {...register}
                />
              </div>
              <div>
                <input
                  type="time"
                  name="start_time"
                  className="TimingEventModal__input-group__modal-input"
                  {...register}
                />
              </div>
            </div>

            <div className="TimingEventModal__container">
              {errors.start_date && (
                <span className="input-error">{errors.start_date.message}</span>
              )}
              {errors.start_time && (
                <span className="input-error">{errors.start_time.message}</span>
              )}
            </div>
          </div>

          <div className="TimingEventModal__input-group">
            <label>Duration</label>
            <div className="TimingEventModal__duration_container">
              <input
                name="duration_hours"
                className="TimingEventModal__input-group__modal-input--indent"
                placeholder="hours"
                {...register}
                size={8}
              />
              <label htmlFor="duration_hours">hour(s)</label>
              <input
                name="duration_minutes"
                className="TimingEventModal__input-group__modal-input--indent"
                placeholder="minutes"
                {...register}
                size={8}
              />
              <label htmlFor="duration_minutes">minutes</label>
            </div>
            <div className="TimingEventModal__container">
              {errors.duration_hours && (
                <span className="input-error">
                  {errors.duration_hours.message}
                </span>
              )}
              {errors.duration_minutes && (
                <span className="input-error">
                  {errors.duration_minutes.message}
                </span>
              )}
            </div>
          </div>

          <div className="TimingEventModal__container">
            {
              // @debt: move this delete button to the experience list component
            }
            {showDeleteButton && (
              <ButtonNG
                disabled={formState.isSubmitting}
                variant="danger"
                onClick={handleDelete}
              >
                Delete
              </ButtonNG>
            )}

            <ButtonNG variant="secondary" onClick={onHide}>
              Cancel
            </ButtonNG>

            <ButtonNG
              disabled={formState.isSubmitting}
              variant="primary"
              type="submit"
            >
              {event?.id ? "Update" : "Create"}
            </ButtonNG>
          </div>
        </form>
      </div>
    </Modal>
  );
};
