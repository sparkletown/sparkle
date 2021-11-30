import React, { useCallback, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import {
  ALWAYS_EMPTY_ARRAY,
  DAYJS_INPUT_DATE_FORMAT,
  DAYJS_INPUT_TIME_FORMAT,
  HAS_ROOMS_TEMPLATES,
} from "settings";

import { createEvent, EventInput, updateEvent } from "api/admin";

import { AnyVenue, VenueEvent, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { eventEditSchema } from "forms/eventEditSchema";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import "./TimingEventModal.scss";

export type TimingEventModalProps = {
  show: boolean;
  onHide: () => void;
  venueId: string | undefined;
  event?: WithId<VenueEvent>;
  template?: VenueTemplate;
  venue: WithId<AnyVenue>;
  setEditedEvent: Function | undefined;
  setShowDeleteEventModal: () => void;
};

// Dispatch<SetStateAction<WithId<VenueEvent> | undefined>>
export const TimingEventModal: React.FC<TimingEventModalProps> = ({
  show,
  onHide,
  venueId,
  template,
  venue,
  setEditedEvent,
  event,
  setShowDeleteEventModal,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    setValue,
  } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: eventEditSchema,
  });

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description,
        start_date: dayjs
          .unix(event.start_utc_seconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        start_time: dayjs
          .unix(event.start_utc_seconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        duration_hours: Math.floor(event.duration_minutes / 60),
        duration_minutes: event.duration_minutes % 60,
        host: event.host,
        room: event.room,
      });
    }
  }, [event, reset]);

  const onUpdateEvent = useCallback(
    async (data: EventInput) => {
      const start = dayjs(`${data.start_date} ${data.start_time}`);
      const formEvent: VenueEvent = {
        name: data.name,
        description: data.description,
        start_utc_seconds:
          start.unix() || Math.floor(new Date().getTime() / 1000),
        duration_minutes:
          data.duration_hours * 60 + (data.duration_minutes ?? 0),
        host: data.host,
      };
      if (template && HAS_ROOMS_TEMPLATES.includes(template))
        formEvent.room = data.room;
      if (venueId) {
        if (event) {
          await updateEvent(venueId, event.id, formEvent);
        } else {
          await createEvent(venueId, formEvent);
        }
      }
      onHide();
    },
    [onHide, venueId, template, event]
  );

  const showDeleteButton =
    template && HAS_ROOMS_TEMPLATES.includes(template) && event;
  const handleDelete = () => {
    onHide();
    setEditedEvent && setEditedEvent(event);
    setShowDeleteEventModal();
  };

  const dropdownVenueList = useMemo(
    () =>
      Object.fromEntries(
        venue?.rooms?.map((room) => [
          room.title,
          { ...room, name: room.title },
        ]) ?? ALWAYS_EMPTY_ARRAY
      ),
    [venue?.rooms]
  );

  const parentRoom = useMemo(
    () => venue?.rooms?.find(({ title }) => title === event?.room),
    [event?.room, venue?.rooms]
  );

  const parentSpace = {
    name: parentRoom?.title ?? venue.name,
    template: parentRoom?.template ?? venue.template,
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        className="TimingEventModal"
        backdrop="static"
      >
        <Modal.Body>
          <div className="form-container">
            <h2>Add experience</h2>
            <form className="form" onSubmit={handleSubmit(onUpdateEvent)}>
              <div className="TimingEventModal__input-group dropdown-container">
                <SpacesDropdown
                  portals={dropdownVenueList}
                  setValue={setValue}
                  register={register}
                  fieldName="room"
                  parentSpace={parentSpace}
                  error={errors.room}
                />
              </div>

              <div className="TimingEventModal__input-group">
                <label htmlFor="name">Name your experience</label>
                <input
                  id="name"
                  name="name"
                  className="TimingEventModal__input-group__modal-input"
                  placeholder="Name"
                  ref={register}
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
                  ref={register}
                />
                {errors.description && (
                  <span className="input-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="TimingEventModal__input-group">
                <label htmlFor="host">Host (people hosting the event)</label>
                <input
                  id="host"
                  name="host"
                  className="TimingEventModal__input-group__modal-input"
                  placeholder="Dottie Longstockings"
                  ref={register}
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
                      ref={register}
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      name="start_time"
                      className="TimingEventModal__input-group__modal-input"
                      ref={register}
                    />
                  </div>
                </div>

                <div className="TimingEventModal__container">
                  {errors.start_date && (
                    <span className="input-error">
                      {errors.start_date.message}
                    </span>
                  )}
                  {errors.start_time && (
                    <span className="input-error">
                      {errors.start_time.message}
                    </span>
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
                    ref={register}
                    size={8}
                  />
                  <label htmlFor="duration_hours">hour(s)</label>
                  <input
                    name="duration_minutes"
                    className="TimingEventModal__input-group__modal-input--indent"
                    placeholder="minutes"
                    ref={register}
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
                  {event ? "Update" : "Create"}
                </ButtonNG>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
