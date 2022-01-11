import React, { useCallback, useEffect, useMemo } from "react";
import { Dropdown as ReactBootstrapDropdown, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import { DAYJS_INPUT_DATE_FORMAT, DAYJS_INPUT_TIME_FORMAT } from "settings";

import { createEvent, updateEvent, WorldScheduleEvent } from "api/admin";

import { WorldEvent } from "types/venues";

import { WithoutId } from "utils/id";

import { eventEditSchema } from "forms/eventEditSchema";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Dropdown } from "components/atoms/Dropdown";

import "./WorldScheduleEventModal.scss";

export type WorldScheduleEventModalProps = {
  show: boolean;
  onHide: () => void;
  venueId?: string;
  event?: WorldEvent;
  setEditedEvent: Function | undefined;
  setShowDeleteEventModal: () => void;
};

// @debt This is almost identical to TimingEventModal, think of a better approach before merge.
export const WorldScheduleEventModal: React.FC<WorldScheduleEventModalProps> = ({
  show,
  onHide,
  venueId,
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
    watch,
  } = useForm<WorldScheduleEvent>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: eventEditSchema,
  });

  // When we're creating a new event it will default to
  // being on the space that triggered this modal.
  const eventSpaceId = event?.spaceId || venueId || "";
  const { findVenueInRelatedVenues, relatedVenueIds } = useRelatedVenues();
  const eventSpace = findVenueInRelatedVenues({ spaceId: eventSpaceId });

  const values = watch();

  useEffect(() => {
    if (event?.id) {
      reset({
        name: event.name,
        description: event.description,
        startDate: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        startTime: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        durationHours: Math.floor(event.durationMinutes / 60),
        durationMinutes: event.durationMinutes % 60,
        host: event.host,
      });
    }
  }, [event, reset, eventSpaceId]);

  const onUpdateEvent = useCallback(
    async (data: WorldScheduleEvent) => {
      const spaceId = eventSpaceId ?? data.spaceId;
      const start = dayjs(`${data.startDate} ${data.startTime}`);
      const formEvent: WithoutId<WorldEvent> = {
        name: data.name,
        description: data.description,
        startUtcSeconds:
          start.unix() || Math.floor(new Date().getTime() / 1000),
        durationMinutes: data.durationHours * 60 + (data.durationMinutes ?? 0),
        host: data.host,
        spaceId: spaceId,
        // @debt this needs figuring out. We shouldn't get to here without
        // an eventSpace
        worldId: eventSpace?.worldId ?? "",
      };
      if (spaceId) {
        if (event?.id) {
          const eventWithId: WorldEvent = { ...formEvent, id: event.id };
          // @debt this is a hack. event.venueId is the venue that contains
          // the event inside its events subcollection. It is NOT the space
          // that the event is being experienced in.
          await updateEvent(eventWithId);
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

  const renderedOptions = useMemo(
    () =>
      relatedVenueIds.map((spaceId) => {
        return (
          <ReactBootstrapDropdown.Item
            key={spaceId}
            ref={register}
            name="spaceId"
            onClick={() => setValue("spaceId", spaceId)}
            className="SpacesDropdown__item"
          >
            {spaceId}
          </ReactBootstrapDropdown.Item>
        );
      }) ?? [],
    [register, relatedVenueIds, setValue]
  );

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        className="WorldScheduleEventModal"
        backdrop="static"
      >
        <Modal.Body>
          <div className="form-container">
            <h2>Add experience</h2>
            <form className="form" onSubmit={handleSubmit(onUpdateEvent)}>
              <p>
                Your experience is in{" "}
                {eventSpace?.name ?? (
                  <Dropdown
                    title={values.spaceId ?? "None"}
                    options={renderedOptions}
                  />
                )}{" "}
              </p>
              <div className="WorldScheduleEventModal__input-group">
                <label htmlFor="name">Name your experience</label>
                <input
                  id="name"
                  name="name"
                  className="WorldScheduleEventModal__input-group__modal-input"
                  placeholder="Name"
                  ref={register}
                />
                {errors.name && (
                  <span className="input-error">{errors.name.message}</span>
                )}
              </div>

              <div className="WorldScheduleEventModal__input-group">
                <label htmlFor="description">Describe your experience</label>
                <textarea
                  name="description"
                  className="WorldScheduleEventModal__input-group__modal-input"
                  placeholder="Description"
                  ref={register}
                />
                {errors.description && (
                  <span className="input-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="WorldScheduleEventModal__input-group">
                <label htmlFor="host">Host (people hosting the event)</label>
                <input
                  id="host"
                  name="host"
                  className="WorldScheduleEventModal__input-group__modal-input"
                  placeholder="Dottie Longstockings"
                  ref={register}
                />
                {errors.host && (
                  <span className="input-error">{errors.host.message}</span>
                )}
              </div>

              <div className="WorldScheduleEventModal__input-group">
                <label htmlFor="date">
                  Start date and time (use your own time zone; it will be
                  automatically localized)
                </label>
                <div className="WorldScheduleEventModal__container">
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
                      className="WorldScheduleEventModal__input-group__modal-input"
                      ref={register}
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      name="start_time"
                      className="WorldScheduleEventModal__input-group__modal-input"
                      ref={register}
                    />
                  </div>
                </div>

                <div className="WorldScheduleEventModal__container">
                  {errors.startDate && (
                    <span className="input-error">
                      {errors.startDate.message}
                    </span>
                  )}
                  {errors.startTime && (
                    <span className="input-error">
                      {errors.startTime.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="WorldScheduleEventModal__input-group">
                <label>Duration</label>
                <div className="WorldScheduleEventModal__duration_container">
                  <input
                    name="duration_hours"
                    className="WorldScheduleEventModal__input-group__modal-input--indent"
                    placeholder="hours"
                    ref={register}
                    size={8}
                  />
                  <label htmlFor="duration_hours">hour(s)</label>
                  <input
                    name="duration_minutes"
                    className="WorldScheduleEventModal__input-group__modal-input--indent"
                    placeholder="minutes"
                    ref={register}
                    size={8}
                  />
                  <label htmlFor="duration_minutes">minutes</label>
                </div>
                <div className="WorldScheduleEventModal__container">
                  {errors.durationHours && (
                    <span className="input-error">
                      {errors.durationHours.message}
                    </span>
                  )}
                  {errors.durationMinutes && (
                    <span className="input-error">
                      {errors.durationMinutes.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="WorldScheduleEventModal__container">
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
        </Modal.Body>
      </Modal>
    </>
  );
};
