import React, { useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as Yup from "yup";

import {
  DAYJS_INPUT_DATE_FORMAT,
  DAYJS_INPUT_TIME_FORMAT,
  HAS_ROOMS_TEMPLATES,
  ROOM_TAXON,
} from "settings";

import { createEvent, EventInput, updateEvent } from "api/admin";

import { VenueEvent, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

dayjs.extend(isSameOrAfter);

interface PropsType {
  show: boolean;
  onHide: () => void;
  venueId: string;
  event?: WithId<VenueEvent>;
  template?: VenueTemplate;
  setEditedEvent: Function | undefined;
  setShowDeleteEventModal: Function;
  roomName?: string;
}

const validationSchema = Yup.object().shape<EventInput>({
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  start_date: Yup.string()
    .required("Start date required")
    .matches(
      /\d{4}-\d{2}-\d{2}/,
      'Start date must have the format "yyyy-mm-dd"'
    )
    .test(
      "start_date_future",
      "Start date must be in the futur",
      (start_date) => {
        return dayjs(start_date).isSameOrAfter(dayjs(), "day");
      }
    ),
  start_time: Yup.string().required("Start time required"),
  duration_hours: Yup.number()
    .typeError("Duration must be a number")
    .required("Duration required"),
  duration_minutes: Yup.number(),
  host: Yup.string().required(),
});

const AdminEventModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  venueId,
  event,
  template,
  setEditedEvent,
  setShowDeleteEventModal,
  roomName,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
  } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
  });

  const { worldSlug } = useSpaceParams();
  const { isLoaded, worldId } = useWorldBySlug(worldSlug);

  useEffect(() => {
    if (!event) {
      reset({});
    } else {
      reset({
        name: event.name,
        description: event.description,
        start_date: dayjs
          .unix(event.start_utc_seconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        start_time: dayjs
          .unix(event.start_utc_seconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        duration_hours: event.duration_minutes / 60,
        host: event.host,
      });
    }
  }, [event, reset]);

  const onSubmit = useCallback(
    async (data: EventInput) => {
      if (!worldId) {
        // @debt we need a better way of handling these kind of scenarios
        return;
      }
      const start = dayjs(`${data.start_date} ${data.start_time}`);
      const formEvent: VenueEvent = {
        name: data.name,
        description: data.description,
        start_utc_seconds:
          start.unix() || Math.floor(new Date().getTime() / 1000),
        duration_minutes: data.duration_hours * 60,
        host: data.host,
        spaceId: venueId,
        worldId,
      };
      if (event) {
        await updateEvent(venueId, event.id, formEvent);
      } else {
        await createEvent(venueId, formEvent);
      }
      onHide();
    },
    [event, onHide, venueId, worldId]
  );

  if (!isLoaded) {
    // @debt
    // Figure out what to display whilst the world is being fetched for this modal
    return <></>;
  }

  return (
    <Modal show={show} onHide={onHide}>
      <div className="form-container">
        <h2>{event ? "Edit" : "Create"} an event</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              className="input-block input-centered"
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
              className="input-block input-centered"
              placeholder="Description"
              ref={register}
            />
            {errors.description && (
              <span className="input-error">{errors.description.message}</span>
            )}
          </div>
          <div className="input-group">
            <label>Start Time</label>
            <span
              style={{ fontSize: 13 }}
            >{`Please enter these in your local timezone.`}</span>{" "}
            <span
              style={{ fontSize: 13 }}
            >{`Don't worry- your event times will be automatically shown in the local times of burners round the world.`}</span>
            <input
              type="date"
              min={dayjs().format(DAYJS_INPUT_DATE_FORMAT)}
              name="start_date"
              className="input-block input-centered"
              ref={register}
            />
            {errors.start_date && (
              <span className="input-error">{errors.start_date.message}</span>
            )}
            <input
              type="time"
              name="start_time"
              className="input-block input-centered"
              ref={register}
            />
            {errors.start_time && (
              <span className="input-error">{errors.start_time.message}</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="duration_hours">Duration (hours)</label>
            <input
              id="duration_hours"
              name="duration_hours"
              className="input-block input-centered"
              placeholder="1"
              ref={register}
            />
            {errors.duration_hours && (
              <span className="input-error">
                {errors.duration_hours.message}
              </span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="host">Host (people hosting the event)</label>
            <input
              id="host"
              name="host"
              className="input-block input-centered"
              placeholder="Dottie Longstockings"
              ref={register}
            />
            {errors.host && (
              <span className="input-error">{errors.host.message}</span>
            )}
          </div>
          {template && HAS_ROOMS_TEMPLATES.includes(template) && (
            <div className="input-group">
              <label htmlFor="room">
                {ROOM_TAXON.capital} your event is in
              </label>
              <input
                id="room"
                name="room"
                className="input-block input-centered"
                placeholder="Cuddle Puddle"
                ref={register}
                value={roomName}
              />
            </div>
          )}
          <div style={event ? { display: "flex" } : {}}>
            <input
              className="btn btn-primary btn-small"
              type="submit"
              value={event ? "Update" : "Create"}
              disabled={formState.isSubmitting}
            />
            {template && HAS_ROOMS_TEMPLATES.includes(template) && event && (
              <input
                className="btn btn-primary btn-danger btn-small"
                type="submit"
                value="Delete"
                onClick={(e) => {
                  e.preventDefault();
                  setEditedEvent && setEditedEvent(event);
                  setShowDeleteEventModal(true);
                }}
                disabled={formState.isSubmitting}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

AdminEventModal.defaultProps = {
  roomName: undefined,
};

export default AdminEventModal;
