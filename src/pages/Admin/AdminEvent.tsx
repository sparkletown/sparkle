import React, { useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { VenueEvent } from "types/VenueEvent";
import dayjs from "dayjs";
import * as Yup from "yup";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { createEvent, EventInput, updateEvent } from "api/admin";
import { WithId } from "utils/id";
dayjs.extend(isSameOrAfter);

interface PropsType {
  show: boolean;
  onHide: () => void;
  venueId: string;
  event?: WithId<VenueEvent>;
  template?: string;
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
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .default(0),
  host: Yup.string().required(),
  room: Yup.string(),
});

const AdminEvent: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  venueId,
  event,
  template,
}) => {
  const { register, handleSubmit, errors, formState, reset } = useForm<
    EventInput
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
  });

  useEffect(() => {
    if (!event) {
      reset({});
    } else {
      reset({
        name: event.name,
        description: event.description,
        start_date: dayjs.unix(event.start_utc_seconds).format("YYYY-MM-DD"),
        start_time: dayjs.unix(event.start_utc_seconds).format("HH:mm"),
        duration_hours: event.duration_minutes / 60,
      });
    }
  }, [event, reset]);

  const onSubmit = useCallback(
    async (data: EventInput) => {
      const start = dayjs(`${data.start_date} ${data.start_time}`);
      const formEvent: VenueEvent = {
        name: data.name,
        description: data.description,
        start_utc_seconds: start.unix(),
        duration_minutes: data.duration_hours * 60,
        price: 0,
        collective_price: 0,
        host: data.host,
      };
      if (template === "themecamp") formEvent.room = data.room;
      if (event) {
        await updateEvent(venueId, event.id, formEvent);
      } else {
        await createEvent(venueId, formEvent);
      }
      onHide();
    },
    [event, onHide, venueId, template]
  );
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
            <input
              type="date"
              min={dayjs().format("YYYY-MM-DD")}
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
          {template === "themecamp" && (
            <div className="input-group">
              <label htmlFor="room">Room your event is in</label>
              <input
                id="room"
                name="room"
                className="input-block input-centered"
                placeholder="Cuddle Puddle"
                ref={register}
              />
              {errors.host && (
                <span className="input-error">{errors.host.message}</span>
              )}
            </div>
          )}
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value={event ? "Update" : "Create"}
            disabled={formState.isSubmitting}
          />
        </form>
      </div>
    </Modal>
  );
};

export default AdminEvent;
