import React, { useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import { ALWAYS_EMPTY_ARRAY, HAS_ROOMS_TEMPLATES } from "settings";

import { createEvent, EventInput, updateEvent } from "api/admin";

import { AnyVenue, VenueEvent, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { eventEditSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSection } from "components/molecules/AdminSection";

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
        start_date: dayjs.unix(event.start_utc_seconds).format("YYYY-MM-DD"),
        start_time: dayjs.unix(event.start_utc_seconds).format("HH:mm"),
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

  const dropdownVenueList = venue?.rooms?.map(({ title, template }) => ({
    name: title,
    template: template,
  }));

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
              <div className="input-group dropdown-container">
                <SpacesDropdown
                  venueSpaces={dropdownVenueList ?? ALWAYS_EMPTY_ARRAY}
                  venueId={venueId}
                  setValue={setValue}
                  register={register}
                  fieldName="room"
                  defaultSpace={event?.room}
                  error={errors.room}
                />
              </div>

              <div className="input-group">
                <label htmlFor="name">Name your event</label>
                <input
                  id="name"
                  name="name"
                  className="input-group__modal-input"
                  placeholder="Name"
                  ref={register}
                />
                {errors.name && (
                  <span className="input-error">{errors.name.message}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  className="input-group__modal-input"
                  placeholder="Description"
                  ref={register}
                />
                {errors.description && (
                  <span className="input-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="host">Host (people hosting the event)</label>
                <input
                  id="host"
                  name="host"
                  className="input-group__modal-input"
                  placeholder="Dottie Longstockings"
                  ref={register}
                />
                {errors.host && (
                  <span className="input-error">{errors.host.message}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="date">Starting time</label>
                <label>
                  When does this event start? Use your local time zone, it will
                  be automatically converted for anyone visiting from around the
                  world.
                </label>
                <div className="TimingEventModal__container">
                  <input
                    type="date"
                    min={dayjs().format("YYYY-MM-DD")}
                    name="start_date"
                    className="input-group__modal-input"
                    ref={register}
                  />
                  <input
                    type="time"
                    name="start_time"
                    className="input-group__modal-input"
                    ref={register}
                  />
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

              <AdminSection title="Duration">
                <div className="TimingEventModal__container">
                  <label>
                    <input
                      name="duration_hours"
                      className="input-group__modal-input input-group__modal-input--indent"
                      placeholder="hours"
                      ref={register}
                    />
                    hour(s)
                  </label>
                  <label>
                    <input
                      name="duration_minutes"
                      className="input-group__modal-input input-group__modal-input--indent"
                      placeholder="minutes"
                      ref={register}
                    />
                    minutes
                  </label>
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
              </AdminSection>

              <div className="TimingEventModal__container">
                <ButtonNG
                  disabled={formState.isSubmitting}
                  variant="primary"
                  type="submit"
                >
                  {event ? "Update" : "Create"}
                </ButtonNG>

                {showDeleteButton && (
                  <ButtonNG
                    disabled={formState.isSubmitting}
                    variant="danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </ButtonNG>
                )}
              </div>

              <div className="TimingEventModal__container">
                <ButtonNG variant="secondary" onClick={onHide}>
                  Cancel
                </ButtonNG>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
